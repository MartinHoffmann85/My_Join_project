let draggedTaskId;
let originalColumnId;

/**
 * Initializes the board by loading tasks from local storage, rendering them, and showing user initials in the header.
 */
async function initBoard() {
    const currentUser = await JSON.parse(localStorage.getItem('currentUser'));
    loadTasksFromLocalStorage(currentUser);
    renderAllTasks();
    setTimeout(showHeaderUserInitials, 200);    
}


/**
 * Redirects the user to the add task page.
 */
function redirectToAddTask() {
    window.location.assign("./add_task.html");
}


/**
 * Renders all tasks onto the board.
 */
function renderAllTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks) && currentUser.tasks.length > 0) {                
        clearTaskContainers();        
        currentUser.tasks.forEach(task => {
            renderTask(task);
            addTaskClickListener();
        });
    }
}


/**
 * Clears task containers to prepare for rendering new tasks.
 */
function clearTaskContainers() {
    const columns = document.querySelectorAll('.boardColumn');
    columns.forEach(column => {
        const taskContainer = column.querySelector('.task-container');
        taskContainer.innerHTML = '';
    });
}


/**
 * Renders a task onto the appropriate column on the board.
 * @param {Object} taskData - The data of the task to render.
 */
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


/**
 * Renders a task card element with the provided data.
 * @param {string} id - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} category - The category of the task.
 * @param {Object} assignedTo - The user(s) assigned to the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} date - The due date of the task.
 * @param {string} columnId - The ID of the column the task belongs to.
 * @returns {HTMLElement} - The task card element.
 */
function renderTaskCard(id, title, description, category, assignedTo, prio, date, columnId) {
    const taskCard = createTaskCardElement(id, title, description, category, assignedTo, prio);
    return taskCard;
}


/**
 * Creates a task card element with the provided data.
 * @param {string} id - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} category - The category of the task.
 * @param {Object} assignedTo - The user(s) assigned to the task.
 * @param {string} prio - The priority level of the task.
 * @returns {HTMLElement} - The created task card element.
 */
function createTaskCardElement(id, title, description, category, assignedTo, prio) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task');
    taskCard.setAttribute('id', id);
    const assignedToHTML = generateAssignedToHTML(assignedTo);
    const backgroundColor = determineBackgroundColor(category);
    const prioContent = determinePriorityContent(prio);
    return createTaskCardElementHTML(taskCard, backgroundColor, category, title, description, id, assignedToHTML, prioContent);
}


/**
 * Creates the HTML content for the task card element.
 * @param {HTMLElement} taskCard - The task card element.
 * @param {string} backgroundColor - The background color for the task card.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} id - The ID of the task.
 * @param {string} assignedToHTML - The HTML content for the assigned to section.
 * @param {string} prioContent - The priority content for the task.
 * @returns {HTMLElement} - The task card element with HTML content.
 */
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


/**
 * Generates the HTML content for the assigned to section of a task card.
 * @param {Object} assignedTo - The user(s) assigned to the task.
 * @returns {string} - The HTML content for the assigned to section.
 */
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


/**
 * Determines the background color for a task based on its category.
 * @param {string} category - The category of the task.
 * @returns {string} - The background color for the task card.
 */
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


/**
 * Determines the priority content based on the priority level.
 * @param {string} prio - The priority level of the task.
 * @returns {string} - The HTML content representing the priority icon.
 */
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


/**
 * Generates the HTML content for the subtasks count of a task.
 * @param {string} taskId - The ID of the task.
 * @returns {string} - The HTML content representing the subtasks count or progress bar.
 */
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


/**
 * Retrieves the task data of the current user by task ID.
 * @param {string} taskId - The ID of the task.
 * @returns {Object|null} - The task data or null if not found.
 */
function getCurrentUserTask(taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.tasks.find(task => task.id === taskId);
}


/**
 * Counts the number of checked subtasks.
 * @param {Array} subtasks - The array of subtasks.
 * @returns {number} - The count of checked subtasks.
 */
