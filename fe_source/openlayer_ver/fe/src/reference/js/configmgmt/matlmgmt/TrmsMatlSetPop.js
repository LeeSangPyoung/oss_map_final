/**
 * MtsoCardPortUsePop.js
 *
 * @author Administrator
 * @date 2023. 6. 8
 * @version 1.0
 */
var popUp = $a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

	var eqpRoleDivCdList =[];
	var eqpMdlIdList =[];
	var hdofcCdList = [];


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	console.log("init param : ", param);
    	paramData = param;

    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
    	setEventListener();
    };


    function initGrid(){

    	$('#'+gridId).alopexGrid({
    		paging : {
    			pagerSelect: [100,300,500,1000]
    			,hidePageList: false  // pager 중앙 삭제
    		},
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		message:{
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>",
				filterNodata: configMsgArray['noData']
			},
//			headerGroup: [
//    	        			{fromIndex:'slotAllCnt', toIndex:'slotIdleCnt', title:'SLOT'},
//    	        			{fromIndex:'port100AllCnt', toIndex:'port100IdleCnt', title:'100G PORT'},
//    	        			{fromIndex:'port10AllCnt', toIndex:'port10IdleCnt', title:'10G/Ch PORT'}
//			],
    		columnMapping: [
    			{align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true},
    			{key : 'matlSetCd', align:'center', title : '자재SET코드', width: '100px'},
    			{key : 'matlSetNm', align:'center', title : '자재SET명', width: '180px'},
    			{key : 'hdofcNm', align:'center', title : '본부', width: '60px'},
    			{key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '80px'},
    			{key : 'eqpMdlNm', align:'center', title : '장비모델', width: '100px'},
    			{key : 'splyVndrNm', align:'center', title : '공급사', width: '80px'},
    			{key : 'useYn', align:'center', title : '사용여부', width: '70px'},
    			{key : 'rmkCtt', align:'center', title : '비고', width: '140px'},
    			{key : 'frstRegUserNm', align:'center', title : '등록자', width: '60px'},
    			{key : 'frstRegDate', align:'center', title : '등록일', width: '80px'},
     		]
        });
    }

    function setSelectCode() {

    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }
		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

    	 // 본부 코드
		 httpRequest('tango-transmission-biz/transmission/configmgmt/eqpinvtdsnmgmt/com/getHdofcCode', param, 'GET', 'hdofcCode');
		 // 장비타입
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/EQPGUN', null, 'GET', 'eqpRoleDivCd');
		 //장비 모델
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMdl', null,'GET', 'mdl');
    }

    function setRegDataSet(param) {


    }

    function setEventListener(){

    	var perPage = 100;

    	// 페이지 번호 클릭시
   	 	$('#'+gridId).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	popUp.setGrid(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	popUp.setGrid(1, eObj.perPage);
        });


        $('#btnSearch').on('click', function(e) {
        	popUp.setGrid(1,perPage);
        });

      //엔터키로 조회
        $('#searchForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			popUp.setGrid(1,perPage);
      		}
    	 });

        $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);

    	 });

        $('#btnClose').on('click', function(e) {
        	$a.close();
        });



    }

    function setSPGrid(gridId, Option, Data) {


		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
	}

  	//request 호출
    var httpRequest = function(Url, Param, Method, Flag) {

    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    //request 성공시.
	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			console.log("response : ", response);
			setSPGrid(gridId, response, response.matlSetPopList);
		}

		if(flag == 'hdofcCode') {
			$('#hdofcCd').clear();

			var option_data =  [{comGrpCd: "", cd: "",cdNm: configMsgArray['all'], useYn: ""}];
			hdofcCdList.push({"text":"선택","value":""});


			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				hdofcCdList.push({"text":resObj.cdNm,"value":resObj.cd});
			}

			$('#hdofcCd').setData({
				data:option_data
			});

		}

		if(flag == 'eqpRoleDivCd'){

			$('#eqpRoleDivCdList').clear();

			var option_data =  [];
			eqpRoleDivCdList.push({"text":"선택","value":""});
//			eqpRoleDivCdGridList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpRoleDivCdList.push({"text":resObj.comCdNm,"value":resObj.comCd});
//				eqpRoleDivCdGridList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpRoleDivCdList').setData({
				data:option_data
			});

		}

		if(flag == 'mdl'){

			$('#eqpMdlIdList').clear();

			var option_data =  [];
			eqpMdlIdList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpMdlIdList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpMdlIdList').setData({
				data:option_data
			});

		}
    }

    //request 실패시.
    function failCallback(response, status, flag, jqxhr ){
    	$('#'+gridId).alopexGrid('hideProgress');
    	//조회 실패 하였습니다.
		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    }

    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	$('#'+gridId).alopexGrid('showProgress');
    	console.log("param : ", param);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlSetMgmtPopList', param, 'GET', 'search');

    }
});