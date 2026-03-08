require('dotenv').config();
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_KEY,
    Promise: Promise,
});

const getMapsPlaces = ({ query = '', country = '' }) =>
    googleMapsClient.placesAutoComplete({
        input: query,
        components: { country },
    }).asPromise();

const getReverseGeocode = ({ placeId = '' }) =>
    googleMapsClient.reverseGeocode({
        // eslint-disable-next-line camelcase
        place_id: placeId,
    }).asPromise();

const getFullAddress = async ({ query = '', country = '' }) => {
    const places = await getMapsPlaces({ query, country });
    for (let i = 0; i < places.json.predictions.length; i++) {
        const geo = await getReverseGeocode({
            placeId: places.json.predictions[i].place_id,
        },
        );
        places.json.predictions[i].geoc = geo.json.results[0];
    }
    return places;
};

module.exports = {
    getMapsPlaces,
    getReverseGeocode,
    getFullAddress,
};
