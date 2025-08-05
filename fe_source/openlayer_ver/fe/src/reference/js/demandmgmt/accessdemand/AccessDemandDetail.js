/**
 * AccessDemandDetail.js
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 * 
 * ========= 특이 사항 ==============
 * 1. 장비는 기본적으로 mux장비를 기본으로 한다.
 * 2. 장비모델은 CRM6400(RT) : 수도권, 서부, 중부  HSN8000(RT) : 부산 대구
 * 3. A망수요의 통합시설코드가 서비스 종료 이외의 경우면 전송망 수요의 통합시설코드로 기본 설정
 * 4. A망 수요의 개통월을 장비/선로의 개통월로 기본 설정
 * 5. A망의 유선망 길이가 0 이면 선로의 길이를 1로 기본설정, 길이>0 인경우 길이/1000 로 변환하여 M로 설정
 * 6. A망의 유선망 비용이 있으면 선로의 비용*10,000로 설정 없으면 1,000,000으로 설정
 * 7. A망의 국소정보를 선로/관로의 구간정보로 설정
 * 8. 선로/관로는 광케이블/광관로 1건씩만 등록가능
 * 9. 광케이블 : LWPF48가공, 광관로 : 시내관로 2공
 * 
 */

var emptyCombo = [];  // 빈콤보

var erpNeGrpList = []; // 장비유형/선로유형/형상유형 동적콤보용 리스트
var sclCombo = [];		// 소구분
var eqpCombo = [];      // 장비Type
var lnCombo = [];      // 선로Type
var shpTypCombo = [];   // 형상Type
var eqpMdlCombo = [];	// 장비모델콤보

//사업구분(대)의 장비/선로 구분 정보
var demdBizInvestTypeInfo = [];

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
var maxTrmsDemdLnSrno = 0;
var procStFlag = 'E';    // E : 편집가능,  D : 편집 불가

var trmsDemdMgmtNo = null;
var init_div_biz_cl = null;  // 사업구분 (대) 
var init_div_biz_detl_cl = null;  // 사업구분(세부)
var accessDemandInfo = null; // Access망 정보

