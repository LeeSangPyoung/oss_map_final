/**
 *  @Description    : Tango-T script
 *  @Create User    : KSY
 *  @Create Date    : 2016.06 .24
 *
 *  >>> Utils 함수
 * ------------------------------------------------------------------------------------------------
 *  toString                  : 입력된 객체를 '문자열'로 반환
 *  isEmpty                   : 입력된 객체가 null 또는 빈값이면 true를 반환
 *  isNotEmpty                : 입력된 객체가 null 또는 빈값이면 false를 반환
 *  hasHanChar                : 입력 문자열에서 한글이 있는지 판단하여 있으면 true
 *  removeHtmlTagOnly         : 입력 문자열에서 html 태그만 제거하여 반환
 *  removeHtmlTagWithContent  : 입력 문자열에서 해당 html 태그와 그 내용 모두를 제거하여 반환
 *  setBizrFormat             : 입력 문자열을 사업자번호 Format으로 반환
 *  setDateFormatCustom       : 입력 문자열을 원하는 타입의 날짜 Format으로 반환
 *
 *
 *  >>> 날짜, 달력 함수
 * ------------------------------------------------------------------------------------------------
 *  getPeriod              : 두 날짜 사이의 기간을 반환
 *
 *
 *  >>> GRID 함수
 * ------------------------------------------------------------------------------------------------
 *  getGridStatus          : 그리드 데이터상태 확인 (추가,변경,삭제)
 *  getGridColData         : 그리드 지정된 컬럼 전체를 배열로 반환
 *
 *
 *  >>> 공통코드
 * ------------------------------------------------------------------------------------------------
 *  setComponentByCode     : Form에 있는 모든 Component에 Option Data를 공통코드를 조회하여 자동생성
 *  setSelectByCode        : selectBox에 Option Data를 공통코드를 조회하여 생성
 *  setSelectByOrg         : selectBox에 Option Data를 TCO_ORG_BAS(구축조직)을 조회하여 생성
 *  setSelectByOrgTeam     : selectBox에 Option Data를 CCO_ORG_BAS(조직)을 조회하여 생성
 *  setSelectByOrgTeamForCsms     : selectBox에 팀 정보 조회(CSMS용)
 *  setSelectByBiz         : selectBox에 Option Data를 DI_TN_BIZ_DIV_BAS(사업)을 조회하여 생성
 *                           (사업년도, 사업목적, 사업구분)
 *  getDataByCode          : 공통코드 Data를 조회
 *
 *
 *  >>> 공통팝업
 * ------------------------------------------------------------------------------------------------
 *  setConstruction            : 공사명 조회
 *  setBp                      : 시공업체 조회
 *  setUser                    : 사용자 조회
 *  setUserNm                  : 사용자명 조회
 *  setEqp                     : 선로자재 조회
 *  setItmEqp                  : ITM 자재 조회
 *  callWrwlsPopup             : 공종 검색 (노무비/지입재료) (사급자재)
 *	setIntegrationDesignGroup  : 통합설계그룹 조회
 *	setApplication             : 청약번호 조회
 *	setWkrt             	   : 작업정보 조회
 *
 *
 *  >>> 권한,세션
 *  ------------------------------------------------------------------------------------------------
 *  setBpByRole            : 로그인 사용자의 권한을 체크해서 시공업체ID, 시공업체명, 버튼을 제어
 *
 */

