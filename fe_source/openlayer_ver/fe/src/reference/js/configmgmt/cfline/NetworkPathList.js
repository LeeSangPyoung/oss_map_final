/**
 * NetworkPathList.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 * 
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-04-26  2. [수정]가입자망인 경우 선번그룹번호 전송
 * 2018-09-12  3. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-01-15  4. 5G-PON고도화  5G-PON RU에 주선번이 있는 경우 주선번의 사용링의 역방향으로 예비회선 자동선번생성 처리해주기 위해 예비선번은 편집불가 처리함. 주선번 전체삭제되는 경우 예비선번 전체 삭제처리함
 * 2019-09-30  5. 기간망 링 선번 고도화 : openUseRingRontTrunkSearchPop로 링/기간망 트렁크 조회하여 링에서 경유링을 설정 할 수 있게 처리함
 * 2020-01-06  8. PBOX 코드(182)  추가 
 * 2020-04-16  9. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 * 2020-05-15 10. SMUX링 경유링 사용
 *                경유링은 1차 까지만 참조가능
 *                경유링으로 사용가능한 종류 : SMUX링 
 * 2020-08-03 11. 선로검색버튼(btnEqpNodeInfo) 신규추가
 *                SKT회선 및 링관리에서만 가능
 *                검색된 FDF선로를 선번에 이동시 ETE성공여부에 따라 자동 ETE연결
 * 2020-08-03 11. 가입자망링 경유링 사용 
 *                경유링은 1차 까지만 참조가능
 *                경유링으로 사용가능한 종류 : BC-MUX링, CWDM-MUX링 
 *                
 * 2020-08-20 12. 가입자망회선의 링조회 팝업 연결시 FDF선번정보를 통해 FDF장비 자동셋팅
 * 2021-01-13 13. FDF실장정보확인 팝업추가 openFdfCardInfoPop     
 *                FDF장비를 선택시 서브메뉴에 FDF실장정보확인메뉴 표시   
 * 2021-03-08 14. 상위OLT장비등록 버튼 추가 - btnOltEqpReg
 *                1건인 경우 그대로 셋팅, 다건인 경우 팝업Open (openOltEpqListPop)  
 * 2021-05-13 15. useRingPopChk
 *                SKB의 경유링 추가시 일반경유링, 전송망링추가 선택할수 있는 팝업  (openUseBtbEqpRingPop) 
 *                (FDF장비에서 검색하는 경우 FDF장비의 국사에 속하는 FDF장비를 제외한 장비가 속한 모든 링(가입자망제외) 을 검색해서 보여준다
 * 2021-06-09 16. openNetworkPathPop
 * 				  서비스회선중 기지국회선에서 트렁크의 선번정보를 변경하는 경우 정,역방향으로 변경해도 이전에 등록한 채널값이 유지되도록 개선
 * 2021-10-13 17. ROTN장비의 경우에도 FDF단자반과 마찬가지로 포트를 2개 선택가능하도록 개선 
 * 2023-04-10 18. [수정]가입자망인 경우 선번그룹번호 전송 -> 주석처리되어 전송되지 않고있던 그룹번호 주석 해재     
 * 2023-05-24 19. [기능추가] SKB CATV링의 예비선번구현
 * 2024-05-10 20. [수정] 신규추가한 선로검색버튼(btnEqpNodeInfo) 버튼이 장비개통시 회선/링 편집시 활성화되지 않았던 문제 개선
 * 2024-09-11 21. [수정] ADAMS관련 편집불가였던 내용에 대해 원복 - 모든링에 대해 관리주체제한없이 편집가능   
 * 2024-10-30 22. [기능추가] RU광코어회선이고, 가장마지막 EAST장비에 DU-L장비가 등록되어있지 않는 경우 선번편집에서 저장이 되지 않도록 추가 (checkDuLEqpLow) 
 */
 

/*
 * 저장작업과 관련하여 여러 체크가 존재해 해당 메소드명 정리함
 * 1) 저장버튼/그리드내 저장메뉴 : preSavePath()
 * 2) preSavePath() - 주/예비선번의 경우: 장비 및 국사 상관관계 체크- saveReserveLinks() 
 *                  - 주선번만인 경우   : 장비 및 국사 상관관계 체크- preSavePath()내에서 처리
 * 3) saveReserveLinks() / preSavePath  : 장비 룰 체크 호출(checkEqpRullBfSave()) 에서  api 콜 후 flag=saveBeforeCheckEqpMdlPortRule
 * 4) 장비 룰 ok(saveBeforeCheckEqpMdlPortRule) : RU회선의 경우 사용서비스회선 체크가 필요한 경우가 있어 추가로 chkUseLineBfSave() 체크로직 추가
 *                                                링이고 사용링 처리가 가능한 경우 해당 링의 재귀사용을 막기위해 chkUseLineBfSave() 를 수정하여 
 *                                                RU회선의 사용서비스회선 체크와 링의 사용링체크를 분기처리함
 * 5) chkUseLineBfSave() - RU회선_광코어/링_사용링 가능링 이외 - > savePath()
 *                       - RU회선_광코어/링_사용링 가능링 인경우 : 사용서비스회선 체크(checkUseServiceLine()) - > ok인 경우 savePath()
 * 6) savePath() : 저장 api 콜       
 * 7) openFdfListPop() : 선번버튼 클릭시 호출          
 *       
 */

/*
 * 경유링 관련하여 수정 가능한지 체크하는 메소드 관련하여
 * checkUseRingNtwk() 관련 파라메터 수정이 있는경우 makeParamToCheckUseRing 호출하는 부분은 모두 확인 필요함
 */
 
/**
 * 선번창 기본 그리드
 */
var detailGridId = "pathList";

/**
 * 예비 선번 그리드
 */
var reserveGrid = "reservePathList";

/**
 * 기본정보 excel생성을 위한 그리드
 */
var baseGridId = "pathBaseInfo";

/**
 * wdm, 링, 트렁크, 서비스회선 정보 tab / 작업정보 tab 체크 
 */
var openGridId = "";

/**
 * 선번창 오픈 시 네트워크 번호
 */
var baseNtwkLineNo = "";

/**
 * 사용네트워크 번호
 */
var ntwkLineNo = "";

/**
 * west상하위
 */
var westNodeRole = [];

/**
 * east상하위
 */
var eastNodeRole = [];

/**
 * west사용용도
 */
var westPortUseType = [];

/**
 * east사용용도
 */
var eastPortUseType = [];

/**
 * 장비, 포트 검색시 return data
 */
var dataArray = [];

/**
 * 서비스회선에서 넘겨주는 선번ID
 */
var ntwkLnoGrpSrno = "";

/**
 * 주 선번 여러개 생성시 이전 주선번 ID
 */
var prevNtwkLnoGrpSrno = ""; 

/**
 * 선번에서 조회해온 SAME_NO
 */
var pathSameNo = "";

/**
 * 예비선번 SAME_NO
 */
var reservePathSameNo = "";

/**
 * 미처리관리번호
 */
var utrdMgmtNo = "";

/**
 * 삭제할 구간 카운트
 */
var dataDeleteCount = 0;

/**
 * 대분류코드
 */
var searchTopoLclCd = "";

/**
 * 소분류코드
 */
var searchTopoSclCd = "";

/**
 * 링크여부
 */
var isLink = false;

/**
 * 파라미터
 */
var params = "";

/**
 * 파라미터
 */
var saveParams = "";

/**
 * 그리드 클릭시 이벤트 저장
 */
var event = "";

/**
 * 그리드에서 숨길 컬럼
 */
var hideCol = [];

/**
 * 	선번 룰
 */
var eqpMdlPortRule = [];
var eqpMdlPortRuleYn = true;

/**
 * 채널 ID 목록
 */
var channelIds = [];

/**
 * 주선번 상위 EAST, 하위 WEST 체크
 */
var rtnNeFlag = true;

/**
 * 예비 선번 상위 EAST, 하위 WEST 체크
 */
var reserveRtnNeFlag = true;

/**
 * 주선번 저장 체크
 */
var wkSprDivFlag = false;

/**
 * 주예비 여부
 */
var wkSprYn = false; 

/**
 * 링일 경우 첫구간의 west와 마지막의 east 장비 체크 
 */
var ringSctnSaveYn = false;

var initParam = null;

/* 2018-04-26  2. [수정]가입자망인 경우 선번그룹번호 전송 */
var fdfSendLnoGrpSrno = "";  /* 가입자망 저장시 사용된 선번그룹번호*/

/* 
 * 2018-09-12  3. RU고도화
 * 
 * modifyMainPath == true  (주선번만 체크함)
 *  1. 사용네트워크의 변경이 있어 사용네트워크 정보가 변경된경우 (response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH 값 )
 *  2. 사용자가 선번 정보를 변경한 경우(사용 서비스회선/트렁크/링/wdm트렁크 설정/재설정,  장비/포트/채널/COT 설정, 구간 잘라내기, 구간 삽입, 구간 뒤집기, 선번 삭제)
 *  3. 주/예비 선번을 교환한 경우 (주/예비 선번 교체클릭)
 *  
 *  위의 경우처럼 주선번이 변경이 발생한 경우 자동수정 대상을 추출하는 작업 진행을 위해 extractAcceptNtwkLine 을 호출시
 *  editType : 편집타입(E : 주선번편집, C : 해지, RS : 주선번변경없이 재저장) 의 타입을 E로 설정한다.
 *  
 *  만약 주선번의 변경 작업이 없는경우 editType : RS 로 설정하여 자동수정대상을 추출하지 않도록 처리함.
 *  
 *  그렇기 때문에 주선번의 변집 작업이 있는 경우 꼭 modifyMainPath 를 true로 설정해 주어야 함
 *  
 *  modifyMainPath 체크 대상 : setEqpData(), setPathNetwork(), 컨텍스트 메뉴(setChangedMainPath()호출), 
 *                             // 데이터 변경('propertychange input'), // 데이터 순서변경('rowDragDrop')
 *                             // 2. 포트, 채널 선번 룰 체크('cellValueEditing')
 *                           => setChangedMainPath(gridId)을 호출함
 *  
 *  */
var modifyMainPath = false;
var bRessmuxRing = true;
var bNotMerge = false;
var topoCfgMeansCd = "";

/* CMUX이면서 EXT이원화링인 경우 */
var cmuxExtYN = "";

/**
 * ADAMS 연동 고도화 SKB 가입자망(svlnLclCd="004"), 휘더망링, 가입자망링(topoSclCd in ("030","031")) 전체장비 조회, 
 */
var svlnLclCd = "";
var svlnLclCdNm = "";
var topoLclCd = "";
var topoSclCd = "";
var mgmtOnrNm = "";
var mgmtGrpCd = "";
//SKB CATV링의 예비선번구현을 위해 data에 ntwkTypCd 추가 2023-05-16
var ntwkTypCd = "";
/**
 * 기지국회선에서 트렁크의 방향 변경시 설정했두었던 채널을 셋팅하도록 개선
 */
var lftChannelDesc = "";
var rightChannelDesc = "";
// 자동수정화면에서 CALL한경우 callViewType : AP 로 설정함. 자동수정대상을 다시 뽑지 않기위해 common.js의 extractAcceptNtwkLine() 에 해당 파람값을 전달하여 편집없이 재저장 한 것처럼 처리함
// (editType 을 E 에서 RS로 파람을 설정하여 해당 수용네트워크가 수정된것으로만 처리하고 자동수정대상은 뽑지 않도록 처리함)

