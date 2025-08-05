/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 26. 오후 4:04:03
 * @version 1.0
 */
//그리드 ID
var gridDetailId = 'resultPopGrid';
var gridFile = 'resultFileListGrid';
var procStFlag = 'E';
    
//첨부파일 삭제용
var maxFileCnt = 0;
var tempFileSrno = 0; // 전송전 파일 신규 목록
var delFileList = [];

var fdaisNo = null;
var MappingfInfo = '';
var MappingCodeInfo = '';
var m_bSKT = false;
var bNotChange = true;
var szBpCd = '';

$a.page(function() {
    
	//그리드 ID
    //var gridDetailId = 'resultPopGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    
    	initGrid();
    	setCombo(param);
    	setEventListener(param);
    	
    	m_bSKT = param.bSKT;
    	
    	ShowDialogItem(m_bSKT);
    	
    	delFileList= [];
    	maxFileCnt = 0;
    	tempFileSrno = 0;
    	
    	szBpCd = param.bpCd;
    };
});


//Grid 초기화
function initGrid() {
	
	var mapping = [
		//공통
		{
			selectorColumn : true,
			width : "30px" 
		}, { 
			key : "bldBlkNo",
			align : "right",
			width : "55px",
			title : buildingInfoMsgArray['dongNumber'],
			hidden : true
		}, { 
			key : "bldDongDivNm",
			align : "left",
			width : "40px",
			title : buildingInfoMsgArray['division']
		}, {
			key : 'bldBlkNm',
			align:'left',
			width:'100px',
			title : buildingInfoMsgArray['dongName'],
			editable : {type : "text"}
		}, {
			key : 'bldRmk',
			align:'left',
			width:'100px',
			title : buildingInfoMsgArray['remark'],
			editable : {type : "text"}
		}
		, {
			key : 'naverBldBlkNm',
			align:'left',
			width:'100px',
			title : buildingInfoMsgArray['dongNameForNaver']
		}
		, {
			key : 'utmkXcrdVal',
			align:'right',
			width:'90px',
			title : buildingInfoMsgArray['buildingXCoordinateValue']
		}
		, {
			key : 'utmkYcrdVal',
			align:'right',
			width:'90px',
			title : buildingInfoMsgArray['buildingYCoordinateValue']
		}
		, {
			key : 'lastChgUserId',
			align:'left',
			width:'90px',
			title : buildingInfoMsgArray['lastChangeUserIdentification']
		}
		, {
			key : 'lastChgDate',
			align:'center',
			width:'80px',
			title : buildingInfoMsgArray['lastChangeDate']
		}
		, {
			key : 'gisUtm',
			align:'center',
			width:'35px',
			title : buildingInfoMsgArray['map'],
			render : function(value, data) {
				//var celStr = demandMsgArray['integrationFacilitiesName']/*"통합시설명"*/;
				if (nullToEmpty(data.bldDongDivNm) == "실사" || nullToEmpty(data.bldDongDivNm) == "") {
					var celStr = '<div style="width:100%"><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
					return celStr;
				}
			}
		}
	];
		
    //그리드 생성
    $('#'+gridDetailId).alopexGrid({
    	//extend : ['resultPopGrid'],
    	height : 200,
        cellSelectable : true,
        autoColumnIndex : true,
        fitTableWidth : true,
        rowClickSelect : true,
        rowSingleSelect : false,
        rowInlineEdit : true,
        numberingColumnFromZero : false,
        columnMapping : mapping
    });
    
    
    var mappingFile = [
        { selectorColumn : true, width : '25px' }
        , { key : 'check', align:'center', width:'50px', title : buildingInfoMsgArray['number'], numberingColumn : true  }
        , { key : 'atflId', title : buildingInfoMsgArray['attachedFileIdentification'], width : '50px' , hidden: true}
        , { key : 'atflNm', title : buildingInfoMsgArray['attachedFileName'], align : 'left', width: '300px'}
        , { key : 'tempFileNo', title : buildingInfoMsgArray['tempFileId'], width : '80px' , hidden: true}
        , { key : 'frstRegUserId', title : buildingInfoMsgArray['registrantIdentification'], width : '80px'}
        , { key : 'frstRegDate', title : buildingInfoMsgArray['registrationDate'], width : '80px'}
        , { Key : 'trmsDemdMgmtNo', title : '', 	align : 'left', hidden: true}
    ];
     			 
	//그리드 생성
	$('#'+gridFile).alopexGrid({
	 	autoColumnIndex : true,
	 	fitTableWidth : true,
	 	columnMapping : mappingFile,
	 	disableTextSelection : true,
	    cellSelectable : true,
	    rowClickSelect : true,
	    rowSingleSelect : false,
	    rowInlineEdit : false,
	    numberingColumnFromZero : false,
	    pager : false,
	    height : 100
	});
};

