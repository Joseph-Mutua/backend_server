const User = require("../models/user");
const Cart = require("../models/user");
const Product = require("../models/user");
const Coupon = require("../models/coupon");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  //Apply Coupon
  const { couponApplied } = req.body;

  //Calculate Price

  //Find user
  const user = await User.findOne({ email: req.user.email }).exec();

  //Get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = Math.round(totalAfterDiscount * 100);
  } else {
    finalAmount = Math.round(cartTotal * 100);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: cartTotal * 100,
    currency: "usd",
  });

  console.log("CREATE PAYMENT ERROR", paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
