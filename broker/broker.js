'use strict';

var mosca = require('mosca');
var seneca = require('seneca')();
var server = new mosca.Server({});

seneca.use('seneca-amqp-transport');
seneca.client({
  type: 'amqp',
  pin: { role: 'serialize', cmd: 'write' },
  url: process.env.AMQP_URL || 'amqp://localhost:5672/seneca'
});

server.published = function (packet, client, cb) {
  var body = {role: 'serialize', cmd: 'write'};
  if (packet.topic.match(/devices\/([a-zA-Z0-9]){7,14}\/([a-zA-Z0-9]){7,14}\/([a-z]){2,14}/)) {
    var topic = packet.topic.split('/');
    console.log(topic);
    body.nodeId = topic[2];
    body.value = packet.payload.toString();
    seneca.act(body, cb);
  } 
  else {
    cb();
  }
};