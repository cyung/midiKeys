var Tree = function(value) {
  var newTree = {};

  newTree.value = value;
  newTree.children = [];
  newTree.chordNames = [];
  extend(newTree, treeMethods);

  return newTree;
};

var extend = function(to, from) {
  for (var key in from)
    to[key] = from[key];
};

var treeMethods = {};

treeMethods.addChild = function(value) {
  var child = Tree(value);
  this.children.push(child);
};

treeMethods.contains = function(target) {
  if (this.value === target)
    return true;

  for (var i=0; i<this.children.length; i++) {
    var child = this.children[i];
    if(child.contains(target))
      return true;
  }

  return false;
};

treeMethods.indexOfChild = function(array) {
  if (this.value === undefined || this.value.constructor !== Array)
    return -1;

  // shallow comparison for array
  for (var i=0; i<this.children.length; i++) {
    childArray = this.children[i].value;
    if (childArray.equals(array))
      return i;
  }

  return -1;
};

treeMethods.traverse = function(callback) {
  callback(this.value);

  if (!this.children) 
    return;

  for (var i=0; i<this.children.length; i++) {
    var child = this.children[i];
    child.traverse(callback);
  }
};

treeMethods.printBFS = function() {
  var queue = new Queue();
  queue.enqueue(this);

  while (queue.size() > 0) {
    var tree = queue.dequeue();
    for (var i=0; i<tree.children.length; i++) {
      queue.enqueue(tree.children[i]);
    }
  }
}






























