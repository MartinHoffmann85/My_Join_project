/**
 * Show overlay for add contact at desktop view
 */
function addContactShowOverlayDesktop() {
    const overlayContainer = document.createElement("div");
    overlayContainer.classList.add("overlay-container");
    document.body.appendChild(overlayContainer);
    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay-content");
    overlayContainer.appendChild(overlayContent);
    generateHTMLAddContactShowOverlayDesktop(overlayContent);    
    overlayContainer.style.animation = "slide-in-menu 0.5s ease-out";
}


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