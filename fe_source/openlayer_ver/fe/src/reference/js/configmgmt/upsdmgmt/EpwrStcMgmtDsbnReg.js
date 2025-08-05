/**
 * EpwrStcMgmtDsbnReg.js
 *
 * @author Administrator
 * @date 2018. 02. 06.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var tvssGridId = 'tvssDataGrid';
	var cbplGridId = 'cbplDataGrid';
	var mainGridId = 'mainDataGrid';
	var qrtGridId = 'qrtDataGrid';

	var arrStat = [{'value':'','text':'선택'},{'value':'0','text':'장비선택'},{'value':'1','text':'불필요'},{'value':'2','text':'미설치'}];
	var arrTvss = [];
	var arrCbpl = [];
	var rowIndex;

	var aa = [];

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	param.tvssInstlStatCd = param.mainTvssInstlStatCd;
    	param.tmnbxInstlStatCd = param.mainTmnbxInstlStatCd;


    	var arrTvssParam = [];
    	if(param.tvssSbeqpIdParam != "" && param.tvssSbeqpIdParam != null && param.tvssSbeqpIdParam != undefined){
    		var arrTvssP = param.tvssSbeqpIdParam.split(",");
    		for (var i = 0; i < arrTvssP.length; i++) {
    			arrTvssParam.push(arrTvssP[i]);
    		}
    	}
		param.tvssSbeqpIdList = arrTvssParam;

		var arrCbplParam = [];
		if(param.cbplSbeqpIdParam != "" && param.cbplSbeqpIdParam != null && param.cbplSbeqpIdParam != undefined){
			var arrCbplP = param.cbplSbeqpIdParam.split(",");
			for (var i = 0; i < arrCbplP.length; i++) {
				arrCbplParam.push(arrCbplP[i]);
			}
		}
		param.cbplSbeqpIdList = arrCbplParam;

    	paramData = param
    	setEventListener();
    	setSelectCode();
    	$('#btnDsbnDel').hide();
    	$('#basicTabs').hide();

    	if(param.stat == 'add'){
    		$('#dsbnMod').hide();
    		$('#dsbnAdd').show();
    		$("#tvssSbeqpIdList").multiselect("disable");
    		$("#cbplSbeqpIdList").multiselect("disable");
    	}else if(param.stat == 'mod'){
    		$('#btnDsbnDel').show();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/tvssEqp/'+param.mtsoId, null, 'GET', 'tvssEqp');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/cbplEqp/'+param.mtsoId, null, 'GET', 'cbplEqp');

    		$('#dsbnAdd').hide();
    		$('#dsbnMod').show();
    		setData(param);

    		$('#btnUpsdMtsoSearch').hide();

    		if(param.tvssInstlStatCd != "0"){
     			$("#tvssSbeqpIdList").multiselect("disable");
    		}
    		if(param.tmnbxInstlStatCd != "0"){
     			$("#cbplSbeqpIdList").multiselect("disable");
    		}
    	}

    	initGrid();

    	if(param.stat == 'mod'){
    		$('#'+qrtGridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/qrtCbpl/'+param.mainCbplId, null, 'GET', 'qrtCbpl');
    	}
    };

	function initGrid() {

		AlopexGrid.setup({
			renderMapping : {
				'tvss' : {
					renderer:function(value, data, render, mapping, grid) {
						var arrTvssParam = [];
						if(data.tvssSbeqpIdParam != "" && data.tvssSbeqpIdParam != null && data.tvssSbeqpIdParam != undefined){
							var arrTvssP = data.tvssSbeqpIdParam.split(",");
							for (var i = 0; i < arrTvssP.length; i++) {
								arrTvssParam.push(arrTvssP[i]);
							}
						}

						var str = ''
						for (var i in arrTvss) {
							var exist = '';
							if(data._state.editing[7] == "0"){
								for (var j = 0; j < arrTvssParam.length; j++) {
									if (arrTvssParam[j] && arrTvssParam[j].indexOf(arrTvss[i].sbeqpId) != -1) {
										exist = ' selected="selected"';
									}
								}
							}
							str += '<option value="' + arrTvss[i].sbeqpId + '"' + exist + '>' + arrTvss[i].sbeqpNm + '</option>';
						}
						return '<select class="Multiselect" multiple>' + str + '</select>';
					},
					editedValue : function(cell, data, render, mapping, grid) {
						return $(cell).find('select').val();
					},
					postRender : function(cell, value, data, render, mapping, grid) {
						// 렌더링후 실행하는 코드
						var $multiSelect = $(cell).find('.Multiselect');
						$multiSelect.convert();
						if(data._state.editing[7] == "0"){
							$multiSelect.multiselect("enable");
						}else{
							$multiSelect.multiselect("disable");
						}

						if (grid.$root.alopexGrid('readOption').cellInlineEdit) {
							// cellInlineEdit 모드이면 select 선택 모드로 변경함
							$multiSelect.open();
						}
					}
				},
				'cbpl' : {
					renderer:function(value, data, render, mapping, grid) {
						var arrCbplParam = [];
						if(data.cbplSbeqpIdParam != "" && data.cbplSbeqpIdParam != null && data.cbplSbeqpIdParam != undefined){
							var arrCbplP = data.cbplSbeqpIdParam.split(",");
							for (var i = 0; i < arrCbplP.length; i++) {
								arrCbplParam.push(arrCbplP[i]);
							}
						}

						var str = ''
						for (var i in arrCbpl) {
							var exist = '';
							if(data._state.editing[9] == "0"){
								for (var j = 0; j < arrCbplParam.length; j++) {
									if (arrCbplParam[j] && arrCbplParam[j].indexOf(arrCbpl[i].sbeqpId) != -1) {
										exist = ' selected="selected"';
									}
								}
							}
							str += '<option value="' + arrCbpl[i].sbeqpId + '"' + exist + '>' + arrCbpl[i].sbeqpNm + '</option>';
						}
						return '<select class="Multiselect" multiple>' + str + '</select>';
					},
					editedValue : function(cell, data, render, mapping, grid) {
						return $(cell).find('select').val();
					},
					postRender : function(cell, value, data, render, mapping, grid) {
						// 렌더링후 실행하는 코드
						var $multiSelect = $(cell).find('.Multiselect');
						$multiSelect.convert();
						if(data._state.editing[9] == "0"){
							$multiSelect.multiselect("enable");
						}else{
							$multiSelect.multiselect("disable");
						}

						if (grid.$root.alopexGrid('readOption').cellInlineEdit) {
							// cellInlineEdit 모드이면 select 선택 모드로 변경함
							$multiSelect.open();
						}
					}
				}
			}
		});

	    $('#'+qrtGridId).alopexGrid({
	    	pager : false,
	    	height:"10row",
	    	autoColumnIndex: true,
        	cellInlineEdit: true,
        	cellSelectable : false,
        	rowInlineEdit : true, //행전체 편집기능 활성화
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: false},
        	rowSelectOption: {
				radioColumn : true,
				clickSelect: false,
				disableSelectByKey: true
			},
			headerGroup: [
			              {fromIndex:7, toIndex:8, title:"TVSS(SPD)"},
			              {fromIndex:9, toIndex:10, title:"발전 단자함"},
			              {hideSubTitle: true}
			],
			columnMapping: [{
				align:'center',
				title: '',
				key: 'check',
				width: '30px',
				selectorColumn: true
			}, {
				key : '', align:'center',
				title : '분전반',
				width: '50px',
				render : function(value, data, render, mapping){
		          return '<div><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnCbplSearch" type="button"></button></div>';
	           }
			}, {
				key : 'qrtCbplId',  align:'center',
				title : 'qrtCbplId',
				width: '100px',
				hidden: true
			}, {
				key : 'qrtSbeqpNm', align:'center',
				title : '분전반 장비명',
				width: '100px'
			}, {
				key : 'qrtSbeqpId',  align:'center',
				title : 'qrtSbeqpId',
				width: '100px',
				hidden: true
			}, {
				key : 'capaVal',  align:'center',
				title : 'MCCB용량',
				width: '70px'
			}, {
				key : 'cblTkns',  align:'center',
				title : '케이블굵기',
				width: '70px'
			}, {
				key : 'tvssInstlStatCd',  align:'center',
				title : 'tvssInstlStatCd',
				width: '100px',
				render : {
	  	    		type : 'string',
	  	    		rule : function(value, data) {
	  	    			var render_data = [];
	  	    				return render_data = render_data.concat(arrStat);
	  	    		}
	  	    	},
	  	    	editable:{
	  	    		type:"select",
	  	    		rule : function(value, data){
	  	    			return arrStat;
	  	    		},
	  	    		attr : {
		 				style : "width: 100%;min-width:85px;padding: 2px 2px;"
		 			}
  	    		},
				editedValue : function(cell) {
					return $(cell).find('select option').filter(':selected').val();
				}
			}, {
				key : 'tvssSbeqpIdList',  align:'center',
				title : 'tvssSbeqpIdList',
				width: '160px',
				editable: {type: 'tvss'},
				refreshBy: function(previousValue, changedValue, changedKey, changedData, changedColumnMapping){
					if(['tvssInstlStatCd'].indexOf(changedColumnMapping.key) > -1){
						return true;
					}
				}
			}, {
				key : 'tmnbxInstlStatCd',  align:'center',
				title : 'tmnbxInstlStatCd',
				width: '100px',
				render : {
	  	    		type : 'string',
	  	    		rule : function(value, data) {
	  	    			var render_data = [];
	  	    				return render_data = render_data.concat(arrStat);
	  	    		}
	  	    	},
	  	    	editable:{
	  	    		type:"select",
	  	    		rule : function(value, data){
	  	    			return arrStat;
	  	    		},
	  	    		attr : {
		 				style : "width: 100%;min-width:85px;padding: 2px 2px;"
		 			}
  	    		},
				editedValue : function(cell) {
					return $(cell).find('select option').filter(':selected').val();
				}
			}, {
				key : 'cbplSbeqpIdList',  align:'center',
				title : 'cbplSbeqpIdList',
				width: '160px',
				editable: {type: 'cbpl'},
				refreshBy: function(previousValue, changedValue, changedKey, changedData, changedColumnMapping){
					if(['tmnbxInstlStatCd'].indexOf(changedColumnMapping.key) > -1){
						//$('#'+qrtGridId).alopexGrid('updateOption', {columnMapping: {editable: false}}, {_index:{row: changedData._index.row}}, 'tvssSbeqpIdList');
						return true;
					}
				}
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

        $('#'+tvssGridId).alopexGrid({
        	pager : false,
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: false,
    		autoColumnIndex: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : '', align:'center',
				title : '연결분전함',
				width: '100px'
			}, {
				key : '', align:'center',
				title : '용량',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : '전용차단기 설치여부',
				width: '120px'
			}, {
				key : '',  align:'center',
				title : '비고',
				width: '300px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+cbplGridId).alopexGrid({
        	pager : false,
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: false,
    		autoColumnIndex: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : '', align:'center',
				title : '연결분전함',
				width: '100px'
			}, {
				key : '', align:'center',
				title : '용량',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : '전용차단기 설치여부',
				width: '120px'
			}, {
				key : '',  align:'center',
				title : '비고',
				width: '300px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    function setData(param) {
    	$('#EpwrStcMgmtDsbnRegForm').setData(param)

    }

    function setSelectCode() {
    	$('#tvssInstlStatCd').clear();
    	$('#tmnbxInstlStatCd').clear();

		var option_data =  [];

		for(var i=0; i<arrStat.length; i++){
			var resObj = arrStat[i];
			option_data.push(resObj);
		}

		if(paramData == '' || paramData == null) {
			$('#tvssInstlStatCd').setData({
	             data:option_data
			});

			$('#tmnbxInstlStatCd').setData({
	             data:option_data
			});
		}
		else {
			$('#tvssInstlStatCd').setData({
	             data:option_data,
	             tvssInstlStatCd:paramData.tvssInstlStatCd
			});

			$('#tmnbxInstlStatCd').setData({
	             data:option_data,
	             tmnbxInstlStatCd:paramData.tmnbxInstlStatCd
			});
		}

		//총 층수
		for(var i=-6; i<0; i++){
			$('#florDivVal').append("<option value='" + i + "'>" + "B" + -i + "층</option>");
		}
		for(var i=1; i<21; i++){
			$('#florDivVal').append("<option value='" + i + "'>" + i + "층</option>");
		}

    }

    function setEventListener() {
    	//취소
    	 $('#btnDsbnCncl').on('click', function(e) {
    		 $a.close();
         });

    	 //닫기
    	 $('#btnClose').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnDsbnReg').on('click', function(e) {
    		 var param = $('#EpwrStcMgmtDsbnRegForm').getData();
    		 var gridParam = $('#'+qrtGridId).alopexGrid('dataGet');

    		 if(param.mtsoNm == '' || param.mtsoNm == null || param.mtsoNm == undefined){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사명'), function(msgId, msgRst){});
    			 return;
    		 }

    		 if (param.florDivVal == "" || param.florDivVal == null || param.florDivVal == undefined) {
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','총 층수'), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.gageId == "" || param.gageId == null || param.gageId == undefined) {
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','계량기함 번호'), function(msgId, msgRst){});
  	     		return;
  	     	 }

  	     	 if (param.mainSbeqpNm == "" || param.mainSbeqpNm == null || param.mainSbeqpNm == undefined) {
 	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','메인분전반 장비명'), function(msgId, msgRst){});
 	     		return;
 	     	 }

  	     	 if (param.tvssInstlStatCd == "" || param.tvssInstlStatCd == null || param.tvssInstlStatCd == undefined) {
	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','메인분전반 TVSS'), function(msgId, msgRst){});
	     		return;
	     	 }

  	     	 if (param.tvssInstlStatCd == "0") {
	     			 if (arrTvss.length == 0) {
	  		    		 callMsgBox('','W', '[메인분전반 TVSS] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
	     			 if (param.tvssSbeqpIdList == "" || param.tvssSbeqpIdList == null || param.tvssSbeqpIdList == undefined) {
	  		    		 callMsgBox('','W', '[메인분전반 TVSS] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
	     	 }

  	     	 if (param.tmnbxInstlStatCd == "" || param.tmnbxInstlStatCd == null || param.tmnbxInstlStatCd == undefined) {
	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','메인분전반 발전 단자함'), function(msgId, msgRst){});
	     		return;
	     	 }

  	     	 if (param.tmnbxInstlStatCd == "0") {
	    			 if (arrCbpl.length == 0) {
	 		    		 callMsgBox('','W', '[메인분전반 발전 단자함] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	 		     		return;
	 		     	 }
	    			 if (param.cbplSbeqpIdList == "" || param.cbplSbeqpIdList == null || param.cbplSbeqpIdList == undefined) {
	 		    		 callMsgBox('','W', '[메인분전반 발전 단자함] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
	 		     		return;
	 		     	 }
	    	 }

  	     	 for(var i=0; i<gridParam.length; i++){
  	     		 if (gridParam[i].qrtSbeqpNm == "" || gridParam[i].qrtSbeqpNm == null || gridParam[i].qrtSbeqpNm == undefined) {
  	 	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','분기분전반 장비명'), function(msgId, msgRst){});
  	 	     		return;
  	 	     	 }

  	     		 if (gridParam[i]._state.editing[7] == "" || gridParam[i]._state.editing[7] == null || gridParam[i]._state.editing[7] == undefined) {
  		    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','분기분전반 TVSS'), function(msgId, msgRst){});
  		     		return;
  		     	 }

  	     		 if (gridParam[i]._state.editing[7] == "0") {
 	     			 if (arrTvss.length == 0) {
	  		    		 callMsgBox('','W', '[분기분전반 TVSS] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
 	     			 if ((gridParam[i]._state.editing[8] == "" || gridParam[i]._state.editing[8] == null || gridParam[i]._state.editing[8] == undefined) && (gridParam[i].tvssSbeqpIdParam == "" || gridParam[i].tvssSbeqpIdParam == null || gridParam[i].tvssSbeqpIdParam == undefined)) {
 	  		    		 callMsgBox('','W', '[분기분전반 TVSS] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
 	  		     		return;
 	  		     	 }
		     	 }

 	  	     	 if (gridParam[i]._state.editing[9] == "" || gridParam[i]._state.editing[9] == null || gridParam[i]._state.editing[9] == undefined) {
 		    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','분기분전반 발전 단자함'), function(msgId, msgRst){});
 		     		return;
 		     	 }

 	  	     	 if (gridParam[i]._state.editing[9] == "0") {
	     			 if (arrCbpl.length == 0) {
	  		    		 callMsgBox('','W', '[분기분전반 발전 단자함] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
	     			 if ((gridParam[i]._state.editing[10] == "" || gridParam[i]._state.editing[10] == null || gridParam[i]._state.editing[10] == undefined) && (gridParam[i].cbplSbeqpIdParam == "" || gridParam[i].cbplSbeqpIdParam == null || gridParam[i].cbplSbeqpIdParam == undefined)) {
	  		    		 callMsgBox('','W', '[분기분전반 발전 단자함] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
		     	 }
			 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 DsbnReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnDsbnMod').on('click', function(e) {
    		 var param = $('#EpwrStcMgmtDsbnRegForm').getData();
    		 var gridParam = $('#'+qrtGridId).alopexGrid('dataGet');

    		 if(param.mtsoNm == '' || param.mtsoNm == null || param.mtsoNm == undefined){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사명'), function(msgId, msgRst){});
    			 return;
    		 }

    		 if (param.florDivVal == "" || param.florDivVal == null || param.florDivVal == undefined) {
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','총 층수'), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.gageId == "" || param.gageId == null || param.gageId == undefined) {
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','계량기함 번호'), function(msgId, msgRst){});
  	     		return;
  	     	 }

  	     	 if (param.mainSbeqpNm == "" || param.mainSbeqpNm == null || param.mainSbeqpNm == undefined) {
 	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','메인분전반 장비명'), function(msgId, msgRst){});
 	     		return;
 	     	 }

  	     	 if (param.tvssInstlStatCd == "" || param.tvssInstlStatCd == null || param.tvssInstlStatCd == undefined) {
	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','메인분전반 TVSS'), function(msgId, msgRst){});
	     		return;
	     	 }

  	     	 if (param.tvssInstlStatCd == "0") {
	     			 if (arrTvss.length == 0) {
	  		    		 callMsgBox('','W', '[메인분전반 TVSS] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
	     			 if (param.tvssSbeqpIdList == "" || param.tvssSbeqpIdList == null || param.tvssSbeqpIdList == undefined) {
	  		    		 callMsgBox('','W', '[메인분전반 TVSS] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
	     	 }

  	     	 if (param.tmnbxInstlStatCd == "" || param.tmnbxInstlStatCd == null || param.tmnbxInstlStatCd == undefined) {
	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','메인분전반 발전 단자함'), function(msgId, msgRst){});
	     		return;
	     	 }

  	     	 if (param.tmnbxInstlStatCd == "0") {
	    			 if (arrCbpl.length == 0) {
	 		    		 callMsgBox('','W', '[메인분전반 발전 단자함] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	 		     		return;
	 		     	 }
	    			 if (param.cbplSbeqpIdList == "" || param.cbplSbeqpIdList == null || param.cbplSbeqpIdList == undefined) {
	 		    		 callMsgBox('','W', '[메인분전반 발전 단자함] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
	 		     		return;
	 		     	 }
	    	 }

  	     	 for(var i=0; i<gridParam.length; i++){
  	     		 if (gridParam[i].qrtSbeqpNm == "" || gridParam[i].qrtSbeqpNm == null || gridParam[i].qrtSbeqpNm == undefined) {
  	 	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','분기분전반 장비명'), function(msgId, msgRst){});
  	 	     		return;
  	 	     	 }

  	     		 if (gridParam[i]._state.editing[7] == "" || gridParam[i]._state.editing[7] == null || gridParam[i]._state.editing[7] == undefined) {
  		    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','분기분전반 TVSS'), function(msgId, msgRst){});
  		     		return;
  		     	 }

  	     		 if (gridParam[i]._state.editing[7] == "0") {
  	     			 if (arrTvss.length == 0) {
 	  		    		 callMsgBox('','W', '[분기분전반 TVSS] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
 	  		     		return;
 	  		     	 }
  	     			 if ((gridParam[i]._state.editing[8] == "" || gridParam[i]._state.editing[8] == null || gridParam[i]._state.editing[8] == undefined) && (gridParam[i].tvssSbeqpIdParam == "" || gridParam[i].tvssSbeqpIdParam == null || gridParam[i].tvssSbeqpIdParam == undefined)) {
  	  		    		 callMsgBox('','W', '[분기분전반 TVSS] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
  	  		     		return;
  	  		     	 }
 		     	 }

  	  	     	 if (gridParam[i]._state.editing[9] == "" || gridParam[i]._state.editing[9] == null || gridParam[i]._state.editing[9] == undefined) {
  		    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','분기분전반 발전 단자함'), function(msgId, msgRst){});
  		     		return;
  		     	 }

  	  	     	 if (gridParam[i]._state.editing[9] == "0") {
	     			 if (arrCbpl.length == 0) {
	  		    		 callMsgBox('','W', '[분기분전반 발전 단자함] 선택 할 수 있는 장비가 없습니다.<br><br>다른 항목을 선택하십시오. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
	     			 if ((gridParam[i]._state.editing[10] == "" || gridParam[i]._state.editing[10] == null || gridParam[i]._state.editing[10] == undefined) && (gridParam[i].cbplSbeqpIdParam == "" || gridParam[i].cbplSbeqpIdParam == null || gridParam[i].cbplSbeqpIdParam == undefined)) {
	  		    		 callMsgBox('','W', '[분기분전반 발전 단자함] 장비선택 시 장비선택은 필수입니다. ', function(msgId, msgRst){});
	  		     		return;
	  		     	 }
		     	 }
			 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 DsbnReg();
    			 }else{
    				 $('#'+qrtGridId).alopexGrid("startEdit");
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnDsbnDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 DsbnDel();
    			 }
    		 });
    	 });

    	 $('#btnUpsdMtsoSearch').on('click',function(e) {
    		 $a.popup({
    		 	popid: 'MtsoLkup',
	          	title: configMsgArray['findMtso'],
	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	            windowpopup : true,
	            modal: true,
	            movable:true,
	            width : 950,
	           	height : 800,
	           	callback : function(data) { // 팝업창을 닫을 때 실행
	                $('#mtsoId').val(data.mtsoId);
	   				$('#mtsoNm').val(data.mtsoNm);
	   				$('#mtsoTypNm').val(data.mtsoTyp);
	   				$('#mtsoTypCd').val(data.mtsoTypCd);
	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/tvssEqp/'+data.mtsoId, null, 'GET', 'tvssEqp');
	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/cbplEqp/'+data.mtsoId, null, 'GET', 'cbplEqp');
	           	}
    		 });
    	 })

    	 //계량기함번호 버튼
    	 $('#btnGageSearch').on('click', function(e) {
    		var param = {"sbeqpClCd": "G", "mtsoNm": $('#mtsoNm').val()};
    		param.fix = "Y";
	   		 $a.popup({
	   	          	popid: 'SbeqpLkupG',
	   	          	title: '장비조회',
	   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpLkup.do',
	   	            data: param,
    	            modal: true,
                    movable:true,
                    windowpopup : true,
	   	            width : 950,
	   	           	height : window.innerHeight * 0.83,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/gageId/'+data.sbeqpId, null, 'GET', 'gageId');
	   	           	}
	   	      });
    	});

    	 //MAIN분전반 장비명 버튼
    	 $('#btnCbplSearch').on('click', function(e){
     		var param = {"sbeqpClCd": "L", "mtsoId": $('#mtsoId').val(), "mtsoNm": $('#mtsoNm').val(), "fix": "Y"};
 	   		 $a.popup({
 	   	          	popid: 'SbeqpLkupL',
 	   	          	title: '장비조회',
 	   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpLkup.do',
 	   	            data: param,
     	            modal: true,
                     movable:true,
                     windowpopup : true,
 	   	            width : 950,
 	   	            height : window.innerHeight * 0.83,
 	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	   	           		$('#mainSbeqpNm').val(data.sbeqpNm);
 	   	           		$('#mainSbeqpId').val(data.sbeqpId);
 	   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/cbplInf/'+data.sbeqpId, null, 'GET', 'mainCbplInf');
 	   	           	}
 	   	      });
     	});

    	//분기 분전반 장비명 버튼
    	 $('#'+qrtGridId).on('click', '#btnCbplSearch', function(e){
    		var evObj = AlopexGrid.parseEvent(e);
     		var param = {"sbeqpClCd": "L", "mtsoId": $('#mtsoId').val(), "mtsoNm": $('#mtsoNm').val(), "fix": "Y"};
 	   		 $a.popup({
 	   	          	popid: 'SbeqpLkupL',
 	   	          	title: '장비조회',
 	   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpLkup.do',
 	   	            data: param,
     	            modal: true,
                     movable:true,
                     windowpopup : true,
 	   	            width : 950,
 	   	            height : window.innerHeight * 0.83,
 	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	   	           	rowIndex = evObj.data._index.data;
	   	           		$('#'+qrtGridId).alopexGrid('cellEdit', data.sbeqpNm, {_index:{row: evObj.data._index.data}}, 'qrtSbeqpNm');
	   	           		$('#'+qrtGridId).alopexGrid('cellEdit', data.sbeqpId, {_index:{row: evObj.data._index.data}}, 'qrtSbeqpId');
 	   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/cbplInf/'+data.sbeqpId, null, 'GET', 'qrtCbplInf');
 	   	           	}
 	   	      });
     	});

    	 $('#basicTabs').on("tabchange", function(e, index) {
  			switch (index) {
  			case 0 :
  				$('#'+tvssGridId).alopexGrid("viewUpdate");
  				break;
  			case 1 :
  				$('#'+cbplGridId).alopexGrid("viewUpdate");
  				break;
  			default :
  				break;
  			}
      	});
    	 //메인분전반 tvss 설치상태 변경
    	 $("#tvssInstlStatCd").on('change', function(e){
    		if($("#tvssInstlStatCd").val() == "0"){
    			$('#tvssSbeqpIdList').setData({data:arrTvss});
    			$("#tvssSbeqpIdList").multiselect("enable");
    		} else {
    			$('#tvssSbeqpIdList').setData({data:[]});
    			$("#tvssSbeqpIdList").multiselect("disable");
    		}

    	 });
    	 //메인분전반 발전단자함 설치상태 변경
    	 $("#tmnbxInstlStatCd").on('change', function(e){
    		if($("#tmnbxInstlStatCd").val() == "0"){
    			$('#cbplSbeqpIdList').setData({data:arrCbpl});
     			$("#cbplSbeqpIdList").multiselect("enable");
    		} else {
    			$('#cbplSbeqpIdList').setData({data:[]});
    			$("#cbplSbeqpIdList").multiselect("disable");
    		}

    	 });
    	 $('#btnQrtAdd').on('click', function(e) {
    		 if($('#mtsoId').val() == ""){
    			 callMsgBox('','W', "국사를 선택하십시오." , function(msgId, msgRst){});
    		 }else{
    			 var addData = {};
        		 var data = $.extend({},addData);
        		 $('#'+qrtGridId).alopexGrid('dataAdd', data, {_index:{row:0}});
        		 $('#'+qrtGridId).alopexGrid("startEdit");
    		 }
         });

    	 $('#btnQrtDel').on('click', function(e) {
     		var data = AlopexGrid.trimData($('#'+qrtGridId).alopexGrid('dataGet', {_state:{selected:true}}));

      		if(data.length > 0){
      			$('#'+qrtGridId).alopexGrid('dataDelete',{_state:{selected:true}});
      		}else{
  				//선택된 데이타가 없습니다.
  				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
  			}
          });
    };

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'saveDsbn'){
			if(response.Result == "Success"){
				$('#'+qrtGridId).alopexGrid('saveEdit', {_state:{editing:true}});
				$('#'+qrtGridId).alopexGrid('endEdit', {_state:{editing:true}});
				var gridParam = $('#'+qrtGridId).alopexGrid('dataGet');
				var gridDelParam = $('#'+qrtGridId).alopexGrid('dataGet', {_state: {added:false, deleted: true}});

				if(gridParam.length == 0 && gridDelParam.length > 0){
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteDsbnQrt', gridDelParam, 'POST', 'deleteDsbnQrt');
				}else if(gridParam.length > 0){
					var userId;
					 if($("#userId").val() == ""){
						 userId = "SYSTEM";
					 }else{
						 userId = $("#userId").val();
					 }

					for(var i=0; i<gridParam.length; i++){
						gridParam[i].mainCbplId = response.resultList.mainCbplId;
						gridParam[i].frstRegUserId = userId;
						gridParam[i].lastChgUserId = userId;

						 if((gridParam[i].tvssSbeqpIdList == "" || gridParam[i].tvssSbeqpIdList == null) && (gridParam[i].tvssSbeqpIdParam == "" || gridParam[i].tvssSbeqpIdParam == null || gridParam[i].tvssSbeqpIdParam == undefined)){
							 gridParam[i].tvssSbeqpIdList = [];
						 }else if((gridParam[i].tvssSbeqpIdList == "" || gridParam[i].tvssSbeqpIdList == null) && (gridParam[i].tvssSbeqpIdParam != "" && gridParam[i].tvssSbeqpIdParam != null && gridParam[i].tvssSbeqpIdParam != undefined)){
							 gridParam[i].tvssSbeqpIdList = [];
							var arrTvssP = gridParam[i].tvssSbeqpIdParam.split(",");
							for (var j = 0; j < arrTvssP.length; j++) {
								gridParam[i].tvssSbeqpIdList.push(arrTvssP[j]);
							}
						 }

						 if((gridParam[i].cbplSbeqpIdList == "" || gridParam[i].cbplSbeqpIdList == null) && (gridParam[i].cbplSbeqpIdParam == "" || gridParam[i].cbplSbeqpIdParam == null || gridParam[i].cbplSbeqpIdParam == undefined)){
							 gridParam[i].cbplSbeqpIdList = [];
						 }else if((gridParam[i].cbplSbeqpIdList == "" || gridParam[i].cbplSbeqpIdList == null) && (gridParam[i].cbplSbeqpIdParam != "" && gridParam[i].cbplSbeqpIdParam != null && gridParam[i].cbplSbeqpIdParam != undefined)){
							 gridParam[i].cbplSbeqpIdList = [];
							var arrCbplP = gridParam[i].cbplSbeqpIdParam.split(",");
							for (var j = 0; j < arrCbplP.length; j++) {
								gridParam[i].cbplSbeqpIdList.push(arrCbplP[j]);
							}
						 }
					}
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveDsbnQrt', gridParam, 'POST', 'saveDsbnQrt');
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteDsbnQrt', gridDelParam, 'POST', '');
				}else{
					//저장을 완료 하였습니다.
					callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
						if (msgRst == 'Y') {
							$a.close();
						}
					});

					var pageNo = $("#pageNo", opener.document).val();
					var rowPerPage = $("#rowPerPage", opener.document).val();
					$(opener.location).attr("href","javascript:dsbn.setGrid("+pageNo+","+rowPerPage+");");
				}
			}
		}
		if(flag == 'saveDsbnQrt'){
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			}
			var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:dsbn.setGrid("+pageNo+","+rowPerPage+");");
		}
		if(flag == 'deleteDsbnQrt'){
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			}
			var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:dsbn.setGrid("+pageNo+","+rowPerPage+");");
		}
		if(flag == 'dsbnDel') {
    		if(response.Result == "Success"){
    			//삭제 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});
    		}
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:dsbn.setGrid("+pageNo+","+rowPerPage+");");
    	}

		if(flag == 'modFlorId'){
			var option_data = [{floorId: '', floorName: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#florId').setData({
				data : option_data,
				option_selected: ''
			});
			setData(paramData);
		}
		if(flag == 'florId'){
			var option_data = [{floorId: '', floorName: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		if(flag == 'gageId'){
			$('#gageId').val(response.gageId);
			$("#gageCustNo").val(response.gageCustNo);
		}

		if(flag == 'tvssEqp'){
			arrTvss = response;

			$('#tvssSbeqpIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tvssSbeqpIdList').setData({
	             data:option_data,
	             tvssSbeqpIdList:paramData.tvssSbeqpIdList
			});
		}

		if(flag == 'cbplEqp'){
			arrCbpl = response;

			$('#cbplSbeqpIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#cbplSbeqpIdList').setData({
	             data:option_data,
	             cbplSbeqpIdList:paramData.cbplSbeqpIdList
			});
		}

		if(flag == 'qrtCbpl'){
			$('#'+qrtGridId).alopexGrid('hideProgress');
    		$('#'+qrtGridId).alopexGrid('dataSet', response);
    		$('#'+qrtGridId).alopexGrid("startEdit");
		}

		if(flag == 'mainCbplInf'){
			$('#mainCapaVal').val(response.capaVal);
			$('#mainCblTkns').val(response.cblTkns);
		}

		if(flag == 'qrtCbplInf'){
			$('#'+qrtGridId).alopexGrid('cellEdit', response.capaVal, {_index:{row: rowIndex}}, 'capaVal');
			$('#'+qrtGridId).alopexGrid('cellEdit', response.cblTkns, {_index:{row: rowIndex}}, 'cblTkns');
		}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'dsbnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function DsbnReg(){

    	var param = $('#EpwrStcMgmtDsbnRegForm').getData();

    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 if(param.tvssSbeqpIdList == ""){
			 param.tvssSbeqpIdList = [];
		 }

		 if(param.cbplSbeqpIdList == ""){
			 param.cbplSbeqpIdList = [];
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveDsbn', param, 'POST', 'saveDsbn');
    }

    function DsbnMod(){
    	var param = $('#EpwrStcMgmtDsbnRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveDsbn', param, 'POST', 'dsbnReg');
    }

    function DsbnDel(){
    	var param = {dsbnId : $('#dsbnId').val()};//$('#EpwrStcMgmtDsbnRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteDsbn', param, 'POST', 'dsbnDel');
    }

    function cblPermVcur(cblTkns){
		if(cblTkns == 2.5){
			return 29;
		}else if(cblTkns == 4){
			return 37;
		}else if(cblTkns == 6){
			return 56;
		}else if(cblTkns == 10){
			return 61;
		}else if(cblTkns == 16){
			return 79;
		}else if(cblTkns == 25){
			return 101;
		}else if(cblTkns == 35){
			return 122;
		}else if(cblTkns == 50){
			return 144;
		}else if(cblTkns == 70){
			return 178;
		}else if(cblTkns == 95){
			return 211;
		}else if(cblTkns == 120){
			return 240;
		}else if(cblTkns == 150){
			return 271;
		}else if(cblTkns == 185){
			return 304;
		}else if(cblTkns == 240){
			return 351;
		}else if(cblTkns == 300){
			return 396;
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