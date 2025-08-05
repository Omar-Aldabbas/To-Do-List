"use strict";

const showFormBtn = document.querySelector("#addTaskBtn");
const formContainer = document.querySelector("#formContainer");
const priorityContainer = document.querySelector("#priorityContainer");
const titles = document.querySelectorAll(".task-titles p");
const taskBodies = document.querySelectorAll(".task-body");
const taskFilter = document.querySelector("#taskFilter");
const filteredTasksContainer = document.querySelector("#filteredTasksContainer");

let tasks = [];

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

function generateForm() {
  return `<form>
            <input type="date" id="date" name="date">

            <fieldset>
                <legend>Repetation</legend>
                <div class="radio-group">
                  <input type='radio' name="repeat" value="day" id="daily" checked/>
                  <label for="daily" class="red-bg">Day</label>

                  <input type='radio' name="repeat" value="week" id="weekly" />
                  <label for="weekly" class="blue-bg">Week</label>

                  <input type='radio' name="repeat" value="month" id="monthly" />
                  <label for="monthly" class="green-bg">Month</label>
                </div>
            </fieldset>

            <div class="form__group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" max="45" min="3" required />

            <label for="description">Description</label>
            <textarea id="description" name="description"></textarea>
            </div>

            <fieldset>
                <legend>Priority</legend>
                <div class="radio-group">
                  <input type='radio' name="priority" value="low" id="low" checked/>
                  <label for="low" class="green-bg">Low</label>

                  <input type='radio' name="priority" value="medium" id="medium" />
                  <label for="medium" class="blue-bg">Medium</label>

                  <input type='radio' name="priority" value="high" id="high" />
                  <label for="high" class="red-bg">High</label>
                </div>
            </fieldset>
            <div class="form__btnContainer">
                <button type="submit" id="submitFormBtn" class="green-bg">Submit</button>
                <button type="button" id="closeFormBtn" class="red-bg">Cancel</button>
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

    const createdAt = new Date().toISOString();
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
    document.removeEventListener("keydown", escListener);

    insertPriority();
    addToTitle();
    runFilterTasks();
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
    "😲",
    "😬",
    "🤡",
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
          <p>${task.repeat || ""} <span>${randEmoji()}</span></p>
          <div class="priorityTask__btnContainer">
            <button class="deleteTask" title="Delete Task">❌</button>
            ${
              task.completed
                ? "✅"
                : '<button class="completeTask" title="Mark as Completed">☑</button>'
            }
          </div>
        </div>
        <h3>${task.title}</h3>
        <p class="${
          task.priority === "high"
            ? "red"
            : task.priority === "medium"
            ? "blue"
            : "green"
        }">${task.priority}</p>
        <details>
        <summary>${
          (task.description && task.description.slice(0, 14) + "...") ||
          "NO DESCRIPTION"
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

    const lastTask = priorityContainer.lastElementChild;

    const deleteBtn = lastTask.querySelector(".deleteTask");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const index = tasks.findIndex(
          (t) => t.title === el.title && t.createdAt === el.createdAt
        );
        if (index !== -1) {
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          insertPriority();
          addToTitle();
          runFilterTasks();
        }
      });
    }

    const completeBtn = lastTask.querySelector(".completeTask");
    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        const index = tasks.findIndex(
          (t) => t.title === el.title && t.createdAt === el.createdAt
        );
        if (index !== -1) {
          tasks[index].completed = true;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          insertPriority();
          addToTitle();
          runFilterTasks();
        }
      });
    }
  });
}

function addToTitle() {
  titles.forEach((title) => {
    title.addEventListener("click", () => {
      titles.forEach((el) => el.classList.remove("active"));
      title.classList.add("active");

      taskBodies.forEach((body) => {
        body.classList.remove("active");
        body.innerHTML = "";
      });

      const targetId = title.dataset.target;
      const repeatValue = getRepeatValueFromId(targetId);
      const relatedTasks = tasks.filter((task) => task.repeat === repeatValue);

      const targetElement = document.getElementById(targetId);
      targetElement.classList.add("active");

      if (relatedTasks.length === 0) {
        targetElement.textContent = `No tasks for this ${repeatValue} yet`;
      } else {
        relatedTasks.forEach((task) => {
          const p = document.createElement("p");
          p.textContent = task.title;
          targetElement.appendChild(p);
        });
      }
    });
  });
}

function getRepeatValueFromId(id) {
  if (id.includes("today")) return "day";
  if (id.includes("week")) return "week";
  if (id.includes("month")) return "month";
}

function runFilterTasks() {
  const selectedFilter = taskFilter.value;
  filteredTasksContainer.innerHTML = "";

  let filtered = '';

  if (selectedFilter === "all") {
    filtered = tasks;
  } else if (selectedFilter === "completed") {
    filtered = tasks.filter((task) => task.completed === true);
  } else if (selectedFilter === "incomplete") {
    filtered = tasks.filter((task) => task.completed === false);
  }

  if (filtered.length === 0) {
    filteredTasksContainer.textContent = "No tasks found for this filter.";
    return;
  }

  filtered.forEach((task) => {
    const taskHTML = priorityTask(task);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = taskHTML;

    const taskElement = tempDiv.firstElementChild;
    filteredTasksContainer.appendChild(taskElement);

    const deleteBtn = taskElement.querySelector(".deleteTask");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const index = tasks.findIndex(
          (t) => t.title === task.title && t.createdAt === task.createdAt
        );
        if (index !== -1) {
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          insertPriority();
          addToTitle();
          runFilterTasks();
        }
      });
    }

    const completeBtn = taskElement.querySelector(".completeTask");
    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        const index = tasks.findIndex(
          (t) => t.title === task.title && t.createdAt === task.createdAt
        );
        if (index !== -1) {
          tasks[index].completed = true;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          insertPriority();
          addToTitle();
          runFilterTasks();
        }
      });
    }
  });
}

insertPriority();
addToTitle();
runFilterTasks();

taskFilter.addEventListener("change", runFilterTasks);
