const mongoose = require("mongoose");
const contactSchema = require("./contactSchema");

const Contact = mongoose.model("Contact", contactSchema);

async function listContacts() {
  return Contact.find();
}

async function getContactById(contactId) {
  return Contact.findById(contactId);
}

async function removeContact(contactId) {
  return Contact.findByIdAndRemove(contactId);
}

async function addContact(name, email, phone) {
  return Contact.create({ name, email, phone });
}

async function updateContact(contactId, updatedFields) {
  return Contact.findByIdAndUpdate(contactId, updatedFields, {
    new: true,
  });
}

async function updateStatusContact(contactId, favorite) {
  return Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
