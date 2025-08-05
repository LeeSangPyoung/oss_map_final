/**
 * UserMenuPop.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var userMenuPop = $a.page(function() {
	var menuGrid = 'menuGrid';
	var userGrid = 'userSetGrid';
	var invtParam = "";

	var gUserGrpList = [];


	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();

		$("#userGrpNm").hide();			// 사용자 그룹명
		$("#btnUserGrpSave").hide();		// 사용자 그룹 저장
		$("#btnUserGrpMod").hide();		// 사용자 그룹 수정
		$("#btnUserGrpCncl").hide();		// 사용자 그룹 취소
		$("#btnUserGrpDel").hide();

	};

	function initGrid() {

		$('#'+menuGrid).alopexGrid({
			rowSingleSelect : false,
    		disableTextSelection : true,
    		paging : {
    			pagerTotal : false
    		},
    		pager : false,
    		defaultColumnMapping : {
    			resizing: true
    		},
			columnMapping: [
				{ selectorColumn : true, width : '40px', resizing : false},
				{ key : 'grpNm', align:'center', title : '그룹', rowDragDrop : true},
				{ key : 'mtsoInvtItmNm', align:'left', title : '항목 명', rowDragDrop : true},
				{ key : 'menuId', align:'center', title : 'menuid', hidden : true}
				],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

		$('#'+userGrid).alopexGrid({
			rowClickSelect : false,
            rowSingleSelect : false,
    		disableTextSelection : true,
    		paging : {
    			pagerTotal : false
    		},
    		pager : false,
    		defaultColumnMapping : {
    			resizing: true
    		},
    		renderMapping : {
				'deleteScreen' : {
					renderer : function(value, data, render, mapping){
						return "<a href='#'><i class='fa fa-trash deleteScreen Font-18'></i></a>";
					}
				}
			},
			columnMapping: [
				{ key : '', title : '삭제', width : '40px', render : {type : 'deleteScreen'}},
				{ key : 'grpNm', align:'center', title : '그룹', rowDragDrop : true},
				{ key : 'mtsoInvtItmNm', align:'left', title : '항목 명', rowDragDrop : true},
				{ key : 'menuId', align:'center', title : 'menuid', hidden : true}
				],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	}


	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var userId = $("#userId").val();
		var paramData = {userId : userId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserGrpList', paramData, 'GET', 'userGrpList'); 	// 사용자그룹


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/USERMENU', null, 'GET', 'grpCd');	// 그룹코드
//		var userId = $("#userId").val();
//		var paramData = {userId : userId};
//		$('#'+menuGrid).alopexGrid('showProgress');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMenuInf', paramData, 'GET', 'menuInf'); 		// 항목
//		$('#'+userGrid).alopexGrid('showProgress');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserMenu', paramData, 'GET', 'userMenu'); 	// 사용자 항목




	}


	function setEventListener() {

		$('#btnCancel').on('click', function(e) {
			$a.close();
		});

		$('#grpCd').on('change', function(e) {
			 $('#searchBtn').click();
		});

		$('#mtsoInvtItmNm').on('keydown',function(event){
			if(event.keyCode == 13){
				//이벤트 등록
				 $('#searchBtn').click();
			}
		});

		$('#searchBtn').on('click', function(){
			$('#'+menuGrid).alopexGrid('showProgress');

			var storgboxId = $('#userGrpList').val();
			var userId = $("#userId").val();
			var grpCd = $("#grpCd").val();
			var paramData = {userId : userId, grpCd : grpCd, storgboxId : storgboxId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMenuInf', paramData, 'GET', 'menuInf'); // 항목
        });

		$('#btnPlus').on('click', function(e) {
			var userId = $("#userId").val();
			var storgboxId = $('#userGrpList').val();

			if (storgboxId.length == 0) {
				callMsgBox('','W', "사용자 그룹을 선택하세요.", function(msgId, msgRst){});
        		return;
			}

			var data = AlopexGrid.trimData( $('#'+menuGrid).alopexGrid('dataGet', {_state: {selected:true}}) );
        	if ( data.length == 0 ) {
        		callMsgBox('','W', "선택한 항목이 없습니다.", function(msgId, msgRst){});
        		return;
        	}

        	// 중복체크
        	for ( var i=0; i<data.length; i++ ) {
        		if( $('#'+userGrid).alopexGrid( 'dataGet' , {'menuId' : data[i].menuId} ).length == 0 ) {

        			var paramData 	= {menuId : data[i].menuId, userId : userId, storgboxId : storgboxId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setUserMenuInsert', paramData, 'POST', 'saveUserMenu');
        		}
        	}
//        	var paramData = {userId : userId, storgboxId : storgboxId, grpCd : grpCd};
//
//    		$('#'+userGrid).alopexGrid('showProgress');
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserMenu', paramData, 'GET', 'userMenu'); 	// 사용자 항목
//
//    		$('#'+menuGrid).alopexGrid('showProgress');
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMenuInf', paramData, 'GET', 'menuInf'); 		// 항목
        });

		$('#'+userGrid).on('click','.bodycell', function(e){
      		var ev = AlopexGrid.parseEvent(e);
    		var data = ev.data;
    		var storgboxId = $('#userGrpList').val();
    		var userId = $("#userId").val();
    		if ($(this).hasClass('cell-type-deleteScreen')) {
    			var data = AlopexGrid.trimData( $('#'+userGrid).alopexGrid('dataGet', {_index : { data : data._index.row }}) );
    			var paramData 	= {menuId : data[0].menuId, userId : userId, storgboxId: storgboxId};
    			callMsgBox('','C', "해당 항목을 삭제하시겠습니까?", function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setUserMenuDelete', paramData, 'POST', 'saveUserMenu');
    				}
    			});
    		}
		});


		// 사용자 그룹 추가
		$('#btnUserGrpAdd').on('click', function(e) {

			if (gUserGrpList.length > 5) {
				callMsgBox('','I', '사용자 그룹 추가는 최대 5개 까지 입니다.' , function(msgId, msgRst){});
				return;
			}


			$("#userGrpNm").show();
			$("#btnUserGrpSave").show();
			$("#btnUserGrpCncl").show();

			$("#userGrpSelect").hide();
			$("#btnUserGrpDel").hide();
			$("#btnUserGrpAdd").hide();
			$("#btnUserGrpMod").hide();

			$("#userGrpNm").val('');		// 사용자 그룹명 초기화
		});

		// 사용자 그룹 저장
		$('#btnUserGrpSave').on('click', function(e) {

			$("#userGrpNm").hide();
			$("#userGrpSelect").show();

			var storgboxId = $('#userGrpList').val();
			var storgboxTitlNm = $("#userGrpNm").val();
			var userId = $("#userId").val();

			var paramData = {userId : userId, storgboxTitlNm : storgboxTitlNm, storgboxId : storgboxId };
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/mergeUserGrp', paramData, 'POST', 'mergeUserGrp'); 	// 사용자 그룹 저장

			$("#userGrpSelect").show();
			$("#btnUserGrpAdd").show();

			$("#btnUserGrpSave").hide();
			$("#userGrpNm").hide();
			$("#btnUserGrpDel").hide();
			$("#btnUserGrpCncl").hide();
			$("#btnUserGrpMod").hide();

			$("#userGrpSelect").setSelected(storgboxId);


		});

		// 사용자 그룹 취소
		$('#btnUserGrpCncl').on('click', function(e) {

			$("#userGrpSelect").show();
			$("#btnUserGrpDel").show();
			$("#btnUserGrpMod").show();

			$("#btnUserGrpAdd").hide();
			$("#userGrpNm").hide();
			$("#btnUserGrpSave").hide();
			$("#btnUserGrpCncl").hide();

		});

		// 사용자 그룹명 수정
		$('#btnUserGrpMod').on('click', function(e) {
			$("#userGrpNm").show();
			$("#userGrpSelect").hide();

			$("#btnUserGrpSave").show();
			$("#btnUserGrpCncl").show();
			$("#btnUserGrpDel").hide();
			$("#btnUserGrpAdd").hide();
			$("#btnUserGrpMod").hide();

			var storgboxTitlNm = $("#userGrpList").getTexts();
			$("#userGrpNm").val(storgboxTitlNm);

		});

		$('#btnUserGrpDel').on('click', function(e) {

			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){

    			if (msgRst == 'Y') {
    				var storgboxId = $('#userGrpList').val();
    				var userId = $("#userId").val();
    				var paramData = {storgboxId : storgboxId, userId : userId };
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/deleteUserGrp', paramData, 'POST', 'deleteUserGrp'); 	// 사용자 그룹 삭제

    				$("#userGrpSelect").show();
    				$("#btnUserGrpAdd").show();

    				$("#btnUserGrpSave").hide();
    				$("#userGrpNm").hide();
    				$("#btnUserGrpDel").hide();
    				$("#btnUserGrpCncl").hide();
    				$("#btnUserGrpMod").hide();

    			}

			});

		});

		$('#userGrpList').on('change', function(e) {
			var storgboxId = $('#userGrpList').val();

			if(storgboxId.length > 0) {
				$("#btnUserGrpMod").show();
				$("#btnUserGrpDel").show();
				$("#btnUserGrpAdd").hide();

				var userId = $("#userId").val();
				var paramData = {userId : userId, storgboxId : storgboxId};
				$('#'+menuGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMenuInf', paramData, 'GET', 'menuInf'); 		// 항목
				$('#'+userGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserMenu', paramData, 'GET', 'userMenu'); 	// 사용자 항목
			}
			else {
				$("#btnUserGrpMod").hide();
				$("#btnUserGrpDel").hide();
				$("#btnUserGrpAdd").show();

				$('#'+menuGrid).alopexGrid('dataEmpty');
				$('#'+userGrid).alopexGrid('dataEmpty');
			}


			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/USERMENU', null, 'GET', 'grpCd');	// 그룹코드

		});

	};

	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'mergeUserGrp') {

			var userId = $("#userId").val();
			var paramData = {userId : userId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserGrpList', paramData, 'GET', 'userGrpList'); 	// 사용자그룹

			$('#'+menuGrid).alopexGrid('dataEmpty');
			$('#'+userGrid).alopexGrid('dataEmpty');

		}

		if(flag == 'deleteUserGrp') {

			var userId = $("#userId").val();
			var paramData = {userId : userId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserGrpList', paramData, 'GET', 'userGrpList'); 	// 사용자그룹

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/USERMENU', null, 'GET', 'grpCd');	// 그룹코드

			$('#'+menuGrid).alopexGrid('dataEmpty');
			$('#'+userGrid).alopexGrid('dataEmpty');

		}


		if(flag == 'userGrpList') {

			$('#userGrpList').clear();

			var option_data = [{cd: '', cdNm: '그룹추가'}];
			for(var i=0; i<response.UserGrpList.length; i++){
				var resObj = {cd : response.UserGrpList[i].storgboxId, cdNm : response.UserGrpList[i].storgboxTitlNm};
				option_data.push(resObj);
			}
			$('#userGrpList').setData({ data : option_data, option_selected: '' });
			gUserGrpList = option_data;


		}

		if(flag == 'grpCd'){
			$('#grpCd').clear();
			var option_data = [{cd: '', cdNm: '[그룹별 항목] 전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = {cd : response[i].comCd, cdNm : response[i].comCdNm};
				option_data.push(resObj);
			}
			$('#grpCd').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'menuInf'){
			$('#'+menuGrid).alopexGrid('hideProgress');
			$('#'+menuGrid).alopexGrid('dataEmpty');
			var serverPageinfo = {dataLength : 0,current : 1, perPage : 500};
			$('#'+menuGrid).alopexGrid('dataSet', response.menuList, serverPageinfo);
		}

		if(flag == 'userMenu'){
			$('#'+userGrid).alopexGrid('hideProgress');
			var serverPageinfo = {dataLength : 0,current : 1, perPage : 500};
			$('#'+userGrid).alopexGrid('dataSet', response.userMenuList, serverPageinfo);

			var selectData = AlopexGrid.trimData($('#'+userGrid).alopexGrid('dataGet', {_state: {}}));
        	$('#listTotalCount').text(selectData.length);
        	//$('#listTotalCount').number();
		}
		if(flag == 'saveUserMenu'){
			var storgboxId = $('#userGrpList').val();
			var userId = $("#userId").val();
			var grpCd = $("#grpCd").val();
			var paramData = {userId : userId, storgboxId : storgboxId, grpCd: grpCd};
			$('#'+menuGrid).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMenuInf', paramData, 'GET', 'menuInf'); 		// 항목
    		$('#'+userGrid).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getUserMenu', paramData, 'GET', 'userMenu'); 	// 사용자 항목
		}

	}

	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){

		}
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

