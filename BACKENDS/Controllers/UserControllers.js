const User = require("../Model/UserModel");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add user with file uploads
const addUsers = async (req, res) => {
  const {
    NatureofComplaint,
    Name,
    NIC_Number,
    Email,
    Phone_Number,
    Address,
    Location,
    Grama_Niladhari_Division,
    Description,
  } = req.body;

  const filePaths = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const user = new User({
      NatureofComplaint,
      Name,
      NIC_Number,
      Email,
      Phone_Number,
      Address,
      Location,
      Grama_Niladhari_Division,
      Attach_Files: filePaths,
      Description,
    });

    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get by ID
const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const {
    NatureofComplaint,
    Name,
    NIC_Number,
    Email,
    Phone_Number,
    Address,
    Location,
    Grama_Niladhari_Division,
    Description,
  } = req.body;

  const filePaths = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        NatureofComplaint,
        Name,
        NIC_Number,
        Email,
        Phone_Number,
        Address,
        Location,
        Grama_Niladhari_Division,
        Attach_Files: filePaths.length ? filePaths : undefined,
        Description,
      },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "Unable to update user" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Unable to delete user" });
    res.status(200).json({ message: "User deleted", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUsers, addUsers, getById, updateUser, deleteUser };