var trunkServicePortYn = "Y";
$a.page(function() {
	
	this.init = function(id, param) {
		initParam = param;
		openGridId = param.gridId;				// 데이터 그리드 OR 작업정보 그리드
		baseNtwkLineNo = param.ntwkLineNo;
		
		svlnLclCd = param.svlnLclCd;
		svlnLclCdNm = param.svlnLclCdNm;
		topoCfgMeansCd = param.topoCfgMeansCd;
		mgmtGrpCd = param.mgmtGrpCd;
		topoLclCd = param.topoLclCd;
		topoSclCd = param.topoSclCd;
		
		//ADAMS 연동 관리주체 설정 - 2020-04-09
		mgmtOnrNm = nullToEmpty(param.mgmtOnrNm);   
		
		ntwkLnoGrpSrno = nullToEmpty(param.ntwkLnoGrpSrno) == "" ? "" : param.ntwkLnoGrpSrno;
		
		if(gridDivision == "serviceLine") {
			utrdMgmtNo = nullToEmpty(param.utrdMgmtNo) == "" ? "" : param.utrdMgmtNo;
		}
		
		//SKB CATV링의 예비선번구현을 위해 data에 ntwkTypCd 추가 2023-05-16
		ntwkTypCd = nullToEmpty(param.ntwkTypCd);  
		
		params = {"ntwkLineNo" : baseNtwkLineNo, "utrdMgmtNo" : utrdMgmtNo, "exceptFdfNe" : "N"};
	
		if(ntwkLnoGrpSrno == "") {
			$.extend(params,{"wkSprDivCd": "01"});
			$.extend(params,{"autoClctYn": "N"});
		} else {
			$.extend(params,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
		}
		
		/* 예비선번 여부
		 * 2018-03-05 RU회선도 주/예비 편집하기 위해
		 * 2019-05-22 SMUX링이면서 추가한 경유링이 이원화 확장형인 경우 예비선번 편집
		 * 2023-05-16 SKB CATV링의 예비선번구현을 위해 data에 ntwkTypCd 추가
		 */ 
		//TODO
		// 네트워크
		if((typeof param.topoLclCd != "undefined" && typeof param.topoSclCd != "undefined")) {
			// wdm트렁크, ptp링
			if(   (param.topoLclCd == '003' && param.topoSclCd == '101') 
			   || (param.topoLclCd == '001' && (param.topoSclCd == '002'))
			   || (param.ntwkTypCd == '022' || param.ntwkTypCd == '023' || param.ntwkTypCd == '024' || param.ntwkTypCd == '025')  // && param.mgmtGrpCd != "0002"
			   ) {
				wkSprYn = true; 
			}
			//TODO - 여기에 MUX토폴로지 구현시 PTP이기 때문에 예비선번 미구현됨
			//SMUX링 인경우 - 토폴로지구성방식 Ring타입인경우에만 예비선번 구현
			if(param.topoSclCd == '035' && param.topoCfgMeansCd == '001') {
				wkSprYn = true; 
			}
		}
		// 서비스 회선
		else if (typeof param.svlnLclCd  != "undefined" && typeof param.svlnSclCd  != "undefined") {
			// RU회선
			if  ( param.svlnLclCd == "003" && param.svlnSclCd == "101") {
				wkSprYn = true; 
			}
		}
		
		 
		setSelectCode();
		setButtonListener();
		setEventListener();
		cflineShowProgressBody();
		
				
		$(window).resize(function() {
			if(!wkSprYn) {
				$('#'+detailGridId).alopexGrid("updateOption", { height: window.innerHeight -  316});
			}
		});
			
		// FDF재전송을 위한 버튼 표시여부
		if(nullToEmpty(param.svlnLclCd) != ""  || nullToEmpty(param.topoLclCd) == "001") {
			$("#btnResendFdfInfoPop").show();
		}

		/* FDF 정보 재전송 */
		$('#btnResendFdfInfoPop').on('click', function(e) {
			var fdfInfoType = "";  // S : 서비스회선, R : RING
			var fdfEditType = "A"; // A : 현 선번정보 (현 구간정보 모두 전송)
			if (nullToEmpty(param.svlnLclCd) != "") {
				fdfInfoType = "S";
			} else if (nullToEmpty(param.topoLclCd) == "001") {
				fdfInfoType = "R";				
			}
			
			if (fdfInfoType == "") return;
			
			var fdfParam = {
					 lineNoStr : baseNtwkLineNo
				   , fdfEditLneType : fdfInfoType
				   , fdfEditType : fdfEditType  // A : 현 선번정보와 바로 이전 이력정보를 모두 보냄
			}

			/* 2. [수정]가입자망인 경우 선번그룹번호 전송*/
			if (typeof param.topoLclCd != "undefined" && typeof param.topoSclCd != "undefined" && param.topoLclCd == '001' && param.topoSclCd == '031') {
				// 가입자망의 경우 선택한 선번그룹번호의 현 선번정보와 선번그룹번호의 바로 이전 이력정보를 모두 보냄
				fdfParam.lineGrpSrno = nullToEmpty($("#ntwkLnoGroSrno").val());  
			}
			
			callMsgBox('','C', cflineMsgArray['transmission'], function(msgId, msgRst){   /*전송하시겠습니까?*/
	        	if (msgRst == 'Y') {
					//console.log(fdfParam);
					cflineShowProgressBody();
					Tango.ajax({
						url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', 
						data : fdfParam, //data가 존재할 경우 주입
						method : 'GET', //HTTP Method
						flag : 'sendfdfuseinfo'
					}).done(function(response){
								cflineHideProgressBody();
								alertBox('I', cflineMsgArray['normallyProcessed']); /*"정상적으로 처리되었습니다.;*/
							})
					  .fail(function(response){
						  		cflineHideProgressBody();
						  		alertBox('I', cflineMsgArray['abnormallyProcessed']); /*"정상적으로 처리되지 않았습니다.<br>관리자에게 문의하시기 바랍니다.;*/
						  	});
	        	}
			});
    	});

	}
	
	function setSelectCode() {
		if(gridDivision == "ring") {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00030', null, 'GET', 'C00030'); // 링 상하위
		} else if(gridDivision == "serviceLine") {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00967', null, 'GET', 'C00967'); // 회선 상하위
		} else if(gridDivision == "wdm") {
			// wdm
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00542', null, 'GET', 'C00542'); // 사용용도
		} else {
			// 트렁크
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
		}
	}
    
	function setButtonListener() {
		/**
		 * 어떤 팝업인지에 따라서 display설정
		 * gridDivision : trunk -> ring, wdmtrunk
		 * gridDivision : ring -> wdmtrunk
		 * gridDivision : wdmtrunk -> wdmtrunk
		 */
		if(gridDivision == 'trunk') {
			$("#trunkDisplayCheckbox").hide();
			$("#supSubDisplayCheckbox").hide();
		} else if(gridDivision == 'ring') {
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
			$("#ringAllDisplayCheckbox").hide();
			$("#btnLnRing").show();
			$("#btnEquipmentRing").show();
			$("#btnRingblockDiagram").show();
		} else if(gridDivision == 'wdm') {
			$("#trunkDisplayCheckbox").hide();
			$("#ringAllDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
			$("#supSubDisplayCheckbox").hide();
		}
		
		$("#mtsoDisplay").setChecked(true);
		$("#trunkDisplay").setChecked(true);
		$("#wdmTrunkDisplay").setChecked(true);
		$("#supSubDisplay").setChecked(true);
//		$("#exceptFdfNe").setChecked(true);
		
		$("#wdmTrunkAllDisplay").setChecked(true);
		$("#ringAllDisplay").setChecked(true);
		
		setEditButton();
		
		/*more_condition script*/
		$('.arrow_more').click(function(){
			var $this = $(this);

			var $condition_box = $this.closest('.popup');
			var $more_condition = $condition_box.find('.path_hide');
			if($more_condition.css('display') == 'none'){
				$this.addClass('on')
				$more_condition.show();
			}else{
				$this.removeClass('on')
				$more_condition.hide();
			}

		})
		
		/* FDF 동기화 */
		// 2018-12-04 대표회선 설정 화면에서 대표회선을 기준으로 선번을 복제하는 기능을 제공하기로 함에 해당 버튼은 주석처리함
		/*$('#btnOptServiceOptlPop').on('click', function(e) {	
			openOptlShreRepSvlnPop(baseInfData.optlShreRepSvlnNo, baseInfData.svlnNo);
    	});*/
		
		/* 선번 시각화 편집 */
		$('#btnPahViaualEdit').on('click', function(e) {	
			if(typeof svlnLclCd  != "undefined" && typeof svlnSclCd  != "undefined") {
				serviceLineVisual();
			} else if(typeof topoLclCd  != "undefined" && topoLclCd == "002") {
				trunkVisual();
			} else if(typeof topoLclCd  != "undefined" && topoLclCd == "001") {
				ringVisual();
			} else if(typeof topoLclCd  != "undefined" && topoLclCd == "003" && topoSclCd == "101") {
				wdmTrunkVisual();
			}
		});
		
	}
	
	function serviceLineVisual() {
		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
 		
		var url = urlPath +'/configmgmt/cfline/ServiceLineInfoPopNew.do';
		var width = 1400;
		var height = 940;
		
		var rnmEqpId = (typeof initParam.rnmEqpId  != "undefined") ? initParam.rnmEqpId : "";
		var rnmEqpIdNm = (typeof initParam.rnmEqpIdNm  != "undefined") ? initParam.rnmEqpIdNm : "";
		var rnmPortId = (typeof initParam.rnmPortId  != "undefined") ? initParam.rnmPortId : "";
		var rnmPortIdNm = (typeof initParam.rnmPortIdNm  != "undefined") ? initParam.rnmPortIdNm : "";
		var rnmPortChnlVal = (typeof initParam.rnmPortChnlVal  != "undefined") ? initParam.rnmPortChnlVal : "";
		var mgmtOnrNm = (typeof initParam.mgmtOnrNm  != "undefined") ? initParam.mgmtOnrNm : "";
		
		$a.popup({
			popid: "ServiceLineInfoPopNew",
			title: '서비스회선 시각화',
			url: url,
			data: {"gridId":openGridId,"ntwkLineNo":baseNtwkLineNo,"svlnLclCd":svlnLclCd,"svlnSclCd":svlnSclCd,"sFlag":"Y", "ntwkLnoGrpSrno": ntwkLnoGrpSrno, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())
				, "rnmEqpId" : rnmEqpId, "rnmEqpIdNm" : rnmEqpIdNm, "rnmPortId" : rnmPortId, "rnmPortIdNm" : rnmPortIdNm, "rnmPortChnlVal" : rnmPortChnlVal
				, "callViewType" : nullToEmpty(initParam.callViewType)
				, "autoClctYn" : autoClctYn    /* 20191023 추가 */
				, "mgmtOnrNm" : mgmtOnrNm   /* 20020414 ADAMS 추가 */
				}
		   ,iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
	}
	
	function trunkVisual() {
		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
 		
		var url = urlPath +'/configmgmt/cfline/TrunkInfoPopNew.do';
		var width = 1400;
		var height = 940;
		
		$a.popup({
			popid: "TrunkInfoPopNew",
			title: '트렁크 시각화',
			url: url,
			data: {"gridId":openGridId,"ntwkLineNo":baseNtwkLineNo,"topoLclCd":topoLclCd,"topoSclCd":topoSclCd,"sFlag":"Y", "ntwkLnoGrpSrno": ntwkLnoGrpSrno, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())
				   , "callViewType" : nullToEmpty(initParam.callViewType)
				  }
		   ,iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
	}
	
	function ringVisual() {
		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
		var url = urlPath +'/configmgmt/cfline/RingInfoPopNew.do';
		var width = 1400;
		var height = 940;
		
		$a.popup({
			popid: "RingInfoPopNew",
			title: '링 시각화',
			url: url,
			data: {"gridId":openGridId,"ntwkLineNo":baseNtwkLineNo,"topoLclCd":topoLclCd,"topoSclCd":topoSclCd,"sFlag":"Y"
				   , "ntwkLnoGrpSrno": ntwkLnoGrpSrno, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val()), "mgmtOnrNm" : mgmtOnrNm
				   , "callViewType" : nullToEmpty(initParam.callViewType), "topologyType" : topoCfgMeansCd, "ntwkTypCd" : ntwkTypCd
			      }
			,iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
	}
	
	function wdmTrunkVisual() {
		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
 		
		//var url = urlPath +'/configmgmt/cfline/WdmTrunkInfoPopNew.do';
 		var url = urlPath +'/configmgmt/cfline/WdmTrunkDetailPop.do';
		var width = 1600;
		var height = 940;
		
		$a.popup({
			popid: "WdmTrunkDetailPop",
			title: 'WDM 트렁크 상세',
			url: url,
			data: {"gridId":openGridId,"ntwkLineNo":baseNtwkLineNo,"topoLclCd":topoLclCd,"topoSclCd":topoSclCd,"sFlag":"Y", "ntwkLnoGrpSrno": ntwkLnoGrpSrno, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())
				   , "callViewType" : nullToEmpty(initParam.callViewType)
		          }
		   ,iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
	}
	
	function setEventListener() {
		
		// 링 전체보기. 기본적으로 ADD-DROP구간만 표시하는데 전체보기를 클릭하면 전체구간을 표시한다.
		$('#ringAllDisplay').on('click', function(e){
			
		});
		
		// WDM트렁크 전체보기. 기본적으로 맨위,아래 구간만 표시하는데 전체보기를 클릭하면 전체구간을 표시한다.
		$('#wdmTrunkAllDisplay').on('click', function(e){
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
			for(var i = 0; i < dataList.length; i++) {
//				console.log(dataList[i].LINK_VISIBLE);
			}
		});
		
		// FDF 구간 제외
		$('#exceptFdfNe').on('click', function(e){
			
			if($('#exceptFdfNe').is(':checked')) {
				$.extend(params,{"exceptFdfNe": "Y"});
				if(typeof svlnLclCd != "undefined" && svlnLclCd != null && svlnLclCd == "001") {
					$.extend(params,{"topoLclCd": svlnLclCd});
					$.extend(params,{"topoLclNm": svlnLclCdNm});
				}
			} else {
				$.extend(params,{"exceptFdfNe": "N"});
			}
			
			cflineShowProgressBody();

			if((typeof topoLclCd != "undefined" && topoLclCd != null) && (typeof topoSclCd != "undefined" && topoSclCd != "")) {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
			} else {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
			}
	    });
		
		// 상하위 표시
		$('#supSubDisplay').on('click', function(e){
			if(!$('#supSubDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', ['LEFT_NODE_ROLE_CD', 'LEFT_NODE_ROLE_NM', 'RIGHT_NODE_ROLE_CD', 'RIGHT_NODE_ROLE_NM']);
			} else {
				$('#'+detailGridId).alopexGrid('showCol', ['LEFT_NODE_ROLE_CD', 'LEFT_NODE_ROLE_NM', 'RIGHT_NODE_ROLE_CD', 'RIGHT_NODE_ROLE_NM']);
			}
			
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
			
			// 예비선번일 경우 예비선번 그리드
			if( wkSprYn ) {
				if(!$('#supSubDisplay').is(':checked')) {
					$('#'+reserveGrid).alopexGrid('hideCol', ['LEFT_NODE_ROLE_CD', 'LEFT_NODE_ROLE_NM', 'RIGHT_NODE_ROLE_CD', 'RIGHT_NODE_ROLE_NM']);
				} else {
					$('#'+reserveGrid).alopexGrid('showCol', ['LEFT_NODE_ROLE_CD', 'LEFT_NODE_ROLE_NM', 'RIGHT_NODE_ROLE_CD', 'RIGHT_NODE_ROLE_NM']);
				}
				
				$('#'+reserveGrid).alopexGrid("updateOption", { fitTableWidth: true });

			}
	    });
		
		// 국사 표시
		$('#mtsoDisplay').on('click', function(e){
			if(!$('#mtsoDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', [leftOrgNm, rightOrgNm]);
			} else {
				$('#'+detailGridId).alopexGrid('showCol', [leftOrgNm, rightOrgNm]);
			}
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
			
			// 예비선번일 경우 예비선번 그리드
			if( wkSprYn ) {
				if(!$('#mtsoDisplay').is(':checked')) {
					$('#'+reserveGrid).alopexGrid('hideCol', [leftOrgNm, rightOrgNm]);
				} else {
					$('#'+reserveGrid).alopexGrid('showCol', [leftOrgNm, rightOrgNm]);
				}
				$('#'+reserveGrid).alopexGrid("updateOption", { fitTableWidth: true });
			}
	    });
		
		
		// WEST 채널 표시
		$('#westChannelDisplay').on('click', function(e){
			if(!$('#westChannelDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', ['LEFT_CHANNEL_DESCR']);
			} else {
				$('#'+detailGridId).alopexGrid('showCol', ['LEFT_CHANNEL_DESCR']);
			}
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
	    });
		
		// EAST 채널 표시
		$('#eastChannelDisplay').on('click', function(e){
			if(!$('#eastChannelDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', ['RIGHT_CHANNEL_DESCR']);
			} else {
				$('#'+detailGridId).alopexGrid('showCol', ['RIGHT_CHANNEL_DESCR']);
			}
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
	    });
		
		// 트렁크 표시.
		$('#trunkDisplay').on('click', function(e){
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
			if(!$('#trunkDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', 'TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					if(dataList[i].TRUNK_ID != null) {
						if(dataList[i].TRUNK_ID.indexOf("alopex") == 0) {
							dataList[i].LINK_VISIBLE = true;
						} else {
							dataList[i].LINK_VISIBLE = false;
						}
					} else if(dataList[i].WDM_TRUNK_ID != null) {
						// WDM 트렁크는 현재의 VISIBLE 유지
						
					} else {
						dataList[i].LINK_VISIBLE = true;
					}
				}
			} else {
				$('#'+detailGridId).alopexGrid('showCol', 'TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					if(dataList[i].WDM_TRUNK_ID != null) {
						// WDM 트렁크는 현재의 VISIBLE 유지
					} else {
						dataList[i].LINK_VISIBLE = true;
					}
				}
			}
			
//			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			$("#"+detailGridId).alopexGrid("startEdit");
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
		});
		
		// WDM트렁크 표시
		$('#wdmTrunkDisplay').on('click', function(e){
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
			if(!$('#wdmTrunkDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', 'WDM_TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					if(dataList[i].WDM_TRUNK_ID != null ) {
						if(dataList[i].WDM_TRUNK_ID.indexOf("alopex") == 0) {
							dataList[i].LINK_VISIBLE = true;
						} else {
							dataList[i].LINK_VISIBLE = false;
						}
					}  
				}
			} else {
				$('#'+detailGridId).alopexGrid('showCol', 'WDM_TRUNK_NM');
				var wdmTrunkId = "";
				var wdmDataList = "";
				var wdmCnt = 0;
				
				for(var i = 0; i < dataList.length; i++) {
					if(dataList[i].WDM_TRUNK_ID != null ) {
						if(dataList[i].WDM_TRUNK_ID.indexOf("alopex") == 0) {
							// 저장이 안된 WDM트렁크
							dataList[i].LINK_VISIBLE = true;
						} else {
							// 저장이 되어 있던 WDM트렁크
							if(wdmTrunkId == "") {
								wdmTrunkId = dataList[i].WDM_TRUNK_ID;
								dataList[i].LINK_VISIBLE = true;
								wdmCnt++;
							} else if(wdmTrunkId == dataList[i].WDM_TRUNK_ID) {
								wdmCnt++;
								wdmDataList = $('#'+detailGridId).alopexGrid("dataGet", {"WDM_TRUNK_ID":dataList[i].WDM_TRUNK_ID}, "WDM_TRUNK_ID");
								if(wdmCnt == wdmDataList.length) {
									dataList[i].LINK_VISIBLE = true;
									wdmTrunkId = "";
									wdmCnt = 0;
								}
							}  
						}
					}
				}
			}
			
//			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			$("#"+detailGridId).alopexGrid("startEdit");
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
		});


		// 선로링, 장비링
		$('#btnLnRing, #btnEquipmentRing').on('click', function(e){
			var title = "";
			var ringMgmtDivCd = "";
			if(this.id == 'btnLnRing') {
				// 선로링
				ringMgmtDivCd = "2";
				title = cflineMsgArray['lnRing'];
			} else {
				// 장비링
				ringMgmtDivCd = "3";
				title = cflineMsgArray['equipmentRing'];
			}
			
			var urlPath = $('#ctx').val();
	 		if(nullToEmpty(urlPath) == ""){
	 			urlPath = "/tango-transmission-web";
	 		}
			var paramData = {"ntwkLineNo" : baseNtwkLineNo, "ringMgmtDivCd" : ringMgmtDivCd, "title" : title, "mgmtGrpCd" : $("#mgmtGrpCd").val()};
			
			$a.popup({
			  	popid: "ringMgmtDivPathListPop" + title,
			  	title: title,
			  	url: urlPath +'/configmgmt/cfline/RingMgmtDivPathListPop.do',
			  	data: paramData,
			  	iframe:true,
				modal: false,
				movable:true,
				windowpopup : true,
				width : 1100,
			    height : 630,
				callback:function(data){
					if(data != null && data.length > 0){
					}
				}
			}); 
		});
		 
		//링구성도버튼 메뉴
		$('#btnRingblockDiagram').on('click', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			
			var urlPath = $('#ctx').val();
	 		if(nullToEmpty(urlPath) ==""){
	 			urlPath = "/tango-transmission-web";
	 		}
	 		
	 		var ntwkLnoGrpSrno = "";
	 		if(pathSameNo != "") {
	 			ntwkLnoGrpSrno = pathSameNo;
			} else {
				ntwkLnoGrpSrno = $('#ntwkLnoGroSrno').val();
			}
	 		
			$a.popup({
		   		popid: "selectAddDrop",
				title: cflineMsgArray['ringBlockDiagram'] /*링 구성도*/,
				url: urlPath +'/configmgmt/cfline/RingDiagramPop.do',
				data: {"ntwkLineNo" : baseNtwkLineNo, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno},
				iframe: true,
				modal: false,
				movable:true,
				windowpopup : true,
				width : 1400,
				height : 900
			});
		});
		
    	$('#btnClose').on('click', function(e){
    		$a.close();
	    });
    	 
    	
    	$('#btnRegEqp').on('click', function(e){
    		var btnShowArray = ['btnSave', 'btnPathDelete', 'btnModificationDetailsDisplay', 'btnEqpNodeInfo', 'btnOltEqpReg']; // '', 'btnReservePath', 'ringCoupler'
    		var btnHideArray = ['btnRegEqp'];
    		addRow(btnShowArray, btnHideArray);
    		gridHidColSet();
    		
    		if(gridDivision != 'serviceLine' && nullToEmpty(topoLclCd) == '001' && nullToEmpty(topoSclCd) == '031') {
				// 가입자망링
				$("#btnLineInsert").show();
			}
    		
    		//선로검색 버튼은 회선, 링, 트렁크, SKT 외의 경우 숨김 수정
    		if(gridDivision != 'serviceLine' && (nullToEmpty(topoLclCd) != '001' && nullToEmpty(topoLclCd) != '002')
    				|| nullToEmpty(mgmtGrpCd) != '0001') {
				// 장비선로버튼
				$("#btnEqpNodeInfo").hide();
			}
    		
    		
    		//상위OLT장비등록 버튼은 SKB그룹의 가입자망링 외의 경우 숨김
    		if(gridDivision != 'ring' && (nullToEmpty(topoLclCd) != '001' && nullToEmpty(topoSclCd) != '031')
    				|| nullToEmpty(mgmtGrpCd) != '0002') {
    			// 상위OLT장비등록버튼
    			$("#btnOltEqpReg").hide();
    		} else {
    			// 상위OLT장비등록버튼
    			$("#btnOltEqpReg").show();
    		}
    		
    		//수집선번비교 버튼 활성화 로직임. 차후에 주석풀것...
    		//수집선번비교 버튼
    		cmsCompareBtnVisible();
    		
    		// 수집선번 버튼
    		autoClctPathBtnVisible();
    		
    		// FDF 구간 제외 숨기기
    		$("#exceptFdfNeDisplayCheckbox").hide();
    		
    		// 체크박스 유지
    		setCheckboxByGrid();
    		if(gridDivision == 'serviceLine') mtsoInfoByPathList({"svlnNo" : baseNtwkLineNo, "sFlag" : "Y"}, 'Y');
    		else tmofInfoPop({"ntwkLineNo" : baseNtwkLineNo, "sFlag" : "Y"}, 'Y');
    		
    		// FDF 구간 제외를 체크 풀고 데이터 조회 
    		$.extend(params,{"exceptFdfNe": "N"});
    		cflineShowProgressBody();
    		
			if(typeof topoLclCd != "undefined"  && typeof topoSclCd != "undefined" ) {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchAfter');
			} else {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearchAfter');
			}


//    		if(gridDivision == 'wdm') {
			if(wkSprYn) {
    			// WDM트렁크, PTP링 예비 선번
//    			$("#btnReservePathChange").show();
    			if(gridDivision == 'wdm') {
    				$("#btnPathCopy").show();
    			}
    			if (isFiveGponRuCoreOld() == true) {
    				$("#btnReservePathChange").hide();
    			}
    			btnRegEqpClick();
    		}
			if($("#mgmtGrpCd").val() == "0002" || (nullToEmpty(topoSclCd) != '030' && nullToEmpty(topoSclCd) != '031')) {
				cflineHideProgressBody();
			}
			//예비선번버튼 구현
			//SMUX링에서 사용한 경유링이 CMUX
			var mainPath = tempDataTrim(detailGridId);
			// 경유링사용한 SMUX링
			if(searchSmuxRing(mainPath) || (searchCmuxRing(mainPath) && searchExt(mainPath))) {
				$("#btnReservePath").show();
			} else {
				$("#btnReservePath").hide();
			}
    	});
    	
    	$('#btnSave').on('click', function(e){
    		
    		// 2019-12-12 링 이원화 : SMUX링의 토폴로지구성방식이 Ring인경우 링 구조에 맞는지체크 - LMUX는 우선 제외
    		if (isSmuxRingOld() && topoCfgMeansCd == "001" && bRessmuxRing == false) {

    			//TODO LMUX인 경우에는 저장이 되지 않게 함 - 20200921
    			if(searchLmuxRing(detailGridId)) {
    				alertBox('W', "LMUX의 경우 링방식으로 등록이 불가능합니다. <br>토폴로지구성방식을 'PTP'로 변경 후 선번구성을 해주세요.");
    				return;
    			}
    			
    			var bres = true;
    			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
    			//CMUX장비링 인 경우 - 2020-06-01
    			if(searchCmuxRing(dataList)) {
        			//이원화로 구성된 링의 확장형의 경우 - 예비선번 저장
    				if(searchExt(dataList)){
    					wkSprYn = true;
    				}
    				//예비선번이 존재하는 경우
    				var data = reserveGrid;
					var links = $('#'+data).alopexGrid('dataGet');
					if(links.length > 1) {
						wkSprYn = true;
					}
    			} else {
    				wkSprYn = false;
    			}
    			
				if(bNotMerge == false)
					bres = checkSectionMerge(detailGridId);
				if(bres == false){
					callMsgBox('','C', '병합할 구간이 있습니다. 병합하시겠습니까?', function(msgId, msgRst) {
						if (msgRst == 'Y') {
							autoMergeSection(detailGridId);							
							if(checkRingType() == true) { 
								preSavePath();  // 데이터가 없는 경우 preSavePath()에서 걸러짐
			    			}
						} else {
							bNotMerge = true;
							if(checkRingType() == true) { 
								preSavePath();  // 데이터가 없는 경우 preSavePath()에서 걸러짐
			    			}
						}
					});
				} else {
					if(checkRingType() == true) {
						preSavePath();  // 데이터가 없는 경우 preSavePath()에서 걸러짐
	    			}
				}
    		}
    		//  SMUX링이 아니거나  SMUX링이면서 토폴로지구성방식이 Ring이 아닌경우
    		else {

    			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
    			//CMUX장비링 인 경우 - 2020-06-01
    			if(searchCmuxRing(dataList)) {
        			//이원화로 구성된 링의 확장형의 경우 - 예비선번 저장
    				if(searchExt(dataList)){
    					wkSprYn = true;
    				}
    				//예비선번이 존재하는 경우
    				var data = reserveGrid;
					var links = $('#'+data).alopexGrid('dataGet');
					if(links.length > 1) {
						wkSprYn = true;
					}
    			}
    			
    			preSavePath();  // 저장전 사전체크 작업
    		}
    	});
    	// 수정 내역 표시 
    	$('#btnModificationDetailsDisplay').on('click', function(e){
    		modificationDetails();
    	});
    	
    	// 선번 삭제
    	$('#btnPathDelete, #reserveBtnPathDelete').on('click', function(e){
    		var gridId = this.id == 'btnPathDelete' ? detailGridId : reserveGrid;
    		
    		bRessmuxRing = false;
    		deletePath(gridId);
    	});
    	
    	// 선번 복사
    	$('#btnPathCopy').on('click', function(e){
    		copyPath();
    	});
    	
    	$('#btnOpenerSeach').on('click', function(e){
    		if (nullToEmpty(opener) != "" &&  $('#btnSearch' , opener.document).val() != undefined) {
    			$('#btnSearch' , opener.document).click();
    		}
    	});
    	
    	// 수집 선번
    	$('#btnAutoClctPath').on('click', function(e){
    		openAutoClctPathListPop();
    	});
    	
    	// 선번 생성 버튼 클릭
    	$('#btnLineInsert').on('click', function(e){
    		callMsgBox('','C', cflineMsgArray['saveCurrntPath'] + ' ' + cflineMsgArray['saveMsg'], function(msgId, msgRst){
        		if (msgRst == 'Y') {
        			
        			var mainPathData = savePathPrev(detailGridId);
        			var subPathData = savePathPrev(reserveGrid);
        			if(mainPathData.length < 1 && subPathData.length > 0) {
        				alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
        				addRowNullData(detailGridId);
        				addRowNullData(reserveGrid);
        				
        				$("#"+detailGridId).alopexGrid("startEdit");
        				$("#"+reserveGrid).alopexGrid("startEdit");
        				return ;
        			}
        			
        			/* 사용링 정보체크 common.js*/
        			var checkParam = {	"editRingId" : baseNtwkLineNo
        			                  , "mainPathData" : mainPathData
        			                  , "subPathData" : subPathData	
        			                  , "editPathType" : "OP"   // OP : old_path,  NP : Visualization Edit (new path)
        			                  , "lnoGrpSrno" : (isSubScriRingOld() == true ? $('#ntwkLnoGroSrno').val() : "")
        			                  };
        			//사용 링으로 사용링 사용가능여부 체크로직
        			var useRingInfoParam = makeParamToCheckUseRing(checkParam);   
        			
        			var links = savePathPrev();
        			// 사용링 정보가 없는 경우
        			if (nullToEmpty(useRingInfoParam.editRingId) == "") {
        				// 가입자망 신규선번그룹 생선전에 기존 데이터 저장
        				saveToInsertNewNtwkLnoGrpSrno(links) ;            			
        			} else {
        				cflineShowProgressBody();
            			
            			Tango.ajax({
            				url : 'tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getuseringinfo', 
            				data : useRingInfoParam, //data가 존재할 경우 주입
            				method : 'GET', //HTTP Method
            				flag : 'getuseringinfo'
            			}).done(function(response){
            						//console.log(response);
            						cflineHideProgressBody();
            						if (nullToEmpty(response.useRingInfo) != "" ) {
            							if (nullToEmpty(response.useRingInfo.result) == "Y") {
            								// 가입자망 신규선번그룹 생선전에 기존 데이터 저장
            								saveToInsertNewNtwkLnoGrpSrno(links) ;
            							} else {						
            								alertBox('W', response.useRingInfo.ngMsg);
            								if (nullToEmpty(checkParam.editPathType == "OP")) {
            									$("#"+detailGridId).alopexGrid("startEdit");
            				    				$("#"+reserveGrid).alopexGrid("startEdit");
            								}
            								return;
            							}				
            						} else {
            							alertBox('W', "사용 링 정보 조회에 실패했습니다.");
    									$("#"+detailGridId).alopexGrid("startEdit");
    				    				$("#"+reserveGrid).alopexGrid("startEdit");
            							return;
            						}
            					})
            			  .fail(function(response){
            				  		cflineHideProgressBody();
            				  		//console.log(response);
            					  	alertBox('W', "사용 링 정보 조회에 실패했습니다.");
									$("#"+detailGridId).alopexGrid("startEdit");
				    				$("#"+reserveGrid).alopexGrid("startEdit");
            						return;
            				  	});
        			}
        		}	
    		});
    	});
    	
    	// 엑셀 다운로드
    	$('#btnExportExcel').on('click', function(e){
    		var date = getCurrDate();
    		var fileName = '';
    		if(gridDivision == 'trunk') {
    			fileName = '트렁크';
    		} else if(gridDivision == 'ring') {
    			fileName = '링';
    		} else if(gridDivision == 'wdm') {
    			fileName = 'WDM 트렁크';
    		} else {
    			fileName = '서비스 회선';
    		}
    		
    		var grid = [$('#'+baseGridId), $('#'+detailGridId)];
    		if( wkSprYn ) {
    			if( $('#'+reserveGrid).alopexGrid("dataGet").length > 0 ) {
    				grid = [$('#'+baseGridId), $('#'+detailGridId), $('#'+reserveGrid)];
    			} else {
    				grid = [$('#'+baseGridId), $('#'+detailGridId)];
    			}
    		} else {
    			grid = [$('#'+baseGridId), $('#'+detailGridId)];
    		}
    		
    		var worker = new ExcelWorker({
         		excelFileName : fileName + '_선번 정보_' + date,
         		sheetList: [{
         			sheetName: fileName + '_선번 정보_' + date,
         			placement: 'vertical',
         			$grid: grid
         		}]
         	});
    		
    		worker.export({
         		merge: false,
         		exportHidden: false,
         		useGridColumnWidth : true,
         		border : true,
         		useCSSParser : true
         	});
    	});
    	
    	/**
    	 * 트렁크, 링, WDM트렁크 더블클릭 이벤트
    	 */
    	$('#'+detailGridId + ', #'+reserveGrid).on('dblclick', '.bodycell', function(e){
    		event = e;
    		var dataObj = AlopexGrid.parseEvent(e);
     	 	var schVal = dataObj.data._state.editing[(dataObj.data._column)];
     	 	var division = (gridDivision == "wdm") ? "wdm" : "";
     	 	
     	 	if(dataObj.mapping.key == "TRUNK_NM") {
    			checkPop("trunk", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.TRUNK_PATH_DIRECTION, dataObj.data);
    		} else if(dataObj.mapping.key == "RING_NM") {
    			checkPop("ring", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.RING_PATH_DIRECTION, dataObj.data, dataObj.$grid.attr("id"));
    		} else if(dataObj.mapping.key == "WDM_TRUNK_NM") {
    			checkPop("wdm", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.WDM_TRUNK_PATH_DIRECTION, dataObj.data);
    		} else if(dataObj.mapping.key == "LEFT_NE_NM") {
    			openEqpListPop(schVal, vTmofInfo, division, "LEFT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "LEFT_PORT_DESCR") {
    			if(nullToEmpty(dataObj.data.LEFT_NE_ID) == "" || dataObj.data.LEFT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['westEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
    			openPortListPop(dataObj.data.LEFT_NE_ID, dataObj.data.LEFT_PORT_ID, schVal, "LEFT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "RIGHT_NE_NM") {
    			openEqpListPop(schVal, vTmofInfo, division, "RIGHT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "RIGHT_PORT_DESCR") {
    			if(nullToEmpty(dataObj.data.RIGHT_NE_ID) == "" || dataObj.data.RIGHT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['eastEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
    			openPortListPop(dataObj.data.RIGHT_NE_ID, dataObj.data.RIGHT_PORT_ID, schVal, "RIGHT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "LEFT_CHANNEL_DESCR" || dataObj.mapping.key == "RIGHT_CHANNEL_DESCR") {
    			openCouplerPop(dataObj, null, dataObj.$grid.attr('id'));
    		} 
     	 	// 2018-09-12  3. RU고도화
    		else if(dataObj.mapping.key == "SERVICE_NM") {
    			checkPop2("serviceline", schVal, dataObj.data.SERVICE_ID, dataObj.data);
    		}
     	 	// 2019-09-30  5. 기간망 링 선번 고도화
     	 	// 2020-07-06  CMUX이원화링을 연결한 확장형 CMUX링의 경우 예비선번이 존재할수 있음 - dataObj.$grid.attr('id') 추가
    		else if (dataObj.mapping.key == "CASCADING_RING_NM") {
    			checkPop("cascadingRing", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.RING_PATH_DIRECTION, dataObj.data, dataObj.$grid.attr("id"));
    		}
     	 	// 2019-09-30  5. 기간망 링 선번 고도화
    		else if (dataObj.mapping.key == "CASCADING_RING_NM_2") { 
    			checkPop("cascadingRingL2", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID, dataObj.data.RING_ID_L2, dataObj.data.WDM_TRUNK_ID, dataObj.data.RING_PATH_DIRECTION_L2, dataObj.data);
    		}
     	 	// 2019-09-30  5. 기간망 링 선번 고도화
    		else if (dataObj.mapping.key == "CASCADING_RING_NM_3") {
    			checkPop("cascadingRingL3", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID
    					 , nvlStr(dataObj.data.RING_ID_L3, dataObj.data.RING_ID_L2), dataObj.data.WDM_TRUNK_ID
    					 , nvlStr(dataObj.data.RING_PATH_DIRECTION_L3), dataObj.data);
    		}
    	}); 
    	
    	// 데이터 변경
    	$('#'+detailGridId + ', #'+reserveGrid).on('propertychange input', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var rowIndex = dataObj._index.data;
    		var gridId = AlopexGrid.parseEvent(e).$grid.attr('id');
    		// 좌장비 변경
    		if(dataObj._key == "LEFT_NE_NM" && nullToEmpty(dataObj.LEFT_NE_ID) != ""){
    			var dataList = AlopexGrid.trimData(dataObj);
    			for(var key in dataList) {
    				if(key.indexOf("LEFT") == 0) {
    					if(key != dataObj._key) {
    						$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
    					}
    				}
    			}
    			
    			$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'TRUNK_NM');
    			$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'WDM_TRUNK_NM');
    			$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'RING_NM');
    			
    			/* 2018-09-12  3. RU고도화 */ 
		    	setChangedMainPath(gridId);
    			
    			setLinkDataNull(rowIndex, gridId);
    			 
    			// 해당 row에 남은 데이터가 하나도 없고 밑에 빈row가 있을 경우
    			if(dataObj.LEFT_NE_ID == null && dataObj.LEFT_PORT_ID == null) {
    				var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					
					if((lastData.SERVICE_ID == null && // 2018-09-12  3. RU고도화
							lastData.TRUNK_ID == null && lastData.RING_ID == null && lastData.WDM_TRUNK_ID == null)
							&& (lastData.LEFT_NE_ID == null && lastData.LEFT_NE_NM == null) 
	    					&& (lastData.RIGHT_NE_ID == null && lastData.RIGHT_NE_NM == null )) {
//							$('#'+detailGridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex-1 }});
						}
					
    			}
    		} else if(dataObj._key == "RIGHT_NE_NM" && nullToEmpty(dataObj.RIGHT_NE_ID) != ""){
    			// 우장비 변경
    			var dataList = AlopexGrid.trimData(dataObj);
				for(var key in dataList) {
					if(key.indexOf("RIGHT") == 0) {
						if(key != dataObj._key) {
							$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
						}
					}
				}
				$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'TRUNK_NM');
				$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'WDM_TRUNK_NM');
				$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'RING_NM');

				/* 2018-09-12  3. RU고도화 */ 
		    	setChangedMainPath(gridId);
    			
				setLinkDataNull(rowIndex, gridId);
    		} else if(dataObj._key == "LEFT_PORT_DESCR") {
    			// 좌포트 변경
    			var flag = "LEFT_";
				var columnList = [  
				                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
				                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
				                  ];
				
				$.each(columnList, function(key,val){
					if(dataObj._key != (flag+val)){
						$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
					}
				});	    			
    			setLinkDataNull(rowIndex);    			

    			/* 2018-09-12  3. RU고도화 */ 
		    	setChangedMainPath(gridId);
    			
    			// RX 리셋
    			var rxflag = "LEFT_RX_";
    			var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    			$.each(rxColumnList, function(key,val){
					$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
				});
       			
    		} else if(dataObj._key == "RIGHT_PORT_DESCR") {
    			// 우포트 변경
    			var flag = "RIGHT_";
    			var columnList = [  
  			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
  			                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
  			                  ];
				$.each(columnList, function(key,val){
	  				if(dataObj._key != (flag+val)){
	  					$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
	  				}
	  	     	});
    			setLinkDataNull(rowIndex, gridId);			

    			/* 2018-09-12  3. RU고도화 */ 
		    	setChangedMainPath(gridId);
    			
    			// RX 리셋
    			var rxflag = "RIGHT_RX_";
    			var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    			$.each(rxColumnList, function(key,val){
    				$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
    			});
    		}
    		
    		
    	});
    	
		// 데이터를 입력하지 않았을때 drag 하지 못하도록
		$('#'+detailGridId + ', #'+reserveGrid).on('rowDragOver', function(e){
			//ADAMS 고도화 - ADAMS FLAG제외
			//TODO 이전으로 20240911
			//if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
			//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
				var dragDataList = e.alopexgrid.dragDataList;
				
				for(var i = 0; i < dragDataList.length; i++) {
					var dataObj = dragDataList[i];
					if(dataObj._state.added && nullToEmpty(dataObj.SERVICE_ID) == "" && // 2018-09-12  3. RU고도화
							nullToEmpty(dataObj.TRUNK_ID) == "" && nullToEmpty(dataObj.WDM_TRUNK_ID) == "" && nullToEmpty(dataObj.RING_ID) == ""
						&& nullToEmpty(dataObj.LEFT_NE_ID) == "" && nullToEmpty(dataObj.RIGHT_NE_ID) == "") {
							return false;
					}
				}
    		//} else {
    		//	return false;
    		//}
		});
		

		/* 2018-09-12  3. RU고도화 */ 		
		var bfRowIndex = -1;
    	$('#'+ detailGridId).on('rowDragDrop', function(e){
    		var evObj = AlopexGrid.parseEvent(e);
    		var dragData = evObj.dragDataList[0];
    		// 이동전 행 번호 취득
    		bfRowIndex = dragData._index.row;
    	});
    			
//		$('#'+detailGridId).on('dataChanged', function(e){
//			var dataObj = AlopexGrid.parseEvent(e);
//    		var rowIndex = dataObj._index.data;
//    		var gridId = AlopexGrid.parseEvent(e).$grid.attr('id');
//		});
		
		// drag가 끝났을때 국사 cell 다시 그리기
		$('#'+detailGridId + ', #'+reserveGrid).on('rowDragDropEnd', function(e){
			var tmpGridId = AlopexGrid.parseEvent(e).$grid.attr('id');
			orgChk(tmpGridId);
			
			if (tmpGridId == detailGridId) {
				var evObj = AlopexGrid.parseEvent(e);
	    		var dragData = evObj.dragDataList[0];
	    		
	    		// 이동후 행 번호 취득
	    		var tmpRowIndex = dragData._index.row;
	    		
	    		// 이전 행번호와 다른경우 수정된것으로 인지
	    		if (bfRowIndex != tmpRowIndex) {
	    			/* 2018-09-12  3. RU고도화 */ 
			    	setChangedMainPath(tmpGridId);
	    			bfRowIndex = -1;
	    		}
			}
		});
		    	
		// drag가 끝났을때 구간 비교하여 자동 생성
//			var dragDataList = e.alopexgrid.dragDataList;
//			var gridDataList = $('#'+detailGridId).alopexGrid("dataGet");
//			
//			for(var i = 0; i < dragDataList.length; i++) {
//				var dataObj = dragDataList[i];
//				var rowIndex = dataObj._index.row; 
//				if( rowIndex > 0) {
//					if(i == 0) {
//						// 드래그데이터의 첫구간
//						if(dataObj.LEFT_NE_ID != gridDataList[rowIndex-1].RIGHT_NE_ID) {
//							// 좌장비의 데이터가 이전 구간의 우장비 데이터와 동일하지 않으면 데이터 자동생성
//							
//							// 이전 구간의 우장비 데이터를 신규 생성되는 구간의 좌장비 데이터에 셋팅한다.
//							var rightDataList = AlopexGrid.trimData(gridDataList[rowIndex-1]);
//							var addData = {};
//							var keyParam = "RIGHT";
//			    			for(var key in rightDataList) {
//			    				if(key.indexOf(keyParam) == 0) {
//			    					if(key.indexOf(keyParam+"_PORT") != 0 && key.indexOf(keyParam+"_RACK") != 0 && key.indexOf(keyParam+"_SHELF") != 0 
//			    							&& key.indexOf(keyParam+"_CARD") != 0 && key.indexOf(keyParam+"_SLOT") != 0 
//			    							&& key.indexOf(keyParam+"_CHANNEL") != 0 && key.indexOf(keyParam+"_ADD_DROP") != 0) {
//			    						eval("addData." + key.replace(keyParam + "_", "LEFT_") + " = rightDataList." + key);
//			    					}
//			    				}
//			    			}
//			    			
//			    			// 현재 구간의 좌장비 데이터를 신규 생성되는 구간의 우장비 데이터에 셋팅한다.
//			    			keyParam = "LEFT";
//			    			var leftDataList = AlopexGrid.trimData(dataObj);
//			    			for(var key in leftDataList) {
//			    				if(key.indexOf(keyParam) == 0) {
//			    					if(key.indexOf(keyParam+"_PORT") != 0 && key.indexOf(keyParam+"_RACK") != 0 && key.indexOf(keyParam+"_SHELF") != 0 
//			    							&& key.indexOf(keyParam+"_CARD") != 0 && key.indexOf(keyParam+"_SLOT") != 0
//			    							&& key.indexOf(keyParam+"_CHANNEL") != 0 && key.indexOf(keyParam+"_ADD_DROP") != 0) {
//			    						eval("addData." + key.replace(keyParam + "_", "RIGHT_") + " = leftDataList." + key);
//			    					}
//			    				}
//			    			}
//			    			
//			    			// 현재 구간
//							$("#"+detailGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
//							$("#"+detailGridId).alopexGrid("startEdit");
//						}
//					} else if(i == dragDataList.length-1) {
//						// 드래그데이터의 마지막구간
//						if(dataObj.RIGHT_NE_ID != gridDataList[rowIndex+1].LEFT_NE_ID) {
//							var addData = {};
//							
//							$("#"+detailGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
//							$("#"+detailGridId).alopexGrid("startEdit");
//						}
//					}
//				}
//			}
//		});
		
		/**
		 * 1. 사용네트워크의 채널과 비교하여 시작 문자열이 다르면 테두리 처리
		 * 2. 포트, 채널 선번 룰 체크
		 */
		$('#'+detailGridId + ', #'+reserveGrid).on('cellValueEditing', function(e){
			var ev = AlopexGrid.parseEvent(e);        	
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var useLineSvlnNo = AlopexGrid.currentValue(data, "SERVICE_ID");
        	var useTrkNtwkLineNo = AlopexGrid.currentValue(data, "TRUNK_ID");
        	var useRingNtwkLineNo = AlopexGrid.currentValue(data, "RING_ID");
        	var useWdmTrkNtwkLineNo = AlopexGrid.currentValue(data, "WDM_TRUNK_ID");
        	var paramTopoLclCd = "";
        	var paramTopoSclCd = "";
        	var linePathYn = "N";
        	
			var mappingKey = ev.mapping.key;
        	if(typeof topoLclCd != "undefined") {
        		paramTopoLclCd = topoLclCd;
        		paramTopoSclCd = topoSclCd;
        	} else {
        		paramTopoLclCd = svlnLclCd;
        		paramTopoSclCd = svlnSclCd;
        		linePathYn = "Y";
        	}
        	
        	// 좌채널 변경
        	if(mapping.key == 'LEFT_CHANNEL_DESCR' || mapping.key == 'LEFT_PORT_DESCR') {
        		// LEFT_CHANNEL_IDS : 파장데이터가 없을 때 호출
        		if(AlopexGrid.currentValue(data,  "LEFT_CHANNEL_IDS") == "" || AlopexGrid.currentValue(data,  "LEFT_CHANNEL_IDS") == null) {
        			var useChannelDescr = AlopexGrid.currentValue(data,  "USE_NETWORK_LEFT_CHANNEL_DESCR");
        			var channelDescr = AlopexGrid.currentValue(data,  "LEFT_CHANNEL_DESCR");
        			
        			// 채널일 경우 사용네트워크의 채널과 비교하여 시작이 다를 경우 표시
            		if(mapping.key == 'LEFT_CHANNEL_DESCR') {
            			if(nullToEmpty(channelDescr) != "" && nullToEmpty(useChannelDescr) != "" && channelDescr.indexOf(useChannelDescr) != 0) {
            				// 셀 테두리 처리
            				$($cell).find('input').attr('style', 'border-color:red');
            			} else {
            				if($($cell).find('input > style').size() > 0) {
            					$($cell).find('input').removeAttr('style');
            				}
            				$($cell).removeClass('channelDescrCss');
            			}
            		}
        			
        			// 룰체크.
        			// checkEqpMdlPortRule(data, $cell, channelDescr, "LEFT");
        			var ruleParam = {"eqpMdlPortRule" : eqpMdlPortRule
        								, "lftPortChnlVal" : AlopexGrid.currentValue(data, "LEFT_CHANNEL_DESCR")
        								, "lftPortNm" : AlopexGrid.currentValue(data, "LEFT_PORT_DESCR") 
        								, "lftEqpMdlId" : AlopexGrid.currentValue(data,  "LEFT_MODEL_ID")
        								, "useLineSvlnNo" : useLineSvlnNo
        								, "useTrkNtwkLineNo" : useTrkNtwkLineNo
										, "useRingNtwkLineNo" : useRingNtwkLineNo
										, "useWdmTrkNtwkLineNo" : useWdmTrkNtwkLineNo
										, "topoLclCd" : paramTopoLclCd
										, "topoSclCd" : paramTopoSclCd
										, "linePathYn" : linePathYn
        								, "generateLeft" : true
        							}
        			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkEqpMdlPortRule', ruleParam, 'POST', 'checkEqpMdlPortRule');
        		}
        	}
        	         	
        	// 우채널 변경
        	if(mapping.key == 'RIGHT_CHANNEL_DESCR' || mapping.key == 'RIGHT_PORT_DESCR') {
        		if(AlopexGrid.currentValue(data,  "RIGHT_CHANNEL_IDS") == "" || AlopexGrid.currentValue(data,  "RIGHT_CHANNEL_IDS") == null) {
        			var useChannelDescr = AlopexGrid.currentValue(data,  "USE_NETWORK_RIGHT_CHANNEL_DESCR");
            		var channelDescr = AlopexGrid.currentValue(data,  "RIGHT_CHANNEL_DESCR");
            		
            		// 채널일 경우 사용네트워크의 채널과 비교하여 시작이 다를 경우 표시
            		if(mapping.key == 'RIGHT_CHANNEL_DESCR') {
            			if(channelDescr.indexOf(useChannelDescr) != 0) {
            				$($cell).find('input').attr('style', 'border-color:red');
            			} else {
            				if($($cell).find('input > style').size() > 0) {
            					$($cell).find('input').removeAttr('style');
            				}
            				$($cell).removeClass('channelDescrCss');
            			}
            		}
            		
            		// 룰체크
            		// checkEqpMdlPortRule(data, $cell, channelDescr, "RIGHT");
            		var ruleParam = {"eqpMdlPortRule" : eqpMdlPortRule
										, "rghtPortChnlVal" : AlopexGrid.currentValue(data, "RIGHT_CHANNEL_DESCR")
										, "rghtPortNm" : AlopexGrid.currentValue(data, "RIGHT_PORT_DESCR") 
										, "rghtEqpMdlId" : AlopexGrid.currentValue(data,  "RIGHT_MODEL_ID")
										, "useTrkNtwkLineNo" : useTrkNtwkLineNo
										, "useRingNtwkLineNo" : useRingNtwkLineNo
										, "useWdmTrkNtwkLineNo" : useWdmTrkNtwkLineNo
										, "topoLclCd" : paramTopoLclCd
										, "topoSclCd" : paramTopoSclCd
										, "linePathYn" : linePathYn
										, "generateLeft" : false
									}
            		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkEqpMdlPortRule', ruleParam, 'POST', 'checkEqpMdlPortRule');
        		}
        	}
        	
     	 	if(mappingKey == "LEFT_CHANNEL_DESCR" || mappingKey == "LEFT_IS_CHANNEL_T1" || mappingKey =="LEFT_NODE_ROLE_CD" || mappingKey == "RIGHT_CHANNEL_DESCR" || mappingKey =="RIGHT_NODE_ROLE_CD" || mappingKey == "RIGHT_IS_CHANNEL_T1") { 
     	 		var orgValue = eval("ev.data._original."+mappingKey);
     	 		var chgValue = AlopexGrid.currentValue(data, mappingKey); //eval("ev.data."+mappingKey);
     	 		if (orgValue != chgValue) {
     	 			var tmpGridId = AlopexGrid.parseEvent(e).$grid.attr('id');
         	 		setChangedMainPath(tmpGridId);
     	 		}
     	 	}
        	   
		});
				
		/**
		 * 채널에 포커스가 있을때 룰체크 호출
		 */
		$('#'+detailGridId + ', #'+reserveGrid).on('cellFocus', function(e){
			ruleChkCall(e);
		});
		
		//수집선번비교버튼클릭
		 $('#btnCmslineCompare').on('click', function(e){	

			var rnmEqpId = (typeof initParam.rnmEqpId  != "undefined") ? initParam.rnmEqpId : "";
			var rnmEqpIdNm = (typeof initParam.rnmEqpIdNm  != "undefined") ? initParam.rnmEqpIdNm : "";
			var rnmPortId = (typeof initParam.rnmPortId  != "undefined") ? initParam.rnmPortId : "";
			var rnmPortIdNm = (typeof initParam.rnmPortIdNm  != "undefined") ? initParam.rnmPortIdNm : "";
			var rnmPortChnlVal = (typeof initParam.rnmPortChnlVal  != "undefined") ? initParam.rnmPortChnlVal : "";
			
			//var editPath = AlopexGrid.trimData($('#'+detailGridId).alopexGrid("dataGet"));
			var editPath = tempDataTrim(detailGridId);
			$a.popup({
				popid: "CmsLineComparePop",
				title: "수집회선 비교" /*수집회선 비교*/,
				url: 'CmsLineComparePop.do',
				data: {"gridId":openGridId,"ntwkLineNo":baseNtwkLineNo,"svlnLclCd":svlnLclCd,"svlnSclCd":svlnSclCd,"sFlag":"Y", "ntwkLnoGrpSrno": ntwkLnoGrpSrno, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())
					, "rnmEqpId" : rnmEqpId, "rnmEqpIdNm" : rnmEqpIdNm, "rnmPortId" : rnmPortId, "rnmPortIdNm" : rnmPortIdNm, "rnmPortChnlVal" : rnmPortChnlVal
					, "callViewType" : nullToEmpty(initParam.callViewType)
					, "editPath" : editPath
					, "baseInfData" : baseInfData
					, "teamsFlag" : false},
				iframe: true,
				modal : true,
				movable:false,
				windowpopup : true,
				width : 1500,
				height : 800
				,callback:function(data){
					if(data != null){
						$('#'+detailGridId).alopexGrid('dataSet', data.pathOld.LINKS);
						addRowNullData(detailGridId);
						$("#"+detailGridId).alopexGrid("startEdit");
						$('#'+detailGridId).alopexGrid("viewUpdate");

						cmsSaveChk = true;
						modifyMainPath = true;
					}
				}
			});
			
	    });

		//장비/선로정보버튼클릭
		$('#btnEqpNodeInfo').on('click', function(e){	
			openFdfListPop(baseNtwkLineNo);
		});
	
		//상위OLT장비등록버튼클릭
		$('#btnOltEqpReg').on('click', function(e){	
			
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
			var chkResult = false;
			var lftEqpInstlMtsoId = "";
			var lftEqpId = "";
			var lftPortNm = "";
			
			if(dataList.length > 0) {
				for(var i = 0; i < dataList.length; i++) {						
					var eqpRoleDivCd = nullToEmpty(dataList[i].LEFT_NE_ROLE_CD);
					if(eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182") {
						lftEqpInstlMtsoId = dataList[i].LEFT_ORG_ID; 
						lftEqpId = dataList[i].LEFT_NE_ID;	
						lftPortNm = dataList[i].LEFT_PORT_NM;	
						break;
					}
				}
			}

			if(lftEqpId == "") {
				alertBox("I", "적용할 상위OLT장비가 없습니다.");
				return;
			} else {
				var msg = "";
				if(dataList.length > 0) {
					for(var i = 0; i < dataList.length; i++) {						
						var eqpRoleDivCd = nullToEmpty(dataList[i].LEFT_NE_ROLE_CD);
						if(eqpRoleDivCd == "114") {
							msg = "상위OLT장비가 존재합니다. 진행하시겠습니까?";
							break;
						}
					}
				}
				
				if(msg != "") {
					callMsgBox('','C', msg, function(msgId, msgRst) {
						if(msgRst == 'Y') {
							cflineShowProgressBody();
							var param = {"ntwkLineNo": initParam.ntwkLineNo
									, "ntwkLnoGrpSrno": $("#ntwkLnoGroSrno").val()
									, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId
									, "lftEqpId" : lftEqpId	
							, "lftPortNm" : lftPortNm	
									}
							setOLTEqp(param);
						} else {
							chkResult = false;
						}
					});
				} else {
					var param = {"ntwkLineNo": initParam.ntwkLineNo
							, "ntwkLnoGrpSrno": $("#ntwkLnoGroSrno").val()
							, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId
							, "lftEqpId" : lftEqpId	
							, "lftPortNm" : lftPortNm	
							}
					setOLTEqp(param);
				}
			}
		});
		
		// 모든 경유링 표시
		$('#cascadingRingDisplay').on('click', function(e){
			var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData[0]._index.row);
    		
			// 2019-09-30  5. 기간망 링 선번 고도화
    		var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
			if($('#cascadingRingDisplay').is(':checked')) {				
				if (isAbleViaRing(chkTopoSclCd) == true) {
					$('#'+detailGridId).alopexGrid('showCol', ['CASCADING_RING_NM_3']);
					$('#'+detailGridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, 'CASCADING_RING_NM_3' );
				} else {
					$('#'+detailGridId).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					$('#'+detailGridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, 'CASCADING_RING_NM_2' );
				}

				$("#rontTrunkDisplayCheckbox").show();
			} else {
				if (isAbleViaRing(chkTopoSclCd) == true) {
					$('#'+detailGridId).alopexGrid('hideCol', ['CASCADING_RING_NM_3']);
				} else {
					$('#'+detailGridId).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
				}

				// 모든경유링 보기가 해지되면 경유링 보기도 체크해제하고 숨기기
				if($('#rontTrunkDisplay').is(':checked')) {
					$('#rontTrunkDisplay').click();
				}
				$("#rontTrunkDisplayCheckbox").hide();
				
			}
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
			
			// 예비선번일 경우 예비선번 그리드
			if( wkSprYn ) {
				if($('#cascadingRingDisplay').is(':checked')) {
					if (isAbleViaRing(chkTopoSclCd) == true) {
						$('#'+reserveGrid).alopexGrid('showCol', ['CASCADING_RING_NM_3']);
					} else {
						$('#'+reserveGrid).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					}
				} else {
					if (isAbleViaRing(chkTopoSclCd) == true) {
						$('#'+reserveGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_3']);
					} else {
						$('#'+reserveGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					}
					
				}
				$('#'+reserveGrid).alopexGrid("updateOption", { fitTableWidth: true });
				$('#'+reserveGrid).alopexGrid("viewUpdate");
			}
	    });
		
		// 기간망 트렁크 표시
		$('#rontTrunkDisplay').on('click', function(e){

			var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData[0]._index.row);
			// 2019-09-30  5. 기간망 링 선번 고도화
			if($('#rontTrunkDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('showCol', ['RONT_TRK_NM']);
				$('#'+detailGridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, 'RONT_TRK_NM' );
			} else {
				$('#'+detailGridId).alopexGrid('hideCol', ['RONT_TRK_NM']);
			}
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
			
			// 예비선번일 경우 예비선번 그리드
			if( wkSprYn ) {
				if($('#rontTrunkDisplay').is(':checked')) {
					$('#'+detailGridId).alopexGrid('showCol', ['RONT_TRK_NM']);
				} else {
					$('#'+detailGridId).alopexGrid('hideCol', ['RONT_TRK_NM']);
				}
				$('#'+reserveGrid).alopexGrid("updateOption", { fitTableWidth: true });
				$('#'+reserveGrid).alopexGrid("viewUpdate");
			}
	    });
	}
});

//FDF실장정보확인 버튼
function openFdfCardInfoPop(data, $cell, grid) {

	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
  	
	var eqpId = "";
	var eqpNm = "";
	var trx = "";
	if(data._key == "LEFT_NE_NM") {
		eqpId = data.LEFT_NE_ID;
		eqpNm = data.LEFT_NE_NM;
		trx = "TX";
	} else if(data._key == "RIGHT_NE_NM") {
		eqpId = data.RIGHT_NE_ID;
		eqpNm = data.RIGHT_NE_NM;
		trx = "TX";
	}
	
	$a.popup({
		popid: "FdfCardInfPop",
		title: "FDF포트정보", 
		url: 'FdfCardInfPop.do',
		data: {"eqpId":eqpId
			, "eqpNm":eqpNm},
		iframe: true,
		modal : true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 750,
		callback:function(data){
			
		}
	});
}

var cmsSaveChk = false;
/**
 * 
 * @param e			: cell에 포커스가 있을때의 이벤트
 * @param cellYn	: cell포커스 호출인지 저장 전 row단위 호출인지 체크. Y : cell호출, N : row호출
 */
function ruleChkCall(e) {
	var ev = AlopexGrid.parseEvent(e);
	var data = ev.data;
	var mapping = ev.mapping;
	var $cell = ev.$cell;
	var useLineSvlnNo = AlopexGrid.currentValue(data, "SERVICE_ID");
	var useTrkNtwkLineNo = AlopexGrid.currentValue(data, "TRUNK_ID");
	var useRingNtwkLineNo = AlopexGrid.currentValue(data, "RING_ID");
	var useWdmTrkNtwkLineNo = AlopexGrid.currentValue(data, "WDM_TRUNK_ID");
	var paramTopoLclCd = "";
	var paramTopoSclCd = "";
	var linePathYn = "N";
	if(typeof topoLclCd != "undefined") {
		paramTopoLclCd = topoLclCd;
		paramTopoSclCd = topoSclCd;
	} else {
		paramTopoLclCd = svlnLclCd;
		paramTopoSclCd = svlnSclCd;
		linePathYn = "Y";
	}
	
	if(  (mapping.key == 'LEFT_PORT_DESCR') || (mapping.key == 'LEFT_CHANNEL_DESCR') 
			|| (mapping.key == 'RIGHT_PORT_DESCR') || (mapping.key == 'RIGHT_CHANNEL_DESCR') ) {
		if($($cell).find('input').size() > 0) {
			var ruleParam = {};
			if(AlopexGrid.currentValue(data, "LEFT_NE_ID") != null && mapping.key == 'LEFT_PORT_DESCR' || mapping.key == 'LEFT_CHANNEL_DESCR') {
				if(AlopexGrid.currentValue(data, "LEFT_CHANNEL_IDS") == null || AlopexGrid.currentValue(data, "LEFT_CHANNEL_IDS").length < 1) {
					ruleParam = {"eqpMdlPortRule" : eqpMdlPortRule
							, "lftPortChnlVal" : AlopexGrid.currentValue(data, "LEFT_CHANNEL_DESCR")
							, "lftPortNm" : AlopexGrid.currentValue(data, "LEFT_PORT_DESCR") 
							, "lftEqpMdlId" : AlopexGrid.currentValue(data,  "LEFT_MODEL_ID")
							, "useLineSvlnNo" : useLineSvlnNo
							, "useTrkNtwkLineNo" : useTrkNtwkLineNo
							, "useRingNtwkLineNo" : useRingNtwkLineNo
							, "useWdmTrkNtwkLineNo" : useWdmTrkNtwkLineNo
							, "topoLclCd" : paramTopoLclCd
							, "topoSclCd" : paramTopoSclCd
							, "linePathYn" : linePathYn
							, "generateLeft" : true
					};
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkEqpMdlPortRule', ruleParam, 'POST', 'checkEqpMdlPortRule');
				}
			} else if(AlopexGrid.currentValue(data, "RIGHT_NE_ID") != null && mapping.key == 'RIGHT_PORT_DESCR' || mapping.key == 'RIGHT_CHANNEL_DESCR') {
				if(AlopexGrid.currentValue(data, "RIGHT_CHANNEL_IDS") == null || AlopexGrid.currentValue(data, "RIGHT_CHANNEL_IDS").length < 1) {
					ruleParam = {"eqpMdlPortRule" : eqpMdlPortRule
							, "rghtPortChnlVal" : AlopexGrid.currentValue(data, "RIGHT_CHANNEL_DESCR")
							, "rghtPortNm" : AlopexGrid.currentValue(data, "RIGHT_PORT_DESCR") 
							, "rghtEqpMdlId" : AlopexGrid.currentValue(data,  "RIGHT_MODEL_ID")
							, "useLineSvlnNo" : useLineSvlnNo
							, "useTrkNtwkLineNo" : useTrkNtwkLineNo
							, "useRingNtwkLineNo" : useRingNtwkLineNo
							, "useWdmTrkNtwkLineNo" : useWdmTrkNtwkLineNo
							, "topoLclCd" : paramTopoLclCd
							, "topoSclCd" : paramTopoSclCd
							, "linePathYn" : linePathYn
							, "generateLeft" : false
					};
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkEqpMdlPortRule', ruleParam, 'POST', 'checkEqpMdlPortRule');
				}
			}
		} else {
			$("#channelRuleBox").hide();
		}
	} else {			
		$("#channelRuleBox").hide();
	}
}

function setCheckboxByGrid() {
	if(!$('#supSubDisplay').is(':checked')) {
		$('#'+detailGridId).alopexGrid('hideCol', ['LEFT_NODE_ROLE_CD', 'LEFT_NODE_ROLE_NM', 'RIGHT_NODE_ROLE_CD', 'RIGHT_NODE_ROLE_NM']);
	} else {
		$('#'+detailGridId).alopexGrid('showCol', ['LEFT_NODE_ROLE_CD', 'LEFT_NODE_ROLE_NM', 'RIGHT_NODE_ROLE_CD', 'RIGHT_NODE_ROLE_NM']);
	}
	
	// 국사 표시
	if(!$('#mtsoDisplay').is(':checked')) {
		$('#'+detailGridId).alopexGrid('hideCol', [leftOrgNm, rightOrgNm]);
	} else {
		$('#'+detailGridId).alopexGrid('showCol', [leftOrgNm, rightOrgNm]);
	}
	$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
}

function setLinkDataNull(rowIndex, gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	//구간 데이터 변경
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_SEQ");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_ID");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_DIRECTION");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_STATUS_CD");
	
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_ID");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_DIRECTION");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_STATUS_CD");
}

