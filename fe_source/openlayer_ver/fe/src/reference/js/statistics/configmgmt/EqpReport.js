/**
 * EqpReport.js
 *
 * @author P123512
 * @date 2018.01.30
 * @version 1.0
 */
var main = $a.page(function() {
	var whole = cflineCommMsgArray['all'] /* 전체 */;
	var gridId = 'dataGrid';
	var fileOnDemendName = "";
	var eqpRoleDivCdList;
	var bpIdList;
	
	var mgmtId = null;
	var teamIdVal = null;
	var mtsoCdVal = null;
	var bonbuCdVal = null;
	
	var teamNmVal = null;
	var mtsoNmVal = null;
	var bonbuNmVal = null;
	var mtsoCntrNmVal = null;
	
	var bpId = null;
	var eqpMdlId =  null;
	var eqpRoleDivCd = null;
	var backboneNetworkEqp = null;
	var mtsoCntrTypCd = null;
	
	var tmofCnt = 0;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
		$('.M_SEARCH_AREA').hide();	//기본 전송실이 체크되어있기 때문에 숨김
    	createGrid('', '');
    	setSelectCode();
        setEventListener();
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(){
   	 	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }
		var param = {"mgmtGrpNm": chrrOrgGrpCd}
		//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/group/C00188', null, 'GET', 'mgmtGrpNm');
		//본부 조회
	    httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
	    //장비 역할 조회
   		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
   		//장비모델 조회
   		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/mdl', param, 'GET', 'mdl');
   		//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/bp', param , 'GET', 'bp');

    	// 사용자 소속 전송실
    	searchUserJrdtTmofInfo("tmof");
    }
    
    //중심국사조회
    function searchMtsoCntrTyp() {
		 var orgID =  $("#orgId").getData();
		 var teamID =  $("#teamId").getData();
		 
		 var param = {
				 "mgmtGrpNm": $("#mgmtGrpNm").val()
				 ,"orgId" 	: orgID.orgId
				 ,"teamId"	: teamID.teamId
				 ,"bldChk"	: $("input:checkbox[id='bldChk']").is(":checked")
		 };

	 	 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/mtsoCntrTyp', param, 'GET', 'mtsoCntrTyp');
    }
    
    function setEventListener() {
      	// 숫자를 더블클릭했을 때 
 		$('#'+gridId).on('click', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			var dataKey = dataObj._key;
 			var data = $('#' + gridId).alopexGrid('dataGet', {_state: {selected: true}});
 			var eventCellVal = parseInt( AlopexGrid.currentValue(dataObj,  dataKey) );
     	 	if (dataKey == "CNTTOT" || (dataKey.indexOf("MO") >= 0 && eventCellVal >= 1 ) || (dataKey.indexOf("1430")>= 0 && eventCellVal >= 1) 
     	 			|| (dataKey.indexOf("1000") >= 0 && eventCellVal >= 1) || (dataKey.indexOf("21") >= 0 && eventCellVal >= 1) || (dataKey.indexOf("22") >= 0 && eventCellVal >= 1) ) {
     	 		detailPop(dataObj);
     	 	}
 		});
    	
     	//조회 
     	 $('#btnSearch').on('click', function(e) {
     		$('#btnExportExcel').setEnabled(false);
        	var dataParam =  $("#searchForm").getData(); 
        	
        	if($('#mgmtGrpNm').val() == "SKT" )
        		mgmtId = "0001";
        	else 
        		mgmtId = "0002";
        	
        	bpId = $('#bpIdList').val();
        	eqpMdlId = $('#eqpMdlIdList').val();
        	eqpRoleDivCd = $('#eqpRoleDivCdList').val();
        	
        	mtsoNmVal = $('#tmof').getTexts()[0];
        	teamNmVal = $('#teamId').getTexts()[0];
        	bonbuNmVal = $('#orgId').getTexts()[0];
        	
        	if($('#tmof').val() == '') {
        		mtsoNmVal = null;
        	} 
        	if($('#teamId').val() == '') {
        		teamNmVal = null;
        	}
        	if($('#orgId').val() == '') {
        		bonbuNmVal = null;
        	}
        	
        	dataParam.showBonbu = $("input:radio[id='showBonbu']").is(":checked");
        	dataParam.showTeam = $("input:radio[id='showTeam']").is(":checked");
        	dataParam.showMtso = $("input:radio[id='showMtso']").is(":checked");
        	dataParam.showMtsoCntrTyp = $("input:radio[id='showMtsoCntrTyp']").is(":checked");	//국사(중심국사)추가
        	dataParam.backboneNetworkEqp = $("input:checkbox[id='backboneNetworkEqp']").is(":checked");

        	dataParam.bldChk = $("input:checkbox[id='bldChk']").is(":checked");	//건물통합조회
        	backboneNetworkEqp = $("input:checkbox[id='backboneNetworkEqp']").is(":checked");
        	
        	if(dataParam.showMtso == true) {
	        	if(tmofCnt == 0) {
	   				alertBox('I', '선택하신 본부, 팀에 해당하는 전송실이 없습니다. 본부, 팀 체크 후 조회를 해주세요');
	   				return;
	        	}
        	} else {
        		dataParam.tmofCnt = tmofCnt;
        	}
        	
        	if(dataParam.showMtsoCntrTyp == true) {
        		if($('#mtsoCntrText').val() == '') {
        			if($('#mtsoCntrTypCdList').val() == '' && $('#teamId').val() == '') {
		   				alertBox('I', '국사를 선택 또는 입력하지 않으시는 경우에는 반드시 본부/팀을 선택해주세요.');
		   				return;
	        		}
        		}
        	}
        	
        	cflineShowProgressBody();
        	
        	if(dataParam.mgmtGrpNm == "SKT") {
        		dataParam.mgmtGrpCd = "0001";
        	} else {
        		dataParam.mgmtGrpCd = "0002";
        	}
        	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/geteqpreportlist', dataParam,'GET', 'getEqpReportList');
          });
         
       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {
    		 $('#btnExportExcel').setEnabled(false);
    		 var mgmtGrpNm = $("#mgmtGrpNm").val();
    		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/eqpRoleDiv/C00148/'+ mgmtGrpNm, null, 'GET', 'eqpRoleDivCd');
    		 //장비모델 조회
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/mdl', param,'GET', 'mdl');
    		 //제조사 조회
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/bp', param,'GET', 'bp');
    		 
         });

         //본부 선택시 이벤트
    	 $('#orgId').on('change', function(e) {
    		 var orgID =  $("#orgId").getData();
    		 
    		 if(orgID.orgId == ''){
    			 var mgmtGrpNm = $("#mgmtGrpNm").val();
    			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/org/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }

     	 	 //중심국사조회
     	 	 searchMtsoCntrTyp();
         });
    	 
    	 // 팀을 선택했을 경우
    	 $('#teamId').on('change', function(e) {
    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();
     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		 var mgmtGrpNm = $("#mgmtGrpNm").val();
			     httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }
     	 	 
     	 	 //중심국사조회
     	 	 searchMtsoCntrTyp();
    	 });
    	 
    	 $('#eqpRoleDivCdList').on('change', function(e) {
			 eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
     		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
     		 var cnt = 0;
     		 if(eqpRoleDivCdList == ''){
     		 }else {
 				param += "&eqpRoleDivCd=" + eqpRoleDivCdList;
     		 }
     		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/mdl', param,'GET', 'mdl');
     		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/bp', param,'GET', 'bp');
     		 
    	 });
     	 

    	 $('#bpIdList').on('change', function(e) {
    		 bpIdList = $("#bpIdList").getData().bpIdList;
     		 var eqpRoleDivCd =  $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
     		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
     	 	 if(bpIdList == '' && eqpRoleDivCd == ''){
     	 	 }else if(bpIdList == '' && eqpRoleDivCd != ''){
     	 		 param += "&eqpRoleDivCd=" + eqpRoleDivCd;
     		 }else if(bpIdList != '' && eqpRoleDivCd == ''){
     			 param += "&bpId=" + bpIdList;
     		 }else{
     			 param += "&eqpRoleDivCd=" + eqpRoleDivCd
     			 param += "&bpId=" + bpIdList;
     		 }
     	 	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/mdl', param,'GET', 'mdl');
    	 });
    	 
         //팀 라디오 버튼 선택시 이벤트
    	 $('#showTeam').on('click', function(e) {
    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();

     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		 var mgmtGrpNm = $("#mgmtGrpNm").val();
			     httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }
     	 	 
     	 	 $('#teamId').attr('disabled',false);
    		 $('#tmof').attr('disabled',true);
    		 $('#tmof').attr("background-color","silver");
    		 $('.M_SEARCH_AREA').hide();
    		 
         });
    	 
         //본부 라디오 버튼 선택시 이벤트
    	 $('#showBonbu').on('click', function(e) {
    		 var orgID =  $("#orgId").getData();
    		 if(orgID.orgId == ''){
    			 var mgmtGrpNm = $("#mgmtGrpNm").val();
    			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/org/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }
    		 $('#teamId').attr('disabled',true);
    		 $('#tmof').attr('disabled',true);
    		 $('.M_SEARCH_AREA').hide();
         });
    	 
         //전송실 라디오 버튼 선택시 이벤트
    	 $('#showMtso').on('click', function(e) {
    		 $('#teamId').attr('disabled',false);
    		 $('#tmof').attr('disabled',false);
    		 $('.M_SEARCH_AREA').hide();
         });
   
    	 //국사 라디오 버튼 선택시 이벤트 - 국사조회 셀렉스 show
    	 $('#showMtsoCntrTyp').on('click', function(e) {
    		 $('.M_SEARCH_AREA').show();

     	 	 //중심국사조회
     	 	 searchMtsoCntrTyp();
         });
    	 
    	 //국사 라디오 버튼 선택시 이벤트 - 국사조회 셀렉스 show
    	 $('#bldChk').on('click', function(e) {
     	 	 //중심국사조회
     	 	 searchMtsoCntrTyp();
         });
    	 
    	 $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
 
	};

    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : '장비총괄현황_'+date,
     		sheetList: [{
     			sheetName: '장비총괄현황_'+date,
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
    }
    
	function createGrid(sType, headerVal) {
		var columnMapping =  [					
							{ key: 'COM_CD_NM', 			align: 'center', 		width: '100px', 		title: cflineMsgArray['equipmentKind']  ,rowspan:true   /* 장비종류 */}
							, { key: 'BP_NM', 		align: 'center', 		width: '200px', 				title: cflineMsgArray['vend']		    ,rowspan:true	/* 제조사 */ }
							, { key: 'EQP_MDL_NM', 			align: 'center', 		width: '200px', 		title: cflineMsgArray['modelName']     					/* 모델명 */ }
							, { key: 'CNTTOT', 		align: 'right', 		width: '100px', 				title: cflineMsgArray['summarization']  ,inlineStyle : {color: 'blue',cursor:'pointer'} ,render : {type: 'string', rule : 'comma'}  /* 합계 */   }
	    ];
		
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: false,
		    cellSelectable : true,
		    rowInlineEdit : false,
		    numberingColumnFromZero : false,
		    height: 450,
		    message : {
		      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
		       	filterNodata: 'No data'
		    },
		    columnMapping: columnMapping
		});
			
		
		if(sType == "bonbu") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: null , hideSortingHandle: true, disableHeaderClickSorting: true});
			
			/**
			 *  본부
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnBonbu
	            ,grouping : {
	            	by : ['COM_CD_NM','BP_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			    
			});
		} else if (sType == "team") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal, hideSortingHandle: true, disableHeaderClickSorting: true});

			/**
			 * 팀
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnTeam
	            ,grouping : {
	            	by : ['COM_CD_NM','BP_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			});
		} else if(sType == "mtso"){
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal, hideSortingHandle: true, disableHeaderClickSorting: true});
			
			/**
			 *  전송실
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnMtso
	            ,grouping : {
	            	by : ['COM_CD_NM','BP_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			});
		} else if(sType == "mtsoCntrTyp"){
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal, hideSortingHandle: true, disableHeaderClickSorting: true});
			
			/**
			 * 국사
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnMtsoCntr
	            ,grouping : {
	            	by : ['COM_CD_NM','BP_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			});
		}
	}
	
	
	//그리드 랜더링
	function renderGrid(addHeader, addColumn) {
		var headerDiv = addHeader;
		var columnDiv = "";

		//칼럼 구성
		if(addColumn != null) {
			//본부 조회
			if($("input:radio[id='showBonbu']").is(":checked")) {
				columnBonbu = columnMapping("bonbu");
				
				if(addColumn != null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : {color: 'blue', cursor:'pointer'} })
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnBonbu.push(val);
					})
				}
				columnDiv = "bonbu";
			}
			//팀 조회
			else if($("input:radio[id='showTeam']").is(":checked")) {
				columnTeam = columnMapping("team");
				
				if(addColumn !=  null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : {color: 'blue', cursor:'pointer'} })
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnTeam.push(val);
					})
				}
				columnDiv = "team";
			}
			//전송실 조회
			else if($("input:radio[id='showMtso']").is(":checked")) {
				columnMtso = columnMapping("mtso");
				
				if(addColumn != null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : {color: 'blue', cursor:'pointer'} })
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnMtso.push(val);
					})
				}
				columnDiv = "mtso";
			}
			//국사 조회
			else if($("input:radio[id='showMtsoCntrTyp']").is(":checked")) {
				columnMtsoCntr = columnMapping("mtsoCntrTyp");
				
				if(addColumn != null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : {color: 'blue', cursor:'pointer'} })
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnMtsoCntr.push(val);
					})
				}
				columnDiv = "mtsoCntrTyp";
			
			} else {
				headerDiv = "";
				columnDiv = "";
			}
		}
	
		createGrid(columnDiv, headerDiv);
	}
	
    //상세팝업
    function detailPop(rowData){
    	var dataKey = rowData._key;
    	var mtsoCntrTypCd = null;
    	var mtsoId = mtsoCdVal;
    	var mtsoCntrTypCdList = $('#mtsoCntrTypCdList').val();
    	
    	if(dataKey.indexOf("T") == 0) {
    		dataKey = dataKey.replace("T", '');
    	}
	
		// 01_1000193937
		if(dataKey.indexOf("_") > 0) {
			mtsoCntrTypCd = dataKey.substring(0,2);
			dataKey = dataKey.substring(3);
		}
    	
    	if(rowData.EQP_ROLE_DIV_CD == null || rowData.EQP_ROLE_DIV_CD == '') {
    		rowData.EQP_ROLE_DIV_CD = eqpRoleDivCd ;
    	}
    	if(rowData.BP_ID == null || rowData.BP_ID == '') {
    		rowData.BP_ID = bpId ;
    	}
    	if(rowData.EQP_MDL_ID == null || rowData.EQP_MDL_ID == '') {
    		rowData.EQP_MDL_ID = eqpMdlId ;
    	}

    	var sqlDiv = "T";
    	var showMtsoCntrTyp = $("input:radio[id='showMtsoCntrTyp']").is(":checked");	//국사추가
    	if(showMtsoCntrTyp) {
    		sqlDiv = "M";
    		if(mtsoCntrTypCdList == null || mtsoCntrTypCdList == '') {
        		mtsoId = dataKey;
    			mtsoCntrTypCdList = dataKey;
    		} else {
        		mtsoId = mtsoCntrTypCdList;
    		}
    	}
    	var bldChk =  $("input:checkbox[id='bldChk']").is(":checked");
    	    	
		var gridData = {  	  "bpId" : rowData.BP_ID
							, "eqpRoleDivCd" : rowData.EQP_ROLE_DIV_CD
							, "eqpMdlId" : rowData.EQP_MDL_ID  
							, "mgmtGrpCd" : mgmtId
							, "eqpMdlNm" :  rowData.EQP_MDL_NM  
							, "bpNm" :  rowData.BP_NM  
							, "comCdNm" :  rowData.COM_CD_NM  
							, "dataKey" : dataKey
							, "bonbuId" : bonbuCdVal
							, "teamId" : teamIdVal
							, "mtsoId" : mtsoId
							, "backboneNetworkEqp" : backboneNetworkEqp
							, "mtsoNmVal" : mtsoNmVal
							, "bonbuNmVal" : bonbuNmVal
							, "teamNmVal" : teamNmVal
							, "tmofCnt" : tmofCnt
							, "showMtsoCntrTyp" : showMtsoCntrTyp
							, "mtsoCntrTypCdList" : mtsoCntrTypCdList
							, "sqlDiv" : sqlDiv
							, "bldChk" : bldChk
							, "mtsoCntrText" : $('#mtsoCntrText').val()
		};
		
		 $a.popup({
 			popid: "EqpReportDetailPop",
 			title: "장비 현황 상세",
 			url: $('#ctx').val()+'/statistics/configmgmt/EqpReportDetailPop.do',
 			data : gridData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1200,
 			height : 650,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}  
		});
   }
	
	
	//컬럼 구성
	function columnMapping(sType) {		
		var mapping = [
						{ key: 'COM_CD_NM', 			align: 'center', 		width: '100px', 		title: cflineMsgArray['equipmentKind']  ,rowspan:true ,excludeFitWidth:true /* 장비종류*/ }
						, { key: 'BP_NM', 		align: 'center', 		width: '200px', 				title: cflineMsgArray['vend']		    ,rowspan:true ,excludeFitWidth:true	 /* 제조사 */ }
						, { key: 'EQP_MDL_NM', 			align: 'center', 		width: '200px', 		title: cflineMsgArray['modelName']      , excludeFitWidth:true			 /* 모델명 */ }
						, { key: 'CNTTOT', 		align: 'right', 		width: '100px', 				title: cflineMsgArray['summarization']  , excludeFitWidth:true ,inlineStyle : {color: 'blue',cursor:'pointer'} ,render : {type: 'string', rule : 'comma'} /*합계*/ }
		               ];

		
		return mapping;
	}
	
	function successCallback(response, status, jqxhr, flag){
		//장비총괄현황 조회
		if(flag == 'getEqpReportList') {
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
			var param =  $("#searchForm").getData();
			
			teamIdVal = param.teamId;
			mtsoCdVal = param.tmof;
			bonbuCdVal = param.orgId;
			
			renderGrid(response.list.headerList, response.list.keyList);
			$('#'+gridId).alopexGrid("dataSet", response.list.getEqpReportList);
		}
		//관리그룹
	 	if(flag == 'mgmtGrpNm'){
    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }
    		
    		$('#mgmtGrpNm').clear();
    		
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];
    		
    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:response ,
					mgmtGrpNm:selectId
				});
			}
    	}
	 	
	 	//본부 콤보박스
		if(flag == 'fstOrg'){
			var bonbuList = [];
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}
			
			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}
  		
			$('#orgId').clear();
	  		
	   		//var selectId = null;
	   		if(response.length > 0){
	    		for(var i=0; i<response.length; i++){
	    			if(i==0){
	    				var dataFst = {"orgId":"","orgNm":whole};
	    				bonbuList.push(dataFst);
	    			}
	    			var resObj = response[i];
	    			bonbuList.push(resObj);
	    		}
	    		$('#orgId').setData({
					data:bonbuList 
				});
	   		}
	   		
	   		if($("#orgId").val() == ""){		//본부 세션값이 없을 경우 해당 팀,전송실 조회
	   			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
	   		} else {			//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   		}
    	}
    	
    	if(flag == 'org'){
    		$('#orgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#orgId').setData({
                 data:option_data
    		});
    	}
    	
    	if(flag == 'fstTeam'){
    		var teamList = [];
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}
        		
    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}
  			
  			$('#teamId').clear();

      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
	    			if(i==0){
	    				var dataFst = {"orgId":"","orgNm":whole};
	    				teamList.push(dataFst);
	    			}
  	    			var resObj = response[i];
  	    			teamList.push(resObj);
  	    		}
  	    		$('#teamId').setData({
  					data:teamList 
  				});
  	    		if($('#teamId').val() != ""){
  	    			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
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
			tmofCnt = 0;
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				tmofCnt++;
			}

			$('#tmof').setData({
	             data:option_data
			});
		}
		
		if(flag == 'mdl'){
			$('#eqpMdlIdList').clear();
			var option_data =  [];
			var fst= {"comCd":"","comCdNm":whole ,"comGrpCd":""};
			for(var i=0; i<response.length; i++){
				if(i == 0) {
					option_data.push(fst);
				}
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#eqpMdlIdList').setData({
	             data:option_data
			});
		}
		
		if(flag == 'bp'){
			$('#bpIdList').clear();
			var option_data =  [];
			var fst= {"comCd":"","comCdNm":whole};
		
			for(var i=0; i<response.length; i++){
				if(i == 0) {
					option_data.push(fst);
				}
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#bpIdList').setData({
	             data:option_data
			});
		}
		
		if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCdList').clear();
    		var option_data =  [];
    		var fst= {"comCd":"","comCdNm":whole ,"comGrpCd":""};
    		
    		for(var i=0; i<response.length; i++){
    			if(i == 0) {
    				option_data.push(fst);
    			}
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#eqpRoleDivCdList').setData({
                 data:option_data
    		});
    		
    	}
    	
    	if(flag == 'eqpStatCd'){
    		$('#eqpStatCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#eqpStatCd').setData({
                 data:option_data
    		});
    	}
    	
    	//국사세부조회
		if(flag == 'mtsoCntrTyp'){
			$('#mtsoCntrTypCdList').clear();
			
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
	             data:option_data
			});
		}
		
		// 관리 본부, 팀, 전송실 조회
		if( flag == 'getMgmtBonbuTeam' ) {
		}
    }

    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'getEqpReportList'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
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