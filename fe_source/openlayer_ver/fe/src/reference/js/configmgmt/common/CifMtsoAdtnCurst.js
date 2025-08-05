/**
 * CifMtsoAdtnCurst.js
 *
 * @author Administrator
 * @date 2018. 2. 06. 오전 17:30:03
 * @version 1.0
 */
var cifMtso = $a.page(function() {

	var gridId = 'dataGrid';
	var tmp1 = null;
	var tmp2 = null;
	var tmp3 = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

//        if(param.autoSearchYn == "Y"){
        	setList(param);
//        }
    };

    function setRegDataSet(data) {

    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        		headerGroup: [{fromIndex:8, toIndex:15, title:"일반현황"},
        	              {fromIndex:14, toIndex:15, title:"상주인력현황"},

        	              {fromIndex:16, toIndex:24, title:"[ACC분야] 시설현황 - 주장비(식)"},
        	              {fromIndex:16, toIndex:20, title:"LTE(eNB)"},
        	              {fromIndex:21, toIndex:21, title:"WCDMA"},
        	              {fromIndex:22, toIndex:22, title:"1X"},
        	              {fromIndex:23, toIndex:23, title:"2G"},
        	              {fromIndex:24, toIndex:24, title:"WiBro"},

        	              {fromIndex:25, toIndex:38, title:"[ACC분야] 시설현황 - 부대시설"},
        	              {fromIndex:25, toIndex:29, title:"정류기"},
        	              {fromIndex:30, toIndex:33, title:"축전지"},
        	              {fromIndex:34, toIndex:35, title:"냉방기"},
        	              {fromIndex:36, toIndex:38, title:"출동정보"},

        	              {fromIndex:39, toIndex:46, title:"[전송분야] 시설현황 - 주장비(식)"},
        	              {fromIndex:39, toIndex:42, title:"LTE"},
        	              {fromIndex:43, toIndex:45, title:"Legacy"},
        	              {fromIndex:46, toIndex:46, title:"공통"},

        	              {fromIndex:47, toIndex:58, title:"[전송분야] 시설현황 - 부대시설(Access장비와 전송장비가 분리되어 있는 경우)"},
        	              {fromIndex:47, toIndex:51, title:"정류기"},
        	              {fromIndex:52, toIndex:55, title:"축전지"},
        	              {fromIndex:56, toIndex:58, title:"출동정보"},

        	              {fromIndex:59, toIndex:61, title:"전력"},
        	              {fromIndex:59, toIndex:60, title:"발전기"},
        	              {fromIndex:61, toIndex:61, title:"전원 인입루트"},

        	              {fromIndex:62, toIndex:62, title:"전송"},
        	              {fromIndex:62, toIndex:62, title:"광선로 인입루트"},

        	              {fromIndex:63, toIndex:64, title:"환경"},
        	              {fromIndex:63, toIndex:63, title:"내부CCTV"},
        	              {fromIndex:64, toIndex:64, title:"침수센서"},

        	              {fromIndex:65, toIndex:65, title:"기타"},

        	              {fromIndex:66, toIndex:67, title:"추가"}
        	             ],
        	columnFixUpto: 2,
//        	columnFixShowFrom: 4,
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
    		},
    		{key : 'mtsoNm', align:'center', title : '국사명', width: '200px' },
			{
	//				key : 'cifTakeStatNm', align:'center',
//				title : '현재상태',
//				width: '100px'
//			}, {
				key : 'repIntgFcltsCd', align:'center', title : '대표통합시설코드', width: '120px'
//			}, {
//				key : 'rcuIpVal', align:'center',
//				title : 'RCU IP',
//				width: '100px'
			},
			{key : 'plntDesc', align:'center', title : '본부', width: '150px' },
			{key : 'cstCntrDesc', align:'center', title : '운용팀', width: '150px' },
			{key : 'ptNm', align:'center', title : '운용파트', width: '150px' },
			{key : 'repIntgFcltsNm', align:'center', title : '대표통합시설명', width: '200px' },
			{key : 'cellCnt', align:'center', title : '운용CELL수', width: '100px' },
			{key : 'mtsoCntrTypNm', align:'center', title : '국사구분', width: '100px'},
			{key : 'cifSlfLesNm', align:'center', title : '국사소유', width: '100px' },
			{key : 'bldAddr', align:'center', title : '주소', width: '300px' },
			{key : 'mtsoLatVal', align:'center', title : '위도', width: '100px' },
			{key : 'mtsoLngVal', align:'center', title : '경도', width: '100px' },
			{key : 'bldFlopList', align:'center', title : '층', width: '90px' },
			{key : 'compNm', align:'center', title : '운협사명', width: '150px' },
			{key : 'compHrscVal', align:'center', title : '상주인력', width: '70px' },
			{key : 'accLteDuVal', align:'center', title : 'DU', width: '120px' },
			{key : 'accLteRruF800mVal', align:'center', title : 'RRU(800MHz)', width: '120px' },
			{key : 'accLteRruF18gVal', align:'center', title : 'RRU(1.8GHz)', width: '120px' },
			{key : 'accLteRruF21gVal', align:'center', title : 'RRU(2.1GHz)', width: '120px' },
			{key : 'accLteRruF26gVal', align:'center', title : 'RRU(2.6GHz)', width: '120px' },
			{key : 'accWcdmaBtsVal', align:'center', title : 'NB', width: '120px' },
			{key : 'acc1xBtsVal', align:'center', title : 'BTS', width: '120px' },
			{key : 'accG2BtsVal', align:'center', title : 'BTS', width: '120px' },
			{key : 'accWbrRasVal', align:'center', title : 'RAS', width: '120px' },
			{key : 'accRtfMdlNm', align:'center', title : '모델', width: '120px' },
			{key : 'accRtfQutyVal', align:'center', title : '수량(식)', width: '120px' },
			{key : 'accRtfMdulVal', align:'center', title : '모듈(EA)', width: '120px' },
			{key : 'accRtfFcltsCapaVal', align:'center', title : '시설용량(A)', width: '120px' },
			{key : 'accRtfUseLoadVal', align:'center', title : '현사용부하(A)', width: '120px' },
			{key : 'accBatryQutyVal', align:'center', title : '수량(조)', width: '120px' },
			{key : 'accBatryCapaVal', align:'center', title : '용량(AH)', width: '120px' },
			{key : 'accBatryBkTimeVal', align:'center', title : '백업시간(분)', width: '120px' },
			{key : 'accBatryBkTimeUscreRsn', align:'center', title : '백업시간 미확보사유', width: '120px' },
			{key : 'accArcnQutyVal', align:'center', title : '수량(대)', width: '120px' },
			{key : 'accArcnCapaVal', align:'center', title : '용량(RT)', width: '120px' },
			{key : 'accGoutTimeVal', align:'center', title : '시간(분)', width: '120px' },
			{key : 'accGoutDistVal', align:'center', title : '거리(Km)', width: '120px' },
			{key : 'accGoutPostVal', align:'center', title : '포스트', width: '120px' },
			{key : 'trmsLtePtsVal', align:'center', title : 'PTS', width: '120px' },
			{key : 'trmsLteIpBkhlVal', align:'center', title : 'IP백홀', width: '120px' },
			{key : 'trmsLteL2Val', align:'center', title : 'L2스위치', width: '120px' },
			{key : 'trmsLteRgmuxVal', align:'center', title : '링MUX', width: '120px' },
			{key : 'trmsMsppVal', align:'center', title : 'MSPP', width: '120px' },
			{key : 'trmsSkt2Val', align:'center', title : 'SKT2', width: '120px' },
			{key : 'trmsEtcVal', align:'center', title : '기타', width: '120px' },
			{key : 'trmsComRoadmVal', align:'center', title : 'ROADM', width: '120px' },
			{key : 'trmsRtfMdlNm', align:'center', title : '모델', width: '120px' },
			{key : 'trmsRtfQutyVal', align:'center', title : '수량(식)', width: '120px' },
			{key : 'trmsRtfMdulVal', align:'center', title : '모듈(EA)', width: '120px' },
			{key : 'trmsRtfFcltsCapaVal', align:'center', title : '시설용량(A)', width: '120px' },
			{key : 'trmsRtfUseLoadVal', align:'center', title : '현사용부하(A)', width: '120px' },
			{key : 'trmsBatryQutyVal', align:'center', title : '수량(조)', width: '120px' },
			{key : 'trmsBatryCapaVal', align:'center', title : '용량(AH)', width: '120px'},
			{key : 'trmsBatryBkTimeVal', align:'center', title : '백업시간(분)', width: '120px' },
			{key : 'trmsBatryBkTimeUscreRsn', align:'center', title : '백업시간 미확보사유', width: '120px' },
			{key : 'trmsGoutTimeVal', align:'center', title : '시간(분)', width: '120px' },
			{key : 'trmsGoutDistVal', align:'center', title : '거리(Km)', width: '120px' },
			{key : 'trmsGoutPostVal', align:'center', title : '포스트', width: '120px' },
			{key : 'epwrFixdGntEyn', align:'center', title : '고정발전기 유무', width: '120px' },
			{key : 'epwrMovGntEyn', align:'center', title : '이동발전차량/전원투입단자유무', width: '120px' },
			{key : 'epwrDlstYn', align:'center', title : '이원화여부', width: '120px' },
			{key : 'trmsOptlLnDlstYn', align:'center', title : '이원화여부', width: '120px' },
			{key : 'envIntnCctvEyn', align:'center', title : '유무', width: '120px' },
			{key : 'envFlodSnsrEyn', align:'center', title : '유무', width: '120px' },
			{key : 'etcMtrVal', align:'center', title : '운용상 내재된 Risk/문제점/특이사항', width: '200px', rowspan: 2 },
			{key : 'flodSnsrNeedYn', align:'center', title : '침수센서 필요 여부', width: '150px', rowspan: 2},
			{key : 'comUseYn', align:'center', title : '정류기,축전지 ACC/전송 공통사용', width: '150px', rowspan: 2 },
			{key : 'lastChgDate', align:'center', title : '등록일시', width: '120px' },
			{key : 'lastChgUserId', align:'center', title : '등록자', width: '120px'},
			{key : 'mtsoId', align:'center', title : '국사ID', width: '120px'}




			],
			message: {/* 데이터가 없습니다.   */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {

	}

    function setList(param){
//    	if(JSON.stringify(param).length > 2){
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);

        	param.gubun = "Y";
        	param.page = 1;
        	param.rowPerPage = 100;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoAdtnList', param, 'GET', 'search');
//        }
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }


    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	cifMtso.setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	cifMtso.setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 cifMtso.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			cifMtso.setGrid(1,perPage);
       		}
     	 });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;

      	 	/* 국사 상세정보 */
    	 	$a.popup({
			  	popid: 'CifMtsoAdtnDtlLkup',
			  	title: '통합국 추가 상세',
			      url: '/tango-transmission-web/configmgmt/common/CifMtsoAdtnDtlLkup.do',
			      data: dataObj,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 865,
			      height : 820
    	 	});

    	 });

    	 $('#btnExportExcel').on('click', function(e) {
        		//tango transmission biz 모듈을 호출하여야한다.
        		 var param =  $("#searchForm").getData();
        		 var mtsoCntrTypCd = "";

        		 param = gridExcelColumn(param, gridId);
        		 param.pageNo = 1;
        		 param.rowPerPage = 10;
        		 param.firstRowIndex = 1;
        		 param.lastRowIndex = 10000;
        		 param.gubun = "Y";

        		 param.fileName = "통합국현황";
        		 param.fileExtension = "xlsx";
        		 param.excelPageDown = "N";
        		 param.excelUpload = "N";
        		 param.method = "getCifMtsoAdtnList";

        		 $('#'+gridId).alopexGrid('showProgress');
     	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifexcelcreate', param, 'GET', 'excelDownload');
          });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

	};

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
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

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){

		//국사 조회시
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId,response, response.cifMtsoAdtnList);
		}

		if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

        	var serverPageinfo = {
    	      		dataLength  : tmp1, 	//총 데이터 길이
    	      		current 	: tmp2, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: 10000 	//한 페이지에 보일 데이터 갯수
    	      	};

           	$('#'+gridId).alopexGrid('dataSet', response.map.list, serverPageinfo);
    		console.log('excelCreate');
    		console.log(response);

        	var worker = new ExcelWorker({
        		excelFileName: '통합국현황',
        		defaultPalette : {
        			font : '맑은고딕',
        			fontSize : 11,

        		},
        		sheetList : [{
        			sheetName : 'sheet1',
        			$grid : [$('#'+gridId)]
        		}]
        	});

        	worker.export({
        		merge: true,
        		exportHidden:false,
        		useCSSParser: true, // 색상 스타일 그대로 적용
        		border : true
        	});

    		var serverPageinfo = {
    	      		dataLength  : tmp1, 	//총 데이터 길이
    	      		current 	: tmp2, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: tmp3 	//한 페이지에 보일 데이터 갯수
    	      	};
    	       	$('#'+gridId).alopexGrid('dataSet', response.map.list, serverPageinfo);

//            var $form=$('<form></form>');
//            $form.attr('name','downloadForm');
//            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
//            $form.attr('method','GET');
//            $form.attr('target','downloadIframe');
//            // 2016-11-인증관련 추가 file 다운로드시 추가필요
//			$form.append(Tango.getFormRemote());
//            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
//            $form.appendTo('body');
//            $form.submit().remove();

        }
	}

	function setSPGrid(GridID,Option,Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

			tmp1 =Option.pager.totalCnt;
			tmp2 =Option.pager.pageNo;
			tmp3 =Option.pager.rowPerPage;

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    this.setGrid = function(page, rowPerPage){


    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

    	 param.gubun = "Y";

		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoAdtnList', param, 'GET', 'search');
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