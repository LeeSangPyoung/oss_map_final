/**
 * UpsdItemMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var lv1_data = [];
var lv2_data = [];
var layerData = [];
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var fileOnDemendName = "";
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();
    	initGrid();
        setEventListener();
        main.setGrid(1,15);
    };

	//Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [5, 8, 10, 15, 20]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	rowInlineEdit: true,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping: {
    			editable: true,
    			defaultValue: ""
    		},
    		rowOption: {
    			styleclass : function(data, rowOption){
    				if(data._state.edited){
    					return 'row-highlight'
    				}
	    		}
    		},
    		columnMapping: [{
				align:'center',
				width: '20px',
				numberingColumn: true
    		}, {
				key : 'layerId', align:'center',
				title : '레이어',
				width: '70px',
				render: {
					type : 'string',
					rule : function(value, data) {
						return layerData;
					}
			   },
				editable: {
					type:'select',
					rule: function(value, data) {
						return layerData;
					},
					attr: {style: 'width: 90px; min-width: 90px;'}
				},
			}, {
				key : 'lv1', align : 'center',
				title : '대분류',
				width : '60px',
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
			},{
				key : 'lv2', align : 'center',
				title : '중분류',
				width : '60px',
				render: {
					type : 'string',
					rule : function(value, data) {
						var render_data = [];
						var currentData = null;
						if (data._state.edited) {
							// grid가 편집 모드일시 ajax 호출후 데이터 매핑
							currentData = AlopexGrid.currentData(data);
							render(currentData.lv1);
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
					rule: function(value, data) {
						var currentData = AlopexGrid.currentData(data);
						render(currentData.lv1);
						return lv2_data;
				},
					attr: {style: 'width: 90px; min-width: 90px;'}
				},
				editedValue: function (cell, data, render, mapping, grid) {
					return  $(cell).find('select option').filter(':selected').val();
				},
				refreshBy: 'lv1'
			}, {
				key : 'lv3', align : 'center',
				title : '소분류',
				width : '90px'
			}, {
				key : 'label', align : 'center',
				title : '라벨',
				width : '80px'
			}, {
				key : 'width', align : 'right',
				title : '가로(mm)',
				width : '50px'
			}, {
				key : 'length', align : 'right',
				title : '세로(mm)',
				width : '50px'
			}, {
				key : 'height', align : 'right',
				title : '높이(mm)',
				width : '50px'
			}, {
				key : 'unitSize', align : 'center',
				title : 'UNIT SIZE',
				width : '50px'
			}, {
				key : 'vendor', align : 'center',
				title : '제조사',
				width : '60px'
			}, {
				key : 'modelNm', align : 'center',
				title : '모델명',
				width : '60px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	// 레이어 리스트
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/layercode', '', 'GET', 'searchLayer');
    	// 대분류 콤보리스트
    	var lvl1data = {supCd : 'N'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv1CodeList', lvl1data, 'GET', 'searchLv1');
    	// 중분류 콤보리스트
    	var lvl2data = {supCd : 'N'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', lvl2data, 'GET', 'searchLv2');
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
    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });

    	//저장
         $('#btnSave').on('click', function(e) {
        	$('#'+gridId).alopexGrid('endEdit');
        	var param = $('#'+gridId).alopexGrid("dataGet", {_state : {edited : true }});
     		if (param.length == 0) {
     			//필수 선택 항목입니다.[ 지역본부 ]
     			callMsgBox('','I', '변경하신 아이템 목록이 없습니다.', function(msgId, msgRst){});
     			return;
     		}
     		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
  			    //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	ItemSave(param);
 		        }
 		     });
          });

         // 취소
         $('#btnCncl').on('click', function(e){
        	 callMsgBox('','C', '변경 사항을 취소하시겠습니까?', function(msgId, msgRst){
        		 if (msgRst == 'Y') {
        			 $('#'+gridId).alopexGrid('endEdit');
        			 $('#'+gridId).alopexGrid('dataRestore');
        		 }
        	 });
         });

     	// 중분류
     	$('#searchLv1').on('change', function(e) {
     		var searchLv1 = $('#searchLv1').val();
     		var lvl2data = {supCd : searchLv1}
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', lvl2data, 'GET', 'searchLv2');
     	});

/*     	// grid edit
    	$('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var lvl1data = {supCd : 'N'}
    		httpRequestAsync('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv1CodeList', lvl1data, 'GET', 'gridLv1');
    	});
*/
     	//엑셀 다운
     	$('#btnExportExcel').on('click', function(e){
			//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		param.searchLayer = $("#searchLayer").val();
    		param.searchLv1 = $("#searchLv1").val();
    		param.searchLv2 = $("#searchLv2").val();

    		param = gridExcelColumn(param, gridId);

    		param.pageNo = 1;
    		param.rowPerPage = 10;
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;


    		param.fileName = '아이템관리';
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "getItemList";

    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/itemExcelcreate', param, 'GET', 'excelDownload');
		});
	};

	function ItemSave(param){
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateItemList', param, 'POST', 'itemSave');
	}



	/*------------------------*
	 * 엑셀 다운로드
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
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});

	   	}

    	//용도구분
    	if(flag == 'searchGubun'){
			var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
    	}
    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId,response, response.itemList);
    	}

    	// 레이어 리스트
		if(flag == 'searchLayer'){
			var option_data = [{cd: '', cdNm: '전체'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    			layerData.push({value: response[i].cd, text: response[i].cdNm});
    		}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
	   	}

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


		//그리드 중분류 리스트
		if(flag == 'gridLv2'){
			lv2_data= [];
			for(var i=0; i<response.length; i++){
			lv2_data.push({value: response[i].cd, text: response[i].cdNm})
			}
		}

		//아이템 저장
		if(flag == 'itemSave'){
    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           $a.close();
	    		       }
	    		});
    		}
    		var pageNo = $("#pageNo").val();
    		var rowPerPage = $("#rowPerPage").val();
    		main.setGrid(pageNo,rowPerPage);
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

    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

 		 var param =  $("#searchForm").serialize();

 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getItemList', param, 'GET', 'search');
    }

    function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                }
            });
	}

    //grid 렌더링 문제로 동기화 Ajax 호출
    function render(currentData) {
    	var data = {supCd : currentData};
    	httpRequestAsync('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv2CodeList', data, 'GET', 'gridLv2');
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