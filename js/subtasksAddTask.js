/**
 * Renders the subtasks list based on the subtaskList array.
 */
function renderSubtasks() {
    let element = document.getElementById('add-task-list-id');
    element.innerHTML = '';
    subtaskList.forEach((subtask, index) => {
      element.innerHTML += templateSubtaskHTML(index, subtask);
    });
}


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