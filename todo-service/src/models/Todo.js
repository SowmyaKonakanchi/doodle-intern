const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    taskName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    completionStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    recurrenceType: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'todos',
    paranoid: true
});

User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Todo;
