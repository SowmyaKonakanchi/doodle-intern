const TodoService = require('../services/TodoService');

class TodoController {
    static async create(req, res, next) {
        try {
            const userId = req.user.id;
            const todo = await TodoService.create(userId, req.body);
            res.status(201).json({ statusCode: 201, message: 'Task created successfully', data: todo });
        } catch (error) {
            error.statusCode = 400;
            next(error);
        }
    }

    
    static async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const todos = await TodoService.getAll(userId);
            const message = todos.length === 0 ? 'No tasks found' : 'Tasks fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: todos });
        } catch (error) {
            next(error);
        }
    }

    static async getActive(req, res, next) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await TodoService.getActive(userId, page, limit);
            const message = result.total === 0 ? 'No active tasks' : 'Active tasks fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getExpired(req, res, next) {
        try {
            const userId = req.user.id;
            const todos = await TodoService.getExpired(userId);
            const message = todos.length === 0 ? 'No expired tasks' : 'Expired tasks fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: todos });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { completionStatus } = req.body;
            if (completionStatus === undefined) {
                return res.status(400).json({ statusCode: 400, message: 'completionStatus is required', data: null });
            }
            const todo = await TodoService.updateStatus(userId, id, completionStatus);
            res.status(200).json({ statusCode: 200, message: 'Task status updated successfully', data: todo });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const updatedTodo = await TodoService.update(userId, id, req.body);
            res.status(200).json({ statusCode: 200, message: 'Task updated successfully', data: updatedTodo });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async moveToTrash(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await TodoService.moveToTrash(userId, id);
            res.status(200).json({ statusCode: 200, message: 'Task moved to trash', data: null });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async getTrash(req, res, next) {
        try {
            const userId = req.user.id;
            const todos = await TodoService.getTrash(userId);
            const message = todos.length === 0 ? 'Trash is empty' : 'Trash fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: todos });
        } catch (error) {
            next(error);
        }
    }

    static async restoreFromTrash(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const todo = await TodoService.restoreFromTrash(userId, id);
            res.status(200).json({ statusCode: 200, message: 'Task restored from trash', data: todo });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }

    static async getCompleted(req, res, next) {
        try {
            const userId = req.user.id;
            const todos = await TodoService.getCompleted(userId);
            const message = todos.length === 0 ? 'No completed tasks' : 'Completed tasks fetched successfully';
            res.status(200).json({ statusCode: 200, message, data: todos });
        } catch (error) {
            next(error);
        }
    }

    static async getSummary(req, res, next) {
        try {
            const userId = req.user.id;
            const summary = await TodoService.getSummary(userId);
            res.status(200).json({ statusCode: 200, message: 'Summary fetched successfully', data: summary });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const result = await TodoService.delete(userId, id);
            res.status(200).json({ statusCode: 200, message: 'Task deleted successfully', data: result });
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    }
}

module.exports = TodoController;
