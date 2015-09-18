(function() {
	'use strict';
	
	angular.module('app')
	.factory('displayFactory', displayFactory);

	function displayFactory() {
		var services = {
			getMappings: getMappings
		};

		return services;

		function getMappings() {
			// generate midi numbers for white keys from C1 to C5
			var map_white = [];
			var i = 24;
			var j=0;
			while (i<=107){
				for (j=0; j<2; j++){
					map_white.push(i);
					i+=2;
				}
				map_white.push(i);
				i+=1;
				for (j=0; j<3; j++){
					map_white.push(i);
					i+=2;
				}
				map_white.push(i);
				i+=1;
			}
			map_white.push(i);

			// generate for black keys
			var map_black = [];
			i=25;
			j=0;
			while (i<=107){
				map_black.push(i);
				i+=2;
				map_black.push(i);
				i+=3;
				map_black.push(0);
				for (j=0; j<2; j++){
					map_black.push(i);
					i+=2;
				}
				map_black.push(i);
				i+=3;
				map_black.push(0);
			}
			
			var index_white = [];
			var index_black = [];
			
			// add starting keys on left since they aren't covered by the algorithm
			index_white.push(21);
			index_white.push(23);
			index_black.push(22);
			index_black.push(0);

			index_white = index_white.concat(map_white);
			index_black = index_black.concat(map_black);

			// fill with zeroes to prevent error when someone inputs a midi note higher
			// than the max on an 88-key piano because those files don't exist
			for (i=0; i<30; i++) {
				index_white.push(0);
				index_black.push(0);
			}

			return [index_white, index_black];
		}
	}
})();