$(document).ready(function() {
	//console.log("common.js loaded .. [$(document).ready()]");

	if($('#skAfcoDivCd').length ){

		if($.TcpUtils.isNotEmpty($('#skAfcoDivCd').val())){
			if($('#skAfcoDivCd').val().length == 3){
				$('#skAfcoDivCd').val($('#skAfcoDivCd').val().substr(2, 1));
			}
		}
	}

	// 사용자정보조회
	/*
	 if($('#mainUserId').val() != ''){
		var url = 'tango-transmission-biz/transmisson/constructprocess/common/tcpUserInfo/' + $('#mainUserId').val();
		var userModel = Tango.ajax.init({url:url});
		userModel.get().done(function(response){
			if($('#skAfcoDivCd').length ){
				$('#skAfcoDivCd').val(response.skAfcoDivCd);
			}
		});
	}
	*/
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
            if ('string' == typeof sStr ) {
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
        },
        
        // 숫자 천단위 콤마
        addNumberCommas : function(str) {
        	if ($.isNumeric(str)) {
    			str += '';
    			var x = str.split('.');
    			var x1 = x[0];
    			var x2 = x.length > 1 ? '.' + x[1] : '';
    			var rgx = /(\d+)(\d{3})/;
    			while (rgx.test(x1)) {
    				x1 = x1.replace(rgx, '$1' + ',' + '$2');
    			}
    			return x1 + x2;
    			
        	} else {
        		return null;
        	}
		},
		
		// body 프로그래스 시작
		startBodyProgress : function() {
			$('body').progress();
		},
		
		// body 프로그래스 종료
		hideBodyProgress : function() {
			$('body').progress().remove();
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
 * sStr : 입력 사업자번호
 */
var setBizrFormat = function(sStr){
	if ( $.TcpUtils.isEmpty(sStr) ) {
        return sStr;
    }
	sStr = sStr.replace(/[^\d]+/g, '');

	if(sStr.length == 10){
		sStr = sStr.substr(0, 3) + '-' + sStr.substr(3, 2) + '-' + sStr.substr(5, 5);
	}

	return sStr;
}

/*
 * sStr : 입력 날짜
 * sDateDelimiter : 날짜구분자
 * sHourMinDelimiter : 시간,분구분자
 */
var setDateFormatCustom = function(sStr, sDateDelimiter, sHourMinDelimiter){
	if ( $.TcpUtils.isEmpty(sStr) ) {
        return sStr;
    }
	sStr = sStr.replace(/[^\d]+/g, '');


	// 날짜 8자리인 경우
	if(sStr.length == 8){
		if ( $.TcpUtils.isEmpty(sDateDelimiter) ) {
			sStr = sStr.substr(0, 4) + '-' + sStr.substr(4, 2) + '-' + sStr.substr(6, 2);
	    }else{
	    	sStr = sStr.substr(0, 4) + sDateDelimiter + sStr.substr(4, 2) + sDateDelimiter + sStr.substr(6, 2);
	    }
	}

	// 날짜+시+분 조합 12자리인경우
	if(sStr.length == 12){
		var sDateStr = sStr.substr(0, 8);
		var sHourMinStr = sStr.substr(8, 4);

		if ( $.TcpUtils.isEmpty(sDateDelimiter) ) {
			sDateStr = sDateStr.substr(0, 4) + '-' + sDateStr.substr(4, 2) + '-' + sDateStr.substr(6, 2);
	    }else{
	    	sDateStr = sDateStr.substr(0, 4) + sDateDelimiter + sDateStr.substr(4, 2) + sDateDelimiter + sDateStr.substr(6, 2);
	    }

		if ( $.TcpUtils.isEmpty(sHourMinDelimiter) ) {
			sHourMinStr = sHourMinStr.substr(0, 2) + ':' + sHourMinStr.substr(2, 2);
	    }else{
	    	sHourMinStr = sHourMinStr.substr(0, 2) + sHourMinDelimiter + sHourMinStr.substr(2, 2);
	    }
		sStr = sDateStr + ' '+ sHourMinStr;
	}

	return sStr;
}

/*
 * fromDt : 시작일자
 * toDt : 종료일자
 * checkDay를 지정하지 않은 경우 - 두 날짜 사이의 기간(Day)을 Return
 * checkDay를 지정한 경우        - 두 날짜 사이의 기간(Day)이 checkDay를 초과했는지 확인 Boolean를 Return
 */
var getPeriod = function(fromDt, toDt, checkDay){

	var fromArray;
	var toArray;
	var fromDay;
	var toDay;
	var termDt;

	if(isDate(fromDt) && isDate(toDt)){

		fromArray = fromDt.split('-');
		toArray = toDt.split('-');
		fromDay = new Date(fromArray[0],parseInt(fromArray[1])-1,fromArray[2]);
		toDay = new Date(toArray[0],parseInt(toArray[1])-1,toArray[2]);
		termDt = Math.ceil((toDay.getTime() - fromDay.getTime()) / (24*60*60*1000));

		if(checkDay == undefined || checkDay == null || checkDay == false){
			return termDt;
		}else{
			if(termDt > Number(checkDay)){
				return false;
			}else{
				return true;
			}
		}
	}
}

/*
 * strGridId      : GRID ID
 * strStatusType  : 상태타입(C:추가, U:수정, D:삭제)
 */
var getGridStatus = function(strGridId, strStatusType){

	if($.TcpUtils.isEmpty(strStatusType))
		return;

	var gridId = strGridId.replace(/#/, "");
	var gridList;

	if(strStatusType == 'C'){
		gridList = $("#" + gridId).alopexGrid("dataGet", {_state:{added:true}});
	}else if(strStatusType == 'U'){
		gridList = $("#" + gridId).alopexGrid("dataGet", {_state:{edited:true}});
	}else if(strStatusType == 'D'){
		gridList = $("#" + gridId).alopexGrid("dataGet", {_state:{deleted:true}});
	}

	/*
	 * cnt = 0  : 추가,수정,삭제된 데이터가 없음
	 * cnt > 1  : 추가,수정,삭제된 데이터가 존재
	 * cnt = -1 : 그리드가 없음
	 */
	var cnt = (null==gridList ? -1 : gridList.length);
	return cnt;
}

/*
 * strGridId      : GRID ID
 * strColumnId    : GRID Column ID
 */
var getGridColData = function(strGridId, strColumnId){
	var gridId = strGridId.replace(/#/, "");
    var list = $("#" + gridId).alopexGrid("dataGet");

    var cnt = (null==list ? -1 : list.length);
    if (cnt < 1) {
        return []; //빈 배열을 반환
    }
    var arrColumnData = [];
    for(var i=0; i < cnt; i++) {
        var gridRow = list[i];
        arrColumnData.push( gridRow[""+strColumnId] );
    }
    return arrColumnData;
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * setComponentByCode('searchForm', setComponentByCodeCallBack);
 *
 * [HTML]
 * <select name="" id="" data-codegrpcd="C00012" data-codehead="select"> </select>
 * ---------------------------------------------------------------------------------
 * strFormId : Form Id
 * callback : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var setComponentByCode = function(strFormId, callback) {
	if ( $.TcpUtils.isEmpty(strFormId) )
		return;

	strFormId = strFormId.replace(/^#/, "");

	var codeGrpCdArray = new Array();
	var codeEndCnt = 0;

	$("#"+strFormId + " select,span").each(function() {
        var codeGrpCd  = $(this).data("codegrpcd"); // 코드그룹
        //var codeType  = $(this).data("codeType"); // 코드타입 (추후 업체,조직등 타 테이블을 사용하거나 케이스가 다른 공통코드조회 시에 사용)

        //if ($.TcpUtils.isNotEmpty(codeGrpCd) && "code" == codetype ) {
         if($.TcpUtils.isNotEmpty(codeGrpCd) ) {
            var elemId = $(this).prop("id");
            var elemTag = $('#'+elemId).get(0).tagName;

            // SELECT BOX 타입만 적용(추후 Radio에도 적용)
            if("SELECT" == elemTag){
            	$(this).attr('data-type', 'select');
            }

            $(this).addClass('comCdClass');
            $(this).attr('data-bind', 'options:data, value:'+elemId);
            $(this).attr('data-bind-option', 'comCd:comCdNm');
            codeEndCnt++;

            codeGrpCdArray.push(codeGrpCd);
        }
    });

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/comCdList/'+codeGrpCdArray,
		data : null,
		method : 'GET'
	}).done(function(response){

		var rsCodeList = response.comCdList;
		var codeDataOption = new Array();
		var codeGrpCd = "";
		var codehead = "";

		$('.comCdClass').each(function(index){
			//console.log("index : "+index+" codeEndCnt"+codeEndCnt);
			codeDataOption = new Array();
			codeGrpCd = $(this).data("codegrpcd");
			codehead = $.TcpUtils.isNotEmpty( $(this).data("codehead")  ) ? $(this).data("codehead")  : "all";

			// SelectBox 상단 문구 세팅
			if(codehead == 'select'){
				codeDataOption.push({comGrpCd:codeGrpCd, comCd:"",comCdNm:"선택"});
			}else if(codehead == 'all'){
				codeDataOption.push({comGrpCd:codeGrpCd, comCd:"",comCdNm:"전체"});
			}

		    $.each(rsCodeList, function(index, value) {
		    	if(codeGrpCd == value.comGrpCd){
		    		codeDataOption.push(value);
		    	}
		    });

		    $(this).setData({
	            data:codeDataOption
			});

		    // 콤보 전체 생성 후에 callback Func 호출
		    if(parseInt(index)+1 == codeEndCnt){
		    	// Callback Func가 존재하는 경우 호출
			    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
			    	//console.log("콤보다그림");
			    	callback.call();
		        }
		    }
		});

	   })
	  .fail(function(response){
	       //alert('Form 공통코드 조회 실패');
	   });
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * var comParamArg = new Array();
	   comParamArg.push("comCd:A^B");
	   comParamArg.push("comCdNm:재실사");
 * setSelectByCode('processStatus', 'select', 'C00016', comParamArg, setSelectByCodeCallBack);
 *
 * [HTML]
 * <select name="processStatus" id="processStatus"></select>
 * ---------------------------------------------------------------------------------
 * strSelectId     : SelectBox ID
 * strSelectHead   : SelectBox Head
 * strComGrpCd     : 공통 그룹코드
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var setSelectByCode = function(strSelectId, strSelectHead, strComGrpCd, callback, strArgument) {
	if ( $.TcpUtils.isEmpty(strSelectId) || $.TcpUtils.isEmpty(strComGrpCd))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'comCd:comCdNm');

	var comParam = new Object();
		comParam['comGrpCd'] = strComGrpCd;

	// SK계열사구분코드 설정
	if($('#skAfcoDivCd').length ){
		comParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
	}

	// 추가 조건절이 있는 경우 세팅
	if($.TcpUtils.isNotEmpty(strArgument)){
		//{"comGrpCd":"C00016","comCd":"A^B","useYn":"Y"};

		for(var k=0; k < strArgument.length; k++){
			comParam[strArgument[k].split(':')[0]] = strArgument[k].split(':')[1];
		}
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/comCds',
		data : comParam,
		method : 'GET',
	    flag : 'comCds'
	}).done(function(response){

		var rsCodeList = response.comCdList;
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({comGrpCd:strComGrpCd, comCd:"",comCdNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({comGrpCd:strComGrpCd, comCd:"",comCdNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push(value);
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
		});

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('공통코드 조회 실패');
	   });
}
/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * var comParamArg = new Array();
	   comParamArg.push("comCd:A^B");
	   comParamArg.push("comCdNm:재실사");
 * setSelectByCodeEtcVal('processStatus', 'select', 'C00016', comParamArg, setSelectByCodeEtcValCallBack);
 *
 * [HTML]
 * <select name="processStatus" id="processStatus"></select>
 * ---------------------------------------------------------------------------------
 * strSelectId     : SelectBox ID
 * strSelectHead   : SelectBox Head
 * strComGrpCd     : 공통 그룹코드 ETC VAL 로 값 조회
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var setSelectByCodeEtcVal = function(strSelectId, strSelectHead, strComGrpCd, callback, strArgument) {
	if ( $.TcpUtils.isEmpty(strSelectId) || $.TcpUtils.isEmpty(strComGrpCd))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'comCd:comCdNm');

	var comParam = new Object();
		comParam['comGrpCd'] = strComGrpCd;

	// SK계열사구분코드 설정
	if($('#skAfcoDivCd').length ){
		comParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
	}

	// 추가 조건절이 있는 경우 세팅
	if($.TcpUtils.isNotEmpty(strArgument)){
		//{"comGrpCd":"C00016","comCd":"A^B","useYn":"Y"};

		for(var k=0; k < strArgument.length; k++){
			comParam[strArgument[k].split(':')[0]] = strArgument[k].split(':')[1];
		}
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/comCdsEtcVal',
		data : comParam,
		method : 'GET',
	    flag : 'comCds'
	}).done(function(response){

		var rsCodeList = response.comCdList;
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({comGrpCd:strComGrpCd, comCd:"",comCdNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({comGrpCd:strComGrpCd, comCd:"",comCdNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push(value);
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
		});

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('공통코드 조회 실패');
	   });
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * setSelectByOrg('orgId', 'select', setSelectByOrgCallBack);
 *
 * [HTML]
 * <select name="orgId" id="orgId"> </select>
 * ---------------------------------------------------------------------------------
 * strSelectId     : SelectBox ID
 * strSelectHead   : SelectBox Head
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var slaYn;
var setSelectByOrgSla = function(strSelectId, strSelectHead, slaOrgDiv, callback) {  // SLA용 본부세팅 - 17.04.25 ksy
	if ( $.TcpUtils.isEmpty(strSelectId))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, selectedOptions:userOrgId, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'orgId:orgNm');

	Tango.ajax({
		url : 'tango-transmission-biz/transmission/constructprocess/appraisalmgmt/common/slaOrgList',
		data : {"slaOrgDivVal": slaOrgDiv},
		method : 'GET',
	    flag : 'orgs'
	}).done(function(response){

		var rsCodeList = response.orgList;
		var rsOrgSelectId = response.orgSelectId; // Session에 있는 사용자 조직ID를 세팅
		var rsIsChgAbleHofc = response.isChgAbleHofc;
		var rsIsChgAbleTeam = response.isChgAbleTeam;
		var rsOrgGrpCd = response.orgGrpCd;  // manager :SKT, SKB else PTN
		var rsBpId = response.bpId;  // orgGrpCd이 PTN인 경우 bpId값 존재
		var rsIsBpRole = response.isBpRole;

		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({orgId:"",orgNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push({orgId:value.slaOrgId,orgNm:value.slaOrgNm});
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
            //,userOrgId : rsOrgSelectId
		});
	    
	    // Session에 있는 사용자 RoleCd에 따라 SelectBox 활성화 세팅
	    if(slaOrgDiv == "H" && rsIsChgAbleHofc == "N"){
	    	$("#"+strSelectId).setEnabled(false);
	    }else if(slaOrgDiv == "T" && rsIsChgAbleTeam == "N"){
	    	$("#"+strSelectId).setEnabled(false);
	    }else{
	    	$("#"+strSelectId).setEnabled(true);
	    }

	    // selectedOptions 으로 구현시 조직 onchange 이벤트가 적용되지 않아 변경
	    if ( $.TcpUtils.isNotEmpty(rsOrgSelectId)){
	    	$("#"+strSelectId).setSelected(rsOrgSelectId);
	    }

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('조직코드 조회 실패');
	   });
}

var setSelectByOrgSlaTeam = function(strSelectId, strSelectHead, slaOrgDiv, strSlaUprOrgId, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, selectedOptions:userOrgId, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'orgId:orgNm');

	Tango.ajax({
		url : 'tango-transmission-biz/transmission/constructprocess/appraisalmgmt/common/slaOrgList',
		data : {"slaOrgDivVal": slaOrgDiv,
				"SlaUprOrgId": strSlaUprOrgId
			},
		method : 'GET',
	    flag : 'orgs'
	}).done(function(response){

		var rsCodeList = response.orgList;
		var rsOrgSelectId = response.orgSelectId; // Session에 있는 사용자 조직ID를 세팅
		var rsIsChgAbleHofc = response.isChgAbleHofc;
		var rsIsChgAbleTeam = response.isChgAbleTeam;
		var rsOrgGrpCd = response.orgGrpCd;  // manager :SKT, SKB else PTN
		var rsBpId = response.bpId;  // orgGrpCd이 PTN인 경우 bpId값 존재
		var rsIsBpRole = response.isBpRole;

		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({orgId:"",orgNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push({orgId:value.slaOrgId,orgNm:value.slaOrgNm});
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
            //,userOrgId : rsOrgSelectId
		});
	    
	    // Session에 있는 사용자 RoleCd에 따라 SelectBox 활성화 세팅
	    if(slaOrgDiv == "H" && rsIsChgAbleHofc == "N"){
	    	$("#"+strSelectId).setEnabled(false);
	    }else if(slaOrgDiv == "T" && rsIsChgAbleTeam == "N"){
	    	$("#"+strSelectId).setEnabled(false);
	    }else{
	    	$("#"+strSelectId).setEnabled(true);
	    }
//console.log("team rsOrgSelectId : ", rsOrgSelectId);
	    // selectedOptions 으로 구현시 조직 onchange 이벤트가 적용되지 않아 변경
	    if ( $.TcpUtils.isNotEmpty(rsOrgSelectId)){
	    	$("#"+strSelectId).setSelected(rsOrgSelectId);
	    }

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('조직코드 조회 실패');
	   });
}

var setSelectByOrgSlaMultiTeam = function(strSelectId, strSelectHead, slaOrgDiv, strSlaUprOrgId, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	Tango.ajax({
		url : 'tango-transmission-biz/transmission/constructprocess/appraisalmgmt/common/slaOrgList',
		data : {"slaOrgDivVal": slaOrgDiv,
				"SlaUprOrgId": strSlaUprOrgId,
				"isChgFlag": "Y"
			},
		method : 'GET',
	    flag : 'orgs'
	}).done(function(response){

		var rsCodeList = response.orgList;
		var rsOrgSelectId = response.orgSelectId; // Session에 있는 사용자 조직ID를 세팅
		var rsIsChgAbleHofc = response.isChgAbleHofc;
		var rsIsChgAbleTeam = response.isChgAbleTeam;
		var rsOrgGrpCd = response.orgGrpCd;  // manager :SKT, SKB else PTN
		var rsBpId = response.bpId;  // orgGrpCd이 PTN인 경우 bpId값 존재
		var rsIsBpRole = response.isBpRole;

		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";
		var vLabel = "";
		var vSelOrgId = rsOrgSelectId;
		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			vLabel = "선택";
//			codeDataOption.push({orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			vLabel = "전체";
//			codeDataOption.push({orgId:"",orgNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push({orgId:value.slaOrgId,orgNm:value.slaOrgNm});
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption,
//            userOrgId : vSelOrgId
		});
	    
	    $("#"+strSelectId).multiselect({
        	header : false,
        	noneSelectedText : vLabel,
        	selectedList: 10
        });

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('조직코드 조회 실패');
	   });
}

var setSelectSctrtVndr = function(strSelectId, strSelectHead, callback, flag) {
	if ( $.TcpUtils.isEmpty(strSelectId))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, selectedOptions:sctrtVndrId, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'sctrtVndrId:sctrtVndrNm');

	Tango.ajax({
		url : 'tango-transmission-biz/transmission/constructprocess/appraisalmgmt/common/slaSctrtVndrList',
		data : {"isChgFlag": flag},
		method : 'GET',
	    flag : 'orgs'
	}).done(function(response){
		var rsCodeList = response.sctrtVndrList;;
		var rsOnSelectId = response.onSelectId;
		var rsIsChgAbleSctrtVndr = response.isChgAbleSctrtVndr;
		var rsBpId = response.bpId;  // orgGrpCd이 PTN인 경우 bpId값 존재
		var rsIsBpRole = response.isBpRole;
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({sctrtVndrId:"",sctrtVndrNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({sctrtVndrId:"",sctrtVndrNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
//	    	console.log("value: ", JSON.stringify(value));
	    	codeDataOption.push({sctrtVndrId:value.dummyCd,sctrtVndrNm:value.dummyVal});
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
            //,userOrgId : rsOrgSelectId
		});
	    
	    // Session에 있는 사용자 RoleCd에 따라 SelectBox 활성화 세팅
	    if(rsIsChgAbleSctrtVndr == "N"){
	    	$("#"+strSelectId).setEnabled(false);
	    }else{
	    	$("#"+strSelectId).setEnabled(true);
	    }

	    // selectedOptions 으로 구현시 조직 onchange 이벤트가 적용되지 않아 변경
	    if ( $.TcpUtils.isNotEmpty(rsOnSelectId)){
	    	$("#"+strSelectId).setSelected(rsOnSelectId);
	    }

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('조직코드 조회 실패');
	   });
}

var orgFlag;
var setSelectByOrgAdmin = function(strSelectId, strSelectHead, callback, flag){
	
	if ( $.TcpUtils.isNotEmpty(flag)){
		orgFlag = flag; 
	}
		
	if($('#skAfcoDivCd').val() == 'B' ||  $('#skAfcoDivCd').val() == 'SKB'){
		setSelectByOrgMulti(strSelectId, strSelectHead, callback);
	}else{
		setSelectByOrg(strSelectId, strSelectHead, callback);
	}
}

var retrieveTotalOrg = function(strSelectId, strSelectHead, callback, flag){
	
	if ( $.TcpUtils.isNotEmpty(flag)){
		orgFlag = flag; 
	}
		
	setSelectByOrg(strSelectId, strSelectHead, callback);
}

var setSelectByOrg = function(strSelectId, strSelectHead, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId))
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, selectedOptions:userOrgId, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'orgId:orgNm');

	var flag = "";
	
	var orgParam = new Object();
	orgParam["orgRole"] = orgFlag;
	
	// SK계열사구분코드 설정
	if($('#skAfcoDivCd').length ){
		orgParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
	}
	
	/* ------------------------------------------------------------------
	 * 본부코드 (A:SKT구축본부, G:SKB구축본부)
	 * 본부연계코드(팀,지역) (B:SKT구축지역, C:SKT운용그룹, D:SKT운용POST, E:SKT작업전송실팀, F:SKT구축팀, H:SKB구축팀, I:SKB관할품솔팀, L:SKB구축지역)
	 * ------------------------------------------------------------------
	 */
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/orgs',
		data : orgParam,
		method : 'GET',
	    flag : 'orgs'
	}).done(function(response){

		var rsCodeList = response.orgList;
		var rsOrgSelectId = response.orgSelectId; // Session에 있는 사용자 조직ID를 세팅
		var rsOrgDispYn = response.orgDispYn;
		var rsOrgGrpCd = response.orgGrpCd;  // manager :SKT, SKB else PTN
		var rsBpId = response.bpId;  // orgGrpCd이 PTN인 경우 bpId값 존재

		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({orgId:"",orgNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {

	    	codeDataOption.push(value);
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
            //,userOrgId : rsOrgSelectId
		});

	    // Session에 있는 사용자 RoleCd에 따라 SelectBox 활성화 세팅
	    if(rsOrgDispYn == "N"){
	    	$("#"+strSelectId).setEnabled(false);
	    }else{
	    	$("#"+strSelectId).setEnabled(true);
	    }

	    // selectedOptions 으로 구현시 조직 onchange 이벤트가 적용되지 않아 변경
	    if ( $.TcpUtils.isNotEmpty(rsOrgSelectId)){
	    	$("#"+strSelectId).setSelected(rsOrgSelectId);
	    }

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('조직코드 조회 실패');
	   });
}