/**
 * 
 * @param division
 * @param schVal
 * @param trunkDataObj
 * @param ringDataObj
 * @param wdmTrunkDataObj
 */
function checkPop(division, schVal, serviceDataObj, trunkDataObj, ringDataObj, wdmTrunkDataObj, useNetworkPathDirection, dataObj, gridId) {
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 */
	
	if (typeof gridId == "undefined" || gridId == null || gridId == "" || gridId == "null") {
		gridId = detailGridId;
	}
	var editYn = $('#'+gridId).alopexGrid("readOption").cellInlineEdit;
	
	var serviceId = nullToEmpty(serviceDataObj);
	serviceId = (serviceId.indexOf("alopex") == 0) ? "" : serviceId; 
	var trunkId = nullToEmpty(trunkDataObj);
	trunkId = (trunkId.indexOf("alopex") == 0) ? "" : trunkId; 
	var ringId = nullToEmpty(ringDataObj);
	ringId = (ringId.indexOf("alopex") == 0) ? "" : ringId;
	var wdmTrunkId = nullToEmpty(wdmTrunkDataObj);
	wdmTrunkId = (wdmTrunkId.indexOf("alopex") == 0) ? "" : wdmTrunkId;
	
	if(serviceId != "") {		
		if(division == "ring" || division =="cascadingRing" || division =="cascadingRingL2" || division =="cascadingRingL3") {
			// 서비스회선 아이디가 존재하는데 구분이 ring인 경우 링 오픈
			if(dataObj.RING_TOPOLOGY_LARGE_CD == '001' && dataObj.RING_TOPOLOGY_SMALL_CD == '031') {
				openNetworkPathPop(false, ringDataObj, "ring", true, dataObj.RING_PATH_DIRECTION, dataObj.RING_PATH_SAME_NO);
			} else {
				if (division == "ring") {
				addDropPop(false, ringId, useNetworkPathDirection, gridId);
				} else {
					if (division == "cascadingRing" ) {
						casCadingAddDropPop(false, ringId, useNetworkPathDirection, dataObj, gridId, division);
					} else {
						schVal = {};
						schVal.RING_PATH_DIRECTION = useNetworkPathDirection;
						schVal.RING_TOPOLOGY_SMALL_CD = (division =="cascadingRingL3" ? nvlStr(dataObj.RING_TOPOLOGY_SMALL_CD_L3, dataObj.RING_TOPOLOGY_SMALL_CD_L2) : dataObj.RING_TOPOLOGY_SMALL_CD_L2);
						schVal.RING_TOPOLOGY_CFG_MEANS_CD = (division =="cascadingRingL3" ? nvlStr(dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L3, dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L2) : dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L2);
												
						openUseRingRontTrunkSearchPop(division, schVal, ringId, gridId);
					}
				}
			}
		} else {
			// 서비스회선 오픈		
			checkPop2(division, schVal, serviceId, dataObj, gridId);
		}
	} else if(serviceId == "" && trunkId != "") {
		// 트렁크 선번 팝업창 오픈
		if(division == "ring" || division =="cascadingRing" || division =="cascadingRingL2" || division =="cascadingRingL3") {
			// 트렁크 아이디가 존재하는데 구분이 ring인 경우 링 오픈
			if(dataObj.RING_TOPOLOGY_LARGE_CD == '001' && dataObj.RING_TOPOLOGY_SMALL_CD == '031') {
				openNetworkPathPop(false, ringDataObj, "ring", true, dataObj.RING_PATH_DIRECTION, dataObj.RING_PATH_SAME_NO);
			} else {
				if (division == "ring") {
				addDropPop(false, ringId, useNetworkPathDirection, gridId);
				} else {
					if (division == "cascadingRing") {
						casCadingAddDropPop(false, ringId, useNetworkPathDirection, dataObj, gridId, division);
					} else {
						schVal = {};
						schVal.RING_PATH_DIRECTION = useNetworkPathDirection;
						schVal.RING_TOPOLOGY_SMALL_CD = (division =="cascadingRingL3" ? nvlStr(dataObj.RING_TOPOLOGY_SMALL_CD_L3, dataObj.RING_TOPOLOGY_SMALL_CD_L2) : dataObj.RING_TOPOLOGY_SMALL_CD_L2);
						schVal.RING_TOPOLOGY_CFG_MEANS_CD = (division =="cascadingRingL3" ? nvlStr(dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L3, dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L2) : dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L2);
												
						openUseRingRontTrunkSearchPop(division, schVal, ringId, gridId);
					}
				}
			}
		} else {
			// 그 외 트렁크 오픈
			openNetworkPathPop(editYn, trunkDataObj, "trunk", true, dataObj.TRUNK_PATH_DIRECTION, dataObj.TRUNK_PATH_SAME_NO);
		}
	} 
	// 링 화면에서 링이 존재하는경우 링 ADD/DROP 조회
	else if(serviceId == "" && trunkId == "" && ringId != "") {
		if(dataObj.RING_TOPOLOGY_LARGE_CD == '001' && dataObj.RING_TOPOLOGY_SMALL_CD == '031') {
			openNetworkPathPop(editYn, ringDataObj, "ring", true, useNetworkPathDirection, dataObj.RING_PATH_SAME_NO);
		} else {
			if (division == "ring") {
			addDropPop(editYn, ringId, useNetworkPathDirection, gridId);
			} else {
				if (division == "cascadingRing") {
					casCadingAddDropPop(editYn, ringId, useNetworkPathDirection, dataObj, gridId, division);
				} else {
					schVal = {};
					schVal.RING_PATH_DIRECTION = useNetworkPathDirection;
					schVal.RING_TOPOLOGY_SMALL_CD = (division =="cascadingRingL3" ? nvlStr(dataObj.RING_TOPOLOGY_SMALL_CD_L3, dataObj.RING_TOPOLOGY_SMALL_CD_L2) : dataObj.RING_TOPOLOGY_SMALL_CD_L2);
					schVal.RING_TOPOLOGY_CFG_MEANS_CD = (division =="cascadingRingL3" ? nvlStr(dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L3, dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L2) : dataObj.RING_TOPOLOGY_CFG_MEANS_CD_L2);
									
					openUseRingRontTrunkSearchPop(division, schVal, ringId, gridId);
				}
			}			
		}
	} else if(serviceId == "" && trunkId == "" && ringId == "" && wdmTrunkId != "") {
		// WDM 트렁크 선번 팝업창 오픈
		openNetworkPathPop(editYn, wdmTrunkDataObj, "wdm", true, useNetworkPathDirection, dataObj.WDM_TRUNK_PATH_SAME_NO);
	} else {
		
		if(division == "trunk") openTrunkListPop(schVal, "trunk", "N");
		else if(division == "ring") openRingListPop(schVal, null, gridId);
		else if(division == "wdm") 	openTrunkListPop(schVal, "wdm", "N");
		else if(division == "cascadingRing" ) {
			var CASCADING_RING_NM = schVal;
			var schVal = {};			
			schVal.CASCADING_RING_NM = CASCADING_RING_NM;
			
			//2021-05-13 가입자망링의 경우 경유링추가
			if( ((typeof topoLclCd != "undefined") && topoLclCd == '001') 
	    			&& ((typeof topoSclCd != "undefined") && topoSclCd == '031') && mgmtGrpCd == '0002') {
				//SKB 가입자망링 경유링추가
				useRingPopChk(division, schVal, null, dataObj, gridId);
			} else {
				//그 외
				openUseRingRontTrunkSearchPop(division, schVal, null, gridId);
			}
		}
	}
}

/*
 * useRingPopChk
 * SKB 경유링선택팝업
 * 2021-05-13
 */
function useRingPopChk(division, schVal, serviceId, dataObj, gridId){
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
		
	$a.popup({
    	popid: 'OpenUseRingChkPop',
    	title: '경유링 종류 선택 팝업',
    	iframe: true,
        modal: false,
        windowpopup: true,
	    url : 'OpenUseRingChkPop.do',
        data: dataParam,
        width : 700,
        height : 350 
    	,callback: function(data) {
    		
    		if(data != null) {
    			if(data == "1"){	//일반 경유링 선택
    				openUseRingRontTrunkSearchPop(division, schVal, null, gridId);
    			} else {	//전송망링 경유링 선택
    				
    				// 이미 사용서비스회선정보가 있는지
    				var chkDataObj = $('#'+gridId).alopexGrid("dataGet", function (data) { 
    									return (nullToEmpty(data["RING_ID"]) != '' && nullToEmpty(data["RING_ID"]).indexOf("alopex") != 0) ;
    						 		});
    				
    				if (chkDataObj.length > 0) {
    					var msg = "이미 사용링이 설정되어 있습니다. <br>사용 링 참조는 링당 1개의 사용링만 참조가능합니다.";
    					alertBox('W', msg); 
    					// 다른 팝업에 영향을 주지않기 위해
    					$.alopex.popup.result = null; 
    					return;
    				}
    				    				
    				openUseBtbEqpRingPop(gridId);
				}
    		}
       	}
    });
}

/**
 * checkPop2("serviceline", schVal, dataObj.data.SERVICE_ID, dataObj.data);
 * @param division
 * @param schVal
 * @param serviceId
 * @param dataObj
 * @param gridId
 */
function checkPop2(division, schVal, serviceId, dataObj, gridId) {
	if (typeof gridId == "undefined" || gridId == null || gridId == "" || gridId == "null") {
		gridId = detailGridId;
	}
	var editYn = $('#'+gridId).alopexGrid("readOption").cellInlineEdit;
	
	var servicelineId = nullToEmpty(serviceId);
	servicelineId = (servicelineId.indexOf("alopex") == 0) ? "" : servicelineId; 
	
	if(servicelineId != "") {
		//해당 서비스회선 선번
		//openNetworkPathPop(editYn, wdmTrunkDataObj, "wdm", true, useNetworkPathDirection, dataObj.WDM_TRUNK_PATH_SAME_NO);
		openServiceLineSearchPop(division, schVal, serviceId, dataObj);
	} else {
		if(division == "serviceline") openServiceLineSearchPop(division, schVal, '', '');
	}
}

/**
 * 각 버튼을 클릭 할 때 이벤트
 */
