'use strict';

module.exports = function(client) {

  var writeEvent = function(nodeId, value, cb) {
    client.writePoint('event', {nodeId: nodeId, value: value}, {}, function(err) {
      cb(err);
    });
  };

  var readEvent = function(nodeId, start, end, cb) {
    client.query('select * from event where nodeId=\'' + nodeId + '\' and time > \'' + start + '\' and time < \'' + end + '\'', function(err, data) {
      cb(err, data);
    });
  };

  return {
    writeEvent: writeEvent,
    readEvent: readEvent
  };
};