/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'sbeqpMdlGrid';
	var gntFlag = "N";
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#'+gridId).alopexGrid("dataEmpty");
    	$('#sbeqpClLowCdSelect').hide();
		if(param.sbeqpClLowCd != "" && param.sbeqpClLowCd != null){
        	$('#sbeqpClLowCdSelect').setData({
        		sbeqpClLowCd:param.sbeqpClLowCd
    		});
		}
    	if(param.sbeqpClCd == "N"){
    		$('#sbeqpClCdSelect').removeClass('wFull');
    		$('#sbeqpClCdSelect').addClass('w150');
    		$('#sbeqpClLowCdSelect').show();
    	}
    	if(param.fix == "Y" || param.regYn == "Y"){
			$('#sbeqpClNmReg').attr("disabled",true);
			$('#sbeqpClLowCdReg').attr("disabled",true);
    	}
    	if(param.gntFlag == "Y"){
    		gntFlag = "Y";
    	}
    	initGrid();
    	setSelectCode(param);
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {
    	$('#sbeqpClNmReg').setData({
    		sbeqpClCd:data.sbeqpClCd
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
			}, {/* 부대장비타입     	 */
				key : 'sbeqpClNm', align:'center',
				title : '부대장비타입',
				width: '150px'
			}, {/* 부대장비하위분류   	 */
				key : 'sbeqpClLowCd', align:'center',
				title : '하위분류',
				width: '60px',
				render: function(value){
					switch(value){
					case 'N':
						return '발전기부';
					case 'E':
						return '엔진부';
					case 'A':
						return 'ATS';
					default:
						break;
					}
				}
			}, {/* 숨김데이터 */
				key : 'sbeqpVendNm', align:'center',
				title : '제조사명',
				width: '70px'
			}, {/* 부대장비모델ID		 */
				key : 'sbeqpMdlId', align:'center',
				title : '부대장비모델ID',
				width: '70px'
			}, {/* 부대장비모델명   	 */
				key : 'sbeqpMdlNm', align:'center',
				title : '부대장비모델명',
				width: '130px'
			}, {/* 제조년월   	 */
				key : 'frstRegDate', align:'center',
				title : '제조년월',
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

    	//부대장비 분류 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02406', null, 'GET', 'sbeqpClCd');
    	//장비모델 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl/ALL', null,'GET', 'mdl');

    	if(data.sbeqpClCd == null || data.sbeqpClCd == ""){
    		param.sbeqpClCd = 'R';
    	}else{
    		param.sbeqpClCd = data.sbeqpClCd;
    	}
    	//제조사 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getVendList', param,'GET', 'bp');

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
     	 $('#sbeqpMdlSearchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setGrid(1,perPage);
       		}
     	 });

    	//장비타입 선택시 이벤트 . 추후 분류 선택시 제조사 셋팅으로 변경할것
     	 $('#eqpRoleDivCd').on('change', function(e) {
     		 var eqpRoleDivCd =  $("#eqpRoleDivCd").getData();
     		 var param = {};

     		 if(eqpRoleDivCd.eqpRoleDivCd == ''){

     		 }else {
     			param.eqpRoleDivCd = eqpRoleDivCd.eqpRoleDivCd;
     		 }

//     		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
          });

    	//첫번째 row를 클릭했을때 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);

    	 });

    	 $(window).bind("beforeunload",function(e){
//    		 var dataObj = AlopexGrid.parseEvent(e).data;
    		 var dataObj = [{endFlag : "Y"}];
    		 $a.close(dataObj);
    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

      	//부대장비타입 선택시 이벤트
     	 $('#sbeqpClNmReg').on('change', function(e) {
			if($('#sbeqpClNmReg').val()=='N'){
				if(gntFlag == "Y"){
					var option_data =  [{comCd: "0",comCdNm: "기본"}];
					$('#sbeqpClCdSelect').removeClass('wFull');
					$('#sbeqpClCdSelect').addClass('w150');
					$('#sbeqpClLowCdSelect').show();
					$('#sbeqpClLowCdSelect').setData({
						data:option_data
		    		});
					gridShow();
				}else{
					$('#sbeqpClCdSelect').removeClass('wFull');
					$('#sbeqpClCdSelect').addClass('w150');
					$('#sbeqpClLowCdSelect').show();
					gridShow();
				}
			}
			else {
				$('#sbeqpClLowCdSelect').hide();
				$('#sbeqpClCdSelect').removeClass('w150');
				$('#sbeqpClCdSelect').addClass('wFull');
				$('#sbeqpClLowCdReg').val('');
				gridHide();
			}
	    	$('#pageNo').val(1);
	    	$('#rowPerPage').val(perPage);

			var param =  $("#sbeqpMdlSearchForm").getData();
	    	//제조사 조회
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getVendList', param,'GET', 'bp');
         });

     	 $('#sbeqpClLowCdReg').on('change', function(e) {
 	    	$('#pageNo').val(1);
 	    	$('#rowPerPage').val(perPage);

 			var param =  $("#sbeqpMdlSearchForm").getData();
 	    	//제조사 조회
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getVendList', param,'GET', 'bp');
          });
	};

	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'sbeqpClCd'){
    		$('#sbeqpClNmReg').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpClNmReg').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.sbeqpMdlLkupList);
    	}

    	if(flag == 'bp'){
    		$('#sbeqpVendNmReg').clear();
    		var option_data =  [{sbeqpMdlId: "",sbeqpVendNm: '전체'}];

    		for(var i=0; i<response.sbeqpVendList.length; i++){
    			var resObj = response.sbeqpVendList[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpVendNmReg').setData({
                 data:option_data
    		});
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
    	var hideColList = ['sbeqpClLowCd','frstRegDate'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function gridShow(){
    	var showColList = ['sbeqpClLowCd'];

    	$('#'+gridId).alopexGrid("showCol", showColList);
    }
    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#sbeqpMdlSearchForm").getData();
    	 var vendNm = $('#sbeqpVendNmReg option:checked').text();
    	 if(vendNm != '전체'){
    		 param.sbeqpVendNm = vendNm;
    	 }

    	 $('#'+gridId).alopexGrid('showProgress');

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpMdlLkup', param, 'GET', 'search');
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