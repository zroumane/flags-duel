const path = require('path');
const express = require('express');
const history = require('connect-history-api-fallback');

const app = express();

app.get('/api/', function (req, res) {
  res.send('Hello World');
})

app.use(history());

app.use('/', express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})