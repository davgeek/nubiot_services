'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use('/v1/', require('./routes'));

http.listen(process.env.api_port, function(){
	console.log('listening on *:' + process.env.api_port);
});