function setCombo(param) {
	if(param.viewFlag == "UPDATE") {
		
		var bldMainUsgCd = "";
		var grudFlorCntCd = "";
		var bldCnstDivCd = "";
		var bldCstrTypCd = "";
		var bldBizTypCd = "";
		var bldCnstTypCd = "";
		
		var ohcpnIndpStatCd = "";
		var linLnConnYn = "";
		var linLnConnImpsRsnCd = "";
		
		if(param.hasOwnProperty('fdaisLdongCd')) {
			bldMainUsgCd = param.fdaisBldMainUsgNm;
			grudFlorCntCd = param.fdaisGrudFlorCntCd;
			bldCnstDivCd = param.fdaisBldCnstDivCd;
			bldCstrTypCd = param.fdaisBldCstrTypCd;
			bldBizTypCd = param.fdaisBldBizTypCd;
			bldCnstTypCd = param.fdaisBldPrcsCd;
			
			ohcpnIndpStatCd = param.fdaisOhcpnIndpStatCd;
			linLnConnYn = param.fdaisLinLnConnYn;
			linLnConnImpsRsnCd = param.fdaisLinLnConnImpsRsnCd;
		}
		else {
			
			bldMainUsgCd = param.lcenBldMainUsgCd;
			bldCnstDivCd = param.lcenBldCnstDivCd;
			
			var grudFlorCnt = param.lcenGrudFlorCnt; //지상(층)
			if(grudFlorCnt >= 5) {
				grudFlorCntCd = "320005";
			}
			else if(grudFlorCnt == 4) {
				grudFlorCntCd = "320004";
			}
			else if(grudFlorCnt == 3) {
				grudFlorCntCd = "320003";
			}
			else if(grudFlorCnt == 2) {
				grudFlorCntCd = "320002";
			}
			else if(grudFlorCnt == 1) {
				grudFlorCntCd = "320001";
			}
			else {
				grudFlorCntCd = "320006";
			}
		}
		
		selectComboCode('popBldMainUsgCd', 'NS', 'C00648', bldMainUsgCd); //주용도 코드
    	selectComboCode('popGrudFlorCntCd', 'NS', 'C00653', grudFlorCntCd); //지상층 코드
    	selectComboCode('popBldCnstDivCd', 'NS', 'C00647', bldCnstDivCd); //건축구분 코드
    	selectComboCode('popBldCstrTypCd', 'S', 'C00652', bldCstrTypCd); //공사유형 코드
    	selectComboCode('popBldBizTypCd', 'S', 'C00651', bldBizTypCd); //사업유형 코드
    	selectComboCode('popBldPrcsCd', 'NS', 'C00650', bldCnstTypCd); //건물공정 코드
    	selectComboCode('popOhcpnIndpStatCd', 'S', 'C02316', ohcpnIndpStatCd); //타사독점여부
    	
    	//인입선로 연결여부, 인입선로 불가사유 추가
    	selectComboCode('popLinLnConnYn', 'S', 'C02329', linLnConnYn); //인입선로 연결여부
    	selectComboCode('popLinLnConnImpsRsnCd', 'S', 'C02330', linLnConnImpsRsnCd); //인입선로 불가사유
    	
    	if(param.bSKT == false){
    		selectComboCode('silsaMedia', 'S', 'C02408', param.silsaMedia); //인입매체
        	selectComboCode('silsaMethod', 'S', 'C02409', param.silsaMethod); //방식
        	selectComboCode('silsaYnCrst', 'S', 'C02410', param.silsaYnCrst); //구축유무
        	selectComboCode('silsaInsEqp', 'S', 'C02411', param.silsaInsEqp); //장비설치
        	selectComboCode('silsadisable', 'S', 'C02412', param.silsadisable); //불가사유
        	selectComboCode('silsaBussiness', 'S', 'C02316', param.silsaBussiness); //독점사업자
        	
        	var sz = param.silsaContractDt;
        	
        	if(param.silsaContractDt != undefined)
        		$('#silsaContractDt').val(sz.replaceAll('-', ''));
        	if(param.silsaFinshdt != undefined)
        		$('#silsaFinshdt').val(param.silsaFinshdt);
        	
        	$('#silsaDetail').val(param.silsaDetail);	
        	$('#silsaExceed').val(param.silsaExceed);
        	
        	$('#silsaHeadOff').val(param.silsaHeadOff);
        	$('#silsaInfra').val(param.silsaInfra);
        	$('#silsaMKT').val(param.silsaMKT);
        	$('#silsaEnterprise').val(param.silsaEnterprise);
        	$('#silsaHNS').val(param.silsaHNS);
        	$('#silsaTeam').val(param.silsaTeam);
        	$('#silsaSKTNS').val(param.silsaSKTNS);
        	$('#silsaBPComp').val(param.silsaBPComp);
        	
        	$('#silsaHeadOffCd').val(param.silsaHeadOffCd);
        	$('#silsaInfraCd').val(param.silsaInfraCd);
        	$('#silsaMKTCd').val(param.silsaMKTCd);
        	$('#silsaEnterpriseCd').val(param.silsaEnterpriseCd);
        	$('#silsaHNSCd').val(param.silsaHNSCd);
        	$('#silsaTeamCd').val(param.silsaTeamCd);
        	$('#silsaSKTNSCd').val(param.silsaSKTNSCd);
        	$('#silsaBPCompCd').val(param.silsaBPCompCd);
        	
        	$('#silsaTangoCd').val(param.silsaTangoCd);
        	$('#swingBldCd').val(param.ukeyBldCd);
        	
    	}
	}
	else {
    	selectComboCode('popBldMainUsgCd', 'NS', 'C00648', ''); //주용도 코드
    	selectComboCode('popGrudFlorCntCd', 'NS', 'C00653', ''); //지상층 코드
    	selectComboCode('popBldCnstDivCd', 'NS', 'C00647', ''); //건축구분 코드
    	selectComboCode('popBldCstrTypCd', 'S', 'C00652', ''); //공사유형 코드
    	selectComboCode('popBldBizTypCd', 'S', 'C00651', ''); //사업유형 코드
    	selectComboCode('popBldPrcsCd', 'NS', 'C00650', ''); //건물공정 코드
    	
    	selectComboCode('popOhcpnIndpStatCd', 'S', 'C02316', ''); //타사독점여부
    	selectComboCode('popLinLnConnYn', 'S', 'C02329', ''); //인입선로 연결여부
    	selectComboCode('popLinLnConnImpsRsnCd', 'S', 'C02330', ''); //인입선로 불가사유
    	
    	if(param.bSKT == false){
    		selectComboCode('silsaMedia', 'S', 'C02408', ''); //인입매체
        	selectComboCode('silsaMethod', 'S', 'C02409', ''); //방식
        	selectComboCode('silsaYnCrst', 'S', 'C02410', ''); //구축유무
        	selectComboCode('silsaInsEqp', 'S', 'C02411', ''); //장비설치
        	selectComboCode('silsadisable', 'S', 'C02412', ''); //불가사유
        	selectComboCode('silsaBussiness', 'S', 'C02316', ''); //독점사업자
    	}
	}
	
}

