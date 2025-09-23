// backend/Route/UserRoute.js
const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserControllers");

const requireAuth = require("../middleware/requireAuth");

router.post("/", UserController.addUsers);


router.get("/", requireAuth, UserController.getAllUsers);
router.get("/:id", requireAuth, UserController.getById);
router.put("/:id", requireAuth, UserController.updateUser);
router.delete("/:id", requireAuth, UserController.deleteUser);

module.exports = router;
