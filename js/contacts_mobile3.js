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
    content.style.marginTop = '0px';
    content.style.overflow = 'hidden';
    removeMaxHeight();
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
        <div class="addContactContainerFooter">
            <input class="openContactInputNameMobile" name="editContactInputNameMobile" id="editContactInputNameMobileID" type="text" required pattern="[A-Za-z'\\- ]+" placeholder="Name" value="${name}">
            <input class="openContactInputMailAddresssMobile" name="editContactInputMailAddresssMobile" id="editContactInputMailAddresssMobileID" type="email" required placeholder="E Mail" value="${email}">
            <input class="openContactInputPhoneMobile" name="editContactInputPhoneMobile" id="editContactInputPhoneMobileID" type="tel" required pattern="[0-9]{1,}" placeholder="Phone" value="${phone}">
            <div>
                <button type="button" class="createContactButtonImg" onclick="deleteContactMobile('${selectedContact.id}')">
                <img src="./assets/img/contacts/editContactDeleteButtonImg.svg" alt="">
            </button>
            <button onclick="updateContactMobile(event, '${selectedContact.id}')" class="createContactButtonImg">
                <img src="./assets/img/contacts/editContactSaveButtonImg.svg" alt="">
            </button>
        </div>
    </div>    
    `;
}


/**
 * Sets the max-height of the element with the class 'allContacts' to 100vh (full viewport height).
 * This function ensures that the element occupies the entire vertical space of the viewport.
 */
function setMaxHeightFull() {
    const allContacts = document.querySelector('.allContacts');
    if (allContacts) {
        allContacts.style.maxHeight = '100vh';
    }
}


/**
 * Sets the max-height of the element with the class 'allContacts' to a calculated value of 100vh minus 170px.
 * This function allows for a reduced height to account for other UI elements (e.g., header or footer).
 */
function setMaxHeightReduced() {
    const allContacts = document.querySelector('.allContacts');
    if (allContacts) {
        allContacts.style.maxHeight = 'calc(100vh - 170px)';
    }
}


/**
 * Removes the max-height restriction of the element with the class 'allContacts' by setting its max-height to 'none'.
 * This effectively removes any height limitation, allowing the element to expand freely.
 */
function removeMaxHeight() {
    const allContacts = document.querySelector('.allContacts');
    if (allContacts) {
        allContacts.style.maxHeight = 'none';
    }
}


/**
 * Updates contact information on mobile.
 * @param {Event} event - The event object.
 * @param {string} contactId - The ID of the contact to be updated.
 */
function updateContactMobile(event, contactId) {
    event.preventDefault();
    const inputs = getEditInputElementsMobile();
    const updatedContactInfo = getUpdatedContactInfo(inputs);
    if (validateAndHandleErrors(inputs, updatedContactInfo)) return;
    const currentUser = getLoggedInUser();
    updateContactData(currentUser, contactId, updatedContactInfo);
    saveAndRefresh(currentUser);
}


/**
 * Retrieves updated contact information from inputs.
 * @param {Object} inputs - Input elements containing contact details.
 * @returns {Object} - Updated contact information.
 */
function getUpdatedContactInfo(inputs) {
    return {
        contactName: inputs.nameInput.value,
        contactEmail: inputs.emailInput.value,
        contactPhone: inputs.phoneInput.value
    };
}


/**
 * Retrieves the input elements for editing mobile contact information.
 * @returns {Object} - An object containing the input elements for name, email, and phone.
 */
function getEditInputElementsMobile() {
    return {
        nameInput: document.getElementById('editContactInputNameMobileID'),
        emailInput: document.getElementById('editContactInputMailAddresssMobileID'),
        phoneInput: document.getElementById('editContactInputPhoneMobileID'),
    };
}


/**
 * Updates the contact information in the current user's contact list.
 * @param {Object} currentUser - The current logged-in user.
 * @param {string} contactId - The ID of the contact to be updated.
 * @param {Object} updatedContactInfo - The new contact information.
 */
function updateContactData(currentUser, contactId, updatedContactInfo) {
    const contactIndex = currentUser.contacts.findIndex(contact => contact.id === contactId);
    currentUser.contacts[contactIndex].name = updatedContactInfo.contactName;
    currentUser.contacts[contactIndex].email = updatedContactInfo.contactEmail;
    currentUser.contacts[contactIndex].phone = updatedContactInfo.contactPhone;
}


/**
 * Saves the updated user data and refreshes the UI.
 * @param {Object} currentUser - The current user with updated contact information.
 */
function saveAndRefresh(currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateCurrentUserInBackend(currentUser);
    closeContactOverlay();
    contactsInit();
}


