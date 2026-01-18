const nodemailer = require('nodemailer');
const https = require('https');

// WhatsApp Configuration (using CallMeBot - FREE!)
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || ''; // Your phone with country code, e.g., 919876543210
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || ''; // Get from CallMeBot

// Send WhatsApp Message via CallMeBot
const sendWhatsAppMessage = async (message) => {
    if (!WHATSAPP_PHONE || !WHATSAPP_API_KEY) {
        console.log('📱 WhatsApp not configured');
        return false;
    }

    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodedMessage}&apikey=${WHATSAPP_API_KEY}`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ WhatsApp notification sent!');
                    resolve(true);
                } else {
                    console.log('❌ WhatsApp failed:', data);
                    resolve(false);
                }
            });
        }).on('error', (error) => {
            console.error('WhatsApp error:', error.message);
            resolve(false);
        });
    });
};

// Create email transporter
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send notification (WhatsApp + Email)
const sendNotification = async (type, data) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Prepare WhatsApp message (plain text, no HTML)
    let whatsappMessage = '';

    switch (type) {
        case 'new_visitor':
            whatsappMessage = `🌐 *New Visitor Alert!*

📍 Page: ${data.page || 'Homepage'}
🖥️ Browser: ${data.browser || 'Unknown'}
💻 OS: ${data.os || 'Unknown'}
📱 Device: ${data.device || 'Desktop'}
🔗 Referrer: ${data.referrer || 'Direct'}
⏰ Time: ${timestamp}`.trim();
            break;

        case 'new_contact':
            whatsappMessage = `📬 *New Contact Inquiry!*

👤 Name: ${data.name}
📧 Email: ${data.email}
${data.phone ? `📱 Phone: ${data.phone}` : ''}
📝 Subject: ${data.subject || 'General Inquiry'}

💬 Message:
${data.message}

⏰ Time: ${timestamp}

💡 Reply at: ${data.email}`.trim();
            break;

        default:
            whatsappMessage = `📢 Notification: ${type}`;
    }

    // Send WhatsApp notification (goes to your phone instantly!)
    const whatsappSent = await sendWhatsAppMessage(whatsappMessage);

    // Also try to send email
    const transporter = createTransporter();
    let emailSent = false;

    if (transporter) {
        let subject, html;

        switch (type) {
            case 'new_visitor':
                subject = '👀 New Visitor on Your Portfolio!';
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; text-align: center;">👀 New Portfolio Visitor!</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Visitor Details:</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">🌐 IP Address</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.ip || 'Unknown'}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">🖥️ Browser</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.browser || 'Unknown'}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">💻 OS</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.os || 'Unknown'}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">📱 Device</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.device || 'Desktop'}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">📍 Page</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.page || 'Home'}</td></tr>
                                <tr><td style="padding: 10px; font-weight: bold;">🔗 Referrer</td><td style="padding: 10px;">${data.referrer || 'Direct'}</td></tr>
                            </table>
                            <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">Time: ${timestamp}</p>
                        </div>
                    </div>
                `;
                break;

            case 'new_contact':
                subject = '📬 New Contact Message on Your Portfolio!';
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; text-align: center;">📬 New Contact Message!</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Message Details:</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">👤 Name</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">📧 Email</td><td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                                ${data.phone ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">📱 Phone</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone}</td></tr>` : ''}
                                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">📋 Subject</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.subject}</td></tr>
                            </table>
                            <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #11998e;">
                                <h3 style="margin-top: 0; color: #333;">💬 Message:</h3>
                                <p style="color: #555; line-height: 1.6;">${data.message}</p>
                            </div>
                            <div style="margin-top: 20px; text-align: center;">
                                <a href="mailto:${data.email}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reply to ${data.name}</a>
                            </div>
                        </div>
                    </div>
                `;
                break;

            default:
                return telegramSent;
        }

        try {
            await transporter.sendMail({
                from: `"Portfolio Notification" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                subject,
                html
            });
            console.log(`✅ Email notification sent: ${type}`);
            emailSent = true;
        } catch (error) {
            console.error('❌ Failed to send email:', error.message);
        }
    } else {
        console.log('📧 Email not configured - Notification logged:');
        console.log(`   Type: ${type}`);
        console.log(`   Data:`, JSON.stringify(data, null, 2));
    }

    return whatsappSent || emailSent;
};

module.exports = { sendNotification, sendWhatsAppMessage };

