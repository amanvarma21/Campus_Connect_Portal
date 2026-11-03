// ==========================================================
// EXPERIMENT 3: Client-Side Scripting with JavaScript
// DOM Manipulation, Events, and Dynamic Content
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. DOM Element Selection
    const itemInput = document.getElementById("itemInput");
    const addBtn = document.getElementById("addBtn");
    const toggleThemeBtn = document.getElementById("toggleThemeBtn");
    const livePreview = document.getElementById("livePreview");
    const dynamicList = document.getElementById("dynamicList");
    const interactiveCard = document.querySelector(".interactive-card");

    if (!itemInput || !addBtn || !dynamicList) return;

    // Initial items to display on page load
    const sampleItems = [
        "Campus Hackathon registration closes on Friday",
        "Submit CS3301 Web Development Lab 2 & 3"
    ];
    sampleItems.forEach(text => createListItem(text));

    // ----------------------------------------------------------
    // EVENT 1: Text Input Event (Real-time dynamic display)
    // ----------------------------------------------------------
    itemInput.addEventListener("input", (e) => {
        const text = e.target.value;
        livePreview.textContent = text.length > 0 ? text : "Waiting for user input...";
    });

    // ----------------------------------------------------------
    // EVENT 2: Button Click Events
    // ----------------------------------------------------------
    // Click button to add item
    addBtn.addEventListener("click", handleAddItem);

    // Click button to toggle card style/theme
    if (toggleThemeBtn && interactiveCard) {
        toggleThemeBtn.addEventListener("click", () => {
            interactiveCard.classList.toggle("dark-card-theme");
        });
    }

    // ----------------------------------------------------------
    // EVENT 3: Keyboard Event (Press 'Enter' to add item)
    // ----------------------------------------------------------
    itemInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleAddItem();
        }
    });

    // Helper: Validate and add item
    function handleAddItem() {
        const text = itemInput.value.trim();
        if (text === "") {
            alert("Please enter some text before adding!");
            itemInput.focus();
            return;
        }
        createListItem(text);
        itemInput.value = "";
        livePreview.textContent = "Waiting for user input...";
    }

    // ----------------------------------------------------------
    // DYNAMIC DOM MANIPULATION (createElement, appendChild, remove)
    // ----------------------------------------------------------
    function createListItem(text) {
        const li = document.createElement("li");
        li.className = "dynamic-list-item";

        // Item text span
        const span = document.createElement("span");
        span.className = "item-text-content";
        span.textContent = text;
        span.title = "Click to toggle strike-through";

        // Click on text to toggle style (line-through)
        span.addEventListener("click", () => {
            span.classList.toggle("text-completed");
        });

        // Delete button to remove item from DOM
        const delBtn = document.createElement("button");
        delBtn.className = "btn-delete-item";
        delBtn.textContent = "✕ Remove";
        delBtn.title = "Remove item from list";

        // Remove element dynamically on click
        delBtn.addEventListener("click", () => {
            li.remove();
        });

        li.appendChild(span);
        li.appendChild(delBtn);
        dynamicList.appendChild(li);
    }
});

