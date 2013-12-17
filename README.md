cluster-emitter
===============

an EventEmitter to let workers &amp; master communicate smoothly

```javascript
var emitter = require('cluster2/emitter');

emitter.on('event', function callback(){
	//an event callback
});

emitter.once('event', function callbackOnce(){
	//another event callback
});

emitter.removeListener('event', callback);
emitter.removeListener('event', callbackOnce);
emitter.removeAllListeners('event');

emitter.emit('event', 'arg0', 'arg1');
//it varies in master and worker runtime, in master it's the same as saying
emitter.emitTo(['self'].concat(_.map(cluster.workers, function(w){return w.process.pid;})), ['event', 'arg0', 'arg1']);
//as this indicates, the master's emit target by default is everybody, master itself and all active workers
//and in worker runtime, it's intepreted as worker itself and master
emitter.emitTo(['self', 'master'], ['event', 'arg0', 'arg1']);
//you don't have to use the different `emitTo` method unless you have a different targets set from the default explained above.
//but in cause you need, it's also simplified as:
emitter.to(['master']).emit('event', 'arg0', 'arg1');
//use to method to scope the target differently, the value should be an array of pids, or 'master', or 'self'

```
