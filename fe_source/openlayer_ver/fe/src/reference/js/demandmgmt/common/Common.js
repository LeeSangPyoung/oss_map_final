/**
 * common.js
 *
 * @author P095782
 * @date 2016. 7. 12. 오전 13:10:03
 * @version 1.0
 */
$(document).ready(function() {
	//console.log("common.js loaded .. [$(document).ready()]");
	$('.Textinput').keydown(function(){
		if(event.keyCode == 13) {
			if ($('#search').val() != undefined) {
				if ($('#search').hasClass("Disabled") == true) {
					return false;
				}
				var value = $.trim($(this).val());
				$(this).val(value);
				
				$('#search').click(); 
				return false;
			} 
			if ($('#popSearch').val() != undefined) {
				if ($('#popSearch').hasClass("Disabled") == true) {
					return false;
				}
				
				var value = $.trim($(this).val());
				$(this).val(value);
				
				$('#popSearch').click(); 
				return false;
			}
		}
	});		
	
	$('#searchForm .Textinput').blur(function(){
		var value = $.trim($(this).val());
		$(this).val(value);
	});

	$('#popSearchForm .Textinput').blur(function(){
		var value = $.trim($(this).val());
		$(this).val(value);
	});
});

/*
 * Function Name : selectComboCode
 * Description   : 공통코드 콤보박스 세팅
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectComboCode(objId, allYn, comGrpCd, selectedValue) {
	var str = objId + "," + allYn + "," +selectedValue;
	
	var sflag = {
			  jobTp : 'selectComboCode'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	var requestParam = { comGrpCd : comGrpCd };
	//httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/', requestParam, successCommonCallback, failCommonCallback, 'GET', str );
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',requestParam, 'GET', str );
	Tango.ajax({
		//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
}

/*
 * Function Name : selectAfeYearCode
 * Description   : AFE 년도 가져오는 스크립트
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectAfeYearCode(objId, allYn, selectedValue) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : 'selectAfeYearCode'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafeyrlist/', null,'GET', str );
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getafeyrlist/',
		data : {},
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
}

/*
 * Function Name : selectAfeTsCode
 * Description   : AFE 차수 가져오는 스크립트
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값 
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function selectAfeTsCode(objId, allYn, selectedValue, selectedObjId) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : 'selectAfeTsCode'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/', selectedObjId, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/',
		data : selectedObjId,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}

/*
 * Function Name : selectAfeTsCodeTwo
 * Description   : AFE 차수 가져오는 스크립트
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값 
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function selectAfeTsCodeTwo(objId, allYn, selectedValue, selectedObjId) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : ''
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/', selectedObjId, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/',
		data : selectedObjId,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}

/*
 * Function Name : selectAfeTsCodeByERP
 * Description   : AFE 차수 가져오는 스크립트 By ERP
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값 
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function selectAfeTsCodeByERP(objId, allYn, selectedValue, selectedObjId) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : 'selectAfeTsCode'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/', selectedObjId, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlistbyerp/',
		data : selectedObjId,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}

/*
 * Function Name : selectComboCodeByErp
 * Description   : ERP 사업구분 가져오는 스크립트 By ERP
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값 
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function selectComboCodeByErp(objId, allYn, selectedValue, selectedObjId) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : 'selectComboCode'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/', selectedObjId, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getbizdivcdlistbyerp/',
		data : selectedObjId,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}

/*
 * Function Name : selectYearBizComboByErp
 * Description   : TANGO 사업구분 가져오는 스크립트 By ERP
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값 
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function selectYearBizComboByErp(objId, allYn, selectedValue, selectedObjId) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : 'selectComboCode'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/', selectedObjId, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getyearbizlistbyerp/',
		data : selectedObjId,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}


/*
 * Function Name : selectYearBizCombo
 * Description   : 공통코드 년도별 사업구분대/소 콤보박스 세팅
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID  // 없는경우 콤보 목록을 리턴
 * allYn         : option '전체' 생성 여부  Y : 전체, S : 선택, NS : 필수선택, N : 별도옵션없음 
 * afeYear		 : 년도
 * supCd		 : 부모 코드값
 * selectedValue : 선택될 초기값
 * dmndCl		 : 수요 구분값 [T:유선망, A:A망, B:B2B, TA:유선망+A망]
 * invtDivCd     : 투자유형구분[E : 장비, L : 선로/관로]
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectYearBizCombo(objId, allYn, afeYr, supCd, selectedValue, demdDivCd, invtDivCd) {
	var str = objId + "," + allYn + "," + selectedValue;
	var sflag = {
			  jobTp : 'selectYearBizCombo'
			, objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	var requestParam = { 
				afeYr : afeYr
			  , demdDivCd : demdDivCd
			  , supCd : supCd 
			  , invtDivCd : invtDivCd};
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectyearbizlist/', requestParam, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectyearbizlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}

/*
 * Function Name : selectComboEqpLnTyp
 * Description   : 공통코드 콤보박스 세팅
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectComboEqpLnTyp(objId, allYn, param, selectedValue) {
	var sflag = {
			  objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/', requestParam, successCommonCallback, failCommonCallback, 'GET', str );
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',requestParam, 'GET', str );
	Tango.ajax({
		//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectComboEqpLnTyp/',
		data : param,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
}


function selectComboIntgfclts(objId, allYn, param, selectedValue) {
	var sflag = {
			  objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/', requestParam, successCommonCallback, failCommonCallback, 'GET', str );
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',requestParam, 'GET', str );
	Tango.ajax({
		//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectComboIntgfclts/',
		data : param,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
}



/*
 * Function Name : selectWbsIdList
 * Description   : 공통코드 년도별 사업구분대/소 콤보박스 세팅
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID  // 없는경우 콤보 목록을 리턴
 * allYn         : option '전체' 생성 여부  Y : 전체, S : 선택, NS : 필수선택, N : 별도옵션없음 
 * afeYear		 : 년도
 * supCd		 : 부모 코드값
 * dmndCl		 : 수요 구분값 [T:유선망, A:A망, B:B2B, TA:유선망+A망]
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectWbsIdList(objId, allYn, selectedValue, param) {
	var sflag = {
			  objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectyearbizlist/', requestParam, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectWbsIdList/',
		data : param,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}

/*
 * Function Name : selectEqpTypCdInPrjList
 * Description   : 공통코드 년도별 사업구분대/소 콤보박스 세팅
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID  // 없는경우 콤보 목록을 리턴
 * allYn         : option '전체' 생성 여부  Y : 전체, S : 선택, NS : 필수선택, N : 별도옵션없음 
 * afeYear		 : 년도
 * supCd		 : 부모 코드값
 * dmndCl		 : 수요 구분값 [T:유선망, A:A망, B:B2B, TA:유선망+A망]
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectEqpTypCdInPrjList(objId, allYn, selectedValue, param) {
	var sflag = {
			  objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectyearbizlist/', requestParam, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectEqpTypCdInPrjList/',
		data : param,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
	
}


function selectComboIntgfcltsWithEqp(objId, allYn, param, selectedValue) {
	var sflag = {
			  objId : objId
			, allYn : allYn
			, selectedValue : selectedValue
	};
	
	//httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/', requestParam, successCommonCallback, failCommonCallback, 'GET', str );
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',requestParam, 'GET', str );
	Tango.ajax({
		//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectComboIntgfcltsWithEqp/',
		data : param,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})
}


/*
 * Function Name : getViewDateStr
 * Description   : 날짜변환
 * ----------------------------------------------------------------------------------------------------
 * dateFormat    : dateFormat
 * addDay        : addDay 
 * ----------------------------------------------------------------------------------------------------
 * return        : render string  
 */
