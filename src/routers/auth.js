const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../models/User");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "Registered successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = await user.getJwt();
    res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error:" + err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(200).json({ message: "Logout Succesfully!!" });
  } catch (err) {
    res.status(500).json({ error: "Server error:" + err.message });
  }
});

module.exports = authRouter;
