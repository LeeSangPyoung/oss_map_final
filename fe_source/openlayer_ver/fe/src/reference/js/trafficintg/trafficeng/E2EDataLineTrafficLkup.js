/**
 * E2EDataLineTrafficLkup.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오후 01:39:00
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

	var selectInit = [];
	var gridId = 'dataGrid';

	// (2017-03-08 : HS Kim) 추가
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
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '100px'
			}, {
    			key : 'orgNm', align:'left',
				title : '본부명',
				width: '130px'
			}, {
    			key : 'teamNm', align:'left',
				title : '팀명',
				width: '120px'
			}, {
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실명',
				width: '120px'
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
    			key : 'repIntgFcltsCd', align:'center',
				title : '공용대표시설코드',
				width: '130px'
			}, {
    			key : 'mtsoTypNm', align:'left',
				title : '국사유형명',
				width: '100px'
			}, {
    			key : 'svlnNo', align:'left',
				title : '회선번호',
				width: '110px'
			}, {
    			key : 'svlnNm', align:'left',
				title : 'DU명',
				width: '180px'
			}, {
    			key : 'intgFcltsNm', align:'left',
				title : '통합시설코드명',
				width: '200px'
			}, {
    			key : 'repNm', align:'left',
				title : '공용대표시설코드명',
				width: '180px'
			}, {
    			key : 'duVendNm', align:'center',
				title : 'DU제조사',
				width: '100px'
			}, {
    			key : 'mtsoAddr', align:'left',
				title : '국사주소',
				width: '200px'
			}, {
    			key : 'mtsoStNmAddr', align:'left',
				title : '국사신주소',
				width: '150px'
			}, {
    			key : 'adstNm', align:'center',
				title : '권역구분',
				width: '90px'
			}, {
    			key : 'duCtyDivVal1', align:'center',
				title : '도심구분1',
				width: '90px'
			}, {
    			key : 'duCtyDivVal2', align:'center',
				title : '도심구분2',
				width: '90px'
			}, {
    			key : 'duRuCnt', align:'center',
				title : 'RU수',
				width: '70px'
			}, {
    			key : 'duCellCnt', align:'center',
				title : '셀수',
				width: '90px'
			}, {
    			key : 'eqpNm', align:'left',
				title : '장비#0',
				width: '130px'
			}, {
    			key : 'portId', align:'left',
				title : '포트DSCR',
				width: '130px'
			}, {
    			key : 'portSpedVal', align:'right',
				title : '포트용량',
				width: '110px'
			}, {
    			key : 'maxValStdHour', align:'center',
				title : '최번시',
				width: '70px'
			}, {
    			key : 'maxBpsVal', align:'right',
				title : 'MAX BPS',
				width: '110px'
			}, {
    			key : 'eqpNm1', align:'left',
				title : '장비#1',
				width: '130px'
			}, {
    			key : 'ulnkPortId1', align:'left',
				title : 'UP 포트DESCR',
				width: '130px'
			}, {
    			key : 'ulnkPortSpedVal1', align:'right',
				title : 'UP 포트용량',
				width: '110px'
			}, {
    			key : 'ulnkMaxValStdHour1', align:'center',
				title : 'UP 포트 최번시',
				width: '120px'
			}, {
    			key : 'ulnkMaxBpsVal1', align:'right',
				title : 'UP 포트 MAX BPS',
				width: '140px'
			}, {
    			key : 'dlnkPortId1', align:'left',
				title : 'DN 포트 DESCR',
				width: '130px'
			}, {
    			key : 'dlnkPortSpedVal1', align:'right',
				title : 'DN 포트 용량',
				width: '110px'
			}, {
    			key : 'dlnkMaxValStdHour1', align:'center',
				title : 'DN 포트 최번시',
				width: '120px'
			}, {
    			key : 'dlnkMaxBpsVal1', align:'right',
				title : 'DN 포트 MAX BPS',
				width: '140px'
			}, {
    			key : 'eqpNm2', align:'left',
				title : '장비#2',
				width: '130px'
			}, {
    			key : 'ulnkPortId2', align:'left',
				title : 'UP 포트 DESCR',
				width: '110px'
			}, {
    			key : 'ulnkPortSpedVal2', align:'right',
				title : 'UP 포트 용량',
				width: '110px'
			}, {
    			key : 'ulnkMaxValStdHour2', align:'center',
				title : 'UP 포트 최번시',
				width: '120px'
			}, {
    			key : 'ulnkMaxBpsVal2', align:'right',
				title : 'UP 포트 MAX BPS',
				width: '140px'
			}, {
    			key : 'dlnkPortId2', align:'left',
				title : 'DN 포트 DESCR',
				width: '130px'
			}, {
    			key : 'dlnkPortSpedVal2', align:'right',
				title : 'DN 포트 용량',
				width: '150px'
			}, {
    			key : 'dlnkMaxValStdHour2', align:'center',
				title : 'DN 포트 최번시',
				width: '150px'
			}, {
    			key : 'dlnkMaxBpsVal2', align:'right',
				title : 'DN 포트 MAX BPS',
				width: '150px'
			}, {
    			key : 'eqpNm3', align:'center',
				title : '장비#3',
				width: '110px'
			}, {
    			key : 'ulnkPortId3', align:'left',
				title : 'UP 포트 DESCR',
				width: '110px'
			}, {
    			key : 'ulnkPortSpedVal3', align:'right',
				title : 'UP 포트 용량',
				width: '140px'
			}, {
    			key : 'ulnkMaxValStdHour3', align:'center',
				title : 'UP 포트 최번시',
				width: '150px'
			}, {
    			key : 'ulnkMaxBpsVal3', align:'right',
				title : 'UP 포트 MAX BPS',
				width: '130px'
			}, {
    			key : 'dlnkPortId3', align:'left',
				title : 'DN 포트 DESCR',
				width: '130px'
			}, {
    			key : 'dlnkPortSpedVal3', align:'right',
				title : 'DN 포트 용량',
				width: '110px'
			}, {
    			key : 'dlnkMaxValStdHour3', align:'center',
				title : 'DN 포트 최번시',
				width: '110px'
			}, {
    			key : 'dlnkMaxBpsVal3', align:'right',
				title : 'DN 포트 MAX BPS',
				width: '150px'
			}, {
    			key : 'eqpNm4', align:'left',
				title : '장비#4',
				width: '130px'
			}, {
    			key : 'ulnkPortId4', align:'left',
				title : 'UP 포트 DESCR',
				width: '130px'
			}, {
    			key : 'ulnkPortSpedVal4', align:'right',
				title : 'UP 포트 용량',
				width: '100px'
			}, {
    			key : 'ulnkMaxValStdHour4', align:'center',
				title : 'UP 포트 최번시',
				width: '110px'
			}, {
    			key : 'ulnkMaxBpsVal4', align:'right',
				title : 'UP 포트 MAX BPS',
				width: '150px'
			}, {
    			key : 'dlnkPortId4', align:'left',
				title : 'DN 포트 DESCR',
				width: '130px'
			}, {
    			key : 'dlnkPortSpedVal4', align:'right',
				title : 'DN 포트 용량',
				width: '100px'
			}, {
    			key : 'dlnkMaxValStdHour4', align:'center',
				title : 'DN 포트 최번시',
				width: '110px'
			}, {
    			key : 'dlnkMaxBpsVal4', align:'right',
				title : 'DN 포트 MAX BPS',
				width: '140px'
			}, {
    			key : 'duBsyHour', align:'center',
				title : 'DU 최번시',
				width: '90px'
			}, {
    			key : 'duDwldTrfVal', align:'right',
				title : 'DU DOWN Mb',
				width: '90px'
			}, {
    			key : 'duUladTrfVal', align:'right',
				title : 'DU UP Mb',
				width: '90px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	   	$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
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

    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsMtsoId = selectInit[2].getValue();
    	param.clctDt = $('#clctDt').val().replace(/-/gi,'');
    	param.adstNm = $('#adstNm option:selected').text();
//    	param.adstNm = selectInit[3].getValue();
    	param.svlnNm = $('#duNm').val();

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/eTwoEDataLineTrafficLkup', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
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

        $('#duNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

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

        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();
        	param.clctDt = $('#clctDt').val().replace(/-/gi,'');
        	param.adstNm = $('#adstNm option:selected').text();
//        	param.adstNm = selectInit[3].getValue();
        	param.svlnNm = $('#duNm').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "eTwoEDataLineTrafficLkup";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "ETwoEDataLineTrafficLkup" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "ETwoEDataLineTrafficLkup";     // (2017-03-02 : HS Kim) 추가, 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;	// (2017-03-02 : HS Kim) 추가
    		// (2017-03-08 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "E2E데이타회선트래픽조회";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreateETwoEDataLineTrafficLkup', param, successCallbackExcel, failCallback, 'GET');
    		// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가
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

//		for(var i=0; i<response.e2EDataLineTrafficLkup.length; i++ )
//		{
//
//			response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal1 = Comma(response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal1);
//			response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal1 = Comma(response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal1);
//			response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal2 = Comma(response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal2);
//			response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal2 = Comma(response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal2);
//			response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal3 = Comma(response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal3);
//			response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal3 = Comma(response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal3);
//			response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal4 = Comma(response.e2EDataLineTrafficLkup[i].ulnkPortSpedVal4);
//			response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal4 = Comma(response.e2EDataLineTrafficLkup[i].ulnkMaxBpsVal4);
//			response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal1 = Comma(response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal1);
//			response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal1 = Comma(response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal1);
//			response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal2 = Comma(response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal2);
//			response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal2 = Comma(response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal2);
//			response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal3 = Comma(response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal3);
//			response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal3 = Comma(response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal3);
//			response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal4 = Comma(response.e2EDataLineTrafficLkup[i].dlnkPortSpedVal4);
//			response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal4 = Comma(response.e2EDataLineTrafficLkup[i].dlnkMaxBpsVal4);
//		}

		setSPGrid(gridId,response, response.e2EDataLineTrafficLkup);
	}

	//숫자에 콤마 추가
	function Comma(str) {
    	var strReturn ;

    	if(str == null)
			strReturn = '0';
		else{
			str = String(str);
			strReturn = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,');
		}

    	return strReturn;
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
	// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가
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