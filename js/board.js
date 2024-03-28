function initBoard() {
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 500);
}


function redirectToAddTask() {
    window.location.assign("../add_task.html");
}


function renderAllTasks() {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.boardColumn');
    let draggedTask = null;
    tasks.forEach(task => {
        task.addEventListener('dragstart', function (e) {
            draggedTask = this;            
            e.dataTransfer.setData('text/plain', null);
            setTimeout(() => {
                this.style.display = 'none';
            }, 0);
        });
        task.addEventListener('dragend', function () {
            draggedTask = null;
            this.style.display = 'block';
            saveTasksToLocalStorage();
        });
    });
    columns.forEach(column => {
        column.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        column.addEventListener('dragenter', function (e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        });
        column.addEventListener('dragleave', function () {
            this.style.backgroundColor = '';
        });
        column.addEventListener('drop', function (e) {            
            this.appendChild(draggedTask);
            this.style.backgroundColor = '';
            saveTasksToLocalStorage();
        });
    });
    loadTasksFromLocalStorage();
}


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