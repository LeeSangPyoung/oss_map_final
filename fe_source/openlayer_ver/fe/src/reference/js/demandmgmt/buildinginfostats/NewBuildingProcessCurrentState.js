/**
 * BuildConstructCurrentState
 *
 * @author P106861
 * @date 2017. 2. 28. 오전 11:00:00
 * @version 1.0
 */

$a.page(function() {
	
	var m_tabIndex = 0;
	//그리드 ID
    var gridId = 'newBldPrcsCurstGrid';
    var gridId2 = 'newBldPrcsCurstGrid2';
    
    var tabInfo = [
 	              {  gridId : 'newBldPrcsCurstGrid', pageNo: 1, rowPerPage: 1000},
 	              {  gridId : 'newBldPrcsCurstGrid2', pageNo: 1, rowPerPage: 15}]
    
    var m_userBpCd = '';
    var m_bSKT = false;
    var refreshFlag = false;
    var gridDetailId = 'detailGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	var sendparam = {
    			fdaisBp : $('#userBpId').val()
    	};
    	
    	Tango.ajax({
    		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/findUserBpInSKB',
    		data : sendparam,
    		method : 'GET'
    	}).done(function(response){successDemandCallback(response, 'getUserBpInSKB');})
    	  .fail(function(response){failDemandCallback(response, 'getUserBpInSKB');});
    	
    	$('#'+gridDetailId).hide();
    	  
        initGrid();
    	setCombo();
    	setEventListener();
    	
    	$('#comments').val("※ 건축완료는 세움터의 사용승인일과 현장실사의 사용승인일 기준의 데이터입니다.");
    	$('#comments').setEnabled(false);
    };
    
  //Grid 초기화
    function initGrid() {
    	var mapping =  [
			{
				key : 'hdofcNm'
				,align:'center'
				,width:'100px'
				,title : '지역'
			}
			, {
				key : 'hdofcCd'
					,align:'center'
					,width:'100px'
					,title : '지역'
					,hidden : true
				}
			
			, {
				key : 'numBldFnsh'
					,align:'right'
					,width:'80px'
					,title : '건축완료 A'
					,inlineStyle : {
	      	    		color : function(value, data) {
	      	    			if(value != '0')
	      	    				return 'blue';
	      	    		}
					}
				}
			,{
				key : 'numcdLn'
					,align:'right'
					,width:'80px'
					,title : '관로인입 B'
					,inlineStyle : {
	      	    		color : function(value, data) {
	      	    			if(value != '0')
	      	    				return 'blue';
	      	    		}
					}
				}
			,{
				key : 'numlinLn'
					,align:'right'
					,width:'80px'
					,title : '선로인입 C'
					,inlineStyle : {
	      	    		color : function(value, data) {
	      	    			if(value != '0')
	      	    				return 'blue';
	      	    		}
					}
				}
			,{
				key : 'numentSucc'
					,align:'right'
					,width:'80px'
					,title : '진입완료 D'
					,inlineStyle : {
	      	    		color : function(value, data) {
	      	    			if(value != '0')
	      	    				return 'blue';
	      	    		}
					}
				}
			,{
				key : 'numentNot'
					,align:'right'
					,width:'80px'
					,title : '진입불가 E'
					,inlineStyle : {
	      	    		color : function(value, data) {
	      	    			if(value != '0')
	      	    				return 'blue';
	      	    		}
					}
				}
			,{
				key : 'fcdLn'
					,align:'right'
					,width:'80px'
					,title : '관로(B/A)'
					,render : function(value, data) { 
						value += "%";
					    return value;
					 }
				}
			,{
				key : 'flinLn'
					,align:'right'
					,width:'80px'
					,title : '선로(C/A)'
					,render : function(value, data) { 
						value += "%";
					    return value;
					 }
				}
			,{
				key : 'fentSucc'
					,align:'right'
					,width:'80px'
					,title : '가용(D/A)'
					,render : function(value, data) { 
						value += "%";
					    return value;
					 }
				}
			,{
				key : 'fentNot'
					,align:'right'
					,width:'80px'
					,title : '불가(E/A)'
					,render : function(value, data) { 
						value += "%";
					    return value;
					 }
				}
    	];
    	
    	//그리드 생성
    	$('#'+gridId).alopexGrid({
    		cellSelectable : true,
    		autoColumnIndex: true,
    		fitTableWidth: true,
    		rowClickSelect : false,
    		disableTextSelection : true, 
    		disableHeaderClickSorting : true, 
    		rowSingleSelect : true,
    		numberingColumnFromZero : false,
    		height : 580,
    		headerGroup : [ { fromIndex : 7 , toIndex : 10 , title : '누적진도율(%)'}],

    		columnMapping : mapping,
    		message: {
 				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + buildingInfoMsgArray['noInquiryData']  + "</div>", /*'조회된 데이터가 없습니다.'*/
 				filterNodata : 'No data'
    		}
    		
    	});
    	
    	var mapping2 =  [
    	    			{
    	    				key : 'hdofcNm'
    	    				,align:'center'
    	    				,width:'100px'
    	    				,title : '팀'
    	    				,rowspan: true
    	    				,render : function(value, data) {
    	    					if (value == null) {
    	    						return '합계';
    	    					} 
    	    					else {
    	    						return value;
    	    					}
    	    				},
    	    				colspanTo:function(value,data,mapping){
    	    					if(data['hdofcNm'] == null){
    	    						return 'bpNm';
    	    					}
    	    				}
    	    			}
    	    			,{
    	    				key : 'bpNm'
        	    				,align:'center'
        	    				,width:'150px'
        	    				,title : '협력사'
        	    		  }
    	    			,{
    	    				key : 'numBldFnsh'
        	    				,align:'right'
        	    				,width:'150px'
        	    				,title : '준공건물 진입 대상'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numcdLn'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '건수'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'fcdLn'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '%'
    	    					,render : function(value, data) { 
    	    						value += "%";
    	    					    return value;
    	    					 }
        	    		  }
    	    			,{
    	    				key : 'numlinLn'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '건수'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'flinLn'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '%'
    	    					,render : function(value, data) { 
    	    						value += "%";
    	    					    return value;
    	    					 }
        	    		  }
    	    			,{
    	    				key : 'numentSucc'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '건수'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'fentSucc'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '%'
    	    					,render : function(value, data) { 
    	    						value += "%";
    	    					    return value;
    	    					 }
        	    		  }
    	    			,{
    	    				key : 'numentNot'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '건수'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'fentNot'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '%'
    	    					,render : function(value, data) { 
    	    						value += "%";
    	    					    return value;
    	    					 }
        	    		  }
    	    			,{
    	    				key : 'cstrFnsh'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '공사완료'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numCstrFnshLn'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '공사완료(선로)'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numCstr'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '기구축'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'cstrProging'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '공사중'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numDiscuss'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '협의중'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numWrong'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '불가'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'monopolyKT'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : 'KT'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'monopolyLG'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : 'LG'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'monopolyEtc'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '지역SO'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numOwnerRefuse'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '건물주반대'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numOwnerAbsence'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '건물주부재'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numRequest'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '가입자요청시'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numExceed'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '투자비과다'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numMangmi'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '망미'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numLicense'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '인허가'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'numDB'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : 'DB오류'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			,{
    	    				key : 'sum'
        	    				,align:'right'
        	    				,width:'100px'
        	    				,title : '계'
    	    					,inlineStyle : {
    	    	      	    		color : function(value, data) {
    	    	      	    			if(value != '0')
    	    	      	    				return 'blue';
    	    	      	    		}
    	    					}
        	    		  }
    	    			];
    	
    	//그리드 생성
    	$('#'+gridId2).alopexGrid({
    		cellSelectable : true,
    		autoColumnIndex: true,
    		fitTableWidth: true,
    		rowClickSelect : false,
    		disableTextSelection : true, 
    		disableHeaderClickSorting : true, 
    		rowSingleSelect : true,
    		numberingColumnFromZero : false,
    		height : 580,
    		headerGroup : [ { fromIndex : 3 , toIndex : 4 , title : '관로인입'},
    		                { fromIndex : 5 , toIndex : 6 , title : '선로인입'},
    		                { fromIndex : 7 , toIndex : 8 , title : '진입완료'},
    		                { fromIndex : 9 , toIndex : 10 , title : '진입불가'},
    		                { fromIndex : 11 , toIndex : 16 , title : 'Infra 진행현황(세부)'},
    		                { fromIndex : 17 , toIndex : 27 , title : '불가사유 세부'},
    		                { fromIndex : 17 , toIndex : 19 , title : '타사독점'}],

    		columnMapping : mapping2,
    		grouping : {
              	useGrouping : true,
              	by : ['hdofcNm'],
              	useGroupRowspan : true
            },
    		message: {
 				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + buildingInfoMsgArray['noInquiryData']  + "</div>", /*'조회된 데이터가 없습니다.'*/
 				filterNodata : 'No data'
    		}
    		
    	});
    	
    	
    	$('#'+gridId).on('dataSelectEnd', function(e) {
    		return false;
    	}); 
    	$('#'+gridId2).on('dataSelectEnd', function(e) {
    		return false;
    	});  
    }
    
    function setCombo() {
    	
    //	selectComboCode('hdofcCd', 'Y', 'C00623', '');  // 본부 
    	
    	$("#lcenDtStart").val('201811');
    	$("#lcenDtEnd").val(getViewDateStr("YYYYMM").replaceAll("-", ''));
    }
    
    function setEventListener() {
    	
    /*	$('#hdofcCd').on('change', function(e) {
    		$(this).find("option[value='1000']").remove(); 
    	});*/
    	
    	$('#search').on('click',function(e){
    		
    		var dataParam = $("#searchForm").getData();
    		
    		dataParam.lcenDtStart = $("#lcenDtStart").val().replaceAll(/-/gi, "") + "01";
    		dataParam.lcenDtEnd = $("#lcenDtEnd").val().replaceAll(/-/gi, "") + "31";
    		
    		var popBldCnstDivCdList = [];
    		var popGrudFlorCntCdList = [];
    		var popBldMainUsgCdList = [];
    		
    		if (nullToEmpty( $("#popBldCnstDivCd").val() )  != ""  ){
    			popBldCnstDivCdList = $("#popBldCnstDivCd").val() ;	
    			$.extend(dataParam,{popBldCnstDivCdList: popBldCnstDivCdList });
    		}else{
    			
    		}
    		
    		if (nullToEmpty( $("#popGrudFlorCntCd").val() )  != ""  ){
    			popGrudFlorCntCdList = $("#popGrudFlorCntCd").val() ;	
    			$.extend(dataParam,{popGrudFlorCntCdList: popGrudFlorCntCdList });
    		}else{
    			
    		}
    		
    		if (nullToEmpty( $("#popBldMainUsgCd").val() )  != ""  ){
    			popBldMainUsgCdList = $("#popBldMainUsgCd").val() ;	
    			$.extend(dataParam,{popBldMainUsgCdList: popBldMainUsgCdList });
    		}else{
    			
    		}
    		
    		if(dataParam.lcenDtStart == "" || dataParam.lcenDtEnd == "") {
    			alertBox('W',"인허가일자는 필수 입력입니다.");
    			return false;
    		}
    		dataParam.bSKT = m_bSKT;
    		
        	bodyProgress();
        	if(m_tabIndex == 0){
        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfostats/getNewBldPrcsCurst'
            			, dataParam 
            			, 'POST'
            			, 'NewBldPrcsCurst'
            			);   
        	}
        	else if(m_tabIndex == 1){
        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfostats/getbpcompanyStat'
            			, dataParam 
            			, 'POST'
            			, 'NewBldPrcsCurst'
            			);
        	}	
    		
        	   	
    	});
    	
    	//지역별 엑셀다운로드
        $('#excelDownload').on('click', function(e) {        	
        	bodyProgress();
        	var grid;
        	var sheetName;
        	
        	if(m_tabIndex == 0){
        		grid = $('#newBldPrcsCurstGrid');
        		sheetName = '본부별_공사현황';
        	}
        	else{
        		grid = $('#newBldPrcsCurstGrid2');
        		sheetName = '협력사별_공사현황';
        	}
        		
        	
        	var worker = new ExcelWorker({
        		excelFileName: sheetName/*'지역별_투자비_통계'*/,
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: sheetName/*'지역별_투자비_통계'*/,
        			$grid: grid
        		}] 
        	});
        	worker.export({
        		merge: true,
        		exportHidden: false,
        		filtered  : false,
        		selected: false,
        		useGridColumnWidth : true,
        		border  : true,
        		useCSSParser : true
        		//exportGroupSummary:true,
        		//exportFooter:true
        	});
        	bodyProgressRemove();
        });
        
      //지역별 엑셀다운로드
        $('#autoExcelDownload').on('click', function(e) { 
        	if(m_tabIndex != 0)			return false;
        	var dataForm = $("searchForm").getData();
    		var list;
    		
    		list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
    		
        	if ( list.length < 1 ) {
        		alertBox('W',buildingInfoMsgArray['noInquiryData']);
        		return false;
        	}
        	
    		dataForm = gridExcelColumn(dataForm, gridDetailId);
    		
    		dataForm.fdaisDtEnd = $('#lcenDtEnd').val().replaceAll("-", "") + "31";
         	dataForm.fdaisDtStart = $('#lcenDtStart').val().replaceAll("-", "") + "01";
    		
    		dataForm.all = 'false';
    		dataForm.silsa='true';
    		dataForm.gcmmBtoB='false';
    		dataForm.gcmm='false';
    		dataForm.gcmmOther='false';
    		dataForm.lteUseYn='false';
    		dataForm.wifiUseYn='false';
    		dataForm.bukeyUseYn='false';
    		dataForm.bukeySspdAvlbYn='false';
    		dataForm.kpiTwentyFourSi='false';
    		dataForm.kpiEightyFiveSi='false';
			dataForm.kpiMainUse='false';
			dataForm.kpiAll='false';
			dataForm.saeum='true';
			dataForm.vndrCd = 'T1';
    		
    		dataForm.bAutoSave = true;
    		dataForm.bSKT = m_bSKT;
    		
    		var popBldCnstDivCdList = [];
    		var popGrudFlorCntCdList = [];
    		var popBldMainUsgCdList = [];
    		
    		if (nullToEmpty( $("#popBldCnstDivCd").val() )  != ""  ){
    			popBldCnstDivCdList = $("#popBldCnstDivCd").val() ;	
    		}else{
    		}
    		
    		if (nullToEmpty( $("#popGrudFlorCntCd").val() )  != ""  ){
    			popGrudFlorCntCdList = $("#popGrudFlorCntCd").val() ;	
    		}else{
    		}
    		
    		if (nullToEmpty( $("#popBldMainUsgCd").val() )  != ""  ){
    			popBldMainUsgCdList = $("#popBldMainUsgCd").val() ;	
    		}else{
    		}
    		
    		$.extend(dataForm,{fdaisBldCnstDivCdList: popBldCnstDivCdList });
    		$.extend(dataForm,{fdaisGrudFlorCntCdList: popGrudFlorCntCdList });
    		$.extend(dataForm,{fdaisBldMainUsgCdList: popBldMainUsgCdList });
    		
        	dataForm.fileName = "건물관리";
        	dataForm.fileExtension = "xlsx";
        	dataForm.excelPageDown = "N";
        	dataForm.excelUpload = "Y";
        	
        	dataForm.saveMode = "newBldHdofc";
        	
        	callMsgBox('','C', buildingInfoMsgArray['confirmExcelPrinting'], function(msgId, msgRst){ /* 엑셀로 출력 하시겠습니까? */
        		if (msgRst == 'Y') {
        			demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatch', dataForm, 'POST', 'AutoexcelDownload');
        		}
        	});
        });
        
        $('#basicTabs').on("tabchange", function(e, index) {
        	m_tabIndex = index;
        	$('#'+tabInfo[index].gridId).alopexGrid("viewUpdate");
        	
        	switch(index){
        	case 0:
        		$('#comments').val("※ 건축완료는 세움터의 사용승인일과 현장실사의 사용승인일 기준의 데이터입니다.");
        		$('#autoExcelDownload').show();
        		break;
        	case 1:
        		$('#comments').val("※ 준공건물 진입대상은 세움터의 사용승인일과 현장실사의 사용승인일 기준의 데이터입니다.");
        		$('#autoExcelDownload').hide();
        		break;
    		default:
    			break;
        	}
    	});
        
        $('#'+gridId).on('dblclick', '.bodycell', function(e) {
    		var object = AlopexGrid.parseEvent(e);
         	var dataParam = object.data;
         	var textvalue = object.$cell.context.outerText;
         	
         	if(AssertParam(dataParam, textvalue) == false){
         		return;
         	}
         	
         	dataParam.fdaisDtEnd = $('#lcenDtEnd').val().replaceAll("-", "") + "31";
         	dataParam.fdaisDtStart = $('#lcenDtStart').val().replaceAll("-", "") + "01";

         	var popBldCnstDivCdList = [];
    		var popGrudFlorCntCdList = [];
    		var popBldMainUsgCdList = [];
    		
    		if (nullToEmpty( $("#popBldCnstDivCd").val() )  != ""  ){
    			popBldCnstDivCdList = $("#popBldCnstDivCd").val() ;	
    		}else{
    		}
    		
    		if (nullToEmpty( $("#popGrudFlorCntCd").val() )  != ""  ){
    			popGrudFlorCntCdList = $("#popGrudFlorCntCd").val() ;	
    		}else{
    		}
    		
    		if (nullToEmpty( $("#popBldMainUsgCd").val() )  != ""  ){
    			popBldMainUsgCdList = $("#popBldMainUsgCd").val() ;	
    		}else{
    		}
    		
    		$.extend(dataParam,{fdaisBldCnstDivCdList: popBldCnstDivCdList });
    		$.extend(dataParam,{fdaisGrudFlorCntCdList: popGrudFlorCntCdList });
    		$.extend(dataParam,{fdaisBldMainUsgCdList: popBldMainUsgCdList });
    		
         	dataParam.bSKT = m_bSKT;
         	dataParam.vndrCd = 'T1';
         	dataParam.bViewCdLn = false;
			dataParam.bViewLn = false;
			dataParam.bViewEntry = false;
         	switch(dataParam._key){
         	
         	case "numBldFnsh":
         		dataParam.silsaYnCrst = '';
         		break;
         	case "numcdLn":
         		dataParam.silsaYnCrst = '';
         		dataParam.bViewCdLn = true;
         		break;
         	case "numlinLn":
         		dataParam.silsaYnCrst = '';
         		dataParam.bViewLn = true;
         		break;
         	case "numentSucc":
         		dataParam.silsaYnCrst = '';
         		dataParam.bViewEntry = true;
         		break;
         	case "numentNot":
         		dataParam.silsaYnCrst = 'ACE06';
         		break;
         	default:
         		dataParam.silsaYnCrst = '';
         		break;
         	}
         	
         	showProgress(gridId);
         	
         	PopUpDetailList(gridId, dataParam);
         });
        
        $('#'+gridId2).on('dblclick', '.bodycell', function(e) {
    		var object = AlopexGrid.parseEvent(e);
         	var dataParam = object.data;
         	var textvalue = object.$cell.context.outerText;
         	
         	if(AssertParam(dataParam, textvalue) == false){
         		return;
         	}
         	
         	dataParam.fdaisDtEnd = $('#lcenDtEnd').val().replaceAll("-", "") + "31";
         	dataParam.fdaisDtStart = $('#lcenDtStart').val().replaceAll("-", "") + "01";
         
         	var popBldCnstDivCdList = [];
    		var popGrudFlorCntCdList = [];
    		var popBldMainUsgCdList = [];
    		
    		if (nullToEmpty( $("#popBldCnstDivCd").val() )  != ""  ){
    			popBldCnstDivCdList = $("#popBldCnstDivCd").val() ;	
    		}else{
    		}
    		
    		if (nullToEmpty( $("#popGrudFlorCntCd").val() )  != ""  ){
    			popGrudFlorCntCdList = $("#popGrudFlorCntCd").val() ;	
    		}else{
    		}
    		
    		if (nullToEmpty( $("#popBldMainUsgCd").val() )  != ""  ){
    			popBldMainUsgCdList = $("#popBldMainUsgCd").val() ;	
    		}else{
    		}
    		
    		$.extend(dataParam,{fdaisBldCnstDivCdList: popBldCnstDivCdList });
    		$.extend(dataParam,{fdaisGrudFlorCntCdList: popGrudFlorCntCdList });
    		$.extend(dataParam,{fdaisBldMainUsgCdList: popBldMainUsgCdList });
    		
         	dataParam.bSKT = m_bSKT;
         	dataParam.bViewLn = false;
     		dataParam.bViewEntry = false;
     		dataParam.bViewCdLn = false;
     		dataParam.vndrCd = 'T1';
     		
         	switch(dataParam.bpNm){
         	case "계":
         	case "합계":
         		break;
         	default:
         		dataParam.fdaisBp = dataParam.bpNm;
         		break;
         	}
         	
         	dataParam.bChungChang = false;
			dataParam.bkungNam = false;
			dataParam.bkungBuk = false;
			dataParam.bKangWon = false;
			dataParam.bViewCdLn = false;
			dataParam.bViewLn = false;
			dataParam.bViewEntry = false;
			
         	switch(dataParam.hdofcNm){
			case "수도권":
				dataParam.hdofcCd = '5100';
				break;
			//case "서울":
			//	dataParam.hdofcCd = '28FIF00'; 
			//	break;	
			//case "수도남":
			case "수도권2":
				dataParam.hdofcCd = '29FI000';
				break;
			//case "수도북":
			case "수도권1":
				dataParam.hdofcCd = '29FF000';
				break;
			case "경남":
				dataParam.bkungNam = true;
				break;
			case "경북":
				dataParam.bkungBuk = true;
				break;
			case "서부":
				if(m_bSKT == true)
					dataParam.hdofcCd = '5500';
				else
					dataParam.hdofcCd = '29FP000';
				break;
			case "충청":
				dataParam.bChungChang = true;
				break;
			case "강원":
				dataParam.bKangWon = true;
				break;
			}
         	
         	dataParam.silsadisable = '';
         	dataParam.silsaYnCrst = '';
         	dataParam.silsaBussiness = '';
         	switch(dataParam._key){
         	
         	case "numBldFnsh":
         		dataParam.silsaYnCrst = '';
         		break;
         	case "numcdLn":
         		dataParam.silsaYnCrst = '';
         		dataParam.bViewCdLn = true;
         		break;
         	case "numlinLn":
         		dataParam.silsaYnCrst = '';
         		dataParam.bViewLn = true;
         		break;
         	case "numentSucc":
         		dataParam.silsaYnCrst = '';
         		dataParam.bViewEntry = true;
         		break;
         	case "numentNot":
         		dataParam.silsaYnCrst = 'ACE06';
         		break;
         	case "monopolyKT":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR01';
         		dataParam.silsaBussiness = 'A';
         		break;
         	case "monopolyLG":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR01';
         		dataParam.silsaBussiness = 'B';
         		break;
         	case "monopolyEtc":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR01';
         		dataParam.silsaBussiness = 'C';
         		break;
         	case "numOwnerRefuse":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR02';
         		break;
         	case "numOwnerAbsence":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR03';
         		break;
         	case "numRequest":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR04';
         		break;
         	case "numMangmi":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR05';
         		break;
         	case "numExceed":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR06';
         		break;
         	case "numLicense":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR07';
         		break;
         	case "numDB":
         		dataParam.silsaYnCrst = 'ACE06';
         		dataParam.silsadisable = 'AIR08';
         		break;
         	case "sum":
         		dataParam.silsaYnCrst = 'ACE06';
         		break;
         	case "cstrFnsh":
         		dataParam.silsaYnCrst = 'ACE01';
         		break;
         	case "numCstrFnshLn":
         		dataParam.silsaYnCrst = 'ACE02';
         		break;
         	case "numCstr":
         		dataParam.silsaYnCrst = 'ACE03';
         		break;
         	case "cstrProging":
         		dataParam.silsaYnCrst = 'ACE04';
         		break;
         	case "numDiscuss":
         		dataParam.silsaYnCrst = 'ACE05';
         		break;
         	case "numWrong":
         		dataParam.silsaYnCrst = 'ACE06';
         		break;
         	}
         	
         	showProgress(gridId2);

         	PopUpDetailList(gridId2, dataParam);
         });
    }
    
    //request
	function demandRequest(surl,sdata,smethod,sflag)
    {		
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    }
	
	function demandCommonRequest(comGrpCd ,sflag){
		var requestParam = { comGrpCd : comGrpCd };
		
		Tango.ajax({
			//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
			url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
			data : requestParam,
			method : 'GET'
		}).done(function(response){successDemandCallback(response, sflag);})
		  .fail(function(response){failDemandCallback(response, sflag);})
	}
	
	 function successDemandCallback(response, flag){
		 
		 if(flag == "NewBldPrcsCurst") {
			 
	    	 bodyProgressRemove();
	    	 
	    	 if(response != null){
	    		 $('#'+tabInfo[m_tabIndex].gridId).alopexGrid("dataSet", response.list);
	    	 }
		 }
		 else if(flag == 'getUserBpInSKB'){
    		if(response.list == null){
    			m_bSKT = true;
    		}
    		else{
    			m_bSKT = false;
    		}
    		initDetailGrid(gridDetailId, m_bSKT, false);
    		demandCommonRequest('C00648', 'getpopBldMainUsgCd'); //주용도 코드
        	demandCommonRequest('C00647', 'getpopBldCnstDivCd'); //건축구분 코드
        	demandCommonRequest('C00653', 'getpopGrudFlorCntCd'); //지상층 코드
    	 }
		 else if(flag == 'getpopGrudFlorCntCd'){
			$('#popGrudFlorCntCd').setData({
    			data : response
    		});
    		$('#popGrudFlorCntCd').prepend('<option value="">선택</option>');
    		BasicSet(m_bSKT);
		 }
		 else if(flag == 'getpopBldCnstDivCd'){
			$('#popBldCnstDivCd').setData({
    			data : response
    		});
    		$('#popBldCnstDivCd').prepend('<option value="">선택</option>');
    		BasicSet(m_bSKT);
		 }
		 else if(flag == 'getpopBldMainUsgCd'){
			$('#popBldMainUsgCd').setData({
    			data : response
    		});
    		$('#popBldMainUsgCd').prepend('<option value="">선택</option>');
    		BasicSet(m_bSKT);
		 }
		 else if(flag == 'AutoexcelDownload'){
  			bodyProgressRemove();
  		
  			if(response.jobInstanceId != "") {
  				$("#excelDownFileId").val(response.jobInstanceId);
  				refreshFlag = true;
      			excelDownloadbybatchPop();
  			}	
  			else {
  				alertBox('W',"엑셀 파일 생성 하는데 실패 하였습니다.");
  			}
		  }
	 }
	 
	 function failDemandCallback(response, flag){
		 bodyProgressRemove();
	 }
    
	 function AssertParam(dataParam, textvalue){
	     switch(dataParam._key){
	      	case 'fcdLn':
	      	case 'fentNot':
	      	case 'fentSucc':
	      	case 'flinLn':
	      		if(dataParam.totsudo == null || dataParam.totsudo == "0"){
	      			alertBox('W','% 데이터는 확인 불가합니다.');
	      			return false;
	      		}
	      		break;
	      }
	     
	     if(textvalue == null || textvalue == '0'){
	    	 alertBox('W',buildingInfoMsgArray['noInquiryData']);
   			return false;
	     }
	    	 
      	  return true;
	 }
	 
	 function PopUpDetailList(gridIdValue, prm){
		 var sendparam = prm;
		 
		 $a.popup({
          	popid: 'NewBuildingProcessCurrentPop',
          	title: '상세화면',
          	iframe: true,
          	modal : true,
              url: 'NewBuildingProcessCurrentPop.do',
              data: sendparam,
              width : 1200,
              height : 720,
             
              callback: function(data) {
             	 hideProgress(gridIdValue);
             	 if(data == null){
             		 	return;
             		 }
              	}	
          });
	 }
	 
	 var showProgress = function(gridIdValue){
		$('#'+gridIdValue).alopexGrid('showProgress');
	 };
			
	 var hideProgress = function(gridIdValue){
		$('#'+gridIdValue).alopexGrid('hideProgress');
	 };
	 
	 function BasicSet(bSKT){
    	if(bSKT == true)	return true;
    	
    	var fdaisBldCnstDivCdList = ['305001', '305003', '305007'];			// 건축구분명 Default
    	var fdaisGrudFlorCntCdList = ['320003', '320004', '320005'];		// 지상층 Default
    	//var fdaisBldMainUsgCdList = ['306003', '306004', '306011', '306013', '306020', '306021', '306022', '306023', '306025', '306027', '306028', '306031', '306032', '306033', '306036', , '306007', '306009', '306012'];		// 주용도 Default
    	    	var fdaisBldMainUsgCdList = ['306003', '306004', '306011', '306013', '306020', '306021', '306022', '306023', '306025', '306027', '306028', '306031', '306032', '306033', '306036', , '306007'];		// 주용도 Default
    	var i = 0;
    	var len = fdaisBldMainUsgCdList.length;
    	
    	for(i = 0; i < len; i++){
    		$('#popBldMainUsgCd').multiselect("widget").find(":checkbox[value='"+fdaisBldMainUsgCdList[i]+"']").attr("checked", "checked");
    		$("#popBldMainUsgCd option[value='" + fdaisBldMainUsgCdList[i] + "']").attr("selected", 1);
    		$('#popBldMainUsgCd').multiselect("refresh");
    	}
    	
    	len = fdaisGrudFlorCntCdList.length;
    	for(i = 0; i < len; i++){
    		$('#popGrudFlorCntCd').multiselect("widget").find(":checkbox[value='"+fdaisGrudFlorCntCdList[i]+"']").attr("checked", "checked");
    		$("#popGrudFlorCntCd option[value='" + fdaisGrudFlorCntCdList[i] + "']").attr("selected", 1);
    		$('#popGrudFlorCntCd').multiselect("refresh");
    	}
    	
    	len = fdaisBldCnstDivCdList.length;
    	for(i = 0; i < len; i++){
    		$('#popBldCnstDivCd').multiselect("widget").find(":checkbox[value='"+fdaisBldCnstDivCdList[i]+"']").attr("checked", "checked");
    		$("#popBldCnstDivCd option[value='" + fdaisBldCnstDivCdList[i] + "']").attr("selected", 1);
    		$('#popBldCnstDivCd').multiselect("refresh");
    	}
    }
	 
	 function excelDownloadbybatchPop() {
			if(refreshFlag) {
		  		var jobInstanceId = $("#excelDownFileId").val();
		   		
		   		if(jobInstanceId != "") {
		   			excelCreatePop(jobInstanceId);
		    	}
			}
	    }
	    
    function excelCreatePop(jobInstanceId) {

       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: '/tango-transmission-web/demandmgmt/buildinginfomgmt/ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		
                  	}
               	}
            });
	 }
})