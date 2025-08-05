/**
 * ServiceLineMtsoUpdatePop.js
 * 서비스회선 전송실 설정 메뉴
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
	var paramData = null;
	var TmofData = [];  // 전송실 데이터 - selectBox
	var TmofAllData = [];  // 전송실 데이터 - selectBox
	var tmofPathData = [];  // Path전송실 DB 데이터
	var gridMtso = 'popMtsoInfoListGrid';
	var mgmtGrpCdNmStr = "";
	var mgmtGrpCdPopData = [];  // 관리그룹 데이터
	//관리그룹 통일 변수
	var sMgmtGrpCd = "";
	var upTmofOrgId = "";
	var upTmofTeamId = "";
	var lowTmofOrgId = "";
	var lowTmofTeamId = "";
	var uprMgmtGrpNm = "";
	var lowMgmtGrpNm = "";
	var mtsoTypeLabel = "";
	var ulMgmtGrpCdData = [{value: "0001",text: "SKT"},{value: "0002",text: "SKB"}];
	//var multiYn = null;
	//var svlnNo = null;

	
    this.init = function(popId, popParam) {

    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    		
    		sMgmtGrpCd    = paramData.mgmtGrpCd;
    		mgmtGrpCdNmStr = paramData.mgmtGrpCdNm;
    		
    		initSetData();
    		
    	}
    	setSelectCode();
        setEventListener();   
        initGrid();
    };
    
    function initSetData(){
    	//skb일경우 정보센터(전송실)로 표기 skt는 전송실로 표기
		if(mgmtGrpCdNmStr == "SKB"){
			mtsoTypeLabel = cflineMsgArray['informationCenter']+"("+cflineMsgArray['transmissionOffice']+")";
		}else{
			mtsoTypeLabel = cflineMsgArray['transmissionOffice'];
		}
		$("#mtsoTypeLabel").html(mtsoTypeLabel);
		
		
		$('#mgmtGrpCdPop').setData({mgmtGrpCd : paramData.mgmtGrpCd  });
		
		$('#multiYnPop').setData({multiYn : paramData.multiYn  });
		if(paramData.multiYn != "Y"){
    		$('#svlnNoPop').setData({svlnNo : paramData.svlnNo  });    			
		}
    }
    
    //Grid 초기화
    function initGrid() {
// 
    	var mappingMtso = [
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
	  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
	  	      			 			} 
				         		}
				    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
				         	}
	            		  		            		
		            	  , {key : 'tmofCd', align:'center', width:'280px', title : cflineMsgArray['transmissionOffice'] /*전송실*/

				  			, render : { type:'string',
				  					rule : function(value, data){
				  						var render_data = [];
				  						var currentData = AlopexGrid.currentData(data);
				  						if (TmofData[currentData.mgmtGrpCd]) {
				  							return render_data = render_data.concat(TmofData[currentData.mgmtGrpCd]);
				  						} else {
				  							return render_data.concat({value : data.tmofCd, text : data.tmofNm});
				  						}
				  					}
				  				},
				  				editable : {type : 'select', 
				  					rule : function(value, data){
				  						var render_data = [];
				  						var currentData = AlopexGrid.currentData(data);
				  						if (TmofData[currentData.mgmtGrpCd]) {
				  							return render_data = render_data.concat(TmofData[currentData.mgmtGrpCd]);
				  						} else {
				  							return render_data.concat({value : data.tmofCd, text : data.tmofNm});
				  						}
				  					}
					         		, attr : {
	  	      			 				style : "width: 250px;min-width:250px;padding: 3px 3px;"
	  	      			 			} 
				  				},
				      			editedValue : function (cell) {
//				      				console.log("################################");
//				      				var tmpEditValue = $(cell).find('select option').filter(':selected').val();
//				      				console.log($(cell).find('select option').filter(':selected').val());

				  					return $(cell).find('select option').filter(':selected').val();
				  				},
				  				refreshBy: 'mgmtGrpCd'		
		            		}
	   			          , {key : 'mtsoCd'	, title : cflineMsgArray['mtsoCode'] /*국사코드*/ , align:'center', width: '200px'
		   						, render : function(value, data) {
		   							if(nullToEmpty(value) == ""){
		   								return (nullToEmpty(data.mtsoCd) == "") ? "" : data.mtsoCd;
		   							}else{  
		   								return value;
		   							}
		   						}  			        	  
		   			          }
	   			          , {key : 'mtsoNm'	, title : cflineMsgArray['mtsoName'] /*국사명*/ , align:'left', width: '310px'
	   						, render : function(value, data) {
	   							var celStr = cflineMsgArray['mtsoName'] /*국사명*/;
	   							if(nullToEmpty(value) == ""){
	   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
	   							}else{  
	   								celStr = value;
	   							}
	   							//celStr = '<div class="textsearch_1 Float-left" style="width:310px"><span class="Label label">' + celStr +'</span><button class="Button search" id="btnMtsoGridSch" type="button"></button></div>';
	   							//celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" id="btnMtsoGridSch" type="button"></button><button class="grid_del_icon Valign-md" id="btnMtsoGridDel" type="button"></button></div>';
	   							//celStr = '<div class="textsearch_1 Float-left" style="width:310px">' + celStr +' </div>';
        				     return celStr;
	   						}			          
	   			            ,editable:  { type: 'text' }
	   			            ,allowEdit : function(value, data, mapping) { return true; }
	   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
	   			          }  			
		   			       ,{key : 'mtsoNmbtn',value : function(value, data) {return null;}, width: '40px',render : {type : 'btnMtsoGridSch'} 
		   			        }	          
	            		
	   			          ];
    	
        //그리드 생성 
        $('#'+gridMtso).alopexGrid({
        	columnMapping : mappingMtso,
			cellSelectable : false,
			//autoColumnIndex: true,
			//fitTableWidth: true,
			rowClickSelect : false,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 500	
			,
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
        
        var hideColList = ['mtsoCd'];
        $('#'+gridMtso).alopexGrid("hideCol", hideColList, 'conceal');

		
		$('#'+gridMtso).on('dblclick', '.bodycell', function(e){
				
				var event = AlopexGrid.parseEvent(e);
				var selected = event.data._state.selected;
				
				$('#'+gridMtso).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
				
				var editing_list = $('#'+gridMtso).alopexGrid('dataGet', {_state: {editing: true}});
				
				for(var i = 0; i < editing_list.length; i++){
					$('#'+gridMtso).alopexGrid('endEdit', {_index: {id: editing_list[i]._index.id}})
				}
				
				if (checkRowData() == true) {
					var ev = AlopexGrid.parseEvent(e);
					$('#'+gridMtso).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
				}
		});

		
		$('#'+gridMtso).on('dataAddEnd', function(e){

			var addRowIndex = $('#'+gridMtso).alopexGrid('dataGet').length-1; //전체 행 가져오기
			$('#'+gridMtso).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofCd" );
			//$('#'+gridMtso).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofId" );
		});
    };
    
    function setSelectCode() {
    	// 관리그룹
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');
		//상위국 관리그룹
		$('#upMmgmtGrpNm').clear();
		$('#upMmgmtGrpNm').setData({data : ulMgmtGrpCdData});
		//하위국 관리그룹
		$('#lowMmgmtGrpNm').clear();
		$('#lowMmgmtGrpNm').setData({data : ulMgmtGrpCdData});    	
    	
    	// 전송실
    	var mgmtGrpCd = $('#mgmtGrpCdPop').val();

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'TmofSktData');	// 전송실데이터:SKT
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030002', null, 'GET', 'TmofSkbData');	// 전송실데이터:SKB    	
    }
    
    function setEventListener() { 
    	
    	$('#upMmgmtGrpNm').on('change',function(e){
    		var upMmgmtGrp = $('#upMmgmtGrpNm').val();
    		if(upMmgmtGrp == "0001"){
	    		$('#upTmofCd').clear();   // 상위국사
	    		$('#upTmofCd').setData({data : TmofSktData});	
	    		uprMgmtGrpNm = 'SKT';
    		}else if(upMmgmtGrp == "0002"){
    			$('#upTmofCd').clear();   // 상위국사
	    		$('#upTmofCd').setData({data : TmofSkbData});
	    		uprMgmtGrpNm = 'SKB';
    		}
    		$('#upTmofCd').setSelected("");
    	});
    	$('#lowMmgmtGrpNm').on('change',function(e){
    		var lowMmgmtGrp = $('#lowMmgmtGrpNm').val();
    		if(lowMmgmtGrp == "0001"){
	    		$('#lowTmofCd').clear();  // 하위국사
	    		$('#lowTmofCd').setData({data : TmofSktData});
	    		lowMgmtGrpNm = 'SKT';
    		}else if(lowMmgmtGrp == "0002"){
    			$('#lowTmofCd').clear();  // 하위국사
	    		$('#lowTmofCd').setData({data : TmofSkbData});
	    		lowMgmtGrpNm = 'SKB';
    		}
    		$('#lowTmofCd').setSelected("");
    	});
    	// 상위국사 전송실
    	$('#upTmofCd').on('change',function(e){
    		$('#upMtsoNm').val("");
    		$('#upMtsoCd').val("");
    	});
    	// 하위국사 전송실
    	$('#lowTmofCd').on('change',function(e){
    		$('#lowMtsoNm').val("");
    		$('#lowMtsoCd').val(""); 
    	});
    	
    	// 상위국 국사찾기
    	$('#btnUpMtsoSch').on('click', function(e) {
    		var tmofId = $('#upTmofCd').val();
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(tmofId == dataS.value){
    					upTmofOrgId = dataS.hdofcCd;
    					upTmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}    		
    		
			var paramValue = "";
			var paramMgmtGrpNm = $('#upMmgmtGrpNm').val() == "0001"? "SKT":"SKB";
			paramValue = {"mgmtGrpNm": paramMgmtGrpNm, "tmof": $('#upTmofCd option:selected').val(),"mtsoNm": $('#upMtsoNm').val(), "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : upTmofOrgId, "teamId" : upTmofTeamId}
			openMtsoDataPop("upMtsoCd", "upMtsoNm", paramValue);
		});
    	// 상위국 국사 지우기
    	$('#upMtsoNm').on('keydown', function(e){
    		if(e.keyCode != 13) {
    			$('#upMtsoCd').val("");
    		}
		});
    	// 하위국 국사찾기
    	$('#btnLowMtsoSch').on('click', function(e) {
    		var tmofId = $('#lowTmofCd').val();
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
			var paramValue = "";
			var paramMgmtGrpNm = $('#lowMmgmtGrpNm').val() == "0001"? "SKT":"SKB";
			paramValue = {"mgmtGrpNm": paramMgmtGrpNm, "tmof": $('#lowTmofCd option:selected').val(),"mtsoNm": $('#lowMtsoNm').val(), "regYn" : "Y", "mtsoStatCd" : "01", "orgId": lowTmofOrgId, "teamId" : lowTmofTeamId }
			openMtsoDataPop("lowMtsoCd", "lowMtsoNm", paramValue);
		});
    	// 하위국 국사 지우기
    	$('#lowMtsoNm').on('keydown', function(e){
    		if(e.keyCode != 13) {
    			$('#lowMtsoCd').val("");
    		}
		});
    	
//    	// 상위전송실에 해당하는 본부 팀코드 가져오기
//    	$('#upTmofCd').on('change', function(e){
//    		var param = {
//    				"tmofCd" : $('#upTmofCd').val()
//    		}
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', param, 'GET', 'upTmofInfo');
//		});
//    	
//    	// 하위전송실에 해당하는 본부 팀코드 가져오기
//    	$('#lowTmofCd').on('change', function(e){
//    		var param = {
//    				"tmofCd" : $('#lowTmofCd').val()
//    		}
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', param, 'GET', 'lowTmofInfo');
//		});
    	
//    	// 그리드 국사찾기
//    	$('#'+gridMtso).on('click', function(e){
//
//			var event = AlopexGrid.parseEvent(e);
//        	var data = AlopexGrid.currentData(event.data);
//        	if(data != null){
//	    		if(event.data._key == "mtsoNm"){
//		    		if ( data._state.focused) {
//		    			openMtsoGridPop(gridMtso, "mtsoCd", "mtsoNm"); // (그리드ID, 국사코드필드, 국사명필드)
//		    		}    		 		
//	    		}
//        	}
//    	});  
    	/*
        // 그리드 더블클릭시 편집
        $('#'+gridMtso).on('click', '.bodycell', function(e) {
        	var object = AlopexGrid.parseEvent(e);       	
        	// $('#'+gridEqp).alopexGrid( "rowSelect", { _index : {data : rowIndex }}, true);
        	$('#'+gridMtso).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        */
		//그리드 국사찾기 팝업
		$('#'+gridMtso).on('click', '#btnMtsoGridSch', function(e){
    		$('#'+gridMtso).alopexGrid("endEdit", { _state : { editing : true }} );
	 	 	var dataObj = AlopexGrid.parseEvent(e).data;
	 	 	var rowIndex = dataObj._index.row;
	 	 	var mgmtGrpNm = dataObj.mgmtGrpCd == "0001"? "SKT":"SKB";
			var paramValue = "";
			
	 	 	var tmofOrgId = "";
	 	 	var tmofTeamId = "";
	 	 	
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(dataObj.tmofCd == dataS.value){
    					tmofOrgId = dataS.hdofcCd;
    					tmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}			
			
			paramValue = {"mgmtGrpNm": mgmtGrpNm,"tmof": dataObj.tmofCd,"mtsoNm": nullToEmpty(dataObj.mtsoNm), "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : tmofOrgId, "teamId" : tmofTeamId}
			//console.log(paramValue);
			openMtsoDataGridPop(gridMtso, "mtsoCd", "mtsoNm", paramValue); // (그리드ID, 국사코드필드, 국사명필드)
		});	    	
 
		
   	    // Path전송실 행추가
        $('#btn_add_mtso').on('click', function(e) {
        	addMtsoRow();
        	
        });
        
        // Path전송실 행삭제
        $('#btn_remove_mtso').on('click', function(e) {
        	removeMtsoRow();
        });
    	
    	//취소
   	 	$('#btnPopCancel').on('click', function(e) {
   	 		$a.close(null);
        });    	
    	 
    	//수정 
    	$('#btnPopSave').on('click', function(e) {
    		if(nullToEmpty($('#upTmofCd').val()) == ""){
    			alertBox('W', makeArgMsg('selectObject', cflineMsgArray['upperMtso'] + ' ' + cflineMsgArray['transmissionOffice'], '', '', '')); /* 상위국사 전송실을 선택하세요.*/
    			return;
    		}
    		if(nullToEmpty($('#lowTmofCd').val()) == ""){
    			alertBox('W', makeArgMsg('selectObject', cflineMsgArray['lowerMtso'] + ' ' + cflineMsgArray['transmissionOffice'], '', '', '')); /* 하위국사 전송실을 선택하세요.*/
    			return;
    		}   
    		var chkUpMtsoCd = getMtsoIdByTmofCdMtsoCd($('#upTmofCd').val(), $('#upMtsoCd').val());
    		var chkLowMtsoCd = getMtsoIdByTmofCdMtsoCd($('#lowTmofCd').val(), $('#lowMtsoCd').val());
    		$('#'+gridMtso).alopexGrid("endEdit",{ _state : { editing : true }});
    		var dataList = $('#'+gridMtso).alopexGrid("dataGet");
    		//var dataList = 
    		if(dataList != null && dataList.length >0){
    			var tmpMtsoArrStr = "";
    			var tmpMtso = "";
//    		 	console.log("dataList param S");
//    			console.log(dataList);	
    			for(var i=0; i<dataList.length; i++){
    				tmpMtso = getMtsoIdByTmofCdMtsoCd(dataList[i].tmofCd, dataList[i].mtsoCd);

        			//console.log(tmpMtso);	
    				if(tmpMtso == "" ){
    					alertBox('W', makeArgMsg('selectObject', cflineMsgArray['transmissionOffice'], '', '', '')); /* 전송실을 선택하세요.*/
    					return;
    				}
    				if(tmpMtsoArrStr.indexOf(tmpMtso) >=0 ){
    					alertBox('W', cflineMsgArray['tmofSameNotReg']); /* 같은 전송실 또는 국사를 등록 할 수 없습니다.*/
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "mgmtGrpCd" );
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "tmofCd" );
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "mtsoNm" );    					
    					return;
    				}
    				if(chkUpMtsoCd == tmpMtso ){
    					alertBox('W', makeArgMsg('saveToDuplication', cflineMsgArray['upperMtso'] + ' ' + cflineMsgArray['transmissionOffice'], '', '', '')); /* 이미 상위국사 전송실에 등록 되어있습니다.*/
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "mgmtGrpCd" );
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "tmofCd" );
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "mtsoNm" );
    					return;
    				}
    				if(chkLowMtsoCd == tmpMtso ){
    					alertBox('W', makeArgMsg('saveToDuplication', cflineMsgArray['lowerMtso'] + ' ' + cflineMsgArray['transmissionOffice'], '', '', '')); /* 이미 하위국사 전송실에 등록 되어있습니다.*/
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "mgmtGrpCd" );
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "tmofCd" );
    					$('#'+gridMtso).alopexGrid("startCellEdit", {_index : { row: i }}, "mtsoNm" );
    					return;
    				}
    				tmpMtsoArrStr = tmpMtsoArrStr + "," + tmpMtso;
    			}
    			
    			$('#'+gridMtso).alopexGrid("endEdit", { _state : { editing : true }} );

