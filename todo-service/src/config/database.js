const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASS,
    {
        host: env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL database connected successfully via Sequelize.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
