const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const todoRouter = require("./routes/todos");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/todos", todoRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to our personal todo manager.");
});

app.listen(3000, () => {
  console.log("Server is running...");
});
