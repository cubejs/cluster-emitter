'use strict';

var should = require('should'),
	_ = require('underscore'),
	fork = require('child_process').fork;

describe('cluster-emitter', function(){

	describe('master-emitter', function(){

		it('should work in none-cluster mode', function(done){

			this.timeout(500);

			var emitter = require('../index');

			emitter.should.be.ok;
			_.isFunction(emitter.emit).should.equal(true);
			_.isFunction(emitter.on).should.equal(true);
			_.isFunction(emitter.once).should.equal(true);
			_.isFunction(emitter.removeListener).should.equal(true);
			_.isFunction(emitter.removeAllListeners).should.equal(true);

			var event = 'event-' + Date.now(),
				echo = 'echo-' + event;

			emitter.once(echo, function(){//test once

				done();
			});

			emitter.on(event, function(){//test on

				emitter.emit(echo);
			});

			emitter.emit(event);//test emit
		});

		it('should return parent pid as null', function(done){

			this.timeout(500);

			var emitter = require('../index');

			emitter.should.be.ok;

			emitter.once('reply-parent-pid', function(parentPid){

				//parentPid should be null
				done(parentPid);
			});

			emitter.emit('ask-parent-pid', process.pid);
		})
	});

	//now we'll need to verify the test in cluster mode, for master emitter the behavior should be:
	//emit is to send the event to both master & all workers (we'll prepare a couple of workers at least 2 just to make sure)
	//on/once should listen to events emitted by either master or workers
	//removeListener/removeAllListeners should revoke all the listeners triggered above

	//for the slave emitter, the behavior should be:
	//emit is to sent the event to both master & the worker itself
	//on/once should listen to events emitted from either master or workers
	//removeListener/removeAllListeners should revoke all the listeners triggered abovesss

	describe('cluster-emitter', function(){

		it('should work in cluster mode', function(done){

			this.timeout(3000);

			var token = 't-' + Date.now(),
				clusterRuntime = fork(require.resolve('./lib/cluster-emitter-runtime'), ['--token=' + token]);
			
			clusterRuntime.on('message', function(msg){

				done(msg.exit);

			});

		});
	});

});