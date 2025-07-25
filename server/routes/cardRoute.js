const express = require("express");
const router = express.Router();

const cardController = require("../controller/cardController");

router.get("/", cardController.getAllCards);
router.post("/", cardController.addCard);
router.get("/:id", cardController.getById);
router.put("/:id", cardController.updateCard);
router.delete("/:id", cardController.deleteCard);

module.exports = router;
