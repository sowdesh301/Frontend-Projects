
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const taskCount = document.getElementById("taskCount");
const themeToggle = document.getElementById("themeToggle");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
themeToggle.addEventListener("click", toggleTheme);

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("⚠️ Enter a task!");

  createTaskElement({ text, completed: false });
  saveTask({ text, completed: false });

  taskInput.value = "";
  updateCount();
}

// Create Task Element
function createTaskElement(task) {
  const li = document.createElement("li");
  li.textContent = task.text;

  if (task.completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateStorage();
    updateCount();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.classList.add("delete");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateStorage();
    updateCount();
  });

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

// Save Task
function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(createTaskElement);
  updateCount();
}

// Update Storage
function updateStorage() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({ 
      text: li.firstChild.textContent, 
      completed: li.classList.contains("completed") 
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filters
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  });
});

function filterTasks(filter) {
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "pending":
        task.style.display = task.classList.contains("completed") ? "none" : "flex";
        break;
      case "completed":
        task.style.display = task.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });
}

// Task Counter
function updateCount() {
  const tasks = taskList.querySelectorAll("li:not(.completed)").length;
  taskCount.textContent = tasks;
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}
