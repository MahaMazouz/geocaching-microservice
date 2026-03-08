const { masterRedis, slaveRedis } = require('../utils/redis');
const { apm } = require('../utils/apm');
const { getFullAddress } = require('../adaptors/googleServiceAdaptor');
const {
    getPlaces,
    getScannedPlaces,
    setPlaces,
    deleteAll,
} = require('../adaptors/redisAdaptor');
const logger = require('pino')();
const countriesList = [
    'fr',
    'be',
    'de',
    'it',
    'lu',
    'nl',
    'pt',
    'es',
    'ch',
    'de',
    'mc',
];
const {
    scanBestFullIteration,
    scanFirstFullIteration,
} = require('../services/mapsService');
const getPlacesCtrl = async (req, res) => {
    try {
        let { query, country } = req.query;
        if (!query || !country) {
            return res.status(400).send({
                message:
                'bad request, request most include query and country fields',
                statusCode: '400',
            });
        } else {
            query = query.toLowerCase();
            country = country.toLowerCase();
            if (countriesList.indexOf(country) === -1) {
                res.status(400).send({
                    message: 'bad request, wrong country name',
                    statusCode: '400',
                });
            }
        }
        var cachedPlaces = [];
        var cachedResp = null;
        var exactQuerry = null;
        const transaction = apm.currentTransaction;
        if (slaveRedis.status === 'ready') {
            exactQuerry = await getPlaces({ query: `${country}&${query}` });
        }
        if (exactQuerry) {
            const resultJSON = JSON.parse(exactQuerry);
            transaction.name = 'redis cache';
            res.send({ source: 'Redis Cache With egality', ...resultJSON });
        } else {
            if (slaveRedis.status === 'ready') {
                cachedPlaces = await scanBestFullIteration({
                    query: `maps:${country}&${query}`,
                });
                if (cachedPlaces.length !== 0) {
                    cachedResp = await getScannedPlaces({
                        query: cachedPlaces[0],
                    });
                } else {
                    cachedPlaces = await scanFirstFullIteration({
                        query: `maps:${country}&${query}`,
                    });
                    cachedResp = await getScannedPlaces({
                        query: cachedPlaces[0],
                    });
                }
            }
        }
        if (cachedResp) {
            const resultJSON = JSON.parse(cachedResp);
            transaction.name = 'redis cache';
            res.send({ source: 'Redis Cache With Matching', ...resultJSON });
        } else {
            const googleMapsApi = await getFullAddress({ query, country });
            console.log('redis ready: ', masterRedis.status);
            if (masterRedis.status === 'ready') {
                setPlaces({
                    query: `${country}&${query}`,
                    value: JSON.stringify(googleMapsApi.json),
                });
            }
            transaction.name = 'maps api';
            res.send({ source: 'Maps API', ...googleMapsApi.json });
        }
    } catch (err) {
        logger.warn(err);
        throw err;
    }
};
const seedPlacesCtrl = async (req, res) => {
    try {
        const { body } = req;
        let { query, country } = req.query;
        if (!query || !country) {
            return res.status(400).send({
                message:
                'bad request, request most include query and country fields',
                statusCode: '400',
            });
        } else {
            query = query.toLowerCase();
            country = country.toLowerCase();
            if (countriesList.indexOf(country) === -1) {
                res.status(400).send({
                    message: 'bad request, wrong country nawme',
                    statusCode: '400',
                });
            }
        }
        if (masterRedis.status === 'ready') {
            await setPlaces({
                query: `${country}&${query}`,
                value: body.body,
            });
        }
        return res.status(200).send({
            message: 'Added Succesfully',
            statusCode: '200',
        });
    } catch (err) {
        logger.warn(err);
        throw err;
    }
};

const getCachePlacesCtrl = async (req, res) => {
    try {
        let { query, country } = req.query;
        if (!query || !country) {
            return res.status(400).send({
                message:
                'bad request, request most include query and country fields',
                statusCode: '400',
            });
        } else {
            query = query.toLowerCase();
            country = country.toLowerCase();
            if (countriesList.indexOf(country) === -1) {
                res.status(400).send({
                    message: 'bad request, wrong country name',
                    statusCode: '400',
                });
            }
        }
        var cachedPlaces = [];
        var cachedResp = null;
        var exactQuerry = null;
        const transaction = apm.currentTransaction;
        if (slaveRedis.status === 'ready') {
            exactQuerry = await getPlaces({
                query: `${country}&${query}`,
            });
        }
        if (exactQuerry) {
            const resultJSON = JSON.parse(exactQuerry);
            res.send({ source: 'Redis Cache With egality', ...resultJSON });
        } else {
            if (slaveRedis.status === 'ready') {
                cachedPlaces = await scanBestFullIteration({
                    query: `maps:${country}&${query}`,
                });
            }
            if (cachedPlaces.length !== 0) {
                cachedResp = await getScannedPlaces({ query: cachedPlaces[0] });
            } else {
                cachedPlaces = await scanFirstFullIteration({
                    query: `maps:${country}&${query}`,
                });
                cachedResp = await getScannedPlaces({ query: cachedPlaces[0] });
            }
        }
        if (cachedResp) {
            const resultJSON = JSON.parse(cachedResp);
            transaction.name = 'redis cache';
            res.send({ source: 'Redis Cache With Matching', ...resultJSON });
        } else {
            logger.warn('Error');
            res.send({ Status: ' Not Found' });
        }
    } catch (err) {
        logger.warn(err);
        throw err;
    }
};

const tes = (req, res) => {
    console.log(req.query.query);
    res.send(req.query);
};

const getPlacesNoCacheCtrl = async (req, res) => {
    try {
        let { query, country } = req.query;
        if (!query || !country) {
            return res.status(400).send({
                message: 'bad request',
                statusCode: '400',
            });
        } else {
            query = query.toLowerCase();
            country = country.toLowerCase();
        }
        const transaction = apm.currentTransaction;
        transaction.name = 'no cache';
        const googleMapsApi = await getFullAddress({ query, country });
        res.send({ source: 'Maps API no cache', ...googleMapsApi.json });
    } catch (err) {
        logger.warn(err);
        throw err;
    }
};

const deleteDB = async (req, res) => {
    try {
        deleteAll();
    } catch (err) {
        logger.warn(err);
        throw err;
    } finally {
        res.send({ message: 'Ok', status: '200' });
    }
};

module.exports = {
    getPlacesCtrl,
    getPlacesNoCacheCtrl,
    getCachePlacesCtrl,
    tes,
    deleteDB,
    seedPlacesCtrl,
};
