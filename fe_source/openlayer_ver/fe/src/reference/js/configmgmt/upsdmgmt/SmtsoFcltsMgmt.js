/**
 * SmtsoFcltsMgmt.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var detailGridId = 'dataDetailGrid';
	var portGridId = 'dataPortGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();

        $("#rackDetail").hide();
        $("#pwrPort").hide();
		 //main.setGrid(1,100);
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height : '8row',
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
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50',
				resizing: false,
				numberingColumn: true
    		}, {/* modelId */
    			align:'center',
				key : 'modelId',
				title : 'modelId',
				width: '20'
			}, {/* status */
    			align:'center',
				key : 'status',
				title : 'status',
				width: '20'
			}, {
				key : 'workGubun', align:'center',
				title : '관리그룹',
				width: '60',
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
				width: '100px'
			}, {/* 팀	 */
				key : 'teamNm', align:'center',
				title : '팀',
				width: '100px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
			},  {
				key : 'mtsoTyp', align : 'center',
				title : '국사유형',
				width : '90' //MTSO_TYP
			},  {
				key : 'intgMtsoId', align : 'center',
				title : '국사ID(통합국ID)',
				width : '130' //MTSO_TYP
			}, {/* 국사명 */
    			align:'center',
				key : 'sisulNm',
				title : '국사명(통합국명)',
				width: '150'
			}, {/* 국소명 */
    			align:'center',
				key : 'floorName',
				title : '국소명',
				width: '150'
			}, {/* 시설구분 */
    			align:'center',
				key : 'fcltsDiv',
				title : '시설구분',
				resizing: false,
				width: '70'
			},{/* 레이어 */
    			align:'center',
				key : 'layerNm',
				title : '레이어',
				width: '120'
			}, {/* 대분류 */
    			align:'center',
				key : 'lv1Nm',
				title : '대분류',
				width: '70'
			}, {/* 중분류 */
    			align:'center',
				key : 'lv2Nm',
				title : '중분류',
				width: '70'
			}, {/* 소분류 */
    			align:'center',
				key : 'lv3',
				title : '소분류',
				width: '130'
			}, {/* 라벨명 */
    			align:'center',
				key : 'label',
				title : '라벨명',
				width: '150'
			}, {/* 가로(mm) */
    			align:'center',
				key : 'width',
				title : '가로(mm)',
				width: '70'
			}, {/* 세로(mm) */
    			align:'center',
				key : 'length',
				title : '세로(mm)',
				width: '70'
			}, {/* 높이(mm) */
    			align:'center',
				key : 'height',
				title : '높이(mm)',
				width: '70'
			}, {/* UNIT SIZE */
    			align:'center',
				key : 'unitSize',
				title : 'UNIT SIZE',
				width: '70'
			}, {/* 제조사 */
    			align:'center',
				key : 'vendor',
				title : '제조사',
				width: '70'
			}, {/* 모델명 */
    			align:'center',
				key : 'modelNm',
				title : '모델명',
				width: '70'
			}, {/* csType */
    			align:'center',
				key : 'csType',
				title : 'csType',
				width: '70'
			}, {/* 사급/지입여부 */
    			align:'center',
				key : 'csTypeNm',
				title : '사급/지입여부',
				width: '100'
			}, {/* 포트개수 */
    			align:'center',
				key : 'portCnt',
				title : '포트개수',
				width: '70'
			}, {/* 용량(kw) */
    			align:'center',
				key : 'capacity',
				title : '용량(kw)',
				width: '70'
			}, {/* 담당자 */
    			align:'center',
				key : 'manager',
				title : '담당자',
				width: '70'
			}, {/* 비고 */
    			align:'left',
				key : 'description',
				title : '비고',
				width: '150'
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+detailGridId).alopexGrid({
			width : 'parent',
			height : 320,
			fitTableWidth : true,
			autoColumnIndex : true,
			numberingColumnFromZero : false,
			pager : false,
    		paging : {
    			pagerTotal: false,
        	},
			defaultColumnMapping : {
				resizing : true,
			},
			columnMapping : [
				{
					align : 'center',
					width : 20,
					numberingColumn : true
				}, {
					align : 'center',
					width : 50,
					key : 'lv1Nm',
					title : '대분류'
				}, {
					align : 'center',
					width : 50,
					key : 'lv2Nm',
					title : '중분류'
				}, {
					align : 'center',
					width : 50,
					key : 'modelNm',
					title : '모델명'
				}, {
					align : 'center',
					width : 50,
					key : 'vendor',
					title : '제조사'
				}, {
					align : 'center',
					width : 50,
					key : 'unitSize',
					title : 'UNIT_Size'
				}, {
					align : 'center',
					width : 150,
					key : 'systemNm',
					title : '시스템명'
				}, {
					align : 'center',
					width : 50,
					key : 'sPos',
					title : '시작위치'
				}, {
					align : 'center',
					width : 50,
					key : 'ePos',
					title : '종료위치'
				}, {
					align : 'center',
					width : 50,
					key : 'affairCd',
					title : '소유구분'
				}, {
					align : 'center',
					width : 50,
					key : 'manager',
					title : '관리자'
				}
			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

      //그리드 생성
        $('#'+portGridId).alopexGrid({
        	height: 320,
        	//rowInlineEdit: true,
        	//endlnlineEditByOuterClick: true,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		paging : {
    			//pagerSelect: [15,30,60,100],
    			hidePageList: false  // pager 중앙 삭제
    		},
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50',
				numberingColumn: true
    		}, {/* modelId */
    			align:'center',
				key : 'modelId',
				title : 'modelId',
				width: '20'
			}, {/* status */
    			align:'center',
				key : 'status',
				title : 'status',
				width: '20'
			}, {/* 연결여부 */
    			align:'center',
				key : 'gubun',
				title : '연결여부',
				width: '90'
			}, {/* 연결된 장비 소분류 */
    			align:'center',
				key : 'inPortLv3',
				title : '연결된 장비 소분류',
				width: '150'
			}, {/* 연결된 장비 라벨명 */
    			align:'center',
				key : 'inPortNm',
				title : '연결된 장비 라벨명',
				width: '150'
			}, {/* 포트타입 */
    			align:'center',
				key : 'mainGubun',
				title : '포트타입',
				width: '100'
			}, {/* 포트방향 */
    			align:'center',
				key : 'type',
				title : '포트방향',
				width: '100'
			}, {/* 포트위치 */
    			align:'center',
				key : 'pos',
				title : '포트위치',
				width: '100'
			}, {/* 소분류 */
    			align:'center',
				key : 'lv3',
				title : '소분류',
				width: '130'
			}, {/* 라벨명 */
    			align:'center',
				key : 'label',
				title : '라벨명',
				width: '150'
			}, {/* 가로(mm) */
    			align:'center',
				key : 'width',
				title : '가로(mm)',
				width: '70'
			}, {/* 세로(mm) */
    			align:'center',
				key : 'length',
				title : '세로(mm)',
				width: '70'
			}, {/* 높이(mm) */
    			align:'center',
				key : 'height',
				title : '높이(mm)',
				width: '70'
			}, {/* UNIT SIZE */
    			align:'center',
				key : 'unitSize',
				title : 'UNIT SIZE',
				width: '70'
			}, {/* 제조사 */
    			align:'center',
				key : 'vendor',
				title : '제조사',
				width: '70'
			}, {/* 모델명 */
    			align:'center',
				key : 'modelNm',
				title : '모델명',
				width: '70'
			}, {/* csType */
    			align:'center',
				key : 'csType',
				title : 'csType',
				width: '70'
			}, {/* 사급/지입여부 */
    			align:'center',
				key : 'csTypeNm',
				title : '사급/지입여부',
				width: '100'
			}, {/* 담당자 */
    			align:'center',
				key : 'manager',
				title : '담당자',
				width: '70'
			}, {/* 비고 */
    			align:'left',
				key : 'description',
				title : '비고',
				width: '150'
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['modelId', 'status', 'csType', 'portCnt', 'capacity'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+detailGridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+portGridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

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



    	// 레이어 리스트
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/layercode', '', 'GET', 'searchLayer');
    	// 대분류 콤보리스트
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv1CodeList', '', 'GET', 'searchLv1');
    	// 중분류 콤보리스트
    	var lvl2data = {supCd : 'N'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', lvl2data, 'GET', 'searchLv2');
    };

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

        // 페이지 번호 클릭시
	   	 $('#'+portGridId).on('pageSet', function(e){
	   		 var eObj = AlopexGrid.parseEvent(e);
	   		 main.setPortGrid(eObj.page, eObj.pageinfo.perPage);
	   	 });

	   	//페이지 selectbox를 변경했을 시.
	   	 $('#'+portGridId).on('perPageChange', function(e){
	       	var eObj = AlopexGrid.parseEvent(e);
	       	perPage = eObj.perPage;
	       	main.setPortGrid(1, eObj.perPage);
	   	 });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 $('#'+gridId).alopexGrid('dataEmpty');
    		 $('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
    		 $("#rackDetail").hide();
    	     $("#pwrPort").hide();

    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			$('#'+gridId).alopexGrid('dataEmpty');
     			$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
     			$("#rackDetail").hide();
     	        $("#pwrPort").hide();

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



      // 중분류
     	$('#searchLv1').on('change', function(e) {
     		var searchLv1 = $('#searchLv1').val();
     		var lvl2data = {supCd : searchLv1}
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', lvl2data, 'GET', 'searchLv2');
     	});

         $('#'+gridId).on('click', '.bodycell', function(e){
    		 var dataObj = null;
    		 var label = "";
     	 	dataObj = AlopexGrid.parseEvent(e).data;

     	 	if(dataObj.label == undefined){
     	 		label = "없음";
     	 	}else{
     	 		label = dataObj.label;
     	 	}

     	 	/* 장비상세정보    	 */
     	 	if(dataObj.itemType == "rectifier" || dataObj.itemType == "ipd" || dataObj.itemType == "ac_panel"){
     	 		$("#rackDetail").hide();
     	        $("#pwrPort").show();
     	        $("#floorId").val(dataObj.floorId);
     	        $("#itemType").val(dataObj.itemType);
     	       	$("#pLabel").val("전원 포트 (국소명 : "+dataObj.floorName+" , 라벨명 : "+label+")");
     	        $('#'+portGridId).alopexGrid('showProgress');
     	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoFcltsMgmtPwrPortList', dataObj, 'GET', 'pwrPort');
     	 	}else if(dataObj.itemType.indexOf("rack") > -1){
     	 		$("#rackDetail").show();
     	        $("#pwrPort").hide();
    	       	$("#rLabel").val("실장 상세 (국소명 : "+dataObj.floorName+" , 라벨명 : "+label+")");
     	        $('#'+detailGridId).alopexGrid('showProgress');
     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoFcltsMgmtRackDetailList', dataObj, 'GET', 'rackDetail')
     	 	}

    	 });

         $('#'+gridId).on('dblclick', '.bodycell', function(e){
  			var dataObj = AlopexGrid.parseEvent(e).data;
//  			var data = {modelId: dataObj.modelId, sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
  			var data = {itemId: dataObj.modelId};

  			$a.popup({
  				title: '드로잉 툴',
  				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
  				data: data,
  				iframe: false,
  				windowpopup: true,
  				movable:false,
  				width : screen.availWidth,
  				height : screen.availHeight,
  				callback: function(data) {
  				}
  			});
  		});

         // 실장상세 클릭시
 		$('#'+detailGridId).on('dblclick', '.bodycell', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
// 			var data = {modelId: dataObj.modelId, sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
 			var data = {itemId: dataObj.modelId};

 			$a.popup({
 				title: '드로잉 툴',
 				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
 				data: data,
 				iframe: false,
 				windowpopup: true,
 				movable:false,
 				width : screen.availWidth,
 				height : screen.availHeight,
 				callback: function(data) {
 				}
 			});
 		});

 		// 전원포트 클릭시
 		$('#'+portGridId).on('dblclick', '.bodycell', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
// 			var data = {modelId: dataObj.modelId, sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
 			var data = {itemId: dataObj.modelId};

 			$a.popup({
 				title: '드로잉 툴',
 				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
 				data: data,
 				iframe: false,
 				windowpopup: true,
 				movable:false,
 				width : screen.availWidth,
 				height : screen.availHeight,
 				callback: function(data) {
 				}
 			});
 		});

    	//엑셀다운
         $('#btnExportExcel').on('click', function(e){
 			//tango transmission biz 모듈을 호출하여야한다.
     		var param =  $("#searchForm").getData();


     		param = gridExcelColumn(param, gridId);
     		param.pageNo = 1;
     		param.rowPerPage = 10;
     		param.firstRowIndex = 1;
     		param.lastRowIndex = 1000000000;

     		var tmofList_Tmp = "";
			var mtsoCntrTypCdList_Tmp = "";
			var mtsoTypCdList_Tmp = "";
			if (param.tmofList != "" && param.tmofList != null ){
	   			 for(var i=0; i<param.tmofList.length; i++) {
	   				 if(i == param.tmofList.length - 1){
	   					tmofList_Tmp += param.tmofList[i];
	                    }else{
	                    	tmofList_Tmp += param.tmofList[i] + ",";
	                    }
	    			}
	   			param.tmofList = tmofList_Tmp ;
	   		 }


			if (param.mtsoCntrTypCdList != "" && param.mtsoCntrTypCdList != null ){
	   			 for(var i=0; i<param.mtsoCntrTypCdList.length; i++) {
	   				 if(i == param.mtsoCntrTypCdList.length - 1){
	   					mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i];
	                    }else{
	                    	mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoCntrTypCdList = mtsoCntrTypCdList_Tmp ;
	   		 }

			if (param.mtsoTypCdList != "" && param.mtsoTypCdList != null ){
	   			 for(var i=0; i<param.mtsoTypCdList.length; i++) {
	   				 if(i == param.mtsoTypCdList.length - 1){
	   					mtsoTypCdList_Tmp += param.mtsoTypCdList[i];
	                    }else{
	                    	mtsoTypCdList_Tmp += param.mtsoTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoTypCdList = mtsoTypCdList_Tmp ;
	   		 }



     		param.fileName = '국소별자재장비_';
     		param.fileExtension = "xlsx";
     		param.excelPageDown = "N";
     		param.excelUpload = "N";
     		param.method = "getSmtsoFcltsMgmtList";

     		$('#'+gridId).alopexGrid('showProgress');
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/smtsoFcltsMgmtExcelcreate', param, 'GET', 'excelDownload');
 		});
	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/


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
		// 본부
		if(flag == 'searchOrgL1'){
			var option_data = [{cd: '', cdNm: '전체'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				searchOrgL1: ''
			});
	   	}

		// 레이어 리스트
		if(flag == 'searchLayer'){
			var option_data = [{cd: '', cdNm: '전체'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
	   	}

		// 대분류 리스트
		if(flag == 'searchLv1'){
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		// 중분류 리스트
		if(flag == 'searchLv2'){
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

    	// Rack 조회
    	if(flag == 'rack'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.smtsoFcltsMgmtList);
    	}

    	if(flag == 'rackDetail'){

    		$('#'+detailGridId).alopexGrid('hideProgress');
    		$('#'+detailGridId).alopexGrid('dataSet', response.smtsoFcltsMgmtRackDetailList);
    	}

    	if(flag == 'pwrPort'){
    		$('#'+portGridId).alopexGrid('hideProgress');
    		setPortGridData(portGridId, response, response.smtsoFcltsMgmtPwrPortList);
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

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
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    // Rack 장비 그리드 호출
    this.setGrid = function(page, rowPerPage){
    	$('#pageNo').val(page);
   	 	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").serialize();

    	if(param.fcltsDiv == "3"){
    		$('#'+gridId).alopexGrid("showCol", ['portCnt', 'capacity']);
    	}else{
    		$('#'+gridId).alopexGrid("hideCol", ['portCnt', 'capacity'], 'conceal');
    	}

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoFcltsMgmtList', param, 'GET', 'rack');
    }

    this.setPortGrid = function(page, rowPerPage){
    	$('#portPageNo').val(page);
    	$('#portRowPerPage').val(rowPerPage);

    	var param =  $("#portGridForm").getData();

    	$('#'+portGridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoFcltsMgmtPwrPortList', param, 'GET', 'pwrPort');
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
				width : 800,
				height : window.innerHeight * 0.61
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

    function setSPGrid(GridID,Option,Data) {
    	$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
    }

    function setPortGridData(GridID,Option,Data) {
    	$('#'+portGridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+portGridId).alopexGrid('dataSet', Data, serverPageinfo);
    }

});