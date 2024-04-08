function summaryInit() {
    setTimeout(showHeaderUserInitials, 200);    
    getSummaryToDosCount();
    getDoneTasksCount();
    summaryGetUrgentPriorityCount();
    summaryGetNextDateTask();
    summaryGetAllTasksCount();
    getInProgressTasksCount();
    summaryGetAwaitingFeedbackCount();
    updateGreeting();
}


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


function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}


function getTasksWithDueDate(tasks) {
    return tasks.filter(task => task.date !== "");
}


function getNextDueDate(tasks) {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    return new Date(tasks[0].date);
}


function displayFormattedDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const summaryDateID = document.getElementById('summaryDateID');
    if (summaryDateID) {
        summaryDateID.textContent = formattedDate;
    }
}


function displayNoTaskMessage() {
    const summaryDateID = document.getElementById('summaryDateID');
    if (summaryDateID) {
        summaryDateID.textContent = "No Task";
    }
}


function summaryGetAllTasksCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskCount = currentUser.tasks.length;
        const summaryToDoID = document.getElementById('summaryAllTasksID');
        if (summaryToDoID) {
            summaryToDoID.textContent = taskCount.toString();
        }
    } else {        
        const summaryToDoID = document.getElementById('summaryAllTasksID');
        if (summaryToDoID) {
            summaryToDoID.textContent = '0';
        }
    }
}


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


async function updateGreeting() {
    let { h, e, currentUser, addHours, addMinutes } = updateGreetingVariables();
    if (h <= 4) {
      e.textContent = `Good night, ${currentUser.userName}`;
      addHours = 4 - h;
    } else if (h <= 10) {
      e.textContent = `Good morning, ${currentUser.userName}`;
      addHours = 10 - h;
    } else if (h <= 12) {
      e.textContent = `Good noon, ${currentUser.userName}`;
      addHours = 12 - h;
    } else if (h <= 17) {
        e.textContent = `Good afternoon, ${currentUser.userName}`;
        addHours = 17 - h;
    } else {
      e.innerHTML = `Good evening,<br> ${currentUser.userName}`;
      addHours = 23 - h;
    }  
    const waitTime = addHours * 60 * 60 * 1000 + addMinutes * 60 * 1000;    
    setTimeout(updateGreeting, waitTime)
}


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