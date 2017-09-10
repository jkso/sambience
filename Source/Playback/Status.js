const SSE = require('sse-broadcast');

const sse = SSE();

const channelName = 'default';

module.exports = {
	subscribe: function(response) {
		sse.subscribe( channelName, response );
	},

	playback: function(data) {
		sse.publish( channelName, 'playback', data );
	},

	scan: function(data) {
		sse.publish( channelName, 'scan', data );
	},

	error: function(data) {
		console.log("Error",data);
		sse.publish( channelName, 'error', data );
	}
}