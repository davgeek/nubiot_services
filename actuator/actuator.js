'use strict';

const plugin = 'actuate';
var mqtt = require('mqtt').connect(process.env.BROKER_URI);
var seneca = require('seneca')();
seneca.use('seneca-amqp-transport');

seneca.add({role: plugin, cmd: 'set'}, function(args, callback) {
	var device = args.device;
	var node = args.node;
	var property = args.property;
	var payload = args.value;
	if(args.parse){
		payload = JSON.stringify({'value':  args.value});	
	}
	mqtt.publish('devices/' + device + '/' + node + '/' + property + '/set', new Buffer(payload), {qos: 0, retain: true}, function (err) {
		callback(err);
	});
});

seneca.ready(() =>
  seneca.listen({
    type: 'amqp',
    pins: `role: ${plugin}, cmd: *`,
    url: process.env.AMQP_URL || 'amqp://localhost:5672/seneca'
  }));