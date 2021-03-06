const express = require("express");
const { authCheck } = require("../middleware/auth");

const {
  userCart,
  getUserCart,
  emptyCart,
  saveUserAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist
} = require("../controllers/user");

const router = express.Router();

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveUserAddress);

//Orders
router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, orders)

//Coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

//Wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);


module.exports = router;
