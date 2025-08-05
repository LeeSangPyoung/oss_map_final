/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 8. 16. 오후 5:50:00
 * @version 1.0
 */
$a.page(function() {
	
	//그리드 ID
    var gridBasicId = 'resultPopBasicGrid';
    //replaceAll prototype 선언
    
    var gridDongId = 'resultPopDongGrid';
    
    var gridFlorId = 'resultPopFlorGrid';

    var searchFlag = true;
    var searchTimer;
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	console.log("start");
    	console.log(param);

        initGrid();
    	setCombo(param);
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
        $('#'+gridBasicId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
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
        
        $('#'+gridBasicId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	
         	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
         	if($('#sidoNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',buildingInfoMsgArray['checkForBuildingInfoSido']); /*시도는 필수 입니다.*/
        		return false;
        	}
         	
        	var param = getParam();
        	
        	param.pageNo = eObj.page;
        	param.rowPerPage = eObj.pageinfo.perPage;
         	
        	startSearch(param);
        });
        
        var dongMapping = [
			//공통
			{
				selectorColumn : true,
				width : "30px" 
			}
			, {
				key : 'bldBlkNo',
				align:'right',
				width:'100px',
				hidden: true,
				title : buildingInfoMsgArray['dongNumber']
			}
			, {
				key : 'bldBlkNm',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['dongName']
			}
			, {
				key : 'bldRmk',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['remark']
			}
        ];
        
        //그리드 생성
        $('#'+gridDongId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            height : 250,
            numberingColumnFromZero : false,
            pager : false,
            columnMapping : dongMapping
        });
        
        
        var florMapping = [
       			//공통
       			{
       				selectorColumn : true,
       				width : "30px" 
       			}
       			, {
       				key : 'bldFlorNo',
       				align:'right',
       				width:'100px',
       				hidden: true,
       				title : buildingInfoMsgArray['buildingFloorNumber']
       			} 
       			, {
       				key : 'grudBsmtDivCd',
       				align:'center',
       				width:'100px',
       				title : buildingInfoMsgArray['florDivisionCode']
       			}
       			, {
       				key : 'bldFlorCnt',
       				align:'right',
       				width:'100px',
       				title : buildingInfoMsgArray['buildingFloorNumber'] /*buildingInfoMsgArray['buildingFloorCount']*/
       			}
       			, {
       				key : 'bldRmk',
       				align:'left',
       				width:'200px',
       				title : buildingInfoMsgArray['remark']
       			}
        ];
        
      //그리드 생성
        $('#'+gridFlorId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            height : 250,
            numberingColumnFromZero : false,
            pager : false,
            columnMapping : florMapping
        });
        
        
        $('#'+gridBasicId).on("click", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;
        	//console.log("selected Params");
        	//console.log(param);
        	
        	if(param.hasOwnProperty('bldCd')) {
        		$('#'+gridDongId).alopexGrid('dataEmpty');
            	$('#'+gridFlorId).alopexGrid('dataEmpty');
            	bodyProgress();
            	//showProgress(gridDongId);
        		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingdong', param, 'GET', 'searchBuildingDong');
        	}
        });
        
        $('#'+gridDongId).on("click", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;
        	//console.log("selected Params");
        	//console.log(param);
        	
        	if(param.hasOwnProperty('bldCd') && param.hasOwnProperty('bldBlkNo')) {
        		bodyProgress();
        		//showProgress(gridFlorId);
        		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingflor', param, 'GET', 'searchBuildingFlor');
        	}
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
    	dataParam.div = "external";
    	
    	console.log(dataParam);
    	
    	return dataParam;
    }
    
    function startSearch(dataParam) {
		/**
		 * 페이지 셋팅
		 */
		if(dataParam.rowPerPage == 0) {
			dataParam.rowPerPage = 100;
		}
		//showProgress(gridBasicId);
		bodyProgress();
		
		$('#'+gridDongId).alopexGrid('dataEmpty');
    	$('#'+gridFlorId).alopexGrid('dataEmpty');
		
		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/list', dataParam, 'GET', 'buildingInfoList');
	}
    
    function setCombo(externalParam) {
    	selectComboCode('bldMgmtTypCd', 'Y', 'C00649', '');
    	
    	if(externalParam.hasOwnProperty('bldCd')) {
    		
    		if(externalParam.bldCd != "") {
    			var dataParam = { bldCd : externalParam.bldCd };
        		bodyProgress();
        		
        		searchFlag = false;
        		
        		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/bldselectone', dataParam, 'GET', 'bldselectone');
    		}
    		else {
    			selectSido("sidoNm");
    		}
    	}
    	else {
    		selectSido("sidoNm");
    	}
    }
    
    function setEventListener() {
    	// 국사조회에서 bldCd 를 넘겨줬을 경우 해당 키가 존재 한다면, 조회해서 조회조건 셋팅 후 검색. 	
    	
    	// 검색
        $('#popSearch').on('click', function(e) {

        	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
        	if($('#sidoNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',buildingInfoMsgArray['checkForBuildingInfoSido']);
        		return false;
        	}
        	
        	var param = getParam();
        	
        	var pageNo = 0;
        	var rowPerPage = 0;
        	
        	var pageInfo = $('#'+gridBasicId).alopexGrid('pageInfo');
        	
        	param.pageNo = pageNo;
        	param.rowPerPage = rowPerPage;
        	
        	startSearch(param);
        });
        
        // 적용
        $('#popSelect').on('click', function(e) {
        	//console.log("Selected");
        	
        	var bldInfo = $('#'+gridBasicId).alopexGrid("dataGet", { _state : {selected : true}} )[0];
        	var bldDongInfo = $('#'+gridDongId).alopexGrid("dataGet", { _state : {selected : true}} )[0];
        	var bldFlorInfo = $('#'+gridFlorId).alopexGrid("dataGet", { _state : {selected : true}} )[0];
        	
        	//console.log(bldInfo);
        	//console.log(bldDongInfo);
        	//console.log(bldFlorInfo);
        	
        	if(bldInfo == undefined) {
        		alertBox('W',buildingInfoMsgArray['SelectForbuildingBasicInfo']);
        		return false;
        	}
        	
        	if(bldDongInfo == undefined) {
        		bldDongInfo = null;
        	}
        	
        	if(bldFlorInfo == undefined) {
        		bldFlorInfo = null;
        	}
        	
        	var param = {
        			bldInfo : bldInfo
        			, bldDongInfo : bldDongInfo
        			, bldFlorInfo : bldFlorInfo
        	};
        	
        	console.log(param);
        	$a.close(param);
        });
        
        $('#btnBuildInfoCreate').on('click', function(e) {
        	
        	var regNumber = /[^0-9]/g;
        	var regNumberPoint = /[^\.0-9]/g;
        	
        	if($('#sidoNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',makeArgMsg('checkVirtualBuilding', buildingInfoMsgArray['siDo']));
        		//alertBox('W',"시도는 필수 입니다.<br>('가상건물생성'은 조회조건을 기반으로 등록 합니다.)");
        		return false;
        	}
        	
        	if($('#sggNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',makeArgMsg('checkVirtualBuilding', buildingInfoMsgArray['siGunGu']));
        		//alertBox('W',"시군구는 필수 입니다.<br>('가상건물생성'은 조회조건을 기반으로 등록 합니다.)");
        		return false;
        	}
        	
        	if($('#emdNm option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',makeArgMsg('checkVirtualBuilding', buildingInfoMsgArray['eupMyeonDong']));
        		//alertBox('W',"읍면동은 필수 입니다.<br>('가상건물생성'은 조회조건을 기반으로 등록 합니다.)");
        		return false;
        	}
        	
        	if($('#bigBunjiVal').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',makeArgMsg('checkVirtualBuilding', buildingInfoMsgArray['mainBunji']));
        		//alertBox('W',"본번지는 필수 입니다.<br>('가상건물생성'은 조회조건을 기반으로 등록 합니다.)");
        		return false;
        	}
        	else {
        		if( regNumber.test($('#bigBunjiVal').val()) ) {
        			alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['mainBunji']));
        			//alertBox('W',"번지는 숫자만 입력 가능합니다.");
        			return false;
        		}
        		
        		var bigBunjiLen = $('#bigBunjiVal').val().length;
        		if(bigBunjiLen > 4) {
        			alertBox('W',makeArgMsg('inputBunjiForBuildingInfo', buildingInfoMsgArray['mainBunji']));
        			//alertBox('W',"번지는 4자리까지 가능 합니다.");
            		return false;
        		}
        	}
        	
        	if($('#smlBunjiVal').val() == "") {
        		
        	}
        	else {
        		if( regNumber.test($('#smlBunjiVal').val()) ) {
        			alertBox('W',makeArgMsg('requiredDecimal', buildingInfoMsgArray['subBunji']));
        			//alertBox('W',"번지는 숫자만 입력 가능합니다.");
        			return false;
        		}
        		
        		var smlBunjiLen = $('#smlBunjiVal').val().length;
        		if(smlBunjiLen > 4) {
        			alertBox('W',makeArgMsg('inputBunjiForBuildingInfo', buildingInfoMsgArray['subBunji']));
        			//alertBox('W',"번지는 4자리까지 가능 합니다.");
            		return false;
        		}
        	}
        	
        	if($('#lndDivCd option:selected').val() == "") {
        		//bodyProgressRemove();
        		alertBox('W',makeArgMsg('checkVirtualBuilding', buildingInfoMsgArray['buildingSiteDiv']));
        		//alertBox('W',"대지구분은 필수 입니다.<br>('가상건물생성'은 조회조건을 기반으로 등록 합니다.)");
        		return false;
        	}
        	bodyProgress();
        	var param = getParam();
        	console.log(param);
        	
        	/*$a.popup({
        		popid : 'VirtualBuildingCreate',
        		url : 'VirtualBuildingCreate.do',
        		data : param,
        		iframe : true,
        		modal : true,
        		width : 830,
        		height : 630,
        		title : "가상건물등록",
        		movable : true,
        		callback : function(data){
        			
        			console.log(data);
        			
        		}
        	});*/
        	
        	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/virtualbuildingcreate', param, 'POST', 'virtualbuildingcreate');
        });
        
        /**
         * 층 자동생성
         */
        $('#btnBuildInfoFlorAutoCreate').on('click', function(e) {
        	
        	var bldInfo = $('#'+gridBasicId).alopexGrid("dataGet", { _state : {selected : true}} );
        	var bldDongInfo = $('#'+gridDongId).alopexGrid("dataGet", { _state : {selected : true}} );
        	
        	console.log(bldInfo);
        	console.log(bldDongInfo);
        	
        	if(bldInfo.length != 1) {
        		alertBox('W',buildingInfoMsgArray['SelectForbuildingBasicInfo']);
        		return false;
        	}
        	
        	if(bldDongInfo.length != 1) {
        		alertBox('W',buildingInfoMsgArray['SelectForbuildingBasicInfo']);
        		return false;
        	}
        	
        	if($('#florMaxVal').val() == "" && $('#florMinVal').val() == "" && $('#florRoofVal').val() == ""){
        		alertBox('W','지상, 지하, 옥상 세가지 중 하나이상 입력하여야 합니다.'); 
        		return false;
        	}
        	
        	var regNumber = /[^0-9]/g;
        	
        	if( regNumber.test($('#florMaxVal').val()) ) {
        		alertBox('W',buildingInfoMsgArray['floorIsPossibleOnlyNumber']); /*층은 숫자만 입력 가능 합니다.*/
        		return false;
        	}
        	if( regNumber.test($('#florMinVal').val()) ) {
        		alertBox('W',buildingInfoMsgArray['floorIsPossibleOnlyNumber']); /*층은 숫자만 입력 가능 합니다.*/
        		return false;
        	}
        	if( regNumber.test($('#florRoofVal').val()) ) {
        		alertBox('W',buildingInfoMsgArray['floorIsPossibleOnlyNumber']); /*층은 숫자만 입력 가능 합니다.*/
        		return false;
        	}

        	if($('#florMaxVal').val().length > 2) {
        		alertBox('W',makeArgMsg('inputFlorForBuildingInfo', buildingInfoMsgArray['ground']));
        		//alertBox('W',"층은 2자리까지 입력 가능 합니다."); /*층은 숫자만 입력 가능 합니다.*/
        		return false;
        	}
        	if($('#florMinVal').val().length > 2) {
        		alertBox('W',makeArgMsg('inputFlorForBuildingInfo', buildingInfoMsgArray['basement']));
        		//alertBox('W',"층은 2자리까지 입력 가능 합니다."); /*층은 숫자만 입력 가능 합니다.*/
        		return false;
        	}
        	if($('#florRoofVal').val().length > 2) {
        		alertBox('W',makeArgMsg('inputFlorForBuildingInfo', '옥상'));
        		//alertBox('W',"층은 2자리까지 입력 가능 합니다."); /*층은 숫자만 입력 가능 합니다.*/
        		return false;
        	}
        	
        	var param = {
        			bldCd : bldInfo[0].bldCd
        			, bldBlkNo : bldDongInfo[0].bldBlkNo
        			, florMaxVal : $('#florMaxVal').val()
        			, florMinVal : $('#florMinVal').val()
        			, florRoofVal : $('#florRoofVal').val()
        	};
        	
        	console.log(param);
        	bodyProgress();
        	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingautoflorcreate', param, 'POST', 'buildingautoflorcreate');
        });
        
        /**
         * 동 자동생성
         */
        $('#btnBuildInfoDongAutoCreate').on('click', function(e) {
        	
        	var bldInfo = $('#'+gridBasicId).alopexGrid("dataGet", { _state : {selected : true}} );
        	var dongName = $('#dongVal').val();
        	
        	console.log(bldInfo);
        	console.log(dongName);
        	
        	if(bldInfo.length != 1) {
        		alertBox('W',buildingInfoMsgArray['SelectForbuildingBasicInfo']);
        		return false;
        	}
        	
        	if(dongName.trim() == ""){
        		alertBox('W',makeArgMsg('required',buildingInfoMsgArray['dongName'])); /*필수 입력 항목입니다.[동이름]*/
        		return false;
        	}
        	
        	if(dongName.length > 30) {
        		alertBox('W',buildingInfoMsgArray['dongNameIs30maxLengthPossible']); /* 동이름은 30자리까지 입력 가능합니다. */
        		return false;
        	}
        	
        	var dongList = AlopexGrid.currentData($('#'+gridDongId).alopexGrid("dataGet"));
  		  	for (var i = 0 ; i < dongList.length; i++) {
  		  		if (dongName == dongList[i].bldBlkNm) {
  		  			alertBox('W',buildingInfoMsgArray['exitTheSameDongInfomation']);/* 같은 이름의 동정보가 있습니다. */
  		  			return false;
  		  		}
  		  	}
        	
        	var param = {
        			bldCd : bldInfo[0].bldCd
        			, dongVal : $('#dongVal').val()
        	};
        	
        	console.log(param);
        	bodyProgress();
        	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingautodongcreate', param, 'POST', 'buildingautodongcreate');
        });
       
        /*
         * CheckBox Event
         * 깔끔한 방법 없을까... 너무 지저분하다...
         */
        $('#all').on('change', function(e) {
        	if($("input:checkbox[id='all']").is(":checked")) {
    			$('#saeum').setChecked(false);
    			$('#gcmmBtoB').setChecked(true);
    			$('#gcmmOther').setChecked(true);
    			$('#silsa').setChecked(false);
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
        	else {
    			$('#saeum').setChecked(false);
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
			else {
    			$('#silsa').setChecked(false);
        	}
		});
		
		$('#sidoNm').on('change', function(e) {
			if(searchFlag == true) {
				if($('#sidoNm').val() != "") {
	        		selectSgg("sggNm", $('#sidoNm').val());
	        		selectEmd("emdNm", ' ', ' ');
	        	}
	        	else {
	        		selectSgg("sggNm", ' ');
	        		selectEmd("emdNm", ' ', ' ');
	        	}
			}
        });
        
        $('#sggNm').on('change', function(e) {
        	if(searchFlag == true) {
        		if($('#sggNm').val() != "") {
            		selectEmd("emdNm", $('#sidoNm').val(), $('#sggNm').val());
            	}
            	else {
            		selectEmd("emdNm", ' ', ' ');
            	}
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
    		//hideProgress(gridBasicId);
    		var serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    		
    		$('#'+gridBasicId).alopexGrid("dataSet", response.list, serverPageinfo);
    	}
    	else if(flag == 'searchBuildingDong') {
    		bodyProgressRemove();
    		//hideProgress(gridDongId);
    		$('#'+gridDongId).alopexGrid("dataSet", response.list);
    	}
    	else if(flag == 'searchBuildingFlor') {
    		bodyProgressRemove();
    		//hideProgress(gridFlorId);
    		$('#'+gridFlorId).alopexGrid("dataSet", response.list);
    	}
    	else if(flag == 'virtualbuildingcreate') {
    		bodyProgressRemove();
    		
    		if(response.Result == "Success") {
    			callMsgBox('','I', buildingInfoMsgArray['saveSuccess'], function(msgId, msgRst){  
            		if (msgRst == 'Y') {
            			$('#popSearch').click();
            		}
            	});
    		}
    		else {
    			alertBox('W', buildingInfoMsgArray[response.Message]);
    		}
    	}
    	else if(flag == 'bldselectone') {
    		
    		console.log(response);
    		if(response.map.length > 0) {
    			var param = response.map[0];
    			console.log("TEST!!!");
    			console.log(param);
    			
    			if(param.hasOwnProperty("sidoNm")) {
    				selectSearchSido("sidoNm", param.sidoNm);
    			}
    			
				if(param.hasOwnProperty("sggNm")) {
					selectSearchSgg("sggNm", param.sidoNm, param.sggNm);				
				}
				
				if(param.hasOwnProperty("emdNm")) {
					selectSearchEmd("emdNm", param.sidoNm, param.sggNm, param.emdNm);
				}
				
				if(param.hasOwnProperty("riNm")) {
					$("#riNm").val(param.riNm);
				}

				if(param.hasOwnProperty("bigBunjiVal")) {
					$("#bigBunjiVal").val(param.bigBunjiVal);
				}
				
				if(param.hasOwnProperty("smlBunjiVal")) {
					
					if(param.smlBunjiVal != '0') {
						$("#smlBunjiVal").val(param.smlBunjiVal);
					}
				}
				
				if(param.hasOwnProperty("bunjiType")) {
					$("#lndDivCd").setSelected(param.bunjiType);
				}
				
				if(param.hasOwnProperty("bldNm")) {
					$("#bldNm").val(param.bldNm);
				}
				
				
				searchTimer = setInterval(bldSearch, 1000);
				
				
				//bodyProgressRemove();
				
				//searchFlag = true;
				
				//$("#popSearch").click();
    		}
    		else {
    			selectSido("sidoNm");
    			bodyProgressRemove();
        		searchFlag = true;
    		}
    	}
    	else if(flag == 'buildingautoflorcreate') {
    		console.log(response);
    		bodyProgressRemove();
    		if(response.Result == "Success") {
    			callMsgBox('','I', buildingInfoMsgArray['saveSuccess'], function(msgId, msgRst){  
            		if (msgRst == 'Y') {
            			var param = $('#'+gridDongId).alopexGrid("dataGet", { _state : {selected : true}} )[0];
            			if(param.hasOwnProperty('bldCd') && param.hasOwnProperty('bldBlkNo')) {
                    		bodyProgress();
                    		//showProgress(gridFlorId);
                    		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingflor', param, 'GET', 'searchBuildingFlor');
                    	}
            			//$('#popSearch').click();
            		}
            	});
    		}
    		else if(response.Result == "Exist") {
    			callMsgBox('','I', buildingInfoMsgArray['ckeckFloor'], function(msgId, msgRst){  /*이미 해당 층이 존재 합니다.*/
            		if (msgRst == 'Y') {
            			
            		}
            	});
    		}
    		else {
    			alertBox('W', buildingInfoMsgArray[response.Message]);
    		}
    	}
    	else if(flag == 'buildingautodongcreate') {
    		console.log(response);
    		bodyProgressRemove();
    		if(response.Result == "Success") {
    			callMsgBox('','I', buildingInfoMsgArray['saveSuccess'], function(msgId, msgRst){  
            		if (msgRst == 'Y') {
            			var param = $('#'+gridBasicId).alopexGrid("dataGet", { _state : {selected : true}} )[0];
            			
                    	if(param.hasOwnProperty('bldCd')) {
                    		$('#'+gridDongId).alopexGrid('dataEmpty');
                        	$('#'+gridFlorId).alopexGrid('dataEmpty');
                        	bodyProgress();
                    		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingdong', param, 'GET', 'searchBuildingDong');
                    	}
            		}
            	});
    		}
    		else if(response.Result == "Exist") {
    			callMsgBox('','I', buildingInfoMsgArray['ckeckFloor'], function(msgId, msgRst){  /*이미 해당 층이 존재 합니다.*/
            		if (msgRst == 'Y') {
            			
            		}
            	});
    		}
    		else {
    			alertBox('W', buildingInfoMsgArray[response.Message]);
    		}
    		/*if(response.Result == "Success") {
    			callMsgBox('','I', buildingInfoMsgArray['saveSuccess'], function(msgId, msgRst){
            		if (msgRst == 'Y') {
            			var param = $('#'+gridBasicId).alopexGrid("dataGet", { _state : {selected : true}} )[0];
            			
                    	if(param.hasOwnProperty('bldCd')) {
                    		$('#'+gridDongId).alopexGrid('dataEmpty');
                        	$('#'+gridFlorId).alopexGrid('dataEmpty');
                        	bodyProgress();
                    		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingdong', param, 'GET', 'searchBuildingDong');
                    	}
            		}
            	});
    		}
    		else {
    			alertBox('W', buildingInfoMsgArray[response.Message]);
    		}*/
    	}

    }
    
    function bldSearch() {
    	console.log(searchSidoFlag + ", " + searchSggFlag + ", " + searchEmdFlag);
    	if(searchSidoFlag && searchSggFlag && searchEmdFlag) {
    		bodyProgressRemove();
    		searchFlag = true;
    		clearInterval(searchTimer);
    		$("#popSearch").click();
    	}
    }
    
    //request 실패시.
    function failBuildingInfoCallback(serviceId, response, flag){
    	bodyProgressRemove();
    	//console.log(response);
    	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
    }
});