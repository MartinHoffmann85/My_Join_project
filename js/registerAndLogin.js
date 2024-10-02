/* const STORAGE_TOKEN = "1YZW4TY9W0XF6M4IBJ1F19MV8LK8PIHTCGVU4471"; */
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
        console.log(`responseToJson` , responseToJson);
        return responseToJson;        
    } catch (e) {
        console.error('loading error:', e);
        return [];
    }
}


/**
 * Registers a new user if validation checks pass, the privacy policy checkbox is confirmed, and the user does not already exist.
 */
async function register() {
    if (!(registerValidationCheck() && ppCheckboxConfirmed)) {
        return;
    }
    const newUser = generateNewUserObject();    
    const userArray = Object.values(users);    
    const userExists = userArray.some(user => user.userEMail === newUser.userEMail);    
    if (userExists) {
        document.getElementById('existing-user-msg').innerText = "User with this email already exists.";
        document.getElementById('existing-user-msg').classList.remove('d-none');
        return;
    }
    addNewUser(newUser);
    toggleSuccessesMsg();
    closeSignUp();
}


/**
 * Adds a new user to the application.
 * @param {Object} newUser - The new user object to be added.
 */
async function addNewUser(newUser) {
    newUserArray.push(newUser);
    try {
        await addNewUserToBackend(newUser);
    } catch (error) {
        handleError(error);
    }
}


/**
 * Generates a new user object from input field values.
 * @returns {Object} - The newly created user object.
 */
function generateNewUserObject() {
    const userName = document.getElementById("add-name-id").value;
    const userEMail = document.getElementById("add-email-id").value;
    const userPassword = document.getElementById("add-pw-id").value;
    const userPasswordConfirm = document.getElementById("add-confirm-pw-id").value;
    return generateNewUserObjectConstructor(userName, userEMail, userPassword, userPasswordConfirm);
}


/**
 * Generates a new user object constructor.
 * @param {string} userName - The user's name.
 * @param {string} userEMail - The user's email.
 * @param {string} userPassword - The user's password.
 * @param {string} userPasswordConfirm - The user's password confirmation.
 * @returns {Object} - The newly created user object.
 */
function generateNewUserObjectConstructor(userName, userEMail, userPassword, userPasswordConfirm) {
    return {
        'userName': userName,
        'userEMail': userEMail,
        'userPassword': userPassword,
        'userPasswordConfirm': userPasswordConfirm,
        'contacts': [],
        'tasks': {
            'titles': [],
            'descriptions': [],
            'assignedTo': [],
            'prios': [],
            'categories': [],
            'subtasks': [],
            'dates': []
        }
    };
}


/**
 * Adds a new user to the backend.
 * @param {Object} user - The user object to be added to the backend.
 */
async function addNewUserToBackend(user) {
    try {
        let existingUsers = await loadUsersFromBackend('users');
        if (!Array.isArray(existingUsers)) {
            existingUsers = [];
        }
        existingUsers.push(user);
        await setItem('users', existingUsers);
    } catch (error) {
        console.error('Error adding new user to backend:', error);
    }
}


/**
 * Validates the user's name.
 * @param {string} name - The user's name to be validated.
 * @param {boolean[]} boolArr - An array of boolean values representing validation checks.
 */
function validateName(name, boolArr) {
    const specialCharRegex  = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/0123456789]/;
    const checkForDoubleHyphen = name.split("-").length - 1;
    if (name.trim() === "") 
        boolArr[0] = boolArr[10] = true;
    else if (specialCharRegex.test(name)) 
        boolArr[2] = boolArr[10] = true;
    else if (name.length < 2 && checkForDoubleHyphen === 0) 
        boolArr[1] = boolArr[10] = true;
    else if (checkForDoubleHyphen !== 0 && (!name.match(/[a-zA-Z]-[a-zA-Z]{2,}/) || name.indexOf('-') < 2 || name.split('-').pop() === '')) 
        boolArr[1] = boolArr[10] = true;
}


/**
 * Validates the user's email during registration.
 * @param {string} email - The user's email to be validated.
 * @param {boolean[]} boolArr - An array of boolean values representing validation checks.
 */
function validateRegisterEmail(email, boolArr) {
    if (email.trim() === "") 
        boolArr[3] = boolArr[11] = true;
    else if (!email.includes('@') || email.indexOf('@') === 0 || email.split('@').pop() === '') 
        boolArr[4] = boolArr[11] = true;
    else if (email in users) 
        boolArr[5] = boolArr[11] = true;
}


/**
 * Validates the user's password during registration.
 * @param {string} password - The user's password to be validated.
 * @param {boolean[]} boolArr - An array of boolean values representing validation checks.
 */
function validatePassword(password, boolArr) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/]/.test(password);
    const hasDigit = /[0123456789]/.test(password);
    if (password.trim() === "") 
        boolArr[6] = boolArr[12] = true;
    else if (!hasUpperCase || !hasSpecialChar || !hasDigit || password.length < 6 )  
        boolArr[7] = boolArr[12] = true;
}


/**
 * Validates the user's confirm password during registration.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The user's confirmation password.
 * @param {boolean[]} boolArr - An array of boolean values representing validation checks.
 */
function validateConfirmPassword(password, confirmPassword, boolArr) {
    if (confirmPassword.trim() === "") 
        boolArr[8] = boolArr[13] = true;
    else if (password !== confirmPassword  )  
        boolArr[9] = boolArr[13] = true;
}