var defaultOpenYm = null;  // 통시본부 기본
var EditMode = '';
var ProcStatCd = "";
var defaulttrmsDemdLnSrno = [];
$a.page(function() {
        
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	procStFlag = 'D';  
    	if(param.RM == "AM"){//A망 수요내역만 보여줌
    		$(".AccessDemand").hide();
    		$('#btn_save').hide();
    		procStFlag = 'D';  
    	}else if(param.RM == "VM"){//수정불가(보기모드)
    		procStFlag = 'D';  
    	}else if(param.RM == "DM"){//수요
    		procStFlag = 'E';  
    	} else {
    		setDetailInfoEditMode("");
    		return;
    	}
    	trmsDemdMgmtNo = null;
    	trmsDemdMgmtNo = param.trmsDemdMgmtNo;
    	EditMode = nullToEmpty(param.EditMode);
    	ProcStatCd = nullToEmpty(param.demdProgStatCd);
    	
    	init_div_biz_cl = null;
    	init_div_biz_detl_cl = null;
    	//$('#afeDemdDgrPop').val('003');
    	// 그리드 셋팅
        initDetailGrid();
        // 화면 기본셋팅
    	setInitDetailPage();
    	// 이벤트 셋팅
    	setEventListenerDetail();
    	accessDemandInfo = null;

		bodyProgress();
    	// 전송망수요관리번호가 없는경우 
    	if (nullToEmpty(trmsDemdMgmtNo) == '') {
    		var sflag = {
	  				  jobTp : 'detailaccessdemand',
	  				  flag : 'add'
	  		};
    		// 초기화
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detailaccessdemand/', param, 'GET', sflag);
    	} else {	  		
    		$('#trmsDemdMgmtNoPop').val(trmsDemdMgmtNo);
    		var sflag = {
	  				  jobTp : 'detailaccessdemand',
	  				  flag : 'detail',
	  				  param : trmsDemdMgmtNo
	  		};
	  		// 초기화
	  		demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detailaccessdemand/', param, 'GET', sflag);
    	}
    	
    	defaultOpenYm = getViewDateStrFinalMonth('YYYYMM');
    	if (nullToEmpty(defaultOpenYm) && defaultOpenYm.indexOf('-') > 0) {
    		defaultOpenYm = defaultOpenYm.replace(/-/gi, "");
    	}
    	
    };
  //request
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandDetailCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDemandCallback(response, flag){
    	
    	if(flag.jobTp == 'detailaccessdemand'){
    		if (response.list == 0) {
        		bodyProgressRemove();
        		alertBox('W', demandMsgArray['noInquiryData']);  /*조회된 데이터가 없습니다.*/
        		//setDetailInfoEditMode("");
        		$(".AccessDemand").hide();
        		$('#btn_save').hide();
        		procStFlag="D";
        		return;
    		} else {
    			accessDemandInfo = response.list[0];
    			$(".custom_1").setData(response.list[0]);
        		$('#afeYrPop').val(response.list[0].afeYr);
        		$('#afeDemdDgrPop').val(response.list[0].acsnwAfeDgr);
        		$('#erpHdofcCdPop').val(response.list[0].erpHdofcCd);
        		$('#acsnwPrjIdPop').val(response.list[0].acsnwPrjId);
        		$('#acsnwDemdMgmtSrno').val(response.list[0].acsnwDemdMgmtSrno);
    			if (nullToEmpty(response.list[0].acsnwDemdMgmtSrno) == '') {
            		bodyProgressRemove();
    				procStFlag = 'D'; 
            		$(".AccessDemand").hide();
            		$('#btn_save').hide();
    				return;
    			}
        		if (nullToEmpty(response.list[0].trmsDemdMgmtNo) == '') {
            		bodyProgressRemove();
            		$('#detlUsgRmk').val("전송망");   // 세부용도
            		setDetailInfoEditMode("");

            		selectYearBizCombo('demdBizDivCdPop', 'Y', response.list[0].afeYr, 'C00618', '', 'A');	// 사업구분 대
            		// 사용자 설정

            		// 사업명 설정
            		$('#bizNm').val(accessDemandInfo.acsnwSmtsoNm);
             	     //$('#areaChrgUserId').val($('#viewUserId').val());    	    
             	     //$('#areaChrgUserNm').val($('#viewUserNm').val());
        		} else {
        			var sflag = {
        	  				  jobTp : 'baseInfo'
      	  	  		};
      	  	  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detailbaseinfo/' + nullToEmpty(response.list[0].trmsDemdMgmtNo) , null, 'GET', sflag);
        		}

            	// 사업구분 대 의 장비/선로 투자구분정보
            	getDemdBizInvestTypeInfo('init', '');
    		}
    	}
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
	 * Function Name : getDemdBizInvestTypeInfo
	 * Description   : 사업구분 세부 의 장비/선로 투자구분정보
	 */
	function getDemdBizInvestTypeInfo(initType, supCd){
		var requestParam = {
				 afeYr : $('#afeYrPop').val()
				,supCd : supCd
				,demdDivCd : 'A'					
			   
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
	 * Function Name : setBaseInfo
	 * Description   : 기본정보 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * response : 장비정보
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setBaseInfo(response) {

		bodyProgressRemove();
    	if (response.baseInfo.length > 0) {
	    	$('#detailForm').setData(response.baseInfo[0]);	  
	    	if (response.baseInfo[0].demdProgStatCd != '105001') {
	    		procStFlag = "D";
	    	}
	    	// 사업구분(대)
    		init_div_biz_cl = response.baseInfo[0].demdBizDivCdPop;
	    	// 사업구분세부 설정 
	    	init_div_biz_detl_cl = response.baseInfo[0].demdBizDivDetlCdPop;
    		
    		selectYearBizCombo('demdBizDivCdPop', 'Y', $("#afeYrPop").val(), 'C00618', response.baseInfo[0].demdBizDivCdPop, 'A');	// 사업구분 대
    		// 사업구분(세부)
			selectYearBizCombo('demdBizDivDetlCdPop', 'Y', $("#afeYrPop").val(), response.baseInfo[0].demdBizDivCdPop, response.baseInfo[0].demdBizDivDetlCdPop, 'A');
			// 사업구분(세부) 의 장비/선로 투자구분정보
	    	//getDemdBizInvestTypeInfo('init', response.baseInfo[0].demdBizDivDetlCdPop);
			
			selectErpNeGrpList($("#afeYrPop").val(),  $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), response.baseInfo[0].demdBizDivCdPop) ;
			selectBdgtAmt($("#afeYrPop").val(),$('#afeDemdDgrPop').val(),$('#erpHdofcCdPop').val(), response.baseInfo[0].demdBizDivCdPop);
			// 본사담당자
			 $('#hdqtrChrgUserNm').text(response.baseInfo[0].hdqtrChrgUserNm); 
			// 지역담당자
			 $('#areaChrgUserNm').text(response.baseInfo[0].areaChrgUserNm);  			 
			 trmsDemdMgmtNo = response.baseInfo[0].trmsDemdMgmtNo;
			// 장비정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'eqpInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detaileqpinfo/' + response.baseInfo[0].trmsDemdMgmtNo 
		  				           , null
		  				           , 'GET'
		  				           , sflag);	
			}
						
			// 선로정보취득
			if (response.baseInfo.length > 0) {
				var sflag = {
		  				  jobTp : 'lnInfo'
		  		};
		  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detaillninfo/' + response.baseInfo[0].trmsDemdMgmtNo , null, 'GET', sflag);	
			}
			
			// 사업구분(세부)에 따른 투자구분에 의한 장비/선로 탭 설정
	    	editDemandBizEqpLnArea(init_div_biz_detl_cl);
    	} else {

			procStFlag = 'D'; 
    		//$(".AccessDemand").hide();
    		$('#btn_save').hide();
    	}
		
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
    		$("#hdqtrChrgUserNm").setEnabled(enabledYn);
    		$("#areaChrgUserNm").setEnabled(enabledYn);
    		$("#demdBizDivCdPop").setEnabled(enabledYn);
    		$("#demdBizDivDetlCdPop").setEnabled(enabledYn);
    		$("#bizUsgCd").setEnabled(enabledYn);
    		$("#bizNm").setEnabled(enabledYn);
    		$("#detlUsgRmk").setEnabled(enabledYn);
    		
    		// 버튼영역
    		$("#btn_add_eqp").setEnabled(enabledYn);
    		$("#btn_remove_eqp").setEnabled(enabledYn);
    		$("#btn_add_ln").setEnabled(enabledYn);
    		$("#btn_remove_ln").setEnabled(enabledYn);
    		$("#btn_save").setEnabled(enabledYn);    		
    	}
    	
    	if(EditMode == "ERP"){
			procStFlag = "E";
			//기본영역
			$("#bizUsgCd").setEnabled(true);
    		$("#bizNm").setEnabled(true);
    		$("#detlUsgRmk").setEnabled(true);
			
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
    	// 선택값이 없을 경우
    	if (nullToEmpty(demdBizDivCd) == '') {
    		// 장비 탭 활성
    		$('#basicTabs').setEnabled(true, 0);
    		// 선로/관로 탭 활성
    		$('#basicTabs').setEnabled(true, 1);  
    		return;
    	}

    	if (demdBizInvestTypeInfo == null || demdBizInvestTypeInfo.length == 0) {
    		//console.log("demdBizInvestTypeInfo is null");
    		return;
    	}
    	
    	$.each(demdBizInvestTypeInfo, function(cIdx, demdBizInvestTypeList){				
				if(demdBizDivCd === demdBizInvestTypeList.cd){
					investType = demdBizInvestTypeList.cdNm;
				}
		});

    	var tabIndexVal = $('#basicTabs').getCurrentTabIndex();
    	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    	
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
    		$('#basicTabs').setTabIndex(1);	
    		
    	} else {
    		/*$("#btn_add_eqp").setEnabled(true);
    		$("#btn_remove_eqp").setEnabled(true);
    		$("#btn_add_ln").setEnabled(true);
    		$("#btn_remove_ln").setEnabled(true);    */

    		// 장비 탭 활성
    		$('#basicTabs').setEnabled(true, 0);
    		// 선로/관로 탭 활성
    		$('#basicTabs').setEnabled(true, 1);  
    		
    	}
    }
    
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
    		showProgress(gridMtl);
			maxTrmsDemdEqpSrno = parseInt(response.eqpInfoList[0].maxTrmsDemdEqpSrno);
        	$('#'+gridEqp).alopexGrid("dataSet", response.eqpInfoList);
        	
        	// 장비정보 취득
			var sflag = {
	  				  jobTp : 'mtlInfo'
	  		};
	  		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detailmtlinfo/' + response.eqpInfoList[0].trmsDemdMgmtNo 
	  						   , null
	  						   , 'GET'
	  						   , sflag);	
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
    function setMtlInfo(response) {
    	hideProgress(gridMtl);
    	if (response.mtlInfoList.length > 0) {
			//console.log("setMtlInfo",response);
        	$('#'+gridMtl).alopexGrid("dataSet", response.mtlInfoList);

        	setFilterMtlGrid(response.mtlInfoList[0].trmsDemdEqpSrno);
    	}
    }
            
	/*
	 * Function Name : delMtlList
	 * Description   : 자재그리드에 특정 장비일련번호에 해당하는 자재정보삭제 
	 * ----------------------------------------------------------------------------------------------------
	 * trmsDemdEqpSrno : 장비일련번호
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function delMtlList(trmsDemdEqpSrno) {      	
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
    
    /*
	 * Function Name : setFilterMtlGrid
	 * Description   : 자재그리드에 장비일련번호에해당하는 자재정보만 표시 
	 * ----------------------------------------------------------------------------------------------------
	 * trmsDemdEqpSrno : 장비일련번호
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function setFilterMtlGrid(trmsDemdEqpSrno) {      	
        $('#'+gridMtl).alopexGrid( "setFilter", 'mtlFilter', function (data) {
        	if (  data['trmsDemdEqpSrno'] == trmsDemdEqpSrno ) {
        		return true;
        	} else {
        		return false;
        	}
        });
        
    }
    
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
    function getEqpMdlMatl(currentData) {
    	// 해당 장비의 기존 자재정보 삭제
    	delMtlList(currentData[0].trmsDemdEqpSrno);

    	showProgress(gridMtl);
    	var requestParam = { 
    			  demdEqpMdlCd : currentData[0].demdEqpMdlCd
				, trmsDemdMgmtNo : currentData[0].trmsDemdMgmtNo
				, trmsDemdEqpSrno : currentData[0].trmsDemdEqpSrno  
				, erpHdofcCd : $('#erpHdofcCdPop').val()   
				, eqpTypCd : currentData[0].eqpTypCd
		};
		
    	var sflag = {
				  jobTp : 'eqpMdlMatl'   // 작업종류
		};
		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/matlmgmt/eqpmdlmatllist/'
				           , requestParam
				           , 'GET'
				           , sflag);		
    }
        
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
     function getMatlInveTotCnt(rowIndex, namsMatlCd, vendVndrCd) {   
     	var requestParam = { 
     			  erpHdofcCd : $('#erpHdofcCdPop').val()
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
     }
     
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
      function getDemandMatlInveUseTotCnt(rowIndex, namsMatlCd, vendVndrCd) {   
      	var requestParam = { 
      			  erpHdofcCd : $('#erpHdofcCdPop').val()
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
    	   
    /*
	 * Function Name : openSisulListPopup
	 * Description   : 통합시설검색 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * grid          : 그리드 id
	 * sisulNm       : 시설명
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 통합시설정보
	 */
   function openSisulListPopup(grid, sisulNm) {
    	var sflag = {
				  jobTp : 'sisulNm'   // 작업종류
				, grid : grid       // 콤보종류
				, allYn : ''     // 전체여부
		};
    	
    	var bSearchFixed = false;
    	if(grid == gridLn)
    		bSearchFixed = true;
    	
    	 $a.popup({
	       	popid: 'SisulListPopup',
	       	title: demandMsgArray['integrationFacilitiesName']+' ' + demandMsgArray['search'],  /*'통합시설명 조회'*/
	       	iframe: true,
	       	modal : true,
	           url: '/tango-transmission-web/demandmgmt/common/IntgFcltsSearchPopup.do',
	           data: {srchPlntCd:$('#erpHdofcCdPop').val()
	        	    , reqMode : "DM"
	        	    , bSearchFixed : bSearchFixed},
	           width : 1400,
	           height : 700, //window.innerHeight * 0.8,
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
	 * Function Name : calEqpInvestAmt
	 * Description   : 장비투자비 계산
	 * ----------------------------------------------------------------------------------------------------
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
  function calEqpInvestAmt() {
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
  
  	/*
	 * Function Name : calEqpMtrlUprc
	 * Description   : 장비 물자단가 계산
	 * ----------------------------------------------------------------------------------------------------
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
  	function calEqpMtrlUprc(trmsDemdEqpSrno) {
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
  	    
    /*
 	 * Function Name : calLnInvestAmt
 	 * Description   : 선로투자비 계산
 	 * ----------------------------------------------------------------------------------------------------
 	 * ----------------------------------------------------------------------------------------------------
 	 * return        : 
 	 */
   function calLnInvestAmt() {
 	  var gridLnList = AlopexGrid.currentData($('#'+gridLn).alopexGrid("dataGet")); 	  
 	  var lnInvestAmt = 0;
      var cstrCost = 0;
 	  for (var i = 0; i < gridLnList.length; i++ ) {
 		  if (gridLnList[i].cstrCost != '') {
 			  cstrCost = parseInt(gridLnList[i].cstrCost);
 		  }
 		 lnInvestAmt = lnInvestAmt + cstrCost;
 		 cstrCost = 0;
 	  }
 	 $('#lnInvestAmt').text(setComma(lnInvestAmt));
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
    	if ($('#afeYrPop').val() == '' || $('#demdBizDivDetlCdPop').val() == '') {
    		return;
    	}
    	if (nullToEmpty(trmsDemdMgmtNo) != '') {
    		return;
    	}
    	var requestParam = { 
    			  afeYr : $('#afeYrPop').val()     			  
     			, erpHdofcCd : $('#erpHdofcCdPop').val()
				, demdBizDivDetlCd : $('#demdBizDivDetlCdPop').val()		
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
	 * Function Name : addEqpRow
	 * Description   : 장비 행 추가
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function addEqpRow() {
    	var dataList = AlopexGrid.trimData( $('#'+gridEqp).alopexGrid("dataGet") );
    	var defaultIntgFcltsCd = '';
    	var defaultIntgFcltsNm = '';
    	var defaultIntgBonbu = '';
    	var defaultInitSclDivCd = 'TD';
    	var defaultInitEqpTypCd = 'T11';
    	var defaultInitDemdEqpMdlCd = '';
    	// 통시설정
    	if (accessDemandInfo.intgFcltsYn == 'Y') {
    		defaultIntgFcltsCd = accessDemandInfo.intgFcltsCd;
    		defaultIntgFcltsNm = accessDemandInfo.erpIntgFcltsNm;
    		defaultIntgBonbu = accessDemandInfo.erpHdofcCd;
    	}
    	// 본부별 장비모델 설정(수도권, 서부, 중부   경우 : CRM6400(RT))
    	if (accessDemandInfo.erpHdofcCd == '5100' || accessDemandInfo.erpHdofcCd == '5500' || accessDemandInfo.erpHdofcCd == '5600') {
    		defaultInitDemdEqpMdlCd = 'DMT0001497';
    	}

    	// 본부별 장비모델 설정(부산, 대구   경우 : HSN8000(RT))
    	if (accessDemandInfo.erpHdofcCd == '5300' || accessDemandInfo.erpHdofcCd == '5400') {
    		defaultInitDemdEqpMdlCd = 'DMT0001499';
    	}
    	var initRowData = [
    	    {
    	    	  "intgFcltsNm" : defaultIntgFcltsNm
    	    	, "intgFcltsCd" : defaultIntgFcltsCd
    	    	, "intgFcltsBonbu" : defaultIntgBonbu
    	    	, "sclDivCd" : defaultInitSclDivCd
    	    	, "eqpTypCd" : defaultInitEqpTypCd
    	    	, "shpTypCd" : ''
        	    , "detlCstrDivCd" : ( cstrDiv.length <1 ) ? '' : cstrDiv[0].value     // 공사유형
            	, "eqpCnt" : '1' 
        	    , "demdEqpMdlCd" : defaultInitDemdEqpMdlCd
                , "mtrlUprc" : '0'
                , "cstrUprc" : '0'	
                , "cstrCost" : '0'
            	, "investAmt" : '0'
                , "mtrlCost" : '0'
                , "erpUsgCd" : ( erpUsg.length <1 ) ? '' : erpUsg[0].value    // 용도
                , "systmNo" : ''
                , "openYm" : nullToEmpty(accessDemandInfo.openYm) != '' ? accessDemandInfo.openYm : defaultOpenYm
                , "cstrMeansCd" : ( cstrMc.length <1 ) ? '' : cstrMc[0].value    // 방식  
                , "fstInvtTypCd" : ( fstInvtTypCd.length <1 ) ? '' : fstInvtTypCd[0].value    // 투자유형1   
                , "scndInvtTypCd" : ( scndInvtTypCd.length <1 ) ? '' : scndInvtTypCd[0].value    // 투자유형1    
                , "thrdInvtTypCd" : ( thrdInvtTypCd.length <1 ) ? '' : thrdInvtTypCd[0].value    // 투자유형1    
                , "trmsDemdEqpSrno" : maxTrmsDemdEqpSrno+1   	
    	    }
    	];
    	
    	//console.log(sclCombo[2].cd);
    	maxTrmsDemdEqpSrno = maxTrmsDemdEqpSrno + 1;
    	$('#'+gridEqp).alopexGrid("dataAdd", initRowData);
    	
    	calEqpInvestAmt();
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
    		delMtlList(data.trmsDemdEqpSrno);
    	}    	
    	
    	calEqpInvestAmt(); 
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
    	//var lnTypCd = "T01";
    	var dataList = AlopexGrid.trimData( $('#'+gridLn).alopexGrid("dataGet") );
    	/*if(dataList.length >= 2){
    		alertBox('W', demandMsgArray['demandLineInformationMaxCount']);"선로/관로는 광케이블 혹은 광관로 각각 1개씩만 등록할 수 있습니다.";
    		return;
    	}*/
    	var defaultIntgFcltsCd = '';
    	var defaultIntgFcltsNm = '';
    	var defaultIntgBonbu = '';
    	if (accessDemandInfo.intgFcltsYn == 'Y') {
    		defaultIntgFcltsCd = accessDemandInfo.intgFcltsCd;
    		defaultIntgFcltsNm = accessDemandInfo.erpIntgFcltsNm;
    		defaultIntgBonbu = accessDemandInfo.erpHdofcCd;
    	}
    	
    	if(dataList.length > 0){
    		if(EditMode == "ERP"){
        		defaultIntgFcltsCd = dataList[0].intgFcltsCd;  // 통시코드 기본
            	defaultIntgFcltsNm = dataList[0].intgFcltsNm;  // 통시명 기본
            	defaultIntgBonbu = dataList[0].intgFcltsBonbu;  // 통시본부 기본
        	}
    		else{
    			for(var i = 0; i < dataList.length; i++){
        			var data = dataList[i];
        			
        			if(data.lnTypCd == lnTypCd){
        				defaultIntgFcltsCd = dataList[i].intgFcltsCd;  // 통시코드 기본
                    	defaultIntgFcltsNm = dataList[i].intgFcltsNm;  // 통시명 기본
                    	defaultIntgBonbu = dataList[i].intgFcltsBonbu;  // 통시본부 기본
                    	
                    	break;
        			}
        		}
    		}
    	}
    	
    	/*if(dataList.length == 0){
    		lnTypCd = "T01";
    	}else{
    		lnTypCd = (dataList[0].lnTypCd == "T02") ? "T01" :"T02";
    	}*/
    	
    	var cstrUprc = 0;
    	var cblnwDistVal = nullToEmpty(accessDemandInfo.cblnwDistVal);
    	var cblnwLnCst = nullToEmpty(accessDemandInfo.cblnwLnCst);
    	/*if (cblnwDistVal != '0' && cblnwLnCst != '' && cblnwLnCst !='0') {
    		cstrUprc = parseInt(((parseInt(accessDemandInfo.cblnwLnCst)*10000) / (parseInt(cblnwDistVal)/1000)) + 0.5);
    	} else if (cblnwDistVal != '0' && (cblnwLnCst == '' || cblnwLnCst == '0')) {
    		cstrUprc = parseInt((1000000 / (parseInt(cblnwDistVal)/1000)) + 0.5);
    	} else if ((cblnwDistVal == '0' || cblnwDistVal == '') && cblnwLnCst != '' && cblnwLnCst !='0')  {
    		cstrUprc = parseInt(accessDemandInfo.cblnwLnCst)*10000;
    	} else {
    		cstrUprc = 1000000;
    	}*/
    	maxTrmsDemdLnSrno += 1; 
    	
    	cstrUprc = 1000000;
    	var initRowData = [
    	    {
    	    	  "intgFcltsNm" : defaultIntgFcltsNm
        	    , "intgFcltsCd" : defaultIntgFcltsCd
            	, "intgFcltsBonbu" : defaultIntgBonbu
    	    	, "demdLnSctnInfCtt" : nullToEmpty(accessDemandInfo.acsnwSmtsoNm) != '' ? accessDemandInfo.acsnwSmtsoNm : ''
    	    	, "lnTypCd" : lnTypCd
    	    	, "shpTypCd" : ( lnTypCd == 'T01') ? 'NH' : 'TV'  // 광케이블 : LWPF48가공, 광관로 : 시내관로 2공
        	    , "detlCstrDivCd" : ( cstrDiv.length <1 ) ? '' : '1'     // 공사유형
            	, "sctnLen" : cblnwDistVal != '0' ? parseInt(cblnwDistVal)/1000 : '0'
        	    , "cstrUprc" : cstrUprc
                , "cstrCost" : (cblnwLnCst != '' && cblnwLnCst !='0') ? parseInt(cblnwLnCst)*10000 : '1000000'
                , "erpUsgCd" : ( erpUsg.length <1 ) ? '' : erpUsg[0].value    // 용도
                , "openYm" : nullToEmpty(accessDemandInfo.openYm) != '' ? accessDemandInfo.openYm : defaultOpenYm
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
    	$.each(demdBizInvestTypeInfo, function(cIdx, demdBizInvestTypeList){				
				if(demdBizDivDetlCd === demdBizInvestTypeList.cd){
					investType = demdBizInvestTypeList.cdNm;
				}
		});

    	//console.log(investType);
    	var checkDemdBizInvestTypeInfoMsg = "";
    	// 장비인경우
    	if (nullToEmpty(investType) == '102001') {
        	// 선로정보 체크
        	var lnList = AlopexGrid.currentData( $('#'+gridLn).alopexGrid("dataGet") );
    		if (lnList.length > 0) {
    			//checkDemdBizInvestTypeInfoMsg = makeArgMsg('demdBizInvestTypeInfo', demandMsgArray['equipment']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd', demandMsgArray['equipment'], demandMsgArray['lnAndconducltLine']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다. <br>{1}정보를 삭제해 주세요.
    	    	//console.log(checkDemdBizInvestTypeInfoMsg);
    		}
    	} // 선로인 경우 
    	else if (nullToEmpty(investType) == '102002') {
        	// 장비취득
        	var eqpList = AlopexGrid.currentData( $('#'+gridEqp).alopexGrid("dataGet") );
    		if (eqpList.length > 0) {
    			//checkDemdBizInvestTypeInfoMsg = makeArgMsg('demdBizInvestTypeInfo',demandMsgArray['lnAndconducltLine']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
    			checkDemdBizInvestTypeInfoMsg = makeArgMsg('donotChangeDemdBizCd',demandMsgArray['lnAndconducltLine'], demandMsgArray['equipment']); // 선택하신 사업구분(세부)는 {0}만 등록할 수 있습니다.
    	    	//console.log(checkDemdBizInvestTypeInfoMsg);
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
    	
    	//기본정보 체크
    	var dataParam =  $("#detailForm").getData();    	
    	// 사업구분(대)
    	if (nullToEmpty(dataParam.demdBizDivCdPop) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#demdBizDivCdPop').focus();
        			return false; 	/*사업구분(대)를 선택해 주세요.*/	
        		}
    		});
    		return false; 
    	}
    	// 사업구분(세부)
    	if (nullToEmpty(dataParam.demdBizDivDetlCdPop) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['businessDivisionDetl']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#demdBizDivDetlCdPop').focus();
        			return false;  /*사업구분(세부)를 선택해 주세요.*/ 
        		}
    		});
    		return false; 
    	}
    	// 사업명
    	if (nullToEmpty(dataParam.bizNm) == '') {
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
    	// 본사담당자
    	if (nullToEmpty(dataParam.hdqtrChrgUserId) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['headquartersThePersonInCharge']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#hdqtrChrgUserId').focus();
        			return false; 	/*본사담당자를 선택해 주세요.*/
        		}
    		});
    		return false; 
    	}
    	// 지역담당자
    	/*if (nullToEmpty(dataParam.areaChrgUserId) == '') {
    		callMsgBox('', 'W', makeArgMsg('selectObject',demandMsgArray['areaThePersonInCharge']), function(msgId, msgRst){
        		if (msgRst == 'Y') { 
        			$('#areaChrgUserId').focus();
        			return false; 	지역담당자를 선택해 주세요."
        		}
    		});
    		return false;   	
    	}*/
    	
    	// 사업구분(대)에 따른 장비 선로 투자구분 입력 체크
    	if (demdBizInvestTypeInfo == null || demdBizInvestTypeInfo.length == 0) {
    		//console.log(demdBizInvestTypeInfo.length);
    		getDemdBizInvestTypeInfo('check', nullToEmpty(dataParam.demdBizDivDetlCdPop));
    		return false;
    	} else {
    		//console.log("demdBizInvestTypeInfo.length:",demdBizInvestTypeInfo.length);
    		// 장비선로 등록가능여부 체크
    		var checkDemdBizInvestTypeInfoMsg = checkDemdBizInvestTypeInfo(dataParam.demdBizDivDetlCdPop.toString());
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
        for (var i = 0 ; i < eqpList.length ; i++ ) {
    		eqpData = eqpList[i];
    		//console.log(eqpData);
    		
    		// A망확정수요인 경우    		
    		if (nullToEmpty($('#acsnwPrjIdPop').val())!= '') {
	        	if (nullToEmpty(eqpData.intgFcltsCd) == '' || nullToEmpty(eqpData.intgFcltsNm) == '') {
	        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['integrationFacilitiesName']); /*"장비정보 " + (i+1) + "번째줄의 통합시설명은 필수입니다.";*/ 
	        		chkResult = false; break;		
	        	}
	        	if (nullToEmpty(eqpData.intgFcltsBonbu) != nullToEmpty($('#erpHdofcCdPop').val()) ) {
	        		chkMsg = makeArgMsg('requiredSameHdofc', demandMsgArray['equipment'], (i+1));  /*"장비정보 " + (i+1) + "번째줄의 통합시설의 본부와 수요의 본부가 다릅니다."*/
	        		chkResult = false;	 break;	
	        	}			
    		}
    		
        	if (nullToEmpty(eqpData.sclDivCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['smallClassification']);/*"장비정보 " + (i+1) + "번째줄의 소분류는 필수입니다."; */
        		chkResult = false; break;
        	}
        	if (nullToEmpty(eqpData.eqpTypCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['equipmentType']);/*"장비정보 " + (i+1) + "번째줄의 장비Type은 필수입니다.";*/ 
        		chkResult = false; break;		
        	}
        	if (nullToEmpty(eqpData.detlCstrDivCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['cstrTyp']);/*"장비정보 " + (i+1) + "번째줄의 공사유형은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.eqpCnt)+"" == '' || parseInt(nullToEmpty(eqpData.eqpCnt)) <= 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['equipmentSetCount']);/*"장비정보 " + (i+1) + "번째줄의 장비식수는 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.mtrlUprc)+"" == '' || parseInt(nullToEmpty(eqpData.mtrlUprc)) < 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['materialUnitPrice']);
        		/*"장비정보 " + (i+1) + "번째줄의 물자단가는 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.mtrlUprc).toString().length > 12) {
        		chkMsg = makeArgMsg('maxLengthListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['materialUnitPrice'], '12');/*"장비정보 " + (i+1) + "번째줄의 물자단가는 12자리 이내의 숫자만 입력 가능합니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.cstrCost)+"" == '' || parseInt(nullToEmpty(eqpData.cstrCost)) < 0) {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['constructionCost']);/*"장비정보 " + (i+1) + "번째줄의 공사비는 필수입니다."; */
        		chkResult = false; break;	
        	}
        	if (nullToEmpty(eqpData.systmNo).toString().length > 5) {
        		chkMsg = makeArgMsg('maxLengthListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['systemNumber'], '5');/*"장비정보 " + (i+1) + "번째줄의 시스템번호는 5자리 이내의 숫자만 입력 가능합니다."; */
        		chkResult = false; break;
        	}
//        	
//        	if (nullToEmpty(eqpData.openYm) == '') {
//        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['equipment'], (i+1), demandMsgArray['openMonth']);/*"장비정보 " + (i+1) + "번째줄의 개통월은 필수입니다.";*/ 
//        		chkResult = false; break;	
//        	}
    	}
    	if (chkResult == false) {
    		alertBox('W',chkMsg);
    		return false;
    	}
    	
    	// 자재정보 체크
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

    		matlInfoMsg = makeArgMsg('demandMaterialsCheckMsg', mtlData.demdEqpMdlNm, mtlData.eqpTypNm, mtlData.mtrlKndNm, mtlData.eqpMatlNm);   /*<< 모델명(장비)모델의 자재명(물자종류) >>*/
    		demdCnt = parseInt(nullToEmpty(mtlData.demdCnt) == '' ? 0 : mtlData.demdCnt);   

    		// 원 재고 사용수량
    		orgInveUseQuty = parseInt(nullToEmpty(mtlData.orgInveUseQuty) == '' ? 0 : mtlData.orgInveUseQuty); 
    		if (nullToEmpty(mtlData.inveUseQuty)+"" == '' ) {
    			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['inventoryUseQuantity']);/*matlInfoMsg + " 필수 입력 항목입니다.[재고사용수량]"; */
        		chkResult = false; break;
        	}
        	
        	inveUseQuty = parseInt(mtlData.inveUseQuty);
        	if (demdCnt < inveUseQuty) {
        		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], demandMsgArray['needQuantity']);/*" 재고사용수량은 필요수량을 초과할 수 없습니다.";*/ 
        		chkResult = false; break;		
        	}
        	
        	inveTotCnt = parseInt(nullToEmpty(mtlData.inveTotCnt) == '' ? 0 : mtlData.inveTotCnt);
        	// 수요 재고 사용수량
        	demdTotCnt = parseInt(nullToEmpty(mtlData.demdTotCnt) == '' ? 0 : mtlData.demdTotCnt);

        	if (demdTotCnt < 0) {
        		demdTotCnt = 0;
        	}
        	/*demdTotCnt = demdTotCnt - orgInveUseQuty;
        	if (demdTotCnt < 0) {
        		demdTotCnt = 0;
        	}*/
        	
        	// 재고사용수량이 0보다 작은경우
        	unUseInveCnt = (inveTotCnt - demdTotCnt);
        	if (unUseInveCnt < 0) {
        		unUseInveCnt = 0;
        	}
        	

        	if (unUseInveCnt < (inveUseQuty-orgInveUseQuty)) {
        		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['totalInventoryQuantity'] +'-'+demandMsgArray['planDemandInventoryUseQuantity'] +')');/*" 재고사용수량은 재고 사용가능수량(총재고수량 - 계획수요재고자재사용수량)을 초과할 수 없습니다."; */
        		chkResult = false; break;
        	}
        	
        	if (((inveTotCnt - demdTotCnt) < 0) && ((inveTotCnt - demdTotCnt) < (inveUseQuty - orgInveUseQuty)) && inveUseQuty != 0) {
        		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['totalInventoryQuantity'] +'-'+demandMsgArray['planDemandInventoryUseQuantity'] +')');/*" 재고사용수량은 재고 사용가능수량(총재고수량 - 계획수요재고자재사용수량)을 초과할 수 없습니다."; */
        		chkResult = false; break;
        	}

    		if (nullToEmpty(mtlData.newQuty)+"" == '' ) {    			
    			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['needQuantity']);/*"필수 입력 항목입니다.[신규수량]"; */
        		chkResult = false; break;		
        	}

    		newQuty = parseInt(mtlData.newQuty);
        	if ((demdCnt - newQuty) < inveUseQuty) {
        		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['inventoryUseQuantity'], '(' + demandMsgArray['needQuantity'] +'-'+demandMsgArray['newQuantity'] +')');/*" 재고사용수량은 (필요수량-신규수량)을 초과할 수 없습니다.";*/ 
        		chkResult = false; break;
        	}
        	
        	if (demdCnt < newQuty) {
        		chkMsg = matlInfoMsg + '<br>'+ makeArgMsg('canotSpecialCount', demandMsgArray['newQuantity'], demandMsgArray['needQuantity']);/*" 신규수량은 필요수량을 초과할 수 없습니다.";*/ 
        		chkResult = false; break;
        	}

        	if ((demdCnt - inveUseQuty) < newQuty) {
        		chkMsg = matlInfoMsg + '<br>' + makeArgMsg('canotSpecialCount', demandMsgArray['newQuantity'], '(' + demandMsgArray['needQuantity'] +'-'+demandMsgArray['inventoryUseQuantity'] +')');/*" 신규수량은 (필요수량-재고사용수량)을 초과할 수 없습니다."; */
        		chkResult = false; break;	
        	}
          	
    		if (demdCnt != (inveUseQuty + newQuty) ) {    			
    			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('requiredSameCount', demandMsgArray['needQuantity'], '(' + demandMsgArray['inventoryUseQuantity'] +'-'+demandMsgArray['newQuantity'] +')');/*" 필요수량은 (재고사용수량 + 신규수량)은 같아야 합니다."; */
        		chkResult = false; break;
        	}
          	
    		if (nullToEmpty(mtlData.mtrlUprc)+"" == '' ) {
    			chkMsg = matlInfoMsg + '<br>' + makeArgMsg('required', demandMsgArray['materialUnitPrice']);/*"필수 입력 항목입니다.[물자단가]"; */
        		chkResult = false; break;
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
    		// A망확정수요인 경우 
    		if (nullToEmpty($('#acsnwPrjIdPop').val())!= '') {
	        	if (nullToEmpty(lnData.intgFcltsCd) == '' || nullToEmpty(lnData.intgFcltsNm) == '') {
	        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['integrationFacilitiesName']);  /*"선로 " + (i+1) + "번째줄의 통합시설명은 필수입니다."; */
	        		chkResult = false; break;	
	        	}
	        	if (nullToEmpty(lnData.intgFcltsBonbu) != nullToEmpty($('#erpHdofcCdPop').val()) ) {
	        		chkMsg = makeArgMsg('requiredSameHdofc', demandMsgArray['ln'], (i+1));/*"선로 " + (i+1) + "번째줄의 통합시설의 본부와 수요의 본부가 다릅니다."; */
	        		chkResult = false;	 break;	
	        	}
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
        	if (parseInt(nullToEmpty(lnData.cstrCost)) < 0) {
        		
        	}
        	else {
        		var sctnLen = ( lnData.cstrCost / 1000000 ).toFixed(1);
        		//console.log(lnData);
        		$('#'+gridLn).alopexGrid( "cellEdit", sctnLen,  { _index : {id : lnData._index.id }}, "sctnLen");
        		if(sctnLen < 1) {
        			chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['constructionCost']);
            		chkResult = false; break;	
        		}
        		//console.log("sctnLen : " + sctnLen);
        	}
        	if (nullToEmpty(lnData.erpUsgCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['usage']);/*"선로 " + (i+1) + "번째줄의 용도는 필수입니다."; */
        		chkResult = false; break;	
        	}
