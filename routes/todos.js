const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs/promises")

const todosFile = path.join(__dirname, "../todos.json")

router.get("/todos", async (req, res) => {
  try {
    const data = await fs.readFile(todosFile, "utf8")
    const todos = JSON.parse(data)
    const filteredTodos = todos.filter(
      (item) => item.userId === "2b517214-8bdf-468a-be0e-5e5299ee8841"
    )
    return res.status(200).json(filteredTodos)
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "No such file" })
    } else return res.status(400).json({ message: error })
  }
})

module.exports = router
