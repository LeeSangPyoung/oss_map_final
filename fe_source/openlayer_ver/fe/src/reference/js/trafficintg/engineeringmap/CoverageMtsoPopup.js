/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
$a.page(function() {

	let gridId = 'dataGrid';
	let paramData;

	let popTitle = '';

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	popTitle = param.mtsoNm + " - " + param.coverageTypCd
    	$('#title').html(popTitle);

    	initGrid();
        setEventListener();
        getMtsoListWithinCoverage();
    };

    function initGrid() {

    	var headerMappingN =  [
    		{fromIndex:0, toIndex:10, title:"커버리지 국사 정보"},
    		{fromIndex:'mtsoNm', toIndex:'mtsoLkupIcon', title:"국사명", hideSubTitle:true},
 	        {fromIndex:11, toIndex:18, title:"ERP 정보"}
  		];

    	$('#'+gridId).alopexGrid({
    		paging : {
    			pagerSelect: false
    			,hidePageList: true  // pager 중앙 삭제
    		},
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		height: function(gridHTMLElement){ return $(gridHTMLElement).parent().height(); },
    		message:{
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>",
				filterNodata: configMsgArray['noData']
			},
			renderMapping:{
				"mtsoLkupIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				}
			},
			headerGroup : headerMappingN,

    		columnMapping: [
				  { key : 'mtsoNm', title: '국사명', align:'center', width:'100px'},
				  { key : 'mtsoLkupIcon', width : '30px', align : 'center', editable : false, render : {type:'mtsoLkupIcon'}, resizing: false},
				  { key : 'dist', title: '거리(M)', align:'center', width:'60px'},
				  { key : 'mtsoTypNm', title: '국사유형', align:'center', width:'60px'},
				  { key : 'mtsoStatNm', title: '국사상태', align:'center', width:'60px'},
				  { key : 'bldAddr', title: '주소', align:'left', width:'220px'},
				  { key : 'bldNm', title: '건물명', align:'left', width:'100px'},
				  { key : 'mtsoLatVal', title: '위도', align:'left', width:'90px'},
				  { key : 'mtsoLngVal', title: '경도', align:'left', width:'90px'},
				  { key : 'mtsoId', title: '국사ID', align:'center', width:'90px'},
				  { key : 'mtsoTypCd', title: '국사유형', align:'center', width:'60px', hidden:true},
				  { key : 'erpLatVal', align:'center',title : '통합시설위도값',width: '120px'},
				  { key : 'erpLngVal', align:'center',title : '통합시설경도값',width: '120px'},
				  { key : 'intgFcltsCd', title: '통합시설코드', align:'center', width:'100px'},
				  { key : 'erpIntgFcltsNm', title: '통합시설명', align:'center', width:'220px'},
				  { key : 'allAddr1', align:'left', title : '전체주소1', width: '200px'},
				  { key : 'bunjiAddr', align:'left', title : '번지주소', width: '250px'},
				  { key : 'shrRepFcltsCd', align:'center',title : '공용대표시설코드',width: '125px'},
				  { key : 'prntBmtsoCd', align:'center',title : '모기지국코드',width: '125px'},
     		]
        });
    }
    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {

    	//닫기
    	 $('#btnClose').on('click', function(e) {
    		 $a.close();
         });

    	 $('#'+gridId).on('click', '.bodycell', function(e){
 	  		var ev = AlopexGrid.parseEvent(e);
 			var dataObj = ev.data;
 			var rowData = $('#'+gridId).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

 			var row = dataObj._index.row;
 			if(rowData._key == "mtsoLkupIcon"){
 				// 국사팝업 호출
 				callMtsoLkupPop(dataObj);
 			}
         });

    	 $('#btnExportExcel').on('click', function(e) {

	    		var dt = new Date();
	    		var recentY = dt.getFullYear();
	    		var recentM = dt.getMonth() + 1;
	    		var recentD = dt.getDate();

	    		if(recentM < 10) recentM = "0" + recentM;
	    		if(recentD < 10) recentD = "0" + recentD;

	    		var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;


	    		$('#'+gridId).alopexGrid('hideCol', 'mtsoLkupIcon');

	    		var worker = new ExcelWorker({
	    			excelFileName : "커버리지 국사 정보_" +popTitle+ "_" +recentYMD,
	    			sheetList : [{
	    				sheetName : '커버리지 국사 정보',
	    				$grid : $('#'+gridId)
	    			}]
	    		});


	    		worker.export({
	    			merge : true,
	    			useCSSParser : true,
	    			useGridColumnWidth : true,
	    			border : true,
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

	    		$('#'+gridId).alopexGrid('showCol', 'mtsoLkupIcon');
    	 });
	};

	function callMtsoLkupPop(dataObj){

		let mtsoGubun = "mtso";
		let linkTab = "tab_Mtso";

    	let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
    	let mtsoData = {
    			mtsoEqpGubun : mtsoGubun,
    			mtsoEqpId : dataObj.mtsoId,
    			parentWinYn : 'Y',
    			mtsoTypCd : dataObj.mtsoTypCd,		//국사유형
    			linkTab : linkTab					//국사상세 탭선택 옵션
    	};

		let popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			data: mtsoData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 1300,
			height : window.innerHeight * 0.83
		});
	}
    /*-----------------------------*
     *  커버리지 국사 정보 조회등록
     *-----------------------------*/
    function getMtsoListWithinCoverage() {
    	$('#'+gridId).alopexGrid('showProgress');
    	 httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/getMtsoListWithinCoverage', paramData, 'GET', 'mtsoList');
    }

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){

    	$('#'+gridId).alopexGrid('hideProgress');
    	if(flag == 'mtsoList') {
    		let serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};

    		$('#'+gridId).alopexGrid('dataSet', response.resultList, serverPageinfo);
    	}
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'mtsoList'){
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    };

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

});