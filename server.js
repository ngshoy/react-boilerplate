const express = require('express');

const PORT = parseInt(process.env['APP_PORT'] || '3000');
const appName = process.env['APP_NAME'] || 'react-boilerplate';

const app = express();

app.use('/', express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
  res.sendFile(path.join(__dirname, './dist', /\^main.[\s\S]+.js.gz/));
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server started a† http://localhost:${PORT}/`);
});
