/**
 * ServiceLineListPop.js
 * 
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var gridResult = 'resultListGrid';
var svlnLclSclCdPopData = [];  // 서비스회선소분류코드 데이터
var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터
var svlnTypCdPopListCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnTypPopCombo = [];  // 콤보용 서비스회선유형코드 데이터

var paramData = null;
var selectDataObj = null;
var utrdMgmtNo = "";
var popPageForCount = 200;
var mgmtGrpCdVal = "";
var callUrl = "";
var totalCnt = 0;

var popChk = null;		// RU 광코어 : 대표회선 설정에서 서비스회선 조회 팝업을 열었을 때 체크 플래그
var optlShreRepSvlnNo = null;	// RU 광코어 : 대표회선 설정에서 서비스회선 추가를 할 때 부모창에서 대표회선 값을 넘기면 그 대표값을 제외한 서비스회선을 보여주기 위함

var gridIdScrollBottom = true;

$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	//if (! jQuery.isEmptyObject(param) ) {
    		paramData = param;
    		popChk = paramData.srvcChk;
    		optlShreRepSvlnNo = paramData.optlShreRepSvlnNo;
    		
    		// 20181105 RU 광코어 : 대표회선설정 - 서비스회선 추가
    		if((popChk == 'ruRpetr') && (paramData.svlnLclCd == '003' && paramData.svlnSclCd == '101')) {
    			$('#schTabPop').hide();
    			$('#ruTabPop').show();
    			//paramData = null;
    		}

    		if(typeof param.utrdMgmtNo != "undefined"){
    			utrdMgmtNo = param.utrdMgmtNo;
    		}
    		if(paramData != null){
//    			mgmtGrpCdVal = paramData.mgmtGrpCd;
    			if(paramData.mgmtGrpCd=="0001"){
    				mgmtGrpCdVal = "SKT";	
    			}else if(paramData.mgmtGrpCd=="0002"){
    				mgmtGrpCdVal = "SKB";
    			}    			
    			
    		}
    	//} 
//    		console.log("pop mgmtGrpCdVal : " + mgmtGrpCdVal );
    	//createMgmtGrpCheckBox("mgmtGrpCdCheckAreaPop", "mgmtGrpCd");	// 관리 그룹 체크 박스 생성
    	createMgmtGrpSelectBox ("mgmtGrpCdPop", "A", mgmtGrpCdVal);  // 관리 그룹 selectBox
    	initGrid();
    	setSelectCode();
        setEventListener();   
        callUrl = document.referrer;
    };
    
  //Grid 초기화
    function initGrid() {
    	var rmteHidden = true;
    	var svlnHidden = false;
    	
    	if((popChk == 'ruRpetr') && (paramData.svlnLclCd == '003' && paramData.svlnSclCd == '101')) {
    		rmteHidden = false;
    		svlnHidden = true;
    	}
    		
    	var returnMapping = [
							//{ selectorColumn : true, width : '50px' } , 
							{key : 'svlnNo'	              	,title : cflineMsgArray['serviceLineNumber'] /* 서비스회선번호 */			,align:'center', width: '150px'}
							, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '280px'}
							, {key : 'rmteSystmNm'	        ,title : cflineMsgArray['repeaterName'] /*중계기명*/			,align:'left', width: '160px',		hidden: rmteHidden}
							, {key : 'lowIntgFcltsCd'	        ,title : cflineMsgArray['repeaterIntegrationFacilitiesCode'] /*중계기통합시설코드 */			,align:'center', width: '140px',		hidden: rmteHidden}
							, {key : 'svlnLclCdNm'	            ,title : cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '150px',		hidden: svlnHidden}
							, {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '150px',		hidden: svlnHidden}
							, {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '150px'}
							, {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '150px'}
							, {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '80px'}
							, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '100px'}
							, {key : 'lineCapaCdNm'	      		,title : cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '80px'}
							, {key : 'lineWorkProgStatCdNm'	    ,title : cflineMsgArray['lineWorkProgressStatus'] /*회선작업진행상태*/			,align:'center', width: '150px'}
							, {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '150px'}
							, {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '150px'}
							, {key : 'uprIntgFcltsCd'	        ,title : cflineMsgArray['uprIntgFcltsCd'] /*상위통합시설코드*/			,align:'center', width: '150px'}
							, {key : 'lowIntgFcltsCd'	        ,title : cflineMsgArray['lowIntgFcltsCd'] /*하위통합시설코드*/			,align:'center', width: '150px'}
              ];
    	
    	var gridHeigth = 550;
    	
    	if((popChk == 'ruRpetr') && (paramData.svlnLclCd == '003' && paramData.svlnSclCd == '101')) {
    		var lineGubun = [{key : 'lineGubun',		title : "회선구분",		align : 'center',	width : '100px'}];
    		returnMapping = lineGubun.concat(returnMapping);
    		gridHeigth = 500;
    	}
    	
        //그리드 생성
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
			height : gridHeigth,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: returnMapping                                                              
		}); 
    	


        //gridHide();
        
        $('#'+gridResult).on('scrollBottom', function(e){
        	        	
        	// 총건수만큼 조회가 됬다면 더이상 조회하지 않음
        	if (parseInt($("#lastRowIndexPop").val()) >= totalCnt) {
        		return ;
        	}
    		    		
    		var nFirstRowIndex =parseInt($("#firstRowIndexPop").val()) + popPageForCount; 
    		$("#firstRowIndexPop").val(nFirstRowIndex);
    		var nLastRowIndex =parseInt($("#lastRowIndexPop").val()) + popPageForCount;
    		$("#lastRowIndexPop").val(nLastRowIndex);

    		if((popChk == 'ruRpetr') && (paramData.svlnLclCd == '003' && paramData.svlnSclCd == '101')) {
				var dataParam =  $("#searchPopForm").getData(); 
				
				dataParam.svlnLclCd = $('#ruSvlnLclCdPop').val();
				dataParam.svlnSclCd = $('#ruSvlnSclCdPop').val();
				dataParam.svlnNo = $('#ruSvlnNo').val();
				dataParam.svlnNm = $('#ruSvlnNm').val();
				dataParam.lowIntgFcltsCd = $('#ruLowIntgFcltsCd').val();
				$.extend(dataParam, {"addSrvcChk" : "ruRpetr"});
			} else {
				var dataParam =  $("#searchPopForm").serialize();
			}

    		//var dataParam =  $("#searchForm").getData();  
    		//dataParam.firstRowIndex = nFirstRowIndex;
        	//dataParam.lastRowIndex = nLastRowIndex;        	

        	/*dataParam.scFrstRegDateStart = $("#scFrstRegDateStart").getData().scFrstRegDateStart;
        	dataParam.scFrstRegDateEnd = $("#scFrstRegDateEnd").getData().scFrstRegDateEnd;*/
        	//$('#'+gridResult).alopexGrid('showProgress'); 
    		//if(gridIdScrollBottom) {
    			cflineShowProgress(gridResult);
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelistpop', dataParam, 'GET', 'searchPopForPageAdd');
    		//}
    	});        
    };

    
