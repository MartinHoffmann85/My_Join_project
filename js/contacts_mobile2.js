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
    if (!currentUser) {
        console.error("No user is currently logged in.");
        return;
    }
    let { colorCode, textColorCode } = addContactToCurrentUserVariables(newContact);
    if (!Array.isArray(currentUser.contacts)) {
        currentUser.contacts = [];
    }
    if (!colorCode || !textColorCode) {      
        colorCode = getRandomColorHex();
        textColorCode = isColorLight(colorCode) ? 'white' : 'black';
    }
    newContact.colorCode = colorCode;
    newContact.textColorCode = textColorCode;
    currentUser.contacts.push(newContact);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    await updateCurrentUserInBackend(currentUser);  
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
        if (typeof existingUsers !== 'object' || existingUsers === null) {
            console.error("Error: existingUsers is not an object.");
            return;
        }
        const userKey = Object.keys(existingUsers).find(key => {
            const user = existingUsers[key];
            return user && user.userEMail === currentUser.userEMail;
        });
        if (userKey) {
            await putUser(userKey, { ...existingUsers[userKey], ...currentUser });;
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
 * Finds the selected contact from the logged-in user's contacts list using the provided contact ID.
 * 
 * @param {string} contactId - The ID of the contact to find.
 * @returns {Object | null} The selected contact object, or null if no logged-in user is found or the contact is not found.
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
    content.style.marginTop = '0px';
    content.style.overflow = 'hidden';
    removeMaxHeight();
}