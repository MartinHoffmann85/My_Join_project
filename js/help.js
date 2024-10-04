/**
 * Adds an event listener that triggers when the DOM content is fully loaded. 
 * Once the DOM is ready, the function `helpInit` is called to initialize any necessary setup.
 * This ensures that `helpInit` is executed only after the HTML content has been completely loaded and parsed.
 */
document.addEventListener("DOMContentLoaded", function () {
    helpInit();    
});


/**
 * Initializes the help section by showing the header user initials after a delay.
 */
function helpInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(showMenuIfLoggedIn, 600);
}


/**
 * Redirects the user based on the isLoggedIn status in localStorage.
 */
function helpRedirectBasedOnLoginStatus() {    
    if (localStorage.getItem("isLoggedIn") === "true") {        
        window.location.assign("./summary.html");
    } else {        
        window.location.assign("./index.html");
    }
}