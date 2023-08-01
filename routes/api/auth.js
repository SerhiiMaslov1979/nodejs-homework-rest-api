const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/userModel");
const { nanoid } = require("nanoid");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    const verificationToken = nanoid();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    const msg = {
      to: email,
      from: "maslov.ser.vas@gmail.com",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: `<a href='http://localhost:3000/api/users/verify/${verificationToken}'>Click</a>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user.verify) {
      return res.status(401).json({ message: "User not verify" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/verify/:verificationToken", async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.verify = true;
  user.verificationToken = null;
  user.save();
  res.json({ message: "Verification successful" });
});

router.get("/verify", async (req, res) => {
  const { email } = req.body;

  if (email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  const user = await User.findOne({ email });

  if (!user.verify) {
    const verificationToken = nanoid();

    const msg = {
      to: email,
      from: "maslov.ser.vas@gmail.com",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: `<a href='http://localhost:3000/api/users/verify/${verificationToken}'>Click</a>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    return res.json({ message: "Verification email sent" });
  }
  return res
    .status(400)
    .json({ message: "Verification has already been passed" });
});

module.exports = router;
