const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const { User } = require("../../models/userModel");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
