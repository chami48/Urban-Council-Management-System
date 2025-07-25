const Card = require("../models/cardmodel");

// Get all cards
const getAllCards = async (req, res, next) => {
    let cards;

    try {
        cards = await Card.find();
    } catch (err) {
        console.log(err);
    }

    if (!cards) {
        return res.status(404).json({ message: "Cards not found" });
    }

    return res.status(200).json({ cards });
};

// Add card
const addCard = async (req, res, next) => {
    const { name, gmail, age, address } = req.body;

    let card;

    try {
        card = new Card({ name, gmail, age, address });
        await card.save();
    } catch (err) {
        console.log(err);
    }

    if (!card) {
        return res.status(500).send({ message: "Unable to add card" });
    }

    return res.status(201).json({ card });
};

// Get card by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let card;

    try {
        card = await Card.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!card) {
        return res.status(404).send({ message: "Card not found" });
    }

    return res.status(200).json({ card });
};

// Update card
const updateCard = async (req, res, next) => {
    const id = req.params.id;
    const { name, gmail, age, address } = req.body;

    let card;

    try {
        card = await Card.findByIdAndUpdate(id, { name, gmail, age, address }, { new: true });
    } catch (err) {
        console.log(err);
    }

    if (!card) {
        return res.status(404).send({ message: "Unable to update card" });
    }

    return res.status(200).json({ card });
};

// Delete card
const deleteCard = async (req, res, next) => {
    const id = req.params.id;

    let card;

    try {
        card = await Card.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!card) {
        return res.status(404).send({ message: "Unable to delete card" });
    }

    return res.status(200).json({ card });
};

module.exports = { getAllCards, addCard, getById, updateCard, deleteCard };
