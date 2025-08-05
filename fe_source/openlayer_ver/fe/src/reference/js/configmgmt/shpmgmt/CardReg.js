/**
 * 	CardReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var chrrOrgGrpCd = null;
	var mgmtGrpNmCard = null;
	var gridId = 'portDataGrid';
	var cardMdlIdParam = null;
	var eqpRoleDivCdParam = null;
	var capaCdData = [];
	var tmptInfData = [];
	var eqpIdParam = '';  //[20171121]
	var eqpMdlNmParam = '';
	var cardMdlData = [];

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('.reg_display_opt').css("display","none");

    	//alert(param.regYnCard);
    	if(param.regYnCard == "Y"){
    		paramData = param;
    	}else
    		$('#cardIdReg').val("CD***********");

//    	document.getElementById('cardDtlTab').click();
    	initGrid();
        setSelectCode();
        setEventListener();
        setRegDataSet(param);

        /* [20171121] */
        stndPortInfTmpt.init();
        eqpIdParam = param.eqpId;
        eqpMdlNmParam = param.eqpMdlNm;
        param.portNmChk = $("#cardNm").val();
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/stndPortInf', param, 'GET', 'stndPortInf');
        /*_[20171121] */

    };

    function initData() {
    	$('#cardNm').val("");
    	$('#barNoCard').val("");
    	$('#staPortNoVal').val("");
    	$('#instlDt').val("");
    	$('#mnftYm').val("");
    	$('#cardRmk').val("");
    	$('#eqpIdCard').val("");
    	$('#eqpNmCard').val("");
    	$('#slotNo').val("");
    }

