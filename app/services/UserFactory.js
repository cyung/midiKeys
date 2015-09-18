(function() {
	'use strict';

	angular.module('app')
	.factory('userFactory', userFactory);

	function userFactory($http) {
		var services = {
			login: login
			logout: logout
		};

		return services;

		function login () {
			$http({
				url: 'https://github.com/login/oauth/authorize',
				method: 'GET',
				params: {redirect_uri: 'http://www.chrisyung.me',client_id: '93acf71ce1b1494121de'}
			})
			.then(function(res) {
				$http({
					url: 'https://github.com/login/oauth/access_token',
					method: 'POST',
					data: {
						client_id: '93acf71ce1b1494121de',
						client_secret: 
					}
				});
			})
		}
	}
})();