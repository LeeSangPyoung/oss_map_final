/**
 * DuTraffic.js
 *
 * @author 이현우
 * @date 2016. 7. 27. 오후 04:25:00
 * @version 1.0
 */
var main = $a.page(function() {

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
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '90px'
			},{
    			key : 'wkDgr', align:'center',
				title : '주차',
				width: '100px'
			},{
    			key : 'creYm', align:'center',
				title : '월',
				width: '90px'
			},{
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			},{
    			key : 'teamNm', align:'left',
				title : '팀',
				width: '130px'
			},{
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			},{
    			key : 'mtsoTypNm', align:'center',
				title : '국사유형',
				width: '120px'
			},{
    			key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '130px'
			},{
    			key : 'adstNm', align:'center',
				title : '권역구분',
				width: '90px'
			},{
    			key : 'repIntgFcltsCd', align:'center',
				title : '대표통합시설코드',
				width: '130px'
			},{ // (2017-05-29 : HS Kim) 추가 : 건물코드, 건물명
				key : 'bldCd', align:'left',
				title : '건물코드',
				width: '130px'
			},{
    			key : 'intgFcltsCd', align:'left',
				title : '주소',	// addr
				width: '180px'
			},{
    			key : 'bldNm', align:'left',
				title : '건물명',
				width: '130px'
			},{
    			key : 'ptsG10Nm', align:'center',
				title : '10G PTS',
				width: '80px'
			},{
    			key : 'ptsG1Nm', align:'center',
				title : '1G PTS',
				width: '80px'
			},{
    			key : 'eqpTypNm', align:'center',
				title : '구분',
				width: '60px'
			},{
    			key : 'eqpMdlNm', align:'left',
				title : '장비모델',
				width: '130px'
			},{
    			key : 'eqpNm', align:'left',
				title : '장비명',
				width: '200px'
			},{
    			key : 'portNm', align:'left',
				title : '포트명',
				width: '150px'
			},{
    			key : 'portAlsNm', align:'left',
				title : '포트별명',
				width: '130px'
			},{
    			key : 'userDesc', align:'left',
				title : '포트설명',
				width: '150px'
			},{
    			key : 'duIpAddr', align:'left',
				title : 'DU IP',
				width: '100px'
			},{
    			key : 'vlanNo', align:'left',
				title : 'VLAN',
				width: '100px'
			},{
    			key : 'portSpedVal', align:'right',
				title : '속도(Mb)',
				width: '90px'
			},{
    			key : 'mgmtDivCd', align:'center',
				title : '관리',
				width: '60px'
			},{
    			key : 'operDivCd', align:'center',
				title : '운영',
				width: '60px'
			},{
    			key : 'max', align:'center',
				title : 'MAX시(5분)',
				width: '100px'
			},{
    			key : 'maxMb', align:'right',
				title : 'MAX(5분,Mb)',
				width: '100px'
			},{
    			key : 'useRate5', align:'right',
				title : '사용률(5분,%)',
				width: '100px'
			},{
    			key : 'busyHour', align:'center',
				title : '최번시',
				width: '70px'
			},{
    			key : 'busyHourAvg', align:'right',
				title : '최번시평균(Mb)',
				width: '110px'
			},{
    			key : 'useRate', align:'right',
				title : '사용률(%)',
				width: '90px'
			},{
    			key : 'weekTraffic', align:'right',
				title : '주 대표 트래픽(5분,Mb)',
				width: '180px'
			},{
    			key : 'weekTrafficUseRate', align:'right',
				title : '주 대표 트래픽 사용률(%)',
				width: '180px'
			},{
    			key : 'weekMax', align:'center',
				title : '주 MAX시(5분)',
				width: '120px'
			},{
    			key : 'weekMaxMb', align:'right',
				title : '주 MAX(5분,Mb)',
				width: '120px'
			},{
    			key : 'week1', align:'right',
				title : 'WEEK1',
				width: '90px'
			},{
    			key : 'week2', align:'right',
				title : 'WEEK2',
				width: '90px'
			},{
    			key : 'week3', align:'right',
				title : 'WEEK3',
				width: '90px'
			},{
    			key : 'week4', align:'right',
				title : 'WEEK4',
				width: '90px'
			},{
    			key : 'week5', align:'right',
				title : 'WEEK5',
				width: '90px'
			},{
    			key : 'week6', align:'right',
				title : 'WEEK6',
				width: '90px'
			},{
    			key : 'week7', align:'right',
				title : 'WEEK7',
				width: '90px'
			},{
    			key : 'monTraffic', align:'right',
				title : '월 대표 트래픽(5분,Mb)',
				width: '200px'
			},{
    			key : 'mthAvgBpsVal', align:'right',
				title : '월 대표 트래픽(1분,Mb)',
				width: '200px'
			},{
    			key : 'monTrafficUseRate', align:'right',
				title : '월 대표 트래픽 사용률(%)',
				width: '200px'
			},{
    			key : 'monMax', align:'center',
				title : '월MAX시(5분)',
				width: '130px'
			},{
    			key : 'maxBpsVal', align:'right',
				title : '월MAX(5분,Mb)',
				width: '130px'
			},{
    			key : 'preTraffic', align:'right',
				title : '예측트래픽',
				width: '100px'
			},{
    			key : 'day1', align:'right',
				title : '1 일 (Mb)',
				width: '90px'
			},{
    			key : 'day2', align:'right',
				title : '2 일 (Mb)',
				width: '90px'
			},{
    			key : 'day3', align:'right',
				title : '3 일 (Mb)',
				width: '90px'
			},{
    			key : 'day4', align:'right',
				title : '4 일 (Mb)',
				width: '90px'
			},{
    			key : 'day5', align:'right',
				title : '5 일 (Mb)',
				width: '90px'
			},{
    			key : 'day6', align:'right',
				title : '6 일 (Mb)',
				width: '90px'
			},{
    			key : 'day7', align:'right',
				title : '7 일 (Mb)',
				width: '90px'
			},{
    			key : 'day8', align:'right',
				title : '8 일 (Mb)',
				width: '90px'
			},{
    			key : 'day9', align:'right',
				title : '9 일 (Mb)',
				width: '90px'
			},{
    			key : 'day10', align:'right',
				title : '10 일 (Mb)',
				width: '90px'
			},{
    			key : 'day11', align:'right',
				title : '11 일 (Mb)',
				width: '90px'
			},{
    			key : 'day12', align:'right',
				title : '12 일 (Mb)',
				width: '90px'
			},{
    			key : 'day13', align:'right',
				title : '13 일 (Mb)',
				width: '90px'
			},{
    			key : 'day14', align:'right',
				title : '14 일 (Mb)',
				width: '90px'
			},{
    			key : 'day15', align:'right',
				title : '15 일 (Mb)',
				width: '90px'
			},{
    			key : 'day16', align:'right',
				title : '16 일 (Mb)',
				width: '90px'
			},{
    			key : 'day17', align:'right',
				title : '17 일 (Mb)',
				width: '90px'
			},{
    			key : 'day18', align:'right',
				title : '18 일 (Mb)',
				width: '90px'
			},{
    			key : 'day19', align:'right',
				title : '19 일 (Mb)',
				width: '90px'
			},{
    			key : 'day20', align:'right',
				title : '20 일 (Mb)',
				width: '90px'
			},{
    			key : 'day21', align:'right',
				title : '21 일 (Mb)',
				width: '90px'
			},{
    			key : 'day22', align:'right',
				title : '22 일 (Mb)',
				width: '90px'
			},{
    			key : 'day23', align:'right',
				title : '23 일 (Mb)',
				width: '90px'
			},{
    			key : 'day24', align:'right',
				title : '24 일 (Mb)',
				width: '90px'
			},{
    			key : 'day25', align:'right',
				title : '25 일 (Mb)',
				width: '90px'
			},{
    			key : 'day26', align:'right',
				title : '26 일 (Mb)',
				width: '90px'
			},{
    			key : 'day27', align:'right',
				title : '27 일 (Mb)',
				width: '90px'
			},{
    			key : 'day28', align:'right',
				title : '28 일 (Mb)',
				width: '90px'
			},{
    			key : 'day29', align:'right',
				title : '29 일 (Mb)',
				width: '90px'
			},{
    			key : 'day30', align:'right',
				title : '30 일 (Mb)',
				width: '90px'
			},{
    			key : 'day31', align:'right',
				title : '31 일 (Mb)',
				width: '90px'
			},{
    			key : 'week1Mb', align:'right',
				title : '1주 (Mb)',
				width: '100px'
			},{
    			key : 'week2Mb', align:'right',
				title : '2주 (Mb)',
				width: '100px'
			},{
    			key : 'week3Mb', align:'right',
				title : '3주 (Mb)',
				width: '100px'
			},{
    			key : 'week4Mb', align:'right',
				title : '4주 (Mb)',
				width: '100px'
			},{
    			key : 'week5Mb', align:'right',
				title : '5주 (Mb)',
				width: '100px'
			},{
    			key : 'mainEqpIpAddr', align:'left',
				title : '장비IP',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	   	if ($('#dateDay').is(':checked')) {
	    	$('#'+gridId).alopexGrid("hideCol",
	    			[
	    			  'wkDgr','weekTraffic','weekTrafficUseRate','weekMax','weekMaxMb'
	    			 ,'week1','week2','week3','week4','week5','week6','week7'

	    			 ,'maxBpsVal','creYm','monTraffic','monTrafficUseRate','monMax','preTraffic','mthAvgBpsVal'
	    			 ,'day1','day2','day3','day4','day5','day6','day7','day8','day9','day10'
	    			 ,'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20'
	    			 ,'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31'
	    			 ,'week1Mb','week2Mb','week3Mb','week4Mb','week5Mb'
	    			],
	    			 'conceal');
	    }else if($('#dateWeek').is(':checked')){
	    	var oneday = new Date(parseInt($('#selectYear').val()), parseInt($('#selectMon').val()) - 1, 1);
	    	var weekCnt = $('#selectWeek').val();
	    	// (2017-02-13 : HyesunKim) 매월 1일 기준 첫번째 월요일 날짜 구하기
	    	var week1Day = 0;
	    	if (oneday.getDay() == 0) {
	    		week1Day = 2;
	    	}else if (oneday.getDay() == 1){
	    		week1Day = 1;
	    	}else if (oneday.getDay() == 2){
	    		week1Day = 7;
	    	}else if (oneday.getDay() == 3){
	    		week1Day = 6;
	    	}else if (oneday.getDay() == 4){
	    		week1Day = 5;
	    	}else if (oneday.getDay() == 5){
	    		week1Day = 4;
	    	}else if (oneday.getDay() == 6){
	    		week1Day = 3;
	    	}
	    	var weekDay = (weekCnt-1) * 7 + week1Day;	// 주 시작날짜 (2017-02-13 : HyesunKim)
	    	//var weekDay = weekCnt * 7 - (7 - (oneday.getDay() + 1));	// 2016년12월 기준
	    	var weekNm = ['week1','week2','week3','week4','week5','week6','week7'];

	    	for(var i = 1; i <= 7; i++){
	    	    oneday = new Date(parseInt($('#selectYear').val()), parseInt($('#selectMon').val()) - 1, weekDay++);
	    	    var day = oneday.getDate() < 10 ? '0' + oneday.getDate() : oneday.getDate();
	    	    var mon = oneday.getMonth() < 9 ? '0' + (oneday.getMonth() + 1) : (oneday.getMonth() + 1);
	    	    $('#'+gridId).alopexGrid('updateColumn', {title: oneday.getFullYear() + '-' + mon + '-' + day + ' (Mb)'}, weekNm[i - 1]);
	    	}

	    	$('#'+gridId).alopexGrid("hideCol",
	    			[
	    			  'clctDt','max','maxMb','useRate','useRate5','busyHour','busyHourAvg',

	    			 ,'maxBpsVal','creYm','monTraffic','monTrafficUseRate','monMax','preTraffic','mthAvgBpsVal'
	    			 ,'day1','day2','day3','day4','day5','day6','day7','day8','day9','day10'
	    			 ,'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20'
	    			 ,'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31'
	    			 ,'week1Mb','week2Mb','week3Mb','week4Mb','week5Mb'
	    			],
	    			 'conceal');
	    }else if($('#dateMon').is(':checked')){
	    	if($('#radioDay').is(':checked')){
	    		$('#'+gridId).alopexGrid("hideCol",
	    				[
                          'clctDt','max','maxMb','useRate','useRate5','busyHour','busyHourAvg','mthAvgBpsVal'

                         ,'wkDgr','weekTraffic','weekTrafficUseRate','weekMax','weekMaxMb'
    	    			 ,'week1','week2','week3','week4','week5','week6','week7'

    	    			 ,'week1Mb','week2Mb','week3Mb','week4Mb','week5Mb'
	    				],
	    				 'conceal')
	    	}else{
	    		$('#'+gridId).alopexGrid("hideCol",
	    				[
                          'clctDt','max','maxMb','useRate','useRate5','busyHour','busyHourAvg','monTraffic',

                         ,'wkDgr','weekTraffic','weekTrafficUseRate','weekMax','weekMaxMb'
    	    			 ,'week1','week2','week3','week4','week5','week6','week7'

    	    			 ,'day1','day2','day3','day4','day5','day6','day7','day8','day9','day10'
    	    			 ,'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20'
    	    			 ,'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31'
	    				],
	    				 'conceal')
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
    	param.roleDiv = "L2";

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
 	                      ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#mdlNm', url: 'modellist', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#mtsoTyp', url: 'mtsotypcds', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#adstNm', url: 'adsts', key: 'comCd', label: 'comCdNm'}
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
    	$('#useRate').append($('<option>', {value: 'all', text:'전체'}));
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

    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsMtsoId = selectInit[2].getValue();
    	//param.MtsoNm = $('#mtsoNm').val();

    	param.vendCd = selectInit[3].getValue();
    	param.eqpMdlId = selectInit[4].getValue();

    	param.adstNm = selectInit[6].getValue();

    	if(param.adstNm != 'all') {
    		param.adstNm = selectInit[6].getText();
    	}


    	param.useRate = $('#useRate').val();

    	param.mtsoTypCd = $('#mtsoTyp').val();

        param.clctDtYear = clctDtYear = $('#dateDay').is(':checked') ? date.substring(0,4) : $('#selectYear').val();
        param.clctDtMon = clctDtMon = $('#dateDay').is(':checked') ? date.substring(4,6) : $('#selectMon').val();
        param.clctDtDay = clctDtDay = $('#dateDay').is(':checked') ? date.substring(6,8) : '';
        //param.clctDtWeek = $('#selectWeek').val();
        param.mthStdWkDgr = $('#selectWeek').val();

        param.mtrmsMtsoNm = $('#mtsoNm').val();
        param.eqpNm = $('#eqpNm').val();

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

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/lTwoSWTraffic', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	// Test Code
    	$('#btn').on('click',function(e){
    		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
    		var parameter = $("#searchForm").getData();

    		if($('#dateDay').is(':checked')){
    			parameter.dateDiv = 'day';
            }else if($('#dateWeek').is(':checked')){
            	parameter.dateDiv = 'week';
            }else if($('#dateMon').is(':checked')){
            	if($('#radioDay').is(':checked')){
            		parameter.dateDiv = 'mon';
            	}else{
            		parameter.dateDiv = 'monweek';
            	}
            }

    		parameter.search1 = 'day';

    		parameter.search2 = $('#clctDt').val().replace(/-/gi,'');
    		parameter.search3 = '' + $.map(data, function(d, idx){return d.eqpId});
    		parameter.search4 = '' + $.map(data, function(d, idx){return d.portId});

    		if(parameter.search2 == '' && parameter.search3 == '' && parameter.search4 == '')
    		    return

    		httpRequest('tango-transmission-biz/trafficintg/trafficchart/lTwoSWTraffic', parameter, successCallbackPopup, failCallback, 'GET');
    	});

    	$('#dateDay').on('click', function(e) {

    		$('#dayDiv').show();
    		$('#weekDiv').hide();

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
    		$('#selectWeek').show();
    		$('#spanDay').hide();
    		$('#spanWeek').hide();
    		$('#radioDay').hide();
    		$('#radioWeek').hide();

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
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
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

    	$('#mtsoNm').keydown(function(e){
    		if(e.keyCode == 13){
    			setGrid(1,eobjk);
    		}
    	})

    	$('#eqpNm').keydown(function(e){
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
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

    		var date = $('#clctDt').val().replace(/-/gi,'');

        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();
        	//param.MtsoNm = $('#mtsoNm').val();

        	param.vendCd = selectInit[3].getValue();
        	param.eqpMdlId = selectInit[4].getValue();

        	param.adstNm = selectInit[6].getValue();

        	if(param.adstNm != 'all') {
        		param.adstNm = selectInit[6].getText();
        	}

        	param.useRate = $('#useRate').val();

        	param.mtsoTypCd = $('#mtsoTyp').val();

            param.clctDtYear = clctDtYear = $('#dateDay').is(':checked') ? date.substring(0,4) : $('#selectYear').val();
            param.clctDtMon = clctDtMon = $('#dateDay').is(':checked') ? date.substring(4,6) : $('#selectMon').val();
            param.clctDtDay = clctDtDay = $('#dateDay').is(':checked') ? date.substring(6,8) : '';
            //param.clctDtWeek = $('#selectWeek').val();
            param.mthStdWkDgr = $('#selectWeek').val();

            param.mtrmsMtsoNm = $('#mtsoNm').val();
            param.eqpNm = $('#eqpNm').val();

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
    		param.method = "l2SWTraffic";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-09 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "L2SWTraffic" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "L2SWTraffic";     // 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;
    		// (2017-03-09 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "L2SW대표트래픽";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreateLTwoSWTraffic', param, successCallbackExcel, failCallback, 'GET');
 	    	// (2017-03-09 : HS Kim) OnDemand 엑셀배치 추가
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
    	param.roleDiv = "L2";

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
		setSPGrid(gridId,response, response.l2SWTraffic);
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
		param.pageNo = 1;
		param.rowPerPage = 100;

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

    // Test Code
    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		windowpopup: true,
    		modal: true,
    		movable:true,
    		width : 960,
    		height : 629
    	});
    }

    // Test Code
	var successCallbackPopup = function(response){
		xCat = [];
		for(var i = 0; i < response.chartPage.length; i++){
			var t = response.chartPage[i].data1;
			xCat.push(t.substring(0,4) + '-' + t.substring(4,6) + '-' + t.substring(6,8));
		}

		yCat = [];
		yDataNm = ['포트속도','MAX시(5분,Mb)','최번시평균(Mb)'];
		for(var i = 0; i < yDataNm.length; i++){
			var yData = [];

			for(var j = 0; j < response.chartPage.length; j++){
				switch (i) {
				    case 0 : yData.push(parseFloat(response.chartPage[j].data2));
				             break;
				    case 1 : yData.push(parseFloat(response.chartPage[j].data3));
				             break;
				    case 2 : yData.push(parseFloat(response.chartPage[j].data4));
				             break;
				}
			}

			yCat.push({name : yDataNm[i],
				       data : yData});
		}

		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});

		var paraData = {chartType:'spline',
				        xCategori:xCat,
	                    yCategori:yCat,
	                    title:'L2 S/W Traffic',
	                    subTitle:'',
	                    valueSuffic:'(Mb)',
	                    yTitle:'Byte',
	                    search1: 'day',
	                    search2: $('#clctDt').val().replace(/-/gi,''),
	                    search3: '' + $.map(data, function(d, idx){return d.eqpId}),
	                    search4: '' + $.map(data, function(d, idx){return d.portId}),
	            		orgNm: '' + $.map(data, function(d, idx){return d.orgNm}),
	            		teamNm: '' + $.map(data, function(d, idx){return d.teamNm}),
	            		trmsMtsoNm: '' + $.map(data, function(d, idx){return d.trmsMtsoNm}),
	                    url:'tango-transmission-biz/trafficintg/trafficchart/lTwoSWTraffic'
	                    };

        popup('chart_page', 'chart_page.do', 'Chart', paraData);
	}
});