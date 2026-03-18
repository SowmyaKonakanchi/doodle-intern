const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const memoRoutes = require('./routes/memoRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/memos', memoRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Todo Service is running' });
});

const ErrorHandler = require('./middlewares/errorHandler');
app.use(ErrorHandler.defaultHandler);

module.exports = app;
