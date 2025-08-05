/**
 * DrawIpdAttr.js
 *
 * @author Administrator
 * @date 2017. 11. 28.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var gridId = "dataGrid";
	var prevUnitSize = 20;
	var portInfoTemp = [];
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
    	setAttr();
    	setSelectCode();
    	setEventListener();
    };


    // Grid 초기화
    function initGrid() {

    	//그리드 생성
    	$('#'+gridId).alopexGrid({
    		height:"15row",
    		//autoResize: true,
    		headerRowHeight: 25,
    		rowOption: {
    			defaultHeight: 21,
    		},
    		numberingColumnFromZero: false,
    		rowClickSelect: false,
    		headerGroup: [
    			{fromIndex:0, toIndex:6, title:'PORT_A'},
    			{fromIndex:7, toIndex:13, title:'PORT_B'},
    			{hideSubTitle: true}

    		],
    		pager : false,
    		defaultColumnMapping: {
    			resizing: false
    		},
    		columnMapping: [{
    			key: 'numA',
    			align:'center',
    			width: '5px',
    			numberingColumn: true,
    			inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickA){
    						return 'yellow';
    					}else{
    						return '#5A6378';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickA){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '21px'
    			}
    		}, {
    			key : 'portA',
    			align:'center',
    			width: '20px',
    			inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickA){
    						return 'yellow';
    					}else{
    						return '#393F4F';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickA){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '21px'
    			}
    		}, {
    			align:'center',
    			width: '5px',
    			render : function (value, data, render, mapping, grid) {
					return '<div style="width: 100%;"><button type="button" id="removeBtn" style="cursor: pointer; padding:0px;"><span class="Icon Remove" style="background-color:#ACACAC;"></span></button></div>'
				},
				inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickA){
    						return 'yellow';
    					}else{
    						return '#393F4F';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickA){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '21px'
    			}
    		}, {
    			key: 'outIdA'
    		}, {
    			key: 'typeA'
    		}, {
    			key: 'statusA'
    		}, {
    			key: 'clickA'
    		}, {
    			key: 'numB',
    			align:'center',
    			width: '5px',
    			numberingColumn: true,
    			inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickB){
    						return 'yellow';
    					}else{
    						return '#5A6378';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickB){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '21px'
    			}
    		}, {
    			key : 'portB',
    			align:'center',
    			width: '20px',
    			inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickB){
    						return 'yellow';
    					}else{
    						return '#393F4F';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickB){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '21px'
    			}
    		}, {
    			align:'center',
    			width: '5px',
    			render : function (value, data, render, mapping, grid) {
					return '<div style="width: 100%;"><button type="button" id="removeBtn" style="cursor: pointer; padding:0px;"><span class="Icon Remove" style="background-color:#ACACAC;"></span></button></div>'
				},
				inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickB){
    						return 'yellow';
    					}else{
    						return '#393F4F';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickB){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '21px'
    			}
    		}, {
    			key: 'outIdB'
    		}, {
    			key: 'typeB'
    		}, {
    			key: 'statusA'
    		}, {
    			key: 'clickB'
    		}],
    		message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    		}
    	});
    	 gridHide();
    };


    function setSelectCode() {
    	var supCd = {supCd : '009000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', supCd, 'GET', 'csType');
    }

    function setAttr() {
    	$('#labelNm').val(paramData.labelNm);
    	$('#width').val(paramData.width);
    	$('#length').val(paramData.length);
    	$('#height').val(paramData.height);
    	$('#lv3').val(paramData.lv3);
    	if(paramData.modelId == undefined || paramData.modelId == ""){
    		for(var i = 0; i<prevUnitSize; i++){
				$('#'+gridId).alopexGrid("dataAdd", $.extend());
			}
    	}else {
    		var modelId = {modelId: paramData.modelId};
    		$('#modelId').val(paramData.modelId);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBaseInfo', modelId, 'GET', 'getBaseInfo');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getInputInfo', modelId, 'GET', 'getInputInfo');
    	}
    }

    function setEventListener() {
    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	 //등록
    	 $('#btnSave').on('click', function(e) {
    		 var portList = [];
    		 var portData = $('#'+gridId).alopexGrid("dataGet",{_state:{edited:true}});
    		 for(var i=0; i<portData.length; i++){
    			 if(portData[i].statusA != '' && portData[i].statusA != undefined){
    				 portList.push({'inId':paramData.modelId, 'outId': portData[i].outIdA, 'portLabel':portData[i].portA,'pos':portData[i].numA,'type':portData[i].typeA, 'status': portData[i].statusA})
    			 }
    			 if(portData[i].statusB != '' && portData[i].statusB != undefined){
    				 portList.push({'inId':paramData.modelId, 'outId': portData[i].outIdB, 'portLabel':portData[i].portB,'pos':portData[i].numB,'type':portData[i].typeB, 'status': portData[i].statusB})
    			 }
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 if(portList.length>0){
    					 portInfoReg(portList);
    				 }else{
    					 ipdReg();
    				 }
    			 }
    		 });
    	 });

    	 //포트 수
    	 $('#unitSize').on('change', function(e) {

    		 var dataList = $( '#'+gridId).alopexGrid("dataGet");
    		 var unitSize = $("#unitSize").val();

    		 if(unitSize > 50){
    			 $('#unitSize').val(50);
    			 unitSize = 50;
    		 }else if(unitSize <= 0){
    			 $('#unitSize').val(1);
    			 unitSize = 1
    		 }
    		 $('#'+gridId).alopexGrid("updateOption", {height:unitSize+'row'});
    		 if(dataList.length < unitSize){
    			 var upCnt = unitSize - dataList.length;
    			 for(var i=0; i<upCnt; i++){
    				 $('#'+gridId).alopexGrid("dataAdd", $.extend());
    				 if(unitSize>15){
    					 $('#description').prop({rows:$('#description').prop('rows')+1})
    				 }
    			 }

    		 } else if(dataList.length > unitSize){
    			 for(var i=unitSize; i<dataList.length; i++){
    				 var data = dataList[i];
    				 var rowIndex = data._index.data;
    				 $('#'+gridId).alopexGrid("dataDelete", {_index:{data: rowIndex}});
    				 if(unitSize>=15){
    					 $('#description').prop({rows:$('#description').prop('rows')-1})
    				 }
    			 }

    		 }

    		 if(portInfoTemp.length > 0){
  	    		for(var i=0; i<portInfoTemp.length; i++){
  	    			if(portInfoTemp[i].type == 'L'  || portInfoTemp[i].type == 'A'){
  	    				$('#'+gridId).alopexGrid("dataEdit",{portA:portInfoTemp[i].portLabel, typeA: portInfoTemp[i].type, outIdA: portInfoTemp[i].outId}, {_index:{row:portInfoTemp[i].pos-1}});
  	    			}else if(portInfoTemp[i].type == 'R' || portInfoTemp[i].type == 'B'){
  	    				$('#'+gridId).alopexGrid("dataEdit",{portB:portInfoTemp[i].portLabel, typeB: portInfoTemp[i].type, outIdB: portInfoTemp[i].outId}, {_index:{row:portInfoTemp[i].pos-1}});
  	    			}
  	    		}
      		}
    	 });

    	 //port remove
    	 $('#'+gridId).on('click', '#removeBtn', function(e){
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 if(dataObj._column == 2){
    			 $('#'+gridId).alopexGrid("dataEdit",{portA: "", statusA:"D"}, {_index:{row:dataObj._index.row}});
    		 }else{
    			 $('#'+gridId).alopexGrid("dataEdit",{portB: "", statusB:"D"}, {_index:{row:dataObj._index.row}});
    		 }
    	 });

    	 $('#'+gridId).on('click', '.bodycell', function(e){
    		 var dataObj = AlopexGrid.parseEvent(e).data;
    		 var preSelect = $('#'+gridId).alopexGrid("dataGet", {clickA:true},{clickB:true});
    		 if(dataObj._key == 'portA' || dataObj._key == 'numA'){
    			 if(dataObj.clickA){
    				 $('#'+gridId).alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
    			 }else{
    				 if(preSelect.length>0){
    					 $('#'+gridId).alopexGrid("dataEdit",{clickA: false, clickB: false}, {_index:{row:preSelect[0]._index.row}});
    				 }
    				 $('#'+gridId).alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
    				 parent.top.$a.getParamData($('#'+gridId).alopexGrid("dataGet",{clickA: true})[0].outIdA);
    			 }
    		 }
    		 if(dataObj._key == 'portB' || dataObj._key == 'numB'){
    			 if(dataObj.clickB){
    				 $('#'+gridId).alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
    			 }else{
    				 if(preSelect.length>0){
    					 $('#'+gridId).alopexGrid("dataEdit",{clickA: false, clickB: false}, {_index:{row:preSelect[0]._index.row}});
    				 }
    				 $('#'+gridId).alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
    				 parent.top.$a.getParamData($('#'+gridId).alopexGrid("dataGet",{clickB: true})[0].outIdB);
    			 }
    		 }

    	 });
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'getBaseInfo'){
    		if(response.baseInfo.length > 0){

    			var data = response.baseInfo[0];
    			$('#layerGubun').val(data.layerGubun);
    			$('#lv3').val(data.lv3);
    			$('#width').val(data.width);
    			$('#length').val(data.length);
    			$('#height').val(data.height);
    			$('#csType').setSelected(data.csType);
    			$('#vendor').val(data.vendor);
    			$('#modelNm').val(data.modelNm);
    			$('#capacity').val(data.capacity);
    			$('#manager').val(data.manager);
    			$('#intDt').val(data.intDt);
    			$('#description').val(data.description);
    			if(data.unitSize != null && data.unitSize != '' && data.unitSize >= prevUnitSize){
    				$('#unitSize').val(data.unitSize);
    				for(var i = 0; i<data.unitSize; i++){
    					$('#'+gridId).alopexGrid("dataAdd", $.extend());
    				}
    			}else {
    				for(var i = 0; i<prevUnitSize; i++){
    					$('#'+gridId).alopexGrid("dataAdd", $.extend());
    				}
    			}
    			$('#description').prop({rows:$('#description').prop('rows')+(data.unitSize-15)})
    			var inId = {inId: paramData.modelId, version: paramData.version};
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getPortInfo', inId, 'GET', 'getPortInfo');
    		} else {
    			for(var i = 0; i<prevUnitSize; i++){
    				$('#'+gridId).alopexGrid("dataAdd", $.extend());
    			}

    		}
    	}

    	if(flag == 'getInputInfo'){
    		if(response.inputInfo.length > 0){
    			var data = response.inputInfo[0];
    			$('#portLabel').val(data.portLabel);
    			$('#itemLabel').val(data.itemLabel);
    		}
    	}

    	if(flag == 'getPortInfo'){
    		if(response.portInfo.length > 0){
    			var data = response.portInfo;
    			var unitSize = $("#unitSize").val();
    			portInfoTemp = data;
	    		$('#'+gridId).alopexGrid("updateOption", {height:unitSize+'row'});
	    		for(var i=0; i<data.length; i++){
	    			if(data[i].type == 'L' || data[i].type == 'A'){
	    				$('#'+gridId).alopexGrid("dataEdit",{portA:data[i].portLabel, typeA: data[i].type, outIdA: data[i].outId}, {_index:{row:data[i].pos-1}});
	    			}else if(data[i].type == 'R' || data[i].type == 'B'){
	    				$('#'+gridId).alopexGrid("dataEdit",{portB:data[i].portLabel, typeB: data[i].type, outIdB: data[i].outId}, {_index:{row:data[i].pos-1}});
	    			}
	    		}
    		}
    	}

    	if(flag == 'ipdReg') {
    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		    	   parent.top.$a.setItemId(response.resultList.modelId)
	    		       }
	    		});
    		}
    	}
    	if(flag == 'portInfoReg') {
    		if(response.Result == "Success"){
    			ipdReg();
    		}
    	}

    	if(flag == 'csType') {
    		var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
			$('#'+flag).setData({
				data : option_data,
				orgIdL1: ''
			});
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'ipdReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function gridHide(){
    	var hideColList = ['outIdA', 'outIdB', 'typeA', 'typeB', 'clickA', 'clickB', 'statusA', 'statusB'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList);
    }

    function ipdReg() {
    	var param =  $("#drawIpdAttrForm").getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveBaseInfo', param, 'POST', 'ipdReg');

    }
    function portInfoReg(param) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/savePortInfo', param, 'POST', 'portInfoReg');
    }
    $a.addPwrPort = function(outId, portLabel){
    	var portA = $('#'+gridId).alopexGrid('dataGet',{clickA:true});
    	var portB = $('#'+gridId).alopexGrid('dataGet',{clickB:true});
    	if(portA.length > 0){
    		if(portA[0].portA == '' || portA[0].portA == undefined){
    			$('#'+gridId).alopexGrid('dataEdit',{'outIdA':outId, 'portA':portLabel,'typeA':'A','statusA':'I'},{_index:{row:portA[0]._index.row}});
    		}else{
    			$('#'+gridId).alopexGrid('dataEdit',{'outIdA':outId, 'portA':portLabel,'typeA':'A','statusA':'U'},{_index:{row:portA[0]._index.row}});
    		}

    	}else if(portL[0].length > 0){
    		if(portB[0].portB == '' || portB[0].portB == undefined){
    			$('#'+gridId).alopexGrid('dataEdit',{'outIdB':outId, 'portB':portLabel,'typeB':'B','statusB':'I'},{_index:{row:portB[0]._index.row}});
    		}else{
    			$('#'+gridId).alopexGrid('dataEdit',{'outIdB':outId, 'portB':portLabel,'typeB':'B','statusB':'U'},{_index:{row:portB[0]._index.row}});
    		}
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