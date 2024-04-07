async function initBoard() {
    const currentUser = await JSON.parse(localStorage.getItem('currentUser'));
    loadTasksFromLocalStorage(currentUser);
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 200);
    
}


function redirectToAddTask() {
    window.location.assign("./add_task.html");
}


function renderAllTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("function renderAllTasks(currentUser)", currentUser);    
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {                
        clearTaskContainers();        
        currentUser.tasks.forEach(task => {
            renderTask(task);
            addTaskClickListener();
        });
    } else {
        console.error('Invalid tasks data in localStorage');
    }
}


function clearTaskContainers() {
    const columns = document.querySelectorAll('.boardColumn');
    columns.forEach(column => {
        const taskContainer = column.querySelector('.task-container');
        taskContainer.innerHTML = '';
    });
}


function renderTask(taskData) {
    const { id, title, description, category, assignedTo, prio, date, columnId } = taskData;       
    const validColumnIds = ["todo", "inprogress", "awaitfeedback", "done"];
    const actualColumnId = validColumnIds.includes(columnId) ? columnId : "todo";
    const taskCard = renderTaskCard(id, title, description, category, assignedTo, prio, date);    
    const taskContainer = document.querySelector(`#${actualColumnId}-column .task-container`);
    if (taskContainer) {
        taskContainer.appendChild(taskCard);
        taskCard.addEventListener('dragstart', dragStart);
        taskCard.setAttribute('draggable', 'true');
    } else {
        console.error('Task container not found for column:', actualColumnId);
    }
}


