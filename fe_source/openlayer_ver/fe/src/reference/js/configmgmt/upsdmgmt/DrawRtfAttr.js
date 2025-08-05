/**
 * DrawRtfAttr.js
 *
 * @author Administrator
 * @date 2017. 12. 04.
 * @version 1.0
 */
$a.page(function() {
	//초기 진입점
	var paramData = null;
	var portInfoTmp = [];
	var deleteList = [];
	var gridId = "";
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		paramData = param;
		setAttr();
		setSelectCode();
		setEventListener();
		setShowPort(paramData.lv3);
		$('.Spinner').setEnabled(false);

	};

	// Grid 초기화
	function initGrid(id,maxCnt) {
		var rowCnt = Math.ceil(maxCnt/4);
		//그리드 생성
		$('#grid'+id).alopexGrid({
			height: rowCnt+"row",
			rowOption: {defaultHeight: 25},
			rowClickSelect: false,
			numberingColumnFromZero: false,
			header: false,
			pager : false,
			columnMapping: [{
				key:'numA',
				align:'center',
				width: '5px',
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
    				lineHeight: '25px'
    			}
			}, {
				key : 'portLabelA',
				align:'center',
				width: '10px',
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
    				lineHeight: '25px'
				}
			},  {
				key: 'outIdA',
			},  {
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
    				lineHeight: '25px'
    			}
			}, {
				key: 'statusA',
			}, {
				key: 'clickA',
			}, {
				key:'numB',
				align:'center',
				width: '5px',
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
    				lineHeight: '25px'
    			}
			}, {
				key : 'portLabelB',
				align:'center',
				width: '10px',
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
    				lineHeight: '25px'
				}
			},   {
				key: 'outIdB',
			},  {
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
    				lineHeight: '25px'
    			}
			}, {
				key: 'statusB',
			}, {
				key: 'clickB',
			}, {
				key:'numC',
				align:'center',
				width: '5px',
				inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickC){
    						return 'yellow';
    					}else{
    						return '#5A6378';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickC){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '25px'
    			}
			}, {
				key : 'portLabelC',
				align:'center',
				width: '10px',
				inlineStyle:{
					background: function(value,data,mapping){
						if(data.clickC){
							return 'yellow';
						}else{
							return '#393F4F';
						}
					},
					color: function(value,data,mapping){
    					if(data.clickC){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '25px'
				}
			},   {
				key: 'outIdC',
			},  {
				align:'center',
				width: '5px',
				render : function (value, data, render, mapping, grid) {
					return '<div style="width: 100%;"><button type="button" id="removeBtn" style="cursor: pointer; padding:0px;"><span class="Icon Remove" style="background-color:#ACACAC;"></span></button></div>'
				},
				inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickC){
    						return 'yellow';
    					}else{
    						return '#393F4F';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickC){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '25px'
    			}
			}, {
				key: 'statusC',
			}, {
				key: 'clickC',
			}, {
				key:'numD',
				align:'center',
				width: '5px',
				inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickD){
    						return 'yellow';
    					}else{
    						return '#5A6378';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickD){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '25px'
    			}
			}, {
				key : 'portLabelD',
				align:'center',
				width: '10px',
				inlineStyle:{
					background: function(value,data,mapping){
						if(data.clickD){
							return 'yellow';
						}else{
							return '#393F4F';
						}
					},
					color: function(value,data,mapping){
    					if(data.clickD){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '25px'
				}
			},   {
				key: 'outIdD',
			},  {
				align:'center',
				width: '5px',
				render : function (value, data, render, mapping, grid) {
					return '<div style="width: 100%;"><button type="button" id="removeBtn" style="cursor: pointer; padding:0px;"><span class="Icon Remove" style="background-color:#ACACAC;"></span></button></div>'
				},
				inlineStyle:{
    				background: function(value,data,mapping){
    					if(data.clickD){
    						return 'yellow';
    					}else{
    						return '#393F4F';
    					}
    				},
    				color: function(value,data,mapping){
    					if(data.clickD){
    						return 'black';
    					}else{
    						return 'white';
    					}
    				},
    				padding: '0px',
    				lineHeight: '25px'
    			}
			}, {
				key: 'statusD',
			}, {
				key: 'clickD',
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

		for(var i=0; i<rowCnt; i++){
			$('#grid'+id).alopexGrid("dataAdd", $.extend({},{"numA": (i*rowCnt)+1, "numB": (i*rowCnt)+2, "numC": (i*rowCnt)+3, "numD": (i*rowCnt)+4}));
		}
		gridHide('grid'+id);
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

		if(paramData.modelId != '' && paramData.modelId != null){
			var modelId = {modelId: paramData.modelId};
			$('#modelId').val(paramData.modelId);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBaseInfo', modelId, 'GET', 'getBaseInfo');
		}
	}

	function setEventListener() {
		//취소
		$('#btnCncl').on('click', function(e) {
			$a.close();
		});

		//저장
		$('#btnSave').on('click', function(e) {
			var portList = [];
			var id = Array();
			switch(paramData.lv3){
			case 'MR1':
				id = ["630"];
				break;
			case 'MR2':
				id = ["100","32"];
				break;
			case 'CRS1800':
				id = ["Up100","Up50","Down50","Down30"];
				break;
			case 'CRS2400':
				break;
			}
			for(var i=0;i<id.length;i++){
				var portData = $('#grid'+id[i]).alopexGrid("dataGet",{_state:{edited:true}});
				for(var j=0;j<portData.length;j++){
					if(portData[j].statusA != '' && portData[j].statusA != undefined){
						portList.push({'inId':paramData.modelId, 'outId': portData[j].outIdA, 'portLabel':portData[j].portLabelA,'pos':portData[j].numA, 'amp':id[i], 'status': portData[j].statusA})
					}
					if(portData[j].statusB != '' && portData[j].statusB != undefined){
						portList.push({'inId':paramData.modelId, 'outId': portData[j].outIdB, 'portLabel':portData[j].portLabelB,'pos':portData[j].numB, 'amp':id[i], 'status': portData[j].statusB})
					}
					if(portData[j].statusC != '' && portData[j].statusC != undefined){
						portList.push({'inId':paramData.modelId, 'outId': portData[j].outIdC, 'portLabel':portData[j].portLabelC,'pos':portData[j].numC, 'amp':id[i], 'status': portData[j].statusC})
					}
					if(portData[j].statusD != '' && portData[j].statusD != undefined){
						portList.push({'inId':paramData.modelId, 'outId': portData[j].outIdD, 'portLabel':portData[j].portLabelD,'pos':portData[j].numD, 'amp':id[i], 'status': portData[j].statusD})
					}
				}
			}

			//tango transmission biz 모듈을 호출하여야한다.
			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
				//저장한다고 하였을 경우
				if (msgRst == 'Y') {
					if(portList.length >0){
						portInfoReg(portList);
					}

				}
			});
		});

		//remove
		$('#grid630').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'grid360');
		});
		//remove
		$('#grid100').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'grid100');
		});
		$('#grid32').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'grid32');
		});
		$('#gridUp100').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'gridUp100');
		});
		$('#gridUp50').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'gridUp50');
		});
		$('#gridDown50').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'gridDown50');
		});
		$('#gridDown30').on('click', '#removeBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			remove(dataObj,'gridDown30');
		});


		//select
		$('#grid630').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#grid630').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#grid630').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid630').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});
					}
					$('#grid630').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid630').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#grid630').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid630').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});
					}
					$('#grid630').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid630').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#grid630').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid630').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});
					}
					$('#grid630').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid630').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#grid630').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid630').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});
					}
					$('#grid630').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid630').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
		/////////////////////
		$('#grid100').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#grid100').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#grid100').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid100').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid100').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#grid100').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid100').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid100').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#grid100').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid100').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid100').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#grid100').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid100').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid100').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
		/////////////////
		$('#grid32').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#grid32').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#grid32').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid32').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid32').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#grid32').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid32').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid32').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#grid32').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid32').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid32').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#grid32').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#grid32').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#grid100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#grid32').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#grid32').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
		/////////////////
		$('#gridUp100').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#gridUp100').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp100').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#gridUp100').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp100').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#gridUp100').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp100').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#gridUp100').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp100').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
		////////////////////
		$('#gridUp50').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#gridUp50').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp50').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp50').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#gridUp50').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp50').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp50').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#gridUp50').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp50').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp50').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#gridUp50').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp50').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridUp50').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
		$('#gridDown50').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#gridDown50').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown50').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#gridDown50').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown50').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#gridDown50').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown50').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#gridDown50').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown50').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
		$('#gridDown30').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var preSelect = $('#gridDown30').alopexGrid("dataGet", {clickA:true},{clickB:true},{clickC:true},{clickD:true});
			if(dataObj._key == 'portLabelA' || dataObj._key == 'numA'){
				if(dataObj.clickA){
					$('#gridDown30').alopexGrid("dataEdit",{clickA: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickA: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown30').alopexGrid("dataGet",{clickA: true})[0].outIdA);
				}
			}
			if(dataObj._key == 'portLabelB' || dataObj._key == 'numB'){
				if(dataObj.clickB){
					$('#gridDown30').alopexGrid("dataEdit",{clickB: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickB: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown30').alopexGrid("dataGet",{clickB: true})[0].outIdB);
				}
			}
			if(dataObj._key == 'portLabelC' || dataObj._key == 'numC'){
				if(dataObj.clickC){
					$('#gridDown30').alopexGrid("dataEdit",{clickC: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickC: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown30').alopexGrid("dataGet",{clickC: true})[0].outIdC);
				}
			}
			if(dataObj._key == 'portLabelD' || dataObj._key == 'numD'){
				if(dataObj.clickD){
					$('#gridDown30').alopexGrid("dataEdit",{clickD: false}, {_index:{row:dataObj._index.row}});
				}else{
					if(preSelect.length>0){
						$('#gridDown30').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false}, {_index:{row:preSelect[0]._index.row}});

					}
					$('#gridUp50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridUp100').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown50').alopexGrid("dataEdit",{clickA: false, clickB: false, clickC: false, clickD: false});
					$('#gridDown30').alopexGrid("dataEdit",{clickD: true}, {_index:{row:dataObj._index.row}});
					parent.top.$a.getParamData($('#gridDown30').alopexGrid("dataGet",{clickD: true})[0].outIdD);
				}
			}
		});
	};

	function setShowPort(lv3){
		$('#port'+lv3).show();
		switch(paramData.lv3){
		case 'MR1':
			initGrid('630',4);
			break;
		case 'MR2':
			initGrid('100',4);
			initGrid('32',32);
			break;
		case 'CRS1800':
			initGrid('Up100',8);
			initGrid('Up50',8);
			initGrid('Down50',16);
			initGrid('Down30',4);
			break;
		case 'CRS2400':
			break;
		}
		var inId = {inId: paramData.modelId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getPortInfo', inId, 'GET', 'getPortInfo');
	}
	function remove(dataObj, id){
		var data = dataObj.data;
		if(data._column == 3){
			$('#'+id).alopexGrid("dataEdit",{portLabelA: "",statusA:'D'}, {_index:{row:data._index.row}});
			//portList.push({'inId':paramData.modelId, 'outId': data.outIdA, 'pos':data.numA, 'status':'D'})
		}else if(data._column == 9){
			$('#'+id).alopexGrid("dataEdit",{portLabelB: "",statusB:'D'}, {_index:{row:data._index.row}});
			//deleteList.push({'inId':paramData.modelId, 'outId': data.outIdB, 'pos':data.numB, 'status':'D'})
		}else if(data._column == 15){
			$('#'+id).alopexGrid("dataEdit",{portLabelC: "",statusC:'D'}, {_index:{row:data._index.row}});
			//deleteList.push({'inId':paramData.modelId, 'outId': data.outIdC, 'pos':data.numC, 'status':'D'})
		}else if(data._column == 21){
			$('#'+id).alopexGrid("dataEdit",{portLabelD: "",statusD:'D'}, {_index:{row:data._index.row}});
			//deleteList.push({'inId':paramData.modelId, 'outId': data.outIdD, 'pos':data.numD, 'status':'D'})
		}
	}




//	request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getBaseInfo'){
			if(response.baseInfo.length > 0){
				data = response.baseInfo[0];
				$('#layerGubun').val(data.layerGubun);
				$('#lv3').val(data.lv3);
				$('#width').val(data.width);
				$('#length').val(data.length);
				$('#height').val(data.height);
				$('#csType').setSelected(data.csType);
				$('#vendor').val(data.vendor);
				$('#modelNm').val(data.modelNm);
				$('#serial').val(data.serial);
				$('#voltInput').setSelected(data.voltInput);
				$('#freqInput').val(data.freqInput);
				$('#pFactor').val(data.pFactor);
				$('#efficiency').val(data.efficiency);
				$('#rvoltOutput').setSelected(data.rvoltOutput);
				$('#mcurrentOutput').val(data.mcurrentOutput);
				$('#capacity').val(data.capacity);
				$('#weight').val(data.weight);
				$('#manager').setSelected(data.manager);
				$('#intDt').val(data.intDt);
				$('#description').setSelected(data.description);
			}

		}

		if(flag == 'getPortInfo'){
			if(response.portInfo.length > 0){
				var data = response.portInfo;
				var lv3 = $('#lv3').val();
				if(lv3 == 'CRS2400'){

				}else if(lv3 == 'CRS1800'){
					for(var i=0; i<data.length; i++){

					}
				}else{
					for(var i=0; i<data.length; i++){
						var rowNum = Math.floor((data[i].pos-1)/4);
						var colNum = ((data[i].pos-1)%4);
						if(colNum == 0){
							$('#grid'+data[i].amp).alopexGrid("dataEdit",{portLabelA:data[i].portLabel,outIdA:data[i].outId},{_index:{row:rowNum}});
						}else if(colNum == 1){
							$('#grid'+data[i].amp).alopexGrid("dataEdit",{portLabelB:data[i].portLabel,outIdB:data[i].outId},{_index:{row:rowNum}});
						}else if(colNum == 2){
							$('#grid'+data[i].amp).alopexGrid("dataEdit",{portLabelC:data[i].portLabel,outIdC:data[i].outId},{_index:{row:rowNum}});
						}else if(colNum == 3){
							$('#grid'+data[i].amp).alopexGrid("dataEdit",{portLabelD:data[i].portLabel,outIdD:data[i].outId},{_index:{row:rowNum}});
						}

					}
				}

			}
		}

		if(flag == 'rtfReg') {
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
				rtfReg();
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
//	request 실패시.
	function failCallback(response, status, jqxhr, flag){

		if(flag == 'rtfReg'){
			//저장을 실패 하였습니다.
			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
		}
	}
	function gridHide(gridId){
		var hideColList = ['outIdA', 'outIdB', 'outIdC', 'outIdD', 'clickA', 'clickB', 'clickC', 'clickD', 'statusA', 'statusB', 'statusC', 'statusD'];

		$('#'+gridId).alopexGrid("hideCol", hideColList);
	}
	function rtfReg() {
		var param =  $("#drawRtfAttrForm").getData();

		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveBaseInfo', param, 'POST', 'rtfReg');

	}
	function portInfoReg(param) {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/savePortInfo', param, 'POST','portInfoReg');
	}

	$a.addPwrPort = function(outId, portLabel){

		for(var i=0; i<id.length; i++){
			eval("var port"+id[i]+"A = $('#grid"+id[i]+"').alopexGrid('dataGet',{clickA:true})");
			eval("var port"+id[i]+"B = $('#grid"+id[i]+"').alopexGrid('dataGet',{clickB:true})");
			eval("var port"+id[i]+"C = $('#grid"+id[i]+"').alopexGrid('dataGet',{clickC:true})");
			eval("var port"+id[i]+"D = $('#grid"+id[i]+"').alopexGrid('dataGet',{clickD:true})");
			if(eval("port"+id[i]+"A").length > 0){
				if(eval("port"+id[i]+"A[0]").portLabelA == '' || eval("port"+id[i]+"A[0]").portLabelA == undefined){
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdA':outId, 'portLabelA':portLabel, 'statusA':'I'},{_index:{row:eval("port"+id[i]+"A[0]")._index.row}});
				}else{
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdA':outId, 'portLabelA':portLabel,'statusA':'U'},{_index:{row:eval("port"+id[i]+"A[0]")._index.row}});
				}
			}else if(eval("port"+id[i]+"B").length > 0){
				if(eval("port"+id[i]+"B[0]").portLabelB == '' || eval("port"+id[i]+"B[0]").portLabelB == undefined){
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdB':outId, 'portLabelB':portLabel,'statusB':'I'},{_index:{row:eval("port"+id[i]+"B[0]")._index.row}});
				}else{
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdB':outId, 'portLabelB':portLabel,'statusB':'U'},{_index:{row:eval("port"+id[i]+"B[0]")._index.row}});
				}
			}else if(eval("port"+id[i]+"C").length > 0){
				if(eval("port"+id[i]+"C[0]").portLabelC == '' || eval("port"+id[i]+"C[0]").portLabelC == undefined){
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdC':outId, 'portLabelC':portLabel,'statusC':'I'},{_index:{row:eval("port"+id[i]+"C[0]")._index.row}});
				}else{
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdC':outId, 'portLabelC':portLabel,'statusC':'U'},{_index:{row:eval("port"+id[i]+"C[0]")._index.row}});
				}
			}else if(eval("port"+id[i]+"D").length > 0){
				if(eval("port"+id[i]+"D[0]").portLabelD== '' || eval("port"+id[i]+"D[0]").portLabelD == undefined){
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdD':outId, 'portLabelD':portLabel,'statusD':'I'},{_index:{row:eval("port"+id[i]+"D[0]")._index.row}});
				}else{
					$('#grid'+id[i]).alopexGrid('dataEdit',{'outIdD':outId, 'portLabelD':portLabel,'statusD':'U'},{_index:{row:eval("port"+id[i]+"D[0]")._index.row}});
				}
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