function setEventListener(param) {
	
	$('#flag').val(param.viewFlag);

	// 등록 및 수정
	if(param.viewFlag == "INSERT") {
		//등록		
		$('#silsaSettle').hide();
	}
	else {
		//수정
		// 현장실사 데이터가 있는지 없는지 체크 하여 있다면, 현장실사 데이터로
		// 없다면 세움터 데이터로 표시
		$('#silsaSettle').setEnabled(false);
		
		if(param.fdaisBldCstrTypCd == '310003'){
			$('#silsaSettle').setEnabled(true);
		}
		
		$('#pnuLtnoCd').val(param.pnuLtnoCd); // PNU
		
		if(param.hasOwnProperty('fdaisLdongCd')) {
			$('#ldongCd').val(param.fdaisLdongCd.substring(0,10)); //법정동코드
			$('#popAllAddr').val(param.fdaisAllAddr); //주소
			$('#popAllAddrDetail').val(param.fdaisAllAddrDetail); //상세주소
			
			var replaceBunji = "";
			var bunjiTyp = param.bunjiType;
			if(bunjiTyp == "산번지") {
				replaceBunji = "산 " + param.addrBunjiVal;
			}
			else if(bunjiTyp == "블록") {
				replaceBunji = "블록";
			}
			else {
				replaceBunji = param.addrBunjiVal;
			}
			
			$('#popAddrBunjiVal').val(replaceBunji); //번지
			$('#bunjiVal').val(param.addrBunjiVal); //번지값
			$('#popHmstZnNm').val(param.fdaisHmstZnNm); //택지지구명
			$('#popBldNm').val(param.fdaisBldNm); //건물명
			$('#popBsmtFlorCnt').val(param.fdaisBsmtFlorCnt); //지하(층)
			$('#popBldCnstAr').val(param.fdaisBldCnstAr); //건축면적
			$('#popBldGenCnt').val(param.fdaisBldGenCnt); //세대수
			$('#popBldHoushCnt').val(param.fdaisBldHoushCnt); //가구수
			
			$('#popCnstnCompNm').val(param.fdaisCnstnCompNm); //시공사
			$('#popCstrChrgTlno').val(param.fdaisCstrChrgTlno); //연락처
			$('#popFildTlplNo').val(param.fdaisFildTlplNo); //전주번호
			$('#popFdaisMgmtNo').val(param.fdaisFdaisMgmtNo); //관로번호
			$('#popFdaisDistVal').val(param.fdaisFdaisDistVal); //거리
			
			$('#popVisitCnt').val(param.fdaisVisitCnt); //방문수
			
			if( param.hasOwnProperty('fdaisCmplSchdDt') ) {
				$('#popCmplSchdDt').val(param.fdaisCmplSchdDt.replaceAll("/","-")); //준공예정일
			}

			if( param.hasOwnProperty('fdaisUseAprvDt') ) {
				$('#popUseAprvDt').val(param.fdaisUseAprvDt.replaceAll("/","-")); //사용승인일
			}
			
			$('#popFdaisRmk').val(param.fdaisFdaisRmk); //비고 
			$('#popfdaisFdaisNo').val(param.fdaisNo); //FDAIS_NO

			$('#bunjiVal').val(param.addrBunjiVal); //번지값
			
			/**
			 * 추가분 컬럼 고도화
			 */
			$('#popConlChrrNm').val(param.fdaisConlChrrNm); //비고 
			$('#popConlChrrCntacVal').val(param.fdaisConlChrrCntacVal); //FDAIS_NO
			//$('#popOhcpnIndpStatCd').val(param.fdaisOhcpnIndpStatCd); //비고 
			$('#popOhcpnIndpStatCd').setSelected(param.fdaisOhcpnIndpStatCd);
			$('#popOhcpnCurstDetlCtt').val(param.fdaisOhcpnCurstDetlCtt); //FDAIS_NO
			$('#popCdlnChrUchgYn').setSelected(param.fdaisCdlnChrUchgCd); //비고 
			$('#popLinLnConnYn').setSelected(param.fdaisLinLnConnYn); //FDAIS_NO
			$('#popLnConnImpsRsnCtt').val(param.fdaisLnConnImpsRsnCtt); //비고 
			$('#popTlplDivVal').val(param.fdaisTlplDivVal); //FDAIS_NO
			$('#popTlplItNo').val(param.fdaisTlplItNo); //비고 
			$('#popArilDistVal').val(param.fdaisArilDistVal); //FDAIS_NO
			$('#popArilGrdTotDistVal').val(param.fdaisArilGrdTotDistVal); //FDAIS_NO
			$('#popGrdDistVal').val(param.fdaisGrdDistVal); //FDAIS_NO
			$('#popIpCstrNeedYn').setSelected(param.fdaisIpCstrNeedYn); //FDAIS_NO
			
			$('#popLinLnConnYn').setSelected(param.fdaisLinLnConnYn);
			$('#popLinLnConnImpsRsnCd').setSelected(param.fdaisLinLnConnImpsRsnCd);
			
			//var bldCd = param.fdaisNo;
			//bldCd = bldCd.substring(2, 16);
			//console.log("bldCd : "+ bldCd);
			
			var dataParam = {
    				fdaisNo : param.fdaisNo
    		};
    		
			fdaisNo = param.fdaisNo;
			
			// 동정보
    		//buildingDetailRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingdonglist', dataParam, 'GET', 'selectBuildingDongList');
		
    		// 파일정보
    		buildingDetailRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingfilelist', dataParam, 'GET', 'selectBuildingFileList');
		}
		else if(param.hasOwnProperty('lcenLdongCd')) {
			
			if( param.hasOwnProperty('lcenLdongCd') ) {
				$('#ldongCd').val(param.lcenLdongCd.substring(0,10)); //법정동코드
			}

			$('#popAllAddr').val(param.lcenLndLoc); //주소
			
			var replaceBunji = "";
			var bunjiTyp = param.bunjiType;
			if(bunjiTyp == "산번지") {
				replaceBunji = "산 " + param.addrBunjiVal;
			}
			else if(bunjiTyp == "블록") {
				replaceBunji = "블록";
			}
			else {
				replaceBunji = param.addrBunjiVal;
			}
			
			$('#popAddrBunjiVal').val(replaceBunji); //번지
			//$('#popAddrBunjiVal').val(param.addrBunjiVal); //번지
			$('#bunjiVal').val(param.addrBunjiVal); //번지값
			//$('#popHmstZnNm').val(param.lcenBldZnNm); //택지지구명
			$('#popBldNm').val(param.lcenBldNm); //건물명
			$('#popBsmtFlorCnt').val(param.lcenBsmtFlorCnt); //지하(층)
			$('#popBldCnstAr').val(param.lcenBldCnstAr); //건축면적
			$('#popBldGenCnt').val(param.lcenBldGenCnt); //세대수
			$('#popBldHoushCnt').val(param.lcenBldHoushCnt); //가구수
			$('#popUseAprvDt').val(param.lcenUseAprvDt); //사용승인일
		}
		else {
			
			$('#ldongCd').val(param.ldongCd);
			
			var addr = param.sidoNm + " " + param.sggNm + " " + param.emdNm;
			
			if(param.hasOwnProperty('riNm')) {
				addr += " " + param.riNm;
			}
			$('#popAllAddr').val(addr); //주소
			
			var replaceBunji = "";
			var bunjiTyp = param.bunjiType;
			if(bunjiTyp == "산번지") {
				replaceBunji = "산 " + param.addrBunjiVal;
			}
			else if(bunjiTyp == "블록") {
				replaceBunji = "블록";
			}
			else {
				replaceBunji = param.addrBunjiVal;
			}
			
			$('#popAddrBunjiVal').val(replaceBunji); //번지
			
			//$('#popAddrBunjiVal').val(param.addrBunjiVal); //번지
			$('#bunjiVal').val(param.addrBunjiVal); //번지값
			//$('#popHmstZnNm').val(param.lcenBldZnNm); //택지지구명
			$('#popBldNm').val(param.bldNm); //건물명
			$('#popBsmtFlorCnt').val(param.lcenBsmtFlorCnt); //지하(층)
			$('#popBldCnstAr').val(param.lcenBldCnstAr); //건축면적
			$('#popBldGenCnt').val(param.lcenBldGenCnt); //세대수
			$('#popBldHoushCnt').val(param.lcenBldHoushCnt); //가구수
			$('#popUseAprvDt').val(param.lcenUseAprvDt); //사용승인일
		}
		
		var bldCd = "";
		var naverBldCd = "";
		
		if(param.hasOwnProperty('fdaisBldCd')) {
			bldCd = param.fdaisBldCd;
			$('#fdaisBldCd').val(param.fdaisBldCd);
		}
		
		if( param.hasOwnProperty('bldCd') ) {
			naverBldCd = param.bldCd;
		}

		var dataDongParam = {
				bldCd : bldCd
				, naverBldCd : naverBldCd
		};
		
		$("#popAllAddr").setEnabled(false);
		$("#popAddrBunjiVal").setEnabled(false);
		$("#popHmstZnNm").setEnabled(false);
		
		buildingDetailRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingdonglist', dataDongParam, 'GET', 'selectBuildingDongList');
	}
	
	$('#popAllAddr').on('click', function(e) {
		if($('#flag').val() == "INSERT") {
			//주소검색창 호출 함수
    		searchAddress();
		}
	});
	
	/**
	 * 추가로직
	 */
	$('#popLinLnConnYn').on('change', function(e) {
    	if($('#popLinLnConnYn').val() == 'D') {
    		$('#popLinLnConnImpsRsnCd').setEnabled(true);
    	}
    	else {
    		$('#popLinLnConnImpsRsnCd').setSelected('');
    		$('#popLinLnConnImpsRsnCd').setEnabled(false);
    	}
    });
	
	$('#popLinLnConnImpsRsnCd').on('change', function(e) {
    	if($('#popLinLnConnImpsRsnCd').val() == 'C005') {
    		$('#popLnConnImpsRsnCtt').setEnabled(true);
    	}
    	else {
    		$('#popLnConnImpsRsnCtt').val('');
    		$('#popLnConnImpsRsnCtt').setEnabled(false);
    	}
    });
	
	$('#popBldCstrTypCd').on('change', function(e) {
    	if($('#popBldCstrTypCd').val() == '310003' && $('#flag').val() == 'UPDATE' ) {
    		$('#silsaSettle').setEnabled(true);
    	}
    	else {
    		$('#silsaSettle').setEnabled(false);
    	}
    });
   	
	$('#silsaYnCrst').on('change', function(e) {
		if(m_bSKT == false){
			/*if($('#silsaYnCrst').val() != 'ACE06'){
			//	$('#silsadisable').setEnabled(false);
			//	$('#silsaDetail').setEnabled(false);
				$('#silsadisable').setEnabled(true);
				$('#silsaDetail').setEnabled(true);
				$('#silsaExceed').setEnabled(false);
				$('#silsaBussiness').setEnabled(false);
				$('#silsaContractDt').setEnabled(false);
				
			//	selectComboCode('silsadisable', 'S', 'C02412', ''); //불가사유
			}
			else{
				$('#silsadisable').setEnabled(true);
				$('#silsaDetail').setEnabled(true);
			}*/
		}
	});

	$('#silsaBussiness').on('change', function(e) {
		$('#silsaBussiness').find("option[value='Z']").remove(); 
	});
	
	$('#silsadisable').on('change', function(e) {
		if(m_bSKT == false){
			if($('#silsadisable').val() == 'AIR01'){
				$('#silsaBussiness').setEnabled(true);
				$('#silsaContractDt').setEnabled(true);
			}
			else{
				$('#silsaBussiness').setEnabled(false);
				$('#silsaContractDt').setEnabled(false);
			}
			
			if($('#silsadisable').val() == 'AIR05' || $('#silsadisable').val() == 'AIR06'){
				$('#silsaExceed').setEnabled(true);
			}
			else{
				$('#silsaExceed').setEnabled(false);
			}
			
			if($('#silsadisable').val() != ''){
				$('#silsaDetail').setEnabled(true);
			}
			else{
				$('#silsaDetail').setEnabled(false);
			}
			if(bNotChange == false){
				selectComboCode('silsaBussiness', 'S', 'C02316', ''); //독점사업자
				$('#silsaExceed').val('');
				$('#silsaContractDt').val('');
				$('#silsaDetail').val('');
			}
			else
				bNotChange = false;
		}
	});
	
	
	$('#silsaSettle').on('click', function(e) {
		
		var fdaisBldCd = $('#fdaisBldCd').val();
		
		$a.popup({
			popid : 'BuildingInspectionAccountsReg',
			title : '건물실사정산등록',
			url : '/tango-transmission-web/constructprocess/accounts/BuildingInspectionAccountsReg.do',
			data : {'bldCd' : fdaisBldCd},
			width : 1200,
			height : 800,
			iframe : false,
			modal : true,
			windowpopup : true,
			movable : true,
			callback : function(data){
				if (data != null) {
				}
			}			
		});
    });
	
	$('#addrow').on('click', function(e) {
		var rowData = {
				 div : "F"
				, bldDongDivNm : ""
				, bldBlkNm : "필수입력"
				, utmkXcrdVal : "0"
				, utmkYcrdVal : "0"
				, frstRegUserId : ""
				, gisUtm : ""
		};
		
		$('#resultPopGrid').alopexGrid("dataAdd", rowData);
	});
	
	$('#deleterow').on('click', function(e) {
    	var dataList = $('#'+gridDetailId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('W',buildingInfoMsgArray['selectNoData']);
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridDetailId).alopexGrid("dataDelete", {_index : { data:rowIndex }});

    	}  
    });
	
	// 저장
    $('#btnSave').on('click', function(e) {
    	$('#'+gridDetailId).alopexGrid('endEdit', {_state:{editing:true}});
    	
    	var dongInfoInsertList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var dongInfoUpdateList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var dongInfoDeleteList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	
    	
    	var fileInsertList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var fileDeleteList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
    	
    	// 유효성 체크
    	if( !checkValidation(dongInfoInsertList, dongInfoUpdateList) ) {
    		bodyProgressRemove();
    		return false;
    	}
    	
    	callMsgBox('','C', buildingInfoMsgArray['save'], function(msgId, msgRst){  
    		if (msgRst == 'Y') {
    			bodyProgress();
    	    	DEXT5UPLOAD.Transfer("dext5upload"); // 파일전송
    			//buildingInfoSave();
    		}
    	});
    });
    
 	// 취소
    $('#btnCancel').on('click', function(e) {
    	$a.close();
    });
    
    
    $('#'+gridDetailId).on('click', function(e) {

    	var object = AlopexGrid.parseEvent(e);
    	var data = AlopexGrid.currentData(object.data);
    	
    	if (data == null) {
    		return false;
    	}
    	gridClick(gridDetailId, object, data);        	
    	
    });
    
    $('#silsaHeadOff, #silsaHeadOffBtn').on('click', function(e) {
    	MappingfInfo = '#silsaHeadOff';
    	MappingCodeInfo = '#silsaHeadOffCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaInfra, #silsaInfraBtn').on('click', function(e) {
    	MappingfInfo = '#silsaInfra';
    	MappingCodeInfo = '#silsaInfraCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaMKT, #silsaMKTBtn').on('click', function(e) {
    	MappingfInfo = '#silsaMKT';
    	MappingCodeInfo = '#silsaMKTCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaEnterprise, #silsaEnterpriseBtn').on('click', function(e) {
    	MappingfInfo = '#silsaEnterprise';
    	MappingCodeInfo = '#silsaEnterpriseCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaHNS, #silsaHNSBtn').on('click', function(e) {
    	MappingfInfo = '#silsaHNS';
    	MappingCodeInfo = '#silsaHNSCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaTeam, #silsaTeamBtn').on('click', function(e) {
    	MappingfInfo = '#silsaTeam';
    	MappingCodeInfo = '#silsaTeamCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaSKTNS, #silsaSKTNSBtn').on('click', function(e) {
    	MappingfInfo = '#silsaSKTNS';
    	MappingCodeInfo = '#silsaSKTNSCd';
    		
    	openUserPopup(UserCallback);
    });
    
    $('#silsaBPComp, #silsaBPCompBtn').on('click', function(e) {
    	MappingfInfo = '#silsaBPComp';
    	MappingCodeInfo = '#silsaBPCompCd';
    		
    	openUserPopup(UserCallback);
    });
    
    // 그리드 클릭시 클릭시
    function gridClick(gridId, object, data) {
    	// 지도 셀 클릭시
    	if (object.mapping.key == 'gisUtm') {
    		if ( data._state.focused) {
    			if (data.bldDongDivNm == "" || data.bldDongDivNm == "실사")
    				openMapPopup(gridId, data);
    		}
    	}
    };
    
    function openMapPopup(gridId, gridData) {
    	if($("#pnuLtnoCd").val() != "") {
    		var param = null;
        	
        	if(gridData.utmkXcrdVal != "0" || gridData.utmkYcrdVal != "0") {
        		
        		param = { x : gridData.utmkXcrdVal, y : gridData.utmkYcrdVal };
        	}
        	else {
        		var admCode = Number($("#pnuLtnoCd").val().substring(0, 10));
        		var jbClass = Number($("#pnuLtnoCd").val().substring(10, 11));
        		var mainJb = Number($("#pnuLtnoCd").val().substring(11, 15));
        		var subJb = Number($("#pnuLtnoCd").val().substring(15, 19));
        		
        		//블록인 경우 일반으로 처리해서 검색 하게끔 설정
        		if(jbClass == 3) {
        			jbClass = 1;
        			mainJb = 0;
        			subJb = 0;
        		}
        		
        		param = { admCode : admCode, jbClass: jbClass, mainJb : mainJb, subJb : subJb };
        	}
        	
        	$a.popup({
    			popid : 'CmMap',
    			url : '/tango-transmission-gis-web/tgis/CmMap.do',
    			data : param,
    			iframe : true,
    			windowpopup : true, 
    			modal : true,
    			width : 800,
    			height : 600,
    			title : buildingInfoMsgArray['map'],
    			movable : true,
    			callback : function(data){
    				
    				if (data != null) {
    					
    					//var x = data.latlng.lat;
    					//var y = data.latlng.lng;
    					
    					gridData.utmkXcrdVal = data.latlng.lng;
    					gridData.utmkYcrdVal = data.latlng.lat;
    					
    					//$('#'+gridId).alopex('dataSet', {utmkXcrdVal : data.latlng.lat, utmkYcrdVal : data.latlng.lat}, {_state : {focused : true}});
    				
    					$('#'+gridId).alopexGrid('cellEdit', data.latlng.lng, {_index: {id: gridData._index.id}}, 'utmkXcrdVal');   // 재고사용수량
    	            	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: gridData._index.id}}, 'utmkXcrdVal'); 
    	            	$('#'+gridId).alopexGrid('cellEdit', data.latlng.lat, {_index: {id: gridData._index.id}}, 'utmkYcrdVal');   // 재고사용수량
    	            	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: gridData._index.id}}, 'utmkYcrdVal'); 
    				}
    			}
    		});
    	}
    	else {
    		alertBox('W',buildingInfoMsgArray['addressInputText']);
    	}
    }
    
    /*******************************
     *  파일 그리드 이벤트
     *******************************/ 
    // 파일 데이터셋후
    $('#'+gridFile).on('dataSetEnd', function(e) { 
    	var length =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") ).length; 
		maxFileCnt = length;
    });  
    // 파일 업로드 다운로드
    // 파일추가
    $('#btn_add_file').on('click', function(e) {
    	$("#fileAdd").click();
    });

    // 파일삭제
    $('#btn_remove_file').on('click', function(e) {

    	var dataList = $('#'+gridFile).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('W',buildingInfoMsgArray['selectDeleteRow']);
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridFile).alopexGrid("dataDelete", {_index : { data:rowIndex }});

    		//alert("maxFileCnt : " + maxFileCnt + " rowIndex : " + rowIndex);
    		if (maxFileCnt > 0) {
    			rowIndex = rowIndex - (maxFileCnt);
    		}
    		if (nullToEmpty(data.atflId) == "" ) {
                DEXT5UPLOAD.SetSelectItem(rowIndex, '1', 'dext5upload');
    		} else {
    			maxFileCnt = maxFileCnt-1;
    			delFileList.push(data.atflId);
    		}
    	}  
    	
    	DEXT5UPLOAD.DeleteSelectedFile("dext5upload");
    });
    
    // (파일다운로드)
    $('#'+gridFile).on('click', function(e) {

    	var object = AlopexGrid.parseEvent(e);
    	var data = AlopexGrid.currentData(object.data);
    	
    	if (data == null) {
    		return false;
    	}
    	
    	// 통합시설코드 셀 클릭시
    	if (object.mapping.columnIndex == 3) {
    		if ( data._state.focused) {
    			var atflId = data.atflId; // responseCustomValue 값이 저장되어 있음
    			
    			buildingDetailRequest('tango-common-business-biz/dext/files/'+ atflId, null, 'GET', 'fileDownLoad');	
    		}
    	}
  	});    
};

