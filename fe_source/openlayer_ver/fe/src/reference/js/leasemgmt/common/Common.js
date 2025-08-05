/**
 * common.js
 *
 * @author P095782
 * @date 2016. 7. 12. 오전 13:10:03
 * @version 1.0
 */
$(document).ready(function() {
	//console.log("common.js loaded .. [$(document).ready()]");
});



(function ($) {

	$.TcpUtils = {
        // 입력된 객체를 '문자열'로 반환
        toString : function(object) {
            return JSON.stringify(object);
        },

        // 입력된 객체가 null 또는 빈값이면 true를 반환
        isEmpty : function(sStr) {
            if (undefined == sStr || null == sStr) return true;
            if ($.isArray(sStr)) {
                if (sStr.length < 1) return true;
            }
            if ('string' === typeof sStr ) {
                if ('' == sStr) return true;
            }
            return false;
        },

        // 입력된 객체가 null 또는 빈값이면 false를 반환
        isNotEmpty : function(sStr) {
            return !$.TcpUtils.isEmpty(sStr);
        },

        // 입력 문자열에서 한글이 있는지 판단하여 있으면 true
        hasHanChar : function(sStr) {
            if ( $.TcpUtils.isEmpty(sStr) ) {
                return false;
            }
            var hanCheckPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
            return hanCheckPattern.test(sStr);
        },

        // 입력 문자열에서 html 태그만 제거하여 반환
        removeHtmlTagOnly : function(sStr) {
            if ( $.TcpUtils.isEmpty(sStr) ) {
                return sStr;
            }
            return sStr.replace(/(<([^>]+)>)/ig, "");
        },

        // 입력 문자열에서 해당 html 태그와 그 내용 모두를 제거하여 반환
        removeHtmlTagWithContent : function(sStr, sTag) {
            if ( $.TcpUtils.isEmpty(sStr) ) {
                return sStr;
            }

            var sReplaced = "";

            if ( $.TcpUtils.isEmpty(sTag) ) {
                sReplaced = sStr.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, "");
            }
            else {
                //var re = new RegExp('<'+sTag+'[^><]*>(.*?)<.'+sTag+'[^><]*>', 'ig');
                var re = new RegExp('<'+sTag+'(.*?)*>(.*?)<.'+sTag+'[^><]*>', 'ig');
                sReplaced = sStr.replace(re, "");
            }
            return sReplaced.trim();
        }
	}

	var rotateVal = 0;

	$.fn.imgRotate = function(val){
		var $self = $(this), m, data = imgInitData($self);

		if(typeof val == 'undefined'){
			return data.rotate + data.rotateUnits;
		}

		if(rotateVal >= 360) rotateVal = 0;
    	rotateVal = rotateVal + 90;

		val = rotateVal+val;
		m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);

		if(m){
			if(m[3]){
				data.rotateUnits = m[3];
			}
			data.rotate = m[1];
			setTransform($self, data);
		}

		return this;
	}

	function imgInitData($el){
		var _ARS_data = $el.data('_ARS_data');
		if(!_ARS_data){
			_ARS_data = {
				rotateUnits: 'deg',
				rotate: 0
			};

			$el.data('_ARS_data', _ARS_data);
		}
		return _ARS_data;
	}

	function setTransform($el, data){
		$el.css('transform', 'rotate('+data.rotate+data.rotateUnits+')');
	}

})(jQuery);


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
	var requestParam = { comGrpCd : comGrpCd };
	//httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/', requestParam, successCommonCallback, failCommonCallback, 'GET', str );
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',requestParam, 'GET', str );
	Tango.ajax({
		//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, str);})
	  .fail(function(response){failCommonCallback(response, str);})
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
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafeyrlist/', null,'GET', str );
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getafeyrlist/',
		data : {},
		method : 'GET'
	}).done(function(response){successCommonCallback(response, str);})
	  .fail(function(response){failCommonCallback(response, str);})
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
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/', selectedObjId, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/getafedemddgrlist/',
		data : selectedObjId,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, str);})
	  .fail(function(response){failCommonCallback(response, str);})
	
}