function countCheckedSubtasks(subtasks) {
    let checkedCount = 0;
    subtasks.forEach(subtask => {
      if (subtask.completed) {
        checkedCount++;
      }
    });
    return checkedCount;
}


/**
 * Calculates the progress percentage based on the number of checked subtasks.
 * @param {number} checkedCount - The count of checked subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {number} - The progress percentage.
 */
function calculateProgress(checkedCount, totalSubtasks) {
    return (checkedCount / totalSubtasks) * 100;
}


/**
 * Generates the HTML content for the progress bar container displaying subtasks count and progress.
 * @param {number} checkedCount - The count of checked subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @param {number} progress - The progress percentage.
 * @returns {string} - The HTML content representing the progress bar container.
 */
function generateProgressBarContainer(checkedCount, totalSubtasks, progress) {
    return `
      <div class="progress-bar">
          <div class="progress" style="width: ${progress}%;"></div>
      </div>
      <p class="boardRenderSubtasksCountPElement">${checkedCount}/${totalSubtasks} Subtasks</p>
    `;
}


/**
 * Renders the subtasks for a task card.
 * @param {HTMLElement} taskCard - The task card element.
 * @param {string} taskId - The ID of the task.
 * @returns {string} - The HTML content representing the subtasks.
 */
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


/**
 * Iterates over each subtask to generate HTML content and count checked subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @param {number} checkedCount - The count of checked subtasks.
 * @param {string} subtasksHTML - The HTML content representing the subtasks.
 * @param {string} taskId - The ID of the task.
 * @returns {Object} - Object containing updated checked count and subtasks HTML.
 */
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


/**
 * Retrieves the task data of the current user by task ID.
 * @param {string} taskId - The ID of the task.
 * @returns {Object|null} - The task data or null if not found.
 */
function getCurrentUserTask(taskId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.tasks.find(task => task.id === taskId);
}


/**
 * Generates the attributes for the subtask checkbox.
 * @param {Object} subtask - The subtask object.
 * @returns {Object} - Object containing checkbox attributes.
 */
function generateCheckboxAttributes(subtask) {
    const isChecked = subtask.completed ? 'checked' : '';
    const checkboxId = subtask.id;
    return { isChecked, checkboxId };
}


/**
 * Generates the HTML content for a subtask.
 * @param {Object} subtask - The subtask object.
 * @param {string} isChecked - The checked status of the checkbox.
 * @param {string} checkboxId - The ID of the checkbox.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @returns {string} - The HTML content representing the subtask.
 */
function generateSubtaskHTML(subtask, isChecked, checkboxId, taskId) {
    return `
      <div class="displayFlex">
          <div><input type="checkbox" id="${checkboxId}" ${isChecked} onclick="updateSubtaskStatus('${taskId}', '${subtask.id}', this.checked)"></div>
          <div class="renderTaskCardOverlaySubtaskTitle">${subtask.title}</div>                            
      </div>`;
}


/**
 * Appends the subtasks count element to the task card.
 * @param {HTMLElement} taskCard - The task card element.
 * @param {string} countDisplay - The display text for subtasks count.
 */
function appendCountElement(taskCard, countDisplay) {
    const countElement = document.createElement('div');
    countElement.innerHTML = countDisplay;
    taskCard.appendChild(countElement);
}


/**
 * Updates the status of a subtask and saves the changes to localStorage.
 * @param {string} taskId - The ID of the task.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {boolean} isChecked - The checked status of the subtask checkbox.
 */
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


/**
 * Renders user details like initials in a colored box.
 * @param {Object} user - The user object containing user details.
 * @returns {string} - The HTML content representing user details.
 */
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


/**
 * Saves the updated tasks data to localStorage.
 * @param {Object} currentUser - The current user object.
 */
function saveTasksToLocalStorage(currentUser) {
    if (currentUser && currentUser.tasks && Array.isArray(currentUser.tasks)) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        console.error('Invalid currentUser data in localStorage');
    }
}


/**
 * Loads tasks data from localStorage and renders tasks on the board.
 * @param {Object} currentUser - The current user object.
 */
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


/**
 * Handles the drag start event for task elements.
 * @param {Event} event - The dragstart event object.
 */
