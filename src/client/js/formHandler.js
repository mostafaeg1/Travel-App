// Generate Button

const handleSubmit = document.querySelector('.generate-button');

handleSubmit.addEventListener('click', () => {

    event.preventDefault();


    // Form Input Variables

    let departDateInput = document.querySelector('#depart-date-input').value;
    let returnDateInput = document.querySelector('#return-date-input').value;
    let destinationInput = document.querySelector('#destination-input').value;
    let remarksInput = document.querySelector('#remarks-input').value;


    // Day Difference Variarbles

    let dayDiff = Client.dayDiffCheck(Client.currentDate(), departDateInput);
    let tripDay = Client.dayDiffCheck(departDateInput, returnDateInput);


    // Validation - Required Input Fields

    if (departDateInput.length === 0 || returnDateInput.length === 0 || destinationInput.length === 0) {
        alert('Date and destination fields are required.');
        return;
    }


    // Validation - Minimum Date

    else if (Client.minDate(departDateInput) !== true || Client.minDate(returnDateInput) !== true) {
        alert('The minimum date is today.');
        return;
    }


    // Post Basic Validations - Processing Message

    const processMsg = document.querySelector('.process-message');
    processMsg.innerHTML = 'processing...';


    // Fetch APIs

    fetch ('http://localhost:8081/all-apis', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({destinationInput, remarksInput}) // Convert the input data of destination and remarks into a string for server
    })

    .then (res => {
        return res.json()
    })

    .then (data => {


        // Validation - Location Input

        if (data.locValidation != null) {
            alert(data.locValidation);
            console.log(`*** ${data.locValidation} ***`);
            processMsg.innerHTML = '';
            return;
        }

        else {

            // All API Data Log

            console.log(data);


            // Output/Close/Print Button Pop Up + Processing Message Wiper

            const outputOuter = document.querySelector('.print-area');
            const closeButton = document.querySelector('.buttons');

            outputOuter.style.display = 'block';
            closeButton.style.display = 'flex';
            processMsg.innerHTML = '';


            // Output Header Background Image (Default and Dynamic)

            let destinationMeta = document.querySelector('.destination-meta');

            if (data.pixabayData.hits[0] != null) {
                destinationMeta.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                url("${data.pixabayData.hits[0].webformatURL}")`;
            } else {
                destinationMeta.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                url("${data.pixabayDefaultData.hits[0].webformatURL}")`;
            }


            // Destination Name
            document.querySelector('#destination-name').innerHTML = `${data.geonamesData.geonames[0].toponymName}`;

            // Country Name
            document.querySelector('#country-name').innerHTML = `${data.geonamesData.geonames[0].countryName}`;

            // Country Code
            document.querySelector('#country-code').innerHTML = `${data.geonamesData.geonames[0].countryCode}`;

            // Time Zone
            document.querySelector('#time-zone').innerHTML = `${data.weatherbitData.timezone}`;

            // Population
            document.querySelector('#population').innerHTML = `${data.geonamesData.geonames[0].population}`;

            // Destination Description
            document.querySelector('#destination-description').innerHTML = `${data.geonamesData.geonames[0].fcodeName}`;

            // Number of Trip Day
            document.querySelector('.trip-day').innerHTML = `<div id="counter">${tripDay}</div><div id="counter-text">day trip</div>`;

            // Departure Date
            document.querySelector('#depart-date').innerHTML = `${departDateInput}`;

            // Return Date
            document.querySelector('#return-date').innerHTML = `${returnDateInput}`;


            // Weather Info Card

            const weatherWrapper = document.querySelector('.weather-wrapper');
            weatherWrapper.innerHTML = '';

            if (dayDiff > 15) {

                weatherWrapper.innerHTML = `<div class='weather-message'>Weather forecast info is only available for 15 days from the current date.</div>`

            } else {

                for (let i = dayDiff; i < data.weatherbitData.data.length - 1; i++) {

                const weatherCard = document.createElement('div');
                weatherCard.className = "weather-card";

                weatherCard.insertAdjacentHTML('afterbegin', `
                    <img src="img/weatherbit-weather-icons/${data.weatherbitData.data[i].weather.icon}.png" alt="weather icon">
                    <div class="temp-wrapper">
                        <span id="temp-high" class="temp">${data.weatherbitData.data[i].high_temp}°C</span>
                        <i class="material-icons">import_export</i>
                        <span id="temp-low" class="temp">${data.weatherbitData.data[i].low_temp}°C</span>
                        <div id="temp-date" class="temp-date">${data.weatherbitData.data[i].datetime}</div>
                    </div>
                `);

                weatherWrapper.append(weatherCard);
                }
            }


            // Remarks

            if (remarksInput.length === 0) {
                document.querySelector('#remarks').innerHTML = 'You have no travel remarks.';
            } else {
                document.querySelector('#remarks').innerHTML = `${remarksInput}`;
            }


            // Successful message Log

            console.log('*** Sucessful form input and output. ***');
        }
    })
})

module.exports = handleSubmit;