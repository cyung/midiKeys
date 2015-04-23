/**
*  Module
*
* Description
*/
angular.module('app', []);

angular.module('app')
	.controller('DrawCtrl', function() {
		var self = this;
		self.img = 'img/background.png';

		this.range = function(num) {
			return new Array(num);
		};
	});