function dragStart(event) {    
    const taskId = event.target.id;
    event.dataTransfer.setData("text/plain", taskId);
}


/**
 * Handles the drag event for draggable elements.
 * @param {Event} event - The drag event object.
 */
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}


/**
 * Handles the dragover event to allow dropping elements.
 * @param {Event} event - The dragover event object.
 */
function allowDrop(event) {
    event.preventDefault();
}


/**
 * Handles the drop event when an element is dropped.
 * @param {Event} event - The drop event object.
 */
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


/**
 * Updates the column ID of a task and saves the changes to localStorage.
 * @param {string} taskId - The ID of the task.
 * @param {string} newColumnId - The new column ID.
 */
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


/**
 * Renders a task card as an overlay.
 * @param {string} id - Task ID.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} category - Task category.
 * @param {Object} assignedTo - Assigned to details.
 * @param {string} prio - Task priority.
 * @param {string} date - Task due date.
 * @param {string} columnId - Task column ID.
 * @param {Array} subtasks - Array of subtasks.
 */
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


/**
 * Renders the HTML content of a task card overlay.
 * @param {HTMLElement} card - Task card element.
 * @param {string} backgroundColor - Background color.
 * @param {string} category - Task category.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} date - Task due date.
 * @param {string} prioContent - Priority content.
 * @param {string} assignedToHTML - Assigned to HTML content.
 * @param {string} subtasksHTML - Subtasks HTML content.
 * @param {string} id - Task ID.
 */
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


/**
 * Renders the priority content for the task card overlay.
 * @param {string} prio - Task priority.
 * @param {string} prioContent - Priority content.
 * @returns {string} - Rendered priority content.
 */
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


/**
 * Renders the background color for the task card overlay based on the category.
 * @param {string} category - Task category.
 * @param {string} backgroundColor - Background color.
 * @returns {string} - Rendered background color.
 */
