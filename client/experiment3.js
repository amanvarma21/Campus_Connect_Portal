// ==========================================================================
// EXPERIMENT 3: Client-Side Scripting with JavaScript
// Aim: DOM Manipulation, Event Handling, and Dynamic Content Updates
// ==========================================================================

// 1. SELECT DOM ELEMENTS
const userInput = document.getElementById("userInput");
const addBtn = document.getElementById("addBtn");
const toggleBtn = document.getElementById("toggleBtn");
const liveOutput = document.getElementById("liveOutput");
const dynamicList = document.getElementById("dynamicList");
const itemCount = document.getElementById("itemCount");
const mainContainer = document.getElementById("mainContainer");

// Initial sample items
const initialData = [
  "RVU Hackathon registration closes this Friday",
  "Library clearance form submission deadline: Sept 15"
];

// Populate initial items
initialData.forEach((itemText) => {
  createAndAppendItem(itemText);
});

// Update list counter helper
function updateCounter() {
  const count = dynamicList.children.length;
  itemCount.textContent = `Total: ${count}`;
}

// --------------------------------------------------------------------------
// EVENT 1: Text Input Event (Real-time Dynamic Content Display)
// --------------------------------------------------------------------------
// As user types into input field, reflect the text in real-time
userInput.addEventListener("input", (event) => {
  const enteredText = event.target.value;
  if (enteredText.trim() === "") {
    liveOutput.textContent = "Start typing above to preview notice...";
  } else {
    liveOutput.textContent = enteredText;
  }
});

// --------------------------------------------------------------------------
// EVENT 2: Button Click Event (Add Item & Toggle Style)
// --------------------------------------------------------------------------
// Click 'Post Notice' button
addBtn.addEventListener("click", handleAddItem);

// Click 'Toggle Dark Mode' button to dynamically toggle container style
toggleBtn.addEventListener("click", () => {
  mainContainer.classList.toggle("dark-theme");
});

// --------------------------------------------------------------------------
// EVENT 3: Keyboard Event (Press 'Enter' to Add Item)
// --------------------------------------------------------------------------
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddItem();
  }
});

// Function to handle reading input, validating, and adding item
function handleAddItem() {
  const text = userInput.value.trim();

  // Prevent empty additions
  if (text === "") {
    alert("Please enter a notice or task description!");
    userInput.focus();
    return;
  }

  // Create new list item dynamically
  createAndAppendItem(text);

  // Clear input field and reset live preview
  userInput.value = "";
  liveOutput.textContent = "Start typing above to preview notice...";
  userInput.focus();
}

// --------------------------------------------------------------------------
// DYNAMIC DOM MANIPULATION: createElement, appendChild, and remove
// --------------------------------------------------------------------------
function createAndAppendItem(text) {
  // 1. Create <li> element
  const li = document.createElement("li");
  li.className = "list-item";

  // 2. Create <span> for text content
  const span = document.createElement("span");
  span.className = "item-text";
  span.textContent = text;
  span.title = "Click to toggle completed line-through style";

  // Click text to toggle completed style
  span.addEventListener("click", () => {
    span.classList.toggle("completed");
  });

  // 3. Create <button> for removing item
  const delBtn = document.createElement("button");
  delBtn.className = "btn-delete";
  delBtn.textContent = "✕ Remove";
  delBtn.title = "Delete this item";

  // Click delete button to remove element from DOM
  delBtn.addEventListener("click", () => {
    li.remove(); // Removes this <li> from the DOM
    updateCounter();
  });

  // 4. Append children into <li> and append <li> to <ul>
  li.appendChild(span);
  li.appendChild(delBtn);
  dynamicList.appendChild(li);

  // 5. Update total counter
  updateCounter();
}

