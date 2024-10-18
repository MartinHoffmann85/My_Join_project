/**
 * Validates if a subtask has valid content (not empty and contains at least one letter or number).
 * @param {string} subtask - The content of the subtask.
 * @returns {boolean} - True if valid, otherwise false.
 */
function isValidSubtask(subtask) {
    // Check if the subtask contains at least one letter or number
    return /\w+/.test(subtask.trim());
}


/**
* Saves the edited subtask content and re-renders the subtasks list.
* @param {number} index - The index of the edited subtask.
*/
/**
* Saves the edited subtask content and re-renders the subtasks list.
* @param {number} index - The index of the edited subtask.
*/
function saveEditSubtask(index) {
    const element = document.getElementById(`editable-span-id${index}`);
    let subtaskContent = element.innerText.trim();    
    if (!isValidSubtask(subtaskContent)) {
        showError(element);
        return;
    }    
    resetStyles(element);
    subtaskList[index] = subtaskContent;
    renderSubtasks();
}


/**
* Displays an error message and styles for invalid subtask content.
* @param {HTMLElement} element - The HTML element for the subtask.
*/
function showError(element) {
    element.innerText = "Subtask cannot be empty and must contain at least one letter or number.";
    element.style.color = 'red';
    element.style.fontSize = '12px';
    addFocusListener(element);
}


/**
* Adds a focus listener to clear the error message when the user starts typing.
* @param {HTMLElement} element - The HTML element for the subtask.
*/
function addFocusListener(element) {
    element.addEventListener('focus', function clearError() {
        element.innerText = '';
        resetStyles(element);
        element.removeEventListener('focus', clearError);
    });
}


/**
* Resets the styles of the subtask element to default.
* @param {HTMLElement} element - The HTML element for the subtask.
*/
function resetStyles(element) {
    element.style.color = '';
    element.style.fontSize = '';
}


/**
* Deletes a subtask from the subtaskList array and re-renders the subtasks list.
* @param {number} index - The index of the subtask to delete.
*/
function deleteSubtask(index) {
    subtaskList.splice(index, 1);
    renderSubtasks();
}