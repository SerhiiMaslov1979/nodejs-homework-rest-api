const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(1);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log(process.env.JWT_SECRET);
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    // carent user
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
