// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");

// const User = require("../../models/userModel");

// router.post("/", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Email or password is wrong" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Email or password is wrong" });
//     }
//     const token = "exampletoken";
//     user.token = token;
//     await user.save();
//     res.json({
//       token,
//       user: { email: user.email, subscription: user.subscription },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/userModel");

const SECRET = "my-secret-key";

router.post("/", async (req, res, next) => {
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1h" });
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
    next(error);
  }
});

module.exports = router;
