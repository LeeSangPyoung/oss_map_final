/**
 * VerificationRegistrationLineEte.js
 *
 * @author P096430
 * @date 2016. 7. 20. 오전 11:27:00
 * @version 1.0
 */

var m = {
			globalVar 	: {
							userId          :     parent.m.userInfo.userId     ,
							cstrCd          :     ""             ,
							tmpCnt          :     0              ,
							lnVrfClCd       :     "B"            , //선로검증분류코드 ETE
			                tabFlag         :      'tab1-1'      ,
			                execelDownFlag  :     'N',
			                skAfcoDivCd     : parent.m.userInfo.skAfcoDivCd,
			                bpId            : parent.m.userInfo.bpId
						   },
            page        : {
							pageNo1         :      1             ,
							rowPerPage1     :      30            ,
			                totalPageCnt1   :      0             ,
			                nextPageNo1     :      0             ,
			                totalCnt1       :      0             ,
							pageNo2         :      1             ,
							rowPerPage2     :      30            ,
			                totalPageCnt2   :      0             ,
			                nextPageNo2     :      0             ,
			                totalCnt2       :      0             
            			   },						   
			params    	: {},
			ajaxProp  	: [
				             {  // Search Cbnt Grid 
				            	url:'tango-transmission-gis-biz/transmission/gis/mgmtcstr/cstrsubm/getGisSetlCbntList',
				            	data:"",
				            	flag:'searchCbntGrid' // 0
				             },
				             {  // Search Ofd Grid 
				            	url:'tango-transmission-gis-biz/transmission/gis/mgmtcstr/cstrsubm/getGisSetlFdfList',
				            	data:"",
				            	flag:'searchOfdGrid' // 1
				             },
				             {  // Search Opinion
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineEteOpinion',
				            	data:"",
				            	flag:'searchOpinion' // 2
				             },
				             {  // Search Exemption Yn
				             	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineEteExemptionStatus',
				             	data:"",
				             	flag:'searchExemptionYn' // 3
				             },
				             {  // saveOpinion
				             	url:'tango-transmission-biz/transmission/constructprocess/verification/insertVerificationRegistrationLineEteOpinion',
				              	data:"",
				              	flag:'saveOpinion' // 4
				             },
				             {  // BP사 의견 및 검증제외 조회 
					            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpComment',
					            	data:"",
					            	flag:'BpCommentChk' // 5
				             },
				             {  // 배치 셋팅
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/setOndemandedExcelDownloadBatch/',
				            	data:"",
				            	flag:'setBatch' // 6 : 
				             },
				             {  // 배치 상태 조회
				            	url:'tango-transmission-biz/transmisson/constructprocess/common/excelBatchExecuteStatus/', // jobInstanceId
				            	data:"",
				            	flag:'searchBatchStatus' // 7 : 
				             }
			              ],
		responseData   : {},
	    message        : {},
	    label          : {},
	    error          : {},
	    userInfo       : {}
	};

var tangoAjaxModel = Tango.ajax.init({});


