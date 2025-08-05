/**
 * EqpDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setEventListener();
        setRegDataSet(param);

        //선택한 장비에 해당하는 수동등록여부 조회[20171019]
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');
    };

    function setRegDataSet(data) {



    	if(data.fromE2E == 'Y'){
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', data, 'GET', 'eqpDtlInf');
    	}else{
    		if(data.mgmtGrpNm != 'SKB'){
        		$("#ukeyEqpDtl1").hide();
        		$("#ukeyEqpDtl2").hide();
        	}

    		$('#eqpDtlLkupArea').setData(data);

    		if(data.eqpRoleDivCd == '11' || data.eqpRoleDivCd == '177' || data.eqpRoleDivCd == '178' || data.eqpRoleDivCd == '182'){
        		$("#upsdDtl").show();
        		$("#btnEqpFdfReg").show();
        	}else{
        		$("#upsdDtl").hide();
        		$("#btnEqpFdfReg").hide();
        	}
    	}
    }

    function setEventListener() {

	    	//목록
	   	 $('#btnPrevLkup').on('click', function(e) {
	   		$a.close();
         });

	   //토폴로지
    	 $('#btnTopologyLkup').on('click', function(e) {
	    	 dataParam = {"eqpId" : $('#eqpId').val()};
	    	 $a.navigate($('#ctx').val()+'/configmgmt/tnbdgm/TnBdgm.do', dataParam);
         });

    	//포트관리
	   	 $('#btnPortInfMgmt').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
	   		param.dumyPortYn = "Y";
//    	 popupList('PortInfMgmtPop', '/tango-transmission-web/configmgmt/portmgmt/PortInfMgmtPop.do', '포트 현황', param);
	    	 $a.popup({
		          	popid: 'PortInfMgmtWinPop',  // [20171121]
		          	/* 포트현황		 */
		          	title: configMsgArray['portCurrentState'],
		            url: '/tango-transmission-web/configmgmt/portmgmt/PortInfMgmtWinPop.do',
		            data: param,
		            windowpopup : true,
		            modal: true,
		            movable:true,
		            width : 1200,
		            height : 650
		   	});
         });

	   	$('#btnPortInfCopy').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
	   		 popupList('PortInfCopyReg', '/tango-transmission-web/configmgmt/portmgmt/PortInfCopyReg.do', '포트정보복사', param);
	     });

	   	//장비연동정보
	   	 $('#btnEqpLnkgInfLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popup('EqpLnkgInfReg', '/tango-transmission-web/configmgmt/equipment/EqpLnkgInfReg.do', '장비 연동 정보 등록', param);
	   		$a.popup({
	          	popid: 'EqpLnkgInf',
	          	title: 'DCN정보 조회/수정',
	              url: '/tango-transmission-web/configmgmt/equipment/EqpLnkgInfRegWinPop.do',
	              data: param,
	              windowpopup : true,
	              modal: true,
	              movable:true,
	              width : 865,
	              height : 800
	          });
        });

	   	//장비관리정보--사용안함
	   	 $('#btnEqpMgmtInfLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
   		 popup('EqpMgmtInfReg', '/tango-transmission-web/configmgmt/equipment/EqpMgmtInfReg.do', '장비 관리 정보 등록', param);
        });

	   	 //장비구간현황
	   	 $('#btnEqpSctnCurstLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
   		 popupList('EqpSctnAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSctnAcptCurst.do',configMsgArray['equipmentSectionCurrentState'], param);
        });

	   	 //네트워크현황
	   	 $('#btnNtwkLineCurstLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
	   		popupList('EqpNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
        });

	   	//서비스회선현황
	   	 $('#btnSrvcLineCurstLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
   		 popupList('EqpSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
        });

	   	//변경이력
	   	 $('#btnChgHstLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
   		 popupList('EqpChgHstLkup', '/tango-transmission-web/configmgmt/equipment/EqpChgHstLkup.do', configMsgArray['changeHistory'], param);
        });

	   //형상관리정보
	   	 $('#btnShpInfMgmt').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popupList('ShpInfLkup', '/tango-transmission-web/configmgmt/shpmgmt/ShpInfLkup.do', '형상 정보 조회', param);
	   		$a.popup({
	          	popid: 'ShpInfLkup',
	          	title: configMsgArray['shapeMgmtInf'],
	            url: '/tango-transmission-web/configmgmt/shpmgmt/ShpInfLkupWinPop.do',
	            data: param,
	            windowpopup : true,
	            modal: true,
                movable:true,
	            width : 1200,
                height : 850
	   		});
        });

	   	 //FDF간편등록
      	$('#btnEqpFdfReg').on('click', function(e) {
      	var param =  $("#eqpDtlLkupForm").getData();
      	param.regYn = "Y";
      	param.portCnt = "";
   		 $a.popup({
   	          	popid: 'EqpFdfReg.do',
   	          	title: configMsgArray['fiberDistributionFrameEasyReg'],
   	            url: '/tango-transmission-web/configmgmt/equipment/EqpFdfReg.do',
   	            data: param,
   	            modal: true,
                movable:true,
                width : 550,
  	           	height : window.innerHeight * 0.55,
  	           	callback : function(data) { // 팝업창을 닫을 때 실행
  	           		if(data != undefined){
  	           			//장비의 포트수와 FDF포트수의 개념이 달라져 주석처리 2017.06.20
//  	           			$("#portCnt").val(data);
//  	           			$("#eqpNmDtl").val(data.eqpNm);
//  	           			$("#upsdRackNo").val(data.rackNumber);
//  	           			$("#upsdShlfNo").val(data.shelfNumber);
  	           			if(data.regYn == "Y"){
  	           				$a.close();
  	           			}
  	           		}
	           	}
   	      });
         });

    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	eqpDel();
  		        }
  		    });
         });

    	//장비수정
    	 $('#btnModLkup').on('click', function(e) {

    		//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#eqpDtlLkupForm").getData();
    		param.regYn = "Y";

    		$a.navigate('/tango-transmission-web/configmgmt/equipment/EqpRegPop.do',param);
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'eqpDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		 });

//    		param = {"lnkgDatDivCd":"D","eqpId":response.eqpId};
//    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO001Send', param, 'POST', '');

    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();

            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}

    	if(flag == 'eqpDtlInf') {

    		if(response.eqpMgmtList[0].mgmtGrpNm != 'SKB'){
        		$("#ukeyEqpDtl1").hide();
        		$("#ukeyEqpDtl2").hide();
        	}

    		if(response.eqpMgmtList[0].eqpRoleDivCd == '11' || response.eqpMgmtList[0].eqpRoleDivCd == '177' || response.eqpMgmtList[0].eqpRoleDivCd == '178' || response.eqpMgmtList[0].eqpRoleDivCd == '182'){
        		$("#upsdDtl").show();
        		$("#btnEqpFdfReg").show();
        	}else{
        		$("#upsdDtl").hide();
        		$("#btnEqpFdfReg").hide();
        	}
    		$('#eqpDtlLkupArea').setData(response.eqpMgmtList[0]);
    	}

		/* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */
      if(flag == 'eqpPortPveRegIsolYn'){
          if(response.Result == 'Y'){
              $('#btnPortInfCopy').setEnabled(false);
          }
      }
      /* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpDel'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpDel() {
   	 	var eqpId =  $("#eqpId").val();

   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/deleteEqpInf/'+eqpId, null, 'GET', 'eqpDel');

   }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
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
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : 650

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