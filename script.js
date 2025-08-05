"use strict";

const showFormBtn = document.querySelector("#addTaskBtn");
const formContainer = document.querySelector("#formContainer");
const priorityContainer = document.querySelector("#priorityContainer");

let tasks = [
  {
    title: "Task A",
    priority: "high",
    repeat: "day",
    description: "Very important task",
  },
  {
    title: "Task B",
    priority: "medium",
    repeat: "week",
    description: "Less important task",
  },
];

// Load saved tasks
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

function generateForm() {
  return `<form>
            <input type="date" id="date" name="date">

            <fieldset>
                <legend>Repetation</legend>
        
                <input type='radio' name="repeat" value="day" id="daily" />
                <label for="daily">Daily</label>

                <input type='radio' name="repeat" value="week" id="weekly" />
                <label for="weekly">Weekly</label>

                <input type='radio' name="repeat" value="month" id="monthly" />
                <label for="monthly">Monthly</label>
            </fieldset>

            <div class="form__group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" max="45" min="3" required />

            <label for="description">Description</label>
            <textarea id="description" name="description"></textarea>
            
            </div>

            <fieldset>
                <legend>Priority</legend>
        
                <input type='radio' name="priority" value="low" id="low" />
                <label for="low">Low</label>

                <input type='radio' name="priority" value="medium" id="medium" />
                <label for="medium">Medium</label>

                <input type='radio' name="priority" value="high" id="high" />
                <label for="high">High</label>
            </fieldset>
            <div class="form__btnContainer">
                <button type="submit" id="submitFormBtn">Submit</button>
                <button type="button" id="closeFormBtn">Cancel</button>
            </div>
        </form>`;
}

showFormBtn.addEventListener("click", () => {
  formContainer.innerHTML = generateForm();
  showFormBtn.disabled = true;

  formContainer.querySelector("#closeFormBtn").addEventListener("click", () => {
    formContainer.innerHTML = "";
    showFormBtn.disabled = false;
    document.removeEventListener("keydown", escListener);
  });

  formContainer.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formElement = formContainer.querySelector("form");
    const formData = new FormData(formElement);

    const date = formData.get("date");
    const repeat = formData.get("repeat");
    const title = formData.get("title");
    const description = formData.get("description");
    const priority = formData.get("priority");

    const createdAt = new Date();
    const completed = false;

    const newTask = {
      date,
      repeat,
      title,
      description,
      priority,
      createdAt,
      completed,
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    formContainer.innerHTML = "";
    showFormBtn.disabled = false;

    insertPriority(); 
  });

  function escListener(e) {
    if (e.key === "Escape") {
      formContainer.innerHTML = "";
      showFormBtn.disabled = false;
      document.removeEventListener("keydown", escListener);
    }
  }
  document.addEventListener("keydown", escListener);
});

function randEmoji() {
  const emoji = [
    "🙄",
    "😎",
    "😝",
    "🙃",
    "😰",
    "🥳",
    "🦝",
    "🐵",
    "😬",
    "👁",
    "🧠",
    "🦋",
    "💃",
    "🏋️‍♀️",
  ];

  const random = Math.floor(Math.random() * emoji.length);

  return emoji[random];
}

const priorityTask = (task) => {
  return `
    <div class="priorityTask">
        <div class="priorityTask__head">
        <p>${task.repeat}</p>
        <span>${randEmoji()}</span>
        </div>
        <h3>${task.title}</h3>
        <details open>
        <summary>${
          (task.description && task.description.slice(0, 14) + "...") || "NO DESCRIPTION"
        }</summary>
        <p>${task.description || ""}</p>
        </details>
    </div>`;
};

function insertPriority() {
  priorityContainer.innerHTML = "";
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sorted = [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  sorted.forEach((el) => {
    const taskHTML = priorityTask(el);
    priorityContainer.insertAdjacentHTML("beforeend", taskHTML);
  });
}

insertPriority();