//    // 컬럼 숨기기
//    function gridHide() {
//    	
//    	var hideColList = ['svlnLclCd','svlnSclCd'];
//    	
//    	$('#'+gridResult).alopexGrid("hideCol", hideColList, 'conceal');
//    	
//	}    
    
    function setSelectCode() {
    	setSearchCode("hdofcCdPop", "teamCdPop", "tmofCdPop");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnCommCodePopData');
    }
    
    function setEventListener() { //	 	// 엔터 이벤트 
     	$('#searchPopForm').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnPopSearch').click();
    			return false;
    		}
     	});	
	   	    	
	   	//조회 
	   	$('#btnPopSearch').on('click', function(e) {
    		svlnLnoInfoDivDisplay($('#svlnLclCdPop').val());   // 선번조회버튼제어
    		selectDataObj = null;
//	   		var svlnLclCdPop = $('#svlnLclCdPop');
//	   		var svlnSclCdPop = $('#svlnSclCdPop');
//	   		//if(paramData == null){
//		   		if(svlnLclCdPop.val() == null || svlnLclCdPop.val() == "" ){
//		   			//alert("서비스회선 대분류를 선택하세요.");
//		   			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/	   			
//		   			svlnLclCdPop.focus();
//		   			//$('#svlnNoPop').focus();
//		   			return;
//		   		}
//		   		if(svlnSclCdPop.val() == null || svlnSclCdPop.val() == "" ){
//		   			//alert("서비스회선 소분류를 선택하세요.");
//		   			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineScl'],"","","")); /*"서비스 회선 소분류를 선택해 주세요.;*/	   
//		   			svlnSclCdPop.focus();
//		   			return;
//		   		}
	   		//}
			$("#firstRowIndexPop").val(1);
			$("#lastRowIndexPop").val(popPageForCount);
			
			if((popChk == 'ruRpetr') && (paramData.svlnLclCd == '003' && paramData.svlnSclCd == '101')) {
				var param =  $("#searchPopForm").getData(); 
				
				param.svlnLclCd = $('#ruSvlnLclCdPop').val();
				param.svlnSclCd = $('#ruSvlnSclCdPop').val();
				param.svlnNo = $('#ruSvlnNo').val();
				param.svlnNm = $('#ruSvlnNm').val();
				param.lowIntgFcltsCd = $('#ruLowIntgFcltsCd').val();
				$.extend(param, {"optlShreRepSvlnNo" : optlShreRepSvlnNo});
				$.extend(param, {"addSrvcChk" : "ruRpetr"});
								
				if(nullToEmpty(param.ruPortInfo) != "" ) {
					if(nullToEmpty(param.ruFdfInfo) == "") {
						alertBox('I', makeArgMsg('requiredInputObject',cflineMsgArray['equipmentName'],"","",""));	/* {0}을 입력하세요. */
						return;
					}
				}
			} else {
				var param =  $("#searchPopForm").serialize();
			}
			
			cflineShowProgress(gridResult);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelistpop', param, 'GET', 'searchPop');  	   		
        });

    	// 관리그룹 클릭시
