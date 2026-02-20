const path = require("path")
const fs = require("fs").promises

const filePath = path.join(__dirname, "../users.json")

const getUser = async (username) => {
  try {
    const data = await fs.readFile(filePath, "utf8")
    const users = JSON.parse(data)
    return users.find(
      (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase()
    )
  } catch (error) {
    if (error.code === "ENOENT") throw error
    else throw error.message
  }
}

module.exports = getUser
