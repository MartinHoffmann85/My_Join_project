/* Desktop view */
/* Render contacts desktop view */

let lastClickedContactId;

function renderContactsDesktop() {
    const content = document.getElementById("all-contacts-id");
    content.innerHTML = "";
    renderAddContactButtonDesktop();
    const contactsByFirstLetter = groupContactsByFirstLetter();
    renderContactsByFirstLetterDesktop(content, contactsByFirstLetter);
}

/**
 * Create add contact button for desktop view
 */
function renderAddContactButtonDesktop() {
    const contentDesktop = document.getElementById("all-contacts-id");
    const addContactButtonContainerDesktop = document.createElement("div");
    addContactButtonContainerDesktop.classList.add("addContactButtonContainerDesktop");
    addContactButtonContainerDesktop.innerHTML = /*html*/ `
      <button class="addContactButtonDesktop" onclick="addContactShowOverlayDesktop()">Add new contact
        <span><img class="addContactButtonDesktopImg" src="../assets/img/contacts/addNewContactDesktopButtonImg.svg" alt=""></span></button>    
      `;    
    contentDesktop.appendChild(addContactButtonContainerDesktop);  
    addContactButtonContainerDesktop.addEventListener("click", function () { 
    });
}


/**
 * Create letter div container for sorted contacts by first letter
 */
function groupContactsByFirstLetter() {
    const contactsByFirstLetter = {};
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));    
    if (!loggedInUser || !loggedInUser.contacts) {
        console.error('Error: User or contacts not found.');
        return contactsByFirstLetter;
    }
    loggedInUser.contacts.sort((a, b) => a.name.localeCompare(b.name));
    loggedInUser.contacts.forEach((oneContact) => {
        const firstLetter = oneContact.name.charAt(0).toUpperCase();
        if (!contactsByFirstLetter[firstLetter]) {
            contactsByFirstLetter[firstLetter] = createLetterContainer(firstLetter);
        }
        const oneContactContainer = createContactContainer(oneContact);
        contactsByFirstLetter[firstLetter] += oneContactContainer;
    });
    return contactsByFirstLetter;
}


/**
 * Generate HTML for the letters
 * @param {string} firstLetter - This is the first letter from contact name
 */
function createLetterContainer(firstLetter) {
    return `
        <div class="letterAndContactsContainer">
            <div class="letter-column">
                <h2 class="contact-first-letter-desktop">${firstLetter}</h2>
            </div>
        </div>
    `;
}


/**
 * Generate HTML for each contact
 * @param {string} oneContact - One contact data oneContact.id / oneContact color / oneContact.name / oneContact.email
 */
function createContactContainer(oneContact) {    
    return `
        <div class="oneContactContainer" id="contact-${oneContact.id}" onclick="openContactScreenDesktop('${oneContact.id}')" data-contact-id="${oneContact.id}">
            <div>                
                ${singleMemberToHTML(oneContact, 0)}
            </div>
            <div class="contact-info-container-Desktop">
                <h2 class="oneContactContainerH2Desktop">${oneContact.name}</h2>
                <a class="oneContactContainerAElementDesktop">${oneContact.email}</a>
            </div>
        </div>
    `;
}


/**
 * Add each contact to the section on desktop view
 * @param {string} content - contactsContent div container
 * @param {string} contactsByFirstLetter - Sorted contacts by first letter
 */
function renderContactsByFirstLetterDesktop(content, contactsByFirstLetter) {  // 
    Object.values(contactsByFirstLetter).forEach((section) => {
        content.innerHTML += section;
    });
}


/* Open contact desktop view */

/**
 * Show clicked contact details for desktop view
 * @param {string} contactId - This is the contact ID example "5"
 */
function openContactScreenDesktop(contactId) {    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.contacts) {
        console.error('Error: User or contacts not found.');
        return;
    }
    const content = document.getElementById("contactsContentRightSideID");    
    const selectedContact = currentUser.contacts.find(contact => contact.id === contactId);
    if (!selectedContact) {
        console.error('Error: Selected contact not found.');
        return;
    }    
    if (lastClickedContactId !== contactId) {
        openContactsScreenDesktopChangeColorWhite(lastClickedContactId);
        lastClickedContactId = contactId;
        openContactsScreenDesktopChangeColorBlack(contactId);
    }    
    openContactScreenDesktopHTML(content, selectedContact);    
    showHeaderAndFooter();    
    showContactsContentRightSideDesktop();    
    const contactContainer = document.getElementById("contactsContentRightSideContactDataContainerID");
    contactContainer.style.animation = "slide-in-desktop 0.5s ease-out";
}


