const Coupon = require("../models/coupon");

//Create, Remove, list

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    res.json(await new Coupon({ name, expiry, discount }).save());
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    console.log(err);
  }
};

exports.remove = async (req, res) => {
  try {
    let couponId = req.params.couponId;
    res.json(await Coupon.findByIdAndDelete(couponId).exec());
  } catch (err) {
    console.log(err);
  }
};
