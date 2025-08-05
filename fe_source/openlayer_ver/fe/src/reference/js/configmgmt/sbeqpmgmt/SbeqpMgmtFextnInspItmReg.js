var main = $a.page(function() {

	var gridId = 'sbeqpInspItmGrid';
	var paramData = null;
	var day = null;
	var staDay = null;
	var sbeqpId = null;
	var capaCdData = [{text:'선택', value:''},{text:'양호', value:'Y'}, {text:'불량', value:'N'}];
	var today = new Date();
	var addData  = { "fextnId" : "", "inspStdDate" : sbeqpDtlLkup.calculateDate(0), "almStatCd" : "", "pveCtrlBoxStatCd" : "", "opStatCd" : ""};
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
						if(data.fextnId == null || data.fextnId == "" || data.fextnId == undefined) {//+-수정건
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
							if(data.fextnId == '' || data.fextnId == null) {
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
    		}, {/* 날짜              */
    			key : 'inspStdDate', align:'center', title : '날짜', width: '130px', render : { type: 'date' }
			}, {/* 경보상태 		 */
				key : 'almStatCd', align:'center', title : '경보상태', width: '90px',
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
		 				style : "width: 65px;min-width:65px;"
		 			}
      	    	},
  				editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val();
  				}
			}, {/* 운용상태 		 */
				key : 'opStatCd', align:'center', title : '운용상태', width: '90px',
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
						style : "width: 65px;min-width:65px;"
					}
				},
				editedValue : function(cell) {
					return $(cell).find('select option').filter(':selected').val();
				}
			}, {/* 수동조작함상태 		 */
				key : 'pveCtrlBoxStatCd', align:'center', title : '수동조작함상태', width: '105px',
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
						style : "width: 65px;min-width:65px;"
					}
				},
				editedValue : function(cell) {
					return $(cell).find('select option').filter(':selected').val();
				}
			}, {/* 비고 */
				key : 'bigoCol', align:'center', title : '비고', width: '360px', render : { type: 'bigo' }
			}]
        });

    };

    function search(){
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnMgmt',sbeqpId, 'GET', 'search');
    }

    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {fextnId : ""}, keyValue);
		});
    }

    function setEventListener() {
    	$("#btnRowAdd").on('click', function(e) {//+-수정건
    		var addData  = { "fextnId" : "", "inspStdDate" : sbeqpDtlLkup.calculateDate(0), "almStatCd" : "", "pveCtrlBoxStatCd" : "", "opStatCd" : ""};
	   		var inputData = $.extend({},addData);
    		var data = $('#'+gridId).alopexGrid("dataGet", {_index:{row:0}});

    		if(data == null || data == "" || data == undefined){
    			$('#'+gridId).alopexGrid('dataAdd', inputData, {_index:{row:0}});
	        	$('#'+gridId).alopexGrid("startEdit");
	        	$('#'+gridId).alopexGrid('cellEdit',"", {_state:{selected:true}}, 'bigoCol');
	        	$('#'+gridId).alopexGrid('rowSelect', {_index:{row:0}}, true);
    		}else{
	    		if(data[0].fextnId == null || data[0].fextnId == ""){
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
		        if(data[0].fextnId == null || data[0].fextnId == "" || data[0].fextnId == undefined){
		        	$('#'+gridId).alopexGrid('dataDelete',{_index:{row:0}});
		        	if(chk[0].fextnId =="" || chk[0].fextnId == null || chk[0].fextnId == undefined){
		        		$('#'+gridId).alopexGrid('cellEdit',"", {_state:{selected:true}}, 'bigoCol');
		        		$('#'+gridId).alopexGrid("endEdit");
		      		}

		        }else{

		        }
      		}
    	});

    	$('#'+gridId).on('click', '.bodycell', function(e) {
    		var dataObjFoucs = $('#'+gridId).alopexGrid('dataGet',{_state:{focused:true}});
    		if (dataObjFoucs[0]._key == "inspStdDate" && (dataObjFoucs[0].fextnId == "" || dataObjFoucs[0].fextnId == null || dataObjFoucs[0].fextnId == undefined) ){
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
        			if (dataObj[0]._key == "inspStdDate" && dataObj[0]._state.focused && (dataObj[0].fextnId == "" || dataObj[0].fextnId == null || dataObj[0].fextnId == undefined)) {
            			datePicker(gridId, dataObj[0]._index.grid + "-" + dataObj[0]._index.row + "-" + dataObj[0]._index.column, dataObj[0]._index.row, dataObj[0]._key);
                	} else if (dataObj[0]._key == "checkCol") {
                			for (var i = 0; i < dataCount; i++) {
                				$('#' + gridId + '').alopexGrid("cellEdit", "", {_index : { row : i }}, 'bigoCol');
            				}// for i
                    		var strStyle = "background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae";
                    		//+-수정건
                    		if (dataObj[0].fextnId == null || dataObj[0].fextnId == "") {
                    			$('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnReg' class='Button button2' style='"+strStyle+"' value='등록'></input>", {_index : { row : dataObj[0]._index.row }}, 'bigoCol');
                    		} else {
                    			$('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnMod' class='Button button2' style='"+strStyle+"' value='수정'></input> <input id='btnDel' class='Button button2' style='"+strStyle+"' value='삭제'></input>", {_index : { row : dataObj[0]._index.row }}, 'bigoCol');
                    		}
            		} else {
            			//+-수정건
            			if(dataObj[0]._state.focused && (dataObj[0].fextnId == "" || dataObj[0].fextnId == null || dataObj[0].fextnId == undefined) && acceptDate != dataObj[0].inspStdDate) {
                			dataObj[0].fextnId = $('#fextnId').val();
                			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpFextnInspItmDupChk',dataObj[0], 'GET', 'dupChk');
                			dataObj[0].fextnId = "";
            			}
            		}
        		}
        	} catch (exception) {}
    	});
    	$('#'+gridId).on('click', "[id=btnDel]", function(e){
    		$('#'+gridId).alopexGrid('saveEdit');
    		var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
    		dataObj[0].fextnId = $('#fextnId').val();
    		callMsgBox('','C', "삭제하시겠습니까?", function(msgId, msgRst){
			       //삭제한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/deleteSbeqpFextnInspItmInf', dataObj[0], 'POST', 'sbeqpDel');
		        }
	     	});
    	});

  		$('#'+gridId).on('click', "[id='btnReg']", function(e){
  			$('#'+gridId).alopexGrid('saveEdit');
  			var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
			dataObj[0].fextnId = $('#fextnId').val();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpFextnInspItmDupChk',dataObj[0], 'GET', 'dupChkReg');
			dataObj[0].fextnId = "";//+-수정건
		});
  		$('#'+gridId).on('click', "[id='btnMod']", function(e){
  			$('#'+gridId).alopexGrid('saveEdit');
  			sbeqpFextnInspItmReg();
  		});

  		$('#btnSearch').on('click', function(e) {
    		var param =  $("#sbeqpMgmtFextnInspItmForm").getData();
    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnInspItmMgmt', param, 'GET', 'gridSearch');
  		});
    	 $('#btnCnclReg').on('click', function(e) {
      		 //$a.back();
      		$a.close();
    	 });
	};

	function sbeqpFextnInspItmReg() {
		var dataObj = $('#'+gridId).alopexGrid('dataGet',{_state:{selected:true}});
		var chkNew = "N";//+-수정건
		var userId;
		if(dataObj[0].fextnId == "" || dataObj[0].fextnId == null || dataObj[0].fextnId == undefined){
			chkNew = "Y";
		}
		dataObj[0].sbeqpId = paramData.sbeqpId;
		dataObj[0].fextnId = $('#fextnId').val();
		if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		dataObj[0].frstRegUserId = userId;
		dataObj[0].lastChgUserId = userId;
	 		 if (dataObj[0].inspStdDate == "") {
	    		//필수선택 항목입니다.[ 점검 날짜 ]
	    		callMsgBox('','W', '필수선택 항목입니다.[ 점검 날짜 ]', function(msgId, msgRst){});
	    		if(chkNew == "Y"){//+-수정건
	    			dataObj[0].fextnId = "";
	    		}
	    		return;
	     	 }
	 		 if (dataObj[0].almStatCd == "") {
	 			//필수선택 항목입니다.[ 경보 상태 ]
	 			callMsgBox('','W', '필수선택 항목입니다.[ 경보 상태 ]', function(msgId, msgRst){});
	 			if(chkNew == "Y"){//+-수정건
	    			dataObj[0].fextnId = "";
	    		}
	 			return;
	 		 }
	 		 if (dataObj[0].opStatCd == "") {
	 			 //필수선택 항목입니다.[ 운용 상태  ]
	 			 callMsgBox('','W', '필수선택 항목입니다.[ 운용 상태 ]', function(msgId, msgRst){});
	 			if(chkNew == "Y"){//+-수정건
	    			dataObj[0].fextnId = "";
	    		}
	 			return;
	 		 }
	 		 if (dataObj[0].pveCtrlBoxStatCd == "") {
	 			 //필수선택 항목입니다.[ 수동조작함 상태 ]
	 			 callMsgBox('','W', '필수선택 항목입니다.[ 수동조작함 상태 ]', function(msgId, msgRst){});
	 			if(chkNew == "Y"){//+-수정건
	    			dataObj[0].fextnId = "";
	    		}
	 			return;
	 		 }
	 		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
				       //저장한다고 하였을 경우
			        if (msgRst == 'Y') {
			        	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpFextnInspItmMgmt', dataObj[0], 'POST', 'sbeqpReg');
			        }else{
			        	if(chkNew == "Y"){//+-수정건
			    			dataObj[0].fextnId = "";
			    		}
			        }
		     });
	}

	this.setGrid = function(){
		var param =  $("#sbeqpMgmtFextnInspItmForm").getData();
	   	param.sbeqpId = sbeqpId;

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnInspItmMgmt', param, 'GET', 'gridSearch');
	}

	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'sbeqpReg'){	// 등록
			callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					var param =  $("#sbeqpMgmtFextnInspItmForm").getData();
		    		$('#'+gridId).alopexGrid('showProgress');
		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnInspItmMgmt', param, 'GET', 'gridSearch');
				}
			});
    	}
    	if(flag == 'dupChkReg'){	// 등록
    		var result = response.sbeqpFextnInspItmDupYn;
    		if(result) {
    			callMsgBox('','i', '동일한 점검일자에 이미 저장된 이력이 있습니다.', function(msgId, msgRst){});
    			var dataObj = $('#'+gridId).alopexGrid("dataGet", {"inspStdDate":response.sbeqpFextnInspItmDupYn});
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
               	sbeqpFextnInspItmReg();
    		}
    	}
    	if(flag == 'sbeqpDel'){	// 삭제
    		//'삭제를 성공 하였습니다.'
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    			if (msgRst == 'Y') {
					var param =  $("#sbeqpMgmtFextnInspItmForm").getData();
		    		$('#'+gridId).alopexGrid('showProgress');
		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnInspItmMgmt', param, 'GET', 'gridSearch');
	    		}
	    	 });
    	}
    	if(flag == 'search'){	// 상세 View
    		var result = response.sbeqpFextnMgmtList[0];
    		$('#sbeqpDtlLkupForm').setData(result);
    		$('#sbeqpMgmtFextnInspItmForm').setData(result);
    		var param =  $("#sbeqpMgmtFextnInspItmForm").getData();
    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnInspItmMgmt', param, 'GET', 'gridSearch');
    	}
    	if(flag == 'gridSearch'){	// 점검항목 리스트
    		$('#'+gridId).alopexGrid('hideProgress');
    		var result = response.sbeqpFextnInspItmMgmtList;
//    		addData  = { "fextnId" : "", "inspStdDate" : sbeqpDtlLkup.calculateDate(0), "almStatCd" : "", "pveCtrlBoxStatCd" : "", "opStatCd" : ""};
//    		result.unshift(addData);
	       	$('#'+gridId).alopexGrid('dataSet', response.sbeqpFextnInspItmMgmtList);

//	       	$('#'+gridId).alopexGrid("startEdit");
//	        $('#'+gridId).alopexGrid('rowSelect', {_index:{row:0}}, true);
//	        $('#' + gridId + '').alopexGrid("cellEdit", "<input id='btnReg' class='Button button2' style='background-color: #fff !important; color: #383fae !important; border: 1px solid #383fae' value='등록'></input>", {_index : { row : 0 }}, 'bigoCol');
    	}
    	if(flag == 'dupChk'){	// 상세 View
    		var result = response.sbeqpFextnInspItmDupYn;
    		if(result) {
    			callMsgBox('','i', '동일한 점검일자에 이미 저장된 이력이 있습니다.', function(msgId, msgRst){});
    			var dataObj = $('#'+gridId).alopexGrid("dataGet", {"inspStdDate":response.sbeqpFextnInspItmDupYn});
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