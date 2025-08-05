function PortDescr() {
	this.PORT_ID = '';
	this.PORT_NM = '';
	this.PORT_STATUS_CD = '';
	this.PORT_STATUS_NM = '';
	
	this.PORT_DUMMY = '';
	this.PORT_NULL = '';
	this.PORT_USE_TYPE_CD = '';
	this.PORT_USE_TYPE_NM = '';
	this.PORT_WAVELENGTH = '';
	this.IS_CHANNEL_T1 = '';
	this.CHANNEL_DESCR = '';
	this.CHANNEL_IDS = '';

	this.PORT_DESCR = '';
	
	this.RACK_NM = '';
	this.RACK_NO = '';
	this.SHELF_NM = '';
	this.SHELF_NO = '';
	this.SLOT_NO = '';
	this.CARD_ID = '';
	this.CARD_NM = '';
	this.CARD_MODEL_ID = '';
	this.CARD_MODEL_NM = '';
	this.CARD_STATUS_CD = '';
	this.CARD_STATUS_NM = '';
	this.CARD_WAVELENGTH = '';	
	
	this.RX_PORT_ID = '';
	this.RX_PORT_NM = '';
	this.RX_PORT_STATUS_CD = '';
	this.RX_PORT_STATUS_NM = '';
	this.RX_PORT_DUMMY = '';	
	
	this.EDITABLE_PORT = true;
	this.EDITABLE_CHANNEL = true;
};


PortDescr.prototype = new Object();

PortDescr.prototype.constructor = PortDescr;


PortDescr.prototype.fromData = function(obj, prefix) {
	this.PORT_ID = obj[prefix + 'PORT_ID'];
	this.PORT_NM = obj[prefix + 'PORT_NM'];
	this.PORT_STATUS_CD = obj[prefix + 'PORT_STATUS_CD'];
	this.PORT_STATUS_NM = obj[prefix + 'PORT_STATUS_NM'];
	
	this.PORT_DUMMY = obj[prefix + 'PORT_DUMMY'];
	this.PORT_NULL = obj[prefix + 'PORT_NULL'];
	this.PORT_USE_TYPE_CD = obj[prefix + 'PORT_USE_TYPE_CD'];
	this.PORT_USE_TYPE_NM = obj[prefix + 'PORT_USE_TYPE_NM'];
	this.PORT_WAVELENGTH = obj[prefix + 'PORT_WAVELENGTH'];
	
	this.IS_CHANNEL_T1 = obj[prefix + 'IS_CHANNEL_T1'];
	this.CHANNEL_DESCR = obj[prefix + 'CHANNEL_DESCR'];
	this.CHANNEL_IDS = obj[prefix + 'CHANNEL_IDS'];

	this.RACK_NM = obj[prefix + 'RACK_NM'];
	this.RACK_NO = obj[prefix + 'RACK_NO'];
	this.SHELF_NM = obj[prefix + 'SHELF_NM'];
	this.SHELF_NO = obj[prefix + 'SHELF_NO'];
	this.SLOT_NO = obj[prefix + 'SLOT_NO'];
	this.CARD_ID = obj[prefix + 'CARD_ID'];
	this.CARD_NM = obj[prefix + 'CARD_NM'];
	this.CARD_MODEL_ID = obj[prefix + 'CARD_MODEL_ID'];
	this.CARD_MODEL_NM = obj[prefix + 'CARD_MODEL_NM'];
	this.CARD_STATUS_CD = obj[prefix + 'CARD_STATUS_CD'];
	this.CARD_STATUS_NM = obj[prefix + 'CARD_STATUS_NM'];
	this.CARD_WAVELENGTH = obj[prefix + 'CARD_WAVELENGTH'];
	
	
	this.RX_PORT_ID = obj[prefix + 'RX_PORT_ID'];
	this.RX_PORT_NM = obj[prefix + 'RX_PORT_NM'];
	this.RX_PORT_STATUS_CD = obj[prefix + 'RX_PORT_STATUS_CD'];
	this.RX_PORT_STATUS_NM = obj[prefix + 'RX_PORT_STATUS_NM'];
	this.RX_PORT_DUMMY = obj[prefix + 'RX_PORT_DUMMY'];	
	
	//	선번 그리드에서 포트명(RX포함, 채널 비포함 )으로 사용
	this.PORT_DESCR = this.PortNm();
	
	this.EDITABLE_PORT = true;
	this.EDITABLE_CHANNEL = this.isNullRxPort();

};



