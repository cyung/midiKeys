var Queue = function() {
  this._storage = {};
  this._start = 0;
  this._end = 0;
};


Queue.prototype.enqueue = function(value){
  var self = this;
  var newStorage = {};
  _.each(self.storage, function(item,key){
    newStorage[+key+1] = item;
  });
  newStorage[0] = value;
  this.storage = newStorage;
},

Queue.prototype.dequeue = function(){
  var deleted = this.storage[this.size()-1];
  delete this.storage[this.size()-1];
  return deleted;
},

Queue.prototype.size = function(){
  return Object.keys(this.storage).length;
}