function setEqpEventListener(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	$('#'+gridId).on('keydown', function(e){
		if(e.keyCode == 13) {
			event = e;
			var focusData = $('#'+gridId).alopexGrid("focusInfo").inputFocus.mapping;
			var dataObj = AlopexGrid.parseEvent(e).data;
			var schVal = dataObj._state.editing[dataObj._column];
			
			//
			if(focusData.key == "TRUNK_NM") {
				checkPop("trunk", schVal, dataObj.SERVICE_ID, dataObj.TRUNK_ID, null, null, null, dataObj);
			} else if(focusData.key == "WDM_TRUNK_NM"){
				// WDM 트렁크
				checkPop("wdm", schVal, dataObj.SERVICE_ID, dataObj.TRUNK_ID, dataObj.RING_ID, dataObj.WDM_TRUNK_ID, null, dataObj);
			} else if(focusData.key == "RING_NM") {
				// 링
				checkPop("ring", schVal, dataObj.SERVICE_ID, dataObj.TRUNK_ID, dataObj.RING_ID, null, null, dataObj);
			} else if(focusData.key == "LEFT_NE_NM") {
				// 좌장비
				var division = (gridDivision == "wdm") ? "wdm" : "";
				openEqpListPop(schVal, vTmofInfo, division, "LEFT", gridId);
			} else if(focusData.key == "RIGHT_NE_NM") {
				// 우장비
				var division = (gridDivision == "wdm") ? "wdm" : "";
				openEqpListPop(schVal, vTmofInfo, division, "RIGHT", gridId);
			} else if(focusData.key == "LEFT_PORT_DESCR") {
				// 좌포트
				if(nullToEmpty(dataObj.LEFT_NE_ID) == "" || dataObj.LEFT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['westEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
				openPortListPop(dataObj.LEFT_NE_ID, dataObj.data.LEFT_PORT_ID, schVal, "LEFT", gridId);
			} else if(focusData.key == "RIGHT_PORT_DESCR") {
				// 우포트
				if(nullToEmpty(dataObj.RIGHT_NE_ID)=="" || dataObj.RIGHT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['eastEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
				
				openPortListPop(dataObj.RIGHT_NE_ID, dataObj.data.RIGHT_PORT_ID, schVal, "RIGHT", gridId);
			} else if(focusData.key == "LEFT_CHANNEL_DESCR" || focusData.key == "RIGHT_CHANNEL_DESCR") {
				openCouplerPop(dataObj, null, gridId);
			} 
			// 2018-09-12  3. RU고도화
			else if(focusData.key == "SERVICE_NM") {
    			checkPop2("serviceline", schVal, dataObj.SERVICE_ID, dataObj);
    		}
			// 2019-09-30  5. 기간망 링 선번 고도화
    		else if (focusData.key == "CASCADING_RING_NM") {    			
    			checkPop("cascadingRing", schVal, dataObj.SERVICE_ID, dataObj.TRUNK_ID, dataObj.RING_ID, dataObj.WDM_TRUNK_ID, dataObj.RING_PATH_DIRECTION, dataObj);
    		}
     	 	// 2019-09-30  5. 기간망 링 선번 고도화
    		else if (focusData.key == "CASCADING_RING_NM_2") {
    			checkPop("cascadingRingL2", schVal, dataObj.SERVICE_ID, dataObj.TRUNK_ID, dataObj.RING_ID_L2, dataObj.WDM_TRUNK_ID, dataObj.RING_PATH_DIRECTION_L2, dataObj);
    		}
     	 	// 2019-09-30  5. 기간망 링 선번 고도화
    		else if (focusData.key == "CASCADING_RING_NM_3") {
    			checkPop("cascadingRingL3", schVal, dataObj.SERVICE_ID, dataObj.TRUNK_ID, dataObj.RING_ID_L3, dataObj.WDM_TRUNK_ID, dataObj.RING_PATH_DIRECTION_L3, dataObj);
    		}
			return false;
		} 
    });
}

/**
 * Function Name : openTrunkListPop
 * Description   : 트렁크, WDM트렁크 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : ntwkLineNm. 입력한 트렁크 및 WDM트렁크 명 
 *                 division. 트렁크 WDM트렁크 구분 
 *                 prev. 선번 팝업창에서 '이전' 버튼으로 호출하는지 여부
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openTrunkListPop(ntwkLineNm, searchDivision, prev) {
	var dataObj = AlopexGrid.parseEvent(event); 
	var gridId = dataObj.$grid.attr("id");
	
	var checkYn = true;
	checkYn = prev == 'Y'? true : checkOpenPopYn(gridId);  
 	if(checkYn) {
 		// 대분류, 소분류 코드 정의
 		if(searchDivision == 'trunk') {
 			searchTopoLclCd = '002';
 			searchTopoSclCd = '';
 			isLink = false;
 		} else if(searchDivision == 'wdm') {
 			if(gridDivision != 'serviceLine') {
 				isLink = (topoLclCd == '003' && topoSclCd == '101') ? true : false;
 			} else {
 				isLink = false;
 			}
 			
 			searchTopoLclCd = '003';
 			searchTopoSclCd = '101';
 		} else if(searchDivision == 'ring') {
 			searchTopoLclCd = '001';
 			searchTopoSclCd = '';
 			isLink = false;
 		}
 		
 		var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : ntwkLineNm, "topoLclCd" : searchTopoLclCd, "topoSclCd" : searchTopoSclCd, "isLink" : isLink, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
 		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		var title = searchDivision == 'wdm' ? 'WDM 트렁크 리스트 조회' : '트렁크 리스트 조회';
 		
 		$a.popup({
 		  	url: urlPath+'/configmgmt/cfline/TrunkListPop.do',
 		    data: param,
 		    windowpopup : true,
// 		    other:'width=1200,height=700,scrollbars=yes,resizable=yes',
// 		  	popid: 'TrunkListPop',
// 		  	title: title,
// 		    iframe: true,
// 		    modal : false,
// 		    movable : true,
 		    width : 1200,
 		    height : 700,
 		    callback:function(data){
// 		    	var ntwkLineNm = "";
 		    	if(data != null){
 		    		if(data.length == 1) {
 		    			ntwkLineNo = data[0].ntwkLineNo;
// 		    			ntwkLineNm = data[0].ntwkLineNm;
 		    		} else {
 		    			ntwkLineNo = data.ntwkLineNo;
// 		    			ntwkLineNm = data.ntwkLineNm;
 		    		}
 		    		
 		    		var dataObj = [];
 		    		if(searchDivision == "wdm") {
 		    			dataObj = $('#'+gridId).alopexGrid("dataGet", {'WDM_TRUNK_ID' :ntwkLineNo}, 'WDM_TRUNK_ID');
 		    		} else {
 	 		    		dataObj = $('#'+gridId).alopexGrid("dataGet", {'TRUNK_ID' :ntwkLineNo}, 'TRUNK_ID');
 		    		}
 		    		
 		    		if(dataObj.length > 0) {
		    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
		    			alertBox('I', msg); 
		    			return;
		    		} else {
		    			// 가져온 트렁크 및 WDM트렁크의 선번 팝업 오픈.
		    			openNetworkPathPop(true, ntwkLineNo, searchDivision, null, null, null, gridId);
		    		}
 		    	}
 		    }	  
 		});
 	}
}

/**
 * Function Name : openRingListPop
 * Description   : 링 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : ntwkLineNm. 입력한 링 명 
 * 				   prev. 선번 팝업창에서 '이전' 버튼으로 호출하는지 여부 
 *                 callGridIdForRing. 링 호출한 Grid
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openRingListPop(ntwkLineNm, prev, callGridIdForRing) {
	
	var chkRingCntGrid = callGridIdForRing;
	if (typeof callGridIdForRing == "undefined" || callGridIdForRing == null || callGridIdForRing == "") {
		chkRingCntGrid = detailGridId;
	}
	if (isRuCoreLineOld() == true && checkUseRingAtRuPath(chkRingCntGrid) == true) {
		alertBox('W', "RU광코어회선은 1개의 링만 사용가능합니다.");
		return;
	}
	
	var checkYn = true;
	checkYn = prev == 'Y'? true : checkOpenPopYn(callGridIdForRing);  
	
	if(checkYn) {
 		if(ntwkLineNm == undefined) ntwkLineNm = '';
 		
 		var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : ntwkLineNm, "topoLclCd" : "001", "topoSclCd" : '', "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
 		
 		if(gridDivision == "serviceLine") {
 			$.extend(param,{"svlnLclCd": svlnLclCd});
 			$.extend(param,{"svlnSclCd": svlnSclCd});
 		}
 		
 		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) ==""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		$a.popup({
 		  	popid: 'RingListPop',
 		  	title: '링리스트조회팝업',
 		    url: urlPath+'/configmgmt/cfline/RingListPop.do',
 		    data: param,
 		    iframe: true,
 		    modal : true,
 		    movable : true,
 		    windowpopup : true,
 		    width : 1200,
 		    height : 700,
 		    callback:function(data){
 		    	if(data != null){
 		    		ntwkLineNo = data.ntwkLineNo;
 		    		
 		    		// 호출 그리드가 없는 경우
 		    		if (typeof callGridIdForRing == "undefined" || callGridIdForRing == null || callGridIdForRing == "") {
 		    			callGridIdForRing = detailGridId;
 		    		}
 		    		
 		    		var dataObj = [];
 		    		//dataObj = $('#'+detailGridId).alopexGrid("dataGet", {'RING_ID' :ntwkLineNo}, 'RING_ID');
 		    		dataObj = $('#'+callGridIdForRing).alopexGrid("dataGet", {'RING_ID' :ntwkLineNo}, 'RING_ID');
 		    		
 		    		if(dataObj.length > 0) {
		    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
		    			alertBox('I', msg); 
		    			return;
		    		} else {
		    			if(data.topoLclCd == "001" && data.topoSclCd == "031") {
		    				// 가입자망링 - 선번창 오픈
		    				openNetworkPathPop(true, ntwkLineNo, 'ring', null, null, null);
		    			} else {
		    				// 링 구성도 오픈 
		    				addDropPop(true, ntwkLineNo, null, callGridIdForRing);
		    			}
		    		}
 				}
 		    }	 
 		});
 	}
	
}

/**
 * Function Name : openRingListPopForSubscription
 * Description   : 링 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : ntwkLineNm. 입력한 링 명  
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openRingListPopForSubscription(ntwkLineNm) {
	if(ntwkLineNm == undefined) ntwkLineNm = '';
	
	var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : ntwkLineNm, "topoLclCd" : "001", "topoSclCd" : '', "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
	
	$.extend(param,{"svlnLclCd": svlnLclCd});
	$.extend(param,{"svlnSclCd": svlnSclCd});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: 'RingListPop',
	  	title: '링리스트조회팝업',
	    url: urlPath+'/configmgmt/cfline/RingListBySubscriptionPop.do',
	    data: param,
	    iframe: true,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1200,
	    height : 700,
	    callback:function(data){
	    	if(data != null){
	    		
			}
	    }	 
	});
	
}


/**
 * Function Name 	: openNetworkPathPop
 * Description   	: 트렁크, WDM트렁크 선번 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 	: 
 *   editYn		 	: 수정가능 여부
 *   ntwkLineNo  	: 선번 번호
 *   searchDivision : 트렁크, WDM트렁크 구분
 *   btnPrevRemove	: 선번 팝업창에서 '이전' 버튼 유무
 *   useNetworkPathDirection : 네트워크 방향
 *   pathSameNo		: 선ID번
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openNetworkPathPop(editYn, ntwkLineNo, searchDivision, btnPrevRemove, useNetworkPathDirection, pathSameNo, gridId) {
	if(ntwkLineNo == null) return;
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;

	var param = {"ntwkLineNo" : ntwkLineNo, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno, "searchDivision" : searchDivision, "editYn" : editYn
						, "btnPrevRemove" : btnPrevRemove, "useNetworkPathDirection" : useNetworkPathDirection, "pathSameNo" : pathSameNo };
	
	/* ADAMS 연동 고도화 */
	//TODO 이전으로 20240911
	//if($("#mgmtGrpCd").val() == "0002") {
	//	if((topoSclCd == '030' || topoSclCd == '031')) {
	//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
		param.editYn = true;
	//} else {
	//	param.editYn = false;
	//}
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var popupName = $a.popup({
	  	url: urlPath+'/configmgmt/cfline/NetworkPathListPop.do',
	  	data: param,
	    windowpopup : true,
//	    other:'width=1100,height=700,scrollbars=yes,resizable=yes',
//		popid: 'NetworkPathListPop',
//	  	title: '선번',
//	    iframe: true,
//	    modal : true,
//	    movable : true,
	    width : 1100,
	    height : 700,
	    callback:function(data){
	    	cflineHideProgressBody();
	    	if(data != null) {
		    	if(data.prev == 'Y') {
					// 이전 
					$("#"+gridId).alopexGrid("endEdit");
		     	 	var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		     	 	$("#"+gridId).alopexGrid("startEdit");
		     	 	
		     	 	if(searchDivision == 'trunk') {
		     	 		if(String(focusData[0].TRUNK_MERGE).indexOf('alopex') == 0) {
		     	 			openTrunkListPop(eval("focusData[0]." + focusData[0]._key), searchDivision, 'Y');
			     	 	}
		     	 	} else if(searchDivision == 'wdm') {
		     	 		if(String(focusData[0].WDM_TRUNK_MERGE).indexOf('alopex') == 0) {
		     	 			openTrunkListPop(eval("focusData[0]." + focusData[0]._key), searchDivision, 'Y');
			     	 	}
		     	 	} else if(searchDivision == 'ring') {
		     	 		if(String(focusData[0].WDM_TRUNK_MERGE).indexOf('alopex') == 0) {
		     	 			openRingListPop(eval("focusData[0]." + focusData[0]._key), "Y", gridId);
			     	 	}
		     	 	}
				}  else {
					var getDataSize = data.length;
					var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
		    		
		    		// 검색을 위한 입력데이터 리셋
		    		var column = "";
		    		if(searchDivision == "wdm") {
		    			column = "WDM_TRUNK_NM"; 
		    		} else if(searchDivision == "trunk") {
		    			column = "TRUNK_NM"; 
		    		} else {
		    			column = "RING_NM";
		    		}
		    			 
		    		$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
		    		
		    		// 서비스 회선, 링 선번일 경우 상하위 리셋(링 : C00030(N) / 서비스 회선 : C00967(NA))
		    		if(gridDivision == "serviceLine") {
		    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    		} else if(gridDivision == "ring") {
		    			$('#'+gridId).alopexGrid('cellEdit', 'N', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			$('#'+gridId).alopexGrid('cellEdit', 'N', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    		}
 
		    		var deleteDataList = [];
		    		if(searchDivision == "trunk") {
		    			deleteDataList = $('#'+gridId).alopexGrid("dataGet", {"TRUNK_ID":ntwkLineNo}, "TRUNK_ID");
		    		} else if(searchDivision == "wdm") {
		    			deleteDataList = $('#'+gridId).alopexGrid("dataGet", {"WDM_TRUNK_ID":ntwkLineNo}, "WDM_TRUNK_ID");
		    		} else if(searchDivision == "ring") {
		    			deleteDataList = $('#'+gridId).alopexGrid("dataGet", {"RING_ID":ntwkLineNo}, "RING_ID");
		    		}
		    		
		    		/*
		    		 * 서비스회선의 기지국회선인 경우 트렁크의 정, 역방향을 변경해도
		    		 * 이전에 등록한 채널값이 유지되도록 개선
		    		 * 2021-06-03
		    		 */
		    		var deleteRowIndex = 0;
		    		var beforeChannelDataList = [];
		    		if(deleteDataList.length > 0) {
		    			lftChannelDesc = deleteDataList[0].LEFT_CHANNEL_DESCR;
		    			rightChannelDesc = deleteDataList[deleteDataList.length-1].RIGHT_CHANNEL_DESCR;
		    		}
		    		
		    		/*
		    		 * 트렁크및 링을 설정할때 한 ROW씩 삭제를 먼저 함
		    		 */
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;		    			
		    			$('#'+gridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
		    			rowIndex = deleteRowIndex;
		    		}
		    		/************************************************************************************
		    		 * LINK_DIRECTION 조합
		    		 * 1. USE_NETWORK_LINK_DIRECTION : 구간 방향
		    		 *     - 예) 서비스회선에서 트렁크를 사용했을때 트렁크의 LINK_DIRECTION이 RIGHT이면 RIGHT가 된다.
		    		 * 2. USE_NETWORK_PATH_DIRECTION : 사용 방향
		    		 *     - 예) 서비스회선에서 트렁크를 사용하는 방향
		    		 * 3. LINK_DIRECTION : USE_NETWORK_LINK_DIRECTION + USE_NETWORK_PATH_DIRECTION
		    		 *     - 예) 정 + 정 = 정, 역 + 정 = 역, 정 + 역 = 역, 역 + 역 = 정
		    		 *     
		    		 * 유형에 따른 LEFT_ADD_DROP_TYPE_CD, RIGHT_ADD_DROP_TYPE_CD 설정
		    		 * case 1. 시작 구간의 좌장비가 없고 우장비가 있다. 					(N / A)
		    		 *         through구간에는 장비가 존재하고 포트가 있을수도 없을수도 있다. 	(T / T)
		    		 *    	   마지막 구간이 좌장비가 있고 우장비가 없다.					(D / N)
		    		 * case 2. 시작 구간, through구간, 마지막구간에 모두 장비가 존재한다.
		    		 * -> 전부 변경.N/A, T/T, D/N
		    		 * 
		    		 * 인접 트렁크 설정
		    		 * 1. 비정형(SKB 요청) 인접 트렁크
		    		 *    - 이전 트렁크의 마지막 구간에서 좌장비가 있고 우장비가 없다.
		    		 *    - 새로 등록하는 트렁크의 시작 구간에서 좌장비가 없고 우장비가 있다.
		    		 *      → 블럭 합치기
		    		 * 2. 정형 인접 트렁크(트렁크와 트렁크)
		    		 *    - 이전 트렁크 전체와 비교하여 구간(장비, 포트)가 일치한 경우 새로 등록하는 트렁크의 구간은 미표시한다.
		    		 ************************************************************************************ 
		    		 */
		    		
		    		var lineData = $('#'+gridId).alopexGrid("dataGet");
		    		var adJoinId = "";
		    		var adJoinSctn = false;
		    		var linkArray = [];
		    		
		    		if(rowIndex > 0) {
		    			adJoinId = lineData[rowIndex-1].TRUNK_ID;
		    		}
		    		
		    		for(var i = 0; i < data.length; i++) {
		    			// LINK_DIRECTION
		    			var usePath = data[i].USE_NETWORK_PATH_DIRECTION; 
		    			var useLink = data[i].USE_NETWORK_LINK_DIRECTION;
		    			var link = 'RIGHT';
		    			if(usePath == 'RIGHT' && useLink == 'RIGHT') link = 'RIGHT';
		    			else if(usePath == 'RIGHT' && useLink == 'LEFT') link = 'LEFT';
		    			else if(usePath == 'LEFT' && useLink == 'RIGHT') link = 'LEFT';
		    			else if(usePath == 'LEFT' && useLink == 'LEFT') link = 'RIGHT';
		    			data[i].LINK_DIRECTION = link;
		    			data[i].RX_LINK_DIRECTION = link;
		    			
		    			// ADD, DROP 정의
//		    			if(i == 0) {
//		    				// 시작 구간
//		    				// 링과 트렁크, WDM트렁크 동일하게 변경. 17.04.20
//		    				data[i].LEFT_ADD_DROP_TYPE_CD = 'T';
//	    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'T';
//		    			} else if(i == (data.length-1)) {
////		    				// 마지막 구간
//		    				data[i].LEFT_ADD_DROP_TYPE_CD = 'T';
//	    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'T';
//		    			} else {
//		    				data[i].LEFT_ADD_DROP_TYPE_CD = 'T';
//	    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'T';
//		    			}
		    			
		    			data[i].LEFT_ADD_DROP_TYPE_CD = 'T';
    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'T';
		    			
		    			// 정형 인접 트렁크
		    			if(i == 0) {
		    				// 선택된 트렁크의 이전 구간이 트렁크인지 확인한다.
		    				if(adJoinId != "") {
		    					for(var adjCnt = 0; adjCnt < lineData.length; adjCnt++) {
		    						if(lineData[adjCnt].TRUNK_ID == adJoinId) {
		    							adJoinSctn = true;
		    							break;
		    						}
		    					}
		    				}
		    				/* 
				    		 * 서비스회선의 기지국회선인 경우 트렁크의 정, 역방향을 변경해도
				    		 * 이전에 등록한 채널값이 유지되도록 개선
				    		 * 2021-06-03
				    		 */
		    				if(initParam.mgmtGrpCd == '0001' && initParam.svlnLclCd == '001') {
		    					if(searchDivision == "trunk") {
		    						data[i].LEFT_CHANNEL_DESCR = lftChannelDesc;
		    					}
		    				}
		    			}
		    			
		    			/**
		    			 * lineData : 그리드 내의 데이터
		    			 * adJoinId : 인접트렁크 아이디
		    			 * data		: 선번 선택을 통해서 내린 데이터
		    			 */
		    			if(adJoinSctn) {
		    				for(var adjCnt = 0; adjCnt < lineData.length; adjCnt++) {
	    						if(lineData[adjCnt].TRUNK_ID == adJoinId) {
	    							// 이전 사용 네트워크가 트렁크 이면
	    							if(data[i].LINK_ID == lineData[adjCnt].LINK_ID) {
	    								// 현재 구간 ID와 그리드 내의 구간 ID가 동일 할 경우
	    								if(linkArray.length == 0 && i > 0) {
	    									// 선번 선택을 통해서 내린 데이터의 첫번째 구간 아이디가 이전 트렁크의 마지막 구간 아이디와 동일하지 않을 경우 pass
	    									break;
	    								} else if(linkArray.length == 0) {
	    									// 인접 구간 ID가 하나도 없을 경우 push
	    									linkArray.push(data[i].LINK_ID);
	    								} else if(data[i-1].LINK_ID == lineData[adjCnt-1].LINK_ID) {
	    									// 선번을 통해서 내린 이전 구간아이디와 그리드내의 이전 구간 아이디가 동일할 경우.
	    									linkArray.push(data[i].LINK_ID);
	    								} else {
	    									linkArray = [];
	    								}
	    							}
	    						}
	    					}
	    				}
		    			 
		    			// 채널 확인
		    			data[i].USE_NETWORK_LEFT_CHANNEL_DESCR  = data[i].LEFT_CHANNEL_DESCR;
		    			data[i].USE_NETWORK_RIGHT_CHANNEL_DESCR  = data[i].RIGHT_CHANNEL_DESCR;		    			

			   			// 2018-09-12  1. RU고도화 사용 서비스회선ID 정리
		    			data[i].SERVICE_ID = null;
		    			
		    			/* 
			    		 * 서비스회선중 기지국회선인 경우 트렁크의 정, 역방향을 변경해도
			    		 * 이전에 등록한 채널값이 유지되도록 개선
			    		 * 2021-06-03
			    		 */
	    				if(initParam.mgmtGrpCd == '0001' && initParam.svlnLclCd == '001') {
		    				if(searchDivision == "trunk") {
		    					if(i == (data.length-1)) {
			    					data[i].RIGHT_CHANNEL_DESCR = rightChannelDesc;
			    				}
			    			}
	    				}
		    		}
		    		
		    		for(var i = data.length-1; i--;) {
		    			for(var j = 0; j < linkArray.length; j++) {
		    				if( data[i].LINK_ID == linkArray[j] ) {
		    					data.splice(i, 1);
		    				}
		    			}
		    		}
		    		
		    		/**
		    		 * WDM트렁크일 경우 ADD, DROP을 제외하고 LINK_VISIBLE을 false로 설정
		    		 *  - LEFT_ADD_DROP_TYPE_CD : A, RIGHT_ADD_DROP_TYPE_CD : N
		    		 *  - LEFT_ADD_DROP_TYPE_CD : N, RIGHT_ADD_DROP_TYPE_CD : D
		    		 */ 
//		    		if(searchDivision == "wdm" && data.length > 2) {
//		    			for(var i = 0; i < data.length; i++) {
//		    				if(i == 0) {
//		    					data[i].LINK_VISIBLE = true;
//		    				} else if(i == data.length-1) {
//		    					data[i].LINK_VISIBLE = true;
//		    				} else {
//		    					data[i].LINK_VISIBLE = false;
//		    				}
//		    			}
//		    		} else {
//		    			for(var i = 0; i < data.length; i++) {
//		    				data[i].LINK_VISIBLE = true;
//		    			}
//		    		}
//		    		if(searchDivision == "wdm" && data.length > 2) {
//		    			var length = data.length;
//		    			data.splice(1, (data.length-2));
//		    		}

		    		// 선번 셋팅
		    		setPathNetwork(data, rowIndex, getDataSize, gridId);
					
					var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					// row 추가
					if( ( nullToEmpty(focusData.SERVICE_ID) == "" // 2018-09-12  3. RU고도화
						&& nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
							&& (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
	    					&& (nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
						if((lastData.SERVICE_ID != null // 2018-09-12  3. RU고도화
								|| lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
							|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(gridId);
						} else {
							// 셀 병합을 위해서 임의로 row 추가 후 삭제. 방안 찾을 것
							addRowNullData(gridId);
							$('#'+gridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex}});
						}
					}
					
		    		$('#'+gridId).alopexGrid('startEdit');
		    		orgChk(gridId);
				}
	    	}
	    }	  
	});
}

/**
 * Function Name : openServiceLineSearchPop(서비스회선 조회 팝업)
 * @param serviceLineNm : 서비스회선명
 * 
 */
function openServiceLineSearchPop(division, schVal, serviceId, callDataObj) {
	
	if (isRuCoreLineOld() == false && isRuMatchLineOld() == false) {
		alertBox('W', "광코어/중계기정합장치 회선만 서비스회선을 참조 사용가능합니다.");
		return;
	}
	
	var dataObj = AlopexGrid.parseEvent(event); 
	var gridId = dataObj.$grid.attr("id");
	var popHeight = 0;
	
	if(nullToEmpty(serviceId) != "") {
		popHeight = 600;
	} else {
		popHeight = 760;
	}
	
	//var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : serviceLineNm, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
	var param = {"vTmofInfo" : vTmofInfo, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val()), "serviceId" : nullToEmpty(serviceId), "editSvlnNo" : baseNtwkLineNo, "srchSvlnNm" : schVal};
	
	if(division == "serviceLine") {
		$.extend(param,{"svlnLclCd": svlnLclCd});
		$.extend(param,{"svlnSclCd": svlnSclCd});
	}
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	if(division == "serviceline") {
 		$a.popup({
		  	popid: 'UseServiceLineSearchPop',
		  	title: '서비스회선조회팝업',
		    url: urlPath+'/configmgmt/cfline/UseServiceLineSearchPop.do',
		    data: param,
		    iframe: true,
		    modal : true,
		    movable : true,
		    windowpopup : true,
		    width : 1300,
		    height : popHeight,
		    callback:function(data){
 		    	if(data != null){
 		    		
 		    		if (isRuCoreLineOld() == false && isRuMatchLineOld() == false) {
 		    			alertBox('W', "광코어/중계기정합장치 회선만 서비스회선을 참조 사용가능합니다.");
 		    			return;
 		    		}
 		    		
 		    		// 이미 사용서비스회선정보가 있는지
 		    		var chkDataObj = $('#'+gridId).alopexGrid("dataGet", function (data) { 
 		    							return (nullToEmpty(data["SERVICE_ID"]) != '' && nullToEmpty(data["SERVICE_ID"]).indexOf("alopex") != 0) ;
 		    				 		});
 		    		
 		    		if (chkDataObj.length > 0) {
 		    			var msg = "이미 사용서비스회선이 설정되어 있습니다. <br>서비스회선 참조는 회선당 1개의 서비스회선만 참조가능합니다.";
		    			alertBox('W', msg); 
		    			// 다른 팝업에 영향을 주지않기 위해
		 				$.alopex.popup.result = null; 
		    			return;
 		    		}
 		    		
 		    		var chkSvlnNo = "";
 		    		if (data.length > 0) {
 		    			chkSvlnNo = data[0].SERVICE_ID;
 		    		} else {
 		    			chkSvlnNo = data.SERVICE_ID;
 		    		}
 		    		chkDataObj = $('#'+gridId).alopexGrid("dataGet", {'SERVICE_ID' :chkSvlnNo}, 'SERVICE_ID');		    		
		    		
 		    		// 중복설정인지
		    		if(chkDataObj.length > 0) {
		    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
		    			alertBox('W', msg); 
		    			// 다른 팝업에 영향을 주지않기 위해
		 				$.alopex.popup.result = null; 
		    			return;
		    		}
		    		
		    		cflineShowProgressBody();
 		    		
 		    		//openNetworkPathPop 참조하여 구현
 		    		var getDataSize = data.length;
 		    		var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
		    		
		    		// 검색을 위한 입력데이터 리셋
		    		var column = "SERVICE_NM";
		    			 
		    		$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
		    		
		    		// 서비스 회선일 경우 상하위 리셋( 서비스 회선 : C00967(NA))
		    		if(gridDivision == "serviceLine") {
		    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    		}
 
		    		var deleteDataList =  $('#'+gridId).alopexGrid("dataGet", {"SERVICE_ID":serviceId}, "SERVICE_ID");
		    		
		    		var deleteRowIndex = 0;
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
		    			$('#'+gridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
		    			rowIndex = deleteRowIndex;
		    		}
		    		
		    		/************************************************************************************
		    		 * LINK_DIRECTION 조합 <= 서비스회선은 정방향만 됨
		    		 * 1. USE_NETWORK_LINK_DIRECTION : 구간 방향
		    		 *     - 예) 서비스회선에서 트렁크를 사용했을때 트렁크의 LINK_DIRECTION이 RIGHT이면 RIGHT가 된다.
		    		 * 2. USE_NETWORK_PATH_DIRECTION : 사용 방향
		    		 *     - 예) 서비스회선에서 트렁크를 사용하는 방향
		    		 * 3. LINK_DIRECTION : USE_NETWORK_LINK_DIRECTION + USE_NETWORK_PATH_DIRECTION
		    		 *     - 예) 정 + 정 = 정, 역 + 정 = 역, 정 + 역 = 역, 역 + 역 = 정
		    		 *     
		    		 * 유형에 따른 LEFT_ADD_DROP_TYPE_CD, RIGHT_ADD_DROP_TYPE_CD 설정
		    		 * case 1. 시작 구간의 좌장비가 없고 우장비가 있다. 					(N / A)
		    		 *         through구간에는 장비가 존재하고 포트가 있을수도 없을수도 있다. 	(T / T)
		    		 *    	   마지막 구간이 좌장비가 있고 우장비가 없다.					(D / N)
		    		 * case 2. 시작 구간, through구간, 마지막구간에 모두 장비가 존재한다.
		    		 * -> 전부 변경.N/A, T/T, D/N
		    		 * 
		    		 * 인접 트렁크 설정
		    		 * 1. 비정형(SKB 요청) 인접 트렁크
		    		 *    - 이전 트렁크의 마지막 구간에서 좌장비가 있고 우장비가 없다.
		    		 *    - 새로 등록하는 트렁크의 시작 구간에서 좌장비가 없고 우장비가 있다.
		    		 *      → 블럭 합치기
		    		 * 2. 정형 인접 트렁크(트렁크와 트렁크)
		    		 *    - 이전 트렁크 전체와 비교하여 구간(장비, 포트)가 일치한 경우 새로 등록하는 트렁크의 구간은 미표시한다.
		    		 ************************************************************************************ 
		    		 */
		    		
		    		var lineData = $('#'+gridId).alopexGrid("dataGet");
		    		var adJoinId = "";
		    		var adJoinSctn = false;
		    		var linkArray = [];
		    		
		    		if(rowIndex > 0) {
		    			adJoinId = lineData[rowIndex-1].TRUNK_ID;
		    		}
		    		
		    		for(var i = 0; i < data.length; i++) {
		    			// LINK_DIRECTION
		    			data[i].LINK_DIRECTION = data[i].USE_NETWORK_LINK_DIRECTION;
		    			data[i].RX_LINK_DIRECTION = data[i].USE_NETWORK_LINK_DIRECTION;
		    			
		    			data[i].LEFT_ADD_DROP_TYPE_CD = 'T';
    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'T';
		    			
		    			// 정형 인접 트렁크
		    			if(i == 0) {
		    				// 선택된 트렁크의 이전 구간이 트렁크인지 확인한다.
		    				if(adJoinId != "") {
		    					for(var adjCnt = 0; adjCnt < lineData.length; adjCnt++) {
		    						if(lineData[adjCnt].TRUNK_ID == adJoinId) {
		    							adJoinSctn = true;
		    							break;
		    						}
		    					}
		    				}
		    			}
		    			
		    			/**
		    			 * lineData : 그리드 내의 데이터
		    			 * adJoinId : 인접트렁크 아이디
		    			 * data		: 선번 선택을 통해서 내린 데이터
		    			 */
		    			if(adJoinSctn) {
		    				for(var adjCnt = 0; adjCnt < lineData.length; adjCnt++) {
	    						if(lineData[adjCnt].TRUNK_ID == adJoinId) {
	    							// 이전 사용 네트워크가 트렁크 이면
	    							if(data[i].LINK_ID == lineData[adjCnt].LINK_ID) {
	    								// 현재 구간 ID와 그리드 내의 구간 ID가 동일 할 경우
	    								if(linkArray.length == 0 && i > 0) {
	    									// 선번 선택을 통해서 내린 데이터의 첫번째 구간 아이디가 이전 트렁크의 마지막 구간 아이디와 동일하지 않을 경우 pass
	    									break;
	    								} else if(linkArray.length == 0) {
	    									// 인접 구간 ID가 하나도 없을 경우 push
	    									linkArray.push(data[i].LINK_ID);
	    								} else if(data[i-1].LINK_ID == lineData[adjCnt-1].LINK_ID) {
	    									// 선번을 통해서 내린 이전 구간아이디와 그리드내의 이전 구간 아이디가 동일할 경우.
	    									linkArray.push(data[i].LINK_ID);
	    								} else {
	    									linkArray = [];
	    								}
	    							}
	    						}
	    					}
	    				}
		    			 
		    			// 채널 확인
		    			data[i].USE_NETWORK_LEFT_CHANNEL_DESCR  = data[i].LEFT_CHANNEL_DESCR;
		    			data[i].USE_NETWORK_RIGHT_CHANNEL_DESCR  = data[i].RIGHT_CHANNEL_DESCR;
		    		}
		    		
		    		console.log("gridDivision 2 == > " + gridDivision);
		    		console.log("svlnLclCd 2 == > " + svlnLclCd);
		    		console.log("svlnSclCd 2 == > " + svlnSclCd);
		    		
		    		// 선번 셋팅
		    		setPathNetwork(data, rowIndex, getDataSize, gridId);
		    		
		    		var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					// row 추가
					if( ( nullToEmpty(focusData.SERVICE_ID) == "" && nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
							&& (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
	    					&& (nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
						if((lastData.SERVICE_ID != null || lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
							|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(gridId);
						} else {
							// 셀 병합을 위해서 임의로 row 추가 후 삭제. 방안 찾을 것
							addRowNullData(gridId);
							$('#'+gridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex}});
						}
					}
					cflineHideProgressBody();
		    		$('#'+gridId).alopexGrid('startEdit');
		    		orgChk(gridId);
 		    	} 		    	

 				// 다른 팝업에 영향을 주지않기 위해
 				$.alopex.popup.result = null; 
		    }	 
		});
	}
}

/**
 * 
 * 서비스회선, 트렁크, wdm트렁크 선번
 * 
 * @param data
 * @param rowIndex
 * @param getDataSize
 */
function setPathNetwork(data, rowIndex, getDataSize, gridId) {

	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	var columnList = ["_NE_ID"];
	var addData1 = {};
	// 선번 넣기
	for(var i = 0; i < data.length; i++) {
		var emptyData = {};
		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index:{data : rowIndex+i}});
		
		if(rowIndex > 0) {
				var prevData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex - 1 }})[0];
				
//				console.log("LEFT_NE_ID: "+data[i].LEFT_NE_ID);
//				console.log("RIGHT_NE_ID: "+data[i].RIGHT_NE_ID);
//				console.log("========================================= ");
				if(nullToEmpty(data[0].LEFT_NE_ID) == "" || data[0].LEFT_NE_ID == "DV00000000000") {
					if(nullToEmpty(prevData.RIGHT_NE_ID) != "" && prevData.RIGHT_NE_ID != "DV00000000000") {
						data[0].LEFT_NE_ID = prevData.RIGHT_NE_ID;
						data[0].LEFT_NE_NM = prevData.RIGHT_NE_NM;	
						if(nullToEmpty(data[0].USE_NETWORK_NM) == null || data[0].USE_NETWORK_NM == null) {
							data[0].USE_NETWORK_ID = null;
							data[0].TRUNK_ID = null;
						}
						console.log("LEFT_NE_ID: "+data[0].LEFT_NE_ID);
						console.log("LEFT_NE_NM: "+data[0].LEFT_NE_NM);
					}
				}
				
	//			if(nullToEmpty(prevData.RIGHT_NE_ID) == "" || prevData.RIGHT_NE_ID == "DV00000000000") {
	//				if(nullToEmpty(data[0].LEFT_NE_ID) == "" || data[0].LEFT_NE_ID == "DV00000000000") {
	//					data[0].LEFT_NE_ID = prevData.RIGHT_NE_ID;
	//					data[0].LEFT_NE_NM = prevData.RIGHT_NE_NM;
	//				}
					
					// 병합
//					var currDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
//					var prevDataObjList = AlopexGrid.trimData(prevData);
//					var currDataObjList = AlopexGrid.trimData(currDataObj);
//					
//					if((nullToEmpty(currDataObjList.LEFT_NE_ID) == "" || currDataObjList.LEFT_NE_ID == "DV00000000000")  
//							&& (nullToEmpty(prevDataObjList.RIGHT_NE_ID) == "" || prevDataObjList.RIGHT_NE_ID == "DV00000000000")) {
//	//					for(var key in prevDataObjList) {
//	//						if(key.indexOf("RIGHT") == 0) {
//	//							$('#'+gridId).alopexGrid( "cellEdit", eval("currDataObjList."+key), {_index : { row : addRowIndex}}, key);
//	//						}
//	//					}
//						if(i == 0) {
//							data[0].LEFT_NE_ID = prevData.LEFT_NE_ID;
//							data[0].LEFT_NE_NM = prevData.LEFT_NE_NM;
//							data[0].USE_NETWORK_ID = '';
//							
//		
//							$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex - 1}});
//							
//							for(var key in data[i]) {
//								$('#'+gridId).alopexGrid( "cellEdit", eval("data[i]."+key), {_index : { row : rowIndex+i}}, key);
//							} //for
//						} //if
//	
//					} //if
		//		} //if
		} //if

		console.log("=========== " + ":" + i);
		console.log("LEFT_NE_ID: "+data[i].LEFT_NE_ID);
		console.log("RIGHT_NE_ID: "+data[i].RIGHT_NE_ID);
		console.log("========================================= ");

		for(var key in data[i]) {
			$('#'+gridId).alopexGrid( "cellEdit", eval("data[i]."+key), {_index : { row : rowIndex+i}}, key);
		}
		
	}
	

	if(gridDivision == "serviceLine" && svlnLclCd != "001") {
	/* add : 이전 구간의 east가 없을 경우 구간 합치기
	 * 첫구간에서 선번을 선택할 경우 add구간은 그냥 넣는다.
	 * 그 외의 구간에서 선번을 선택할경우 
	 *    - 윗 구간의 우장비가 비어있을 경우 add장비 셋팅
	 *    - 비어 있지 않을 경우 add구간 생성
	 */
	var neColumnList = [  
	                    "_JRDT_TEAM_ORG_ID", "_JRDT_TEAM_ORG_NM", "_OP_TEAM_ORG_ID", "_OP_TEAM_ORG_NM", "_ORG_ID_L3", "_ORG_NM_L3"
	                    , "_ORG_ID", "_ORG_NM", "_MODEL_LCL_CD", "_MODEL_LCL_NM", "_MODEL_MCL_CD", "_MODEL_MCL_NM"
	                    , "_MODEL_SCL_CD", "_MODEL_SCL_NM", "_MODEL_ID", "_MODEL_NM", "_VENDOR_ID", "_VENDOR_NM"
	                    , "_NE_ID", "_NE_NM", "_NE_STATUS_CD", "_NE_STATUS_NM", "_NE_DUMMY", "_NE_ROLE_CD", "_NE_ROLE_NM", "_NE_REMARK"
	                    ];
	var addRowIndex = 0;
	var addRowCnt = 0;
	if(rowIndex > 0) {
		var prevData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex - 1 }})[0];
		if(nullToEmpty(prevData.RIGHT_NE_ID) == "" || prevData.RIGHT_NE_ID == "DV00000000000") {
			if(nullToEmpty(prevData.SERVICE_ID) != "" && // 2018-09-12  3. RU고도화
				nullToEmpty(prevData.TRUNK_ID) != "" && nullToEmpty(prevData.RING_ID) != "" && nullToEmpty(prevData.WDM_TRUNK_ID) != "") {
				// 다른 사용네트이크 이면 add
				var emptyData = {};
				addRowIndex = rowIndex;
//				addRowIndex = rowIndex -1;
				addRowCnt++;
	    		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
			} else {
				addRowIndex = rowIndex -1;
			}
		} else if(prevData.RIGHT_NE_ID == data[0].LEFT_NE_ID) {
			addRowIndex = rowIndex -1;
		} else if(prevData.RIGHT_NE_ID != data[0].LEFT_NE_ID && prevData.RIGHT_NE_ID == data[data.length-1].RIGHT_NE_ID) {
			// 동일 사용네트워크이면 셋팅. 아니면 ADD
			addRowIndex = rowIndex -1;
		} else {
			var emptyData = {};
			addRowIndex = rowIndex;
//			addRowIndex = rowIndex -1;
			addRowCnt++;
    		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
		}
	} else {
		var emptyData = {};
//		addRowIndex = rowIndex;
		addRowCnt++;
		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
	}
	
	var addData = {};
	
	for(var i = 0; i < neColumnList.length; i++) {
		for(var key in data[0]) {
			if(key.indexOf("LEFT") == 0) {
				if("LEFT" + neColumnList[i] == key) {
					var length = key.length;
					eval("addData.RIGHT" + key.substring(4, length) + " = data[0]." + key);
				} 
			}
		}
	}
	addData.LEFT_ADD_DROP_TYPE_CD = 'N';
	addData.RIGHT_ADD_DROP_TYPE_CD = 'A';
	
	for(var key in addData) {
		$('#'+gridId).alopexGrid( "cellEdit", eval("addData."+key), {_index : { row : addRowIndex}}, key);
	}
	
	// 
	/* 다음 구간의 west가 없을 경우 구간 합치기
	 * 마지막 구간의 다음구간 좌장비가 없을 경우
	 *   - 그냥 넣어준다
	 * 마지막 구간의 다음구간 좌장비가 있을 경우 
	 *   - row 추가 후 넣어준다
	 * 맨 마지막 구간에서 선번을 선택했을 경우
	 *   - row 추가 후 넣어준다.
	 */
	var addRowIndex = 0;
	var nextData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex + getDataSize + addRowCnt}})[0];
	// 2018-09-12  3. RU고도화
	if(nextData.SERVICE_ID == null || 
			nextData.TRUNK_ID == null || nextData.RING_ID == null || nextData.WDM_TRUNK_ID == null) {
		addRowIndex = rowIndex + getDataSize + addRowCnt;
		if(addRowIndex == $('#'+gridId).alopexGrid("dataGet").length -1) {
		
		}
	} else {
		var emptyData = {};
		addRowIndex = rowIndex + getDataSize + addRowCnt +1;
		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
	}
	
	var dropData = {};
	for(var i = 0; i < neColumnList.length; i++) {
		for(var key in data[data.length-1]) {
			if(key.indexOf("RIGHT") == 0) {
				if("RIGHT" + neColumnList[i] == key) {
    				var length = key.length;
    				eval("dropData.LEFT" + key.substring(5, length) + " = data[data.length-1]." + key);
				}
			}
		}
	}
	
	dropData.LEFT_ADD_DROP_TYPE_CD = 'D';
	dropData.RIGHT_ADD_DROP_TYPE_CD = 'N';
	
	for(var key in dropData) {
		$('#'+gridId).alopexGrid( "cellEdit", eval("dropData."+key), {_index : { row : addRowIndex}}, key);  // <-- 맨 아래 한줄 더 생기면서 right장비가 west에 복사됨 
	}

	// 병합
	var nextDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:addRowIndex + 1 }})[0];
	var currDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:addRowIndex }})[0];
	var nextDataObjList = AlopexGrid.trimData(nextDataObj);
	var currDataObjList = AlopexGrid.trimData(currDataObj);
	
	if(currDataObjList.RIGHT_NE_ID == null && nextDataObjList.LEFT_NE_ID == null) {
		for(var key in nextDataObjList) {
			if(key.indexOf("RIGHT") == 0) {
				$('#'+gridId).alopexGrid( "cellEdit", eval("nextDataObjList."+key), {_index : { row : addRowIndex}}, key);
			}
		}
		
		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:addRowIndex + 1 }});
	}
	}
	
//	$('#'+detailGridId).alopexGrid('refreshCell', {_index: {row: addRowIndex}}, 'TRUNK_NM');
	
	/* 2018-09-12  3. RU고도화 */ 
	setChangedMainPath(gridId);
}

/**
 * Function Name : addDropPop
 * Description   : 링구성도 팝업창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : editYn
 *                 callGridIdForRing. 링 호출한 Grid
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function addDropPop(editYn, ntwkLineNo, useNetworkPathDirection, callGridIdForRing) {
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	if (typeof callGridIdForRing == "undefined" || callGridIdForRing == "" || callGridIdForRing == null) {
		callGridIdForRing = detailGridId;
	}

	var ringExtYn = "";
	//2020-07-06 서비스회선의 예비선번클릭시 cmux확장형 링이 포함된 경우
	if(callGridIdForRing == "reservePathList") {
		var data = reserveGrid;
		var links = $('#'+data).alopexGrid('dataGet');
		
		if(searchExt(links)){
			ringExtYn = "Y";
		}
	}
	
	cflineShowProgressBody();
	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
	var params = {"ntwkLineNo" : ntwkLineNo, "editYn" : editYn, "useNetworkPathDirection" : useNetworkPathDirection
					, "zIndex":zIndex, "target":"Alopex_Popup_selectAddDrop", "ringExtYn":ringExtYn};
	
	/* ADAMS 연동 고도화 */
	//TODO 이전으로 20240911
	//if($("#mgmtGrpCd").val() == "0002") {
	//	if((topoSclCd == '030' || topoSclCd == '031')){
//	if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
		params.editYn = "Y";
	//} else {
	//	params.editYn = "N";
	//}

	// 링 데이터 가져오기(T)
	var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
	var rowIndex = focusData[0]._index.row;
	var dataList = $('#'+callGridIdForRing).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE").member;
	var ringDataList = [];
	
	// ADD
	var addData = "";
	// ADD 구간 가져오기
	addData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : rowIndex -1});
	ringDataList.push(addData);
	
	// THROUGH
	for(var i = 0; i < dataList.length; i++) {
		ringDataList.push(dataList[i]);
	}
	
	// DROP
	var dropData = "";
	var lastIdx = dataList.length-1;
	// DROP 구간 가져오기
	dropData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : rowIndex + (lastIdx+1)});
	ringDataList.push(dropData);
	
	if(ringDataList.length > 1) {
		$.extend(params,{"dataList":AlopexGrid.trimData(ringDataList)});
	}

	$a.popup({
    	popid: "selectAddDrop",
		title: "링 ADD DROP",
		url: urlPath+'/configmgmt/cfline/RingAddDropPop.do',
		data: params,
		iframe: true,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 850,
		callback:function(data){
			cflineHideProgressBody();
			if(data != null) {
				if(data.prev == 'Y') {
					// 이전 					
					$("#"+callGridIdForRing).alopexGrid("endEdit");					
		     	 	var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
		     	 	$("#"+callGridIdForRing).alopexGrid("startEdit");
		     	 	
		     	 	if(String(focusData[0].RING_MERGE).indexOf('alopex') == 0) {
		     	 		openRingListPop(eval("focusData[0]." + focusData[0]._key), "Y", callGridIdForRing);
		     	 	}
				} else {
					var getDataSize = data.length;
					var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
					
		    		// 검색을 위한 입력데이터 리셋
		    		$('#'+callGridIdForRing).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RING_NM");
	    			
		    		// 동일한 링구간 삭제
		    		var deleteDataList = $('#'+callGridIdForRing).alopexGrid("dataGet", {"RING_ID":ntwkLineNo}, "RING_ID");
		    		var deleteRowIndex = 0;
		    		
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
	    				$('#'+callGridIdForRing).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
		    			rowIndex = deleteRowIndex;
		    		}
		    		
		    		// 선번 넣기
		    		setPathRing(data, rowIndex, getDataSize, callGridIdForRing);
					
					var lastRowIndex = $('#'+callGridIdForRing).alopexGrid("dataGet").length;
					var lastData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					//var lastData = $('#'+callGridIdForRing).alopexGrid("dataGet", {row : lastRowIndex -1});
					// row 추가
					if( (focusData.SERVICE_ID == null && // 2018-09-12  3. RU고도화
							focusData.TRUNK_ID == null && focusData.RING_ID == null && focusData.WDM_TRUNK_ID == null)
							&& (focusData.LEFT_NE_ID == null || focusData.LEFT_NE_NM == null) 
	    					&& (focusData.RIGHT_NE_ID == null || focusData.RIGHT_NE_NM == null)) {
						if((lastData.SERVICE_ID != null || // 2018-09-12  3. RU고도화
								lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
							|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(callGridIdForRing);
						}
					}
					
		    		$('#'+callGridIdForRing).alopexGrid('startEdit');
		    		orgChk(callGridIdForRing);
				}
			}
		}
    });
}

/**
 * 링 선번
 * 
 * @param data
 * @param rowIndex
 * @param getDataSize
 */
function setPathRing(addRingdata, rowIndex, getDataSize, gridId) {
	// 2018-03-05 RU 광코어 예비선번 링 편집 
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	// 선번 넣기
	getDataSize = getDataSize - 2;
	var pathList = [];
	var addData = {};
	var dropData = {};
	
	// 첫구간과 마지막 구간이 ADD/DROP장비가 맞는지 확인 해서  추출 하도록 수정
	for(var i = 0; i < addRingdata.length; i++) {
		if(i == 0 && nullToEmpty(addRingdata[0].RING_ID) == "") {
			for(var key in addRingdata[0]) {
				if(key.indexOf("RIGHT") == 0) {
					eval("addData." + key + " = addRingdata[0]." + key);
				} 
			}
			addData.LEFT_ADD_DROP_TYPE_CD = 'N';
			addData.RIGHT_ADD_DROP_TYPE_CD = 'A';
			addData.RIGHT_NODE_ROLE_CD = 'N';
		} else if( i == (addRingdata.length-1) && nullToEmpty(addRingdata[addRingdata.length-1].RING_ID) == "") {
			for(var key in addRingdata[addRingdata.length-1]) {
				if(key.indexOf("LEFT") == 0) {
					eval("dropData." + key + " = addRingdata[addRingdata.length-1]." + key);
				}
			}
			
			dropData.LEFT_ADD_DROP_TYPE_CD = 'D';
			dropData.LEFT_NODE_ROLE_CD = 'N';
			dropData.RIGHT_ADD_DROP_TYPE_CD = 'N';
		} else {
			pathList.push(addRingdata[i]);			
		}
	}
	

	    /*
		// 아래의 소스로 링 선번 변경 시 링의 마지막 Through 구간이 병합되지 않아
		// 다시 링 Add/Drop 변경 시 UI 상 링이 깨지는 오류가 발생한다.
		// dataAdd 메서드로 직접 넣도록 변경*/
	    var pathListCnt = pathList.length;
		for(var i = 0; i < pathList.length; i++) {
			$('#'+gridId).alopexGrid('dataAdd', pathList[i], {_index:{data : rowIndex+i}});
		}
	
		/*	
		for(var i = 0; i < pathList.length; i++) {
			var emptyData = {};
			$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index:{data : rowIndex+i}});
			
			for(var key in pathList[i]) {
				$('#'+gridId).alopexGrid( "cellEdit", eval("pathList[i]."+key), {_index : { row : rowIndex+i}}, key);
			}
		}
		 */
	
	var addRowIndex = 0;
	var addRowCnt = 0;
	
	/* add : 이전 구간의 east가 없을 경우 구간 합치기
	 * 첫구간에서 선번을 선택할 경우 add구간은 그냥 넣는다.
	 * 그 외의 구간에서 선번을 선택할경우 
	 *    - 윗 구간의 우장비가 비어있을 경우 add장비 셋팅
	 *    - 비어 있지 않을 경우 add구간 생성
	 */
	if(rowIndex > 0) {
		var prevData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex - 1 }})[0];
		if(nullToEmpty(prevData.RIGHT_NE_ID) == "" || prevData.RIGHT_NE_ID == "DV00000000000") {
			// 2018-09-12  3. RU고도화
			if(nullToEmpty(prevData.SERVICE_ID) != "" 
				|| nullToEmpty(prevData.TRUNK_ID) != "" || nullToEmpty(prevData.RING_ID) != "" || nullToEmpty(prevData.WDM_TRUNK_ID) != "") {
				// 다른 사용네트이크 이면 add
				var emptyData = {};
				addRowIndex = rowIndex;
//				addRowIndex = rowIndex -1;
				addRowCnt++;
	    		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
			} else {
				addRowIndex = rowIndex -1;
				
			}
		} else if(prevData.RIGHT_NE_ID == pathList[0].LEFT_NE_ID) {
			addRowIndex = rowIndex -1;
			
			// 설정되어 있던 정보  유지 하고 단지  ADD/DROP 타입만 설정			
			for(var key in prevData) {
				if(key.indexOf("RIGHT") == 0) {
					eval("addData." + key + " = prevData." + key);
				} 
			}
			addData.LEFT_ADD_DROP_TYPE_CD = 'N';
			addData.RIGHT_NODE_ROLE_CD = 'A';
			addData.RIGHT_NE_ROLE_CD = 'N';
		} 
		// 이전구간의 EAST장비와 링의 첫구간 WEST 장비가 다르고 이전구간 EAST장비와 링의 마지막구간 EAST장비가 같으면 구간 뒤집기로 판별하고 
		// 이전구간의 EAST장비에 링의 ADD장비를 덮어 씌운다
		else if(prevData.RIGHT_NE_ID != pathList[0].LEFT_NE_ID && prevData.RIGHT_NE_ID == pathList[pathList.length-1].RIGHT_NE_ID) {
			// 동일 사용네트워크이면 셋팅. 아니면 ADD
			addRowIndex = rowIndex -1;
		} 
		// 이전구간 EAST장비가 링의 첫구간 WEST/마지막구간 EAST장비와 다르면 다른 링으로 판별 하고 구간을 추가하여 ADD장비를 셋팅한다
		else {
			var emptyData = {};
			addRowIndex = rowIndex;
//			addRowIndex = rowIndex -1;
			addRowCnt++;
    		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
		}
	} else {
		var emptyData = {};
//		addRowIndex = rowIndex;
		addRowCnt++;
		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
	}
	
	
	for(var key in addData) {
		$('#'+gridId).alopexGrid( "cellEdit", eval("addData."+key), {_index : { row : addRowIndex }}, key);
	}
	
	var addRowIndex = 0;
	// 
	/* 다음 구간의 west가 없을 경우 구간 합치기
	 * 마지막 구간의 다음구간 좌장비가 없을 경우
	 *   - 그냥 넣어준다
	 * 마지막 구간의 다음구간 좌장비가 있을 경우 
	 *   - row 추가 후 넣어준다
	 * 맨 마지막 구간에서 선번을 선택했을 경우
	 *   - row 추가 후 넣어준다.
	 */
	
	var nextData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex + getDataSize + addRowCnt}})[0];
	// 2018-09-12  3. RU고도화
	if(nextData.SERVICE_ID == null 
			|| nextData.TRUNK_ID == null || nextData.RING_ID == null || nextData.WDM_TRUNK_ID == null) {
		addRowIndex = rowIndex + getDataSize + addRowCnt;
		// DROP장비를 설정할 경우 마지막 구간이 아닌경우
		if(addRowIndex < $('#'+gridId).alopexGrid("dataGet").length -1) {
			// 다음구간 WEST장비가 링의 첫구간 WEST/마지막구간 EAST장비와 다르면 다른 링으로 판별 하고 구간을 추가하여 ADD장비를 셋팅한다
			if (nextData.LEFT_NE_ID != pathList[0].LEFT_NE_ID && nextData.LEFT_NE_ID != pathList[pathList.length-1].RIGHT_NE_ID) {
				var emptyData = {};
				addRowIndex = rowIndex + getDataSize + addRowCnt ;
				$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
			} else if(nextData.LEFT_NE_ID == pathList[pathList.length-1].RIGHT_NE_ID) {
				for(var key in nextData) {
					if(key.indexOf("LEFT") == 0) {
						eval("dropData." + key + " = nextData." + key);
					}
				}
				
				dropData.LEFT_ADD_DROP_TYPE_CD = 'D';
				dropData.LEFT_NODE_ROLE_CD = 'N';
				dropData.RIGHT_ADD_DROP_TYPE_CD = 'N';
			}
		}
	} else {
		var emptyData = {};
		addRowIndex = rowIndex + getDataSize + addRowCnt +1;
		$('#'+gridId).alopexGrid('dataAdd', emptyData, {_index: {data : addRowIndex}});
	}
	
	for(var key in dropData) {
		$('#'+gridId).alopexGrid( "cellEdit", eval("dropData."+key), {_index : { row : addRowIndex}}, key);
	}

	// 병합
	var nextDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:addRowIndex + 1 }})[0];
	var currDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:addRowIndex }})[0];
	var nextDataObjList = AlopexGrid.trimData(nextDataObj);
	var currDataObjList = AlopexGrid.trimData(currDataObj);
	
	if(currDataObjList.RIGHT_NE_ID == null && nextDataObjList.LEFT_NE_ID == null) {
		for(var key in nextDataObjList) {
			if(key.indexOf("RIGHT") == 0) {
				$('#'+gridId).alopexGrid( "cellEdit", eval("nextDataObjList."+key), {_index : { row : addRowIndex}}, key);
			}
		}
		
		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:addRowIndex + 1 }});
	}
	
	/* 2018-09-12  3. RU고도화 */ 
	setChangedMainPath(gridId);
}


