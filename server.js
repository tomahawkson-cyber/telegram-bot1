const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// توکن ربات شما
const token = '74093551:AAEFqTLmb8EbJPHIt4WRYc3DfMLRXNiKbrQ';
const bot = new TelegramBot(token, { polling: false });

// لیست شماره‌های مجاز
const authorizedNumbers = {
    '+989149083511': 'رامین',
    '+989151234567': 'فاطمه',
    '+989391234567': 'احمد'
};

// میدلور برای پارس کردن JSON
app.use(express.json());

// صفحه اصلی برای تست
app.get('/', (req, res) => {
    res.send('🤖 ربات تلگرام فعال است!');
});

// تنظیم وب‌هوک
app.get('/setwebhook', async (req, res) => {
    try {
        const webhookUrl = `https://${req.get('host')}/webhook`;
        await bot.setWebHook(webhookUrl);
        res.send(`✅ وب‌هوک تنظیم شد: ${webhookUrl}`);
    } catch (error) {
        res.send(`❌ خطا در تنظیم وب‌هوک: ${error.message}`);
    }
});

// دریافت پیام از تلگرام
app.post('/webhook', (req, res) => {
    console.log('📨 دریافت پیام از تلگرام');
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// دستور /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`👤 کاربر /start فرستاد: ${chatId}`);
    
    const keyboard = {
        keyboard: [[{
            text: '📱 اشتراک گذاری شماره تلفن',
            request_contact: true
        }]],
        resize_keyboard: true,
        one_time_keyboard: true
    };
    
    const text = '🤖 به ربات خوش آمدید!\n\nلطفا شماره تلفن خود را به اشتراک بگذارید:';
    
    bot.sendMessage(chatId, text, {
        reply_markup: keyboard
    });
});

// دریافت شماره تلفن
bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const phone = msg.contact.phone_number;
    
    console.log(`📞 شماره دریافت شد: ${phone}`);
    
    const normalizedPhone = normalizePhone(phone);
    console.log(`🔧 شماره نرمال شده: ${normalizedPhone}`);
    
    if (authorizedNumbers[normalizedPhone]) {
        const name = authorizedNumbers[normalizedPhone];
        bot.sendMessage(chatId, `✅ ${name} عزیز، خوش آمدید!`);
        console.log(`✅ کاربر مجاز: ${name}`);
    } else {
        bot.sendMessage(chatId, '❌ شما مجاز به استفاده از این ربات نیستید.');
        console.log(`❌ کاربر غیرمجاز: ${normalizedPhone}`);
    }
});

// نرمال‌سازی شماره تلفن
function normalizePhone(phone) {
    // حذف فاصله و کاراکترهای خاص
    let normalized = phone.replace(/[^0-9+]/g, '');
    
    // نرمال‌سازی شماره ایرانی
    if (normalized.startsWith('0')) {
        normalized = '+98' + normalized.substring(1);
    } else if (normalized.startsWith('9') && !normalized.startsWith('+')) {
        normalized = '+98' + normalized;
    }
    
    return normalized;
}

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`🚀 سرور اجرا شد روی پورت ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
});
