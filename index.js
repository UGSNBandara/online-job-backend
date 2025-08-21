const { createServer } = require('http');
const app = require('./src/server');

module.exports = createServer(app);
