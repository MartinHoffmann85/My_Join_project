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
    removeHighlight(event);    
    handleDrop(taskId, targetColumn, event);
}


/**
 * Handles task dropping and updating the task's column.
 * @param {string} taskId - The ID of the dragged task.
 * @param {HTMLElement} targetColumn - The target column where the task is dropped.
 * @param {Event} event - The drop event object.
 */
function handleDrop(taskId, targetColumn, event) {
    if (targetColumn) {
        const targetColumnId = getColumnId(targetColumn);
        const targetContainer = document.getElementById(targetColumnId + '-tasks');
        moveTaskToColumn(taskId, targetContainer, targetColumnId);
    }
    finalizeDrop(event);
}


/**
 * Gets the ID of the target column.
 * @param {HTMLElement} targetColumn - The target column element.
 * @returns {string} - The ID of the column.
 */
function getColumnId(targetColumn) {
    return targetColumn.id.split('-')[0];
}


/**
 * Moves the task to the specified column if not already present.
 * @param {string} taskId - The ID of the task being moved.
 * @param {HTMLElement} targetContainer - The container for the tasks in the target column.
 * @param {string} targetColumnId - The ID of the target column.
 */
function moveTaskToColumn(taskId, targetContainer, targetColumnId) {
    const draggedTaskElement = document.getElementById(taskId);
    if (draggedTaskElement && targetContainer && !targetContainer.contains(draggedTaskElement)) {
        targetContainer.appendChild(draggedTaskElement);
        updateTaskColumnId(taskId, targetColumnId);
    }
}


/**
 * Finalizes the drop by rendering tasks and removing highlights.
 * @param {Event} event - The drop event object.
 */
function finalizeDrop(event) {
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
    if (targetColumn && targetColumn.classList.contains('highlight')) {
        targetColumn.classList.remove('highlight');
    }
}


/**
 * Handles the dragleave event when a task leaves the target column.
 * @param {Event} event - The dragleave event object.
 */
function handleDragLeave(event) {
    removeHighlight(event);
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
    setupOverlayEnvironment();
    const overlay = createOverlayElement();
    const card = createCardElement();    
    let assignedToHTML = renderTaskCardAsOverlayAssignetTo(assignedTo);
    let backgroundColor = getCategoryBackgroundColor(category);
    let prioContent = getPrioContent(prio);    
    const subtasksHTML = boardRenderSubtasks(card, id);
    renderTaskCardContent(card, backgroundColor, category, title, description, date, prioContent, assignedToHTML, subtasksHTML, id);    
    finalizeOverlay(overlay, card);
}


/**
 * Sets up the environment by closing existing overlays and restoring the background.
 */
function setupOverlayEnvironment() {
    closeOverlayBoard();
    restoreBackgroundOnOverlayClose();
}


/**
 * Creates the overlay element.
 * @returns {HTMLElement} The overlay div element.
 */
function createOverlayElement() {
    const overlay = document.createElement('div');
    overlay.classList.add('boardoverlay');
    return overlay;
}


/**
 * Creates the card element.
 * @returns {HTMLElement} The card div element.
 */
function createCardElement() {
    const card = document.createElement('div');
    card.classList.add('card');
    return card;
}


/**
 * Gets the background color based on the task category.
 * @param {string} category - Task category.
 * @returns {string} The background color.
 */
function getCategoryBackgroundColor(category) {
    let backgroundColor = '';
    return renderTaskCardAsOverlayCategory(category, backgroundColor);
}


/**
 * Gets the priority content.
 * @param {string} prio - Task priority.
 * @returns {string} The priority content.
 */
function getPrioContent(prio) {
    let prioContent = prio;
    return renderTaskCarsAsOverlayPrio(prio, prioContent);
}


/**
 * Renders the task card content inside the card element.
 */
function renderTaskCardContent(card, backgroundColor, category, title, description, date, prioContent, assignedToHTML, subtasksHTML, id) {
    renderTaskCardAsOverlayCardHTML(card, backgroundColor, category, title, description, date, prioContent, assignedToHTML, subtasksHTML, id);
}


/**
 * Finalizes the overlay by appending the card and changing the background.
 */
function finalizeOverlay(overlay, card) {
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    changeBackgroundOnOverlayOpen();
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