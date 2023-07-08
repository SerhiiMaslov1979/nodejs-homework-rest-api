const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts");
const Joi = require("joi");

// Схема валідації для створення нового контакту
const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
});

router.get("/:id", async (req, res) => {
  const contactId = req.params.id;
  const contact = await contacts.getContactById(contactId);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

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

router.delete("/:id", async (req, res) => {
  const contactId = req.params.id;
  const deletedContact = await contacts.removeContact(contactId);

  if (deletedContact) {
    res.json({ message: "Contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

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

router.patch("/:id/favorite", async (req, res) => {
  const contactId = req.params.id;
  const { favorite } = req.body;

  if (typeof favorite === "undefined") {
    res.status(400).json({ message: "missing field favorite" });
  } else {
    try {
      const updatedContact = await contacts.updateStatusContact(
        contactId,
        favorite
      );

      if (updatedContact) {
        res.json(updatedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
