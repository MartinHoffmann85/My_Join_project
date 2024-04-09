/**
 * Includes HTML content in elements with the attribute 'w3-include-html'.
 * Fetches the HTML file specified in the attribute and inserts its content into the element.
 */
async function includeHTML() {
    let include = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < include.length; i++) {
        const element = include[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            include[i].innerHTML = await resp.text();
        } else {
            include[i].innerHTML = 'Page not found';
        }
    }
}