/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var commtsoMain = $a.page(function() {
	var gridId = 'dataGrid';
	var paramData = null;

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setEventListener();
		$('#mtsoMainLkupArea').setData(param);

		var searchGubun = $("input:checkbox[id=searchGubun]").is(":checked") ? true : false;
		var tmpSearch = "N";
		if (searchGubun) {
			tmpSearch = "Y";
		}
		var mtsoId = $("#mtsoId").val();
		var param = {mtsoId : mtsoId, searchGubun : tmpSearch};

		$('#tT').progress();
		$('#tA').progress();
		$('#tLn').progress();
		$('#tLnn').progress();
		$('#tS').progress();

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoteqpcnt', param, 'GET', 'teqpcnt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoaeqpcnt', param, 'GET', 'aeqpcnt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsofcltcnt', param, 'GET', 'fcltcnt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsosvlncnt', param, 'GET', 'svlncnt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsolinecnt', param, 'GET', 'linecnt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoseqpcnt', param, 'GET', 'seqpcnt');
		$('#'+gridId).alopexGrid('showProgress');

		param.pageNo = 1;
		param.rowPerPage = 100;

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsodistance', param, 'GET', 'distancecnt');
		//$('.comifrmPop').progress().remove();
		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#mtsoMainLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {
	        $('#'+gridId).alopexGrid({
				width : 'parent',
				height : '5row',
				fitTableWidth : true,
				autoColumnIndex : true,
				numberingColumnFromZero : false,
				pager : true,
				paging : {
					pagerTotal: true,
				},
				rowSelectOption : {
					clickSelect : true,
					singleSelect : true,
					disableSelectByKey : true
				},
				defaultColumnMapping : {
					resizing : true,
				},
				columnMapping : [
					{align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },
					{ key : 'mtsoDistance', align:'center', title : "거리", width: '50px'},
					//{ key : 'tmofNm', align:'center', title : "전송실", width: '140px'},
					//{ key : 'mtsoId', align:'center', title : "국사ID", width: '110px'},
					{ key : 'mtsoNm', align:'left', title : "국사", width: '220px'},
					{ key : 'mtsoTyp', align:'center', title : "유형", width: '70px'},
					{ key : 'mtsoStat', align:'center', title : "상태", width: '50px'},

					{ key : 'bldAddr', align:'left', title : "주소", width: '200px'},
					{ key : 'bldBlkNm', align:'center', title : "건물", width: '100px'},
					{ key : 'bldblkNo', align:'center', title : "층", width: '50px'},
					{ key : 'tnetEqpCnt', align:'center', title : "T망장비", width: '70px'},
					{ key : 'anetEqpCnt', align:'center', title : "A망장비", width: '70px'},

					mtsoId
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
			});

	}

	function setEventListener() {
		$('#searchGubun').on('change', function(e) {

			var searchGubun = $("input:checkbox[id=searchGubun]").is(":checked") ? true : false;
			var tmpSearch = "N";
			if (searchGubun) {
				tmpSearch = "Y";
			}
			var mtsoId = $("#mtsoId").val();
			var param = {mtsoId : mtsoId, searchGubun : tmpSearch};

			$('#tT').progress();
			$('#tA').progress();
			$('#tLn').progress();
			$('#tLnn').progress();
			$('#tS').progress();

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoteqpcnt', param, 'GET', 'teqpcnt');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoaeqpcnt', param, 'GET', 'aeqpcnt');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsofcltcnt', param, 'GET', 'fcltcnt');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsosvlncnt', param, 'GET', 'svlncnt');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsolinecnt', param, 'GET', 'linecnt');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoseqpcnt', param, 'GET', 'seqpcnt');

		 });

		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			commtsoMain.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			commtsoMain.setGrid(1, eObj.perPage);
		});

		$('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	if (dataObj.mtsoId != undefined && dataObj.mtsoId != null && dataObj.mtsoId != "") {
     	 		var data = {mtsoEqpGubun : "0", mtsoEqpId : dataObj.mtsoId, mtsoEqpNm : dataObj.mtsoNm}; // mtsoEqpGubun : 0(국사), 1(장비)
        		parent.top.comMain.popURL(data);
     	 	}
     	});
	};

	this.setGrid = function(page, rowPerPage){

		var mtsoId =  $("#mtsoId").val();
		var data = {mtsoId : mtsoId, pageNo : page, rowPerPage : rowPerPage};
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsodistance', param, 'GET', 'distancecnt');
	}

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'teqpcnt'){
			$('#mtsoMainLkupArea').setData(response.teqp[0]);
			$('#tT').progress().remove();
		}
		if(flag == 'aeqpcnt'){
			$('#mtsoMainLkupArea').setData(response.aeqp[0]);
			$('#tA').progress().remove();
		}
		if(flag == 'fcltcnt'){
			$('#mtsoMainLkupArea').setData(response.fcltlnst[0]);
		}
		if(flag == 'svlncnt'){
			$('#mtsoMainLkupArea').setData(response.svln[0]);
			$('#tLn').progress().remove();
		}
		if(flag == 'linecnt'){
			$('#mtsoMainLkupArea').setData(response.line[0]);
			$('#tLnn').progress().remove();
		}
		if(flag == 'seqpcnt'){
			$('#mtsoMainLkupArea').setData(response.seqp[0]);
			$('#tS').progress().remove();
		}
		if(flag == 'distancecnt'){
			$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.distance);
		}

	}
	//request 실패시.
	function failCallback(response, status, jqxhr, flag){

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