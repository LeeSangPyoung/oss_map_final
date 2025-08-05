/**
 * ErpPriceList
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */

var emptyCombo = [];  // 빈콤보
// 사업구분(대)의 장비/선로 구분 정보
var demdBizInvestTypeInfo = [];

var erpNeGrpList = []; // 장비유형/선로유형/형상유형 동적콤보용 리스트
var sclCombo = [];		// 소구분
var eqpCombo = [];      // 장비Type
var lnCombo = [];      // 선로Type
var shpTypCombo = [];   // 형상Type
var eqpMdlCombo = [];	// 장비모델콤보

// 공통콤보
var cstrDiv = [];  // 공사유형
var eqpMtl = [];  // 장비모델
var erpUsg = [];  // 용도
var cstrMc = [];  // 방식
var fstInvtTypCd = [];  // 투자유형1
var scndInvtTypCd = [];  // 투자유형2
var thrdInvtTypCd = [];  // 투자유형3
var etpplYn = [{cd : "", cdNm : "선택", value : "", text : "선택"}, {cd : "Y", cdNm : "Y", value : "Y", text : "Y"}, {cd : "N", cdNm : "N", value : "N", text : "N"}];
var maxTrmsDemdEqpSrno = 0;
var maxTrmsDemdMtsoSrno = 0;
var maxTrmsDemdLnSrno = 0;
var procStFlag = 'E';    // E : 편집가능,  D : 편집 불가

// 첨부파일 삭제용
var maxFileCnt = 0;
var tempFileSrno = 0; // 전송전 파일 신규 목록
var delFileList = [];

var trmsDemdMgmtNo = null;
var init_div_biz_cl = null;   // 사업구분(대)
var init_div_biz_detl_cl = null;  // 사업구분(세부)

var defaultIntgFcltsCd = null;  // 통시코드 기본
var defaultIntgFcltsNm = null;  // 통시명 기본
var defaultIntgFcltsBonbu = null;  // 통시본부 기본

var defaultOpenYm = null;  // 통시본부 기본

var fileJobType = null;

var demdProgStatCd = null;

var noChangeMtl = true;
var EditMode = "";
var ProcStatCd = "";
var defaulttrmsDemdLnSrno = [];
var lnDefaultIdx1 = {
	idx : 0,
	lnTypCd : "",
	intgFcltsBonbu : "",
	intgFcltsCd : "",
	intgFcltsNm : "",
	cstrCost : 0
};
var lnDefaultIdx2 = {
	idx : 1,
	lnTypCd : "",
	intgFcltsBonbu : "",
	intgFcltsCd : "",
	intgFcltsNm : "",
	cstrCost : 0
};
//var bodyProgressVal = [];

$a.page(function() {
        
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	trmsDemdMgmtNo = nullToEmpty(param.trmsDemdMgmtNo);
    	EditMode = nullToEmpty(param.EditMode);
    	ProcStatCd = nullToEmpty(param.demdProgStatCd);
    	
    	init_div_biz_cl = null;
    	init_div_biz_detl_cl = null;
    	$('#trmsDemdMgmtNo').val(trmsDemdMgmtNo);
    	
    	if (nullToEmpty(param.baseAfeYr) == '' || nullToEmpty(param.baseAfeDemdDgr) == '') {
    		// 만약에 기준차수가 넘어오지 않는 경우 화면 제어를 위해 기준 차수를 구한후 작업을 진행한다.
    		getStdAfeDivPop(param);
    	} else {
    		setTransmissionDemandPoolDetail(param);
    	}
    	
    	fileJobType = null;
    	
    	// 본사용 기본 통시정보
    	defaultIntgFcltsCd = null;  // 통시코드 기본
    	defaultIntgFcltsNm = null;  // 통시명 기본
    	defaultIntgFcltsBonbu = null;  // 통시본부 기본
    	
    	//defaultOpenYm = getViewDateStr('YYYYMM', 91);
    	defaultOpenYm = getViewDateStrFinalMonth('YYYYMM');
    	if (nullToEmpty(defaultOpenYm) && defaultOpenYm.indexOf('-') > 0) {
    		defaultOpenYm = defaultOpenYm.replace(/-/gi, "");
    	}
    	
    };    
});
	/*
	 * Function Name : setTransmissionDemandPoolDetail
	 * Description   : 기본afe차수 정보 취득
	 */
	function setTransmissionDemandPoolDetail(param) {
		
		$('#popAfeYr').val(param.baseAfeYr);
    	$('#popAfeDemdDgr').val(param.baseAfeDemdDgr);
    	// 그리드 셋팅
        initDetailGrid();
        // 화면 기본셋팅
    	setInitDetailPage();
    	// 이벤트 셋팅
    	setEventListenerDetail();     
    	delFileList= [];
    	maxFileCnt = 0;
    	tempFileSrno = 0;
    	//alert(trmsDemdMgmtNo);
    	// 전송망수요관리번호가 없는경우 
    	if (trmsDemdMgmtNo == null || trmsDemdMgmtNo == "") {
    		// 초기화
        	selectYearBizCombo('demdBizDivCd', 'Y', $('#popAfeYr').val(), 'C00618', '', 'T');	// 사업구분 대
        	selectEqpLnList();
        	// 사용자 설정

      	     //$('#areaChrgUserId').val($('#viewUserId').val());    	    
      	     //$('#areaChrgUserNm').val($('#viewUserNm').val());
    	} else {
    		//bodyProgress();
    		//progressBody();
    		noChangeMtl = false;
    		//openLoading("popBody");
    		// 유선망 수요 기본정보 취득
    		//var tmpAfeYr = nullToEmpty(param.afeYr) == "" ? $('#popAfeYr').val() : nullToEmpty(param.afeYr);
        	//selectYearBizCombo('demdBizDivCd', 'Y', tmpAfeYr, 'C00618', param.demdBizDivCd, 'T');	// 사업구분 대
        	//selectYearBizCombo('demdBizDivDetlCd', 'Y', tmpAfeYr, param.demdBizDivCd, param.demdBizDivDetlCd, 'T');     		
	  		var sflag = {
	  				  jobTp : 'baseInfo'
	  		};
	  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detailbaseinfo/' + trmsDemdMgmtNo , null, 'GET', sflag);		
    	}
    	// 사업구분 대 의 장비/선로 투자구분정보
    	getDemdBizInvestTypeInfo('init', '');
	}


	/*
	 * Function Name : getDemdBizInvestTypeInfo
	 * Description   : 사업구분 세부 의 장비/선로 투자구분정보
	 */
	function getDemdBizInvestTypeInfo(initType, supCd){
		var requestParam = {
				 afeYr : $('#popAfeYr').val()
				,supCd : supCd
				,demdDivCd : 'T'
			   
		};
		var sflag = {
				  jobTp : 'demdBizInvestTypeInfo' 
			     ,callType : initType
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/demdbizinvttypeinfo/'
				, requestParam
				, 'GET'
				, sflag);	
	}
	/*
	 * Function Name : getStdAfeDiv
	 * Description   : 기본afe차수 정보 취득
	 */
	function getStdAfeDivPop(param) {
		
		var requestParam = { 
		};
		
		var sflag = {
				  jobTp : 'getStdAfeDiv'
				 ,param : param
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/getstdafediv'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}

	/*
	 * Function Name : selectEqpLnList
	 * Description   : 장비Type LIST
	 */
	function selectEqpLnList(){
    	var requestParam = {
				comGrpCd : 'C00628'
			};
    	demandDetailRequest(
					'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
					requestParam, 'GET', "erpEqpTypCd");
    }
	
	/*
	 * Function Name : demandDetailRequest
	 * Description   : Tango.ajax
	 * ----------------------------------------------------------------------------------------------------
	 * surl          : api uri
	 * sdata         : 파라메타
	 * smethod 		 : 메소드
	 * sflag         : 통신후 flag
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function demandDetailRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandDetailCallback(response, sflag);})
    	  .fail(function(response){failDemandDetailCallback(response, sflag);})
    	  //.error();
    }
    
	 /*
	 * Function Name : setBaseInfo
	 * Description   : 기본정보 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * response : 장비정보
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setBaseInfo(response) {
    	
    	//진행상태
    	demdProgStatCd = response.baseInfo[0].demdProgStatCd;
    	
    	if (response.baseInfo.length > 0) {
	    	$('#detailForm').setData(response.baseInfo[0]);		    	
	    	if (response.baseInfo[0].dgrApmtYn == 'Y') {
	    		procStFlag = "D";
	    		//$('#detailForm').setEnabled(false);		
				 // afe차수정보가 있는경우
				  $('#popAfeYr').val(response.baseInfo[0].afeYr);
				  $('#popAfeDemdDgr').val(response.baseInfo[0].afeDemdDgr);
	    	}else if(demdProgStatCd == '105001'){
	    		$('#popAfeYr').val(response.baseInfo[0].afeYr);
				$('#popAfeDemdDgr').val(response.baseInfo[0].afeDemdDgr);
	    	}
			// 사업구분대설정   
	    	init_div_biz_cl = response.baseInfo[0].demdBizDivCd;
	    	// 사업구분세부 설정 
	    	init_div_biz_detl_cl = response.baseInfo[0].demdBizDivDetlCd;
    		
	    	selectComboCode('erpHdofcCd', 'Y', 'C00623', response.baseInfo[0].erpHdofcCd); //본부
	    	selectYearBizCombo('demdBizDivCd', 'Y', $('#popAfeYr').val(), 'C00618', response.baseInfo[0].demdBizDivCd, 'T');	// 사업구분 대
			selectYearBizCombo('demdBizDivDetlCd', 'Y', $('#popAfeYr').val(), response.baseInfo[0].demdBizDivCd, response.baseInfo[0].demdBizDivDetlCd, 'T');  // 사업구분 세부
			selectEqpLnList();
			// 사업구분(세부) 의 장비/선로 투자구분정보
	    	//getDemdBizInvestTypeInfo('init', response.baseInfo[0].demdBizDivCd);
			
	    	//$('#demdBizDivDetlCd').setSelected(response.baseInfo[0].demdBizDivDetlCd);
			selectErpNeGrpList($('#popAfeYr').val(),  $('#popAfeDemdDgr').val(), response.baseInfo[0].erpHdofcCd, response.baseInfo[0].demdBizDivCd) ;    // 장비type셋
			selectBdgtAmt($('#popAfeYr').val(), $('#popAfeDemdDgr').val(), response.baseInfo[0].erpHdofcCd, response.baseInfo[0].demdBizDivDetlCd);   // 예산
			
			// 인허가여부
			 if (nullToEmpty(response.baseInfo[0].lcenYn) == "") {
				 $('#lcenYn').setSelected("");
			 }
			//도상설계여부
			 if (nullToEmpty(response.baseInfo[0].roabDsnChgYn) == "") {
				 $('#roabDsnChgYn').setSelected("");
			 }
			// 장비정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'eqpInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detaileqpinfo/' + response.baseInfo[0].trmsDemdMgmtNo 
		  				           , null
		  				           , 'GET'
		  				           , sflag);	
			}
						
			// 건물정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'bldInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detailbldinfo/' + response.baseInfo[0].trmsDemdMgmtNo , null, 'GET', sflag);	
			}
			
			// 선로정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'lnInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detaillninfo/' + response.baseInfo[0].trmsDemdMgmtNo , null, 'GET', sflag);	
			}
			
			// 파일정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'fileInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detailfileinfo/' + response.baseInfo[0].trmsDemdMgmtNo , null, 'GET', sflag);	
			}
			
			// 토지건축정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'landInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detaillandinfo/' + response.baseInfo[0].trmsDemdMgmtNo 
		  				           , null
		  				           , 'GET'
		  				           , sflag);	
			}
			// 사업구분(세부)에 따른 투자구분에 의한 장비/선로 탭 설정
	    	editDemandBizEqpLnArea(init_div_biz_detl_cl);
			//closeLoading();
    	} else {
    		procStFlag = "D";
    		alertBox('W', demandMsgArray['searchFail']);
    	}

    	// 편집 불가모드 설정
		setDetailInfoEditMode("");
    }

    
    /*
	 * Function Name : setDetailInfoEditMode
	 * Description   : 화면 편집 모드 설정
	 * ----------------------------------------------------------------------------------------------------
	 * editFlag : 편집모드
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setDetailInfoEditMode(editMode) {
    	var enabledYn= true;
    	if (procStFlag == "D") {
    		//console.log(procStFlag);
    		enabledYn= false;
    		// 기본영역
    		$("#cblnwPrityRnk").setEnabled(enabledYn);
    		$("#erpHdofcCd").setEnabled(enabledYn);
    		$("#demdBizDivCd").setEnabled(enabledYn);
    		$("#demdBizDivDetlCd").setEnabled(enabledYn);
    		$("#bizUsgCd").setEnabled(enabledYn);
    		$("#bizNm").setEnabled(enabledYn);
    		$("#detlUsgRmk").setEnabled(enabledYn);
    		$("#screMthdCtt").setEnabled(enabledYn);
    		$("#lcenYn").setEnabled(enabledYn);
    		$("#roabDsnChgYn").setEnabled(enabledYn);
    		
    		// 버튼영역
    		$("#btn_add_eqp").setEnabled(enabledYn);
    		$("#btn_remove_eqp").setEnabled(enabledYn);
    		$("#btn_add_file").setEnabled(enabledYn);
    		$("#btn_remove_file").setEnabled(enabledYn);
    		$("#btn_add_bld").setEnabled(enabledYn);
    		$("#btn_remove_bld").setEnabled(enabledYn);
    		$("#btn_add_ln").setEnabled(enabledYn);
    		$("#btn_remove_ln").setEnabled(enabledYn);
    		$("#uploadBtn1").setEnabled(enabledYn);
    		$("#btn_save").setEnabled(enabledYn);
    	}
    	
		if(EditMode == "ERP"){
			procStFlag = "E";
			//기본영역
			$("#bizUsgCd").setEnabled(true);
			$("#bizNm").setEnabled(true);
			$("#screMthdCtt").setEnabled(true);
			$("#lcenYn").setEnabled(true);
    		$("#roabDsnChgYn").setEnabled(true);
			
			// 버튼영역
    		$("#btn_add_ln").setEnabled(true);
    		$("#btn_remove_ln").setEnabled(true);
    		$("#btn_save").setEnabled(true);
		}
    }

    /*
	 * Function Name : editDemandBizEqpLnArea
	 * Description   : 사업구분(대)에 따른 장비 선로 영역 편집 설정
	 * ----------------------------------------------------------------------------------------------------
	 * demdBizDivCd : 사업구분 대
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function editDemandBizEqpLnArea(demdBizDivCd){
    	var investType = null;
    	var bizPurpDivCd = null;
    	
    	if (nullToEmpty(demdBizDivCd) == '') {
    		// 장비 탭 활성
    		$('#basicTabs').setEnabled(true, 0);
    		// 선로/관로 탭 활성
    		$('#basicTabs').setEnabled(true, 1);  
    		//토지건축 탭 활성
    		$('#basicTabs').setEnabled(true, 2);
    		return;
    	}
    	// 
    	if (demdBizInvestTypeInfo == null || demdBizInvestTypeInfo.length == 0) {
    		//console.log("demdBizInvestTypeInfo is null");
    		return;
    	}
    	$.each(demdBizInvestTypeInfo, function(cIdx, demdBizInvestTypeList){				
				if(demdBizDivCd === demdBizInvestTypeList.cd){
					investType = demdBizInvestTypeList.cdNm;
					bizPurpDivCd = demdBizInvestTypeList.divCd;
				}
		});
    	var tabIndexVal = $('#basicTabs').getCurrentTabIndex();
    	
    	// 토지건축정보 체크
    	var landList = AlopexGrid.currentData( $('#'+gridLand).alopexGrid("dataGet") );
    	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    		
    	if(nullToEmpty(bizPurpDivCd) == '001'){
    		// 장비 탭 비활성
    		$('#basicTabs').setEnabled(false, 0);
    		// 선로/관로 탭 활성
    		$('#basicTabs').setEnabled(true, 1);
    		// 토지건축 탭 활성
    		$('#basicTabs').setEnabled(true, 2);
    		
    		$('#basicTabs').setTabIndex(1);
    	}else{
    		// 장비이면
        	if (nullToEmpty(investType) == '102001') {
        		/*$("#btn_add_eqp").setEnabled(true);
        		$("#btn_remove_eqp").setEnabled(true);
        		$("#btn_add_ln").setEnabled(false);
        		$("#btn_remove_ln").setEnabled(false);*/
        		
        		// 장비 탭 활성
        		$('#basicTabs').setEnabled(true, 0);
        		// 선로/관로 탭 비활성
        		$('#basicTabs').setEnabled(false, 1);
        		// 토지건축 탭 비활성
        		$('#basicTabs').setEnabled(false, 2);
        		
        		$('#basicTabs').setTabIndex(0);
        	} else if (nullToEmpty(investType) == '102002') {
        		/*$("#btn_add_eqp").setEnabled(false);
        		$("#btn_remove_eqp").setEnabled(false);
        		$("#btn_add_ln").setEnabled(true);
        		$("#btn_remove_ln").setEnabled(true);*/      		

        		// 장비 탭 비활성
        		$('#basicTabs').setEnabled(false, 0);
        		// 선로/관로 탭 활성
        		$('#basicTabs').setEnabled(true, 1);
        		// 토지건축 탭 비활성
        		$('#basicTabs').setEnabled(false, 2);
        		
        		$('#basicTabs').setTabIndex(1);
        	} else {
        		/*$("#btn_add_eqp").setEnabled(true);
        		$("#btn_remove_eqp").setEnabled(true);
        		$("#btn_add_ln").setEnabled(true);
        		$("#btn_remove_ln").setEnabled(true); */ 

        		// 장비 탭 활성
        		$('#basicTabs').setEnabled(true, 0);
        		// 선로/관로 탭 활성
        		$('#basicTabs').setEnabled(true, 1);
        		// 토지건축 탭 비활성
        		$('#basicTabs').setEnabled(false, 2);
        		
        		if(landList.length == 0)
    	    		$('#basicTabs').setTabIndex(0);
        		
        	}
    	}
    	
    	return;
    }
    

    /*
	 * Function Name : showProgress/hideProgress
	 * Description   : 프로그레스 보이기/숨기기
	 */
    var showProgress = function(gridIdValue){
    	$('#'+gridIdValue).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridIdValue){
		$('#'+gridIdValue).alopexGrid('hideProgress');
	};
	
    /*
	 * Function Name : setEqpInfo
	 * Description   : 장비정보 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * response : 장비정보
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setEqpInfo(response) {
    	if (response.eqpInfoList.length > 0) {
			//console.log("setEqpInfo",response);
			maxTrmsDemdEqpSrno = parseInt(response.eqpInfoList[0].maxTrmsDemdEqpSrno);
        	$('#'+gridEqp).alopexGrid("dataSet", response.eqpInfoList);
        	
        /*	showProgress(gridMtl);
        	// 장비정보 취득
			var sflag = {
	  				  jobTp : 'mtlInfo'
	  		};
	  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detailmtlinfo/' + response.eqpInfoList[0].trmsDemdMgmtNo 
	  						   , null
	  						   , 'GET'
	  						   , sflag);	*/
		}
    }
    
    /*
	 * Function Name : setMtlInfo
	 * Description   : 자재정보 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * response : 자재정보
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
 /*   function setMtlInfo(response) {
    	hideProgress(gridMtl);
    	if (response.mtlInfoList.length > 0) {
    		
        	$('#'+gridMtl).alopexGrid("dataSet", response.mtlInfoList);

        	setFilterMtlGrid(response.mtlInfoList[0].trmsDemdEqpSrno);
    	}
    }*/
        
	/*
	 * Function Name : delMtlList
	 * Description   : 자재그리드에 특정 장비일련번호에 해당하는 자재정보삭제 
	 * ----------------------------------------------------------------------------------------------------
	 * trmsDemdEqpSrno : 장비일련번호
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
  /*  function delMtlList(trmsDemdEqpSrno) {      	
    	var dataList = $('#'+gridMtl).alopexGrid("dataGet");
    	if (dataList.length <= 0) {    		
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];
    		if (data.trmsDemdEqpSrno == trmsDemdEqpSrno) {
        		var rowIndex = data._index.data;
        		$('#'+gridMtl).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    		}
    	} 
    }
    */
    /*
	 * Function Name : setFilterMtlGrid
	 * Description   : 자재그리드에 장비일련번호에해당하는 자재정보만 표시 
	 * ----------------------------------------------------------------------------------------------------
	 * trmsDemdEqpSrno : 장비일련번호
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
   /* function setFilterMtlGrid(trmsDemdEqpSrno) {      	
        $('#'+gridMtl).alopexGrid( "setFilter", 'mtlFilter', function (data) {
        	if (  data['trmsDemdEqpSrno'] == trmsDemdEqpSrno ) {
        		return true;
        	} else {
        		return false;
        	}
        });
        
    }*/
    
	/*
	 * Function Name : selectErpNeComboList
	 * Description   : 소구분, 선로type 콤보에 설정할 목록을 array로 리턴
	 * ----------------------------------------------------------------------------------------------------
	 * cbTp         : SCL : 소구분, LN : 선로 TYPE
	 * allYn         : option '전체' 생성 여부
	 * selectedValue : 선택될 초기값 (Y:전체, SL:선택, NS:필수, N:빈값없음)
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function selectErpNeComboList(cbTp, allYn) {
		
		var requestParam = { 
				  divCd : cbTp
		};
		
		var sflag = {
				  jobTp : 'combo'
				, cbTp : cbTp
				, allYn : allYn
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/selecterpnecombolist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}
	
	/*
	 * Function Name : selectErpNeGrpList
	 * Description   : 장비/형상 Type 콤보에 설정할 목록을 array로 리턴
	 * ----------------------------------------------------------------------------------------------------
	 * afeYr         : AFE년도
	 * afeDemdDgr    : AFE차수
	 * erpHdofcCd    : 본부
	 * demdBizDivCd  : 사업구분
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function selectErpNeGrpList(afeYr, afeDemdDgr, erpHdofcCd, demdBizDivCd) {
		
		var requestParam = { 
				  afeYr : afeYr
				, afeDemdDgr : afeDemdDgr
				, erpHdofcCd : erpHdofcCd
				, demdBizDivCd : demdBizDivCd
				, jobType : "SHP_TYP_ALL"
		};
		
		var sflag = {
				  jobTp : 'erpNeGrpList'
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/selecterpnegrplist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}
	
	/*
	 * Function Name : changeErpNeGrpList
	 * Description   : 장비/형상 Type 콤보에 설정할 목록을 array로 리턴(사업구분 대 변경시)
	 * ----------------------------------------------------------------------------------------------------
	 * afeYr         : AFE년도
	 * afeDemdDgr    : AFE차수
	 * erpHdofcCd    : 본부
	 * demdBizDivCd  : 사업구분
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function changeErpNeGrpList(afeYr, afeDemdDgr, erpHdofcCd, demdBizDivCd) {
		
		var requestParam = { 
				  afeYr : afeYr
				, afeDemdDgr : afeDemdDgr
				, erpHdofcCd : erpHdofcCd
				, demdBizDivCd : demdBizDivCd
				, jobType : "SHP_TYP_ALL"
		};
		
		var sflag = {
				  jobTp : 'changeErpNeGrpList'
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/selecterpnegrplist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}
		
		
	/*
	 * Function Name : selectEqpMdlGrpList
	 * Description   : 그리드내 장비별 장비모델 콤보에 설정할 목록을 array로 리턴
	 * ----------------------------------------------------------------------------------------------------
	 * cbTp        	: 콤보종류
	 * comGrpCd    	: 공통그룹코드
	 * allYn    	: option '전체' 생성 여부  (Y:전체, SL:선택, NS:필수, N:빈값없음)
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function selectEqpMdlGrpList() {
		
		var requestParam = {};
		
		var sflag = {
				  jobTp : 'eqpMdlGrpList'   // 작업종류
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/matlmgmt/eqpmdlgrplist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}
	
	/*
	 * Function Name : selectComCdList
	 * Description   : 공통코드중 그리드내 콤보에 설정할 목록을 array로 리턴
	 * ----------------------------------------------------------------------------------------------------
	 * cbTp        	: 콤보종류
	 * comGrpCd    	: 공통그룹코드
	 * allYn    	: option '전체' 생성 여부  (Y:전체, SL:선택, NS:필수, N:빈값없음)
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function selectComCdList(cbTp, comGrpCd, allYn) {
		
		var requestParam = { 
				  comGrpCd : comGrpCd
		};
		
		var sflag = {
				  jobTp : 'combo'   // 작업종류
				, cbTp : cbTp       // 콤보종류
				, allYn : allYn     // 전체여부
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}
	
	/*
	 * Function Name : selectBdgtAmt
	 * Description   : 장비/선로 예산
	 * ----------------------------------------------------------------------------------------------------
	 * afeYr         : AFE년도
	 * afeDemdDgr    : AFE차수
	 * erpHdofcCd    : 본부
	 * demdBizDivCd  : 사업구분(소)
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
	function selectBdgtAmt(afeYr, afeDemdDgr, erpHdofcCd, demdBizDivDetlCd) {
		//console.log(afeYr, afeDemdDgr, erpHdofcCd, demdBizDivDetlCd);
		
		if (nullToEmpty(erpHdofcCd) == '' || nullToEmpty(demdBizDivDetlCd) == '') {
			return;
		}
		var requestParam = { 
				  afeYr : afeYr
				, afeDemdDgr : afeDemdDgr
				, erpHdofcCd : erpHdofcCd
				, demdBizDivDetlCd : demdBizDivDetlCd
		};
		
		var sflag = {
				  jobTp : 'bdgtAmt'
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectbdgtamt/'
				           , requestParam
				           , 'GET'
				           , sflag);		
	}
	    
   /*
	 * Function Name : getEqpMdlMatl
	 * Description   : 자재정보 취득
	 * ----------------------------------------------------------------------------------------------------
	 * currentData   : 장비정보
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 사용자정보
	 */
