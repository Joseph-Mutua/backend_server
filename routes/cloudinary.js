const express = require("express");
const router = express.Router();

//Middleware
const { authCheck, adminCheck } = require("../middleware/auth");

//Controller
const {uploadImages, removeImages} = require("../controllers/cloudinary");


//Routes
router.post("/uploadimages", authCheck, adminCheck, uploadImages);
router.post("/removeimage", authCheck, adminCheck, removeImages)

module.exports = router;