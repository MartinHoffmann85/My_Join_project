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