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