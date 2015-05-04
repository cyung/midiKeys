angular.module('app')
    .controller('ConnectCtrl', ['$scope', 'Devices', function($scope, devices) {
        $scope.devices = [];

        devices
            .connect()
            .then(function(access) {
                if ('function' === typeof access.inputs) {
                    // deprecated
                    $scope.devices = access.inputs();
                    console.error('Update your Chrome version!');
                } else {
                    if (access.inputs && access.inputs.size > 0) {
                        var inputs = access.inputs.values(),
                            input = null;

                        // iterate through the devices
                        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                            $scope.devices.push(input.value);
                        }
                    } else {
                        console.error('No devices detected!');
                    }

                }
            })
            .catch(function(e) {
                console.error(e);
            });
    }]);
