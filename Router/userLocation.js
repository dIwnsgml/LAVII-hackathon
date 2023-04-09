const fetch = require('node-fetch');

// Replace YOUR_API_KEY with your Google Cloud Platform API key.
const apiKey = 'YOUR_API_KEY';

// Define the URL for the Places API request.
const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.7749,-122.4194&radius=5000&type=restaurant&key=${apiKey}`;

// Retrieve the user's place search results.
fetch(placesUrl)
  .then(response => response.json())
  .then(data => {
    // Do something with the place search results.
    console.log(data.results);
  })
  .catch(error => console.error(error));