/**
 * 2019-09-30  5. 기간망 링 선번 고도화
 * Function Name : openUseRingRontTrunkSearchPop(링_기간망트렁크 조회 팝업)
 * 2020-05-18 10. SMUX링 경유링 사용 (topoSclCd = 035)
 * 2020-08-03 11. 가입자망링 경유링 사용 (topoSclCd = 031)
 * @param 
 * 
 */
function openUseRingRontTrunkSearchPop(division, schVal, ringId, callDataObj) {
	
	if (typeof gridId == "undefined" || gridId == null || gridId == "" || gridId == "null") {
		gridId = detailGridId;
	}
	var editYn = $('#'+gridId).alopexGrid("readOption").cellInlineEdit;
	
	/* ADAMS 연동 고도화 */
	//TODO 이전으로 20240911
//	if($("#mgmtGrpCd").val() == "0002") {
	//	if((topoSclCd == '030' || topoSclCd == '031')) {
//	if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
		editYn = "Y";
	//} else {
	//	editYn = "N";
	//}

	if (division != "cascadingRing") {
		editYn = "N";
		schVal.RING_TOPOLOGY_LARGE_CD = "100";
	}
	
	var casCadingRingId = nullToEmpty(ringId);
	casCadingRingId = (casCadingRingId.indexOf("alopex") == 0) ? "" : casCadingRingId; 
		
	// 경유링이 가능한 링 타입인지 확인
	var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
	if (isMeshRing(chkTopoSclCd) == false && isAbleViaRing(chkTopoSclCd) == false && editYn == "Y") {
		alertBox('W', "MESH링 혹은 Ring, IBS, IBRR, IVS, IVRR, MSPP, Free, PTS링, L3_Switch링, T2IP링, SMUX링, 가입자망링 만 링을 참조 사용가능합니다.");
		return;
	}
	
	var dataObj = AlopexGrid.parseEvent(event); 
	var gridId = dataObj.$grid.attr("id");
	var popHeight = 0;
	
	if(nullToEmpty(ringId) != "") {
		popHeight = 600;
	} else {
		popHeight = 760;
	}
	
	var editRingId = (isRingOld() == true ?  baseInfData[0].ntwkLineNo :  baseInfData.ntwkLineNo) ;
	var editRingTopoSclCd = (isRingOld() == true ?  baseInfData[0].topoSclCd :  '') ;
	var editRingMgmtCd = (isRingOld() == true ?  baseInfData[0].mgmtGrpCd :  '') ; 
	var useRingRontTrunkParam = {  "vTmofInfo" : vTmofInfo,  "editRingId" : editRingId, "editRingTopoSclCd" : editRingTopoSclCd, "editViewVisualYn" : "N", "editRingMgmtCd" : editRingMgmtCd
		                         , "editYn" : editYn, "useRingId" : ringId, "useRingPathDirection" : schVal.RING_PATH_DIRECTION
		                         , "useRingTopoLclCd" : schVal.RING_TOPOLOGY_LARGE_CD, "useRingTopoSclCd" : schVal.RING_TOPOLOGY_SMALL_CD
		                         , "useRingTopoCfgMeansCd" : schVal.RING_TOPOLOGY_CFG_MEANS_CD, "ntwkLineNm" : nullToEmpty(schVal.CASCADING_RING_NM)
						        };
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	if(division == "cascadingRing" || division == "cascadingRingL2" || division == "cascadingRingL3") {
		if (editRingTopoSclCd == "035" || editRingTopoSclCd == "031") {
			
			if (division == "cascadingRingL2" || division == "cascadingRingL3") {
				return ; 
			} 
			// 이미 사용서비스회선정보가 있는지
    		var chkDataObj = $('#'+gridId).alopexGrid("dataGet", function (data) { 
    							return (nullToEmpty(data["RING_ID"]) != '' && nullToEmpty(data["RING_ID"]).indexOf("alopex") != 0) ;
    				 		});
    		
    		if (chkDataObj.length > 0) {
    			var msg = "이미 사용링이 설정되어 있습니다. <br>사용 링 참조는 링당 1개의 사용링만 참조가능합니다.";
    			alertBox('W', msg); 
    			// 다른 팝업에 영향을 주지않기 위해
 				$.alopex.popup.result = null; 
    			return;
    		}
		}
		
		$a.popup({popid : 'UseRingRontTrunkPop'
		    , title : '기설회선추가'
		    , url : '/tango-transmission-web/configmgmt/cfline/UseRingRontTrunkSearchPop.do'
		    , data : useRingRontTrunkParam
		    , iframe: true
			, modal: true
			, movable:true
			, windowpopup : true //이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
		    , width : 1300
		    , height : 780
		    , callback : function(ringData) {
		    	if(ringData != null){
		    		cflineShowProgressBody();
 		    		//console.log(ringData);
		    		var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
 		    		if (isMeshRing(chkTopoSclCd) == false && isAbleViaRing(chkTopoSclCd) == false) {
 		    			cflineHideProgressBody();
 		    			alertBox('W', "MESH링 혹은 Ring, IBS, IBRR, IVS, IVRR, SMUX링만 링을 참조 사용가능합니다.");
 		    			return;
 		    		}
 		    				    		
 		    		/* 2019-09-30  5. 기간망 링 선번 고도화
 		    		 * 중복링 확인 및 중복링 제거와 인접링(DROP 장비와 ADD장비가 같은 경우 해당 ADD/DROP장비 삭제) 처리 및 DROP장비와 ADD 장비 한줄로 처리					
					 * 1) 기간망 트렁크의 경유 PTP링을 다건 추가하는 기능으로 다건의 PTP링이 인접 링일수 있어 
					 *    이전링의 DROP장비와 다음링의 ADD장비가 같은 경우 해당 DROP/ADD 장비를 생략하도록 처리 
					 * 2) 기간망 트렁크의 경유 PTP링들간 DROP장비와 다음링 ADD장비의 구간을 병합하는 로직 추가
					 */ 
 		    		var ptpRingMsg = "";
 		    		var ptpRingIdArray = [];  // 경유 PTP링의 경우 다건일것임. 그외는 1건일 것임 <= 이정보를 바탕으로 중복링에 대한 선택창을 띄울것임.
 		    		var addDropRingData = [];
 		    		var chkDupUseRingId = "";
 		    		var chkDupUseRingIdCnt = 0;
 		    		var chkRingId = "";
 		    		var ringDataCnt = ringData.length;
 		    		for (var i = 0; i < ringData.length; i++ ) {
 		    			if (nullToEmpty(ringData[i].RING_ID) == "") {
 		    				/* 1. 링 ID가 없는경우 특정 링의 ADD / DROP 장비임. 해당건을 추가하기 전에 해당 링의 중복을 체크 중복인 경우 건너뜀(ADD/DROP 장비포함)
 		    				   2. 중복링이 아닌경우 연속되는 2개의 링의 DROP장비와 ADD장비가 같은경우 추가하지 않는다 = > 1)
 		    				   3. 중복링이 아닌경우 이전링의 DROP 장비와 다음링의 ADD장비를 한개의 구간으로 만들어 추가한다 => 2)
 		    				*/
 		    				
 		    				// 1. 중복체크
 		    				if ((i+1) < ringDataCnt && nullToEmpty(ringData[i+1].RING_ID) != "") {
 		    					chkRingId = nullToEmpty(ringData[i+1].RING_ID);
 		    					var tempRingDataCnt = $('#'+gridId).alopexGrid("dataGet", {'RING_ID' :chkRingId}, 'RING_ID').length;
 		    					tempRingDataCnt += $('#'+gridId).alopexGrid("dataGet", {'RING_ID_L2' :chkRingId}, 'RING_ID').length;
 		    					tempRingDataCnt += $('#'+gridId).alopexGrid("dataGet", {'RING_ID_L3' :chkRingId}, 'RING_ID').length;
 		    					
 		    					ptpRingIdArray.push(chkRingId);
 		    					// 중복이면 링정보로 추가하지 않음
 		    					if (tempRingDataCnt > 0) {
 		    						chkDupUseRingIdCnt++;
 		    						chkDupUseRingId = chkRingId;
 		    						ptpRingMsg += (ptpRingMsg.length > 0 ? ", <br>" : "") + ringData[i+1].RING_NM
 		    						continue;
 		    					}
 		    					// SMUX링/가입자망링 인 경우 1개의 링만 사용가능함
 		    					else if (editRingTopoSclCd == "035" || editRingTopoSclCd == "031") {
 		    					    // 이미 사용서비스회선정보가 있는지
 		    	 		    		var chkDataObj = $('#'+gridId).alopexGrid("dataGet", function (data) { 
 		    	 		    							return (nullToEmpty(data["RING_ID"]) != '' && nullToEmpty(data["RING_ID"]).indexOf("alopex") != 0) ;
 		    	 		    				 		});
 		    	 		    		
 		    	 		    		if (chkDataObj.length > 0) {
 		    	 		    			var msg = "이미 사용링이 설정되어 있습니다. <br>사용 링 참조는 링당 1개의 사용링만 참조가능합니다.";
 		    			    			alertBox('W', msg); 
 		    			    			// 다른 팝업에 영향을 주지않기 위해
 		    			 				$.alopex.popup.result = null; 
 		    			    			return;
 		    	 		    		}
 		    					}
 		    				}
 		    				// 바로 이전구간이 RING_ID가 있고 해당 구간의 EAST장비가 현재구간의 WEST장비(DROP)와 같은 경우 같은 링의 DROP구간으로 보고 중복링의 경우 추가하지 않음
 		    				else if (i > 0 && nullToEmpty(ringData[i-1].RING_ID) != "" && nullToEmpty(ringData[i-1].RING_ID) == chkDupUseRingId 
 		    						&& nullToEmpty(ringData[i-1].RIGHT_NE_ID) ==  ringData[i].LEFT_NE_ID) {
 		    					continue;
 		    				} 
 		    				// 1. 중복체크
 		    				// 다음 링이 중복링인 경우 역시 추가 작업 하면 안되기 때문에 이전 구간의 DROP 장비와 다음 구간 ADD 장비 병합 여부 처리전에 중복체크가 필요함
 		    				// 이전링 DROP 장비인 구간중 다음 구간이 다음링 ADD 장비 구간(nullToEmpty(ringData[i+1].RING_ID))에 해당하는 경우만 작업 
 		    				else if ((i+2) < ringDataCnt && nullToEmpty(ringData[i+2].RING_ID) != "" && nullToEmpty(ringData[i+1].RING_ID) == "") {
 		    					var tempRingDataCnt = $('#'+gridId).alopexGrid("dataGet", {'RING_ID' :nullToEmpty(ringData[i+2].RING_ID)}, 'RING_ID').length;
 		    					
 		    					// 다음 링이 중복이라면 해당 구간이 인접링인것과 상관없이 DROP장비는 추가되어야 함. 
 		    					if (tempRingDataCnt > 0) {
 		    						addDropRingData.push(ringData[i]);
 		    						continue;
 		    					}
 		    				}
		    				
 		    				//  2. 중복링이 아닌경우 인접링인지 체크
 		    				if ((i > 0 && (i+1) < ringDataCnt && ringData[i].LEFT_NE_ID == ringData[i+1].RIGHT_NE_ID && nullToEmpty(ringData[i+1].RING_ID) == "")  // 해당구간 WEST(DROP)장비와 다음구간 EAST(ADD)장비가 같거나
		 								||(i > 0 && ringDataCnt && ringData[i].RIGHT_NE_ID == ringData[i-1].LEFT_NE_ID && nullToEmpty(ringData[i-1].RING_ID) == ""))  // 해당 구간  EAST(ADD)장비와 이전구간 WEST(DROP) 장비가 같은경우
 							{
 								continue;
 							} else {
 							    // 3. 중복링이 아닌경우 추가할 ADD구간의 WEST장비가 비어 있고 바로 이전 구간의 DROP장비의 EAST장비가 비어있는경우 ROW을 추가하지않고 같은 행에
 								if (addDropRingData.length > 0) {
 									var tmpLastLink = addDropRingData[addDropRingData.length -1];
 									if (nullToEmpty(tmpLastLink.RING_ID) == "" && nullToEmpty(tmpLastLink.LEFT_NE_ID) != nullToEmpty(ringData[i].RIGHT_NE_ID) 
 											&& nullToEmpty(tmpLastLink.RIGHT_NE_ID) == ""  && nullToEmpty(ringData[i].LEFT_NE_ID) == "") {
 										// 이전구간의 RIGHT_NE_ID에 현재구간의 ADD 장비를 셋팅
 										for(var key in tmpLastLink) {
 											// WEST이면 EAST로 바꾼다.
 											if(key.indexOf("RIGHT") == 0) {
 												eval("tmpLastLink." + key + " = ringData[i]." + key);
 											}
 										};
 										continue;
 									}
 								} 
 								addDropRingData.push(ringData[i]);
 							}
 						} 
 		    			// 이전 중복링과 같은 id 인경우 추가하지 않음
 		    			else if (nullToEmpty(ringData[i].RING_ID) == chkDupUseRingId) {
 		    				continue;
 		    			}
 		    			// 중복링이 아닌 링의 선번의 경우
 		    			else {	
 		    				addDropRingData.push(ringData[i]);
 						}
 		    		} 

 		    		cflineHideProgressBody();
 		    		// 중복설정인지
		    		if(chkDupUseRingIdCnt > 0) {
		    			if (ptpRingIdArray.length == 1) {
			    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
			    			alertBox('W', msg); 
			    			// 다른 팝업에 영향을 주지않기 위해
			 				$.alopex.popup.result = null; 
			    			return;
		    			} else {
		    				// 추가할 링이 없는경우 중복 메세지만 출력
		    				if (addDropRingData.length == 0) {
		    					ptpRingMsg +="<br> 링이 중복으로 추가할 링이 없습니다."
				    			alertBox('W', ptpRingMsg); 
				    			// 다른 팝업에 영향을 주지않기 위해
				 				$.alopex.popup.result = null; 
				    			return;
		    				} 

		    				ptpRingMsg += "<br> 링이 중복입니다.<br> 해당 링을 제외하고 추가하시겠습니까?";
		    				callMsgBox('','C', ptpRingMsg, function(msgId, msgRst){   /**/
		    					// 사용링 형태로 셋팅
		    					if (msgRst == 'Y') {

		    						cflineShowProgressBody();
		    						//openNetworkPathPop 참조하여 구현
		    	 		    		var getDataSize = addDropRingData.length;
		    	 		    		var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		    			    		var rowIndex = focusData[0]._index.row;
		    			    		
		    			    		// 검색을 위한 입력데이터 리셋
		    			    		var column = "CASCADING_RING_NM";
		    			    			 
		    			    		$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
		    			    		
		    			    		// 링일 경우 상하위 리셋( 서비스 회선 : C00967(NA))
		    			    		if(gridDivision == "ring") {
		    			    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    			    		}
		    	 
		    			    		// 기존 데이터 삭제 시작
		    			    		if (nullToEmpty(casCadingRingId) != "") {
		    				    		var deleteDataList =  $('#'+gridId).alopexGrid("dataGet", {"RING_ID":casCadingRingId}, "RING_ID");
		    				    		
		    				    		var deleteRowIndex = 0;
		    				    		for(var i = 0; i < deleteDataList.length; i++) {
		    				    			deleteRowIndex = deleteDataList[i]._index.row;
		    				    			$('#'+gridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    				    		}
		    				    		
		    				    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
		    				    			rowIndex = deleteRowIndex;
		    				    		}
		    			    		}
		    			    		// 기존 데이터 삭제 끝
		    			    		// 선번 셋팅
		    			    		setPathRing(addDropRingData, rowIndex, getDataSize, gridId);
		    			    		
		    			    		var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
		    						var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
		    						// row 추가
		    						if( ( nullToEmpty(focusData.SERVICE_ID) == "" && nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
		    								&& (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
		    		    					&& (nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
		    							if((lastData.SERVICE_ID != null || lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
		    								|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
		    		    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
		    								addRowNullData(gridId);
		    							} else {
		    								// 셀 병합을 위해서 임의로 row 추가 후 삭제. 방안 찾을 것
		    								addRowNullData(gridId);
		    								$('#'+gridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex}});
		    							}
		    						}
		    						
		    			    		$('#'+gridId).alopexGrid('startEdit');

		    			    		cflineHideProgressBody();
		    			    		orgChk(gridId);
		    					}
		    				});
		    			}
		    		}
		    		// 중복링이 없는 경우
		    		else {
		    			//openNetworkPathPop 참조하여 구현
		    			cflineShowProgressBody();
	 		    		var getDataSize = addDropRingData.length;
	 		    		var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
			    		var rowIndex = focusData[0]._index.row;
			    		
			    		// 검색을 위한 입력데이터 리셋
			    		var column = "CASCADING_RING_NM";
			    			 
			    		$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
			    		
			    		// 링일 경우 상하위 리셋( 서비스 회선 : C00967(NA))
			    		if(gridDivision == "ring") {
			    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
			    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
			    		}
	 
			    		// 기존 데이터 삭제 시작
			    		if (nullToEmpty(casCadingRingId) != "") {
				    		var deleteDataList =  $('#'+gridId).alopexGrid("dataGet", {"RING_ID":casCadingRingId}, "RING_ID");
				    		
				    		var deleteRowIndex = 0;
				    		for(var i = 0; i < deleteDataList.length; i++) {
				    			deleteRowIndex = deleteDataList[i]._index.row;
				    			$('#'+gridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
				    		}
				    		
				    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
				    			rowIndex = deleteRowIndex;
				    		}
			    		}
			    		// 기존 데이터 삭제 끝
			    		// 선번 셋팅
			    		setPathRing(addDropRingData, rowIndex, getDataSize, gridId);
			    		
			    		var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
						var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
						// row 추가
						if( ( nullToEmpty(focusData.SERVICE_ID) == "" && nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
								&& (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
		    					&& (nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
							if((lastData.SERVICE_ID != null || lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
								|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
		    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
								addRowNullData(gridId);
							} else {
								// 셀 병합을 위해서 임의로 row 추가 후 삭제. 방안 찾을 것
								addRowNullData(gridId);
								$('#'+gridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex}});
							}
						}
						
			    		$('#'+gridId).alopexGrid('startEdit');

			    		cflineHideProgressBody();
			    		orgChk(gridId);
			    		
		    		}
 		    	} 		    	

 				// 다른 팝업에 영향을 주지않기 위해
 				$.alopex.popup.result = null; 
		    }	 
		});
	}
}

/**
 * SKB 가입자망링의 전송망링검색
 * FDF장비의 상, 하위국에 속하는 장비가 속해있는 링을(가입자망제외) 검색하여 보여준다
 */
function openUseBtbEqpRingPop(gridId) {
	
	var dataObj = $('#'+gridId).alopexGrid("dataGet");
	var uperMtsoOrg = "";
	var lowerMtsoOrg = "";
	for (var i = 0; i < dataObj.length; i++ ) {
		
		if((dataObj[i].LEFT_NE_ROLE_CD == "11" || dataObj[i].LEFT_NE_ROLE_CD == "162" || dataObj[i].LEFT_NE_ROLE_CD == "177" || dataObj[i].LEFT_NE_ROLE_CD == "178" || dataObj[i].LEFT_NE_ROLE_CD == "182")
			|| (dataObj[i].RIGHT_NE_ROLE_CD == "11" || dataObj[i].RIGHT_NE_ROLE_CD == "162" || dataObj[i].RIGHT_NE_ROLE_CD == "177" || dataObj[i].RIGHT_NE_ROLE_CD == "178" || dataObj[i].RIGHT_NE_ROLE_CD == "182")
			) {
			if (uperMtsoOrg == "" && nullToEmpty(dataObj[i].RIGHT_ORG_ID) != "") {
				uperMtsoOrg = nullToEmpty(dataObj[i].RIGHT_ORG_ID);
			}
			if(uperMtsoOrg == "" && nullToEmpty(dataObj[i].LEFT_ORG_ID) != "") {
				uperMtsoOrg = nullToEmpty(dataObj[i].LEFT_ORG_ID);
			}
			
			if (nullToEmpty(dataObj[i].RIGHT_ORG_ID) != "") {
				lowerMtsoOrg = nullToEmpty(dataObj[i].RIGHT_ORG_ID);
			}
			if(lowerMtsoOrg == "" && nullToEmpty(dataObj[i].LEFT_ORG_ID) != "") {
				lowerMtsoOrg = nullToEmpty(dataObj[i].LEFT_ORG_ID);
			}
		}
	}

	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var orgId = "";
		orgId = uperMtsoOrg;
		orgId = orgId + ',' + lowerMtsoOrg;
		
	var useBtbRingParam = {  "vTmofInfo" : vTmofInfo,  "editViewVisualYn" : "N", "editYn" : "N", "orgId":orgId};
		
	$a.popup({
		popid: "UseBtbEqpRingSearchPop",
		title: "전송망링검색", 
		url: 'UseBtbEqpRingSearchPop.do',
		data: useBtbRingParam,
		iframe: true,
		modal : true,
		movable:true,
		windowpopup : true,
		width : 1300,
		height : 780,
		callback:function(ringData){
			
			if(ringData != null){
				cflineHideProgressBody();
		    		var ptpRingMsg = "";
		    		var ptpRingIdArray = [];  // 경유 PTP링의 경우 다건일것임. 그외는 1건일 것임 <= 이정보를 바탕으로 중복링에 대한 선택창을 띄울것임.
		    		var addDropRingData = [];
		    		var chkDupUseRingId = "";
		    		var chkDupUseRingIdCnt = 0;
		    		var chkRingId = "";
		    		var ringDataCnt = ringData.length;
		    		for (var i = 0; i < ringData.length; i++ ) {
		    			if (nullToEmpty(ringData[i].RING_ID) == "") {
		    				/* 1. 링 ID가 없는경우 특정 링의 ADD / DROP 장비임. 해당건을 추가하기 전에 해당 링의 중복을 체크 중복인 경우 건너뜀(ADD/DROP 장비포함)
		    				   2. 중복링이 아닌경우 연속되는 2개의 링의 DROP장비와 ADD장비가 같은경우 추가하지 않는다 = > 1)
		    				   3. 중복링이 아닌경우 이전링의 DROP 장비와 다음링의 ADD장비를 한개의 구간으로 만들어 추가한다 => 2)
		    				*/
		    				
		    				// 1. 중복체크
		    				if ((i+1) < ringDataCnt && nullToEmpty(ringData[i+1].RING_ID) != "") {
		    					chkRingId = nullToEmpty(ringData[i+1].RING_ID);
		    					var tempRingDataCnt = $('#'+gridId).alopexGrid("dataGet", {'RING_ID' :chkRingId}, 'RING_ID').length;
		    					tempRingDataCnt += $('#'+gridId).alopexGrid("dataGet", {'RING_ID_L2' :chkRingId}, 'RING_ID').length;
		    					tempRingDataCnt += $('#'+gridId).alopexGrid("dataGet", {'RING_ID_L3' :chkRingId}, 'RING_ID').length;
		    					
		    					ptpRingIdArray.push(chkRingId);
		    					// 중복이면 링정보로 추가하지 않음
		    					if (tempRingDataCnt > 0) {
		    						chkDupUseRingIdCnt++;
		    						chkDupUseRingId = chkRingId;
		    						ptpRingMsg += (ptpRingMsg.length > 0 ? ", <br>" : "") + ringData[i+1].RING_NM
		    						continue;
		    					}
		    				}
		    				// 바로 이전구간이 RING_ID가 있고 해당 구간의 EAST장비가 현재구간의 WEST장비(DROP)와 같은 경우 같은 링의 DROP구간으로 보고 중복링의 경우 추가하지 않음
		    				else if (i > 0 && nullToEmpty(ringData[i-1].RING_ID) != "" && nullToEmpty(ringData[i-1].RING_ID) == chkDupUseRingId 
		    						&& nullToEmpty(ringData[i-1].RIGHT_NE_ID) ==  ringData[i].LEFT_NE_ID) {
		    					continue;
		    				} 
		    				// 1. 중복체크
		    				// 다음 링이 중복링인 경우 역시 추가 작업 하면 안되기 때문에 이전 구간의 DROP 장비와 다음 구간 ADD 장비 병합 여부 처리전에 중복체크가 필요함
		    				// 이전링 DROP 장비인 구간중 다음 구간이 다음링 ADD 장비 구간(nullToEmpty(ringData[i+1].RING_ID))에 해당하는 경우만 작업 
		    				else if ((i+2) < ringDataCnt && nullToEmpty(ringData[i+2].RING_ID) != "" && nullToEmpty(ringData[i+1].RING_ID) == "") {
		    					var tempRingDataCnt = $('#'+gridId).alopexGrid("dataGet", {'RING_ID' :nullToEmpty(ringData[i+2].RING_ID)}, 'RING_ID').length;
		    					
		    					// 다음 링이 중복이라면 해당 구간이 인접링인것과 상관없이 DROP장비는 추가되어야 함. 
		    					if (tempRingDataCnt > 0) {
		    						addDropRingData.push(ringData[i]);
		    						continue;
		    					}
		    				}
	    				
		    				//  2. 중복링이 아닌경우 인접링인지 체크
		    				if ((i > 0 && (i+1) < ringDataCnt && ringData[i].LEFT_NE_ID == ringData[i+1].RIGHT_NE_ID && nullToEmpty(ringData[i+1].RING_ID) == "")  // 해당구간 WEST(DROP)장비와 다음구간 EAST(ADD)장비가 같거나
	 								||(i > 0 && ringDataCnt && ringData[i].RIGHT_NE_ID == ringData[i-1].LEFT_NE_ID && nullToEmpty(ringData[i-1].RING_ID) == ""))  // 해당 구간  EAST(ADD)장비와 이전구간 WEST(DROP) 장비가 같은경우
							{
								continue;
							} else {
							    // 3. 중복링이 아닌경우 추가할 ADD구간의 WEST장비가 비어 있고 바로 이전 구간의 DROP장비의 EAST장비가 비어있는경우 ROW을 추가하지않고 같은 행에
								if (addDropRingData.length > 0) {
									var tmpLastLink = addDropRingData[addDropRingData.length -1];
									if (nullToEmpty(tmpLastLink.RING_ID) == "" && nullToEmpty(tmpLastLink.LEFT_NE_ID) != nullToEmpty(ringData[i].RIGHT_NE_ID) 
											&& nullToEmpty(tmpLastLink.RIGHT_NE_ID) == ""  && nullToEmpty(ringData[i].LEFT_NE_ID) == "") {
										// 이전구간의 RIGHT_NE_ID에 현재구간의 ADD 장비를 셋팅
										for(var key in tmpLastLink) {
											// WEST이면 EAST로 바꾼다.
											if(key.indexOf("RIGHT") == 0) {
												eval("tmpLastLink." + key + " = ringData[i]." + key);
											}
										};
										continue;
									}
								} 
								addDropRingData.push(ringData[i]);
							}
						} 
		    			// 이전 중복링과 같은 id 인경우 추가하지 않음
		    			else if (nullToEmpty(ringData[i].RING_ID) == chkDupUseRingId) {
		    				continue;
		    			}
		    			// 중복링이 아닌 링의 선번의 경우
		    			else {	
		    				addDropRingData.push(ringData[i]);
						}
		    		} 

		    		cflineHideProgressBody();
		    	// 중복설정인지
	    		if(chkDupUseRingIdCnt > 0) {
	    			if (ptpRingIdArray.length == 1) {
		    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
		    			alertBox('W', msg); 
		    			// 다른 팝업에 영향을 주지않기 위해
		 				$.alopex.popup.result = null; 
		    			return;
	    			} else {
	    				// 추가할 링이 없는경우 중복 메세지만 출력
	    				if (addDropRingData.length == 0) {
	    					ptpRingMsg +="<br> 링이 중복으로 추가할 링이 없습니다."
			    			alertBox('W', ptpRingMsg); 
			    			// 다른 팝업에 영향을 주지않기 위해
			 				$.alopex.popup.result = null; 
			    			return;
	    				} 

	    				ptpRingMsg += "<br> 링이 중복입니다.<br> 해당 링을 제외하고 추가하시겠습니까?";
	    				callMsgBox('','C', ptpRingMsg, function(msgId, msgRst){   /**/
	    					// 사용링 형태로 셋팅
	    					if (msgRst == 'Y') {

	    						cflineShowProgressBody();
	    						//openNetworkPathPop 참조하여 구현
	    	 		    		var getDataSize = addDropRingData.length;
	    	 		    		var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
	    			    		var rowIndex = focusData[0]._index.row;
	    			    		
	    			    		// 검색을 위한 입력데이터 리셋
	    			    		var column = "CASCADING_RING_NM";
	    			    			 
	    			    		$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
	    			    		
	    			    		// 링일 경우 상하위 리셋( 서비스 회선 : C00967(NA))
	    			    		if(gridDivision == "ring") {
	    			    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
	    			    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
	    			    		}
	    	 
	    			    		// 기존 데이터 삭제 시작
	    			    		if (nullToEmpty(casCadingRingId) != "") {
	    				    		var deleteDataList =  $('#'+gridId).alopexGrid("dataGet", {"RING_ID":casCadingRingId}, "RING_ID");
	    				    		
	    				    		var deleteRowIndex = 0;
	    				    		for(var i = 0; i < deleteDataList.length; i++) {
	    				    			deleteRowIndex = deleteDataList[i]._index.row;
	    				    			$('#'+gridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
	    				    		}
	    				    		
	    				    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
	    				    			rowIndex = deleteRowIndex;
	    				    		}
	    			    		}
	    			    		// 기존 데이터 삭제 끝
	    			    		// 선번 셋팅
	    			    		setPathRing(addDropRingData, rowIndex, getDataSize, gridId);
	    			    		
	    			    		var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
	    						var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
	    						// row 추가
	    						if( ( nullToEmpty(focusData.SERVICE_ID) == "" && nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
	    								&& (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
	    		    					&& (nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
	    							if((lastData.SERVICE_ID != null || lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
	    								|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    		    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
	    								addRowNullData(gridId);
	    							} else {
	    								// 셀 병합을 위해서 임의로 row 추가 후 삭제. 방안 찾을 것
	    								addRowNullData(gridId);
	    								$('#'+gridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex}});
	    							}
	    						}
	    						
	    			    		$('#'+gridId).alopexGrid('startEdit');

	    			    		cflineHideProgressBody();
	    			    		orgChk(gridId);
	    					}
	    				});
	    			}
	    		}
	    		// 중복링이 없는 경우
	    		else {
	    			//openNetworkPathPop 참조하여 구현
	    			cflineShowProgressBody();
		    		var getDataSize = addDropRingData.length;
		    		var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
		    		
		    		// 검색을 위한 입력데이터 리셋
		    		var column = "CASCADING_RING_NM";
		    			 
		    		$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
		    		
		    		// 링일 경우 상하위 리셋( 서비스 회선 : C00967(NA))
		    		if(gridDivision == "ring") {
		    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			$('#'+gridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    		}

		    		// 기존 데이터 삭제 시작
//		    		if (nullToEmpty(casCadingRingId) != "") {
//			    		var deleteDataList =  $('#'+gridId).alopexGrid("dataGet", {"RING_ID":casCadingRingId}, "RING_ID");
//			    		
//			    		var deleteRowIndex = 0;
//			    		for(var i = 0; i < deleteDataList.length; i++) {
//			    			deleteRowIndex = deleteDataList[i]._index.row;
//			    			$('#'+gridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
//			    		}
//			    		
//			    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
//			    			rowIndex = deleteRowIndex;
//			    		}
//		    		}
		    		// 기존 데이터 삭제 끝
		    		// 선번 셋팅
		    		if(rowIndex > 0) rowIndex = rowIndex +1;
		    		setPathRing(addDropRingData, rowIndex, getDataSize, gridId);
		    		
		    		var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					// row 추가
					if( ( nullToEmpty(focusData.SERVICE_ID) == "" && nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
							&& (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
	    					&& (nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
						if((lastData.SERVICE_ID != null || lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
							|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(gridId);
						} else {
							// 셀 병합을 위해서 임의로 row 추가 후 삭제. 방안 찾을 것
							addRowNullData(gridId);
							$('#'+gridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex}});
						}
					}
					
		    		$('#'+gridId).alopexGrid('startEdit');

		    		cflineHideProgressBody();
		    		orgChk(gridId);
		    		
	    		}
	    	} 		    	

			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
		}
	});
}

/**
 * Function Name : casCadingAddDropPop
 * Description   : 경유링구성도 팝업창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : editYn
 *                 callGridIdForRing. 링 호출한 Grid
 *                 division 경유링 레벨
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function casCadingAddDropPop(editYn, ntwkLineNo, useNetworkPathDirection, dataObj, callGridIdForRing, division) {
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}

	if (typeof callGridIdForRing == "undefined" || callGridIdForRing == "" || callGridIdForRing == null) {
		callGridIdForRing = detailGridId;
	}
	
	cflineShowProgressBody();
	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
	var params = {"ntwkLineNo" : ntwkLineNo, "editYn" : editYn, "useNetworkPathDirection" : useNetworkPathDirection
			        , "casCadingRingInfo" : dataObj
					, "zIndex":zIndex, "target":"Alopex_Popup_selectAddDrop"};
	
	/* ADAMS 연동 고도화 */
	//TODO 이전으로 20240911
	//	if($("#mgmtGrpCd").val() == "0002") {
	//	if((topoSclCd == '030' || topoSclCd == '031')) {
	//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
		params.editYn = "Y";
	//} else {
	//	params.editYn = "N";
	//}

	// 링 데이터 가져오기(T)
	var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
	var rowIndex = focusData[0]._index.row;
	var dataList = null;
	if (division == "cascadingRing") {
		dataList = $('#'+callGridIdForRing).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE").member;
	}
	// 2차 경유링인 경우 편집 불가
	else if (division == "cascadingRingL2") {
		dataList = $('#'+callGridIdForRing).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE2").member;
		editYn = "N";
	} 
	// 3차 경유링인 경우 편집 불가
	else if (division == "cascadingRingL3") {
		dataList = $('#'+callGridIdForRing).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE3").member;
		editYn = "N";
	}
	var ringDataList = [];
	
	// ADD
	var addData = "";
	// ADD 구간 가져오기
	addData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : rowIndex -1});
	ringDataList.push(addData);
	
	// THROUGH
	for(var i = 0; i < dataList.length; i++) {
		ringDataList.push(dataList[i]);
	}
	
	// DROP
	var dropData = "";
	var lastIdx = dataList.length-1;
	// DROP 구간 가져오기
	dropData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : rowIndex + (lastIdx+1)});
	ringDataList.push(dropData);
	
	if(ringDataList.length > 1) {
		$.extend(params,{"dataList":AlopexGrid.trimData(ringDataList)});
	}

	$a.popup({
    	popid: "selectAddDrop",
		title: "링 ADD DROP",
		url: urlPath+'/configmgmt/cfline/RingAddDropPop.do',
		data: params,
		iframe: true,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 850,
		callback:function(data){
			cflineHideProgressBody();
			if(data != null) {
				if(data.prev == 'Y') {
					// 이전 					
					$("#"+callGridIdForRing).alopexGrid("endEdit");					
		     	 	var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
		     	 	$("#"+callGridIdForRing).alopexGrid("startEdit");
		     	 	
		     	 	if(String(focusData[0].RING_MERGE).indexOf('alopex') == 0) {
		     	 		openRingListPop(eval("focusData[0]." + focusData[0]._key), "Y", callGridIdForRing);
		     	 	}
				} else {
					var getDataSize = data.length;
					var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
					
		    		// 검색을 위한 입력데이터 리셋
		    		$('#'+callGridIdForRing).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RING_NM");
	    			
		    		// 동일한 링구간 삭제
		    		var deleteDataList = $('#'+callGridIdForRing).alopexGrid("dataGet", {"RING_ID":ntwkLineNo}, "RING_ID");
		    		var deleteRowIndex = 0;
		    		
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
	    				$('#'+callGridIdForRing).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
		    			rowIndex = deleteRowIndex;
		    		}
		    		
		    		// 선번 넣기
		    		setPathRing(data, rowIndex, getDataSize, callGridIdForRing);
					
					var lastRowIndex = $('#'+callGridIdForRing).alopexGrid("dataGet").length;
					var lastData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					//var lastData = $('#'+callGridIdForRing).alopexGrid("dataGet", {row : lastRowIndex -1});
					// row 추가
					if( (focusData.SERVICE_ID == null && // 2018-09-12  3. RU고도화
							focusData.TRUNK_ID == null && focusData.RING_ID == null && focusData.WDM_TRUNK_ID == null)
							&& (focusData.LEFT_NE_ID == null || focusData.LEFT_NE_NM == null) 
	    					&& (focusData.RIGHT_NE_ID == null || focusData.RIGHT_NE_NM == null)) {
						if((lastData.SERVICE_ID != null || // 2018-09-12  3. RU고도화
								lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
							|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(callGridIdForRing);
						}
					}
					
		    		$('#'+callGridIdForRing).alopexGrid('startEdit');
		    		orgChk(callGridIdForRing);
				}
			}
		}
    });
}

/**
* Function Name : openEqpListPop
* Description   : 장비 검색
* ----------------------------------------------------------------------------------------------------
* param    	 	: 
* ----------------------------------------------------------------------------------------------------
* return        : return param  
*/ 
function openEqpListPop(searchEqpNm, vTmofInfo, division, param, gridId){
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	// , filtered:true
	var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	
	if(checkOpenPopYn(gridId)) {
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		var paramData = new Object();
		$.extend(paramData,{"neNm":nullToEmpty(searchEqpNm)});
		$.extend(paramData,{"vTmofInfo":vTmofInfo}); // 최상위 전송실 조회 리스트
		$.extend(paramData,{"searchDivision":division});
		$.extend(paramData,{"fdfAddVisible":true});
		
		if(param == "LEFT") {
			$.extend(paramData,{"partnerNeId":focusData.RIGHT_NE_ID});
		} else if(param == "RIGHT") {
			$.extend(paramData,{"partnerNeId":focusData.LEFT_NE_ID});
		}
		
		if(division == "wdm"){
			$.extend(paramData,{ "wdmYn" :"Y"});
		}
		
		// SKB ADAMS 연동 고도화
		$.extend(paramData,{"mgmtGrpCd" : $("#mgmtGrpCd").val()}); // 관리그룹
		
		if( typeof svlnLclCd != "undefined") {
			$.extend(paramData,{"svlnLclCd" : svlnLclCd}); //회선 대분류 코드
		}
		if( typeof topoSclCd != "undefined") {
			$.extend(paramData,{"topoSclCd" : topoSclCd}); //토플로지 소분류 코드
		}
		
		if( typeof mgmtOnrNm != "undefined") {
			$.extend(paramData,{"mgmtOnrNm" : mgmtOnrNm}); //관리주체 구분 "TANGO" "ADAMS"
		}
		//$.extend(paramData,{"svlnLclCd" : svlnLclCd}); //회선 대분류 코드
		
		
		
		$a.popup({
		  	popid: "popEqpListSch" + param,
		  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
		  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
		  	data: paramData,
			modal: true,
			movable:true,
			//windowpopup : true,
			width : 1200,
			height : 730,
			callback:function(data){
				if(data != null){
					// 장비 data 초기화 column set
					var columnList = [];
					var dataList = AlopexGrid.trimData(focusData);
	    			for(var key in dataList) {
	    				if(key.indexOf(param) == 0) {
	    					columnList.push(key.replace(param+"_", ""));
	    				}
	    			}
	    			
	    			var idChk = false;
	    			for( var idx = 0; idx < columnList.length; idx++ ) {
	    				if(columnList[idx] == "NE_ID") {
	    					idChk = true;
	    				}
	    			}
					
	    			if(!idChk) {
	    				columnList.push("NE_ID");
	    			}
	    			
	    			// 장비 data set - LMUX추가 (2020-09-11), 4GLMUX추가 (2024-11-13)
	    			if(initParam.topoSclCd == '035' && (data.neRoleCd == "19" || data.neRoleCd == "52" || data.neRoleCd == "53" || data.neRoleCd == "56" ) && topoCfgMeansCd == "001"){
	    				data.autoPortSetYn = "N";
	    			}
	    			
	    			// COM 포트 자동 셋팅 기능 사용여부 확인 필요  <= 사용 안할 경우 EqpInf.xml 수정 필요함 BC-MUX, CWDM-MUX 링이 아니면 com 포트 자동셋팅하지 않음
	    			// BC-MUX, CWDM-MUX 링 이 아닌데 BCMUX, CWDMMUX 장비를 택한 경우 COM 포트 자동 셋팅하지 않음
	    			if (isSkbMuxRingOld() == false && data.autoPortSetYn == "Y" && (data.neRoleCd == "183" || data.autoPortSetYn == "184")) {
	    				data.autoPortSetYn = "N";
	    			} 
	    			// BC-MUX, CWDM-MUX 링인경유  BCMUX, CWDMMUX 장비 이외의 장비에 대해서는 COM 포트 자동 셋팅 하지 않음
	    			else if (isSkbMuxRingOld() == true && data.autoPortSetYn == "Y" && data.neRoleCd != "183" && data.autoPortSetYn != "184") {
	    				data.autoPortSetYn = "N";
	    			}
	    			
	    			setEqpData(param, rowIndex, data, columnList, gridId);
	    			setLinkDataNull(rowIndex, gridId);
	    			
	    			var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					
					// row 추가
					if( (   nullToEmpty(focusData.SERVICE_ID) == "" && // 2018-09-12  3. RU고도화 
							nullToEmpty(focusData.TRUNK_ID) == "" && nullToEmpty(focusData.RING_ID) == "" && nullToEmpty(focusData.WDM_TRUNK_ID) == "")
							&& ( nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
	    					&& ( nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
						
						if(( lastData.SERVICE_ID != null || // 2018-09-12  3. RU고도화 
								lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
								|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
								|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(gridId);
						}
					}
					
					// 다음 구간의 좌장비를 동일하게 설정.
					if(param == "RIGHT") {
						var nextRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
						if(nextRowData.LEFT_NE_ID == null || nextRowData.LEFT_NE_ID == "" || nextRowData.LEFT_NE_ID == "DV00000000000") {
							setEqpData("LEFT", rowIndex+1, data, columnList, gridId);
							if (gridDivision == "serviceLine") {
								$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex+1}}, "SERVICE_NM");
							}
							$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex+1}}, "TRUNK_NM");
							$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex+1}}, "RING_NM");
							$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex+1}}, "WDM_TRUNK_NM");
						}
						
						// 링인데 다음 구간에 우장비가 있을 경우.
						if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001') {
							var addData = {};
							for(var key in nextRowData) {
								if(key.indexOf("RIGHT") == 0) {
									eval("addData." + key + " = nextRowData." + key);
									$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex+1}}, key);
								}
							}
							
							$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+2}});
							
