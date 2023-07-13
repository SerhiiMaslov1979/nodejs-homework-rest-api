const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Модель User
const User = require("../../models/userModel");

// Ендпоінт /users/login
router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Валідація даних
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Пошук користувача за email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Порівняння паролів
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Якщо паролі збігаються, створюємо токен (для спрощення використаємо фіктивний токен)
    const token = "exampletoken";

    // Збереження токена у користувача
    user.token = token;
    await user.save();

    // Відправка успішної відповіді разом з токеном та інформацією про користувача
    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
