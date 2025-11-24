//  var self = Worker;
self.onmessage = (ev) => {
  console.log(ev.data);
  postMessage('hello brutha')
};
console.log(1);
