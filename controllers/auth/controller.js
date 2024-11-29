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
    const [result] = await pool.query(insertUserQuery, values);

    //Respond with the new created user ID and message
    const userId = result.insertId;
    const message = "User registered successfully";
    res.status(201).json({ message, userId });
    return;
  } catch (e) {
    console.error(e);
    // Check for duplicate entry
    if (e.code === "ER_DUP_ENTRY") {
      if (e.message.includes("users.user_name")) {
        return res.status(409).json({ error: "Username already exists" });
      } else if (e.message.includes("users.user_email")) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

/* This function adds a signed jwt cookie to the user */
const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Please provide all required fields." });
    return;
  }

  try {
    //Find user with email, don't include the password on selecting
    const selectUserQuery = "SELECT * FROM users WHERE user_email = ?";
    const [result] = await pool.query(selectUserQuery, [email]);

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

    // Create a new object excluding the password
    const userWithoutPassword = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      created_at: user.created_at,
    };

    //Generate jwt token
    const token = jwt.sign(userWithoutPassword, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    //add token to cookies
    res.cookie("token", token, { httpOnly: true, secure: true });
    //Send success message
    res.status(200).json({ message: "Authentication Successful" });
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
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

//if the user is authenticated, return the user data
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
