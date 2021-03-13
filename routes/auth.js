const express = require("express")

const router = express.Router();

//Routes
router.get("/create-or-update-user", (req, res) => {
  req.body;
  res.json({
    data: "Hey you hit Create or update user API endpoint",
  });
});

module.exports = router;