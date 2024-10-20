let draggedTaskId;
let originalColumnId;
let searchTimeout;
let tempTitle = '';
let tempDescription = '';


document.addEventListener('click', function() {
    const dropdowns = document.querySelectorAll('.boardDropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
});


window.addEventListener('resize', updateDropdownVisibility);


/**
 * Initializes the board by loading tasks from local storage, rendering them, and showing user initials in the header.
 */
async function initBoard() {
    const currentUser = await JSON.parse(localStorage.getItem('currentUser'));
    loadTasksFromLocalStorage(currentUser);
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 500);    
}


/**
 * Redirects the user to the add task page.
 */
function redirectToAddTask(columnId) {
    localStorage.setItem('selectedColumnId', columnId);
    window.location.assign("./add_task.html");
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
 * Finds the index of the task in the user's task list.
 * @param {Object} currentUser - The current user object.
 * @param {string} taskId - The task ID.
 * @returns {number} - The index of the task.
 */
function findTaskIndex(currentUser, taskId) {
    return currentUser.tasks.findIndex(task => task.id === taskId);
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
 * Updates the task in local storage and backend after editing.
 * @param {string} taskId - ID of the task.
 */
function boardEditTaskUpdate(taskId) {
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;    
    const currentUser = getCurrentUser();
    const taskIndex = findTaskIndex(currentUser, taskId);    
    if (taskIndex !== -1) {
        currentUser.tasks[taskIndex].title = title;
        currentUser.tasks[taskIndex].description = description;
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeOverlayBoard();
    renderAllTasks();
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