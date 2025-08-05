/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var comMtsoInvt = $a.page(function() {
	var gridIdA 	= 'dataGridA';
	var gridIdLn 	= 'dataGridLn';
	var gridIdT 	= 'dataGridT';
	var gridIdYear 	= 'dataGridYear';
	var paramData = null;

	this.init = function(id, param) {
    	initGrid();
		setEventListener();
		paramData = param;
		$('#mtsoInvtLkupArea').setData(param);

		var srchYear =  $("#srchYear").val();
		param.srchYear = srchYear;
		//setRegDataSet(param);

		$('#'+gridIdYear).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtyear', param, 'GET', 'search');



		$('#'+gridIdA).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvta', param, 'GET', 'mtsoinvta');
		$('#'+gridIdLn).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtln', param, 'GET', 'mtsoinvtln');
		$('#'+gridIdT).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtt', param, 'GET', 'mtsoinvtt');

		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#mtsoInvtLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {
		var d = new Date();
		var maxYear = d.getFullYear() + 1;
		var minYear = d.getFullYear() - 6;
		var option_data = [];
		for(i = maxYear; i > minYear ; i--) {
			var resObj = {cd : i, cdNm : i + "년도"};
			option_data.push(resObj);
		}
		$("#srchYear").clear();
		$("#srchYear").setData({
			data:option_data
		});
		$("#srchYear").val(d.getFullYear().toString());


		var mappingYear =  [
			{ key : 'afeDemdDgr', align:'center', title : 'AFE 차수', width: '70px' },
			{ key : 'totInvtCost', align:'right', title : '총투자', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'eqpInvtCost', align:'right', title : '장비투자', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'eqpCstrCost', align:'right', title : '장비공사', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'lnCstrCost', align:'right', title : '선로공사', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'acsnwMtrlCost', align:'right', title : '물자', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'acsnwIncidCost', align:'right', title : '부대물자', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'acsnwInvtCost', align:'right', title : '투자', width: '75px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} }];
		$('#'+gridIdYear).alopexGrid({
			cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : true,
            pager : false,
            numberingColumnFromZero : false
           ,paging: { pagerTotal:false },
           headerGroup: [
				{fromIndex:2, toIndex:3, title:'T망'},
				{fromIndex:5, toIndex:7, title:'A망'}
				],
             columnMapping : mappingYear
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "5row"
        });


		var mappingA =  [
			{ key : 'acsnwAfeDgr', align:'center', title : 'AFE 구분', width: '80px' },
			{ key : 'srvcNm', align:'left', title : '서비스명', width: '250px' },
    		{ key : 'acsnwSmtsoNm', align:'center', title : 'A망국소명', width: '200px' },
    		{ key : 'cstrTypNm', align:'center', title : '공사유형명', width: '100px' },
    		{ key : 'eqpMeansNm', align:'center', title : '장비방식명', width: '100px' },
    		{ key : 'vendNm', align:'center', title : '제조사명', width: '150px' },
    		{ key : 'eqpTypNm', align:'center', title : '장비유형명', width: '100px' },
    		{ key : 'openDt', align:'center', title : '개통일자', width: '100px' },
    		{ key : 'srvcLclNm', align:'center', title : '서비스대분류명', width: '100px' },
    		{ key : 'srvcMclNm', align:'center', title : '서비스중분류명', width: '100px' },
    		{ key : 'srvcSclNm1', align:'center', title : '서비스소분류명', width: '100px' },
    		{ key : 'acsnwMtrlCost', align:'right', title : 'A망물자비', width: '100px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'acsnwIncidCost', align:'right', title : 'A망부대물자비', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}  },
    		{ key : 'acsnwInvtCost', align:'right', title : 'A망투자비', width: '100px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} } //ACSNWINCIDCOST |ACSNWINVTCOST
    		];
		gridModelA = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvta"
    		,data: {
    	        pageNo: 1,
    	        rowPerPage: 100,
    	    }
        });


		$('#'+gridIdA).alopexGrid({
			cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : true,
            pager : true,
            numberingColumnFromZero : false
           ,paging: { pagerTotal:true },
//           headerGroup: [
//				{fromIndex:2, toIndex:3, title:'T망'},
//				{fromIndex:5, toIndex:7, title:'A망'}
//				],
             columnMapping : mappingA
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "5row"
        });



    	//그리드 생성
        $('#'+gridIdA).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : true,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:true
            }, columnMapping : mappingA
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			//ajax: {model: gridModelA, scroll: true },
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "5row"
        });




        var mappingLn =  [
			{ key : 'afeDemdDgr', align:'center', title : 'AFE 구분', width: '80px' },
			{ key : 'bizNm', align:'left', title : '사업명', width: '200px' },
    		{ key : 'demdBizDivNm', align:'center', title : '수요사업구분', width: '100px' },
    		{ key : 'lnTypNm', align:'center', title : '선로구분', width: '100px' },
    		{ key : 'shpTypNm', align:'center', title : '형상유형', width: '100px' },
    		{ key : 'openYm', align:'center', title : '개통년월', width: '100px' },
    		{ key : 'sctnLen', align:'center', title : '선로길이(Km)', width: '100px' },
    		{ key : 'cstrUprc', align:'right', title : '공사단가', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'cstrCost', align:'right', title : '공사비', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} }];


		gridModelLn = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtln"
    		,data: {
    	        pageNo: 1,
    	        rowPerPage: 100,
    	    }
        });

    	//그리드 생성
        $('#'+gridIdLn).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : true,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:true
            }, columnMapping : mappingLn
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			//ajax: {model: gridModelLn, scroll: true },
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "5row"
        });


        var mappingT =  [
			{ key : 'afeDemdDgr', align:'center', title : 'AFE 구분', width: '80px' },
			{ key : 'bizNm', align:'left', title : '사업명', width: '200px' },
    		{ key : 'demdBizDivNm', align:'center', title : '수요사업구분', width: '100px' },
    		{ key : 'sclDivNm', align:'center', title : '소분류구분', width: '100px' },
    		{ key : 'eqpTypNm', align:'center', title : '장비유형명', width: '100px' },
    		{ key : 'shpTypNm', align:'center', title : '형상유형', width: '100px' },
    		{ key : 'demdEqpMdlNm', align:'center', title : '장비모델', width: '100px' },
    		{ key : 'openYm', align:'center', title : '개통년월', width: '100px' },
    		{ key : 'eqpCstrCost', align:'right', title : '장비공사비', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'eqpEqpCnt', align:'center', title : '장비수', width: '100px' },
    		{ key : 'eqpMtrlUprc', align:'right', title : '장비단가', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'eqpTotCost', align:'right', title : '장비총투자비', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} }];

		gridModelT = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtt"
    		,data: {
    	        pageNo: 1,
    	        rowPerPage: 100,
    	    }
        });

    	//그리드 생성
        $('#'+gridIdT).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : true,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:true
            }, columnMapping : mappingT
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			//ajax: {model: gridModelT, scroll: true },
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "5row"
        });
	}


	this.setGrid = function(page, rowPerPage, gubun){

		var mtsoId =  $("#mtsoId").val();
		var srchYear =  $("#srchYear").val();
		var data = {mtsoId : mtsoId, srchYear : srchYear, pageNo : page, rowPerPage : rowPerPage};

		if (gubun == "A") {
			$('#'+gridIdA).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvta', data, 'GET', 'mtsoinvta');
		} else if (gubun == "L") {
			$('#'+gridIdLn).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtln', data, 'GET', 'mtsoinvtln');
		} else if (gubun == "T") {
			$('#'+gridIdT).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtt', data, 'GET', 'mtsoinvtt');

		}
	}

	function setEventListener() {

		$('#'+gridIdA).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comMtsoInvt.setGrid(eObj.page, eObj.pageinfo.perPage, 'A');
		});

		$('#'+gridIdA).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comMtsoInvt.setGrid(1, eObj.perPage, 'A');
		});

		$('#'+gridIdLn).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comMtsoInvt.setGrid(eObj.page, eObj.pageinfo.perPage, 'L');
		});

		$('#'+gridIdLn).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comMtsoInvt.setGrid(1, eObj.perPage, 'L');
		});

		$('#'+gridIdT).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comMtsoInvt.setGrid(eObj.page, eObj.pageinfo.perPage, 'T');
		});

		$('#'+gridIdT).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comMtsoInvt.setGrid(1, eObj.perPage, 'T');
		});


		$('#srchYear').on('change', function(e) {
			var mtsoId =  $("#mtsoId").val();
			var srchYear =  $("#srchYear").val();
			var data = {mtsoId : mtsoId, srchYear : srchYear, pageNo : '1', rowPerPage : 100};
			$('#'+gridIdYear).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtyear', data, 'GET', 'search');
			$('#'+gridIdA).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvta', data, 'GET', 'mtsoinvta');
			$('#'+gridIdLn).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtln', data, 'GET', 'mtsoinvtln');
			$('#'+gridIdT).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsoinvtt', data, 'GET', 'mtsoinvtt');
			//setRegDataSet(data);
		 });

	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == 'mtsoinvta'){
			$('#'+gridIdA).alopexGrid('hideProgress');
    		$('#'+gridIdA).alopexGrid('dataSet', response.mtsoinvta);
		}
		if(flag == 'mtsoinvtln'){
			$('#'+gridIdLn).alopexGrid('hideProgress');
    		$('#'+gridIdLn).alopexGrid('dataSet', response.mtsoinvtln);
		}
		if(flag == 'mtsoinvtt'){
			$('#'+gridIdT).alopexGrid('hideProgress');
    		$('#'+gridIdT).alopexGrid('dataSet', response.mtsoinvtt);
		}

		if(flag == 'search'){
			$('#'+gridIdYear).alopexGrid('hideProgress');
    		$('#'+gridIdYear).alopexGrid('dataSet', response.mtsoinvtyear);

    		var chartXVal = [];
			var JsonArray = new Array();

			var tmpNm = [];
			$.each(response.mtsoinvtyear, function(i, item){
				var nM = response.mtsoinvtyear[i].afeDemdDgr;
				var conData = {afeDemdDgr : nM};
				tmpNm.push(conData);
			});
			var uniqueNames = [];
			$.each(tmpNm, function(i, el) {
				if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
			});

			for(j = 0; j < uniqueNames.length; j++) {
				var afeDemdDgr = uniqueNames[j].afeDemdDgr;
				//console.log(afeDemdDgr);
				chartXVal.push(afeDemdDgr);
			}
			var tmpData = 0;
			var chartDataA =[];
			var chartDataLn =[];
			var chartDataT =[];
			$.each(response.mtsoinvtyear, function(i, item) {
				var tmpT = parseFloat(response.mtsoinvtyear[i].eqpInvtCost) + parseFloat(response.mtsoinvtyear[i].eqpCstrCost);
				chartDataT.push(tmpT);
				var tmpLn = parseFloat(response.mtsoinvtyear[i].lnCstrCost);
				chartDataLn.push(tmpLn);
				var tmpA = parseFloat(response.mtsoinvtyear[i].acsnwMtrlCost) + parseFloat(response.mtsoinvtyear[i].acsnwIncidCost) + parseFloat(response.mtsoinvtyear[i].acsnwInvtCost);
				chartDataA.push(tmpA);
			});

			var arrData = {name : "T망", data : chartDataT};
			JsonArray.push(arrData);
			var arrData = {name : "선로", data : chartDataLn};
			JsonArray.push(arrData);

			var arrData = {name : "A망", data : chartDataA};
			JsonArray.push(arrData);

			Highcharts.chart('chartContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'center', verticalAlign:'bottom' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
    	}

	}

	function failCallback(response, status, jqxhr, flag){

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