/*    function getEqpMdlMatl(currentData) {
    	// 해당 장비의 기존 자재정보 삭제
    	delMtlList(currentData[0].trmsDemdEqpSrno);
    	
    	var requestParam = { 
    			  demdEqpMdlCd : currentData[0].demdEqpMdlCd
				, trmsDemdMgmtNo : currentData[0].trmsDemdMgmtNo
				, trmsDemdEqpSrno : currentData[0].trmsDemdEqpSrno  
				, erpHdofcCd : $('#erpHdofcCd').val()   	 
				, eqpTypCd : currentData[0].eqpTypCd		
		};

    	showProgress(gridMtl);
    	var sflag = {
				  jobTp : 'eqpMdlMatl'   // 작업종류
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/matlmgmt/eqpmdlmatllist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
    }
        */
    /*
 	 * Function Name : getMatlInveTotCnt
 	 * Description   : 자재 재고정보 취득
 	 * ----------------------------------------------------------------------------------------------------
 	 * rowIndex      : rowIncex
 	 * namsMatlCd   : NAMS자재코드
 	 * vendVndrCd   : 제조사코드
 	 * ----------------------------------------------------------------------------------------------------
 	 * return        : 자재 재고정보
 	 */
     /*function getMatlInveTotCnt(rowIndex, namsMatlCd, vendVndrCd) {   
     	var requestParam = { 
     			  erpHdofcCd : $('#erpHdofcCd').val()
 				, namsMatlCd : namsMatlCd
 				, vendVndrCd : vendVndrCd    			
 		};
     	  
   	    //console.log("getMatlInveTotCnt" , requestParam);
     	var sflag = {
 				    jobTp : 'matlInveTotCnt'   // 작업종류
 			      , rowIndex : rowIndex
 		};
 		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/matlmgmt/matlinvetotcnt/'
 				           , requestParam
 				           , 'GET'
 				           , sflag);		
     }*/
     
     /*
  	 * Function Name : getDemandMatlInveUseTotCnt
  	 * Description   : 계획수요재고자재사용수량 취득
  	 * ----------------------------------------------------------------------------------------------------
  	 * rowIndex      : rowIncex
  	 * namsMatlCd   : NAMS자재코드
  	 * vendVndrCd   : 제조사코드
  	 * ----------------------------------------------------------------------------------------------------
  	 * return        : 자재 재고정보
  	 */
    /*  function getDemandMatlInveUseTotCnt(rowIndex, namsMatlCd, vendVndrCd) {   
      	var requestParam = { 
      			  erpHdofcCd : $('#erpHdofcCd').val()
  				, namsMatlCd : namsMatlCd
  				, vendVndrCd : vendVndrCd    			
  		};
      	  
    	//console.log("getDemandMatlInveUseTotCnt" , requestParam);
      	var sflag = {
  				    jobTp : 'demandMatlInveUseTotCnt'   // 작업종류
  			      , rowIndex : rowIndex
  		};
  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/matlmgmt/demandmatlinveusetotcnt/'
  				           , requestParam
  				           , 'GET'
  				           , sflag);		
      }
    */
      // 장비/선로 그리드 클릭시 클릭시
      function gridClick(gridId, object, data) {
      	// 개통월 셀 클릭시
      	if (object.mapping.key == 'openYm') {
      		if ( data._state.focused) {
      			if (procStFlag != 'E') { 
      				return false;
      			}
      			showOpenYm(gridId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, data.openYm);
      		}
      	}

      	// 인허가 요청일자 셀 클릭시
      	if (object.mapping.key == 'lcenReqDt') {
      		if ( data._state.focused) {
      			if (procStFlag != 'E') { 
      				return false;
      			}
      			showOpenYmd(gridId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, data.lcenReqDt);
      		}
      	}
   	
      	// 통합시설코드 셀 클릭시
      	if (object.mapping.key == 'intgFcltsNm') {
      		if ( data._state.focused) {
      			if (procStFlag != 'E') { 
      				return false;
      			}
      			var rowIdx = object.data._index.row;
      			
      			if(ProcStatCd == "105003")											return false;
      			if(gridId == gridLn){
      				if(rowIdx != lnDefaultIdx1.idx && rowIdx != lnDefaultIdx2.idx)		return false;	
      			}
      			
      			if(gridId == gridEqp && (data.detlCstrDivCd == '1' || data.detlCstrDivCd == '6')){
      				openMakeSisulPopup(gridId, data.intgFcltsCd, data);
      			} else {
      				openSisulListPopup(gridId, data.intgFcltsCd, data.detlCstrDivCd, 'intgFcltsNm');	
      			}
      		}
      	}
      	
      	// (전)통합시설코드 클릭 시
      	if (object.mapping.key == 'bfIntgFcltsNm') {
      		if ( data._state.focused) {
      			if(gridId != gridEqp)			return false;
      			// 이설이 아닐 경우
      			if(data.detlCstrDivCd != '6')	return false;
      			
      			if (procStFlag != 'E') { 
      				return false;
      			}
      			var rowIdx = object.data._index.row;
      			
      			if(ProcStatCd == "105003")											return false;
      				
      			openSisulListPopup(gridId, data.bfIntgFcltsCd, data.detlCstrDivCd, 'bfIntgFcltsNm');
      		}
      	}
      	/*if (gridId == gridEqp) {
          	if ( data._state.focused) {
          		setFilterMtlGrid(data.trmsDemdEqpSrno);
      		} 
      	}*/
      	// 국사명 셀 클릭시
      	if (object.mapping.key == 'mtsoNm') {
      		if ( data._state.focused) {
      			if (procStFlag != 'E') { 
      				return false;
      			}
      			openMtsoPopup(gridId, object.mapping.key);
      		}
      	}
      	
      	// 예산 셀 클릭시
      	/*if (object.mapping.key == 'landPrchCtrtAmt' || object.mapping.key == 'landPrchMiddlPayAmt' || object.mapping.key == 'landPrchAcqtTaxAmt' || object.mapping.key == 'landPrchJugApprCmms'
      		|| object.mapping.key == 'bldCnstCstrRealCstrCst'  || object.mapping.key == 'dsnServRealCstrCst'  || object.mapping.key == 'iptnServCst' || object.mapping.key == 'acqtTaxAmt'
      		|| object.mapping.key == 'msrCst' || object.mapping.key == 'kepcoRcvgCst' || object.mapping.key == 'pubcAmt' || object.mapping.key == 'etcAmt' || object.mapping.key == 'landPrchEtcAmt') {
      		if ( data._state.focused) {
      			if (procStFlag != 'E') { 
      				return false;
      			}
      			openBudgetPopup(gridId, object.mapping.key);
      		}
      	}*/
      };  
    /*
	 * Function Name : openSisulListPopup
	 * Description   : 통합시설검색 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * grid          : 그리드 id
	 * sisulNm       : 시설명
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 통합시설정보
	 */
   function openSisulListPopup(grid, sisulNm, detlCstrDivCd, id) {
	    if ($('#erpHdofcCd').val() == '') {
	    	alertBox('W', makeArgMsg('selectObject', demandMsgArray['hdofc']));  //"본부를 선택하세요.");
	    	return;
	    }
    	var sflag = {
				  jobTp : 'sisulNm'   // 작업종류
				, grid : grid       // 콤보종류
				, allYn : ''     // 전체여부
				, id: id
		};
    	
    	// 본사등록건을 위해 본사는 수도권으로 고정
    	var srchPlntCd = $('#erpHdofcCd').val();
    	
    	if (srchPlntCd == '1000') {
    		srchPlntCd = '5100'
    	}
    	
    	var bSearchFixed = false;
    	
    	if(grid == gridLn)
    		bSearchFixed = true;
    	
    	 $a.popup({
	       	popid: 'SisulListPopup',
	       	title: demandMsgArray['integrationFacilitiesName']+' ' + demandMsgArray['search'],  /*'통합시설명 조회'*/
	       	iframe: true,
	       	modal : true,
	           url: '/tango-transmission-web/demandmgmt/common/IntgFcltsSearchPopup.do',
	           data: {srchPlntCd:srchPlntCd
	        	      , reqMode : "DM"
	        	      , bSearchFixed : bSearchFixed},
	           width : 1400,
	           height : 700, //window.innerHeight * 0.8,
	           /*
	       		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	       	*/
	           callback: function(data) {
	        	   successDemandDetailCallback(data, sflag);
	          	}
	    });
    }
   
	   /*
		 * Function Name : openSisulListPopup
		 * Description   : 통합시설검색 팝업
		 * ----------------------------------------------------------------------------------------------------
		 * grid          : 그리드 id
		 * sisulNm       : 시설명
		 * ----------------------------------------------------------------------------------------------------
		 * return        : 통합시설정보
		 */
	  function openMakeSisulPopup(grid, sisulNm, data) {
		    if ($('#erpHdofcCd').val() == '') {
		    	alertBox('W', makeArgMsg('selectObject', demandMsgArray['hdofc']));  //"본부를 선택하세요.");
		    	return;
		    }
		   	var sflag = {
						  jobTp : 'makeSisulNm'   // 작업종류
						, grid : grid       // 콤보종류
				};
		   	
		   	// 본사등록건을 위해 본사는 수도권으로 고정
		   	var plntCd = $('#erpHdofcCd').val();
		   	
		   	if (plntCd == '1000') {
		   		plntCd = '5100'
		   	}
		   	data.plntCd = plntCd;
		   	$a.popup({
		       	popid: 'SisulMakePopup',
		       	title: demandMsgArray['integrationFacilitiesName']+' ' + demandMsgArray['search'],  /*'통합시설명 조회'*/
		       	iframe: true,
		       	modal : true,
		           url: '/tango-transmission-web/demandmgmt/common/NewIntgFcltsMakePopup.do',
		           data: data,
		           width : 1050,
		           height : 320, //window.innerHeight * 0.8,
		           /*
		       		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
		            */
		           callback: function(data) {
		        	   if(data == null)			return;
		        	   successDemandDetailCallback(data, sflag);
		          	}
		    });
	   }
   
   /*
	 * Function Name : searchUser
	 * Description   : 사용자검색 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * objId         : 컴포넌 id트
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 사용자정보
	 */
   function searchUser(objId) {
	   if (objId == "areaChrgUser") {
		   openUserPopup(areaUserCallback); 
	   } else if (objId == "hdqtrChrgUser") {
		   openUserPopup(hdqtrUserCallback); 
	   }
   }
   
   /*
	 * Function Name : hdqtrUserCallback
	 * Description   : 본부담당자 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * data         : 선택한 사용자
	 */
   function hdqtrUserCallback(data) {
	   
	   if(data !== null && data != undefined && data.length > 0) { 
		 var userId = data[0].userId;
  	     var userNm = data[0].userNm;
  	     $('#hdqtrChrgUserId').val(userId);    	    
  	     $('#hdqtrChrgUserNm').val(userNm);
	    /* $("#userId").val(data[0].userId);
	     $("#userNm").val(data[0].userNm);
	     $("#userOrgId").val(data[0].orgId);
	     $("#userOrgNm").val(data[0].orgNm);
	     $("#userResult").val(data);*/
	   }
	 }
   
   /*
	 * Function Name : areaUserCallback
	 * Description   : 지역담당자 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * data         : 선택한 사용자
	 * ----------------------------------------------------------------------------------------------------
	 */
   function areaUserCallback(data) {
   	
   	   if(data !== null && data != undefined  && data.length > 0) { 
   		 var userId = data[0].userId;
   	     var userNm = data[0].userNm;
   	     $('#areaChrgUserId').val(userId);    	    
   	     $('#areaChrgUserNm').val(userNm);
   	   }
   }
      
   /*
	 * Function Name : searchMtsoLup
	 * Description   : 국사검색 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * objId         : 컴포넌 id트
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 국사정보
	 */
   function searchMtsoLup(objId) {
	 var sflag = {
				  jobTp : 'mtsoId'   // 작업종류
				, objId : objId      // 콤보종류
		};
 	 $a.popup({
	       	popid: 'MtsoLupPopup',
	       	title: demandMsgArray['mobileTelephoneSwitchingOffice'] + ' ' + demandMsgArray['search'],  /*국사 조회'*/	       	
	       	iframe: true,
	       	modal : true,
	           url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	           data: null,
	           width : 900,
	           height : 700, //window.innerHeight * 0.9,
	           /*
	       		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	       	*/
	           callback: function(data) {
	        	   //console.log(data);
	        	   successDemandDetailCallback(data, sflag);
	          	}
	    });
   }
   
   /*
	 * Function Name : calEqpInvestAmt
	 * Description   : 장비투자비 계산
	 * ----------------------------------------------------------------------------------------------------
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
/*  function calEqpInvestAmt() {
	  var eqpList = AlopexGrid.currentData($('#'+gridEqp).alopexGrid("dataGet"));
	  var eqpInvestAmt = 0;
	  var eqpCnt = 0;
	  var mtrlUprc = 0;
	  var cstrCost = 0;
	  for (var i = 0; i < eqpList.length; i++ ) {
		  if (eqpList[i].eqpCnt != '') {
			  eqpCnt = parseInt(eqpList[i].eqpCnt);
		  }
		  if (eqpList[i].mtrlUprc != '') {
			  mtrlUprc = parseInt(eqpList[i].mtrlUprc);
		  }
		  if (eqpList[i].cstrCost != '') {
			  cstrCost = parseInt(eqpList[i].cstrCost);
		  }
		  eqpInvestAmt = eqpInvestAmt + ((eqpCnt * mtrlUprc) + cstrCost);
		  eqpCnt = 0;
		  mtrlUprc = 0;
		  cstrCost = 0;
	  }
	  $('#eqpInvestAmt').text (setComma(eqpInvestAmt));
  }
  */
  	/*
	 * Function Name : calEqpMtrlUprc
	 * Description   : 장비 물자단가 계산
	 * ----------------------------------------------------------------------------------------------------
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
 /* 	function calEqpMtrlUprc(trmsDemdEqpSrno) {
		  var mtrlList = AlopexGrid.currentData($('#'+gridMtl).alopexGrid("dataGet"));
		  var eqpMtrlUprc = 0;
		  var newQuty = 0;
		  var mtrlUprc = 0;
		  
		  // 장비 그리드의 해당 trmsDemdEqpSrno의 row구하기
		  var eqpRowIndex;
		  var eqpList = AlopexGrid.currentData($('#'+gridEqp).alopexGrid("dataGet"));
		  for (var i = 0 ; i < eqpList.length; i++) {
			  if (trmsDemdEqpSrno == eqpList[i].trmsDemdEqpSrno) {
				  eqpRowIndex = eqpList[i]._index.id;
				  break;
			  }
		  }
		  
		  for (var i = 0; i < mtrlList.length; i++ ) {
			  if (trmsDemdEqpSrno == mtrlList[i].trmsDemdEqpSrno) {
				  if (mtrlList[i].newQuty != '') {
					  newQuty = parseInt(mtrlList[i].newQuty);
				  }
				  if (mtrlList[i].mtrlUprc != '') {
					  mtrlUprc = parseInt(mtrlList[i].mtrlUprc);
				  }
				  eqpMtrlUprc = eqpMtrlUprc + (newQuty * mtrlUprc);
				  newQuty = 0;
				  mtrlUprc = 0;
			  }
		  }
		  
		  // 자재 물자비의 합을 해당 장비에 설정
	   	  $('#'+gridEqp).alopexGrid('cellEdit', eqpMtrlUprc, {_index: {id: eqpRowIndex}}, 'mtrlUprc');   // 물자단가   
      	  $('#'+gridEqp).alopexGrid('refreshCell', {_index: {id: eqpRowIndex}}, 'mtrlUprc');                  	
	 }
  	 */   
    /*
 	 * Function Name : calLnInvestAmt
 	 * Description   : 선로투자비 계산
 	 * ----------------------------------------------------------------------------------------------------
 	 * ----------------------------------------------------------------------------------------------------
 	 * return        : 
 	 */
   function calLnInvestAmt() {
 	  var lnList = AlopexGrid.currentData($('#'+gridLn).alopexGrid("dataGet")); 	  
 	  var lnInvestAmt = 0;
      var cstrCost = 0;
 	  for (var i = 0; i < lnList.length; i++ ) {
 		  if (lnList[i].cstrCost != '') {
 			  cstrCost = parseInt(lnList[i].cstrCost);
 		  }
 		 lnInvestAmt = lnInvestAmt + cstrCost;
 		 cstrCost = 0;
 	  }
 	 $('#lnInvestAmt').text(setComma(lnInvestAmt));
   }
        
    /*
	 * Function Name : addEqpRow
	 * Description   : 장비 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addEqpRow() {
    	var dataList = AlopexGrid.trimData( $('#'+gridEqp).alopexGrid("dataGet") );    	 
    	
    	if(dataList.length >= 1)			return;
    	
    	if (nullToEmpty($('#erpHdofcCd').val()) == '1000') {
    		defaultIntgFcltsCd = '199710002';  // 통시코드 기본
        	defaultIntgFcltsNm = '보라매전송실';  // 통시명 기본
        	defaultIntgFcltsBonbu = '5100';  // 통시본부 기본
    	} else {
    		defaultIntgFcltsCd = '';  // 통시코드 기본
        	defaultIntgFcltsNm = '';  // 통시명 기본
        	defaultIntgFcltsBonbu = '';  // 통시본부 기본
    	}
    	
    	// 목적별 투자유형 코드 기본 정보 취득
    	var fstInvtTypDefault = "";
    	for(var i = 0; i < fstInvtTypCd.length; i++){
    		if(fstInvtTypCd[i].etcAttrVal1 == undefined)		continue;
    		var etcVal = fstInvtTypCd[i].etcAttrVal1;
    		
    		if(etcVal == "Y"){
    			fstInvtTypDefault = fstInvtTypCd[i].value;
    			break;
    		}
    	}
    	
    	var scndInvtTypDefault = "";
    	for(var i = 0; i < scndInvtTypCd.length; i++){
    		if(scndInvtTypCd[i].etcAttrVal1 == undefined)		continue;
    		var etcVal = scndInvtTypCd[i].etcAttrVal1;
    		
    		if(etcVal == "Y"){
    			scndInvtTypDefault = scndInvtTypCd[i].value;
    			break;
    		}
    	}
    	
    	var thrdInvtTypDefault = "";
    	for(var i = 0; i < thrdInvtTypCd.length; i++){
    		if(thrdInvtTypCd[i].etcAttrVal1 == undefined)		continue;
    		var etcVal = thrdInvtTypCd[i].etcAttrVal1;
    		
    		if(etcVal == "Y"){
    			thrdInvtTypDefault = thrdInvtTypCd[i].value;
    			break;
    		}
    	}
    	
    	var initRowData = [
    	    {
    	    	  "intgFcltsCd" : defaultIntgFcltsCd
    	    	, "intgFcltsNm" : defaultIntgFcltsNm
    	    	, "intgFcltsBonbu" : defaultIntgFcltsBonbu
    	    	, "sclDivCd" : ''
    	    	, "eqpTypCd" : ''
    	    	, "shpTypCd" : ''
        	    , "detlCstrDivCd" : ( cstrDiv.length <1 ) ? '' : cstrDiv[0].value     // 공사유형
            	, "eqpCnt" : '1' 
        	    , "demdEqpMdlCd" : ''
                , "mtrlUprc" : '0'
                , "cstrUprc" : '0'	
                , "cstrCost" : '0'
                , "mtrlCost" : '0'
            	, "investAmt" : '0'
                , "erpUsgCd" : ( erpUsg.length <1 ) ? '' : erpUsg[0].value    // 용도
                , "systmNo" : ''
                , "openYm" : defaultOpenYm
                , "cstrMeansCd" : ( cstrMc.length <1 ) ? '' : "T"   // 방식  
                , "fstInvtTypCd" : ( fstInvtTypDefault == "" ) ? '' : fstInvtTypDefault    // 투자유형1   
                , "scndInvtTypCd" : ( scndInvtTypDefault == "" ) ? '' : scndInvtTypDefault    // 투자유형2   
                , "thrdInvtTypCd" : ( thrdInvtTypDefault == "" ) ? '' : thrdInvtTypDefault    // 투자유형3    
                , "trmsDemdEqpSrno" : maxTrmsDemdEqpSrno+1   	
    	    }
    	];
    	//console.log(sclCombo[1].cd);
    	maxTrmsDemdEqpSrno = maxTrmsDemdEqpSrno + 1;
    	$('#'+gridEqp).alopexGrid("dataAdd", initRowData);
    	console.log("insert Eqp Row");
    	console.log(dataList);
    //	calEqpInvestAmt();
    }
        
    /*
	 * Function Name : removeEqpRow
	 * Description   : 장비 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removeEqpRow() {
    	var dataList = $('#'+gridEqp).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('W', demandMsgArray['deleteObjectCheck']);  /*"삭제할 대상을 선택하세요."*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridEqp).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    		// 삭제된 장비의 자재정보도 삭제
    	//	delMtlList(data.trmsDemdEqpSrno);
    	}   
    	
    //	calEqpInvestAmt(); 
    }
    
    /*
	 * Function Name : showOpenYm
	 * Description   : 개통월달력
	 * ----------------------------------------------------------------------------------------------------
	 * id : cellId
	 * rowIndex : rowId
	 * openYm : value
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function showOpenYm(gridId, cellId, rowIndex, openYm){
    	var _year = "";
    	var _month = "";
    	if (openYm.length > 5) {
    		_year = openYm.substr(0, 4);
    		_month = openYm.substr(4, 6);
    	}
    	var option = {
    			date : {
    				year : _year,
    				month : _month,
    				day : 01
    			}
    		, pickertype : "monthly"
    	};
    	
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		$('#' + gridId + '').alopexGrid("cellEdit", dateStr, {_index : { row : rowIndex }}, "openYm");
    		}
    		,option
    	);
    }
    
    /*
	 * Function Name : showOpenYmd
	 * Description   : 인허가요청일자달력
	 * ----------------------------------------------------------------------------------------------------
	 * id : cellId
	 * rowIndex : rowId
	 * openYm : value
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function showOpenYmd(gridId, cellId, rowIndex, openYm){
    	var _year = "";
    	var _month = "";
    	var _day = "";
    	if (openYm.length > 7) {
    		_year = openYm.substr(0, 4);
    		_month = openYm.substr(4, 6);
    		_day = openYm.substr(6, 8);
    	}
    	var option = {
			date : {
				year : _year,
				month : _month,
				day : _day
			}
    		, pickertype : "daily"
    	};
    	
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		$('#' + gridId + '').alopexGrid("cellEdit", dateStr, {_index : { row : rowIndex }}, "lcenReqDt");
    		}
    		,option
    	);
    }
        
    /*
 	 * Function Name : getChrgUserInfo
 	 * Description   : 담당자 정보 취득
 	 * ----------------------------------------------------------------------------------------------------
 	 * ----------------------------------------------------------------------------------------------------
 	 * return        : 담당자 정보 취득
 	 */
     function getChrgUserInfo() {  
    	if ($('#popAfeYr').val() == '' || $('#demdBizDivDetlCd').val() == '') {
    		return;
    	}
    	if (nullToEmpty(trmsDemdMgmtNo) != '') {
    		return;
    	}
     	var requestParam = { 
     			  afeYr : $('#popAfeYr').val()     			  
      			, erpHdofcCd : $('#erpHdofcCd').val()
 				, demdBizDivDetlCd : $('#demdBizDivDetlCd').val()		
 		};
     	  
   	    //console.log("getMatlInveTotCnt" , requestParam);
     	var sflag = {
 				    jobTp : 'getChrgUserInfo'   // 작업종류
 		};
 		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/common/bizchrguserinfo/'
 				           , requestParam
 				           , 'GET'
 				           , sflag);		
     }
    
    /*
	 * Function Name : addLnRow
	 * Description   : 선로 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * lnTypCd : 선로유Type형
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addLnRow(lnTypCd) {
    	var dataList = AlopexGrid.trimData( $('#'+gridLn).alopexGrid("dataGet") );  
    	
    	// 광케이블/광관로 구분하여 한개씩만 추가하도록 처리
    	if (nullToEmpty($('#erpHdofcCd').val()) == '1000') {
    		defaultIntgFcltsCd = '199710002';  // 통시코드 기본
        	defaultIntgFcltsNm = '보라매전송실';  // 통시명 기본
        	defaultIntgFcltsBonbu = '5100';  // 통시본부 기본
    	} else {
    		defaultIntgFcltsCd = '';  // 통시코드 기본
        	defaultIntgFcltsNm = '';  // 통시명 기본
        	defaultIntgFcltsBonbu = '';  // 통시본부 기본
    	}
    	
    	if(dataList.length > 0){
    		if(EditMode == "ERP"){
        		defaultIntgFcltsCd = dataList[0].intgFcltsCd;  // 통시코드 기본
            	defaultIntgFcltsNm = dataList[0].intgFcltsNm;  // 통시명 기본
            	defaultIntgFcltsBonbu = dataList[0].intgFcltsBonbu;  // 통시본부 기본
        	}
    		else{
    			for(var i = 0; i < dataList.length; i++){
        			var data = dataList[i];
        			
        			if(data.lnTypCd == lnTypCd){
        				defaultIntgFcltsCd = dataList[i].intgFcltsCd;  // 통시코드 기본
                    	defaultIntgFcltsNm = dataList[i].intgFcltsNm;  // 통시명 기본
                    	defaultIntgFcltsBonbu = dataList[i].intgFcltsBonbu;  // 통시본부 기본
                    	
                    	break;
        			}
        		}
    		}
    	}
    	
    	maxTrmsDemdLnSrno += 1;
    	
    	var initRowData = [
    	    {
    	    	  "intgFcltsCd" : defaultIntgFcltsCd
    	    	, "intgFcltsNm" : defaultIntgFcltsNm
    	    	, "intgFcltsBonbu" : defaultIntgFcltsBonbu
    	    	, "demdLnSctnInfCtt" : ''
    	    	, "lnTypCd" : lnTypCd  // 광케이블 혹은 광관로
    	    	, "shpTypCd" : ( lnTypCd == 'T01') ? 'NH' : 'TV'  // 광케이블 : LWPF48가공, 광관로 : 시내관로 2공
        	    , "detlCstrDivCd" : ( cstrDiv.length <1 ) ? '' : '1'     // 공사유형
            	, "sctnLen" : '0' 
        	    , "cstrUprc" : '0'
                , "cstrCost" : '0'
                , "erpUsgCd" : ( erpUsg.length <1 ) ? '' : erpUsg[0].value    // 용도
                , "openYm" : defaultOpenYm
                , "cstrMeansCd" : ( cstrMc.length <1 ) ? '' : cstrMc[0].value    // 방식  
                , "fstInvtTypCd" : ( fstInvtTypCd.length <1 ) ? '' : fstInvtTypCd[0].value    // 투자유형1   
                , "scndInvtTypCd" : ( scndInvtTypCd.length <1 ) ? '' : scndInvtTypCd[0].value    // 투자유형1    
                , "thrdInvtTypCd" : ( thrdInvtTypCd.length <1 ) ? '' : thrdInvtTypCd[0].value    // 투자유형1  
                , "existLnLen" : '0'
                , "nwLnLen" : '0'
                , "nwCdlnLen" : '0'
                , "lnInvtCost" : '0'
                , "cdlnInvtCost" : '0'
                , "cstrAmt" : '0'
                , "trmsDemdLnSrno" : maxTrmsDemdLnSrno  
    	    }
    	];
    	
    	//console.log(sclCombo[1].cd);
    	//maxTrmsDemdEqpSrno = maxTrmsDemdEqpSrno + 1;
    	$('#'+gridLn).alopexGrid("dataAdd", initRowData);
    	var lnList = AlopexGrid.trimData( $('#'+gridLn).alopexGrid("dataGet") );  
    	
    	/* 광관로 자동 생성 삭제 */
    	/*if(lnList.length == 1){
			lnDefaultIdx1.idx = 0;
        	lnDefaultIdx2.idx = 1;
        	lnDefaultIdx1.lnTypCd = "T01";
        	lnDefaultIdx2.lnTypCd = "T02";
        	if(lnList[0].lnTypCd == "T01")
        		addLnRow("T02");
        	else
        		addLnRow("T02");
		}*/
    	
    	calLnInvestAmt();
    }


    /*
	 * Function Name : checkDemdBizInvestTypeInfo
	 * Description   : 사업구분(세부)에 따른 장비/선로관로 투자 체크
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  결과값
	 */
    function checkDemdBizInvestTypeInfo(demdBizDivDetlCd){
    	//console.log("checkDemdBizInvestTypeInfo()");
    	var investType = null;
    	var bizPurpDivCd = null;
    	$.each(demdBizInvestTypeInfo, function(cIdx, demdBizInvestTypeList){		
				if(demdBizDivDetlCd === demdBizInvestTypeList.cd){
					investType = demdBizInvestTypeList.cdNm;
					bizPurpDivCd =  demdBizInvestTypeList.divCd;
				}
		});
    	
    	var checkDemdBizInvestTypeInfoMsg = "";
    	// 장비취득
    	var eqpList = AlopexGrid.currentData( $('#'+gridEqp).alopexGrid("dataGet") );
    	// 선로정보 체크
    	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    	// 토지건축정보 체크
    	var landList = AlopexGrid.currentData( $('#'+gridLand).alopexGrid("dataGet") );
    	
    	if (nullToEmpty(bizPurpDivCd) == '001') {
    		if (eqpList.length > 0) {
    			//checkDemdBizInvestTypeInfoMsg = makeArgMsg('demdBizInvestTypeInfo',demandMsgArray['lnAndconducltLine']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd',demandMsgArray['lnAndconducltLineAndLandConstruct'], demandMsgArray['equipment']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
    	    	//console.log(checkDemdBizInvestTypeInfoMsg);
    		}
    	}else{
    		// 장비인경우
        	if (nullToEmpty(investType) == '102001') {
        		if ((landList.length > 0) && (lnList.length > 0)) {
	    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd', demandMsgArray['equipment'], demandMsgArray['lnAndconducltLineAndLandConstruct']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.
	    		}else if((landList.length > 0) && (lnList.length == 0)){
	    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd', demandMsgArray['equipment'], demandMsgArray['landConstruct']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.
	    		}else if((landList.length == 0) && (lnList.length > 0)){
	    			//checkDemdBizInvestTypeInfoMsg = makeArgMsg('demdBizInvestTypeInfo', demandMsgArray['equipment']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
	    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd', demandMsgArray['equipment'], demandMsgArray['lnAndconducltLine']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.
	    	    	//console.log(checkDemdBizInvestTypeInfoMsg);
	    		}        		
        	} // 선로인 경우 
        	else if (nullToEmpty(investType) == '102002') {
        		if ((landList.length > 0)&& (eqpList.length > 0)) {
    				checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd',demandMsgArray['lnAndconducltLine'], demandMsgArray['equipmentAndLandConstruct']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.
	    		}else if((landList.length > 0) && (eqpList.length == 0)){
	    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd',demandMsgArray['lnAndconducltLine'], demandMsgArray['landConstruct']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.
	    		}else if((landList.length == 0) && (eqpList.length > 0)){
	    			//checkDemdBizInvestTypeInfoMsg = makeArgMsg('demdBizInvestTypeInfo',demandMsgArray['lnAndconducltLine']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
	    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd',demandMsgArray['lnAndconducltLine'], demandMsgArray['equipment']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
	    	    	//console.log(checkDemdBizInvestTypeInfoMsg);
	    		}        		
        	}else if (nullToEmpty(investType) == '') {
        		if(demdBizDivDetlCd != ''){
    	        	if ((landList.length > 0)) {
    	    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd',demandMsgArray['equipmentAndLnAndconducltLine'], demandMsgArray['landConstruct']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
    	    		}
        		}
        	}
    	}
    	return checkDemdBizInvestTypeInfoMsg;
    }

    /*
	 * Function Name : checkValidation
	 * Description   : 데이터 체크
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  결과값
	 */
    function checkValidation() {

    	// 기본정보 체크
    	var dataParam =  $("#detailForm").getData();
    	// 우선순위
    	if (nullToEmpty(dataParam.cblnwPrityRnk) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject', demandMsgArray['prty']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#cblnwPrityRnk').focus();
        			return false; 	/*"우선순위를 선택해 주세요."*/
        		}
    		});
    		return false; 
    	}
    	// 본부
    	if (nullToEmpty(dataParam.erpHdofcCd) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['hdofc']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#erpHdofcCd').focus();
        			return false; 	/*"본부를 선택해 주세요."*/
        		}
    		});
    		return false; 
    	}
    	// 사업구분(대)
    	if (nullToEmpty(dataParam.demdBizDivCd) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#demdBizDivCd').focus();
        			return false; 	/*사업구분(대)를 선택해 주세요.*/
        		}
    		});
    		return false; 
    	}
    	// 사업구분(세부)
    	if (nullToEmpty(dataParam.demdBizDivDetlCd) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['businessDivisionDetl']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#demdBizDivDetlCd').focus();
        			return false;  /*사업구분(세부)를 선택해 주세요.*/    	
        		}
    		});
    		return false; 
    	}
    	// 사업용도
    	if (nullToEmpty(dataParam.bizUsgCd) == '') {
    		alert("사업용도를 선택해 주세요"); return false; 	
    	}
    	// 사업명
    	if (nullToEmpty(dataParam.bizNm) == '') {
    		//alertBox('W', makeArgMsg('required',demandMsgArray['businessName']));
    		callMsgBox('', 'W', makeArgMsg('required',demandMsgArray['businessName']), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
		    		return false; 	  /* 필수 입력 항목입니다.[사업명]*/
        		}
    		});
    		return false; 
    	}
    	if (nullToEmpty(dataParam.bizNm).length > 100) {
    		callMsgBox('', 'W', makeArgMsg('maxLengthPossible',demandMsgArray['businessName'], '100'), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
        			return false; 	/*사업명 항목은 100자까지 입력가능합니다.*/
        		}
    		});
    		return false; 
    	}
    	if (nullToEmpty(dataParam.bizNm).indexOf("|") > -1) {
    		callMsgBox('', 'W', makeArgMsg('disapproveInsertValue',demandMsgArray['businessName'], '|'), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
		    		return false; 	/*사업명에는 '|'기호를 입력할 수 없습니다.")*/    
        		}
    		});
    		return false; 
    	}
    	// 본사담당자
    	if (nullToEmpty(dataParam.hdqtrChrgUserId) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['headquartersThePersonInCharge']), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
		    		return false; 	/*본사담당자를 선택해 주세요.*/
        		}
    		});
    		return false; 
    	}
    	// 지역담당자
    	/*if (nullToEmpty(dataParam.areaChrgUserId) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['areaThePersonInCharge']), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
		    		return false; 	지역담당자를 선택해 주세요."    	
        		}
    		});
    		return false; 
    	}*/
    	// 확보방법
    	if (nullToEmpty(dataParam.screMthdCtt).length > 20) {
    		callMsgBox('', 'W', makeArgMsg('maxLengthPossible',demandMsgArray['secureMethod'], '20'), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
		    		return false; 	/*"확보방법은 20자까지 입력 가능합니다."*/
        		}
    		});
    		return false; 
    	}
    	if (nullToEmpty(dataParam.screMthdCtt).indexOf("|") > -1) {
    		callMsgBox('', 'W', makeArgMsg('disapproveInsertValue',demandMsgArray['secureMethod'], '|'), function(msgId, msgRst){
        		if (msgRst == 'Y') {
		    		$('#bizNm').focus();
		    		return false; 	/*"확보방법에는 '|'기호를 입력할 수 없습니다."*/
        		}
    		});
    		return false; 
    	}
    	
    	// 사업구분(대)에 따른 장비 선로 투자구분 입력 체크
    	if (demdBizInvestTypeInfo == null || demdBizInvestTypeInfo.length == 0) {
    		//console.log(demdBizInvestTypeInfo.length);
    		getDemdBizInvestTypeInfo('check', nullToEmpty(dataParam.demdBizDivCd));
    		return false;
    	} else {
    		//console.log("demdBizInvestTypeInfo.length:",demdBizInvestTypeInfo.length);
    		// 장비선로 등록가능여부 체크
    		var checkDemdBizInvestTypeInfoMsg = checkDemdBizInvestTypeInfo(dataParam.demdBizDivDetlCd.toString());
    		if ( checkDemdBizInvestTypeInfoMsg != '' ) {
    			alertBox('W', checkDemdBizInvestTypeInfoMsg );/*'[사업구분(세부)]는 장비/선로관리 만 등록할 수 있습니다.'*/
   	 			return false;
    		}
    	}
    	
    	// 장비정보 체크
    	var eqpList = AlopexGrid.currentData( $('#'+gridEqp).alopexGrid("dataGet") );
    	var chkResult = true;
    	var chkMsg = "";
    	var eqpData;
    	
    	// 본사용 전송망 수요의 경우 통합시설코드 체크시 수도권으로 변경하여 체크
    	var chkErpHdofcCd = dataParam.erpHdofcCd;
    	if (chkErpHdofcCd == '1000') {
    		chkErpHdofcCd = '5100';
    	}
    	
        for (var i = 0 ; i < eqpList.length ; i++ ) {
    		eqpData = eqpList[i];
    		//console.log(eqpData);
    		if (nullToEmpty(eqpData.detlCstrDivCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['cstrTyp']);/*"장비정보 " + (i+1) + "번째줄의 공사유형은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	//if (nullToEmpty(eqpData.intgFcltsBonbu) != nullToEmpty(dataParam.erpHdofcCd) ) {
    		/*
        	if (nullToEmpty(eqpData.intgFcltsBonbu) != nullToEmpty(chkErpHdofcCd) ) {
        		chkMsg = makeArgMsg('requiredSameHdofc', demandMsgArray['equipment'], (i+1));  "장비정보 " + (i+1) + "번째줄의 통합시설의 본부와 수요의 본부가 다릅니다."
        		chkResult = false;	 break;	
        	}*/
        	/*if (nullToEmpty(eqpData.sclDivCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['smallClassification']);"장비정보 " + (i+1) + "번째줄의 소분류는 필수입니다."; 
        		chkResult = false; break;	
        	}*/
        	if (nullToEmpty(eqpData.eqpTypCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['equipmentType']);/*"장비정보 " + (i+1) + "번째줄의 장비Type은 필수입니다.";*/ 
        		chkResult = false; break;	
        	}
/*        	if (nullToEmpty(eqpData.eqpCnt)+"" == '' || parseInt(nullToEmpty(eqpData.eqpCnt)) <= 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['equipmentSetCount']);"장비정보 " + (i+1) + "번째줄의 장비식수는 필수입니다."; 
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.mtrlUprc)+"" == '' || parseInt(nullToEmpty(eqpData.mtrlUprc)) < 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['materialUnitPrice']);
        		"장비정보 " + (i+1) + "번째줄의 물자단가는 필수입니다."; 
        		chkResult = false; break;	
        	}

        	if (nullToEmpty(eqpData.mtrlUprc).toString().length > 12) {
        		chkMsg = makeArgMsg('maxLengthListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['materialUnitPrice'], '12');"장비정보 " + (i+1) + "번째줄의 물자단가는 12자리 이내의 숫자만 입력 가능합니다."; 
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.cstrCost)+"" == '' || parseInt(nullToEmpty(eqpData.cstrCost)) < 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['constructionCost']);"장비정보 " + (i+1) + "번째줄의 공사비는 필수입니다."; 
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.systmNo).toString().length > 5) {
        		chkMsg = makeArgMsg('maxLengthListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['systemNumber'], '5');"장비정보 " + (i+1) + "번째줄의 시스템번호는 5자리 이내의 숫자만 입력 가능합니다."; 
        		chkResult = false; break;	
        	}*/
        	if (nullToEmpty(eqpData.openYm) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['openMonth']);/*"장비정보 " + (i+1) + "번째줄의 개통월은 필수입니다.";*/ 
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.cstrUprc)+"" == '' || parseInt(nullToEmpty(eqpData.cstrUprc)) < 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['constructionUnitPrice']);/*"장비정보 " + (i+1) + "번째줄의 공사비는 필수입니다."; */
        		chkResult = false; break;	
        	}
        	
        	// 신설일 경우
        	if(nullToEmpty(eqpData.detlCstrDivCd) == '1'){
        		if (nullToEmpty(eqpData.intgFcltsNm) == '') {
            		
            		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['integrationFacilitiesName']); /*"장비정보 " + (i+1) + "번째줄의 통합시설명은 필수입니다.";*/ 
            		chkResult = false; break;	
            	}
        	}
        	// 증설일 경우
        	else if(nullToEmpty(eqpData.detlCstrDivCd) == '3'){
        		if (nullToEmpty(eqpData.intgFcltsCd) == '' || nullToEmpty(eqpData.intgFcltsNm) == '') {
            		
            		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['integrationFacilitiesName']); /*"장비정보 " + (i+1) + "번째줄의 통합시설명은 필수입니다.";*/ 
            		chkResult = false; break;	
            	}
        	}
        	// 이설일 경우
        	else if(nullToEmpty(eqpData.detlCstrDivCd) == '6'){
        		if (nullToEmpty(eqpData.bfIntgFcltsCd)+"" == '') {
            		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), "(전)"+demandMsgArray['integrationFacilitiesName']);/*"장비정보 " + (i+1) + "번째줄의 (전)통합시설명은 필수입니다."; */
            		chkResult = false; break;	
            	}
        		if (nullToEmpty(eqpData.intgFcltsNm) == '') {
            		
            		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['integrationFacilitiesName']); /*"장비정보 " + (i+1) + "번째줄의 통합시설명은 필수입니다.";*/ 
            		chkResult = false; break;	
            	}
        	}
        	// 부대장비증설일 경우
        	else if(nullToEmpty(eqpData.detlCstrDivCd) == '9'){
        		if (nullToEmpty(eqpData.intgFcltsCd) == '' || nullToEmpty(eqpData.intgFcltsNm) == '') {
            		
            		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['integrationFacilitiesName']); /*"장비정보 " + (i+1) + "번째줄의 통합시설명은 필수입니다.";*/ 
            		chkResult = false; break;	
            	}
        	}
    	}
        
        // 신설 또는 이설일 경우 UI상에 통합시설명의 중복이 있는지 확인
        for(var i = 0 ; i < eqpList.length; i++){
        	eqpData = eqpList[i];
        	
        	var bCheck = true;
        	if(nullToEmpty(eqpData.detlCstrDivCd) == '1' || nullToEmpty(eqpData.detlCstrDivCd) == '6'){
        		for(var j = 0; j < eqpList.length; j++){
        			if(i == j)		continue;
        			
        			if(eqpList[j].intgFcltsNm == eqpData.intgFcltsNm){
        				bCheck = false;
        				chkMsg = "신설 또는 이설일 경우 통합시설명을 중복으로 사용할 수 없습니다.";
        				chkResult = false; break;
        			}
        		}
        		
        		if(bCheck == false){
        			break;
        		}
        	}
		}
        
    	if (chkResult == false) {
    		alertBox('W',chkMsg);
    		return false;
    	}
    	// 자재정보 validation 주석
    	/*
    	if(demdProgStatCd != '105001') {
	    	var mtlList = AlopexGrid.currentData( $('#'+gridMtl).alopexGrid("dataGet") );
	        var mtlData;
	        var inveTotCnt = 0;
	        var demdTotCnt = 0;
	        var unUseInveCnt = 0;
	        var demdCnt = 0;
	        var inveUseQuty = 0;
	        var newQuty = 0;
	        var matlInfoMsg;
	        for (var i = 0 ; i < mtlList.length ; i++ ) {
	        	mtlData = mtlList[i];
	            	if (nullToEmpty(mtlData.demdCnt) == '') {
	           		chkMsg = (i+1) + "번째줄의 필요수량을 입력해 주세요."; break;	
	           	}
	       		matlInfoMsg = makeArgMsg('demandMaterialsCheckMsg', mtlData.demdEqpMdlNm, mtlData.eqpTypNm, mtlData.mtrlKndNm, mtlData.eqpMatlNm);   << 모델명(장비)모델의 자재명(물자종류) >>
	       		demdCnt = parseInt(nullToEmpty(mtlData.demdCnt) == '' ? 0 : mtlData.demdCnt); 
	       		// 원 재고 사용수량
	       		orgInveUseQuty = parseInt(nullToEmpty(mtlData.orgInveUseQuty) == '' ? 0 : mtlData.orgInveUseQuty); 
	       		if (nullToEmpty(mtlData.inveUseQuty)+"" == '' ) {
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['inventoryUseQuantity']);matlInfoMsg + " 필수 입력 항목입니다.[재고사용수량]"; 
	           		chkResult = false; break;	
	           	}
	           	
	       		// 재고사용수량
	           	inveUseQuty = parseInt(mtlData.inveUseQuty);
	           	if (demdCnt < inveUseQuty) {
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], demandMsgArray['needQuantity']);" 재고사용수량은 필요수량을 초과할 수 없습니다."; 
	           		chkResult = false; break;	
	           	}
	          	// 총재고수량
	           	inveTotCnt = parseInt(nullToEmpty(mtlData.inveTotCnt) == '' ? 0 : mtlData.inveTotCnt);
	           	// 수요 재고 사용수량
	           	demdTotCnt = parseInt(nullToEmpty(mtlData.demdTotCnt) == '' ? 0 : mtlData.demdTotCnt);
	           	//demdTotCnt = demdTotCnt - orgInveUseQuty;
	           	if (demdTotCnt < 0) {
	           		demdTotCnt = 0;
	           	}
	           	// 재고사용수량이 0보다 작은경우
	           	unUseInveCnt = (inveTotCnt - demdTotCnt);
	           	if (unUseInveCnt < 0) {
	           		unUseInveCnt = 0;
	           	}
	           	
	            if (unUseInveCnt < inveUseQuty) {
	            	chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['totalInventoryQuantity'] +'-'+demandMsgArray['planDemandInventoryUseQuantity'] +')');" 재고사용수량은 재고 사용가능수량(총재고수량 - 계획수요재고자재사용수량)을 초과할 수 없습니다."; 
	            	chkResult = false; break;	
	            }
	           	
	       		if (nullToEmpty(mtlData.newQuty)+"" == '' ) {    			
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['needQuantity']);"필수 입력 항목입니다.[신규수량]"; 
	           		chkResult = false; break;	
	           	}
	       		newQuty = parseInt(mtlData.newQuty);
	           	if ((demdCnt - newQuty) < inveUseQuty) {
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['needQuantity'] +'-'+demandMsgArray['newQuantity'] +')');" 재고사용수량은 (필요수량-신규수량)을 초과할 수 없습니다."; 
	           		chkResult = false; break;	
	           	}
	            	
	           	if (demdCnt < newQuty) {
	           		chkMsg = matlInfoMsg + '<br>'+ makeArgMsg('canotSpecialCount', demandMsgArray['newQuantity'], demandMsgArray['needQuantity']);" 신규수량은 필요수량을 초과할 수 없습니다."; 
	           		chkResult = false; break;	
	           	}
	
	           	if ((demdCnt - inveUseQuty) < newQuty) {
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['newQuantity'], '(' + demandMsgArray['needQuantity'] +'-'+demandMsgArray['inventoryUseQuantity'] +')');" 신규수량은 (필요수량-재고사용수량)을 초과할 수 없습니다."; 
	           		chkResult = false; break;	
	           	}
	              	
	       		if (demdCnt != (inveUseQuty + newQuty) ) {
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('requiredSameCount', demandMsgArray['needQuantity'], '(' + demandMsgArray['inventoryUseQuantity'] +'-'+demandMsgArray['newQuantity'] +')');" 필요수량은 (재고사용수량 + 신규수량)은 같아야 합니다."; 
	           		chkResult = false; break;	
	           	}
	              	
	        		
	       		if (nullToEmpty(mtlData.mtrlUprc)+"" == '' ) {
	           		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['materialUnitPrice']);"필수 입력 항목입니다.[물자단가]"; 
	           		chkResult = false; break;	
	           	}
	       	}
	        	
	       	if (chkResult == false) {
	       		alertBox('W',chkMsg);
	       		return false;
	       	}
    	}else{
    		var mtlList = AlopexGrid.currentData( $('#'+gridMtl).alopexGrid("dataGet") );
        	var mtlData;
        	var inveTotCnt = 0;
        	var demdTotCnt = 0; 
        	var unUseInveCnt = 0;    // 재고 사용가능수량
        	var demdCnt = 0;
        	var inveUseQuty = 0;
        	var newQuty = 0;
        	var matlInfoMsg;
        	for (var i = 0 ; i < mtlList.length ; i++ ) {
        		mtlData = mtlList[i];

        		matlInfoMsg = makeArgMsg('demandMaterialsCheckMsg', mtlData.demdEqpMdlNm, mtlData.eqpTypNm, mtlData.mtrlKndNm, mtlData.eqpMatlNm);   << 모델명(장비)모델의 자재명(물자종류) >>
        		demdCnt = parseInt(nullToEmpty(mtlData.demdCnt) == '' ? 0 : mtlData.demdCnt);   

        		// 원 재고 사용수량
        		orgInveUseQuty = parseInt(nullToEmpty(mtlData.orgInveUseQuty) == '' ? 0 : mtlData.orgInveUseQuty); 
        		if (nullToEmpty(mtlData.inveUseQuty)+"" == '' ) {
        			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['inventoryUseQuantity']);matlInfoMsg + " 필수 입력 항목입니다.[재고사용수량]"; 
            		chkResult = false; break;
            	}
            	
            	inveUseQuty = parseInt(mtlData.inveUseQuty);
            	if (demdCnt < inveUseQuty) {
            		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], demandMsgArray['needQuantity']);" 재고사용수량은 필요수량을 초과할 수 없습니다."; 
            		chkResult = false; break;		
            	}
            	
            	inveTotCnt = parseInt(nullToEmpty(mtlData.inveTotCnt) == '' ? 0 : mtlData.inveTotCnt);
            	// 수요 재고 사용수량
            	demdTotCnt = parseInt(nullToEmpty(mtlData.demdTotCnt) == '' ? 0 : mtlData.demdTotCnt);

            	if (demdTotCnt < 0) {
            		demdTotCnt = 0;
            	}
            	demdTotCnt = demdTotCnt - orgInveUseQuty;
            	if (demdTotCnt < 0) {
            		demdTotCnt = 0;
            	}
            	
            	// 재고사용수량이 0보다 작은경우
            	unUseInveCnt = (inveTotCnt - demdTotCnt);
            	if (unUseInveCnt < 0) {
            		unUseInveCnt = 0;
            	}
            	

            	if (unUseInveCnt < (inveUseQuty-orgInveUseQuty)) {
            		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['totalInventoryQuantity'] +'-'+demandMsgArray['planDemandInventoryUseQuantity'] +')');" 재고사용수량은 재고 사용가능수량(총재고수량 - 계획수요재고자재사용수량)을 초과할 수 없습니다."; 
            		chkResult = false; break;
            	}
            	
            	if (((inveTotCnt - demdTotCnt) < 0) && ((inveTotCnt - demdTotCnt) < (inveUseQuty - orgInveUseQuty)) && inveUseQuty != 0) {
            		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['totalInventoryQuantity'] +'-'+demandMsgArray['planDemandInventoryUseQuantity'] +')');" 재고사용수량은 재고 사용가능수량(총재고수량 - 계획수요재고자재사용수량)을 초과할 수 없습니다."; 
            		chkResult = false; break;
            	}

        		if (nullToEmpty(mtlData.newQuty)+"" == '' ) {    			
        			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['needQuantity']);"필수 입력 항목입니다.[신규수량]"; 
            		chkResult = false; break;		
            	}

        		newQuty = parseInt(mtlData.newQuty);
            	if ((demdCnt - newQuty) < inveUseQuty) {
            		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['needQuantity'] +'-'+demandMsgArray['newQuantity'] +')');" 재고사용수량은 (필요수량-신규수량)을 초과할 수 없습니다."; 
            		chkResult = false; break;
            	}
            	
            	if (demdCnt < newQuty) {
            		chkMsg = matlInfoMsg + '<br>'+ makeArgMsg('canotSpecialCount', demandMsgArray['newQuantity'], demandMsgArray['needQuantity']);" 신규수량은 필요수량을 초과할 수 없습니다."; 
            		chkResult = false; break;
            	}

            	if ((demdCnt - inveUseQuty) < newQuty) {
            		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['newQuantity'], '(' + demandMsgArray['needQuantity'] +'-'+demandMsgArray['inventoryUseQuantity'] +')');" 신규수량은 (필요수량-재고사용수량)을 초과할 수 없습니다."; 
            		chkResult = false; break;	
            	}
              	
        		if (demdCnt != (inveUseQuty + newQuty) ) {    			
        			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('requiredSameCount', demandMsgArray['needQuantity'], '(' + demandMsgArray['inventoryUseQuantity'] +'-'+demandMsgArray['newQuantity'] +')');" 필요수량은 (재고사용수량 + 신규수량)은 같아야 합니다."; 
            		chkResult = false; break;
            	}
              	
        		if (nullToEmpty(mtlData.mtrlUprc)+"" == '' ) {
        			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['materialUnitPrice']);"필수 입력 항목입니다.[물자단가]"; 
            		chkResult = false; break;
            	}
        	}
        	
        	if (chkResult == false) {
        		alertBox('W',chkMsg);
        		return false;
        	}
    	}
       	*/
    	// 건물정보 중복체크
    	var bldList = AlopexGrid.currentData( $('#'+gridBld).alopexGrid("dataGet") );
    	for (var i=0 ; i < bldList.length-1; i++) {
    		for (var j=(i+1); j < bldList.length; j++) {
    			if (bldList[i].pnuLtnoCd == bldList[j].pnuLtnoCd) {
    				chkMsg = makeArgMsg('sameBuildingInfoList', (i+1), (j+1));/*(i+1) + "번째줄의 건물정보와 " + (j+1) + "번째줄의 건물정보가 동일합니다."; */
    				chkResult = false; break;	
    			}
    		}
    		if (chkResult == false) {
        		alertBox('W',chkMsg);
        		return false;
        	}
    	}

    	if (chkResult == false) {
    		alertBox('W',chkMsg);
    		return false;
    	}
    	
    	// 선로정보 체크
    	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    	var lnData;
    	var lnTypCd;
    	/*if (lnList.length > 2) {
    		alertBox('W',demandMsgArray['demandLineInformationMaxCount']);"선로/관로는 광케이블 혹은 광관로 각각 1개씩만 등록할 수 있습니다."
    		return false;
    	}*/
    	/*for(var i = 0; i < lnList.length; i++){
    		lnData = lnList[i];
    		
    		if(i == lnDefaultIdx1.idx)		continue;
    		if(i == lnDefaultIdx2.idx)		continue;
    		
    		if(lnData.lnTypCd == lnDefaultIdx1.lnTypCd){
    			lnData.intgFcltsNm = lnDefaultIdx1.intgFcltsNm;
    			lnData.intgFcltsCd = lnDefaultIdx1.intgFcltsCd;
    			lnData.intgFcltsBonbu = lnDefaultIdx1.intgFcltsBonbu;
    		}
    		else if(lnData.lnTypCd == lnDefaultIdx2.lnTypCd){
    			lnData.intgFcltsNm = lnDefaultIdx2.intgFcltsNm;
    			lnData.intgFcltsCd = lnDefaultIdx2.intgFcltsCd;
    			lnData.intgFcltsBonbu = lnDefaultIdx2.intgFcltsBonbu;
    		}
    	}
    	$('#'+gridLn).alopexGrid("dataSet", lnList);*/
    	
        for (var i = 0 ; i < lnList.length ; i++ ) {
    		
        	lnData = lnList[i];
        	/*if (lnTypCd == lnData.lnTypCd) {
        		chkMsg = demandMsgArray['demandLineInformationMaxCount'];"선로/관로는 광케이블 혹은 광관로 각각 1개씩만 등록할 수 있습니다."; 
        		chkResult = false; break;
        	}*/
        	
        	if(i == lnDefaultIdx1.idx)		lnDefaultIdx1.cstrCost = lnData.cstrCost;
        	if(i == lnDefaultIdx2.idx)		lnDefaultIdx2.cstrCost = lnData.cstrCost;
        	
        	if (nullToEmpty(lnData.intgFcltsCd) == '' || nullToEmpty(lnData.intgFcltsNm) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['integrationFacilitiesName']);  /*"선로 " + (i+1) + "번째줄의 통합시설명은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	//if (nullToEmpty(lnData.intgFcltsBonbu) != nullToEmpty(dataParam.erpHdofcCd) ) {
        	if (nullToEmpty(lnData.intgFcltsBonbu) != nullToEmpty(chkErpHdofcCd) ) {
        		chkMsg = makeArgMsg('requiredSameHdofc', demandMsgArray['ln'], (i+1));/*"선로 " + (i+1) + "번째줄의 통합시설의 본부와 수요의 본부가 다릅니다."; */
        		chkResult = false;	 break;	
        	}
        	if (nullToEmpty(lnData.demdLnSctnInfCtt) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['section']);/*"선로 " + (i+1) + "번째줄의 구간은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(lnData.lnTypCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['lineTypeEng']);/*"선로 " + (i+1) + "번째줄의 선로Type은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(lnData.shpTypCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['shapeType']); /*"선로 " + (i+1) + "번째줄의 형상Type은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(lnData.detlCstrDivCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['cstrTyp']);/*"선로 " + (i+1) + "번째줄의 공사유형은 필수입니다.";*/ 
        		chkResult = false; break;	
        	}
        	//if (nullToEmpty(lnData.sctnLen) == '' || nullToEmpty(lnData.sctnLen) <= 0) {
        	//	chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['sectionLength']);//*"선로 " + (i+1) + "번째줄의 구간길이는 필수입니다."; */
        	//	chkResult = false; break;	
        	//}
        	/**
        	 * 2017/02/21 변경로직
        	 * 공사비 / 1,000,000 으로 나누어 구간길이를 구한다.
        	 */
        	if (nullToEmpty(lnData.cstrCost) == '' || parseInt(nullToEmpty(lnData.cstrCost)) <= 0) {
        		
        	}
        	else {
        		var sctnLen = ( lnData.cstrCost / 1000000 ).toFixed(1);
        		//console.log(lnData);
        		$('#'+gridLn).alopexGrid( "cellEdit", sctnLen,  { _index : {id : lnData._index.id }}, "sctnLen");
        		if(sctnLen <= 0) {
        			chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['constructionCost']);"선로 " + (i+1) + "번째줄의 공사비는 필수입니다."; 
            		chkResult = false; break;	
        		}
        	}
        	
        	if (nullToEmpty(lnData.erpUsgCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['usage']);/*"선로 " + (i+1) + "번째줄의 용도는 필수입니다."; */
        		chkResult = false; break;	
        	}
        	/*if (nullToEmpty(lnData.openYm) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['openMonth']);"선로 " + (i+1) + "번째줄의 개통월은 필수입니다."; 
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(lnData.cstrMeansCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['means']);"선로 " + (i+1) + "번째줄의 방식은 필수입니다."; 
        		chkResult = false; break;	
        	}*/
        	lnTypCd = lnData.lnTypCd;
    	}

        
        if(lnList.length != 0) {
        	if ((nullToEmpty(lnDefaultIdx1.cstrCost) == '' || parseInt(nullToEmpty(lnDefaultIdx1.cstrCost)) <= 0) 
        			&& (nullToEmpty(lnDefaultIdx2.cstrCost) == '' || parseInt(nullToEmpty(lnDefaultIdx2.cstrCost)) <= 0)) {
        		chkMsg = "대표 광케이블/광관로 중 하나의 항목이라도 공사비를 입력하여야 합니다."; 
        		chkResult = false;
        	}
        	else {
        		
        	}
        }
        
    	if (chkResult == false) {
    		alertBox('W',chkMsg);
    		return false;
    	}
    	
    	var landList = AlopexGrid.currentData( $('#'+gridLand).alopexGrid("dataGet") );
    	
    	// 장비나 선로 토지건축 중 한가지가 있어야 함
    	if (eqpList.length == 0 && lnList.length == 0 && landList.length == 0) {
    		alertBox('W', demandMsgArray['demandInformationMinCount']); /* 장비나 선로/관로 또는 토지건축 정보를 설정해 주세요. */
    		return false;
    	}
    	return true;
    }
    
    /*
	 * Function Name : saveTransDemandFileInfo
	 * Description   : 저장전 파일 저장 API 호출
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  결과값
	 */
    
    function saveTransDemandFileInfo(){
    	
    	if (procStFlag != 'E') {
    		return false;
    	}
    	
        // 각 그리드 편집 종료
    	/*$('#'+gridEqp).alopexGrid("endEdit", { _state : [{ editing : true }, {added : true}]} );    	
    	$('#'+gridMtl).alopexGrid("endEdit", { _state : { editing : true }} );   	
    	$('#'+gridBld).alopexGrid("endEdit", { _state : { editing : true }} );   	
    	$('#'+gridLn).alopexGrid("endEdit", { _state : { editing : true }} ); */
    	$('#'+gridEqp).alopexGrid("endEdit"); 
		// $('#'+gridMtl).alopexGrid("endEdit"); 
		$('#'+gridBld).alopexGrid("endEdit"); 
		$('#'+gridLn).alopexGrid("endEdit"); 
		$('#'+gridLand).alopexGrid("endEdit"); 
    	
    	// 데이터 체크
    	if (checkValidation() == false) {
        	$('#'+gridEqp).alopexGrid("startEdit");    	
        	// $('#'+gridMtl).alopexGrid("startEdit");    	
        	$('#'+gridLn).alopexGrid("startEdit");           	
        	$('#'+gridLand).alopexGrid("startEdit");
        	return;    
    	}
    	//console.log(dataParam);
    	/*"저장하시겠습니까?"*/
    	callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){  

    		if (msgRst == 'Y') {
	    		// 파일저장 api 호출
	    		// 데이터 추가가 있는경우
	    	    DEXT5UPLOAD.Transfer("dext5upload"); // 파일전송
	    	    // 추가가 없는경우
    		} else {
	    		if (procStFlag == 'E') {
	          		 $('#'+gridEqp).alopexGrid("startEdit");
	           		 // $('#'+gridMtl).alopexGrid("startEdit");
	           		 $('#'+gridBld).alopexGrid("startEdit");
	           		 $('#'+gridLn).alopexGrid("startEdit");           	
	             	 $('#'+gridLand).alopexGrid("startEdit");  
	       	    }
    		}
    	});
    }

    /*
	 * Function Name : saveTransDemandInfo
	 * Description   : 저장
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  결과값
	 */
    function saveTransDemandInfo() {
    	// 데이터 편집
    	var dataParam =  $("#detailForm").getData();    	
    	// 장비
    	var eqpInsertList = AlopexGrid.trimData ( $('#'+gridEqp).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var eqpUpdateList = AlopexGrid.trimData ( $('#'+gridEqp).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var eqpDeleteList = AlopexGrid.trimData ( $('#'+gridEqp).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	

    	// 자재
//    	var mtlInsertList = AlopexGrid.trimData ( $('#'+gridMtl).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
//    	var mtlUpdateList = AlopexGrid.trimData ( $('#'+gridMtl).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
//    	var mtlDeleteList = AlopexGrid.trimData ( $('#'+gridMtl).alopexGrid("dataGet", { _state : {added : false, deleted : true }} )); 	

    	// 건물
    	var bldInsertList = AlopexGrid.trimData ( $('#'+gridBld).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var bldDeleteList = AlopexGrid.trimData ( $('#'+gridBld).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
    	
    	// 선로
    	var lnInsertList = AlopexGrid.trimData ( $('#'+gridLn).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var lnUpdateList = AlopexGrid.trimData ( $('#'+gridLn).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var lnDeleteList = AlopexGrid.trimData ( $('#'+gridLn).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	

    	// 건물
    	var fileInsertList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var fileDeleteList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
    	
    	// 토지건축
    	var landInsertList = AlopexGrid.trimData ( $('#'+gridLand).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var landUpdateList = AlopexGrid.trimData ( $('#'+gridLand).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var landDeleteList = AlopexGrid.trimData ( $('#'+gridLand).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
    	
		dataParam.gridData = { 
				  eqpInsertList : eqpInsertList
				, eqpUpdateList : eqpUpdateList
				, eqpDeleteList : eqpDeleteList
//			    , mtlInsertList : mtlInsertList
//			    , mtlUpdateList : mtlUpdateList
//			    , mtlDeleteList : mtlDeleteList
			    , bldInsertList : bldInsertList
			    , bldDeleteList : bldDeleteList
			    , lnInsertList : lnInsertList
			    , lnUpdateList : lnUpdateList
			    , lnDeleteList : lnDeleteList
			    , fileInsertList : fileInsertList
			    , fileDeleteList : fileDeleteList
			    , landInsertList : landInsertList
			    , landUpdateList : landUpdateList
			    , landDeleteList : landDeleteList
		};
		
		var sflag = {
				  jobTp : 'saveDetailInfo'   // 작업종류
		};
		//console.log(dataParam);
		bodyProgress();
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/detailinfo'
				           , dataParam
				           , 'POST'
				           , sflag);
    }
    
    /*
	 * Function Name : bodyProgressValue
	 * Description   : 상세화면 초기화시 아작스체크
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 
    function bodyProgressValue() {
    	console.log("bodyProgressVal");
    	console.log(bodyProgressVal);
    	if(bodyProgressVal[0] == "baseInfo" && bodyProgressVal[1] == "eqpInfo" && bodyProgressVal[2] == "mtlInfo" && bodyProgressVal[3] == "bldInfo" 
    	   && bodyProgressVal[4] == "lnInfo" && bodyProgressVal[5] == "fileInfo" && bodyProgressVal[6] == "bdgtAmt" && bodyProgressVal[7] == "erpNeGrpList" && 
    	   bodyProgressVal[8] == "eqpMdlGrpList" && bodyProgressVal[9] == "erpHdofcCd" && bodyProgressVal[10] == "demdBizDivCd" && bodyProgressVal[11] == "demdBizDivDetlCd"){
    		bodyProgressRemove();
    	}
    }
    */
    
    /*
	 * Function Name : addLandRow
	 * Description   : 토지건축 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addLandRow() {
    	var dataList = AlopexGrid.trimData( $('#'+gridLand).alopexGrid("dataGet") ); 
    	
    	var initRowData = [
    	    {
    	    	  "hdofcNm" : $('#erpHdofcCd option:selected').text()
    	    	, "hdofcCd" : $('#erpHdofcCd').val()
    	    	, "mtsoNm" : ''
    	    	, "mtsoCd" : ''
    	    	, "landPrchTotSumr" : '0'
    	    	, "landPrchCtrtAmt" : '0'
        	    , "landPrchCtrtAmtAtchdNm" : '0'
        	    , "landPrchMiddlPayAmt" : '0'
            	, "landPrchMiddlPayAmtAtchdNm" : '0'
            	, "landPrchAcqtTaxAmt" : '0'
                , "landPrchAcqtTaxAmtAtchdNm" : '0'
                , "landPrchJugApprCmms" : '0'
            	, "landPrchJugApprCmmsAtchdNm" : '0'
            	, "landPrchEtcAmt" : '0'
                , "bldCnstCstrRealCstrCst" : '0'
                , "bldCnstCstrSfbdRate" : '0'
                , "bldCnstrCstrCstAtchdNm" : '0'
                , "dsnServRealCstrCst" : '0'
                , "dsnServSfbdRate" : '0'
                , "dsnServCstAtchdNm" : '0'
            	, "iptnServCst" : '0'
            	, "iptnServCstAtchdNm" : '0'
                , "acqtTaxAmt" : '0'
                , "acqtTaxAmtAtchdNm" : '0'
                , "msrCst" : '0'
                , "msrCstAtchdNm" : '0'
                , "kepcoRcvgCst" : '0'
                , "kepcoRcvgCstAtchdNm" : '0'
                , "pubcAmt" : '0'
                , "pubcAmtAtchdNm" : '0'
                , "etcAmt" : '0'
                , "etcAmtAtchdNm" : '0'
                , "trmsDemdMtsoSrno" : maxTrmsDemdMtsoSrno+1
    	    }
    	];
    	maxTrmsDemdMtsoSrno = maxTrmsDemdMtsoSrno + 1;
    	//console.log(sclCombo[1].cd);
    	//maxTrmsDemdEqpSrno = maxTrmsDemdEqpSrno + 1;
    	$('#'+gridLand).alopexGrid("dataAdd", initRowData);
    }
    
    /*
	 * Function Name : removeLandRow
	 * Description   : 토지건축 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removeLandRow() {
    	var dataList = $('#'+gridLand).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('W', demandMsgArray['deleteObjectCheck']);  /*"삭제할 대상을 선택하세요."*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridLand).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}
    }
    
    /*
	 * Function Name : openBudgetPopup
	 * Description   : 예산 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * grid          : 그리드 id
	 * colum        : 그리드 colum
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 해당 컬럼의 비용
	 */
   function openBudgetPopup(grid, colum) {
	    if ($('#erpHdofcCd').val() == '') {
	    	alertBox('W', makeArgMsg('selectObject', demandMsgArray['hdofc']));  //"본부를 선택하세요.");
	    	return;
	    }
    	var sflag = {
				  jobTp : 'budget'   // 작업종류
				, grid : grid       // 그리드종류
				, colum : colum     // 컬럼종류
		};
    	// 본사등록건을 위해 본사는 수도권으로 고정
    	var srchPlntCd = $('#erpHdofcCd').val();
    	
    	 $a.popup({
	       	popid: 'BudgetPopup',
	       	title: "예산 조회",  /*예산 조회'*/
	       	iframe: true,
	       	modal : true,
	           url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/BudgetPopup.do',
	           data: {srchPlntCd:srchPlntCd},
	           width : 1400,
	           height : 700, //window.innerHeight * 0.8,
	           callback: function(data) {
	        	   //console.log(data);
	        	   successDemandDetailCallback(data, sflag);
	          	}
	    });
    }
   
    /*
 	 * Function Name : openMtsoPopup
 	 * Description   : 국사검색 팝업
 	 * ----------------------------------------------------------------------------------------------------
 	 * grid          : 그리드 id
	 * colum        : 그리드 colum
 	 * ----------------------------------------------------------------------------------------------------
 	 * return        : 국사정보
 	 */
    function openMtsoPopup(grid, colum) {
    	var sflag = {
				  jobTp : 'landMtso'   // 작업종류
				, grid : grid       // 그리드종류
				, colum : colum     // 컬럼종류
		};
    	$a.popup({
    		popid: 'MtsoLupPopup',
	       	title: demandMsgArray['mobileTelephoneSwitchingOffice'] + ' ' + demandMsgArray['search'],  /*국사 조회'*/	       	
	       	iframe: true,
	       	modal : true,
	        url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	        data: null,
	        width : 900,
	        height : 700,
	        callback: function(data) {
	        	successDemandDetailCallback(data, sflag);
	        }
    	});
    }
  
    /*
	 * Function Name : setInitDetailPage
	 * Description   : 화면 초기 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setInitDetailPage() {
/*    	if (trmsDemdMgmtNo == null || trmsDemdMgmtNo == "") {
    		//selectComboCode('erpHdofcCd', 'Y', 'C00623', '');   // 본부
    		//getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val() , $('#viewOrgId').val());
    		
    		// 수요투자 관리자(ENGDM0002)는 일반콤보
    		// 수요투자 사용자(ENGDM0001)는 제약콤보
    		var adtnAttrVal = $('#adtnAttrVal').val();
    		if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0001') > 0 && nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') < 0) {
    			getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
    		} else if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') > 0) {
    			selectComboCode('erpHdofcCd', 'Y', 'C00623', '');  // 본부 
    		} else {
    			getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
    		}
    		
    	} else {
    		//selectComboCode('erpHdofcCd', 'Y', 'C00623', '');   // 본부
    	}*/
    	//selectComboCode('detlCstrDivCd', 'Y', 'detlCstrDivCd', '');*/
    	selectComboCode('bizUsgCd', 'Y', 'C00630', '기지국망');   // 사업용도
    	selectComboCode('erpHdofcCd', 'Y', 'C00623', '');  // 본부 
    	
    	$('#detlUsgRmk').val("전송망");   // 세부용도
    	    	
    	// 공통코드취득    	
    	selectComCdList('CSTR', 'C00619', 'N');  // 공사유형
    	selectComCdList('USG', 'C00630', 'N');  // erp용도
    	selectComCdList('CSTRMC', 'C00626', 'N');  // 공사방식
    	selectComCdList('IV1', 'C00631', 'N');  // 투자유형1
    	selectComCdList('IV2', 'C00632', 'N');  // 투자유형1
    	selectComCdList('IV3', 'C00633', 'N');  // 투자유형1
   	
    	// 공통콤보 셋팅
    	erpNeGrpList = [];
    	//sclCombo = [{value:'', text:"필수"}];  // 소구분 초기값
    	lnCombo = [{value:'', text:demandMsgArray['mandatory']}];  // 선로Type 초기값 
    	selectErpNeComboList('SCL', 'N');  // 소구분콤보 취득
    	selectErpNeComboList('LN', 'NS');  // 선로Type콤보 취득
    	eqpCombo = [{value:'', text:demandMsgArray['mandatory']}];  // 장비  "필수"
    	selectErpNeComboList('LN', 'NS');  // 선로Type
    	shpTypCombo  = [{value:'', text:demandMsgArray['select']}];  // 형상Type 초기값  "선택"
    	
    	// 장비모델콤보
    	selectEqpMdlGrpList();
   }
    
    /*
	 * Function Name : setEventListenerDetail
	 * Description   : 이벤트 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setEventListenerDetail() {
    	
    	//본부 콤보박스        
    	$('#erpHdofcCd').on('change',function(e) {
    		selectBdgtAmt($('#popAfeYr').val(), $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivDetlCd').val());
    		// 본부가 바뀌면 자재정보 모두를 클리어
    		var eqpList = $('#'+gridEqp).alopexGrid('dataGet');
    		if(noChangeMtl){
	    		for (var i = 0 ; i < eqpList.length; i++) {
	                // 자재정보 초기화
	        		var currData = AlopexGrid.currentData($('#'+gridEqp).alopexGrid('dataGet', { _index : {id: eqpList[i]._index.id}}));
	        	//	delMtlList(currData[0].trmsDemdEqpSrno);
	        	//	getEqpMdlMatl(currData);
	            	// 포커스가 있는경우
	        		//console.log(eqpList[i], currData[0]);
	            	/*if ( eqpList[i]._state.focused) {
	            		setFilterMtlGrid(currData[0].trmsDemdEqpSrno);
	        		}*/  
	    		}
    		}
        	noChangeMtl = true;
    		// 장비/선로/형상 type 목록취득
    		if($('#demdBizDivCd').val() != null && $('#demdBizDivCd').val() != "" && $('#erpHdofcCd').val() !="" ){
	        	if (erpNeGrpList.length == 0) {
	        		selectErpNeGrpList($('#popAfeYr').val(),  $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivCd').val()) ;
	        	} 
    		}
    		getChrgUserInfo();
    	});
    	
    	//사업 구분(대) 콤보박스        
    	$('#demdBizDivCd').on('change',function(e) {
    		//var dataParam =  $("#searchForm").getData();    		
    		if (init_div_biz_cl == $(this).val()) {
    			return;
    		}
    		if (procStFlag != "E") {
        		return;
        	}
    		init_div_biz_cl = $(this).val();
    		
    		if($('#demdBizDivCd').val() != "" ){
    			selectYearBizCombo('demdBizDivDetlCd', 'Y', $('#popAfeYr').val(), $("#demdBizDivCd").val(), '', 'T');	// 사업구분 소    			

    			// 장비/선로/형상 type 목록취득
    			if ($('#erpHdofcCd').val() !="" && $('#erpHdofcCd').val() !=null) {
	            	if (erpNeGrpList.length == 0) {
	            		selectErpNeGrpList($('#popAfeYr').val(),  $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivCd').val()) ;  
	            	} else {
	            		changeErpNeGrpList($('#popAfeYr').val(),  $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivCd').val()) ;  
	            	}
    			}
    		}else{
    			$('#demdBizDivDetlCd').empty();
    			$('#demdBizDivDetlCd').append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$('#demdBizDivDetlCd').setSelected("");
    		}
        });    
        
    	// 사업구분(세부) 
		$('#demdBizDivDetlCd').on('change',function(e) {
			if (init_div_biz_detl_cl == $(this).val()) {
    			return;
    		}	
    		
			if((nullToEmpty(trmsDemdMgmtNo) == '' && nullToEmpty(ProcStatCd) == '') || nullToEmpty(ProcStatCd) == '105006' || nullToEmpty(ProcStatCd) == '105001'){
				var investType = null;
		    	var bizPurpDivCd = null;
		    	
		    	$.each(demdBizInvestTypeInfo, function(cIdx, demdBizInvestTypeList){		
						if($('#demdBizDivDetlCd').val() == demdBizInvestTypeList.cd){
							investType = demdBizInvestTypeList.cdNm;
							bizPurpDivCd = demdBizInvestTypeList.divCd;
						}
				});
				
				if (nullToEmpty(bizPurpDivCd) == '001') {
					
		    	}else{
		    		// 장비인경우
		        	if (nullToEmpty(investType) == '102001' || nullToEmpty(investType) == undefined) {
		        		var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
		        		if (lnList.length > 0) {
		        			for (var i = lnList.length-1; i >= 0; i--) {
		                		var data = lnList[i];    		
		                		var rowIndex = data._index.data;
		                		
		                		$('#'+gridLn).alopexGrid("dataDelete", {_index : { data:rowIndex }});
		                	}
		        		}
		        	}
		    	}	
			}
    		// 사업구분(대)변경시 장비/선로정보 존재 체크
    		var checkDemdBizDivChangeMsg = checkDemdBizInvestTypeInfo($(this).val());
    		if (nullToEmpty(checkDemdBizDivChangeMsg) != '') {
    			alertBox('W', checkDemdBizDivChangeMsg );/*'선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.'*/
    			$(this).setSelected(init_div_biz_detl_cl);
    			return;
    		}
    		init_div_biz_detl_cl = $(this).val();
    		
    		// 사업구분(대)에 따라 장비 선로 영역 활 성 비 활정
    		editDemandBizEqpLnArea(init_div_biz_detl_cl);
    		if ($('#demdBizDivDetlCd').val() != '') {
        		
    			selectBdgtAmt($('#popAfeYr').val(), $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivDetlCd').val());
    			if (nullToEmpty(trmsDemdMgmtNo) == '') {
    				getChrgUserInfo();
    			}
    		} else {
    			// 예산부분 0 셋팅
    			 $('#eqpBdgtAmt').text(0);    	    
    	   	     $('#lnBdgtAmt').text(0);
    		}
        }); 
		
		$('#erpHdofcCd').on('change', function(e) {
			if (trmsDemdMgmtNo != null && trmsDemdMgmtNo !='') {
				// 비활성이 필요한건지
				$('#erpHdofcCd').setEnabled(false);
			}
		});
    	        
        $('#btn_save').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	// 유선망 정보 저장
        	saveTransDemandFileInfo();
        });
                
        // 지역 담당자 지정 클릭시
        $('#areaChrgUserNm, #areaChrgUserNmBtn').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	searchUser('areaChrgUser');
        });

        // 본사 담당자 지정 클릭시
        $('#hdqtrChrgUserNm, #hdqtrChrgUserNmBtn').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	searchUser('hdqtrChrgUser');
        });
        
        // 상위국선택 클릭시
        $('#umtsoIntgFcltsNm, #umtsoIntgFcltsNmBtn').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	searchMtsoLup('umtsoIntgFclts');
        });

        // 하위국선택 지정 클릭시
        $('#lmtsoIntgFcltsNm, #lmtsoIntgFcltsNmBtn').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	searchMtsoLup('lmtsoIntgFclts');
        });

        /*// 통합시설 지정 클릭시
        $('#intgFcltsNmBtn').on('click', function(e) {        	
        	return false;
        });*/
        
        //
        // Access망 수요 클릭시
       /* $('#btn_access').on('click', function(e) {
        	// 선택값 확인
        	var popParam = {
        			acsnwPrjId : 'L.C16X.51.8183'  // Access 프로젝트 아이디
        		 // , RM : ''  // 화면보기 요청 모드
        	};
        	
        	$a.popup({
        		popid: 'GetAccessDemandDetailPopup',
            	title: 'Access망 수요', 'Access망 수요 전송망 상세정보',
            	iframe: true,
            	modal: false,
		        windowpopup: true,
                url: '/tango-transmission-web/demandmgmt/accessdemand/AccessDemandDetailPopup.do',
                data: popParam,
                width : 1600,
                height : 900, //window.innerHeight * 0.9,
            	
                callback: function() {					
               	}
            });
    	});*/
        
        // 링사용율 클릭시
    /*    $('#btn_ring').on('click', function(e) {
        	// 선택값 확인
        	if ($('#ringUsedRate').val() == '') {
        		alertBox('W', makeArgMsg('selectObject', demandMsgArray['ringUseRateType']));
        		return;
        	}
        	
        	var popUrl = "";
        	
        	if ($('#ringUsedRate').val() == 'PTS-RING') {
        		popUrl = "/tango-transmission-web/trafficintg/trafficeng/PtsRingTraffic.do";
        	} else if ($('#ringUsedRate').val() == 'IP-RING') {
        		popUrl = "/tango-transmission-web/trafficintg/trafficeng/IpBackhaulRingTraffic.do";
        	}
        	
        	$a.popup({
            	popid: 'RingUsePop',
            	title: demandMsgArray['ringUseRate'],   링사용률
                url: popUrl,
                data: null,
                width: 1600,
                height: 900,
                iframe: true,
                modal: false,
		        windowpopup: true,
                movable: true,
                callback: function() {					
               	}
            });
        });
        */
        // 포트사용율 클릭시
      /*  $('#btn_port').on('click', function(e) {
        	// 선택값 확인
        	if ($('#portUsedRate').val() == '') {
        		alertBox('W', makeArgMsg('selectObject', demandMsgArray['portUseRateType']));
        		return;
        	}
        	
        	var popUrl = "";
        	
        	if ($('#portUsedRate').val() == 'PTS-TRAFFIC') {
        		popUrl = "/tango-transmission-web/trafficintg/trafficeng/PtsTraffic.do";
        	} else if ($('#portUsedRate').val() == 'DU-TRAFFIC') {
        		popUrl = "/tango-transmission-web/trafficintg/trafficeng/DuTraffic.do";
        	} else if ($('#portUsedRate').val() == 'L2-TRAFFIC') {
        		popUrl = "/tango-transmission-web/trafficintg/trafficeng/L2SWTraffic.do";
        	} else if ($('#portUsedRate').val() == 'IP-TRAFFIC') {
        		popUrl = "/tango-transmission-web/trafficintg/trafficeng/IpBackhaulTraffic.do";
        	}
        	
        	$a.popup({
            	popid: 'PortUsePop',
            	title: demandMsgArray['portUseRate'],   링사용률
                url: popUrl,
                data: null,
                width: 1600,
                height: 900,
                iframe: true,
                modal: false,
		        windowpopup: true,
                movable: true,
                callback: function() {					
               	}
            });
        });
        */
        /*******************************
         *  장비 그리드 이벤트
         *******************************/        
        // 장비 데이터셋후
        $('#'+gridEqp).on('dataSetEnd', function(e) {        	
        	if (procStFlag == 'E' && eqpCombo.length > 1) {
        		var eqpEditRow = AlopexGrid.trimData($('#'+gridEqp).alopexGrid("dataGet", [{_state:{editing:true}}]) );
    			if (eqpEditRow.length == 0) {
    				$('#'+gridEqp).alopexGrid("startEdit");
    			}
        	}
        //	calEqpInvestAmt(); 
			selectBdgtAmt($('#popAfeYr').val(), $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivDetlCd').val());
        });
        

    	$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				$('#'+gridEqp).alopexGrid("viewUpdate");
    			//	$('#'+gridMtl).alopexGrid("viewUpdate");
    				break;
    			case 1 :
    				$('#'+gridBld).alopexGrid("viewUpdate");
    				$('#'+gridLn).alopexGrid("viewUpdate");
    				break;
    			case 2 :
    				$('#'+gridLand).alopexGrid("viewUpdate");
    				break;
    			default :
    				break;
    		}
    	});
        
        // 장비 행추가
        $('#btn_add_eqp').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}

        	if ($('#erpHdofcCd').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['hdofc'])); /*"본부를 선택해 주세요.;*/
        		return;
        	}

        	if ($('#demdBizDivCd').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig'])); /*"사업구분(대)를 선택해 주세요.");*/
        		return;
        	}

        	if (erpNeGrpList.length == 0) {
        		selectErpNeGrpList($('#popAfeYr').val(),  $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivCd').val()) ;  
        	} 
        	addEqpRow();
        });
        
        // 장비 행삭제
        $('#btn_remove_eqp').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	removeEqpRow();
        });
        
        // 장비 데이터 추가후 편집
        $('#'+gridEqp).on('dataAddEnd', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var rowIndex = object.datalist[0]._index.data;        	
        	// $('#'+gridEqp).alopexGrid( "rowSelect", { _index : {data : rowIndex }}, true);
		 	$('#'+gridEqp).alopexGrid( "cellEdit", "TA",  { _index : {row : rowIndex }}, "sclDivCd");
        	$('#'+gridEqp).alopexGrid( "startEdit", { _index : {data : rowIndex }});
        });
        
        // 장비 그리드 더블클릭시 편집
        $('#'+gridEqp).on('dblclick', '.bodycell', function(e) {
        	if(EditMode == "ERP")		return false;
        	
        	if (procStFlag != "E") {
        		return;
        	}
        	var object = AlopexGrid.parseEvent(e);       	
        	// $('#'+gridEqp).alopexGrid( "rowSelect", { _index : {data : rowIndex }}, true);
        	$('#'+gridEqp).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        
        // 장비 그리드 클릭시 클릭시
        $('#'+gridEqp).on('click', function(e) {
        	if(EditMode == "ERP")		return false;
        	
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	
        	if (data == null) {
        		return false;
        	}
        	
        	gridClick(gridEqp, object, data);        	
        	
        });
        
        // 장비셀값 편집시
        $('#'+gridEqp).on('cellValueEditing', function(e){
        	var ev = AlopexGrid.parseEvent(e);        	
        	var result;
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var eqpCnt;
        	var mtrlUprc;
        	var cstrCost;
        	var cstrUprc;
        	//console.log(mapping.key);
        	// 장비식수, 물자단가, 공사비 수정시
        	if ( ev.mapping.key == "eqpCnt" || ev.mapping.key == "mtrlUprc"  || ev.mapping.key == "cstrCost") {        		
        		eqpCnt = parseInt(AlopexGrid.currentValue(data,  "eqpCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "eqpCnt" ));
        		mtrlUprc = parseInt(AlopexGrid.currentValue(data,  "mtrlUprc" ) == '' ? 0 : AlopexGrid.currentValue(data,  "mtrlUprc" ) );
        		cstrCost = parseInt(AlopexGrid.currentValue(data,  "cstrCost" ) == '' ? 0 : AlopexGrid.currentValue(data,  "cstrCost" ));
        		result = (eqpCnt * mtrlUprc) + cstrCost;
        		if (eqpCnt == 0) {
        			cstrUprc = cstrCost;
        		} else {
            		cstrUprc = parseInt((cstrCost / eqpCnt) + 0.5);
        		}
            	$('#'+gridEqp).alopexGrid('cellEdit', cstrUprc, {_index: {id: ev.data._index.id}}, 'cstrUprc');   // 공사단가 
            	$('#'+gridEqp).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'investAmt');   // 투자비 
            //	calEqpInvestAmt();  
        	}
        	
        	if($cell && data && data._index.id && mapping && (mapping.key === 'demdEqpMdlCd')) {
        		var currData = AlopexGrid.currentData($('#'+gridEqp).alopexGrid('dataGet', { _index : {id: ev.data._index.id}}));
        		//console.log(currData);			
				//currData = AlopexGrid.trimData(currData);
			//	getEqpMdlMatl(currData);
         	}
        	
        	if(ev.mapping.key == "detlCstrDivCd"){
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'bfIntgFcltsNm');
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'bfIntgFcltsCd');
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'intgFcltsNm'); 
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'intgFcltsCd'); 
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'intgFcltsBonbu');
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'sidoNm');
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'sggNm');
        		$('#'+gridEqp).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'emdNm');
        	}
        });    
        
        // 자재그리드에서 장비 그리드의 값을 바꿨을때 발생할 이벤트
        $('#'+gridEqp).on('cellValueChanged', function(e){
         	var ev = AlopexGrid.parseEvent(e);
         	var data = ev.data;
         	var mapping = ev.mapping;
         	var $cell = ev.$cell;
     		//console.log(mapping.key);
         	if($cell && data && data._index.id && mapping && (mapping.key === 'mtrlUprc')) {
         		//var currentValue = AlopexGrid.currentValue(data, mapping.key); //현재 입력중인 값을 추출. editedValue에 의해 걸러진 콤마 빠진 값이 넘어옴
         		var eqpCnt = parseInt(AlopexGrid.currentValue(data,  "eqpCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "eqpCnt" ));
        		var mtrlUprc = parseInt(AlopexGrid.currentValue(data,  "mtrlUprc" ) == '' ? 0 : AlopexGrid.currentValue(data,  "mtrlUprc" ) );
        		var cstrCost = parseInt(AlopexGrid.currentValue(data,  "cstrCost" ) == '' ? 0 : AlopexGrid.currentValue(data,  "cstrCost" ));
        		var result = (eqpCnt * mtrlUprc) + cstrCost;
         		$('#'+gridEqp).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'investAmt');   // 투자비 
            //	calEqpInvestAmt();  
         	}
         });
        

        /*******************************
         *  자재 그리드 이벤트
         *******************************/
        // 자재 데이터셋후
        /*$('#'+gridMtl).on('dataSetEnd', function(e) {
        	var dataList = $('#'+gridMtl).alopexGrid("dataGet");        	
        	
        	for ( var i =0; i < dataList.length; i++) {        		
        		// 재고취득
        		//getMatlInveTotCnt(i, dataList[i].namsMatlCd, dataList[i].vendVndrCd);
        		// 계획수요 재고사용 수량 취득
        		//getDemandMatlInveUseTotCnt(i, dataList[i].namsMatlCd, dataList[i].vendVndrCd);
        	}
        	
        	if (procStFlag == 'E') {
        		 $('#'+gridMtl).alopexGrid("startEdit"); 
        	}
        });
        // 자재 데이터 추가후 편집
        $('#'+gridMtl).on('dataAddEnd', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var mtrlUprc;	
        	var demdCnt = 0;
        	var newQuty = demdCnt;
        	var inveUseQuty = 0;
        	var unUseInveCnt = 0;
        	
        	//var mtlEditRow = AlopexGrid.trimData($('#'+gridMtl).alopexGrid("dataGet", {_index : {id : object.datalist[0]._index.id}}, [{_state:{editing:true}}]) );
			//if (mtlEditRow.length == 0) {
				$('#'+gridMtl).alopexGrid("startEdit");  
			//}
			
        	for (var i = 0; i < object.datalist.length ; i++) {
        		// 재고취득
        		//getMatlInveTotCnt(rowIndex, object.datalist[i].namsMatlCd, object.datalist[i].vendVndrCd);
        		// 계획수요 재고사용 수량 취득
        		//getDemandMatlInveUseTotCnt(rowIndex, object.datalist[i].namsMatlCd, object.datalist[i].vendVndrCd);
        		unUseInveCnt = ( parseInt(object.datalist[i].inveTotCnt) -  parseInt(object.datalist[i].demdTotCnt) );
        		// 사용가능 재고수량 > 0 이면
        		if ( unUseInveCnt > 0 ) {
        			inveUseQuty = (unUseInveCnt >= demdCnt) ? demdCnt : unUseInveCnt;
        			newQuty = (demdCnt - inveUseQuty);
        		} else {
        			newQuty = demdCnt;
        		}
        		//console.log("dataAddEnd", rowIndex);
        		// 필요수량 설정
			 	$('#'+gridMtl).alopexGrid( "cellEdit", demdCnt,  { _index : {id : object.datalist[i]._index.id }}, "demdCnt");
			 	// 재고수량 설정
			 	$('#'+gridMtl).alopexGrid( "cellEdit", inveUseQuty,  { _index : {id : object.datalist[i]._index.id }}, "inveUseQuty");
			 	// 신규수량 설정
			 	$('#'+gridMtl).alopexGrid( "cellEdit", newQuty,  { _index : {id : object.datalist[i]._index.id }}, "newQuty");
			 	// ORG재고사용수량 설정
			 	$('#'+gridMtl).alopexGrid( "cellEdit", "0",  { _index : {id : object.datalist[i]._index.id }}, "orgInveUseQuty");
		   		
        		mtrlUprc = parseInt(object.datalist[i].mtrlUprc);
        		result = (newQuty * mtrlUprc) ;
            	$('#'+gridMtl).alopexGrid('cellEdit', setComma(result), {_index: {id : object.datalist[i]._index.id }}, 'mtrlAmt');   // 투자비
            	inveUseQuty = 0;
            	newQuty = 0;
	        	//$('#'+gridMtl).alopexGrid( "startEdit", { _index : {data : rowIndex }});        		
        	}

        	// 해당 장비의 물자비 수정
        //	calEqpMtrlUprc(object.datalist[0].trmsDemdEqpSrno);
        });
        
        // 자재 그리드 더블클릭시 편집
        $('#'+gridMtl).on('dblclick', '.bodycell', function(e) {
        	if(EditMode == "ERP")		return false;
        	
        	if (procStFlag != "E") {
        		return;
        	}
        	var object = AlopexGrid.parseEvent(e);       	
        	$('#'+gridMtl).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        
        // 자재그리드 셀값 편집시
        $('#'+gridMtl).on('cellValueEditing', function(e){
        	if(demdProgStatCd != '105001') {
	        	var ev = AlopexGrid.parseEvent(e);        	
	        	var result;
	        	var data = ev.data;
	        	var mapping = ev.mapping;
	        	var $cell = ev.$cell;
	        	var editRow = data._index.row;
	        	var inveTotCnt;   // 총재고수량
	        	var demdTotCnt;   // 계획수요재고자재사용수량
	        	var demdCnt;      // 필요수량
	        	var inveUseQuty;  // 재고사용수량
	        	var newQuty;      // 신규수량
	        	var mtrlUprc;     // 물자단가
	        	var unUseInveCnt; // 재고사용가능수량
	        	//console.log(data);
	    		
	    		// 전송수요장비시퀀스번호
	        	var trmsDemdEqpSrno = (AlopexGrid.currentValue(data,  "trmsDemdEqpSrno" ));
	        	
	        	// 필요수량, 재고사용수량, 신규수량 변경시
	        	if (ev.mapping.key == "demdCnt" || ev.mapping.key == "inveUseQuty"  || ev.mapping.key == "newQuty") {
	        		// 총재고수량
	        		inveTotCnt = parseInt(AlopexGrid.currentValue(data,  "inveTotCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "inveTotCnt" ));
	        		// 계획수요재고자재사용수량
	        		demdTotCnt = parseInt(AlopexGrid.currentValue(data,  "demdTotCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "demdTotCnt" ));
	        		// 필요수량
	        		demdCnt = parseInt(AlopexGrid.currentValue(data,  "demdCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "demdCnt" ));
	        		// 재고사용수량
	        		inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "inveUseQuty" ));
	        		// 신규수량
	        		newQuty = parseInt(AlopexGrid.currentValue(data,  "newQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "newQuty" ));
	        		// 물자비
	        		mtrlUprc = parseInt(AlopexGrid.currentValue(data,  "mtrlUprc" ) == '' ? 0 : AlopexGrid.currentValue(data,  "mtrlUprc" ));
	        		// 원 재고사용 수량
	        		orgInveUseQuty = parseInt(AlopexGrid.currentValue(data,  "orgInveUseQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "orgInveUseQuty" ));
	        		//demdTotCnt = demdTotCnt - orgInveUseQuty;
	        		if (demdTotCnt < 0) {
	        			demdTotCnt = 0;
	        		}
	
	        		unUseInveCnt = inveTotCnt -  demdTotCnt;
	        		//console.log("b : " , unUseInveCnt);
	        		if (unUseInveCnt <  0) {
	        			unUseInveCnt = 0;
	        		}
	        		//console.log("a : " , unUseInveCnt);
	        		// 필요수량 수정시
	        		if (ev.mapping.key == "demdCnt") {
	            		// 사용가능 재고수량 > 0 이면
	            		if ( unUseInveCnt > 0 ) {
	            			inveUseQuty = (unUseInveCnt >= demdCnt) ? demdCnt : unUseInveCnt;
	            			newQuty = (demdCnt - inveUseQuty) <= 0 ? 0 : demdCnt - inveUseQuty;
	            		} else {
	            			inveUseQuty = 0;
	            			newQuty = demdCnt;
	            		}
	            		
	                	$('#'+gridMtl).alopexGrid('cellEdit', inveUseQuty, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량
	                	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty'); 
	                	$('#'+gridMtl).alopexGrid('cellEdit', newQuty, {_index: {id: ev.data._index.id}}, 'newQuty');   // 재고사용수량
	                	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
	                	$('#'+gridMtl).alopexGrid('cellEdit', setComma(newQuty*mtrlUprc), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
	                	// 해당 장비의 물자비 수정
	                //	calEqpMtrlUprc(trmsDemdEqpSrno);
	        		}
	        		
	        		// 재고사용수량 수정시 
	        		if (ev.mapping.key == "inveUseQuty") {
	        			// (총재고수량 - 계획수요 사용수량) 한 수량 이상은 입력할 수 없다 
	        			//if ((inveTotCnt - demdTotCnt) < inveUseQuty) {
	        			if (unUseInveCnt < inveUseQuty) {
	                    	$('#'+gridMtl).alopexGrid('cellEdit', 0, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량
	                    	inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
	                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty'); 
	
	                    	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
	                    	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
	                    	
	                    	alertBox('W', makeArgMsg('demandOverMaxValue', '('+demandMsgArray['totalInventoryQuantity'] +'-'+ demandMsgArray['planDemandInventoryUseQuantity']+')'));"(총 재고수량- 계획수요재고수량)을 초과했습니다."
	        			} // 필요수랴 < 재고사용수량
	        			else if (demdCnt < inveUseQuty) {
	                    	$('#'+gridMtl).alopexGrid('cellEdit', 0, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량
	                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty'); 
	                    	inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
	                    	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
	                    	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
	                    	
	                    	alertBox('W', makeArgMsg('demandOverMaxValue', demandMsgArray['needQuantity']));"필요수량을 초과했습니다.");
	        			} else {
	        				// 신규수량에 필요수량 - 재고사용수량
	        				result = demdCnt-inveUseQuty;
	        				$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
	                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
	        				
	                		result = (result * mtrlUprc) ;
	                    	$('#'+gridMtl).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
	                    	// 해당 장비의 물자비 수정
	                    //	calEqpMtrlUprc(trmsDemdEqpSrno);
	        			}        			
	        		}
	        		
	        		// 신규수량
	        		if (ev.mapping.key == "newQuty") {
	        			// 필요수량 < 신규수량
	        			if (demdCnt < newQuty) {
	                		newQuty = 0;
	                    	$('#'+gridMtl).alopexGrid('cellEdit', newQuty, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
	                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
	                		//result = (newQuty * mtrlUprc) ;
	                    	//$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
	        				
	                    	alertBox('W', makeArgMsg('demandOverMaxValue', demandMsgArray['needQuantity']));"필요수량을 초과했습니다.");
	                    	
	                    	// 해당 장비의 물자비 수정
	                    //	calEqpMtrlUprc(trmsDemdEqpSrno);
	        			} else {
	                        // 필요수량 - 신규수량
	        				result = (demdCnt - newQuty);
	        				// 재고사용수량이 (총재고수량 - 계획수요사용수량)을 초과 하는 경우 재고사용가능수량 만큼만 설정
	        				if (unUseInveCnt < result) {
	        					result = unUseInveCnt;
	        				}
	                    	$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량   
	                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty');  
	        			}
	        			
	        		}
	        	}
	        	
	        	// 신규수량, 물자단가 수정시
	        	if ( ev.mapping.key == "newQuty" || ev.mapping.key == "mtrlUprc" ) { 
	        		// 신규수량
	        		newQuty = parseInt(AlopexGrid.currentValue(data,  "newQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "newQuty" ));
	        		// 물자비
	        		mtrlUprc = parseInt(AlopexGrid.currentValue(data,  "mtrlUprc" ) == '' ? 0 : AlopexGrid.currentValue(data,  "mtrlUprc" ));
	        		result = (newQuty * mtrlUprc) ;
	            	$('#'+gridMtl).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
	            	// 해당 장비의 물자비 수정
	            //	calEqpMtrlUprc(trmsDemdEqpSrno);
	        	}
        	}else{
        		var ev = AlopexGrid.parseEvent(e);        	
            	var result;
            	var data = ev.data;
            	var mapping = ev.mapping;
            	var $cell = ev.$cell;
            	var editRow = data._index.row;
            	var inveTotCnt;   // 총재고수량
            	var demdTotCnt;   // 계획수요재고자재사용수량
            	var demdCnt;      // 필요수량
            	var inveUseQuty;  // 재고사용수량
            	var newQuty;      // 신규수량
            	var mtrlUprc;     // 물자단가
            	var unUseInveCnt; // 재고사용가능수량
            	//console.log(data);
        		
        		// 전송수요장비시퀀스번호
            	var trmsDemdEqpSrno = (AlopexGrid.currentValue(data,  "trmsDemdEqpSrno" ));
            	
            	// 필요수량, 재고사용수량, 신규수량 변경시
            	if (ev.mapping.key == "demdCnt" || ev.mapping.key == "inveUseQuty"  || ev.mapping.key == "newQuty") {
            		// 총재고수량
            		inveTotCnt = parseInt(AlopexGrid.currentValue(data,  "inveTotCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "inveTotCnt" ));
            		// 계획수요재고자재사용수량
            		demdTotCnt = parseInt(AlopexGrid.currentValue(data,  "demdTotCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "demdTotCnt" ));
            		if (demdTotCnt < 0) {
            			demdTotCnt = 0;
            		}
            		// 필요수량
            		demdCnt = parseInt(AlopexGrid.currentValue(data,  "demdCnt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "demdCnt" ));
            		// 재고사용수량
            		inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "inveUseQuty" ));
            		// 신규수량
            		newQuty = parseInt(AlopexGrid.currentValue(data,  "newQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "newQuty" ));
            		// 물자비
            		mtrlUprc = parseInt(AlopexGrid.currentValue(data,  "mtrlUprc" ) == '' ? 0 : AlopexGrid.currentValue(data,  "mtrlUprc" ));
            		// 원 재고사용 수량
            		orgInveUseQuty = parseInt(AlopexGrid.currentValue(data,  "orgInveUseQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "orgInveUseQuty" ));
            		
            		//demdTotCnt = demdTotCnt - orgInveUseQuty;
            		if (demdTotCnt < 0) {
            			demdTotCnt = 0;
            		}
            		
            		unUseInveCnt = inveTotCnt -  demdTotCnt;
            		if (unUseInveCnt < 0) {
            			unUseInveCnt = 0;
            		}
            		// 필요수량 수정시
            		if (ev.mapping.key == "demdCnt") {
                		
                		// 사용가능 재고수량 > 0 이면
                		if ( unUseInveCnt > 0 ) {
                			inveUseQuty = (unUseInveCnt >= demdCnt) ? demdCnt : unUseInveCnt;
                			newQuty = (demdCnt - inveUseQuty) <= 0 ? 0 : demdCnt - inveUseQuty;
                		} // 재고수량-계획수량 < 0
                		else if ((inveTotCnt - demdTotCnt) < 0) {
                			// 필요수량 < 원 재고사용수량 - 부족 재고수량
                		    if (demdCnt < (orgInveUseQuty + (inveTotCnt - demdTotCnt))) {
                				inveUseQuty = demdCnt;
                			} else {
                				inveUseQuty = (orgInveUseQuty + (inveTotCnt - demdTotCnt)) > 0 ? (orgInveUseQuty + (inveTotCnt - demdTotCnt)) : 0 ;
                			}	
                			newQuty = demdCnt-inveUseQuty;
                		}
                		else {
                			inveUseQuty = (demdCnt > orgInveUseQuty) ? orgInveUseQuty : demdCnt;
                			newQuty = demdCnt-inveUseQuty;
                		}
                		
                    	$('#'+gridMtl).alopexGrid('cellEdit', inveUseQuty, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량
                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty'); 
                    	$('#'+gridMtl).alopexGrid('cellEdit', newQuty, {_index: {id: ev.data._index.id}}, 'newQuty');   // 재고사용수량
                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
                    	$('#'+gridMtl).alopexGrid('cellEdit', setComma(newQuty*mtrlUprc), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
                    	// 해당 장비의 물자비 수정
                    //	calEqpMtrlUprc(trmsDemdEqpSrno);
            		}
            		
            		// 재고사용수량 수정시 
            		if (ev.mapping.key == "inveUseQuty") {
            			if (unUseInveCnt < (inveUseQuty-orgInveUseQuty)) {
            				inveUseQuty = 0;
                        	$('#'+gridMtl).alopexGrid('cellEdit', inveUseQuty, {_index: {row: editRow}}, 'inveUseQuty');   // 재고사용수량
                        	//inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
                        	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {row: editRow}}, 'inveUseQuty'); 

                        	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                        	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 

                        	alertBox('W', makeArgMsg('demandOverMaxValue', '('+demandMsgArray['totalInventoryQuantity'] +'-'+ demandMsgArray['planDemandInventoryUseQuantity']+')'));"(총 재고수량- 계획수요재고수량)을 초과했습니다."
            			} 
            			// 재고수량-계획수량 < 0
            			else if ((inveTotCnt - demdTotCnt) < 0 && (inveTotCnt - demdTotCnt) < (inveUseQuty - orgInveUseQuty) && inveUseQuty != 0) {
            				inveUseQuty = 0;
                        	$('#'+gridMtl).alopexGrid('cellEdit', inveUseQuty, {_index: {row: editRow}}, 'inveUseQuty');   // 재고사용수량
                        	//inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
                        	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {row: editRow}}, 'inveUseQuty'); 

                        	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                        	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 

                        	alertBox('W', makeArgMsg('demandOverMaxValue', '('+demandMsgArray['totalInventoryQuantity'] +'-'+ demandMsgArray['planDemandInventoryUseQuantity']+')'));"(총 재고수량- 계획수요재고수량)을 초과했습니다."
            			}// 필요수량 < 재고사용수량
            			else if (demdCnt < inveUseQuty) {
                        	$('#'+gridMtl).alopexGrid('cellEdit', 0, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량
                        	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty'); 
                        	inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
                        	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                        	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
                        	
                        	alertBox('W', makeArgMsg('demandOverMaxValue', demandMsgArray['needQuantity']));"필요수량을 초과했습니다.");
            			} else {
            				// 신규수량에 필요수량 - 재고사용수량
            				result = demdCnt-inveUseQuty;
            				$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                        	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
            				
                    		result = (result * mtrlUprc) ;
                        	$('#'+gridMtl).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
                        	// 해당 장비의 물자비 수정
                        //	calEqpMtrlUprc(trmsDemdEqpSrno);
            			}        			
            		}
            		
            		// 신규수량
            		if (ev.mapping.key == "newQuty") {
            			// 필요수량 < 신규수량
            			if (demdCnt < newQuty) {
                    		newQuty = 0;
                        	$('#'+gridMtl).alopexGrid('cellEdit', newQuty, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                        	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
                    		//result = (newQuty * mtrlUprc) ;
                        	//$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비 
            				
                        	alertBox('W', makeArgMsg('demandOverMaxValue', demandMsgArray['needQuantity']));"필요수량을 초과했습니다.");
                        	// 해당 장비의 물자비 수정
                        //	calEqpMtrlUprc(trmsDemdEqpSrno);
            			} else {
                            // 필요수량 - 신규수량
            				result = (demdCnt - newQuty);
            				// 재고사용수량이 (총재고수량 - 계획수요사용수량)을 초과 하는 경우 재고사용가능수량 만큼만 설정
            				if (unUseInveCnt < result) {
            					result = unUseInveCnt;
            				}
                        	$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량   
                        	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty');  
            			}
            			
            		}
            	}
            	
            	// 신규수량, 물자단가 수정시
            	if ( ev.mapping.key == "newQuty" || ev.mapping.key == "mtrlUprc" ) { 
            		// 신규수량
            		newQuty = parseInt(AlopexGrid.currentValue(data,  "newQuty" ) == '' ? 0 : AlopexGrid.currentValue(data,  "newQuty" ));
            		// 물자비
            		mtrlUprc = parseInt(AlopexGrid.currentValue(data,  "mtrlUprc" ) == '' ? 0 : AlopexGrid.currentValue(data,  "mtrlUprc" ));
            		result = (newQuty * mtrlUprc) ;
                	$('#'+gridMtl).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
                	// 해당 장비의 물자비 수정
                //	calEqpMtrlUprc(trmsDemdEqpSrno);
            	}
        	}
        });         
             */
        /*******************************
         *  건물 그리드 이벤트
         *******************************/
        // 건물 행추가
        $('#btn_add_bld').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	var sflag = {
  				  jobTp : 'bldAdd'   // 작업종류
	  		};
		   	 $a.popup({
		  	       	popid: 'BuildInfoListPop',
		  	       	title: demandMsgArray['building'] + '  ' + demandMsgArray['search']/*'건물 조회'*/,
		  	       	iframe: true,
		  	       	modal : true,
		  	           url: '/tango-transmission-web/demandmgmt/buildinginfomgmt/BuildInfoListPop.do',
		  	           data: null,
		  	           width : 1300,
		  	           height : 780, //window.innerHeight * 0.95,
		  	           /*
		  	       		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
		  	       	*/
		  	           callback: function(data) {
		  	        	   //console.log(data);
		  	        	   successDemandDetailCallback(data, sflag);
		  	          	}
	  	    });
        });
        
        // 건물 행삭제
        $('#btn_remove_bld').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	var dataList = $('#'+gridBld).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['deleteObjectCheck']);  /*"삭제할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		$('#'+gridBld).alopexGrid("dataDelete", {_index : { data:rowIndex }});

        	}  
        });
        

        /*******************************
         *  선로 그리드 이벤트
         *******************************/ 
        // 선로 데이터셋후
        $('#'+gridLn).on('dataSetEnd', function(e) { 
    		if (eqpCombo.length > 1 && procStFlag == 'E') {
    			var lnEditRow = AlopexGrid.trimData($('#'+gridLn).alopexGrid("dataGet", [{_state:{editing:true}}]) );
    			if (lnEditRow.length == 0) {
    				$('#'+gridLn).alopexGrid("startEdit");  
    			}
    		}
        	calLnInvestAmt(); 
			selectBdgtAmt($('#popAfeYr').val(), $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivDetlCd').val());
        });  
        
        // 선로 그리드 더블클릭시 편집
        $('#'+gridLn).on('dblclick', '.bodycell', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	var object = AlopexGrid.parseEvent(e);    
        	$('#'+gridLn).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        		 
		 // 더블클릭시 편집
		 $('#'+gridLn).on('dataAddEnd', function(e) {
		 	var object = AlopexGrid.parseEvent(e);
		 	var rowIndex = object.datalist[0]._index.data;        	
		 	$('#'+gridLn).alopexGrid( "startEdit", { _index : {data : rowIndex }});
		 });
        
        // 선로 행추가
        $('#btn_add_ln').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	if ($('#erpHdofcCd').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['hdofc'])); /*"본부를 선택해 주세요.;*/
        		return;
        	}

        	if ($('#demdBizDivCd').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig'])); /*"사업구분(대)를 선택해 주세요.");*/
        		return;
        	}

        	if (erpNeGrpList.length == 0) {
        		selectErpNeGrpList($('#popAfeYr').val(),  $('#popAfeDemdDgr').val(), $('#erpHdofcCd').val(), $('#demdBizDivCd').val()) ;  
        	} 
        	
        	var lnDataList = AlopexGrid.trimData($('#'+gridLn).alopexGrid("dataGet"));
        	/*if (lnDataList.length >= 2) {
        		alertBox('W', demandMsgArray['demandLineInformationMaxCount']);"선로/관로는 광케이블 혹은 광관로 각각 1개씩만 등록할 수 있습니다.";
        		return;
        	}*/
        	
        	var lnTypCd = "";
        	if (lnDataList.length == 1) {
        		lnTypCd = lnDataList[0].lnTypCd == "T01" ? "T02" : "T01"; 
        	} else {
        		lnTypCd = "T01";
        	}
        	
        	addLnRow(lnTypCd);
        });
        
        // 선로 행삭제
        $('#btn_remove_ln').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	var dataList = $('#'+gridLn).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['deleteObjectCheck']);  /*"삭제할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--){
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		
        		if(ProcStatCd == "105003" && EditMode == "ERP" && (dataList[i].trmsDemdLnSrno == defaulttrmsDemdLnSrno[0] || dataList[i].trmsDemdLnSrno == defaulttrmsDemdLnSrno[1])){
        			alertBox('W', 'ERP승인완료된 데이터 중 기준이 되는 항목은 삭제가 불가능합니다.');
            		return;
        		}
        	}
        	/*
        	for (var i = 0; i < dataList.length; i++){
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		
        		if(rowIndex == lnDefaultIdx1.idx || rowIndex == lnDefaultIdx2.idx){
        			alertBox('W', '광케이블/광관로의 기본데이터는 삭제가 불가능합니다.');
            		return;
        		}
        	}*/
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		
        		$('#'+gridLn).alopexGrid("dataDelete", {_index : { data:rowIndex }});
        	}
        	calLnInvestAmt(); 
        });
        
        // 선로 그리드 클릭시 클릭시
        $('#'+gridLn).on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	
        	if (data == null) {
        		return false;
        	}

        	gridClick(gridLn, object, data);        	
        });
        
       // 선로셀값 편집시
        $('#'+gridLn).on('cellValueEditing', function(e){
        	var ev = AlopexGrid.parseEvent(e);   
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var sctnLen;
        	var cstrUprc;
        	var cstrCost;
        	var lnInvtCost;
        	var cdlnInvtCost;
        	var cstrAmt;
        	// 구간길이, 공사비 수정시
        	if ( ev.mapping.key == "sctnLen" || ev.mapping.key == "cstrCost") { 
        		//sctnLen = AlopexGrid.currentValue(data,  "sctnLen" ) == '' ? 0 : AlopexGrid.currentValue(data,  "sctnLen" );
        		//cstrCost = parseInt(AlopexGrid.currentValue(data,  "cstrCost" ) == '' ? 0 : AlopexGrid.currentValue(data,  "cstrCost" ));
        		cstrUprc = 1000000;
            	$('#'+gridLn).alopexGrid('cellEdit', cstrUprc, {_index: {id: ev.data._index.id}}, 'cstrUprc');   // 공사단가 
            	calLnInvestAmt();  
        	}
        	
        	// 선로투자비, 관로투자비 수정시
        	if ( ev.mapping.key == "lnInvtCost" || ev.mapping.key == "cdlnInvtCost") { 
        		lnInvtCost = parseInt(AlopexGrid.currentValue(data,  "lnInvtCost" ) == '' ? 0 : AlopexGrid.currentValue(data,  "lnInvtCost" ));
        		cdlnInvtCost = parseInt(AlopexGrid.currentValue(data,  "cdlnInvtCost" ) == '' ? 0 : AlopexGrid.currentValue(data,  "cdlnInvtCost" ));
        		cstrAmt = lnInvtCost + cdlnInvtCost;
            	$('#'+gridLn).alopexGrid('cellEdit', cstrAmt, {_index: {id: ev.data._index.id}}, 'cstrAmt');   // 총투자비 
        	}
        });


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

        	if (procStFlag != "E") {
        		return;
        	}
        	var dataList = $('#'+gridFile).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['deleteObjectCheck']);  /*"삭제할 대상을 선택하세요."*/
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
        	
        	// 파일 셀 클릭시
        	if (object.mapping.columnIndex == 3) {
        		if ( data._state.focused) {
        			var atflId = data.atflId; // responseCustomValue 값이 저장되어 있음
        			
        			var sflag = {
  	    				  jobTp : 'fileDownLoad'
	  	    		};
	  	    		demandDetailRequest('tango-common-business-biz/dext/files/'+ atflId
	  	    				           , null
	  	    				           , 'GET'
	  	    				           , sflag);	
        		}
        	}
      	});
        
        /*******************************
         *  토지건축 그리드 이벤트
         *******************************/
     // 토지건축 데이터셋후
        $('#'+gridLand).on('dataSetEnd', function(e) { 
    		if (procStFlag == 'E') {
    			var landEditRow = AlopexGrid.trimData($('#'+gridLand).alopexGrid("dataGet", [{_state:{editing:true}}]) );
    			if (landEditRow.length == 0) {
    				$('#'+gridLand).alopexGrid("startEdit");  
    			}			
    		}
        });  
        
        // 토지건축 그리드 더블클릭시 편집
        $('#'+gridLand).on('dblclick', '.bodycell', function(e) {
        	if(EditMode == "ERP")		return false;
        	
        	if (procStFlag != "E") {
        		return;
        	}
        	var object = AlopexGrid.parseEvent(e);       	
        	$('#'+gridLand).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        		 
		 // 한줄추가후
		 $('#'+gridLand).on('dataAddEnd', function(e) {
		 	var object = AlopexGrid.parseEvent(e);
		 	var rowIndex = object.datalist[0]._index.data;        	
		 	$('#'+gridLand).alopexGrid( "startEdit", { _index : {data : rowIndex }});
		 });
		 
        // 토지건축 행추가
        $('#btn_add_land').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}

        	if ($('#erpHdofcCd').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['hdofc'])); /*"본부를 선택해 주세요.;*/
        		return;
        	}

        	if ($('#demdBizDivCd').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig'])); /*"사업구분(대)를 선택해 주세요.");*/
        		return;
        	}
        	addLandRow();
        });
        
        // 토지건축 행삭제
        $('#btn_remove_land').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	removeLandRow();
        });
        
     // 토지건축 그리드 클릭시 클릭시
        $('#'+gridLand).on('click', function(e) {
        	if(EditMode == "ERP")		return false;
        	
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	
        	if (data == null) {
        		return false;
        	}
        	gridClick(gridLand, object, data);        	
        	
        });
        
        //토지건축 그리드 편집시
        $('#'+gridLand).on('cellValueEditing', function(e){
	        	var ev = AlopexGrid.parseEvent(e);     
	        	var data = ev.data;
	        	var mapping = ev.mapping;
	        	
	        	var landPrchTotSumr;   // 계
	        	var landPrchCtrtAmt;   // 계약금
	        	var landPrchMiddlPayAmt;      // 중도금
	        	var landPrchAcqtTaxAmt;  // 취득세
	        	var landPrchJugApprCmms;      // 감정평가수수료
	        	var landPrchEtcAmt;     // 기타
	        	
	        	// 필요수량, 재고사용수량, 신규수량 변경시
	        	if (ev.mapping.key == "landPrchCtrtAmt" || ev.mapping.key == "landPrchMiddlPayAmt"  || ev.mapping.key == "landPrchAcqtTaxAmt"
	        		|| ev.mapping.key == "landPrchJugApprCmms"  || ev.mapping.key == "landPrchEtcAmt") {
	        		// 계
	        		landPrchTotSumr = parseInt(AlopexGrid.currentValue(data,  "landPrchTotSumr" ) == '' ? 0 : AlopexGrid.currentValue(data,  "landPrchTotSumr" ));
	        		// 계약금
	        		landPrchCtrtAmt = parseInt(AlopexGrid.currentValue(data,  "landPrchCtrtAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "landPrchCtrtAmt" ));
	        		// 중도금
	        		landPrchMiddlPayAmt = parseInt(AlopexGrid.currentValue(data,  "landPrchMiddlPayAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "landPrchMiddlPayAmt" ));
	        		// 취득세
	        		landPrchAcqtTaxAmt = parseInt(AlopexGrid.currentValue(data,  "landPrchAcqtTaxAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "landPrchAcqtTaxAmt" ));
	        		// 감정평가수수료
	        		landPrchJugApprCmms = parseInt(AlopexGrid.currentValue(data,  "landPrchJugApprCmms" ) == '' ? 0 : AlopexGrid.currentValue(data,  "landPrchJugApprCmms" ));
	        		// 기타
	        		landPrchEtcAmt = parseInt(AlopexGrid.currentValue(data,  "landPrchEtcAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "landPrchEtcAmt" ));
	
	        		landPrchTotSumr = landPrchCtrtAmt + landPrchMiddlPayAmt + landPrchAcqtTaxAmt + landPrchJugApprCmms + landPrchEtcAmt;
	        		
                	$('#'+gridLand).alopexGrid('cellEdit', landPrchTotSumr, {_index: {id: ev.data._index.id}}, 'landPrchTotSumr');   // 재고사용수량   
                	$('#'+gridLand).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'landPrchTotSumr');    			
        			
        		}
        });  
        
	};
	
    /*
	 * Function Name : successDemandDetailCallback
	 * Description   : 각 이벤트 성공시 처리 로직
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function successDemandDetailCallback(response, flag){
    	// 기준차수구하기
    	if (flag.jobTp == "getStdAfeDiv") {
    		flag.param.baseAfeYr = response[0].afeYr;
    		flag.param.baseAfeDemdDgr= response[0].afeDemdDgr;
    		setTransmissionDemandPoolDetail(flag.param)
    	}
    	// 저장
    	//console.log(response);
    	if (flag.jobTp == "saveDetailInfo") {
    		if (response.result.code == "OK") {
    			//alert(delFileList.length );
    			if (delFileList.length > 0) {
    				// 업로드 파일 다중 삭제
    				var sflag = {
    	    				  jobTp : 'fileDel'
    	    		};
    	    		demandDetailRequest('tango-common-business-biz/dext/files/group?method=delete' 
    	    				           , delFileList
    	    				           , 'POST'
    	    				           , sflag);    	    		
    			} else {
    				bodyProgressRemove();
    				/* 저장을 완료 하였습니다. */
    				callMsgBox('', 'I', demandMsgArray['saveSuccess'], function() {
    					$a.close(true);  
        			});
    			}
    		}  		
    	} 
    	// 기본정보 셋팅
    	else if (flag.jobTp =="baseInfo") {
    		//bodyProgressVal[0] = "baseInfo";
    		//bodyProgressValue();
    		setBaseInfo (response) ;    		
    	} 
    	// 장비정보 셋팅
    	else if (flag.jobTp== "eqpInfo") {
    		//bodyProgressVal[1] = "eqpInfo";
    		//bodyProgressValue();
    		setEqpInfo (response);
    	}  
    	else if (flag == "erpEqpTypCd"){
    		var eqpList = [{value:'', text:demandMsgArray['mandatory']}];  // 장비  "필수";
    		// eqpCombo = [{value:'', text:demandMsgArray['mandatory']}];  // 장비  "필수"
    		for(var i = 0; i < response.length; i++){
    			if(response[i].value == "T01" || response[i].value == "T02")	continue;
    			eqpList.push(response[i]);
    		}
    		eqpCombo = eqpList;
    	}
    	// 자재정보 셋팅
    	/*else if (flag.jobTp== "mtlInfo") {
    		//bodyProgressVal[2] = "mtlInfo";
    		//bodyProgressValue();
    		setMtlInfo (response);
    	} */  
    	// 자재정보초기셋팅
    	/*else if (flag.jobTp == "eqpMdlMatl") {
    		hideProgress(gridMtl);
    		if (response.eqpMdlMatlList.length > 0) {
		    	// 자재 그리드에 모델 자재셋 정보 셋팅 
		    	$('#'+gridMtl).alopexGrid("dataAdd", response.eqpMdlMatlList);
		    	// 해당 장비의 자재만 보이도록 필터링
		    	setFilterMtlGrid(response.eqpMdlMatlList[0].trmsDemdEqpSrno);	
    		}
    	} */
    	// 건물정보셋팅
    	else if (flag.jobTp == "bldInfo") {
    		//bodyProgressVal[3] = "bldInfo";
    		//bodyProgressValue();
    		if (response.bldInfoList.length > 0) {
        		// 건물 그리드에 건물 정보 셋팅 
		    	$('#'+gridBld).alopexGrid("dataSet", response.bldInfoList);
    		}
    	}
    	// 선로정보 셋팅 
    	else if (flag.jobTp== "lnInfo") {
    		//bodyProgressVal[4] = "lnInfo";
    		//bodyProgressValue();
    		if (response.lnInfoList.length > 0) {
	    		// 선로 그리드에 건물 정보 셋팅 
		    	$('#'+gridLn).alopexGrid("dataSet", response.lnInfoList);
		    	
		    	var dataList = AlopexGrid.trimData( $('#'+gridLn).alopexGrid("dataGet") );
		    	var lnTypCd = dataList[0].lnTypCd;
		    	lnDefaultIdx1.lnTypCd = dataList[0].lnTypCd;
		    	lnDefaultIdx1.intgFcltsBonbu = dataList[0].intgFcltsBonbu;
		    	lnDefaultIdx1.intgFcltsCd = dataList[0].intgFcltsCd;
		    	lnDefaultIdx1.intgFcltsNm = dataList[0].intgFcltsNm;
		    	lnDefaultIdx1.cstrCost = dataList[0].cstrCost;
		    	maxTrmsDemdLnSrno = dataList[0].maxTrmsDemdLnSrno;
		    	maxTrmsDemdLnSrno *= 1; 
		    	
	    		for(var i = 0; i < dataList.length; i++){
	    			var data = dataList[i];
	    			
	    			if(lnTypCd != data.lnTypCd){
	    				lnDefaultIdx2.idx = i;
	    				lnDefaultIdx2.lnTypCd = data.lnTypCd;
	    				lnDefaultIdx2.intgFcltsBonbu = data.intgFcltsBonbu;
	    				lnDefaultIdx2.intgFcltsCd = data.intgFcltsCd;
	    				lnDefaultIdx2.intgFcltsNm = data.intgFcltsNm;
	    				lnDefaultIdx2.cstrCost = data.cstrCost;
	    				break;
	    			}
	    		}
	    		
    		}
    		
        	if(ProcStatCd == "105003"){
        		var 		dataList = AlopexGrid.trimData( $('#'+gridLn).alopexGrid("dataGet") );
        		var 		i;
        		var			len = dataList.length;
        		
        		if(len > 0){
        			var			tmplnTyp = dataList[0].lnTypCd;
        			defaulttrmsDemdLnSrno[0] = dataList[0].trmsDemdLnSrno;
        			
        			for(i = 0; i < len; i++){
            			if(tmplnTyp != dataList[i].lnTypCd){
            				defaulttrmsDemdLnSrno[1] = dataList[i].trmsDemdLnSrno;
            				break;
            			}
            		}
        		}
        	}
    	} 
    	// 파일정보 셋팅 fileInfo
    	else if (flag.jobTp== "fileInfo") {
    		//bodyProgressVal[5] = "fileInfo";
    		//bodyProgressValue();
    		if (response.fileInfoList.length > 0) {
	    		// 선로 그리드에 건물 정보 셋팅 
		    	$('#'+gridFile).alopexGrid("dataSet", response.fileInfoList);	
    		}
    	}
    	// 토지건축정보 셋팅
    	else if (flag.jobTp== "landInfo") {
    		//bodyProgressVal[1] = "eqpInfo";
    		//bodyProgressValue();
    		if (response.landInfoList.length > 0) {
    			maxTrmsDemdMtsoSrno = parseInt(response.landInfoList[0].maxTrmsDemdMtsoSrno);
	    		// 선로 그리드에 건물 정보 셋팅 
		    	$('#'+gridLand).alopexGrid("dataSet", response.landInfoList);
    		}
    	}
    	// 파일 download
    	else if (flag.jobTp== "fileDownLoad") {  
    		$('#editorResult').text('업로드 파일조회결과 : ' + JSON.stringify(response));
    		fileJobType = 'down';
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
    	// 파일정보 셋팅 fileInfo
    	else if (flag.jobTp== "fileDel") {
    		/* 저장을 완료 하였습니다. */
    		bodyProgressRemove();
    		callMsgBox('', 'I', demandMsgArray['saveSuccess'], function() {
				$a.close(true);  
			});
    	}
    	// 통합시설검색
    	else if (flag.jobTp == "sisulNm") {    	
    		var focusData = $('#'+flag.grid).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
    		var intgFcltsCd = response.intgFcltsCd;
    		var erpIntgFcltsNm = response.erpIntgFcltsNm;
    		var intgFcltsBonbu = response.plntCd;
    		var tmofNm = response.tmofNm;
    		var lnTypCd = focusData[0].lnTypCd;
    		var sidoNm = response.planAreaNm;
    		var sggNm = response.sggAddr;
    		var emdNm = response.emdAddr;
    		
    		if(flag.grid == gridLn){
	    		if(rowIndex == lnDefaultIdx1.idx){
	    			lnDefaultIdx1.intgFcltsCd = intgFcltsCd;
	    			lnDefaultIdx1.intgFcltsNm = erpIntgFcltsNm;
	    			lnDefaultIdx1.intgFcltsBonbu = intgFcltsBonbu;
	    			lnDefaultIdx1.lnTypCd = lnTypCd;
	    		}
	    		else if(rowIndex == lnDefaultIdx2.idx){
	    			lnDefaultIdx2.intgFcltsCd = intgFcltsCd;
	    			lnDefaultIdx2.intgFcltsNm = erpIntgFcltsNm;
	    			lnDefaultIdx2.intgFcltsBonbu = intgFcltsBonbu;
	    			lnDefaultIdx2.lnTypCd = lnTypCd;
	    		}
    		} else if(flag.grid == gridEqp){
    			$('#'+flag.grid).alopexGrid( "cellEdit", sidoNm, {_index : { row : rowIndex}}, "sidoNm");
    			$('#'+flag.grid).alopexGrid( "cellEdit", sggNm, {_index : { row : rowIndex}}, "sggNm");
    			$('#'+flag.grid).alopexGrid( "cellEdit", emdNm, {_index : { row : rowIndex}}, "emdNm");
    		}
    		
    		if(flag.id == 'intgFcltsNm'){
    			$('#'+flag.grid).alopexGrid( "cellEdit", intgFcltsCd, {_index : { row : rowIndex}}, "intgFcltsCd");
        		$('#'+flag.grid).alopexGrid( "cellEdit", erpIntgFcltsNm, {_index : { row : rowIndex}}, "intgFcltsNm");
        		$('#'+flag.grid).alopexGrid( "cellEdit", intgFcltsBonbu, {_index : { row : rowIndex}}, "intgFcltsBonbu");
        		$('#'+flag.grid).alopexGrid( "cellEdit", tmofNm, {_index : { row : rowIndex}}, "tmofNm");
    		} else if(flag.id == 'bfIntgFcltsNm'){
    			$('#'+flag.grid).alopexGrid( "cellEdit", intgFcltsCd, {_index : { row : rowIndex}}, "bfIntgFcltsCd");
        		$('#'+flag.grid).alopexGrid( "cellEdit", erpIntgFcltsNm, {_index : { row : rowIndex}}, "bfIntgFcltsNm");
    		}
    		
    		
    		if(flag.grid == gridLn){
	    		var list = AlopexGrid.trimData( $('#'+flag.grid).alopexGrid( "dataGet", {} ) );
				ChangeintgFcltsCList(list, gridLn);
    		} else{
    			var list = AlopexGrid.trimData( $('#'+flag.grid).alopexGrid( "dataGet", {} ) );
    		}
        } 
    	// 신규 통합시설코드일 경우
    	else if(flag.jobTp == "makeSisulNm"){
    		var focusData = $('#'+flag.grid).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
    		
    		var erpIntgFcltsNm = response.erpIntgFcltsNm;
    		var intgFcltsBonbu = response.intgFcltsBonbu;
    		var sidoNm = response.sidoNm;
    		var sggNm = response.sggNm;
    		var emdNm = response.emdNm;
    		
    		$('#'+flag.grid).alopexGrid( "cellEdit", sidoNm, {_index : { row : rowIndex}}, "sidoNm");
			$('#'+flag.grid).alopexGrid( "cellEdit", sggNm, {_index : { row : rowIndex}}, "sggNm");
			$('#'+flag.grid).alopexGrid( "cellEdit", emdNm, {_index : { row : rowIndex}}, "emdNm");
    		$('#'+flag.grid).alopexGrid( "cellEdit", erpIntgFcltsNm, {_index : { row : rowIndex}}, "intgFcltsNm");
    		$('#'+flag.grid).alopexGrid( "cellEdit", intgFcltsBonbu, {_index : { row : rowIndex}}, "intgFcltsBonbu");
    		
//			var list = AlopexGrid.trimData( $('#'+flag.grid).alopexGrid( "dataGet", {} ) );
//			console.log("Check Added Data");
//			console.log(list);
    	}
    	// 국사설정
    	else if (flag.jobTp == "mtsoId") {
    		 //console.log(response);
			 var mtsoId = response.mtsoId;
	   	     var mtsoNm = response.mtsoNm;
	   	     $('#' + flag.objId + 'Cd').val(mtsoId);    	    
	   	     $('#' + flag.objId + 'Nm').val(mtsoNm);
    	} 
    	// 예산설정
    	else if (flag.jobTp == "bdgtAmt") {
    		//bodyProgressVal[6] = "bdgtAmt";
    		//bodyProgressValue();
	   	  //   $('#eqpBdgtAmt').text(response.eqpBdgtAmt == null ? 0 : setComma(response.eqpBdgtAmt));    	    
	   	     $('#lnBdgtAmt').text(response.lnBdgtAmt == null ? 0 : setComma(response.lnBdgtAmt));
    	}
    	// 장비/선로/형상 type 콤보조회 
    	else if (flag.jobTp == "erpNeGrpList") {
    		//bodyProgressVal[7] = "erpNeGrpList";
    		//bodyProgressValue();
    		// 장비/선로/형상type 리스트
    		erpNeGrpList = response.erpNeGrpList;
    		if (erpNeGrpList.length == 0) {
    			return;
    		}    		
    		// 장비type목록
    		// eqpCombo = response.eqpCombo;
    		// 형상type목록
    		shpTypCombo = response.shpTypCombo;
    		if (procStFlag == 'E') {
    	    	var eqpList = AlopexGrid.currentData( $('#'+gridEqp).alopexGrid("dataGet") );
    			if (eqpList.length > 0) {
        	    	var eqpEditRow = AlopexGrid.trimData($('#'+gridEqp).alopexGrid("dataGet", [{_state:{editing:true}}]) );
        	    	if (eqpEditRow.length == 0) {
        	    		//$('#'+gridEqp).alopexGrid("startEdit"); 
        	    	} else {
        	    		//$('#'+gridEqp).alopexGrid("endEdit"); 
        	    		//$('#'+gridEqp).alopexGrid("startEdit"); 
        	    	} 
    			}

    	    	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    			if (lnList.length > 0) {
        	    	var lnEditRow = AlopexGrid.trimData($('#'+gridLn).alopexGrid("dataGet", [{_state:{editing:true}}]) );
        	    	if (lnEditRow.length == 0) {
        	    		$('#'+gridLn).alopexGrid("startEdit"); 
        	    	} else {
        	    		$('#'+gridLn).alopexGrid("endEdit"); 
        	    		$('#'+gridLn).alopexGrid("startEdit"); 
        	    	} 
    			}
	       	}
    	}
    	// 사업구분(대)변경시 장비셋 정보 변경
    	// 장비/선로/형상 type 콤보조회 
    	else if (flag.jobTp == "changeErpNeGrpList") {
    		if (procStFlag != 'E') {
    			return;
    		}
    		// 장비/선로/형상type 리스트
    		erpNeGrpList = response.erpNeGrpList;    		  		
    		// 장비type목록
    		// eqpCombo = response.eqpCombo;
    		// 형상type목록
    		shpTypCombo = response.shpTypCombo;
    		//console.log(eqpCombo);
    		//console.log("changeErpNeGrpList");
    		// 편집 모드시
    		if (procStFlag == 'E') {
    	    	var eqpList = AlopexGrid.currentData( $('#'+gridEqp).alopexGrid("dataGet") );
    			if (eqpList.length > 0) {
        	    	var eqpEditRow = AlopexGrid.trimData($('#'+gridEqp).alopexGrid("dataGet", [{_state:{editing:true}}]) );
        	    	if (eqpEditRow.length == 0) {
        	    		$('#'+gridEqp).alopexGrid("startEdit"); 
        	    	} else {
        	    		$('#'+gridEqp).alopexGrid("endEdit"); 
        	    		$('#'+gridEqp).alopexGrid("startEdit"); 
        	    	}        			
        			// 장비type 콤보 변경을 위해 소구분값을 변경
        	    	$.each(eqpList, function(idx, obj){

        	  			var eqpTypCd = obj.eqpTypCd;
        	  			var shpTypCd = obj.shpTypCd;
        	  			var eqpHasMatch = false;
        	  			var shpHasMatch = false;
        	  			// 장비 Type    
        	  			if (eqpCombo.length > 0) {
	        	  			$.each(eqpCombo, function(cIdx, eqpComboList){
	        	  				
	        	  				if(eqpTypCd === eqpComboList.value){
	        	  					eqpHasMatch = true;
	        	  				}
	        	  			});
        	  			}
        	  			if(!eqpHasMatch){
        	  				// 값 클리어
                        	$('#'+gridEqp).alopexGrid('cellEdit', '', {_index: {row:obj._index.row}}, 'eqpTypCd');   // 장TYPE비   
        	  				$('#'+gridEqp).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'eqpTypCd');
        	  			}
        	  			// 형상 Type
        	  			if (shpTypCombo[obj.eqpTypCd] && shpTypCombo[obj.eqpTypCd].length > 0) {
	    	  				$.each(shpTypCombo[obj.eqpTypCd], function(cIdx, shpComboList){
	        	  				
	        	  				if(shpTypCd === shpComboList.value){
	        	  					shpHasMatch = true;
	        	  				}
	        	  			});
	    	  				
	    	  				if (shpTypCd === '' && shpHasMatch == false) {
	    	  					shpHasMatch = true;

	                        	$('#'+gridEqp).alopexGrid('cellEdit', shpTypCombo[obj.eqpTypCd][0], {_index: {row:obj._index.row}}, 'shpTypCd');   // 장TYPE비   
	        	  				$('#'+gridEqp).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'shpTypCd');
	    	  				}
        	  			}
        	  			if(!shpHasMatch){
        	  				// 값 클리어
                        	$('#'+gridEqp).alopexGrid('cellEdit', '', {_index: {row:obj._index.row}}, 'shpTypCd');   // 장TYPE비   
        	  				$('#'+gridEqp).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'shpTypCd');
        	  			}
        	    	});
    			}

    	    	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    			if (lnList.length > 0) {
        	    	var lnEditRow = AlopexGrid.trimData($('#'+gridLn).alopexGrid("dataGet", [{_state:{editing:true}}]) );
        	    	if (lnEditRow.length == 0) {
        	    		$('#'+gridLn).alopexGrid("startEdit"); 
        	    	} else {
        	    		$('#'+gridLn).alopexGrid("endEdit"); 
        	    		$('#'+gridLn).alopexGrid("startEdit"); 
        	    	} 
        	    	
        	    	// 형상type 콤보 변경을 위해 소구분값을 변경
        	    	$.each(lnList, function(idx, obj){

        	  			var shpTypCd = obj.shpTypCd;
        	  			var shpHasMatch = false;
        	  			
        	  			// 형상 Type
        	  			if (shpTypCombo[obj.lnTypCd] && shpTypCombo[obj.lnTypCd].length > 0) {
	    	  				$.each(shpTypCombo[obj.lnTypCd], function(cIdx, shpComboList){
	        	  				
	        	  				if(shpTypCd === shpComboList.value){
	        	  					shpHasMatch = true;
	        	  				}
	        	  			});
	    	  				
	    	  				if (shpTypCd === '' && shpHasMatch == false) {
	    	  					shpHasMatch = true;

	                        	$('#'+gridLn).alopexGrid('cellEdit', shpTypCombo[obj.lnTypCd][0], {_index: {row:obj._index.row}}, 'shpTypCd');   // 장TYPE비   
	        	  				$('#'+gridLn).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'shpTypCd');
	    	  				}
        	  			}
        	  			if(!shpHasMatch){
        	  				// 값 클리어
                        	$('#'+gridLn).alopexGrid('cellEdit', '', {_index: {row:obj._index.row}}, 'shpTypCd');   // 장TYPE비   
        	  				$('#'+gridLn).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'shpTypCd');
        	  			}
        	    	});
    			}
	       	}    		
    	}
    	// 장비모델 취득
    	else if (flag.jobTp == "eqpMdlGrpList") {
    		//bodyProgressVal[8] = "eqpMdlGrpList";
    		//bodyProgressValue();
    		// 장비모델 목록
    		eqpMdlCombo = response.eqpMdlCombo;
    	} 
    	// 모델자재 재고 취득
    	/*else if (flag.jobTp == "matlInveTotCnt") {
    		// 장비모델 목록
    		var inveTotCnt = 0;
    		if (nullToEmpty(response.matlInveTotCnt) != "") {
    			inveTotCnt = response.matlInveTotCnt;
    		}
    		$('#'+gridMtl).alopexGrid( "cellEdit", setComma(inveTotCnt),  { _index : {row : flag.rowIndex }}, "inveTotCnt"); 
    		
    	} 
    	// 계획수요중 자재재고사용총 취득
    	else if (flag.jobTp == "demandMatlInveUseTotCnt") {
    		// 장비모델 목록
    		var demdTotCnt = 0;
    		if (nullToEmpty(response.demandMatlInveUseTotCnt) != "") {
    			demdTotCnt = response.demandMatlInveUseTotCnt;
    		}
    		$('#'+gridMtl).alopexGrid( "cellEdit", setComma(demdTotCnt),  { _index : {row : flag.rowIndex }}, "demdTotCnt"); 
    	} */
    	// 건물추가
    	else if (flag.jobTp == "bldAdd") {
    		//console.log(response);
    		// 건물 그리드에 건물 정보 셋팅 
            var bldInfo = {
            		  lcenMgmtNo : response.lcenMgmtNo == undefined ? "" : response.lcenMgmtNo //인허가관리번호
		            , bldNm : response.bldNm == undefined ? "" : response.bldNm //건물명
		            , cnstrDivCdNm : response.lcenBldCnstDivNm == undefined ? "" : response.lcenBldCnstDivNm //건축구분명
		            , mainCnstrCnt : response.lcenMainCnstrCnt == undefined ? "0" : response.lcenMainCnstrCnt //주건축물수
		            , anxCnstrDongCnt : response.lcenAnxCnstrCnt == undefined ? "0" : response.lcenAnxCnstrCnt //부속건축물동수
		            , demdBldAddr : response.allAddr == undefined ? "" : response.allAddr //주소
		            , mainUsgCdNm : response.lcenBldMainUsgNm == undefined ? "" : response.lcenBldMainUsgNm //주용도코드명
		            , genCnt : response.lcenBldGenCnt == undefined ? "" : response.lcenBldGenCnt //가구수
				    , houshCnt : response.lcenBldHoushCnt == undefined ? "" : response.lcenBldHoushCnt //가구수
		            , florCntGrudVal : response.lcenGrudFlorCntNm == undefined ? "" : response.lcenGrudFlorCntNm //총수(지상)
		            , bsmtFlorCnt : response.lcenBsmtFlorCnt == undefined ? "0" : response.lcenBsmtFlorCnt //총수(지하)
		            , bgcscSchdDt : response.lcenBgcscSchdDt == undefined ? "" : response.lcenBgcscSchdDt.replace(/[/]/g, "") //착공예정일
		            , cmplSchdDt : response.lcenBgcscDlayDt == undefined ? "" : response.lcenBgcscDlayDt.replace(/[/]/g, "") //준공예정일(착공연기일)
		            , pnuLtnoCd : response.pnuLtnoCd == undefined ? "" : response.pnuLtnoCd //PNU지번번호
		            , bldCd : response.bldCd == undefined ? "" : response.bldCd //빌딩코드
				    , fdaisBldCd : response.fdaisBldCd == undefined ? "" : response.fdaisBldCd // 현장실사 빌딩코드
					//, fdaisBldCd : response.fdaisBldCd == undefined ? "" : response.fdaisBldCd 
            };
	    	$('#'+gridBld).alopexGrid("dataAdd", bldInfo);
    	} 
    	// 공통콤보 및 소구분, 선로 Type 
    	else if (flag.jobTp == "combo") {     		
    		var returnArray = null;
    		if(flag.allYn == 'Y'){
    			returnArray = [{value:'', text:demandMsgArray['all']}];/*"전체"*/
    		}else if(flag.allYn == 'S'){
    			returnArray = [{value:'', text:demandMsgArray['select']}];/*선택"
*/    		}else if(flag.allYn == 'NS'){
    			returnArray = [{value:'', text:demandMsgArray['mandatory']}];/*"필수"*/
    		} else {
    			returnArray = [];
    		};    		
	    	switch (flag.cbTp) {
	    		case "SCL" : sclCombo = []; if (response != null && response.length > 0 ) { sclCombo = returnArray.concat(response); } else { sclCombo = returnArray; }; break;
	    		case "LN" : lnCombo = []; if (response != null && response.length > 0 ) { lnCombo = returnArray.concat(response); } else { lnCombo = returnArray; }; break;	 
	    		case "CSTR" : cstrDiv = []; if (response != null && response.length > 0 ) { cstrDiv = returnArray.concat(response); } else { cstrDiv = returnArray; }; break;	 	 
	    		case "USG" : erpUsg = []; if (response != null && response.length > 0 ) { erpUsg = returnArray.concat(response); } else { erpUsg = returnArray; }; break;	 	 
	    		case "CSTRMC" : cstrMc = []; if (response != null && response.length > 0 ) { cstrMc = returnArray.concat(response); } else { cstrMc = returnArray; }; break;	    			 
	    		case "IV1" : fstInvtTypCd = []; if (response != null && response.length > 0 ) { fstInvtTypCd = returnArray.concat(response); } else { fstInvtTypCd = returnArray; }; break;	 	 
	    		case "IV2" : scndInvtTypCd = []; if (response != null && response.length > 0 ) { scndInvtTypCd = returnArray.concat(response); } else { scndInvtTypCd = returnArray; }; break;	 	 
	    		case "IV3" : thrdInvtTypCd = []; if (response != null && response.length > 0 ) { thrdInvtTypCd = returnArray.concat(response); } else { thrdInvtTypCd = returnArray; }; break;	    		
	    		default : break;
	    	};
	    	//console.log(response);	    	
    	} 
    	// 담당자 설정
    	else if (flag.jobTp  == "getChrgUserInfo") {
    		if (response != null ) {
    			//if (nullToEmpty($('#hdqtrChrgUserId').val()) == '' && nullToEmpty($('#hdqtrChrgUserNm').val()) == '') {
    			// 신규수요의 경우
    			if (nullToEmpty(trmsDemdMgmtNo) == '') {
    				// 본부담당자가 있는경우
    				if (nullToEmpty(response.hdqtrChrgUserId) != '' && nullToEmpty(response.hdqtrChrgUserNm) != '') {
	    				 $('#hdqtrChrgUserId').val(response.hdqtrChrgUserId);    	    
	            	     $('#hdqtrChrgUserNm').val(response.hdqtrChrgUserNm);
    				}
    				// 지역담당자가 있는경우
    				if (nullToEmpty(response.areaChrgUserId) != '' && nullToEmpty(response.areaChrgUserNm) != '') {    				
	       				 $('#areaChrgUserId').val(response.areaChrgUserId);    	    
	       	      	     $('#areaChrgUserNm').val(response.areaChrgUserNm);
    				} else {
    					//console.log($('#viewUserId').val());
           				//$('#areaChrgUserId').val($('#viewUserId').val());    	    
           	      	    //$('#areaChrgUserNm').val($('#viewUserNm').val());
    				}
    			}
    		}
    	}
    	// 수요 사업구분 장비/선로 투자구분
    	else if(flag.jobTp  == 'demdBizInvestTypeInfo') {
    		if (response != null ) {
    			demdBizInvestTypeInfo = []; 
    			if (response != null && response.length > 0 ) { 
    				demdBizInvestTypeInfo = response; 
    			}
    			if (flag.callType == 'check') {
    				//console.log(flag.callType);
    				if (response == null && response.length == 0) {
    					alertBox('W', demandMsgArray['failDemandBizInvestTypeInfo']);   // 사업구분(대)의 투자구분정보 취득에 실패했습니다.
    					return;
    				} else {
        				//console.log("saveTransDemandFileInfo");
    					// 저장 프로세스
    					saveTransDemandFileInfo();
    				}
    			} else {
    	    		// 사업구분(대)에 따라 장비 선로 영역 활 성 비 활정
    	    		editDemandBizEqpLnArea(init_div_biz_detl_cl);
    			}
    		}
    	}
    	// 토지건축 비용 조회
    	else if (flag.jobTp == "budget") {    	
    		var focusData = $('#'+flag.grid).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
    		var colum = flag.colum;
    		var cost = response.resltAmt;
    		$('#'+flag.grid).alopexGrid( "cellEdit", cost, {_index : { row : rowIndex}}, colum);    		
        }
    	// 토지건축 국사 조회
    	else if (flag.jobTp == "landMtso") {    	
    		var focusData = $('#'+flag.grid).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
    		var colum = flag.colum;
    		var mtsoCd = response.mtsoId;
    		$('#'+flag.grid).alopexGrid( "cellEdit", mtsoCd, {_index : { row : rowIndex}}, 'mtsoCd');
    		var mtsoNm = response.mtsoNm;
    		$('#'+flag.grid).alopexGrid( "cellEdit", mtsoNm, {_index : { row : rowIndex}}, 'mtsoNm');
        }
    }
    
    /*
	 * Function Name : failDemandDetailCallback
	 * Description   : 각 이벤트 실패시 처리 로직
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function failDemandDetailCallback(response, flag){
    	bodyProgressRemove();
    	if (flag.jobTp == "saveDetailInfo") {   
        	var length =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") ).length; 
    		maxFileCnt = length;
    		alertBox('W', response.message);
    		return;
    	} else if (flag.jobTp == "fileInfo") {    		
    		alertBox('W', response.message);
    		return;
    	} else if (flag.jobTp== "fileDownLoad") {    
    		//alert("fileDownLoad -- failDemandDetailCallback");
    		alertBox('W',  response.message);
    	} else if (flag.jobTp== "fileDel") {    
    		//alert("fileDel -- failDemandDetailCallback");

        	//var length =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") ).length; 
    		//maxFileCnt = length;
    		//alert("저장되었습니다.");
    		//$a.close(true);
    		
    		bodyProgressRemove();
    		callMsgBox('', 'I', demandMsgArray['saveSuccess'], function() {
				$a.close(true);  
			});
    		
    	} // 자재정보 셋팅
    	/*else if (flag.jobTp== "mtlInfo") { 
    		hideProgress(gridMtl);
    		alertBox('W',  demandMsgArray['failSearchDemandMatlInfo']);
    	}  */ 
    	// 자재정보초기셋팅
    	/*else if (flag.jobTp == "eqpMdlMatl") {
    		hideProgress(gridMtl);
    		alertBox('W',  demandMsgArray['failSearchDemandMatlInfo']);
    	}*/
    	// 사업구분(대) 취득
    	else if(flag.jobTp  == 'demdBizInvestTypeInfo') {
			if (flag.callType == 'check') {
				alertBox('W', demandMsgArray['failDemandBizInvestTypeInfo']);   // 사업구분(대)의 투자구분정보 취득에 실패했습니다.
				return;
			}
    	}
    	else {
    		if (response.message != undefined) {
    			alertBox('W',  response.message);
    		}
    		return;
    	}
    	return;
    }
    function ChangeintgFcltsCList(list, gridval){
    	if(list.length < 1)			return false;
    	
    	var length = list.length;
    	var intgFcltsCd = list[0].intgFcltsCd;
		var erpIntgFcltsNm = list[0].intgFcltsNm;
		var intgFcltsBonbu = list[0].intgFcltsBonbu;
		var rowIndex = 0;
		var lnTypCd = "";
    	var i;
    	
    	for(i = 1; i < length; i++){
    		rowIndex = i;
    		var data = list[i];
    		
    		if(data.lnTypCd == lnDefaultIdx1.lnTypCd){
    			intgFcltsCd = lnDefaultIdx1.intgFcltsCd;
    			erpIntgFcltsNm = lnDefaultIdx1.intgFcltsNm;
    			intgFcltsBonbu = lnDefaultIdx1.intgFcltsBonbu;
    		}
    		else if(data.lnTypCd == lnDefaultIdx2.lnTypCd){
    			intgFcltsCd = lnDefaultIdx2.intgFcltsCd;
    			erpIntgFcltsNm = lnDefaultIdx2.intgFcltsNm;
    			intgFcltsBonbu = lnDefaultIdx2.intgFcltsBonbu;
    		}
    		lnTypCd = list[i].lnTypCd;
    		
    		$('#'+gridval).alopexGrid( "cellEdit", intgFcltsCd, {_index : { row : rowIndex}}, "intgFcltsCd");
    		$('#'+gridval).alopexGrid( "cellEdit", erpIntgFcltsNm, {_index : { row : rowIndex}}, "intgFcltsNm");
    		$('#'+gridval).alopexGrid( "cellEdit", intgFcltsBonbu, {_index : { row : rowIndex}}, "intgFcltsBonbu");
    		$('#'+gridval).alopexGrid( "cellEdit", lnTypCd, {_index : { row : rowIndex}}, "lnTypCd");
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
	//AlopexGrid.currentData( $('#'+gridEqp).alopexGrid("dataGet") );
	if (nullToEmpty(fileAddNm) == '') {
		return;
	}
	var dataList =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") );
	var fileExsitYn = false;
	
	for (var i = 0; i < dataList.length; i++) {
		var fileNm = dataList[i].atflNm;
		if (fileNm == fileAddNm) {
			fileExsitYn = true;
			break;
		}
	}
	if (fileExsitYn == false) {
		//console.log(dataList);
		tempFileSrno = tempFileSrno+1;
		//console.log(tempFileSrno);
		var initRowData = [{"atflId" : "", "tempFileNo" : tempFileSrno+"", "atflNm" : fileAddNm, "trmsDemdMgmtNo" : trmsDemdMgmtNo}];
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
		var a = DEXT5UPLOAD.GetAllFileListForJson("dext5upload");
		var tdpFile = document.getElementById("fileAdd");
		DEXT5UPLOAD.AddLocalFileObject(tdpFile, tempFileSrno, "dext5upload");
		var b = DEXT5UPLOAD.GetAllFileListForJson("dext5upload");
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
 	 saveTransDemandInfo();	 	 
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
     if (fileJobType != 'down') {
         alertBox('W', demandMsgArray['failFileUpload']);/*"파일 업로드에 실패했습니다."*/
     } else {
         alertBox('W', demandMsgArray['failFileDownLoad']);/*"파일 업로드에 실패했습니다."*/
         fileJobType=null;
     }
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
 