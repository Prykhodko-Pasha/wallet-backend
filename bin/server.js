const mongoose = require("mongoose");
const app = require("../app");

const { DB_HOST, PORT = 3001 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, async () => {
      const TMP_DIR = process.env.TMP_DIR;
    const AVATAR_URL = process.env.AVATAR_URL;
    await createFolderIsExist(TMP_DIR);
    await createFolderIsExist(AVATAR_URL);
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
