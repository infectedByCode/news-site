const express = require('express')
const app = express()
const cors = require('cors')
const apiRouter = require('./routes/apiRouter')
const { customErrorHandlers, psqlErrorHandlers, invalidURLError, handleServerErrors } = require('./errors')

app.use(
  cors({
    origin: 'https://msd-news.herokuapp.com',
    credentials: true
  })
)
app.use(express.json())

app.use('/api', apiRouter)
app.all('/*', invalidURLError)

app.use(customErrorHandlers)
app.use(psqlErrorHandlers)
app.use(handleServerErrors)

module.exports = app
