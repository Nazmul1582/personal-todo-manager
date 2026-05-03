const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILES = {
  USERS_FILE: path.join(DATA_DIR, "users.json"),
  TODOS_FILE: path.join(DATA_DIR, "todos.json"),
};

const readJsonFile = async (file) => {
  try {
    const data = await fs.readFile(file, "utf-8");
    if (!data) return [];
    return await JSON.parse(data);
  } catch (error) {
    console.log("file read error: ", error);

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

const getUsers = async () => {
  return await readJsonFile(FILES.USERS_FILE);
};

const saveUsers = async (users) => {
  return await writeJsonFile(FILES.USERS_FILE, users);
};

const createUser = async (user) => {
  const users = await getUsers();
  users.push(user);
  return await saveUsers(users);
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

const getTodoById = async (id) => {
  const todos = await getTodos();
  return todos.find((t) => t.id === id);
};

const getTodosByUserId = async (userId) => {
  const todos = await getTodos();
  const filteredTodos = todos.filter((t) => t.userId === userId);
  return filteredTodos;
};

const getTodoByUserId = async (userId) => {
  const todos = await getTodos();
  return todos.find((t) => t.userId === userId);
};

const saveTodos = async (todos) => {
  return await writeJsonFile(FILES.TODOS_FILE, todos);
};

const createTodo = async (todo) => {
  const todos = await getTodos();
  todos.push(todo);
  await saveTodos(todos);
  return todo;
};

const deleteTodo = async (id) => {
  const todos = await getTodos();
  const filteredTodos = todos.filter((t) => t.id !== id);
  await saveTodos(filteredTodos);
};

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,

  getTodos,
  getTodoById,
  getTodoByUserId,
  getTodosByUserId,
  createTodo,
  deleteTodo,
};
