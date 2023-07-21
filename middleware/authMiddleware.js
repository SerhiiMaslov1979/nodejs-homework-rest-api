const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    req.token = token;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
