const User = require("../models/user");
const Cart = require("../models/user");
const Product = require("../models/user");
const Coupon = require("../models/coupon");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  //Apply Coupon

  //Calculate Price

  //Find user
  const user = await User.findOne({ email: req.user.email }).exec();

  //Get user cart total
  const { cartTotal } = await Cart.findOne({ orderedBy: user._id }).exec();

  console.log("CART TOTAL CHARGED", cartTotal);
  //Create payment intent with order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: cartTotal * 100,
    currency: "usd",
  });

  console.log("CREATE PAYMENT ERROR", paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
