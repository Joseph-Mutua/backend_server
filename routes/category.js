const express = require("express");
const router = express.Router();

//Middleware
const { authCheck, adminCheck } = require("../middleware/auth");

//Controller
const { create, read, update, remove, list, getSubCategories } = require("../controllers/category");

//Routes
router.post("/category", authCheck, adminCheck, create)
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subcategories/:id", getSubCategories)

module.exports = router;