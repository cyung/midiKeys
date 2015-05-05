angular.module('app')
	.directive('pressWhiteKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
				indexWhite: '=',
				sounds: '=',
				piano: '='
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexWhite[scope.index].toString();
				var pitch = 440 * Math.pow(2, (key_index - 69) / 12);
				scope.$watch('keyMap', function(newVal, oldVal) {
					if (scope.keyMap.hasOwnProperty(key_index)) {
						if (scope.keyMap[key_index])
							keyDown();
						else
							keyUp();
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
					elem[0].src = 'img/midi_white_down.png';
					scope.piano.play({
						pitch: pitch,
						label: pitch.toString()
					});
				}

				function keyUp() {
					elem[0].src = 'img/midi_white_up.png';
					scope.piano.stop(pitch.toString());
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
				sounds: '=',
				piano: '='
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexBlack[scope.index].toString();
				var pitch = 440 * Math.pow(2, (key_index - 69) / 12);
				scope.$watch('keyMap', function(newVal, oldVal) {
					if (scope.keyMap.hasOwnProperty(key_index)) {
						if (scope.keyMap[key_index]){
							keyDown();
						}
						else
							keyUp();
					}
				}, true);

				elem.bind('mousedown', function() {
					keyDown();
					scope.$root.down = true;
				});
				elem.bind('mouseup', function() {
					elem[0].src = 'img/midi_black_up.png';
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
					scope.piano.play({
						pitch: pitch,
						label: pitch.toString()
					});
				}

				function keyUp() {
					elem[0].src = 'img/midi_black_up.png';
					scope.piano.stop(pitch.toString());
				}
			}
		};
	}]);