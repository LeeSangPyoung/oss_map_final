/**
 * SrvcTrafficLkup.js
 *
 * @author 이현우
 * @date 2016. 7. 29. 오후 04:17:00
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'dataGrid';

	var currentDate = new Date();
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth();
	var clctDtYear = currentDate.getFullYear();
	var clctDateYear = currentDate.getFullYear() - 1;

	clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];

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
				key : 'hdofcNm', align:'left',
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
				key : 'eqpDiv', align:'center',
				title : '장비분류',
				width: '120px'
			}, {
				key : 'service', align:'center',
				title : '서비스',
				width: '100px'
			}, {
				key : 'day1', align:'right',
				title : 'D1',
				width: '90px'
			}, {
				key : 'day2', align:'right',
				title : 'D2',
				width: '90px'
			}, {
				key : 'day3', align:'right',
				title : 'D3',
				width: '90px'
			}, {
				key : 'day4', align:'right',
				title : 'D4',
				width: '90px'
			}, {
				key : 'day5', align:'right',
				title : 'D5',
				width: '90px'
			}, {
				key : 'day6', align:'right',
				title : 'D6',
				width: '90px'
			}, {
				key : 'day7', align:'right',
				title : 'D7',
				width: '90px'
			}, {
				key : 'day8', align:'right',
				title : 'D8',
				width: '90px'
			}, {
				key : 'day9', align:'right',
				title : 'D9',
				width: '90px'
			}, {
				key : 'day10', align:'right',
				title : 'D10',
				width: '90px'
			}, {
				key : 'day11', align:'right',
				title : 'D11',
				width: '90px'
			}, {
				key : 'day12', align:'right',
				title : 'D12',
				width: '90px'
			}, {
				key : 'day13', align:'right',
				title : 'D13',
				width: '90px'
			}, {
				key : 'day14', align:'right',
				title : 'D14',
				width: '90px'
			}, {
				key : 'day15', align:'right',
				title : 'D15',
				width: '90px'
			}, {
				key : 'day16', align:'right',
				title : 'D16',
				width: '90px'
			}, {
				key : 'day17', align:'right',
				title : 'D17',
				width: '90px'
			}, {
				key : 'day18', align:'right',
				title : 'D18',
				width: '90px'
			}, {
				key : 'day19', align:'right',
				title : 'D19',
				width: '90px'
			}, {
				key : 'day20', align:'right',
				title : 'D20',
				width: '90px'
			}, {
				key : 'day21', align:'right',
				title : 'D21',
				width: '90px'
			}, {
				key : 'day22', align:'right',
				title : 'D22',
				width: '90px'
			}, {
				key : 'day23', align:'right',
				title : 'D23',
				width: '90px'
			}, {
				key : 'day24', align:'right',
				title : 'D24',
				width: '90px'
			}, {
				key : 'day25', align:'right',
				title : 'D25',
				width: '90px'
			}, {
				key : 'day26', align:'right',
				title : 'D26',
				width: '90px'
			}, {
				key : 'day27', align:'right',
				title : 'D27',
				width: '90px'
			}, {
				key : 'day28', align:'right',
				title : 'D28',
				width: '90px'
			}, {
				key : 'day29', align:'right',
				title : 'D29',
				width: '90px'
			}, {
				key : 'day30', align:'right',
				title : 'D30',
				width: '90px'
			}, {
				key : 'day31', align:'right',
				title : 'D31',
				width: '90px'
			}, {
				key : 'monTraffic', align:'right',
				title : '월대표트래픽(1분,Gb)',
				width: '190px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    columnHide();

	    //기준일자 입력
	    $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

    function columnHide(){
    	if($('#radioHdofc').is(':checked')){
	    	$('#'+gridId).alopexGrid("hideCol", ['teamNm','trmsMtsoNm'], 'conceal');
	    };

	    if(!$('#radioDay').is(':checked')){
	    	$('#'+gridId).alopexGrid("updateColumnMapping", 'clctDt', {width:"1px", resizing:null});

	    	var i = $('#radioMon').is(':checked') ? 12 : 10;	// 월별선택 : i=12 / 년도선택 : i=10
	    	var hide = 'monTraffic';

	    	for(j = i + 1; j <= 31; j++){
	    		hide = hide + "," + 'day' + j;
	    	}

	    	$('#'+gridId).alopexGrid("hideCol", hide, 'conceal');
	    	/*
	    	var z = i == 12 ? parseInt(clctDtYear) - 1 : parseInt(clctDtYear) - 9; // 년도선택 : 10년 전 년도 / 월선택 : 1년 전 년도
	    	var x = i == 12 ? parseInt(clctDtMon) + 1 : '';	// 월 선택 : 월+1 / 년도선택 : ''

	    	for(var k=1; k<=i; k++){
	    		x = parseInt(x) < 10 ? '0' + x : x;

	    		var t = '' + z + (x == '' ? '' : '-') + x + ' (Gb)';

		    	$('#'+gridId).alopexGrid('updateColumn', {title:t}, 'day' + k);

		    	if(x == 12){ // 월 선택이면
		    		z = parseInt(z) + 1;
		    		x = 1;
		    	}else if(x != ''){ // 월선택이면
		    		x = parseInt(x) + 1;
		    	}else if(x == ''){ // 년도선택이면
		    		z = parseInt(z) + 1;
		    	}
		    }
		    */
	    	// (2017-04-25 : HS Kim) 월별 년도별 필드 타이틀 오류 수정
	    	var year = $('#year').val(); //parseInt(clctDtYear);
	    	var mon = $('#mon').val(); //parseInt(clctDtMon);

	    	if ($('#radioMon').is(':checked')) {	//월별
		    	var beginYear = year - 1;
		    	var beginMon = mon == 12 ? 1 : parseInt(mon) + 1;
		    	//alert("radioMon beginYear / beginMon : " + beginYear + " / " + beginMon );
		    	var i, n;
		    	for (i=beginMon, n=1; i < beginMon + 12; i++, n++) {
		    		var m = i % 12;
		    		if (m == 0) m = 12;
		    		else if (m == 1) beginYear += 1;

		    		m = m < 10 ? '0' + m : m;
		    		var t = beginYear + '-' + m + ' (Gb)';
		    		var k = n;

		    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, 'day' + k);
		    	}
	    	}
	    	else {	//년별
	    		var beginYear = year - 9;	// (2017-04-20 : HS Kim) year - 11 => year - 9
	    		//alert("radioMon beginYear : " + beginYear );
		    	var i, n;
		    	for (i=beginYear, n=1; i < year + 1; i++, n++) {
		    		var t = String(i) + ' (Gb)';
		    		var k = n;

		    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, 'day' + k);
		    	}
	    	}

	    }else{
	    	$('#'+gridId).alopexGrid("updateColumnMapping", 'clctDt', {width:"90px", resizing:null});
	    	for(var y = 1; y <= 31; y++){
	    		$('#'+gridId).alopexGrid('updateColumn', {title:y + '일 (Gb)'}, 'day' + y);
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
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtsos', key: 'mtsoId', label: 'mtsoNm'}
 	                      //,{el: '#eqpDiv', url: 'modellcls', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#srvcNm', url: 'srvccds', key: 'comCd', label: 'comCdNm'}
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


        //년도
        $('#year').empty();

        if($('#radioYear').is(':checked')){
        	var currentDate = new Date();

        	var clctDateYear = currentDate.getFullYear() - 1;

        	for(var i=-2; i<2; i++){
	    		$('#year').append($('<option>', {value: parseInt(clctDateYear) + i, text: parseInt(clctDateYear) + i + '년'}));
	    	}

	        $('#year').setSelected(clctDateYear + '년');

        }else{
        	var currentDate = new Date();
        	var clctDtMon = currentDate.getMonth();
        	var clctDtYear = currentDate.getFullYear();

	        for(var i=-3; i<1; i++){
	    		$('#year').append($('<option>', {value: parseInt(clctDtYear) + i, text: parseInt(clctDtYear) + i + '년'}));
	    	}

	        $('#year').setSelected(clctDtYear + '년');
	        $('#mon').setSelected(parseInt(clctDtMon) + '월');
        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();


    	param.clctDateYear = clctDateYear = $('#year').val();
        param.clctDtYear = clctDtYear = $('#year').val();
        //param.clctDtMon = clctDtMon = $('#mon').val();
        param.clctDtMon = $('#radioYear').is(':checked') ? '00' : $('#mon').val();
        param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
        param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
        param.trmsMtsoId = selectInit[2].getValue(); //$('#trmsMtsoNm').val();
        param.eqpDiv = $('#eqpDiv option:selected').text();
        param.service = $('#srvcNm option:selected').text();

        if($('#radioDay').is(':checked')){
        	param.dateDiv = 'day'
        }else if($('#radioMon').is(':checked')){
        	param.dateDiv = 'mon'
        }else{
        	param.dateDiv = 'year'
        }

        if($('#radioHdofc').is(':checked')) {
        	param.mtsoDiv = "n";
        } else {
        	param.mtsoDiv = "y";
        }
        //alert("조회 clctDateYear / service / eqpDiv / orgId / teamId / trmsMtsoId / mtsoDiv : " + param.clctDateYear +" / "+ param.service +" / "+ param.eqpDiv +" / "+ param.orgId +" / "+ param.teamId +" / "+ param.trmsMtsoId +" / "+ param.mtsoDiv);
    	httpRequest('tango-transmission-biz/trafficintg/statistics/srvcTrafficLkup', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	$('#radioDay').on('click', function(e) {
    		setSelectCode()
    		$('#monDiv').show();
    		initGrid();
    	})

    	$('#radioMon').on('click', function(e) {
    		setSelectCode()
    		$('#monDiv').show();
    		initGrid();
    	})

    	$('#radioYear').on('click', function(e) {
    		setSelectCode();
    		$('#monDiv').hide();
    		initGrid();
    	})

    	$('#radioHdofc').on('click', function(e) {
    		initGrid();
    	})

    	$('#radioTrmsMtso').on('click', function(e) {
    		initGrid();
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
        	initGrid();	// (2017-04-25 : HS Kim) 추가
        	setGrid(1, eobjk);
        });

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

    		param.clctDateYear = clctDateYear = $('#year').val();	// (2017-04-25 :  HS Kim) 추가
            param.clctDtYear = clctDtYear = $('#year').val();
            param.clctDtMon = clctDtMon = $('#mon').val();
            param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
            param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
            param.trmsMtsoId = selectInit[2].getValue(); //$('#trmsMtsoNm').val();
            param.eqpDiv = $('#eqpDiv option:selected').text();
            param.service = $('#srvcNm option:selected').text();

            if($('#radioDay').is(':checked')){
            	param.dateDiv = 'day'
            }else if($('#radioMon').is(':checked')){
            	param.dateDiv = 'mon'
            }else{
            	param.dateDiv = 'year'
            }

            if($('#radioHdofc').is(':checked')) {
            	param.mtsoDiv = "n";
            } else {
            	param.mtsoDiv = "y";
            }

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "서비스별트래픽조회";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "srvcTrafficLkup";
    		//alert("Excel clctDateYear / service / eqpDiv / orgId / teamId / trmsMtsoId / mtsoDiv : " + param.clctDateYear +" / "+ param.service +" / "+ param.eqpDiv +" / "+ param.orgId +" / "+ param.teamId +" / "+ param.trmsMtsoId +" / "+ param.mtsoDiv);
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateSrvcTrafficLkup', param, successCallbackExcel, failCallback, 'GET');
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
		setSPGrid(gridId,response, response.srvcTrafficLkup);
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
});