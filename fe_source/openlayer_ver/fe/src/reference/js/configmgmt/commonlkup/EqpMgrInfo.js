/**
 * EqpMgrInfo.js
 *
 * @author P198914
 * @date 2024. 12. 23.
 * @version 1.0
 */
var main = $a.page(function() {
	var perPage     = 100;
	var portRerPage = 100;
	var ringRerPage = 100;

	var mTagetGrid 		= '';

	var mtsoEqpId       = '';
	var mRackSrno		= 0;
	var mCardMdlNms     = [];
	var mCardNms        = [];
	var mShlfNms        = [];
	var arrCardMdlNm    = [];
	var arrCardNms      = [];

	var gTShelfChk = 'N';

    this.init = function(id, param) {

    	// 장비ID
    	mtsoEqpId = param.mtsoEqpId;//param.mtsoEqpId;//DV23298158614,DV16780642759,DV36088075563

    	// title 장비명 상태표시
    	document.title = '장비 실장 정보 - '+param.mEqpNm;

    	// Rack Tab 설정
    	initRackTab();

    	setEventListener();

    };

    /*
     * Rack Tab 설정
     */
    function initRackTab() {
    	Tango.ajax({
    		url : 'tango-transmission-tes-biz/transmisson/tes/commonlkup/eqpmgr/getRackGroupList',
    		data : {
    			eqpId : mtsoEqpId
    		},
    		method : 'GET'
    	}).done(function(response, status, jqxhr){
    		var data = response.rackList;
    		var tabHtml = '';

    		if( data.length > 0 ){
    			// Rack Tab 활성
    			for(var i = 0; i < data.length; i++){
    				var tabId = (i+1);
    				$('#tab-'+tabId).show();
    				$('#tab-'+tabId).text('Rack '+ data[i].rackSrno);

        			// Rack Tab 이벤트 들록
        			setRackTabEvent(tabId, data[i].rackSrno);
    			}

        		//장비SHELF 조회
        		getShelfGroupList(data[0].rackSrno);

    		}else{
    			// 기본 Grid 출력
    			defualtBodyGridSet();
    		}

    	}).fail(function(response, status){});

	}

    //장비SHELF 그룹 조회
    function getShelfGroupList(rackSrno) {
		var param = {
				  eqpId : mtsoEqpId
				, rackSrno : rackSrno
		};

		// 기존선택 Rack
		mRackSrno = rackSrno;

		//장비SHELF 조회
		httpRequest('tango-transmission-tes-biz/transmisson/tes/commonlkup/eqpmgr/getShelfGroupList', param, 'GET', 'shelfGroup');

    }

    // Grid 출력
    function defualtBodyGridSet(response){

    	// Shlef 그리드
    	initSehlfGrid();

    	// Shlef 조회
    	setShelfExcData(1, perPage);

		// port/ring Grid 설정
		initPortRingGrid();

    }

	// Rack Tab 이벤트 들록
    function setRackTabEvent(tabId, rackSrno) {
		$('#tab-'+tabId).on('click', function(e) {

			// 선택 Rack이 이전 Rack과 다른면 Shelf 조회
    		if(mRackSrno != rackSrno){
        		$('#portGrid').alopexGrid('dataEmpty');
        		$('#ringGrid').alopexGrid('dataEmpty');

        		//장비SHELF 조회
        		getShelfGroupList(rackSrno);
    		}
		});
    }

    function setEventListener() {

    	$('#shelfListGrid').on('click', function(e) {
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;

			if( typeof dataObj === 'undefined') return;

//			var rowData = $('#shelfListGrid').alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			var rowData = AlopexGrid.trimData($('#shelfListGrid').alopexGrid('dataGet', function(data) {
				if (data._state.selected == true) {
					return data;
				}
			}));

			// 체크박스 클릭 시
			if (typeof rowData != 'undefined' && rowData.length > 0) {

				$('#shelfGrid').alopexGrid('dataEmpty');
        		$('#portGrid').alopexGrid('dataEmpty');
        		$('#ringGrid').alopexGrid('dataEmpty');

				var gridData = AlopexGrid.trimData($('#shelfListGrid').alopexGrid('dataGet', { _state : { selected : true }}));

				mShlfNms = [];

				if ( gridData.length > 0){
					for( var i = 0; i < gridData.length; i++ ){
						mShlfNms.push(gridData[i].shlfNm);
						}
				}

				setShelfExcData(1, perPage);

			}else {
				mShlfNms = [];
				$('#shelfGrid').alopexGrid('dataEmpty');
        		$('#portGrid').alopexGrid('dataEmpty');
        		$('#ringGrid').alopexGrid('dataEmpty');
			}
		});


    	// 페이지 번호 클릭시
		$('#shelfGrid').on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			setShelfExcData(eObj.page, eObj.pageinfo.perPage);

			mCardMdlNms = [];
			mCardNms =[];

			setGrid(1, portRerPage, 'portGrid');
			setGrid(1, ringRerPage, 'ringGrid');
		});

		// 페이지 selectbox를 변경했을 시.
		$('#shelfGrid').on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			setShelfExcData(1, eObj.perPage);

			mCardMdlNms = [];
			mCardNms =[]

			setGrid(1, portRerPage, 'portGrid');
			setGrid(1, ringRerPage, 'ringGrid');
		});

		$('#shelfGrid').on('click', function(e) {
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;

			if( typeof dataObj === 'undefined') return;

			var rowData = AlopexGrid.trimData($('#shelfGrid').alopexGrid('dataGet', function(data) {
				if (data._state.selected == true) {
					return data;
				}
			}));

			// 체크박스 클릭 시
			if (typeof rowData != 'undefined' && rowData.length > 0) {
        		$('#portGrid').alopexGrid('dataEmpty');
        		$('#ringGrid').alopexGrid('dataEmpty');

				var gridData = AlopexGrid.trimData($('#shelfGrid').alopexGrid('dataGet', { _state : { selected : true }}));


				mCardMdlNms = [];
				mCardNms = [];

				if ( gridData.length > 0){

					for( var i = 0; i < gridData.length; i++ ){
						mCardMdlNms.push(gridData[i].cardMdlNm);
						mCardNms.push(gridData[i].cardNm);
					}
				}

				//port정보 조회
        		setGrid(1,portRerPage,'portGrid');
        		//ring정보 조회
        		setGrid(1,ringRerPage,'ringGrid');

			}else {
				mCardMdlNms = [];
				mCardNms = [];

				//port정보 조회
        		setGrid(1,portRerPage,'portGrid');
        		//ring정보 조회
        		setGrid(1,ringRerPage,'ringGrid');
			}
		});

		// 포트정보 그리드 이벤트
		// 페이지 번호 클릭시
		$('#portGrid').on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			setGrid(eObj.page, eObj.pageinfo.perPage, 'portGrid');
		});

		// 페이지 selectbox를 변경했을 시.
		$('#portGrid').on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			portRerPage = eObj.perPage;
			setGrid(1, eObj.perPage, 'portGrid');
		});

		// 페이지 번호 클릭시
		$('#ringGrid').on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			setGrid(eObj.page, eObj.pageinfo.perPage, 'ringGrid');
		});

		// 페이지 selectbox를 변경했을 시.
		$('#ringGrid').on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			ringRerPage = eObj.perPage;
			setGrid(1, eObj.perPage, 'ringGrid');
		});

    }



	function initSehlfGrid() {


		$('#shelfListGrid').alopexGrid({
			height : '15row',
			pager : false,
			rowSingleSelect : false,
			rowClickSelect: false,
			columnMapping : [
				{ key : 'check', align: 'center', width: '30px', selectorColumn : true},
				{ key : 'shlfNm', align:'center', title : "쉘프명", width: '60px'},

			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	    // SHELF 그리드 생성
	    $('#shelfGrid').alopexGrid({
	    	height : '15row',
	    	//pager : false,
			paging : {
				pagerSelect: [10,30,50,100,500],
				hidePageList: false  // pager 중앙 삭제
			},
			rowSingleSelect : false,
			rowClickSelect: false,
			columnMapping : [
	    		{ key : 'check', align: 'center', width: '40px', selectorColumn : true},
	    		{ key : 'shlfNm', align:'center', title : "쉘프명", width: '80px'},
				{ key : 'cardMdlNmCnt', align:'center', title : "카드모델", width: '80px'},
				{ key : 'cardNm', align:'center', title : "카드명", width: '90px'},
				{ key : 'portStatVal', align:'left', title : "포트정보", width: '350px',tooltip:false, // 기본 툴팁 제거
					render : function(value, data) {
						var html  = '<div style="display:flex;flex-wrap:wrap;width:350px;height:34px;align-items:center">';

						var arrData = [];
						if( typeof value !== 'undefined' ){
							arrData = value.split(",");
						}

						for(var i = 0; i < arrData.length; i++){
							var portInfo = arrData[i].split("#");

							var brTag    =  i % 20 === 0 ? '<br>' : '';
							var bgColor = portInfo[2] === 'Y' ? '#77CEEC' : '#D9D9D9';
							if (portInfo[3] != 'undefined' && portInfo[3] != '') bgColor =  '#00FF00';

							html += '<div class="port-box" style="display:inline-block;width:15px;height:15px;margin:1px 2px 1px 0;justify-content:center;background-color:';
							html += bgColor+';"';
							html += 'title="포트명: '+portInfo[0]+'\n포트별칭: '+portInfo[1]+'\n링/회선명: '+portInfo[3]+'">';
							html += brTag+'</div>';
						}
						html += '</div>';

						return html;
					}
				},
				{ key : 'cardMdlNm', align:'center', title : "카드모델", width: '80px',hidden: true},
				{ key : 'eqpId', width: '80px',hidden: true},
				{ key : 'rackSrno', width: '80px',hidden: true},
				{ key : 'shlfNm', width: '80px',hidden: true}
			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	}

	// 포트정보  툴팁
    $(document).tooltip({
    	items: '.port-box',
    	disabled: true,
    	content: function(){
    		return $(this).attr('title');
    	}
    });

	function initPortRingGrid() {

	    // 포트정보 그리드 생성
	    $('#portGrid').alopexGrid({
	    	height : '5row',
			//pager : false,
			paging : {
				pagerSelect: [10,30,50,100,500],
				hidePageList: false  // pager 중앙 삭제
			},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			rowSingleSelect : false,
			rowClickSelect: false,
			columnMapping : [
	    		{ key : 'cardNm', align: 'center', title : "카드명", width: '80px'},
				{ key : 'portNm', align:'center', title : "포트명", width: '80px'},
				{ key : 'portAlsNm', align:'center', title : "포트별칭", width: '110px'},
				{ key : 'portOpStatNm', align:'center', title : "포트운용상태", width: '80px'},
				{ key : 'portStatNm', align:'center', title : "상태", width: '50px'},
				{ key : 'expRackNo', align:'right', title : "RACK", width: '50px'},
				{ key : 'expShelfNo', align:'right', title : "SHELF", width: '50px'},
				{ key : 'expSlotNo', align:'right', title : "SLOT", width: '50px'},
				{ key : 'expSubSlotNo', align:'right', title : "SSLOT", width: '50px'},
				{ key : 'expPortNo', align:'right', title : "PORT", width: '50px'},
			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	    // 링/회선 그리드 생성
	    $('#ringGrid').alopexGrid({
	    	height : '6row',
			//pager : false,
			paging : {
				pagerSelect: [10,30,50,100,500],
				hidePageList: false  // pager 중앙 삭제
			},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			rowSingleSelect : false,
			rowClickSelect: false,
			columnMapping : [
				{ key : 'lineTypNm', align:'center', title : "구분", width: '80px'},
				{ key : 'ntwkLineNm', align:'left', title : "링/회선명", width: '150px'},
				{ key : 'ntwkCapaNm', align:'center', title : "용량", width: '50px'},
				{ key : 'cardNm', align:'left', title : "카드명", width: '80px'},
				{ key : 'portNm', align:'left', title : "포트명", width: '80px'},
				{ key : 'tEqpNm', align:'left', title : "대국장비", width: '120px'},
				{ key : 'tPortNm', align:'left', title : "대국포트", width: '100px'},
				{ key : 'ntwkLineNo', align:'left', title : "링/회선ID", width: '100px'},
			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

    }

    // Shelf 데이터 검색조회
    function setShelfExcData(page, rowPerPage) {

    	var param = "pageNo=" + page + "&rowPerPage="+rowPerPage + "&eqpId="+mtsoEqpId + "&rackSrno=" + mRackSrno ;


    	for(var i=0; mShlfNms.length > i; i++){
    		param += "&shlfNms=" +mShlfNms[i];
    	}

    	$('#shelfGrid').alopexGrid('showProgress');

		//장비SHELF 데이터 조회
		httpRequest('tango-transmission-tes-biz/transmisson/tes/commonlkup/eqpmgr/getEqpMgrShelfList', param, 'GET', 'shelfSearch');

    }

	function setGrid(page, rowPerPage, gridId){
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		$('#'+gridId).alopexGrid('dataEmpty');

		var param = {
				  pageNo      : page
				, rowPerPage  : rowPerPage
  				, eqpId       : mtsoEqpId
  				, rackSrno    : mRackSrno
  				, shlfNms     : mShlfNms
  				, cardMdlNms  : mCardMdlNms
  				, cardNms     : mCardNms
    		};

		$('#'+gridId).alopexGrid('showProgress');
		if(gridId == 'portGrid'){
    		//port정보 조회
    		httpRequest('tango-transmission-tes-biz/transmisson/tes/commonlkup/eqpmgr/getEqpPortList', param, 'POST', 'portSearch');
		}else if(gridId == 'ringGrid'){
    		//ring정보 조회
    		httpRequest('tango-transmission-tes-biz/transmisson/tes/commonlkup/eqpmgr/getEqpRingList', param, 'POST', 'ringSearch');
		}
	}

    //Grid에 Row출력
    function setSpGrid(GridID, Option, Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //Shelf 데이터 포트정보 Div 처리
    function setShelfPortDiv(GridID, Option, Data) {
		var serverPageinfo = {};

		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    //request 성공시
	function successCallback(response, status, jqxhr, flag){
		switch(flag){
			case 'shelfGroup':

				setShelfPortDiv('shelfListGrid', response, response.shelfList);


				defualtBodyGridSet(response);
				$('#shelfListGrid').alopexGrid('rowSelect', {_state : {selected : false}}, true);
				break;
			case 'shelfSearch':

				$('#shelfGrid').alopexGrid('hideProgress');
				setSpGrid('shelfGrid', response, response.dataList);
				break;
			case 'portSearch':
				$('#portGrid').alopexGrid('hideProgress');
				setSpGrid('portGrid', response, response.portList);
				break;
			case 'ringSearch':
				$('#ringGrid').alopexGrid('hideProgress');
				setSpGrid('ringGrid', response, response.ringList);
				break;
		}
    }

    //request 실패시.
    function failCallback(response, status, flag, jqxhr ){
		switch(flag){
			case "portSearch":
				$('#portGrid').alopexGrid('hideProgress');
				$('#ringGrid').alopexGrid('hideProgress');
				break;
			case "ringSearch":
				$('#portGrid').alopexGrid('hideProgress');
				$('#ringGrid').alopexGrid('hideProgress');
				break;
		}
    }

    //request 호출
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