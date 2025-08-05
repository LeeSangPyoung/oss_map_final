/**
 * UserJrdtTmofListPop.js
 *
 * @author P092781
 * @date 2017. 03. 30.
 * @version 1.0
 */
$a.page(function() {
	
	var paramFormData = null;
	var params = null;
	var gridId = 'writeGrid';
	
	var sTopoLclCd = "001";		/* 토폴로지대분류코드 */
	
	var sMgmtGrpCd = "";		/* 관리그룹 통일 변수 */
	var sMgmtGrpNm = "SKT";

	var C00188Data = [];		/* 관리구분데이터 */
	var TmofSktData = [];		/* 전송실 데이터 :	SKT */
	var TmofSkbData = [];		/* 전송실 데이터 :	SKB */
	var blgtTmofYnData = [];    /* 소속전송실여부 */
	var userMgmtCd = "";
	var viewUserId= null;
	// 사용자 관할 전송실 정보 취득 체크
	var chkListYn = false;
	var userName = "";
	
	this.init = function(id, param){
		TmofSktData = [{value:'0', text:cflineMsgArray['all'], mgmtGrpCd : ''}];  // "전체"
		TmofSkbData = [{value:'0', text:cflineMsgArray['all'], mgmtGrpCd : ''}];  // "전체"
		blgtTmofYnData = [{value:'Y', text:'Y'}, {value:'N', text:'N'}];
		setSelectCode();
		selectUserInfo();
		initGrid();
		setEventListener();
		viewUserId= $('#viewUserId').val();
		chkListYn = false;
				
    	//userMgmtCd = param.userMgmtCd;
	};	
	
	//Grid 초기화
	function initGrid() {
		var mappingEqp = [{selectorColumn : true, width : '40px'},
		                  {key : 'mgmtGrpCd', align:'center', width:'70px', title : cflineMsgArray['managementGroup'] /*관리그룹*/,	   						
							render : {
								type : 'string',
								rule : function(value, data) {
									var render_data = [];
									if (C00188Data.length > 1) {
										render_data = render_data.concat(C00188Data);
									}
									else {
										render_data = render_data.concat({value : data.mgmtGrpCd, text : data.mgmtGrpNm});
									}
									return render_data;
								}
							},
							editable : {
								type : 'select',
			      	    		rule : function(value, data){
			      	    			return C00188Data;
			      	    		}, 
			      	    		attr : {
		  			 				style : "width: 60px;min-width:60px;padding: 2px 2px;"
		  			 			}
		      	    		},
							editedValue : function(cell) {
								return $(cell).find('select option').filter(':selected').val();
							}
		      	    		,tooltip : false
		                  }
						   ,{key : 'jrdtTmofId', aign : 'center', width : '280px', title : cflineMsgArray['transmissionOffice'] /*전송실*/,
							render : {
								type : 'string',
								rule : function(value, data) {
									var render_data = [];
									var currentData = AlopexGrid.currentData(data);
									if(currentData.mgmtGrpCd == "0001") {
										render_data = TmofSktData;
									}else {
										render_data = TmofSkbData;
									}
									return render_data;
								}
						   },
							editable : {
								type : 'select',
								rule : function(value, data) {
									var render_data = [];
									var currentData = AlopexGrid.currentData(data);
									if(currentData.mgmtGrpCd == "0001") {
										render_data = TmofSktData;
									}else {
										render_data = TmofSkbData;
									}
									
									return render_data;
								}, 
			      	    		attr : {
		  			 				style : "width: 290px;min-width:290px;padding: 2px 2px;"
		  			 			}
							},
							editedValue : function(cell) {
								return $(cell).find('select option').filter(':selected').val();
							}
							, tooltip : false
							, refreshBy: 'mgmtGrpCd'
						   }
						   , {key : 'blgtTmofYn', title : cflineMsgArray['blgtTmofYn']/*'소속전송실여부'*/			,align:'center', width: '80px'
							  , render : function(value, data) {
									if ( nullToEmpty(value) != '' ){										
									    return value;
									}else {
										return 'N';
									}
								}
							 ,  editable : { 
								 type : 'select',
				      	    		rule : function(value, data){
				      	    			return blgtTmofYnData;
				      	    		}, 
				      	    		attr : {
			  			 				style : "width: 60px;min-width:60px;padding: 2px 2px;"
			  			 			}
							 }   
						   }
						   , { key : 'userId', align:'center', width:'40px', title : 'UserId', hidden:true }
						   , { key : 'orgMgmtGrpCd', align:'center', width:'40px', title : 'ORG_' + cflineMsgArray['managementGroup'] /*ORG관리그룹*/, hidden:true }
						   , { key : 'orgJrdtTmofId', align:'center', width:'40px', title : 'ORG_' + cflineMsgArray['transmissionOffice']/*ORG전송실*/, hidden:true }
		                  ];
    	// 그리드 생성
        $('#'+ gridId).alopexGrid({
        	pager : false,
        	autoColumnIndex: true,
        	columnMapping : mappingEqp,
        	cellSelectable : false,
        	rowClickSelect : true,
        	rowInlineEdit : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero : false,
        	height : 400   
        	,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
    };    
    
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188Data');	// 관리그룹 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'TmofSktData');	// 전송실데이터:SKT
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030002', null, 'GET', 'TmofSkbData');	// 전송실데이터:SKB
    }
    
    function selectUserInfo() {
    	httpRequest('tango-common-business-biz/main/users', null, 'GET', 'userInfo');	// 관리그룹 데이터
    }
    function setEventListener() {
    	
    	// 전송실 설정 그리드 행추가
        $('#btnAddTmof').on('click', function(e) {
        	addTmofRow(); 
        });
        // 전송실 설정 그리드 행삭제
        $('#btnRemoveTmof').on('click', function(e) {
        	removeTmofRow();
        });
        
        // 그리드 더블클릭시 편집
        $('#'+gridId).on('dblclick', '.bodycell', function(e) {
        	var object = AlopexGrid.parseEvent(e);       	
        	// $('#'+gridEqp).alopexGrid( "rowSelect", { _index : {data : rowIndex }}, true);
        	$('#'+gridId).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        
        // 그리드셀값 편집시
        $('#'+gridId).on('cellValueEditing', function(e){
        	var ev = AlopexGrid.parseEvent(e);        	
        	var result;
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var checkBlgtTmofYn = false ;
        	var blgtTmofYn = "";
        	//console.log(mapping.key);
        	// 장비식수, 물자단가, 공사비 수정시
        	if ( ev.mapping.key == "blgtTmofYn" ) {        		
        		blgtTmofYn = AlopexGrid.currentValue(data,  "blgtTmofYn" );
        		if (blgtTmofYn == 'Y') {
        			checkBlgtTmofYn = true;
        		}
        		// 소속전송실여부가 Y인경우 다른 데이터는 N으로 설정
        		if (checkBlgtTmofYn == true) {
        			var gridList = AlopexGrid.currentData( $('#'+gridId).alopexGrid("dataGet") );
    				if (gridList.length > 0) {
	        			$.each(gridList, function(idx, obj){
	        				// 수정한 행 이외의 데이터
	        					if (data._index.id != obj._index.id) {
	        						$('#'+gridId).alopexGrid('cellEdit', 'N', {_index: {row:obj._index.row}}, 'blgtTmofYn');   // 소속전송실여부
	        						$('#'+gridId).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'blgtTmofYn');
	        					}
	        			});
    				}
        		}
        	}
        	
        });  
        
        //등록
        $('#btnSave').on('click', function(e) {
        	var msgArg ="";        	
    		
        	// path전송실 그리드
        	$('#'+gridId).alopexGrid("endEdit",{ _state : { editing : true }});
     		var dataList = $('#'+gridId).alopexGrid('dataGet');
     		var tmofDiv = "";
     		var validate = true;
     		
     		if (dataList.length == 0) {
     			alertBox('W', makeArgMsg('selectObject', cflineMsgArray['transmissionOffice'], '', '', ''));
     			return;
     		}
     		
     		var validate = true;
     		var checkBlgtTmofYn = false;
     		var chkResult = true;
			var msgStr = '';
     		if(dataList.length > 0){
     			// 중복검사
     			for(var i=0;i<dataList.length;i++){
     				
     				// 소속전송실 여부 체크

     				if (checkBlgtTmofYn == true && dataList[i].blgtTmofYn == 'Y' ) {
     					msgStr = makeArgMsg('checkUnickObject', cflineMsgArray['blgtTmofYn']);  /*소속관할여부는 {0}는(은) 반드시 한개를 설정해야 합니다.*/
     					validate = false;
     	        		alertBox('W',msgStr);
     	        		break;	
     				}
     				if (dataList[i].blgtTmofYn == 'Y' ) {
     					checkBlgtTmofYn = true;
     				}
     				
     				for (var j=(i+1); j < dataList.length; j++) {
     	    			if (dataList[i].mgmtGrpCd == dataList[j].mgmtGrpCd
     	    				&& dataList[i].jrdtTmofId == dataList[j].jrdtTmofId) {
     	    				msgStr = makeArgMsg('sameTmosInfoList', (i+1), (j+1), cflineMsgArray['transmissionOffice']);/*(i+1) + "번째줄의 전송실과 " + (j+1) + "번째줄의 전송실이 동일합니다."; */
     	    				chkResult = false; break;	
     	    			}
     	    		}
     	    		if (chkResult == false) {
     	    			validate = false;
     	    			checkBlgtTmofYn = true; // 중복체크 메세지만 표시하기 위해서
     	        		alertBox('W',msgStr);
     	        		break;	
     	        	}
     			}
     			
     			if (checkBlgtTmofYn == false) {
 					msgStr = makeArgMsg('checkUnickObject', cflineMsgArray['blgtTmofYn']);  /*소속관할여부는(은) 반드시 한개를 설정해야 합니다.*/
 					validate = false;
 	        		alertBox('W',msgStr);
 				}
     			
         		if(validate){
    	        	/*callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst){  
    	            	if (msgRst == 'Y') {
    	            		saveJrdtTmofList(); 
    	            	}
    	        	});*/	
         			saveJrdtTmofList(); 
         		} else {         		
         			$('#'+gridId).alopexGrid("startEdit");
         		}
     		}
        });
        //취소
   	 	$('#btnCncl').on('click', function(e) {
   	 		$a.close();
        });
    }
    
    // 관할 전송실 조회
    function searchUserJrdtTmofList() {
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmoflist/' + viewUserId, null, 'GET', 'selectUserJrdtTmofList');
    }
    
    // 관할 전송실 등록 op
    function saveJrdtTmofList(){
    	$('#'+gridId).alopexGrid("endEdit",{ _state : { editing : true }});
    	
    	// 전송실 목록
    	var tmofInsertList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var tmofUpdateList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var tmofDeleteList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	
    	
    	// 변경내용이 있는지 체크
    	if (tmofInsertList.length == 0 && tmofUpdateList.length == 0 && tmofDeleteList.length == 0) {
    		alertBox('W',cflineMsgArray['noModifiedData']);
    		return;
    	} 
    	
    	callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst){  
	    	if (msgRst == 'Y') {
	    		cflineShowProgressBody();
	        	var updateData = [];

	    		// 삭제관할전송실
	        	if (tmofDeleteList.length > 0) {
	    			$.each(tmofDeleteList, function(idx, obj){
	    				obj.editMd = 'D';  // 삭제
	    				updateData.push(obj);
	    			});
	        	}
	    		// 수정관할전송실
	        	if (tmofUpdateList.length > 0) {
	    			$.each(tmofUpdateList, function(idx, obj){
	    				obj.editMd = 'U';  // 수정
	    				updateData.push(obj);
	    			});
	        	}
	        	// 신규관할전송실
	        	if (tmofInsertList.length > 0) {
	    			$.each(tmofInsertList, function(idx, obj){
	    				obj.editMd = 'I';  // 신규
	    				updateData.push(obj);
	    			});
	        	}
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/userjrdttmofinfo?method=put', updateData, 'POST', 'userjrdttmofinfo');
	    	}
    	});
    	
    }
    
    /*
	 * Function Name : addPathTmofRow
	 * Description   :전송실 설정 그리드 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addTmofRow() {
    	var blgtTmofYn = "N";
    	// path전송실 그리드
 		var dataList = $('#'+gridId).alopexGrid('dataGet');
 		
 		if (dataList.length == 0) {
 			blgtTmofYn = "Y";
 		}
    	var initRowData = [
    	    {
  	    		"mgmtGrpCd" : TmofSktData[1].mgmtGrpCd  //C00188Data
  	    		//, "mgmtGrpNm" : sMgmtGrpNm
  	    		, "jrdtTmofId" : TmofSktData[0].value //TmofData
  	    		, "userId" : viewUserId
  	    		, "blgtTmofYn" : blgtTmofYn
  	  	    	, "orgMgmtGrpCd" : ""
  	  	    	, "orgJrdtTmofId" : ""
    	    }
    	];
    	$('#'+gridId).alopexGrid("dataAdd", initRowData);
    	$('#'+gridId).alopexGrid("startEdit");
    }
    
    /*
	 * Function Name : removePathTmofRow
	 * Description   : 전송실 설정 그리드 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removeTmofRow() {
    	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
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
    
    /*
	 * Function Name : setUserJrdtTmofList
	 * Description   : 관할 전송실정보 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * response : 관할 전송실 목록
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setUserJrdtTmofList(response) {
    	if (response.userJrdtTmofList.length > 0) {
			//console.log("setUserJrdtTmofList",response);
        	$('#'+gridId).alopexGrid("dataSet", response.userJrdtTmofList);        	
		}
    	cflineHideProgressBody();
    }
    
    // 처리 선공시 
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'C00188Data'){
    		C00188Data = response;    
    		
    		if (TmofSktData.length > 1 && TmofSkbData.length >1 && chkListYn == false) {
    			// 사용자 관할 전송실 조회 실행
    			chkListYn = true;

    	    	// 사용자 관할 전송실 조회
    			searchUserJrdtTmofList();
    			//console.log('C00188Data');
    		}
    	}
    	//SKT 전송실
    	if(flag == 'TmofSktData') {    		
    		//TmofSktData = response.tmofCdList;    	
    		var returnArray = TmofSktData;
    		TmofSktData = returnArray.concat(response.tmofCdList);
    		
    		if (C00188Data.length > 1 && TmofSkbData.length >1 && chkListYn == false) {
    			// 사용자 관할 전송실 조회 실행
    			chkListYn = true;

    	    	// 사용자 관할 전송실 조회
    			searchUserJrdtTmofList();
    			//console.log('TmofSktData');
    		}
    		//console.log(TmofSktData);
    	}
    	//SKB 전송실
    	if(flag == 'TmofSkbData') {
    		//TmofSkbData = response.tmofCdList;	
    		var returnArray = TmofSkbData;
    		TmofSkbData = returnArray.concat(response.tmofCdList);
    		
    		if (TmofSktData.length > 1 && C00188Data.length >1 && chkListYn == false) {
    			// 사용자 관할 전송실 조회 실행
    			chkListYn = true;

    	    	// 사용자 관할 전송실 조회
    			searchUserJrdtTmofList();
    			//console.log('TmofSkbData');
    		}
    	}
    	
    	if(flag == 'userjrdttmofinfo'){
    		cflineHideProgressBody();
    		callMsgBox('', 'I', cflineMsgArray['saveSuccess'], function() {
    			searchUserJrdtTmofList();
				//$a.close(true);  
			});
    		
    	}
    	
    	//관할 전송실 조회
    	if(flag == 'selectUserJrdtTmofList'){
    		setUserJrdtTmofList(response);
    	}
    	
		// 사용자 정보
    	if (flag == 'userInfo') {
    		//console.log(response);
    		var tempUserNm = "";
    		if (nullToEmpty(response.orgNm) != "" && response.orgNm != undefined) {
    			tempUserNm = response.orgNm + ' ';
    		}
    		if (nullToEmpty(response.userNm) != "") {
    			tempUserNm = tempUserNm + response.userNm;
    		}
    		$('#viewUserNm').text(tempUserNm);
    	}
    	
    }
    // 처리 실패시
    function failCallback(response, status, jqxhr, flag ){
    	cflineHideProgressBody();
    	if(flag == 'userjrdttmofinfo'){
    		alertBox('W', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    	}
    }
});
 