/**
* Formats the given value with a leading zero if necessary.
* @param {number} value - The value to format.
* @returns {string} The formatted value.
*/
function formatWithLeadingZero(value) {
    return value < 10 ? `0${value}` : value;
}


/**
 * Sets the current date in the date input field.
 */
function setCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = formatWithLeadingZero(now.getMonth() + 1);
    const day = formatWithLeadingZero(now.getDate());
    let element = document.getElementById('date-input-id');
    element.min = `${year}-${month}-${day}`;
}


/**
* Compares two contacts based on surname and email address and sorts them.
* @param {Object} a - The first contact.
* @param {Object} b - The second contact.
* @returns {number} -1, 0, or 1, depending on whether the first contact comes before, is the same as, or comes after the second contact.
*/
function sortContactsBySurname(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    const emailA = a.email.toLowerCase();
    const emailB = b.email.toLowerCase();
    if (emailA < emailB) return -1;
    if (emailA > emailB) return 1;
    return 0;
}


/**
* Closes the assigned menu when the user clicks outside the menu.
*/
function closeAssignedToMenu() {
    document.addEventListener('click', function (event) {
        const clickInsideInput = event.target.closest('#assignedto-container-id');
        const clickInsideDropdown = event.target.closest('#assigned-to-contacts-id');
        if (!clickInsideDropdown && !clickInsideInput) {
            toggleAssignedToSection(true);
            document.getElementById('assignedto-input-id').value = '';
            document.getElementById('assignedto-input-id').placeholder = 'Select contacts to assign';
            if (isFilterActive) {
                renderAssignedToContacts();
                isFilterActive = false;
            }
        }
    });
}


/**
* Toggles the visibility of the assigned section based on the boolean value.
* @param {boolean} bool - The boolean value indicating whether the section should be visible or not.
*/
function toggleAssignedToSection(bool) {
    document.getElementById('assignedto-input-id').placeholder = 'To: ';
    toggleVisibility('assigned-to-contacts-id', bool, 'active');
    toggleVisibility('rotate-arrow-id', bool, 'upsidedown');
    toggleVisibility('at-label-id', bool, 'shrink-font-size');
}


/**
* Opens the assigned menu and renders the assigned contacts.
*/
function openAssignedbyArrow() {
    renderAssignedToContacts();
    document.getElementById('assignedto-input-id').placeholder = 'Select contacts to assign';
    toggleSection('assigned-to-contacts-id', 'active');
    toggleSection('rotate-arrow-id', 'upsidedown');
    toggleSection('at-label-id', 'shrink-font-size');
    document.getElementById('assignedto-input-id').value = '';
}


/**
 * Toggles a specified class on an HTML element.
 * @param {string} elementID - The ID of the HTML element to toggle.
 * @param {string} toggleClass - The class to toggle on the element.
 */
function toggleSection(elementID, toggleClass) {
    const element = document.getElementById(elementID);
    element.classList.toggle(toggleClass);
}


/**
 * Renders the added contacts based on assignedTo object data.
 */
function renderAddedContacts() {
    let addedContactsElement = document.getElementById('added-contacts-id');
    addedContactsElement.innerHTML = '';
    assignedTo.colorCodes.forEach((colorCode, index) => {
      if (index > 4)
        return;
      addedContactsElement.innerHTML += templateaddedContactsHTML(index, colorCode, assignedTo.initials[index], assignedTo.textColor[index]);
    });
}


/**
 * Handles selection/deselection of assigned-to users.
 * @param {Event} event - The event triggering the selection.
 * @param {number} index - The index of the user being selected.
 */
function selectedAssignedToUser(event, index) {
    const { svgElement, contactIndex, contact } = selectedAssignedToUserVariables(index, event);
    if (event.currentTarget.classList.contains('selected-contact')) {
      svgElement.innerHTML = templateSvgCheckboxConfirmedHTML();
      addContactToAssignedTo(contactIndex, contact);
    } else {
      svgElement.innerHTML = templateSvgDefaultCheckboxHTML();
      removeContactFromAssignedTo(contactIndex);
    }
    updateAssignedToLocalStorage();
    renderAddedContacts();
}


/**
 * Adds a contact to the assignedTo object.
 * @param {number} contactIndex - The index of the contact.
 * @param {Object} contact - The contact to add.
 */
function addContactToAssignedTo(contactIndex, contact) {
    if (contactIndex === -1) {
      assignedTo.initials.push(getFirstLettersOfName(contact.name));
      assignedTo.colorCodes.push(contact.colorCode);
      assignedTo.textColor.push(contact.textColorCode || (isColorLight(contact.colorCode) ? 'black' : 'white'));
      assignedTo.userNames.push(contact.name);
  }
}


/**
 * Removes a contact from the assignedTo object.
 * @param {number} contactIndex - The index of the contact to remove.
 */
function removeContactFromAssignedTo(contactIndex) {
    if (contactIndex !== -1) {
      assignedTo.initials.splice(contactIndex, 1);
      assignedTo.colorCodes.splice(contactIndex, 1);
      assignedTo.textColor.splice(contactIndex, 1);
      assignedTo.userNames.splice(contactIndex, 1);
    }
}


/**
 * Sets up variables needed for handling selection of assigned-to users.
 * @param {number} index - The index of the user being selected.
 * @param {Event} event - The event triggering the selection.
 * @returns {Object} - Object containing necessary elements for further processing.
 */
function selectedAssignedToUserVariables(index, event) {
    userIndex = index;
    const svgElement = event.currentTarget.querySelector('svg');
    const spanElement = document.getElementById(`contact-id${index}`);
    const contact = currentUser.contacts.find(contact => contact.name === spanElement.innerHTML);
    event.currentTarget.classList.toggle('selected-contact');
    const contactIndex = assignedTo.userNames.indexOf(contact.name);
    return { svgElement, contactIndex, contact };
}


/**
 * Updates the assignedTo object in local storage.
 */
function updateAssignedToLocalStorage() {
    localStorage.setItem('currentUser.tasks.assignedTo', JSON.stringify(assignedTo));
}


/**
 * Toggles the priority image based on user click.
 * @param {string} clickedId - The ID of the clicked image.
 */
function togglePrioImg(clickedId) {
    const imageIds = ['urgent-default-id', 'medium-default-id', 'low-default-id'];
    imageIds.forEach((id, index) => {
      const image = document.getElementById(id);
      if (id === clickedId) {
        prioIndex = index;
        image.src = `./assets/img/${id.replace('-default-id', '_highlighted.png')}`;
      } else {
        image.src = `./assets/img/${id.replace('-default-id', '_default.png')}`;
      }
    });
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
* Redirects the user to the add board page.
*/
function redirectToAddBoard() {
  window.location.assign("./board.html");
}