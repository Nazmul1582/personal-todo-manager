const express = require("express")
const authRouter = require("./routes/auth")
const todoRouter = require("./routes/todos")
const app = express()

app.use(express.json())

app.use("/api", authRouter)
app.use("/api", todoRouter)

app.get("/", (req, res) => {
  res.status(200).send("This is my personal todo manager.")
})

app.listen(3000, () => {
  console.log("Server is running...")
})
