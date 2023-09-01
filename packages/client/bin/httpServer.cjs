#!/usr/bin/env node
'use strict';

const { createServer } = require("http-server");
const os = require('os');
const ifaces = os.networkInterfaces();
const chalk = require('chalk')
const port = process.env.PORT || 80;
const protocol = 'http://';
const server = createServer({root:path.resolve(__dirname, '../dist')});
const logger = {
    info: console.log
};
server.listen(port, "0.0.0.0", function () {
    logger.info(chalk.yellow('\nvailable on:'));
    Object.keys(ifaces).forEach(function (dev) {
        ifaces[dev].forEach(function (details) {
            if (details.family === 'IPv4') {
                logger.info(('  ' + protocol + details.address + ':' + chalk.green(port.toString())));
            }
        });
    });
})

if (process.platform === 'win32') {
    require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    }).on('SIGINT', function () {
        process.emit('SIGINT');
    });
}

process.on('SIGINT', function () {
    logger.info(chalk.red('server stopped.'));
    process.exit();
});

process.on('SIGTERM', function () {
    logger.info(chalk.red('server stopped.'));
    process.exit();
});