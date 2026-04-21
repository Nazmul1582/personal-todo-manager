const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");

const todosFile = path.join(__dirname, "../todos.json");

router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(todosFile, "utf8");
    const todos = JSON.parse(data);

    const userId = req.cookies.userId;
    const filteredTodos = todos.filter((item) => item.userId === userId);
    return res.status(200).json(filteredTodos);
  } catch (error) {
    console.log("error", error);
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "No such file" });
    } else return res.status(400).json({ message: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res
        .status(400)
        .json({ message: "You must be provide the todo's content" });
    }
    const userId = req.cookies.userId;
    const createdAt = new Date().toISOString();

    const data = await fs.readFile(todosFile, "utf8");
    let todos = JSON.parse(data);
    const todoId = crypto.randomUUID();

    const newTodo = {
      todoId,
      userId,
      text,
      createdAt,
    };

    todos.push(newTodo);

    await fs.writeFile(todosFile, JSON.stringify(todos, null, 2), "utf-8");
    return res
      .status(201)
      .json({ message: "New todo created successfully!", data: newTodo });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required!" });
    }
    const todos = await fs.readFile(todosFile, "utf-8");
    const data = JSON.parse(todos);
    const filteredTodos = data.filter((item) => item.id !== id);

    await fs.writeFile(
      todosFile,
      JSON.stringify(filteredTodos, null, 2),
      "utf-8",
    );
    return res.status(200).json({ message: `${id} deleted successfully!` });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(400).json({ message: "No such file or directory!" });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
