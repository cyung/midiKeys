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

treeMethods.indexOfChild = function(value) {
  if (this.value === undefined || value === undefined)
    return -1;

  // shallow comparison for array
  if (value.constructor === Array) {
    for (var i=0; i<this.children.length; i++) {
      childValue = this.children[i].value;
      for (var j=0; j<value.length; j++) {
        if (childValue[j] !== value[j])
          break;

        if (j === value.length-1) {
          return i;
        }
      }
    }
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
    console.log('--------------');
    var tree = queue.dequeue();
    for (var i=0; i<tree.children.length; i++) {
      console.log(tree.children[i].value);
      queue.enqueue(tree.children[i]);
    }
  }
}






























