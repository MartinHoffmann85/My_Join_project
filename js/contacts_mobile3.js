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
                    <button type="button" class="createContactButtonImg" onclick="deleteContactMobile('${selectedContact.id}')">
                    <img src="./assets/img/contacts/editContactDeleteButtonImg.svg" alt="">
                </button>
                <button type="submit" class="createContactButtonImg">
                    <img src="./assets/img/contacts/editContactSaveButtonImg.svg" alt="">
                </button>
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