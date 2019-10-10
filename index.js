'use strict'

var express = require('express');
var app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
    console.log('Running on port ' + PORT);
});
