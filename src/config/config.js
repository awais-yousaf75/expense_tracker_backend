import dotenv from "dotenv";

dotenv.config();

if(!process.env.PORT) {
  throw new Error("Error: PORT is not defined in the environment variables.");
}

if(!process.env.MONGO_URI) {
  throw new Error("Error: MONGO_URI is not defined in the environment variables.");
}

const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
};

export default config;