/**
 * Initializes the help section by showing the header user initials after a delay.
 */
function helpInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(checkIfLoggedIn, 200);
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