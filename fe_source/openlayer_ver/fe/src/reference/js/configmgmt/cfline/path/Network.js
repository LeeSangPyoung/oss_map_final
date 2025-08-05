/**
 * Network.js
 * 
 * *** 수정이력 ***
 * 2018-09-12 1.RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 
 */

function Network() {
	this.NETWORK_ID = '';
	this.NETWORK_NM = '';
	this.NETWORK_STATUS_CD = '';
	this.NETWORK_STATUS_NM = '';
	
	this.NETWORK_TYPE_CD = '';
	this.NETWORK_TYPE_NM = '';

	this.PATH_SAME_NO = '';
	this.PATH_DIRECTION = '';

	this.TOPOLOGY_LARGE_CD = '';
	this.TOPOLOGY_LARGE_NM = '';
	this.TOPOLOGY_SMALL_CD = '';
	this.TOPOLOGY_SMALL_NM = '';
	this.TOPOLOGY_CFG_MEANS_CD = '';
	this.TOPOLOGY_CFG_MEANS_NM = '';
	
	this.UPR_MTSO_ID = '';
	this.LOW_MTSO_ID = '';
	this.VIRTUAL_YN = 'N';
	
	/*2018-09-12 1.RU고도화 사용서비스회선 정보추가*/
	this.LINE_LARGE_CD = '';
	this.LINE_LARGE_NM = '';
	this.LINE_SMALL_CD = '';
	this.LINE_SMALL_NM = '';
	this.USE_SERVICE_YN = '';
	
	// 2019-10-21 기간망 링 선번 고도화
	this.RING_ID_L2 = '';
	this.RING_NM_L2 = '';
	this.RING_ID_L3 = '';
	this.RING_NM_L3 = '';
	this.RING_LVL = ''; 
};


Network.prototype = new Object();

Network.prototype.constructor = Network;


Network.prototype.fromData = function(obj, prefix) {
	
	this.NETWORK_ID = obj[prefix + 'ID'];
	this.NETWORK_NM = obj[prefix + 'NM'];
	
	this.NETWORK_STATUS_CD = obj[prefix + 'STATUS_CD'];
	this.NETWORK_STATUS_NM = obj[prefix + 'STATUS_NM'];

	this.NETWORK_TYPE_CD = obj[prefix + 'TYPE_CD'];
	this.NETWORK_TYPE_NM = obj[prefix + 'TYPE_NM'];
	
	this.PATH_SAME_NO = obj[prefix + 'PATH_SAME_NO'];
	this.PATH_DIRECTION = obj[prefix + 'PATH_DIRECTION'];

	this.TOPOLOGY_LARGE_CD = obj[prefix + 'TOPOLOGY_LARGE_CD'];
	this.TOPOLOGY_LARGE_NM = obj[prefix + 'TOPOLOGY_LARGE_NM'];
	this.TOPOLOGY_SMALL_CD = obj[prefix + 'TOPOLOGY_SMALL_CD'];
	this.TOPOLOGY_SMALL_NM = obj[prefix + 'TOPOLOGY_SMALL_NM'];
	this.TOPOLOGY_CFG_MEANS_CD = obj[prefix + 'TOPOLOGY_CFG_MEANS_CD'];
	this.TOPOLOGY_CFG_MEANS_NM = obj[prefix + 'TOPOLOGY_CFG_MEANS_NM'];

	this.UPR_MTSO_ID = obj[prefix + 'UPR_MTSO_ID'];
	this.LOW_MTSO_ID = obj[prefix + 'LOW_MTSO_ID'];
	
	this.VIRTUAL_YN = obj[prefix + 'VIRTUAL_YN'];	

	/*2018-09-12 1.RU고도화 사용서비스회선 정보추가*/
	if (prefix == 'SERVICE_') {
		this.LINE_LARGE_CD = obj[prefix + 'LINE_LARGE_CD'];
		this.LINE_LARGE_NM = obj[prefix + 'LINE_LARGE_NM'];
		this.LINE_SMALL_CD = obj[prefix + 'LINE_SMALL_CD'];
		this.LINE_SMALL_NM = obj[prefix + 'LINE_SMALL_NM'];	
		this.USE_SERVICE_YN = 'Y';
	}
	/*
	 * 2019-10-21 기간망 링 선번 고도화
	 * level 2차, 3차 레벨 정보
	 */
	if (prefix == 'RING_') {
		
		// 2차
		if (isNullOrEmpty(obj.RING_ID_L2) == false) {
			this.RING_ID_L2 = obj[prefix + 'ID_L2'];
			this.RING_NM_L2 = obj[prefix + 'NM_L2'];;
		}
		// 3차
		if (isNullOrEmpty(obj.RING_ID_L3) == false) {
			this.RING_ID_L3 = obj[prefix + 'ID_L3'];
			this.RING_NM_L3 = obj[prefix + 'NM_L3'];;
		}
		this.RING_LVL = obj[prefix + 'LVL'];
	}
};



