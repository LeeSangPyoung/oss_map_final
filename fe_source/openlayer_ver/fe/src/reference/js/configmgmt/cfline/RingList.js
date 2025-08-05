/** 
 * RingList.js 
 *
 * @author P100...
 * @date 2016. 9. 7. 오전 17:30:03
 * @version 1.0
 *  
 * ************* 수정이력 ************
 * 2018-03-27  1. 선로존재여부 체크하지 않고 해지
 * 2018-04-09  2. [수정] 5GPON 링명 작성규칙
 *                기준 : 한글영문(5자리)_5GPONC##(숫자2자리)링
 * 2018-05-30  3. [수정] WDM트렁크 기간망 형식으로 변경
 * 2018-12-11  4. [수정] SMUX 링명 작성규칙
 *                기준 : 한글영문숫자(5자리)_SMUXxxx(x3자리 혹은 숫자3자리)링
 * 2019-01-08  5. [수정] 5GPON 링명 작성규칙
 *                기준 : 한글영문(5자리)_5GPONCxx(x2자리 혹은 숫자2자리)링/한글영문(5자리)_5GPON2Cxx(x2자리 혹은 숫자2자리)링
 * 2019-02-21  6. [수정] 5GPON 링명 작성규칙 2.0 망종류코드추가 : 036 로 명명규칙 변경
 * 				  기준 : 한글영문(5자리)_5GPONCxx(x2자리 혹은 숫자2자리)링 / 한글영문(5자리)_5GPON2Cxx(x2자리 혹은 숫자2자리)링
 * 2019-11-07  7. [수정] 기간망 링 선번고도화 : 링에서 링을 사용할 수있게 되어 해지, 망종류 변경 등의 작업시 사용링 정보를 체크할 필요가 있음
 * 				  망종류변경시 : PTP (002) 혹은 M/W PTP링(039) 인경우 서로 변경 가능하고 다른 링으로 변경시 혹시 해당 링을 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
 *                               MESH (020)의 경우 다른 링으로 변경시 혹시 해당 링을 사용중인 링 혹은 해당링이 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
 *                               Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038), MSPP(032), Free(005), PTS링(009), L3_Switch링(012), T2IP링(016)인경우 서로 변경 가능하고 다른 링으로 변경시 혹시 해당 링을 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
 *                               망구분 변경시 서로 맞는 타입의 망종류를 기본 선택해줌
 *                해지시 : 사용링 정보가 있는경우 모두 삭제후 해지 하도록 유도  
 * 2020-02-26 8. [수정] 기간망 예비선번 초기화
 *                  기간망 PTP 에서 다른 망종류로 변경 시 예비선번이 존재할 경우 사용자에게 초기화여부 확인 후 예비선번 초기화
 *                  기간망 중 망종류가 PTP인 경우에만 예비선번을 가질 수 있음                            
 *                  해지요청 중이거나 경유링으로 사용중일 경우에는 해당 예비선번은 초기화하지 않는다.
 *                  
 * 2020-03-25 9. [수정] 5GPON 링명 작성규칙 2.0 망종류코드추가 : 036 로 명명규칙 변경
 * 				  기준 : (지)한글영문(5자리)_5GPONCxx(x2자리 혹은 숫자2자리)링 or 한글영문(7자리)_5GPON2Cxx(x2자리 혹은 숫자2자리)링
 * 
 * 2020-04-16  10. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가       
 * 2020-05-12  11. CMUX관련 작업
 *               - 장비구분 추가
 *               - SMUX링에 CMUX를 사용할수 있게 되면서 망종류가 SMUX에서 타 망종류로 변경시 정보를 체크할 필요가 있음
 * 2020-06-25  12. [수정] SMUX 링명 작성규칙 COT장비국소명 자릿수, SMUX외 CMUX추가 변경
 * 				  기준 : COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX)xxx(x3자리 혹은 숫자3자리)링      
 * 2020-08-03  13. BC-MUX링, CWDM-MUX링 관련 작업
 *               - 가입자망링에 BC-MUX링/CWDM-MUX링을 사용할수 있게 되면서 망종류가 BC-MUX링/CWDM-MUX링에서 타 망종류로 변경시 정보를 체크할 필요가 있음
 *               - 링명규칙 : BCMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)+(함체)
 *                          CWMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)
 * 2020-10-19  13. [수정] LMUX 링명작성규칙포함
 *                기준 : COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX,LMUX)A,B(앞뒤구분자)xxx(x3자리 혹은 숫자3자리)링
 *                LMUX의 경우 채널값(4), (8) 등의 문자,숫자도 포함가능 - 필수아님
 *                확장형, 기본형등 MUX뒤에 BA,EX등 영문자2자리수 포함 가능
 * 2021-04-13  14. [추가] SKB관리그룹의 경우 링리스트에 관리주체 표시      
 *         
 * 2021-10-27  15. [수정] 5GPON 링명 작성규칙 3.1 망종류코드추가 : 042 로 명명규칙 변경
 * 				  기준 : (지)한글영문숫자(5자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-xx(x2자리 혹은 숫자2자리)링 or 한글영문숫자(7자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-(x2자리 혹은 숫자2자리)링 
 *  
 * 2022-05-17  15. [추가] 기간망링을 편집시에 OTDR연동방식값을 등록할수 있도록 추가 
 * 2022-06-13  16. [수정] MESH, PTP링의 국사명에 숫자등록 가능하도록 개선 
 * 2022-08-24  17. [수정] 망종류가 휘더망링, IBRR링, IBS링, L3_Switch링인 경우 망종류는 수정불가능한데 처음등록후 작업정보탭전환시 비활성화가 풀리는 현상이 발생하여 수정  
 * 2023-05-10  18. [수정] M/W PTP링외 모든 링에 예외없이 셀이벤트가 적용되어 편집시 커서가 사라지는 현상이 있어 M/W PTP링의 주파수, 대역폭변화시 해당 로직이 실행되도록 수정
 * 2023-05-16  19. [수정] SKB CATV링의 예비선번구현을 위해 링선번편집창 호출 function인 showRingEditPop의 data에 ntwkTypCd 추가 
 * 2024-09-11  20. [수정] ADAMS관련 편집불가였던 내용에 대해 원복 - 모든링에 대해 관리주체제한없이 편집가능   
 * 2024-11-13  21. [추가] 4G-LMUX링 등록되도록 링명 작성규칙 추가
 *                기준 : LMUX앞에 "4G_" 문자 추가되도 등록가능 
 * 2025-01-08  22. [수정] 링선번정보 저장후 닫기시 재조회 되는 기능 막음 -> 링명 자동변경시 저장이 되면 자동으로 재조회가 되기 때문에 구지 닫기시 재조회하지 않아도 됨         
 */ 
var excelColumn = "";
var savedChnlCnt = 0; //DB에 저장되어 있는 채널수 
var evChnl = null;    //채널수 관련 event전역변수
var gridIdChnl = null; //채널수 관련 gridId전역변수
$a.page(function() {
	var gridId = 'dataGrid';
	var gridWorkId = 'dataGridWork';
	var searchYn   = false ;
	 
	var NtwkTypData = [];	//망구분데이터  value:text
	var TopoData = []; 		//망종류데이터 
	var NtwkTypDataSkt = [];	//망구분데이터 SKT  value:text
	var TopoDataSkt = []; 		//망종류데이터 SKT
	var NtwkTypDataSkb = [];	//망구분데이터 SKB value:text
	var TopoDataSkb = []; 		//망종류데이터 SKB
	var C00188Data = [];	// 관리구분데이터   comCd:comCdNm
	var C00194Data = [];	// 용량데이터
	var C00223Data = [];	// 절체방식데이터
	var C02501Data = [];	// 토폴로지구성방식데이터
	var C00223DataIn031 = [];	// 가입자망링절체방식데이터
	var C00223DataNotIn031 = [];	// 가입자망링외절체방식데이터
	var C00262Data = [];  // 회선상태
	var C02504Data = [];    //M/W용도구분데이터
	var C02505Data = [];    //주파수데이터
	var C02506Data = [];    //대역폭데이터
	var C02507Data = [];    //변조방식데이터
	var C02533Data = [];    //OTDR연동방식코드
	var EqpDivData = [];    //장비구분
	
	var ynListData = [];  // 예,아니오
	var selectBoxYnList  = [{value: "",text: cflineCommMsgArray['select'] /* 선택 */ },{value: "Y",text: "예"},{value: "N",text: "아니오"}];  
	var ringMgmtObjYnSearchList = [{value: "", text: cflineMsgArray['all'] /* 전체 */}
												, {value: "N", text : cflineMsgArray['withoutObject'] /* 제외대상 */}
												, {value: "Y", text: cflineMsgArray['createObject'] /* 생성대상 */}
												, {value: "none", text: cflineMsgArray['undefinedCore']} /* 미지정 */ 
											 ]; //검색조건용 생성대상여부
	var ringMgmtObjYnGridList = [ {value: '', text: cflineCommMsgArray['select'] /* 선택 */}
												, {value: "Y", text: cflineMsgArray['createObject'] /* 생성대상 */}
												,{value: "N", text : cflineMsgArray['withoutObject'] /* 제외대상 */}
												 ]; //그리드용 생성대상여부
	var topoCdListCombo = null;
	
	var addData = false;
	var maxPathCount = 0;
	var maxPathCountWork = 0;
	
	var columnRingInfo = columnMapping("RingInfo");
	var columnWorkInfo = columnMapping("WorkInfo");
	
	var jobInstanceId = "";
	
	var infoScrollBottom = true;
	var workInfoScrollBottom = true;
	
	var totalInfoCnt = 0;
	var totalWorkCnt = 0;
	
	var pageForCount = 200;
	
	//가변 컬럼 설정 변수
	excelColumn = columnRingInfo;

	// fdf사용정보
	var fdfUsingInoLineNo = null;

	// PTP링 네트워크정보 TSDN 전송
	var sendToTsdnLineNo = null;

	// 3. [수정] WDM트렁크 기간망 형식으로 변경 = > 해지시 자동 수정 대상 테이블에서 삭제 처리
	var procAcceptTargetList = null;
	
	var mgmtOrgData = [];
	var mgmtOrgSktData =[];
	var mgmtOrgSkbData = [];
	var mgmtTeamData = [];
	var mgmtTeamSktData = [];
	var mgmtTeamSkbData = [];
	var teamDataListCombo = null;
	
	// 해지요청중 : 승인권한
	var aprvUserId = null;
	
	var btnRingTrmnNm = cflineMsgArray['trmn'];
	
	var editMode = false;
	
	var mwPtpInfoCol  = ['mwUsgDivCd','sctnDistK','mwFreqCd','modulMeansCd','mwBdwhCd','chnlCnt','uprMtsoAtnSz','lowMtsoAtnSz']; //mwPtp링 정보 컬럼
	
	var ntwkGiganInfoCol  = ['otdrLnkgMeansCd', 'otdrSctnNm']; //기간망링 정보 컬럼 2022-05-17

	var mgmtOnrNmCol  = ['mgmtOnrNm']; //관리주체 컬럼
	
	this.init = function(id, param) {
		
    	fdfUsingInoLineNo = null;
    	
    	sendToTsdnLineNo= null;
    	
    	procAcceptTargetList= null;
    	
		createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    	setSelectCode();
    	setEventListener();
    	createGrid('All'); // 최초 그리드 셋팅 
    	$('#btnExportExcel').setEnabled(false);
    	$('#btnDupMtsoMgmt').setEnabled(false);
    	$('#btnWorkCnvt').setEnabled(false);
    	$('#eqpNm').setEnabled(false);
    	$('#btnDelWorkInfo').setEnabled(false);
    	$('#btnUpdateWorkInfo').setEnabled(false);
    	$('#sWorkGrpWhereUse').setChecked(true);
    	
    	// input text box
    	inputEnableProc("lftEqpNm","lftPortNm","");
    	inputEnableProc("rghtEqpNm","rghtPortNm","");
    	
    	
    	aprvUserId = $('#userId').val();
    	aprvAminChk("ring", aprvUserId);
		//$('#btnApproval').setEnabled(false);
    	
    	if (nullToEmpty($('#userMgmtCd').val()) != null) {
    		if ($('#userMgmtCd').val() == "0001") {
            	btnRingTrmnNm = cflineMsgArray['approval'] +"/" + cflineMsgArray['trmn'];
            }
            else {
            	btnRingTrmnNm = cflineMsgArray['trmn'];	
            }
            $("#btnDelWorkInfo").html(btnRingTrmnNm);
    	}
    	
		$('#'+gridId).alopexGrid('hideCol', mwPtpInfoCol);
		$('#'+gridWorkId).alopexGrid('hideCol', mwPtpInfoCol);
		
		//OTDR연동방식코드 숨김
		$('#'+gridId).alopexGrid('hideCol', ntwkGiganInfoCol);
		$('#'+gridWorkId).alopexGrid('hideCol', ntwkGiganInfoCol);
		
		if ($('#mgmtGrpCd').val() == "0001") {
			$('#'+gridId).alopexGrid('hideCol', mgmtOnrNmCol);
			$('#'+gridWorkId).alopexGrid('hideCol', mgmtOnrNmCol);
		}
		
		//Stg, local 테스트에서만 버튼이 활성화되도록 추가
		if ($('#userId').val() == 'PTN0649278' || $('#userId').val() == 'PTN5205642') {
			$('#btnNewTest').show();
			$('#btnAddTest').show();
		}
    };

    function columnMapping(sType) {	//	RingInfo: 링정보, WorkInfo: 작업정보
    	var em = sType == 'WorkInfo'? '<em class="color_red">*</em>': '';
    	var mapping = [
	      	    /*{key : 'networkId',	title : '네트워크ID',	align:'left',	width: '70px'}
	      	    , {key : 'count',	title : '갯수',	align:'left',	width: '70px'}*/
	      	      { selectorColumn : true, width : '40px' }
	      	    , {title : cflineMsgArray['sequence'] /*순번*/,	align:'center', width: '40px', numberingColumn: true }
	      	    , {key : 'mgmtOnrNm',	title : '관리주체'  /*관리주체*/, align:'center', width: '80px'}
	      	    , {key : 'ntwkLineNo',	title : cflineMsgArray['ringIdentification'] /*링ID*/,	align:'center',	width: '110px'}
	    		, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '80px'}
	      	    , {key : 'ntwkLineNm',	title : em + cflineMsgArray['ringName'] /*링명*/, align:'left',	width: '240px'
//	      	    	, allowEdit :  $('#mgmtGrpCd').val() == '0001' ? true : false   // ADAMS 연동 고도화 
//	      	    	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031') ? true : false); }  // ADAMS 연동 고도화
	      	        , editable:{type:"text"}}
	      	    /* 시각화 */
	            , {title : "E2E보기",	align:'center',	width: '65px'  
	           		, render : function(value, data, render, mapping) {
	           			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnE2ePop" type="button"></button></div>';
	           		}
	               }
                , {title : "시각화 편집",	align:'center',	width: '80px'
           		, render : function(value, data, render, mapping) {
           			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnServiceLIneInfoPop" type="button"></button></div>';
             		}
                }	
	      	    , {key : 'mgmtGrpCd',	title : cflineMsgArray['managementGroup'] /*관리그룹*/, align:'center', width: '90px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C00188Data.length > 1) {
	      	    				return render_data = render_data.concat(C00188Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.mgmtGrpCd, text : data.mgmtGrpCdNm });
	      	    			}
	      	    		}
	      	    	}
	      	    }
//	      	    , {key : 'topo',	title : cflineMsgArray['managementDepartment'] /*관리부서*/,	align: 'center', width: '76px'}
	      	    , {key : 'ntwkTypCd',
	      	    	title : em + cflineMsgArray['networkDivision'] /*망구분*/, align: 'center', width: '135px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			if(sType !=  'WorkInfo'){
	      	    				var render_data = [];
		      	    			if(NtwkTypData.length > 1) {
		      	    				return render_data = render_data.concat(NtwkTypData);
		      	    			}else {
		      	    				return render_data.concat({value : data.ntwkTypCd, text : data.ntwkTypNm });
		      	    			}
	      	    			} else {
	      	    				var render_data = [];
		      	    			if (data.mgmtGrpCd == '0001') {
		      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
		      	    				render_data = render_data.concat(NtwkTypDataSkt);
		      	    				return render_data;
		      	    			} else {
		      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
		      	    				render_data = render_data.concat(NtwkTypDataSkb);
		      	    				return render_data;
		      	    			}
	      	    			}
	      	    		}
	      	    	}
//	      	        , allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031') ? true : false); }  // ADAMS 연동 고도화 
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			if (data.mgmtGrpCd == '0001') {
	      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				render_data = render_data.concat(NtwkTypDataSkt);
	      	    				return render_data;
	      	    			} else {
	      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				render_data = render_data.concat(NtwkTypDataSkb);
	      	    				return render_data;
	      	    			}
	      	    			
	      	    		}, attr : {
  			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'topoSclCd',	
	      	    	title : em + cflineMsgArray['ntwkTopologyCd'] /*망종류*/, align:'center',	width: '150px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			var currentData = AlopexGrid.currentData(data);
	      	    			if(sType !=  'WorkInfo'){
	      	    				if(TopoData.length > 1) {
	      	    					return render_data = render_data.concat(TopoData);
		      	    			}else {
		      	    				return render_data.concat({value : data.topoSclCd, text : data.topoSclNm });
		      	    			}
	      	    			} else {
		      	    			if (data.mgmtGrpCd == '0001') {
		      	    				var editData = data._state.editing;
			      	    			if( currentData.ntwkTypCd) { // && nullToEmpty(editData[mapping.columnIndex])!= "" ) { // mapping값 없음
			      	    				return render_data = render_data.concat(topoCdListCombo[currentData.ntwkTypCd]);
			      	    			}else {
			      	    				return render_data.concat({value : data.topoSclCd, text : data.topoSclNm });
			      	    			}
		      	    			} else {
			      	    			if(currentData.ntwkTypCd) {
			      	    				return render_data = render_data.concat(topoCdListCombo["0002"]);
			      	    			}else {
			      	    				return render_data.concat({value : data.topoSclCd, text : data.topoSclNm });
			      	    			}
		      	    			}
	      	    			}
	      	    		}
	      	    	}
	      	    	// 망종류가 휘더망링, IBRR링, IBS링, L3_Switch링인 경우 망종류는 수정불가능
			      	,allowEdit : function(value, data){
							var editData = data._state.editing;
							if(nullToEmpty(editData[mapping.columnIndex])!= ""){
								return true;
							}else{
								//if(!editMode){	//편집모드(작업정보탭)가 아닌 경우에만 적용한다 (2019.05.21)
									if( value == '011' || value == '012' || value == '015' || value == '030' ) {
										return false;
									} else{
										return true;
									}
								//}
							}
					},
