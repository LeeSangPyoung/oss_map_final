/**
 * common.js
 *
 * @author P095781
 * @date 2016. 8. 09. 오후 13:10:03
 * @version 1.0
 */

var searchSidoFlag = false;
var searchSggFlag = false;
var searchEmdFlag = false;

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
function selectSido(objId) {
	var str = objId;

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sidolist/',
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
}

function selectFilterSido(objId, bonbu) {
	var str = objId;
	var requestParam = { bonbu : bonbu };
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sidolist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
}

function selectFilterSidobySKB(objId, bonbu, bSKT) {
	var str = objId;
	var requestParam = { bonbu : bonbu,
						 bSKT : bSKT};
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sidolist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
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
function selectSgg(objId, sidoNm) {
	var str = objId;
	var requestParam = { sidoNm : sidoNm };
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sgglist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
}

function selectSggbySKB(objId, bonbu, sidoNm, bSKT) {
	var str = objId;
	var requestParam = { bonbu : bonbu, sidoNm : sidoNm, bSKT : bSKT};
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sgglist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
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
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/emdlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
}

function selectEmdbySKB(objId, bonbu, sidoNm, sggNm, bSKT) {
	var str = objId;
	var requestParam = { bonbu : bonbu, sidoNm : sidoNm , sggNm : sggNm, bSKT : bSKT};
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/emdlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successJusoCallback(response, str);})
	  .fail(function(response){failJusoCallback(response, str);})
}

function selectSearchSido(objId, selectedValue, flag) {
	var str = objId;

	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sidolist/',
		method : 'GET'
	}).done(function(response){successSearchJusoCallback(response, str, selectedValue);})
	  .fail(function(response){failSearchJusoCallback(response, str, selectedValue);})
}

function selectSearchSgg(objId, sidoNm, selectedValue, flag) {
	var str = objId;
	var requestParam = { sidoNm : sidoNm };
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/sgglist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successSearchJusoCallback(response, str, selectedValue);})
	  .fail(function(response){failSearchJusoCallback(response, str, selectedValue);})
}

function selectSearchEmd(objId, sidoNm, sggNm, selectedValue, flag) {
	var str = objId;
	var requestParam = { sidoNm : sidoNm , sggNm : sggNm};
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/emdlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successSearchJusoCallback(response, str, selectedValue);})
	  .fail(function(response){failSearchJusoCallback(response, str, selectedValue);})
}

function successJusoCallback(response, objId){
	$('#' + objId).setData({
		data : response.list,
		//option_selected : ( selectedValue == null ? null : selectedValue ) // 최초 선택값 설정
	});
	
	$('#' + objId).prepend('<option value="">전체</option>');
	$('#' + objId).setSelected("");
}

function failJusoCallback(serviceId, response, flag){
	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
}

function successSearchJusoCallback(response, objId, selectedValue, flag){
	$('#' + objId).setData({
		data : response.list,
		//option_selected : ( selectedValue == null ? null : selectedValue ) // 최초 선택값 설정
	});
	
	$('#' + objId).prepend('<option value="">전체</option>');
	$('#' + objId).setSelected(selectedValue);
	
	if(objId == "sidoNm") {
		searchSidoFlag = true;
	}
	else if(objId == "sggNm") {
		searchSggFlag = true;
	}
	else if(objId == "emdNm") {
		searchEmdFlag = true;
	}
}

function failSearchJusoCallback(serviceId, response, flag){
	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
}

var showProgress = function(grid){
	$('#'+grid).alopexGrid('showProgress');
};

var hideProgress = function(grid){
	$('#'+grid).alopexGrid('hideProgress');
};