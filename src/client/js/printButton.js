// Print Button

export function printButton() {

    // Print Area
    const formOutput = Client.document.querySelector('.print-area').innerHTML;

    // Original Window Body
    const originalWindowBody =  Client.document.body.innerHTML;

    // Execute Original Window Body = Print Area
    Client.document.body.innerHTML = formOutput;

    // Print Function
    window.print();

    // Return to Original Window Body
    Client.document.body.innerHTML = originalWindowBody;

}