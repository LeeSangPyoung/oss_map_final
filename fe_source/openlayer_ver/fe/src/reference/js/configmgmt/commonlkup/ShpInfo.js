/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var commtsoMain = $a.page(function() {
	var gridIdCard = 'ShpGridCard';
	var gridIdPort = 'ShpGridPort';
	var paramData = null;

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
    	initGrid();
		setEventListener();
		paramData = param;
		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfo');


		$('#shpInfoLkupArea').setData(param);



		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqprackcnt', param, 'GET', 'eqpRackCnt');
	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpinfotree', param, 'GET', 'shpinfotree');


		$('#'+gridIdCard).alopexGrid('showProgress');

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpcard', param, 'GET', 'shpCardList');
		$('#'+gridIdPort).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpport', param, 'GET', 'shpPortList');

		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#shpInfoLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {
		var mappingCard =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
		{ key : 'rackNm', align:'center', title : 'Rack명', width: '100px' },
		{ key : 'shlfNm', align:'center', title : 'Shelf명', width: '100px' },
		{ key : 'slotNo', align:'center', title : 'Slot번호', width: '70px' },
		{ key : 'cardNm', align:'center', title : 'Card명', width: '180px' },
		{ key : 'cardMdlNm', align:'center', title : 'Card모델명', width: '180px' },
		{ key : 'prntCardNm', align:'center', title : '부모Card명', width: '180px' },
		{ key : 'cardStatNm', align:'center', title : 'Card상태', width: '100px' },
		{ key : 'barNoCard', align:'center', title : '바코드번호', width: '100px' },
		{ key : 'staPortNoVal', align:'center', title : '시작포트번호', width: '100px' },
		{ key : 'cstrCd', align:'center', title : '공사코드', width: '100px' },
		{ key : 'wkrtNo', align:'center', title : '작업지시번호', width: '100px' },
		{ key : 'cardSerNoVal', align:'center', title : '시리얼번호', width: '100px' },
		{ key : 'instlDt', align:'center', title : '설치일자', width: '100px' },
		{ key : 'cardRoleDivCd', align:'center', title : '카드역할코드', width: '100px' },
		{ key : 'wavlVal', align:'center', title : '파장값', width: '100px' }];

        $('#'+gridIdCard).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : false,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:false
            }, columnMapping : mappingCard
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "10row"
        });


      var mappingPort =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
    	{ key : 'stndRackNo', align:'center', title : 'RaNo', width: '27px' },
    	{ key : 'stndShelfNo', align:'center', title : 'ShNo', width: '27px' },
    	{ key : 'stndSlotNo', align:'center', title : 'SlNo', width: '27px' },
    	{ key : 'stndSubSlotNo', align:'center', title : 'SuNo', width: '27px' },
    	{ key : 'stndPortNo', align:'center', title : 'PoNo', width: '27px' },
    	{ key : 'cardNm', align:'center', title : 'Card명', width: '180px' },
    	{ key : 'portNm', align:'center', title : 'Port명', width: '180px' },
    	{ key : 'portIpAddr', align:'center', title : 'Port IP', width: '100px' },
    	{ key : 'portTypNm', align:'center', title : 'Port유형', width: '100px' },
    	{ key : 'portTypCd', align:'center', title : 'Port유형코드', width: '100px' },
    	{ key : 'portStatNm', align:'center', title : 'Port상태', width: '100px' },
    	{ key : 'portStatCd', align:'center', title : 'Port상태코드', width: '100px' },
    	{ key : 'portCapaNm', align:'center', title : 'Port용량', width: '100px' },
    	{ key : 'portCapaCd', align:'center', title : 'Port용량코드', width: '100px' },
    	{ key : 'chnlVal', align:'center', title : '채널값', width: '100px' },
    	{ key : 'wavlVal', align:'center', title : '파장값', width: '100px' }];
        $('#'+gridIdPort).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : false,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:false
            }, columnMapping : mappingPort
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "10row"
        });

        var hideColList = ['portTypCd', 'portStatCd', 'portCapaCd'];
        $('#ShpGridCard').alopexGrid("hideCol", ['cardRoleDivCd'], 'conceal');
    	$('#ShpGridPort').alopexGrid("hideCol", hideColList, 'conceal');
	}

	function setEventListener() {
		$('#ShpGridCard').on('click', '.bodycell', function(e){
			$('#'+gridIdPort).alopexGrid('showProgress');
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	selectShpCardList(dataObj);
    	 	$('#rackNo').val(dataObj.rackNo);
    	 	$('#shlfNo').val(dataObj.shlfNo);
    	 	$('#cardId').val(dataObj.cardId);
    	 	$('#pageNoDtl').val(1);
        	$('#rowPerPageDtl').val(10);
        	 var param =  $("#shpInfoLkupForm").getData();
        	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpport', param, 'GET', 'shpPortList');
    	 });



		$('#btnShpInfMgmt').on('click', function(e) {
			var eqpId = $("#eqpId").val();
	   		var param = {eqpId : eqpId};

	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfoPop');


        });

//		$('#ShpGridPort').on('dblclick', '.bodycell', function(e){
//       	 	var dataObj = null;
//
//       	    var eqpId = $('#eqpId').val();
//    	    var eqpNm = $('#eqpNm').val();
//       	    dataObj = AlopexGrid.parseEvent(e).data;
//
//       	    dataObj.eqpId = eqpId;
//    	    dataObj.eqpNm = eqpNm;
//    	    dataObj.regYn = "Y";
//    	    if(dataObj.stndPortNo == '' || dataObj.stndPortNo == null || typeof dataObj.stndPortNo == 'undefined') {
//    	    	dataObj.stndPortInf = '';
//    	    } else {
//    	    	dataObj.stndPortInf = dataObj.stndRackNo + "－" + dataObj.stndShelfNo + "－" + dataObj.stndSlotNo + "－" + dataObj.stndSubSlotNo + "－" + dataObj.stndPortNo;
//    	    }
//    	    if(typeof dataObj.portIdxNo == 'undefined') {
//    	    	dataObj.portIdAndIdxNo = dataObj.portId + " / ";
//    	    } else {
//    	    	dataObj.portIdAndIdxNo = dataObj.portId + " / " + dataObj.portIdxNo;
//    	    }
//      		$a.popup({
//	          	popid: 'PortReg',
//	          	title: '형상 Port 수정',
//	            url: '/tango-transmission-web/configmgmt/portmgmt/PortRegPop.do',
//	            data: dataObj,
//	            iframe: false,
//	            modal: true,
//	            movable:true,
//	            windowpopup: true,
//	            width : 865,
//	            height : window.innerHeight * 0.75
//      		});
//         });



		$('#btnRowAdd').on('click', function(e) {
			var ckGubun = $("input:radio[id=searchGubun][value='R']").is(":checked") ? true : false;
			if (ckGubun) {
				dataParam = {fromRackReg : "Y", eqpId : $('#eqpId').val(), eqpNm : $('#eqpNm').val(), intgFcltsCd : $('#intgFcltsCdInf').val(), regYnRack : "N", rackTypCd : $('#rackTypCd').val()};
				 $a.popup({
			          	popid: 'RackRegLkup',
			          	/* 포트현황		 */
			          	title: '형상 Rack 등록',
			            url: '/tango-transmission-web/configmgmt/commonlkup/RackRegPop.do',
			            data: dataParam,
			            iframe: false,
			            modal: true,
			            movable:true,
			            windowpopup: true,
			            width : 600,
		 	           	height : 380,
		 	           	callback : function(data) { // 팝업창을 닫을 때 실행
			 	           	var eqpId = $("#eqpId").val();
			 				var param = {eqpId : eqpId};

			 				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpinfotree', param, 'GET', 'shpinfotree');
			           	}
			   	});
			} else {
				dataParam = {"fromShlfReg" : "Y", "eqpId":$('#eqpId').val(), "eqpNm":$('#eqpNm').val(), "intgFcltsCd":$('#intgFcltsCdInf').val(), "eqpRoleDivCd":$('#eqpRoleDivCdInf').val(), regYnShlf : "N"};
				$a.popup({
	 	          	popid: 'ShlfRegLkup',
	 	          	title: '형상 Shelf 등록',
	 	            url: '/tango-transmission-web/configmgmt/commonlkup/ShlfRegPop.do',
	 	           iframe: false,
	 	            modal: true,
	                movable:true,
	                data:dataParam,
	                windowpopup: true,
	 	            width : 600,
	 	           	height : 450,
	 	           	callback : function(data) { // 팝업창을 닫을 때 실행
		 	           	var eqpId = $("#eqpId").val();
		 				var param = {eqpId : eqpId};

		 				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpinfotree', param, 'GET', 'shpinfotree');
		           	}
	 	      });
			}
		});

		$('#btnRowReload').on('click', function(e) {
			var eqpId = $("#eqpId").val();
			var param = {eqpId : eqpId};

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpinfotree', param, 'GET', 'shpinfotree');
		});
		$('#btnRegCardLkup').on('click', function(e) {
			var param = {"regYnCard" : "N", "fromCardReg" : "Y", "eqpId":$('#eqpId').val(), "eqpNm":$('#eqpNm').val(), "intgFcltsCd":$('#intgFcltsCdInf').val(), "eqpRoleDivCd":$('#eqpRoleDivCdInf').val(), "mgmtGrpNm":paramData.mgmtGrpNm}; //[20171221]
			 $a.popup({
		      	popid: 'CardRegLkup',
				title: '형상 Card 등록',
				url: '/tango-transmission-web/configmgmt/shpmgmt/CardRegPop.do',
				modal: true,
				movable:true,
				data:param,
				windowpopup: true,
				width : 800,
				height : window.innerHeight * 1.0,
				callback : function(data) { // 팝업창을 닫을 때 실행
				}
			 });
		});

   	 $('#btnEqpSctnInfCreate').on('click', function(e) {
    		var  param = _.extend($("#shpInfoLkupForm").getData(), {
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
   	$('#btnCardBarNoMapp').on('click', function(e) {
   		var  param = $("#shpInfoLkupForm").getData();

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

	};
	var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
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
	$(document).on('click','a.af-tree-link',function(){
		var selMenuId = $(this).parents('li:first').attr('id');
		if (selMenuId != "T0001") {
			var selId = selMenuId.split("_");
			var tmpAB = selId[0];
			if (tmpAB == "A") {
				var tmpRackNo = selId[1];
				$('#rackNo').val(tmpRackNo);
	    	 	$('#shlfNo').val('');
	    	 	$('#pageNoDtl').val(1);
	        	$('#rowPerPageDtl').val(10);
				var param =  $("#shpInfoLkupForm").getData();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'shpCardList');
	            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', null, 'GET', 'shpPortList');


			} else if (tmpAB == "B") {
				var tmpRackNo = selId[2];
				var tmpShlfNo = selId[3];
				$('#rackNo').val(tmpRackNo);
	    	 	$('#shlfNo').val(tmpShlfNo);
	    	 	$('#pageNoDtl').val(1);
	        	$('#rowPerPageDtl').val(10);
	        	 var param =  $("#shpInfoLkupForm").getData();
	            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpcard', param, 'GET', 'shpCardList');
	            httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shpport', null, 'GET', 'shpPortList');
			}
		}

	});
	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'eqpinfoPop') {
    		var param = response.eqpMgmtList[0];
    		$a.popup({
	          	popid: 'ShpInfLkup',
	          	title: configMsgArray['shapeMgmtInf'],
	            url: '/tango-transmission-web/configmgmt/shpmgmt/ShpInfLkupWinPop.do',
	            data: param,
	            windowpopup : true,
	            modal: true,
                movable:true,
	            width : 1200,
                height : 850,
	           	callback : function(data) { // 팝업창을 닫을 때 실행
	           		//var param = {eqpId : ParamEqpId};
	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqprackcnt', param, 'GET', 'eqpRackCnt');
	        	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');


	        		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpinfotree', param, 'GET', 'shpinfotree');


	        		$('#'+gridIdCard).alopexGrid('showProgress');

	        		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpcard', param, 'GET', 'shpCardList');
	        		$('#'+gridIdPort).alopexGrid('showProgress');
	        		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/shpport', param, 'GET', 'shpPortList');
	           	}
	   		});
    	}


		if(flag == 'eqpPortPveRegIsolYn'){
    		if(response.Result == 'Y'){
    			$('#btnRegRackLkup').setEnabled(false);
    	   	    $('#btnRegShlfLkup').setEnabled(false);
		    	$('#btnRegCardLkup').setEnabled(false);
		    	$('#btnPortReg').setEnabled(false);
    		}
    	}
		if(flag == 'eqpRackCnt'){
			$('#rackExist').val('');
			if(response > 0){
				$('#rackExist').val('Y');
			}else{
				$('#pageNoDtl').val(1);
	        	$('#rowPerPageDtl').val(100);
				var param =  $("#shpInfoLkupForm").getData();
				//선택한 장비에 해당하는 card 카운트
		        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpcardcnt', param, 'GET', 'eqpCardCnt');
			}
		}
		if(flag == 'eqpCardCnt'){
			$('#cardExist').val('');
			if(response > 0){
				$('#cardExist').val('Y');
			}
		}
		if(flag == 'eqpinfo') {

			if(response.eqpMgmtList[0].mgmtGrpNm == 'SKB'){
				httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + response.eqpMgmtList[0].eqpMdlId, null, 'GET', 'adamsEqpMdlYn');	// ADAMS 연동 모델인지 확인
//				$("#btnShpInfMgmt").hide();
        	}

			if(response.eqpMgmtList[0].eqpRoleDivCd == "11" || response.eqpMgmtList[0].eqpRoleDivCd == "177" || response.eqpMgmtList[0].eqpRoleDivCd == "178" || response.eqpMgmtList[0].eqpRoleDivCd == "182"){
	    		$('#btnPortReg').show();
	    		$('#space').hide();
	    		$('#btnShpInfMgmt').hide();

	    	}else{
	    		$('#btnPortReg').hide();
	    		$('#space').show();
	    		$('#btnShpInfMgmt').show();
	    	}

			$('#shpInfoLkupArea').setData(response.eqpMgmtList[0]);
			//console.log(response.eqpMgmtList[0]);
    	}
		if(flag == 'shpShlfList') {
    		$('#ShpGridShlf').alopexGrid('hideProgress');
    		$('#ShpGridShlf').alopexGrid('dataSet', response.shpShlfList);
    	}
    	if(flag == 'shpCardList') {
    		$('#ShpGridCard').alopexGrid('hideProgress');
    		$('#ShpGridCard').alopexGrid('dataSet', response.shpCardList);
    	}
    	if(flag == 'shpPortList') {
    		$('#ShpGridPort').alopexGrid('hideProgress');
    		$('#ShpGridPort').alopexGrid('dataSet', response.shpPortList);

    	}
		if(flag == 'shpinfotree'){ //mtsoNm
			var shpId1 = null;
			var shpId2 = null;
			var mtsoNm = null;
			var connId = [];
			var shpData = [];

			$.each(response.shpinfotree, function(i, item){
				if (i == 0) {
					shpId1 = "A_"+response.shpinfotree[i].rackNo;
					mtsoNm = response.shpinfotree[i].mtsoNm;
					var conData = {id : "A_"+response.shpinfotree[i].rackNo, parentId : "T0001", text : response.shpinfotree[i].rackNm};
					connId.push(conData);
				}
				shpId2 = "A_"+response.shpinfotree[i].rackNo;
				if (shpId1 != shpId2) {
					shpId1 = "A_"+response.shpinfotree[i].rackNo;
					var conData = {id : "A_"+response.shpinfotree[i].rackNo, parentId : "T0001", text : response.shpinfotree[i].rackNm};
					connId.push(conData);
				}
			});
			var uniqueNames = [];
			var uniqueTmp = {id : "T0001", parentId : "", text : mtsoNm};
			uniqueNames.push(uniqueTmp);
			$.each(connId, function(i, el) {
				if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
			});
			for(j = 0; j < uniqueNames.length; j++) {
				var tmpB  = {};
				$.each(response.shpinfotree, function(i, item){
					if (uniqueNames[j].id == "A_"+response.shpinfotree[i].rackNo && response.shpinfotree[i].shlfNo != "10000") {
						tmpB  = {};
						tmpB.id = "B_"+i+"_"+response.shpinfotree[i].rackNo+"_"+response.shpinfotree[i].shlfNo;
						tmpB.parentId = uniqueNames[j].id;
						tmpB.text = response.shpinfotree[i].shlfNm;
						uniqueNames.push(tmpB);
					}
				});
			}
			$('#menuT1').setDataSource(uniqueNames);
			$('#menuT1').expandAll();

			var tree = $(this).parents('div:first').find('ul.Tree:first');
			tree.collapseAll();
		}

		if(flag == 'adamsEqpMdlYn'){
    		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
    			$("#btnShpInfMgmt").hide();
    		}
    	}

	}
	//request 실패시.
	function failCallback(response, status, jqxhr, flag){

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