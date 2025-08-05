/**
 * L2SWSuppliesCal.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오후 05:21:00
 * @version 1.0
 */
$a.page(function() {
	var currentDate = new Date();
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];

	var gridId = 'dataGrid';

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	headerGroup: [
                          {fromIndex:14, toIndex:16, title:"100M", id:'u0'}
                         ,{fromIndex:17, toIndex:19, title:"1G", id:'u1'}
                         ,{fromIndex:20, toIndex:22, title:"2G", id:'u2'}
                         ,{fromIndex:23, toIndex:25, title:"10G", id:'u3'}
                         ],
            paging : {
                     pagerSelect: [100,300,500,1000]
                    ,hidePageList: false  // pager 중앙 삭제
            },
	    	columnMapping: [{
    			key : 'hdofcNm', align:'left',
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
    			key : 'srfcCd', align:'center',
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
    			key : 'mtsoNmErp', align:'left',
				title : '국사명',
				width: '180px'
			}, {
    			key : 'mtsoTyp', align:'left',
				title : '국사유형',
				width: '130px'
			}, {
    			key : 'laraDiv', align:'left',
				title : '권역구분',
				width: '100px'
			}, {
    			key : 'vendor', align:'left',
				title : '제조사',
				width: '130px'
			}, {
    			key : 'model', align:'left',
				title : '장비모델',
				width: '130px'
			}, {
    			key : 'eqpNm', align:'left',
				title : '장비명',
				width: '180px'
			}, {
    			key : 'ip', align:'left',
				title : '장비IP',
				width: '100px'
			}, {
    			key : 'l100MtotPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'l100MusePortCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'l100MuseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'l1GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'l1GusePortCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'l1GuseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'l2GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'l2GusePortCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'l2GuseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'l10GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'l10GusePortCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'l10GuseRate', align:'right',
				title : '사용률',
				width: '80px'
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
    	param.roleDiv = "L2";

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtsos', key: 'mtsoId', label: 'mtsoNm'}
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
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

        param.clctDtYear = clctDtYear;
        param.clctDtMon = clctDtMon;
        param.clctDtDay = clctDtDay;

        param.orgId = selectInit[0].getValue();
		param.teamId = selectInit[1].getValue();
		param.trmsMtsoId = selectInit[2].getValue();
		param.vendCd = selectInit[3].getValue();
        param.mdlCd = selectInit[4].getValue();
        param.eqpNm = $("#eqpNm").val();

    	httpRequest('tango-transmission-biz/trafficintg/systemeng/lTwoSWSuppliesCal', param, successCallbackSearch, failCallback, 'GET');
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

        //장비 입력 시
        $('#eqpNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		return false;
        	}
        })
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

            param.clctDtYear = clctDtYear;
            param.clctDtMon = clctDtMon;
            param.clctDtDay = clctDtDay;

            param.orgId = selectInit[0].getValue();
    		param.teamId = selectInit[1].getValue();
    		param.trmsMtsoId = selectInit[2].getValue();
    		param.vendCd = selectInit[3].getValue();
            param.mdlCd = selectInit[4].getValue();
            param.eqpNm = $("#eqpNm").val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "L2SW물자산출";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "l2SWSuppliesCal";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/systemeng/excelcreateLTwoSWSuppliesCal', param, successCallbackExcel, failCallback, 'GET');
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
    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();

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
		var vendorNm = $('#vendNm option:selected').text();
		if (vendorNm == 'Dasan' || vendorNm == 'extreme networks') {
			$('#'+gridId).alopexGrid("hideCol", ['l2GtotPortCnt', 'l2GusePortCnt', 'l2GuseRate', 'l10GtotPortCnt', 'l10GusePortCnt', 'l10GuseRate'], 'conceal');
		} else {
			$('#'+gridId).alopexGrid("showCol", ['l2GtotPortCnt', 'l2GusePortCnt', 'l2GuseRate', 'l10GtotPortCnt', 'l10GusePortCnt', 'l10GuseRate']);
		}

		var param = {};
		param.roleDiv = "L2";
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
		setSPGrid(gridId,response, response.l2SWSuppliesCal);
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

		param.headerGrpCnt = 1;
		var headerGrpCd = "";
		var headerGrpNm = "";
		var headerGrpPos = "";

		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
				headerGrpCd += gridColmnInfo[i].id + ";";
				headerGrpNm += gridColmnInfo[i].title + ";";
				headerGrpPos += gridColmnInfo[i].fromIndex + "," + (gridColmnInfo[i].toIndex - gridColmnInfo[i].fromIndex + 1) + ";";
			}
		}
		param.headerGrpCd = headerGrpCd;
		param.headerGrpNm = headerGrpNm;
		param.headerGrpPos = headerGrpPos;

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