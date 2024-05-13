// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000); // Adjust the range as needed

  return `task_${timestamp}_${randomNum}`;
}


// Todo: 
function createTaskCard(task) {
 
  const taskCard = document.createElement('div');
  taskCard.classList.add('task-card');
  taskCard.setAttribute('id', task.id);

  const titleElement = document.createElement('h3');
  titleElement.textContent = task.title;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = task.description;

  const dueDateEl = document.createElement('input[type="date"]');
  dueDateEl.textContent = taskList.datepicker;

  taskCard.appendChild(titleElement);
  taskCard.appendChild(descriptionElement);
  taskCard.appendChild(dueDateEl);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  const taskList = document.getElementById('task-list');

  tasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('id', task.id);
    taskCard.textContent = task.title;

    taskList.appendChild(taskCard);
  });
}

// Function to make task cards draggable
function makeTaskCardsDraggable() {
  $('.task-card').draggable({
    revert: 'invalid',
    cursor: 'move',
    helper: 'clone'
  });


  // Call the functions to render the task list and make cards draggable
  renderTaskList();
  makeTaskCardsDraggable();

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) { // function addNewTask(title, description, status) {

  // Generate a unique task ID 
  const taskId = generateTaskId();

  // Create a new task object
  const newTask = {
    id: taskId,
    title: title,
    description: description,
    status: dueDate,
  };

  // Add the new task to the tasks array
  tasks.push(newTask);

  // Re-render the task list with the new task included
  renderTaskList();
  makeTaskCardsDraggable();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) { //function deleteTask(taskId) 
  // Find the index of the task with the given taskId
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    // Remove the task from the tasks array
    tasks.splice(taskIndex, 1);

    // Re-render the task list without the deleted task
    renderTaskList();
    makeTaskCardsDraggable();
  } else {
    console.log('Task not found');
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // Add a drop event listener to each task element
  const tasks = document.querySelectorAll('.task');
  tasks.forEach(task => {
    task.addEventListener('drop', handleDrop);
  });

  // Define the handleDrop function
  function handleDrop(event) {
    event.preventDefault();

    // Get the task element being dragged
    const draggedTask = event.target;

    // Get the lane where the task was dropped
    const newLane = event.target.parentNode.id; // Assuming each lane has a unique ID

    // Update the task's progress state based on the new lane
    let progressState;
    switch (newLane) {
      case 'not-started':
        progressState = 'Not Yet Started';
        break;
      case 'in-progress':
        progressState = 'In Progress';
        break;
      case 'completed':
        progressState = 'Completed';
        break;
      default:
        progressState = 'Unknown';
    }

    // Update the task's progress state in the task object or data structure
    // Update the task's appearance on the task board
    // Save the updated task information to localStorage
  }

}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  // Function to initialize the page
  function initializePage() {
    // Render the task list
    renderTaskList();
    makeTaskCardsDraggable();

    // Add event listeners for interactions
    document.getElementById('add-task-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      const status = document.getElementById('task-status').value;
      addNewTask(title, description, status);
    });

    // Make lanes droppable for task movement
    $('.lane').droppable({
      drop: function (event, ui) {
        const taskId = ui.draggable.attr('id');
        const newStatus = $(this).attr('id');
        updateTaskStatus(taskId, newStatus);
      }
    });

    // Initialize the date picker for the due date field
    $('#due-date').datepicker({
      changeMonth: true,
      changeYear: true
    });
  }

  // Call the initialization function when the page loads
  $(document).ready(function () {
    initializePage();
  });
});
