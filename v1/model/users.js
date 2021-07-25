const mongoose = require("mongoose");

const user = new mongoose.Schema({
  fullname: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
    dropDups: true
  },
  email: {
    required: true,
    type: String,
    unique: true,
    dropDups: true
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("users", user);
