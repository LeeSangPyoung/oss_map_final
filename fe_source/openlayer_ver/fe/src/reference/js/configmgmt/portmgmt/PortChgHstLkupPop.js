/**
 * PortChgHstLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };

    function setRegDataSet(data) {

    	$('#contentArea').setData(data);
    }

    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
			},{
				key : 'chgDate', align:'center',
				title : '변경일자',
				width: '100px'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '100px'
			}, {
				key : 'eqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '100px'
			}, {
				key : 'eqpInstlMtsoNm', align:'center',
				title : '국사',
				width: '100px'
			}, {
				key : 'eqpMdlId', align:'center',
				title : '모델ID',
				width: '100px'
			},{
				key : 'eqpMdlNm', align:'center',
				title : '모델',
				width: '100px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '100px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '100px'
			}, {
				key : 'portIdxNo', align:'center',
				title : '포트Index',
				width: '100px'
			}, {
				key : 'portId', align:'center',
				title : '포트ID',
				width: '100px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '100px'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트IP',
				width: '100px'
			}, {
				key : 'portTypCd', align:'center',
				title : '포트유형코드',
				width: '100px'
			}, {
				key : 'portTypNm', align:'center',
				title : '포트유형',
				width: '100px'
			}, {
				key : 'portStatCd', align:'center',
				title : '포트상태코드',
				width: '100px'
			}, {
				key : 'portStatNm', align:'center',
				title : '포트상태',
				width: '100px'
			},{
				key : 'portCapaCd', align:'center',
				title : '포트용량코드',
				width: '100px'
			},{
				key : 'portCapaNm', align:'center',
				title : '포트용량',
				width: '100px'
			},{//숨김 데이터
				key : 'lgcPortYn', align:'center',
				title : '논리포트여부',
				width: '100px'
			},{
				key : 'srsPortYn', align:'center',
				title : '중요포트여부',
				width: '100px'
			},{
				key : 'autoMgmtYn', align:'center',
				title : '자동관리여부',
				width: '100px'
			},{
				key : 'upLinkPortYn', align:'center',
				title : 'UP링크포트여부',
				width: '100px'
			},{
				key : 'dplxgMeansDivCd', align:'center',
				title : '이중화방식',
				width: '100px'
			},{
				key : 'dplxgPortYn', align:'center',
				title : '이중화여부',
				width: '100px'
			},{
				key : 'portMacNo', align:'center',
				title : '포트MAC',
				width: '100px'
			},{
				key : 'portGwIpAddr', align:'center',
				title : '포트게이트웨이',
				width: '100px'
			},{
				key : 'portSbntIpAddr', align:'center',
				title : '포트서브넷',
				width: '100px'
			},{
				key : 'portDesc', align:'center',
				title : '포트설명',
				width: '100px'
			},{
				key : 'portRmk', align:'center',
				title : '포트비고',
				width: '100px'
			},{
				key : 'edgYn', align:'center',
				title : '말단여부',
				width: '100px'
			},{
				key : 'frstRegDate', align:'center',
				title : '등록일',
				width: '100px'
			},{
				key : 'frstRegUserId', align:'center',
				title : '등록자',
				width: '100px'
			},{
				key : 'lastChgDate', align:'center',
				title : '변경일',
				width: '100px'
			},{
				key : 'lastChgUserId', align:'center',
				title : '변경자',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }


    function setEventListener() {

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(1, eObj.perPage);
         });

    	//엑셀다운
    	 $('#btnExportExcel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#searchForm").getData();

    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;

    		 param.fileName = "포트변경이력";
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getPortChgHstLkupList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

    	 $('#btnClose').on('click', function(e) {
 	     	//tango transmission biz 모듈을 호출하여야한다.
 			 $a.close();
 	     });

	};

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

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.portChgHstLkup);
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

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['eqpInstlMtsoId', 'eqpMdlId', 'eqpId', 'portId', 'portTypCd', 'portStatCd', 'portCapaCd'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {


    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

		 $('#'+gridId).alopexGrid('showProgress');

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portChgHstLkup', param, 'GET', 'search');
    }

    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/

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