/**
 * RingListBySubscriptionPop.js 
 *
 * @author Administrator
 * @date 2018. 12. 12. 오후 14:02:03
 * @version 1.0
 */
$a.page(function() {
	var gridResult = 'resultListGrid';
	var isNotParamNull = false ; // param의 null여부: 조회 조건 항목 변화
	var setInitParam = {};
	var lftEqpNm = "";
	var lftPortNm = "";
	var ntwkLineNm = "";
	var topMtsoIdList = "";
	var topoSclData = ""; // 망종류(토폴로지소분류코드)
	var ntwkTypData = ""; // 망구분(네트워크유형코드)
	var topoSclSearchChk = "";  // 링 등록시 휘더망
	
    this.init = function(id, param) {
    	if(param.ntwkLineNm != undefined) { // networkPath 검색 조건 표출 (data : param)
    		isNotParamNull = true;
    		$('.searchAreaForCommon').hide();
    		$('.ringName').prependTo($('#searchAreaForNetworkPath'));
    		$('.topMtso').prependTo($('.addsearchAreaForNetworkPath'));
    		$('#lftEqpNmPop').css('width','230px');
    		$('#lftPortNmPop').css('width','230px');
    		$('#ntwkLineNmPop').css('width','230px');
    		$('#topMtsoIdListPop').css('width','230px');
    		$('#ntwkTypCdDiv').css('width','230px');
    		$('#topoSclCdDiv').css('width','230px');
    		$('#colgroup').append('<col style="width:15%">');
    		$('#colgroup').append('<col style="width:35%">');
    		
    		var tmofParamData = [];
    		var mtsoIdList = [];
    		var tmofCd = "";
    		if(nullToEmpty(param.vTmofInfo) != "") {
    			var mtsoId = "";
    			var mtsoNm = "";
    			var index = 0;
    			for(i=0; i<param.vTmofInfo.length ;i++) {
    				mtsoId = param.vTmofInfo[i].mtsoId;
    				mtsoNm = param.vTmofInfo[i].text
    				if(nullToEmpty(mtsoNm) != ""){
    					tmofParamData.push({value:mtsoId, text:mtsoNm});
    					mtsoIdList[index] = mtsoId;
    					index++;
    				}
    			}
    			tmofCd = mtsoIdList.join(',');
    		}
    		
        	$('#topMtsoIdListPop').setData({
        		data:tmofParamData,
        		topMtsoIdList:mtsoIdList
        	});
    		
    		ntwkLineNm = nullToEmpty(param.ntwkLineNm);
    		topMtsoIdList = tmofCd;
    		var topoLclCd = nullToEmpty(param.topoLclCd);
    		var topoSclCd = nullToEmpty(param.topoSclCd);
    		var mgmtGrpCd = nullToEmpty(param.mgmtGrpCd);
    		$('#ntwkLineNmPop').val(ntwkLineNm);
    		// 휘더망링인 경우 검색 조건 숨김
    		if(topoSclCd == '030') {
//    			$('#searchArea').hide();
    			$('#topMtsoIdListPop').hide();
    			$('#ntwkTypCdPop').setEnabled(false);
    			topoSclSearchChk = "Y";
    			 
    		}// svlnLclCd RU회선 && svlnSclCd RU = 망종류 RINGMUX_RING
    		else if(nullToEmpty(param.svlnLclCd) == '003' && nullToEmpty(param.svlnSclCd) == '103'){
    			topoSclCd = '010';
    		}
    		
    		setInitParam = {"ntwkLineNm" : ntwkLineNm, "topMtsoIdList" : tmofCd, "topoLclCd" : topoLclCd, "topoSclCd" : topoSclCd, "mgmtGrpCd" : mgmtGrpCd}; 
    		// 그리드 데이터 셋팅
    		//2017-04-17 자동조회제거
    		//setGridData("init");
    		setSelectCode("path");
    	}else { // 공통 검색 조건 표출(data : null)
    		isNotParamNull = false;

        	if (nullToEmpty(param.topoSclCd) != "") {
        		setInitParam.topoSclCd = param.topoSclCd;
        		
        		// SMUX/5G-PON인 경우 
        		if ("035" == setInitParam.topoSclCd  || "033" == setInitParam.topoSclCd || "036" == setInitParam.topoSclCd || "042" == setInitParam.topoSclCd) {
        			createMgmtGrpSelectBox ("mgmtGrpCd", "", "SKT");  // 관리 그룹 selectBox
        		} else {
            		createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
        		}
        	} else {
        		createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
        	}
    		$('.searchAreaForNetworkPath').hide();
    		setSelectCode("");	
    	}
    	
    	// process for input text box
    	inputEnableProc("lftEqpNmPop","lftPortNmPop","");
    	inputEnableProc("rghtEqpNmPop","rghtPortNmPop","");
    	
    	initGrid();
    	setEventListener();   
    };
    
    // 그리드 초기화
    function initGrid() {
    	var nodata = cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */;
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		preventScrollPropagation: true, // 그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting: true
			},
			height : 350,
	    	message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
	    	},
			columnMapping: [
//			                { selectorColumn : true, width : '100px' } 
						    {key : 'check', align:'center', width:'40px',	title : cflineMsgArray['sequence'] /*순번*/,	numberingColumn : true}
						   , {key : 'ntwkLineNo',	title : cflineMsgArray['ringIdentification'] /*링ID*/,	align:'center',	width: '110px'}
						   , {key : 'ntwkLineNm',	title : cflineMsgArray['ringName'] /*링명*/,	align:'left',	width: '240px'}
						   , {key : 'mgmtGrpCdNm',	title : cflineMsgArray['managementGroup'] /*관리그룹*/,	align:'center',	width: '90px'}
						   , {key : 'ntwkTypNm',	title : cflineMsgArray['networkDivision'] /*망구분*/,	align:'center',	width: '135px'}
						   , {key : 'topoSclNm',	title : cflineMsgArray['ntwkTopologyCd'] /*망종류*/,	align:'center',	width: '150px'}
						   , {key : 'ntwkCapaNm',	title : cflineMsgArray['capacity'] /*용량*/,	align:'center',	width: '90px'}
						   , {key : 'ringSwchgMeansNm',	title : cflineMsgArray['ringSwchgMeansCd'] /*절체방식*/,	align:'center',	width: '120px'}
						   , {key : 'frstRegUserId',	title : cflineMsgArray['registrant'] /*등록자*/,	align:'center',	width: '120px'}
						   , {key : 'lineOpenDt',	title : cflineMsgArray['openingDate'] /*개통일자*/,	align:'center',	width: '81px'}
						   , {key : 'lastChgUserId',	title : cflineMsgArray['changer'] /*변경자*/,	align:'center',	width: '120px'}
						   , {key : 'lastChgDate',	title : cflineMsgArray['modificationDate'] /*수정일자*/,	align:'center',	width: '81px'}
					       ]                                                                       
			               });
    };
    
    function setSelectCode(flag) {
    	var topMtsoIdListPop = "";
    	if(flag == "") {
    		topMtsoIdListPop = "topMtsoIdListPop";
    	}
    	var param = {"userMgmtNm": $('#userMgmtCd').val()};
    	setSearchCode("hdofcCdPop", "teamCdPop", topMtsoIdListPop); 
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', param, 'GET', 'TopoData'); // 망종류데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', param, 'GET', 'NtwkTypData'); // 망구분 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data'); // 용량 데이터
    }
    
    function setEventListener() { 
	   	//조회 
    	$('#btnSearchPop').on('click', function(e) {
	    	lftEqpNm = $('#lftEqpNmPop').val();
	    	lftPortNm = $('#lftPortNmPop').val();
	    	ntwkLineNm = $('#ntwkLineNmPop').val();
	    	topoSclData = $('#topoSclCdPop').val(); // 망종류(토폴로지소분류코드)
	    	ntwkTypData = $('#ntwkTypCdPop').val(); // 망구분(네트워크유형코드)
	    	if(nullToEmpty($('#topMtsoIdListPop').val()) != "") {
	    		topMtsoIdList = $('#topMtsoIdListPop').val().join(',');
	    	}else {
	    		topMtsoIdList = "topMtsoIdList";
	    	}
	   		fnSearchProcess();
        });
    	
    	// 엔터 이벤트
    	$('#searchFormPop').on('keydown', function(e){
     		if (e.which == 13  ){
				$('#btnSearchPop').click();
				return false;
     		}
     	});
     	
     	// 좌장비
     	$('#lftEqpNmPop').on('propertychange input', function(e){
     		inputEnableProc("lftEqpNmPop","lftPortNmPop","");
     	});
     	
     	// 우장비
     	$('#rghtEqpNmPop').on('propertychange input', function(){
     		inputEnableProc("rghtEqpNmPop","rghtPortNmPop","");
     	});
     	
     	// 그리드스크롤
    	$('#'+gridResult).on('scrollBottom', function(e){
    		// 그리드 데이터 셋팅
    		setGridData("scrollBottom");
    	});
    	
    	// 관리그룹 클릭시
    	$('#mgmtGrpCd').on('change',function(e){
    		changeMgmtGrp("mgmtGrpCd", "hdofcCdPop", "teamCdPop", "topMtsoIdListPop", "mtsoPop");
    		var mgmtGrpCd =$('#mgmtGrpCd').val();
    		if(mgmtGrpCd == '0001') {
    			mgmtGrpCd = 'SKT';
    		}else if(mgmtGrpCd == '0002'){
    			mgmtGrpCd = 'SKB';
    		}else {
    			mgmtGrpCd = '';
    		}
    		var param = {"userMgmtNm": mgmtGrpCd};
        	// 망종류 변경
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', param, 'GET', 'NtwkTypData'); // 망구분 데이터
        	// 망구분 변경
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', param, 'GET', 'TopoData'); // 망종류 데이터
      	});
    	
    	//그리드 더블클릭시
        $('#'+gridResult).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
    	 	//$a.navigate($('#ctx').val()+'/configmgmt/common/MtsoReg.do',dataObj);
    	 	$a.close(dataObj);
			
    	 });
        
    	// 상위국 국사찾기
    	$('#btnMtsoSchPop').on('click', function(e) {
    		var paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCdPop').val(),"teamId": $('#teamCdPop').val(),"mtsoNm": $('#mtsoNmPop').val()}
    		openMtsoDataPop("mtsoIdPop", "mtsoNmPop", paramValue);
		});
    	
    	// 본부 선택시
    	$('#hdofcCdPop').on('change',function(e){
    		changeHdofc("hdofcCdPop", "teamCdPop", "topMtsoIdListPop", "mtsoPop");
      	});  
    	
  		// 팀 선택시
    	$('#teamCdPop').on('change',function(e){
    		changeTeam("teamCdPop", "topMtsoIdListPop", "mtsoPop");
      	});   
    	
    	// 국사 propertychange
     	$('#mtsoNmPop').on('propertychange input', function(e){
     		$("#mtsoIdPop").val("");
     	});    	
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchPop'){
    		cflineHideProgressBody();
    		$("#"+gridResult).alopexGrid("viewUpdate");
    		$('#'+gridResult).alopexGrid("dataSet", response.outRingList);
    		$('#'+gridResult).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);} } } );
    	}
    	
    	if(flag == 'searchPopForPageAdd'){
    		cflineHideProgress(gridResult);
			if(response.outRingList.length <= 0){
				return false;
			}else{
	    		$('#'+gridResult).alopexGrid("dataAdd", response.outRingList);
	    		$('#'+gridResult).alopexGrid('updateOption',
						{paging : {pagerTotal: function(paging) {
							return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);
						}}}
				);
			}
    	}
    	
    	if(flag == 'TopoData') {
    		var TopoData = [{value: "", text: cflineCommMsgArray['all']/*전체*/}];
    		var paramTopoData = nullToEmpty(setInitParam.topoSclCd);
    		for(var n=0 ; n<response.TopoData.length ;n++) {
    			if(paramTopoData != ""){
    				if(paramTopoData == response.TopoData[n].topoSclCd){
    					TopoData.push({value:response.TopoData[n].topoSclCd, text: response.TopoData[n].topoSclNm});
    				}
    			}else{
    				TopoData.push({value:response.TopoData[n].topoSclCd, text: response.TopoData[n].topoSclNm});
    			}
    		}
    		$('#topoSclCdPop').clear();
    		$('#topoSclCdPop').setData({data : TopoData});
    		$('#topoSclCdPop').setSelected(paramTopoData);
    		
    		// SMUX/5G-PON링인경우 비활성
    		if ("035" == paramTopoData || "033" == paramTopoData || "036" == paramTopoData || "042" == paramTopoData) {
    			$('#topoSclCdPop').setEnabled(false);
    			if ($('#mgmtGrpCd').val() == "0001") {
    				$('#mgmtGrpCd').setEnabled(false);
    			}
    		}
    	}
    	
    	// 망 구분 조회조건 설정
    	if(flag =='NtwkTypData'){
    		var NtwkTypData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		for(n=0 ; n<response.NtwkTypData.length ; n++){
    			NtwkTypData.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    		}
			$('#ntwkTypCdPop').clear();
			$('#ntwkTypCdPop').setData({data : NtwkTypData});
    	}
    	
    	// 용량 조회조건 설정
    	if(flag == 'C00194Data'){
    		var C00194Data = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
			for(var i=0; i<response.length; i++){
    			C00194Data.push({value : response[i].value, text :response[i].text});
    		}
    		$('#ntwkCapaCdPop').clear();
    		$('#ntwkCapaCdPop').setData({data : C00194Data});
    	}
    }
    
    function failCallback(response, status, flag){
    	if(flag == 'searchPop'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }

    function fnSearchProcess() {
    	// 데이터 정합성 검사
    	var ringNameVal = $("#ntwkLineNmPop").val(); 
    	var ringIdVal = $("#ntwkLineNoPop").val(); 
    	if(ringNameVal.length >100){
    		cflineHideProgressBody();
    		var msgArg = cflineMsgArray['ringName'];
    		var msgArg1 = 100;
    		alertBox('I', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* {0} 항목은 {1}자까지 입력가능합니다. */
    		$('#ntwkLineNmPop').focus();
    		return false;
    	}
    	if(ringIdVal.length >100){
    		cflineHideProgressBody();
    		var msgArg = cflineMsgArray['ringIdentification'];
    		var msgArg1 = 100;
    		alertBox('I', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* {0} 항목은 {1}자까지 입력가능합니다. */
    		$('#ntwkLineNoPop').focus();
    		return false;
    	}
    	
    	// 그리드 데이터 셋팅
    	setGridData("searchProcess");
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
    
    function setGridData(division){
    	var param = "";
    	var nFirstRowIndex = 1;
    	var nLastRowIndex = 20;
    	var callBackFlag = 'searchPop';
    	//var searchFormData1 = $("#searchFormPop").serialize();
    	var searchFormData = "";
    	
    	if(division == "scrollBottom"){
    		nFirstRowIndex = parseInt($("#firstRowIndexPop").val()) + 20;
    		$("#firstRowIndexPop").val(nFirstRowIndex);
    		nLastRowIndex = parseInt($("#lastRowIndexPop").val()) + 20;
    		$("#lastRowIndexPop").val(nLastRowIndex);
    		callBackFlag = 'searchPopForPageAdd';
    		cflineShowProgress(gridResult);
    		
    	}else{
    		$("#firstRowIndexPop").val(nFirstRowIndex);
    		$("#lastRowIndexPop").val(nLastRowIndex);
    		cflineShowProgressBody();
    	}
    	
    	searchFormData = $("#searchFormPop").serialize();
    	
    	// 망종류가 비활성이면
    	if ($('#topoSclCdPop').is("enabled") == false) {
    		searchFormData += "&topoSclCd="+$('#topoSclCdPop').val();
    	}
    	// 관리그룹이 비활성이면
    	if ($('#mgmtGrpCd').is("enabled") == false) {
    		searchFormData += "&mgmtGrpCd="+$('#mgmtGrpCd').val();
    	}
		if(isNotParamNull) {
			param = setInitParam;
			param.ntwkLineNm = ntwkLineNm;
			param.lftEqpNm = lftEqpNm;
			param.lftPortNm = lftPortNm;
			param.firstRowIndex = nFirstRowIndex;
			param.lastRowIndex = nLastRowIndex;
	    	param.topMtsoIdList = topMtsoIdList;

    		if(topoSclSearchChk =="Y"){
    			param.topMtsoIdList = "";
    		}else{
    			param.topMtsoIdList = topMtsoIdList;
    		}	    	
	    	param.ntwkTypCd = ntwkTypData;
	    	
			if(setInitParam.topoSclCd != '010' && setInitParam.topoSclCd != '030'){
				param.topoSclCd = topoSclData;
			}
		}else{
			param = searchFormData;
		}
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getSelectRingList', param, 'GET', callBackFlag);
    }
});