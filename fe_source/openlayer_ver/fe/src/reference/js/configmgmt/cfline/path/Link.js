/**
 * Link.js
 *  
 * *** 수정이력 ***
 * 2018-09-12 1.RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 
 */
function Link() {
	
	this.LINK_SEQ = 0;
	this.LINK_ID = '';
	this.LINK_DIRECTION  = '';
	this.LINK_STATUS_CD  = '';
	this.LINK_STATUS_NM = ''; 	
	
	this.leftNode = new Node();
	this.rightNode = new Node();
	
	this.Trunk = null;
	this.Ring = null;
	this.WdmTrunk = null;
	
	/*2018-09-12 1.RU고도화*/
	this.Service = null;
	
	// 2019-10-29 기간망 링 선번 고도화
	this.REFC_RONT_TRK_NTWK_LINE_NM = '';
	this.REFC_RONT_TRK_NTWK_LINE_NO = '';
	
	/* TEAMS의 Path를 TANGO Path로 변경시 사용네트워크를 삭제하는 작업을 할때 
	 * 트렁크와 링의 경우 첫 링크를 삭제작업하는데 트렁크의 첫 링크 삭제시 링의 첫 링크도 삭제(트렁크의 첫 노드가 링의노드로 시작하는 경우)가 되어 링의 첫 링크를 상실(링 소속 링크가아닌 트렁크 소속 링크가 되어버림) 
	 * 이런경우를 대비하기 위해 트렁크 삭제건에 의한 링 삭제건인지 체크하여 이중(트렁크로삭제링으로삭제)으로 첫링크가 삭제되는 것을 방지함  */
	this.REMOVED_RING_INFO_LINK = '';   // 트렁크에의해 지워진 링의 첫 링크
};


Link.prototype = new Object();

Link.prototype.constructor = Link;


/**
 * Object Type 의 이 객체를 TeamsPath Type 객체로 변환한다. 
 */
Link.prototype.resetPrototype = function() {

	/*2018-09-12 1.RU고도화*/
	if ( this.Service != null ) {
		Object.setPrototypeOf(this.Service, Network.prototype);
	}
	
	if ( this.Trunk != null ) {
		Object.setPrototypeOf(this.Trunk, Network.prototype);
	}
	
	if ( this.Ring != null ) {
		Object.setPrototypeOf(this.Ring, Network.prototype);
	}
	
	if ( this.WdmTrunk != null ) {
		Object.setPrototypeOf(this.WdmTrunk, Network.prototype);
	}
	
	
	if ( this.leftNode != null ) {
		Object.setPrototypeOf(this.leftNode, Node.prototype);
	}
	
	if ( this.rightNode != null ) {
		Object.setPrototypeOf(this.rightNode, Node.prototype);
	}
};





Link.prototype.fromData = function( obj ) {
	copyAttributeWithoutExcludePrefix( obj, this, [ 'LEFT_', 'RIGHT_', 'NODE_', 'ADD_DROP_TYPE_' ] );
	
	this.leftNode.fromData( obj, 'LEFT_' );
	this.rightNode.fromData( obj, 'RIGHT_' );

	/*2018-09-12 1.RU고도화*/
	if ( isNullOrEmpty(obj.SERVICE_ID) == false ) {
		this.Service = new Network();
		this.Service.fromData(obj, 'SERVICE_');
	}
	
	if ( isNullOrEmpty(obj.TRUNK_ID) == false ) {
		this.Trunk = new Network();
		this.Trunk.fromData(obj, 'TRUNK_');
	}

	if ( isNullOrEmpty(obj.RING_ID) == false ) {
		this.Ring = new Network();
		this.Ring.fromData(obj, 'RING_');
	}

	if ( isNullOrEmpty(obj.WDM_TRUNK_ID) == false ) {
		this.WdmTrunk = new Network();
		this.WdmTrunk.fromData(obj, 'WDM_TRUNK_');
	}
		
	// 2019-10-29 기간망 링 선번 고도화
	this.REFC_RONT_TRK_NTWK_LINE_NM = obj.REFC_RONT_TRK_NTWK_LINE_NM;
	this.REFC_RONT_TRK_NTWK_LINE_NO = obj.REFC_RONT_TRK_NTWK_LINE_NO;
};





