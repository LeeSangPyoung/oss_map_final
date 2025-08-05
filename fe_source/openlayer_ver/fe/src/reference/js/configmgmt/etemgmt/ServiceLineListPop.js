/**
 * ServiceLineListPop.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var gridResult = 'resultListGrid';
var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터
var paramData = null;
var selectDataObj = null;
var utrdMgmtNo = "";
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
	 

	
    this.init = function(id, param) {
    	//if (! jQuery.isEmptyObject(param) ) {
    		paramData = param;
    		if(typeof param.utrdMgmtNo != "undefined"){
    			utrdMgmtNo = param.utrdMgmtNo;
    		}
    	//} 
    	//createMgmtGrpCheckBox("mgmtGrpCdCheckAreaPop", "mgmtGrpCd");	// 관리 그룹 체크 박스 생성
    	createMgmtGrpSelectBox ("mgmtGrpCdPop", "S", "SKB");  // 관리 그룹 selectBox	
    	//createMgmtGrpSelectBox ("mgmtGrpCdPop", "A");  // 관리 그룹 selectBox
    	initGrid();
    	setSelectCode();
        setEventListener();   

        

    };
    
  //Grid 초기화
    function initGrid() {
    	
        //그리드 생성
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
			height : 550,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [//{ selectorColumn : true, width : '50px' } , 
	         {key : 'svlnNo'	              	,title : cflineMsgArray['serviceLineNumber'] /* 서비스회선번호 */			,align:'center', width: '150px'}
	        , {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '280px'}
	        , {key : 'svlnLclCdNm'	            ,title : cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '150px'}
	        , {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '150px'}
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
			              ]                                                                       
			                      }); 
    	


        //gridHide();
        
        $('#'+gridResult).on('scrollBottom', function(e){
    		    		
    		var nFirstRowIndex =parseInt($("#firstRowIndexPop").val()) + 20; 
    		$("#firstRowIndex").val(nFirstRowIndex);
    		var nLastRowIndex =parseInt($("#lastRowIndexPop").val()) + 20;
    		$("#lastRowIndex").val(nLastRowIndex);    		

        	var dataParam =  $("#searchPopForm").serialize(); 

    		//var dataParam =  $("#searchForm").getData();  
    		//dataParam.firstRowIndex = nFirstRowIndex;
        	//dataParam.lastRowIndex = nLastRowIndex;        	

        	/*dataParam.scFrstRegDateStart = $("#scFrstRegDateStart").getData().scFrstRegDateStart;
        	dataParam.scFrstRegDateEnd = $("#scFrstRegDateEnd").getData().scFrstRegDateEnd;*/
        	//$('#'+gridResult).alopexGrid('showProgress'); 
        	cflineShowProgress(gridResult);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelistpop', dataParam, 'GET', 'searchPopForPageAdd');
    		
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
			$("#lastRowIndexPop").val(20);
			var param =  $("#searchPopForm").serialize();
			//var param =  $("#searchPopForm").getData(); 
    		console.log(param);
			cflineShowProgress(gridResult);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelistpop', param, 'GET', 'searchPop');  	   		
        });

    	// 관리그룹 클릭시
//        $(':checkbox[name="mgmtGrpCd"]').on("click",function(){
//        	changeMgmtGrp("mgmtGrpCd", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
//      	});    	
    	$('#mgmtGrpCdPop').on('change',function(e){
    		changeMgmtGrp("mgmtGrpCdPop", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
    		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어 	
      	});    	 
    	// 서비스회선대분류코드 선택시
    	$('#svlnLclCdPop').on('change', function(e){   		
    		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어
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
// 		$('#'+gridResult).on('dblclick', '.bodycell', function(e){
// 			 var dataObj = AlopexGrid.parseEvent(e).data;
//			 //var element =  $('#' + gridResult).alopexGrid("dataGet", { _state : { selected : true }});
// 			 var tmpList = [dataObj];
//			 $a.close(tmpList);
//	    }); 
 		// 그리드 클릭
 		$('#'+gridResult).on('click', function(e){
			 var dataObj = AlopexGrid.parseEvent(e).data;
			 selectDataObj = dataObj;
			 svlnLnoInfoDivDisplay(dataObj.svlnLclCd);   // 선번조회버튼제어
			 
	    });  		
	 	
		// 서비스회선 선번 조회버튼 클릭
		$('#btnSvlnLnoInfoPop').on('click', function(e) {
			if(selectDataObj == null){
	   			alertBox('W', cflineMsgArray['selectNoData']); /*  선택된 데이터가 없습니다. */	   			
	   			return;				
			}
    		showServiceLIneInfoPop(gridResult, selectDataObj, "N");
			
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
			$('#svlnLclCdPop').clear();
			$('#svlnLclCdPop').setData({data : response.svlnLclCdList});
			$('#svlnLclCdPop').prepend('<option value="">' + cflineCommMsgArray['all'] /* 전체 */ + '</option>');
			//가입자망회선 선택
			$('#svlnLclCdPop').setSelected("004");
			
//			svlnSclCdPopData = response.svlnSclCdList;
//			$('#svlnSclCdPop').clear();
//			$('#svlnSclCdPop').setData({data : svlnSclCdPopData});
			
			var svlnSclCd_pop_option_data =  [];
			for(k=0; k<response.svlnSclCdList.length; k++){
				if(k==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all'] /* 전체 */};
					svlnSclCd_pop_option_data.push(dataFst);
				}
				var dataOption = response.svlnSclCdList[k];  
				svlnSclCd_pop_option_data.push(dataOption);
			}		
			svlnSclCdPopData = svlnSclCd_pop_option_data;	
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : svlnSclCdPopData});		
			if(paramData != null){
				$('#mgmtGrpCdPop').setData({mgmtGrpCd : paramData.mgmtGrpCd  });
	    		$('#svlnLclCdPop').setData({svlnLclCd : paramData.svlnLclCd  });
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
    			//$('#schTabPop').hide();  //
	    		console.log(paramData);
	    		$('#btnPopSearch').click(); 
			}
		}      	
  
		
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop' || flag == 'searchPopForPageAdd'){
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
	}    

    function svlnLnoInfoDivDisplay(svlnLclCdValue){
    	if(svlnLclCdValue == "004"){
    		$('#svlnLnoInfoDiv').css('display','');
    	}else{
    		$('#svlnLnoInfoDiv').css('display','none');
    	}
    }
    
  	// 서비스 회선 정보 팝업  S000011853400
	function showServiceLIneInfoPop(gridId, dataObj, sFlag) {
//console.log("==========================" + utrdMgmtNo );

		$a.popup({
			popid: "ServiceLIneInfoPop",
			title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/,
			url: '/tango-transmission-web/configmgmt/etemgmt/ServiceLineInfoPop.do',
			data: {
				"gridId":gridId,
				"ntwkLineNo":dataObj.svlnNo,
				"svlnLclCd":dataObj.svlnLclCd,
				"svlnSclCd":dataObj.svlnSclCd,
				"sFlag":sFlag, 
				"utrdMgmtNo": utrdMgmtNo 
			},
			iframe: false,
            windowpopup:true,
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