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
      ) ;
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
    contacts.forEach((contact, index) => updateContactUI(contact, index, contacts, assignedToContainer));
    clearSelectedContacts(assignedToContainer);
}


/**
 * Updates the UI for each contact.
 * @param {Object} contact - The contact object to update.
 * @param {number} index - The index of the contact in the array.
 * @param {Array} contacts - The array of all contacts.
 * @param {HTMLElement} assignedToContainer - The DOM element for the contacts container.
 */
function updateContactUI(contact, index, contacts, assignedToContainer) {
    if (contact.name === currentUser.userName) contact.name += ' (you)';
    const initials = getFirstLettersOfName(contact.name);
    const textColor = isColorLight(contact.colorCode) ? 'white' : 'black';
    const isSelected = contacts[index].selected;
    assignedToContainer.innerHTML += templateAssignedToContainerHTML(
        contact.name, index, contact.colorCode, initials, textColor, isSelected
    );
}


/**
 * Clears the selected class from all contact elements in the container.
 * @param {HTMLElement} container - The DOM element for the contacts container.
 */
function clearSelectedContacts(container) {
    container.querySelectorAll('.assigned-to-box').forEach(contactElement => {
        contactElement.classList.remove('selected-contact');
    });
}