import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

// Hardcode fallback - temp fix
const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://dbadmin:Shopping%23123@shopping-db.crcey428275y.ap-south-1.rds.amazonaws.com:5432/shoppingdb";

console.log("DATABASE_URL:", DATABASE_URL);

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
