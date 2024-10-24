/**
 * Registers a new user if validation checks pass, the privacy policy checkbox is confirmed, and the user does not already exist.
 */
async function register() {
    if (!(registerValidationCheck() && ppCheckboxConfirmed)) {
        return;
    }
    const newUser = generateNewUserObject();
    const emailExistsInBackend = await checkEmailExistsInBackend(newUser.userEMail);
    if (emailExistsInBackend) {
        document.getElementById('existing-user-msg').innerText = "User with this email already exists in backend.";
        document.getElementById('existing-user-msg').classList.remove('d-none');
        return;
    }
    await registerFinsh(newUser);
}


/**
 * Checks if a given email exists in the backend user database.
 *
 * @async
 * @param {string} email - The email address to check for existence.
 * @returns {Promise<boolean>} - Returns true if the email exists, otherwise false.
 */
async function checkEmailExistsInBackend(email) {
    try {
        const users = await fetchUsersFromBackend();
        const userArray = extractEmailsFromUsers(users);
        return userArray.includes(email);
    } catch (error) {
        console.error('Error checking email in backend:', error);
        return false;
    }
}


/**
 * Fetches the list of users from the backend storage.
 *
 * @async
 * @returns {Promise<Object>} - Returns a promise that resolves to the user data from the backend.
 */
async function fetchUsersFromBackend() {
    const response = await fetch(STORAGE_URL + "/users.json");
    const users = await response.json();
    return users;
}


/**
 * Extracts email addresses from the provided users object.
 *
 * @param {Object} users - The users object fetched from the backend.
 * @returns {string[]} - An array of email addresses extracted from the users.
 */
function extractEmailsFromUsers(users) {
    const userArray = [];
    for (const key in users) {
        const user = users[key];
        if (isUserObject(user)) {
            userArray.push(user.userEMail);
        } else if (Array.isArray(user)) {
            extractEmailsFromArray(user, userArray);
        }
    }
    return userArray;
}


/**
 * Checks if the given input is a user object.
 *
 * @param {any} user - The input to check.
 * @returns {boolean} - Returns true if the input is a user object, otherwise false.
 */
function isUserObject(user) {
    return typeof user === 'object' && !Array.isArray(user);
}


/**
 * Extracts email addresses from an array of user objects and adds them to a given list.
 *
 * @param {Object[]} userArray - An array of user objects.
 * @param {string[]} emailList - The list to which extracted email addresses will be added.
 */
function extractEmailsFromArray(userArray, emailList) {
    userArray.forEach(u => {
        if (u.userEMail) {
            emailList.push(u.userEMail);
        }
    });
}


/**
 * Completes the registration process by adding a new user, showing a success message,
 * closing the sign-up form, and redirecting to the index page.
 * 
 * @async
 * @param {Object} newUser - The new user object to be registered.
 * @returns {Promise<void>} - Resolves when the registration process is finished.
 */
async function registerFinsh(newUser) {
    addDefaultContactsAndTasksToUser(newUser)
    await addNewUser(newUser);
    toggleSuccessesMsg();
    closeSignUp();    
    init();
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