Link.prototype.toData = function( obj, prefix ) {
	
	copyAttributeAll( this, obj );
	this.leftNode.toData(obj, 'LEFT_' );
	this.rightNode.toData(obj,  'RIGHT_' );

	/*2018-09-12 1.RU고도화*/
	if ( this.Service != null  ) {
		this.Service.toData(obj, 'SERVICE_');
	}
	
	if ( this.Trunk != null  ) {
		this.Trunk.toData(obj, 'TRUNK_');
	}

	if ( this.Ring != null  ) {
		this.Ring.toData(obj, 'RING_');
	}

	if ( this.WdmTrunk != null ) {
		this.WdmTrunk.toData(obj, 'WDM_TRUNK_');
	}

	var topNetwork = this.getTopNetwork();
	if ( topNetwork != null ) {
		topNetwork.toData(obj, 'USE_NETWORK_');
	}
};





/**
 * WEST, EAST 노드를 맞바꾼다.
 */
Link.prototype.swapNode = function() {
	
	var temp = this.rightNode;
	this.rightNode = this.leftNode;
	this.leftNode = temp;
};


/**
 * 방향을 바꾼다.
 */
Link.prototype.reverseDirection = function() {
	
	if ( this.LINK_DIRECTION == 'RIGHT' ) {
		this.LINK_DIRECTION = 'LEFT'
	} else if ( this.LINK_DIRECTION == 'LEFT' ) {
		this.LINK_DIRECTION = 'RIGHT'
	}
	
};



/*2018-09-12 1.RU고도화*/
/**
 * 이 노드가 서비스회선에 속한 구간인지 여부
 * @returns {Boolean}
 */
Link.prototype.isServiceLink = function() {
	if ( this.Service != null && this.Service.isValid() ) {
		return true;
	}
	
	return false;
};

/**
 * 이 노드가 서비스회선에 속한 노드인 경우 트렁크 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
Link.prototype.getService = function() {
	if ( this.isServiceLink() ) {
		return this.Service;
	}
	
	return null;
};


/**
 * 이 노드가 서비스회선에 속한 노드인 경우 서비스회선 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getServiceId = function() {
	if ( this.isServiceLink() ) {
		return this.Service.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 서비스회선에 속한 노드인 경우 서비스회선 명.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getServiceNm = function() {
	if ( this.isServiceLink() ) {
		return this.Service.NETWORK_NM;
	}
	
	return '';
};


/**
 * 이 노드가 트렁크에 속한 구간인지 여부
 * @returns {Boolean}
 */
Link.prototype.isTrunkLink = function() {
	if ( this.Trunk != null && this.Trunk.isValid() ) {
		return true;
	}
	
	return false;
};

/**
 * 이 노드가 트렁크에 속한 노드인 경우 트렁크 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
Link.prototype.getTrunk = function() {
	if ( this.isTrunkLink() ) {
		return this.Trunk;
	}
	
	return null;
};


/**
 * 이 노드가 트렁크에 속한 노드인 경우 트렁크 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getTrunkId = function() {
	if ( this.isTrunkLink() ) {
		return this.Trunk.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 트렁크에 속한 노드인 경우 트렁크 명.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getTrunkNm = function() {
	if ( this.isTrunkLink() ) {
		return this.Trunk.NETWORK_NM;
	}
	
	return '';
};




/**
 * 이 노드가 링에 속한 구간인지 여부
 * @returns {Boolean}
 */
Link.prototype.isRingLink = function() {
	if ( this.Ring != null && this.Ring.isValid() ) {
		return true;
	}
	
	return false;
};


/**
 * 이 노드가 링에 속한 노드인 경우 링 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
Link.prototype.getRing = function() {
	if ( this.isRingLink() ) {
		return this.Ring;
	}
	
	return null;
};


/**
 * 이 노드가 링에 속한 노드인 경우 링 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getRingId = function() {
	if ( this.isRingLink() ) {
		return this.Ring.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 링에 속한 노드인 경우 링 명.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getRingNm = function() {
	if ( this.isRingLink() ) {
		return this.Ring.NETWORK_NM;
	}
	
	return '';
};




/**
 * 이 노드가 WDM 트렁크에 속한 구간인지 여부
 * @returns {Boolean}
 */
Link.prototype.isWdmTrunkLink = function() {
	if ( this.WdmTrunk != null && this.WdmTrunk.isValid() ) {
		return true;
	}
	
	return false;
};


/**
 * 이 노드가 WDM 트렁크에 속한 노드인 경우 WDM 트렁크 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
Link.prototype.getWdmTrunk = function() {
	if ( this.isWdmTrunkLink() ) {
		return this.WdmTrunk;
	}
	
	return null;
};


/**
 * 이 노드가 WDM 트렁크에 속한 노드인 경우 WDM 트렁크 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getWdmTrunkId = function() {
	if ( this.isWdmTrunkLink() ) {
		return this.WdmTrunk.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 WDM 트렁크에 속한 노드인 경우 WDM 트렁크 명.  그렇지 않으면 NULL
 * @returns {String}
 */
