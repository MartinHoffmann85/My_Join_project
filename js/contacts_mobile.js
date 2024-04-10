// Render contacts mobile view

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
  } else {
      setTimeout(showHeaderAndFooter, 300);
      renderContactsDesktop();        
      document.body.style.overflow = 'hidden';
      setTimeout(showHeaderUserInitials, 200);
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
* Retrieves the first letters of a name to generate initials.
* @param {string} name - The name of the contact.
* @returns {string} The initials of the name.
*/
function getFirstLettersOfName(name) {
  let words = name.replace(/\s+/g, ' ').trim().split(" ");
  let initials = "";
  for (let word of words) {
    initials += word[0].toUpperCase();
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
  * Hide header and footer for edit contact and create contact screen on mobile view
  */
function hideHeaderAndFooter() {
    const mobileHeader = document.querySelector(".header"); 
    const menuTemplate = document.querySelector(".footer");
    mobileHeader.style.display = "none";
    menuTemplate.style.display = "none";
}


/**
  * Show header and footer screen on mobile view
  */
function showHeaderAndFooter() {
    const mobileHeader = document.querySelector(".header");
    const menuTemplate = document.querySelector(".footer");
    mobileHeader.style.display = "block";
    menuTemplate.style.display = "flex";
}


// Add contact screen

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
  <form id="add-contact-form-mobile-id" onsubmit="createContactMobile(); return false;">
    <div class="addContactContainerFooterMobile">
      <input class="addContactInputNameMobile" name="addContactInputNameMobile" id="add-contact-input-name-mobile-id" type="text" placeholder="Name">
      <input class="addContactInputMailAddresssMobile" name="addContactInputMailAddresssMobile" id="add-contact-input-mail-addresss-mobile-id" type="text" placeholder="E Mail">
      <input class="addContactInputPhoneMobile" name="addContactInputPhoneMobile" id="add-contact-input-phone-mobile-id" type="text" placeholder="Phone">          
      <img class="createContactButtonImg" src="../assets/img/contacts/createContactButton.svg" alt="createContactButton" onclick="createContactMobile()">         
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
  const newContact = getNewContact();
  newContact.id = generateUniqueID();
  addContactToCurrentUser(newContact);
  contactsInit();
}


/**
* Retrieves the data for a new contact.
* @returns {Object} The new contact object.
*/
function getNewContact() {
  const contactName = document.getElementById("add-contact-input-name-mobile-id").value;
  const contactEmail = document.getElementById("add-contact-input-mail-addresss-mobile-id").value;
  const contactPhone = document.getElementById("add-contact-input-phone-mobile-id").value;
  return { name: contactName, email: contactEmail, phone: contactPhone };
}


/**
 * Adds a new contact to the current user's contacts list.
 * @param {Object} newContact - The new contact object to be added.
 */
async function addContactToCurrentUser(newContact) {
  let { colorCode, textColorCode, currentUser } = addContactToCurrentUserVariables(newContact);
  if (!colorCode || !textColorCode) {      
      colorCode = getRandomColorHex();
      textColorCode = isColorLight(colorCode) ? 'white' : 'black';
  }  
  newContact.colorCode = colorCode;
  newContact.textColorCode = textColorCode;
  currentUser.contacts.push(newContact);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateCurrentUserInBackend(currentUser);  
}


/**
* Retrieves the variables needed for adding a contact to the current user.
* @param {Object} newContact - The new contact object.
* @returns {Object} An object containing the color code, text color code, and current user.
*/
function addContactToCurrentUserVariables(newContact) {
const currentUser = getLoggedInUser();
newContact.id = generateUniqueID();
let colorCode = localStorage.getItem(`color_${newContact.id}`);
let textColorCode = localStorage.getItem(`textColor_${newContact.id}`);
return { colorCode, textColorCode, currentUser };
}


/**
* Retrieves the currently logged-in user from local storage.
* @returns {Object} The currently logged-in user object.
*/
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}


/**
* Generates a unique ID for a contact.
* @returns {string} The unique ID.
*/
function generateUniqueID() {
  let id;
  const currentUser = getLoggedInUser();
  const usersArray = currentUser ? [currentUser] : [];
  do {
      id = generateRandomID();
  } while (usersArray.some(user => user.contacts && user.contacts.some(contact => contact.id === id)));
  return id;
}


/**
* Generates a random ID.
* @returns {string} The random ID.
*/
function generateRandomID() {    
  return Math.random().toString(36).substring(2, 11);
}


/**
 * Updates the current user's data in the backend.
 * @param {Object} currentUser - The current user object to be updated.
 */
async function updateCurrentUserInBackend(currentUser) {  
  try {
      const existingUsers = await loadUsersFromBackend('users');
      const foundUserIndex = existingUsers.findIndex(user => user.userEMail === currentUser.userEMail);
      if (foundUserIndex !== -1) {
          existingUsers[foundUserIndex] = currentUser;
          await setItem('users', JSON.stringify(existingUsers));          
      } else {
          console.error("Error: User not found in backend.");
      }
  } catch (error) {
      console.error("Error updating current user in backend:", error);
  }
}


/**
 * Shows the contact overlay on mobile devices.
 * @param {string} contactId - The ID of the selected contact.
 */
function showContactOverlayMobile(contactId) {   
    const content = document.getElementById('all-contacts-id');
    content.innerHTML = "";
    const selectedContact = findSelectedContactMobile(contactId);    
    const overlayContent = createContactOverlayContent(selectedContact);
    openOverlay(overlayContent);
    addDropdownMenuClickListener();
}


/**
 * Finds the selected contact object from the current user's contacts list.
 * @param {string} contactId - The ID of the selected contact.
 * @returns {Object} The selected contact object.
 */
function findSelectedContactMobile(contactId) {    
    const loggedInUser = getLoggedInUser();    
    if (!loggedInUser) {
      console.error("No logged in user found.");
      return null;
    }
    return loggedInUser.contacts.find(contact => contact.id === contactId);    
}


/**
 * Creates the HTML content for the contact overlay.
 * @param {Object} selectedContact - The selected contact object.
 * @returns {string} The HTML content for the contact overlay.
 */
function createContactOverlayContent(selectedContact) {    
    return `
    <div class="openContactContainerHeader">                            
        <div class="openContactBlockHeader">
            <div>
                <p class="openContactH1">Contacts</p>
                <p class="openContactText">Better with a team!</p>                              
                <img class="addContactBlueStroked" src="./assets/img/contacts/addContactBlueStroked.svg" alt="">                                                                        
            </div>
            <div class="arrorLeftContainer">
                <div onclick="contactsInit()">
                    <img src="./assets/img/contacts/arrow-left-line.svg" alt="">
                </div>
            </div>                                                                
        </div>                    
    </div>  
    <div class="openContactContainerFooter">
        <div class="openContactUserImageAndNameContainer">
            ${singleMemberToHTML(selectedContact)}           
            <h2 class="openContactH2">${selectedContact.name}</h2>
        </div>
        <p class="openContactInformation">Contact Information</p>
        <p class="openContactEmail">Email</p>
        <a class="openContactEmailLink" href="mailto:${selectedContact.email}">${selectedContact.email}</a>
        <p class="openContactPhoneText">Phone</p>
        <p class="openContactPhoneNumber">${selectedContact.phone}</p>        
    </div>  
    <div class="dropdown-container" id="contactOptionsDropdownContainer">
        <div class="dropdown-triggerContainer">
          <div class="dropdown-trigger" onclick="toggleDropdownMenu()">
              <img id="menuContactOptionsButton" src="./assets/img/contacts/menuContactOptionsButtonImg.svg" alt="">
          </div>
        </div>
        <div class="dropdown-menu" id="contactOptionsDropdown">
            <div class="dropdown-option" data-value="edit" onclick="editContactOverlayMobile('${selectedContact.id}')">
                <img src="./assets/img/contacts/editContactsDropDownIcon.svg" alt="Edit Contact">
            </div>            
            <div class="dropdown-option" data-value="delete" onclick="deleteContactMobile('${selectedContact.id}')">
                <img src="./assets/img/contacts/DeleteContactDropwDownIcon.svg" alt="Delete Contact">
            </div>
        </div>
    </div>
  `;  
}


/**
 * Opens an overlay with the provided content.
 * @param {string} content - The HTML content for the overlay.
 */
function openOverlay(content) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.innerHTML = content;
    document.getElementById('all-contacts-id').appendChild(overlay);
    document.body.style.overflow = 'hidden';    
}


