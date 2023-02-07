const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const {readdirSync} = require("fs");
const dotenv = require("dotenv"); 
dotenv.config();


//app
const app = express();

// database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    strictQuery: true
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(`DB connection error: ${err.message}`);
  });

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());

//Routes middleware
// app.use("/api", authRoutes)

readdirSync("./routes").map((route)=>{
  app.use("/api", require("./routes/" + route))
})

//Port
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});