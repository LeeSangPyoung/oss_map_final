

/**
 * 채널 그룹 구분자
 */
const CHANNEL_GRP_SEP = "/";

/**
 * 채널 그룹 묶음 구분자
 */
const CHANNEL_GRP_SEP_BUNDLE = "~";    

/**
 * 채널 구분자 정규식
 */
const CHANNEL_SEP_REGEX = "[(,/~)]";



function ChannelGroupDescr() {
	this.channelInfos = [];
};


ChannelGroupDescr.prototype = new Object();

ChannelGroupDescr.prototype.constructor = ChannelGroupDescr;



/**
 * 채널 목록으로 채널 그룹 문자열을 생성한다.
 * @param baseT1   참이면 T1 기준으로 판단, 거짓이면 E1 기준으로 판단
 * @returns	채널 그룹 문자열
 */
ChannelGroupDescr.prototype.generateChannelGroupDescr = function( baseT1 ) {

	if ( this.channelInfos.length == 0 ) {
		return '';
	}
	
	var capacityNm = null;
	for ( var idx =0; idx < this.channelInfos.length; idx++ ) {
		var channelInfo = this.channelInfos[idx];
		if ( capacityNm != null && capacityNm != channelInfo.CHANNEL_CAPACITY_NM ) {
			throw new PathException( EnumPathException.CANT_GROUPING_NOT_EQUAL_CHANNEL_CAPA, channelInfo );
		}
		
		capacityNm = channelInfo.CHANNEL_CAPACITY_NM;
	}
	
	//	채널을 정렬
	this.channelInfos.sort( ChannelDescrInfo.prototype.channelInfoSortFunction );

	//	연속된 채널들을 그룹으로 묶는다.
	var prevChannelInfo = null;
	var arrChannelGroup = null;
	var arrChannelGroupList = [];
	
	for ( var idx =0; idx < this.channelInfos.length; idx++ ) {
		var channelInfo = this.channelInfos[idx];
		if ( prevChannelInfo == null || prevChannelInfo.isNextChannel(channelInfo, baseT1) == false ) {
			arrChannelGroup = [];
			arrChannelGroupList.push(arrChannelGroup);
		} 
		
		arrChannelGroup.push(channelInfo);
		prevChannelInfo = channelInfo;
	}
	
	
	var groupDescr = '';
	
	for ( var idx =0; idx < arrChannelGroupList.length; idx++ ) {
		arrChannelGroup =  arrChannelGroupList[idx];
		if ( arrChannelGroup.length == 1 ) {
			groupDescr += CHANNEL_GRP_SEP + arrChannelGroup[0].channelDescrWithoutSep();
		} else if ( arrChannelGroup.length > 1 ) {
			groupDescr += CHANNEL_GRP_SEP + arrChannelGroup[0].channelDescrWithoutSep() + CHANNEL_GRP_SEP_BUNDLE
									+ arrChannelGroup[arrChannelGroup.length-1].channelDescrWithoutSep();
		}
	}
	
	//	첫번째 "/" 를 제외
	if ( groupDescr.startsWith( CHANNEL_GRP_SEP ) ) {
		groupDescr = groupDescr.substring(1);
	}
	
	//	포트, 채널 구분자 포함
	var channelInfo = this.channelInfos[0];
	groupDescr = channelInfo.PRE_SEP + groupDescr;
	
	return groupDescr;
};



/**
 * 입력한 문자열이 채널 그룹 문자열인지 여부
 *  
 * @param value
 * @return boolean
 */
ChannelGroupDescr.prototype.isChannelGroupDescr = function( value ) {
    if ( isNullOrEmpty(value) == false && 
        ( value.indexOf(CHANNEL_GRP_SEP) != -1 || value.indexOf(CHANNEL_GRP_SEP_BUNDLE) != -1 ) ) {
        return true;
    }
    
    return false;
};




