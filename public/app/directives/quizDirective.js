angular.module('app')
	.directive('practiceChord', [function () {
		return {
			restrict: 'AE',
			scope: {
				chord: '=',
				quizChord: '='
			},
			template: '<span>{{quizChord}}</span>',
			link: function (scope, elem, attrs) {
				
			}
		};
	}])
	.directive('practiceScale', [function () {
		return {
			restrict: 'AE',
			scope: {
				scale: '=',
				quizScale: '='
			},
			template: '<span>{{quizScale}}</span>',
			link: function (scope, elem, attrs) {
				
			}
		};
	}]);