// 기존 소속본부+추가본부 멀티 SelectBox 방식 - 19.02.12 Kim Seung Yu
var setSelectByOrgMulti = function(strSelectId, strSelectHead, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId))
		return;

	strSelectId = strSelectId.replace(/^#/, "");
	
	var orgParam = new Object();
	orgParam["orgRole"] = orgFlag;
	
	// SK계열사구분코드 설정
	if($('#skAfcoDivCd').length ){
		orgParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
	}
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/orgs',
		data : orgParam,
		method : 'GET',
	    flag : 'orgs'
	}).done(function(response){

		var rsCodeList = response.orgList;
		var rsOrgSelectId = response.orgSelectId; // Session에 있는 사용자 조직ID를 세팅
		var rsOrgDispYn = response.orgDispYn;
		var rsOrgGrpCd = response.orgGrpCd;  // manager :SKT, SKB else PTN
		var rsBpId = response.bpId;  // orgGrpCd이 PTN인 경우 bpId값 존재

		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		var divWidth = $("#"+strSelectId).parent().css('width');
		$("#"+strSelectId).unwrap('div'); //부모창 Div제거
		$("#"+strSelectId).addClass('Multiselect');
		$("#"+strSelectId).attr('data-type', 'multiselect');
		$("#"+strSelectId).attr('data-bind', 'options:data, selectedOptions:'+strSelectId+', value:'+strSelectId);
		$("#"+strSelectId).attr('data-bind-option', 'orgId:orgNm');
		
		var rsOrgSelectNm = "";
		
		$.each(rsCodeList, function(index, value) {
			if(value.orgId == rsOrgSelectId){
				rsOrgSelectNm = value.orgNm;
			}
	    	codeDataOption.push(value);
	    });
		
		$("#"+strSelectId).setData({
			data: codeDataOption
		});

		$("#"+strSelectId).multiselect({
        	header : true,
        	//checkedheader : true,
        	filter : false,
        	noneSelectedText : "선택하세요",
        	minWidth : divWidth,
        	selectedList : 2
        });
		
		// selectedOptions이 적용되지 않아 소속본부를 강제로 세팅 
		$('[name=multiselect_'+strSelectId+']').each(function(){
			if($(this).val() == rsOrgSelectId){
				$(this).attr('checked',true);
				$(this).attr('aria-selected', true);
				$("#"+strSelectId).val(rsOrgSelectId);
				$("#"+strSelectId).next().find('span:eq(1)').html(rsOrgSelectNm);					
			}else{
				
				if( $.TcpUtils.isEmpty(rsOrgSelectId) &&  $(this).val() == $('#'+strSelectId).val()){ // 조직이 없을때, 기본 셋팅 조직 체크
					$(this).attr('checked',true);
					$(this).attr('aria-selected', true);
				}else{
					$(this).attr('checked',false);
					$(this).attr('aria-selected', false);
				}
			}
		});
		
		//본사가 아니지만 권한이 1개이상인 경우 활성화
	    if(rsOrgDispYn == "N" && rsCodeList.length < 2){
	    	$("#"+strSelectId).multiselect("disable");
	    }
	    
	    if($("[name=multiselect_"+strSelectId+"]").length > 0){
	    	$("[name=multiselect_"+strSelectId+"]").parent().parent().parent().parent().children('div:eq(0)').children('div:eq(0)').remove();
	    }
		
	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	       //alert('조직코드 조회 실패');
	   });
}

var setTextByArray = function(sArray) {
	
	 var textList = "";
	 
	 if (undefined == sArray || null == sArray){
		 return sArray;
	 }
     if ($.isArray(sArray)) {
         if (sArray.length < 1) return null;
     }
     
     if ('string' == typeof sArray) {
    	 return sArray;
     }else{
    	 for(i=0; i < sArray.length; i++){
 	   		if($.TcpUtils.isNotEmpty( sArray[i])){
 	   			textList += (i==0)?sArray[i]:","+sArray[i];
 	   		}
 	   	}
     }
     
     return textList;
}

