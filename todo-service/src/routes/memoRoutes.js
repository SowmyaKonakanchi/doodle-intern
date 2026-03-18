const express = require('express');
const MemoController = require('../controllers/MemoController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const Joi = require('joi');

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

const validateMemo = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        content: Joi.string().min(1).required()
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ statusCode: 400, message: error.details.map(d => d.message).join(', '), data: null });
    next();
};

const validateUpdateMemo = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(1).optional(),
        content: Joi.string().min(1).optional()
    }).min(1);
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ statusCode: 400, message: error.details.map(d => d.message).join(', '), data: null });
    next();
};

router.post('/', validateMemo, MemoController.create);
router.get('/', MemoController.getAll);
router.get('/trash', MemoController.getTrash);
router.put('/:id', validateUpdateMemo, MemoController.update);
router.patch('/:id/trash', MemoController.moveToTrash);
router.patch('/:id/restore', MemoController.restoreFromTrash);
router.delete('/:id', MemoController.delete);

module.exports = router;
