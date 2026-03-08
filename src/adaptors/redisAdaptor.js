require('dotenv').config();
const { masterRedis, slaveRedis } = require('../utils/redis');
const { globSanitizer } = require('../utils/sanitizer');

const getPlaces = ({ query = '' }) => slaveRedis.get(`maps:${query}`);

const getScannedPlaces = ({ query = '' }) => {
    console.log(query); return slaveRedis.get(query);
};

const scanPlaces = ({ query = '', cursor = 0 }) =>
    slaveRedis.scan(
        cursor, 'MATCH', `*${globSanitizer({ query })}*`, 'COUNT', 1000,
    );

const setPlaces = ({ query = '', value = '' }) =>
    masterRedis.set(
        `maps:${query}`,
        value,
        'EX',
        process.env.REDIS_EXPIRE_TIME,
    );

const deleteAll = () => masterRedis.flushall();

module.exports = {
    getPlaces,
    setPlaces,
    scanPlaces,
    getScannedPlaces,
    deleteAll,
};
