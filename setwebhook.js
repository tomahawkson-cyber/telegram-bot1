const TelegramBot = require('node-telegram-bot-api');

const token = '74093551:AAEFqTLmb8EbJPHIt4WRYc3DfMLRXNiKbrQ';
const bot = new TelegramBot(token);

// آدرس ربات خودتون رو اینجا قرار بدید
// بعد از deploy در Render، آدرس واقعی رو جایگزین کنید
const webhookUrl = 'https://YOUR-APP-NAME.onrender.com/webhook';

async function setWebhook() {
    try {
        console.log('🔄 در حال تنظیم وب‌هوک...');
        console.log('آدرس:', webhookUrl);
        
        const result = await bot.setWebHook(webhookUrl);
        
        console.log('✅ وب‌هوک با موفقیت تنظیم شد!');
        console.log('نتیجه:', result);
    } catch (error) {
        console.error('❌ خطا در تنظیم وب‌هوک:');
        console.error(error.message);
    }
}

setWebhook();
