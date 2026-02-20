const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const storeUser = require("../utils/storeUser")
const getUser = require("../utils/getUser")

router.post("/signup", async (req, res) => {
  try {
    let { username, password } = req.body
    if (!username)
      return res.status(400).json({ message: "Username is required!" })
    if (!password)
      return res.status(400).json({ message: "Password is required!" })
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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password is required!" })
    // check user
    const user = await getUser(username)
    if (user) {
      try {
        const result = await bcrypt.compare(password, user.password)
        if (!result) return res.status(400).json({ message: "Wrong password!" })
      } catch (error) {
        console.log(error)
      }
      res.cookie("userId", user.id)
      res.status(200).json({ message: "login sucessfull!" })
    } else {
      res.status(400).json({ message: "Invalide credentials!" })
    }
  } catch (error) {
    res.json({ message: error?.message })
  }
})

module.exports = router
