/**
 * PortMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var portPop = $a.page(function() {

	var gridId = 'dataGridPop';
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	$a.page.method = 'POST';

    	paramData = param;

    	initGrid();
        setEventListener();
        //setRegDataSet(param);
        setList(param);
//        setList(param);  // setList 주석 처리 및  setRegDataSet(), setGrid() 주석해제 [20171121]
        //setGrid(1,100);

        //선택한 장비에 해당하는 수동등록여부 조회[20171019]
	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');
    };

    function setRegDataSet(data) {

    	$('#contentAreaPop').setData(data);
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
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
    		}, {
				key : 'dumyPortYn', align:'center',
				title : 'DUMMY여부',
				width: '100px'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '130px'
			}, {
				key : 'eqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '70px'
			}, {
				key : 'eqpInstlMtsoNm', align:'center',
				title : '국사',
				width: '130px'
			}, {
				key : 'eqpMdlId', align:'center',
				title : '모델ID',
				width: '70px'
			},{
				key : 'eqpMdlNm', align:'center',
				title : '모델',
				width: '130px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '70px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '150px'
			}, {
				key : 'cardNm', align:'center',
				title : '카드명',
				width: '150px'
			}, {
				key : 'cardMdlNm', align:'center',
				title : '카드모델명',
				width: '150px'
			}, {
				key : 'portIdxNo', align:'center',
				title : '포트Index',
				width: '70px'
			}, {
				key : 'portId', align:'center',
				title : '포트ID',
				width: '70px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '130px'
			}, {
				key : 'portAlsNm', align:'center',
				title : '포트별칭명',
				width: '150px'
			}, {
				key : 'portOpStatNm', align:'center',
				title : '포트운용상태',
				width: '100px'
			}, {
                key : 'stndRackNo', align:'center',   // stndRackNo ... stndPortNo 추가 [20171121]
                title : 'RaNo',
                width: '28px'
            }, {
                key : 'stndShelfNo', align:'center',
                title : 'ShNo',
                width: '28px'
            }, {
                key : 'stndSlotNo', align:'center',
                title : 'SlNo',
                width: '28px'
            }, {
                key : 'stndSubSlotNo', align:'center',
                title : 'SuNo',
                width: '28px'
            }, {
                key : 'stndPortNo', align:'center',
                title : 'PoNo',
                width: '28px'
            }, {
				key : 'crsLnkgYn', align:'center',
				title : 'CRS연동여부',
				width: '100px'
			}, {
				key : 'crsPathNm', align:'center',
				title : 'CRS경로명',
				width: '150px'
			}, {
				key : 'crsChgDate', align:'center',
				title : 'CRS변경일자',
				width: '100px'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트IP',
				width: '120px'
			}, {
				key : 'portTypCd', align:'center',
				title : '포트유형코드',
				width: '70px'
			}, {
				key : 'portTypNm', align:'center',
				title : '포트유형',
				width: '100px'
			}, {
				key : 'portStatCd', align:'center',
				title : '포트상태코드',
				width: '70px'
			}, {
				key : 'portStatNm', align:'center',
				title : '포트상태',
				width: '100px'
			},{
				key : 'portCapaCd', align:'center',
				title : '포트용량코드',
				width: '70px'
			},{
				key : 'portCapaNm', align:'center',
				title : '포트용량',
				width: '100px'
			},{//숨김 데이터
				key : 'lgcPortYn', align:'center',
				title : '논리포트여부',
				width: '70px'
			},{
				key : 'srsPortYn', align:'center',
				title : '중요포트여부',
				width: '70px'
			},{
				key : 'autoMgmtYn', align:'center',
				title : '자동관리여부',
				width: '70px'
			},{
				key : 'upLinkPortYn', align:'center',
				title : 'UP링크포트여부',
				width: '70px'
			},{
				key : 'dplxgMeansDivCd', align:'center',
				title : '이중화방식코드',
				width: '70px'
			},{
				key : 'dplxgMeansDivNm', align:'center',
				title : '이중화방식',
				width: '70px'
			},{
				key : 'dplxgPortYn', align:'center',
				title : '이중화여부',
				width: '70px'
			},{
				key : 'portMacNo', align:'center',
				title : '포트MAC',
				width: '70px'
			},{
				key : 'portGwIpAddr', align:'center',
				title : '포트게이트웨이',
				width: '70px'
			},{
				key : 'portSrvcDivCd', align:'center',
				title : '포트서비스구분코드',
				width: '70px'
			},{
				key : 'portSrvcDivNm', align:'center',
				title : '포트서비스구분',
				width: '70px'
			},{
				key : 'portSbntIpAddr', align:'center',
				title : '포트서브넷',
				width: '70px'
			},{
				key : 'portDesc', align:'center',
				title : '포트설명',
				width: '70px'
			},{
				key : 'portRmk', align:'center',
				title : '포트비고',
				width: '70px'
			},{
				key : 'edgYn', align:'center',
				title : '말단여부',
				width: '70px'
			},{
				key : 'wavlVal', align:'center',
				title : '파장값',
				width: '70px'
			},{
				key : 'chnlVal', align:'center',
				title : '채널값',
				width: '70px'
			},{
				key : 'lastChgDate', align:'center',
				title : '변경일',
				width: '70px'
			},{
				key : 'lastChgUserId', align:'center',
				title : '변경자',
				width: '70px'
			},{
				key : 'frstRegDate', align:'center',
				title : '등록일',
				width: '70px'
			},{
				key : 'frstRegUserId', align:'center',
				title : '등록자',
				width: '70px'
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

    function setList(param){

    	if(JSON.stringify(param).length > 2){

    		//FDF, OFD, IJP, COUPLER, 기지국장비, 광중계기, RF중계기, W-RU, ERP 기지국, ERP 광중계기, ERP RF급, PBOX
    		if(param.eqpRoleDivCd == "11" || param.eqpRoleDivCd == "177" || param.eqpRoleDivCd == "178" || param.eqpRoleDivCd == "181" || param.eqpRoleDivCd == "20" || param.eqpRoleDivCd == "27" || param.eqpRoleDivCd == "28" || param.eqpRoleDivCd == "26" || param.eqpRoleDivCd == "41" || param.eqpRoleDivCd == "42" || param.eqpRoleDivCd == "43" || param.eqpRoleDivCd == "182"){
        		$('#btnPortPopReg').show();
        	}else{
        		$('#btnPortPopReg').hide();
        	}

        	$('#contentAreaPop').setData(param);
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);

        	param.page = 1;
        	param.rowPerPage = 100;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portMgmt', param, 'GET', 'search');
        }
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

         $('#dumyPortYn').change(function(e) {
        	 if($('#dumyPortYn').prop('checked') == false){
        		 paramData.dumyPortYn = "N";
        	 }else{
        		 paramData.dumyPortYn = "";
        	 }
        	 setList(paramData);
         });

       //카드등록
      	$('#btnRegCard').on('click', function(e) {
    		 dataParam = {"regYnCard" : "N"};
//     		 popup('CardReg', '/tango-transmission-web/configmgmt/shpmgmt/CardReg.do', '형상 Card 등록', dataParam);
     		 $a.popup({
              	popid: 'CardReg',
              	title: '형상 Card 등록',
                  url: '/tango-transmission-web/configmgmt/shpmgmt/CardReg.do',
                  data: dataParam,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.85
              });
          });

     	//등록
    	 $('#btnPortPopReg').on('click', function(e) {
    		 var param =  $("#searchFormPop").getData();
//    		 dataParam = {"regYn" : "N"};
//    		 param.regYn = "N";
    		 param.fromEqpMgmt = "Y";
    		 popup('PortReg', '/tango-transmission-web/configmgmt/portmgmt/PortReg.do', '포트 등록', param);
         });

    	//엑셀다운
    	 $('#btnPortExportExcel').on('click', function(e) {
    		//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#searchFormPop").getData();

    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;

    		 if ($("input:checkbox[id='dumyPortYn']").is(":checked") ){
    			 param.dumyPortYn = "";
    	     }else{
    	    	 param.dumyPortYn = "N";
    	     }

    		 param.fileName = "포트현황";
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getPortInfMgmtList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

    	 //첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	dataObj.fromEqpMgmt = "Y";
     	 	popup('PortDtlLkup1', '/tango-transmission-web/configmgmt/portmgmt/PortDtlLkup.do', '포트상세정보',dataObj);
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

    	/* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */

    	if(flag == 'eqpPortPveRegIsolYn'){

    		if(response.Result == 'Y'){
    			$('#btnPortPopReg').setEnabled(false);
    		}
    	}
    	/* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		if(response.portMgmtList.mgmtGrpNm != "SKT"){			//SKB 인경우 선택 불가
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + response.portMgmtList.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
//    			$('#btnPortPopReg').hide();
	   	    }

    		setSPGrid(gridId, response, response.portMgmtList);
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

    	if(flag == 'adamsEqpMdlYn'){
    		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
    			$('#btnPortPopReg').hide();
    		}
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

    	var hideColList = ['eqpInstlMtsoId', 'eqpMdlId', 'eqpId', 'portId', 'portTypCd', 'portStatCd', 'portCapaCd', 'lgcPortYn', 'srsPortYn', 'autoMgmtYn', 'upLinkPortYn',
    	                   'dplxgMeansDivCd', 'dplxgMeansDivNm', 'dplxgPortYn', 'portMacNo', 'portGwIpAddr', 'portSbntIpAddr', 'portSrvcDivCd', 'portSrvcDivNm', 'portDesc', 'portRmk', 'edgYn',
    	                   'lastChgDate', 'lastChgUserId', 'frstRegDate', 'frstRegUserId'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {
    //this.setGrid = function(page, rowPerPage){ // this 쓰면 permission denied 되서 함수 접근못함.[20171121]

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchFormPop").getData();

    	//param.pageNo = page;
    	//param.rowPerPage = rowPerPage;
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portMgmt', param, 'GET', 'search');
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
                  width : 865,
                  height : window.innerHeight * 0.9
              });
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