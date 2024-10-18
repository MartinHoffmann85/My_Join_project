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
    checkEmptyColumns();
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
 * Renders user details like initials in a colored box.
 * @param {Object} user - The user object containing user details.
 * @returns {string} - The HTML content representing user details.
 */
function renderUserDetails(user) {
    const colorCode = user.colorCodes && user.colorCodes.length > 0 ? user.colorCodes[0] : getRandomColorHex();
    const initials = user.userNames && user.userNames.length > 0 ? user.userNames[0].slice(0, 2) : '';
    const textColor = isColorLight(colorCode) ? "black" : "white";
    return `
      <div class="boardContactInitialsandColor" style="background-color: ${colorCode}; color: ${textColor};">
        ${initials}
      </div>
    `;
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
* Generates the HTML content for the assigned to section of a task card.
* @param {Object} assignedTo - The user(s) assigned to the task.
* @returns {string} - The HTML content for the assigned to section.
*/
function generateAssignedToHTML(assignedTo) {  
    if (assignedTo && assignedTo.userNames && assignedTo.userNames.length > 0) {
      let assignedToHTML = '';
      assignedTo.userNames.forEach((userName, index) => {
        const user = {
          userNames: [getFirstLettersOfName(userName)],
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