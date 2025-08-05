/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 26. 오후 4:04:03
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridLineDetailId = 'resultPopLineGrid';
	var gridLanDetailId = 'resultPopLanGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);
    	
    	initGrid();
    	//initLanGrid();
    	setEventListener(param);
    };
    
    //Grid 초기화
    function initGrid() {
    	
    	var lineMapping = [
			//공통
			{
				key : 'bizYr',
				align:'center',
				width:'80px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessYear']
			}
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'200px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessPurpose']
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'150px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessDivision']
			}
			, {
				key : 'invtCd',
				align:'center',
				width:'80px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessCode']
			}
			, {
				key : 'invtNm',
				align:'left',
				width:'200px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessName']
			}
			, {
				key : 'invtDivNm',
				align:'left',
				width:'150px',
				title : investMentCostTotalBizDivBpDetailMsgArray['investDivision']
			}
			, {
				key : 'deptNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reversionDeparment']
			}
			, {
				key : 'acntgSubjNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['accountingSubject']
			}
			, {
				key : 'invtSrvc',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['service']
			}
			, {
				key : 'invtFunc',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['function']
			}
			, {
				key : 'capexDivNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['capitalExpendituresDivision']
			}
			, {
				key : 'cstrRegBizNmRegBizChrgUserNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['thePersonInCharge']
			}
			, {
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['areaName']
			}
			, {
				key : 'cstrRegBizNmRegDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessnameRegistrationDate']
			}
			, {
				key : 'cstrRegCstrKndNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionKind']
			}
			, {
				key : 'cstrRegCstrCd',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCode']
			}
			, {
				key : 'cstrRegCstrNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['cstrNm']
			}
			, {
				key : 'cstrRegCstrMgmtOnrNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionManagementCorporation']
			}
			, {
				key : 'cstrRegEngdnChrgUserNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionThePersonInCharge']
			}
			, {
				key : 'cstrRegCnstnBpNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionVendor']
			}
			, {
				key : 'cstrRegEbgdnDrctDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['designDirectionDate']
			}
			, {
				key : 'ebgdnSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['submitDay']
			}
			, {
				key : 'ebgdnRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reviewDateLabel']
			}
			, {
				key : 'ebgdnAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDay']
			}
			, {
				key : 'efdgSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['submitDay']
			}
			, {
				key : 'efdgRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reviewDateLabel']
			}
			, {
				key : 'efdgAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDay']
			}
			, {
				key : 'workLastRegDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['lastRegistrationDate']
			}
			, {
				key : 'workLastAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['lastApprovalDay']
			}
			, {
				key : 'workLastFnshDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['lastFinishDate']
			}
			, {
				key : 'workBycstrWorkNum',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['workByconstructionWorkNum']
			}
			, {
				key : 'cmplBpcmplSchdSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpCompletionScheduleSubmitDate']
			}
			, {
				key : 'cmplBpCmplSchdRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpCompletionReviewDate']
			}
			, {
				key : 'cmplCmplSchdDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['completionScheduleDt']
			}
			, {
				key : 'gisLastSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['gisLastSubmDate']
			}
			, {
				key : 'tnovBpSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpSubmitDate']
			}
			, {
				key : 'tnovBpRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpReviewDate']
			}
			, {
				key : 'tnovTimer9Day',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['timer9DayBpCompletionReviewDateCompletionScheduleDate']
			}
			, {
				key : 'tnovOpBpTakeRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['takeReviewDate']
			}
			, {
				key : 'tnovOpBpTakeRjctDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['takeRejectDate']
			}
			, {
				key : 'tnovTimer11Day',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['timer11DayOperationTakeReviewDateBpReviewDate']
			}
			, {
				key : 'tnovOpMgrAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['operationManagerApprovalDate']
			}
			, {
				key : 'tnovTimer5Day',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['timer5DayOperationManagerApprovalDaytakeReviewDate']
			}
			, {
				key : 'setlGisWoYn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['gisSkipYesOrNo']
			}
			, {
				key : 'setlSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpSubmitDate']
			}
			, {
				key : 'setlBpRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpReviewDate']
			}
			, {
				key : 'setlAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDay']
			}
			, {
				key : 'setlCsltNo',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsConsultationNumber']
			}
			, {
				key : 'setlCsltNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsConsultationName']
			}
			, {
				key : 'setlCsltRevsOrgId',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reversionDeparment']
			}
			, {
				key : 'setlCsltInvtDivNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['investDivision']
			}
			, {
				key : 'setlCsltAcntgSubjNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['accountingSubject']
			}
			, {
				key : 'setlCsltTrmsDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['transmissionDate']
			}
			, {
				key : 'setlCsltInvtCntlNoLstVal',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['investControlNumber']
			}
			, {
				key : 'setlCsltCstrSpvnNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionSupervision']
			}
			, {
				key : 'engdnAmtCdlnInvtCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['conductLineInvestCost']
			}
			, {
				key : 'engdnAmtCblInvtCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['cableInvestCost']
			}
			, {
				key : 'engdnAmtInvtCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['tot']
			}
			, {
				key : 'efdglCblArilDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['aerialParenthesis']
			}
			, {
				key : 'efdgCblGrdDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['groundParenthesis']
			}
			, {
				key : 'efdgCdlnDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['distanceParenthesis']
			}
			, {
				key : 'efdgCdlnAfhdQuty',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['artificialityHandiworkQuantity']
			}
			, {
				key : 'efdgAmtMatlCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['materialsCost']
			}
			, {
				key : 'efdgAmtCstrCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCost']
			}
			, {
				key : 'efdgAmtSumrAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['tot']
			}
			, {
				key : 'efdgEngdnGapAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignBaseDesign']
			}
			, {
				key : 'setlCblArilDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['aerialParenthesis']
			}
			, {
				key : 'setlCblGrdDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['groundParenthesis']
			}
			, {
				key : 'setlCblGisSubmDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['GisSubmitDistance']
			}
			, {
				key : 'cdlnSetlDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['distanceParenthesis']
			}
			, {
				key : 'setlCdlnAfhdQuty',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['artificialityHandiworkQuantity']
			}
			, {
				key : 'cdlnGisSubmSetlDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['GisSubmitDistance']
			}
			, {
				key : 'setlAmtMatlCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['materialsCost']
			}
			, {
				key : 'setlAmtCstrCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCost']
			}
			, {
				key : 'setlAmtSumrAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['tot']
			}
			, {
				key : 'setlEfdgGapAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['settlementSubmitEnforcementDesign']
			}
			, {
				key : 'cstrActYr',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionActionYear']
			}
			, {
				key : 'crovYn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['carryOverYesOrNo']
			}
			, {
				key : 'cstrCnclYn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCancelYesOrNo']
			}
			, {
				key : 'tnovRjctRjctDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['rejectDate']
			}
			, {
				key : 'tnovRjctRjctRsn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['rejectReason']
			}
			, {
				key : 'cdtlAprvAprvDiv',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDivision']
			}
			, {
				key : 'cdtlAprvAprvRsn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reason']
			}
			, {
				key : 'rcfTrtmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['rectifyTreatmentDate']
			}
    	];
  		
        //그리드 생성
        $('#'+gridLineDetailId).alopexGrid({
        	//extend : ['resultPopGrid'],
        	height : 440,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : lineMapping,
            headerGroup : [
                 			{ fromIndex :  0 , toIndex :  14, title : investMentCostTotalBizDivBpDetailMsgArray['businessNameRegistration'] , id : ""}
                 			,{ fromIndex :  15, toIndex :  20, title : investMentCostTotalBizDivBpDetailMsgArray['constructionRegistration'] , id : ""}
                 			,{ fromIndex :  21, toIndex :  23, title : investMentCostTotalBizDivBpDetailMsgArray['baseDesign'] , id : ""}
                 			,{ fromIndex :  24, toIndex :  26, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesign'] , id : ""}
                 			,{ fromIndex :  27, toIndex :  30, title : investMentCostTotalBizDivBpDetailMsgArray['work'] , id : ""}
                 			,{ fromIndex :  31, toIndex :  33, title : investMentCostTotalBizDivBpDetailMsgArray['completion'] , id : ""}
                 			,{ fromIndex :  34, toIndex :  34, title : investMentCostTotalBizDivBpDetailMsgArray['geographicInformationSystemCurrent'] , id : ""}
                 			,{ fromIndex :  35, toIndex :  42, title : investMentCostTotalBizDivBpDetailMsgArray['smartTakingOver'] , id : ""}
                 			,{ fromIndex :  43, toIndex :  46, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccounts'] , id : ""}
                 			,{ fromIndex :  47, toIndex :  54, title : investMentCostTotalBizDivBpDetailMsgArray['consultation'] , id : ""}
                 			,{ fromIndex :  55, toIndex :  57, title : investMentCostTotalBizDivBpDetailMsgArray['baseDesignAmountlabelParenthesis'] , id : ""}
                 			,{ fromIndex :  58, toIndex :  59, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignNewCable'] , id : ""}
                 			,{ fromIndex :  60, toIndex :  61, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignNewConductLine'] , id : ""}
                 			,{ fromIndex :  62, toIndex :  64, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignAmountParenthesis'] , id : ""}
                 			,{ fromIndex :  65, toIndex :  65, title : investMentCostTotalBizDivBpDetailMsgArray['gapLabel'] , id : ""}
                 			,{ fromIndex :  66, toIndex :  68, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsNewCable'] , id : ""}
                 			,{ fromIndex :  69, toIndex :  71, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsNewLine'] , id : ""}
                 			,{ fromIndex :  72, toIndex :  74, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsAmountLabel'] , id : ""}
                 			,{ fromIndex :  75, toIndex :  75, title : investMentCostTotalBizDivBpDetailMsgArray['gapLabel'] , id : ""}
                 			,{ fromIndex :  79, toIndex :  80, title : investMentCostTotalBizDivBpDetailMsgArray['takingOverReject'] , id : ""}
                 			,{ fromIndex :  81, toIndex :  82, title : investMentCostTotalBizDivBpDetailMsgArray['conditionalApproval'] , id   : ""}
                 			],
            message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
        var lanMapping = [
  			//공통
  			{
  				key : 'bizYr',
  				align:'center',
  				width:'80px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['businessYear']
  			}
  			, {
  				key : 'bizPurpNm',
  				align:'left',
  				width:'200px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['businessPurpose']
  			}
  			, {
  				key : 'bizDivNm',
  				align:'left',
  				width:'150px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['businessDivision']
  			}
  			, {
  				key : 'invtCd',
  				align:'center',
  				width:'80px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['businessCode']
  			}
  			, {
  				key : 'invtNm',
  				align:'left',
  				width:'200px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['businessName']
  			}
  			, {
  				key : 'invtDivNm',
  				align:'left',
  				width:'150px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['investDivision']
  			}
  			, {
  				key : 'deptNm',
  				align:'left',
  				width:'100px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['reversionDeparment']
  			}
  			, {
  				key : 'acntgSubjNm',
  				align:'left',
  				width:'100px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['accountingSubject']
  			}
  			, {
  				key : 'invtSrvc',
  				align:'left',
  				width:'100px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['service']
  			}
  			, {
  				key : 'invtFunc',
  				align:'left',
  				width:'100px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['function']
  			}
  			, {
  				key : 'capexDivNm',
  				align:'left',
  				width:'100px',
  				title : investMentCostTotalBizDivBpDetailMsgArray['capitalExpendituresDivision']
  			}
  			, {
				key : 'cstrRegBizNmRegBizChrgUserNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['thePersonInCharge']
			}
  			, {
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['areaName']
			}
			, {
				key : 'cstrRegBizNmRegDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['businessnameRegistrationDate']
			}
			, {
				key : 'cstrRegCstrKndNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionKind']
			}
			, {
				key : 'cstrRegCstrCd',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCode']
			}
			, {
				key : 'cstrRegCstrNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['cstrNm']
			}
			, {
				key : 'cstrRegCstrMgmtOnrNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionManagementCorporation']
			}
			, {
				key : 'cstrRegEngdnChrgUserNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionThePersonInCharge']
			}
			, {
				key : 'cstrRegCnstnBpNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionVendor']
			}
			, {
				key : 'cstrRegEbgdnDrctDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['designDirectionDate']
			}
			, {
				key : 'ebgdnSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['submitDay']
			}
			, {
				key : 'ebgdnRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reviewDateLabel']
			}
			, {
				key : 'ebgdnAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDay']
			}
			, {
				key : 'efdgSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['submitDay']
			}
			, {
				key : 'efdgRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reviewDateLabel']
			}
			, {
				key : 'efdgAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDay']
			}
			, {
				key : 'workLastRegDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['lastRegistrationDate']
			}
			, {
				key : 'workLastAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['lastApprovalDay']
			}
			, {
				key : 'workLastFnshDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['lastFinishDate']
			}
			, {
				key : 'workBycstrWorkNum',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['workByconstructionWorkNum']
			}
			, {
				key : 'cmplBpcmplSchdSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpCompletionScheduleSubmitDate']
			}
			, {
				key : 'cmplBpCmplSchdRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpCompletionReviewDate']
			}
			, {
				key : 'cmplCmplSchdDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['completionScheduleDt']
			}
			, {
				key : 'gisLastSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['gisLastSubmDate']
			}
			, {
				key : 'tnovBpSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpSubmitDate']
			}
			, {
				key : 'tnovBpRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpReviewDate']
			}
			, {
				key : 'tnovTimer9Day',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['timer9DayBpCompletionReviewDateCompletionScheduleDate']
			}
			, {
				key : 'tnovOpBpTakeRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['takeReviewDate']
			}
			, {
				key : 'tnovOpBpTakeRjctDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['takeRejectDate']
			}
			, {
				key : 'tnovTimer11Day',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['timer11DayOperationTakeReviewDateBpReviewDate']
			}
			, {
				key : 'tnovOpMgrAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['operationManagerApprovalDate']
			}
			, {
				key : 'tnovTimer5Day',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['timer5DayOperationManagerApprovalDaytakeReviewDate']
			}
			, {
				key : 'setlGisWoYn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['gisSkipYesOrNo']
			}
			, {
				key : 'setlSubmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpSubmitDate']
			}
			, {
				key : 'setlBpRvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['bpReviewDate']
			}
			, {
				key : 'setlAprvDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDay']
			}
			, {
				key : 'setlCsltNo',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsConsultationNumber']
			}
			, {
				key : 'setlCsltNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsConsultationName']
			}
			, {
				key : 'setlCsltRevsOrgId',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reversionDeparment']
			}
			, {
				key : 'setlCsltInvtDivNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['investDivision']
			}
			, {
				key : 'setlCsltAcntgSubjNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['accountingSubject']
			}
			, {
				key : 'setlCsltTrmsDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['transmissionDate']
			}
			, {
				key : 'setlCsltInvtCntlNoLstVal',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['investControlNumber']
			}
			, {
				key : 'setlCsltCstrSpvnNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionSupervision']
			}
			, {
				key : 'engdnAmtCdlnInvtCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['conductLineInvestCost']
			}
			, {
				key : 'engdnAmtCblInvtCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['cableInvestCost']
			}
			, {
				key : 'engdnAmtInvtCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['tot']
			}
			, {
				key : 'efdglCblArilDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['aerialParenthesis']
			}
			, {
				key : 'efdgCblGrdDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['groundParenthesis']
			}
			, {
				key : 'efdgCdlnDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['distanceParenthesis']
			}
			, {
				key : 'efdgCdlnAfhdQuty',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['artificialityHandiworkQuantity']
			}
			, {
				key : 'efdgAmtMatlCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['materialsCost']
			}
			, {
				key : 'efdgAmtCstrCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCost']
			}
			, {
				key : 'efdgAmtSumrAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['tot']
			}
			, {
				key : 'efdgEngdnGapAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignBaseDesign']
			}
			, {
				key : 'setlCblArilDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['aerialParenthesis']
			}
			, {
				key : 'setlCblGrdDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['groundParenthesis']
			}
			, {
				key : 'setlCblGisSubmDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['GisSubmitDistance']
			}
			, {
				key : 'cdlnSetlDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['distanceParenthesis']
			}
			, {
				key : 'setlCdlnAfhdQuty',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['artificialityHandiworkQuantity']
			}
			, {
				key : 'cdlnGisSubmSetlDistm',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['GisSubmitDistance']
			}
			, {
				key : 'setlAmtMatlCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['materialsCost']
			}
			, {
				key : 'setlAmtCstrCost',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCost']
			}
			, {
				key : 'setlAmtSumrAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['tot']
			}
			, {
				key : 'setlEfdgGapAmt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['settlementSubmitEnforcementDesign']
			}
			, {
				key : 'cstrActYr',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionActionYear']
			}
			, {
				key : 'crovYn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['carryOverYesOrNo']
			}
			, {
				key : 'cstrCnclYn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['constructionCancelYesOrNo']
			}
			, {
				key : 'tnovRjctRjctDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['rejectDate']
			}
			, {
				key : 'tnovRjctRjctRsn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['rejectReason']
			}
			, {
				key : 'cdtlAprvAprvDiv',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['approvalDivision']
			}
			, {
				key : 'cdtlAprvAprvRsn',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['reason']
			}
			, {
				key : 'rcfTrtmDt',
				align:'left',
				width:'100px',
				title : investMentCostTotalBizDivBpDetailMsgArray['rectifyTreatmentDate']
			}
      	];
    		
          //그리드 생성
          $('#'+gridLanDetailId).alopexGrid({
          	//extend : ['resultPopGrid'],
          	height : 440,
              cellSelectable : true,
              autoColumnIndex : true,
              fitTableWidth : true,
              rowClickSelect : true,
              rowSingleSelect : true,
              rowInlineEdit : true,
              numberingColumnFromZero : false,
              columnMapping : lanMapping,
              headerGroup : [
                  			{ fromIndex :  0 , toIndex :  14, title : investMentCostTotalBizDivBpDetailMsgArray['businessNameRegistration'] , id : ""}
                 			,{ fromIndex :  15, toIndex :  20, title : investMentCostTotalBizDivBpDetailMsgArray['constructionRegistration'] , id : ""}
                 			,{ fromIndex :  21, toIndex :  23, title : investMentCostTotalBizDivBpDetailMsgArray['baseDesign'] , id : ""}
                 			,{ fromIndex :  24, toIndex :  26, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesign'] , id : ""}
                 			,{ fromIndex :  27, toIndex :  30, title : investMentCostTotalBizDivBpDetailMsgArray['work'] , id : ""}
                 			,{ fromIndex :  31, toIndex :  33, title : investMentCostTotalBizDivBpDetailMsgArray['completion'] , id : ""}
                 			,{ fromIndex :  34, toIndex :  34, title : investMentCostTotalBizDivBpDetailMsgArray['geographicInformationSystemCurrent'] , id : ""}
                 			,{ fromIndex :  35, toIndex :  42, title : investMentCostTotalBizDivBpDetailMsgArray['smartTakingOver'] , id : ""}
                 			,{ fromIndex :  43, toIndex :  46, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccounts'] , id : ""}
                 			,{ fromIndex :  47, toIndex :  54, title : investMentCostTotalBizDivBpDetailMsgArray['consultation'] , id : ""}
                 			,{ fromIndex :  55, toIndex :  57, title : investMentCostTotalBizDivBpDetailMsgArray['baseDesignAmountlabelParenthesis'] , id : ""}
                 			,{ fromIndex :  58, toIndex :  59, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignNewCable'] , id : ""}
                 			,{ fromIndex :  60, toIndex :  61, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignNewConductLine'] , id : ""}
                 			,{ fromIndex :  62, toIndex :  64, title : investMentCostTotalBizDivBpDetailMsgArray['enforcementDesignAmountParenthesis'] , id : ""}
                 			,{ fromIndex :  65, toIndex :  65, title : investMentCostTotalBizDivBpDetailMsgArray['gapLabel'] , id : ""}
                 			,{ fromIndex :  66, toIndex :  68, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsNewCable'] , id : ""}
                 			,{ fromIndex :  69, toIndex :  71, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsNewLine'] , id : ""}
                 			,{ fromIndex :  72, toIndex :  74, title : investMentCostTotalBizDivBpDetailMsgArray['settlementOfAccountsAmountLabel'] , id : ""}
                 			,{ fromIndex :  75, toIndex :  75, title : investMentCostTotalBizDivBpDetailMsgArray['gapLabel'] , id : ""}
                 			,{ fromIndex :  79, toIndex :  80, title : investMentCostTotalBizDivBpDetailMsgArray['takingOverReject'] , id : ""}
                 			,{ fromIndex :  81, toIndex :  82, title : investMentCostTotalBizDivBpDetailMsgArray['conditionalApproval'] , id   : ""}
                  			],
              message: {
  				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
  				filterNodata : 'No data'
  			}
          });
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function setEventListener(param) {
    	$('#basicPopTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				$('#'+gridLineDetailId).alopexGrid("viewUpdate");
    				break;
    			case 1 :
    				$('#'+gridLanDetailId).alopexGrid("viewUpdate");
    				break;
    			default :
    				break;
    		}
    	});
    	
    	investmentCostTotalBizDivBpDetailRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcosttotalbizdivbpdetaillist', param, 'GET', 'selectInvestmentCostTotalBizDivBpDetailList');
    	
    	$('#excelDownLine').on('click', function(e) {
        	var dataParam =  param;
        	
        	dataParam =  gridExcelColumn(dataParam, gridLineDetailId);
        	
        	if(dataParam.tabs == "bizDiv") {
        		dataParam.fileName = "투자예산집계_사업구분별_상세조회_선로";
        	}
        	else {
        		dataParam.fileName = "투자예산집계_BP사별_상세조회_선로";
        	}
        	
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.tabs = "line";
        	dataParam.mthd = "InvestmentCostTotalBizDivBpLine";
        		
        	console.log(dataParam);
        	
        	investmentCostTotalBizDivBpDetailRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreatebyinvtcostdetail', dataParam, 'POST', 'excelDownload');
        });
    	
    	$('#excelDownLan').on('click', function(e) {
        	var dataParam =  param;
        	dataParam = gridExcelColumn(dataParam, gridLanDetailId);
        	
        	if(dataParam.tabs == "bizDiv") {
        		dataParam.fileName = "투자예산집계_사업구분별_상세조회_광랜";
        	}
        	else {
        		dataParam.fileName = "투자예산집계_BP사별_상세조회_광랜";
        	}
        	
        	
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.tabs = "lan";
        	dataParam.mthd = "InvestmentCostTotalBizDivBpLan";
        		
        	//console.log(dataParam);
        	bodyProgress();
        	investmentCostTotalBizDivBpDetailRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreatebyinvtcostdetail', dataParam, 'POST', 'excelDownload');
        });
    	
     	// 취소
        $('#btnCancel').on('click', function(e) {
        	$a.close();
        });
	};

	//request
	function investmentCostTotalBizDivBpDetailRequest(surl,sdata,smethod,sflag)
    {
		//bodyProgress();
		if(sflag == 'selectInvestmentCostTotalBizDivBpDetailList'){
			showProgress(gridLineDetailId);
		}
		
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostTotalBizDivBpDetailCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostTotalBizDivBpDetailCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successInvestmentCostTotalBizDivBpDetailCallback(response, flag){
    	bodyProgressRemove();
    	if(flag == 'selectInvestmentCostTotalBizDivBpDetailList'){
    		hideProgress(gridLineDetailId);
    		$('#'+gridLineDetailId).alopexGrid("dataSet", response.Linelist);
    		$('#'+gridLanDetailId).alopexGrid("dataSet", response.Lanlist);
    	}
    	else if(flag = 'excelDownload') {
    		//console.log('excelCreate');
    		//console.log(response);
    		
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
    	}
    }
    
    //request 실패시.
    function failInvestmentCostTotalBizDivBpDetailCallback(serviceId, response, flag){
    	hideProgress(gridLineDetailId);
    	//console.log(response);
    	bodyProgressRemove();
    	alertBox('W',investMentCostTotalBizDivBpDetailMsgArray['abnormallyProcessed']);
    }
});