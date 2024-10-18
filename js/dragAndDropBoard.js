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