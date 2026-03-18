const nodemailer = require('nodemailer');
const env = require('../config/env');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS
            }
        });
    }

    async sendEmail({ to, subject, text }) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Todo Service" <noreply@todoservice.com>',
                to,
                subject,
                text,
            });
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