//request
function buildingDetailRequest(surl,sdata,smethod,sflag)
{
	Tango.ajax({
		url : surl,
		data : sdata,
		method : smethod
	}).done(function(response){successBuildingInfoMergeCallback(response, sflag);})
	  .fail(function(response){failBuildingInfoMergeCallback(response, sflag);})
	  //.error();
}

//request 성공시
function successBuildingInfoMergeCallback(response, flag){
	
	if(flag == 'buildingMerge'){
		
		if(response.Result == "Success") {
			//alert("저장 되었습니다.");
    		
    		var param = {
    			flag : 'search'	
    		};
    		
    		if (delFileList.length > 0) {
    			//alert("저장 되었습니다.");
				buildingDetailRequest('tango-common-business-biz/dext/files/group?method=delete', delFileList, 'POST', 'fileDel');    	    		
			} else {
				bodyProgressRemove();
				
				callMsgBox('', 'I', buildingInfoMsgArray['saveSuccess'], function(){  
					$a.close(true);
	        	});
			}
    		
    		//$a.close(param);
		}
		else {
			bodyProgressRemove();
			alertBox('W',"저장중 실패하였습니다.");
		}
	}
	if(flag == 'selectBuildingDongList') {
		$('#'+gridDetailId).alopexGrid("dataSet", response.list);
	}
	if(flag == 'selectBuildingFileList') {
		$('#'+gridFile).alopexGrid("dataSet", response.list);
	}
	if(flag == 'fileDownLoad') {
		$('#editorResult').text('업로드 파일조회결과 : ' + JSON.stringify(response));
		
		/*
		DEXT5UPLOAD.SetSelectItem
		itemIndex  -1 : appendMode가 0이면 전체 해제, appendMode가 1이면 전체 선택
		           -1이 아닌 0이상의 숫자 : DEXT5 Upload 영역에 있는 파일의 0부터 시작되는 순서 값
		appendMode  0 : ItemIndex가 -1면 전체 해제, ItemIndex가 -1 이외의 숫자이면 전체 해제 후 ItemIndex 파일 선택
		            1 : ItemIndex가 -1면 전체 선택, ItemIndex가 -1 이외의 숫자이면 기존 체크상태 유지 하면서 ItemIndex 파일 선택
		uploadID  설정하는 업로드의 id값을 의미합니다.
		*/
		//DEXT5UPLOAD.SetSelectItem('1', '0', 'dext5download');
		DEXT5UPLOAD.ResetUpload("dext5download"); // dext5download 초기화 (삭제 후 추가로 하려했으나 삭제시 alert 호출로 인해 초기화로 변경)

		//5번째 파라미터(CustomValue)는 받드시 업로드시 리턴된 responseCustomValue값을 입력
		//파일 경로는 반드시 전체 경로를 입력하셔야 다운이 가능
		DEXT5UPLOAD.AddUploadedFile(response.fileUladSrno,response.uladFileNm,response.uladFilePathNm, response.uladFileSz,response.fileUladSrno,"dext5download");

		//DEXT5UPLOAD.DownloadFile("dext5download"); //개별파일
		DEXT5UPLOAD.DownloadAllFile("dext5download"); //모든파일
	}
	if(flag == 'fileDel') {
		bodyProgressRemove();
		
		callMsgBox('', 'I', buildingInfoMsgArray['saveSuccess'], function(){  
			$a.close(true);
    	});
	}
}

