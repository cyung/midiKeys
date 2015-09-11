(function() {
  'use strict';

  Array.prototype.equals = function(array) {
    if (!array || this.length !== array.length)
      return false;

    for (var i=0; i<this.length; i++) {
      if (this[i].constructor === Array && array[i].constructor === Array) {
        if (!this[i].equals(array[i]))
          return false;
      }
      else if (!this[i] !== array[i])
        return false;
    }

    return true;
  }
})();