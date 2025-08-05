/**
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var gridIdExcel = 'dataExcelGrid';

	var fileOnDemendName = "";

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setRegDataSet(param);
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
			rowSelectOption: {
    			allowSingleUnselect: false,
    			disableSelectByKey: true
    		},
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
//			columnFixUpto: 2,
			defaultColumnMapping:{
				sorting : true
			},
			columnMapping: [{
				/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {
				key : 'dcnId', align:'center',
				title : 'DCN ID',
				width: '100px'
			}, {
				key : 'dcnNm', align:'center',
				title : 'DCN명',
				width: '150px'
			}, {
				key : 'mgmtNetDivNm', align:'center',
				title : 'DCN종류',
				width: '100px'
			}, {
				key : 'nmsNm', align:'center',
				title : '수집유형',
				width: '70px'
			}, {
				key : 'mgmtGrpNm', align:'center',
				title : '관리그룹',
				width: '70px'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
			}, {
				key : 'mgmtNetDivNm', align:'center',
				title : '접속유형',
				width: '100px'
			}, {
				key : 'status', align:'center',
				title : '상태',
				width: '70px',
				highlight: function(value, data, mapping){
					if(value == "비정상") return 'cell-highlight';
				}
			}, {
				key : 'emsTypNm', align:'center',
				title : 'EMS타입',
				width: '150px'
			}, {
				key : 'prtclTypNm', align:'center',
				title : '프로토콜유형',
				width: '120px'
			}, {
				key : 'prmyIpAddr', align:'center',
				title : '기본IP',
				width: '120px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

		$('#'+gridIdExcel).alopexGrid({
			paging : false,
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: [{
				/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {
				key : 'dcnId', align:'center',
				title : 'DCN ID',
				width: '100px'
			}, {
				key : 'dcnNm', align:'center',
				title : 'DCN명',
				width: '150px'
			}, {
				key : 'mgmtNetDivNm', align:'center',
				title : 'DCN종류',
				width: '100px'
			}, {
				key : 'nmsNm', align:'center',
				title : 'NMS유형',
				width: '70px'
			}, {
				key : 'mgmtGrpNm', align:'center',
				title : '관리그룹',
				width: '70px'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
			}, {
				key : 'mgmtNetDivNm', align:'center',
				title : '접속유형',
				width: '100px'
			}, {
				key : 'status', align:'center',
				title : '상태',
				width: '70px',
				highlight: function(value, data, mapping){
					if(value == "비정상") return 'cell-highlight';
				}
			}, {
				key : 'emsTypNm', align:'center',
				title : 'EMS타입',
				width: '150px'
			}, {
				key : 'prtclTypNm', align:'center',
				title : '프로토콜유형',
				width: '120px'
			}, {
				key : 'prmyIpAddr', align:'center',
				title : '기본IP',
				width: '120px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

		//컬럼이 추가만되고 삭제가 안되어 미리 만들어 놓구 보여주고 안보여주는 식으로 처리하기 위해 미리 생성
		var col = $('#'+gridId).alopexGrid('readOption').columnMapping;
		var add = [];
		for (var s = 0; s < 10; s++) {
			add.push({key: "portVal"+s, title: "port", hidden: true});
			add.push({key: "portTypVal"+s, title: "portTypVal", hidden: true});
			add.push({key: "portTypNm"+s, title: "Port유형#"+(s+1), hidden: true, width: '170px',
				value: function(value, data, mapping){
							var portType = value;
							var portTypeName = "";
							var portTypeCnt = 0;

							if(portType != undefined  && data.nmsCd == "034004"){
								for(var i=0; i<portType.length; i++)
								{
									if(portType.charAt(i) == '1')
									{
										if(portTypeCnt > 0)
										{
											portTypeName += "/";
										}

										if(i==0)
										{
											portTypeName += "장애";
										}
										else if(i==1)
										{
											portTypeName += "제어";
										}
										else if(i==2)
										{
											portTypeName += "장비접속";
										}
										else if(i==3)
										{
											portTypeName += "성능";
										}
										else if(i==4)
										{
											portTypeName += "실장";
										}
										else if(i==5)
										{
											portTypeName += "NE목록";
										}

										portTypeCnt++;
									}
								}
							}
							return portTypeName;
						}
					});
			add.push({key: "portUseYn"+s, title: "사용여부#"+(s+1), hidden: true});
			add.push({key: "curObjVal"+s, title: "Tartget IP#"+(s+1), hidden: true});
			add.push({key: "lnkgStatVal"+s, title: "상태#"+(s+1), hidden: true,
						highlight: function(value, data, mapping){
							if(value != "connected" && value != undefined) return 'cell-highlight';
						}
					});
//		add.push({key: "portUseYn"+s, title: "모델명#"+(s+1), hidden: true});
//		add.push({key: "portUseYn"+s, title: "제조사#"+(s+1), hidden: true});
			add.push({key: "dcnClctTime"+s, title: "수집시간#"+(s+1), hidden: true});
		}
		add.push({key : 'slveIpAddr', align:'center', title : '예비IP', width: '100px'});
		add.push({key : 'eqpNm', align:'center', title : 'GNE', width: '150px'});
		add.push({key : 'nodeCnt', align:'center', title : '노드수', width: '70px'});
		add.push({key : 'rmk', align:'center', title : '기타정보', width: '100px'});
		add.push({key : 'alarmRecentUpdateDt', align:'center', title : '최종경보수집일', width: '150px'});
		add.push({key : 'skt2Yn', align:'center', title : 'SKT2여부', width: '70px'});

		add.push({key : 'frstRegDate', align:'center', title : configMsgArray['registrationDate'], width: '130px'});
		add.push({key : 'frstRegUserId', align:'center', title : configMsgArray['registrant'], width: '100px'});
		add.push({key : 'lastChgDate', align:'center', title : configMsgArray['changeDate'], width: '130px'});
		add.push({key : 'lastChgUserId', align:'center', title : configMsgArray['changer'], width: '100px'});

		$('#'+gridId).alopexGrid('updateOption', {columnMapping: col.concat(add)})
		$('#'+gridIdExcel).alopexGrid('updateOption', {columnMapping: col.concat(add)})

		gridHide();

	};

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {

		var chrrOrgGrpCd;
		if($("#chrrOrgGrpCd").val() == ""){
			chrrOrgGrpCd = "SKT";
		}else{
			chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		}

		var param = {"mgmtGrpNm": chrrOrgGrpCd};

		//관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		//본부 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');

	}

	function setRegDataSet(data) {
		var param =  $("#searchForm").getData();

    	var adtnAttrVal = param.adtnAttrVal;
//    	var adtnAttrVal = 'aaCM_DCN_APRVaa';

    	if(adtnAttrVal.indexOf('CM_DCN_APRV') > 0){
    		$('#btnReg').show();
    	}else{
    		$('#btnReg').hide();
    	}

		$('#btnDcnNode').setEnabled(false);
		$('#btnDcnPort').setEnabled(false);
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

		//관리그룹 선택시 이벤트
		$('#mgmtGrpNm').on('change', function(e) {

			var mgmtGrpNm = $("#mgmtGrpNm").getTexts()[0];

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
		});

		//본부 선택시 이벤트
		$('#orgId').on('change', function(e) {

			var orgID =  $("#orgId").getData();

			if(orgID.orgId == ''){
				var mgmtGrpNm = $("#mgmtGrpNm").getTexts()[0];

				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTeamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

			}else{
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + orgID.orgId, null, 'GET', 'team');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
			}
		});

		// 팀을 선택했을 경우
		$('#teamId').on('change', function(e) {

			var orgID =  $("#orgId").getData();
			var teamID =  $("#teamId").getData();

			if(orgID.orgId == '' && teamID.teamId == ''){
				var mgmtGrpNm = $("#mgmtGrpNm").getTexts()[0];

				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
			}else if(orgID.orgId == '' && teamID.teamId != ''){
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
			}else if(orgID.orgId != '' && teamID.teamId == ''){
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
			}else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
			}

		});


		//등록
		$('#btnReg').on('click', function(e) {
			$a.popup({
				popid: 'DcnInfReg',
				title: 'DCN 등록',
				url: '/tango-transmission-web/configmgmt/dcnmgmt/DcnInfReg.do',
				windowpopup : true,
				modal: true,
				movable:true,
				width : 865,
				height : 600
			});
		});

		$('#btnDcnNode').on('click', function(e) {
			var data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});
			$a.popup({
				popid: 'DcnNode',
				title: '노드관리',
				url: '/tango-transmission-web/configmgmt/dcnmgmt/DcnNodeMgmt.do',
				windowpopup : true,
				data: data[0],
				modal: true,
				movable:true,
				width : 865,
				height : window.innerHeight * 0.83
			});
		});

		$('#btnDcnPort').on('click', function(e) {
			var data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});
			$a.popup({
				popid: 'DcnPort',
				title: '포트관리',
				url: '/tango-transmission-web/configmgmt/dcnmgmt/DcnPortMgmt.do',
				windowpopup : true,
				data: data[0],
				modal: true,
				movable:true,
				width : 865,
				height : 450
			});
		});

		$('#btnExportExcel').on('click', function(e) {
			var param =  $("#searchForm").getData();
			param.pageNo = 1;
			param.rowPerPage = 10000;

			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnMgmt', param, 'GET', 'searchExcel');

		});

		$('#'+gridId).on('click', '.bodycell', function(e){
			var dataObj = null;
			dataObj = AlopexGrid.parseEvent(e).data;
			if(dataObj.nmsNm == "EPS"){
				$('#btnDcnNode').setEnabled(false);
				$('#btnDcnPort').setEnabled(true);
			}else if(dataObj.nmsNm == "NITS"){
				$('#btnDcnNode').setEnabled(true);
				$('#btnDcnPort').setEnabled(false);
			}else if(dataObj.nmsNm == "TEAMS"){
				$('#btnDcnNode').setEnabled(false);
				$('#btnDcnPort').setEnabled(false);
			}


		});

		//첫번째 row를 클릭했을때 팝업 이벤트 발생
		$('#'+gridId).on('dblclick', '.bodycell', function(e){
			var dataObj = null;
			dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.regYn = "Y";

			$a.popup({
				popid: 'DcnInfReg',
				title: 'DCN 수정',
				url: '/tango-transmission-web/configmgmt/dcnmgmt/DcnInfReg.do',
				windowpopup : true,
				data: dataObj,
				modal: true,
				movable:true,
				width : 865,
				height : 600
			});

		});

		$('#btnClose').on('click', function(e) {
			$a.close();
		});

	};

	function EqpReg() {
		dataParam = {"regYn" : "N"};
		/* 장비등록     	 */
		popup('EqpReg', $('#ctx').val()+'/configmgmt/equipment/EqpReg.do', configMsgArray['equipmentRegistration'], dataParam);
	}


	function successCallback(response, status, jqxhr, flag){

		//관리그룹
		if(flag == 'mgmtGrpNm'){

			var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			$('#mgmtGrpNm').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

			var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCd;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:response ,
					mgmtGrpNm:selectId
				});
			}
		}

		//본부 콤보박스
		if(flag == 'fstOrg'){
			var chrrOrgGrpCd;
			if($("#mgmtGrpNm").getTexts()[0] == "" || $("#mgmtGrpNm").getTexts()[0] == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").getTexts()[0];
			}

			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				sUprOrgId = $("#sUprOrgId").val();
			}

			$('#orgId').clear();

			var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

			var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);
					if(resObj.orgId == sUprOrgId) {
						selectId = resObj.orgId;
					}
				}
				if(selectId == null){
					selectId = response[0].orgId;
					sUprOrgId = selectId;
				}
				$('#orgId').setData({
					data:option_data ,
					orgId:selectId
				});
			}
			//본부 세션값이 있을 경우 해당 팀,전송실 조회
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + sUprOrgId, null, 'GET', 'fstTeam');
		}

		if(flag == 'org'){
			$('#orgId').clear();
			var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#orgId').setData({
				data:option_data
			});
		}

		if(flag == 'fstTeam'){
			var chrrOrgGrpCd;
			if($("#mgmtGrpNm").getTexts()[0] == "" || $("#mgmtGrpNm").getTexts()[0] == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").getTexts()[0];
			}

			var sOrgId = "";
			if($("#sOrgId").val() != ""){
				sOrgId = $("#sOrgId").val();
			}

			$('#teamId').clear();

			var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

			var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);
					if(resObj.orgId == sOrgId) {
						selectId = resObj.orgId;
					}
				}
				if(selectId == null){
					selectId = response[0].orgId;
				}
				$('#teamId').setData({
					data:option_data ,
					teamId:selectId
				});
				if($('#teamId').val() != ""){
					sOrgId = selectId;
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/' + sOrgId, null, 'GET', 'tmof');
				}else{
					$('#teamId').setData({
						teamId:""
					});
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
				}
			}
		}

		if(flag == 'team'){
			$('#teamId').clear();
			var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#teamId').setData({
				data:option_data
			});

		}

		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
				data:option_data
			});
		}

		if(flag == 'session'){
			//alert(JSON.stringify(response));
			callMsgBox('','W', JSON.stringify(response) , function(msgId, msgRst){});
		}

		if(flag == 'search'){

			$('#'+gridId).alopexGrid('hideProgress');

			setSPGrid(gridId, response, response.dcnMgmtList);
		}

		if(flag == 'searchExcel'){

			setSPGrid(gridIdExcel, response, response.dcnMgmtList);

			var d = new Date();
			var month = (d.getMonth()+1)+"";
			if(month.length < 2){
				month = "0" + month;
			}
			var date = d.getFullYear()+""+month+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds();

			var worker = new ExcelWorker({
				excelFileName : "DCN정보관리_"+date,
				palette : [{
					className : 'B_YELLOW',
					backgroundColor : '255,255,0'
				},{
					className : 'F_RED',
					color : '#FF0000'
				}],
				sheetList : [{
					sheetName : "DCN정보관리",
					$grid : $('#'+gridIdExcel)
				}]
			});
			worker.export({
//				filterdata : false,
				selected : false,
				exportHidden : false,
				useGridColumnWidth: true,
				merge : false
			});
			$('#'+gridId).alopexGrid('hideProgress');
		}

	}

	function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};

		var size = 0;

		for (var a = 0; a < Data.length; a++) {
			var stat = true;

			//id/pwd는 한건만 표시해준다
			if(Data[a].lginId != undefined){
				var lginId = Data[a].lginId.split(',');

				eval("Data["+a+"].lginId = lginId[0]");
			}

			if(Data[a].lginPwd != undefined){
				var lginPwd = Data[a].lginPwd.split(',');

				eval("Data["+a+"].lginPwd = lginPwd[0]");
			}

			if(Data[a].portVal != undefined){
				var portVal = Data[a].portVal.split(',');

				for(var b=0; b < portVal.length; b++){
					eval("Data["+a+"].portVal"+b+" = portVal["+b+"]");
				}

				//최대 포트수를 가져오기위함
				if(size < portVal.length){
					size = portVal.length;
				}
			}

			if(Data[a].portUseYn != undefined){
				var portUseYn = Data[a].portUseYn.split(',');

				for(var b=0; b < portUseYn.length; b++){
					eval("Data["+a+"].portUseYn"+b+" = portUseYn["+b+"]");
				}
			}

			if(Data[a].curObjVal != undefined){
				var curObjVal = Data[a].curObjVal.split(',');

				for(var b=0; b < curObjVal.length; b++){
					eval("Data["+a+"].curObjVal"+b+" = curObjVal["+b+"]");
				}
			}

			if(Data[a].portTypVal != undefined){
				var portTypVal = Data[a].portTypVal.split(',');

				for(var b=0; b < portTypVal.length; b++){
					eval("Data["+a+"].portTypVal"+b+" = portTypVal["+b+"]");
					eval("Data["+a+"].portTypNm"+b+" = portTypVal["+b+"]");
				}
			}

			if(Data[a].lnkgStatVal != undefined){
				var lnkgStatVal = Data[a].lnkgStatVal.split(',');

				for(var b=0; b < lnkgStatVal.length; b++){
					eval("Data["+a+"].lnkgStatVal"+b+" = lnkgStatVal["+b+"]");

					if(lnkgStatVal[b] != "connected" && lnkgStatVal[b] != "disconnected"){
						stat = false;
					}else{
						if(Data[a].portUseYn != undefined){
							var portUseYn = Data[a].portUseYn.split(',');
							if(lnkgStatVal[b] == "disconnected" && portUseYn[b] != "미사용"){
								stat = false;
							}
						}else{
							if(lnkgStatVal[b] == "disconnected"){
								stat = false;
							}
						}
					}
				}
			}else{
				stat = false;
			}

			if(Data[a].dcnClctTime != undefined){
				var dcnClctTime = Data[a].dcnClctTime.split(',');

				for(var b=0; b < dcnClctTime.length; b++){
					eval("Data["+a+"].dcnClctTime"+b+" = dcnClctTime["+b+"]");
				}
			}

			var status = "";
			if(stat){
				status = "정상";
			}else{
				status = "비정상";
			}

			eval("Data["+a+"].status = status");

		}

		//가변적으로 컬럼을 보여주기 위함
		for (var s = 0; s < 10; s++) {
			if(s < size){
				$('#'+gridId).alopexGrid('showCol', 'portVal'+s);
				$('#'+gridId).alopexGrid('showCol', 'portTypNm'+s);
				$('#'+gridId).alopexGrid('showCol', 'portUseYn'+s);
				$('#'+gridId).alopexGrid('showCol', 'curObjVal'+s);
				$('#'+gridId).alopexGrid('showCol', 'lnkgStatVal'+s);
				$('#'+gridId).alopexGrid('showCol', 'dcnClctTime'+s);
			}else{
				$('#'+gridId).alopexGrid('hideCol', 'portVal'+s, 'conceal');
				$('#'+gridId).alopexGrid('hideCol', 'portTypNm'+s, 'conceal');
				$('#'+gridId).alopexGrid('hideCol', 'portUseYn'+s, 'conceal');
				$('#'+gridId).alopexGrid('hideCol', 'curObjVal'+s, 'conceal');
				$('#'+gridId).alopexGrid('hideCol', 'lnkgStatVal'+s, 'conceal');
				$('#'+gridId).alopexGrid('hideCol', 'dcnClctTime'+s, 'conceal');
			}
		}

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

		var hideColList = ['eqpMdlId', 'eqpStatCd', 'eqpRoleDivCd', 'bpId', 'jrdtTeamOrgId', 'opTeamOrgId'];

		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
		$('#'+gridIdExcel).alopexGrid("hideCol", hideColList, 'conceal');
	}

	this.setGrid = function(page, rowPerPage){
		//조회버튼 누르면 버튼상태 비활성화
		$('#btnDcnNode').setEnabled(false);
		$('#btnDcnPort').setEnabled(false);

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		var param =  $("#searchForm").getData();

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnMgmt', param, 'GET', 'search');
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