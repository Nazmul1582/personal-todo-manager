const path = require("path")
const fs = require("fs/promises")

const filePath = path.join(__dirname, "../users.json")
const storeUser = async (user) => {
  let users = []

  try {
    const exists = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(exists)
    users = data
    users.push(user)
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("No such file or directory!")

      // push the first data to the users array;
      users.push(user)
    } else {
      console.log("File reading error", error)
    }
  }

  try {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2))
  } catch (error) {
    console.log("File writing error", error)
  }
}

module.exports = storeUser
