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
    const selectedContacts = Array.from(document.querySelectorAll('.contact-option.selected')).map(contact => contact.textContent.trim());
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const { userNames, colorCodes } = currentUser.tasks[taskIndex].assignedTo || { userNames: [], colorCodes: [] };
      userNames.length = 0;
      colorCodes.length = 0;
      selectedContacts.forEach(contactName => {
        userNames.push(contactName);
        colorCodes.push(getColorCodeForContact(currentUser.contacts, contactName));
      });
      saveTasksToLocalStorage(currentUser);
      updateCurrentUserInBackend(currentUser);
      boardEditTask(taskId);
    }
}


/**
 * Retrieves the color code for a given contact name from the contacts list.
 * @param {Array} contacts - List of contacts.
 * @param {string} contactName - Name of the contact to retrieve the color code for.
 * @returns {string} - Color code associated with the contact.
 */
function getColorCodeForContact(contacts, contactName) {
    const contact = contacts.find(contact => contact.name === contactName);
    if (contact) {
        return contact.colorCode;
    }
}


/**
 * Updates the task in local storage and backend after editing.
 * @param {string} taskId - ID of the task.
 */
function boardEditTaskUpdate(taskId) {
    const { task, updatedTitle, updatedDescription, updatedDate, updatedPriority } = boardEditTaskUpdateVariables(taskId);    
    if (task) {        
        task.title = updatedTitle;
        task.description = updatedDescription;
        task.date = updatedDate;
        task.prio = updatedPriority;        
        updateTaskInLocalStorageAndBackend(taskId, task);        
        closeOverlayBoard();
        initBoard();
    }
}


/**
 * Collects the updated task information from the edit task form.
 * @param {string} taskId - ID of the task.
 * @returns {Object} - Object containing the task and updated information.
 */
function boardEditTaskUpdateVariables(taskId) {
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionTextarea = document.getElementById('editDescription');
    const editDateInput = document.getElementById('editDate');
    const editPrioritySelect = document.getElementById('editPriority');
    const updatedTitle = editTitleInput.value;
    const updatedDescription = editDescriptionTextarea.value;
    const updatedDate = editDateInput.value;
    const updatedPriority = editPrioritySelect.value;
    const task = getTaskFromLocalStorage(taskId);
    return { task, updatedTitle, updatedDescription, updatedDate, updatedPriority };
}


/**
 * Updates the task in local storage and backend.
 * @param {string} taskId - ID of the task.
 * @param {Object} updatedTask - Updated task object.
 */
function updateTaskInLocalStorageAndBackend(taskId, updatedTask) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            currentUser.tasks[taskIndex] = updatedTask;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateCurrentUserInBackend(currentUser);
        }
    }
}


/**
 * Searches tasks based on the input provided in the search input field.
 */
function searchTasks() {
    const searchInput = document.getElementById('boardSearchInputID').value.toLowerCase();
    const taskCards = document.querySelectorAll('.task');    
    taskCards.forEach(taskCard => {
        const taskTitle = taskCard.querySelector('.renderTaskTitlePElement').textContent.toLowerCase();
        const taskDescription = taskCard.querySelector('.renderTaskDescription').textContent.toLowerCase();        
        if (taskTitle.includes(searchInput) || taskDescription.includes(searchInput)) {
            taskCard.style.display = 'block';
        } else {
            taskCard.style.display = 'none';
        }
    });
}


/**
 * Adds a new subtask to the specified task.
 * @param {string} taskId - ID of the task to which the subtask is added.
 */
function addSubtask(taskId) {
    const newSubtaskInput = document.getElementById('newSubtaskInput');
    const subtaskTitle = newSubtaskInput.value.trim();
    if (subtaskTitle !== '') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {            
            if (!currentUser.tasks[taskIndex].subtasks) {
                currentUser.tasks[taskIndex].subtasks = [];
            }            
            addSubtaskSaveAndRedirectToBoardEditTask(subtaskTitle, currentUser, taskIndex, taskId);
        }
    }
}


/**
 * Saves the new subtask to local storage, updates the backend, and redirects to edit task view.
 * @param {string} subtaskTitle - Title of the new subtask.
 * @param {Object} currentUser - Current user object.
 * @param {number} taskIndex - Index of the task in the user's tasks array.
 * @param {string} taskId - ID of the task to which the subtask is added.
 */
function addSubtaskSaveAndRedirectToBoardEditTask(subtaskTitle, currentUser, taskIndex, taskId) {
    const newSubtask = addSubtaskNewSubtask(subtaskTitle);
    currentUser.tasks[taskIndex].subtasks.push(newSubtask);
    saveTasksToLocalStorage(currentUser);
    updateCurrentUserInBackend(currentUser);
    boardEditTask(taskId);
}


/**
 * Creates a new subtask object with a random ID.
 * @param {string} subtaskTitle - Title of the new subtask.
 * @returns {Object} - New subtask object.
 */
function addSubtaskNewSubtask(subtaskTitle) {
    return {
        id: boardGenerateRandomID(),
        title: subtaskTitle,
        completed: false
    };
}


/**
 * Generates a random alphanumeric ID.
 * @returns {string} - Random alphanumeric ID.
 */
function boardGenerateRandomID() {    
    return Math.random().toString(36).substring(2, 11);
}