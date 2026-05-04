const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "secret"));

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to our personal todo manager.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
