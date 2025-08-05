/**
 * KepcoBranchOfficeInfomationManagement.js
 * 한전지사정보관리
 *
 * @author 임상우
 * @date 2016. 7. 19. 오후 3:50:00
 * @version 1.0
 */
$a.page(function() {
	
	var businessPartnerGridId = 'businessPartnerGrid';
	var buildChargerGridId = 'buildChargerGrid';
	
	var kepco_head_office_data = [];//한전본부코드가 담길 배열
	var kepco_management_head_office_data = [];//한전관리본부코드가 담길 배열
	var construction_vendor_data = [];//시공업체코드가 담길 오브젝트
	var construction_vendor_data_object = {};//시공업체코드가 담길 오브젝트
	var isSearch = false;
	
	/**
	 * Grid Model 정의
	 */
	var gridBusinessPartnerModel = Tango.ajax.init({
		url: "tango-transmission-biz/leasemgmt/kepco/systemmanagement/getKepcoBranchOfficeBusinessPartnerList/" + $('#skAfcoDivCd').val(),
		flag: "kepcoBranchOfficeBusinessPartnerList"
	})
	var gridBuildChargerModel = Tango.ajax.init({
		url: "tango-transmission-biz/leasemgmt/kepco/systemmanagement/getKepcoBranchOfficeBuildChargerList/" + $('#skAfcoDivCd').val(),
		flag: "kepcoBranchOfficeBuildChargerList"
	})
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setEventListener();//이벤트 리스너 등록
    	initSelectCode();//Select(콤보박스) 초기화
    };
    
    //이벤트 리스너 등록
    function setEventListener() {
    	
        //조회 버튼 Click Event Listener 등록
        $('#btnSearch').on('click', function(e) {
        	btnSearchClickEventHandler(e);
        });
        
        //Tab Change Event Listener 등록
        $('#tabArea').on('tabchange', function(e, index) {
        	tabChangeObj[index]();
        });
        
        //한전지사별 협력업체 정보 행추가 버튼 Click Event Listener 등록
        $('#btnAddBusinessPartnerRow').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
        //한전지사별 협력업체 정보 저장 버튼 Click Event Listener 등록
        $('#btnBusinessPartnerSave').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
        //한전지사별 건설 담당자 정보 행추가 버튼 Click Event Listener 등록
        $('#btnAddBuildChargerRow').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
        //한전지사별 건설 담당자 정보 행삭제 버튼 Click Event Listener 등록
        $('#btnDeleteBuildChargerRow').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
        //한전지사별 건설 담당자 정보 저장 버튼 Click Event Listener 등록
        $('#btnBuildChargerSave').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
        //한전지사별 협력업체 정보 EXCEL출력 버튼 Click Event Listener 등록
        $('#btnBusinessPartnerExportExcel').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
        //한전지사별 건설 담당자 정보 EXCEL출력 버튼 Click Event Listener 등록
        $('#btnBuildChargerExportExcel').on('click', function(e) {
        	gridBtnClickEventHandler(e);
        });
        
      	//DataGrid CellValueChanged Event Handler 등록
        $('#'+buildChargerGridId).on('cellValueChanged', function(e){
        	dataGridCellValueChangedEventHandler(e);
        });
	};
	
function dataGridCellValueChangedEventHandler(event){
		
		var evObj = AlopexGrid.parseEvent(event);
		var value = evObj.value;
		
		if(value === evObj.prevValue || (value === '' && evObj.prevValue === undefined)){
			return;
		}
		
		var mapping = evObj.mapping;
		var data = evObj.data;
		
}
	
	
	
	//Tab Change 객체 리터럴
	var tabChangeObj = {
		0 : function (){
			$("#"+businessPartnerGridId).alopexGrid( "viewUpdate" );
		},
		1 : function (){
			$("#"+buildChargerGridId).alopexGrid( "viewUpdate" );
		}	
	};
	
  	//Grid생성 및 초기화
    function initGrid() {
    	// Grid option 정의
    	var businessPartnerGridOption = $.extend({}, KepcoGrid.defineBusinessPartnerGrid, {
    		ajax: { model: gridBusinessPartnerModel, scroll: true } // ajax옵션 및 model 추가
    	});
    	var buildChargerGridOption = $.extend({}, KepcoGrid.defineBuildChargerGrid, {
    		ajax: { model: gridBuildChargerModel, scroll: true }
    	});
    	
    	$('#'+businessPartnerGridId).alopexGrid(businessPartnerGridOption);
    	$('#'+buildChargerGridId).alopexGrid(buildChargerGridOption);
    };
    
    
    var searchCodeNum = 0;
    
    //select에 Bind 할 Code 가져오기
    function initSelectCode() {
    	
    	//한전본부코드 조회
    	searchCode({codeName:'kepcoHeadOffice', param1 : $('#skAfcoDivCd').val()});
    	
    	//한전관리본부코드 조회
    	searchCode({codeName:'kepcoManagementHeadOffice', param1 : $('#skAfcoDivCd').val()});
    	
    	//시공업체코드 조회
    	searchCode({codeName:'constructionVendor', param1 : $('#skAfcoDivCd').val()});
    }
    
    //코드 조회
    function searchCode (codeParam){
    	
    	if(typeof(codeParam) === 'string'){
    		
    		Tango.ajax({url : 'tango-transmission-biz/leasemgmt/common/codes/' + codeParam, 
    			data : null,
    			method : 'GET'})
    			.done(function(response){searchCodeSuccessCallback(response, codeParam);})
    			.fail(function(response){searchCodeFailCallback(response, codeParam);});
    	}else if(typeof(codeParam) === 'object'){
    		
    		Tango.ajax({url : 'tango-transmission-biz/leasemgmt/common/codes', 
    			data : codeParam,
    			method : 'GET'})
    			.done(function(response){searchCodeSuccessCallback(response, codeParam.codeName);})
    			.fail(function(response){searchCodeFailCallback(response, codeParam.codeName);});
    	}
    }
    
    //코드 조회 성공시 처리
    function searchCodeSuccessCallback(response, flag){
    	
    	idx  = $('#tabArea').getCurrentTabIndex();
    	
    	//한전본부코드 조회 후 처리
    	if(flag === 'kepcoHeadOffice'){
    		searchCodeNum++;
    		kepco_head_office_data = response;
    		cGrid = "";
    		
    		if(idx === 0){
    			cGrid = businessPartnerGridId;
        	}else if(idx === 1){
        		cGrid = buildChargerGridId;
        	}
    		
    		$("#"+cGrid).alopexGrid('updateColumn',function(mapping){
				if(mapping.key === 'kephdCd'){
    				
    				mapping.render = {type:'string', 
    					rule: function(value, data) {
    						var render_data = [{codeId:'', codeName:'선택하세요'}];
    						render_data = render_data.concat(kepco_head_office_data);
    						return render_data;
    					}
    				};
    				
    				mapping.editable = {type:'select', 
    					rule: function(value, data) {
    						var editing_data = [{codeId:'', codeName:'선택하세요'}];
    						editing_data = editing_data.concat(kepco_head_office_data);
    						return editing_data;
    					}
    				};
    				
    				mapping.editedValue = function (cell) {
    					return  $(cell).find('select option').filter(':selected').val();
    				};
    			}
    		});
    	}
    	
    	//한전관리본부코드 조회 후 처리
    	if(flag === 'kepcoManagementHeadOffice'){
    		searchCodeNum++;
    		kepco_management_head_office_data = response;
    		cGrid = "";
    		
    		if(idx === 0){
    			cGrid = businessPartnerGridId;
        	}else if(idx === 1){
        		cGrid = buildChargerGridId;
        	}
    		
    		$("#"+cGrid).alopexGrid('updateColumn',function(mapping){
    			if(mapping.key === 'mgmtOrgId'){
    				
    				mapping.render = {type:'string', 
    					rule: function(value, data) {
    						var render_data = [{codeId:'', codeName:'선택하세요'}];
    						render_data = render_data.concat(kepco_management_head_office_data);
    						return render_data;
    					}
    				};
    				
    				mapping.editable = {type:'select', 
    					rule: function(value, data) {
    						var editing_data = [{codeId:'', codeName:'선택하세요'}];
    						editing_data = editing_data.concat(kepco_management_head_office_data);
    						return editing_data;
    					}
    				};
    				
    				mapping.editedValue = function (cell) {
    					return  $(cell).find('select option').filter(':selected').val();
    				};
    			}
    		});
    	}
    	
    	//시공업체코드 조회 후 처리
    	if(flag === 'constructionVendor'){
    		searchCodeNum++;
    		construction_vendor_data = response;
    		
    		if(idx === 1){
    			
    			construction_vendor_data_object = {};
    			
    			for(var i=0; i<kepco_management_head_office_data.length; i++){
	    			
    				var groupArr = [];
    				var groupName = kepco_management_head_office_data[i].codeId;
	    			
    				$.each(construction_vendor_data, function(idx, val){
    					if(groupName === val.upperCodeId){
    						groupArr.push(construction_vendor_data[idx]);
    						//construction_vendor_data = construction_vendor_data.slice(0, idx).concat(construction_vendor_data.slice(idx+1, construction_vendor_data.length));
    					}
    				});
    				
    				construction_vendor_data_object[groupName] = groupArr;
	    		}
    			
    			$("#"+buildChargerGridId).alopexGrid('updateColumn',function(mapping){
    				
    				if(mapping.key === 'bpId'){
    					
    					mapping.render = {type:'string', 
    							rule: function (value, data, render, mapping) {
    								var render_data = [{codeId:'', codeName:'선택하세요'}];
    								var currentData = AlopexGrid.currentData(data);
    								if (construction_vendor_data_object[currentData.mgmtOrgId]) {
    									render_data = render_data.concat(construction_vendor_data_object[currentData.mgmtOrgId]);
    								}
    								
    								return render_data;
    							}
    					};
    					
    					mapping.editable = {type:'select', 
    						rule: function (value, data) {
    							var editing_data = [{codeId:'', codeName:'선택하세요'}];
    							var currentData = AlopexGrid.currentData(data);
    							if (construction_vendor_data_object[currentData.mgmtOrgId]) {
    								editing_data = editing_data.concat(construction_vendor_data_object[currentData.mgmtOrgId]);
    							}
    							
    							return editing_data;
    						}
    					};
    					
    					mapping.editedValue = function (cell) {
    						return  $(cell).find('select option').filter(':selected').val();
    					};
    					
    					mapping.refreshBy = 'mgmtOrgId';
    				}
    			});
    		}
    	}
    	
    	if(searchCodeNum === 3){
    		//목록조회하기
    		if(isSearch){
    			doSearch();
    		}else{
    			searchCodeNum = 0;
    		}
    	}
    }
    
    //searchCode request 실패시 처리
    function searchCodeFailCallback(response, flag){
    	//Exception처리
    }
    
    //조회버튼 클릭 시 처리
    function btnSearchClickEventHandler(event){
    	isSearch = true;
    	
    	var idx  = $('#tabArea').getCurrentTabIndex();
    	
    	if(idx === 0){
    		$('#'+businessPartnerGridId).alopexGrid('showProgress');
    	}else if(idx === 1){
    		$('#'+buildChargerGridId).alopexGrid('showProgress');
    	}
    	
    	initSelectCode();//코드 조회 후 목록 조회하기
    }
    
    
    //목록조회하기
    function doSearch(){
    	isSearch = false;
    	searchCodeNum = 0;
    	
    	var idx  = $('#tabArea').getCurrentTabIndex();
    	/**
    	 * Model Get
    	 */
    	if(idx === 0){
    		gridBusinessPartnerModel.get()
    			.done(function(response,status,xhr,flag){successCallback(response, flag);})
    			.fail(function(response,status,xhr,flag){failCallback(response, flag);});
    	}else if(idx === 1){
    		gridBuildChargerModel.get()
				.done(function(response,status,xhr,flag){successCallback(response, flag);})
				.fail(function(response,status,xhr,flag){failCallback(response, flag);});
    	}
    }
    
    
    //request 성공시
    function successCallback(response, flag){
    	
    	if(flag === 'kepcoBranchOfficeBusinessPartnerList'){
    		$('#'+businessPartnerGridId).alopexGrid('hideProgress');
    		$('#'+businessPartnerGridId).alopexGrid('dataSet', response);
    	}
    	
    	if(flag === 'kepcoBranchOfficeBuildChargerList'){
    		$('#'+buildChargerGridId).alopexGrid('hideProgress');
    		$('#'+buildChargerGridId).alopexGrid('dataSet', response);
    	}
    }
    
	//request 실패시.
    function failCallback(response, flag){
    	if(flag === 'searchData'){
    		//alert(response.__rsltMsg__);
    		callMsgBox('error','W', "System Error");
    		$('#'+businessPartnerGridId).alopexGrid('hideProgress');
    		$('#'+buildChargerGridId).alopexGrid('hideProgress');
    	}
    }
    
    //Grid 버튼 클릭시 처리
    function gridBtnClickEventHandler(event){
    	gridBtnClickObj[event.target.id]();
    }
    
    //Grid Button Click 객체 리터럴
	var gridBtnClickObj = {
		'btnAddBusinessPartnerRow' : function (){
			//한전지사별 협력업체 정보 행추가 버튼
			var addData = {
				'flag':'',
                'kepboCd':'',
                'kephdCd':'',
                'kepboNm':'',
                'mgmtOrgId':'',
                'frstRegDate':'',
                'frstRegUserNm':'',
                'lastChgDate':'',
                'lastChgUserNm':''
			}
			$("#"+businessPartnerGridId).alopexGrid('dataAdd', $.extend({}, addData));
			$("#"+businessPartnerGridId).alopexGrid('dataScroll', 'bottom');
		},
		
		'btnBusinessPartnerSave' : function (){
			//한전지사별 협력업체 정보 저장
			var addData = $("#"+businessPartnerGridId).alopexGrid('dataGet', {_state:{added:true, deleted:false}});
			var updateData = $("#"+businessPartnerGridId).alopexGrid('dataGet', {_state:{added:false, deleted:false, edited:true}});
			var deleteData = $("#"+businessPartnerGridId).alopexGrid('dataGet', {_state:{added:false, deleted:true}});
			
			var sendData = [];
			
			$.each(addData, function(idx, obj){
				obj.flag = 'A';
				sendData.push(obj);
			});
			
			$.each(updateData, function(idx, obj){
				obj.flag = 'U';
				sendData.push(obj);
			});
			
			$.each(deleteData, function(idx, obj){
				obj.flag = 'D';
				sendData.push(obj);
			});
			
			var transacton = Tango.ajax.init({
				url : 'tango-transmission-biz/leasemgmt/kepco/systemmanagement/updateKepcoBranchOfficeBusinessPartnerList/' + $('#skAfcoDivCd').val(), 
				data : sendData,
				multiple : true,
				flag : 'saveBusinessPartner'});
			
			transacton.put().done(transactonSuccess).fail(transactonFail);
		},
		
		'btnAddBuildChargerRow' : function (){
			//한전지사별 건설 담당자 정보 행추가
			var addData = {
					'check':'',
					'flag':'',
	                'kepboCd':'',
	                'kephdCd':'',
	                'kepboNm':'',
	                'mgmtOrgId':'',
	                'bpId':'',
	                'skBuldBrnchZpcd':'',
	                'skBuldBrnchAddr':'',
	                'skBuldBrnchRepTlno':'',
	                'skBuldBrnchRepFaxno':'',
	                'skBuldChrrNm':'',
	                'skBuldChrrTlno':'',
	                'managerId':'',
	                'managerNm':'',
	                'frstRegDate':'',
	                'frstRegUserNm':'',
	                'lastChgDate':'',
	                'lastChgUserNm':''
				}
			$("#"+buildChargerGridId).alopexGrid('dataAdd', addData);
			$("#"+buildChargerGridId).alopexGrid('dataScroll', 'bottom');
		},
		
		'btnDeleteBuildChargerRow' : function (){
			//한전지사별 건설 담당자 정보 행삭제
			$("#"+buildChargerGridId).alopexGrid( "dataDelete", {_state : {selected:true}} );
		},
		
		'btnBuildChargerSave' : function (){
			
			
			var addData = $("#"+buildChargerGridId).alopexGrid('dataGet', {_state:{added:true, deleted:false}});
			var updateData = $("#"+buildChargerGridId).alopexGrid('dataGet', {_state:{added:false, deleted:false, edited:true}});
			var deleteData = $("#"+buildChargerGridId).alopexGrid('dataGet', {_state:{added:false, deleted:true}});
			
			var sendData = [];
			
			$.each(addData, function(idx, obj){
				obj.flag = 'A';
				sendData.push(obj);
			});
			
			$.each(updateData, function(idx, obj){
				obj.flag = 'U';
				sendData.push(obj);
			});
			
			$.each(deleteData, function(idx, obj){
				obj.flag = 'D';
				sendData.push(obj);
			});
			
			var transacton = Tango.ajax.init({
				url : 'tango-transmission-biz/leasemgmt/kepco/systemmanagement/updateKepcoBranchOfficeBuildChargerList/' + $('#skAfcoDivCd').val(), 
				data : sendData,
				multiple : true,
				flag : 'saveBuildCharger'});
			
			transacton.put().done(transactonSuccess).fail(transactonFail);
		},
		
		'btnBusinessPartnerExportExcel' : function (){
			//한전지사별 협력업체 정보 EXCEL출력
			var worker = new ExcelWorker({
        		excelFileName: '한전지사별 협력업체 정보',
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '한전지사별 협력업체',
        			$grid: $('#'+businessPartnerGridId)
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
		},
		'btnBuildChargerExportExcel' : function (){
			//한전지사별 건설 담당자 정보 EXCEL출력
			var worker = new ExcelWorker({
        		excelFileName: '한전지사별 건설 담당자 정보',
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '한전지사별 건설 담당자',
        			$grid: $('#'+buildChargerGridId)
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
	
	function transactonSuccess(response, status, jqxhr, flag){
    	if(flag === 'saveBuildCharger'){
    	
    		doSearch();
    	}
    	
    	if(flag === 'saveBusinessPartner'){
    	
    		doSearch();
    	}
    }
	
	function transactonFail(response, status, jqxhr, flag){

	}
	
});





























