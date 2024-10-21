/* Render contacts desktop view */

let lastClickedContactId;


/**
 * Saves the updated user data in localStorage and updates the backend.
 * @param {Object} currentUser - The currently logged-in user.
 */
function saveUserData(currentUser) {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateCurrentUserInBackend(currentUser);
}


/**
 * Refreshes the UI after the contact has been deleted.
 */
function refreshUI() {
  document.getElementById("contactsContentRightSideContactDataContainerID").innerHTML = "";
  contactsInit();
}


/**
 * Show overlay for editing a contact at desktop view
 * @param {string} lastClickedContactId - The ID of the last clicked contact
 */
function editContactDestop(lastClickedContactId) {
  const currentUser = getLoggedInUser();
  const selectedContact = currentUser.contacts.find(contact => contact.id === lastClickedContactId);    
  const overlayContainer = document.createElement("div");
  overlayContainer.classList.add("overlay-container");
  document.body.appendChild(overlayContainer);  
  const overlayContent = document.createElement("div");
  overlayContent.classList.add("overlay-content");
  overlayContainer.appendChild(overlayContent);  
  generateHTMLEditContactDesktop(overlayContent, selectedContact);  
  overlayContainer.style.animation = "slide-in-menu 0.5s ease-out";
}


/**
* Converts a single member object to HTML markup for displaying in the open contact desktop view.
* @param {Object} member - The member object containing details like name and color code.
* @param {number} index - The index of the member.
* @returns {string} - The HTML markup representing the member.
*/
function singleMemberToHTMLOpenContactDesktop2(member, index) {
let textcolor;
let iconRightStep = 10;
if (!isColorLight(member.colorCode)) textcolor = 'white';
return `
    <div class="openContactUserImgMobile2" style="background-color: ${member.colorCode};color:${textcolor};right:${index * iconRightStep}px">
        ${getFirstLettersOfName(member.name)}
    </div>
`;
}


/**
* Updates the contact data on the desktop after validation.
* @param {string} contactId - The ID of the contact to be updated.
*/
function updateContactsDataDesktop(contactId) {
const { currentUser, contactIndex } = updateContactsDataDesktopVariables(contactId);  
try {
    const { updatedName, updatedEmail, updatedPhone } = editContactInputValidation();
    currentUser.contacts[contactIndex].name = updatedName;
    currentUser.contacts[contactIndex].email = updatedEmail;
    currentUser.contacts[contactIndex].phone = updatedPhone;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateCurrentUserInBackend(currentUser);  
    clearAddContactDesktopRightSideContainer();
    hideOverlay();
    contactsInit();    
} catch (error) {
    displayErrorMessage(document.getElementById('editContactInputNameDesktopID'), error.message);
}
}


/**
* Validates the input fields for editing contact information.
* @returns {Object} - An object containing the updated contact data or throws an error.
*/
function editContactInputValidation() {
const updatedName = document.getElementById('editContactInputNameDesktopID').value.trim();
const updatedEmail = document.getElementById('editContactInputMailAddresssDesktopID').value.trim();
const updatedPhone = document.getElementById('editContactInputPhoneDesktopID').value.trim();
if (!updatedName) {
    throw new Error("Name is required.");
}
if (/[\d]/.test(updatedName)) {
    throw new Error("Name cannot contain numbers.");
}
if (!updatedEmail || !validateEmailFormat(updatedEmail)) {
    throw new Error("A valid email address is required.");
}
if (!updatedPhone || !validatePhoneFormat(updatedPhone)) {
    throw new Error("A valid phone number is required.");
}
return { updatedName, updatedEmail, updatedPhone };
}


/**
* Show successfully contact created image.
*/
function showSuccessfullyContactCreatedImageDesktop() {  
  const imageElement = document.createElement("img");
  imageElement.src = './assets/img/contacts/contactSuccessfullyCreatedOverlay.svg';
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
* Retrieves variables required for updating contact data on desktop.
* @param {string} contactId - The ID of the contact to be updated.
* @returns {Object} - Object containing updated contact data and related variables.
*/
function updateContactsDataDesktopVariables(contactId) {
  const currentUser = getLoggedInUser();
  const contactIndex = currentUser.contacts.findIndex(contact => contact.id === contactId);
  return { currentUser, contactIndex };
}


/**
* Validate email format.
* @param {string} email - The email to validate.
* @returns {boolean} - Returns true if valid, otherwise false.
*/
function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


/**
* Validate phone format (simple validation).
* @param {string} phone - The phone number to validate.
* @returns {boolean} - Returns true if valid, otherwise false.
*/
function validatePhoneFormat(phone) {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
}


/**
* Clear add contact desktop right side container
*/
function clearAddContactDesktopRightSideContainer() {
  let addContactDesktopRightSideContainer = document.getElementById("contactsContentRightSideContactDataContainerID");
  addContactDesktopRightSideContainer.innerHTML = "";
}