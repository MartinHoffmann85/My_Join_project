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
            addTaskClickListener();
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
        assignedTo.userNames.forEach((userName, index) => {
            const user = {
                userNames: [userName],
                colorCodes: [assignedTo.colorCodes[index]],
            };
            assignedToHTML += renderUserDetails(user);
        });
    } else {
        assignedToHTML = '<div><strong>Assigned to:</strong> No one assigned</div>';
    }
    let backgroundColor = '';
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    let prioContent = prio;
    if (prio === 'urgent') {
        prioContent = `<img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (prio === 'medium') {
        prioContent = `<img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (prio === 'low') {
        prioContent = `<img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }    
    const subtasksHTML = boardRenderSubtasks(taskCard, id);    
    taskCard.innerHTML = `
        <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
        <div class="renderTaskTitle"><strong>${title}</strong></div>
        <div class="renderTaskDescription">${description}</div>
        <div class="renderTasksubtaskHTML">${subtasksHTML}</div>       
        <div class="assignetToHTMLAndPrioContentContainer">   
            <div class="renderTaskCardAssignetToContainer">${assignedToHTML}</div>
            <div class="renderTaskToHTMLPrioContainer">${prioContent}</div>
        </div>        
    `;    
    return taskCard;    
}


function boardRenderSubtasks(taskCard, taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (!task || !task.subtasks || task.subtasks.length === 0) {
        return '';
    }    
    let subtasksHTML = '<div></div>';
    task.subtasks.forEach(subtask => {
        subtasksHTML += `<div>${subtask.title}</div>`;
    });    
    return subtasksHTML;
}


function renderUserDetails(user) {
    const colorCode = user.colorCodes && user.colorCodes.length > 0 ? user.colorCodes[0] : getRandomColorHex();
    const initials = user.userNames && user.userNames.length > 0 ? user.userNames[0].split(' ').map(word => word[0]).join('') : '';
    const textColor = isColorLight(colorCode) ? "black" : "white";
    return `
      <div class="boardContactInitialsandColor" style="background-color: ${colorCode}; color: ${textColor};">
        ${initials}
      </div>
    `;
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


async function updateTaskColumnId(taskId, newColumnId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            currentUser.tasks[taskIndex].columnId = newColumnId;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            await updateCurrentUserInBackend(currentUser);        
        }
    }
}


function renderTaskCardAsOverlay(id, title, description, category, assignedTo, prio, date, columnId) {
    const overlay = document.createElement('div');
    overlay.classList.add('boardoverlay');    
    const card = document.createElement('div');
    card.classList.add('card');    
    let assignedToHTML = '';
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
        assignedTo.userNames.forEach((userName, index) => {
            const user = {
                userNames: [userName],
                colorCodes: [assignedTo.colorCodes[index]],
            };
            assignedToHTML += renderUserDetails(user);
        });
    } else {
        assignedToHTML = '<div><strong>Assigned to:</strong> No one assigned</div>';
    }    
    let backgroundColor = '';
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }    
    let prioContent = prio;
    if (prio === 'urgent') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }    
    // const subtasksHTML = boardRenderSubtasks(taskCard, id);
    card.innerHTML = `
        <div class="boardOverlayCategoryAndCloseXContainer">            
            <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
            <div><img class="boardTaskOverlayCloseX" onclick="closeOverlayBoard()" src="./assets/img/boardTaskOverlayCloseX.svg" alt=""></div>
        </div>        
        <div class="renderTaskTitleOverlay"><strong>${title}</strong></div>
        <div class="renderTaskDescriptionOverlay">${description}</div>
        <div class="renderTaskDate"><p class="renderTaskDatePElement">Due date:</p><p class="renderTaskOverlayDate">${date}</p></div>
               
        <div class="overlayAssignetToHTMLAndPrioContentContainer">
            <div class="boardPriorityContainer">
                <div class="renderTaskOverlayPrio">Priority:</div>
                <div class="boardPrioIcon displayFlex">${prioContent}</div>
            </div>  
            <div class="renderTaskCardOverlayAssignetToContainer">
                <p class="renderTaskCardOverlayAssignetToPElement">Assignet To:</p>
                <p class="">${assignedToHTML}</p>
            </div>            
        </div>
        <div class="contactsContentRightSideEditAndDeleteButtonContainerBoardOverlay">
            <img class="contactsContentRightSideEditButton" src="./assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="">
            <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="">
        </div>
    `;    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}


// <div class="renderTasksubtaskHTML">${subtasksHTML}</div>

function addTaskClickListener() {
    const taskCards = document.querySelectorAll('.task');
    taskCards.forEach(taskCard => {        
        taskCard.removeEventListener('click', renderTaskCardOverlay);        
        taskCard.addEventListener('click', renderTaskCardOverlay);
    });
}


function renderTaskCardOverlay(event) {
    const taskId = event.currentTarget.id;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (task) {
        renderTaskCardAsOverlay(task.id, task.title, task.description, task.category, task.assignedTo, task.prio, task.date, task.columnId);
    } else {
        console.error('Task not found');
    }
}


function closeOverlayBoard() {
    const overlay = document.querySelector('.boardoverlay');
    if (overlay) {
        overlay.remove();
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
    updateCurrentUserInBackend(currentUser);
}
