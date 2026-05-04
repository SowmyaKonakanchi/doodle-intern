const Joi = require('joi');

const schemas = {
    signup: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    forgotPassword: Joi.object({
        email: Joi.string().email().required()
    }),
    updateDetails: Joi.object({
        name: Joi.string().min(3).optional(),
        email: Joi.string().email().optional()
    }).min(1),
    updatePassword: Joi.object({
        newPassword: Joi.string().min(6).required()
    }),
    createTodo: Joi.object({
        taskName: Joi.string().min(3).required(),
        expiry: Joi.date().iso().required(),
        completionStatus: Joi.boolean().optional(),
        isRecurring: Joi.boolean().optional(),
        recurrenceType: Joi.string().valid('daily', 'weekly', 'monthly').when('isRecurring', { is: true, then: Joi.required(), otherwise: Joi.optional() })
    }),
    updateTodo: Joi.object({
        taskName: Joi.string().min(3).optional(),
        expiry: Joi.date().iso().optional(),
        completionStatus: Joi.boolean().optional(),
        isRecurring: Joi.boolean().optional(),
        recurrenceType: Joi.string().valid('daily', 'weekly', 'monthly').optional()
    }).min(1),
    updateStatus: Joi.object({
        completionStatus: Joi.boolean().required()
    }),
    idParam: Joi.object({
        id: Joi.number().integer().positive().required()
    }),
    pagination: Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional()
    })
};

const validate = (schemaName, source = 'body') => (req, res, next) => {
    const { error } = schemas[schemaName].validate(source === 'body' ? req.body : source === 'params' ? req.params : req.query, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            statusCode: 400,
            message: error.details.map(d => d.message).join(', '),
            data: null
        });
    }
    next();
};

module.exports = validate;