function renderTaskCard(id, title, description, category, assignedTo, prio, date, columnId) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task');
    taskCard.setAttribute('id', id);
    let assignedToHTML = '';
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
        assignedTo.userNames.forEach((userName, index) => {
            const user = {
                userNames: [userName],
                colorCodes: [assignedTo.colorCodes[index]],
            };
            assignedToHTML += renderUserDetails(user);
        });
    } else {
        assignedToHTML = '<div><strong>Assigned to:</strong> No one assigned</div>';
    }
    let backgroundColor = '';
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    let prioContent = prio;
    if (prio === 'urgent') {
        prioContent = `<img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (prio === 'medium') {
        prioContent = `<img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (prio === 'low') {
        prioContent = `<img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }
    taskCard.innerHTML = `
        <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
        <div class="renderTaskTitle"><p class="renderTaskTitlePElement">${title}</p></div>
        <div class="renderTaskDescription">${description}</div>        
        <div class="subtaskCountContainer">
            <div class="boardRenderSubtaskContainer"></div>
            <p class="boardRenderSubtasksCountPElement">${boardRenderSubtasksCount(id)}</p>
        </div>
        <div class="assignetToHTMLAndPrioContentContainer">   
            <div class="renderTaskCardAssignetToContainer">${assignedToHTML}</div>
            <div class="renderTaskToHTMLPrioContainer">${prioContent}</div>
        </div>        
    `;
    return taskCard;
}


function boardRenderSubtasksCount(taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const task = currentUser.tasks.find(task => task.id === taskId);    
    if (!task || !task.subtasks || task.subtasks.length === 0) {
        return 'No subtasks';
    }    
    let checkedCount = 0;
    task.subtasks.forEach(subtask => {
        if (subtask.completed) {
            checkedCount++;
        }
    });    
    const progress = (checkedCount / task.subtasks.length) * 100;    
    const progressBarContainer = `
        <div class="progress-bar">
            <div class="progress" style="width: ${progress}%;"></div>
        </div>
        <p class="boardRenderSubtasksCountPElement">${checkedCount}/${task.subtasks.length} Subtasks</p>
    `;    
    return progressBarContainer;
}


function boardRenderSubtasks(taskCard, taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (!task || !task.subtasks || task.subtasks.length === 0) {
        return '';
    }
    let subtasksHTML = '';
    let checkedCount = 0;
    task.subtasks.forEach((subtask, index) => {
        const isChecked = subtask.completed ? 'checked' : '';
        if (subtask.completed) {
            checkedCount++;
        }
        const checkboxId = subtask.id;
        subtasksHTML += `
            <div class="displayFlex">
                <div><input type="checkbox" id="${checkboxId}" ${isChecked} onclick="updateSubtaskStatus('${taskId}', '${subtask.id}', this.checked)"></div>
                <div class="renderTaskCardOverlaySubtaskTitle">${subtask.title}</div>                            
            </div>`;
    });
    const totalCount = task.subtasks.length;
    const countDisplay = `${checkedCount}/${totalCount}`;
    const countElement = document.createElement('div');
    countElement.innerHTML = countDisplay;
    taskCard.appendChild(countElement);
    return subtasksHTML;
}


function updateSubtaskStatus(taskId, subtaskId, isChecked) {    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const task = currentUser.tasks.find(task => task.id === taskId);
        if (task && task.subtasks && Array.isArray(task.subtasks)) {
            const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
            if (subtask) {
                subtask.completed = isChecked;
                saveTasksToLocalStorage(currentUser);
                updateCurrentUserInBackend(currentUser);                
                initBoard();
            } else {
                console.error("Subtask not found with ID:", subtaskId);
            }
        }
    }
}


function renderUserDetails(user) {
    const colorCode = user.colorCodes && user.colorCodes.length > 0 ? user.colorCodes[0] : getRandomColorHex();
    const initials = user.userNames && user.userNames.length > 0 ? user.userNames[0].split(' ').map(word => word[0]).join('') : '';
    const textColor = isColorLight(colorCode) ? "black" : "white";
    return `
      <div class="boardContactInitialsandColor" style="background-color: ${colorCode}; color: ${textColor};">
        ${initials}
      </div>
    `;
}


function saveTasksToLocalStorage(currentUser) {
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        console.error('Invalid currentUser data in localStorage');
    }
}


function loadTasksFromLocalStorage(currentUser) {
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const tasksJSON = localStorage.getItem('currentUser.tasks');
        if (tasksJSON) {
            const tasks = JSON.parse(tasksJSON);
            currentUser.tasks = tasks;
            clearTaskContainers();
            tasks.forEach(task => {
                renderTask(task);
        });
        }
    }    
}


function dragStart(event) {    
    const taskId = event.target.id;
    event.dataTransfer.setData("text/plain", taskId);
}


function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}


function allowDrop(event) {
    event.preventDefault();
}


function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const targetColumn = event.target.closest('.boardColumn');
    if (targetColumn) {
        const targetColumnId = targetColumn.id.split('-')[0];
        const targetContainer = document.getElementById(targetColumnId + '-tasks');
        const draggedTaskElement = document.getElementById(taskId);
        if (draggedTaskElement && targetContainer) {
            targetContainer.appendChild(draggedTaskElement);
            updateTaskColumnId(taskId, targetColumnId);
        }
    }
}


async function updateTaskColumnId(taskId, newColumnId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            currentUser.tasks[taskIndex].columnId = newColumnId;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            await updateCurrentUserInBackend(currentUser);        
        }
    }
}


function renderTaskCardAsOverlay(id, title, description, category, assignedTo, prio, date, columnId, subtasks) {    
    const overlay = document.createElement('div');
    overlay.classList.add('boardoverlay');    
    const card = document.createElement('div');
    card.classList.add('card');    
    let assignedToHTML = '';
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
        assignedTo.userNames.forEach((userName, index) => {
            const user = {
                userNames: [userName],
                colorCodes: [assignedTo.colorCodes[index]],
            };
            const initials = userName.split(' ').map(word => word[0]).join('').toUpperCase();
            const backgroundColor = assignedTo.colorCodes[index];
            const iconHTML = `<div class="userIcon" style="background-color: ${backgroundColor};">${initials}</div>`;
            assignedToHTML += `<div class="assignedToUser">${iconHTML} <p class="editAssignetToUserPElement">${userName}</p></div>`;
        });
    } else {
        assignedToHTML = '<div><strong>Assigned to:</strong> No one assigned</div>';
    }    
    let backgroundColor = '';
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }    
    let prioContent = prio;
    if (prio === 'urgent') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }    
    const subtasksHTML = boardRenderSubtasks(card, id);
    card.innerHTML = `
        <div class="boardOverlayCategoryAndCloseXContainer">            
            <div class="renderTaskCardOverlayCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
            <div><img class="boardTaskOverlayCloseX" onclick="closeOverlayBoard()" src="./assets/img/boardTaskOverlayCloseX.svg" alt=""></div>
        </div>        
        <div class="renderTaskTitleOverlay"><strong>${title}</strong></div>
        <div class="renderTaskDescriptionOverlay">${description}</div>
        <div class="renderTaskDate"><p class="renderTaskDatePElement">Due date:</p><p class="renderTaskOverlayDate">${date}</p></div>               
        <div class="overlayAssignetToHTMLAndPrioContentContainer">
            <div class="boardPriorityContainer">
                <div class="renderTaskOverlayPrio">Priority:</div>
                <div class="boardPrioIcon displayFlex">${prioContent}</div>
            </div>  
            <div class="renderTaskCardOverlayAssignetToContainer">
                <p class="renderTaskCardOverlayAssignetToPElement">Assigned To:</p>
                <p>${assignedToHTML}</p>
            </div>            
        </div>
        <div class="renderTasksubtaskHTML"><p class="renderTasksubtaskHTMLSubtaskPElement">Subtasks</p>${subtasksHTML}</div>
        <div class="contactsContentRightSideEditAndDeleteButtonContainerBoardOverlay">
            <img class="contactsContentRightSideEditButton" src="./assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="boardEditTask('${id}')">
            <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteTask('${id}')">
        </div>
    `;    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}


function addTaskClickListener() {
    const taskCards = document.querySelectorAll('.task');
    taskCards.forEach(taskCard => {        
        taskCard.removeEventListener('click', renderTaskCardOverlay);        
        taskCard.addEventListener('click', renderTaskCardOverlay);
    });
}


function renderTaskCardOverlay(event) {
    const taskId = event.currentTarget.id;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (task) {        
        const subtasks = JSON.parse(localStorage.getItem('currentUser.tasks.subtasks'));        
        renderTaskCardAsOverlay(task.id, task.title, task.description, task.category, task.assignedTo, task.prio, task.date, task.columnId, subtasks);
    } else {
        console.error('Task not found');
    }
}


function closeOverlayBoard() {
    const overlay = document.querySelector('.boardoverlay');
    if (overlay) {
        overlay.remove();
    }
}


function deleteTask(id) {    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    const stringId = id.toString();
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === stringId);
        if (taskIndex !== -1) {
            currentUser.tasks.splice(taskIndex, 1);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));            
            updateCurrentUserInBackend(currentUser);
            closeOverlayBoard();
            renderAllTasks();
        }
    }
}


function boardEditTask(taskId) {
    closeOverlayBoard();
    const task = getTaskFromLocalStorage(taskId);
    if (task) {
        const overlay = document.createElement('div');
        overlay.classList.add('boardoverlay');
        const card = document.createElement('div');
        card.classList.add('card');        
        let backgroundColor = '';
        if (task.category === 'Technical Task') {
            backgroundColor = 'var(--technical-task-turquoise)';
        } else if (task.category === 'User Story') {
            backgroundColor = 'var(--user-story-blue)';
        }
        let prioContent = task.prio;
        if (task.prio === 'urgent') {
            prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
        } else if (task.prio === 'medium') {
            prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
        } else if (task.prio === 'low') {
            prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
        }
        const assignedToContacts = task.assignedTo && task.assignedTo.userNames ? task.assignedTo.userNames : [];
        const assignedToColors = task.assignedTo && task.assignedTo.colorCodes ? task.assignedTo.colorCodes : [];
        const assignedToHTML = assignedToContacts.map((userName, index) => {
            const user = {
                userNames: [userName],
                colorCodes: [assignedToColors[index]],
            };
            const initials = userName.split(' ').map(word => word[0]).join('').toUpperCase();
            const backgroundColor = assignedToColors[index];
            const iconHTML = `<div class="userIcon" style="background-color: ${backgroundColor};">${initials}</div>`;
            return `<div class="assignedToUser">${iconHTML} <p class="editAssignetToUserPElement">${userName}</p></div>`;
        }).join('');
        card.innerHTML = `
            <div class="boardOverlayCategoryAndCloseXContainer">
                <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${task.category}</div>
                <div><img class="boardTaskOverlayCloseX" onclick="closeOverlayBoard(); initBoard()" src="./assets/img/boardTaskOverlayCloseX.svg" alt=""></div>
            </div>
            <div class="renderTaskTitleOverlay">
                <p>Title:</p>
                <input class="boardEditTaskOverlayTitleInput" type="text" id="editTitle" value="${task.title}">
            </div>
            <div class="renderTaskDescriptionOverlay">
                <p>Description:</p>
                <textarea class="textarea-style" id="editDescription">${task.description}</textarea>
            </div>
            <div class="renderTaskDate" type="date">
                <p>Due date:</p>
                <input class="editRenderTaskCardoverlyDate" type="date" id="editDate" value="${task.date}">
            </div>
            <div class="overlayAssignetToHTMLAndPrioContentContainer">
                <div class="boardPriorityContainer">
                <p>Priority:</p>
                    <select class="editTaskCardoverlayPriorityDropDownMenu" id="editPriority">
                        <option class="editTaskCardoverlayPriorityDropDownMenuOption" value="low" ${task.prio === 'low' ? 'selected' : ''}>Low</option>
                        <option class="editTaskCardoverlayPriorityDropDownMenuOption" value="medium" ${task.prio === 'medium' ? 'selected' : ''}>Medium</option>
                        <option class="editTaskCardoverlayPriorityDropDownMenuOption" value="urgent" ${task.prio === 'urgent' ? 'selected' : ''}>Urgent</option>
                    </select>
                </div>
                <div class="renderTaskCardOverlayAssignetToContainer">
                    <div class="editAssigntToPElementAndSelectContactsButton">
                        <p class="renderTaskCardOverlayAssignetToPElement">Assigned To:</p>
                        <div class="dropdown">
                            <button class="editDropDownToggle" onclick="boardToggleDropdownMenu()">Select contacts</button>
                                <ul id="boardContactDropDownmenuID" class="boardDropDownMenu">
                                ${generateAssignedToOptions(task.assignedTo, taskId)}
                                </ul>                        
                        </div>
                    </div>
                    ${assignedToHTML.length > 0 ? assignedToHTML : '<p>No one assigned</p>'}
                </div>
            </div>
            <div class="renderTasksubtaskHTML">
                <p class="renderTasksubtaskHTMLSubtaskPElement">Subtasks</p>
                ${boardRenderSubtasks(card, taskId)}
                <div class="subtaskInput">
                    <input class="boardEditSubtaskInput" type="text" id="newSubtaskInput" placeholder="Enter subtask">
                    <button class="boardEditSubtaskButton" onclick="addSubtask('${taskId}')">Add subtask</button>
                </div>
            </div>
            <div class="contactsContentRightSideEditAndDeleteButtonContainerBoardOverlay">
                <img class="contactsContentRightSideEditButton" src="./assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="boardEditTaskUpdate('${taskId}')">
                <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteTask('${taskId}')">
            </div>
        `;        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }
}


function generateAssignedToOptions(assignedTo, taskId) {        
    const currentUserContacts = JSON.parse(localStorage.getItem('currentUser')).contacts;
    if (!currentUserContacts || currentUserContacts.length === 0) {
        return '<li>No contacts available</li>';
    }
    return currentUserContacts.map(contact => {
        const selected = assignedTo && assignedTo.userNames && assignedTo.userNames.includes(contact.name) ? 'selected' : '';        
        return `<li class="contact-option ${selected}" onclick="selectContact(this, '${taskId}')">${contact.name}</li>`;
    }).join('');    
}


function boardToggleDropdownMenu() {
    const dropdown = document.getElementById('boardContactDropDownmenuID');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}


function selectContact(contactElement, taskId) {
    contactElement.classList.toggle('selected');
    editUpdateAssignedTo(taskId);
}


function getTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('currentUser')).tasks;
    return tasks.find(task => task.id === taskId);
}


function editUpdateAssignedTo(taskId) {
    const selectedContacts = document.querySelectorAll('.contact-option.selected');
    const selectedContactNames = Array.from(selectedContacts).map(contact => contact.textContent.trim());    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        if (!currentUser.tasks[taskIndex].assignedTo) {
            currentUser.tasks[taskIndex].assignedTo = {
                userNames: [],
                colorCodes: []
            };
        }
        const { userNames, colorCodes } = currentUser.tasks[taskIndex].assignedTo;        
        userNames.length = 0;
        colorCodes.length = 0;
        selectedContactNames.forEach(contactName => {
            userNames.push(contactName);
            colorCodes.push(getColorCodeForContact(currentUser.contacts, contactName));
        });
        saveTasksToLocalStorage(currentUser);
        updateCurrentUserInBackend(currentUser);
        boardEditTask(taskId);
    }
}


function getColorCodeForContact(contacts, contactName) {
    const contact = contacts.find(contact => contact.name === contactName);
    if (contact) {
        return contact.colorCode;
    }
}


function boardEditTaskUpdate(taskId) {
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionTextarea = document.getElementById('editDescription');
    const editDateInput = document.getElementById('editDate');
    const editPrioritySelect = document.getElementById('editPriority');    
    const updatedTitle = editTitleInput.value;
    const updatedDescription = editDescriptionTextarea.value;
    const updatedDate = editDateInput.value;
    const updatedPriority = editPrioritySelect.value;    
    const task = getTaskFromLocalStorage(taskId);    
    if (task) {        
        task.title = updatedTitle;
        task.description = updatedDescription;
        task.date = updatedDate;
        task.prio = updatedPriority;        
        updateTaskInLocalStorageAndBackend(taskId, task);        
        closeOverlayBoard();
        initBoard();
    }
}


function updateTaskInLocalStorageAndBackend(taskId, updatedTask) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            currentUser.tasks[taskIndex] = updatedTask;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateCurrentUserInBackend(currentUser);
        }
    }
}


function searchTasks() {
    const searchInput = document.getElementById('boardSearchInputID').value.toLowerCase();
    const taskCards = document.querySelectorAll('.task');    
    taskCards.forEach(taskCard => {
        const taskTitle = taskCard.querySelector('.renderTaskTitlePElement').textContent.toLowerCase();
        const taskDescription = taskCard.querySelector('.renderTaskDescription').textContent.toLowerCase();        
        if (taskTitle.includes(searchInput) || taskDescription.includes(searchInput)) {
            taskCard.style.display = 'block';
        } else {
            taskCard.style.display = 'none';
        }
    });
}


function addSubtask(taskId) {
    const newSubtaskInput = document.getElementById('newSubtaskInput');
    const subtaskTitle = newSubtaskInput.value.trim();
    if (subtaskTitle !== '') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {            
            if (!currentUser.tasks[taskIndex].subtasks) {
                currentUser.tasks[taskIndex].subtasks = [];
            }            
            const newSubtask = {
                id: boardGenerateRandomID(),                
                title: subtaskTitle,
                completed: false
            };            
            currentUser.tasks[taskIndex].subtasks.push(newSubtask);            
            saveTasksToLocalStorage(currentUser);            
            updateCurrentUserInBackend(currentUser);            
            boardEditTask(taskId);
        }
    }
}


function boardGenerateRandomID() {    
    return Math.random().toString(36).substring(2, 11);
}