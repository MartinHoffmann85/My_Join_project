async function footerInit() {    
    console.log("footerInit called");
    document.addEventListener("DOMContentLoaded", function() {
        // Funktion zum Setzen der Hintergrundfarbe des aktiven Links
        const setInitialActiveLinkColor = () => {
            const activeLinkId = localStorage.getItem('activeLinkId');
            const link1 = document.getElementById('footer-icon-boxId1');
            const link2 = document.getElementById('footer-icon-boxId2');
            const link3 = document.getElementById('footer-icon-boxId3');
            const link4 = document.getElementById('footer-icon-boxId4');

            if (activeLinkId === 'footer-icon-boxId1') {
                link1.style.backgroundColor = 'var(--focus-color-btn)';
            } else if (activeLinkId === 'footer-icon-boxId2') {
                link2.style.backgroundColor = 'var(--focus-color-btn)';
            } else if (activeLinkId === 'footer-icon-boxId3') {
                link3.style.backgroundColor = 'var(--focus-color-btn)';
            } else if (activeLinkId === 'footer-icon-boxId4') {
                link4.style.backgroundColor = 'var(--focus-color-btn)';
            }
        };

        setInitialActiveLinkColor();
    });
}



function handleLinkClick(linkId) {
    localStorage.setItem('activeLinkId', linkId);
}