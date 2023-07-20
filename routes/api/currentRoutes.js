const express = require("express");
const { getCurrentUser } = require("../../controllers/userController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCurrentUser);

module.exports = router;
