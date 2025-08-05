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
    	//console.log(id,param);
        initGrid();
    	setCombo();
    	setEventListener();

    };

  //Grid 초기화
    function initGrid() { //mst & dtl
    	var mapping =  [
//    		{
//				width:'40px',
//				key : 'check',
//				selectorColumn : true
//			},
    		{
				key : 'check',
				align:'center',
				width:'40px',
				title : '번호',
				numberingColumn : true
			}
//    		, {
//				key : 'fhEngId',
//				align:'center',
//				width:'130px',
//				title : '프론트홀설계ID'
//			}
//    		, {
//    			key : 'fhEngNm',
//    			align:'center',
//    			width:'200px',
//    			title : '프론트홀설계명'
//    		}
//    		, {
//    			key : 'fhEngDivCd',
//    			align:'center',
//    			width:'140px',
//    			title : '프론트홀설계구분코드'
//    		}
//    		, {
//				key : 'uprMtsoJugCd',
//				align:'center',
//				width:'130px',
//				title : '상위국사판정코드'
//			}
//    		, {
//				key : 'lowMtsoJugCd',
//				align:'center',
//				width:'130px',
//				title : '하위국사판정코드'
//			}
//    		, {
//    			key : 'lnInvtCostCalYn',
//    			align:'center',
//    			width:'130px',
//    			title : '선로투자비산출여부'
//    		}
//    		, {
//    			key : 'eqpInvtCostCalYn',
//    			align:'center',
//    			width:'130px',
//    			title : '장비투자비산출여부'
//    		}
//    		, {
//    			key : 'fhEngRmk',
//    			align:'center',
//    			width:'130px',
//    			title : '프론트홀설계비고'
//    		}
//    		, {
//    			key : 'fhEngStaDtm',
//    			align:'center',
//    			width:'140px',
//    			title : '프론트홀설계시작일시'
//    		}
//    		, {
//    			key : 'fhEngProgStatCd',
//    			align:'center',
//    			width:'160px',
//    			title : '프론트홀설계진행상태코드',
//    		}
//    		, {
//    			key : 'fhEngProgRsltCd',
//    			align:'center',
//    			width:'160px',
//    			title : '프론트홀설계진행결과코드'
//    		}
//    		, {
//    			key : 'fhEngObjNum',
//    			align:'center',
//    			width:'140px',
//    			title : '프론트홀설계대상건수'
//    		}
//    		, {
//    			key : 'invtCostSumrAmt',
//    			align:'center',
//    			width:'120px',
//    			title : '투자비합계금액'
//    		}
//    		, {
//    			key : 'lnInvtCostSumrAmt',
//    			align:'center',
//    			width:'130px',
//    			title : '선로투자비합계금액'
//    		}
//    		, {
//    			key : 'eqpInvtCostSumrAmt',
//    			align:'center',
//    			width:'130px',
//    			title : '장비투자비합계금액'
//    		}
//    		, {
//    			key : 'lnDirConnNum',
//    			align:'center',
//    			width:'130px',
//    			title : '선로직접연결건수'
//    		}
//    		, {
//    			key : 'g5SMuxNum',
//    			align:'center',
//    			width:'120px',
//    			title : '5GSMUX건수'
//    		}
//    		, {
//    			key : 'g5PonNum',
//    			align:'center',
//    			width:'100px',
//    			title : '5GPON건수'
//    		}
//    		, {
//    			key : 'fhEngProgCtt',
//    			align:'center',
//    			width:'100px',
//    			title : '프론트홀설계진행내용'
//    		}
    		, {
				key : 'fhEngDtlId',
				align:'center',
				width:'150px',
				title : '상세일련번호', //프론트홀설계상세ID
				hidden : true
			}
    		, {
				key : 'acsnwDemdMgmtSrno',
				align:'center',
				width:'150px',
				title : '일련번호' //A망수요관리일련번호
			}
    		, {
    			key : 'acsnwPrjId',
    			align:'center',
    			width:'140px',
    			title : 'A망프로젝트ID'
    		}
    		, {
				key : 'afeYr',
				align:'center',
				width:'70px',
				title : 'AFE 연도'
			}
    		, {
				key : 'acsnwAfeDgr',
				align:'center',
				width:'70px',
				title : 'AFE 차수'
			}
    		, {
    			key : 'acsnwKeyNo',
    			align:'center',
    			width:'150px',
    			title : 'A망키번호'
    		}
//    		, {
//    			key : 'acsnwMtrlCostAmt',
//    			align:'center',
//    			width:'150px',
//    			title : 'A망물자비금액'
//    		}
//    		, {
//    			key : 'acsnwIncidMtrlCostAmt',
//    			align:'center',
//    			width:'150px',
//    			title : 'A망부대물자비금액'
//    		}
//    		, {
//    			key : 'acsnwInvtCostAmt',
//    			align:'center',
//    			width:'150px',
//    			title : 'A망투자비금액'
//    		}
    		, {
				key : 'acsnwMgmtNo',
				align:'center',
				width:'140px',
				title : 'A망관리번호'
			}
    		, {
    			key : 'duFcltsCd',
    			align:'center',
    			width:'120px',
    			title : 'DU시설코드'
    		}
    		, {
    			key : 'duMtsoNm',
    			align:'center',
    			width:'300px',
    			title : 'DU국사명'
    		}
    		, {
    			key : 'intgFcltsCd',
    			align:'center',
    			width:'120px',
    			title : '시설코드'
    		}
    		, {
    			key : 'intgFcltsNm',
    			align:'center',
    			width:'300px',
    			title : '시설명'
    		}
    		, {
    			key : 'LTE_F800M_RU_FCLTS_CD',
    			align:'center',
    			width:'160px',
    			title : 'LTE800MRU시설코드'
    		}
    		, {
    			key : 'LTE_F1_8G_RU_FCLTS_CD',
    			align:'center',
    			width:'160px',
    			title : 'LTE1.8GRU시설코드'
    		}
    		, {
    			key : 'LTE_F2_1G_RU_FCLTS_CD',
    			align:'center',
    			width:'160px',
    			title : 'LTE2.1GRU시설코드'
    		}
    		, {
    			key : 'mcpNm',
    			align:'center',
    			width:'100px',
    			title : '광역시도명'
    		}
    		, {
    			key : 'sggNm',
    			align:'center',
    			width:'120px',
    			title : '시군구명'
    		}
    		, {
    			key : 'emdNm',
    			align:'center',
    			width:'100px',
    			title : '읍면동명'
    		}
    		, {
    			key : 'detlAddr',
    			align:'center',
    			width:'200px',
    			title : '세부주소'
    		}
//    		, {
//    			key : 'lttagVal',
//    			align:'center',
//    			width:'90px',
//    			title : '위도도값(RU)'
//    		}
//    		, {
//    			key : 'lttmnVal',
//    			align:'center',
//    			width:'90px',
//    			title : '위도분값(RU)'
//    		}
//    		, {
//    			key : 'lttscVal',
//    			align:'center',
//    			width:'90px',
//    			title : '위도초값(RU)'
//    		}
//    		, {
//    			key : 'ltdagVal',
//    			align:'center',
//    			width:'90px',
//    			title : '경도도값(RU)'
//    		}
//    		, {
//    			key : 'ltdmnVal',
//    			align:'center',
//    			width:'90px',
//    			title : '경도분값(RU)'
//    		}
//    		, {
//    			key : 'ltdscVal',
//    			align:'center',
//    			width:'90px',
//    			title : '경도초값(RU)'
//    		}
    		, {
    			key : 'latVal',
    			align:'center',
    			width:'150px',
    			title : '위도'
    		}
    		, {
    			key : 'lngVal',
    			align:'center',
    			width:'140px',
    			title : '경도'
    		}
//    		, {
//    			key : 'uprMtsoJugCdDtl',
//    			align:'center',
//    			width:'120px',
//    			title : '상위국사판정코드'
//    		}
//    		, {
//    			key : 'uprFcltsCd',
//    			align:'center',
//    			width:'120px',
//    			title : '상위시설코드'
//    		}
//				key : 'uprMtsoId',
//				align:'center',
//				width:'130px',
//				title : '상위국사ID'
//			}
//    		, {
//    			key : 'uprMtsoNm',
//    			align:'center',
//    			width:'170px',
//    			title : '상위국사명'
//    		}
//    		, {
//    			key : 'uprMtsoErrDistm',
//    			align:'center',
//    			width:'120px',
//    			title : '상위국사오차거리'
//    		}
//    		, {
//    			key : 'uprEqpId',
//    			align:'center',
//    			width:'120px',
//    			title : '상위장비ID'
//    		}
//    		, {
//    			key : 'lowMtsoJugCdDtl',
//    			align:'center',
//    			width:'120px',
//    			title : '하위국사판정코드'
//    		}
//    		, {
//    			key : 'lowFcltsCd',
//    			align:'center',
//    			width:'120px',
//    			title : '하위시설코드'
//    		}
//    		, {
//				key : 'lowMtsoId',
//				align:'center',
//				width:'130px',
//				title : '하위국사ID'
//			}
//    		, {
//    			key : 'lowMtsoNm',
//    			align:'center',
//    			width:'170px',
//    			title : '하위국사명'
//    		}
//    		, {
//    			key : 'uprMtsoErrDistm',
//    			align:'center',
//    			width:'120px',
//    			title : '하위국사오차거리'
//    		}
//    		, {
//    			key : 'lowEqpId',
//    			align:'center',
//    			width:'120px',
//    			title : '하위장비ID'
//    		}
//    		, {
//    			key : 'splyMeansCd',
//    			align:'center',
//    			width:'120px',
//    			title : '공급방식코드'
//    		}
//    		, {
//    			key : 'cnntDistm',
//    			align:'center',
//    			width:'90px',
//    			title : '접속거리(m)'
//    		}
//    		, {
//    			key : 'cnntInvtCostAmt',
//    			align:'center',
//    			width:'100px',
//    			title : '접속투자비금액'
//    		}
//    		, {
//    			key : 'icreDistm',
//    			align:'center',
//    			width:'90px',
//    			title : '증설거리(m)'
//    		}
//    		, {
//    			key : 'icreInvtCostAmt',
//    			align:'center',
//    			width:'100px',
//    			title : '증설투자비금액'
//    		}
//    		, {
//    			key : 'eqpVndNm',
//    			align:'center',
//    			width:'120px',
//    			title : '장비벤더명'
//    		}
//    		, {
//    			key : 'eqpInvtCostAmt',
//    			align:'center',
//    			width:'100px',
//    			title : '장비투자비금액'
//    		}
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
        	url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhDsnObjMgmtList"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 50,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });

        //그리드 생성
        $('#'+gridId).alopexGrid({
            cellSelectable : true,
            fitTableWidth : true,
//            rowClickSelect : true,
//            rowSingleSelect : false,
//            rowInlineEdit : false,
            numberingColumnFromZero : false
            ,paging: {
         	   //pagerTotal:true,
         	   pagerSelect:false,
         	   hidePageList:true
            }
//            ,headerGroup:
//    			[
//    				//2단
//    				{fromIndex:12, toIndex:16, title:'상위시설'},
//    				{fromIndex:17, toIndex:19, title:'상위시설-위도'},
//    				{fromIndex:20, toIndex:22, title:'상위시설-경도'},
//    				{fromIndex:23, toIndex:27, title:'하위시설'},
//    				{fromIndex:28, toIndex:30, title:'하위시설-위도'},
//    				{fromIndex:31, toIndex:33, title:'하위시설-경도'},
//
//    		    ]
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
            ,height : 700
//            ,filteringHeader : true
        });

        $("#"+gridId).on( 'dblclick', '.bodycell' , function(e){
		    var rowData = AlopexGrid.trimData( AlopexGrid.parseEvent(e).data );
		    var fhEngId = {"fhEngId" : rowData.fhEngId};

		    if(rowData.fhEngProgStatCd == '99'){
		    	$a.popup({
	            	popid: 'GetAccessDemandDetailPopup',
	            	title: '프론트홀 설계 완료 대상 상세정보',
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
		    } else {
		    	var fhEngId = fhEngId.fhEngId;
		    	$a.popup({
					popid: 'FhDsn',
					title: '프론트홀설계',
					url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnProgressBar.do?fhEngId='+fhEngId,
					modal: true,
					movable:true,
					windowpopup : false,
					width : 400,
					height : 200,
					callback : function(data) { // 팝업창을 닫을 때 실행
						if (data == true) {
	                		$('#search').click();
	                	}
					}
				});
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
    	//AFE 구분 콤보박스
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getAfeYrList', null, 'GET', 'afeYrList');

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
        	bodyProgress();
        	dataParam.pageNo = '1';
        	dataParam.rowPerPage = '50';
    		gridModel.get({
        		data: dataParam,
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
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getAfeDgrList', param, 'GET', 'afeDgrList');
    	});

    	$('#btn_dsn').on('click', function(e) {
    		$a.popup({
	        	popid: 'FhDsnPopup',
	        	title: '프론트홀 설계 팝업',
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
    	// 엑셀업로드
	    $('#btn_popup').on('click', function(e) {
	    	var param = $("#searchForm").getData();


	   	 $a.popup({
	        	popid: 'FhDsnObjExcelUploadPopup',
	        	title: '프론트홀 설계 대상 엑셀업로드팝업',
//	        	iframe: true,
//	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnObjExcelUpload.do',
	            data: param,
	            width: "600",
	            height: "300",
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

	    $('#btn_AccessPopup').on('click', function(e) {
	    	var param = $("#searchForm").getData();


	   	 $a.popup({
	        	popid: 'FhDsnObjAccessPopup',
	        	title: '수요 프론트홀 설계',
//	        	iframe: true,
//	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhAccessDsnPopup.do',
	            data: param,
	            width: (screen.width==900) ? 450 : eval(screen.width * 0.9),
	            height : (screen.height==900) ? 450 : eval(screen.height * 0.8),
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
			var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
			var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

			var excelHeaderCd = "";
			var excelHeaderNm = "";
			var excelHeaderAlign = "";
			var excelHeaderWidth = "";
			var excelHeaderGroupFromIndex = "";
			var excelHeaderGroupToIndex = "";
			var excelHeaderGroupTitle = "";
			var excelHeaderGroupColor = "";
			for(var i=0; i<gridHeader.length; i++) {
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
////				if((gridColmnInfo[j].id != undefined && gridColmnInfo[j].id != "")){
//					excelHeaderGroupColor += "#FFFF00;";
//					excelHeaderGroupFromIndex += gridColmnInfo[j].fromIndex;
//					excelHeaderGroupFromIndex += ";";
//					excelHeaderGroupToIndex += gridColmnInfo[j].toIndex;
//					excelHeaderGroupToIndex += ";";
//					excelHeaderGroupTitle += gridColmnInfo[j].title;
//					excelHeaderGroupTitle += ";";
////				}
//			}

//			excelHeaderGroupColor += "#FFFF00;#FFFF00;#FFFF00;#FFFF00;#FFFF00;#FFFF00";
//			excelHeaderGroupFromIndex += "30;27;22;19;16;11";
//			excelHeaderGroupToIndex += "32;29;26;21;18;15";
//			excelHeaderGroupTitle += "하위시설-경도;하위시설-위도;하위시설;상위시설-경도;상위시설-위도;상위시설";

			param.excelHeaderCd = excelHeaderCd;
			param.excelHeaderNm = excelHeaderNm;
			param.excelHeaderAlign = excelHeaderAlign;
			param.excelHeaderWidth = excelHeaderWidth;
			param.excelHeaderInfo = gridColmnInfo;

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

    	if(flag == 'afeYrList'){
    		$("#afeYr").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push({cd: resObj.afeYr, cdNm: resObj.afeYr});
			}

    		$("#afeYr").setData({
    			data:option_data
    		});

    		var param = $("#afeYr").getData();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getAfeDgrList', param, 'GET', 'afeDgrList');
    	}

    	if(flag == 'afeDgrList'){
    		$("#acsnwAfeDgr").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.acsnwAfeDgr, cdNm: resObj.acsnwAfeDgr});
    		}

    		$("#acsnwAfeDgr").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'hdofcNmList'){
    		$("#hdofcNm").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.hdofcNm, cdNm: resObj.hdofcNm});
    		}

    		$("#hdofcNm").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'srvcNmList'){
    		$("#srvcNm").clear();
    		$("#srvcNm").setEnabled(false);
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.srvcNm, cdNm: resObj.srvcNm});
    		}

    		$("#srvcNm").setData({
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