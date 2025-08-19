const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Controller
const UserController = require("../Controllers/UserControllers");

// Routes
router.get("/", UserController.getAllUsers);

// POST route with file upload
router.post(
  "/",
  upload.array("Attach_Files", 5), // up to 5 files
  UserController.addUsers
);

router.get("/:id", UserController.getById);
router.put("/:id", upload.array("Attach_Files", 5), UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
