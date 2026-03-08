const server = require('./server');
require('dotenv').config();
console.info('env values: ', process.env);

const serverOptions = {
    logSeverity: process.env.LOG_SEVERITY,
    port: process.env.APP_PORT,
    host: process.env.APP_HOST,
};

server.createServer(serverOptions);
