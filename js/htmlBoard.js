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
        <div class="boardDropdown">
            <button class="boardDropdown-toggle" onclick="toggleBoardDropdown(event, '${id}')">
                <img src="./assets/svg/arrow_drop_down.svg" alt="Toggle Dropdown" />
            </button>
            <div class="boardDropdown-menu" id="dropdown-menu-${id}">
                <ul>
                    <li onclick="handleDropdownOptionClick(event, '${id}', 'todo')">To Do</li>
                    <li onclick="handleDropdownOptionClick(event, '${id}', 'inprogress')">In Progress</li>
                    <li onclick="handleDropdownOptionClick(event, '${id}', 'awaitfeedback')">Await Feedback</li>
                    <li onclick="handleDropdownOptionClick(event, '${id}', 'done')">Done</li>
                </ul>
            </div>
        </div>
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
        <div class="renderTaskTitleOverlay">${title}</div>
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
                <textarea class="boardEditTaskOverlayTitleInput" id="editTitle">${tempTitle || task.title}</textarea>
            </div>
            <div class="renderTaskDescriptionOverlay">
                <p>Description:</p>
                <textarea class="boardTextAreaStyle" id="editDescription">${tempDescription || task.description}</textarea>
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
                <span class="contactsContentRightSideEditButton" onclick="boardEditTaskUpdate('${taskId}')">
                    <img src="./assets/svg/check.svg" alt="check" />
                    Save
                </span>
                <img class="contactsContentRightSideDeleteButton" src="./assets/img/contacts/DeleteContactButtonDesktop.svg" alt="" onclick="deleteTask('${taskId}')">
            </div>
        `;
}