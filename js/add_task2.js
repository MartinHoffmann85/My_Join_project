/**
 * Handles the editing of a subtask.
 * @param {number} index - The index of the subtask being edited.
 */
function editSubtask(index) {
    const ListElement = document.getElementById(`substask-content-id${index}`);
    handleFirstSubtaskEdit(index, ListElement);
    toggleEditMode(index, true);
    document.addEventListener('click', function(event) {
      const clickedElement = event.target;
      const isSubtaskContent = clickedElement.closest(`[id^="substask-content-id${index}"]`);
      const isSubtaskDefaultContainer = clickedElement.closest(`[id^="subtask-default-container-id${index}"]`);
      const isSubtaskEditedContainer = clickedElement.closest(`[id^="subtask-edited-container-id${index}"]`);
      if (!isSubtaskContent && !isSubtaskDefaultContainer && !isSubtaskEditedContainer)
        ListElement.classList.add('red-line-highlight');
    });    
}


/**
 * Toggles the edit mode by showing/hiding icons.
 * @param {number} index - The index of the subtask.
 * @param {boolean} isEditing - Whether the subtask is in edit mode.
 */
function toggleEditMode(index, isEditing) {
    const editIconContainer = document.getElementById(`subtask-default-container-id${index}`);
    const saveIconContainer = document.getElementById(`subtask-edited-container-id${index}`);
    if (isEditing) {
        editIconContainer.classList.add('d-none');
        saveIconContainer.classList.remove('d-none');
    } else {
        editIconContainer.classList.remove('d-none');
        saveIconContainer.classList.add('d-none');
    }
}


/**
* Handles the first edit of a subtask.
* @param {number} index - The index of the subtask being edited.
* @param {HTMLElement} ListElement - The element containing the subtask.
*/
function handleFirstSubtaskEdit(index, ListElement) {
    disableAllSubtasksExcept(index);
    const element = document.getElementById(`editable-span-id${index}`);
    toggleVisibility(`subtask-edited-container-id${index}`, true);
    toggleVisibility(`subtask-default-container-id${index}`, false);
    makeElementEditableWithMaxLength(element, 30);
    ListElement.classList.toggle('blue-line-highlight');
}
  
  
/**
* Disables all subtasks except the one at the specified index.
* @param {number} index - The index of the subtask to exclude from disabling.
*/
function disableAllSubtasksExcept(index) {
    const totalNumberOfSubtasks = document.querySelectorAll('[id^="substask-content-id"]').length;
    for (let i = 0; i < totalNumberOfSubtasks; i++) {
      if (i !== index) {
        const otherSubtask = document.getElementById(`substask-content-id${i}`);
        otherSubtask.classList.add('disabled-svg');
      }
    }
}
  
  
/**
* Makes an element editable with a specified maximum length.
* @param {HTMLElement} element - The element to make editable.
* @param {number} maxLength - The maximum length of the content.
*/
function makeElementEditableWithMaxLength(element, maxLength) {
    element.setAttribute('contentEditable', 'true');
    element.focus();
    element.addEventListener('input', function() {
      const maxLength = 30;
      if (this.innerText.length > maxLength)
        this.innerText = this.innerText.slice(0, maxLength);
    });
}
  
  
/**
* Saves the edited subtask content and re-renders the subtasks list.
* @param {number} index - The index of the edited subtask.
*/
function saveEditSubtask(index) {
    const element = document.getElementById(`editable-span-id${index}`);
    subtaskList[index] = element.innerText;
    renderSubtasks();
}
  
  
/**
* Deletes a subtask from the subtaskList array and re-renders the subtasks list.
* @param {number} index - The index of the subtask to delete.
*/
function deleteSubtask(index) {
    subtaskList.splice(index, 1);
    renderSubtasks();
}
  
  
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
    if (!titleInput) {
        showErrorMessage('empty-title-id', 'at-title-border-id');
        return false;
    }    
    const descriptionError = document.getElementById('empty-description-id');
    if (!textareaInput) {
        descriptionError.classList.remove('d-none');
        return false;
    } else {
        descriptionError.classList.add('d-none');
    }    
    if (!dateInput) {
        showErrorMessage('empty-date-id', 'at-date-border-id');
        return false;
    }    
    if (!categoryInput) {
        showErrorMessage('empty-category-id', 'category-container-id');
        return false;
    }
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


/**
 * Redirects the user after a specified delay.
 * @param {number} delay - The delay in milliseconds before redirecting.
 */
function redirectAfterDelay(delay) {
    setTimeout(() => {
        redirectToAddBoard();
    }, delay);
}


