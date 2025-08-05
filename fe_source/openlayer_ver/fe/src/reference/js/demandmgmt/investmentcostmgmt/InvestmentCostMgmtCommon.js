/**
 * common.js
 *
 * @author P095781
 * @date 2016. 8. 09. 오후 13:10:03
 * @version 1.0
 */
$(document).ready(function() {
	//console.log("common.js loaded .. [$(document).ready()]");
});

function selectOrgListCode(objId) {
	var str = objId;
	var requestParam = { bizYr : "" };
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/orglist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successBizCallback(response, str);})
	  .fail(function(response){failBizCallback(response, str);})
}

function selectBizPurpCd(objId, bizYr) {
	var str = objId;
	var requestParam = { bizYr : bizYr };
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/bizpurplist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successBizCallback(response, str);})
	  .fail(function(response){failBizCallback(response, str);})
}

function selectBizDivCd(objId, bizYr, bizPurpCd) {
	var str = objId;
	var requestParam = { bizYr : bizYr , bizPurpCd : bizPurpCd};
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/bizdivlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successBizCallback(response, str);})
	  .fail(function(response){failBizCallback(response, str);})
}

function selectBizCd(obj1, obj2, param) {
	var str = { obj1 : obj1, obj2 : obj2};
	var param = param;
	var requestParam = { bizYr : param.bizYr };
	var flag = 'selectBizCd';
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/bizpurplist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successBizCallback(response, str, param, flag);})
	  .fail(function(response){failBizCallback(response, param);})
}

function selectBizDiv(objId, param) {
	var str = objId;
	var param = param;
	var requestParam = { bizYr : param.bizYr , bizPurpCd : param.bizPurpCd};
	var flag = 'selectBizDiv';
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/bizdivlist/',
		data : requestParam,
		method : 'GET'
	}).done(function(response){successBizCallback(response, str, param, flag);})
	  .fail(function(response){failBizCallback(response, str);})
}

function successBizCallback(response, str, param, flag){
	if(flag == 'selectBizCd'){
		$('#' + str.obj1).setData({
			data : response.list,
		});
	
		$('#' + str.obj1).prepend('<option value="">전체</option>');
		$('#' + str.obj1).setSelected(param.bizPurpCd);
		selectBizDiv(str.obj2, param);
	}else if(flag == 'selectBizDiv'){
		$('#' + str).setData({
			data : response.list,
		});
	
		$('#' + str).prepend('<option value="">전체</option>');
		$('#' + str).setSelected(param.bizDivCd);
		searchFlag = true;
		$('#search').trigger("click");
	}else{
		$('#' + str).setData({
			data : response.list,
		});
	
		$('#' + str).prepend('<option value="">전체</option>');
		$('#' + str).setSelected("");
	}
}

function failBizCallback(serviceId, response, flag){
	alertBox('W','조회 실패하였습니다.');
}