//    			console.log("dataList param E");
    		}
			if(sMgmtGrpCd != $('#upMmgmtGrpNm').val() && sMgmtGrpCd != $('#lowMmgmtGrpNm').val() && getGridMgmt(sMgmtGrpCd) == 0){
    			msgArg = "상위국사, 하위국사, PATH전송실 리스트 중  관리그룹이 " + mgmtGrpCdNmStr + " 인 국사가 1개이상 존재해야 합니다."; /* 하위국사 */
    			alertBox('I', msgArg);
    			$('#'+gridMtso).alopexGrid("startEdit");
 				return false;
    		}
        	/* confirm("수정 하시겠습니까?") */
        	callMsgBox('','C', cflineMsgArray['modificationOk'], function(msgId, msgRst){  
        		if (msgRst == 'Y') {
        			saveMtsoReg();
        		}
        	});   			
 		
         }); 
            	
    	
	};
	function getMtsoIdByTmofCdMtsoCd(tmofCd, mtsoCd){
		var returnValue = nullToEmpty(tmofCd);
		if(nullToEmpty(mtsoCd) != ""){
			 returnValue = nullToEmpty(mtsoCd);
		}
		return returnValue;
	}
	
	function saveMtsoReg(){
		$('#'+gridMtso).alopexGrid("endEdit",{ _state : { editing : true }});
		var param =  $("#saveMtsoPopForm").getData();	
		if($("#multiYnPop").val()=="Y"){
			$.extend(param,{"svlnNoArr":paramData.svlnNoArr});
		}
		var params = $('#'+gridMtso).alopexGrid('dataGet');
		$.extend(param,{"mtsoLnoList":params});
//	 	console.log("saveMtsoPopForm param S");
//		console.log(param);
//		console.log("saveMtsoPopForm param E");	
		//var dataNewParam =  $.param(param, true);	
		//dataNewParam =  $.param(dataNewParam);	
	 	//console.log("saveMtsoPopForm dataNewParam S");
		//console.log(dataNewParam);
		//console.log("saveMtsoPopForm dataNewParam E");	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/savemtsolnoinfo', param, 'POST', 'saveMtsoLnoInfo');
		
	}

    function addMtsoRow() {
    	var tmofCd = TmofData[mgmtGrpCdData[0].value][0].value;
    	var tmofNm = TmofData[mgmtGrpCdData[0].value][0].text;

    	$("#"+gridMtso).alopexGrid("startEdit");    	
    	//var dataList = AlopexGrid.trimData( $('#'+gridMtso).alopexGrid("dataGet") );
    	var initRowData = [
    	    {
    	    	 "mgmtGrpCd" : mgmtGrpCdData[0].value 
    	    	, "mgmtGrpNm" : mgmtGrpCdData[0].text
    	    	, "tmofCd" : tmofCd 
    	    	, "tmofNm" : tmofNm
    	    	, "mtsoCd" : ''
    	    	, "mtsoNm" : ''
        	     
    	    }
    	];    	
    	//console.log(sclCombo[1].cd);    	 
    	$('#'+gridMtso).alopexGrid("dataAdd", initRowData);
    	$('#'+gridMtso).alopexGrid("startEdit");
    }	
    
    function removeMtsoRow(){
    	var dataList = $( '#'+gridMtso).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];
    		var rowIndex = data._index.data;
    		$( '#'+gridMtso).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    }
    
