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
        console.log("Existing Users:", existingUsers);
        if (typeof existingUsers !== 'object' || existingUsers === null) {
            console.error("Error: existingUsers is not an object.");
            return;
        }
        const userKey = Object.keys(existingUsers).find(key => {
            const user = existingUsers[key];
            return user && user.userEMail === currentUser.userEMail;
        });
        if (userKey) {
            await putUser(userKey, { ...existingUsers[userKey], ...currentUser });
            console.log("User updated successfully.");
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