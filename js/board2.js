/**
 * Renders user details like initials in a colored box.
 * @param {Object} user - The user object containing user details.
 * @returns {string} - The HTML content representing user details.
 */
function renderUserDetails(user) {
    const colorCode = user.colorCodes && user.colorCodes.length > 0 ? user.colorCodes[0] : getRandomColorHex();
    const initials = user.userNames && user.userNames.length > 0 ? user.userNames[0].slice(0, 2) : '';
    const textColor = isColorLight(colorCode) ? "black" : "white";
    return `
      <div class="boardContactInitialsandColor" style="background-color: ${colorCode}; color: ${textColor};">
        ${initials}
      </div>
    `;
}


/**
 * Saves the updated tasks data to localStorage.
 * @param {Object} currentUser - The current user object.
 */
function saveTasksToLocalStorage(currentUser) {
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}


/**
 * Loads tasks data from localStorage and renders tasks on the board.
 * @param {Object} currentUser - The current user object.
 */
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


/**
 * Handles the drag start event for task elements.
 * @param {Event} event - The dragstart event object.
 */
function dragStart(event) {    
    const taskId = event.target.id;
    event.dataTransfer.setData("text/plain", taskId);
}


/**
 * Handles the drag event for draggable elements.
 * @param {Event} event - The drag event object.
 */
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}


/**
 * Handles the dragover event to allow dropping elements.
 * @param {Event} event - The dragover event object.
 */
function allowDrop(event) {
    event.preventDefault();
}


/**
 * Handles the drop event when an element is dropped.
 * @param {Event} event - The drop event object.
 */
function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const targetColumn = event.target.closest('.boardColumn');
    if (targetColumn) {
        const targetColumnId = targetColumn.id.split('-')[0];
        const targetContainer = document.getElementById(targetColumnId + '-tasks');
        const draggedTaskElement = document.getElementById(taskId);
        if (draggedTaskElement && targetContainer) {
            if (targetContainer.contains(draggedTaskElement) === false) {
                targetContainer.appendChild(draggedTaskElement);
                updateTaskColumnId(taskId, targetColumnId);
            }
        }
    }
    renderAllTasks();
    removeHighlight(event);
}


/**
 * Highlights the target column when a task is dragged over it.
 * @param {Event} event - The dragover event object.
 */
function highlightColumn(event) {
    event.preventDefault();
    const targetColumn = event.target.closest('.boardColumn');
    if (targetColumn) {
        targetColumn.classList.add('highlight');
    }
}


/**
 * Removes the highlight from the target column when dragging leaves it.
 * @param {Event} event - The dragleave event object.
 */
function removeHighlight(event) {
    const targetColumn = event.target.closest('.boardColumn');
    if (targetColumn) {
        targetColumn.classList.remove('highlight');
    }
}


/**
 * Updates the column ID of a task and saves the changes to localStorage.
 * @param {string} taskId - The ID of the task.
 * @param {string} newColumnId - The new column ID.
 */
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


/**
 * Renders a task card as an overlay.
 * @param {string} id - Task ID.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} category - Task category.
 * @param {Object} assignedTo - Assigned to details.
 * @param {string} prio - Task priority.
 * @param {string} date - Task due date.
 * @param {string} columnId - Task column ID.
 * @param {Array} subtasks - Array of subtasks.
 */
function renderTaskCardAsOverlay(id, title, description, category, assignedTo, prio, date, columnId, subtasks) {
    prepareOverlay();
    const card = createTaskCard(category, assignedTo, prio, id);
    const subtasksHTML = boardRenderSubtasks(card, id);
    renderTaskCardAsOverlayCardHTML(card, card.bgColor, category, title, description, date, card.prioContent, card.assignedToHTML, subtasksHTML, id);
    document.body.appendChild(card.overlay);
}


/**
 * Prepares and opens the task overlay.
 */
function prepareOverlay() {
    closeOverlayBoard();
    restoreBackgroundOnOverlayClose();
    changeBackgroundOnOverlayOpen();
}


