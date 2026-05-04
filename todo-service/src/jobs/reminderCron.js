const cron = require('node-cron');
const { Op } = require('sequelize');
const Todo = require('../models/Todo');
const User = require('../models/User');
const EmailService = require('../services/EmailService');

const getNextExpiry = (expiry, recurrenceType) => {
    const next = new Date(expiry);
    if (recurrenceType === 'daily') next.setDate(next.getDate() + 1);
    else if (recurrenceType === 'weekly') next.setDate(next.getDate() + 7);
    else if (recurrenceType === 'monthly') next.setMonth(next.getMonth() + 1);
    return next;
};

const startReminderCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

            const tasks = await Todo.findAll({
                where: { expiry: { [Op.between]: [now, oneHourLater] }, completionStatus: false },
                include: [{ model: User, as: 'user', attributes: ['email', 'name'] }]
            });

            for (const task of tasks) {
                const { email, name } = task.user;
                await EmailService.sendEmail({
                    to: email,
                    subject: `Reminder: "${task.taskName}" is due in 1 hour`,
                    text: `Hi ${name},\n\nYour task "${task.taskName}" is due at ${task.expiry}.\n\nPlease complete it on time!\n\nTodo Service`
                });
                console.log(`Reminder sent to ${email} for task: ${task.taskName}`);
            }
        } catch (error) {
            console.error('Reminder cron error:', error.message);
        }
    });
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            const expiredRecurring = await Todo.findAll({
                where: {
                    expiry: { [Op.lt]: now },
                    isRecurring: true,
                    completionStatus: false
                }
            });

            for (const task of expiredRecurring) {
                const nextExpiry = getNextExpiry(task.expiry, task.recurrenceType);
                await Todo.create({
                    userId: task.userId,
                    taskName: task.taskName,
                    expiry: nextExpiry,
                    completionStatus: false,
                    isRecurring: true,
                    recurrenceType: task.recurrenceType
                });
                task.completionStatus = true;
                await task.save();
                console.log(`Recurring task created: ${task.taskName} → next expiry: ${nextExpiry}`);
            }
        } catch (error) {
            console.error('Recurring cron error:', error.message);
        }
    });

    console.log('Reminder and recurring cron jobs started.');
};

module.exports = startReminderCron;