/**
 * Closes the overlay by removing its content and hiding it.
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";
  overlay.style.display = "none";
}


/**
 * Drop down menu click event listener
 */
function addDropdownMenuClickListener() {
  const { dropdownTrigger, dropdownMenu, handleDocumentClick } = addDropDownMenuClickListenerDropDownTrigger();
  dropdownTrigger.addEventListener("click", function(event) {
    const isDropdownVisible = (dropdownMenu.style.display === "block");
    closeAllDropdowns();
    toggleDropdownVisibility(dropdownMenu, isDropdownVisible);
    adjustDocumentClickListener(isDropdownVisible, handleDocumentClick);
    event.stopPropagation();
  });
}


/**
 * Adds a click event listener to the dropdown trigger to handle the dropdown menu's visibility.
 * @returns {Object} An object containing references to the dropdown trigger, dropdown menu, and event handler.
 */
function addDropDownMenuClickListenerDropDownTrigger() {
  const dropdownTrigger = document.getElementById("menuContactOptionsButton");
  const dropdownMenu = document.getElementById("contactOptionsDropdown");
  const handleDocumentClick = function (event) {
    if (!dropdownTrigger.contains(event.target) && !dropdownMenu.contains(event.target)) {
      closeDropdownMenu(dropdownMenu);
      document.removeEventListener("click", handleDocumentClick);
    }
  };
  return { dropdownTrigger, dropdownMenu, handleDocumentClick };
}


