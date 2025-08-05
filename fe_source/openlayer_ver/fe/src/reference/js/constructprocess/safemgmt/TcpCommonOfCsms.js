/**
 *  @Description    : Tango-T script Of Csms
 *  @Create User    : P141121
 *  @Create Date    : 2021.01 .22
 *
 *  >>> 공통팝업
 * ------------------------------------------------------------------------------------------------
 *  setUser                    : 사용자 조회
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
});
/* TcpCommomOfCsms */
/*
 * ------------------------------------------------
 *  공통팝업 리스트
 * ------------------------------------------------
 * strCdId    : 코드ID (부모)
 * strNmId    : 코드명 (부모)
 * strGridId  : Grid ID (부모)
 * ------------------------------------------------
 */
var parentCdValOfCsms;
var parentNmVal;
var parentCdId;
var parentNmId;
var parentGridId;
var parentGridKey;
var parentArg;
var parentParam;

//사용자 조회
var setUserOfCsms = function(strCdId, strNmId, strArg, strGridId){

	tcpCommonInitOfCsms(strCdId, strNmId, strArg, strGridId);
	strNmClearOfCsms(strCdId, strNmId, strGridId);
	tcpCommonSearchOfCsms('',//{userId : parentCdValOfCsms, userNm : parentNmVal},
			        'tango-transmission-biz/transmission/constructprocess/safemgmt/users',
			        'users');
}

//공통팝업 변수선언
function tcpCommonInitOfCsms(strCdId, strNmId, strArg, strGridId){

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
function tcpCommonSearchOfCsms(strParam, strUrl, strFlag){

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
	}).done(function(response){successCallbackTcpCommonOfCsms(response, strFlag, strParam);})
	  .fail(function(response){failCallbackTcpCommonOfCsms(response, strFlag);});
}

//코드값 클리어시 코드명 클리어 (그리드가 아닌 경우에만 적용)
function strNmClearOfCsms(strCd, strNm, strGrid){

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

//request 성공시
function successCallbackTcpCommonOfCsms(response, flag, strParam){

	if(flag == 'users'){

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
		        url: '/tango-transmission-web/constructprocess/safemgmt/UserCommonOfCsms.do',
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
		
	}
}

//request 실패시.
function failCallbackTcpCommonOfCsms(response, flag){
	if(flag == 'users'){
		//alert('사용자 조회실패');
	}
}
/** ************************************************************************ */