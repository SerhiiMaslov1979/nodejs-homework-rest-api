// const { User } = require("../models/userModel");
// const multer = require("multer");
// const path = require("path");

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "public/avatars");
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const ext = path.extname(file.originalname);
//       cb(null, uniqueSuffix + ext);
//     },
//   }),
// });

// const getCurrentUser = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const user = await User.findById(userId);

//     if (user) {
//       res.json({
//         email: user.email,
//         subscription: user.subscription,
//         avatarURL: user.avatarURL,
//       });
//     } else {
//       res.status(401).json({ message: "Not authorized" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const updateUserAvatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No avatar uploaded" });
//     }

//     const { filename } = req.file;

//     req.user.avatarURL = `/avatars/${filename}`;
//     await req.user.save();

//     res.json({ avatarURL: req.user.avatarURL });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { getCurrentUser, updateUserAvatar, upload };
// 2
// const { User } = require("../models/userModel");
// const multer = require("multer");
// const path = require("path");
// const jimp = require("jimp");
// const fs = require("fs/promises");

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "tmp");
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const ext = path.extname(file.originalname);
//       cb(null, uniqueSuffix + ext);
//     },
//   }),
// });

// const getCurrentUser = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const user = await User.findById(userId);

//     if (user) {
//       res.json({
//         email: user.email,
//         subscription: user.subscription,
//         avatarURL: user.avatarURL,
//       });
//     } else {
//       res.status(401).json({ message: "Not authorized" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const updateUserAvatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No avatar uploaded" });
//     }

//     const { filename } = req.file;
//     const avatarPath = path.join("tmp", filename); // Шлях до тимчасового файлу аватарки

//     // Обробка зображення за допомогою пакету jimp
//     const image = await jimp.read(avatarPath);
//     await image.cover(250, 250);

//     // Генерація унікального імені для аватарки та шлях до нового файлу
//     const uniqueAvatarFilename = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}.png`;
//     const avatarDestination = path.join(
//       "public",
//       "avatars",
//       uniqueAvatarFilename
//     );

//     // Збереження обробленої аватарки
//     await image.writeAsync(avatarDestination);

//     // Видалення тимчасового файлу
//     await fs.unlink(avatarPath);

//     // Збереження URL аватарки в поле avatarURL користувача
//     req.user.avatarURL = `/avatars/${uniqueAvatarFilename}`;
//     await req.user.save();

//     res.json({ avatarURL: req.user.avatarURL });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { getCurrentUser, updateUserAvatar, upload };
// 3
const { User } = require("../models/userModel");
const multer = require("multer");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs/promises");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "tmp");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
});

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
      res.json({
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar uploaded" });
    }

    const { filename } = req.file;
    const avatarPath = path.join("tmp", filename); // Шлях до тимчасового файлу аватарки

    // Обробка зображення за допомогою пакету jimp
    const image = await jimp.read(avatarPath);
    await image.cover(250, 250);

    // Генерація унікального імені для аватарки
    const uniqueAvatarFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;

    // Шлях до нового файлу аватарки
    const avatarDestination = path.join(
      "public",
      "avatars",
      uniqueAvatarFilename
    );

    // Збереження обробленої аватарки
    await image.writeAsync(avatarDestination);

    // Видалення тимчасового файлу
    await fs.unlink(avatarPath);

    // Збереження URL аватарки в поле avatarURL користувача
    req.user.avatarURL = `/avatars/${uniqueAvatarFilename}`;
    await req.user.save();

    res.json({ avatarURL: req.user.avatarURL });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getCurrentUser, updateUserAvatar, upload };