/**
 * Closes the given dropdown menu by hiding it.
 * @param {HTMLElement} menu - The dropdown menu to be closed.
 */
function closeDropdownMenu(menu) {
  menu.style.display = "none";
}


/**
 * Toggles the visibility of a dropdown menu.
 * @param {HTMLElement} menu - The dropdown menu whose visibility will be toggled.
 * @param {boolean} isVisible - Flag indicating whether the menu should be visible or hidden.
 */
function toggleDropdownVisibility(menu, isVisible) {
  menu.style.display = isVisible ? "none" : "block";
}


/**
 * Adjusts the document click event listener based on the visibility of the dropdown menu.
 * @param {boolean} isVisible - Flag indicating whether the dropdown menu is visible.
 * @param {function} listener - The event listener function to be adjusted.
 */
function adjustDocumentClickListener(isVisible, listener) {
  if (!isVisible) {
    document.addEventListener("click", listener);
  } else {
    document.removeEventListener("click", listener);
  }
}


/**
 * Close all other drop down menus
 */
function closeAllDropdowns() {
    const allDropdowns = document.querySelectorAll(".dropdown-menu");
    allDropdowns.forEach((dropdown) => {
      dropdown.style.display = "none";
    });
}


/**
 * Toggle the dropdown menu visibility
 */
function toggleDropdownMenu() {
    const dropdownMenu = document.getElementById("contactOptionsDropdown");
    if (dropdownMenu.classList.contains("slide-in")) {
        dropdownMenu.classList.remove("slide-in");
        addDropdownMenuClickListener();
    } else {
        dropdownMenu.classList.add("slide-in");
        closeAllDropdowns();        
    }
}


/**
  * Handle click on drop down menu option
  * @param {string} dropdownContainer - Drop down div Container
  * @param {string} addContactButtonContainerMobile - Render the contact button container mobile
  * @param {string} handleDocumentClick - Remove or add the event listener for the drop down menu
  */
function handleDocumentClick(dropdownTrigger, dropdownMenu) {
    return function (event) {
        if (!dropdownTrigger.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
            document.removeEventListener("click", handleDocumentClick(dropdownTrigger, dropdownMenu));
        }
    };
}


/**
 * Generates HTML for displaying a single member's information.
 * @param {Object} member - The member object containing information about the user.
 * @returns {string} The HTML code for displaying the member's information.
 */
function singleMemberToHTML(member) {
  const colorCode = member.colorCode || getRandomColorHex();
  const textColor = isColorLight(colorCode) ? "black" : "white";  
  return `
    <div class="openContactUserImgMobile" style="background-color: ${colorCode}; color: ${textColor};">
      ${getFirstLettersOfName(member.name)}
    </div>
  `;
}


/**
* Deletes a contact on mobile.
* @param {string} contactId - The ID of the contact to be deleted.
*/
function deleteContactMobile(contactId) {
  const currentUser = getLoggedInUser();
  const index = currentUser.contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
      console.error("Contact not found.");
      return;
  }
  currentUser.contacts.splice(index, 1);  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateCurrentUserInBackend(currentUser);  
  contactsInit();  
}


