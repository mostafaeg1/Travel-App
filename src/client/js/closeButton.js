// Close Button

export function closeButton() {

    Client.document.body.scrollTop = 0; // Safari
    Client.document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera

    const outputOuter = Client.document.querySelector('.print-area');
    const closeButton = Client.document.querySelector('.buttons');

    outputOuter.style.display = 'none';
    closeButton.style.display = 'none';

}