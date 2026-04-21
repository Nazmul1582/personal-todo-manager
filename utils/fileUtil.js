const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILES = {
  USERS_FILE: path.join(DATA_DIR, "users.json"),
  TODOS_FILE: path.join(DATA_DIR, "todos.json"),
};

const readJsonFile = async (file) => {
  try {
    const data = await fs.readFile(file);
    return await JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeJsonFile = async (file, item) => {
  try {
    const data = await readJsonFile(file);
    data.push(item);
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  } catch (error) {
    throw error;
  }
};

const getUsers = async () => {
  return await readJsonFile(FILES.USERS_FILE);
};

const getUserByUsername = async (username) => {
  const users = await getUsers();

  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase(),
  );

  return user;
};

const getUserById = async (id) => {
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  return user;
};

const getTodos = async () => {
  return await readJsonFile(FILES.TODOS_FILE);
};

const getTodosById = async (id) => {
  const todos = await getTodos();
  const filteredTodos = todos.filter((t) => t.id === id);
  return filteredTodos;
};

const getTodosByUserId = async (userId) => {
  const todos = await getTodos();
  const filteredTodos = todos.filter((t) => t.userId === userId);
  return filteredTodos;
};

module.exports = {
  FILES,
  readJsonFile,
  writeJsonFile,
  getUsers,
  getUserById,
  getUserByUsername,

  getTodos,
  getTodosById,
  getTodosByUserId,
};
