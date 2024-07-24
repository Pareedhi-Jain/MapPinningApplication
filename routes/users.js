const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Generate a new salt for hashing the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user instance with the provided username, email, and hashed password
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the new user to the database and respond with the user's ID
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    // Log the error and respond with a 500 status code and error message
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // Find the user by the provided username
    const user = await User.findOne({ username: req.body.username });
    // If the user is not found, respond with a 400 status code and error message
    if (!user) {
      return res.status(400).json("Wrong username");
    }

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    // If the password is invalid, respond with a 400 status code and error message
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    // If the username and password are correct, respond with the user's ID and username
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    // Respond with a 500 status code and error message in case of an error
    res.status(500).json(err);
  }
});

module.exports = router;
