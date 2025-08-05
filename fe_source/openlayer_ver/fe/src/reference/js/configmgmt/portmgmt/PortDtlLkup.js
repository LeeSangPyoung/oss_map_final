/**
 * PortDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
	//function init(id,param){

        setEventListener();
        setRegDataSet(param);

        //alert(id+":"+JSON.stringify(param));
        if(param.fromEqpMgmt == "Y"){
        	$('#fromEqpMgmt').val(param.fromEqpMgmt);
        }

        if(param.cardId != "" && param.cardId != null){
			      httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/rackShlfSlot/'+ param.eqpId +'/'+ param.cardId, null, 'GET', 'rackShlfSlot');
		    }

        //선택한 장비에 해당하는 수동등록여부 조회[20171019]
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');

    }

    function setRegDataSet(data) {

    	if (data.mgmtGrpNm == 'SKB') {		// ADAMS 수집 모델인 경우에는 수정버튼 비활성

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + data.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
//    		$('#btnPortInfCopyToPort').hide();
//    		$('#btnModDtl').hide();

    	}


      // [20171121]
      if(typeof data.portIdxNo == 'undefined') {
        data.portIdAndIdxNo = data.portId + " / ";
      } else {
        data.portIdAndIdxNo = data.portId + " / " + data.portIdxNo;
      }

      if(typeof data.stndRackNo == 'undefined') {
        data.stndPortInf = '';
      } else {
        data.stndPortInf = data.stndRackNo + "－" + data.stndShelfNo + "－" + data.stndSlotNo + "－" + data.stndSubSlotNo + "－" + data.stndPortNo;
      }

      //_[20171121]
    	$('#portDtlLkupArea').setData(data);
    }

    function setEventListener() {

    	//목록
    	 $('#btnPrevDtl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });


    	//포트관리정보
    	 $('#btnPortMgmtInf').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#portDtlLkupForm").getData();
    		 popup('PortMgmtInfReg', '/tango-transmission-web/configmgmt/portmgmt/PortMgmtInfReg.do', '포트관리정보', param);
         });

    	//포트정보복사
    	 $('#btnPortInfCopyToPort').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#portDtlLkupForm").getData();
    		 popupList('PortInfCopyReg', '/tango-transmission-web/configmgmt/portmgmt/PortInfCopyReg.do', '포트정보복사', param);
         });

    	//장비구간현황
	   	 $('#btnEqpSctnCurstLkupToPort').on('click', function(e) {
	   		var param =  $("#portDtlLkupForm").getData();
	   		popupList2('EqpSctnAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSctnAcptCurst.do',configMsgArray['equipmentSectionCurrentState'], param);
        });

		   	//네트워크현황
	   	 $('#btnNtwkLineCurstLkupToPort').on('click', function(e) {
	   		var param =  $("#portDtlLkupForm").getData();
	   		popupList2('EqpNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
        });

		   	//서비스회선현황
	   	 $('#btnSrvcLineCurstLkupToPort').on('click', function(e) {
	   		var param =  $("#portDtlLkupForm").getData();
	   		popupList2('EqpSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
        });


    	//변경이력
    	 $('#btnChgHstToPort').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#portDtlLkupForm").getData();
    		 popupList2('PortChgHstLkup', '/tango-transmission-web/configmgmt/portmgmt/PortChgHstLkup.do', '변경이력', param);
         });

    	//삭제
    	 $('#btnDelDtl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	portDel();
  		        }
  		    });
         });

    	//수정
    	 $('#btnModDtl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#portDtlLkupForm").getData();
    		param.regYn = "Y";
    		$a.popup({
 	          	popid: 'PortReg',
 	          	title: '포트 수정',
 	            //url: $('#ctx').val()+'/configmgmt/portmgmt/PortReg.do',
 	            url: '/tango-transmission-web/configmgmt/portmgmt/PortReg.do',
// 	          	url: 'PortReg.do',
 	            data: param,
 	            iframe: false,
 	            modal: true,
                movable:true,
 	            width : 865,
 	           	height : window.innerHeight * 0.9,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	           	}
    		});
    		$a.close();
//    		$(pop1).close();
         });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'PortDel') {
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

    	if(flag == 'rackShlfSlot'){
    		if(response.rackNm != " " || response.shlfNm != " " || response.slotNo != " "){
    			var rackShlfSlot = response.rackNm+"/"+response.shlfNm+"/"+response.slotNo;
    			$('#rackShlfSlot').val(rackShlfSlot);
    		}
    	}

      /* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */
      if(flag == 'eqpPortPveRegIsolYn'){
          if(response.Result == 'Y'){
              $('#btnPortInfCopyToPort').setEnabled(false);
          }
      }
      /* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */


      if(flag == 'adamsEqpMdlYn'){
  		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
  			$('#btnPortInfCopyToPort').hide();
    		$('#btnModDtl').hide();
  		}
      }
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'PortDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function portDel() {
    	var param =  $("#portDtlLkupForm").getData();

   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/deletePortInf', param, 'POST', 'PortDel');

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

                  /*
                  	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
                  */
                  //width: 1000,
                  //height: 700

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
                  height : window.innerHeight * 0.9

                  /*
                  	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
                  */
                  //width: 1000,
                  //height: 700

              });
        }

    function popupList2(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7

              });
        }

    /*var httpRequest = function(Url, Param, Method, Flag ) {
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