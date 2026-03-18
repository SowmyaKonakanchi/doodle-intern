const Memo = require('../models/Memo');

class MemoService {
    static async create(userId, data) {
        return await Memo.create({ userId, ...data });
    }

    static async getAll(userId) {
        return await Memo.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    static async update(userId, memoId, data) {
        const memo = await Memo.findOne({ where: { id: memoId, userId } });
        if (!memo) throw new Error('Memo not found');
        if (data.title !== undefined) memo.title = data.title;
        if (data.content !== undefined) memo.content = data.content;
        await memo.save();
        return memo;
    }

    static async moveToTrash(userId, memoId) {
        const memo = await Memo.findOne({ where: { id: memoId, userId } });
        if (!memo) throw new Error('Memo not found');
        await memo.destroy();
        return memo;
    }

    static async getTrash(userId) {
        const all = await Memo.findAll({ where: { userId }, paranoid: false });
        return all.filter(m => m.deletedAt !== null);
    }

    static async restoreFromTrash(userId, memoId) {
        const memo = await Memo.findOne({ where: { id: memoId, userId }, paranoid: false });
        if (!memo || !memo.deletedAt) throw new Error('Memo not found in trash');
        await memo.restore();
        return memo;
    }

    static async delete(userId, memoId) {
        const memo = await Memo.findOne({ where: { id: memoId, userId }, paranoid: false });
        if (!memo) throw new Error('Memo not found');
        await memo.destroy({ force: true });
        return { message: 'Memo permanently deleted' };
    }
}

module.exports = MemoService;
