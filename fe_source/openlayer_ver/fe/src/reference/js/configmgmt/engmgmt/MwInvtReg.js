/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점

	var gridId = 'dataGrid';
	var paramData = null;
	var delData = [];
	var afeYrData = [];
	var afeYrDgrData = [];
	var afeDgrData = [];
	var spclMtrCttData = [];

	$a.setup('multiSelect', {
		minWidth : '100',
		menuWidth : '180'

	});

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = null;


    	if(param.regYn == "Y"){
    		paramData = param;
//    		initGrid();
    	}
//    	else {
//    		$('#btnUpload').hide();
//    		$('#btnUploadDel').hide();
//    	}
    	initGrid();
        setEventListener();

        setSelectCode();
//        setRegDataSet(param);

    };

    function initGrid() {

    		var mappingN =  [{align : 'center', title : 'No.', width: '20px', resizing: false, numberingColumn : true},
    								{align:'center', title : 'MW일련번호', key: 'mwSrno', width: '100px'},
									{align:'center', title : '파일명', key: 'atflNm', width: '80px'},
									{align:'center', title : '등록일', key: 'frstRegDate', width: '50px'},
									{align:'center', title : '등록자', key: 'frstRegUserId', width: '50px'},
									{align:'center', title : '첨부 파일', key: 'atflSrno', width: '30px',
										render : function(value, data, render, mapping){
											if(value != null){
												return '<button class="Valign-md" id="fileDownBtn" type="button" style="cursor: pointer"><span class="icoonly ico_attachment"></span></button>';
											}
										},
										tooltip : function(value, data, render, mapping){
											return data.atflNm;
										}
									}];

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	width : 'parent',
			height : '2row',
			fitTableWidth : true,
        	autoColumnIndex: true,
//    		autoResize: true,
        	pager:false,
    		rowSelectOption: {
			clickSelect: true,
			singleSelect : true,
			disableSelectByKey : true

		},
    		numberingColumnFromZero: false,
    		columnMapping : mappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	function gridHide() {

		var hideColList = ['mwSrno'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setRegDataSet(data) {

    	if(data.regYn == "Y"){
    		$('#mwInvtRegArea').setData(paramData);
    		AetAfweDgrList(paramData);

    	}

    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	//본부
    	var requestParam = { comGrpCd : 'C00623' };
    	httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/', requestParam, 'GET', 'org');
    	// 년도/차수
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/AFEYRDGR', null, 'GET', 'afeYrDgrList');
		//MW 주파수
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02505', null, 'GET', 'mwFreqCdReg');
		//MW 대역폭
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02506', null, 'GET', 'mwBdwhCdReg');
		//MW 변조방식
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02507', null, 'GET', 'modulMeansCdReg');
		// 용량
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'ntwkCapaCdReg');
		// 설계안 구분
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DSNDIVCD', null, 'GET', 'dsnDivValReg');
		// 내용 구분
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MWDIVCD', null, 'GET', 'spclMtrCttReg');

		if(paramData != '' && paramData != null && paramData != undefined)
			httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwAtflUladInf', paramData, 'GET', 'mwAtflUladInf');


    }

    function setEventListener() {


    	$('#ntwkLineNmPop').on('click', function(e) {

        	$a.popup({
 	          	popid: 'RingListPop',
 	          	title: '링명(도서지역) 조회',
 	            url: '/tango-transmission-web/configmgmt/cfline/RingListPop.do',
 	            data: null,
 	            windowpopup : true,
 	            modal: true,
                 movable:true,
 	            width : 950,
 	           	height : window.innerHeight * 0.83,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	           		if(data !== null){
 	           			// 링이 선택된 경우에만
		 	           	if (data.ntwkLineNo != null || data.ntwkLineNo != '' || data.ntwkLineNo != undefined) {
			 	           	var param = [];
			 	           	param = { ntwkLineNo : data.ntwkLineNo};
			 	           	httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwInvtDtlInfoList', param, 'GET', 'mwInvtDtlInfoList');
		 	           	}
 	           		}
 	           	}
    		 });
    })

        //공급사 선택
        $('#btnPrvdPop').on('click', function(e) {
	        	$a.popup({
	 	          	popid: 'PrvdPop',
	 	          	title: '공급사 조회',
	 	            url: '/tango-common-business-web/business/popup/PopupBpList.do',
	 	            data: null,
	 	            windowpopup : true,
	 	            modal: true,
	                 movable:true,
	 	            width : 950,
	 	           	height : window.innerHeight * 0.83,
	 	           	callback : function(data) { // 팝업창을 닫을 때 실행
	 	           		if(data !== null){
		    	           		$('#prvdNmReg').val(data.bpNm);
		    	           		$('#prvdId').val(data.bpId);
	 	           		}
	 	           	}
	    		 });
        })


    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg').on('click', function(e) {

    		 mwInvtReg();
         });

    	 $("#afeYrReg").on('change',function(e) {
      		var param = $("#afeYrReg").getData();

      		AetAfweDgrList (param);
    	 });

    	 $('#btnUpload').on('click', function(e) {
    		 var param =  $("#mwInvtRegArea").getData();

    		 $a.popup({
     			popid: 'MwFileUpload',
     			title: 'M/W 첨부파일 업로드',
     			url: '/tango-transmission-web/configmgmt/engmgmt/MwFileUpload.do',
     			data: param,
     			windowpopup : true,
     			modal: true,
     			movable:true,
     			width : 380,
     			height : 200,
     			callback : function(data) { // 팝업창을 닫을 때 실행

     					if (data != null) {
     						$('#'+gridId).alopexGrid('showProgress');
     						$('#mwSrno').val(data.mwSrno);
     						httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwAtflUladInf', { mwSrno : data.mwSrno}, 'GET', 'mwAtflUladInf');
     					}
 	           		}
     		});
         });


    	// 용량
    	 $('#ntwkCapaCdReg').on('keyup', function(e) {
    		 useRateCal();
    	 });

    	 //평균 트래픽
    	 $('#trfAvgValReg').on('keyup', function(e) {
    		 useRateCal();
    	 });

    	 $("#spclMtrCttReg").on('change',function(e) {
    		 var getDataList = $("#spclMtrCttReg").getData().spclMtrCtt;
    		 spclMtrCttListData(getDataList);
    	 });

    	 $('#btnUploadDel').on('click', function(e) {

    		 var selectData = $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}});
    		 if (selectData.length <= 0) {
    			 callMsgBox('','W', '삭제 대상을 선택해주세요', function(msgId, msgRst){});
    			 return;
    		 }

    		 var param =  $('#'+gridId).alopexGrid('dataGet');
    		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){

     			if (msgRst == 'Y')
     				httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/deleteMwAtflUladInf', param[0], 'GET', 'deleteMwAtflUladInf');
 			});



    	 });

    	 $('#'+gridId).on('click', '#fileDownBtn', function(e){
    		 var dataObj = AlopexGrid.parseEvent(e).data;

 			var $form=$('<form></form>');
 			$form.attr('name','downloadForm');
 			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/engmgmt/downloadfile");
 			$form.attr('method','GET');
 			$form.attr('target','downloadIframe');
 			// 2016-11-인증관련 추가 file 다운로드시 추가필요
 			// X-Remote-Id와 X-Auth-Token을 parameter로 넘기기 위한 함수(open api를 통하므로 반드시 작성)
 			$form.append(Tango.getFormRemote());
 			$form.append('<input type="hidden" name="fileName" value="'+ dataObj.atflSaveNm +'" />');
 			$form.append('<input type="hidden" name="fileOriginalName" value="'+ dataObj.atflNm +'" />');
 			$form.append('<input type="hidden" name="filePath" value="'+ dataObj.atflPathNm +'" />');
 			$form.appendTo('body');
 			$form.submit().remove();
    	 });

    	 // 숫자 형식 자동 변경
    	 $('#dsnMtrlCostAmtReg').on('keyup', function(e) {
    		 $a.maskedinput($('#dsnMtrlCostAmtReg')[0], "000,000,000,000,000", {reverse: true});

    	 });

    	 $('#realMtrlCostAmtReg').on('keyup', function(e) {
    		 $a.maskedinput($('#realMtrlCostAmtReg')[0], "000,000,000,000,000", {reverse: true});

    	 });

    	 $('#dsnInvtCostAmtReg').on('keyup', function(e) {
    		 $a.maskedinput($('#dsnInvtCostAmtReg')[0], "000,000,000,000,000", {reverse: true});

    	 });

    	 $('#realInvtCostAmtReg').on('keyup', function(e) {
    		 $a.maskedinput($('#realInvtCostAmtReg')[0], "000,000,000,000,000", {reverse: true});

    	 });



	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    if(flag == 'org'){
		$('#hdofcCdReg').clear();

		var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].cd, comCdNm: response[i].cdNm};
			option_data.push(resObj);
		}

		$('#hdofcCdReg').setData({
             data:option_data
		});
	}

    if(flag == 'afeYrDgrList'){

		$("#afeYrReg").clear();

		var afeYrData =  [{cd: "",cdNm: "전체"}];
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			afeYrData.push({cd: resObj.comCd, cdNm: resObj.comCd});
			afeYrDgrData.push({cd: resObj.comCd, cdNm: resObj.comCdNm});
		}

		$("#afeYrReg").setData({
			data:afeYrData
		});

		$("#afeDgrReg").clear();
		$("#afeDgrReg").setData({
			data:[{cd: "",cdNm: "전체"}]
		});

		 if(paramData != '' && paramData != null && paramData != undefined)
			 setRegDataSet(paramData);

	}

	if(flag == 'mwFreqCdReg'){
		$('#mwFreqCdReg').clear();
		var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
			option_data.push(resObj);
		}

		$('#mwFreqCdReg').setData({
             data:option_data
		});
	}

	if(flag == 'mwBdwhCdReg'){
		$('#mwBdwhCdReg').clear();
		var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
			option_data.push(resObj);
		}

		$('#mwBdwhCdReg').setData({
             data:option_data
		});
	}

	if(flag == 'dsnDivValReg'){
		$('#dsnDivValReg').clear();
		var option_data =  [];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
			option_data.push(resObj);
		}

		$('#dsnDivValReg').setData({
             data:option_data
		});
	}


	if(flag == 'modulMeansCdReg'){
		$('#modulMeansCdReg').clear();
		var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
			option_data.push(resObj);
		}

		$('#modulMeansCdReg').setData({
             data:option_data
		});
	}

	if(flag == 'MwInvtMgmt'){

		if(response.Result == "Success"){

			 if(delData != '' && delData != null && delData != undefined) {
				 httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mergeMwInvtMgmt', delData, 'GET', 'MwInvtMgmt');
				 delData = [];
			 }

    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    			if (msgRst == 'Y') {
    				$a.close(response.resultList);
    			}
    		});
		}
		else if (response.Result == "dupMwInvtMgmtInf") {
			callMsgBox('','I', response.ResultMessage , function(msgId, msgRst){});
		}


	}


	if(flag == 'ntwkCapaCdReg'){
		$('#ntwkCapaCdReg').clear();
		$('#capaScreValReg').clear();
		var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].capaCd, comCdNm: response[i].capaCdNm};
			option_data.push(resObj);
		}

		$('#ntwkCapaCdReg').setData({
             data:option_data
		});


		$('#capaScreValReg').setData({
            data:option_data
		});
	}

	if(flag == 'mwInvtDtlInfoList'){

		var param =  $("#mwInvtRegForm").getData();
		// 선택된 링에 대한 MW 정보 출력
		for(var i=0; i<response.length; i++){
			var resObj = response[i];

			resObj.cmptrPossCnt = resObj.cmptrUseChnlVal
			resObj.afeYr = param.afeYr
			resObj.afeDgr = param.afeDgr
			resObj.mwSrno = param.mwSrno

			if (resObj.hdofcCd == null || resObj.hdofcCd == "" || resObj.hdofcCd == undefined)
				resObj.hdofcCd = param.hdofcCd

			$('#mwInvtRegForm').formReset();
			$('#mwInvtRegForm').setData(resObj);
		}
	}

	if(flag == 'spclMtrCttReg'){
		$('#spclMtrCttReg').clear();
		var option_data =  [];

		for(var i=0; i<response.length; i++){

			var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
			option_data.push(resObj);
		}

		$('#spclMtrCttReg').setData({
             data:option_data
		});

		spclMtrCttData = option_data;
		if(paramData != '' && paramData != null && paramData != undefined) {
			var spclMtrCttList = paramData.spclMtrCtt.split('|');
			$('#spclMtrCttReg').setData({ data : option_data, spclMtrCtt :spclMtrCttList });
			spclMtrCttListData(spclMtrCttList);

		}

	}

	if(flag == 'mwAtflUladInf'){

		$('#'+gridId).alopexGrid('hideProgress');

		setSPGrid(gridId, response, response.mwAtflUladInf);
	}

	if(flag == 'deleteMwAtflUladInf'){

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwAtflUladInf', paramData, 'GET', 'mwAtflUladInf');

	}




    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    $(document).on('keypress', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
    	var _value = $(this).val();
		if (event.keyCode < 48 || event.keyCode > 57) {
			if (event.keyCode != 46) {
				return false;
			}
		}
		var _pattern = /^\d*[.]\d*$/;	// . 체크
		if(_pattern.test(_value)) {
			if(charCode == 46) {
				return false;
			}
		}

		var _pattern1 = /^\d*[.]\d{3}$/;	// 소수점 3자리까지만
		if(_pattern1.test(_value)) {
			return false;
		}
    	return true;
	});

    $.fn.formReset = function() {

    	return this.each(function() {
    		var type = this.type,
    			tag = this.tagName.toLowerCase()
    		if (tag === "form") {
    			return $(":input", this).formReset()
    		}

    		if (type === "text" || type === "password" || type == "hidden" || tag === "textarea") {
    			this.value = ""
    		}
    		else if (type === "checkbox" || type === "radio") {
    			this.checked = false
    		}
    		else if (tag === "select") {
    			this.selectedIndex = -1
    		}
    	})
    }

	$(document).on('keyup', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which :event.keyCode;
		if (charCode ==8 || charCode == 46 || charCode == 37 || charCode ==39) {
			return;
		}
		else {
			evt.target.value = evt.target.value.replace(/[^0-9\.]/g,"");
		}
	});

	function AetAfweDgrList (param) {

		afeDgrData =  [{cd: "",cdNm: "전체"}];
  		$("#afeDgrReg").clear();

  		var dgrList = null;

  		if (param.afeYr != "") {
	     		for(var i=0; i<afeYrDgrData.length; i++){
	     			if (afeYrDgrData[i].cd == param.afeYr) {
	     				dgrList = afeYrDgrData[i].cdNm.split('|');
	     				break;
	     			}
				}

	     		for(var i=0; i<dgrList.length; i++)
	     			afeDgrData.push({cd: dgrList[i], cdNm: dgrList[i]});
  		}

  		$("#afeDgrReg").setData({
 			data:afeDgrData
 		});
	}


    function mwInvtReg() {

    	var param =  $("#mwInvtRegForm").getData();

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 // 필수값 체크 확인
		 if (param.demdHdofcCd == "") {
			 callMsgBox('','W', '필수입력 항목입니다. [ 본부 ]', function(msgId, msgRst){});
			 return;
		 }
		 if (param.afeYr == "") {
			 callMsgBox('','W', '필수입력 항목입니다. [ AFE 년도 ]', function(msgId, msgRst){});
			 return;
		 }
		 if (param.afeDgr == "") {
			 callMsgBox('','W', '필수입력 항목입니다. [ AFE 차수 ]', function(msgId, msgRst){});
			 return;
		 }

		 if ($("#ntwkLineNmReg").getData().ntwkLineNm == "" || $("#ntwkLineNmReg").getData().ntwkLineNm == undefined ) {
			 callMsgBox('','W', '필수입력 항목입니다. [ 링명(도서지역) ]', function(msgId, msgRst){});
			 return;
		 }

		 var uploadData = $('#'+gridId).alopexGrid('dataGet');

		 if (uploadData.length <= 0) {
			 callMsgBox('','W', '필수입력 항목입니다. [ 첨부파일 ]', function(msgId, msgRst){});
			 return;
		 }

		 param.dsnMtrlCostAmt = $("#dsnMtrlCostAmtReg").getData().dsnMtrlCostAmt.replace(/,/g,'');
		 param.realMtrlCostAmt = $("#realMtrlCostAmtReg").getData().realMtrlCostAmt.replace(/,/g,'');
		 param.dsnInvtCostAmt = $("#dsnInvtCostAmtReg").getData().dsnInvtCostAmt.replace(/,/g,'');
		 param.realInvtCostAmt = $("#realInvtCostAmtReg").getData().realInvtCostAmt.replace(/,/g,'');



		 var spclMtrCtt = "";

		 for (var i = 0; i < param.spclMtrCtt.length; i++) {
			 spclMtrCtt = spclMtrCtt + param.spclMtrCtt[i] ;

			 if (i != param.spclMtrCtt.length-1)
				 spclMtrCtt = spclMtrCtt + '|';
		 }

		 param.spclMtrCtt = spclMtrCtt;
		 param.useYn = 'Y';
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 if(paramData != '' && paramData != null && paramData != undefined) {
			 if (paramData.regYn == 'Y') {
				 param.regYn = 'Y' ;
			 }
		 }

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mergeMwInvtMgmt', param, 'GET', 'MwInvtMgmt');

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

    var httpUploadRequest = function(surl,sdata,smethod,sflag) {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod,
	    	dataType:'json',
	    	cache: false,
	    	contentType:false,
            processData:false
    	}).done(function(response){successCallback(response, sflag);})
    	  .fail(function(response){failCallback(response, sflag);})
	}

    function useRateCal() {

    	 var buf = null;

		 buf =  $('#ntwkCapaCdReg').getData();
		 var ntwkCapaVal =buf.ntwkCapaVal;

		 buf = $('#trfAvgValReg').getData();
		 var trfAvgVal = buf.trfAvgVal;

		 var useRate = 0;

		 if (ntwkCapaVal >= 0) {

			 useRate	  = Math.round((trfAvgVal / ntwkCapaVal) * 100);

			 if (isNaN(useRate))
				 useRate = 0;

			 $('#trfUseRateValReg').val(useRate+ '%');
		 }
    }

    function spclMtrCttListData(data) {
    	 var spclMtrCttList = "";

		 for (var i=0; i< spclMtrCttData.length; i++) {
			 for (var j=0; j<data.length; j++) {

				 if (spclMtrCttData[i].comCd == data[j]) {
					 spclMtrCttList = spclMtrCttList + 'ㆍ' + spclMtrCttData[i].comCdNm;
				 }
			 }
		 }

		 $("#spclMtrCttListReg").val(spclMtrCttList);
    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

});