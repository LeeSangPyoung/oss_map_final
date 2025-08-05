/**
 * RingWritePop.js
 *
 * @author P100702
 * @date 2016. 10. 27. 
 * @version 1.0
 *  
 * 
 ************* 수정이력 ************
 * 2018-04-09  1. [수정] 5GPON 링명 작성규칙
 *                기준 : 한글영문(5자리)_5GPONC##(숫자2자리)링
 * 2018-12-11  2. [수정] SMUX 링명 작성규칙
 *                기준 : 한글영문숫자(5자리)_SMUXXXX링
 * 2019-01-08  3. [수정] 5GPON 링명 작성규칙
 *                기준 : 한글영문(5자리)_5GPONCxx(x2자리 혹은 숫자2자리)링 / 한글영문(5자리)_5GPON2Cxx(x2자리 혹은 숫자2자리)링
 * 2019-02-21  4. [수정] 5GPON 링명 작성규칙 2.0 망종류코드추가 : 036 로 명명규칙 변경
 * 				  기준 : 한글영문(5자리)_5GPONCxx(x2자리 혹은 숫자2자리)링 / 한글영문(5자리)_5GPON2Cxx(x2자리 혹은 숫자2자리)링
 * 
 * 2020-03-25 9. [수정] 5GPON 링명 작성규칙 2.0 망종류코드추가 : 036 로 명명규칙 변경
 * 				  기준 : (지)한글영문(5자리)_5GPONCxx(x2자리 혹은 숫자2자리)링 or 한글영문(7자리)_5GPON2Cxx(x2자리 혹은 숫자2자리)링
 * 2020-06-25 10. [수정] SMUX 링명 작성규칙 COT장비국소명 자릿수, SMUX외 CMUX추가 변경
 * 				  기준 : COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX)xxx(x3자리 혹은 숫자3자리)링
 * 2020-08-26 11. [수정] BCMUX(040)/CWDM-MUX(041) 링명 작성규칙
 * 				  기준 : BCMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)+(함체)
 *                      CWMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)
 * 2020-10-19  13. [수정] LMUX 링명작성규칙포함
 *                기준 : COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX,LMUX)A,B(앞뒤구분자)xxx(x3자리 혹은 숫자3자리)링
 *                LMUX의 경우 채널값(4), (8) 등의 문자,숫자도 포함가능 - 필수아님
 *                확장형, 기본형등 MUX뒤에 BA,EX등 영문자2자리수 포함 가능
 *                
 * 2021-10-27  14. [수정] 5GPON 링명 작성규칙 3.1 망종류코드추가 : 042 로 명명규칙 변경
 * 				  기준 : (지)한글영문숫자(5자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-xx(x2자리 혹은 숫자2자리)링 or 한글영문숫자(7자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-(x2자리 혹은 숫자2자리)링 
 *  
 * 2022-05-17  15. [추가] 기간망링을 등록시에는 OTDR연동방식값을 등록할수 있도록 추가 
 * 2022-06-13  16. [수정] MESH, PTP링의 국사명에 숫자등록 가능하도록 개선 
 * 2024-11-13  17. [추가] 4G-LMUX링 등록되도록 링명 작성규칙 추가
 *                기준 : LMUX앞에 "4G_" 문자 추가되도 등록가능 
 */  
