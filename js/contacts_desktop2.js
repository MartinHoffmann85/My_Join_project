/**
 * Creates a new contact in the desktop view.
 */
function createContactDesktop() {
  const currentUser = getLoggedInUser();
  if (!currentUser) {
      console.error("No user logged in.");
      return;
  }
  const inputs = getInputElements();
  const { contactName, contactEmail, contactPhone } = validateCreateContactDesktop();
  clearErrorMessages();
  const hasError = validateInputs(inputs, { contactName, contactEmail, contactPhone });
  if (hasError) {
      return;
  }
  createContactDesktopSetup();
}


/**
 * Retrieves the input elements for contact information.
 * @returns {Object} - An object containing the input elements for name, email, and phone.
 */
function getInputElements() {
  return {
      nameInput: document.getElementById("add-contact-input-name-desktop-id"),
      emailInput: document.getElementById("add-contact-input-mail-addresss-desktop-id"),
      phoneInput: document.getElementById("add-contact-input-phone-desktop-id"),
  };
}


/**
 * Validates the input fields for contact information.
 * @param {Object} inputs - An object containing the input elements.
 * @param {Object} contactInfo - An object containing contact information.
 * @returns {boolean} - Returns true if there is an error, otherwise false.
 */
function validateInputs(inputs, contactInfo) {
  let hasError = false;
  if (validateName(inputs.nameInput, contactInfo.contactName)) {
      hasError = true;
  }
  if (validateEmail(inputs.emailInput, contactInfo.contactEmail)) {
      hasError = true;
  }
  if (validatePhone(inputs.phoneInput, contactInfo.contactPhone)) {
      hasError = true;
  }  
  return hasError;
}


/**
 * Displays an error message below the input field.
 * @param {HTMLElement} inputField - The input field where the error message should be displayed.
 * @param {string} message - The error message to be displayed.
 */
function displayErrorMessage(inputField, message) {
  const errorMessage = document.createElement("div");
  errorMessage.textContent = message;
  errorMessage.style.color = "red";
  errorMessage.classList.add("error-message");
  inputField.parentNode.insertBefore(errorMessage, inputField.nextSibling);
}


/**
* Clears previous error messages from the input fields.
*/
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => message.remove());
}


/**
 * Sets up the process for creating a new contact in the desktop view.
 * This function retrieves new contact information, assigns a unique ID to the contact, 
 * adds the contact to the current user's contact list, hides the overlay, 
 * initializes the contact list display, and shows a success message.
 */
function createContactDesktopSetup() {
  const newContact = getNewContactDesktop();
  newContact.id = generateUniqueID();
  addContactToCurrentUser(newContact);
  hideOverlay();
  contactsInit();
  showSuccessfullyContactCreatedImageDesktop();
}


/**
 * Validates and retrieves the contact information from the input fields in the add contact overlay.
 * This function trims the input values for name, email, and phone, 
 * and returns an object containing the contact information. 
 * @returns {Object} An object containing the contact details with the following properties:
 * - {string} contactName - The name of the new contact.
 * - {string} contactEmail - The email address of the new contact.
 * - {string} contactPhone - The phone number of the new contact.
 */
function validateCreateContactDesktop() {
  const contactName = document.getElementById("add-contact-input-name-desktop-id").value.trim();
  const contactEmail = document.getElementById("add-contact-input-mail-addresss-desktop-id").value.trim();
  const contactPhone = document.getElementById("add-contact-input-phone-desktop-id").value.trim();
  return { contactName, contactEmail, contactPhone };
}


/**
* Retrieves the new contact details from the input fields in the desktop view.
* @returns {Object} - The new contact object with name, email, and phone.
*/
function getNewContactDesktop() {
  const contactName = document.getElementById("add-contact-input-name-desktop-id").value;
  const contactEmail = document.getElementById("add-contact-input-mail-addresss-desktop-id").value;
  const contactPhone = document.getElementById("add-contact-input-phone-desktop-id").value;
  return { name: contactName, email: contactEmail, phone: contactPhone };
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
 * Generate HTML for editContactDestop
 * @param {string} overlayContent - Overlay div container
 * @param {string} selectedContact - This is the selected contact to open
 */
function generateHTMLEditContactDesktop(overlayContent, selectedContact) {
    overlayContent.innerHTML = /*html*/ `
      <div class="overlay-card">
        <div class="addContactDesktopLeftSideContainer">
          <div class="flexDirectionColumn">
            <img class="joinLogoGreyBackgroundImg" src="./assets/img/contacts/joinLogoGreyBackground.png" alt="">
            <h1 class="addContactDesktopLeftSideContainerH1">Edit contact</h1>          
            <img class="addContactBlueStroked" src="./assets/img/contacts/addContactBlueStroked.svg" alt="">
          </div>
        </div>
        <div class="addContactDesktopRightSideContainer">
          <div class="addContactBlankUserImgContainer">          
            ${singleMemberToHTMLOpenContactDesktop2(selectedContact, 0)}
          </div>
          <div class="addContactDesktopRightSideContent">
            <div class="addContactCloseXContainerDesktop">
              <button class="addContactCloseXButton" onclick="hideOverlay()">X</button>
            </div>
            <div id="editContactDestopID">
              <div class="addContactContainerFooter">                
                  <input class="addContactInputNameDesktop" type="text" name="editContactInputNameDesktop" id="editContactInputNameDesktopID" required placeholder="Name" value="${selectedContact.name}">
                  <input class="addContactInputMailAddresssDesktop" type="email" name="editContactInputMailAddresssDesktop" id="editContactInputMailAddresssDesktopID" required placeholder="E-Mail" value="${selectedContact.email}">
                  <input class="addContactInputPhoneDesktop" type="tel" name="editContactInputPhoneDesktop" id="editContactInputPhoneDesktopID" required pattern="[0-9]{1,}" placeholder="Phone" value="${selectedContact.phone}">
                  <div class="addContactButtonContainerDesktop">
                    <button class="cancelContactDesktopDeleteButton" onclick="deleteContactDesktop(${lastClickedContactId})">Delete</button>
                    <button class="createContactButton" onclick="updateContactsDataDesktop(lastClickedContactId)">Save</button>
                  </div>                
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
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