//							addRowNullData(gridId);
//							var next2DataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+2 }})[0];
//							for(var nextRowKey in next2DataObj) {
//								$.each(addData, function(key,val) {
//							 		if(key == nextRowKey){
//							 			$('#'+gridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex+2}}, key);
//							 		} 
//							 	});
//							}
						} else {
							// 마지막 줄 추가
							if((lastData.SERVICE_ID != null || // 2018-09-12  3. RU고도화 
									lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
									|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
			    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
								addRowNullData(gridId);
							}
						}
						
					}
					
					if(param == "LEFT") {
						// 이전 구간의 우장비를 동일하게 설정.
						if(rowIndex > 0) {
							var prevRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
							if(prevRowData.RIGHT_NE_ID == null || prevRowData.RIGHT_NE_ID == "" || prevRowData.RIGHT_NE_ID == "DV00000000000") {
								setEqpData("RIGHT", rowIndex-1, data, columnList, gridId);
							}
						}
						
						// 링일경우 ADD를 입력하게 되면 DROP도 설정해준다.
						if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001') {
							if(rowIndex == 0) {
								var dropRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
								if(dropRowData.RIGHT_NE_ID == null || dropRowData.RIGHT_NE_ID == "" || dropRowData.RIGHT_NE_ID == "DV00000000000") {
									setEqpData("RIGHT", rowIndex+1, data, columnList, gridId);
								}
								
								addRowNullData(gridId);
							}
						}
							
						
						/*
						if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001' && topoSclCd == '002') {
							var nextRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
							if(nextRowData.RIGHT_NE_ID == null || nextRowData.RIGHT_NE_ID == "" || nextRowData.RIGHT_NE_ID == "DV00000000000") {
								setEqpData("RIGHT", rowIndex+1, data, columnList, gridId);
							}
							if((lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
									|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
			    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
								addRowNullData(gridId);
							}
						} else {
							// 아닐 때 - 이전 구간의 우장비를 동일하게 설정.
							if(rowIndex > 0) {
								var prevRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
								if(prevRowData.RIGHT_NE_ID == null || prevRowData.RIGHT_NE_ID == "" || prevRowData.RIGHT_NE_ID == "DV00000000000") {
									setEqpData("RIGHT", rowIndex-1, data, columnList, gridId);
								}
							}
						}
						*/
					}
					
					$("#"+gridId).alopexGrid("endEdit");
					$("#"+gridId).alopexGrid("startEdit");
					
					orgChk(gridId);
					errorDataChk(gridId);
					
					var colNm = param + "_NE_NM";
					$('#'+gridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, colNm );
				}
			}
		});
	}
	
}

/**
 * Function Name : openPortListPop
 * Description   : 포트 검색
 * ----------------------------------------------------------------------------------------------------
 * param    	 : PortId. 포트 아이디
 *                 PortNm. 포트명
 *                 neId. 장비 아이디
 *                 searchPortNm. 검색할 포트 명
 *                 leftRight. 좌포트 우포트 구분
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openPortListPop(neId, portId, searchPortNm, param, gridId){
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	
	if(checkOpenPopYn(gridId)) {
		var paramData = new Object();
		$.extend(paramData,{"neId":nullToEmpty(neId)});
		$.extend(paramData,{"portNm":nullToEmpty(searchPortNm)});
		$.extend(paramData,{"portId":nullToEmpty(portId)});
		
		// ne_role_cd, ntwk_line_no
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		if(gridDivision == "serviceLine") {
			$.extend(paramData,{"isService":true});
			$.extend(paramData,{"svlnNo": baseNtwkLineNo});
			$.extend(paramData,{"svlnLclCd": svlnLclCd});
			$.extend(paramData,{"svlnSclCd": svlnSclCd});
		} else {
			$.extend(paramData,{"isService":false});
			$.extend(paramData,{"ntwkLineNo": baseNtwkLineNo});
			$.extend(paramData,{"topoLclCd": topoLclCd});
			$.extend(paramData,{"topoSclCd": topoSclCd});
			$.extend(paramData,{"topologyType": topoCfgMeansCd});
		}
		
		$a.popup({
		  	popid: "popPortListSch" + param,
		  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
		  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
		  	data: paramData,
		  	iframe:true,
			modal: true,
			movable:true,
//			windowpopup : true,
			width : 1100,
			height : 740,
			callback:function(data){
				if(data != null && data.length > 0) {
					// 포트 column set
	    			var txColumnList = [  
		    			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
		    			                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
		    			                  , "PORT_USE_TYPE_NM", "CARD_WAVELENGTH", "CARD_MODEL_ID", "CARD_MODEL_NM"
	    			                  ];
	    			// tx구간 set
	    			// 5GSmux / 5G-PON 2.0/ 3.1 CRN 이고 광코어인경우
	    			if ((nullToEmpty(data[0].isFGSmux) == true  || nullToEmpty(data[0].isFGCrn) == true) && isRuCoreLineOld() == true) {
	    				data[0].channelDescr = "";
	    			}
	    			
	    			// 가입자망 링이면서 BC-MUX 장비인 경우
	    			if (nullToEmpty(data[0].isBcCwMux) == true && isSubScriRingOld() == true) {
	    				data[0].channelDescr = "";
	    			}
					setEqpData(param, rowIndex, data[0], txColumnList, gridId);
	    								
	    			if(data.length > 1){
	    				// rx구간 set
	    				var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	    				var rxParam = param+"_RX";
	    				setEqpData(rxParam, rowIndex, data[1], rxColumnList, gridId);
	    				
	    				// port descr set
	    				var portDescr = makeTxRxPortDescr(data[0].portNm, data[1].portNm);
	    				$('#'+gridId).alopexGrid( "cellEdit", portDescr, {_index : { row : rowIndex}}, param+"_PORT_DESCR");
	    				
	    				//RIGHT_RX_PORT_NM
	    				var rxPortNm = data[1].portNm;
						$('#'+gridId).alopexGrid('cellEdit', rxPortNm, {_index : { row : rowIndex}}, param+'_RX_PORT_NM');
	    				
	    				// rx구간의 장비set
	    				var rxSctnColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	    				var rxSctnParam = (param == "LEFT" ? "RIGHT" : "LEFT");
	    				var rxSctnData = {"portId" : eval("focusData." + rxSctnParam + "_PORT_ID")
	    						, "portNm" : eval("focusData." + rxSctnParam + "_PORT_NM"), "portDescr" : eval("focusData." + rxSctnParam + "_PORT_DESCR")
	    						, "portStatusCd" : eval("focusData." + rxSctnParam + "_PORT_STATUS_CD"), "portStatusNm" : eval("focusData." + rxSctnParam + "_PORT_STATUS_NM")
	    						, "portDummy" : eval("focusData." + rxSctnParam + "_PORT_DUMMY"), "neId" : eval("focusData." + rxSctnParam + "_NE_ID")
	    						, "neNm" : eval("focusData." + rxSctnParam + "_NE_NM")};
	    				
	    				if(param == "LEFT") {
//	    					setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
	    				} else if(param == "RIGHT") {
	    					if(eval("focusData." + rxSctnParam + "_RX" + "_PORT_ID") == null) {
	    						setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList, gridId);
	        				}
	    				}
	    			}else{
	    				var rxflag = param + "_RX_";
	        			var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	        			$.each(rxColumnList, function(key,val){
	    					$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
	    				});
	    			}
	    			
	    			// FDF장비인지 체크
	    			var currRowData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
					var prevRowData = "";
					if(rowIndex > 0) {
						prevRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
					} 
					var nextRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
					
					var fdfNeYn = false;
					var rotnNeYn = false;
					var generateLeft = true;
					if(param == "LEFT") {
						// PBOX 추가  2019-12-24
						// ROTN 추가  2021-10-13
						if(currRowData.LEFT_NE_ROLE_CD == '11' || currRowData.LEFT_NE_ROLE_CD == '162' 
							|| currRowData.LEFT_NE_ROLE_CD == '177' || currRowData.LEFT_NE_ROLE_CD == '178' || currRowData.LEFT_NE_ROLE_CD == '182'
								|| currRowData.LEFT_NE_ROLE_CD == '08') {
							fdfNeYn = true;
							rotnNeYn = true;
							generateLeft = true;
						}
					} else if(param == "RIGHT") {
						if(currRowData.RIGHT_NE_ROLE_CD == '11' || currRowData.RIGHT_NE_ROLE_CD == '162' 
							|| currRowData.RIGHT_NE_ROLE_CD == '177' || currRowData.RIGHT_NE_ROLE_CD == '178' || currRowData.RIGHT_NE_ROLE_CD == '182'
								|| currRowData.RIGHT_NE_ROLE_CD == '08') {
							fdfNeYn = true;
							rotnNeYn = true;
							generateLeft = false;
						}
					}
					
					if(fdfNeYn == true || rotnNeYn == true) {
						// FDF 장비
						if(generateLeft) {
							// 좌장비 입력
							var setIndex = 0;
							if(rowIndex == 0 || nullToEmpty(prevRowData.RIGNT_NE_ID != "") ) {
								if(currRowData.LEFT_NE_ID == nullToEmpty(prevRowData.RIGHT_NE_ID)) {
									setIndex = rowIndex -1;
								} else {
									var addData = {};
									$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
									$("#"+gridId).alopexGrid("startEdit");
									if(rowIndex == 0) setIndex = 0;
									else setIndex = rowIndex;
								}
							} else if(currRowData.LEFT_NE_ID == prevRowData.RIGHT_NE_ID) {
								setIndex = rowIndex -1;
							} else {
								setIndex = rowIndex -1;
							}
							
							for(var key in currRowData) {
								if(key.indexOf("LEFT") == 0) {
									var length = key.length;
									$('#'+gridId).alopexGrid( "cellEdit", eval("currRowData." + key), {_index : { row : setIndex}}, "RIGHT" + key.substring(4, length));
								}
							}
						} else {
							// 우장비 입력
							var setIndex = 0;
							if(rowIndex == 0 || nullToEmpty(nextRowData.LEFT_NE_ID != "") ) {
								if(currRowData.RIGHT_NE_ID == nullToEmpty(nextRowData.LEFT_NE_ID)) {
									setIndex = rowIndex +1;
								} else {
									var addData = {};
									$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
									$("#"+gridId).alopexGrid("startEdit");
									if(rowIndex == 0) setIndex = 0;
									else setIndex = rowIndex;
								}
							} else if(currRowData.RIGHT_NE_ID == nextRowData.LEFT_NE_ID) {
								setIndex = rowIndex +1;
							} else {
								setIndex = rowIndex +1;
							}
							
							for(var key in currRowData) {
								if(key.indexOf("RIGHT") == 0) {
									var length = key.length;
									$('#'+gridId).alopexGrid( "cellEdit", eval("currRowData." + key), {_index : { row : setIndex}}, "LEFT" + key.substring(5, length));
								}
							}
						}
					}

	    			// 5G-PON 2.0 CrN인 경우 혹은 가입자망링에서 BC-MUX / CWDM-MUX 장비를 설정하는 경우
	    			if ((nullToEmpty(data[0].isFGCrn) == true && isFiveGponRuCoreOld() == true)
	    				 || (nullToEmpty(data[0].isBcCwMux) == true && isSubScriRingOld() == true)) {
	    				var channelVal = "";
						var channelIds = [];
						for(var i = 0; i < data.length; i++) {
							if(i == 0) channelVal += "("; 
							channelVal += nullToEmpty(data[i].portWaveNm);
							if(i < (data.length-1) && nullToEmpty(data[i].portWaveNm) != "") channelVal += "/";
							if(i == data.length-1) channelVal += ")"; 
							
							var temp = {"EQP_MDL_ID" : data[i].eqpMdlId, "EQP_MDL_DTL_SRNO" : data[i].eqpMdlDtlSrno};
							if (nullToEmpty(data[i].eqpMdlDtlSrno) != "") {
								channelIds.push(temp);
							}
						}
						
						channelVal = channelVal.replace("()", "");
						
	    				$('#'+gridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, param + '_CHANNEL_DESCR');
						$('#'+gridId).alopexGrid('cellEdit', channelVal, {_index : { row : rowIndex}}, param + '_CHANNEL_DESCR');
						$('#'+gridId).alopexGrid('cellEdit', channelIds, {_index : { row : rowIndex}}, param + '_CHANNEL_IDS');
	    				//data[0].cardWavelength = data[0].portWaveNm;
	    			}
	    			
					if(gridId == reserveGrid) {
						var colNm = param + "_PORT_DESCR";
						$('#'+gridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, colNm );
					}
				}
			}
		}); 
	}
}

/**
 * Function Name : openFdfListPop
 * Description   : FDF선로 검색
 * ----------------------------------------------------------------------------------------------------
 * param    	 : lineNo. 회선 또는 네트워크ID
 * ----------------------------------------------------------------------------------------------------
 */
function openFdfListPop(lineNo) {
	 
	$a.popup({
		popid: "EqpNodeInfPop",
		title: "장비/선로정보" /*수집회선 비교*/,
		url: 'EqpNodeInfPop.do',
		data: {"svlnNo":lineNo},
		iframe: true,
		modal : true,
		movable:false,
		windowpopup : true,
		width : 860,
		height : 400
		,callback:function(data){
			var eteSussYn = "N";
			var fdfCnt = 0;
			
			var originalData = $('#'+detailGridId).alopexGrid("dataGet");
			var originalIndex = originalData.length - 1;
					
			if(data != null){
				
				$('#'+detailGridId).alopexGrid("focusCell", {_index : {data : 0}}, 'RIGHT_NE_NM' );
				var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}}[0]);
	    		var rowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData[0]._index.row); //- 0
    			var dataRowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData.length);
				var dataList = AlopexGrid.trimData(focusData)[rowIndex];
				
				var param = "RIGHT";
	    		// 장비 data 초기화 column set
				var columnList = [];		
    			for(var key in dataList) {
    				if(key.indexOf(param) == 0) {
    					columnList.push(key.replace(param+"_", ""));
    				}
    			}

    			var rowFstIndex = dataRowIndex - 1;
    			var lowCnt = 0;
				if(data.length > 0) {
					for(var i=0; i < data.length; i++){
						eteSussYn = data[i].eteSussYn;
						if(eteSussYn == "Y") {
							//ETE가 성공된 경우 ETE연결을 시켜줘야 함. 하위국 기준으로만 장비 셋팅후 ETE연결
							//그냥하면 중복으로 장비가 셋팅됨
							if(data[i].eqpStatus == "LOW") {
								$("#"+detailGridId).alopexGrid("startEdit");
								setEqpData(param, rowFstIndex, data[i], columnList, detailGridId);
								if(nullToEmpty(data[i].rxPortId) != '') {
									rxPortDataSet(param, rowFstIndex, data[i], columnList, detailGridId);
								}
								addRowNullData(detailGridId);
								$("#"+detailGridId).alopexGrid("startEdit");
								setEqpData("LEFT", rowFstIndex+1, data[i], columnList, detailGridId);
								if(nullToEmpty(data[i].rxPortId) != '') {
									rxPortDataSet("LEFT", rowFstIndex+1, data[i], columnList, detailGridId);
								}
								rowFstIndex = rowFstIndex + 1;
							}
						} else {
							$("#"+detailGridId).alopexGrid("startEdit");
							setEqpData(param, rowFstIndex, data[i], columnList, detailGridId);
							if(nullToEmpty(data[i].rxPortId) != '') {
								rxPortDataSet(param, rowFstIndex, data[i], columnList, detailGridId);
							}
							addRowNullData(detailGridId);
							$("#"+detailGridId).alopexGrid("startEdit");
							setEqpData("LEFT", rowFstIndex+1, data[i], columnList, detailGridId);
							if(nullToEmpty(data[i].rxPortId) != '') {
								rxPortDataSet("LEFT", rowFstIndex+1, data[i], columnList, detailGridId);
							}
							rowFstIndex = rowFstIndex + 1;
						}
					}
					fdfCnt = rowFstIndex;
				}
			}
			
			//ETE연결성공여부가 Y인 경우 ETE를 연결시켜준다
			if(eteSussYn == "Y") {
				var fdfEteCnt = fdfCnt;
				var data = $('#'+detailGridId).alopexGrid("dataGet", {_index : { data:fdfEteCnt}})[0];
				
				e2eAppltyAuto(data, 'LEFT_PORT_DESCR', detailGridId, fdfEteCnt, "AUTO");
			}
		}
	});
};

/**
 * Function Name : setOLTEqp
 * Description   : 상위OLT장비 조회
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 네트워크ID, 그룹ID, FDF정보
 * ----------------------------------------------------------------------------------------------------
 */
function setOLTEqp(param) {
	 
	cflineShowProgressBody();
	var dataParam = param;
	httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectOltEqpInf', dataParam, 'GET', 'selectOltEqpInf');

};

/**
 * 상위 OLT장비 설정 (가입자망링 자동검색)
 * @param data
 * @param gridId
 */
function openOltEpqListPop(data, gridId) {
	
	$a.popup({
		popid: "OltEqpInfPop",
		title: "상위OLT장비정보",
		url: 'OltEqpInfPop.do',
		data: {"data":data},
		iframe: true,
		modal : true,
		movable:false,
		windowpopup : true,
		width : 700,
		height : 500
		,callback:function(data){
			cflineHideProgressBody();
			if(data != null){
				//팝업에서 선택한 OLT그리드정보셋팅
				var result = setOtlEqpInfoToGrid(data, detailGridId);
				if(!result) {
					alertBox("W", "상위OLT장비설정에 문제가 발생하였습니다.<br>관리자에게 문의바랍니다.");
				}
			}
		}
	});
};

/* 
 * 그리드에서 선택한 OTL장비 정보를 셋팅
 * 
 */
function setOtlEqpInfoToGrid(response, currGridId) {
	var result = false;
	var rowIndex = -1;
	// 장비구간의 우장비 정보 조회
	var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}}[0]);
	var rowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData[0]._index.row); //- 0
	
	var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	//rowIndex = focusData._index.row; 
	
	var addDataList = [];
	
	var chRxPortYn = false;
	
	for(var i = 0; i < response.length; i++) {
		var addData = {};
		for(var key in response[i]) {
			eval("addData." + key + " = response[i]." + key);
			
			if (nullToEmpty(response[i].lftRxPortId) != "" || nullToEmpty(response[i].rghtRxPortId) != "") {
				chRxPortYn = true;
			}
		}
		addDataList.push(addData);
	}
	/*노드삽입 기능추가 */
	sectionSeparation2(currGridId);
	
	for(var i = 0; i < addDataList.length; i++) {
		// OLT장비 정보 셋팅
		setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "R", chRxPortYn);
		// OLT장비 정보 셋팅
		setPathOfEteInfoOfFdf(addDataList[i], currGridId, (rowIndex+1)+i, "L", chRxPortYn);

		result = true;
	}
	
	$("#"+currGridId).alopexGrid("startEdit");	

	// row 추가
	var lastRowIndex = $('#'+currGridId).alopexGrid("dataGet").length;
	var lastData = $('#'+currGridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
	
	cflineHideProgressBody();
	return result;
}

function sectionSeparation2(gridId) {

	var rowIndex = 0;
	var gridDataList = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	var addDataList = AlopexGrid.trimData(gridDataList);
	var addData = {};
	
	var keyParam = "RIGHT";
	for(var key in addDataList) {
		if(key.indexOf("RIGHT") == 0) {
			eval("addData." + key + " = addDataList." + key);
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
		}
	}
	
	setLinkDataNull(rowIndex, gridId);
	$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
	$("#"+gridId).alopexGrid("startEdit");
}

function rxPortDataSet(param, rowIndex, data, rxColumnList, gridId){

	
	// rx구간 set
	var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	var rxParam = param+"_RX";
	setEqpData(rxParam, rowIndex, data, rxColumnList, gridId);
	
	// port descr set
	var portDescr = data.portDescr;
	$('#'+gridId).alopexGrid( "cellEdit", data.portDescr, {_index : { row : rowIndex}}, param+"_PORT_DESCR");
	
	// rx구간의 장비set
	var rxSctnColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	var rxSctnParam = (param == "LEFT" ? "RIGHT" : "LEFT");
	var rxSctnData = {"portId" : data.rxPortId, "portDescr" : data.rxPortDescr
			, "portStatusCd" : data.rxPortStatusCd
			, "portStatusNm" : data.rxPortStatusNm
			, "portDummy" : data.rxPortDummy
			, "neId" : data.neId
			, "neNm" : data.neNm
			};
	
	if(param == "LEFT") {
//			setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
	} else if(param == "RIGHT") {
		//if((rxSctnParam + "_RX" + "_PORT_ID") == null) {
			setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList, gridId);
		//}
	}
}

/**
 * Function Name : openAutoClctPathListPop
 * Description   : 자동수집선번 팝업
 */
function openAutoClctPathListPop() {
	var mapping = columnMappingNetworkPath();
	var isService = (gridDivision == "serviceLine") ? true : false; 
	var param = { "ntwkLineNo" : baseNtwkLineNo, "userNtwkLnoGrpSrno": pathSameNo, "hideCol" : hideCol, "isService" : true};
	
	$.extend(param,{"mapping": mapping});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: 'AutoClctPathListPop',
	  	title: '자동수집선번 팝업',
	  	url: urlPath+'/configmgmt/cfline/AutoClctPathListPop.do',
	    data: param,
	    iframe: true,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1200,
	    height : 650,
	    callback:function(data){
	    	if(data != null){
//	    		var gridData = $('#'+detailGridId).alopexGrid("dataGet");
//	    		var lastIndex = gridData[gridData.length-1]._index.row;
	    		var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.row;
	    		
	    		$('#'+detailGridId).alopexGrid('dataAdd', data, {_index : {data : rowIndex}});
	    		$("#"+detailGridId).alopexGrid("startEdit");
	    	}
	    }	  
	});
}

/**
 * Function Name : setEqpData
 * Description   : 장비데이터set
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 구분자(LEFT, RIGHT)
 * rowIndex    	 : 데이터를 입력할 grid row
 * data    	 	 : 입력 데이터
 * columnList    : 변경 컬럼 array
 * ----------------------------------------------------------------------------------------------------
 */ 
function setEqpData(param, rowIndex, data, columnList, gridId){
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	for(var i=0; i < columnList.length; i++){
		var columnKey = columnList[i];
		
		// conversion
		var convertKey = columnKey.toLowerCase();
        convertKey = convertKey.replace(/_(\w)/g, function(word) {
            return word.toUpperCase();
        });
		convertKey = convertKey.replace(/_/g, "");
		
		var setValue = false;
		
		$.each(data, function(key,val){
	 		if(key == convertKey){
	 			//SKB회선중 카드명이 존재하는 경우 포트명에 포트명/카드명 과같이 표현해준다. 2025-03-26 이재락M
	 			if(mgmtGrpCd == "0002" && nullToEmpty(data.cardNm) != "" && key == "portDescr") {
	 				$('#'+gridId).alopexGrid( "cellEdit", val+"/"+data.cardNm, {_index : { row : rowIndex}}, param+"_"+columnKey);	
	 			} else {
	 				$('#'+gridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, param+"_"+columnKey);
	 			}
	 			setValue = true;
	 		}
	 			 		
	 		//autoPortSetYn : 자동셋팅할 포트가 있는경우 /autoSetPortId : 자동셋틩 포트 ID / autoSetPortNm : 자동셋팅 포트 NM
			//자동셋팅 모델 혹은 장비타임 추가가 필요할경우 장비 조회 쿼리수정필요	
	 		//장비셋팅시 포트동일하게 셋팅하므로 left / right 포트에 동일하게 com1 포트가 셋팅됨.
	 		// SMUX링 인 경우 SMUX장비 선택의 경우 COM 포트 자동 셋팅
	 		// BC-MUX / CWDM-MUX 링인경우 BC-MUX /CWDM-MUX 장비 선택시 COM 포트 자동 셋팅 
	 		var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
	 		if(key == "autoPortSetYn" && val == "Y" && (isSmuxRingOld() == true || isSkbMuxRingOld() == true) && nullToEmpty(data.autoSetPortId) != ""){
	 			$('#'+gridId).alopexGrid( "cellEdit", data.autoSetPortId, {_index : { row : rowIndex}}, param+"_PORT_ID");
	 			$('#'+gridId).alopexGrid( "cellEdit", data.autoSetPortNm, {_index : { row : rowIndex}}, param+"_PORT_DESCR");
	 		}
	 	});
		
		if(!setValue && columnKey != 'ADD_DROP_TYPE_CD'){
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param+"_"+columnKey);
		}
	}

	/* 2018-09-12  3. RU고도화 */ 
	setChangedMainPath(gridId);
}

function checkOpenPopYn(gridId) {
	// 팝업 오픈 여부 판단
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	
	var dataObj = AlopexGrid.parseEvent(event);
	var editing = dataObj.$cell.context.classList;
 	var editYn = false;
 	
 	for(var i = 0; i < editing.length; i++) {
 		if(editing[i] == 'editing') {
 			editYn = true;
 		}
 	}
 	
 	if(!editYn && !(focusData._state.editing == false)) {
 		return true;
 	} else {
 		return false;
 	}
}