function renderTaskCardAsOverlayCategory(category, backgroundColor) {
    if (category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    return backgroundColor;
}


/**
 * Renders the HTML content for the assigned to section of the task card overlay.
 * @param {Object} assignedTo - Assigned to details.
 * @returns {string} - Rendered HTML content for the assigned to section.
 */
function renderTaskCardAsOverlayAssignetTo(assignedTo) {
    let assignedToHTML = '';
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
        assignedTo.userNames.forEach((userName, index) => {
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


/**
 * Adds click event listeners to task cards.
 */
function addTaskClickListener() {
    const taskCards = document.querySelectorAll('.task');
    taskCards.forEach(taskCard => {        
        taskCard.removeEventListener('click', renderTaskCardOverlay);        
        taskCard.addEventListener('click', renderTaskCardOverlay);
    });
}


/**
 * Renders the task card overlay when a task is clicked.
 * @param {Event} event - Click event.
 */
function renderTaskCardOverlay(event) {
    const taskId = event.currentTarget.id;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    const task = currentUser.tasks.find(task => task.id === taskId);
    if (task) {        
        const subtasks = task.subtasks;        
        renderTaskCardAsOverlay(task.id, task.title, task.description, task.category, task.assignedTo, task.prio, task.date, task.columnId, subtasks);
    } else {
        console.error('Task not found');
    }
}


/**
 * Closes the task card overlay.
 */
function closeOverlayBoard() {
    const overlay = document.querySelector('.boardoverlay');
    if (overlay) {
        overlay.remove();
    }
}


/**
 * Deletes a task.
 * @param {string} id - Task ID.
 */
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


/**
 * Opens an overlay to edit a task.
 * @param {string} taskId - ID of the task to be edited.
 */
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


/**
 * Renders the HTML content for editing a task.
 * @param {HTMLElement} card - Card element.
 * @param {string} backgroundColor - Background color.
 * @param {Object} task - Task object.
 * @param {string} taskId - ID of the task.
 * @param {string} assignedToHTML - HTML content for assigned to section.
 */
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


/**
 * Renders the assigned to HTML for editing a task.
 * @param {Object} task - Task object.
 * @returns {string} - Assigned to HTML content.
 */
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


/**
 * Renders the priority HTML for editing a task.
 * @param {Object} task - Task object.
 */
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


/**
 * Renders the category background color for editing a task.
 * @param {Object} task - Task object.
 * @returns {string} - Background color.
 */
function boardEditTaskCategory(task) {
    let backgroundColor = '';
    if (task.category === 'Technical Task') {
        backgroundColor = 'var(--technical-task-turquoise)';
    } else if (task.category === 'User Story') {
        backgroundColor = 'var(--user-story-blue)';
    }
    return backgroundColor;
}


/**
 * Generates the HTML options for selecting assigned contacts.
 * @param {Object} assignedTo - Assigned contacts object.
 * @param {string} taskId - ID of the task.
 * @returns {string} - HTML content for the options.
 */
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


/**
 * Toggles the visibility of the dropdown menu for selecting contacts.
 */
function boardToggleDropdownMenu() {
    const dropdown = document.getElementById('boardContactDropDownmenuID');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}


/**
 * Handles the selection of a contact and updates the assigned contacts.
 * @param {HTMLElement} contactElement - Selected contact element.
 * @param {string} taskId - ID of the task.
 */
function selectContact(contactElement, taskId) {
    contactElement.classList.toggle('selected');
    editUpdateAssignedTo(taskId);
}


/**
 * Retrieves a task from local storage based on its ID.
 * @param {string} taskId - ID of the task to retrieve.
 * @returns {Object} - Task object.
 */
function getTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('currentUser')).tasks;
    return tasks.find(task => task.id === taskId);
}


/**
 * Updates the assigned contacts for a task after editing.
 * @param {string} taskId - ID of the task.
 */
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


/**
 * Retrieves the color code for a given contact name from the contacts list.
 * @param {Array} contacts - List of contacts.
 * @param {string} contactName - Name of the contact to retrieve the color code for.
 * @returns {string} - Color code associated with the contact.
 */
function getColorCodeForContact(contacts, contactName) {
    const contact = contacts.find(contact => contact.name === contactName);
    if (contact) {
        return contact.colorCode;
    }
}


/**
 * Updates the task in local storage and backend after editing.
 * @param {string} taskId - ID of the task.
 */
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


/**
 * Collects the updated task information from the edit task form.
 * @param {string} taskId - ID of the task.
 * @returns {Object} - Object containing the task and updated information.
 */
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


/**
 * Updates the task in local storage and backend.
 * @param {string} taskId - ID of the task.
 * @param {Object} updatedTask - Updated task object.
 */
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


/**
 * Searches tasks based on the input provided in the search input field.
 */
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


/**
 * Adds a new subtask to the specified task.
 * @param {string} taskId - ID of the task to which the subtask is added.
 */
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


/**
 * Saves the new subtask to local storage, updates the backend, and redirects to edit task view.
 * @param {string} subtaskTitle - Title of the new subtask.
 * @param {Object} currentUser - Current user object.
 * @param {number} taskIndex - Index of the task in the user's tasks array.
 * @param {string} taskId - ID of the task to which the subtask is added.
 */
function addSubtaskSaveAndRedirectToBoardEditTask(subtaskTitle, currentUser, taskIndex, taskId) {
    const newSubtask = addSubtaskNewSubtask(subtaskTitle);
    currentUser.tasks[taskIndex].subtasks.push(newSubtask);
    saveTasksToLocalStorage(currentUser);
    updateCurrentUserInBackend(currentUser);
    boardEditTask(taskId);
}


/**
 * Creates a new subtask object with a random ID.
 * @param {string} subtaskTitle - Title of the new subtask.
 * @returns {Object} - New subtask object.
 */
function addSubtaskNewSubtask(subtaskTitle) {
    return {
        id: boardGenerateRandomID(),
        title: subtaskTitle,
        completed: false
    };
}


/**
 * Generates a random alphanumeric ID.
 * @returns {string} - Random alphanumeric ID.
 */
function boardGenerateRandomID() {    
    return Math.random().toString(36).substring(2, 11);
}