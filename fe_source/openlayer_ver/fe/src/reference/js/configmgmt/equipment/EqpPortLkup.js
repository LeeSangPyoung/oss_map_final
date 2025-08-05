/**
 * EqpLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var pop = $a.page(function() {

	var gridId = 'dataGrid';
	var cardGridId = 'dataCardGrid';
	var portGridId = 'dataPortGrid';

	var paramData = null;
	var closeYn = null;
	var fdfRegBtnYn = false;
	var fdfRegMtsoId = null;
	//회선에서 윈도우팝업 포트 등록 화면을 요청하여 포트등록 화면에서 장비 조회 시 구분하기 위함
	var fromPortRegWinPop = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	console.log(param);

    	paramData = param;

    	 if (param.eqp_div == '5GPON3.1') {

    		 $('#eqpCotTitleLabel').html("5GPON 3.1 장비 포트 조회") ;
    		 $('#eqpCotSearchLabel').html("5GPON 3.1 COT 장비") ;
    	     $('#eqpCotLabel').html("5GPON 3.1 COT 장비") ;
    	 }

        initGrid();
    	setSelectCode();
        setEventListener();

    };


  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
        	height: 300,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
    			/* 제조사              */
    			key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '60px'
    		}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '80px'
			},  {/* 국사   		 */
				key : 'eqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOffice'],
				width: '100px'
			}, {/* 장비명       	 */
				key : 'eqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '130px'
			}, {/* 숨김데이터   	 */
				key : 'eqpMdlId', align:'center',
				title : configMsgArray['equipmentModelIdentification'],
				width: '70px'
			}, {/* 숨김데이터 */
				key : 'bpId', align:'center',
				title : '제조사ID',
				width: '70px'
			}, {/* 숨김데이터	 */
				key : 'eqpInstlMtsoId', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
				width: '120px'
			},{/* 숨김데이터 */
				key : 'eqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+cardGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
        	height: 300,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'rackNm', align:'center',
				title : 'Rack명',
				width: '60px'
			}, {
				key : 'shlfNm', align:'center',
				title : 'Shelf명',
				width: '100px'
			}, {
				key : 'cardId', align:'center',
				title : 'Card ID',
				width: '130px'
			}, {
				key : 'cardNm', align:'center',
				title : 'Card명',
				width: '130px'
			}, {
				key : 'slotNo', align:'center',
				title : 'Slot번호',
				width: '60px'
			}, {
				key : 'cardMdlNm', align:'center',
				title : 'Card모델명',
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+portGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
        	height: 300,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'portIdxNo', align:'center',
				title : '포트Index',
				width: '100px'
			}, {
				key : 'portId', align:'center',
				title : '포트ID',
				width: '100px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '200px'
			}, {
				key : 'portAlsNm', align:'center',
				title : '포트별칭명',
				width: '200px'
			},{
				key : 'portCapaNm', align:'center',
				title : '포트용량',
				width: '80px'
			},{
				key : 'chnlVal', align:'center',
				title : '채널값',
				width: '80px'
			},{
				key : 'wavlVal', align:'center',
				title : '파장값',
				width: '80px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	 var param = null

    	 if (paramData.eqp_div == '5GPON3.1') {
    		//5GPON 2.0 제조사 조회
    	    param += "&comCdMlt1=55";
    	 } else {
    		 param += "&comCdMlt1=45";
    	 }


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');

    }


    function setEventListener() {

         var perPage = 100;

     	// 페이지 번호 클릭시
     	 $('#'+gridId).on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	setGrid(eObj.page, eObj.pageinfo.perPage);
          });

     	//페이지 selectbox를 변경했을 시.
          $('#'+gridId).on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	setGrid(1, eObj.perPage);
          });

     	//조회
     	 $('#btnSearch').on('click', function(e) {

     		 $('#'+cardGridId).alopexGrid('dataEmpty');
     		 $('#'+portGridId).alopexGrid('dataEmpty');

     		 setGrid(1,perPage);
          });

     	//엔터키로 조회
          $('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			setGrid(1,perPage);
        		}
      	 });

        //적용
      	 $('#btnSave').on('click', function(e) {

      		 //var data = $('#'+portGridId).alopexGrid('dataGet');
      		var data = $('#'+portGridId).alopexGrid("dataGet", {_state : {selected : true}});
    		 if(data.length == 0){
 				//선택된 데이터가 없습니다.
 				callMsgBox('','W', '선택된 포트가 없습니다.' , function(msgId, msgRst){});
 				return;
 			}

    		 callMsgBox('','C', '적용하시겠습니까?', function(msgId, msgRst){
   		       //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 saveData();
//					 $a.close();
	    		}
   		      });
         });


     	//첫번째 row를 클릭했을때 카드 정보 조회
    	 $('#'+gridId).on('click', '.bodycell', function(e){
    		 var dataObj = null;
     	 	 dataObj = AlopexGrid.parseEvent(e).data;

     	 	$('#'+cardGridId).alopexGrid('dataEmpty');
     	 	$('#'+portGridId).alopexGrid('dataEmpty');

     	 	 var param =  dataObj
        	 $('#'+cardGridId).alopexGrid('showProgress');
     	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'searchCard');

//     	 	 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmgmt', param, 'GET', 'searchCard');

    	 });

    	// 카드 그리드 선택시 포트 조회
    	 $('#'+cardGridId).on('click', '.bodycell', function(e){
    		 var dataObj = null;
     	 	 dataObj = AlopexGrid.parseEvent(e).data;


     	 	 var param =  dataObj
        	 $('#'+portGridId).alopexGrid('showProgress');
     	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', param, 'GET', 'searchPort');

    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });

	};

	function saveData() {

		var dataObj = {eqpId:''};

		var data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});

		dataObj.eqpId = data[0].eqpId;
		dataObj.eqpNm =  data[0].eqpNm;
		dataObj.eqpMdlId = data[0].eqpMdlId;
		dataObj.eqpMdlNm = data[0].eqpMdlNm;
		//data = $('#'+cardGridId).alopexGrid("dataGet", {_state : {selected : true}});
		data = $('#'+portGridId).alopexGrid("dataGet", {_state : {selected : true}});

		dataObj.portId = data[0].portId;
		dataObj.portNm = data[0].portNm;

		$a.close(dataObj);
	};

	function successCallback(response, status, jqxhr, flag){


		if(flag == 'bp'){
			$('#bpId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpId').setData({
	             data:option_data
			});
		}



    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.eqpLkupList);
    	}

    	if(flag == 'searchCard'){

			$('#'+cardGridId).alopexGrid('hideProgress');
//			setSPGrid(cardGridId, response, response.cardMgmtList);
			$('#'+cardGridId).alopexGrid('dataSet', response.shpCardList);
		}

    	if(flag == 'searchPort'){

			$('#'+portGridId).alopexGrid('hideProgress');
//			setSPGrid(cardGridId, response, response.cardMgmtList);
			$('#'+portGridId).alopexGrid('dataSet', response.shpPortList);
		}

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
    	      callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['eqpMdlId', 'bpId' , 'eqpInstlMtsoId', 'eqpId', 'cardId', 'portIdxNo', 'portId', 'portAlsNm'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+cardGridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+portGridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").serialize();


    	 if (paramData.eqp_div == '5GPON3.1') {
    		 param += "&eqpRoleDivCd=55";
        	 param += "&eqpStatCd=01";
    	 }else {
    		 param += "&eqpRoleDivCd=45";
        	 param += "&eqpStatCd=01";
    	 }

    	 $('#'+gridId).alopexGrid('showProgress');

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getFiveGponEqpLkupList', param, 'GET', 'search');
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