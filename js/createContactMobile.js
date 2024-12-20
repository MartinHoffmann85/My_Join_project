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
 * Creates a new contact in mobile view.
 */
async function createContactMobile() {
    const currentUser = getLoggedInUser();
    if (!currentUser) return console.error("No user logged in.");
    const inputs = getInputElementsMobile();
    const contactInfo = {
      contactName: inputs.nameInput.value,
      contactEmail: inputs.emailInput.value,
      contactPhone: inputs.phoneInput.value
    };
    if (validateAndHandleErrors(inputs, contactInfo)) return;
    saveNewContact(contactInfo.contactName, contactInfo.contactEmail, contactInfo.contactPhone);
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
* Validates the input fields for the mobile view and adjusts body overflow based on screen height.
* @param {Object} inputs - An object containing the input elements.
* @param {Object} contactInfo - An object containing contact information.
* @returns {boolean} - Returns true if there is an error, otherwise false.
*/
function validateInputsMobile(inputs, contactInfo) {
      checkScreenHeightAndAdjustOverflow();  
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
 * Validates the contact name input.
 * @param {Object} nameInput - The input element for the contact name.
 * @param {string} contactName - The name of the contact.
 * @returns {boolean} - Returns true if there is an error.
 */
function validateName(nameInput, contactName) {
    const nameHasNumbers = /\d/;  
    if (!contactName) {
      displayErrorMessage(nameInput, "Line cannot be empty, please fill it out.");
      return true;
    } else if (nameHasNumbers.test(contactName)) {
      displayErrorMessage(nameInput, "The name cannot contain numbers.");
      return true;
    }  
    return false;
}


/**
* Validates the contact email input.
* @param {Object} emailInput - The input element for the contact email.
* @param {string} contactEmail - The email of the contact.
* @returns {boolean} - Returns true if there is an error.
*/
function validateEmail(emailInput, contactEmail) {
    if (!contactEmail) {
      displayErrorMessage(emailInput, "Line cannot be empty, please fill it out.");
      return true;
    }
    return false;
}


/**
* Validates the contact phone input.
* @param {Object} phoneInput - The input element for the contact phone.
* @param {string} contactPhone - The phone number of the contact.
* @returns {boolean} - Returns true if there is an error.
*/
function validatePhone(phoneInput, contactPhone) {
    const phoneIsValid = /^\d+$/;  
    if (!contactPhone) {
      displayErrorMessage(phoneInput, "Line cannot be empty, please fill it out.");
      return true;
    } else if (!phoneIsValid.test(contactPhone)) {
      displayErrorMessage(phoneInput, "The phone number can only contain digits.");
      return true;
    }  
    return false;
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
 * Show successfully contact created image.
 */
function showSuccessfullyContactCreatedImageMobile() {  
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
    const currentUser = getLoggedInUser();
    if (!currentUser) return console.error("No user is currently logged in.");
    const { colorCode, textColorCode } = getContactColors(newContact);
    prepareNewContact(newContact, currentUser, colorCode, textColorCode);
    saveCurrentUserContacts(currentUser, newContact);
    await updateCurrentUserInBackend(currentUser);
}


/**
 * Retrieves or generates contact colors.
 * @param {Object} newContact - The new contact object.
 * @returns {Object} An object with colorCode and textColorCode.
 */
function getContactColors(newContact) {
    let { colorCode, textColorCode } = addContactToCurrentUserVariables(newContact);
    if (!colorCode || !textColorCode) {
        colorCode = getRandomColorHex();
        textColorCode = isColorLight(colorCode) ? 'white' : 'black';
    }
    return { colorCode, textColorCode };
}


/**
 * Prepares the new contact and adds it to the current user's contacts.
 * @param {Object} newContact - The new contact object.
 * @param {Object} currentUser - The current user object.
 * @param {string} colorCode - The color code for the contact.
 * @param {string} textColorCode - The text color for the contact.
 */
function prepareNewContact(newContact, currentUser, colorCode, textColorCode) {
    newContact.colorCode = colorCode;
    newContact.textColorCode = textColorCode;
    if (!Array.isArray(currentUser.contacts)) currentUser.contacts = [];
}