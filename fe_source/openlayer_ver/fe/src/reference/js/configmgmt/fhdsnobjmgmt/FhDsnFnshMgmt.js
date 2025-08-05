/**
 * FhDsnObjMgmt.js
 *
 * @author P135551
 * @date 2019. 1. 29. 오전 13:30:03
 * @version 1.0
 */

var gridModel = null;
$a.page(function() {

	//그리드 ID
    var gridId = 'resultGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        initGrid();
    	setCombo();
    	setEventListener();

    };

  //Grid 초기화
    function initGrid() { //mst


    	var mapping =  [
    		{
				key : 'check',
				align:'center',
				width:'40px',
				title : '번호',
				numberingColumn : true
			}

    		, {
				key : 'fhEngId',
				align:'center',
				width:'110px',
				title : '설계ID'
			}
    		, {
    			key : 'fhEngNm',
    			align:'center',
    			width:'280px',
    			title : '설계명'
    		}
    		, {
    			key : 'fhEngDivNm',
    			align:'center',
    			width:'140px',
    			title : '설계구분'
    		}
			, {
				key : 'fhEngObjNum',
				align:'center',
				width:'70px',
				title : '대상건수',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
			}
    		, {
    			key : 'uprMtsoJugNm',
    			align:'center',
    			width:'80px',
    			title : '상위국조건'
    		}
    		, {
    			key : 'lowMtsoJugNm',
    			align:'center',
    			width:'80px',
    			title : '하위국조건'
    		}
    		, {
    			key : 'lnInvtCostCalYn',
    			align:'center',
    			width:'80px',
    			title : '선로투자비'
    		}
    		, {
    			key : 'eqpInvtCostCalYn',
    			align:'center',
    			width:'80px',
    			title : '장비투자비'
    		}
    		, {
    			key : 'appltReflctYn',
    			align:'center',
    			width:'80px',
    			title : '청약반영여부'
    		}

    		, {
    			key : 'fhEngRmk',
    			align:'center',
    			width:'130px',
    			title : '비고'
    		}
    		, {
    			key : 'fhEngStaDtm',
    			align:'center',
    			width:'120px',
    			title : '시작일시'
    		}
    		, {
    			key : 'fhEngProgStatNm',
    			align:'center',
    			width:'80px',
    			title : '진행상태'
    		}
    		, {
    			key : 'fhLnConnNum',
    			align:'center',
    			width:'100px',
    			title : '선로직결(건수)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'fh5gsmuxNwNum',
    			align:'center',
    			width:'100px',
    			title : '5G-SMUX(신설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'fh5gsmuxExistsNum',
    			align:'center',
    			width:'100px',
    			title : '5G-SMUX(기설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'fh5gponNwNum',
    			align:'center',
    			width:'100px',
    			title : '5G-PON(신설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'fh5gponExistsNum',
    			align:'center',
    			width:'100px',
    			title : '5G-PON(기설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'lnInvtCostAmt',
    			align:'center',
    			width:'100px',
    			title : '선로투자비',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'eqpInvtCostAmt',
    			align:'center',
    			width:'100px',
    			title : '장비투자비',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
				key : 'invtCostAmt',
				align:'center',
				width:'100px',
				title : '투자비합계',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
    		}
    		, {
    			key : 'fhLnConnUprc',
    			align:'center',
    			width:'100px',
    			title : '선로직결',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
        		}
    		, {
    			key : 'fh5gsmuxNwUprc',
    			align:'center',
    			width:'100px',
    			title : '5G-SMUX(신설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
        		}
    		, {
    			key : 'fh5gsmuxExistsUprc',
    			align:'center',
    			width:'100px',
    			title : '5G-SMUX(기설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
        		}
    		, {
    			key : 'fh5gponNwUprc',
    			align:'center',
    			width:'100px',
    			title : '5G-PON(신설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
        		}
    		, {
    			key : 'fh5gponExistsUprc',
    			align:'center',
    			width:'100px',
    			title : '5G-PON(기설)',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}
       		}
    		, {
    			key : 'frstRegDate',
    			align:'center',
    			width:'100px',
    			title : '최초등록일'
    		}
    		, {
    			key : 'frstRegUserId',
    			align:'center',
    			width:'100px',
    			title : '최초등록자ID'
    		}
    		, {
    			key : 'lastChgDate',
    			align:'center',
    			width:'100px',
    			title : '최종변경일'
    		}
    		, {
    			key : 'lastChgUserId',
    			align:'center',
    			width:'100px',
    			title : '최종변경자ID'
    		}
    	];

    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/FhDsnFnshMgmtList"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 50,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });

        //그리드 생성
        $('#'+gridId).alopexGrid({
            cellSelectable : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : false,
            numberingColumnFromZero : false
            ,paging: {
         	   //pagerTotal:true,
         	   pagerSelect:false,
         	   hidePageList:true
            }
            ,headerGroup:
    			[
    				//2단
    				{fromIndex:1, toIndex:4, title:'F/H 설계 정보'},
    				{fromIndex:5, toIndex:10, title:'F/H 설계 조건 '},
    				{fromIndex:11, toIndex:12, title:'F/H 설계 상태'},
    				{fromIndex:13, toIndex:20, title:'F/H 설계 통계'},
    				{fromIndex:21, toIndex:25, title:'설계 적용 평균 단가'},
    				{fromIndex:26, toIndex:29, title:'작업자'},
    		    ]
//            	[
//            		{fromIndex:0, toIndex:20, title:'마스터정보'},
//            		{fromIndex:21, toIndex:47, title:'상세정보'},
//            	]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
   	         model: gridModel                  // ajax option에 grid 연결할 model을지정
   		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
   		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
//            ,height : (screen.height==900) ? 450 : eval(screen.height * 0.8)
            ,height : 600
//            ,filteringHeader : true
        });

        $("#"+gridId).on( 'dblclick', '.bodycell' , function(e){
		    var rowData = AlopexGrid.trimData( AlopexGrid.parseEvent(e).data );
		    var fhEngId = {"fhEngId" : rowData.fhEngId};
		    if(rowData.fhEngProgStatCd == '99'){
		    	$a.popup({
	            	popid: 'GetFhDsnFnshPopup',
	            	title: 'F/H 설계 결과 상세정보',
//	            	iframe: true,
	            	windowpopup : true,
		            modal: true,
		            movable:true,
	                url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnFnshPopup.do',
	                data: fhEngId,
	                width : 1550,
	                height : 930, //window.innerHeight * 0.9,
	                /*
	            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	            	*/
	                callback: function(data) {
	                	if (data == true) {
	                		$('#search').click();
	                	}
	               	}
	            });
		    } else if( rowData.fhEngProgStatCd == '02') {
		    	callMsgBox("","I", "아직 F/H 설계작업이 진행중입니다.");
		    }else if( rowData.fhEngProgStatCd == 'XX') {
		    	callMsgBox("","I", " F/H설계작업이 실패하였습니다.");
		    }
		});
    }

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

	function setCombo() {
		//설계구분코드
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03009', null, 'GET', 'fhEngDivList');
		//국사판단기준
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03010', null, 'GET', 'MtsoJugList');
		var option_data =  [{comCd: "", comCdNm: "전체"}, {comCd: "B1", comCdNm: "반경10M"}, {comCd: "B2", comCdNm: "반경30M"}, {comCd: "B3", comCdNm: "반경50M"}, {comCd: "B4", comCdNm: "반경100M"}];
		$('#uprMtsoJugCd').clear();
		$('#uprMtsoJugCd').setData({
			data:option_data
		});
		$('#lowMtsoJugCd').clear();
		$('#lowMtsoJugCd').setData({
			data:option_data
		});
		//설계상태코드
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03011', null, 'GET', 'fhEngProgStatList');
    }

    function setEventListener() {

    	$("#pageNo").val(1);
    	$('#rowPerPage').val(15);

//    	 $('#search').on('click', function(e) {
//    		 setGrid(1,perPage);
//         });
    	$('#search').on('click', function(e) {
        	var dataParam =  $("#searchForm").getData();
        	//login 정보 넣기

        	bodyProgress();
        	dataParam.pageNo = '1';
        	dataParam.rowPerPage = '50';
    		gridModel.get({
        		data: dataParam,
//    		}).done(function(response,status,xhr,flag){successDemandCallback(response, 'search');})
//    	  	  .fail(function(response,status,xhr,flag){failDemandCallback(response,'search');});
	    	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'search');})
	    	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});
        });

    	//엔터키로 조회
        $('#searchForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			$('#search').click();
      		}
    	 });

    	$("#afeYr").on('change',function(e) {
    		var param = $("#afeYr").getData();
    		//httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getAfeDgrList', param, 'GET', 'afeDgrList');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeDgrList', param, 'GET', 'afeDgrList');
    	});

    	$('#btn_dsn').on('click', function(e) {
    		$a.popup({
	        	popid: 'FhDsnPopup',
	        	title: 'F/H 설계 결과 상세 팝업',
//	        	iframe: true,
//	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnPopup.do',
	            data: null,
	            width: 1350,
	            height: 930,
	            windowpopup : true,
	            modal: false,
	            movable:true
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            ,callback: function(resultCode) {
                	if (resultCode == "OK") {
                		$('#search').click();
                	}
               	}
//		 		,xButtonClickCallback : function(el){
//	   	 			alertBox('W', demandMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
//	   	 			return false;
//	   	 		}
	       });
    	});
	    // on-demand excel download
	    $('#excelDownloadByBatch').on('click', function(e) {
	    	var popupCheck = false;
	    	if ($a.popup.names.length > 0 ) {
	    		//$(excelPopup).close();
	    		for (var i=0; i < $a.popup.names.length; i++) {
	    			if ($a.popup.names[i] == "Alopex_Popup_FhDsnObjExcelDownPopup") {
	    				popupCheck = true;
	    				break;
	    			}
	    		}
	    		if (popupCheck == true) {
	    			return;
	    		}
	    	}
	    	var dataParam =  $("#searchForm").getData();
	    	excelPopup = $a.popup({
            	popid: 'FhDsnObjExcelDownPopup',
            	title: '엑셀다운로드',
            	iframe: true,
                modal: false,
		        windowpopup: true,
                //movable: true,
                url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnObjExcelDown.do',
                data: dataParam,
                width : 500,
                height : 250  //window.innerHeight * 0.3
                /*,xButtonClickCallback : function(el){
	   	 			alertBox('W', demandMsgArray['infoClose'] );'닫기버튼을 이용해 종료하십시오.'
	   	 			return false;
	   	 		}*/
		    	,callback: function(resultCode) {
		    		excelPopup = null;
	           	}
            });
        });

	    $('#btnExportExcelOnDemand').on('click', function(e){
            btnExportExcelOnDemandClickEventHandler(e);
        });
    };

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //장비조회조건세팅
	        var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $("#userId").val();
        	 /* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = 'FrontHole_Information_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getFhDsnObjMgmtList";
	   		param.excelFlag = "FhDsnObjMgmt";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
  		    console.log("aaa");
  		 	$('#'+gridId).alopexGrid('showProgress');
  		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	    }
	 function gridExcelColumn(param, gridId) {
			var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");

	    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
			var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
			var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
			var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

			for(var i=0; i<gridHeaderGroup.length; i++) {
				if(gridHeaderGroup[i].title != undefined) {
					excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex -1;/*순번칼럼다운 제외되니까*/
					excelHeaderGroupFromIndex += ";";
					excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex -1;/*순번칼럼다운 제외되니까*/
					excelHeaderGroupToIndex += ";";
					excelHeaderGroupTitle += gridHeaderGroup[i].title;
					excelHeaderGroupTitle += ";";
					excelHeaderGroupColor += gridHeaderGroup[i].color;
					excelHeaderGroupColor += ";";
				}
			}
			var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
			var excelHeaderCd = "";
			var excelHeaderNm = "";
			var excelHeaderAlign = "";
			var excelHeaderWidth = "";
			for(var i=1; i<gridHeader.length; i++) {
				if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
					excelHeaderCd += gridHeader[i].key;
					excelHeaderCd += ";";
					excelHeaderNm += gridHeader[i].title;
					excelHeaderNm += ";";
					excelHeaderAlign += gridHeader[i].align;
					excelHeaderAlign += ";";
					excelHeaderWidth += gridHeader[i].width;
					excelHeaderWidth += ";";
				}
			}


