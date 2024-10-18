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
    setTimeout(showHeaderUserInitials, 500);    
}