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
          <img class="contactsContentRightSideBlueStribeSvg" src="./assets/img/contacts/contactsContentRightSideBlueStripe.svg" alt="">        
          <p class="contactsContentRightSideHeadLinePElement">Better with a team</p>
      </div>  
      <div id="contactsContentRightSideContactDataContainerID">
        <div class="contactsContentRightSideUserImgAndNameContainer">
          ${singleMemberToHTMLOpenContactDesktop(selectedContact, 0)}
        <div>
            <h2 class="contactsContentRightSideUserNameH2">${selectedContact.name}</h2>
              <div class="contactsContentRightSideEditAndDeleteButtonContainer">
                <img class="contactsContentRightSideEditButton" src="./assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="editContactDestop(lastClickedContactId)">
                <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteContactDesktop(lastClickedContactId)">
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
  * Generate HTML for add contact show overlay desktop
  * @param {string} overlayContent - Overlay div container
  */
function generateHTMLAddContactShowOverlayDesktop(overlayContent) {
    overlayContent.innerHTML = /*html*/ `
      <div class="overlay-card">
        <div class="addContactDesktopLeftSideContainer">
          <div class="flexDirectionColumn">
            <img class="joinLogoGreyBackgroundImg" src="./assets/img/contacts/joinLogoGreyBackground.png" alt="">
            <h1 class="addContactDesktopLeftSideContainerH1">Add contact</h1>
            <p class="addContactDesktopLeftSideContainerPElement">Tasks are better with a team!</p>
            <img class="addContactBlueStroked" src="./assets/img/contacts/addContactBlueStroked.svg" alt="">
          </div>
        </div>
        <div class="addContactDesktopRightSideContent">
            <div class="addContactCloseXContainerDesktop">
              <button class="addContactCloseXButton" onclick="hideOverlay()">X</button>
            </div>
            <div id="edit-contact-destop-id">
              <div class="addContactContainerFooter">              
              <div class="addContactContainerFooter">
              <input class="addContactInputNameDesktop" type="text" name="addContactInputNameDesktop" id="add-contact-input-name-desktop-id" required pattern="[A-Za-z'\\- ]+" placeholder="Name" data-contacts>
                <input class="addContactInputMailAddresssDesktop" type="email" name="addContactInputMailAddresssDesktop" id="add-contact-input-mail-addresss-desktop-id" required placeholder="E Mail" data-contacts>
                <input class="addContactInputPhoneDesktop" type="tel" name="addContactInputPhoneDesktop" id="add-contact-input-phone-desktop-id" required pattern="[0-9]{1,}" placeholder="Phone" data-contacts>
                <div class="addContactButtonContainerDesktop">
                  <button class="cancelContactDesktopDeleteButton" onclick="hideOverlay()">Cancel</button>
                  <button class="createContactButton" onclick="createContactDesktop()">Create contact</button>
                  </div>
                </div>                
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
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
* Generates the HTML for the add contact form in mobile view.
* @returns {string} The HTML content for the add contact form.
*/
function addContactFormMobileHTML() {
    return /*html*/ `
      <div class="addContactContainerHeaderMobile">
        <div class="addContactCloseXContainerMobile">
          <button class="addContactCloseXButtonMobile" onclick="redirectToContacts()">X</button>
        </div>
        <div class="addContactBlockHeaderMobile">
          <p class="addContactH1Mobile">Add contact</p>
          <p class="addContactTextMobile">Tasks are better with a team!</p>
          <img class="addContactBlueStrokedMobile" src="./assets/img/contacts/addContactBlueStroked.svg" alt="addContactBlueStroked">
        </div>
        <div>
          <img class="addContactBlankUserImgMobile" src="./assets/img/contacts/addContactBlankUserImg.svg" alt="addContactBlankUserImg">
        </div>
      </div>
        <div class="addContactContainerFooterMobile">
          <input class="addContactInputNameMobile" name="addContactInputNameMobile" id="add-contact-input-name-mobile-id" required pattern="[A-Za-z'\\- ]+" type="text" placeholder="Name">
          <input class="addContactInputMailAddresssMobile" name="addContactInputMailAddresssMobile" id="add-contact-input-mail-addresss-mobile-id" type="text" placeholder="E Mail">
          <input class="addContactInputPhoneMobile" name="addContactInputPhoneMobile" id="add-contact-input-phone-mobile-id" type="tel" required pattern="[0-9]{1,}" placeholder="Phone">          
          <button class="createContactButtonImg" onclick="createContactMobile()">
          <img src="./assets/img/contacts/createContactButton.svg" alt="createContactButton">
          </button>
        </div>
    `;
}


/**
 * Creates a container for a group of contacts starting with the same letter.
 * @param {string} firstLetter - The first letter of the contacts in the group.
 * @returns {HTMLElement} The created container element.
 */
function createLetterAndContactsContainer(firstLetter) {
    const container = document.createElement('div');
    container.classList.add('letterAndContactsContainer');
    container.innerHTML = `
      <div class="letter-column">
        <h2 class="contact-first-letter">${firstLetter}</h2>
        <div class="contacts-list"></div>
      </div>
    `;
    return container;
}


/**
* Fills the content of a single contact container with HTML content.
* @param {HTMLElement} container - The container element for the contact.
* @param {string} iconHtml - The HTML content for the contact's icon.
* @param {Object} oneContact - The contact object.
*/
function createOneContactContainerHTML(container, iconHtml, oneContact) {
    container.innerHTML = `
      <div class="contact-info-container">
        <div>
          ${iconHtml}
        </div>
        <div>
          <h2 class="oneContactContainerH2Mobile">${oneContact.name}</h2>
          <a class="oneContactContainerAElement">${oneContact.email}</a>
        </div>
      </div>
    `;
}


/**
* Renders the icon for a single member in mobile view.
* @param {Object} oneContact - The contact object.
* @param {string} colorCode - The color code for the icon background.
* @param {string} textColor - The color code for the text.
* @returns {string} The HTML for the icon.
*/
function renderSingleMemberToHTMLMobile(oneContact, colorCode, textColor) {
    return `
      <div class="openContactUserImgMobile" style="background-color: ${colorCode}; color: ${textColor};">
        ${getFirstLettersOfName(oneContact.name)}
      </div>
    `;
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