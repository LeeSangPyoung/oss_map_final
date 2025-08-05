/**
 * FacilitiesProviderList.js
 * 설비사업자관리
 *
 * @author Jeong,JungSig
 * @date 2016. 7. 26. 오전 10:45:00
 * @version 1.0
 */
$a.page(function() {
	
	var masterGridId = "providerGrid";
	var detailGridId = "providerDetailGrid";
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	initGrid();			//그리드초기화
    	setEventListener();	//이벤트 리스너 등록
    	initSelectCode();	//Select(콤보박스) 초기화
    };
    
    //그리드초기화
    function initGrid(){
    	
    	AlopexGrid.define('defineMasterGrid', {
    		filteringHeader: false,//필터 로우 visible
    		hideSortingHandle : true,//Sorting 표시 visible
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		rowSingleSelectAllowUnselect : false,
    		autoColumnIndex : true,
    		rowindexColumnFromZero : false,
    		height : 210,
    		defaultColumnMapping:{
    			align : 'center',
    			sorting: true
    		},
    		columnMapping: [{key : 'check', width : '30px', selectorColumn : true, hidden : true},
    	                    {title : '순번3', width : '40px', rowindexColumn : true},
    	                    {key : 'lesKndCd', title : '임차종류코드' , hidden : true},
    	                    {key : 'commBizrId', title : '사업자ID', hidden : true},
    	                    {key : 'hdofcOrgId', title : '본부조직ID' , hidden : true},
    	                    {key : 'teamOrgId', title : '팀조직ID' , hidden : true},
    		                {key : 'commBizrNm', title : '제공사업자명', width : '80px'},
    		                {key : 'rpveNm', title : '대표자명', width : '80px'},
    		                {key : 'vndrBzno', title : '등록번호', width : '80px'},
    		                {key : 'opbizDt', title : '개업일', width : '80px'},
    		                {key : 'bizrBztpCd', title : '업태', width : '80px'},
    		                {key : 'repTlno', title : '대표전화', width : '80px'},
    		                {key : 'hmpgAddr', title : '홈페이지주소', width : '100px'},
    		                {key : 'hdqtrAddr', title : '본사주소', width : '200px'}]
    	});
  		
    	AlopexGrid.define('defineDetailGrid', {
    		filteringHeader: false,//필터 로우 visible
    		hideSortingHandle : true,//Sorting 표시 visible
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		rowSingleSelectAllowUnselect : false,
    		autoColumnIndex : true,
    		rowindexColumnFromZero : false,
    		height : 360,
    		defaultColumnMapping:{
    			align : 'center',
    			sorting: true
    		},
    		columnMapping: [{key : 'check', width : '30px', selectorColumn : true, hidden : true},
    	                    {title : '순번', width : '40px', rowindexColumn : true},
    	                    {key : 'popupType', title : '구분', hidden : true},
    		                {key : 'lesCommBizrId', title : '임차통신사업자ID', hidden : true},
    		                {key : 'lesCommBizrNm', title : '임차통신사업자명', hidden : true},
    		                {key : 'commBizrId', title : '임차통신사업자ID', hidden : true},
    		                {key : 'lesKndCd', title : '임차종류코드', hidden : true},
    		                {key : 'lesDmdStdSrno', title : '임차청구기준일련번호', hidden : true},
    		                {key : 'hdofcOrgNm', title : '본부명', width : '100px'},
    		                {key : 'teamOrgNm', title : '팀명', width : '100px'},
    		                {key : 'trmsMtsoId', title : '전송실ID', hidden : true},
    		                {key : 'trmsMtsoNm', title : '전송실명', width : '100px'},
    		                {key : 'lesKndNm', title : '회선유형', width : '100px'},
    		                {key : 'feeDmdChrrNm', title : '요구청구담당자명', width : '100px'},
    		                {key : 'feeDmdChrgDeptNm', title : '요금청구담당부서', width : '100px'},
    		                {key : 'feeDmdChrgTlno', title : '요금청구담당전화', width : '100px'},
    		                {key : 'feeDmdFaxno', title : '요금청구FAX', width : '100px'},
    		                {key : 'feeCnfChrrNm', title : '요금확인담당자명', width : '100px'},
    		                {key : 'feeCnfChrgDeptNm', title : '요금확인담당부서', width : '100px'},
    		                {key : 'feeCnfChrgTlno', title : '요금확인담당전화', width : '100px'},
    		                {key : 'feeCnfFaxno', title : '요금확인담당FAX', width : '100px'},
    		                {key : 'feeCnfChrgMblTlno', title : '요금확인담당핸드폰', width : '100px'},
    		                {key : 'dmdDtVal', title : '청구일', width : '100px'},
    		                {key : 'lesDmdMthdCd', title : '청구방법', width : '100px'},
    		                {key : 'detlCtt', title : '세부내역', width : '100px'},
    		                {key : 'payDtVal', title : '납부일', width : '100px'},
    		                {key : 'chrDayCntVal', title : '과금기간', width : '100px'},
    		                {key : 'chrStdDayVal', title : '과금데이터기준', width : '100px'},
    		                {key : 'payMthdCd', title : '납부방법', width : '100px'},
    		                {key : 'atrnfDiscYn', title : '자동이체할인', width : '100px'},
    		                {key : 'instlUserId', title : '입력자ID', width : '100px'}]
    	});
  		
        //제공사업자정보 그리드 생성
        $('#'+ masterGridId).alopexGrid({
        	extend : ['defineMasterGrid']
        });
        
        //제공사업자정보상세 그리드 생성
        $('#'+ detailGridId ).alopexGrid({
        	extend : ['defineDetailGrid']
        });
        
    };
    
    //select에 Bind 할 Code 가져오기
    function initSelectCode() {

    	//설비종류
    	lesKndCd_data = [{depth:"0",upperCodeId:"*",codeId:"T1",codeName:"광중계기광코아"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T2",codeName:"기지국회선"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T3",codeName:"통신설비"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T4",codeName:"Wi-Fi"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T5",codeName:"B2B"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T6",codeName:"HFC중계기"}];
    	$('#lesKndCd').clear();
    	$('#lesKndCd').setData({
    		data:lesKndCd_data,
    	});
    	$('#lesKndCd').trigger($.Event('change'));//dispatch 설비종류 change event
    	
    	//사업자목록
    	lesCommBizrId_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"},
    	                        {depth:"0",upperCodeId:"*",codeId:"134",codeName:"KT"},
    	                        {depth:"0",upperCodeId:"*",codeId:"135",codeName:"SKN"},
    	                        {depth:"0",upperCodeId:"*",codeId:"136",codeName:"드림라인"},
    	                        {depth:"0",upperCodeId:"*",codeId:"137",codeName:"SJ"},
    	                        {depth:"0",upperCodeId:"*",codeId:"138",codeName:"데이콤"},
    	                        {depth:"0",upperCodeId:"*",codeId:"139",codeName:"파워콤"},
    	                        {depth:"0",upperCodeId:"*",codeId:"232",codeName:"SKB"},
    	                        {depth:"0",upperCodeId:"*",codeId:"444",codeName:"기타"},
    	                        {depth:"0",upperCodeId:"*",codeId:"233",codeName:"CJ헬로비전"},
    	                        {depth:"0",upperCodeId:"*",codeId:"234",codeName:"씨엔엠"}];
    	$('#lesCommBizrId').clear();
    	$('#lesCommBizrId').setData({
    		data:lesCommBizrId_data
    	});
    	
    	//본부
    	headOffice_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"},
    	                   {depth:"0",upperCodeId:"*",codeId:"00001595",codeName:"본사"},     
    	                   {depth:"0",upperCodeId:"*",codeId:"00001196",codeName:"수도권Network본부"},
    	                   {depth:"0",upperCodeId:"*",codeId:"00001205",codeName:"부산Network본부"},
    	                   {depth:"0",upperCodeId:"*",codeId:"00003360",codeName:"대구Network본부"},
    	                   {depth:"0",upperCodeId:"*",codeId:"00001224",codeName:"중부Network본부"},
    	                   {depth:"0",upperCodeId:"*",codeId:"00001215",codeName:"서부Network본부"}];
    	$('#hdofcOrgId').clear();
    	$('#hdofcOrgId').setData({
    		data:headOffice_data
    	});
    	$('#hdofcOrgId').trigger($.Event('change'));//dispatch 본부 change event
    	
    	$('#teamOrgId').clear();
    	$('#teamOrgId').setData({depth:"0",upperCodeId:"",codeId:"",codeName:"전체"});
    	$('#teamOrgId').trigger($.Event('change'));
    }    
    
    //이벤트 리스너 등록
    function setEventListener() {
    	
    	//본부 Change Event Listener 등록
    	$('#hdofcOrgId').on('change', function(e) {
    		headOfficeChangeEventHandler(e);
		});
    	
    	//조회 버튼 Click Event Listener 등록
    	$('#btnSearch').on('click', function(e) {
    		btnSearchClickEventHandler(e);
		});
    	
   	
    	//추가 버튼 Click Event Listener 등록
    	$('#bntAddRow').on('click', function(e) {
    		bntAddRowClickEventHandler(e, 'updateFacilitiesProvider', masterGridId);
		});
    	
    	//수정 버튼 Click Event Listener 등록
    	$('#bntUpdateRow').on('click', function(e) {
    		bntUpdateRowClickEventHandler(e, 'updateFacilitiesProvider', masterGridId);
		});
    	
    	//삭제 버튼 Click Event Listener 등록
    	$('#bntDeleteRow').on('click', function(e) {
    		bntDeleteRowClickEventHandler(e, 'deleteFacilitiesProvider', masterGridId);
		});
    	
    	//Excel출력 버튼 Click Event Listener 등록
    	$('#btnDownloadExcel').on('click', function(e) {
    		btnDownloadExcelClickEventHandler(e, masterGridId);
		});
    	
    	//추가 버튼 상세 Click Event Listener 등록
    	$('#bntAddRowDetail').on('click', function(e) {
    		bntAddRowClickEventHandler(e, 'updateFacilitiesProviderDetail', detailGridId);
		});
    	
    	//수정 버튼 상세 Click Event Listener 등록
    	$('#bntUpdateRowDetail').on('click', function(e) {
    		bntUpdateRowClickEventHandler(e, 'updateFacilitiesProviderDetail', detailGridId);
		});
    	
    	//삭제 버튼 상세 Click Event Listener 등록
    	$('#bntDeleteRowDetail').on('click', function(e) {
    		bntDeleteRowClickEventHandler(e, 'deleteFacilitiesProviderDetail', detailGridId);
		});
    	
    	//Excel출력 상세 버튼 Click Event Listener 등록
    	$('#btnDownloadExcelDetail').on('click', function(e) {
    		btnDownloadExcelClickEventHandler(e, detailGridId);
		});
    	
      	//제공사업자 그리드 셀 클릭 이벤트 바인딩
      	$('#' + masterGridId).on('click','.bodycell', function(e){
      		gridBodyCellClickEventHandler(e);
		});
    	
	};
	
    function gridBodyCellClickEventHandler(event){
  		var ev = AlopexGrid.parseEvent(event);
  		serviceRequest(	 'getFacilitiesProviderDetailList'
						,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderDetailList'
						,ev.data,'GET');
    }

    function btnSearchClickEventHandler(event){
  		serviceRequest(	 'getFacilitiesProviderList'
  						,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderList'
  						,$("#searchForm").getData(),'GET');
    }
    
	/**
	 * serviceRequest
	 * 
	 * @param sType,sUrl,sData,sMethod
	 * @return void
	 */
    function serviceRequest(sType,sUrl,sData,sMethod)
    {
    	if(sType == 'getFacilitiesProviderList'){
    		$('#'+masterGridId).alopexGrid('showProgress');	
    	}else
    	if(sType == 'getFacilitiesProviderDetailList'){
    		$('#'+detailGridId).alopexGrid('showProgress');
    		
    		sData.lesKndCd = $('#lesKndCd').val();	//임차종류코드
    		sData.hdofcOrgId = $('#hdofcOrgId').val(); //본부조직ID
    		sData.teamOrgId = $('#teamOrgId').val();   //팀조직ID
    	}
    	
    	var grid1 = Tango.ajax.init({
			url : sUrl,
			data : sData,
			method : sMethod
		})
		if(sMethod == 'GET'){
			grid1.get().done(function(response){successCallback(response, sType, sData);})
						.fail(function(response){failCallback(response, sType);});
		}else
		if(sMethod == 'POST'){
			grid1.post().done(function(response){successCallback(response, sType, sData);})
						.fail(function(response){failCallback(response, sType);});
		}
		
    }
    
  //serviceRequest 성공시
    function successCallback(response, flag, param){
    	if(flag == 'getFacilitiesProviderList'){    	
    		$('#'+masterGridId).alopexGrid('dataSet', response);
    		$('#'+masterGridId).alopexGrid('hideProgress');
    		
    		var data = $('#'+masterGridId).alopexGrid("dataGetByIndex", {row:0});
    		if(data != null){
    	  		serviceRequest(	 'getFacilitiesProviderDetailList'
    	  				,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderDetailList',data,'GET');
    		}
    	}else
       	if(flag == 'getFacilitiesProviderDetailList'){
       		$('#'+detailGridId).alopexGrid('dataSet', response);
       		$('#'+detailGridId).alopexGrid('hideProgress');
       	}else
    	if(flag == 'deleteFacilitiesProviderDetail'){
    		alert("삭제되었습니다.");
			//순번은 초기화 되어야 함.
    		param.lesDmdStdSrno = null;
	  		serviceRequest(	 'getFacilitiesProviderDetailList'
	  				,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderDetailList',param,'GET');
    	}else
        if(flag == 'deleteFacilitiesProvider'){
        	alert("삭제되었습니다.");
        	serviceRequest(	 'getFacilitiesProviderList'
        			,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderList',$("#searchForm").getData(),'GET');
        }
    	
    }
    
	//serviceRequest 실패시.
    function failCallback(response, flag){
    	if(flag == 'getFacilitiesProviderList'){
    		alert(response.__rsltMsg__);
    	}else
       	if(flag == 'getFacilitiesProviderDetailList'){
       		alert(response.__rsltMsg__);
       	}else
   		if(flag == 'deleteIntgFctLst'){
   			alert(response.__rsltMsg__);
    	}
    	
    }    
    

	/**
	 * providerDetailPopup
	 * 
	 * @param sPopId, sGrid, sTitle, sUrl, sData, dWidth, dHeight
	 * @return void
	 */
    function providerDetailPopup(sPopId, sGrid, sTitle, sUrl, sData, dWidth, dHeight){
    	
        $a.popup({
        	popid: sPopId,
        	title: sTitle,
            url: sUrl, 
            data : sData,
			modal: true,
			center: true,
			width : dWidth,
			height : dHeight,
			
            callback: function() {
				serviceRequest(	 'getFacilitiesProviderList'
								,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderList',$("#searchForm").getData(),'GET');
           	}
        });    	
    	
    }
    
    
    //본부 Change Event 처리
    function headOfficeChangeEventHandler(event){
    	headOffice = $('#hdofcOrgId').val();
    	
        team_data = [{depth:"1",upperCodeId:"00001595",codeId:"00003161",codeName:"통합전송솔루션팀"},
                     {depth:"1",upperCodeId:"00001196",codeId:"00003358",codeName:"수도권전송망운용팀"},
                     {depth:"1",upperCodeId:"00001205",codeId:"00003359",codeName:"부산전송망운용팀"},
                     {depth:"1",upperCodeId:"00003360",codeId:"00003362",codeName:"대구전송망운용팀"},
                     {depth:"1",upperCodeId:"00001224",codeId:"00003365",codeName:"중부전송망운용팀"},
                     {depth:"1",upperCodeId:"00001215",codeId:"00003364",codeName:"서부전송망운용팀"},
                     {depth:"1",upperCodeId:"00001215",codeId:"00001222",codeName:"제주품질관리팀"}];
    	
    	option_data = [{depth:"0",upperCodeId:"",codeId:"",codeName:"전체"}];
    	
    	$('#teamOrgId').clear();
    	
    	if(headOffice !== ''){
    		for(var i=0; i<team_data.length; i++){
    			var obj = team_data[i];
    			if(obj.upperCodeId == headOffice){
    				option_data.push(obj);
    			}
    		}
    	}
    	
    	$('#teamOrgId').setData({
            data:option_data
		});
    }
    
    // 제공사업자정보/상세 삭제 버튼 Click Event 처리
	function bntDeleteRowClickEventHandler(event, sType, sGrid){
		
		var param = $('#'+ sGrid).alopexGrid('dataGet', {_state: {selected:true}});
		if(param.length < 1){
			alert('삭제할 제공사업자(세부)정보을 선택하여 주십시요');
			return;
		}else
		if(param.length > 1){
			alert('삭제할 제공사업자(세부)정보을 한건만 선택하여 주십시요');
			return;
		}

		if (window.confirm('정말로 삭제 하시겠습니까?')) {
			serviceRequest(sType,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/' + sType + '?method=delete',param[0],'POST');
		}
	}
	
	
	//추가 버튼 Click Event 처리
	function bntAddRowClickEventHandler(event, sPopId, sGrid){	
		
		var sTitle = sUrl = null;
		var dWidth = dHeight = 0.0;

		
		var param = $('#'+ masterGridId).alopexGrid("dataGetByIndex", {row:0});
		if(param == null){
			alert('등록될 제공사업자 정보를 조회 해 주세요.');
			return;
		}

		if(sPopId == 'updateFacilitiesProvider'){
			sTitle = '제공사업자정보 등록';
			sUrl = 'FacilitiesProviderModPopup.do';
			param.popupType = 'I';
			dWidth = 540;
			dHeight = 600;
		}else{
			sTitle = '제공사업자(세부)정보 등록';
			sUrl = 'FacilitiesProviderDetailModPopup.do';
			param.popupType = 'I';
			dWidth = 840;
			dHeight = 550;
		}

		providerDetailPopup(sPopId, sGrid, sTitle, sUrl, param, dWidth, dHeight);
	}
	
	
	//수정 버튼 Click Event 처리
	function bntUpdateRowClickEventHandler(event, sPopId, sGrid){
		
		var sTitle = sUrl = null;
		var dWidth = dHeight = 0.0;
	    var param = $('#'+ sGrid).alopexGrid('dataGet', {_state: {selected:true}});
	    
		if(param.length < 1){
			alert('수정할 제공사업자(세부)정보을 선택하여 주십시요');
			return;
		}else
		if(param.length > 1){
			alert('수정할 제공사업자(세부)정보을 한건만 선택하여 주십시요');
			return;
		}
		var sData = param[0];
		
		if(sPopId == 'updateFacilitiesProvider'){
			sTitle = '제공사업자정보 수정';
			sUrl = 'FacilitiesProviderModPopup.do';
			sData.popupType = 'U';
			dWidth = 540;
			dHeight = 600;
		}else{
			sTitle = '제공사업자(세부)정보 수정';
			sUrl = 'FacilitiesProviderDetailModPopup.do';
			sData.popupType = 'U';
			dWidth = 840;
			dHeight = 550;
		}
		
		providerDetailPopup(sPopId, sGrid, sTitle, sUrl, sData, dWidth, dHeight);
	}
	
	
    function getFormatString(num){
    	if(num < 10){
    		return "0"+num;
    	}else{
    		return num;
    	}
    }
    
	//Excel Download 실행
	function btnDownloadExcelClickEventHandler(event, grid){

		dt = new Date();
		
		excelName = "ExcelExport__";
		
		excelName += dt.getFullYear();
		excelName += getFormatString(dt.getMonth() + 1);
		excelName += getFormatString(dt.getDate());
		excelName += getFormatString(dt.getHours());
		excelName += getFormatString(dt.getMinutes());
		excelName += getFormatString(dt.getSeconds());
		
		var worker = new ExcelWorker({
    		excelFileName: excelName,
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: 'ExcelExport',
    			$grid: $('#' + grid)
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
});