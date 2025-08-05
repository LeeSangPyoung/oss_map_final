/**
 * DcnInfReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	//초기 진입점
	var paramData = null;
	var arrPortRule = null;
	var arrMgmtSvr = null;
	var arrTmof = null;
	var preRuleId = "";

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		setEventListener();
		setSelectCode(param);
		setRegDataSet(param);
	};
	
	function setRegDataSet(data) {
		if(data.regYn == "Y"){
			paramData = data;
			preRuleId = data.ruleId;
			
			//수정일때 게이트웨이서버는 수정 불가
			$('#nmsCd').setEnabled(false);
			
			if(data.nmsCd == '034004')
			{
				//NITS
				$('#mgmtSvrCd').setEnabled(false);
			}
			
			$('#dcnInfRegArea').setData(data);

			var param =  $("#dcnInfRegForm").getData();
	    	var adtnAttrVal = param.adtnAttrVal;
//	    	var adtnAttrVal = 'aaCM_DCN_APRVaa';
	    	
	    	if(adtnAttrVal.indexOf('CM_DCN_APRV') > 0){
	    		$('#btnSave').show();
	    		$('#btnDel').show();
	    	}else{
	    		$('#btnSave').hide();
	    		$('#btnDel').hide();
	    	}
		}else{
			omeaDisable();
			$('.eps').hide();
			$('.nits').hide();
			$('.teams').hide();
			
			$('#btnDel').hide();
			
			//$('.ems').show();
			//$('.direct').hide();
			
			//$('.1353NM').show();
			//$('.NOT_1353NM').show();
		}
		
	}

	function setSelectCode(data) {
		//관리 MMS
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02403', null, 'GET', 'nmsCd');
		//포트 룰 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnStdPortList', null, 'GET', 'dcnStdPortList');
		//RULE ID 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/ruleId', null, 'GET', 'ruleId');
		
		$('#emsTypCd').setData({
            data:[{comCd: "",comCdNm: configMsgArray['select']}]
		});
		
		$('#mgmtSvrCd').setData({
            data:[{comCd: "",comCdNm: configMsgArray['select']}]
		});
		
		$('#tmof').setData({
            data:[{mtsoId: "",mtsoNm: configMsgArray['select']}]
		});
		
		$('#eqpId').setData({
            data:[{comCd: "",comCdNm: configMsgArray['select']}]
		});
		
		if(data.regYn == "Y"){
			
			//EMS 타입 조회
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/dcnCode/C02402/'+data.nmsCd, null, 'GET', 'emsTyp');
			//httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/emsTyp/'+data.nmsCd, null, 'GET', 'emsTyp');
			//관리 서버 조회
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/dcnCode/C02401/'+data.nmsCd, null, 'GET', 'mgmtSvr');
			//httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/mgmtSvr/'+data.nmsCd, null, 'GET', 'mgmtSvr');
			//전송실 조회
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/ALL', null,'GET', 'tmof');
			
			if( data.nmsCd == '034001' )				//TEAMS
	    	{
	    		$('.eps').hide();
	    		$('.nits').hide();
	    		$('.teams').show();
	    	}
	    	else if(data.nmsCd == '034003')			//EPS
	    	{
	    		$('.nits').hide();
	    		$('.teams').hide();
	    		$('.eps').show();
	    		omeaDisable();
	    	}
	    	else if( data.nmsCd == '034004' )		//NITS
	    	{
	    		$('.eps').hide();
	    		$('.teams').hide();
	    		$('.nits').show();
	    		
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnPortList/'+ data.dcnId, null, 'GET', 'dcnPortList');
	    	}
		}
		
	}

	function setEventListener() {
		
		//관리NMS 변경시 화면 변경
		$('#nmsCd').on('change', function(e) {
			
			var nmsCd = $('#nmsCd').getValues();
			
			$('#mgmtSvrIp').val("");
			$('#tmof').val("");
			$('#mtsoId').val("");
			$('#emsTypCd').val("");
			$('#mgmtNetDivVal').val("");
			$('#mgmtGrpCd').val("");
			
			if(nmsCd != ""){
				//EMS 타입 조회
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/dcnCode/C02402/'+nmsCd, null, 'GET', 'emsTyp');
				//httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/emsTyp/'+nmsCd, null, 'GET', 'emsTyp');
				//관리 서버 조회
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/dcnCode/C02401/'+nmsCd, null, 'GET', 'mgmtSvr');
				//httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/mgmtSvr/'+nmsCd, null, 'GET', 'mgmtSvr');
				//전송실 조회
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/ALL', null,'GET', 'tmof');
			}else{
				$('#emsTypCd').setData({
		            data:[{comCd: "",comCdNm: configMsgArray['select']}]
				});
				
				$('#mgmtSvrCd').setData({
		            data:[{comCd: "",comCdNm: configMsgArray['select']}]
				});
			}
			
			changeView();
			$('span[name=span_login]').html('*');
        });
		
		//관리서버 변경시
		$('#mgmtSvrCd').on('change', function(e) {
			var idx = $('#mgmtSvrCd')[0].options.selectedIndex;
			if(idx > 0){
				$('#mgmtSvrIp').val(arrMgmtSvr[idx-1].etcAttrVal1);  //IP_ADDR
			}else{
				$('#mgmtSvrIp').val("");
			}
        });
		
		//접속타입 변경시 화면 변경
		$('#mgmtNetDivVal').on('change', function(e) {
			$('#emsTypCd').setSelected("");
			$('#eqpMdlId').setSelected("");
			$('#eqpId').setSelected("");
			
			changeView();
			$('span[name=span_login]').html('');
        });
		
		//EMS타입 변경시 화면 변경
		$('#emsTypCd').on('change', function(e) {
			changeView();
			
			for( var i=0; i < arrPortRule.length; i++)
			{
				if(arrPortRule[i].emsTypCd == $('#emsTypCd').val())
				{
					var o = arrPortRule[i];
					
					if(o.emsTypCd == '14')//1353NM
					{
						$.each($('.NOT_1353NM input'), function(){
							$(this).val("");
						});
						
						if(o.portTypVal == '11000000')
						{
							$('#e_portVal1').val(o.portVal);
							$('#e_portTypVal1').val(o.portTypVal);
							
							if(o.portFixYn == 'Y')		$('#e_portVal1').attr('readonly', true);
							else							$('#e_portVal1').removeAttr('readonly');
						}
						else if(o.portTypVal == '00010000')
						{
							$('#e_portVal2').val(o.portVal);
							$('#e_portTypVal2').val(o.portTypVal);
							
							if(o.portFixYn == 'Y')		$('#e_portVal2').attr('readonly', true);
							else							$('#e_portVal2').removeAttr('readonly');
						}
						else if(o.portTypVal == '00000100')
						{
							$('#e_portVal3').val(o.portVal);
							$('#e_portTypVal3').val(o.portTypVal);
							
							if(o.portFixYn == 'Y')		$('#e_portVal3').attr('readonly', true);
							else							$('#e_portVal3').removeAttr('readonly');
						}
						else if(o.portTypVal == '00001000')
						{
							$('#e_portVal4').val(o.portVal);
							$('#e_portTypVal4').val(o.portTypVal);
							
							if(o.portFixYn == 'Y')		$('#e_portVal4').attr('readonly', true);
							else							$('#e_portVal4').removeAttr('readonly');
						}
					}
					else
					{
						$.each($('.1353NM input'), function(){
							$(this).val("");
						});
						
						$('#d_portVal').val(o.portVal);
						$('#d_portTypVal').val(o.portTypVal);
						
						if(o.portFixYn == 'Y')		$('#d_portVal').attr('readonly', true);
						else							$('#d_portVal').removeAttr('readonly');
					}
					
					if(o.lginId != null)
					{
						$('#lginId').val(o.lginId);
						$('#lginPwd').val(o.lginPwd);
					}
					
					if(o.snmpVerVal == '1')
					{
						$('.read_r_comm').show();
						$('#snmpRCmtyVal').val(o.snmpRCmtyVal);
						$('#snmpVerVal').val(o.snmpVerVal);
					}
					else
					{
						$('.read_r_comm').hide();
						$('#snmpRCmtyVal').val("");
						$('#snmpVerVal').val('-1');
					}
				}
			}
        });
		
		//전송실 변경시
		$('#tmof').on('change', function(e) {
			$('#mtsoId').val("");
			$('#mtsoNm').val("");
//			$('#eqpMdlId').val("");
//			$('#eqpId').val("");
			
			var idx = $('#tmof')[0].options.selectedIndex;
			var mng = arrTmof[idx-1].mgmtGrpCd;

			$('#mgmtGrpCd').val(mng);
			
			eqpChange();
        });
		
		//장비모델 변경시
		$('#eqpMdlId').on('change', function(e) {
			$('#eqpId').setSelected("");
			
			eqpChange();
			
			for( var i=0; i< arrPortRule.length; i++)
			{
				if(arrPortRule[i].eqpMdlId == $('#eqpMdlId').val())
				{
					var o = arrPortRule[i];
					if(o.portVal != null)
					{
						$('#d_portVal').val(o.portVal);
						$('#d_portTypVal').val(o.portTypVal);
					}
					
					if(o.portFixYn == 'Y')
					{
						$('#d_portVal').attr('readonly', true);
					}
					else
					{
						$('#d_portVal').removeAttr('readonly');
					}
					
					if(o.lginId == null || o.lginId=='' || o.lginId== undefined)
					{
						$('span[name=span_login]').html('');
						$('#lginId').val('');
						$('#lginPwd').val('');
					}
					else
					{
						$('span[name=span_login]').html('*');
						$('#lginId').val(o.lginId);
						$('#lginPwd').val(o.lginPwd);
					}
					
					if(o.snmpVerVal == '1')
					{
						$('.read_r_comm').show();
						$('#snmpRCmtyVal').val(o.snmpRCmtyVal);
						$('#snmpVerVal').val(o.snmpVerVal);
					}
					else
					{
						$('.read_r_comm').hide();
						$('#snmpRCmtyVal').val("");
						$('#snmpVerVal').val("-1");
					}
				}
			}
        });
		
		//RULE ID 변경시
		$('#ruleId').on('change', function(e) {
			omeaDisable();
        });
		
		$('#eqpId').on('click', function(e) {
			if ($('#tmof').val() == "") {
  	    		//필수입력 항목입니다.[ 전송실 ] 
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','전송실'), function(msgId, msgRst){}); 
  	     		return; 	
  	     	 }
			
			if ($('#eqpMdlId').val() == "") {
  	    		//필수입력 항목입니다.[ 장비모델 ] 
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','장비모델'), function(msgId, msgRst){}); 
  	     		return; 	
  	     	 }
		});
		
		//국사 조회
   	 	$('#btnMtsoSearch').on('click', function(e) {
   	 		var mgmtGrpNm = "";
   	 			if($('#mgmtGrpCd').val() == "0002"){
   	 				mgmtGrpNm = "SKB";
   	 			}else{
   	 				mgmtGrpNm = "SKT";
   	 			}
	   	 	var param = {regYn: "Y", orgId: "", tmof: $('#tmof').val(), mgmtGrpNm: mgmtGrpNm};
	   		 $a.popup({
	   	          	popid: 'MtsoLkup',
	   	          	title: configMsgArray['findMtso'],
	   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	   	            windowpopup : true,
	   	            data: param,
	   	            modal: true,
	                movable:true,
	   	            width : 950,
	   	           	height : 760,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행 
	   	                $('#mtsoNm').val(data.mtsoNm);
	   	                $('#mtsoId').val(data.mtsoId);
	   	           	}
	   	      });
        });

		//취소
		$('#btnCncl').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			$a.close();
		});

		//저장 
		$('#btnSave').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
				//저장한다고 하였을 경우
				if (msgRst == 'Y') {
					dcnInfReg();
				} 
			}); 
		});
		
		$('#btnDel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){  
				//삭제한다고 하였을 경우
				if (msgRst == 'Y') {
					var param = {dcnId : $('#dcnId').val()};
					
					var userId;
					if($("#userId").val() == ""){
						userId = "SYSTEM";
					}else{
						userId = $("#userId").val();
					}

					param.lastChgUserId = userId;
					
					httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/deleteDcnInfo', param, 'POST', 'deleteDcnInfo');
				} 
			}); 
		});
		
		$('#btnClose').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			$a.close();
		});

	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){

		if(flag == 'insertDcnInfo') {
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
					if (msgRst == 'Y') {
						$a.close();
					} 
				});   
				
				var pageNo = $("#pageNo", opener.document).val();
	    		var rowPerPage = $("#rowPerPage", opener.document).val();
	    		
	            $(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
			}else if(response.Result == "Fail"){
				callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
			}
		}
		
		if(flag == 'deleteDcnInfo') {
			if(response.Result == "Success"){
				//삭제를 성공 하였습니다.
				callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){  
					if (msgRst == 'Y') {
						$a.close();
					} 
				});   
				
				var pageNo = $("#pageNo", opener.document).val();
	    		var rowPerPage = $("#rowPerPage", opener.document).val();
	    		
	            $(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
			}else if(response.Result == "Fail"){
				callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
			}
		}
		
		//포트 룰
		if(flag == 'dcnStdPortList') {

			if(response.dcnStdPortList.length > 0){
				arrPortRule = response.dcnStdPortList;
				
				$('#eqpMdlId').clear();
	    		
	    		var option_data =  [{eqpMdlId: "",eqpMdlNm: configMsgArray['select']}];
	    		
	    		for(var i=0; i<response.dcnStdPortList.length; i++){
					var resObj = response.dcnStdPortList[i];
					if(resObj.emsTypCd == "NONE" && resObj.eqpMdlNm != "" && resObj.eqpMdlNm != null && resObj.eqpMdlNm != undefined){
						option_data.push(resObj);
					}
				}
	    		
	    		if(paramData == '' || paramData == null) {
	    			$('#eqpMdlId').setData({
	    	             data:option_data
	    			});
	    		}
	    		else {
	    			$('#eqpMdlId').setData({
	    	             data:option_data,
	    	             eqpMdlId:paramData.eqpMdlId
	    			});
	    			eqpChange('init');
	    		}
			}
		}
		
		if(flag == 'nmsCd'){
    		
    		$('#nmsCd').clear();
    		
    		var option_data =  [{comCd: "",comCdNm: configMsgArray['select']}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#nmsCd').setData({
    	             data:option_data
    			});
    		}
    		else {
    			if(paramData.regYn == "Y"){
    				//관리 NMS에 SKB_TNMS가 없어 표시가 안되므로 수정일때는 SKB_TNMS가 선택 될수 있도록 추가
    				//$('#nmsCd').append($('<option>', {value: '034012', text: 'SKB_TNMS'}));
        			option_data.push({comCd: '034012',comCdNm: 'SKB_TNMS'});
    			}
    			
    			$('#nmsCd').setData({
    	             data:option_data,
    	             nmsCd:paramData.nmsCd
    			});
    		}
    	}
		
		if(flag == 'emsTyp'){
    		
    		$('#emsTypCd').clear();
    		
    		var paramYn = "N";
    		var option_data =  [{comCd: "",comCdNm: configMsgArray['select']}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				if(paramData != '' && paramData != null) {
					if(resObj.comCd == paramData.emsTypCd || (paramData.emsTypCd == undefined || paramData.emsTypCd == "")){
						paramYn = "Y";
					}
				}
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#emsTypCd').setData({
    	             data:option_data
    			});
    		}
    		else {
    			//넘어온 값이 selectbox 에 없는 경우 표시는 될 수 있도록 넘어온 값을 selectbox에 추가
    			if(paramYn == "N"){
    				option_data.push({comCd: paramData.emsTypCd, comCdNm: paramData.emsTypNm});
    				//TEAMS에서 EMS값이 없는데 포트가 있는 경우 포트를 남겨두기 위한 FLAG값 생성 
    				if(paramData.nmsCd == "034001"){
    					$('#emsChk').val("Y");
    				}
    			}
    			
    			$('#emsTypCd').setData({
    	             data:option_data,
    	             emsTypCd:paramData.emsTypCd
    			});
    		}
    	}
		
		if(flag == 'mgmtSvr'){
    		
    		$('#mgmtSvrCd').clear();
    		
    		var option_data =  [{comCd: "",comCdNm: configMsgArray['select'], ipAddr: ""}];
    		
    		arrMgmtSvr = response;
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#mgmtSvrCd').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#mgmtSvrCd').setData({
    	             data:option_data,
    	             mgmtSvrCd:paramData.mgmtSvrCd
    			});
    			
    			var idx = $('#mgmtSvrCd')[0].options.selectedIndex;
    			if(idx > 0){
    				$('#mgmtSvrIp').val(arrMgmtSvr[idx-1].etcAttrVal1); //IP_ADDR
    			}else{
    				$('#mgmtSvrIp').val("");
    			}
    		}
    	}
		
		if(flag == 'ruleId'){
    		
    		$('#ruleId').clear();
    		
    		var option_data =  [{comCd: "",comCdNm: configMsgArray['select'], ipAddr: ""}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#ruleId').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#ruleId').setData({
    	             data:option_data,
    	             ruleId:paramData.ruleId
    			});
    		}
    	}
		
		// 전송실
    	if(flag == 'tmof'){
    		$('#tmof').clear();
    		
    		var option_data = [{mtsoId: "",mtsoNm: configMsgArray['select']}];
    		
    		arrTmof = response;
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		if(paramData == '' || paramData == null) {
    			$('#tmof').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#tmof').setData({
    	             data:option_data,
    	             tmof:paramData.tmof
    			});
    		}
    	}
    	
    	// 장비
    	if(flag == 'eqpId'){
    		$('#eqpId').clear();
    		
    		var option_data = [{comCd: "",comCdNm: configMsgArray['select']}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		if(paramData == '' || paramData == null) {
    			$('#eqpId').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#eqpId').setData({
    	             data:option_data,
    	             eqpId:paramData.eqpId
    			});
    		}
    	}
    	
    	if(flag == 'dcnPortList'){
    		if(paramData.emsTypCd == '14'){//1353NM
    			$('.1353NM').show();
    			for (var i = 0; i < response.dcnPortList.length; i++) {
    				var resObj = response.dcnPortList[i];
					if(resObj.portTypVal == '11000000'){
						$('#e_portVal1').val(resObj.portVal);
						$('#e_portTypVal1').val(resObj.portTypVal);
					}else if(resObj.portTypVal == '00010000'){
						$('#e_portVal2').val(resObj.portVal);
						$('#e_portTypVal2').val(resObj.portTypVal);
					}else if(resObj.portTypVal == '00000100'){
						$('#e_portVal3').val(resObj.portVal);
						$('#e_portTypVal3').val(resObj.portTypVal);
					}else if(resObj.portTypVal == '00001000'){
						$('#e_portVal4').val(resObj.portVal);
						$('#e_portTypVal4').val(resObj.portTypVal);
					}
				}
    		}else{
    			$('.1353NM').hide();
				$('#d_portVal').val(response.dcnPortList[0].portVal);
				$('#d_portTypVal').val(response.dcnPortList[0].portTypVal);
    		}
    		
    		if(paramData.mgmtNetDivVal == 'D')			//장비접속
    		{
    			$('.ems').hide();
    			$('.direct').show();

    			$('#snmpRCmtyVal').val(response.dcnPortList[0].snmpRCmtyVal);
    			$('#snmpVerVal').val(response.dcnPortList[0].snmpVerVal);

    			if(response.dcnPortList[0].snmpVerVal == '1')
    			{
    				$('.read_r_comm').show();
    			}
    			else
    			{
    				$('.read_r_comm').hide();
    			}
    		}
    		else if(paramData.mgmtNetDivVal == 'E')		//ems접속
    		{
    			$('.direct').hide();
    			$('.ems').show();

    			if(paramData.emsTypCd == '14')//1353NM
    			{
    				$('.1353NM').show();
    			}
    			else
    			{
    				$('.1353NM').hide();
    				$('.NOT_1353NM').show();
    			}
    		}
    		else
    		{
    			$('.direct').hide();
    			$('.ems').hide();
    		}
    	}
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if(flag == 'dcnInfReg'){
			//저장을 실패 하였습니다.
			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
		}
	}
	
	function eqpChange(data){
		if($('#mgmtNetDivVal').val() == 'D')			//장비접속
		{
			var mgmtGrpCd = "";
			var tmof = "";
			var eqpMdlId = "";
			if(paramData != null && data == 'init') {
				if(paramData.mgmtGrpCd == undefined){
					mgmtGrpCd = $('#mgmtGrpCd').val();
				}else{
					mgmtGrpCd = paramData.mgmtGrpCd;
				}
				
				if(paramData.tmof == undefined){
					tmof = $('#tmof').val();
				}else{
					tmof = paramData.tmof;
				}
				
				if(paramData.eqpMdlId == undefined){
					eqpMdlId = $('#eqpMdlId').val();
				}else{
					eqpMdlId = paramData.eqpMdlId;
				}
			}else{
				mgmtGrpCd = $('#mgmtGrpCd').val();
				tmof = $('#tmof').val();
				eqpMdlId = $('#eqpMdlId').val();
			}
			
			if(mgmtGrpCd != "" && tmof != "" && eqpMdlId != ""){
				var param = {mgmtGrpCd: mgmtGrpCd, tmof: tmof, eqpMdlId: eqpMdlId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/eqpId', param, 'GET', 'eqpId');
			}
		}
	}
	
	function changeView()
	{
//		$('#lginId').val("");
//		$('#lginPwd').val("");
//		$('#mgmtSvrCd').setSelected("");
		
		if( $('#nmsCd').val() == '034001' )				//TEAMS
		{
//			$('#mgmtGrpCd').val('0001');
			$('#ruleId').val("");
			
			$('.eps').hide();
			$('.nits').hide();
			$('.teams').show();
		}
		else if($('#nmsCd').val() == '034003')			//EPS
		{
//			$('#mgmtGrpCd').val('0001');
			
			$('.nits').hide();
			$('.teams').hide();
			$('.eps').show();
			omeaDisable();
		}
		else if( $('#nmsCd').val() == '034004' )		//NITS
		{
//			$('#mgmtGrpCd').val('0001');
			$('#ruleId').val("");
			$('#slveIpAddr').val("");
			
			$('.eps').hide();
			$('.teams').hide();
			$('.nits').show();
			
			if($('#mgmtNetDivVal').val() == 'D')			//장비접속
			{
				$('.ems').hide();
				$('.direct').show();
				
			}
			else if($('#mgmtNetDivVal').val() == 'E')		//ems접속
			{
				$('.direct').hide();
				$('.ems').show();
				
				if($('#emsTypCd').val() == '14')//1353NM
				{
					$('.1353NM').show();
				}
				else
				{
					$('.1353NM').hide();
					$('.NOT_1353NM').show();
				}
				
				$('#eqpMdlId').val("");
			}
			else
			{
				$('.direct').hide();
				$('.ems').hide();
				
				$('#eqpMdlId').val("");
			}
		}
		else
		{
//			$('#mgmtGrpCd').val("");
		}
	}

	//RULE ID 에 따라 OMEA 화면 변경 
	function omeaDisable()
	{
//		var rule_id = $('#s_rule_cd').val().toUpperCase();
		var rule_id = $('#ruleId').val();

		if(rule_id == 'NTCOM' || rule_id =='NTCPL' || rule_id =='NT_BB' || rule_id =='NT_NU')
		{
			$('.omea').show();
		}
		else
		{
			$('#omeaNm').val('');
			$('#omeaLginId').val('');
			$('#omeaLginPwd').val('');
			$('.omea').hide();
		}
	}
	
	function checkValidation()
	{
		if($.trim($('#dcnNm').val()) == '')
		{
			callMsgBox('','W', 'DNC명을 입력하세요.', function(msgId, msgRst){}); 
			$('#dcnNm').focus();
			return false;
		}
		else if($.trim($('#dcnNm').val()).length > 100)
		{
			callMsgBox('','W', 'DCN명은 최대 100자리입니다.', function(msgId, msgRst){}); 
			$('#dcnNm').focus();
			return false;
		}else if($('#nmsCd').val() == '')
		{
			callMsgBox('','W', '관리NMS를 선택하세요.', function(msgId, msgRst){}); 
			$('#nmsCd').focus();
			return false;
		}
		else if($('#mgmtSvrCd').val() == '')
		{
			callMsgBox('','W', 'GateWay 서버를 선택하세요.', function(msgId, msgRst){});
			$('#mgmtSvrCd').focus();
			return false;
		}
		else if($('#tmof').val() == '')
		{
			callMsgBox('','W', '전송실을 선택하세요.', function(msgId, msgRst){});
			$('#tmof').focus();
			return false;
		}
		else if($.trim($('#prmyIpAddr').val()) == '')
		{
			callMsgBox('','W', '기본IP를 입력하세요.', function(msgId, msgRst){});
			$('#prmyIpAddr').focus();
			return false;
		}
		else if(!ipCheck($('#prmyIpAddr').val()))
		{
			$('#prmyIpAddr').focus();
			return false;
		}
		else if($.trim($('#lginId').val()) == '' && $('#nmsCd').val() != '034004')
		{
		//nits 아닌경우는 필수값이고,
		//nits 인 경우는 CF_DCN_STD_PORT 테이블에 LOGIN ID, PWD 값이 없을 경우는 필수 입력값이 아니다.
			callMsgBox('','W', 'LOGIN ID를 입력하세요.', function(msgId, msgRst){});
			$('#lginId').focus();
			return false;
		}
		else if($.trim($('#lginId').val()).length > 50 )
		{
			callMsgBox('','W', 'LOGIN ID는 최대 50자리입니다.', function(msgId, msgRst){});
			$('#lginId').focus();
			return false;
		}
		else if($.trim($('#lginPwd').val()) == '' && $('#nmsCd').val() != '034004')
		{
			callMsgBox('','W', 'PWD를 입력하세요.', function(msgId, msgRst){});
			$('#nmsCd').focus();
			return false;
		}
		else if($.trim($('#lginPwd').val()).length > 50)
		{
			callMsgBox('','W', 'PWD은 최대 50자리입니다.', function(msgId, msgRst){});
			$('#lginPwd').focus();
			return false;
		}
		
		var rule_id = $('#ruleId').val().toUpperCase();
		
		if($('#nmsCd').val() == '034001')				//temas 일때
		{
			if($('#emsTypCd').val() == '')
			{
				callMsgBox('','W', 'EMS 타입을 선택하세요.', function(msgId, msgRst){});
				$('#emsTypCd').focus();
				return false;
			}
		}
		else if($('#nmsCd').val() == '034003')			//eps 일때
		{
			if($('#ruleId').val() == '')
			{
				callMsgBox('','W', 'RULE ID를 선택하세요.', function(msgId, msgRst){});
				$('#ruleId').focus();
				return false;
			}
			else if($.trim($('#slveIpAddr').val()) != '' && !ipCheck($('#slveIpAddr').val()) )
			{
				$('#slveIpAddr').focus();
				return false;
			}
			else if(rule_id == 'NTCOM' || rule_id =='NTCPL' || rule_id =='NT_BB' || rule_id =='NT_NU')
			{
				if( $.trim($('#omeaNm').val()) == '' )
				{
					callMsgBox('','W', 'OMEA명을 입력하세요.', function(msgId, msgRst){});
					$('#omeaNm').focus();
					return false;
				}
				else if($.trim($('#omeaLginId').val()) == '')
				{
					callMsgBox('','W', 'OMEA LOGIN ID를 입력하세요.', function(msgId, msgRst){});
					$('#omeaLginId').focus();
					return false;
				}
				else if($.trim($('#omeaLginPwd').val()) == '')
				{
					callMsgBox('','W', 'OMEA PWD를 입력하세요.', function(msgId, msgRst){});
					$('#omeaLginPwd').focus();
					return false;
				}
			}
		}
		else if($('#nmsCd').val() == '034004')			//nits 일때
		{
			if($('#mgmtNetDivVal').val() == '')
			{
				callMsgBox('','W', '접속타입을 선택하세요.', function(msgId, msgRst){});
				$('#mgmtNetDivVal').focus();
				return false;
			}
			if($('#mgmtNetDivVal').val() == 'D')
			{
				if($('#eqpMdlId').val() == '')
				{
					callMsgBox('','W', 'GNE 장비모델을 선택하세요.', function(msgId, msgRst){});
					$('#eqpMdlId').focus();
					return false;
				}
				
				if($('#eqpId').val() == '')
				{
					callMsgBox('','W', 'GNE 장비를 선택하세요.', function(msgId, msgRst){});
					$('#eqpId').focus();
					return false;
				}
				
				if($.trim($('#lginId').val()) == ''  || $.trim($('#lginPwd').val()) == '' )
				{
					for( var i=0; i< arrPortRule.length; i++)
					{
						if(arrPortRule[i].eqpMdlId == $('#eqpMdlId').val())
						{
							if(arrPortRule[i].lginId != null && arrPortRule[i].lginId != '' && arrPortRule[i].lginId != undefined)
							{
								callMsgBox('','W', 'LOGIN ID / PWD는 필수 입력항목입니다.', function(msgId, msgRst){});
								return;
							}
						}
					}
				}
			}
			else if ($('#mgmtNetDivVal').val() == 'E')
			{
				if($('#emsTypCd').val() == '')
				{
					callMsgBox('','W', 'EMS 타입을 선택하세요.', function(msgId, msgRst){});
					$('#emsTypCd').focus();
					return false;
				}
			}
			
			if($.trim($('#emsTypCd').val()) == '14')//1353NM
			{
				if($.trim($('#e_portVal1').val()) == '')
				{
					callMsgBox('','W', '장애포트를 입력하세요.', function(msgId, msgRst){});
					$('#e_portVal1').focus();
					return false;
				}
				if($.trim($('#e_portVal2').val()) == '')
				{
					callMsgBox('','W', '성능포트를 입력하세요.', function(msgId, msgRst){});
					$('#e_portVal2').focus();
					return false;
				}
				if($.trim($('#e_portVal3').val()) == '')
				{
					callMsgBox('','W', 'NE목록 포트를 입력하세요.', function(msgId, msgRst){});
					$('#e_portVal3').focus();
					return false;
				}
				if($.trim($('#e_portVal4').val()) == '')
				{
					callMsgBox('','W', '실장포트를 입력하세요.', function(msgId, msgRst){});
					$('#e_portVal4').focus();
					return false;
				}
			}
			else
			{
				if($.trim($('#d_portVal').val()) == '')
				{
					callMsgBox('','W', '포트를 입력하세요.', function(msgId, msgRst){});
					$('#d_portVal').focus();
					return false;
				}
			}
		}

		return true;
	}
	
	//IP검사
	function ipCheck(str)
	{
		var ip = $.trim(str);
		var arrIp = ip.split('.');
		
		if(arrIp.length != 4)
		{
			callMsgBox('','W', '유효한 IP가 아닙니다.', function(msgId, msgRst){});
			return false;
		}
		
		for(var i=0; i< arrIp.length; i++)
		{
			if(arrIp[i] < 0 || arrIp[i] > 255)
			{
				callMsgBox('','W', 'IP는 0~255 사이의 숫자를 입력하세요.', function(msgId, msgRst){});
				return false;
			}
			else if(isNaN(arrIp[i]) || $.trim(arrIp[i]) == '')
			{
				callMsgBox('','W', '유효한 IP가 아닙니다.', function(msgId, msgRst){});
				return false;
			}
			else if(arrIp[i].length > 3)
			{
				callMsgBox('','W', '유효한 IP가 아닙니다.', function(msgId, msgRst){});
				return false;
			}
		}
		
		return true;
	}

	function dcnInfReg() {
		
		if(!checkValidation())
		{
			return;
		}
		
		var param =  $("#dcnInfRegForm").getData();
		
		param.skt2Yn = "N";
		
		if(param.nmsCd == '034001')			//teams
		{
			param.mgmtNetDivVal = "E";
		}
		else if(param.nmsCd == '034003')			//eps
		{
			param.preRuleId = preRuleId;
		}
		else if(param.nmsCd == '034004')		//nits
		{
			param.commandflag = "1";
			//관리그룹이 SKT이고 NMS가 NITS인 경우 SKT2 여부를 Y로 준다
			if(param.mgmtGrpCd == "0001"){
				param.skt2Yn = "Y";
			}
		}
		
		if(param.mtsoId == ""){
			param.mtsoId = param.tmof;
		}
		
		var userId;
		if($("#userId").val() == ""){
			userId = "SYSTEM";
		}else{
			userId = $("#userId").val();
		}

		param.frstRegUserId = userId;
		param.lastChgUserId = userId;

		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/insertDcnInfo', param, 'POST', 'insertDcnInfo');
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
});