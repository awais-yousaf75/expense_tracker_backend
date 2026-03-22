import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.config.js";

async function startServer() {
  try {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error.message);
    process.exit(1);
  }
}

startServer();