//					, allowEdit : function(value, data, mapping){
//						var editData = data._state.editing;
//						if (data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')){ // ADAMS 연동 고도화
//							if(nullToEmpty(editData[mapping.columnIndex])!= ""){//원래소스
//								return true;
//							}else{
//								if(!editMode){	//편집모드(작업정보탭)가 아닌 경우에만 적용한다 (2019.05.21)
//									if( value == '011' || value == '012' || value == '015' || value == '030' ) { 
//										return false;
//									} else{
//										return true;
//									} 
//								}
//							} //여기까지
//						}else{
//							return false;
//						}
//					},
	      	    	editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data, mapping){
	      	    			var render_data = [];
	      	    			var currentData = AlopexGrid.currentData(data);
	      	    			if (data.mgmtGrpCd == '0001') {
	      	    				var editData = data._state.editing;
		      	    			if( currentData.ntwkTypCd ) {  // && nullToEmpty(editData[mapping.columnIndex])!= "" ) {
		      	    				return render_data = render_data.concat(topoCdListCombo[currentData.ntwkTypCd]);
		      	    			}else {
		      	    				return render_data.concat({value : data.topoSclCd, text : data.topoSclNm });
		      	    			}
	      	    			} else {
		      	    			if(currentData.ntwkTypCd) {
		      	    				return render_data = render_data.concat(topoCdListCombo["0002"]);
		      	    			}else {
		      	    				return render_data.concat({value : data.topoSclCd, text : data.topoSclNm });
		      	    			}
	      	    			}
//	      	    			
//	      	    			if (data.mgmtGrpCd == '0001' || (data.topoSclCd == '030' || data.topoSclCd == '031') ) {
//	      	    				if(topoCdListCombo[currentData.ntwkTypCd]){
//		      	    				return render_data = render_data.concat( topoCdListCombo[currentData.ntwkTypCd] );
//	      	    				} else{
//	      	    					return render_data = render_data.concat( {value : '', text : cflineCommMsgArray['none']} );
//	      	    				}
//	      	    			} else {
//	      	    				return TopoDataSkb;
//	      	    			}
	      	    		}, attr : {
  			 				style : "width: 130px;min-width:130px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				},
	  				refreshBy : 'ntwkTypCd'
	      	    }

	      	    , {key : 'eqpInfDivCd',	title : '선번장비구분'  /*선번장비구분*/,	hidden : true}

	      	    , {key : 'eqpInfDivNm',	title : '선번장비구분명'  /*선번장비구분명*/,	hidden : true}
	      	    /* 장비구분 추가 */
	      	    , {key : 'eqpDivCd',	
	      	    	title : cflineMsgArray['eqpDivNm'] /* 장비구분*/, align:'center',	width: '120px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(EqpDivData.length > 1) {
		      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				return render_data = render_data.concat(EqpDivData);
	      	    			}else {
	      	    				
	      	    				return render_data.concat({value : data.eqpDivCd, text : data.eqpDivNm });
	      	    			}
	      	    		}
	      	    	}
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(EqpDivData);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 70px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'topoCfgMeansCd',	
	      	    	title : em + cflineMsgArray['topologyConfigurationMeans'] /*토폴로지구성박식*/, align:'center',	width: '120px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C02501Data.length > 1) {
		      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				return render_data = render_data.concat(C02501Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.topoCfgMeansCd, text : data.topoCfgMeansCdNm });
	      	    			}
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(C02501Data);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 70px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'otdrLnkgMeansCd',	
	      	    	title : cflineMsgArray['otdrLnkgMeans'] /*OTDR연동방식*/, align:'center',	width: '170px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C02533Data.length > 1) {
		      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				return render_data = render_data.concat(C02533Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.otdrLnkgMeansCd, text : data.otdrLnkgMeansCdNm });
	      	    			}
	      	    		}
	      	    	}
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(C02533Data);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 160px;min-width:160px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'otdrSctnNm',	title : cflineMsgArray['otdrSctnNm'] /* OTDR구간명 */, align:'left',	width: '250px', editable: true}
	      	    , {key : 'mwUsgDivCd', 
	      	    	title : cflineMsgArray['microwaveUsageDivision'] /* M/W 용도구분 */, align:'center', width:'90px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C02504Data.length > 1) {
	      	    				return render_data = render_data.concat(C02504Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.mwUsgDivCd, text : data.mwUsgDivCdNm });
	      	    			} 
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031') ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(C02504Data);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 70px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'atnrVal', title : cflineMsgArray['attenuatorVal'] /* 감쇠기값 */, align:'right', width:'90px', 
	      	    	render:{type: "string", rule : "comma"}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable : {  type: 'text' , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "5"}, styleclass : 'num_editing-in-grid'}}
	      	    , {key : 'nodeNum',	title : cflineMsgArray['nodeNum'] /* 노드 수 */,	align:'right',	width: '90px'}
	      	    , {key : 'ntwkCapaCd',	
	      	    	title : em + cflineMsgArray['capacity'] /*용량*/, align:'center',	width: '90px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C00194Data.length > 1) {
	      	    				return render_data = render_data.concat(C00194Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.ntwkCapaCd, text : data.ntwkCapaNm });
	      	    			}
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			return C00194Data;
	      	    		}, attr : {
  			 				style : "width: 70px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'ringSwchgMeansCd',		      	    	
	      	    	title : em + cflineMsgArray['ringSwchgMeansCd'] /*절체방식*/, align:'center',	width: '120px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C00223Data.length > 1) {
		      	    			if(data.topoSclCd == "031"){
		      	    				return render_data = render_data.concat(C00223DataIn031);
		      	    			}else {
		      	    				return render_data = render_data.concat(C00223DataNotIn031);
		      	    			}
	      	    			}else {
	      	    				return render_data.concat({value : data.ringSwchgMeansCd, text : data.ringSwchgMeansNm });
	      	    			}
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001'  || (data.topoSclCd == '030' || data.topoSclCd == '031') ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			var currentData = AlopexGrid.currentData(data);
	      	    			if(currentData.topoSclCd == "031"){
	      	    				return render_data = render_data.concat( C00223DataIn031 );
	      	    			}else{
	      	    				return render_data = render_data.concat( C00223DataNotIn031 );
	      	    			}
	      	    		}, attr : {
  			 				style : "width: 100px;min-width:100px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				},
	  				refreshBy : 'topoSclCd'
	      	    }
	      	    , {key : 'sctnDistK', title : cflineMsgArray['sectionDistanceK'] /* 구간거리(Km)(준공거리) */, align:'right', width:'160px',
	      	    	render:{type: "string", rule : "comma"}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{type:"text", attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "15"}, styleclass : 'num_editing-in-grid'}}
	      	    , {key : 'mwFreqCd', 
	      	     	title : cflineMsgArray['microwaveFrequency'] /* 주파수 */, align:'center', width:'90px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C02505Data.length > 1) {
	      	    				return render_data = render_data.concat(C02505Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.mwFreqCd, text : data.mwFreqCdNm });
	      	    			} 
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(C02505Data);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 70px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'modulMeansCd', 
	      	     	title : cflineMsgArray['modulationMeans'] /* 변조방식 */, align:'left', width:'200px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			var render_data = [];
	      	    			if(C02507Data.length > 1) {
	      	    				return render_data = render_data.concat(C02507Data);
	      	    			}else {
	      	    				return render_data.concat({value : data.modulMeansCd, text : data.modulMeansCdNm });
	      	    			} 
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(C02507Data);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 180px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	    , {key : 'mwBdwhCd', 
      	     	    title : cflineMsgArray['microwaveBandwidth'] /* 대역폭 */, align:'left', width:'200px',
      	    	    render : {
      	    		    type : 'string',
      	    		    rule : function(value, data) {
      	    		    	var render_data = [];
      	    		    	if(C02506Data.length > 1) {
      	    		    		return render_data = render_data.concat(C02506Data);
      	    		    	}else {
      	    		    		return render_data.concat({value : data.mwBdwhCd, text : data.mwBdwhCdNm });
      	    		    	} 
      	    		    }
      	    	    }
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	  	    				render_data = render_data.concat(C02506Data);
	      	    			return render_data;
	      	    		}, attr : {
  			 				style : "width: 180px;min-width:70px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
      	        }
	      	    , {key : 'chnlCnt', title : cflineMsgArray['channelCount'] /* 채널수(가용최대채널수) */, align:'right', width:'160px' 
	      	    	, render : function(value, data, render, mapping, grid){
	      	    		return '  <div style="width:100%"> '+ nullToEmpty(value) + ' <span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnChnlSch" type="button" ></button></div>';
	      	    		
				    }
	      	    }
	      	    , {key : 'uprMtsoAtnSz', title : cflineMsgArray['upperMtsoAntennaSize'] /* 상위국안테나Size(ft)) */, align:'right', width:'130px'
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{type:"text"}}
	      	    , {key : 'lowMtsoAtnSz', title : cflineMsgArray['lowerMtsoAntennaSize'] /* 하위국안테나Size(ft) */, align:'right', width:'130px'
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{type:"text"}}
	      	    
	      	    // 16.11.10 추가사항
	      	    , {title : cflineMsgArray['ring']+cflineMsgArray['blockDiagram'] /*링구성도*/,	align:'center',	width: '65px'
	      	    		, render : function(value, data, render, mapping) {
	      	    			if(data.topoSclCd == "030" || data.topoSclCd == "031") {
	      	    				// 휘더망링, 가입자망링일 경우 비활성화
	      	    				return '<div style="width:100%"><span class="Valign-md"></span></div>';
	      	    			} else {
	      	    				return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnRingAddDropPop" type="button"></button></div>';
	      	    			}
	      	    		}
	      	    	}
	      	    , {key : 'repNtwkLineNo',	title : cflineMsgArray['feederLinkRing'] /*휘더망링*/,	align:'center',	hidden : true} 
	      	    , {key : 'repNtwkLineNm',	title : cflineMsgArray['feederLinkRing'] /*휘더망링명*/,	align:'center',	width: '160px'
	      	    	, render : function(value,data){ return data.repNtwkLineNm; }
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
					, editable: function(value, data, render, mapping, grid){
						if(data["topoSclCd"] == "031"){
							var celStr = "";
						    if (nullToEmpty(data.repNtwkLineNm) != "") {    	            				    	 
						    	celStr = value;
						    }
						    celStr = searchBtnStyle(celStr, "repNtwkLineNm", "btnRepNtwkLineSch","110px");
						    return celStr;
					    } else {
					    	return "";
					    }
					}
					, editedValue : function (cell) { return $(cell).find('input').val(); }
					, refreshBy : function(previousValue, changedValue, changedKey, changedData, changedColumnMapping){
			  			if(changedKey == "topoSclCd"){
			  				changedData.topoSclCd = changedValue;
			  				changedData.repNtwkLineNo = "";
			  				changedData.repNtwkLineNm = "";
			  				return true;
			  			}else{ 
			  				return false;
			  			}
			  		}
				}

	    		, {key : 'crrtYn'	        ,title : cflineMsgArray['ringMgmtCrtt'] /* 링관리현행화 */			,align:'center', width: '120px',
	    			render : {
	    				type : 'string',
	    				rule : function(value, data) {
	    					var render_data = [];
	    						if (ynListData.length > 1) {
	    							return render_data = render_data.concat(ynListData);
	    						} else {
	    							return render_data.concat({value : data.value,text : data.text });
	    						}
	    				}
	    			}
	    		//  	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	    			, editable : {type : 'select',rule : function(value, data) {return ynListData; }
	    					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
	    			},
	    			editedValue : function(cell) {
	    				return $(cell).find('select option').filter(':selected').val(); 
	    			}
	    		}	      
	    		, {key : 'ringMgmtObjYn',	title :  em + cflineMsgArray['ringCreateObject'] /* 링생성대상 */,	align:'center',	width: '120px',
	    			render : {
	    				type : 'string',
	    				rule : function(value, data) {
	    					var render_data = [];
	    						if (ringMgmtObjYnGridList.length > 1) {
	    							return render_data = render_data.concat(ringMgmtObjYnGridList);
	    						} else {
	    							return render_data.concat({value : data.value,text : data.text });
	    						}
	    				}
	    			}
	    		//	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	    			, editable : {type : 'select',rule : function(value, data) {return ringMgmtObjYnGridList; }
	    					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
	    			},
	    			editedValue : function(cell) {
	    				return $(cell).find('select option').filter(':selected').val(); 
	    			}
	    		}	    
	    		, {key : 'ringNormRegYnNm',	title : cflineMsgArray['ringCreateYesOrNo'] /* 링생성여부 */,	align:'center',	width: '120px'}
	    		
	    		
	    		// ADD 201811 : 전체, SKT로 검색인 경우 - 청약번호, 개통일자 컬럼 추가 (LINE_APPLT_NO, LINE_OPEN_DT) 
	    		, {key : 'lineAppltNo',	title : cflineMsgArray['lineAppltNo']   ,	align:'center',	width: '120px', hidden: $('#mgmtGrpCd').val() == '0002' ? true : false}
	    		, {key : 'lineOpenDt',	title : cflineMsgArray['lineOpenDt']   ,	align:'center',	width: '81px', hidden: $('#mgmtGrpCd').val() == '0002' ? true : false}
	    		, {key : 'lineTrmnSchdDt',	title:cflineMsgArray['removeScheduleDate'],		align:'center', 	width:'94px'}
	    		
	      	    , {key : 'hdofcOrgId', title : em + cflineMsgArray['managementHeadOffice'] /*관리본부*/, align: 'center', width: '130px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			if(sType !=  'WorkInfo'){
	      	    				return mgmtOrgData
	      	    			} else {
	      	    				var render_data = [];
		      	    			if (data.mgmtGrpCd == '0001') {
		      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
		      	    				render_data = render_data.concat(mgmtOrgSktData);
		      	    				return render_data;
		      	    			} else {
		      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
		      	    				render_data = render_data.concat(mgmtOrgSkbData);
		      	    				return render_data;
		      	    			}
	      	    			}
	      	    		}
	      	    	}
	      	    //	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			if (data.mgmtGrpCd == '0001') {
	      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				render_data = render_data.concat(mgmtOrgSktData);
	      	    				return render_data;
	      	    			} else {
	      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
	      	    				render_data = render_data.concat(mgmtOrgSkbData);
	      	    				return render_data;
	      	    			}
	      	    			
	      	    		}, attr : {
  			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
  			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val(); 
	  				}
	      	    }
	      	  , {key : 'teamOrgId', title : em + cflineMsgArray['managementTeam'] /*관리팀*/, align:'center',	width: '170px',
	      	    	render : {
	      	    		type : 'string',
	      	    		rule : function(value, data) {
	      	    			if(sType !=  'WorkInfo'){
	      	    				return mgmtTeamData
	      	    			} else {
	      	    				var render_data = [];
		      	    			if (data.mgmtGrpCd == '0001') {
		      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
		      	    				render_data = render_data.concat(mgmtTeamSktData);
		      	    				return render_data;
		      	    			} else {
		      	    				render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
		      	    				render_data = render_data.concat(mgmtTeamSkbData);
		      	    				return render_data;
		      	    			}
	      	    			}
	      	    		}
	      	    	}
	      	  	//	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031')  ? true : false); }  // ADAMS 연동 고도화
	      	    	, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			var render_data = [];
	      	    			var currentData = AlopexGrid.currentData(data);
      	    				if(teamDataListCombo[currentData.hdofcOrgId]){
	      	    				return render_data = render_data.concat( teamDataListCombo[currentData.hdofcOrgId] );
      	    				} else{
      	    					return render_data = render_data.concat( {value : '', text : cflineCommMsgArray['select'] /* 선택 */} );
      	    				}
	      	    		}, attr : {
			 				style : "width: 150px;min-width:130px;padding: 2px 2px;"
			 			}
	      	    	},
	  				editedValue : function(cell) {
	  					return $(cell).find('select option').filter(':selected').val();
	  				},
	  				refreshBy : 'hdofcOrgId'
	      	    }
	    		, {key : 'ringMgmtWoRsn',	title : cflineMsgArray['withoutReason'] /* 제외사유 */,	align:'left',	width: '200px', editable:{type:"text"}
		    		, allowEdit : function(value, data, mapping){
						if(data.ringMgmtObjYn == 'Y' ) {
							return false;
						} else{
				          	//TODO 이전으로 20240911
							//if(data.mgmtGrpCd=='0001' || (data.topoSclCd == '030' || data.topoSclCd == '031') ){return true;}else{return false;} // ADAMS 연동 고도화
							return true;
						}  
					}
	    		}
	      	    // 2019.06.14 상하위국사표기
		    	, {key : 'uprTopMtsoIdNm', title : cflineMsgArray['uprTopMtsoOfficeNm'] /*상위전송실*/ ,align:'center', width: '110px'}
		    	, {key : 'lowTopMtsoIdNm', title : cflineMsgArray['lowTopMtsoOfficeNm'] /*하위전송실*/ ,align:'center', width: '110px'}
	      	    , {key : 'frstRegUserId',	title : cflineMsgArray['registrant'] /*등록자*/,	align:'center',	width: '120px'}
	      	    , {key : 'frstRegUserNm',	title : cflineMsgArray['registrantName'] /*등록자이름*/,	align:'center',	width: '120px'}
	      	    , {key : 'frstRegOrgNm',	title : cflineMsgArray['belongTo'] /*등록자소속*/,	align:'center',	width: '120px'}
	      	    , {key : 'frstRegDate',	title : cflineMsgArray['registrationDate'] /*등록일자*/,	align:'center',	width: '81px'}
	      	    , {key : 'lastChgUserId',	title : cflineMsgArray['changer'] /*변경자*/,	align:'center',	width: '120px'}
	      	    , {key : 'lastChgUserNm',	title : cflineMsgArray['changerName'] /*변경자이름*/,	align:'center',	width: '120px'}
	      	    , {key : 'lastChgOrgNm',	title : cflineMsgArray['belongTo'] /*변경자소속*/,	align:'center',	width: '120px'}
	      	    , {key : 'lastChgDate',	title : cflineMsgArray['modificationDate'] /*수정일자*/,	align:'center',	width: '81px'}
	      	    , {key : 'wkSprDivCd' , title :cflineMsgArray['weekSpareDivisionCode']/*주예비구분코드*/, hidden: true}
	      	    , {key : 'ntwkLnoGrpSrno' , title :cflineMsgArray['network']+cflineMsgArray['lno']+cflineMsgArray['groupSerialNumber'] /*네트워크선번그룹일련번호*/, hidden: true}
	      	    //, {key : 'eqpSctnId',	title : '노드명',	align:'left',	width: '170px'} //추가함 개통일자:lineOpenDt

	      	    , {key : 'workMgmtYn' , title :"workMgmtYn"/*작업전환*/, hidden: true}
	      	    , {key : 'aprvDt',	title : '공사정산날짜'   ,	align:'center',	width: '81px', hidden: true}  //APRV_DT(공사정산날짜 추가) - 20200903
	    		
	      	];
		return mapping;
    }
    
    // select 조회조건 코드 세팅
    function setSelectCode() {
    	//var param = {"userMgmtNm": nullToEmpty($('#userMgmtCd').val())};
    	
		$('#ringMgmtObjYn').clear();
		$('#ringMgmtObjYn').setData({data : ringMgmtObjYnSearchList});
		$('#crrtYn').clear();
		$('#crrtYn').setData({data : selectBoxYnList});
		$('#ringNormRegYn').clear();
		$('#ringNormRegYn').setData({data : selectBoxYnList});
    	var param = {"userMgmtNm": ''};
    	setSearchCode("hdofcCd", "teamCd", "topMtsoIdList");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', param, 'GET', 'NtwkTypData'); // 망구분 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', param, 'GET', 'TopoData'); // 망종류 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data'); // 용량 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188Data'); // 관리그룹
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00223', null, 'GET', 'C00223Data'); // 절체방식
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00262', null, 'GET', 'C00262Data'); // 회선상태
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02501', null, 'GET', 'C02501Data'); // 토폴로지구성방식
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02504', null, 'GET', 'C02504Data'); // M/W용도구분
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02505', null, 'GET', 'C02505Data'); // 주파수
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02506', null, 'GET', 'C02506Data'); // 대역폭
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02507', null, 'GET', 'C02507Data'); // 변조방식
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02533', null, 'GET', 'C02533Data'); // OTDR연동방식코드  2022-05-17 추가
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypTopoCode', null, 'GET', 'getNtwkTypTopoCode');	// 망구분 망종류 콤보데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getMgmtOrgTeam', null, 'GET', 'getMgmtOrgTeam');	// 관리 본부/팀 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getEqpDivList', param, 'GET', 'EqpDivData');  //장비구분 - 2020-05-12
    		
    	// 사용자 소속 전송실
    	searchUserJrdtTmofInfo("topMtsoIdList");
    }
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300,
                callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
               	}
            });
    }
    
    // mgmtGrpCd: 관리그룹, hdofcCd: 본부, teamCd: 팀, topMtsoIdList: 전송실, mtso: 국사
    function setEventListener() {
    	//탭 선택 이벤트
    	$("#basicTabs").on("tabchange", function(e,index){
    		if(index == 0){
    			$("#"+gridId).alopexGrid("viewUpdate");
    			var selectedId = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
    			btnEnableProc(gridId, "btnDupMtsoMgmt", "btnWorkCnvt", "A");
    			editMode = false;
    		}else if(index == 1){
    			$("#"+gridWorkId).alopexGrid("viewUpdate");
    			var selectedId = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
    			btnEnableProc(gridWorkId, "btnDupMtsoMgmt", "btnWorkCnvt", "B");
    			editMode = true;
    		}
    	});
    	
        // 링정보 그리드에서 링 선택시 작업전환버튼 활성화, 선택해제시 비활성화
        $('#'+gridId).on("click", function(e){
        	btnEnableProc2(gridId, "btnWorkCnvt");
        });
        
        // 작업정보에서 작업정보 선택시 전송실설정버튼 활성화, 선택해제시 비활성화
        $('#'+gridWorkId).on("click", function(e){
						
			var object = AlopexGrid.parseEvent(e);
			var dataObj = object.data;
	    	var rowIndex = dataObj._index.row;
	    	
	    	// [수정] 20181218 해지요청중 endEdit
			if ( dataObj.ntwkStatCd == "04" && ( dataObj.topoSclCd == "033" || dataObj.topoSclCd == "035" || dataObj.topoSclCd == "036") ) {
				$('#'+gridWorkId).alopexGrid('endEdit', {_index : { row : rowIndex}});
			}
			
			// ADAMS 연동 고도화
          	//TODO 이전으로 20240911
//			if($('#mgmtGrpCd').val() == '0002' || $('#mgmtGrpCd').val() == ''
//				 && (dataObj.topoSclCd != '030' || dataObj.topoSclCd != '031') ){
//		 		 $('#'+gridWorkId).alopexGrid('endEdit');
//			}
			
        	var selectedId = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
        	btnEnableProc2(gridWorkId, "btnDupMtsoMgmt");
        	
			if(selectedId.length > 0) {
				$('#btnDelWorkInfo').setEnabled(true);
				$('#btnUpdateWorkInfo').setEnabled(true);
			}else {
				$('#btnDelWorkInfo').setEnabled(false);
				$('#btnUpdateWorkInfo').setEnabled(false);
				//$('#btnApproval').setEnabled(false);
			}
			
//			if(selectedId.length > 0) {
//
//				$('#btnRingWritePop').setEnabled(true);
//				
//				// ADAMS 연동 고도화
//				if($('#mgmtGrpCd').val() == "0001" && dataObj.mgmtGrpCd == "0001" && $('#mgmtGrpCd').val() !=''){
////				if(dataObj.mgmtGrpCd == "0001"){
//					$('#btnDelWorkInfo').setEnabled(true);
//					$('#btnUpdateWorkInfo').setEnabled(true);
//				}else{
//					$('#btnDelWorkInfo').setEnabled(false);
//					$('#btnApproval').setEnabled(false);  // ADAMS 연동 고도화
////					$('#btnDupMtsoMgmt').setEnabled(false); // ADAMS 연동 고도화
//					$('#btnUpdateWorkInfo').setEnabled(false); // ADAMS 연동 고도화
//					//$('#btnRingWritePop').setEnabled(false); // ADAMS 연동 고도화
//			    }
//				
//				$('#btnDupMtsoMgmt').setEnabled(true); // ADAMS 연동 고도화
////				$('#btnUpdateWorkInfo').setEnabled(true);
//				
//			}else {
//				$('#btnDelWorkInfo').setEnabled(false);
//				$('#btnUpdateWorkInfo').setEnabled(false);
//				$('#btnDupMtsoMgmt').setEnabled(false); // ADAMS 연동 고도화
//			}
        });
        
        // 관리그룹 선택시
    	$('#mgmtGrpCd').on('change',function(e){
    		//관리그룹 선택에 따른 분보, 팀, 전송실, 국사 설정
    		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
    		var mgmtGrpCd =$('#mgmtGrpCd').val();
    		if(mgmtGrpCd == '0001') {
    			mgmtGrpCd = 'SKT';
    		}else if(mgmtGrpCd == '0002'){
    			mgmtGrpCd = 'SKB';
    		}else {
    			mgmtGrpCd = '';
    		}
    		

//    		if(mgmtGrpCd == '0001') {
//    			mgmtGrpCd = 'SKT';
//    			$('#btnRingWritePop').setEnabled(true);  // ADAMS 연동 고도화
//    		}else if(mgmtGrpCd == '0002'){
//    			mgmtGrpCd = 'SKB';
//    			//가입자망링, 휘더망링 선택시에는 등록가능 -> 2020-04-02
//    			if($('#topoSclCd').val() == '030' || $('#topoSclCd').val() == '031'){
//    				//$('#btnRingWritePop').setEnabled(true); // ADAMS 연동 고도화
//    				$('#btnDelWorkInfo').setEnabled(true);
//    			} else {
//    				//$('#btnRingWritePop').setEnabled(false); // ADAMS 연동 고도화
//    				//$('#btnDupMtsoMgmt').setEnabled(false); // ADAMS 연동 고도화
//    				$('#btnDelWorkInfo').setEnabled(false);
//    			}
//    		}else {
//    			mgmtGrpCd = '';
//    			$('#btnRingWritePop').setEnabled(false); // ADAMS 연동 고도화
//    			$('#btnDupMtsoMgmt').setEnabled(false); // ADAMS 연동 고도화
//    			$('#btnDelWorkInfo').setEnabled(false);
//    		}
    		var param = {"userMgmtNm": mgmtGrpCd};
    		
    		var comboNtwkTypData = [];
    		var comboTopoData = [];
    		var comboMgmtOrgData = [{value: "",text: cflineCommMsgArray['all'] /* 전체*/}];
    		var comboMgmtTeamData = [{value: "",text: cflineCommMsgArray['all'] /* 전체*/}];
    		
    		if ($(this).val() == '') {
    			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypData);
    			comboTopoData = comboTopoData.concat(TopoData);
    			comboMgmtOrgData = comboMgmtOrgData.concat(mgmtOrgData);
    			comboMgmtTeamData = comboMgmtTeamData.concat(mgmtTeamData);
    		} else if ($(this).val() == '0001') {
    			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkt);
    			comboTopoData = comboTopoData.concat(TopoDataSkt);
    			comboMgmtOrgData = comboMgmtOrgData.concat(mgmtOrgSktData);
    			comboMgmtTeamData = comboMgmtTeamData.concat(mgmtTeamSktData);
    		} else if ($(this).val() == '0002') {
    			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkb);
    			comboTopoData = comboTopoData.concat(TopoDataSkb);
    			comboMgmtOrgData = comboMgmtOrgData.concat(mgmtOrgSkbData);
    			comboMgmtTeamData = comboMgmtTeamData.concat(mgmtTeamSkbData);
    		}
    		
    		// 망구분
			$('#ntwkTypCd').clear();
    		$('#ntwkTypCd').setData({data : comboNtwkTypData});

    		// 망종류
			$('#topoSclCd').clear();
    		$('#topoSclCd').setData({data : comboTopoData});
    		
    		// 관리본부
			$('#hdofcOrgId').clear();
    		$('#hdofcOrgId').setData({data : comboMgmtOrgData});

    		// 관리팀
			$('#teamOrgId').clear();
    		$('#teamOrgId').setData({data : comboMgmtTeamData});
    		
        	// 망종류 변경
        	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', param, 'GET', 'NtwkTypData'); // 망구분 데이터
        	// 망구분 변경
        	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', param, 'GET', 'TopoData'); // 망종류 데이터
    		
    		// ADD 201811 : 선택 시 검색조건, 그리드의 컬럼 추가 및 제거
    		if($('#mgmtGrpCd').val() == '0002'){
    			// skb : dataGrid 에서 청약번호, 개통일자 제거, 검색조건에서 청약번호 제거
    			$('#dataGrid').alopexGrid("updateColumn", {hidden : true}, ['lineAppltNo', 'lineOpenDt']);
    			$('#lineAppltNo').val(""); //SKT인경우 청약번호 검색조건
				$("#lineAppltNoDiv").hide();           			
				$("#mgmtOnrNmDiv").show();     
        		$('#mgmtOnrNm').setSelected("전체");
        		$('#mgmtOnrNm').val("전체");
    		} else {
    			// 전체, skt : dataGrid 에서 청약번호, 개통일자 추가
    			$('#dataGrid').alopexGrid("updateColumn", {hidden : false}, ['lineAppltNo', 'lineOpenDt']);
				$("#lineAppltNoDiv").show();	     			
				$("#mgmtOnrNmDiv").hide();          			
				$("#mgmtOnrNm").val("");         		
    		}
    		
    		// 관리그룹에 따른 승인/해지 버튼 명칭 변경
            if ($('#mgmtGrpCd').val() == "0001") {
            	btnRingTrmnNm = cflineMsgArray['approval'] +"/" + cflineMsgArray['trmn'];
            }
            else {
            	btnRingTrmnNm = cflineMsgArray['trmn'];	
            }
            $("#btnDelWorkInfo").html(btnRingTrmnNm);
            
            if($('#mgmtGrpCd').val() != "0002") {
            	$('#'+gridId).alopexGrid('hideCol', mgmtOnrNmCol);
            	$('#'+gridWorkId).alopexGrid('hideCol', mgmtOnrNmCol);
            } else {
            	$('#'+gridId).alopexGrid('showCol', mgmtOnrNmCol);
            	$('#'+gridWorkId).alopexGrid('showCol', mgmtOnrNmCol);
            }
      	}); 
    	
        // 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "topMtsoIdList", "mtso");
      	});    	 
    	
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "topMtsoIdList", "mtso");
      	});    
    	
  		// 망종류 선택시
    	$('#topoSclCd').on('change',function(e){
    		if($('#topoSclCd').val() == '039' ){
    			$('#'+gridId).alopexGrid('showCol', mwPtpInfoCol);
	    		$('#'+gridWorkId).alopexGrid('showCol', mwPtpInfoCol);
    		} else {
    			$('#'+gridId).alopexGrid('hideCol', mwPtpInfoCol);
	    		$('#'+gridWorkId).alopexGrid('hideCol', mwPtpInfoCol);
    		}
      	}); 

  		// 망구분 선택시 기간망 선택시 OTDR연동방식 표시 2022-05-17
    	$('#ntwkTypCd').on('change',function(e){
    		if($('#ntwkTypCd').val() == '001' ){
    			$('#'+gridId).alopexGrid('showCol', ntwkGiganInfoCol);
	    		$('#'+gridWorkId).alopexGrid('showCol', ntwkGiganInfoCol);
    		} else {
    			$('#'+gridId).alopexGrid('hideCol', ntwkGiganInfoCol);
	    		$('#'+gridWorkId).alopexGrid('hideCol', ntwkGiganInfoCol);
    		}
      	});  
    	
	 	// 국사 propertychange
     	$('#mtsoNm').on('propertychange input', function(e){
     		$("#mtsoCd").val("");
     	});
     	
     	// 엔터 이벤트
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			infoScrollBottom = true;
     			workInfoScrollBottom = true;
     			searchYn = true;
     			addData = false;
    			columnRingInfo = columnMapping("RingInfo");
    			columnWorkInfo = columnMapping("WorkInfo");
     			setGrid(1,pageForCount,"All");
     		}
     	});
     	
     	// 좌장비
     	$('#lftEqpNm').on('propertychange input', function(e){
     		inputEnableProc("lftEqpNm","lftPortNm","");
     	});
     	
     	// 우장비
     	$('#rghtEqpNm').on('propertychange input', function(e){
     		inputEnableProc("rghtEqpNm","rghtPortNm","");
     	});
     	
     	// 관리본부
     	$('#hdofcOrgId').on('change', function(e){
     		var selectedOrgId = $('#hdofcOrgId').val();
     		var changeTeamList = [{value: "",text: cflineCommMsgArray['all'] /* 전체*/}];
     		if(selectedOrgId == ''){
     			var userMgmtNm = $('#userMgmtCd').val();
 	    		var viewMgmtGrpCd = $('#mgmtGrpCd').val() == null ? userMgmtNm : $('#mgmtGrpCd').val();
 	    		if (viewMgmtGrpCd == '') {
 	    			changeTeamList = changeTeamList.concat(mgmtTeamData);
 	    		} else if (viewMgmtGrpCd == '0001') {
 	    			changeTeamList = changeTeamList.concat(mgmtTeamSktData);
 	    		} else if (viewMgmtGrpCd == '0002') {
 	    			changeTeamList = changeTeamList.concat(mgmtTeamSkbData);
 	    		}
     		} else {
     			for(i=0;i<mgmtTeamData.length;i++){
         			if( selectedOrgId == mgmtTeamData[i].uprOrgId ){
         				changeTeamList.push({value : mgmtTeamData[i].value, text : mgmtTeamData[i].text});
         			}else if(selectedOrgId == ''){
         				
         			}
         		}
     		}
			$('#teamOrgId').clear();			
			$('#teamOrgId').setData({data : changeTeamList});
     	});
     	
        //	링 정보 스크롤 시 페이징
        $('#'+gridId).on('scrollBottom', function(e){
        	addData = true;
        	if(infoScrollBottom){
        		setGrid(pageForCount,pageForCount,"RingInfo");
        	}
        	
    	});
        
        // 작업 정보 스크롤 시 페이징
        $('#'+gridWorkId).on('scrollBottom', function(e){
        	addData = true;
        	if(workInfoScrollBottom){
            	setGrid(pageForCount,pageForCount,"WorkInfo");
        	}

    	});
   	 	
     	// 그리드 휘더망링 propertychange
    	$('#'+gridWorkId).on('propertychange input', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var rowIndex = dataObj._index.row;
    		if(dataObj._key == "repNtwkLineNm"){
	    		$('#'+gridWorkId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "repNtwkLineNo");
    		}
    	});
    	
	    // 조회 
   	 	$('#btnSearch').on('click', function(e) {
   	 		infoScrollBottom = true;
   	 		workInfoScrollBottom = true;
			searchYn = true;
			addData = false;
			columnRingInfo = columnMapping("RingInfo");
			columnWorkInfo = columnMapping("WorkInfo");
			setGrid(1,pageForCount,"All");

//			$('#btnRingWritePop').setEnabled(true);
//			// ADAMS 연동 고도화
//			if($('#mgmtGrpCd').val() == "0001" && $('#mgmtGrpCd').val() != ""){
//				$('#btnDelWorkInfo').setEnabled(true);
//				$('#btnUpdateWorkInfo').setEnabled(true);
//			}else{
//				$('#btnDelWorkInfo').setEnabled(false);
//				$('#btnApproval').setEnabled(false);
//				//$('#btnDupMtsoMgmt').setEnabled(false);
//				//$('#btnUpdateWorkInfo').setEnabled(false);
//				//$('#btnRingWritePop').setEnabled(false);
//		    }
        })
        ;
   	 	//TODO
   	    // 조회 
	   	 $('#btnTest').on('click', function(e) {
		 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/sendcatvfdfuseinfo', null, 'GET', 'testBtn');
	     })
   	    // 조회 

	   	 $('#btnNewTest').on('click', function(e) {
      //{rghtEqpId=DV39072102667, lineNo=S001068706826, cstrCd=, lftPortNm=B-Ch02, lftEqpId=DV39072102668, ntwkLineNo=N000025519037, rghtPortNm=B-Ch01, aauDiv=2}
	  //{"rghtEqpId":"DV39072102667", "lineNo":"S001068706786", "cstrCd":"T24011927189764", "lftPortNm":"B-Ch02", "lftEqpId":"DV39072102668", "ntwkLineNo":"N000025519037", "rghtPortNm":"B-Ch04", "aauDiv":"1"}
	   		 var param = null;
		   		param =  { 	
		   				aauDiv: "1",	/* AAU회선구분코드 */
			   			cstrCd: "T24091239719984", //"T20072863138595",T24091239719984, T24091239710001
		   				ntwkLineNo: "N000017729546",	//N000025519037
		   				lineNo: "S001068706866",	//S001068706866
		   				rghtEqpId: "DV23113922297",/* COT 장비 DV39072102667 */
		   				rghtPortNm: "B-Ch02",	/* RT 장비채널포트 */
		   				lftEqpId: "DV23113922298",/* RT 장비 DV39072102668 */
		   				lftPortNm: "B-Ch04",	/* RT 장비채널포트 */
		   		};
		   		cflineShowProgressBody();
			 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/muxautoruactualizingapi', param, 'POST', 'testBtn');
			 		
		     })
	     ;
   	 	
	   	 $('#btnAddTest').on('click', function(e) {
		 		
	   		 var param = null;
		   		param =  { 	
		   				procDivVal: "ADD",
				 		ntwkLineNo: "N000025515546",
				 		etePathList:[	
				 		         {mtsoId: "MO01011027528",
				 				 eqpId: "DV10214535353",
				 				 portNm: "5",
				 				 nodeTypVal: "ST",
				 				 etePathSrno: 1},
				 				{mtsoId: "MO01013049396",
				 				 eqpId: "DV22314553675",
				 				 portNm: "2",
				 				 nodeTypVal: "PC",
				 				 etePathSrno: 2},
				 				{mtsoId: "MO01013051160",
				 				 eqpId: "DV22301834723",
				 				 portNm: "6",
				 				 nodeTypVal: "PC",
				 				 etePathSrno: 3},
				 				{mtsoId: "MO01013052801",
				 				 eqpId: "DV22352935451",
				 				 portNm: "4",
				 				 nodeTypVal: "ET",
				 				 etePathSrno: 4}
				 			  ]
		   		};
		   		cflineShowProgressBody();
			 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/skbScrbrNetRingInsertApi', param, 'POST', 'testBtn');
		     })
	     ;
   	 	// 전송실설정 
   	 	$('#btnDupMtsoMgmt').on('click', function(e) {
   	 		searchYn = false;
   	 		var element =  $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
   	 		var selectCnt = element.length;
   			
   			if(selectCnt <= 0){
   				alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
   			}else{
   				var paramMtso = null;
   				var paramList = [element.length];
   				var mgmtGrpStr = "";
   				var mgmtGrpChk = "N";
   					if(selectCnt==1){
   						paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "ntwkLineNoList":[element[0].ntwkLineNo], "topoSclCd":[element[0].topoSclCd]};
   					}else{
   						for(i=0;i<element.length;i++){
   							paramList[i] = element[i].ntwkLineNo;
   							if(i==0){
   								mgmtGrpStr = element[0].mgmtGrpCd;
   							}
   							if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
   								mgmtGrpChk = "Y";
   							}
   						}
   						if(mgmtGrpChk == "Y"){
//   							alert("여러 링에 대한 전송실 등록시는 동일 관리그룹만 가능합니다.");
   							alertBox('I', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
   							return;
   						}
   						paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "ntwkLineNoList":paramList};
   					}

   					$a.popup({
   		    		  	popid: "TmofEstPop",
   		    		  	title: cflineMsgArray['jrdtTmofEst'] /*관할전송실 설정*/,
   		    			url: $('#ctx').val()+'/configmgmt/cfline/TmofEstPop.do',
   		    			data: paramMtso,
   		    		    iframe: true,
   		    			modal: false,
   		    			movable:true,
   		    			windowpopup : true,
		    			width : 1000,
//		    			height :window.innerHeight * 0.9,
		    			height :800,
   		    			callback:function(data){
	    					if(data != null){
	    						if (data=="Success"){
	    	 						setGrid(1,pageForCount,"All");
	     						}
	    					}
   		    			}
   		    		});
   				}	 
        });
   	 	
   	 	// 작업전환
   	 	$('#btnWorkCnvt').on('click', function(e) {
   	 		fnWorkCnvt();
        });
   	 	
   	 	// 링정보 더블클릭시 상세 목록 조회(팝업). P101003
   	 	$('#'+gridId).on('dblclick', '.bodycell', function(e){
	 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
	 	 	//  배포 적용에 따라서 토글 변경
	 	 	showRingEditPop( gridId, dataObj );
   	 	});
   	 	
   	 	// 작업정보 더블클릭시 상세 목록 조회(팝업). P101003
   	 	$('#'+gridWorkId).on('dblclick', '.bodycell', function(e){
	 	 	var dataObj = AlopexGrid.parseEvent(e).data;
	 	 	showRingEditPop( gridWorkId, dataObj );
   	 	});
   	 	
   	 	// 엑셀업로드
   	 	$('#btnExcelPop').on('click', function(e) {
   	 		$a.popup({
	        	popid: 'RingExcelUploadPopup',
	        	title: cflineMsgArray['excelUpload'],
	        	iframe: true,
              	modal : false,
              	windowpopup : true,
	            url: $('#ctx').val() + '/configmgmt/cfline/RingExcelUpload.do',
	            data: null,
	            width : 800,
	            height : 350,
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            callback: function() {
	           	}
	   	 	  ,xButtonClickCallback : function(el){
		 			alertBox('W', cflineMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
		 			return false;
		 		}
	       });
   	 	});
   	 	
		// 해지 
		$('#btnDelWorkInfo').on('click', function(e) {
		    // 선번정보 존재 체크후 선번정보 없는경우만 해지로직 타도록 <= 1. 선로존재여부 체크하지 않고 해지
			fnLineTerminate();
			//checkLnSctnInfo();
		});
		
		// 작업정보저장
		$('#btnUpdateWorkInfo').on('click', function(e){
			fnUpdateWorkInfo();
		});
		
		// 16.11.10 추가. --링구성도 클릭--
		$('#'+gridId).on('click', '#btnRingAddDropPop', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			showRingAddDropPop(dataObj.ntwkLineNo, dataObj.ntwkLnoGrpSrno);
		});
		
		$('#'+gridWorkId).on('click', '#btnRingAddDropPop', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data; 
			showRingAddDropPop(dataObj.ntwkLineNo, dataObj.ntwkLnoGrpSrno);
		});
    	// 20171116 E2E,시각화편집 버튼 클릭 이벤트
    	$('#'+gridId).on('click', '#btnE2ePop', function(e){  
			intgE2ETopo(gridId);
		}).on('click', '#btnServiceLIneInfoPop', function(e){  
			var dataObj = AlopexGrid.parseEvent(e).data;
			showPopRing( gridId, dataObj, "N");
		});
    	$('#'+gridWorkId).on('click', '#btnE2ePop', function(e){  
			intgE2ETopo(gridWorkId);
		}).on('click', '#btnServiceLIneInfoPop', function(e){  
			var dataObj = AlopexGrid.parseEvent(e).data;
			showPopRing( gridWorkId, dataObj, "Y");
		});		
		// 휘더망링 검색
		$('#'+gridWorkId).on('click', '#btnRepNtwkLineSch', function(e){
	 		showRingSearchPop(e);
		});
	   	$('#'+gridWorkId).on('keyup', '#repNtwkLineNm',function(e){
	   		if(e.keyCode == 13) {
	   			showRingSearchPop(e);
	   		}
	   	});
	   	
	    // 채널수 검색
		$('#'+gridId).on('click', '#btnChnlSch', function(e){
			searchChnl(e, gridId);
		});
		$('#'+gridWorkId).on('click', '#btnChnlSch', function(e){
			searchChnl(e, gridWorkId);
		});
	   	
	   	// 링생성대상을 제외대상이 아닌 것을 선택했을때 제외사유를 지워준다.
        $('#'+gridWorkId).on('cellValueEditing', function(e){
        	var ev = AlopexGrid.parseEvent(e);    
        	var data = ev.data;
        	var mapping = ev.mapping;
        	if ( ev.mapping.key == "ringMgmtObjYn" ) {
        		var currVal = AlopexGrid.currentValue(data, "ringMgmtObjYn");
        		if(currVal != 'N'){
        			$('#'+gridWorkId).alopexGrid('cellEdit', null, {_index: {id: ev.data._index.id}}, 'ringMgmtWoRsn');
            		$('#'+gridWorkId).alopexGrid('endCellEdit', null, {_index: {id: ev.data._index.id}}, 'ringMgmtWoRsn');
        		}
        		$('#'+gridWorkId).alopexGrid('endEdit', {_index:{id: ev.data._index.id}});
        		$('#'+gridWorkId).alopexGrid("startEdit", {_index:{id: ev.data._index.id}} );
        	}
        	// 20190222 망종류를 휘더망으로 변경하지 못하도록 수정(휘더망은 링 등록시에만 선택할 수 있음)
			if ( ev.mapping.key == "topoSclCd" && ev.value == "030" && ev.prevValue != "030" ) {
				alertBox("I", "휘더망링은 링등록시에만 선택할 수 있습니다. ");
				$('#'+gridWorkId).alopexGrid('cellEdit', ev.prevValue, {_index:{id: ev.data._index.id}}, 'topoSclCd');
				$('#'+gridWorkId).alopexGrid("startEdit", {_index:{id: ev.data._index.id}} );
			} 
			
			/* 2019-11-07  7. [수정] 기간망 링 선번고도화
			 *   PTP (002) 혹은 M/W PTP링(039) 인경우 서로 변경 가능하고 다른 링으로 변경시 혹시 해당 링을 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
             *   MESH (020)의 경우 다른 링으로 변경시 혹시 해당 링을 사용중인 링 혹은 해당링이 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
             *   Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038), MSPP(032), Free(005), PTS링(009), L3_Switch링(012), T2IP링(016) 인경우 서로 변경 가능하고 다른 링으로 변경시 혹시 해당 링을 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
             * 망구분 변경시 서로 맞는 타입의 망종류를 기본 선택해줌
             
             * 2020-08-03  13. BC-MUX링, CWDM-MUX링 관련 작업
             *   BC-MUX링 (040) 혹은CWMA-MUX링(041) 인경우 서로 변경 가능하고 다른 링으로 변경시 혹시 해당 링을 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
             *   가입자망링 (031)의 경우 다른 링으로 변경시 혹시 해당 링을 사용중인 링 혹은 해당링이 사용중인 링이 있는경우 사용링 삭제후 변경하도록 유도
			 */
			if (mapping.key == "ntwkTypCd") {
				if (ev.value == "" || data._key != mapping.key) {
					return;
				}
				var chkTopoSclCd = data.topoSclCd;
				var orgValueTopoSclCd = data._original.topoSclCd;
				var orgNtwkTypCd = data._original.ntwkTypCd;
				var topoSclCdCombo = [];
				if (topoCdListCombo[ev.value]) {
					topoSclCdCombo = topoCdListCombo[ev.value] ;
				}
				
				var psbTopoSclCd = "";
				var okYn = true;
				var failMsg = "";
				
				// PTP (002) 혹은 M/W PTP링(039) 
				if (orgValueTopoSclCd == "002" || orgValueTopoSclCd == "039") { 
					// 변경가능한 값이 아닌경우 망구분에 따른 소속 망종류 중 변경가능한 것이 있는지 체크하여 해당 값으로 변경해줌
					if (chkTopoSclCd != "002" && chkTopoSclCd != "039" && chkTopoSclCd != "") {
						psbTopoSclCd = "002,039";
						okYn = false;
						failMsg = "PTP링 혹은 M/W PTP링은 다른 링에서 경유링으로 사용중인 경우 <br>경유링에서 삭제하거나 PTP링 <-> M/W PTP링 으로만 변경가능합니다. <br>"
						      + "( 해당링은 다른 링에서 " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
					}
				}
				// MESH (020)
				else if (orgValueTopoSclCd == "020") {
					if (chkTopoSclCd != "020" && chkTopoSclCd != "") {
						psbTopoSclCd = "020";
						okYn = false;
						failMsg = "MESH링은 다른 링에서 경유링으로 사용중인 경우 혹은 다른링을 경유링으로 사용중인<br> 경우 경유링에서 삭제 하거나 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
							 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 사용중, 다른링에서  " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
					}
				}
				// Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038), MSPP(032), Free(005), PTS링(009), L3_Switch링(012), T2IP링(016)
				else if (orgValueTopoSclCd == "001" || orgValueTopoSclCd == "011"  || orgValueTopoSclCd == "015"  || orgValueTopoSclCd == "037"  || orgValueTopoSclCd == "038"
					|| orgValueTopoSclCd == "032" || orgValueTopoSclCd == "005" || orgValueTopoSclCd == "009" || orgValueTopoSclCd == "012" || orgValueTopoSclCd == "016") {
					var sameRing = "001,011,015,037,038,032,005,009,012,016";
					if (sameRing.indexOf(ev.value) < 0 && ev.value != "") {
						psbTopoSclCd = sameRing;
						okYn = false;
						failMsg = "해당 링(Ring, IBS, IBRR, IVS, IVRR, MSPP, Free, PTS링, L3_Switch링, T2IP링)은 다른링을 경유링으로 사용중으로 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
							 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 경유링으로 사용하고 있습니다.)";
					}
				}
				// SMUX (035)
				else if (orgValueTopoSclCd == "035") {
					if (chkTopoSclCd != "035" && chkTopoSclCd != "") {
						psbTopoSclCd = "035";
						okYn = false;
						failMsg = "SMUX링은 다른 링에서 경유링으로 사용중인 경우 혹은 다른링을 경유링으로 사용중인<br> 경우 경유링에서 삭제 하거나 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
							 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 사용중, 다른링에서  " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
					}
				}
				// BC-MUX링 (040) 혹은CWMA-MUX링(041)
				else if (orgValueTopoSclCd == "040" || orgValueTopoSclCd == "041") { 
					// 변경가능한 값이 아닌경우 망구분에 따른 소속 망종류 중 변경가능한 것이 있는지 체크하여 해당 값으로 변경해줌
					if (chkTopoSclCd != "040" && chkTopoSclCd != "041" && chkTopoSclCd != "") {
						psbTopoSclCd = "040,041";
						okYn = false;
						failMsg = "BC-MUX링 혹은CWMA-MUX링은 다른 링에서 경유링으로 사용중인 경우 <br>경유링에서 삭제하거나 BCMUX링<-> CWMA-UX링 으로만 변경가능합니다. <br>"
						      + "( 해당링은 다른 링에서 " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
					}
				}
				// 가입자망링 (031)
				else if (orgValueTopoSclCd == "031") {
					if (chkTopoSclCd != "031" && chkTopoSclCd != "") {
						psbTopoSclCd = "031";
						okYn = false;
						failMsg = "가입자망링은 다른링을 경유링으로 사용중인<br> 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
							 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 사용중입니다.)";
					}
				}
				if (parseInt(nvlStr(data.useRingCnt, "0")) == 0 && parseInt(nvlStr(data.usedCnt, "0")) == 0) {
					okYn = true;
				}
				
				// 변경가능한 값이 아니면
				if (okYn == false) {
					if (topoSclCdCombo.length > 0) {
						var chkValue = "";
						$.each(topoSclCdCombo, function(idx, obj){
							if (psbTopoSclCd.indexOf(topoSclCdCombo[idx].comCd) > -1) {
								chkValue = topoSclCdCombo[idx].comCd;
								return false;
							}
						});
						if (chkValue != "") {
							$('#'+gridWorkId).alopexGrid('cellEdit', chkValue, {_index:{id: ev.data._index.id}}, "topoSclCd");
						} else {
							failMsg += "<br>망구분, 망종류는 초기데이터로 복원됩니다.";
							alertBox("W", failMsg);
							$('#'+gridWorkId).alopexGrid('cellEdit', orgNtwkTypCd, {_index:{id: ev.data._index.id}}, mapping.key);
							$('#'+gridWorkId).alopexGrid('cellEdit', orgValueTopoSclCd, {_index:{id: ev.data._index.id}}, "topoSclCd");
							$('#'+gridWorkId).alopexGrid("startEdit", {_index:{id: ev.data._index.id}} );
						}
					}
				}
        
			}
			
			/*
	         * [추가] SMUX망 추가 - 2020-05-15
	         * 2020-08-03  13. BC-MUX링, CWDM-MUX링 관련 작업
			 */
			if ( mapping.key == "topoSclCd" ) {

				var okYn = false;
				var failMsg = "";
				var orgNtwkTypCd = data._original.ntwkTypCd;
				var orgValueTopoSclCd = data._original.topoSclCd;
				var orgTopoCfgMeansCd = data._original.topoCfgMeansCd;

				// 망구분이 변경된것에 의한 자동 변경건의 경우 체크하지 않음
				if (data._key != mapping.key) {
					return;
				}
				// PTP (002) 혹은 M/W PTP링(039)
				if (orgValueTopoSclCd == "002" || orgValueTopoSclCd == "039") {   
					// PTP => M/W PTP링
					if (orgValueTopoSclCd == "002" && (ev.value == "039" || ev.value == "")) {
						okYn = true;
					}
					// M/W PTP링 => PTP
					else if (orgValueTopoSclCd == "039" && (ev.value == "002" || ev.value == "") ) {
						okYn = true;
					} 
					// 다른 종류로 변경시 사용링 정보가 있는지 체크
					else {
						 if (parseInt(nvlStr(data.usedCnt, "0")) == 0) {
							okYn = true;
						}
					} 
					
					if (okYn == false) {
						if (parseInt(nvlStr(data.usedCnt, "0")) > 0) {
							failMsg = "PTP링 혹은 M/W PTP링은 다른 링에서 경유링으로 사용중인 경우 <br>경유링에서 삭제하거나 PTP링 <-> M/W PTP링 으로만 변경가능합니다. <br>"
								      + "( 해당링은 다른 링에서 " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
						}
					}
				} 
				// BC-MUX링(040), CWDM-MUX링(041) 관련 작업
				else if (orgValueTopoSclCd == "040" || orgValueTopoSclCd == "041") {   
					// BC-MUX링 => CWDM-MUX링
					if (orgValueTopoSclCd == "040" && (ev.value == "041" || ev.value == "")) {
						okYn = true;
					}
					// CWDM-MUX링 => BC-MUX링
					else if (orgValueTopoSclCd == "041" && (ev.value == "040" || ev.value == "") ) {
						okYn = true;
					} 
					// 다른 종류로 변경시 사용링 정보가 있는지 체크
					else {
						 if (parseInt(nvlStr(data.usedCnt, "0")) == 0) {
							okYn = true;
						}
					} 
					
					if (okYn == false) {
						if (parseInt(nvlStr(data.usedCnt, "0")) > 0) {
							failMsg = "BC-MUX링 혹은CWDM-MUX링은 다른 링에서 경유링으로 사용중인 경우 <br>경유링에서 삭제하거나 BC-MUX링 <-> CWDM-MUX링 으로만 변경가능합니다. <br>"
								      + "( 해당링은 다른 링에서 " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
						}
					}
				} 
				// MESH (020)
				else if (orgValueTopoSclCd == "020") {
					if (parseInt(nvlStr(data.useRingCnt, "0")) == 0 && parseInt(nvlStr(data.usedCnt, "0")) == 0) {
						okYn = true;
					} else {
						failMsg = "MESH링은 다른 링에서 경유링으로 사용중인 경우 혹은 다른링을 경유링으로 사용중인<br> 경우 경유링에서 삭제 하거나 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
								 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 사용중, 다른링에서  " + nvlStr(data.usedCnt, "0") + "번 경유링으로 사용되고 있습니다.)";
					}
				}
				// 가입자망링 (031)
				else if (orgValueTopoSclCd == "031") {
					if (parseInt(nvlStr(data.useRingCnt, "0")) == 0 && parseInt(nvlStr(data.usedCnt, "0")) == 0) {
						okYn = true;
					} else {
						failMsg = "가입자망링은 다른링을 경유링으로 사용중인 경우<br> 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
								 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 사용중입니다.)";
					}
				}
				// Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038), MSPP(032), Free(005), PTS링(009), L3_Switch링(012), T2IP링(016)
				else if (orgValueTopoSclCd == "001" || orgValueTopoSclCd == "011"  || orgValueTopoSclCd == "015"  || orgValueTopoSclCd == "037"  || orgValueTopoSclCd == "038"
					    || orgValueTopoSclCd == "032" || orgValueTopoSclCd == "005" || orgValueTopoSclCd == "009" || orgValueTopoSclCd == "012" || orgValueTopoSclCd == "016") {
					var sameRing = "001,011,015,037,038,032,005,009,012,016";
					// 같은 레벨의 링으로 교체시
					if (sameRing.indexOf(ev.value) > -1 || ev.value == "") {
						okYn = true;
					} else {
						if (parseInt(nvlStr(data.useRingCnt, "0")) == 0 && parseInt(nvlStr(data.usedCnt, "0")) == 0) {
							okYn = true;
						} else {
							failMsg = "해당 링(Ring, IBS, IBRR, IVS, IVRR, MSPP, Free, PTS링, L3_Switch링, T2IP링)은 다른링을 경유링으로 사용중으로 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
								 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 경유링으로 사용하고 있습니다.)";
						}
					}
				}
				// SMUX (035)
				else if (orgValueTopoSclCd == "035") {
					
					if (parseInt(nvlStr(data.useRingCnt, "0")) == 0 && parseInt(nvlStr(data.usedCnt, "0")) == 0) {
						okYn = true;
					} else {
						failMsg = "해당 링(SMUX링)은 다른링을 경유링으로 사용중으로 경유링을 삭제한 후 다른 망종류로 변경가능합니다. <br>"
							 + "( 해당링은 다른링을 " + nvlStr(data.useRingCnt, "0") + "개 경유링으로 사용하고 있습니다.)";
					}	
				}
				else {
					okYn = true;
				}
				
				// 결과
				if (okYn == false) {
					failMsg += "<br>망구분, 망종류는 초기데이터로 복원됩니다.";
					alertBox("W", failMsg);
					$('#'+gridWorkId).alopexGrid('cellEdit', orgNtwkTypCd, {_index:{id: ev.data._index.id}}, "ntwkTypCd");
					$('#'+gridWorkId).alopexGrid('cellEdit', orgValueTopoSclCd, {_index:{id: ev.data._index.id}}, mapping.key);
					$('#'+gridWorkId).alopexGrid("startEdit", {_index:{id: ev.data._index.id}} );
				}
			}
			
			//대역폭, 변조방식에 따른 용량 셋팅
            if(ev.mapping.key == "mwBdwhCd" || ev.mapping.key == "modulMeansCd"){
            	var rowIndex = ev.data._index.row; 
	            var currBdwh = AlopexGrid.currentValue(ev.data, "mwBdwhCd");
	            var currModul = AlopexGrid.currentValue(ev.data, "modulMeansCd");
    			if(currBdwh == "001"){
    				if(currModul == "001" || currModul == "002"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0299", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "003"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0153", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "004"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0177", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "005"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0206", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "006"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0223", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "007"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0300", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "008"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0235", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "009"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0301", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "010"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0304", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "011"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0305", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}
    			}else if(currBdwh == "002"){
    				if(currModul == "001" || currModul == "002"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0127", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "003"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0189", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "004"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0223", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "005"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0234", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "006"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0302", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "007"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0237", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "008"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0306", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "009"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0307", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "010"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0308", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "011"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0309", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}
    			}else if(currBdwh == "003"){
    				if(currModul == "001" || currModul == "002"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0189", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "003"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0303", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "004"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0238", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "005"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0310", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "006"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0244", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "007"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0245", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "008"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0311", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "009"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0248", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "010"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0312", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "011"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0251", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}
    			}else if(currBdwh == "004"){
    				if(currModul == "001" || currModul == "002"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0313", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "003"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0315", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "004"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0316", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "005"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0317", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "006"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0318", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "007"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0319", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "008" || currModul == "009" || currModul == "010" || currModul == "011"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "9998", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}
    			}else if(currBdwh == "005"){
    				if(currModul == "001" || currModul == "002"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0314", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "003"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0318", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "004"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0320", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "005"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0321", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "006"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "0272", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}else if(currModul == "007" || currModul == "008" || currModul == "009" || currModul == "010" || currModul == "011"){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "9998", {_index: {row : rowIndex}}, 'ntwkCapaCd');
    				}
    			}	
        	}
        });

		$("input:checkbox[id='sAllPass']").on('click', function(e){
        	if ($("input:checkbox[id='sAllPass']").is(":checked") ){
        		$("#searchCotRt").setChecked(false);
        		$("#searchCotRt").setEnabled(false);
        	}else{
        		$("#searchCotRt").setChecked(false);
        		$("#searchCotRt").setEnabled(true);
        	}
        });
        $("input:checkbox[id='searchCotRt']").on('click', function(e){
        	if ($("input:checkbox[id='searchCotRt']").is(":checked") ){
        		$("#sAllPass").setChecked(false);
        		$("#sAllPass").setEnabled(false);
        	}else{
        		$("#sAllPass").setChecked(false);
        		$("#sAllPass").setEnabled(true);
        	}
        });
        
        //주파수,대역폭변화에 따른 가용채널수 셋팅
        //M/W PTP링외 모든 링에 예외없이 셀이벤트가 적용되어 편집시 커서가 사라지는 현상이 있어 M/W PTP링의 주파수, 대역폭변화시 해당 로직이 실행되도록 개선 2023-05-10
     	$('#'+gridWorkId).on('cellValueEditing', function(e){
     		evChnl = AlopexGrid.parseEvent(e);     
        	var data = evChnl.data;
        	var chkTopoSclCd = data.topoSclCd;
     		
        	// M/W PTP링인 경우에만 적용
        	if(chkTopoSclCd == "039") {
    			//주파수, 대역폭 이벤트실행시에만 적용
                if(evChnl.mapping.key == "mwBdwhCd" || evChnl.mapping.key == "mwFreqCd"){
		         	var schNtwkLineNo = AlopexGrid.currentData(evChnl.data).ntwkLineNo;
		         	var ntwkLineNo = {"ntwkLineNo" : schNtwkLineNo};
		        	// 채널사용현황정보 취득 - 채널수 가져오기
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getChnlUseStatList', ntwkLineNo, 'GET', 'setAvlChnlCnt');
                }
        	}
       	});
      	
    }     
    
    //가용채널수 셋팅
    function setAvlChnlCnt(savedChnlCnt, ev){
    	var rowIndex = ev.data._index.row; 
        var currFreq = AlopexGrid.currentValue(ev.data, "mwFreqCd");
        var currBdwh = AlopexGrid.currentValue(ev.data, "mwBdwhCd");
        var avlChnlCnt = "";
        
        	if( (currFreq == "001" && currBdwh == "002") || (currBdwh == "004" && (currFreq == "008" || currFreq == "007")) ){
				if(savedChnlCnt == 0 || savedChnlCnt == null){
					if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
						$('#'+gridWorkId).alopexGrid('cellEdit', "4", {_index: {row : rowIndex}}, 'chnlCnt');
					}
				}
    			return avlChnlCnt = "4";
    		}else if(currFreq == "001" && currBdwh == "001"){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "7", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "7";
    		}else if(currFreq == "002" && currBdwh == "002"){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "8", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "8";
    		}else if(currFreq == "003" && currBdwh == "001"){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "9", {_index: {row : rowIndex}}, 'chnlCnt');    			
    				}
    			}
    			return avlChnlCnt = "9";
    		}else if(currFreq == "004" && (currBdwh == "001" || currBdwh == "002")){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "6", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "6";
    		}
    		else if(currFreq == "005" && (currBdwh == "001" || currBdwh == "002")){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "12", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "12";
    		}
    		else if(currFreq == "006" && currBdwh == "002"){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "10", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "10";
    		}else if(currFreq == "006" && currBdwh == "003"){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "5", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "5";
    		}else if(currBdwh == "005" && (currFreq == "008" || currFreq == "007")){ 
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', "2", {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "2";
    		}else{
    			if(savedChnlCnt == 0 || savedChnlCnt == null){
    				if( ev.mapping.key == "mwFreqCd" || ev.mapping.key == "mwBdwhCd" ){
    					$('#'+gridWorkId).alopexGrid('cellEdit', null, {_index: {row : rowIndex}}, 'chnlCnt');
    				}
    			}
    			return avlChnlCnt = "";
    		} 
  	
    }
    
    //채널수 검색
    function searchChnl(event, gridId){
    	evChnl = AlopexGrid.parseEvent(event);
    	gridIdChnl = gridId;
    	var schNtwkLineNo = AlopexGrid.currentData(evChnl.data).ntwkLineNo;
     	if(schNtwkLineNo == null || schNtwkLineNo == "" || schNtwkLineNo == undefined){
     		return;
     	} else {    
     		var ntwkLineNo = {"ntwkLineNo" : schNtwkLineNo};
        	// 채널사용현황정보 취득 - 채널수 가져오기
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getChnlUseStatList', ntwkLineNo, 'GET', 'getAvlChnlCnt');	
     	}
    }
    
    //채널사용현황정보 팝업
    function chnlSchPop(evChnl, avlChnlCnt){
    	var dataObj = evChnl.data;    	
     	var schNtwkLineNo = AlopexGrid.currentData(dataObj).ntwkLineNo;
     	var chnlCnt = AlopexGrid.currentData(dataObj).chnlCnt;
     	var mwFreqCd = AlopexGrid.currentData(dataObj).mwFreqCd;
     	var mwBdwhCd = AlopexGrid.currentData(dataObj).mwBdwhCd;    	
    	var mwFreqCdNm = "";   
    	var mwBdwhCdNm = "";   
    	
    	for(var i = 0; i< C02505Data.length; i++){
    		if(C02505Data[i].value == mwFreqCd){
    			mwFreqCdNm = C02505Data[i].text;
    			break;
    		}
    	} 	
    	for(var i = 0; i< C02506Data.length; i++){
    		if(C02506Data[i].value == mwBdwhCd){
    			mwBdwhCdNm = C02506Data[i].text;
    			break;
    		}
    	}
    	
    	var searchParam = {"ntwkLineNo":schNtwkLineNo, "gridChnlCnt":chnlCnt, "gridId":gridIdChnl, "mwFreqCdNm":mwFreqCdNm, "mwBdwhCdNm":mwBdwhCdNm, "avlChnlCnt":avlChnlCnt};
    	
    	$a.popup({
    	  	popid: "popChnlSch",
    	  	title: cflineMsgArray['chnlUseStatInf'] /*MW PTP 채널수 사용 현황 정보*/ ,
    	  	url: $('#ctx').val()+'/configmgmt/cfline/ChnlSchPop.do',
    		data: searchParam,
    	    iframe: true,
    		modal: true,
    		movable:true,
    		windowpopup : true,
    		width : 600,
    		height : 800,
    		callback:function(data){
    			if(data != null){
    				var focusData = $('#'+gridWorkId).alopexGrid("dataGet", {_state : {focused : true}});
    				var rowIndex = focusData[0]._index.data;
    	    		
    	    		$('#'+gridWorkId).alopexGrid( "cellEdit", data, {_index : { row : rowIndex}}, "chnlCnt");
    	    		
    			}
    			$.alopex.popup.result = null;
    		}
    	});
    }
    
    //사용가입자망링 팝업
    function useRingPop(data, searchYn){
    	$a.popup({
	    		popid: "useRingPop",
			  	title: cflineMsgArray['useScrbrNetRingNm'],  /* 사용가입자망링 */
			  	url: $('#ctx').val()+'/configmgmt/cfline/RingUsingInfoPop.do',
			    data: data,
			    iframe: true,
			    modal: false,
			    movable:true,
			    windowpopup : false,
			    width : 1000,
			    height : 650,
	 		    callback:function(data){
	 		    	if(searchYn =="Y" ){
		       			setGrid(1,pageForCount,"All");
	 		    	}
	 		    }
	    	});	
    }

    function showRingAddDropPop(ntwkLineNo, ntwkLnoGrpSrno) { // url 변경 필요 다른 jsp 호출할 것
//    	$a.popup({
//   	    	popid: "selectAddDrop",
//   			title: cflineMsgArray['ring']+" "+cflineMsgArray['blockDiagram'] /*링 구성도*/,
//   			url: $('#ctx').val()+'/configmgmt/cfline/RingAddDropPop.do',
//   			data: {"ntwkLineNo" : ntwkLineNo, "editYn" : "N"},
//   			iframe: true,
//   			modal: true,
//   			movable:true,
//   			//width : 600,
//   			width : 1200,
//   			//height : window.innerHeight * 0.8
//   			height : window.innerHeight * 0.9
//   	    });
    	
    	//멀티링. 나중에
    	$a.popup({
	   		popid: "selectAddDrop",
			title: cflineMsgArray['ring']+" "+cflineMsgArray['blockDiagram'] /*링 구성도*/,
			url: $('#ctx').val()+'/configmgmt/cfline/RingDiagramPop.do',
			data: {"ntwkLineNo" : ntwkLineNo, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno},
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			//width : 600,
			width : 1400,
			//height : window.innerHeight * 0.8
			height : 900
		});
    }
    
    // E2E 토폴로지 팝업창 오픈
    function intgE2ETopo(gridId) {
    	var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
    	window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=RING&searchId=' + focusData[0].ntwkLineNo + '&searchNm=' + focusData[0].ntwkLineNm);
    }
    
    function showRingEditPop( gridId, dataObj ) {
    	var sFlag = gridId == "dataGrid"? "N" : "Y";
    	
    	//SKB CATV링의 예비선번구현을 위해 data에 ntwkTypCd 추가 2023-05-16
    	var url = $('#ctx').val()+'/configmgmt/cfline/RingInfoPop.do'; 
    	$a.popup({
    		popid: "RingEditPop",
		  	title: cflineMsgArray['ring']+" "+cflineMsgArray['lno']+cflineMsgArray['search'] /*링 선번조회*/,
		  	url: url,
		    data: {"gridId":gridId, "ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd":dataObj.topoLclCd, "topoSclCd":dataObj.topoSclCd
		    	, "mgmtGrpCd":dataObj.mgmtGrpCd, "mgmtOnrNm":dataObj.mgmtOnrNm, "topoCfgMeansCd":dataObj.topoCfgMeansCd, "ntwkTypCd" : dataObj.ntwkTypCd},
		    iframe: true,
		    modal: false,
		    movable:true,
		    windowpopup : true,
		    width : 1400,
//		    height : window.innerHeight * 0.85
//		    height : 940,
		    height : 780,
 		    callback:function(data){
 		    	searchYn = true ; 
       		 	//setGrid(1,pageForCount,"All"); // 2024-12-19 현재 링명이 자동변경되면 링관리 조회화면이 자동갱신되어 재조회를 하지 않아도 되므로 주석처리함
 		    }
    	});
    }   
    function showPopRing( gridId, dataObj ) {
    	var sFlag = gridId == "dataGrid"? "N" : "Y";
    	
//    	var url = $('#ctx').val()+'/configmgmt/cfline/RingInfoPop.do'; 
    	var url = $('#ctx').val()+'/configmgmt/cfline/RingInfoDiagramPop.do'; 
    	$a.popup({
    		popid: "RingInfoDiagramPop",
		  	title: cflineMsgArray['ring']+" "+cflineMsgArray['lno']+cflineMsgArray['search'] /*링 선번조회*/,
		  	url: url,
		    data: {"gridId":gridId, "ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd":dataObj.topoLclCd, "topoSclCd":dataObj.topoSclCd, "mgmtGrpCd":dataObj.mgmtGrpCd},
		    iframe: true,
		    modal: false,
		    movable:true,
		    windowpopup : true,
		    width : 1400,
//		    height : window.innerHeight * 0.85
		    height : 940,
 		    callback:function(data){
 		    	 //setGrid(1,pageForCount,"All"); 미사용
 		    }
    	});
    }
    
    function showRingSearchPop(event){
    	var dataObj = AlopexGrid.parseEvent(event).data;
    	var rowIndex = dataObj._index.row;
     	var schVal = dataObj._state.editing[dataObj._column];
     	
     	var topoSclCd = AlopexGrid.currentData(dataObj).topoSclCd;
     	
     	/* 031 가입자망링 
     	 * 030 휘더망링
     	 * */ 
     	if(nullToEmpty(topoSclCd) == "" || topoSclCd != "031"){
     		return;
     	}
     	
 	 	// 해당하는 전송실을 고려해야하는지 여부는 부장님 알려주신다고 하심 - 확인 후 수정 필요
 	 	var param = {ntwkLineNm : schVal, vTmofInfo : [], topoSclCd : "030" };
 	 	
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
 		    		$('#'+gridWorkId).alopexGrid( "cellEdit", data.ntwkLineNo, {_index : { row : rowIndex}}, "repNtwkLineNo");
 		    		$('#'+gridWorkId).alopexGrid( "cellEdit", data.ntwkLineNm, {_index : { row : rowIndex}}, "repNtwkLineNm");
 				}
 		    }	  
 		}); 	
    }
    
    
    
    // 엑셀배치실행
    function funExcelBatchExecute(){

    	cflineShowProgressBody();
		var topMtsoIdList = [];
		var ntwkTypCdList = [];
		var topoSclCdList = [];
		
		var dataParam =  $("#searchForm").getData();
		if (nullToEmpty( $("#topMtsoIdList").val() )  != ""  ){
			topMtsoIdList =   $("#topMtsoIdList").val() ;	
		}
		if (nullToEmpty( $("#ntwkTypCd").val() )  != ""  ){
			ntwkTypCdList =   $("#ntwkTypCd").val() ;
			dataParam.ntwkTypCd = "";
		}
		if (nullToEmpty( $("#topoSclCd").val() )  != ""  ){
			topoSclCdList =   $("#topoSclCd").val() ;	
			dataParam.topoSclCd = "";
		}
		
		$.extend(dataParam,{topMtsoIdList: topMtsoIdList });
		$.extend(dataParam,{ntwkTypCdList: ntwkTypCdList });
		$.extend(dataParam,{topoSclCdList: topoSclCdList });
		
		//check box 조회조건 파람셋팅
		var sAllPass = false ;
		var searchCotRt = false;
		var sWorkGrpWhereUse = false ;
		var nodeChk = false ;
		if ($("input:checkbox[id='sAllPass']").is(":checked") ){
			sAllPass = true; 
		}		
		if ($("input:checkbox[id='searchCotRt']").is(":checked") ){
			searchCotRt = true; 
		}
		if ($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked") ){
			sWorkGrpWhereUse = true; 
		}
		if ($("input:checkbox[id='nodeChk']").is(":checked") ){
			nodeChk = true; 
		}
		$.extend(dataParam,{sAllPass: sAllPass });
		$.extend(dataParam,{searchCotRt: searchCotRt });
		$.extend(dataParam,{sWorkGrpWhereUse: sWorkGrpWhereUse });
		$.extend(dataParam,{nodeChk: nodeChk });
		$.extend(dataParam,{topoLclCd: "001" });
		//$.extend(dataParam,{topoSclCd: "" });
		var stabIndex = $('#basicTabs').getCurrentTabIndex();
		if (stabIndex =="0"){
			dataParam = gridExcelColumn(dataParam, gridId);
		}else if (stabIndex =="1"){
			dataParam = gridExcelColumn(dataParam, gridWorkId);
		}
		
		var replaceColumn = {"ntwkCapaCd" : "ntwkCapaCdNm"};
		$.each(replaceColumn, function(key,val){
			dataParam.excelHeaderCd = dataParam.excelHeaderCd.replace(key, val);         		
		});
		
		dataParam.fileExtension = "xlsx";
		dataParam.excelPageDown = "N";
		dataParam.excelUpload = "N";
		
		if (stabIndex =="0"){
			dataParam.method = "ringInfo";
			dataParam.fileName = cflineMsgArray['ringInfo'] /*링정보*/;
		}else if (stabIndex =="1"){
			dataParam.method = "ringWorkInfo";
			dataParam.fileName = cflineMsgArray['ring']+cflineMsgArray['workInfo'] /*링작업정보*/;
		}
		
		dataParam.ownCd=dataParam.mgmtGrpCd;
		dataParam.orgCd=dataParam.hdofcCd;
		dataParam.topMtsoIdList=topMtsoIdList;
		//망종류
		//dataParam.topoSclCd = dataParam.topoSclCd;
		//west 장비,west 포트(좌) 
		dataParam.lEqpNM = dataParam.lftEqpNm;
		dataParam.lPortNm = dataParam.lftPortNm;
		//east 장비,east 포트(우)
		dataParam.rEqpNM = dataParam.rghtEqpNm;
		dataParam.rPortNm = dataParam.rghtPortNm;
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    
    // 배치상태확인
    function funExcelBatchExecuteStatus(){
 		//console.log("btnExcelBatchExecuteStatus S [" + jobInstanceId + "]"); 
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchExecuteStatus/'+jobInstanceId, null , 'GET', 'excelBatchExecuteStatus');
    }
    
    // 엑셀다운로드
    function funExcelDownload(){
    	cflineHideProgressBody();
    	// Excel File Download URL
    	var excelFileUrl = '/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchDownload';
    	//var excelFileUrl = 'excelDownload';
    	var $form=$( "<form></form>" );
		$form.attr( "name", "downloadForm" );
		//$form.attr( "action", excelFileUrl + "?jobInstanceId=" + $excelFileId.val() );
		$form.attr( "action", excelFileUrl + "?jobInstanceId=" + jobInstanceId );
		$form.attr( "method", "GET" );
		$form.attr( "target", "downloadIframe" );
		$form.append(Tango.getFormRemote());
		// jobInstanceId를 조회 조건으로 사용
		$form.append( "<input type='hidden' name='jobInstanceId' value='" + jobInstanceId + "' />" );
		$form.appendTo('body')
		$form.submit().remove();
    }
    
	// 등록
	$('#btnRingWritePop').on('click', function(e) {
		var param = {
							 userMgmtCd : $("#userMgmtCd").val()
						   };
		$a.popup({
			popid: "RingWritePop",
		  	title: cflineMsgArray['ringWrite'] /*링 등록*/,
		  	url: $('#ctx').val()+'/configmgmt/cfline/RingWritePop.do',
		  	data: param,
		    iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
//		    width : 900,
//		    height : 780,
//		    height :window.innerHeight * 0.9,
			width : 1000,
		    height :800,
		    callback:function(data){
				if(data != null){
					if (data=="Success"){
						cflineHideProgressBody();
	    	        	callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){/* 저장을 완료 하였습니다.*/
	    	            	if (msgRst == 'Y') {
	    	            		setGrid(1,pageForCount,"All");
	    	            	}
	    	        	});
	    	        	cflineHideProgressBody();
					}else {
						cflineHideProgressBody();
						alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
					} 
				}
			}
		});
	});
	 
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
    function successCallback(response, status, jqxhr, flag){
    	
    	// 관리그룹데이터셋팅
    	if(flag == 'C00188Data') {
    		C00188Data = response;
    	}
    	//TODO
    	if(flag == "testBtn"){
    		cflineHideProgressBody();
    		if(response.returnCode == 200){
				alertBox('I', response.returnMessage); /* 저장을 저장 하였습니다.*/
    		}else if(response.returnCode == 500){
				alertBox('I', response.returnMessage); /* 저장을 실패 하였습니다.*/
    		}
    		

    		//console.log(response.sendcatvfdfuseinfo.resultMsg);
    		//alertBox("I", response.sendcatvfdfuseinfo.resultMsg);
    	}
    	
    	// 망구분데이터셋팅
    	if(flag =='NtwkTypData'){
    		var gridNtwkTypData = [];
    		var userMgmtNm = $('#userMgmtCd').val();
    		//NtwkTypData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
			for(n=0;n<response.NtwkTypData.length;n++){
    			
    			NtwkTypData.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    			//gridNtwkTypData.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    			// 전체에 속하는경우
    			if (response.NtwkTypData[n].cdMgmtGrpVal == 'ALL') {
    				NtwkTypDataSkt.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    				NtwkTypDataSkb.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    			} else if (response.NtwkTypData[n].cdMgmtGrpVal == 'SKT') {
    				NtwkTypDataSkt.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    			} else if (response.NtwkTypData[n].cdMgmtGrpVal == 'SKB') {
    				NtwkTypDataSkb.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    			} 
    		}

    		var viewMgmtGrpCd = $('#mgmtGrpCd').val() == null ? userMgmtNm : $('#mgmtGrpCd').val();
    		var comboNtwkTypData = [];
    		if (viewMgmtGrpCd == '') {
    			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypData);
    		} else if (viewMgmtGrpCd == '0001') {
    			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkt);
    		} else if (viewMgmtGrpCd == '0002') {
    			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkb);
    		}
    		//console.log(NtwkTypData);
			$('#ntwkTypCd').clear();			
			$('#ntwkTypCd').setData({data : comboNtwkTypData});
			//NtwkTypData = gridNtwkTypData;
			
			if(response.ynListData != null && response.ynListData.length>0)
			for(i=0;i<response.ynListData.length;i++){    			
				ynListData.push({value : response.ynListData[i].value, text : response.ynListData[i].text});
    		}
			
			
    	}
    	
    	// 망구분 망종류 콤보 데이터 셋팅
    	if(flag == 'getNtwkTypTopoCode'){
    		topoCdListCombo = response.topoCdListCombo;
    	}
    	
    	// 망종류데이터셋팅
    	if(flag =='TopoData'){
    		var gridTopoData = [];
    		//TopoData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		for(n=0;n<response.TopoData.length;n++){
    			TopoData.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm});
    			//gridTopoData.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm});
    			if (response.TopoData[n].cdMgmtGrpVal == 'ALL') {
    				TopoDataSkt.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
    				TopoDataSkb.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
    			} else if (response.TopoData[n].cdMgmtGrpVal == 'SKT') {
    				TopoDataSkt.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
    			} else if (response.TopoData[n].cdMgmtGrpVal == 'SKB') {
    				TopoDataSkb.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
    			} 
    		}
    		
    		var viewMgmtGrpCd = $('#mgmtGrpCd').val() == null ? userMgmtNm : $('#mgmtGrpCd').val();
    		var comboTopoData = [];
    		if (viewMgmtGrpCd == '') {
    			comboTopoData = comboTopoData.concat(TopoData);
    		} else if (viewMgmtGrpCd == '0001') {
    			comboTopoData = comboTopoData.concat(TopoDataSkt);
    		} else if (viewMgmtGrpCd == '0002') {
    			comboTopoData = comboTopoData.concat(TopoDataSkb);
    		}
    		
			$('#topoSclCd').clear();
			$('#topoSclCd').setData({data : comboTopoData});
			
			//TopoData = gridTopoData;
    	}
    	
    	//장비구분데이터셋팅
    	if(flag == 'EqpDivData'){
    		var gridEqpDivData = [];
			for(var i=0; i<response.EqpDivData.length; i++){
				EqpDivData.push({value: response.EqpDivData[i].eqpDivCd, text : response.EqpDivData[i].eqpDivNm});
    		}

			var comboTopoData = [];
			comboTopoData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		comboTopoData = comboTopoData.concat(EqpDivData);
    		
    		$('#eqpDivCd').clear();
    		$('#eqpDivCd').setData({data : comboTopoData});
    		
    	}

    	
    	// 용량데이터셋팅
    	if(flag == 'C00194Data'){
    		var gridC00194Data = [];
    		C00194Data = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
			for(var i=0; i<response.length; i++){
    			C00194Data.push({value : response[i].value, text :response[i].text});
    			gridC00194Data.push({value : response[i].value, text :response[i].text});
    		}
    		$('#ntwkCapaCd').clear();
    		$('#ntwkCapaCd').setData({data : C00194Data});
    		C00194Data = gridC00194Data;
    	}
    	
    	// 절체방식데이터셋팅
    	if(flag == 'C00223Data'){
    		for(var i=0; i<response.length; i++){
    			C00223Data.push({value : response[i].value, text :response[i].text});
    			if(response[i].value =="00") {
        			C00223DataIn031.push({value : response[i].value, text :response[i].text});
        			C00223DataNotIn031.push({value : response[i].value, text :response[i].text});
    			}else if(response[i].value =="04" || response[i].value =="05"  ) {
        			C00223DataIn031.push({value : response[i].value, text :response[i].text});
    			}else{
    				C00223DataNotIn031.push({value : response[i].value, text :response[i].text});
    			}
    		}
    	}
    	
    	// 토폴로지구성방식데이터셋팅
    	if(flag == 'C02501Data'){

		
			for(var i=0; i<response.length; i++){
    			C02501Data.push({value : response[i].value, text :response[i].text});
    		}
			
			var comboTopoData = [];
			comboTopoData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		comboTopoData = comboTopoData.concat(C02501Data);
    		
    		$('#topoCfgMeansCd').clear();
    		$('#topoCfgMeansCd').setData({data : comboTopoData});
    	}
    	
    	// M/W용도구분데이터셋팅
    	if(flag == 'C02504Data'){
			for(var i=0; i<response.length; i++){
    			C02504Data.push({value : response[i].value, text :response[i].text});
    		}
    	}
    	
    	// 주파수데이터셋팅
    	if(flag == 'C02505Data'){
			for(var i=0; i<response.length; i++){
				C02505Data.push({value : response[i].value, text :response[i].text});
    		}
    	}
    	
    	// 변조방식데이터셋팅
    	if(flag == 'C02507Data'){
			for(var i=0; i<response.length; i++){
				C02507Data.push({value : response[i].value, text :response[i].text});
    		}
    	}
    	
    	// 대역폭데이터셋팅
    	if(flag == 'C02506Data'){
			for(var i=0; i<response.length; i++){
				C02506Data.push({value : response[i].value, text :response[i].text});
    		}
    	}

    	// OTDR연동방식코드데이터셋팅
    	if(flag == 'C02533Data'){

		
			for(var i=0; i<response.length; i++){
				C02533Data.push({value : response[i].value, text :response[i].text});
    		}
			
			var comboTopoData = [];
			comboTopoData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		comboTopoData = comboTopoData.concat(C02533Data);
    		
    		$('#otdrLnkgMeansCd').clear();
    		$('#otdrLnkgMeansCd').setData({data : comboTopoData});
    	}
    	
		// 작업전환   
    	if(flag == 'workCnvt'){	
    		cflineHideProgressBody();
    		if(response.Result == 'Success'){
    			var msgStr = "";
    			if(msgVal == ""){
    				msgStr = "(" + getNumberFormatDis(response.cnt) + ")";
    			}else{
    				msgStr = msgVal + "<br>" + "(" + getNumberFormatDis(response.cnt) + ")";
    			}
//        		msgStr = makeArgCommonMsg2('lineCountProc', response.tCnt, response.sCnt)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountTotal', response.tCnt, null)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountAuth', response.aCnt, null)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountWork', response.wCnt, null)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountSuccess', response.sCnt, null);

        		callMsgBox('','I', makeArgMsg('processed',msgStr,"","",""), function(msgId, msgRst){ /* ({0})건 처리 되었습니다. */
					if (msgRst == 'Y') {
						searchYn = true ; 
						setGrid(1,pageForCount,"WorkInfo");
					}
            	});
    			cflineHideProgressBody();
    		}else if(response.Result == 'NODATA'){ 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	if(flag == 'teamCd') {
    		// 전송실 가져오기 
    		// alert("상위국사정보가지고오기");
    		$('#teamCd' ).clear();
    		$('#teamCd' ).setData({data:response});
    	}

    	// 링정보조회
    	if(flag == 'searchRingInfo') {
    		var data = response.outRingList;
    		if(response.maxPathCount == null) {
    			maxPathCount = 0;
    		}
    		if(data.length == 0){
    			cflineHideProgress(gridId);
    			infoScrollBottom = false;
    			addData = false;
    			return false;
    		}
    		renderGrid(gridId, data, response.listHeader, response.totalCnt);
    	  	if(addData){
    	  		$('#'+gridId).alopexGrid("dataAdd", response.outRingList);
    	  		addData = false;
    	  	} else {
    	  		$('#'+gridId).alopexGrid("dataSet", response.outRingList);
    	  	}
    	  	cflineHideProgress(gridId);
    	}
    	
    	// 작업정보조회
    	if(flag == 'searchWorkInfo') {
    		var data =  response.outRingWorkList;
    		if(response.maxPathCountWork == null){
     			maxPathCountWork = 0;
     		}
    		if(data.length == 0){
    			cflineHideProgress(gridWorkId);
    			workInfoScrollBottom = false;
    			addData = false;
    			return false;
    		}
    		renderGrid(gridWorkId, data, response.listWorkHeader, response.totalWorkCnt);
    	  	if(addData){
    	  		$('#'+gridWorkId).alopexGrid("dataAdd", response.outRingWorkList);
    	  		addData = false;
			}else{
				$('#'+gridWorkId).alopexGrid("dataSet", response.outRingWorkList);
    		}
    	  	cflineHideProgress(gridWorkId);
    	  	$('#'+gridWorkId).alopexGrid("startEdit");
    	}
    	// 전체조회
    	if(flag == 'searchAll') {
    		maxPathCount = 0;
    		maxPathCountWork = 0;

    		var data = response.outRingList;
    		if(response.maxPathCount == null) {
    			maxPathCount = 0;
    			addColumn = null;
    		}
    		totalInfoCnt = response.totalCnt;
    		renderGrid(gridId, data, response.listHeader, response.totalCnt);
    	  	data = response.outRingWorkList;
    	  	if(response.maxPathCountWork == null){
    	  		maxPathCountWork = 0;
    	  	}
    	  	totalWorkCnt = response.totalWorkCnt;
    	  	renderGrid(gridWorkId, data, response.listWorkHeader, response.totalWorkCnt);
			if(addData){
				$('#'+gridId).alopexGrid("dataAdd", response.outRingList);
				$('#'+gridWorkId).alopexGrid("dataAdd", response.outRingWorkList);
				addData = false;
			}else{
				$('#'+gridId).alopexGrid("dataSet", response.outRingList);
				$('#'+gridWorkId).alopexGrid("dataSet", response.outRingWorkList);
    		}

			var totalCount = response.totalCnt + response.totalWorkCnt;
	    	if(totalCount > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}
			
    		cflineHideProgressBody();
			$('#'+gridWorkId).alopexGrid("startEdit");
    	}
    	
    	// 해지전 선번정보 존재 체크
    	if (flag == 'checklnsctninfo') {
    		cflineHideProgressBody();
    		if(response.returnCode == "SUCCESS"){
    			// 전체 ok인 경우 만
    			var checkList = response.checkList;
    			var checkCnt = 0;
    			var checkMsg = "";
    			for (var i = 0; i < checkList.length; i++) {
    				// 구간정보가 있으면 해지안됨
    				if (checkList[i].checkLnInfo == 'Y') {
    					checkMsg = checkMsg + ((checkCnt > 0) ? ",<br>" : "") + checkList[i].ntwkLineNm + "(" + checkList[i].ntwkLineNo + ")";
    					checkCnt++;
    				}
    			}
    			if (checkCnt == 0) {
	    			//해지로직 호출
	    			fnLineTerminate();
    			} else {
    				// 의 선번정보를 삭제후 해지처리 해 주세요.
    				alertBox('I', makeArgMsg('checklnsctninfo',checkMsg+'<br>')); /* 데이터가 없습니다. */
    				return;
    			}
    		}
    	}
    	
		// 해지
		if(flag == 'terminate') {
			cflineHideProgressBody();
			if(response.returnCode == "SUCCESS"){
				// FDF 수용내역 전송
				sendFdfUseInfo("C");

				// 네트워크정보 TSDN 해지는 제외
				sendToTsdnNetworkInfo(sendToTsdnLineNo, "R", "B");
				
				/* 2018-08-13 해지된 회선 중 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
				var acceptParam = {
						 lineNoStr : procAcceptTargetList
					   , topoLclCd : "001"
					   , linePathYn : "N"
					   , editType : "C"   // 해지
					   , excelDataYn : "N"
				}
				extractAcceptNtwkLine(acceptParam);
				
				var useRingCnt = response.useRingNoList.length; //사용가입자망링수
				//미처리건수
				var notTermCnt = useRingCnt + response.useNtwkLineNoList.length ;
				
				// 해지요청중 : 5G-PON링, SMUX링이 아닐 경우네트워크번호를 담는다.
				if (nullToEmpty(response.topoSclNtwkNoList) != "" ) {
					notTermCnt += parseInt(response.topoSclNtwkNoListCnt);
				}
				// 해지요청중 : ntwkStatCd가 04가 이닌 경우 네트워크번호를 담는다.
				if (nullToEmpty(response.statNtwkNoList) != "" ) {
					notTermCnt += parseInt(response.statNtwkNoListCnt);
				}
				// 해지요청중 : 해지예정일자가 SYSDATE보다 큰 날짜인 네트워크번호를 담는다.
				if (nullToEmpty(response.statNtwkNoListCnt) != "" ) {
					notTermCnt += parseInt(response.statNtwkNoListCntCnt);
				}
				// 경유링 관련
				if (nullToEmpty(response.cascadingRingCnt) != "") {
					notTermCnt += parseInt(response.cascadingRingCnt);
				}
				//수용회선이 있는경우
				if(response.useNtwkLineNoList != null && response.useNtwkLineNoList.length > 0){
					var msg = "";
					
					if( response.cnt > 0){
						msg = makeArgMsg('processed', response.cnt ,"","",""); /* ({0})건 처리 되었습니다. */
					} else {
						msg = cflineMsgArray['noApplyData'];
					}
					
					msg+= "<br><br>" + cflineMsgArray['untreated'] /* 미처리 */ + " : " + notTermCnt + "건";
					if (useRingCnt > 0){
						msg+= "<br>" + cflineMsgArray['usingLine'] /* 사용회선 */ + ":" + response.useNtwkLineNoList.length + "건";
						msg+= "<br>" + cflineMsgArray['useScrbrNetRingNm'] /* 사용가입자망링 */ + ":" + useRingCnt + "건";
					}
					
					msg += "<br>";
					/* 해지요청과 관련된 에러건 */
					// 소분류가 적합하지 않음
					if (nullToEmpty(response.topoSclNtwkNoList) != "") {
						msg += "<br>[" + response.topoSclNtwkNoList + "]건은<br>해지요청에 대한 승인/해지가 불가능한 망종류입니다." 
					}
					// 소분류가 적합하지 않음
					if (nullToEmpty(response.statNtwkNoList) != "") {
						msg += "<br>[" + response.statNtwkNoList + "]건은<br>해지요청중인 링이 아닙니다." 
					}
					// 소분류가 적합하지 않음
					if (nullToEmpty(response.trmnSchdNtwkNoList) != "") {
						msg += "<br>[" + response.trmnSchdNtwkNoList + "]건은<br>해지요청일 이후에 승인/해지가 가능합니다." 
					}  
					
					// 경유링을 사용하는 경우
					if (nullToEmpty(response.cascadingRingList) != "") {
						msg += "<br>[" + response.cascadingRingList + "]건은<br>다른 링을 경유링으로 사용중입니다. <br> 경유링을 삭제한 후에 승인/해지가 가능합니다." 
					}
					
					// 경유링으로 사용되는 경우
					if (nullToEmpty(response.cascadRingList) != "") {
						msg += "<br>[" + response.cascadRingList + "]건은<br>다른 링에서 경유링으로 사용되고 있습니다. <br> 경유링에서 삭제한 후에 승인/해지가 가능합니다." 
					}  
					
					callMsgBox('','I', msg, function(msgId, msgRst){
						var param = {"ntwkLineNoList":response.useNtwkLineNoList, "topoLclCd":"001", "topoSclCd":"" };
						var useRingParam = {"ntwkLineNoList" : response.useRingNoList };
						
			       		if (msgRst == 'Y' && ( useRingCnt <= 0) ) { //사용가입자망링이 없는경우
							$a.popup({
				 	 			popid: "UsingInfoPop",
				 	 			title: cflineMsgArray['ring']+cflineMsgArray['management']+" - "+cflineMsgArray['trmn'] /*링관리 - 해지*/,
				 	 			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
				 	 			data: param,
				 	 			iframe: true,
				 	 			modal: false,
				 	 		    movable:true,
				 	 			width : 1200,
				 	 			height : 650,
				 	 			callback:function(data){
				 	 		    	setGrid(1,pageForCount,"All");
				 	 		    }
				 	 		});
			       		} else if( msgRst == 'Y' && ( useRingCnt > 0) ) { //사용가입자망링이 있는경우
			       			$a.popup({
				 	 			popid: "UsingInfoPop",
				 	 			title: cflineMsgArray['ring']+cflineMsgArray['management']+" - "+cflineMsgArray['trmn'] /*링관리 - 해지*/,
				 	 			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
				 	 			data: param,
				 	 			iframe: true,
				 	 			modal: false,
				 	 		    movable:true,
				 	 			width : 1200,
				 	 			height : 650,
				 	 			callback:function(data){
				 	 		    	setGrid(1,pageForCount,"All");
				 	 		    }
				 	 		});
			       			useRingPop(useRingParam, "N");
			       		}else {
			       			setGrid(1,pageForCount,"All");
			       		}
					});	
				} else { //수용회선이 없는경우
					var msg= ""
					var useRingParam = {"ntwkLineNoList" : response.useRingNoList };
					if( response.cnt > 0){
						msg = makeArgMsg('processed', response.cnt ,"","",""); /* ({0})건 처리 되었습니다. */
					} else {
						msg = cflineMsgArray['noApplyData'];
					}
					
					msg += "<br>";
					/* 해지요청과 관련된 에러건 */
					// 소분류가 적합하지 않음
					if (nullToEmpty(response.topoSclNtwkNoList) != "") {
						msg += "<br>[" + response.topoSclNtwkNoList + "]건은<br>해지요청에 대한 승인/해지가 불가능한 망종류입니다." 
					}
					// 소분류가 적합하지 않음
					if (nullToEmpty(response.statNtwkNoList) != "") {
						msg += "<br>[" + response.statNtwkNoList + "]건은<br>해지요청중인 링이 아닙니다.." 
					}
					// 소분류가 적합하지 않음
					if (nullToEmpty(response.trmnSchdNtwkNoList) != "") {
						msg += "<br>[" + response.trmnSchdNtwkNoList + "]건은<br>해지요청일 이후에 승인/해지가 가능합니다.." 
					}     
					
					// 경유링을 사용하는 경우
					if (nullToEmpty(response.cascadingRingList) != "") {
						msg += "<br>[" + response.cascadingRingList + "]건은<br>다른 링을 경유링으로 사용중입니다. <br> 경유링을 삭제한 후에 승인/해지가 가능합니다." 
					}
					
					// 경유링으로 사용되는 경우
					if (nullToEmpty(response.cascadRingList) != "") {
						msg += "<br>[" + response.cascadRingList + "]건은<br>다른 링에서 경유링으로 사용되고 있습니다. <br> 경유링에서 삭제한 후에 승인/해지가 가능합니다." 
					}
					
					if( useRingCnt > 0){
						msg+= "<br><br>" + cflineMsgArray['untreated'] /* 미처리 */ + " : " +notTermCnt + "건";
						msg+= "<br>" + cflineMsgArray['useScrbrNetRingNm'] /* 사용가입자망링 */ + ":" + useRingCnt + "건";
						callMsgBox('','I', msg, function(msgId, msgRst){
				       		if (msgRst == 'Y') {
				       			useRingPop(useRingParam, "Y");
				       		}
						});
					} else {
						callMsgBox('','I', msg, function(msgId, msgRst){
				       		if (msgRst == 'Y') {
				       			setGrid(1,pageForCount,"All");
				       		}
						});
					}
				}
			
			} else if(response.returnCode == "NODATA"){
				alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
			} else {
				alertBox('I', cflineMsgArray['noData']); /* 데이터가 없습니다. */
			}
			
			// 승인버튼 비활성화
			//$('#btnApproval').setEnabled(false);
		}
		// 작업정보저장
    	if(flag == 'updateWorkInfo'){
    		if(response.returnCode == '200'){
    			for( var i=0; i < response.resultData.netWorkLinoList.length; i++) {
	    			httpRequest('tango-transmission-gis-biz/transmission/cc/ringsync/syncData?ntwkLineNo=' + response.resultData.netWorkLinoList[i] , null, 'GET', 'insertRingGisApi');
    			}
    			cflineHideProgressBody();
    			
    			var msg = "";
    			
    			// 해지요청건 포함 경우
    			if (nullToEmpty(response.resultData.netWorkLinoStatCd) != "") {
    				msg += cflineMsgArray['cancleFlagInRing'] + "(" + response.resultData.reqCancelList + ")";	 /* 해지요청중인 링이 포함되어있습니다.  */
	            		}
    			
    			// 2019-11-12 기간망 링 선번 고도화 : 경유링 정보가 존재하여 변경이 안되는 건이 포함된 경우
    			if (nullToEmpty(response.resultData.cascadingRing) != "") {
    				msg += (msg != "" ? "<br>" : "") + response.resultData.cascadingRing;
				}

				// FDF 수용내역 전송
				sendFdfUseInfo("B");

				// 네트워크정보 TSDN
				sendToTsdnNetworkInfo(sendToTsdnLineNo, "R", "B");

				// service 단에서 관리조직이 SKB일 경우에만 동작하도록 설정 
				if(response.resultData.ntwkLineNoClearList != null){
					var msgtmp = "링번호 ";
					for(var i = 0; i < response.resultData.ntwkLineNoClearList.length; i++){
						if(i == response.resultData.ntwkLineNoClearList.length - 1)
							msgtmp += response.resultData.ntwkLineNoClearList[i];
						else
							msgtmp += response.resultData.ntwkLineNoClearList[i] + ", ";
					}
					msg = cflineMsgArray['saveSuccess']  + "( " + nullToEmpty(response.resultData.resultCnt) + "건 )<br><br>" + msg + "<br><br>" 
					+ "예비선번은 망구분이 기간망일 경우 망종류가 PTP일 때만 설정가능합니다.<br>" + msgtmp + "은(는) 예비선번을 가질 수 없습니다.<br>"
					+ "초기화하시겠습니까?";
					
					callMsgBox('','C', msg, function(msgId, msgRst){ /* 저장을 완료 하였습니다.*/ 
	            		if (msgRst == 'Y') {
	            			var clearReverseRingNoList = {
	            					"clearReverseRingNoList" : response.resultData.ntwkLineNoClearList
	            			};
	            			cflineShowProgressBody();
	            			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/clearReserveLineList', clearReverseRingNoList, 'POST', 'clearReserveLineList'); // 예비선번 초기화
	            		}
	            		else{
	            			searchYn = true ; 
	               		 	setGrid(1,pageForCount,"All");
	               		 	
	               		 	cflineHideProgressBody();
	            		}
	            	});
				}
				else{
					msg = cflineMsgArray['saveSuccess']  + "( " + nullToEmpty(response.resultData.resultCnt) + "건 )<br><br>" + msg;
	    			callMsgBox('','I', msg, function(msgId, msgRst){ /* 저장을 완료 하였습니다.*/ 
	            		if (msgRst == 'Y') {
	                		searchYn = true ; 
	               		 	setGrid(1,pageForCount,"All");
	            		}
	            	});
	    			
	    			cflineHideProgressBody();
				}
    		} else if(response.returnCode == '500'){
    			cflineHideProgressBody();
    			
    			var msg = "";
    			// 해지요청건 포함 경우
    			if (nullToEmpty(response.resultData.netWorkLinoStatCd) != "") {
    				msg += cflineMsgArray['cancleFlagInRing'] + "(" + response.resultData.reqCancelList + ")";		 /* 해지요청중인 링이 포함되어있습니다.  */
    			}
    			
    			// 2019-11-12 기간망 링 선번 고도화 : 경유링 정보가 존재하여 변경이 안되는 건이 포함된 경우
    			if (nullToEmpty(response.resultData.cascadingRing) != "") {
    				msg += (msg != "" ? "<br>" : "") + response.resultData.cascadingRing;
    			}
    			msg = cflineMsgArray['saveFail']  + "<br><br>" + msg;
    			
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			alertBox('I', msg); /* 저장을 실패 하였습니다.*/
    			
    		} else if(response.returnCode == '0'){
    			//중복된 링명이 있는 경우 알림메세지 2019-05-15
    			cflineHideProgressBody();
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			alertBox('I', cflineMsgArray['duplRingNmInRingNm']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	// 작업정보완료 , 모든작업정보완료 
    	if(flag == 'workInfoFinish'){
    		cflineHideProgressBody();

    		if(response.Result == 'Success'){
    			for( var i=0; i < response.netWorkLinoList.length; i++) {
	    			httpRequest('tango-transmission-gis-biz/transmission/cc/ringsync/syncData?ntwkLineNo=' + response.netWorkLinoList[i] , null, 'GET', 'insertRingGisApi');
    			}

				// FDF 수용내역 전송
				sendFdfUseInfo("B");

				// 네트워크정보 TSDN
				sendToTsdnNetworkInfo(sendToTsdnLineNo, "R", "B");
				
    			var msg = "";
    			
    			// 해지요청건 포함 경우
    			if (nullToEmpty(response.cancleCnt) != "0") {
    				msg += cflineMsgArray['cancleFlagInRing'] + "(" + response.reqCancelList + ")";	 	 /* 해지요청중인 링이 포함되어있습니다.  */
    			}
    			
    			// 2019-11-12 기간망 링 선번 고도화 : 경유링 정보가 존재하여 변경이 안되는 건이 포함된 경우
    			if (nullToEmpty(response.cascadingRing) != "") {
    				msg += (msg != "" ? "<br>" : "") + response.cascadingRing;
	    				}
				
    			msg = makeArgMsg('processed',"(" + response.cnt + ")","","","") +"<br><br>" + msg ;
    			
    			
    			callMsgBox('','I',msg, function(msgId,msgRst){ /*  {0}건 처리 되었습니다. */
	    				if(msgRst == 'Y'){
	    					searchYn = true ;
	    					setGrid(1,pageForCount,"All");
	    				}
	    			});
    			cflineHideProgressBody();
    		}else if(response.Result == 'NODATA'){ 
    		
    			var msg = "";
    			// 해지요청건 포함 경우
    			if (nullToEmpty(response.cancleCnt) != "0") {
    				msg += cflineMsgArray['cancleFlagInRing'] + "(" + response.reqCancelList + ")";	 	 /* 해지요청중인 링이 포함되어있습니다.  */
	    				}
    			
    			// 2019-11-12 기간망 링 선번 고도화 : 경유링 정보가 존재하여 변경이 안되는 건이 포함된 경우
    			if (nullToEmpty(response.cascadingRing) != "") {
    				msg += (msg != "" ? "<br>" : "") + response.cascadingRing;
    			}
    			msg = cflineMsgArray['noApplyData'] + "<br><br>" + msg;  /* 적용할 데이터가 없습니다.*/
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			alertBox('I', msg);

    		}else{ 

    			$('#'+gridWorkId).alopexGrid("startEdit");
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	if(flag == 'excelDownload') {
    		cflineHideProgressBody();
    		var $form=$('<form></form>');
    		$form.attr('name','downloadForm');
    		//$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
    		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/exceldownload");
    		$form.attr('method','GET');
//			$form.attr('method','POST');
    		$form.attr('target','downloadIframe');
    		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
    		$form.append(Tango.getFormRemote());
    		$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
    		$form.appendTo('body');
    		$form.submit().remove();
    	}
    	if(flag == 'excelBatchExecute') {
//			cflineHideProgressBody();
//			console.log("excelBatchExecute");
//			console.log(response);
			if(response.returnCode == '200'){ 
				//console.log("response.resultData.jobInstanceId S>>" + response.resultData.jobInstanceId);
				jobInstanceId  = response.resultData.jobInstanceId;
				cflineHideProgressBody();
				//$('#excelFileId').val(response.resultData.jobInstanceId );
				excelCreatePop(jobInstanceId);
				//funExcelBatchExecuteStatus();
			}else if(response.returnCode == '500'){ 
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
			}
    	}
    	
    	if(flag == 'excelBatchExecuteStatus') {
    		//console.log("response.resultData.jobStatus >>" + response.resultData.jobStatus);
   		 	if(response.returnCode == '200'){ 	
    			var jobStatus  = response.resultData.jobStatus ;
    			/*jobStatus ( ok | running | error )*/
    			if (jobStatus =="ok"){
    				//엑셀파일다운로드 활성화
    				funExcelDownload();
    			}else if (jobStatus =="running"){
    				//10초뒤 다시 조회
    				setTimeout(function(){ funExcelBatchExecuteStatus(); } , 1000*5 );
    			}else if (jobStatus =="error"){
    				cflineHideProgressBody();
    				//setTimeout(funExcelBatchExecuteStatus() ,50000);
    				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    			}
    		}else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    			/*alert('실패 되었습니다.  ');*/
    			alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
    	// 회선상태셋팅
    	if(flag == 'C00262Data'){
    		C00262Data = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		for(var i=0; i<response.length; i++){
    			C00262Data.push({value : response[i].value, text :response[i].text});
    		}
    		
    		$('#ntwkStatCd').clear();
    		$('#ntwkStatCd').setData({data : C00262Data});
    	}
    	// 해지복원
    	if(flag == 'revoketrmn'){
    		if(response.returnCode == 'SUCCESS'){    			
    			cflineHideProgressBody();
    			var returnMsg = "";
    			if (response.noUpdate > 0) {
    				returnMsg = makeArgCommonMsg2("alreadyRestoration",response.noUpdate) + "<br>";
    			}

				// FDF 수용내역 전송
				sendFdfUseInfo("B");

				// 네트워크정보 TSDN
				sendToTsdnNetworkInfo(sendToTsdnLineNo, "R", "B");
				
    			callMsgBox('','I', returnMsg + cflineCommMsgArray['normallyProcessed'], function(msgId, msgRst){ /* 정상적으로 처리되었습니다.*/ 
            		if (msgRst == 'Y') {
                		searchYn = true ; 
               		 	setGrid(1,pageForCount,"All");
            		}
            	});
    			cflineHideProgressBody();
    		}else if(response.returnCode == 'NODATA'){
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	if(flag == 'getMgmtOrgTeam'){
    		
    		mgmtOrgData = response.mgmtOrgData;
    		mgmtTeamData = response.mgmtTeamData;
    		teamDataListCombo = response.teamDataListCombo;
    		
    		for (i=0; i<mgmtOrgData.length; i++){
    			if(mgmtOrgData[i].mgmtGrpCd == "0001"){
    				mgmtOrgSktData.push({value : mgmtOrgData[i].value, text : mgmtOrgData[i].text});
    			}else if(mgmtOrgData[i].mgmtGrpCd == "0002"){
    				mgmtOrgSkbData.push({value : mgmtOrgData[i].value, text : mgmtOrgData[i].text});
    			}
    		}
    		for (i=0; i<mgmtTeamData.length; i++){
    			if(mgmtTeamData[i].mgmtGrpCd == "0001"){
    				mgmtTeamSktData.push({value : mgmtTeamData[i].value, text : mgmtTeamData[i].text});
    			}else if(mgmtTeamData[i].mgmtGrpCd == "0002"){
    				mgmtTeamSkbData.push({value : mgmtTeamData[i].value, text : mgmtTeamData[i].text});
    			}
    		}
    		
    		var userMgmtNm = $('#userMgmtCd').val();
    		var viewMgmtGrpCd = $('#mgmtGrpCd').val() == null ? userMgmtNm : $('#mgmtGrpCd').val();
    		
    		var comboMgmtOrgData = [{value: "",text: cflineCommMsgArray['all'] /* 전체*/}];
    		var comboMgmtTeamData = [{value: "",text: cflineCommMsgArray['all'] /* 전체*/}];
    		
    		if (viewMgmtGrpCd == '') {
    			comboMgmtOrgData = comboMgmtOrgData.concat(mgmtOrgData);
    			comboMgmtTeamData = comboMgmtTeamData.concat(mgmtTeamData);
    		} else if (viewMgmtGrpCd == '0001') {
    			comboMgmtOrgData = comboMgmtOrgData.concat(mgmtOrgSktData);
    			comboMgmtTeamData = comboMgmtTeamData.concat(mgmtTeamSktData);
    		} else if (viewMgmtGrpCd == '0002') {
    			comboMgmtOrgData = comboMgmtOrgData.concat(mgmtOrgSkbData);
    			comboMgmtTeamData = comboMgmtTeamData.concat(mgmtTeamSkbData);
    		}
    		
    		// 관리본부
			$('#hdofcOrgId').clear();
    		$('#hdofcOrgId').setData({data : comboMgmtOrgData});

    		// 관리팀
			$('#teamOrgId').clear();
    		$('#teamOrgId').setData({data : comboMgmtTeamData});
    	}
    	
    	if(flag == 'setAvlChnlCnt'){	
    		savedChnlCnt = response.chnlCnt;
    		var avlChnlCnt = setAvlChnlCnt(savedChnlCnt, evChnl);
    	}
    	
    	if(flag == 'getAvlChnlCnt'){	
    		savedChnlCnt = response.chnlCnt;
    		var avlChnlCnt = setAvlChnlCnt(savedChnlCnt, evChnl);
    		chnlSchPop(evChnl, avlChnlCnt);
    	}
    	
//    	if(flag == 'getChnlCnt'){	
//    		savedChnlCnt = response.chnlCnt;
//    	}
    	
    	if(flag == 'clearReserveLineList'){
    		var msg = "";
    		msg = response.szresultCnt + "건에 대한 예비선번 초기화를 완료하였습니다.";
    		// 성공적으로 저장했을 경우
    		if(response.result == "OK"){
    			callMsgBox('','I', msg, function(msgId, msgRst){
            		if (msgRst == 'Y') {
            			
            		}
            	});
    		}
    		// history 와 Delete 기록이 다를 경우
    		else{
    			msg = msg + "<br><br>" + response.szFailList + "에 대한 정보를 확인하여 주세요.";
    			callMsgBox('','I', msg, function(msgId, msgRst){ 
            		if (msgRst == 'Y') {
            			
            		}
            	});
    		}
    		searchYn = true ; 
   		 	setGrid(1,pageForCount,"All");
   		 	
   		 	cflineHideProgressBody();
    	}
    	
    	if ($('#mgmtGrpCd').val() == "0001") {
			$('#'+gridId).alopexGrid('hideCol', mgmtOnrNmCol);
			$('#'+gridWorkId).alopexGrid('hideCol', mgmtOnrNmCol);
		}
    }
    
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchAll'){
    		/*alert('실패');*/
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'workCnvt'){
    		/*alert('실패');*/
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	if (flag == 'checklnsctninfo') {
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	// 작업정보저장
    	if(flag == 'updateWorkInfo'){
    		//중복된 링명이 있는 경우 알림메세지 2019-05-15
			cflineHideProgressBody();
			$('#'+gridWorkId).alopexGrid("startEdit");
			alertBox('I', cflineMsgArray['duplRingNmInRingNm']); /* 저장을 실패 하였습니다.*/
    	}
    	// 작업완료, 모든 작업 완료
    	if(flag == 'workInfoFinish'){
    		cflineHideProgressBody();
			$('#'+gridWorkId).alopexGrid("startEdit");
			alertBox('I', cflineMsgArray['duplRingNmInRingNm']); /* 저장을 실패 하였습니다.*/
    	}
    }
    
    // 그리드 랜더링
    function renderGrid(gridDiv, data, addColumn, totalCount){
    	var group = "";
    	var columnDiv = "";
    	// 그리드 컬럼 초기화
    	if(gridDiv == gridId){
    		//console.log(gridDiv + " - maxPathCount : " + maxPathCount);
    		if(addColumn != null){
    			if(maxPathCount < addColumn.length){
    				columnRingInfo = columnMapping("RingInfo");
    				
        			if(addColumn != null){
        				$.each(addColumn, function(key,val){
        					columnRingInfo.push(val);
        	         	})
        			}
        			maxPathCount = addColumn.length;
    			}
    		}
    		else if(!$("input:checkbox[id='sAllPass']").is(":checked") || !$("input:checkbox[id='searchCotRt']").is(":checked")){
    			columnRingInfo = columnMapping("RingInfo");
    		}
    		group = "ringTotalCntSpan";
    		columnDiv = "RingInfo";
    	} 
    	else {
    		//console.log(gridDiv + " - maxPathCountWork : " + maxPathCountWork);
    		if(addColumn != null){
    			if(maxPathCountWork <addColumn.length){
    				columnWorkInfo = columnMapping("WorkInfo");
        			if(addColumn != null){
        				$.each(addColumn, function(key,val){
        					columnWorkInfo.push(val);
        	         	})
        			}
        			maxPathCountWork = addColumn.length;
    			}
    		}
    		else if(!$("input:checkbox[id='sAllPass']").is(":checked") || !$("input:checkbox[id='searchCotRt']").is(":checked")){
    			columnWorkInfo = columnMapping("WorkInfo");
    		}
    		group = "workTotalCntSpan";
    		columnDiv = "WorkInfo";
    	}
    	
    	if(totalCount > 0){
			$('#btnExportExcel').setEnabled(true);
    	}
    	else{
    		$('#btnExportExcel').setEnabled(false);
    	}
   	
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);} } } );
		$('#'+group).text("("+getNumberFormatDis(totalCount)+")");

		createGrid(columnDiv);
   		if($('#topoSclCd').val() == '039' ){
			$('#'+gridId).alopexGrid('showCol', mwPtpInfoCol);
    		$('#'+gridWorkId).alopexGrid('showCol', mwPtpInfoCol);
		}else{
			$('#'+gridId).alopexGrid('hideCol', mwPtpInfoCol);
    		$('#'+gridWorkId).alopexGrid('hideCol', mwPtpInfoCol);
		}
   		//망구분 기간망선택에 따른 OTDR연동방식 표시
   		if($('#ntwkTypCd').val() == '001' ){
			$('#'+gridId).alopexGrid('showCol', ntwkGiganInfoCol);
    		$('#'+gridWorkId).alopexGrid('showCol', ntwkGiganInfoCol);
		}else{
			$('#'+gridId).alopexGrid('hideCol', ntwkGiganInfoCol);
    		$('#'+gridWorkId).alopexGrid('hideCol', ntwkGiganInfoCol);
		}
    }
    
    //국사찾기
    $('#btnMtsoSch').on('click', function(e) {
		var paramValue = "";
		paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCd').val(),"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()}
		openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
    });
    
//	// 노드조회:	장비조회
//    $('#btnEqpSearch').on('click', function(e) {
//    	openEqpPop("eqpId", "eqpNm");
//    });
    
//	//노드조회:	장비구간
//	$('#btnEqpSearch').on('click', function(e) {
//		$a.popup({
//			popid: 'EqpSctnLkup',
//			title: '노드조회',
//			url: $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnLkup.do',
//			width : 950,
//			height : window.innerHeight * 0.9,
//			callback : function(data) { // 팝업창을 닫을 때 실행 
//			$('#rghtEqpNm').val(data.rghtEqpNm);
//			$('#lftEqpNm').val(data.lftEqpNm);
//			//alert(JSON.stringify(data));
//			//setPortId(data.eqpId);
//			//setCardId(data.eqpId);
//			}
//		});
//	});
	
    //엑셀다운로드
    $('#btnExportExcel').on('click', function(e) {
    	funExcelBatchExecute();
    	//alertBox('I', "배치작업예정");
    	//var dataParam = $.param(getExcelParam(), true);
		//cflineShowProgressBody();
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getRingListExcelDown', dataParam, 'GET', 'excelDownload');
    });
    
// 	//배치실행
//    $('#btnExcelBatchExecute').on('click', function(e) {
//    	funExcelBatchExecute();
//    });    
//    //배치상태확인
// 	$('#btnExcelBatchExecuteStatus').on("click", function(e){
// 		funExcelBatchExecuteStatus();
// 	});
// 	//배치엑셀다운로드
// 	$('#btnExcelDownload').on("click", function(e){
// 		funExcelDownload();
//	});
 	
    function getExcelParam(){
   	 	var dataParam =  $("#searchForm").getData();
   	 	var gridHeader = [];

	   	var excelHeaderCd = "";
	 	var excelHeaderNm = "";
	 	var excelHeaderAlign = "";
	 	var excelHeaderWidth = "";
   	 	var replaceColumn = {"mgmtGrpCd":"mgmtGrpCdNm","ntwkTypCd":"ntwkTypNm","topoSclCd":"topoSclNm","ntwkCapaCd" : "ntwkCapaNm","ringSwchgMeansCd":"ringSwchgMeansNm"};
   	 	//replace컬럼: 관리그룹, 망구분, 망종류, 용량, 절체방식 
   	 	//제외컬럼: 링구성도
   	 	$.each(excelColumn, function(key,val){
   	 		if(!(val.selectorColumn || val.numberingColumn || val.hidden || val.key == undefined)){
   	 			excelHeaderCd += val.key +";";
				excelHeaderNm += val.title +";";
				excelHeaderAlign += val.align + ";";
				excelHeaderWidth += val.width + ";";
   	 		}
   	 	});
   	 	     	
     	$.each(replaceColumn, function(key,val){
     		excelHeaderCd = excelHeaderCd.replace(key, val);         		
     	});
     	
     	dataParam.excelHeaderCd = excelHeaderCd;
     	dataParam.excelHeaderNm = excelHeaderNm;
     	dataParam.excelHeaderAlign = excelHeaderAlign;
     	dataParam.excelHeaderWidth = excelHeaderWidth;

     	dataParam.fileExtension = "xlsx";
     	dataParam.excelPageDown = "N";
     	dataParam.excelUpload = "N";
     	
//     	$.extend(dataParam,{"topoLclCd":'003'});
//     	$.extend(dataParam,{"topoSclCd":'101'});
//     	$.extend(dataParam,{"mgmtGrpCd":'0002'}); /* SKB */
     	
     	var stabIndex = $('#basicTabs').getCurrentTabIndex();
	   	var specialChar = /[\(\),]/gi;
	   	var dataCnt = 0;
	   	
     	if(stabIndex == "0"){
	   		var data = $('#'+gridId).alopexGrid('dataGet');
	   		dataCnt = data.length;
			dataParam.method = "ringInfo";
			dataParam.lastRowIndex = Number($('#ringTotalCntSpan').text().replace(specialChar,"").trim());
			dataParam.fileName = cflineMsgArray['ring']+cflineMsgArray['information']; /* 링정보 */
	   	}else if(stabIndex == "1"){
	   		var dataWork = $('#'+gridWorkId).alopexGrid('dataGet');
	   		dataCnt = dataWork.length;
			dataParam.method = "ringWorkInfo";
			dataParam.lastRowIndex = Number($('#workTotalCntSpan').text().replace(specialChar,"").trim());
			dataParam.fileName = cflineMsgArray['ring']+cflineMsgArray['workInfo']; /* 링작업정보 */
			
			// ADAMS 연동 고도화
          	//TODO 이전으로 20240911
//			if($('#mgmtGrpCd').val() == "0001" || ($('#topoSclCd').val() == '030' || $('#topoSclCd').val() == '031')) {
//				$('#btnDupMtsoMgmt').setEnabled(true);
//			}else {
//				$('#btnDupMtsoMgmt').setEnabled(false);
//			}
	   	}
	   	if(dataCnt <= 0){
//	   		alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다. */
	   		return;
	   	}
     	
     	return dataParam;
    }
    
    function createGrid(sTypes) {
    	var nodata = cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */;
    	if(sTypes == "All" || sTypes == "RingInfo"){
	        //	그리드 생성
	        $('#'+gridId).alopexGrid({
	        	pager : true,
            	autoColumnIndex: true,
        		autoResize: true,
        		cellSelectable : false,
        		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        		rowClickSelect : true,
        		rowSingleSelect : false,
        		numberingColumnFromZero: false,
        		defaultColumnMapping:{sorting: true},
    			columnMapping:columnRingInfo,
    			fillUndefinedKey:null,
				rowOption:{inlineStyle: function(data,rowOption){
					    // 작업정보
		    			if(data['ntwkLineWorkYn'] == 'Y' && data['workMgmtYn'] == 'Y' && data['ntwkStatCd'] != '02') {
		    				return {color:'red'} // background:'orange',
		    			}
		    			/*// 해지회선
		    			if(data['ntwkStatCd'] == '02') {
		    				return {color:'gray'}; // background:'orange',
		    			}*/
		    		}
		    	},
	    		// contextmenu
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    							title: cflineMsgArray['workInfo'] /*작업 정보*/,
	    						    processor: function(data, $cell, grid) {
	    						    	fnWorkCnvt();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	//return data._state.selected;
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  && nullToEmpty(selectedData[i].ntwkStatCd) != "02" && nullToEmpty(selectedData[i].ntwkStatCd) != "04"){
	    						    			returnValue = true;
	    						    			//break;
	    						    		}
	    						    		// 해지회선 제외하기 위해
	    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) == "02" && nullToEmpty(selectedData[i].ntwkStatCd) == "04" ) {
	    						    			returnValue = false;
	    						    			break;
	    						    		}
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    }
	    					   }
	    		               ,{ 
	    		            	   title: cflineCommMsgArray['restoration'],   /*복원*/
	    		            	   processor: function(data, $cell, grid) {
	    		            		   funRevokeTrmn();
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   //return data._state.selected;
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].ntwkStatCd) == "02"  ){
	    						    			returnValue = true;
	    						    			//break;
	    						    		}
	    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) != "02" ) {
	    						    			returnValue = false;
	    						    			break;
	    						    		}
	    						    	}
	    						    	return returnValue;
	    		            	   }
	    		               }
	    		               /*
	    					    * 링 상세정보
	    					    
	    					   {
	    		            	    title: '링 상세정보',
	    						    processor: function(data, $cell, grid) {
	    						    	var rowIndex = data._index.row;
	    						    	var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    						    	
	    						    	showPopRing( gridId, dataObj );
	    						    }
	    					   }
	    					   */
	    		               ,{
		   							title: cflineMsgArray['acceptLine']+cflineMsgArray['list'] /* 수용회선목록*/,
		   						    processor: function(data, $cell, grid) { fnAcceptNtwkList(data); }
		    		               ,use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].ntwkStatCd) == "02"  ){
	    						    			returnValue = false;
	    						    			break;
	    						    		}
	    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) != "02" ) {
	    						    			returnValue = true;
	    						    		}
	    						    	}
	    						    	return returnValue;
	    		            	   }
	   					   }
	    		               ],
		    	message: {
		    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
				}
			});
    	}
    	if(sTypes == "All" || sTypes == "WorkInfo"){
	        //	그리드 생성
	        $('#'+gridWorkId).alopexGrid({
	        	pager : true,
	        	autoColumnIndex: true,
	        	autoResize: true,
	        	cellSelectable : false,
	        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	        	rowInlineEdit : true, //행전체 편집기능 활성화
	        	rowClickSelect : true,
	        	rowSingleSelect : false,
	        	numberingColumnFromZero: false,
	        	defaultColumnMapping:{sorting: true},
	        	columnMapping:columnWorkInfo,
	        	fillUndefinedKey:null,
	    		// contextmenu
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		setOriginalFromStart : true,  // dataSet /dataAdd 시점의 original 데이터를 생성할지 여부    		
	    		contextMenu : [
	    		               {
	    							title: cflineMsgArray['workInfSave'] /*작업정보저장*/,
	    						    processor: function(data, $cell, grid) {
	    						    	fnUpdateWorkInfo();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  && nullToEmpty(selectedData[i].ntwkStatCd) != "02" && nullToEmpty(selectedData[i].ntwkStatCd) != "04"){
	    						    			returnValue = data._state.selected;
	    						    		}
	    						    		// 해지회선과 해지요청중회선 제외하기 위해
	    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) == "02" && nullToEmpty(selectedData[i].ntwkStatCd) == "04" ) {
	    						    			returnValue = false;
	    						    			break;
	    						    		}
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    	
//	    						    	// ADAMS 연동 고도화
//		    		            	   if($('#mgmtGrpCd').val()=='0001' && data.mgmtGrpCd == '0001'
//		    		            		   || ($('#topoSclCd').val() == '030' || $('#topoSclCd').val() == '031')){
//		    						    	var selectedData = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
//		    						    	var returnValue = false;
//		    						    	
//		    						    	for(var i in selectedData){
//		    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  && nullToEmpty(selectedData[i].ntwkStatCd) != "02" && nullToEmpty(selectedData[i].ntwkStatCd) != "04"){
//		    						    			returnValue = data._state.selected;
//		    						    		}
//		    						    		// 해지회선과 해지요청중회선 제외하기 위해
//		    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) == "02" && nullToEmpty(selectedData[i].ntwkStatCd) == "04" ) {
//		    						    			returnValue = false;
//		    						    			break;
//		    						    		}
//		    						    	}
//		    						    	
//		    						    	return returnValue;
//	    		            		   }else{
//	    		            			   return false;
//	    		            		   }
	    						    }
	    					   },
	    		               {
	    		            	   title: cflineMsgArray['workInfo']+cflineMsgArray['finish'] /*작업정보완료*/,
	    		            	   processor: function(data, $cell, grid) {
	    		            		   fnWorkInfoFnsh(false);
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   var selectedData = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  && nullToEmpty(selectedData[i].ntwkStatCd) != "02" && nullToEmpty(selectedData[i].ntwkStatCd) != "04"){
	    						    			returnValue = data._state.selected;
	    						    		}
	    						    		// 해지회선과 해지요청중회선 제외하기 위해
	    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) == "02" && nullToEmpty(selectedData[i].ntwkStatCd) == "04" ) {
	    						    			returnValue = false;
	    						    			break;
	    						    		}
	    						    	}
	    						    	
	    						    	return returnValue;
