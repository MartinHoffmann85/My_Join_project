/**
 * Attempts to log in the user.
 */
async function login() {
    try {
        const loggedInUser = await authenticateUser();
        if (loggedInUser && typeof loggedInUser === "object") {
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));            
            localStorage.setItem('isLoggedIn', 'true');            
            window.location.assign('./summary.html');
            setTimeout(showHeaderUserInitials, 200);
            checkIfUserAddedAsContact();
            resetActiveLinkId();            
        }
    } catch (error) {
        console.error('Error during login:', error);
    }    
}


/**
 * Attempts to authenticate the user.
 * @returns {Promise<Object|string>} - The authenticated user object if successful, otherwise a string.
 */
async function authenticateUser() {
    const { email, password } = getLoginInputs();
    if (!isValidUsersObject(users)) return;
    const user = findUserByEmail(email);
    return validateUserCredentials(user, password);
}


/**
 * Retrieves the login input values.
 * @returns {Object} The email and password from the login inputs.
 */
function getLoginInputs() {
    const email = document.getElementById("login-user-e-mail-id").value;
    const password = document.getElementById("login-user-password-id").value;
    return { email, password };
}


/**
 * Checks if the users object is valid.
 * @param {Object} users - The users object.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidUsersObject(users) {
    if (!users || typeof users !== 'object') {
        console.error('users is not a valid object:', users);
        return false;
    }
    return true;
}


/**
 * Finds a user by email.
 * @param {string} email - The email to search for.
 * @returns {Object|undefined} The user object if found, otherwise undefined.
 */
function findUserByEmail(email) {
    return Object.values(users).flat().find(user => user.userEMail === email);
}


/**
 * Validates user credentials.
 * @param {Object} user - The user object.
 * @param {string} password - The entered password.
 * @returns {Object|string} The user object if credentials match, otherwise error message.
 */
function validateUserCredentials(user, password) {
    if (user && user.userPassword === password) return user;
    showLoginError("User not found or wrong password");
    return "User not found or wrong password";
}


/**
 * Shows login error message.
 * @param {string} message - The error message to display.
 */
function showLoginError(message) {
    const errorContainer = document.getElementById('login-email-error');
    errorContainer.innerText = message;
    errorContainer.style.color = "red";
    setTimeout(() => {
        errorContainer.innerText = "";
        resetLoginInputs();
    }, 2000);
}


/**
 * Handles field validation for the login form.
 * @param {boolean[]} boolArr - An array representing validation error flags.
 */
function handlerFieldValidationLogin(boolArr) {
    toggleVisibility('empty-email-id', boolArr[0]);
    toggleVisibility('this-is-no-email-id', boolArr[1]);
    toggleVisibility('invalid-email-id', boolArr[2]);
    toggleVisibility('invalid-password-id', boolArr[3]);
    toggleVisibility('empty-password-id', boolArr[4]);
    toggleVisibility('login-email-border-id', !boolArr[5],'error-border');
    toggleVisibility('login-pw-border-id', !boolArr[6],'error-border');
}


/**
 * Toggles the visibility of an element.
 * @param {string} elementId - The ID of the element to toggle.
 * @param {boolean} show - Indicates whether to show or hide the element.
 * @param {string} className - The class name used to control visibility.
 */
function toggleVisibility(elementId, show = true, className = 'd-none') {
    const element = document.getElementById(elementId);
    show ? element.classList.remove(className) : element.classList.add(className);
}


/**
 * Toggles the checkbox state based on the event target ID.
 * @param {Event} event - The event object.
 */
function toggleCheckbox(event) {
    const { loginCheckbox, ppCheckbox } = toggleCheckboxVariables();
    if (event.target.id === 'uncheckbox-id') {
        rmCheckboxConfirmed = !rmCheckboxConfirmed;
        loginCheckbox.src = rmCheckboxConfirmed
            ? './assets/img/checkbox_confirmed.svg'
            : './assets/img/checkbox.svg';
        ppCheckboxConfirmed = false;
    } else if (event.target.id === 'privacy-checkbox-id') {
        ppCheckbox.src = ppCheckboxConfirmed
            ? './assets/img/checkbox_confirmed.svg'
            : './assets/img/checkbox.svg'; 
    }
}


/**
 * Retrieves checkbox elements and toggles their states.
 * @returns {object} An object containing references to the login and privacy policy checkboxes.
 */
