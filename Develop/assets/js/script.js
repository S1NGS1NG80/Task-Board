// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks'));
let nextId = JSON.parse(localStorage.getItem('nextId'));

function readTasksFromStorage() {
  // let taskList = JSON.parse(localStorage.getItem("tasks"));
  if (!taskList) {
    taskList = [];
  }
  return taskList;
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000); // Adjust the range as needed

  return `task_${timestamp}_${randomNum}`;
}

// Todo: 
function createTaskCard(task) {

  const taskCard = $('div')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);

  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = readTasksFromStorage();

  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // Loop through tasks and create project cards for each status
  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }
  // Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const title = $('#formControlInput1').val().trim();
  const description = $('#formControlTextarea1').val(); // don't need to trim select input
  const date = $('#datepicker').val(); // yyyy-mm-dd format

  // Create a new task object
  const newTask = {
    id: generateTaskId(),
    title,
    description,
    date,
    status: 'to-do'
  };

  const tasks = readTasksFromStorage();
  // Add the new task to the tasks array
  tasks.push(newTask);

  saveTasksToStorage(tasks);

  // Re-render the task list with the new task included
  renderTaskList();

  // Clear the form inputs
  title.val('');
  description.val('');
  date.val('');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr('data-task-id');
  const tasks = readTasksFromStorage();

  // Remove task from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the task.
  tasks.forEach((task) => {
    if (task.id === nextId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  // helper function to save the tasks to localStorage
  saveTasksToStorage(taskList);

  // function to print tasks back to the screen
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  // Add a drop event listener to each task element
  const tasks = readTasksFromStorage();
  const taskID = nextId;
  const newStatus = event.target.id;

  for (let task of taskList) {

    if (task.id === taskID) {
      task.status = newStatus;
    }
  }
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}
const modalEl = $('.modal-content');
modalEl.on('submit', handleAddTask);



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  // Render the task list
  // renderTaskList();
  // Initialize the date picker for the due date field
  $('#datepicker').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Make lanes droppable for task movement
  $('.lane').droppable({
    drop: function (event, ui) {
      const taskId = ui.draggable.attr('id');
      const newDate = $(this).attr('id');
      updateTaskDate(taskId, newDate);
    }
  });
});
