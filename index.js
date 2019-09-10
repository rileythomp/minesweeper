'use strict'

var express = require('express');
var app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
    console.log('Go to localhost:', PORT, 'in your browser');
});
