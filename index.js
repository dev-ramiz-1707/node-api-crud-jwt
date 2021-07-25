const express = require("express");
const app = require("express")();
const packagejson = require("./package.json");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const login_signup = require("./v1/login-signup");
const products = require("./v1/products");
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");

dotEnv.config();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// to get package info
app.get("/info", (req, res) => {
  res.send(packagejson);
});

// to get "Have Good Day!"
app.get("/", (req, res) => {
  res.send("Have Good Day!");
});

// Login/Signup API
app.use("/v1", login_signup);

// Product Crud
app.use("/v1", verifyToken, products);

// database connection
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connect to db"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Connected successfully..!");
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else {
    res.status(403).json({
      message: "bearerToken not found.",
    });
  }
}
