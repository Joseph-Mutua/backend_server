const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  let products = [];

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
    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;

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

  let cart = await Cart.findOne({ orderedBy: user._id }).populate(
    "products.product",
    "_id title price totalAfterDiscount"
  ).exec();

  const {products, cartTotal, totalAfterDiscount} = cart;

  res.json({ products, cartTotal, totalAfterDiscount });
};
