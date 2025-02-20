const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const usersAuthRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");
const logoutRouter = require("./routes/api/logoutRoutes");
const usersCurrentRouter = require("./routes/api/currentRoutes");
const avatarRoutes = require("./routes/api/avatarRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users/logout", logoutRouter);
app.use("/api/users/current", usersCurrentRouter);
app.use("/api/users/avatars", authMiddleware, avatarRoutes);

app.use("/api/users", usersAuthRouter);

app.use("/api/contacts", authMiddleware, contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