//			for(var j=0; j<gridColmnInfo.length; j++){
//					excelHeaderGroupColor += "#FFFF00;";
//					excelHeaderGroupFromIndex += gridColmnInfo[j].fromIndex;
//					excelHeaderGroupFromIndex += ";";
//					excelHeaderGroupToIndex += gridColmnInfo[j].toIndex;
//					excelHeaderGroupToIndex += ";";
//					excelHeaderGroupTitle += gridColmnInfo[j].title;
//					excelHeaderGroupTitle += ";";
//			}

			/*======해더그룹정보======*/
			param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
			param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
			param.excelHeaderGroupTitle = excelHeaderGroupTitle;
			param.excelHeaderGroupColor = excelHeaderGroupColor;


			/*======해더정보======*/
			param.excelHeaderCd = excelHeaderCd;
			param.excelHeaderNm = excelHeaderNm;
			param.excelHeaderAlign = excelHeaderAlign;
			param.excelHeaderWidth = excelHeaderWidth;
			//param.excelHeaderInfo = gridHeader;

//			param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
//			param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
//			param.excelHeaderGroupTitle = excelHeaderGroupTitle;
//			param.excelHeaderGroupColor = excelHeaderGroupColor;

			return param;
		}

    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
        	bodyProgressRemove();
    		// 검색
    	}

    	if(flag == 'fhEngDivList'){
    		$("#fhEngDivCd").clear();
    		var option_data =  [{comCd: "",comCdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		$("#fhEngDivCd").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'fhEngProgStatList'){
    		$("#fhEngProgStatCd").clear();
    		var option_data =  [{comCd: "",comCdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$("#fhEngProgStatCd").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'MtsoJugList'){
    		$("#uprMtsoJugCd").clear();
    		$("#lowMtsoJugCd").clear();
    		var option_data =  [{comCd: "",comCdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$("#uprMtsoJugCd").setData({
    			data:option_data
    		});
    		$("#lowMtsoJugCd").setData({
    			data:option_data
    		});
    	}

    	//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }
    }
  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function bodyProgress() {
    	$('body').progress();
    }

    function bodyProgressRemove() {
    	$('body').progress().remove();
    }

    function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                }
            });
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