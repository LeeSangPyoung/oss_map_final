/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점
	let mwSctnId = null;
	let gridId2 = 'freqGrid';
	let mwChnlNoVal = 0;
	let perPage = 100;
	let mwSctnIdFlagC = null;
	let dsnMWDetailDelList = [];

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

//    	let isRefresh = false;
//    	if(!isRefresh && (document.referrer === window.location.href)) {
//    		isRefresh = true;
//    		if(!param) {
//    			param = JSON.parse(sessionStorage.getItem('param'));
//    		}
//    	} else {
//    		document.addEventListener("keydown", (event) => {
//    			if(event.key === "F5" || (event.ctrlKey && event.key === "r")) {
//    				isRefresh = true;
//    	    		if(!param) {
//    	    			param = JSON.parse(sessionStorage.getItem('param'));
//    	    		}
//    	    	}
//    		});
//
//    		if(!isRefresh) {
//    			window.addEventListener("beforeunload", () =>  {
//    				isRefresh = true;
//    	    		if(!param) {
//    	    			param = JSON.parse(sessionStorage.getItem('param'));
//    	    		}
//    			});
//    		}
//
//    		if(!isRefresh) {
//    			window.addEventListener("unload", () => {
//    				isRefresh = true;
//    	    		if(!param) {
//    	    			param = JSON.parse(sessionStorage.getItem('param'));
//    	    		}
//    			});
//    		}
//
//    		if(!param && !sessionStorage.getItem('param')) {
//            	sessionStorage.setItem('param', JSON.stringify(param));
//    		}
//    	}

    	setSelectCode();     //select 정보 세팅

    	if(param.mwSctnId) {
    		mwSctnId = param.mwSctnId;
			$("#mwSctnId").val(mwSctnId);

	        getMWMasterDetailData(param, 1, perPage);

    	} else {
    		$("#mwSctnId").val("MW***********");
    		$('#flag').val("C");
    	}

    	initGrid();
		$('#mwSctnId').setEnabled(false);
		$('#umtsoEqpEms').setEnabled(false);
		$('#lmtsoEqpEms').setEnabled(false);
        setEventListener();  //이벤트
    };

    function getMWMasterDetailData(param, page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		param = $("#dsnMwForm").getData();
		if($('#flag').val() == 'C') {
			param.mwSctnId = mwSctnIdFlagC;
		}

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/netmenu/getMWMasterDetailData',
			data:param,
			method:'GET',
			async:true
			}).done(
			function(response) {
				let master = response.master;
				$.each(master, function(key, value) {

					const $field = $(`[name="${key}"]`);

					if($field.is(":radio") || $field.is(":checkbox")) {
						if(Array.isArray(value)) {
							value.forEach(val => $field.filter(`[value="${val}"`).prop("checked", true));
						} else {
							$field.filter(`[value="${value}"]`).prop("checked", true);
						}
					} else if ($field.is("select")) {
						$field.val(value);
					} else {
						$field.val(value);
					}
				});

				let serverPageinfo = {};
	    		$('#'+gridId2).alopexGrid('hideProgress');
	    		serverPageinfo = {
	    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
	    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
	    		};

	    		$('#'+gridId2).alopexGrid('dataSet', response.freqList, serverPageinfo);

	    		$('#flag').val("U");

			}.bind(this)
			);
    }

