/**
*  Module
*
* Description
*/
angular.module('app', []);

angular.module('app')
	.controller('DrawCtrl', function() {
		var self = this;
		self.piano_back = 'img/background.png';
		self.white_key = 'img/midi_white_up.png';
		self.black_key = 'img/midi_black_up.png';
		this.range = function(num) {
			return new Array(num);
		};
	});