var setSelectByOrgTeam = function(strSelectId, strSelectHead, strUprOrgId, strOrgType, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId) || $.TcpUtils.isEmpty(strOrgType))
		return;

	// 본부코드 값이 없는 경우
	if($.TcpUtils.isEmpty(strUprOrgId)){
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({uprOrgId:"", orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({uprOrgId:"", orgId:"",orgNm:"전체"});
		}
		$("#"+strSelectId).setData({
            data:codeDataOption
		});

		return;
	}

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'orgId:orgNm');
	
	var orgParam = new Object();
		orgParam["taskOrgDivCd"] = strOrgType;
		
	//본부가 MultiSelect형태로 넘어오는 경우 - 19.02.13 Kim Seung Yu
	if(typeof strUprOrgId == "object"){
		orgParam["orgTeamMulti"] = "Y";
		var orgList = "";
		for(i=0; i<strUprOrgId.length; i++){
			if($.TcpUtils.isNotEmpty( strUprOrgId[i])){
				orgList += (i==0)?strUprOrgId[i]:","+strUprOrgId[i];
			}
		}
		
		orgParam["uprOrgId"] = orgList;
		
	}else{
		orgParam["uprOrgId"] = strUprOrgId;
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/orgTeams',
		data : orgParam,
		method : 'GET',
	    flag : 'orgTeams'
	}).done(function(response){

		var rsCodeList = response.orgTeamList;
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({uprOrgId:rsCodeList[0].uprOrgId, orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({uprOrgId:rsCodeList[0].uprOrgId, orgId:"",orgNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push(value);
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
		});

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	      // alert('팀코드 조회 실패');
	   });
}

/* Team 조회 (CSMS용) */
var setSelectByOrgTeamForCsms = function(strSelectId, strSelectHead, strUprOrgId, strOrgType, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId) || $.TcpUtils.isEmpty(strOrgType))
		return;
	
	// 본부코드 값이 없는 경우
	if($.TcpUtils.isEmpty(strUprOrgId)){
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";
		
		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({uprOrgId:"", orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({uprOrgId:"", orgId:"",orgNm:"전체"});
		}
		$("#"+strSelectId).setData({
			data:codeDataOption
		});
		
		return;
	}
	
	strSelectId = strSelectId.replace(/^#/, "");
	
	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'orgId:orgNm');
	
	var orgParam = new Object();
	orgParam["taskOrgDivCd"] = strOrgType;
	
	//본부가 MultiSelect형태로 넘어오는 경우 - 19.02.13 Kim Seung Yu
	if(typeof strUprOrgId == "object"){
		orgParam["orgTeamMulti"] = "Y";
		var orgList = "";
		for(i=0; i<strUprOrgId.length; i++){
			if($.TcpUtils.isNotEmpty( strUprOrgId[i])){
				orgList += (i==0)?strUprOrgId[i]:","+strUprOrgId[i];
			}
		}
		
		orgParam["uprOrgId"] = orgList;
		
	}else{
		orgParam["uprOrgId"] = strUprOrgId;
	}
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/orgTeamsForCsms',
		data : orgParam,
		method : 'GET',
		flag : 'orgTeams'
	}).done(function(response){
		
		var rsCodeList = response.orgTeamList;
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";
		
		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({uprOrgId:rsCodeList[0].uprOrgId, orgId:"",orgNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({uprOrgId:rsCodeList[0].uprOrgId, orgId:"",orgNm:"전체"});
		}
		
		$.each(rsCodeList, function(index, value) {
			codeDataOption.push(value);
		});
		
		$("#"+strSelectId).setData({
			data:codeDataOption
		});
		
		// Callback Func가 존재하는 경우 호출
		if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
			callback.call(this, strSelectId);
		}
		
	})
	.fail(function(response){
		// alert('팀코드 조회 실패');
	});
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * setSelectByUprc('uprcAplyDtId', 'select', setSelectByUprcCallBack);
 *
 * [HTML]
 * <select name="uprcAplyDtId" id="uprcAplyDtId"> </select>
 * ---------------------------------------------------------------------------------
 * strSelectId     : SelectBox ID
 * strSelectHead   : SelectBox Head
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var setSelectByUprc = function(strSelectId, strSelectHead, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId) )
		return;

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'uprcAplyDt:uprcAplyDtNm');

	var orgParam = new Object();

	// SK계열사구분코드 설정
	if($('#skAfcoDivCd').length ){
		orgParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/uprcAplyDts',
		data : orgParam,
		method : 'GET',
	    flag : 'uprcAplyDts'
	}).done(function(response){

		var rsCodeList = response.uprcList;
		var codeDataOption = new Array();
		var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";

		// SelectBox 상단 문구 세팅
		if(codehead == 'select'){
			codeDataOption.push({uprcAplyDt:"",uprcAplyDtNm:"선택"});
		}else if(codehead == 'all'){
			codeDataOption.push({uprcAplyDt:"",uprcAplyDtNm:"전체"});
		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push(value);
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
		});

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	   })
	  .fail(function(response){
	      // alert('단가적용일 조회 실패');
	   });
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * var bizParamArg = new Array();
	   bizParamArg.push("erpDetlBizDivCd:T"); -> bizParamArg.push("prntBizDivCd:C00618");

 * setSelectByCode('afeYr', 'bizPurp', 'bizNm', setSelectByBizCallBack, bizParamArg);
 *
 * [HTML]
 * <select name="demdBizDivCd" id="demdBizDivCd"></select>
 * ---------------------------------------------------------------------------------
 * strAfeYrId      : 사업년도
 * strBizPurp      : 사업목적 (NITS_PRNT_BIZ_DIV_CD 컬럼이 'ROOT'인 항목)
 * strBizNm        : 사업구분 (PRNT_BIZ_DIV_CD 컬럼이 사업목적 DEMD_BIZ_DIV_CD인 항목)
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 * strSelectHead   : 헤드
 */
var parentAfeYrId;
var parentBizPurpId;
var parentBizNmId;
var parentArgument;
var setSelectByBiz = function(strAfeYrId, strBizPurp, strBizNm, callback, strSelectHead, strArgument) {
	if ( $.TcpUtils.isEmpty(strAfeYrId) || $.TcpUtils.isEmpty(strBizPurp) || $.TcpUtils.isEmpty(strBizNm))
		return;

	// 화면ID 전연변수 저장
	parentAfeYrId = strAfeYrId;
	parentBizPurpId = strBizPurp;
	parentBizNmId = strBizNm;

	// 사업목적, 사업구분 (지장이설) / 사업목적 (장비) 추가 - 16.12.05 김승유
	if ( $.TcpUtils.isNotEmpty(strArgument)){
		parentArgument = strArgument;
	}else{
		parentArgument = "";
	}

	$("#"+strAfeYrId).attr('data-type', 'select');
	$("#"+strBizPurp).attr('data-type', 'select');
	$("#"+strBizNm).attr('data-type', 'select');

	$("#"+strAfeYrId).attr('data-bind', 'options:data, selectedOptions:initAfeYr value:'+strAfeYrId);
	$("#"+strBizPurp).attr('data-bind', 'options:data, value:'+strBizPurp);
	$("#"+strBizNm).attr('data-bind', 'options:data, value:'+strBizNm);

	$("#"+strAfeYrId).attr('data-bind-option', 'afeYr:afeYr');
	$("#"+strBizPurp).attr('data-bind-option', 'demdBizDivCd:demdBizDivNm');
	$("#"+strBizNm).attr('data-bind-option', 'demdBizDivCd:demdBizDivNm');

	$("#"+strAfeYrId).addClass('afeYrClass');
	$("#"+strBizPurp).addClass('bizPurpClass');

	// 사업년도 Change Event Bind
	$(".afeYrClass").on('change',function() {
		setBizDivCd($(this).val(), 'PURP', 'ROOT', callback, strSelectHead);
	});

	// 사업목적 Change Event Bind
	$(".bizPurpClass").on('change',function() {
		setBizDivCd($("#"+parentAfeYrId).val(), 'NM', $(this).val(), callback, strSelectHead);
	});

    var today = new Date();
	var todayY = today.getFullYear();
	var initAfeYr;

	var bizParam = new Object();

	//SK계열사 구분코드설정
	if($('#skAfcoDivCd').length ){
		bizParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/bizAfeYr',
		data : bizParam,
		async : false,
		method : 'GET',
	    flag : 'bizAfeYr'
	}).done(function(response){

		var rsCodeList = response.afeYrList;
		var codeDataOption = new Array();

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push(value);
	    });

	    // 조회한 사업년도에 올해가 존재하는지 체크
	    var codeInitData = $.grep(codeDataOption, function(ele, index) {
			  return ele.afeYr == todayY;
		});

	    if(codeInitData.length > 0){
	    	//$("#"+strAfeYrId).val(todayY);
	    	initAfeYr = todayY;
	    }else{
	    	//$("#"+strAfeYrId+" option:eq(1)").attr("selected","selected");
	    	initAfeYr = rsCodeList[0].afeYr;
	    }

	    $("#"+strAfeYrId).setData({
           data:codeDataOption
           ,initAfeYr : initAfeYr
		});

	    // 선택된 값에 대해 자동조회
	    $("#"+strAfeYrId).trigger('change');

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strAfeYrId);
        }

	   })
	  .fail(function(response){
	      // alert('사업년도 조회 실패');
	   });
}

