/**
 * IpBackhaulSuppliesCal.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오후 05:55:00
 * @version 1.0
 */
$a.page(function() {
	var currentDate = new Date();
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	var tmp1 = null;
	var tmp2 = null;
	var tmp3 = null;

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
	    	              {fromIndex:0, toIndex:19, title:""}
	    	             ,{fromIndex:20, toIndex:23, title:"IMM48-1GB-SFP_B"}
	    	             ,{fromIndex:24, toIndex:27, title:"IMM-2PAC_FP3"}
	    	             ,{fromIndex:28, toIndex:39, title:"IOM3_XP"}
	    	             ,{fromIndex:40, toIndex:51, title:"MODULE"}
	    	             ,{fromIndex:52, toIndex:59, title:"FLEXIBLE CARD LINE PLOCESSING UNIT(LPF-51,2 SUB_SLOTS) E"}
	    	             ,{fromIndex:60, toIndex:63, title:"FLEXIBLE CARD LINE PLOCESSING UNIT(LPUF_120)"}
	    	             ,{fromIndex:64, toIndex:71, title:" "}
	    	             ,{fromIndex:72, toIndex:75, title:"공통부"}

                         ,{fromIndex:14, toIndex:16, title:"1G", id:'u0'}
                         ,{fromIndex:17, toIndex:19, title:"10G", id:'u1'}
                         ,{fromIndex:20, toIndex:23, title:"IMM24-1GB-XP-SFP", id:'u2'}
                         ,{fromIndex:24, toIndex:27, title:"P6-10G-SFP", id:'u3'}
                         ,{fromIndex:28, toIndex:31, title:"M12-1GB-XP-SFP", id:'u4'}
                         ,{fromIndex:32, toIndex:35, title:"M2-10GB-XP-XFP", id:'u5'}
                         ,{fromIndex:36, toIndex:39, title:"M4-10GB-XP-XFP", id:'u6'}
                         ,{fromIndex:40, toIndex:43, title:"A9K-MPA-20X1GE", id:'u7'}
                         ,{fromIndex:44, toIndex:47, title:"A9K-MPA-2X10GE", id:'u8'}
                         ,{fromIndex:48, toIndex:51, title:"A9K-MPA-4X10GE", id:'u9'}
                         ,{fromIndex:52, toIndex:55, title:"24-PORT 100/1000BASE-X-SFP FLEXIBLE CARD A(P51-A)", id:'u10'}
                         ,{fromIndex:56, toIndex:59, title:"2-PORT 10GBASE LAN/WAN-SFP+ FLEXIBLE CARD A(P51-A)", id:'u11'}
                         ,{fromIndex:60, toIndex:63, title:"6-PORT 10GBASE LAN/WAN-SFP+ FLEXIBLE CARD A(P120-A)", id:'u12'}
                         ,{fromIndex:64, toIndex:67, title:"CX68L2XEFGF0 0/3", id:'u13'}
                         ,{fromIndex:68, toIndex:71, title:"10-Port 100/1000Base-X-SFP Physical Interface Card(PIC)", id:'u14'}
                         ,{fromIndex:72, toIndex:75, title:"(A,B)", id:'u15'}
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
				width: '90px'
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
    			key : 'i1GPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'i1GPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'i1GUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'i10GPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'i10GPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'i10GUseRate', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'oneCardCnt', align:'right',
				title : '카드수',
				width: '90px'
			}, {
    			key : 'onePortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'onePortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'oneUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'twoCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'twoPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'twoPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'twoUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'thrCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'thrPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'thrPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'thrUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'fouCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'fouPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'fouPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'fouUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'fivCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'fivPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'fivPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'fivUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'sixCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'sixPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'sixPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'sixUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'sevCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'sevPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'sevPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'sevUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'eigCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'eigPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'eigPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'eigUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'ninCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'ninPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'ninPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'ninUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'tenCardCnt', align:'right',
				title : '카드수',
				width: '90px'
			}, {
    			key : 'tenPortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'tenPortUseCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'tenUsePct', align:'right',
				title : '사용률',
				width: '90px'
			}, {
				key : 'eleCardCnt', align:'right',
				title : '카드수',
				width: '90px'
			}, {
    			key : 'elePortCnt', align:'right',
				title : '전체포트수',
				width: '100px'
			}, {
    			key : 'elePortUseCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			}, {
    			key : 'eleUsePct', align:'right',
				title : '사용률',
				width: '90px'
			}, {
				key : 'tweCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'twePortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'twePortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'tweUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'thtCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'thtPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'thtPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'thtUsePct', align:'right',
				title : '사용률',
				width: '80px'
			}, {
				key : 'fotCardCnt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'fotPortCnt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'fotPortUseCnt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'fotUsePct', align:'right',
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
    	param.roleDiv = "L3";

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

        console.log("seartch")
        console.log(param)

    	httpRequest('tango-transmission-biz/trafficintg/systemeng/ipBackhaulSuppliesCal', param, successCallbackSearch, failCallback, 'GET');
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
        });

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
//        	var worker = new ExcelWorker({
//        		excelFileName: 'IP백홀물자산출',
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
//        		merge: true,
//        		exportHidden:false,
//        		useCSSParser: true, // 색상 스타일 그대로 적용
//        		border : true
//        	});

