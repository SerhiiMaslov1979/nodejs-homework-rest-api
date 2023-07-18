const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

// const jwt = require("jsonwebtoken");
// const { HttpError } = require("../helpers/HttpError");
// const { User } = require("../models/userModel");

// const authMiddleware = async (req, res, next) => {
//   const { authorization = "" } = req.headers;
//   const [bearer, token] = authorization.split(" ");

//   if (bearer !== "Bearer") {
//     next(new HttpError(401, "Unauthorized"));
//   }

//   try {
//     const { id } = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(id);
//     if (!user || user.token !== token) {
//       next(new HttpError(401, "Unauthorized"));
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     next(new HttpError(401, "Unauthorized"));
//   }
// };

// module.exports = authMiddleware;
