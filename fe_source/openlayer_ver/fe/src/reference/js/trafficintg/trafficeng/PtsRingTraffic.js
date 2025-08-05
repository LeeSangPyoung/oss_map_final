/**
 * PtsRingTraffic.js
 *
 * @author 이현우
 * @date 2016. 7. 21. 오전 10:34:00
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var selectInit = [];

	// (2017-03-09 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

    this.init = function(id, param) {
    	$('#dateDay').setSelected();
    	$('#radioDay').setSelected();
    	$('#dayDiv').show();
		$('#weekDiv').hide();

    	initGrid();
        setSelectCode();
    	setEventListener();

    	$('#dateDay').click();
    };

    function initGrid() {
    	$('#'+gridId).alopexGrid('dataEmpty');

    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'clctDtWeek', align:'center',
				title : '주차',
				width: '100px'        ////
			},{
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '90px'      //
			},{
    			key : 'clctDtMon', align:'center',
				title : '월',
				width: '90px'      //
			}, {
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
				width: '150px'
			}, {
				key : 'duCnt', align:'right',
				title : 'DU수',
				width: '50px'
			}, {
				key : 'ruCnt', align:'right',
				title : 'RU수',
				width: '50px'
			}, {
				key : 'ringNm', align:'left',
				title : '링명',
				width: '200px'
			}, {
				key : 'ntwkTypNm', align:'center',
				title : '망구분',
				width: '100px'
			}, {
				key : 'nodeCnt', align:'right',
				title : 'Node수',
				width: '70px'
			}, {
				key : 'cotCnt', align:'right',
				title : 'COT설정수',
				width: '90px'
			}, {
				key : 'cotEqpNm', align:'left',
				title : 'COT장비명',
				width: '200px'
			}, {
				key : 'aportIdChnlVal', align:'left',
				title : 'A Port',
				width: '100px'
			}, {
				key : 'aportInBpsVal', align:'right',
				title : 'A INBPS(Mb)',
				width: '110px'
			}, {
				key : 'aportOutBpsVal', align:'right',
				title : 'A OUTBPS(Mb)',
				width: '110px'
			}, {
				key : 'bportIdChnlVal', align:'left',
				title : 'B Port',
				width: '100px'
			}, {
				key : 'bportInBpsVal', align:'right',
				title : 'B INBPS(Mb)',
				width: '110px'
			}, {
				key : 'bportOutBpsVal', align:'right',
				title : 'B OUTBPS(Mb)',
				width: '110px'
			}, {
				key : 'ringSpedVal', align:'right',
				title : '속도(Mb)',
				width: '90px'
			},{
				key : 'wkAvgMaxBpsVal', align:'right',
				title : '주 대표 트래픽(1분,Mb)',
				width: '150px'
			}, {
				key : 'wkAvgUseRate', align:'right',
				title : '주 대표 트래픽 사용률(%)',
				width: '160px'
			}, {
				key : 'mthAvgBpsVal', align:'right',
				title : '월 대표 트래픽(1분,Mb)',
				width: '150px'
			}, {
				key : 'maxMthAvgUseRate', align:'right',
				title : '월 대표 트래픽 사용률(%)',
				width: '160px'
			}, {
				key : 'weekHour', align:'center',
				title : '주 MAX시(1분)',
				width: '110px'
			}, {
				key : 'weekMax', align:'right',
				title : '주 MAX(1분,Mb)',
				width: '110px'
			}, {
				key : 'weekHour5', align:'center',
				title : '주 MAX시(5분)',
				width: '110px'
			}, {
				key : 'weekMax5', align:'right',
				title : '주 MAX시(5분,Mb)',
				width: '120px'
			}, {
				key : 'monHour1', align:'center',
				title : '월 MAX시(1분)',
				width: '110px'
			}, {
				key : 'monMax1', align:'right',
				title : '월 MAX(1분,Mb)',
				width: '120px'
			}, {
				key : 'monHour5', align:'center',
				title : '월 MAX시(5분)',
				width: '110px'
			}, {
				key : 'monMax5', align:'right',
				title : '월 MAX시(5분,Mb)',
				width: '120px'
			}, {
				key : 'day01', align:'right',
				title : '1일 (Mb)',
				width: '90px'
			}, {
				key : 'day02', align:'right',
				title : '2일 (Mb)',
				width: '90px'
			}, {
				key : 'day03', align:'right',
				title : '3일 (Mb)',
				width: '90px'
			}, {
				key : 'day04', align:'right',
				title : '4일 (Mb)',
				width: '90px'
			}, {
				key : 'day05', align:'right',
				title : '5일 (Mb)',
				width: '90px'
			}, {
				key : 'day06', align:'right',
				title : '6일 (Mb)',
				width: '90px'
			}, {
				key : 'day07', align:'right',
				title : '7일 (Mb)',
				width: '90px'
			}, {
				key : 'day08', align:'right',
				title : '8일 (Mb)',
				width: '90px'
			}, {
				key : 'day09', align:'right',
				title : '9일 (Mb)',
				width: '90px'
			}, {
				key : 'day10', align:'right',
				title : '10일 (Mb)',
				width: '90px'
			}, {
				key : 'day11', align:'right',
				title : '11일 (Mb)',
				width: '90px'
			}, {
				key : 'day12', align:'right',
				title : '12일 (Mb)',
				width: '90px'
			}, {
				key : 'day13', align:'right',
				title : '13일 (Mb)',
				width: '90px'
			}, {
				key : 'day14', align:'right',
				title : '14일 (Mb)',
				width: '90px'
			}, {
				key : 'day15', align:'right',
				title : '15일 (Mb)',
				width: '90px'
			}, {
				key : 'day16', align:'right',
				title : '16일 (Mb)',
				width: '90px'
			}, {
				key : 'day17', align:'right',
				title : '17일 (Mb)',
				width: '90px'
			}, {
				key : 'day18', align:'right',
				title : '18일 (Mb)',
				width: '90px'
			}, {
				key : 'day19', align:'right',
				title : '19일 (Mb)',
				width: '90px'
			}, {
				key : 'day20', align:'right',
				title : '20일 (Mb)',
				width: '90px'
			}, {
				key : 'day21', align:'right',
				title : '21일 (Mb)',
				width: '90px'
			}, {
				key : 'day22', align:'right',
				title : '22일 (Mb)',
				width: '90px'
			}, {
				key : 'day23', align:'right',
				title : '23일 (Mb)',
				width: '90px'
			}, {
				key : 'day24', align:'right',
				title : '24일 (Mb)',
				width: '90px'			//
			}, {
				key : 'day25', align:'right',
				title : '25일 (Mb)',
				width: '90px'			//
			}, {
				key : 'day26', align:'right',
				title : '26일 (Mb)',
				width: '90px'			//
			}, {
				key : 'day27', align:'right',
				title : '27일 (Mb)',
				width: '90px'			//
			}, {
				key : 'day28', align:'right',
				title : '28일 (Mb)',
				width: '90px'			//
			}, {
				key : 'day29', align:'right',
				title : '29일 (Mb)',
				width: '90px'			//
			}, {
				key : 'day30', align:'right',
				title : '30일 (Mb)',
				width: '90px'
			}, {
				key : 'day31', align:'right',
				title : '31일 (Mb)',
				width: '90px'
			}, {
				key : 'week1Mb', align:'right',
				title : '1주 (Mb)',
				width: '110px'
			}, {
				key : 'week2Mb', align:'right',
				title : '2주 (Mb)',
				width: '110px'
			}, {
				key : 'week3Mb', align:'right',
				title : '3주 (Mb)',
				width: '110px'
			}, {
				key : 'week4Mb', align:'right',
				title : '4주 (Mb)',
				width: '110px'
			}, {
				key : 'week5Mb', align:'right',
				title : '5주 (Mb)',
				width: '110px'
			}, {
				key : 'maxBpsHour', align:'center',
				title : 'MAX시(1분)',
				width: '90px'
			}, {
				key : 'maxBpsVal', align:'right',
				title : 'MAX(1분,Mb)',
				width: '110px'
			}, {
				key : 'usePer', align:'right',
				title : '사용률(1분,%)',
				width: '110px'
			}, {
				key : 'avgHour', align:'center',
				title : 'MAX시(5분)',
				width: '90px'
			}, {
				key : 'maxHour5', align:'right',
				title : 'MAX(5분,Mb)',
				width: '110px'
			}, {
				key : 'usePer5', align:'right',
				title : '사용률(5분,%)',
				width: '110px'
			}, {
				key : 'busyHour', align:'center',
				title : '최번시',
				width: '70px'
			}, {
				key : 'avgBpsVal', align:'right',
				title : '최번시평균(Mb)',
				width: '110px'
			}, {
				key : 'avgUseRate', align:'right',
				title : '사용률(%)',
				width: '80px'
			}, {
				key : 'monMaxBpsVal', align:'right',
				title : '월요일 MAX(Mb)',
				width: '110px'
			}, {
				key : 'tueMaxBpsVal', align:'right',
				title : '화요일 MAX(Mb)',
				width: '110px'
			}, {
				key : 'wedMaxBpsVal', align:'right',
				title : '수요일 MAX(Mb)',
				width: '110px'
			}, {
				key : 'thuMaxBpsVal', align:'right',
				title : '목요일 MAX(Mb)',
				width: '110px'
			}, {
				key : 'friMaxBpsVal', align:'right',
				title : '금요일 MAX(Mb)',
				width: '110px'
			}, {
				key : 'satMaxBpsVal', align:'right',
				title : '토요일 MAX(Mb)',
				width: '110px'
			}, {
				key : 'sunMaxBpsVal', align:'right',
				title : '일요일 MAX(Mb)',
				width: '110px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    $('#'+gridId).alopexGrid("hideCol", ['orgId','teamId','trmsMtsoId','portId','eqpId'], 'conceal');

	    if ($('#dateDay').is(':checked')) {
	    	$('#'+gridId).alopexGrid("hideCol",
	    			['clctDtWeek', 'wkAvgMaxBpsVal', 'wkAvgUseRate', 'weekHour', 'weekMax', 'weekHour5', 'weekMax5',
	    			 'monMaxBpsVal', 'tueMaxBpsVal', 'wedMaxBpsVal', 'thuMaxBpsVal', 'friMaxBpsVal', 'satMaxBpsVal', 'sunMaxBpsVal',

	    			 'clctDtMon','mthAvgBpsVal','maxMthAvgUseRate','monHour1','monMax1','monHour5','monMax5',
	    			 'day01','day02','day03','day04','day05','day06','day07','day08','day09','day10',
	    			 'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20',
	    			 'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31',
	    			 'week1Mb','week2Mb','week3Mb','week4Mb','week5Mb'
	    			 ], 'conceal');
	    }
	    else if ($('#dateWeek').is(':checked')) {
	    	$('#'+gridId).alopexGrid("hideCol",
	    			['clctDt', 'cotCnt', 'aportInBpsVal', 'bportInBpsVal', 'maxBpsHour', 'maxBpsVal', 'usePer',
	    			 'maxHour5', 'usePer5', 'avgHour', 'busyHour', 'avgBpsVal', 'avgUseRate',

	    			 'clctDtMon','mthAvgBpsVal','maxMthAvgUseRate','monHour1','monMax1','monHour5','monMax5',
	    			 'day01','day02','day03','day04','day05','day06','day07','day08','day09','day10',
	    			 'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20',
	    			 'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31',
	    			 'week1Mb','week2Mb','week3Mb','week4Mb','week5Mb'
	    			 ], 'conceal');
	    }else if($('#dateMon').is(':checked')){
	    	if($('#radioDay').is(':checked')){
	    		$('#'+gridId).alopexGrid("hideCol",
	    				['clctDt', 'cotCnt', 'aportInBpsVal', 'bportInBpsVal', 'maxBpsHour', 'maxBpsVal', 'usePer',
		    			 'maxHour5', 'usePer5', 'avgHour', 'busyHour', 'avgBpsVal', 'avgUseRate',

		    			 'clctDtWeek', 'wkAvgMaxBpsVal', 'wkAvgUseRate', 'weekHour', 'weekMax', 'weekHour5', 'weekMax5',
		    			 'monMaxBpsVal', 'tueMaxBpsVal', 'wedMaxBpsVal', 'thuMaxBpsVal', 'friMaxBpsVal', 'satMaxBpsVal', 'sunMaxBpsVal',

		    			 'week1Mb','week2Mb','week3Mb','week4Mb','week5Mb'
		    			 ], 'conceal');
	    	}else{
	    		$('#'+gridId).alopexGrid("hideCol",
	    				['clctDt', 'cotCnt', 'aportInBpsVal', 'bportInBpsVal', 'maxBpsHour', 'maxBpsVal', 'usePer',
		    			 'maxHour5', 'usePer5', 'avgHour', 'busyHour', 'avgBpsVal', 'avgUseRate',

		    			 'clctDtWeek', 'wkAvgMaxBpsVal', 'wkAvgUseRate', 'weekHour', 'weekMax', 'weekHour5', 'weekMax5',
		    			 'monMaxBpsVal', 'tueMaxBpsVal', 'wedMaxBpsVal', 'thuMaxBpsVal', 'friMaxBpsVal', 'satMaxBpsVal', 'sunMaxBpsVal',

		    			 'day01','day02','day03','day04','day05','day06','day07','day08','day09','day10',
		    			 'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20',
		    			 'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31'
		    			 ], 'conceal');
	    	}
	    }

    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
       /* var i;

    	for(i=clctDtYear-3; i <= clctDtYear; i++){
    		$('#d1').append($('<option>', {value:i, text: i + '년'}));
    	}

    	for(i=1; i <= 12; i++){
    		$('#d2').append($('<option>', {value:i, text: (i >= 10 ? i : '0' + i) + '월'}));
    	}

    	for(i=1; i <= 6; i++){
    		$('#d3').append($('<option>', {value:i, text: i + '주'}));
    	}

    	$('#d1').setSelected(clctDtYear + '년');
    	$('#d2').setSelected(clctDtMon + '월');
    	*/
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();

    	param.roleDiv = "PTS";
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
					        ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
					        ,{el: '#ntwkNm', url: 'ntwktyps', key: 'comCd', label: 'comCdNm'}
                          ];

    	for(var i=0; i<selectList.length; i++){
        	selectInit[i] = Tango.select.init({
                 el: selectList[i].el
                ,model: Tango.ajax.init({
                                         url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                                         data: param
                                         })
                ,valueField: selectList[i].key
                ,labelField: selectList[i].label
                ,selected: 'all'
                })

            selectInit[i].model.get();
        }

    	//사용률
    	$('#useRate').clear();
    	$('#useRate').append($('<option>', {value: '', text: '전체'}));
    	for(var i = 9; i > 0; i--){
    		$('#useRate').append($('<option>', {value: i * 10, text: i * 10 + '% 이상'}));
    	}
    	$('#useRate').setSelected('전체');
    }

    function getWeek(date){

        //주차를 계산하고픈 일 달력 생성
        var wkDtCal = new Date( date.substring(0,4) , date.substring(4,6)-1 , date.substring(6,8) );

        prefixes=['1','2','3','4','5'];

        return prefixes[0|wkDtCal.getDate()/7];
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
        var date = $('#clctDt').val().replace(/-/gi,'');

       /* if($('#dateDay').is(':checked')){
        	param.dateDiv = 'day';
        }else if($('#dateWeek').is(':checked')){
        	param.dateDiv = 'week';
        }else{
        	if($('#radioDay').is(':checked')){
        		param.dateDiv = 'mon';
        	}else{
        		param.dateDiv = 'monweek';
        	}
        }
        */
        if($('#radioEqp').is(':checked')){
        	param.calcTyp = 'MAX';
        }else{
        	param.calcTyp = 'COT';
        }

    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.ntwkTypCd = selectInit[2].getValue();
    	param.ringNm = $('#ringNm').val();
    	param.clctDtYear = $('#dateDay').is(':checked') ? date.substring(0,4) : $('#selectYear').val();
        param.clctDtMon = $('#dateDay').is(':checked') ? date.substring(4,6) : $('#selectMon').val();
        param.clctDtDay = $('#dateDay').is(':checked') ? date.substring(6,8) : '';
        param.mthStdWkDgr = $('#selectWeek').val();
        param.maxUseRate = $('#useRate').val();

        if($('#dateDay').is(':checked')){
        	param.dateDiv = 'day';
        }else if($('#dateWeek').is(':checked')){
        	param.dateDiv = 'week';
        }else if($('#dateMon').is(':checked')){
        	if($('#radioDay').is(':checked')){
        		param.dateDiv = 'mon';
        	}else{
        		param.dateDiv = 'monweek';
        	}
        }

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/ptsRingTraffic', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });

        $('#ringNm').keydown(function(e){
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

        $('#'+gridId).on('dblclick', '.bodycell', function(e){

   		 var dataObj = null;
    	 	dataObj = AlopexGrid.parseEvent(e).data;

    	 	if($('#radioEqp').is(':checked')){
    	 		dataObj.clctDivVal = 'MAX';
            }else{
            	dataObj.clctDivVal = 'COT';
            }

    	 	dataObj.clctDt = dataObj.clctDt.replace(/-/g, "");

    	 	/* PTS 링 대표트래픽 장비 정보    	 */
    	 	popupList('PtsRingTrafficEqpLkup', $('#ctx').val()+'/trafficintg/trafficeng/PtsRingTrafficEqpLkup.do', 'PTS 링 대표트래픽 장비 정보',dataObj);

   	 	});

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

            var date = $('#clctDt').val().replace(/-/gi,'');

    		if($('#radioEqp').is(':checked')){
            	param.calcTyp = 'MAX';
            }else{
            	param.calcTyp = 'COT';
            }

        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.ntwkTypCd = selectInit[2].getValue();
        	param.ringNm = $('#ringNm').val();
        	param.clctDtYear = $('#dateDay').is(':checked') ? date.substring(0,4) : $('#selectYear').val();
            param.clctDtMon = $('#dateDay').is(':checked') ? date.substring(4,6) : $('#selectMon').val();
            param.clctDtDay = $('#dateDay').is(':checked') ? date.substring(6,8) : '';
            param.mthStdWkDgr = $('#selectWeek').val();
            param.maxUseRate = $('#useRate').val();

            if($('#dateDay').is(':checked')){
            	param.dateDiv = 'day';
            }else if($('#dateWeek').is(':checked')){
            	param.dateDiv = 'week';
            }else if($('#dateMon').is(':checked')){
            	if($('#radioDay').is(':checked')){
            		param.dateDiv = 'mon';
            	}else{
            		param.dateDiv = 'monweek';
            	}
            }

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ptsRingTraffic";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-09 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "PtsRingTraffic" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "PtsRingTraffic";     // 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;
    		// (2017-03-09 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "PTS링대표트래픽";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreatePtsRingTraffic', param, successCallbackExcel, failCallback, 'GET');
    		// (2017-03-09 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });

        $('#dateDay').on('click', function(e) {
    		$('#dayDiv').show();
    		$('#weekDiv').hide();
    		$('#detailOption').attr("disabled", false);

    		initGrid();

    		var currentDate = new Date();
	   		currentDate.setDate(currentDate.getDate()-1);
	   		var clctDtDay = currentDate.getDate();
	   		var clctDtMon = currentDate.getMonth() + 1;
	   		var clctDtYear = currentDate.getFullYear();

	   		clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	   		clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	   		$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    	})

    	$('#dateWeek').on('click', function(e) {
    		var cDate = new Date();
	    	cDate.setDate(cDate.getDate()-7);
	    	clctDtDay = cDate.getDate();
	    	clctDtMon = cDate.getMonth() + 1;
	    	clctDtYear = cDate.getFullYear();
	   		clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	    	//년도
	    	$('#selectYear').empty();
	    	for(var i = -3; i <= 1; i++){
	    	    $('#selectYear').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
	    	};
	    	$('#selectYear').val(clctDtYear);

	    	//월
	    	$('#selectMon').empty();
	    	for(var i = 1; i <= 12; i++){
	    		$('#selectMon').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
	    	};
	    	$('#selectMon').val(clctDtMon);

	    	//주차
	    	$('#selectWeek').empty();
	    	for(var i = 1; i <= 5; i++){
	    		$('#selectWeek').append($('<option>', {value: i, text: i + '주차'}));
	    	};
	    	$('#selectWeek').val(getWeek(clctDtYear + '' + clctDtMon + '' + clctDtDay));

    		$('#dayDiv').hide();
    		$('#weekDiv').show();
    		$('#selectWeek').show();
    		$('#spanDay').hide();
    		$('#spanWeek').hide();
    		$('#radioDay').hide();
    		$('#radioWeek').hide();
    		$('#detailOption').attr("disabled", true);

    		initGrid();

    	})

    	$('#dateMon').on('click', function(e) {
    		$('#dayDiv').hide();
    		$('#weekDiv').show();
    		$('#selectWeek').hide();
    		$('#spanDay').show();
    		$('#spanWeek').show();
    		$('#radioDay').show();
    		$('#radioWeek').show();
    		$('#detailOption').attr("disabled", true);

    		initGrid();

    		var cDate = new Date();
	    	cDate.setMonth(cDate.getMonth()-1);
	    	clctDtMon = cDate.getMonth() + 1;
	    	clctDtYear = cDate.getFullYear();
	   		clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	    	//년도
	    	$('#selectYear').empty();
	    	for(var i = -3; i <= 1; i++){
	    	    $('#selectYear').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
	    	};
	    	$('#selectYear').val(clctDtYear);

	    	//월
	    	$('#selectMon').empty();
	    	for(var i = 1; i <= 12; i++){
	    		$('#selectMon').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
	    	};
	    	$('#selectMon').val(clctDtMon);
    	})

    	$('#radioDay').on('click', function(e) {
    		initGrid();
    	})

    	$('#radioWeek').on('click', function(e) {
    		initGrid();
    	})

        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	var m = date.month < 10 ? '0' + date.month : date.month;
            	var d = date.day < 10 ? '0' + date.day : date.day;

                $("#clctDt").val(date.year + '-' + m + '-' + d);
            });
        });

        $('#selectYear').on('change', function(e){
        	initGrid();
        });

        $('#selectMon').on('change', function(e){
        	initGrid();
        });

        $('#selectWeek').on('change', function(e){
        	initGrid();
        });

        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
            changeHdofc();
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
		setSPGrid(gridId,response, response.lists);
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
	// (2017-03-09 : HS Kim) OnDemand 엑셀배치 추가
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

    function popupList(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7
              });
        }
});