function ChannelDescrInfoManager() {
	//	KEY : 155M 또는 45M 채널 문자열 ( 구분자 없음 ), NDCS 모델처럼 상위 채널이 없는 경우 "00" 이다. 
	//	VALUE : E1 ChannelDescrInfo 목록
	this.mapE1ChannelDescr = new Map();
	
	//	KEY : 155M 또는 45M 채널 문자열 ( 구분자 없음 )
	//	VALUE : 155M 또는 45M ChannelDescrInfo
	this.mapUpperChannelDescr = new Map();
};


ChannelDescrInfoManager.prototype = new Object();

ChannelDescrInfoManager.prototype.constructor = ChannelDescrInfoManager;

/** NDCS 모델처럼 상위 채널이 없는 경우 기본 상위 채널 값 */
var EMPTY_UPPER_CHANNEL_VALUE = "00";


/**
 * 채널 목록 JSON 데이터를 읽는다.
 * 
 * @param channelDescrDataList
 */
ChannelDescrInfoManager.prototype.fromData = function(data) {
	
	var channelDescrInfoList = [];
	for(var idx = 0; idx < data.length; idx++) {
		var channelDescrInfo = new ChannelDescrInfo();
		channelDescrInfo.fromData(data[idx], '');
		channelDescrInfoList.push(channelDescrInfo);
	}
	
	this.addChannels(channelDescrInfoList);
};


/**
 * 채널 목록 Object 데이터를 읽는다.
 * 
 * @param channelDescrDataList
 */
ChannelDescrInfoManager.prototype.fromObject = function(data) {

	var channelDescrInfoList = [];
	for(var idx = 0; idx < data.length; idx++) {
		var channelDescrInfo = new ChannelDescrInfo();
		channelDescrInfo.fromObject(data[idx], '');
		channelDescrInfoList.push(channelDescrInfo);
	}
	
	this.addChannels(channelDescrInfoList);
};




/**
 * 채널 목록을 추가한다.
 * 
 * @param channelDescrInfoList
 */
ChannelDescrInfoManager.prototype.addChannels = function(channelDescrInfoList) {
	
	var e1SortSeq = 0;
	var t1SortSeq = 0;
	
	for ( var idx = 0; idx < channelDescrInfoList.length; idx++ ) {
		var channelDescrInfo = channelDescrInfoList[idx];
		
		if ( channelDescrInfo.isChannel2M() ) {
			if ( channelDescrInfo.hasUpperUnit() ) {
				var upperUnit = channelDescrInfo.getUpperUnit();
				
				if ( this.mapE1ChannelDescr.containsKey(upperUnit.CHANNEL_VALUE) == false ) {
					this.mapE1ChannelDescr.put( upperUnit.CHANNEL_VALUE, [] );
				}
				
				this.mapE1ChannelDescr.get( upperUnit.CHANNEL_VALUE ).push( channelDescrInfo );
			} else {
				if ( this.mapE1ChannelDescr.containsKey( EMPTY_UPPER_CHANNEL_VALUE ) == false ) {
					this.mapE1ChannelDescr.put( EMPTY_UPPER_CHANNEL_VALUE, [] );
				}
				
				this.mapE1ChannelDescr.get( EMPTY_UPPER_CHANNEL_VALUE ).push( channelDescrInfo );
			}
		} else {
			this.mapUpperChannelDescr.put( channelDescrInfo.channelDescrWithoutSep(), channelDescrInfo );
		} 
		
		
		if ( channelDescrInfo.IS_T1 ) {
			t1SortSeq++;
		} else {
			e1SortSeq++;
			t1SortSeq++;
		}
		
		channelDescrInfo.E1_SORT_SEQ = e1SortSeq;
		channelDescrInfo.T1_SORT_SEQ = t1SortSeq;
		
	}
	
};


ChannelDescrInfoManager.prototype.clear = function() {
	this.mapE1ChannelDescr.clear();
	this.mapUpperChannelDescr.clear();
};




/**
 * 상위 채널 정보(ChannelDescrInfo) 목록을 구한다.
 * @returns {Array}
 */
ChannelDescrInfoManager.prototype.getUpperChannelList = function() {
	var list = this.mapUpperChannelDescr.values();
	
	list.sort( ChannelDescrInfo.prototype.channelInfoSortFunction );
	return list;
};





/**
 * 입력한 상위 채널에 속하는 E1 채널 정보(ChannelDescrInfo) 목록을 구한다.
 * @returns {Array}
 */
