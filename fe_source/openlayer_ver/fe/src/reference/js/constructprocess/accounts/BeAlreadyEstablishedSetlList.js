/**
 * BeAlreadyEstablishedSetlList.js
 *
 * @author P096292
 * @date 2016. 7. 28. 오전 10:00:04
 * @version 1.0
 */

/** 코딩 추가 해야할 내용 2016.08.16일 기준
 *  1. 이월계정버튼 제어 ( 사업연도 2개 이상인 경우)
 *  4. 정산 신청 정보 저장시 validation 체크
 *  5. 4번의 화면 체크외 서버 저장 직전 다시 체크(시간 db 정보 비교) 예)사업구분, 사업목적 등록여부 확인
 *  6. 그외 공통 : 통합승인 분기에 따른 버튼 제어및 기능 추가, 권한 처리, 메세지 통일
 * */
$a.page(function() {
    var today = new Date();
	var todayYear = today.getFullYear();	
	var rowPerPageCnt = 10;
    $('#userId').val("P096292");
    $('#skAfcoDivCd').val("1");
	
	this.init = function(id, param) {	
  	   //$('#cstrCd').val(param.cstrCd);
	   //1.통합승인 호출에 따른 분기 처리 할것
		 
		$('#cstrCd').val("P20159083001");
	    
	    getBizCodeList(); //사업목적, 사업구분 콤보목록 조회
	    
	    //initGrid();  //사업연도별 설계비 내역 list
    	setGrid('grid' ,1, rowPerPageCnt,'N');
    	
    	getConstructionDtlInfo(); //공사정보 
    	
    	initGrid2();  //기성정산 이력 list
    	setGrid('grid2',1, rowPerPageCnt,'N');
    	
    	//사업연도가 1개 이상일 경우 이월예산계목 등록 가능하게 처리
    	    
    	// 정산구분 콤보 세팅    	
    	setSelectByCode('setlDivCd','select', 'C00071', setSelectByCodeCallBack, '' );
    	
    	selectCpcAyedSetlDtl(); //기성정산 신청 정보
    	
    	var ilength=$('#grid').alopexGrid('rowElementGet',{_state:{selected:false}});

    };
    
    function getBizCodeList() {
    	//사업목적코드 combo
    	$('#afeYr').val(todayYear);  //사업목적,구분은 현재연도만 편집 가능함    	
    	
        //사업목적코드 combo
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/bizlist';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'GET';
  		var pFlag   = 'combo';
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);    	
    }
    
         
	function initGrid(response) {		
		
		//console.log("initGrid response:"+response.year2016); //response data
		// Alopex Grid 생성
		
    	$('#grid').alopexGrid({    		
    		pager: false,
    	  /*cellInlineEdit: true,
    		rowInlineEdit: true,*/
    		/*fullCompareForEditedState:true,*/
    		autoColumnIndex: true,
    		//추가 되거나 조회된 데이터를 편집상태로 시작하도록 설정.
    		defaultState:{
    			dataAdd: {editing:true},
    			dataSet: {editing:true}
    		},
    		// alopexGrid ColumnMapping object
    		columnMapping: [{
				key : 'afeYr',
				title : '사업년도',
				width: '30px'
			}, {
				key : 'bizPurpCd',
				title : '사업목적',
				width: '30px',				
				allowEdit: function(value, data, mapping) {     					
     				if (data.afeYr == todayYear ) {
     					return true;
     				}
     				else{
     					return false;
     				}
     			},
     			render:{
				  type: 'select',
				  rule:
					  function(value, data, mapping) {
						  if (data.afeYr == todayYear) {
						      return response.bizPurpCdList;
					  }			
				    }	  
				 },
				 editable: {					 
 				    type: 'select',
			  	    rule:
						  function(value, data, mapping) {			  	    	   
						  if (data.afeYr == todayYear) {
						      return response.bizPurpCdList;
						  }
			  	    }		  
				 },
			     editedValue : function (cell) {
			    	 
			    	 console.log("bizPurpCd : " + $(cell).find('select option').filter(':selected').val());
			    	 
			     return $(cell).find('select option').filter(':selected').val(); 					 
		       // inlineStyle: {
			   	// 	background: function(value, data, mapping) {	   			   			
			   	// 	if (data.afeYr == todayYear) {
			   //				return 'yellow';
			   //			}
			   //		 }
		  	   //    },			    			     
		        } 
		   },{
				key : 'bizDivCd',				       
				title : '사업구분',
				width: '30px',
				allowEdit: function(value, data, mapping) {     					
     				if (data.afeYr == todayYear ) {
     					return true;
     				}
     				else{
     					return false;
     				}
     		   },
     		   render: 
     		       function(value, data, render, mapping, grid) {
     			   data = AlopexGrid.currentData(data);
     			   
     		    	var purpCdsize=response.bizDivCdList.length;
     		    	var selectYn = "";
     		    	var selectString = '<select>';
     		    	selectString += '<option value="">선택</option>';
     		    	for (i=0; i<purpCdsize; i++)
     		    	{	 
     		    		if(data.bizPurpCd == response.bizDivCdList[i].prntBizDivCd){
					    	 if (response.bizDivCdList[i].value == data.bizDivCd) {
									selectYn = "selected";
								} else {
									selectYn = "";
								}  
					    	    selectString +=  '<option value="' + response.bizDivCdList[i].value+'"  ' +  + selectYn + ' >'+response.bizDivCdList[i].text+'</option>';
     		    		}
     		    	}
     		    	selectString += '</select>';
     		    	return selectString;
     		    },
				editable: function(value, data, render, mapping, grid) {
					 data = AlopexGrid.currentData(data);
					 
				     var purpCdsize=response.bizDivCdList.length;
				     var selectYn = "";
				     var selectString = '<select>';
				     selectString += '<option value="">선택</option>';
				     
				     for (i=0; i<purpCdsize; i++)
					 {	 

					     if(data.bizPurpCd == response.bizDivCdList[i].prntBizDivCd){
					    	 if (response.bizDivCdList[i].value == data.bizDivCd) {
									selectYn = "selected";
								} else {
									selectYn = "";
								}  
					    	    selectString +=  '<option value="' + response.bizDivCdList[i].value+'"  ' + selectYn + ' >'+response.bizDivCdList[i].text+'</option>'; 
					     }
					 }
				     selectString += '</select>';
				     return selectString;
				},
			    editedValue : function (cell) {
			    	
			    	console.log("bizDivCd : " + $(cell).find('select option').filter(':selected').val());
			    	
			        return $(cell).find('select option').filter(':selected').val(); 	 
			    },
				refreshBy: 'bizPurpCd'
			}, {
				key : 'owcoEngdnAmt',
				title : '자사ENG설계금액',
				width: '30px'
			}, {
				key : 'owcoEfdgAmt',
				title : '원인자ENG설계금액',
				width: '40px'				
			}, {
				key : 'totEngdnAmt',
				title : '설계금액합계',
				width: '40px'
			}, {
				key : 'owcoEfdgAmt',
				title : '자사실시설계금액',
				width: '30px'
			}, {
				key : 'cusrEfdgAmt',
				title : '원인자실시설계금액',
				width: '30px'
    	    }, {
			    key : 'totEfdgAmt',
			    title : '실시설계금액합계',
		   	    width: '30px'
			}, {
				key : 'cstrFlag',
				title : '공사플래그',
				width: '30px'
			}, {
				key : 'engstNo',
				title : 'ENG시트번호',
				width: '30px'
    	    },			
		   ],  
    		// ajax option에 grid에 연결되는  model 객체를 지정
    	  ajax: { model: gridModel }
        });  //alopexGrid 종료    	    	
	}   //initGrid() 종료
	
	var gridModel = Tango.ajax.init({
    	url: 'tango-transmission-biz/transmisson/constructprocess/accounts/ngYearDsnCstrCostList'
    });
	
	var gridModelUpdate = Tango.ajax.init({
		url: 'tango-transmission-biz/transmisson/constructprocess/accounts/updateNgYearDsnCstrCostBizPurpCd'    	
    });	
	
	var gridModel2 = Tango.ajax.init({
    	url: 'tango-transmission-biz/transmisson/constructprocess/accounts/CpcAyedList'
    });
	
	function initGrid2() {		
		// Alopex Grid 생성
    	$('#grid2').alopexGrid({    		
    		pager: false,
    		cellInlineEdit: true,
    		// alopexGrid ColumnMapping object
    		columnMapping: [{
				key : 'cstrCd',
				title : '공사코드',
				width: '20px'
			}, {
				key : 'setlReqDt',
				title : '정산요청일',
				width: '20px'
			}, {
				key : 'ayedSetlDtsSrno',
				title : '기성정산내역일련번호',
				width: '20px'
			}, {
				key : 'setlDivCd',
				title : '정산구분코드',
				width: '40px'				
			}, {
				key : 'cntpRate',
				title : '공종',
				width: '40px'
			}, {
				key : 'cusrSetlAmt',
				title : '원인자정산금액',
				width: '30px'
			}, {
				key : 'sktInvtSetlAmt',
				title : 'SKT투자정산금액',
				width: '30px'
			}, {
				key : 'sktCstSetlAmt',
				align:'left',
				title : 'SKT비용정산금액',
				width: '50px'
			}, {
				key : 'setlAmt',
				align:'left',
				title : '정산금액',
				width: '50px'				
			},
			{
				key : 'rvDt',
				title : '검토일자',
				width: '40px'				
			},
   		    { 
			key : 'aprvDt',
			title : '정산일자',
			width: '40px'				
		    },			
			{
				key : 'frstRegDate',
				title : '최초등록일자',
				width: '20px'				
			},
			{
				key : 'frstRegUserId',
				title : '최초등록사용자ID',
				width: '20px'				
			},
			{
				key : 'lastChgDate',
				title : '최종변경일자',
				width: '20px'				
			},
			{
				key : 'lastChgUserId',
				title : '최종변경사용자ID',
				width: '20px'				
			},
			{
				key : 'engstBizYr',
				title : 'ENG시트사업년도',
				width: '20px'				
			},
			{
				key : 'setlAmtRate',
				title : '공정률',
				width: '20px'				
			},
		  ],  
    		// ajax option에 grid에 연결되는  model 객체를 지정
    	  ajax: { model: gridModel2 }
        });  //alopexGrid 종료
	}   //initGrid2() 종료
	
	// Grid 조회
    function setGrid(gridId) {

    	$('#'+gridId).alopexGrid('showProgress');    	
    	
    	var param =  $("#searchForm").getData();
		
		var pFlag = 'dataList'+gridId;
		
		if (gridId == "grid") {
			gridModel.get({data:param, flag:pFlag}).done(function(response){successCallback(response, pFlag);})		
                                                   .fail(function(response){failCallback(response,pFlag);});
	    
		} else if (gridId == "grid2") {
			gridModel2.get({data:param, flag:pFlag}).done(function(response){successCallback(response, pFlag);})		
                                                    .fail(function(response){failCallback(response,pFlag);});
		}  	    
    }
    
    //선택요소 method정의
    //조회버튼 클릭
    $('#btnSearch').on('click', function(e) {
		//setGrid(1, rowPerPageCnt,'N');		
	});
	
	// 스크롤 그리드 하단 이동 시 자동조회
    $('#g').on('scrollBottom', function(e) {
    	var pageInfo = $('#grid').alopexGrid("pageInfo");
    	// 총건수와 현재 페이지건수가 동일하면 조회 종료
    	//if(pageInfo.dataLength != pageInfo.pageDataLength){
    	//	setGrid(parseInt($('#pageNo').val()) + 1, $('#rowPerPage').val(), 'Y');
    	//}
	});	
	
	$('#btnRegCarryOverAccounting').on('click', function(e) {
		
		//편집한 데이터를 편집모드를 종료 하지 않은 상태로 편집한 데이터의 dataObject를 저장.
		//이 처리를 해야 데이터의 상태가 edited로 변경 됨.
		$('#userId').val("P096292");
		
		$('#grid').alopexGrid('saveEdit', {_state: {editing: true}});
        
		var edited = AlopexGrid.trimData($('#grid').alopexGrid('dataGet', {_state: {edited: true}}));
		
		var data = {};
		data.dataList = edited;

		var datalength = edited.length;
//		alert('edited'+edited.length);
		
		if (datalength == 0) {
			callMsgBox('btnRegCarryOverAccounting', 'I', '변경된 자료가 없습니다', 'msgCallBack');
			return;		
		}
		
		for ( i=0; i< datalength ; i++)
		{	
			data.dataList[i].userId = $('#userId').val();
		}
			
		var pFlag = 'dataSave';
		gridModelUpdate.put({data:data, flag:pFlag}).done(function(response){successCallback(response, pFlag);})		
                                                    .fail(function(response){failCallback(response,pFlag);});
	});

    // 기성정산 신청정보 조회
    function selectCpcAyedSetlDtl(){
    	
        //기성정산 신청정보 조회
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/getCpcAyedSetlDtl';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'GET'
  		var pFlag   = 'getCpcAyedSetlDtl'; 
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);
        
    }// 기성정산 신청정보 조회
    
    function setCpcAyedSetlDtl(response){
    	 $('#ayedSetlDtsSrno').val(response.ayedSetlDtsSrno);
    	 $('#engstNo').val(response.engstNo);
    	 $('#bizYr').val(response.bizYr);    	 
    	 $('#setlDivCd').setSelected(response.setlDivCd);
    	 $('#setlReqDt').val(response.setlReqDt);
    	 $('#cntpRate').val(response.cntpRate);    	     
    	 $('#sktInvtSetlAmt').val(response.sktInvtSetlAmt);
    	 $('#sktCstSetlAmt').val(response.sktCstSetlAmt);
    	 $('#cusrSetlAmt').val(response.cusrSetlAmt);
    	 $('#setlAmt').val(response.setlAmt);
    	 $('#rvDt').val(response.rvDt);
    	 
    }
    
	// 기성정산 신청정보 저장 버튼 클릭시
    $('#btnSaveCpcAyedSetlDtl').on('click',function(){    	
        // validation 체크 내용 넣을것    	 
    	if (checkSaveCpcAyedSetlDtl() == false) return; 
    	
        $('#userId').val("P096292");
        $('#skAfcoDivCd').val("1");
    	
        //기성정산 신청정보 저장
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/insertCpcAyedSetlDtl'+ '?method=put';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'POST'
  		var pFlag   = 'insertCpcAyedSetlDtl'; 
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);
    	
	 });	    

	// 공사정보 select
   	function getConstructionDtlInfo() {
    	
        // 공사정보
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/getConstructionDtlInfo';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'GET'
  		var pFlag   = 'getConstructionDtlInfo';  
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);    	
    	
	};	
	
    function setConstructionDtlInfo(response){
	   	 $('#cstrNm').val(response.cstrNm);
	   	 $('#ctrtBpId').val(response.ctrtBpId);
	   	 $('#ctrtBpNm').val(response.ctrtBpNM);
	   	 $('#cnstnBpId').val(response.cnstnBpId);
	   	 $('#cnstnBpNm').val(response.cnstnBpNM);
	   	 $('#preAccRate').val(response.preAccRate);
	   	 $('#designAmt').val(response.designAmt);	   	 
	   	 $('#designApprovDt').val(response.designApprovDt);   	 
    }		
	
	// 기성정산 신청정보 제출 버튼 클릭시
    $('#btnSummitCpcAyedSetlDtl').on('click',function(){        
        $('#skAfcoDivCd').val("1");       
        
        // 기성정산 신청정보 제출
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/updateCpcAyedSetlDtlForSummit'+ '?method=put';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'POST'
  		var pFlag   = 'updateCpcAyedSetlDtlForSummit';
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);
    	
	 });   
    
	
	// 기성정산 신청정보 삭제 버튼 클릭시
    $('#btnDeleteCpcAyedSetlDtl').on('click',function(){
    	
        $('#userId').val("P096292");
        $('#skAfcoDivCd').val("1");
    	
        // 기성정산 신청정보 삭제
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/deleteCpcAyedSetlDtl'+ '?method=put';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'POST'
  		var pFlag   = 'deleteCpcAyedSetlDtl';
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);
	 });
    
	// 기성정산 신청정보 제출취소 버튼 클릭시
    $('#btnCancelCpcAyedSetlDtl').on('click',function(){
    	
        $('#userId').val("P096292");
        $('#skAfcoDivCd').val("1");
    	
        // 기성정산 신청정보 제출취소
       	var pUrl    = 'tango-transmission-biz/transmisson/constructprocess/accounts/updateCpcAyedSetlDtlForSummitCancel'+ '?method=put';
      	var pParam  =  $("#searchForm").getData();
    	var pMethod = 'POST'
  		var pFlag   = 'updateCpcAyedSetlDtlForSummitCancel';
    	
		httpRequest(pUrl,pParam ,pMethod,pFlag);
	 });    
	
	function setSelectByCodeCallBack(rtnId){
	//	alert('rtnId : '+rtnId);
	}
	
	
	/* select */ 
	var httpRequest = function(uri,data,method,flag){
		
		Tango.ajax({
			url : uri,
			data : data,
			method : method,
			flag:flag
		}).done(function(response){successCallback(response, flag);})
		  .fail(function(response){failCallback(response, flag);});
		
	};	
	
	//이월계정 등록 버튼 제어(2개 사업연도 이상인 경우만 활성화) 
	function setButtonControl(response)
	{
	  if (response.ngYearDsnCstrCostList.length > 0  ) {
	  //if (response.ngYearDsnCstrCostList.length > 1) { 테스트후 이문장으로 복귀할것
		  $('#btnRegCarryOverAccounting').attr("disabled",false);
		  $('#btnRegCarryOverAccounting').attr("class", "Button button2 color_purple");
		 
	  } else {		  		  
		  $('#btnRegCarryOverAccounting').attr("class","Button button2 color_black");
		  $('#btnRegCarryOverAccounting').attr("disabled",true);
	 }	  
		  
	}
	
	//정산신청정보 저장시 체크
	function checkSaveCpcAyedSetlDtl()
	{
		
		return true
	}
	

    function successCallback(response, flag) {    	
   	   //console.log("success flag:"+flag);
     	if(flag == "combo") {	
       	   initGrid(response);  //사업년도별 예산계정 및 설계비 내역 grid setting
     	} else if(flag == "getConstructionDtlInfo") {
     	   setConstructionDtlInfo(response);       	   
     	} else if(flag == "dataListgrid") {    		
       	   $('#grid').alopexGrid('hideProgress');
       	   $('#grid').alopexGrid('dataSet', $.extend(true, [], response.ngYearDsnCstrCostList));
       	   setButtonControl(response); //이월계정 버튼 제어
 		} else if(flag == "dataListgrid2") {
       	   $('#grid2').alopexGrid('hideProgress');
       	   $('#grid2').alopexGrid('dataSet', $.extend(true, [], response.searchList));			
 		} else if(flag == "getCpcAyedSetlDtl") {   //기성정산 신청정보 조회
 			setCpcAyedSetlDtl(response);    	
 	    } else if(flag == "insertCpcAyedSetlDtl") {   //기성정산 신청 저장
 	    	callMsgBox('','I', "저장success");
 	    } else if(flag == "deleteCpcAyedSetlDtl") {   //기성정산 신청 삭제
 	    	callMsgBox('','I', "삭제success"); 
 	    } else if(flag == "updateCpcAyedSetlDtlForSummit") {   //기성정산 제출
 	    	callMsgBox('','I', "제출success");
 	    } else if(flag == "updateCpcAyedSetlDtlForSummitCancel") {   //기성정산 제출 취소
 	    	callMsgBox('','I', "제출취소success");
        } else if(flag == "dataSave") {
     	   callMsgBox('btnRegCarryOverAccounting', 'I', '등록이 완료 됐습니다', 'msgCallBack');
        }  
      		  	
   	};
   	
   	function failCallback(response, flag) {
   		console.log('failFn');   		
    	if(flag == "combo") {
    	   
    	}	
   	}   	
   	
	function setComponentByCodeCallBack(){
		//alert('callback');
	}
	
	function setSelectByOrgCallBack(){
		//alert('callback');
	}
	
	function msgCallBack()
	{
		
	}
});