/**
 * PopWdmTrunkWrite.js
 *
 * @author ohjungmin(posgen)
 * @date 2016. 9. 19.
 * @version 1.0
 * 
 * *********** 수정이력 ****************
 * 2018-06-05  서정아  1. WDM등록시 장비/포트설정(보류)
 * 2020-04-16  2. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 */
var bdwthWavlMap = [];
  
$a.page(function() {
	var paramFormData = null;
	var params = null;
	var gridMtso = 'writeGrid';
	var mgmtGrpCdData = [];	// 관리구분데이터
	var TmofAllData = [];		/* 전송실 데이터 :	SKT,SKB */
	var tmofData = [];		//전송실 데이터
	var sTopoLclCd = "003";   //토폴로지대분류코드
	var sTopoSclCd = "101";   //토폴로지소분류코드
	var checkTmofData = false;
	var userJrdtTmofInfoPop = "";
	var uprTmofOrgId = "";
	var uprTmofTeamId = "";
	var lowTmofOrgId = "";
	var lowTmofTeamId = "";
 	var tmofOrgId = "";
 	var tmofTeamId = "";
	var sMgmtGrpCd = "";		/* 관리그룹 통일 변수 */
	
	var tempTmofInfo = null;  // 장비검색에 사용될 국사정보 
	
	
	this.init = function(id, param){
		checkTmofData = false;

    	userJrdtTmofInfoPop = "";
		//기본데이터 가지고 오기
		setSelectCode();	
		//그리드 셋팅
		initGrid();
		
		setEventListener();	

		// ADAMS 연동 고도화
		$('#mgmtGrpCdPop').setSelected("0001");
		$('#mgmtGrpCdPop').setEnabled(false);
	};	
	
	//Grid 초기화
	function initGrid() {
		var mapping = [  {selectorColumn : true, width : '40px'}
						,{key : 'mgmtGrpCd', align:'center', width:'70px', title : cflineMsgArray['managementGroup'] /* 관리그룹 */
					 		, editable : { type: 'select', rule: function(value, data) { return mgmtGrpCdData;} 
					     		, attr : { style : "width: 60px;min-width:60px;padding: 2px 2px;" } 
					 		}
				   		}
						,{key : 'tmofId',align : 'center',width : '280px',title : cflineMsgArray['transmissionOffice']/*'전송실'*/
							, render : { tyep : 'string'
								, rule : function(value, data) {
									var render_data = [{value:''}];
			  						var currentData = AlopexGrid.currentData(data);
			  						if (tmofData[currentData.mgmtGrpCd]) {
			  							return render_data = render_data.concat(tmofData[currentData.mgmtGrpCd]);
			  						} else {
			  							return render_data.concat({value : data.tmofId, text : data.tmofNm});
			  						}
								}
							}
					        , editable : { type : 'select'
					        	, rule : function(value, data) { 
					        		var render_data = [];
			  						var currentData = AlopexGrid.currentData(data);
			  						if (tmofData[currentData.mgmtGrpCd]) {
			  							return render_data = render_data.concat(tmofData[currentData.mgmtGrpCd]);
			  						} else {
			  							return render_data.concat({value : data.tmofId, text : data.tmofNm});
			  						}
					        	}
						        , attr : {
					 				style : "width: 290px;min-width:290px;padding: 2px 2px;"
					 			}
							 }
					        , editedValue : function(cell) {
									return $(cell).find('select option').filter(':selected').val();
							 }
					        , refreshBy : "mgmtGrpCd"
						}
				       ,{key : 'mtsoId'	, title : cflineMsgArray['mtsoCode']/*'국사코드'*/, hidden :true }
				       ,{key : 'mtsoNm'	, title : cflineMsgArray['mobileTelephoneSwitchingOffice']/*국사*/ , align:'left', width: '400px'
						  	, render : function(value, data){ return nullToEmpty(value)=="" ? data.mtsoNm:value; }
				       		, editable:  { type: 'text' }
					  		, refreshBy : function(previousValue, changedValue, changedKey, changedData, changedColumnMapping){
					  			if(changedKey == "mgmtGrpCd" || changedKey == "tmofId"){
					  				changedData.mtsoId = "";
					  				changedData._state["editing"]["4"] = "";
					  				return true;
					  			}else{ 
					  				return false;
					  			}
					  		}
	   			        }
					  , {key : 'mtsoNmbtn',value : function(value, data) {return null;}, width: '40px'
						  	,render : function(value, data, render, mapping) {
		    				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnMtsoGridSch" type="button"></button></div>';
		    	            } 
	   			        }
		               ];

    	// 그리드 생성
        $('#'+ gridMtso).alopexGrid({
        	pager : false,
        	autoColumnIndex: true,
        	columnMapping : mapping,
            cellSelectable : false,
            rowClickSelect : false,
            rowInlineEdit : false,
            rowSingleSelect : false,
            numberingColumnFromZero : false,
            height : 300,
            headerGroup : [ {fromIndex:"mtsoNm", toIndex:"mtsoNmbtn", title: cflineMsgArray['mtsoName'] , hideSubTitle:true} ]
        });
		
		$('#'+gridMtso).on('dataAddEnd', function(e){
			var addRowIndex = $('#'+gridMtso).alopexGrid('dataGet').length-1; //전체 행 가져오기
			$('#'+gridMtso).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofCd" );
		});
		
    };

    function setSelectCode() {
    	cflineShowProgressBody();
    	//관리구분
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'mgmtGrpCdData');
    	//전송실
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');
    	//장비
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selecteqpmdlbas', null, 'GET', 'eqpMdlList');
    	//용량
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'capaCdData');
    	// 팝업용 사용자관할전송실
    	searchUserJrdtTmofInfoPop("popMgmtGrpCd");
    }
    
    function setEventListener() {
   	
    	//관리그룹 변경설정
    	$('#mgmtGrpCdPop').on('change',function(e){

    		sMgmtGrpCd = $('#mgmtGrpCdPop').val();
    		
    		$('#popUprOwnCd').setSelected(sMgmtGrpCd);
    		$('#popLowOwnCd').setSelected(sMgmtGrpCd);
    		
    		// 상,하위국 전송실 초기화
    		var tmof = tmofData[$('#mgmtGrpCdPop').val()];
    		if (tmof != undefined) {
	    		$('#popUprTmofCd').clear();
	    		$('#popUprTmofCd').setData({data : tmof});
	    		$('#popLowTmofCd').clear();
	    		$('#popLowTmofCd').setData({data : tmof});
    		}
    		
    		// 상,하위국 국사 초기화
    		$("#popUprMtsoId").val("");
    		$("#popUprMtsoNm").val("");
    		$("#popLowMtsoId").val("");
    		$("#popLowMtsoNm").val("");
    	});
    	
    	// 상위국 관리그룹 변경설정
    	$('#popUprOwnCd').on('change',function(e){
    		// 상,하위국 전송실 초기화
    		var tmof = tmofData[$('#popUprOwnCd').val()];
    		if (tmof != undefined) {
	    		$('#popUprTmofCd').clear();
	    		$('#popUprTmofCd').setData({data : tmof});
    		}
    		// 상국 국사 초기화
    		$("#popUprMtsoId").val("");
    		$("#popUprMtsoNm").val("");
    	});
    	
    	// 하위국 관리그룹 변경설정
    	$('#popLowOwnCd').on('change',function(e){
    		// 상,하위국 전송실 초기화
    		var tmof = tmofData[$('#popLowOwnCd').val()];
    		if (tmof != undefined) {
	    		$('#popLowTmofCd').clear();
	    		$('#popLowTmofCd').setData({data : tmof});
    		}
    		// 상국 국사 초기화
    		$("#popLowMtsoId").val("");
    		$("#popLowMtsoNm").val("");
    	});
    	

    	// 상위국사 전송실
    	$('#popUprTmofCd').on('change',function(e){
    		var tmofId = $('#popUprTmofCd').val();
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(tmofId == dataS.value){
    					uprTmofOrgId = dataS.hdofcCd;
    					uprTmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}
    	});
    	// 하위국사 전송실
    	$('#popLowTmofCd').on('change',function(e){
    		var tmofId = $('#popLowTmofCd').val();
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(tmofId == dataS.value){
    					lowTmofOrgId = dataS.hdofcCd;
    					lowTmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}
    	});   
    	
    	// 상위국 국사찾기
    	$('#popUprMtsoNm').on('keydown', function(e) {
    		if (e.which == 13  ){
				var tmofId = $('#popUprTmofCd').val();
	    		var mtsoNm = $('#popUprMtsoNm').val();
	    		
	    		searchMtso("upr", $("#popUprOwnCd").val(), tmofId, mtsoNm);
    		}
		});
    	$('#btnUpMtsoSch').on('click', function(e) {
			var tmofId = $('#popUprTmofCd').val();
    		var mtsoNm = $('#popUprMtsoNm').val();
    		
    		searchMtso("upr", $("#popUprOwnCd").val(), tmofId, mtsoNm);
		});
    	
    	// 하위국 국사찾기
    	$('#popLowMtsoNm').on('keydown', function(e) {
    		if (e.which == 13  ){
				var tmofId = $('#popLowTmofCd').val();
	    		var mtsoNm = $('#popLowrMtsoNm').val();
	    		
	    		searchMtso("low",  $("#popLowOwnCd").val(), tmofId, mtsoNm);
    		}
		});
    	$('#btnLowMtsoSch').on('click', function(e) {
    		var tmofId = $('#popLowTmofCd').val();
    		var mtsoNm = $('#popLowMtsoNm').val();
    		
    		searchMtso("low",  $("#popLowOwnCd").val(), tmofId, mtsoNm);
		});
    	
    	// 그리드 국사찾기
    	$('#'+gridMtso).on('click', '#btnMtsoGridSch', function(e){
	 	 	var data = AlopexGrid.currentData(AlopexGrid.parseEvent(e).data);
			
	 	 	tmofOrgId = "";
	 	 	tmofTeamId = "";
	 	 	
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(data.tmofId == dataS.value){
    					tmofOrgId = dataS.hdofcCd;
    					tmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}		
	 	 	searchMtso("grid", data.mgmtGrpCd, data.tmofId, data.mtsoNm);
		});
    	$('#'+gridMtso).on('keydown', function(e){
    		if (e.which == 13  ){
	    		var event = AlopexGrid.parseEvent(e);
	    		if(event.data._key == "mtsoNm"){
	    			var data = AlopexGrid.currentData(event.data);
    				
    		 	 	tmofOrgId = "";
    		 	 	tmofTeamId = "";
    		 	 	
    	    	 	if(TmofAllData != null && TmofAllData.length > 0){
    	    			for(m=0; m<TmofAllData.length; m++){
    	    				var dataS = TmofAllData[m];  
    	    				if(data.tmofId == dataS.value){
    	    					tmofOrgId = dataS.hdofcCd;
    	    					tmofTeamId = dataS.teamCd;
    	    					break;
    	    				}
    	    			}
    	    	 	}		
	    			searchMtso("grid", data.mgmtGrpCd, data.tmofId, data.mtsoNm);
	    		}
    		}
    	});
    	
    	// 그리드 국사 change
    	$('#'+gridMtso).on('propertychange input', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		if(event.data._key == "mtsoNm"){
	    		event.data.mtsoId = "";
	    		//initEqpAndPort();
    		}
    	});
    	
    	// 장비모델 선택
    	$('#popWdmEqpMdlId').on('change',function(e){
    		var eqpMdlId = $("#popWdmEqpMdlId").val();
    		
    		// 선택한 장비모델의 밴드, 파장/주파수 검색
    		var bdwthParam = {"searchDiv" : "", "eqpMdlId" : eqpMdlId };
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selecteqpmdldtlval', bdwthParam, 'GET', 'eqpMdlDtlVal');
    		
    	});
    	//파장/주파수선택
    	$('#popWavlVal').on('change', function(e) {
    		setBandWavlMap("bdwth", $('#popWavlVal').val());
		});
    	//Band 선택
    	$('#popWdmBdwthVal').on('change', function(e) {
    		setBandWavlMap("wavl", $('#popWdmBdwthVal').val());
		});
    	
    	// PATH전송실 행추가
        $('#btnAddRow').on('click', function(e) {
        	addRow();
        });
        
        // PATH전송실 행삭제
        $('#btnRemoveRow').on('click', function(e) {
        	removeRow();
        	//initEqpAndPort();
        });
        
        // 상위국 전송실 변경시 초기화
    	$('#popUprTmofCd').on('change',function(e){
    		$("#popUprMtsoId").val("");
    		$("#popUprMtsoNm").val("");
    	});
    	// 하위국 전송실 변경시 초기화
    	$('#popLowTmofCd').on('change',function(e){
    		$("#popLowMtsoId").val("");
    		$("#popLowMtsoNm").val("");
    	});

     	// 상위국사 변경시 초기화
     	$('#popUprMtsoNm').on('propertychange input', function(e){
     		$("#popUprMtsoId").val("");
     	});
     	// 하위국사 변경시 초기화
     	$('#popLowMtsoNm').on('propertychange input', function(e){
     		$("#popLowMtsoId").val("");
     	});
     	
        //등록
        $('#btnSave').on('click', function(e) {
        	var msgArg = "";
        	var param = $("#wdmTrunkWriteForm").getData();
        	
        	if(nullToEmpty(param.ntwkLineNm) == ''){
        		$('#popNtwkLineNm').focus();
        		msgArg = cflineMsgArray['trunkNm']; /* 트렁크명 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
        		return;
        	}
        	else if(nullToEmpty(param.ntwkLineNm).length >100){
        		$('#popNtwkLineNm').focus();
            	msgArg = cflineMsgArray['trunkNm']; /* 트렁크명 */
            	var msgArg1 = "100";
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"","")); /* {0} 항목은 {1}자까지 입력가능합니다. */
            	return;
        	}
        	
        	if(nullToEmpty(param.ntwkCapaCd) ==''){
        		$('#popNtwkCapaCdNm').focus();
        		msgArg = cflineMsgArray['capacity']; /* 용량 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */	
        		return;
        	} 
        	if(nullToEmpty(param.wdmEqpMdlId) ==''){
        		$('#popWdmEqpMdlId').focus();
        		msgArg = cflineMsgArray['equipmentModel']; /* 장비모델 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */	
        		return;
        	}
        	if(nullToEmpty(param.wavlVal) ==''){
        		$('#popWavlVal').focus();
        		msgArg = cflineMsgArray['wavelength']+"/"+cflineMsgArray['frequency']; /* 파장/주파수 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
        		
        		return;
        	}
        	if(nullToEmpty(param.wdmDrcVal) ==''){
        		$('#popWdmDrcVal').focus();
        		msgArg = cflineMsgArray['direction']; /* 방향 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
        		return;
        	} 
        	
    		if(nullToEmpty(param.uprTmofId) == ""){
    			$('#popUprTmofCd').focus();
    			/*msgArg = cflineMsgArray['superStation'] + " " + cflineMsgArray['transmissionOffice'];  상위국 전송실 */
    			msgArg = cflineMsgArray['upperMtso'] + " " + cflineMsgArray['transmissionOffice']; /* 상위국사 전송실 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    			return false;
    		}
    		if(nullToEmpty(param.uprMtsoId) == "" && nullToEmpty(param.uprMtsoNm) != ""){
    			$('#popUprMtsoNm').focus();
    			msgArg = cflineMsgArray['upperMtso']; /* 상위국사 */
 				alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
    			return false;
    		}
    		
    		if(nullToEmpty(param.lowTmofId) == ""){
    			$('#popLowTmofCd').focus();
    			/*msgArg = cflineMsgArray['subStation'] + " " + cflineMsgArray['transmissionOffice'];  하위국 전송실 */
    			msgArg = cflineMsgArray['lowerMtso'] + " " + cflineMsgArray['transmissionOffice'];  /* 하위국사 전송실 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    			return false;
    		}
    		
    		if(nullToEmpty(param.lowMtsoId) == "" && nullToEmpty(param.lowMtsoNm) != ""){
    			$('#popLowMtsoNm').focus();
    			msgArg = cflineMsgArray['lowerMtso']; /* 하위국사 */
 				alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
    			return false;
    		}
    		
    		// 그리드 
    		$('#'+gridMtso).alopexGrid("endEdit", { _state : { editing : true }} );
    		
    		
    		if($('#mgmtGrpCdPop').val() != $('#popUprOwnCd').val() && $('#mgmtGrpCdPop').val() != $('#popLowOwnCd').val() && getGridMgmt($('#mgmtGrpCdPop').val()) == 0){
    			var sMgmtGrpNm = $('#mgmtGrpCdPop').val() == "0001"? "SKT":"SKB";
    			var msgArg = "상위국사, 하위국사, PATH전송실 리스트 중  관리그룹이 " + sMgmtGrpNm + " 인 국사가 1개이상 존재해야 합니다."; /* 하위국사 */
    			alertBox('I', msgArg);
    			$('#'+gridMtso).alopexGrid("startEdit");
    				return false;
    		}
    		
     		var dataList = $('#'+gridMtso).alopexGrid('dataGet');
     		
     		var tmofDiv = "";
     		var validate = true;
     		
     		var uprMtsoId = nvlStr($("#popUprMtsoId").val(), $("#popUprTmofCd").val());
     		var lowMtsoId = nvlStr($("#popLowMtsoId").val(), $("#popLowTmofCd").val());
     		
     		var validateParam = {"uprTmofId":uprMtsoId, "lowTmofId":lowMtsoId};
     		
     		for(var i=0; i<dataList.length; i++){
     			$.each(validateParam, function(key,val){
     				var value = nvlStr(dataList[i].mtsoId, dataList[i].tmofId);
     				if(value == val){
     					validate = false;
     					tmofDiv = key;
     					return validate;
     				}
     				validateParam["pathTmofId"+i] = value;
     			});
     			
     			var msgStr = cflineMsgArray['pathTmof'] + " "+ parseInt(i+1) + cflineMsgArray['row']+ " : "; /* PATH전송실 i행 : */
     			if(!validate){
     				if(tmofDiv == "uprTmofId"){
     					/* 이미 상위국사에 등록 되어있습니다.*/
     					msgStr += makeArgMsg('saveToDuplication', cflineMsgArray['upperMtso'], '', '', '');
     				}
     				else if(tmofDiv == "lowTmofId"){
     					/* 이미 하위국사에 등록 되어있습니다.*/
     					msgStr += makeArgMsg('saveToDuplication', cflineMsgArray['lowerMtso'], '', '', '');
     				}else {
     					/* 같은 전송실 또는 국사를 등록 할 수 없습니다.*/
     					msgStr += cflineMsgArray['tmofSameNotReg'];
     				}
     	    		$('#'+gridMtso).alopexGrid("startEdit");
     	    		
     	    		alertBox('W', msgStr);
     	    		return;
     			}
     			
     			if(nullToEmpty(dataList[i].mtsoId)=="" && nullToEmpty(dataList[i].mtsoNm) != ""){
     				msgArg = cflineMsgArray['mobileTelephoneSwitchingOffice']; /* 국사 */
     				alertBox('W', makeArgMsg('validationId',msgArg,msgStr,"","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
     				$('#'+gridMtso).alopexGrid("startEdit");
     				return;
     			}
     		}
     		if(validate){
	        	callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst){  
	            	if (msgRst == 'Y') {
	            		wdmTrunkWrite(); 
	            	}
	        	});	
     		}
     		$('#'+gridMtso).alopexGrid("startEdit");
        });
        
        //취소
   	 	$('#btnCncl').on('click', function(e) {
   	 		$a.close();
        });
   	 	
