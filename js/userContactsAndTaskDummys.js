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
 * Adds a set of default contacts to a newly registered user.
 * Each default contact is cloned from the `defaultContacts` array,
 * with a unique ID generated for each contact.
 * @param {Object} user - The newly registered user to whom the default contacts will be added.
 * @param {string} user.name - The user's name.
 * @param {string} user.email - The user's email address.
 * @param {Array<Object>} [user.contacts] - An optional array of the user's existing contacts.
 */
function addDefaultContactsToUser(user) {
    const userDefaultContacts = defaultContacts.map(contact => ({
        ...contact,
        id: generateRandomID()
    }));
    user.contacts = userDefaultContacts;
}