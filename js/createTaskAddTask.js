/**
 * Creates a new task with user-provided inputs and updates the current user's data.
 * Then redirects the user to the add board page.
 */
async function createTask() {
    const titleInput = getInputValue('title-input-id');
    const textareaInput = getInputValue('textarea-input-id');
    const dateInput = getInputValue('date-input-id');
    const categoryInput = getInputValue('category-input-id');
    if (!validateInputsCreateTask(titleInput, textareaInput, dateInput, categoryInput)) {
        return;
    }
    const columnId = localStorage.getItem('selectedColumnId') || 'todo';
    const priority = prio[prioIndex];
    const taskID = generateTaskID();    
    await saveTask(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority);
    showSuccessfullyTaskCreatedImage();
    redirectAfterDelay(500);
}


/**
 * Gets the trimmed value of an input field by ID.
 * @param {string} inputId - The ID of the input element.
 * @returns {string} The trimmed value of the input.
 */
function getInputValue(inputId) {
    return document.getElementById(inputId).value.trim();
}


/**
 * Validates the user inputs.
 * @param {string} titleInput - The title input value.
 * @param {string} textareaInput - The description input value.
 * @param {string} dateInput - The date input value.
 * @param {string} categoryInput - The category input value.
 * @returns {boolean} True if all inputs are valid; otherwise, false.
 */
function validateInputsCreateTask(titleInput, textareaInput, dateInput, categoryInput) {
    if (!titleInput) return handleInputError('empty-title-id', 'at-title-border-id');
    if (!validateTextareaInput(textareaInput)) return false;
    if (!dateInput) return handleInputError('empty-date-id', 'at-date-border-id');
    if (!categoryInput) return handleInputError('empty-category-id', 'category-container-id');
    return true;
}


/**
 * Handles input error display and returns false.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} borderId - The ID of the input border element.
 * @returns {boolean} Always returns false.
 */
function handleInputError(errorId, borderId) {
    showErrorMessage(errorId, borderId);
    return false;
}


/**
 * Validates the description input field.
 * @param {string} textareaInput - The description input value.
 * @returns {boolean} True if valid; otherwise, false.
 */
function validateTextareaInput(textareaInput) {
    const descriptionError = document.getElementById('empty-description-id');
    if (!textareaInput) {
        descriptionError.classList.remove('d-none');
        return false;
    }
    descriptionError.classList.add('d-none');
    return true;
}


/**
 * Displays an error message and highlights the input field.
 * This function makes the specified error message visible and adds an error
 * border to the corresponding input field to indicate that there is an issue
 * with the user's input.
 * @param {string} errorMessageId - The ID of the error message element to be displayed.
 * @param {string} inputBorderId - The ID of the input field to be highlighted with an error border.
 */
function showErrorMessage(errorMessageId, inputBorderId) {
    toggleVisibility(errorMessageId, true);
    toggleVisibility(inputBorderId, true, 'error-border');
}


/**
* Generates a unique task ID.
* @returns {string} - The generated task ID.
*/
function generateTaskID() {
    return Math.random().toString(36).substr(2, 9);
}


/**
 * Saves the new task to the current user's data.
 * @param {string} taskID - The ID of the task.
 * @param {string} titleInput - The title of the task.
 * @param {string} textareaInput - The description of the task.
 * @param {string} dateInput - The due date of the task.
 * @param {string} categoryInput - The category of the task.
 * @param {string} columnId - The ID of the column where the task will be added.
 * @param {string} priority - The priority of the task.
 */
async function saveTask(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority) {
    await updateCurrentUser(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority, assignedTo);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}