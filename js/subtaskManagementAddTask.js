/**
 * Adds input event listener to the subtask input field and manages visibility of related buttons.
 */
function addSubtaskVisibilityListener() {
    const inputElement = document.getElementById('subtask-input-id');
    inputElement.addEventListener("input", function(event) {
      const inputNotEmpty = isValueNotEmpty(event.target.value);
      toggleVisibility('subtast-add-button-id', !inputNotEmpty);
      toggleVisibility('subtask-del-and-confim-id', true);
      if (!inputNotEmpty) 
          toggleVisibility('subtask-del-and-confim-id', false);
  });
}


/**
 * Toggles visibility of the add new task menu and sets focus on the subtask input field.
 */
function toggleAddNewTaskMenu() {
    addSubtaskVisibilityListener();
    const inputElement = document.getElementById('subtask-input-id');
    inputElement.focus(); 
}


/**
 * Deletes or adds task menu based on the flag provided.
 * @param {boolean} isDelete - Flag indicating whether to delete or add the task menu.
 */
function deleteOrAddTaskMenu(isDelete) {
    const inputElement = document.getElementById('subtask-input-id');
    if (isDelete)
      inputElement.value = '';
    else
      addNewTaskMenu();
    toggleVisibility('subtask-del-and-confim-id', false);
    toggleVisibility('subtast-add-button-id', true);
}


/**
 * Adds a new task menu to the list of subtasks.
 */
function addNewTaskMenu() {
    const inputElement = document.getElementById('subtask-input-id');
    subtaskList.push(inputElement.value);
    inputElement.value = '';
    renderSubtasks();
}