/*
 * Function Name : selectYearBizCombo
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
function selectYearBizCombo(objId, allYn, afeYr, supCd, selectedValue, demdDivCd) {
	var str = objId + "," + allYn + "," + selectedValue;
	var requestParam = { 
				afeYr : afeYr
			  , demdDivCd : demdDivCd
			  , supCd : supCd };
	
	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectyearbizlist/', requestParam, 'GET', str);
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectyearbizlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successCommonCallback(response, str);})
	  .fail(function(response){failCommonCallback(response, str);})
	
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

    if (str == null || str == "null" || typeof str === "undefined") {
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

function successCommonCallback(response, flag){
	var arr = flag.split(",");
	var objId = arr[0];
	var allYn = arr[1];
	var selectedValue = arr[2];
			
	$('#' + objId).setData({
		data : response,
		//option_selected : ( selectedValue == null ? null : selectedValue ) // 최초 선택값 설정
	});
	
	if(allYn == 'Y'){
		$('#' + objId).prepend('<option value="">전체</option>')
		//selectedValue = "";
	}else if(allYn == 'S'){
		$('#' + objId).prepend('<option value="">선택</option>')
		//selectedValue = "";
	}else if(allYn == 'NS'){
		$('#' + objId).prepend('<option value="">필수</option>')
		//selectedValue = "";
	}else if(allYn == 'N'){
	}
	
	if (selectedValue != '' && selectedValue != null) {
		//console.log(selectedValue);
		$('#' + objId).setSelected(selectedValue);
	} else {
		$('#' + objId).setSelected("");
	}
}

function failCommonCallback(serviceId, response, flag){
	//alert('실패');
}

String.prototype.replaceAll = function(org, dest) {
	if(org != null){
		return this.split(org).join(dest);
	}
}

//년월 구하기..
function getDatesetlReqYm(dt){
	
	yyyy = dt.getFullYear();
	mm = dt.getMonth() + 1;
	//dd = dt.getDate();
	
	return yyyy + '-' + getFormatString(mm);
}
//년월일 구하기..
function getDateFormatData(dt){
	
	yyyy = dt.getFullYear();
	mm = dt.getMonth() + 1;
	dd = dt.getDate();
	
	return yyyy + '-' + getFormatString(mm) + '-' + getFormatString(dd);
}
function getFormatString(num){
	if(num < 10){
		return "0"+num;
	}else{
		return num;
	}
}

//날짜 형식 맞추기..
function makeDateFormmet(dateValue){        
	var dtYear = "";
    var dtMon = "";
    var dtDay = "";
	
    if(dateValue != null){
		if(dateValue.length == 8){
			dtYear = dateValue.substring(0,4);
			dtMon = dateValue.substring(4,6);
			dtDay = dateValue.substring(6,8);
			return dtYear+"-"+dtMon+"-"+dtDay;
		}else if(dateValue.length == 6){
	        dtYear = dateValue.substring(0,4);
	        dtMon = dateValue.substring(4,6);
	        return dtYear+"-"+dtMon;
		}else{
				return "";
		}
    }else{
		return "";
    }
}

/*
 * Function Name : gridExcelColumn
 * Description   : 그리드 편집시 숫자컬럼 우측정렬하는 css class return
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
            if(gridHeader[i].title == undefined){
                excelHeaderNm += " ";
            }else{
                excelHeaderNm += gridHeader[i].title.replace('<em class="color_red">*</em>','');
            }
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


//공사명 조회
var setConstruction = function(strCdId, strNmId, strArg, strGridId, gridFlag){
	var collbackID = "constructios";
	if(gridFlag != undefined){
		collbackID = collbackID + gridFlag;
	}
	tcpCommonInit(strCdId, strNmId, strArg, strGridId);
    tcpCommonSearch({cstrCd : parentCdVal, cstrNm : parentNmVal},
			       'tango-transmission-biz/transmisson/constructprocess/common/constructions',
			       collbackID);

	$(".popupClass").on('change',function() {
		if($(this).prop("id") == parentCdId){
			$("#"+parentNmId).val("");
		}else if($(this).prop("id") == parentNmId){
			$("#"+parentCdId).val("");
		}
	});
}



//시공업체 조회
var setBp = function(strCdId, strNmId){

	tcpCommonInit(strCdId, strNmId);
	tcpCommonSearch('',  //{bpId : parentCdVal, bpNm : parentNmVal}
			        'tango-transmission-biz/transmisson/constructprocess/common/bps',
			        'bps');
}

//사용자 조회
var setUser = function(strCdId, strNmId, strArg, strGridId){

	tcpCommonInit(strCdId, strNmId, strArg, strGridId);
	tcpCommonSearch('', //{userId : parentCdVal, userNm : parentNmVal}
			        'tango-transmission-biz/transmisson/constructprocess/common/users',
			        'users');
}

//인허가 현황 조회
var setLcenMgmtNo = function(strCdId){

	tcpCommonInit(strCdId);
	tcpCommonSearch('',
			        'tango-transmission-biz/leasemgmt/licensingCurstSum/licensingCurstSumList',
			        'lcenMgmtNo');
}

/*
 * ------------------------------------------------
 *  공통팝업 리스트
 * ------------------------------------------------
 * strCdId    : 코드ID (부모)
 * strNmId    : 코드명 (부모)
 * strGridId  : Grid ID (부모)
 * ------------------------------------------------
 */