//request 실패시.
function failBuildingInfoMergeCallback(response, flag){
	bodyProgressRemove();
	if(flag == 'fileDel') {
		//var length =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") ).length; 
		//maxFileCnt = length;
		//alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
		bodyProgressRemove();
		
		callMsgBox('', 'I', buildingInfoMsgArray['saveSuccess'], function(){  
			$a.close(true);
    	});
	}else{
		alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
	}
}

function searchAddress() {
	$a.popup({
		popid : 'SearchAddress',
		url : 'SearchAddress.do',
		iframe : true,
		modal : true,
		width : 830,
		height : 630,
		title : buildingInfoMsgArray['addressSearch'],
		movable : true,
		callback : function(data){
			
			var bunji = "";
			
			if(data.selectSmlBunjiVal != "") {
				if(parseInt(data.selectSmlBunjiVal) != "0") {
					bunji = parseInt(data.selectBigBunjiVal) + "-" + parseInt(data.selectSmlBunjiVal);
				}
				else {
					bunji = parseInt(data.selectBigBunjiVal);
				}
			}
			else {
				bunji = parseInt(data.selectBigBunjiVal);
			}
			var lndDivCd = "";
			
			if(data.selectLndDivCd == "2") {
				lndDivCd = "산 ";
			}
			else if(data.selectLndDivCd == "3") {
				lndDivCd = "블록";
			}
			
			var finalBunji = "";
			
			if(data.selectLndDivCd == "3") {
				finalBunji = "블록";
			}
			else {
				finalBunji = lndDivCd + bunji;
			}
			$('#popAllAddr').val(data.selectAllAddr);
			$('#popAddrBunjiVal').val(finalBunji);
			$('#popHmstZnNm').val(data.selectHmstZnNm);
			$('#ldongCd').val(data.selectLdongCd);
			$('#pnuLtnoCd').val(data.selectPnuLtnoCd);
			
			if(data.selectLndDivCd == "3") {
				bunji = "블록";
			}
			
			$('#bunjiVal').val(bunji);
		}
	});
}

