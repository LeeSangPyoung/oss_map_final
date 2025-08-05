/**
 * LdongInfoCommon.js
 *
 * @author P101670
 * @date 2016. 10. 05. 오후 13:10:03
 * @version 1.0
 */
$(document).ready(function() {
	//console.log("common.js loaded .. [$(document).ready()]");
});

/*
 * Function Name : selectSido
 * Description   : 건물정보 시도 셀렉트 박스
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectSido(objId,allYn) {
	var str = objId;

	Tango.ajax({
		url : 'tango-transmission-biz/leasemgmt/ldonginfomgmt/selectsidolist/',
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str, allYn);})
	  .fail(function(response){failJusoCallback(response, str, allYn);})
}



/*
 * Function Name : selectSgg
 * Description   : 건물정보 시군구 셀렉트 박스
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectSgg(objId, sidoNm, allYn) {
	
	var str = objId;
	var requestParam = { sidoNm : sidoNm };
	Tango.ajax({
		url : 'tango-transmission-biz/leasemgmt/ldonginfomgmt/selectsgglist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str, allYn);})
	  .fail(function(response){failJusoCallback(response, str, allYn);})
}

/*
 * Function Name : selectEmd
 * Description   : 건물정보 읍면동 셀렉트 박스
 * ----------------------------------------------------------------------------------------------------
 * objId         : Element ID
 * allYn         : option '전체' 생성 여부
 * selectedValue : 선택될 초기값
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function selectEmd(objId, sidoNm, sggNm) {
	var str = objId;
	var requestParam = { sidoNm : sidoNm , sggNm : sggNm};
	Tango.ajax({
		url : 'tango-transmission-biz/leasemgmt/ldonginfomgmt/selectemdlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
}


function successJusoCallback(response, objId, allYn){
	$('#' + objId).setData({
		data : response.list,
		//option_selected : ( selectedValue == null ? null : selectedValue ) // 최초 선택값 설정
	});
	if(allYn == 'Y' ){
		$('#' + objId).prepend('<option value="">전체</option>');
	}else{
		$('#' + objId).prepend('<option value="">선택</option>');
	}
	$('#' + objId).setSelected("");
	
}


function failJusoCallback(serviceId, response, flag){
	//alert('실패');
}




var showProgress = function(grid){
	$('#'+grid).alopexGrid('showProgress');
};

var hideProgress = function(grid){
	$('#'+grid).alopexGrid('hideProgress');
};