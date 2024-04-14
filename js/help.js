/**
 * Initializes the help section by showing the header user initials after a delay.
 */
function helpInit() {
    setTimeout(showHeaderUserInitials, 500);
    setTimeout(checkIfLoggedIn, 200);
}


/**
 * Redirects the user to the summary page.
 */
function backToSummary() {
    window.location.assign("./summary.html");
}