function openContactsScreenDesktopChangeColorBlack(contactId) {
    const currentContactContainer = document.querySelector(`.oneContactContainer[data-contact-id="${contactId}"]`);
    if (currentContactContainer) {
        currentContactContainer.style.backgroundColor = "#2A3647";
        const currentContactH2 = currentContactContainer.querySelector("h2");
        if (currentContactH2) {
            currentContactH2.style.color = "white";
        }
    }
}


function openContactsScreenDesktopChangeColorWhite(contactId) {
    const lastClickedContactContainer = document.querySelector(`.oneContactContainer[data-contact-id="${contactId}"]`);
    if (lastClickedContactContainer) {
        lastClickedContactContainer.style.backgroundColor = "white";
        const lastClickedContactH2 = lastClickedContactContainer.querySelector("h2");
        if (lastClickedContactH2) {
            lastClickedContactH2.style.color = "black";
        }
    }
}


/**
 * Generate HTML for clicked contact details
 * @param {string} content - contactsContent div container
 * @param {string} selectedContact - This is the selected contact to open
 */
function openContactScreenDesktopHTML(content, selectedContact) {
    content.innerHTML = /*html*/ `
      <div class="contactsContentRightSideHeadLine">
          <h1 class="contactsContentRightSideH1">
            Contacts
          </h1>
          <img class="contactsContentRightSideBlueStribeSvg" src="../../assets/img/contacts/contactsContentRightSideBlueStripe.svg" alt="">        
          <p class="contactsContentRightSideHeadLinePElement">Better with a team</p>
      </div>  
      <div id="contactsContentRightSideContactDataContainerID">
        <div class="contactsContentRightSideUserImgAndNameContainer">
          ${singleMemberToHTMLOpenContactDesktop(selectedContact, 0)}
        <div>
            <h2 class="contactsContentRightSideUserNameH2">${selectedContact.name}</h2>
              <div class="contactsContentRightSideEditAndDeleteButtonContainer">
                <img class="contactsContentRightSideEditButton" src="../../assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="editContactDestop(lastClickedContactId)">
                <img class="contactsContentRightSideDeleteButton" src="../../assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteContactDesktop(lastClickedContactId)">
              </div>
          </div> 
        </div>
        <div class="contactsContentRightSideContactInformationDesktop">
          <p class="contactsContentRightSideContactInformationDesktopPText">Contact Information</p>
        </div>
        <div class="contactsContentRightSideContactEmailH2Desktop">
          <h2 class="contactsContentRightSideContactEmailH2">Email</h2>
        </div>
        <div class="openContactEmailLinkDesktopContainer">
          <a class="openContactEmailLinkDesktop" href="mailto:${selectedContact.email}">${selectedContact.email}</a>
        </div>
        <div class="contactsContentRightSideContactPhoneH2DesktopContainer">
          <h2 class="contactsContentRightSideContactPhoneH2Desktop">Phone</h2>
        </div>
        <div class="openphoneNumberDesktopContainer">
          <p class="openphoneNumberDesktopPElement">${selectedContact.phone}</p>
        </div>
      </div>
     `;
}


  /**
 * Show the color from user image background html
 * @param {string} member - This is the user or contact name
 * @param {string} index - This is the ID for the user or contact
 */
function singleMemberToHTMLOpenContactDesktop(member, index) {
    let textcolor;
    let iconRightStep = 10;
    if (!isColorLight(member.colorCode)) textcolor = 'white';
    return `
        <div class="openContactUserImgDesktop" style="background-color: ${member.colorCode};color:${textcolor};right:${index * iconRightStep}px">
              ${getFirstLettersOfName(member.name)}
        </div>
    `;
}


/**
 * Show contacts content right side only for desktop view
 */
function showContactsContentRightSideDesktop() {
    const showcontactsContentRightSide = document.getElementById("contactsContentRightSideID");
    showcontactsContentRightSide.style.display = "flex";
}

// Delete contact desktop

function deleteContactDesktop(contactId) {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        console.error("Logged in user not found.");
        return;
    }
    const index = currentUser.contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        console.error("Contact not found.");
        return;
    }
    currentUser.contacts.splice(index, 1);  
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateCurrentUserInBackend(currentUser);
    document.getElementById("contactsContentRightSideContactDataContainerID").innerHTML = "";
    contactsInit();  
}


