document.addEventListener("DOMContentLoaded", function () {
    privacyPolicyInit();
});


/**
 * Initializes the privacy policy page by showing header user initials after a delay.
 */
function privacyPolicyInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(showMenuIfLoggedIn, 600);
}


/**
 * Redirects the user based on the isLoggedIn status in localStorage.
 */
function privacyPolicyRedirectBasedOnLoginStatus() {    
    if (localStorage.getItem("isLoggedIn") === "true") {        
        window.location.assign("./summary.html");
    } else {        
        window.location.assign("./index.html");
    }
}