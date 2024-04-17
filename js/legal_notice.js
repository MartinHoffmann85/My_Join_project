/**
 * Initializes the legal notice page by showing header user initials after a delay.
 */
function legalNoticeInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(checkIfLoggedIn, 200);
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