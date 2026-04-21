const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { getTodosByUserId, getUserById } = require("../utils/fileUtil");

router.get("/", async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const user = await getUserById(userId);
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const todos = await getTodosByUserId(user.id);
    res.status(200).json({
      success: true,
      message: "Fetch data successfully",
      data: todos,
    });
  } catch (error) {
    console.log("todos error", error);

    res.status(400).json({});
  }
});

module.exports = router;
