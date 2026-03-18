const Todo = require('../models/Todo');
const { Op } = require('sequelize');

class TodoService {
    static async create(userId, data) {
        const { taskName, expiry, completionStatus, isRecurring, recurrenceType } = data;
        const todo = await Todo.create({
            userId,
            taskName,
            expiry,
            completionStatus: completionStatus || false,
            isRecurring: isRecurring || false,
            recurrenceType: isRecurring ? recurrenceType : null
        });
        return todo;
    }

    static async getAll(userId) {
        return await Todo.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    static async update(userId, todoId, data) {
        const todo = await Todo.findOne({ where: { id: todoId, userId } });
        if (!todo) throw new Error('Todo not found');

        if (data.taskName !== undefined) todo.taskName = data.taskName;
        if (data.expiry !== undefined) todo.expiry = data.expiry;
        if (data.completionStatus !== undefined) todo.completionStatus = data.completionStatus;

        await todo.save();
        return todo;
    }

    static async updateStatus(userId, todoId, completionStatus) {
        const todo = await Todo.findOne({ where: { id: todoId, userId } });
        if (!todo) throw new Error('Todo not found');
        todo.completionStatus = completionStatus;
        await todo.save();
        return todo;
    }

    static async getActive(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Todo.findAndCountAll({
            where: { userId, expiry: { [Op.gte]: new Date() }, completionStatus: false },
            order: [['expiry', 'ASC']],
            limit,
            offset
        });
        return { total: count, page, limit, totalPages: Math.ceil(count / limit), todos: rows };
    }

    static async getExpired(userId) {
        return await Todo.findAll({
            where: { userId, expiry: { [Op.lt]: new Date() } },
            order: [['expiry', 'ASC']]
        });
    }

    static async moveToTrash(userId, todoId) {
        const todo = await Todo.findOne({ where: { id: todoId, userId } });
        if (!todo) throw new Error('Todo not found');
        await todo.destroy();
        return todo;
    }

    static async getTrash(userId) {
        return await Todo.findAll({
            where: { userId },
            paranoid: false,
            order: [['deletedAt', 'DESC']]
        }).then(todos => todos.filter(t => t.deletedAt !== null));
    }

    static async restoreFromTrash(userId, todoId) {
        const todo = await Todo.findOne({ where: { id: todoId, userId }, paranoid: false });
        if (!todo || !todo.deletedAt) throw new Error('Todo not found in trash');
        await todo.restore();
        return todo;
    }

    static async getCompleted(userId) {
        return await Todo.findAll({
            where: { userId, completionStatus: true },
            order: [['updatedAt', 'DESC']]
        });
    }

    static async getSummary(userId) {
        const now = new Date();
        const [total, active, completed, expired, trash] = await Promise.all([
            Todo.count({ where: { userId } }),
            Todo.count({ where: { userId, expiry: { [Op.gte]: now }, completionStatus: false } }),
            Todo.count({ where: { userId, completionStatus: true } }),
            Todo.count({ where: { userId, expiry: { [Op.lt]: now }, completionStatus: false } }),
            Todo.count({ where: { userId }, paranoid: false }).then(all =>
                Todo.count({ where: { userId } }).then(nonDeleted => all - nonDeleted)
            )
        ]);
        return { total, active, completed, expired, trash };
    }

    static async delete(userId, todoId) {
        const todo = await Todo.findOne({ where: { id: todoId, userId } });
        if (!todo) throw new Error('Todo not found');

        await todo.destroy();
        return { message: 'Todo deleted successfully' };
    }
}

module.exports = TodoService;
