/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	paramData = param;
    	setSelectCode(param);
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {
    	$('#eqpRoleDivCd').setData({
    		eqpRoleDivCd:data.eqpRoleDivCd
		});
		$('#mgmtGrpNm').setData({
    		mgmtGrpNm:data.mgmtGrpNm
    	});
    }
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
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '30px',
				numberingColumn: true
    		}, {/* 관리그룹     	 */
    			key : 'mgmtGrpNm', align:'center',
    			title : '',
    			width: '1px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : '장비타입',
				width: '150px'
			}, {/* 숨김데이터 */
				key : 'bpId', align:'center',
				title : '제조사ID',
				width: '70px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '130px'
			}, {/* 장비모델ID		 */
				key : 'eqpMdlId', align:'center',
				title : configMsgArray['equipmentModelIdentification'],
				width: '70px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'
			}],
			message: {/* 데이터가 없습니다 */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(data) {
    	var param = {};

    	//관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');

    	//장비 역할 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
    	//장비모델 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl/ALL', null,'GET', 'mdl');

    	if(data.eqpRoleDivCd == null || data.eqpRoleDivCd == ""){

    	}else{
    		param.eqpRoleDivCd = data.eqpRoleDivCd;
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
     		 setGrid(1,perPage);
          });

     	//엔터키로 조회
     	 $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setGrid(1,perPage);
       		}
     	 });

    	//장비타입 선택시 이벤트
     	 $('#eqpRoleDivCd').on('change', function(e) {
     		 var eqpRoleDivCd =  $("#eqpRoleDivCd").getData();
     		 var param = {};

     		 if(eqpRoleDivCd.eqpRoleDivCd == ''){

     		 }else {
     			param.eqpRoleDivCd = eqpRoleDivCd.eqpRoleDivCd;
     		 }

     		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
          });

    	//첫번째 row를 클릭했을때 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
//    	 	dataObj.mgmtGrpNm = $('#mgmtGrpNm').val();
    	 	$a.close(dataObj);

    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

	};

	function successCallback(response, status, jqxhr, flag){

		/*if(flag == 'mdl'){
			$('#eqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpMdlId').setData({
	             data:option_data
			});
		}*/
    	if(flag == 'mgmtGrpNm'){

    		$('#mgmtGrpNm').clear();

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
				}
				if(paramData == '' || paramData == null) {
	    			$('#mgmtGrpNm').setData({
	    				data:response
	    			});
	    		}
	    		else {
	    			$('#mgmtGrpNm').setData({
	    	             data:response,
	    	             mgmtGrpNm:paramData.mgmtGrpNm
	    			});
	    		}
			}
    	}

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

		if(flag == 'eqpRoleDivCd'){
			$('#eqpRoleDivCd').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpRoleDivCd').setData({
	             data:option_data
			});

			/*$('#eqpMdlId').setData({
	             data:[{comCd: "", comCdNm: configMsgArray['all']}]
			});*/

			/*$('#bpId').setData({
	             data:[{comCd: "", comCdNm: configMsgArray['all']}]
			});*/
		}

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.eqpMdlLkupList);
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

    	var hideColList = ['bpId','mgmtGrpNm'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');

    	 if($('#mgmtGrpNm').val() == 'SKT' && $('#eqpMdlIdReg').val() != 'DMT0000009' && $('#eqpMdlIdReg').val() != 'DMB0000009'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/sktEqpMdlLkup', param, 'GET', 'search');
    	 }
    	 else {
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMdlLkup', param, 'GET', 'search');
    	 }
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


});