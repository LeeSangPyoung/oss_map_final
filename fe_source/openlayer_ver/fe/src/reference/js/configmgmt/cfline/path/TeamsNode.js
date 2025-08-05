/**
 * TeamsNode.js
 * 
 * *** 수정이력 ***
 * 2018-09-12 1.RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 
 */

function TeamsNode() {
	//	노드 ID 는 UNIQUE 하며, 지정 후 변경되지 않는다.
	//	단, WDM 트렁크 선번 편집시 동일 장비를 연속으로 표시하여야 하므로
	//	선택선번에서 시각화로 삽입할 때 (insertNode) 에서 장비 노드는 NODE_ID 를 새로 생성한다.
	this.NODE_ID = guid(); 

	//	노드 순서
	this.SEQ = 0;
	
	this.NODE_ROLE_CD = '';
	this.NODE_ROLE_NM = '';

	this.ADD_DROP_TYPE_CD = '';
	this.ADD_DROP_TYPE_NM = '';
	
	this.Trunk = null;
	this.Ring = null;
	this.WdmTrunk = null;
	
	this.Ne = new Ne();
	this.APortDescr = new PortDescr();
	this.BPortDescr = new PortDescr();
	
	this.VERIFY_ERROR = 'N';
	this.VERIFY_PATH_RESULT = VERIFY_RESULT.NONE;
	
	/*2018-09-12 1.RU고도화 사용서비스회선 정보추가*/
	this.Service = null;
	
	// 2019-10-29 기간망 링 선번 고도화
	this.REFC_RONT_TRK_NTWK_LINE_NM = '';
	this.REFC_RONT_TRK_NTWK_LINE_NO = '';
	this.ADJACENT_NODE = '';
}


TeamsNode.prototype = new Object();

TeamsNode.prototype.constructor = TeamsNode;

/**
 * Object Type 의 이 객체를 TeamsPath Type 객체로 변환한다. 
 */
TeamsNode.prototype.resetPrototype = function() {
	/*2018-09-12 1.RU고도화 */
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
	
	if ( this.Ne != null ) {
		Object.setPrototypeOf(this.Ne, Ne.prototype);
	}
	
	if ( this.APortDescr != null ) {
		Object.setPrototypeOf(this.APortDescr, PortDescr.prototype);
	}
	
	if ( this.BPortDescr != null ) {
		Object.setPrototypeOf(this.BPortDescr, PortDescr.prototype);
	}
};



/**
 * NODE_ID 를 새로 발급한다.
 */
TeamsNode.prototype.resetNodeId = function() {
	this.NODE_ID = guid();	
};



TeamsNode.prototype.fromData = function( obj, prefix ) {
	
	this.NODE_ROLE_CD = obj[prefix + 'NODE_ROLE_CD'];
	this.NODE_ROLE_NM = obj[prefix + 'NODE_ROLE_NM'];

	this.ADD_DROP_TYPE_CD = obj[prefix + 'ADD_DROP_TYPE_CD'];
	this.ADD_DROP_TYPE_NM = obj[prefix + 'ADD_DROP_TYPE_NM'];

	this.Ne.fromData(obj, '');
	this.APortDescr.fromData(obj, 'A_');
	this.BPortDescr.fromData(obj, 'B_');

	/*2018-09-12 1.RU고도화 */
	if ( obj.hasOwnProperty('SERVICE_ID') ) {
		this.Service = new Network();
		this.Service.fromData(obj, 'SERVICE_');
	}
	
	if ( obj.hasOwnProperty('TRUNK_ID') ) {
		this.Trunk = new Network();
		this.Trunk.fromData(obj, 'TRUNK_');
	}

	if ( obj.hasOwnProperty('RING_ID') ) {
		this.Ring = new Network();
		this.Ring.fromData(obj, 'RING_');
	}
	
	if ( obj.hasOwnProperty('WDM_TRUNK_ID') ) {
		this.WdmTrunk = new Network();
		this.WdmTrunk.fromData(obj, 'WDM_TRUNK_');
	}	

};




