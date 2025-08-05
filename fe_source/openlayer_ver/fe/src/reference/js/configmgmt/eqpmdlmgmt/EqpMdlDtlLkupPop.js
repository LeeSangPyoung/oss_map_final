/**
 * CardMdlDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGridCardMdl';
//	var aftlGridId = 'dataGridAtfl';
	var aftlData = {};

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	aftlData = param;
    	initGrid();
        setEventListener();
        setRegDataSet(param);
        $('#'+gridId).alopexGrid('showProgress');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlMgmt', param, 'GET', 'eqpMdlDtlLkupInf');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlAtflUladInf', param, 'GET', 'eqpMdlAtflUladInf');
    };

function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"5row",
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'] ,
				width: '50px',
				numberingColumn: true
    		}, {/* 카드모델ID--숨김데이터		 */
				key : 'cardMdlId', align:'center',
				title : configMsgArray['cardModelIdentification'],
				width: '100px'
			}, {/* 카드모델명		 */
				key : 'cardMdlNm', align:'center',
				title : configMsgArray['cardModelName'],
				width: '150px'
			}, {/* 제조사ID--숨김데이터		 */
				key : 'bpId', align:'center',
				title : configMsgArray['vendorIdentification'],
				width: '100px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '120px'
			}, {/* 카드모델유형코드--숨김데이터	 */
				key : 'cardMdlTypCd', align:'center',
				title : configMsgArray['cardModelTypeCode'],
				width: '130px'
			}, {/* 카드모델유형	 */
				key : 'cardMdlTypNm', align:'center',
				title : configMsgArray['cardModelType'],
				width: '130px'
			}, {/* 카달로그ID		 */
				key : 'cardCtlgId', align:'center',
				title : configMsgArray['catalogIdentification'],
				width: '100px'
			}, {/* 카드용량코드1     */
				key : 'cardCapaCd1', align:'center',
				title : configMsgArray['cardCapacityCode']+'1',
				width: '105px'
			}, {/* 포트수 	1	 */
				key : 'portCnt1', align:'center',
				title : configMsgArray['portCount']+'1',
				width: '100px'
			}, {/* 카드용량코드2     */
				key : 'cardCapaCd2', align:'center',
				title : configMsgArray['cardCapacityCode']+'2',
				width: '105px'
			}, {/* 포트수 	2	 */
				key : 'portCnt2', align:'center',
				title : configMsgArray['portCount']+'2',
				width: '100px'
			}, {/* 카드용량코드3	 */
				key : 'cardCapaCd3', align:'center',
				title : configMsgArray['cardCapacityCode']+'3',
				width: '105px'
			}, {/* 포트수 	3	 */
				key : 'portCnt3', align:'center',
				title : configMsgArray['portCount']+'3',
				width: '100px'
			}, {/* 카드모델첨부파일명 */
				key : 'cardMdlAtflNm', align:'center',
				title : configMsgArray['cardModelAttachedFileName'],
				width: '120px'
			}, {/* UKEY슬롯카드종류 */
				key : 'ukeySlotCardKndCd', align:'center',
				title : configMsgArray['ukeySlotCardKind'],
				width: '130px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    function gridHide() {

    	var hideColList = ['cardMdlId', 'bpId', 'cardMdlTypCd', 'cardMdlAtflNm', 'cardCtlgId'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setRegDataSet(data) {
    	$('#eqpMdlDtlLkupForm').setData(data);
    	if(data.eqpMdlDtlYn != "Y"){
    		$('#btnEqpMdlDtlPort').setEnabled(false);
    	}
    	search();
    }

    function setEventListener() {

	    	//목록
	   	 $('#btnPrevLkup').on('click', function(e) {
	   		$a.close();
         });

    	 /*$('#eqplist').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.navigate($('#ctx').val()+'/configmgmt/equipment/EqpInfMgmt.do');
         });*/

    	 $('#eqplist').on('click', function(e) {
    		 var param =  $("#eqpMdlDtlLkupForm").getData();
    		 param.closeYn = "N";
    		 $a.popup({
    	          	popid: 'EqpLkup',
    	          	title: configMsgArray['findEquipment'],
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.83
    	      });
         });

    	//파장/포트내역
	   	 $('#btnEqpMdlDtlPort').on('click', function(e) {
	   		var param =  $("#eqpMdlDtlLkupForm").getData();
//    	 popupList('EqpMdlDtlPortPop', '/tango-transmission-web/configmgmt/eqpmdlmgmt/EqpMdlDtlPortPop.do', configMsgArray['wavelengthPortDetails'], param);
	   		$a.popup({
    			popid: 'EqpMdlDtlPortPop',
    			title: configMsgArray['wavelengthPortDetails'],
    			url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/EqpMdlDtlPortPop.do',
    			data: param,
    			windowpopup : true,
    			modal: true,
    			movable:true,
    			width : 1200,
                height : window.innerHeight * 0.7,

    			callback: function(data) {

			      }
    		});

         });


    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	eqpMdlDel();
  		        }
  		      });
         });



    	//수정
    	 $('#btnModLkup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#eqpMdlDtlLkupForm").getData();
    		param.regYn = "Y";

    		$a.popup({
 	          	popid: 'EqpMdlMod',
 	          	title: '장비 모델 수정',
 	            url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/EqpMdlMod.do',
 	            data: param,
 	           windowpopup : true,
 	           modal: true,
 	           movable:true,
 	            width : 865,
 	           	height : 350,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	           	 if (data != null){
 	           		 	$('#'+gridId).alopexGrid('showProgress');
 	           		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlMgmt', data, 'GET', 'eqpMdlDtlLkupInf');
// 	           			httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlAtflUladInf', data, 'GET', 'eqpMdlAtflUladInf');
 	           	 	}
 	           	}
    		});

         });

    	 $('#fileDownBtn').on('click', function(e) {

    		var dataObj = aftlData;


    		if(dataObj == undefined || dataObj == 'undefined' || dataObj == '' || dataObj == null) {
    			callMsgBox('','I', '파일이 없습니다.' , function(msgId, msgRst){});
    			return;
    		}

 			var $form=$('<form></form>');
 			$form.attr('name','downloadForm');
 			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/downloadfile");
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

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	function search(){
		$('#pageNoDtlLkup').val(1);
    	$('#rowPerPageDtlLkup').val(100);
    	var param =  $("#eqpMdlDtlLkupForm").getData();
    	$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/cardMdlForEqpMdl', param, 'GET', 'search');
	}

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.cardMdlForEqpMdl);
    	}

    	if(flag == 'eqpMdlDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		 });
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();

            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}

    	if(flag == 'eqpMdlDtlLkupInf') {
    		$('#eqpMdlDtlLkupForm').formReset()
    		$('#eqpMdlDtlLkupForm').setData(response.eqpMdlMgmt[0]);


    		if (response.eqpMdlMgmt[0].atflSrno !== undefined && response.eqpMdlMgmt[0].atflSrno !== null){
    			var param = {eqpMdlId : response.eqpMdlMgmt[0].eqpMdlId, atflSrno : response.eqpMdlMgmt[0].atflSrno };
    		} else {
    			var param = {eqpMdlId : response.eqpMdlMgmt[0].eqpMdlId};
    		}






    		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlAtflUladInf', param, 'GET', 'eqpMdlAtflUladInf');

    	}

    	if(flag == 'eqpMdlAtflUladInf'){
    		$('#'+gridId).alopexGrid('hideProgress');


    		var nSize = response.eqpMdlAtflUladInf.length;


    		if(nSize > 0) {
    			aftlData = response.eqpMdlAtflUladInf[nSize-1];
    			$('#eqpMdlDtlLkupForm').setData(aftlData);
    		} else {
    			aftlData = null;
    		}





//    		if(nSize == 0) {
//    			aftlData.atflSrno = '';
//    			aftlData.atflNm = '';
//    			aftlData.atflSaveNm = '';
//    			aftlData.atflPathNm = '';
//    			$('#eqpMdlDtlLkupBottomForm').setData(aftlData);
//    		} else {
//
//    	}

		}

    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlDel'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpMdlDel() {
   	 	var eqpMdlId =  $("#eqpMdlId").val();

   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/deleteEqpMdlInf/'+eqpMdlId, null, 'POST', 'eqpMdlDel');

   }

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

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9

              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7,

              });
        }

   /* var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
});