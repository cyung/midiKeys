angular.module('app')
	.directive('pressWhiteKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
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
				sound.play();
				var down = false;
				
				scope.$watch('keyMap[' + key_index + ']', function(newVal, oldVal) {
					if (scope.keyMap[key_index] && !down){
						keyDown();
						down = true;
					}
					else if (down) {
						keyUp();
						down = false;
					}
				}, true);

				elem.bind('mousedown', function() {
					keyDown();
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
						keyDown();
				});

				function keyDown() {
					sound.play();
					elem[0].src = 'img/midi_white_down.png';
				}

				function keyUp() {
					sound.stop();
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

				scope.$watch('keyMap[' + key_index + ']', function(newVal, oldVal) {
					if (scope.keyMap[key_index] && !down){
						keyDown();
						down = true;
					}
					else if (down) {
						keyUp();
						down = false;
					}
				}, true);

				elem.bind('mousedown', function() {
					keyDown();
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
						keyDown();
				});

				function keyDown() {
					sound.play();
					elem[0].src = 'img/midi_black_down.png';
				}

				function keyUp() {
					sound.stop();
					elem[0].src = 'img/midi_black_up.png';
				}
			}
		};
	}]);