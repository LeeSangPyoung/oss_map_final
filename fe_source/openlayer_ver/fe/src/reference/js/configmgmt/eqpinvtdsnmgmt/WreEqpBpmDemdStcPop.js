
/**
 * WreEqpRvRsltObjPop.js
 *
 * @author P182022
 * @date 2022. 08. 23. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
	var gridModel 		= null;
	var gridId 		= 'gridData';

	//BPM 서비스명,장비방식 멀티
	var mDemdSvrNm		= [];
	var mCstrTyp		= [];
	var mDemdSvrLclNm	= [];
	var mDemdSvrMclNm	= [];
	var mEqpMeans		= [];

	var mAfeYrSel		= '';
	var mAfeDemdDgrSel	= '';

    this.init = function(id, param) {
//    	console.log("init param : ", param);
		mAfeYrSel		= param.afeYr;
		mAfeDemdDgrSel	= param.afeDemdDgr;

		setInitSelectCode();

    	setEventListener();
    	initGrid();

    };

    function setEventListener() {
    	// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
		});

		$('#btnSearch').on('click', function(e) {

			var sParam = $("#searchForm").getData();

			if($.TcpMsg.isEmpty(sParam.afeYr)){
				callMsgBox('btnMsgWarning','I', "년도를 선택해 주십시오.");
				return false;
			}
			if($.TcpMsg.isEmpty(sParam.afeDemdDgr)){
				callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
				return false;
			}


			sParam.demdSvrNms = getMultiSelect("demdSvrNms", "value");
			sParam.cstrTyps = getMultiSelect("cstrTyps", "value");
			sParam.demdSvrLclNms = getMultiSelect("demdSvrLclNms", "value");
			sParam.demdSvrMclNms = getMultiSelect("demdSvrMclNms", "value");
			sParam.eqpMeans = getMultiSelect("eqpMeans", "value");

//			console.log("sParam : ", sParam);
			$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getEqpBpmDemdStc', sParam, 'GET', 'search');

        });

        //AFE 차수
    	$("#afeYr").on("change", function(e) {
    		var areaYear = $("#afeYr").val();
        	if(areaYear == ''){
        		$("#afeDemdDgr").empty();
    			$("#afeDemdDgr").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr").setSelected("");

    			$("#demdSvrNms").empty();
    			$("#demdSvrNms").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#demdSvrNms").setSelected("");

    			$("#cstrTyps").empty();
    			$("#cstrTyps").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#cstrTyps").setSelected("");

    			$("#demdSvrLclNms").empty();
    			$("#demdSvrLclNms").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#demdSvrLclNms").setSelected("");

    			$("#demdSvrMclNms").empty();
    			$("#demdSvrMclNms").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#demdSvrMclNms").setSelected("");

    			$("#eqpMeans").empty();
    			$("#eqpMeans").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#eqpMeans").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};
	        	selectAfeDemdDgrCode('afeDemdDgr', dataParam);
        	}
    	});

    	$("#afeDemdDgr").on("change", function(e) {
    		setSelectCode();
    	});

    	// 서비스명 멀티선택
    	$('#demdSvrNms').multiselect({
    		open: function(e){
    		},
    		beforeclose: function(e){
    		},
    		close: function(e){
    		}
    	});

    	//공사유형
    	$('#cstrTyps').multiselect({
    		open: function(e){
    		},
    		beforeclose: function(e){
    		},
    		close: function(e){
    		}
    	});

    	//서비스대분류
    	$('#demdSvrLclNms').multiselect({
    		open: function(e){
    		},
    		beforeclose: function(e){
    		},
    		close: function(e){
    			var selSvrLclNmVal = (getMultiSelect("demdSvrLclNms", "value") == "") ? "X" : getMultiSelect("demdSvrLclNms", "value");
				var initParam = {
						afeYr : $("#afeYr").val(),
						afeDemdDgr : $("#afeDemdDgr").val(),
						srchDemdSvrLclNm : selSvrLclNmVal
				};
//				console.log("demdSvrLclNms : ", initParam);
				//서비스 중분류
				selectSmCode('demdSvrMclNms', initParam);
    		}
    	});

    	//서비스중분류
    	$('#demdSvrMclNms').multiselect({
    		open: function(e){
    		},
    		beforeclose: function(e){
    		},
    		close: function(e){
    		}
    	});

		// 장비방식 멀티선택
		$('#eqpMeans').multiselect({
	 		 open: function(e){
	 		 },
	 		 beforeclose: function(e){
	 		 },
	 		 close: function(e){
	 		 }
	 	 });

		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = '유선망통합설계[BPM수요통계]_'+dayTime;
        	var worker = new ExcelWorker({
        		excelFileName : excelFileNm,
        		sheetList:[{
        			sheetName : 'BPM수요통계',
        			$grid: $('#'+gridId)
        		}]
        	});
        	worker.export({
        		merge: true,
        		exportHidden: false,
        		filtered: false,
        		useGridColumnWidth : true,
        		border: true,
        		exportGroupSummary:true,
        		exportFooter: true,
        		callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
        	});
		});
 	}

    function setInitSelectCode() {

    	var initParam = {
    			afeYr : mAfeYrSel,
    			afeDemdDgr : mAfeDemdDgrSel
    	};

    	//AFE 연차
    	selectAfeYrCode('afeYr');

    	//서비스명
    	selectSnCode('demdSvrNms', initParam);
    	//공사유형
    	selectCtCode('cstrTyps', initParam);
    	//서비스 대분류
    	selectSlCode('demdSvrLclNms', initParam);
    	//장비방식
    	selectEmCode('eqpMeans', initParam);

	}

    function setSelectCode() {

    	var option_data =  [];
    	$('#demdSvrMclNms').setData({data:option_data});

    	var initParam = {
    			afeYr : $("#afeYr").val(),
    			afeDemdDgr : $("#afeDemdDgr").val()
    	};

    	//서비스명
    	selectSnCode('demdSvrNms', initParam);
    	//공사유형
    	selectCtCode('cstrTyps', initParam);
    	//서비스 대분류
    	selectSlCode('demdSvrLclNms', initParam);
    	//장비방식
    	selectEmCode('eqpMeans', initParam);

    }

    // AFE 년차
    function selectAfeYrCode(objId) {
    	var param = {};
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', param, 'GET', objId);
	}

    // AFE 수요회차
    function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
	}

    //서비스명
    function selectSnCode(objId, param){
    	param.cdDiv = "SN";

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    //공사유형
    function selectCtCode(objId, param){
    	param.cdDiv = "CT";

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    //서비스 대분류
    function selectSlCode(objId, param){
    	param.cdDiv = "SL";

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    //서비스 중분류
    function selectSmCode(objId, param){
    	param.cdDiv = "SM";

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    //장비
    function selectEmCode(objId, param){
    	param.cdDiv = "EM";

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    function getMultiSelect(objId, gbn){
    	var selVal = "";
    	var selText = "";
    	$('#'+objId+' option:selected').each(function(i){
    		var $this = $(this);
    		if($this.length){
    			if(i == 0){
    				selVal = $this.val();
    				selText = $this.text();
    			}else{
    				selVal = selVal.concat(","+$this.val());
    				selText = selText.concat(","+$this.text());
    			}
    		}
    	});

    	if("text" == gbn){
    		return selText;
    	}else if("value" == gbn){
    		return selVal;
    	}
    }

	// 그리드 초기화
    function initGrid() {
		//
    	$('#'+gridId).alopexGrid({
    		paging : {
    			pagerSelect: false
    			,hidePageList: true  // pager 중앙 삭제
    		},
			grouping:{
				useGrouping: true,
				by: ['demdSvrLclNm', 'demdSvrMclNm', 'eqpMean'],
				useGroupRowspan: true,
				useGroupRearrange: true,
				groupRowspanMode : 1
			},

    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : false
    		},
    		message:{
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>",
				filterNodata: configMsgArray['noData']
			},
    		columnMapping: [
				  { key : 'demdSvrLclNm', title: '서비스대분류', align:'center', width:'120px', rowspan:true},
				  { key : 'demdSvrMclNm', title: '서비스중분류', align:'center', width:'90px', rowspan:true},
				  { key : 'eqpMean', title: '장비방식', align:'center', width:'100px', rowspan:true},
				  { key : 'hdofcCnt1', title: '수도권', align:'right', width:'120px', render: {type:"string", rule : "comma"}},
				  { key : 'hdofcCnt2', title: '부산', align:'right', width:'100px', render: {type:"string", rule : "comma"}},
				  { key : 'hdofcCnt3', title: '대구', align:'right', width:'80px', render: {type:"string", rule : "comma"}},
				  { key : 'hdofcCnt4', title: '서부', align:'right', width:'80px', render: {type:"string", rule : "comma"}},
				  { key : 'hdofcCnt5', title: '중부', align:'right', width:'80px', render: {type:"string", rule : "comma"}},
				  { key : 'totSum', title: '총합계', align:'right', width:'90px', render: {type:"string", rule : "comma"}
					  , value: function(value, data){ return (Number(data.hdofcCnt1) + Number(data.hdofcCnt2) + Number(data.hdofcCnt3) + Number(data.hdofcCnt4) + Number(data.hdofcCnt5)); }
				  }
     		],
     		footerRowHeight:25,
     		footer: {
         		  position: "bottom"
         	 	, footerMapping : [
         			  { columnIndex: 0, colspan: true, title: '총합계', align: 'center', colspan: 3}
         			, { columnIndex: 3, key: 'totHdofcCnt1', render:'sum(3)', align: 'right'}
         			, { columnIndex: 4, key: 'totHdofcCnt2', render:'sum(4)', align: 'right'}
         			, { columnIndex: 5, key: 'totHdofcCnt3', render:'sum(5)', align: 'right'}
         			, { columnIndex: 6, key: 'totHdofcCnt4', render:'sum(6)', align: 'right'}
         			, { columnIndex: 7, key: 'totHdofcCnt5', render:'sum(7)', align: 'right'}
         			, { columnIndex: 8, key: 'totSum', render:'sum(8)', align: 'right'}
	  			 ]
	      	}
        });
    }

    //request 호출
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    //request 성공시.
	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			case 'afeYr':
				$('#'+flag).clear();
				var option_data =  [];
				var stdAfeYr = "";
				var paramAfeYr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeYrSel) {
						paramAfeYr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}
				if (paramAfeYr.length > 0) {
					selectId = paramAfeYr;
				}else {
					selectId = stdAfeYr;
				}
				$('#'+flag).setData({data:option_data,afeYr:selectId});

				selectAfeDemdDgrCode('afeDemdDgr', {afeYr:selectId});
				break;
			case 'afeDemdDgr':
				$('#'+flag).clear();
				var stdDemdDgr = "";
				var paramDemdDgr = "";
				var selectId = null;
				var option_data =  [];
//				console.log("afeDemdDgr respose : ", JSON.stringify(response));
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeDemdDgrSel) {
						paramDemdDgr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdDemdDgr = response[i].cd;
					}
				}
				if (paramDemdDgr.length > 0) {
					selectId = paramDemdDgr;
				}else {
					selectId = stdDemdDgr;
				}
				$('#'+flag).setData({data:option_data,afeDemdDgr:selectId});

				setSelectCode();
				break;
			case 'demdSvrNms':
				$('#'+flag).clear();
				var stdAfeYr = "";
				var option_data =  [];
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});
				break;
			case 'cstrTyps':
				$('#'+flag).clear();
				var option_data =  [];
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});
				break;
			case 'demdSvrLclNms':
				$('#'+flag).clear();
				var option_data =  [];
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});
				break;
			case 'demdSvrMclNms':
				$('#'+flag).clear();
				var option_data =  [];
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});
				break;
			case 'eqpMeans':
				$('#'+flag).clear();
				var option_data =  [];
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});
				break;
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
				setGrid(gridId, response, response.dataList);
				break;
		}
    }


    //Grid에 Row출력
    function setGrid(GridID,Option,Data) {
    	$('#'+GridID).alopexGrid('dataSet', Data, '');
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "search":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/

	// 파일다운로드 실행
	function lpad(value, length) {
		var strValue = '';
		if (value) {
			if (typeof value === 'number') {
				strValue = String(value);
			}
		}

		var result = '';
		for (var i = strValue.length; i < length; i++) {
			result += strValue;
		}

		return result + strValue;
	}

});