function checkValidation(dongInfoInsertList, dongInfoUpdateList) {

	var regNumber = /[^0-9]/g;
	var regNumberPoint = /[^\.0-9]/g;
	var regNumberPoinrRange = /^\d+(?:[.]?[\d]?[\d])?$/;
	var regEngNum = /^[A-Z0-9+]*$/;
	
	if($('#popBldCstrTypCd').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['cstrTyp']));
		return false;
	}
	
	if( regNumber.test($('#popVisitCnt').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['visitCount']));
		return false;
	}
	
	if($('#popAllAddr').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['address']));
		return false;
	}

	if($('#popBldNm').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['buildingName']));
		return false;
	}
	
	if($('#popBldMainUsgCd').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['mainUsage']));
		return false;
	}
	
	if($('#popGrudFlorCntCd').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['groundFloor']));
		return false;
	}
	
	if( regNumber.test($('#popBsmtFlorCnt').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['basementFloor']));
		return false;
	}
	
	if($('#popBldCnstDivCd').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['cnstrDivisionName']));
		return false;
	}
	
	if( regNumberPoint.test($('#popBldCnstAr').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['cnstrArea']));
		return false;
	}
	
	if( regNumber.test($('#popBldGenCnt').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['generationCount']));
		return false;
	}
	
	if( regNumber.test($('#popBldHoushCnt').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['householdCount']));
		return false;
	}
	
	if($('#popBldPrcsCd').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['buildingProcess']));
		return false;
	}
	
	if( regNumber.test($('#popFdaisDistVal').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['distance']));
		return false;
	}
	
	if(m_bSKT == false){
		if($('#silsaYnCrst').val() == 'ACE06' && $('#silsadisable').val() == ''){
			alertBox('W','구축유무가 불가일 시 불가사유는 필수입니다.');
			return false;
		}
		
		if(($('#silsadisable').val() == 'AIR05' || $('#silsadisable').val() == 'AIR06') && $('#silsaExceed').val() == ''){
			alertBox('W','불가사유가 망미 또는 투자비과다일 시 투지바과다(억원)는 필수입니다.');
			return false;
			
		}
		
		if($('#silsadisable').val() == 'AIR01' && ($('#silsaBussiness').val() == '' || $('#silsaContractDt').val() == '')){
			alertBox('W','불가사유가 타사독점일 시 독점사업자와 계약기간은 필수입니다.');
			return false;
		}

		if( regNumberPoinrRange.test($('#silsaExceed').val()) == false && ($('#silsadisable').val() == 'AIR05' || $('#silsadisable').val() == 'AIR06')) {
			alertBox('W','투자비과다(억원)은 숫자 또는 소수점 둘째자리까지 입력 가능합니다.');
			return false;
		}
		
		if(regEngNum.test($('#silsaTangoCd').val()) == false){
			alertBox('W','공사코드는 영문(대문자)과 숫자로 작성하여야 합니다.');
			return false;
		}
		
		if($('#silsaTangoCd').val() != "" && $('#silsaTangoCd').val().length != 15){
			alertBox('W','공사코드는 15자리로 입력하여야 합니다.');
			return false;
		}
		
		if(regEngNum.test($('#swingBldCd').val()) == false){
			alertBox('W','Swing 건물코드는 영문(대문자)과 숫자로 작성하여야 합니다.');
			return false;
		}
		
		if($('#swingBldCd').val() != "" && $('#swingBldCd').val().length != 15){
			alertBox('W','Swing 건물코드는 15자리로 입력하여야 합니다.');
			return false;
		}
		
	}
	
	/**
	 * 추가 컬럼에 대한 Validation 필요함.
	 */
	/*if($('#popBldNm').val().length > 100) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['buildingName'], 100));
		return false;
	}
	
	if($('#popHmstZnNm').val().length > 100) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['znName'], 100));
		return false;
	}
	
	if($('#popCnstnCompNm').val().length > 100) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['builder'], 100));
		return false;
	}
	
	if($('#popCstrChrgTlno').val().length > 20) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['cntac'], 20));
		return false;
	}
	
	if($('#popFildTlplNo').val().length > 30) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['telephonePoleNumber'], 30));
		return false;
	}
	
	if($('#popFdaisMgmtNo').val().length > 30) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['conductLineNumber'], 30));
		return false;
	}
	
	if($('#popFdaisRmk').val().length > 250) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['remark'], 250));
		return false;
	}*/
	
	if($('#popConlChrrNm').val().length > 25) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['conselThePersonInCharge'], 25));
		return false;
	}
	
	if($('#popConlChrrCntacVal').val().length > 60) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['conselThePersonInChargeCntac'], 60));
		return false;
	}
	
	if($('#popOhcpnCurstDetlCtt').val().length > 500) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['otherCompaniesCurrentStateDetailDetails'], 500));
		return false;
	}
	
	if($('#popLnConnImpsRsnCtt').val().length > 500) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['lineConnectionImpossibilityReasonContent'], 500));
		return false;
	}
	
	if($('#popTlplDivVal').val().length > 20) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['telephonePoleDivision'], 20));
		return false;
	}
	
	if($('#popTlplItNo').val().length > 10) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['informationTechnologyNumber'], 10));
		return false;
	}
	
	var tlplItNoValue = $('#popTlplItNo').val();
	var stringByteLength = (function(s,b,i,c){
		for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
		return b
	})(tlplItNoValue);
	
	//console.log("stringByteLength :" + stringByteLength);
	
	if(stringByteLength > 10) {
		alertBox('W',makeArgMsg('textLimit', buildingInfoMsgArray['informationTechnologyNumber'], 10));
		return false;
	}
	
	if( regNumberPoint.test($('#popArilDistVal').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['aerialMeter']));
		return false;
	}

	if( regNumberPoint.test($('#popArilGrdTotDistVal').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['aerialMeterPlusGroundMeter']));
		return false;
	}
	
	if( regNumberPoint.test($('#popGrdDistVal').val()) ) {
		alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['groundMeter']));
		return false;
	}
	
	/*if($('#popCstrChrgTlno').val() == "") {
		alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['cntac']));
		return false;
	}*/

	for(var i=0; i<dongInfoInsertList.length; i++) {
		if(dongInfoInsertList[i].div == "F") {
			if( dongInfoInsertList[i].bldBlkNm == "필수입력" || dongInfoInsertList[i].bldBlkNm == "" ) {
				alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['dongName']));
	    		return false;
			}
		}
	}
	
	for(var i=0; i<dongInfoUpdateList.length; i++) {
		if(dongInfoUpdateList[i].div == "F") {
			if( dongInfoUpdateList[i].bldBlkNm == "필수입력" || dongInfoUpdateList[i].bldBlkNm == "" ) {
				alertBox('W',makeArgMsg('requiredObject', buildingInfoMsgArray['dongName']));
	    		return false;
			}
		}
	}
	
	return true;
}


