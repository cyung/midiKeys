(function() {
	'use strict';

	angular.module('app')
	.factory('inputFactory', inputFactory);

	function inputFactory($interval, chordFactory, scaleFactory) {
		var self = this;
		self.device = null;
		var key_map = []; // values storing the state of each key
		var key_vel = []; // key velocity
		var key_history = []; // buffer of most recent 20 keys
		var key_down = []; // store keys being held down
		var down_num = 144;
		var up_num = 128;
		var stop; // interval timer for clearing history

		setup();

		var User = {
			chord: '',
			scale: ''
		};

		var services = {
			getKeyMap: getKeyMap,
			getKeyVel: getKeyVel,
			getKeyHistory: getKeyHistory,
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

			key_down.push(key_num);
			key_down.sort();

			setChord();
			setScale();
			practiceFactory()
		}

		function setChord() {
			// get array of possible chords
			var chords = chordFactory.detectChord(key_down);

			if (chords.length === 0) {
				User.chord = '';
				return;
			}

			// if there is chord already held down or the user let go of
			// the previous chord, assign a new one
			if (User.chord === '' || chords.indexOf(User.chord) !== -1)
				User.chord = chords[0];
		}

		function setScale() {
			User.scale = scaleFactory.getScale(key_map);
		}

		function keyUp(key_num) {
			key_map[key_num] = false;

			for (var i=0; i<key_down.length; i++) {
				if (key_down[i] === key_num) {
					key_down.splice(i,1);
					break;
				}
			}
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
				} else {
					keyUp(key_num);
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

		function setup() {
			// fill key_map array with false to mark all keys up
			// and set velocity to 0
			for (var i=0; i<=108; i++){
				key_map.push(false);
				key_vel.push(0);
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