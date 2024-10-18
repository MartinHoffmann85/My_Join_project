/**
 * Opens an overlay to edit a task.
 * @param {string} taskId - ID of the task to be edited.
 */
function boardEditTask(taskId) {
    closeOverlayBoard();
    const task = getTaskFromLocalStorage(taskId);
    if (task) {
        const overlay = createEditOverlay(task, taskId);
        finalizeEditOverlay(overlay);
    }
    activateSubtaskListener(taskId);
}


/**
 * Creates the overlay for editing a task.
 * @param {Object} task - The task object.
 * @param {string} taskId - The task ID.
 * @returns {HTMLElement} - The overlay element.
 */
function createEditOverlay(task, taskId) {
    const overlay = document.createElement('div');
    overlay.classList.add('boardoverlay');
    const card = createEditCard(task, taskId);
    overlay.appendChild(card);
    return overlay;
}


/**
 * Creates the card for the edit overlay.
 * @param {Object} task - The task object.
 * @param {string} taskId - The task ID.
 * @returns {HTMLElement} - The card element.
 */
function createEditCard(task, taskId) {
    const card = document.createElement('div');
    card.classList.add('card');
    const backgroundColor = boardEditTaskCategory(task);
    boardEditTaskPrio(task);
    const assignedToHTML = boardEditTaskAssignetTo(task);
    boardTaskEditHTML(card, backgroundColor, task, taskId, assignedToHTML);
    const editTitleElement = card.querySelector('#editTitle');
    if (editTitleElement) {
        editTitleElement.addEventListener('input', (e) => {
            tempTitle = e.target.value;
        });
    }
    const editDescriptionElement = card.querySelector('#editDescription');
    if (editDescriptionElement) {
        editDescriptionElement.addEventListener('input', (e) => {
            tempDescription = e.target.value;
        });
    }
    return card;
}


/**
 * Finalizes the edit overlay by appending it to the document and changing the background.
 * @param {HTMLElement} overlay - The overlay element.
 */
function finalizeEditOverlay(overlay) {
    document.body.appendChild(overlay);
    changeBackgroundOnOverlayOpen();
}


/**
 * Activates a listener for adding a subtask when the Enter key is pressed.
 * The function retrieves the input field for the new subtask and sets up
 * an event listener that listens for a 'keydown' event. If the Enter key 
 * is pressed and the input field is not empty, the subtask is added using
 * the `addSubtask` function, and the input field is cleared.
 *
 * @param {string} taskId - The ID of the task to which the subtask will be added.
 */
function activateSubtaskListener(taskId) {
    const subtaskInput = document.getElementById('newSubtaskInput');
    if (!subtaskInput) {
        console.error('Subtask input field not found.');
        return;
    }
    subtaskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const subtaskTitle = subtaskInput.value.trim();
            if (subtaskTitle) {
                addSubtask(taskId, subtaskTitle);
                subtaskInput.value = '';
            }
        }
    });
}


/**
 * Creates the task edit overlay.
 * @param {Object} task - The task object to edit.
 * @param {string} taskId - ID of the task.
 */
function createTaskEditOverlay(task, taskId) {
    const overlay = createOverlayElement();
    const card = createCardElement();
    const backgroundColor = boardEditTaskCategory(task);
    const assignedToHTML = boardEditTaskAssignetTo(task);
    boardEditTaskPrio(task);
    boardTaskEditHTML(card, backgroundColor, task, taskId, assignedToHTML);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}


/**
 * Creates an overlay div element.
 * @returns {HTMLElement} The overlay div element.
 */
function createOverlayElement() {
    const overlay = document.createElement('div');
    overlay.classList.add('boardoverlay');
    return overlay;
}


/**
 * Creates a card div element.
 * @returns {HTMLElement} The card div element.
 */
function createCardElement() {
    const card = document.createElement('div');
    card.classList.add('card');
    return card;
}


/**
 * Renders the assigned to HTML for editing a task.
 * @param {Object} task - Task object.
 * @returns {string} - Assigned to HTML content.
 */
function boardEditTaskAssignetTo(task) {
    const assignedToContacts = task.assignedTo && task.assignedTo.userNames ? task.assignedTo.userNames : [];
    const assignedToColors = task.assignedTo && task.assignedTo.colorCodes ? task.assignedTo.colorCodes : [];
    const assignedToHTML = assignedToContacts.map((userName, index) => {
        const user = {
            userNames: [getFirstLettersOfName(userName)],
            colorCodes: [assignedToColors[index]],
        };
        const backgroundColor = assignedToColors[index];
        const initials = getFirstLettersOfName(userName);
        const iconHTML = `<div class="userIcon" style="background-color: ${backgroundColor};">${initials}</div>`;
        return `<div class="assignedToUser">${iconHTML} <p class="editAssignetToUserPElement">${userName}</p></div>`;
    }).join('');
    return assignedToHTML;
}


/**
 * Renders the priority HTML for editing a task.
 * @param {Object} task - Task object.
 */
function boardEditTaskPrio(task) {
    let prioContent = task.prio;
    if (task.prio === 'urgent') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (task.prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (task.prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }
}


/**
 * Renders the category background color for editing a task.
 * @param {Object} task - Task object.
 * @returns {string} - Background color.
 */
function boardEditTaskCategory(task) {
    let backgroundColor = '';
    if (task.category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (task.category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    return backgroundColor;
}


/**
 * Generates the HTML options for selecting assigned contacts.
 * @param {Object} assignedTo - Assigned contacts object.
 * @param {string} taskId - ID of the task.
 * @returns {string} - HTML content for the options.
 */
function generateAssignedToOptions(assignedTo, taskId) {        
    const currentUserContacts = JSON.parse(localStorage.getItem('currentUser')).contacts;
    if (!currentUserContacts || currentUserContacts.length === 0) {
        return '<li>No contacts available</li>';
    }
    return currentUserContacts.map(contact => {
        const selected = assignedTo && assignedTo.userNames && assignedTo.userNames.includes(contact.name) ? 'selected' : '';        
        return `<li class="contact-option ${selected}" onclick="selectContact(this, '${taskId}')">${contact.name}</li>`;
    }).join('');    
}


/**
 * Toggles the visibility of the dropdown menu for selecting contacts.
 */
function boardToggleDropdownMenu() {
    const dropdown = document.getElementById('boardContactDropDownmenuID');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}


/**
 * Handles the selection of a contact and updates the assigned contacts.
 * @param {HTMLElement} contactElement - Selected contact element.
 * @param {string} taskId - ID of the task.
 */
function selectContact(contactElement, taskId) {
    contactElement.classList.toggle('selected');
    editUpdateAssignedTo(taskId);
}


/**
 * Retrieves a task from local storage based on its ID.
 * @param {string} taskId - ID of the task to retrieve.
 * @returns {Object} - Task object.
 */
function getTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('currentUser')).tasks;
    return tasks.find(task => task.id === taskId);
}


/**
 * Updates the assigned contacts for a task after editing.
 * @param {string} taskId - ID of the task.
 */
function editUpdateAssignedTo(taskId) {
    const selectedContacts = getSelectedContacts();
    const currentUser = getCurrentUser();
    const taskIndex = findTaskIndex(currentUser, taskId);
    if (taskIndex !== -1) {
        updateAssignedContacts(currentUser, taskIndex, selectedContacts);
        saveAndRefreshTask(currentUser, taskId);
    }
}


/**
 * Retrieves the list of selected contacts from the DOM.
 * @returns {Array} - Array of selected contact names.
 */
function getSelectedContacts() {
    return Array.from(document.querySelectorAll('.contact-option.selected')).map(contact => contact.textContent.trim());
}