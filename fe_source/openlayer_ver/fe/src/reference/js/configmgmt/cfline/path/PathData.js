
function PathData( data ) {
	//	deep copy
	this.LINKS = JSON.parse(JSON.stringify(data.LINKS));
};


/**
 * 구간 순서를 설정한다.
 */
PathData.prototype.resetSeq = function() {

	for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	    var link = this.LINKS[idx];
	    link.LINK_SEQ = idx + 1;
	}	
};




/**
 * 구간 순서를 역순으로 뒤집고 노드 WEST, EAST 를 서로 맞바꾼다.
 */
PathData.prototype.reverseLinks = function( p_SwapNode ) {

	this.LINKS.reverse();

	if ( p_SwapNode ) {
	    for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	        var link = this.LINKS[idx];
            this.swapNode( link );
            this.reverseDirection( link );
	    }		
	}
    
};



/**
 * 노드의 WEST, EAST 노드를 맞바꾼다.
 */
PathData.prototype.swapNode = function( link ) {
	
	var leftNode = new Object;
	var rightNode = new Object;
	copyAttributeWithIncludePrefix( link, leftNode, 'LEFT_' );
	copyAttributeWithIncludePrefix( link, rightNode, 'RIGHT_' );
	
	copyAttributeWithReplacingPrefix( rightNode, link, 'RIGHT_' , 'LEFT_' );
	copyAttributeWithReplacingPrefix( leftNode, link, 'LEFT_' , 'RIGHT_' );

};


/**
 * 방향을 바꾼다.
 */
PathData.prototype.reverseDirection = function( link ) {
	
	if ( link.LINK_DIRECTION == 'RIGHT' ) {
		link.LINK_DIRECTION = 'LEFT'
	} else if ( link.LINK_DIRECTION == 'LEFT' ) {
		link.LINK_DIRECTION = 'RIGHT'
	}

	if ( link.RX_LINK_DIRECTION == 'RIGHT' ) {
		link.RX_LINK_DIRECTION = 'LEFT'
	} else if ( link.RX_LINK_DIRECTION == 'LEFT' ) {
		link.RX_LINK_DIRECTION = 'RIGHT'
	}
	
};