var parentCdVal;
var parentNmVal;
var parentCdId;
var parentNmId;
var parentGridId;
var parentGridKey;
var parentArg;
var parentParam;

//공통팝업 변수선언
function tcpCommonInit(strCdId, strNmId, strArg, strGridId){

	parentCdId = "";
	parentCdVal = "";
	parentNmId = "";
	parentNmVal = "";
	parentGridId = "";
	parentGridKey = "";

	// Grid / input box 분기
	if($.TcpUtils.isNotEmpty(strGridId)){
		var parentGridData = $('#'+strGridId).alopexGrid('dataGet', {_state : {focused:true}});

		//alert($.TcpUtils.toString(parentGridData));

		parentCdId = strCdId;
		parentNmId = strNmId;
		parentGridId = strGridId;
		parentGridKey = parentGridData[0]._index.id;

		if ($.TcpUtils.isNotEmpty(parentGridData[0][strCdId])) {
			parentCdVal = parentGridData[0][strCdId];
		}
		if ($.TcpUtils.isNotEmpty(parentGridData[0][strNmId])) {
			parentNmVal = parentGridData[0][strNmId];
		}

		if($.TcpUtils.isNotEmpty(strArg)){
			parentArg = strArg;
		}

	}else{
		if($('#'+strCdId).length ){
			parentCdId = strCdId;
			$('#'+strCdId).addClass('popupClass');
			if ($.TcpUtils.isNotEmpty($('#'+strCdId).val()) ) {
				parentCdVal = $('#'+strCdId).val();
		    }
		}
		if($('#'+strNmId).length ){
			parentNmId = strNmId;
			$('#'+strNmId).addClass('popupClass');
			if ($.TcpUtils.isNotEmpty($('#'+strNmId).val()) ) {
				parentNmVal = $('#'+strNmId).val();
		    }
		}

		if($.TcpUtils.isNotEmpty(strArg)){
			parentArg = strArg;
			parentParam = new Object();
			for(var k=0; k < strArg.length; k++){
				if($('#'+strArg[k]).length ){
					parentParam[strArg[k]] = $('#'+strArg[k]).val();
				}
			}
		}
	}
}



