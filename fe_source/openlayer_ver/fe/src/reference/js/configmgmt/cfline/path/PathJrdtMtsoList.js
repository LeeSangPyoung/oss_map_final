
function PathJrdtMtsoList() {

	this.JRDT_MTSO_LIST = [];
};


PathJrdtMtsoList.prototype = new Object();

PathJrdtMtsoList.prototype.constructor = PathJrdtMtsoList;

PathJrdtMtsoList.prototype.fromTmofInfo = function( obj ) {

	for ( var idx = 0; idx < obj.length; idx++ ) {
		var tmof = obj[idx];
		var jrdtMtso = new PathJrdtMtso();

		jrdtMtso.MTSO_ID = tmof.mtsoId;
		jrdtMtso.MTSO_NM = tmof.mtsoNm;
		
		jrdtMtso.JRDT_MTSO_TYP_CD = tmof.jrdtMtsoTypCd;
		jrdtMtso.JRDT_MTSO_TYP_NM = '';

		jrdtMtso.MTSO_LNO_INS_PROG_STAT_CD = tmof.mtsoLnoInsProgStatCd;
		jrdtMtso.MTSO_LNO_INS_PROG_STAT_NM = tmof.statNm;
		
		this.JRDT_MTSO_LIST.push(jrdtMtso);
	}
	
};


PathJrdtMtsoList.prototype.fromData = function( obj ) {

	for ( var idx = 0; idx < obj.length; idx++ ) {
		var jrdtData = obj[idx];
		var jrdtMtso = new PathJrdtMtso();
		
		jrdtMtso.MTSO_ID = jrdtData.mtsoId;
		jrdtMtso.MTSO_NM = jrdtData.mtsoNm;

		jrdtMtso.TOP_MTSO_ID = jrdtData.topMtsoId;
		jrdtMtso.TOP_MTSO_NM = jrdtData.topMtsoNm;
		
		jrdtMtso.JRDT_MTSO_TYP_CD = jrdtData.jrdtMtsoTypCd;
		jrdtMtso.JRDT_MTSO_TYP_NM = '';

		jrdtMtso.MTSO_LNO_INS_PROG_STAT_CD = jrdtData.mtsoLnoInsProgStatCd;
		jrdtMtso.MTSO_LNO_INS_PROG_STAT_NM = '';
		
		this.JRDT_MTSO_LIST.push(jrdtMtso);
	}
	
};

/**
 * 
 * 상위국이 있는 지 여부
 *  
 * @return boolean
 */
PathJrdtMtsoList.prototype.hasUpperMtso = function() {
	
	for ( var idx = 0; idx < this.JRDT_MTSO_LIST.length; idx++ ) {
    	var obj = this.JRDT_MTSO_LIST[idx];
        if ( obj.isUpperMtso() ) {
            return true;
        }
    }
    
    return false;
};




/**
 * 
 * 상위국을 구한다.
 *  
 * @return
 */
PathJrdtMtsoList.prototype.getUpperMtso = function() {
	
	for ( var idx = 0; idx < this.JRDT_MTSO_LIST.length; idx++ ) {
    	var obj = this.JRDT_MTSO_LIST[idx];
        if ( obj.isUpperMtso() ) {
            return obj;
        }
    }
	
	throw new PathException( EnumPathException.NOT_EXIST_UPPER_MTSO, this );
};



/**
 * 
 * 하위국이 있는 지 여부
 *  
 * @return boolean
 */
PathJrdtMtsoList.prototype.hasLowerMtso = function() {
	
	for ( var idx = 0; idx < this.JRDT_MTSO_LIST.length; idx++ ) {
    	var obj = this.JRDT_MTSO_LIST[idx];
        if ( obj.isLowerMtso() ) {
            return true;
        }
    }
    
    return false;
};


/**
 * 
 * 하위국을 구한다.
 *  
 * @return
 * @throws NoExistPathMtsoException 
 */
PathJrdtMtsoList.prototype.getLowerMtso = function() {
	
	for ( var idx = 0; idx < this.JRDT_MTSO_LIST.length; idx++ ) {
    	var obj = this.JRDT_MTSO_LIST[idx];
        if ( obj.isLowerMtso() ) {
            return obj;
        }
    }
	
	throw new PathException( EnumPathException.NOT_EXIST_LOWER_MTSO, this );
};







