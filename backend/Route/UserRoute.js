const express = require('express');
const router = express.Router();
//Insert model
const User =  require("../Model/UserModel");
//Insert user Controller
const UserControler = require("../controller/UserControler");

router.get("/",UserControler.getAllUsers);
router.post("/",UserControler.addUsers);
router.get("/:id",UserControler.getById);
router.put("/:id",UserControler.updateUser);
router.delete("/:id",UserControler.deleteUser);
router.patch("/update-status/:id", UserControler.updateBookingStatus);


module.exports = router;