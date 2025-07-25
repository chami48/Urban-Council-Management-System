const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    cardHolderName: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
    cardType: {
        type: String,
        enum: ["Visa", "MasterCard", "CreditCard", "DebitCards"],
        default: "Visa"
    }
});

module.exports = mongoose.model("Card", cardSchema);
