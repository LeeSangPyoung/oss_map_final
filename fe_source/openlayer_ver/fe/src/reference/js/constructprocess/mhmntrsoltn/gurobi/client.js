//var URL = "https://150.24.192.198:1258";
//var URL = "https://tbiesapi.sktelecom.com:1258";
 
var requested = false;
var socket = undefined;
var gurobi_callbacks = {};
var gurobi_callbacks_k = {};
var opertionType = 1; // 1 : 단일, 2 : 다중

function gurobi_start(username, inputJson, ot) {
	opertionType = ot;
	
	$('#loadingBar').show();
	
	if (socket == undefined || socket == null) {
		socket = io.connect("https://tbiesapi.sktelecom.com:1258", {'sync disconnect on unload': true });
		socket.on('connect', function() {
			console.log('connect');
			requested = true;
			socket.emit('auth', 1, username);

			if(opertionType == 1) {
				if (gurobi_callbacks['connect'] !== undefined) {
					gurobi_callbacks['connect']();
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['connect'] !== undefined) {
					gurobi_callbacks_k['connect']();
				}
			}
		});

		socket.on('connect_failed', function() {
			console.log('connect_failed');
			
			if(opertionType == 1) {
				if (gurobi_callbacks['connect_failed'] !== undefined) {
					gurobi_callbacks['connect_failed']();
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['connect_failed'] !== undefined) {
					gurobi_callbacks_k['connect_failed']();
				}
			}
			
			$('#loadingBar').hide();
		});

		socket.on('disconnect', function() {
			console.log('disconnect');
			
			if(opertionType == 1) {
				if (gurobi_callbacks['disconnect'] !== undefined) {
					requested = false;
					gurobi_callbacks['disconnect']();
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['disconnect'] !== undefined) {
					requested = false;
					gurobi_callbacks_k['disconnect']();
				}
			}
			
			$('#loadingBar').hide();
		});

		socket.on('onAuth', function(haveJob) {
			console.log('listening...');

			if (haveJob === false && inputJson !== undefined) {
				requested = true;
				socket.emit('request', inputJson);
			}

			if (inputJson === undefined) {
				
				$('#loadingBar').hide();
				
				requested = false;
			}
		});

		socket.on('onStart', function(threadId) {
			console.log('onStart thread_id=' + threadId);
			
			if(opertionType == 1) {
				if (gurobi_callbacks['onStart'] !== undefined) {
					gurobi_callbacks['onStart'](threadId);
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['onStart'] !== undefined) {
					gurobi_callbacks_k['onStart'](threadId);
				}
			}
		});

		socket.on('onMsg', function(msg) {
			console.log('onMsg ' + msg);
		});

		socket.on('onResult', function(idx, resultJson) {
			// console.log('onResult idx=' + idx + ", json=" + resultJson);
			requested = false;
			inputJson = undefined;
			
			if(opertionType == 1) {
				if (gurobi_callbacks['onResult'] !== undefined) {

					gurobi_callbacks['onResult'](idx, resultJson);
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['onResult'] !== undefined) {

					gurobi_callbacks_k['onResult'](idx, resultJson);
				}
			}
			
			$('#loadingBar').hide();
		});

		socket.on('onEndFailed', function(msg) {
			console.log('onEndFailed ' + msg);
			requested = false;
			inputJson = undefined;
			
			if(opertionType == 1) {
				if (gurobi_callbacks['onEndFailed'] !== undefined) {
					gurobi_callbacks['onEndFailed'](msg);
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['onEndFailed'] !== undefined) {
					gurobi_callbacks_k['onEndFailed'](msg);
				}
			}
			
			$('#loadingBar').hide();
		});

		socket.on('duplicated', function() {
			console.log('duplicated ');
			
			if(opertionType == 1) {
				if (gurobi_callbacks['duplicated'] !== undefined) {
					gurobi_callbacks['duplicated']();
				}
			} else if(opertionType == 2) {
				if (gurobi_callbacks_k['duplicated'] !== undefined) {
					gurobi_callbacks_k['duplicated']();
				}
			}
			
			$('#loadingBar').hide();
		});

		console.log('socket created');
	} else {
		if (gurobi_available()) {
			console.log('request...');
			
			if (inputJson !== undefined && inputJson !== null) {
				requested = true;
				socket.emit('request', inputJson);
			}
			
		} else
			return false;
	}

	return true;
}

function gurobi_available() {
	return !requested;
}
