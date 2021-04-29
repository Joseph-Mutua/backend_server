const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

exports.userCart = async (req, res) => {
  let products = [];
  const { cart } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();

  //Check if cart with logged in user id already exists
  let cartExistsByThisUser = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  if (cartExistsByThisUser) {
    cartExistsByThisUser.remove();
    console.log("Removed old Cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;

    //Get Price for the total
    let productFromDb = await Product.findById(cart[i]._id)
      .select("price")
      .exec();

    object.price = productFromDb.price;

    products.push(object);
  }

  console.log("PRODUCT ARRAY TO SEND TO BACKEND", products);

  let cartTotal = 0;

  for (let i = 0; i < products.length; i++) {
    cartTotal += products[i].price * products[i].count;
  }

  console.log("CART TOTAL SEND TO BACKEND", cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  console.log("NEW CART", newCart);

  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;

  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();

  res.json(cart);
};

exports.saveUserAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("COUPON SEND FROM FRONTEND", coupon);

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();

  if (validCoupon === null) {
    return res.json({
      err: "Invalid Coupon",
    });
  }

  console.log("VALID COUPON", validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({
    orderedBy: user._id,
  })
    .populate("products.product", "_id title price")
    .exec();

  console.log(
    "cartTotal Before Coupon",
    cartTotal,
    "discount on coupon",
    validCoupon.discount
  );

  //CALCULATE TOTAL AFTER DISCOUNT
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  const paymentIntent = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  let newOrder = new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();

  //Decrement quantity, increment Sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, { new: true });

  console.log("PRODUCT QUANTTITY--, SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(userOrders);
};
