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
        setTimeout(showHeaderAndFooter, 300);
        renderContacts();
        renderAddContactButtonMobile();
        setTimeout(showHeaderUserInitials, 500);
        contactsInitVariables();
        setMaxHeightReduced();
    } else {
        setTimeout(showHeaderAndFooter, 300);
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