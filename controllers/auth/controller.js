import { request, response } from "express";
import pool from "../../mysql/sql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT = 10;

//This function registers new user
//Returns message and the new registered user ID
const register = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please provide all required fields" });
    return;
  }

  try {
    //First hash the password
    const hashedPassword = await bcrypt.hash(password, SALT);
    //SQL INSERT QUERY
    const insertUserQuery =
      "INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)";
    const values = [name, email, hashedPassword];
    const result = await pool.query(insertUserQuery, values);
    //Respond with the new created user ID and message
    const userId = result[0].insertId;
    const message = "User registered successfully";
    res.status(201).json({ message, userId });
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Please provide all required fields." });
    return;
  }

  try {
    //Find user with email, don't include the password on selecting
    const selectUserQuery =
      "SELECT user_id, user_name, user_email, created_at FROM users WHERE email = ?";
    const result = await pool.query(selectUserQuery, [email]);

    const user = result[0];
    //Check if there are no result
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    //Compare the password to hashed password
    const isMatch = await bcrypt.compare(password, user.user_password);

    //Check if not match
    if (!isMatch) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    //Generate jwt token
    const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: "1d" });

    //add token to cookies
    res.cookie("token", token, { httpOnly: true, secure: true });
    //Send success message
    res.status(200).json({ message: "Authentication Successful" });
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

//Check if the current user have an active cookie
const verifyUser = (req = request, res = response, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    //verify the decoded token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //Set the decoded user
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};

const authenticateUser = (req = request, res = response) => {
  return res.status(200).json(req.user);
};

const AuthController = {
  register,
  login,
  verifyUser,
  authenticateUser,
};

export default AuthController;
