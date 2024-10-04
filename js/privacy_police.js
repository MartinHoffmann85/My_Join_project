/**
 * Adds an event listener that triggers when the DOM content is fully loaded. 
 * Once the DOM is ready, the function `privacyPolicyInit` is called to initialize 
 * any necessary setup related to the privacy policy section of the page.
 * This ensures that `privacyPolicyInit` is executed only after the HTML content has been completely loaded and parsed.
 */
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