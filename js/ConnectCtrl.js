angular.module('app')
    .controller('ConnectCtrl', ['$scope', '$interval', 'Devices', function($scope, $interval, devices) {
        var self = this;
        self.devices = [];
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
        self.scale_ionian = [];
        self.scale_ionian_names = [];
        self.scale_dorian = [];
        self.scale_dorian_names = [];
        self.scale_phrygian = [];
        self.scale_phrygian_names = [];
        self.scale_lydian = [];
        self.scale_lydian_names = [];
        self.scale_mixolydian = [];
        self.scale_mixolydian_names = [];
        self.scale_aeolian = [];
        self.scale_aeolian_names = [];
        self.scale_locrian = [];
        self.scale_locrian_names = [];

        self.chord = "";
        self.scale = "";

        // set size for buffer
        clearHistory();

        generateMapping();
        generateChords();
        generateScales();
        sortArrays();
        self.quiz_chord = self.major_chord_names[Math.floor(Math.random()*12)];

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
                var stop;
                angular.forEach(access.inputs, function(input) {
                    input.onmidimessage = function(e) {
                        var key_state = e.data[0];
                        var key_num = e.data[1];
                        var key_vel = e.data[2];
                        if (angular.isDefined(stop)) {
                            $interval.cancel(stop);
                            stop = undefined;
                        }
                        stop  = $interval(function() {
                            clearHistory();
                        }, 1000);

                        if (input.name === 'C.24') { // Miselu C.24
                            if (key_state === 144) { // key down/up
                                if (key_vel !== 0) {
                                    keyDown(key_num, key_vel);
                                } else {
                                    self.key_map[key_num] = false;
                                    $scope.$apply();
                                }
                            }
                        } else if (input.name === 'Q49' ||
                            input.name === 'CASIO USB-MIDI') { // alesis Q49
                            if (key_state === self.down_num){
                                keyDown(key_num, key_vel);
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


        function keyDown(key_num, key_vel) {
            self.key_map[key_num] = true;
            self.key_vel[key_num] = key_vel;
            self.key_history.push(key_num % 12);
            if (self.key_history.length > 20)
                self.key_history.shift();
            checkChord();
            checkScale();
            checkChris();
            $scope.$apply();
        }

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
            // MIDI MAPPING
            // 0 C      6  F#
            // 1 C#     7  G
            // 2 D      8  G#
            // 3 D#     9  A
            // 4 E      10 A#
            // 5 F      11 B
            var i;
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

            for (i=0; i<12; i++) {
                self.major_chord_names.push(notes[i] + ' Major');
                self.minor_chord_names.push(notes[i] + ' Minor');
            }
        }

        function generateScales() {
            var i, j, n1, n2, n3, n4, n5, n6, n7;
            
            for (i=0; i<12; i++) {
                // set the intervals
                n1  = i;
                n1b = (i+1)  % 12;
                n2b = (i+1)  % 12;
                n2  = (i+2)  % 12;
                n2s = (i+3)  % 12;
                n3b = (i+3)  % 12;
                n3  = (i+4)  % 12;
                n4  = (i+5)  % 12;
                n4s = (i+6)  % 12;
                n5b = (i+6)  % 12;
                n5  = (i+7)  % 12;
                n5s = (i+8)  % 12;
                n6b = (i+8)  % 12;
                n6  = (i+9)  % 12;
                n6s = (i+10) % 12;
                n7b = (i+10) % 12;
                n7  = (i+11) % 12;

                self.scale_ionian     .push([n1 , n2  , n3  , n4  , n5  , n6  , n7  , n1]);
                self.scale_dorian     .push([n1 , n2  , n3b , n4  , n5  , n6  , n7b , n1]);
                self.scale_phrygian   .push([n1 , n2b , n3b , n4  , n5  , n6b , n7b , n1]);
                self.scale_lydian     .push([n1 , n2  , n3  , n4s , n5  , n6  , n7  , n1]);
                self.scale_mixolydian .push([n1 , n2  , n3  , n4  , n5  , n6  , n7b , n1]);
                self.scale_aeolian    .push([n1 , n2  , n3b , n4  , n5  , n6b , n7b , n1]);
                self.scale_locrian    .push([n1 , n2b , n3b , n4  , n5b , n6b , n7b , n1]);
            }

            var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
                'A', 'A#', 'B'];

            for (i=0; i<12; i++) {
                self.scale_ionian_names     .push(notes[i] + ' Ionian');
                self.scale_dorian_names     .push(notes[i] + ' Dorian');
                self.scale_phrygian_names   .push(notes[i] + ' Phrygian');
                self.scale_lydian_names     .push(notes[i] + ' Lydian');
                self.scale_mixolydian_names .push(notes[i] + ' Mixolydian');
                self.scale_aeolian_names    .push(notes[i] + ' Aeolian');
                self.scale_locrian_names    .push(notes[i] + ' Locrian');
            }

        }

        function checkChord() {
            var i;
            var history = getHistory(3, true);

            self.chord = "";
            for (i=0; i<12; i++) {
                if (compareNotes(history, self.major_chords[i])) {
                    self.chord = self.major_chord_names[i];
                    break;
                    // clearHistory();
                }
                if (compareNotes(history, self.minor_chords[i])) {
                    self.chord = self.minor_chord_names[i];
                    break;
                    // clearHistory();
                }
            }
            checkChordQuiz();
        }

        function checkScale() {
            var i, j;
            var first_note = getHistory(8, false)[0];
            var history = getHistory(8, true);
            self.scale = "";
            if (first_note === -1)
                return;
            if (compareNotes(history, self.scale_ionian[first_note])) {
                self.scale = self.scale_ionian_names[first_note];
                clearHistory();
            }
            else if (compareNotes(history, self.scale_dorian[first_note])) {
                self.scale = self.scale_dorian_names[first_note];
                clearHistory();
            }
            else if (compareNotes(history, self.scale_phrygian[first_note])) {
                self.scale = self.scale_phrygian_names[first_note];
                clearHistory();
            }
            else if (compareNotes(history, self.scale_lydian[first_note])) {
                self.scale = self.scale_lydian_names[first_note];
                clearHistory();
            }
            else if (compareNotes(history, self.scale_mixolydian[first_note])) {
                self.scale = self.scale_mixolydian_names[first_note];
                clearHistory();
            }
            else if (compareNotes(history, self.scale_aeolian[first_note])) {
                self.scale = self.scale_aeolian_names[first_note];
                clearHistory();
            }
            else if (compareNotes(history, self.scale_locrian[first_note])) {
                self.scale = self.scale_locrian_names[first_note];
                clearHistory();
            } else {
                return;
            }
            // checkScaleQuiz();
            return;
         }

        function clearHistory() {
            self.key_history = [];
            for (var j=0; j<20; j++)
                self.key_history.push(-1);
        }

        function sortArrays() {
            var sortNum = function(a,b) {
                return a-b;
            };
            for (var i=0; i<12; i++) {
                self.major_chords[i].sort(sortNum);
                self.minor_chords[i].sort(sortNum);
                self.scale_ionian[i].sort(sortNum);
                self.scale_dorian[i].sort(sortNum);
                self.scale_phrygian[i].sort(sortNum);
                self.scale_lydian[i].sort(sortNum);
                self.scale_mixolydian[i].sort(sortNum);
                self.scale_aeolian[i].sort(sortNum);
                self.scale_locrian[i].sort(sortNum);
            }
        }

        function getHistory(num_notes, sorted) {
            var history = self.key_history.slice(self.key_history.length-num_notes);
            var sortNum = function(a,b) {
                return a-b;
            };
            if (sorted)
                history.sort(sortNum);
            // remove duplicates
            // history = history.filter(function(elem, index, self) {
            //     return index == self.indexOf(elem);
            // });
            return history;
        }

        function checkChris() {
            var password = [8, 9, 8, 7, 8, 1, 4, 3, 1, 3, 1, 0, 1, 4, 8];
            var history = getHistory(password.length);

            for (var i=0; i<password.length; i++) {
                if (history[i] !== password[i])
                    return;
            }
            self.greeting = "Hello Chris!";
        }

        function compareNotes(history, chord) {
            if (history.length !== chord.length)
                return false;
            for (var i=0; i<history.length; i++) {
                if (history[i] !== chord[i])
                    return false;
            }
            return true;
        }

        function checkChordQuiz() {
            if (self.chord === self.quiz_chord){
                if (Math.random() > 0.5)
                    self.quiz_chord = self.major_chord_names[Math.floor(Math.random()*12)];
                else
                    self.quiz_chord = self.minor_chord_names[Math.floor(Math.random()*12)];
            }
        }

    }]);