/**
* Show successfully contact created image.
*/
function showSuccessfullyTaskCreatedImage() {  
    const imageElement = document.createElement("img");
    imageElement.src = './assets/img/addedTaskToBoardSuccessfully.svg';
    imageElement.style.position = "fixed";
    imageElement.style.top = "50%";
    imageElement.style.left = "50%";
    imageElement.style.transform = "translate(-50%, -50%)";
    imageElement.style.zIndex = "9999";  
    document.body.appendChild(imageElement);
    setTimeout(() => {
        document.body.removeChild(imageElement);
    }, 2000);
}
  
  
/**
* Updates the current user's tasks data with the new task and saves it to local storage.
* Also updates the current user's data in the backend.
* @param {string} taskID - The ID of the new task.
* @param {string} titleInput - The title of the new task.
* @param {string} textareaInput - The description of the new task.
* @param {string} dateInput - The due date of the new task.
* @param {string} categoryInput - The category of the new task.
* @param {string} columnId - The ID of the column the new task belongs to.
* @param {string} priority - The priority level of the new task.
* @param {Object} assignedTo - The user(s) assigned to the new task.
*/
async function updateCurrentUser(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority, assignedTo) {
    if (!Array.isArray(currentUser.tasks)) {
      currentUser.tasks = [];
    }
    const subtasks = generateSubtasks(subtaskList);
    const task = createTaskObject(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority, assignedTo, subtasks);
    currentUser.tasks.push(task);
    saveTasksToLocalStorage(currentUser);
    await updateCurrentUserInBackend(currentUser);
}
  
  
/**
* Generates an array of subtasks from the provided subtaskList.
* @param {Array} subtaskList - The list of subtasks.
* @returns {Array} - An array of subtask objects.
*/
function generateSubtasks(subtaskList) {
    return subtaskList.map(subtask => ({
      id: generateTaskID(),
      title: subtask,
      completed: false
    }));
}
  
  
/**
* Creates a task object with the provided details.
* @param {string} taskID - The ID of the task.
* @param {string} titleInput - The title of the task.
* @param {string} textareaInput - The description of the task.
* @param {string} dateInput - The due date of the task.
* @param {string} categoryInput - The category of the task.
* @param {string} columnId - The ID of the column the task belongs to.
* @param {string} priority - The priority level of the task.
* @param {Object} assignedTo - The user(s) assigned to the task.
* @param {Array} subtasks - The list of subtasks of the task.
* @returns {Object} - The task object.
*/
function createTaskObject(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority, assignedTo, subtasks) {
    return {
      id: taskID,
      title: titleInput,
      description: textareaInput,
      date: dateInput,
      category: categoryInput,
      columnId: columnId,
      prio: priority,
      assignedTo: assignedTo,
      subtasks: subtasks
    };
}
  
  
/**
* Clears all input fields, lists, and error messages on the task creation form.
*/
function clearAll() {
    clearAllInputs();
    clearAllLists();
    clearAllErrMsg();
    renderAddedContacts();
    renderSubtasks();
    togglePrioImg('medium-default-id');  
}
  
  
/**
* Clears all input fields on the task creation form.
*/
function clearAllInputs() {
    document.getElementById('title-input-id').value = '';
    document.getElementById('textarea-input-id').value = '';
    document.getElementById('date-input-id').value = '';
    document.getElementById('category-input-id').value = '';
}
  
  
/**
* Clears all lists (e.g., subtask list, assigned-to list) on the task creation form.
*/
function clearAllLists() {
    subtaskList.splice(0, subtaskList.length);
    assignedTo.userNames.splice(0, assignedTo.userNames.length);
    assignedTo.colorCodes.splice(0, assignedTo.colorCodes.length);
    assignedTo.initials.splice(0, assignedTo.initials.length);
    assignedTo.textColor.splice(0, assignedTo.textColor.length);
}
  
  
/**
* Clears all error messages on the task creation form.
*/
function clearAllErrMsg() {
    toggleVisibility('empty-title-id', false);
    toggleVisibility('empty-date-id', false);
    toggleVisibility('empty-category-id', false);
    toggleVisibility('at-title-border-id', false, 'error-border');
    toggleVisibility('at-date-border-id', false, 'error-border');
    toggleVisibility('category-container-id', false, 'error-border');
}
  
  
/**
* Generates a unique task ID.
* @returns {string} - The generated task ID.
*/
function generateTaskID() {
    return Math.random().toString(36).substr(2, 9);
}


/**
* Redirects the user to the add board page.
*/
function redirectToAddBoard() {
    window.location.assign("./board.html");
}
  