(function() {
	'use strict';
	
	angular.module('app')
	.controller('ConnectCtrl', ['$scope', 'Devices', 'inputFactory',
	 function($scope, devices, inputFactory) {
		var self = this;
		self.devices = [];
		self.key_vel = inputFactory.getKeyVel();
		self.key_map = inputFactory.getKeyMap();
		self.key_history = inputFactory.getKeyHistory();

		var mappings = inputFactory.getMappings();
		self.index_white = mappings[0];
		self.index_black = mappings[1];
		self.chord = inputFactory.User.chord;

		devices
		.connect()
		.then(function(access) {
			if (access.inputs && access.inputs.size > 0) {
				var inputs = access.inputs.values();
				var input = null;

				// iterate through the devices
				for (input = inputs.next(); input && !input.done; input = inputs.next()){
					self.devices.push(input.value);
				}

				// set first device to active device
				self.activeDevice = self.devices[0];
			}
			else {
				console.error('No devices detected!');
			}
		})
		.catch(function(e) {
			console.error(e);
		});

		$scope.$watch(function() {
			return inputFactory.User.chord;
		}, function(newVal, oldVal) {
			self.chord = inputFactory.User.chord;
		})
		$scope.$watch(function() {
			return inputFactory.User.scale;
		}, function(newVal, oldVal) {
			self.scale = inputFactory.User.scale;
		})

		$scope.$watch(function() {
			return self.activeDevice;
		}, function() {
			inputFactory.plug(self.activeDevice);

		});



	}]);
})();