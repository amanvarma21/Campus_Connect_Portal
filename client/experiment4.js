// ==========================================================================
// EXPERIMENT 4: State Handling in an Interactive Web Application
// Architecture: User Action -> State Mutation -> Render Cycle (UI = f(state))
// ==========================================================================

// 1. APPLICATION STATE
// The single source of truth for the entire interface
let state = {
  filter: "all", // 'all' | 'pending' | 'completed'
  tasks: [
    { id: 1, title: "Prepare CS3301 Full Stack Lab Record", priority: "High", completed: false },
    { id: 2, title: "Review React & Express Authentication Flow", priority: "Medium", completed: true },
    { id: 3, title: "Submit Git & GitHub Version Control Assignment", priority: "High", completed: false }
  ]
};

// Load persisted state from localStorage if available
function loadState() {
  const saved = localStorage.getItem("campus_connect_planner_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.tasks)) {
        state.tasks = parsed.tasks;
      }
    } catch (err) {
      console.log("Could not load state, using defaults");
    }
  }
}

// Persist state to localStorage
function saveState() {
  localStorage.setItem("campus_connect_planner_state", JSON.stringify(state));
}

// --------------------------------------------------------------------------
// 2. STATE MUTATION FUNCTIONS (Actions)
// --------------------------------------------------------------------------

// Add a new task to state
function handleAddTask(event) {
  event.preventDefault();
  const input = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const title = input.value.trim();

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title: title,
    priority: prioritySelect.value,
    completed: false
  };

  // Mutate state
  state.tasks.unshift(newTask);
  saveState();

  // Clear input
  input.value = "";
  input.focus();

  // Trigger UI update from new state
  render();
}

// Toggle completion status in state
function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveState();
    render();
  }
}

// Delete task from state
function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  saveState();
  render();
}

// Set active filter in state
function setFilter(newFilter, btnElement) {
  state.filter = newFilter;

  // Update active button visual
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }

  render();
}

// --------------------------------------------------------------------------
// 3. RENDER FUNCTION (UI = f(state))
// Re-draws the entire interface to reflect current state
// --------------------------------------------------------------------------
function render() {
  const listElement = document.getElementById("taskList");
  const totalCountEl = document.getElementById("totalCount");
  const completedCountEl = document.getElementById("completedCount");
  const pendingCountEl = document.getElementById("pendingCount");

  // Calculate statistics from state
  const total = state.tasks.length;
  const completed = state.tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  totalCountEl.textContent = total;
  completedCountEl.textContent = completed;
  pendingCountEl.textContent = pending;

  // Filter tasks based on state.filter
  let visibleTasks = state.tasks;
  if (state.filter === "pending") {
    visibleTasks = state.tasks.filter((t) => !t.completed);
  } else if (state.filter === "completed") {
    visibleTasks = state.tasks.filter((t) => t.completed);
  }

  // Clear existing DOM list
  listElement.innerHTML = "";

  // If no tasks match current state
  if (visibleTasks.length === 0) {
    listElement.innerHTML = `
      <li class="empty-state">
        No ${state.filter === "all" ? "" : state.filter} tasks found.
      </li>
    `;
    return;
  }

  // Build task cards from state
  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-card priority-${task.priority} ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-left">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? "checked" : ""}
          onchange="toggleTask(${task.id})"
        />
        <span class="task-title" onclick="toggleTask(${task.id})">${task.title}</span>
        <span class="priority-badge badge-${task.priority}">${task.priority}</span>
      </div>
      <button class="btn-delete" title="Delete Task" onclick="deleteTask(${task.id})">✕</button>
    `;

    listElement.appendChild(li);
  });
}

// --------------------------------------------------------------------------
// 4. INITIALIZE APP
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  render();
});
