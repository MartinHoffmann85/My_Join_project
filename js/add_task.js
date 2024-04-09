let currentUser;
let assignedTo = {
  'initials': [],
  'colorCodes': [],
  'textColor': [],
  'userNames': []
};
let subtaskList = [];
let userIndex;
let prio = ['urgent', 'medium', 'low'];
let prioIndex = 1;
let isFilterActive = false;


/**
 * Initializes the add task functionality.
 * Parses the current user from local storage,
 * renders assigned contacts, sets the current date,
 * adds a listener for subtask visibility,
 * closes the assigned-to menu, closes the category menu,
 * and filters assigned contacts based on user input.
 */
function initAddTask() {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  renderAssignedToContacts();
  setCurrentDate();
  addSubtaskVisibilityListener();
  closeAssignedToMenu();
  closeCategoryMenu();
  filterAssignedToContacts();
  setTimeout(showHeaderUserInitials, 200);
}


/**
* Listens for input events on the assigned-to input field
* and filters contacts accordingly.
* @param {Event} event - The input event object.
*/
function filterAssignedToContacts() {
  document.getElementById('assignedto-input-id').addEventListener('input', function (event) {
      const searchTerm = event.target.value;
      isFilterActive = searchTerm.trim() !== '';
      const filteredContacts = currentUser.contacts.filter(contact =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      iterateOverContacts(filteredContacts);
  });
}


/**
* Renders the assigned contacts.
* @param {Array} [contacts=currentUser.contacts] - The array of contacts to render.
*/
function renderAssignedToContacts(contacts = currentUser.contacts) {
  contacts.sort(sortContactsBySurname);
  iterateOverContacts(contacts);
}


/**
* Iterates over the given contacts and updates the UI accordingly.
* @param {Array} contacts - The array of contacts to iterate over.
*/
function iterateOverContacts(contacts) {
  const assignedToContainer = document.getElementById('assigned-to-contacts-id');
  assignedToContainer.innerHTML = '';
  contacts.forEach((contact, index) => {
      if (contact.name === currentUser.userName)
          contact.name = contact.name + ' (you)';
      const initials = getFirstLettersOfName(contact.name);
      textColor = isColorLight(contact.colorCode) ? 'white' : 'black';
      const isSelected = contacts[index].selected;
      assignedToContainer.innerHTML += templateAssignedToContainerHTML(contact.name, index, contact.colorCode, initials, textColor, isSelected);
  });
  const contactElements = assignedToContainer.querySelectorAll('.assigned-to-box');
  contactElements.forEach(contactElement => {
      contactElement.classList.remove('selected-contact');
  });
}


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
 * Closes the category menu when the user clicks outside the menu.
 */
function closeCategoryMenu() {
  document.addEventListener('click', function (event) {
    const clickInsideInput = event.target.closest('#category-container-id');
    if (!clickInsideInput) {
      toggleVisibility('rotate-arrow-category-id', true, 'upsidedown');
      toggleVisibility('category-id', true, 'active');
    }
  });
}


/**
 * Toggles the visibility of the category container.
 */
function toggleCategoryContainer() {
  toggleSection('rotate-arrow-category-id', 'upsidedown');
  toggleSection('category-id', 'active');
}


/**
 * Handles selection of a category from the dropdown menu.
 * @param {HTMLElement} clickedElement - The clicked category element.
 */
function selectCategory(clickedElement) {
  const element = document.getElementById('category-input-id');
  const allItems = document.querySelectorAll('.category-dropdown ul li');
  allItems.forEach(item => item.classList.remove('selected-contact'));
  element.value = clickedElement.innerHTML;
  clickedElement.classList.add('selected-contact');
  toggleCategoryContainer(true);
}


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
  const titleInput = document.getElementById('title-input-id').value;
  const textareaInput = document.getElementById('textarea-input-id').value;
  const dateInput = document.getElementById('date-input-id').value;
  const categoryInput = document.getElementById('category-input-id').value;
  const columnId = 'todo';
  const priority = prio[prioIndex];
  const taskID = generateTaskID();
  await updateCurrentUser(taskID, titleInput, textareaInput, dateInput, categoryInput, columnId, priority, assignedTo);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  redirectToAddBoard();
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
