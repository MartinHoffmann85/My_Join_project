async function initBoard() {
    const currentUser = await JSON.parse(localStorage.getItem('currentUser'));
    loadTasksFromLocalStorage(currentUser);
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 500);
}


function redirectToAddTask() {
    window.location.assign("../add_task.html");
}


function renderAllTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {                
        clearTaskContainers();        
        currentUser.tasks.forEach(task => {
            renderTask(task, task.columnId);
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
    console.log("function renderTask(assignedTo)" , assignedTo);   
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
    console.log("currentUser", currentUser);
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
    console.log("function updateSubtaskStatus(isChecked)", isChecked);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        const task = currentUser.tasks.find(task => task.id === taskId);
        if (task && task.subtasks && Array.isArray(task.subtasks)) {
            const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
            if (subtask) {
                subtask.completed = isChecked;
                saveTasksToLocalStorage(currentUser);
                console.log("function updateSubtaskStatus(subtask.completed) after save", subtask.completed);
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
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }    
    const subtasksHTML = boardRenderSubtasks(card, id);
    card.innerHTML = `
        <div class="boardOverlayCategoryAndCloseXContainer">            
            <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${category}</div>
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
                <p class="">${assignedToHTML}</p>
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
    console.log("currentUser" , currentUser);
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

        const assignedToContacts = task.assignedTo && task.assignedTo.userNames ? task.assignedTo.userNames.join(', ') : 'No one assigned';
        
        card.innerHTML = `
            <div class="boardOverlayCategoryAndCloseXContainer">
                <div class="renderTaskCardCategoryDiv" style="background-color: ${backgroundColor};">${task.category}</div>
                <div><img class="boardTaskOverlayCloseX" onclick="closeOverlayBoard(); initBoard()" src="./assets/img/boardTaskOverlayCloseX.svg" alt=""></div>
            </div>
            <div class="renderTaskTitleOverlay">
                <label for="editTitle">Title:</label>
                <input class="boardEditTaskOverlayTitleInput" type="text" id="editTitle" value="${task.title}">
            </div>
            <div class="renderTaskDescriptionOverlay">
                <label for="editDescription">Description:</label>
                <textarea class="textarea-style" id="editDescription">${task.description}</textarea>
            </div>
            <div class="renderTaskDate">
                <label for="editDate">Due date:</label>
                <input class="editRenderTaskCardoverlyDate" type="date" id="editDate" value="${task.date}">
            </div>
            <div class="overlayAssignetToHTMLAndPrioContentContainer">
                <div class="boardPriorityContainer">
                    <label for="editPriority">Priority:</label>
                    <select class="editTaskCardoverlayPriorityDropDownMenu" id="editPriority">
                        <option value="low" ${task.prio === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.prio === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="urgent" ${task.prio === 'urgent' ? 'selected' : ''}>Urgent</option>
                    </select>
                </div>
                <div class="renderTaskCardOverlayAssignetToContainer">
                    <label for="editAssignedTo">Assigned To:</label>
                    <div class="dropdown">
                    <button class="editDropDownToggle" onclick="boardToggleDropdownMenu()">Select contacts</button>
                        <ul id="boardContactDropDownmenuID" class="boardDropDownMenu">
                        ${generateAssignedToOptions(task.assignedTo, taskId)}
                    </ul>
                </div>
                    <div>${assignedToContacts}</div>
                </div>
            </div>
            <div class="renderTasksubtaskHTML">
                <p class="renderTasksubtaskHTMLSubtaskPElement">Subtasks</p>
                ${boardRenderSubtasks(card, taskId)}
            </div>
            <div class="contactsContentRightSideEditAndDeleteButtonContainerBoardOverlay">
                <img class="contactsContentRightSideEditButton" src="./assets/img/contacts/editContactsButtonDesktop.svg" alt="" onclick="boardEditTask('${taskId}')">
                <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteTask('${taskId}')">
            </div>
        `;        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }
}

function generateAssignedToOptions(assignedTo, taskId) {
    console.log("function generateAssignedToOptions(taskId)" , taskId);    
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


function showBoardDropDownMenu() {
    const dropdown = document.getElementById('boardContactDropDownmenuID');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        dropdown.style.display = 'block';
    }
}


function selectContact(contactElement, taskId) {    
    console.log("Selected contact with taskId:", taskId);
    contactElement.classList.toggle('selected');
    editUpdateAssignedTo(taskId);
}


function getTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('currentUser')).tasks;
    return tasks.find(task => task.id === taskId);
}


function editUpdateAssignedTo(taskId) {
    console.log("function editUpdateAssignedTo(taskId)" , "got called");
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
        selectedContactNames.forEach(contactName => {
            if (!userNames.includes(contactName)) {
                userNames.push(contactName);
                colorCodes.push(getColorCodeForContact(currentUser.contacts, contactName));
            }
        });
        saveTasksToLocalStorage(currentUser);
        boardEditTask(taskId);
        console.log("function editUpdateAssignedTo(taskId)" , "contact saved");        
    }
}


function boardEditAssignedTo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    boardEditRenderAssignedToContacts(currentUser.contacts);
    document.getElementById('assignedto-input-id').addEventListener('input', function (event) {
      const searchTerm = event.target.value;
      const filteredContacts = currentUser.contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      boardEditRenderAssignedToContacts(filteredContacts);
    });
}


function boardEditRenderAssignedToContacts(contacts) {
    const assignedToContainer = document.getElementById('assigned-to-contacts-id');
    assignedToContainer.innerHTML = '';
    contacts.forEach(contact => {
      if (contact.name === currentUser.userName) 
        contact.name = contact.name + ' (you)';
      const initials = getFirstLettersOfName(contact.name);
      const textColor = isColorLight(contact.colorCode) ? 'white' : 'black';
      const isSelected = contact.selected;
      assignedToContainer.innerHTML += templateAssignedToContainerHTML(contact.name, contact.colorCode, initials, textColor, isSelected);
    });  
}


function getColorCodeForContact(contacts, contactName) {
    const contact = contacts.find(contact => contact.name === contactName);
    if (contact) {
        return contact.colorCode;
    } else {
        // Wenn der Kontakt nicht gefunden wurde, gib eine Standardfarbe zurück
        return '#000000'; // Hier kann eine Standardfarbe definiert werden
    }
}










// Clear function for task dummys only for developers
function clearAllTasksFromLocalStorage2() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    currentUser.tasks = [];
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateCurrentUserInBackend(currentUser);
}
