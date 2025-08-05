/**
 * SmtsoRackInMgmt.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var main = $a.page(function() {

	var treeId = 'treeGrid';
	var gridId = 'dataGrid';

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
        	height: 578,
    		pager : false,
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
        $('#'+gridId).alopexGrid({
        	height: 578,
        	paging : {
        		pagerSelect: [15,30,60,100]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
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

        gridHide();

    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['modelId', 'status', 'csType'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	// 본부
    	var supCd = {supCd : '007000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', supCd, 'GET', 'searchOrgL1');
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
    		 $('#'+gridId).alopexGrid('dataEmpty');
    		 $('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
    		 main.setTreeGrid();
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			$('#'+gridId).alopexGrid('dataEmpty');
     			$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
     			main.setTreeGrid();
       		}
     	 });

         //트리 그리드에서 선택후 Rack 그리드 호출
         $('#'+treeId).on('click', '.bodycell', function(e){
    		var dataObj = null;
    		dataObj = AlopexGrid.parseEvent(e).data;

    		main.setGrid(1, perPage, dataObj.level, dataObj.id);
         });

         // 국소별 실장관리 상세 팝업 리스트
         $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 $a.popup({
				  	title: '국소별 실장관리 상세',
				    url: $('#ctx').val()+'/configmgmt/upsdmgmt/SmtsoRackInMgmtDetail.do',
				    data: dataObj,
				    iframe: false,
				    modal: false,
				    windowpopup: true,
				    movable:true,
				    width : window.innerWidth * 0.9,
	    			height : window.innerHeight * 0.8,
	    			//other: 'top=0,left:100,scrollbars=yes, location=no,',
    		 });
    	 });

         //엑셀 업로드
         $('#execlImportBtn').on('click', function(e){
     		var dataObj = null;
     		dataObj = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}})[0];
     		if(dataObj != '' && dataObj != null && dataObj != undefined) {
     			popup('SmtsoRackInMgmtRegPop', $('#ctx').val()+'/configmgmt/upsdmgmt/SmtsoRackInMgmtRegPop.do', '국소별 실장관리 엑셀 업로드', dataObj);
     		} else {
     			callMsgBox('','I', '실장장비를 업로드 할 RACK 장비를 선택해 주세요.' , function(msgId, msgRst){});
     		}
          });

       //엑셀다운
 		$('#btnExportExcel').on('click', function(e){
 			//tango transmission biz 모듈을 호출하여야한다.

     		var param =  $("#rackInGridForm").getData();

     		param = gridExcelColumn(param, gridId);
     		param.pageNo = 1;
     		param.rowPerPage = 10;
     		param.firstRowIndex = 1;
     		param.lastRowIndex = 1000000000;


     		param.fileName = '국소별실장관리';
     		param.fileExtension = "xlsx";
     		param.excelPageDown = "N";
     		param.excelUpload = "N";
     		param.method = "getSmtsoRackInMgmtList";

     		$('#'+gridId).alopexGrid('showProgress');
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/smtsoRackInMgmtExcelcreate', param, 'GET', 'excelDownload');
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
    		$('#'+treeId).alopexGrid('dataSet', response.smtsoRackInMgmtTreeList);
    	}

    	// Rack 조회
    	if(flag == 'rackIn'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.smtsoRackInMgmtList);
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

    // 트리 그리드 호출
    this.setTreeGrid = function(){
    	var param = null;
    	if($('#searchOrgL1').val() == '' || $('#searchOrgL1').val() == null) {
    		param =  $("#searchForm").serialize() + '&searchOrgL1=007000';
    	} else {
    		param =  $("#searchForm").serialize();
    	}

 		$('#'+treeId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoRackInMgmtTreeList', param, 'GET', 'search');
    }

    // Rack 장비 그리드 호출
    this.setGrid = function(page, rowPerPage, searchLevel, searchCd){
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	$('#searchLevel').val(searchLevel);
    	$('#searchCd').val(searchCd);

    	var param =  $("#rackInGridForm").serialize();

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoRackInMgmtList', param, 'GET', 'rackIn');
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
				height : window.innerHeight * 0.61
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

    function setSPGrid(GridID,Option,Data) {
    	$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
    }

});