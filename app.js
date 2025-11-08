
const express = require('express');
const app = express();

const port = 3000;

require('dotenv').config();

app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.__CONFIG__ = {
    API_BASE_URL: "${process.env.API_BASE_URL}"
  };`);
});


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/pages/signin/signin.html');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
