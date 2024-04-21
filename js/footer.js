function footerInit() {    
    console.log("footerInit called");
    document.addEventListener("DOMContentLoaded", function() {
        // Funktion zum Setzen der Hintergrundfarbe des aktiven Links
        const setInitialActiveLinkColor = () => {
            const activeLinkId = localStorage.getItem('activeLinkId');
            const link1 = document.getElementById('footer-icon-boxId1');
            const link2 = document.getElementById('footer-icon-boxId2');
            const link3 = document.getElementById('footer-icon-boxId3');
            const link4 = document.getElementById('footer-icon-boxId4');

            // Entfernen der ":hover" Klasse von allen Link-Boxen
            link1.classList.remove('footer-icon-box-hover');
            link2.classList.remove('footer-icon-box-hover');
            link3.classList.remove('footer-icon-box-hover');
            link4.classList.remove('footer-icon-box-hover');

            // Hinzufügen der ":hover" Klasse zum aktiven Link
            if (activeLinkId === 'footer-icon-boxId1') {
                link1.classList.add('footer-icon-box-hover');
            } else if (activeLinkId === 'footer-icon-boxId2') {
                link2.classList.add('footer-icon-box-hover');
            } else if (activeLinkId === 'footer-icon-boxId3') {
                link3.classList.add('footer-icon-box-hover');
            } else if (activeLinkId === 'footer-icon-boxId4') {
                link4.classList.add('footer-icon-box-hover');
            }
        };

        setInitialActiveLinkColor();
    });
}



function handleLinkClick(linkId) {
    localStorage.setItem('activeLinkId', linkId);
}