//공통팝업 request
function tcpCommonSearch(strParam, strUrl, strFlag){

	if($.TcpUtils.isNotEmpty(parentParam)){
		//$.merge($.merge([],strParam), parentArg);
		strParam = $.extend({},strParam, parentParam);
		//alert('strParam : '+$.TcpUtils.toString(strParam));
	}

	Tango.ajax({
		url : strUrl,
		data : strParam,
		method : 'GET'
	}).done(function(response){successCallbackTcpCommon(response, strFlag, strParam);})
	  .fail(function(response){failCallbackTcpCommon(response, strFlag);});
}

//request 성공시
function successCallbackTcpCommon(response, flag, strParam){

		if(flag == 'constructios'){

			if(response.pager.totalCnt == 1){
				//alert(JSON.stringify(response.constructionList));
				if ($.TcpUtils.isNotEmpty(parentGridId) ) {
					var editData = new Object();
					editData[parentCdId] = response.constructionList[0].cstrCd;
					editData[parentNmId] = response.constructionList[0].cstrNm;
					$('#'+parentGridId).alopexGrid("dataEdit", $.extend({},editData), {_index:{id : parentGridKey}});
					
				}else{
					$('#'+parentCdId).val(response.constructionList[0].cstrCd);
					$('#'+parentNmId).val(response.constructionList[0].cstrNm);

					// 부모창에 Arument가 존재하는 경우 값 세팅
					if($.TcpUtils.isNotEmpty(parentArg)){
						for(var k=0; k < parentArg.length; k++){
							if($('#'+parentArg[k]).length ){
								$.each(response.constructionList[0], function(key, value) {
									if(key == parentArg[k]){
										$('#'+parentArg[k]).val(value);
									}
								});
							}
						}
					}
				}
			}else{
				$a.popup({
			     	popid: 'ConstructionCommon',
			     	title: '공사명 조회',
			        url: '/tango-transmission-web/constructprocess/common/ConstructionCommon.do',
			        iframe: false,
			        windowpopup: true,
			        //modal : true,
			        width: 900,
			        height: 760,
			        data: strParam,
			        callback: function(data) {
						if(data != null){
							if ($.TcpUtils.isNotEmpty(parentGridId) ) {
								var editData = new Object();
								editData[parentCdId] = data.cstrCd;
								editData[parentNmId] = data.cstrNm;

								$('#'+parentGridId).alopexGrid("dataEdit", $.extend({},editData), {_index:{id : parentGridKey}});
							}else{
								$('#'+parentCdId).val(data.cstrCd);
								$('#'+parentNmId).val(data.cstrNm);

								// 부모창에 Arument가 존재하는 경우 값 세팅
								if($.TcpUtils.isNotEmpty(parentArg)){
									for(var k=0; k < parentArg.length; k++){
										if($('#'+parentArg[k]).length ){
											$.each(data, function(key, value) {
												if(key == parentArg[k]){
													$('#'+parentArg[k]).val(value);
												}
											});
										}
									}
								}
							}
						}
			        }
				});
			}
		}else if(flag == 'constructiosALL'){
			//임차결과등록 팝업창에서 사용시..
			if(response.pager.totalCnt == 1){
				//alert(JSON.stringify(response.constructionList));
				
                var parentGridData = $('#'+parentGridId).alopexGrid('dataGet', {_state : {focused:true}});
                if(data != null){
                    var allGridData = $('#'+parentGridId).alopexGrid('dataGet');
                	for(var i = 0; i < allGridData.length; i++){
                		if(allGridData[i].sctnMgmtNo == parentGridData[0].sctnMgmtNo){
                			allGridData[i].cstrCd = response.constructionList[0].cstrCd;
                			allGridData[i].cstrNm = response.constructionList[0].cstrNm;
                            $('#'+parentGridId).alopexGrid("dataEdit", $.extend({},allGridData[i]), {_index:{id : allGridData[0]._index.id}});
                		}
                	}
                }
			}else{
				$a.popup({
			     	popid: 'ConstructionCommon',
			     	title: '공사명 조회',
			        url: '/tango-transmission-web/constructprocess/common/ConstructionCommon.do',
			        iframe: false,
			        windowpopup: true,
			        //modal : true,
			        width: 900,
			        height: 760,
			        data: strParam,
			        callback: function(data) {
						if(data != null){
			                var parentGridData = $('#'+parentGridId).alopexGrid('dataGet', {_state : {focused:true}});
			                
		                    var allGridData = $('#'+parentGridId).alopexGrid('dataGet');
		                	for(var i = 0; i < allGridData.length; i++){
		                		if(allGridData[i].sctnMgmtNo == parentGridData[0].sctnMgmtNo){
		                			allGridData[i].cstrCd = response.constructionList[0].cstrCd;
		                			allGridData[i].cstrNm = response.constructionList[0].cstrNm;
		                            $('#'+parentGridId).alopexGrid("dataEdit", $.extend({},allGridData[i]), {_index:{id : allGridData[i]._index.id}});
		                		}
		                	}
						}
			        }
				});
			}
		}else if(flag == 'bps'){

			if(response.pager.totalCnt == 1){
				$('#'+parentCdId).val(response.bpList[0].bpId);
				$('#'+parentNmId).val(response.bpList[0].bpNm);
			}else{
				$a.popup({
			     	popid: 'BpCommon',
			     	title: '시공업체 조회',
			        url: '/tango-transmission-web/constructprocess/common/BpCommon.do',
			        iframe: false,
			        //movable : true,
			        windowpopup: true,
			        width: 700,
			        height: 580,
			        //data: { "bpId": parentCdVal, "bpNm" : parentNmVal},
			        data : null,
			        callback: function(data) {
							if(data != null){
								$('#'+parentCdId).val(data.bpId);
								$('#'+parentNmId).val(data.bpNm);
							}
			        }
				});
			}
		}else if(flag == 'users'){

			if(response.pager.totalCnt == 1){

				if ($.TcpUtils.isNotEmpty(parentGridId) ) {
					var editData = new Object();
					editData[parentCdId] = response.userList[0].userId;
					editData[parentNmId] = response.userList[0].userNm;

					// 부모창에 Arument가 존재하는 경우 값 세팅
					if($.TcpUtils.isNotEmpty(parentArg)){
						for(var k=0; k < parentArg.length; k++){
							$.each(response.userList[0], function(key, value) {
								if(key == parentArg[k]){
									editData[parentArg[k]] = value;
								}
							});
						}
					}

					$('#'+parentGridId).alopexGrid("dataEdit", $.extend({},editData), {_index:{id : parentGridKey}});
				}else{
					$('#'+parentCdId).val(response.userList[0].userId);
					$('#'+parentNmId).val(response.userList[0].userNm);

					// 부모창에 Arument가 존재하는 경우 값 세팅
					if($.TcpUtils.isNotEmpty(parentArg)){
						for(var k=0; k < parentArg.length; k++){
							if($('#'+parentArg[k]).length ){
								$.each(response.userList[0], function(key, value) {
									if(key == parentArg[k]){
										$('#'+parentArg[k]).val(value);
									}
								});
							}
						}
					}
				}

			}else{

				$a.popup({
			     	popid: 'UserCommon',
			     	title: '사용자 조회',
			        url: '/tango-transmission-web/constructprocess/common/UserCommon.do',
			        iframe: false,
			        windowpopup: true,
			        //movable: true,
			        width: 900,
			        height: 760,
			        //data: { "userId": parentCdVal, "userNm" : parentNmVal},
			        data : {"popHead": "Y"},
			        callback: function(data) {
			        		if(data != null){
								if ($.TcpUtils.isNotEmpty(parentGridId) ) {
									var editData = new Object();
									editData[parentCdId] = data.userId;
									editData[parentNmId] = data.userNm;
									//var editData = {parentCdId : data.userId, parentNmId : data.userNm};

									// 부모창에 Arument가 존재하는 경우 값 세팅
									if($.TcpUtils.isNotEmpty(parentArg)){
										for(var k=0; k < parentArg.length; k++){
											$.each(data, function(key, value) {
												if(key == parentArg[k]){
													editData[parentArg[k]] = value;
												}
											});
										}
									}

									$('#'+parentGridId).alopexGrid("dataEdit", $.extend({},editData), {_index:{id : parentGridKey}});
								}else{
									$('#'+parentCdId).val(data.userId);
									$('#'+parentNmId).val(data.userNm);

									// 부모창에 Arument가 존재하는 경우 값 세팅
									if($.TcpUtils.isNotEmpty(parentArg)){
										for(var k=0; k < parentArg.length; k++){
											if($('#'+parentArg[k]).length ){
												$.each(data, function(key, value) {
													if(key == parentArg[k]){
														$('#'+parentArg[k]).val(value);
													}
												});
											}
										}
									}
								}
							}
			        }
				});
			}		
		}else if(flag == 'lcenMgmtNo'){
			if(response.pager.totalCnt == 1){
				$('#'+parentCdId).val(response.licensingCursSumList[0].lcenMgmtNo);
			}else{
				$a.popup({
			     	popid: 'LicensingCurstSumPopUp',
			     	title: '인허가 현황 조회',
			        url: '/tango-transmission-web/leasemgmt/licensing/common/LicensingCurstSumPopUp.do',
			        iframe: false,
			        //movable : true,
			        windowpopup: true,
			        width: 850,
			        height: 780,
			        data : null,
			        callback: function(data) {
							if(data != null){
								$('#'+parentCdId).val(data.lcenMgmtNo);
							}
			        }
				});
			}
		}
}

