var Whenever = function(){
	var callbacks = [];
	var ready = false;
	var args;
	return {
		get state(){
			return {
				ready: ready,
				args: args,
				pendingCallbacks: callbacks.length
			};
		},
		ready: function(){
			args = arguments;
			callbacks.forEach(function(callback){
				callback.apply(this, args);
			});
			callbacks = [];
			ready = true;
		},
		whenReady: function(callback){
			if(ready){
				callback.apply(this, args);
			}else{
				callbacks.push(callback);
			}
		}
	}
};