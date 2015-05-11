angular.module('app')
	.directive('quiz', [function () {
		return {
			restrict: 'AE',
			scope: {
				chord: '=',
				quizChord: '='
			},
			template: '<span>{{quizChord}}</span>',
			link: function (scope, elem, attrs) {
				console.log(scope.quizChord);
			}
		};
	}]);