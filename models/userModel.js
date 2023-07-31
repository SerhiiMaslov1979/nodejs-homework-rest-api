const { Schema, model } = require("mongoose");
const Joi = require("joi");
const gravatar = require("gravatar");

const { handleDuplicateKeyError } = require("../helpers/handleMongooseError");

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", function (error, doc, next) {
  handleDuplicateKeyError(error, next);
});

userSchema.pre("save", function (next) {
  if (!this.avatarURL) {
    this.avatarURL = gravatar.url(this.email, {
      s: "200",
      r: "pg",
      d: "identicon",
    });
  }
  next();
});

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(6).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("User", userSchema);

module.exports = {
  User,
  schemas,
};