// 사업목적,사업구분 조회
function setBizDivCd(strAfeYr, strType, strParam, callback, strSelectHead, strArgument){

	var codehead = $.TcpUtils.isNotEmpty(strSelectHead) ? strSelectHead  : "all";
	var bizParam = new Object();
	bizParam['afeYr'] = strAfeYr;

	// 추가 조건절이 있는 경우 세팅 - 16.12.05 한병곤 차장 요청
	if($.TcpUtils.isNotEmpty(parentArgument)){
		for(var k=0; k < parentArgument.length; k++){
			if($('#'+parentArgument[k]).length ){
				bizParam[parentArgument[k]] = $('#'+parentArgument[k]).val();
			}
		}
	}

	if($('#skAfcoDivCd').length ){
		if($('#skAfcoDivCd').val() == "T"){ //임시
			bizParam["skAfcoDivCd"] = "T";
		}else{
			bizParam["skAfcoDivCd"] = "B";
		}
	}

	if(strType == 'PURP'){
		//bizParam['nitsPrntBizDivCd'] = strParam; // 기존에 nitsPrntBizDivCd 'ROOT'이고 erpDetlBizDivCd 로 'T','B' 구분을 입력받았음

		//SK계열사 구분코드설정 - prntBizDivCd로 T : C00618 / B : C00851 로 입력 (2016.11.07)
		if($('#skAfcoDivCd').length ){
			if($('#skAfcoDivCd').val() == "T"){ //임시
				bizParam["prntBizDivCd"] = "C00618";
			}else{
				bizParam["prntBizDivCd"] = "C00851";
			}
		}

	}else{
		bizParam['prntBizDivCd'] = strParam;

		// 선택을 클릭한 경우 사업구분 초기화
		if($.TcpUtils.isEmpty(strParam)){
			 $("#"+parentBizNmId).empty();
	    	 var codeBizDataOption = new Array();

	    	 if(codehead == 'all'){
	    		codeBizDataOption.push({demdBizDivCd:"",demdBizDivNm:"전체"});
	 		 }else{
	 			codeBizDataOption.push({demdBizDivCd:"",demdBizDivNm:"선택"});
	 		 }

	    	 $("#"+parentBizNmId).setData({
	             data:codeBizDataOption
	  		 });

	    	 return;
		 }
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/bizDivCd',
		data : bizParam,
		method : 'GET',
	    flag : 'bizDivCd'
	}).done(function(response){

		var rsCodeList = response.bizDivList;
		var codeDataOption = new Array();

		if(codehead == 'all'){
			codeDataOption.push({demdBizDivCd:"",demdBizDivNm:"전체"});
 		}else{
 			codeDataOption.push({demdBizDivCd:"",demdBizDivNm:"선택"});
 		}

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push(value);
	    });

	    if(strType == 'PURP'){
	    	 $("#"+parentBizPurpId).setData({
	             data:codeDataOption
	  		 });

	    	// NITS선로사업구분코드 옵션 추가 - 16.12.16 Kim Seung Yu
	    	 $.each(rsCodeList, function(index, value) {
	    		 var optionIndex = parseInt(index)+1; // 전체,선택은 SKIP

	    		 if($.TcpUtils.isNotEmpty(value.nitsLnBizDivCd)){
	    			 $("#"+parentBizPurpId+" option:eq("+optionIndex+")").attr("nitsLnBizDivCd",value.nitsLnBizDivCd);
	    		 }else{
	    			 $("#"+parentBizPurpId+" option:eq("+optionIndex+")").attr("nitsLnBizDivCd","");
	    		 }
	 	    });

	    	 $("#"+parentBizNmId).empty();
	    	 //$("#"+parentBizNmId).find("option").remove();
	    	 var codeBizDataOption = new Array();

	    	 if(codehead == 'all'){
	    		codeBizDataOption.push({demdBizDivCd:"",demdBizDivNm:"전체"});
	  		 }else{
	  			codeBizDataOption.push({demdBizDivCd:"",demdBizDivNm:"선택"});
	  		 }

	    	 $("#"+parentBizNmId).setData({
	             data:codeBizDataOption
	  		 });
		}else{
			$("#"+parentBizNmId).setData({
	             data:codeDataOption
	  		 });
		}

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	if(strType == 'PURP'){
	    		callback.call(this, parentBizPurpId);
	    	}else{
	    		callback.call(this, parentBizNmId);
	    	}
        }

	   })
	  .fail(function(response){
	       //alert('사업목적,구분 조회 실패');
	   });
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * var comParamArg = new Array();
	   comParamArg.push("comCd:A^B");
	   comParamArg.push("comCdNm:재실사");

 * var returnCodeList = getDataByCode('C00016', getDataByCodeCallBack, strArgument);
 * ---------------------------------------------------------------------------------
 * strComGrpCd     : 공통 그룹코드
 * strArgument     : 공통 코드 조회 Argument
 *
 */
var getDataByCode = function(strComGrpCd, callback, strArgument) {
	if ( $.TcpUtils.isEmpty(strComGrpCd))
		return;

	var rsCodeList;
	var comParam = new Object();
		comParam["comGrpCd"] = strComGrpCd;

	// 추가 조건절이 있는 경우 세팅
	if($.TcpUtils.isNotEmpty(strArgument)){
		//{"comGrpCd":"C00016","comCd":"A^B","useYn":"Y"};
		for(var k=0; k < strArgument.length; k++){
			comParam[strArgument[k].split(':')[0]] = strArgument[k].split(':')[1];
		}
	}

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/comCds',
		data : comParam,
		method : 'GET',
		//async : false,
	    flag : 'comCds'
	}).done(function(response){
		rsCodeList = response.comCdList;

		// Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strComGrpCd, rsCodeList);
        }

	   })
	  .fail(function(response){
	       //alert('공통코드 Get 실패');
	   });
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

// 공사명 조회
var setConstruction = function(strCdId, strNmId, strArg, strGridId){

	tcpCommonInit(strCdId, strNmId, strArg, strGridId);
	strNmClear(strCdId, strNmId, strGridId);
    tcpCommonSearch({cstrCd : parentCdVal, cstrNm : parentNmVal},
			       'tango-transmission-biz/transmisson/constructprocess/common/constructions',
			       'constructios');
}


//사용자 조회
var setUser = function(strCdId, strNmId, strArg, strGridId){

	tcpCommonInit(strCdId, strNmId, strArg, strGridId);
	strNmClear(strCdId, strNmId, strGridId);
	tcpCommonSearch('',//{userId : parentCdVal, userNm : parentNmVal},
			        'tango-transmission-biz/transmisson/constructprocess/common/users',
			        'users');
}

/*
 * 사용자 명 조회 관련 이벤트(본부 소속 조직)
 * 
 * 돋보기 클릭, 엔터
 * 
 */ 
var setUserEvent = function(userId, userNm, buttonId, strArg, strGridId) {
	
	$("#"+buttonId).on({
		"click": function(){
			if( $.TcpUtils.isEmpty($("#"+userId).val()) ){
	    		$("#"+userNm).val('');
	    	}
	    	setUserNm(userId, userNm, strArg, strGridId);
		}
	});
	
	$("#"+userId).on({
		"keyup": function(e){
			if( e.keyCode == 13 ){
				setUserNm(userId, userNm, strArg, strGridId);
			}
		}
	});	
}

//사용자 명으로 조회
var setUserNm = function(strCdId, strNmId, strArg, strGridId){

	tcpCommonInit(strCdId, strNmId, strArg, strGridId);
	strNmClear(strCdId, strNmId, strGridId);
	//clearParam(strArg, strGridId);
	tcpCommonSearch({userId : parentCdVal, userNm : parentNmVal},
			        'tango-transmission-biz/transmisson/constructprocess/common/usersNm', 'usersNm');
}

/*
 * 사용자 명 조회 관련 이벤트(전체 조직)
 * 
 * 돋보기 클릭, 엔터
 * 
 */ 
var setUserEventByAllOrg = function(userId, userNm, buttonId, strArg, strGridId) {
	
	$("#"+buttonId).on({
		"click": function(){
			if( $.TcpUtils.isEmpty($("#"+userId).val()) ){
				$("#"+userNm).val('');
			}
			setUserNmByAllOrg(userId, userNm, strArg, strGridId);
		}
	});
	
	$("#"+userId).on({
		"keyup": function(e){
			if( e.keyCode == 13 ){
				setUserNmByAllOrg(userId, userNm, strArg, strGridId);
			}
		}
	});	
}

//사용자 명으로 조회(전체 조직)
var setUserNmByAllOrg = function(strCdId, strNmId, strArg, strGridId){
	
	tcpCommonInit(strCdId, strNmId, strArg, strGridId);
	strNmClear(strCdId, strNmId, strGridId);
	//clearParam(strArg, strGridId);
	tcpCommonSearch({userId : parentCdVal, userNm : parentNmVal},
			'tango-transmission-biz/transmisson/constructprocess/common/usersNmByAllOrg','usersNmByAllOrg');
}

// 시공업체 조회
var setBp = function(strCdId, strNmId, strArg){

	tcpCommonInit(strCdId, strNmId, strArg);
	strNmClear(strCdId, strNmId, "");
	tcpCommonSearch('',  //{bpId : parentCdVal, bpNm : parentNmVal}
			        'tango-transmission-biz/transmisson/constructprocess/common/bps',
			        'bps');
}

// 시공업체 조회 - 본부에 소속된 BP
var setBpByMgmtOrgId = function(strCdId, strNmId, strMgmtOrgId, callback){
	
	strParam = {};
	strParam['popHead'] = 'Y'; // window popup인 경우 팝업헤드에 타이틀 설정 추가 - 2016.11.11 KSY
	
	strParam["mgmtOrgId"] = $('#'+strMgmtOrgId).val();
	
	// SK계열사구분코드 설정
	if($('#skAfcoDivCd').length ){
		strParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();		
	}

	$a.popup({
     	popid: 'BpCommon',
     	title: '시공업체 조회',
        url: '/tango-transmission-web/constructprocess/common/BpCommon.do',
        iframe: false,
        //movable : true,
        windowpopup: true,
        width: 700,
        height: 620,
        //data: { "bpId": parentCdVal, "bpNm" : parentNmVal},
        data : strParam,
        callback: function(data) {
				if(data != null){
					
					$('#'+strCdId).val(data.bpId);
					$('#'+strNmId).val(data.bpNm);
					
					if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
				    	callback.call();
			        }
				}
        }
	});
}




// 선로자재 조회
var setEqp = function(strCdId, strNmId){

	tcpCommonInit(strCdId, strNmId);
	strNmClear(strCdId, strNmId, "");
	tcpCommonSearch('', //{wrwlsCd : parentCdVal, trmsEqpNm : parentNmVal}
			        'tango-transmission-biz/transmisson/constructprocess/common/eqps',
			        'eqps');
}

// 통합설계그룹 조회
var setIntegrationDesignGroup = function(strCdId, strNmId, strParam){

	tcpCommonInit(strCdId, strNmId);
	strNmClear(strCdId, strNmId, "");
	tcpCommonSearch(strParam, 'tango-transmission-biz/transmisson/constructprocess/common/designgroups', 'designgroups');
};

