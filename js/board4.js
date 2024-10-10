document.addEventListener('click', function() {
    const dropdowns = document.querySelectorAll('.boardDropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
});


window.addEventListener('resize', updateDropdownVisibility);


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
            dropdown.style.display = 'inline-block';
        }
    });
}