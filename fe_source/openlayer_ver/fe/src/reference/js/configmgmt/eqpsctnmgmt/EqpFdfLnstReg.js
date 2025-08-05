/**
 * EqpReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
	var paramData = null;
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	if (! jQuery.isEmptyObject(param) ) {
    		paramData = param;
    	}
        setEventListener();
        setSelectCode();
        setRegDataSet(param);
        
    };
    
    
    function setRegDataSet(data) {
    	
    	$('#eqpFdfLnstRegArea').setData(data);
    	
    	if(data.rghtEqpRoleDivCd != "11"){
    		$('#btnRightFdfPortUse').setEnabled(false);
    	}	
    	if(data.sctnStatTypCd == null){
			$('#sctnStatTypCdReg').setData({
	             sctnStatTypCd:"01"
			});
		}
    	
    }
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
    	//연결정보유형 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00224', null, 'GET', 'connInfTypCdReg');
    	//자동수집여부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00838', null, 'GET', 'sctnStatTypCdReg');
    	
    }
    
    function setEventListener() {
    	
    	//목록
    	 $('#btnPrevReg').on('click', function(e) {
    		 $a.close();
          });
    	 
    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });
    	 
    	//저장 
    	 $('#btnSaveReg').on('click', function(e) {
    		 
    		 var param =  $("#eqpFdfLnstRegForm").getData();
    		     		 
    		 if (param.rghtPortNm == "") {
    	     		//필수 항목입니다.[포트명])
    		    	callMsgBox('','I', makeArgConfigMsg('required',configMsgArray['portName']), function(msgId, msgRst){});
    	     		return; 	
    	     	 }		  
    		 
 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	eqpFdfLnstReg();
 		        } 
 		      }); 
         });
    	 
    	//좌측 FDF실장도
	   	 $('#btnLeftFdfPortUse').on('click', function(e) {
	   		var param =  $("#eqpFdfLnstRegForm").getData();
	   		param.fdfEqpId=param.lftEqpId;
	   		param.fdfEqpNm=param.lftEqpNm;
    	 popupList('EqpFdfLnstDtlLkup', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpFdfLnstDtlLkup.do', configMsgArray['fiberDistributionFramePortUse'], param);
         });
    	 
	   //우측 FDF실장도
	   	 $('#btnRightFdfPortUse').on('click', function(e) {
	   		var param =  $("#eqpFdfLnstRegForm").getData();
	   		param.fdfEqpId=param.rghtEqpId;
	   		param.fdfEqpNm=param.rghtEqpNm;
    	 popupList('EqpFdfLnstDtlLkup', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpFdfLnstDtlLkup.do', configMsgArray['fiberDistributionFramePortUse'], param);
         });
    	 
    	//포트 조회
    	 $('#btnPortSearch').on('click', function(e) {
    		 var param = {"mgmtGrpNm": $('#mgmtGrpNm').val(), "orgId":$('#rghtOrgId').val(), "teamId":$('#rghtTeamId').val(), "tmof":$('#rghtTmof').val(), "regYn": "Y"};
    		 $a.popup({
    	          	popid: 'RghtPortLkup',
    	          	title: configMsgArray['findPort'],
    	            url: $('#ctx').val()+'/configmgmt/portmgmt/PortLkup.do',
    	            data: param,
    	            width : 950,
    	           	height : window.innerHeight * 0.8,
    	           	modal: true,
                    movable:true,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행 
    	                $('#rghtOrgNmReg').val(data.orgNm);
    	                $('#rghtTmofReg').val(data.tmof);
    	                $('#rghtMtsoNmReg').val(data.eqpInstlMtsoNm);
    	                $('#rghtEqpIdReg').val(data.eqpId);
    	                $('#rghtEqpNmReg').val(data.eqpNm);
    	                $('#rghtEqpMdlNmReg').val(data.eqpMdlNm);
    	                $('#rghtPortIdReg').val(data.portId);
    	                $('#rghtPortNmReg').val(data.portNm);
    	                $('#rghtPortIpAddrReg').val(data.portIpAddr);
    	                $('#rghtPortCapaReg').val(data.portCapa);
    	                $('#rghtPortDescReg').val(data.portDesc);
    	           	}
    	      });
         });
    	 
    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });
    	   
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'EqpFdfLnstReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       } 
    		});   
    		
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();
    		
            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	
    	if(flag == 'connInfTypCdReg'){
    		
    		$('#connInfTypCdReg').clear();
    		
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#connInfTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#connInfTypCdReg').setData({
    	             data:option_data,
    	             connInfTypCd:paramData.connInfTypCd
    			});
    		}
    	}
    	
    	if(flag == 'sctnStatTypCdReg'){
    		
    		$('#sctnStatTypCdReg').clear();
    		
    		var option_data =  [];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#sctnStatTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#sctnStatTypCdReg').setData({
    	             data:option_data,
    	             sctnStatTypCd:paramData.sctnStatTypCd
    			});
    		}
    	}
    	
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EqpFdfLnstReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpFdfLnstReg() {
		   
		 var param =  $("#eqpFdfLnstRegForm").getData();
		 
		 if(param.autoClctYn == "YES"){
			 param.autoClctYn = "Y";
		 }else{
			 param.autoClctYn = "N";
		 }
		 
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;
		 
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/updateEqpFdfLnst', param, 'POST', 'EqpFdfLnstReg');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
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
                  height : window.innerHeight * 0.9
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