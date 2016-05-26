'use strict';

const plugin = 'serialize'

var seneca = require('seneca')();
var influx= require('influx');

const DB_URI = process.env.INFLUX_HOST;

seneca.use('seneca-amqp-transport');

var createDatabase = function(cb) {
  setTimeout(function() {
    var initDb = influx({host: DB_URI, username : 'root', password : 'root'});
    initDb.createDatabase('event', function(err) {
      if (err) { console.log('ERROR: ' + err); }
      cb();
    });
  }, 3000);
};

createDatabase(function() {
  var db = influx({host: DB_URI, username : 'root', password : 'root', database : 'event'});
  var ifx = require('./influxUtil')(db);

  seneca.add({role: plugin, cmd: 'read'}, function(args, callback) {
    ifx.readEvent(args.sensorId, args.start, args.end, function(err, data) {
      callback(err, data);
    });
  });

  seneca.add({role: plugin, cmd: 'write'}, function(args, callback) {
    ifx.writeEvent(args.nodeId, args.value, function(err) {
      callback(err);
    });
  });

  seneca.ready(() =>
    seneca.listen({
      type: 'amqp',
      pins: `role: ${plugin}, cmd: *`,
      url: process.env.AMQP_URL || 'amqp://localhost:5672/seneca'
    }));
});

module.exports.seneca = seneca;