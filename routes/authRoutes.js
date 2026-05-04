const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const router = express.Router();
const { getUserByUsername, createUser } = require("../utils/fileUtil");

router.post("/signup", async (req, res) => {
  try {
    let { username, password } = req.body || {};

    username = String(username).trim().toLowerCase();
    password = String(password).trim();

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (username.length < 3)
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
      });

    if (password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });

    const existingUser = await getUserByUsername(username);
    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });

    const uuid = crypto.randomUUID();
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = {
      id: uuid,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await createUser(user);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body || {};

    username = String(username).trim();
    password = String(password).trim();

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await getUserByUsername(username);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    res.cookie("userId", user.id, {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("userId", {
    signed: true,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

module.exports = router;