//request 실패시.
function failCallbackTcpCommon(response, flag){
	if(flag == 'constructios'){
		alert('공사 조회실패');
	}
	if(flag == 'bps'){
		alert('시공업체 조회실패');
	}
}


	//프로그래스 바 표시
function cntlProgress(gubun){
	if(gubun == "S"){
		$('body').progress();
	}else{
		$('body').progress().remove();
	}
}
//협력업체 조회 팝업 호출
function setBpPopUp(bpId, bpNm, skAfcoDivCd){
	
	var dataParam = {"skAfcoDivCd":skAfcoDivCd};
	
    $a.popup({
    	popid: 'BpCommonLes',
        title: '시공업체 조회',
        url: '/tango-transmission-web/leasemgmt/common/BpCommon.do', 
        data : dataParam,
        //modal: true,
        iframe: false,
        windowpopup: true,
        //movable:true,
        center: true,
        width : 700,
        height : 620,

        callback: function(data) {
			if(data != null){
				$('#'+bpId).val(data.bpId);
				$('#'+bpNm).val(data.bpNm);
			}
        }
    });     
    

}

//임차 담당자 선택 팝업
function openTaskChargerPopup(fnCallback, lesTaskChrrDivCd, skAfcoDivCd, lesCommBizrId, hdofcOrgId, teamOrgId) {
	var w = 960;
	var h = 750;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var dataParam = {"lesTaskChrrDivCd":lesTaskChrrDivCd,
			"skAfcoDivCd":skAfcoDivCd,
			"lesCommBizrId":lesCommBizrId,
			"hdofcOrgId":hdofcOrgId,
			"teamOrgId":teamOrgId};
	
	$a.popup({
		popid : 'TaskChargerInfoSearch',
		url : '/tango-transmission-web/leasemgmt/requestresult/taskcharger/TaskChargerInfoSearchPopup.do',
		data : dataParam,
		modal : true,
		movable:true,
		width : w,
		height : h,
		top : t,
		left : l,
		title : '임차담당자조회',
		callback : fnCallback
	});
}