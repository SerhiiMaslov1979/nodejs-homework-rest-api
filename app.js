// const express = require("express");
// const logger = require("morgan");
// const cors = require("cors");
// require("dotenv").config();

// const usersRegisterRouter = require("./routes/api/users-register");
// const usersLoginRouter = require("./routes/api/users-login");
// const contactsRouter = require("./routes/api/contacts");

// const app = express();

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// app.use(logger(formatsLogger));
// app.use(cors());
// app.use(express.json());

// app.use("/api/users/register", usersRegisterRouter);
// app.use("/api/users/login", usersLoginRouter);
// app.use("/api/contacts", contactsRouter);

// app.use((req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

// module.exports = app;
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const usersAuthRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersAuthRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/contacts", authMiddleware, contactsRouter);

// Захищений маршрут, доступний тільки з валідним токеном
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
