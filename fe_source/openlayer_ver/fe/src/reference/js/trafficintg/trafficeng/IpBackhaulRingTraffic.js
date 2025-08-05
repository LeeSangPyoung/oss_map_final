/**
 * IpBackhaulTraffic.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오전 09:44:00
 * @version 1.0
 */
$a.page(function() {

	var selectInit = [];
	var gridId = 'dataGrid';

	//	(2017-03-07 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

    this.init = function(id, param) {
    	$('#dateDay').setSelected();
    	$('#radioDay').setSelected();
    	$('#dayDiv').show();
		$('#weekDiv').hide();
		$('#dayWeekDiv').hide();
		$('#woRingLabel').hide();

		$('#ringNmLabel').html("") ;

    	initGrid();
        setSelectCode();
    	setEventListener();

    	$('#dateDay').click();
    };

    function initGrid() {
    	//그리드 생성
    	$('#'+gridId).alopexGrid({
    		paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'creYm', align:'center',
				title : '주차',
				width: '100px'        ////
			},{
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '100px'      //
			},{
    			key : 'clctDtMon', align:'center',
				title : '월',
				width: '100px'      //
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
				width: '120px'
			}, {
				key : 'duCnt', align:'right',
				title : 'DU수',
				width: '70px'
			}, {
				key : 'ruCnt', align:'right',
				title : 'RU수',
				width: '70px'
			}, {
				key : 'ringNm', align:'left',
				title : '링명',
				width: '150px'
			}, {
				key : 'ntwkTypNm', align:'left',
				title : '망구분',
				width: '150px'
			}, {
				key : 'topoTypNm', align:'left',
				title : '망종류',
				width: '150px'
			}, {
				key : 'nodeCnt', align:'right',
				title : 'Node수',
				width: '90px'
			}, {
				key : 'ibcCnt', align:'right',
				title : 'COT설정수',
				width: '90px'	//
			}, {
				key : 'eqpNm1', align:'left',
				title : '장비명#1',
				width: '150px'
			}, {
				key : 'aportIdChnlVal1', align:'left',
				title : 'A Port',
				width: '110px'
			}, {
				key : 'aportInBpsVal1', align:'right',
				title : 'A INBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'aportOutBpsVal1', align:'right',
				title : 'A OUTBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'bportIdChnlVal1', align:'left',
				title : 'B Port',
				width: '110px'
			}, {
				key : 'bportInBpsVal1', align:'right',
				title : 'B INBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'bportOutBpsVal1', align:'right',
				title : 'B OUTBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'eqpNm2', align:'left',
				title : '장비명#2',
				width: '150px'
			}, {
				key : 'aportIdChnlVal2', align:'left',
				title : 'A Port',
				width: '110px'
			}, {
				key : 'aportInBpsVal2', align:'right',
				title : 'A INBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'aportOutBpsVal2', align:'right',
				title : 'A OUTBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'bportIdChnlVal2', align:'left',
				title : 'B Port',
				width: '110px'
			}, {
				key : 'bportInBpsVal2', align:'right',
				title : 'B INBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'bportOutBpsVal2', align:'right',
				title : 'B OUTBPS(Mb)',
				width: '120px'				//
			}, {
				key : 'ringSpedVal', align:'right',
				title : '속도(Mb)',
				width: '100px'
			},{
				key : 'wkAvgMaxBpsVal', align:'right',
				title : '주 대표 트래픽(1분,Mb)',
				width: '150px'		////
			}, {
				key : 'wkAvgUseRate', align:'right',
				title : '주 대표 트래픽 사용률(%)',
				width: '150px'			////
			}, {
				key : 'mthAvgBpsVal', align:'right',
				title : '월 대표 트래픽(1분,Mb)',
				width: '150px'		////
			}, {
				key : 'maxMthAvgUseRate', align:'right',
				title : '월 대표 트래픽 사용률(%)',
				width: '200px'			////
			}, {
				key : 'wkmaxBpsHour', align:'center',
				title : '주 MAX시(1분)',
				width: '110px'			////
			}, {
				key : 'wkmaxBpsVal', align:'right',
				title : '주 MAX(1분,Mb)',
				width: '120px'			////
			}, {
				key : 'wkavgHour', align:'center',
				title : '주 MAX시(5분)',
				width: '110px'			////
			}, {
				key : 'wkavgBpsVal', align:'right',
				title : '주 MAX시(5분,Mb)',
				width: '120px'			//
			}, {
				key : 'mthmaxBpsHour', align:'center',
				title : '월 MAX시(1분)',
				width: '110px'			////
			}, {
				key : 'mthmaxBpsVal', align:'right',
				title : '월 MAX(1분,Mb)',
				width: '120px'			////
			}, {
				key : 'mthavgHour', align:'center',
				title : '월 MAX시(5분)',
				width: '110px'			////
			}, {
				key : 'mthMaxAvgBpsVal', align:'right',
				title : '월 MAX시(5분,Mb)',
				width: '120px'			//
			}, {
				key : 'day01MaxBpsVal', align:'right',
				title : '1일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day02MaxBpsVal', align:'right',
				title : '2일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day03MaxBpsVal', align:'right',
				title : '3일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day04MaxBpsVal', align:'right',
				title : '4일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day05MaxBpsVal', align:'right',
				title : '5일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day06MaxBpsVal', align:'right',
				title : '6일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day07MaxBpsVal', align:'right',
				title : '7일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day08MaxBpsVal', align:'right',
				title : '8일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day09MaxBpsVal', align:'right',
				title : '9일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day10MaxBpsVal', align:'right',
				title : '10일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day11MaxBpsVal', align:'right',
				title : '11일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day12MaxBpsVal', align:'right',
				title : '12일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day13MaxBpsVal', align:'right',
				title : '13일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day14MaxBpsVal', align:'right',
				title : '14일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day15MaxBpsVal', align:'right',
				title : '15일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day16MaxBpsVal', align:'right',
				title : '16일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day17MaxBpsVal', align:'right',
				title : '17일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day18MaxBpsVal', align:'right',
				title : '18일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day19MaxBpsVal', align:'right',
				title : '19일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day20MaxBpsVal', align:'right',
				title : '20일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day21MaxBpsVal', align:'right',
				title : '21일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day22MaxBpsVal', align:'right',
				title : '22일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day23MaxBpsVal', align:'right',
				title : '23일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day24MaxBpsVal', align:'right',
				title : '24일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day25MaxBpsVal', align:'right',
				title : '25일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day26MaxBpsVal', align:'right',
				title : '26일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day27MaxBpsVal', align:'right',
				title : '27일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day28MaxBpsVal', align:'right',
				title : '28일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day29MaxBpsVal', align:'right',
				title : '29일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day30MaxBpsVal', align:'right',
				title : '30일 (Mb)',
				width: '110px'			//
			}, {
				key : 'day31MaxBpsVal', align:'right',
				title : '31일 (Mb)',
				width: '110px'			//
			}, {
				key : 'wk1MaxBpsVal', align:'right',
				title : '1주 (Mb)',
				width: '110px'			//
			}, {
				key : 'wk2MaxBpsVal', align:'right',
				title : '2주 (Mb)',
				width: '110px'			//
			}, {
				key : 'wk3MaxBpsVal', align:'right',
				title : '3주 (Mb)',
				width: '110px'			//
			}, {
				key : 'wk4MaxBpsVal', align:'right',
				title : '4주 (Mb)',
				width: '110px'			//
			}, {
				key : 'wk5MaxBpsVal', align:'right',
				title : '5주 (Mb)',
				width: '110px'			//
			}, {
				key : 'maxBpsHour', align:'center',
				title : 'MAX시(1분)',
				width: '90px'			//
			}, {
				key : 'maxBpsVal', align:'right',
				title : 'MAX(1분,Mb)',
				width: '110px'			//
			}, {
				key : 'usePer', align:'right',
				title : '사용률(1분,%)',
				width: '110px'			//
			}, {
				key : 'avgHour', align:'center',
				title : 'MAX시(5분)',
				width: '90px'			//
			}, {
				key : 'maxHour5', align:'right',
				title : 'MAX(5분,Mb)',
				width: '110px'			//
			}, {
				key : 'usePer5', align:'right',
				title : '사용률(5분,%)',
				width: '110px'			//
			}, {
				key : 'busyHour', align:'center',
				title : '최번시',
				width: '70px'			//
			}, {
				key : 'avgBpsVal', align:'right',
				title : '최번시평균(Mb)',
				width: '110px'			//
			}, {
				key : 'avgUseRate', align:'right',
				title : '사용률(%)',
				width: '110px'			//
			}, {
				key : 'monMaxBpsVal', align:'right',
				title : '월요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'tueMaxBpsVal', align:'right',
				title : '화요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'wedMaxBpsVal', align:'right',
				title : '수요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'thuMaxBpsVal', align:'right',
				title : '목요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'friMaxBpsVal', align:'right',
				title : '금요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'satMaxBpsVal', align:'right',
				title : '토요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'sunMaxBpsVal', align:'right',
				title : '일요일 MAX(Mb)',
				width: '120px'			////
			}, {
				key : 'maxBpsDt', align:'right',
				title : 'maxBpsDt',
				width: '120px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    if ($('#dateDay').is(':checked')) {
	    	$('#'+gridId).alopexGrid("hideCol",
	    			['creYm','clctDtMon','wkAvgMaxBpsVal','wkAvgUseRate','mthAvgBpsVal','maxMthAvgUseRate','wkmaxBpsHour','wkmaxBpsVal',
	    			  'wkavgHour','wkavgBpsVal','mthmaxBpsHour','mthmaxBpsVal','mthavgHour','mthMaxAvgBpsVal',
	    			  'day01MaxBpsVal','day02MaxBpsVal','day03MaxBpsVal','day04MaxBpsVal','day05MaxBpsVal','day06MaxBpsVal','day07MaxBpsVal','day08MaxBpsVal','day09MaxBpsVal','day10MaxBpsVal',
	    			  'day11MaxBpsVal','day12MaxBpsVal','day13MaxBpsVal','day14MaxBpsVal','day15MaxBpsVal','day16MaxBpsVal','day17MaxBpsVal','day18MaxBpsVal','day19MaxBpsVal','day20MaxBpsVal',
	    				'day21MaxBpsVal','day22MaxBpsVal','day23MaxBpsVal','day24MaxBpsVal','day25MaxBpsVal','day26MaxBpsVal','day27MaxBpsVal','day28MaxBpsVal','day29MaxBpsVal','day30MaxBpsVal','day31MaxBpsVal',
	    				'wk1MaxBpsVal','wk2MaxBpsVal','wk3MaxBpsVal','wk4MaxBpsVal','wk5MaxBpsVal','monMaxBpsVal','tueMaxBpsVal','wedMaxBpsVal',
	    				 'thuMaxBpsVal','friMaxBpsVal','satMaxBpsVal','sunMaxBpsVal','maxBpsDt'

	    			 ], 'conceal');
	    }
	    else if ($('#dateWeek').is(':checked')) {
	    	$('#'+gridId).alopexGrid("hideCol",
	    			['clctDt','aportInBpsVal1','clctDtMon',
	    			 'aportOutBpsVal1','bportInBpsVal1','bportOutBpsVal1','aportInBpsVal2','aportOutBpsVal2',
	    			 'mthAvgBpsVal','maxMthAvgUseRate',
	    			  'bportInBpsVal2','bportOutBpsVal2','mthmaxBpsHour','mthmaxBpsVal','mthavgHour','mthMaxAvgBpsVal',
	    			  'day01MaxBpsVal','day02MaxBpsVal','day03MaxBpsVal','day04MaxBpsVal','day05MaxBpsVal','day06MaxBpsVal','day07MaxBpsVal','day08MaxBpsVal','day09MaxBpsVal','day10MaxBpsVal',
	    			  'day11MaxBpsVal','day12MaxBpsVal','day13MaxBpsVal','day14MaxBpsVal','day15MaxBpsVal','day16MaxBpsVal','day17MaxBpsVal','day18MaxBpsVal','day19MaxBpsVal','day20MaxBpsVal',
	    				'day21MaxBpsVal','day22MaxBpsVal','day23MaxBpsVal','day24MaxBpsVal','day25MaxBpsVal','day26MaxBpsVal','day27MaxBpsVal','day28MaxBpsVal','day29MaxBpsVal','day30MaxBpsVal','day31MaxBpsVal',
	    				'maxBpsHour','maxBpsVal','usePer','avgHour','maxHour5','usePer5','busyHour','avgBpsVal','avgUseRate','wk1MaxBpsVal','wk2MaxBpsVal','wk3MaxBpsVal','wk4MaxBpsVal','wk5MaxBpsVal','maxBpsDt'
	    			 ], 'conceal');
	    }else if($('#dateMon').is(':checked')){
	    	if($('#radioDay').is(':checked')){
	    		$('#'+gridId).alopexGrid("hideCol",
	    				['creYm','clctDt','aportInBpsVal1',
						 'aportOutBpsVal1','bportInBpsVal1','bportOutBpsVal1','aportInBpsVal2','aportOutBpsVal2',
						 'bportInBpsVal2','bportOutBpsVal2','wkAvgMaxBpsVal','wkAvgUseRate','wkmaxBpsHour','wkmaxBpsVal',
						 'wkavgHour','wkavgBpsVal','wk1MaxBpsVal','wk2MaxBpsVal','wk3MaxBpsVal','wk4MaxBpsVal','wk5MaxBpsVal',
						 'maxBpsHour','maxBpsVal','usePer','avgHour','maxHour5','usePer5','busyHour','avgBpsVal','avgUseRate','monMaxBpsVal','tueMaxBpsVal','wedMaxBpsVal',
						 'thuMaxBpsVal','friMaxBpsVal','satMaxBpsVal','sunMaxBpsVal','maxBpsDt'
		    			 ], 'conceal');
	    	}else{
	    		$('#'+gridId).alopexGrid("hideCol",
	    				['creYm','clctDt','aportInBpsVal1',
							'aportOutBpsVal1','bportInBpsVal1','bportOutBpsVal1','aportInBpsVal2','aportOutBpsVal2',
							 'bportInBpsVal2','bportOutBpsVal2','wkAvgMaxBpsVal','wkAvgUseRate','wkmaxBpsHour','wkmaxBpsVal',
							 'wkavgHour','wkavgBpsVal',
							 'day01MaxBpsVal','day02MaxBpsVal','day03MaxBpsVal','day04MaxBpsVal','day05MaxBpsVal','day06MaxBpsVal','day07MaxBpsVal','day08MaxBpsVal','day09MaxBpsVal','day10MaxBpsVal',
							 'day11MaxBpsVal','day12MaxBpsVal','day13MaxBpsVal','day14MaxBpsVal','day15MaxBpsVal','day16MaxBpsVal','day17MaxBpsVal','day18MaxBpsVal','day19MaxBpsVal','day20MaxBpsVal',
								'day21MaxBpsVal','day22MaxBpsVal','day23MaxBpsVal','day24MaxBpsVal','day25MaxBpsVal','day26MaxBpsVal','day27MaxBpsVal','day28MaxBpsVal','day29MaxBpsVal','day30MaxBpsVal','day31MaxBpsVal',
								'maxBpsHour','maxBpsVal','usePer','avgHour','maxHour5','usePer5','busyHour','avgBpsVal','avgUseRate','monMaxBpsVal','tueMaxBpsVal','wedMaxBpsVal',
								 'thuMaxBpsVal','friMaxBpsVal','satMaxBpsVal','sunMaxBpsVal','maxBpsDt'
		    			 ], 'conceal');
	    	}
	    }

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

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
 	                      ,{el: '#ntwkNm', url: 'ntwktyps', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#ntwkDivNm', url: 'toposcls', key: 'comCd', label: 'comCdNm'}
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

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/IPTRFWO', null, successCallbackCdList, failCallback, 'GET');

    }

    function getWeek(date){

        //주차를 계산하고픈 일 달력 생성
        var wkDtCal = new Date( date.substring(0,4) , date.substring(4,6)-1 , date.substring(6,8) );

        prefixes=['1','2','3','4','5'];

        return prefixes[0|wkDtCal.getDate()/7];
    }

    function setGrid(page, rowPerPage) {


    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var date = $('#clctDt').val().replace(/-/gi,'');

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

    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsMtsoId = selectInit[2].getValue();

    	param.adstNm = $('#adstNm option:selected').text();
    	param.maxUseRate = $('#useRate').val();
    	param.ringNm = $('#ringNm').val();

    	param.mtsoTypCd = $('#mtsoTyp').val();

    	//param.ntwkTypCd = $('#ntwkNm').val();
    	//param.topoCd = $('#ntwkDivNm').val();
    	param.ntwkTypCd = selectInit[3].getValue()

    	param.topoCd = selectInit[4].getValue();

    	if($('#radioEqp').is(':checked')){
         	param.calcDivVal = 'COTMAX';
         }else{
         	param.calcDivVal = 'COTASGN';
         }

    	var dateSrchCk = $("input:checkbox[id=dateSrchCk]").is(":checked") ? true : false;
    	if (dateSrchCk) {

    		if (param.ringNm.trim() == "") {
    			 callMsgBox('','I', "기간 검색 조회인 경우 링명이 필수 입니다.", function(msgId, msgRst){});
 		     	return;
    		}

    		param.periodDiv = 'Y';

    		var prevDate = $('#clctDtStart').val().replace(/-/gi,'');
    		param.clctDtPrevYear = clctDtPrevYear = $('#dateDay').is(':checked') ? prevDate.substring(0,4) : $('#selectStartYear').val();
            param.clctDtPrevMon = clctDtPrevMon = $('#dateDay').is(':checked') ? prevDate.substring(4,6) : $('#selectStartMon').val();
            param.clctDtPrevDay = clctDtPrevDay = $('#dateDay').is(':checked') ? prevDate.substring(6,8) : '';
    	} else {
    		param.periodDiv = 'N';
    	}


        param.clctDtYear = clctDtYear = $('#dateDay').is(':checked') ? date.substring(0,4) : $('#selectYear').val();
        param.clctDtMon = clctDtMon = $('#dateDay').is(':checked') ? date.substring(4,6) : $('#selectMon').val();
        param.clctDtDay = clctDtDay = $('#dateDay').is(':checked') ? date.substring(6,8) : '';
        param.mthStdWkDgr = $('#selectWeek').val();

        var woRingList = $('#woRingCdList').val();

        if (woRingList != null && woRingList.length > 0){
        	param.woRingCdList = woRingList.toString();
        }

        $('#'+gridId).alopexGrid('showProgress');

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/ipBackhaulRingTraffic', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
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

        $('#'+gridId).on('dblclick', '.bodycell', function(e){

      		 var dataObj = null;
       	 	dataObj = AlopexGrid.parseEvent(e).data;

       	 	if($('#radioEqp').is(':checked')){
       	 		dataObj.calcDivVal = 'COTMAX';
               }else{
               	dataObj.calcDivVal = 'COTASGN';
               }

       	 	if (dataObj.clctDt != undefined &&  dataObj.clctDt != "" && dataObj.clctDt != null) {
	       		dataObj.clctDt = dataObj.clctDt.replace(/-/g, "");

	       	 	/* IP백홀 링 대표트래픽 장비 정보    	 */
	       	 	popupList('IpBackhaulRingTrafficEqpLkup', $('#ctx').val()+'/trafficintg/trafficeng/IpBackhaulRingTrafficEqpLkup.do', 'IP백홀 링 대표트래픽 장비 정보',dataObj);
	       	 }


      	 	});

        $('#ringNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })


        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

        	var date = $('#clctDt').val().replace(/-/gi,'');

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

        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();

        	param.adstNm = $('#adstNm option:selected').text();
        	param.maxUseRate = $('#useRate').val();
        	param.ringNm = $('#ringNm').val();

        	param.mtsoTypCd = $('#mtsoTyp').val();
        	param.ntwkTypCd = selectInit[3].getValue()

        	param.topoCd = selectInit[4].getValue();

        	if($('#radioEqp').is(':checked')){
             	param.calcDivVal = 'COTMAX';
             }else{
             	param.calcDivVal = 'COTASGN';
             }


        	var dateSrchCk = $("input:checkbox[id=dateSrchCk]").is(":checked") ? true : false;
        	if (dateSrchCk) {

        		if (param.ringNm.trim() == "") {
        			 callMsgBox('','I', "기간 검색 조회인 경우 링명이 필수 입니다.", function(msgId, msgRst){});
     		     	return;
        		}

        		param.periodDiv = 'Y';

        		var prevDate = $('#clctDtStart').val().replace(/-/gi,'');
        		param.clctDtPrevYear = clctDtPrevYear = $('#dateDay').is(':checked') ? prevDate.substring(0,4) : $('#selectStartYear').val();
                param.clctDtPrevMon = clctDtPrevMon = $('#dateDay').is(':checked') ? prevDate.substring(4,6) : $('#selectStartMon').val();
                param.clctDtPrevDay = clctDtPrevDay = $('#dateDay').is(':checked') ? prevDate.substring(6,8) : '';
        	} else {
        		param.periodDiv = 'N';
        	}


            param.clctDtYear = clctDtYear = $('#dateDay').is(':checked') ? date.substring(0,4) : $('#selectYear').val();
            param.clctDtMon = clctDtMon = $('#dateDay').is(':checked') ? date.substring(4,6) : $('#selectMon').val();
            param.clctDtDay = clctDtDay = $('#dateDay').is(':checked') ? date.substring(6,8) : '';
            param.mthStdWkDgr = $('#selectWeek').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ipBackhaulRingTraffic";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가 Start
            var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        param.fileName = "IpBackhaulRingTraffic" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "IpBackhaulRingTraffic";

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;
    		// (2017-03-08 : HS Kim) End

    		var woRingList = $('#woRingCdList').val();

            if (woRingList != null && woRingList.length > 0){
            	param.woRingCdList = woRingList.toString();
            }

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "IP백홀링대표트래픽";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreateIpBackhaulRingTraffic', param, successCallbackExcel, failCallback, 'GET');
 	    	// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });

        $('#dateDay').on('click', function(e) {
    		$('#dayDiv').show();
    		$('#weekDiv').hide();
    		$('#dayWeekDiv').hide();


    		initGrid();

	   		var clctDtDay = getDay(-1);
	   		var clctDtMon = getMonth(-1);
	   		var clctDtYear = getYear(-1);

	   		var prevClctDtMon = getMonth(-1,-1);


	   		$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);

	   		var dateSrchCk = $("input:checkbox[id=dateSrchCk]").is(":checked") ? true : false;

	   		if (dateSrchCk) {
	   			$('#startSrch').show();

	   			document.getElementById("endSrch").className = 'Enddate NoLimit Dateinput'

	   			$('#ringNmLabel').html("*") ;
	   			$('#clctDtStart').val(clctDtYear + '-' + prevClctDtMon + '-' + clctDtDay);
	   		} else {
	   			$('#startSrch').hide();
	   			$('#ringNmLabel').html("") ;
	   		}

    	})

    	$('#dateWeek').on('click', function(e) {


    		clctDtDay = getDay(-7);
    		clctDtMon = getMonth(-7);
    		clctDtYear = getYear(-7);

	    	//년도
	    	$('#selectYear').empty();
	    	for(var i = -3; i <= 0; i++){
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
    		$('#dayWeekDiv').hide();
    		$('#selectWeek').show();
    		$('#spanDay').hide();
    		$('#spanWeek').hide();
    		$('#radioDay').hide();
    		$('#radioWeek').hide();

    		 $('#selectStartYear').hide();
			 $('#selectStartMon').hide();
			 $('#startDiv').hide();
			 $('#ringNmLabel').html("") ;


    		initGrid();

    	})

    	$('#dateMon').on('click', function(e) {
    		$('#dayDiv').hide();
    		$('#weekDiv').show();
    		$('#dayWeekDiv').show();
    		$('#selectWeek').hide();
    		$('#spanDay').show();
    		$('#spanWeek').show();
    		$('#radioDay').show();
    		$('#radioWeek').show();

    		initGrid();

    		clctDtMon =getMonth(0,-1);
	    	clctDtYear =  getYear();

	    	clctDtPrevYear =  getYear(0,-2);
	    	clctDtPrevMon =getMonth(0,-2);

	    	//년도
	    	$('#selectYear').empty();
	    	$('#selectStartYear').empty();
	    	for(var i = -3; i <= 0; i++){
	    	    $('#selectYear').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
	    	    $('#selectStartYear').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
	    	};
	    	$('#selectYear').val(clctDtYear);
	    	$('#selectStartYear').val(clctDtPrevYear);

	    	//월
	    	$('#selectMon').empty();
	    	$('#selectStartMon').empty();
	    	for(var i = 1; i <= 12; i++){
	    		$('#selectMon').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
	    		$('#selectStartMon').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
	    	};
	    	$('#selectMon').val(clctDtMon);
	    	$('#selectStartMon').val(clctDtPrevMon);


	    	var dateSrchCk = $("input:checkbox[id=dateSrchCk]").is(":checked") ? true : false;

	   		if (dateSrchCk) {
	   			$('#startSrch').show();
	   			$('#selectStartYear').show();
	   			$('#selectStartMon').show();
	   			$('#startDiv').show();
	   			$('#ringNmLabel').html("*") ;

	   		} else {
	   			$('#startSrch').hide();
	   			$('#selectStartYear').hide();
	   			$('#selectStartMon').hide();
	   			$('#startDiv').hide();
	   			$('#ringNmLabel').html("") ;
	   		}
    	})

    	$('#radioDay').on('click', function(e) {
    		initGrid();
    	})

    	$('#radioWeek').on('click', function(e) {
    		initGrid();
    	})

    	 $('#selectYear').on('change', function(e){
         	initGrid();
         });

         $('#selectMon').on('change', function(e){
         	initGrid();
         });

         $('#selectWeek').on('change', function(e){
         	initGrid();
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
        });

        $(document).on('click', 'input[id=dateSrchCk]', function (e) {
//        $('#').on('click', function(e) {
        	var dateSrchCk = $("input:checkbox[id=dateSrchCk]").is(":checked") ? true : false;
    		if (dateSrchCk) {

    			 var dateRadioId = $('input:radio[name="dateDiv"]:checked')[0].id;

    			 if (dateRadioId =="dateDay" ) {

    				 $('#ringNmLabel').html("*") ;

    				 var setDate = $('#clctDt').val().replace(/-/gi,'');

    				 var clctDtPrevYear = getYear(-2,0,setDate);
    				 var clctDtPrevMon = getMonth(-2,0,setDate);
    				 var clctDtPrevDay = getDay(-2,setDate);

    				 $('#clctDtStart').val(clctDtPrevYear + '-' + clctDtPrevMon + '-' + clctDtPrevDay);

    				 document.getElementById("endSrch").className = 'Enddate Dateinput'

    				 $('#startSrch').show();
    			 } else if (dateRadioId =="dateWeek" ) {
    				 $('#selectStartYear').hide();
    				 $('#selectStartMon').hide();
    				 $('#startDiv').hide();
    				 $('#ringNmLabel').html("") ;


    			 } else if (dateRadioId =="dateMon" ) {

    				 $('#ringNmLabel').html("*") ;
    				 var clctDtPrevYear =  getYear(0,-2,$('#selectYear').val() + $('#selectMon').val() + '01');
    				 var clctDtPrevMon =getMonth(0,-2,$('#selectYear').val() + $('#selectMon').val() + '01');


    				 var startList = document.getElementById("selectYear");

      				 var bCheck = false;

      				 for (var i=0; i<startList.options.length; i++) {
      					 if (startList.options[i].value == clctDtPrevYear ) {
      						bCheck = true;
      						break;
      					 }
      				 }

      				 if (bCheck == true) {
      					$('#selectStartYear').val(clctDtPrevYear);
      					$('#selectStartMon').val(clctDtPrevMon);
      				 } else {
      					$('#selectStartYear').val(startList.options[0].value);
      					$('#selectStartMon').val('01');
      				 }

//    				 $('#selectStartYear').val(clctDtPrevYear);
//    				 $('#selectStartMon').val(clctDtPrevMon);

    				 $('#selectStartYear').show();
    				 $('#selectStartMon').show();

    				 $('#startDiv').show();
    			 }

    		} else {


    			document.getElementById("endSrch").className = 'Enddate NoLimit Dateinput'

				$('#ringNmLabel').html("") ;
				$('#startSrch').hide();
    			$('#selectStartYear').hide();
				$('#selectStartMon').hide();
				$('#startDiv').hide();
    		}
    	});

//        $(document).on('click', 'input[id=woRingCk]', function (e) {
//          	var woRingCk = $("input:checkbox[id=woRingCk]").is(":checked") ? true : false;
//      		if (woRingCk) {
//      			$('#woRingLabel').hide();
//      			$('#woRingCdList').multiselect("checkAll");
//      		} else {
//      			$('#woRingLabel').show();
//      		}
//
//      	});
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

    function getYear(setDay = 0, setMonth = 0, setDate= 0){

    	if (setDate == 0){
    		var vDate = new Date();
    	} else{
    		var vDate = new Date( parseInt(setDate.toString().substring(0,4)),  parseInt(setDate.toString().substring(4,6)) -1, parseInt(setDate.toString().substring(6,8)));
    	}

    	// 기준 월이 없을 경우
    	if (setDay == 0) {
    		vDate.setDate(vDate.getDate());
    	} else {

    		if (setDay.toString()[0] == "-") {
				vDate.setDate(vDate.getDate() - parseInt(setDay.toString().replace("-","")));
			} else {
				vDate.setDate(vDate.getDate() + parseInt(setDay.toString().replace("-","")));
			}
    	}

    	var returnMon;
    	if (setMonth == 0) {
    		returnMon = vDate.getMonth() + 1;
    	} else {

    		if (setMonth.toString()[0] == "-") {
    			vDate.setMonth(vDate.getMonth()  - parseInt(setMonth.toString().replace("-","")));
    			returnMon =  vDate.getMonth() + 1;
			} else {
				vDate.setMonth(vDate.getMonth()  + parseInt(setMonth.toString().replace("-","")));
				returnMon =  vDate.getMonth() + 1;
			}

    	}

    	return  vDate.getFullYear();
    }


    function getMonth(setDay = 0, setMonth = 0, setDate = 0){

    	if (setDate == 0){
    		var vDate = new Date();
    	} else{
    		var vDate = new Date( parseInt(setDate.toString().substring(0,4)),  parseInt(setDate.toString().substring(4,6)) -1, parseInt(setDate.toString().substring(6,8)));
    	}

    	// 기준 월이 없을 경우
    	if (setDay == 0) {
    		vDate.setDate(vDate.getDate());
    	} else {

    		if (setDay.toString()[0] == "-") {
				vDate.setDate(vDate.getDate() - parseInt(setDay.toString().replace("-","")));
			} else {
				vDate.setDate(vDate.getDate() + parseInt(setDay.toString().replace("-","")));
			}
    	}

    	var returnMon;

    	if (setMonth == 0) {
    		returnMon = vDate.getMonth() + 1;
    	} else {

    		if (setMonth.toString()[0] == "-") {
    			vDate.setMonth(vDate.getMonth()  - parseInt(setMonth.toString().replace("-","")));
    			 returnMon =  vDate.getMonth() + 1;
			} else {
				vDate.setMonth(vDate.getMonth()  + parseInt(setMonth.toString().replace("-","")));
				returnMon =  vDate.getMonth() + 1;
			}

    	}

    	return parseInt(returnMon) < 10 ? '0' + returnMon : returnMon;
    }

    function getDay(setDay = 0, setDate = 0){

    	if (setDate == 0){
    		var vDate = new Date();
    	} else{
    		var vDate = new Date( parseInt(setDate.toString().substring(0,4)),  parseInt(setDate.toString().substring(4,6)) -1, parseInt(setDate.toString().substring(6,8)));
    	}

    	// 기준 일이 없을 경우
    	if (setDay == 0) {
    		vDate.setDate(vDate.getDate());
    	} else {
    		if (setDay.toString()[0] == "-") {
				vDate.setDate(vDate.getDate() - parseInt(setDay.toString().replace("-","")));
			} else {
				vDate.setDate(vDate.getDate() + parseInt(setDay.toString().replace("-","")));
			}
    	}

    	var returnDay = vDate.getDate();

    	return parseInt(returnDay) < 10 ? '0' + returnDay : returnDay;
    }


    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.ipBackhaulRingTraffic);
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

	var successCallbackCdList = function(response){
		var option_data =  [];

		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
		}

		$('#woRingCdList').setData({
             data:option_data,
		});
﻿
		$('#woRingCdList').multiselect("checkAll");
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