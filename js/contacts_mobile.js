/**
 * Initializes or removes the 'resize' event listener for the 'contactsInit' function 
 * based on the current page's URL path. 
 * - If the current page is '/modul_10_gruppe_2_backup_21_03_2024/contacts.html' or '/contacts.html',
 *   the 'contactsInit' function will be called on window resize.
 * - If the current page is not one of the specified paths, the 'resize' event listener will be removed. 
 * Additionally, the 'contactsInit' function is called when the page is fully loaded.
 */
if (window.location.pathname === '/modul_10_gruppe_2_backup_21_03_2024/contacts.html' || window.location.pathname === '/contacts.html') {
  window.addEventListener('resize', contactsInit);
} else {
  window.removeEventListener('resize', contactsInit);
}
window.onload = contactsInit;


/**
 * Initialize the contacts page based on the window width.
 * Renders contacts differently for mobile and desktop views.
 */
function contactsInit() {
  const maxWidth = 949;    
  if (window.innerWidth <= maxWidth) {
      setTimeout(showHeaderAndFooter, 300);
      renderContacts();
      renderAddContactButtonMobile();
      setTimeout(showHeaderUserInitials, 500);
      contactsInitVariables();
      setMaxHeightReduced();
  } else {
      setTimeout(showHeaderAndFooter, 300);
      renderContactsDesktop();        
      document.body.style.overflow = 'hidden';
      setTimeout(showHeaderUserInitials, 500);      
  }
}


/**
* Initializes variables and styling for the contacts page on mobile view.
*/
function contactsInitVariables() {
document.body.style.overflow = 'hidden';
const content = document.getElementById("all-contacts-id");
content.style.marginTop = '80px';
content.style.paddingBottom = '60px';
content.style.overflow = 'auto';
}


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
 * Creates a container for a group of contacts starting with the same letter.
 * @param {string} firstLetter - The first letter of the contacts in the group.
 * @returns {HTMLElement} The created container element.
 */
