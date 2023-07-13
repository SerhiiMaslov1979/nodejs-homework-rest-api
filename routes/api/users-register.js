const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../../models/userModel");

// POST /users/register
router.post("/", async (req, res) => {
  try {
    // Отримайте дані з запиту (email і password)
    const { email, password } = req.body;

    // Виконайте валідацію даних
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Перевірте, чи вказаний email вже використовується
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    // Зашифруйте пароль перед збереженням в базі даних
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створіть нового користувача за даними, які пройшли валідацію
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Збережіть користувача в базі даних
    await newUser.save();

    // Поверніть успішну відповідь з кодом 201
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    // Обробіть помилки, якщо вони виникнуть
    res.status(500).json({ message: "Registration failed" });
  }
});

module.exports = router;
