/**
 * LineTerminationRemovalInformationLookup.js
 *
 * @author P096430
 * @date 2016. 10. 06. 오전 10:37:00
 * @version 1.0
 */

var m = {
			globalVar 	: {
							userId          :     "testUser"     ,
							cstrCd          :     ""             ,
							flag            :     ""             , // 설계 : DM, 정산 : AC
							prj_kind        :     ""               // 공사구분 코드
						   },
            page        : {
							pageNo1         :      1             ,
							rowPerPage1     :      30            ,
			                totalPageCnt1   :      0             ,
			                nextPageNo1     :      0             
            			   },						   
			params    	: {},
			ajaxProp  	: [
				             {  // Search Grid 
				            	url:'tango-transmission-biz/transmission/constructprocess/design/getLineTerminationRemovalInformationLookupList',
				            	data:"",
				            	flag:'searchGrid' // 0
				             },
				             {  //  
				            	url:'tango-transmission-biz/transmission/constructprocess/design/getLineTerminationRemovalInformationLookupCodeList',
				            	data:"",
				            	flag:'comCd' // 1
				             }
			              ],
		responseData   : {},
	    message        : {},
	    userInfo       : {}
						
	};

var tangoAjaxModel = Tango.ajax.init({});




var localPage = $a.page(function() {
//	console.log(m);
	
//	console.log(JSON.stringify(parent.m.userInfo));
	
	

	
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {   	
 
    	
    	
//    	m.globalVar.cstrCd = param.cstrCd;
    	
    	initGrid();
    	
    	if(param.cstrCd != null && param.cstrCd != ""){
    		m.globalVar.cstrCd = param.cstrCd;
    	}else{
    		m.globalVar.cstrCd = "P20138565901";
    		m.params.cstrCd = m.globalVar.cstrCd;
    	}
    	
    	console.log("넘어온 파라미터 : " + param)
    	console.log("넘겨준 파라미터1 : "+param.cstrCd);
    	console.log("넘겨준 파라미터2 : "+m.globalVar.cstrCd);
    	    	
    	    	
    	if(param.flag != null && param.flag != ""){
    		m.globalVar.flag = param.flag;
    	}else{
    		m.globalVar.flag = "DM";
    	}
    	
    	if(param.prj_kind != null && param.prj_kind != ""){
    		m.globalVar.prj_kind = param.prj_kind;
    	}else{
    		m.globalVar.prj_kind = "E10"; /* 테스트용  코드 변경 예정 - 한병곤*/
    	}
    	
    	
		
		setSelectCode(); // set select box
		
		setEventListener();
    	
		
    };
    
    
    
  //Grid 초기화
    function initGrid() {
    	 $('#grid').alopexGrid({
     		height: 200,
    		autoColumnIndex: true,
    		autoResize: true,
//    		rowClickSelect : true,
//    		rowSingleSelect : true,
    		disableRowSelectByKey : true,
    		defaultColumnMapping:{
    			sorting: true
			},
		    rowOption:{
		    	defaultHeight:30
		    },
		    message : {
		    	nodata : '데이터가 없습니다.',
		    	fileterNodata : 'No data'
		    },
			columnMapping : [
			                    { align : 'center',
			                      key   : 'check',
								  title : '',
			                      width : '30px',
			                      selectorColumn : true
			                    },
			                 	{ key : 'cstrCd'			,title : '공사코드'	,hidden:true			},
			                 	{ key : 'reqAcepDtm'			,title : '요청접수일자'			},
								{ key : 'srvcMgmtNo'			,title : '서비스관리번호'		},
								{ key : 'tmrvTypCd'			,title : '' ,hidden:true	},
								{ key : 'tmrvTypNm'			,title : '해지철거유형' ,hidden:true			},
								{ key : 'trmnStatDivCd'			,title : '해지상태구분코드'		},
								{ key : 'trmnStatDivCdNm'		,title : '해지상태구분코드명'		},
								{ key : 'eqpTidVal'				,title : '장비TID'			},
								{ key : 'mtsoId'				,title : '국사코드'			},
								{ key : 'mtsoNm'				,title : '국사명'				},
								{ key : 'ldongCd'				,title : '법정동코드'			},
								{ key : 'addrId'				,title : '주소ID'				},
								{ key : 'bldNm'					,title : '건물명'				},
								{ key : 'tmrvAddrNm'			,title : '' ,hidden:true	},
								{ key : 'srvcTechmNm'			,title : '' ,hidden:true	},
								{ key : 'eqpScrbrAcptYn'		,title : '' ,hidden:true	},
								{ key : 'trmnMgmtNo'			,title : '해지관리번호'			},
								{ key : 'coreMgmtNo'			,title : '코어관리번호'			}
			]
    	});
  		
    };
    
    // SET COM COD
    function setSelectCode() {
//    	var comParamArg = new Array();
//    	setSelectByCode('tmrvTypCd', 'select', 'C01150', comParamArg, '');
    	
		callTangoAjax(1) // Com Code Setting
    	
    }    
	
    
    function setEventListener() {    	
    	 
    	// Search Button Click
    	$('#searchBtn').on('click',function(e){
    		m.page.pageNo1 = 1;
    		m.params = $('tbody').getData();
    		console.log(m.params);
    		callTangoAjax(0) // Search Grid
    	});
    	
    	
    	// Grid Scroll Event
    	$('#grid').on('scrollBottom', function(e) {    		
    		if(m.page.nextPageNo1 > m.page.totalPageCnt1){
    			return false;
    		}else{
    			m.page.pageNo1 = m.page.nextPageNo1;
    			callTangoAjax(0) // Search Grid
    		}
    	});	
    	
    	// Grid Double Click Event
    	$('#grid').on('dblclick','.bodycell',function(e){
    		var data = $('#grid').alopexGrid("dataGetByIndex",{data:AlopexGrid.parseEvent(e).data._index.row});
    		dataValidate(data);
    	});
    	
    	$('.confirm_btn').on('click',function(e){
    		var data = $('#grid').alopexGrid('dataGet',{_state:{selected:true}});
    		if(data != null && data != ""){
    			dataValidate(data);
    		}
    	});
    	
    	
    	
    	
    	// Close Button Click
    	$('.close_btn').on('click',function(e){
    		$a.close("close");
    	});
    	    	
    	
    	
	};
	
	
	// data close
	function dataValidate(data){
		if(parent.$('#grid').alopexGrid("dataGet") == null || parent.$('#grid').alopexGrid("dataGet") == ""){
			$a.close(data);
		}else{
			callMsgBox('addFail','I', "해지철거 정보가 이미 등록되어 있습니다.", messageCallback); // 저장을 하시겠습니까?
		}
	}
	
	
	
	//request 성공시
	function successFn(response, status, jqxhr, flag){
		
		console.log("response : "+response);
		
		switch (flag) {
		
		case 'searchGrid':
			if(response.LineTerminationRemovalInformationLookupList != null && response.LineTerminationRemovalInformationLookupList != ""){
				if(m.page.pageNo1 == 1){
	    			$('#grid').alopexGrid('dataSet', response.LineTerminationRemovalInformationLookupList);
	    		}else{
	    			$('#grid').alopexGrid('dataAdd', response.LineTerminationRemovalInformationLookupList);
	    		}
			}else{
				$('#grid').alopexGrid('dataSet', response.LineTerminationRemovalInformationLookupList);
			}
			if(response.pager != null && response.pager != ""){
    			m.page.totalPageCnt1 = Math.ceil(response.pager.totalCnt / response.pager.rowPerPage);    			
    			m.page.nextPageNo1 = response.pager.pageNo + 1;
    			$('#grid').alopexGrid('updateOption', {paging : {pagerTotal: function(paging) { return '총 건수 : ' + response.pager.totalCnt; }}});    			
    		}
			break;
		case 'comCd':
			if(response.ComCdList != null && response.ComCdList != "" ){
				m.responseData.ComCdList = response.ComCdList;
				
				// 기타속성값1 값 테스트 데이터  추가  , 추후 변경 예정  /* 한병곤 */
				
				for(var i=0;i<m.responseData.ComCdList.length;i++){
					
					if(m.responseData.ComCdList[i].etcAttrValOne == null || m.responseData.ComCdList[i].etcAttrValOne == "" || m.responseData.ComCdList[i].etcAttrValOne == undefined){
						if(i==0){
							m.responseData.ComCdList[i].etcAttrValOne = "E12";
						}else if(i==1){
							m.responseData.ComCdList[i].etcAttrValOne = "E10";
						}
					}
					console.log(i+" : "+m.responseData.ComCdList[i].etcAttrValOne);
					if(m.responseData.ComCdList[i].etcAttrValOne != null && m.responseData.ComCdList[i].etcAttrValOne != "" ){
						if(m.responseData.ComCdList[i].etcAttrValOne == m.globalVar.prj_kind){
					
							$('#tmrvTypCd').setData({
								data:m.responseData.ComCdList,
								option_selected: m.responseData.ComCdList[i].comCd
							});
							
							break;
						}
					}
				}
				
				$a.convert('#tmrvTypCd');
				
				$('.divselect').setEnabled(false);
				console.log(m.responseData.ComCdList);
				
			}
			
			
			break;
			
		}
    }
    
    //request 실패시.
	function failFn(response, status, jqxhr, flag){
    	
    	switch (flag) {
		
		case 'searchGrid':
			break;
		case 'comCd':
			break;
		}
    }
    
	

    
    // AJAX GET, POST, PUT
    function callTangoAjax(i){
//    	console.log("callTangoAjax : " + i);
    	var url = m.ajaxProp[i].url;
    	
    	if(i==0){
    		m.params.pageNo = m.page.pageNo1;
    		m.params.rowPerPage = m.page.rowPerPage1; 
    	}
    	
    	m.ajaxProp[i].data = m.params;
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Cbnt Grid
    	else if(i == 1){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  //
    	     
    	m.ajaxProp[i].url = url;    	     
    	     
    } // callTangoAjax()

	function messageCallback(msgId, msgRst){
		
		console.log("msgId : "+msgId+"\n msgRst : "+msgRst);
		
		switch (msgId) {

		case 'save_btn':
			if(msgRst == 'Y'){
	     		
	     		
			}
			break;
		case 'addFail':
			if(msgRst == 'Y'){
	     			
			}
			break;
		}
	};
    
});