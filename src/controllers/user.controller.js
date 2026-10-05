const User = require("../models/user.model");
const Cart = require("../models/cart.model");

const getUserIdentifier = (req) => {
  return (
    req.user?.id ||
    req.query.guestId ||
    req.headers["x-guest-id"] ||
    req.body.guestId
  );
};
// Create user
// Create user
exports.createUser = async (req, res) => {
  try {
    const userId = getUserIdentifier(req);

    // 1. Correct query syntax
    let user = await User.findOne({ phone: req.body.phone });
    console.log("Existing User:", user);

    if (user) {
      console.log("User already exists");
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. Create and save new user
    const newUser = new User(req.body);
    await newUser.save();

    // 3. Safely update or create cart
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.user = newUser._id;
      await cart.save();
    } else {
      cart = await Cart.create({ user: newUser._id });
    }
    console.log("Updated Cart:", cart);

    // 4. Return correct newUser object
    res
      .status(201)
      .json({ message: `welcome ${newUser.name}!`, user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update user by id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user by id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
