var main = $a.page(function() {

	var gridId = 'sbeqpIntnRstnRsltGrid';
	var paramData = null;
	var day = null;
	var staDay = null;
	var sbeqpId = null;
	var today = new Date();
	var addData  = { "batryId" : "", "msmtDate" : sbeqpDtlLkup.calculateDate(0), "depthVoltVal" : "0", "arvlTime" : "0","prtVolt5MinuVal" : "0","prtVolt10MinuVal" : "0","prtVolt15MinuVal" : "0","prtVolt20MinuVal" : "0","prtVolt25MinuVal" : "0","prtVolt30MinuVal" : "0","dchgTestRsltStatCd" : "",};
	var acceptDate = null;

	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	window.resizeTo(900,800);
    	$a.maskedinput($('#searchStartDate')[0], '0000-00-00');
    	$a.maskedinput($('#searchEndDate')[0], '0000-00-00');
    	paramData = param;
    	sbeqpId = {"sbeqpId":paramData.sbeqpId};
        $('#searchStartDate').val(sbeqpDtlLkup.calculateDate(30));
        $('#searchEndDate').val(sbeqpDtlLkup.calculateDate(0));

    	initGrid();
        setEventListener();
        search();
    };
  //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({

        	height: "6row",

        	autoColumnIndex: true,
        	autoResize: true,
        	focusMoveAtEditEnd: true,
        	cellInlineEdit: true,
        	cellSelectable : true,
        	alwaysShowVerticalScrollBar : true, //세로 스크롤바
        	rowInlineEdit : true, //행전체 편집기능 활성화
        	rowClickSelect : false,
        	rowSingleSelect : true,
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: false},
        	enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		columnFixUpto: 1,
    		paging : {
				pagerTotal: false,
			},
    		renderMapping: {
    			"date" :  {
					renderer: function(value, data, render, mapping) {
						var $x
						if(data.batryId == null || data.batryId == "" || data.batryId == undefined) {//+-수정건
							$x = $('<div class="Daterange daterange"><div class="Startdate"><input value="' + value + '" style="width:100px;"></div></div>');
						}
						else {
							$x = $('<div>'+value+'</div>');
						}
        				$a.convert($x);

        				return $x;
					},
					editedValue: function(cell) {

						var strFormatDate = $(cell).find('input').val();

						if( strFormatDate.length == 10 ) {
							strFormatDate = strFormatDate.replace(/-/g,"");
						}

						return strFormatDate;
					}
				},
				"bigo" :  {
					renderer: function(value, data, render, mapping) {
						var $x;
						if (value == undefined || value == "undefined") {
							if(data.batryId == '' || data.batryId == null) {
								$x = $('<div style="width:100%; text-align:left;"><button type="button" class="Button button2" id="btnReg" style="background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae"><span>등록</span></button></div>');
							} else {
								$x = $('<div style="width:100%; text-align:left;"></div>');
							}

						} else{
							$x = $('<div style="width:100%; text-align:left;">'+value+'</div>');
						}
        				$a.convert($x);
        				return $x;
					}
				},
				"maskedInput": {
					renderer: function(value, data, render, mapping, grid) {
						var maskedInput = '<input type="text" class="Textinput textinput w50"  data-keyfilter-rule="numberRule" maxlength="11" value="'+value+'">';
						return maskedInput;
					}
//					postRender: function(cell, value, data, render, mapping, grid) {
//						var $cell = $(cell);
//						var $maskedInput = $cell.find('.testInput');
//						$a.maskedinput($maskedInput[0],"0000000000");
//					}
				}
			},
        	columnMapping: [{
    			selectorColumn : true, title : " ", key: 'checkCol', width : '36px', align: 'left'
    		}, {/* 측정일자         */
				key : 'msmtDate', align:'center', title : '측정일자', width: '130px', render : { type: 'date' }
			}, {/* CELL1     	 */
				key : 'cellMsmt1Val', align:'center', title : 'CELL1', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL2     	 */
				key : 'cellMsmt2Val', align:'center', title : 'CELL2', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL3     	 */
				key : 'cellMsmt3Val', align:'center', title : 'CELL3', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL4     	 */
				key : 'cellMsmt4Val', align:'center', title : 'CELL4', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL5     	 */
				key : 'cellMsmt5Val', align:'center', title : 'CELL5', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL6     	 */
				key : 'cellMsmt6Val', align:'center', title : 'CELL6', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL7     	 */
				key : 'cellMsmt7Val', align:'center', title : 'CELL7', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL8     	 */
				key : 'cellMsmt8Val', align:'center', title : 'CELL8', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL9     	 */
				key : 'cellMsmt9Val', align:'center', title : 'CELL9', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL10     	 */
				key : 'cellMsmt10Val', align:'center', title : 'CELL10', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL11     	 */
				key : 'cellMsmt11Val', align:'center', title : 'CELL11', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL12     	 */
				key : 'cellMsmt12Val', align:'center', title : 'CELL12', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL13     	 */
				key : 'cellMsmt13Val', align:'center', title : 'CELL13', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL14     	 */
				key : 'cellMsmt14Val', align:'center', title : 'CELL14', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL15     	 */
				key : 'cellMsmt15Val', align:'center', title : 'CELL15', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL16     	 */
				key : 'cellMsmt16Val', align:'center', title : 'CELL16', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL17     	 */
				key : 'cellMsmt17Val', align:'center', title : 'CELL17', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL18     	 */
				key : 'cellMsmt18Val', align:'center', title : 'CELL18', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL19     	 */
				key : 'cellMsmt19Val', align:'center', title : 'CELL19', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL20     	 */
				key : 'cellMsmt20Val', align:'center', title : 'CELL20', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL21     	 */
				key : 'cellMsmt21Val', align:'center', title : 'CELL21', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL22     	 */
				key : 'cellMsmt22Val', align:'center', title : 'CELL22', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL23     	 */
				key : 'cellMsmt23Val', align:'center', title : 'CELL23', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL24     	 */
				key : 'cellMsmt24Val', align:'center', title : 'CELL24', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL25     	 */
				key : 'cellMsmt25Val', align:'center', title : 'CELL25', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL26     	 */
				key : 'cellMsmt26Val', align:'center', title : 'CELL26', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL27     	 */
				key : 'cellMsmt27Val', align:'center', title : 'CELL27', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL28     	 */
				key : 'cellMsmt28Val', align:'center', title : 'CELL28', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL29     	 */
				key : 'cellMsmt29Val', align:'center', title : 'CELL29', width: '70px', editable: {type:'maskedInput'}
			}, {/* CELL30     	 */
				key : 'cellMsmt30Val', align:'center', title : 'CELL30', width: '70px', editable: {type:'maskedInput'}
			}, {/* 비고 */
				key : 'bigoCol', align:'center', title : '비고', width: '160px', render : { type: 'bigo' }
			}]
        });
    };

    function search(){
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryMgmt',sbeqpId, 'GET', 'search');
    }

    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {batryId : ""}, keyValue);
		});
    }

    function setEventListener() {
    	$("#btnRowAdd").on('click', function(e) {//+-수정건
    		var addData  = { "batryId" : "", "msmtDate" : sbeqpDtlLkup.calculateDate(0), "depthVoltVal" : "0", "arvlTime" : "0","prtVolt5MinuVal" : "0","prtVolt10MinuVal" : "0","prtVolt15MinuVal" : "0","prtVolt20MinuVal" : "0","prtVolt25MinuVal" : "0","prtVolt30MinuVal" : "0","dchgTestRsltStatCd" : "",};
	   		var inputData = $.extend({},addData);
    		var data = $('#'+gridId).alopexGrid("dataGet", {_index:{row:0}});

    		if(data == null || data == "" || data == undefined){
    			$('#'+gridId).alopexGrid('dataAdd', inputData, {_index:{row:0}});
	        	$('#'+gridId).alopexGrid("startEdit");
	        	$('#'+gridId).alopexGrid('cellEdit',"", {_state:{selected:true}}, 'bigoCol');
	        	$('#'+gridId).alopexGrid('rowSelect', {_index:{row:0}}, true);
    		}else{
	    		if(data[0].batryId == null || data[0].batryId == ""){
		        }else{
		        	$('#'+gridId).alopexGrid('dataAdd', inputData, {_index:{row:0}});
		        	$('#'+gridId).alopexGrid("startEdit");
		        	$('#'+gridId).alopexGrid('cellEdit',"", {_state:{selected:true}}, 'bigoCol');
		        	$('#'+gridId).alopexGrid('rowSelect', {_index:{row:0}}, true);
		        }
    		}
    	});

    	$("#btnRowDel").on('click', function(e) {//+-수정건
      		var data = $('#'+gridId).alopexGrid("dataGet", {_index:{row:0}});
      		var chk = $('#'+gridId).alopexGrid("dataGet", {_state:{selected:true}});

      		if(data == null || data == "" || data == undefined){

      		}else{
		        if(data[0].batryId == null || data[0].batryId == "" || data[0].batryId == undefined){
		        	$('#'+gridId).alopexGrid('dataDelete',{_index:{row:0}});
		        	if(chk[0].batryId =="" || chk[0].batryId == null || chk[0].batryId == undefined){
		        		$('#'+gridId).alopexGrid('cellEdit',"", {_state:{selected:true}}, 'bigoCol');
		        		$('#'+gridId).alopexGrid("endEdit");
		      		}

		        }else{

		        }
      		}
    	});

    	$('#'+gridId).on('click', '.bodycell', function(e) {
    		var dataObjFoucs = $('#'+gridId).alopexGrid('dataGet',{_state:{focused:true}});
    		if (dataObjFoucs[0]._key == "msmtDate" && (dataObjFoucs[0].batryId == "" || dataObjFoucs[0].batryId == null || dataObjFoucs[0].batryId == undefined) ){
	    		datePicker(gridId, dataObjFoucs[0]._index.grid + "-" + dataObjFoucs[0]._index.row + "-" + dataObjFoucs[0]._index.column, dataObjFoucs[0]._index.row, dataObjFoucs[0]._key);
			}
        	var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
        	var dataCount = $('#'+gridId).alopexGrid('dataGet').length;

        	if(dataObjFoucs[0]._key == "checkCol" && (dataObj == null || dataObj == "" || dataObj == undefined)){//+-수정건
    			for (var i = 0; i < dataCount; i++) {
    				$('#'+gridId).alopexGrid("endEdit");
    				$('#'+gridId).alopexGrid("cellEdit", "", {_index : { row : i }}, 'bigoCol');
				}
        	}
        	try {
        		if(dataObjFoucs[0]._key == "checkCol" && dataObj[0]._state.selected == true){//+-수정건
        			$('#'+gridId).alopexGrid("startEdit");
        		}

        		if(dataObj[0]._key != "bigoCol") {
        			if (dataObj[0]._key == "msmtDate" && dataObj[0]._state.focused && (dataObj[0].batryId == "" || dataObj[0].batryId == null || dataObj[0].batryId == undefined)) {
            			datePicker(gridId, dataObj[0]._index.grid + "-" + dataObj[0]._index.row + "-" + dataObj[0]._index.column, dataObj[0]._index.row, dataObj[0]._key);
                	} else if (dataObj[0]._key == "checkCol") {
                			for (var i = 0; i < dataCount; i++) {
                				$('#' + gridId + '').alopexGrid("cellEdit", "", {_index : { row : i }}, 'bigoCol');
            				}// for i
                    		var strStyle = "background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae";
                    		//+-수정건
                    		if (dataObj[0].batryId == null || dataObj[0].batryId == "") {
                    			$('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnReg' class='Button button2' style='"+strStyle+"' value='등록'></input>", {_index : { row : dataObj[0]._index.row }}, 'bigoCol');
                    		} else {
                    			$('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnMod' class='Button button2' style='"+strStyle+"' value='수정'></input> <input id='btnDel' class='Button button2' style='"+strStyle+"' value='삭제'></input>", {_index : { row : dataObj[0]._index.row }}, 'bigoCol');
                    		}
            		} else {
            			//+-수정건
            			if(dataObj[0]._state.focused && (dataObj[0].batryId == "" || dataObj[0].batryId == null || dataObj[0].batryId == undefined) && acceptDate != dataObj[0].msmtDate) {
                			dataObj[0].batryId = $('#batryId').val();
                			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpBatryIntnRstnRsltDupChk',dataObj[0], 'GET', 'dupChk');
                			dataObj[0].batryId = "";
            			}
            		}
        		}
        	} catch (exception) {}
    	});
    	$('#'+gridId).on('click', "[id=btnDel]", function(e){
    		$('#'+gridId).alopexGrid('saveEdit');
    		var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
    		dataObj[0].batryId = $('#batryId').val();
    		callMsgBox('','C', "삭제하시겠습니까?", function(msgId, msgRst){
			       //삭제한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/deleteSbeqpBatryIntnRstnRsltInf', dataObj[0], 'POST', 'sbeqpDel');
		        }
	     	});
    	});

  		$('#'+gridId).on('click', "[id='btnReg']", function(e){
  			$('#'+gridId).alopexGrid('saveEdit');
  			var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
			dataObj[0].batryId = $('#batryId').val();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpBatryIntnRstnRsltDupChk',dataObj[0], 'GET', 'dupChkReg');
			dataObj[0].batryId = "";//+-수정건
		});
  		$('#'+gridId).on('click', "[id='btnMod']", function(e){
	       	$('#'+gridId).alopexGrid('saveEdit');
	       	sbeqpBatryIntnRstnRsltReg();
  		});

  		$('#btnSearch').on('click', function(e) {
    		var param =  $("#sbeqpMgmtBatryIntnRstnRsltForm").getData();
    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryIntnRstnRsltMgmt', param, 'GET', 'gridSearch');
  		});
    	 $('#btnCnclReg').on('click', function(e) {
    		 if(paramData.epwrFlag == "Y"){
    			 $a.close();
    		 } else{
    			 $a.back();
    		 }
    	 });
	};

	function sbeqpBatryIntnRstnRsltReg() {
		var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
		var chkNew = "N";//+-수정건
		var userId;
		if(dataObj[0].batryId == "" || dataObj[0].batryId == null || dataObj[0].batryId == undefined){
			chkNew = "Y";
		}
		dataObj[0].sbeqpId = paramData.sbeqpId;
		dataObj[0].batryId = $('#batryId').val();

		if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		dataObj[0].frstRegUserId = userId;
		dataObj[0].lastChgUserId = userId;

	 		 if (dataObj[0].msmtDate == "") {
	    		//필수선택 항목입니다.[ 시험 일자 ]
	    		callMsgBox('','W', '필수선택 항목입니다.[ 시험 일자 ]', function(msgId, msgRst){});
	    		if(chkNew == "Y"){//+-수정건
	    			dataObj[0].batryId = "";
	    		}
	     		return;
	     	 }
	 		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
				       //저장한다고 하였을 경우
			        if (msgRst == 'Y') {
			        	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpBatryIntnRstnRsltMgmt', dataObj[0], 'POST', 'sbeqpReg');
			        }else{
			        	if(chkNew == "Y"){//+-수정건
			    			dataObj[0].batryId = "";
			    		}
			        }
		     });
	}

	this.setGrid = function(){
		var param =  $("#sbeqpMgmtBatryIntnRstnRsltForm").getData();
	   	param.sbeqpId = sbeqpId;

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryIntnRstnRsltMgmt', param, 'GET', 'gridSearch');
	}

	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'sbeqpReg'){	// 등록
			callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					var param =  $("#sbeqpMgmtBatryIntnRstnRsltForm").getData();
		    		$('#'+gridId).alopexGrid('showProgress');
		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryIntnRstnRsltMgmt', param, 'GET', 'gridSearch');
				}
			});
    	}
    	if(flag == 'dupChkReg'){	// 등록
    		var result = response.sbeqpBatryIntnRstnRsltDupYn;
    		if(result) {
    			callMsgBox('','i', '동일한 점검일자에 이미 저장된 이력이 있습니다.', function(msgId, msgRst){});
    			var dataObj = $('#'+gridId).alopexGrid("dataGet", {"msmtDate":response.sbeqpBatryIntnRstnRsltDupYn});
    			if(dataObj != '' && dataObj != null && dataObj != undefined){
        			$('#'+gridId).alopexGrid('rowSelect', {_index:{row:dataObj[1]._index.row}}, true);
        			$('#' + gridId + '').alopexGrid("cellEdit", "", {_index : { row : 0 }}, 'bigoCol');
        			$('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnMod' class='Button button2' style='background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae' value='수정'></input> <input id='btnDel' class='Button button2' style='background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae' value='삭제'></input>", {_index : { row : dataObj[1]._index.row }}, 'bigoCol');
        			dataObj[1]._state.selected = true;
        			$('#'+gridId).alopexGrid('saveEdit');
    			}
    		}
    		else{
               	$('#'+gridId).alopexGrid('saveEdit');
               	sbeqpBatryIntnRstnRsltReg();
    		}
    	}
    	if(flag == 'sbeqpDel'){	// 삭제
    		//'삭제를 성공 하였습니다.'
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    			if (msgRst == 'Y') {
					var param =  $("#sbeqpMgmtBatryIntnRstnRsltForm").getData();
		    		$('#'+gridId).alopexGrid('showProgress');
		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryIntnRstnRsltMgmt', param, 'GET', 'gridSearch');
	    		}
	    	 });
    	}
    	if(flag == 'search'){	// 상세 View
    		var result = response.sbeqpBatryMgmtList[0];
    		$('#sbeqpDtlLkupForm').setData(result);
    		$('#sbeqpMgmtBatryIntnRstnRsltForm').setData(result);
    		var param =  $("#sbeqpMgmtBatryIntnRstnRsltForm").getData();
    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryIntnRstnRsltMgmt', param, 'GET', 'gridSearch');
    		gridHide(result.cellCnt);
    	}
    	if(flag == 'gridSearch'){	// 내부저항 리스트
    		$('#'+gridId).alopexGrid('hideProgress');
    		var result = response.sbeqpBatryIntnRstnRsltMgmtList;
//    		addData  = { "batryId" : "", "msmtDate" : sbeqpDtlLkup.calculateDate(0), "depthVoltVal" : "0", "arvlTime" : "0","prtVolt5MinuVal" : "0","prtVolt10MinuVal" : "0","prtVolt15MinuVal" : "0","prtVolt20MinuVal" : "0","prtVolt25MinuVal" : "0","prtVolt30MinuVal" : "0","dchgTestRsltStatCd" : "",};
//    		result.unshift(addData);
	       	$('#'+gridId).alopexGrid('dataSet', response.sbeqpBatryIntnRstnRsltMgmtList);

//	       	$('#'+gridId).alopexGrid("startEdit");
//	        $('#'+gridId).alopexGrid('rowSelect', {_index:{row:0}}, true);
//	        $('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnReg' class='Button button2' style='background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae' value='등록'></input>", {_index : { row : 0 }}, 'bigoCol');
    	}
    	if(flag == 'dupChk'){	// 상세 View
    		var result = response.sbeqpBatryIntnRstnRsltDupYn;
    		if(result) {
    			callMsgBox('','i', '동일한 점검일자에 이미 저장된 이력이 있습니다.', function(msgId, msgRst){});
    			var dataObj = $('#'+gridId).alopexGrid("dataGet", {"msmtDate":response.sbeqpBatryIntnRstnRsltDupYn});
    			if(dataObj != '' && dataObj != null && dataObj != undefined){
        			$('#'+gridId).alopexGrid('rowSelect', {_index:{row:dataObj[1]._index.row}}, true);
        			$('#' + gridId + '').alopexGrid("cellEdit", "", {_index : { row : 0 }}, 'bigoCol');
        			$('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnMod' class='Button button2' style='background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae' value='수정'></input> <input id='btnDel' class='Button button2' style='background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae' value='삭제'></input>", {_index : { row : dataObj[1]._index.row }}, 'bigoCol');
        			dataObj[1]._state.selected = true;
        			$('#'+gridId).alopexGrid('saveEdit');
    			}
    		}
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function lpad(s) {
    	if((s.toString()).length < 2){
    		s = '0'+s;
    	}
    	return s;
    }

    function gridHide(cnt) {
    	for(var i=parseInt(cnt)+1; i<=30; i++){
    		$('#'+gridId).alopexGrid("hideCol", ['cellMsmt'+i+'Val'], 'conceal');
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