/**
 * Toggles the visibility of a checkbox based on its state.
 */
function validateCheckBoxClicked() {
    toggleVisibility('pp-id', ppCheckboxConfirmed, 'err-msg-color');
}


/**
 * Handles field validation during registration.
 * @param {boolean[]} boolArr - An array of boolean values representing validation checks.
 * @returns {boolean} - Indicates whether all fields are validated.
 */
function handlerFieldValidationRegister(boolArr) {
    toggleVisibility('empty-add-name-id', boolArr[0]);
    toggleVisibility('invalid-add-name-id', boolArr[1]);
    toggleVisibility('no-special-chars-id', boolArr[2]);
    toggleVisibility('empty-add-email-id', boolArr[3]);
    toggleVisibility('invalid-add-email-id', boolArr[4]);
    toggleVisibility('existing-add-email-id', boolArr[5]);
    toggleVisibility('empty-add-pw-id', boolArr[6]);
    toggleVisibility('invalid-add-pw-id', boolArr[7]);
    toggleVisibility('empty-confirm-pw-id', boolArr[8]);
    toggleVisibility('invalid-confirm-pw-id', boolArr[9]);
    toggleVisibility('add-name-border-id', !boolArr[10],'error-border')
    toggleVisibility('add-email-border-id', !boolArr[11],'error-border')
    toggleVisibility('add-pw-border-id', !boolArr[12],'error-border')
    toggleVisibility('add-confirm-pw-border-id', !boolArr[13],'error-border')
    return !boolArr.some(Boolean);
}


/**
 * Checks the validity of the registration form fields.
 * @returns {boolean} - Indicates whether the registration form is valid.
 */
function registerValidationCheck() {
    const name = document.getElementById("add-name-id").value;
    const email = document.getElementById("add-email-id").value;
    const password = document.getElementById("add-pw-id").value;
    const confirmPassword = document.getElementById("add-confirm-pw-id").value;
    const checkBox = document.getElementById('privacy-check-id');
    const boolArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    validateName(name, boolArr);
    validateRegisterEmail(email, boolArr);
    validatePassword(password, boolArr);
    validateConfirmPassword(password, confirmPassword, boolArr);
    validateCheckBoxClicked(checkBox);
    return handlerFieldValidationRegister(boolArr);
}


/**
 * Toggles the visibility of the success message.
 */
function toggleSuccessesMsg() {
    const successMsg =  document.getElementById('success-msg-id');
    successMsg.classList.toggle('d-none')
    window.setTimeout(() => {
        successMsg.classList.toggle('d-none');
    }, 800);
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
 * Push request to backend.
 * Either it is fulfilled successfully (resolved) or it fails (rejected).
 * @param {lokal storage key} key
 * @param {string} value
 * @returns Promise: resolved or rejected.
 */
async function setItem(key, value) {
    try {        
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
        const data = await response.json();
        console.log(`${key} added successfully:`, data);
    } catch (error) {
        console.error(`Error adding ${key} to backend:`, error);
    }
}


/**
 * Get request to backend.
 * @param {lokal storage key} key
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => res.data.value);
}


/**
 * Displays the sign-up form and initializes password visibility options.
 */
function signUp() {
    pwVisibility.pwVisibilityOn = false;
    resetLoginInputs();
    toggleVisibility('sign-up-popup-id', true);
    toggleVisibility('signup-container-id', false);
    toggleVisibility('login-id', false);
    let signUpPopupElement = document.getElementById('sign-up-popup-id');
    signUpPopupElement.innerHTML += templateSignUpPopup();
    addPasswordVisibilityOption();
}


/**
 * Adds password visibility options for the sign-up form.
 */
function addPasswordVisibilityOption() {
    addPasswordVisibilityListener('add-pw-border-id',
        'register-lock-id',
        'register-pw-visibility-off-id',
        'register-pw-visibility-id',
        pwVisibility);
    addPasswordVisibilityListener('add-confirm-pw-border-id',
        'register-confirm-lock-id',
        'register-confirm-pw-visibility-off-id',
        'register-confirm-pw-visibility-id',
        confirmPwVisibility);
}


/**
 * Closes the sign-up form and resets related elements.
 */
function closeSignUp() {
    document.getElementById('login-user-password-id').type = 'password';
    pwVisibility.pwVisibilityOn = false;
    confirmPwVisibility.pwVisibilityOn = false;
    toggleVisibility('lock-id', true);
    toggleVisibility('login-pw-visibility-off-id', false);
    toggleVisibility('login-pw-visibility-id', false);
    toggleVisibility('sign-up-popup-id', false);
    toggleVisibility('signup-container-id', true);
    toggleVisibility('login-id', true);
    document.getElementById('sign-up-popup-id').innerHTML = "";
    ppCheckboxConfirmed = false;
}


/**
 * Check if the logged-in user is added as a contact. If not, create a new contact.
 */
async function checkIfUserAddedAsContact() {
    const currentUser = getLoggedInUser();    
    if (!Array.isArray(currentUser.contacts)) {
        currentUser.contacts = [];
    }    
    const isUserAdded = currentUser.contacts.some(contact => 
        contact.name === `${currentUser.userName} (you)` && 
        contact.email === currentUser.userEMail
    );
    if (!isUserAdded) {        
        const newContact = { 
            name: `${currentUser.userName} (you)`, 
            email: currentUser.userEMail, 
            phone: '0' 
        };
        newContact.id = generateUniqueID();
        addContactToCurrentUser(newContact);      
    }
}