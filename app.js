const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const { customErrorHandlers } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);
app.use(customErrorHandlers);

module.exports = app;
