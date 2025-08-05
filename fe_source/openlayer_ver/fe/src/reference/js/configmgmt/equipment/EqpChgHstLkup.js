/**
 * EqpChgHstLkup.js
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
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };

    function setRegDataSet(data) {

    	$('#contentArea').setData(data);
    }

  //Grid 초기화
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
				/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {/* 국사명		 */
				key : 'eqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 장비명         	 */
				key : 'eqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '200px'
			},{/* 바코드번호		 */
				key : 'barNo', align:'center',
				title : configMsgArray['barcodeNumber'],
				width: '120px'
			}, {/* 장비IP주소    	 */
				key : 'mainEqpIpAddr', align:'center',
				title : configMsgArray['equipmentInternetProtocolAddress'],
				width: '120px'
			}, {/* 상태코드--숨김코드          */
				key : 'eqpStatCd', align:'center',
				title : configMsgArray['statusCode'],
				width: '120px'
			}, {/* 상태               */
				key : 'eqpStatNm', align:'center',
				title : configMsgArray['status'],
				width: '120px'
			}, {/* 장비용도     	 */ //라종식
				key : 'tnEqpUsgNm', align:'center',
				title : '장비용도',
				width: '100px'
			}, {/* 역할코드--숨김데이터	 */
				key : 'eqpRoleDivCd', align:'center',
				title : configMsgArray['roleCode'],
				width: '120px'
			}, {/* 포트수 		 */
				key : 'portCnt', align:'center',
				title : configMsgArray['portCount'],
				width: '120px'
			},{/* 관리팀		 */
				key : 'jrdtTeamOrgNm', align:'center',
				title : configMsgArray['managementTeam'],
				width: '100px'
			},{/* 운용팀		 */
				key : 'opTeamOrgNm', align:'center',
				title : '운용팀',
				width: '100px'
			},{/* 장비TID    	 */
				key : 'eqpTid', align:'center',
				title : configMsgArray['equipmentTargetId'],
				width: '200px'
			},{/* 호스트명      	 */
				key : 'eqpHostNm', align:'center',
				title : configMsgArray['hostName'],
				width: '200px'
			},{/* 장애관리여부     	 */
				key : 'dablMgmtYn', align:'center',
				title : configMsgArray['disabilityManagementYesOrNo'],
				width: '120px'
			},{/* 공사코드		 */
				key : 'cstrMgno', align:'center',
				title : configMsgArray['constructionCode'],
				width: '120px'
			},{/* 작업지시번호   	 */
				key : 'wkrtNo', align:'center',
				title : configMsgArray['workDirectionNumber'],
				width: '120px'
			},{/* 장비펌웨어버전값 	 */
				key : 'eqpFwVerVal', align:'center',
				title : configMsgArray['equipmentFirmwareVersionValue'],
				width: '120px'
			},{/* 소프트웨어버전값	 */
				key : 'swVerVal', align:'center',
				title : configMsgArray['softwareVersionValue'],
				width: '120px'
			}, {/* 최종장애수집일시 		 */
				key : 'lastDablClctDtm', align:'center',
				title : '최종장애수집일시',
				width: '120px'
			},{/* 비고			 */
				key : 'eqpRmk', align:'center',
				title : configMsgArray['remark'],
				width: '120px'
			},{/* 장비한글명 		 */ //라종식
				key : 'eqpHanNm', align:'center',
				title : '장비한글명',//configMsgArray[''],
				width: '180px'
			},{/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '120px'
			},{/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '120px'
			},{/* 변경일자		 */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '120px'
			},{/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '120px'
			}],
			message: {/* 데이터가 없습니다. */
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
    		 /* 장비변경이력 */
    		 param.fileName = configMsgArray['equipment']+configMsgArray['changeHistory'];
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getEqpChgHstLkupList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/excelcreate', param, 'GET', 'excelDownload');
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

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

		return param;
	}

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.eqpChgHstLkup);
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

    	var hideColList = ['lcl', 'mcl', 'scl', 'eqpStatCd', 'eqpRoleDivCd', 'tmof'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {

		$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpChgHstLkup', param, 'GET', 'search');
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