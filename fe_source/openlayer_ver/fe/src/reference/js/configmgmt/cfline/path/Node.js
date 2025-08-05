 
function Node() {
	this.PREFIX = '';
	
	this.NODE_ROLE_CD = '';
	this.NODE_ROLE_NM = '';

	this.ADD_DROP_TYPE_CD = '';
	this.ADD_DROP_TYPE_NM = '';
	
	this.Ne  = new Ne();
	this.PortDescr = new PortDescr();	
	this.ADJACENT_NODE = '';  // 인접네트워크로 추가된 노드
};


Node.prototype = new Object();

Node.prototype.constructor = Node;


/**
 * Object Type 의 이 객체를 TeamsPath Type 객체로 변환한다. 
 */
Node.prototype.resetPrototype = function() {
	
	if ( this.Ne != null ) {
		Object.setPrototypeOf(this.Ne, Ne.prototype);
	}
	
	if ( this.PortDescr != null ) {
		Object.setPrototypeOf(this.PortDescr, PortDescr.prototype);
	}
	
};





Node.prototype.fromData = function( obj, prefix ) {
	
	this.PREFIX = prefix;
	
	this.NODE_ROLE_CD = obj[prefix + 'NODE_ROLE_CD'];
	this.NODE_ROLE_NM = obj[prefix + 'NODE_ROLE_NM'];

	this.ADD_DROP_TYPE_CD = obj[prefix + 'ADD_DROP_TYPE_CD'];
	this.ADD_DROP_TYPE_NM = obj[prefix + 'ADD_DROP_TYPE_NM'];

	this.Ne.fromData(obj, prefix);
	this.PortDescr.fromData(obj, prefix);
};




Node.prototype.toData = function( obj, prefix ) {
	
	this.PREFIX = prefix;

	obj[prefix + 'NODE_ROLE_CD'] = this.NODE_ROLE_CD;
	obj[prefix + 'NODE_ROLE_NM'] = this.NODE_ROLE_NM;

	obj[prefix + 'ADD_DROP_TYPE_CD'] = this.ADD_DROP_TYPE_CD;
	obj[prefix + 'ADD_DROP_TYPE_NM'] = this.ADD_DROP_TYPE_NM;
	
	this.Ne.toData(obj, prefix);
	this.PortDescr.toData(obj, prefix);
	
	if ( this.PortDescr.isNullRxPort() == false ) {
		obj[prefix + 'RX_NE_ID'] = this.Ne.NE_ID;
	}
	
};



Node.prototype.isValid = function() {
	if ( this.Ne != null && this.Ne.isValid ) {
		return true;
	}
	
	return false;
};


/**
 * 장비 정보가 없거나 NULL 장비 여부
 * @returns {Boolean}
 */
Node.prototype.isNull = function() {
	if ( this.Ne == null || this.Ne.isNull() ) {
		return true;
	}
	
	return false;
};




Node.prototype.clone = function() {
	var obj = new Node();
	copyAttributeAll(this, obj);	
	
	obj.Ne = this.Ne.clone();
	obj.PortDescr = this.PortDescr.clone();
	
	return obj;
};



Node.prototype.toString = function() {
	var descr = '';
	if ( this.Ne != null ) {
		descr = this.Ne.toString();
		
		if ( this.PortDescr != null ) {
			descr += '\n' + this.PortDescr.toString();
		} else {
			descr += '\n포트 정보 없음';
		}
		
	} else {
		descr = '장비 정보 없음';
	}

	return descr;
};



Node.prototype.toDebugString = function() {
	var str = '';
	
	str += '[PREFIX:' + this.PREFIX  + '][NODE_ROLE_CD:'+ this.NODE_ROLE_CD + '][NODE_ROLE_NM:' + this.NODE_ROLE_NM
				+ '][ADD_DROP_TYPE_CD:'+ this.ADD_DROP_TYPE_CD + '][ADD_DROP_TYPE_NM:' + this.ADD_DROP_TYPE_NM + ']';

	str += '\n' + this.Ne.toDebugString();
	str += '\n' + this.PortDescr.toDebugString();

	return str;
};


Node.prototype.nodeTitle = function() {
	if ( this.Ne == null ) {
		return '장비 정보 없음';
	} if ( isNullOrEmpty(this.Ne.NE_NM) ) {
		if ( isNullOrEmpty(this.Ne.ORG_NM) ) {
			return '미확인장비';
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




Node.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {

		if ( this.Ne !== other.Ne ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.Ne) == false && isNullOrEmpty(other.Ne) == false && this.Ne.equals(other.Ne) ) {
			return true;
		} else {
			return false;
		}
		
		
		if ( this.PortDescr !== other.PortDescr ) {
			return false;
		}
		
		if ( isNullOrEmpty(this.PortDescr) == false && isNullOrEmpty(other.PortDescr) == false && this.PortDescr.equals(other.PortDescr) ) {
			return true;
		} else {
			return false;
		}


	} else {
		return false;
	}

};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 작업후 TeamsPath isChange 함수 추가함...
 * 기존 Link.prototype.equals 가 다른 요소값(NODE ID등)의 비교 오류로 함수를 추가함
 * 
 * return : 변경된경우 - true, 변경되지 않은 경우 - false
 * */
Node.prototype.isChange = function(other) {
	

	/*if ( this.Ne !== other.Ne ) {
		return true;
	}*/
	
	if ( (isNullOrEmpty(this.Ne) == false && isNullOrEmpty(other.Ne) == true) ||  (isNullOrEmpty(this.Ne) == true && isNullOrEmpty(other.Ne) == false)) {
		return true;
	}
	// NODE_ROLE_CD(COT/RT/PATHC/해당없음) 은 강제로 체크해줌
	else if (nullToEmpty(this.NODE_ROLE_CD) !== nullToEmpty(other.NODE_ROLE_CD)) {
		return true;
	}
	else if ( isNullOrEmpty(this.Ne) == false && isNullOrEmpty(other.Ne) == false && this.Ne.isChange(other.Ne) == true ) {
		return true;
	} 
	
	
	/*if ( this.PortDescr !== other.PortDescr ) {
		return true;
	}*/
	
	if ( ( isNullOrEmpty(this.PortDescr) == false && isNullOrEmpty(other.PortDescr) == true ) ||  ( isNullOrEmpty(this.PortDescr) == true && isNullOrEmpty(other.PortDescr) == false ) ) {
		return true;
	}
	else if ( isNullOrEmpty(this.PortDescr) == false && isNullOrEmpty(other.PortDescr) == false && this.PortDescr.isChange(other.PortDescr) == true ) {
		return true;
	} 

	return false;

};
