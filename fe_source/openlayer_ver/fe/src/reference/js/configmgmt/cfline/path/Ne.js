//11		FDF
//162		QDF 
//177		OFD
//178		IJP 
//182       PBOX
var g_arrEqpRoleDivCdFdf = ['11', '162', '177', '178','182']; // PBOX 추가  2019-12-24


//124		M-WDM(기간망)
//125		WDM(기간망)
//145		WDM 시외망(단국용)
//15		DWDM
//150		CWDM(기간망)
//16		CWDM
//169		WDM 시내망(단국용) 
var g_arrEqpRoleDivCdWdm = ['15', '16', '124', '125', '145', '150', '169'];

//181		COUPLER
var g_arrEqpRoleDivCdCoupler = ['181'];

//DMB0001051 : DNX-88 (N-DCS)
//DMB0001575 : DCSII-A(N-DCS)
var g_arrEqpModelNDCS = ['DMB0001051', 'DMB0001575' ];

// MW 장비모델
var g_arrEqpModelMW = ['DMT0001637', 'DMT0001638' , 'DMT0001639' , 'DMT0001660' , 'DMT0001661' ]
// MW 장비 ROLL
var g_arrEqpRoleDivCdMW = ['10'];


function Ne() {
	this.MODEL_ID = '';
	this.MODEL_NM = '';
	this.MODEL_LCL_CD = '';
	this.MODEL_LCL_NM = '';
	this.MODEL_MCL_CD = '';
	this.MODEL_MCL_NM = '';
	this.MODEL_SCL_CD = '';
	this.MODEL_SCL_NM = '';
	this.VENDOR_ID = '';
	this.VENDOR_NM = '';
	
	this.NE_ID = '';
	this.NE_NM = '';
	this.NE_ROLE_CD = '';
	this.NE_ROLE_NM = '';
	this.NE_STATUS_CD = '';
	this.NE_STATUS_NM = '';
	this.NE_DUMMY = '';
	this.NE_NULL = '';
	this.NE_REMARK = '';	

	this.JRDT_TEAM_ORG_ID = '';
	this.JRDT_TEAM_ORG_NM = '';
	
	this.OP_TEAM_ORG_ID = '';
	this.OP_TEAM_ORG_NM = '';
	this.ORG_ID = '';
	this.ORG_NM = '';
	this.EQP_INSTL_MTSO_LAT_VAL = 0;
	this.EQP_INSTL_MTSO_LNG_VAL = 0;
	this.EQP_INSTL_MGMT_GRP_CD = '';
	this.ORG_ID_L3 = '';
	this.ORG_NM_L3 = '';	
	
	this.FIVE_GPON_EQP_TYPE = '';
	
	this.VIRTUAL_YN = 'N';
};


Ne.prototype = new Object();

Ne.prototype.constructor = Ne;

Ne.prototype.fromData = function( obj, prefix ) {
	
	this.MODEL_ID = obj[prefix + 'MODEL_ID'];
	this.MODEL_NM = obj[prefix + 'MODEL_NM'];
	this.MODEL_LCL_CD = obj[prefix + 'MODEL_LCL_CD'];
	this.MODEL_LCL_NM = obj[prefix + 'MODEL_LCL_NM'];
	this.MODEL_MCL_CD = obj[prefix + 'MODEL_MCL_CD'];
	this.MODEL_MCL_NM = obj[prefix + 'MODEL_MCL_NM'];
	this.MODEL_SCL_CD = obj[prefix + 'MODEL_SCL_CD'];
	this.MODEL_SCL_NM = obj[prefix + 'MODEL_SCL_NM'];
	this.VENDOR_ID = obj[prefix + 'VENDOR_ID'];
	this.VENDOR_NM = obj[prefix + 'VENDOR_NM'];
	
	this.NE_ID = obj[prefix + 'NE_ID'];
	this.NE_NM = obj[prefix + 'NE_NM'];
	this.NE_ROLE_CD = obj[prefix + 'NE_ROLE_CD'];
	this.NE_ROLE_NM = obj[prefix + 'NE_ROLE_NM'];
	this.NE_STATUS_CD = obj[prefix + 'NE_STATUS_CD'];
	this.NE_STATUS_NM = obj[prefix + 'NE_STATUS_NM'];
	this.NE_DUMMY = obj[prefix + 'NE_DUMMY'];
	this.NE_NULL = obj[prefix + 'NE_NULL'];
	this.NE_REMARK = obj[prefix + 'NE_REMARK'];	

	this.JRDT_TEAM_ORG_ID = obj[prefix + 'JRDT_TEAM_ORG_ID'];
	this.JRDT_TEAM_ORG_NM = obj[prefix + 'JRDT_TEAM_ORG_NM'];
	
	this.OP_TEAM_ORG_ID = obj[prefix + 'OP_TEAM_ORG_ID'];
	this.OP_TEAM_ORG_NM = obj[prefix + 'OP_TEAM_ORG_NM'];
	this.ORG_ID = obj[prefix + 'ORG_ID'];
	this.ORG_NM = obj[prefix + 'ORG_NM'];
	this.EQP_INSTL_MTSO_LAT_VAL = Number( obj[prefix + 'EQP_INSTL_MTSO_LAT_VAL'] );
	this.EQP_INSTL_MTSO_LNG_VAL = Number( obj[prefix + 'EQP_INSTL_MTSO_LNG_VAL'] );
	this.EQP_INSTL_MGMT_GRP_CD = obj[prefix + 'EQP_INSTL_MGMT_GRP_CD'];
	this.ORG_ID_L3 = obj[prefix + 'ORG_ID_L3'];
	this.ORG_NM_L3 = obj[prefix + 'ORG_NM_L3'];	
	
	this.FIVE_GPON_EQP_TYPE = obj[prefix + 'FIVE_GPON_EQP_TYPE'];	
	
	this.VIRTUAL_YN = obj[prefix + 'VIRTUAL_YN'];
};



