const express = require("express")
const authRouter = require("./routes/auth")
const app = express()

app.use(express.json())

app.use("/api", authRouter)
app.get("/", (req, res) => {
  res.status(200).send("This is my personal todo manager.")
})

app.listen(3000, () => {
  console.log("Server is running...")
})
