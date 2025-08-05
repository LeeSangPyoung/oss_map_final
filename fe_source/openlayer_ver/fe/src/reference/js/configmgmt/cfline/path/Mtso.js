
function Mtso() {

	this.MTSO_ID = '';
	this.MTSO_NM = '';
	
	this.TOP_MTSO_ID = '';
	this.TOP_MTSO_NM = '';	

	this.MTSO_TYP_CD = '';
	this.MTSO_TYP_NM = '';
	
	this.MTSO_LAT_VAL = 0;
	this.MTSO_LNG_VAL = 0;
	this.MGMT_GRP_CD = '';
	
	this.JRDT_TEAM_MTSO_ID = '';
	this.JRDT_TEAM_MTSO_NM = '';
	
	this.OP_TEAM_MTSO_ID = '';
	this.OP_TEAM_MTSO_NM = '';
	
};


Mtso.prototype = new Object();

Mtso.prototype.constructor = Mtso;

Mtso.prototype.fromData = function( obj, prefix ) {

	this.MTSO_ID = obj[prefix + 'MTSO_ID'];
	this.MTSO_NM = obj[prefix + 'MTSO_NM'];
	
	this.TOP_MTSO_ID = obj[prefix + 'TOP_MTSO_ID'];
	this.TOP_MTSO_NM = obj[prefix + 'TOP_MTSO_NM'];	
	
	this.MTSO_TYP_CD = obj[prefix + 'MTSO_TYP_CD'];
	this.MTSO_TYP_NM = obj[prefix + 'MTSO_TYP_NM'];
	
	this.MTSO_LAT_VAL = Number( obj[prefix + 'MTSO_LAT_VAL'] );
	this.MTSO_LNG_VAL = Number( obj[prefix + 'MTSO_LNG_VAL'] );
	this.MGMT_GRP_CD = obj[prefix + 'MGMT_GRP_CD'];
	
	this.JRDT_TEAM_MTSO_ID = obj[prefix + 'JRDT_TEAM_MTSO_ID'];
	this.JRDT_TEAM_MTSO_NM = obj[prefix + 'JRDT_TEAM_MTSO_NM'];
	
	this.OP_TEAM_MTSO_ID = obj[prefix + 'OP_TEAM_MTSO_ID'];
	this.OP_TEAM_MTSO_NM = obj[prefix + 'OP_TEAM_MTSO_NM'];

};



Mtso.prototype.toData = function( obj, prefix ) {
	copyAttributeWithReplacingPrefix( this, obj, '', prefix );
};




Mtso.prototype.isValid = function() {
	if ( isNullOrEmpty(this.MTSO_ID) == false ) {
		return true;
	}
	
	return false;
};


/**
 * NULL 국사 ( 국사 ID 가 없거나 NULL 인 경우 ) 여부
 * @returns {Boolean}
 */
Mtso.prototype.isNull = function() {
	if ( isNullOrEmpty(this.MTSO_ID) ) {
		return true;
	}
	
	return false;
};




Mtso.prototype.clone = function() {
	var obj = new Mtso();
	copyAttributeAll(this, obj);
	return obj;
};



Mtso.prototype.toDebugString = function() {
	var str = '';
	str = 		'[MTSO_ID:' + this.MTSO_ID  + '][MTSO_NM:'+ this.MTSO_NM
				+ '][TOP_MTSO_ID:' + this.TOP_MTSO_ID  + '][TOP_MTSO_NM:'+ this.TOP_MTSO_NM
				+ '][MTSO_TYP_CD:' + this.MTSO_TYP_CD  + '][MTSO_TYP_NM:'+ this.MTSO_TYP_NM
				+ '][MTSO_LAT_VAL:' + this.MTSO_LAT_VAL  + '][MTSO_LNG_VAL:'+ this.MTSO_LNG_VAL
				+ '][JRDT_TEAM_MTSO_ID:' + this.JRDT_TEAM_MTSO_ID  + '][JRDT_TEAM_MTSO_NM:'+ this.JRDT_TEAM_MTSO_NM
				+ '][OP_TEAM_MTSO_ID:' + this.OP_TEAM_MTSO_ID  + '][OP_TEAM_MTSO_NM:'+ this.OP_TEAM_MTSO_NM
				+ ']';

	return str;
};



Mtso.prototype.toString = function() {
	var descr = '';
	if ( this.isValid ) {
		descr = '국사ID : ' + this.MTSO_ID  + '\n국사명 : '+ this.MTSO_NM  + '\n국사명 : '+ this.TOP_MTSO_NM
						+ '\n국사타입 : ' + this.MTSO_TYP_NM
						+ '\위도값 : ' + this.MTSO_LAT_VAL + '\n경도값 : ' + this.MTSO_LNG_VAL 
						+ '\n관할팀 : ' + this.JRDT_TEAM_MTSO_NM + '\n운영팀 : ' + this.OP_TEAM_MTSO_NM;
		 
	} else {
		descr = '국사 정보 없음';
	}

	return descr;
};



Mtso.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {
		return true;
	} else {
		return false;
	}

};