var localPage = $a.page(function() {
	
	if(parent.$('#cstrCd').val() != null && parent.$('#cstrCd').val() != "" && parent.$('#cstrCd').val() != undefined){
		m.globalVar.cstrCd = parent.$('#cstrCd').val();
	}
	
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {   	
    	initGrid();
    	m.params.cstrCd = m.globalVar.cstrCd;
    	m.params.lnVrfClCd = m.globalVar.lnVrfClCd;
    	m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
    	m.params.bpId = m.globalVar.bpId;
    	m.params.skGroup = 'SKT'; // GIS API 파라미터
    	
		callTangoAjax(0) // Search Cbnt Grid
		callTangoAjax(2) // Search Opinion
		setEventListener();
    
    };
    
  //Grid 초기화
    function initGrid() {
    	 $('#cbntGrid').alopexGrid({
    		height: 400,
    		autoColumnIndex: true,
    		autoResize: true,
    		paging : { pagerTotal: true },
    		defaultColumnMapping:{
    			sorting: true
			},
		    rowOption:{
		    	defaultHeight:30
		    },
			columnMapping : [
			                    { key : 'cnptSkMgmtNo'    , title : 'SK관리번호'       },
								{ key : 'cnptUnqMgmtNo'   , title : '고유관리번호'     },
								{ key : 'layrNm'          , title : '레이어명'         ,align : 'left'},
								{ key : 'grenCbntNm'      , title : '그린함체'         },
								{ key : 'cnntCnt'         , title : '접속수량'         },
								{ key : 'insSystmClNm'    , title : '입력T/B'              },
								{ key : 'insCblVal'       , title : '입력케이블'   ,width : '400px'    ,align : 'left'},
								{ key : 'insCoreNo'       , title : '입력코어'         },
								{ key : 'prtSystmClNm'    , title : '출력T/B'              },
								{ key : 'prtCblVal'       , title : '출력케이블'   ,width : '400px'    ,align : 'left'},
								{ key : 'prtCoreNo'       , title : '출력코어'         },
								{ key : 'coreUseYnNm'     , title : '사용여부'         },
								{ key : 'fildOprrNm'      , title : '현장작업자'       },
								{ key : 'fildFnshDate'    , title : '현장작업완료일'   },
								{ key : 'grenTypNm'       , title : '그린코어'         },
								{ key : 'optlDttnYn'      , title : '광검출여부'       },
								{ key : 'coreCnntRmk'     , title : '함체접속비고'  ,width : '200px'   ,align : 'left'},
								{ key : 'uprMtsoNm'       , title : '시작국사'     ,width : '200px'    ,align : 'left'},
								{ key : 'lowMtsoNm'       , title : '종료국사'      ,width : '200px'   ,align : 'left'},
								{ key : 'mtsoUseCtt'      , title : 'FDF접속비고'   ,width : '200px'   ,align : 'left'},
								{ key : 'eteStatVal'      , title : 'ETE상태'          },
								{ key : 'setlRmk'         , title : '사유'         ,width : '200px'    ,align : 'left'},
								{ key : 'wkrtNo'          , title : '작업지시번호'     },
								{ key : 'insDate'         , title : '입력일자'         },
								{ key : 'insUserNm'       , title : '입력자'           },
								{ key : 'editDate'        , title : '수정일자'         },
								{ key : 'editUserNm'      , title : '수정자'           }
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+parent.m.message.noData+"</div>"
			}
    	});
  		
    	 $('#ofdGrid').alopexGrid({
     		height: 400,
    		autoColumnIndex: true,
    		autoResize: true,
    		paging : { pagerTotal: true },
    		defaultColumnMapping:{
    			sorting: true
			},
		    rowOption:{
		    	defaultHeight:30
		    },
			columnMapping : [
								{ key : 'mtsoSkMgmtNo'            , title : 'SK관리번호'      },
								{ key : 'mtsoFcltNm'              , title : '국사명'          ,align : 'left'},
								{ key : 'layrNm'                  , title : '레이어명'        ,align : 'left'},
								{ key : 'grenTypCd'               , title : '그린FDF'         },
								{ key : 'cnntCnt'                 , title : '접속수량'        ,align : 'right'},
								{ key : 'rackNo'                  , title : 'RACK'            },
								{ key : 'shlfNo'                  , title : 'SHELF'           },
								{ key : 'portNo'                  , title : 'PORT'            },
								{ key : 'insSystmClNm'            , title : '입력T/B'             },
								{ key : 'insCblVal'               , title : '입력케이블'  ,width : '400px'    ,align : 'left'},
								{ key : 'insCoreNo'               , title : '입력코어'        },
								{ key : 'prtSystmClNm'            , title : '출력T/B'             },
								{ key : 'prtCblVal'               , title : '출력케이블'  ,width : '400px'    ,align : 'left'},
								{ key : 'prtCoreNo'               , title : '출력코어'        },
								{ key : 'useYnNm'                 , title : '사용여부'        },
								{ key : 'patchYn'                 , title : '패치정보'        },
								{ key : 'sprCoreYnNm'             , title : '예비코어여부'    },
								{ key : 'grenCbntFildChkrNm'      , title : '현장작업자'      },
								{ key : 'grenCoreFildChfDate'     , title : '현장작업완료일'  },
								{ key : 'grenTypNm'               , title : '그린코어'      ,width : '150px'    },
								{ key : 'optlDttnYn'              , title : '광검출여부'      },
								{ key : 'setlRmk'                 , title : 'FDF접속비고'   ,width : '200px'  ,align : 'left'},
								{ key : 'fwdMtsoFcltNm'           , title : '종료국사'      ,width : '200px'  ,align : 'left'},
								{ key : 'eteStatVal'              , title : 'ETE상태'         },
								{ key : 'eteSetlRmk'              , title : '사유'         ,width : '200px'  ,align : 'left'},
								{ key : 'wkrtNo'                  , title : '작업지시번호'    },
								{ key : 'insDate'                 , title : '입력일자'        },
								{ key : 'insUserNm'               , title : '입력자'          },
								{ key : 'editDate'                , title : '수정일자'        },
								{ key : 'editUserNm'              , title : '수정자'          }
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+parent.m.message.noData+"</div>"
			}
    	});    	

    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }    
    
    function setEventListener() { 	
    	
    	  	// EXCEL
    	  	$('#VerificationRegistrationLineEteBtnExportExcel').on('click', function(e) {
    	  		
    	  		var gridData;
    	  		if(m.globalVar.tabFlag == 'tab1-1'){
    	  			gridData = AlopexGrid.trimData($('#cbntGrid').alopexGrid('dataGet'));
    	  			
        	  		if(gridData.length > 0){
        	  	  		var worker = new ExcelWorker({
        	  	    		excelFileName : '함체선번_' + m.globalVar.cstrCd,
        	  	    		sheetList : [{
        	  	    			sheetName : '함체선번',
        	  	    			$grid : $('#cbntGrid')
        	  	    		}]
        	  	    	});
        	  	    	worker.export({
        	  	    		useGridColumnWidth : true,
        	  	    		border : true
        	  	    	});  
        	  		}else{
        	  			callMsgBox("", 'I', "조회된 데이터가 없습니다. ");
        	  		}
        	  		
    	  		}else{
    	  			gridData = AlopexGrid.trimData($('#ofdGrid').alopexGrid('dataGet'));
    	  			
        	  		if(gridData.length > 0){
        	  	  		var worker = new ExcelWorker({
        	  	    		excelFileName : 'OFD선번_' + m.globalVar.cstrCd,
        	  	    		sheetList : [{
        	  	    			sheetName : 'OFD선번',
        	  	    			$grid : $('#ofdGrid')
        	  	    		}]
        	  	    	});
        	  	    	worker.export({
        	  	    		useGridColumnWidth : true,
        	  	    		border : true
        	  	    	});  
        	  		}else{
        	  			callMsgBox("", 'I', "조회된 데이터가 없습니다. ");
        	  		}    	  			
    	  		}
    	  	});
    	  	
         
    	 // 저장버튼 클릭시
     	 $('#VerificationRegistrationLineEteSaveBtn').on('click',function(){
     		if(m.globalVar.cstrCd == null || m.globalVar.cstrCd == ""){
     			return false;
     		}
     		
     		if($('.Radio').getValue() == null){
     			parent.callMsgBox('','I', parent.m.message.choiceVerificationResult); // 검증결과를 선택해주세요
     		}else{
     			if($('.Radio').getValue() == "N" && $('#vrfOponCtt').val() == ""){
     				parent.callMsgBox('','I', parent.m.message.vrfOppnCttValidation); // 불량시 의견은 필수 입니다.
     			}else{
     				callTangoAjax(5);
     			}
     		}
     	 });
    	 
     	 // Cbnt Tab Click
    	 $('#cbntTab').on('click',function(e){
    		 $('#cbntGrid').alopexGrid('viewUpdate');
    		m.globalVar.tabFlag = 'tab1-1';
    		m.page.pageNo2 = 1;
     		$('#ofdGrid').alopexGrid('dataEmpty');
     		$('#cbntGrid').alopexGrid('showProgress');
    		callTangoAjax(0);    	        
    	 });
    	 
    	// Ofd Tab Click
    	 $('#ofdTab').on('click',function(e){
    		 $('#ofdGrid').alopexGrid('viewUpdate');
     		m.globalVar.tabFlag = 'tab1-2';
     		m.page.pageNo1 = 1;
     		$('#cbntGrid').alopexGrid('dataEmpty');
     		$('#ofdGrid').alopexGrid('showProgress');
     		callTangoAjax(1);
     	 });
    	 
	};
	
	//request 성공시
	function successFn(response, status, jqxhr, flag){
		switch (flag) {
		case 'searchCbntGrid':
			if(response.cbntList != null && response.cbntList != ""){
				$('#cbntGrid').alopexGrid('dataSet', response.cbntList);
			}
			
			$('#cbntGrid').alopexGrid('hideProgress');
			
			break;
			
		case 'searchOfdGrid':
			if(response.fdfList != null && response.fdfList != ""){
				$('#ofdGrid').alopexGrid('dataSet', response.fdfList);
			}

			$('#ofdGrid').alopexGrid('hideProgress');
			
			break;	
			
		case 'searchOpinion':
			if(response.VerificationRegistrationLineEteOpinion != null && response.VerificationRegistrationLineEteOpinion != "" ){				
				$('tbody').setData(response.VerificationRegistrationLineEteOpinion);
			}
			
    		callTangoAjax(3) // Search Exemption Yn
    		
			break;
			
		case 'searchExemptionYn':
			
			if(response.VerificationRegistrationLineEteExemptionStatus != null && response.VerificationRegistrationLineEteExemptionStatus != "" ){
				
				parent.m.globalVar.eteVrfWoYn = response.VerificationRegistrationLineEteExemptionStatus.eteVrfWoYn;
				
		    	if( // parent.m.globalVar.bpYn == "Y" ||  // BP사 여부 체크 안함
		    	   parent.m.globalVar.vcYn == "N" ||  // not Verification Center!! 
		    	   response.VerificationRegistrationLineEteExemptionStatus.eteVrfWoYn == 'Y'|| // ETE Except
		    	   response.VerificationRegistrationLineEteExemptionStatus.vrfObjYn == "N" ||  // Verification Target 
		    	   (response.VerificationRegistrationLineEteExemptionStatus.vrfFnshDt != null && 
					response.VerificationRegistrationLineEteExemptionStatus.vrfFnshDt != ""     ) // Verification Complete
					){
					$('.Radio').setEnabled(false);
					$('#vrfOponCtt').setEnabled(false);
					$('#VerificationRegistrationLineEteSaveBtn' ).setEnabled(false);
		    	}else{
					$('#VerificationRegistrationLineEteSaveBtn' ).setEnabled(true);
		    	}
			}else{
				$('.Radio').setEnabled(false);
				$('#vrfOponCtt').setEnabled(false);
				$('#VerificationRegistrationLineEteSaveBtn' ).setEnabled(false);
			}
			break;
			
		case 'saveOpinion':
			
			div_msg_1.style.display = "";
			setTimeout("div_msg_1.style.display = 'none'", 1100);
			
			break;
		case 'BpCommentChk':
    		if(response.BpCommentInfo != null && response.BpCommentInfo != ""){
				if(parent.m.globalVar.vrfObjYn != response.BpCommentInfo.vrfObjYn){
					parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationTargetInfomation,messageCallback); // 검증대상정보가 변경 되었습니다.
				}else if(parent.m.globalVar.vrfFnshDt != response.BpCommentInfo.vrfFnshDt){
					parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationCompletionInfomation,messageCallback); // 검증완료정보가 변경 되었습니다.
				}else{
					messageCallback("save_btn", "Y");
				}
    		}else{
    			parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationCompletionInfomation,messageCallback); // 검증완료정보가 변경 되었습니다.
    		}
			
			break;
		}
    }
    
	function failFn(response, status, jqxhr, flag){
		parent.parent.callMsgBox('','W', response.message);
    }
    
    function callTangoAjax(i){
    	
    	var url = m.ajaxProp[i].url;

    	if(i==2){
    		m.ajaxProp[i].url = url+'/'+m.params.cstrCd+'/'+m.params.lnVrfClCd
    	}else if(i==3 || i==4 || i==5){
    		m.ajaxProp[i].url = url+'/'+m.params.cstrCd
    	}else if(i==6){
    		m.ajaxProp[i].url = url+m.globalVar.execelDownFlag; // cbnt,ofd 구분
    	}

    	m.ajaxProp[i].data = m.params;
    	     if(i == 0){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Cbnt Grid
    	else if(i == 1){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Ofd Grid
    	else if(i == 2){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // Search Opinion
    	else if(i == 3){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // Search Exemption Yn
    	else if(i == 4){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn); } // saveOpinion
    	else if(i == 5){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // BpCommentChk
    	else if(i == 6){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // setBatch    
    	
    	m.ajaxProp[i].url = url;    	     
    	     
    } // callTangoAjax()

	function messageCallback(msgId, msgRst){
		
		switch (msgId) {

		case 'save_btn':
			if(msgRst == 'Y'){
	     		
	     		m.params = $('tbody').getData(); 
	     		m.params.cstrCd = m.globalVar.cstrCd;
	     		m.params.lnVrfClCd = m.globalVar.lnVrfClCd;
	     		m.params.lastChgUserId = m.globalVar.userId;
	     		m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
	        	m.params.skGroup = 'SKT'; // GIS API 파라미터
	     		
	     		callTangoAjax(4) // Save Opinion
	     		
			}
			break;
		case "BpCommentChk":
			if(msgRst == "Y"){
				parent.location.reload(true);
			}
			break;
		}
	};
	
	this.call = function (){
		callTangoAjax(0);
	}
	
	
    
});