//    function getFreqID() {
//    	let param = {};
//
//		Util.jsonAjax({
//			url: '/transmisson/tes/engineeringmap/netmenu/getNextFreqID',
//			data:param,
//			method:'GET',
//			async:false
//			}).done(
//			function(response) {
//
//				if(response.nextFreqId) {
//					mwSctnId = response.nextFreqId;
//
//					$("#mwSctnId").val(mwSctnId);
//					$("#mwSctnId").attr('readonly', true).css('background-color','#f0f0f0');
//				}
//
//			}.bind(this)
//		);
//    }

    //Grid 초기화
	function initGrid() {
		//그리드 생성
		$('#'+gridId2).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '5row',
			fitTableWidth : true,
			autoResize: true,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: true,
			numberingColumnFromZero: false,
			columnMapping: [
				{
					key: 'check', align: 'center',
					selectorColumn : true,
					width : '30px'
				}, {
					key : 'mwSctnId', align : 'center',
					title : '구간관리번호',
					editable: false,
					width : '100'
				}, {
					key : 'mwChnlNoVal', align : 'center',
					title : '<em class="color_red">* </em>주파수 순번',
					editable: true,
					width : '100',
					allowEdit: function(value, data, mapping) {
						if (data.mwSctnId == 'MW***********' || data.flag == 'ADD') {
							return true;
						} else {
							return false;
						}
					},
					valid : function(value, data) {
						if(/^[0-9]*$/.test(value)) {
							return true;
						}
						callMsgBox('','I', '주파수 순번은 숫자만 입력 가능합니다.', function(msgId, msgRst){});
						return false;
					}
				}, {
					key : 'mwFreqVal', align : 'center',
					title : '주파수',
					editable: true,
					width : '100'
				}, {
					key : 'odrUnitTypVal', align : 'center',
					title : 'ODU Type',
					editable: true,
					width : '100'
				}, {
					key : 'mwModulMeansVal', align : 'center',
					title : '변조방식',
					editable: true,
					width : '100'
				}, {
					key : 'mwBdwhVal', align : 'center',
					title : '대역폭',
					editable: true,
					width : '100'
				}, {
					key : 'chnlCapaVal', align : 'center',
					title : '<em class="color_red">* </em>용량(Mbit/s)',
					editable: true,
					width : '100',
					valid : function(value, data) {
						if(/^[0-9]*$/.test(value)) {
							return true;
						}
						callMsgBox('','I', '주파수 용량은 숫자만 입력 가능합니다.', function(msgId, msgRst){});
						return false;
					}
				}, {
					key : 'protMeansVal', align : 'center',
					title : '보호방식',
					editable: true,
					width : '100'
				}
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	}

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	let $mwDivVal = $("#mwDivVal");	//M/W 구분
    	let options = [
    		{text: "D-MW", value: "D-MW"},
    		{text: "E-MW", value: "E-MW"},
    		{text: "CPRI-MW", value: "CPRI-MW"}];

    	$.each(options, function(i, option) {
    		$mwDivVal.append(new Option(option.text, option.value));
    	});

    	let $usgDivVal = $("#usgDivVal"); //용도구분
    	options = [
    		{text:"도서형", value: "도서형"},
    		{text:"내륙형", value: "내륙형"}];

    	$.each(options, function(i, option) {
    		$usgDivVal.append(new Option(option.text, option.value));
    	});

    	let $venders = $("#vendNm");
    	options = [
    		{text:"Ericsson",value: "Ericsson"},
    		{text:"Nokia",   value: "Nokia"},
    		{text:"Huawei",  value: "Huawei"}];

    	$.each(options, function(i, option) {
    		$venders.append(new Option(option.text, option.value));
    	});
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {
    	// 오른쪽 메뉴 클릭 차단
    	window.addEventListener("contextmenu", (event) => {
    		event.preventDefault();
    	});

    	// f5 , Ctrl + R 차단
//    	window.addEventListener("keydown", function(event) {
//    		if(event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
//    			event.preventDefault();
//    		}
//    	});

    	$('#btnSearchUmtsoEqp').on('click', function(e) {
	   		$a.popup({
		          	popid: 'EqpLkup',
		          	title: '장비조회',
		            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
		            modal: true,
		            movable:true,
		            width : 950,
		           	height : window.innerHeight * 0.83,
		           	callback : function(data) { // 팝업창을 닫을 때 실행
		           		$("#umtsoEqpNm").val(data.eqpNm);
		           		$("#umtsoEqpId").val(data.eqpId);
		           		$("#umtsoEqpEms").val(data.eqpTid);
		           	}
		    });
	    });

    	$('#btnSearchLmtsoEqp').on('click', function(e) {
	   		$a.popup({
	          	popid: 'EqpLkup',
	          	title: '장비조회',
	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
	            modal: true,
	            movable:true,
	            width : 950,
	           	height : window.innerHeight * 0.83,
	           	callback : function(data) { // 팝업창을 닫을 때 실행
	           		$("#lmtsoEqpNm").val(data.eqpNm);
	           		$("#lmtsoEqpId").val(data.eqpId);
	           		$("#lmtsoEqpEms").val(data.eqpTid);
	           	}
	   		});
    	});

    	$("#mtsoDelBtn").on('click', function(e) {
    		callMsgBox('delConfirm','C', '삭제 하시겠습니까?', function(msgId, msgRst){
				if ('delConfirm' == msgId && 'Y' == msgRst) {
					$("#flag").val("D");
	        		save();
				}
    		});
    	});

    	$("#addBtn").on('click', function(e) {
    		setGridAddRow();
    	});

    	$("#delBtn").on('click', function(e) {
//    		callMsgBox('delRowConfirm','C', '선택한 행을 삭제 하시겠습니까?', function(msgId, msgRst){
//				if ('delRowConfirm' == msgId && 'Y' == msgRst) {
					setGridRowDel();

//					if(mwSctnId != null) {
//						getFreqList(JSON.parse(sessionStorage.getItem('param')), 1, perPage);
//					}
//				}
//    		});
    	});

    	$("#mtsoSaveBtn").on("click", function(e) {
    		$('#'+gridId2).alopexGrid('endEdit');
    		if($("#mwSctnNm").val().trim() == ''){
    			callMsgBox('','I', 'M/W구간명을 입력해 주십시오.', function(msgId, msgRst){});
  	     		return;
    		};

    		if($("#umtsoEqpNm").val().trim() == '') {
    			callMsgBox('','I', '상위국 장비명을 입력해 주십시오.', function(msgId, msgRst){});
  	     		return;
    		};

    		if($("#lmtsoEqpNm").val().trim() == '') {
    			callMsgBox('','I', '하위국 장비명을 입력해 주십시오.', function(msgId, msgRst){});
  	     		return;
    		};

    		let updateData = AlopexGrid.trimData($('#'+gridId2).alopexGrid('dataGet', {_state: {edited:true}}, {_state:{editing:true}}, {_state: {added:true}}, {_state: {editing:true}}[0]));
    		dsnMWDetailList = updateData;

    		if(dsnMWDetailList.length === 0) {
    			callMsgBox('','I', '주파수 정보를 최소 1개 이상 추가해 주십시오.', function(msgId, msgRst){});
  	     		return;
    		};

    		if(dsnMWDetailList.length > 0) {
    			for(var i=0; i<dsnMWDetailList.length; i++) {
    				for(var j=i+1; j<dsnMWDetailList.length; j++) {
    					if(dsnMWDetailList[i].mwChnlNoVal == dsnMWDetailList[j].mwChnlNoVal) {
    						callMsgBox('','I', '동일한 주파수 순번이 존재합니다.', function(msgId, msgRst){});
        					return;
    					}
    				}

    				if(dsnMWDetailList[i].mwChnlNoVal == undefined || dsnMWDetailList[i].mwChnlNoVal.trim().length == 0) {
    					callMsgBox('','I', '주파수 순번을 입력해 주십시오.', function(msgId, msgRst){});
    					return;
    				}

    				if(isNaN(Number(dsnMWDetailList[i].mwChnlNoVal))) {
    					callMsgBox('','I', '주파수 순번은 숫자만 입력 주십시오.', function(msgId, msgRst){});
    					return;
    				}

    				if( dsnMWDetailList[i].chnlCapaVal == undefined || dsnMWDetailList[i].chnlCapaVal.trim().length == 0) {
    					callMsgBox('','I', '주파수 용량을 입력해 주십시오.', function(msgId, msgRst){});
    					return;
    				}

    				if(isNaN(Number(dsnMWDetailList[i].chnlCapaVal))) {
    					callMsgBox('','I', '주파수 용량은 숫자만 입력 주십시오.', function(msgId, msgRst){});
    					return;
    				}
    			}
    		}

    		callMsgBox('saveConfirm','C', '저장 하시겠습니까?', function(msgId, msgRst){
				if ('saveConfirm' == msgId && 'Y' == msgRst) {
					save();
				}
    		});
    	});

    	$("#mtsoCnclBtn").on("click", function(e) {
    		window.close();
    	});
	}

	// 주파수 정보 조회
	function getFreqList(param, page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		$('#'+gridId2).alopexGrid('dataEmpty');
		$('#'+gridId2).alopexGrid('showProgress');

		param =  $("#dsnMwForm").serialize();

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/netmenu/getFreqList',
			data:param,
			method:'GET',
			async:true
			}).done(
			function(response) {

				let serverPageinfo = {};

	    		$('#'+gridId2).alopexGrid('hideProgress');
	    		serverPageinfo = {
	    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
	    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
	    		};

	    		$('#'+gridId2).alopexGrid('dataSet', response.freqList, serverPageinfo);

	    		window.opener.location.reload();

			}.bind(this)
		);
	}

    function save() {
    	let flag = $('#flag').val();

    	let param = {};
    	let dsnMWMaster = {};
    	let dsnMWDetailList = {};

    	$('#'+gridId2).alopexGrid('endEdit'); // 편집종료

    	//추가/수정(중) 인 데이터
    	let updateData = AlopexGrid.trimData($('#'+gridId2).alopexGrid('dataGet', {_state: {edited:true}}, {_state:{editing:true}}, {_state: {added:true}}, {_state: {editing:true}}[0]));
		dsnMWDetailList = updateData;
		param.dsnMWDetailList = dsnMWDetailList;

    	$("#dsnMwForm").find('input, select, textarea').each(function() {
    		let name = $(this).attr('name');
    		if(name) {
    			dsnMWMaster[name] = $(this).val();
    			param[name] = $(this).val();
    		}
    	});
    	dsnMWMaster.comNetDivVal = $("#comNetDivVal:checked").val();
    	param.comNetDivVal =  $("#comNetDivVal:checked").val();

    	param.flag = flag;
    	param.dsnMWMaster = dsnMWMaster;

    	if(dsnMWDetailDelList.length != 0) {
    		param.dsnMWDetailDelList = dsnMWDetailDelList;
    	}

    	Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/netmenu/saveMWBaseFreqList',
			data: param,
			method:'POST',
			async:false
			}).done(
			function(response) {
				$('#'+gridId2).alopexGrid('hideProgress');

				if(response.code === "ok") {
					if(flag != "D") {
						mwSctnIdFlagC = response.mwSctnId;
						getMWMasterDetailData(JSON.parse(sessionStorage.getItem('param')) ,1 , perPage);
					}

					if(flag == "C") {
						callMsgBox('saveSuccess','I', '저장되었습니다', function(msgId, msgRst){
							if ('saveSuccess' == msgId && 'Y' == msgRst) {
								window.close();
							}
			    		});
					} else if(flag == "U") {
						callMsgBox('changeSuccess','I', '수정되었습니다', function(msgId, msgRst){
							if ('changeSuccess' == msgId && 'Y' == msgRst) {
								window.close();
							}
			    		});
					} else if(flag == "D") {
						if(param.mwSctnId == 'MW***********') {
							callMsgBox('delFail','I', '삭제할 정보가 없습니다.', function(msgId, msgRst){
//								if ('delFail' == msgId && 'Y' == msgRst) {
//									window.close();
//								}
				    		});
						} else {
							callMsgBox('delSuccess','I', '삭제되었습니다', function(msgId, msgRst){
								if ('delSuccess' == msgId && 'Y' == msgRst) {
									window.close();
								}
				    		});
						}
					}
//					$('#flag').val("U");

				} else {
					callMsgBox('','I', '실패 하였습니다.', function(msgId, msgRst){});
				}
			}).fail(function(response){
				callMsgBox('','I', '실패 하였습니다.', function(msgId, msgRst){});
			});
    }

    //선택된 주파수 정보 삭제
