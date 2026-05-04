const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTodosByUserId,
  createTodo,
  deleteTodo,
  getTodoById,
} = require("../utils/fileUtil");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const todos = await getTodosByUserId(req.user.id);
    res.status(200).json({
      success: true,
      message: "Fetched todos successfully",
      data: todos,
    });
  } catch (error) {
    console.error("todos error", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (typeof text !== "string" || !text.trim())
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });

    const todo = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    await createTodo(todo);
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    console.error("create todo error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await getTodoById(todoId);
    if (!todo)
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });

    if (todo.userId !== req.user.id)
      return res.status(403).json({ success: false, message: "Forbidden" });

    await deleteTodo(todoId);
    res.status(200).json({ success: true, message: "Todo has been deleted" });
  } catch (error) {
    console.error("todo delete error", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