PortDescr.prototype.toData = function( obj, prefix ) {
	//	선번 그리드에서 포트명으로 사용되므로 toData 시 업데이트해줘야 한다.
	this.PORT_DESCR = this.PortNm();
	copyAttributeWithReplacingPrefix( this, obj, '', prefix );
};



/**
 * 포트명 ( RX 포함 )
 * @returns
 */
PortDescr.prototype.PortNm = function() {
	if ( this.isNullRxPort() || this.PORT_ID == this.RX_PORT_ID ) {
		return this.PORT_NM;
	} else {
		return this.makeTxRxPortDescr( this.PORT_NM, this.RX_PORT_NM );
	}
};



/**
 * 포트+채널 문자열
 * @returns
 */
PortDescr.prototype.PortChannelDescr = function() {
	if ( this.isNullRxPort() || this.PORT_ID == this.RX_PORT_ID ) {
		return this.PORT_NM + this.CHANNEL_DESCR;
	} else {
		return this.makeTxRxPortDescr( this.PORT_NM, this.RX_PORT_NM );
	}
};


/**
 * 포트가 유효한지 여부 ( 포트 ID 가 있고 NULL 포트 ID 가 아니거나, 채널이라도 있는 경우 ) 
 * @returns {Boolean}
 */
PortDescr.prototype.isValid = function() {
	if ( isNullOrEmpty(this.PORT_ID) == false && this.PORT_ID != '0' ) {
		return true;
	}
	
	return false;
};


/**
 * NULL 포트 ( 포트 ID 가 없거나 NULL 포트 ID 인 경우 ) 여부
 * @returns {Boolean}
 */
PortDescr.prototype.isNull = function() {
	if ( isNullOrEmpty(this.PORT_ID) || this.PORT_ID == '0' ) {
		return true;
	}
	
	return false;
};


/**
 * RX 포트가 NULL 포트 ( 포트 ID 가 없거나 NULL 포트 ID 인 경우 ) 여부
 * @returns {Boolean}
 */
PortDescr.prototype.isNullRxPort = function() {
	if ( isNullOrEmpty(this.RX_PORT_ID) || this.RX_PORT_ID == '0' ) {
		return true;
	}
	
	return false;
};




PortDescr.prototype.resetPortDescrEditable = function( obj, prefix ) {
	this.EDITABLE_PORT = true;
	this.EDITABLE_CHANNEL = this.isNullRxPort();
};




PortDescr.prototype.clone = function() {
	var obj = new PortDescr();
	copyAttributeAll(this, obj);	
	return obj;
};

PortDescr.prototype.toDebugString = function() {
	var str = '';
	str = '[PortChannelDescr:' + this.PortChannelDescr()   
				+ '][PORT_ID:' + this.PORT_ID  + '][PORT_NM:'+ this.PORT_NM 
				+ '][PORT_STATUS_CD:' + this.PORT_STATUS_CD + '][PORT_STATUS_NM:' + this.PORT_STATUS_NM
				+ '][PORT_DUMMY:' + this.PORT_DUMMY + '][PORT_NULL:' + this.PORT_NULL
				+ '][PORT_USE_TYPE_CD:' + this.PORT_USE_TYPE_CD + '][PORT_USE_TYPE_NM:' + this.PORT_USE_TYPE_NM
				+ '][PORT_WAVELENGTH:' + this.PORT_WAVELENGTH  + '][IS_CHANNEL_T1:'+ this.IS_CHANNEL_T1 
				+ '][CHANNEL_DESCR:' + this.CHANNEL_DESCR  + '][CHANNEL_IDS:'+ this.CHANNEL_IDS
				+ '][RACK_NM:' + this.RACK_NM  + '][RACK_NO:'+ this.RACK_NO
				+ '][SHELF_NM:' + this.SHELF_NM  + '][SHELF_NO:'+ this.SHELF_NO
				+ '][SLOT_NO:' + this.SLOT_NO 
				+ '][CARD_ID:' + this.CARD_ID  + '][CARD_NM:'+ this.CARD_NM
				+ '][CARD_MODEL_ID:' + this.CARD_MODEL_ID  + '][CARD_MODEL_NM:'+ this.CARD_MODEL_NM
				+ '][CARD_STATUS_CD:' + this.CARD_STATUS_CD  + '][CARD_STATUS_NM:'+ this.CARD_STATUS_NM
				+ '][CARD_WAVELENGTH:' + this.CARD_WAVELENGTH
				+ '][RX_PORT_ID:' + this.RX_PORT_ID  + '][RX_PORT_NM:'+ this.RX_PORT_NM 
				+ '][RX_PORT_STATUS_CD:' + this.RX_PORT_STATUS_CD + '][RX_PORT_STATUS_NM:' + this.RX_PORT_STATUS_NM
				+ '][RX_PORT_DUMMY:' + this.RX_PORT_DUMMY
				+ ']';

	return str;
};




