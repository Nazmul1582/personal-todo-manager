const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")

router.post("/signup", async (req, res) => {
  let { username, password } = req.body
  if (!username)
    return res.status(401).json({ message: "Username is required!" })
  if (!password)
    return res.status(401).json({ message: "Password is required!" })
  if (password && typeof password === "number") password = password.toString()

  const user = {
    id: crypto.randomUUID(),
    username,
    password: await bcrypt.hash(password, 10),
  }
  res.status(201).json({ message: "User created successfully!", data: user })
})

module.exports = router

/**
 * Todo for signup
 * 1. get username and password from req.body
 * 2. store credentials in users.json with user_uid
 * 2.1. create user_uid
 * 2.2. create a user object with hash password
 * 2.3. push user in users.json using fs module
 * 2.4. create a util for this
 * 3. create a jwt token and send it in response
 * 4. show a successfull message after sign up.
 */
