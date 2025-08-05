function StopWatch() {
	this.startTime = null;
	this.stopTime = null;
	this.isRunning = false;
};


StopWatch.prototype = new Object();

StopWatch.prototype.constructor = StopWatch;



StopWatch.prototype.start = function() {
	if ( this.isRunning == true ) {
		return;
	}  
		
	if ( this.startTime != null ) {
		this.stopTime = null;
	}
	
	this.isRunning = true;
	this.startTime = this.getTime();
};



StopWatch.prototype.stop = function() {
	if ( this.isRunning == false ) {
		return;
	}  
		
	this.stopTime = this.getTime();
	this.isRunning = false;
};



StopWatch.prototype.elapsed = function() {
	if ( this.startTime == null || this.stopTime == null ) {
		return 0;
	}  
		
	return ( this.stopTime - this.startTime ) / 1000;
};



StopWatch.prototype.getTime = function() {
	var day = new Date();
	return day.getTime();
};


