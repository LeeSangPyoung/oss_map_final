/**
 *
 * @author Administrator

 * @date 2023. 08. 21.
 * @version 1.0
 */

let netBdgmId;
let eqpRoleDivCdList1arr = [];
let lineDivValListArr = [];
let bpIdListArr =  [];
let totoTpCd;

$a.page(function() {

	var gridId = 'dataGrid';

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	setSelectCode();     //select 정보 세팅

    	setEventListener();  //이벤트

    	if(param["netBdgmId"]) {
        	netBdgmId = param["netBdgmId"];

        	setTimeout(function() {
        		getNetBdgmBas(param);
        	}, 100);
    	}
    };

    function getNetBdgmBas(param) {

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/networktopo/getNetBdgmBas'
		  , data: param
		  , method:'GET'
		  , async:true
		  }).done(
			function(result) {
				$("#netBdgmId").val(result.netBdgmId);
				$("#netBdgmNm").val(result.netBdgmNm);
				$("#netBdgmNetDivVal").val(result.netBdgmNetDivVal);
				$("#netBdgmEqpDivVal").val(result.netBdgmEqpDivVal);
				$("#netBdgmVendVal").val(result.netBdgmVendVal);
				$("#netBdgmLineDivVal").val(result.netBdgmLineDivVal);

				totoTpCd = result.netBdgmNetDivVal;
				$("#topoloyTypCd").val(totoTpCd).change();

				if(result.netBdgmEqpDivVal) {
					eqpRoleDivCdList1arr = result.netBdgmEqpDivVal.split(",");
					$("#eqpRoleDivCdList1").setData({
			            eqpRoleDivCdList: eqpRoleDivCdList1arr,
					});
				}

				if(result.netBdgmVendVal) {
					bpIdListArr = result.netBdgmVendVal.split(",");
					$("#bpIdList").setData({
						bpIdList: bpIdListArr,
					});
				}

				if(result.netBdgmLineDivVal) {
					lineDivValListArr = result.netBdgmLineDivVal.split(",");
					$("#lineDivValList").setData({
						lineDivValList: lineDivValListArr,
					});
				}

				$("#rmkCtt").val(result.rmkCtt);
			}.bind(this)
		);
    }

    function deleteNetBdgmBas(param) {
    	if(!param.netBdgmId) {
    		return;
    	}

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/networktopo/deleteNetBdgmBas'
		  , data: param
		  , method:'POST'
		  , async:true
		  }).done(
			function(result) {
				if(result.code === "ok") {
					alert("삭제 되었습니다.");
					$a.close();
				} else {
					alert("삭제 실패하였습니다.");
				}
			}.bind(this)
		);
    }

    function saveNetBdgmBas(param) {

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/networktopo/saveNetBdgmBas'
		  , data: param
		  , method:'POST'
		  , async:true
		  }).done(
			function(result) {
				if(result.code === "ok") {
					alert("저장 되었습니다.");
					$a.close();
				} else {
					alert("저장 실패하였습니다.");
				}
			}.bind(this)
		);
    }

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	let mgmtSelected = "SKT";
    	let param = { "comGrpCd" : mgmtSelected};

    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/NWCMGRP/getTopoloyTypCdList', null, 'GET', 'TopoloyTypCdData');  // 망구분 데이터

    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/eqpRoleDiv/C00148/'+ mgmtSelected, null, 'GET', 'eqpRoleDivCd'); // 장비타입

    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/bp', param,'GET', 'bp'); //제조사 조회

    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/getLineDivValList', param,'GET', 'lineDivVal'); //선번 구분 조회

    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {

    	$("#btnNetTopoCncl").on('click', function(e) {
    		$a.close();
    	});

    	$("#btnNetTopoDel").on('click', function(e) {
    		if(!$("#netBdgmId").val()) {
    			alert("삭제할 데이터가 존재하지 않습니다.");
    			return;
    		}

    		let param = {};
    		param.netBdgmId = $("#netBdgmId").val();
    		param.netBdgmNm = $("#netBdgmNm").val();

    		deleteNetBdgmBas(param);
    	});

    	$("#btnNetTopoSave").on('click', function(e) {
    		let param = {};

    		if(!$("#netBdgmNm").val()) {
    			alert("구성도명을 입력해 주세요.");
    			$("#netBdgmNm").focus();

    			return;
    		}

    		param.netBdgmId = $("#netBdgmId").val();
    		if($("#topoloyTypCd").val()) {
    			$("#netBdgmNetDivVal").val($("#topoloyTypCd").val());
    		} else {
    			alert("망구분을 선택해 주세요.");
    			$("#netBdgmNetDivVal").focus();

    			return;
    		}

    		param.netBdgmNetDivVal = $("#netBdgmNetDivVal").val();

    		let eqpRoleDivCdList = ($("#eqpRoleDivCdList1").val() == null) ? "" : getMultiSelect("eqpRoleDivCdList1", "value", ":selected");
    		if(eqpRoleDivCdList) {
        		$("#netBdgmEqpDivVal").val(eqpRoleDivCdList.join());
    		} else {
    			$("#netBdgmEqpDivVal").val("");
    		}
    		let bpIdList = ($("#bpIdList").val() == null) ? "" : getMultiSelect("bpIdList", "value", ":selected");
    		if(bpIdList) {
    			$("#netBdgmVendVal").val(bpIdList.join());
    		} else {
    			$("#netBdgmVendVal").val("");
    		}
    		let lineDivList = ($("#lineDivValList").val() == null) ? "" : getMultiSelect("lineDivValList", "value", ":selected");
    		if(lineDivList) {
    			$("#netBdgmLineDivVal").val(lineDivList.join());
    		} else {
    			$("#netBdgmLineDivVal").val("");
    		}

    		param.netBdgmEqpDivVal = $("#netBdgmEqpDivVal").val();
    		param.netBdgmVendVal = $("#netBdgmVendVal").val();
    		param.netBdgmLineDivVal = $("#netBdgmLineDivVal").val();

    		param.netBdgmNm = $("#netBdgmNm").val();
    		param.rmkCtt = $("#rmkCtt").val();

    		saveNetBdgmBas(param);
    	});

		$('#eqpRoleDivCdList1').multiselect({
			 open: function(e){
				 eqpRoleDivCdList = $("#eqpRoleDivCdList1").getData().eqpRoleDivCdList;
			 },
			 beforeclose: function(e){
				 var codeID =  $("#eqpRoleDivCdList1").getData();
		 		 var param = "SKT";
		 		 var cnt = 0;

		 		 if(eqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){
		     		 if(codeID.eqpRoleDivCdList == ''){

		     			$('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
						$('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');

		     		 }else {
		     			for(var i=0; codeID.eqpRoleDivCdList.length > i; i++){
		     				param += "&comCdMlt1=" + codeID.eqpRoleDivCdList[i];
		     				if(codeID.eqpRoleDivCdList[i] == '11' || codeID.eqpRoleDivCdList[i] == '177' || codeID.eqpRoleDivCdList[i] == '178' || codeID.eqpRoleDivCdList[i] == '182'){
		     					cnt++;
		           			}
		     			}

		     			 if(cnt > 0){
		    				 $('#'+gridId).alopexGrid("showCol", 'upsdRackNo');
		    				 $('#'+gridId).alopexGrid("showCol", 'upsdShlfNo');
		    			 }else{
		    				 $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
		    				 $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');
		    			 }
		     		 }
		 		 }

		 		 httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/bp', param,'GET', 'bp'); //제조사 조회

			 }
		});

		//제조사 선택시 이벤트
		$('#bpIdList').multiselect({
			 open: function(e){
				 bpIdList = $("#bpIdList").getData().bpIdList;
			 },
			 beforeclose: function(e){
		      	//tango transmission biz 모듈을 호출하여야한다.
		 		 var bpId =  $("#bpIdList").getData();
		 		 var eqpRoleDivCd =  $("#eqpRoleDivCdList1").getData();
		 		 var param = "SKT";
		 		if(bpIdList+"" != bpId.bpIdList+""){
		     	 	 if(bpId.bpIdList == '' && eqpRoleDivCd.eqpRoleDivCdList == ''){

		     	 	 }else if(bpId.bpIdList == '' && eqpRoleDivCd.eqpRoleDivCdList != ''){
		     	 		for(var i=0; eqpRoleDivCd.eqpRoleDivCdList.length > i; i++){
		     				param += "&comCdMlt1=" + eqpRoleDivCd.eqpRoleDivCdList[i];
		     			}
		     		 }else if(bpId.bpIdList != '' && eqpRoleDivCd.eqpRoleDivCdList == ''){
		     			for(var i=0; bpId.bpIdList.length > i; i++){
		     				param += "&comCdMlt2=" + bpId.bpIdList[i];
		     			}
		     		 }else {
		     			for(var i=0; eqpRoleDivCd.eqpRoleDivCdList.length > i; i++){
		     				param += "&comCdMlt1=" + eqpRoleDivCd.eqpRoleDivCdList[i];
		     			}
		     			for(var i=0; bpId.bpIdList.length > i; i++){
		     				param += "&comCdMlt2=" + bpId.bpIdList[i];
		     			}
		     		 }

		 		}
			 }
		});

		//선번 구분 선택시 이벤트
		$('#lineDivValList').multiselect({
			 open: function(e){
				 lineDivValList = $("#lineDivValList").getData().lineDivValList;
			 },
			 beforeclose: function(e){
		 		 var lineDivVal =  $("#lineDivValList").getData();
		 		if(lineDivValList+"" != lineDivVal.lineDivValList+""){

		 		}
			 }
		});
    }

	function getMultiSelect(objId, gbn, selected){
		let returnVal  = [];
		let returnText = [];
		$('#'+objId+' option'+selected).each(function(i){
			let $this = $(this);
			if($this.length){
				returnVal.push($this.val());
				returnText.push($this.text());
			}
		});

		if("text" == gbn){
			return returnText;
		}else if("value" == gbn){
			return returnVal;
		}
	}

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){

    	/*...........................*
		  망구분데이터셋팅
		 *...........................*/
		if(flag =='TopoloyTypCdData'){
			const $select = $('#topoloyTypCd');
			$select.empty();

			$select.append($('<option>', {
				value: "",
				text : "전체"
			}));

			$.each(response.TopoTypData, function(index, item) {
    			$select.append($('<option>', {
    				value: item.comCd,
    				text: item.comCdNm
    			}));
    		});
		}

		if(flag == 'bp'){
			$('#bpIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpIdList').setData({
	             data:option_data,
	             bpIdList: bpIdListArr,
			});
		}


    	if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCdList1').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#eqpRoleDivCdList1').setData({
                 data:option_data,
                 eqpRoleDivCdList: eqpRoleDivCdList1arr,
    		});
    	}

    	if(flag == 'lineDivVal') { //선번 구분
    		$('#lineDivValList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#lineDivValList').setData({
                 data:option_data,
                 lineDivValList: lineDivValListArr
    		});
    	}
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){

    };

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };
});