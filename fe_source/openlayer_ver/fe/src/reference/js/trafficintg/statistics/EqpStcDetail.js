/**
 * EqpStcDetail.js
 *
 * @author 김현민
 * @date 2016. 7. 8. 오전 10:10:00
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';

	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);

	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

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
				title : '기준일자',
				width: '100px'
			}, {
				key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
				key : 'teamNm', align:'left',
				title : '팀명',
				width: '120px'
			}, {
				key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			}, {
				key : 'eqpTypNm', align:'center',
				title : '장비구분',
				width: '90px'
			}, {
				key : 'vendEnghNm', align:'center',
				title : '제조사',
				width: '90px'
			}, {
				key : 'eqpMdlNm', align:'center',
				title : '장비모델',
				width: '150px'
			}, {
				key : 'cardMdlNm', align:'center',
				title : '카드모델',
				width: '90px'
			}, {
				key : 'cardCnt', align:'right',
				title : '카드수',
				width: '70px'
			}, {
				key : 'portUseCnt', align:'right',
				title : '등록포트',
				width: '80px'
			}, {
				key : 'usePortCnt', align:'right',
				title : '사용포트',
				width: '80px'
			}, {
				key : 'portUseRate', align:'right',
				title : '사용률(%)',
				width: '80px'
			}],
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
    	param.roleDiv = "all";
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm', param:{}}
 	                      //,{el: '#eqpDiv', url: 'eqprole', key: 'comCd', label: 'comCdNm', param:{}}
 	                      ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm', param: {}}
 	                      ,{el: '#mdl', url: 'modellist', key: 'comCd', label: 'comCdNm', param: {comCd: '123'}}
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

        //$('#vendNm').setSelected('전체');
    	$('#mdl').setSelected('전체');

    	//사용률
    	$('#useRate').clear();
    	$('#useRate').append($('<option>', {value: 'all', text: '전체'}));
    	for(var i = 1; i <= 9; i++){
    		$('#useRate').append($('<option>', {value: i * 10, text: i * 10 + '%'}));
    	}
    	$('#useRate').setSelected('전체');

    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

        param.clctDt = $('#clctDt').val().replace(/-/gi,'');
        param.orgId = selectInit[0].getValue();
        param.teamId = selectInit[1].getValue();
        param.trmsMtsoId = selectInit[2].getValue();
        param.vendCd = selectInit[3].getValue();

        param.eqpTypNm = $('#eqpDiv option:selected').text();
//        param.eqpMdlId = $('#mdl').val();
        param.eqpMdlId = selectInit[4].getValue();
        param.useRate = $('#useRate').val();

    	httpRequest('tango-transmission-biz/trafficintg/statistics/eqpStcDetail', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
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
        	setGrid(1, eobjk);
        });

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

            param.clctDt = $('#clctDt').val().replace(/-/gi,'');
            param.orgId = selectInit[0].getValue();
            param.teamId = selectInit[1].getValue();
            param.trmsMtsoId = selectInit[2].getValue();
            param.vendCd = selectInit[3].getValue();

            param.eqpTypNm = $('#eqpDiv option:selected').text();
//            param.eqpMdlId = $('#mdl').val();
            param.eqpMdlId = selectInit[4].getValue();
            param.useRate = $('#useRate').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "장비통계상세";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "eqpStcDetail";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateEqpStcDetail', param, successCallbackExcel, failCallback, 'GET');
         });

        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	clctDtYear = date.year;

            	clctDtMon = date.month < 10 ? '0' + date.month : date.month;
            	clctDtDay = date.day < 10 ? '0' + date.day : date.day;

                $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
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

        //장비군 선택시
        $('#eqpDiv').on('change', function(e){
        	changeEqpDiv();
        });

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

	function changeEqpDiv(){
		var param = {};
    	param.comCd = $('#eqpDiv').val();
    	if ($('#eqpDiv').val() == '20202'){
    		param.roleDiv = "PTS";
    	}else if ($('#eqpDiv').val() == '30201'){
    		param.roleDiv = "L2";
    	}else if ($('#eqpDiv').val() == '30202'){
    		param.roleDiv = "L3";
    	}else if ($('#eqpDiv').val() == '20305'){
    		param.roleDiv = "ROADM";
    	}else if ($('#eqpDiv').val() == 'Ring MUX'){
    		param.roleDiv = "RINGMUX";
    	}

    	selectInit[4] = Tango.select.init({
    		el: '#vendNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/vendnms',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	selectInit[4].model.get({data:param});
	}

	//제조사 변경시
	function changeVendorNm(){
		var param = {};

    	param.vendCd = selectInit[3].getValue();
    	if ($('#eqpDiv').val() == '20202'){
    		param.roleDiv = "PTS";
    	}else if ($('#eqpDiv').val() == '30201'){
    		param.roleDiv = "L2";
    	}else if ($('#eqpDiv').val() == '30202'){
    		param.roleDiv = "L3";
    	}else if ($('#eqpDiv').val() == '20305'){
    		param.roleDiv = "ROADM";
    	}else if ($('#eqpDiv').val() == 'Ring MUX'){
    		param.roleDiv = "RINGMUX";
    	}

    	if(param.vendCd == 'all')
    		$('#mdl').setSelected('전체');
    	else {

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
		setSPGrid(gridId,response, response.eqpStcDetail);
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