Ne.prototype.toData = function( obj, prefix ) {
	copyAttributeWithReplacingPrefix( this, obj, '', prefix );
};




Ne.prototype.fromMtso = function( mstoInfo ) {
	
	this.ORG_ID = mstoInfo.MTSO_ID;
	this.ORG_NM = mstoInfo.MTSO_NM;

	this.ORG_ID_L3 = mstoInfo.TOP_MTSO_ID;
	this.ORG_NM_L3 = mstoInfo.TOP_MTSO_NM;	

	this.EQP_INSTL_MTSO_LAT_VAL = mstoInfo.MTSO_LAT_VAL;
	this.EQP_INSTL_MTSO_LNG_VAL = mstoInfo.MTSO_LNG_VAL;
	this.EQP_INSTL_MGMT_GRP_CD = mstoInfo.MGMT_GRP_CD;

	this.JRDT_TEAM_ORG_ID = mstoInfo.JRDT_TEAM_ORG_ID;
	this.JRDT_TEAM_ORG_NM = mstoInfo.JRDT_TEAM_ORG_NM;
	
	this.OP_TEAM_ORG_ID = mstoInfo.OP_TEAM_ORG_ID;
	this.OP_TEAM_ORG_NM = mstoInfo.OP_TEAM_ORG_NM;
};


Ne.prototype.toMtso = function() {
	
	var mstoInfo = new Mtso();
	
	mstoInfo.MTSO_ID = this.ORG_ID;
	mstoInfo.MTSO_NM = this.ORG_NM;

	mstoInfo.TOP_MTSO_ID = this.ORG_ID_L3;
	mstoInfo.TOP_MTSO_NM = this.ORG_NM_L3;	

	mstoInfo.MTSO_LAT_VAL = this.EQP_INSTL_MTSO_LAT_VAL;
	mstoInfo.MTSO_LNG_VAL = this.EQP_INSTL_MTSO_LNG_VAL;
	mstoInfo.MGMT_GRP_CD = this.EQP_INSTL_MGMT_GRP_CD;

	mstoInfo.JRDT_TEAM_ORG_ID = this.JRDT_TEAM_ORG_ID;
	mstoInfo.JRDT_TEAM_ORG_NM = this.JRDT_TEAM_ORG_NM;
	
	mstoInfo.OP_TEAM_ORG_ID = this.OP_TEAM_ORG_ID;
	mstoInfo.OP_TEAM_ORG_NM = this.OP_TEAM_ORG_NM;
	
	return mstoInfo;
};




Ne.prototype.isValid = function() {
	if ( isNullOrEmpty(this.NE_ID) == false ) {
		return true;
	}
	
	return false;
};


/**
 * NULL 장비 ( 장비 ID 가 없거나 NULL 장비 ID 인 경우 ) 여부
 * @returns {Boolean}
 */
Ne.prototype.isNull = function() {
	if ( isNullOrEmpty(this.NE_ID) || this.NE_ID == 'DV00000000000' ) {
		return true;
	}
	
	return false;
};



/**
 * 가상 장비 여부
 * @returns {Boolean}
 */
Ne.prototype.isVirtualNe = function() {
	if ( this.VIRTUAL_YN === 'Y' ) {
		return true;
	}
	
	return false;
};




/**
 * FDF 장비 타입 여부
 */
Ne.prototype.isFdfRole = function() {
	for (var idx = 0; idx < g_arrEqpRoleDivCdFdf.length; idx++) {
		if(g_arrEqpRoleDivCdFdf[idx] == this.NE_ROLE_CD) {
			return true;
		}
	}
	
	return false;	
};

/**
 * WDM 장비 타입 여부
 */
Ne.prototype.isWdmRole = function() {
	for (var idx = 0; idx < g_arrEqpRoleDivCdWdm.length; idx++) {
		if(g_arrEqpRoleDivCdWdm[idx] == this.NE_ROLE_CD) {
			return true;
		}
	}
	
	return false;	
};


/**
 * Coupler 장비 타입 여부
 */
Ne.prototype.isCouplerRole = function() {
	for (var idx = 0; idx < g_arrEqpRoleDivCdCoupler.length; idx++) {
		if(g_arrEqpRoleDivCdCoupler[idx] == this.NE_ROLE_CD) {
			return true;
		}
	}
	
	return false;	
};



