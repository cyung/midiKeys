(function() {
	'use strict';
	
	angular.module('app')
	.factory('practiceFactory', practiceFactory);

	function practiceFactory(chordFactory) {
		var finished = false;
		var progression = [];

		var services = {
			beginQuiz: beginQuiz,
			updateQuiz: updateQuiz,
			quizStatus: quizStatus
		};

		return services;

		function beginQuiz() {
			progression = chordFactory.getRandomProgression();
			finished = false;
		}

		function updateQuiz(key_down) {
			if (finished)
				return;

			if (checkChord(key_down, progression[0]))
				progression.shift();
		}

		function quizStatus() {
			if (progression.length !== 0)
				return;

			finished = true;

			return true;
		}
	}
})();