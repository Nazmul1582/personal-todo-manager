const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILES = {
  USERS_FILE: path.join(DATA_DIR, "users.json"),
  TODOS_FILE: path.json(DATA_DIR, "todos.json"),
};

const readJsonFile = async (file) => {
  try {
    const data = await fs.readFile(file);
    return JSON.parse;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeJsonFile = async (file, data) => {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  FILES,
  readJsonFile,
  writeJsonFile,
};
