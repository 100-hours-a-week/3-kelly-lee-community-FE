
const express = require('express');
const app = express();

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/pages/signin/signin.html');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})