function getViewDateStr(dateFormat, addDay) {
	var dateStr = null;
	var calDate = new Date();
	
	if (addDay != null ) {
		calDate.setDate(calDate.getDate() + addDay);
	}
	
	var yyyy = calDate.getFullYear();
	var mm = calDate.getMonth() + 1;
	var dd = calDate.getDate();
	
	if ( mm < 10 ) {
		mm = "0" + mm;
	};
	if ( dd < 10 ) {
		dd = "0" + dd;
	};	
	
	switch(dateFormat) {
		case 'YYYYMMDD' :
			  dateStr = yyyy + "-" + mm + "-" + dd;
			  break;
		case 'YYYY' :
			  dateStr = yyyy;
			  break;
		case 'YYYYMM' :
			  dateStr = yyyy + "-" + mm ;
			  break;
		default :
			  dateStr = yyyy + "-" + mm + "-" + dd;
			  break;
	
	}
	return dateStr;
}

/*
 * Function Name : getViewDateStrFirstMonth
 * Description   : 날짜변환 (통계는 올해 첫번째 달로 셋팅)
 * ----------------------------------------------------------------------------------------------------
 * dateFormat    : dateFormat
 * addDay        : addDay 
 * ----------------------------------------------------------------------------------------------------
 * return        : render string  
 */