/**
 * Creates and configures the task card elements.
 * @param {string} category - Task category.
 * @param {Object} assignedTo - Assigned to details.
 * @param {string} prio - Task priority.
 * @param {string} id - Task ID.
 * @returns {Object} Object containing the card, assignedToHTML, prioContent, and backgroundColor.
 */
function createTaskCard(category, assignedTo, prio, id) {
    const overlay = document.createElement('div');
    overlay.classList.add('boardoverlay');
    const card = document.createElement('div');
    card.classList.add('card');
    const assignedToHTML = renderTaskCardAsOverlayAssignetTo(assignedTo);
    const bgColor = renderTaskCardAsOverlayCategory(category, '');
    const prioContent = renderTaskCarsAsOverlayPrio(prio, prio);
    return { overlay, card, assignedToHTML, prioContent, bgColor };
}


/**
 * Creates an overlay with a semi-transparent background.
 * @returns {HTMLElement} The created overlay element.
 */
function changeBackgroundOnOverlayOpen() {
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.classList.add('fullscreen-overlay');
    fullscreenOverlay.style.display = 'flex';
    fullscreenOverlay.style.position = 'fixed';
    fullscreenOverlay.style.top = '0';
    fullscreenOverlay.style.left = '0';
    fullscreenOverlay.style.width = '100%';
    fullscreenOverlay.style.height = '100%';
    fullscreenOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    fullscreenOverlay.style.zIndex = '999';
    document.body.appendChild(fullscreenOverlay);
    return fullscreenOverlay;
}


/**
 * Removes the overlay with the semi-transparent background.
 */
function restoreBackgroundOnOverlayClose() {    
    const fullscreenOverlay = document.querySelector('.fullscreen-overlay');
    if (fullscreenOverlay) {
        fullscreenOverlay.remove();
    }
}


/**
 * Renders the HTML content of a task card overlay.
 * @param {HTMLElement} card - Task card element.
 * @param {string} backgroundColor - Background color.
 * @param {string} category - Task category.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} date - Task due date.
 * @param {string} prioContent - Priority content.
 * @param {string} assignedToHTML - Assigned to HTML content.
 * @param {string} subtasksHTML - Subtasks HTML content.
 * @param {string} id - Task ID.
 */
function renderTaskCardAsOverlayCardHTML(card, backgroundColor, category, title, description, date, prioContent, assignedToHTML, subtasksHTML, id) {
    card.innerHTML = `
        <div class="boardOverlayCategoryAndCloseXContainer">            
            <div class="renderTaskCardOverlayCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
            <div><img class="boardTaskOverlayCloseX" onclick="closeOverlayBoard()" src="./assets/img/boardTaskOverlayCloseX.svg" alt=""></div>
        </div>        
        <div class="renderTaskTitleOverlay">${title}</div>
        <div class="renderTaskDescriptionOverlay">${description}</div>
        <div class="renderTaskDate"><p class="renderTaskDatePElement">Due date:</p><p class="renderTaskOverlayDate">${date}</p></div>               
        <div class="overlayAssignetToHTMLAndPrioContentContainer">
            <div class="boardPriorityContainer">
                <div class="renderTaskOverlayPrio">Priority:</div>
                <div class="boardPrioIcon displayFlex">${prioContent}</div>
            </div>  
            <div class="renderTaskCardOverlayAssignetToContainer">
                <p class="renderTaskCardOverlayAssignetToPElement">Assigned To:</p>
                <p>${assignedToHTML}</p>
            </div>            
        </div>
        <div class="renderTasksubtaskHTML"><p class="renderTasksubtaskHTMLSubtaskPElement">Subtasks</p>${subtasksHTML}</div>
        <div class="contactsContentRightSideEditAndDeleteButtonContainerBoardOverlay">
            <img class="contactsContentRightSideEditButton" src="./assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="boardEditTask('${id}')">
            <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteTask('${id}')">
        </div>
    `;
}


