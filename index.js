"use strict";

global.fs               = require('fs');
global.path             = require('path');
global.bcrypt           = require('bcrypt');
global.db               = require('./config/sequelize');

async function startApp() {
    try {
        await db.connect();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Error launching the program:', error.message);
        process.exit(1); 
    }
    await require('./platform/app');
}

startApp();
