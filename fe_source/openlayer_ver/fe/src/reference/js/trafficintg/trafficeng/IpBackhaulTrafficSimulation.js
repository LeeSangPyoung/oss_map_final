/**
 * IpBackhaulTrafficSimulation.js
 *
 * @author 이현우
 * @date 2016. 8. 8. 오전 11:06:00
 * @version 1.0
 */
$a.page(function() {
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	var gridId = 'dataGrid';

	var gridFactor = 'gridFactor'

	var selectInit = [];

	//	(2017-03-07 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

	var selectList = [];
	var selectedId_orgId = "";

    this.init = function(id, param) {
    	$('#dateDay').setSelected();
    	$('#radioDay').setSelected();
    	$('#dayDiv').show();
		$('#weekDiv').hide();

    	initGrid();
    	setFactorData(1,100);
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {

    	 $('#'+gridFactor).alopexGrid({
    		 rowInlineEdit: true,
    		 pager: false,
    		 cellInlineEdit: true,
    		 cellSelectable: true,
    		 cellInlineEditOption: {
    			startEvent: 'click'
    		 },
 	    	columnMapping: [{
     			key : 'fctorNm', align:'left',
 				title : 'Factor명',
 				width: '130px'
 			}, {
 				key : 'fctorEndVal', align:'center',
 				title : '시작값',
 				width: '90px',
 				editable: true,
 				render:{type:'text'}
 			}, {
 				key : 'fctorStaVal', align:'center',
 				title : '끝값',
 				width: '90px',
 				editable: true,
 				render:{type:'text'}
 			}, {
 				key : 'fctorDesc', align:'left',
 				title : '설명',
 				width: '250px'
 			}]
 	    });


    	$('#'+gridId).alopexGrid({
    		paging : {
         		pagerSelect: [100,300,500,1000]
                ,hidePageList: false  // pager 중앙 삭제
         	 },
    		autoColumnindex: true,
    		columnMapping: [{
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '90px'
			}, {
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '150px'
			}, {
    			key : 'teamNm', align:'left',
				title : '팀',
				width: '130px'
			}, {
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			}, {
    			key : 'mtsoTypNm', align:'center',
				title : '국사유형',
				width: '120px'
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
				title : '대표통합시설코드',
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
    			key : 'eqpTypNm', align:'center',
				title : '구분',
				width: '100px'
			}, {
    			key : 'eqpMdlNm', align:'left',
				title : '장비모델',
				width: '130px'
			}, {
    			key : 'ringNm', align:'left',
				title : '링명',
				width: '180px'
			}, {
    			key : 'eqpNm', align:'left',
				title : '장비명',
				width: '180px'
			}, {
    			key : 'portDesc', align:'left',
				title : '포트명',
				width: '180px'
			}, {
    			key : 'portAlsNm', align:'left',
				title : '포트별명',
				width: '150px'
			}, {
    			key : 'userDesc', align:'left',
				title : '포트설명',
				width: '150px'
			}, {
    			key : 'duIpAddr', align:'center',
				title : 'DU IP',
				width: '90px'
			}, {
    			key : 'vlanNo', align:'center',
				title : 'VLAN',
				width: '90px'
			}, {
    			key : 'portSpedVal', align:'right',
				title : '속도(Mb)',
				width: '90px'
			}, {
    			key : 'mgmtDivCd', align:'center',
				title : '관리',
				width: '80px'
			}, {
    			key : 'operDivCd', align:'center',
				title : '운영',
				width: '80px'
			}, {
    			key : 'maxBpsHour', align:'center',
				title : 'MAX시(1분)',
				width: '110px'
			}, {
    			key : 'maxBpsVal', align:'right',
				title : 'MAX시(1분,Mb)',
				width: '110px'
			}, {
    			key : 'maxUseRate', align:'right',
				title : '사용률(1분,%)',
				width: '110px'
			}, {
    			key : 'maxBpsHourComp', align:'center',
				title : 'MAX시(1분) 변경후',
				width: '130px'
			}, {
    			key : 'maxBpsValComp', align:'right',
				title : 'MAX시(1분,Mb) 변경후',
				width: '150px'
			}, {
    			key : 'maxUseRateComp', align:'right',
				title : '사용률(1분,%) 변경후',
				width: '140px'
			}, {
    			key : 'avgHour', align:'center',
				title : 'MAX시(5분)',
				width: '110px'
			}, {
    			key : 'avgBpsVal', align:'right',
				title : 'MAX시(5분,Mb)',
				width: '130px'
			}, {
    			key : 'avgUseRate', align:'right',
				title : '사용률(5분,%)',
				width: '110px'
			}, {
    			key : 'avgHourComp', align:'center',
				title : 'MAX시(5분) 변경후',
				width: '130px'
			}, {
    			key : 'avgBpsValComp', align:'right',
				title : 'MAX시(5분,Mb) 변경후',
				width: '150px'
			}, {
    			key : 'avgUseRateComp', align:'right',
				title : '사용률(5분,%) 변경후',
				width: '140px'
			}, {
    			key : 'bsyHour', align:'center',
				title : '최번시',
				width: '70px'
			}, {
    			key : 'bhAvgBpsVal', align:'right',
				title : '최번시평균(Mb)',
				width: '110px'
			}, {
    			key : 'bhUseRate', align:'right',
				title : '사용률(%)',
				width: '100px'
			}, {
    			key : 'bsyHourComp', align:'center',
				title : '최번시 변경후',
				width: '90px'
			}, {
    			key : 'bhAvgBpsValComp', align:'center',
				title : '최번시평균(Mb) 변경후',
				width: '150px'
			}, {
    			key : 'bhUseRateComp', align:'center',
				title : '사용률(%) 변경후',
				width: '130px'
			}, {
    			key : 'mainEqpIpAddr', align:'center',
				title : '장비IP',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
    	})

	    $('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

    function setFactorData(page, rowPerPage) {
        $('#'+"gridFactor").alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	param.stcEqpTypCd = '06'
    	param.fctorNm = $('#traffic').val();

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/factorTraffic', param, successCallbackSearchTraffic, failCallback, 'GET');
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
		param.roleDiv = 'L3';
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
   	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
   	                      ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
   	                      ,{el: '#mdlNm', url: 'modellist', key: 'comCd', label: 'comCdNm'}
   	                      ,{el: '#adstNm', url: 'adsts', key: 'comCd', label: 'comCdNm'}
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
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var date = $('#clctDt').val().replace(/-/gi,'');

    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsMtsoId = selectInit[2].getValue();
    	param.clctDt = date;

    	param.vendCd = selectInit[3].getValue();
    	param.eqpMdlId = selectInit[4].getValue();

    	param.adstNm = selectInit[5].getValue();

    	if(param.adstNm != 'all') {
    		param.adstNm = selectInit[5].getText();
    	}

    	//param.mtsoTypCd = $('#mtsoTyp').val();	// (2017-03-10 : HS Kin) 주석처리 : 국사유형
      	param.mtsoNm = $('#mtsoNm').val();

        //setFactorVal
     	var fctorStaVal = new Array();
     	var fctorEndVal = new Array();

     	for (var i=0; i<2; i++){
     		fctorStaVal[i] = $('#gridFactor').alopexGrid("dataGetByIndex",{data:i}).fctorStaVal;
     		fctorEndVal[i] = $('#gridFactor').alopexGrid("dataGetByIndex",{data:i}).fctorEndVal;
     	}

     	param.fctorStaVal1 = fctorStaVal[0];
     	param.fctorEndVal1 = fctorEndVal[0];
     	param.fctorStaVal2 = fctorStaVal[1];
     	param.fctorEndVal2 = fctorEndVal[1];

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/ipBackhaulTrafficSimulation', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {

    	$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				$('#'+gridFactor).alopexGrid("viewUpdate");
				break;
			case 1 :
				$('#'+gridId).alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});

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
        	if( $('#teamNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 팀을 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 팀 "), function(msgId, msgRst){});
        		return;
        	};

        	setGrid(1, eobjk);
        });

        $('#mtsoNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
        		return;
        	};
        	if( $('#teamNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 팀을 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 팀 "), function(msgId, msgRst){});
        		return;
        	};

    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

        	var date = $('#clctDt').val().replace(/-/gi,'');

        	param.clctDt = date;
        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();

        	param.vendCd = selectInit[3].getValue();
        	param.eqpMdlId = selectInit[4].getValue();

        	param.adstNm = selectInit[5].getValue();

        	if(param.adstNm != 'all') {
        		param.adstNm = selectInit[5].getText();
        	}

        	//param.mtsoTypCd = $('#mtsoTyp').val();	// (2017-03-10 : HS Kin) 주석처리 : 국사유형
        	param.mtsoNm = $('#mtsoNm').val();
            //setFactorVal
         	var fctorStaVal = new Array();
         	var fctorEndVal = new Array();
         	for (var i=0; i<2; i++){
         		fctorStaVal[i] = $('#gridFactor').alopexGrid("dataGetByIndex",{data:i}).fctorStaVal;
         		fctorEndVal[i] = $('#gridFactor').alopexGrid("dataGetByIndex",{data:i}).fctorEndVal;
         	}

         	param.fctorStaVal1 = fctorStaVal[0];
         	param.fctorEndVal1 = fctorEndVal[0];
         	param.fctorStaVal2 = fctorStaVal[1];
         	param.fctorEndVal2 = fctorEndVal[1];

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ipBackhaulTrafficSimulation";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-07 : HS Kim) OnDemand 엑셀배치 추가 Start
            var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        param.fileName = "IpBackhaulTrafficSimulation" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "IpBackhaulTrafficSimulation";

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "IP백홀트래픽시뮬레이션";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreateIpBackhaulTrafficSimulation', param, successCallbackExcel, failCallback, 'GET');
 	    	// (2017-03-07 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });

        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	var m = date.month < 10 ? '0' + date.month : date.month;
            	var d = date.day < 10 ? '0' + date.day : date.day;

                $("#txtCal").val(date.year + '-' + m + '-' + d);
            });
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

        //제조사 선택시
        $('#vendNm').on('change', function(e){
        	changeVendorNm();
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
	function changeVendorNm(){
		var param = {};

    	param.vendCd = selectInit[3].getValue();
    	param.roleDiv = 'L3';

    	selectInit[4] = Tango.select.init({
    		el: '#mdlNm',
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
		setSPGrid(gridId,response, response.ipBackhaulTrafficSimulation);
	}

	//request 성공시
	var successCallbackSearchTraffic = function(response){
		$('#'+gridFactor).alopexGrid('hideProgress');
		setSPGridTraffic(gridFactor,response, response.factorTraffic);
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

	// (2017-03-07 : HS Kim) OnDemand 엑셀배치 추가
	var successCallbackOnDemandExcel = function(response){

		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate - OnDemand');
		console.log(response);

		var jobInstanceId = response.resultData.jobInstanceId;
		//alert("(HS Kim) fileOnDemandName / jobInstanceId : " + fileOnDemandName + " / " + jobInstanceId);
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

    //Grid에 Row출력
    function setSPGridTraffic(GridID,Option,Data) {
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
								                data: param
								                })
								           ,valueField: selectList[1].key
								           ,labelField: selectList[1].label
								           ,selected: selectedId
        });
    	selectInit[1].model.get();
    }

});