Link.prototype.getWdmTrunkNm = function() {
	if ( this.isWdmTrunkLink() ) {
		return this.WdmTrunk.NETWORK_NM;
	}
	
	return '';
};


/**
 * 이 구간이 네트워크에 속한 구간인지 여부
 * @returns {Boolean}
 */
Link.prototype.isNetworkLink = function() {
	if ( this.isServiceLink() || this.isTrunkLink() || this.isRingLink() || this.isWdmTrunkLink() ) {
		return true;
	}
	
	return false;
};


/**
 * 이 구간이 네트워크 노드일 경우 이 구간을 직접적으로 소유한 네트워크 ( 부모 네트워크 ) 정보
 * @returns {Network}
 */
Link.prototype.getOwnerNetwork = function() {
	if ( this.isWdmTrunkLink() ) {
		return this.WdmTrunk;
	}
	else if ( this.isRingLink() ) {
		return this.Ring;
	}
	else if ( this.isTrunkLink() ) {
		return this.Trunk;
	}
	else if ( this.isServiceLink() ) {
		return this.Service;
	}
	
	return null;
};




/**
 * 이 구간이 네트워크 구간일 경우 이 구간의 최상위 네트워크 
 * ( '트렁크 - 링 - WDM 트렁크' 구간일 경우 트렁크 정보 )
 * @returns {Network}
 */
Link.prototype.getTopNetwork = function() {
	if ( this.isServiceLink() ) {
		return this.Service;
	}
	else if ( this.isTrunkLink() ) {
		return this.Trunk;
	}
	else if ( this.isRingLink() ) {
		return this.Ring;
	}
	else if ( this.isWdmTrunkLink() ) {
		return this.WdmTrunk;
	}
	
	return null;
};




Link.prototype.clone = function() {

	var obj = new Link();
	copyAttributeAll(this, obj);			

	if ( this.isServiceLink() ) {
		obj.Service = this.Service.clone();
	}
	
	if ( this.isTrunkLink() ) {
		obj.Trunk = this.Trunk.clone();
	}

	if ( this.isRingLink() ) {
		obj.Ring = this.Ring.clone();
	}

	if ( this.isWdmTrunkLink() ) {
		obj.WdmTrunk = this.WdmTrunk.clone();
	}
	
	obj.leftNode = this.leftNode.clone();
	obj.rightNode = this.rightNode.clone();
	
	return obj;
};



Link.prototype.toDebugString = function() {
	var str = '';
	str += '[LINK_SEQ:' + this.LINK_SEQ  + '][LINK_ID:'+ this.LINK_ID + '][LINK_DIRECTION:' + this.LINK_DIRECTION;
	str += '][LINK_STATUS_CD:' + this.LINK_STATUS_CD  + '][LINK_STATUS_NM:'+ this.LINK_STATUS_NM; 
	
	str += '\nSERVICE-\n';
	if ( this.Service != null ) {
		str += this.Service.toDebugString();
	}
	
	str += '\nTRUNK-\n';
	if ( this.Trunk != null ) {
		str += this.Trunk.toDebugString();
	}

	str += '\nRING-\n';
	if ( this.Ring != null ) {
		str += this.Ring.toDebugString();
	}

	str += '\nWDM_TRUNK-\n';
	if ( this.WdmTrunk != null ) {
		str += this.WdmTrunk.toDebugString();
	}	
	
	str += '\nLEFT NODE\n' + this.leftNode.toDebugString(); 
	str += '\n\nRIGHT NODE\n' + this.rightNode.toDebugString(); 

	return str;
};



Link.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {

		if ( this.leftNode !== other.leftNode ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.leftNode) == false && isNullOrEmpty(other.leftNode) == false && this.leftNode.equals(other.leftNode) ) {
			return true;
		} else {
			return false;
		}
		
		if ( this.rightNode !== other.rightNode ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.rightNode) == false && isNullOrEmpty(other.rightNode) == false && this.rightNode.equals(other.rightNode) ) {
			return true;
		} else {
			return false;
		}
		
		/* 2018-09-12  1. RU 고도화   */
		if ( this.Service !== other.Service ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.Service) == false && isNullOrEmpty(other.Service) == false && this.Service.equals(other.Service) ) {
			return true;
		} else {
			return false;
		}
		
		if ( this.Trunk !== other.Trunk ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.Trunk) == false && isNullOrEmpty(other.Trunk) == false && this.Trunk.equals(other.Trunk) ) {
			return true;
		} else {
			return false;
		}
		
		
		if ( this.Ring !== other.Ring ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.Ring) == false && isNullOrEmpty(other.Ring) == false && this.Ring.equals(other.Ring) ) {
			return true;
		} else {
			return false;
		}
		
		
		if ( this.WdmTrunk !== other.WdmTrunk ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.WdmTrunk) == false && isNullOrEmpty(other.WdmTrunk) == false && this.WdmTrunk.equals(other.WdmTrunk) ) {
			return true;
		} else {
			return false;
		}		
		
	} else {
		return false;
	}

};



