const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts"); // Імпортуйте ваш модуль contact.js
const Joi = require("joi");

// Схема валідації для створення нового контакту
const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

// Раут для отримання всіх контактів
router.get("/", async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
});

// Раут для отримання контакту за id
router.get("/:id", async (req, res) => {
  const contactId = req.params.id;
  const contact = await contacts.getContactById(contactId);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// Раут для створення нового контакту
router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  // Валідація даних
  const { error } = createContactSchema.validate({ name, email, phone });

  if (error) {
    // Обробка помилки валідації
    res.status(400).json({ message: error.details[0].message });
  } else {
    // Дані є валідними, виконуємо логіку
    const newContact = await contacts.addContact(name, email, phone);
    res.status(201).json(newContact);
  }
});

// Раут для видалення контакту за id
router.delete("/:id", async (req, res) => {
  const contactId = req.params.id;
  const deletedContact = await contacts.removeContact(contactId);

  if (deletedContact) {
    res.json({ message: "Contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// Раут для оновлення контакту за id
router.put("/:id", async (req, res) => {
  const contactId = req.params.id;
  const updatedFields = req.body;

  if (!Object.keys(updatedFields).length) {
    res.status(400).json({ message: "Missing fields" });
  } else {
    const updatedContact = await contacts.updateContact(
      contactId,
      updatedFields
    );

    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }
});

module.exports = router;
