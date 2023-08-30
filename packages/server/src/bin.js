#!/usr/bin/env node
const { stdin, stdout } = require('process')
const path = require('path');
const { spawn } = require('child_process');
const args = [path.resolve(__dirname, './index.js')];
process.argv.slice(2).map((arg)=>{
    args.push(arg);
})
const child = spawn('node', args);
child.stdout.on('data', (data) => {
    console.log(`${data}`);
});





