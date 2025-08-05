/**
 * MuntEqpMgmt.js
 *
 * @author Administrator
 * @date 2017. 10. 10.
 * @version 1.0
 */

var lv1_data = [];
var lv2_data = [];
var test = 1;

var main = $a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
        main.setGrid(1,15);
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 600,
        	rowInlineEdit: true,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		paging : {
    			pagerSelect: [15,30,60,100]
        		,hidePageList: false  // pager 중앙 삭제
    		},
        	defaultState: {
        		dataAdd: {editing: true}
        	},
    		defaultColumnMapping:{
    			sorting : true
    		},
    		rowSelectOption: {
    			singleSelect: false
    		},
    		rowOption: {
    			styleclass : function(data, rowOption){
    				if (data._state.added) return 'row-add';
					if (data._state.edited) return 'row-edit';
	    		}
    		},
            renderMapping : {
    			"addGridBtn" : {
    				renderer : function(value, data, render, mapping) {
    				    return '<div style="width:100%"><span class="Valign-md"></span><button type="button" id="addGridBtn" class="Button button2 add_btn Valign-md"></button></div>';
    	            }
    			}
    		},
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '30px',
				numberingColumn: true
    		}, {
				align:'center',
				key : 'check',
				width: '25px',
				selectorColumn: true
    		}, {
				align:'center',
				title : 'Add',
				key : 'Add',
				width: '30px',
				render : {type : 'addGridBtn'}
    		}, {
				align:'center',
				title : 'flag',
				key : 'flag',
				width: '30px',
				render : function(value, data, mapping) {
					var val = '';
					if (data._state.added) val += 'A';
					if (data._state.edited) val += 'E';
					if (data._state.deleted) val += 'D';
					return val;
				},
				editable: false
    		}, {/* 실장 아이디 */
    			align:'center',
				key : 'rackInId',
				title : '실장 아이디',
				width: '200px'
			}, {/* status */
    			align:'center',
				key : 'status',
				title : 'status',
				width: '20px'
			}, {/* 대분류 */
    			align:'center',
				key : 'lv1',
				title : '대분류',
				width: '60px',
				render: {
					type : 'string',
					rule : function(value, data) {
						return lv1_data;
					}
			   },
				editable: {
					type:'select',
					rule: function(value, data) {
						return lv1_data;
					},
					attr: {style: 'width: 90px; min-width: 90px;'}
				},
				editedValue: function (cell, data, render, mapping, grid) {
					return  $(cell).find('select option').filter(':selected').val();
				}
			}, {/* 중분류 */
    			align:'center',
				key : 'lv2',
				title : '중분류',
				width: '60px',
				render: {
					type : 'string',
					rule : function(value, data, render, mapping) {
						var render_data = [];
						var currentData = null;
						if (data._state.added) {
							// grid가 추가 모드일시 ajax 호출후 데이터 매핑
							currentData = AlopexGrid.currentData(data);
							if(currentData.lv1 != undefined && currentData.lv1.length > 1) {
								renderFunc(currentData.lv1);
							}
							return lv2_data;
						} else if (data._state.edited) {
							// grid가 편집 모드일시 ajax 호출후 데이터 매핑
							currentData = AlopexGrid.currentData(data);
							if(currentData.lv1 != undefined && currentData.lv1.length > 1) {
								renderFunc(currentData.lv1);
							}
							return lv2_data;
						} else {
							// grid가 편집모드가 아닐시 기본 데이터로 매핑
							render_data = render_data.concat({value: data.lv2, text: data.lv2Nm});
							return render_data;
						};
					}
			   },
				editable: {
					type:'select',
					rule: function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						if(currentData.lv1 != undefined && currentData.lv1.length > 1) {
							renderFunc(currentData.lv1);
						};
						return lv2_data;
					},
					attr: {style: 'width: 90px; min-width: 90px;'}
				},
				editedValue: function (cell, data, render, mapping, grid) {
					return  $(cell).find('select option').filter(':selected').val();
				},
				refreshBy: 'lv1'
			}, {/* 가로(mm) */
    			align:'center',
				key : 'width',
				title : '가로(mm)',
				width: '60px',
				editable: true
			}, {/* 세로(mm) */
    			align:'center',
				key : 'length',
				title : '세로(mm)',
				width: '60px',
				editable: true
			}, {/* 높이(mm) */
    			align:'center',
				key : 'height',
				title : '높이(mm)',
				width: '60px',
				editable: true
			}, {/* UNIT SIZE */
    			align:'center',
				key : 'unitSize',
				title : 'UNIT SIZE',
				width: '60px',
				editable: true
			}, {/* 제조사 */
    			align:'center',
				key : 'vendor',
				title : '제조사',
				width: '60px',
				editable: true
			}, {/* 모델명 */
    			align:'center',
				key : 'modelNm',
				title : '모델명',
				width: '100px',
				editable: true
			}, {/* 등록자 */
    			align:'center',
				key : 'regId',
				title : '등록자',
				width: '60px'
			}, {/* 등록일 */
    			align:'center',
				key : 'regDt',
				title : '등록일',
				width: '60px'
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['status', 'flag'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    //grid 렌더링 문제로 동기화 Ajax 호출
    function renderFunc(currentData) {
    	var lv2 = {supCd : currentData};
   		httpRequestAsync('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', lv2, 'GET', 'lv2');
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	// 대분류 콤보리스트
    	var searchLv1 = {supCd : 'M20000'};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchLv1, 'GET', 'searchLv1');
    	// 중분류 콤보리스트
    	var searchLv2 = {supCd : 'N'};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', searchLv2, 'GET', 'searchLv2');
    };

    function setEventListener() {
    	var perPage = 15;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid(1, perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1, perPage);
       		}
     	 });

    	// 중분류
    	$('#searchLv1').on('change', function(e) {
    		var searchLv1 = $('#searchLv1').val();
    		var searchLv2 = {supCd : searchLv1}
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', searchLv2, 'GET', 'searchLv2');
    	});

    	// addGridBtn 선택했을시
    	$('#'+gridId).on('click', '#addGridBtn', function(e){
    		var dataObj = null;
	 	 	dataObj = AlopexGrid.currentData(AlopexGrid.parseEvent(e).data);
	 	 	$("#"+gridId).alopexGrid('dataCopy', {_index: {row: dataObj._index.data}}, {cloneColumn: ['lv1', 'lv2', 'width', 'length', 'height', 'unitSize', 'vendor', 'modelNm']});
		});

    	// 추가 버튼 addBtn
        $('#addBtn').on('click', function(e){
        	var addRowNum = $('#dataGrid').alopexGrid('dataGet').length
    		var emptyData = {};
    		$("#"+gridId).alopexGrid('dataAdd', emptyData, {_index: {row:addRowNum}});
    		$('#'+gridId).alopexGrid('startEdit', {_index: {data: addRowNum}});
    		$('#'+gridId).alopexGrid("focusCell", {_index : {data : addRowNum}});
    		//이전 데이터 편집모드 종료
    		$('#'+gridId).alopexGrid('endEdit', {_index: {data: addRowNum-1}});
        });

        //삭제
        $('#delBtn').on('click', function(e){
        	var delParam = $('#'+gridId).alopexGrid('dataGet', { _state : { selected: true }});

        	if(delParam.length > 0) {
        		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
        			if (msgRst == 'Y') {
        				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteMuntEqpMgmt', delParam, 'POST', 'delParam');
        			}
        		});
        	} else {
        		callMsgBox('','I', '선택하신 실장장비 목록이 없습니다.', function(msgId, msgRst){});
        	}
        });

        //등록
        $('#regBtn').on('click', function(e){
        	var arr = new Array();
        	$('#'+gridId).alopexGrid('endEdit');
        	var regParam = $('#'+gridId).alopexGrid('dataGet', { _state : { added : true }}, {_state: { added : false, edited: true }} );

        	for(var i in regParam) {
        		console.log(i);

        		if(regParam[i]._state.added) {
        			if(regParam[i].lv1 != '' && regParam[i].lv2 != '') {
        				regParam[i].status = 'I';
        				arr.push(regParam[i]);
        			}
        		}

        		if(regParam[i]._state.edited && !regParam[i]._state.added) {
        			regParam[i].status = 'U';
        			arr.push(regParam[i]);
        		}
        	}

        	if(arr.length > 0) {
        		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
        			//저장한다고 하였을 경우
     		        if (msgRst == 'Y') {
     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveMuntEqpMgmt', arr, 'POST', 'regParam');
     		        }
        		});
        	} else {
        		callMsgBox('','I', '변경하신 실장장비 목록이 없습니다.', function(msgId, msgRst){});
        	}
        });

        // 그리드 취소 canBtn
        $('#canBtn').on('click', function(e){
        	$('#'+gridId).alopexGrid('endEdit');
        	$('#'+gridId).alopexGrid('dataRestore');
        	$('#'+gridId).alopexGrid('dataDelete', {_state: {added: true}});
        });

    	//엑셀다운
		$('#btnExportExcel').on('click', function(e){
			//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		param.searchLv1 = $("#searchLv1").val();
    		param.searchLv2 = $("#searchLv2").val();

    		param = gridExcelColumn(param, gridId);


    		param.pageNo = 1;
    		param.rowPerPage = 10;
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;


    		param.fileName = '실장장비관리_';
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "getMuntEqpMgmtList";

    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/muntEqpMgmtExcelcreate', param, 'GET', 'excelDownload');
		});
	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){
		// 대분류 리스트
		if(flag == 'searchLv1'){
			var option_data = [{cd: '', cdNm: '전체'}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				lv1_data.push({value: response[i].cd, text: response[i].cdNm});
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		// 중분류 리스트
		if(flag == 'searchLv2'){
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		// grid 중분류 리스트
		if(flag == 'lv2'){
			lv2_data = JSON.parse(JSON.stringify(response).split('"cd":').join('"value":').split('"cdNm":').join('"text":'));
		}

		// 사급/지입여부
		if(flag == 'searchCostType'){
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

	 	// 실장장비관리 조회
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.muntEqpMgmtList);
    	}

    	// 실장장비관리 삭제
    	if(flag == 'delParam'){
    		if(response.Result == "Success"){
    			var pageNo = $("#pageNo").val();
	    		var rowPerPage = $("#rowPerPage").val();
    			main.setGrid(pageNo, rowPerPage);
    		}
    	}

    	// 실장장비관리 등록
    	if(flag == 'regParam'){
    		if(response.Result == "Success"){
    			var pageNo = $("#pageNo").val();
	    		var rowPerPage = $("#rowPerPage").val();
    			main.setGrid(pageNo, rowPerPage);
    		}
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
            // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();
        }
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    this.setGrid = function(page, rowPerPage){
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

 		 var param =  $("#searchForm").serialize();

 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMuntEqpMgmtList', param, 'GET', 'search');
    }

    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
        		popid: pidData,
              	title: titleData,
              	url: urlData,
              	data: paramData,
				iframe: false,
				modal: true,
				movable:true,
				width : 800,
				height : window.innerHeight * 0.55
              });
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

    var httpRequestAsync = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag,
    		async : false,
    	}).done(successCallback)
    	.fail(failCallback);
    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

});