/**
 * 사용 네트워크에 대해 지운다.
 * 상위 사용 네트워크를 지우면 그 하위 사용 네트워크도 지운다.
 * EX) 트렁크를 삭제하면 링, WDM 트렁크도 지운다.
 * 
 * @param useNetworkAttrName
 */
Link.prototype.removeUseNetworkDescendants = function( useNetworkAttrName ) {
	
	if ( useNetworkAttrName == 'Service' ) {
		this.Service = null;
		this.Trunk = null;
		this.Ring = null;
		this.WdmTrunk = null;
	} else if ( useNetworkAttrName == 'Trunk' ) {
		this.Trunk = null;
		if (this.Ring != null) {
			this.Ring = null;
			this.REMOVED_RING_INFO_LINK = 'Y';   // 트렁크에의해 지워진 링의 첫 링크
		}
		this.WdmTrunk = null;
	} else if ( useNetworkAttrName == 'Ring' ) {
		this.Ring = null;
		this.WdmTrunk = null;
	}	
	
};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 작업후 TeamsPath isChange 함수 추가함...
 * 기존 Link.prototype.equals 가 다른 요소값(NODE ID)의 비교 오류로 함수를 추가함
 * 
 * return : 변경된경우 - true, 변경되지 않은 경우 - false
 * */
Link.prototype.isChange = function(other) {
	
		/*if ( this.leftNode !== other.leftNode ) {
			return true;
		}*/
		
		if ( isNullOrEmpty(this.leftNode) == false && isNullOrEmpty(other.leftNode) == false && this.leftNode.isChange(other.leftNode) ) {
			return true;
		} 
		
		/*if ( this.rightNode !== other.rightNode ) {
			return true;
		}*/
		
		if ( isNullOrEmpty(this.rightNode) == false && isNullOrEmpty(other.rightNode) == false && this.rightNode.isChange(other.rightNode) ) {
			return true;
		} 
		
		/* 2018-09-12  1. RU 고도화   */
		/*if ( this.Service !== other.Service ) {
			return true;
		}*/
		
		if ( (isNullOrEmpty(this.Service) == false && isNullOrEmpty(other.Service) == true) || (isNullOrEmpty(this.Service) == true && isNullOrEmpty(other.Service) == false) ) {
			return true;
		}
		else if ( isNullOrEmpty(this.Service) == false && isNullOrEmpty(other.Service) == false && this.Service.isChange(other.Service)  == true ) {
			return true;
		} 
		
		/*if ( this.Trunk !== other.Trunk ) {
			return true;
		}*/
		

		if ( (isNullOrEmpty(this.Trunk) == false && isNullOrEmpty(other.Trunk) == true) || (isNullOrEmpty(this.Trunk) == true && isNullOrEmpty(other.Trunk) == false) ) {
			return true;
		}
		else if ( isNullOrEmpty(this.Trunk) == false && isNullOrEmpty(other.Trunk) == false && this.Trunk.isChange(other.Trunk)  == true) {
			return true;
		}
		
		
		/*if ( this.Ring !== other.Ring ) {
			return true;
		}*/
		
		if ( (isNullOrEmpty(this.Ring) == false && isNullOrEmpty(other.Ring) == true) || (isNullOrEmpty(this.Ring) == true && isNullOrEmpty(other.Ring) == false) ) {
			return true;
		} 
		else if ( isNullOrEmpty(this.Ring) == false && isNullOrEmpty(other.Ring) == false && this.Ring.isChange(other.Ring)  == true) {
			return true;
		} 
		
		
		/*if ( this.WdmTrunk !== other.WdmTrunk ) {
			return true;
		}*/
		
		if ( (isNullOrEmpty(this.WdmTrunk) == false && isNullOrEmpty(other.WdmTrunk) == true) || (isNullOrEmpty(this.WdmTrunk) == true && isNullOrEmpty(other.WdmTrunk) == false) ) {
			return true;
		}
		else if ( isNullOrEmpty(this.WdmTrunk) == false && isNullOrEmpty(other.WdmTrunk) == false && this.WdmTrunk.isChange(other.WdmTrunk)  == true) {
			return true;
		}
		
		return false;
};
