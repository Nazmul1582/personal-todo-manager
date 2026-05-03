const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const {
  getTodoByUserId,
  getTodosByUserId,
  getUserById,
  createTodo,
  deleteTodo,
  getTodoById,
} = require("../utils/fileUtil");

router.get("/", async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const user = await getUserById(userId);
    if (!user) return res.status(403).json({ message: "Forbidden" });

    const todos = await getTodosByUserId(user.id);
    res.status(200).json({
      success: true,
      message: "Fetch data successfully",
      data: todos,
    });
  } catch (error) {
    console.log("todos error", error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text.trim())
      return res.status(400).json({ message: "text is required" });

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

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.cookies.userId;
    // check the todo is exists or not
    const todo = await getTodoById(id);
    if (!todo)
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    // check the userId is exists or not
    const exists = await getTodoByUserId(userId);
    console.log("valid", exists);

    if (!exists)
      return res.status(403).json({ success: false, message: "Forbidden" });
    await deleteTodo(id);
    res.status(200).json({ success: true, message: "Todo has been deleted" });
  } catch (error) {
    console.log("todo delete error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
