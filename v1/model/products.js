const mongoose = require("mongoose");

const product = new mongoose.Schema({
    pname : {
        required: true,
        type: String
    },
    type : {
        required: true,
        type: String
    },
    regular_price : {
        required: true,
        type: String
    },
    description : {
        required: true,
        type: String
    },
    short_description : {
        required: false,
        type: String
    },
    image : {
        required: false,
        type: String
    }
})

module.exports = mongoose.model("products", product);