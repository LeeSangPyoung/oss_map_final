/**
 * ServiceLineCuidCurstList
 *
 * @author P128406
 * @date 2023.04.05
 * @version 1.0
 */

var dataGrid = "dataGrid";
var data = null;
var editFlag = null;

$a.page(function() {

	var isEditing = false;
	var column = columnMapping("dataGrid");
	var columnWork = columnMapping("dataGridWork");
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        btnHide();
    	createMgmtGrpSelectBox ("mgmtGrpCd", "A", 'SKT');  // 관리 그룹 selectBox
    	$('#btnExportExcel').setEnabled(false);
 		getGrid();
    	setSelectCode();
    	getGrid();
        setEventListener();   
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    }
    
    function btnHide() {
    	$('#btnSave').hide();
    	$('#btnCancel').hide();
    }
    
    function columnMapping(sType) {
    	var mapping = [];
		if(sType == "dataGridWork") {
			mapping.push({ selectorColumn : true, width : '50px' } );
		}
    	var extendMapping = [
   		              {key : 'ordRow',			    	align:'center',			width:'70px',		title : '순번'				/* 순번 */ }
    	            , {key : 'cuidVal'	      		    ,title : cflineMsgArray['cuid']  /*  CUID */    ,align:'center', width: '50px', hidden: true}
					, {key : 'mgmtGrpCdNm'				,title : cflineMsgArray['managementGroup'] /*  관리그룹 */ ,align:'center', width: '60px'}
			        , {key : 'hdofcCd'	            	,title : cflineCommMsgArray['hdofc'] /* 본부 */ ,align:'center', width: '50px', hidden: true}
			        , {key : 'hdofcNm'	            	,title : cflineCommMsgArray['hdofc'] /* 본부 */ ,align:'center', width: '75px'}
			        , {key : 'teamNm'	        		,title : cflineCommMsgArray['team'] /* 팀 */ ,align:'center', width: '80px'}     
			        , {key : 'tmofNm'	        		,title : cflineMsgArray['transmissionOffice'] /* 전송실 */ ,align:'center', width: '130px'}    
			        , {key : 'detlBizDivNm'	        	,title : cflineMsgArray['businessDivision'] /* 사업구분 */ ,align:'center', width: '75px'}               
			        , {key : 'cuidName'	        		,title : cflineMsgArray['btsName'] /* 기지국사 */ ,align:'center', width: '160px'}    
			        , {key : 'repTotal'	        		,title : cflineMsgArray['repDualostion'] /* REP이원화 */ ,align:'right', width: '75px'
			        	, render : {type: 'stringType', rule : 'comma'}
			        	, inlineStyle : function(value,data) {
			        		if(data.hdofcCd == "998") {
				        		if(data.repTotal != "0" ) {
									return {color: 'blue' , cursor : 'pointer'};
								}
			        		}
			        		if(data.hdofcCd == "999") {
				        		if(data.repTotal != "0" ) {
									return {color: 'red' , cursor : 'pointer'};	
								}
			        		}
						}  
			        }                   
			        , {key : 'cotTotal'	        			,title : cflineMsgArray['cotDualostion'] /* COT/AON이원화 */ ,align:'right', width: '90px'
			        	, render : {type: 'stringType', rule : 'comma'}
			        	, inlineStyle : function(value,data) {
			        		if(data.hdofcCd == "998") {
								if(data.cotTotal != "0" ) {
									return {color: 'blue' , cursor : 'pointer'};	
								}
							}
			        		if(data.hdofcCd == "999") {
				        		if(data.cotTotal != "0" ) {
									return {color: 'red' , cursor : 'pointer'};	
								}
			        		}
						}
			        }                
			        , {key : 'rtTotal'	       				,title : cflineMsgArray['rtDualostion'] /* RT이원화 */ ,align:'right', width: '75px'
			        	, render : {type: 'stringType', rule : 'comma'}
			        	, inlineStyle : function(value,data) {
			        		if(data.hdofcCd == "998") {
								if(data.rtTotal != "0" ) {
									return {color: 'blue' , cursor : 'pointer'};	
								}
							}
			        		if(data.hdofcCd == "999") {
				        		if(data.rtTotal != "0" ) {
									return {color: 'red' , cursor : 'pointer'};	
								}
			        		}
						}
			        }               
			        , {key : 'bepTotal'	    				,title : cflineMsgArray['bepDualostion'] /* BEP이원화 */ ,align:'right', width: '80px'
			        	, render : {type: 'stringType', rule : 'comma'}
			        	, inlineStyle : function(value,data) {
			        		if(data.hdofcCd == "998") {
								if(data.bepTotal != "0" ) {
									return {color: 'blue' , cursor : 'pointer'};	
								}
							}
			        		if(data.hdofcCd == "999") {
				        		if(data.bepTotal != "0" ) {
									return {color: 'red' , cursor : 'pointer'};	
								}
			        		}
						}
			        } 
					, {key : 'rmk'	            ,title : cflineMsgArray['remark'] /*비고*/				,align:'left', width: '200px'
						, editable: {
							type:"text", 
							allowEdit : function(value, data, mapping){
								if (data.hdofcCd != '998' && data.hdofcCd != '999') {
									return true;
								} else{
									return false;
								}
							}	
						}
					}
    	];
    	for(var i = 0 ; i < extendMapping.length; i++ ) {
			mapping.push(extendMapping[i]);
		}

		return mapping;
    }
    

	 //Grid 초기화
    function getGrid() {
			
		$('#'+dataGrid).alopexGrid({
			pager : true,
	       	autoColumnIndex: true,
	   		autoResize: true,
	   		cellSelectable : false,
	   		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	   		rowClickSelect : true,
	   		rowSingleSelect : true,
	   		rowInlineEdit : false, //행전체 편집기능 활성화
	   		numberingColumnFromZero: false,
	   		defaultColumnMapping:{sorting: true},
			disableTextSelection: false,
			fillUndefinedKey:null,
	   		enableDefaultContextMenu:false,
	   		enableContextMenu:true,
	   		message: {
	   			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	   		},
	   		columnMapping: column,
	   		rowOption : {
	     			allowSelect : function(data) {
	     				if (data["hdofcCd"] != "998" && data["hdofcCd"] != "999") {
	     					return true;
	     				} else {
	     					return false;
	     				}		
	     			}, allowEdit : function(data){
	     				if (data["hdofcCd"] != "998" && data["hdofcCd"] != "999") {
							return true;
						} else{
							return false;
						}
					}	
	   		},
	   		renderMapping : {
	    		 "stringType" : {
	    			 renderer : function(value, data, render, mapping){
						var span = value;
						if(value != "" && value != undefined && (value != "양호" && value != "미흡" && value != "0")) {
							span = "<span style='text-decoration-line:underline'>"+value+"</span>";
						}
						return span;
					}        	
	    		 }
	    	 }
   		
		 });
    }
   
    /**
     * Function Name : editRow
     * Description   : 행 편집
     * ----------------------------------------------------------------------------------------------------
     * param    	 : btnShowArray. 편집기능이 활성화 될때 보여줄 버튼 ID 리스트
     *                 btnHideArray. 편집기능이 활성화 될때 숨여야될 버튼 ID 리스트
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function editRow(btnShowArray, btnHideArray) {
    	$('#'+dataGrid).alopexGrid({
    		rowSingleSelect : false,
    		rowInlineEdit : true, //행전체 편집기능 활성화
    	});
    	
    	if(nullToEmpty(btnShowArray) != "") {
    		for(var show = 0; show < btnShowArray.length; show++) {
    			$("#"+btnShowArray[show]).show();
    		}
    	}
    	
    	if(nullToEmpty(btnHideArray) != "") {
    		for(var hide = 0; hide < btnHideArray.length; hide++) {
    			$("#"+btnHideArray[hide]).hide();
    		}
    	}
    	//여기서 편집활성화
    	$('#'+dataGrid).alopexGrid({columnMapping: columnWork });
    	
    	$("#"+dataGrid).alopexGrid("startEdit");
    	$('#'+dataGrid).alopexGrid("viewUpdate");
    }
    
    function setEventListener() {
	 	// 엔터 이벤트 
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	 
	 	// 국사 keydown
     	$('#mtsoNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#mtsoId").val("");
     		}
     	});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 searchProc();    		 
         });
     	// 관리그룹 클릭시
     	$('#mgmtGrpCd').on('change',function(e){
     		if( $('#mgmtGrpCd').val() == '0001' ){
     		}else{
     		}
     		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
       	});   	 
    	// 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "tmofCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "tmofCd", "mtso");
      	});      	 
  		// 전송실 선택시
    	$('#tmofCd').on('change',function(e){
    		changeTmof("tmofCd", "mtso");
      	});
		
		//엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
       	 cflineShowProgressBody();
       	 excelDownload();
        });

        //편집
        $('#btnRegEqp').on('click', function(e){
			$('#btnExportExcel').setEnabled(false);
			isEditing = true;
			var btnShowArray = ['btnSave', ,'btnCancel']; // 저장 , 취소
			var btnHideArray = ['btnRegEqp'];
			editRow(btnShowArray, btnHideArray);
        });

        //취소
        $('#btnCancel').on('click', function(e){
       	 isEditing = false;
       	 if($('#'+dataGrid).alopexGrid("dataGet").length <= 0){
       		 $("#"+dataGrid).alopexGrid("endEdit");
       		 resetGridNoEdit();
       		 return;
       	 }
       	 else { 
       		searchProc();
       	 }
        });
        
        //저장
        $('#btnSave').on('click', function(e){
       	 	funcSaveData();
        });
        
     // OMS관리장비 작업정보 그리드 더블클릭시
		$('#'+dataGrid).on('click', function(e) {
			if(isEditing) return;
			
			var object = AlopexGrid.parseEvent(e);
	    	var data = AlopexGrid.currentData(object.data);
	    	var selectedId = $('#' + dataGrid).alopexGrid('dataGet', {_state:{selected:true}});
	    	
	    	if (data == null) {
	    		return false;
	    	}
	    	
			var cuidCurstSchDiv = "";
			var cuidCurstRstDiv = "";
			var cuidVal = "";
			
			var eqpTitle = object.mapping.title.replace("이원화","").replace(" ","");
	    	var headerTitle = data.teamNm  + " > " + eqpTitle + " 장비";
	    	
			var belongToTitle = $('#hdofcCd').getTexts()[0];  // 소속 정보 가져오기(그리드 data에서)
	    	
			if(nullToEmpty($('#teamCd').getTexts()[0]) != ""){
	    		belongToTitle = belongToTitle + " > " + $('#teamCd').getTexts()[0];
	    	}
	    	
			if($('#tmofCd').val() != null) {
				if($('#tmofCd').val().length == 1) {
					belongToTitle = belongToTitle + " > " + $("select[name=tmofCd] option:selected").text();
				}
			}
	    	
	    	if(data.teamNm == "양호 소계"){
	    		cuidCurstRstDiv = "OK";
	    	} else if(data.teamNm == "미흡 소계"){
	    		cuidCurstRstDiv = "NG";
	    	}

			if(cuidCurstRstDiv == "") {
				cuidVal = data.cuidVal;
			}
	    	
			if(nullToEmpty(cuidCurstSchDiv) == "" && nullToEmpty(cuidCurstRstDiv) == "") {
				return;
			}

			var popParam = {
					  "cuidCurstSchDiv":eqpTitle, "cuidCurstRstDiv":cuidCurstRstDiv, "belongToTitle":belongToTitle, "headerTitle":headerTitle
				     , "hdofcCd":$('#hdofcCd').val(), "teamCd":$('#teamCd').val(), "tmofCdVal":$('#tmofCd').val(), "cuidVal":cuidVal
				     };
			
			$a.popup({
			  	popid: "popOpenCuidCurstDtlInfo",
			  	title: cflineMsgArray['dcsStateDetail'] /* DCS 현황 상세 */,
				url: $('#ctx').val() + "/statistics/configmgmt/ServiceLineCuidCurstDtlInfoPop.do",
				data: popParam,
				iframe: true,
				modal: true,
				movable:true,
				windowpopup : true,
				width : 1500,
				height : 830,
				callback:function(data){
					if(data != null){
						if(data == 'invalidParamValue'){
				 			alertBox('I', cflineMsgArray['invalidParamValue']); /* 잘못 전달된 값입니다. */
				 			return;
						} 
					}
	
				}
			}); 
		});
	};	

    /**
	 * 그리드 편집종료와 버튼 재세팅
	 */
	function resetGridNoEdit() {
		$('#'+dataGrid).alopexGrid({
			columnMapping: column ,
			rowSingleSelect : true,
    		rowInlineEdit : false, //행전체 편집기능 활성화
		});
		$('#'+dataGrid).alopexGrid("dataSet", data);
 		$("#"+dataGrid).alopexGrid("endEdit");
     	$('#'+dataGrid).alopexGrid("viewUpdate");
     	
    	$('#btnSave').hide();
    	$('#btnCancel').hide();
    	$('#btnRegEqp').show();
	}

	/*
	 * 조회 함수
	 */
	function searchProc(){
		$('#cmsId').val("");
    	var param =  $("#searchForm").serialize(); 
		//$.extend(param, {schDiv: "B" });
		//param.schDiv = "B";
    	cflineShowProgressBody();		
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlncuidcurstlist', param, 'GET', 'searchAllInfo');
	}

	function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
    		$('#'+dataGrid).alopexGrid("dataSet", response.list);
    		data = response.list;
			$('#btnExportExcel').setEnabled(true);
    	}
    	
    	//작업 정보 수정 및 데이터 생성
		if(flag == "updateEditInfo"){
			if(response.returnCode == '200'){
    			cflineHideProgressBody();
    			callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){ /* 저장완료하였습니다.*/ 
            		if (msgRst == 'Y') {
            			searchProc();
            		}
            	});
    		}else if(response.returnCode == '500'){
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    			$('#'+dataGrid).alopexGrid("startEdit");
    		}
    	}
	}
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['cuidMtsoDualostion'],			/* 기지국사별 이원화총괄 */
     		sheetList: [{
     			sheetName: cflineMsgArray['cuidMtsoDualostion'],			/* 기지국사별 이원화총괄 */
     			placement: 'vertical',
     			$grid: $('#'+dataGrid)
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
    
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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

    /**
	 * 작업수정내역저장
	 */
	function funcSaveData() {
		// TODO
		var dataList = $('#'+dataGrid).alopexGrid('dataGet', {_state:{selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	if (dataList.length > 0 ){
    		if(fnVaildation(dataList)){
           	 	isEditing = false;
				var updateList = $.map(dataList, function(data){
					
					var saveParam = {
							  "cuidVal":data.cuidVal
							, "rmk" : data.rmk
					};
					
					return saveParam;
				});
				
				cflineShowProgressBody();
				
				// 등록, 수정
				httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/updateRmkEditInfo', updateList, 'POST', 'updateEditInfo');
    		} else {
    			alertBox('I', "잘못된 데이터가 선택되었습니다. 소계가 선택된건 아닌지 확인해주세요. "); /* 잘못된 데이터가 선택되었습니다. */
    			$('#'+dataGrid).alopexGrid("startEdit");
    		}
		}else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$('#'+dataGrid).alopexGrid("startEdit");
		}
	}
	/**
	 * 양호, 미흡 항목이 선택된 경우 false
	 */
	function fnVaildation(dataList) {
		
		for(var i=0; i<dataList.length; i++){
			if(nullToEmpty(dataList[i].cuidVal) == "") {
				return false;
			}
    	}
		return true;
	}
    
});
