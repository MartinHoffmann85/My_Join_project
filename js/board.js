function initBoard() {
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 500);
}


function redirectToAddTask() {
    window.location.assign("../add_task.html");
}


function renderAllTasks() {
    const tasksData = JSON.parse(localStorage.getItem('currentUser')).tasks;
    tasksData.forEach(task => {
        const { title, description, category } = task;
        const assignedTo = task.userName; // Annahme: Der Benutzername des zugewiesenen Benutzers wird benötigt
        const prio = task.priority; // Annahme: Die Priorität des Tasks wird benötigt
        const subtasks = task.subtasks; // Annahme: Die Liste der Teilaufgaben wird benötigt
        const dueDate = task.date; // Annahme: Das Fälligkeitsdatum des Tasks wird benötigt
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.innerHTML = `
            <div><strong>Title:</strong> ${title}</div>
            <div><strong>Description:</strong> ${description}</div>
            <div><strong>Category:</strong> ${category}</div>
            <div><strong>Assigned to:</strong> ${assignedTo}</div>
            <div><strong>Prio:</strong> ${prio}</div>
            
            <div><strong>Due Date:</strong> ${dueDate}</div>
        `;
        // Annahme: Hier wird angenommen, dass eine Container-Div mit der Klasse "task-container" vorhanden ist, in der die Task-Karten gerendert werden sollen.
        document.querySelector('.boardContent').appendChild(taskCard);
    });
}
// <div><strong>Subtasks:</strong> ${subtasks.join(', ')}</div>

function saveTasksToLocalStorage() {
    const columns = document.querySelectorAll('.boardColumn');
    let boardTasks = localStorage.getItem('currentUser.BoardTasks');
    if (!boardTasks) {
        boardTasks = {};
    } else {
        boardTasks = JSON.parse(boardTasks);
    }
    columns.forEach(column => {
        const columnId = column.id;
        const tasks = column.querySelectorAll('.task');
        const taskList = [];
        tasks.forEach(task => {
            taskList.push(task.textContent.trim());
        });
        boardTasks[columnId] = taskList;
    });    
    localStorage.setItem('currentUser.BoardTasks', JSON.stringify(boardTasks));
}


function loadTasksFromLocalStorage() {
    const boardTasksJSON = localStorage.getItem('currentUser.BoardTasks');
    if (boardTasksJSON) {
        const boardTasks = JSON.parse(boardTasksJSON);
        Object.keys(boardTasks).forEach(columnId => {
            const tasks = boardTasks[columnId];
            const column = document.getElementById(columnId);
            if (column) {
                tasks.forEach(taskText => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.textContent = taskText;
                    taskElement.setAttribute('draggable', 'true');
                    column.appendChild(taskElement);
                });
            }
        });
    }
}