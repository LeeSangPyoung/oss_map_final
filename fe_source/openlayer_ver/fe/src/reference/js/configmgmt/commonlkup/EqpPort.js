/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var com = $a.page(function() {

	var gridId = 'dataGridPop';
	var paramData = null;
	var Cnt = 0;
    this.init = function(id, param) {

    	//paramData = param;

    	initGrid();
        setEventListener();

        httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfo');
        //$('#'+gridId).alopexGrid('showProgress');
        //httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpports', param, 'GET', 'eqpports');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');
        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#eqpPortLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }


    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: true  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '25row',
			paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: "auto" },
			fitTableWidth: false,
    		columnMapping: [
//    			{ align:'center', title : '순번', width: '50px', numberingColumn: true },
    			{ key : 'dumyPortYn', align:'center', title : 'DUMMY여부', width: '100px' },
    			{ key : 'tmofNm', align:'center', title : '전송실', width: '130px' },
    			{ key : 'eqpInstlMtsoId', align:'center', title : '국사ID', width: '70px' },
    			{ key : 'eqpInstlMtsoNm', align:'center', title : '국사', width: '130px' },
    			{ key : 'eqpMdlId', align:'center', title : '모델ID', width: '70px' },
    			{ key : 'eqpMdlNm', align:'center', title : '모델', width: '130px' },
    			{ key : 'eqpId', align:'center', title : '장비ID', width: '70px' },
    			{ key : 'eqpNm', align:'center', title : '장비명', width: '150px' },
    			{ key : 'cardNm', align:'center', title : '카드명', width: '150px' },
    			{ key : 'cardMdlNm', align:'center', title : '카드모델명', width: '150px' },
    			{ key : 'portIdxNo', align:'center', title : '포트Index', width: '70px' },
    			{ key : 'portId', align:'center', title : '포트ID', width: '70px' },
    			{ key : 'portNm', align:'center', title : '포트명', width: '130px' },
    			{ key : 'portAlsNm', align:'center', title : '포트별칭명', width: '150px' },
    			{ key : 'portOpStatNm', align:'center', title : '포트운용상태', width: '100px' },
    			{
                key : 'stndRackNo', align:'center',   // stndRackNo ... stndPortNo 추가 [20171121]
                title : 'RaNo',
                width: '28px' },
                { key : 'stndShelfNo', align:'center', title : 'ShNo', width: '28px' },
                { key : 'stndSlotNo', align:'center', title : 'SlNo', width: '28px' },
                { key : 'stndSubSlotNo', align:'center', title : 'SuNo', width: '28px' },
                { key : 'stndPortNo', align:'center', title : 'PoNo', width: '28px' },
                { key : 'crsLnkgYn', align:'center', title : 'CRS연동여부', width: '100px' },
                { key : 'crsPathNm', align:'center', title : 'CRS경로명', width: '150px' },
                { key : 'crsChgDate', align:'center', title : 'CRS변경일자', width: '100px' },
                { key : 'portIpAddr', align:'center', title : '포트IP', width: '120px' },
                { key : 'portTypCd', align:'center', title : '포트유형코드', width: '70px' },
                { key : 'portTypNm', align:'center', title : '포트유형', width: '100px' },
                { key : 'portStatCd', align:'center', title : '포트상태코드', width: '70px' },
                { key : 'portStatNm', align:'center', title : '포트상태', width: '100px' },
                { key : 'portCapaCd', align:'center', title : '포트용량코드', width: '70px' },
                { key : 'portCapaNm', align:'center', title : '포트용량', width: '100px' },
                {//숨김 데이터
				key : 'lgcPortYn', align:'center', title : '논리포트여부', width: '70px' },
				{ key : 'srsPortYn', align:'center', title : '중요포트여부', width: '70px' },
				{ key : 'autoMgmtYn', align:'center', title : '자동관리여부', width: '70px' },
				{ key : 'upLinkPortYn', align:'center', title : 'UP링크포트여부', width: '70px' },
				{ key : 'dplxgMeansDivCd', align:'center', title : '이중화방식코드', width: '70px' },
				{ key : 'dplxgMeansDivNm', align:'center', title : '이중화방식', width: '70px' },
				{ key : 'dplxgPortYn', align:'center', title : '이중화여부', width: '70px' },
				{ key : 'portMacNo', align:'center', title : '포트MAC', width: '70px' },
				{ key : 'portGwIpAddr', align:'center', title : '포트게이트웨이', idth: '70px' },
				{ key : 'portSrvcDivCd', align:'center', title : '포트서비스구분코드', width: '70px' },
				{ key : 'portSrvcDivNm', align:'center', title : '포트서비스구분', width: '70px' },
				{ key : 'portSbntIpAddr', align:'center', title : '포트서브넷', width: '70px' },
				{ key : 'portDesc', align:'center', title : '포트설명', width: '70px' },
				{ key : 'portRmk', align:'center', title : '포트비고', width: '70px' },
				{ key : 'edgYn', align:'center', title : '말단여부', width: '70px' },
				{ key : 'wavlVal', align:'center', title : '파장값', width: '70px' },
				{ key : 'chnlVal', align:'center', title : '채널값', width: '70px' },
				{ key : 'lastChgDate', align:'center', title : '변경일', width: '70px' },
				{ key : 'lastChgUserId', align:'center', title : '변경자', width: '70px' },
				{ key : 'frstRegDate', align:'center', title : '등록일', width: '70px' },
				{ key : 'frstRegUserId', align:'center', title : '등록자', width: '70px'},

				{ key : 'serNo', align:'center', title : '광모듈시리얼번호', width: '100px' },
	        	{ key : 'barNo', align:'center', title : '광모듈바코드', width: '100px' },
	        	{ key : 'vendNm', align:'center', title : '광모듈제조사', width: '100px' },
	        	{ key : 'partNo', align:'center', title : '광모듈파트번호', width: '100px' },
	        	{ key : 'distVal', align:'center', title : '광모듈거리값', width: '100px' },
	        	{ key : 'tmprVal', align:'center', title : '광모듈온도값', width: '100px' },
	        	{ key : 'voltVal', align:'center', title : '광모듈전압값', width: '100px' },
	        	{ key : 'vcurVal', align:'center', title : '광모듈전류값', width: '100px' },
	        	{ key : 'sttEqpNm', align:'center', title : '대국장비명', width: '100px' },
	        	{ key : 'sttSerNo', align:'center', title : '대국시리얼번호', width: '100px' },
	        	{ key : 'portMacNo2', align:'center', title : '대국MAC번호', width: '100px' }],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['eqpInstlMtsoId', 'eqpMdlId', 'eqpId', 'portId', 'portTypCd', 'portStatCd', 'portCapaCd', 'lgcPortYn', 'srsPortYn', 'autoMgmtYn', 'upLinkPortYn',
    	                   'dplxgMeansDivCd', 'dplxgMeansDivNm', 'dplxgPortYn', 'portMacNo', 'portGwIpAddr', 'portSbntIpAddr', 'portSrvcDivCd', 'portSrvcDivNm', 'portDesc', 'portRmk', 'edgYn',
    	                   'lastChgDate', 'lastChgUserId', 'frstRegDate', 'frstRegUserId'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}


    function setList(param){

    	if(JSON.stringify(param).length > 2){

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getPortRegCheck', param, 'GET', 'eqpPortRegCheck');

//    		//FDF, OFD, IJP, COUPLER, 기지국장비, 광중계기, RF중계기, W-RU, ERP 기지국, ERP 광중계기, ERP RF급, PBOX
//    		if(param.eqpRoleDivCd == "11" || param.eqpRoleDivCd == "177" || param.eqpRoleDivCd == "178" || param.eqpRoleDivCd == "181" || param.eqpRoleDivCd == "20" || param.eqpRoleDivCd == "27" || param.eqpRoleDivCd == "28" || param.eqpRoleDivCd == "26" || param.eqpRoleDivCd == "41" || param.eqpRoleDivCd == "42" || param.eqpRoleDivCd == "43" || param.eqpRoleDivCd == "182"){
//        		$('#btnPortPopReg').show();
//        	}else{
//        		$('#btnPortPopReg').hide();
//        	}

    		if(param.mgmtGrpNm == "SKB"){			//ADAMS 수집 모델인 경우에는 수정버튼 비활성
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + param.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
//    			$('#btnPortPopReg').hide();
//    			$('#btnPortInfCopy').hide();
    		}

        	$('#eqpPortLkupArea').setData(param);
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);
        	var ckGubun = $("input:checkbox[id=dumyPortYn]").is(":checked") ? true : false;
        	if(!ckGubun){
        		param.dumyPortYn = "N";
	       	 }else{
	       		param.dumyPortYn = "";
	       	 }
        	param.page = 1;
        	param.rowPerPage = 100;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portMgmt', param, 'GET', 'search');
        }
    }

    function setEventListener() {
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

         $('#btnPortInfCopy').on('click', function(e) {
 	   		var param =  $("#eqpPortLkupForm").getData();
 	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfoCopyPop');
 	     });
     	//등록
    	 $('#btnPortPopReg').on('click', function(e) {

    		 var param =  $("#eqpPortLkupForm").getData();
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfoRegPop');
         });

    	//엑셀다운
    	 $('#btnPortExportExcel').on('click', function(e) {
    		//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#eqpPortLkupForm").getData();

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
   		 	$a.popup({
		      	popid: 'PortReg',
				title: '포트 등록',
				url: '/tango-transmission-web/configmgmt/portmgmt/PortDtlLkupPop.do',
				modal: true,
				movable:true,
				data:dataObj,
				windowpopup: true,
				width : 1100,
				height : 900,
				callback : function(data) { // 팝업창을 닫을 때 실행
					setList(paramData);
				}
			 });

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
    	if(flag == 'eqpinfo') {
			$('#eqpPortLkupArea').setData(response.eqpMgmtList[0]);
			paramData = response.eqpMgmtList[0];
			setList(paramData);
    	}
    	if(flag == 'eqpinfoCopyPop') {
    		var param = response.eqpMgmtList[0];
    		$a.popup({
              	popid: 'PortInfCopyReg',
              	title: '포트정보복사',
                  url: '/tango-transmission-web/configmgmt/portmgmt/PortInfCopyReg.do',
                  data: param,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 1265,
                  height : 800
              });
    	}

    	if(flag == 'eqpinfoRegPop') {
    		var param = response.eqpMgmtList[0];
   		 	param.fromEqpMgmt = "Y";

   		 	//alert(param.portIdAndIdxNo);
   		 	$a.popup({
		      	popid: 'PortReg',
				title: '포트 등록',
				url: '/tango-transmission-web/configmgmt/portmgmt/PortRegPop.do',
				modal: true,
				movable:true,
				data:param,
				windowpopup: true,
				width : 1000,
				height : window.innerHeight * 1.0,
				callback : function(data) { // 팝업창을 닫을 때 실행
					setList(param)
				}
			 });
    	}



    	/* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */

    	if(flag == 'eqpPortPveRegIsolYn'){

    		if(response.Result == 'Y'){
    			$('#btnPortPopReg').setEnabled(false);
    			$('#btnPortInfCopy').setEnabled(false);
    		}
    	}
    	/* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
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
    			$('#btnPortInfCopy').hide();
    		}
    	}

    	if(flag == 'eqpPortRegCheck'){
    		if (response.eqpPortRegYn  == "Y") {
    			$('#btnPortPopReg').show();
    		} else {
    			$('#btnPortPopReg').hide();
    		}

    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    function setGrid(page, rowPerPage) {
        //this.setGrid = function(page, rowPerPage){ // this 쓰면 permission denied 되서 함수 접근못함.[20171121]

        	$('#pageNo').val(page);
        	$('#rowPerPage').val(rowPerPage);

        	var param =  $("#eqpPortLkupForm").getData();
        	var ckGubun = $("input:checkbox[id=dumyPortYn]").is(":checked") ? true : false;
        	if(!ckGubun){
        		param.dumyPortYn = "N";
	       	 }else{
	       		param.dumyPortYn = "";
	       	 }
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