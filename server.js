const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const token = '74093551:AAEFqTLmb8EbJPHIt4WRYc3DfMLRXNiKbrQ';
const bot = new TelegramBot(token, { polling: false });

const authorizedNumbers = {
    '+989149083511': 'رامین',
    '+989151234567': 'فاطمه', 
    '+989391234567': 'احمد'
};

app.use(express.json());

// صفحه اصلی
app.get('/', (req, res) => {
    res.send('🤖 ربات تلگرام فعال است!');
});

// تنظیم وب‌هوک
app.listen(PORT, async () => {
    console.log(`🚀 سرور اجرا شد روی پورت ${PORT}`);
    
    try {
        const webhookUrl = `https://your-app-name.onrender.com/webhook`;
        await bot.setWebHook(webhookUrl);
        console.log('✅ وب‌هوک تنظیم شد:', webhookUrl);
    } catch (error) {
        console.error('❌ خطا در وب‌هوک:', error);
    }
});

// دریافت پیام از تلگرام
app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// پردازش /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        keyboard: [[{
            text: '📱 اشتراک گذاری شماره',
            request_contact: true
        }]],
        resize_keyboard: true
    };
    
    bot.sendMessage(chatId, '🤖 به ربات خوش آمدید!\nلطفا شماره خود را به اشتراک بگذارید:', {
        reply_markup: keyboard
    });
});

// پردازش شماره تلفن
bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const phone = normalizePhone(msg.contact.phone_number);
    
    if (authorizedNumbers[phone]) {
        bot.sendMessage(chatId, `✅ ${authorizedNumbers[phone]} عزیز، خوش آمدید!`);
    } else {
        bot.sendMessage(chatId, '❌ شما مجاز به استفاده نیستید.');
    }
});

function normalizePhone(phone) {
    phone = phone.replace(/[^0-9+]/g, '');
    if (phone.startsWith('0')) return '+98' + phone.substring(1);
    if (phone.startsWith('9')) return '+98' + phone;
    return phone;
}