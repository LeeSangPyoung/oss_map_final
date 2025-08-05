/**
 * 채널 단위 정보
 */
function ChannelUnitInfo() {
	this.CHANNEL_VALUE = '';
	this.CHANNEL_NUMBER_VALUE = 0;
//	this.CHANNEL_UNIT_RULE_CAPACITY_NM = '';
//	this.CHANNEL_UNIT_RULE_CAPACITY_E1 = 0;
//	this.CHANNEL_UNIT_RULE_IS_NDCS = false;
//	this.CHANNEL_UNIT_RULE_MAX = 0;
//	this.CHANNEL_UNIT_RULE_MIN = 0;
//	this.CHANNEL_UNIT_RULE_PRE_SEP = '';
	
};


ChannelUnitInfo.prototype = new Object();

ChannelUnitInfo.prototype.constructor = ChannelUnitInfo;

/**
 * JSON 데이터를 읽는다.
 * @param obj
 * @param prefix
 */
ChannelUnitInfo.prototype.fromData = function(obj, prefix) {
	this.CHANNEL_VALUE = obj[prefix + 'CHANNEL_VALUE'];
	this.CHANNEL_NUMBER_VALUE = obj[prefix + 'CHANNEL_NUMBER_VALUE'];
//	this.CHANNEL_UNIT_RULE_CAPACITY_NM = obj[prefix + 'CHANNEL_UNIT_RULE_CAPACITY_NM'];
//	this.CHANNEL_UNIT_RULE_CAPACITY_E1 = obj[prefix + 'CHANNEL_UNIT_RULE_CAPACITY_E1'];
//	this.CHANNEL_UNIT_RULE_IS_NDCS = obj[prefix + 'CHANNEL_UNIT_RULE_IS_NDCS'];
//	this.CHANNEL_UNIT_RULE_MAX = obj[prefix + 'CHANNEL_UNIT_RULE_MAX'];
//	this.CHANNEL_UNIT_RULE_MIN = obj[prefix + 'CHANNEL_UNIT_RULE_MIN'];
//	this.CHANNEL_UNIT_RULE_PRE_SEP = obj[prefix + 'CHANNEL_UNIT_RULE_PRE_SEP'];
};


/**
 * Object 데이터를 읽는다.
 * @param obj
 * @param prefix
 */
ChannelUnitInfo.prototype.fromObject = function(obj, prefix) {
	this.CHANNEL_VALUE = obj[prefix + 'channelValue'];
	this.CHANNEL_NUMBER_VALUE = obj[prefix + 'channelNumberValue'];
//	this.CHANNEL_UNIT_RULE_CAPACITY_NM = obj[prefix + 'CHANNEL_UNIT_RULE_CAPACITY_NM'];
//	this.CHANNEL_UNIT_RULE_CAPACITY_E1 = obj[prefix + 'CHANNEL_UNIT_RULE_CAPACITY_E1'];
//	this.CHANNEL_UNIT_RULE_IS_NDCS = obj[prefix + 'CHANNEL_UNIT_RULE_IS_NDCS'];
//	this.CHANNEL_UNIT_RULE_MAX = obj[prefix + 'CHANNEL_UNIT_RULE_MAX'];
//	this.CHANNEL_UNIT_RULE_MIN = obj[prefix + 'CHANNEL_UNIT_RULE_MIN'];
//	this.CHANNEL_UNIT_RULE_PRE_SEP = obj[prefix + 'CHANNEL_UNIT_RULE_PRE_SEP'];
};



ChannelUnitInfo.prototype.equals = function(other) {
    if ( isNullOrEmpty(this.CHANNEL_VALUE) == false && this.CHANNEL_VALUE === other.CHANNEL_VALUE ) {
        return true;
    }
   
    return false;
};