function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
        	rowInlineEdit : true,
        	cellSelectable : false,
    		autoResize: true,
    		height:"5row",
    		defaultState: {
    			dataAdd: {editing: true},
    			dataSet: {editing: true}
    		},
    		columnMapping: [{
				key : 'portNm', align:'center',
				title : '포트명',
				width: '100px'
    		}, {
    			key : 'portCapaCd', align:'center',
				title : '포트용량',
				width: '100px',
				render : {
      	    		type : 'string',
      	    		rule : function(value, data) {
      	    			var render_data = [];
      	    			if(capaCdData.length > 1) {
      	    				return render_data = render_data.concat(capaCdData);
      	    			}else {
      	    				return render_data.concat({value : data.value, text : data.text });
      	    			}
      	    		}
      	    	},
      	    	editable:{
      	    		type:"select",
      	    		rule : function(value, data){
      	    			return capaCdData;
      	    		}, attr : {
			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
			 			}
      	    	},
  				editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val();
  				}
    		}, {
    	        key: 'portRmk',
    	        align: 'center',
    	        title: '포트비고',
    	        width: '80px',
    	        editable: true
    	      }, {
    	        key: 'stndRackNo',  // stndRackNo ... stndPortNo추가[20171121]
    	        align: 'center',
    	        title: 'RaNo',
    	        width: '30px'
    	      }, {
    	        key: 'stndShelfNo',
    	        align: 'center',
    	        title: 'ShNo',
    	        width: '30px'
    	      }, {
    	        key: 'stndSlotNo',
    	        align: 'center',
    	        title: 'SlNo',
    	        width: '30px'
    	      }, {
    	        key: 'stndSubSlotNo',
    	        align: 'center',
    	        title: 'SuNo',
    	        width: '30px'
    	      }, {
    	        key: 'stndPortNo',
    	        align: 'center',
    	        title: 'PoNo',
    	        width: '30px'
    	      },{//숨김 데이터
				key : 'wavlVal', align:'center',
				title : '파장',
				width: '120px',
				hidden : true
			},{//숨김 데이터
				key : 'chnlVal', align:'center',
				title : '재널',
				width: '120px',
				hidden : true
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    function setRegDataSet(data) {

		$('#regYnCard').val("");

		if($("#chrrOrgGrpCd").val() == ""){
			chrrOrgGrpCd = "SKT";
		}else{
			chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		}

		if(chrrOrgGrpCd == "SKB"){
			$('#cardNmB').show();
			$('#cardNmT').hide();
//			$('#tmptInf').show();
		}else{
			$('#cardNmT').show();
			$('#cardNmB').hide();
//			$('#tmptInf').hide();
		}

		$('#portCntCard').setEnabled(false);

    	if(data.regYnCard == "Y"){  //수정
    		initData(); //항목초기화
    		document.getElementById('regBtnArea').style.display="none";
    		$('#btnEqpSearch3').hide();//장비 변경 불가
        	$('#regYnCard').val("Y");

        	$('#autoRegYn').val(data.autoRegYn);
        	$('#cardRegArea').setData(data);

        	cardMdlIdParam = data.cardMdlId;
        	eqpRoleDivCdParam = data.eqpRoleDivCd;

        	var param =  $("#cardRegForm").getData();

        	var eqpId = $('#eqpIdCard').val();
        	var cardNm = $("#cardNm").val();


        	if(eqpId != ""){
        	  //선택한 장비에 해당하는 rack 리스트업
               httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+eqpId, null, 'GET', 'regRackList');

             //선택한 장비에 해당하는 부모card 리스트업
               httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regPrntCardList', param, 'GET', 'regPrntCardList');

	  	        if(data.eqpRoleDivCd != "15" && data.eqpRoleDivCd != "16"){
	         		$('#wavlVal').setData({
	         			data:[{wavlVal: "",wavlValNm: "선택"}]
	         		});
	         		$('#wavlVal').setEnabled(false);
	         	}else{
	         		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/wavlVal/'+ eqpId, null, 'GET', 'wavlVal');
	         	}

	  	      $('#'+gridId).alopexGrid('dataEmpty');

	   	        //mgmtGrpNmCard = $("#mgmtGrpNm").val(); // winPop에서 호출시 값을 유실함[20171121]
	  	        mgmtGrpNmCard = data.mgmtGrpNm;

	   	        $('#cardNmT').show();
	   	        $('#cardNmB').hide();
	   	        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', param, 'GET', 'cardMdl');
	   	        httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'portCapaCd');
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/tmptInf', param, 'GET', 'tmptInfReg');
//	    		alert(mgmtGrpNmCard);
//	   	        tmptInfReg();

	    		$('#cardNm').setEnabled(false);

	    		if(data.cardMdlNm.indexOf("5GPON_MAIN") > -1 || data.cardMdlNm.indexOf("5GPON_SUB") > -1){
	   				$('#portCntCard').setEnabled(false);
	   				$('#cardMdlPop').setEnabled(false);
	    		}else{
	    			$('#portCntCard').setEnabled(true);
	    		}

		   	    //SKT이고 자동수집여부가 Y인 경우 일부 카드정보 및 포트수정 못하도록
		   	    if (mgmtGrpNmCard == 'SKT' && $('#autoRegYn').val() == "YES") {
		   	    	$('#rackList').setEnabled(false);
		   	    	$('#shlfList').setEnabled(false);
		   	    	$('#slotNo').setEnabled(false);
		   	    	$('#cardMdlPop').setEnabled(false);
		   	    	$('#portCapa').setEnabled(false);
		   	    	$('#portCntCard').setEnabled(false);
		   	    	$('#'+gridId).alopexGrid({rowInlineEdit : false,
				   		 defaultState: {
			    			dataAdd: {editing: false},
			    			dataSet: {editing: false}
			    	}});
		   	    }

        	}


    	}else{ //등록
    		var eqpId = null;
    		//자동등록여부 셋팅
    		$('#autoRegYn').val("NO");

    		if(data.fromCardReg == "Y" || data.fromPortReg == "Y"){
    			$('#cardRegArea').setData(data);
    			var param =  $("#cardRegForm").getData();
    			eqpId = $('#eqpIdCard').val();

    			//카드ID 생성
//    			setCardId();

    			//선택한 장비에 해당하는 rack 리스트업
                httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+eqpId, null, 'GET', 'regRackList');

                //선택한 장비에 해당하는 부모card 리스트업
                httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regPrntCardList', param, 'GET', 'regPrntCardList');

   	           	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/wavlVal/'+ eqpId, null, 'GET', 'wavlVal');

      	       //mgmtGrpNmCard = $("#mgmtGrpNm").val(); // winPop에서 호출시 값을 유실함[20171121]
	  	        mgmtGrpNmCard = data.mgmtGrpNm;

	   	        param.eqpId = data.eqpId;
		   	    if(mgmtGrpNmCard == "SKB"){

		   	    	$('#cardNmB').show();
		 			$('#cardNmT').hide();

		 			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardNmB', param, 'GET', 'cardNm');
		 			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', param, 'GET', 'cardMdl');
		 			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'portCapaCd');
		   	    }else{
		 			$('#cardNmT').show();
		 			$('#cardNmB').hide();
		 			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', param, 'GET', 'cardMdl');
		 			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'portCapaCd');
		 		}

		   	    $('#portCntCard').setEnabled(true);
		   	    $('#portCntCard').val('');  // [20171121]

    		}else{
    			$('#wavlVal').setData({
	    			data:[{wavlVal: "",wavlValNm: "선택"}]
	    		});
	        	$('#wavlVal').setEnabled(false);

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+eqpId, null, 'GET', 'regRackList');
    		}
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regShlfList', null, 'GET', 'regShlfList');

    		//장비 선택 전 부모card 리스트는 없음
        	var option_data =  [{prntCardId: "", prntCardNm: "선택"}];
    		$('#prntCard').setData({
                 data:option_data
    		});

    		var option_data =  [{cardNmB: "", cardNm: "선택"}];
    		$('#cardNmSkb').setData({
                 data:option_data
    		});

    		var option_data =  [{cardMdlId: "", cardMdlNm: "선택"}];
    		$('#cardMdlPop').setData({
                 data:option_data
    		});

    		var option_data =  [{value: "",text: "선택"}];
    		$('#portCapa').setData({
                 data:option_data
    		});
    		//rack 선택 전 shelf 리스트는 없음
    		/*
        	var option_data =  [{shlfNo: "", shlfNm: "선택"}];
    		$('#shlfList').setData({
                 data:option_data
    		});
    		*/
        }

    	//5G-PON 카드명 정규식 체크
        $('#ruleChkErr').hide();
        $('#ruleChk').hide();
    	$('#cardRule').val("");
    	$('#cardRuleErrMsg').val("");
    }



    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	//card 모델
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', null, 'GET', 'cardMdl');
    	//card 상태
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardStatCdList', null, 'GET', 'cardStatCdList');
    	//card 역할 구분 코드 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00542', null, 'GET', 'cardRoleDivCd');
    }

    function setEventListener() {

    	//장비 조회, 장비 선택 시 rack 리스트 초기화
   	 	$('#btnEqpSearch3').on('click', function(e) {
	   		 $a.popup({
	   	          	popid: 'EqpLkup',
	   	          	title: '장비조회',
	   	            //url: $('#ctx').val()+'/configmgmt/equipment/EqpLkup.do',
	   	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
	   	            modal: true,
                    movable:true,
	   	            width : 950,
	   	           	height : window.innerHeight * 0.83,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	           		if (data.adamsMdlYn == 'Y')  {
	   	           			callMsgBox('','I', "SKB 장비중 ADAMS 연동 모델은 선택 할 수 없습니다.", function(msgId, msgRst){});
	   	           		}else {
	   	           		mgmtGrpNmCard = data.mgmtGrpNm;
					   	eqpRoleDivCdParam = data.eqpRoleDivCd;

				   	    if(data.portPveRegIsolYn == 'Y'){  //[20171019]
				   	    	setEnableObjByPortPveReg(false, mgmtGrpNmCard);

				   	    	alertBox('W','수동등록 할 수없는 모델입니다.');
		   	   		        return;
				 		} else {

				 			setEnableObjByPortPveReg(true, mgmtGrpNmCard);

				 			$('#eqpNmCard').val(data.eqpNm);
					   	    $('#eqpIdCard').val(data.eqpId);
					   	    $('#eqpMdlIdCard').val(data.eqpMdlId);
					   	    $('#intgFcltsCd').val(data.intgFcltsCd);
					   	    $("#cardNm").val("");
					   	    $('#cardNmSkb').clear();
					   	    $('#pttnStrVal').val("");
					   	    $('#pttnDivVal').val("");
					   	    $('#sepVal').val("");
					   	    $('#portCapa').clear();
					   	    $("#portCntCard").val("");
					   	    eqpIdParam = data.eqpId;  //[20171121]
	//				   	    $('#mgmtGrpNmCard').val(data.mgmtGrpNm);
					 		//카드ID 생성
//				    		setCardId();

		   	                //선택한 장비에 해당하는 rack 리스트업
		   	                httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+data.eqpId, null, 'GET', 'regRackList');

		   	                var param =  $("#cardRegForm").getData();
		   	                //선택한 장비에 해당하는 부모card 리스트업
		   	                httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regPrntCardList', param, 'GET', 'regPrntCardList');
			   	           //card 모델

				   	        if(data.eqpRoleDivCd == "15" || data.eqpRoleDivCd == "16"){
			            		$('#wavlVal').setEnabled(true);
			            		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/wavlVal/'+ data.eqpId, null, 'GET', 'wavlVal');
			            	}

				   	        $('#'+gridId).alopexGrid('dataEmpty');

				   	        $('#portCntCard').setEnabled(true);

					   	     if(mgmtGrpNmCard == "SKB"){
					 			$('#cardNmB').show();
					 			$('#cardNmT').hide();
					 			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardNmB', param, 'GET', 'cardNm');
					 			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', param, 'GET', 'cardMdl');
					 			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'portCapaCd');
					 		}else{
					 			$('#cardNmT').show();
					 			$('#cardNmB').hide();
					 			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', param, 'GET', 'cardMdl');
					 			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'portCapaCd');

					 		}
				 	    }
	   	           	}
	   	           	}
	   	      });
        });

	   	//바코드조회
	   	 $('#btnBarNoSearch').on('click', function(e) {

	   		 if ($('#eqpIdCard').val() == "") {
	 	    		//필수입력 항목입니다.[ 장비 ]
	   			 	callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	 	     		return;
	 	     	 }

	   		 var param =  {"sisulGbn": "intgFclts"
			    			 , "sisulCd": $('#intgFcltsCd').val()};

	   		 $a.popup({
	   	          	popid: 'BarcodeInfoListPop',
	   	          	title: '바코드조회',
	   	            //url: $('#ctx').val()+'/configmgmt/shpmgmt/BarcodeInfoListPop.do',
	   	            url: '/tango-transmission-web/configmgmt/shpmgmt/BarcodeInfoListPop.do',
	   	            data: param,
	   	            modal: true,
	                   movable:true,
	   	            width : 1300,
	   	           	height : window.innerHeight * 0.82,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	                $('#barNoCard').val(data);
	   	           	}
	   	      });
        });


   	 	//rack 선택 시 shelf 리스트 초기화
   	 	$('#rackList').on('click', function(e) {

   	 		if($('#eqpIdCard').val() == ""){
	   	 		//필수입력 항목입니다. [ 장비 ]
	   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
   	 		}else{
	   	 		//rack 값 세팅
		   	 	var rackNoNew = $('#rackList').val();
	   	 		$('#rackNoNew').val(rackNoNew);
	   	 		$('#rackNo').val(rackNoNew);
	   	 		//alert($('#rackNo').val());

	   	 		var param =  $("#cardRegForm").getData();
	            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regShlfList', param, 'GET', 'regShlfList');

   	 		}

        });

   	 	//shelf 선택 시 값 세팅
   	 	$('#shlfList').on('click', function(e) {
   	 		//alert($('#rackNo').val());
   	 		if($('#rackNo').val() == ""){
	   	 		//필수 선택 항목입니다.[ Rack ]
	   	 		callMsgBox('','W', makeArgConfigMsg('requiredOption'," Rack "), function(msgId, msgRst){});
		 		}else{
	 			var shlfNo = $('#shlfList').val();
	   	 		$('#shlfNo').val(shlfNo);
		   	 	//var shlfNoNew = $('#shlfList').val();
	   	 		//$('#shlfNoNew').val(shlfNoNew);
	   	 		//$('#shlfNo').val(shlfNoNew);
	 		}
        });

   	 	//카드명 변경 시 값 세팅
	   	 $('#cardNmSkb').on('change', function(e) {
			 if($('#eqpIdCard').val() == ""){
		   	 		//필수입력 항목입니다. [ 장비 ]
		   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
		 	 }else{
	    		 var cardNm = $("#cardNmSkb").val();
	    		 var eqpId = $("#eqpIdCard").val();
	    		 $("#cardNm").val(cardNm);

	    		 var param =  $("#cardRegForm").getData();
	    		 if(mgmtGrpNmCard == "SKB"){
//	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/tmptInf', param, 'GET', 'tmptInf');
	    			 tmptInf();
	    		 }
		 	 }
	     });

	   //카드모델 변경 시 값 세팅
   	 	$('#cardMdlPop').on('change', function(e) {
   	 		var cardMdlId = $('#cardMdlPop').val();
	 		$('#cardMdlId').val(cardMdlId);

	   	 	var param =  $("#cardRegForm").getData();

	   		if(mgmtGrpNmCard == "SKB"){
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardMdlInfB', param, 'GET', 'cardMdlInf');

	   		}else{

	   			var cardMdlNm = $("#cardMdlPop").getTexts() + "";

	   			$('#cardRule').val("");
	   			$('#cardRglaExprVal').val("");
	   			$('#cardRuleErrMsg').val("");

	   			if(cardMdlNm.indexOf("5GPON_MAIN") > -1 || cardMdlNm.indexOf("5GPON_SUB") > -1){
	   				$('#portCntCard').setEnabled(false);

	   				//5G-PON 카드명 정규식 체크
	   				for(var i=0; i<cardMdlData.length; i++){
	   					if(cardMdlData[i].cardRglaExprVal != "" && cardMdlData[i].cardRglaExprVal != undefined){
	   						if(cardMdlData[i].cardMdlId == cardMdlId){

	   							$('#cardRule').val(cardMdlData[i].cardRuleRmk);
	   							$('#cardRglaExprVal').val(cardMdlData[i].cardRglaExprVal);

	   							$('#ruleChk').show();
	   							$('#ruleChkErr').show();

	   							ruleChk();

	   							break;
	   						}
	   					}
	   				}

	   				if(cardMdlNm.indexOf("5GPON_MAIN") > -1){
	   					if($('#cardRuleErrMsg').val() == ""){
	   						port5gponData("MAIN");
	   					}else{
	   						$('#'+gridId).alopexGrid('dataEmpty');
	   					}
	   				}else if(cardMdlNm.indexOf("5GPON_SUB") > -1){
	   					if($('#cardRuleErrMsg').val() == ""){
	   						port5gponData("SUB");
	   					}else{
	   						$('#'+gridId).alopexGrid('dataEmpty');
	   					}
	   				}
	   			}else if(cardMdlNm.indexOf("CMUX") > -1 || cardMdlNm.indexOf("LMUX") > -1 || eqpMdlNmParam.indexOf("5G-CMUX") > -1) {

	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardMdlInfB', param, 'GET', 'cardMdlInf');		// 포트 수 가져오기
	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getEqpMdlPortTmptInfList', param, 'GET', 'EqpMdlPortTmptInfList');

	   				$('#cardNm').setEnabled(false);

	   				$('#portCntCard').val("");
	   				$('#portCntCard').setEnabled(false);

	   				if(cardMdlNm.indexOf("_E") > -1 ) {
	   					$('#cardNm').val("E");
	   				}else if(cardMdlNm.indexOf("CMUX-Ring") > -1 ) {	//
	   					$('#cardNm').val("R")
	   				}else if(cardMdlNm.indexOf("_C") > -1 || cardMdlNm.indexOf("CLSU-2(29)") > -1) {
	   					$('#cardNm').val("D");
	   				}else {
	   					$('#cardNm').val("B")
	   				}

	   			}else if( cardMdlNm.indexOf("MDB") > -1 || cardMdlNm.indexOf("MDU") > -1|| cardMdlNm.indexOf("MXC") > -1|| cardMdlNm.indexOf("CMX") > -1) {

	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardMdlInfB', param, 'GET', 'cardMdlInf');		// 포트 수 가져오기
	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getEqpMdlPortTmptInfList', param, 'GET', 'EqpMdlPortTmptInfList');

	   				$('#cardNm').setEnabled(false);

	   				$('#portCntCard').val("");
	   				$('#portCntCard').setEnabled(false);

	   				$('#cardNm').val(cardMdlNm);

	   			}else{
	   				$('#ruleChk').hide();
	   				$('#ruleChkErr').hide();
	   				$('#portCntCard').val("");
	   				$('#portCntCard').setEnabled(true);
	   				$('#cardNm').val("");
	   				$('#cardNm').setEnabled(true);
	   				portData();
	   			}
	   		}


        });

   	 	//포트용량 수정시 그리드 값 셋팅
	   	 $('#portCapa').on('change', function(e) {
	   		var cardMdlNm = $("#cardMdlPop").getTexts() + "";

	       	if(cardMdlNm.indexOf("5GPON_MAIN") > -1){
	       		if($('#cardRuleErrMsg').val() == ""){
		       		port5gponData("MAIN");
	       		}else{
	       			$('#'+gridId).alopexGrid('dataEmpty');
	       		}
	       	}else if(cardMdlNm.indexOf("5GPON_SUB") > -1){
	       		if($('#cardRuleErrMsg').val() == ""){
		       		port5gponData("SUB");
	       		}else{
	       			$('#'+gridId).alopexGrid('dataEmpty');
	       		}
	       	}else if(cardMdlNm.indexOf("CMUX") > -1 || cardMdlNm.indexOf("LMUX") > -1 || eqpMdlNmParam.indexOf("5G-CMUX") > -1 ) {

    			var param =  $("#cardRegForm").getData();
   				httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardMdlInfB', param, 'GET', 'cardMdlInf');		// 포트 수 가져오기
   				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getEqpMdlPortTmptInfList', param, 'GET', 'EqpMdlPortTmptInfList');

   				$('#cardNm').setEnabled(false);

   				$('#portCntCard').val("");
   				$('#portCntCard').setEnabled(false);

   				if(cardMdlNm.indexOf("_E") > -1 ) {
   					$('#cardNm').val("E");
   				}else if(cardMdlNm.indexOf("CMUX-Ring") > -1 ) {	//
   					$('#cardNm').val("R")
   				}else if(cardMdlNm.indexOf("_C") > -1 || cardMdlNm.indexOf("CLSU-2(29)") > -1) {
   					$('#cardNm').val("D");
   				}else {
   					$('#cardNm').val("B")
   				}

    		}else if(cardMdlNm.indexOf("MDB") > -1 || cardMdlNm.indexOf("MDU") > -1|| cardMdlNm.indexOf("MXC") > -1|| cardMdlNm.indexOf("CMX") > -1) {

    			var param =  $("#cardRegForm").getData();
   				httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardMdlInfB', param, 'GET', 'cardMdlInf');		// 포트 수 가져오기
   				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getEqpMdlPortTmptInfList', param, 'GET', 'EqpMdlPortTmptInfList');

   				$('#cardNm').setEnabled(false);

   				$('#portCntCard').val("");
   				$('#portCntCard').setEnabled(false);

   				$('#cardNm').val(cardMdlNm);


    		}else{
	       		portData();
	       	}
	     });

	   	 //포트수 수정시 그리드 값 셋팅
	   	 $('#portCntCard').keyup(function(e) {
	   	 // portData();  // 파싱 이후 결과를 Grid에 출력해야하는데..
         //                 SuccessCallback()이 portData()보다 늦게 실행되서.. 값이 나오지 않았다..그래서..
         //                 portData()위치를 SuccessCallback()함수 안으로 변경했다..
           var param = {
               portNmChk: $("#cardNm").val(),
               eqpId: eqpIdParam
           };
           httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/stndPortInf', param, 'GET', 'stndPortInf');/* [20171121] */
	     });

	   //카드명 수정시 그리드 값 셋팅
	   	 $('#cardNm').keyup(function(e) {
	   	   // portData();

	   		var cardMdlNm = $("#cardMdlPop").getTexts() + "";

	       	if(cardMdlNm.indexOf("5GPON_MAIN") > -1){
	       		ruleChk();
	       		if($('#cardRuleErrMsg').val() == ""){
		       		port5gponData("MAIN");
	       		}else{
	       			$('#'+gridId).alopexGrid('dataEmpty');
	       		}
	       	}else if(cardMdlNm.indexOf("5GPON_SUB") > -1){
	       		ruleChk();
	       		if($('#cardRuleErrMsg').val() == ""){
		       		port5gponData("SUB");
	       		}else{
	       			$('#'+gridId).alopexGrid('dataEmpty');
	       		}
	       	}else{
	       		var param = {
	     	           portNmChk: $("#cardNm").val(),
	     	           eqpId: eqpIdParam
	     	         };

	       		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/stndPortInf', param, 'GET', 'stndPortInf');/* [20171121] */
	       	}
	     });

	   	$('#cardNm').on('click', function(e) {
	   		 if($('#cardRglaExprVal').val() != ""){
	       		 $('#ruleChk').show();
	       		 $('#ruleChkErr').show();
	   		 }
        });

	   	$('#cardNm').on('blur', function(e) {
	   		 if($('#cardMdlId').val() != "" && $('#cardRuleErrMsg').val() == ""){
		    		 $('#ruleChk').hide();
		    		 $('#ruleChkErr').hide();
	   		 }
	    });

   	 	//카드명 선택 시 값 세팅
	   	 $('#cardNmSkb').on('click', function(e) {
		   	 	if($('#eqpIdCard').val() == ""){
			 			//필수입력 항목입니다. [ 장비 ]
		   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
		 		}
	     });

   	 	//카드모델 선택 시 값 세팅
   	 	$('#cardMdlPop').on('click', function(e) {
	   	 	if($('#eqpIdCard').val() == ""){
		 			//필수입력 항목입니다. [ 장비 ]
	   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	 		}
        });

   	 	//포트용량 선택 시 값 세팅
   	 	$('#portCapa').on('click', function(e) {
	   	 	if($('#eqpIdCard').val() == ""){
		 			//필수입력 항목입니다. [ 장비 ]
	   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	 		}
        });

   	 	//부모카드 선택 시 값 세팅
   	 	$('#prntCard').on('click', function(e) {
   	 		if($('#eqpIdCard').val() == ""){
   	 			//필수입력 항목입니다. [ 장비 ]
	   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	 		}else{
	   	 		var prntCardId = $('#prntCard').val();
	   	 		$('#prntCardId').val(prntCardId);
	 		}
        });

   	 	//카드상태 선택 시 값 세팅
   	 	$('#cardStat').on('click', function(e) {
   	 		var cardStatCd = $('#cardStat').val();
   	 		$('#cardStatCd').val(cardStatCd);
        });

	   	 //Shelf등록 버튼 클릭
   	 	 $('#btnRegShlf2').on('click', function(e) {
   	 		$a.close();
   	 		dataParam = {"regYnShlf" : "N", "fromShlfReg":"Y", "eqpId": $('#eqpIdCard').val(), "eqpNm": $('#eqpNmCard').val()};
	   	 	//popup('ShlfReg', $('#ctx').val()+'/configmgmt/shpmgmt/ShlfReg.do', '형상 Shelf 등록', dataParam);
	   	    popup('ShlfReg', '/tango-transmission-web/configmgmt/shpmgmt/ShlfReg.do', '형상 Shelf 등록', dataParam);
	   	 });

    	//삭제
   	 	 /*
	   	 $('#btnDelDtl3').on('click', function(e) {
	        	//tango transmission biz 모듈을 호출하여야한다.
	 		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
		       //삭제한다고 하였을 경우
		        if (msgRst == 'Y') {
		         cardDel();
		        }
		      });
        });
	   	 */

    	/*

    	//형상 정보 조회
	   	 $('#btnShpInfLkupReg').on('click', function(e) {
    		 popupList('btnShpInfLkupReg', $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do', '형상 정보 조회');
         });
         */

   	 	$('#instlDt').keyup(function(e) {
   	 		if(!$("#instlDt").validate()){
	   			//설치일자(YYYYMMDD)는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',"설치일자(YYYYMMDD)"), function(msgId, msgRst){});
	   			$('#instlDt').val("");
	   			 return;
	   		};
   	 	});

   	 	$('#mnftYm').keyup(function(e) {
	 		if(!$("#mnftYm").validate()){
	   			//제조년월(YYYYMM)는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',"제조년월(YYYYMM)"), function(msgId, msgRst){});
	   			$('#mnftYm').val("");
	   			 return;
	   		};
	 	});

   	 	$('#slotNo').keyup(function(e) {
	 		if(!$("#slotNo").validate()){
	   			//Slot번호는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',"Slot번호"), function(msgId, msgRst){});
	   			$('#slotNo').val("");
	   			 return;
	   		};
	 	});

