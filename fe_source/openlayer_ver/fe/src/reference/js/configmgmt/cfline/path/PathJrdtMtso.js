
function PathJrdtMtso() {

	this.JRDT_MTSO_TYP_CD = '';
	this.JRDT_MTSO_TYP_NM = '';

	this.MTSO_LNO_INS_PROG_STAT_CD = '';
	this.MTSO_LNO_INS_PROG_STAT_NM = '';
	
};


PathJrdtMtso.prototype = new Mtso();

PathJrdtMtso.prototype.constructor = PathJrdtMtso;

PathJrdtMtso.prototype.fromData = function( obj, prefix ) {

	this.JRDT_MTSO_TYP_CD = obj[prefix + 'JRDT_MTSO_TYP_CD'];
	this.JRDT_MTSO_TYP_NM = obj[prefix + 'JRDT_MTSO_TYP_NM'];
	
	this.MTSO_LNO_INS_PROG_STAT_CD = obj[prefix + 'MTSO_LNO_INS_PROG_STAT_CD'];
	this.MTSO_LNO_INS_PROG_STAT_NM = obj[prefix + 'MTSO_LNO_INS_PROG_STAT_NM'];

};


PathJrdtMtso.prototype.clone = function() {
	var obj = new PathJrdtMtso();
	copyAttributeAll(this, obj);
	return obj;
};


/**
 * 
 * 이 국사가 상위국인지 여부
 *  
 * @return boolean
 */
PathJrdtMtso.prototype.isUpperMtso = function() {
    if ( this.JRDT_MTSO_TYP_CD == '01' ) {
        return true;
    }
    
    return false;
};


/**
 * 
 * 이 국사가 하위국인지 여부
 *  
 * @return boolean
 */
PathJrdtMtso.prototype.isLowerMtso = function() {
    if ( this.JRDT_MTSO_TYP_CD == '02' ) {
        return true;
    }
    
    return false;
};


/**
 * 
 * 이 국사가 경유국인지 여부
 *  
 * @return boolean
 */
PathJrdtMtso.prototype.isPathMtso = function() {
    if ( this.JRDT_MTSO_TYP_CD == '03' ) {
        return true;
    }
    
    return false;
};