function buildingInfoSave() {
	//alert("안뇽!!");
	//건물 동 정보 데이터 셋팅   
	$('#'+gridDetailId).alopexGrid('endEdit', {_state:{editing:true}});
	
	var dongInfoInsertList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
	var dongInfoUpdateList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
	var dongInfoDeleteList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	
	
	var dongInfoNaverList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, edited : false, deleted : false }, "div":"N"} ));
	
	var fileInsertList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
	var fileDeleteList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
	
	// 유효성 체크
	//if( !checkValidation(dongInfoInsertList, dongInfoUpdateList) ) {
		//bodyProgressRemove();
		//return false;
	//}

	var dataParam =  $("#detailForm").getData();
	
	
	$.each(dataParam, function(key, value) {
		
		if(key != "pnuLtnoCd") {
			var replaceKey = key.replace("pop", "fdais");
			
			if(value != null || value != "") {
				dataParam[replaceKey] = value;
			}
		}
	});

	dataParam.gridData = { 
			dongInfoInsertList : dongInfoInsertList
			, dongInfoUpdateList : dongInfoUpdateList
			, dongInfoDeleteList : dongInfoDeleteList
			, dongInfoNaverList : dongInfoNaverList
			, fileInsertList : fileInsertList
			, fileDeleteList : fileDeleteList
	};
	
	//dataParam.fdaisAddrBunjiVal = $('#bunjiVal').val();
	
	dataParam.fdaisAddrBunjiVal = $('#bunjiVal').val();
	if(m_bSKT == false){
		dataParam.silsaContractDt = $('#silsaContractDt').val().replaceAll("-", "");
		dataParam.silsaFinshdt = $('#silsaFinshdt').val().replaceAll("-", "");
		dataParam.silsaHeadOff = $('#silsaHeadOffCd').val();
		dataParam.silsaInfra = $('#silsaInfraCd').val();
		dataParam.silsaMKT = $('#silsaMKTCd').val();
		dataParam.silsaEnterprise = $('#silsaEnterpriseCd').val();
		dataParam.silsaHNS = $('#silsaHNSCd').val();
		dataParam.silsaTeam = $('#silsaTeamCd').val();
		dataParam.silsaSKTNS = $('#silsaSKTNSCd').val();
		dataParam.silsaBPComp = $('#silsaBPCompCd').val();
		dataParam.silsaTangoCd = $('#silsaTangoCd').val();
		dataParam.swingBldCd = $('#swingBldCd').val();
		
	}
	////////////////////
	
	dataParam.bpCd = szBpCd;
	dataParam.bSKT = m_bSKT;
	
	////////////////////
	
	buildingDetailRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingmerge', dataParam, 'POST', 'buildingMerge');
}


function UserCallback(data) {
	
	if(data.length > 1){
		alertBox('W', '하나의 데이터만 선택 가능합니다.');
		return;
	}
	
   if(data !== null && data != undefined  && data.length == 1) { 
	   var userNm = data[0].userNm; 
	   var userId = data[0].userId;
	   $(MappingfInfo).val(userNm);
	   $(MappingCodeInfo).val(userId);
	   
	   MappingfInfo = '';
   }
}


//////////////////////////////////////////////////////////
//  첨부파일
//////////////////////////////////////////////////////////

/*
 * Function Name : fillAddChange
 * Description   : 파일목록에추가
 * ----------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function fillAddChange(fileAddNm){
	// GRID에 파일추가
	
	var dataList =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") );
	var fileExsitYn = false;
	for (var i = 0; i < dataList.length; i++) {
		var fileNm = dataList[i].atflNm;
		if (fileNm == fileAddNm) {
			fileExsitYn = true;
		}
	}

	if (fileExsitYn == false) {
		//console.log(dataList);
		tempFileSrno = tempFileSrno+1;
		//console.log(tempFileSrno);
		var initRowData = [{"atflId" : "", "tempFileNo" : tempFileSrno+"", "atflNm" : fileAddNm, "fdaisNo" : fdaisNo}];
		$('#'+gridFile).alopexGrid("dataAdd", initRowData);
		/*
		 * >> GRID 추가완료와 동시에 업로드
		 * ---------------------------------------------------------------------------------
		 * AddLocalFileObject(fileObject, fileMarkValue, uploadId)
		 * File 태그와 업로드 연동이 필요한 경우 파일을 추가 하고 전송
		 * ---------------------------------------------------------------------------------
		 * fileObject    : 첨부할 파일태그
		 * fileMarkValue : 첨부하는 파일의 mark 값이 필요한 경우 값
		 *                 전송 완료 후 각 파일의 입력하신 mark 값이 리턴
		 * uploadID      : 첨부하려는 업로드의 id값
		 */
		var tdpFile = document.getElementById("fileAdd");
		DEXT5UPLOAD.AddLocalFileObject(tdpFile, tempFileSrno, "dext5upload");
		$('#fileAdd').val("");
	}
}


