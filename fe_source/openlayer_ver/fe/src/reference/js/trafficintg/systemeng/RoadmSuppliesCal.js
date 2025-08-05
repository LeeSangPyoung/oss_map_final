/**
 * RoadmSuppliesCal.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오후 03:44:00
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
                         {fromIndex:14, toIndex:17, title:"2G5MOTR", id:'u0'}
                         ,{fromIndex:18, toIndex:21, title:"10GOTSC", id:'u1'}
                         ,{fromIndex:22, toIndex:25, title:"40GMUX", id:'u2'}
                         ,{fromIndex:26, toIndex:29, title:"OTNFMOTR", id:'u3'}
                         ,{fromIndex:30, toIndex:33, title:"10GOTNWT", id:'u4'}
                         ,{fromIndex:34, toIndex:37, title:"10GWT", id:'u5'}
                         ,{fromIndex:38, toIndex:41, title:"SMUX", id:'u6'}
                         ,{fromIndex:42, toIndex:45, title:"100GMUX", id:'u7'}
                         ,{fromIndex:46, toIndex:49, title:"2XOSC", id:'u8'}
                         ,{fromIndex:50, toIndex:53, title:"LAxP Card", id:'u9'}
                         ,{fromIndex:54, toIndex:57, title:"I04T40G Card", id:'u10'}
                         ,{fromIndex:58, toIndex:61, title:"O02CSP Card", id:'u11'}
                         ,{fromIndex:62, toIndex:65, title:"I10T100G Card", id:'u12'}
                         ,{fromIndex:66, toIndex:69, title:"LAxl Card", id:'u13'}
                         ,{fromIndex:70, toIndex:73, title:"I05AD10G Card", id:'u14'}
                         ,{fromIndex:74, toIndex:77, title:"LAxB Card", id:'u15'}
                         ,{fromIndex:78, toIndex:81, title:"MCP4 Card", id:'u16'}
                         ,{fromIndex:82, toIndex:85, title:"I08T10G Card", id:'u17'}
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
    			key : 'srfcCd', align:'left',
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
				width: '120px'
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
				width: '130px'
			}, {
    			key : 'r2G5MOTRCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r2G5MOTRtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r2G5MOTRusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r2G5MOTRuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'r10GOTSCCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r10GOTSCtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r10GOTSCusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r10GOTSCuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'r40GMUXCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r40GMUXtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r40GMUXusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r40GMUXuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'rotnfmotrcardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'rotnfmotrtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'rotnfmotrusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'rotnfmotruseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'r10GOTNWTCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r10GOTNWTtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r10GOTNWTusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r10GOTNWTuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'r10GWTCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r10GWTtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r10GWTusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r10GWTuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'rsmuxcardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'rsmuxtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'rsmuxusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'rsmuxuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'r100GMUXCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r100GMUXtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r100GMUXusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r100GMUXuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'r2XOSCCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'r2XOSCtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'r2XOSCusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'r2XOSCuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'laxPCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'laxPtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'laxPusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'laxPuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'i04T40GCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'i04T40GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'i04T40GusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'i04T40GuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'o02CSPCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'o02CSPtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'o02CSPusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'o02CSPuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'i10T100GCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'i10T100GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'i10T100GusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'i10T100GuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'laxlCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'laxltotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'laxlusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'laxluseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'i05AD10GCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'i05AD10GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'i05AD10GusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'i05AD10GuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'laxBCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'laxBtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'laxBusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'laxBuseRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'mcp4CardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'mcp4totPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'mcp4usePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'mcp4useRate', align:'right',
				title : '사용률',
				width: '100px'
			}, {
    			key : 'i08T10GCardCnt', align:'right',
				title : '카드수',
				width: '100px'
			}, {
    			key : 'i08T10GtotPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'i08T10GusePortCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'i08T10GuseRate', align:'right',
				title : '사용률',
				width: '100px'
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

    	param.roleDiv = "ROADM";
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
    	httpRequest('tango-transmission-biz/trafficintg/systemeng/roadmSuppliesCal', param, successCallbackSearch, failCallback, 'GET');
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

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
//        	var worker = new ExcelWorker({
//        		excelFileName: 'ROADM물자산출',
//        		//ㅣ기본적인 글자크기와 글자 선택
//        		defaultPalette : {
//        			font : '맑은고딕',
//        			fontSize : 11,
//
//        		},
//        		sheetList : [{
//        			sheetName : 'sheet1',
//        			$grid : [$('#'+gridId)]
//        		}]
//        	});
//
//        	worker.export({
//        		merge: true, // 그룹화 형식
//        		exportHidden:false, // 숨겨진 컬럼 안보이기
//        		useCSSParser: true, // 색상 스타일 그대로 적용
//        		border : true
//        	});
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

    		param.fileName = "ROADM물자산출";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "roadmSuppliesCal";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/systemeng/excelcreateRoadmSuppliesCal', param, successCallbackExcel, failCallback, 'GET');
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

        $('#eqpNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		return false;
        	}
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

	//제조사 변경시
	function changeVendorNm(){
		var vendorNm = $('#vendNm option:selected').text();

		$('#'+gridId).alopexGrid("hideCol", ['r2G5MOTRCardCnt',
		                                     'r2G5MOTRtotPortCnt',
		                                     'r2G5MOTRusePortCnt',
		                                     'r2G5MOTRuseRate',
		                                     'r10GOTSCCardCnt',
		                                     'r10GOTSCtotPortCnt',
		                                     'r10GOTSCusePortCnt',
		                                     'r10GOTSCuseRate',
		                                     'r40GMUXCardCnt',
		                                     'r40GMUXtotPortCnt',
		                                     'r40GMUXusePortCnt',
		                                     'r40GMUXuseRate',
		                                     'rotnfmotrcardCnt',
		                                     'rotnfmotrtotPortCnt',
		                                     'rotnfmotrusePortCnt',
		                                     'rotnfmotruseRate',
		                                     'r10GOTNWTCardCnt',
		                                     'r10GOTNWTtotPortCnt',
		                                     'r10GOTNWTusePortCnt',
		                                     'r10GOTNWTuseRate',
		                                     'r10GWTCardCnt',
		                                     'r10GWTtotPortCnt',
		                                     'r10GWTusePortCnt',
		                                     'r10GWTuseRate',
		                                     'rsmuxcardCnt',
		                                     'rsmuxtotPortCnt',
		                                     'rsmuxusePortCnt',
		                                     'rsmuxuseRate',
		                                     'r100GMUXCardCnt',
		                                     'r100GMUXtotPortCnt',
		                                     'r100GMUXusePortCnt',
		                                     'r100GMUXuseRate',
		                                     'r2XOSCCardCnt',
		                                     'r2XOSCtotPortCnt',
		                                     'r2XOSCusePortCnt',
		                                     'r2XOSCuseRate',
		                                     'laxPCardCnt',
		                                     'laxPtotPortCnt',
		                                     'laxPusePortCnt',
		                                     'laxPuseRate',
		                                     'i04T40GCardCnt',
		                                     'i04T40GtotPortCnt',
		                                     'i04T40GusePortCnt',
		                                     'i04T40GuseRate',
		                                     'o02CSPCardCnt',
		                                     'o02CSPtotPortCnt',
		                                     'o02CSPusePortCnt',
		                                     'o02CSPuseRate',
		                                     'i10T100GCardCnt',
		                                     'i10T100GtotPortCnt',
		                                     'i10T100GusePortCnt',
		                                     'i10T100GuseRate',
		                                     'laxlCardCnt',
		                                     'laxltotPortCnt',
		                                     'laxlusePortCnt',
		                                     'laxluseRate',
		                                     'i05AD10GCardCnt',
		                                     'i05AD10GtotPortCnt',
		                                     'i05AD10GusePortCnt',
		                                     'i05AD10GuseRate',
		                                     'laxBCardCnt',
		                                     'laxBtotPortCnt',
		                                     'laxBusePortCnt',
		                                     'laxBuseRate',
		                                     'mcp4CardCnt',
		                                     'mcp4totPortCnt',
		                                     'mcp4usePortCnt',
		                                     'mcp4useRate',
		                                     'i08T10GCardCnt',
		                                     'i08T10GtotPortCnt',
		                                     'i08T10GusePortCnt',
		                                     'i08T10GuseRate'], 'conceal');
		if (vendorNm == 'Ciena') {
			/*alert(vendorNm);*/
			$('#'+gridId).alopexGrid("showCol", ['r2G5MOTRCardCnt',
			                                     'r2G5MOTRtotPortCnt',
			                                     'r2G5MOTRusePortCnt',
			                                     'r2G5MOTRuseRate',
			                                     'r10GOTSCCardCnt',
			                                     'r10GOTSCtotPortCnt',
			                                     'r10GOTSCusePortCnt',
			                                     'r10GOTSCuseRate',
			                                     'r40GMUXCardCnt',
			                                     'r40GMUXtotPortCnt',
			                                     'r40GMUXusePortCnt',
			                                     'r40GMUXuseRate',
			                                     'rotnfmotrcardCnt',
			                                     'rotnfmotrtotPortCnt',
			                                     'rotnfmotrusePortCnt',
			                                     'rotnfmotruseRate',
			                                     'r10GOTNWTCardCnt',
			                                     'r10GOTNWTtotPortCnt',
			                                     'r10GOTNWTusePortCnt',
			                                     'r10GOTNWTuseRate',
			                                     'r10GWTCardCnt',
			                                     'r10GWTtotPortCnt',
			                                     'r10GWTusePortCnt',
			                                     'r10GWTuseRate',
			                                     'rsmuxcardCnt',
			                                     'rsmuxtotPortCnt',
			                                     'rsmuxusePortCnt',
			                                     'rsmuxuseRate',
			                                     'r100GMUXCardCnt',
			                                     'r100GMUXtotPortCnt',
			                                     'r100GMUXusePortCnt',
			                                     'r100GMUXuseRate',
			                                     'r2XOSCCardCnt',
			                                     'r2XOSCtotPortCnt',
			                                     'r2XOSCusePortCnt',
			                                     'r2XOSCuseRate']);
		} else if (vendorNm == 'Coriant') {
			$('#'+gridId).alopexGrid("showCol", ['laxPCardCnt',
			                                     'laxPtotPortCnt',
			                                     'laxPusePortCnt',
			                                     'laxPuseRate',
			                                     'i04T40GCardCnt',
			                                     'i04T40GtotPortCnt',
			                                     'i04T40GusePortCnt',
			                                     'i04T40GuseRate',
			                                     'o02CSPCardCnt',
			                                     'o02CSPtotPortCnt',
			                                     'o02CSPusePortCnt',
			                                     'o02CSPuseRate',
			                                     'i10T100GCardCnt',
			                                     'i10T100GtotPortCnt',
			                                     'i10T100GusePortCnt',
			                                     'i10T100GuseRate',
			                                     'laxlCardCnt',
			                                     'laxltotPortCnt',
			                                     'laxlusePortCnt',
			                                     'laxluseRate',
			                                     'i05AD10GCardCnt',
			                                     'i05AD10GtotPortCnt',
			                                     'i05AD10GusePortCnt',
			                                     'i05AD10GuseRate',
			                                     'laxBCardCnt',
			                                     'laxBtotPortCnt',
			                                     'laxBusePortCnt',
			                                     'laxBuseRate',
			                                     'mcp4CardCnt',
			                                     'mcp4totPortCnt',
			                                     'mcp4usePortCnt',
			                                     'mcp4useRate',
			                                     'i08T10GCardCnt',
			                                     'i08T10GtotPortCnt',
			                                     'i08T10GusePortCnt',
			                                     'i08T10GuseRate']);
		} else {
			$('#'+gridId).alopexGrid("showCol", ['r2G5MOTRCardCnt',
			                                     'r2G5MOTRtotPortCnt',
			                                     'r2G5MOTRusePortCnt',
			                                     'r2G5MOTRuseRate',
			                                     'r10GOTSCCardCnt',
			                                     'r10GOTSCtotPortCnt',
			                                     'r10GOTSCusePortCnt',
			                                     'r10GOTSCuseRate',
			                                     'r40GMUXCardCnt',
			                                     'r40GMUXtotPortCnt',
			                                     'r40GMUXusePortCnt',
			                                     'r40GMUXuseRate',
			                                     'rotnfmotrcardCnt',
			                                     'rotnfmotrtotPortCnt',
			                                     'rotnfmotrusePortCnt',
			                                     'rotnfmotruseRate',
			                                     'r10GOTNWTCardCnt',
			                                     'r10GOTNWTtotPortCnt',
			                                     'r10GOTNWTusePortCnt',
			                                     'r10GOTNWTuseRate',
			                                     'r10GWTCardCnt',
			                                     'r10GWTtotPortCnt',
			                                     'r10GWTusePortCnt',
			                                     'r10GWTuseRate',
			                                     'rsmuxcardCnt',
			                                     'rsmuxtotPortCnt',
			                                     'rsmuxusePortCnt',
			                                     'rsmuxuseRate',
			                                     'r100GMUXCardCnt',
			                                     'r100GMUXtotPortCnt',
			                                     'r100GMUXusePortCnt',
			                                     'r100GMUXuseRate',
			                                     'r2XOSCCardCnt',
			                                     'r2XOSCtotPortCnt',
			                                     'r2XOSCusePortCnt',
			                                     'r2XOSCuseRate',
			                                     'laxPCardCnt',
			                                     'laxPtotPortCnt',
			                                     'laxPusePortCnt',
			                                     'laxPuseRate',
			                                     'i04T40GCardCnt',
			                                     'i04T40GtotPortCnt',
			                                     'i04T40GusePortCnt',
			                                     'i04T40GuseRate',
			                                     'o02CSPCardCnt',
			                                     'o02CSPtotPortCnt',
			                                     'o02CSPusePortCnt',
			                                     'o02CSPuseRate',
			                                     'i10T100GCardCnt',
			                                     'i10T100GtotPortCnt',
			                                     'i10T100GusePortCnt',
			                                     'i10T100GuseRate',
			                                     'laxlCardCnt',
			                                     'laxltotPortCnt',
			                                     'laxlusePortCnt',
			                                     'laxluseRate',
			                                     'i05AD10GCardCnt',
			                                     'i05AD10GtotPortCnt',
			                                     'i05AD10GusePortCnt',
			                                     'i05AD10GuseRate',
			                                     'laxBCardCnt',
			                                     'laxBtotPortCnt',
			                                     'laxBusePortCnt',
			                                     'laxBuseRate',
			                                     'mcp4CardCnt',
			                                     'mcp4totPortCnt',
			                                     'mcp4usePortCnt',
			                                     'mcp4useRate',
			                                     'i08T10GCardCnt',
			                                     'i08T10GtotPortCnt',
			                                     'i08T10GusePortCnt',
			                                     'i08T10GuseRate']);
		}

		var param = {};

    	param.vendCd = selectInit[3].getValue();
    	param.roleDiv = "ROADM";
    	if(param.vendCd == 'all')
    		$('#mdlNm').setSelected('전체');
    	else {

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
		setSPGrid(gridId,response, response.roadmSuppliesCal);
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
    	var vendorNm = $('#vendNm option:selected').text();
		param.headerGrpCnt = 1;
		var headerGrpCd = "";
		var headerGrpNm = "";
		var headerGrpPos = "";
		var headerGrpPosFromCie = 46;
		var headerGrpPosFromCor = 46;

		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
				if(vendorNm == 'Ciena'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <=8){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromCie+ "," + 4 + ";";
						headerGrpPosFromCie = (headerGrpPosFromCie - 4) ;
					}
					if(headerGrpPosFromCie == 14){
						headerGrpPos += headerGrpPosFromCie+ "," + 4 + ";";
					}
				}else if(vendorNm == 'Coriant'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 9 && headerInt <= 17){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromCor+ "," + 4 + ";";
						headerGrpPosFromCor = (headerGrpPosFromCor - 4) ;
					}
					if(headerGrpPosFromCor == 14){
						headerGrpPos += headerGrpPosFromCor+ "," + 4 + ";";
					}

				}else{
					headerGrpCd += gridColmnInfo[i].id + ";";
					headerGrpNm += gridColmnInfo[i].title + ";";
					headerGrpPos += gridColmnInfo[i].fromIndex + "," + (gridColmnInfo[i].toIndex - gridColmnInfo[i].fromIndex + 1) + ";";
				}

			}
		}
		param.headerGrpCd = headerGrpCd;
		param.headerGrpNm = headerGrpNm;
		param.headerGrpPos = headerGrpPos;

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
		console.log(gridHeader.length);

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