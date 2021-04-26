const express = require("express");
const { authCheck } = require("../middleware/auth");

const { userCart, getUserCart, emptyCart, saveUserAddress, applyCouponToUserCart } = require("../controllers/user");

const router = express.Router();


router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveUserAddress);

//Coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart)

module.exports = router;
