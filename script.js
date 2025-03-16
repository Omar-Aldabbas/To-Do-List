const taskInput = document.getElementById("taskInput");
let alert;

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

function addTasks() {
    let inputTask = taskInput.value.trim();
    if (!inputTask) {
        if (!alert) {
            alert = document.createElement("p");
            alert.innerHTML = `Add a valid Task`;
            alert.style.color = "tomato";
            document.getElementById('taskList').appendChild(alert);
        }
        return; 
    }
    if (alert) {
        alert.remove();
        alert = null;
    }
    addTaskToDOM(inputTask);
    saveTaskToStorage(inputTask);
    taskInput.value = ""; 
}

function addTaskToDOM(task) {
    let li = document.createElement("li");
    li.innerText = task;
    let delButton = document.createElement("button");
    delButton.innerText = "X";
    delButton.onclick = () => {
        li.remove();
        removeTaskFromStorage(task);
    };
    li.appendChild(delButton);
    document.getElementById("taskList").appendChild(li);
}

function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t !== task);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

loadTasks();