//        $(':checkbox[name="mgmtGrpCd"]').on("click",function(){
//        	changeMgmtGrp("mgmtGrpCd", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
//      	});    	
    	$('#mgmtGrpCdPop').on('change',function(e){
    		changeMgmtGrp("mgmtGrpCdPop", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
     		changeSvlnLclCd('svlnLclCdPop', 'svlnSclCdPop', svlnLclSclCdPopData, "mgmtGrpCdPop", "A"); // 서비스회선소분류 selectbox 제어
//    		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어 	
      	});    	 
    	// 서비스회선대분류코드 선택시
    	$('#svlnLclCdPop').on('change', function(e){   		
    		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어
    	});   	 
    	
    	$('#svlnSclCdPop').on('change', function(e){
    		
    		if ("003" == $('#svlnLclCdPop').val() && "101" == $('#svlnSclCdPop').val()) {
    			$('.ruRepeater').show();
    		} else {
    			$('.ruRepeater').hide();
    		}
    	});   	 
        
    	// 본부 선택시
    	$('#hdofcCdPop').on('change',function(e){
    		changeHdofc("hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
      	});    	 
  		// 팀 선택시
    	$('#teamCdPop').on('change',function(e){
    		changeTeam("teamCdPop", "tmofCdPop", "mtsoPop");
      	});      	 
  		// 전송실 선택시
//    	$('#tmofCdPop').on('change',function(e){
//    		changeTmof("tmofCdPop", "mtsoPop");
//      	});    
    	//mtsoCd 국사엔터 칠때 
//    	$('#mtsoPop').on('keydown', function(e){
//    		if (e.which == 13  ){
//    			getmtsoCd("tmofCdPop", "mtsoPop");
//      		}
//    	});	 	
		//국사찾기
		$('#btnMtsoPopSch').on('click', function(e) {
			//openMtsoPop("mtsoPopCd", "mtsoPopNm");
			var paramValue = "";
			paramValue = {"mgmtGrpNm": $('#mgmtGrpCdPop option:selected').text(),"orgId": $('#hdofcCdPop').val(),"teamId": $('#teamCdPop').val(),"mtsoNm": $('#mtsoPopNm').val()}
			//paramValue = {"tmof": $('#lowTmofCd option:selected').val(),"mtsoNm": $('#lowMtsoNm').val()}
			openMtsoDataPop("mtsoPopCd", "mtsoPopNm", paramValue);			
		}); 
		
	 	// 국사 keydown
     	$('#mtsoPopNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#mtsoPopCd").val("");
     		}
     	});
    	
