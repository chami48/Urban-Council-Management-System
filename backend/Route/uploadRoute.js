const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "..", "uploads", "licenses")),
  filename: (_, file, cb) => cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({ storage });
module.exports = { upload };
