const express = require("express");
const { authCheck } = require("../middleware/auth");

const { userCart, getUserCart, emptyCart } = require("../controllers/user");

const router = express.Router();

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);

module.exports = router;
