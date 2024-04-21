function footerInit() {
    setInitialActiveLinkColor();
}


function setInitialActiveLinkColor() {
    const { activeLinkId, link1, link2, link3, link4 } = setInitialActiveLinkColorVariables();
    if (activeLinkId === 'footer-icon-boxId1') {
        link1.classList.add('footer-icon-box-hover');
    } else if (activeLinkId === 'footer-icon-boxId2') {
        link2.classList.add('footer-icon-box-hover');
    } else if (activeLinkId === 'footer-icon-boxId3') {
        link3.classList.add('footer-icon-box-hover');
    } else if (activeLinkId === 'footer-icon-boxId4') {
        link4.classList.add('footer-icon-box-hover');
    }
}


function setInitialActiveLinkColorVariables() {
    const activeLinkId = localStorage.getItem('activeLinkId');
    const link1 = document.getElementById('footer-icon-boxId1');
    const link2 = document.getElementById('footer-icon-boxId2');
    const link3 = document.getElementById('footer-icon-boxId3');
    const link4 = document.getElementById('footer-icon-boxId4');
    link1.classList.remove('footer-icon-box-hover');
    link2.classList.remove('footer-icon-box-hover');
    link3.classList.remove('footer-icon-box-hover');
    link4.classList.remove('footer-icon-box-hover');
    return { activeLinkId, link1, link2, link3, link4 };
}


function handleLinkClick(linkId) {
    localStorage.setItem('activeLinkId', linkId);
}


function resetActiveLinkId() {
    const linkId = "";
    localStorage.setItem('activeLinkId', linkId);
}


function setActiveLinkId() {
    const linkId = "footer-icon-boxId1";
    localStorage.setItem('activeLinkId', linkId);
}