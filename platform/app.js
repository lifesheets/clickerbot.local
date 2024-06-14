"use strict";

const telegramApi = require('node-telegram-bot-api');
const telegramBot = new telegramApi(process.env.TELEGRAM_TOKEN, { polling: true });

async function main() {
    const titleMessage = ['Авторизація успішна. Ласкаво просимо!', 'Реєстрація успішна. Ласкаво просимо!'];
    telegramBot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;
        const username = msg.from.username;
        try {
            let account = await db.models.accounts.findOne({ where: { telegramId } });
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Грати',
                                web_app: { url: 'https://dev-clicker.local' }
                            }
                        ]
                    ]
                }
            };
            if (account) {
                telegramBot.sendMessage(chatId, titleMessage[0], options);
            } else {
                telegramBot.sendMessage(chatId, titleMessage[1], options);
                account = await db.models.accounts.create({ telegramId, username });
            }
        } catch (error) {
            console.error('Error processing command /start:', error);
            telegramBot.sendMessage(chatId, 'Сталася помилка. Спробуйте ще раз пізніше.');
        }
    });
}

main();