//		    		            		// ADAMS 연동 고도화
	    					          	//TODO 이전으로 20240911
//	    		            		   if($('#mgmtGrpCd').val()=='0001' && data.mgmtGrpCd == '0001'
//	    		            			   || ($('#topoSclCd').val() == '030' || $('#topoSclCd').val() == '031')){
//		    		            		   var selectedData = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
//		    						        var returnValue = false;
//		    						    	
//		    						    	for(var i in selectedData){
//		    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  && nullToEmpty(selectedData[i].ntwkStatCd) != "02" && nullToEmpty(selectedData[i].ntwkStatCd) != "04"){
//		    						    			returnValue = data._state.selected;
//		    						    		}
//		    						    		// 해지회선과 해지요청중회선 제외하기 위해
//		    						    		if (nullToEmpty(selectedData[i].ntwkStatCd) == "02" && nullToEmpty(selectedData[i].ntwkStatCd) == "04" ) {
//		    						    			returnValue = false;
//		    						    			break;
//		    						    		}
//		    						    	}
//		    						    	return returnValue;
//	    		            		   }else{
//	    		            			   return false;
//	    		            	       } 
	    		            		   
	    		            	   }
	    		               },
	    		               {
	    		            	   title: cflineMsgArray['AllWorkInfFnsh'] /*모든작업정보완료*/,
	    		            	   processor: function(data, $cell, grid) {
	    		            		   fnWorkInfoFnsh(true);
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   return data._state.selected;
//		    		            		// ADAMS 연동 고도화
//	    		            		   if($('#mgmtGrpCd').val()=='0001' && data.mgmtGrpCd == '0001'
//	    		            			   || ($('#topoSclCd').val() == '030' || $('#topoSclCd').val() == '031')){
////	    		            		   if(data.mgmtGrpCd == '0001'){
//	    		            			   return data._state.selected;
//	    		            		   }else{
//	    		            			   return false;
//	    		            	       } 
	    		            	   }
	    		               },
	    		               {
	    		            	   title: cflineMsgArray['trmn'] /*해지*/,
	    		            	   processor: function(data, $cell, grid) {
	    		            		   // 선번정보 존재 체크후 선번정보 없는경우만 해지로직 타도록 <= 1. 선로존재여부 체크하지 않고 해지
	    		            		   fnLineTerminate();
	    		            		   //checkLnSctnInfo();
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
    		            			   return data._state.selected;
	    		            		// ADAMS 연동 고도화
    		           	          	//TODO 이전으로 20240911
//	    		            		   if($('#mgmtGrpCd').val()=='0001' && data.mgmtGrpCd == '0001'
//	    		            			   || ($('#topoSclCd').val() == '030' || $('#topoSclCd').val() == '031')){
////	    		            		   if(data.mgmtGrpCd == '0001'){
//	    		            			   return data._state.selected;
//	    		            		   }else{
//	    		            			   return false;
//	    		            	       } 
//	    		            		   return data._state.selected;
	    		            	   }
	    		               }
	    		               /*
	    					    * 링 상세정보
	    					    
	    					   {
	    		            	    title: '링 상세정보',
	    						    processor: function(data, $cell, grid) {
	    						    	var rowIndex = data._index.row;
	    						    	var dataObj = AlopexGrid.trimData($('#'+gridWorkId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    						    	
	    						    	showPopRing( gridWorkId, dataObj );
	    						    }
	    					   }
	    					   */
	    		               ],
		    	message: {
		    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
				}
	        }); 
    	}
        $('#'+gridWorkId).alopexGrid("viewUpdate");
    }
    
    // 작업전환function
    function fnWorkCnvt(){
		if( $('#'+gridId).length == 0) return;  // 그리드가 존재하지 않는 경우
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		var paramDataList = [];
		var tempNtwkLineNm = "";
		var chkTrmn = 0;
		msgVal = "";
		if (dataList.length > 0 ){
			for(k=0; k<dataList.length; k++){
				if(dataList[k].ntwkLineWorkYn == "N" 
					&& dataList[k].workMgmtYn == "Y"   /*사용자관할전송실여부*/
				    && dataList[k].ntwkStatCd !='02'   /*네트워크상태값 : 해지 아닌것만*/
						){	
					paramDataList.push({ 
										"ntwkLineNo":dataList[k].ntwkLineNo
										, "tmpIndex":dataList[k]._index.row
							            , "mtsoLnoInsProgStatCd":"02"
 							            , "singleMtsoIdYn":false
 							           });
					dataList[k].ntwkLineWorkYn = "Y";
				}else{
					tempNtwkLineNm = dataList[k].ntwkLineNm;
					if (dataList[k].ntwkStatCd =='02') {
						tempNtwkLineNm = tempNtwkLineNm + "(" + "해지" + ")";
						chkTrmn = chkTrmn +1;
					}
					if(msgVal==""){
						msgVal = tempNtwkLineNm
						
					}else{
						msgVal += "," + tempNtwkLineNm;
					}
				}
			}
			
			for(j=0; j<paramDataList.length; j++){	
				// 해지회선 이외
				if (paramDataList[j].ntwkStatCd !='02') {
					$('#'+gridId).alopexGrid("updateOption", {
						rowOption : {_index:{row:paramDataList[j].tmpIndex}}, color: 'red'
					});					
				}
			}
			if(msgVal != null && msgVal != ""){ // 메세지 세팅
				msgVal =  cflineMsgArray['ringName']/*링명*/ + makeArgMsg('preRegistration',"[" + [msgVal] + "]","","","")/* {0}는(은) 이미 작업정보로 등록되었습니다. */;
			}
			if (chkTrmn > 0) {
				msgVal = msgVal + "(" + "해지회선은 제외됨" + ")";
			}
			
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getWorkCnvt', paramDataList, 'POST', 'workCnvt');
		}else{
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
		}
    }
    
    // 작업정보저장 function
    function fnUpdateWorkInfo(){
    	if($('#'+gridWorkId).length == 0) {return;}
		$('#'+gridWorkId).alopexGrid('endEdit', {_state:{editing:true}});
		var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
    	dataList = AlopexGrid.currentData(dataList);

    	// FDF 사용정보 
    	fdfUsingInoLineNo = "";
    	
    	sendToTsdnLineNo = "";
    	
    	if (dataList.length > 0 ){
    		
    		for (var i=0; i < dataList.length; i++) {

	    		//SKB그룹중 가입자망링, 휘더망링이 포함된 경우 저장 불가능함 - ADAMS고도화 
	    		//if( dataList[i].mgmtGrpCd == "0002" && (dataList[i].topoSclCd != "030" && dataList[i].topoSclCd != "031" )) {
//		    	if(dataList[i].mgmtOnrNm == "ADAMS") {
//	    			alertBox('W', "ADAMS에서 연동된 링이 포함되어 있습니다.");
//	    			$('#'+gridWorkId).alopexGrid("startEdit");
//	    			return;
//	    		}
	    		
    			// 해지요청중인 건은 완료처리 할 수 없음
	    		if ( dataList[i].ntwkStatCd == "04" ) {
	    			alertBox('W', "해지요청중은 작업정보 저장할 수 없습니다.");
	    			$('#'+gridWorkId).alopexGrid("startEdit");
	    			return;
	    		}
    		}
    		
    		if(fnVaildation(dataList)){
				var updateList = $.map(dataList, function(data){
					/* 작업정보의 경우 변경이 이루어진 경우에만 업데이트 */
					var eqpDivCd = "";
					if(data.eqpDivCd != data.eqpInfDivCd) {
						eqpDivCd = data.eqpDivCd;
					}
					
					
					var saveParam = {
							  "ntwkLineNo":data.ntwkLineNo
							, "ntwkLineNm":data.ntwkLineNm
							, "lastChgUserId":data.lastChgUserId
							, "mgmtGrpCd":data.mgmtGrpCd
							, "ntwkTypCd":data.ntwkTypCd
							, "topoSclCd":data.topoSclCd
							, "ntwkCapaCd":data.ntwkCapaCd
							, "ringSwchgMeansCd":data.ringSwchgMeansCd
							, "repNtwkLineNo":data.repNtwkLineNo
							, "crrtYn":data.crrtYn
							, "hdofcOrgId":data.hdofcOrgId
							, "teamOrgId":data.teamOrgId
							, "ringMgmtObjYn":data.ringMgmtObjYn
							, "ringMgmtWoRsn":data.ringMgmtWoRsn
							, "topoCfgMeansCd":data.topoCfgMeansCd
							, "mwUsgDivCd":data.mwUsgDivCd
							, "atnrVal":data.atnrVal
							, "sctnDistK":data.sctnDistK
							, "mwFreqCd":data.mwFreqCd
							, "modulMeansCd":data.modulMeansCd
						    , "mwBdwhCd":data.mwBdwhCd
						    , "chnlCnt":data.chnlCnt
						    , "uprMtsoAtnSz":data.uprMtsoAtnSz
						    , "lowMtsoAtnSz":data.lowMtsoAtnSz
						    
						    , "orglNtwkTypCd":data.orglNtwkTypCd
						    , "orglTopoSclCd":data.orglTopoSclCd
						    , "wkSprYn":data.wkSprYn
						    , "eqpDivCd" : eqpDivCd   /* 장비구분 추가 2020-05-13 */
						    , "otdrLnkgMeansCd" : data.otdrLnkgMeansCd   /* OTDR연동방식코드 추가 2022-05-17 */
						    , "otdrSctnNm" : data.otdrSctnNm   /* OTDR구간명 추가 2022-07-15 */
					};
					
       			    // FDF 사용정보 
    		    	fdfUsingInoLineNo = fdfUsingInoLineNo + data.ntwkLineNo + ",";
       			    // 링정보 TSDN에 
    		    	sendToTsdnLineNo = sendToTsdnLineNo + data.ntwkLineNo + ",";
    		    	
					return saveParam;
				});
				cflineShowProgressBody();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/updateWorkInfo', updateList, 'POST', 'updateWorkInfo');
    		}
		}else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$('#'+gridWorkId).alopexGrid("startEdit");
		}
    }

    
    // 해지전 체크
    function checkLnSctnInfo() {
    	if( $('#'+gridWorkId).length == 0) return;
    	var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
    	

    	if (dataList.length > 0 ){	
    		cflineShowProgressBody();
    		var paramList = new Array();
    		for(i=0;i<dataList.length;i++){
   				paramList.push(dataList[i].ntwkLineNo);
    		}
    		var chkParam = {
    				  ntwkLineNoList : paramList
    				, lineType : 'N'
    		}
    		
    		//console.log(chkParam);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/checklnsctninfo', chkParam, 'POST', 'checklnsctninfo');
    	}
    	else{
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
    	}
    }
    
    // 해지
    function fnLineTerminate(){
    	if( $('#' + gridWorkId).length == 0 ) return;
    	var dataList = $('#' + gridWorkId).alopexGrid('dataGet', {_state: {selected: true}});
    	
    	var paramList = new Array();		// 네트워크ID를 담음
    	var param2List = new Array();		// 토폴로지 소분류코드를 담음
    	var param3List = new Array();		// 회선승인작업구분값을 담음
    	var ntwkNoList = "";					// 승인권한이 없을 때 해지요청을 담음
    	var appltNoList = "";					// SMUX링 경우 청약번호가 존재하면 해지불가
    	var cascadingRingMsg = "";			// 경유링 사용건수가 있는 경우 해지 불가
    	
    	// [수정] 20181217 해지승인 권한이 없을 때 선택된 리스트에 해지요청중이 있다면 alert
    	if ( dataList.length > 0 ) {
    		fdfUsingInoLineNo = "";				// FDF 사용정보
        	sendToTsdnLineNo = "";				// 링 정보 TSDN에 전송
        	procAcceptTargetList = "";			// 해지 시 자동수정대상테이블에서 삭제
        	
    		for ( var i = 0; i < dataList.length; i++ ) {

	    		//SKB그룹중 가입자망링, 휘더망링이 포함된 경우 저장 불가능함 - ADAMS고도화
	    		//if( dataList[i].mgmtGrpCd == "0002" && (dataList[i].topoSclCd != "030" && dataList[i].topoSclCd != "031" )) {
//    			if(dataList[i].mgmtOnrNm == "ADAMS") {
//	    			alertBox('W', "ADAMS에서 연동된 링이 포함되어 있습니다.");
//	    			$('#'+gridWorkId).alopexGrid("startEdit");
//	    			return;
//	    		}
	    		
    			// 체크1. 해지요청건 체크
    			if ( dataList[i].ntwkStatCd == "04" ) {
    				// 체크 1-1. 권한이 있는 경우
    				if ( $('#chkAprv').val() == "Y" ) {
    					if ( ( dataList[i].topoSclCd == "033" || dataList[i].topoSclCd == "035" || dataList[i].topoSclCd == "036" || dataList[i].topoSclCd == "042" ) ) {
    							paramList.push(dataList[i].ntwkLineNo);
    	    					param2List.push(dataList[i].topoSclCd);
    							param3List.push("T");
    	    					// FDF 사용정보 
                		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].ntwkLineNo + ",";
                   			    // 링정보 TSDN에 전송(해지는 제외) 
                		    	sendToTsdnLineNo = sendToTsdnLineNo + dataList[i].ntwkLineNo + ",";
                		    	// 해지시 자동수정대상테이블에서 삭제
                		    	procAcceptTargetList = procAcceptTargetList + dataList[i].ntwkLineNo + ",";
    					}
    					else {
    						alertBox("W", "해지요청은 5G-PON링, SMUX링만 청약을 통해 신청가능합니다.");
    						return;
    					}
    				}
    				// 체크 1-2. 권한이 없는 경우
    				else if ( $('#chkAprv').val() == "N" ) {
    					ntwkNoList += dataList[i].ntwkLineNo + ",";
    				}
    			}
    			// 체크2. 해지요청이 아닌 나머지 상태일 경우
    			else {
    				
    				// 청약번호가 있는경우 해지요청중을 통해서만 해지 가능(20190103 - 청약측 해지요청건 처리가 되면 해당 주석 제거)
    				/*if (( dataList[i].topoSclCd == "033" || dataList[i].topoSclCd == "035" || || dataList[i].topoSclCd == "036" ) && nullToEmpty(dataList[i].lineAppltNo) != "") {
    					appltNoList += dataList[i].ntwkLineNo + ",";
    					continue;
    				}*/
    				
    				
    				// 경유링인 경우 해지 대상에서 제외
    				if (parseInt(nvlStr(dataList[i].useRingCnt, "0")) > 0 || parseInt(nvlStr(dataList[i].usedCnt, "0")) > 0) {
    					cascadingRingMsg += cascadingRingMsg != "" ? ",<br>"  : "" + dataList[i].ntwkLineNm + "(경유링 사용건 : " + nvlStr(dataList[i].useRingCnt, "0") 
    							         + ", 경유링으로 사용된 건 : " + nvlStr(dataList[i].usedCnt, "0")  +")";
    					continue;
    				}
    				
    				paramList.push(dataList[i].ntwkLineNo);
					param2List.push(dataList[i].topoSclCd);
					param3List.push("NONE");  // 해지요청중과 관련된 작업이 아님
					// FDF 사용정보 
    		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].ntwkLineNo + ",";
       			    // 링정보 TSDN에 전송(해지는 제외) 
    		    	sendToTsdnLineNo = sendToTsdnLineNo + dataList[i].ntwkLineNo + ",";
    		    	// 해지시 자동수정대상테이블에서 삭제
    		    	procAcceptTargetList = procAcceptTargetList + dataList[i].ntwkLineNo + ",";
    			}
    		}
    		
    		var msg = "";
    		
    		// 해지요청중건 권한이 없는 경우
    		if (ntwkNoList.length > 0) {
    			msg += "[" + ntwkNoList.substring(0, ntwkNoList.length -1) + "]건은<br> 승인권한이 없기 때문에 승인해지가 불가능합니다.<br>"; 
    		}
    		// 승인해지건중 청약번호가 있는 S-MUX, 5G-PON 인경우
    		if (appltNoList.length > 0) {
    			msg += "[" + appltNoList.substring(0, appltNoList.length -1) + "]건은<br> 청약을 통해 해지요청 후 해지처리 하시기 바랍니다.<br>"; 
    		}
    		
    		// 경유링을 사용하거나 경유링으로 사용중인건
    		if (cascadingRingMsg != "") {
    			msg += "[ " + cascadingRingMsg + " ]<br>건은 경유링 사용을 삭제하시고 해지처리 하시기 바랍니다.<br>";
    		}

   			if (paramList.length == 0) {
   				alertBox("W", msg);
   				return;
   			} else {
   				msg += "<br>"+ makeArgMsg("confirmSelectData", paramList.length ,cflineMsgArray['trmn'],"",""); /* {dataList.length}건을 {해지}하시겠습니까? */ 
	    		callMsgBox('','C', msg, function(msgId, msgRst){
	           		if (msgRst == 'Y') {
	           			var param = {"ntwkLineNoList":paramList, "topoSclCdList":param2List, "lineAprvWorkDivList" : param3List, "topoLclCd":"001", "topoSclCd":"" };	           			
						cflineShowProgressBody();
   	           			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/terminatenetworkline', param, 'POST', 'terminate');
	           		}
	    		});
   			}
    	}
    	else{
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */ 
    		//$("#"+gridIdWork).alopexGrid("startEdit");
    	}
    }
    
    //작업정보완료, 모든작업정보완료
    function fnWorkInfoFnsh(isAll){
    	if( $('#'+gridWorkId).length == 0) return;
    	
    	var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	
    	if (dataList.length > 0 ){
    		
    		for (var i=0; i < dataList.length; i++) {
    			
    			//SKB그룹중 가입자망링, 휘더망링이 포함된 경우 저장 불가능함 - ADAMS고도화
	    		//if( dataList[i].mgmtGrpCd == "0002" && (dataList[i].topoSclCd != "030" && dataList[i].topoSclCd != "031" )) {
//    			if(dataList[i].mgmtOnrNm == "ADAMS") {
//	    			alertBox('W', "ADAMS에서 연동된 링이 포함되어 있습니다.");
//	    			$('#'+gridWorkId).alopexGrid("startEdit");
//	    			return;
//	    		}
	    		// 해지요청중인 건은 완료처리 할 수 없음
	    		if ( dataList[i].ntwkStatCd == "04" ) {
	    			alertBox('W', "해지요청중은 완료처리 할 수 없습니다.");
	    			return;
	    		}
    		}

        	// FDF 사용정보 
        	fdfUsingInoLineNo = "";
        	// 링정보 TSDN에 전송 
        	sendToTsdnLineNo = "";
        	
    		if(fnVaildation(dataList)){
    			var updateList = $.map(dataList, function(data){
    				var saveParam = {
						  "ntwkLineNo":data.ntwkLineNo
						, "ntwkLineNm":data.ntwkLineNm
						, "lastChgUserId":data.lastChgUserId
						, "mgmtGrpCd":data.mgmtGrpCd
						, "ntwkTypCd":data.ntwkTypCd
						, "topoSclCd":data.topoSclCd
						, "ntwkCapaCd":data.ntwkCapaCd
						, "ringSwchgMeansCd":data.ringSwchgMeansCd
						, "repNtwkLineNo":data.repNtwkLineNo
						, "crrtYn":data.crrtYn
						, "hdofcOrgId":data.hdofcOrgId
						, "teamOrgId":data.teamOrgId
						, "ringMgmtObjYn":data.ringMgmtObjYn
						, "ringMgmtWoRsn":data.ringMgmtWoRsn
						, "topoCfgMeansCd":data.topoCfgMeansCd
						, "mwUsgDivCd":data.mwUsgDivCd
						, "atnrVal":data.atnrVal
						, "sctnDistK":data.sctnDistK
						, "mwFreqCd":data.mwFreqCd
						, "modulMeansCd":data.modulMeansCd
					    , "mwBdwhCd":data.mwBdwhCd
					    , "chnlCnt":data.chnlCnt
					    , "uprMtsoAtnSz":data.uprMtsoAtnSz
					    , "lowMtsoAtnSz":data.lowMtsoAtnSz
					    , "otdrLnkgMeansCd":data.otdrLnkgMeansCd /* OTDR연동방식 추가 */
					    , "otdrSctnNm":data.otdrSctnNm /* OTDR구간명 추가 */
    				}; 

       			    // FDF 사용정보 
    		    	fdfUsingInoLineNo = fdfUsingInoLineNo + data.ntwkLineNo + ",";
       			    // 링정보 TSDN에
    		    	sendToTsdnLineNo = sendToTsdnLineNo + data.ntwkLineNo + ",";
    		    	
    				return saveParam;
    			});
    			
    			var param = {"finishAll" : isAll, "ringList" : updateList };
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/workInfoFinish', param, 'POST', 'workInfoFinish');
    		}
    	}else{
    		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
    	}
    }
    
    // 복원function
    function funRevokeTrmn(){
		if( $('#'+gridId).length == 0) return;  // 그리드가 존재하지 않는 경우
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		var paramList = new Array();
    	if (dataList.length > 0 ){	

        	// FDF 사용정보 
        	fdfUsingInoLineNo = "";
        	// 링 정보 TSDN에전송 
        	sendToTsdnLineNo = "";
        	
    		var msg = makeArgMsg("confirmSelectData",dataList.length,cflineCommMsgArray['restoration'],"",""); /* {dataList.length}{0}건을 {1}하시겠습니까?  */
    		callMsgBox('','C', msg, function(msgId, msgRst){
           		if (msgRst == 'Y') {
           			cflineShowProgressBody();
           			for(i=0;i<dataList.length;i++){
           				paramList.push(dataList[i].ntwkLineNo);

           			    // FDF 사용정보 
        		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].ntwkLineNo + ",";
           			    // 링 정보 TSDN에전송
        		    	sendToTsdnLineNo = sendToTsdnLineNo + dataList[i].ntwkLineNo + ",";
        		    	
           			}
           			var param = {"ntwkLineNoList":paramList };
           			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/revoketrmn', param, 'POST', 'revoketrmn');
           		}
    		});  
    	}
    	else{
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
    	}
    }
    
    function fnVaildation(dataList){
    	var msgStr = "";
    	var validate = true;
    	var saveVal = "";
    	var isRepNtwkLineNo = false;
    	var wdmRingCheck = false;
    	var wdmRingCheckMsg = "";
    	var gisCheck = false;
    	var gisCheckMsg = "";
    	var mgmtObjCheck = false;
    	var mgmtObjCheckMsg = "";
    	var atnrValLengthCheck = false;
    	var atnrValLengthCheckMsg = "";
    	var sctnDistKLengthCheck = false;
    	var sctnDistKLengthCheckMsg = "";
    	//var chnlCntLengthCheck = false;
    	//var chnlCntLengthCheckMsg = "";
    	var uprMtsoAtnSzLengthCheck = false;
    	var uprMtsoAtnSzLengthCheckMsg = "";
    	var lowMtsoAtnSzLengthCheck = false;
    	var lowMtsoAtnSzLengthCheckMsg = "";
    	var ringMgmtWoRsnLengthCheck = false;
    	var ringMgmtWoRsnLengthCheckMsg = "";
    	/*var ntwkStatCdCheck = false;
    	var ntwkStatCdCheckMsg = "";*/
		var requiredColumn = { ntwkLineNm : cflineMsgArray['ringName']
							, ntwkTypCd : cflineMsgArray['networkDivision']
							, topoSclNm : cflineMsgArray['ntwkTopologyCd']
							, ntwkCapaCd : cflineMsgArray['capacity']
							, ringSwchgMeansCd : cflineMsgArray['ringSwchgMeansCd']
							, ringMgmtObjYn : cflineMsgArray['ringCreateObject']
					    	, hdofcOrgId : cflineMsgArray['managementHeadOffice']
				    		, teamOrgId : cflineMsgArray['managementTeam']
		                    , topoCfgMeansCd : cflineMsgArray['topologyConfigurationMeans']  //토폴로지구성방식 필수입력으로 추가 - 2020.07.16
							, repNtwkLineNo : cflineMsgArray['feederLinkRing']
		};
    	for(var i=0; i<dataList.length; i++){
    		//필수입력항목을 모두 입력한 경우에는 [saveVal] 의 값은 "" 이 된다.
    		$.each(requiredColumn, function(key,val){
    			var value = eval("dataList[i]" + "." + key);
    			if(nullToEmpty(value) == ""){
    				msgStr = "<br>"+dataList[i].ntwkLineNo + " : " + val;
    				saveVal = val;
    				validate = false;
    				//필수는 아니지만 휘더망링명만 있고 링번호가 없는 경우 에러
    				if(key == "repNtwkLineNo" && nullToEmpty(dataList[i].repNtwkLineNo) == "" && nullToEmpty(dataList[i].repNtwkLineNm) != ""){
    					isRepNtwkLineNo = true;
    				}
    				return validate;
    			}
         	});
    		if(dataList[i].mgmtGrpCd == "0001"){
    			var chkCnt  = 0 ;
    			for(var j=0; j < NtwkTypDataSkt.length; j++){
    				var tmpNtwkTypCd = NtwkTypDataSkt[j];
    				if( tmpNtwkTypCd.value ==dataList[i].ntwkTypCd){
    					chkCnt++;
    					break;
    				}
    			}
    			if(chkCnt==0){
					msgStr = "<br>"+dataList[i].ntwkLineNo + " : " + cflineMsgArray['networkDivision'];
					validate = false;
					var checkNtwkTypDataSkt = true;
    			}
    		}
    		
			if( dataList[i].topoSclCd == "013"){
				wdmRingCheck = true;
				wdmRingCheckMsg = dataList[i].ntwkLineNo + "<br>" + cflineMsgArray['wdmRingCheckMsg'];
				validate = false;
				if(dataList[i].orglTopoSclCd == "013"){
    				wdmRingCheck = false;
    				validate= true;
				}
			}
			
			/* 2019-05-16 5G-PON인 경우에도 한글영문숫자(5자리이하)로 체크함 */
			// 2. [수정] 5GPON 링명 작성규칙
			if( dataList[i].topoSclCd == "033"){
				
				var reg_ring_name = /^([가-힣a-zA-Z0-9]{1,5})_5GPONC([X]{2}|[x]{2}|\d{2})링$/;
	    		
	    		if (reg_ring_name.test(nullToEmpty(dataList[i].ntwkLineNm)) == false) {	    			 
	    			validate = false;
					var msgArg = "한글영문숫자(5자리이하)_5GPONCxx(x2자리 혹은 숫자2자리)링";
	        		var msgArg1 = " ex)분당전송실_5GPONCxx링, 보라매_5GPONC05링 ";
	        		alertBox('W', dataList[i].ntwkLineNo + " : <br>" + makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 /*링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) */

					$('#'+gridWorkId).alopexGrid("startEdit");
	        		return validate;
	    		}  
			}
			// 6. [수정] 5GPON 2.0링명 작성규칙
			// 9. [수정] 5GPON 2.0링명 작성규칙 (한글1자 생략가능)7자리 변경 
			if( dataList[i].topoSclCd == "036"){
				
				var reg_ring_name = /^(\(지\)[가-힣a-zA-Z0-9]{1,5}|[가-힣a-zA-Z0-9]{1,7})_5GPON2C([X]{2}|[x]{2}|\d{2})링$/;
	    		
	    		if (reg_ring_name.test(nullToEmpty(dataList[i].ntwkLineNm)) == false) {	    			 
	    			validate = false;
					var msgArg = "(지)한글영문숫자(5자리이하)_5GPON2Cxx(x2자리 혹은 숫자2자리)링 또는 " +
							"한글영문숫자(7자리이하)_5GPON2Cxx(x2자리 혹은 숫자2자리)링";
	        		var msgArg1 = " ex)(지)분당전송실_5GPON2Cxx링, 분당전송실_5GPON2Cxx링, 보라매_5GPON2C05링 ";
	        		alertBox('W', dataList[i].ntwkLineNo + " : <br>" + makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 /*링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) */

					$('#'+gridWorkId).alopexGrid("startEdit");
	        		return validate;
	    		}  
			}
			
			// 
			// 4. [수정] SMUX 링명 작성규칙
			// [수정] 4G-LMUX링 추가에 따른 작성규칙수정 - 2024-11-13
			if( dataList[i].topoSclCd == "035"){
				//var reg_ring_name = /^([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,8})_[S,C,L]MUX([A-Z]{0,2})([(\)\0-9]{0,3})([A-Z]{0,1})([X]{3}|[x]{3}|\d{3})링$/;
				var reg_ring_name = /^([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,8})_([0-9,G]{0,2})[S,C,L]MUX([A-Z]{0,3})([(\)\0-9]{0,4})([X]{3}|[x]{3}|\d{3})링$/;

				if (reg_ring_name.test(nullToEmpty(dataList[i].ntwkLineNm)) == false) {	    			 
	    			validate = false;
					var msgArg = " COT장비국소명(한글영문숫자특수문자 7자리이하)-RT장비국소명(한글영문숫자특수문자 8자리이하)_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(4)(채널_존재시)xxx(x3자리 혹은 숫자3자리)링";
	        		var msgArg1 = " ex) 광혜원[2F]-네오로닷컴2F_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(10)(채널존재시)xxx(또는 013)링  <br> 상암통합국4A-네오로닷컴2F_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(4)(채널존재시)013링 ";
	        		//var msgArg2 = " ex) 상암통합국4A-네오로닷컴2F_SMUX(또는 CMUX,LMUX,4GLMUX)A(또는 B,BA,BE,EX)(4)(채널존재시 또는10)013링  ";
	        		
	        		alertBox('W', dataList[i].ntwkLineNo + " : " + makeArgMsg('checkSmuxRingNmRull',msgArg,msgArg1,"",""));	 /* S-MUX링명은 이하의 형식으로 입력해 주세요.<br><br>[ {0} ]<br>({1}) */

					$('#'+gridWorkId).alopexGrid("startEdit");
	        		return validate;
	    		}  
			}
			
			/*
			 * 13. BC-MUX링, CWDM-MUX링 관련 작업
			 * BCMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)+(함체)
			 */
			if( dataList[i].topoSclCd == "040"){
				
				var reg_ring_name = /^BCMUX_COT([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})(\d{2})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,9})(\d{2})(|\(함체\))$/;	
	    		
	    		if (reg_ring_name.test(nullToEmpty(dataList[i].ntwkLineNm)) == false) {	    			 
	    			validate = false;
	        		
	        		var msgArg = "BCMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)+(함체)";
	        		var msgArg1 = " ex) BCMUX_COT강남01-RT 동작구01, BCMUX_COT강남01-RT_동작구01(함체)  ";
	    			
	        		alertBox('W', dataList[i].ntwkLineNo + " : <br>" + makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 /*링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) */

					$('#'+gridWorkId).alopexGrid("startEdit");
	        		return validate;
	    		}  
			}
			
			/*
			 * 13. BC-MUX링, CWDM-MUX링 관련 작업
			 * CWMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)
			 */
			if( dataList[i].topoSclCd == "041"){
				
				var reg_ring_name = /^CWMUX_COT([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,7})(\d{2})-([가-힣a-zA-Z0-9\s\#&\(\)\[\]\+,.\/]{1,9})(\d{2})$/;	
	    		
	    		if (reg_ring_name.test(nullToEmpty(dataList[i].ntwkLineNm)) == false) {	    			 
	    			validate = false;
	    			var msgArg = " CWMUX(영문5자리)_COT국사명(한글영문숫자특수문자 7자리)+설치순번(숫자2자리)-국소명(한글영문숫자특수문자 9자리)+설치순번(숫자2자리)";
	        		var msgArg1 = " ex) CWMUX_COT강남03-RT남산빌딩01, CWMUX_COT강남03-RT_남산빌딩03 ";
	    			
	        		alertBox('W', dataList[i].ntwkLineNo + " : <br>" + makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 /*링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) */

					$('#'+gridWorkId).alopexGrid("startEdit");
	        		return validate;
	    		}  
			}
			
			/*
			 * 15. 5G-PON3.1링 관련 작업
			 */
			if( dataList[i].topoSclCd == "042"){ 
				

				var reg_ring_name = /^(\(지\)[가-힣a-zA-Z0-9]{1,5}|[가-힣a-zA-Z0-9]{1,7})_5GPON3C([X]{2}|[x]{2}|\d{2})-([X]{2}|[x]{2}|\d{2})링$/;
	    		
	    		if (reg_ring_name.test(nullToEmpty(dataList[i].ntwkLineNm)) == false) {	    			 
	    			validate = false;
					var msgArg = "(지)한글영문숫자(5자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-xx(x2자리 혹은 숫자2자리)링 또는 " +
							"한글영문숫자(7자리이하)_5GPON3Cxx(x2자리 혹은 숫자2자리)-(x2자리 혹은 숫자2자리)링";
	        		var msgArg1 = " ex)(지)분당전송실_5GPON3Cxx-xx링, 분당전송실_5GPON3Cxx-xx링, 보라매_5GPON3C05-01링 ";
	        		alertBox('W', dataList[i].ntwkLineNo + " : <br>" + makeArgMsg('checkRingNmRull',msgArg,msgArg1,"",""));	 /*링명은 [ {0} ] 형식으로 입력해 주세요. ({1}) */

					$('#'+gridWorkId).alopexGrid("startEdit");
	        		return validate;
	    		}  
			}
					
			//기간망일때 체크
			//2019.05.15 [신규] ROTN링명 작성규칙 체크 및 중복체크
			if( dataList[i].ntwkTypCd == "001"){
				//중복명 체크
		    	var ntwknm = nullToEmpty(dataList[i].ntwkLineNm).substring(1,5).toUpperCase();
		    	var useRotn = nullToEmpty(dataList[i].ntwkLineNm).indexOf("ROTN");
		    	
		    	if(useRotn > -1) {
		    		
					//var reg_ring_name = /^[z|h|c]{1}ROTN[r][1|2]-[a-zA-Z]{4}[0-9]{3}$/i;
		    		
					var data = $('#'+gridWorkId).alopexGrid("dataGet");
					//중복되는 링명이 있는지 확인한다. - 회선상태가 02(해지)인 경우는 제외
					for(var j=0; j<data.length; j++){
						if(data[j].ntwkLineNo != dataList[i].ntwkLineNo && data[j].ntwkStatCd != "02"){
							if(nullToEmpty(data[j].ntwkLineNm).toUpperCase() == nullToEmpty(dataList[i].ntwkLineNm).toUpperCase()){
								validate = false;
								alertBox('I', dataList[i].ntwkLineNo +" : <br>" + cflineMsgArray['duplRingNmInRingNm']);
				        		$('#'+gridWorkId).alopexGrid("startEdit");
				        		return validate;
							}
						}
					}
					
					if (checkROTNRingNm(dataList[i].topoSclCd, dataList[i].ntwkLineNm) == false) {
						validate = false;
		        		$('#'+gridWorkId).alopexGrid("startEdit");
		        		return validate;
		        	}
				}
			}
			
			// SKT는 이인호M 요청으로 GIS링생성여부 상관없이 링현행화 변경 가능 2018.11
			// SKB는 이재M락 요청으로  링현행화 변경저장시 체크 현행화 여부를 예로 저장 하려면 gis에서 먼저 링이 등록됐는지 확인한다. 단, 링생성대상이 제외인경우 gis등록여부를 확인하지 않는다. 2019.04
			if( dataList[i].mgmtGrpCd == "0002" && dataList[i].crrtYn == "Y" && dataList[i].ringNormRegYn =="N" && dataList[i].ringMgmtObjYn != 'N' ){	
				gisCheck = true;
				gisCheckMsg = dataList[i].ntwkLineNo + "<br>" + cflineMsgArray['gisCheckMsg']; 	/* GIS 링등록이 안되었습니다.<br>GIS 링등록후 변경 가능합니다. */
				validate = false;
			}			
			
			if( dataList[i].atnrVal !="" && dataList[i].atnrVal != null && dataList[i].atnrVal != undefined && (dataList[i].atnrVal.length > 5 || $.isNumeric(dataList[i].atnrVal) == false)) { // 감쇠기값 길이 체크
				var atnrValLengthCheck = true;
		    	var atnrValLengthCheckMsg = dataList[i].ntwkLineNo + "<br>" + "감쇠기값 항목은 숫자로만 5자리까지 입력가능합니다."; 	
			}
			
			if( dataList[i].sctnDistK !="" && dataList[i].sctnDistK != null && dataList[i].sctnDistK != undefined && (dataList[i].sctnDistK.length > 15 || $.isNumeric(dataList[i].sctnDistK) == false)) { // 구간거리(Km) 길이 체크
				var sctnDistKLengthCheck = true;
		    	var sctnDistKLengthCheckMsg = dataList[i].ntwkLineNo + "<br>" + "구간거리(Km) 항목은 숫자로만 15자리까지 입력가능합니다."; 	
			}

//			if( dataList[i].chnlCnt !="" && dataList[i].chnlCnt != null && dataList[i].chnlCnt != undefined && (dataList[i].chnlCnt.length > 10 || $.isNumeric(dataList[i].chnlCnt) == false)) { // 채널수 길이 체크
//				var chnlCntLengthCheck = true;
//		    	var chnlCntLengthCheckMsg = dataList[i].ntwkLineNo + "<br>" + "채널수 항목은 숫자로만 10자리까지 입력가능합니다."; 	
//			}
			
			if( dataList[i].uprMtsoAtnSz !="" && dataList[i].uprMtsoAtnSz != null && dataList[i].uprMtsoAtnSz != undefined && dataList[i].uprMtsoAtnSz.length > 30  ) { // 상위국안테나사이즈 길이 체크
				var uprMtsoAtnSzLengthCheck = true;
		    	var uprMtsoAtnSzLengthCheckMsg = dataList[i].ntwkLineNo + "<br>" + "안테나Size(상위국) 항목은 30자까지 입력가능합니다."; 	
			}
			
			if( dataList[i].lowMtsoAtnSz !="" && dataList[i].lowMtsoAtnSz != null && dataList[i].lowMtsoAtnSz != undefined && dataList[i].lowMtsoAtnSz.length > 30  ) { // 하위국안테나사이즈 길이 체크
				var lowMtsoAtnSzLengthCheck = true;
		    	var lowMtsoAtnSzLengthCheckMsg = dataList[i].ntwkLineNo + "<br>" + "안테나Size(하위국) 항목은 30자까지 입력가능합니다."; 	
			}
			
			if(dataList[i].ringMgmtObjYn == "N") {
				if( dataList[i].ringMgmtWoRsn =="" || dataList[i].ringMgmtWoRsn == null || dataList[i].ringMgmtWoRsn == undefined ) { // 링생성대상이 제외대상인경우 제외사유를 필수로 입력 해줘야한다. 2018-07-10 P.098783
					mgmtObjCheck = true;
					mgmtObjCheckMsg = dataList[i].ntwkLineNo + "<br>" + "링생성대상이 제외대상인경우" +  "<br>" + "제외사유를 반드시 입력해야합니다."; 	/* 제외대상인경우 제외사유를 반드시 입력해야합니다.*/
					validate = false;
				}
			}
			
			if( dataList[i].ringMgmtWoRsn !="" && dataList[i].ringMgmtWoRsn != null && dataList[i].ringMgmtWoRsn != undefined && dataList[i].ringMgmtWoRsn.length > 40  ) { // 제외사유 길이 체크
		    	//console.log(dataList[i].ringMgmtWoRsn.length);
				var ringMgmtWoRsnLengthCheck = true;
		    	var ringMgmtWoRsnLengthCheckMsg = dataList[i].ntwkLineNo + "<br>" + "제외사유항목은 40자까지 입력가능합니다."; 	
			}    		
			
    		/*
    		// 20181217 네트워크회선상태 해지요청중 체크
    		if ( nullToEmpty( dataList[i].ntwkStatCd) != "" ) {
    			// original data 비교
    			if ( dataList[i].topoSclCd == "033" || dataList[i].topoSclCd == "035" || || dataList[i].topoSclCd == "036" ) {
    				ntwkStatCdCheck = true;
    				ntwkStatCdCheckMsg = dataList[i].ntwkLineNo + "<br>해지요청중은 청약을 통해서 신청해야합니다.";
    				validate = false;
    				//alertBox('W', "해지요청중은 청약을 통해서 신청해야합니다.");
    			}
    			else {
    				ntwkStatCdCheck = true;
    				ntwkStatCdCheckMsg = dataList[i].ntwkLineNo + "<br>해지요청중은 5G-PON링, SMUX링만 청약을 통해 신청 가능합니다.";
    				validate = false;
    				//alertBox('W', "해지요청중은 5G-PON링, SMUX링만 청약을 통해 신청 가능합니다.");
    			}
    		}
    		*/
    		
    		if(!validate){
    			if(isRepNtwkLineNo){
    				alertBox('W', makeArgMsg('validationId',"","","","") + "<br>" + msgStr); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
					$('#'+gridWorkId).alopexGrid("startEdit");
					return validate;
    			} else {
    				// 2019.06.04 휘더망링은 필수가 아니기 때문에 휘더망링을 제외한 항목에 대해서만 필수메세지를 보여야함
    				// 그러나 필수항목을 다 입력했는데도 (saveVal="" 인 상태) 필수입력메세지를 보여주고 있음. saveVal가 "" 인 상태에는 모두 입력한 상태이므로 표시하지 않게..
    				if(saveVal != "" && saveVal != cflineMsgArray['feederLinkRing']){
    					alertBox('W', makeArgMsg('required',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}] */
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(checkNtwkTypDataSkt){
    					alertBox('W', makeArgMsg('required',msgStr,"","",""));
    					$('#'+gridWorkId).alopexGrid("startEdit");
    				}else if(wdmRingCheck){
    					alertBox('I', wdmRingCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(gisCheck){
    					alertBox('I', gisCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(mgmtObjCheck){
    					alertBox('I', mgmtObjCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(atnrValLengthCheck){
    					alertBox('I', atnrValLengthCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(sctnDistKLengthCheck){
    					alertBox('I', sctnDistKLengthCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}
//    				else if(chnlCntLengthCheck){
//    					alertBox('I', chnlCntLengthCheckMsg);
//    					$('#'+gridWorkId).alopexGrid("startEdit");
//    					return validate;
//    				}
    				else if(uprMtsoAtnSzLengthCheck){
    					alertBox('I', uprMtsoAtnSzLengthCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(lowMtsoAtnSzLengthCheck){
    					alertBox('I', lowMtsoAtnSzLengthCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else if(ringMgmtWoRsnLengthCheck){
    					alertBox('I', ringMgmtWoRsnLengthCheckMsg);
    					$('#'+gridWorkId).alopexGrid("startEdit");
    					return validate;
    				}else{
    					validate = true;
    				}
    			}
    		}
    	}
    	return validate;
    }
    
    //
    function checkROTNRingNm(topoSclCd, ntwkLineNm){
    	//망구분(ntwkTypCd) : 001:기간망  
    	//망종류(topoSclCd) : 020:MESH, 002:PTP - 국사명에 숫자가 들어갈수 있도록 개선

		//망종류 MESH링인 경우
    	if(topoSclCd == "020"){
			
			var msgArg = "MESH링(전체링)";
			var msgArg1 = "벤더명(Z,C,H) + ROTN + 장비군(R) + 시스템번호(1,2)-전송실명(영문4자리) + 링번호(숫자3자리) ";
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
				 * Z/H/C ROTN 장비군(O)+시스템번호(1,2)-전송실명(영문4자)+링번호(숫자3)+(COT국사, RT국사, 용량) <- 국사명에 숫자포함가능하도록 개선 2022-06-13
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
			 * Z/H/C ROTN 장비군(R)+시스템번호(1,2)-전송실명(영문4자)+링번호(숫자3)+(국사A, 국사B) <- 국사의 경우 숫자및 영문입력가능하게 개선 2022-06-13
			 * /^[z|Z|h|H|c|C]ROTN[r|R][1|2]-[a-zA-Z]{1,4}[0-9]{3}[/(/]([가-힣]+[/,/]*)+[/)/]$/
			 */
	    	//var reg_ring_name = /^[z|h|c]{1}ROTN[r][1|2]-[a-zA-Z]{1,4}[0-9]{3}[/(/]([가-힣]+[/,/]*)+[/)/]$/i;
	    	var reg_ring_name = /^[z|h|c]{1}ROTN[r][1|2]-[a-zA-Z]{4}[0-9]{3}[/(/]([0-9가-힣a-zA-Z]+[/,/]*)+[/)/]$/i;
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
    	return true;
    }
    
    function setGrid(first, last, sType) {
    	var ringNameVal = $("#ntwkLineNm").val(); 
    	var ringIdVal = $("#ntwkLineNo").val(); 
    	if(ringNameVal.length >100){
    		cflineHideProgress(gridId);
    		cflineHideProgress(gridWorkId);
    		var msgArg = cflineMsgArray['ringName'];
    		var msgArg1 = 100;
    		alertBox('I', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* {0} 항목은 {1}자까지 입력가능합니다. */
    		$('#ntwkLineNm').focus();
    		return false;
    	}
    	if(ringIdVal.length >100){
    		cflineHideProgress(gridId);
    		cflineHideProgress(gridWorkId);
    		var msgArg = cflineMsgArray['ringIdentification'];
    		var msgArg1 = 100;
    		alertBox('I', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* {0} 항목은 {1}자까지 입력가능합니다. */
    		$('#ntwkLineNo').focus();
    		return false;
    	}
    	
		if( first == "1" && last =="200"){
			//초기 조회 일시 링,작업 에 각각 첫번째 마지막 페이지에 값을 넣어준다 
			$("#firstRowIndex").val( parseInt(first) );
			$("#lastRowIndex").val( parseInt(last) );
			//링 조회
			$("#firstRow01").val( parseInt(first) );
			$("#lastRow01").val( parseInt(last) );
			//작업조회 
			$("#firstRow02").val( parseInt(first) );
			$("#lastRow02").val( parseInt(last) );
		}else{

			 if (sType == "All"){
					$("#firstRowIndex").val( parseInt($("#firstRowIndex").val())  + parseInt(first)  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRowIndex").val())  + parseInt(last)  ) ;	
			 }else if (sType == "RingInfo"){
		        	
					$("#firstRow01").val( parseInt($("#firstRow01").val())  + parseInt(first)  ) ;
					$("#lastRow01").val( parseInt($("#lastRow01").val())  + parseInt(last)  ) ;	
					
					if(  parseInt($("#lastRow01").val()) >  parseInt(totalInfoCnt) ){
						$("#lastRow01").val( parseInt(totalInfoCnt) );
					}
					
					$("#firstRowIndex").val( parseInt($("#firstRow01").val()) ) ;
					$("#lastRowIndex").val( parseInt($("#lastRow01").val())  ) ;						
				 				 
			 }else if (sType == "WorkInfo"){
		        	
				    $("#firstRow02").val( parseInt($("#firstRow02").val())  + parseInt(first)  ) ;
					$("#lastRow02").val( parseInt($("#lastRow02").val())  + parseInt(last)  ) ;	
					
					if( parseInt($("#lastRow02").val()) > parseInt(totalWorkCnt) ){
						$("#lastRow02").val(parseInt(totalWorkCnt) );
					}
					
					$("#firstRowIndex").val( parseInt($("#firstRow02").val())  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRow02").val()) ) ;						
			 }
		}			

//		var param =  $("#searchForm").serialize();	//parameter 형태로 데이터 넘어감 : query String parameter
//		var param =  $("#searchForm").getData(); // Object 형태로 데이터 넘어감 : query String parameter
		
		if($("input:checkbox[id='sAllPass']").is(":checked")) {
			$("#sAllPass").val(true);
		}else {
			$("#sAllPass").val(false);
		}
		
		if($("input:checkbox[id='searchCotRt']").is(":checked")) {
			$("#searchCotRt").val(true);
		}else {
			$("#searchCotRt").val(false);
		}
		
		$('#lftEqpNm').val($('#lftEqpNm').val().trim());
		$('#lftPortNm').val($('#lftPortNm').val().trim());
		$('#rghtEqpNm').val($('#rghtEqpNm').val().trim());
		$('#rghtPortNm').val($('#rghtPortNm').val().trim());
		
		//TODO
		if(nullToEmpty($('#mgmtOnrNm').val()) == "전체") {
			$('#mgmtOnrNm').val("");
		}
		var param =  $("#searchForm").serialize();
		if (sType == "All"){
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getSelectRingListAll', param, 'GET', 'searchAll');
		}else if (sType == "RingInfo"){
			if( parseInt($("#firstRow01").val()) < parseInt($("#lastRow01").val()) ){
				cflineShowProgress(gridId);
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getSelectRingList', param, 'GET', 'searchRingInfo');
			}

		}else if (sType == "WorkInfo"){
			if( parseInt($("#firstRow02").val()) < parseInt($("#lastRow02").val()) ){
				cflineShowProgress(gridWorkId);
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getSelectRingWorkList', param, 'GET', 'searchWorkInfo');
			}

		}
    }
    

    // FDF사용정보 전송(서비스회선/링편집시만 호출됨)
   function sendFdfUseInfo(flag ) {
	   	
	   sendFdfUseInfoCommon(fdfUsingInoLineNo, "R", "B", null);
	   	
   }
   
});

function onloadMgmtGrpChange(){
	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
}

function searchBtnStyle(celStr, inputId, btnId, textWidth) {
	var str = '<label class="textsearch_1">';
	str += '<input id="'+ inputId +'" name="'+ inputId +'" type="text" value="'+celStr+'"  class="alopexgrid-default-renderer" style="width:'+textWidth+';">';
	str += '<span style="float:right"><button class="grid_search_icon Valign-md" id="'+btnId+'" type="button"></button></span></label>';
	return str;
}

//수용목록
function fnAcceptNtwkList(selectData){
	var chkNtwkLine = [];
	chkNtwkLine.push(selectData.ntwkLineNo);
	var param = {
					"ntwkLineNoList":chkNtwkLine
				  , "topoLclCd":selectData.topoLclCd
				  , "topoSclCd":selectData.topoSclCd 
				  , "title" : cflineMsgArray['acceptLine']+cflineMsgArray['list']
				  , "callType":"S"   // S : 수용목록 조회
	            };
	$a.popup({
			popid: "UsingInfoPop",
			title: cflineMsgArray['acceptLine']+cflineMsgArray['list']  /*수용회선목록*/,
			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
			data: param,
			iframe: true,
			modal: true,
			movable:true,
		    windowpopup : true,
			width : 1200,
			height : 650,
			callback:function(data){
		    	//fnSearch("A", true);
		    }
		});
}

//승인버튼 활성화 : 회선상태가 해지요청중이면 승인버튼 활성화
function setApprovalBtn(param) {
	//회선상태 : 해지요청중 / 망종류 : 5G-PON, SMUX
	// 건수만큼 체크 필요
   var chkStat = true;
   for (var i = 0; i < param.length; i++) {
	   if( param[i].topoSclCd != "033" && param[i].topoSclCd != "035" && param[i].topoSclCd != "036" && param[i].topoSclCd != "042") {
		   chkStat = false;
		   break;
	   } else if (param[i].ntwkStatCd != "04") {
		   chkStat = false;
		   break;
	   }
   }
	if( chkStat == true ) {
		$('#btnApproval').setEnabled(true);
		$('#btnDelWorkInfo').setEnabled(false);
	}
	else {
		$('#btnApproval').setEnabled(false);
		$('#btnDelWorkInfo').setEnabled(true);
	}
}

function setChnlCnt(chnlCnt) {
	var focusData = $('#dataGridWork').alopexGrid("dataGet", {_state : {focused : true}});
	var rowIndex = focusData[0]._index.data;
	
	$('#dataGridWork').alopexGrid( "cellEdit", chnlCnt, {_index : { row : rowIndex}}, "chnlCnt");

}
