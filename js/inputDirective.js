angular.module('app')
	.directive('pressWhiteKey', [ function () {
		return {
			link: function (scope, elem, attrs) {
				var parent = scope.$root;
				parent.down = false;
				elem.bind('mousedown', function() {
					elem[0].src = 'img/midi_white_down.png';
					parent.down = true;
				});
				elem.bind('mouseup', function() {
					elem[0].src = 'img/midi_white_up.png';
					parent.down = false;
				});
				elem.bind('mouseleave', function() {
					elem[0].src = 'img/midi_white_up.png';
				});
				elem.bind('mouseenter', function() {
					if (parent.down)
						elem[0].src = 'img/midi_white_down.png';
				});
			}
		};
	}])	

	.directive('pressBlackKey', [ function () {
		return {
			link: function (scope, elem, attrs) {
				var parent = scope.$root;
				parent.down = false;
				elem.bind('mousedown', function() {
					elem[0].src = 'img/midi_black_down.png';
					parent.down = true;
				});
				elem.bind('mouseup', function() {
					elem[0].src = 'img/midi_black_up.png';
					parent.down = false;
				});
				elem.bind('mouseleave', function() {
					elem[0].src = 'img/midi_black_up.png';
				});
				elem.bind('mouseenter', function() {
					if (parent.down)
						elem[0].src = 'img/midi_black_down.png';
				});
			}
		};
	}]);