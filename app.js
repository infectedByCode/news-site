const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const { customErrorHandlers, psqlErrorHandlers, invalidURLError } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', invalidURLError);

app.use(customErrorHandlers);
app.use(psqlErrorHandlers);

module.exports = app;
