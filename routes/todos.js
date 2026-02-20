const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs/promises")

const todosFile = path.join(__dirname, "../todos.json")

router.get("/todos", async (req, res) => {
  try {
    const data = await fs.readFile(todosFile, "utf8")
    const todos = JSON.parse(data)

    const userId = req.cookies.userId
    const filteredTodos = todos.filter((item) => item.userId === userId)
    return res.status(200).json(filteredTodos)
  } catch (error) {
    console.log("error", error)
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "No such file" })
    } else return res.status(400).json({ message: error })
  }
})

router.post("/todo/create", async (req, res) => {
  try {
    const { text } = req.body
    if (!text) {
      return res
        .status(400)
        .json({ message: "You must be provide the todo's content" })
    }
    const userId = req.cookies.userId
    const createdAt = new Date().toISOString()

    const data = await fs.readFile(todosFile, "utf8")
    let todos = JSON.parse(data)
    const todoId = `t${todos.length + 1}`

    const newTodo = {
      todoId,
      userId,
      text,
      createdAt,
    }

    todos.push(newTodo)

    await fs.writeFile(todosFile, JSON.stringify(todos, null, 2))
    res
      .status(201)
      .json({ message: "New todo created successfully!", data: newTodo })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
