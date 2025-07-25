const Card = require("../models/cardmodel");

// Get all cards
const getAllCards = async (req, res, next) => {
    try {
        const cards = await Card.find();
        return res.status(200).json({ cards });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Add card
const addCard = async (req, res, next) => {
    const { cardHolderName, cardNumber, expiryDate, cvv, cardType } = req.body;

    try {
        const card = new Card({ cardHolderName, cardNumber, expiryDate, cvv, cardType });
        await card.save();
        return res.status(201).json({ card });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to add card" });
    }
};

// Get card by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const card = await Card.findById(id);
        if (!card) return res.status(404).send({ message: "Card not found" });
        return res.status(200).json({ card });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching card" });
    }
};

// Update card
const updateCard = async (req, res, next) => {
    const id = req.params.id;
    const { cardHolderName, cardNumber, expiryDate, cvv, cardType } = req.body;

    try {
        const card = await Card.findByIdAndUpdate(
            id,
            { cardHolderName, cardNumber, expiryDate, cvv, cardType },
            { new: true }
        );
        if (!card) return res.status(404).send({ message: "Unable to update card" });
        return res.status(200).json({ card });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating card" });
    }
};

// Delete card
const deleteCard = async (req, res, next) => {
    const id = req.params.id;

    try {
        const card = await Card.findByIdAndDelete(id);
        if (!card) return res.status(404).send({ message: "Unable to delete card" });
        return res.status(200).json({ card });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting card" });
    }
};

module.exports = { getAllCards, addCard, getById, updateCard, deleteCard };
