"use strict";

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const app = express();
const userRoutes = require('./routes');

// Читання SSL ключів з файлів
const sslOptions = {
    key: fs.readFileSync(process.env.WEB_SSL_KEY),
    cert: fs.readFileSync(process.env.WEB_SSL_CRT)
};

async function webServer() {
    app.use(bodyParser.json());
    app.use('/api', userRoutes);

    // Використання public_html як директорії для статичних файлів
    app.use(express.static('public'));

    // Перенаправлення всіх HTTP запитів на index.html
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root: 'public' });
    });

    // Створення HTTPS сервера
    const httpsServer = https.createServer(sslOptions, app);

    // Запуск HTTPS сервера на вказаному порті та домені
    httpsServer.listen(process.env.WEB_PORT, process.env.WEB_HOST, () => {
        console.log(`Server running on https://${process.env.WEB_HOST}:${process.env.WEB_PORT}`);
    });
}

module.exports = webServer;