Network.prototype.toData = function( obj, prefix ) {
	copyAttributeWithReplacingPrefix( this, obj, 'NETWORK_', prefix );
};




/**
 * 네트워크 ID 가 유효한지 여부 ( 네트워크 ID 가 NULL 또는 Empty 가 아닌 경우 ) 
 * @returns {Boolean}
 */
Network.prototype.isValid = function() {
	if ( isNullOrEmpty(this.NETWORK_ID) == false ) {
		return true;
	}
	
	return false;
};


/**
 * 네트워크 ID 가 NULL 또는 Empty 인 지 여부
 * @returns {Boolean}
 */
Network.prototype.isNull = function() {
	if ( isNullOrEmpty(this.NETWORK_ID) ) {
		return true;
	}
	
	return false;
};


/**
 * 가상 네트워크 여부
 * @returns {Boolean}
 */
Network.prototype.isVirtualNetwork = function() {
	if ( this.VIRTUAL_YN === 'Y' ) {
		return true;
	}
	
	return false;
};




/**
 * 방향을 바꾼다.
 */
Network.prototype.reverseDirection = function() {
	
	if ( this.PATH_DIRECTION == 'RIGHT' ) {
		this.PATH_DIRECTION = 'LEFT'
	} else if ( this.PATH_DIRECTION == 'LEFT' ) {
		this.PATH_DIRECTION = 'RIGHT'
	}
	
};


/**
 * 트렁크 여부
 */
Network.prototype.isTrunk = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && this.TOPOLOGY_LARGE_CD == '002'  ) {
		return true;
	}
	
	return false;
};

/**
 * 링 여부
 */
Network.prototype.isRing = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && this.TOPOLOGY_LARGE_CD == '001'  ) {
		return true;
	}
	
	return false;
};


/**
 * WDM 트렁크 여부
 */
Network.prototype.isWdmTrunk = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && isNullOrEmpty(this.TOPOLOGY_SMALL_CD) == false 
			&& this.TOPOLOGY_LARGE_CD == '003' && this.TOPOLOGY_SMALL_CD == '101' ) {
		return true;
	}
	
	return false;
};


/**
 * 서비스 여부
 */
Network.prototype.isService = function() {
	if ( this.USE_SERVICE_YN === 'Y' ) {
		return true;
	}
	
	return false;
};


/**
 * 2019-11-21  PTP타입 링여부 여부
 */
Network.prototype.isPtpTypeRing = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && isNullOrEmpty(this.TOPOLOGY_SMALL_CD) == false && this.TOPOLOGY_LARGE_CD == '001') {
		// 가입자망 링
	    if (this.TOPOLOGY_SMALL_CD == '031') {
	    	return true;
	    }
	    // 토폴로지가 있는 경우  PTP이면
	    if (isNullOrEmpty(this.TOPOLOGY_CFG_MEANS_CD) == false && this.TOPOLOGY_CFG_MEANS_CD == '002') {
	    	return true;
	    }
	    if (isNullOrEmpty(this.TOPOLOGY_CFG_MEANS_CD) == true  || this.TOPOLOGY_CFG_MEANS_CD == '000') {
	    	if (this.TOPOLOGY_SMALL_CD == '002' || this.TOPOLOGY_SMALL_CD == '035' || this.TOPOLOGY_SMALL_CD == '039') {
	    		return true;
	    	}
	    }
	}
	
	return false;
};