//    	//닫기
//   	 	$('#btnPopClose').on('click', function(e) {
//   	 		$a.close();
//        });    	
    	 
//    	//확인
//    	 $('#btnPopConfirm').on('click', function(e) {
//         }); 
    	 
    	   	
     	// 그리드 더블클릭
 		$('#'+gridResult).on('dblclick', '.bodycell', function(e){
 			 var dataObj = AlopexGrid.parseEvent(e).data;
			 //var element =  $('#' + gridResult).alopexGrid("dataGet", { _state : { selected : true }});
 			 var tmpList = [dataObj];
 			 
 			 // RU 광코어 : 대표회선 설정 > 광공유회선 > 서비스회선 추가를 위한 분기처리
 			 if(popChk == 'ruRpetr') {
 				var param = { "svlnNo" : dataObj.svlnNo
 									, "optlShreRepSvlnNo" : dataObj.optlShreRepSvlnNo};
 			 	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getOptlShreRepSvlnCnt', param, 'POST', 'getOptlShreRepSvlnCnt'); 
 			 } else {
 				$a.close(tmpList);
 			 }
	    }); 
 		
 		// 그리드 클릭
 		$('#'+gridResult).on('click', function(e){
			 var dataObj = AlopexGrid.parseEvent(e).data;
			 selectDataObj = dataObj;
			 if (nullToEmpty(selectDataObj) != "") {
				 svlnLnoInfoDivDisplay(dataObj.svlnLclCd);   // 선번조회버튼제어
			 }
	    });  		
	 	
		// 서비스회선 선번 조회버튼 클릭
		$('#btnSvlnLnoInfoPop').on('click', function(e) {
			if(selectDataObj == null){
	   			alertBox('W', cflineMsgArray['selectNoData']); /*  선택된 데이터가 없습니다. */	   			
	   			return;				
			}
    		showServiceLIneInfo2Pop(gridResult, selectDataObj, "N");
			
		}); 
 		
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchPop'){
    		//$('#'+gridResult).alopexGrid('hideProgress');
    		cflineHideProgress(gridResult);
    		setSPGrid(gridResult, response, response.ServiceLineList);
    	}
    	if(flag == 'searchPopForPageAdd'){
    		//$('#'+gridResult).alopexGrid('hideProgress');
    		cflineHideProgress(gridResult);
			if(response.ServiceLineList.length == 0){
				//alert('더 이상 조회될 데이터가 없습니다');
				gridIdScrollBottom = false;
				return false;
			}else{
	    		$('#'+gridResult).alopexGrid("dataAdd", response.ServiceLineList);
//	    		$('#'+gridResult).alopexGrid('updateOption',
//						{paging : {pagerTotal: function(paging) {
//							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCnt);
//						}}}
//				);
			}
    	}
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodePopData') {	
			
			var tmpMgmtCd = $('#mgmtGrpCdPop').val();
			var tmpMgmtCdNm = $('#mgmtGrpCdPop option:selected').text();
			svlnLclSclCdPopData = response;
//			console.log("pop tmpMgmtCd : " + tmpMgmtCd );
//			console.log("pop tmpMgmtCdNm : " + tmpMgmtCdNm );

			// 서비스회선 대분류
			var svlnLclCd_option_data =  [];
			for(i=0; i<response.svlnLclCdList.length; i++){
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
					svlnLclCd_option_data.push(dataFst);
				}
				var dataL = response.svlnLclCdList[i]; 
