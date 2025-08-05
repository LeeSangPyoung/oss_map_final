/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 21. 오후 1:44:03
 * @version 1.0
 */

  	//Grid 초기화
    function initDetailGrid(gridId, bSKT, buseSelect) {
    	var mapping =  [
			//공통
			{
				selectorColumn : true,
				width : "40px",
				hidden : !buseSelect
			}
			, { 
				numberingColumn : true,
				key : "id",
				title : buildingInfoMsgArray['sequence'],
				align : "right",
				width : "55px",
				numberingColumn : true
			}
			, {
				key : 'hdofcNm',
				align:'center',
				width:'100px',
				title : "본부"
			}
			, {
				key : 'bonbuArea',
				align:'center',
				width:'100px',
				hidden: true,
				title : "지사"
			}
			, {
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
			
			// GIS 정보
			, {
				key : 'ktoaYn',
				align:'center',
				width:'80px',
				title : 'KTOA'
			}
			, {
				key : 'rapaYn',
				align:'center',
				width:'80px',
				title : 'RAPA'
			}
		    
			// 구축현황
			, {
				key : 'silsaMedia',
				align:'center',
				width:'100px',
				title : '인입매체',
				hidden : bSKT
			}
			, {
				key : 'silsaMethod',
				align:'center',
				width:'100px',
				title : '방식',
				hidden : bSKT
			}
			, {
				key : 'silsaYnCrst',
				align:'center',
				width:'100px',
				title : '구축유무',
				hidden : bSKT
			}
			, {
				key : 'silsaFinshdt',
				align:'center',
				width:'100px',
				title : '공사완료일',
				hidden : bSKT
			}
			, {
				key : 'silsaTangoCd',
				align:'center',
				width:'100px',
				title : 'Tango 공사코드',
				hidden : bSKT
			}
			, {
				key : 'silsaInsEqp',
				align:'center',
				width:'100px',
				title : '장비설치',
				hidden : bSKT
			}
			, {
				key : 'silsadisable',
				align:'center',
				width:'100px',
				title : '불가사유',
				hidden : bSKT
			}
			, {
				key : 'silsaDetail',
				align:'center',
				width:'100px',
				title : '세부사유',
				hidden : bSKT
			}
			, {
				key : 'silsaExceed',
				align:'right',
				width:'120px',
				title : '투자비 과다(억원)',
				hidden : bSKT
			}
			, {
				key : 'silsaBussiness',
				align:'center',
				width:'100px',
				title : '독점사업자',
				hidden : bSKT
			}
			, {
				key : 'silsaContractDt',
				align:'center',
				width:'100px',
				title : '계약기간',
				hidden : bSKT
			}
			, {
				key : 'silsaProcStat',
				align:'center',
				width:'100px',
				title : '진행현황',
				hidden : bSKT
			}
			//가용현황(Swing)
			, {
				key : 'silsaHSpeedYN',
				align:'center',
				width:'100px',
				title : '초고속가용여부',
				hidden : bSKT
			}
			, {
				key : 'silsaLnAvlbYn',
				align:'center',
				width:'100px',
				title : '선로가용 여부',
				hidden : bSKT
			}
			, {
				key : 'silsaLnEnable',
				align:'center',
				width:'100px',
				title : '선로가용',
				hidden : bSKT
			}
			, {
				key : 'silsaFTTH',
				align:'center',
				width:'100px',
				title : 'FTTH',
				hidden : bSKT
			}
			, {
				key : 'silsaHFC',
				align:'center',
				width:'100px',
				title : 'HFC',
				hidden : bSKT
			}
			, {
				key : 'silsaOpticE',
				align:'center',
				width:'100px',
				title : '광랜E',
				hidden : bSKT
			}
			, {
				key : 'silsaCo',
				align:'center',
				width:'100px',
				title : '기업',
				hidden : bSKT
			}	
			, {
				key : 'silsaBizOne',
				align:'center',
				width:'100px',
				title : '비즈ONE',
				hidden : bSKT
			}			
			, {
				key : 'silsaHighLan',
				align:'center',
				width:'100px',
				title : '하이랜',
				hidden : bSKT
			}
			, {
				key : 'silsaGwangLanV',
				align:'center',
				width:'100px',
				title : '광랜V',
				hidden : bSKT
			}
			, {
				key : 'silsaVDSL',
				align:'center',
				width:'100px',
				title : 'VDSL',
				hidden : bSKT
			}
			, {
				key : 'silsaGwangLanW',
				align:'center',
				width:'100px',
				title : '광랜W',
				hidden : bSKT
			}
			, {
				key : 'silsaEqpAvlbRegDt',
				align:'center',
				width:'100px',
				title : 'P-BOX',
				hidden : bSKT
			}
			, {
				key : 'silsaFTTxTel',
				align:'center',
				width:'100px',
				title : 'FTTx_전화',
				hidden : bSKT
			}
			, {
				key : 'silsaHFCTel',
				align:'center',
				width:'100px',
				title : 'HFC_전화',
				hidden : bSKT
			}
			, {
				key : 'silsaLnEnableLast',
				align:'center',
				width:'100px',
				title : '선로가용',
				hidden : bSKT
			}
			, {
				key : 'silsaFTTHLast',
				align:'center',
				width:'100px',
				title : 'FTTH',
				hidden : bSKT
			}
			, {
				key : 'silsaHFCLast',
				align:'center',
				width:'100px',
				title : 'HFC',
				hidden : bSKT
			}
			, {
				key : 'silsaOpticELast',
				align:'center',
				width:'100px',
				title : '광랜E',
				hidden : bSKT
			}
			, {
				key : 'silsaCoLast',
				align:'center',
				width:'100px',
				title : '기업',
				hidden : bSKT
			}			
			, {
				key : 'silsaBizOneLast',
				align:'center',
				width:'100px',
				title : '비즈ONE',
				hidden : bSKT
			}
			, {
				key : 'silsaHighLanLast',
				align:'center',
				width:'100px',
				title : '하이랜',
				hidden : bSKT
			}
			, {
				key : 'silsaGwangLanVLast',
				align:'center',
				width:'100px',
				title : '광랜V',
				hidden : bSKT
			}
			, {
				key : 'silsaVDSLLast',
				align:'center',
				width:'100px',
				title : 'VDSL',
				hidden : bSKT
			}
			, {
				key : 'silsaGwangLanWLast',
				align:'center',
				width:'100px',
				title : '광랜W',
				hidden : bSKT
			}
			, {
				key : 'silsaEqpAvlbRegDtLast',
				align:'center',
				width:'100px',
				title : 'P-BOX',
				hidden : bSKT
			}
			, {
				key : 'silsaFTTxTelLast',
				align:'center',
				width:'100px',
				title : 'FTTx_전화',
				hidden : bSKT
			}
			, {
				key : 'silsaHFCTelLast',
				align:'center',
				width:'100px',
				title : 'HFC_전화',
				hidden : bSKT
			}
			, {
				key : 'silsaGenNum',
				align:'right',
				width:'100px',
				title : '건물세대수',
				hidden : bSKT
			}
			, {
				key : 'hSpeedScrbrCnt',
				align:'right',
				width:'100px',
				title : '초고속가입자수',
				hidden : bSKT
			}
			, {
				key : 'iptvScrbrCnt',
				align:'right',
				width:'100px',
				title : 'IPTV가입자수',
				hidden : bSKT
			}
			
			//담당 Mapping
			, {
				key : 'silsaHeadOff',
				align:'center',
				width:'100px',
				title : '본사',
				hidden : bSKT
			}
			, {
				key : 'silsaHeadOffCd',
				align:'center',
				width:'100px',
				title : '본사코드',
				hidden : true
			}
			, {
				key : 'silsaInfra',
				align:'center',
				width:'100px',
				title : 'Infra(지역)',
				hidden : bSKT
			}
			, {
				key : 'silsaInfraCd',
				align:'center',
				width:'100px',
				title : 'Infra(지역)코드',
				hidden : true
			}
			, {
				key : 'silsaMKT',
				align:'center',
				width:'100px',
				title : 'MKT(지역)',
				hidden : bSKT
			}
			, {
				key : 'silsaMKTCd',
				align:'center',
				width:'100px',
				title : 'MKT(지역)코드',
				hidden : true
			}
			, {
				key : 'silsaEnterprise',
				align:'center',
				width:'100px',
				title : '기업(지역)',
				hidden : bSKT
			}
			, {
				key : 'silsaEnterpriseCd',
				align:'center',
				width:'100px',
				title : '기업(지역)코드',
				hidden : true
			}
			, {
				key : 'silsaHNS',
				align:'center',
				width:'100px',
				title : 'H&S(지역)',
				hidden : bSKT
			}
			, {
				key : 'silsaHNSCd',
				align:'center',
				width:'100px',
				title : 'H&S(지역)코드',
				hidden : true
			}
			, {
				key : 'silsaTeam',
				align:'center',
				width:'100px',
				title : '품솔팀',
				hidden : bSKT
			}
			, {
				key : 'silsaTeamCd',
				align:'center',
				width:'100px',
				title : '품솔팀코드',
				hidden : true
			}
			, {
				key : 'silsaSKTNS',
				align:'center',
				width:'100px',
				title : 'SKTNS',
				hidden : bSKT
			}
			, {
				key : 'silsaSKTNSCd',
				align:'center',
				width:'100px',
				title : 'SKTNS코드',
				hidden : true
			}
			, {
				key : 'silsaBPComp',
				align:'center',
				width:'100px',
				title : 'BP사',
				hidden : bSKT
			}
			, {
				key : 'silsaBPCompCd',
				align:'center',
				width:'100px',
				title : 'BP사코드',
				hidden : true
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
				key : 'skbClctYn',
				align:'center',
				width:'120px',
				title : "SKB RPA 수집여부"
			}
			, {
				key : 'skbClctDt',
				align:'center',
				width:'120px',
				title : "SKB RPA 수집일"
			}
			, {
				key : 'areaBpNm',
				align:'left',
				width:'100px',
				title : "권역BP",
				hidden : bSKT
			}
			, {
				key : 'bpNm',
				align:'left',
				width:'100px',
				title : "BP"
			}
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
				title : buildingInfoMsgArray['conselThePersonInCharge'],
				hidden : !bSKT
			}
			, {
				key : "fdaisConlChrrCntacVal",
				align : "left",
				width : "120px",
				title : buildingInfoMsgArray['conselThePersonInChargeCntac'],
				hidden : !bSKT
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
				title : buildingInfoMsgArray['otherCompaniesIndependenceYesOrNo'],
				hidden : !bSKT
			}
			, {
				key : "fdaisOhcpnCurstDetlCtt",
				align : "left",
				width : "150px",
				title : buildingInfoMsgArray['otherCompaniesCurrentStateDetailDetails'],
				hidden : !bSKT
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
				title : buildingInfoMsgArray['conductLineExistenceAndNonexistenceYesOrNo'],
				hidden : !bSKT
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
				title : buildingInfoMsgArray['leadInLineConnectionYesOrNo'],
				hidden : !bSKT
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
				title : buildingInfoMsgArray['lesdInLineimpossibilityReason'],
				hidden : !bSKT
			}
			, {
				key : "fdaisLnConnImpsRsnCtt",
				align : "left",
				width : "150px",
				title : buildingInfoMsgArray['lineConnectionImpossibilityReasonContent'],
				hidden : !bSKT
			}
			, {
				key : "fdaisTlplDivVal",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['telephonePoleDivision'],
				hidden : !bSKT
			}
			, {
				key : "fdaisTlplItNo",
				align : "left",
				width : "100px",
				title : buildingInfoMsgArray['informationTechnologyNumber'],
				hidden : !bSKT
			}
			, {
				key : "fdaisArilDistVal",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['aerialMeter'],
				hidden : !bSKT
			}
			, {
				key : "fdaisArilGrdTotDistVal",
				align : "right",
				width : "120px",
				title : buildingInfoMsgArray['aerialMeterPlusGroundMeter'],
				hidden : !bSKT
			}
			, {
				key : "fdaisGrdDistVal",
				align : "right",
				width : "100px",
				title : buildingInfoMsgArray['groundMeter'],
				hidden : !bSKT
			}
			, {
				key : "fdaisIpCstrNeedYn",
				align : "center",
				width : "120px",
				title : buildingInfoMsgArray['ipConstructionNeedYesOrNo'],
				hidden : !bSKT
			}
			
			//세움터
			, {
				key : 'lcenType',
				align:'left',
				width:'100px',
				title : "유형"
			}
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
               			{ fromIndex :  2 , toIndex :  17 , title : buildingInfoMsgArray['buildingInformation'] , id : "GunmulInfo"}
               			, { fromIndex : 18 , toIndex : 19 , title : 'GIS 정보' , id : "GISInfo" }
               			, { fromIndex : 20 , toIndex : 30 , title : '구축현황' , id : "CrstStat" }
               			, { fromIndex : 29 , toIndex : 30 , title : '타사독점' , id : "Ohcpn" }
               			, { fromIndex : 32 , toIndex : 62 , title : '가용현황(SWING)' , id : "SwingInfo" }
               			, { fromIndex : 34 , toIndex : 46 , title : '최초 가용등록일' , id : "SwingFrstDate" }
               			, { fromIndex : 47 , toIndex : 59 , title : '최종 가용등록일' , id : "SwingLastDate" }
               			, { fromIndex : 63 , toIndex : 78 , title : '담당 Mapping' , id : "UserInfo" }
               			, { fromIndex : 79 , toIndex : 83 , title : buildingInfoMsgArray['smallMtsoInformation'] , id : "Kuksa" }
               			, { fromIndex : 84 /*55*/ , toIndex : 140 /*88*/ , title : buildingInfoMsgArray['fieldActualInspectionBuildingInformation'], id : "Silsa"}
               			, { fromIndex : 141 /*19*/ , toIndex : 177 /*54*/ , title : buildingInfoMsgArray['bldLcen'], id : "Saeum"}
               			/*, { fromIndex : 89 , toIndex : 96 , title : buildingInfoMsgArray['constructInfo'] , id : "Nits" }
               			, { fromIndex : 89 , toIndex : 92 , title : buildingInfoMsgArray['aerialBuildingLeadBeforeStep'] , id : "Process" }
               			, { fromIndex : 93 , toIndex : 96 , title : buildingInfoMsgArray['grd'] , id : "Underground" } */
               			, { fromIndex : 178 /*97*/ , toIndex : 185 /*104*/ , title : buildingInfoMsgArray['PracticalYesOrNoUkey'] , id : "Ukey" }
               			, { fromIndex : 179 /*98*/ , toIndex : 182 /*101*/ , title : buildingInfoMsgArray['secureType'] , id : "UkeyProcure" }
            ],
            paging:{
				pagerSelect:false
			}
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
    };