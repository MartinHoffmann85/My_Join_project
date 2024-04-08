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
    const taskCard = createTaskCardElement(id, title, description, category, assignedTo, prio);
    return taskCard;
}


function createTaskCardElement(id, title, description, category, assignedTo, prio) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task');
    taskCard.setAttribute('id', id);
    const assignedToHTML = generateAssignedToHTML(assignedTo);
    const backgroundColor = determineBackgroundColor(category);
    const prioContent = determinePriorityContent(prio);
    return createTaskCardElementHTML(taskCard, backgroundColor, category, title, description, id, assignedToHTML, prioContent);
}


function createTaskCardElementHTML(taskCard, backgroundColor, category, title, description, id, assignedToHTML, prioContent) {
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


function generateAssignedToHTML(assignedTo) {
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
      let assignedToHTML = '';
      assignedTo.userNames.forEach((userName, index) => {
        const user = {
          userNames: [userName],
          colorCodes: [assignedTo.colorCodes[index]],
        };
        assignedToHTML += renderUserDetails(user);
      });
      return assignedToHTML;
    } else {
      return '<div><strong>Assigned to:</strong> No one assigned</div>';
    }
}


function determineBackgroundColor(category) {
    switch (category) {
      case 'Technical Task':
        return 'var(--technical-task-turquoise)';
      case 'User Story':
        return 'var(--user-story-blue)';
      default:
        return '';
    }
}


