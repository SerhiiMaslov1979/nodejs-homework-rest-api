const { User } = require("../models/userModel");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
      res.json({
        email: user.email,
        subscription: user.subscription,
      });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getCurrentUser };