//        	worker.import(function(dataList , $('#'+gridId) ,i){
//        		console.log(i);
//
//        	});
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		//param = gridExcelColumn(param, gridId);
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

    		param.fileName = "IP백홀물자산출";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ipBackhaulSuppliesCal";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/systemeng/excelcreateIpBackhaulSuppliesCal', param, successCallbackExcel, failCallback, 'GET');
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
		var vendorNm = $('#vendNm option:selected').text();

		$('#'+gridId).alopexGrid("hideCol", ['oneCardCnt',
		                                     'onePortCnt',
		                                     'onePortUseCnt',
		                                     'oneUsePct',
		                                     'twoCardCnt',
		                                     'twoPortCnt',
		                                     'twoPortUseCnt',
		                                     'twoUsePct',
		                                     'thrCardCnt',
		                                     'thrPortCnt',
		                                     'thrPortUseCnt',
		                                     'thrUsePct',
		                                     'fouCardCnt',
		                                     'fouPortCnt',
		                                     'fouPortUseCnt',
		                                     'fouUsePct',
		                                     'fivCardCnt',
		                                     'fivPortCnt',
		                                     'fivPortUseCnt',
		                                     'fivUsePct',
		                                     'sixCardCnt',
		                                     'sixPortCnt',
		                                     'sixPortUseCnt',
		                                     'sixUsePct',
		                                     'sevCardCnt',
		                                     'sevPortCnt',
		                                     'sevPortUseCnt',
		                                     'sevUsePct',
		                                     'eigCardCnt',
		                                     'eigPortCnt',
		                                     'eigPortUseCnt',
		                                     'eigUsePct',
		                                     'ninCardCnt',
		                                     'ninPortCnt',
		                                     'ninPortUseCnt',
		                                     'ninUsePct',
		                                     'tenCardCnt',
		                                     'tenPortCnt',
		                                     'tenPortUseCnt',
		                                     'tenUsePct',
		                                     'eleCardCnt',
		                                     'elePortCnt',
		                                     'elePortUseCnt',
		                                     'eleUsePct',
		                                     'tweCardCnt',
		                                     'twePortCnt',
		                                     'twePortUseCnt',
		                                     'tweUsePct',
		                                     'thtCardCnt',
		                                     'thtPortCnt',
		                                     'thtPortUseCnt',
		                                     'thtUsePct',
		                                     'fotCardCnt',
		                                     'fotPortCnt',
		                                     'fotPortUseCnt',
		                                     'fotUsePct'], 'conceal');
		if (vendorNm == 'Alcatel') {
			$('#'+gridId).alopexGrid("showCol", ['oneCardCnt',
			                                     'onePortCnt',
			                                     'onePortUseCnt',
			                                     'oneUsePct',
			                                     'twoCardCnt',
			                                     'twoPortCnt',
			                                     'twoPortUseCnt',
			                                     'twoUsePct',
			                                     'thrCardCnt',
			                                     'thrPortCnt',
			                                     'thrPortUseCnt',
			                                     'thrUsePct',
			                                     'fouCardCnt',
			                                     'fouPortCnt',
			                                     'fouPortUseCnt',
			                                     'fouUsePct',
			                                     'fivCardCnt',
			                                     'fivPortCnt',
			                                     'fivPortUseCnt',
			                                     'fivUsePct',
			                                     'fotCardCnt',
			                                     'fotPortCnt',
			                                     'fotPortUseCnt',
			                                     'fotUsePct']);
		} else if (vendorNm == 'CISCO') {
			$('#'+gridId).alopexGrid("showCol", ['sixCardCnt',
			                                     'sixPortCnt',
			                                     'sixPortUseCnt',
			                                     'sixUsePct',
			                                     'sevCardCnt',
			                                     'sevPortCnt',
			                                     'sevPortUseCnt',
			                                     'sevUsePct',
			                                     'eigCardCnt',
			                                     'eigPortCnt',
			                                     'eigPortUseCnt',
			                                     'eigUsePct']);
		} else if (vendorNm == 'Huawei') {
			$('#'+gridId).alopexGrid("showCol", ['ninCardCnt',
			                         			'ninPortCnt',
			                        			'ninPortUseCnt',
			                        			'ninUsePct',
			                        			'tenCardCnt',
			                        			'tenPortCnt',
			                        			'tenPortUseCnt',
			                        			'tenUsePct',
			                        			'eleCardCnt',
			                        			'elePortCnt',
			                        			'elePortUseCnt',
			                        			'eleUsePct',
			                                     'tweCardCnt',
			                                     'twePortCnt',
			                                     'twePortUseCnt',
			                                     'tweUsePct',
			                                     'thtCardCnt',
			                                     'thtPortCnt',
			                                     'thtPortUseCnt',
			                                     'thtUsePct']);
		} else {
			$('#'+gridId).alopexGrid("showCol", ['oneCardCnt',
			                                     'onePortCnt',
			                                     'onePortUseCnt',
			                                     'oneUsePct',
			                                     'twoCardCnt',
			                                     'twoPortCnt',
			                                     'twoPortUseCnt',
			                                     'twoUsePct',
			                                     'thrCardCnt',
			                                     'thrPortCnt',
			                                     'thrPortUseCnt',
			                                     'thrUsePct',
			                                     'fouCardCnt',
			                                     'fouPortCnt',
			                                     'fouPortUseCnt',
			                                     'fouUsePct',
			                                     'fivCardCnt',
			                                     'fivPortCnt',
			                                     'fivPortUseCnt',
			                                     'fivUsePct',
			                                     'sixCardCnt',
			                                     'sixPortCnt',
			                                     'sixPortUseCnt',
			                                     'sixUsePct',
			                                     'sevCardCnt',
			                                     'sevPortCnt',
			                                     'sevPortUseCnt',
			                                     'sevUsePct',
			                                     'eigCardCnt',
			                                     'eigPortCnt',
			                                     'eigPortUseCnt',
			                                     'eigUsePct',
			                                     'ninCardCnt',
			                                     'ninPortCnt',
			                                     'ninPortUseCnt',
			                                     'ninUsePct',
			                                     'tenCardCnt',
			                                     'tenPortCnt',
			                                     'tenPortUseCnt',
			                                     'tenUsePct',
			                                     'eleCardCnt',
			                                     'elePortCnt',
			                                     'elePortUseCnt',
			                                     'eleUsePct',
			                                     'tweCardCnt',
			                                     'twePortCnt',
			                                     'twePortUseCnt',
			                                     'tweUsePct',
			                                     'thtCardCnt',
			                                     'thtPortCnt',
			                                     'thtPortUseCnt',
			                                     'thtUsePct',
			                                     'fotCardCnt',
			                                     'fotPortCnt',
			                                     'fotPortUseCnt',
			                                     'fotUsePct']);
		}

		var param = {};
		param.roleDiv = "L3";
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
		setSPGrid(gridId,response, response.ipBackhaulSuppliesCal);
	}

	var successCallbackExcel = function(response){
		$('#'+gridId).alopexGrid('hideProgress');



		var serverPageinfo = {
	      		dataLength  : tmp1, 	//총 데이터 길이
	      		current 	: tmp2, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: tmp1 	//한 페이지에 보일 데이터 갯수
	      	};

       	$('#'+gridId).alopexGrid('dataSet', response.map.list, serverPageinfo);
		console.log('excelCreate');
		console.log(response);

    	var worker = new ExcelWorker({
    		excelFileName: 'IP백홀물자산출',
    		defaultPalette : {
    			font : '맑은고딕',
    			fontSize : 11,

    		},
    		sheetList : [{
    			sheetName : 'sheet1',
    			$grid : [$('#'+gridId)]
    		}]
    	});

    	worker.export({
    		merge: true,
    		exportHidden:false,
    		useCSSParser: true, // 색상 스타일 그대로 적용
    		border : true
    	});

		var serverPageinfo = {
	      		dataLength  : tmp1, 	//총 데이터 길이
	      		current 	: tmp2, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: tmp3 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+gridId).alopexGrid('dataSet', response.map.list, serverPageinfo);
//
//
//		var $form=$('<form></form>');
//		$form.attr('name','downloadForm');
//		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
//		$form.attr('method','GET');
//		$form.attr('target','downloadIframe');
//		// 2016-11-인증관련 추가 file 다운로드시 추가필요
//		$form.append(Tango.getFormRemote());
//		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
//		$form.appendTo('body');
//		$form.submit().remove();
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

		tmp1 =Option.pager.totalCnt;
		tmp2 =Option.pager.pageNo;
		tmp3 =Option.pager.rowPerPage;
		console.log(tmp1)
		console.log(tmp2)
		console.log(tmp3)
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
		var headerGrpPosFromHaw = 44;
		var headerGrpPosFromAlc = 30;
		var headerGrpPosFromSis = 38;

		console.log(varVend)
		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id" && gridColmnInfo[i].id.length >1)) {
				if(varVend == 'BP0004379'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >=0 && headerInt <=6  ||  headerInt == 15
					){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						if(headerInt >=0 && headerInt <=1){
							headerGrpPos += headerGrpPosFromHaw+ "," + 3 + ";";
							headerGrpPosFromHaw = (headerGrpPosFromHaw - 3) ;
						}else{
							headerGrpPos += headerGrpPosFromHaw+ "," + 4 + ";";
							headerGrpPosFromHaw = (headerGrpPosFromHaw - 4) ;
						}
						console.log(headerGrpPos)

					}
					if(headerGrpPosFromHaw == 14){
						headerGrpPos += headerGrpPosFromHaw+ "," + 4 + ";";
					}

				}else if(varVend == 'BP0004386'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <= 1 ||
						headerInt >= 7 && headerInt <= 9){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						if(headerInt >=0 && headerInt <=1){
							headerGrpPos += headerGrpPosFromHaw+ "," + 3 + ";";
							headerGrpPosFromHaw = (headerGrpPosFromHaw - 3) ;
						}else{
							headerGrpPos += headerGrpPosFromHaw+ "," + 4 + ";";
							headerGrpPosFromHaw = (headerGrpPosFromHaw - 4) ;
						}

					}
					if(headerGrpPosFromAlc == 14){
						headerGrpPos += headerGrpPosFromAlc+ "," + 4 + ";";
					}

				}else if(varVend == 'BP0004396'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <= 1 ||
					  headerInt >= 10 && headerInt <= 14
					){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						if(headerInt >=0 && headerInt <=1){
							headerGrpPos += headerGrpPosFromHaw+ "," + 3 + ";";
							headerGrpPosFromHaw = (headerGrpPosFromHaw - 3) ;
						}else{
							headerGrpPos += headerGrpPosFromHaw+ "," + 4 + ";";
							headerGrpPosFromHaw = (headerGrpPosFromHaw - 4) ;
						}
					}
					if(headerGrpPosFromSis == 14){
						headerGrpPos += headerGrpPosFromSis+ "," + 4 + ";";
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

		console.log(gridHeader)

		var excelHeaderCd = "";
		var excelHeaderNm = "";

		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id" && gridHeader[i].id.length >1)) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
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



		return param;
	}
});