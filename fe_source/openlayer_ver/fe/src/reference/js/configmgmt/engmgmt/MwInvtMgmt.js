/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var excelGridId = 'dataGridExcel';
	var afeYrData = [];
	var afeDgrData = [];
	var html = "";

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();
    	initGrid('');
    	initGrid('A','dataGridExcel');		// 엑셀 다운 그리드 초기 세팅
    	setRegDataSet(param);
        setEventListener();
        $('#dataGridExcel').hide();
    };

    function setRegDataSet(data) {

    	 $('#btnMwIvntMgmtDel').setEnabled(false);
    }

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }
		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

		 var requestParam = { comGrpCd : 'C00623' };
    	 httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/', requestParam, 'GET', 'org');
    	 // 년도/차수
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/AFEYRDGR', null, 'GET', 'afeYrDgrList');
    }

  //Grid 초기화
    function initGrid(strGubun, gridIdGubun) {

    	if (strGubun == "W") {		//무선구간정보조회
    		var headerMappingN =  [{fromIndex:2, toIndex:3, title:"년도/차수", id:'u0'}
    										,{fromIndex:4, toIndex:5, title:"구분", id:'u1'}
											,{fromIndex:6, toIndex:7, title:"구간", id:'u2'}
											,{fromIndex:8, toIndex:13, title:"무선구간(운용중)", id:'u3'}
											,{fromIndex:14, toIndex:15, title:"설계 투자비", id:'u4'}
											,{fromIndex:16, toIndex:17, title:"실제 투자비", id:'u5', headerStyleclass: "green"}
											,{fromIndex:18, toIndex:19, title:"트래픽", id:'u5', headerStyleclass: "yellow"}
											,{fromIndex:20, toIndex:21, title:"잔여채널현황파악", id:'u7', headerStyleclass: "yellow"}
											,{fromIndex:22, toIndex:26, title:"설계안", id:'u8', headerStyleclass: "green"}];

			var mappingN =  [{align:'center', title : 'mwSrno', key: 'mwSrno', width: '50px'},
									{key : 'rowNo', align:'center', title : 'NO.', width: '50px'},

									{key : 'afeYr', align:'center', title : '년도', width: '60px'},
									{key : 'afeDgr', align:'center', title : '차수', width: '60px'},

									{key : 'hdofcNm', align:'center', title : '본부', width: '60px'},
									{key : 'ntwkLineNm', align:'center', title : '도서지역', width: '120px'},

									{key : 'umtsoNm', align:'center', title : '상위국', width: '100px'},
									{key : 'lmtsoNm', align:'center', title : '하위국', width: '100px'},

									{key : 'sctnDistk', align:'center', title : '구간거리(Km)', width: '90px'},
									{key : 'mwFreqVal', align:'center', title : '주파수(Ghz)', width: '80px'},
									{key : 'chnlCnt', align:'center', title : '채널 수', width: '80px'},
									{key : 'modulMeansVal', align:'center', title : '변조방식', width: '80px'},
									{key : 'mwBdwhCdVal', align:'center', title : '대역폭', width: '80px'},
									{key : 'ntwkCapaVal', align:'center', title : '용량(Mbit/s)', width: '80px'},

									{key : 'dsnMtrlCostAmt', align:'center', title : '물자비', width: '80px'},
									{key : 'dsnInvtCostAmt', align:'center', title : '공사비', width: '80px'},

									{key : 'realMtrlCostAmt', align:'center', title : '물자비', width: '80px', headerStyleclass: "green"},
									{key : 'realInvtCostAmt', align:'center', title : '공사비', width: '80px', headerStyleclass: "green"},

									{key : 'trfAvgVal', align:'center', title : '평균 트래픽', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},
									{key : 'trfUseRateVal', align:'center', title : '사용율', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},

									{key : 'cmptrPossCnt', align:'center', title : '경쟁사점유', width: '80px', headerStyleclass: "yellow"},
									{key : 'remChnlCnt', align:'center', title : '잔여채널', width: '80px', headerStyleclass: "yellow"},

									{key : 'dsnDivNm', align:'center', title : '구분', width: '80px', headerStyleclass: "green"},
									{key : 'chnlScreVal', align:'center', title : '채널확보', width: '80px', headerStyleclass: "green"},
									{key : 'capaIcreChnlVal', align:'center', title : '채널 수', width: '80px', headerStyleclass: "green"},
									{key : 'capaScreVal', align:'center', title : '확보용량(Mbit/s)', width: '90px', headerStyleclass: "green"},
									{key : 'prvdNm', align:'center', title : '공급사', width: '80px', headerStyleclass: "green"}];
    	}
    	else if (strGubun == "D") {		// 상세정보보기
    		var headerMappingN =  [{fromIndex:2, toIndex:3, title:"년도/차수", id:'u0'}
    										,{fromIndex:4, toIndex:5, title:"구분", id:'u1'}
								            ,{fromIndex:6, toIndex:7, title:"구간", id:'u2'}
											,{fromIndex:8, toIndex:8, title:"무선구간(운용중)", id:'u3'}
											,{fromIndex:9, toIndex:10, title:"설계 투자비", id:'u4'}
											,{fromIndex:11, toIndex:12, title:"실제 투자비", id:'u5', headerStyleclass: "green"}
											,{fromIndex:13, toIndex:14, title:"트래픽", id:'u6', headerStyleclass: "yellow"}
											,{fromIndex:15, toIndex:16, title:"내용", id:'u7', headerStyleclass: "yellow"}
											,{fromIndex:17, toIndex:18, title:"잔여채널현황파악", id:'u8', headerStyleclass: "yellow"}
											,{fromIndex:19, toIndex:23, title:"설계안", id:'u9', headerStyleclass: "green"}];

			var mappingN =  [{align:'center', title : 'mwSrno', key: 'mwSrno', width: '50px'},
									{key : 'rowNo', align:'center', title : 'NO.', width: '50px'},

									{key : 'afeYr', align:'center', title : '년도', width: '60px'},
									{key : 'afeDgr', align:'center', title : '차수', width: '60px'},

									{key : 'hdofcNm', align:'center', title : '본부', width: '60px'},
									{key : 'ntwkLineNm', align:'center', title : '도서지역', width: '120px'},

									{key : 'umtsoNm', align:'center', title : '상위국', width: '100px'},
									{key : 'lmtsoNm', align:'center', title : '하위국', width: '100px'},

									{key : 'ntwkCapaVal', align:'center', title : '용량(Mbit/s)', width: '80px'},

									{key : 'dsnMtrlCostAmt', align:'center', title : '물자비', width: '80px'},
									{key : 'dsnInvtCostAmt', align:'center', title : '공사비', width: '80px'},

									{key : 'realMtrlCostAmt', align:'center', title : '물자비', width: '80px', headerStyleclass: "green"},
									{key : 'realInvtCostAmt', align:'center', title : '공사비', width: '80px', headerStyleclass: "green"},

									{key : 'trfAvgVal', align:'center', title : '평균 트래픽', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},
									{key : 'trfUseRateVal', align:'center', title : '사용율', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},

									{key : 'spclMtrCttVal', align:'left', title : '구분', width: '150px', headerStyleclass: "yellow", styleclass : "line-break"},
									{key : 'rmk', align:'left', title : '비고', width: '350px', headerStyleclass: "yellow", styleclass : "line-break"},

									{key : 'cmptrPossCnt', align:'center', title : '경쟁사점유', width: '80px', headerStyleclass: "yellow"},
									{key : 'remChnlCnt', align:'center', title : '잔여채널', width: '80px', headerStyleclass: "yellow"},

									{key : 'dsnDivNm', align:'center', title : '구분', width: '80px', headerStyleclass: "green"},
									{key : 'chnlScreVal', align:'center', title : '채널확보', width: '80px', headerStyleclass: "green"},
									{key : 'capaIcreChnlVal', align:'center', title : '채널 수', width: '80px', headerStyleclass: "green"},
									{key : 'capaScreVal', align:'center', title : '확보용량(Mbit/s)', width: '90px', headerStyleclass: "green"},
									{key : 'prvdNm', align:'center', title : '공급사', width: '80px', headerStyleclass: "green"}];
    	}
    	else if (strGubun == "A") {		// 전제 선택
    		var headerMappingN =  [{fromIndex:2, toIndex:3, title:"년도/차수", id:'u0'}
    										,{fromIndex:4, toIndex:5, title:"구분", id:'u1'}
								            ,{fromIndex:6, toIndex:7, title:"구간", id:'u2'}
											,{fromIndex:8, toIndex:13, title:"무선구간(운용중)", id:'u3'}
											,{fromIndex:14, toIndex:15, title:"설계 투자비", id:'u4'}
											,{fromIndex:16, toIndex:17, title:"실제 투자비", id:'u5', headerStyleclass: "green"}
											,{fromIndex:18, toIndex:19, title:"트래픽", id:'u6', headerStyleclass: "yellow"}
											,{fromIndex:20, toIndex:21, title:"내용", id:'u7', headerStyleclass: "yellow"}
											,{fromIndex:22, toIndex:23, title:"잔여채널현황파악", id:'u8', headerStyleclass: "yellow"}
											,{fromIndex:24, toIndex:28, title:"설계안", id:'u9', headerStyleclass: "green"}];

    		var mappingN =  [{align:'center', title : 'mwSrno', key: 'mwSrno', width: '50px'},
									{key : 'rowNo', align:'center', title : 'NO.', width: '50px'},

									{key : 'afeYr', align:'center', title : '년도', width: '60px'},
									{key : 'afeDgr', align:'center', title : '차수', width: '60px'},

									{key : 'hdofcNm', align:'center', title : '본부', width: '60px'},
									{key : 'ntwkLineNm', align:'center', title : '도서지역', width: '120px'},

									{key : 'umtsoNm', align:'center', title : '상위국', width: '100px'},
									{key : 'lmtsoNm', align:'center', title : '하위국', width: '100px'},

									{key : 'sctnDistk', align:'center', title : '구간거리(Km)', width: '90px'},
									{key : 'mwFreqVal', align:'center', title : '주파수(Ghz)', width: '80px'},
									{key : 'chnlCnt', align:'center', title : '채널 수', width: '80px'},
									{key : 'modulMeansVal', align:'center', title : '변조방식', width: '80px'},
									{key : 'mwBdwhCdVal', align:'center', title : '대역폭', width: '80px'},
									{key : 'ntwkCapaVal', align:'center', title : '용량(Mbit/s)', width: '80px'},

									{key : 'dsnMtrlCostAmt', align:'center', title : '물자비', width: '80px'},
									{key : 'dsnInvtCostAmt', align:'center', title : '공사비', width: '80px'},

									{key : 'realMtrlCostAmt', align:'center', title : '물자비', width: '80px', headerStyleclass: "green"},
									{key : 'realInvtCostAmt', align:'center', title : '공사비', width: '80px', headerStyleclass: "green"},

									{key : 'trfAvgVal', align:'center', title : '평균 트래픽', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},
									{key : 'trfUseRateVal', align:'center', title : '사용율', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},

									{key : 'spclMtrCttVal', align:'left', title : '구분', width: '150px', headerStyleclass: "yellow", styleclass : "line-break"},
									{key : 'rmk', align:'left', title : '비고', width: '350px', headerStyleclass: "yellow", styleclass : "line-break"},

									{key : 'cmptrPossCnt', align:'center', title : '경쟁사점유', width: '80px', headerStyleclass: "yellow"},
									{key : 'remChnlCnt', align:'center', title : '잔여채널', width: '80px', headerStyleclass: "yellow"},

									{key : 'dsnDivNm', align:'center', title : '구분', width: '80px', headerStyleclass: "green"},
									{key : 'chnlScreVal', align:'center', title : '채널확보', width: '80px', headerStyleclass: "green"},
									{key : 'capaIcreChnlVal', align:'center', title : '채널 수', width: '80px', headerStyleclass: "green"},
									{key : 'capaScreVal', align:'center', title : '확보용량(Mbit/s)', width: '90px', headerStyleclass: "green"},
									{key : 'prvdNm', align:'center', title : '공급사', width: '80px', headerStyleclass: "green"}];

    	}
    	else {	// 초기 그리드
    		var headerMappingN =  [{fromIndex:2, toIndex:3, title:"년도/차수", id:'u0'}
    										,{fromIndex:4, toIndex:5, title:"구분", id:'u1'}
								            ,{fromIndex:6, toIndex:7, title:"구간", id:'u1'}
											,{fromIndex:8, toIndex:8, title:"무선구간(운용중)", id:'u2'}
											,{fromIndex:9, toIndex:10, title:"설계 투자비", id:'u3'}
											,{fromIndex:11, toIndex:12, title:"실제 투자비", id:'u4', headerStyleclass: "green"}
											,{fromIndex:13, toIndex:14, title:"트래픽", id:'u5', headerStyleclass: "yellow"}
											,{fromIndex:15, toIndex:16, title:"잔여채널현황파악", id:'u6', headerStyleclass: "yellow"}
											,{fromIndex:17, toIndex:21, title:"설계안", id:'u7', headerStyleclass: "green"}];

			var mappingN =  [{align:'center', title : 'mwSrno', key: 'mwSrno', width: '50px'},
									{key : 'rowNo', align:'center', title : 'NO.', width: '50px'},

									{key : 'afeYr', align:'center', title : '년도', width: '60px'},
									{key : 'afeDgr', align:'center', title : '차수', width: '60px'},

									{key : 'hdofcNm', align:'center', title : '본부', width: '60px'},
									{key : 'ntwkLineNm', align:'center', title : '도서지역', width: '120px'},

									{key : 'umtsoNm', align:'center', title : '상위국', width: '100px'},
									{key : 'lmtsoNm', align:'center', title : '하위국', width: '100px'},

									{key : 'ntwkCapaVal', align:'center', title : '용량(Mbit/s)', width: '80px'},

									{key : 'dsnMtrlCostAmt', align:'center', title : '물자비', width: '80px'},
									{key : 'dsnInvtCostAmt', align:'center', title : '공사비', width: '80px'},

									{key : 'realMtrlCostAmt', align:'center', title : '물자비', width: '80px', headerStyleclass: "green"},
									{key : 'realInvtCostAmt', align:'center', title : '공사비', width: '80px', headerStyleclass: "green"},

									{key : 'trfAvgVal', align:'center', title : '평균 트래픽', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},
									{key : 'trfUseRateVal', align:'center', title : '사용율', width: '80px', headerStyleclass: "yellow", render: {type: "trfTooltip"}, tooltip: false},

									{key : 'cmptrPossCnt', align:'center', title : '경쟁사점유', width: '80px', headerStyleclass: "yellow"},
									{key : 'remChnlCnt', align:'center', title : '잔여채널', width: '80px', headerStyleclass: "yellow"},

									{key : 'dsnDivNm', align:'center', title : '구분', width: '80px', headerStyleclass: "green"},
									{key : 'chnlScreVal', align:'center', title : '채널확보', width: '80px', headerStyleclass: "green"},
									{key : 'capaIcreChnlVal', align:'center', title : '채널 수', width: '80px', headerStyleclass: "green"},
									{key : 'capaScreVal', align:'center', title : '확보용량(Mbit/s)', width: '90px', headerStyleclass: "green"},
									{key : 'prvdNm', align:'center', title : '공급사', width: '80px', headerStyleclass: "green"}];
    	}

    	if (gridIdGubun != 'dataGridExcel')
    		gridIdGubun = 'dataGrid';

        //그리드 생성
        $('#'+gridIdGubun).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
    		rowOption : {
    			defaultHeight : "content"
    		},
    		renderMapping : {
				'trfTooltip': {
					renderer: function(value, data, render, mapping){
						if(value == null || value == '')
							return
						else
							return '<div id="'+data._index.id+mapping.key+'">'+value+'</div>';
					}
				}
			},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerGroup : headerMappingN,
    		columnMapping : mappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {

		var hideColList = ['mwSrno'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
		$('#'+excelGridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });

         $("#afeYr").on('change',function(e) {
     		var param = $("#afeYr").getData();

     		var option_data =  [{cd: "",cdNm: "전체"}];
     		$("#afeDgr").clear();

     		var dgrList = null;

     		if (param.afeYr != "") {
	     		for(var i=0; i<afeDgrData.length; i++){
	     			if (afeDgrData[i].cd == param.afeYr) {
	     				dgrList = afeDgrData[i].cdNm.split('|');
	     				break;
	     			}
				}

	     		for(var i=0; i<dgrList.length; i++)
        			option_data.push({cd: dgrList[i], cdNm: dgrList[i]});
     		}

     		$("#afeDgr").setData({
    			data:option_data
    		});

     	});

         $('#btnMwIvntMgmtDel').on('click', function(e) {

        	 callMsgBox('','I', configMsgArray['deleteConfirm'] , function(msgId, msgRst){
    			 mwInvtMgmtDel();
			});


         });

         $('#wlesSctnInfoChk').on('click', function(e) {

//        	 $('#'+gridId).alopexGrid('dataEmpty');
        	 var Data =$('#'+gridId).alopexGrid('dataGet');

        	 if ($("input:checkbox[id='wlesSctnInfoChk']").is(":checked") ){		// 무선구간정보조회
        		 initGrid('W');
        	 }else if ($("input:checkbox[id='dtlInfoChk']").is(":checked") ){		// 상세정보조회
        		 initGrid('D');
        	 }else { // 초기 그리드
        		 initGrid('');
        	 }
        	 if ($("input:checkbox[id='wlesSctnInfoChk']").is(":checked") && $("input:checkbox[id='dtlInfoChk']").is(":checked") ){	// 전체 체크
        		 initGrid('A');
        	 }

        	 $('#'+gridId).alopexGrid('dataSet', Data);
//        	 $('#dataGrid').alopexGrid('dataSet', Data);
         });

         $('#dtlInfoChk').on('click', function(e) {
//        	 $('#'+gridId).alopexGrid('dataEmpty');
        	 var Data =$('#'+gridId).alopexGrid('dataGet');

        	 if ($("input:checkbox[id='wlesSctnInfoChk']").is(":checked") ){		// 무선구간정보조회
        		 initGrid('W');
        	 }else if ($("input:checkbox[id='dtlInfoChk']").is(":checked") ){		// 상세정보조회
        		 initGrid('D');
        	 }else { // 초기 그리드
        		 initGrid('');
        	 }
        	 if ($("input:checkbox[id='wlesSctnInfoChk']").is(":checked") && $("input:checkbox[id='dtlInfoChk']").is(":checked") ){	// 전체 체크
        		 initGrid('A');
        	 }

        	 $('#'+gridId).alopexGrid('dataSet', Data);

         });

         $('#tooltip').convert();
         $('#'+gridId).on('mouseover', '.bodycell', function(e){

        	 var evObj = AlopexGrid.parseEvent(e);
        	 var data = evObj.data;
        	 var mapping  = evObj.mapping;
        	 $('#tooltip').close();
        	 html = "";

        	 if(mapping.key === 'trfAvgVal' || mapping.key === 'trfUseRateVal'){
				$('#tooltip').close();
				$('#tooltip').attr('data-base', '#'+data._index.id + mapping.key);
				html = "1)백홀NMS : 7일 이상 30분단위 평균 트래픽<br>2)MW NMS : 최번시 3일 이상 평균트래픽";
				$('#tooltip').html(html);
				$('#tooltip').open();
        	 }else{
				$('#tooltip').close();
			}

         });

       //첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 var param =  [{mwSrno : dataObj.mwSrno}];
     		 $a.popup({
        			popid: 'MwInvtDtlLkup',
        			title: 'M/W 투자관리 상세 정보',
        			url: '/tango-transmission-web/configmgmt/engmgmt/MwInvtDtlLkup.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 890,
           			height : 940,
        			callback: function(data) {
    	            		main.setGrid(1,perPage);
    			      }
        		});

    	 });

    	//등록
    	 $('#btnMwIvntMgmtReg').on('click', function(e) {

    			//tango transmission biz 모듈을 호출하여야한다.
    		 dataParam = {"regYn" : "N"};

    		 $a.popup({
       			popid: 'MwInvtReg',
       			title: 'M/W 투자관리 등록',
       			url: '/tango-transmission-web/configmgmt/engmgmt/MwInvtReg.do',
       			data: dataParam,
       			windowpopup : true,
       			modal: true,
       			movable:true,
       			width : 890,
       			height : 940,
       			callback: function(data) {
            		main.setGrid(1,perPage);
       			}
       		});


         });

    	//타사체널관리
    	 $('#btnOhcpnChnlMgmt').on('click', function(e) {

    		 $a.popup({
        			popid: 'MwOhcpnChnlMgmt',
        			title: '타사채널관리',
        			url: '/tango-transmission-web/configmgmt/engmgmt/MwOhcpnChnlMgmt.do',
        			data: null,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 1100,
        			height : 630
        		});

         });

    	 $('#btnExportExcel').on('click', function(e) {
       		//tango transmission biz 모듈을 호출하여야한다.
       		 var param =  $("#searchForm").getData();
       		 var fileName = "";
       		 var method = "";

       		 param = gridExcelColumn(param, excelGridId);

       		 param.pageNo = 1;
       		 param.rowPerPage = 10;
       		 param.firstRowIndex = 1;
       		 param.lastRowIndex = 1000000000;

        	fileName = 'MW투자관리';
        	method = 'getMwInvtMgmtList';


       		 param.fileName = fileName;
       		 param.fileExtension = "xlsx";
       		 param.excelPageDown = "N";
       		 param.excelUpload = "N";
       		 param.method =method;

       		 $('#'+gridId).alopexGrid('showProgress');
    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/excelcreate', param, 'GET', 'excelDownload');
            });

	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.mwInvtMgmt);
    	}


		//본부 콤보박스
		 if(flag == 'org'){
				$('#hdofcCd').clear();

				var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

				for(var i=0; i<response.length; i++){

					var resObj =  {comCd: response[i].cd, comCdNm: response[i].cdNm};
					option_data.push(resObj);
				}

				$('#hdofcCd').setData({
		             data:option_data
				});
			}

    	if(flag == 'afeYrDgrList'){

    		$("#afeYr").clear();

    		var afeYrData =  [{cd: "",cdNm: "전체"}];
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				afeYrData.push({cd: resObj.comCd, cdNm: resObj.comCd});
				afeDgrData.push({cd: resObj.comCd, cdNm: resObj.comCdNm});
			}

    		$("#afeYr").setData({
    			data:afeYrData
    		});

    		$("#afeDgr").clear();
    		$("#afeDgr").setData({
    			data:[{cd: "",cdNm: "전체"}]
    		});
    	}




		if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
            // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();

        }


    }

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		param.headerGrpCnt = 1;
		var excelHeaderGroupTitle = "";
		var excelHeaderGroupColor = "";
		var excelHeaderGroupFromIndex = "";
		var excelHeaderGroupToIndex = "";


		var excelHeaderGroupFromIndexTemp = "";
		var excelHeaderGroupToIndexTemp = "";
		var excelHeaderGroupTitleTemp ="";
		var excelHeaderGroupColorTemp = "";

		var toBuf = "";


		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			if (i== gridColmnInfo.length-1) {

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex-1 + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)-1+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf-1+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)-1+ ";";
				toBuf =  toBuf + (gridColmnInfo[i].groupColumnIndexes.length)
			}

			excelHeaderGroupTitleTemp += gridColmnInfo[i].title + ";";
			excelHeaderGroupColorTemp +='undefined'+ ";";

		}

		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			excelHeaderGroupFromIndex += excelHeaderGroupFromIndexTemp.split(";")[i] + ";";
			excelHeaderGroupToIndex += excelHeaderGroupToIndexTemp.split(";")[i] + ";";
			excelHeaderGroupTitle += excelHeaderGroupTitleTemp.split(";")[i] + ";";
			excelHeaderGroupColor += excelHeaderGroupColorTemp.split(";")[i] + ";";

		}

		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {


				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				if (gridHeader[i].key == 'invtCostAmt')
					excelHeaderNm += '투자비';
				else
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

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}


    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');


    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwInvtMgmt', param, 'GET', 'search');

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