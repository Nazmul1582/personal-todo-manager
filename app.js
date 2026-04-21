const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todosRoutes");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to our personal todo manager.");
});

app.listen(3000, () => {
  console.log("Server is running...");
});