function getViewDateStrFirstMonth(dateFormat) {
	var dateStr = null;
	var calDate = new Date();
	
	var yyyy = calDate.getFullYear();
	//var mm = calDate.getMonth() + 1;
	var mm = 1;
	var dd = 1;
	
	if ( mm < 10 ) {
		mm = "0" + mm;
	};
	if ( dd < 10 ) {
		dd = "0" + dd;
	};	
	
	switch(dateFormat) {
		case 'YYYYMMDD' :
			  dateStr = yyyy + "-" + mm + "-" + dd;
			  break;
		case 'YYYY' :
			  dateStr = yyyy;
			  break;
		case 'YYYYMM' :
			  dateStr = yyyy + "-" + mm ;
			  break;
		default :
			  dateStr = yyyy + "-" + mm + "-" + dd;
			  break;
	
	}
	return dateStr;
}

/*
 * Function Name : getViewDateStrFinalMonth
 * Description   : 날짜변환 (유선망 / A망 개통월은 해당연도의 마지막달 로 셋팅)
 * ----------------------------------------------------------------------------------------------------
 * dateFormat    : dateFormat
 * addDay        : addDay 
 * ----------------------------------------------------------------------------------------------------
 * return        : render string  
 */
function getViewDateStrFinalMonth(dateFormat) {
	var dateStr = null;
	var calDate = new Date();
	
	var yyyy = calDate.getFullYear();
	//var mm = calDate.getMonth() + 1;
	var mm = 12;
	var dd = calDate.getDate();
	
	if ( mm < 10 ) {
		mm = "0" + mm;
	};
	if ( dd < 10 ) {
		dd = "0" + dd;
	};	
	
	switch(dateFormat) {
		case 'YYYYMMDD' :
			  dateStr = yyyy + "-" + mm + "-" + dd;
			  break;
		case 'YYYY' :
			  dateStr = yyyy;
			  break;
		case 'YYYYMM' :
			  dateStr = yyyy + "-" + mm ;
			  break;
		default :
			  dateStr = yyyy + "-" + mm + "-" + dd;
			  break;
	
	}
	return dateStr;
}

/*
 * Function Name : setComma
 * Description   : 숫자에 컴마 붙임
 * ----------------------------------------------------------------------------------------------------
 * str    		 : 문자열
 * ----------------------------------------------------------------------------------------------------
 * return        : render string  
 */

function setComma(str) {
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	str += ""; // 숫자를 문자열로 변환
	str = str.replace(/[a-zA-Z]/gi, '');
	while ( reg.test(str) ) {
		str = str.replace(reg, "$1" + "," + "$2");
	}
	
	return str;
};

/*
 * Function Name : nullToEmpty
 * Description   : null을 empty로 변환
 * ----------------------------------------------------------------------------------------------------
 * str    		 : 문자열
 * ----------------------------------------------------------------------------------------------------
 * return        : replace string  
 */

function nullToEmpty(str) {

    if (str == null || str == "null" || typeof str === "undefined" || str === undefined) {
    	str = "";
    }
	
	return str;
};


/*
 * Function Name : numberClass
 * Description   : 그리드 편집시 숫자컬럼 우측정렬하는 css class return
 * ----------------------------------------------------------------------------------------------------
 * data    		 : data
 * rowOption     : rowOption
 * ----------------------------------------------------------------------------------------------------
 * return        : return css  
 */

function numberClass(data, rowOption) {  
	return "n_text-in-grid";
};

/*
 * Function Name : demandTrimAll
 * Description   : 공백제거
 * ----------------------------------------------------------------------------------------------------
 * data    		 : data
 * ----------------------------------------------------------------------------------------------------
 * return        : return   
 */
function demandTrimAll(str) {
	var returnStr = nullToEmpty(str).replace(/ /g, "");
	return returnStr;
}

//최소 display 자리 수(자동 padding)
function number_format(number, digits, dec_point, thousands_sep){
	// *		example 1: number_format(1234.5678, 2);
	// *		returns	1: 1234.57
	number = number.toString();
	if (!number) return;
	
	var parts = number.split('.');
	parts[0] = parts[0].replace(/\B(?=(d\{3})+(?!\d))/g, ',');
	
	//decimals : 소수점 이하
	var dec = parts[1] || '';
	
	if(digits) {
		var d = parseInt(digits);
		dec = dec.length >= parseInt(d) ? parseFloat('0.'+dec).toFixed(d).split('.')[1] : dec + new Array(d - dec.length + 1).join('0');
	}
	
	if(dec && digits>0){
		return parts[0] + '.' + dec;
	}else {
		return parts[0];
	}
}

