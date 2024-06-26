"use strict";

global.fs               = require('fs');
global.path             = require('path');
global.bcrypt           = require('bcrypt');
global.db               = require('./config/sequelize');

const webServer         = require('./platform/system/domain');

async function startApp() {
    try {
        await db.connect();
        await webServer();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Error launching the program:', error.message);
        process.exit(1); 
    }
    await require('./platform/app');
}

startApp();
