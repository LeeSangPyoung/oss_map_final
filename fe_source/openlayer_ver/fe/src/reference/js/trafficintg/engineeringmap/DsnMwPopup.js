/**
 *
 * @author Administrator
 * @date 2023. 10. 21.
 * @version 1.0
 */
let gridId 	= 'mwSctnGrid';	// 구간정보 그리드
let gridId2 = 'freqGrid';	// 주파수 정보 그리드
let perPage = 100;
let paramMwSctnId = {};
let mwDivValOptions = [
		{text: "전체", value: ""},
		{text: "D-MW", value: "D-MW"},
		{text: "E-MW", value: "E-MW"},
		{text: "CPRI-MW", value: "CPRI-MW"}
	];
let usgDivValOptions = [
		{text: "전체", value: ""},
		{text:"도서형", value: "도서형"},
		{text:"내륙형", value: "내륙형"}
	];
let venderOptions = [
		{text: "전체", value: ""},
		{text:"Ericsson",value: "Ericsson"},
		{text:"Nokia",   value: "Nokia"},
		{text:"Huawei",  value: "Huawei"}
	];

let main = $a.page(function() {

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	sessionStorage.setItem('param', JSON.stringify(param));

    	DsnMwControll.initialize(param);

    	DsnMwControll.setEventListener();
    }
});

