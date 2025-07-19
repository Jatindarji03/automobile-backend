// getting all the coordinates

// var NodeGeocoder = require('node-geocoder');
import node_geocoder from 'node-geocoder';


// Using callback
const getCoordinates = async (address) => {
    try {
        // console.log("Geocoder initialized with API key:", process.env.GEOLOCATION_API_KEY);
        var geocoder = node_geocoder({
            provider: 'opencage',
            apiKey: process.env.GEOLOCATION_API_KEY, // Use your actual API key here
        });
        
        const res = await geocoder.geocode(address);
        
        if (res.length > 0) {
            const coordinates = [res[0].longitude, res[0].latitude]; // array format
            // console.log(coordinates);
            return coordinates;
        }

        else {
            throw new Error('No results found for the given address.');
        }
    } catch (error) {
        throw new Error(`Error fetching coordinates: ${error.message}`);
    }
};
export default getCoordinates;



