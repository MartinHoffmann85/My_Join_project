/**
* Renders contacts for the mobile view.
* Contacts are sorted alphabetically and grouped by first letter.
*/
async function renderContacts() {
    const { loggedInUser, contactsByFirstLetter, content } = renderContactsVariables();
    if (loggedInUser && loggedInUser.contacts) {      
        loggedInUser.contacts.sort((a, b) => a.name.localeCompare(b.name));
        loggedInUser.contacts.forEach((oneContact) => {
            const firstLetter = oneContact.name.charAt(0).toUpperCase();
            updateContactsByFirstLetter(contactsByFirstLetter, firstLetter, oneContact);
        });      
        renderContactsByFirstLetter(content, contactsByFirstLetter);
        registerContactClickHandlers();
    }
}


/**
* Retrieves necessary variables for rendering contacts.
* @returns {Object} An object containing loggedInUser, contactsByFirstLetter, and content.
*/
function renderContactsVariables() {
  const content = document.getElementById("all-contacts-id");
  content.innerHTML = "";
  const contactsByFirstLetter = {};
  const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
  return { loggedInUser, contactsByFirstLetter, content };
}


/**
* Updates the contacts grouped by their first letter.
* @param {Object} contactsByFirstLetter - The object storing contacts grouped by first letter.
* @param {string} firstLetter - The first letter of the contact's name.
* @param {Object} oneContact - The contact object.
*/
function updateContactsByFirstLetter(contactsByFirstLetter, firstLetter, oneContact) {
    if (!contactsByFirstLetter[firstLetter]) {
      contactsByFirstLetter[firstLetter] = createLetterAndContactsContainer(firstLetter);
    }
    const oneContactContainer = createOneContactContainer(oneContact);
    contactsByFirstLetter[firstLetter].querySelector('.contacts-list').appendChild(oneContactContainer);
}


/**
* Creates a container for a single contact.
* @param {Object} oneContact - The contact object.
* @returns {HTMLElement} The created container element.
*/
function createOneContactContainer(oneContact) {
  const container = document.createElement('div');
  container.classList.add('oneContactContainer');
  container.setAttribute('data-contact-id', oneContact.id);
  container.addEventListener('click', () => showContactOverlayMobile(oneContact.id));
  const iconHtml = renderSingleMemberToHTMLMobile(oneContact, oneContact.colorCode, oneContact.textColorCode);
  createOneContactContainerHTML(container, iconHtml, oneContact);
  return container;
}


/**
* Renders contacts grouped by their first letter.
* @param {HTMLElement} content - The container element to render contacts in.
* @param {Object} contactsByFirstLetter - The object storing contacts grouped by first letter.
*/
function renderContactsByFirstLetter(content, contactsByFirstLetter) {
    for (const letter in contactsByFirstLetter) {
      content.appendChild(contactsByFirstLetter[letter]);
    }
}


/**
* Registers click event handlers for contact containers.
*/
function registerContactClickHandlers() {
    const contactContainers = document.querySelectorAll('.oneContactContainer');
    contactContainers.forEach(container => {      
        const contactId = container.getAttribute('data-contact-id');
        container.addEventListener('click', () => showContactOverlayMobile(contactId));        
    });
}


/**
* Renders the add contact button for mobile view.
*/
function renderAddContactButtonMobile() {
    const content = document.getElementById("all-contacts-id");
    const addContactButtonMobile = document.createElement('div');
    addContactButtonMobile.classList.add("addContactButtonContainerMobile");
    addContactButtonMobile.innerHTML = `
      <img class="addContactButtonImgMobile" src="./assets/img/contacts/addContactButtonMobile.svg" alt="createContactButton" onclick="addContactScreenMobile()"></img>
    `;
    content.appendChild(addContactButtonMobile);
}