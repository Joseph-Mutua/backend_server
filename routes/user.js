const express = require("express");
const { authCheck } = require("../middleware/auth");

const { userCart } = require("../controllers/user");

const router = express.Router();

router.post("/cart", authCheck, userCart);

module.exports = router;