ChannelDescrInfoManager.prototype.getE1ChannelList = function(upperChannelValue, baseT1) {
	
	var list = [];
	
	if ( upperChannelValue != null ) {
		//	상위 채널에 해당하는 E1 을 구한다.
		if ( this.mapE1ChannelDescr.containsKey(upperChannelValue) == false ) {
//			throw new Error(upperChannelValue + ' 채널에 속하는 E1 채널이 없습니다.' );
			return null;
		}
		
		var channelDescrInfoList = this.mapE1ChannelDescr.get(upperChannelValue);
		
		for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
			var channelDescrInfo = channelDescrInfoList[chnIdx];
			if ( channelDescrInfo.IS_T1 ) {
				if ( baseT1 ) {
					list.push(channelDescrInfo);
				}
			} else {
				list.push(channelDescrInfo);
			}
		}
		
	} else {
		//	전체 E1 을 구한다.
		var channelArrayList = this.mapE1ChannelDescr.values();
		
		for ( var chnListIdx = 0; chnListIdx < channelArrayList.length; chnListIdx++ ) {
			var channelDescrInfoList = channelArrayList[chnListIdx];
			for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
				var channelDescrInfo = channelDescrInfoList[chnIdx];
				if ( channelDescrInfo.IS_T1 ) {
					if ( baseT1 ) {
						list.push(channelDescrInfo);
					}
				} else {
					list.push(channelDescrInfo);
				}
			}
		}		
	}

	list.sort( ChannelDescrInfo.prototype.channelInfoSortFunction );
	return list;
};



/**
 * 선택된 상위채널(155M/45M) 채널 정보(ChannelDescrInfo) 목록을 구한다.
 * @returns {Array}
 */
ChannelDescrInfoManager.prototype.getSelectedUpperChannelList = function() {
	var seletedList = [];
	var channelDescrInfoList = this.mapUpperChannelDescr.values();

	for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
		var channelDescrInfo = channelDescrInfoList[chnIdx];
		if ( channelDescrInfo.SELECTED ) {
			seletedList.push(channelDescrInfo);
		}
	}
	
	seletedList.sort( ChannelDescrInfo.prototype.channelInfoSortFunction );
	
	return seletedList;
};



/**
 * 선택된 E1 채널 정보(ChannelDescrInfo) 목록을 구한다.
 * @returns {Array}
 */
ChannelDescrInfoManager.prototype.getSelectedE1ChannelList = function(baseT1) {
	var seletedList = [];
	var channelArrayList = this.mapE1ChannelDescr.values();

	for ( var chnListIdx = 0; chnListIdx < channelArrayList.length; chnListIdx++ ) {
		var channelDescrInfoList = channelArrayList[chnListIdx];
		for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
			var channelDescrInfo = channelDescrInfoList[chnIdx];
			if ( channelDescrInfo.SELECTED ) {
				if ( channelDescrInfo.IS_T1 ) {
					if ( baseT1 ) {
						seletedList.push(channelDescrInfo);
					}
				} else {
					seletedList.push(channelDescrInfo);
				}
			}
		}
	}
	
	seletedList.sort( ChannelDescrInfo.prototype.channelInfoSortFunction );
	
	return seletedList;
};



/**
 * 상위 채널 정보(ChannelDescrInfo) 를 찾는다.  없으면 NULL
 * @param p_ChannelDescrWithSep		구분자 없는 채널 문자열
 * @returns
 */
ChannelDescrInfoManager.prototype.findUpperChannelDescr = function(p_ChannelDescrWithSep) {

	var channelDescrInfoList = this.mapUpperChannelDescr.values();

	for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
		var channelDescrInfo = channelDescrInfoList[chnIdx];
		if ( channelDescrInfo.channelDescrWithoutSep() ===  p_ChannelDescrWithSep ) {
			return channelDescrInfo;
		}
	}
	
	return null;
};




/**
 * E1 채널 정보(ChannelDescrInfo) 를 찾는다.  없으면 NULL
 * @param p_ChannelDescrWithSep		구분자 없는 채널 문자열
 * @returns
 */
ChannelDescrInfoManager.prototype.findE1ChannelDescr = function(p_ChannelDescrWithSep) {
	var channelArrayList = this.mapE1ChannelDescr.values();

	for ( var chnListIdx = 0; chnListIdx < channelArrayList.length; chnListIdx++ ) {
		var channelDescrInfoList = channelArrayList[chnListIdx];
		for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
			var channelDescrInfo = channelDescrInfoList[chnIdx];
			if ( channelDescrInfo.channelDescrWithoutSep() ===  p_ChannelDescrWithSep ) {
				return channelDescrInfo;
			}
		}
	}
	
	return null;
};



/**
 * 상위 채널 전체에 대해 선택 처리한다.
 * @returns {Array}
 */
ChannelDescrInfoManager.prototype.setSelectedUpperChannelAll = function(selected) {
	
	var channelDescrInfoList = this.mapUpperChannelDescr.values();

	for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
		var channelDescrInfo = channelDescrInfoList[chnIdx];
		channelDescrInfo.SELECTED = selected;
	}	
};



/**
 * E1 채널 전체에 대해 선택 처리한다.
 * @returns {Array}
 */
ChannelDescrInfoManager.prototype.setSelectedE1ChannelAll = function(selected) {
	
	var channelArrayList = this.mapE1ChannelDescr.values();

	for ( var chnListIdx = 0; chnListIdx < channelArrayList.length; chnListIdx++ ) {
		var channelDescrInfoList = channelArrayList[chnListIdx];
		for ( var chnIdx = 0; chnIdx < channelDescrInfoList.length; chnIdx++ ) {
			var channelDescrInfo = channelDescrInfoList[chnIdx];
			channelDescrInfo.SELECTED = selected;
		}
	}
	
};




