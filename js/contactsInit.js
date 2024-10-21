/**
 * Initializes the contacts page only if the current page is the contacts page.
 * Adds a 'resize' event listener to trigger contactsInit on window resize.
 * Calls contactsInit immediately after the page is loaded.
 */
function initializeContactsPage() {
    const isContactsPage = window.location.href === 'https://martin-hoffmann.developerakademie.net/join%20eigene%20version%203/contacts.html' || 
                           window.location.href === 'http://127.0.0.1:5500/contacts.html';    
    if (isContactsPage) {
        window.addEventListener('resize', contactsInit);
        window.onload = contactsInit;
    }
}


initializeContactsPage();


/**
* Initialize the contacts page based on the window width.
* Renders contacts differently for mobile and desktop views.
*/
function contactsInit() {
    const maxWidth = 949;
    if (window.innerWidth <= maxWidth) {
        setTimeout(showHeaderAndFooter, 1000);
        renderContacts();
        renderAddContactButtonMobile();
        setTimeout(showHeaderUserInitials, 500);
        contactsInitVariables();
        setMaxHeightReduced();
        hideOverlay();
    } else {
        setTimeout(showHeaderAndFooter, 1000);
        renderContactsDesktop();
        document.body.style.overflow = 'hidden';
        setTimeout(showHeaderUserInitials, 500);
    }
}


/**
* Initializes variables and styling for the contacts page on mobile view.
*/
function contactsInitVariables() {
    document.body.style.overflow = 'hidden';
    const content = document.getElementById("all-contacts-id");
    content.style.marginTop = '80px';
    content.style.paddingBottom = '60px';
    content.style.overflow = 'auto';
}


/**
 * Waits for a DOM element to be available and executes a callback when found.
 * If the element is already present in the DOM, the callback is executed immediately.
 * If the element is not found, it uses a MutationObserver to watch for changes in the DOM 
 * and triggers the callback once the element appears.
 * @param {string} selector - The CSS selector of the element to wait for.
 * @param {Function} callback - The function to execute once the element is found. The element is passed as an argument to the callback.
 */
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          callback(element);
          obs.disconnect();
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }
}


/**
* Hide header and footer for edit contact and create contact screen on mobile view
*/
function hideHeaderAndFooter() {
    const mobileHeader = document.querySelector(".header"); 
    const menuTemplate = document.querySelector(".footer");
    mobileHeader.style.display = "none";
    menuTemplate.style.display = "none";
}


/**
* Show header and footer screen on mobile view
*/
function showHeaderAndFooter() {
    waitForElement(".header", (mobileHeader) => {
      mobileHeader.style.display = "block";
    });  
    waitForElement(".footer", (menuTemplate) => {
      menuTemplate.style.display = "flex";
    });
}