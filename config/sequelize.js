"use strict";

/**
 * @Name Підключення до ORM Sequelize для MySQL.
 * @description Модуль для підтримки активних та відкладених завантажень.
 * @support https://sequelize.org/docs/v6/
 * @author Mykola Dovhopol (ua.lifesheets).
 * @copyright Copyright (C) 2024 ProfiWM.com.ua
 */

require('dotenv').config();
const Sequelize     = require('sequelize');
const models        = {};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIAL,
    port: process.env.DB_PORT,
    logging: false,
    pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions: {
        timezone: '+03:00',
        connectTimeout: 60000,
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false,
        freezeTableName: true,
    },
});

async function connect() {
    try {
        await sequelize.authenticate();
        await loadModels();
    } catch (error) {
        console.error(`${'\x1b[31m'}[ERROR]${'\x1b[35m'} Не вдалося підключитися до бази даних:${'\x1b[0m'}`, error.message);
        process.exit(1);
    }
}

async function loadModels() {
    const modelsDir = path.resolve(__dirname, '..', 'database', 'migrations');
    
    if (!fs.existsSync(modelsDir)) {
        console.error(`${'\x1b[31m'}[ERROR]${'\x1b[35m'} Директорія моделей не існує: ${modelsDir}${'\x1b[0m'}`);
    }

    const files = fs.readdirSync(modelsDir);

    for (const file of files) {
        const modelPath = path.join(modelsDir, file);
        if (path.extname(file) === '.js') {
            const model = require(modelPath)(sequelize, Sequelize.DataTypes);
            models[model.name] = model;
            console.log(`${'\x1b[32m'}[DONE]${'\x1b[0m'} Модель завантажена: ${model.name}`);
        } else {
            console.warn(`${'\x1b[33m'}[WARNING]${'\x1b[0m'} Файл не є моделлю: ${file}`);
        }
    }
       
    for (const name in models) {
        if (models[name].associate) {
            models[name].associate(models);
            console.log(`${'\x1b[32m'}[DONE]${'\x1b[0m'} Асоціації для моделі: ${name} встановлені.`);
        }
    }
    
    try {
        await sequelize.sync({ force: false });
        console.log(`${'\x1b[32m'}[DONE]${'\x1b[0m'} Моделі синхронізовані та таблиці створені, якщо їх ще не було.`);
    } catch (syncError) {
        console.error(`${'\x1b[31m'}[ERROR]${'\x1b[35m'} Помилка синхронізації моделей:${'\x1b[0m'}`, syncError.message);
    }
}
    
module.exports = { sequelize, models, connect };