function determinePriorityContent(prio) {
    switch (prio) {
      case 'urgent':
        return `<img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
      case 'medium':
        return `<img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
      case 'low':
        return `<img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
      default:
        return prio;
    }
}


function boardRenderSubtasksCount(taskId) {
    const task = getCurrentUserTask(taskId);
    if (!task || !task.subtasks || task.subtasks.length === 0) {
      return 'No subtasks';
    }
    const checkedCount = countCheckedSubtasks(task.subtasks);
    const progress = calculateProgress(checkedCount, task.subtasks.length);
    const progressBarContainer = generateProgressBarContainer(checkedCount, task.subtasks.length, progress);
    return progressBarContainer;
}

  
function getCurrentUserTask(taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.tasks.find(task => task.id === taskId);
}


function countCheckedSubtasks(subtasks) {
    let checkedCount = 0;
    subtasks.forEach(subtask => {
      if (subtask.completed) {
        checkedCount++;
      }
    });
    return checkedCount;
}


function calculateProgress(checkedCount, totalSubtasks) {
    return (checkedCount / totalSubtasks) * 100;
}


function generateProgressBarContainer(checkedCount, totalSubtasks, progress) {
    return `
      <div class="progress-bar">
          <div class="progress" style="width: ${progress}%;"></div>
      </div>
      <p class="boardRenderSubtasksCountPElement">${checkedCount}/${totalSubtasks} Subtasks</p>
    `;
}


function boardRenderSubtasks(taskCard, taskId) {
    const task = getCurrentUserTask(taskId);
    if (!task || !task.subtasks || task.subtasks.length === 0) {
      return '';
    }
    let subtasksHTML = '';
    let checkedCount = 0;
    ({ checkedCount, subtasksHTML } = boardRenderSubtaskForEach(task, checkedCount, subtasksHTML, taskId));
    const totalCount = task.subtasks.length;
    const countDisplay = `${checkedCount}/${totalCount}`;
    appendCountElement(taskCard, countDisplay);
    return subtasksHTML;
}


function boardRenderSubtaskForEach(task, checkedCount, subtasksHTML, taskId) {
    task.subtasks.forEach(subtask => {
        const { isChecked, checkboxId } = generateCheckboxAttributes(subtask);
        if (subtask.completed) {
            checkedCount++;
        }
        subtasksHTML += generateSubtaskHTML(subtask, isChecked, checkboxId, taskId);
    });
    return { checkedCount, subtasksHTML };
}


function getCurrentUserTask(taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.tasks.find(task => task.id === taskId);
}


function generateCheckboxAttributes(subtask) {
    const isChecked = subtask.completed ? 'checked' : '';
    const checkboxId = subtask.id;
    return { isChecked, checkboxId };
}


function generateSubtaskHTML(subtask, isChecked, checkboxId, taskId) {
    return `
      <div class="displayFlex">
          <div><input type="checkbox" id="${checkboxId}" ${isChecked} onclick="updateSubtaskStatus('${taskId}', '${subtask.id}', this.checked)"></div>
          <div class="renderTaskCardOverlaySubtaskTitle">${subtask.title}</div>                            
      </div>`;
}


function appendCountElement(taskCard, countDisplay) {
    const countElement = document.createElement('div');
    countElement.innerHTML = countDisplay;
    taskCard.appendChild(countElement);
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
    let assignedToHTML = renderTaskCardAsOverlayAssignetTo(assignedTo);    
    let backgroundColor = '';
    backgroundColor = renderTaskCardAsOverlayCategory(category, backgroundColor);
    let prioContent = prio;
    prioContent = renderTaskCarsAsOverlayPrio(prio, prioContent);
    const subtasksHTML = boardRenderSubtasks(card, id);
    renderTaskCardAsOverlayCardHTML(card, backgroundColor, category, title, description, date, prioContent, assignedToHTML, subtasksHTML, id);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}


function renderTaskCardAsOverlayCardHTML(card, backgroundColor, category, title, description, date, prioContent, assignedToHTML, subtasksHTML, id) {
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
}


function renderTaskCarsAsOverlayPrio(prio, prioContent) {
    if (prio === 'urgent') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }
    return prioContent;
}


function renderTaskCardAsOverlayCategory(category, backgroundColor) {
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    return backgroundColor;
}


function renderTaskCardAsOverlayAssignetTo(assignedTo) {
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
    return assignedToHTML;
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
        let backgroundColor = boardEditTaskCategory(task);
        boardEditTaskPrio(task);
        const assignedToHTML = boardEditTaskAssignetTo(task);
        boardTaskEditHTML(card, backgroundColor, task, taskId, assignedToHTML);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }
}


function boardTaskEditHTML(card, backgroundColor, task, taskId, assignedToHTML) {
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
}


function boardEditTaskAssignetTo(task) {
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
    return assignedToHTML;
}


function boardEditTaskPrio(task) {
    let prioContent = task.prio;
    if (task.prio === 'urgent') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Urgent</strong></p><img src="./assets/img/prioUrgentIcon.svg" alt="Urgent Priority">`;
    } else if (task.prio === 'medium') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Medium</strong></p><img src="./assets/img/mediumCategory.svg" alt="Medium Priority">`;
    } else if (task.prio === 'low') {
        prioContent = `<p class="boardOverlayUrgentPElement"><strong>Low</strong></p><img src="./assets/img/lowPrio.svg" alt="Low Priority">`;
    }
}


function boardEditTaskCategory(task) {
    let backgroundColor = '';
    if (task.category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (task.category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    return backgroundColor;
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
    const selectedContacts = Array.from(document.querySelectorAll('.contact-option.selected')).map(contact => contact.textContent.trim());
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const taskIndex = currentUser.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const { userNames, colorCodes } = currentUser.tasks[taskIndex].assignedTo || { userNames: [], colorCodes: [] };
      userNames.length = 0;
      colorCodes.length = 0;
      selectedContacts.forEach(contactName => {
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
    const { task, updatedTitle, updatedDescription, updatedDate, updatedPriority } = boardEditTaskUpdateVariables(taskId);    
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


function boardEditTaskUpdateVariables(taskId) {
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionTextarea = document.getElementById('editDescription');
    const editDateInput = document.getElementById('editDate');
    const editPrioritySelect = document.getElementById('editPriority');
    const updatedTitle = editTitleInput.value;
    const updatedDescription = editDescriptionTextarea.value;
    const updatedDate = editDateInput.value;
    const updatedPriority = editPrioritySelect.value;
    const task = getTaskFromLocalStorage(taskId);
    return { task, updatedTitle, updatedDescription, updatedDate, updatedPriority };
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
            addSubtaskSaveAndRedirectToBoardEditTask(subtaskTitle, currentUser, taskIndex, taskId);
        }
    }
}


function addSubtaskSaveAndRedirectToBoardEditTask(subtaskTitle, currentUser, taskIndex, taskId) {
    const newSubtask = addSubtaskNewSubtask(subtaskTitle);
    currentUser.tasks[taskIndex].subtasks.push(newSubtask);
    saveTasksToLocalStorage(currentUser);
    updateCurrentUserInBackend(currentUser);
    boardEditTask(taskId);
}


function addSubtaskNewSubtask(subtaskTitle) {
    return {
        id: boardGenerateRandomID(),
        title: subtaskTitle,
        completed: false
    };
}


function boardGenerateRandomID() {    
    return Math.random().toString(36).substring(2, 11);
}