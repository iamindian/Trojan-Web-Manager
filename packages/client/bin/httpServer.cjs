#!/usr/bin/env node
'use strict';
const logger = {
    info: console.log
};
const path = require("path");
const { createServer } = require("http-server");
const os = require('os');
const ifaces = os.networkInterfaces();
const chalk = require('chalk')
const port = process.env.PORT || 80;
const host = process.env.HOST || "127.0.0.1";
const protocol = 'http://';
const server = createServer({root:path.join(__dirname, '..','dist')});
logger.info(path.join(__dirname, '..','dist'));
server.listen(port, host, function () {
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