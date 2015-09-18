(function() {
	'use strict';

	angular.module('app')
	.factory('scaleFactory', scaleFactory);

	function scaleFactory() {
		var scale_ionian = [];
		var scale_ionian_names = [];
		var scale_dorian = [];
		var scale_dorian_names = [];
		var scale_phrygian = [];
		var scale_phrygian_names = [];
		var scale_lydian = [];
		var scale_lydian_names = [];
		var scale_mixolydian = [];
		var scale_mixolydian_names = [];
		var scale_aeolian = [];
		var scale_aeolian_names = [];
		var scale_locrian = [];
		var scale_locrian_names = [];

		generateScales();
		sortScales();

		var services = {
			checkScale: checkScale
		};

		return services;

		function generateScales() {
			var n1, n2, n3, n4, n5, n6, n7,
				n1b, n2b, n2s, n3b, n4s, n5b, n5s, n6b, n6s, n7b;
			
			for (var i=0; i<12; i++) {
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

				scale_ionian     .push([n1 , n2  , n3  , n4  , n5  , n6  , n7  , n1]);
				scale_dorian     .push([n1 , n2  , n3b , n4  , n5  , n6  , n7b , n1]);
				scale_phrygian   .push([n1 , n2b , n3b , n4  , n5  , n6b , n7b , n1]);
				scale_lydian     .push([n1 , n2  , n3  , n4s , n5  , n6  , n7  , n1]);
				scale_mixolydian .push([n1 , n2  , n3  , n4  , n5  , n6  , n7b , n1]);
				scale_aeolian    .push([n1 , n2  , n3b , n4  , n5  , n6b , n7b , n1]);
				scale_locrian    .push([n1 , n2b , n3b , n4  , n5b , n6b , n7b , n1]);
			}

			var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
				'A', 'A#', 'B'];

			for (i=0; i<12; i++) {
				scale_ionian_names     .push(notes[i] + ' Ionian');
				scale_dorian_names     .push(notes[i] + ' Dorian');
				scale_phrygian_names   .push(notes[i] + ' Phrygian');
				scale_lydian_names     .push(notes[i] + ' Lydian');
				scale_mixolydian_names .push(notes[i] + ' Mixolydian');
				scale_aeolian_names    .push(notes[i] + ' Aeolian');
				scale_locrian_names    .push(notes[i] + ' Locrian');
			}
		}

		function sortScales() {
			var sortNum = function(a,b) {
				return a-b;
			};
			for (var i=0; i<12; i++) {
				scale_ionian[i]     .sort(sortNum);
				scale_dorian[i]     .sort(sortNum);
				scale_phrygian[i]   .sort(sortNum);
				scale_lydian[i]     .sort(sortNum);
				scale_mixolydian[i] .sort(sortNum);
				scale_aeolian[i]    .sort(sortNum);
				scale_locrian[i]    .sort(sortNum);
			}
		}

		function checkScale(key_history) {
			var i, j;
			// get scale using first note played
			var first_note = getHistory(key_history, 8, false)[0];
			var history = getHistory(key_history, 8, true);
			var scale = "";
			if (first_note === -1)
				return;

			if (compareNotes(history, scale_ionian[first_note])) {
				scale = scale_ionian_names[first_note];
			}
			else if (compareNotes(history, scale_dorian[first_note])) {
				scale = scale_dorian_names[first_note];
			}
			else if (compareNotes(history, scale_phrygian[first_note])) {
				scale = scale_phrygian_names[first_note];
			}
			else if (compareNotes(history, scale_lydian[first_note])) {
				scale = scale_lydian_names[first_note];
			}
			else if (compareNotes(history, scale_mixolydian[first_note])) {
				scale = scale_mixolydian_names[first_note];
			}
			else if (compareNotes(history, scale_aeolian[first_note])) {
				scale = scale_aeolian_names[first_note];
			}
			else if (compareNotes(history, scale_locrian[first_note])) {
				scale = scale_locrian_names[first_note];
			}

			return scale;
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
		 	return history;
		 }
	}
})();