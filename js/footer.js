/**
 * Initializes the footer module by setting the default color for the active link.
 */
function footerInit() {
    setInitialActiveLinkColor();    
    showMenuIfLoggedIn();    
}


/**
 * Displays or hides the menu and profile section based on the user's login status.
 * This function checks if the user is logged in by retrieving the login status from local storage
 * and adjusts the visibility of the profile and menu elements accordingly.
 * 
 * @returns {Promise<void>} This function is asynchronous and returns a promise that resolves to void.
 */
async function showMenuIfLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');    
    const hideFooterLinkMenu = document.querySelector('.menu-content');
    const hideFooterLinkMenu2 = document.querySelector('.menu-box');
    const headerProfil = document.querySelector('.header-profil');
    if (hideFooterLinkMenu && hideFooterLinkMenu2 && headerProfil) {
        if (isLoggedIn === 'true') {
            headerProfil.style.display = "flex";
            hideFooterLinkMenu.style.display = "flex";
            hideFooterLinkMenu2.style.display = "flex";            
        } else {
            headerProfil.style.display = "none";
            hideFooterLinkMenu.style.display = "none";
            hideFooterLinkMenu2.style.display = "none";            
        }
    }
}


/**
 * Sets the color of the initially active link in the footer.
 */
function setInitialActiveLinkColor() {
    const { activeLinkId, link1, link2, link3, link4 } = setInitialActiveLinkColorVariables();
    if (!link1 || !link2 || !link3 || !link4) {        
        return;
    }    
    if (activeLinkId === 'footer-icon-boxId1') {
        link1.classList.add('footer-icon-box-hover');
    } else if (activeLinkId === 'footer-icon-boxId2') {
        link2.classList.add('footer-icon-box-hover');
    } else if (activeLinkId === 'footer-icon-boxId3') {
        link3.classList.add('footer-icon-box-hover');
    } else if (activeLinkId === 'footer-icon-boxId4') {
        link4.classList.add('footer-icon-box-hover');
    }
}


/**
 * Initializes the active link color variables by retrieving the active link ID from local storage
 * and removing the hover effect from all footer link elements. It then returns an object containing
 * the active link ID and references to the footer link elements. 
 * @returns {Object} An object containing the active link ID and references to the footer link elements.
 * @property {string | null} activeLinkId - The ID of the currently active link, or null if not set.
 * @property {HTMLElement} link1 - The DOM element for the first footer link.
 * @property {HTMLElement} link2 - The DOM element for the second footer link.
 * @property {HTMLElement} link3 - The DOM element for the third footer link.
 * @property {HTMLElement} link4 - The DOM element for the fourth footer link.
 */
function setInitialActiveLinkColorVariables() {
    const activeLinkId = localStorage.getItem('activeLinkId');
    const link1 = document.getElementById('footer-icon-boxId1');
    const link2 = document.getElementById('footer-icon-boxId2');
    const link3 = document.getElementById('footer-icon-boxId3');
    const link4 = document.getElementById('footer-icon-boxId4');
    if (link1) link1.classList.remove('footer-icon-box-hover');
    if (link2) link2.classList.remove('footer-icon-box-hover');
    if (link3) link3.classList.remove('footer-icon-box-hover');
    if (link4) link4.classList.remove('footer-icon-box-hover');
    return { activeLinkId, link1, link2, link3, link4 };
}


/**
 * Handles click event on a link by storing its ID in local storage.
 * @param {string} linkId - The ID of the clicked link.
 */
function handleLinkClick(linkId) {
    localStorage.setItem('activeLinkId', linkId);
}


/**
 * Resets the active link ID in local storage.
 */
function resetActiveLinkId() {
    const linkId = "";
    localStorage.setItem('activeLinkId', linkId);
}


/**
 * Sets the active link ID in local storage to the first link.
 */
function setActiveLinkId() {
    const linkId = "footer-icon-boxId1";
    localStorage.setItem('activeLinkId', linkId);
}