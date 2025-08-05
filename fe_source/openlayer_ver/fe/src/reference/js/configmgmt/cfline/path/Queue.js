/**
 * Queue
 */
function Queue() {
	
	
	var queue = [];
	var offset = 0;
	
	/**
	 * 큐 길이
	 */
	this.length = function() {
		return ( queue.length - offset );
	}
	
	
	/**
	 * 큐가 비었는 지 여부
	 */
	this.isEmpty = function() {
		return ( queue.length === 0 );
	}
	
	
	/**
	 * Enqueue the specified item.
	 */
	this.enqueue = function(item) {
		queue.push(item);
	}
	
	/**
	 * Dequeue an item and return it.  If the queue is empty, the null is returned.
	 */
	this.dequeue = function() {
		//	if the queue is empty, return immediately
		if ( queue.length == 0 ) {
			return null;
		}
		
		//	store the item at the front of the queue
		var item = queue[offset];
		
		//	increment the offset and remove the free space if necessary
		if ( ++offset * 2 >= queue.length ) {
			queue = queue.slice(offset);
			offset = 0;
		}
		
		return item;
	}
	
	/**
	 * Returns the item at the front of the queue ( without dequeuing it ). 
	 * If the queue is empty then the null is returned. 
	 */
	this.peek = function() {
		if ( queue.length > 0 ) {
			return queue[offset];
		}
		
		return 0;
	}
	
}
