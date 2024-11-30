import pool from "../mysql/sql.js";

class User {
  constructor() {
    //Empty constructor
  }

  async insertUser(values) {
    const query =
      "INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)";
    const [result] = await pool.query(query, values);
    return result;
  }

  async getUserWithEmail(email) {
    const query = "SELECT * FROM users WHERE user_email = ?";
    const [result] = await pool.query(query, [email]);
    return result[0];
  }
}

const userInstance = new User();

export default userInstance;
