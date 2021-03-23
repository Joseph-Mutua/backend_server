const express = require("express");
const router = express.Router();

//Middleware
const { authCheck, adminCheck } = require("../middleware/auth");

//Controller
const { create, read } = require("../controllers/product");

//Routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products", read);

module.exports = router;