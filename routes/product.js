const express = require("express");
const router = express.Router();

//Middleware
const { authCheck, adminCheck } = require("../middleware/auth");

//Controller
const { create, listAll, remove, read, update } = require("../controllers/product");

//Routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update)

module.exports = router;