//        	if (nullToEmpty(lnData.openYm) == '') {
//        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['openMonth']);/*"선로 " + (i+1) + "번째줄의 개통월은 필수입니다.";*/ 
//        		chkResult = false; break;
//        	}
        	if (nullToEmpty(lnData.cstrMeansCd) == '') {
        		chkMsg = makeArgMsg('requiredListObject', demandMsgArray['ln'], (i+1), demandMsgArray['means']);/*"선로 " + (i+1) + "번째줄의 방식은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	lnTypCd = lnData.lnTypCd;
    	}
        
        
    	if (chkResult == false) {
    		alertBox('W',chkMsg);
    		return false;
    	}
    	
    	// 장비나 선로중 한가지가 있어야 함
    	if (eqpList.length == 0 && lnList.length == 0) {
    		alertBox('W', demandMsgArray['demandInformationMinCount']);/*"장비나 선로/관로 정보를 설정해 주세요."*/
    		return false;
    	}
    	return true;
    }
    
    /*
	 * Function Name : saveTransDemandInfo
	 * Description   : 저장
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  결과값
	 */
    function saveTransDemandInfo() {

    	/*$('#'+gridEqp).alopexGrid("endEdit", { _state : { editing : true }} );
    	$('#'+gridMtl).alopexGrid("endEdit", { _state : { editing : true }} );   	
    	$('#'+gridLn).alopexGrid("endEdit", { _state : { editing : true }} );*/ 
		$('#'+gridEqp).alopexGrid("endEdit"); 
		$('#'+gridMtl).alopexGrid("endEdit"); 
		$('#'+gridLn).alopexGrid("endEdit"); 
    	
    	// 데이터 체크
    	if (checkValidation() == false) {
        	$('#'+gridEqp).alopexGrid("startEdit");    	
        	$('#'+gridMtl).alopexGrid("startEdit"); 
        	$('#'+gridLn).alopexGrid("startEdit");
        	return;
    	}
    	var length = $('#'+gridLn).alopexGrid("dataGet").length;
    	var rowData = $('#'+gridLn).alopexGrid("dataGet")
//    	var cstrCost;
//    	for(var i = 0;i<length;i++){
//    		cstrCost = rowData[i].investAmt/ rowData[i].sctnLen
//    		$('#'+gridLn).alopexGrid("cellEdit", cstrCost, {_index : {row:i}}, "cstrCost");
//    	}
    	
    	// 데이터 편집
    	var dataParam =  $("#detailForm").getData();
    	// 장비
    	var eqpInsertList = AlopexGrid.trimData ( $('#'+gridEqp).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var eqpUpdateList = AlopexGrid.trimData ( $('#'+gridEqp).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var eqpDeleteList = AlopexGrid.trimData ( $('#'+gridEqp).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	

    	// 자재
    	var mtlInsertList = AlopexGrid.trimData ( $('#'+gridMtl).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var mtlUpdateList = AlopexGrid.trimData ( $('#'+gridMtl).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var mtlDeleteList = AlopexGrid.trimData ( $('#'+gridMtl).alopexGrid("dataGet", { _state : {added : false, deleted : true }} )); 	

    	// 선로
    	var lnInsertList = AlopexGrid.trimData ( $('#'+gridLn).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var lnUpdateList = AlopexGrid.trimData ( $('#'+gridLn).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	var lnDeleteList = AlopexGrid.trimData ( $('#'+gridLn).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	
    	
    	//console.log(dataParam);
    	callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){  

    		if (msgRst == 'Y') {
    			bodyProgress();
        		dataParam.gridData = { 
        				  eqpInsertList : eqpInsertList
        				, eqpUpdateList : eqpUpdateList
        				, eqpDeleteList : eqpDeleteList
      				    , mtlInsertList : mtlInsertList
      				    , mtlUpdateList : mtlUpdateList
      				    , mtlDeleteList : mtlDeleteList
      				    , lnInsertList : lnInsertList
      				    , lnUpdateList : lnUpdateList
      				    , lnDeleteList : lnDeleteList
        		};
        		
        		var sflag = {
        				  jobTp : 'saveDetailInfo'   // 작업종류
        		};
        		
        		//console.log(dataParam);
        		bodyProgress();
        		demandDetailRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/detailinfo'
        				           , dataParam
        				           , 'POST'
        				           , sflag);
    		} else {
	    		if (procStFlag == 'E') {
	    			$('#'+gridEqp).alopexGrid("startEdit");
	           		$('#'+gridMtl).alopexGrid("startEdit");
	           		$('#'+gridLn).alopexGrid("startEdit");    
	       	    }
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
    	
    	selectComboCode('bizUsgCd', 'Y', 'C00630', '');
    	    	
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
    	//lnCombo = [{value:'', text:"필수"}];  // 선로Type 초기값
    	selectErpNeComboList('SCL', 'N');  // 소구분콤보 취득
    	selectErpNeComboList('LN', 'N');  // 선로Type콤보 취득
    	eqpCombo = [{value:'', text:demandMsgArray['mandatory']}];  // 장비"필수"
    	//selectErpNeComboList('LN', 'NS');  // 선로Type
    	shpTypCombo  = [{value:'', text:demandMsgArray['select']}];  // 형상Type 초기값"선택"
    	
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
    	
    	//사업 구분(대) 콤보박스        
    	$('#demdBizDivCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if (init_div_biz_cl == $(this).val()) {
    			return;
    		}    
    		
    		init_div_biz_cl = $(this).val();
    		if($('#demdBizDivCdPop').val() != ""){
    			selectYearBizCombo('demdBizDivDetlCdPop', 'Y', $("#afeYrPop").val(), $("#demdBizDivCdPop").val(), '', 'A');	// 사업구분 소
    			// 장비/선로/형상 type 목록취득
            	if (erpNeGrpList.length == 0) {
            		selectErpNeGrpList($("#afeYrPop").val(),  $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), $('#demdBizDivCdPop').val()) ;  
            	} else {
            		changeErpNeGrpList($("#afeYrPop").val(),  $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), $('#demdBizDivCdPop').val()) ;  
            	}
            	
    		}else{
    			$('#demdBizDivDetlCdPop').empty();
    			$('#demdBizDivDetlCdPop').append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$('#demdBizDivDetlCdPop').setSelected("");
    		}

    		// 사업구분(대)에 따라 장비 선로 영역 활 성 비 활정
    		editDemandBizEqpLnArea(init_div_biz_cl);
        });  
    	        
    	//사업 구분(세부) 콤보박스        
    	$('#demdBizDivDetlCdPop').on('change',function(e) {
    		if (init_div_biz_detl_cl == $(this).val()) {
    			return;
    		}
    		
    		if(trmsDemdMgmtNo == undefined || nullToEmpty(ProcStatCd) == '105006' || nullToEmpty(ProcStatCd) == '105001'){
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
		        	if (nullToEmpty(investType) == '102001' || nullToEmpty(investType) == '') {
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
    		
    		if(this.value != ''){
    			selectBdgtAmt($("#afeYrPop").val(),$('#afeDemdDgrPop').val(),$('#erpHdofcCdPop').val(), this.value);
    			if (nullToEmpty(trmsDemdMgmtNo) == '') {
    				getChrgUserInfo();
    			}
    		}else {
    			// 예산부분 0 셋팅
   			 $('#eqpBdgtAmt').text(0);    	    
   	   	     $('#lnBdgtAmt').text(0);
   		}
    		
        }); 
    	
    	/*$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				$('#'+gridEqp).alopexGrid("viewUpdate");
    				$('#'+gridMtl).alopexGrid("viewUpdate");
    				break;
    			case 1 :
    				$('#'+gridLn).alopexGrid("viewUpdate");
    				break;
    			default :
    				break;
    		}
    	});*/
    	
        $('#btn_save').on('click', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	saveTransDemandInfo();
        });
                
        // 본사 담당자 지정 클릭시
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
     // 링사용율 클릭시
        $('#btn_ring').on('click', function(e) {
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
            	title: demandMsgArray['ringUseRate'],   /*링사용률*/
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
        
        // 포트사용율 클릭시
        $('#btn_port').on('click', function(e) {
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
            	title: demandMsgArray['portUseRate'],   /*링사용률*/
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
        	calEqpInvestAmt(); 
			selectBdgtAmt($('#afeYrPop').val(), $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), $('#demdBizDivDetlCdPop').val());
        });
        

        $('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				$('#'+gridEqp).alopexGrid("viewUpdate");
    				$('#'+gridMtl).alopexGrid("viewUpdate");
    				break;
    			case 1 :
    				$('#'+gridLn).alopexGrid("viewUpdate");
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

        	if ($('#demdBizDivCdPop').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig'])); /*"사업구분(대)를 선택해 주세요.");*/
        		return;
        	}

        	if (erpNeGrpList.length == 0) {
        		selectErpNeGrpList($('#afeYrPop').val(),  $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), $('#demdBizDivCdPop').val()) ;  
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
		 	// $('#'+gridEqp).alopexGrid( "cellEdit", "TA",  { _index : {row : rowIndex }}, "sclDivCd");
        	var currData = AlopexGrid.currentData($('#'+gridEqp).alopexGrid('dataGet', { _index : {data : rowIndex }}));
        	getEqpMdlMatl(currData);

			$('#'+gridEqp).alopexGrid("focusCell", { _index : {data : rowIndex }}, "eqpCnt" );
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

        // 장비 그리드 클릭시
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
            	calEqpInvestAmt();  
        	}
        	
        	if($cell && data && data._index.id && mapping && (mapping.key === 'demdEqpMdlCd')) {
        		var currData = AlopexGrid.currentData($('#'+gridEqp).alopexGrid('dataGet', { _index : {id: ev.data._index.id}}));
        		//console.log(currData);			
				//currData = AlopexGrid.trimData(currData);
				getEqpMdlMatl(currData);
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
            	calEqpInvestAmt();  
         	}
         });
        

        /*******************************
         *  자재 그리드 이벤트
         *******************************/
        // 자재 데이터셋후
        $('#'+gridMtl).on('dataSetEnd', function(e) {
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
        	// $('#'+gridEqp).alopexGrid( "rowSelect", { _index : {data : rowIndex }}, true);
        	//console.log(object);
        	
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
        	calEqpMtrlUprc(object.datalist[0].trmsDemdEqpSrno);
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
                	calEqpMtrlUprc(trmsDemdEqpSrno);
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

                    	alertBox('W', makeArgMsg('demandOverMaxValue', '('+demandMsgArray['totalInventoryQuantity'] +'-'+ demandMsgArray['planDemandInventoryUseQuantity']+')'));/*"(총 재고수량- 계획수요재고수량)을 초과했습니다."*/
        			} 
        			// 재고수량-계획수량 < 0
        			else if ((inveTotCnt - demdTotCnt) < 0 && (inveTotCnt - demdTotCnt) < (inveUseQuty - orgInveUseQuty) && inveUseQuty != 0) {
        				inveUseQuty = 0;
                    	$('#'+gridMtl).alopexGrid('cellEdit', inveUseQuty, {_index: {row: editRow}}, 'inveUseQuty');   // 재고사용수량
                    	//inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {row: editRow}}, 'inveUseQuty'); 

                    	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                    	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 

                    	alertBox('W', makeArgMsg('demandOverMaxValue', '('+demandMsgArray['totalInventoryQuantity'] +'-'+ demandMsgArray['planDemandInventoryUseQuantity']+')'));/*"(총 재고수량- 계획수요재고수량)을 초과했습니다."*/
        			}// 필요수량 < 재고사용수량
        			else if (demdCnt < inveUseQuty) {
                    	$('#'+gridMtl).alopexGrid('cellEdit', 0, {_index: {id: ev.data._index.id}}, 'inveUseQuty');   // 재고사용수량
                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'inveUseQuty'); 
                    	inveUseQuty = parseInt(AlopexGrid.currentValue(data,  "inveUseQuty" ));
                    	//$('#'+gridMtl).alopexGrid('cellEdit', demdCnt, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                    	//$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
                    	
                    	alertBox('W', makeArgMsg('demandOverMaxValue', demandMsgArray['needQuantity']));/*"필요수량을 초과했습니다.");*/
        			} else {
        				// 신규수량에 필요수량 - 재고사용수량
        				result = demdCnt-inveUseQuty;
        				$('#'+gridMtl).alopexGrid('cellEdit', result, {_index: {id: ev.data._index.id}}, 'newQuty');   // 신규수량
                    	$('#'+gridMtl).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'newQuty'); 
        				
                		result = (result * mtrlUprc) ;
                    	$('#'+gridMtl).alopexGrid('cellEdit', setComma(result), {_index: {id: ev.data._index.id}}, 'mtrlAmt');   // 투자비  
                    	// 해당 장비의 물자비 수정
                    	calEqpMtrlUprc(trmsDemdEqpSrno);
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
        				
                    	alertBox('W', makeArgMsg('demandOverMaxValue', demandMsgArray['needQuantity']));/*"필요수량을 초과했습니다.");*/
                    	// 해당 장비의 물자비 수정
                    	calEqpMtrlUprc(trmsDemdEqpSrno);
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
            	calEqpMtrlUprc(trmsDemdEqpSrno);
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
			selectBdgtAmt($('#afeYrPop').val(), $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), $('#demdBizDivDetlCdPop').val());
        });  
        
        // 선로 그리드 더블클릭시 편집
        $('#'+gridLn).on('dblclick', '.bodycell', function(e) {
        	if (procStFlag != "E") {
        		return;
        	}
        	var object = AlopexGrid.parseEvent(e);       	
        	$('#'+gridLn).alopexGrid( "startEdit", { _index : {id : object.data._index.id }});
        });
        		 
		 // 데이터 추가후 편집
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

        	if ($('#demdBizDivCdPop').val()  == '' ) {
        		alertBox('W', makeArgMsg('selectObject',demandMsgArray['businessDivisionBig'])); /*"사업구분(대)를 선택해 주세요.");*/
        		return;
        	}

        	if (erpNeGrpList.length == 0) {
        		selectErpNeGrpList($('#afeYrPop').val(),  $('#afeDemdDgrPop').val(), $('#erpHdofcCdPop').val(), $('#demdBizDivCdPop').val()) ;  
        	} 
        	
        	var lnDataList = AlopexGrid.trimData($('#'+gridLn).alopexGrid("dataGet"));
        	/*if (lnDataList.length >= 2) {
        		alertBox('W', demandMsgArray['demandLineInformationMaxCount']);"선로/관로는 광케이블 혹은 광관로 각각 1개씩만 등록할 수 있습니다.";
        		return;
        	}*/
        	var lnTypCd = "T01";
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
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		$('#'+gridLn).alopexGrid("dataDelete", {_index : { data:rowIndex }});

        	}  

        	calLnInvestAmt(); 
        });
		 
		// 선로 그리드 클릭시
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
        		
        		sctnLen = (AlopexGrid.currentValue(data,  "sctnLen" ) == '' ? 0 : AlopexGrid.currentValue(data,  "sctnLen" ));
        		
        		cstrCost = parseInt(AlopexGrid.currentValue(data,  "cstrCost" ) == '' ? 0 : AlopexGrid.currentValue(data,  "cstrCost" ));
        		/*if (sctnLen == 0) {
        			cstrUprc = cstrCost;
        		} else {
            		cstrUprc = parseInt((cstrCost / sctnLen) + 0.5);
        		}*/
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
	};
	
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
    			
    			if(ProcStatCd == "105003")					return false;
    			
       			openSisulListPopup(gridId, data.intgFcltsCd);
    		}
    	}
    	if (gridId == gridEqp) {
        	if ( data._state.focused) {
        		setFilterMtlGrid(data.trmsDemdEqpSrno);
    		} 
    	}
    };
    
	
    /*
	 * Function Name : successDemandDetailCallback
	 * Description   : 각 이벤트 성공시 처리 로직
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function successDemandDetailCallback(response, flag){
    	// 저장
    	if (flag.jobTp == "saveDetailInfo") {
    		bodyProgressRemove();
    		if (response.result.code == "OK") {
    				/* 저장을 완료 하였습니다. */
				callMsgBox('', 'I', demandMsgArray['saveSuccess'], function() {
					$a.close(true);  
    			});
    		}
    	} 
    	// 기본정보 셋팅
    	else if (flag.jobTp =="baseInfo") {    		
    		setBaseInfo (response) ;    		
    	} 
    	// 장비정보 셋팅
    	else if (flag.jobTp== "eqpInfo") {    		
    		setEqpInfo (response);
    	}  
    	// 자재정보 셋팅
    	else if (flag.jobTp== "mtlInfo") {    		
    		setMtlInfo (response);
    	}   
    	// 자재정보초기셋팅
    	else if (flag.jobTp == "eqpMdlMatl") {
    		hideProgress(gridMtl);
    		if (response.eqpMdlMatlList.length > 0) {
		    	// 자재 그리드에 모델 자재셋 정보 셋팅 
		    	$('#'+gridMtl).alopexGrid("dataAdd", response.eqpMdlMatlList);
		    	// 해당 장비의 자재만 보이도록 필터링
		    	setFilterMtlGrid(response.eqpMdlMatlList[0].trmsDemdEqpSrno);
    		}
    	} 
    	// 선로정보 셋팅
    	else if (flag.jobTp== "lnInfo") {   
    		if (response.lnInfoList.length > 0) {
	    		// 선로 그리드에 건물 정보 셋팅 
		    	$('#'+gridLn).alopexGrid("dataSet", response.lnInfoList);
		    	
		    	var dataList = AlopexGrid.trimData( $('#'+gridLn).alopexGrid("dataGet") );
		    	
		    	maxTrmsDemdLnSrno = dataList[0].maxTrmsDemdLnSrno;
		    	maxTrmsDemdLnSrno *= 1;
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
    	// 통합시설검색
    	else if (flag.jobTp == "sisulNm") {    	
    		var focusData = $('#'+flag.grid).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
    		var intgFcltsCd = response.intgFcltsCd;
    		var erpIntgFcltsNm = response.erpIntgFcltsNm;
    		var intgFcltsBonbu = response.plntCd;
    		var tmofNm = response.tmofNm;
    		var lnTypCd = focusData[0].lnTypCd;
    		
    		$('#'+flag.grid).alopexGrid( "cellEdit", intgFcltsCd, {_index : { row : rowIndex}}, "intgFcltsCd");
    		$('#'+flag.grid).alopexGrid( "cellEdit", erpIntgFcltsNm, {_index : { row : rowIndex}}, "intgFcltsNm");
    		$('#'+flag.grid).alopexGrid( "cellEdit", intgFcltsBonbu, {_index : { row : rowIndex}}, "intgFcltsBonbu");
    		$('#'+flag.grid).alopexGrid( "cellEdit", tmofNm, {_index : { row : rowIndex}}, "tmofNm");
    		
        }
    	// 사용자 검색 
    	else if (flag.jobTp == "userId") {
 			 var userId = response.userId;
    	     var userNm = response.userNm;
    	     $('#' + flag.objId + 'Id').val(userId);    	    
    	     $('#' + flag.objId + 'Nm').text(userNm);
 				
        } 
    	// 예산설정
    	else if (flag.jobTp == "bdgtAmt") {
	   	     $('#eqpBdgtAmt').text(response.eqpBdgtAmt == null ? 0 : setComma(response.eqpBdgtAmt));    	    
	   	     $('#lnBdgtAmt').text(response.lnBdgtAmt == null ? 0 : setComma(response.lnBdgtAmt));
    	}
    	// 장비/선로/형상 type 콤보조회 
    	else if (flag.jobTp == "erpNeGrpList") {
    		// 장비/선로/형상type 리스트
    		erpNeGrpList = response.erpNeGrpList;
    		if (erpNeGrpList.length == 0) {
    			return;
    		}    		
    		// 장비type목록
    		eqpCombo = response.eqpCombo;
    		// 형상type목록
    		shpTypCombo = response.shpTypCombo;

    		//console.log(eqpCombo);
    		//console.log(shpTypCombo);
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
    		// 장비/선로/형상type 리스트
    		if (procStFlag != 'E') {
    			return;
    		}
    		
    		erpNeGrpList = response.erpNeGrpList;
    		   		
    		// 장비type목록
    		eqpCombo = response.eqpCombo;
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
        	  			if (eqpCombo[obj.sclDivCd] && eqpCombo[obj.sclDivCd].length > 0) {
	        	  			$.each(eqpCombo[obj.sclDivCd], function(cIdx, eqpComboList){
	        	  				
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
        	    	}else {
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
    		// 장비모델 목록
    		eqpMdlCombo = response.eqpMdlCombo;    		
    	} 
    	// 모델자재 재고 취득
    	else if (flag.jobTp == "matlInveTotCnt") {
    		// 장비모델 목록
    		var inveTotCnt = 0;
    		if (response.matlInveTotCnt.length > 0) {
    			inveTotCnt = response.matlInveTotCnt[0].inveTotCnt
    		}
    		$('#'+gridMtl).alopexGrid( "cellEdit", setComma(inveTotCnt),  { _index : {row : flag.rowIndex }}, "inveTotCnt"); 
    		
    	} 
    	// 계획수요중 자재재고사용총 취득
    	else if (flag.jobTp == "demandMatlInveUseTotCnt") {
    		// 장비모델 목록
    		var demdTotCnt = 0;
    		if (response.demandMatlInveUseTotCnt.length > 0) {
    			demdTotCnt = response.demandMatlInveUseTotCnt[0].demdTotCnt
    		}
    		$('#'+gridMtl).alopexGrid( "cellEdit", setComma(demdTotCnt),  { _index : {row : flag.rowIndex }}, "demdTotCnt"); 
    	} 
    	// 공통콤보 및 소구분, 선로 Type 
    	else if (flag.jobTp == "combo") {     		
    		var returnArray = null;
    		if(flag.allYn == 'Y'){
    			returnArray = [{value:'', text:demandMsgArray['all']}];/*"전체"*/
    		}else if(flag.allYn == 'S'){
    			returnArray = [{value:'', text:demandMsgArray['select']}];/*선택"*/
    		}else if(flag.allYn == 'NS'){
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
    					saveTransDemandInfo();
    				}
    			} else {
    	    		// 사업구분(대)에 따라 장비 선로 영역 활 성 비 활정
    	    		editDemandBizEqpLnArea(init_div_biz_detl_cl);
    			}
    		}
    	} 
    }
    
    /*
	 * Function Name : failDemandDetailCallback
	 * Description   : 각 이벤트 실패시 처리 로직
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  
	 */
    function failDemandDetailCallback( response, flag){
		bodyProgressRemove();
		var returnMsg = nullToEmpty(response.message);
		if (returnMsg == 'undefined' || returnMsg == '' || returnMsg.length > 100) {
			returnMsg = demandMsgArray['systemError'];
		}
    	if (flag.jobTp == "saveDetailInfo") {
    		alertBox('W', returnMsg);
    		return;
    	} else if (flag.jobTp== "mtlInfo") { 
    		hideProgress(gridMtl);
    		alertBox('W',  demandMsgArray['failSearchDemandMatlInfo']);
    	}   
    	// 자재정보초기셋팅
    	else if (flag.jobTp == "eqpMdlMatl") {
    		hideProgress(gridMtl);
    		alertBox('W',  demandMsgArray['failSearchDemandMatlInfo']);
    	} 
    	// 사업구분(대) 취득
    	else if(flag.jobTp  == 'demdBizInvestTypeInfo') {
			if (flag.callType == 'check') {
				alertBox('W', demandMsgArray['failDemandBizInvestTypeInfo']);   // 사업구분(대)의 투자구분정보 취득에 실패했습니다.
				return;
			}
    	}
    	else {
    		alertBox('W',  returnMsg);
    		return;
    	}
    	return;
    }
    
});