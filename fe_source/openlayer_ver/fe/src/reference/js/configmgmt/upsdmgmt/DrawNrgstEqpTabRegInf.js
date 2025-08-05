/**
 * EqpLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var regInf = $a.page(function() {
	var strSrc = null;
	var paramData = null;
	var paramEqpId = null;
	var sPosTmp = [];
	var ePosTmp = [];
	var unitSize = null;
	var rowCnt = null;
	var alertFlag = null;
	var orgFloorId = null;
	var selectFloorId = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	alertFlag = 'N';
		if(param.eqpId != '' && param.eqpId != null && param.eqpId != undefined && param.eqpId != 'undefined'){
			paramData = param;
			paramEqpId = {eqpId:paramData.eqpId};
			$('#regInfArea').formReset();
			regInf.resetComboBox();
			$('#regInfEqpId').val(paramData.eqpId);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpInstlMtsoInf', paramEqpId, 'GET', 'eqpInstlMtsoInf');
		}
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }

    function setList(param){
    }

    function setEventListener() {
    	$('#btnSaveReg').on('click', function(e) {
			if ($('#regInfMtsoNm').val() == "") {
				//필수입력 항목입니다.[ 국사명 ]
				callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
				return;
			}
			if ($('#floorId').val() == "") {
				//필수선택 항목입니다.[ 층 정보 ]
				callMsgBox('','W', '필수선택 항목입니다.[ 층 정보 ]', function(msgId, msgRst){});
				return;
			}
			if ($('#regInfEqpNm').val() == "") {
				//필수입력 항목입니다.[ 장비명 ]
				callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentName']), function(msgId, msgRst){});
				return;
			}
			if ($('#sPos').val() == "") {
				//필수선택 항목입니다.[ 시작 위치 ]
				callMsgBox('','W', '필수선택 항목입니다.[ 시작 위치 ]', function(msgId, msgRst){});
				return;
			}
			if ($('#rackId').val() == "") {
				//필수입력 항목입니다.[ 랙 정보 ]
				callMsgBox('','W', '필수입력 항목입니다.[ 랙 정보 ]', function(msgId, msgRst){});
				return;
			}

			if ($("#unitSize").val() == null || $("#unitSize").val() == "" || $("#unitSize").val() == "0") $("#unitSize").val("1");
			if ($("#unitCnt").val() == null || $("#unitCnt").val() == "" || $("#unitCnt").val() == "0") $("#unitCnt").val("1");
			var rackId = $('#rackId').val();

			var sPos =  parseInt($("#sPos").val());
			var ePos = sPos + parseInt($("#unitCnt").val()) - 1;
			var unitSize = parseInt($('#unitSize').val());

			var dismantleFlag = $("#dismantleFlag").val();
			var barcodeFlag =  $("#barcodeFlag").val();
			var barNo = $("#searchBarCode").val();
			var cstrStatCd =  $("#cstrStatCd").val();
			var cstrCd =  $("#cstrCd").val();
			var upDataFlag = $("#upDataFlag").val();

			var saveFlag = true;
			if (ePos > unitSize) {
				saveFlag = false;
			}
			if (sPos < ePos) {
				for(i=0;i<sPosTmp.length;i++) {
					if (sPos < parseInt(sPosTmp[i])) {
						if (ePos >= parseInt(sPosTmp[i])) {
							saveFlag = false;
							break;
						}
					}
				}
			}

			if (!saveFlag) {
				alert("위치할 수 없는 랙 번호입니다.\n다시 시도하여 주시기 바랍니다.");
			} else {
				var eqpId = $('#regInfEqpId').val();
				if (eqpId == "") {
					alert("선택된 장비가 없습니다. 장비를 검색하여 주시기 바랍니다.");
				} else {
					var userId = $("#userId").val();
					if (upDataFlag != 'Y') {
						var param = {itemId : eqpId, regId : userId};	// 등록 일 경우 oItemId는 eqpid로
						callMsgBox('','C', '저장 하시겠습니까?', function(msgId, msgRst){
			  		       //저장한다고 하였을 경우
			  		        if (msgRst == 'Y') {
			  		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseEqInfo', param, 'POST', 'BaseEq');
			  		        }
			  		    });
					} else {
						// 탱고장비 수정은 없는 경우
						modelId = $('#regInfEqpId').val();
						modelNm = $('#refInfEqpRoleDivNm').val();
						var param = {rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:'', description:'', dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId, barCode : barNo, cstrStatCd : cstrStatCd, cstrCd : cstrCd};
			    		callMsgBox('','C', '적용 하시겠습니까?', function(msgId, msgRst){
				  		       //저장한다고 하였을 경우
				  		        if (msgRst == 'Y') {
				  		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRactEq', param, 'POST', 'UpdateRactEq');
				  		        }
				  		    });
					}
				}
			}
    	});
 		$('#btnCnclReg').on('click', function(e) {
        	//tango transmission biz 모듈을 호출하여야한다.
 			$a.close();
        });
 		$('#btnLoc').on('click', function(e) {
 			if($('#floorId').val() == null ||$('#floorId').val() == 'null' ||$('#floorId').val() == ''){
 				callMsgBox('','W', '위치 선택 시 필수선택 항목입니다. [ 층 정보 ]', function(msgId, msgRst){});
 				return;
 			}else{
 	 			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
 	        	var paramData = {mtsoEqpGubun :'mtso', mtsoEqpId : $('#regInfMtsoId').val(), parentWinYn : 'Y',
 	        			linkTab : 'tab_Draw',
 						linkTabContrlYn : 'Y',		// 특정 용도로 활용하기 위함 팝업(Return값을 받을 수 있음.)
 						variableNm : 'floorId',		// 특정 용도로 활용하기 위함 팝업
 						variableVal : $('#floorId').val()		// 특정 용도로 활용하기 위함 팝업
 	        	};
 	    		var popMtsoEqp = $a.popup({
 	    			popid: tmpPopId,
 	    			title: '통합 국사/장비 정보',
 	    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
 	    			data: paramData,
 	    			iframe: false,
 	    			modal: false,
 	    			movable:false,
 	    			windowpopup: true,
 	    			width : 900,
 	    			height : window.innerHeight,
 					callback: function(data) {
// 			    		$('#rackNm').setData({
// 			    			rackId : data.rackId
// 			    		});
 						$('#rackId').val(data.rackId);
 						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackUnitCurst', data, 'GET', 'rackUnitCurst');
 						alertFlag = 'N';
 					}
 	    		});
 			}
 		});


   	 $('#btnunitCnt').on('click', function(e) {
		 var seachFlag = true;

		 var eqpId = $('#regInfEqpId').val();
		 if (eqpId == "" || eqpId == null) {
			 seachFlag = false;
		 }
		 if (seachFlag) {
			 var eqpId = $('#regInfEqpId').val();
			 var param = {eqpId : eqpId};
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUnitCntList', param, 'GET', 'UnitCntList');
		 } else {
			 alert("Tango 장비를 먼저 선택하여 주시기 바랍니다.");
		 }
       });

 	//바코드조회
	 $('#btnBarNoSearch').on('click', function(e) {

		 if ($('#regInfMtsoNm').val() == "") {
	    		//필수입력 항목입니다.[ 국사 ]
	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
	     		return;
	     	 }

		 var param =  {"sisulGbn": "mtso"
	    			 , "sisulCd": $('#regInfMtsoId').val()
	    			 , "sisulNm": $('#regInfMtsoNm').val()
			 		 , "namsMatlCd": $('#regInfMtsoId').val()
			 		 , "namsMatlNm": $('#regInfMtsoNm').val()};
		 $a.popup({
	          	popid: 'BarcodeInfoListPop',
	          	title: '바코드조회',
	            url: '/tango-transmission-web/configmgmt/shpmgmt/BarcodeInfoListPop.do',
	            data: param,
	            modal: false,
                movable:false,
                windowpopup: true,
	            width : 1300,
	           	height : 800,
	           	callback : function(data) { // 팝업창을 닫을 때 실행
	           		if(data != "[object Object]" && data != "" && data != null){
	           			$('#searchBarCode').val(data);
	           		}
	           	}
	      });
     });

   	 //국사 조회
   	 $('#btnMtsoSearch').on('click', function(e) {
   		 $a.popup({
   	          	popid: 'MtsoLkup',
   	          	title: configMsgArray['findMtso'],
   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
   	            windowpopup : true,
   	            modal: true,
                movable:true,
   	            width : 950,
   	           	height : window.innerHeight * 0.8,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	                $('#regInfMtsoNm').val(data.mtsoNm);
   	                if($('#regInfMtsoId').val() != data.mtsoId){
   	   	                $('#rackId').val('');
   	   	                $('#rackNm').val('');
   	   	                $('#sPos').clear();
   	                }
   	                $('#regInfMtsoId').val(data.mtsoId);
	   	     		var paramRepIntgFcltsCd = {repIntgFcltsCd: data.repIntgFcltsCd};
	   	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpInstlMtsoFloorInf', paramRepIntgFcltsCd, 'GET', 'eqpInstlMtsoFloorInf');
   	           	}
   	      });
        });

 	//유닛 시작위치 선택시 이벤트
	 $('#sPos').on('change', function(e) {
		 var sPosText = $("#sPos option:selected").text();
		 if(sPosText.indexOf('사용중') != -1){
			 callMsgBox('','W', '사용중인 위치입니다. 다른 시작위치를 선택해주세요.', function(msgId, msgRst){});
			$('#sPos').setData({
				sPos : ''
			});
		 }
     });
	 //층 선택시 이벤트
	 $('#floorId').on('change', function(e) {
		 orgFloorId = $('#floorId').val();
		 if($('#regInfFloorId').val() != $('#floorId').val()){
			 $('#rackId').val('');
			 $('#rackNm').val('');
			 $('#sPos').clear();
		 }
	 });

	};

	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpInstlMtsoInf'){
    		regInf.eqpInstlMtsoInf(response);
    	}
    	if(flag == 'eqpInstlMtsoFloorInf'){
    		regInf.eqpInstlMtsoFloorInf(response);
    	}
    	if(flag == 'UnitCntList'){
			var untCnt = 0;
			$.each(response.UnitCntList, function(i, item){
				untCnt = response.UnitCntList[i].unitCnt;
			});
			if (untCnt != 0 || response.UnitCntList.length > 0) {
				if (confirm("추천 UNIT수는 "+untCnt+"입니다. 등록하시겠습니까?") == true) {
					$("#unitCnt").val(untCnt);
				}// if
			} else {
				alert("해당 장비는 추천 UNIT수가 존재하지 않습니다.");
			}
    	}
    	if(flag == 'rackUnitCurst'){
    		regInf.rackUnitCurst(response);
    	}
    	if(flag == 'BaseEq'){
			var rackId = $('#rackId').val();
			var sPos =  parseInt($("#sPos").val());
			var ePos = sPos + parseInt($("#unitCnt").val()) - 1;
			var modelNm = $('#refInfEqpRoleDivNm').val();
			var unitSize = parseInt($('#unitSize').val());
			var modelId = $("#regInfEqpId").val();
			var userId = $("#userId").val();
			var barNo = $("#searchBarCode").val();
			var dismantleFlag = $("#dismantleFlag").val();
			var barcodeFlag =  $("#barcodeFlag").val();
			var cstrStatCd =  $("#cstrStatCd").val();
			var cstrCd =  $("#cstrCd").val();
			var upDataFlag = $("#upDataFlag").val();
			var param = {rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:'', description:'', dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId, barCode : barNo, cstrStatCd : cstrStatCd, cstrCd : cstrCd};
			if (modelId == "") {
				alert("장비 정보를 불러오지 못했습니다. 다시 시도 하여 주시기 바랍니다.");
			} else if (userId == "") {
				alert("로그인 정보를 상실하였습니다. 다시 로그인하여 주시기 바랍니다.");
			} else {
				if (upDataFlag != 'Y') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertRactEq', param, 'POST', 'InsertRactEq');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRactEq', param, 'POST', 'UpdateRactEq');
    			}
			}
    	}
    	if(flag == 'InsertRactEq' || flag == 'UpdateRactEq'){
//    		if($("#upDataFlag").val() == 'Y'){
//    			//적용을 완료 하였습니다.
//    			callMsgBox('','I', '적용을 완료 하였습니다.' , function(msgId, msgRst){
//    				if (msgRst == 'Y') {
//    					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpInstlMtsoInf', paramEqpId, 'GET', 'eqpInstlMtsoInf');
//    				}
//    			});
//    		}else {
    			//적용을 완료 하였습니다.
//    			callMsgBox('','I', '적용을 완료 하였습니다.' , function(msgId, msgRst){
//    				if (msgRst == 'Y') {
    					if(($('#regInfEqpId').val()).indexOf("DV") != -1){
    						TabEqp.setGrid(1,100);
    					}else {
    						TabSbeqp.setGrid(1,100);
    					}
    	        		regInf.resetComboBox();
    	        		$('#regInfEqpId').val('');
    	        		$('#regInfEqpNm').val('');
    	        		$('#refInfEqpRoleDivNm').val('');
    	        		$('#unitCnt').val('');
    	        		$('#searchBarCode').val('');
    	        		$('#cstrCd').val('');
    	        		var data = {rackId: $('#rackId').val()};
    	        		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackUnitCurst', data, 'GET', 'rackUnitCurst');
//    				}
//    			});
//    		}
    	}
    }
	this.eqpInstlMtsoInf = function(response) {
		var orgRegInfMtsoId = $('#regInfMtsoId').val();
		$('#regInfMtsoId').val(response.eqpInstlMtsoInfList[0].mtsoId);
		$('#regInfMtsoNm').val(response.eqpInstlMtsoInfList[0].mtsoNm);
		$('#regInfEqpNm').val(response.eqpInstlMtsoInfList[0].eqpNm);
		$('#refInfEqpRoleDivNm').val(response.eqpInstlMtsoInfList[0].eqpRoleDivNm);
		if(response.eqpInstlMtsoInfList[0].rackInAttrYn == 'Y') {
			$('#upDataFlag').val('Y');
			$('#sPos').attr('disabled',true);
			$('#btnLoc').attr('disabled',true);
			$('#floorId').attr('disabled',true);
		}else{
			$('#upDataFlag').val('N');
			$('#sPos').attr('disabled',false);
			$('#btnLoc').attr('disabled',false);
			$('#floorId').attr('disabled',false);
		}
		if(orgRegInfMtsoId != $('#regInfMtsoId').val()){
			$('#rackId').val(response.eqpInstlMtsoInfList[0].rackId);
			$('#rackNm').val(response.eqpInstlMtsoInfList[0].label);
			$('#regInfFloorId').val(response.eqpInstlMtsoInfList[0].floorId);
		}
		$('#regInfSPos').val(response.eqpInstlMtsoInfList[0].sPos);
		$('#unitCnt').val(response.eqpInstlMtsoInfList[0].unitCnt);
		$('#dismantleFlag').setData({
			dismantleFlag : response.eqpInstlMtsoInfList[0].dismantleFlag
		});
		$('#barcodeFlag').setData({
			barcodeFlag : response.eqpInstlMtsoInfList[0].barcodeFlag
		});
		$('#searchBarCode').val(response.eqpInstlMtsoInfList[0].barNo);
		$('#cstrStatCd').setData({
			cstrStatCd : response.eqpInstlMtsoInfList[0].cstrStatCd
		});
		$('#cstrCd').val(response.eqpInstlMtsoInfList[0].cstrCd);
		var paramRepIntgFcltsCd = {repIntgFcltsCd: response.eqpInstlMtsoInfList[0].repIntgFcltsCd};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpInstlMtsoFloorInf', paramRepIntgFcltsCd, 'GET', 'eqpInstlMtsoFloorInf');
		if($('#rackId').val() != '' && $('#rackId').val() != null && $('#rackId').val() != undefined){
			var data = {rackId: $('#rackId').val()};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackUnitCurst', data, 'GET', 'rackUnitCurst');
		}
	}
	this.eqpInstlMtsoFloorInf = function(response) {
		$('#floorId').clear();
		var option_data = [{floorId: '', floorLabel: '선택하세요'}];
		if(response.eqpInstlMtsoFloorInfList.length == 0){
			callMsgBox('','W', '층정보가 없는 국사입니다. 층을 생성하거나 다른 국사를 선택해 주세요.', function(msgId, msgRst){});
		}else{
			for(var i=0; i<response.eqpInstlMtsoFloorInfList.length; i++){
				var resObj = response.eqpInstlMtsoFloorInfList[i];
				if(orgFloorId == resObj.floorId){
					selectFloorId = orgFloorId;
				}
				option_data.push(resObj);
			}
		}
		if($('#regInfFloorId').val() == '' || $('#regInfFloorId').val() == null) {
			if(selectFloorId == '' || selectFloorId == null){
				if(response.eqpInstlMtsoFloorInfList.length == 1){
					$('#floorId').setData({
						data : option_data,
						floorId : response.eqpInstlMtsoFloorInfList[0].floorId
					});
					orgFloorId = response.eqpInstlMtsoFloorInfList[0].floorId;
				}else{
					$('#floorId').setData({
						data : option_data
					});
				}
			}else{
				$('#floorId').setData({
					data : option_data,
					floorId: selectFloorId
				});
			}
		}else {
			$('#floorId').setData({
				data : option_data,
				floorId: $('#regInfFloorId').val()
			});
			orgFloorId = $('#regInfFloorId').val();
		}
	}

	this.rackUnitCurst = function(response) {
		var tmp = response.rackUnitCurst[0];
		if(tmp == null || tmp == ''){
			if(alertFlag == 'N'){
				callMsgBox('','W', '랙 정보가 없습니다. 랙을 편집하거나 다른 랙을 선택해 주세요', function(msgId, msgRst){});
				alertFlag = 'Y';
			}
		}else{
			var sPos = tmp.sPos;
			if (sPos != undefined && sPos != null && sPos != "") {
				sPosTmp = (tmp.sPos).split(",");
			} else {
				sPosTmp = "";
			}
			var ePos = tmp.ePos;
			if (ePos != undefined && ePos != null && ePos != "") {
				ePosTmp = (tmp.ePos).split(",");
			} else {
				ePosTmp = "";
			}
//			sPosTmp = (tmp.sPos).split(",");
//			ePosTmp = (tmp.ePos).split(",");
			$('#unitSize').val(tmp.unitSize);
			$('#rowCnt').val(tmp.rowCnt);
			$('#regInfFloorId').val(tmp.floorId);
			var flag = true;
			if(tmp.unitSize == 0){
				callMsgBox('','W', '해당 랙은 크기가 0으로 실장할 수 없습니다. UNIT크기를 늘려주세요.', function(msgId, msgRst){});
			}else{
				$('#rackNm').val(tmp.label);
	    		$('#sPos').clear();
	    		var option_data = [{value: '', text: '선택하세요'}];
	    		var cnt = 0;
				for(var i=tmp.unitSize; i>=1; i--){
					flag = true;
		    		for(var j=0; j<tmp.rowCnt; j++){
		    			if(sPosTmp[j] <= i && i <= ePosTmp[j]){
		    				flag = false;
		    			}
		    		}
		    		if(flag == true) {
		    			var resObj = {value: i, text: i};
		    			option_data.push(resObj);
		    			cnt++;
		    		}
		    		else {
		    			if($('#upDataFlag').val() == 'Y'){
			    			var resObj = {value: i, text: i+'(사용중)'};
			    			option_data.push(resObj);
		    			}
		    		}
				}
				if(cnt == 0 && $('#upDataFlag').val() != 'Y') {
						callMsgBox('','W', '해당 랙은 전체 유닛이 사용중입니다. 다른 랙을 선택해 주세요.', function(msgId, msgRst){});
						 $('#rackId').val('');
						 $('#rackNm').val('');
						 $('#sPos').clear();
				}else{
					if($('#regInfSPos').val() == '' || $('#regInfSPos').val() == null) {
						$('#sPos').setData({
							data : option_data
						});
					}
					else {
						$('#sPos').setData({
							data : option_data,
							sPos: $('#regInfSPos').val()
						});
					}
				}
			}
		}
	}

    $.fn.formReset = function() {
    	return this.each(function() {
    		var type = this.type,
    			tag = this.tagName.toLowerCase()
    		if (tag === "div") {
    			return $(":input", this).formReset('')
    		}
    		if (type === "text" || type === "password" || type == "hidden" || tag === "textarea" || type === "number") {
				this.value = ""
    		}
    		else if (type === "checkbox" || type === "radio") {
    			this.checked = false
    		}
    		else if (tag === "select") {
//        			this.selectedIndex = 0
    			$('#'+this.id).clear();
//        			$('#'+this.id+' option:eq(0)').attr('selected','selected');
    		}
    	})
    }

    this.resetComboBox = function() {
    	var option_data = [];
    	//철거대상여부
    	$('#dismantleFlag').clear();
    	option_data = [{cd: '', cdNm: '선택하세요'}, {cd: 'Y', cdNm: '대상'}, {cd: 'N', cdNm: '미대상'}];
		$('#dismantleFlag').setData({
			data : option_data
		});
		//바코드 대상여부
		$('#barcodeFlag').clear();
		option_data = [{cd: '', cdNm: '선택하세요'}, {cd: 'Y', cdNm: '대상'}, {cd: 'N', cdNm: '미대상'}];
		$('#barcodeFlag').setData({
			data : option_data
		});
		//공사진행상태
		$('#cstrStatCd').clear();
		option_data = [{cd: '0', cdNm: '선택하세요'}, {cd: '1', cdNm: 'ENG SHEET 예약'}, {cd: '2', cdNm: '장비 개통 등록'}];
		$('#cstrStatCd').setData({
			data : option_data
		});
    }

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    	      callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
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