const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const app = express();

const useRouter = require('./routers/userRouter');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    legacyHeaders: false
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(xss());

app.use('/api/users', useRouter);
app.use('/api/seeds', seedRouter);
//  client error handling
app.use((req, res, next) => {
    next(createError(404, 'Route not found!'));
});

// server error handling
app.use((err, req, res, next) => {
    return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
