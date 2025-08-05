/**
 * UpsdMtsoList.js
 *
 * @author Administrator
 * @date 2017. 7. 12.
 * @version 1.0
 */
var L;

var main = $a.page(function() {

	var gridId = 'dataGrid';
	//var floorGrid = 'floorGrid'
	var fileOnDemendName = "";
	var floorParam = "";
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
		//main.setGrid(1,100);
	};

	//Grid 초기화
	function initGrid() {
		AlopexGrid.setup({
			renderMapping : {
				"bargraph" : {
					renderer : function(value, data, render, mapping) {
						var rule = render.rule;
						var percentage = 0;

						if(rule) {
							var min = rule[0];
							var max = rule[1];
							if(typeof min === "string") {
								min = parseFloat(data[min]);
							}
							if(typeof max === "string") {
								max = parseFloat(data[max]);
							}
							if(typeof min === "number" && typeof max === "number") {
								percentage = parseInt((value-min)/(max-min)*100);
								percentage = Math.min(Math.max(0,percentage),100);
							}
						}
						//http://omnipotent.net/jquery.sparkline/#hidden : jQuery sparkline
						if(percentage >= 80){
							return '<div class="progress_container"><div class="percentage-bar_green" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}else if(percentage <=25){
							return '<div class="progress_container"><div class="percentage-bar_red" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}else{
							return '<div class="progress_container"><div class="percentage-bar_yellow" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}
					}
				}
			},
		});

		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
		,hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '8row',
			autoResize: true,
			numberingColumnFromZero: false,
			headerGroup: [
				{fromIndex:16, toIndex:21, title:'TANGO'},
				{fromIndex:22, toIndex:25, title:'NAMS'}
				],
				columnMapping: [{
					align:'center',
					title : 'No.',
					width: '30',
					resizing: false,
					numberingColumn: true
				}, {
					key : 'workGubun', align:'center',
					title : '관리그룹',
					width: '70',
					render: function(data,value){
						if(data == ''||data == null){
							return 'SKT';
						}else{
							return data;
						}
					}
				}, {/* 본부			 */
					key : 'orgNm', align:'center',
					title : '본부',
					width: '90px'
				}, {/* 팀	 */
					key : 'teamNm', align:'center',
					title : '팀',
					width: '90px'
				}, {/* 전송실 		 */
					key : 'tmofNm', align:'center',
					title : '전송실',
					width: '150px'
				},  {
					key : 'mtsoTyp', align : 'center',
					title : '국사유형',
					width : '90' //MTSO_TYP
				},  {
					key : 'mtsoId', align : 'center',
					title : '국사ID(통합국ID)',
					width : '130' //MTSO_TYP
				},  {
					key : 'sisulNm', align : 'center',
					title : '국사명(통합국명)',
					width : '200' //MTSO_TYP
				},  {
					key : 'floorLabel', align : 'center',
					title : '층정보',
					width : '200' //MTSO_TYP
				},  {
					key : 'label', align : 'center',
					title : '랙명',
					width : '200' //MTSO_TYP
				},  {
					key : 'sPos', align : 'center',
					title : '랙시작위치',
					width : '90' //MTSO_TYP
				},  {
					key : 'ePos', align : 'center',
					title : '랙종료위치',
					width : '90' //MTSO_TYP
				}, {
					key : 'systemNm', align : 'center',
					title : '실장장비명',
					width : '250'
				}, {
					key : 'cstrCd', align : 'center',
					title : '공사코드',
					width : '150'
				}, {
					key : 'barCode', align : 'center',
					title : '바코드',
					width : '150'
				}, {
					key : 'setlObjNm', align : 'center',
					title : '임대차 정산대상',
					width : '150'
				}, {
					key : 'eqpId', align : 'center',
					title : '장비ID',
					width : '120'
				}, {
					key : 'eqpNm', align : 'center',
					title : '장비명',
					width : '250'
				}, {
					key : 'eqpTid', align : 'center',
					title : '장비 TID',
					width : '100'
				}, {
					key : 'eqpRoleDivNm1', align : 'center',
					title : '장비용도',
					width : '90'
				}, {
					key : 'eqpStatNm', align : 'center',
					title : '상태',
					width : '90'
				}, {
					key : 'eqpId', align : 'center',
					title : '상세보기',
					width : '90',
					render : function(value, data, render, mapping){
						if(data.eqpId != null && data.eqpId != ''){
							return '<div style="width: 100%;"><button type="button" id="btnMtso" style="cursor: pointer"><span class="Icon Th-list"></span></button></div>'
						}
					}
				}, {
					key : 'namsMatlNm', align : 'center',
					title : '장비명',
					width : '250'
				}, {
					key : 'eqpMdlNm', align : 'center',
					title : '장비모델명',
					width : '100'
				}, {
					key : 'eqpRoleDivNm2', align : 'center',
					title : '장비용도',
					width : '100'
				}, {
					key : 'erpIntgFcltsNm', align : 'center',
					title : '장비-통합시설명',
					width : '200'
				}
				],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	};

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var searchInspectCd = {supCd : '007000'};
		var searchGubun = {supCd : '008000'};
		var searchWorkGubun = "SKT";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ searchWorkGubun, null, 'GET', 'fstOrg');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchInspectCd, 'GET', 'searchInspectCd');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchGubun, 'GET', 'searchGubun');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');
	}


	function setEventListener() {

		var perPage = 100;

		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			main.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage);
		});

		//조회
		$('#btnSearch').on('click', function(e) {
			main.setGrid(1,perPage);
		});


		//엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				main.setGrid(1,perPage);
			}
		});

		$('#searchWorkGubun').on('change', function(e) {

   		 var mgmtGrpNm = $("#searchWorkGubun").val();

   		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

   		 var option_data =  null;
			if($('#searchWorkGubun').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCdList').setData({
                data:option_data
			});

        });

   	//본부 선택시 이벤트
   	 $('#orgId').on('change', function(e) {

   		 var orgID =  $("#orgId").getData();

   		 if(orgID.orgId == ''){
   			 var mgmtGrpNm = $("#searchWorkGubun").val();

   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
   		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

   		 }else{
   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
   		 }
        });
  // 	팀을 선택했을 경우
	 $('#teamId').on('change', function(e) {

		 var orgID =  $("#orgId").getData();
		 var teamID =  $("#teamId").getData();

 	 	 if(orgID.orgId == '' && teamID.teamId == ''){
 	 		 var mgmtGrpNm = $("#searchWorkGubun").val();

		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
 	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
 		 }else if(orgID.orgId != '' && teamID.teamId == ''){
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
 		 }else {
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
 		 }

	 });

	 $('#'+gridId).on('click', '#btnMtso', function(e){
		 var dataObj = AlopexGrid.parseEvent(e).data;
	   	var data = {eqpId:dataObj.eqpId, fromE2E: 'Y'};
	   	/****************************************************************************
    	*	New Popup Start
    	*****************************************************************************/
    	var tmpPopId = "E_"+Math.floor(Math.random() * 10) + 1;
    	var paramData = {mtsoEqpGubun :'eqp', mtsoEqpId : dataObj.eqpId, parentWinYn : 'Y', fromE2E : "Y"};
		var popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			data: paramData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 900,
			height : window.innerHeight
		});
		//setTimeout(window.close(), 7000);
		/****************************************************************************
    	*	New Popup End
    	*****************************************************************************/