function toggleCheckboxVariables() {
    const loginCheckbox = document.getElementById("uncheckbox-id");
    const ppCheckbox = document.getElementById("privacy-checkbox-id");
    ppCheckboxConfirmed = !ppCheckboxConfirmed;
    return { loginCheckbox, ppCheckbox };
}


/**
 * Adds an event listener to a password input element to toggle password visibility.
 * @param {string} elementId - The ID of the password input element.
 * @param {string} lockImgId - The ID of the lock image element.
 * @param {string} visibilityOffImg - The ID of the visibility off image element.
 * @param {string} visibilityOnImg - The ID of the visibility on image element.
 * @param {object} visibilityObj - An object representing password visibility state.
 */
function addPasswordVisibilityListener(elementId, lockImgId, visibilityOffImg, visibilityOnImg, visibilityObj) {
    const inputElement = document.getElementById(elementId);
    inputElement.addEventListener("input", function(event) {
        const passwordNotEmpty = isValueNotEmpty(event.target.value);
        toggleVisibility(lockImgId, !passwordNotEmpty);
        toggleVisibility(visibilityOffImg, passwordNotEmpty && !visibilityObj.pwVisibilityOn);
        toggleVisibility(visibilityOnImg, passwordNotEmpty && visibilityObj.pwVisibilityOn);
        if (!passwordNotEmpty) 
            visibilityObj.pwVisibilityOn = false;
    });
}


/**
 * Checks if the provided input value is not empty.
 * @param {string} passwordInput - The input value to check.
 * @returns {boolean} Indicates whether the input value is not empty.
 */
function isValueNotEmpty(passwordInput) {
    return passwordInput.trim().length !== 0;
}


/**
 * Displays an image by setting its source attribute.
 * @param {HTMLElement} lockImage - The lock image element.
 * @param {string} src - The source URL of the image.
 */
function showImage(lockImage, src) {
    lockImage.src = src;
}


/**
 * Toggles password visibility based on the input type and form.
 * @param {Event} event - The event object.
 * @param {string} ImgId - The ID of the image element.
 * @param {string} whichform - The type of form ('password' or 'confirmPw').
 * @param {number} value - The value indicating visibility state (-1 for hidden, 1 for visible).
 */
function togglePasswordVisibility(event, ImgId, whichform, value) {
    let visibilityOn, inputType;
    if ((whichform === 'password' || whichform === 'registerPw') && value === 1) 
        visibilityOn = true;
    else if ((whichform === 'password' || whichform === 'registerPw') && value === -1) 
        visibilityOn = false;
    else if (whichform === 'confirmPw' && value === 1) 
        visibilityOn = true;
    else if (whichform === 'confirmPw' && value === -1) 
        visibilityOn = false;
    toggleVisibility(event.target.id, false);
    toggleVisibility(ImgId, true);
    inputType = visibilityOn ? 'text' : 'password';
    updatePasswordInput(whichform, inputType);
}


/**
 * Updates the input type of the password input element.
 * @param {string} whichform - The type of form ('password' or 'confirmPw').
 * @param {string} inputType - The type of input ('text' or 'password').
 */
function updatePasswordInput(whichform, inputType) {
    const passwordInput = getPasswordInput(whichform);
    passwordInput.type = inputType;
}


/**
 * Retrieves the password input element based on the specified form.
 * @param {string} whichform - The type of form ('password', 'registerPw', or 'confirmPw').
 * @returns {HTMLElement} The password input element.
 */
function getPasswordInput(whichform) {
    const formMap = {
        'password': 'login-user-password-id',
        'registerPw': 'add-pw-id',
        'confirmPw': 'add-confirm-pw-id'
    };
    const elementId = formMap[whichform];
    return document.getElementById(elementId);
}


/**
 * Logs in a guest user with predefined guest credentials.
 */
function guestLogin() {    
    const guestEmail = "guest@user.de";
    const guestPassword = "!1GuestUser";
    document.getElementById("login-user-e-mail-id").value = guestEmail;
    document.getElementById("login-user-password-id").value = guestPassword;
    loggedInLocalStorage = localStorage.setItem('isLoggedIn', 'true');
    login();
    setTimeout(showHeaderUserInitials, 200);
    setTimeout(showMenuIfLoggedIn, 300);
}


/**
 * Logs out the current user by updating the local storage items.
 * Sets the 'isLoggedIn' item to 'false' and removes the 'currentUser' item.
 */
function userLogOut() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');    
}