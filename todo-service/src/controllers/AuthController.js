const AuthService = require('../services/AuthService');

class AuthController {
    static async signup(req, res, next) {
        try {
            const user = await AuthService.signup(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            error.statusCode = 400;
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            error.statusCode = 401;
            next(error);
        }
    }

    static async updateDetails(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedUser = await AuthService.updateDetails(userId, req.body);
            res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
            error.statusCode = 400;
            next(error);
        }
    }

    static async updatePassword(req, res, next) {
        try {
            const userId = req.user.id;
            const { newPassword } = req.body;
            const result = await AuthService.updatePassword(userId, newPassword);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            error.statusCode = 400;
            next(error);
        }
    }

    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const result = await AuthService.forgotPassword(email);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }
}

module.exports = AuthController;
