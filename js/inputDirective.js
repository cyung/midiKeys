angular.module('app')
	.directive('pressWhiteKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
				indexWhite: '=',
				sounds: '=',
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexWhite[scope.index].toString();
				// var pitch = 440 * Math.pow(2, (key_index - 69) / 12);
				var filename = 'sounds/piano-' + key_index + '.mp3';
				var sound = new Howl({
					urls: [filename],
					// volume: 0.3
				});
				var down = false;
				
				scope.$watch('keyMap', function(newVal, oldVal) {
					if (scope.keyMap[key_index]){
						if (!down){
							keyDown();
							down = true;
						}
					}
					else{
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
					console.log('down');
					elem[0].src = 'img/midi_white_down.png';
					sound.play();
				}

				function keyUp() {
					elem[0].src = 'img/midi_white_up.png';
					sound.stop();
				}
			}
		};
	}])

	.directive('pressBlackKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
				indexBlack: '=',
				sounds: '='
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexBlack[scope.index].toString();
				// var pitch = 440 * Math.pow(2, (key_index - 69) / 12);
				var filename = 'sounds/piano-' + key_index + '.mp3';
				var sound = new Howl({
					urls: [filename],
					volume: 0.3
				});
				var down = false;

				scope.$watch('keyMap', function(newVal, oldVal) {
					if (scope.keyMap[key_index]){
						if (!down){
							keyDown();
							down = true;
						}
					}
					else{
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
					elem[0].src = 'img/midi_black_down.png';
					sound.play();
				}

				function keyUp() {
					elem[0].src = 'img/midi_black_up.png';
					sound.stop();
				}
			}
		};
	}]);