/*
 * Function Name : getUserErpHdofcInfo
 * Description   : 본부정보 취득후 셋팅
 * ----------------------------------------------------------------------------------------------------
 * objId         : ObjectID
 * allYn		 : 전체여부
 * uperOrgId     : 상위 그룹 코드
 * callBack      : callback
 * ----------------------------------------------------------------------------------------------------
 */
function getUserErpHdofcInfo(objId, allYn, uperOrgId, orgId) {

	// 전송Eng팀
	/*if (orgId == '00003164' || orgId == '00001478') {
		selectComboCode(objId, allYn, 'C00623', '');
		return;
	}*/
	
	var sflag = {
			  jobTp : 'setErpHdofc'
			, objId : objId
			, allYn : allYn
			, orgId : orgId
	};
	
	var requestParam = { 
			uperOrgId : uperOrgId 
			,orgId : orgId 
			};
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selecterphdofcinfo/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, sflag);})
	  .fail(function(response){failCommonCallback(response, sflag);})	 
}



function setErpHdofc(response, flag) {
	var data = response;
	var objId = flag.objId;
	var allYn = flag.allYn;
	var orgId = flag.orgId;
	var callBack = flag.callBack;
	// 수도권Eng  / 전송Eng
	/*if (orgId == '00003164' || orgId == '00001478') {
		selectComboCode(objId, allYn, 'C00623', '');
		return;
	}*/
	if (data == null || data == undefined || data.resultCode == undefined || data.resultCode == null ) {
		//console.log(data.resultCode);
/*		if ($('#search').val() != undefined) {
			$('#search').setEnabled(false);
		}
		if ($('#btn_save').val() != undefined) {
			$('#btn_save').setEnabled(false);
		}*/
		var erpHdofcCombo = [{value:demandMsgArray['none'], text:demandMsgArray['none']}];/*"없음"*/
		$('#' + objId).setData({
			data : erpHdofcCombo
		});
		//selectComboCode(objId, allYn, 'C00623', '');
	} else {
		if (data.resultCode == 'OK') {
			if (nullToEmpty(data.erpHdofcCd) != '1000' && nullToEmpty(data.erpHdofcCd) != '') {
				selectComboCode(objId, allYn, 'C00623', data.erpHdofcCd); 
				$('#' + objId).setEnabled(false);				
				return;
			} else if (nullToEmpty(data.erpHdofcCd) == '1000') {
				selectComboCode(objId, allYn, 'C00623', '');
				return;
			} 
		}
		// 못구할 경우
/*		if ($('#search').val() != undefined) {
			$('#search').setEnabled(false);
		}
		if ($('#btn_save').val() != undefined) {
			$('#btn_save').setEnabled(false);
		}*/
		
		var erpHdofcCombo = [{value:' ', text:demandMsgArray['none']}];/*"없음"*/
		$('#' + objId).setData({
			data : erpHdofcCombo
		});
		//selectComboCode(objId, allYn, 'C00623', '');
	}
}

function successCommonCallback(response, flag){
	//var arr = flag.split(",");
	var objId = flag.objId;     //arr[0];
	var allYn = flag.allYn;     //arr[1];
	var jobTp = flag.jobTp;
	
	if (jobTp == 'setErpHdofc') {
		setErpHdofc(response, flag);
	}

	var selectedValue = flag.selectedValue;     //arr[2];
	$('#' + objId).setData({
		data : response,
		//option_selected : ( selectedValue == null ? null : selectedValue ) // 최초 선택값 설정
	});
	if(allYn == 'Y'){
		if (demandMsgArray['all'] == undefined) {
			$('#' + objId).prepend('<option value="">전체</option>'); 
		} else {
			$('#' + objId).prepend('<option value="">' + demandMsgArray['all'] + '</option>') ;  // 전체
		}
	}else if(allYn == 'S'){
		if (demandMsgArray['select'] == undefined) {
			$('#' + objId).prepend('<option value="">선택</option>') ;
		} else {
			$('#' + objId).prepend('<option value="">' + demandMsgArray['select'] + '</option>');  // 선택
		}
	}else if(allYn == 'NS'){
		if (demandMsgArray['mandatory'] == undefined) {
			$('#' + objId).prepend('<option value="">필수</option>');
		} else {
			$('#' + objId).prepend('<option value="">' + demandMsgArray['mandatory'] + '</option>');  // 필수
		}
	}else if(allYn == 'NONE'){
		if (demandMsgArray['none'] == undefined) {
			$('#' + objId).prepend('<option value="">없음</option>');
		} else {
			$('#' + objId).prepend('<option value="">' + demandMsgArray['none'] + '</option>')  ;// 없음
		}
	}else if(allYn == 'ST'){
		$('#' + objId).prepend('<option value="">선택</option>') ;
	}else if(allYn == 'N'){
	}else if(allYn == 'BD'){
		if (demandMsgArray['all'] == undefined) {
			$('#' + objId).prepend('<option value="">전체</option>'); 
		} else {
			$('#' + objId).prepend('<option value="">' + demandMsgArray['all'] + '</option>') ;  // 전체
		}
		$('#erpHdofcCd').find("option[value='5300']").remove(); 
		$('#erpHdofcCd').append('<option value="5300">부산</option>');
		$('#erpHdofcCd').append('<option value="5400">대구</option>');
	}
	
	if (selectedValue != '' && selectedValue != null) {
		//console.log(selectedValue);
		if ((jobTp == "selectAfeYearCode" || jobTp == "selectAfeTsCode") && selectedValue == "Y") {
			$('#' + objId).setSelected("");
		} else {
			$('#' + objId).setSelected(selectedValue);
		}
	} else {		
		if (jobTp == "selectAfeYearCode" || jobTp == "selectAfeTsCode") {
			var stdAfeDiv = "";
			for (var i = 0; i < response.length; i++) {
				if (response[i].stdAfeDivYn == 'Y') {
					stdAfeDiv = response[i].cd;
				}
			}

			if (stdAfeDiv != "") {
				$('#' + objId).setSelected(stdAfeDiv);
			} else {
				$('#' + objId).setSelected("");
			}
		} else {
			$('#' + objId).setSelected("");
		}
	}
}

