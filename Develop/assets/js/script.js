// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId++
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Todo: 
function createTaskCard(task) {
    const date = dayjs(task.date);
    const now = dayjs();
    let bgColor = 'bg-white';

    if (task.status === 'done') {
        bgColor = 'bg-white';
    } else if (now.isSame(date, 'day')) {
        bgColor = 'bg-warning text-white';
    } else if (now.isAfter(date)) {
        bgColor = 'bg-danger';
    }

    return `<div class="task-card card mb-3 ${bgColor}" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${date.format('DD MMM YYYY')}</small></p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>`;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
    });
    $(".delete-task").on("click", handleDeleteTask);
    $(".task-card").draggable({
        opacity: 0.7, zIndex: 100
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const title = $('#formControlInput1').val().trim();
    const description = $('#formControlTextarea1').val();
    const date = $('#datepicker').val();

    // Create a new task object
    if (title && description && date) {
        const newTask = {
            id: generateTaskId(),
            title,
            description,
            date,
            status: 'to-do'
        };

        // Add the new task to the tasks array
        taskList.push(newTask);
        // saveTasksToStorage(taskList);
        localStorage.setItem("tasks", JSON.stringify(taskList));

        // Re-render the task list with the new task included
        renderTaskList();
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

    const taskId = $(event.target).closest(".card").data("id");
    taskList = taskList.filter(task => task.id !== taskId);

    // saveTasksToStorage(taskList);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    // function to print tasks back to the screen
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

    // Add a drop event listener to each task element
    const taskID = ui.draggable[0].dataset.id;
    const newStatus = event.target.id;
    const task = taskList.find(task => task.id === Number(taskID));
    if (task) {
        task.status = newStatus;

        // saveTasksToStorage(taskList);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}
const modalEl = $('.modal-content');
modalEl.on('submit', handleAddTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    // Render the task list
    renderTaskList();
    // Initialize the date picker for the due date field
    $('#datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $("#formModal").on('show.bs.modal', function () {
        $("#formControlInput1").val('');
        $("#formControlTextarea1").val('');
        $("#datepicker").val('');
    });

    // Make lanes droppable for task movement
    $('.lane').droppable({
        accept: ".task-card",
        drop: handleDrop
    });
})