//	   	var tmpEqp = dataObj.eqpId.substring(0,2);
//			if (tmpEqp == "SE") {
//				var tmpGubun = dataObj.eqpId.substring(2,3);
//				var tmpUrl = "";
//				switch(tmpGubun) {
//		     	 	case 'E':
//		     	 		tmpUrl = "SbeqpMgmtEtcDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtEtcDtlLkup.do?sbeqpId="+eqpId, '부대장비기타장비상세정보',eqpId);
//		     	 		break;
//		     	 	case 'R':
//		     	 		tmpUrl = "SbeqpMgmtRtfDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfDtlLkup.do?sbeqpId="+eqpId, '부대장비정류기상세정보',eqpId);
//		     	 		break;
//		     	 	case 'M':
//		     	 		tmpUrl = "SbeqpMgmtRtfMdulDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfMdulDtlLkup.do?sbeqpId="+eqpId, '부대장비정류기모듈상세정보',eqpId);
//		     	 		break;
//		     	 	case 'B':
//		     	 		tmpUrl = "SbeqpMgmtBatryDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryDtlLkup.do?sbeqpId="+eqpId, '부대장비배터리상세정보',eqpId);
//		     	 		break;
//		     	 	case 'A':
//		     	 		tmpUrl = "SbeqpMgmtArcnDtlLkup.do";
//		     	 	//	popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtArcnDtlLkup.do?sbeqpId="+eqpId, '부대장비냉방기상세정보',eqpId);
//		     	 		break;
//		     	 	case 'F':
//		     	 		tmpUrl = "SbeqpMgmtFextnDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnDtlLkup.do?sbeqpId="+eqpId, '부대장비소화설비상세정보',eqpId);
//		     	 		break;
//		     	 	case 'N':
//		     	 		tmpUrl = "SbeqpMgmtGntDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGntDtlLkup.do?sbeqpId="+eqpId, '부대장비발전기상세정보',eqpId);
//		     	 		break;
//		     	 	case "L" :
//		     	 		tmpUrl = "SbeqpMgmtCbplDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtCbplDtlLkup.do?sbeqpId="+eqpId, '부대장비분전반상세정보',eqpId);
//		     		 	break;
//		     	 	case "S" :
//		     	 		tmpUrl = "SbeqpMgmtExstrDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtExstrDtlLkup.do?sbeqpId="+eqpId, '부대장비배풍기상세정보',eqpId);
//		     		 	break;
//		     	 	case "I" :
//		     	 		tmpUrl = "SbeqpMgmtIvtrDtlLkup.do";
//		     	 		//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIvtrDtlLkup.do?sbeqpId="+eqpId, '부대장비인버터상세정보',eqpId);
//		     		 	break;
//		     	 	case "C" :
//		     	 		tmpUrl = "SbeqpMgmtContrDtlLkup.do";
//		     			//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtContrDtlLkup.do?sbeqpId="+eqpId, '부대장비컨버터상세정보',eqpId);
//		     		 	break;
//		     		case "T" :
//		     			tmpUrl = "SbeqpMgmtTvssDtlLkup.do";
//		     			//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtTvssDtlLkup.do?sbeqpId="+eqpId, '부대장비TVSS상세정보',eqpId);
//		     		 	break;
//		     		case "P" :
//		     			tmpUrl = "SbeqpMgmtIpdDtlLkup.do";
//		     			//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIpdDtlLkup.do?sbeqpId="+eqpId, '부대장비IPD상세정보',eqpId);
//		     		 	break;
//		     		case "G" :
//		     			tmpUrl = "SbeqpMgmtGageDtlLkup.do";
//		     			//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGageDtlLkup.do?sbeqpId="+eqpId, '부대장비계량기함상세정보',eqpId);
//		     		 	break;
//		     	 	default :
//	     	 		break;
//	     	 	}
//				tmpUrl = "/tango-transmission-web/configmgmt/sbeqpmgmt/"+tmpUrl+"?sbeqpId="+dataObj.eqpId;
//				 $a.popup({
//					 title: '장비상세보기',
//					 url: tmpUrl,
//					 data: '',
//					 windowpopup: true,
//					 modal: false,
//					 width : '865',
//					 height : window.innerHeight * 0.75,
//				 });
//			} else {
//				 $a.popup({
//					 title: '장비상세보기',
//					 url: '/tango-transmission-web/configmgmt/equipment/EqpDtlLkupPop.do',
//					 data: data,
//					 windowpopup: true,
//					 modal: false,
//					 width : '865',
//					 height : window.innerHeight * 0.75,
//				 });
//			}





	     	 //popup('EqpDtlLkup', '/tango-transmission-web/configmgmt/equipment/EqpDtlLkup.do', "장비 상세보기",dataObj);

		});
		/*    	//국사층 구분 팝업
    	 $('#'+gridId).on('click', '#floorBtn', function(e){
    		 var dataObj = AlopexGrid.parseEvent(e).data;
    		 var data = {sisulCd: dataObj.sisulCd};
    		 $a.popup({
    			 title: '국사 층 구분',
    			 url: $('#ctx').val()+'/configmgmt/upsdmgmt/UpsdMtsoFloorList.do',
    			 data: data,
    			 iframe: false,
    			 windowpopup: true,
    			 modal: false,
    			 width : window.innerWidth * 0.9,
    			 height : window.innerHeight * 0.8,
    		 });
 		});*/

		 var option_data =  null;
			if($('#searchWorkGubun').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCdList').setData({
              data:option_data
			});

		//엑셀다운
		$('#btnExportExcel').on('click', function(e) {
			btnExportExcelOnDemandClickEventHandler(e);
			//tango transmission biz 모듈을 호출하여야한다.

			//tango transmission biz 모듈을 호출하여야한다.
//			var param =  $("#searchForm").getData();
//			console.log(param.searchWorkGubun);
//			console.log(param.tmofList);
//			console.log(param.searchWorkGubun);
//			console.log(param.searchWorkGubun);
//			console.log(param.searchWorkGubun);
//			console.log(param.searchWorkGubun);
//
//			param = gridExcelColumn(param, gridId);
//			param.pageNo = 1;
//			param.rowPerPage = 10;
//			param.firstRowIndex = 1;
//			param.lastRowIndex = 1000000000;//
///*
//			tmofList
//			mtsoCntrTypCdList
//			mtsoTypCdList
//			*/
//
//			var tmofList_Tmp = "";
//			var mtsoCntrTypCdList_Tmp = "";
//			var mtsoTypCdList_Tmp = "";
//			if (param.tmofList != "" && param.tmofList != null ){
//	   			 for(var i=0; i<param.tmofList.length; i++) {
//	   				 if(i == param.tmofList.length - 1){
//	   					tmofList_Tmp += param.tmofList[i];
//	                    }else{
//	                    	tmofList_Tmp += param.tmofList[i] + ",";
//	                    }
//	    			}
//	   			param.tmofList = tmofList_Tmp ;
//	   		 }
//
//
//			if (param.mtsoCntrTypCdList != "" && param.mtsoCntrTypCdList != null ){
//	   			 for(var i=0; i<param.mtsoCntrTypCdList.length; i++) {
//	   				 if(i == param.mtsoCntrTypCdList.length - 1){
//	   					mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i];
//	                    }else{
//	                    	mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i] + ",";
//	                    }
//	    			}
//	   			param.mtsoCntrTypCdList = mtsoCntrTypCdList_Tmp ;
//	   		 }
//
//			if (param.mtsoTypCdList != "" && param.mtsoTypCdList != null ){
//	   			 for(var i=0; i<param.mtsoTypCdList.length; i++) {
//	   				 if(i == param.mtsoTypCdList.length - 1){
//	   					mtsoTypCdList_Tmp += param.mtsoTypCdList[i];
//	                    }else{
//	                    	mtsoTypCdList_Tmp += param.mtsoTypCdList[i] + ",";
//	                    }
//	    			}
//	   			param.mtsoTypCdList = mtsoTypCdList_Tmp ;
//	   		 }
//
//			param.fileName = '바코드불일치현황'
//			param.fileExtension = "xlsx";
//			param.excelPageDown = "N";
//			param.excelUpload = "N";
//			param.method = "getInconsistBarCodeList";
//
//			$('#'+gridId).alopexGrid('showProgress');
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/excelcreateInconsistBarCode', param, 'GET', 'excelDownload');
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
	   		param.rowPerPage = 10;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;

	   		if ($("#mtsoTypCdList").val() != "" && $("#mtsoTypCdList").val() != null ){
       			param.mtsoTypCdList = $("#mtsoTypCdList").val() ;
       		 }else{
       			param.mtsoTypCdList = [];
       		 }

	   		if ($("#mtsoCntrTypCdList").val() != "" && $("#mtsoCntrTypCdList").val() != null ){
       			param.mtsoCntrTypCdList = $("#mtsoCntrTypCdList").val() ;
       		 }else{
       			param.mtsoCntrTypCdList = [];
       		 }

	   		if ($("#tmofList").val() != "" && $("#tmofList").val() != null ){
       			param.tmofList = $("#tmofList").val() ;
       		 }else{
       			param.tmofList = [];
       		 }
	   		param.searchWorkGubun = $('#searchWorkGubun').val();
	   		console.log(param);
       	 /* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = '상면실장현황_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getInconsistBarCodeList";
	   		param.excelFlag = "InconsistBarCodeMgmt";
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
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex-1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex-1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		};


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
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){

		//층 삭제
		if(flag == 'floorUseYn'){
			main.floorGridRefresh();
		}

		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		if(flag == 'fstOrg'){
			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}
			$('#orgId').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    			if(resObj.orgId == sUprOrgId) {
							selectId = resObj.orgId;
						}
		    		}
		    		if(selectId == null){
		    			selectId = response[0].orgId;
		    			sUprOrgId = selectId;
		    		}
		    		$('#orgId').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   	}

		if(flag == 'fstTeam'){
    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamId').clear();

      		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#teamId').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#teamId').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}
		if(flag == 'team'){
    		$('#teamId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#teamId').setData({
                 data:option_data
    		});
    	}
		if(flag == 'tmof'){
    		$('#tmofList').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmofList').setData({
                 data:option_data
    		});
    	}


		if(flag == 'mtsoCntrTypCdList') {
    		$('#mtsoCntrTypCdList').clear();

    		var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
	             data:option_data
			});
    	}

		if(flag == 'opTeam'){
    		$('#opTeamOrgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#opTeamOrgId').setData({
                 data:option_data
    		});
    	}

		//용도구분
		if(flag == 'searchGubun'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		//국사 조회시
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.barCodeList);
		}

		//국사 조회시
		if(flag == 'mtsoDtlLkup'){
			$('body').progress().remove();
			$a.popup({
				popid: 'MtsoDtlLkup',
				title: '국사 상세정보',
				url: $('#ctx').val()+'/configmgmt/common/MtsoDtlLkup.do',
				data: response.mtsoMgmtList[0],
				iframe: false,
				modal: true,
				movable:true,
				width : 865,
				height : window.innerHeight * 0.8
			});
		}

		if(flag == 'mtsoMapInf'){
			var data = {
						mtsoId:response.mtsoMgmtList[0].mtsoId
						, mtsoNm: response.mtsoMgmtList[0].mtsoNm
						, mtsoTyp: response.mtsoMgmtList[0].mtsoTyp
						, mtsoStat: response.mtsoMgmtList[0].mtsoStat
						, bldAddr: response.mtsoMgmtList[0].bldAddr
						, mtsoLatVal: response.mtsoMgmtList[0].mtsoLatVal
						, mtsoLngVal: response.mtsoMgmtList[0].mtsoLngVal
						, moveMap: true //지도이동 안하겠다.
						};

	   		//GIS 국사관리번호 조회 지도에 표시

    		setTimeout(function(){
    			gisM(data);
			}, 5000);
		}

		if(flag == 'excelDownload'){
			$('#'+gridId).alopexGrid('hideProgress');
			//console.log('excelCreate');
			//console.log(response);

			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
		}

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
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
	}

	this.setGrid = function(page, rowPerPage){

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param =  $("#searchForm").serialize();

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getInconsistBarCodeList', param, 'GET', 'search');
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

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

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
	function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.8
              });
        }
});