TeamsNode.prototype.toData = function( obj, prefix ) {
	
	obj[prefix + 'NODE_ROLE_CD'] = this.NODE_ROLE_CD;
	obj[prefix + 'NODE_ROLE_NM'] = this.NODE_ROLE_NM;

	obj[prefix + 'ADD_DROP_TYPE_CD'] = this.ADD_DROP_TYPE_CD;
	obj[prefix + 'ADD_DROP_TYPE_NM'] = this.ADD_DROP_TYPE_NM;
	
	/*2018-09-12 1.RU고도화 */
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
	
	this.Ne.toData(obj, '');
	this.APortDescr.toData(obj, 'A_');
	this.BPortDescr.toData(obj, 'B_');
	
	if ( this.APortDescr.isNullRxPort() == false || this.BPortDescr.isNullRxPort() == false ) {
		obj['RX_NE_ID'] = this.Ne.NE_ID;
	}
	
	
	obj[prefix + 'VERIFY_PATH_RESULT'] = this.VERIFY_PATH_RESULT;
	obj[prefix + 'VERIFY_PATH_RESULT_MSG'] = this.VERIFY_PATH_RESULT_MSG();
	obj[prefix + 'VERIFY_PATH_RESULT_DETAIL_MSG'] = this.VERIFY_PATH_RESULT_DETAIL_MSG();
};


TeamsNode.prototype.isValid = function() {
	if ( this.Ne != null && this.Ne.isValid ) {
		return true;
	}
	
	return false;
};


/**
 * 장비가 NULL 인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isNull = function() {
	if ( this.Ne == null || this.Ne.isNull() ) {
		return true;
	}
	
	return false;
};



/**
 * A 포트가 NULL 인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isNullAPort = function() {
	if ( this.APortDescr == null || this.APortDescr.isNull() ) {
		return true;
	}
	
	return false;
};



/**
 * B 포트가 NULL 인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isNullBPort = function() {
	if ( this.BPortDescr == null || this.BPortDescr.isNull() ) {
		return true;
	}
	
	return false;
};



/**
 * ADD-DROP 구분이 ADD 인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isAddNode = function() {
	if ( this.isValid() && this.ADD_DROP_TYPE_CD == 'A' ) {
		return true;
	}
	
	return false;
};



/**
 * ADD-DROP 구분이 DROP 인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isDropNode = function() {
	if ( this.isValid() && this.ADD_DROP_TYPE_CD == 'D' ) {
		return true;
	}
	
	return false;
};





/**
 * A, B 포트를 서로 맞바꾼다.
 */
TeamsNode.prototype.swapPort = function() {
	
	var temp = this.APortDescr;
	this.APortDescr = this.BPortDescr;
	this.BPortDescr = temp;
	
};

/**
 * 이 노드가 트렁크에 속한 노드인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isTrunkNode = function() {
	if ( this.Trunk != null && this.Trunk.isValid() ) {
		return true;
	}
	
	return false;
};

/**
 * 이 노드가 트렁크에 속한 노드인 경우 트렁크 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
TeamsNode.prototype.getTrunk = function() {
	if ( this.isTrunkNode() ) {
		return this.Trunk;
	}
	
	return null;
};

/**
 * 이 노드가 트렁크에 속한 노드인 경우 트렁크 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getTrunkId = function() {
	if ( this.isTrunkNode() ) {
		return this.Trunk.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 트렁크에 속한 노드인 경우 트렁크 명.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getTrunkNm = function() {
	if ( this.isTrunkNode() ) {
		return this.Trunk.NETWORK_NM;
	}
	
	return '';
};




/**
 * 이 노드가 링에 속한 노드인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isRingNode = function() {
	if ( this.Ring != null && this.Ring.isValid() ) {
		return true;
	}
	
	return false;
};


/**
 * 이 노드가 링에 속한 노드인 경우 링 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
TeamsNode.prototype.getRing = function() {
	if ( this.isRingNode() ) {
		return this.Ring;
	}
	
	return null;
};


/**
 * 이 노드가 링에 속한 노드인 경우 링 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getRingId = function() {
	if ( this.isRingNode() ) {
		return this.Ring.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 링에 속한 노드인 경우 링 명.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getRingNm = function() {
	if ( this.isRingNode() ) {
		return this.Ring.NETWORK_NM;
	}
	
	return '';
};




/**
 * 이 노드가 WDM 트렁크에 속한 노드인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isWdmTrunkNode = function() {
	if ( this.WdmTrunk != null && this.WdmTrunk.isValid() ) {
		return true;
	}
	
	return false;
};


/**
 * 이 노드가 WDM 트렁크에 속한 노드인 경우 WDM 트렁크 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
TeamsNode.prototype.getWdmTrunk = function() {
	if ( this.isWdmTrunkNode() ) {
		return this.WdmTrunk;
	}
	
	return null;
};


/**
 * 이 노드가 WDM 트렁크에 속한 노드인 경우 WDM 트렁크 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getWdmTrunkId = function() {
	if ( this.isWdmTrunkNode() ) {
		return this.WdmTrunk.NETWORK_ID;
	}
	
	return '';
};


/**
 * 이 노드가 WDM 트렁크에 속한 노드인 경우 WDM 트렁크 명.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getWdmTrunkNm = function() {
	if ( this.isWdmTrunkNode() ) {
		return this.WdmTrunk.NETWORK_NM;
	}
	
	return '';
};


/* 2018-09-12 1.RU고도화 시작*/
/**
 * 이 노드가 서비스에 속한 노드인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isServiceNode = function() {
	if ( this.Service != null && this.Service.isValid() ) {
		return true;
	}
	
	return false;
};

/**
 * 이 노드가 서비스에 속한 노드인 경우 서비스 정보 ( Network ).  그렇지 않으면 NULL
 * @returns {Network}
 */
