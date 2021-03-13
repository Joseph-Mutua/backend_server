const express = require("express")

const router = express.Router();

//Routes
router.get("/user", (req, res) => {
  req.body;
  res.json({
    data: "Hey you hit user API endpoint",
  });
});

module.exports = router;