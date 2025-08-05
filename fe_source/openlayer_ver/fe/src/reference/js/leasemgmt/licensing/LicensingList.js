/**
 * LicensingList
 *
 * @author P101670
 * @date 2016. 9. 21. 오후 1:44:03
 * @version 1.0
 */
$a.page(function() {
	this.init = function(id, param) {
    	
    	console.log(id,param);

    	//Select(콤보박스) 초기화
    	initSelectCode(); 
    	
    	//이벤트 처리
    	setEventListener();
    	
    	//공통코드 초기화
    	commonCode = new CommonCode(commonCallback);
    	commonCode.getCommonCode();
    	
    	openPopup();
    };
    
    
    //select에 Bind 할 Code 가져오기
    function initSelectCode(){	
    	serviceRequest('lesReqHdofcOrg', 'tango-transmission-biz/transmisson/configmgmt/commoncode/orgs', null, 'GET');
    	serviceRequest('lesReqTeamOrgId', 'tango-transmission-biz/transmisson/configmgmt/commoncode/teams', null, 'GET');
    }
    
    //서비스 요청처리
    function serviceRequest(sType,sUrl,sData,sMethod)
    {    	
    	if(typeof(sData) === 'string'){
    		Tango.ajax({
        		url : sUrl + sData, 
    			data : null,
    			flag : sType
    		}).done(successCallback)
    		  .fail(failCallback);
    	}
    	else if(typeof(sData) === 'object'){
    		Tango.ajax({
        		url : sUrl, 
    			data : sData,
    			flag : sType
    		}).done(successCallback)
  		      .fail(failCallback);
    	}
    }
    
  //request 성공시
    function successCallback(response, status, jqxhr, flag){     	
    	//관리본부
    	if(flag == "lesReqHdofcOrg"){
    		var option_data =  [{orgId:"", orgNm:"전체", uprOrgId:""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    			
    		}
    		
    		$('#lesReqHdofcOrgId').setData({
                 data:option_data,
	             option_selected:''                 
    		});
    	}
    	
    	//관리팀
    	if(flag == "lesReqTeamOrgId"){
    		$('#lesReqTeamOrgId').clear();
    		var option_data =  [{orgId:"", orgNm:"전체", uprOrgId:""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    			
    		}
    		
    		$('#lesReqTeamOrgId').setData({
                 data:option_data,
	             option_selected:''                 
    		});
    	}
    	
    	if(flag == "stWdthDivCd"){
    		$('#stWdthDivCd').clear();
    		var option_data =  [{orgId:"", orgNm:"전체", uprOrgId:""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    			
    		}
    		
    		$('#stWdthDivCd').setData({
                 data:option_data,
	             option_selected:''                 
    		});
    	}
    	
    	
    	
    	
    		
    	//임차현황조회
    	if(flag == 'searchData'){   
    		$('#'+gridId1).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId1, response, response.leaseCurrentStateMgmtList);
    	}
    	
    	//처리이력
    	if(flag == 'searchHist'){    		
    		$('#'+gridId2).alopexGrid('hideProgress');
    		$('#'+gridId2).alopexGrid('dataSet', response);
    	}
    	
    	//임차신청현황조회
    	if(flag == 'searchCurrentStateList'){    		
    		$('#'+gridId3).alopexGrid('hideProgress');
    		$('#'+gridId3).alopexGrid('dataSet', response);
    		$('#'+gridId3).alopexGrid("viewUpdate");
    	}      	
    	
    	//엑셀저장
    	if(flag == 'exportExcel'){
    		setSPGrid('dataGridLeaseProcInfoExcel', response, response.leaseCurrentStateMgmtList);
    		
        	var worker = new ExcelWorker({
        		excelFileName: '임차처리정보',
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '임차처리정보',
        			$grid: $('#dataGridLeaseProcInfoExcel')
        		},
        		{
        			sheetName: '임차신청현황',
        			$grid: $('#'+gridId3)
        		}] 
        	});
        	worker.export({
        		merge: false,
        		exportHidden: false,
        		filtered  : false,
        		selected: false,
        		useGridColumnWidth : true,
        		border  : true
        	});
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchData'){
    		alert(response.__rsltMsg__);
    		$('#'+gridId1).alopexGrid('hideProgress');
    		$('#'+gridId2).alopexGrid('hideProgress');
    		$('#'+gridId3).alopexGrid('hideProgress');
    	}
    }
    
    
	
    function setEventListener(){
    	//탭변경 이벤트
    	/*$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				$('#'+gridId1).alopexGrid("viewUpdate"); 
				$('#'+gridId2).alopexGrid("viewUpdate"); 		        	
				break;
			case 1 :
				$('#'+gridId3).alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});*/
    	
        //본부 선택시 이벤트
		$('#lesReqHdofcOrgId').on('change', function(e){
			lesReqHdofcOrgIdChangeEventHandler(e);	 
		});
    	
        // 검색
        $('#btnSearch').on('click', function(e){
        	btnSearchClickEventHandler(e);        	
        });
    	
    	/*// 페이지 번호 클릭시
    	$('#'+gridId1).on('pageSet', function(e){
        	gridPageSetClickEventHandler(e);
        });*/
        
        // 임차요청처리내역
        $('#dataGridLeaseProcInfo').on('click', '.bodycell', function(e){
        	dataGridLeaseProcInfoClickEventHandler(e);
        });       
        
        //국소명조회
        $('#btnMtsoSearch').on('click', function(e){
        	btnMtsoSearchClickEventHandler(e);
        });
        
        //공사정보조회
        $('#btnCstrCdSearch').on('click', function(e){
        	btnCstrCdSearchClickEventHandler(e);
        });
        
        //engstNo 조회
        $('#btnEngstNoSearch').on('click', function(e){
        	btnEngstNoSearchClickEventHandler(e);
        });
        
        // 임차실사요청
        $('#btnLeaseActualInspectionRequest').on('click', function(e){
        	btnLeaseActualInspectionRequestClickEventHandler(e);
        });
        
        // 타사임차신청
        $('#btnOtherLeaseRequest').on('click', function(e){
        	btnOtherLeaseRequestClickEventHandler(e);
        });
        
        // 임차신청
        $('#btnLeaseRequest').on('click', function(e){
        	btnLeaseRequestClickEventHandler(e);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e){
        	btnExportExcelClickEventHandler(e);          	
        });
	};
    
	
	//본부 선택시 이벤트
	function lesReqHdofcOrgIdChangeEventHandler(event){  
		
		console.log('본부 선택시');
		
		//tango transmission biz 모듈을 호출하여야한다.		 
		//var orgID =  $("#lesReqHdofcOrgId option:selected").val();
		
		var orgID = $("#lesReqHdofcOrgId").val();
		 
		if(orgID == ''){
			serviceRequest('lesReqTeamOrgId', 'tango-transmission-biz/transmisson/configmgmt/commoncode/teams', null, 'GET');
		}
		else {
			serviceRequest('lesReqTeamOrgId', 'tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID, null, 'GET');
		}	 
	}
	
	
	
    
	function openPopup() {
		/*신청*/
		$('#btnPopupLicensingAdd').on('click', function(e) {
			licensingDetailFlag("I", null);
       	});
		
	}

	function licensingDetailFlag(viewFlag, dataParam){
		var titleParam;
		
    	if (viewFlag == "I") {
    		dataParam = {"viewFlag" : viewFlag};
    		titleParam = '인허가 신청';
    	}else {
    		dataParam.viewFlag = viewFlag;
    		titleParam = '인허가 신청 상세';
    	}
    	
    	$a.popup({
    		popid : 'LicensingRegistrationPopUp',
    		url : 'LicensingRegistrationPopUp.do',
    		data : dataParam,
    		modal : true,
    		width : 1254,
    		height : 768,
    		title : titleParam,
    		callback : function(data){
    			
    			if(data.flag == 'search') {
    				console.log("조회 시킬 예정");
    			}
    			
    			if(data == true){
    			}
    		}
    	});
    	
    }
});