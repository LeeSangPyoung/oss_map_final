function ChannelDescrInfo() {
	this.CHANNEL_DESCR = '';
	this.CHANNEL_CAPACITY_NM = '';
	this.CHANNEL_CAPACITY_E1 = 0;
	this.PRE_SEP = '';
	this.POST_SEP = '';
	this.SELECTED = false;
	this.SORT_SEQ = 0;
	this.IS_T1 = false;
	
	this.unit155M = null;
	this.unit45M = null;
	this.unit6M = null;
	this.unit2M = null;
	
	//	E1 기준과 T1 기준의 정렬 순서 ( 채널 그룹핑 문자열 만들 때 사용 )
	this.E1_SORT_SEQ = 0;
	this.T1_SORT_SEQ = 0;
	
};


ChannelDescrInfo.prototype = new Object();

ChannelDescrInfo.prototype.constructor = ChannelDescrInfo;


/**
 * JSON 데이터를 읽는다.
 * @param obj
 * @param prefix
 */
ChannelDescrInfo.prototype.fromData = function(obj, prefix) {
	this.CHANNEL_DESCR = obj[prefix + 'CHANNEL_DESCR'];
	this.CHANNEL_CAPACITY_NM = obj[prefix + 'CHANNEL_CAPACITY_NM'];
	this.CHANNEL_CAPACITY_E1 = obj[prefix + 'CHANNEL_CAPACITY_E1'];
	this.PRE_SEP = obj[prefix + 'CHANNEL_PRE_SEP'];
	this.POST_SEP = obj[prefix + 'CHANNEL_POST_SEP'];
	this.SELECTED = Boolean(obj[prefix + 'CHANNEL_SELECTED']);
	this.SORT_SEQ = Number(obj[prefix + 'CHANNEL_SORT_SEQ']);
	this.IS_T1 = Boolean(obj[prefix + 'CHANNEL_IS_T1']);
	
	if ( obj.hasOwnProperty("155M_CHANNEL_VALUE") ) {
		this.unit155M = new ChannelUnitInfo();
		this.unit155M.fromData( obj, "155M_" );
	}

	if ( obj.hasOwnProperty("45M_CHANNEL_VALUE") ) {
		this.unit45M = new ChannelUnitInfo();
		this.unit45M.fromData( obj, "45M_" );
	}

	if ( obj.hasOwnProperty("6M_CHANNEL_VALUE") ) {
		this.unit6M = new ChannelUnitInfo();
		this.unit6M.fromData( obj, "6M_" );
	}

	if ( obj.hasOwnProperty("2M_CHANNEL_VALUE") ) {
		this.unit2M = new ChannelUnitInfo();
		this.unit2M.fromData( obj, "2M_" );
	}
	
};



/**
 * Object 데이터를 읽는다.
 * @param obj
 * @param prefix
 */
ChannelDescrInfo.prototype.fromObject = function(obj, prefix) {
	this.CHANNEL_DESCR = obj[prefix + 'channelDescr'];
	this.CHANNEL_CAPACITY_NM = obj[prefix + 'channelCapacity'];
	this.CHANNEL_CAPACITY_E1 = obj[prefix + 'capacityE1'];
	this.PRE_SEP = obj[prefix + 'preSep'];
	this.POST_SEP = obj[prefix + 'postSep'];
	this.SELECTED = Boolean(obj[prefix + 'selected']);
	this.SORT_SEQ = Number(obj[prefix + 'sortSeq']);
	this.IS_T1 = Boolean(obj[prefix + 't1']);
	
	if ( obj["unit155M"] !== null ) {
		this.unit155M = new ChannelUnitInfo();
		this.unit155M.fromObject( obj["unit155M"], '' );
	}

	if ( obj["unit45M"] !== null ) {
		this.unit45M = new ChannelUnitInfo();
		this.unit45M.fromObject( obj["unit45M"], '' );
	}

	if ( obj["unit6M"] !== null ) {
		this.unit6M = new ChannelUnitInfo();
		this.unit6M.fromObject( obj["unit6M"], '' );
	}

	if ( obj["unit2M"] !== null ) {
		this.unit2M = new ChannelUnitInfo();
		this.unit2M.fromObject( obj["unit2M"], '' );
	}
	
};


