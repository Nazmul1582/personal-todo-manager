const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  readJsonFile,
  FILES,
  writeJsonFile,
  getUserByUsername,
} = require("../utils/fileUtil");

router.post("/signup", async (req, res) => {
  try {
    let { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    password = String(password).trim();

    if (password && password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });

    const isUsernameExist = await getUserByUsername(username);

    if (isUsernameExist)
      return res
        .status(400)
        .json({ success: false, message: "username already exist" });

    const uuid = crypto.randomUUID();
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = {
      id: uuid,
      username: username.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await writeJsonFile(FILES.USERS_FILE, user);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Signup error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body || {};
    username = username.trim();
    password = String(password).trim();
    const user = await getUserByUsername(username);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.cookie("userId", user.id, {
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
    console.log("Login error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.status(200).json({
    sccess: true,
    message: "Logout successful",
  });
});

module.exports = router;