// Add contact screen overlay desktop

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
  * Generate HTML for add contact show overlay desktop
  * @param {string} overlayContent - Overlay div container
  */
function generateHTMLAddContactShowOverlayDesktop(overlayContent) {
    overlayContent.innerHTML = /*html*/ `
      <div class="overlay-card">
        <div class="addContactDesktopLeftSideContainer">
          <div class="flexDirectionColumn">
            <img class="joinLogoGreyBackgroundImg" src="../../assets/img/contacts/joinLogoGreyBackground.png" alt="">
            <h1 class="addContactDesktopLeftSideContainerH1">Add contact</h1>
            <p class="addContactDesktopLeftSideContainerPElement">Tasks are better with a team!</p>
            <img class="addContactBlueStroked" src="../../assets/img/contacts/addContactBlueStroked.svg" alt="">
          </div>
        </div>
        <div class="addContactDesktopRightSideContent">
            <div class="addContactCloseXContainerDesktop">
              <button class="addContactCloseXButton" onclick="hideOverlay()">X</button>
            </div>
            <div id="edit-contact-destop-id">
              <div class="addContactContainerFooter">
              <form id="add-contact-show-overlay-desktop-id" name="addContactShowOverlayDesktop" onsubmit="event.preventDefault(); createContactDesktop()">
              <div class="addContactContainerFooter">
              <input class="addContactInputNameDesktop" type="text" name="addContactInputNameDesktop" id="add-contact-input-name-desktop-id" required pattern="[A-Za-z]+" placeholder="Name" data-contacts>
                <input class="addContactInputMailAddresssDesktop" name="addContactInputMailAddresssDesktop" id="add-contact-input-mail-addresss-desktop-id" type="email" required placeholder="E Mail" data-contacts>
                <input class="addContactInputPhoneDesktop" type="tel" name="addContactInputPhoneDesktop" id="add-contact-input-phone-desktop-id" required pattern="[0-9]{1,}" placeholder="Phone" data-contacts>
                <div class="addContactButtonContainerDesktop">
                  <button class="cancelContactDesktopDeleteButton" onclick="event.preventDefault(); hideOverlay()">Cancel</button>
                  <button class="createContactButton" onclick="createContactDesktop()">Create contact</button>
                  </div>
                </div>
              </form>  
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
}


/**
 * Function to hide the overlay screen on desktop view
 */
function hideOverlay() {
    const overlayContainer = document.querySelector(".overlay-container");
    if (overlayContainer) {
      overlayContainer.parentNode.removeChild(overlayContainer);
    }
}


function createContactDesktop() {
    const currentUser = getLoggedInUser();
      if (!currentUser) {
          console.error("No user logged in.");
          return;
      }    
      const newContact = getNewContactDesktop();
      newContact.id = generateUniqueID();    
      addContactToCurrentUser(newContact);
      hideOverlay();
      contactsInit();
}


function getNewContactDesktop() {
    const contactName = document.getElementById("add-contact-input-name-desktop-id").value;
    const contactEmail = document.getElementById("add-contact-input-mail-addresss-desktop-id").value;
    const contactPhone = document.getElementById("add-contact-input-phone-desktop-id").value;
    return { name: contactName, email: contactEmail, phone: contactPhone };
}


// Edit contact screen overlay desktop

/**
 * Show overlay for editing a contact at desktop view
 * @param {string} lastClickedContactId - The ID of the last clicked contact
 */
function editContactDestop(lastClickedContactId) {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        console.error("Logged in user not found.");
        return;
    }
    const selectedContact = currentUser.contacts.find(contact => contact.id === lastClickedContactId);
    if (!selectedContact) {
        console.error('Error: Selected contact not found.');
        return;
    }  
    const overlayContainer = document.createElement("div");
    overlayContainer.classList.add("overlay-container");
    document.body.appendChild(overlayContainer);  
    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay-content");
    overlayContainer.appendChild(overlayContent);  
    generateHTMLEditContactDesktop(overlayContent, selectedContact);  
    overlayContainer.style.animation = "slide-in 0.5s ease-out";
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
            <img class="joinLogoGreyBackgroundImg" src="../../assets/img/contacts/joinLogoGreyBackground.png" alt="">
            <h1 class="addContactDesktopLeftSideContainerH1">Edit contact</h1>          
            <img class="addContactBlueStroked" src="../../assets/img/contacts/addContactBlueStroked.svg" alt="">
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
                <form id="addContactForm" onsubmit="event.preventDefault(); updateContactsDataDesktop(lastClickedContactId)">
                  <input class="addContactInputNameDesktop" type="text" name="editContactInputNameDesktop" id="editContactInputNameDesktopID" required placeholder="Name" value="${selectedContact.name}">
                  <input class="addContactInputMailAddresssDesktop" type="email" name="editContactInputMailAddresssDesktop" id="editContactInputMailAddresssDesktopID" required placeholder="E-Mail" value="${selectedContact.email}">
                  <input class="addContactInputPhoneDesktop" type="tel" name="editContactInputPhoneDesktop" id="editContactInputPhoneDesktopID" required pattern="[0-9]{1,}" placeholder="Phone" value="${selectedContact.phone}">
                  <div class="addContactButtonContainerDesktop">
                    <button class="cancelContactDesktopDeleteButton" onclick="deleteContactDesktop(${lastClickedContactId})">Delete</button>
                    <button class="createContactButton" type="submit">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}


/**
  * Function to generate user image with random background-color on mobile view
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
 * Get updated input data for desktop view
 */
function getUpdatedInputsDesktop() {
    const nameInput = document.querySelector(".addContactInputNameDesktop");
    const mailInput = document.querySelector(".addContactInputMailAddresssDesktop");
    const phoneInput = document.querySelector(".addContactInputPhoneDesktop");
    return {
        updatedName: nameInput.value.trim(),
        updatedMail: mailInput.value.trim(),
        updatedPhone: phoneInput.value.trim()
    };
}


/**
 * Get the contact to edit
 * @param {string} updatedInputs - Here are the new contact name / the new contact email / the new contact phone number
 * @param {string} contactId - This is the contact ID example "5"
 */
function findExistingContactDesktop(updatedInputs, contactId) {
    return currentUser.contacts.find(
        (contact) =>
            contact.name === updatedInputs.updatedName &&
            contact.email === updatedInputs.updatedMail &&
            contact.id !== contactId
    );
}


/**
 * Find the contact by ID
 * @param {string} contactId - This is the contact ID example "5"
 */
function findOldContactDesktop(contactId) {
    return currentUser.contacts.find((contact) => contact.id === contactId);
}


/**
 * Check if contact data changed
 * @param {string} oldContact - This are the old contact name / emal / phone number
 * @param {string} updatedInputs - This are the new contact / email / phone number
 */
function checkForChangesDesktop(oldContact, updatedInputs) {
    return {
        hasNameChanged: oldContact.name !== updatedInputs.updatedName,
        hasMailChanged: oldContact.email !== updatedInputs.updatedMail,
        hasPhoneChanged: oldContact.phone !== updatedInputs.updatedPhone
    };
}


/**
 * Overwrite the old contact data with the new contact data
 * @param {string} contactId - This is the contact ID example "5"
 * @param {string} updatedInputs - This are the new contact / email / phone number
 * @param {boolean} hasChanged - Example {hasNameChanged: false, hasMailChanged: false, hasPhoneChanged: true}
 */
function updateContactsDataDesktop(contactId) {    
    const updatedName = document.getElementById('editContactInputNameDesktopID').value;
    const updatedEmail = document.getElementById('editContactInputMailAddresssDesktopID').value;
    const updatedPhone = document.getElementById('editContactInputPhoneDesktopID').value;  
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        console.error("Logged in user not found.");
        return;
    }  
    const contactIndex = currentUser.contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex === -1) {
        console.error("Contact not found.");
        return;
    }  
    currentUser.contacts[contactIndex].name = updatedName;
    currentUser.contacts[contactIndex].email = updatedEmail;
    currentUser.contacts[contactIndex].phone = updatedPhone;  
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateCurrentUserInBackend(currentUser);  
    clearAddContactDesktopRightSideContainer();
    hideOverlay();
    contactsInit();
}


/**
 * Clear add contact desktop right side container
 */
function clearAddContactDesktopRightSideContainer() {
    let addContactDesktopRightSideContainer = document.getElementById("contactsContentRightSideContactDataContainerID");
    addContactDesktopRightSideContainer.innerHTML = "";
}