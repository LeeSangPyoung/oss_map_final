/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var eqpGunCdList;
	var barAplyList	= [];
	var eqpGunList = [];
	var eqpRoleDivList = [];
	var eqpGunClList = [];
	var rowIndex	= 0;
	var gridEqpRoleObjectList = [];


	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setRegDataSet(param);
		setEventListener();
	};

	function setRegDataSet(data) {



	}

	//Grid 초기화
	function initGrid(strGubun) {

		var mappingN =  [
			{key: 'check', align: 'center', width: '40px', selectorColumn : true},
			{
				key : 'barAplyYn',
				align:'center',
				title : '바코드구분',
				width: '80px',
				render : { type: 'string',
					rule: function (value,data){
						var render_data = [];
						if (barAplyList.length > 0) {
							return render_data = render_data.concat( barAplyList );
						}else{
							return render_data.concat({value : data.barAplyYn, text : data.barAplyNm});
						}
					}
				},
				editable : { type: "select", rule: function(value, data) { return barAplyList; },
					attr : {
						style : "width: 98%;min-width:98%;padding: 1px 1px;"
					}
				},
				allowEdit : function(value,data,mapping) {
					return (editableChk(data));
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "";
				}
				}
			},
			{
				key : 'eqpMatlSrno',
				align:'center',
				title : '자재코드',
				width: '100px',
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "";
				}
				},
				colspan : function(value,data,mapping) {
					if( typeof value == "undefined" || value === null){
						return 1;
					} else {
						return 2;
					}
				},
			},
			{
				key     : 'eqpMatlSrnoIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'eqpMatlSrnoIcon'},
				resizing: false,
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "LightYellow";
					}
				}

			},
			{
				key : 'eqpGunCd',
				align:'center',
				title : '장비군',
				width: '120px',
				render : {  type: "string",
					rule: function (value,data){
						var render_data = [];
						if( typeof value == "undefined" || value === null){
							data.eqpGunCd = "";
						}
						if (eqpGunList.length > 0) {
							return render_data = render_data.concat( eqpGunList );
						}else{
							return render_data.concat({value : data.eqpGunCd, text : data.eqpGunNm});
						}
					}
				},
				editable : { type: "select", rule: function(value, data) { return eqpGunList; },
					attr : {
						style : "width: 98%;min-width:98%;padding: 1px 1px;"
					}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "LightYellow";
				}
				}
			},
			{
				key : 'eqpRoleDivCd',
				align:'center',
				title : '장비타입',
				width: '120px',
				render : {  type: "string",
					rule: function (value,data){

						var render_data = [{ value : '', text : '선택'}];
						var currentData = AlopexGrid.currentData(data);
						var eqpRoleListCmb = grdEqpRoleDivCmb(currentData.eqpGunCd);

						if( typeof value == "undefined" || value === null){
							data.eqpRoleDivCd = "";
						}
						if (eqpRoleListCmb.length > 0) {
							return render_data = render_data.concat( eqpRoleListCmb );
						}else{
							return render_data;
						}
					}
				},
				editable : { type: "select",
					rule: function(value, data) {
						var editing_data = [{ value : '', text : '선택'}];
						var currentData = AlopexGrid.currentData(data);
						var eqpRoleListCmb = grdEqpRoleDivCmb(currentData.eqpGunCd);

						return editing_data.concat( eqpRoleListCmb );
					},
					attr : {
						style : "width: 98%;min-width:98%;padding: 1px 1px;"
					}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "LightYellow";
					}
				}
			},
			{
				key : 'eqpGunClVal',
				align:'center',
				title : '자재분류',
				width: '80px',
				render : {  type: "string",
					rule: function (value,data){
						var render_data = [];
						if( typeof value == "undefined" || value === null){
							data.eqpGunClVal = "";
						}
						if (eqpGunClList.length > 0) {
							return render_data = render_data.concat( eqpGunClList );
						}else{
							return render_data.concat({value : data.eqpGunClVal, text : data.eqpGunClVal});
						}
					}
				},
				editable : { type: "select", rule: function(value, data) { return eqpGunClList; },
					attr : {
						style : "width: 98%;min-width:98%;padding: 1px 1px;"
					}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "LightYellow";
				}
				}
			},
			{key : 'barMatlNm', align:'center', title : '자재명', width: '250px', editable: false},
			{
				key : 'eqpMatlUprc',
				align:'center',
				title : '단가(원)',
				width: '80px',
				render : function(value, data, render, mapping){

					if(isEmpty(value) || value == 0) {
						return "0";
					}
					else {
						return main.setComma(value);
					}

				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				},
				inlineStyle : {background: function(value,data,mapping) {
					return (data.flag == "ADD")? "LightYellow" : "LightYellow";
				}
				}
			},
			{key : 'vendVndrNm', align:'center', title : '제조사', width: '140px'},
			{key : 'splyVndrNm', align:'center', title : '공급사', width: '140px'},
			//flag
			{key   : 'flag', title : '상태', align : 'center',width : '60px', hidden: true}
			];



		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				hidePageList: true,  // pager 중앙 삭제
				pagerSelect: false  // 한 화면에 조회되는 Row SelectBox 삭제
			},
			defaultColumnMapping:{
				sorting : true
			},
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			preventScrollPropagation:true,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: false,
			leaveDeleted: true,
			headerGroup: [
				{fromIndex:'eqpMatlSrno', toIndex:'eqpMatlSrnoIcon', title:"자재코드", hideSubTitle:true}
				],
				renderMapping:{
					"eqpMatlSrnoIcon" :{
						renderer : function(value, data, render, mapping) {
							var currentData = AlopexGrid.currentData(data);
							return "<span class='Icon Search' style='cursor: pointer'></span>";
						}
					},
				},
				columnMapping : mappingN,
				message: {/* 데이터가 없습니다.      */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
		});

