/**
 * Closes the category menu when the user clicks outside the menu.
 */
function closeCategoryMenu() {
    document.addEventListener('click', function (event) {
      const clickInsideInput = event.target.closest('#category-container-id');
      if (!clickInsideInput) {
        toggleVisibility('rotate-arrow-category-id', true, 'upsidedown');
        toggleVisibility('category-id', true, 'active');
      }
    });
}


/**
 * Toggles the visibility of the category container.
 */
function toggleCategoryContainer() {
    toggleSection('rotate-arrow-category-id', 'upsidedown');
    toggleSection('category-id', 'active');
}


/**
 * Handles selection of a category from the dropdown menu.
 * @param {HTMLElement} clickedElement - The clicked category element.
 */
function selectCategory(clickedElement) {
    const element = document.getElementById('category-input-id');
    const allItems = document.querySelectorAll('.category-dropdown ul li');
    allItems.forEach(item => item.classList.remove('selected-contact'));
    element.value = clickedElement.innerHTML;
    clickedElement.classList.add('selected-contact');
    toggleCategoryContainer(true);
}