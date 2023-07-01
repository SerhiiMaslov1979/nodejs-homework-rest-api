const contacts = require("./models/contacts");
const argv = require("yargs").argv;

const invokeAction = async ({ action, id, name, email, phone }) => {
  let result;

  switch (action) {
    case "list":
      result = await contacts.listContacts();
      console.table(result);
      break;

    case "get":
      result = await contacts.getContactById(id);
      if (result) {
        console.log(result);
      } else {
        console.log("Contact not found");
      }
      break;

    case "add":
      result = await contacts.addContact(name, email, phone);
      console.log("New contact added:", result);
      break;

    case "update":
      result = await contacts.updateContact(id, { name, email, phone });
      if (result) {
        console.log("Contact updated:", result);
      } else {
        console.log("Contact not found");
      }
      break;

    case "remove":
      result = await contacts.removeContact(id);
      if (result) {
        console.log("Contact deleted:", result);
      } else {
        console.log("Contact not found");
      }
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
};

invokeAction(argv);
