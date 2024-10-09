document.addEventListener('click', function() {
    const dropdowns = document.querySelectorAll('.boardDropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
});


window.addEventListener('resize', updateDropdownVisibility);


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