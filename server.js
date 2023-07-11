const app = require("./app");
const { DB_HOST, PORT = 3000 } = process.env;

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });

const mongoose = require("mongoose");

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