function failCommonCallback( response, flag){
	//alert(response.message);
	if (flag.jobTp == undefined) {
		//alert(response.message);
	}
	if (flag.jobTp =='selectComboCode') {
		//alert('공통코드 조회에 실패했습니다.'); 
		// demandMsgArray['failSearchComCode']   // 공통코드 조회에 실패했습니다.
	}
	if (flag.jobTp =='selectAfeYearCode') {
		//alert('AFE년도 조회에 실패했습니다.'); 
		// demandMsgArray['failSearchAfeYr'] // AFE년도 조회에 실패했습니다.
	}
	if (flag.jobTp =='selectAfeTsCode') {
		//alert('AFE차수 조회에 실패했습니다.'); 
		// demandMsgArray['failSearchAfeDemdDgr'] // AFE차수 조회에 실패했습니다.
	}
	if (flag.jobTp =='selectYearBizCombo') {
		//alert('사업구분 대/소 조회에 실패했습니다.'); 
		// demandMsgArray['failSearchDemandBiz'] // 사업구분 대/소 조회에 실패했습니다.
	}
	if (flag.jobTp == 'setErpHdofc') {
		response.resultCode = 'NG';
		setErpHdofc(response, flag);
	}
}

String.prototype.replaceAll = function(org, dest) {
	return this.split(org).join(dest);
}


/*
 * Function Name : gridExcelColumn
 * Description   : 그리드 헤더중 그룹핑된 헤더 정보 취득
 * ----------------------------------------------------------------------------------------------------
 * param    	: 합쳐질 파라메터
 * gridId     	: 그리드ID
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function gridExcelColumn(param, gridId) {
	var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
	//console.log(gridColmnInfo);
	
	var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
	
	//console.log(gridHeader);
	var excelHeaderCd = "";
	var excelHeaderNm = "";
	var excelHeaderAlign = "";
	var excelHeaderWidth = "";
	for(var i=0; i<gridHeader.length; i++) {
		if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
			excelHeaderCd += gridHeader[i].key;
			excelHeaderCd += ";";
			excelHeaderNm += gridHeader[i].title;
			excelHeaderNm += ";";
			excelHeaderAlign += gridHeader[i].align;
			excelHeaderAlign += ";";
			excelHeaderWidth += gridHeader[i].width;
			excelHeaderWidth += ";";
		}
	}
	
	param.excelHeaderCd = excelHeaderCd;
	param.excelHeaderNm = excelHeaderNm;
	param.excelHeaderAlign = excelHeaderAlign;
	param.excelHeaderWidth = excelHeaderWidth;
	//param.excelHeaderInfo = gridColmnInfo;
	
	return param;
}

/*
 * Function Name : bodyProgress
 * Description   : body영역 프로그레스
 */

function bodyProgress() {
	$('body').progress(); 
}

/*
 * Function Name : bodyProgressRemove
 * Description   : body영역 프로그레스
 */

function bodyProgressRemove() {
	$('body').progress().remove(); 
}