//    function getTmofInfo(){
//		var upParam = {
//				"tmofCd" : $('#upTmofCd').val()
//		}
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', upParam, 'GET', 'upTmofInfo');
//		var lowParam = {
//				"tmofCd" : $('#lowTmofCd').val()
//		}
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getselecttmofinfo', lowParam, 'GET', 'lowTmofInfo');
//    }

    function asIsData(){
		if(paramData != null && paramData.multiYn == "N"){
	    	var schParam = {"svlnNo":paramData.svlnNo};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selectmtsolnoinfolist', schParam, 'GET', 'asisData');
		}
	}
    
    function getGridMgmt(mgmtTyp){
    	var mgmtData = $('#'+gridMtso).alopexGrid("dataGet", {"mgmtGrpCd" : mgmtTyp });
    	return mgmtData.length;
    }
    
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){  	
    	if(flag == "saveMtsoLnoInfo"){
//    	 	console.log("response.Result Ss");
//    		console.log(response.Result);
//    		console.log("response.Result Ee");   
    		$a.close(response.Result);		
    	}
    	if(flag == "C00188"){
    		
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				var dataMgmtGrp = response[k];  
				mgmtGrpCd_option_data.push(dataMgmtGrp);
			}		
			mgmtGrpCdData = mgmtGrpCd_option_data;
    	}
    	
    	if(flag == 'TmofSktData') {
    		TmofSktData = response.tmofCdList;
    		asIsData();
    	}
    	
    	if(flag == 'TmofSkbData') {
    		TmofSkbData = response.tmofCdList;
    		asIsData();
    	}
    	
    	if(flag == "tmofData"){
    		if(response.tmofCdList != null && response.tmofCdList.length>0){
    			// 전송실 select 처리
    			var tmof_option_data =  [];
    			for(m=0; m<response.tmofCdList.length; m++){
    				if(m==0){
    					var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */};
    					tmof_option_data.push(dataFst);
    				}

    				var dataTmofCd = response.tmofCdList[m]; 		
    				if($('#upMmgmtGrpNm').val()==dataTmofCd.mgmtGrpCd){
        				tmof_option_data.push(dataTmofCd);    					
    				}
    			}
    			TmofAllData = response.tmofCdList;
    			$('#upTmofCd').clear();
				$('#upTmofCd').setData({data : tmof_option_data});
				$('#lowTmofCd').clear();
				$('#lowTmofCd').setData({data : tmof_option_data});
//				getTmofInfo();
    		}else{
    			$('#upTmofCd').clear();
    			$('#lowTmofCd').clear();    			
    		}
