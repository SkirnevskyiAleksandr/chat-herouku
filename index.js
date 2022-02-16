'use strict'
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser')
app.use(bodyParser.json({
    limit: '50mb'
}))

const users = [];
app.get('/api/v1/message', (req, res) => {
    users.push(res);

});

app.post('/api/v1/message', (req, res) => {
    while (users.length) {
        const user = users.pop();
        user.json(req.body);
    }
    res.send(null);
})
app.listen(3000);