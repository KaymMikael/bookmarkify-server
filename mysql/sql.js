import sql from "mysql2/promise";
import { DATABASE_CONFIG } from "../config.js";

const pool = sql.createPool(DATABASE_CONFIG);

async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}

checkConnection();

export default pool;