function createLetterAndContactsContainer(firstLetter) {
  const container = document.createElement('div');
  container.classList.add('letterAndContactsContainer');
  container.innerHTML = `
    <div class="letter-column">
      <h2 class="contact-first-letter">${firstLetter}</h2>
      <div class="contacts-list"></div>
    </div>
  `;
  return container;
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
* Fills the content of a single contact container with HTML content.
* @param {HTMLElement} container - The container element for the contact.
* @param {string} iconHtml - The HTML content for the contact's icon.
* @param {Object} oneContact - The contact object.
*/
function createOneContactContainerHTML(container, iconHtml, oneContact) {
container.innerHTML = `
  <div class="contact-info-container">
    <div>
      ${iconHtml}
    </div>
    <div>
      <h2 class="oneContactContainerH2Mobile">${oneContact.name}</h2>
      <a class="oneContactContainerAElement">${oneContact.email}</a>
    </div>
  </div>
`;
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


/**
* Renders the icon for a single member in mobile view.
* @param {Object} oneContact - The contact object.
* @param {string} colorCode - The color code for the icon background.
* @param {string} textColor - The color code for the text.
* @returns {string} The HTML for the icon.
*/
function renderSingleMemberToHTMLMobile(oneContact, colorCode, textColor) {
  return `
    <div class="openContactUserImgMobile" style="background-color: ${colorCode}; color: ${textColor};">
      ${getFirstLettersOfName(oneContact.name)}
    </div>
  `;
}


/**
* Retrieves the first letters of the first name and last name to generate initials.
* @param {string} name - The name of the contact.
* @returns {string} The initials of the name.
*/
function getFirstLettersOfName(name) {
  let words = name.replace(/\s+/g, ' ').trim().split(" ");
  let initials = "";
  let namesProcessed = 0;  
  for (let word of words) {
    if (namesProcessed < 2 && word) {
      initials += word[0].toUpperCase();
      namesProcessed++;
    }
  }  
  return initials;
}


/**
* Determines whether a given hex color code represents a light color.
* @param {string} hexcode - The hex color code to be checked.
* @returns {boolean} True if the color is light, otherwise false.
*/
function isColorLight(hexcode) {
  if (hexcode) {
    let r = parseInt(hexcode.slice(1, 3), 16);
    let g = parseInt(hexcode.slice(3, 5), 16);
    let b = parseInt(hexcode.slice(5), 16);
    var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return a < 0.5;
  } else {
    return true;
  }
}


/**
* Generates a random hex color code.
* @returns {string} The randomly generated hex color code.
*/
function getRandomColorHex() {
  let colorHex = "#";
  let colorVal;
  for (let i = 0; i < 3; i++) {
    colorVal = Math.floor(Math.random() * 255).toString(16);
    if (colorVal.length == 1) colorVal = "0" + colorVal;
    colorHex += colorVal;
  }
  return colorHex;
}


/**
 * Displays the add contact screen for mobile view.
 */
function addContactScreenMobile() {
  const content = document.getElementById("all-contacts-id");
  content.innerHTML = addContactFormMobileHTML();
  content.style.marginTop = '0px';
  content.style.overflow = 'hidden';
  content.style.height = '100dvh';
  hideHeaderAndFooter();
  setMaxHeightFull();
}


/**
* Generates the HTML for the add contact form in mobile view.
* @returns {string} The HTML content for the add contact form.
*/
function addContactFormMobileHTML() {
return /*html*/ `
  <div class="addContactContainerHeaderMobile">
    <div class="addContactCloseXContainerMobile">
      <button class="addContactCloseXButtonMobile" onclick="redirectToContacts()">X</button>
    </div>
    <div class="addContactBlockHeaderMobile">
      <p class="addContactH1Mobile">Add contact</p>
      <p class="addContactTextMobile">Tasks are better with a team!</p>
      <img class="addContactBlueStrokedMobile" src="./assets/img/contacts/addContactBlueStroked.svg" alt="addContactBlueStroked">
    </div>
    <div>
      <img class="addContactBlankUserImgMobile" src="./assets/img/contacts/addContactBlankUserImg.svg" alt="addContactBlankUserImg">
    </div>
  </div>
  <form id="add-contact-form-mobile-id" onsubmit="event.preventDefault(); createContactMobile(); return false;">
    <div class="addContactContainerFooterMobile">
      <input class="addContactInputNameMobile" name="addContactInputNameMobile" id="add-contact-input-name-mobile-id" required pattern="[A-Za-z'\\- ]+" type="text" placeholder="Name">
      <input class="addContactInputMailAddresssMobile" name="addContactInputMailAddresssMobile" id="add-contact-input-mail-addresss-mobile-id" type="text" placeholder="E Mail">
      <input class="addContactInputPhoneMobile" name="addContactInputPhoneMobile" id="add-contact-input-phone-mobile-id" type="tel" required pattern="[0-9]{1,}" placeholder="Phone">          
      <button class="createContactButtonImg" type="submit">
      <img src="./assets/img/contacts/createContactButton.svg" alt="createContactButton">
</button>
    </div>
  </form>
`;
}


/**
* Redirects the user to the contacts page.
*/
function redirectToContacts() {
  window.location.assign("./contacts.html");
}


/**
 * Creates a new contact in mobile view.
 */
async function createContactMobile() {
  const currentUser = getLoggedInUser();
  if (!currentUser) return console.error("No user logged in.");
  const inputs = getInputElementsMobile();
  const { contactName, contactEmail, contactPhone } = validateCreateContactMobile();
  if (validateAndHandleErrors(inputs, { contactName, contactEmail, contactPhone })) return;
  saveNewContact(contactName, contactEmail, contactPhone);
  contactsInit();
  showSuccessfullyContactCreatedImageMobile();
}


/**
 * Validates inputs and handles errors if any.
 * @param {Object} inputs - The input elements.
 * @param {Object} contactData - The contact data.
 * @returns {boolean} True if there's an error, otherwise false.
 */
function validateAndHandleErrors(inputs, contactData) {
  clearErrorMessages();
  return validateInputsMobile(inputs, contactData);
}


/**
 * Saves the new contact to the current user.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 */
function saveNewContact(contactName, contactEmail, contactPhone) {
  const newContact = { name: contactName, email: contactEmail, phone: contactPhone };
  newContact.id = generateUniqueID();
  addContactToCurrentUser(newContact);
}


/**
 * Retrieves the input elements for mobile contact information.
 * @returns {Object} - An object containing the input elements for name, email, and phone.
 */
function getInputElementsMobile() {
  return {
    nameInput: document.getElementById("add-contact-input-name-mobile-id"),
    emailInput: document.getElementById("add-contact-input-mail-addresss-mobile-id"),
    phoneInput: document.getElementById("add-contact-input-phone-mobile-id"),
  };
}


/**
 * Validates the input fields for the mobile view.
 * @param {Object} inputs - An object containing the input elements.
 * @param {Object} contactInfo - An object containing contact information.
 * @returns {boolean} - Returns true if there is an error, otherwise false.
 */
function validateInputsMobile(inputs, contactInfo) {
  let hasError = false;  
  if (!contactInfo.contactName) {
    displayErrorMessage(inputs.nameInput, "Line cannot be empty, please fill it out.");
    hasError = true;
  }  
  if (!contactInfo.contactEmail) {
    displayErrorMessage(inputs.emailInput, "Line cannot be empty, please fill it out.");
    hasError = true;
  }  
  if (!contactInfo.contactPhone) {
    displayErrorMessage(inputs.phoneInput, "Line cannot be empty, please fill it out.");
    hasError = true;
  }
  return hasError;
}


/**
 * Retrieves the contact information from mobile input fields.
 * @returns {Object} An object containing the contact name, email, and phone.
 */
function validateCreateContactMobile() {
  const contactName = document.getElementById("add-contact-input-name-mobile-id").value;
  const contactEmail = document.getElementById("add-contact-input-mail-addresss-mobile-id").value;
  const contactPhone = document.getElementById("add-contact-input-phone-mobile-id").value;
  return { contactName, contactEmail, contactPhone };
}