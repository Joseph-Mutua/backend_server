const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//app
const app = express();

// database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(`DB connection error: ${err.message}`);
  });

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json({}));
app.use(cors());

//Routes
app.get("/api", (req, res) => {
  req.body;
  res.json({
    data: "Hey you hit node API updated!!",
  });
});

//Port
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});