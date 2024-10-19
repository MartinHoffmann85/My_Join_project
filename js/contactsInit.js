/**
 * Initializes or removes the 'resize' event listener for the 'contactsInit' function 
 * based on the current page's URL path. 
 * - If the current page is '/modul_10_gruppe_2_backup_21_03_2024/contacts.html' or '/contacts.html',
 *   the 'contactsInit' function will be called on window resize.
 * - If the current page is not one of the specified paths, the 'resize' event listener will be removed. 
 * Additionally, the 'contactsInit' function is called when the page is fully loaded.
 */
if (window.location.pathname === '/modul_10_gruppe_2_backup_21_03_2024/contacts.html' || window.location.pathname === '/contacts.html') {
    window.addEventListener('resize', contactsInit);
  }
  window.onload = contactsInit;


  window.addEventListener('resize', function() {
    if (!document.querySelector('.overlay-container')) {
        contactsInit();
    }
});  


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