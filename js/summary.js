/**
 * Initializes the summary page.
 */
function summaryInit() {
    setTimeout(showHeaderUserInitials, 500);
    getSummaryToDosCount();
    getDoneTasksCount();
    summaryGetUrgentPriorityCount();
    summaryGetNextDateTask();
    summaryGetAllTasksCount();
    getInProgressTasksCount();
    summaryGetAwaitingFeedbackCount();
    updateGreeting();
}


/**
 * Retrieves the count of tasks in the 'To Do' column and updates the corresponding summary display.
 */
function getSummaryToDosCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const todoTasksCount = currentUser.tasks.filter(task => task.columnId === 'todo').length;
        const summaryToDoID = document.getElementById('summaryToDoID');
        if (summaryToDoID) {
            summaryToDoID.textContent = todoTasksCount.toString();
        }
    } else {        
        const summaryToDoID = document.getElementById('summaryToDoID');
        if (summaryToDoID) {
            summaryToDoID.textContent = '0';
        }
    }
}


/**
 * Retrieves the count of tasks in the 'Done' column and updates the corresponding summary display.
 */
function getDoneTasksCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const doneTasksCount = currentUser.tasks.filter(task => task.columnId === 'done').length;
        const summaryDoneID = document.getElementById('summaryDoneID');
        if (summaryDoneID) {
            summaryDoneID.textContent = doneTasksCount.toString();
        }
    } else {        
        const summaryDoneID = document.getElementById('summaryDoneID');
        if (summaryDoneID) {
            summaryDoneID.textContent = '0';
        }
    }
}


/**
 * Retrieves the count of tasks with 'Urgent' priority and updates the corresponding summary display.
 */
function summaryGetUrgentPriorityCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const urgentPriorityCount = currentUser.tasks.filter(task => task.prio === 'urgent').length;
        const summaryPriorityID = document.getElementById('summaryPriorityID');
        if (summaryPriorityID) {
            summaryPriorityID.textContent = urgentPriorityCount.toString();
        }
    } else {        
        const summaryPriorityID = document.getElementById('summaryPriorityID');
        if (summaryPriorityID) {
            summaryPriorityID.textContent = '0';
        }
    }
}


/**
 * Retrieves the next due date task and displays its formatted date.
 */
function summaryGetNextDateTask() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const tasksWithDueDate = getTasksWithDueDate(currentUser.tasks);
        if (tasksWithDueDate.length > 0) {
            const nextDueDate = getNextDueDate(tasksWithDueDate);
            displayFormattedDate(nextDueDate);
        } else {
            displayNoTaskMessage();
        }
    } else {
        displayNoTaskMessage();
    }
}


/**
 * Retrieves the current user object from local storage.
 * @returns {Object} The current user object.
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}


/**
 * Filters tasks to include only those with a due date specified.
 * @param {Array} tasks - The array of tasks.
 * @returns {Array} - The filtered array of tasks with due dates.
 */
function getTasksWithDueDate(tasks) {
    return tasks.filter(task => task.date !== "");
}


/**
 * Finds the next due date from an array of tasks.
 * @param {Array} tasks - The array of tasks.
 * @returns {Date} - The next due date.
 */
function getNextDueDate(tasks) {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    return new Date(tasks[0].date);
}


/**
 * Displays a formatted date in the summary section.
 * @param {Date} date - The date to be formatted.
 */
function displayFormattedDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const summaryDateID = document.getElementById('summaryDateID');
    if (summaryDateID) {
        summaryDateID.textContent = formattedDate;
    }
}


/**
 * Displays a message indicating no task is available.
 */
function displayNoTaskMessage() {
    const summaryDateID = document.getElementById('summaryDateID');
    if (summaryDateID) {
        summaryDateID.textContent = "No Task";
    }
}


/**
 * Updates the summary section with the count of all tasks.
 */
function summaryGetAllTasksCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskCount = currentUser.tasks.length;
        const summaryAllTasksID = document.getElementById('summaryAllTasksID');
        if (summaryAllTasksID) {
            summaryAllTasksID.textContent = taskCount.toString();
        }
    } else {        
        const summaryAllTasksID = document.getElementById('summaryAllTasksID');
        if (summaryAllTasksID) {
            summaryAllTasksID.textContent = '0';
        }
    }
}


/**
 * Retrieves the count of tasks in progress and updates the summary section.
 */
function getInProgressTasksCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const inProgressTasksCount = currentUser.tasks.filter(task => task.columnId === 'inprogress').length;
        const summaryInProgressID = document.getElementById('summaryProgressID');
        if (summaryInProgressID) {
            summaryInProgressID.textContent = inProgressTasksCount.toString();
        }
    } else {        
        const summaryInProgressID = document.getElementById('summaryProgressID');
        if (summaryInProgressID) {
            summaryInProgressID.textContent = '0';
        }
    }
}


/**
 * Retrieves the count of tasks awaiting feedback and updates the summary section.
 */
function summaryGetAwaitingFeedbackCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const awaitingFeedbackCount = currentUser.tasks.filter(task => task.columnId === 'awaitfeedback').length;
        const summaryFeedbackID = document.getElementById('summaryFeedbackID');
        if (summaryFeedbackID) {
            summaryFeedbackID.textContent = awaitingFeedbackCount.toString();
        }
    } else {        
        const summaryFeedbackID = document.getElementById('summaryFeedbackID');
        if (summaryFeedbackID) {
            summaryFeedbackID.textContent = '0';
        }
    }
}


/**
 * Updates the greeting message based on the time of the day.
 */
async function updateGreeting() {
    let { h, e, currentUser, addHours, addMinutes } = updateGreetingVariables();
    const currentUserPElement = `<p class="greetingUserNamePElement">${currentUser.userName}</p>`;
    if (h <= 4) {
      e.innerHTML = `Good night, ${currentUserPElement}`;
      addHours = 4 - h;
    } else if (h <= 10) {
      e.innerHTML = `Good morning, ${currentUserPElement}`;
      addHours = 10 - h;
    } else if (h <= 12) {
      e.innerHTML = `Good noon, ${currentUserPElement}`;
      addHours = 12 - h;
    } else if (h <= 17) {
        e.innerHTML = `Good afternoon, ${currentUserPElement}`;
        addHours = 17 - h;
    } else {
      e.innerHTML = `Good evening,<br> ${currentUserPElement}`;
      addHours = 23 - h;
    }
    const waitTime = addHours * 60 * 60 * 1000 + addMinutes * 60 * 1000;    
    setTimeout(updateGreeting, waitTime);
}


/**
 * Retrieves variables required for updating the greeting message.
 * @returns {Object} - Object containing required variables.
 */
function updateGreetingVariables() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const e = document.getElementById("greeting-id");
    let addHours = 0;
    let addMinutes = m;
    return { h, e, currentUser, addHours, addMinutes };
}