/*
     	// 상위국사 변경시 초기화
     	$('#wdmEqpNm').on('propertychange input', function(e){
     		$("#wdmEqpId").val("");
     	});
     	// 하위국사 변경시 초기화
     	$('#wdmPortNm').on('propertychange input', function(e){
     		$("#wdmPortId").val("");
     	});

        //장비설정
   	 	$('#btnEqpSch').on('click', function(e) {
   	 		openEqpListPop();
        });
   	 	
        //포트설정
   	 	$('#btnPortSch').on('click', function(e) {
   	 		openPortListPop();
        });
   	 	
        // 상위전송실
   	 	$('#popUprTmofCd, #popUprMtsoId, #popLowTmofCd, #popLowMtsoId').on('change', function(e) {
   	 		initEqpAndPort();
        }); 
   	 	
		// Path 국사 변경
	 	$('#'+gridMtso).on('cellValueEditing', function(e){
	 		var evObj = AlopexGrid.parseEvent(e);
	 		if((evObj.mapping.key == "mgmtGrpCd" ||  evObj.mapping.key == "tmofId" )
	 			&& evObj.value != evObj.prevValue) {	 			
	 			initEqpAndPort();
	 		}
	   	});
*/
   	 	
	}

	 	
  	 /**
  	 * Function Name : initEqpAndPort
  	 * Description   : 장비/포트 초기화
  	 */ 
  	 function initEqpAndPort(){
  		$('#wdmEqpNm, #wdmEqpId').val("");
  		$('#wdmPortNm, #wdmPortId').val("");
  	 }
   	 	
   	 /**
   	 * Function Name : openEqpListPop
   	 * Description   : 장비 검색
   	 * ----------------------------------------------------------------------------------------------------
   	 * param    	 	: 
   	 * ----------------------------------------------------------------------------------------------------
   	 * return        : return param  
   	 */ 
   	 function openEqpListPop(){
   	 	
   		// 상위국/하위국/Path 정보 확인
		tempTmofInfo = [];
			
		var uprMtsoId = nvlStr($("#popUprMtsoId").val(), $("#popUprTmofCd").val());
		var lowMtsoId = nvlStr($("#popLowMtsoId").val(), $("#popLowTmofCd").val());
		
		if (nullToEmpty(uprMtsoId) != '') {
			tempTmofInfo.push({"mtsoId" : uprMtsoId});
		}
		if (nullToEmpty(lowMtsoId) != '') {
			tempTmofInfo.push({"mtsoId" : lowMtsoId});
		}
			
 		// 그리드 
		$('#'+gridMtso).alopexGrid("endEdit");
  		var dataList = $('#'+gridMtso).alopexGrid('dataGet');
  		
  		for (var i = 0 ; i < dataList.length; i++) {
  			tempTmofInfo.push({"mtsoId" : nvlStr(dataList[i].mtsoId, dataList[i].tmofId)});
  		}
  		$('#'+gridMtso).alopexGrid("startEdit");
			  	
   		if (tempTmofInfo == null || tempTmofInfo.length == 0) {  // 장비검색시 필요정보 체크
   			alertBox('W', cflineMsgArray['pleaseChooseUperLowMtsoOrPathMtso']);			/* 상하위국 혹은 Path전송실을 설정해 주세요.  */
   			return ;
   		} 
   		 
 		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) ==""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		var paramData = new Object();
 		$.extend(paramData,{"neNm":nullToEmpty($('#wdmEqpNm').val())});
 		$.extend(paramData,{"vTmofInfo":tempTmofInfo}); // 최상위 전송실 조회 리스트
 		$.extend(paramData,{"searchDivision":"wdm"});
 		$.extend(paramData,{"fdfAddVisible":true});
 		
 		$.extend(paramData,{ "wdmYn" :"Y"});
 		
 	   // TODO SKB ADAMS 연동 고도화
 		$.extend(paramData,{"mgmtGrpCd" : $("#mgmtGrpCd").val()}); 
 		$.extend(paramData,{"svlnLclCd":""});
 		$.extend(paramData,{"topoSclCd":topoSclCd});
 		
 		$a.popup({
 		  	popid: "popEqpListSchForWdm",
 		  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
 		  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
 		  	data: paramData,
 			modal: true,
 			movable:true,
//   	 			windowpopup : true,
 			width : 900,
 			height : 800,
 			callback:function(data){
 				if(data != null){
 					$('#wdmEqpNm').val(data.neNm);
 					$('#wdmEqpId').val(data.neId);
 					
 					// 다른 팝업에 영향을 주지않기 위해
					$.alopex.popup.result = null;
 				}
 			}
 		});
   	 }
   	 
   	/**
   	 * Function Name : openPortListPop
   	 * Description   : 포트 검색
   	 * ----------------------------------------------------------------------------------------------------
   	 * param    	 : PortId. 포트 아이디
   	 *                 PortNm. 포트명
   	 *                 neId. 장비 아이디
   	 *                 searchPortNm. 검색할 포트 명
   	 *                 leftRight. 좌포트 우포트 구분
   	 * ----------------------------------------------------------------------------------------------------
   	 * return        : return param  
   	 */
   	function openPortListPop(neId, searchPortNm, param, gridId){
   		if (nullToEmpty($('#wdmEqpNm').val()) == '' || nullToEmpty($('#wdmEqpId').val()) == '' ) {  // 장비명이 설정된 경우만
   			alertBox('W', cflineMsgArray['pleaseChooseEqpNm']);			/* 장비명을 설정해주세요. */
   			return ;
   		} 
   		
		var paramData = new Object();
		$.extend(paramData,{"neId":nullToEmpty(nullToEmpty($('#wdmEqpId').val()))});
		$.extend(paramData,{"portNm":nullToEmpty(nullToEmpty($('#wdmPortNm').val()))});
		
		// ne_role_cd, ntwk_line_no
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		$.extend(paramData,{"isService":false});
		$.extend(paramData,{"ntwkLineNo": null});
		$.extend(paramData,{"topoLclCd": "003"});
		$.extend(paramData,{"topoSclCd": "101"});
		
		
		$a.popup({
		  	popid: "popPortListSchForWdm",
		  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
		  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
		  	data: paramData,
		  	iframe:true,
			modal: true,
			movable:true,
//   				windowpopup : true,
			width : 900,
			height : 800,
			callback:function(data){
				if(data != null && data.length > 0) {					
 					$('#wdmPortNm').val(data[0].portNm);
 					$('#wdmPortId').val(data[0].portId);
 					
 					if (data.length > 1) {
 						alertBox('W', cflineMsgArray['chooseDozenPortSetFirstPort']); 			/* 여러개의 포트를 선택한경우 첫번째 포트만 설정됩니다. */			
 					}
 					// 다른 팝업에 영향을 주지않기 위해
					$.alopex.popup.result = null;
				}
			}
		});
   	}
   	 
    /**
     * Function Name : searchMtso
     * Description   : 국사 검색
     * ----------------------------------------------------------------------------------------------------
     * param    	 : searchDiv. 검색flag (upr - 상위국, low - 하위국, grid - 그리드)
     * 				   mgmtGrpCd. 사업자
     * 				   tmofId. 전송실 
     *                 mtsoNm. 국사명 
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function searchMtso(searchDiv, mgmtGrpCd, tmofId, mtsoNm){
    	var mgmtGrpNm = (mgmtGrpCd == "0002")? "SKB":"SKT";
    	
    	var orgId = null;
    	var teamId = null;
    	if( searchDiv == "upr" ){
    		orgId = uprTmofOrgId;
    		teamId = uprTmofTeamId;
    	}else if( searchDiv == "low" ){
    		orgId = lowTmofOrgId;
    		teamId = lowTmofTeamId;
    	}else {
    		orgId = tmofOrgId;
    		teamId = tmofTeamId;
    	}
    	
    	// paramValue : 사업자, 전송실, 국사명
 	 	var paramValue = { "mgmtGrpNm": mgmtGrpNm, "tmof": tmofId, "mtsoNm": mtsoNm, "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : orgId , "teamId" : teamId };
		
 	 	var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) ==""){
 			urlPath = "/tango-transmission-web";
 		}
 		$a.popup({
 		  	popid: "popMtsoSch",
 		  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
 		  	url: urlPath + '/configmgmt/common/MtsoLkup.do',
 			data: paramValue,
 			iframe: true,
 		    modal : true,
 		    movable : true,
 			width : 950,
 			height : 850,
 			callback:function(data){
 				if(data != null){
 					if(searchDiv != "grid"){
 						var selectMgmtGrpCd = searchDiv == "upr"? $('#popUprOwnCd').getTexts() : $('#popLowOwnCd').getTexts() ;
 						if(data.mgmtGrpNm != selectMgmtGrpCd){
 							// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
 							var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['managementGroup']+ " " +cflineMsgArray['information'], data.mgmtGrpNm, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
 							alertBox('W', msg);
 							return;
 						}
 			 	 	}
 			 	 	
 					if(data.mtsoStatCd != "01"){
 						// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
						var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['mobileTelephoneSwitchingOfficeStatus'], data.mtsoStat, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
						alertBox('W', msg);
						return;
 					}
 					
 					if(data.mtsoTypCd != "2" && data.mtsoTypCd != "3" && data.mtsoTypCd != "4"){
 						// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
 						var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['mobileTelephoneSwitchingOfficeTypeCode'], data.mtsoTyp, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
 						alertBox('W', msg);
						return;
 					}
 					
 					setMtso(searchDiv, data.mtsoId);
 				}
 			}
 		}); 
    }
    
    function setMtso(searchDiv, mtsoId){
    	var param = {mtsoId : mtsoId};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getMtsoInfo', param, 'GET', searchDiv + 'MtsoInfo');
    }
    
    function setBandWavlMap(searchDiv, value){
    	if(searchDiv == "bdwth"){
    		var strBdwth = "";
    		if (bdwthWavlMap !=null && bdwthWavlMap.length > 0 ){
        		for(var i=0; i<bdwthWavlMap.length; i++){
        			if(bdwthWavlMap[i].wavlVal == value && bdwthWavlMap[i].wdmBdwthVal != null && bdwthWavlMap[i].wdmBdwthVal != ""){
        				$('#popWdmBdwthVal').val(bdwthWavlMap[i].wdmBdwthVal);
        				$('#popWdmBdwthVal').next().html(bdwthWavlMap[i].wdmBdwthVal);
        			}      		
        		}
    		}
    	}else if(searchDiv == "wavl"){
    		var wavlValList =[];
    		if (bdwthWavlMap !=null && bdwthWavlMap.length > 0 ){
        		for(var i=0; i<bdwthWavlMap.length; i++){
        			if(bdwthWavlMap[i].wdmBdwthVal == value 
        			   && bdwthWavlMap[i].wavlVal != null && bdwthWavlMap[i].wavlVal != ""){
        				var resObj = {value : bdwthWavlMap[i].wavlVal, text: bdwthWavlMap[i].wavlVal};
        				wavlValList.push(resObj);
        			}     
        		}
    		}
    		$('#popWavlVal').clear();
    		$('#popWavlVal').setData({data : wavlValList});
    	}
    	
    }
    
    function wdmTrunkWrite(){
    	$('#writeGrid').alopexGrid("endEdit",{ _state : { editing : true }});
    	
    	paramFormData = $("#wdmTrunkWriteForm").getData();

    	var wavlVal = paramFormData.wavlVal;
    	var fIndex = wavlVal.indexOf("/") + 1;
    	var cIndex = wavlVal.indexOf("(");
    	var freqVal = "";
    	var chnlVal = "";
    	if(cIndex > 0){
    		freqVal = wavlVal.substring(fIndex, cIndex);
    		chnlVal = wavlVal.substring(cIndex+3, wavlVal.indexOf(")") );
    	} else {
    		freqVal = wavlVal.substring(fIndex);
    	}

    	params = $('#writeGrid').alopexGrid('dataGet');
    	

    	$.extend(paramFormData,{"wdmFreqVal":freqVal});
    	$.extend(paramFormData,{"wdmChnlVal":chnlVal});
    	$.extend(paramFormData,{"topoLclCd":sTopoLclCd});
		$.extend(paramFormData,{"topoSclCd":sTopoSclCd});
		$.extend(paramFormData,{"mtsoLnoList":params});
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/insertwdmtrunkinfo', paramFormData, 'POST', 'insertWdmTrunk');
    }
    
    /*
	 * Function Name : addRow
	 * Description   : path전송실 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addRow() {
    	var tmof = tmofData["0002"];
    	
    	var initRowData = [
    	    { "mgmtGrpCd" : $('#mgmtGrpCdPop').val()//"0002"
    	     , "tmofId" : tmofData[$('#mgmtGrpCdPop').val()][0].value
    	     , "tmofNm" : tmofData[$('#mgmtGrpCdPop').val()][0].text
    	     , "mtsoId" : '' 
    	     , "mtsoNm" : ''
    	    }
    	];

    	$('#'+gridMtso).alopexGrid("dataAdd", initRowData);
    	$('#'+gridMtso).alopexGrid("startEdit");
    }
    
    /*
	 * Function Name : removeRow
	 * Description   : path전송실 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removeRow() {
    	var dataList = $('#'+gridMtso).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridMtso).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    }
    
    function getGridMgmt(mgmtTyp){
    	var mgmtData = $('#'+gridMtso).alopexGrid("dataGet", {"mgmtGrpCd" : mgmtTyp });
    	return mgmtData.length;
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
    
    function successCallback(response, status, jqxhr, flag){
    	// 관리그룹
    	if(flag == 'mgmtGrpCdData') {
    		mgmtGrpCdData = response;
    		
    		$('#mgmtGrpCdPop').clear();
    		$('#mgmtGrpCdPop').setData({data : mgmtGrpCdData});
    		$('#popUprOwnCd').clear();
    		$('#popUprOwnCd').setData({data : mgmtGrpCdData});
    		$('#popLowOwnCd').clear();
    		$('#popLowOwnCd').setData({data : mgmtGrpCdData});
    		
    		
    		// 관리그룹 (0001:SKT, 0002:SKB) - WDM기본 SKB
    		//$('#mgmtGrpCdPop').setSelected("0002");
    		if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
				var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCdPop').val();
				// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
			    if (userJrdtTmofMgmtCd != "" && $('#mgmtGrpCdPop').find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
			    	$('#mgmtGrpCdPop').setSelected(userJrdtTmofMgmtCd);
			    } else {
			    	// 소속전송실에 속한 관리그룹이 없는 경우
			    	$('#mgmtGrpCdPop').setSelected( ($('#userMgmtCdPop').val() == '' ?  "0002" : $('#userMgmtCdPop').val()));
			    }			
			} else {
				// 소속전송실에 속한 관리그룹이 없는 경우
				$('#mgmtGrpCdPop').setSelected(($('#userMgmtCdPop').val() == '' ?  "0002" : $('#userMgmtCdPop').val()));
			}
    		
    		sMgmtGrpCd = $('#mgmtGrpCdPop').val();
    		
    	}
    	// 용량 데이터
    	else if(flag == 'capaCdData'){
    		$('#popNtwkCapaCd').setData({data : response});
		}
    	// 장비모델
    	else if(flag == 'eqpMdlList'){
    		$('#popWdmEqpMdlId').setData({data : response});
    		$('#popWdmBdwthVal').setData({data : []});
    		$('#popWavlVal').setData({data : []});
		}
    	
    	// 밴드, 파장/주파수(채널)
    	else if(flag == 'eqpMdlDtlVal'){
    		bdwthWavlMap = response.mapList;
    		var bdwthData = response.bdwthList;
    		var bdwthValList =[];
    		if (bdwthData !=null && bdwthData.length > 0 ){
	    		for(var i=0; i<bdwthData.length; i++){
	    			var resObj = {value : bdwthData[i].wdmBdwthVal, text: bdwthData[i].wdmBdwthVal};
	    			bdwthValList.push(resObj);
	    		}
    		}
    		$('#popWdmBdwthVal').clear();
    		$('#popWdmBdwthVal').setData({data : bdwthValList});
    		
    		// 파장/주파수(채널)
    		var chnlData = response.chnlList;
    		var chnlValList   = [];
    		
    		if (chnlData !=null && chnlData.length > 0 ){
	    		for(var i=0; i<chnlData.length; i++){
	    			var resObj = {value : chnlData[i].wavlVal, text: chnlData[i].wavlVal};
	    			chnlValList.push(resObj);
	    		}
    		}	
    		$('#popWavlVal').clear();
    		$('#popWavlVal').setData({data : chnlValList});
    		
    	}
    	// 전송실
    	else if(flag == 'tmofData') {
    		checkTmofData = true;
    		var tmof = null;response.tmofListCombo["0002"];
    		if ($('#mgmtGrpCdPop').val() == '') {
    			tmof = response.tmofListCombo["0002"];
    		} else {
    			tmof = response.tmofListCombo[$('#mgmtGrpCdPop').val()];
    		}
    		$('#popUprTmofCd').clear();
    		$('#popUprTmofCd').setData({data : tmof});
    		
    		$('#popLowTmofCd').clear();
    		$('#popLowTmofCd').setData({data : tmof});
    		
    		tmofData = response.tmofListCombo;
    		TmofAllData = response.tmofCdList;
    	}
    	// 국사
    	else if(flag == "uprMtsoInfo"){
    		if(response != null && response.length > 0){
    			$('#popUprTmofCd').setSelected(response[0].topMtsoId);
     	 		$('#popUprMtsoId').val(response[0].mtsoId);
    			$('#popUprMtsoNm').val(response[0].mtsoNm);
    		} else {
    			/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));
    		}
    	}
    	else if(flag == "lowMtsoInfo"){
    		if(response != null && response.length > 0){
	    		$('#popLowTmofCd').setSelected(response[0].topMtsoId);
	    		$('#popLowMtsoId').val(response[0].mtsoId);
				$('#popLowMtsoNm').val(response[0].mtsoNm);
			} else {
				/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));			
    		}	
    	}
    	else if(flag == "gridMtsoInfo"){
    		if(response != null && response.length > 0){
    			var focusData = $('#'+gridMtso).alopexGrid("dataGet", {_state : {focused : true}});
        		var rowIndex = focusData[0]._index.data;
        		var editData = {"mgmtGrpCd":response[0].mgmtGrpCd, "tmofId":response[0].topMtsoId, "mtsoId":response[0].mtsoId, "mtsoNm": response[0].mtsoNm};
    			$('#'+gridMtso).alopexGrid( "dataEdit", $.extend({}, editData), {_index : { row : rowIndex}});
    			
    			// Path경로의 국사를 변경한 경우
    			//initEqpAndPort();
    		} else {
    			/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));
    		}
    	}
    	// 저장
    	else if(flag == 'insertWdmTrunk'){
    		$a.close(response);
    	}
    	

    	// 각 관리그룹, 전송실이 모두 취득된 후 화면편집이 가능하도록
		if (mgmtGrpCdData.length > 0 && checkTmofData == true  ) {
			cflineHideProgressBody();
		}
    	
    }

    function failCallback(response, status, flag){
    	// 각 관리그룹, SKT전송실, SKB전송실이 모두 취득된 후 화면편집이 가능하도록
    	//if (flag == 'mgmtGrpCdData' || flag == 'tmofData' || flag == 'eqpMdlList' || flag == 'capaCdData' ) {
			cflineHideProgressBody();
		//}
    	
    	if(flag == 'insertWdmTrunk') {
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    	}
    	else {
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	
    }
});