////////////////////////////////////////
//// 파일전송
////////////////////////////////////////
/*
 * Function Name : DEXT5UPLOAD_OnTransfer_Start
 * Description   : 파일전송 시작
 * ----------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function DEXT5UPLOAD_OnTransfer_Start(uploadID) {
	//root path : c:\\app\\upload (변경 될 수 있음)
	//working group folder 아래 특정 경로를 원하시면 아래의 customPath에 값을 입력하시면 됩니다.
	//ex: c:\\app\\upload\\tagnoc\\customPath\\2016\\08
	//DEXT5UPLOAD.AddFormData("tangot", "tangot", uploadID);
}

/*
 * Function Name : DEXT5UPLOAD_OnCreationComplete
 * Description   : 파일영역 생성
 * ----------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function DEXT5UPLOAD_OnCreationComplete(uploadID) {
	 G_UploadID = uploadID;
	 $('#editorResult').text('업로드 생성 완료 : ' + uploadID);
}

/*
 * Function Name : DEXT5UPLOAD_OnTransfer_Complete
 * Description   : 파일추가완료
 * ----------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function DEXT5UPLOAD_OnTransfer_Complete(uploadID) {
	/**완료시 responseCustomValue의 값이 리턴됩니다. **/
	/**반드시 저장해 두었다가 다운로드시(함수 : AddUploadedFile) 해당 값을 5번째 파리미터(CustomValue)에 입력하셔야 이력 관리가 가능합니다.**/

	// DEXT5 Upload는 json, xml, text delimit 방식으로 결과값을 제공
	// 신규 업로드된 파일
	//var jsonNew = DEXT5UPLOAD.GetNewUploadListForJson(uploadID);
	// var xmlNew = DEXT5UPLOAD.GetNewUploadListForXml(uploadID);
	//var textNew = DEXT5UPLOAD.GetNewUploadListForText(uploadID);
	// 삭제된 파일
	// var jsonDel = DEXT5UPLOAD.GetDeleteListForJson(uploadID);
	// var xmlDel = DEXT5UPLOAD.GetDeleteListForXml(uploadID);
	//var textDel = DEXT5UPLOAD.GetDeleteListForText(uploadID);
	// 전체결과
	// var textAll = DEXT5UPLOAD.GetAllFileListForText(uploadID);
	var jsonAll = DEXT5UPLOAD.GetAllFileListForJson(uploadID);
	// var xmlAll = DEXT5UPLOAD.GetAllFileListForXml(uploadID);

	var result = "전송결과 \n" + JSON.stringify(jsonAll)
	$('#editorResult').text( result);

	// 파일목록에 취득한 일련번호를 셋팅
	var gridFileList = AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") );;
	var tempRowMap = [];
	
	var tempFileList;
    
	for (var i = 0; i < gridFileList.length; i++) {
		tempFileList = gridFileList[i];
   	 	//if (tempFileList._state.added == "true" && tempFileList._state.deleted == "false") {
		if (nullToEmpty(tempFileList.tempFileNo)+"" != "" && nullToEmpty(tempFileList.tempFileNo)+"" !=undefined) {
			tempRowMap[tempFileList.tempFileNo+""] = tempFileList._index.row;    		 
		}
	}

	var newFileInfo = null;
	if (jsonAll != null && jsonAll.newFile != null && jsonAll.newFile.responseCustomValue !=null && jsonAll.newFile.responseCustomValue.length > 0) {
		newFileInfo = jsonAll.newFile;

		for (var j=0; j < newFileInfo.responseCustomValue.length; j++) { 
			$('#'+gridFile).alopexGrid('cellEdit', newFileInfo.responseCustomValue[j], {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'atflId');   // 파일ID셋팅
			$('#'+gridFile).alopexGrid('refreshCell', {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'atflId'); //파일ID셋팅
			$('#'+gridFile).alopexGrid('cellEdit', newFileInfo.originalName[j], {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'atflNm');   // 파일명
			$('#'+gridFile).alopexGrid('refreshCell', {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'atflNm'); //파일명
		}
	} 
	else {
		//alert("1");
	} 
	//saveTransDemandInfo();	 	
	//alert("안뇽");
	buildingInfoSave();
}

/*
 * Function Name : DEXT5UPLOAD_OnError
 * Description   : 파일 에러시
 * ----------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function DEXT5UPLOAD_OnError(uploadID, code, message, uploadedFileListObj) {
	var str = 'Error : ' + code + ', ' + message + '\n';
    if (uploadedFileListObj != null && uploadedFileListObj != '') {
    	str += '업로드 된 파일 리스트 - \n';
        var uploadedFileLen = uploadedFileListObj.length;
        for (var i = 0; i < uploadedFileLen; i++) {
            str += uploadedFileListObj[i].uploadName + ', ' + uploadedFileListObj[i].uploadPath + '\n';

            // guid: uploadedFileListObj[i].guid
            // originName: uploadedFileListObj[i].originName
            // fileSize: uploadedFileListObj[i].fileSize
            // uploadName: uploadedFileListObj[i].uploadName
            // uploadPath: uploadedFileListObj[i].uploadPath
            // logicalPath: uploadedFileListObj[i].logicalPath
            // order: uploadedFileListObj[i].order
            // status: uploadedFileListObj[i].status
            // mark: uploadedFileListObj[i].mark
            // responseCustomValue: uploadedFileListObj[i].responseCustomValue
        }
    }
    $('#editorResult').text( str);
    alertBox('W',buildingInfoMsgArray['failFileUpload']);
    return;
}

/*
 * Function Name : fillAddChange
 * Description   : 파일추가
 * ----------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function DEXT5UPLOAD_UploadingCancel(uploadID, uploadedFileListObj) {
	G_UploadID = uploadID;
	
	var str = '전송 취소 이벤트 : ' + G_UploadID + '\n';
	
	if (uploadedFileListObj != null && uploadedFileListObj != '') {
		str += '업로드 된 파일 리스트 - \n';
	    var uploadedFileLen = uploadedFileListObj.length;
	    for (var i = 0; i < uploadedFileLen; i++) {
	        str += uploadedFileListObj[i].uploadName + ', ' + uploadedFileListObj[i].uploadPath + '</br>';
	
	        // guid: uploadedFileListObj[i].guid
	        // originName: uploadedFileListObj[i].originName
	        // fileSize: uploadedFileListObj[i].fileSize
	        // uploadName: uploadedFileListObj[i].uploadName
	        // uploadPath: uploadedFileListObj[i].uploadPath
	        // logicalPath: uploadedFileListObj[i].logicalPath
	        // order: uploadedFileListObj[i].order
	        // status: uploadedFileListObj[i].status
	        // mark: uploadedFileListObj[i].mark
	        // responseCustomValue: uploadedFileListObj[i].responseCustomValue
	    }
	}
	$('#editorResult').text( str);
}
//////////////////////////////////////////////////////////