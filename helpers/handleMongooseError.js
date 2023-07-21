function handleDuplicateKeyError(error, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Email is already in use"));
  } else {
    next(error);
  }
}

module.exports = {
  handleDuplicateKeyError,
};
