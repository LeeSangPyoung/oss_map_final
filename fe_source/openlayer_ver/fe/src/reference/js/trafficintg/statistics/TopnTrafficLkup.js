/**
 * TopnTrafficLkup.js
 *
 * @author 이현우
 * @date 2016. 7. 19. 오전 11:03:00
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
        		//pagerSelect: [100,300,500,1000]
               //,hidePageList: false  // pager 중앙 삭제

	    		// (2017-04-24 : HS Kim) paging 삭제
               pagerSelect: false,
		      hidePageList: true
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
				key : 'eqpCl', align:'center',
				title : '장비종류',
				width: '70px'
			}, {
				key : 'eqpMdl', align:'center',
				title : '장비모델',
				width: '120px'
			}, {
				key : 'useRateRank', align:'center',
				title : 'RANK',
				width: '60px'
			}, {
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '180px'
			}, {
				key : 'portNm', align:'left',
				title : '포트명',
				width: '180px'
			}, {
				key : 'speed', align:'right',
				title : '속도',
				width: '60px'
			}, {
				key : 'traffic', align:'right',
				title : 'Traffic(Mb)',
				width: '120px'
			}, {
				key : 'useRate', align:'right',
				title : '사용률(%)',
				width: '80px'
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

    	param.roleDiv = $("#eqpKnd").val();
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
 	                      ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#mdlNm', url: 'modellist', key: 'comCd', label: 'comCdNm'}
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

    	//Top-N
    	$('#topn').empty();
    	$('#topn').append($('<option>', {value: 10, text: '10'}));
    	$('#topn').append($('<option>', {value: 20, text: '20'}));
    	$('#topn').append($('<option>', {value: 30, text: '30'}));
    	$('#topn').append($('<option>', {value: 50, text: '50'}));
    	$('#topn').append($('<option>', {value: 100, text: '100'}));
    	$('#topn').append($('<option>', {value: 200, text: '200'}));
    	$('#topn').setSelected('10');
    	//속도
    	$('#speed').clear();
    	$('#speed').append($('<option>', {value: 'all', text: '전체'}));
    	$('#speed').append($('<option>', {value: '10000000', text: '10M'}));
    	$('#speed').append($('<option>', {value: '100000000', text: '100M'}));
    	$('#speed').append($('<option>', {value: '1000000000', text: '1G'}));
    	$('#speed').append($('<option>', {value: '2000000000', text: '2G'}));
    	$('#speed').append($('<option>', {value: '10000000000', text: '10G'}));
    	$('#speed').setSelected('전체');

    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

    	var date = $('#clctDt').val().replace(/-/gi,'');
    	param.clctDt = date;
        param.clctDtYear = date.substring(0,4);
        param.clctDtMon = date.substring(4,6);
        param.clctDtDay = date.substring(6,8);
        param.orgId = selectInit[0].getValue();
        param.teamId = selectInit[1].getValue();
        param.trmsMtsoId = selectInit[2].getValue();
        param.vendCd = selectInit[3].getValue();
        param.mdlCd = selectInit[4].getValue();
        param.speed = $('#speed').val();
        param.eqpKnd = $('#eqpKnd').val();
        param.useRateRank = $('#topn').val();

    	httpRequest('tango-transmission-biz/trafficintg/statistics/topnTrafficLkup', param, successCallbackSearch, failCallback, 'GET');
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
        	setGrid(1, eObj.perPage);
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

    		var date = $('#clctDt').val().replace(/-/gi,'');

        	param.clctDt = date;
            param.clctDtYear = date.substring(0,4);
            param.clctDtMon = date.substring(4,6);
            param.clctDtDay = date.substring(6,8);
            param.orgId = selectInit[0].getValue();
            param.teamId = selectInit[1].getValue();
            param.trmsMtsoId = selectInit[2].getValue();
            param.vendCd = selectInit[3].getValue();
            param.mdlCd = selectInit[4].getValue();
            param.speed = $('#speed').val();
            param.eqpKnd = $('#eqpKnd').val();
            param.useRateRank = $('#topn').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "Top-N트래픽조회";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "topnTrafficLkup";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateTopnTrafficLkup', param, successCallbackExcel, failCallback, 'GET');
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
        })

        //제조사를 선택했을 경우
        $('#vendNm').on('change', function(e){
        	changeVend();

        })

        //장비종류를 선택했을 경우
        $('#eqpKnd').on('change', function(e){

        	changeEqp();
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
    //eqp change
	function changeEqp(){
		var param = {};

		param.roleDiv = $("#eqpKnd").val();

    	selectInit[3] = Tango.select.init({
    		el: '#vendNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/vendnms',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	selectInit[3].model.get();
	}
    //vend change
	function changeVend(){
		var param = {};

		param.roleDiv = $("#eqpKnd").val();
		param.vendCd = selectInit[3].getValue();

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

    	selectInit[4].model.get();
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
		setSPGrid(gridId,response, response.topnTrafficLkup);
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