/**
 * PopWdmTrunkWrite.js
 *
 * @author ohjungmin(posgen)
 * @date 2016. 9. 19.
 * @version 1.0
 */
$a.page(function() {
	var paramFormData = null;
	var params = null;
	var gridMtso = 'writeGrid';
	var C00188Data = [];	// 관리구분데이터
	var C00194Data = [];	// 용량데이터
	var EQPMDL = [];		// 장비
	var tmofData = [];		//전송실 데이터
	var TmofAllData = [];		/* 전송실 데이터 :	SKT,SKB */
	var	MtsoData = [];		//국소 데이터
	//var selectNtwkSeq = null;
	 
	var sTopoLclCd = "002";   //토폴로지대분류코드
	var sTopoSclCd = "100";   //토폴로지소분류코드
	
	//관리그룹 통일 변수 - 기본 : SKT
	var sMgmtGrpCd = "0001";
	var sMgmtGrpNm = "SKT";
	
	var mgmtGrpCdNmStr = "";
	var mgmtGrpCdPopData = [];  // 관리그룹 데이터
	var checkTmofData = false;  // 전송실 데이터 취득여부
	var userJrdtTmofInfoPop = "";
	var uprTmofOrgId = "";
	var uprTmofTeamId = "";
	var lowTmofOrgId = "";
	var lowTmofTeamId = "";
 	var tmofOrgId = "";
 	var tmofTeamId = "";
	
	this.init = function(id, param){
    	userJrdtTmofInfoPop = "";
 
		checkTmofData = false;
		
		//기본데이터 가지고 오기
		setSelectCode();
		
		//그리드 셋팅
		initGrid();
	
		setEventListener();	

	};	
	
	//Grid 초기화
	function initGrid() {

		var mappingEqp = [
		                  {selectorColumn : true , width : '40px'}
		               	, {key : 'mgmtGrpCd', align:'center', width:'150px', title : cflineMsgArray['managementGroup'] /*  관리그룹 */
	        		    	, render : {  type: 'string'
					                 , rule: function (value,data){
					                	 var render_data = [];				            				    
		            				    if (mgmtGrpCdData.length >1) {	
		            				    	return render_data = render_data.concat( mgmtGrpCdData );	    								
		            				    }else{
		    								return render_data.concat({value : data.mgmtGrpCd, text : data.mgmtGrpNm});	
		    							}
			    			}}
			         		,  editable : { type: 'select', rule: function(value, data) { return mgmtGrpCdData; } 
				         		, attr : {
		      			 				style : "width: 140px;min-width:140px;padding: 2px 2px;"
		      			 			} 
			         		}
			    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
		               	}
		               	, {key : 'tmofId', align:'center', width:'250px', title : '<em class="color_red">*</em> '+ cflineMsgArray['transmissionOffice'] /*전송실*/
				  			, render : { type:'string',
				  					rule : function(value, data){
				  						var render_data = [];
				  						var currentData = AlopexGrid.currentData(data);
				  						if (tmofData[currentData.mgmtGrpCd]) {
				  							return render_data = render_data.concat(tmofData[currentData.mgmtGrpCd]);
				  						} else {
				  							return render_data.concat({value : data.tmofId, text : data.tmofNm});
				  						}
				  					}
				  				},
				  				editable : {type : 'select', 
				  					rule : function(value, data){
				  						var render_data = [];
				  						var currentData = AlopexGrid.currentData(data);
				  						if (tmofData[currentData.mgmtGrpCd]) {
				  							return render_data = render_data.concat(tmofData[currentData.mgmtGrpCd]);
				  						} else {
				  							return render_data.concat({value : data.tmofId, text : data.tmofNm});
				  						}
				  					}
					         		, attr : {
	  	      			 				style : "width: 240px;min-width:240px;padding: 2px 2px;"
	  	      			 			} 
				  				},
				      			editedValue : function (cell) {

				  					return $(cell).find('select option').filter(':selected').val();
				  				},
				  				refreshBy: 'mgmtGrpCd'		
		            	}
		               	, {key : 'mtsoId'	, title :cflineMsgArray['mtsoCode']/* '국사코드'*/, hidden : true }	               				
		               	, {key : 'mtsoNm'	, title : cflineMsgArray['mtsoName'] /*'국사명'*/ , align:'left', width: '200px'
	   			    	   	, render : function(value, data){ return nullToEmpty(value)=="" ? data.mtsoNm:value; }
	   			            ,editable:  { type: 'text' }
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
	   			       , {key : 'mtsoNmbtn',value : function(value, data) {return null;}, width: '40px',render : {type : 'btnMtsoGridSch'} 
	   			        }
 
		                  ];

 
		 
		
      //그리드 생성
        $('#'+ gridMtso).alopexGrid({
        	pager : false,
        	columnMapping : mappingEqp,
        	autoColumnIndex: true,
        	autoResize: true,
        	cellSelectable : false,
            rowClickSelect : false,
            rowInlineEdit: false,
            rowSingleSelect : false,
            numberingColumnFromZero : false,
            height : 250,
            headerGroup : [
    		               {fromIndex:"mtsoNm", toIndex:"mtsoNmbtn", title: cflineMsgArray['mtsoName'] , hideSubTitle:true},
    		],
            renderMapping : {
    			"btnMtsoGridSch" : {
    				renderer : function(value, data, render, mapping) {
    				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnMtsoGridSch" type="button"></button></div>';
    	            }
    			}
    		}
        });

    };
    
    function setSelectCode() {
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data');

    	// 팝업용 사용자관할전송실
    	searchUserJrdtTmofInfoPop("mgmtGrpCdPop");    	
    	
    }
    
    
    function setEventListener() {
    	//관리그룹 변경설정
    	$('#mgmtGrpCdPop').on('change',function(e){
    		
    		sMgmtGrpCd = $("#mgmtGrpCdPop").val();
    		if(sMgmtGrpCd == "0001"){
    			sMgmtGrpNm = "SKT";
    		}else if(sMgmtGrpCd == "0002"){
    			sMgmtGrpNm = "SKB";
    		}
    		
    		$('#mgmtGrpCdPop').setEnabled(false);  // ADAMS 연동 고도화
    		
    		$('#uprOwnCdPop').setSelected(sMgmtGrpCd);
    		$('#lowOwnCdPop').setSelected(sMgmtGrpCd);
    		
 
    		if(nullToEmpty (sMgmtGrpCd) != "" ){
    			var tmof_option_data =  [];
    			var dataFst = {"value":"","text":cflineCommMsgArray['select'] };
    				tmof_option_data.push(dataFst);
    			var tmofCdList = tmofData[sMgmtGrpCd];
    			//console.log(tmofCdList);
    			if (tmofCdList != undefined) {

        			for (i =0; i< tmofCdList.length ; i++){
        				tmof_option_data.push(tmofCdList[i]);
        			}
        			$('#uprTmofIdPop').clear();
    				$('#uprTmofIdPop').setData({data : tmof_option_data});
        			$('#lowTmofIdPop').clear(); 
    				$('#lowTmofIdPop').setData({data : tmof_option_data});
    			}
    		}
    		

    		$('#uprMtsoIdPop').val("");
    		$('#uprMtsoNmPop').val("");
    		$('#lowMtsoIdPop').val("");
    		$('#lowMtsoNmPop').val("");   
    		 
      	}); 
    	
    	// 상위국 관리그룹 변경설정
    	$('#uprOwnCdPop').on('change',function(e){
    		// 상위국 전송실 초기화
			var tmof_option_data =  [];
			var dataFst = {"value":"","text":cflineCommMsgArray['select'] };
				tmof_option_data.push(dataFst);
			var tmofCdList = tmofData[$('#uprOwnCdPop').val()];
			if (tmofCdList != undefined) {

    			for (i =0; i< tmofCdList.length ; i++){
    				tmof_option_data.push(tmofCdList[i]);
    			}
    			$('#uprTmofIdPop').clear();
				$('#uprTmofIdPop').setData({data : tmof_option_data});
			}
    		// 상위국 국사 초기화
    		$("#uprMtsoIdPop").val("");
    		$("#uprMtsoNmPop").val("");
    	});
    	
    	// 하위국 관리그룹 변경설정
    	$('#lowOwnCdPop').on('change',function(e){
    		// 하위국 전송실 초기화
			var tmof_option_data =  [];
			var dataFst = {"value":"","text":cflineCommMsgArray['select'] };
				tmof_option_data.push(dataFst);
			var tmofCdList = tmofData[$('#lowOwnCdPop').val()];
			//console.log(tmofCdList);
			if (tmofCdList != undefined) {

    			for (i =0; i< tmofCdList.length ; i++){
    				tmof_option_data.push(tmofCdList[i]);
    			}
    			$('#lowTmofIdPop').clear(); 
				$('#lowTmofIdPop').setData({data : tmof_option_data});
			}
    		// 하위국 국사 초기화
    		$("#lowMtsoIdPop").val("");
    		$("#lowMtsoNmPop").val("");
    	});

    	// 상위국사 전송실
    	$('#uprTmofIdPop').on('change',function(e){
    		var tmofId = $('#uprTmofIdPop').val();
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
    	$('#lowTmofIdPop').on('change',function(e){
    		var tmofId = $('#lowTmofIdPop').val();
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
    	$('#btnUpMtsoSch').on('click', function(e) {
    		var tmofId = $('#uprTmofIdPop').val();
    		var mtsoNm = $('#uprMtsoNmPop').val();
    		var uMgmtGrpCd = $('#uprOwnCdPop').val();
    		searchMtso("upr", uMgmtGrpCd, tmofId, mtsoNm);
		});
    	$('#uprMtsoNmPop').on('keydown', function(e) {
    		if (e.which == 13  ){
	    		var tmofId = $('#uprTmofIdPop').val();
	    		var mtsoNm = $('#uprMtsoNmPop').val();
	    		
	    		searchMtso("upr", uMgmtGrpCd, tmofId, mtsoNm);
    		}
		});
    	
    	// 하위국 국사찾기
    	$('#btnLowMtsoSch').on('click', function(e) {
			var tmofId = $('#lowTmofIdPop').val();
    		var mtsoNm = $('#lowMtsoNmPop').val();
    		var lMgmtGrpCd = $('#lowOwnCdPop').val();
    		searchMtso("low", lMgmtGrpCd, tmofId, mtsoNm);
		});
    	$('#lowMtsoNmPop').on('keydown', function(e) {
    		if (e.which == 13  ){
	    		var tmofId = $('#lowTmofIdPop').val();
	    		var mtsoNm = $('#lowMtsoNmPop').val();
	    		
	    		searchMtso("low", lMgmtGrpCd, tmofId, mtsoNm);
    		}
		});
    	
    	// 그리드 국사 검색 
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
    	
    	// 상위국 국사 change
     	$('#uprMtsoNmPop').on('propertychange input', function(e){
     		$("#uprMtsoIdPop").val("");
     	});

     	// 하위국 국사 change
     	$('#lowMtsoNmPop').on('propertychange input', function(e){
     		$("#lowMtsoIdPop").val("");
     	});
 
    	// 그리드 국사 change
    	$('#'+gridMtso).on('propertychange input', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		if(event.data._key == "mtsoNm"){
	    		event.data.mtsoId = "";
    		}
    	});
    	
    	// 상위국 전송실 변경
    	$('#uprTmofIdPop').on('change',function(e){
    		$("#uprMtsoNmPop").val("");
    		$("#uprMtsoIdPop").val("");
    	});
    	// 하위국 전송실 변경
    	$('#lowTmofIdPop').on('change',function(e){
    		$("#lowMtsoNmPop").val("");
    		$("#lowMtsoIdPop").val("");
    	});
    	
    	// path 전송실 행추가
        $('#btn_add').on('click', function(e) {
        	addEqpRow();
        });
        
        // path 전송실 행삭제
        $('#btn_remove').on('click', function(e) {
        	removeEqpRow();
        });
        
        //등록
        $('#btnSave').on('click', function(e) {
    	       	var param = $("#trunkWriteForm").getData();
            	if(nullToEmpty(param.ntwkLineNm) == ''){
            		$('#ntwkLineNmPop').focus();
            		var msgArg = cflineMsgArray['trunkNm']; /*트렁크명*/
            		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
            		return;
            	}
                if(nullToEmpty(param.ntwkLineNm).length >100){
                	$('#ntwkLineNmPop').focus();
                	var msgArg = cflineMsgArray['trunkNm']; /*트렁크명*/
                	var msgArg1 = "100" + cflineMsgArray['digitPlace'] ; /*100자리*/
                	alertBox('W', makeArgMsg('canotSpecialCount',msgArg,msgArg1,"","")); /*{0}은 {1}을 초과할 수 없습니다.*/
                	return;
            	}
            	if(nullToEmpty(param.mgmtGrpCd) ==''){
            		$('#mgmtGrpCdPop').focus();
            		var msgArg = cflineMsgArray['managementGroup']; /*관리그룹*/
            		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */	
            		return;
            	}
            	if(nullToEmpty(param.ntwkCapaCd) ==''){
            		$('#ntwkCapaCdNmPop').focus();
            		var msgArg = cflineMsgArray['capacity']; /*용량*/
            		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */	
            		return;
            	} 
            	/*if(nullToEmpty(param.wdmDrcVal) ==''){
            		$('#wdmDrcValPop').focus();
            		var msgArg = "방향";
            		alertBox('W', makeArgMsg('required',msgArg,"","",""));  필수 입력 항목입니다.[{0}] 
            		return;
            	}*/
            
    		 if(nullToEmpty($('#uprTmofIdPop').val()) == ""){
    			 $('#uprTmofIdPop').focus();
    			 msgArg = cflineMsgArray['upperMtso'] + " " + cflineMsgArray['transmissionOffice']; /* 상위국사 전송실 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    			return false;
    		}
    		if(nullToEmpty($('#uprMtsoIdPop').val()) == "" && nullToEmpty($('#uprMtsoNmPop').val()) != ""){
    			$('#uprMtsoNmPop').focus();
    			msgArg = cflineMsgArray['upperMtso']; /* 상위국사 */
 				alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
    			return false;
    		}
    		
    		if(nullToEmpty($('#lowTmofIdPop').val()) == ""){
    			$('#lowTmofIdPop').focus();
    			msgArg = cflineMsgArray['lowerMtso'] + " " + cflineMsgArray['transmissionOffice'];  /* 하위국사 전송실 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    			return false;
    		}
    		
    		if(nullToEmpty($('#lowMtsoIdPop').val()) == "" && nullToEmpty($('#lowMtsoNmPop').val()) != ""){
    			$('#lowMtsoNmPop').focus();
    			msgArg = cflineMsgArray['lowerMtso']; /* 하위국사 */
 				alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
    			return false;
    		}
     		 
     		 
     		$('#'+gridMtso).alopexGrid("endEdit", { _state : { editing : true }} );
     		
    		if($('#mgmtGrpCdPop').val() != $('#uprOwnCdPop').val() && $('#mgmtGrpCdPop').val() != $('#lowOwnCdPop').val() && getGridMgmt($('#mgmtGrpCdPop').val()) == 0){
    			var sMgmtGrpNm = $('#mgmtGrpCdPop').val() == "0001"? "SKT":"SKB";
    			var msgArg = "상위국사, 하위국사, PATH전송실 리스트 중  관리그룹이 " + sMgmtGrpNm + " 인 국사가 1개이상 존재해야 합니다."; /* 하위국사 */
    			alertBox('I', msgArg);
    			$('#'+gridMtso).alopexGrid("startEdit");
    				return false;
    		}
     		
     		var dataList = $('#'+gridMtso).alopexGrid('dataGet');
   		 

     		var tmofDiv = "";
     		var validate = true;
     		
     		
     		var uprMtsoId = nvlStr($('#uprMtsoIdPop').val(), $('#uprTmofIdPop').val());
     		var lowMtsoId = nvlStr($('#lowMtsoIdPop').val(), $('#lowTmofIdPop').val());
     		
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
    	var mgmtGrpNm = mgmtGrpCd == "0002"? "SKB":"SKT";

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
 			height : 750,
 			callback:function(data){
 				if(data != null){
 					if(searchDiv != "grid"){
 						var selectMgmtGrpCd = searchDiv == "upr"? $('#uprOwnCdPop').getTexts() : $('#lowOwnCdPop').getTexts() ;
 						if(data.mgmtGrpNm != selectMgmtGrpCd){
 							// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
 							var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['managementGroup'] + " " + cflineMsgArray['information'], data.mgmtGrpNm, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
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
    
	function getMtsoIdByTmofCdMtsoCd(tmofCd, mtsoCd){
		var returnValue = nullToEmpty(tmofCd);
		if(nullToEmpty(mtsoCd) != ""){
			 returnValue = nullToEmpty(mtsoCd);
		}
		return returnValue;
	}
	
    function wdmTrunkWrite(){
    	
    	$('#writeGrid').alopexGrid("endEdit",{ _state : { editing : true }});
    	
    	paramFormData = $("#trunkWriteForm").getData();
    	params = $('#writeGrid').alopexGrid('dataGet');
    	
		$.extend(paramFormData,{"topoLclCd":sTopoLclCd});   //
		$.extend(paramFormData,{"topoSclCd":sTopoSclCd});
    	$.extend(paramFormData,{"mtsoLnoList":params});
    	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/insertTrunkInfo', paramFormData, 'POST', 'insertTrunk');
	 
		
    }
    
    /*
	 * Function Name : addEqpRow
	 * Description   : 장비 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addEqpRow() {
    	//var tmofCd = tmofData[mgmtGrpCdData[0].value][0].value;
    	//var tmofNm = tmofData[mgmtGrpCdData[0].value][0].text;
    	
    	var mgmtGrpCdPopNum = 0;
    	if ($('#mgmtGrpCdPop').val() == '0002') {
    		mgmtGrpCdPopNum = 1;
    	}
    	var tmofCd = tmofData[$('#mgmtGrpCdPop').val()][0].value;
    	var tmofNm = tmofData[$('#mgmtGrpCdPop').val()][0].text;

    	var initRowData = [
    	    {
    	    	  "mgmtGrpCd" : mgmtGrpCdData[mgmtGrpCdPopNum].value 
    	    	, "mgmtGrpNm" : mgmtGrpCdData[mgmtGrpCdPopNum].text
    	    	, "tmofId"    : tmofCd
    	    	, "tmofNm"    : tmofNm
  	    	    , "mtsoId"    : '' //MtsoDataList
  	    	    , "mtsoNm"    : ''
    	    }
    	];
    	 
    	$('#'+gridMtso).alopexGrid("dataAdd", initRowData);
    	$('#'+gridMtso).alopexGrid("startEdit");
    }
    
    /*
	 * Function Name : removeEqpRow
	 * Description   : 장비 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removeEqpRow() {
    	var dataList = $('#'+gridMtso).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		/*alert("선택된 데이터가 없습니다.\n삭제할 데이터를 선택해 주세요.");*/
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridMtso).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    		// 삭제된 장비의 자재정보도 삭제
    		//delMtlList(data.trmsDemdEqpSrno);
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
    	if(flag == 'tmofData') {
    		checkTmofData = true;
    		if(response.tmofCdList != null && response.tmofCdList.length>0){
    			// 전송실 select 처리
    			var tmof_option_data =  [];
    			for(m=0; m<response.tmofCdList.length; m++){
    				if(m==0){
    					var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */};
    					tmof_option_data.push(dataFst);
    				}

    				var dataTmofCd = response.tmofCdList[m]; 		
    				if($('#mgmtGrpCdPop').val()==dataTmofCd.mgmtGrpCd){
        				tmof_option_data.push(dataTmofCd);    					
    				}
    			}
    			TmofAllData = response.tmofCdList;
    			$('#uprTmofIdPop').clear();
				$('#uprTmofIdPop').setData({data : tmof_option_data});
    			$('#lowTmofIdPop').clear(); 
				$('#lowTmofIdPop').setData({data : tmof_option_data});
    		}else{
    			
    			$('#uprTmofIdPop').clear();
    			$('#lowTmofIdPop').clear();    			
    		}
    		
    		if(response.tmofListCombo != null){
    			tmofData = response.tmofListCombo;
    		}
    		// 소속전송실에 속한 관리그룹이 있는 경우
			if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
				var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCdPop').val();
				// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
			    if (userJrdtTmofMgmtCd != "" && $('#mgmtGrpCdPop').find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
			    	$('#mgmtGrpCdPop').setSelected(userJrdtTmofMgmtCd);
			    } else {
			    	// 소속전송실에 속한 관리그룹이 없는 경우
			    	$('#mgmtGrpCdPop').setSelected($('#userMgmtCdPop').val());
			    }			
			} else {
				// 소속전송실에 속한 관리그룹이 없는 경우
				$('#mgmtGrpCdPop').setSelected($('#userMgmtCdPop').val());
			}
			//console.log("tmofData");
    	}
    	
    	if(flag == "C00188"){
			// mgmtGrpCdData
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				var dataMgmtGrp = response[k];  
				mgmtGrpCd_option_data.push(dataMgmtGrp);
			}		
			mgmtGrpCdData = mgmtGrpCd_option_data;
    		 
    		$('#mgmtGrpCdPop').clear();
    		$('#mgmtGrpCdPop').setData({data : mgmtGrpCdData});
    		
    		$('#uprOwnCdPop').clear();
    		$('#uprOwnCdPop').setData({data : mgmtGrpCdData});
    		
    		$('#lowOwnCdPop').clear();
    		$('#lowOwnCdPop').setData({data : mgmtGrpCdData});
			//console.log("C00188 : " + mgmtGrpCdData);
    		// 소속전송실에 속한 관리그룹이 있는 경우
			if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
				var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCdPop').val();
				// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
			    if (userJrdtTmofMgmtCd != "" && $('#mgmtGrpCdPop').find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
			    	$('#mgmtGrpCdPop').setSelected(userJrdtTmofMgmtCd);
			    } else {
			    	// 소속전송실에 속한 관리그룹이 없는 경우
			    	$('#mgmtGrpCdPop').setSelected($('#userMgmtCdPop').val());
			    }			
			} else {
				// 소속전송실에 속한 관리그룹이 없는 경우
				$('#mgmtGrpCdPop').setSelected($('#userMgmtCdPop').val());
			}
			
    		
    	}
    	if(flag == 'C00194Data'){ 
    		C00194Data = response;
    		$('#ntwkCapaCdPop').clear();
    		$('#ntwkCapaCdPop').setData({data : C00194Data});
		}
    	if(flag == 'EQPMDL'){
    		EQPMDL = response;
    		$('#eqpMdlNmPop').clear();
    		$('#eqpMdlNmPop').setData({data : EQPMDL});
    	}
 
    	if(flag == 'insertTrunk'){
    		$a.close(response.Result);			
    	}
    	
    	if(flag == "uprMtsoInfo"){
    		if(response != null && response.length > 0){
    			$('#uprTmofIdPop').setSelected(response[0].topMtsoId);
     	 		$('#uprMtsoIdPop').val(response[0].mtsoId);
    			$('#uprMtsoNmPop').val(response[0].mtsoNm);
    		} else {
    			/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));
    		}
    	}
    	
    	if(flag == "lowMtsoInfo"){
    		if(response != null && response.length > 0){
	    		$('#lowTmofIdPop').setSelected(response[0].topMtsoId);
	    		$('#lowMtsoIdPop').val(response[0].mtsoId);
				$('#lowMtsoNmPop').val(response[0].mtsoNm);
			} else {
				/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));			
    		}	
    	}
    	
    	if(flag == "gridMtsoInfo"){
    		if(response != null && response.length > 0){
    			var focusData = $('#'+gridMtso).alopexGrid("dataGet", {_state : {focused : true}});
        		var rowIndex = focusData[0]._index.data;
        		var editData = {"mgmtGrpCd":response[0].mgmtGrpCd, "tmofId":response[0].topMtsoId, "mtsoId":response[0].mtsoId, "mtsoNm": response[0].mtsoNm};
    			$('#'+gridMtso).alopexGrid( "dataEdit", $.extend({}, editData), {_index : { row : rowIndex}});
    		} else {
    			/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));
    		}
    	}
    	
    	// 각 관리그룹, SKT전송실, SKB전송실이 모두 취득된 후 화면편집이 가능하도록
		if (mgmtGrpCdData.length > 0 &&  checkTmofData == true ) {
			cflineHideProgressBody();
		}
    }
    
    function mtsoReg(ntwkLineNo){

    	for(var i=0; i<params.length; i++){
    		$.extend(params[i],{"ntwkLineNo":ntwkLineNo});	
    		
    		$.extend(params[i],{"uprOwnCd":paramFormData.uprOwnCd});
			$.extend(params[i],{"uprTmofId":paramFormData.uprTmofId});
			$.extend(params[i],{"uprMtsoId":paramFormData.uprMtsoId});
			
			$.extend(params[i],{"lowOwnCd":paramFormData.lowOwnCd});
			$.extend(params[i],{"lowTmofId":paramFormData.lowTmofId});
			$.extend(params[i],{"lowMtsoId":paramFormData.lowMtsoId});
    	}
    	
		httpRequestTwo('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/updateNtwkLnoInfo', params, 'POST', 'updateNtwkLnoInfo');			
	
    }
    
    function failCallback(response, status, jqxhr, flag ){
    	// 각 관리그룹, SKT전송실, SKB전송실이 모두 취득된 후 화면편집이 가능하도록
    	//if (flag == 'C00188Data' || flag == 'tmofData' || flag == 'C00194Data' ) {
			cflineHideProgressBody();
		//}
    	alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    }
    
    var httpRequestTwo = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallbackTwo)
		  .fail(failCallback);
    }
    
    function successCallbackTwo(response, status, jqxhr, flag){
    	if(flag == 'updateNtwkLnoInfo'){
    		alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
    	}
    }
});
 