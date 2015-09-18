angular.module('app')
	.controller('PracticeCtrl', function() {
		var self = this;

		self.radio = 'chord';
		self.checkbox = {};
		self.chords = {};
		self.scales = {};
		self.intervals = {};


		var chords = ['Maj7', 'min7', '7', 'dim7'];
		var scales = ['Major', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Minor', 'Locrian'];
		var intervals = ['Unison', 'm2', 'M2', 'm3', 'M3', 'P4', 'P5', 'm6', 'M6', 
			'm7',  'M7', 'Octave'];


		// self.scales = chunk(scales, 4);
		self.chordsArr = chords;
		self.scalesArr = scales;
		self.intervalsArr = intervals;
		console.log('PracticeCtrl loaded');

		setScales();
		// placeholder function name
		function setScales() {
			var i;
			for (i=0;i<chords.length; i++)
				self.chords[chords[i]] = false;
			for (i=0;i<scales.length; i++)
				self.scales[scales[i]] = false;
			for (i=0;i<intervals.length; i++)
				self.intervals[intervals[i]] = false;
		}

		self.isShown = function(choice) {
			return (choice === self.radio);
		};



		function chunk(arr, size) {
			var newArr = [];
			for (var i=0; i<arr.length; i+=size)
				newArr.push(arr.slice(i,i+size));
			return newArr;
		}
	});