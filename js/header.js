/**
 * Toggles the visibility of a dropdown menu.
 */
function toggleDropdown() {
  let dropdown = document.getElementById("dropdown");
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
      dropdown.style.display = "block";
  } else {
      dropdown.style.display = "none";
  }
}


/**
* Closes the dropdown menu when clicking outside of it.
* @param {Event} event - The click event.
*/
document.addEventListener("click", function(event) {
  let headerProfilContainer = document.getElementById("headerProfilID");
  let dropdown = document.getElementById("dropdown");
  let targetElement = event.target;
  if (!headerProfilContainer.contains(targetElement)) {    
      if (dropdown.style.display === "block") {    
          dropdown.style.display = "none";
      }
  }
});