//				if(nullToEmpty(tmpMgmtCd) != "0001" || nullToEmpty(dataL.value) != "004" ){
//					svlnLclCd_option_data.push(dataL);
//				}
				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" ||  nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataL.cdFltrgVal) || "ALL" == nullToEmpty(dataL.cdFltrgVal) ){
					svlnLclCd_option_data.push(dataL);
				}
				
			}
			$('#svlnLclCdPop').clear();
			$('#svlnLclCdPop').setData({data : svlnLclCd_option_data});
			$('#ruSvlnLclCdPop').clear();
			$('#ruSvlnLclCdPop').setData({data : svlnLclCd_option_data});
			
			// 서비스회선 소분류
			var svlnSclCd_option_data =  [];
			var svlnSclCd2_option_data =  [];
			for(k=0; k<response.svlnSclCdList.length; k++){
				if(k==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
					svlnSclCd_option_data.push(dataFst);
					svlnSclCd2_option_data.push(dataFst);
				}
				var dataOption = response.svlnSclCdList[k]; 

				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataOption.cdFltrgVal) || "ALL" == nullToEmpty(dataOption.cdFltrgVal) ){
					svlnSclCd_option_data.push(dataOption);
				}
				svlnSclCd2_option_data.push(dataOption);
				
			}		
			svlnSclCdPopData = svlnSclCd2_option_data;	
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : svlnSclCd_option_data});			
			$('#ruSvlnSclCdPop').clear();
			$('#ruSvlnSclCdPop').setData({data : svlnSclCd_option_data});			
			
			// 서비스회선유형코드 셋팅
			svlnTypCdPopListCombo = response.svlnTypCdList;
			$('#svlnTypCdPop').clear();
			$('#svlnTypCdPop').setData({data : response.svlnTypCdList});
			$('#svlnTypCdPop').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#svlnTypCdPop').setSelected("");	
			
			if(paramData != null){
				// 20181105 RU 광코어 : 대표회선설정 - 서비스회선추가
				if(popChk == 'ruRpetr'&& paramData.svlnLclCd == '003' && paramData.svlnSclCd == '101'){		
					$('#ruSvlnLclCdPop').setData({ruSvlnLclCdPop : paramData.svlnLclCd  });
					$('#ruSvlnSclCdPop').setData({ruSvlnSclCdPop : paramData.svlnSclCd  });
					$('#ruFdfInfo').setData({ruFdfInfo : paramData.fstFdfNm  });
					$('#ruPortInfo').setData({ruPortInfo : paramData.fstFdfPortNm  });
					$('#ruSvlnLclCdPop').attr('disabled', 'true');
					$('#ruSvlnSclCdPop').attr('disabled', 'true');
				}else{
					$('#mgmtGrpCdPop').setData({mgmtGrpCd : paramData.mgmtGrpCd  });
		    		$('#svlnLclCdPop').setData({svlnLclCd : paramData.svlnLclCd  });
		    		//대분류가 파라미터로 넘어온경우, 소분류 필터링 
		    		if(paramData.svlnLclCd != '' && paramData.svlnLclCd != null ){
		    			changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop");
		    		}
		    		$('#svlnSclCdPop').setData({svlnSclCd : paramData.svlnSclCd  });
		    		$('#hdofcCdPop').setData({hdofcCd : paramData.hdofcCd  });
		    		$('#teamCdPop').setData({teamCd : paramData.teamCd  });
		    		$('#tmofCdPop').setData({tmofCd : paramData.tmofCd  });
		    		$('#mtsoPopCd').setData({mtsoCd : paramData.mtsoCd  });
		    		$('#mtsoPopNm').setData({mtsoNm : paramData.mtsoNm  });
		    		$('#svlnNoPop').setData({svlnNo : paramData.svlnNo  });
		    		$('#svlnNmPop').setData({svlnNm : paramData.svlnNm  });
		    		$('#uprIntgFcltsCdPop').setData({uprIntgFcltsCd : paramData.uprIntgFcltsCd  });
		    		$('#lowIntgFcltsCdPop').setData({lowIntgFcltsCd : paramData.lowIntgFcltsCd  });
		    		
		    		//청약화면에서 호출시 
		    		if(callUrl.indexOf("ANetworkApplicationReceiptRequestDetail") > -1){
		    			$('#notInSclCdList').setData({notInSclCdList : '103'  });
		    		}
		    		
		    		makeSvlnTypCdSelectBox("svlnSclCdPop", "svlnTypCdPop", svlnTypCdPopListCombo, "A");  // 서비스회선유형 selectbox 제어
		    		if ("003" == nullToEmpty(paramData.svlnLclCd) && "101" == nullToEmpty(paramData.svlnSclCd)) {
		    			$('.ruRepeater').show();
			    		$('#svlnTypCdPop').setData({svlnTypCd : paramData.svlnTypCd  });	
		    		} else {
		    			$('.ruRepeater').hide();
		    		}
		    		
	    			//통합시설코드가 파라미터로 넘어왔을경우 자동 조회
		    		if( (paramData.uprIntgFcltsCd != null && paramData.uprIntgFcltsCd != "" ) || (paramData.lowIntgFcltsCd != null && paramData.lowIntgFcltsCd != "" ) ){
		    			$('#btnPopSearch').click();
		    		}
				}
			}
		}      	
  
		
		if(flag == 'getOptlShreRepSvlnCnt') {
			var svlnInfo =  $('#' + gridResult).alopexGrid("dataGet", { _state : { focused : true }});
			//console.log(response);
			if(response.cnt > 0) {
				if(svlnInfo[0].lineGubun == "대표회선") {
					alertBox('I', svlnInfo[0].svlnNo + "은 다른회선의 대표회선 입니다.");
					return;
				}
				else if (svlnInfo[0].lineGubun == "광공유회선"){
					alertBox('I', svlnInfo[0].svlnNo + "은 대표회선이 존재합니다. <br/>대표회선 해지 후 진행하세요.");
					return;
				}
			}
			else {
				svlnInfo[0].optlShreRepSvlnNo = null;
				svlnInfo[0].editMd = "A";
				$a.close(svlnInfo);
			}
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop' || flag == 'searchPopForPageAdd'|| flag == 'getOptlShreRepSvlnCnt'){
    		//$('#'+gridResult).alopexGrid('hideProgress');
    		cflineHideProgress(gridResult);
    		//alert('조회 실패하였습니다.');
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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
    
    function setSPGrid(GridID ,Option ,Data) {
		if(Data.length == 0){
			//alert('조회된 데이터가 없습니다.');
			$('#'+GridID).alopexGrid("dataSet", Data);
			$('#'+GridID).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(Option.totalCnt);
					}}}
			);
		}else{
    		$('#'+GridID).alopexGrid("dataSet", Data);
    		//$("#total").html(response.pager.totalCnt);
    		$('#'+GridID).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(Option.totalCnt);
					}}}
			);
		}
		
		totalCnt = (nullToEmpty(Option.totalCnt) == "" ? 0 : Option.totalCnt);
	}    

    function svlnLnoInfoDivDisplay(svlnLclCdValue){
    	if(svlnLclCdValue == "004"){
    		$('#svlnLnoInfoDiv').css('display','');
    	}else{
    		$('#svlnLnoInfoDiv').css('display','none');
    	}
    }
    
  	// 서비스 회선 정보 팝업  S000011853400
	function showServiceLIneInfo2Pop(gridId, dataObj, sFlag) {
//console.log("==========================" + utrdMgmtNo );

		$a.popup({
			popid: "ServiceLIneInfoPop",
			title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/,
			url: '/tango-transmission-web/configmgmt/cfline/ServiceLineInfoPop.do',
			data: {"gridId":gridId,"ntwkLineNo":dataObj.svlnNo,"svlnLclCd":dataObj.svlnLclCd,"svlnSclCd":dataObj.svlnSclCd,"sFlag":sFlag, "utrdMgmtNo": utrdMgmtNo },
			iframe: true,
			modal : true,
			movable:true,
			width : 1340,
			height : window.innerHeight * 0.95
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
    }    
});