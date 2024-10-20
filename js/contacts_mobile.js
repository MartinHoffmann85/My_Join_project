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
    word = word.replace(/[()]/g, '');
    if (word.toLowerCase() === "you") {
      continue;
    }
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
* Redirects the user to the contacts page.
*/
function redirectToContacts() {
  window.location.assign("./contacts.html");
}


/**
 * Checks the screen height and adjusts body overflow accordingly.
 */
function checkScreenHeightAndAdjustOverflow() {
  const screenHeight = window.innerHeight;
  const body = document.body;  
  if (screenHeight <= 667) {
    body.style.overflow = 'scroll';
  } else {
    body.style.overflow = 'auto';
  }
}


/**
 * Saves the updated contact list of the current user.
 * @param {Object} currentUser - The current user object.
 * @param {Object} newContact - The new contact object to add.
 */
function saveCurrentUserContacts(currentUser, newContact) {
  currentUser.contacts.push(newContact);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
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
      if (!isValidUserObject(existingUsers)) return;
      const userKey = findUserKey(existingUsers, currentUser.userEMail);
      if (userKey) await putUser(userKey, { ...existingUsers[userKey], ...currentUser });
  } catch (error) {
      console.error("Error updating current user in backend:", error);
  }
}


/**
* Checks if the provided users object is valid.
* @param {Object} users - The users object.
* @returns {boolean} True if valid, otherwise false.
*/
function isValidUserObject(users) {
  if (typeof users !== 'object' || users === null) {
      console.error("Error: existingUsers is not an object.");
      return false;
  }
  return true;
}


/**
* Finds the key of the user matching the email.
* @param {Object} users - The users object.
* @param {string} email - The email of the current user.
* @returns {string|undefined} The user key if found, otherwise undefined.
*/
function findUserKey(users, email) {
  return Object.keys(users).find(key => users[key]?.userEMail === email);
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