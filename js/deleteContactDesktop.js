/**
 * Deletes a contact from the desktop view and removes the contact from all tasks.
 * @param {string} contactId - The ID of the contact to be deleted.
 */
function deleteContactDesktop(contactId) {
    const currentUser = getLoggedInUser();    
    const index = currentUser.contacts.findIndex(contact => contact.id === contactId);  
    if (index !== -1) {
      const contactToDelete = currentUser.contacts[index];
      removeContactFromList(currentUser, index);
      removeContactFromTasks(currentUser, contactToDelete);
      saveUserData(currentUser);
      refreshUI();
    }
}


/**
* Removes the contact from the user's contact list.
* @param {Object} currentUser - The currently logged-in user.
* @param {number} index - The index of the contact to be removed.
*/
function removeContactFromList(currentUser, index) {
    currentUser.contacts.splice(index, 1);
}


/**
* Removes the contact from all assigned tasks.
* @param {Object} currentUser - The currently logged-in user.
* @param {Object} contactToDelete - The contact to be removed from tasks.
*/
function removeContactFromTasks(currentUser, contactToDelete) {
    if (currentUser.tasks && Array.isArray(currentUser.tasks)) {
      currentUser.tasks.forEach(task => {
        if (task.assignedTo && Array.isArray(task.assignedTo.userNames)) {
          removeContactFromTask(task, contactToDelete);
        }
      });
    }
}


/**
* Removes the contact from a single task.
* @param {Object} task - The task to update.
* @param {Object} contactToDelete - The contact to remove from the task.
*/
function removeContactFromTask(task, contactToDelete) {
    const userIndex = task.assignedTo.userNames.indexOf(contactToDelete.name);  
    if (userIndex !== -1) {
      task.assignedTo.colorCodes.splice(userIndex, 1);
      task.assignedTo.initials.splice(userIndex, 1);
      task.assignedTo.textColor.splice(userIndex, 1);
      task.assignedTo.userNames.splice(userIndex, 1);
    }
}