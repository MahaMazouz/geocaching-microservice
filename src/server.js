// init APM must be before any other module
const { apm } = require('./utils/apm');
const logger = require('pino')();
// import dependencies from npm
const Fastify = require('fastify');
const path = require('path');
const AutoLoad = require('fastify-autoload');
const uuidv4 = require('uuid/v4');
const cors = require('cors');
require('dotenv').config();

logger.info(
    `APM running ${process.env.ELASTIC_APM_SERVER_URL},
 APM status: ${apm.isStarted()}`,
);

// create request ids
const createRequestId = () => uuidv4();

const createServer = (options) => {
    const { logSeverity, port, host } = options;

    // create the server
    const server = Fastify({
        ignoreTrailingSlash: true,
        logger: {
            requestIdHeader: createRequestId,
            level: logSeverity,
        },
    });

    // enable cors
    server.use(cors());

    // register the plugins, routes in this case
    server.register(AutoLoad, {
        dir: path.join(__dirname, './', 'routes'),
    });

    server.listen(port, host, (err) => {
        if (err) {
            server.log.error(err);
            console.log(err);
            process.exit(1);
        }
        server.log.info('Server Started');
    });
};

module.exports = {
    createServer,
};