Network.prototype.clone = function() {
	var obj = new Network();
	copyAttributeAll(this, obj);		
	return obj;
};

Network.prototype.toString = function() {
	var descr = '';
	if ( this.isValid() ) {
		if (isNullOrEmpty(this.LINE_SMALL_CD) == false) {
			descr = '서비스회선명 : ' + nullToEmpty(this.NETWORK_NM) + '(' + nullToEmpty(this.NETWORK_ID) + ')\n상태 : ' + nullToEmpty(this.STATUS_NM)
			+ '\n서비스회선유형(대) : ' + nullToEmpty(this.LINE_LARGE_NM)
			+ '\n서비스회선유형(소) : ' + nullToEmpty(this.LINE_SMALL_NM);
			
		} else {
			descr = '네트워크명 : ' + nullToEmpty(this.NETWORK_NM) + '(' + nullToEmpty(this.NETWORK_ID) + ')\n상태 : ' + nullToEmpty(this.STATUS_NM)
							+ '\n토폴로지유형(대) : ' + nullToEmpty(this.TOPOLOGY_LARGE_NM)
							+ '\n토폴로지유형(소) : ' + nullToEmpty(this.TOPOLOGY_SMALL_NM);
		}
	} else {
		if (this.LINE_SMALL_CD != '') {
			descr = '서비스회선 정보 없음';
		} else {
			descr = '네트워크 정보 없음';
		}
	}

	return descr;
};





Network.prototype.toDebugString = function() {
	var str = '';
	if (isNullOrEmpty(this.LINE_SMALL_CD) == false) {
		str = '[NETWORK_ID:' + this.NETWORK_ID  + '][NETWORK_NM:'+ this.NETWORK_NM 
					+ '][NETWORK_STATUS_CD:' + this.NETWORK_STATUS_CD + '][NETWORK_STATUS_NM:' + this.NETWORK_STATUS_NM
					+ '][PATH_SAME_NO:' + this.PATH_SAME_NO + '][PATH_DIRECTION:' + this.PATH_DIRECTION
					+ '][LINE_LARGE_CD:' + this.LINE_LARGE_CD + '][LINE_LARGE_NM:' + this.LINE_LARGE_NM
					+ '][LINE_SMALL_CD:' + this.LINE_SMALL_CD  + '][LINE_SMALL_NM:'+ this.LINE_SMALL_NM
					+ '][VIRTUAL_YN:'+ this.VIRTUAL_YN 
					+ ']';
	} else {
		str = '[NETWORK_ID:' + this.NETWORK_ID  + '][NETWORK_NM:'+ this.NETWORK_NM 
					+ '][NETWORK_STATUS_CD:' + this.NETWORK_STATUS_CD + '][NETWORK_STATUS_NM:' + this.NETWORK_STATUS_NM
					+ '][PATH_SAME_NO:' + this.PATH_SAME_NO + '][PATH_DIRECTION:' + this.PATH_DIRECTION
					+ '][TOPOLOGY_LARGE_CD:' + this.TOPOLOGY_LARGE_CD + '][TOPOLOGY_LARGE_NM:' + this.TOPOLOGY_LARGE_NM
					+ '][TOPOLOGY_SMALL_CD:' + this.TOPOLOGY_SMALL_CD  + '][TOPOLOGY_SMALL_NM:'+ this.TOPOLOGY_SMALL_NM
					+ '][TOPOLOGY_CFG_MEANS_CD:' + this.TOPOLOGY_CFG_MEANS_CD  + '][TOPOLOGY_CFG_MEANS_NM:'+ this.TOPOLOGY_CFG_MEANS_NM
					+ '][VIRTUAL_YN:'+ this.VIRTUAL_YN 
					+ ']';
	}

	return str;
};



Network.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {
		return true;
	} else {
		return false;
	}

};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 작업후 Network isChange 함수 추가함...
 * 기존 Network.prototype.equals 이 사용하는 equalsAttr()함수가 문제점이 있어 equalsAttrWithReturn() 로 비교함
 * 
 * return : 변경된경우 - true, 변경되지 않은 경우 - false
 * */
Network.prototype.isChange = function(other) {
	
	if ( equalsAttrWithReturn(this, other) ) {
		return false;
	} else {
		return true;
	}

};

