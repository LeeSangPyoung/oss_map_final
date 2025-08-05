/**
 * ShpInfLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var subMain = $a.page(function() {
	var gridId = '';
	var firstRowIndex = '';
	var lastRowIndex = '';
	var paramData = null;
	var adamsMdlYn  = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	setRegDataSet(param);
    	setEventListener();
    	setGridFrame();

    	paramData = param;

    	if (param.mgmtGrpNm != "" && param.mgmtGrpNm != null && param.mgmtGrpNm != undefined) {
    		if(param.mgmtGrpNm == 'SKB'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + param.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
    		}else
    			adamsMdlYn = "N";
    	}


    	// 선택한 장비에 장비 정보 조회(SKT/SKB 구분을 위해)
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpDtlInf');

    	//선택한 장비에 해당하는 rack 카운트
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqprackcnt', param, 'GET', 'eqpRackCnt');

        //선택한 장비에 해당하는 수동등록여부 조회[20171019]
	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');

        //선택한 장비에 해당하는 card 카운트
//        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpcardcnt', param, 'GET', 'eqpCardCnt');

    	setSelectCode();

    };

    function setRegDataSet(data) {
    	if(data.eqpRoleDivCd == "11" || data.eqpRoleDivCd == "177" || data.eqpRoleDivCd == "178" || data.eqpRoleDivCd == "182"){
    		$('#btnPortReg').show();
    		$('#space').hide();
    	}else{
    		$('#btnPortReg').hide();
    		$('#space').show();
    	}
    	$('#shpContentArea').setData(data);

    }

    function setGridFrame() {

    	gridId = 'ShpGridRack';
    	initGrid();
    	gridId = 'ShpGridShlf';
    	initGrid();
    	gridId = 'ShpGridCard';
    	initGrid();
    	gridId = 'ShpGridPort';
    	initGrid();
    	gridId = '';
    }


    function colrShpCardList(data) {
    	var cnt = 0;
//    	$('#ShpGridCard').alopexGrid("focusCell", { _index : {shlfNm : data[0].shlfNm }}, "shlfNm" );
    	for(var i=0; i<data.length; i++){
    		var resObj = data[i];
    		$('#ShpGridCard').alopexGrid({
                rowOption : {
                	styleclass : function(data, rowOption){
                		if(data["rackNm"] == resObj.rackNm && data["shlfNm"] == resObj.shlfNm){
                			cnt++;
                			return 'row-highlight'
                		}
                	}
                }
            });
    	}
    	if(cnt == 0){
    		decolrShpCardList();
    	}
    }

    function decolrShpCardList() {

    		$('#ShpGridCard').alopexGrid({
                rowOption : {
                	styleclass : function(data, rowOption){
                			return null
                	}
                }
            });
    }

    function selectShpCardList(data) {

    		var resObj = data;
    		$('#ShpGridCard').alopexGrid({
                rowOption : {
                	styleclass : function(data, rowOption){
                		if(data["cardId"] == resObj.cardId){
                			return 'row-highlight-select'
                		}
                	}
                }
            });

    }

    function unselectShpCardList() {

		$('#ShpGridCard').alopexGrid("rowSelect", false);
    }

  //Grid 초기화
    function initGrid() {
//    	alert(gridId);

    	//그리드 생성
        $('#ShpGridRack').alopexGrid({
        	/*paging : {
        		pagerTotal : false,
//        		enabled : false,
        		enabledByPager : true
        	},*/
        	pager : false,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            autoResize: true,
            height:200,
            columnMapping : [{
				align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			/*}, {
				key : 'rackTypNm', align:'center',
				title : 'Rack유형',
				width: '100px'*/
			}, {
				key : 'rackNm', align:'center',
				title : 'Rack명',
				width: '140px'
			}, {
				key : 'barNoRack', align:'center',
				title : '바코드번호',
				width: '100px'
			}, {
				key : 'rackUseYn', align:'center',
				title : '사용여부',
				width: '70px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#ShpGridShlf').alopexGrid({
        	/*paging : {
        		pagerTotal : false,
//        		enabled : false,
        		enabledByPager : true
        	},*/
        	pager : false,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            autoResize: true,
            height:200,
            columnMapping : [{
	    		align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'rackNm', align:'center',
				title : 'Rack명',
				width: '140px'
			}, {
				key : 'shlfNm', align:'center',
				title : 'Shelf명',
				width: '100px'
			}, {
				key : 'shlfTypNm', align:'center',
				title : 'Shelf유형',
				width: '100px'
			}, {
				key : 'ukeyShlfTidVal', align:'center',
				title : 'U.Key Shelf TID',
				width: '100px'
			}, {
				key : 'shlfUseYn', align:'center',
				title : '사용여부',
				width: '70px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#ShpGridCard').alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            autoResize: true,
            height:"8row",
            columnMapping : [{
    			align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'rackNm', align:'center',
				title : 'Rack명',
				width: '100px'
			}, {
				key : 'shlfNm', align:'center',
				title : 'Shelf명',
				width: '100px'
			}, {
				key : 'slotNo', align:'center',
				title : 'Slot번호',
				width: '70px'
			}, {
				key : 'cardNm', align:'center',
				title : 'Card명',
				width: '180px'
			}, {
				key : 'cardMdlNm', align:'center',
				title : 'Card모델명',
				width: '180px'
			},{
				key : 'prntCardNm', align:'center',
				title : '부모Card명',
				width: '180px'
			}, {
				key : 'cardStatNm', align:'center',
				title : 'Card상태',
				width: '100px'
			}, {
				key : 'barNoCard', align:'center',
				title : '바코드번호',
				width: '100px'
			},{
				key : 'staPortNoVal', align:'center',
				title : '시작포트번호',
				width: '100px'
			},{
				key : 'cstrCd', align:'center',
				title : '공사코드',
				width: '100px'
			},{
				key : 'wkrtNo', align:'center',
				title : '작업지시번호',
				width: '100px'
			}, {
				key : 'cardSerNoVal', align:'center',
				title : '시리얼번호',
				width: '100px'
			}, {
				key : 'instlDt', align:'center',
				title : '설치일자',
				width: '100px'
			}, {
				key : 'cardRoleDivCd', align:'center',
				title : '카드역할코드',
				width: '100px'
			}, {
				key : 'wavlVal', align:'center',
				title : '파장값',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#ShpGridPort').alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            autoResize: true,
            height:"8row",
            columnMapping : [{
    			align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'stndRackNo', align:'center', // stndRackNo,,, stndPortNo 추가 [20171121]
				title : 'RaNo',
				width: '27px'
			}, {
				key : 'stndShelfNo', align:'center',
				title : 'ShNo',
				width: '27px'
			}, {
				key : 'stndSlotNo', align:'center',
				title : 'SlNo',
				width: '27px'
			}, {
				key : 'stndSubSlotNo', align:'center',
				title : 'SuNo',
				width: '27px'
			}, {
				key : 'stndPortNo', align:'center',
				title : 'PoNo',
				width: '27px'
			}, {
				key : 'cardNm', align:'center',
				title : 'Card명',
				width: '180px'
			}, {
				key : 'portNm', align:'center',
				title : 'Port명',
				width: '180px'
			}, {
				key : 'portIpAddr', align:'center',
				title : 'Port IP',
				width: '100px'
			}, {
				key : 'portTypNm', align:'center',
				title : 'Port유형',
				width: '100px'
			}, {
				key : 'portTypCd', align:'center',
				title : 'Port유형코드',
				width: '100px'
			}, {
				key : 'portStatNm', align:'center',
				title : 'Port상태',
				width: '100px'
			}, {
				key : 'portStatCd', align:'center',
				title : 'Port상태코드',
				width: '100px'
			},{
				key : 'portCapaNm', align:'center',
				title : 'Port용량',
				width: '100px'
			},{
				key : 'portCapaCd', align:'center',
				title : 'Port용량코드',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}

        });

        var hideColList = ['portTypCd', 'portStatCd', 'portCapaCd'];
        $('#ShpGridCard').alopexGrid("hideCol", ['cardRoleDivCd'], 'conceal');
    	$('#ShpGridPort').alopexGrid("hideCol", hideColList, 'conceal');

        /*
    	if(gridId == 'ShpGridRack'){
    		firstRowIndex = 'rackFirstRowIndex';
    		lastRowIndex = 'rackLastRowIndex';
			var mapping = [{
					align:'center',
    				title : '순번',
    				width: '40px',
    				numberingColumn: true
				}, {
					key : 'rackTypNm', align:'center',
					title : 'Rack유형',
					width: '100px'
				}, {
					key : 'rackNm', align:'center',
					title : 'Rack명',
					width: '140px'
				}, {
					key : 'barNoRack', align:'center',
					title : '바코드번호',
					width: '100px'
				}, {
					key : 'rackUseYn', align:'center',
					title : '사용여부',
					width: '70px'
				}];



    	}
    	else if(gridId == 'ShpGridShlf'){
    		firstRowIndex = 'shlfFirstRowIndex';
    		lastRowIndex = 'shlfLastRowIndex';
	    	var mapping = [{
		    		align:'center',
					title : '순번',
					width: '40px',
					numberingColumn: true
				}, {
					key : 'rackNm', align:'center',
					title : 'Rack명',
					width: '140px'
				}, {
					key : 'shlfNm', align:'center',
					title : 'Shelf명',
					width: '100px'
				}, {
					key : 'shlfTypNm', align:'center',
					title : 'Shelf유형',
					width: '100px'
				}, {
					key : 'ukeyShlfTidVal', align:'center',
					title : 'U.Key Shelf TID',
					width: '100px'
				}, {
					key : 'shlfUseYn', align:'center',
					title : '사용여부',
					width: '70px'
				}];

	    	//그리드 생성
	        $('#'+gridId).alopexGrid({
	        	paging : {
	        		pagerSelect: [100,300,500,1000]
	               ,hidePageList: false  // pager 중앙 삭제
	        	},
	        	height:"3row",
	            autoResize: true,
				message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
	        });
    	}
    	else if(gridId == 'ShpGridCard'){
    		firstRowIndex = 'cardFirstRowIndex';
    		lastRowIndex = 'cardLastRowIndex';
    		var mapping = [{
	    			align:'center',
					title : '순번',
					width: '40px',
					numberingColumn: true
				}, {
					key : 'rackNm', align:'center',
					title : 'Rack명',
					width: '140px'
				}, {
					key : 'shlfNm', align:'center',
					title : 'Shelf명',
					width: '140px'
				}, {
					key : 'slotNo', align:'center',
					title : 'Slot번호',
					width: '70px'
				}, {
					key : 'cardMdlNm', align:'center',
					title : 'Card모델명',
					width: '140px'
				}, {
					key : 'cardNm', align:'center',
					title : 'Card명',
					width: '140px'
				},{
					key : 'prntCardNm', align:'center',
					title : '부모Card명',
					width: '140px'
				}, {
					key : 'cardStatNm', align:'center',
					title : 'Card상태',
					width: '100px'
				}, {
					key : 'barNoCard', align:'center',
					title : '바코드번호',
					width: '100px'
				},{
					key : 'staPortNoVal', align:'center',
					title : '시작포트번호',
					width: '100px'
				},{
					key : 'cstrCd', align:'center',
					title : '공사코드',
					width: '100px'
				},{
					key : 'wkrtNo', align:'center',
					title : '작업지시번호',
					width: '100px'
				}, {
					key : 'cardSerNoVal', align:'center',
					title : '시리얼번호',
					width: '100px'
				}, {
					key : 'instlDt', align:'center',
					title : '설치일자',
					width: '100px'
				}];

	    		//그리드 생성
		        $('#'+gridId).alopexGrid({
		        	paging : {
		        		pagerSelect: [100,300,500,1000]
		               ,hidePageList: false  // pager 중앙 삭제
		        	},
		            height : 300,
		            autoResize: true,
					message: {
						nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
					}
		        });
    	}
    	else if(gridId == 'ShpGridPort'){
    		firstRowIndex = 'portFirstRowIndex';
    		lastRowIndex = 'portLastRowIndex';
    		var mapping = [{
	    			align:'center',
					title : '순번',
					width: '40px',
					numberingColumn: true
				}, {
					key : 'cardNm', align:'center',
					title : 'Card명',
					width: '140px'
				}, {
					key : 'portNm', align:'center',
					title : 'Port명',
					width: '140px'
				}, {
					key : 'portIpAddr', align:'center',
					title : 'Port IP',
					width: '100px'
				}, {
					key : 'portTypNm', align:'center',
					title : 'Port유형',
					width: '100px'
				}, {
					key : 'portStatNm', align:'center',
					title : 'Port상태',
					width: '100px'
				},{
					key : 'portCapaNm', align:'center',
					title : 'Port용량',
					width: '100px'
				}];

    		//그리드 생성
            $('#'+gridId).alopexGrid({
            	paging : {
            		pagerSelect: [100,300,500,1000]
                   ,hidePageList: false  // pager 중앙 삭제
            	},
//                cellSelectable : true,
                autoColumnIndex : true,
                fitTableWidth : true,
                rowClickSelect : true,
                rowSingleSelect : true,
//                rowInlineEdit : true,
                numberingColumnFromZero : false,
                autoResize: true,
                columnMapping : mapping,
                height : 300,
    			message: {
    				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    			}
            });
    	}*/




        /*$('#'+gridId).on('scrollBottom', function(e){

    		var nFirstRowIndex =parseInt($('#'+firstRowIndex).val()) + 20;
//    		showProgress(gridId);
    		var nFirstRowIndex =parseInt($('#'+firstRowIndex).val()) + 20;
    		$('#'+firstRowIndex).val(nFirstRowIndex);
    		var nLastRowIndex =parseInt($('#'+lastRowIndex).val()) + 20;
    		$('#'+lastRowIndex).val(nLastRowIndex);

        	var dataParam =  $("#shpInfLkupForm").getData();
        	dataParam.firstRowIndex = nFirstRowIndex;
        	dataParam.lastRowIndex = nLastRowIndex;
        	callMsgBox('','I', ":::::::::::"+gridId , function(msgId, msgRst){});

        	if(gridId == 'ShpGridRack'){
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shprack', dataParam, 'GET', 'searchForPageAdd');
        	}else if(gridId == 'ShpGridShlf'){
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpshlf', dataParam, 'GET', 'searchForPageAdd');
        	}else if(gridId == 'ShpGridCard'){
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', dataParam, 'GET', 'searchForPageAdd');
        	}else if(gridId == 'ShpGridPort'){
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', dataParam, 'GET', 'searchForPageAdd');
        	}
    	});*/


    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }


    function setEventListener() {

    	// 페이지 번호 클릭시
    	 $('#ShpGridRack').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridRack";
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#ShpGridRack').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridRack";
         	setGrid(1, eObj.perPage);
         });

      // 페이지 번호 클릭시
    	 $('#ShpGridShlf').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridShlf";
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#ShpGridShlf').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridShlf";
         	setGrid(1, eObj.perPage);
         });

      // 페이지 번호 클릭시
    	 $('#ShpGridCard').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridCard";
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#ShpGridCard').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridCard";
         	setGrid(1, eObj.perPage);
         });

      // 페이지 번호 클릭시
    	 $('#ShpGridPort').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridPort";
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#ShpGridPort').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	gridId = "ShpGridPort";
         	setGrid(1, eObj.perPage);
         });

    	//
         $('#btnRefresh').on('click', function(e) {
        	 $('#rackNo').val('');
        	 $('#shlfNo').val('');
        	 $('#cardId').val('');
         	//선택한 장비에 해당하는 rack 카운트
            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqprackcnt', paramData, 'GET', 'eqpRackCnt');

            //선택한 장비에 해당하는 수동등록여부 조회[20171019]
	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', paramData, 'GET', 'eqpPortPveRegIsolYn');

          });

         /*
         //Rack등록, Shelf등록, Card등록 버튼 클릭
   	 	 $('#btnRegRack3').on('click', function(e) {
   	 		$a.close();
	   	 	popup('RackReg3', $('#ctx').val()+'/configmgmt/shpmgmt/RackReg.do', '형상 Rack 등록');
	   	 });

   	 	 $('#btnRegShlf3').on('click', function(e) {
   	 		$a.close();
	   	 	popup('ShlfReg3', $('#ctx').val()+'/configmgmt/shpmgmt/ShlfReg.do', '형상 Shelf 등록');
	   	 });

  		 $('#btnRegCard3').on('click', function(e) {
  			$a.close();
	   	 	popup('CardReg3', $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do', '형상 Card 등록');
	   	 });
  		 */

  		 //rack grid row를 클릭했을때 shelf & card 리스트
    	 $('#ShpGridRack').on('click', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;

    	 	$('#rackNo').val(dataObj.rackNo);
    	 	$('#shlfNo').val('');
    	 	$('#pageNoDtl').val(1);
        	$('#rowPerPageDtl').val(10);

        	 var param =  $("#shpInfLkupForm").getData();
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpshlf', param, 'GET', 'shpShlfList');

            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'shpCardList');
            decolrShpCardList();

            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', null, 'GET', 'shpPortList');

    	 });

    	//shelf grid row를 클릭했을때 card 리스트 하이라이트
    	 $('#ShpGridShlf').on('click', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;

    	 	$('#rackNo').val(dataObj.rackNo);
    	 	$('#shlfNo').val(dataObj.shlfNo);
    	 	$('#pageNoDtl').val(1);
        	$('#rowPerPageDtl').val(10);

//        	unselectShpCardList();
        	 var param =  $("#shpInfLkupForm").getData();
            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'shpCardList');

            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', null, 'GET', 'shpPortList');

    	 });

    	//card grid row를 클릭했을때 port 리스트
    	 $('#ShpGridCard').on('click', '.bodycell', function(e){

    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	selectShpCardList(dataObj);

    	 	$('#rackNo').val(dataObj.rackNo);
    	 	$('#shlfNo').val(dataObj.shlfNo);
    	 	$('#cardId').val(dataObj.cardId);
    	 	$('#pageNoDtl').val(1);
        	$('#rowPerPageDtl').val(10);

        	 var param =  $("#shpInfLkupForm").getData();

        	 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', param, 'GET', 'shpPortList');
    	 });

    	//수정
    	 $('#ShpGridRack').on('dblclick', '.bodycell', function(e){
    		var dataObj = null;
       	 	dataObj = AlopexGrid.parseEvent(e).data;
       	 	dataObj.regYnRack = "Y";

       	 	if (adamsMdlYn == 'Y')
	 	 		return;

       	 	gridId = "ShpGridRack";
    		popup('RackReg', '/tango-transmission-web/configmgmt/shpmgmt/RackReg.do', '형상 Rack 수정', dataObj);
         });

    	 $('#ShpGridShlf').on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    	 	 dataObj = AlopexGrid.parseEvent(e).data;
    	 	 dataObj.regYnShlf = "Y";

    	 	if (adamsMdlYn == 'Y')
	 	 		return;

    	 	 gridId = "ShpGridShlf";
     		 popup('ShlfReg', '/tango-transmission-web/configmgmt/shpmgmt/ShlfReg.do', '형상 Shelf 수정', dataObj);
          });

    	 $('#ShpGridCard').on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    	 	 dataObj = AlopexGrid.parseEvent(e).data;
    	 	 dataObj.regYnCard = "Y";
    	 	 dataObj.mgmtGrpNm = paramData.mgmtGrpNm; //[20171221]

    	 	 if (adamsMdlYn == 'Y')
 	 	 		return;

    	 	 gridId = "ShpGridCard";
    	 	popupCard('CardReg', '/tango-transmission-web/configmgmt/shpmgmt/CardReg.do', '형상 Card 수정', dataObj);
          });

    	 $('#ShpGridPort').on('dblclick', '.bodycell', function(e){
       	 	var dataObj = null;

       	    var eqpIdShpInf = $('#eqpIdShpInf').val();
    	    var eqpNmShpInf = $('#eqpNmShpInf').val();
    	    //alert(eqpNmShpInf);
       	    dataObj = AlopexGrid.parseEvent(e).data;

       	    if (adamsMdlYn == 'Y')
	 	 		return;

       	    gridId = "ShpGridPort";

       	    var portTypCd = $('#portTypCd').val();
    	    var portStatCd = $('#portStatCd').val();
    	    //alert(portStatCd);
    	    var portCapaCd = $('#portCapaCd').val();
//       	    dataObj.portTypCd = portTypCd;
//       	    dataObj.portStatCd = portStatCd;
//       	    dataObj.portCapaCd = portCapaCd;
       	    dataObj.eqpId = eqpIdShpInf;
    	    dataObj.eqpNm = eqpNmShpInf;
    	    dataObj.regYn = "Y";
//      		 popup('PortReg', $('#ctx').val()+'/configmgmt/portmgmt/PortReg.do', '형상 Port 수정', dataObj);
    	    //[20171121]
    	    if(dataObj.stndPortNo == '' || dataObj.stndPortNo == null || typeof dataObj.stndPortNo == 'undefined')
    	    {
    	    	dataObj.stndPortInf = '';

    	    } else {
    	    	dataObj.stndPortInf = dataObj.stndRackNo + "－" + dataObj.stndShelfNo + "－" + dataObj.stndSlotNo + "－" + dataObj.stndSubSlotNo + "－" + dataObj.stndPortNo;
    	    }


    	    if(typeof dataObj.portIdxNo == 'undefined') {
    	    	dataObj.portIdAndIdxNo = dataObj.portId + " / ";
    	    } else {
    	    	dataObj.portIdAndIdxNo = dataObj.portId + " / " + dataObj.portIdxNo;
    	    }
    	    //_[20171121]
      		$a.popup({
	          	popid: 'PortReg',
	          	/* 포트현황		 */
	          	title: '형상 Port 수정',
	            url: '/tango-transmission-web/configmgmt/portmgmt/PortReg.do',
	            data: dataObj,
	            iframe: false,
	            modal: true,
	            movable:true,
	            width : 865,
	            height : window.innerHeight * 0.75
      		});
         });

    	//등록
    	 $('#btnRegRackLkup').on('click', function(e) {
    		dataParam = {"fromRackReg" : "Y", "eqpId":$('#eqpIdShpInf').val(), "eqpNm":$('#eqpNmShpInf').val(), "intgFcltsCd":$('#intgFcltsCdInf').val(), "eqpRoleDivCd":$('#eqpRoleDivCdInf').val()};
    		popup('RackRegLkup', '/tango-transmission-web/configmgmt/shpmgmt/RackReg.do', '형상 Rack 등록', dataParam);

         });

    	 $('#btnRegShlfLkup').on('click', function(e) {
    		 dataParam = {"fromShlfReg" : "Y", "eqpId":$('#eqpIdShpInf').val(), "eqpNm":$('#eqpNmShpInf').val(), "intgFcltsCd":$('#intgFcltsCdInf').val(), "eqpRoleDivCd":$('#eqpRoleDivCdInf').val()};
     		 popup('ShlfRegLkup', '/tango-transmission-web/configmgmt/shpmgmt/ShlfReg.do', '형상 Shelf 등록', dataParam);

          });

    	 $('#btnRegCardLkup').on('click', function(e) {
    		 dataParam = {"regYnCard" : "N", "fromCardReg" : "Y", "eqpId":$('#eqpIdShpInf').val(), "eqpNm":$('#eqpNmShpInf').val(), "intgFcltsCd":$('#intgFcltsCdInf').val(), "eqpRoleDivCd":$('#eqpRoleDivCdInf').val(), "mgmtGrpNm":paramData.mgmtGrpNm, "eqpMdlNm":paramData.eqpMdlNm}; //[20171221]
    		 popupCard('CardRegLkup', '/tango-transmission-web/configmgmt/shpmgmt/CardReg.do', '형상 Card 등록', dataParam);

          });

    	 $('#btnPortReg').on('click', function(e) {
    		 var param =  $("#shpInfLkupForm").getData();
//    		 dataParam = {"regYn" : "N"};
//    		 param.regYn = "N";
    		 param.fromEqpMgmt = "Y";
    		 $a.popup({
 	          	popid: 'PortReg',
 	          	/* 포트현황		 */
 	          	title: 'Port 등록',
 	            url: '/tango-transmission-web/configmgmt/portmgmt/PortReg.do',
 	            data: param,
 	            iframe: false,
 	            modal: true,
 	            movable:true,
 	            width : 865,
 	            height : window.innerHeight * 0.75
       		});
         });

    	 /*카드 바코드 매핑 버튼 클릭시 팝업 출력*/
    	 $('#btnCardBarNoMapp').on('click', function(e) {
       		var  param = $("#shpInfLkupForm").getData();

	       		 $a.popup({
		 	          	popid: 'CardBarNoMappPop',
		 	          	title: '카드 바코드 매핑',
		 	            url: '/tango-transmission-web/configmgmt/shpmgmt/CardBarNoMappPop.do',
		 	            modal: true,
		                 movable:true,
		                 data:param,
		                 windowpopup: true,
		 	            width : 1500,
		 	           	height : window.innerHeight * 1.0,
		 	           	callback : function(data) { // 팝업창을 닫을 때 실행
		 	           	}
		 	      });


          });



    	 /* FDF 장비구간 생성 팝업 출력*/
    	 $('#btnEqpSctnInfCreate').on('click', function(e) {
       		var  param = _.extend($("#shpInfLkupForm").getData(), {
    			eqpId : $('#eqpId').val()
    		});
	       		 $a.popup({
		 	          	popid: 'EqpSctnInfCreatePop',
		 	          	title: '장비구간 생성 팝업',
		 	            url: '/tango-transmission-web/configmgmt/equipment/EqpSctnInfCreatePop.do',


		 	            modal: true,
		                 movable:true,
		                 data:param,
		                 windowpopup: true,
		 	            width : 1500,
		 	           	height : window.innerHeight * 1.0,
		 	           	callback : function(data) { // 팝업창을 닫을 때 실행
		 	           	}
		 	      });


          });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		if(gridId == 'ShpGridRack'){
//    			setSPGrid('ShpGridRack', response, response.shpRackList);
    			$('#ShpGridRack').alopexGrid('dataSet', response.shpRackList);
    			if(response.shpRackList.length > 0){
    				/*$('#rackNo').val(response.shpRackList[0].rackNo);
            	 	$('#shlfNo').val('');
            	 	$('#pageNoDtl').val(1);
                	$('#rowPerPageDtl').val(100);*/

                	 var param =  $("#shpInfLkupForm").getData();
//                	 param.rackNo = response.shpRackList[0].rackNo;
//                	 param.shlfNo = "";
//                	 param.pageNoDtl = "1";
//                	 param.rowPerPageDtl = "100";

                	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpshlf', param, 'GET', 'shpShlfList');

                    httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'shpCardList');
                    decolrShpCardList();

                    httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', null, 'GET', 'shpPortList');
    			}

    		}else if(gridId == 'ShpGridShlf'){
    			setSPGrid(gridId, response, response.shpShlfList);
    		}else if(gridId == 'ShpGridCard'){
    			setSPGrid(gridId, response, response.shpCardList);
    		}else if(gridId == 'ShpGridPort'){
    			setSPGrid(gridId, response, response.shpPortList);
    		}
    	}

    	if(flag == 'eqpDtlInf') {

    		if(response.eqpMgmtList.length > 0){
    			if(response.eqpMgmtList[0].mgmtGrpNm == 'SKB'){
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + response.eqpMgmtList[0].eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
//        			$('#btnRegRackLkup').hide();
//        			$('#btnRegShlfLkup').hide();
//        			$('#btnRegCardLkup').hide();
//        			$('#btnPortReg').hide();
//        			$('#btnEqpSctnInfCreate').hide();
//        			$('#btnCardBarNoMapp').hide();
        			adamsMdlYn = "Y";
        		}
    			else
    				adamsMdlYn = "N";
    		}

    	}


    	/*if(flag == 'searchRack') {
    		$('#ShpGridRack').alopexGrid('hideProgress');
    		setSPGrid('ShpGridRack', response, response.shpRackList);
    	}

    	if(flag == 'searchShlf') {
    		$('#ShpGridShlf').alopexGrid('hideProgress');
    		setSPGrid('ShpGridShlf', response, response.shpShlfList);
    	}

    	if(flag == 'searchCard') {
    		$('#ShpGridCard').alopexGrid('hideProgress');
    		setSPGrid('ShpGridCard', response, response.shpCardList);
    	}

    	if(flag == 'searchPort') {
    		$('#ShpGridPort').alopexGrid('hideProgress');
    		setSPGrid(ShpGridPort, response, response.shpPortList);
    	}*/

    	/* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */

    	if(flag == 'eqpPortPveRegIsolYn'){

    		if(response.Result == 'Y'){

    			$('#btnRegRackLkup').setEnabled(false);

    	   	    $('#btnRegShlfLkup').setEnabled(false);

		    	$('#btnRegCardLkup').setEnabled(false);

		    	$('#btnPortReg').setEnabled(false);
    		}
    	}
    	/* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */


    	if(flag == 'eqpRackCnt'){
			$('#rackExist').val('');

			if(response > 0){
				$('#rackExist').val('Y');
				gridId = 'ShpGridRack';
				setGrid(1,100);
			}else{
				$('#pageNoDtl').val(1);
	        	$('#rowPerPageDtl').val(100);
				var param =  $("#shpInfLkupForm").getData();
				//선택한 장비에 해당하는 card 카운트
		        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpcardcnt', param, 'GET', 'eqpCardCnt');
			}
		}

    	if(flag == 'eqpCardCnt'){
			$('#cardExist').val('');
			if(response > 0){
				$('#cardExist').val('Y');
				gridId = 'ShpGridCard';
			}else{
				gridId = 'ShpGridPort';
			}

			//장비에 rack 이 있음 -> rack 리스트만 노출 ----> 차후 rack 선택 시 shelf & card 리스트 노출
	    	//장비에 rack 이 없음 -> card가 있음 -> card 리스트만 노출
	    	//장비에 rack 이 없음 -> card가 없음 -> port 리스트만 노출
			/*if($('#rackExist').val() == 'Y'){
	    		gridId = 'ShpGridRack';
	    		document.getElementById('rackGridArea').style.display="block";
    			document.getElementById('shlfGridArea').style.display="block";
    			document.getElementById('cardGridArea').style.display="block";
	    	}else if($('#cardExist').val() == 'Y'){
    			gridId = 'ShpGridCard';
    			//document.getElementById('rackGridArea').style.display="none";
    			//document.getElementById('shlfGridArea').style.display="none";
	        }else{
        		gridId = 'ShpGridPort';
        		//document.getElementById('rackGridArea').style.display="none";
    			//document.getElementById('shlfGridArea').style.display="none";
    			//document.getElementById('cardGridArea').style.display="none";
	    	}*/
//			initGrid();
	    	setGrid(1,100);
		}

    	if(flag == 'shpShlfList') {
    		$('#ShpGridShlf').alopexGrid('hideProgress');

    		$('#ShpGridShlf').alopexGrid('dataSet', response.shpShlfList);

//    		setSPGrid('ShpGridShlf', response, response.shpShlfList);

    	}
    	if(flag == 'shpCardList') {
    		$('#ShpGridCard').alopexGrid('hideProgress');

    		$('#ShpGridCard').alopexGrid('dataSet', response.shpCardList);
//    		setSPGrid('ShpGridCard', response, response.shpCardList);

    	}
    	if(flag == 'shpCardListColr') {

    		var data = response.shpCardList;

    		//하이라이트
    		colrShpCardList(data);

    	}


    	if(flag == 'shpPortList') {
    		$('#ShpGridPort').alopexGrid('hideProgress');

    		setSPGrid('ShpGridPort', response, response.shpPortList);


    	}

    	if(flag == 'searchForPageAdd'){
    		hideProgress(gridId);

			if(response.list.length == 0){
				//더 이상 조회될 데이터가 없습니다.
				callMsgBox('','I', configMsgArray['noMoreData'] , function(msgId, msgRst){});
				return false;
			}else{
	    		$('#'+gridId).alopexGrid("dataAdd", response.list);
	    		$('#'+gridId).alopexGrid('updateOption',
						{paging : {pagerTotal: function(paging) {
							return '총결과 : ' + response.totalCnt;
						}}}
				);
			}
    	}

    	if(flag == 'adamsEqpMdlYn'){
    		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
    			$('#btnRegRackLkup').hide();
    			$('#btnRegShlfLkup').hide();
    			$('#btnRegCardLkup').hide();
    			$('#btnPortReg').hide();
    			$('#btnEqpSctnInfCreate').hide();
    			$('#btnCardBarNoMapp').hide();

    			adamsMdlYn = "Y";

    		} else {
    			adamsMdlYn = "N";
    		}
    	}


    }

    function setSPGrid(GridID,Option,Data) {
		/*var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};*/
	       	$('#'+GridID).alopexGrid('dataSet', Data);
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function setGrid(page, rowPerPage) {
    	$('#pageNoDtl').val(page);
    	$('#rowPerPageDtl').val(rowPerPage);

    	 var param =  $("#shpInfLkupForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');

    	 if(gridId == 'ShpGridRack'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shprack', param, 'GET', 'search');
    	 }else if(gridId == 'ShpGridShlf'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpshlf', param, 'GET', 'search');
    	 }else if(gridId == 'ShpGridCard'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'search');
    		 var portParam = {"eqpId": param.eqpId};
        	 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', portParam, 'GET', 'shpPortList');
    	 }else if(gridId == 'ShpGridPort'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', param, 'GET', 'search');
    	 }
    }

    this.setGridP = function(gridIdP, page, rowPerPage){
    	$('#pageNoDtl').val(page);
    	$('#rowPerPageDtl').val(rowPerPage);

//    	var param =  $("#shpInfLkupForm").getData();
    	gridId = gridIdP;
    	var param = {"eqpId":$("#eqpIdShpInf").val()};

    	 $('#'+gridIdP).alopexGrid('showProgress');

    	 if(gridIdP == 'ShpGridRack'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shprack', param, 'GET', 'search');
    	 }else if(gridIdP == 'ShpGridShlf'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpshlf', param, 'GET', 'search');
    	 }else if(gridIdP == 'ShpGridCard'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'search');
    		 var portParam = {"eqpId": param.eqpId};
        	 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', portParam, 'GET', 'shpPortList');
    	 }else if(gridIdP == 'ShpGridPort'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', param, 'GET', 'search');
    	 }
    }


    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 650,
                  height : window.innerHeight * 0.8
              });
    }

    function popupCard(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.85
              });
    }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
              });
    }

    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    this.aa = function(page, rowPerPage){
    	var param =  $("#shpInfLkupForm").getData();
    	alert(JSON.stringify(param));
    }
});