/**
 * Renders the priority content for the task card overlay.
 * @param {string} prio - Task priority.
 * @param {string} prioContent - Priority content.
 * @returns {string} - Rendered priority content.
 */
function renderTaskCarsAsOverlayPrio(prio, prioContent) {
    if (prio === 'urgent') {
        prioContent = `<p class="boardOverlayUrgentPElement">Urgent</p><div class="boardOverlayPriorityIcon"><img class="boardOverlayPriorityIcon" src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority"></div>`;
    } else if (prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement">Medium</p><div class="boardOverlayPriorityIcon"><img class="boardOverlayPriorityIcon" src="./assets/img/mediumCategory.svg" alt="Medium Priority"></div>`;
    } else if (prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement">Low</p><div class="boardOverlayPriorityIcon"><img class="boardOverlayPriorityIcon" src="./assets/img/lowPrio.svg" alt="Low Priority"></div>`;
    }
    return prioContent;
}


/**
 * Renders the background color for the task card overlay based on the category.
 * @param {string} category - Task category.
 * @param {string} backgroundColor - Background color.
 * @returns {string} - Rendered background color.
 */
function renderTaskCardAsOverlayCategory(category, backgroundColor) {
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    return backgroundColor;
}


/**
 * Renders the HTML content for the assigned to section of the task card overlay.
 * @param {Object} assignedTo - Assigned to details.
 * @returns {string} - Rendered HTML content for the assigned to section.
 */
function renderTaskCardAsOverlayAssignetTo(assignedTo) {
    let assignedToHTML = '';
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
        assignedTo.userNames.forEach((userName, index) => {
            const initials = getFirstLettersOfName(userName);
            const backgroundColor = assignedTo.colorCodes[index];
            const iconHTML = `<div class="userIcon" style="background-color: ${backgroundColor};">${initials}</div>`;
            assignedToHTML += `<div class="assignedToUser">${iconHTML} <p class="editAssignetToUserPElement">${userName}</p></div>`;
        });
    } else {
        assignedToHTML = '<div><strong>Assigned to:</strong> No one assigned</div>';
    }
    return assignedToHTML;
}


/**
 * Adds click event listeners to task cards.
 */
function addTaskClickListener() {
    const taskCards = document.querySelectorAll('.task');
    taskCards.forEach(taskCard => {        
        taskCard.removeEventListener('click', renderTaskCardOverlay);        
        taskCard.addEventListener('click', renderTaskCardOverlay);
    });
}


/**
 * Renders the task card overlay when a task is clicked.
 * @param {Event} event - Click event.
 */
function renderTaskCardOverlay(event) {
    const taskId = event.currentTarget.id;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (task) {        
        const subtasks = task.subtasks;        
        renderTaskCardAsOverlay(task.id, task.title, task.description, task.category, task.assignedTo, task.prio, task.date, task.columnId, subtasks);
    }
}


/**
 * Closes the task card overlay.
 */
function closeOverlayBoard() {
    const overlay = document.querySelector('.boardoverlay');
    if (overlay) {
        overlay.remove();
    }
    restoreBackgroundOnOverlayClose();
}


/**
 * Deletes a task.
 * @param {string} id - Task ID.
 */
function deleteTask(id) {    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    const stringId = id.toString();
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === stringId);
        if (taskIndex !== -1) {
            currentUser.tasks.splice(taskIndex, 1);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));            
            updateCurrentUserInBackend(currentUser);
            closeOverlayBoard();
            renderAllTasks();
        }
    }
}


/**
 * Opens an overlay to edit a task.
 * @param {string} taskId - ID of the task to be edited.
 */
function boardEditTask(taskId) {
    closeOverlayBoard();
    const task = getTaskFromLocalStorage(taskId);
    if (task) createTaskEditOverlay(task, taskId);
    changeBackgroundOnOverlayOpen();
    activateSubtaskListener(taskId);
}