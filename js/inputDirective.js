angular.module('app')
	.directive('pressWhiteKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
				keyVel: '=',
				indexWhite: '='
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexWhite[scope.index].toString();
				// var pitch = 440 * Math.pow(2, (key_index - 69) / 12);
				var filename = 'sounds/piano-' + key_index + '.mp3';
				// filename = 'sounds/toss.wav';
				var sound = new Howl({
					urls: [filename],
					volume: 0.3,
					onloaderror: function() {
						console.log('Error loading file.');
					}
				});
				// sound.play();
				var down = false;
				var key_vel;
				
				scope.$watch('keyMap[' + key_index + ']', function(newVal, oldVal) {
					if (scope.keyMap[key_index] && !down){
						key_vel = scope.keyVel[key_index];
						key_vel /= 127; // normalize to [0,1]
						// key_vel *= 0.3; // normalize to [0,0.3]
						if (key_index < 60)
							key_vel *= 0.5;
						keyDown(key_vel);
					}
					else if (down) {
						keyUp();
					}
				}, true);

				elem.bind('mousedown', function() {
					keyDown(0.3);
					scope.$root.down = true;
				});
				elem.bind('mouseup', function() {
					keyUp();
					scope.$root.down = false;
				});
				elem.bind('mouseleave', function() {
					keyUp();
				});
				elem.bind('mouseenter', function() {
					if (scope.$root.down)
						keyDown(0.3);
				});

				function keyDown(velocity) {
					down = true;
					sound.stop();
					sound.volume(velocity);
					sound.play();
					elem[0].src = 'img/midi_white_down.png';
				}

				function keyUp() {
					if (down)
						sound.fade(0.3,0,50);
					down = false;
					elem[0].src = 'img/midi_white_up.png';
				}
			}
		};
	}])

	.directive('pressBlackKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
				keyVel: '=',
				indexBlack: '='
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexBlack[scope.index].toString();
				// var pitch = 440 * Math.pow(2, (key_index - 69) / 12);
				var filename = 'sounds/piano-' + key_index + '.mp3';
				// filename = 'sounds/toss.wav';
				var sound = new Howl({
					urls: [filename],
					volume: 0.3,
					onloaderror: function() {
						console.log('Error loading file.');
					}
				});
				var down = false;
				var key_vel;

				scope.$watch('keyMap[' + key_index + ']', function(newVal, oldVal) {
					if (scope.keyMap[key_index] && !down){
						key_vel = scope.keyVel[key_index];
						key_vel /= 127; // normalize to [0,1]
						// key_vel *= 0.3; // normalize to [0,0.3]
						if (key_index < 60)
							key_vel *= 0.5;
						keyDown(key_vel);
					}
					else if (down) {
						keyUp();
					}
				}, true);

				elem.bind('mousedown', function() {
					keyDown(0.3);
					scope.$root.down = true;
				});
				elem.bind('mouseup', function() {
					keyUp();
					scope.$root.down = false;
				});
				elem.bind('mouseleave', function() {
					keyUp();
				});
				elem.bind('mouseenter', function() {
					if (scope.$root.down)
						keyDown(0.3);
				});

				function keyDown(velocity) {
					down = true;
					sound.stop();
					sound.volume(velocity);
					sound.play();
					elem[0].src = 'img/midi_black_down.png';
				}

				function keyUp() {
					if (down)
						sound.fade(0.3,0,50);
					down = false;
					elem[0].src = 'img/midi_black_up.png';
				}
			}
		};
	}]);