TeamsNode.prototype.getService = function() {
	if ( this.isServiceNode() ) {
		return this.Service;
	}
	
	return null;
};

/**
 * 이 노드가 서비스에 속한 노드인 경우 서비스 ID.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getServiceId = function() {
	if ( this.isServiceNode() ) {
		return this.Service.NETWORK_ID;
	}
	
	return '';
};

/**
 * 이 노드가 서비스에 속한 노드인 경우 서비스 명.  그렇지 않으면 NULL
 * @returns {String}
 */
TeamsNode.prototype.getServiceNm = function() {
	if ( this.isServiceNode() ) {
		return this.Service.NETWORK_NM;
	}
	
	return '';
};

/* 2018-09-12 1.RU고도화 끝*/

/**
 * 이 노드가 네트워크에 속한 노드인지 여부
 * @returns {Boolean}
 */
TeamsNode.prototype.isNetworkNode = function() {
	if ( this.isServiceNode() || this.isTrunkNode() || this.isRingNode() || this.isWdmTrunkNode() ) {
		return true;
	}
	
	return false;
};


/**
 * 이 노드가 네트워크 노드일 경우 이 노드를 직접적으로 소유한 네트워크 ( 부모 네트워크 ) 정보
 * @returns {Network}
 */
TeamsNode.prototype.getOwnerNetwork = function() {
	if ( this.isWdmTrunkNode() ) {
		return this.WdmTrunk;
	}
	else if ( this.isRingNode() ) {
		return this.Ring;
	}
	else if ( this.isTrunkNode() ) {
		return this.Trunk;
	}
	else if ( this.isServiceNode() ) {
		return this.Service;
	}
	
	return null;
};




/**
 * 이 노드가 네트워크 노드일 경우 이 노드의 최상위 네트워크 
 * ( '트렁크 - 링 - WDM 트렁크' 노드일 경우 트렁크 정보 )
 * @returns {Network}
 */
TeamsNode.prototype.getTopNetwork = function() {
	if ( this.isServiceNode() ) {
		return this.Service;
	}
	if ( this.isTrunkNode() ) {
		return this.Trunk;
	}
	else if ( this.isRingNode() ) {
		return this.Ring;
	}
	else if ( this.isWdmTrunkNode() ) {
		return this.WdmTrunk;
	}
	
	return null;
};



/**
 * 사용 네트워크 방향을 바꾼다.
 */
TeamsNode.prototype.reverseUseNetworkDirection = function() {

	if ( this.isServiceNode() ) {
		this.Service.reverseDirection();
	}
	
	if ( this.isTrunkNode() ) {
		this.Trunk.reverseDirection();
	}
	
	if ( this.isRingNode() ) {
		this.Ring.reverseDirection();
	}

	if ( this.isWdmTrunkNode() ) {
		this.WdmTrunk.reverseDirection();
	}
	
};




/**
 * A, B 포트, 채널 편집 가능 여부를 기본값으로 설정한다.
 */
TeamsNode.prototype.resetPortDescrEditable = function() {

	this.APortDescr.resetPortDescrEditable();
	this.BPortDescr.resetPortDescrEditable();
	
	if ( this.Ne.isFdfRole() ) {
		this.APortDescr.EDITABLE_CHANNEL = false;
		this.BPortDescr.EDITABLE_CHANNEL = false;
	}
	
	if ( this.Ne.isNull() ) {
		this.APortDescr.EDITABLE_PORT = false;
		this.APortDescr.EDITABLE_CHANNEL = false;
		
		this.BPortDescr.EDITABLE_PORT = false;
		this.BPortDescr.EDITABLE_CHANNEL = false;
	}
	
};