//    function delFreqGridList(gridData) {
//    	let param = {};
//    	let dsnMWMaster = {};
//
//    	$("#dsnMwForm").find('input, select, textarea').each(function() {
//    		let name = $(this).attr('name');
//    		if(name) {
//    			param[name] = $(this).val();
//    		}
//    	});
//
//    	param.dsnMWDetailList = gridData;
//    	Util.jsonAjax({
//			url: '/transmisson/tes/engineeringmap/netmenu/deleteFreqList',
//			data: param ,
//			method:'POST',
//			async:false
//			}).done(
//			function(response) {
//
//				$('#'+gridId2).alopexGrid('hideProgress');
//
//				if(response.code === "ok") {
//					alert("삭제되었습니다.");
//				}
//			}.bind(this)
//		);
//    }

	function setGridRowDel(){
		$('#'+gridId2).alopexGrid('endEdit');

		let checkedData = $('#'+gridId2).alopexGrid('dataGet', {_state: {selected:true}});
		let delRowDataList = [];
		if (checkedData.length == 0) {
			callMsgBox('','I', '삭제할 데이터를 선택해주세요.', function(msgId, msgRst){});
			return;
		}

		for(var i=0; i < checkedData.length; i++){
			if(checkedData[i].flag == 'ADD') {
				$('#'+gridId2).alopexGrid('dataDelete', { _index : { data : checkedData[i]._index.row } });
			} else {
				$('#'+gridId2).alopexGrid('cellEdit','DEL',{ _index : { data : checkedData[i]._index.row } },'flag');
				delRowDataList.push($('#'+gridId2).alopexGrid('dataGet', {'flag' : 'DEL', _index : { data : checkedData[i]._index.row }}));
				$('#'+gridId2).alopexGrid("dataDelete", { _index : { data : checkedData[i]._index.row } });
//				delFreqGridList(checkedData);
			}
		}

		for(var i=0; i < delRowDataList.length; i++){
			dsnMWDetailDelList[i] = delRowDataList[i][0];
		}

    }

