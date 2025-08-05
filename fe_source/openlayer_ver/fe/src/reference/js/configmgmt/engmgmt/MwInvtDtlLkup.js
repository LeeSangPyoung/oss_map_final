/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점
	var paramData = null;
	var gridId = 'dataGrid';

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = null;

    	if(param.regYn == "Y"){
    		paramData = param[0];
    	}

        setEventListener();
        initGrid();
        setRegDataSet(param[0]);
        httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwInvtMgmt', param[0], 'GET', 'mwInvtMgmt');
        $('#'+gridId).alopexGrid('showProgress');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwAtflUladInf', param[0], 'GET', 'mwAtflUladInf');

    };


    function setRegDataSet(data) {


    }

    function initGrid() {

    	var mappingN =  [{align : 'center', title : 'No.', width: '20px', resizing: false, numberingColumn : true},
								{align:'center', title : 'MW일련번호', key: 'mwSrno', width: '100px'},
								{align:'center', title : '파일경로', key: 'atflPathNm', width: '100px'},
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
    	pager:false,
		rowSelectOption: {
			clickSelect: true,
			singleSelect : true
		},
//		autoResize: true,
		numberingColumnFromZero: false,
		columnMapping : mappingN,
		message: {/* 데이터가 없습니다.      */
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
		}
    });

    gridHide();
};

	function gridHide() {

		var hideColList = ['mwSrno','atflPathNm'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setEventListener() {

    	$('#btnDelLkup').on('click', function(e) {

    		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){

    			if (msgRst == 'Y')
    				mwInvtMgmtDel();
			});

        });

    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });

    	//수정
    	 $('#btnModLkup').on('click', function(e) {

    		 var param =  $("#mwInvtDtlLkupArea").getData();
    		 param.regYn = 'Y' ;

    		 param.hdofcCd = param.hdofcCd;

    		 $a.popup({
        			popid: 'MwInvtReg',
        			title: 'M/W 투자관리 등록',
        			url: '/tango-transmission-web/configmgmt/engmgmt/MwInvtReg.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 890,
           			height : 940,
        			callback: function(data) {
//    	            	  if (data != null){
    	            		  httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwInvtMgmt', { mwSrno : param.mwSrno}, 'GET', 'mwInvtMgmt');
    	            		  $('#'+gridId).alopexGrid('showProgress');
    	            	        httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwAtflUladInf', { mwSrno : param.mwSrno}, 'GET', 'mwAtflUladInf');

//    	            	  }
    			      }
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

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

		if(flag == 'mwInvtMgmt') {
    		$('#mwInvtDtlLkupForm').formReset()
    		$('#mwInvtDtlLkupForm').setData(response.mwInvtMgmt[0]);

    	}

		if(flag == 'MwInvtMgmtDel' ){

			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
				$a.close();
			});
		}

		if(flag == 'mwAtflUladInf'){

			$('#'+gridId).alopexGrid('hideProgress');

			setSPGrid(gridId, response, response.mwAtflUladInf);
		}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }

    function mwInvtMgmtDel() {

    	var param =  $("#mwInvtDtlLkupForm").getData();

    	var userId;

    	if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }


		param.useYn = 'N';
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;

		param.dsnMtrlCostAmt = param.dsnMtrlCostAmt.replace(/,/g,'');
		param.realMtrlCostAmt = param.realMtrlCostAmt.replace(/,/g,'');
		param.dsnInvtCostAmt = param.dsnInvtCostAmt.replace(/,/g,'');
		param.realInvtCostAmt = param.realInvtCostAmt.replace(/,/g,'');

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mergeMwInvtMgmt', param, 'GET', 'MwInvtMgmtDel');
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


    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
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