const Redis = require('ioredis');
require('dotenv').config();
const logger = require('pino')();

const {
    // master redis config
    MASTER_REDIS_CONNECTION_NAME,
    MASTER_REDIS_PORT,
    MASTER_REDIS_HOST,
    MASTER_REDIS_PASSWORD,
    MASTER_REDIS_DB,

    // slave redis config
    SLAVE_REDIS_CONNECTION_NAME,
    SLAVE_REDIS_PORT,
    SLAVE_REDIS_HOST,
    SLAVE_REDIS_PASSWORD,
    SLAVE_REDIS_DB,
} = process.env;

const redisMasterConfig = {
    name: MASTER_REDIS_CONNECTION_NAME,
    port: MASTER_REDIS_PORT,
    host: MASTER_REDIS_HOST,
    password: MASTER_REDIS_PASSWORD,
    db: MASTER_REDIS_DB,
};

const redisSlaveConfig = {
    name: SLAVE_REDIS_CONNECTION_NAME,
    port: SLAVE_REDIS_PORT,
    host: SLAVE_REDIS_HOST,
    password: SLAVE_REDIS_PASSWORD,
    db: SLAVE_REDIS_DB,
};

const masterRedis = new Redis({ ...redisMasterConfig });
const slaveRedis = new Redis({ ...redisSlaveConfig });

slaveRedis.on('connect', () => {
    logger.info('Connected to Redis ' + process.pid);
});

slaveRedis.on('error', (err) => {
    logger.info('Error connecting to Redis ' + process.pid);
    logger.info('error to Redis ' + err);
});

masterRedis.on('connect', () => {
    logger.info('Connected to Redis ' + process.pid);
});

masterRedis.on('error', (err) => {
    logger.info('Error connecting to Redis ' + process.pid);
    logger.info('error to Redis ' + err);
});

module.exports = {
    masterRedis,
    slaveRedis,
};
