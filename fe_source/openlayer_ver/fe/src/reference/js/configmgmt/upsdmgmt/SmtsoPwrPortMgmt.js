/**
 * SmtsoMatlMgmt.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var main = $a.page(function() {

	var treeId = 'treeGrid';
	var rackGridId = 'rackDataGrid';
	var portGridId = 'portDataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();

        main.setTreeGrid();
    };

  //Grid 초기화
    function initGrid() {

    	//Tree 그리드 생성
        $('#'+treeId).alopexGrid({
        	height: 670,
    		pager : false,
    		rowSelectOption: {
    			allowSingleUnselect: false
    		},
    		paging : {
    			pagerTotal: false,
        	},
        	columnMapping: [
        		{/* id */
    				key : 'id',
    				title : 'id',
    				hidden : true
    			}, {/* 국사명  */
    				align:'left',
    				key : 'name',
    				title : '국사명',
    				treeColumn : true,
    				treeColumnHeader : true
    			}, {/* parentid */
    				key : 'parentid',
    				title : 'parentid',
    				hidden : true
    			}, {/* expanded */
    				key : 'expanded',
    				title : 'expanded',
    				hidden : true
    			}, {/* lelvel */
    				key : 'level',
    				title : 'level',
    				hidden : true
    			}
        	],
        	tree : {
        		useTree : true,
        		idKey : 'id', // 노드를 지시하는 유일한 값이 저장된 키값
        		parentIdKey : 'parentid', // 자신의 상위(parent) 노드를 지시하는 ID가 저장된 키값
        		expandedKey : 'expanded' // 데이터가 그리드에 입력되는 시점에 초기 펼쳐짐 여부를 저장하고 있는 키값
        	}
        });

        //그리드 생성
        $('#'+rackGridId).alopexGrid({
        	height: 280,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowSelectOption: {
    			allowSingleUnselect: false
    		},
    		paging : {
    			//pagerSelect: [15,30,60,100],
    			hidePageList: false  // pager 중앙 삭제
    		},
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50',
				numberingColumn: true
    		}, {/* modelId */
    			align:'center',
				key : 'modelId',
				title : 'modelId',
				width: '20'
			}, {/* status */
    			align:'center',
				key : 'status',
				title : 'status',
				width: '20'
			}, {/* 소분류 */
    			align:'center',
				key : 'lv3',
				title : '소분류',
				width: '130'
			}, {/* 라벨명 */
    			align:'center',
				key : 'label',
				title : '라벨명',
				width: '150'
			}, {/* 가로(mm) */
    			align:'center',
				key : 'width',
				title : '가로(mm)',
				width: '70'
			}, {/* 세로(mm) */
    			align:'center',
				key : 'length',
				title : '세로(mm)',
				width: '70'
			}, {/* 높이(mm) */
    			align:'center',
				key : 'height',
				title : '높이(mm)',
				width: '70'
			}, {/* UNIT SIZE */
    			align:'center',
				key : 'unitSize',
				title : 'UNIT SIZE',
				width: '70'
			}, {/* 제조사 */
    			align:'center',
				key : 'vendor',
				title : '제조사',
				width: '70'
			}, {/* 모델명 */
    			align:'center',
				key : 'modelNm',
				title : '모델명',
				width: '70'
			}, {/* csType */
    			align:'center',
				key : 'csType',
				title : 'csType',
				width: '70'
			}, {/* 사급/지입여부 */
    			align:'center',
				key : 'csTypeNm',
				title : '사급/지입여부',
				width: '100'
			}, {/* 담당자 */
    			align:'center',
				key : 'manager',
				title : '담당자',
				width: '70'
			}, {/* 비고 */
    			align:'left',
				key : 'description',
				title : '비고',
				width: '150'
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        //그리드 생성
        $('#'+portGridId).alopexGrid({
        	height: 320,
        	//rowInlineEdit: true,
        	//endlnlineEditByOuterClick: true,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		paging : {
    			//pagerSelect: [15,30,60,100],
    			hidePageList: false  // pager 중앙 삭제
    		},
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50',
				numberingColumn: true
    		}, {/* modelId */
    			align:'center',
				key : 'modelId',
				title : 'modelId',
				width: '20'
			}, {/* status */
    			align:'center',
				key : 'status',
				title : 'status',
				width: '20'
			}, {/* 연결여부 */
    			align:'center',
				key : 'gubun',
				title : '연결여부',
				width: '90'
			}, {/* 연결된 장비 소분류 */
    			align:'center',
				key : 'inPortLv3',
				title : '연결된 장비 소분류',
				width: '150'
			}, {/* 연결된 장비 라벨명 */
    			align:'center',
				key : 'inPortNm',
				title : '연결된 장비 라벨명',
				width: '150'
			}, {/* 포트타입 */
    			align:'center',
				key : 'mainGubun',
				title : '포트타입',
				width: '100',
				editable: {
					type: 'select',
					rule: [{value: '', text: '선택'}, {value: 'MAIN', text: 'MAIN'}, {value: 'SUB', text: 'SUB'}],
					attr: {style: 'width: 80px; min-width: 80px; border-color: #ffa8a8; background-color: #fff3f3;'}
				},
				valid: function(value, data) {
					if(value == '') {
						callMsgBox('','W', makeArgConfigMsg('requiredOption', '포트타입') , function(msgId, msgRst){});
						return false;
					}
					return true;
				}
			}, {/* 포트방향 */
    			align:'center',
				key : 'type',
				title : '포트방향',
				width: '100',
				editable: {
					type: 'select',
					rule: [{value: '', text: '선택'}, {value: 'C', text: 'Center'}, {value: 'L', text: 'Left'}, {value: 'R', text: 'Right'}],
					attr: {style: 'width: 80px; min-width: 80px; border-color: #ffa8a8; background-color: #fff3f3;'}
				},
				valid: function(value, data) {
					if(value == '') {
						callMsgBox('','W', makeArgConfigMsg('requiredOption', '포트방향') , function(msgId, msgRst){});
						return false;
					}
					return true;
				}
			}, {/* 포트위치 */
    			align:'center',
				key : 'pos',
				title : '포트위치',
				width: '100',
				editable: {
					type: 'text',
					attr: {style: 'border-color: #ffa8a8; background-color: #fff3f3;'}
				},
				valid: function(value, data) {
					if(!/^[0-9]+$/.test(value)) {
						callMsgBox('','W', makeArgConfigMsg('requiredDecimal', '포트위치') , function(msgId, msgRst){});
						return false;
					}
					return true;
				}
			}, {/* 소분류 */
    			align:'center',
				key : 'lv3',
				title : '소분류',
				width: '130'
			}, {/* 라벨명 */
    			align:'center',
				key : 'label',
				title : '라벨명',
				width: '150'
			}, {/* 가로(mm) */
    			align:'center',
				key : 'width',
				title : '가로(mm)',
				width: '70'
			}, {/* 세로(mm) */
    			align:'center',
				key : 'length',
				title : '세로(mm)',
				width: '70'
			}, {/* 높이(mm) */
    			align:'center',
				key : 'height',
				title : '높이(mm)',
				width: '70'
			}, {/* UNIT SIZE */
    			align:'center',
				key : 'unitSize',
				title : 'UNIT SIZE',
				width: '70'
			}, {/* 제조사 */
    			align:'center',
				key : 'vendor',
				title : '제조사',
				width: '70'
			}, {/* 모델명 */
    			align:'center',
				key : 'modelNm',
				title : '모델명',
				width: '70'
			}, {/* csType */
    			align:'center',
				key : 'csType',
				title : 'csType',
				width: '70'
			}, {/* 사급/지입여부 */
    			align:'center',
				key : 'csTypeNm',
				title : '사급/지입여부',
				width: '100'
			}, {/* 담당자 */
    			align:'center',
				key : 'manager',
				title : '담당자',
				width: '70'
			}, {/* 비고 */
    			align:'left',
				key : 'description',
				title : '비고',
				width: '150'
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
    	var hideColList = ['modelId', 'status', 'csType'];
    	$('#'+rackGridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+portGridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	// 본부
    	var supCd = {supCd : '007000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', supCd, 'GET', 'searchOrgL1');
    };

    function setEventListener() {
    	var perPage = 10;

    	// 페이지 번호 클릭시
	   	 $('#'+rackGridId).on('pageSet', function(e){
	   		 var eObj = AlopexGrid.parseEvent(e);
	   		 main.setRackGrid(eObj.page, eObj.pageinfo.perPage);
	   	 });

	   	//페이지 selectbox를 변경했을 시.
        $('#'+rackGridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	main.setRackGrid(1, eObj.perPage);
        });

        // 페이지 번호 클릭시
        $('#'+portGridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	main.setPortGrid(eObj.page, eObj.pageinfo.perPage);
        });

        //페이지 selectbox를 변경했을 시.
        $('#'+portGridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	main.setPortGrid(1, eObj.perPage);
        });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 $('#'+rackGridId).alopexGrid('dataEmpty');
    		 $('#'+rackGridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
    		 main.setTreeGrid();
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			$('#'+rackGridId).alopexGrid('dataEmpty');
     			$('#'+rackGridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
     			main.setTreeGrid();
       		}
     	 });

         //트리 그리드에서 선택후 Rack 그리드 호출
         $('#'+treeId).on('click', '.bodycell', function(e){
    		var dataObj = null;
    		dataObj = AlopexGrid.parseEvent(e).data;

        	var treeGridData = $('#'+treeId).alopexGrid('dataGet', {_state: {selected:true}})[0];

        	$('#rackSearchLevel').val(treeGridData.level);
        	$('#rackSearchCd').val(treeGridData.id);

        	// 포트 그리드 초기화
        	$('#'+portGridId).alopexGrid('dataEmpty');
        	$('#'+portGridId).alopexGrid('updateOption', {paging : {hidePageList: true}});

    		main.setRackGrid(1, perPage);
         });

         //Rack 그리드에서 선택후 Port 그리드 호출
         $('#'+rackGridId).on('click', '.bodycell', function(e){
        	 var dataObj = null;
        	 dataObj = AlopexGrid.parseEvent(e).data;

         	var treeGridData = $('#'+treeId).alopexGrid('dataGet', {_state: {selected:true}})[0];

        	$('#portSearchLevel').val(treeGridData.level);
        	$('#portSearchCd').val(treeGridData.id);
        	$('#portSearchType').val(dataObj.itemType);

        	// 소분류가 분전반일 경우 [포트방향] 컬럼 보이거나 숨기기
        	var lv3 = dataObj.lv3;
        	if(lv3.indexOf('분전반') > -1) {
        		$('#'+portGridId).alopexGrid("showCol", 'type');
        		$('#'+portGridId).alopexGrid('updateColumn',
        				{editable:  {type: 'select',
        							rule: [{value: '', text: '선택'}, {value: 'C', text: 'Center'}, {value: 'L', text: 'Left'}, {value: 'R', text: 'Right'}],
        							attr: {style: 'width: 80px; min-width: 80px; border-color: #ffa8a8; background-color: #fff3f3;'}}},
        							['type']);
        	} else {
        		$('#'+portGridId).alopexGrid("hideCol", 'type', 'conceal');
        		$('#'+portGridId).alopexGrid('updateColumn', {editable: false}, ['type']);
        	}

        	 main.setPortGrid(1, perPage);
         });

         // 한번 클릭했을때 rowInlineEdit true 변환 (rowInlineEdit 기본 옵션체크하면 더블클릭이 중복되는걸 방지하는 프로세스)
         $('#'+portGridId).on('dataSelectEnd', function(e){
        	 e.stopPropagation();
        	 var dataObj = null;
        	 dataObj = AlopexGrid.parseEvent(e).datalist[0];
        	 if(dataObj.gubun == '비연결') {
        		 $('#'+portGridId).alopexGrid({rowInlineEdit: true});
        	 } else {
        		 $('#'+portGridId).alopexGrid({rowInlineEdit: false});
        	 }
         });

         // 더블 클릭후 편집모드로 변환후 연결부분은 alert
         $('#'+portGridId).on('dblclick', '.bodycell', function(e){
        	 var dataObj = null;
        	 dataObj = AlopexGrid.parseEvent(e).data;
        	 if(dataObj.gubun == '연결') {
        		 callMsgBox('','I', '해당 장비는 이미 포트가 연결 되어있습니다.', function(msgId, msgRst){});
        	 }
         });

         // 포트 그리드 수정한 데이터 저장 regBtn
         $('#regBtn').on('click', function(e){
        	 var param = $('#'+portGridId).alopexGrid("dataGet", {_state : {edited : true}});
        	 var rackGridData = $('#'+rackGridId).alopexGrid('dataGet', {_state: {selected:true}})[0];

        	 if(param.length > 0) {
        		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
   			        //저장한다고 하였을 경우
	  		        if (msgRst == 'Y') {
	  		        	// Rack 모델ID값 추가로 저장
	  		        	for(var i = 0; i<param.length; i++) {
	  		        		param[i].inId = rackGridData.modelId;
	  		        		param[i].outId = param[i].modelId;
	  		      		}

	  		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertSmtsoPwrPortMgmtPortRegistration', AlopexGrid.trimData(param), 'POST', 'portReg');
	  		        }
        		 });
        	 } else {
        		 callMsgBox('','I', '변경하신 전원포트관리 목록이 없습니다.', function(msgId, msgRst){});
        	 }
         });

         // 포트 그리드 취소 canBtn
         $('#canBtn').on('click', function(e){
			$('#'+portGridId).alopexGrid('updateOption', {
				defaultState: {}
			});

			var treeGridData = $('#'+treeId).alopexGrid('dataGet', {_state: {selected:true}})[0];
			var rackGridData = $('#'+rackGridId).alopexGrid('dataGet', {_state: {selected:true}})[0];

			$('#portSearchLevel').val(treeGridData.level);
			$('#portSearchCd').val(treeGridData.id);
			$('#portSearchType').val(rackGridData.itemType);

			// 소분류가 분전반일 경우 [포트방향] 컬럼 보이거나 숨기기
			var lv3 = rackGridData.lv3;
			if(lv3.indexOf('분전반') > -1) {
				$('#'+portGridId).alopexGrid("showCol", 'type');
        		$('#'+portGridId).alopexGrid('updateColumn',
        				{editable:  {type: 'select',
        							rule: [{value: '', text: '선택'}, {value: 'C', text: 'Center'}, {value: 'L', text: 'Left'}, {value: 'R', text: 'Right'}],
        							attr: {style: 'width: 80px; min-width: 80px; border-color: #ffa8a8; background-color: #fff3f3;'}}},
        							['type']);
			} else {
				$('#'+portGridId).alopexGrid("hideCol", 'type', 'conceal');
				$('#'+portGridId).alopexGrid('updateColumn', {editable: false}, ['type']);
			}

        	 main.setPortGrid(1, perPage);
         });

         // 포트 그리드 연결 끊기
         $('#delBtn').on('click', function(e){
        	 var dataObj = null;
        	 dataObj = $('#'+portGridId).alopexGrid('dataGet', {_state: {selected:true}})[0];

        	 if(dataObj != '' && dataObj != null && dataObj != undefined) {
        		 if(dataObj.gubun == '연결') {
        			 callMsgBox('','C', '연결된 포트를 끊으시겠습니까?', function(msgId, msgRst){
        				 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteSmtsoPwrPortMgmtPortDel', {outId : dataObj.modelId}, 'POST', 'portDel');
        			 });
        		 } else {
        			 callMsgBox('','I', '연결된 장비가 없습니다.', function(msgId, msgRst){});
        		 }
        	 } else {
        		 callMsgBox('','I', '선택하신 포트 정보가 없습니다.', function(msgId, msgRst){});
        	 }

         });

         //엑셀 업로드 TODO : ASIS가 개발이 안된 상태
         $('#execlImportBtn').on('click', function(e){
     		var dataObj = null;
     		dataObj = $('#'+rackGridId).alopexGrid('dataGet', {_state: {selected:true}})[0];
     		if(dataObj != '' && dataObj != null && dataObj != undefined) {
     			if(dataObj.itemType != 'ipd') {
     				//popup('SmtsoMatlMgmtRegPop', $('#ctx').val()+'/configmgmt/upsdmgmt/SmtsoMatlMgmtRegPop.do', '국소별 자재장비 엑셀 업로드', dataObj);
     			} else {
     				callMsgBox('','I', '분전반/정류기만 엑셀 업로드가 가능합니다.' , function(msgId, msgRst){});
     			}
     		} else {
     			callMsgBox('','I', configMsgArray['selectNoData'], function(msgId, msgRst){});
     		}
          });

       //엑셀다운
 		$('#btnExportExcel').on('click', function(e){
 			//tango transmission biz 모듈을 호출하여야한다.
     		var param = $("#portGridForm").getData();


     		param = gridExcelColumn(param, portGridId);
     		param.pageNo = 1;
     		param.rowPerPage = 10;
     		param.firstRowIndex = 1;
     		param.lastRowIndex = 1000000000;


     		param.fileName = '국소별전원포트관리_';
     		param.fileExtension = "xlsx";
     		param.excelPageDown = "N";
     		param.excelUpload = "N";
     		param.method = "getSmtsoPwrPortMgmtList";

     		$('#'+portGridId).alopexGrid('showProgress');
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/smtsoPwrPortMgmtExcelcreate', param, 'GET', 'excelDownload');
 		});
	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/
	function gridExcelColumn(param, rackGridId) {
		var gridColmnInfo = $('#'+portGridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+portGridId).alopexGrid("columnGet", {hidden:false});

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
		// 본부
		if(flag == 'searchOrgL1'){
			var option_data = [{cd: '007000', cdNm: '전체'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				searchOrgL1: ''
			});
	   	}

	 	// 국사 트리 조회
    	if(flag == 'search'){
    		$('#'+treeId).alopexGrid('hideProgress');
    		$('#'+treeId).alopexGrid('dataSet', response.smtsoPwrPortMgmtTreeList);
    	}

    	// Rack 조회
    	if(flag == 'rack'){
    		$('#'+rackGridId).alopexGrid('hideProgress');
    		setRackGridData(rackGridId, response, response.smtsoPwrPortMgmtRackList);
    	}

    	// Port 조회
    	if(flag == 'port'){
    		$('#'+portGridId).alopexGrid('hideProgress');
    		setPortGridData(portGridId, response, response.smtsoPwrPortMgmtPortList);
    	}

    	if(flag == 'portReg'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    			main.setPortGrid($('#portPageNo').val(), $('#portRowPerPage').val());
    		}
    	}

    	if(flag == 'portDel') {
    		if(response.Result == "Success"){
    			callMsgBox('','I', '연결된 포트를 끊었습니다.', function(msgId, msgRst){});
    			main.setPortGrid($('#portPageNo').val(), $('#portRowPerPage').val());
    		}
    	}

    	if(flag == 'excelDownload'){
    		$('#'+portGridId).alopexGrid('hideProgress');
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

    // 트리 그리드 호출
    this.setTreeGrid = function(){
    	var param = null;
    	if($('#searchOrgL1').val() == '' || $('#searchOrgL1').val() == null) {
    		param =  $("#searchForm").serialize() + '&searchOrgL1=007000';
    	} else {
    		param =  $("#searchForm").serialize();
    	}

 		$('#'+treeId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoPwrPortMgmtTreeList', param, 'GET', 'search');
    }

    // Rack 장비 그리드 호출
    this.setRackGrid = function(page, rowPerPage){
    	$('#rackPageNo').val(page);
    	$('#rackRowPerPage').val(rowPerPage);

    	var param =  $("#rackGridForm").serialize();

    	$('#'+rackGridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoPwrPortMgmtRackList', param, 'GET', 'rack');
    }

    function setRackGridData(GridID,Option,Data) {
    	$('#'+rackGridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+rackGridId).alopexGrid('dataSet', Data, serverPageinfo);
    }

    // Port 장비 그리드 호출
    this.setPortGrid = function(page, rowPerPage){
    	$('#portPageNo').val(page);
    	$('#portRowPerPage').val(rowPerPage);

    	var param =  $("#portGridForm").serialize();

    	$('#'+portGridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoPwrPortMgmtPortList', param, 'GET', 'port');
    }

    function setPortGridData(GridID,Option,Data) {
    	$('#'+portGridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+portGridId).alopexGrid('dataSet', Data, serverPageinfo);
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
				width : 700,
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

});