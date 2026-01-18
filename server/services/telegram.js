// Telegram Notification Service
// To set up: 
// 1. Create a bot with @BotFather on Telegram
// 2. Get your chat ID by messaging @userinfobot
// 3. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env file

const https = require('https');

// Configuration - Set these in your .env file
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

/**
 * Send a message via Telegram
 * @param {string} message - The message to send
 * @returns {Promise}
 */
async function sendTelegramMessage(message) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('Telegram not configured. Message:', message);
        return { success: false, error: 'Telegram not configured' };
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    });

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve({ success: result.ok, data: result });
                } catch (e) {
                    resolve({ success: false, error: 'Parse error' });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Telegram error:', error);
            resolve({ success: false, error: error.message });
        });

        req.write(data);
        req.end();
    });
}

/**
 * Notify about new visitor
 * @param {Object} visitorInfo - Visitor details
 */
async function notifyNewVisitor(visitorInfo) {
    const message = `
🌐 <b>New Visitor Alert!</b>

📍 <b>Page:</b> ${visitorInfo.page || 'Homepage'}
🖥️ <b>Screen:</b> ${visitorInfo.screenWidth}x${visitorInfo.screenHeight}
🔗 <b>Referrer:</b> ${visitorInfo.referrer || 'Direct'}
⏰ <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    return sendTelegramMessage(message);
}

/**
 * Notify about new contact inquiry
 * @param {Object} contactInfo - Contact form details
 */
async function notifyNewContact(contactInfo) {
    const message = `
📬 <b>New Contact Inquiry!</b>

👤 <b>Name:</b> ${contactInfo.name}
📧 <b>Email:</b> ${contactInfo.email}
📱 <b>Phone:</b> ${contactInfo.phone || 'Not provided'}
📝 <b>Subject:</b> ${contactInfo.subject || 'General Inquiry'}

💬 <b>Message:</b>
${contactInfo.message}

⏰ <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    return sendTelegramMessage(message);
}

/**
 * Notify about project view
 * @param {string} projectTitle - The project being viewed
 */
async function notifyProjectView(projectTitle) {
    const message = `
👁️ <b>Project Viewed!</b>

📁 <b>Project:</b> ${projectTitle}
⏰ <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    return sendTelegramMessage(message);
}

module.exports = {
    sendTelegramMessage,
    notifyNewVisitor,
    notifyNewContact,
    notifyProjectView
};
