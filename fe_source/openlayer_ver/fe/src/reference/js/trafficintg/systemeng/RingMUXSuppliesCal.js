/**
 * RingMUXSuppliesCal.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오후 04:22:00
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
                          {fromIndex:14, toIndex:17, title:"CWDM채널", id:'u0'}
                         ,{fromIndex:18, toIndex:21, title:"DWDM채널", id:'u1'}
                         ,{fromIndex:22, toIndex:25, title:"OT10", id:'u2'}
                         ,{fromIndex:26, toIndex:29, title:"OT3", id:'u3'}
                         ,{fromIndex:30, toIndex:33, title:"CMX41U(OBSAI)", id:'u4'}
                         ,{fromIndex:34, toIndex:37, title:"CT33U(OBSAI)", id:'u5'}
                         ,{fromIndex:38, toIndex:41, title:"E12DU", id:'u6'}
                         ,{fromIndex:42, toIndex:45, title:"MCU", id:'u7'}
                         ,{fromIndex:46, toIndex:49, title:"OTU10G", id:'u8'}
                         ,{fromIndex:50, toIndex:53, title:"OTU3C", id:'u9'}
                         ,{fromIndex:54, toIndex:57, title:"OTU3F", id:'u10'}
                         ,{fromIndex:58, toIndex:61, title:"P04OU", id:'u11'}
                         ,{fromIndex:62, toIndex:65, title:"S02DU", id:'u12'}
                         ,{fromIndex:66, toIndex:69, title:"CPM3", id:'u13'}
                         ,{fromIndex:70, toIndex:73, title:"CPM3_6G", id:'u14'}
                         ,{fromIndex:74, toIndex:77, title:"EIR8", id:'u15'}
                         ,{fromIndex:78, toIndex:81, title:"OSU-R1", id:'u16'}
                         ,{fromIndex:82, toIndex:85, title:"OSU-R2", id:'u17'}
                         ,{fromIndex:86, toIndex:89, title:"SVU_C", id:'u18'}
                         ,{fromIndex:90, toIndex:93, title:"SVU_R", id:'u19'}
                         ,{fromIndex:94, toIndex:97, title:"XCM4", id:'u20'}
                         ,{fromIndex:98, toIndex:101, title:"ATU10F", id:'u21'}
                         ,{fromIndex:102, toIndex:105, title:"ATU3F", id:'u22'}
                         ,{fromIndex:106, toIndex:109, title:"CTU10G", id:'u23'}
                         ,{fromIndex:110, toIndex:113, title:"AMX41U", id:'u24'}
                         ,{fromIndex:114, toIndex:117, title:"AT33U", id:'u25'}
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
    			key : 'cwdmCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'cwdmPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'cwdmPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'cwdmUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'dwdmCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'dwdmPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'dwdmPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'dwdmUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'ot10CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'ot10PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'ot10PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'ot10UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'ot3CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'ot3PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'ot3PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'ot3UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'cmx41uCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'cmx41uPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'cmx41uPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'cmx41uUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'ct33uCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'ct33uPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'ct33uPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'ct33uUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'e12duCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'e12duPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'e12duPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'e12duUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'mcuCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'mcuPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'mcuPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'mcuUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'otu10gCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'otu10gPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'otu10gPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'otu10gUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'otu3cCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'otu3cPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'otu3cPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'otu3cUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'otu3fCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'otu3fPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'otu3fPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'otu3fUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'p04ouCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'p04ouPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'p04ouPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'p04ouUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 's02duCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 's02duPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 's02duPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 's02duUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'cpm3CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'cpm3PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'cpm3PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'cpm3UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'cpm36gCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'cpm36gPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'cpm36gPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'cpm36gUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'eir8CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'eir8PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'eir8PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'eir8UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'osur1CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'osur1PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'osur1PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'osur1UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'osur2CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'osur2PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'osur2PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'osur2UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'svucCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'svucPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'svucPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'svucUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'svurCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'svurPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'svurPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'svurUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'xcm4CardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'xcm4PortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'xcm4PortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'xcm4UseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'atu10fCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'atu10fPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'atu10fPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'atu10fUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'atu3fCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'atu3fPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'atu3fPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'atu3fUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'ctu10gCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'ctu10gPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'ctu10gPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'ctu10gUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'amx41uCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'amx41uPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'amx41uPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'amx41uUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'at33uCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'at33uPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'at33uPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'at33uUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}

			],
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
    	param.roleDiv = "RINGMUX";

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

    	httpRequest('tango-transmission-biz/trafficintg/systemeng/ringMUXSuppliesCal', param, successCallbackSearch, failCallback, 'GET');
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
        	   // UI 화면 상에 있는 모든 데이터를 가져오고 스타일도 가지고옴
//          	var worker = new ExcelWorker({
//        		excelFileName: 'RingMUX물자산출',
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
//

    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

    		//param.clctDt = $('#clctDt').val().replace(/-/gi,'');
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

    		param.fileName = "RingMUX물자산출";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ringMUXSuppliesCal";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/systemeng/excelcreateRingMUXSuppliesCal', param, successCallbackExcel, failCallback, 'GET');
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
        //장비 검색시
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

		$('#'+gridId).alopexGrid("hideCol", ['ot10CardCnt',
		                                     'ot10PortCnt',
		                                     'ot10PortUseCnt',
		                                     'ot10UseRate',
		                                     'ot3CardCnt',
		                                     'ot3PortCnt',
		                                     'ot3PortUseCnt',
		                                     'ot3UseRate',
		                                     'cmx41uCardCnt',
		                                     'cmx41uPortCnt',
		                                     'cmx41uPortUseCnt',
		                                     'cmx41uUseRate',
		                                     'ct33uCardCnt',
		                                     'ct33uPortCnt',
		                                     'ct33uPortUseCnt',
		                                     'ct33uUseRate',
		                                     'e12duCardCnt',
		                                     'e12duPortCnt',
		                                     'e12duPortUseCnt',
		                                     'e12duUseRate',
		                                     'mcuCardCnt',
		                                     'mcuPortCnt',
		                                     'mcuPortUseCnt',
		                                     'mcuUseRate',
		                                     'otu10gCardCnt',
		                                     'otu10gPortCnt',
		                                     'otu10gPortUseCnt',
		                                     'otu10gUseRate',
		                                     'otu3cCardCnt',
		                                     'otu3cPortCnt',
		                                     'otu3cPortUseCnt',
		                                     'otu3cUseRate',
		                                     'otu3fCardCnt',
		                                     'otu3fPortCnt',
		                                     'otu3fPortUseCnt',
		                                     'otu3fUseRate',
		                                     'p04ouCardCnt',
		                                     'p04ouPortCnt',
		                                     'p04ouPortUseCnt',
		                                     'p04ouUseRate',
		                                     's02duCardCnt',
		                                     's02duPortCnt',
		                                     's02duPortUseCnt',
		                                     's02duUseRate',
		                                     'cpm3CardCnt',
		                                     'cpm3PortCnt',
		                                     'cpm3PortUseCnt',
		                                     'cpm3UseRate',
		                                     'cpm36gCardCnt',
		                                     'cpm36gPortCnt',
		                                     'cpm36gPortUseCnt',
		                                     'cpm36gUseRate',
		                                     'eir8CardCnt',
		                                     'eir8PortCnt',
		                                     'eir8PortUseCnt',
		                                     'eir8UseRate',
		                                     'osur1CardCnt',
		                                     'osur1PortCnt',
		                                     'osur1PortUseCnt',
		                                     'osur1UseRate',
		                                     'osur2CardCnt',
		                                     'osur2PortCnt',
		                                     'osur2PortUseCnt',
		                                     'osur2UseRate',
		                                     'svucCardCnt',
		                                     'svucPortCnt',
		                                     'svucPortUseCnt',
		                                     'svucUseRate',
		                                     'svurCardCnt',
		                                     'svurPortCnt',
		                                     'svurPortUseCnt',
		                                     'svurUseRate',
		                                     'xcm4CardCnt',
		                                     'xcm4PortCnt',
		                                     'xcm4PortUseCnt',
		                                     'xcm4UseRate',
		                                     'atu10fCardCnt',
		                                     'atu10fPortCnt',
		                                     'atu10fPortUseCnt',
		                                     'atu10fUseRate',
		                                     'atu3fCardCnt',
		                                     'atu3fPortCnt',
		                                     'atu3fPortUseCnt',
		                                     'atu3fUseRate',
		                                     'ctu10gCardCnt',
		                                     'ctu10gPortCnt',
		                                     'ctu10gPortUseCnt',
		                                     'ctu10gUseRate',
		                                     'amx41uCardCnt',
		                                     'amx41uPortCnt',
		                                     'amx41uPortUseCnt',
		                                     'amx41uUseRate',
		                                     'at33uCardCnt',
		                                     'at33uPortCnt',
		                                     'at33uPortUseCnt',
		                                     'at33uUseRate'], 'conceal');
		if (vendorNm == 'HFR') {
			$('#'+gridId).alopexGrid("showCol", ['e12duCardCnt',
			                                     'e12duPortCnt',
			                                     'e12duPortUseCnt',
			                                     'e12duUseRate',
			                                     'mcuCardCnt',
			                                     'mcuPortCnt',
			                                     'mcuPortUseCnt',
			                                     'mcuUseRate',
			                                     'otu10gCardCnt',
			                                     'otu10gPortCnt',
			                                     'otu10gPortUseCnt',
			                                     'otu10gUseRate',
			                                     'otu3cCardCnt',
			                                     'otu3cPortCnt',
			                                     'otu3cPortUseCnt',
			                                     'otu3cUseRate',
			                                     'otu3fCardCnt',
			                                     'otu3fPortCnt',
			                                     'otu3fPortUseCnt',
			                                     'otu3fUseRate',
			                                     'p04ouCardCnt',
			                                     'p04ouPortCnt',
			                                     'p04ouPortUseCnt',
			                                     'p04ouUseRate',
			                                     's02duCardCnt',
			                                     's02duPortCnt',
			                                     's02duPortUseCnt',
			                                     's02duUseRate',
			                                     'atu10fCardCnt',
			                                     'atu10fPortCnt',
			                                     'atu10fPortUseCnt',
			                                     'atu10fUseRate',
			                                     'atu3fCardCnt',
			                                     'atu3fPortCnt',
			                                     'atu3fPortUseCnt',
			                                     'atu3fUseRate',
			                                     'ctu10gCardCnt',
			                                     'ctu10gPortCnt',
			                                     'ctu10gPortUseCnt',
			                                     'ctu10gUseRate']);
		} else if (vendorNm == '동원') {
			$('#'+gridId).alopexGrid("showCol", ['ot10CardCnt',
			                                     'ot10PortCnt',
			                                     'ot10PortUseCnt',
			                                     'ot10UseRate',
			                                     'ot3CardCnt',
			                                     'ot3PortCnt',
			                                     'ot3PortUseCnt',
			                                     'ot3UseRate']);
		} else if (vendorNm == '솔리테크(주)') {
			$('#'+gridId).alopexGrid("showCol", ['cpm3CardCnt',
			                                     'cpm3PortCnt',
			                                     'cpm3PortUseCnt',
			                                     'cpm3UseRate',
			                                     'cpm36gCardCnt',
			                                     'cpm36gPortCnt',
			                                     'cpm36gPortUseCnt',
			                                     'cpm36gUseRate',
			                                     'eir8CardCnt',
			                                     'eir8PortCnt',
			                                     'eir8PortUseCnt',
			                                     'eir8UseRate',
			                                     'osur1CardCnt',
			                                     'osur1PortCnt',
			                                     'osur1PortUseCnt',
			                                     'osur1UseRate',
			                                     'osur2CardCnt',
			                                     'osur2PortCnt',
			                                     'osur2PortUseCnt',
			                                     'osur2UseRate',
			                                     'svucCardCnt',
			                                     'svucPortCnt',
			                                     'svucPortUseCnt',
			                                     'svucUseRate',
			                                     'svurCardCnt',
			                                     'svurPortCnt',
			                                     'svurPortUseCnt',
			                                     'svurUseRate',
			                                     'xcm4CardCnt',
			                                     'xcm4PortCnt',
			                                     'xcm4PortUseCnt',
			                                     'xcm4UseRate']);
		} else if (vendorNm == '우리넷(주)') {
			$('#'+gridId).alopexGrid("showCol", ['cmx41uCardCnt',
			                                     'cmx41uPortCnt',
			                                     'cmx41uPortUseCnt',
			                                     'cmx41uUseRate',
			                                     'ct33uCardCnt',
			                                     'ct33uPortCnt',
			                                     'ct33uPortUseCnt',
			                                     'ct33uUseRate',
			                                     'amx41uCardCnt',
			                                     'amx41uPortCnt',
			                                     'amx41uPortUseCnt',
			                                     'amx41uUseRate',
			                                     'at33uCardCnt',
			                                     'at33uPortCnt',
			                                     'at33uPortUseCnt',
			                                     'at33uUseRate']);
		} else {
			$('#'+gridId).alopexGrid("showCol", ['ot10CardCnt',
			                                     'ot10PortCnt',
			                                     'ot10PortUseCnt',
			                                     'ot10UseRate',
			                                     'ot3CardCnt',
			                                     'ot3PortCnt',
			                                     'ot3PortUseCnt',
			                                     'ot3UseRate',
			                                     'cmx41uCardCnt',
			                                     'cmx41uPortCnt',
			                                     'cmx41uPortUseCnt',
			                                     'cmx41uUseRate',
			                                     'ct33uCardCnt',
			                                     'ct33uPortCnt',
			                                     'ct33uPortUseCnt',
			                                     'ct33uUseRate',
			                                     'e12duCardCnt',
			                                     'e12duPortCnt',
			                                     'e12duPortUseCnt',
			                                     'e12duUseRate',
			                                     'mcuCardCnt',
			                                     'mcuPortCnt',
			                                     'mcuPortUseCnt',
			                                     'mcuUseRate',
			                                     'otu10gCardCnt',
			                                     'otu10gPortCnt',
			                                     'otu10gPortUseCnt',
			                                     'otu10gUseRate',
			                                     'otu3cCardCnt',
			                                     'otu3cPortCnt',
			                                     'otu3cPortUseCnt',
			                                     'otu3cUseRate',
			                                     'otu3fCardCnt',
			                                     'otu3fPortCnt',
			                                     'otu3fPortUseCnt',
			                                     'otu3fUseRate',
			                                     'p04ouCardCnt',
			                                     'p04ouPortCnt',
			                                     'p04ouPortUseCnt',
			                                     'p04ouUseRate',
			                                     's02duCardCnt',
			                                     's02duPortCnt',
			                                     's02duPortUseCnt',
			                                     's02duUseRate',
			                                     'cpm3CardCnt',
			                                     'cpm3PortCnt',
			                                     'cpm3PortUseCnt',
			                                     'cpm3UseRate',
			                                     'cpm36gCardCnt',
			                                     'cpm36gPortCnt',
			                                     'cpm36gPortUseCnt',
			                                     'cpm36gUseRate',
			                                     'eir8CardCnt',
			                                     'eir8PortCnt',
			                                     'eir8PortUseCnt',
			                                     'eir8UseRate',
			                                     'osur1CardCnt',
			                                     'osur1PortCnt',
			                                     'osur1PortUseCnt',
			                                     'osur1UseRate',
			                                     'osur2CardCnt',
			                                     'osur2PortCnt',
			                                     'osur2PortUseCnt',
			                                     'osur2UseRate',
			                                     'svucCardCnt',
			                                     'svucPortCnt',
			                                     'svucPortUseCnt',
			                                     'svucUseRate',
			                                     'svurCardCnt',
			                                     'svurPortCnt',
			                                     'svurPortUseCnt',
			                                     'svurUseRate',
			                                     'xcm4CardCnt',
			                                     'xcm4PortCnt',
			                                     'xcm4PortUseCnt',
			                                     'xcm4UseRate',
			                                     'atu10fCardCnt',
			                                     'atu10fPortCnt',
			                                     'atu10fPortUseCnt',
			                                     'atu10fUseRate',
			                                     'atu3fCardCnt',
			                                     'atu3fPortCnt',
			                                     'atu3fPortUseCnt',
			                                     'atu3fUseRate',
			                                     'ctu10gCardCnt',
			                                     'ctu10gPortCnt',
			                                     'ctu10gPortUseCnt',
			                                     'ctu10gUseRate',
			                                     'amx41uCardCnt',
			                                     'amx41uPortCnt',
			                                     'amx41uPortUseCnt',
			                                     'amx41uUseRate',
			                                     'at33uCardCnt',
			                                     'at33uPortCnt',
			                                     'at33uPortUseCnt',
			                                     'at33uUseRate']);
		}

		var param = {};
		param.roleDiv = "RINGMUX";
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
		setSPGrid(gridId,response, response.ringMUXSuppliesCal);
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
		var varVend =  selectInit[3].getValue();
		console.log(varVend);
		var headerGrpPosFromHfr = 58;
		var headerGrpPosFromDon = 26;
		var headerGrpPosFromSol = 50;

		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
				if(varVend == 'BP0004395'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <= 1 ||
							headerInt >= 6 && headerInt <= 12 ||
							headerInt >= 21 && headerInt <= 23
					){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromHfr+ "," + 4 + ";";
						headerGrpPosFromHfr = (headerGrpPosFromHfr - 4) ;
					}
					if(headerGrpPosFromHfr == 14){
						headerGrpPos += headerGrpPosFromHfr+ "," + 4 + ";";
					}

				}else if(varVend == 'BP0003755'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt <= 3){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromDon+ "," + 4 + ";";
						headerGrpPosFromDon = (headerGrpPosFromDon - 4) ;
					}
					if(headerGrpPosFromDon == 14){
						headerGrpPos += headerGrpPosFromDon+ "," + 4 + ";";
					}

				}else if(varVend == 'BP0003776'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <= 1  ||
							headerInt >= 13 && headerInt <= 20
					){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromSol+ "," + 4 + ";";
						headerGrpPosFromSol = (headerGrpPosFromSol - 4) ;
					}
					if(headerGrpPosFromSol == 14){
						headerGrpPos += headerGrpPosFromSol+ "," + 4 + ";";
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

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		//var excelHeaderAlign = "";
		//var excelHeaderWidth = "";
		console.log(gridHeader.length)
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				//excelHeaderNm += gridHeader[i].title;
				//excelHeaderNm += ";";
				//excelHeaderAlign += gridHeader[i].align;
				//excelHeaderAlign += ";";
				//excelHeaderWidth += gridHeader[i].width;
				//excelHeaderWidth += ";";
			}
		}

		for(var i=0; i<=13; i++) {
			excelHeaderNm += gridHeader[i].title;
			excelHeaderNm += ";";
		}

		var excelHeaderRepeatCnt = 0;
		var excelHeaderRepeatNm = "";
		for(var i=14; i<gridHeader.length; i++) {
			if (i<=17) {
				excelHeaderRepeatNm += gridHeader[i].title + ";";
			}
			if (i%4 == 0) {
				excelHeaderRepeatCnt++;
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderRepeatCnt = excelHeaderRepeatCnt;
		param.excelHeaderRepeatNm = excelHeaderRepeatNm;
		//param.excelHeaderAlign = excelHeaderAlign;
		//param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}
});