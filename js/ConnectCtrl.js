angular.module('app')
    .controller('ConnectCtrl', ['$scope', 'Devices', function($scope, devices) {
        var self = this;
        self.devices = [];
        // Alesis Q49
        self.down_num = 144;
        self.up_num = 128;
        self.key_map = [];
        self.key_vel = [];
        self.key_history = [];
        var keyh_index = 0;
        self.major_chords = [];
        self.major_chord_names = [];
        self.minor_chords = [];
        self.minor_chord_names = [];
        self.chord = "";

        generateMapping();
        generateChords();
        // testSound();
        // generateSounds();

        devices
            .connect()
            .then(function(access) {
                if (access.inputs && access.inputs.size > 0) {
                    var inputs = access.inputs.values(),
                        input = null;

                    // iterate through the devices
                    for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                        self.devices.push(input.value);
                    }
                } else {
                    console.error('No devices detected!');
                }


                self.inputs = access.inputs;
                angular.forEach(access.inputs, function(input) {
                    input.onmidimessage = function(e) {
                        var key_state = e.data[0];
                        var key_num = e.data[1];
                        var key_vel = e.data[2];

                        if (input.name === 'C.24') { // Miselu C.24
                            if (key_state === 144) { // key down/up
                                if (key_vel !== 0) {
                                    self.key_map[key_num] = true;
                                    self.key_vel[key_num] = key_vel;
                                    self.key_history[keyh_index] = key_num % 12;
                                    keyh_index = (keyh_index+1) % 3;
                                    checkChord();
                                    $scope.$apply();
                                } else {
                                    self.key_map[key_num] = false;
                                    $scope.$apply();
                                }
                            }
                        } else if (input.name === 'Q49' ||
                            input.name === 'CASIO USB-MIDI') { // alesis Q49
                            if (key_state === self.down_num){
                                self.key_map[key_num] = true;
                                self.key_vel[key_num] = key_vel;
                                self.key_history[keyh_index] = key_num % 12;
                                keyh_index = (keyh_index+1) % 3;
                                checkChord();
                                $scope.$apply();
                            } else {
                                self.key_map[key_num] = false;
                                $scope.$apply();
                            }
                        } else {
                            console.log(input.name, e.data);
                        }
                    };
                });

            })
            .catch(function(e) {
                console.error(e);
            });


        function generateMapping() {
            // fill key_map array with false
            for (var i=0; i<=108; i++){
                self.key_map.push(false);
                self.key_vel.push(0);
            }

            // generate midi numbers for white keys from C1 to C5
            var map_white = [];
            i = 24;
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
            // console.log(map_black);
            
            self.index_white = [];
            self.index_black = [];

            // // set the first 2 elements to 0
            // for (i=0; i<2; i++) {
            //     self.index_white.push(0);
            //     self.index_black.push(0);
            // }
            self.index_white.push(21);
            self.index_white.push(23);
            self.index_black.push(22);
            self.index_black.push(0);
            self.index_white.push.apply(self.index_white, map_white);
            self.index_black.push.apply(self.index_black, map_black);
            for (i=0; i<30; i++) {
                self.index_white.push(0);
                self.index_black.push(0);
            }
        }

        function testSound() {
            var sound = new Howl({
                urls: ['sounds/toss.wav'],
                volume: 0.3,
                onloaderror: function() {
                    console.log('Error loading file.');
                }
            });
            sound.play();
        }

        function generateChords() {
            var i;
            for (i=0;i<3;i++)
                self.key_history.push(0);


            // MIDI MAPPING
            // 0 C      6  F#
            // 1 C#     7  G
            // 2 D      8  G#
            // 3 D#     9  A
            // 4 E      10 A#
            // 5 F      11 B
            var root, third, fifth;
            for (i=0;i<12;i++) {
                root = i;
                third = (i+4) % 12;
                fifth = (i+7) % 12;
                self.major_chords.push([root, third, fifth]);
            }

            for (i=0;i<12;i++) {
                root = i;
                third = (i+3) % 12;
                fifth = (i+7) % 12;
                self.minor_chords.push([root, third, fifth]);
            }

            var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
                'A', 'A#', 'B'];

            var major_chord, minor_chord;
            for (i=0; i<12; i++) {
                major_chord = notes[i] + ' Major';
                self.major_chord_names.push(major_chord);
                minor_chord = notes[i] + ' Minor';
                self.minor_chord_names.push(minor_chord);
            }
        }

        function checkChord() {
            var i, j;
            var history = self.key_history.slice(-3);
            var sortNum = function(a,b) {
                return a-b;
            }
            history.sort(sortNum);

            for (i=0; i<12; i++) {
                if (compareNotes(history, self.major_chords[i].sort(sortNum))){
                    self.chord = self.major_chord_names[i];
                    return;
                }
                if (compareNotes(history, self.minor_chords[i].sort(sortNum))){
                    self.chord = self.minor_chord_names[i];
                    return;
                }
            }

            self.chord = "";
        }

        function compareNotes(history, chord) {
            for (var i=0; i<history.length; i++) {
                if (history[i] !== chord[i])
                    return false;
            }
            return true;
        }

    }]);