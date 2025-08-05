/**
 * IpBackHaulTrafficTrendLkup.js
 *
 * @author 이현우
 * @date 2016. 7. 20. 오후 03:57:00
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';

	var currentDate = new Date();
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();
	var clctDateYear = currentDate.getFullYear() - 1;

	clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];

	// (2017-03-10 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

	var selectList = [];
	var selectedId_orgId = "";

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
				key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
				key : 'teamNm', align:'left',
				title : '팀',
				width: '120px'
			}, {
				key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			}, {
				key : 'mtsoTypNm', align:'center',
				title : '국사유형',
				width: '90px'
			}, {
				key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '180px'
			}, {
				key : 'adstNm', align:'center',
				title : '권역구분',
				width: '90px'
			}, {
				key : 'repIntgFcltsCd', align:'center',
				title : '공용대표시설코드',
				width: '130px'
			}, { // (2017-05-29 : HS Kim) 추가 : 건물코드, 건물명
				key : 'bldCd', align:'left',
				title : '건물코드',
				width: '130px'
			}, {
				key : 'intgFcltsCd', align:'left',
				title : '주소',	// addr
				width: '180px'
			}, {
    			key : 'bldNm', align:'left',
				title : '건물명',
				width: '130px'
			}, {
//				key : 'ptsG10Nm', align:'left',
//				title : '10G PTS',
//				width: '120px'
//			}, {
//				key : 'ptsG1Nm', align:'left',
//				title : '1G PTS',
//				width: '120px'
//			}, {
				key : 'eqpTypNm', align:'left',
				title : '구분',
				width: '90px'
			}, {
				key : 'eqpMdlNm', align:'left',
				title : '장비모델',
				width: '90px'
			}, {
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '180px'
			}, {	// (2017-06-14 : HS Kim) 추가
    			key : 'korNm', align:'left',
				title : '장비명(한글)',
				width: '180px'
			}, {
				key : 'portNm', align:'left',
				title : '포트명',
				width: '170px'
			}, {
				key : 'portAlsNm', align:'left',
				title : '포트별명',
				width: '150px'
			}, {
				key : 'portDesc', align:'left',
				title : '포트설명',
				width: '150px'
			}, {
				key : 'duIpAddr', align:'center',
				title : 'DU IP',
				width: '110px'
			}, {
				key : 'vlanNo', align:'center',
				title : 'VLAN',
				width: '90px'
			}, {
				key : 'portSpeed', align:'right',
				title : '속도(Mb)',
				width: '90px'
			}, {
				key : 'mgmtDivCd', align:'center',
				title : '관리',
				width: '90px'
			}, {
				key : 'operDivCd', align:'center',
				title : '운영',
				width: '90px'
			}, {
				key : 'mainEqpIpAddr', align:'center',
				title : '장비IP',
				width: '100px'
			}, {
				key : 'maxBpsVal1', align:'right',
				title : 'M1',
				width: '110px'
			}, {
				key : 'maxBpsVal2', align:'right',
				title : 'M2',
				width: '110px'
			}, {
				key : 'maxBpsVal3', align:'right',
				title : 'M3',
				width: '110px'
			}, {
				key : 'maxBpsVal4', align:'right',
				title : 'M4',
				width: '110px'
			}, {
				key : 'maxBpsVal5', align:'right',
				title : 'M5',
				width: '110px'
			}, {
				key : 'maxBpsVal6', align:'right',
				title : 'M6',
				width: '110px'
			}, {
				key : 'maxBpsVal7', align:'right',
				title : 'M7',
				width: '110px'
			}, {
				key : 'maxBpsVal8', align:'right',
				title : 'M8',
				width: '110px'
			}, {
				key : 'maxBpsVal9', align:'right',
				title : 'M9',
				width: '110px'
			}, {
				key : 'maxBpsVal10', align:'right',
				title : 'M10',
				width: '110px'
			}, {
				key : 'maxBpsVal11', align:'right',
				title : 'M11',
				width: '110px'
			}, {
				key : 'maxBpsVal12', align:'right',
				title : 'M12',
				width: '110px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //기준일자 입력
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
    	param.roleDiv = "L3";
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
 	                      ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#mdl', url: 'modellist', key: 'comCd', label: 'comCdNm'}
 	                     ];

        for(var i=0; i<selectList.length; i++){
        	if (selectList[i].el == '#hdofcNm') {//(2017-04-26 : HS Kim) 본부 초기 설정
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

        //년도
        $('#year').empty();

        if($('#trendMon').is(':checked')){
        	var currentDate = new Date();
        	var clctDtMon = currentDate.getMonth();
        	var clctDtYear = currentDate.getFullYear();

        	for(var i=-3; i<1; i++){
	    		$('#year').append($('<option>', {value: parseInt(clctDtYear) + i, text: parseInt(clctDtYear) + i + '년'}));
	    	}

	        $('#year').setSelected(clctDtYear + '년');
	        $('#mon').setSelected(parseInt(clctDtMon) + '월');

	        $('#'+gridId).alopexGrid("showCol", ['maxBpsVal11',  'maxBpsVal12']);	// (2017-04-21 : HS Kim) 추가

        }else{
        	var currentDate = new Date();
        	var clctDateYear = currentDate.getFullYear() - 1;

	        for(var i=-2; i<2; i++){
	    		$('#year').append($('<option>', {value: parseInt(clctDateYear) + i, text: parseInt(clctDateYear) + i + '년'}));
	    	}

	        $('#year').setSelected(clctDateYear + '년');

	        $('#'+gridId).alopexGrid("hideCol", [ 'maxBpsVal11','maxBpsVal12' ], 'conceal');	// (2017-04-21 : HS Kim) 추가

        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

        param.clctDtYear = clctDtYear;
        param.clctDtMon = $('#trendMon').is(':checked') ? clctDtMon = $('#mon').val() : '00';
        param.orgId = selectInit[0].getValue();
        param.teamId = selectInit[1].getValue();
        param.trmsMtsoId = selectInit[2].getValue();
        param.vendCd = selectInit[3].getValue();
        param.eqpMdlId = selectInit[4].getValue();
        param.eqpNm = $('#eqpNm').val();

    	httpRequest('tango-transmission-biz/trafficintg/statistics/ipBackHaulTrafficTrendLkup', param, successCallbackSearch, failCallback, 'GET');
    }

    function drawMenu() {
    	var year = $('#year').val(); //parseInt(clctDtYear);
    	var mon = $('#mon').val(); //parseInt(clctDtMon);

    	if (!$('#trendYear').is(':checked')) {	//월별
	    	var beginYear = year - 1;
	    	var beginMon = mon == 12 ? 1 : parseInt(mon) + 1;

	    	var i, n;
	    	for (i=beginMon, n=1; i < beginMon + 12; i++, n++) {
	    		var m = i % 12;
	    		if (m == 0) m = 12;
	    		else if (m == 1) beginYear += 1;

	    		m = m < 10 ? '0' + m : m;
	    		var t = beginYear + '-' + m + ' (Mb)';
	    		var k = 'maxBpsVal' + n;

	    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, k);
	    	}
    	}
    	else {	//년별
    		var beginYear = year - 9;	// (2017-04-21 : HS Kim) year - 11 => year - 9

	    	var i, n;
	    	for (i=beginYear, n=1; i < year + 1; i++, n++) {
	    		var t = String(i) + ' (Mb)';
	    		var k = 'maxBpsVal' + n;
	    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, k);
	    	}
    	}
    }

    function setEventListener() {
    	$('#trendMon').on('click', function(e) {
    		setSelectCode()
        	$('#monDiv').show();
        });

        $('#trendYear').on('click', function(e) {
        	setSelectCode();
        	$('#monDiv').hide();
        });

        $('#year').on('change', function(e) {
        	clctDtYear = $('#year').val();
        })

        $('#mon').on('change', function(e) {
        	clctDtMon = $('#mon').val();
        })
        var eobjk=100; // Grid 초기 개수
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

        // 검색
        $('#btnSearch').on('click', function(e) {
        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
        		return;
        	};

        	drawMenu();
        	setGrid(1, eobjk);
        });

        //장비명
        $('#eqpNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		return false;
        	}
        })

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
        		return;
        	};

    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

            param.clctDtYear = clctDtYear;
            param.clctDtMon = $('#trendMon').is(':checked') ? clctDtMon = $('#mon').val() : '00';
            param.orgId = selectInit[0].getValue();
            param.teamId = selectInit[1].getValue();
            param.trmsMtsoId = selectInit[2].getValue();
            param.vendCd = selectInit[3].getValue();
            param.eqpMdlId = selectInit[4].getValue();
            param.eqpNm = $('#eqpNm').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ipBackHaulTrafficTrendLkup";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "IpBackHaulTrafficTrendLkup" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "IpBackHaulTrafficTrendLkup";     // 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;	// (2017-03-02 : HS Kim) 추가
    		// (2017-03-10 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "IP백홀트래픽추이조회";
 	    	//httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateIpBackHaulTrafficTrendLkup', param, successCallbackExcel, failCallback, 'GET');
    		// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });

        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
        	changeHdofc();
        	changeTeam();
        });

        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
        	changeTeam();
        })

        //제조사를 선택했을 경우
        $('#vendNm').on('change', function(e){
        	changeVend();
        })
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
    		el: '#trmsMtsoNm',
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
	function changeVend(){
		var param = {};

    	param.vendCd = selectInit[3].getValue();
    	param.roleDiv = "L3";

    	selectInit[4] = Tango.select.init({
    		el: '#mdl',
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
		setSPGrid(gridId,response, response.ipBackHaulTrafficTrendLkup);
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
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}
	// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가
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