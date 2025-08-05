/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */

const publicAfeDgr 			= [];
const publicHideCol 		= [];
const publicAfeG5EtcHideCol = [];

const publicMtsoInfHideCol 	= [];
const publicLandBldHideCol 	= [];
const publicEndHideCol 		= [];
const publicIntgHideCol 	= [];
const publicEtcDsnHideCol	= [];
const publicEtcAfeDsnHideCol	= [];

var comMain = $a.page(function() {

	var invtParam = "";
	var perPage = 100000;

	this.init = function(id, param) {
		setSelectCode();
		setEventListener();
	};

	this.getAfeYrPop = function() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'seachAfeYrInf');
	};

	Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};

	Number.prototype.zf = function(len){return prependZeor(this, len);};
	function prependZeor(num, len) {
		while(num.toString().length < len) {
			num = "0"+num;
		}
		return num;
	}

	function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}

	function setSelectCode() {


		var option_data =  [];
		for(var i=0; i < 24; i++){
			var tmpH =  NumberPad(i, 2);
			var resObj = {cd:tmpH, cdNm : tmpH};
			option_data.push(resObj);
		}
		$('#srchHh').setData({ data:option_data });
		$("#srchHh").val("23");

		var option_data =  [];
		for(var i=0; i < 60; i++){
			var tmpM =  NumberPad(i, 2);
			var resObj = {cd:tmpM, cdNm : tmpM};
			option_data.push(resObj);
		}
		$('#srchMi').setData({ data:option_data });
		$("#srchMi").val("59");



		var srchDt = new Date().format("yyyy-MM-dd").toString();
		$("#srchDt").val(srchDt);
		$("#srchHh").val("23");
		$("#srchMi").val("59");
		//$("#srchEndDtm").val($("#srchEndDt").val() + " " + $("#srchEndHh").val() + ":" + $("#srchEndMi").val() + ":59");


		var param = {supCd : 'T10000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'seachDemdHdofcCd');		// 본사 코드
		var option_data = [{cd: '', cdNm: '전체'}];
		$('#demdAreaCd').setData({ data : option_data, option_selected: '' });

		var option_data = [{cd: '', cdNm: '전체'},{cd: 'Y', cdNm: '도심'},{cd: 'N', cdNm: '외곽'}];
		$('#dntnYn').setData({ data : option_data, option_selected: '' });

		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'seachAfeYrInf'); 			// AFE 년도
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LARACD', null, 'GET', 'seachLaraCd');		// 권역
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/NEWYNCD', null, 'GET', 'newExstDivCd');		// 신규/기존여부

		var param = {grpCd : 'UM000001', mtsoInvtItmVal : 'dsnEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'mtsoInfHideCol');
		var param = {grpCd : 'UM000002', mtsoInvtItmVal : 'landEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'landBldHideCol');

		var param = {grpCd : 'UM000003', mtsoInvtItmVal : 'etcEqp'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'g5AfeHideCol');
		var param = {grpCd : 'UM000004', mtsoInvtItmVal : 'afeDgrEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'afeDgrEtcHideVal');

		var param = {grpCd : 'UM000005', mtsoInvtItmVal : 'intgEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'intgHideCol');
		var param = {grpCd : 'UM000006', mtsoInvtItmVal : 'endEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'endHideCol');
	}


	function setEventListener() {
		// 본사코드
		$('#demdHdofcCd').on('change', function(e) {
			var supCd = $("#demdHdofcCd").val();
			var param = {supCd : supCd}
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'seachDemdAreaCd'); 	// 지역 코드
		});

		$('#afeYr').on('change', function(e) {
			var afeYr = $("#afeYr").val();
	    	var paramData = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', paramData, 'GET', 'pAfeDgr'); // 차수별 컬럼 정의
		});


		//조회
		$('#btnSearch').on('click', function(e) {
			var idx  = $('#basicTabs').getCurrentTabIndex();
	    	switch (idx) {
		    	case 0 :
		    		mtsoInf.setGrid(1,perPage);
					break;
		    	case 1 :
		    		landBldInf.setGrid(1,perPage);
					break;

		    	case 2 :

//		    		var afeYr = $("#afeYr").val();
//			    	var paramData = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
//			    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', paramData, 'GET', 'pAfeDgr'); // 차수별 컬럼 정의
		    		g5AfeDsn.gridColSetupG5AfeDsn();
		    		g5AfeDsn.setGrid(1,perPage);
					break;

		    	case 3 :

//		    		var afeYr = $("#afeYr").val();
//			    	var paramData = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
//			    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', paramData, 'GET', 'pAfeDgr'); // 차수별 컬럼 정의
		    		byAfeMtso.gridColSetupByAfeMtsoInvtDsn();
					byAfeMtso.setGrid(1,perPage);
					break;
		    	case 4 :
		    		InvtIntgPlan.setGrid(1,perPage);
					break;

				case 5 :
					g5EndDsn.setGrid(1,perPage);
					break;
				default :
					break;
			}
		});
		//엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				//ifrmCall();
			}
		});

		$('#basicTabs').on("tabchange", function(e, index) {
	   		 switch (index) {
				case 0 :
					$('#mtsoInfDataGrid').alopexGrid("viewUpdate");
					$('#submtsoInfDataGrid').alopexGrid("viewUpdate");
					break;
				case 1 :
					$('#landBldDataGrid').alopexGrid("viewUpdate");
					$('#sublandBldDataGrid').alopexGrid("viewUpdate");
					break;
				case 2 :
					$('#g5AfeDsnDataGrid').alopexGrid("viewUpdate");
					$('#g5InfGrid').alopexGrid("viewUpdate");
					$('#g5DtlGrid').alopexGrid("viewUpdate");

					break;
				case 3 :
					$('#byAfeMtsoDataGrid').alopexGrid("viewUpdate");

					$('#byAfeInfGridId').alopexGrid("viewUpdate");
					$('#byAfeDtlGridId').alopexGrid("viewUpdate");


					break;
				case 4 :
					$('#invtIntgDataGrid').alopexGrid("viewUpdate");
					$('#subinvtIntgDataGrid').alopexGrid("viewUpdate");
					break;
				case 5 :
					$('#g5EndDataGrid').alopexGrid("viewUpdate");
					$('#subg5EndDataGrid').alopexGrid("viewUpdate");
					break;
				default :
					break;
			}
    	});
	};

	this.setComma = function(str) {
		str = String(str);
		return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}

    $(document).on('keypress', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
    	var _value = $(this).val();
		if (event.keyCode < 48 || event.keyCode > 57) {
			if (event.keyCode != 46) {
				return false;
			}
		}
		var _pattern = /^\d*[.]\d*$/;	// . 체크
		if(_pattern.test(_value)) {
			if(charCode == 46) {
				return false;
			}
		}

		var _pattern1 = /^\d*[.]\d{3}$/;	// 소수점 3자리까지만
		if(_pattern1.test(_value)) {
			return false;
		}
    	return true;
	});

	$(document).on('keyup', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which :event.keyCode;
		if (charCode ==8 || charCode == 46 || charCode == 37 || charCode ==39) {
			return;
		}
		else {
			evt.target.value = evt.target.value.replace(/[^0-9\.]/g,"");
		}
	});

	function successCallback(response, status, jqxhr, flag) {

		if(flag == 'seachAfeYrInf'){
			$('#afeYr').clear();
			var option_data = [];
			for(var i = 0; i < response.afeYrList.length; i++){
				var resObj = {cd : response.afeYrList[i].afeYr, cdNm : response.afeYrList[i].afeYr+"년도"};
				option_data.push(resObj);
			}
			var nDate = new Date();
			var nYear = nDate.getFullYear().toString();
			$('#afeYr').setData({data : option_data, option_selected:nYear});

			var afeYr = $("#afeYr").val();
	    	var paramData = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', paramData, 'GET', 'pAfeDgr'); // 차수별 컬럼 정의
		}
		if(flag == 'pAfeDgr'){
			publicAfeDgr.length = 0;
			for(i = 0; i < response.afeDgrList.length; i++) {
				var afeYr 	= response.afeDgrList[i].afeYr;
				var afeDgr  = response.afeDgrList[i].afeDgr;
				var afeDgrData = {afeYr : afeYr, afeDgr : afeDgr};
				publicAfeDgr.push(afeDgrData);
			}

			var param = {grpCd : 'UM000003', mtsoInvtItmVal : 'etcEqp'}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'g5AfeHideCol');

			var param = {grpCd : 'UM000004', mtsoInvtItmVal : 'afeDgrEtcColVal'}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'afeDgrEtcHideVal');
		}

		if(flag == 'g5AfeHideCol'){
			publicHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal.replace('etc','Etc');
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicHideCol.push(hideData);
			}

			var param = {grpCd : 'UM000003', mtsoInvtItmVal : 'afeG5EtcColVal'}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'g5AfeG5EtcHideVal');

			//g5AfeDsn.gridColSetupG5AfeDsn();
		}

		if(flag == 'g5AfeG5EtcHideVal'){
			publicAfeG5EtcHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicAfeG5EtcHideCol.push(hideData);
			}
			g5AfeDsn.gridColSetupG5AfeDsn();
		}

		if(flag == 'mtsoInfHideCol'){
			publicMtsoInfHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicMtsoInfHideCol.push(hideData);
			}
			mtsoInf.mtosInfInitGrid();
		}

		if(flag == 'landBldHideCol'){
			publicLandBldHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicLandBldHideCol.push(hideData);
			}
			landBldInf.landBldInitGrid();
		}
		if(flag == 'endHideCol'){
			publicEndHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicEndHideCol.push(hideData);
			}
			g5EndDsn.g5EndDsnInitGrid();
		}

		if(flag == 'intgHideCol'){
			publicIntgHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicIntgHideCol.push(hideData);
			}
			InvtIntgPlan.invtIntgInitGrid();
		}


		if(flag == 'afeDgrEtcHideVal'){
			publicEtcDsnHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicEtcDsnHideCol.push(hideData);
			}
			var param = {grpCd : 'UM000004', mtsoInvtItmVal : 'afeDsnEtcColVal'}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'afeDsnEtcHideVal');
		}

		if(flag == 'afeDsnEtcHideVal'){
			publicEtcAfeDsnHideCol.length 		= 0;
			for(i = 0; i < response.menuHidYn.length; i++) {
				var mtsoInvtItmVal 		= response.menuHidYn[i].mtsoInvtItmVal;
				var mtsoInvtItmNm  		= response.menuHidYn[i].mtsoInvtItmNm;
				var mtsoInvtItmHidYn	= response.menuHidYn[i].mtsoInvtItmHidYn;
				var hideData = {mtsoInvtItmVal : mtsoInvtItmVal, mtsoInvtItmNm : mtsoInvtItmNm, mtsoInvtItmHidYn : mtsoInvtItmHidYn};
				publicEtcAfeDsnHideCol.push(hideData);
			}
			byAfeMtso.gridColSetupByAfeMtsoInvtDsn();
		}


		if(flag == 'seachDemdHdofcCd'){
			$('#demdHdofcCd').clear();
			//step1Cd = [];
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdHdofcCd').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'seachDemdAreaCd'){
			$('#demdAreaCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdAreaCd').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'seachLaraCd'){
			$('#laraCd').clear();
			//step1Cd = [];
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = {cd : response[i].comCd, cdNm : response[i].comCdNm};
				option_data.push(resObj);
			}
			$('#laraCd').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'newExstDivCd'){
			$('#newExstDivCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = {cd : response[i].comCd, cdNm : response[i].comCdNm};
				option_data.push(resObj);
			}
			$('#newExstDivCd').setData({ data : option_data, option_selected: '' });

		}

	}

	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){

		}
	}

	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}
});

