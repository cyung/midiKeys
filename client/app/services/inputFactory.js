(function() {
	'use strict';

	angular.module('app')
	.factory('inputFactory', inputFactory);

	function inputFactory($interval, chordFactory, scaleFactory) {
		var self = this;
		self.device = null;
		var key_map = [];
		var key_vel = [];
		var key_history = [];
		var down_num = 144;
		var up_num = 128;
		var index_white, index_black, stop;

		generateMappings();

		var User = {
			chord: '',
			scale: ''
		};

		var services = {
			getKeyMap: getKeyMap,
			getKeyVel: getKeyVel,
			getKeyHistory: getKeyHistory,
			getMappings: getMappings,
			plug: plug,
			User: User
		}

		return services;

		function unplug() {
			self.device = null;
			self.device.onmidimessage = null;
		}

		function plug(device) {
			if (device) {
				if (self.device)
					unplug();

				self.device = device;
				self.device.onmidimessage = onmidimessage;
			}
		}

		function keyDown(key_num, current_key_vel) {
			key_map[key_num] = true;
			key_vel[key_num] = current_key_vel;
			key_history.push(key_num % 12);

			// only retain the last 20 keys
			if (key_history.length > 20)
				key_history.shift();
		}

		function clearHistory() {
			key_history = [];
			for (var j=0; j<20; j++)
				key_history.push(-1);
		}

		function onmidimessage(e) {
			var key_state = e.data[0];
			var key_num = e.data[1];
			var key_vel = e.data[2];

			if (angular.isDefined(stop)) {
				$interval.cancel(stop);
				stop = undefined;
			}

			// clear the key history if nothing is pressed after 1000ms
			stop = $interval(function() {
				clearHistory();
			}, 1000);

			// if (input.name === 'C.24') { // Miselu C.24
			if (key_state === 144) { // key down/up
				if (key_vel !== 0) {
					keyDown(key_num, key_vel);
					User.chord = chordFactory.checkChord(key_history);
					User.scale = scaleFactory.checkScale(key_history);
				} else {
					key_map[key_num] = false;
				}
			}
			// } else if (input.name === 'Q49' ||
			// 	input.name === 'CASIO USB-MIDI') { // alesis Q49
			// 	if (key_state === down_num){
			// 		keyDown(key_num, key_vel);
			// 	} else {
			// 		key_map[key_num] = false;
			// 	}
			// } else {
			// 	console.log(input.name, e.data);
			// }

		}

		function getMappings() {
			return [index_white, index_black];
		}

		// generate midi values for all keys
		function generateMappings() {
			// fill key_map array with false
			for (var i=0; i<=108; i++){
				key_map.push(false);
				key_vel.push(0);
			}

			// generate midi numbers for white keys from C1 to C5
			var map_white = [];
			i = 24;
			var j=0;
			while (i<=107){
				for (j=0; j<2; j++){
					map_white.push(i);
					i+=2;
				}
				map_white.push(i);
				i+=1;
				for (j=0; j<3; j++){
					map_white.push(i);
					i+=2;
				}
				map_white.push(i);
				i+=1;
			}
			map_white.push(i);

			// generate for black keys
			var map_black = [];
			i=25;
			j=0;
			while (i<=107){
				map_black.push(i);
				i+=2;
				map_black.push(i);
				i+=3;
				map_black.push(0);
				for (j=0; j<2; j++){
					map_black.push(i);
					i+=2;
				}
				map_black.push(i);
				i+=3;
				map_black.push(0);
			}
			
			index_white = [];
			index_black = [];
			
			// add starting keys on left since they aren't covered by the algorithm
			index_white.push(21);
			index_white.push(23);
			index_black.push(22);
			index_black.push(0);

			index_white = index_white.concat(map_white);
			index_black = index_black.concat(map_black);

			// fill with zeroes to prevent error when someone inputs a midi note higher
			// than the max on an 88-key piano
			for (i=0; i<30; i++) {
				index_white.push(0);
				index_black.push(0);
			}
		}


		function getKeyVel() {
			return key_vel;
		}

		function getKeyMap() {
			return key_map;
		}

		function getKeyHistory() {
			return key_history;
		}
	}
})();