$a.page(function() {
	
	var paramFormData = null;
	var params = null;
	var gridId = 'writeGrid'; 
	
	var sTopoLclCd = "001";		/* 토폴로지대분류코드 */
	//var sTopoSclCd = "000";	/* 토폴로지소분류코드 */
	
	var sMgmtGrpCd = "";		/* 관리그룹 통일 변수 */
	var sMgmtGrpNm = "SKT";

	var C00188Data = [];		/* 관리구분데이터 */
	var TmofAllData = [];		/* 전송실 데이터 :	SKT,SKB */
	var TmofSktData = [];		/* 전송실 데이터 :	SKT */
	var TmofSkbData = [];		/* 전송실 데이터 :	SKB */
	var C00223Data  = [];      /*절체방식 데이터*/
	var C00194Data  = [];     /*용량 데이터*/
	var C02501Data  = [];
	var C02533Data  = [];     /* OTDR연동방식 */
	var userMgmtCd = "";
	var userJrdtTmofInfoPop = "";
	var ntwkTypData = {}; /* 망구분데이터 */
	var topoCdListCombo = null;
	
	var result ="";
	var uprMgmtGrpNm = "";
	var lowMgmtGrpNm = "";
	var uprTmofOrgId = "";
	var uprTmofTeamId = "";
	var lowTmofOrgId = "";
	var lowTmofTeamId = "";
 	var tmofOrgId = "";
 	var tmofTeamId = "";
 	
 	var pageMakeEnd = "N"; /* page road 완료시 Y로 변경*/
	
	this.init = function(id, param){
		createMgmtGrpSelectBox ("mgmtGrpCd", "A");
		setSelectCode();
		initGrid();
		setEventListener();
    	$('#popRepNtwkLineNm').setEnabled(false);
    	userMgmtCd = param.userMgmtCd;

    	userJrdtTmofInfoPop = "";
	};	
	
	//Grid 초기화
	function initGrid() {
		var mappingEqp = [{selectorColumn : true, width : '40px'},
		                  {key : 'mgmtGrpCd', align:'center', width:'70px', title : cflineMsgArray['managementGroup'] /*관리그룹*/,	   						
							render : {
								type : 'string',
								rule : function(value, data) {
									var render_data = [];
									if (C00188Data.length > 1) {
										render_data = render_data.concat(C00188Data);
									}
									else {
										render_data = render_data.concat({value : data.mgmtGrpCd, text : data.mgmtGrpNm});
									}
									return render_data;
								}
							},
							editable : {
								type : 'select',
			      	    		rule : function(value, data){
			      	    			return C00188Data;
			      	    		}, 
			      	    		attr : {
		  			 				style : "width: 60px;min-width:60px;padding: 2px 2px;"
		  			 			}
		      	    		},
							editedValue : function(cell) {
								return $(cell).find('select option').filter(':selected').val();
							}
		      	    		,tooltip : false
		                  }
						   ,{key : 'tmofId', aign : 'center', width : '280px', title : cflineMsgArray['transmissionOffice'] /*전송실*/,
							render : {
								type : 'string',
								rule : function(value, data) {
									var render_data = [];
									var currentData = AlopexGrid.currentData(data);
									if(currentData.mgmtGrpCd == "0001") {
										render_data = TmofSktData;
									}else {
										render_data = TmofSkbData;
									}
									return render_data;
								}
						   },
							editable : {
								type : 'select',
								rule : function(value, data) {
									var render_data = [];
									var currentData = AlopexGrid.currentData(data);
									if(currentData.mgmtGrpCd == "0001") {
										render_data = TmofSktData;
									}else {
										render_data = TmofSkbData;
									}
									return render_data;
								}, 
			      	    		attr : {
		  			 				style : "width: 290px;min-width:290px;padding: 2px 2px;"
		  			 			}
							},
							editedValue : function(cell) {
								return $(cell).find('select option').filter(':selected').val();
							}
							, tooltip : false
							, refreshBy: 'mgmtGrpCd'
						   },
						   {key : 'mtsoId'	, title : cflineMsgArray['mobileTelephoneSwitchingOfficeCode'] /*국사코드*/ , align:'center', width: '50px'
		   						, render : function(value, data) {
		   							if(nullToEmpty(value) == ""){
		   								return (nullToEmpty(data.mtsoId) == "") ? "" : data.mtsoId;
		   							}else{  
		   								return value;
		   							}
		   						}
						   		, hidden: true
		   			       }
						  , {key : 'mtsoNm'	, title : cflineMsgArray['mobileTelephoneSwitchingOfficeName']/*국사명*/ , align:'left', width: '400px'
							  	, render : function(value, data) {
		   							var celStr = cflineMsgArray['mobileTelephoneSwitchingOfficeName']/*국사명*/;
		   							if(nullToEmpty(value) == ""){
		   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
		   							}else{  
		   								celStr = value;
		   							}
		   							return celStr;
		   						}
						  		, editable:  { type: 'text' }
						  		, refreshBy : function(previousValue, changedValue, changedKey, changedData, changedColumnMapping){
						  			if(changedKey == "mgmtGrpCd" || changedKey == "tmofId"){
						  				var mtsoNmIndex = $('#'+ gridId).alopexGrid("columnGet",{key:'mtsoNm'})[0].columnIndex;
						  				changedData.mtsoId = "";
						  				changedData._state["editing"][mtsoNmIndex] = "";
						  				return true;
						  			}else{ 
						  				return false;
						  			}
						  		}
//		   			          	, styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}	   			        	  
		   			          }
						  , {key : 'mtsoNmbtn',value : function(value, data) {return null;}, width: '40px',render : {type : 'btnMtsoGridSch'} 
		   			        }
		                  ];
    	// 그리드 생성
        $('#'+ gridId).alopexGrid({
        	pager : false,
        	autoColumnIndex: true,
        	columnMapping : mappingEqp,
        	cellSelectable : false,
        	rowClickSelect : true,
        	rowInlineEdit : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero : false,
        	height : 200,
            headerGroup : [
    		               {fromIndex:"mtsoNm", toIndex:"mtsoNmbtn", title: cflineMsgArray['mobileTelephoneSwitchingOfficeName'] , hideSubTitle:true},
    		],
            renderMapping : {
    			"btnMtsoGridSch" : {
    				renderer : function(value, data, render, mapping) {
    				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnMtsoGridSch" type="button"></button></div>';
    	            }
    			}
    		}
        });
    };    
    
    function setSelectCode() {
    	cflineShowProgressBody();
    	var param = {"userMgmtNm": "SKT"};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188Data');	// 관리그룹 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00223', null, 'GET', 'C00223Data');	// 절체방식 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypTopoCode', null, 'GET', 'getNtwkTypTopoCode');	// 망구분 망종류 콤보데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data');	// 용량 데이터 
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02501', null, 'GET', 'C02501Data'); // 토폴로지구성방식
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02533', null, 'GET', 'C02533Data');	// OTDR연동방식
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'TmofSktData');	// 전송실데이터:SKT
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030002', null, 'GET', 'TmofSkbData');	// 전송실데이터:SKB
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'TmofAllData');	// 전송실데이터:SKB
    	

    	// 팝업용 사용자관할전송실
    	searchUserJrdtTmofInfoPop("popMgmtGrpCd");    	
    	
    }
    function setEventListener() {
    	//관리그룹 변경설정
    	$('#popMgmtGrpCd').on('change',function(e){
    		sMgmtGrpCd = $("#popMgmtGrpCd").val();
    		if(sMgmtGrpCd == "0001"){
    			sMgmtGrpNm = "SKT";    			       		
        		$("#popNtwkCapaCd").parent().parent().prev().children('label').show();  // 용량
        		$("#popNtwkCapaCd").parent().show();
        		$("#popRingSwchgMeansCd").parent().parent().prev().children('label').show();  //절체방식
        		$("#popRingSwchgMeansCd").parent().show();
    			$('#popNtwkTypCd').clear();
        		$('#popNtwkTypCd').setData({data : ntwkTypData.ntwkTypCdListSkt});
    		}else if(sMgmtGrpCd == "0002"){
    			sMgmtGrpNm = "SKB";
        		$('#popUprTmofId').clear();  // 상위국사
        		$('#popUprTmofId').setData({data : TmofSkbData});
        		$('#popLowTmofId').clear();  // 하위국사
        		$('#popLowTmofId').setData({data : TmofSkbData});
    			$('#popNtwkTypCd').clear();
        		$('#popNtwkTypCd').setData({data : ntwkTypData.ntwkTypCdListSkb});
    			
    		}
    		
    		//$('#popMgmtGrpCd').setEnabled(false);  // ADAMS 연동 고도화
    		
    		$('#popUprOwnCd').setSelected($('#popMgmtGrpCd').val());    		
    		$('#popLowOwnCd').setSelected($('#popMgmtGrpCd').val());
    		
    		changeTopoCdBox();
      	}); 
    	$('#popUprOwnCd').on('change',function(e){
    		var uprOwnCd = $('#popUprOwnCd').val();
    		if(uprOwnCd == "0001"){
	    		$('#popUprTmofId').clear();   // 상위국사
	    		$('#popUprTmofId').setData({data : TmofSktData});	 
	    		uprMgmtGrpNm = 'SKT';
    		}else if(uprOwnCd == "0002"){
    			$('#popUprTmofId').clear();   // 상위국사
	    		$('#popUprTmofId').setData({data : TmofSkbData});
	    		uprMgmtGrpNm = 'SKB';
    		}
    		$('#popUprTmofId').setSelected("");   
    	});
    	$('#popLowOwnCd').on('change',function(e){
    		var lowOwnCd = $('#popLowOwnCd').val();
    		if(lowOwnCd == "0001"){
	    		$('#popLowTmofId').clear();  // 하위국사
	    		$('#popLowTmofId').setData({data : TmofSktData});
	    		lowMgmtGrpNm = 'SKT';
    		}else if(lowOwnCd == "0002"){
    			$('#popLowTmofId').clear();  // 하위국사
	    		$('#popLowTmofId').setData({data : TmofSkbData});
	    		lowMgmtGrpNm = 'SKB';
    		}
    		$('#popLowTmofId').setSelected("");    
    	});
    	
    	//망구분이 바귈때
    	$('#popNtwkTypCd').on('change',function(e){
    		if(sMgmtGrpNm != "SKB"){
        		changeTopoCdBox();
    		}
    	}); 
    	// 상위국사 전송실 선택
    	$('#popUprTmofId').on('change',function(e){
    		$('#popUprMtsoNm').val("");
    		$('#popUprMtsoId').val("");
    		getOrg( $('#popUprTmofId').val(),"upr");
    	});
    	// 하위국사 전송실 선택
    	$('#popLowTmofId').on('change',function(e){
    		$('#popLowMtsoNm').val("");
    		$('#popLowMtsoId').val("");
    		getOrg( $('#popLowTmofId').val(),"low");    		
    	});
    	
    	// 상위국 국사찾기
    	$('#btnUpMtsoSch').on('click', function(e) {
    		var mgmtGrpNm = $('#popUprOwnCd').val();
    		var tmofId = $('#popUprTmofId').val();
    		var mtsoNm = $('#popUprMtsoNm').val();
    		searchMtso("upr", uprMgmtGrpNm, tmofId, mtsoNm);
		});
    	// 하위국 국사찾기
    	$('#btnLowMtsoSch').on('click', function(e) {
    		var mgmtGrpNm = $('#popLowOwnCd').val();
    		var tmofId = $('#popLowTmofId').val();
    		var mtsoNm = $('#popLowMtsoNm').val();
    		searchMtso("low", lowMgmtGrpNm, tmofId, mtsoNm);
		});
    	
    	$('#popTopoSclCd').on('change', function(e){
    		$('#popLowMtsoNm').val("");
    		$('#popLowMtsoId').val("");
    		$('#popUprMtsoNm').val("");
    		$('#popUprMtsoId').val("");
    		$('#popUprOwnCd').setSelected($('#popMgmtGrpCd').val());    		
    		$('#popLowOwnCd').setSelected($('#popMgmtGrpCd').val());
        	var topoCfgMeansCd = getTopoCfgMeansCd($('#popTopoSclCd').val());
        	$('#popTopoCfgMeansCd').setSelected(topoCfgMeansCd);
    		if($('#popTopoSclCd').val() == '031' ) {
    			// 망종류가 가입자망링인 경우 상하위 모두 관리그룹 선택 가능하도록 수정
    	    	$('#popRepNtwkLineNm').setEnabled(true);	
    		} else {
    			$('#popRepNtwkLineNm').val("");
    			$('#popRepNtwkLineNo').val("");
    	    	$('#popRepNtwkLineNm').setEnabled(false);
    		}
    	});
    	
    	// 망종류가 가입자망링이 아닌 경우
    	// 휘더망링 : 링 검색 팝업
    	$('#btnRepNtwkLineNmSch').on('click', function(e) {
    		if($('#popTopoSclCd').val() == '031'){
    			var param = {"vTmofInfo" : '', "ntwkLineNm" : $('#popRepNtwkLineNm').val(), "topoSclCd" : '030'};
    			var urlPath = $('#ctx').val();
    			if(nullToEmpty(urlPath) ==""){
    				urlPath = "/tango-transmission-web";
    			}
    			
    			$a.popup({
    				popid: 'RingListPop',
    				title: cflineMsgArray['ringList']+" "+cflineMsgArray['search']+" "+cflineMsgArray['popup'] /*링 리스트 조회 팝업*/,
    				url: urlPath+'/configmgmt/cfline/RingListPop.do',
    				data: param,
    				iframe: true,
    				modal : true,
    				movable : true,
    				windowpopup : true,
    				width : 1200,
    				height : 600,
    				callback:function(data){
    					if(data != null){
    						$('#popRepNtwkLineNm').val(data.ntwkLineNm);
    						$('#popRepNtwkLineNo').val(data.ntwkLineNo);
    					}
    				}	  
    			});
    		}
    	});
    	// path전송실 그리드 국사찾기
    	$('#'+gridId).on('click', '#btnMtsoGridSch', function(e){
	 	 	var data = AlopexGrid.currentData(AlopexGrid.parseEvent(e).data);
	 	 	var mgmtGrpNm = data.mgmtGrpCd == "0002"? "SKB":"SKT";
			
	 	 	tmofOrgId = "";
	 	 	tmofTeamId = "";
	 	 	
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(data.tmofId == dataS.value){
    					tmofOrgId = dataS.hdofcCd;
    					tmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}			
	 	 	searchMtso("grid", mgmtGrpNm, data.tmofId, data.mtsoNm);
		});
    	// path전송실 그리드 국사propertychange
    	$('#'+gridId).on('propertychange input', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		if(event.data._key == "mtsoNm"){
	    		event.data.mtsoId = "";
    		}
    	});
    	// PATH전송실 그리드 행추가
        $('#btnAddEqp').on('click', function(e) {
        	addPathTmofRow(); 
        });
        // PATH전송실 그리드 행삭제
        $('#btnRemoveEqp').on('click', function(e) {
        	removePathTmofRow();
        });
	 	// 상위국사 propertychange
     	$('#popUprMtsoNm').on('propertychange input', function(e){
     		$("#popUprMtsoId").val("");
     	});
     	// 하위국사 propertychange
     	$('#popLowMtsoNm').on('propertychange input', function(e){
     		$("#popLowMtsoId").val("");
     	});
        // 상위국 전송실 변경
    	$('#popUprTmofCd').on('change',function(e){
    		$("#popUprMtsoId").val("");
    		$("#popUprMtsoNm").val("");
    	});
    	// 하위국 전송실 변경
    	$('#popLowTmofCd').on('change',function(e){
    		$("#popLowMtsoId").val("");
    		$("#popLowMtsoNm").val("");
    	});
        //등록
        $('#btnSave').on('click', function(e) {
        	var msgArg ="";
        	var param = $("#ringWriteForm").getData();
//        	//ADAMS관련 - 가입자망링, 휘더망링 이외의 링은 등록불가
//        	if(param.mgmtGrpCd == "0002") {
//        		if (nullToEmpty(param.topoSclCd) != "030" && nullToEmpty(param.topoSclCd) != "031") {
//        			alertBox('I', cflineMsgArray['skbMgmtGroupSave']);
//        			return;
//        		}
//        	}
        	
        	//링명체크
        	if(nullToEmpty(param.ntwkLineNm) == "") {
        		$('#popNtwkLineNm').focus();
        		msgArg = cflineMsgArray['ringName']; /*링명*/
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
        		return;
        	}
        	else if(nullToEmpty(param.ntwkLineNm).length >100){
        		$('#popNtwkLineNm').focus();
        		msgArg = cflineMsgArray['ringName']; /*링명*/
        		var msgArg1 = 100;
        		alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* {0} 항목은 {1}자까지 입력가능합니다. */
        		return;
        	}
        	//
        	/* 1. [수정] 5GPON 링명 작성규칙*/
        	/* 2019-05-16 5G-PON인 경우에도 한글영문숫자(5자리)로 체크함 */
        	else if (checkRingNm(nullToEmpty(param.topoSclCd)) == false) {
        		$('#popNtwkLineNm').focus();
        		var msgArg1 = "";
        		if (nullToEmpty(param.topoSclCd) == "033") {
	        		msgArg = "한글영문숫자(5자리이하)_5GPONCxx(x2자리 혹은 COT장비의 숫자2자리)링";
	        		msgArg1 = " ex)분당전송실_5GPONCxx링,보라매_5GPONC05링 ";
        		}
        		else if (nullToEmpty(param.topoSclCd) == "036") {
        			msgArg = "(지)한글영문숫자(5자리이하)_5GPON2Cxx(x2자리 혹은 숫자2자리)링 또는 " +
					"한글영문숫자(7자리이하)_5GPON2Cxx(x2자리 혹은 숫자2자리)링";
	        		msgArg1 = " ex)(지)분당전송실_5GPON2Cxx링, 분당전송실_5GPON2Cxx링, 보라매_5GPON2C05링 ";
        		}
    			/*
    			 * 15. 5G-PON3.1링 관련 작업
    			 */
        		else if (nullToEmpty(param.topoSclCd) == "042") {
        			msgArg = "(지)한글영문숫자(5자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-xx(x2자리 혹은 숫자2자리)링 또는 " +
					"한글영문숫자(7자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-(x2자리 혹은 숫자2자리)링";
	        		msgArg1 = " ex)(지)분당전송실_5GPON3Cxx-xx링, 분당전송실_5GPON3Cxx-xx링, 보라매_5GPON3C05-01링 ";
        		}
        		/* 4. [수정] SMUX 링명 작성규칙*/
        		else if (nullToEmpty(param.topoSclCd) == "035") {
	        		//2024-11-13 4G-LMUX링명 추가
        			//MUX링명 :  _MUX + "BA/EX/BE" + 장비구분자(A,B) + 채널(LMUX_확장형의 경우) + COT번호 3자리 - 장비구분자 : 나현빈M 메일 요청 2020-09
					var msgArg = " COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(4)(채널_존재시)xxx(x3자리 혹은 숫자3자리)링";
	        		var msgArg1 = " ex) 광혜원[2F]-네오로닷컴2F_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(10)(채널존재시)xxx링  <br> 상암통합국-네오로닷컴2F_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(4)(채널존재시)013링  ";

				}
        		/* 11. [수정] BCMUX/CWDM-MUX 링명 작성규칙 */
        		else if (nullToEmpty(param.topoSclCd) == "040") {
					var msgArg = "BCMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)+(함체)";
	        		var msgArg1 = " ex) BCMUX_COT강남01-RT 동작구01, BCMUX_COT강남01-RT_동작구01(함체) ";
	        		
        		}
        		else if (nullToEmpty(param.topoSclCd) == "041") {
					var msgArg = " CWMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)";
	        		var msgArg1 = " ex) CWMUX_COT강남03-RT남산빌딩01, CWMUX_COT강남03-RT_남산빌딩03 ";
	        		
        		}
        		if(nullToEmpty(param.topoSclCd) == "035") {
        			alertBox('W', makeArgMsg('checkSmuxRingNmRull',msgArg,msgArg1,"",""));	 /* S-MUX링명은 이하의 형식으로 입력해 주세요.<br><br>[ {0} ]<br>({1}) */
        		} else {
        			alertBox('W', makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 /*링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) */
        		}
        		return;
        	}
        	/* 2. 추가  ROTN링 관련 작성규칙 - 2019-05-14 */  
        	//기간망을 선택한 경우에 체크한다. 
        	if(param.ntwkTypCd == "001") {

        		if (checkROTNRingNm(nullToEmpty(param.topoSclCd)) == false) {
	        		$('#popNtwkLineNm').focus();
	        		return;
        		}
        		/*
	        	if (checkROTNRingNm(nullToEmpty(param.topoSclCd)) == false) {
	        		$('#popNtwkLineNm').focus();
	        		var msgArg1 = "";
	        		msgArg = "벤더명ROTN장비군+시스템번호-전송실명링번호";
	        		msgArg1 = " ex)ZROTNR1-BORM001, HROTNO2-SNSU002(성수,보라매,100G) ";

	        		alertBox('W', makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) 
	        		return;
	        	}*/
        	}
        
        	if(nullToEmpty(param.mgmtGrpCd) == ""){
        		$('#popMgmtGrpCd').focus();
        		msgArg = cflineMsgArray['managementGroup']; /*관리그룹*/
        		alertBox('W', makeArgMsg('selectObject',msgArg,"","",""));	/* {0}를(을) 선택하세요. */
        		return;
        	}
        	
        	if(nullToEmpty(param.ntwkTypCd) == ""){
        		$('#popNtwkTypCd').focus();
        		msgArg = cflineMsgArray['networkDivision']; /*망구분*/
        		alertBox('W', makeArgMsg('selectObject',msgArg,"","",""));	/* {0}를(을) 선택하세요. */
        		return;
        	}
        	if(nullToEmpty(param.topoSclCd) == ""){
        		msgArg = cflineMsgArray['ntwkTopologyCd']; /*망종류*/
        		alertBox('W', makeArgMsg('selectObject',msgArg,"","",""));	/* {0}를(을) 선택하세요. */
        		$('#popTopoSclCd').focus();
        		return;
        	}
        	if(param.topoSclCd == "013") {
        		alertBox('I', cflineMsgArray['wdmRingCheckMsg']); /* WDM Ring 대신 WDM 트렁크를 사용하는 것으로 정책이 변경되었습니다. <br> WDM 트렁크로 등록하여 주십시오. */
        		$('#popTopoSclCd').focus();
        		return;
        	}
        	
        	
        	if(nullToEmpty(param.ntwkCapaCd) == ""){
        		$('#popNtwkCapaCd').focus();
        		msgArg = cflineMsgArray['capacity']; /*용량*/
        		alertBox('W', makeArgMsg('selectObject',msgArg,"","",""));	/* {0}를(을) 선택하세요. */
        		return;
        	}
        	if(nullToEmpty(param.ringSwchgMeansCd) == ""){
        		msgArg = cflineMsgArray['ringSwchgMeansCd']; /*절체방식*/
        		alertBox('W', makeArgMsg('selectObject',msgArg,"","",""));	/* {0}를(을) 선택하세요. */
        		$('#popRingSwchgMeansCd').focus();
        		return;
        	}
        	if(nullToEmpty(param.topoCfgMeansCd) == ""){
        		msgArg = cflineMsgArray['topologyConfigurationMeans']; /*토폴로지구성방식*/
        		alertBox('W', makeArgMsg('selectObject',msgArg,"","",""));	/* {0}를(을) 선택하세요. */
        		$('#popTopoCfgMeansCd').focus();
        		return;
        	}
    		if(nullToEmpty(param.uprTmofId) == ""){
    			$('#popUprTmofId').focus();
    			msgArg = cflineMsgArray['upperMtso'] + " " + cflineMsgArray['transmissionOffice']; /* 상위국사 전송실 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    			return;
    		}
    		if(nullToEmpty(param.uprMtsoId) == "" && nullToEmpty(param.uprMtsoNm) != ""){
    			$('#popUprMtsoNm').focus();
    			msgArg = cflineMsgArray['upperMtso']; /* 상위국사 */
 				alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
    			return;
    		}
    		
    		if(nullToEmpty(param.lowTmofId) == ""){
    			$('#popLowTmofId').focus();
    			msgArg = cflineMsgArray['lowerMtso'] + " " + cflineMsgArray['transmissionOffice'];  /* 하위국사 전송실 */
        		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    			return;
    		}
    		
    		if(nullToEmpty(param.lowMtsoId) == "" && nullToEmpty(param.lowMtsoNm) != ""){
    			$('#popLowMtsoNm').focus();
    			msgArg = cflineMsgArray['lowerMtso']; /* 하위국사 */
 				alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
    			return;
    		}
    		
    		// path전송실 그리드
        	$('#'+gridId).alopexGrid("endEdit",{ _state : { editing : true }});
        	
    		if(sMgmtGrpNm != uprMgmtGrpNm && sMgmtGrpNm != lowMgmtGrpNm && getGridMgmt(sMgmtGrpCd) == 0){
    			msgArg = "상위국사, 하위국사, PATH전송실 리스트 중  관리그룹이 " + sMgmtGrpNm + " 인 국사가 1개이상 존재해야 합니다."; /* 하위국사 */
    			alertBox('I', msgArg);
    			$('#'+gridId).alopexGrid("startEdit");
 				return;
    		}
        	
     		var dataList = $('#'+gridId).alopexGrid('dataGet');
     		var tmofDiv = "";
     		var validate = true;
     		
     		var uprMtsoId = nvlStr($("#popUprMtsoId").val(), $("#popUprTmofId").val());
     		var lowMtsoId = nvlStr($("#popLowMtsoId").val(), $("#popLowTmofId").val());
     		
     		var validateParam = {"uprTmofId":uprMtsoId, "lowTmofId":lowMtsoId};
     		if(dataList != null){
     			for(var i=0;i<dataList.length;i++){
     				$.each(validateParam, function(key,val){
     					var value = nvlStr(dataList[i].mtsoId, dataList[i].tmofId);
	     					if(value == val){
	     						validate = false;
	     						tmofDiv = key;
	     						return validate;
	     					}
	     					validateParam["pathTmofId"+i] = value;
     					});
     				var msgStr = cflineMsgArray['pathTmof'] + " "+ (i+1) + cflineMsgArray['row']+ " : "; /* PATH전송실 i행 : */
     				if(!validate){
     					if(tmofDiv == "uprTmofId"){
     						/* 이미 상위국사에 등록 되어있습니다.*/
     						msgStr += makeArgMsg('saveToDuplication', cflineMsgArray['upperMtso'], '', '', '');
     					}else if(tmofDiv == "lowTmofId"){
         					/* 이미 하위국사 전송실에 등록 되어있습니다.*/
         					msgStr += makeArgMsg('saveToDuplication', cflineMsgArray['lowerMtso'], '', '', '');
         				}else {
         					/* 같은 전송실 또는 국사를 등록 할 수 없습니다.*/
         					msgStr += cflineMsgArray['tmofSameNotReg'];
         				}
         	    		$('#'+gridId).alopexGrid("startEdit");
         	    		alertBox('W', msgStr);
         	    		return;
     				}
     				
         			if(nullToEmpty(dataList[i].mtsoId)=="" && nullToEmpty(dataList[i].mtsoNm) != ""){
         				msgArg = cflineMsgArray['mobileTelephoneSwitchingOffice']; /* 국사 */
         				alertBox('W', makeArgMsg('validationId',msgArg,msgStr,"","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
         				$('#'+gridId).alopexGrid("startEdit");
         				return;
         			}
     			}
         		if(validate){
    	        	callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst){  
    	            	if (msgRst == 'Y') {
    	            		ringWriteOp(); 
    	            	}
    	        	});	
         		}
         		$('#'+gridId).alopexGrid("startEdit");
     		}
        });
        //취소
   	 	$('#btnCncl').on('click', function(e) {
   	 		$a.close();
        });
    }
    
    /* 1. [수정] 5GPON 링명 작성규칙
     * 2. [수정] MUX 링명 작성규칙 - 2024-11-13
     */
    function checkRingNm(topoSclCd) {
    	
    	/* 2019-05-16 5G-PON인 경우에도 한글영문숫자(5자리이하)로 체크함 */
    	/* 2020-03-25 5G-PON인 경우에도 한글영문숫자(7자리이하)로 체크함 */

    	//링명은 [ 한글영문숫자(7자리)_5GPONCxx(x2자리 혹은 COT장비의 숫자2자리)링 ] 형식으로 입력해 주세요.
    	//( ex)분당전송실_5GPONCxx링,보라매_5GPONC05링 )
    	
    	// 망종류 5GPON 1.0 인경우
    	if (topoSclCd == "033") {
    		var reg_ring_name = /^([가-힣a-zA-Z0-9]{1,5})_5GPONC([X]{2}|[x]{2}|\d{2})링$/;
    		
    		if (reg_ring_name.test(nullToEmpty($('#popNtwkLineNm').val())) == false) {
    			return false;
    		}    		
    	} 
    	// 망종류 5GPON 2.0인경우
    	else if (topoSclCd == "036") {
    		var reg_ring_name = /^(\(지\)[가-힣a-zA-Z0-9]{1,5}|[가-힣a-zA-Z0-9]{1,7})_5GPON2C([X]{2}|[x]{2}|\d{2})링$/;
    		
    		if (reg_ring_name.test(nullToEmpty($('#popNtwkLineNm').val())) == false) {
    			return false;
    		}    		
    	} 
    	// 망종류 5GPON 3.1인경우
    	else if (topoSclCd == "042") {
    		var reg_ring_name = /^(\(지\)[가-힣a-zA-Z0-9]{1,5}|[가-힣a-zA-Z0-9]{1,7})_5GPON3C([X]{2}|[x]{2}|\d{2})-([X]{2}|[x]{2}|\d{2})링$/;
    		
    		if (reg_ring_name.test(nullToEmpty($('#popNtwkLineNm').val())) == false) {
    			return false;
    		}    		
    	} 
    	
    	//링명은 [ COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX)xxx(x3자리 혹은 숫자3자리)링 ] 형식으로 입력해 주세요.
    	//( ex)광혜원2F_SMUXxxx링,궁동2WD_SMUX001링 )
    	
    	// 망종류 SMUX인경우   4. [수정] SMUX 링명 작성규칙
    	// 2024-11-13 4G-LMUX링명규칙 추가
    	else if (topoSclCd == "035") {
    	    		
    		//var reg_ring_name = /^([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,8})_[S,C,L]MUX[A-Z]{0,3}([X]{3}|[x]{3}|\d{3})링$/;	//첫글자는 꼭 한글이어야함
    		//var reg_ring_name = /^([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,8})_[S,C,L]MUX([A-Z]{0,2})([(\)\0-9]{0,3})([A-Z]{0,1})([X]{3}|[x]{3}|\d{3})링$/;  ([A-Z]{0,1})
    		var reg_ring_name = /^([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,8})_([0-9,G]{0,2})[S,C,L]MUX([A-Z]{0,3})([(\)\0-9]{0,4})([X]{3}|[x]{3}|\d{3})링$/;

    		if (reg_ring_name.test(nullToEmpty($('#popNtwkLineNm').val())) == false) {
    			return false;
    		}    		
        }
        /* 망종류 BC-MUX/CWDM-MUX 인경우  11. [수정] BCMUX/CWDM-MUX 링명 작성규칙
    	 * BCMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)+(함체)
    	 */
    	else if (topoSclCd == "040") {
    		
    		var reg_ring_name = /^BCMUX_COT([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})(\d{2})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,9})(\d{2})(|\(함체\))$/;	
       		
    		if (reg_ring_name.test(nullToEmpty($('#popNtwkLineNm').val())) == false) {
    			return false;
    		}    			
        }
    	/* 망종류 BC-MUX/CWDM-MUX 인경우  11. [수정] BCMUX/CWDM-MUX 링명 작성규칙
    	 * CWMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)
    	 */
    	else if (topoSclCd == "041") {
    		
    		var reg_ring_name = /^CWMUX_COT([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})(\d{2})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,9})(\d{2})$/;	
       		
    		if (reg_ring_name.test(nullToEmpty($('#popNtwkLineNm').val())) == false) {
    			return false;
    		}    		
        }
    	return true;
    }
    
    //
    /* ROTN링 네이밍룰체크 - 2019-05-15 */
    function checkROTNRingNm(topoSclCd){

    	var ntwkLineNm = nullToEmpty($('#popNtwkLineNm').val());
    	//망구분(ntwkTypCd) : 001:기간망  
    	//망종류(topoSclCd) : 020:MESH, 002:PTP
    	var ntwknm = ntwkLineNm.substring(1,5).toUpperCase();
    	var useRotn = nullToEmpty(ntwkLineNm).indexOf("ROTN");
    	
    	if(useRotn > -1) {
			//망종류 MESH링인 경우
	    	if(topoSclCd == "020"){
				
				var msgArg = "MESH링(전체링)";
				var msgArg1 = "벤더명(Z,C,H) + ROTN + 장비군(R) + 시스템번호(1,2)-전송실명(영문4자리) + 링번호(숫자3자리)";
				var msgArg2 = " ex) ZROTNR1-BORM001, HROTNR2-SNSU002";

				var omsgArg = "MESH링(OTN링)";
				var omsgArg1 = "벤더명(Z,C,H) + ROTN + 장비군(O) + 시스템번호(1,2) - 전송실명(영문4자리) + 링번호(숫자3자리) + (COT국사,RT국사,용량) ";
				var omsgArg2 = " ex) CROTNO1-BORM001(인천,보라매1,10G), HROTNO2-SNSU002(성수2,보라매,100G)";
				
				var equip = nullToEmpty(ntwkLineNm).substring(5,6).toUpperCase();
				
	    		if(ntwkLineNm.length < 6 || (equip != 'O' && equip != 'R')) {

	    			alertBox('W', makeArgMsg('checkRotnRingNmRull',msgArg,msgArg1,msgArg2,"") + "<br><br>"
	    					+ makeArgMsg('checkRotnRingNmRull',omsgArg,omsgArg1,omsgArg2,""));	/*  [ {0} ] 망의 경우<br> 링명은 [ {1} ] 형식으로 입력해 주세요.<br>({2}) */
		
					return false;
	    			
	    		} else {
	    		
					/*
					 * OTN링  - 기간망 + MESH링
					 * Z/H/C ROTN 장비군(O)+시스템번호(1,2)-전송실명(영문4자)+링번호(숫자3)+(COT국사, RT국사, 용량)
					 */
	    			if(equip == "O") {
		    			//var reg_ring_name = /^[z|h|c]{1}ROTN[o][1|2]-[a-zA-Z]{1,4}[0-9]{3}[/(/]([가-힣]+[/,/]*)+[0-9]+[/)/]$/i;
		    			var reg_ring_name = /^[z|h|c]{1}ROTN[o][1|2]-[a-zA-Z]{4}[0-9]{3}[/(/]([0-9가-힣a-zA-Z]+[/,/]*)+[0-9a-zA-Z]+[/)/]$/i;
		    			var commaCnt = ntwkLineNm.match(/,/g)
		    	    	if(commaCnt != null) {
		    	    		commaCnt.length;
		    	    	}

		    			var finalSr = ntwkLineNm.substr(ntwkLineNm.length-1,2);
		    			
						if (reg_ring_name.test(ntwkLineNm) == false || commaCnt < 2 || finalSr == ",)") {
							
							alertBox('W', makeArgMsg('checkRotnRingNmRull',omsgArg,omsgArg1,omsgArg2,""));	/*  [ {0} ] 망의 경우<br> 링명은 [ {1} ] 형식으로 입력해 주세요.<br>({2}) */
				
							return false;
						}
					} else {
						/*
			        	 * 전체링 - 기간망 + MESH링
			        	 * Z/H/C ROTN 장비군(R)+시스템번호(1,2)-전송실명(영문4자)+링번호(숫자3)
			        	 */
						var reg_ring_name = /^[z|h|c]{1}ROTN[r][1|2]-[a-zA-Z]{4}[0-9]{3}$/i;
				    	
						if (reg_ring_name.test(ntwkLineNm) == false) {
							
							alertBox('W', makeArgMsg('checkRotnRingNmRull',msgArg,msgArg1,msgArg2,""));	/*  [ {0} ] 망의 경우<br> 링명은 [ {1} ] 형식으로 입력해 주세요.<br>({2}) */
							
							return false;
						} 
					}
	    		}
	    	}
			
	    	//망종류 PTP링인 경우
	    	if(topoSclCd == "002"){
				/*
				 * PTP링  - 기간망 + PTP링
				 * Z/H/C ROTN 장비군(R)+시스템번호(1,2)-전송실명(영문4자)+링번호(숫자3)+(국사A, 국사B)
				 */
		    	//var reg_ring_name = /^[z|h|c]{1}ROTN[r][1|2]-[a-zA-Z]{1,4}[0-9]{3}[/(/]([가-힣]+[/,/]*)+[/)/]$/i;
		    	var reg_ring_name = /^[z|h|c]{1}ROTN[r][1|2]-[a-zA-Z]{4}[0-9]{3}[/(/]([0-9가-힣]+[/,/]*)+[/)/]$/i;
		    	var commaCnt = ntwkLineNm.match(/,/g)
		    	if(commaCnt != null) {
		    		commaCnt.length;
		    	}

				var finalSr = ntwkLineNm.substr(ntwkLineNm.length-1,2);
				
				if (reg_ring_name.test(ntwkLineNm) == false || commaCnt < 1 || finalSr == ",)") {
					
					var msgArg = "PTP링(PTP링)";
					var msgArg1 = "벤더명(Z,C,H) + ROTN + 장비군(R) + 시스템번호(1,2) - 전송실명(영문4자리) + 링번호(숫자3자리) + (국사A,국사B) ";
	    			var msgArg2 = " ex) ZROTNR1-BORM001(인천1,보라매), HROTNR2-SNSU002(성수,보라매2)";

	    			alertBox('W', makeArgMsg('checkRotnRingNmRull',msgArg,msgArg1,msgArg2,""));	/*  [ {0} ] 망의 경우<br> 링명은 [ {1} ] 형식으로 입력해 주세요.<br>({2}) */
		
					return false;
				} 
	    	}
		}

    	return true;
    }
    
    // 링등록 op
    function ringWriteOp(){
    	$('#'+gridId).alopexGrid("endEdit",{ _state : { editing : true }});
    	paramFormData = $("#ringWriteForm").getData();
    	console.log(paramFormData);
    	params = $('#'+gridId).alopexGrid('dataGet');
		$.extend(paramFormData,{"topoLclCd":sTopoLclCd});
		$.extend(paramFormData,{"topoSclCd":$("#popTopoSclCd").getValues()[0]});
    	$.extend(paramFormData,{"mtsoLnoList":params});
    	var nUprMtsoId = paramFormData.uprMtsoId;
    	var nLowMtsoId = paramFormData.lowMtsoId;
		//	상위국사를 입력하지 않은 경우: 상위전송실 값으로 초기화
		if(nUprMtsoId == "") {
			nUprMtsoId = paramFormData.uprTmofId;
		}
		//	하위국사를 입력하지 않은 경우: 하위전송실 값으로 초기화
		if(nLowMtsoId == "") {
			nLowMtsoId = paramFormData.lowTmofId;
		}
		paramFormData.uprMtsoId = nUprMtsoId;
		paramFormData.lowMtsoId = nLowMtsoId;
		paramFormData.repNtwkLineNo = $("#popRepNtwkLineNo").val();
		paramFormData.ringMgmtObjYn = "Y";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/insertRingInfo', paramFormData, 'POST', 'insertRing');
    }
    
    /*
	 * Function Name : addPathTmofRow
	 * Description   : PATH전송실 그리드 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addPathTmofRow() {
    	var initRowData = [
    	    {
    	    	  "mgmtGrpCd" : $('#popMgmtGrpCd').val()//TmofSktData[0].mgmtGrpCd  //C00188Data
  	    		, "mgmtGrpNm" : sMgmtGrpNm
  	    		, "tmofId" : $('#popMgmtGrpCd').val() == '0001' ? TmofSktData[0].value :  TmofSkbData[0].value//TmofData
  	    		, "tmofNm" : $('#popMgmtGrpCd').val() == '0001' ? TmofSktData[0].text : TmofSkbData[0].text
  	    		, "mtsoId" : '' //MtsoDataList
  	    		, "mtsoNm" : ''
    	    }
    	];
    	$('#'+gridId).alopexGrid("dataAdd", initRowData);
    	$('#'+gridId).alopexGrid("startEdit");
    }
    
    /*
	 * Function Name : removePathTmofRow
	 * Description   : PATH전송실 그리드 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removePathTmofRow() {
    	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    }
    
    /**
     * @param ntwkTypCd
     * @param topoSclCd
     * @param dataGubun
     */
    function makeTopoSclCdBox(ntwkTypCd, topoSclCd, topoCdListCombo){
    	var ntwkTypCdVal = $('#'+ntwkTypCd).val();
    	//console.log(Object.keys(topoCdListCombo).length);
    	if(nullToEmpty(ntwkTypCdVal) != ""){ 
    		var topoSclCd_option_data =  [];
    		var keys = Object.keys(topoCdListCombo);
    		for(k=0; k<Object.keys(topoCdListCombo).length; k++){
    			var data = topoCdListCombo[keys[k]]; 
    			if(keys[k] == ntwkTypCdVal){ 
    				topoSclCd_option_data = data;
    			}
    		}		
    		$('#' + topoSclCd).clear();
    		$('#' + topoSclCd).setData({data : topoSclCd_option_data});	
    	}
    }
    
    function changeTopoCdBox(){
		var dataGubun = null;
		if($('#popMgmtGrpCd').val() == "0001"){
			makeTopoSclCdBox("popNtwkTypCd", "popTopoSclCd", topoCdListCombo);  // 서비스회선유형 selectbox 제어	
			//TODO
			if($('#popNtwkTypCd').val() != "001"){	//기간망이 선택된 경우
				$('#titleOtdrLnkgMeansCd').hide();
				$('#popOtdrLnkgMeansCd').hide();
			} else {
				$('#titleOtdrLnkgMeansCd').show();
				$('#popOtdrLnkgMeansCd').show();
			}
		}
		if($('#popMgmtGrpCd').val() == "0002"){
			var skbData = topoCdListCombo["0002"]; 
			$('#popTopoSclCd').clear();
			$('#popTopoSclCd').setData({data : skbData});	
		}
    	var topoCfgMeansCd = getTopoCfgMeansCd($('#popTopoSclCd').val());
    	$('#popTopoCfgMeansCd').setSelected(topoCfgMeansCd);
    }
    
    // 토롤로지 구성방식 코드 RULE
    function getTopoCfgMeansCd(topoSclCd){
    	if(topoSclCd == '031'){
    		return '003';
    	}else if( topoSclCd == '002' || topoSclCd == '013' || topoSclCd == '020' || 
    			   topoSclCd == '035' ||  topoSclCd == '039'){
    		return '002';
    	}else{
    		return '001';
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
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'insertRingGisApi'){
    		$a.close(result);
    	}
    	if(flag == 'C00188Data'){
    		C00188Data = response;
    		//관리그룹
    		$('#popMgmtGrpCd').clear();
    		$('#popMgmtGrpCd').setData({data : C00188Data});   		
        	if ( $('#userMgmtCdPop').val() !="" && $('#userMgmtCdPop').val() !=null) {
        		// 소속전송실에 속한 관리그룹이 있는 경우
				if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
					var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCdPop').val();
					// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
				    if (userJrdtTmofMgmtCd != "" && $('#popMgmtGrpCd').find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
				    	$('#popMgmtGrpCd').setSelected(userJrdtTmofMgmtCd);
				    } else {
				    	// 소속전송실에 속한 관리그룹이 없는 경우
				    	$('#popMgmtGrpCd').setSelected($('#userMgmtCdPop').val());				    	
				    }			
				} else {
					// 소속전송실에 속한 관리그룹이 없는 경우
					$('#popMgmtGrpCd').setSelected($('#userMgmtCdPop').val());
				}
        	}
        	//상위국 관리그룹
    		$('#popUprOwnCd').clear();
    		$('#popUprOwnCd').setData({data : C00188Data});		
    		//하위국 관리그룹
    		$('#popLowOwnCd').clear();
    		$('#popLowOwnCd').setData({data : C00188Data});
    		
    	}
    	if(flag == 'C00223Data'){
    		C00223Data = response; /* 절체방식데이터 */ 
    		$('#popRingSwchgMeansCd').clear();
    		$('#popRingSwchgMeansCd').setData({data : C00223Data});
    	}
    	if(flag == 'C00194Data'){
    		C00194Data = response;		/* 용량데이터 */
    		$('#popNtwkCapaCd').clear();
    		$('#popNtwkCapaCd').setData({data : C00194Data});
		}
    	if(flag == 'C02501Data'){
    		C02501Data = response;		/* 토폴로지구성방식 */
    		$('#popTopoCfgMeansCd').clear();
    		$('#popTopoCfgMeansCd').setData({data : C02501Data});
    	}
    	if(flag == 'C02533Data'){
    		//C02533Data = response;		/* OTDR연동방식 */
    		
    		for(var i=0; i<response.length; i++){
				C02533Data.push({value : response[i].value, text :response[i].text});
    		}
			
			var comboTopoData = [];
			comboTopoData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		comboTopoData = comboTopoData.concat(C02533Data);
    		
    		
    		$('#popOtdrLnkgMeansCd').clear();
    		$('#popOtdrLnkgMeansCd').setData({data : comboTopoData});
    	}
    	
    	// 망종류 망구분 데이터 설정
    	if(flag == 'getNtwkTypTopoCode'){
    		$.extend(ntwkTypData,{"ntwkTypCdListSkt" : response.ntwkTypCdListSkt });
    		$.extend(ntwkTypData,{"ntwkTypCdListSkb" : response.ntwkTypCdListSkb });
    		topoCdListCombo = response.topoCdListCombo;
    	}
    	if(flag == 'TmofSktData') {
    		TmofSktData = response.tmofCdList;    		
    	}
    	if(flag == 'TmofSkbData') {
    		TmofSkbData = response.tmofCdList;
    	}
    	if(flag == 'TmofAllData') {
    		TmofAllData = response.tmofCdList;
    	}
    	if(flag == 'insertRing'){
    		cflineShowProgressBody();
    		if(response.Result == "Success"){
    			//tango-transmission-gis-biz/transmission/cc/ringsync/syncData
    			var paramApiData = {"ntwkLineNo":response.ntwkLineNo};
    			console.log('insertRing 성공! : '+ response.ntwkLineNo);
    			httpRequest('tango-transmission-gis-biz/transmission/cc/ringsync/syncData?ntwkLineNo=' + response.ntwkLineNo , null, 'GET', 'insertRingGisApi');
    			
    			// 네트워크정보 TSDN
				sendToTsdnNetworkInfo(response.ntwkLineNo, "R", "B");
    		} else {
    			var param = $("#ringWriteForm").getData();
    			if(nullToEmpty(param.ntwkTypCd) == "001"){
	    			if(nullToEmpty(param.topoSclCd) == "020" || nullToEmpty(param.topoSclCd) == "002"){
	        			cflineHideProgressBody();
	    				/* 중복된 링명이 존재합니다. 다른 링명을 입력해 주세요. */
	        			alertBox('I', cflineMsgArray['duplRingNmInRingNm']); 
	    			}
    			} else {
    				$a.close(response.Result);
    			}
    		}
    	}
    	
    	if(flag == "uprMtsoInfo"){
    		if(response != null && response.length > 0){
    			$('#popUprOwnCd').setSelected(response[0].mgmtGrpCd);
    			$('#popUprTmofId').setSelected(response[0].topMtsoId);
     	 		$('#popUprMtsoId').val(response[0].mtsoId);
    			$('#popUprMtsoNm').val(response[0].mtsoNm);
    		} else {
    			/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));
    		}
    	}
    	if(flag == "lowMtsoInfo"){
    		if(response != null && response.length > 0){
    			$('#popLowOwnCd').setSelected(response[0].mgmtGrpCd);
	    		$('#popLowTmofId').setSelected(response[0].topMtsoId);
	    		$('#popLowMtsoId').val(response[0].mtsoId);
				$('#popLowMtsoNm').val(response[0].mtsoNm);
			} else {
				/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));			
    		}	
    	}
    	if(flag == "gridMtsoInfo"){
    		if(response != null && response.length > 0){
    			var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
        		var rowIndex = focusData[0]._index.data;
        		var editData = {"mgmtGrpCd":response[0].mgmtGrpCd, "tmofId":response[0].topMtsoId, "mtsoId":response[0].mtsoId, "mtsoNm": response[0].mtsoNm};
    			$('#'+gridId).alopexGrid( "dataEdit", $.extend({}, editData), {_index : { row : rowIndex}});
    		} else {
    			/* 처리할 수 없습니다. 상태를 확인하십시오. */
    			alertBox('I', makeArgMsg('checkProcessStatusCantSave', cflineMsgArray['mobileTelephoneSwitchingOffice'],'','',''));
    		}
    	}
    	if($('#popMgmtGrpCd').val()!= "" && ((flag == 'TmofSktData') || (flag == 'TmofSkbData')) ) {
			if ($('#popMgmtGrpCd').val() == "0001"){
				$('#popUprTmofId').clear();   // 상위국사
        		$('#popUprTmofId').setData({data : TmofSktData});
        		$('#popLowTmofId').clear();  // 하위국사
        		$('#popLowTmofId').setData({data : TmofSktData});					
		    } else {
		    	$('#popUprTmofId').clear();  // 상위국사
        		$('#popUprTmofId').setData({data : TmofSkbData});
        		$('#popLowTmofId').clear();  // 하위국사
        		$('#popLowTmofId').setData({data : TmofSkbData});
		    }
		}
    	
		// 각 관리그룹, SKT전송실, SKB전송실이 모두 취득된 후 화면편집이 가능하도록
		if (C00188Data.length > 0 && TmofSktData.length > 0 && TmofSkbData.length > 0 && C00223Data.length > 0
		    && C00194Data.length > 0 && pageMakeEnd == "N") {
			initSelectData();
			cflineHideProgressBody();
		}
		
    }
    function initSelectData(){
    	pageMakeEnd = "Y";
    	$('#popMgmtGrpCd').setSelected(sMgmtGrpNm);
    }
    /**
     * Function Name : searchMtso
     * Description   : 국사 검색
     * ----------------------------------------------------------------------------------------------------
     * param    	 : searchDiv. 검색flag (upr - 상위국, low - 하위국, grid - 그리드)
     * 				   mgmtGrpCd. 사업자
     * 				   tmofId. 전송실 
     *                 mtsoNm. 국사명 
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function searchMtso(searchDiv, mgmtGrpNm, tmofId, mtsoNm){
    	//var mgmtGrpNm = mgmtGrpCd == "0002"? "SKB":"SKT";
//    	console.log("$('#popTopoSclCd').val()========" + $('#popTopoSclCd').val());

    	var orgId = null;
    	var teamId = null;
    	if( searchDiv == "upr" ){
    		orgId = uprTmofOrgId;
    		teamId = uprTmofTeamId;
    	}else if( searchDiv == "low" ){
    		orgId = lowTmofOrgId;
    		teamId = lowTmofTeamId;
    	}else {
    		orgId = tmofOrgId;
    		teamId = tmofTeamId;
    	}
    	// paramValue : 사업자, 전송실, 국사명
 	 	var paramValue = { "mgmtGrpNm": mgmtGrpNm, "tmof": tmofId, "mtsoNm": mtsoNm, "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : orgId , "teamId" : teamId };
    	
		
 	 	var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) ==""){
 			urlPath = "/tango-transmission-web";
 		}
 		$a.popup({
 		  	popid: "popMtsoSch",
 		  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
 		  	url: urlPath + '/configmgmt/common/MtsoLkup.do',
 			data: paramValue,
 			iframe: true,
 		    modal : true,
 		    movable : true,
 			width : 950,
 			height : 750,
 			callback:function(data){
 				if(data != null){
 					var sMgmtGrpNm = nullToEmpty(data.mgmtGrpNm);
 					var mgmtGrpChk = true;
 					if(searchDiv != "grid"){
 						//가입자망이나 휘더망링의 상위국사의 경우 동일 관리그룹을 선택햇는지 체크하지 않는다.
 						if($('#popTopoSclCd').val() == '031'){
 							mgmtGrpChk = false;
 						}else if (searchDiv == "upr" && $('#popTopoSclCd').val() == '030'){
 							mgmtGrpChk = false;
 						}
 						
 	 					if(mgmtGrpChk) {  // 가입자망링 휘더망ㄹㅇ 아닌경우 
	 						if(sMgmtGrpNm != mgmtGrpNm){
	 							// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
	 							var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['businessMan'], sMgmtGrpNm, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
	 							alertBox('W', msg);
	 							return;
	 						}
 	 					}
 			 	 	}
 					if(data.mtsoStatCd != "01"){
 						// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
						var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['mobileTelephoneSwitchingOfficeStatus'], data.mtsoStat, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
						alertBox('W', msg);
						return;
 					}
 					
 					if(data.mtsoTypCd != "2" && data.mtsoTypCd != "3" && data.mtsoTypCd != "4"){
 						// {0}가 {1}인 데이터를 {2}에 등록 할 수 없습니다.
 						var msg = makeArgMsg("canNotInsertValue", cflineMsgArray['mobileTelephoneSwitchingOfficeTypeCode'], data.mtsoTyp, cflineMsgArray['mobileTelephoneSwitchingOffice'] );
 						alertBox('W', msg);
						return;
 					}
 					setMtso(searchDiv, data.mtsoId);
 				}
 			}
 		}); 
    }
    
    function setMtso(searchDiv, mtsoId){
    	var param = {mtsoId : mtsoId};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getMtsoInfo', param, 'GET', searchDiv + 'MtsoInfo');
    }
    function failCallback(response, status, jqxhr, flag ){
		cflineHideProgressBody();
    	if(flag == 'insertRingGisApi'){
    	}
    	if (flag == 'insertRing') {
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    	}
    }
    
    //국사조회 창의 본부팀을 셋팅하기위한 작업
    function getOrg(tmofId,searchDiv){
    	if(TmofAllData != null && TmofAllData.length > 0){
			for(m=0; m<TmofAllData.length; m++){
				var dataS = TmofAllData[m];  
				if(tmofId == dataS.value){
					tmpMgmt = dataS.mgmtGrpCd;
					if(searchDiv == "upr"){
						uprTmofOrgId = dataS.hdofcCd;
						uprTmofTeamId = dataS.teamCd;
					}else if(searchDiv == "low"){
						lowTmofOrgId = dataS.hdofcCd;
						lowTmofTeamId = dataS.teamCd;
					}
					break;
				}
			}    			
	 	}
    }
    
    function getGridMgmt(mgmtTyp){
    	var mgmtData = $('#'+gridId).alopexGrid("dataGet", {"mgmtGrpCd" : mgmtTyp });
    	return mgmtData.length;
    }
    
});
 