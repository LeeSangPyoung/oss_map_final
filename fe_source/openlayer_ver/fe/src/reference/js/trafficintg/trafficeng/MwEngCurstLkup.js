/**
 * MwTrafficCurstLkup.js
 *

 */
$a.page(function() {

	var gridId = 'dataGrid';

	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate());
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];

	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

	var selectList = [];
	var selectedId_orgId = "";

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    	$('#btnExportExcel').setEnabled(false);
    };

    function initGrid() {
        //그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerRowHeight : 50,
	    	columnMapping: [
	    		{key : 'clctDt', align:'center', title : '일시', width: '110px'},
	    		{key : 'orgNm', align:'center', title : '본부', width: '130px' },
	    		{key : 'teamNm', align:'center', title : '팀', width: '120px'},
	    		{key : 'tmofNm', align:'center', title : '전송실', width: '130px'},
	    		{key : 'mtsoTypNm', align:'center', title : '국사유형', width: '110px'},
	    		{key : 'mtsoNm', align:'center', title : '국사명', width: '150px'},
	    		{key : 'adstNm', align:'center', title : '권역구분', width: '90px'},
	    		{key : 'repIntgFcltsCd', align:'center', title : '대표통합시설코드', width: '130px'},
	    		{key : 'bldCd', align:'center', title : '건물코드', width: '110px'},
	    		{key : 'bldAddr', align:'center', title : '주소', width: '200px'},
	    		{key : 'bldNm', align:'center', title : '건물명', width: '100px'},
	    		{key : 'eqpNm', align:'center', title : '장비명', width: '200px'},
	    		{key : 'bpNm', align:'center', title : '제조사', width: '80px'},
	    		{key : 'eqpMdlNm', align:'center', title : '장비모델', width: '80px'},
	    		{key : 'portNm', align:'center', title : '포트명', width: '220px'},
	    		{key : 'portAlsNm', align:'center', title : '포트별명', width: '110px'},
	    		{key : 'portDesc', align:'center', title : '포트설명', width: '220px'},
	    		{key : 'portCapaNm', align:'center', title : '속도(Mb)', width: '90px'},
	    		{key : 'inBpsVal', align:'right', title : 'INBPS(Mb)', width: '110px'},
	    		{key : 'outBpsVal', align:'right', title : 'OUTBPS(Mb)', width: '110px'},
	    		{key : 'inBpsRate', align:'right', title : 'INBPS<br>사용률(%)', width: '110px'},
	    		{key : 'outBpsRate', align:'right', title : 'OUTBPS<br>사용률(%)', width: '110px'},
	    		{key : 'wlesCapaVal', align:'center', title : '무선용량<br>(에어 용량)', width: '100px', headerStyleclass: "yellow"},
	    		{key : 'bdwhVal', align:'center', title : '대역폭', width: '80px', headerStyleclass: "yellow"},
	    		{key : 'modulMeansVal', align:'center', title : '변조방식', width: '100px', headerStyleclass: "yellow"},
	    		{key : 'useCapaVal', align:'center', title : '사용용량<br>(트래픽기준)', width: '100px', headerStyleclass: "yellow"},
	    		{key : 'freqVal', align:'left', title : '주파수', width: '80px', headerStyleclass: "yellow"},
	    		{key : 'chnlCnt', align:'right', title : 'CH수', width: '80px', headerStyleclass: "yellow"},
	    		{key : 'fcltsCapaStdVal', align:'center', title : '시설 용량 기준<br>(150Mbps)', width: '120px', headerStyleclass: "yellow"},
	    		{key : 'snrVal', align:'center', title : 'SNR', width: '80px', headerStyleclass: "yellow"},
	    		{key : 'atnPylnVal', align:'center', title : '안테나/철탑', width: '120px', headerStyleclass: "orange"},
	    		{key : 'distVal', align:'center', title : '거리', width: '100px', headerStyleclass: "orange"},
	    		{key : 'polwvVal', align:'center', title : '편파', width: '100px', headerStyleclass: "orange"},
	    		{key : 'protMeansVal', align:'center', title : '보호방식', width: '100px', headerStyleclass: "orange"}
			],

			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.roleDiv = "MW";

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        selectList = [ {el: '#orgNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
				          ,{el: '#tmofNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
				          ,{el: '#bpNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
				          ,{el: '#eqpMdlNm', url: 'modellist', key: 'comCd', label: 'comCdNm'}
				          ,{el: '#adstNm', url: 'adsts', key: 'comCd', label: 'comCdNm'}
				          //,{el: '#eqp', url: 'eqplist', key: 'comCd', label: 'comCdNm'}
				          ];

		for(var i=0; i<selectList.length; i++){
			if (selectList[i].el == '#orgNm') {//(2017-04-26 : HS Kim) 본부 초기 설정
        		httpRequest('tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + 'orgs/'+chrrOrgGrpCd, param, successCallbackOrgs, failCallback, 'GET');
        	}else if (selectList[i].el == '#teamNm'){
        		// 팀 설정은 본부 초기설정 직후에 연결 처리
        	}else {
	            selectInit[i] = Tango.select.init({
	                                                 el: selectList[i].el
	                                                 ,model: Tango.ajax.init({
	                                                     url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
	                                                     data: param
	                                                     })
	                                                ,valueField: selectList[i].key
	                                                ,labelField: selectList[i].label
	                                                ,selected: 'all'
	                                                });
	            selectInit[i].model.get();
        	}
       }

        //최번시
    	//$('#hour').append($('<option>', {value:'busyHour', text: '최번시'}));
    	for(var i = 0; i <= 23; i++){
    		$('#hour').append($('<option>', {value:i < 10 ? '0' + i : i, text: i < 10 ? '0' + i + '시' : i + '시'}));
    	}
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var date = $('#clctDt').val().replace(/-/gi,'');

//    	param.period = '1min';
    	param.clctDt = date;
    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.tmof = selectInit[2].getValue();

    	param.bpId = selectInit[3].getValue();
    	param.eqpMdlId = selectInit[4].getValue();
    	param.eqpNm = $('#eqpNm').val();

//        param.clctDtYear = clctDtYear = date.substring(0,4);
//        param.clctDtMon = clctDtMon = date.substring(4,6);
//        param.clctDtDay = clctDtDay = date.substring(6,8);

        param.adstNm = selectInit[5].getValue();

    	if(param.adstNm != 'all') {
    		param.adstNm = selectInit[5].getText();
    	}

    	param.mtsoNm = $('#mtsoNm').val();

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/mwEngCurstLkup', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
//        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
//        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
//        		return;
//        	};
////        	if($('#hour').val() == ''){
////        		//일자별시간 또는 최번시를 선택하세요
////        		callMsgBox('','W', makeArgConfigMsg('selectRequirement'," 일자별시간 ", " 최번시 "), function(msgId, msgRst){});
////        		return;
////        	};
//        	if( $('#trmsMtsoNm').val() == 'all' && $('#mdlNm').val() == 'all' ){
//        		//전송실 또는 장비모델를 선택하세요
//        		callMsgBox('','W', makeArgConfigMsg('selectRequirement'," 전송실 ", "장비모델"), function(msgId, msgRst){});
//        		return;
//        	};

        	setGrid(1, eobjk);
        	$('#btnExportExcel').setEnabled(true);	// (2017-04-06 : HS Kim) 추가
        });

    	//페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });

        //페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            eobjk = eObj.perPage;
            setGrid(1, eobjk);
        });

        //국사명 조회 시
        $('#mtsoNm').keydown(function(e){
        	$('#btnExportExcel').setEnabled(false);
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		$('#btnExportExcel').setEnabled(true);
        	}
        })

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
//        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
//        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
//        		return;
//        	};
//        	// (2017-03-10 : HS Kim) 조건 추가
//        	if( $('#trmsMtsoNm').val() == 'all' && $('#mdlNm').val() == 'all' ){
//        		//전송실 또는 장비모델를 선택하세요
//        		callMsgBox('','W', makeArgConfigMsg('selectRequirement'," 전송실 ", "장비모델"), function(msgId, msgRst){});
//        		return;
//        	};

    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

        	var date = $('#clctDt').val().replace(/-/gi,'');

        	param.period = '1min';
        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();

        	param.bpId = selectInit[3].getValue();
        	param.eqpMdlId = selectInit[4].getValue()

        	param.hour = $('#hour').val();
            param.clctDtYear = clctDtYear = date.substring(0,4);
            param.clctDtMon = clctDtMon = date.substring(4,6);
            param.clctDtDay = clctDtDay = date.substring(6,8);


            param.adstNm = selectInit[5].getValue();

        	if(param.adstNm != 'all') {
        		param.adstNm = selectInit[5].getText();
        	}

        	param.eqpNm = $('#eqpNm').val();	// (2017-03-02 : HS Kim) 추가
        	param.mtsoNm = $('#mtsoNm').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "mwTrafficCurstLkup";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-02 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "mwTrafficCurstLkup" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "mwTrafficCurstLkup";     // (2017-03-02 : HS Kim) 추가, 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;	// (2017-03-02 : HS Kim) 추가
    		// (2017-03-02 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "IP백홀트래픽현황조회";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreateMwTraffic', param, successCallbackExcel, failCallback, 'GET');
    		// (2017-03-02 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });

        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	var m = date.month < 10 ? '0' + date.month : date.month;
            	var d = date.day < 10 ? '0' + date.day : date.day;

                $("#clctDt").val(date.year + '-' + m + '-' + d);
            });
        });

        //본부를 선택했을 경우
        $('#orgNm').on('change', function(e){
            changeHdofc();
            changeTeam();
            $('#btnExportExcel').setEnabled(false);
        });

        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
            changeTeam();
            $('#btnExportExcel').setEnabled(false);
        })

        //제조사 선택시
        $('#bpNm').on('change', function(e){
        	changeVendorNm();
        	$('#btnExportExcel').setEnabled(false);
        });

        //모델 선택시
        $('#eqpMdlNm').on('change', function(e){
        	//changeMdl();
        	$('#btnExportExcel').setEnabled(false);
        });
        // (2017-04-06 : HS Kim) 조건 변경 시 엑셀버튼 비활성화
        $('#tmofNm').on('change', function(e){        	$('#btnExportExcel').setEnabled(false);        });
        $('#clctDt').on('change', function(e){        	$('#btnExportExcel').setEnabled(false);        });

        $('#adstNm').on('change', function(e){        	$('#btnExportExcel').setEnabled(false);        });
        $('#eqpNm').keydown(function(e){
        	$('#btnExportExcel').setEnabled(false);
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		$('#btnExportExcel').setEnabled(true);
        	}
        });

	};

	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;

    	var param = {};
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID,
    			data: param
    		}),
    		valueField: 'orgId',
    		labelField: 'orgNm',
    		selected: 'all'
    	})

    	selectInit[1].model.get();
	}

	//team change
	function changeTeam(){
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
    	param.teamId = selectInit[1].getValue(); //$('#teamNm').val();

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[2] = Tango.select.init({
    		el: '#tmofNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/trmsmtso',
    			data: param
    		}),
    		valueField: 'mtsoId',
    		labelField: 'mtsoNm',
    		selected: 'all'
    	})

    	selectInit[2].model.get({data:param});
	}

	//제조사 변경시
	function changeVendorNm(){
		var param = {};
		param.roleDiv = "MW";

    	param.bpId = selectInit[3].getValue();

    	selectInit[4] = Tango.select.init({
    		el: '#eqpMdlNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/modellist',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	selectInit[4].model.get({data:param})

	}

/*	function changeMdl(){
		var param = {};

    	param.comCd = selectInit[4].getValue();

    	selectInit[6] = Tango.select.init({
    		el: '#eqp',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/eqplist',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	selectInit[6].model.get({data:param})
	}*/

	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }

    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.mwTrafficCurstLkup);
	}

	var successCallbackExcel = function(response){

		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate');
		console.log(response);

		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();

	}

	// (2017-03-02 : HS Kim) OnDemand 엑셀배치 추가
	var successCallbackOnDemandExcel = function(response){

		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate - OnDemand');
		console.log(response);

		var jobInstanceId = response.resultData.jobInstanceId;
		//alert("(HS Kim) jobInstanceId : " + jobInstanceId);
		// 엑셀다운로드팝업
        $a.popup({
               popid: 'TrafficExcelDownloadPop' + jobInstanceId,
               title: '엑셀다운로드',
               iframe: true,
               modal : false,
               windowpopup : true,
               url: '/tango-transmission-web/trafficintg/TrafficExcelDownloadPop.do',
               data: {
                   jobInstanceId : jobInstanceId,
                   fileName : fileOnDemandName,
                   fileExtension : fileOnDemandExtension
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

    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional

    }

    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //Excel
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

    //(2017-04-26 : HS Kim) 본부 초기 설정
    var successCallbackOrgs = function(response){
    	var selectedId = null;
    	var sUprOrgId = "";
		if($("#sUprOrgId").val() != ""){
			 sUprOrgId = $("#sUprOrgId").val();
		}//		sUprOrgId = 'B111960000';

		var param = {};
		param.chrrOrgGrpCd  = $("#chrrOrgGrpCd").val();
		param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

		if(response.length > 0){	// 사용자 본부ID 설정
    		for(var i=0; i<response.length; i++){
    			if (sUprOrgId == response[i].orgId) {
    				selectedId = response[i].orgId;
    			}
    		}
		}
		if(selectedId == null){
			selectedId = response[1].orgId;
		}

    	selectInit[0] = Tango.select.init({
								            el: selectList[0].el
								            ,model: Tango.ajax.init({
								                url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[0].url,
//								                data: $("#chrrOrgGrpCd").val()
								                data: param
								                })
								           ,valueField: selectList[0].key
								           ,labelField: selectList[0].label
								           ,selected: selectedId
        });
    	selectInit[0].model.get();
    	selectedId_orgId = selectedId;	// 전역변수 : successCallbackTeam에서 사용하기 위한 초기 설정된 본부ID
    	// 팀 정보 초기 설정
    	httpRequest('tango-transmission-biz/transmisson/trafficintg/trafficintgcode/team/' + selectedId, param, successCallbackTeam, failCallback, 'GET');

    }
    // (2017-04-27 : HS Kim) 팀 초기 설정
    var successCallbackTeam = function(response) {
    	var selectedId = null;
    	var sOrgId = "";
		if($("#sOrgId").val() != ""){
			sOrgId = $("#sOrgId").val();
		} //sOrgId = '1000196803';

		var param = {};
		param.chrrOrgGrpCd  = $("#chrrOrgGrpCd").val();
		param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

		if(response.length > 0){	// 사용자 팀ID 설정
    		for(var i=0; i<response.length; i++){
    			if (sOrgId == response[i].orgId) {
    				selectedId = response[i].orgId;
    			}
    		}
		}
		if(selectedId == null){
			selectedId = response[1].orgId;
		}

    	selectInit[1] = Tango.select.init({
								            el: selectList[1].el
								            ,model: Tango.ajax.init({
								                url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/team/' + selectedId_orgId,
//								                data: $("#chrrOrgGrpCd").val()
								                data: param
								                })
								           ,valueField: selectList[1].key
								           ,labelField: selectList[1].label
								           ,selected: selectedId
        });
    	selectInit[1].model.get();
    }

});