const DsnMwControll = {

	initialize: function(param) {
		DsnMwControll.setSelectCode();     //select 정보 세팅
		DsnMwControll.initGrid();

		// 구간 정보 조회
		let sparam = JSON.parse(sessionStorage.getItem('param'));
    	if(sparam.mwSctnId) {
    		$('#mwSctnId').val(sparam.mwSctnId);
    	}
//		DsnMwControll.getMwSctnList(1, perPage);

		// 주파수 정보 조회
//		DsnMwControll.getFreqList(param, 1, perPage);
	},

	reload: function() {
		DsnMwControll.getMwSctnList(1, perPage);
		// 주파수 정보 조회
		DsnMwControll.getFreqList(param, 1, perPage);
	},

	// 주파수 정보 조회
	getFreqList: function(param, page, rowPerPage) {
		let selectedData = $('#mwSctnGrid').alopexGrid('dataGet', {_state: {selected:true}});

		if(selectedData.length > 0 && selectedData[0].mwSctnId != !param.mwSctnId) {
			$('#mwSctnId').val(selectedData[0].mwSctnId);
		} else {
			$('#mwSctnId').val(param.mwSctnId);
		}

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		$('#freqGrid').alopexGrid('dataEmpty');
		$('#freqGrid').alopexGrid('showProgress');

		param =  $("#searchForm").serialize();

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/netmenu/getFreqList',
			data:param,
			method:'GET',
			async:true
			}).done(
			function(response) {

				let serverPageinfo = {};

	    		$('#freqGrid').alopexGrid('hideProgress');
	    		serverPageinfo = {
	    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
	    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
	    		};

	    		$('#freqGrid').alopexGrid('dataSet', response.freqList, serverPageinfo);

			}.bind(this)
		);
	},

	// 구간 정보 조회
	getMwSctnList: function(page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		$('#mwSctnGrid').alopexGrid('dataEmpty');
		$('#mwSctnGrid').alopexGrid('showProgress');

		let param =  $("#searchForm").serialize();
		// 망메뉴 > 구간 정보 조회
		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/netmenu/getMwSctnList',
			data:param,
			method:'GET',
			async:true
			}).done(
			function(response) {

				let serverPageinfo = {};

	    		$('#mwSctnGrid').alopexGrid('hideProgress');
	    		serverPageinfo = {
	    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
	    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
	    		};

	    		$('#mwSctnGrid').alopexGrid('dataSet', response.mwSctnList, serverPageinfo);

			}.bind(this)
		);
	},


    //Grid 초기화
	initGrid : function () {
    	let titleList = [
				"No.",
				"구간ID",
				"구간명",
				"MW 구분",
				"용도 구분",
				"공동망 구분",
				"벤더",
				"사업차수",
				"투자유형",
				"본부",
				"도서지역",
				"상위국",
				"상위국 주소",
				"상위국 장비ID",
				"상위국 장비명",
				"상위국 EMS명",
				"하위국",
				"하위국 주소",
				"하위국 장비ID",
				"하위국 장비명",
				"하위국 EMS명",
				"SW Version",
				"장비모델",
				"구간거리(Km)",
				"운용 채널수",
				"여유 채널수",
				"상위국 철탑 내용",
				"상위국 철탑 유형",
				"상위국 철탑 높이",
				"상위국 철탑 소유주",
				"하위국 철탑 내용",
				"하위국 철탑 유형",
				"하위국 철탑 높이",
				"하위국 철탑 소유주",
				"안테나 제조사",
				"상위국 안테나 크기(ft)",
				"상위국 Main/SD 높이(m)",
				"상위국 안테나 SP/DP",
				"하위국 안테나 크기(ft)",
				"하위국 Main/SD 높이(m)",
				"하위국 안테나 SP/DP",
				"EOS/EOL 공통부",
				"EOS/EOL 채널부"
				];
		let cnt = 0;

		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '10row',
			fitTableWidth : true,
			autoResize: true,
			numberingColumnFromZero: false,
			headerRowHeight : 29,
			headerGroup: [
      			{fromIndex:0,   toIndex:10,  title:'M/W 구간 정보'},
      			{fromIndex:11,  toIndex:20,  title:'E2E 정보'},
      			{fromIndex:21,  toIndex:22,  title:'장비 현황'},
      			{fromIndex:23,  toIndex:25,  title:'무선 현황'},
      			{fromIndex:26,  toIndex:33,  title:'철탑 현황'},
      			{fromIndex:34,  toIndex:40,  title:'안테나 현황'}
			],
			columnMapping: [
			{align:'center',title : titleList[cnt++],width: '40',numberingColumn: true},
			{key : 'mwSctnId', align : 'center',title : titleList[cnt++],width : '120'}, 					//구간ID
			{key : 'mwSctnNm', align : 'center',title : titleList[cnt++],width : '120'},                    //구간명
			{key : 'mwDivVal', align : 'center',title : titleList[cnt++],width : '100'},        			//MW 구분
			{key : 'usgDivVal', align : 'center',title : titleList[cnt++],width : '100'},                   //용도 구분
			{key : 'comNetDivVal', align : 'center',title : titleList[cnt++],width : '100'},                //공동망 구분
			{key : 'vendNm', align : 'center',title : titleList[cnt++],width : '100'},                      //벤더
			{key : 'bizDgrVal', align : 'center',title : titleList[cnt++],width : '100'},                   //사업차수
			{key : 'invtTypVal', align : 'center',title : titleList[cnt++],width : '100'},                  //투자유형
			{key : 'hdofcNm', align : 'center',title : titleList[cnt++],width : '100'},                     //본부
			{key : 'isldAreaNm', align : 'center',title : titleList[cnt++],width : '100'},                  //도서지역
			{key : 'umtsoNm', align : 'center',title : titleList[cnt++],width : '100'},                     //상위국
			{key : 'umtsoAddr', align : 'center',title : titleList[cnt++],width : '100'},                   //상위국 주소
			{key : 'umtsoEqpId', align : 'center',title : titleList[cnt++],hidden:true,width : '100'},      //상위국 장비ID
			{key : 'umtsoEqpNm', align : 'center',title : titleList[cnt++],width : '100'},                  //상위국 장비명
			{key : 'umtsoEqpEms', align : 'center',title : titleList[cnt++],width : '100'},                 //상위국 EMS명
			{key : 'lmtsoNm', align : 'center',title : titleList[cnt++],width : '100'},                     //하위국
			{key : 'lmtsoAddr', align : 'center',title : titleList[cnt++],width : '100'},                   //하위국 주소
			{key : 'lmtsoEqpId', align : 'center',title : titleList[cnt++],hidden:true,width : '100'},      //하위국 장비ID
			{key : 'lmtsoEqpNm', align : 'center',title : titleList[cnt++],width : '100'},                  //하위국 장비명
			{key : 'lmtsoEqpEms', align : 'center',title : titleList[cnt++],width : '100'},                 //하위국 EMS명
			{key : 'swVerVal', align : 'center',title : titleList[cnt++],width : '100'},                    //SW Version
			{key : 'eqpMdlNm', align : 'center',title : titleList[cnt++],width : '100'},                    //장비모델
			{key : 'wlesSctnDistVal', align : 'center',title : titleList[cnt++],width : '100'},             //구간거리(Km)
			{key : 'opChnlVal', align : 'center',title : titleList[cnt++],width : '100'},                   //운용 채널수
			{key : 'moreChnlVal', align : 'center',title : titleList[cnt++],width : '100'},                 //여유 채널수
			{key : 'umtsoPylnNm', align : 'center',title : titleList[cnt++],width : '100'},                 //상위국 철탑 내용
			{key : 'umtsoPylnTypVal', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 철탑 유형
			{key : 'umtsoPylnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},            //상위국 철탑 높이
			{key : 'umtsoPylnOwnrNm', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 철탑 소유주
			{key : 'lmtsoPylnNm', align : 'center',title : titleList[cnt++],width : '100'},                 //하위국 철탑 내용
			{key : 'lmtsoPylnTypVal', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 철탑 유형
			{key : 'lmtsoPylnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},            //하위국 철탑 높이
			{key : 'lmtsoPylnOwnrNm', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 철탑 소유주
			{key : 'atnVendNm', align : 'center',title : titleList[cnt++],width : '100'},                   //안테나 제조사
			{key : 'umtsoAtnSizeVal', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 안테나 크기(ft)
			{key : 'umtsoAtnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 Main/SD 높이(m)
			{key : 'umtsoAtnPolwvDivVal', align : 'center',title : titleList[cnt++],width : '100'},         //상위국 안테나 SP/DP
			{key : 'lmtsoAtnSizeVal', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 안테나 크기(ft)
			{key : 'lmtsoAtnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 Main/SD 높이(m)
			{key : 'lmtsoAtnPolwvDivVal', align : 'center',title : titleList[cnt++],width : '100'},         //하위국 안테나 SP/DP
            {key : 'eqpChkComStdYrVal', align : 'center',title : titleList[cnt++],width : '120'},           //EOS/EOL 공통부
            {key : 'eqpChkChnlStdYrVal', align : 'center',title : titleList[cnt],width : '120'}           	//EOS/EOL 채널부
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});

		cnt = 0;
		titleList = [
			"구간관리번호","채널","주파수","ODU Type","변조방식","대역폭","용량(Mbit/s)","보호방식"
			];

		//그리드 생성
		$('#'+gridId2).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '10row',
			fitTableWidth : true,
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: [
				{
					key : 'mwSctnId', align : 'center',title : titleList[cnt++],width : '100'}, {					//마이크로웨이브구간id
					key : 'mwChnlNoVal', align : 'center',title : titleList[cnt++],width : '100'}, {    			//마이크로웨이브채널번호값
					key : 'mwFreqVal', align : 'center',title : titleList[cnt++],width : '100'}, {                  //마이크로웨이브주파수값
					key : 'odrUnitTypVal', align : 'center',title : titleList[cnt++],width : '100'}, {              //실외단위유형값
					key : 'mwModulMeansVal', align : 'center',title : titleList[cnt++],width : '100'}, {            //마이크로웨이브변조방식값
					key : 'mwBdwhVal', align : 'center',title : titleList[cnt++],width : '100'}, {                  //마이크로웨이브대역폭값
					key : 'chnlCapaVal', align : 'center',title : titleList[cnt++],width : '100'}, {                //채널용량값
					key : 'protMeansVal', align : 'center',title : titleList[cnt],width : '100'}                    //보호방식값
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	},

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    setSelectCode : function(){
    	$("#searchMwDivVal").clear();
    	$("#searchMwDivVal").setData({data : mwDivValOptions, searchMwDivVal:''});

    	$("#searchUsgDivVal").clear();
    	$("#searchUsgDivVal").setData({data : usgDivValOptions, searchUsgDivVal:''});

    	$("#searchVender").clear();
    	$("#searchVender").setData({data : venderOptions, searchVender:''});
    },

	setGrid : function(page, rowPerPage){
		let param = {};

		$('#'+gridId).alopexGrid('dataEmpty');
		$('#'+gridId2).alopexGrid('dataEmpty');

		DsnMwControll.getMwSctnList(page, rowPerPage);

	},

	setGrid2 : function(param, page, rowPerPage){
		$('#'+gridId2).alopexGrid('dataEmpty');

		DsnMwControll.getFreqList(paramMwSctnId, page, rowPerPage);

	},

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    setEventListener : function() {

    	$("#btnReg").on("click", function() {
    		let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;

		    $a.popup({
		    	popid: tmpPopId,
				url: '/tango-transmission-web/trafficintg/engineeringmap/DsnMwDtlPopup.do',
				title: 'M/W 구간 정보',
//				iframe: false,
				modal: true,
				windowpopup: true,
				width: 1600,
				height: 870,
				center: true,
				movable: true,
				callback : function(data) {
					$('#btnSearch').click();
				}
			});
    	});

    	let perPage = 100;

    	// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			$('#mwSctnId').val("");
			let eObj = AlopexGrid.parseEvent(e);
			DsnMwControll.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			$('#mwSctnId').val("");
			let eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			DsnMwControll.setGrid(1, eObj.perPage);
		});

		// 더블 클릭시
		$('#'+gridId).on('dblclick', function(e){
			let dataObj = AlopexGrid.parseEvent(e);

			let params = {};
			params.mwSctnId = dataObj.data["mwSctnId"];

			let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;

		    $a.popup({
		    	popid: tmpPopId,
				url: '/tango-transmission-web/trafficintg/engineeringmap/DsnMwDtlPopup.do',
				title: 'M/W 구간 정보',
//				iframe: false,
				data: params,
				modal: true,
				windowpopup: true,
				width: 1600,
				height: 870,
				center: true,
				movable: true,
				callback : function(data) {
					$('#btnSearch').click();
				}
//				url: '/tango-transmission-web/trafficintg/engineeringmap/DsnMwDtlPopup.do',
//				title: 'M/W 구간 정보',
//				iframe: false,
//				modal: false,
//				data: params,
//				windowpopup: true,
//				width: 1600,
//				height: 870,
//				center: true,
//				movable: true
			});
		});

    	// 조회
   	 	$('#btnSearch').on('click', function(e) {
   	 		$('#mwSctnId').val("");
   	 		DsnMwControll.setGrid(1, perPage);
        });

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
	   	 		$('#mwSctnId').val("");
				DsnMwControll.setGrid(1, perPage);
			}
		});

		// 주파수 정보 조회
		$('#'+gridId).on('click', '.bodycell', function(e){
			let dataObj = AlopexGrid.parseEvent(e).data;
			paramMwSctnId = {mwSctnId: dataObj.mwSctnId};
			perPage = 100;

 			DsnMwControll.getFreqList(paramMwSctnId, 1, perPage);

		});

		// 주파수 페이지 번호 클릭시
   	 	$('#'+gridId2).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	DsnMwControll.setGrid2(paramMwSctnId, eObj.page, eObj.pageinfo.perPage);
        });

   	 	// 주파수 페이지 selectbox를 변경했을 시.
        $('#'+gridId2).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	DsnMwControll.setGrid2(paramMwSctnId, 1, eObj.perPage);
        });

		// excel download
    	$('#btnTesExportExcel').on('click', function(e) {
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
			}

			var param =  $("#searchForm").getData();

			param = DsnMwControll.gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 60;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();

			var now = new Date();
			var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
			var excelFileNm = 'MW구간정보_'+dayTime;
			param.fileName = excelFileNm;
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.excelMethod = "getTesDsnMwList";
			param.excelFlag = "TesDsnMwList";
			//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
			fileOnDemendName = excelFileNm+".xlsx";

    		$('#'+gridId).alopexGrid('showProgress');
    		DsnMwControll.httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
      	 });
	},

	gridExcelColumn : function(param, gridId) {
		var gridHeaderGroup = [
  			{fromIndex:0,   toIndex:9,  title:'M/W 구간 정보'},
  			{fromIndex:10,  toIndex:17,  title:'E2E 정보'},
  			{fromIndex:18,  toIndex:19,  title:'장비 현황'},
  			{fromIndex:20,  toIndex:22,  title:'무선 현황'},
  			{fromIndex:23,  toIndex:30,  title:'철탑 현황'},
  			{fromIndex:31,  toIndex:37,  title:'안테나 현황'}
		]

		var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

		for(var i=gridHeaderGroup.length-1; i>=0; i--) {
			if (gridHeaderGroup[i].title != undefined) {
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		};

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {
			hidden:false
		});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined
					&& gridHeader[i].key != "id")) {
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

		return param;
	},

	/*-----------------------------*
	 *  성공처리
	 *-----------------------------*/
	successCallback : function(response, status, jqxhr, flag){
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
	        var jobInstanceId = response.resultData.jobInstanceId;
	        DsnMwControll.onDemandExcelCreatePop ( jobInstanceId );
	    }
	},

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    failCallback : function(response, status, jqxhr, flag){
    	if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
    },

    onDemandExcelCreatePop : function( jobInstanceId ){
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
	},

	/*-----------------------------*
	 *  HTTP
	 *-----------------------------*/
	httpRequest : function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(DsnMwControll.successCallback)
		  .fail(DsnMwControll.failCallback);
	}
}
