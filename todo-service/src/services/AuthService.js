const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const EmailService = require('./EmailService');

class AuthService {
    static async signup(data) {
        const { name, email, password } = data;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return { id: user.id, name: user.name, email: user.email };
    }

    static async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

        return { token, user: payload };
    }

    static async updateDetails(userId, updateData) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        if (updateData.name) user.name = updateData.name;
        if (updateData.email) user.email = updateData.email;

        await user.save();
        return { id: user.id, name: user.name, email: user.email };
    }

    static async updatePassword(userId, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        return { message: 'Password updated successfully' };
    }

    static async forgotPassword(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User with this email does not exist');

        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(tempPassword, salt);
        await user.save();

        await EmailService.sendEmail({
            to: user.email,
            subject: 'Password Reset',
            text: `Your password has been reset. Your temporary password is: ${tempPassword}\nPlease login and update your password immediately.`
        });

        return { message: 'A temporary password has been sent to your email.' };
    }
}

module.exports = AuthService;
