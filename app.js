const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const { customErrorHandlers, psqlErrorHandlers } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);
app.use(customErrorHandlers);
app.use(psqlErrorHandlers);

module.exports = app;