PortDescr.prototype.toString = function() {
	var descr = '';
	if ( this.isValid() ) {
		descr = '포트 : ' + nullToEmpty(this.PORT_DESCR) + ', 상태 : ' + nullToEmpty(this.PORT_STATUS_NM);
	} else {
		descr = '포트 정보 없음';
	}

	return descr;
};



/**
 * 
 * TX 포트와 RX 포트를 비교하여 랙, 쉘프, 카드, 포트 중 다른 부분부터 RX 포트를 가로안에 표시한다.
 * 예를 들어, TX 포트가 "01-01-01-01" 이고, RX 포트가 "01-01-01-02" 이면 "01-01-01-01(02)" 로 리턴한다.
 * RX 포트를 출력을 시작할 위치는 TX 와 다른 문자 직전의 구분자("-,/()") 다음부터이다.
 * 만약, RX 포트가 Empty 이거나 TX 포트랑 동일하다면 TX 포트만 리턴한다.
 * 
 * @param txPort
 * @param rxPort
 * @return String
 */
PortDescr.prototype.makeTxRxPortDescr = function( txPort, rxPort ) {
	try {
		
		if ( isNullOrEmpty(rxPort) ) {
			return txPort;
		}
		
		if ( txPort == rxPort ) {
		    return txPort;
		}
		
		//	TX 포트와 RX 포트를 비교하여 다른 부분(랙, 쉘프, 카드, 포트)부터 RX 포트를 가로안에 표시한다.
		var strDescr = txPort;
		var delimiter = "-,/()";
		
		var splitIdx = -1;
		var idx = 0;
		for ( ; idx < txPort.length; idx++ ) {
			var chPort = txPort.charAt(idx);
			if ( delimiter.indexOf(chPort) >= 0 ) {
				splitIdx = idx;
			}
			
			if ( idx < rxPort.length ) {
				var chRxPort = rxPort.charAt(idx);
				if ( chPort != chRxPort ) {
					break;
				}
			}
			else {
				break;
			}
		}
		
		//	FDF 포트 등 구분자가 아예 없는 경우는 RX 포트 전체를 표시한다.
		if ( splitIdx >= -1 && rxPort.length > 0 && splitIdx < rxPort.length ) {
			strDescr += "(";
			strDescr += rxPort.substring(splitIdx+1);
			strDescr += ")";
		}
		
		return strDescr;	
	} catch ( err ) {
		console.log(err);
		return txPort;
	}
};



PortDescr.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {
		return true;
	} else {
		return false;
	}

};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 작업후 PortDescr isChange 함수 추가함...
 * 기존 PortDescr.prototype.equals 이 사용하는 equalsAttr()함수가 문제점이 있어 equalsAttrWithReturn() 로 비교함
 * 
 * return : 변경된경우 - true, 변경되지 않은 경우 - false
 * */
PortDescr.prototype.isChange = function(other) {
	
	if ( equalsAttrWithReturn(this, other) ) {
		return false;
	} else {
		return true;
	}

};
