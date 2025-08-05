"use strict";

const showFormBtn = document.querySelector("#addTaskBtn");
const formContainer = document.querySelector("#formContainer");

const tasks = []


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
                <label for="medium">medium</label>

                <input type='radio' name="priority" value="high" id="high" />
                <label for="high">High</label>
            </fieldset>
            <div class="form__btnContainer">
                <button type="submit" id="submitFormBtn">Submit</button>
                <button type="button" id="closeFormBtn">Cancel</button>
            </div>
        </form>`;
}

showFormBtn.addEventListener("click", (e) => {
//   formContainer.innerHTML = "";
  formContainer.innerHTML = generateForm();
  showFormBtn.disabled = true;

  formContainer.querySelector("#closeFormBtn").addEventListener("click", () => {
    formContainer.innerHTML = "";
    showFormBtn.disabled = flase;
    document.removeEventListener("keydown", escListener);
  });

  function escListener(e) {
    if (e.key == "Escape") {
      formContainer.innerHTML = "";
      showFormBtn.disabled = flase;

      document.removeEventListener("keydown", escListener);
    }
  }

  document.addEventListener("keydown", escListener);
});

formContainer.querySelector('#submitFormBtn').addEventListener('click', (e)=> {
    e.preventDefault();

    const form = new FormData(form);

    const date = form.get('date');
    const repeat = form.get('repeat');
    const title = form.get('title');
    const description = form.get('description');
    const priority = form.get('priority');

    const createdAt = new Date();
    const completed = false;

    const newTask = {
        date, repeat, title, description, priority, createdAt, completed
    }

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks))

    formContainer.innerHTML ='';
    showFormBtn.disabled = false;
});

const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}