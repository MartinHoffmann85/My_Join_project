/**
 * A list of default contacts that will be added to a new user.
 * Each contact includes a name, email, phone number, a color code for display, 
 * and a text color code.
 * @type {Array<Object>}
 * @property {string} name - The name of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {string} colorCode - The color code used for representing the contact in the UI.
 * @property {string} textColorCode - The text color code for displaying the contact's name.
 */
const defaultContacts = [
    {
      name: "Anja Scholz",
      email: "anja@scholz.de",
      phone: "63634634",
      colorCode: "#d71988",
      textColorCode: "black",
    },
    {
      name: "Benedikt Ziegler",
      email: "Benedikt@ziegler.de",
      phone: "658984613843",
      colorCode: "#b536ee",
      textColorCode: "black",
    },
    {
      name: "David Eisenberg",
      email: "david@eisenberg.de",
      phone: "5684335846414",
      colorCode: "#329250",
      textColorCode: "black",
    },
    {
      name: "Frieda Krämer",
      email: "frieda@kraemer.de",
      phone: "565489461684",
      colorCode: "#d0effd",
      textColorCode: "white",
    },
    {
      name: "Marcel Bauer",
      email: "marcel@bauer.de",
      phone: "8745685467568",
      colorCode: "#8a41a1",
      textColorCode: "black",
    },
    {
      name: "Raja Müller",
      email: "raja@mueller.de",
      phone: "54598434185741",
      colorCode: "#bbf5cd",
      textColorCode: "white",
    },
    {
      name: "Sabiene Klau",
      email: "sabiene@klau.de",
      phone: "168664631316516",
      colorCode: "#62aa65",
      textColorCode: "white",
    },
    {
      name: "Tanja Gabel",
      email: "tanja@gabel.de",
      phone: "6544646164646",
      colorCode: "#548552",
      textColorCode: "black",
    },
    {
      name: "Xenia Somey",
      email: "xenia@somey.de",
      phone: "9843135164646451",
      colorCode: "#6f777e",
      textColorCode: "black",
    }
];


/**
 * Generates default tasks for a newly registered user.
 * The tasks are automatically assigned to the user's created contacts,
 * and each task's `assignedTo` includes colorCodes, initials, textColor, and userNames.
 * 
 * @param {Array<Object>} contacts - Array of contact objects to assign tasks to.
 * @returns {Array<Object>} - Array of task objects.
 */
function generateDefaultTasks(contacts) {
  const contactDetails = contacts.map(contact => ({
      userName: contact.name,
      colorCode: contact.colorCode,
      textColorCode: contact.textColorCode,
      initials: contact.name.split(' ').map(part => part[0]).join('')
  }));
  const tasks = [
      {
          id: generateRandomID(),
          title: "Task 1: Welcome",
          description: "Welcome to the system. Here's your first task.",
          assignedTo: {
              userNames: [contactDetails[0].userName],
              colorCodes: [contactDetails[0].colorCode],
              textColor: [contactDetails[0].textColorCode],
              initials: [contactDetails[0].initials]
          },
          prio: "urgent",
          category: "User Story",
          columnId: "todo",
          date: new Date().toISOString().split('T')[0],
          subtasks: []
      },
      {
          id: generateRandomID(),
          title: "Task 2: Setup Profile",
          description: "Please complete your profile information.",
          assignedTo: {
              userNames: [contactDetails[1].userName],
              colorCodes: [contactDetails[1].colorCode],
              textColor: [contactDetails[1].textColorCode],
              initials: [contactDetails[1].initials]
          },
          prio: "urgent",
          category: "Technical Task",
          columnId: "todo",
          date: new Date().toISOString().split('T')[0],
          subtasks: []
      },
      {
          id: generateRandomID(),
          title: "Task 3: Learn System",
          description: "Go through the introduction materials.",
          assignedTo: {
              userNames: [contactDetails[2].userName],
              colorCodes: [contactDetails[2].colorCode],
              textColor: [contactDetails[2].textColorCode],
              initials: [contactDetails[2].initials]
          },
          prio: "low",
          category: "User Story",
          columnId: "inprogress",
          date: new Date().toISOString().split('T')[0],
          subtasks: []
      },
      {
          id: generateRandomID(),
          title: "Task 4: Explore Features",
          description: "Familiarize yourself with key features of the system.",
          assignedTo: {
              userNames: [contactDetails[3].userName],
              colorCodes: [contactDetails[3].colorCode],
              textColor: [contactDetails[3].textColorCode],
              initials: [contactDetails[3].initials]
          },
          prio: "medium",
          category: "Technical Task",
          columnId: "inprogress",
          date: new Date().toISOString().split('T')[0],
          subtasks: []
      },
      {
          id: generateRandomID(),
          title: "Task 5: First Interaction",
          description: "Interact with another user or team member.",
          assignedTo: {
              userNames: [contactDetails[4].userName],
              colorCodes: [contactDetails[4].colorCode],
              textColor: [contactDetails[4].textColorCode],
              initials: [contactDetails[4].initials]
          },
          prio: "medium",
          category: "User Story",
          columnId: "awaitfeedback",
          date: new Date().toISOString().split('T')[0],
          subtasks: []
      },
      {
          id: generateRandomID(),
          title: "Task 6: Submit Feedback",
          description: "Submit feedback on your first experience.",
          assignedTo: {
              userNames: [contactDetails[5].userName],
              colorCodes: [contactDetails[5].colorCode],
              textColor: [contactDetails[5].textColorCode],
              initials: [contactDetails[5].initials]
          },
          prio: "low",
          category: "Technical Task",
          columnId: "done",
          date: new Date().toISOString().split('T')[0],
          subtasks: []
      }
  ];
  return tasks;
}


/**
 * Adds default contacts and tasks to a newly registered user.
 * @param {Object} user - The newly registered user.
 */
function addDefaultContactsAndTasksToUser(user) {
  const userDefaultContacts = defaultContacts.map(contact => ({
      ...contact,
      id: generateRandomID()
  }));
  user.contacts = userDefaultContacts;
  const userTasks = generateDefaultTasks(userDefaultContacts);
  user.tasks = userTasks;
}