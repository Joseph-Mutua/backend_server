const express = require("express");
const router = express.Router();
const { createOrUpdateUser } = require("../controllers/auth");

//Middleware
const { authCheck } = require("../middleware/auth");

//Routes
router.post("/create-or-update-user", authCheck, createOrUpdateUser);

module.exports = router;
