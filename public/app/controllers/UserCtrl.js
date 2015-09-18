(function() {
	'use strict';

	angular.module('app')
	.controller('userCtrl', userCtrl);

	function userCtrl (userFactory) {
		var self = this;

		self.login = userFactory.login;
	}
})();