TeamsNode.prototype.clone = function() {
	var obj = new TeamsNode();
	copyAttributeAll(this, obj);	
	
	//	노드 ID 는 UNIQUE 하며, 지정 후 변경하지 않는다.
	//	단, WDM 트렁크 선번 편집시 동일 장비를 연속으로 표시하여야 하므로
	//	선택선번에서 시각화로 삽입할 때 (insertNode) 에서 장비 노드는 NODE_ID 를 새로 생성한다.
//	obj.resetNodeId();
	if ( this.isServiceNode() ) {
		obj.Service = this.Service.clone();
	}
	
	if ( this.isTrunkNode() ) {
		obj.Trunk = this.Trunk.clone();
	}

	if ( this.isRingNode() ) {
		obj.Ring = this.Ring.clone();
	}

	if ( this.isWdmTrunkNode() ) {
		obj.WdmTrunk = this.WdmTrunk.clone();
	}
	
	obj.Ne = this.Ne.clone();
	obj.APortDescr = this.APortDescr.clone();
	obj.BPortDescr = this.BPortDescr.clone();
	
	return obj;
};


TeamsNode.prototype.toString = function() {
	var descr = '';
	if ( this.Ne != null ) {
		descr = this.Ne.toString();
		
		if ( this.APortDescr != null ) {
			descr += '\nEast' + this.APortDescr.toString();
		} else {
			descr += '\nEast 포트 정보 없음';
		}
		
		if ( this.BPortDescr != null ) {
			descr += '\nWest ' + this.BPortDescr.toString();
		} else {
			descr += '\nWest 포트 정보 없음';
		}		
		
	} else {
		descr = '장비 정보 없음';
	}

	return descr;
};



TeamsNode.prototype.nodeTitle = function() {
	if ( this.Ne == null ) {
		return '장비 정보 없음';
	} if ( isNullOrEmpty(this.Ne.NE_NM) ) {
		if ( isNullOrEmpty(this.Ne.ORG_NM) ) {			return '미확인장비';
		} else {
    		if ( this.Ne.NE_DUMMY ) {
        		return this.Ne.ORG_NM + '_미확인장비';
    		} else {
        		return this.Ne.ORG_NM;
    		}
		}
	} else {
		return this.Ne.NE_NM;
	}
};



TeamsNode.prototype.toDebugString = function() {
	var str = '';

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

	str += '\nNE -\n' + this.Ne.toDebugString();
	str += '\nA PORT -\n' + this.APortDescr.toDebugString();
	str += '\nB PORT - \n' + this.BPortDescr.toDebugString();

	return str;
};


TeamsNode.prototype.VERIFY_PATH_RESULT_MSG = function() {
	if ( isNullOrEmpty(this.VERIFY_PATH_RESULT) !== null ) {
		return this.VERIFY_PATH_RESULT.message;
	}

	return '';
};


TeamsNode.prototype.VERIFY_PATH_RESULT_DETAIL_MSG = function() {
	if ( isNullOrEmpty(this.VERIFY_PATH_RESULT) !== null ) {
		return this.VERIFY_PATH_RESULT.detailMessage;
	}

	return '';
};




TeamsNode.prototype.equalTopNetwork = function(other) {

	var thisNetwork = this.getTopNetwork();
	var otherNetwork = other.getTopNetwork();

	if ( thisNetwork != null && otherNetwork != null && thisNetwork.NETWORK_ID == otherNetwork.NETWORK_ID ) {
		return true;
	}

	return false;
};



TeamsNode.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {

		if ( this.Ne !== other.Ne ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.Ne) == false && isNullOrEmpty(other.Ne) == false && this.Ne.equals(other.Ne) ) {
			return true;
		} else {
			return false;
		}
		
		
		if ( this.APortDescr !== other.APortDescr ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.APortDescr) == false && isNullOrEmpty(other.APortDescr) == false && this.APortDescr.equals(other.APortDescr) ) {
			return true;
		} else {
			return false;
		}

		if ( this.BPortDescr !== other.BPortDescr ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.BPortDescr) == false && isNullOrEmpty(other.BPortDescr) == false && this.APortDescr.equals(other.BPortDescr) ) {
			return true;
		} else {
			return false;
		}		

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

