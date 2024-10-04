/**
 * Adds an event listener that triggers when the DOM content is fully loaded. 
 * Once the DOM is ready, the function `legalNoticeInit` is called to initialize 
 * any necessary setup related to the legal notice section of the page. 
 * This ensures that `legalNoticeInit` is executed only after the HTML content has been completely loaded and parsed.
 */
document.addEventListener("DOMContentLoaded", function () {
    legalNoticeInit();
});


/**
 * Initializes the legal notice page by showing header user initials after a delay.
 */
function legalNoticeInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(showMenuIfLoggedIn, 600);
}


/**
 * Redirects the user based on the isLoggedIn status in localStorage.
 */
function legalNoticeRedirectBasedOnLoginStatus() {    
    if (localStorage.getItem("isLoggedIn") === "true") {        
        window.location.assign("./summary.html");
    } else {        
        window.location.assign("./index.html");
    }
}