// backend/Route/AuthRoute.js
const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserControllers");

router.post("/login", UserController.loginUser);
router.get("/me", UserController.me);
router.post("/logout", UserController.logout);

module.exports = router;
