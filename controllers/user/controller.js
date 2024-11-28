import { request, response } from "express";
import pool from "../../mysql/sql.js";
import bcrypt from "bcrypt";

const SALT = 10;

//This function registers new user
//Returns message and the new registered user ID
const registerUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please provide all required fields" });
    return;
  }

  try {
    //First hash the password
    const hashedPassword = await bcrypt.hash(password, SALT);
    //SQL INSERT QUERY
    const insertQuery =
      "INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)";
    const values = [name, email, hashedPassword];
    const result = await pool.query(insertQuery, values);
    //Respond with the new created user ID and message
    const userId = result[0].insertId;
    const message = "User registered successfully";
    res.status(201).json({ message, userId });
    return;
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const UserController = {
  registerUser,
};

export default UserController;