//			console.log("==================================="); 
//			console.log(response.tmofListCombo);    	
    		if(response.tmofListCombo != null){
    			TmofData = response.tmofListCombo;
    		}
    	}
    	
    	if(flag == "asisData"){
    		if(response.lineMtsoLnoInfoList != null && response.lineMtsoLnoInfoList.length>0){
    			var tmofPath_option_data =  [];
    			for(m=0; m<response.lineMtsoLnoInfoList.length; m++){
    				var dataTmofCd = response.lineMtsoLnoInfoList[m];  
    				if(dataTmofCd.jrdtMtsoTypCd == "01"){ //상위국사
    					$('#upMmgmtGrpNm').setSelected(dataTmofCd.mgmtGrpCd);						
    					$('#upTmofCd').setData({upTmofCd : dataTmofCd.tmofCd  });						
    					if(dataTmofCd.mtsoCd != null && dataTmofCd.mtsoCd !=""){
    						$('#upMtsoCd').val(dataTmofCd.mtsoCd);
    						$('#upMtsoNm').val(dataTmofCd.mtsoNm);
    						if(nullToEmpty(dataTmofCd.mtsoLnoInsProgStatCd) != ""){
    							$('#upMtsoStatCd').val(dataTmofCd.mtsoLnoInsProgStatCd);
    						}else{
    							$('#upMtsoStatCd').val("02");    							
    						}
    						
    					}
    				}else if(dataTmofCd.jrdtMtsoTypCd == "02"){ //하위국사
    					$('#lowMmgmtGrpNm').setSelected(dataTmofCd.mgmtGrpCd);
    					$('#lowTmofCd').setData({lowTmofCd : dataTmofCd.tmofCd  });
    					if(dataTmofCd.mtsoCd != null && dataTmofCd.mtsoCd !=""){
    						$('#lowMtsoCd').val(dataTmofCd.mtsoCd);
    						$('#lowMtsoNm').val(dataTmofCd.mtsoNm);
    						if(nullToEmpty(dataTmofCd.mtsoLnoInsProgStatCd) != ""){
    							$('#lowMtsoStatCd').val(dataTmofCd.mtsoLnoInsProgStatCd);
    						}else{
    							$('#lowMtsoStatCd').val("02");    							
    						}
    					}
    				}else{
    	    			tmofPath_option_data.push(dataTmofCd);
    				}
    			}
    			tmofPathData = tmofPath_option_data;

				if(tmofPathData.length>0){
					$('#'+gridMtso).alopexGrid("dataSet", tmofPathData);
				}
    			
    		}
    		//$('#mgmtGrpCdPop').setData({mgmtGrpCd : paramData.mgmtGrpCd  });
    	}
    	if(flag == "upTmofInfo"){
    		if(response.ResultList.length > 0){
    			upTmofOrgId = response.ResultList[0].orgId;
        		upTmofTeamId = response.ResultList[0].teamId;
    		}else{
        		upTmofOrgId = "";
        		upTmofTeamId = "";
    		}
    	}
    	if(flag == "lowTmofInfo"){
    		if(response.ResultList.length > 0){
	    		lowTmofOrgId = response.ResultList[0].orgId;
	    		lowTmofTeamId = response.ResultList[0].teamId;
    		}else{
    			lowTmofOrgId = "";
    			lowTmofTeamId = "";
    		}
    	}
		
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == "saveMtsoLnoInfo"){
    		$a.close("Fail");
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