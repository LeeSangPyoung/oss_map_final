/**
 * PopTmofEst.js
 * 관할전송실 설정 메뉴
 * 패킷트렁크, 링, 기간망트렁크, 트렁크, WdmTrunk에서 호출됨
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
     
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	 
	
	var paramData = null;
	var C00188Data = [];  // 관리구분데이타   comCd:comCdNm
	var tmofData   = [];  // 전송실데이타     mtsoId:mtsoNm
	var TmofAllData = [];		/* 전송실 데이터 :	SKT,SKB */
	var tmofPathData = []; // Path전송실 DB 데이터    
	
	var MtsoData   = [];  // 국소데이타     value:text
	
	var gridMtso = 'mtsoListGrid';
	var mgmtGrpCdNmStr = "";
	var mgmtGrpCdPopData = [];  // 관리그룹 데이터
	//관리그룹 통일 변수
	var sMgmtGrpCd = "";
	var uprTmofOrgId = "";
	var uprTmofTeamId = "";
	var lowTmofOrgId = "";
	var lowTmofTeamId = "";
	var topoSclCd = "";
	var uprMgmtGrpNm = "";
	var lowMgmtGrpNm = "";
 	var tmofOrgId = "";
 	var tmofTeamId = "";
 	var mtsoTypeLabel = "";
	
    this.init = function(id, param) {
    	if (! jQuery.isEmptyObject(param) ) {
    		paramData = param;
 
    		sMgmtGrpCd    = paramData.mgmtGrpCd;
    		mgmtGrpCdNmStr = paramData.mgmtGrpCdNm;
    		
    		initSetData(); 
    		
    	}
    	
    	setSelectCode();   // 기본데이타 가지고 오기
    	initGrid();        // 그리드 셋팅 
    	setEventListener();
        
        if(paramData != null){
        	$('#mtsoIdReg').setEnabled(false);
        	$('#mtsoTypCdReg').setEnabled(false);
        	$('#regYn').val("Y");
        }
    };
    
    function initSetData(){
    	//skb일경우 정보센터(전송실)로 표기 skt는 전송실로 표기
		if(mgmtGrpCdNmStr == "SKB"){
			mtsoTypeLabel = cflineMsgArray['informationCenter']+"("+cflineMsgArray['transmissionOffice']+")";
		}else{
			mtsoTypeLabel = cflineMsgArray['transmissionOffice'];
		}
		$("#mtsoTypeLabel").html(mtsoTypeLabel);
		
		
		topoSclCd = nullToEmpty(paramData.topoSclCd);
		
		//휘더망링 은 상위국사를  가입자망링은 상위국사,하위국사 관리그룹을 변경할수 있다. 
		//2019-07-25 변경건으로 주석처리
		/*if(topoSclCd == "030"){
			$('#uprOwnNmPop').setEnabled(true);
			$('#lowOwnNmPop').setEnabled(false);
		}else if(topoSclCd == "031"){
			$('#uprOwnNmPop').setEnabled(true);
			$('#lowOwnNmPop').setEnabled(true);
		}else{
			$('#uprOwnNmPop').setEnabled(false);
			$('#lowOwnNmPop').setEnabled(false);
		}*/
		
		$('#mgmtGrpCdPop').setData({mgmtGrpCd : paramData.mgmtGrpCd  });
		
		$('#multiYnPop').setData({multiYn : paramData.multiYn  });
		if(paramData.multiYn != "Y"){
    		$('#ntwkLineNoPop').setData({ntwkLineNo : paramData.ntwkLineNoList[0]  });    			
		}
    }
  //Grid 초기화
    function initGrid() {
    	
    	var mappingEqp = [
	               		  { selectorColumn : true, width : '40px' }
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
	               		, {key : 'tmofId', align:'center', width:'280px', title : '<em class="color_red">*</em> '+ mtsoTypeLabel /*전송실*/

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
  	      			 				style : "width: 270px;min-width:270px;padding: 2px 2px;"
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
            height : 350,
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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'TmofSktData');	// 전송실데이터:SKT
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030002', null, 'GET', 'TmofSkbData');	// 전송실데이터:SKB    	
    }
    
    
    function setRegDataSet() {
    	if(paramData != null && paramData.multiYn == "N"){
	    	var schParam = {"ntwkLineNo":paramData.ntwkLineNoList[0]};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getmtsoLnoInfList', schParam, 'GET', 'getmtsoLnoInfList');
    	}
    }
    
    
    
    
    
    function setEventListener() {
    	$('#uprOwnNmPop').on('change',function(e){
    		var uprOwnCd = $('#uprOwnNmPop').val();
    		if(uprOwnCd == "0001"){
	    		$('#uprTmofIdPop').clear();   // 상위국사
	    		$('#uprTmofIdPop').setData({data : TmofSktData});	
	    		uprMgmtGrpNm = 'SKT';
    		}else if(uprOwnCd == "0002"){
    			$('#uprTmofIdPop').clear();   // 상위국사
	    		$('#uprTmofIdPop').setData({data : TmofSkbData});
	    		uprMgmtGrpNm = 'SKB';
    		}
    		$('#uprTmofIdPop').setSelected("");
    	});
    	$('#lowOwnNmPop').on('change',function(e){
    		var lowOwnCd = $('#lowOwnNmPop').val();
    		if(lowOwnCd == "0001"){
	    		$('#lowTmofIdPop').clear();  // 하위국사
	    		$('#lowTmofIdPop').setData({data : TmofSktData});
	    		lowMgmtGrpNm = 'SKT';
    		}else if(lowOwnCd == "0002"){
    			$('#lowTmofIdPop').clear();  // 하위국사
	    		$('#lowTmofIdPop').setData({data : TmofSkbData});
	    		lowMgmtGrpNm = 'SKB';
    		}
    		$('#lowTmofIdPop').setSelected("");
    	});
    	    	// 상위국사 전송실
    	$('#uprTmofIdPop').on('change',function(e){
    		$('#uprMtsoNmPop').val("");
    		$('#uprMtsoIdPop').val("");
    	});
    	// 하위국사 전송실
    	$('#lowTmofIdPop').on('change',function(e){
    		$('#lowMtsoNmPop').val("");
    		$('#lowMtsoIdPop').val(""); 
    	});
    	
    	// 상위국 국사찾기
    	$('#btnUpMtsoSch').on('click', function(e) {
    		var tmofId = $('#uprTmofIdPop').val();
    		var mtsoNm = $('#uprMtsoNmPop').val();
    		var uprMgmtCd = "";
    		if(uprMgmtGrpNm=="SKB"){
    			uprMgmtCd = "0002";
    		}else if(uprMgmtGrpNm=="SKT"){
    			uprMgmtCd = "0001";
    		}else{
    			uprMgmtCd = sMgmtGrpCd;
    		}

    		searchMtso("upr", uprMgmtCd, tmofId, mtsoNm);
		});
    	$('#uprMtsoNmPop').on('keydown', function(e) {
    		if (e.which == 13  ){
	    		var tmofId = $('#uprTmofIdPop').val();
	    		var mtsoNm = $('#uprMtsoNmPop').val();
	    		var uprMgmtCd = "";
	    		if(uprMgmtGrpNm=="SKB"){
	    			uprMgmtCd = "0002";
	    		}else if(uprMgmtGrpNm=="SKT"){
	    			uprMgmtCd = "0001";
	    		}else{
	    			uprMgmtCd = sMgmtGrpCd;
	    		}
	    		searchMtso("upr", uprMgmtCd, tmofId, mtsoNm);
    		}
		});
    	
    	// 하위국 국사찾기
    	$('#btnLowMtsoSch').on('click', function(e) {
			var tmofId = $('#lowTmofIdPop').val();
    		var mtsoNm = $('#lowMtsoNmPop').val();
    		var lowMgmtCd = "";
    		if(lowMgmtGrpNm=="SKB"){
    			lowMgmtCd = "0002";
    		}else if(lowMgmtGrpNm=="SKT"){
    			lowMgmtCd = "0001";
    		}else{
    			lowMgmtCd = sMgmtGrpCd;
    		} 		    		
    		searchMtso("low", lowMgmtCd, tmofId, mtsoNm);
		});
    	$('#lowMtsoNmPop').on('keydown', function(e) {
    		if (e.which == 13  ){
	    		var tmofId = $('#lowTmofIdPop').val();
	    		var mtsoNm = $('#lowMtsoNmPop').val();
	    		var lowMgmtCd = "";
	    		if(lowMgmtGrpNm=="SKB"){
	    			lowMgmtCd = "0002";
	    		}else if(lowMgmtGrpNm=="SKT"){
	    			lowMgmtCd = "0001";
	    		}else{
	    			lowMgmtCd = sMgmtGrpCd;
	    		}
	    		
	    		searchMtso("low", lowMgmtCd, tmofId, mtsoNm);
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
    	
//    	// 상위국 전송실 변경
//    	$('#uprTmofIdPop').on('change',function(e){
//    		$("#uprMtsoNmPop").val("");
//    		$("#uprMtsoIdPop").val("");
//    		var param = {
//    				"tmofCd" : $('#uprTmofIdPop').val()
//    		}
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', param, 'GET', 'uprTmofInfo');
//    	});
//    	// 하위국 전송실 변경
//    	$('#lowTmofIdPop').on('change',function(e){
//    		$("#lowMtsoNmPop").val("");
//    		$("#lowMtsoIdPop").val("");
//    		var param = {
//    				"tmofCd" : $('#lowTmofIdPop').val()
//    		}
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', param, 'GET', 'lowTmofInfo');
//    	});
    	
    	 // path 전송실 행추가
        $('#btn_add').on('click', function(e) {
        	addRow();
        	
        });
        
        // path 전송실 행삭제
        $('#btn_remove').on('click', function(e) {
        	removeRow();
        });
        
    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });
    	 
    	//저장 
    	 $('#btnSave').on('click', function(e) {
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
			if(sMgmtGrpCd != $('#uprOwnNmPop').val() && sMgmtGrpCd != $('#lowOwnNmPop').val() && getGridMgmt(sMgmtGrpCd) == 0){
    			msgArg = "상위국사, 하위국사, PATH전송실 리스트 중  관리그룹이 " + mgmtGrpCdNmStr + " 인 국사가 1개이상 존재해야 합니다."; /* 하위국사 */
    			alertBox('I', msgArg);
    			$('#'+gridMtso).alopexGrid("startEdit");
 				return false;
    		}
 
    		 
			$('#'+gridMtso).alopexGrid("endEdit", { _state : { editing : true }} );
    		 
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
    		 
 			 // 저장 한다고 하였을 경우
    		 callMsgBox('','C', cflineMsgArray['modificationOk'], function(msgId, msgRst){  
	    		if (msgRst == 'Y') {
	    			mtsoReg();	
	    		}else{
	    			$('#'+gridMtso).alopexGrid("startEdit");
	    		}
	    	}); 
    		 
         });  
	};


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
	 	if(TmofAllData != null && TmofAllData.length > 0){
			for(m=0; m<TmofAllData.length; m++){
				var dataS = TmofAllData[m];  
				if(tmofId == dataS.value){
					orgId = dataS.hdofcCd;
					teamId = dataS.teamCd;
					break;
				}
			}
	 	} 	    	

    	// paramValue : 사업자, 전송실, 국사명
 	 	var paramValue = { "mgmtGrpNm": mgmtGrpNm, "orgId" : orgId , "teamId" : teamId, "tmof": tmofId, "mtsoNm": mtsoNm, "regYn" : "Y", "mtsoStatCd" : "01" };
		
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
 					var mgmtGrpChk = true;
 					if(searchDiv != "grid"){
 						//가입자망이나 휘더망링의 상위국사의 경우 동일 관리그룹을 선택햇는지 체크하지 않는다.
 						if(topoSclCd == '031'){
 							mgmtGrpChk = false;
 						}else if (searchDiv == "upr" && topoSclCd == '030'){
 							mgmtGrpChk = false;
 						} 						
 	 					if(mgmtGrpChk) {  // 가입자망링 휘더망ㄹㅇ 아닌경우 
 	 						if(data.mgmtGrpNm != mgmtGrpNm){
 	 							// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
 	 							var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['managementGroup'] + " " + cflineMsgArray['information'], data.mgmtGrpNm, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
 	 							alertBox('W', msg);
 	 							return;
 	 						}
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
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'tmofData') {
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
    		setRegDataSet();
    	}
    	
    	if(flag == "C00188"){
			// mgmtGrpCdData
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				var dataMgmtGrp = response[k];  
				mgmtGrpCd_option_data.push(dataMgmtGrp);
			}		
			mgmtGrpCdData = mgmtGrpCd_option_data;
			//상위국 관리그룹
    		$('#uprOwnNmPop').clear();
    		$('#uprOwnNmPop').setData({data : mgmtGrpCdData});
    		//$('#uprOwnNmPop').setSelected(paramData);
    		
    		//하위국 관리그룹
    		$('#lowOwnNmPop').clear();
    		$('#lowOwnNmPop').setData({data : mgmtGrpCdData});
    		
    	}
    	
    	if(flag == 'TmofSktData') {
    		TmofSktData = response.tmofCdList;
    	}
    	if(flag == 'TmofSkbData') {
    		TmofSkbData = response.tmofCdList;
    	}
    	if(flag == 'getmtsoLnoInfList') {
    		if(response.getmtsoLnoInfList != null && response.getmtsoLnoInfList.length>0){
    			var tmofPathData         =  [];
    			var tmofPath_option_data =  [];
    			for(m=0; m<response.getmtsoLnoInfList.length; m++){
    				var dataTmofCd = response.getmtsoLnoInfList[m];
    				
    				if(dataTmofCd.jrdtMtsoTypCd == "01"){ //상위국사
    					$('#uprOwnNmPop').setSelected(dataTmofCd.mgmtGrpCd);
    					$('#uprTmofIdPop').setData({ "uprTmofId" : dataTmofCd.tmofId  });
    					if(dataTmofCd.mtsoId != null && dataTmofCd.mtsoId !=""){
    						$('#uprMtsoIdPop').val(dataTmofCd.mtsoId);
    			    		$('#uprMtsoNmPop').val(dataTmofCd.mtsoNm);
    					}
    					uprMgmtGrpNm = dataTmofCd.mgmtGrpNm;
    							
    				}else if(dataTmofCd.jrdtMtsoTypCd == "02"){ //하위국사
    					$('#lowOwnNmPop').setSelected(dataTmofCd.mgmtGrpCd);	
    					$('#lowTmofIdPop').setData({ "lowTmofId" : dataTmofCd.tmofId  });    					
    					if(dataTmofCd.mtsoId != null && dataTmofCd.mtsoId !=""){
    						$('#lowMtsoIdPop').val(dataTmofCd.mtsoId);
    			    		$('#lowMtsoNmPop').val(dataTmofCd.mtsoNm);
    					}
    					lowMgmtGrpNm = dataTmofCd.mgmtGrpNm;
    				}else{
    	    			tmofPath_option_data.push(dataTmofCd);
    				}
    			}

    			tmofPathData = tmofPath_option_data;
    			if(tmofPathData.length>0){
					$('#'+gridMtso).alopexGrid("dataSet", tmofPathData);
					$('#'+gridMtso).alopexGrid("startEdit");
				}
    		}
    	}
    	
    	if(flag == 'updateNtwkLnoInfo') {
    		$a.close(response.Result);    		 
    	}
    	

    	if(flag == "uprMtsoInfo"){
    		if(response != null && response.length > 0){
    			$('#uprOwnNmPop').setSelected(response[0].mgmtGrpCd);
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
    			$('#lowOwnNmPop').setSelected(response[0].mgmtGrpCd);
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
    	if(flag == "uprTmofInfo"){
        	if(response.ResultList != null && response.ResultList!="" ){
        		uprTmofOrgId = nullToEmpty(response.ResultList[0].orgId);
        		uprTmofTeamId = nullToEmpty(response.ResultList[0].teamId);
        	}else{
        		uprTmofOrgId = "";
        		uprTmofTeamId = "";
        	}
    	}
    	if(flag == "lowTmofInfo"){
        	if(response.ResultList != null && response.ResultList!="" ){
	    		lowTmofOrgId = nullToEmpty(response.ResultList[0].orgId);
	    		lowTmofTeamId = nullToEmpty(response.ResultList[0].teamId);
        	}else{
	    		lowTmofOrgId = "";
	    		lowTmofTeamId = "";
        	}
    	}
    }
    
   
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'updateNtwkLnoInfo'){
    		//alert('실패');
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		$('#'+gridMtso).alopexGrid("startEdit");
    	}
    	
    	 
    }
    
    function mtsoReg() {
    	 var param =  $("#mtsoRegForm").getData();
	 	 $.extend(param,{"ntwkLineNoList":paramData.ntwkLineNoList});
	 	$('#'+gridMtso).alopexGrid("endEdit", { _state : { editing : true }} );
	 	 var dataList = $('#'+gridMtso).alopexGrid('dataGet');
    	 $.extend(param,{"mtsoLnoList":dataList});
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/updateNtwkBasMtsoInfo', param, 'POST', 'updateNtwkLnoInfo');
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
    
    /*
     * 페이지 최초로딩시 전송실에 해당하는 본부팀 가져오기
     */
    function getTmofInfo(){
		var uprParam = {
				"tmofCd" : $('#uprTmofIdPop').val()
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', uprParam, 'GET', 'uprTmofInfo');
		var lowParam = {
				"tmofCd" : $('#lowTmofIdPop').val()
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', lowParam, 'GET', 'lowTmofInfo');
    }
 
 
 
    
    /*
	 * Function Name : addRow
	 * Description   : 그리드 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addRow() {
    	var dataList = AlopexGrid.trimData( $('#'+gridMtso).alopexGrid("dataGet") );
    	var tmofCd = tmofData[mgmtGrpCdData[0].value][0].value;
    	var tmofNm = tmofData[mgmtGrpCdData[0].value][0].text;

    	var initRowData = [
    	    {
    	    	//thrgOwnCd tmofId mtsoId
    	    	"mgmtGrpCd" : mgmtGrpCdData[0].value 
    	    	, "mgmtGrpNm" : mgmtGrpCdData[0].text
    	    	, "tmofId" : tmofCd
    	    	, "tmofNm" : tmofNm
    	    	, "mtsoId" : '' //MtsoDataList
    	    	, "mtsoNm" : ''
        	     
    	    }
    	];
    	
    	 
    	$('#'+gridMtso).alopexGrid("dataAdd", initRowData);
    	$('#'+gridMtso).alopexGrid("startEdit");
    }
        
    /*
	 * Function Name : removeRow
	 * Description   : 그리드 행 삭제
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
});