/**
 * 155M 채널 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.isChannel155M = function() {
	return ( this.CHANNEL_CAPACITY_NM === 'C155M' );
};


/**
 * 45M 채널 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.isChannel45M = function() {
	return ( this.CHANNEL_CAPACITY_NM === 'C45M' );
};


/**
 * 6M 채널 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.isChannel6M = function() {
	return ( this.CHANNEL_CAPACITY_NM === 'C6M' );
};

/**
 * 2M 채널 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.isChannel2M = function() {
	return ( this.CHANNEL_CAPACITY_NM === 'C2M' );
};




/**
 * 155M 채널 정보가 있는 지 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.hasUnit155M = function() {
	return ( this.unit155M != null );
};


/**
 * 45M 채널 정보가 있는 지 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.hasUnit45M = function() {
	return ( this.unit45M != null );
};


/**
 * 6M 채널 정보가 있는 지 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.hasUnit6M = function() {
	return ( this.unit6M != null );
};


/**
 * 2M 채널 정보가 있는 지 여부
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.hasUnit2M = function() {
	return ( this.unit2M != null );
};



/**
 * 155M 채널과 45M 채널 유닛 정보 중 상위 채널 정보가 있는 지 조사한다.
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.hasUpperUnit = function() {
	if ( this.hasUnit155M() ) {
		return true;
	} else if ( this.hasUnit45M() ) {
		return true;
	} else {
		return false;
	}
};





/**
 * 155M 채널과 45M 채널 유닛 정보 중 상위 채널 정보를 구한다.
 * @returns {ChannelUnitInfo}
 */
ChannelDescrInfo.prototype.getUpperUnit = function() {
	if ( this.hasUnit155M() ) {
		return this.unit155M;
	} else if ( this.hasUnit45M() ) {
		return this.unit45M;
	} else {
		throw new PathException( EnumPathException.NOT_EXIST_UPPER_CHANNEL_UNIT, this );
	}
};





/**
 * 채널 문자열에서 포트와 채널 구분자를 제거한 문자열을 조회한다.
 * @returns
 */
ChannelDescrInfo.prototype.channelDescrWithoutSep = function() {
	var str = this.CHANNEL_DESCR;
	if ( str.startsWith(this.PRE_SEP) && this.PRE_SEP != "" ) {
		str = str.substring(this.PRE_SEP.length);
	}

	if ( str.endsWith(this.POST_SEP) && this.POST_SEP != "" ) {
		str = str.substring(0, this.POST_SEP.length);
	}
	
	return str;
};


/**
 * 정렬 함수
 * @param obj1
 * @param obj2
 * @returns {Number}
 */
ChannelDescrInfo.prototype.channelInfoSortFunction = function( obj1, obj2 ) {
	try {
		//	용량이 다르면 용량 큰 것을 먼저 표시한다.
		if ( obj1.CHANNEL_CAPACITY_E1 < obj2.CHANNEL_CAPACITY_E1 ) {
			return 1;
		} else if ( obj1.CHANNEL_CAPACITY_E1 > obj2.CHANNEL_CAPACITY_E1 ) {
			return -1;
		} else {
			//	용량이 같다면 채널 정렬 순으로 정렬한다.
			return ( Number(obj1.SORT_SEQ) - Number(obj2.SORT_SEQ) );
		}
	} catch ( err ) {
		console.log(err);
		return 0;
	}

};




/**
 * 입력한 채널이 현재 채널의 다음 채널인지 여부
 * @param nextChannelDescrInfo
 * @param baseT1   참이면 T1 기준으로 판단, 거짓이면 E1 기준으로 판단
 * @returns {Boolean}
 */
ChannelDescrInfo.prototype.isNextChannel = function( nextChannelDescrInfo, baseT1 ) {
	try {

		if ( this.isChannel2M() ) {
			if ( baseT1 ) {
				if ( Number(this.T1_SORT_SEQ) + 1 == Number(nextChannelDescrInfo.T1_SORT_SEQ) ) {
					return true;
				}
			} else {
				if ( Number(this.E1_SORT_SEQ) + 1 == Number(nextChannelDescrInfo.E1_SORT_SEQ) ) {
					return true;
				}
			}
		} else {
			//	 상위 채널은 기본 정렬로 비교
			if ( Number(this.SORT_SEQ) + 1 == Number(nextChannelDescrInfo.SORT_SEQ) ) {
				return true;
			}
		}
		
	} catch ( err ) {
		console.log(err);
	}

	return false;
};


/**
 * 
 * 입력한 채널이 이 채널의 하위 채널에 속하는 지 여부
 * <br/>이 채널이 155M 일 때 이 채널에 속하는 45M or 2M 채널인지 여부 
 *  
 * @param other
 * @return boolean
 */
ChannelDescrInfo.prototype.isSubChannel = function( other ) {
    
    if ( this.isChannel155M() && other.isChannel155M() == false ) {
        if ( this.hasUnit155M() && other.hasUnit155M() ) {
            if ( this.unit155M.equals(other.unit155M) ) {
                return true;
            }
        }
    } else if ( this.isChannel45M() && other.isChannel2M() ) {
        if ( this.hasUnit45M() && other.hasUnit45M() ) {
            if ( this.unit45M.equals(other.unit45M) ) {
                return true;
            }
        }
    }
    
    return false;
}
