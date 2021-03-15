const express = require("express");
const router = express.Router();
const { createOrUpdateUser, currentUser } = require("../controllers/auth");

//Middleware
const { authCheck } = require("../middleware/auth");

//Routes
router.post("/create-or-update-user", authCheck, createOrUpdateUser);

router.post("/current-user", authCheck, currentUser);

module.exports = router;