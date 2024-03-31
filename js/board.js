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
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        console.log("function renderAllTasks(currentUser.tasks)" , currentUser.tasks);        
        clearTaskContainers();        
        currentUser.tasks.forEach(task => {
            renderTask(task, task.columnId);
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
    const { id, title, description, category, assignedTo, prio, date, columnId } = taskData;    
    const validColumnIds = ["todo", "inprogress", "awaitfeedback", "done"];
    const actualColumnId = validColumnIds.includes(columnId) ? columnId : "todo";
    const taskCard = renderTaskCard(id, title, description, category, assignedTo, prio, date);    
    const taskContainer = document.querySelector(`#${actualColumnId}-column .task-container`);
    if (taskContainer) {
        taskContainer.appendChild(taskCard);
        taskCard.addEventListener('dragstart', dragStart);
        taskCard.setAttribute('draggable', 'true');
    } else {
        console.error('Task container not found for column:', actualColumnId);
    }
}


function renderTaskCard(id, title, description, category, assignedTo, prio, date, columnId) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task');
    taskCard.setAttribute('id', id);
    let assignedToHTML = '';
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
        assignedToHTML = `<div>${assignedTo.userNames.join(', ')}</div>`;
    } else {
        assignedToHTML = '<div><strong>Assigned to:</strong> No one assigned</div>';
    }    
    let backgroundColor = '';
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)'; // or any other color value you prefer
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)'; // or any other color value you prefer
    }
    taskCard.innerHTML = `
        <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
        <div>${title}</div>
        <div>${description}</div>        
        ${assignedToHTML}
        <div>${prio}</div>        
    `;
    return taskCard;
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
                renderTask(task);
        });
        }
    }    
}


function dragStart(event) {    
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
            updateTaskColumnId(taskId, targetColumnId);
        }
    }
}


function updateTaskColumnId(taskId, newColumnId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            currentUser.tasks[taskIndex].columnId = newColumnId;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));        
        }
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


// Clear function for task dummys only for developers
function clearAllTasksFromLocalStorage() {
    localStorage.removeItem('currentUser.BoardTasks');
}


// Clear function for task dummys only for developers
function clearAllTasksFromLocalStorage2() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}; // Laden des aktuellen Benutzers oder eines leeren Objekts, wenn kein Benutzer vorhanden ist
    currentUser.tasks = []; // Leeres Array für Tasks erstellen
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Aktualisieren des Benutzers im localStorage
}