/**
* Opens the edit contact overlay on mobile.
* @param {string} contactId - The ID of the contact to be edited.
*/
function editContactOverlayMobile(contactId) {  
  let { content, editContactHTML } = editContactOverlayMobileVariables(contactId);  
  content.innerHTML = editContactHTML;  
  hideHeaderAndFooter();
  content.style.height = '100dvh';
  content.style.marginTop = '0px';
  content.style.overflow = 'hidden';
}


/**
* Prepares variables required for editing a contact overlay on mobile.
* @param {string} contactId - The ID of the contact to be edited.
* @returns {Object} An object containing references to the content element and the HTML code for editing the contact.
*/
function editContactOverlayMobileVariables(contactId) {
let content = document.getElementById('all-contacts-id');
content.innerHTML = "";
const overlay = document.createElement("div");
overlay.classList.add("overlay");
const currentUser = getLoggedInUser();
const selectedContact = currentUser.contacts.find(contact => contact.id === contactId);
const randomColor = getRandomColorHex();
const textColor = isColorLight(randomColor) ? 'white' : 'black';
const editContactHTML = createEditContactHTML(selectedContact, randomColor, textColor);
return { content, editContactHTML };
}


/**
* Closes the contact overlay.
*/
function closeContactOverlay() {
  let content = document.getElementById('all-contacts-id');    
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.remove();
  }
  content.style.height = '85dvh';
  content.style.marginTop = '80px';
}


/**
 * Generates HTML for editing contact information.
 * @param {Object} selectedContact - The contact object to be edited.
 * @param {string} colorCode - The background color code.
 * @param {string} textColor - The text color.
 * @returns {string} The HTML code for editing the contact.
 */
function createEditContactHTML(selectedContact, colorCode, textColor) {  
  const { name, email, phone } = selectedContact;  
  return /*html*/ `
    <div class="editContactContainerHeader">
      <div class="addContactCloseXContainer">
        <button class="addContactCloseXButtonMobile" onclick="redirectToContacts()">X</button>
      </div>
      <div class="addContactBlockHeader">
        <p class="addContactH1">Edit contact</p>
        <img class="addContactBlueStroked" src="./assets/img/contacts/addContactBlueStroked.svg" alt="">          
      </div>
    </div>
    <div class="addContactBlankUserImg">        
        ${singleMemberToHTMLOpenContactDesktop(selectedContact, 0)}
    </div>
    <form id="editcontactFormMobileID" onsubmit="updateContactMobile(${selectedContact.id})">
      <div class="addContactContainerFooter">
        <input class="openContactInputNameMobile" name="editContactInputNameMobile" id="editContactInputNameMobileID" type="text" required pattern="[A-Za-z]+" placeholder="Name" value="${name}">
        <input class="openContactInputMailAddresssMobile" name="editContactInputMailAddresssMobile" id="editContactInputMailAddresssMobileID" type="email" required placeholder="E Mail" value="${email}">
        <input class="openContactInputPhoneMobile" name="editContactInputPhoneMobile" id="editContactInputPhoneMobileID" type="tel" required pattern="[0-9]{1,}" placeholder="Phone" value="${phone}">
        <div>
          <img class="createContactButtonImg" src="./assets/img/contacts/editContactDeleteButtonImg.svg" alt="" onclick="deleteContactMobile('${selectedContact.id}')">
          <img class="createContactButtonImg" src="./assets/img/contacts/editContactSaveButtonImg.svg" alt="" onclick="updateContactMobile('${selectedContact.id}')">
        </div>
      </div>
    </form>
  `;
}


/**
* Updates contact information on mobile.
* @param {string} contactId - The ID of the contact to be updated.
*/
function updateContactMobile(contactId) {  
  const updatedName = document.getElementById('editContactInputNameMobileID').value;
  const updatedEmail = document.getElementById('editContactInputMailAddresssMobileID').value;
  const updatedPhone = document.getElementById('editContactInputPhoneMobileID').value;  
  const currentUser = getLoggedInUser();
  const contactIndex = currentUser.contacts.findIndex(contact => contact.id === contactId);
  currentUser.contacts[contactIndex].name = updatedName;
  currentUser.contacts[contactIndex].email = updatedEmail;
  currentUser.contacts[contactIndex].phone = updatedPhone;  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateCurrentUserInBackend(currentUser);  
  closeContactOverlay();  
  contactsInit();
}