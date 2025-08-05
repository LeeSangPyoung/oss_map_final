/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 09. 25.
 * @version 1.0
 */
const publicMtsoInfHideCol 	= [];
var comMain = $a.page(function() {

	var invtParam = "";
	var perPage = 100000;

	this.init = function(id, param) {
		setSelectCode();
		setEventListener();

		var pageGubun = 'fctinvt';
		var adtnAttrVal = $('#adtnAttrVal').val();
		if(adtnAttrVal.indexOf('CM_FCT_MGMT') == -1){									// 부대설비 역할 그룹
			$('#btnAfePop').css('display','none');
    	}

	};

//	this.getAfeYrPop = function() {
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'seachAfeYrInf');
//	};

	function setSelectCode() {
		var param = {supCd : 'T10000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'seachDemdHdofcCd');		// 본사 코드
		var option_data = [{cd: '', cdNm: '전체'}];
		$('#demdAreaCd').setData({ data : option_data, option_selected: '' });

		var option_data = [{cd: '', cdNm: '전체'},{cd: 'Y', cdNm: '도심'},{cd: 'N', cdNm: '외곽'}];
		$('#dntnYn').setData({ data : option_data, option_selected: '' });

//		var option_data = [{cd: '', cdNm: '선택'}];
//		$('#afeDgr').setData({ data : option_data, option_selected: '' });
		var param = {grpCd : 'UM000001', mtsoInvtItmVal : 'dsnEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'mtsoInfHideCol');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'seachAfeYrInf'); 			// AFE 년도
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LARACD', null, 'GET', 'seachLaraCd');		// 권역


//clsDivCd
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getClsDivCd', param, 'GET', 'clsDivCd');
	}


	function setEventListener() {

		$('#btnAfePop').on('click', function(e) {

			$a.popup({
				popid: 'AfeLkup',
				title: 'AFE별 차수 관리',
				url: '/tango-transmission-web/configmgmt/mtsoinvt/AfeMgmtPop.do?pageGubun=fctinvt',
				modal: true,
				movable:true,
				windowpopup : true,
				width : 370,
				height : 550,
				callback : function(data) {

				}
			});
		});


		// 본사코드
		$('#demdHdofcCd').on('change', function(e) {
			var supCd = $("#demdHdofcCd").val();
			var param = {supCd : supCd}
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'seachDemdAreaCd'); 	// 지역 코드
		});

		$('#afeYr').on('change', function(e) {
			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', param, 'GET', 'seachDgrInf'); // 차수별 컬럼 정의
		});


		//조회
		$('#btnSearch').on('click', function(e) {
			var idx  = $('#basicTabs').getCurrentTabIndex();
	    	switch (idx) {
		    	case 0 :
		    		mtsoInf.setGrid(1,perPage);
					break;
		    	case 1 :
		    		imptEqpInf.setGrid(1,perPage);
					break;
		    	case 2 :
		    		imptFctInf.setGrid(1,perPage);
					break;
		    	case 3 :
		    		adtnFctInf.setGrid(1,perPage);
					break;
		    	case 4 :
		    		elctyCstrInf.setGrid(1,perPage);
					break;
				case 5 :
					byUserCurst.setGrid(1,perPage);
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
					break;
				case 1 :
					$('#imptEqpInfDataGrid').alopexGrid("viewUpdate");
					break;
				case 2 :
					$('#imptFctInfDataGrid').alopexGrid("viewUpdate");
					break;
				case 3 :
					$('#adtnFctInfDataGrid').alopexGrid("viewUpdate");
					break;
				case 4 :
					$('#elctyCstrInfDataGrid').alopexGrid("viewUpdate");
					break;
				case 5 :
					$('#byUserCurstDataGrid').alopexGrid("viewUpdate");
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

			if (event.keyCode != 46 && event.keyCode != 45) {
				return false;
			}
		}
		var _pattern = /^[-\]?\\d*[.]\d*$/;	// . 체크

		if(_pattern.test(_value)) {
			if(charCode == 46) {
				return false;
			}
		}

    	return true;
	});

	$(document).on('keyup', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which :event.keyCode;

		if (charCode ==8 || charCode == 46 || charCode == 37 || charCode ==39) {
			return;
		}
		else {
			//evt.target.value = evt.target.value.replace(/[^0-9\.]/g,"");

			var str = evt.target.value.replace(/[^-0-9\.]/g,"");

			if (str.lastIndexOf("-") > 0) {
				if (str.indexOf("-") == 0) {
					str = "-"+str.replace(/[-]/gi,'');
				} else {
					str = str.replace(/[-]/gi,'');
				}
			}
			evt.target.value = str;
		}
	});

	function successCallback(response, status, jqxhr, flag) {

		if(flag == 'seachAfeYrInf'){
			$('#afeYr').clear();
			var option_data = [];
			for(var i = 0; i < response.afeYrList.length; i++){
				var resObj = {cd : response.afeYrList[i].afeYr, cdNm : response.afeYrList[i].afeYr};
				option_data.push(resObj);
			}
			var nDate = new Date();
			var nYear = nDate.getFullYear().toString();
			$('#afeYr').setData({data : option_data, option_selected:nYear});

			var afeYr = $('#afeYr').val();

			var param = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', param, 'GET', 'seachDgrInf'); // 차수별 컬럼 정의

		}
		if(flag == 'seachDgrInf'){
			$('#afeDgr').clear();
			var option_data = [];
			for(var i = 0; i < response.afeDgrList.length; i++){
				var resObj = {cd : response.afeDgrList[i].afeDgr, cdNm : response.afeDgrList[i].afeDgr};
				option_data.push(resObj);
			}
			$('#afeDgr').setData({ data : option_data, option_selected: '' });


			// 년도 및 차수가 활성화 되지 않아 타이틀 정보를 가져 올수 없어 여기에서 처리해야 함.
			imptEqpInf.imptEqpInfGrid();
			imptFctInf.imptFctInfGrid();
			adtnFctInf.adtnFctInfGrid();
			elctyCstrInf.elctyCstrInfGrid();
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

