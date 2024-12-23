const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Укажите ваш токен
const token = '7940085993:AAGqET3bNPwELLlIfVE0H-A2fxpWbZi70Ls';

const kitsuBaseUrl = 'https://kitsu.io/api/edge/anime';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/anime (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const animeName = match[1];

    try {
        // Исправлено: используем правильный параметр filter[text]
        const response = await axios.get(`${kitsuBaseUrl}?filter[text]=${encodeURIComponent(animeName)}`);
        const animeList = response.data.data;

        if (!animeList || animeList.length === 0) {
            bot.sendMessage(chatId, 'No anime found with that name. Please try another search.');
            return;
        }

        // Берём первое аниме из списка
        const animeData = animeList[0];
        const title = animeData.attributes.titles.en || animeData.attributes.titles.en_jp || 'N/A';
        const synopsis = animeData.attributes.synopsis || 'N/A';
        const rating = animeData.attributes.averageRating || 'N/A';

        bot.sendMessage(chatId, `Title: ${title}\nRating: ${rating}\nSynopsis: ${synopsis}`);
    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        bot.sendMessage(chatId, 'Error fetching anime details. Please try again later.');
    }
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to AnimeBot. Send /anime followed by the name of the anime to get details.');
});