/**
 * Function Name : addRow
 * Description   : 선번 편집 공통. 그리드 row 추가
 * ----------------------------------------------------------------------------------------------------
 * param    	 : btnShowArray. 편집기능이 활성화 될때 보여줄 버튼 ID 리스트
 *                 btnHideArray. 편집기능이 활성화 될때 숨여야될 버튼 ID 리스트
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function addRow(btnShowArray, btnHideArray) {
	if(nullToEmpty(btnShowArray) != "") {
		for(var show = 0; show < btnShowArray.length; show++) {
			$("#"+btnShowArray[show]).show();
		}
	}
	
	if(nullToEmpty(btnHideArray) != "") {
		for(var hide = 0; hide < btnHideArray.length; hide++) {
			$("#"+btnHideArray[hide]).hide();
		}
	}
	 
	initGridNetworkPathEdit();
//	addRowNullData();
	
	if(!$('#trunkDisplay').is(':checked')) {
		$('#'+detailGridId).alopexGrid('hideCol', 'TRUNK_NM');
	}
	
	if(!$('#wdmTrunkDisplay').is(':checked')) {
		$('#'+detailGridId).alopexGrid('hideCol', 'WDM_TRUNK_NM');
	}
	
	// 컬럼 업데이트 모드
	$("#"+detailGridId).alopexGrid("startEdit");
	$('#'+detailGridId).alopexGrid("viewUpdate");
	
	setEqpEventListener();
}

function initGridNetworkPathEdit(gridId) {
	
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	// 2019-01-15  4. 5G-PON고도화 5G-PON RU회선의 경우 예비선번은 편집 할 수 없게 함
	if (isFiveGponRuCoreOld() == true && gridId == reserveGrid) {
		return;
	}
	
	var columnEdit = columnMappingNetworkPathEdit();
	
	var groupColumn = groupingColumnNetworkPath();
		
	$('#'+gridId).alopexGrid("updateOption", {
		rowSingleSelect : false,
		rowInlineEdit: true,
		rowClickSelect : false,
		cellInlineEdit : true,
		cellSelectable : true,		
		multiRowDragDrop: true,
//		headerGroup : headerGroup,
		enableDefaultContextMenu:false,
		enableContextMenu:true,
//		wrapCellContent:true,
		contextMenu : [
		               {
							title: cflineMsgArray['lineDelete'],		/* 선번 삭제 */
						    processor: function(data, $cell, grid) {
						    	deletePath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	return contextMenuYn(gridId);
						    	//ADAMS 고도화 - 관리주체가 TANGO인 경우에만 편집가능 그룹일경우 제외 2020.04.01
						    	//TODO 이전으로 20240911
						    	//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//						    	if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//					    			return contextMenuYn(gridId);
//					    		} else {
//					    			//
//					    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//				    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//				    					 ||
//					    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//					    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//					    				) {
//					    				return contextMenuYn(gridId);
//					    			} else {
//					    				if(nullToEmpty(svlnLclCd) == "004") {
//					    					return contextMenuYn(gridId);
//					    				} else {
//					    					return false;
//					    				}
//					    			}
//					    		}	
						    }
					   },
					   {
							title: cflineMsgArray['save'],				/* 저장 */
						    processor: function(data, $cell, grid) {
						    	//preSavePath();  // 저장전 사전체크작업
						    	btnSavePath();  // 저장버튼 클릭
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
					   },
					   {
							title: '빈 ' + cflineMsgArray['sectionInsert'],		/* 구간 삽입 */
						    processor: function(data, $cell, grid) {
						    	sectionInsert(data, $cell, gridId);
						    	/* 2018-09-12  3. RU고도화 */ 
						    	setChangedMainPath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.SERVICE_ID == null  // 2018-09-12  3. RU고도화
						    			&& data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		return contextMenuYn(gridId);
						    	} else {
						    		return false;
						    	}
						    }
//						    ,seperator:true
					   },
					   {
							title: cflineMsgArray['sectionMerge'],		/* 구간 병합 */
						    processor: function(data, $cell, grid) {
						    	sectionMerge(data, $cell, gridId);	
						    	// setChangedMainPath(gridId); <= sectionMerge()에서 호출함
						    },
						    use: function(data, $cell, grid) {
						    	if(data.SERVICE_ID == null &&  // 2018-09-12  3. RU고도화
						    			data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		return contextMenuYn(gridId);
						    		//ADAMS 고도화 - SKB 그룹일경우 제외 2020.04.01
						    		//TODO 이전으로 20240911
						    		//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//						    		if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//						    			return contextMenuYn(gridId);
//						    		} else {
//						    			//
//						    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//					    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//						    				||
//						    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//						    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//						    				) {
//						    				return contextMenuYn(gridId);
//						    			} else {
//						    				if(nullToEmpty(svlnLclCd) == "004") {
//						    					return contextMenuYn(gridId);
//						    				} else {
//						    					return false;
//						    				}
//						    			}
//						    		}	
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['sectionReverse'],	/* 구간 뒤집기 */
						    processor: function(data, $cell, grid) {
						    	reverseLink(data, $cell, gridId);
						    	/* 2018-09-12  3. RU고도화 */ 
						    	setChangedMainPath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.SERVICE_ID == null && // 2018-09-12  3. RU고도화
						    			data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		return contextMenuYn(gridId);
						    		//ADAMS 고도화 - SKB 그룹일경우 제외 2020.04.01
						    		//TODO 이전으로 20240911
						    		//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//						    		if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//						    			return contextMenuYn(gridId);
//						    		} else {
//						    			//
//						    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//					    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//						    				||
//						    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//						    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//						    				) {
//						    				return contextMenuYn(gridId);
//						    			} else {
//						    				if(nullToEmpty(svlnLclCd) == "004") {
//						    					return contextMenuYn(gridId);
//						    				} else {
//						    					return false;
//						    				}
//						    			}
//						    		}	
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['nodeInsert'],		/* 구간 분리 -> 명칭변경 : 노드 삽입 */
						    processor: function(data, $cell, grid) {
						    	sectionSeparation(data, $cell, gridId);
						    	/* 2018-09-12  3. RU고도화 */ 
						    	setChangedMainPath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.SERVICE_ID == null && // 2018-09-12  3. RU고도화
						    			data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		return contextMenuYn(gridId);
						    		//ADAMS 고도화 - SKB 그룹일경우 제외 2020.04.01
						    		//TODO 이전으로 20240911
						    		//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//						    		if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//						    			return contextMenuYn(gridId);
//						    		} else {
//						    			//
//						    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//					    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//						    				||
//						    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//						    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//						    				) {
//						    				return contextMenuYn(gridId);
//						    			} else {
//						    				if(nullToEmpty(svlnLclCd) == "004") {
//						    					return contextMenuYn(gridId);
//						    				} else {
//						    					return false;
//						    				}
//						    			}
//						    		}	
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['nodeDelete'],		/* 노드 삭제 */
						    processor: function(data, $cell, grid) {
						    	nodeDelete(data, $cell, gridId);
						    	/* 2018-09-12  3. RU고도화 */ 
						    	setChangedMainPath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.SERVICE_ID == null && // 2018-09-12  3. RU고도화
						    			data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		
						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
						    			return false;
						    		} else {
						    			return contextMenuYn(gridId);
							    		//ADAMS 고도화 - SKB 그룹일경우 제외 2020.04.01
						    			//TODO 이전으로 20240911
						    			//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//						    			if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//							    			return contextMenuYn(gridId);
//							    		} else {
//							    			//
//							    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//						    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//							    				||
//							    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//							    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//							    				) {
//							    				return contextMenuYn(gridId);
//							    			} else {
//							    				if(nullToEmpty(svlnLclCd) == "004") {
//							    					return contextMenuYn(gridId);
//							    				} else {
//							    					return false;
//							    				}
//							    			}
//							    		}	
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['nodeCopy'],		/* 노드 복사 */
						    processor: function(data, $cell, grid) {
						    	nodeCopy(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data._key == "LEFT_NE_NM" || data._key == "RIGHT_NE_NM") {
						    		return contextMenuYn(gridId);
						    		//ADAMS 고도화 - SKB 그룹일경우 제외 2020.04.01
						    		//TODO 이전으로 20240911
						    		//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//						    		if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//						    			return contextMenuYn(gridId);
//						    		} else {
//						    			//
//						    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//					    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//						    				||
//						    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//						    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//						    				) {
//						    				return contextMenuYn(gridId);
//						    			} else {
//						    				if(nullToEmpty(svlnLclCd) == "004") {
//						    					return contextMenuYn(gridId);
//						    				} else {
//						    					return false;
//						    				}
//						    			}
//						    			
//						    		}
						    	} else {
						    		return false;
						    	}
						    	
						    }
					   },
					   {
							title: cflineMsgArray['nodeCut'],		/* 노드 잘라내기 */
						    processor: function(data, $cell, grid) {
						    	nodeCut(data, $cell, gridId);
						    	/* 2018-09-12  3. RU고도화 */ 
						    	setChangedMainPath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.SERVICE_ID == null &&// 2018-09-12  3. RU고도화
						    			data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
							    	if(data._key == "LEFT_NE_NM" || data._key == "RIGHT_NE_NM") {
							    		return contextMenuYn(gridId);
							    		//ADAMS 고도화 - SKB 그룹일경우 제외 2020.04.01
							    		//TODO 이전으로 20240911
							    		//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//							    		if($("#mgmtGrpCd").val() == "0001" || (topoSclCd == '030' || topoSclCd == '031')) {
//							    			return contextMenuYn(gridId);
//							    		} else {
//							    			//
//							    			if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
//						    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
//							    				||
//							    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
//							    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
//							    				) {
//							    				return contextMenuYn(gridId);
//							    			} else {
//							    				if(nullToEmpty(svlnLclCd) == "004") {
//							    					return contextMenuYn(gridId);
//							    				} else {
//							    					return false;
//							    				}
//							    			}
//							    		}
							    	}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['nodePaste'],		/* 노드 붙여넣기 */
						    processor: function(data, $cell, grid) {
						    	if($("#copyCut").val() == "copy") {
						    		nodeCopyPaste(data, $cell, gridId);
						    		setChangedMainPath(gridId);
						    	} else if($("#copyCut").val() == "cut") {
						    		nodeCutPaste(data, $cell, gridId);
							    	/* 2018-09-12  3. RU고도화 */ 
						    		setChangedMainPath(gridId);
						    	}
						    	
						    },
						    use: function(data, $cell, grid) {
						    	if($("#copyCut").val() != "") {
						    		return contextMenuYn(gridId);
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['cancel'],		/* 취소 */
						    processor: function(data, $cell, grid) {
						    	nodeCopyCutCancle(data, $cell, gridId);
						    	/* 2018-09-12  3. RU고도화 */ 
						    	setChangedMainPath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if($("#copyCut").val() != "") {
						    		return contextMenuYn(gridId);
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['eteApply'],		/* E2E추가 */
						    processor: function(data, $cell, grid) {
						    	e2eApplty(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data._key == 'LEFT_PORT_DESCR') {
						    		if(data.LEFT_PORT_DESCR != null && data.LEFT_PORT_DESCR != "") {
						    			if(data.LEFT_NE_ROLE_CD == '11' || data.LEFT_NE_ROLE_CD == '162' 
											|| data.LEFT_NE_ROLE_CD == '177' || data.LEFT_NE_ROLE_CD == '178' || data.LEFT_NE_ROLE_CD == '182') {
						    				return true;
						    			} else {
						    				return false;
						    			}
						    		}  else {
						    			return false;
						    		}
						    	} else if(data._key == 'RIGHT_PORT_DESCR') {
						    		if(data.RIGHT_PORT_DESCR != null && data.RIGHT_PORT_DESCR != "") {
						    			if(data.RIGHT_NE_ROLE_CD == '11' || data.RIGHT_NE_ROLE_CD == '162' 
											|| data.RIGHT_NE_ROLE_CD == '177' || data.RIGHT_NE_ROLE_CD == '178' || data.RIGHT_NE_ROLE_CD == '182') {
						    				return true;
						    			} else {
						    				return false;
						    			}
						    		} else {
						    			return false;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   /*
					   {
							title: cflineMsgArray['equipmentCopy'],		// 장비 복사
						    processor: function(data, $cell, grid) {
						    	equipmentCopy(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data._key == "LEFT_NE_NM" || data._key == "RIGHT_NE_NM") { 
						    		return true;
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['equipmentPaste'],		// 장비 붙여넣기
						    processor: function(data, $cell, grid) {
						    	equipmentPaste(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if($cell.find('input').length > 0) {
						    		if(data._key == "LEFT_NE_NM"  || data._key == "RIGHT_NE_NM") {
						    			return true;
						    		} else {
						    			return false;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['portCopy'],		// 포트 복사
						    processor: function(data, $cell, grid) {
						    	portCopy(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data._key == "LEFT_PORT_DESCR"  || data._key == "RIGHT_PORT_DESCR") {
						    		return true;
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['portPaste'],		// 포트 붙여넣기
						    processor: function(data, $cell, grid) {
						    	portPaste(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if($cell.find('input').length > 0) {
						    		if(data._key == "LEFT_NE_NM" || data._key == "RIGHT_NE_NM") { 
						    			return false;
						    		} else if(data._key == "LEFT_PORT_DESCR") {
						    			if(nullToEmpty(data.LEFT_NE_ID) != "") return true;
						    			else return false;
						    		} else if(data._key == "RIGHT_PORT_DESCR") {
						    			if(nullToEmpty(data.RIGHT_NE_ID) != "") return true;
						    			else return false;
						    		} else {
						    			return false;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   */
//					   {
//							title: cflineMsgArray['equipmentUp'],		/* 장비 위로 */
//						    processor: function(data, $cell, grid) {
//						    	equipmentUp(data, $cell, gridId);
//						    },
//						    use: function(data, $cell, grid) {
//						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
//						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
//						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
//						    			return false;
//						    		} else {
//						    			// ADD, DROP구간 이동 불가
//						    			if( (data.LEFT_ADD_DROP_TYPE_CD == 'N' && data.RIGHT_ADD_DROP_TYPE_CD == 'A') 
//						    					|| (data.LEFT_ADD_DROP_TYPE_CD == 'D' && data.RIGHT_ADD_DROP_TYPE_CD == 'N')) {
//						    				return false;
//						    			} else {
//						    				return true;
//						    			}
//						    		}
//						    	} else {
//						    		return false;
//						    	}
//						    }
//					   },
//					   {
//							title: cflineMsgArray['equipmentDown'],		/* 장비 아래로 */
//						    processor: function(data, $cell, grid) {
//						    	equipmentDown(data, $cell, gridId);
//						    },
//						    use: function(data, $cell, grid) {
//						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
//						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
//						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
//						    			return false;
//						    		} else {
//						    			// ADD, DROP구간 이동 불가
//						    			if( (data.LEFT_ADD_DROP_TYPE_CD == 'N' && data.RIGHT_ADD_DROP_TYPE_CD == 'A') 
//						    					|| (data.LEFT_ADD_DROP_TYPE_CD == 'D' && data.RIGHT_ADD_DROP_TYPE_CD == 'N')) {
//						    				return false;
//						    			} else {
//						    				return true;
//						    			}
//						    		}
//						    	} else {
//						    		return false;
//						    	}
//						    }
//					   },
//					   {
//							title: cflineMsgArray['equipmentASide'],		/* 장비 옆으로 */
//						    processor: function(data, $cell, grid) {
//						    	equipmentASide(data, $cell, gridId);
//						    },
//						    use: function(data, $cell, grid) {
//						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
//						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
//						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
//						    			return false;
//						    		} else {
//						    			// ADD, DROP구간 이동 불가
//						    			if( (data.LEFT_ADD_DROP_TYPE_CD == 'N' && data.RIGHT_ADD_DROP_TYPE_CD == 'A') 
//						    					|| (data.LEFT_ADD_DROP_TYPE_CD == 'D' && data.RIGHT_ADD_DROP_TYPE_CD == 'N')) {
//						    				return false;
//						    			} else {
//						    				return true;
//						    			}
//						    		}
//						    	} else {
//						    		return false;
//						    	}
//						    }
//					   },
//					   {
//							title: cflineMsgArray['RingSuperSubStaionDirectionConvert'],			/* 링 상하위국 방향전환 */
//						    processor: function(data, $cell, grid) {
//						    	alertBox('W', '2차 개발범위입니다.');
//						    },
//						    use: function(data, $cell, grid) {
//						    	return true;
//						    }
//					   },
//					   {
//							title: cflineMsgArray['portBatchApply'],	/* 포트 일괄적용 */
//						    processor: function(data, $cell, grid) {
//						    	alertBox('W', '2차 개발범위입니다.');
//						    },
//						    use: function(data, $cell, grid) {
//						    	return true;
//						    }
//					   },
					   {
						   	title: cflineMsgArray['wavelength'],		/* 커플러 */
						   	processor: function(data, $cell, grid) {
						    	openCouplerPop(data, $cell, grid);
						    },
						    use: function(data, $cell, grid) {
						    	if( (typeof topoLclCd != "undefined") && topoLclCd == '001') {
						    		if(data._key == 'LEFT_CHANNEL_DESCR') { //  && data.LEFT_NE_ROLE_CD == '16' 
							    		return true;
							    	} else if(data._key == 'RIGHT_CHANNEL_DESCR') { //  && data.RIGHT_NE_ROLE_CD == '16'
							    		return true;
							    	} else {
							    		return false;
							    	}
						    	} else {
						    		return false;
						    	}
						    }
//						    , seperator: true
					   }
//					   {
//							title: cflineMsgArray['remark'],		/* 비고 */
//						    processor: function(data, $cell, grid) {
//						    	openEqpRemarkPop(data, $cell, grid);
//						    },
//						    use: function(data, $cell, grid) {
//						    	if(data != null) {
//							    	if(data._key == 'LEFT_NE_NM' || data._key == 'RIGHT_NE_NM') {
//							    		return true;
//							    	} else {
//							    		return false;
//							    	}
//						    	}
//						    }
//					   }
					   ,{  // 2019-01-15  4. 5G-PON고도화
						   /*
						    * EAST DU-L장비에 연결된 WEST장비가 없는 경우 메뉴가 활성화 된다.
						    * DU-L장비의 국사정보에 연결된  CRN장비, FDF장비(ETE연결)정보를 자동 연결해서 셋팅해준다
						    */
							title: "DU-L연결장비 설정",		/* DU-L연결장비 설정 */
						    processor: function(data, $cell, grid) {
						    	var srchParam = {
			    						"dulMtsoId" : data.RIGHT_ORG_ID
				    				   , "dulMtsoIdNm" : data.RIGHT_ORG_NM
			    					   , "lowMtsoId" : nullToEmpty(baseInfData.lowMtsoId)
			    					   , "lowMtsoIdNm" : nullToEmpty(baseInfData.lowMtsoIdNm)
			    					   , "fiveGponVer" : nullToEmpty(baseInfData.fiveGponVer)
			    					   , "fiveGponEqpType" : "CRN"
			    				}
			    				
								openEqpListOfMtsoPop(srchParam, gridId, data._index.row);
						    },
						    use: function(data, $cell, grid) {
						    	if(data._key == 'RIGHT_NE_NM') {
						    		if(isFiveGponRuCoreOld() == true && nullToEmpty(data.RIGHT_FIVE_GPON_EQP_TYPE) != "" && data.RIGHT_FIVE_GPON_EQP_TYPE == "DUL" 
						    			&& (nullToEmpty(data.LEFT_NE_ID) == "" || nullToEmpty(data.LEFT_NE_ID) == "DV00000000000")) {
						    			return true;
						    		} else {
						    			return false;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   }
					   ,{  // 2021-01-13 FDF장비를 선택했을 경우에만 메뉴 활성화
							title: "FDF포트정보확인",		/* FDF포트정보확인 */
						    processor: function(data, $cell, grid) {
						    	openFdfCardInfoPop(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(baseInfData.topoLclCd == "002" && baseInfData.topoLclCd != undefined && baseInfData.mgmtGrpCd == "0001") {
							    	if(data._key == 'LEFT_NE_NM') {
							    		if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
					    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")) {
							    			return true;
							    		} else {
							    			return false;
							    		}
							    	} else if(data._key == 'RIGHT_NE_NM') {
							    		if((data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
					    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")) {
							    			return true;
							    		} else {
							    			return false;
							    		}
							    	} else {
					    				return false;
					    			}
						    	} else {
						    		return false;
						    	}
						    }
					   }
					 
		]
		, columnMapping : columnEdit
		//1. [수정] RU광코어 링/예비선번 사용
		, grouping : groupColumn
		, rowspanGroupSelect: true
		, fitTableWidth: true
		, fillUndefinedKey : null
		, numberingColumnFromZero: false
		, autoResize: true
		, message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
		}
	});
	
	if (gridId == reserveGrid) {
		// RU회선-광코어
		if (isRuCoreLineOld() == true) {
			$('#'+gridId).alopexGrid('showCol', ['SERVICE_NM']);
		}
	}
}

function contextMenuYn(gridId) {
	var dataLength =  $('#'+gridId).alopexGrid("dataGet", { _state : { selected : true }});
	if(dataLength.length > 1) {
		return false;
	} else {
		return true;
	}
}

function addRowNullData(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	var addData = {};
//	$("#"+gridId).alopexGrid('clearFilter');
	$("#"+gridId).alopexGrid('dataAdd', $.extend({_state:{editing:true}}, addData));
//	$('#'+gridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
	
}

function networkPathBtnStyle(btnId) {
	celStr = '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="' + btnId + '" type="button"></button></div>';
	return celStr;
}

function savePathPrev(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	$("#"+gridId).alopexGrid("endEdit");
	var links = $('#'+gridId).alopexGrid('dataGet');
	
	// 미입력 row 삭제
	var num = links.length;
	for(var i = 0; i < num; i++) {
		if(nullToEmpty(links[i].LEFT_NE_ID) == "" && nullToEmpty(links[i].LEFT_PORT_ID) == ""
			&& nullToEmpty(links[i].RIGHT_PORT_ID) == "" && nullToEmpty(links[i].RIGHT_NE_ID) == "") {
			var rowIndex = links[i]._index.data;
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
			var cutLength = (i-num);
			links.splice(cutLength, Math.abs(cutLength));
			break;
		}
	}
	
	return links;
}

function tempDataTrim(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	// 임시 데이터 제거
	var data = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet'));
	for(var i = 0; i < data.length; i++) {
		for(key in data[i]) {
			var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
			if(temp == 0) {
				eval("data[i]."+key + " = ''");
			}
		}
		data[i].LINK_SEQ = (i+1);
	}
	
	return data;
}

function searchSmuxRing(dataList) {
	/*
	 * RING_ID
	 * RING_TOPOLOGY_SMALL_CD : 035
	 * RING_TOPOLOGY_CFG_MEANS_CD :001
	 */
	var muxRingChk = false;
	if (nullToEmpty(dataList) != "") {
		for(var i = 0; i < dataList.length; i++) {
			if(nullToEmpty(dataList[i].RING_ID) != "") {
				//SMUX링이고 토폴로지구성방식이 ring 인경우
				if((nullToEmpty(dataList[i].RING_TOPOLOGY_SMALL_CD) == "035")
						&& (nullToEmpty(dataList[i].RING_TOPOLOGY_CFG_MEANS_CD) == "001")) {
					muxRingChk = true;
					break;
				}
			} 
		}
	}

	return muxRingChk;
}

/*
 * SMUX링중 CMUX장비가 쓰였는지 체크
 * 링(경유링), 서비스회선(링) 체크
 * 2020-06-01
 */
function searchCmuxRing(dataList) {

	var cmuxChk = false;
	if (nullToEmpty(dataList) != "") {
		for(var i = 0; i < dataList.length; i++) {
			if(nullToEmpty(dataList[i].RING_ID) != "") {
				//SMUX링 인경우
				if((nullToEmpty(initParam.topoSclCd) == "035")) {
					if((dataList[i].LEFT_NE_ROLE_CD == "52" || dataList[i].RIGHT_NE_ROLE_CD == "52")
							|| (dataList[i].LEFT_NE_ROLE_CD == "53" || dataList[i].RIGHT_NE_ROLE_CD == "53")) {
						cmuxChk = true;
						break;
					}
				} else {
					//서비스회선인 경우
					if(nullToEmpty(dataList[i].RING_LVL) == "2") {
						if((dataList[i].LEFT_NE_ROLE_CD == "52" || dataList[i].RIGHT_NE_ROLE_CD == "52")
								|| (dataList[i].LEFT_NE_ROLE_CD == "53" || dataList[i].RIGHT_NE_ROLE_CD == "53")) {
							cmuxChk = true;
							break;
						}
					}
				}
			} 
		}
	}

	return cmuxChk;
}

/*
 * 
 * SMUX링중 LMUX장비가 쓰였는지 체크
 * 링(경유링체크) 체크
 * 2020-06-01
 */
function searchLmuxRing(gridId) {
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	
	var lmuxChk = false;
	if (nullToEmpty(dataList) != "") {
		for(var i = 0; i < dataList.length; i++) {
			//if(nullToEmpty(dataList[i].RING_ID) != "") {
				//LMUX링 인경우
				if((nullToEmpty(initParam.topoSclCd) == "035" && nullToEmpty(initParam.topoCfgMeansCd) == "001")) {
					if(dataList[i].LEFT_NE_ROLE_CD == "53" || dataList[i].RIGHT_NE_ROLE_CD == "53") {
						lmuxChk = true;
						break;
					}
				}
			//} 
		}
	}

	return lmuxChk;
}
/*
 * 이원화로 구성된 링의 확장형의 경우
 * 확장형 카드로 확장형판단
 * 예비선번 저장을 위해 체크
 * 2020-06-01
 */
function searchExt(dataList) {
	var eqpExt = false;
	var ringTop = false;
	if (nullToEmpty(dataList) != "") {
		//SMUX링 인경우 : 경유링이 Ring타입인 경우에만 예비선번 구현
		if((nullToEmpty(initParam.topoSclCd) == "035")) {
			for(var i = 0; i < dataList.length; i++) {
				if(nullToEmpty(dataList[i].RING_TOPOLOGY_CFG_MEANS_CD) == "001") {
					ringTop = true;
					break;
				}
			}
		} else {
			//TODO LMUX는 추후 이중화가 개발되면 추가
			//SMUX이원화의 경우 - 우선 LMUX의 경우 PTP만 가능하므로 LMUX는 추가하지 않음
			//그외 서비스회선의 경우 사용 CMUX링이 이원화경유링을 사용한 경우
			for(var i = 0; i < dataList.length; i++) {
				if(nullToEmpty(dataList[i].RING_ID_L2) != "") {
					if(nullToEmpty(dataList[i].RING_TOPOLOGY_CFG_MEANS_CD_L2) == "001") {
						ringTop = true;
						break;
					}
				}
			}
		}

		if(ringTop) {
			for(var i = 0; i < dataList.length; i++) {
				/*
				 * CMUX의 확장형 카드를 쓴 경우 확장형으로 판단한다.LEFT_CARD_MODEL_ID
				 */
				if(isCmuxRnExtCard(dataList[i].RIGHT_CARD_MODEL_ID) || isCmuxRnExtCard(dataList[i].LEFT_CARD_MODEL_ID)){
					eqpExt = true;
					break;
				}
			}
		}
	}
	return eqpExt;
}

// RU 서비스회선/ 특정 링으로 사용서비스회선 사용가능여부 체크로직
function chkUseLineBfSave() {
	// 2018-09-12  3. RU고도화
	var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
	if (isRuCoreLineOld() == true /*|| isRuMatchLineOld() == true*/) {
		
		var mainPathData = savePathPrev(detailGridId);
		var subPathData = null;
		if (isRuCoreLineOld() == true){
			subPathData = savePathPrev(reserveGrid);
			if(mainPathData.length < 1 && subPathData.length > 0) {
				alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
				addRowNullData(detailGridId);
				addRowNullData(reserveGrid);
				
				$("#"+detailGridId).alopexGrid("startEdit");
				$("#"+reserveGrid).alopexGrid("startEdit");
				return ;
			}
		}
		    			    			
		/* 사용서비스회선 정보체크 common.js*/
		var checkParam = {	"editSvlnNo" : baseNtwkLineNo
		                  , "mainPathData" : mainPathData
		                  , "subPathData" : subPathData	
		                  , "editPathType" : "OP"   // OP : old_path,  NP : Visualization Edit (new path)
		                  };
		
		checkUseServiceLine(checkParam);
	} 
	// 2019-09-30  5. 기간망 링 선번 고도화
	else if (isMeshRing(chkTopoSclCd) == true || isAbleViaRing(chkTopoSclCd) == true) {
		var mainPathData = savePathPrev(detailGridId);
		var subPathData = savePathPrev(reserveGrid);
		if(mainPathData.length < 1 && subPathData.length > 0) {
			alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
			addRowNullData(detailGridId);
			addRowNullData(reserveGrid);
			
			$("#"+detailGridId).alopexGrid("startEdit");
			$("#"+reserveGrid).alopexGrid("startEdit");
			return ;
		}
		    			    			
		/* 사용링 정보체크 common.js*/
		var checkParam = {	"editRingId" : baseNtwkLineNo
		                  , "mainPathData" : mainPathData
		                  , "subPathData" : subPathData	
		                  , "editPathType" : "OP"   // OP : old_path,  NP : Visualization Edit (new path)
		                  , "lnoGrpSrno" : (chkTopoSclCd == '031' ? $('#ntwkLnoGroSrno').val() : "")
		                  };
		//사용 링으로 사용링 사용가능여부 체크로직
		checkUseRingNtwk(checkParam);
	}
	// 그외
	else {
		savePath();	
	}
}

/**
 * 주선번/예비선번 시 사전 체크 작업
 */
function saveReserveLinks() {
	var links = savePathPrev(detailGridId);
	var reserveLinks = savePathPrev(reserveGrid);
	
	if(links.length < 1 && reserveLinks.length > 0) {
		alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
		addRowNullData(detailGridId);
		addRowNullData(reserveGrid);
		
		$("#"+detailGridId).alopexGrid("startEdit");
		$("#"+reserveGrid).alopexGrid("startEdit");
		return;
	}
	
	
	//TODO
	//서비스회선, 링회선의 선번편집 저장시 장비체크부분
	if(fnValidation(links) && fnValidation(reserveLinks, 'reserve')){
		// 주 선번
		rtnNeFlag = true;
		for(var i = 0; i < links.length; i++) {
			// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
			if(i != (links.length -1)) {
				if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
					rtnNeFlag = false;
				}
			}
		}
		
		// 예비 선번 
		var reserveRtnNeFlag = true;
		//2019-09-17
		//5G광코어의 예비선번은 자동으로 생성해주는거라 체크할 필요 없다고 함.
		if(isFiveGponRuCoreLine() != true) {
			for(var i = 0; i < reserveLinks.length; i++) {
				// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
				if(i != (reserveLinks.length -1)) {
					if(reserveLinks[i].RIGHT_NE_ID != reserveLinks[i+1].LEFT_NE_ID) {
						reserveRtnNeFlag = false;
					}
				}
			}
		}
		
		
		if(!rtnNeFlag || !reserveRtnNeFlag) {
			callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
				if (msgRst == 'Y') {
					checkEqpRullBfSave();
				} else {
					addRowNullData(detailGridId);
					addRowNullData(reserveGrid);
					$("#"+detailGridId).alopexGrid("startEdit");
					$("#"+reserveGrid).alopexGrid("startEdit");
				}
			});
		} else {
			checkEqpRullBfSave();
		}
	} else {
		addRowNullData(detailGridId);
		addRowNullData(reserveGrid);
		$("#"+detailGridId).alopexGrid("startEdit");
		$("#"+reserveGrid).alopexGrid("startEdit");
	}
}

/* 저장버튼 클릭 */
function btnSavePath() {
	$("#btnSave").click();
}

/** TODO
 * 선번 저장전 작업
 * RU광코어회선의 경우 가장마지막 EAST장비에 DU-L장비가 등록되어있지 않으면 저장이 불가능하도록 기능추가 - 2024-10
 * checkDuLEqpLow
 */
function preSavePath() {
	
	// RU광코어이고, 주선번에 링이 2개이상이거나 5G-PON회선이 아니면서 예비선번의 링이 2개 이상인경우
	if (isRuCoreLineOld() == true 
		&& (checkUseRingCntAtRuPath(detailGridId) > 1 || (isFiveGponRuCoreOld() == false && checkUseRingCntAtRuPath(reserveGrid) > 1))) {
		alertBox('W', "RU광코어회선은 1개의 링만 사용가능합니다."); 
		return;
	}
	
	// RU광코어이고, 가장마지막 EAST장비에 DU-L장비군이 등록되어있지 않는 경우
	if (isRuCoreLineOld() == true && checkDuLEqpLow(detailGridId) == 0) {
		alertBox('W', "EAST장비가 등록되지 않았습니다. 장비명 확인바랍니다."); 
		return;
	}
	
	// WDM트렁크, PTP링 예비 선번까지 같이 저장
	if(wkSprYn) {
		//TODO
		//FDF장비/포트의 중복체크
		
		saveReserveLinks();   // 주선번/예비선번 시 사전 체크 작업
	} else {
		var links = savePathPrev(detailGridId);
		
		// 5G-PON링인경우 COT장비 필수 체크
		if (isFiveGponRingOld() == true) {
			if (checkCotEqpLow(links) == false ) {
				alertBox('W', "5G-PON링의 경우 COT장비는 첫구간에 설정하셔야 합니다.");
				addRowNullData();
				$("#"+detailGridId).alopexGrid("startEdit");
				return;
			};
		}
		
		// 데이터 검증
		if(fnValidation(links)){
			// 구간 검증 
			for(var i = 0; i < links.length; i++) {
				// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
				if(i != (links.length -1)) {
					if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
						if(links[i].SERVICE_ID == links[i+1].SERVICE_ID || // 2018-09-12  3. RU고도화
								links[i].TRUNK_ID == links[i+1].TRUNK_ID || links[i].RING_ID == links[i+1].RING_ID || links[i].WDM_TRUNK_ID == links[i+1].WDM_TRUNK_ID) {
							rtnNeFlag = false;
						}
					}
				}
			}			
			
			
			if(!rtnNeFlag || ringSctnSaveYn) {
				callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
					if (msgRst == 'Y') {
						checkEqpRullBfSave();
					} else {
						addRowNullData();
						$("#"+detailGridId).alopexGrid("startEdit");
						bRessmuxRing = false;
						if (wkSprYn == true) {
							$("#"+reserveGrid).alopexGrid("startEdit");
						}
					}
				});
			} else {
				checkEqpRullBfSave();
			}
			 
		} else {
			addRowNullData();
			$("#"+detailGridId).alopexGrid("startEdit");
		}
	}
}

function checkEqpRullBfSave() {
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	var linePathYn = gridDivision == "serviceLine" ? "Y" : "N";
	
	var data = tempDataTrim();
	saveParams = {
			"ntwkLineNo" : baseNtwkLineNo,
			"wkSprDivCd" : "01",
			"autoClctYn" : "N",
			"linePathYn" : linePathYn,
			"userId" : userId,
			"utrdMgmtNo" : utrdMgmtNo,
			"links" : JSON.stringify(data)
	};
	
	// 선번그룹일련번호
	// 패킷 회선인 경우 ntwkLnoGrpSrno가 존재.
	// 패킷 회선이 아닌경우 
	//  - 기존 저장 회선일 경우 pathSameNo
	//  - 신규 저장 회선일 경우 null
	ntwkLnoGrpSrno = $('#ntwkLnoGroSrno').val();
	if(ntwkLnoGrpSrno == "" || ntwkLnoGrpSrno == undefined) {
		if(pathSameNo != "") {
			$.extend(saveParams,{"ntwkLnoGrpSrno": pathSameNo});
		} else {
			$.extend(saveParams,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
		}
	} else {
		// 패킷 회선 or 가입자망링 일경우
		$.extend(saveParams,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
	}
	
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001') {
		$.extend(saveParams,{"ringMgmtDivCd": "1"});
	}
	
	// 2. [수정]가입자망인 경우 선번그룹번호 전송
	// 선번편집시 예비선번이 존재하는 타 망링의 경우 그룹 1만 전달되어 예비선번 FDF정보가 GIS로 넘어가지 않는 현상이 있어 개선  - 2024-10-30
	if(initParam.mgmtGrpCd == '0002' && initParam.topoSclCd == '031') {
		fdfSendLnoGrpSrno = saveParams.ntwkLnoGrpSrno;
	}
	
//	cflineShowProgressBody();
	
	// 채널 정합식 체크
	var paramTopoLclCd = "";
	var paramTopoSclCd = "";
	var linePathYn = "N";
	if(typeof topoLclCd != "undefined") {
		paramTopoLclCd = topoLclCd;
		paramTopoSclCd = topoSclCd;
	} else {
		paramTopoLclCd = svlnLclCd;
		paramTopoSclCd = svlnSclCd;
		linePathYn = "Y";
	}
 
	var ruleParam = {"links" : JSON.stringify(data), "eqpMdlPortRule" : eqpMdlPortRule
						, "topoLclCd" : paramTopoLclCd
						, "topoSclCd" : paramTopoSclCd
						, "linePathYn" : linePathYn
						, "saveYn" : "Y"
					}
	httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkEqpMdlPortRule', ruleParam, 'POST', 'saveBeforeCheckEqpMdlPortRule');
}

/**
 * 수정 내역 표시
 */
function modificationDetails() {
//	httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkEqpMdlPortRule', ruleParam, 'POST', 'saveBeforeCheckEqpMdlPortRule');
}

/**
 * 선번 삭제
 */
function deletePath(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
	var selectCnt = dataList.length;
	var addYn = false;
	
	if(selectCnt <= 0){
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
	} else {
//		$('#'+detailGridId).alopexGrid("showProgress");
		dataDeleteCount = 0;
		for(var i = 0; i < dataList.length; i++ ) {
			var data = dataList[i];    		
			var rowIndex = data._index.data;
			/*if(nullToEmpty(data.SERVICE_ID) == "" && // 2018-09-12  3. RU고도화
			 *   nullToEmpty(data.TRUNK_ID) == "" && nullToEmpty(data.WDM_TRUNK_ID) == "" && nullToEmpty(data.RING_ID) == ""
				&& nullToEmpty(data.LEFT_NE_ID) == "" && nullToEmpty(data.RIGHT_NE_ID) == "") {
				addYn = true;
			}*/
			
			dataDeleteCount++;
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
		}
		
		// 전체를 삭제할 경우 row추가
		var list = $('#'+gridId).alopexGrid("dataGet");
		if(list < 1) {
			addRowNullData(gridId);
			$("#"+gridId).alopexGrid("startEdit");
			//addYn = false;
		}
		else {
			var lastObject = list[list.length-1];
			if(nullToEmpty(lastObject.SERVICE_ID) != "" || // // 2018-09-12  3. RU고도화
					nullToEmpty(lastObject.TRUNK_ID) != "" || nullToEmpty(lastObject.WDM_TRUNK_ID) != "" || nullToEmpty(lastObject.RING_ID) != ""
				|| nullToEmpty(lastObject.LEFT_NE_ID) != "" || nullToEmpty(lastObject.RIGHT_NE_ID) != "") {
			//if(addYn) {
				addRowNullData(gridId);
				$("#"+gridId).alopexGrid("startEdit");
			}
		}
		
		/* 2018-09-12  3. RU고도화 */ 
		setChangedMainPath(gridId);
		
		// 2019-01-15  4. 5G-PON고도화 주선번 전체 삭제의 경우 예비선번도 전체 삭제함
		if (isFiveGponRuCoreOld() == true && gridId == detailGridId) {
			deleteSprPathAll(reserveGrid);
		}
	}
}

/**
 * 선번복사
 */
function copyPath(){
	$a.popup({
   		popid: "copyPath",
   		title: cflineMsgArray['pathCopy'], 		/* 선번복사 */
		url: '/tango-transmission-web/configmgmt/cfline/NetworkPathCopyPop.do',
		data: null,
		iframe: true,
		modal: true,
		movable:true,
		width : 1200,
		height : 600,
		callback:function(data){
			if(data != null){
				$('#'+reserveGrid).alopexGrid('endEdit');
				$('#'+detailGridId).alopexGrid("dataEmpty");
				$('#'+detailGridId).alopexGrid('dataSet', data.mainLinks);
				addRowNullData(detailGridId);
				$('#'+detailGridId).alopexGrid('startEdit');
			}
			if(data.reserveLinks != undefined){
				reservePathClick("data", data.reserveLinks);
			}if(data.reserveLinks == undefined){
				reservePathClick("noData", null);
			}
		}
	});
}


/******************************************************************************************
 * fnValidation
 * @param dataList
 * @returns {Boolean}
 * 
 * 
 * 1. 장비 체크 - 검색을 통해서 입력할것.(ID 확인)
 * 2. 포트 체크 - 검색을 통해서 입력할것.(ID 확인) && 필수 입력
 * 3. 사용네트워크의 채널과 채널이 다른 경우 체크
 ******************************************************************************************/
function fnValidation(dataList, reserve) {
	
	if(reserve != "reserve") {
		if(dataList.length < 1 && dataDeleteCount < 1){
			alertBox('W', cflineMsgArray['noReqData']); /* 요청할 데이터가 없습니다. */
			return false;
		}
	}
	
	for(var i = 0; i < dataList.length; i++) {
		var useNtwkId = dataList[i].USE_NETWORK_ID;
		var lftNeNm = dataList[i].LEFT_NE_NM;
		var lftNeId = dataList[i].LEFT_NE_ID;
		var lftPortId = dataList[i].LEFT_PORT_ID;
		var lftPortDescr = dataList[i].LEFT_PORT_DESCR;
		
		var rghtNeNm = dataList[i].RIGHT_NE_NM;
		var rghtNeId = dataList[i].RIGHT_NE_ID;
		var rghtPortId = dataList[i].RIGHT_PORT_ID;
		var rghtPortDescr = dataList[i].RIGHT_PORT_DESCR;

		if( nullToEmpty(lftNeNm) != "" && lftNeId == null) {
			alertBox('W', cflineMsgArray['validationWestNeId']); /* WEST장비를 검색을 통해 조회한 후 등록해주세요. */
			return false;
		} else if( (lftNeId != null && lftNeNm != '' ) ) {
			if( nullToEmpty(lftPortDescr) != "" && (lftPortId == null || lftPortId == "")) {
				alertBox('W', cflineMsgArray['validationWestPortId']); /* WEST포트를 검색을 통해 조회한 후 등록해주세요. */
				return false;
			} 
		}
		
		if( nullToEmpty(rghtNeNm) != "" && rghtNeId == null) {
			alertBox('W', cflineMsgArray['validationEastNeId']); /* EAST장비를 검색을 통해 조회한 후 등록해주세요. */
			return false;
		} else if( (rghtNeId != null && rghtNeNm != '' ) ) {
			if( nullToEmpty(rghtPortDescr) != "" && (rghtPortId == null || rghtPortId == "")) {
				alertBox('W', cflineMsgArray['validationEastPortId']); /* EAST포트를 검색을 통해 조회한 후 등록해주세요. */
				return false;
			} 
		}
		
		// 채널
		/*
		var channelDescr = dataList[i].LEFT_CHANNEL_DESCR;
		var useChannelDescr = dataList[i].USE_NETWORK_LEFT_CHANNEL_DESCR;
		if(nullToEmpty(channelDescr) != "" && nullToEmpty(useChannelDescr) !=  "" && channelDescr.indexOf(useChannelDescr) != 0) {
			alertBox('W', '채널을 확인해주세요.');
			return false;
		}
		 */
	}
	
	
	// 링일 경우(가입자망링 제외) validation 체크 : 상위 WEST, 하위 EAST 동일 장비 미 입력시 저장 불가
	ringSctnSaveYn = false;
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001' && topoSclCd != '031') {
		var length = dataList.length;
		if(length > 0) {
			if(getDefaultString(dataList[0].LEFT_NE_ID, "DV00000000000") != getDefaultString(dataList[length-1].RIGHT_NE_ID, "DV00000000000")) {
				// 17.05.23 임시로 풀기 : 확인 후 저장이 가능하도록 수정
				/*
				alertBox('W', '처음 구간 WEST장비와 마지막 구간 EAST장비는 동일해야합니다.');
				return false;
				*/
				ringSctnSaveYn = true;
			} 
		} 
		return true;
	} else {
		return true;
	}
	
//	return true;
}

function getDefaultString(str1, str2) {
	var returnValue = "";
	if(str1 == str2 || str1 == null) {
		returnValue = ""; 
	} else {
		returnValue = str1;
	}
    return returnValue;
}

var httpRequestNetworkPath = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url,			//URL 기존 처럼 사용하시면 됩니다.
		data : Param,		//data가 존재할 경우 주입
		method : Method,	//HTTP Method
		flag : Flag
	}).done(successCallback)
	  .fail(failCallback);
}

function successCallback(response, status, jqxhr, flag){
	networkPathCallBack(response, status, jqxhr, flag);
}

// 선번 ID SELECT CHANGE EVENT
function ntwkLnoGrpSrnoChangeEvent() {
	
	$("#ntwkLnoGroSrno").change(function(e) {
		var selectedValue = $(this).val();		
		
		// openGridId == "dataGridWork" || 
		if($('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
			
			callMsgBox('','C', cflineMsgArray['saveCurrntPath'] + cflineMsgArray['saveMsg'], function(msgId, msgRst){
        		if (msgRst == 'Y') {
        			  			
        			// 현재 선번 저장
        			var links = savePathPrev();        	 
        			// 그리드의 삭제 데이터 건수가 없을 경우 '요청할 데이터가 없습니다'라는 문구가 뜨게 되는데 
        			// 신규로 추가된 선번ID에서 데이터가 없을 경우에는 선번ID를 삭제해줘야되기때문에 삭제 카운트를 임의로 1로 둔다.
        			dataDeleteCount = 1;
        			if(fnValidation(links)){
        				if(links.length == 0) {
        					$("#ntwkLnoGroSrno").find("option").each(function() {
        						if(prevNtwkLnoGrpSrno == this.value) {
        							$("#ntwkLnoGroSrno option[value='" + this.value + "'").remove();
//        							$("#ntwkLnoGroSrno option:eq(0)").attr("selected", "selected");
        						}
        					});
        					
        					params = {
        							"ntwkLineNo" : baseNtwkLineNo, 
        							"utrdMgmtNo" : utrdMgmtNo,
        							"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
        					};
        					
        					cflineShowProgressBody();
        					$('#'+detailGridId).alopexGrid('dataEmpty');
        					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSelectChangeAfter');
        				} else {
        					
        					var mainPathData = savePathPrev(detailGridId);
                			var subPathData = savePathPrev(reserveGrid);
                			if(mainPathData.length < 1 && subPathData.length > 0) {
                				alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
                				addRowNullData(detailGridId);
                				addRowNullData(reserveGrid);
                				
                				$("#"+detailGridId).alopexGrid("startEdit");
                				$("#"+reserveGrid).alopexGrid("startEdit");
                				return ;
                			}
                			
                			/* 사용링 정보체크 common.js*/
                			var checkParam = {	"editRingId" : baseNtwkLineNo
                			                  , "mainPathData" : mainPathData
                			                  , "subPathData" : subPathData	
                			                  , "editPathType" : "OP"   // OP : old_path,  NP : Visualization Edit (new path)
                			                  , "lnoGrpSrno" : (isSubScriRingOld() == true ? prevNtwkLnoGrpSrno : "")
                			                  };
                			//사용 링으로 사용링 사용가능여부 체크로직
                			var useRingInfoParam = makeParamToCheckUseRing(checkParam);   
                			// 사용링 정보가 없는 경우
                			if (nullToEmpty(useRingInfoParam.editRingId) == "") {
                				saveToChgNtwkLnoGrpSrno(links);
                			} else {
                				cflineShowProgressBody();
                    			
                    			Tango.ajax({
                    				url : 'tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getuseringinfo', 
                    				data : useRingInfoParam, //data가 존재할 경우 주입
                    				method : 'GET', //HTTP Method
                    				flag : 'getuseringinfo'
                    			}).done(function(response){
                    						//console.log(response);
                    						cflineHideProgressBody();
                    						if (nullToEmpty(response.useRingInfo) != "" ) {
                    							if (nullToEmpty(response.useRingInfo.result) == "Y") {
                    								saveToChgNtwkLnoGrpSrno(links);
                    							} else {						
                    								alertBox('W', response.useRingInfo.ngMsg);
                    								if (nullToEmpty(checkParam.editPathType == "OP")) {
                    									$("#"+detailGridId).alopexGrid("startEdit");
                    				    				$("#"+reserveGrid).alopexGrid("startEdit");

                            			        		$("#ntwkLnoGroSrno").children("option:selected").removeAttr("selected");
                            			        		$("#ntwkLnoGroSrno").val(prevNtwkLnoGrpSrno);   
                    								}
                    								return;
                    							}				
                    						} else {
                    							alertBox('W', "사용 링 정보 조회에 실패했습니다.");
                    							//저장후 및 취소후 표기할 선번그룹 셋팅
                    			        		$("#ntwkLnoGroSrno").children("option:selected").removeAttr("selected");
                    			        		$("#ntwkLnoGroSrno").val(prevNtwkLnoGrpSrno); 
            									$("#"+detailGridId).alopexGrid("startEdit");
            				    				$("#"+reserveGrid).alopexGrid("startEdit");  
                    							return;
                    						}
                    					})
                    			  .fail(function(response){
                    				  		cflineHideProgressBody();
                    				  		//console.log(response);
                    					  	alertBox('W', "사용 링 정보 조회에 실패했습니다.");
                    					  //저장후 및 취소후 표기할 선번그룹 셋팅
                    		        		$("#ntwkLnoGroSrno").children("option:selected").removeAttr("selected");
                    		        		$("#ntwkLnoGroSrno").val(prevNtwkLnoGrpSrno);   
        									$("#"+detailGridId).alopexGrid("startEdit");
        				    				$("#"+reserveGrid).alopexGrid("startEdit");
                    						return;
                    				  	});
                			}
        				}
        			}
        		}else{
        			//취소를 클릭할경우, 선택 이전 선번그룹으로 변경
        			selectedValue = prevNtwkLnoGrpSrno;
        		}
        		
        		//저장후 및 취소후 표기할 선번그룹 셋팅
        		$("#ntwkLnoGroSrno").children("option:selected").removeAttr("selected");
        		$("#ntwkLnoGroSrno").val(selectedValue);        		
        		
        	});
		} else {
			cflineShowProgressBody();
			params = {
					"ntwkLineNo" : baseNtwkLineNo, 
					"utrdMgmtNo" : utrdMgmtNo,
					"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
			};
			
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
		}
	});
}

// 가입자망 선번그룹 변경시
function saveToChgNtwkLnoGrpSrno(links) {

	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	var linePathYn = gridDivision == "serviceLine" ? "Y" : "N";
	// 구간 검증 
	var rtnNeFlag = true;
	for(var i = 0; i < links.length; i++) {
		// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
		if(i != (links.length -1)) {
			if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
				rtnNeFlag = false;
			}
		}
	}
	
	var data = tempDataTrim();
	var params = {
			"ntwkLineNo" : baseNtwkLineNo,
			"wkSprDivCd" : "01",
			"autoClctYn" : "N",
			"linePathYn" : linePathYn,
			"userId" : userId,
			"utrdMgmtNo" : utrdMgmtNo,
			"links" : JSON.stringify(data)
	};
	$.extend(params,{"ntwkLnoGrpSrno": prevNtwkLnoGrpSrno});
	
	/* 2. [수정]가입자망인 경우 선번그룹번호 전송*/
	fdfSendLnoGrpSrno = params.ntwkLnoGrpSrno;
	
	if(!rtnNeFlag) {
		callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
			if (msgRst == 'Y') {
				wkSprDivFlag = true;
				cflineShowProgressBody();
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathSelectChangeAfter');
			} else {
				// 변경전 선번그룹으로 셋팅
				$("#ntwkLnoGroSrno").children("option:selected").removeAttr("selected");
        		$("#ntwkLnoGroSrno").val(prevNtwkLnoGrpSrno);   
				addRowNullData();
				$("#"+detailGridId).alopexGrid("startEdit");
			}
		});
	} else {
		wkSprDivFlag = true;
		cflineShowProgressBody();
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathSelectChangeAfter');
		
	}
}

function saveToInsertNewNtwkLnoGrpSrno(links) {
	// 현재 그리드의 선번을 저장 한 뒤에 선번 ID 생성
	
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	var linePathYn = gridDivision == "serviceLine" ? "Y" : "N";
	
	// 그리드의 삭제 데이터 건수가 없을 경우 '요청할 데이터가 없습니다'라는 문구가 뜨게 되는데 
	// 신규로 추가된 선번ID에서 데이터가 없을 경우에는 선번ID를 삭제해줘야되기때문에 삭제 카운트를 임의로 1로 둔다.
	dataDeleteCount = 1;
	if(fnValidation(links)){
		// 구간 검증 
//		var rtnNeFlag = true;
		for(var i = 0; i < links.length; i++) {
			// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
			if(i != (links.length -1)) {
				if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
					rtnNeFlag = false;
				}
			}
		}
		
		var data = tempDataTrim();
		var params = {
				"ntwkLineNo" : baseNtwkLineNo,
				"wkSprDivCd" : "01",
				"autoClctYn" : "N",
				"linePathYn" : linePathYn,
				"userId" : userId,
				"utrdMgmtNo" : utrdMgmtNo,
				"links" : JSON.stringify(data)
		};
		$.extend(params,{"ntwkLnoGrpSrno": $("#ntwkLnoGroSrno").val()});
		
		/* 2. [수정]가입자망인 경우 선번그룹번호 전송*/
		fdfSendLnoGrpSrno = params.ntwkLnoGrpSrno;
		
		if(!rtnNeFlag) {
			callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
				if (msgRst == 'Y') {
					wkSprDivFlag = true;
					cflineShowProgressBody();
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathLineInsertAfter');
				} else {  
					addRowNullData();
					$("#"+detailGridId).alopexGrid("startEdit");
				}
			});
		} else {
			// 이미 저장여부를 물어본 상태로 재차 물어볼 필요가 없음
			wkSprDivFlag = true;
			cflineShowProgressBody();
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathLineInsertAfter');
		}            			
	}
}