//		gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {

		// 바코드 구분
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03082', null, 'GET', 'barAplyYn');

		// 장비군
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03085', null, 'GET', 'eqpGunCd');

		// 장비타입
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/EQPGUN', null, 'GET', 'eqpRoleDivCd');

		// 자재분류
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/INVECL', null, 'GET', 'eqpGunClVal');
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
			var valid =$('#searchForm').validator();
			if(!valid.validate()) {
				var errorstr = '';
				var alias = '';
				var errormessages = valid.getErrorMessage();
				for (var name in errormessages) {
					alias = "["+$("#"+name).attr("data-alias")+"]은(는) ";

					for (var i=0; i < errormessages[name].length; i++) {
						errorstr = alias + errormessages[name][i];
					}

					if(errorstr != ''){
						break;
					}
				}

				callMsgBox('returnMessage','W', errorstr , btnMsgCallback);
				return true;
			}

			main.setGrid(1,perPage);
		});

		//엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				main.setGrid(1,perPage);
			}
		});

		// 장비비군 멀티 Select
		$('#eqpGunCdList').multiselect({
			open: function(e){
				eqpGunCdList = $("#eqpGunCdList").getData().eqpGunCdList;
			},
			beforeclose: function(e){
				var codeID =  $("#eqpGunCdList").getData();
				var param = "comGrpCd=EQPGUN";

				if(eqpGunCdList+"" != codeID.eqpGunCdList+""){

					for(var i=0; codeID.eqpGunCdList.length > i; i++){
						param += "&etcAttrValMlt1=" + codeID.eqpGunCdList[i];
					}
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd', param,'GET', 'eqpRoleDivCd');

				}
			}
		});

		//첫번째 row를 클릭했을때 팝업 이벤트 발생
		$('#'+gridId).on('click', '.bodycell', function(e){
			var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridId).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			rowIndex = dataObj._index.row;
			if(rowData._key == "eqpMatlSrnoIcon" ){
				if(dataObj.flag != "ADD"){ return false;};

				var param = $('#searchForm').getData();
//				var param = dataObj

				$a.popup({
					popid: "DsnMatlMstMgmtPop",
					title: "장비자재 마스터 조회",
					url: "/tango-transmission-web/constructprocess/invemgmt/DsnMatlMstMgmtPop.do",
					//iframe: false,
					windowpopup: true,
					width: 1200,
					height: 650,
					movable : true,
					callback: function(data) {

						//자재코드 중복체크
						if( !eqpMatlSrnoChk(dataObj) ){
							$('#'+gridId).alopexGrid("dataEdit", {
								barMatlNm : ''
							}, {_index:{data : rowIndex}});
						}else{
							data.eqpMatlSrno = data.namsMatlCd;
							httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtMatlNm', data, 'GET', 'matlMstNmSearch');
						}
					}
				});
			}


		});

		// 행추가
		$("#btnAddRow").on("click", function(e) {
			var option 		= {_index:{data : 0}};
			var initRowData	= [];

			var option = {_index:{data : 0}};

			var initRowData = [{"barAplyYn": "",
				"eqpGunCd" : "",
				"eqpRoleDivCd": "",
				"eqpGunClVal" : "",
				"eqpMatlUprc": "0",
				"vendVndrNm" :"",
				"splyVndrNm": "",
				"flag" : 'ADD'
			}];
			$('#'+gridId).alopexGrid('dataAdd', initRowData, option);
			$('#'+gridId).alopexGrid('rowSelect', option, true);
		});

		// 행 삭제
		$("#btnDeleteRow").on("click", function(e) {
			var rowData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});

			if (rowData.length == 0) {
				callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.", btnMsgCallback);
				return;
			}

			for(var i=0; i < rowData.length; i++){
				if (rowData[i].flag == 'ADD') {
					$('#'+gridId).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

				} else if(rowData[i].flag == 'MOD' || isEmpty(rowData[i].flag)) {
					$('#'+gridId).alopexGrid('cellEdit','DEL',{ _index : { data : rowData[i]._index.row } },'flag');
					$('#'+gridId).alopexGrid("dataDelete", { _index : { data : rowData[i]._index.row } });
				}
			}
		});

		// 셀 수정시
		$('#'+gridId).on('cellValueEditing', function(e) {
			var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var mapping = ev.mapping;
			if( mapping.key == "barAplyYn" ||
					mapping.key == "eqpGunCd" ||
					mapping.key == "eqpGunKndVal" ||
					mapping.key == "eqpRoleDivCd" ||
					mapping.key == "eqpGunClVal" ||
					mapping.key == "eqpMatlUprc"
			) {

				if(isEmpty(dataObj.flag)) {
					$('#'+gridId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
				}
				$('#'+gridId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
			}
		});

		//스크롤 내렸을떄 재 검색
		$('#'+gridId).on('scrollBottom', function(e) {
			var pageInfo = $('#'+gridId).alopexGrid("pageInfo");

			if(pageInfo.dataLength != pageInfo.pageDataLength){

				$('#'+gridId).alopexGrid('showProgress');

				$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
				$('#rowPerPage').val($('#rowPerPage').val());

//				var param = $("#searchForm").getData();
				var param =  $("#searchForm").serialize();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtListForPage', param, 'GET', 'searchForPageAdd');
			}

		});


		//저장버튼 클릭
		$("#btnSave").on("click", function(e) {
			$('#'+gridId).alopexGrid('endEdit'); // 편집종료

			var gridData = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', { _state : { selected : true }}));

			if (gridData.length < 1) {// 선택한 데이터가 존재하지 않을 시
				callMsgBox('btnMsgWarning','W', "반영할 항목이 없습니다.", btnMsgCallback);
				return;
			} else {
				for (var i=0;i < gridData.length; i++) {
					var barAplyYn 		= gridData[i].barAplyYn; 			//바코드구분
					var eqpMatlSrno 	= gridData[i].eqpMatlSrno; 			//자재코드
					var eqpGunCd 		= gridData[i].eqpGunCd; 			//장비군코드
					var eqpRoleDivCd 	= gridData[i].eqpRoleDivCd; 			//장비군코드
					var eqpGunKndVal 	= gridData[i].eqpGunKndVal; 		//장비군종류값
					var eqpGunClVal 	= gridData[i].eqpGunClVal; 			//장비군분류값
					var barMatlNm 		= gridData[i].barMatlNm; 			//자재명
					var eqpMatlUprc 	= gridData[i].eqpMatlUprc;			//자재단가

					//바코드구분 체크
					if(isEmpty(barAplyYn)){
						callMsgBox('btnMsgWarning','I', "바코드구분을 선택해 주십시오.");
						return false;
					}

					//자재코드 체크
					if(isEmpty(eqpMatlSrno)){
						callMsgBox('btnMsgWarning','I', "자재코드를 입력해 주십시오.");
						return false;
					}

					//자재명 체크
					if(isEmpty(barMatlNm)){
						callMsgBox('btnMsgWarning','I', "자재명을 입력해 주십시오.");
						return false;
					}

					//자재단가
					if(isEmpty(eqpMatlUprc) || Number(eqpMatlUprc) <= 0){
						callMsgBox('btnMsgWarning','I', "자재단가 값은 0 이상이어야 합니다.");
						return false;
					}

					var saveMsg = "저장 하시겠습니까?";
						if( gridData[i].flag == "DEL" ){
							saveMsg = "삭제 데이터는 관련 업체별 연초기준 및 차수정보 모두 삭제 됩니다.<br><br>계속 진행 하겠습니까?"
						}
				}
				callMsgBox('saveConfirm','C', saveMsg, btnMsgCallback);
			}

		});

		// 엑셀 업로드
		$("#btnExcelUpLoad").on("click", function(e) {

			var param = $("#searchForm").getData();
			var bpNm = '${userInfo.bpNm}';
			var bpId = '${userInfo.bpId}';
			var hdofcOrgId = param.hdofcOrgId;
			var userId = '${userInfo.userId}';

			$('#'+gridId).alopexGrid('showProgress');

			$('#'+gridId).alopexGrid("endEdit");

			$a.popup({
				popid: "trmsMatlMstMgmtExcelUp",
				title: "<spring:message code='label.excelUpload'/>",
				url: "/tango-transmission-web/configmgmt/matlmgmt/TrmsMatlMstMgmtExcelUpload.do",
				//iframe: false,
				windowpopup: true,
				width: 450,
				height: 335,
				movable : true,
				callback: function(data) {
					// 업로드 데이터 존재시
					if(isNotEmpty(data) && data.length > 0) {
						var option = {_index:{data : 0}};

						for(var i=0;i<data.length;i++){

							if( typeof data[i].eqpGunCd == "undefined" || data[i].eqpGunCd === null){
								data[i].eqpGunCd = "";
							}

							data[i].flag = 'ADD';

						}
						$('#'+gridId).alopexGrid('dataSet', data);
						$('#'+gridId).alopexGrid('rowSelect', {_state: {selected: false}} ,true);
					}
					$('#'+gridId).alopexGrid('hideProgress');
				}
			});
		});

		// 엑셀 다운로드
		$("#btnExportExcel").on("click", function(e) {
			var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
					return;
			}

			var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();

	   		if ($("#eqpGunCdList").val() != "" && $("#eqpGunCdList").val() != null ){
       			param.eqpGunCdList = $("#eqpGunCdList").val() ;
       		 }else{
       			param.eqpGunCdList = [];
       		 }


	   		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = '전송자재마스터관리_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getTrmsMatlMstMgmtList";
	   		param.excelFlag = "TrmsMatlMstMgmtList";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
  		 	$('#'+gridId).alopexGrid('showProgress');
  		 	console.log("Excel param : ", param);
  		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
		});




	};


	function successCallback(response, status, jqxhr, flag){

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		// 바코드구분
		if(flag == 'barAplyYn'){

			$('#barAplyYn').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
			barAplyList.push({"text":"선택","value":""});

			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				barAplyList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#barAplyYn').setData({
				data:option_data
			});

		}

		// 장비군
		if(flag == 'eqpGunCd'){

			$('#eqpGunCdList').clear();

			var option_data =  [];
			eqpGunList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpGunList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpGunCdList').setData({
				data:option_data
			});
		}

		// 장비 타입
		if(flag == 'eqpRoleDivCd'){

			$('#eqpRoleDivCd').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}


			for(var i=0; i<response.length; i++){
				var resObj = response[i];

				var tmp = [];
				var gridObject={};

				if (gridEqpRoleObjectList.length == 0) {

					gridEqpObject = {
							eqpGun : resObj.etcAttrVal1,
							list : [{"text":resObj.comCdNm,"value":resObj.comCd}]
					}

					gridEqpRoleObjectList.push(gridEqpObject);

				} else {
					var exstcYn = "N";
					var dupChkYn = "N";
					for (var j=0; j < gridEqpRoleObjectList.length; j++) {
						for (gridEqpGun in gridEqpRoleObjectList[j]) {
							if (gridEqpRoleObjectList[j][gridEqpGun] == resObj.etcAttrVal1) {
								for (k=0; k < gridEqpRoleObjectList[j]["list"].length; k++) {
									var dupText = gridEqpRoleObjectList[j]["list"][k].value;

									if (dupText == resObj.comCd) {
										dupChkYn = "Y";
										break;
									}

								}
								if (dupChkYn == "N"){
									gridEqpRoleObjectList[j]["list"].push({"text":resObj.comCdNm,"value":resObj.comCd})

								}

								exstcYn = "Y";
								break;
							}
						}
					}

					if (exstcYn == "N") {
						gridEqpObject = {
								eqpGun : resObj.etcAttrVal1,
								list : [{"text":resObj.comCdNm,"value":resObj.comCd}]
						}
						gridEqpRoleObjectList.push(gridEqpObject);
					}

				}

			}

			$('#eqpRoleDivCd').setData({
				data:option_data
			});
		}

		//자재 분류
		if(flag == 'eqpGunClVal'){

			$('#eqpGunClVal').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
			eqpGunClList.push({"text":"선택","value":""});

			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpGunClList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpGunClVal').setData({
				data:option_data
			});
		}

		if(flag == 'search'){

			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.matlMgmtList);

		}

		if(flag == 'searchForPageAdd'){

			$('#'+gridId).alopexGrid('hideProgress');
			setSPADDGrid(gridId, response, response.matlMgmtList);

		}

		if(flag == 'saveTrmsMatlMstMgmt'){

			$('#'+gridId).alopexGrid('hideProgress');

			if (response.returnCode == "200") {
				callMsgBox('','I', response.returnMessage,function(){
					$('#btnSearch').click();
				});
			} else {
				callMsgBox('btnMsgWarning','W', response.returnMessage, btnMsgCallback);
			}

		}

		if(flag == 'matlMstNmSearch'){

			if(response.matlMgmtMaltNm !=null && response.matlMgmtMaltNm != undefined){
				$('#'+gridId).alopexGrid("dataEdit", {
					eqpMatlSrno : response.matlMgmtMaltNm.eqpMatlSrno,
					barMatlNm : response.matlMgmtMaltNm.barMatlNm,
					barAplyYn : response.matlMgmtMaltNm.barAplyYn,
					vendVndrNm : response.matlMgmtMaltNm.vendVndrNm,
					splyVndrNm : response.matlMgmtMaltNm.splyVndrNm,
					eqpRoleDivCd : response.matlMgmtMaltNm.eqpRoleDivCd,
					eqpGunCd : response.matlMgmtMaltNm.eqpGunCd
				}, {_index:{data : rowIndex}});
			}else{
				$('#'+gridId).alopexGrid("dataEdit", {
					eqpMatlSrno : '',
					barMatlNm : '',
					barAplyYn : '',
					vendVndrNm: '',
					eqpRoleDivCd: '',
					eqpGunCd: ''
				}, {_index:{data : rowIndex}});
			}

		}

	}

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id" && gridHeader[i].key != "check" && gridHeader[i].key != "eqpMatlSrnoIcon")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
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

	function setSPADDGrid(GridID,Option,Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};

		$('#'+GridID).alopexGrid('dataAdd', Data, serverPageinfo);

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

		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtListForPage', param, 'GET', 'search');
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

	var editableChk = function (data){
		var currentData = AlopexGrid.currentData(data);
		return (currentData.flag == "ADD"? true: false);
	};


	this.setComma = function(str) {
		str = String(str);
		return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}

	$(document).on('keypress', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
		var _value = $(this).val();

		if (event.keyCode < 48 || event.keyCode > 57) {

			if (event.keyCode != 46 && event.keyCode != 45) {
				return false;
			}
		}
		var _pattern = /^[-\]?\\d*[.]\d*$/;	// . 체크

		if(_pattern.test(_value)) {
			if(charCode == 46) {
				return false;
			}
		}

//		var _pattern1 = /^[-\]?\\d*[.]\d{3}$/;	// 소수점 3자리까지만
//		if(_pattern1.test(_value)) {
//		return false;
//		}
		return true;
	});

	$(document).on('keyup', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which :event.keyCode;

		if (charCode ==8 || charCode == 46 || charCode == 37 || charCode ==39) {
			return;
		}
		else {
			//evt.target.value = evt.target.value.replace(/[^0-9\.]/g,"");

			var str = evt.target.value.replace(/[^-0-9\.]/g,"");

			if (str.lastIndexOf("-") > 0) {
				if (str.indexOf("-") == 0) {
					str = "-"+str.replace(/[-]/gi,'');
				} else {
					str = str.replace(/[-]/gi,'');
				}
			}
			evt.target.value = str;
		}
	});

	var eqpMatlSrnoChk = function (dataObj){
		var gridData = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet'));
		var row	= dataObj._index.row;

		for(var i=0; i < gridData.length; i++){
			if( row == i){
				continue;
			}

			if( $.trim(gridData[i].eqpMatlSrno) == $.trim(dataObj.eqpMatlSrno)){
				callMsgBox('btnMsgWarning','I', "동일한 자재코드가 존재합니다.");
				return false;
			}
		}

		return true;
	};

	function grdEqpRoleDivCmb(value) {
		var returnDate = [];

		for (var i=0; i < gridEqpRoleObjectList.length; i++) {
			for (gridEqpGun in gridEqpRoleObjectList[i]) {
				if (gridEqpRoleObjectList[i][gridEqpGun] == value) {
					returnDate = gridEqpRoleObjectList[i]["list"]
					break;
				}
			}
		}

		return returnDate;

	}

	// 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('saveConfirm' == msgId && 'Y' == msgRst) {
			var gridData = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', function(data) {
				if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD') && (data._state.selected == true)) {
					return data;
				}
			}));

			for (var i=0;i < gridData.length; i++) {
				//자재명 체크
				if(isEmpty(gridData[i].barMatlNm)){
					callMsgBox('btnMsgWarning','I', "자재명을 입력해 주십시오.");
					return false;
				}
			}

			$('#'+gridId).alopexGrid('showProgress');