//	function getGridMaxSequence(gridId) {
//		let maxSeq = 0;
//		let data = $("#"+gridId).alopexGrid('dataGet');
//		if(data) {
//			maxSeq = Math.max(...data.map(item => parseInt(item.mwChnlNoVal, 10)));
//		} else {
//			maxSeq = 0;
//		}
//
//		if(maxSeq == "-Infinity" || maxSeq == "NaN" ) {
//			maxSeq = 0;
//		}
//
//		return maxSeq;
//	}

 // grid add Row
    function setGridAddRow() {
		var option 		= {_index:{data : 0}};
		var initRowData	= [];

		 initRowData = [{
			"flag" 				: "ADD",
			"mwSctnId"			: $("#mwSctnId").val(),
			"mwChnlNoVal"       : "",
			"mwFreqVal"         : "",
			"odrUnitTypVal"     : "",
			"mwModulMeansVal"   : "",
			"mwBdwhVal"         : "",
			"chnlCapaVal"       : "",
			"protMeansVal"      : ""
		 	}];

		// 행추가 및 추가행 선택
		$('#'+gridId2).alopexGrid('dataAdd', initRowData, option);
//		$('#'+gridId2).alopexGrid('cellEdit', 'MOD', {_index:{row:row}}, 'flag');
		$('#'+gridId2).alopexGrid('rowSelect', option, true);
    }

});