// 청약정보 조회
var setApplication = function(strCdId, strNmId){

	tcpCommonInit(strCdId, strNmId);
	strNmClear(strCdId, strNmId, "");
	successCallbackTcpCommon(null, 'applications');
//	tcpCommonSearch('', 'tango-transmission-biz/transmisson/constructprocess/common/applications', 'applications');
};

// 작업정보 조회
var setWkrt = function(strCdId, strNmId) {

	tcpCommonInit(strCdId, strNmId);
	strNmClear(strCdId, strNmId, "");
	
	if ($.TcpUtils.isEmpty(parentCdVal)) {	// 작업번호
		$a.popup({
			popid : 'WkrtCommon',
			title : '작업정보 조회',
			url : '/tango-transmission-web/constructprocess/common/WkrtCommon.do',
			data : {
				"popHead" : "Y"
			},
			width : 1000,
			height : 700,
			windowpopup : true,
			modal : false,
			movable : true,
			other : 'location=0',
			callback : function(data) {
				if (data != null) {
					$('#'+strCdId).val(data.wkrtNo);
					$('#'+strNmId).val(data.workNm);
				}
			}
		});
	} else {
		tcpCommonSearch({'wkrtNo' : parentCdVal}, 'tango-transmission-biz/transmisson/constructprocess/common/wkrt', 'wkrt');
	}
	
};

