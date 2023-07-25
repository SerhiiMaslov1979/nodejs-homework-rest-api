// const express = require("express");
// const { updateUserAvatar } = require("../../controllers/userController");
// const authMiddleware = require("../../middleware/authMiddleware");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "tmp"); // Зберігаємо тимчасово завантажену аватарку у папку tmp
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const ext = path.extname(file.originalname);
//       cb(null, uniqueSuffix + ext);
//     },
//   }),
// });

// router.patch(
//   "/avatars",
//   authMiddleware,
//   upload.single("avatar"),
//   updateUserAvatar
// );

// module.exports = router;

const express = require("express");
const { updateUserAvatar } = require("../../controllers/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "tmp"); // Зберігаємо тимчасово завантажену аватарку у папку tmp
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
});

router.patch("/", authMiddleware, upload.single("avatar"), updateUserAvatar);

module.exports = router;
