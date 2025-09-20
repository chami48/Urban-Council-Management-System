// backend/controller/UserControllers.js
const User = require("../Model/UserModel");
const { newSession, destroySession, getSession } = require("../sessionLite");

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching users" });
  }
};


const addUsers = async (req, res) => {
  const { name, email, password, address, phone, role } = req.body;
  try {
    const user = new User({ name, email, password, address, phone, role }); 
    await user.save();
    return res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Unable to add user" });
  }
};


// GET /users/:id
const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ messsage: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting user" });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password, address, phone, role } = req.body;

  const update = {};
  if (name      !== undefined) update.name = name;
  if (email     !== undefined) update.email = email;
  if (password  !== undefined) update.password = password;
  if (address   !== undefined) update.address = address;
  if (phone     !== undefined) update.phone = phone;
  if (role      !== undefined) update.role = role; // only use if you control the caller

  try {
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "Unable to update details" });
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Unable to update details" });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ messsage: "Unable to Delete User Details" });
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting user" });
  }
};

// POST /auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid email or password" });

    // create minimal user payload for the session
    const u = { _id: user._id.toString(), name: user.name, email: user.email, role: user.role };

    // create session (1h)
    const sid = newSession(u, 60 * 60 * 1000);

    // set HttpOnly cookie manually
    res.setHeader("Set-Cookie", [
      `sid=${encodeURIComponent(sid)}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
    ]);

    return res.json({ user: u });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Login error" });
  }
};

// GET /auth/me
const me = (req, res) => {
  const sid = req.cookies?.sid;
  const sess = sid ? getSession(sid) : null;
  if (!sess) return res.status(401).json({ message: "Unauthenticated" });
  return res.json({ user: sess.user });
};

// POST /auth/logout
const logout = (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) destroySession(sid);
  res.setHeader("Set-Cookie", `sid=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return res.json({ message: "Logged out" });
};


module.exports = {
  getAllUsers,
  addUsers,
  getById,
  updateUser,
  deleteUser,
  loginUser,
  loginUser,
  me,
  logout,
};