/**
 * NDCS 모델 여부
 */
Ne.prototype.isModelNDCS = function() {
	for (var idx = 0; idx < g_arrEqpModelNDCS.length; idx++) {
		if(g_arrEqpModelNDCS[idx] == this.MODEL_ID) {
			return true;
		}
	}
	
	return false;	
};



Ne.prototype.makeNodeTitle = function() {

	if ( isNullOrEmpty(this.NE_NM) ) {
		if ( isNullOrEmpty(this.ORG_NM_L3) ) {
			return "미확인장비";
		} else {
    		if ( this.NE_DUMMY ) {
        		return omitLongText(this.ORG_NM_L3 + "_미확인장비");
    		} else {
        		return omitLongText(this.ORG_NM_L3);
    		}
		}
	} else {
		return omitLongText(this.NE_NM);
	}
};



Ne.prototype.clone = function() {
	var obj = new Ne();
	copyAttributeAll(this, obj);
	return obj;
};



Ne.prototype.toDebugString = function() {
	var str = '';
	str = '[MODEL_ID:' + this.MODEL_ID  + '][MODEL_NM:'+ this.MODEL_NM 
				+ '][MODEL_LCL_CD:' + this.MODEL_LCL_CD  + '][MODEL_LCL_NM:'+ this.MODEL_LCL_NM 
				+ '][MODEL_MCL_CD:' + this.MODEL_MCL_CD + '][MODEL_MCL_NM:' + this.MODEL_MCL_NM
				+ '][MODEL_SCL_CD:' + this.MODEL_SCL_CD + '][MODEL_SCL_NM:' + this.MODEL_SCL_NM
				+ '][VENDOR_ID:' + this.VENDOR_ID + '][VENDOR_NM:' + this.VENDOR_NM
				+ '][NE_ID:' + this.NE_ID  + '][NE_NM:'+ this.NE_NM 
				+ '][NE_ROLE_CD:' + this.NE_ROLE_CD  + '][NE_ROLE_NM:'+ this.NE_ROLE_NM
				+ '][NE_STATUS_CD:' + this.NE_STATUS_CD  + '][NE_STATUS_NM:'+ this.NE_STATUS_NM
				+ '][NE_DUMMY:' + this.NE_DUMMY  + '][NE_NULL:'+ this.NE_NULL
				+ '][NE_REMARK:' + this.NE_REMARK 
				+ '][JRDT_TEAM_ORG_ID:' + this.JRDT_TEAM_ORG_ID  + '][JRDT_TEAM_ORG_NM:'+ this.JRDT_TEAM_ORG_NM
				+ '][OP_TEAM_ORG_ID:' + this.OP_TEAM_ORG_ID  + '][OP_TEAM_ORG_NM:'+ this.OP_TEAM_ORG_NM
				+ '][ORG_ID:' + this.ORG_ID  + '][ORG_NM:'+ this.ORG_NM
				+ '][ORG_ID_L3:' + this.ORG_ID_L3  + '][ORG_NM_L3:'+ this.ORG_NM_L3
				+ ']';

	return str;
};



Ne.prototype.toString = function() {
	var descr = '';
	if ( this.isValid ) {
		descr = '장비ID : ' + this.NE_ID  + '\n장비명 : '+ this.NE_NM + '\n장비타입 : ' + this.NE_ROLE_NM + '\n모델명 : ' + this.MODEL_NM + '\n전송실 : ' + this.ORG_NM_L3
						+ '\n국사 : ' + this.ORG_NM + '\n상태 : ' + this.NE_STATUS_NM;
		
		if ( this.NE_DUMMY ) {
			descr += '\n더미장비 : ' + 'Yes';
		} else {
			descr += '\n더미장비 : ' + 'No';
		}
		 
	} else {
		descr = '장비 정보 없음';
	}

	return descr;
};




Ne.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {
		return true;
	} else {
		return false;
	}

};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 작업후 Ne isChange 함수 추가함...
 * 기존 Ne.prototype.equals 이 사용하는 equalsAttr()함수가 문제점이 있어 equalsAttrWithReturn() 로 비교함
 * 
 * return : 변경된경우 - true, 변경되지 않은 경우 - false
 * */
Ne.prototype.isChange = function(other) {
	
	if ( equalsAttrWithReturn(this, other) ) {
		return false;
	} else {
		return true;
	}
};


/**
 * Micro Wave 모델 여부
 */
Ne.prototype.isModelMW = function() {
	for (var idx = 0; idx < g_arrEqpModelMW.length; idx++) {
		if(g_arrEqpModelMW[idx] == this.MODEL_ID) {
			return true;
		}
	}
	
	return false;	
};

/**
 * Micro Wave 모델 여부
 */
Ne.prototype.isMwRoleCd = function() {
	for (var idx = 0; idx < g_arrEqpRoleDivCdMW.length; idx++) {
		if(g_arrEqpRoleDivCdMW[idx] == this.NE_ROLE_CD) {
			return true;
		}
	}
	
	return false;	
};
