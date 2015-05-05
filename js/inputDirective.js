angular.module('app')
	.directive('pressWhiteKey', [ function () {
		return {
			scope: {
				index: '@',
				keyMap: '=',
				indexWhite: '=',
				sounds: '='
			},
			link: function (scope, elem, attrs) {
				var key_index = scope.indexWhite[scope.index].toString();
				scope.$watch('keyMap', function(newVal, oldVal) {
					if (scope.keyMap.hasOwnProperty(key_index)) {
						if (scope.keyMap[key_index])
							keyDown();
						else
							elem[0].src = 'img/midi_white_up.png';
					}
				}, true);
				elem.bind('mousedown', function() {
					keyDown();
					scope.$root.down = true;
				});
				elem.bind('mouseup', function() {
					elem[0].src = 'img/midi_white_up.png';
					scope.$root.down = false;
				});
				elem.bind('mouseleave', function() {
					elem[0].src = 'img/midi_white_up.png';
				});
				elem.bind('mouseenter', function() {
					if (scope.$root.down)
						keyDown();
				});

				function keyDown() {
					elem[0].src = 'img/midi_white_down.png';
					scope.sounds.play();
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
				scope.$watch('keyMap', function(newVal, oldVal) {
					if (scope.keyMap.hasOwnProperty(key_index)) {
						if (scope.keyMap[key_index])
							keyDown();
						else
							elem[0].src = 'img/midi_black_up.png';
					}
				}, true);

				elem.bind('mousedown', function() {
					keyDown();
					scope.$root.down = true;
					console.log(scope.index);
				});
				elem.bind('mouseup', function() {
					elem[0].src = 'img/midi_black_up.png';
					scope.$root.down = false;
				});
				elem.bind('mouseleave', function() {
					elem[0].src = 'img/midi_black_up.png';
				});
				elem.bind('mouseenter', function() {
					if (scope.$root.down)
						keyDown();
				});

				function keyDown() {
					elem[0].src = 'img/midi_black_down.png';
					scope.sounds.play();
				}
			}
		};
	}]);