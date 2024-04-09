/**
 * Initializes the legal notice page by showing header user initials after a delay.
 */
function legalNoticeInit() {
    setTimeout(showHeaderUserInitials, 500);
}


/**
 * Redirects the user back to the summary page.
 */
function backToSummary() {
    window.location.assign("./summary.html");
}