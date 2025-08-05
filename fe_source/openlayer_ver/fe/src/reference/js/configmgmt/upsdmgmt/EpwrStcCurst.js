$a.page(function() {

	var rowPerPageCnt = 15;

	this.init = function(id, param) {
		initGrid();
		//setDate();
		//setSelectCode();

		setGrid(1, rowPerPageCnt);

		var text = $('#EpwrStcCurstForm').getData();
    	Tango.ajax({
			url :  'tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtHeltrCnt', //URL 기존 처럼 사용하시면 됩니다.
			data : '', //data가 존재할 경우 주입
			method : 'GET', //HTTP Method
			flag : 'heltr'
		}).done(successCallback)
		.fail(failCallback);

    	setEventListener();
	};

	function initGrid() {

		$('#rcvgDsbnGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"4row",
			width:"parent",
			pager:false,
			columnMapping: [{
				key : 'div', align:'center',
				title : '구분',
				width: '80px'
			}, {
				key : 'smtsoCnt', align:'center',
				title : '국소 수',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rcvgDsbnGridArea2').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'itrt', align:'center',
				title : '관심',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rcvgDsbnGridArea3').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'bad', align:'center',
				title : '불량',
				width: '80px'
			}, {
				key : 'notInstl', align:'center',
				title : '미설치',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rcvgDsbnGridArea4').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'itrt', align:'center',
				title : '관심',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rcvgDsbnGridArea5').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'itrt', align:'center',
				title : '관심',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#batryGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"3row",
			pager:false,
			columnMapping: [{
				key : 'div', align:'center',
				title : '구분',
				width: '60px'
			}, {
				key : 'shtg', align:'center',
				title : '부족',
				width: '60px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#batryGridArea2').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"4row",
			pager:false,
			columnMapping: [{
				key : 'div', align:'center',
				title : '구분',
				width: '80px'
			}, {
				key : 'cellQuty', align:'center',
				title : 'Cell수량',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#batryGridArea3').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'allCbcnt', align:'center',
				title : '전체조수',
				width: '80px'
			}, {
				key : 'shtgCbcnt', align:'center',
				title : '부족조수',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#batryGridArea4').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'excs', align:'center',
				title : '초과',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rtfGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"4row",
			pager:false,
			columnMapping: [{
				key : 'div', align:'center',
				title : '구분',
				width: '80px'
			}, {
				key : 'quty', align:'center',
				title : '수량',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rtfGridArea2').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'allQuty', align:'center',
				title : '전체수량',
				width: '70px'
			}, {
				key : 'moreQuty', align:'center',
				title : '여유수량',
				width: '70px'
			}, {
				key : 'shtgQuty', align:'center',
				title : '부족수량',
				width: '70px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rtfGridArea3').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'shtg', align:'center',
				title : '부족',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rtfGridArea4').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'shtg', align:'center',
				title : '부족',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#rtfGridArea5').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'fnsh', align:'center',
				title : '완료',
				width: '80px'
			}, {
				key : 'notFnsh', align:'center',
				title : '미완료',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#arcnGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'instl', align:'center',
				title : '설치',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#arcnGridArea2').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'good', align:'center',
				title : '양호',
				width: '80px'
			}, {
				key : 'shtg', align:'center',
				title : '부족',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#arcnGridArea3').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"5row",
			pager:false,
			columnMapping: [{
				key : 'div', align:'center',
				title : '구분',
				width: '80px'
			}, {
				key : 'quty', align:'center',
				title : '수량',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#fextnGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'instl', align:'center',
				title : '설치',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#mntrDevGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'mntr', align:'center',
				title : '감시',
				width: '80px'
			}, {
				key : 'notMntr', align:'center',
				title : '미감시',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#mntrDevGridArea2').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'mntr', align:'center',
				title : '감시',
				width: '80px'
			}, {
				key : 'notMntr', align:'center',
				title : '미감시',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#emgncPwrGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'instl', align:'center',
				title : '설치',
				width: '80px'
			}, {
				key : 'notInstl', align:'center',
				title : '미설치',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#emgncPwrGridArea2').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"1row",
			pager:false,
			columnMapping: [{
				key : 'instl', align:'center',
				title : '설치',
				width: '80px'
			}, {
				key : 'notInstl', align:'center',
				title : '미설치',
				width: '80px'
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });

		$('#evtCurstGridArea1').alopexGrid({
	    	autoColumnIndex: true,
			autoResize: false,
			height:"3row",
			pager:false,
			columnMapping: [{
				key : 'div', align:'center',
				title : '구분',
				width: '80px',
			}, {
				key : 'almCnt', align:'center',
				title : '알람 수',
				width: '80px',
			}],

			data: [{}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
	}

	function popup(popid,title,data ){
		$a.popup({
			popid: popid,
			title: title,
			url: '/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcCurstPopup.do',
			data: data,
			/*iframe: false,*/
			modal: true,
			movable:true,
			/*windowpopup:true,*/
			width : 1150,
			height : 580
		});
	}

	function setEventListener() {

		$('path').on('click', function(e){

			var dataObj = $("#EpwrStcCurstForm").getData();
			dataObj.type = 'Heltr';
			dataObj.gridId = 'HeltrGrid';

			if($(this).attr('fill') == 'rgb(255,111,52)'){
				dataObj.heltr = 'Red';
				dataObj.searchText = 1;
				popup('EpwrStcCurstPop','건강도 [RED]',dataObj)
			}

			if($(this).attr('fill') == 'rgb(246,248,25)'){
				dataObj.heltr = 'Yellow';
				dataObj.searchText = 2;
				popup('EpwrStcCurstPop','건강도 [YELLOW]',dataObj)
			}

			if($(this).attr('fill') == 'rgb(105,205,75)'){
				dataObj.heltr = 'Green';
				dataObj.searchText = 3;
				popup('EpwrStcCurstPop','건강도 [GREEN]',dataObj)
			}
		});


		$('#rcvgDsbnGridArea1').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});
		$('#batryGridArea1').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});
		$('#batryGridArea2').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});
		$('#rtfGridArea1').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});
		$('#arcnGridArea3').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});
		$('#evtCurstGridArea1').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});

		$('.cell.bodycell').on('dblclick', function(e){
			var dataObj = AlopexGrid.parseEvent(e);
			dataObj.gridId = dataObj.$grid[0].id;
			dataObj.cellNo = (dataObj.data._index.column)+1;
			dataObj.rowNo = (dataObj.data._index.row)+1;
			dataObj.type = (dataObj.$grid[0].id).slice(0, -9);
			dataObj.type = capitalize(dataObj.type);

			popup('EpwrStcCurstPop','전력통계 현황',dataObj)
		});
	}

	function capitalize(text) {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	// Grid 조회
    function setGrid(page, rowPerPage) {

    	$('#rcvgDsbnGridArea1').alopexGrid('showProgress');
    	$('#rcvgDsbnGridArea2').alopexGrid('showProgress');
    	$('#rcvgDsbnGridArea3').alopexGrid('showProgress');
    	$('#rcvgDsbnGridArea4').alopexGrid('showProgress');
    	$('#rcvgDsbnGridArea5').alopexGrid('showProgress');
    	$('#batryGridArea1').alopexGrid('showProgress');
    	$('#batryGridArea2').alopexGrid('showProgress');
    	$('#batryGridArea3').alopexGrid('showProgress');
    	$('#batryGridArea4').alopexGrid('showProgress');
    	$('#rtfGridArea1').alopexGrid('showProgress');
    	$('#rtfGridArea2').alopexGrid('showProgress');
    	$('#rtfGridArea3').alopexGrid('showProgress');
    	$('#rtfGridArea4').alopexGrid('showProgress');
    	$('#rtfGridArea5').alopexGrid('showProgress');
    	$('#arcnGridArea1').alopexGrid('showProgress');
    	$('#arcnGridArea2').alopexGrid('showProgress');
    	$('#arcnGridArea3').alopexGrid('showProgress');
    	$('#fextnGridArea1').alopexGrid('showProgress');
    	$('#mntrDevGridArea1').alopexGrid('showProgress');
    	$('#mntrDevGridArea2').alopexGrid('showProgress')/
    	$('#emgncPwrGridArea1').alopexGrid('showProgress');
    	$('#emgncPwrGridArea2').alopexGrid('showProgress');
    	$('#evtCurstGridArea1').alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	Tango.ajax({
			url : 'tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcCurstList',
			method : 'GET'
    	}).done(successCallback)
		  .fail(failCallback);

    }

  //request 성공시
    function successCallback(response, status, jqxhr, flag){

    	var serverPageinfo;

    	if(response.pager != null){
    		serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    	}
    	if(flag == 'heltr'){
    		Highcharts.setOptions({
    			colors:['#50B432', '#DDDF00', '#ED561B']
    		});

    		Highcharts.chart('chartArea1', {

    			chart: {
    				height:210,
    				width:350,

    				plotBackgroundColor: null,
    				plotBorderWidth: null,
    				plotShadow: false,

    				type: 'pie',
    				options3d: {
    					enabled: true,
    					alpha: 45
    				}
    			},

    			title: {
    				text:'[전력 건강도]'

    			},

    			exporting: {enabled: false},

    			tooltip: {

    			},

    			credits: {
    				text: ' ',

    			},

    			plotOptions: {
    				pie: {
    					allowPointSelect : true,
    					cursor: 'pointer',
    					dataLabels: {
    						enabled: true,
    						format:'{point.y}',

    					},

    					innerSize: 70,
    					depth:45
    				}

    			},

    			series: [{
    				name: '건강도',
    				colorByPoint: true,
    				data: [{
    					name: 'Green',
    					y: parseInt(response[0].greenCnt)
    				},
    				{
    					name: 'Yellow',
    					y: parseInt(response[0].yellowCnt)
    				},
    				{
    					name: 'Red',
    					y:parseInt( response[0].redCnt)
    				}]
    			}]
    		});

    		setEventListener();
    	}

    	if (flag != 'heltr') {
    		$('#allMtso').text(response.epwrStcCurstMtsoCntCurstList[0].allMtso);
        	$('#tmof').text(response.epwrStcCurstMtsoCntCurstList[0].tmof);
        	$('#cmtso').text(response.epwrStcCurstMtsoCntCurstList[0].cmtso);
        	$('#bmtso').text(response.epwrStcCurstMtsoCntCurstList[0].bmtso);
        	$('#smtso').text(response.epwrStcCurstMtsoCntCurstList[0].smtso);


	    	$('#rcvgDsbnGridArea1').alopexGrid('hideProgress');
	    	$('#rcvgDsbnGridArea2').alopexGrid('hideProgress');
	    	$('#rcvgDsbnGridArea3').alopexGrid('hideProgress');
	    	$('#rcvgDsbnGridArea4').alopexGrid('hideProgress');
	    	$('#rcvgDsbnGridArea5').alopexGrid('hideProgress');
	    	$('#batryGridArea1').alopexGrid('hideProgress');
	    	$('#batryGridArea2').alopexGrid('hideProgress');
	    	$('#batryGridArea3').alopexGrid('hideProgress');
	    	$('#batryGridArea4').alopexGrid('hideProgress');
	    	$('#rtfGridArea1').alopexGrid('hideProgress');
	    	$('#rtfGridArea2').alopexGrid('hideProgress');
	    	$('#rtfGridArea3').alopexGrid('hideProgress');
	    	$('#rtfGridArea4').alopexGrid('hideProgress');
	    	$('#rtfGridArea5').alopexGrid('hideProgress');
	    	$('#arcnGridArea1').alopexGrid('hideProgress');
	    	$('#arcnGridArea2').alopexGrid('hideProgress');
	    	$('#arcnGridArea3').alopexGrid('hideProgress');
	    	$('#fextnGridArea1').alopexGrid('hideProgress');
	    	$('#mntrDevGridArea1').alopexGrid('hideProgress');
	    	$('#mntrDevGridArea2').alopexGrid('hideProgress');
	    	$('#emgncPwrGridArea1').alopexGrid('hideProgress');
	    	$('#emgncPwrGridArea2').alopexGrid('hideProgress');
	    	$('#evtCurstGridArea1').alopexGrid('hideProgress');

	    	$('#rcvgDsbnGridArea1').alopexGrid('dataSet', response.epwrStcCurstCtrtEpwrCurstList, serverPageinfo);
	    	$('#rcvgDsbnGridArea2').alopexGrid('dataSet', response.epwrStcCurstCbrkCapaCurstList, serverPageinfo);
	    	$('#rcvgDsbnGridArea3').alopexGrid('dataSet', response.epwrStcCurstSpdInstlCurstList, serverPageinfo);
	    	$('#rcvgDsbnGridArea4').alopexGrid('dataSet', response.epwrStcCurstCblCapaCurstList, serverPageinfo);
	    	$('#rcvgDsbnGridArea5').alopexGrid('dataSet', response.epwrStcLoadUbfCurstList, serverPageinfo);
	    	$('#batryGridArea1').alopexGrid('dataSet', response.epwrStcCurstBkTimeShtgCurstList, serverPageinfo);
	    	$('#batryGridArea2').alopexGrid('dataSet', response.epwrStcCurstBatryIntnRstnList, serverPageinfo);
	    	$('#batryGridArea3').alopexGrid('dataSet', response.epwrStcCurstBatryOpCurstList, serverPageinfo);
	    	$('#batryGridArea4').alopexGrid('dataSet', response.epwrStcCurstCblVoltDropList, serverPageinfo);
	    	$('#rtfGridArea1').alopexGrid('dataSet', response.epwrStcCurstRtfCurstList, serverPageinfo);
	    	$('#rtfGridArea2').alopexGrid('dataSet', response.epwrStcCurstMdulOpCurstList, serverPageinfo);
	    	$('#rtfGridArea3').alopexGrid('dataSet', response.epwrStcCurstIpdCbrkCapaList, serverPageinfo);
	    	$('#rtfGridArea4').alopexGrid('dataSet', response.epwrStcCurstMdulShtgSmtsoList, serverPageinfo);
	    	$('#rtfGridArea5').alopexGrid('dataSet', response.epwrStcCurstBrRlesList, serverPageinfo);
	    	$('#arcnGridArea1').alopexGrid('dataSet', response.epwrStcCurstArcnQutyList, serverPageinfo);
	    	$('#arcnGridArea2').alopexGrid('dataSet', response.epwrStcCurstArcnShtgList, serverPageinfo);
	    	$('#arcnGridArea3').alopexGrid('dataSet', response.epwrStcCurstHtmprSoltnList, serverPageinfo);
	    	$('#fextnGridArea1').alopexGrid('dataSet', response.epwrStcCurstFextnQutyList, serverPageinfo);
	    	$('#mntrDevGridArea1').alopexGrid('dataSet', response.epwrStcCurstRtfMntrList, serverPageinfo);
	    	$('#mntrDevGridArea2').alopexGrid('dataSet', response.epwrStcCurstArcnMntrList, serverPageinfo);
	    	$('#emgncPwrGridArea1').alopexGrid('dataSet', response.epwrStcCurstFixdTypGntList, serverPageinfo);
	    	$('#emgncPwrGridArea2').alopexGrid('dataSet', response.epwrStcCurstMovEgrnTmnbxList, serverPageinfo);
	    	$('#evtCurstGridArea1').alopexGrid('dataSet', response.epwrStcCurstAlmCurstList, serverPageinfo);
    	}
    }

    //request 실패시.
    function failCallback(response){

    	$('#rcvgDsbnGridArea1').alopexGrid('hideProgress');
    	$('#rcvgDsbnGridArea2').alopexGrid('hideProgress');
    	$('#rcvgDsbnGridArea3').alopexGrid('hideProgress');
    	$('#rcvgDsbnGridArea4').alopexGrid('hideProgress');
    	$('#rcvgDsbnGridArea5').alopexGrid('hideProgress');
    	$('#batryGridArea1').alopexGrid('hideProgress');
    	$('#batryGridArea2').alopexGrid('hideProgress');
    	$('#batryGridArea3').alopexGrid('hideProgress');
    	$('#batryGridArea4').alopexGrid('hideProgress');
    	$('#rtfGridArea1').alopexGrid('hideProgress');
    	$('#rtfGridArea2').alopexGrid('hideProgress');
    	$('#rtfGridArea3').alopexGrid('hideProgress');
    	$('#rtfGridArea4').alopexGrid('hideProgress');
    	$('#rtfGridArea5').alopexGrid('hideProgress');
    	$('#arcnGridArea1').alopexGrid('hideProgress');
    	$('#arcnGridArea2').alopexGrid('hideProgress');
    	$('#arcnGridArea3').alopexGrid('hideProgress');
    	$('#fextnGridArea1').alopexGrid('hideProgress');
    	$('#mntrDevGridArea1').alopexGrid('hideProgress');
    	$('#mntrDevGridArea2').alopexGrid('hideProgress');
    	$('#emgncPwrGridArea1').alopexGrid('hideProgress');
    	$('#emgncPwrGridArea2').alopexGrid('hideProgress');
    	$('#evtCurstGridArea1').alopexGrid('hideProgress');
    	$a.close();
    }
});