//			httpRequest(m.api.save, gridData, 'POST', 'afterSave');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/saveTrmsMatlMstMgmt', gridData, 'POST', 'saveTrmsMatlMstMgmt');
		}

	};

	// 입력된 객체가 null 또는 빈값이면 true를 반환
	var isEmpty = function(sStr) {
		if (undefined == sStr || null == sStr) return true;
		if ($.isArray(sStr)) {
			if (sStr.length < 1) return true;
		}
		if ('string' == typeof sStr ) {
			if ('' == sStr) return true;
		}
		return false;
	}

	var isNotEmpty = function(sStr) {
        return !isEmpty(sStr);
    }

	 function onDemandExcelCreatePop ( jobInstanceId ){
	        // 엑셀다운로드팝업
	         $a.popup({
	                popid: 'CommonExcelDownlodPop' + jobInstanceId,
	                title: '엑셀다운로드',
	                iframe: true,
	                modal : false,
	                windowpopup : true,
	                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
	                data: {
	                    jobInstanceId : jobInstanceId,
	                    fileName : fileOnDemendName,
	                    fileExtension : "xlsx"
	                },
	                width : 500,
	                height : 300
	                ,callback: function(resultCode) {
	                    if (resultCode == "OK") {
	                        //$('#btnSearch').click();
	                    }
	                }
	            });
		}

});