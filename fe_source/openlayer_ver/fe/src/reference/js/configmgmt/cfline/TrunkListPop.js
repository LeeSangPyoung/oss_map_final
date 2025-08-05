/**
 * PopTmofEst.js 
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

$a.page(function() {
    
    var searchYn   = false ;  
    var paramData = new Object();
    var searchArea = true ;  
    var vSearchDivision = "trunk"; 
    var topoLclCd    = "002";
    var topoSclCd    = "100";
    var isLink       = false;
    
    var isNetworkPath = false;
    
    var popFlag = "";
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var topoCd =[{value:"",text:"전체"},{value:"01",text:"트렁크"},{value:"02",text:"WDM트렁크"},{value:"03",text:"기간망트렁크"},{value:"04",text:"패킷트렁크"}];
	var gridResult = 'trunkResultListGrid';
	//var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터
	
	var C01050Data = []; // 토폴로지대분류코드 
	var C01052Data = []; // 토폴로지소분류코드 
 
	
    this.init = function(id, param) {
    	paramData = param;
    	topoLclCd    = nullToEmpty(paramData.topoLclCd);
    	topoSclCd    = nullToEmpty(paramData.topoSclCd);
    	isLink       = nullToEmpty(paramData.isLink);    
    	popFlag = nullToEmpty(paramData.popFlag);
    	
    	var titleHtml = "";
    	if(topoLclCd == '003' && topoSclCd == '101') {
    		// WDM 트렁크일 경우
    		titleHtml = "<h1>WDM 트렁크 리스트 조회</h1>";
    	} else {
    		// 그 외
    		titleHtml = "<h1>트렁크 리스트 조회</h1>";
    	}
    	if(popFlag=="serviceLineRontSearch"){ // 서비스회선에서 windowpop = false로 뜨우면 타이틀이 중복됨
    		titleHtml = "";
    	}
    	$("#popHeadDiv").append(titleHtml);
    		
    	if (paramData != null && paramData.vTmofInfo != null && paramData.vTmofInfo.length > 0 ){
    		 
    		isNetworkPath = true;
    		
    		var topMtsoIdList = [paramData.vTmofInfo.length];
    		for (i=0;i<paramData.vTmofInfo.length ;i++){
    			topMtsoIdList[i]= paramData.vTmofInfo[i].mtsoId;
    		}
        	
    		// 기본조건 숨기기
    		$('.searchArea').css('display','none');
    		$('.searchntwkLineNo').css('display','none');
    		
    		// 포트 enable 설정
    		$('#ntwkLineNm').val(nullToEmpty(paramData.ntwkLineNm));
    		inputEnableProc("lEqpNM","lPortNm","");
    		
    		// 전송실 Array 
    		$.extend(paramData,{"topMtsoIdList":topMtsoIdList});
    		// 트렁크명
    		$.extend(paramData,{"ntwkLineNm":paramData.ntwkLineNm});
    		// 페이징 여부  
    		$.extend(paramData,{"sPagingYN":false});
    		   
        	$.extend(paramData,{topoLclCd: topoLclCd});
	    	$.extend(paramData,{topoSclCd: topoSclCd});
	    	$.extend(paramData,{isLink: isLink});
    		
    		// dataset 여부 
    		searchYn = true;
    		searchArea = false;

    		//2017-04-17 자동조회제거
    		//cflineShowProgressBody();
    		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getselectTrunkList', paramData, 'POST', 'searchPop');
    		
    	}else if(popFlag == "serviceLineRontSearch") {
    		createMgmtGrpSelectBox ("ownCdPop", "A", $('#userMgmtCdPop').val());  // 관리 그룹 selectBox
    		setSelectCode();
    		$('#topoCdPop').setSelected("03");
    	}else{
    		 
    		// 선번창용 검색 조건 숨기기 
    		$('.searchAreaForNetworkPath').css('display','none') ;
    		
    		createMgmtGrpSelectBox ("ownCdPop", "A", $('#userMgmtCdPop').val());  // 관리 그룹 selectBox
    		setSelectCode();
    	 
    	}

	    var span = cflineMsgArray['trunk'] + cflineMsgArray['line'] + " "+cflineMsgArray['search'];
	    
	    if (nullToEmpty( topoLclCd )  == "002"  ){
	    	span = cflineMsgArray['trunk'] + cflineMsgArray['line'] + " "+cflineMsgArray['search']; ;
	    }else if (nullToEmpty( topoLclCd )  == "003" && nullToEmpty( topoSclCd ) == "101"  ){
	    	span = cflineMsgArray['wdmTrunk'] + cflineMsgArray['line'] + " "+cflineMsgArray['search']; ;
	    }else if (nullToEmpty( topoLclCd )  == "003" && nullToEmpty( topoSclCd ) == "102" ){
	    	span = cflineMsgArray['backboneNetworkTrunk'] + cflineMsgArray['line'] + " "+cflineMsgArray['search']; ;
	    }else {
	    	span = cflineMsgArray['trunk'] + cflineMsgArray['line'] + " "+cflineMsgArray['search']; ;
	    }
	    
	    document.getElementById("trunkNmGroup").innerHTML = span;
	    
    	initGrid();
    	setEventListener();   
    	 
        // 그리드 멀티 셀렉트
    	if(paramData.multiSelect) {
    		$('#'+gridResult).alopexGrid("updateOption", { rowSingleSelect : false});
    		$('#btnPopArea').css('display','block');
    	} else {
    		$('#'+gridResult).alopexGrid("updateOption", { rowSingleSelect : true});
    	}
    };
    
  //Grid 초기화
    function initGrid() {
    	var nodata= cflineMsgArray['noInquiryData'];
        //그리드 생성
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting: true
			},
			message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
    		},

			columnMapping: [//{ selectorColumn : true, width : '40px' } ,
						    {key : 'check',align:'center',			width:'40px',			title : cflineMsgArray['sequence']/*'번호'*/,			numberingColumn : true		}
						   , {key : 'ntwkLineNm'	          ,title :cflineMsgArray['trunkNm']/* '트렁크명'*/             ,align:'left', width: '400px'}
					       , {key : 'mgmtGrpCdNm'	      ,title :cflineMsgArray['managementGroup']/* '관리그룹'  */           ,align:'center', width: '100px'}
					       , {key : 'ntwkCapaCdNm'	      ,title :cflineMsgArray['capacity'] /*'용량'*/                 ,align:'center', width: '100px'}
					       , {key : 'lineOpenDt'	      ,title :cflineMsgArray['openingDate']/* '개통일' */              ,align:'center', width: '100px'}
					       , {key : 'lastChgDate'	      ,title :cflineMsgArray['modificationDate']/* '수정일'*/               ,align:'center', width: '100px'}
					       , {key : 'uprMtsoIdNm'	      ,title :cflineMsgArray['upperMtsoName']/* '상위국사'*/             ,align:'center', width: '100px'}
					       , {key : 'lowMtsoIdNm'	      ,title :cflineMsgArray['lowerMtsoName']/* '하위국사'  */           ,align:'center', width: '100px'}
					       , {key : 'ntwkRmkOne'	          ,title :cflineMsgArray['remark1']/* '비고1'*/                ,align:'left', width: '100px'}
					       , {key : 'ntwkRmkTwo'	          ,title :cflineMsgArray['remark2']/* '비고2'  */              ,align:'left', width: '100px'}
					       , {key : 'ntwkRmkThree'	      ,title :cflineMsgArray['remark3']/* '비고3'*/                ,align:'left', width: '100px'}
					       , {key : 'ntwkLineNo'	          ,title :cflineMsgArray['trunkId']/* '트렁크ID'  */       	  ,align:'center', width: '100px'}
					       , {key : 'tdmUseYnNm'	          ,title :cflineMsgArray['tdmUsingYn']/* 'TDM사용여부' */         ,align:'center', width: '100px'}
					       , {key : 'tdmRsnCtt'	          ,title :cflineMsgArray['tdmRsnCtt'] /* '이유'  */               ,align:'left', width: '100px'}
					       , {key : 'tdmChgUserNm'	      ,title :cflineMsgArray['TDMCngUserNm'] /* 'TDM변경자'*/            ,align:'center', width: '100px'}
					       , {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px'}
					       , {key : 'appltDt'	                ,title : cflineMsgArray['applicationDate'] /*청약일자*/                       ,align:'center', width: '90px'}
			       		   ]                                                                       
			               }); 
    	
        
    };

    
    
    function setSelectCode() {
    	setSearchCode("orgCdPop", "teamCdPop", "tmofCdPop");

    	$('#topoCdPop').clear();
		$('#topoCdPop').setData({data : topoCd });
		
    }
    
    function setEventListener() { 
    	 
    	
	   	//조회 
	   	 $('#btnPopSearch').on('click', function(e) {
	   		searchYn = true; 
	   		setGrid(1,20);
        });
	   	
	   	
	   	// 엔터 이벤트 
     	$('#searchPopForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			searchYn = true ; 
     			setGrid(1,20);
       		}
     	});
   		$('#'+gridResult).on('scrollBottom', function(e){
   			if (searchArea){
   				searchYn = false; 
	        	setGrid(20,20);
   			}
    	});

	 	$('#ownCdPop').on('change',function(e){
	 		changeMgmtGrp("ownCdPop", "orgCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
	   	}); 
 	
        $('#'+gridResult).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
		 	var tmpList = [dataObj];
    	 	$a.close(tmpList);
    	 });
        
        // 트렁크대분류코드 선택시
    	$('#topoLclCdPop').on('change',function(e){
        	$.extend(paramData,{comGrpCd:"C01052"});
        	$.extend(paramData,{uprComCd: $('#topoLclCdPop').val() });
        	$.extend(paramData,{upperComCd:"99"});
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/groupTwo', paramData, 'GET', 'C01052Data');
      	}); 
    	
    	
    	// 상위국 국사찾기
    	$('#btnMtsoSch').on('click', function(e) {
    		var paramValue = "";
			paramValue = {"mgmtGrpNm": $('#ownCdPop option:selected').text(),"orgId": $('#orgCdPop').val(),"teamId": $('#teamCdPop').val(),"mtsoNm": $('#popMtsoNm').val(), "regYn" : "Y", "mtsoStatCd" : "01"}
			openMtsoDataPop("popMtsoId", "popMtsoNm", paramValue);
			
		});
    	
    	// 국사 첫을때 
     	$('#popMtsoNm').on('keydown', function(e){
     		if (e.which != 13  ){
     			$("#popMtsoId").val("");
     		}
     		
     	});
    
     	$('#popMtsoNm').on('keyup', function(e){
     		if ( nullToEmpty( $("#popMtsoNm").val() )  == "" ){
     			$("#popMtsoId").val("");
     			$('#popMtsoId').setEnabled(false);// 좌포트
     		}
     	});
 
     	
    	// 본부 선택시
    	$('#orgCdPop').on('change',function(e){
    		changeHdofc("orgCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
      	});    	 
  		// 팀 선택시
    	$('#teamCdPop').on('change',function(e){
    		changeTeam("teamCdPop", "tmofCdPop", "mtsoPop");
      	});      	 

    	//닫기
   	 	$('#btnPopClose').on('click', function(e) {
   	 		$a.close();
        });    	
    	 
    	//저장 
    	 $('#btnPopConfirm').on('click', function(e) {
    		 openerProc();
         });
    	 
    	 $('#lEqpNM').on('propertychange input', function(e){
    		 inputEnableProc("lEqpNM","lPortNm","")
    	 });
    	 	
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchPop'){
    		cflineHideProgressBody();
    		if(searchYn){
				$('#'+gridResult).alopexGrid("dataSet", response.outTrunkList);
				$('#'+gridResult).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCount);} } } );
			}else{
				if(response.outTrunkList.length == 0){
					/*alert('더 이상 조회될 데이터가 없습니다');*/
					alertBox('I', cflineMsgArray['noMoreData']);/* 더 이상 조회될 데이터가 없습니다. */
					return false;
				}else{
		    		$('#'+gridResult).alopexGrid("dataAdd", response.outTrunkList);
		    		$('#'+gridResult).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCount);} } } );
				}
			}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }

    
    function setGrid(first, last) {

		if( first == "1" && last =="20"){
			$("#firstRowIndexPop").val( parseInt(first) );
			$("#lastRowIndexPop").val( parseInt(last) );
			
			$("#firstRow01Pop").val( parseInt(first) );
			$("#lastRow01Pop").val( parseInt(last) );
			
		}else{
			$("#firstRowIndexPop").val( parseInt($("#firstRowIndexPop").val())  + parseInt(first)  ) ;
			$("#lastRowIndexPop").val( parseInt($("#lastRowIndexPop").val())  + parseInt(last)  ) ;	
			
			$("#firstRow01Pop").val( parseInt($("#firstRow01Pop").val())  + parseInt(first)  ) ;
			$("#lastRow01Pop").val( parseInt($("#lastRow01Pop").val())  + parseInt(last)  ) ;	
			
		}
		
		var searchParam;
		var param =  $("#searchPopForm").getData();
		
		if(isNetworkPath){
			searchParam = paramData;
			$.extend(searchParam, {
				'ntwkLineNm': param.ntwkLineNm
				, 'lEqpNM' : param.lEqpNM
				, 'lPortNm' :param.lPortNm 
				, 'firstRowIndexPop' :param.firstRowIndexPop
				, 'lastRowIndexPop' :param.lastRowIndexPop
			});

		} else {
			var mtsoSelectData = $('#mtsoPop').getSelectedData();
			if (mtsoSelectData !=null ) {
				 $('#mtsoPopCdPop').val(mtsoSelectData.value);
			}    	
			
			var topMtsoIdList = []; 
			if (nullToEmpty( $("#tmofCdPop").val() )  != ""  ){
				topMtsoIdList =   $("#tmofCdPop").val() ;	
			}
			
		    if (nullToEmpty( $("#topoCdPop").val() )  == "01"  ){
		    	$.extend(param,{topoLclCd: "002" });
		    	$.extend(param,{topoSclCd: "100" });
		    }else if (nullToEmpty( $("#topoCdPop").val() )  == "02"  ){
		    	$.extend(param,{topoLclCd: "003" });
		    	$.extend(param,{topoSclCd: "101" });
		    }else if (nullToEmpty( $("#topoCdPop").val() )  == "03"  ){
		    	$.extend(param,{topoLclCd: "003" });
		    	$.extend(param,{topoSclCd: "102" });
		    }else if (nullToEmpty( $("#topoCdPop").val() )  == "04"  ){
		    	$.extend(param,{topoLclCd: "004" });	
		    }
			
		    $.extend(param,{topMtsoIdList: topMtsoIdList });
		    searchParam = param;
		}
		
	    cflineShowProgressBody();
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getselectTrunkList', searchParam, 'POST', 'searchPop');
			 
			 
		 
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
    
    function setSPGrid(GridID ,Option ,Data) {
		
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}    

    function openerProc(){
		var resultData = null;
 	 	var data =  $('#'+gridResult).alopexGrid("dataGet");
 	 	
 	 	if(data != null){
 	 		if(data.length == 1){
 	 			resultData =  $('#'+gridResult).alopexGrid("dataGet", {_index : { row : 0}, _state : { selected : true }});
 	 		}else if(data.length > 1){
 	 			resultData =  $('#'+gridResult).alopexGrid("dataGet", { _state : { selected : true }});
 	 			resultData = AlopexGrid.trimData(resultData);
 	 			if(resultData.length <= 0) {
 	 				alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
 	 				return;
 	 			}
 	 		}
 	 		$a.close(resultData);
 	 	}
    }
    
    function onloadMgmtGrpChange(){
    	changeMgmtGrp("ownCdPop", "orgCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
    }
	
});