//공통팝업 변수선언
function tcpCommonInit(strCdId, strNmId, strArg, strGridId){

	// 변수초기화
	parentCdId = "";
	parentCdVal = "";
	parentNmId = "";
	parentNmVal = "";
	parentGridId = "";
	parentGridKey = "";
	parentArg = "";
	parentParam = "";

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
			if ($.TcpUtils.isNotEmpty($('#'+strCdId).val()) ) {
				parentCdVal = $('#'+strCdId).val();
		    }
		}
		if($('#'+strNmId).length ){
			parentNmId = strNmId;
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

// 공통팝업 request
function tcpCommonSearch(strParam, strUrl, strFlag){

	if($.TcpUtils.isEmpty(strParam)){
		strParam = {}; //배열초기화
	}

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

//코드값 클리어시 코드명 클리어 (그리드가 아닌 경우에만 적용)
function strNmClear(strCd, strNm, strGrid){

	if ($.TcpUtils.isEmpty(strGrid) &&  $.TcpUtils.isNotEmpty($("#"+strCd)[0])) {
		if($._data($("#"+strCd)[0], 'events').propertychange == undefined){
			$("#"+strCd).on('input propertychange',function() {
				if($.TcpUtils.isEmpty($(this).val())){
					$("#"+strNm).val("");
		    	}
			});
		}
	}
}

//팝업에서 셋팅하는 파라미터 초기화
function clearParam(strArg, strGridId){

	if($.TcpUtils.isEmpty(strGridId)){
		
		if($.TcpUtils.isNotEmpty(strArg)){
			for(var k=0; k < strArg.length; k++){
				$('#'+strArg[k]).val("");
			}
		}	
	}
}

//request 성공시
function successCallbackTcpCommon(response, flag, strParam){

	// 코드값 클리어시 코드명 클리어 (그리드가 아닌 경우에만 적용)
	/*
	if ($.TcpUtils.isEmpty(parentGridId) ) {
		if($._data($("#"+parentCdId)[0], 'events').propertychange == undefined){
			$("#"+parentCdId).on('input propertychange',function() {
				if($.TcpUtils.isEmpty($(this).val())){
					$("#"+parentNmId).val("");
		    	}
			});
		}
	}
	*/

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
			strParam = {}; //배열초기화 (단건 조회가 안된경우 파라메터를 클리어 함 - 17.02.06 KSY)
			strParam['popHead'] = 'Y'; // window popup인 경우 팝업헤드에 타이틀 설정 추가 - 2016.11.11 KSY

			$a.popup({
		     	popid: 'ConstructionCommon',
		     	title: '공사명 조회',
		        url: '/tango-transmission-web/constructprocess/common/ConstructionCommon.do',
		        iframe: false,
		        windowpopup: true,
		        //modal : true,
		        width: 900,
		        height: 800,
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

	}else if(flag == 'bps'){

		if(response.pager.totalCnt == 1){
			$('#'+parentCdId).val(response.bpList[0].bpId);
			$('#'+parentNmId).val(response.bpList[0].bpNm);
		}else{

			strParam['popHead'] = 'Y'; // window popup인 경우 팝업헤드에 타이틀 설정 추가 - 2016.11.11 KSY

			// SK계열사구분코드 설정
			if($('#skAfcoDivCd').length ){
				strParam["skAfcoDivCd"] = $('#skAfcoDivCd').val();
			}

			$a.popup({
		     	popid: 'BpCommon',
		     	title: '시공업체 조회',
		        url: '/tango-transmission-web/constructprocess/common/BpCommon.do',
		        iframe: false,
		        //movable : true,
		        windowpopup: true,
		        width: 700,
		        height: 620,
		        //data: { "bpId": parentCdVal, "bpNm" : parentNmVal},
		        data : strParam,
		        callback: function(data) {
						if(data != null){
							$('#'+parentCdId).val(data.bpId);
							$('#'+parentNmId).val(data.bpNm);

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

			strParam['popHead'] = 'Y';

			$a.popup({
		     	popid: 'UserCommon',
		     	title: '사용자 조회',
		        url: '/tango-transmission-web/constructprocess/common/UserCommon.do',
		        iframe: false,
		        windowpopup: true,
		        //movable: true,
		        width: 900,
		        height: 800,
		        //data: { "userId": parentCdVal, "userNm" : parentNmVal},
		        data : strParam,
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
		
	}else if(flag == 'usersNm'){
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
			strParam['popHead'] = 'Y';

			$a.popup({
		     	popid: 'UserCommon',
		     	title: '사용자 조회',
		        url: '/tango-transmission-web/constructprocess/common/UserCommon.do',
		        iframe: false,
		        windowpopup: true,
		        //movable: true,
		        width: 900,
		        height: 800,
		        data: { "userNm" : parentCdVal},
		        //data : strParam,
		        callback: function(data) {
		        		if(data != null){
							if ($.TcpUtils.isNotEmpty(parentGridId) ) {
								var editData = new Object();
								//editData[parentCdId] = data.userId;
								editData[parentNmId] = data.userId;
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
		
	}else if(flag == 'usersNmByAllOrg'){
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
			strParam['popHead'] = 'Y';
			
			$a.popup({
				popid: 'UserCommonByAllOrg',
				title: '사용자 조회',
				url: '/tango-transmission-web/constructprocess/common/UserCommonByAllOrg.do',
				iframe: false,
				windowpopup: true,
				//movable: true,
				width: 900,
				height: 800,
				data: { "userNm" : parentCdVal},
				//data : strParam,
				callback: function(data) {
					if(data != null){
						if ($.TcpUtils.isNotEmpty(parentGridId) ) {
							var editData = new Object();
							//editData[parentCdId] = data.userId;
							editData[parentNmId] = data.userId;
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
		
	}else if(flag == 'eqps'){

		if(response.pager.totalCnt == 1){
			$('#'+parentCdId).val(response.eqpList[0].wrwlsCd);
			$('#'+parentNmId).val(response.eqpList[0].trmsEqpNm);
		}else{
			$a.popup({
		     	popid: 'EqpCommon',
		     	title: '선로자재 조회',
		        url: '/tango-transmission-web/constructprocess/common/EqpCommon.do',
		        iframe: false,
		        windowpopup: true,
		        //movable: true,
		        width: 900,
		        height: 730,
		        //data: { "wrwlsCd": parentCdVal, "trmsEqpNm" : parentNmVal},
		        data : {"popHead": "Y"},
		        callback: function(data) {
						if(data != null){
							$('#'+parentCdId).val(data.wrwlsCd);
							$('#'+parentNmId).val(data.trmsEqpNm);
						}
		        }
			});
		}
		
	}else if (flag == 'itmEqps'){
		if(response.pager.totalCnt == 1){
			$('#'+parentCdId).val(response.eqpList[0].itmId);
			$('#'+parentNmId).val(response.eqpList[0].trmsEqpNm);
		}else{
			$a.popup({
		     	popid: 'ItmEqpCommon',
		     	title: '자재 조회',
		        url: '/tango-transmission-web/constructprocess/common/ItmEqpCommon.do',
		        iframe: false,
		        windowpopup: true,
		        //movable: true,
		        width: 900,
		        height: 800,
		        //data: { "wrwlsCd": parentCdVal, "trmsEqpNm" : parentNmVal},
		        data : {"popHead": "Y"},
		        callback: function(data) {
						if(data != null){
							$('#'+parentCdId).val(data.itmId);
							$('#'+parentNmId).val(data.trmsEqpNm);
						}
		        }
			});
		}
	}else if (flag == 'designgroups'){
		strParam['popHead'] = 'Y';
		$a.popup({
	     	popid: 'IntegrationDesignGroupCommon',
	     	title: '통합설계그룹 조회',
	        url: '/tango-transmission-web/constructprocess/common/IntegrationDesignGroupCommon.do',
	        iframe: false,
	        windowpopup: true,
	        //movable: true,
	        width: 900,
	        height: 800,
	        data : strParam,
	        callback: function(data) {
				if(data != null){
					$('#'+parentCdId).val(data.intgDsnGrpNo);
					$('#'+parentNmId).val(data.intgDsnGrpNm);
				}
	        }
		});
	}else if (flag == 'applications'){
		$a.popup({
	     	popid: 'ApplicationCommon',
	     	title: '청약번호 조회',
	        url: '/tango-transmission-web/constructprocess/common/ApplicationCommon.do',
	        iframe: false,
	        windowpopup: true,
	        //movable: true,
	        width: 900,
	        height: 800,
	        //data: { "wrwlsCd": parentCdVal, "trmsEqpNm" : parentNmVal},
	        data : {"popHead": "Y"},
	        callback: function(data) {
				if(data != null){
					$('#'+parentCdId).val(data.appltNo);
					$('#'+parentNmId).val(data.appltNm);
				}
	        }
		});
	} else if (flag == 'wkrt') {
		
		if (response.pager.totalCnt == 1) {
			var wkrtList = response.wkrtList;
			$('#'+parentCdId).val(wkrtList[0].wkrtNo);
			$('#'+parentNmId).val(wkrtList[0].workNm);
		} else {
			$('#'+parentCdId).val('');
			$('#'+parentNmId).val('');
			
			$a.popup({
				popid : 'WkrtCommon',
				title : '작업정보 조회',
				url : '/tango-transmission-web/constructprocess/common/WkrtCommon.do',
				data : {
					"popHead" : "Y"
				},
				width : 1000,
				height : 700,
				windowpopup : true,
				modal : false,
				movable : true,
				other : 'location=0',
				callback : function(data) {
					if (data != null) {
						$('#'+parentCdId).val(data.wkrtNo);
						$('#'+parentNmId).val(data.workNm);
					}
				}
			});
		}
		
	}
	
	
}

//request 실패시.
function failCallbackTcpCommon(response, flag){
	if(flag == 'constructios'){
		//alert('공사 조회실패');
	}
	if(flag == 'bps'){
		//alert('시공업체 조회실패');
	}
	if(flag == 'users'){
		//alert('사용자 조회실패');
	}
	if(flag == 'usersNm'){
		//alert('사용자 조회실패');
	}
	if(flag == 'usersNmByAllOrg'){
		//alert('전체조직에서 사용자 조회실패');
	}
	if(flag == 'eqps'){
		//alert('선로자재 조회실패');
	}
}

/*
 * strUprcAplyDt    : 단가적용일
 * strWrwlsDivCd    : 품셈구분코드(COM_GRP_CD : C00565 / A:사급자재,B:지입자재,C:노무비(기계경비)
 * arrUprcAplyGrid  : 노무비등록 GRID Data
 * callback         : 사용자정의 CallBack함수
 */
var callWrwlsPopup = function(strUprcAplyDt, strWrwlsDivCd, arrUprcAplyGrid, callback){

	$a.popup({
     	popid: 'WrwlsUprcSearch',
     	title: '공종 검색',
        url: '/tango-transmission-web/constructprocess/common/WrwlsUprcSearch.do',
        iframe: false,
        windowpopup: true,
        width: 1020, 
        height: 900,
        data: { "uprcAplyDt": strUprcAplyDt, "wrwlsDivCd" : strWrwlsDivCd , "uprcAplyGrid" : arrUprcAplyGrid, "popHead" : "Y"},
        //data: { "uprcAplyDt": uprcAplyDt},
        callback: function(data) {
				if(data != null){
					// Callback Func가 존재하는 경우 호출
				    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
				    	callback.call(this, data);
			        }
				}
        }
	});
}

/*
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * setBpByRole('bpId', 'bpNm', 'btnBpid');
 *
 * ---------------------------------------------------------------------------------
 * strBpId     : 시공업체ID
 * strBpNm     : 시공업체명
 * strBpBtnId  : 시공업체팝업 버튼ID
 */
var setBpByRole = function(strBpId, strBpNm, strBpBtnId, callback) {
	if ( $.TcpUtils.isEmpty(strBpId))
		return;

	var componentTypeCd = "BP";

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/bpRole/'+componentTypeCd,
		data : null,
		method : 'GET',
	    flag : 'bpRole'
	}).done(function(response){
		var rsBpDispYn = response.bpDispYn;
		var rsBpIdVal = response.bpIdVal;
		var rsBpNmVal = response.bpNmVal;

		/* ---------------------------------------------------------------
		 * BP사 인경우 시공업체ID, 시공업체명, 버튼ID를 비활성화, 값 세팅
		 * ---------------------------------------------------------------
		 */

		if(rsBpDispYn == "Y"){
			if($('#'+strBpId).length ){
				$("#"+strBpId).setEnabled(false);
				$("#"+strBpId).val(rsBpIdVal);
			}
			if($('#'+strBpNm).length ){
	    		$("#"+strBpNm).setEnabled(false);
	    		$("#"+strBpNm).val(rsBpNmVal);
	    	}
	    	if($('#'+strBpBtnId).length ){
	    		$("#"+strBpBtnId).setEnabled(false);
			}
	    }else{
	    	//$("#"+strBpId).setEnabled(true);
	    	//$("#"+strBpNm).setEnabled(true);
	    	//$("#"+strBpBtnId).setEnabled(true);
	    }

		if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {  // callback 추가 - 17.08.30 ksy
	    	callback.call(this, strBpId);
        }

	   })
	  .fail(function(response){
	      //alert('시공업체 권한 세팅 실패');
	   });
	
	strNmClear(strBpId, strBpNm, '');
}

var getSkAfcoDivCd = function(callback) {
	var rtnVal = "";
	var url = 'tango-transmission-biz/transmisson/constructprocess/common/tcpUserInfo/'+"TANGOT";
	var userModel = Tango.ajax.init({url:url});
	userModel.get().done(function(response){
		if($('#skAfcoDivCd').length ){
			$('#skAfcoDivCd').val(response.skAfcoDivCd);
		}
		// Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, response);
        }
	});
}


/*
 * 할증적용유무코드
 *
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * setSelectByBnsPcstStdItmCd('bnsPcstStdItmCd',etcAttrValOne, setSelectByBnsPcstStdItmCdCallBack);
 *
 * [HTML]
 * <select name="bnsPcstStdItmCd" id="bnsPcstStdItmCd"> </select>
 * ---------------------------------------------------------------------------------
 * strSelectId     : SelectBox ID
 * etcAttrValOne   : 기타속성값 (L:선로, 운영성공사, D: 장비)
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var setSelectByBnsPcstStdItmCd = function(strSelectId, etcAttrValOne, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId) ){return;}

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'bnsPcstStdItmCd:bnsPcstStdItmCdNm');

	var orgParam = new Object();

	// 기타 속성값
	orgParam["etcAttrValOne"] = etcAttrValOne;


	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/bnsPcstStdItmCd',
		data : orgParam,
		method : 'GET',
	    flag : 'bnsPcstStdItmCd'
	}).done(function(response){
		var rsCodeList = response.bnsPcstStdItmCdList;
		var codeDataOption = new Array();

		// SelectBox 상단 문구 세팅
		codeDataOption.push({bnsPcstStdItmCd:"",bnsPcstStdItmCdNm:"선택"});

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push({bnsPcstStdItmCd:value.comCd,bnsPcstStdItmCdNm:value.comCdNm});
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
		});

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	    // 기본값 할증미적용
	    $("#"+strSelectId).setSelected("AB99");

	   })
	  .fail(function(response){
	       console.log('할증적용유무 조회 실패');
	   });
}

// ITM 자재 조회
var setItmEqp = function(itmId, wrwlsNm){

	tcpCommonInit(itmId, wrwlsNm);
	strNmClear(itmId, wrwlsNm, "");
	tcpCommonSearch('', //{wrwlsCd : parentCdVal, trmsEqpNm : parentNmVal}
			        'tango-transmission-biz/transmisson/constructprocess/common/itmEqps',
			        'itmEqps');
}

/* --------------------------------------------------------------------------
 * LPAD(String ts, int tl, String as) 
 *  : 타겟 문자열에서 좌측으로 추가 문자열을 최종 문자열 길이 만큼 추가
 * ts : 타겟 문자열
 * tl : 최종 문자열 길이
 * as : 추가 문자열
 * 
 * --------------------------------------------------------------------------
 */
var lpad = function(ts, tl, as){
	while(tl > ts.length){
		var asArr = as.split('');
		for(var i=0;i<asArr.length;i++){
			ts = asArr[i] + ts;
			if(tl == ts.length) break;
		}
	}
	return ts;
}

/* --------------------------------------------------------------------------
 * RPAD(String ts, int tl, String as) 
 *  : 타겟 문자열에서 우측으로 추가 문자열을 최종 문자열 길이 만큼 추가
 * ts : 타겟 문자열
 * tl : 최종 문자열 길이
 * as : 추가 문자열
 * 
 * --------------------------------------------------------------------------
 */
var rpad = function(ts, tl, as){
	while(tl > ts.length){
		var asArr = as.split('');
		for(var i=0;i<asArr.length;i++){
			ts += asArr[i]
			if(tl == ts.length) break;
		}
	}
	return ts;
}

/* --------------------------------------------------------------------------
* getSelValList(selObj) 
*  : select box option 목록의 Value 수집
* selObj : jQuery Object
* --------------------------------------------------------------------------
*/
var getSelValList = function(selObj){
	var selObjVal = "";
	var selObjValList = [];
	var optionEleList = selObj.find("option");
	var optionEleListLength = optionEleList.length;
	
	$(optionEleList).each(function(i, el){
		selObjVal = $.trim($(el).val());
		
		if(selObjVal != undefined && selObjVal != "undefined" && selObjVal != "" && selObjVal != "init"){
			selObjValList.push(selObjVal);
		}
	});
	
	return selObjValList;
};

/* 
 * \n 구분자로 구성된 TeaxtArea의 목록을 select box option으로 처리 하는 객체
 * 
 * >> 사용법
 * --------------------------------------------------------------------------------------------------
 * [JavaScript]
 * setMultiInput.textareaId = "cstrCds";
 * setMultiInput.selBoxId = "selectCstrCds";
 * setMultiInput.initButtonId = "initCstrCds";
 * setMultiInput.Execute();
 *
 * [HTML]
 * <textarea type="text" name="cstrCds" id="cstrCds"></textarea>
 * <select name="selectCstrCds" id="selectCstrCds" data-bind="options:selectOptionsl" class="Select">
 * <button type="button" id="initCstrCds" class="Button button2">초기화</button>
 * --------------------------------------------------------------------------------------------------
 * textareaId     	: TextArea ID
 * selBoxId   		: SelectBox ID
 * initButtonId     : 초기화 버튼 ID
 */
var setMultiInput = {
	textareaId : "",
	selBoxId : "",
	initButtonId : "",
	Execute : function(){
		
		if(setMultiInput._checkOtionVal()){
			return false;
		}
	    var textAreaObj = $("#"+setMultiInput.textareaId);
	    var selBoxObj = $("#"+setMultiInput.selBoxId);
	    var initButtonObj = $("#"+setMultiInput.initButtonId);
	    var i = 0;
	  	var j = 0;
	  	var selValStrListLength = 0;
	  	var selVal = "";
	  	var currSelVal = "";
	  	var selValListStr = $(textAreaObj).val();   
	  	var selValStrList = new Array();
	  	var currSelValList = getSelValList(selBoxObj);
	  	var currSelValListLength = currSelValList.length;
	  	var isOverlap = false;
	  	var vOptionsList = new Array();
	  	
	  	var selValStrList = $.trim(selValListStr).split("\n");
	  	selValStrList = $.unique(selValStrList);
	  	selValStrListLength = selValStrList.length;
	  	
	  	if(currSelValList.length > 0){
	  		for(i = 0 ; i < currSelValListLength; i += 1){
	  			currSelVal = $.trim(currSelValList[i]);
	  			vOptionsList.push({value: currSelVal, text: currSelVal});
	  		}
	  	}
	  	
	  	for(i = 0 ; i < selValStrListLength; i += 1){        		
	  		selVal = $.trim(selValStrList[i]);
	  		if(selVal !== ""){
	  			//중복 체크(함수로 빼기)
	  			for(j = 0; j < currSelValListLength; j += 1){
	  				currSelVal = $.trim(currSelValList[j]);
	  				
	  				if(currSelVal == selVal){
	  					isOverlap = true;
	  					break;
	  			  }
	  			}
	  			
	  			if(!isOverlap){
	  				vOptionsList.push({value: selVal, text: selVal});
	  			} else {
	  				isOverlap = false;
	  			}
	  		}
	  	}
	  	
		$(selBoxObj).setData({
			selectOptionsl:vOptionsList
		});
		$(initButtonObj).attr("class","Button button2 color_green");
		$(textAreaObj).val("");
	},
	_checkOtionVal : function(){
		if($.trim(setMultiInput.textareaId) == ""){
			alert("set option for a textareaId");
		}else if($.trim(setMultiInput.selBoxId) == ""){
			alert("set option for a selBoxId");
		}else if($.trim(setMultiInput.initButtonId) == ""){
			alert("set option for a initButtonId");
		}
	}
};




/* --------------------------------------------------------------------------
 * getByteLength(String str) 
 *  : 해당문자열에 대한 byte 길이 조회
 * str : 대상 문자열
 * 한글 : 3byte로 계산
 * --------------------------------------------------------------------------
 */
function getByteLength(str){

	if($.TcpUtils.isEmpty(str)){
		return false;
	}
	
	var length = 0;

	for(var i=0; i<str.length; i++){
	
		var chkChar = escape(str.charAt(i));
		
		if(chkChar.length == 1){
			length++;
		}else if(chkChar.indexOf("%u") != -1){
			length += 3;
		}else if(chkChar.indexOf("%") != -1){
			length += chkChar.length/3;
		}
	}
	
	return length;
}

/** 장비, 포트 조회 **************************************** */
/**
* Function Name : openEqpListPop
* Description   : 장비 검색
* ----------------------------------------------------------------------------------------------------
* param    	 	: 
* ----------------------------------------------------------------------------------------------------
* return        : return param  
*/ 
function openEqpListPopForLineOpen(objId,objNmId, partnerNeId, param, portObj){

		var paramData = new Object();
		$.extend(paramData,{"neNm":''}); // null
		
		$.extend(paramData,{"vTmofInfo":''}); // 최상위 전송실 조회 리스트
		$.extend(paramData,{"searchDivision":''}); // null
		$.extend(paramData,{"fdfAddVisible":true});

		$.extend(paramData,{"partnerNeId": partnerNeId});
		
		$a.popup({
		  	popid: "popEqpListSch" + param,
		  	title: '장비조회'/* 장비 조회 */,
		  	url: '/tango-transmission-web/configmgmt/cfline/EqpInfPop.do',
		  	data: paramData,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 1200,
			height : 730,
			callback:function(data){
				console.log(data);
				
				$('#'+objId).val(data.neId);
				$('#'+objNmId).val(data.neNm);
				
				$.each(portObj,function(idx,str){
					$('#'+str).val('');
				})
				$('#eteSussYn').text('확인필요');
				eteSussChkYn = 'N';
				
			}
		});
}

/**
 * Function Name : openPortListPop
 * Description   : 포트 검색
 * ----------------------------------------------------------------------------------------------------
 * param    	 : PortId. 포트 아이디
 *                 PortNm. 포트명
 *                 neId. 장비 아이디
 *                 searchPortNm. 검색할 포트 명
 *                 leftRight. 좌포트 우포트 구분
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openPortListPopForLineOpen(objId,objNmId, neId, param, gridId){

		var paramData = new Object();
		$.extend(paramData,{"neId":neId});
		
		$a.popup({
		  	popid: "popPortListSch" + param,
		  	title: '포트 조회',
		  	url: '/tango-transmission-web/configmgmt/cfline/PortInfPop.do',
		  	data: paramData,
		  	iframe:true,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 1100,
			height : 740,
			callback:function(data){
				console.log(data);
				var portIdArr = '';
				var portNmArr = '';
				
				if(data.length > 0){
					$.each(data,function(idx,rowData){
						portIdArr = portIdArr+','+rowData.portId;
						portNmArr = portNmArr+','+rowData.portNm;
					})
					portIdArr = portIdArr.replace(',','');
					portNmArr = portNmArr.replace(',','');
				}
				
				$('#'+objId).val(portIdArr);
				$('#'+objNmId).val(portNmArr);
				$('#eteSussYn').text('확인필요');
				eteSussChkYn = 'N';
			}
		}); 

}

// ETE 확인
var eteSussChkYn = 'Y';
function callEteSussYn(params){	
	var portNmArr = null;
	var portCnt = 0;
	var rstObjId = params.rstObjId;
	var sussCnt = 0;
	if(eteSussChkYn == 'N'){
		callMsgBox('','I','포트가 변경되어 저장후 가능합니다.');
		return false;
	}
	if($.TcpUtils.isNotEmpty(params.lnstLmtsoNm)){
		portNmArr = params.lnstLmtsoNm.split(',');	
		
		if(portNmArr.length > 0){
			
			var lftPortNm = portNmArr[0];
			var lftRxPortNm = ''
				if(portNmArr.length == 2){
					lftRxPortNm = portNmArr[1];	
				}
			
			var eqpParam = {"lftEqpId" : params.lnstLmtsoEqpId // 하위국사장비
					,"lftPortNm" : lftPortNm // port명 
					,"lftEqpInstlMtsoId" : params.lowEqpInstlMtsoId // 하위장비설치국사ID
					,"generateLeft" : true // 하위 -> 상위 
					,"lftRxPortNm" : lftRxPortNm
					,"flag" : 'eteSussYn'
					};
			
			
			
				Tango.ajax({
//					url : 'tango-transmission-biz/transmisson/constructprocess/opening/lineopenreg/getChkEteSussYn', // ETE성공여부 확인
					url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectEqpSctnRghtInf',
					data : eqpParam,
					method : 'GET',
					flag:'eteSussYn'
				})
				.done(function(response){
//					$('#'+rstObjId).text(response.eteSussYn);
					console.log(response);
					var eteSussYn = '확인필요';
					if ($.TcpUtils.isNotEmpty(response.eqpSctnRghtInf) && response.eqpSctnRghtInf.length > 0){  
						if($.TcpUtils.isNotEmpty(response.eqpSctnRghtInf[0].errMsg)) {
							eteSussYn = 'N';
						}else{
							eteSussYn = 'Y'
						}
					}
					$('#'+rstObjId).text(eteSussYn);
				})
				.fail(function(response){
					callMsgBox('','I','ETE확인시 오류가 발생하였습니다.',null);
				});			
			
			
		} // if(protNmArr.length > 0){
	}else{
		callMsgBox('','I','하위국 포트명이 존재하지 않습니다.',null);
	} // if($.TcpUtils.isNotEmpty(params.lnstLmtsoNm))
	
}

/*
 * 휴일할증적용유무코드
 *
 * >> 사용법
 * ---------------------------------------------------------------------------------
 * [JavaScript]
 * setSelectByHdayBnsPcstStdItmCd('hdayBnsPcstStdItmCd',etcAttrValTwo, setSelectByHdayBnsPcstStdItmCdCallBack);
 *
 * [HTML]
 * <select name="hdayBnsPcstStdItmCd" id="hdayBnsPcstStdItmCd"> </select>
 * ---------------------------------------------------------------------------------
 * strSelectId     : SelectBox ID
 * etcAttrValTwo   : 기타속성값 ('')
 * callback        : Component 생성 후 Callback Func 호출 (개발자정의)
 */
var setSelectByHdayBnsPcstStdItmCd = function(strSelectId, etcAttrValTwo, callback) {
	if ( $.TcpUtils.isEmpty(strSelectId) ){return;}

	strSelectId = strSelectId.replace(/^#/, "");

	$("#"+strSelectId).attr('data-type', 'select');
	$("#"+strSelectId).attr('data-bind', 'options:data, value:'+strSelectId);
	$("#"+strSelectId).attr('data-bind-option', 'hdayBnsPcstStdItmCd:hdayBnsPcstStdItmCdNm');

	var orgParam = new Object();

	// 기타 속성값
	orgParam["etcAttrValTwo"] = etcAttrValTwo;


	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/constructprocess/common/hdayBnsPcstStdItmCd',
		data : orgParam,
		method : 'GET',
	    flag : 'hdayBnsPcstStdItmCd'
	}).done(function(response){
		var rsCodeList = response.hdayBnsPcstStdItmCdList;
		var codeDataOption = new Array();

		// SelectBox 상단 문구 세팅
		codeDataOption.push({hdayBnsPcstStdItmCd:"",hdayBnsPcstStdItmCdNm:"선택"});

	    $.each(rsCodeList, function(index, value) {
	    	codeDataOption.push({hdayBnsPcstStdItmCd:value.comCd,hdayBnsPcstStdItmCdNm:value.comCdNm});
	    });

	    $("#"+strSelectId).setData({
            data:codeDataOption
		});

	    // Callback Func가 존재하는 경우 호출
	    if ( $.TcpUtils.isNotEmpty(callback) && typeof callback == "function") {
	    	callback.call(this, strSelectId);
        }

	    // 기본값 할증미적용
	    $("#"+strSelectId).setSelected("AB99");

	   })
	  .fail(function(response){
	       console.log('할증적용유무 조회 실패');
	   });
}


/** ************************************************************************ */