//	   	 $('#'+gridId).on('cellValueChanged', function(e){
//	   		 alert("aaa");
//	   	 });
//
//	   	$('#'+gridId).on('cellSelectionChange', function(e){
//	   		 alert("bbb");
//	   	 });
//
//	   	$('#'+gridId).on('dataChanged', function(e){
//	   		var ev = AlopexGrid.parseEvent(e);
//	   		alert(ev.type);
//	   	 });

    	//취소
    	 $('#btnCnclReg3').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg3').on('click', function(e) {

			 if($('#eqpNmCard').val() == ''){
    			//필수입력 항목입니다. [ 장비 ]
    			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
    			return;
			 }

			 if($('#cardNm').val() == ''){
				//필수입력 항목입니다. [ Card명 ]
				callMsgBox('','W', makeArgConfigMsg('required'," Card명 "), function(msgId, msgRst){});
				return;
			 }

			 if ($('#cardRuleErrMsg').val() != "") {
	     		callMsgBox('','W', '카드명의 표기법이 옳바르지 않습니다.', function(msgId, msgRst){});
	     		return;
	     	 }

			 if($('#cardMdlPop').val() == ''){
    			//필수 선택 항목입니다.[ Card모델 ]
    			callMsgBox('','W', makeArgConfigMsg('requiredOption'," Card모델 "), function(msgId, msgRst){});
    			return;
    		 }

			 if($('#cardStat').val() == ''){
    			//필수 선택 항목입니다.[ Card상태 ]
    			 callMsgBox('','W', makeArgConfigMsg('requiredOption'," Card상태 "), function(msgId, msgRst){});
    			 return;
    		 }

			 if($('#rackList').val() != '' && $('#shlfList').val() == ''){
    			//필수 선택 항목입니다.[ Shelf ]
    			 callMsgBox('','W', makeArgConfigMsg('requiredOption'," Shelf "), function(msgId, msgRst){});
    			 return;
    		 }

			 if($('#rackList').val() == '' && $('#shlfList').val() != ''){
    			//필수 선택 항목입니다.[ Rack ]
    			 callMsgBox('','W', makeArgConfigMsg('requiredOption'," Rack "), function(msgId, msgRst){});
    			 return;
    		 }

 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {

 		        	var regYn = $('#regYnCard').val();

 		        	if(regYn == "Y"){	// 수정
 		        	cardReg();
 		        	}else
 		        		setCardId();




 		        }
 		      });

         });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'CardReg') {
    		if(response.Result == "Success"){
    			if (mgmtGrpNmCard == 'SKT' && $('#autoRegYn').val() == "YES") {
            	}else{
            		portReg();
            	}

        		//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        		       if (msgRst == 'Y') {
        		           $a.close();
        		       }
        		});

        		param = response.resultList;
        		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO004Send', param, 'POST', '');

        		var pageNo = $("#pageNoDtl", parent.document).val();
        		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

                $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridCard','1','100');");

    		}else if(response.Result == "DupCardNm"){
    			callMsgBox('','I', "중복된 카드명이 있습니다." , function(msgId, msgRst){});
        	}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}

    	}

    	if(flag == 'CardUpt') {

            if(response.Result == "Success"){
    			if (mgmtGrpNmCard == 'SKT' && $('#autoRegYn').val() == "YES") {
            	}else{
            		portReg();
            	}

    			//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    	 		       if (msgRst == 'Y') {
    	 		           $a.close();
    	 		       }
        		});

        		param = response.resultList;
        		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO004Send', param, 'POST', '');
        		var pageNo = $("#pageNoDtl", parent.document).val();
        		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

                $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridCard','1','100');");

        	}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'CardDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		 });

    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridCard','1','100');");
    	}

    	if(flag == 'cardMdl'){
    		//5GPON 정규식 임시 저장
    		cardMdlData = response;

			$('#cardMdlPop').clear();
			var option_data =  [{cardMdlId: "", cardMdlNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
    			$('#cardMdlPop').setData({
    	             data:option_data
    			});
    		} else {
    			$('#cardMdlPop').setData({
    	             data:option_data,
    	             cardMdlId:paramData.cardMdlId
    			});

    			var cardMdlId = $('#cardMdlPop').val();
    	 		$('#cardMdlId').val(cardMdlId);

    	   	 	var param =  $("#cardRegForm").getData();

//    	   		if(mgmtGrpNmCard == "SKB"){
//    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardMdlInfB', param, 'GET', 'cardMdlInfReg');
//    	   		}
    		}
		}

    	if(flag == 'regPrntCardList'){
			$('#prntCard').clear();
			var option_data =  [{prntCardId: "", prntCardNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
    			$('#prntCard').setData({
    	             data:option_data
    			});
    		} else {
    			$('#prntCard').setData({
    	             data:option_data,
    	             prntCardId:paramData.prntCardId
    			});
    		}
		}

    	if(flag == 'cardStatCdList'){
			$('#cardStat').clear();
			var option_data =  [{cardStatCd: "", cardStatNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
    			$('#cardStat').setData({
    	             data:option_data
    			});
    			$('#cardStat').setSelected("0001");
    		} else {
    			$('#cardStat').setData({
    	             data:option_data,
    	             cardStatCd:paramData.cardStatCd
    			});
    		}
		}

    	if(flag == 'cardRoleDivCd'){

			$('#cardRoleDivCd').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#cardRoleDivCd').setData({
		             data:option_data
				});
			}
			else {
				$('#cardRoleDivCd').setData({
		             data:option_data,
		             cardRoleDivCd:paramData.cardRoleDivCd
				});
			}
		}

    	if(flag == 'regRackList'){

    		$('#rackList').clear();

    		var option_data =  [{rackNo: "", rackNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) { //등록
    			$('#rackList').setData({
    	             data:option_data
    			});
    		}else {										//수정
    			$('#rackList').setData({
    	             data:option_data,
    	             rackNo:paramData.rackNo
    			});
    			$('#rackNo').val(paramData.rackNo);
    			var rackNo = $('#rackNo').val();
            	var param =  $("#cardRegForm").getData();
 	           	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regShlfList', param, 'GET', 'regShlfList');

    		}

    	}

    	if(flag == 'regShlfList'){

    		$('#shlfList').clear();

    		var option_data =  [{shlfNo: "", shlfNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
    			$('#shlfList').setData({
    	             data:option_data
    			});
    		}else {
    			$('#shlfList').setData({
    	             data:option_data,
    	             shlfNo:paramData.shlfNo
    			});
    			$('#shlfNo').val(paramData.shlfNo);
    		}

    	}

    	if(flag == 'wavlVal'){

    		$('#wavlVal').clear();

			var option_data =  [{wavlVal: "",wavlValNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#wavlVal').setData({
		             data:option_data
				});
			}
			else {
				$('#wavlVal').setData({
		             data:option_data,
		             wavlVal:paramData.wavlVal
				});
			}
    	}

    	if(flag == 'cardNm'){

    		$('#cardNmSkb').clear();

    		tmptInfData = response;

			var option_data =  [{cardNmB: "",cardNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#cardNmSkb').setData({
		             data:option_data
				});
			}
			else {
				$('#cardNmSkb').setData({
		             data:option_data,
		             cardNmB:paramData.cardNm
				});

	    		 var eqpId = $("#eqpIdCard").val();
	    		 $("#cardNm").val(cardNm);

	    		 var param =  $("#cardRegForm").getData();
	    		 param.cardNm = paramData.cardNm;

	    		 if(mgmtGrpNmCard == "SKB"){
//	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/tmptInf', param, 'GET', 'tmptInf');
	    			 tmptInf();
	    		 }
			}
    	}

    	if(flag == 'tmptInfReg'){

    		$('#pttnStrVal').val(response.pttnStrVal);
    		$('#pttnDivVal').val(response.pttnDivVal);
    		$('#sepVal').val(response.sepVal);
    	}

    	if(flag == 'tmptInf'){

    		$('#pttnStrVal').val(response.pttnStrVal);
    		$('#pttnDivVal').val(response.pttnDivVal);
    		$('#sepVal').val(response.sepVal);

    		portData();
    	}

    	if(flag == 'cardMdlInf'){

    		var cardMdlNm = $("#cardMdlPop").getTexts() + "";			// CMUX면 포트세팅 함수 호출 안함

    		console.log('sdsd');

    		if(cardMdlNm.indexOf("CMUX") == -1 && cardMdlNm.indexOf("LMUX") == -1 && cardMdlNm.indexOf("MDB") == -1 && cardMdlNm.indexOf("MDU") == -1 && cardMdlNm.indexOf("MXC") == -1 && cardMdlNm.indexOf("CMX") == -1 && eqpMdlNmParam.indexOf("5G-CMUX") == -1 ) {
    			$('#portCapa').setSelected(response.cardCapaCd);
    		}


    		if(response.portCnt == "" || response.portCnt == null){
    			$('#portCntCard').val("0");
    		}else{
    			$('#portCntCard').val(response.portCnt);

    			$('#portCntCard').setEnabled(false);
    		}
//    		$('#sktSkbIntgMtsoYnReg').setSelected("NO");

    		if(cardMdlNm.indexOf("CMUX") == -1  && cardMdlNm.indexOf("LMUX") == -1 && cardMdlNm.indexOf("MDB") == -1 && cardMdlNm.indexOf("MDU") == -1 && cardMdlNm.indexOf("MXC") == -1 && cardMdlNm.indexOf("CMX") == -1 && eqpMdlNmParam.indexOf("5G-CMUX") == -1  ) {
    			portData();
    		}

    	}

    	if(flag == 'portCapaCd'){

    		//$('#portCapaCd').clear();

//    		var gridPortCapaCd = [];
    		capaCdData =  [{value: "",text: "선택"}];

    		for(var i=0; i<response.length; i++){
//				var resObj = response[i];
				capaCdData.push({value : response[i].value, text :response[i].text});
//				gridPortCapaCd.push({value : response[i].value, text :response[i].text});
			}

    		$('#portCapa').setData({
	             data:capaCdData
			});
//    		capaCdData = gridPortCapaCd;
    		if(paramData != null){
    			if(paramData.regYnCard == "Y"){
    				paramData.rackNo = "";
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', paramData, 'GET', 'shpPortList');
    			}
    		}
    	}

    	//장비ID 생성
    	if(flag == 'eqpIdReg'){

    		$("#eqpIdReg").val(response.eqpId);
    	}

    	if(flag == 'cardIdReg'){
    		$("#cardIdReg").val(response.cardId);

    		cardReg();
    	}

    	if(flag == 'shpPortList') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.shpPortList);
    		$('#portCntCard').val(response.shpPortList.length);
    	}

    	if(flag == 'portToCardReg'){
    		var param = {"eqpId":response.resultList[0].eqpId, "lastChgUserId":response.resultList[0].lastChgUserId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portNmCnt', param, 'GET', 'portNmCnt');
    	}

    	if(flag == 'portNmCnt'){
    		if(response.portNmCnt.portCnt > 0){
    			httpRequest('tango-transmission-gis-biz/transmission/gis/nm/fdflnst/updatePort?eqpId='+response.portNmCnt.eqpId+"&portCnt="+response.portNmCnt.portCnt+"&insUserId="+response.portNmCnt.lastChgUserId , null, 'GET', 'updatePort');
    		}
    	}
    	/* [20171121] */
        if (flag == 'stndPortInf') {
          if(response[0].stndPortNo != '' || response[0].stndPortNo != null) { //portNo가 없으면 해당 패턴자체가 없다고 판단.
             stndPortInfTmpt.setStndRackNo(response[0].stndRackNo);
             stndPortInfTmpt.setStndShelfNo(response[0].stndShelfNo);
             stndPortInfTmpt.setStndSlotNo(response[0].stndSlotNo);
             stndPortInfTmpt.setStndSubSlotNo(response[0].stndSubSlotNo);
             stndPortInfTmpt.setStndPortNo(response[0].stndPortNo);
          }
          portData();
        }
        if (flag == 'EqpMdlPortTmptInfList') {
        	portCmuxData(response)
        }

        /*_[20171121] */

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'CardReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'CardUpt'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'CardDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

	function tmptInf() {

		var num = $("#cardNmSkb option").index($("#cardNmSkb option:selected"))-1;

		$('#pttnStrVal').val(tmptInfData[num].pttnStrVal);
		$('#pttnDivVal').val(tmptInfData[num].pttnDivVal);
		$('#sepVal').val(tmptInfData[num].sepVal);

		//portData(); //[20171121]
	    var param = {
	        portNmChk: $("#cardNm").val(),
	        eqpId: eqpIdParam
	      };
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/stndPortInf', param, 'GET', 'stndPortInf');/* [20171121] */
	}

    function portData() {
    	var portCnt = $("#portCntCard").val();
    	var portCapaCd = $("#portCapa").val();
    	var cardMdlNm = $("#cardMdlPop").getTexts() + "";
    	var portNm		= '';
    	var data = [];

    	if ($("#pttnDivVal").val() == "3") {

    		if(cardMdlNm.indexOf("MUX/DMUX") >= 0) {	// CWDM-MUX 일 경우 모델과 카드명이 다를경우

    			var cardNm = $("#cardRegForm").getData().cardNmB;

    			if (cardNm.length <= 0) {
    				cardNm = $("#cardRegForm").getData().cardNm;
    			}

    			if(cardMdlNm.indexOf(cardNm) == -1) {
    				  $('#'+gridId).alopexGrid('dataEmpty');
    				  $('#portCntCard').val("0");
    			}
    			else {
    				$('#'+gridId).alopexGrid('dataEmpty');

    				var param =  $("#cardRegForm").getData();
    	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getEqpMdlPortTmptInfList', param, 'GET', 'EqpMdlPortTmptInfList');
    			}

    		}else {
    			 $('#'+gridId).alopexGrid('dataEmpty');

    			 var param =  $("#cardRegForm").getData();
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getEqpMdlPortTmptInfList', param, 'GET', 'EqpMdlPortTmptInfList');
    		}


    	}else{

		//    	alert($("#cardNm").val()+":"+$("#pttnDivVal").val()+":"+$("#sepVal").val()+":"+$("#pttnStrVal").val());
		    	if($("#cardNm").val() != "" && $("#cardMdlPop").val() != "" && (cardMdlNm.indexOf("CMUX") == -1 || cardMdlNm.indexOf("LMUX") == -1 || eqpMdlNmParam.indexOf("5G-CMUX") == -1 ) && (cardMdlNm.indexOf("MDB") == -1 || cardMdlNm.indexOf("MDU") == -1|| cardMdlNm.indexOf("MXC") == -1|| cardMdlNm.indexOf("CMX") == -1)){

		    		$('#'+gridId).alopexGrid('dataEmpty');
					for (var i=0; i<portCnt; i++)
					{
						var cardNm = $("#cardNm").val();
						var pttnDivVal = $("#pttnDivVal").val();
						var sepVal = $("#sepVal").val();
						var pttnStrVal = $("#pttnStrVal").val();
						var pttnStrVal_c = pttnStrVal.substring(0, pttnStrVal.indexOf('#'));
						var pttnStrVal_n = pttnStrVal.substring(pttnStrVal.indexOf('#'));
						var pattern = makePortPattern(i+1, pttnStrVal_n);
						var k = i+1;

				        if(k < 10){
				            k = "0"+k;
				        }

				        if(mgmtGrpNmCard == "SKB"){
				        	portNm = pttnDivVal == '0' ? cardNm + sepVal + pttnStrVal_c + pattern : pttnStrVal;
				        }else{
				        	portNm = cardNm + "-" + k;
				        }
		//				alert("1::"+portNm);
				        //[20171121]
				        if(stndPortInfTmpt.getStndPortNo() == null || stndPortInfTmpt.getStndPortNo() == '')
				        {
				        	k = '';
				        }
				        //_[20171121]
				        data[i] = {
				                portNm: portNm,
				                portCapaCd: portCapaCd,
				                stndRackNo : stndPortInfTmpt.getStndRackNo(),  // stndRackNo ... stndPortNo 추가[20171121]
				                stndShelfNo : stndPortInfTmpt.getStndShelfNo(),
				                stndSlotNo : stndPortInfTmpt.getStndSlotNo(),
				                stndSubSlotNo : stndPortInfTmpt.getStndSubSlotNo(),
				                stndPortNo : k
				              };
					}
					$('#' + gridId).alopexGrid('dataSet', data);  // dataAdd가 크롬에서 focus를 잃어버려서 dataSet으로 교체[20171121]
		    		$('#'+gridId).alopexGrid("startEdit");
		    	}else{
		    		$('#'+gridId).alopexGrid('dataEmpty');
		    	}
    	}

    }

    //5G-PON 카드명 정규식 체크
	function ruleChk(){
		 if($('#cardRglaExprVal').val() != ""){
	   		 var name = $('#cardNm').val();
	   		 var rglaExprVal = $('#cardRglaExprVal').val();

	   		 var num = 0;
   			 var ruleInf = new RegExp("^"+rglaExprVal+"$", "g");
   			 if(ruleInf.test(name)){
   				 num++;
   			 }

	   		 if(num > 0){
	   			 $('#cardRuleErrMsg').val("");
	   		 }else{
	   			 $('#cardRuleErrMsg').val("'"+name+"' 의 표기법은 옳바르지 않습니다.");
	   		 }
		 }
	}

    function port5gponData(flag) {
    	var portCapaCd = $("#portCapa").val();
    	var cardNm = $("#cardNm").val();
    	var data = [];

    	var num = cardNm.substr(cardNm.indexOf("(")-1, 1);

    	$('#'+gridId).alopexGrid('dataEmpty');

    	if(flag == "MAIN"){
    		data[0] = {portNm: "M"+num+"-W", portCapaCd: portCapaCd, stndPortNo : "01"};
    		data[1] = {portNm: "M"+num+"-E", portCapaCd: portCapaCd, stndPortNo : "02"};
    		data[2] = {portNm: "M"+num+"-1", portCapaCd: portCapaCd, stndPortNo : "03"};
    		data[3] = {portNm: "M"+num+"-2", portCapaCd: portCapaCd, stndPortNo : "04"};

    		$('#'+gridId).alopexGrid('dataSet', data);  // dataAdd가 크롬에서 focus를 잃어버려서 dataSet으로 교체[20171121]
    		$('#'+gridId).alopexGrid("startEdit");

    		$('#portCntCard').val("4");
    	}else if(flag == "SUB"){

    		data[0] = {portNm: "S"+num+"-COM", portCapaCd: portCapaCd, stndPortNo : "01"};
    		for (var i=1; i<17; i++){
    			var a = i;
    			var b = i+1;

		        if(a < 10){
		            a = "0"+a;
		        }
		        if(b < 10){
		            b = "0"+b;
		        }

		        data[i] = {portNm: "S"+num+"-"+a, portCapaCd: portCapaCd, stndPortNo : b};
    		}

    		$('#'+gridId).alopexGrid('dataSet', data);  // dataAdd가 크롬에서 focus를 잃어버려서 dataSet으로 교체[20171121]
    		$('#'+gridId).alopexGrid("startEdit");

    		$('#portCntCard').val("17");
    	}else{
    		portData();
    	}
    }

    function portCmuxData(Data) {
    	var portCapaCd = $("#portCapa").val();
    	var cardNm = $("#cardNm").val();
    	var data = [];

		for (var i=0; i<Data.length; i++){
			if (Data[i].chnlVal != undefined) {
				data.push({portNm: Data[i].portNm, portCapaCd: portCapaCd, portRmk: Data[i].portDesc, chnlVal: Data[i].chnlVal, wavlVal: Data[i].wavlVal})
			}else {
				data.push({portNm: Data[i].portNm, portCapaCd: portCapaCd, portRmk: Data[i].portDesc})
			}

		}

		$('#'+gridId).alopexGrid('dataSet', data);  // dataAdd가 크롬에서 focus를 잃어버려서 dataSet으로 교체[20171121]
		$('#'+gridId).alopexGrid("startEdit");


    }

    function makePortPattern(index, pattern)
	{
		var rv = index;
		var size = pattern.length;

		if (size == 2 && index < 10) rv = '0' + index;
		else if (size == 3 && index < 10) rv = '00' + index;
		else if (size == 3 && index < 100) rv = '0' + index;
		else if (size == 4 && index < 10) rv = '000' + index;
		else if (size == 4 && index < 100) rv = '00' + index;
		else if (size == 4 && index < 1000) rv = '0' + index;

		return rv;
	}

    function cardReg() {
    	var param =  $("#cardRegForm").getData();

    	 if($("#userId").val() == ""){
    		param.userId = "SYSTEM";
    	 }else{
    		param.userId = $("#userId").val();
		 }

    	 if(cardMdlIdParam == $("#cardMdlId").val()){
    		 if(param.autoRegYn == "YES"){
    			 param.autoRegYn = "Y";
    		 }else{
    			 param.autoRegYn = "N";
    		 }
    	 }else{
    		 param.autoRegYn = "N";
    	 }

		 var regYn = $('#regYnCard').val();

		 if(regYn == "Y") {  //수정
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/updateCardMgmt', param, 'POST', 'CardUpt');
    	 } else { //등록
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/insertCardMgmt', param, 'POST', 'CardReg');
    	 }
    }

    function portReg() {

    	$('#'+gridId).alopexGrid('endEdit', {_state:{editing:true}});
    	var param = $('#'+gridId).alopexGrid('dataGet');

    	if(param.length > 0){
	    	var userId;
	    	var portStatCd;

			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			 if(eqpRoleDivCdParam == "11" || eqpRoleDivCdParam == "177" || eqpRoleDivCdParam == "178" || eqpRoleDivCdParam == "182"){
				 portStatCd = "0006";
			 }else{
				 portStatCd = "0001";
			 }

			for(var i=0; i<param.length; i++){
				 param[i].eqpId = $('#eqpIdCard').val();
				 param[i].cardId = $('#cardIdReg').val();
				 param[i].lgcPortYn = "N";
				 param[i].srsPortYn = "N";
				 param[i].autoMgmtYn = "N";
				 param[i].upLinkPortYn = "N";
				 param[i].dplxgPortYn = "N";
				 param[i].edgYn = "N";
				 param[i].portStatCd = portStatCd;
				 param[i].frstRegUserId = userId;
				 param[i].lastChgUserId = userId;
			}
	   	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/insertPortToCard', param, 'POST', 'portToCardReg');
    	}
    }

    function setCardId() {

		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardId', null, 'GET', 'cardIdReg');
    }

    function cardDel() {

		var param =  $("#cardRegForm").getData();
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/deleteCardMgmt', param, 'POST', 'CardDel');

   }

    /* [20171019] */
    function setEnableObjByPortPveReg(enable, mgmtGrpNmCard) {
      $('#cardRoleDivCd').setEnabled(enable); // 카드용도
      $('#rackList').setEnabled(enable); // 랙명
      $('#wavlVal').setEnabled(enable); // 파장값
      $('#shlfList').setEnabled(enable); // 쉘프명
      $('#slotNo').setEnabled(enable); // 슬롯번호
      $('#staPortNoVal').setEnabled(enable); // 시작포트
      $('#cstrCd').setEnabled(enable); // 공사코드
      $('#cardNm').setEnabled(enable); // 카드명(SKT)
      $('#cardNmSkb').setEnabled(enable); // 카드명(SKB)
      $('#wkrtNo').setEnabled(enable); // 작업지시번호
      $('#cardMdlPop').setEnabled(enable); // 카드모델
      $('#instlDt').setEnabled(enable); // 설치일자
      $('#prntCard').setEnabled(enable); // 부모카드
      $('#mnftYm').setEnabled(enable); // 제조년월
      $('#cardStat').setEnabled(enable); // 카드상태
      $('#cardRmk').setEnabled(enable); // 카드비고
      $('#portCapa').setEnabled(enable); // 포트용량
      $('#portCntCard').setEnabled(enable); // 포트수

      $('#btnRegShlf2').setEnabled(enable);
      $('#btnSaveReg3').setEnabled(enable);

      if (!enable) {
        $('#cardRoleDivCd').setSelected('');
        $('#rackList').setSelected('');
        $('#wavlVasetenableobjl').setSelected('');
        $('#shlfList').setSelected('');
        $('#barNoCard').val('');
        $('#slotNo').val('');
        $('#staPortNoVal').val('');
        $('#cstrCd').val('');
        if (mgmtGrpNmCard == "SKB") {
          $('#cardNmSkb').setSelected('');
        } else {
          $('#cardNm').val('');
        }
        $('#wkrtNo').val('');
        $('#cardMdlPop').setSelected('');
        $('#instlDt').val('');
        $('#prntCard').setSelected('');
        $('#mnftYm').val('');
        $('#cardStat').setSelected('');
        $('#cardRmk').val('');
        $('#portCapa').setSelected('');
      }
    }
    /*_[20171019] */

    /* [20171121] */
    var stndPortInfTmpt = new function(){

      this.init = function() {
        this._stndRackNo    = null;
        this._stndShelfNo   = null;
        this._stndSlotNo    = null;
        this._stndSubSlotNo = null;
        this._stndPortNo    = null;
      }

      //Setter
      this.setStndRackNo = function(stndRackNo) {
        this._stndRackNo = stndRackNo;
      }
      this.setStndShelfNo = function(stndShelfNo) {
        this._stndShelfNo = stndShelfNo;
      }
      this.setStndSlotNo = function(stndSlotNo) {
        this._stndSlotNo = stndSlotNo;
      }
      this.setStndSubSlotNo = function(stndSubSlotNo) {
        this._stndSubSlotNo = stndSubSlotNo;
      }
      this.setStndPortNo = function(stndPortNo) {
        this._stndPortNo = stndPortNo;
      }

      //Getter
      this.getStndRackNo = function() {
        return this._stndRackNo;
      }
      this.getStndShelfNo = function() {
        return this._stndShelfNo;
      }
      this.getStndSlotNo = function() {
        return this._stndSlotNo;
      }
      this.getStndSubSlotNo = function() {
        return this._stndSubSlotNo;
      }
      this.getStndPortNo = function() {
        return this._stndPortNo;
      }
    }

    /*_[20171121] */

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 650,
                  height : window.innerHeight * 0.8
              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
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