// 
function setPrevNtwkLnoGrpSrno(tempValue) {
	prevNtwkLnoGrpSrno = tempValue;
//	$("#temp").val(prevNtwkLnoGrpSrno);
}

// LINK_VISIBLE
//function filterVisibleLink( data ) {
//	if (data === null || nullToEmpty(data.LINK_VISIBLE) == "" ) {
//		if( (nullToEmpty(data.LEFT_NE_ID) == "" || data.LEFT_NE_ID == "DV00000000000") 
//				&& (nullToEmpty(data.RIGHT_NE_ID) == "" || data.RIGHT_NE_ID == "DV00000000000")  ) {
//			return true;
//		} else {
//			return false;
//		}
//	}
//	return data.LINK_VISIBLE;
//}

// WDM 트렁크 LINK_VISIBLE
//function filterVisibleWdmRow( data ) {
//	if(data === null || data.WDM_ROW_FILTER == undefined || data.WDM_ROW_FILTER === null) {
//		if( (nullToEmpty(data.LEFT_NE_ID) == "" || data.LEFT_NE_ID == "DV00000000000") 
//				&& (nullToEmpty(data.RIGHT_NE_ID) == "" || data.RIGHT_NE_ID == "DV00000000000")  ) {
//			return true;
//		} else {
//			return false;
//		}
//	}
//	return data.WDM_ROW_FILTER;
//}

// 트렁크 LINK_VISIBLE
//function filterVisibleTrunkRow( data ) {
//	if (data === null || data.TRUNK_ROW_FILTER === null || data.TRUNK_ROW_FILTER === undefined ) {
//		if( (nullToEmpty(data.LEFT_NE_ID) == "" || data.LEFT_NE_ID == "DV00000000000") 
//				&& (nullToEmpty(data.RIGHT_NE_ID) == "" || data.RIGHT_NE_ID == "DV00000000000")  ) {
//			return true;
//		} else {
//			return false;
//		}
//	}
//	return data.TRUNK_ROW_FILTER;
//}

function failCallback(response, status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'networkPathSearch' || flag == 'linePathSearch'){
		cflineHideProgressBody();
		alertBox('W', cflineMsgArray['searchFail']);  /* 조회 실패 하였습니다. */
	}
	// 5G-PON RU회선용 ETE
	else if(nullToEmpty(flag) != "" && flag.indexOf("selectEteInfWithEqpList") == 0) {
		console.log(response);
		
		alertBox('W', "ETE적용에 실패했습니다.");  /* 조회 실패 하였습니다. */
	}
}

/******************************************************************************************
 * 그리드 컬럼 셋팅
 * 1. 서비스회선
 *     - RU회선(003) - RU(103)						: 트렁크, WDM트렁크 숨기기
 *     - RU회선(003) - 중계기(광코어)(101)				: 트렁크, WDM트렁크 숨기기 <= 2018-03-05 링 편집 가능하게 편집
 *     - 가입자망회선(004)								: 트렁크, WDM트렁크 숨기기
 *     - 기지국회선	(001)								: WDM트렁크 숨기기
 *     - 기타회선(006) - WIFI(102)						: 트렁크, 링, WDM트렁크 숨기기
 *     - 기타회선(006) - 중계기정합장치(061)			: 트렁크, WDM트렁크 숨기기  <= 2018-09-12  1. RU고도화 : 링/서비스회선 사용가능
 *     - 기타회선(006) - DCN(070)			: 트렁크, WDM트렁크 숨기기  <= 2018-12-26
 *     - 기타회선(006) - RMS(071)			: 트렁크, WDM트렁크 숨기기  <= 2018-12-26
 *     - 기타회선(006) - IP정류기(072)			: 트렁크, WDM트렁크 숨기기  <= 2018-12-26
 *     - 기지국회선(001) - WCDMA(IPNB) (020)			: 트렁크, WDM트렁크 숨기기  <= 2019-02-19
 *     - 기타회선(006) - 예비회선(106)			: 트렁크, WDM트렁크 숨기기  <= 2023-11-08
 * 2. 링 - 가입자망링(001/031)							: 트렁크, WDM트렁크 숨기기
 *       - MESH 링(020)									: 경유링명명 표시 		    <= 2019-10-01 5. 기간망 링 선번 고도화	
 *       - Ring(001), IBS(011), IBRR(015), IVS(037)
 *       , IVRR(038)									: 경유링명 표시,  		    <= 2019-10-01 5. 기간망 링 선번 고도화	
 *     
 *******************************************************************************************/
function gridHidColSet() {
	if(gridDivision == "serviceLine") {
		
		
		// 관리그룹이 SKT일경우 WDM컬럼 삭제
		if($("#mgmtGrpCd").val() == "0001") {
			$('#'+detailGridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);
			hideCol = ['WDM_TRUNK_NM'];
			$("#wdmTrunkDisplayCheckbox").hide();

			// 2019-09-30  5. 기간망 링 선번 고도화
			$("#cascadingRingDisplayCheckbox").show();
		} 
		if(nullToEmpty(svlnLclCd) == "003" && nullToEmpty(svlnSclCd) == "103") {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		} 
		// RU회선-광코어
		else if (isRuCoreLineOld() == true) {
			/*$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM', 'LEFT_CHANNEL_DESCR', 'RIGHT_CHANNEL_DESCR']);
			hideCol = ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM', 'LEFT_CHANNEL_DESCR', 'RIGHT_CHANNEL_DESCR'];*/
			
			/* 
			 * 1. [수정] RU광코어 링/예비선번 사용
			 */
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			$('#'+detailGridId).alopexGrid('showCol', ['SERVICE_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		} else if(nullToEmpty(svlnLclCd) == "004") {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		} else if(nullToEmpty(svlnLclCd) == "001") {
			if(nullToEmpty(svlnSclCd) == "020"){
				/*
				 * 기지국회선(001) - WCDMA(IPNB) 2019-02-19
				 */
				$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
				hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
				
				$("#trunkDisplayCheckbox").hide();
				$("#wdmTrunkDisplayCheckbox").hide();
			}else{
				$('#'+detailGridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);
				hideCol = ['WDM_TRUNK_NM'];
				$("#wdmTrunkDisplayCheckbox").hide();
			}
		} else if(nullToEmpty(svlnLclCd) == "006" && nullToEmpty(svlnSclCd) == "102") {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM'];
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();

			// 2019-09-30  5. 기간망 링 선번 고도화
			$("#cascadingRingDisplayCheckbox").hide();
		} else if(nullToEmpty(svlnLclCd) == "006" && ( 
				(nullToEmpty(svlnSclCd) == "061") || (nullToEmpty(svlnSclCd) == "070") || (nullToEmpty(svlnSclCd) == "071") || (nullToEmpty(svlnSclCd) == "072") || (nullToEmpty(svlnSclCd) == "106"))) {			
			/* 
			 * 회선소분류 - 중계기 정합장치회선 추가됨. 링 사용가능함.
			 * DCN, RMS, IP정류기 추가 2018-12-26
			 * 기지국회선(001) - WCDMA(IPNB) 2019-02-19
			 * 기타_예비회선 추가 2023-09-19
			 */
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		}
	} else if(gridDivision == "ring") {
		if($("#mgmtGrpCd").val() == "0001") {
			// SKT링일경우 WDM컬럼 삭제
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
			
			// 2019-09-30  5. 기간망 링 선번 고도화
			var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
			if ( isMeshRing(chkTopoSclCd) == true || isAbleViaRing(chkTopoSclCd) == true) {
				$('#'+detailGridId).alopexGrid('showCol', ['CASCADING_RING_NM']);
				if (isAbleViaRing(chkTopoSclCd) == true ) { 
					$("#cascadingRingDisplayCheckbox").show();
				}
				// MESH링인 경우 기간망 트렁크 표시
				if (isMeshRing(chkTopoSclCd) == true) {
					$("#rontTrunkDisplayCheckbox").show();
				}
			}
		} else {
			// 링-가입자망 : WDM트렁크사용 않함
			if(nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "031") {
				$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
				hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
				$("#trunkDisplayCheckbox").hide();
				$("#wdmTrunkDisplayCheckbox").hide();
				
				// 2020-08-03  11. 가입자망링 경유링 사용 
				var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
				if ( isAbleViaRing(chkTopoSclCd) == true) {
					$('#'+detailGridId).alopexGrid('showCol', ['CASCADING_RING_NM']);
					if (isAbleViaRing(chkTopoSclCd) == true ) { 
						$("#cascadingRingDisplayCheckbox").show();
					}
				}
			}
		}
	} else if(gridDivision == "trunk") {
		if($("#mgmtGrpCd").val() == "0001") {
			// SKT링일경우 WDM컬럼 삭제
			$('#'+detailGridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);
			hideCol = ['WDM_TRUNK_NM'];
			$("#wdmTrunkDisplayCheckbox").hide();

			// 2019-09-30  5. 기간망 링 선번 고도화
			$("#cascadingRingDisplayCheckbox").show();
		}
	}
}

function autoClctPathBtnVisible() {
	// 서비스 회선 수집 선번 LTE(DU), 5G, RU회선, 가입자망 회선
	if( typeof svlnLclCd != "undefined")  {
		var visibleYn = false;
		if(svlnLclCd == "001" && (svlnSclCd == "016" || svlnSclCd == "030" )) {
			// 기지국회선 - DU, 5G
			visibleYn = true;
		} else if(svlnLclCd == "003") {
			// RU회선
			if(svlnSclCd == "101") {
				// 광코어(중계기) 
				visibleYn = false;
			} else {
				visibleYn = true;
			}
		} else if(svlnLclCd == "004") {
			// 가입자망 회선
			visibleYn = true;
		} else {
			visibleYn = false;
		}
		
		if(visibleYn) {
			$("#btnAutoClctPath").show();
		} else {
			$("#btnAutoClctPath").hide();
		}
	} else {
		$("#btnAutoClctPath").hide();
	}
}

function setEditButton() {
	if(openGridId == "dataGrid") {
//		if(gridDivision != 'wdm') {
		
		if(!wkSprYn) {
			$("#btnReservePath").hide();
			$("#btnPathCopy").hide();
		} 

		$("#btnReservePathChange").hide();
		$("#exceptFdfNeDisplayCheckbox").show();
		$("#btnPathDelete").hide();
		$("#btnModificationDetailsDisplay").hide();
		$("#btnSave").hide();
		$("#btnCmslineCompare").hide();
//		$("#ringCoupler").hide();
		$("#btnEqpNodeInfo").hide();	//2020-07-29추가
		$("#btnOltEqpReg").hide();		//2021-03-08추가 - 상위OLT장비등록 버튼
	} else {
//		if(gridDivision != 'wdm') {
		if(!wkSprYn) {
			$("#btnReservePathChange").hide();	
			$("#btnReservePath").hide();
			if(gridDivision == 'wdm') {
				$("#btnPathCopy").show();
			}
		} else {
			// 예비선번이 존재해야 되는 상태인데, 현재 예비선번 그리드가 없을 경우 '예비선번으로 변경' 버튼 숨기기
			if($('#'+reserveGrid).alopexGrid("dataGet").length < 1) {
				$("#btnReservePathChange").hide();
			}
			
			if (isFiveGponRuCoreOld() == true) {
				$("#btnReservePathChange").hide();
			}
		}
			
		//선로검색 버튼은 회선, 링, 트렁크, SKT 외의 경우 숨김
		if(gridDivision == 'serviceLine' || (nullToEmpty(topoLclCd) == '001' || nullToEmpty(topoLclCd) == '002')
				&& (nullToEmpty(mgmtGrpCd) == '0001' || nullToEmpty(mgmtGrpCd) == "")) {
			// 장비선로버튼
			$("#btnEqpNodeInfo").show();
		} else {
			$("#btnEqpNodeInfo").hide();
		}
		
		//상위OLT장비등록 버튼은 SKB그룹의 가입자망링 외의 경우 숨김
		if(gridDivision != 'ring' && (nullToEmpty(topoLclCd) != '001' && nullToEmpty(topoSclCd) != '031')
				|| nullToEmpty(mgmtGrpCd) != '0002') {
			// 상위OLT장비등록버튼
			$("#btnOltEqpReg").hide();
		} else {
			// 상위OLT장비등록버튼
			$("#btnOltEqpReg").show();
		}
	}
}

/*
 * 서비스회선-RU광코어 여부 
 */
function isRuCoreLineOld() {
	var chkLineType = false;
	if(gridDivision == "serviceLine" && nullToEmpty(svlnLclCd) == "003" && nullToEmpty(svlnSclCd) == "101") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 서비스회선-중계기정합장치여부 여부 
 */
function isRuMatchLineOld() {
	var chkLineType = false;
	if(gridDivision == "serviceLine" && nullToEmpty(svlnLclCd) == "006" && nullToEmpty(svlnSclCd) == "061") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 링-Smux링 여부 
 */
function isSmuxRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "035") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 링-5G-PON링 여부 
 * 5GPON3.1 추가 2021-11-08
 */
function isFiveGponRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && (nullToEmpty(topoSclCd) == "033" || nullToEmpty(topoSclCd) == "036" || nullToEmpty(topoSclCd) == "042")) {
		chkLineType = true; 
	}
	return chkLineType;
}


/*
 * 서비스회선-S-MUX RU회선 여부 
 */
function isSmuxRuCoreOld() {
	var chkLineType = false;
	if(gridDivision == "serviceLine" && nullToEmpty(svlnLclCd) == "003" && nullToEmpty(svlnSclCd) == "101" && nullToEmpty(baseInfData) != "" && nullToEmpty(baseInfData.appltTypeOfFiveg) == "SMUX") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 서비스회선-5G-PON RU회선 여부 
 */
function isFiveGponRuCoreOld() {
	
	var chkLineType = false;
	if(gridDivision == "serviceLine" && nullToEmpty(svlnLclCd) == "003" && nullToEmpty(svlnSclCd) == "101" && nullToEmpty(baseInfData) != ""  && nullToEmpty(baseInfData.appltTypeOfFiveg) == "5G-PON") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * SKB MUX링-BCMUX링, CWDMMUX링 여부 
 */
function isSkbMuxRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && (nullToEmpty(topoSclCd) == "040" || nullToEmpty(topoSclCd) == "041")) {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * SKB 가입자망링 여부 
 */
function isSubScriRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "031") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 2018-09-12  3. RU고도화 
 * 컨텍스트 메뉴를 통한 주선번 편집 
 */
function setChangedMainPath(gridId){
	if (gridId == detailGridId) {
		modifyMainPath = true;
	}
}

/*
 * 5G-PON 링 COT 장비 체크 
 */
function checkCotEqpLow(links) {
	if (links.length > 0) {
		var conYn = false;
		var conFirstRow = -1;
		for (var i =0; i < links.length; i++) {
			if (conYn == false && nullToEmpty(links[i].LEFT_FIVE_GPON_EQP_TYPE) == "COT") {
				conYn = true
				conFirstRow = i;
			} else if (conYn == false && nullToEmpty(links[i].RIGHT_FIVE_GPON_EQP_TYPE) == "COT") {
				conYn = true
				conFirstRow = i;
			}
			
			if (conYn == true) {
				break;
			}
		}
		if (conYn == true && conFirstRow > 0) {
			return false;
		}
	}
	return true;
}

function cmsCompareBtnVisible(){

	if(isFiveGponRuCoreLine() == true) {
		$('#btnCmslineCompare').show();	//수집회선비교버튼의 활성화
	} else {
		$('#btnCmslineCompare').hide(); //그외조건에서는 수집회선비교버튼 비활성화 처리
	}
	
}

/* 5G-PON RU회선여부 */
function isFiveGponRuCoreLine() {
	
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined" && initParam.svlnLclCd == "003" && initParam.svlnSclCd == "101" 
		&& nullToEmpty(baseInfData) != "" && nullToEmpty(baseInfData.appltTypeOfFiveg) == "5G-PON") {
		return true;
	} else {
		return false;
	}
}

/*
 * 링-PTP링 여부 
 */
function isPtpRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "002") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 링-M/W PTP링 여부 
 */
function isMWPtpRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "039") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * 링-Smux링 여부 
 */
function isRingOld() {
	var chkLineType = false;
	if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001") {
		chkLineType = true; 
	}
	return chkLineType;
}

/*
 * M/W PTP링 저장시 네트워크기본정보에 M/W 용도구분 insert
 */
function insertMwUsgDiv(ntwkLineNo){
	var param = {
		"ntwkLineNo" : ntwkLineNo
	}
	httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/insertmwusgdiv', param, 'GET', 'insertMwUsgDiv');
}
	
/**
 *  MUX링의 토폴로지구성방식이 Ring타입인 경우 Ring타입에 맞게 선번이 구성되어있는지 체크
 */
function checkRingType(){
	var bres = false;
	
	
	var dataList = savePathPrev(detailGridId);
	var len = dataList.length;
	
	if(len <= 0)		return true;
	
	var data = tempDataTrim();
	var ruleParam = {"links" : JSON.stringify(data), "eqpMdlPortRule" : eqpMdlPortRule
			, "topoLclCd" : initParam.topoLclCd
			, "topoSclCd" : initParam.topoSclCd
			, "ntwkLineNo" : initParam.ntwkLineNo
	};
	httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkSMuxRingType', ruleParam, 'POST', 'checkSMuxRingType');
	
	return bres;
}

/**
 * 구간 병합 체크
 */
function checkSectionMerge(gridId) {
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	var len = dataList.length;
	
	for(var i = 0; i < len - 1; i++){
		var dataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:i }})[0];
		var nextDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:i+1 }})[0];
		var mergeYn = false;
		var generateLeft = false;

		if(dataObj.RIGHT_NE_ID == null || dataObj.RIGHT_NE_ID == "" || dataObj.RIGHT_NE_ID == "DV00000000000") {
			// 현재 구간의 우장비가 비었을 경우 다음 구간의 좌장비가 비어야 한다.
			if( (nextDataObj.LEFT_NE_ID == null || nextDataObj.LEFT_NE_ID == "" || nextDataObj.LEFT_NE_ID == "DV00000000000")
					&& (nextDataObj.RIGHT_NE_ID != null && nextDataObj.RIGHT_NE_ID != "" && nextDataObj.RIGHT_NE_ID != "DV00000000000")) {
				mergeYn = true;
				generateLeft = true;
			}
		} else if(dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "" || dataObj.LEFT_NE_ID == "DV00000000000") {
			// 현재 구간의 좌장비가 비었을 경우 다음 구간의 우장비가 비어야 한다.
			if( (nextDataObj.RIGHT_NE_ID == null || nextDataObj.RIGHT_NE_ID == "" || nextDataObj.RIGHT_NE_ID == "DV00000000000")
					&& (nextDataObj.LEFT_NE_ID != null && nextDataObj.LEFT_NE_ID != "" && nextDataObj.LEFT_NE_ID != "DV00000000000")) {
				mergeYn = true;
				generateLeft = false;
			}
		}
		
		if(mergeYn == true)			return false;
	}
	return true;
}

/**
 * 구간 병합
 */
function autoMergeSection(gridId) {
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	var len = dataList.length;
	
	for(var i = 0; i < len - 1; i++){
		var dataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:i }})[0];
		var nextDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:i+1 }})[0];
		var mergeYn = false;
		var generateLeft = false;

		if(dataObj.RIGHT_NE_ID == null || dataObj.RIGHT_NE_ID == "" || dataObj.RIGHT_NE_ID == "DV00000000000") {
			// 현재 구간의 우장비가 비었을 경우 다음 구간의 좌장비가 비어야 한다.
			if( (nextDataObj.LEFT_NE_ID == null || nextDataObj.LEFT_NE_ID == "" || nextDataObj.LEFT_NE_ID == "DV00000000000")
					&& (nextDataObj.RIGHT_NE_ID != null && nextDataObj.RIGHT_NE_ID != "" && nextDataObj.RIGHT_NE_ID != "DV00000000000")) {
				mergeYn = true;
				generateLeft = true;
			}
		} else if(dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "" || dataObj.LEFT_NE_ID == "DV00000000000") {
			// 현재 구간의 좌장비가 비었을 경우 다음 구간의 우장비가 비어야 한다.
			if( (nextDataObj.RIGHT_NE_ID == null || nextDataObj.RIGHT_NE_ID == "" || nextDataObj.RIGHT_NE_ID == "DV00000000000")
					&& (nextDataObj.LEFT_NE_ID != null && nextDataObj.LEFT_NE_ID != "" && nextDataObj.LEFT_NE_ID != "DV00000000000")) {
				mergeYn = true;
				generateLeft = false;
			}
		}
		
		var dataObjList = AlopexGrid.trimData(dataObj);
		var nextDataObjList = AlopexGrid.trimData(nextDataObj); 
		if(mergeYn) {
			var keyParam = "";
			if(generateLeft) {
				// 현재 구간의 좌장비와 다음 구간의 우장비 병합
				keyParam = "RIGHT";
			} else {
				// 현재 구간의 우장비와 다음 구간의 좌장비 병합 
				keyParam = "LEFT";
			}
			
			for(var key in nextDataObjList) {
				if(key.indexOf(keyParam) == 0) {
					$('#'+gridId).alopexGrid( "cellEdit", eval("nextDataObjList."+key), {_index : { row : i}}, key);
				}
			}
			
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:i+1 }});
			len--;
		}
		
	}
	return true;
}	