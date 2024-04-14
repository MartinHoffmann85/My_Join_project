/**
 * Initializes the privacy policy page by showing header user initials after a delay.
 */
function privacyPolicyInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(checkIfLoggedIn, 200);
}


/**
 * Redirects the user back to the summary page.
 */
function backToSummary() {
    window.location.assign("./summary.html");
}