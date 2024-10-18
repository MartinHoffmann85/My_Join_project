/**
 * Show clicked contact details for desktop view
 * @param {string} contactId - This is the contact ID example "5"
 */
function openContactScreenDesktop(contactId) {    
    const { content, selectedContact } = openContactScreenDesktopVariables(contactId);
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


/**
 * Retrieves necessary variables for opening the contact screen on desktop.
 * @param {string} contactId - The ID of the selected contact.
 * @returns {Object} An object containing the content element and the selected contact.
 */
function openContactScreenDesktopVariables(contactId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const content = document.getElementById("contactsContentRightSideID");
  const selectedContact = currentUser.contacts.find(contact => contact.id === contactId);
  return { content, selectedContact };
}


/**
 * Changes the background color of the selected contact container to black.
 * @param {string} contactId - The ID of the selected contact.
 */
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


/**
 * Changes the background color of the previously clicked contact container to white.
 * @param {string} contactId - The ID of the previously clicked contact.
 */
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
 * Show contacts content right side only for desktop view
 */
function showContactsContentRightSideDesktop() {
    const showcontactsContentRightSide = document.getElementById("contactsContentRightSideID");
    showcontactsContentRightSide.style.display = "flex";
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
 * Function to hide the overlay screen on desktop view
 */
function hideOverlay() {
    const overlayContainer = document.querySelector(".overlay-container");
    if (overlayContainer) {
      overlayContainer.parentNode.removeChild(overlayContainer);
    }
}