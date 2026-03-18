const MemoService = require('../services/MemoService');

class MemoController {
    static async create(req, res, next) {
        try {
            const memo = await MemoService.create(req.user.id, req.body);
            res.status(201).json({ statusCode: 201, message: 'Memo created successfully', data: memo });
        } catch (error) {
            error.statusCode = 400;
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const memos = await MemoService.getAll(req.user.id);
            const message = memos.length === 0 ? 'No memos found' : 'Memos fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: memos });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const memo = await MemoService.update(req.user.id, req.params.id, req.body);
            res.status(200).json({ statusCode: 200, message: 'Memo updated successfully', data: memo });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async moveToTrash(req, res, next) {
        try {
            await MemoService.moveToTrash(req.user.id, req.params.id);
            res.status(200).json({ statusCode: 200, message: 'Memo moved to trash', data: null });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async getTrash(req, res, next) {
        try {
            const memos = await MemoService.getTrash(req.user.id);
            const message = memos.length === 0 ? 'Trash is empty' : 'Trash fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: memos });
        } catch (error) {
            next(error);
        }
    }

    static async restoreFromTrash(req, res, next) {
        try {
            const memo = await MemoService.restoreFromTrash(req.user.id, req.params.id);
            res.status(200).json({ statusCode: 200, message: 'Memo restored from trash', data: memo });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const result = await MemoService.delete(req.user.id, req.params.id);
            res.status(200).json({ statusCode: 200, message: result.message, data: null });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }
}

module.exports = MemoController;
