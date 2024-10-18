document.addEventListener('click', function() {
    const dropdowns = document.querySelectorAll('.boardDropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
});


window.addEventListener('resize', updateDropdownVisibility);


/**
 * Fetches the current user from localStorage.
 * @returns {Object} - The current user object.
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}


/**
 * Finds the index of the task in the user's task list.
 * @param {Object} currentUser - The current user object.
 * @param {string} taskId - The task ID.
 * @returns {number} - The index of the task.
 */
function findTaskIndex(currentUser, taskId) {
    return currentUser.tasks.findIndex(task => task.id === taskId);
}


/**
 * Updates the assigned contacts and their color codes for a task.
 * @param {Object} currentUser - The current user object.
 * @param {number} taskIndex - The index of the task.
 * @param {Array} selectedContacts - List of selected contact names.
 */
function updateAssignedContacts(currentUser, taskIndex, selectedContacts) {
    const { userNames, colorCodes } = currentUser.tasks[taskIndex].assignedTo || { userNames: [], colorCodes: [] };
    userNames.length = 0;
    colorCodes.length = 0;
    selectedContacts.forEach(contactName => {
        userNames.push(contactName);
        colorCodes.push(getColorCodeForContact(currentUser.contacts, contactName));
    });
}


/**
 * Saves the updated tasks to localStorage and refreshes the task view.
 * @param {Object} currentUser - The current user object.
 * @param {string} taskId - The task ID.
 */
function saveAndRefreshTask(currentUser, taskId) {
    saveTasksToLocalStorage(currentUser);
    updateCurrentUserInBackend(currentUser);
    boardEditTask(taskId);
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
    const foundTask = displayTasks(taskCards, searchInput);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        checkForTasks(foundTask);
    }, 2000);
}


/**
 * Displays tasks based on the search input.
 * @param {NodeList} taskCards - The list of task elements.
 * @param {string} searchInput - The search query.
 * @returns {boolean} - Returns true if at least one task is found, otherwise false.
 */
function displayTasks(taskCards, searchInput) {
    let foundTask = false;
    taskCards.forEach(taskCard => {
        const taskTitle = taskCard.querySelector('.renderTaskTitlePElement').textContent.toLowerCase();
        const taskDescription = taskCard.querySelector('.renderTaskDescription').textContent.toLowerCase();        
        if (taskTitle.includes(searchInput) || taskDescription.includes(searchInput)) {
            taskCard.style.display = 'block';
            foundTask = true;
        } else {
            taskCard.style.display = 'none';
        }
    });
    return foundTask;
}


/**
 * Checks if any tasks were found and displays an alert if none were found.
 * @param {boolean} foundTask - Indicates whether any tasks were found.
 */
function checkForTasks(foundTask) {
    if (!foundTask) {
        alert('No task was found');
        alert('No task was found');
    }
}


/**
 * Adds a new subtask to the specified task.
 * @param {string} taskId - ID of the task to which the subtask is added.
 */
function addSubtask(taskId) {
    const newSubtaskInput = document.getElementById('newSubtaskInput');
    const subtaskTitle = newSubtaskInput.value.trim();
    if (subtaskTitle !== '') {
        const currentUser = getCurrentUser();
        const taskIndex = findTaskIndex(currentUser, taskId);
        if (taskIndex !== -1) {
            const updatedTaskInfo = boardEditTaskUpdateVariables(taskId);
            const { updatedTitle, updatedDescription } = updatedTaskInfo;
            currentUser.tasks[taskIndex].title = updatedTitle;
            currentUser.tasks[taskIndex].description = updatedDescription;
            if (!currentUser.tasks[taskIndex].subtasks) {
                currentUser.tasks[taskIndex].subtasks = [];
            }
            const newSubtask = addSubtaskNewSubtask(subtaskTitle);
            currentUser.tasks[taskIndex].subtasks.push(newSubtask);
            saveTasksToLocalStorage(currentUser);
            updateCurrentUserInBackend(currentUser);
            newSubtaskInput.value = '';
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


/**
 * Checks if any column is empty and displays "No tasks in this line" if so.
 */
function checkEmptyColumns() {
    const columns = document.querySelectorAll('.boardColumn');
    columns.forEach(column => {
        const taskContainer = column.querySelector('.task-container');
        if (!taskContainer || taskContainer.children.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = 'No tasks in this line';
            taskContainer.appendChild(emptyMessage);
        } else {
            const emptyMessage = column.querySelector('.empty-message');
            if (emptyMessage) {
                emptyMessage.remove();
            }
        }
    });
}


/**
 * Toggles the dropdown menu visibility for a task.
 * @param {Event} event - The event object.
 * @param {string} taskId - The ID of the task.
 */
function toggleBoardDropdown(event, taskId) {
    event.stopPropagation();
    const dropdownMenu = document.getElementById(`dropdown-menu-${taskId}`);
    const allDropdowns = document.querySelectorAll('.boardDropdown-menu');
    allDropdowns.forEach(menu => {
        if (menu !== dropdownMenu) {
            menu.style.display = 'none';
        }
    });
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}


/**
 * Moves a task to a different column based on the selected option from the dropdown.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newColumnId - The ID of the new column.
 */
function moveTask(taskId, newColumnId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (task) {
        task.columnId = newColumnId;
        saveTasksToLocalStorage(currentUser);
        initBoard();
    }
}


/**
 * Handles the click on a dropdown option.
 * @param {Event} event - The event object.
 * @param {string} taskId - The ID of the task.
 * @param {string} newColumnId - The ID of the new column.
 */
function handleDropdownOptionClick(event, taskId, newColumnId) {
    event.stopPropagation();
    moveTask(taskId, newColumnId);
    const dropdownMenu = document.getElementById(`dropdown-menu-${taskId}`);
    dropdownMenu.style.display = 'none';
}


/**
 * Updates the visibility of the dropdown based on the screen width.
 */
function updateDropdownVisibility() {
    const dropdowns = document.querySelectorAll('.boardDropdown');
    const isDesktop = window.innerWidth > 950;
    dropdowns.forEach(dropdown => {
        if (isDesktop) {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'flex';
        }
    });
}