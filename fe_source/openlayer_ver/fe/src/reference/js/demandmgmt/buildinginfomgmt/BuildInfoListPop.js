/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 8. 04. 오후 5:42:00
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultPopGrid';
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//console.log(id,param);

        initGrid();
    	setCombo();
    	setEventListener();
    };

  	//Grid 초기화
    function initGrid() {
    	var mapping =  [
			//공통
			{
				selectorColumn : true,
				width : "40px" 
			}
			, { 
				numberingColumn : true,
				key : "id",
				title : buildingInfoMsgArray['sequence'],
				align : "right",
				width : "55px",
				numberingColumn : true
			}, {
				key : 'div',
				align:'center',
				width:'100px',
				title : buildingInfoMsgArray['division']
			}
			, {
				key : 'baseAreaYn',
				align:'center',
				width:'100px',
				title : buildingInfoMsgArray['baseAreaYesOrNo']
			}
			, {
				key : 'sidoNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['siDo']
			}
			, {
				key : 'sggNm',
				align:'left',
				width:'200px',
				title : buildingInfoMsgArray['siGunGu']
			}
			/*, {
				key : 'guNm',
				align:'center',
				width:'100px',
				title : '구',
			}*/
			, {
				key : 'emdNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['eupMyeonDong']
			}
			, {
				key : 'riNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['ri']
			}
			, {
				key : 'bunjiType',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['buildingSiteDiv']
			}
			, {
				key : 'addrBunjiVal',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['bunji']
			}
			
			,
			
			//U.Key 건물
			{
				key : 'bldTypNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['buildingType']
			}
			, {
				key : 'bldCd',
				align:'center',
				width:'140px',
				title : buildingInfoMsgArray['buildingCode']
			}
			, {
				key : 'ukeyBldCd',
				align:'center',
				width:'140px',
				title : buildingInfoMsgArray['ukeyBuildingCode']
			}
			, {
				key : 'bldNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['buildingName']
			}
			, {
				key : 'floorMax',
				align:'right',
				width:'100px',
				title : buildingInfoMsgArray['floorMax']
			}
			, {
				key : 'dongCnt',
				align:'right',
				width:'100px',
				title : buildingInfoMsgArray['dongCount']
			}
			,  
			
			
			//국소정보
			{
				key : 'nitsRepCd',
				align:'center',
				width:'100px',
				hidden: true,
				title : buildingInfoMsgArray['nitsRepresentationCode']
			}
			, {
				key : 'erpShrRepFcltsCd',
				align:'center',
				width:'100px',
				title : buildingInfoMsgArray['enterpriseResourcePlanningShareRepresentationFacilityCode']
			}
			, {
				key : 'sktCbntDistVal',
				align:'right',
				width:'100px',
				title : buildingInfoMsgArray['skTelecomCabinetDistance']
			}
			, {
				key : 'skbCbntDistVal',
				align:'right',
				width:'100px',
				title : buildingInfoMsgArray['skBroadBandCabinetDistance']
			}
			, {
				key : 'bldTlplDistVal',
				align:'right',
				width:'100px',
				title : buildingInfoMsgArray['telephonePoleDistance']
			}
			
			// 현장실사 건물정보
			, {
				key : "fdaisFrstRegUserId",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['registrant']
			}
			, {
				key : "fdaisFrstRegDate",
				align : "center",
				width : "100px",
				title : buildingInfoMsgArray['registrationDateTime']
			}
			, {
				key : "fdaisBldMgmtTypNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['managementType']
			}
			, {
				key : "fdaisBldCstrTypNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['cstrTyp']
			}
			, {
				key : "fdaisBldBizTypNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['businessToBusinessBusinessToConsumer']
			}
			, {
				key : "fdaisHmstZnNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['homeSiteZoneName']
			}
			, {
				key : "fdaisLdongCd",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['legalDongCode'],
				hidden : true
			}
			, {
				key : "fdaisSidoNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['siDo'],
				hidden : true
			}
			, {
				key : "fdaisSggNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['siGunGu'],
				hidden : true
			}
			, {
				key : "fdaisGuNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['gu'],
				hidden : true
			}
			, {
				key : "fdaisEmdNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['eupMyeonDong'],
				hidden : true
			}
			, {
				key : "fdaisRiNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['ri'],
				hidden : true
			}
			, {
				key : "fdaisAddrBunjiVal",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['bunji'],
				hidden : true
			}
			, {
				key : "fdaisAllAddr",
				align : "left",
				width : "250px",
				title : buildingInfoMsgArray['address'],
				hidden : true
			}
			, {
				key : "fdaisAllAddrDetail",
				align : "left",
				width : "250px",
				title : buildingInfoMsgArray['detailAddress']
			}
			, {
				key : "fdaisBldCd",
				align : "center",
				width : "140px",
				title : buildingInfoMsgArray['buildingCodeFieldActualInspection']
			}
			, {
				key : "fdaisBldNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['buildingName']
			}
			, {
				key : "fdaisGrudFlorCntNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['groundFloor']
			}
			, {
				key : "fdaisBsmtFlorCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['basementFloor']
			}
			, {
				key : "fdaisBldMainUsgNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['mainUsage']
			}
			, {
				key : "fdaisBldCnstDivNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['cnstrDivisionName']
			}
			, {
				key : "fdaisBldCnstAr",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['buildingAr']
			}
			, {
				key : "fdaisBldGenCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['generationCountGen']
			}
			, {
				key : "fdaisBldHoushCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['householdCountHousehole']
			}
			, {
				key : "fdaisBldPrcsNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['buildingProcess']
			}
			, {
				key : "fdaisCnstnCompNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['builder']
			}
			, {
				key : "fdaisCstrChrgTlno",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['cntac']
			}
			, {
				key : "fdaisCmplSchdDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['completionScheduleDt']
			}
			, {
				key : "fdaisUseAprvDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['useApprovalDt']
			}
			, {
				key : "fdaisFildTlplNo",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['telephonePoleNumber']
			}
			, {
				key : "fdaisFdaisMgmtNo",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['conductLineNumber']
			}
			, {
				key : "fdaisFdaisDistVal",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['distance']
			}
			, {
				key : "fdaisFdaisRmk",
				align : "left",
				width : "300px",
				title : buildingInfoMsgArray['remark']
			}
			, {
				key : "fdaisDongCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['dongCount']
			}
			, {
				key : "fdaisVisitCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['visitCount']
			}
			//현장실사 추가 컬럼
			, {
				key : "fdaisConlChrrNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['conselThePersonInCharge']
			}
			, {
				key : "fdaisConlChrrCntacVal",
				align : "left",
				width : "120px",
				title : buildingInfoMsgArray['conselThePersonInChargeCntac']
			}
			, {
				key : "fdaisOhcpnIndpStatCd",
				align : "center",
				width : "100px",
				hidden : true,
				title : buildingInfoMsgArray['otherCompaniesIndependenceYesOrNo']
			}
			, {
				key : "fdaisOhcpnIndpStatNm",
				align : "center",
				width : "100px",
				title : buildingInfoMsgArray['otherCompaniesIndependenceYesOrNo']
			}
			, {
				key : "fdaisOhcpnCurstDetlCtt",
				align : "left",
				width : "150px",
				title : buildingInfoMsgArray['otherCompaniesCurrentStateDetailDetails']
			}
			, {
				key : "fdaisCdlnChrUchgCd",
				hidden : true,
				align : "center",
				width : "120px",
				title : buildingInfoMsgArray['conductLineExistenceAndNonexistenceYesOrNo']
			}
			, {
				key : "fdaisCdlnChrUchgYn",
				align : "center",
				width : "120px",
				title : buildingInfoMsgArray['conductLineExistenceAndNonexistenceYesOrNo']
			}
			, {
				key : "fdaisLinLnConnYn",
				align : "center",
				width : "120px",
				hidden : true
			}
			, {
				key : "fdaisLinLnConnYnNm",
				align : "center",
				width : "120px",
				title : buildingInfoMsgArray['leadInLineConnectionYesOrNo']
			}
			, {
				key : "fdaisLinLnConnImpsRsnCd",
				align : "center",
				width : "120px",
				hidden : true
			}
			, {
				key : "fdaisLinLnConnImpsRsnNm",
				align : "center",
				width : "120px",
				title : buildingInfoMsgArray['lesdInLineimpossibilityReason']
			}
			, {
				key : "fdaisLnConnImpsRsnCtt",
				align : "left",
				width : "150px",
				title : buildingInfoMsgArray['lineConnectionImpossibilityReasonContent']
			}
			, {
				key : "fdaisTlplDivVal",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['telephonePoleDivision']
			}
			, {
				key : "fdaisTlplItNo",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['informationTechnologyNumber']
			}
			, {
				key : "fdaisArilDistVal",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['aerialMeter']
			}
			, {
				key : "fdaisArilGrdTotDistVal",
				align : "right",
				width : "120px",
				title : buildingInfoMsgArray['aerialMeterPlusGroundMeter']
			}
			, {
				key : "fdaisGrdDistVal",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['groundMeter']
			}
			, {
				key : "fdaisIpCstrNeedYn",
				align : "center",
				width : "120px",
				title : buildingInfoMsgArray['ipConstructionNeedYesOrNo']
			}
			
			//세움터
			, {
				key : 'lcenLndLoc',
				align:'left',
				width:'250px',
				title : buildingInfoMsgArray['buildingSiteLocation']
			}
			, {
				key : 'lcenAdongCd',
				align:'center',
				width:'100px',
				title : buildingInfoMsgArray['siGunGuCode'],
				hidden : true
			}
			, {
				key : 'lcenLdongCd',
				align:'center',
				width:'100px',
				title : buildingInfoMsgArray['legalDongCode'],
				hidden : true
			}
			, {
				key : 'lcenLdongNm',
				align:'center',
				width:'100px',
				title : buildingInfoMsgArray['legalDong'],
				hidden : true
			}
			, {
				key : 'lcenLndDivNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['buildingSiteDiv']
			}
			, {
				key : 'lcenMgmtNo',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['licensingManagementNumber']
			}
			, {
				key : 'lcenBldNm',
				align:'left',
				width:'200px',
				title : buildingInfoMsgArray['buildingName'],
				hidden : true
			}
			, {
				key : 'lcenSpcNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['buildingSpecialName']
			}
			, {
				key : 'lcenBlkNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['block']
			}
			, {
				key : 'lcenLotNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['lot']
			}
			, {
				key : 'lcenBldLdcgNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['landCategoryName']
			}
			, {
				key : 'lcenBldAreaNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['areaName']
			}
			, {
				key : 'lcenBldZnNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['znName']
			}
			, {
				key : 'lcenBldDsrctNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['districtName']
			}
			, {
				key : 'lcenBldCnstDivNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['cnstrDivisionName']
			}
			
			, { 
				key : "lcenLndAr", 
				align : "right", 
				width : "100px",
				title : buildingInfoMsgArray['buildingSiteAr']
			}
			, { 
				key : "lcenBldCnstAr", 
				align : "right", 
				width : "100px",
				title : buildingInfoMsgArray['buildingAr']
			}
			, { 
				key : "lcenBldCoverageRate",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['buildingCoverage']
			}
			, { 
				key : "lcenBldTotFlorAr",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['grossAr']
			}
			, { 
				key : "lcenCbgRateCalcUsgAr", 
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['cubageRateCalculationAr']
			}
			, { 
				key : "lcenCbgRate",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['cubageRate']
			},
				{
				key : "lcenMainCnstrCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['mainCnstrCount']
			}
			, {
				key : "lcenAnxCnstrCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['annexConstructionCount']
			}
			, {
				key : "lcenBldMainUsgNm",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['mainUsage']
			}
			, {
				key : "lcenGrudFlorCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['groundFloor']
			}
			, {
				key : "lcenBsmtFlorCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['basementFloor']
			}
			, {
				key : "lcenBldGenCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['generationCountGen']
			}
			, {
				key : "lcenBlduntCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['unitCountUnit']
			}
			, {
				key : "lcenBldHoushCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['householdCountHousehole']
			}
			, {
				key : "lcenTotParkCnt",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['totalParkCount']
			}
			, {
				key : "lcenBgcscSchdDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['beginConstructionScheduleDt']
			}
			, {
				key : "lcenBgcscDlayDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['beginConstructionDelayDt']
			}
			, {
				key : "lcenRealBgcscDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['realBeginConstructionDt']
			}
			, {
				key : "lcenBldCnstAppvDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['cnstrApprovalDt']
			}
			, {
				key : "lcenUseAprvDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['useApprovalDt']
			}
			, {
				key : "lcenCreDt",
				align : "center",
				width : "90px",
				title : buildingInfoMsgArray['createDate']
			}
			
			
			// 구축정보 (NITS 연계 정보)
			/*, {
				key : "nitsArilDistVal",
				title : buildingInfoMsgArray['distance'],
				align : "right",
				width : "100px"
			}
			, {
				key : "nitsArilInvtEyn",
				title : buildingInfoMsgArray['InvestExistenceAndNonexistence'],
				align : "center",
				width : "100px"
			}
			, {
				key : "nitsArilCstrCostVal",
				title : buildingInfoMsgArray['constructionCost'],
				align : "right",
				width : "100px"
			}
			, {
				key : "nitsArilScreYn",
				title : buildingInfoMsgArray['secureExistenceAndNonexistence'],
				align : "center",
				width : "100px"
			}
			, {
				key : "nitsGrdDistVal",
				title : buildingInfoMsgArray['distance'],
				align : "right",
				width : "100px"
			}
			, {
				key : "nitsGrdInvtEyn",
				title : buildingInfoMsgArray['InvestExistenceAndNonexistence'],
				align : "center",
				width : "100px"
			}
			, {
				key : "nitsGrdCstrCostVal",
				title : buildingInfoMsgArray['constructionCost'],
				align : "right",
				width : "100px"
			}
			, {
				key : "nitsGrdScreYn",
				title : buildingInfoMsgArray['secureExistenceAndNonexistence'],
				align : "center",
				width : "100px"
			}*/
			
			// 활용 여부 (U.Key)
			, {
				key : "bukeyUseYn",
				title : buildingInfoMsgArray['PracticalYesOrNo'],
				align : "center",
				width : "100px"
			}
			, {
				key : "lteUseYn",
				title : buildingInfoMsgArray['wirelessRepeater'],
				align : "center",
				width : "100px"
			}
			, {
				key : "wifiUseYn",
				title : buildingInfoMsgArray['wirelessWirelessFidelity'],
				align : "center",
				width : "100px"
			}
			, {
				key : "bukeyVldYn",
				title : buildingInfoMsgArray['businessToBusiness'],
				align : "center",
				width : "100px"
			}
			, {
				key : "bukeySspdAvlbYn",
				title : buildingInfoMsgArray['businessToConsumer'],
				align : "center",
				width : "100px"
			}
			, {
				key : "bukeyLinMthdVal",
				title : buildingInfoMsgArray['leadInMethod'],
				align : "left",
				width : "100px"
			}
			, {
				key : "bukeyCnstOnrNm",
				title : buildingInfoMsgArray['constructOwnerName'],
				align : "left",
				width : "100px"
			}
			, {
				key : "bldScreDate",
				title : buildingInfoMsgArray['SecureDt'],
				align : "center",
				width : "90px"
			}
			, {
				key : 'bldAddr',
				align:'left',
				width:'100px',
				hidden: true,
				title : buildingInfoMsgArray['address']
			}
    	];
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            defaultColumnMapping : {
            	inlineStyle : {
            		background: function(value, data, mapping){
            			if(data.lcenAddrChgYn == 'Y'){
							return '#FFB2D9';
						}else{
							return '#FFFFFF';
						}
            		}
            	}
            },
            columnMapping : mapping,
            headerGroup : [
                  			{ fromIndex :  2 , toIndex :  15 , title : buildingInfoMsgArray['buildingInformation'] , id : "GunmulInfo"}
                  			, { fromIndex : 16 , toIndex : 20 , title : buildingInfoMsgArray['smallMtsoInformation'] , id : "Kuksa" }
                  			, { fromIndex : 21 /*55*/ , toIndex : 73 /*88*/ , title : buildingInfoMsgArray['fieldActualInspectionBuildingInformation'], id : "Silsa"}
                  			, { fromIndex : 74 /*19*/ , toIndex : 109 /*54*/ , title : buildingInfoMsgArray['bldLcen'], id : "Saeum"}
                  			/*, { fromIndex : 89 , toIndex : 96 , title : buildingInfoMsgArray['constructInfo'] , id : "Nits" }
                  			, { fromIndex : 89 , toIndex : 92 , title : buildingInfoMsgArray['aerialBuildingLeadBeforeStep'] , id : "Process" }
                  			, { fromIndex : 93 , toIndex : 96 , title : buildingInfoMsgArray['grd'] , id : "Underground" } */
                  			, { fromIndex : 110 /*97*/ , toIndex : 117 /*104*/ , title : buildingInfoMsgArray['PracticalYesOrNoUkey'] , id : "Ukey" }
                  			, { fromIndex : 111 /*98*/ , toIndex : 114 /*101*/ , title : buildingInfoMsgArray['secureType'] , id : "UkeyProcure" }
            ],
            paging:{
				pagerSelect:false
			}
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
    	            
        
        $('#'+gridId).on("dblclick", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;

        	//console.log(param);
        	
        	//건물수요팝업창에서는 데이터값을 전달해준다.
        	
        	if(param.div != "기축건물") {
        		var reSearchParam = {pnuLtnoCd : param.pnuLtnoCd};
        		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingpopup', reSearchParam, 'GET', 'searchBuilding');
        	}
        	else {
        		//기축정보만 있는 경우 기존로직대로 그리드에서 데이터를 받아서 셋팅한다.
        		
        		var lcenBldMainUsgNm = ""; //주용도
        		var lcenBldGenCnt = ""; //세대
        		var lcenBldHoushCnt = ""; //가구
        		var lcenGrudFlorCnt = ""; //지상(층)
        		var lcenBsmtFlorCnt = ""; //지하(층)
        		
        		if(null == param.fdaisBldMainUsgCd || param.fdaisBldMainUsgCd == "") {lcenBldMainUsgNm = param.lcenBldMainUsgNm;}else{lcenBldMainUsgNm = param.fdaisBldMainUsgNm;}
        		if(null == param.fdaisBldGenCnt || param.fdaisBldGenCnt == "") {lcenBldGenCnt = param.lcenBldGenCnt;}else{lcenBldGenCnt = param.fdaisBldGenCnt;}
        		if(null == param.fdaisBldHoushCnt || param.fdaisBldHoushCnt == "") {lcenBldHoushCnt = param.lcenBldHoushCnt;}else{lcenBldHoushCnt = param.fdaisBldHoushCnt;}
        	
        		if(null == param.fdaisGrudFlorCntCd || param.fdaisGrudFlorCntCd == "") {lcenGrudFlorCnt = param.lcenGrudFlorCnt;}else{lcenGrudFlorCnt = param.fdaisGrudFlorCntNm;}
        		if(null == param.fdaisBsmtFlorCnt || param.fdaisBsmtFlorCnt == "") {lcenBsmtFlorCnt = param.lcenBsmtFlorCnt;}else{lcenBsmtFlorCnt = param.fdaisBsmtFlorCnt;}
        	
        		var allAddr = "";
        		
        		if(null == param.riNm || param.riNm == "") {
        			allAddr = param.sidoNm + " " + param.sggNm + " " + param.emdNm + " " + param.addrBunjiVal;
        		}
        		else {
        			allAddr = param.sidoNm + " " + param.sggNm + " " + param.emdNm + " " + param.riNm + " " + param.addrBunjiVal;
        		}
        		
        		var map = {
        				lcenMgmtNo : param.lcenMgmtNo //인허가관리번호
        				, lcenBldCnstDivNm : param.lcenBldCnstDivNm //건축구분명
        				, lcenMainCnstrCnt : param.lcenMainCnstrCnt //주건물수
        				, lcenAnxCnstrCnt : param.lcenAnxCnstrCnt //부건물수
        				, pnuLtnoCd : param.pnuLtnoCd //PNU
        				, bldNm : param.bldNm //건물명
        				, lcenBldMainUsgNm : lcenBldMainUsgNm //주용도
        				, lcenBldGenCnt : lcenBldGenCnt //세대
        				, lcenBldHoushCnt : lcenBldHoushCnt //가구
        				, lcenGrudFlorCntNm : lcenGrudFlorCnt //지상(층)
        				, lcenBsmtFlorCnt : lcenBsmtFlorCnt //지하(층)
        				, lcenBgcscSchdDt : param.lcenBgcscSchdDt //착공예정일
        				, lcenBgcscDlayDt : param.lcenBgcscDlayDt //착공연기일
        				, nitsArilScreYn : param.nitsArilScreYn //NITS 확보여부
        				, allAddr : allAddr //주소
        				, bldCd : param.bldCd
        				, fdaisBldCd : param.fdaisBldCd
        		}
        		//console.log("popup");
        		$a.close(map);
        	}
        });
        
        $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	
        	if($('#sidoNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',"시도는 필수 입니다.");
        		return false;
        	}
         	
         	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
         	if($('#sidoNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',"시도는 필수 입니다.");
        		return false;
        	}
         	
        	var param = getParam();
        	
        	param.pageNo = eObj.page;
        	param.rowPerPage = eObj.pageinfo.perPage;
         	
        	startSearch(param);
        });
    };
    
    function validation() {
    	
    	var validationCheck = true;
    	
    	// 조회 필수 항목 체크
    	if(!$("input:checkbox[id='all']").is(":checked")
    			&& !$("input:checkbox[id='saeum']").is(":checked")
    			&& !$("input:checkbox[id='gcmmBtoB']").is(":checked")
    			&& !$("input:checkbox[id='gcmmOther']").is(":checked")
    			&& !$("input:checkbox[id='silsa']").is(":checked")) {
    		
    		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
    		validationCheck = false;
    	}
    	
    	return validationCheck;
    }
    
    function getParam() {
    	//tango transmission biz 모듈을 호출하여야한다.
    	var dataParam =  $("#popSearchForm").getData();
    	
    	// 구분값 추가
    	var gcmm = false;
    	if($("input:checkbox[id='gcmmBtoB']").is(":checked") || $("input:checkbox[id='gcmmOther']").is(":checked")) {
    		gcmm = true;
    	}
    	dataParam.gcmm = gcmm;
    	
    	//Date 타입 변경 ( YYYY-MM-DD -> YYYYMMDD )
    	$.map( dataParam, function(value, key){
    		if(key.indexOf("DtStart") > -1 || key.indexOf("DtEnd") > -1) {
    			dataParam[key] = value.replaceAll("-", "");
    		}
    		
    		if(key.indexOf("kpi_") > -1) {
    			dataParam[key] = value.toString();
    		}
    	});
    	
    	return dataParam;
    }
    
    function startSearch(dataParam) {
		/**
		 * 페이지 셋팅
		 */
		if(dataParam.rowPerPage == 0) {
			dataParam.rowPerPage = 100;
		}
		//showProgress(gridId);
		bodyProgress();
		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/list', dataParam, 'GET', 'buildingInfoList');
	}
    
    function setCombo() {
    	selectComboCode('bldMgmtTypCd', 'Y', 'C00649', '');
    	//selectComboCode('bldLdcgCd', 'Y', 'C00643', '');
    	//selectComboCode('bldMainUsgCd', 'Y', 'C00648', '');
    	
    	selectSido("sidoNm");
    }
    
    function setEventListener() {
        // 검색
        $('#popSearch').on('click', function(e) {
        	
        	if(!validation()) {
        		bodyProgressRemove();
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
        	if($('#sidoNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',"시도는 필수 입니다.");
        		return false;
        	}
        	
        	var param = getParam();
        	
        	var pageNo = 0;
        	var rowPerPage = 0;
        	
        	var pageInfo = $('#'+gridId).alopexGrid('pageInfo');
        	
        	param.pageNo = pageNo;
        	param.rowPerPage = rowPerPage;
        	
        	startSearch(param);
        });
        
        $('#all').on('change', function(e) {
        	if($("input:checkbox[id='all']").is(":checked")) {
        		$('#saeum').setChecked(true);
        		$('#gcmmBtoB').setChecked(true);
        		$('#gcmmOther').setChecked(true);
        		$('#silsa').setChecked(true);
        	}
        	else {
        		$('#saeum').setChecked(false);
        		$('#gcmmBtoB').setChecked(false);
        		$('#gcmmOther').setChecked(false);
        		$('#silsa').setChecked(false);
        	}
        });
        
        $('#saeum').on('change', function(e) {
        	if(!$("input:checkbox[id='saeum']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
        });
        
        $('#gcmmBtoB').on('change', function(e) {
        	if(!$("input:checkbox[id='gcmmBtoB']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
        });

		$('#gcmmOther').on('change', function(e) {
			if(!$("input:checkbox[id='gcmmOther']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
		});

		$('#silsa').on('change', function(e) {
			if(!$("input:checkbox[id='silsa']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
		});
		
		$('#sidoNm').on('change', function(e) {
        	if($('#sidoNm').val() != "") {
        		selectSgg("sggNm", $('#sidoNm').val());
        		selectEmd("emdNm", ' ', ' ');
        	}
        	else {
        		selectSgg("sggNm", ' ');
        		selectEmd("emdNm", ' ', ' ');
        	}
        });
        
        $('#sggNm').on('change', function(e) {
        	if($('#sggNm').val() != "") {
        		selectEmd("emdNm", $('#sidoNm').val(), $('#sggNm').val());
        	}
        	else {
        		selectEmd("emdNm", ' ', ' ');
        	}
        });
	};

	//request
	function buildingRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successBuildingInfoCallback(response, sflag);})
    	  .fail(function(response){failBuildingInfoCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successBuildingInfoCallback(response, flag){
    	if(flag == 'buildingInfoList'){
    		bodyProgressRemove();
    		//hideProgress(gridId);
    		//console.log(response.list);
    		var serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    		
    		$('#'+gridId).alopexGrid("dataSet", response.list, serverPageinfo);
    	}
    	else if(flag == 'searchBuilding') {
    		//bodyProgressRemove();
    		$a.close(response.map);
    	}
    }
    
    //request 실패시.
    function failBuildingInfoCallback(serviceId, response, flag){
    	bodyProgressRemove();
    	//console.log(response);
    	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
    }
});