function initBoard() {
    loadTasksFromLocalStorage();
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
        currentUser.tasks.forEach(task => {
            renderTask(task, 'todo');
        });
    } else {
        console.error('Invalid tasks data in localStorage');
    }
}


function renderTask(taskData, columnId) {
    const { id, title, description, category, assignedTo, prio, dueDate } = taskData;
    const taskCard = document.createElement('div');
    taskCard.classList.add('task');
    taskCard.setAttribute('id', id);
    taskCard.setAttribute('draggable', 'true');
    taskCard.innerHTML = `
        <div><strong>Title:</strong> ${title}</div>
        <div><strong>Description:</strong> ${description}</div>
        <div><strong>Category:</strong> ${category}</div>
        <div><strong>Assigned to:</strong> ${assignedTo}</div>
        <div><strong>Prio:</strong> ${prio}</div>
        <div><strong>Due Date:</strong> ${dueDate}</div>
    `;
    const taskContainer = document.getElementById(`${columnId}-tasks`);
    taskContainer.appendChild(taskCard);    
    taskCard.addEventListener('dragstart', dragStart);
}


function saveTasksToLocalStorage() {
    const columns = document.querySelectorAll('.boardColumn');
    let boardTasks = localStorage.getItem('currentUser.BoardTasks');
    if (!boardTasks) {
        boardTasks = {};
    } else {
        boardTasks = JSON.parse(boardTasks);
    }
    columns.forEach(column => {
        const columnId = column.id;
        const tasks = column.querySelectorAll('.task');
        const taskList = [];
        tasks.forEach(task => {
            taskList.push(task.textContent.trim());
        });
        boardTasks[columnId] = taskList;
    });    
    localStorage.setItem('currentUser.BoardTasks', JSON.stringify(boardTasks));
}


function loadTasksFromLocalStorage() {
    const boardTasksJSON = localStorage.getItem('currentUser.BoardTasks');
    console.log("function loadTasksFromLocalStorage()" , boardTasksJSON);
    if (boardTasksJSON) {
        const boardTasks = JSON.parse(boardTasksJSON);
        Object.keys(boardTasks).forEach(columnId => {
            const tasks = boardTasks[columnId];
            const column = document.getElementById(columnId);
            if (column) {
                tasks.forEach(taskText => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.textContent = taskText;
                    taskElement.setAttribute('draggable', 'true');
                    column.appendChild(taskElement);                    
                    taskElement.addEventListener('dragstart', dragStart);
                });
            }
        });
    }
}


function dragStart(event) {
    console.log("function dragStart(event)" , event);
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
    const targetColumnId = event.target.closest('.boardColumn').id.split('-')[0];
    const targetContainer = document.getElementById(targetColumnId + '-tasks');    
    const draggedTaskElement = document.getElementById(taskId);    
    if (draggedTaskElement && targetContainer) {
        targetContainer.appendChild(draggedTaskElement);
        saveTasksToLocalStorage();
    } else {
        console.error('Invalid dragged task element or target container');
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