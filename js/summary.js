function summaryInit() {
    setTimeout(showHeaderUserInitials, 200);
    updateGreeting();
    getSummaryToDosCount();
    getDoneTasksCount();
    summaryGetUrgentPriorityCount();
    summaryGetNextDateTask();
    summaryGetAllTasksCount();
    getInProgressTasksCount();
    summaryGetAwaitingFeedbackCount();
}


function getSummaryToDosCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const todoTasksCount = currentUser.tasks.filter(task => task.columnId === 'todo').length;
        const summaryToDoID = document.getElementById('summaryToDoID');
        if (summaryToDoID) {
            summaryToDoID.textContent = todoTasksCount.toString();
        } else {
            console.error('Summary to-do ID element not found');
        }
    } else {
        console.error('Invalid tasks data in localStorage');
    }
}


function getDoneTasksCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
      const doneTasksCount = currentUser.tasks.filter(task => task.columnId === 'done').length;
      const summaryDoneID = document.getElementById('summaryDoneID');
      if (summaryDoneID) {
          summaryDoneID.textContent = doneTasksCount.toString();
      } else {
          console.error('Summary done ID element not found');
      }
  } else {
      console.error('Invalid tasks data in localStorage');
  }
}


function summaryGetUrgentPriorityCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
      const urgentPriorityCount = currentUser.tasks.filter(task => task.prio === 'urgent').length;
      const summaryPriorityID = document.getElementById('summaryPriorityID');
      if (summaryPriorityID) {
          summaryPriorityID.textContent = urgentPriorityCount.toString();
      } else {
          console.error('Summary Priority ID element not found');
      }
  } else {
      console.error('Invalid tasks data in localStorage');
  }
}


function summaryGetNextDateTask() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {      
      const tasksWithDueDate = currentUser.tasks.filter(task => task.date !== "");
      tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
      if (tasksWithDueDate.length > 0) {
          const nextDueDate = new Date(tasksWithDueDate[0].date);
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          const formattedDate = nextDueDate.toLocaleDateString('en-US', options);
          const summaryDateID = document.getElementById('summaryDateID');
          if (summaryDateID) {
              summaryDateID.textContent = formattedDate;
          } else {
              console.error('Summary Date ID element not found');
          }
      } else {
          console.error('No tasks with due dates found');
      }
  } else {
      console.error('Invalid tasks data in localStorage');
  }
}


function summaryGetAllTasksCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
      const taskCount = currentUser.tasks.length;
      const summaryToDoID = document.getElementById('summaryAllTasksID');
      if (summaryToDoID) {
          summaryToDoID.textContent = taskCount.toString();
      } else {
          console.error('Summary to-do ID element not found');
      }
  } else {
      console.error('Invalid tasks data in localStorage');
  }
}


function getInProgressTasksCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
      const inProgressTasksCount = currentUser.tasks.filter(task => task.columnId === 'inprogress').length;
      const summaryInProgressID = document.getElementById('summaryProgressID');
      if (summaryInProgressID) {
          summaryInProgressID.textContent = inProgressTasksCount.toString();
      } else {
          console.error('Summary in Progress ID element not found');
      }
  } else {
      console.error('Invalid tasks data in localStorage');
  }
}


function summaryGetAwaitingFeedbackCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
      const awaitingFeedbackCount = currentUser.tasks.filter(task => task.columnId === 'awaitfeedback').length;
      const summaryFeedbackID = document.getElementById('summaryFeedbackID');
      if (summaryFeedbackID) {
          summaryFeedbackID.textContent = awaitingFeedbackCount.toString();
      } else {
          console.error('Summary Feedback ID element not found');
      }
  } else {
      console.error('Invalid tasks data in localStorage');
  }
}


async function updateGreeting() {
    let existingUsers = await loadUsersFromBackend('users');    
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const e = document.getElementById("greeting-id");
    let addHours = 0;
    let addMinutes = m;
    if (h <= 4) { // bis 05:00 Uhr
      e.textContent = "Good night,";
      addHours = 4 - h;
    } else if (h <= 10) { // bis 11:00 Uhr     
      e.textContent = "Good morning,";
      addHours = 10 - h;
    } else if (h <= 12) { // bis 13:00 Uhr
      e.textContent = "Good noon,";
      addHours = 12 - h;
    } else if (h <= 17) { // bis 18:00 Uhr
        e.textContent = "Good afternoon,";
        addHours = 17 - h;
    } else { // bis 04:00 Uhr
      e.innerHTML = "Good evening,";
      addHours = 23 - h;
    }  
    const waitTime = addHours * 60 * 60 * 1000 + addMinutes * 60 * 1000;    
    setTimeout(updateGreeting, waitTime)
}
  
