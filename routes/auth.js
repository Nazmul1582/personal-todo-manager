const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const storeUser = require("../utils/storeUser")

router.post("/signup", async (req, res) => {
  try {
    let { username, password } = req.body
    if (!username)
      return res.status(401).json({ message: "Username is required!" })
    if (!password)
      return res.status(401).json({ message: "Password is required!" })
    if (password && typeof password === "number") password = password.toString()

    const user = {
      id: crypto.randomUUID(),
      username: username.trim().toLowerCase(),
      password: await bcrypt.hash(password, 10),
    }
    await storeUser(user)
    res.status(201).json({ message: "User created successfully!", data: user })
  } catch (error) {
    if (error.message.includes("exists"))
      res.status(409).json({ message: error.message })
    else res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
