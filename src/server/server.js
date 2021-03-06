// Bring window.fetch to Node.js
const fetch = require('node-fetch');
// import { fetch } from 'node-fetch';

// Main Server Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Dotenv Package (to setup environment variables)
const dotenv = require('dotenv');
dotenv.config();


// App instance
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));


// Server Setup and Routes
const port = 8081;

app.listen(port, function () {
    console.log(`Congratulations, your server is running at port ${port}!`);
});

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});


// Server Test and Troubleshooting
const mockAPIResponse = require('./mockAPI.js');

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
});

// app.get('/all-apis', function (req, res) {
//     res.send(mockAPIResponse)
// });

// APIs
app.post('/all-apis', (req, res) => {
// User Inp ut Variable
console.log("ssssssssssssss");
    let appInputData = {
        input: req.body
    };

    // Log: User Location Input
    console.log(`user destination input: ${req.body.destinationInput}`);

    // Geonames API Variable
    const geonamesAPI = (`http://api.geonames.org/searchJSON?name=${req.body.destinationInput}&maxRows=1&username=mostafa_egbarea147`);

    // Get Geonames Data
    fetch (geonamesAPI)
    .then (res => res.json())
    .then (geonamesData => {

        // Validation: Location
        if (geonamesData.geonames[0] == null) {
            res.status(404).json({locValidation: 'Invalid location name, please re-enter.'});
            return;
        }

        // Weatherbit API Variable
        const weatherbitAPI = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${geonamesData.geonames[0].lat}&lon=${geonamesData.geonames[0].lng}&key=7fdd9f3a99f74f68ab8881f7796ac84f`;

        // Get Weatherbit Data
        fetch (weatherbitAPI)
        .then (res => res.json())
        .then (weatherbitData => {

            // Pixabay Dynamic Data API Variable
            const pixabayAPI = `https://pixabay.com/api/?key=25097269-5f7653113c567f5faad2e6cc4&q=${req.body.destinationInput}&image_type=photo&editors_choice=true&per_page=3`;

            // Get Pixabay Dynamic Data
            fetch (pixabayAPI)
            .then (res => res.json())
            .then (pixabayData => {

                // Pixabay Default Data API Variable
                const pixabayDefaultAPI = `https://pixabay.com/api/?key=25097269-5f7653113c567f5faad2e6cc4&q=travel&image_type=photo&editors_choice=true&per_page=3`;

                // Get Pixabay Default Data
                fetch (pixabayDefaultAPI)
                .then (res => res.json())
                .then (pixabayDefaultData => {

                    // Sent All Data
                    res.send({appInputData, geonamesData, weatherbitData, pixabayData, pixabayDefaultData});
                })
            })
        })
    })

    .catch (err => {
        res.send(err);
    });
});