const { PORT = 9090 } = process.env;
const app = require('./app');

// app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
