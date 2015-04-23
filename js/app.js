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

		self.keys = [];
		var keyGroupOf3 = true;

		self.keys.push({black: true}); // first key is shown
		var i = 1;
		while (i < 54) {
			self.keys.push({black: false});
			// alwasy followed by at least two
			self.keys.push({black: true});
			self.keys.push({black: true});
			if (keyGroupOf3){
				self.keys.push({black: true});
				i += 4;
			} else {
				i += 3;
			}
			keyGroupOf3 = !keyGroupOf3;
		}
		self.range = function(num) {
			return new Array(num);
		};
	});
