(function() {
	'use strict';

	angular.module('app')
	.factory('chordFactory', chordFactory);

	function chordFactory() {
		var major_chords = [];
		var major_chord_names = [];
		var minor_chords = [];
		var minor_chord_names = [];
		var maj7_chords = [];
		var maj7_chord_names = [];
		var min7_chords = [];
		var min7_chord_names = [];
		var dom7_chords = [];
		var dom7_chord_names = [];

		generateChords();
		sortChords();

		var services = {
			checkChord: checkChord
		};

		return services;

		function generateChords() {
			// MIDI MAPPING
			// 0 C      6  F#
			// 1 C#     7  G
			// 2 D      8  G#
			// 3 D#     9  A
			// 4 E      10 A#
			// 5 F      11 B
			var root, third, fifth, seventh;
			for (var i=0;i<12;i++) {
				root = i;
				third = (i+4) % 12;
				fifth = (i+7) % 12;
				seventh = (i+11) % 12;
				major_chords.push([root, third, fifth]);
				maj7_chords.push([root, third, fifth, seventh]);
			}

			for (i=0;i<12;i++) {
				root = i;
				third = (i+3) % 12;
				fifth = (i+7) % 12;
				seventh = (i+10) % 12;
				minor_chords.push([root, third, fifth]);
				min7_chords.push([root, third, fifth, seventh]);
				dom7_chords.push([root, ((third+1)%12), fifth, seventh]);
			}

			var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
				'A', 'A#', 'B'];

			for (i=0; i<12; i++) {
				major_chord_names.push(notes[i] + ' Major');
				minor_chord_names.push(notes[i] + ' Minor');
				maj7_chord_names.push(notes[i] + 'Maj7');
				dom7_chord_names.push(notes[i] + '7');
				min7_chord_names.push(notes[i] + 'm7');
			}
		}

		function sortChords() {
			var sortNum = function(a, b) {
				return a-b;
			};

			// sort the midi notes in each chord ascending
			for (var i=0; i<12; i++) {
				major_chords[i].sort(sortNum);
				minor_chords[i].sort(sortNum);
				maj7_chords[i].sort(sortNum);
				min7_chords[i].sort(sortNum);
				dom7_chords[i].sort(sortNum);
			}
		}

		function checkChord(key_history) {
			var i;
			var history = getHistory(key_history, 3, true);
			var history7 = getHistory(key_history, 4, true);

			var chord = '';
			for (i=0; i<12; i++) {
				if (compareNotes(history7, dom7_chords[i])) {
					chord = dom7_chord_names[i];
					break;
				}
				else if (compareNotes(history7, maj7_chords[i])) {
					chord = maj7_chord_names[i];
					break;
				}
				else if (compareNotes(history7, min7_chords[i])) {
					chord = min7_chord_names[i];
					break;
				}
				else if (compareNotes(history, major_chords[i])) {
					chord = major_chord_names[i];
					break;
				}
				else if (compareNotes(history, minor_chords[i])) {
					chord = minor_chord_names[i];
					break;
				}
			}
			return chord;
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

		// returns a sorted key history from the most recent N notes
		function getHistory(key_history, num_notes, sorted) {
			var history = key_history.slice(key_history.length - num_notes);
			var sortNum = function(a,b) {
				return a-b;
			};
			if (sorted)
				history.sort(sortNum);
			// remove duplicates
			history = history.filter(function(elem, index, self) {
			    return index == self.indexOf(elem);
			});
			return history;
		}
	}
})();