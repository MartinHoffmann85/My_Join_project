async function initBoard() {
    const currentUser = await JSON.parse(localStorage.getItem('currentUser'));
    loadTasksFromLocalStorage(currentUser);
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 500);
}


function redirectToAddTask() {
    window.location.assign("../add_task.html");
}


function renderAllTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('currentUser:', currentUser);
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {        
        clearTaskContainers();        
        currentUser.tasks.forEach(task => {
            renderTask(task, task.columnId); // Übergeben Sie die Spalten-ID des Tasks
        });
    } else {
        console.error('Invalid tasks data in localStorage');
    }
}


function clearTaskContainers() {
    const columns = document.querySelectorAll('.boardColumn');
    columns.forEach(column => {
        const taskContainer = column.querySelector('.task-container');
        taskContainer.innerHTML = '';
    });
}


function renderTask(taskData) {
    const { id, title, description, category, assignedTo, prio, dueDate, columnId } = taskData;
    const taskCard = document.createElement('div');
    taskCard.classList.add('task');
    taskCard.setAttribute('id', id);
    taskCard.innerHTML = `
        <div><strong>Title:</strong> ${title}</div>
        <div><strong>Description:</strong> ${description}</div>
        <div><strong>Category:</strong> ${category}</div>
        <div><strong>Assigned to:</strong> ${assignedTo}</div>
        <div><strong>Prio:</strong> ${prio}</div>
        <div><strong>Due Date:</strong> ${dueDate}</div>
    `;
    const taskContainer = document.querySelector(`#${columnId}-tasks`);
    if (taskContainer) {
        taskContainer.appendChild(taskCard);
        taskCard.addEventListener('dragstart', dragStart);
        taskCard.setAttribute('draggable', 'true');
    } else {
        console.error('Task container not found for column:', columnId);
    }
}


function saveTasksToLocalStorage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        localStorage.setItem('currentUser.tasks', JSON.stringify(currentUser.tasks));
    } else {
        console.error('Invalid currentUser data in localStorage');
    }
}


function loadTasksFromLocalStorage(currentUser) {
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const tasksJSON = localStorage.getItem('currentUser.tasks');
        if (tasksJSON) {
            const tasks = JSON.parse(tasksJSON);
            currentUser.tasks = tasks;
            clearTaskContainers();
            tasks.forEach(task => {
                renderTask(task, task.columnId);
            });
        }
    } else {
        console.error('Invalid tasks data in localStorage');
    }
}


function dragStart(event) {
    console.log("function dragStart(event)", event);
    const taskId = event.target.id;
    event.dataTransfer.setData("text/plain", taskId);
}


function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}


function allowDrop(event) {
    event.preventDefault();
}


function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const targetColumn = event.target.closest('.boardColumn');
    if (targetColumn) {
        const targetColumnId = targetColumn.id.split('-')[0];
        const targetContainer = document.getElementById(targetColumnId + '-tasks');
        const draggedTaskElement = document.getElementById(taskId);
        if (draggedTaskElement && targetContainer) {
            targetContainer.appendChild(draggedTaskElement);
            saveTasksToLocalStorage();
        } else {
            console.error('Invalid dragged task element or target container');
        }
    } else {
        console.error('Target column not found');
    }
}


// Clear function for task dummys only for developers
function clearTasksFromLocalStorage() {
    localStorage.removeItem('currentUser.BoardTasks');    
    const taskContainers = document.querySelectorAll('.task-container');
    taskContainers.forEach(container => {
        container.innerHTML = '';
    });
}


function clearAllTasksFromLocalStorage() {
    localStorage.removeItem('currentUser.BoardTasks');
}


function clearAllTasksFromLocalStorage2() {
    const tasksJSON = localStorage.getItem('currentUser.tasks');
    tasksJSON = localStorage.removeItem('currentUser.tasks');
    tasksJSON= localStorage.setItem('currentUser.tasks', JSON.stringify(tasks));
}