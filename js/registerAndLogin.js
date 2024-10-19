const STORAGE_URL = "https://myjoinproject3-507f7-default-rtdb.europe-west1.firebasedatabase.app";
let rmCheckboxConfirmed = false;
let ppCheckboxConfirmed = false;
let users = {};
let newUserArray = [];
let emptyInput = true;
let pwVisibility = { pwVisibilityOn: false };
let confirmPwVisibility = { pwVisibilityOn: false };


/**
 * Initializes the application by loading users from the backend and setting up password visibility listener.
 */
async function init() {
    users = await loadUsersFromBackend('users');
    console.log(users);
    userLogOut();
    addPasswordVisibilityListener('login-pw-border-id', 
                                'lock-id', 
                                'login-pw-visibility-off-id',
                                'login-pw-visibility-id',
                                pwVisibility);
}


/**
 * If site refreshed than User logout.
 */
window.addEventListener('pageshow', function(event) {    
    if (event.persisted) {        
        userLogOut();
    }
});


/**
 * Loads users data from the backend. 
 * @returns {Promise<Array>} - An array of user objects.
 */
async function loadUsersFromBackend() {
    try {
        let response = await fetch(STORAGE_URL + "/users.json");
        let responseToJson = await response.json();        
        return responseToJson;        
    } catch (e) {
        console.error('loading error:', e);
        return [];
    }
}


/**
 * Resets the login inputs and validation states.
 */
function resetLoginInputs() {
    const boolArr = [false, false, false, false, false, false, false];
    handlerFieldValidationLogin(boolArr);
    document.getElementById("login-user-e-mail-id").value = "";
    document.getElementById("login-user-password-id").value = "";
    const pwInput = document.getElementById('lock-id');
    showImage(pwInput, './assets/img/lock.png');
}


/**
 * Handles errors by logging them to the console.
 * @param {Error} error - The error object to be handled.
 */
function handleError(error) {
    console.error("Error sending user data to the backend:", error);
}


/**
 * Sends a POST request to save an item to local storage.
 *
 * @async
 * @param {string} key - The key for the item to be stored in local storage.
 * @param {any} value - The value to be stored, which can be of any type.
 * @returns {Promise<Object>} The response from the server, parsed as JSON.
 * @throws {Error} Throws an error if the HTTP response is not OK.
 */
async function setItem(key, value) {
    const response = await fetch(`${STORAGE_URL}/${key}.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}


/**
 * Retrieves a value associated with the specified key from a remote server.
 * The function constructs a URL using the key and a storage token to fetch the data. 
 * @returns {Promise<any>} A promise that resolves to the value associated with the key.
 *                         If the key does not exist, it may return undefined or null.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => res.data.value);
}


/**
 * Updates the user data in the backend using the PUT method.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} userData - The data to update.
 */
async function putUser(userId, userData) {
    try {
        const response = await fetch(`${STORAGE_URL}/users/${userId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }        
    } catch (error) {        
    }
}


/**
 * Check if the logged-in user is added as a contact. If not, create a new contact.
 */
async function checkIfUserAddedAsContact() {
    const currentUser = getLoggedInUser();
    ensureContactsArray(currentUser);
    if (!isUserAddedAsContact(currentUser)) addLoggedInUserAsContact(currentUser);
}


/**
 * Checks if the logged-in user is already added as a contact.
 * @param {Object} user - The current user object.
 * @returns {boolean} True if the user is added, otherwise false.
 */
function isUserAddedAsContact(user) {
    return user.contacts.some(contact => 
        contact.name === `${user.userName} (you)` && contact.email === user.userEMail
    );
}


/**
 * Adds the logged-in user as a contact.
 * @param {Object} user - The current user object.
 */
function addLoggedInUserAsContact(user) {
    const newContact = { name: `${user.userName} (you)`, email: user.userEMail, phone: '0', id: generateUniqueID() };
    addContactToCurrentUser(newContact);
}


/**
 * Ensures the contacts array exists for the user.
 * @param {Object} user - The current user object.
 */
function ensureContactsArray(user) {
    if (!Array.isArray(user.contacts)) user.contacts = [];
}


/**
 * Displays the initials of the current user in the header profile section.
 */
function showHeaderUserInitials() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.userName) {
        const userName = currentUser.userName;
        const [firstName, lastName] = userName.split(' ');
        const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
        const headerProfil = document.querySelector(".header-profil");
        if (headerProfil) {
            headerProfil.textContent = initials;
        }
    }
}