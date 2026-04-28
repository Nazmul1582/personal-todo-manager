const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const {
  getTodosByUserId,
  getUserById,
  createTodo,
} = require("../utils/fileUtil");

router.get("/", async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const user = await getUserById(userId);
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const todos = await getTodosByUserId(user.id);
    res.status(200).json({
      success: true,
      message: "Fetch data successfully",
      data: todos,
    });
  } catch (error) {
    console.log("todos error", error);

    res.status(400).json({});
  }
});

router.post("/create", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ message: "text is required" });

    const userId = req.cookies.userId;
    const user = await getUserById(userId);

    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const todo = {
      id: crypto.randomUUID(),
      userId: userId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    await createTodo(todo);
    res.status(201).json({
      success: true,
      message: "Todo create successfully",
      data: todo,
    });
  } catch (error) {
    console.log("create todo error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
