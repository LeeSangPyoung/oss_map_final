/**
 *
 * @author Administrator
 * @date 2023. 10. 29.
 * @version 1.0
 */
let perPage = 100;
let gridId = "lnoGrid";
let addcnt = 0;
let nextSeq;

let main = $a.page(function() {
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	sessionStorage.setItem('param', JSON.stringify(param));

    	MwLnoControll.initialize(param);

    	MwLnoControll.setEventListener();
    }
});

let MwLnoControll = {
	initialize: function(param) {

		MwLnoControll.setSelectCode();     //select 정보 세팅
		MwLnoControll.initGrid();

//		MwLnoControll.getMwLnoInfoList(param, 1, perPage);
	},

	getAddRowCnt: function(cnt) {
		nextSeq = cnt;
		addcnt++;
		return nextSeq;
	},

	//ML00000000002
//	getMwLnoNextId: function(cnt) {
//		if(cnt === 0) {
//			Util.jsonAjax({
//				url: '/transmisson/tes/engineeringmap/mwlno/getMwLnoNextId',
//				method:'GET',
//				async:false
//				}).done(
//				function(response) {
//					nextId = response.lnoNextId;
//				}.bind(this)
//			);
//		} else {
//			nextId = MwLnoControll.getGridNextLnoId();
//		}
//
//		return nextId;
//
//	},
//
//	getGridNextLnoId: function () {
//		let data = $("#"+gridId).alopexGrid('dataGet');
//		let maxnum = data.reduce((max, item) => {
//			const number = parseInt(item.mwLnoId.slice(2), 10);
//			return Math.max(max, number);
//		}, -Infinity);
//
//		let nextnum = maxnum + 1;
//		let nextId = `ML${String(nextnum).padStart(11, '0')}`;
//
//		return nextId;
//	},

	// 선번 정보 조회
	getMwLnoInfoList: function(param, page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		$('#'+gridId).alopexGrid('dataEmpty');
		$('#'+gridId).alopexGrid('showProgress');

		param =  $("#searchForm").serialize();

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/mwlno/getMwLnoInfoList',
			data:param,
			method:'GET',
			async:true
			}).done(
			function(response) {

				let serverPageinfo = {};

				$('#'+gridId).alopexGrid('hideProgress');
	    		serverPageinfo = {
	    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
	    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
	    		};

	    		$('#'+gridId).alopexGrid('dataSet', response.lnoList, serverPageinfo);

			}.bind(this)
		);
	},

	setSelectCode: function() {

	},

	getLastNumber: function(str) {
		const match = str.match(/(\d+)(?!.*\d)/);
		return match? match[0]: null;
	},

	isEmpty: function (str) {
		if (typeof str == "undefined" || str == null || str == "") {
			return true;
		} else {
			return false;
		}
	},

	// 버튼 콜백 funtion
	btnMsgCallback : function (msgId, msgRst) {
		if ('saveConfirm' == msgId && 'Y' == msgRst) {
			var gridData = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', { _state : { selected : true }}, function(data) {
				if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD') && (data._state.selected == true)) {
					return data;
				}
			}));

			let saveData = [];
			let addDataList = [];
			let modDataList = [];
			let delDataList = [];

			// 중복 제거
			addDataList = gridData.filter((item, index, self) => index === self.findIndex((t)=> t.addSeq === item.addSeq && t.flag === 'ADD'));
			modDataList = gridData.filter((item, index, self) => index === self.findIndex((t)=> t.mwLnoId === item.mwLnoId && t.flag === 'MOD'));
			delDataList = gridData.filter((item, index, self) => index === self.findIndex((t)=> t.mwLnoId === item.mwLnoId && t.flag === 'DEL' ));

			saveData = addDataList.concat(modDataList, delDataList);

			$('#'+gridId).alopexGrid('showProgress');

			MwLnoControll.saveMwLnoInfoList(saveData);
		}

	},

	saveMwLnoInfoList: function (gridData) {
		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/mwlno/saveMwLnoInfoList',
			data: gridData,
			method:'POST',
			async:false
			}).done(
			function(response) {
				$('#'+gridId).alopexGrid('hideProgress');
				if(response.code === "ok") {
					callMsgBox('','I', "저장되었습니다.", function(msgId, msgRst){});
					$('#btnSearch').click();
				} else if(response.code === "fail") {
					callMsgBox('','I', "반영할 항목이 없습니다.", function(msgId, msgRst){});
				} else {
					callMsgBox('','I', "실패하였습니다.", function(msgId, msgRst){});
				}
			}.bind(this)
		);
    },

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    setEventListener : function() {

    	let mod = false;

    	let perPage = 100;

    	// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
    		let param = JSON.parse(sessionStorage.getItem('param'));
			let eObj = AlopexGrid.parseEvent(e);
			MwLnoControll.getMwLnoInfoList(param, eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
    		let param = JSON.parse(sessionStorage.getItem('param'));
			let eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
    		MwLnoControll.getMwLnoInfoList(param, 1, eObj.perPage);
		});

    	//저장버튼 클릭
		$("#btnSave").on("click", function(e) {
			$('#'+gridId).alopexGrid('endEdit'); // 편집종료

			var gridData = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', { _state : { selected : true }}, function(data) {
				if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD') && (data._state.selected == true)) {
					return data;
				}
			}));

			for(let i=0; i<gridData.length; i++) {
				const item = gridData[i];
				if (item.flag != 'DEL') {
					// 선번명 체크
					if (MwLnoControll.isEmpty(item.mwLnoNm)){
						callMsgBox('btnMsgWarning','I', "선번명을 입력해 주십시오.");
						return false;
					}

					// M/W구간 유무 여부에 따른 채널 체크
					for(const key of Object.keys(item)) {
						if (key.startsWith("mwSctnId")) {
							const keyNum = `${key.slice(8)}`;
							const mwChnlNoValKey = "mwChnlNoVal" + keyNum;
							if (!(mwChnlNoValKey in item) || item[key] != "" && item[mwChnlNoValKey] == "") {
								callMsgBox('btnMsgWarning','I', "구간" + keyNum + " 채널을 선택해 주십시오.");
								return false;
							}
						}
					}
				}
			}

			if (gridData.length < 1) {// 선택한 데이터가 존재하지 않을 시
				callMsgBox('btnMsgWarning','W', "선택된 데이터가 없습니다.", MwLnoControll.btnMsgCallback);
				return;
			} else {
				callMsgBox('saveConfirm','C', configMsgArray['saveConfirm'], MwLnoControll.btnMsgCallback);
			}
		});

		// 행추가
		$("#btnAddRow").on("click", function(e) {
			var option 		= {_index:{data : 0}};
			var initRowData	= [];

			var option = {_index:{data : 0}};

			var initRowData = [{
				"mwLnoId": "",
				"mwLnoNm":"",
				"areaNm":"",
				"umtsoNm":"",
				"lmtsoNm":"",
				"bkhlStaEqpNm":"",
				"bkhlStaPortNm":"",
				"bkhlEndEqpNm":"",
				"bkhlEndPortNm":"",
				"mwSctnId1":"",
				"mwSctnNm1":"",
				"mwChnlNoVal1":"",
				"mwSctnId2":"",
				"mwSctnNm2":"",
				"mwChnlNoVal2":"",
				"mwSctnId3":"",
				"mwSctnNm3":"",
				"mwChnlNoVal3":"",
				"mwSctnId4":"",
				"mwSctnNm4":"",
				"mwChnlNoVal4":"",
				"mwSctnId5":"",
				"mwSctnNm5":"",
				"mwChnlNoVal5":"",
				"mwSctnId6":"",
				"mwSctnNm6":"",
				"mwChnlNoVal6":"",
				"mwSctnId7":"",
				"mwSctnNm7":"",
				"mwChnlNoVal7":"",
				"mwSctnId8":"",
				"mwSctnNm8":"",
				"mwChnlNoVal8":"",
				"mwSctnId9":"",
				"mwSctnNm9":"",
				"mwChnlNoVal9":"",
				"mwSctnId10":"",
				"mwSctnNm10":"",
				"mwChnlNoVal10":"",
				"mwSctnId11":"",
				"mwSctnNm11":"",
				"mwChnlNoVal11":"",
				"mwSctnId12":"",
				"mwSctnNm12":"",
				"mwChnlNoVal12":"",
				"mwSctnId13":"",
				"mwSctnNm13":"",
				"mwChnlNoVal13":"",
				"mwSctnId14":"",
				"mwSctnNm14":"",
				"mwChnlNoVal14":"",
				"mwSctnId15":"",
				"mwSctnNm15":"",
				"mwChnlNoVal15":"",
				"mwSctnId16":"",
				"mwSctnNm16":"",
				"mwChnlNoVal16":"",
				"mwSctnId17":"",
				"mwSctnNm17":"",
				"mwChnlNoVal17":"",
				"mwSctnId18":"",
				"mwSctnNm18":"",
				"mwChnlNoVal18":"",
				"mwSctnId19":"",
				"mwSctnNm19":"",
				"mwChnlNoVal19":"",
				"mwSctnId20":"",
				"mwSctnNm20":"",
				"mwChnlNoVal20":"",
				"ntwkLineNo":"",
				"bkhlStaEqpId":"",
				"bkhlEndEqpId":"",
				"bkhlStaPortId":"",
				"bkhlEndPortId":"",
				"flag":"ADD",
				"addSeq" : MwLnoControll.getAddRowCnt(addcnt)
			}];
			$('#'+gridId).alopexGrid('dataAdd', initRowData, option);
			$('#'+gridId).alopexGrid('rowSelect', option, true);

			var rowData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		});

		// 행 삭제
		$("#btnDeleteRow").on("click", function(e) {
			var rowData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});

			if (rowData.length < 1) {
				callMsgBox('btnMsgWarning','W', "선택된 데이터가 없습니다.", MwLnoControll.btnMsgCallback);
				return;
			}

			for(var i=0; i < rowData.length; i++){
				if (rowData[i].flag == 'ADD') {
					$('#'+gridId).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

				} else if(rowData[i].flag == 'MOD' || MwLnoControll.isEmpty(rowData[i].flag)) {
					$('#'+gridId).alopexGrid('cellEdit','DEL',{ _index : { data : rowData[i]._index.row } },'flag');
					$('#'+gridId).alopexGrid("dataDelete", { _index : { data : rowData[i]._index.row } });
				}
			}
		});

		// excel download
    	$('#btnTesExportExcel').on('click', function(e) {
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
			}

			var param =  $("#searchForm").getData();

			param = MwLnoControll.gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 60;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();

			var now = new Date();
			var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
			var excelFileNm = 'MW선번정보_'+dayTime;
			param.fileName = excelFileNm;
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.excelMethod = "getTesMwLnoList";
			param.excelFlag = "TesMwLnoList";
			//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
			fileOnDemendName = excelFileNm+".xlsx";

			$('#'+gridId).alopexGrid('showProgress');
			MwLnoControll.httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
    	});

    	$('#btnSearch').on('click', function(e) {
    		let param = JSON.parse(sessionStorage.getItem('param'));
    		MwLnoControll.getMwLnoInfoList(param, 1, perPage);
     	});

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if(event.key === "Enter") {
				event.preventDefault();

	    		let param = JSON.parse(sessionStorage.getItem('param'));
	    		MwLnoControll.getMwLnoInfoList(param, 1, perPage);
			}
		});

		// 셀 수정시
		$('#'+gridId).on('cellValueEditing', function(e) {
			var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var mapping = ev.mapping;

			if(mapping.key != "check"){
				if(isEmpty(dataObj.flag)) {
					$('#'+gridId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
				}
				$('#'+gridId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
			}

		});

    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	$('#'+gridId).on('click', '.bodycell', function(e) {
    		let dataObj = AlopexGrid.parseEvent(e).data;
    		let rowIndex = dataObj._index.row;
    		let tmpPopId = "_"+Math.floor(Math.random() * 10) + 1;

    		if(!dataObj._key) {
    			return;
    		}

    		if(dataObj._key == "ntwkLineIcon") { // 링 조회 팝업
    			if(dataObj.flag != "ADD" && dataObj.flag != "MOD" && dataObj.flag != undefined && dataObj.flag != "undefined") {
    				return false;
    			}

				$a.popup({
		        	popid: 'linenum' + tmpPopId,
		        	title: '',
		            url: '/tango-transmission-web/configmgmt/cfline/RingListPop.do',
		            data: null,
				    modal: true,
//				    windowpopup : true,		// 사용시 alpoex 버그로 data가 계속 남아 있음
				    movable:false,
				    width : 1400,
				    height : window.innerHeight * 0.9,
		            callback: function (data) {
	            		if(data != null && data.ntwkLineNo) {
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					ntwkLineNo : data.ntwkLineNo,
		    					ntwkLineNm : data.ntwkLineNm
		    				}, {_index:{data : rowIndex}});
		    			}
//	            		else {
//		    				$('#'+gridId).alopexGrid("dataEdit", {
//		    					ntwkLineNo : "",
//		    					ntwkLineNm : ""
//		    				}, {_index:{data : rowIndex}});
//		    			}
	            		mod = true;
	            		mod = dataObjCheck(mod, dataObj, data);
	  				}
				});
    		}

    		if(dataObj._key == "bkhlStaEqpIcon") { // 시작장비 조회 팝업
				$a.popup({
				  	popid: 'popEqpSch' + tmpPopId,
				  	title: configMsgArray['equipment']/* 장비 조회 */,
				  	url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
					modal: true,
					movable:false,
//					windowpopup : true,
					width : 950,
					height : 750,
					callback: function(data){
						if(data != null && data.eqpId){
							// 장비 선택시 해당 포트 아이디 멀티 선택 박스보여줄 것.
							setTimeout(function() {
			    				$('#'+gridId).alopexGrid("dataEdit", {
			    					bkhlStaEqpId : data.eqpId,
			    					bkhlStaEqpNm : data.eqpNm
			    				}, {_index:{data : rowIndex}});
							}, 100);

		            		mod = true;
		            		mod = dataObjCheck(mod, dataObj, data);
						}
					}
				});
    		}

    		if(dataObj._key == "bkhlEndEqpIcon") { // 종료장비 조회 팝업
				$a.popup({
				  	popid: 'popEqpSch' + tmpPopId,
				  	title: configMsgArray['equipment']/* 장비 조회 */,
				  	url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
				  	modal: true,
					movable:false,
//					windowpopup : true,
					width : 950,
					height : 750,
					callback: function(data){
						if(data != null && data.eqpId){
							// 장비 선택시 해당 포트 아이디 멀티 선택 박스보여줄 것.
							setTimeout(function() {
			    				$('#'+gridId).alopexGrid("dataEdit", {
			    					bkhlEndEqpId : data.eqpId,
			    					bkhlEndEqpNm : data.eqpNm
			    				}, {_index:{data : rowIndex}});
							}, 100);

		            		mod = true;
		            		mod = dataObjCheck(mod, dataObj, data);
						}
					}
				});
    		}

    		if(dataObj._key == "bkhlStaPortIcon") { //시작장비 포트 리스트
    			let eqpId = dataObj.bkhlStaEqpId;

    			if(eqpId == "" || eqpId == null || eqpId == undefined) {
    				callMsgBox('','I', '선택된 백홀장비S가 없습니다.', function(msgId, msgRst){});
					return;
    			}

    			let param = {"eqpId" : eqpId};
    			$a.popup({
				  	popid: 'BckhlPortListPopup' + tmpPopId,
				  	title: "장비 포트 리스트",
				  	url: '/tango-transmission-web/trafficintg/engineeringmap/BckhlPortListPopup.do',
				  	data: param,
				  	modal: true,
					movable:false,
//					windowpopup : true,
					width  : 825,
					height : 735,
					callback: function(data) {
						if(data != null || data.portId) {
							setTimeout(function() {
			    				$('#'+gridId).alopexGrid("dataEdit", {
			    					bkhlStaPortId : data.portId,
			    					bkhlStaPortNm : data.portNm
			    				}, {_index:{data : rowIndex}});
							}, 1000);

		            		mod = true;
		            		mod = dataObjCheck(mod, dataObj, data);
						}
					}
				});
    		}

    		if(dataObj._key == "bkhlEndPortIcon") { //종료장비 포트 리스트
    			let eqpId = dataObj.bkhlEndEqpId;

    			if(eqpId == "" || eqpId == null || eqpId == undefined) {
    				callMsgBox('','I', '선택된 백홀장비E가 없습니다.', function(msgId, msgRst){});
					return;
    			}

    			let param = {"eqpId" : eqpId};
    			$a.popup({
				  	popid: 'BckhlPortListPopup' + tmpPopId,
				  	title: "장비 포트 리스트",
				  	url: '/tango-transmission-web/trafficintg/engineeringmap/BckhlPortListPopup.do',
				  	data: param,
				  	modal: true,
					movable:false,
//					windowpopup : true,
					width  : 825,
					height : 735,
					callback: function(data) {
						if(data != null || data.portId) {
							setTimeout(function() {
			    				$('#'+gridId).alopexGrid("dataEdit", {
			    					bkhlEndPortId : data.portId,
			    					bkhlEndPortNm : data.portNm
			    				}, {_index:{data : rowIndex}});
							}, 1000);

		            		mod = true;
		            		mod = dataObjCheck(mod, dataObj, data);
						}
					}
				});
    		}

    		if(dataObj._key.indexOf("mwSctnNmIcon") > -1) { // M/W 구간 조회 팝업
    			let seq = parseInt(MwLnoControll.getLastNumber(dataObj._key));
    			let idkey = `mwSctnId${seq}`;
    			let nmKey = `mwSctnNm${seq}`;
    			let mwSctnId = dataObj[idkey];
    			let param = {"mwSctnId" : mwSctnId};

    			$a.popup({
    				popid: 'DsnMwListPopup' + tmpPopId,
    				title: 'M/W 구간 조회',
    				url: '/tango-transmission-web/trafficintg/engineeringmap/DsnMwListPopup.do',
//    				iframe: false,
    				modal: true,
					movable:false,
					data: param,
//    				windowpopup: true,
    				width: 1450,
    				height: 800,
    				center: true,
					callback: function(data){
						switch (seq) {
						case 1:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId1 : data.mwSctnId,
		    					mwSctnNm1 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 2:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId2 : data.mwSctnId,
		    					mwSctnNm2 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 3:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId3 : data.mwSctnId,
		    					mwSctnNm3 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 4:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId4 : data.mwSctnId,
		    					mwSctnNm4 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 5:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId5 : data.mwSctnId,
		    					mwSctnNm5 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 6:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId6 : data.mwSctnId,
		    					mwSctnNm6 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 7:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId7 : data.mwSctnId,
		    					mwSctnNm7 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 8:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId8 : data.mwSctnId,
		    					mwSctnNm8 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 9:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId9 : data.mwSctnId,
		    					mwSctnNm9 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 10:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId10 : data.mwSctnId,
		    					mwSctnNm10 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 11:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId11 : data.mwSctnId,
		    					mwSctnNm11 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 12:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId12 : data.mwSctnId,
		    					mwSctnNm12 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 13:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId13 : data.mwSctnId,
		    					mwSctnNm13 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 14:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId14 : data.mwSctnId,
		    					mwSctnNm14 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 15:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId15 : data.mwSctnId,
		    					mwSctnNm15 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 16:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId16 : data.mwSctnId,
		    					mwSctnNm16 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 17:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId17 : data.mwSctnId,
		    					mwSctnNm17 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 18:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId18 : data.mwSctnId,
		    					mwSctnNm18 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 19:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId19 : data.mwSctnId,
		    					mwSctnNm19 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						case 20:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwSctnId20 : data.mwSctnId,
		    					mwSctnNm20 : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						default:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					idkey : data.mwSctnId,
		    					nmKey : data.mwSctnNm
		    				}, {_index:{data : rowIndex}});
							break;
						}

	            		mod = true;
	            		mod = dataObjCheck(mod, dataObj, data);
					}
    			});
    		}

    		if(dataObj._key.indexOf("mwChnlNoValIcon") > -1) { // 채널정보 멀티 선택 그리드 팝업
    			let seq = parseInt(MwLnoControll.getLastNumber(dataObj._key));
    			let idkey = `mwChnlNoVal${seq}`;
    			let mwSctnId = dataObj[`mwSctnId${seq}`];
    			let param = {"mwSctnId" : mwSctnId};

    			if(param.mwSctnId == "" || param.mwSctnId == null || param.mwSctnId == undefined) {
    				callMsgBox('','I', '선택된 M/W구간이 없습니다.', function(msgId, msgRst){});
					return;
    			}

    			$a.popup({
    				popid: 'MwChnlListPopup' + tmpPopId,
    				title: 'M/W 구간 채널 조회',
    				url: '/tango-transmission-web/trafficintg/engineeringmap/MwChnlListPopup.do',
//    				iframe: false,
    				modal: true,
					movable:false,
    				data: param,
//    				windowpopup: true,
    				width: 620,
    				height: 500,
    				center: true,
					callback: function(data) {

						let mwChnlNoVal = data.map(function(item) {
							return item.mwChnlNoVal;
						}).join(",");

						switch (seq) {
						case 1:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal1 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 2:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal2 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 3:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal3 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 4:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal4 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 5:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal5 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 6:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal6 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 7:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal7 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 8:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal8 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 9:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal9 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 10:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal10 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 11:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal11 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 12:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal12 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 13:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal13 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 14:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal14 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 15:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal15 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 16:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal16 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 17:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal17 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 18:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal18 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 19:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal19 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						case 20:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					mwChnlNoVal20 : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						default:
		    				$('#'+gridId).alopexGrid("dataEdit", {
		    					idkey : mwChnlNoVal,
		    				}, {_index:{data : rowIndex}});
							break;
						}

	            		mod = true;
	            		mod = dataObjCheck(mod, dataObj, data);
					}
    			});
    		}
    	});

    },
	// 통합 장비 정보 팝업
	eqpDtlComLkupPop: function (key){
		var mtsoGubun, linkTab = "";
		mtsoGubun = "eqp";
		linkTab = "tab_Eqp";

		var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		var paramData = {
				mtsoEqpGubun :mtsoGubun,
				mtsoEqpId : key,
				parentWinYn : 'Y',
				linkTab : linkTab
		};

		var popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			data: paramData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 1300,
			height : window.innerHeight * 0.83
		});
	},

	initGrid: function() {
		let titleList = [
			"M/W선번ID",
			"선번명",
			"지역",
			"상위국",
			"하위국",
			"링명",
			"백홀장비S",
			"백홀포트S",
			"백홀장비E",
			"백홀포트E",
			"ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"M/W구간ID",
			"M/W구간",
			"채널",
			"링no",
			"백홀장비S아이디",
			"백홀장비E아이디",
			"백홀포트S아이디",
			"백홀포트E아이디"
			];

		let cnt = 0;

		//그리드 생성
		$('#'+gridId).alopexGrid({
			renderMapping : {
				"srchIcon" : {
					renderer : function(value, data, render, mapping) {
						if(value == undefined) value = "";
						return "<span clas9s='Icon Search' style='cursor: pointer'></span>" ;
					}
				}
			},
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '10row',
			fitTableWidth : true,
			autoResize: true,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: true,
			numberingColumnFromZero: false,
//			enableEdit: true,
			defaultColumnMapping: true,
			leaveDeleted: true,
			headerGroup: [
	  			{fromIndex:0,     toIndex:7,     title:'선번 정보'},
//	  			{fromIndex:'ntwkLineNm', toIndex:'ntwkLineIcon', title: "링명", hideSubTitle: true},
	  			{fromIndex:8,     toIndex:15,    title:'백홀 장비'},
//	  			{fromIndex:'bkhlStaEqpNm', toIndex:'bkhlStaEqpIcon', title: "백홀장비S", hideSubTitle: true},
//	  			{fromIndex:'bkhlEndEqpNm', toIndex:'bkhlEndEqpIcon', title: "백홀장비E", hideSubTitle: true},
	  			{fromIndex:16,    toIndex:20,    title:'구간1'},
	  			{fromIndex:21,    toIndex:25,    title:'구간2'},
	  			{fromIndex:26,    toIndex:30,    title:'구간3'},
	  			{fromIndex:31,    toIndex:35,    title:'구간4'},
	  			{fromIndex:35+1,  toIndex:39+1,  title:'구간5'},
	  			{fromIndex:40+1,  toIndex:44+1,  title:'구간6'},
	  			{fromIndex:45+1,  toIndex:49+1,  title:'구간7'},
	  			{fromIndex:50+1,  toIndex:54+1,  title:'구간8'},
	  			{fromIndex:55+1,  toIndex:59+1,  title:'구간9'},
	  			{fromIndex:60+1,  toIndex:64+1,  title:'구간10'},
	  			{fromIndex:65+1,  toIndex:69+1,  title:'구간11'},
	  			{fromIndex:70+1,  toIndex:74+1,  title:'구간12'},
	  			{fromIndex:75+1,  toIndex:79+1,  title:'구간13'},
	  			{fromIndex:80+1,  toIndex:84+1,  title:'구간14'},
	  			{fromIndex:85+1,  toIndex:89+1,  title:'구간15'},
	  			{fromIndex:90+1,  toIndex:94+1,  title:'구간16'},
	  			{fromIndex:95+1,  toIndex:99+1,  title:'구간17'},
	  			{fromIndex:100+1, toIndex:104+1, title:'구간18'},
	  			{fromIndex:105+1, toIndex:109+1, title:'구간19'},
	  			{fromIndex:110+1, toIndex:114+1, title:'구간20'}
			],
			renderMapping:{
				"searchIcon" :{
					renderer : function(value, data, render, mapping) {
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				}
			},
			columnMapping: [
				{
					align : 'center',
					key : 'check',
					width : '50px',
					selectorColumn : true
				},
				{key : 'mwLnoId', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{key : 'mwLnoNm', align : 'center',title : '<em class="color_red">* </em>' + titleList[cnt++],width : '100', editable: true, resizing: true},
				{key : 'areaNm', align : 'center',title : titleList[cnt++],width : '100', editable: true, resizing: true},
				{key : 'umtsoNm', align : 'center',title : titleList[cnt++],width : '100', editable: true, resizing: true},
				{key : 'lmtsoNm', align : 'center',title : titleList[cnt++],width : '100', editable: true, resizing: true},
				{
					key   : 'ntwkLineNm',
					align : 'center',
					title : titleList[cnt++],
					width : '100',
					colspan : function(value,data,mapping) {
							  return 1;
					},
					editable: false,
					resizing: true
				},
				{
					key     : 'ntwkLineIcon',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'bkhlStaEqpNm', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'bkhlStaEqpIcon',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'bkhlStaPortNm', align : 'center', title : titleList[cnt++], width : '120', editable : false, resizing: true},
				{
					key     : 'bkhlStaPortIcon',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false

				},
				{key : 'bkhlEndEqpNm', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'bkhlEndEqpIcon',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'bkhlEndPortNm', align : 'center', title : titleList[cnt++], width : '120', editable : false, resizing: true},
				{
					key     : 'bkhlEndPortIcon',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId1', hidden:true, align : 'left',title : titleList[cnt++],width : '30', editable: false},
				{key : 'mwSctnNm1', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon1',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal1', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon1',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId2', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm2', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon2',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal2', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon2',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId3', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm3', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon3',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal3', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon3',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId4', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm4', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon4',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal4', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon4',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId5', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm5', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon5',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal5', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon5',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId6', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm6', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon6',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal6', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon6',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId7', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm7', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon7',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal7', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon7',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId8', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm8', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon8',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal8', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon8',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId9', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm9', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon9',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal9', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon9',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId10', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm10', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon10',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal10', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon10',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId11', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm11', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon11',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal11', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon11',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId12', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm12', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon12',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal12', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon12',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId13', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm13', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon13',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal13', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon13',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId14', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm14', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon14',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal14', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon14',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId15', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm15', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon15',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal15', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon15',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId16', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm16', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon16',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal16', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon16',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId17', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm17', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon17',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal17', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon17',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId18', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm18', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon18',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal18', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon18',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId19', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm19', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon19',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal19', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon19',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwSctnId20', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'mwSctnNm20', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwSctnNmIcon20',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'mwChnlNoVal20', align : 'center',title : titleList[cnt++],width : '100', editable: false, resizing: true},
				{
					key     : 'mwChnlNoValIcon20',
					width   : '30px',
					align   : 'center',
					editable: false,
					render  : {type:'searchIcon'},
					resizing: false
				},
				{key : 'ntwkLineNo', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'bkhlStaEqpId', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'bkhlEndEqpId', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'bkhlStaPortId', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'bkhlEndPortId', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'flag', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
				{key : 'addSeq', hidden:true, align : 'center',title : titleList[cnt++],width : '100'}
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	},

	gridExcelColumn : function(param, gridId) {
		var gridHeaderGroup = [
			{fromIndex:0,  toIndex:5,  title:'선번 정보'},
			{fromIndex:6,  toIndex:9,  title:'백홀 장비'},
			{fromIndex:10, toIndex:11, title:'구간1'},
			{fromIndex:12, toIndex:13, title:'구간2'},
			{fromIndex:14, toIndex:15, title:'구간3'},
			{fromIndex:16, toIndex:17, title:'구간4'},
			{fromIndex:18, toIndex:19, title:'구간5'},
			{fromIndex:20, toIndex:21, title:'구간6'},
			{fromIndex:22, toIndex:23, title:'구간7'},
			{fromIndex:24, toIndex:25, title:'구간8'},
			{fromIndex:26, toIndex:27, title:'구간9'},
			{fromIndex:28, toIndex:29, title:'구간10'},
			{fromIndex:30, toIndex:31, title:'구간11'},
			{fromIndex:32, toIndex:33, title:'구간12'},
			{fromIndex:34, toIndex:35, title:'구간13'},
			{fromIndex:36, toIndex:37, title:'구간14'},
			{fromIndex:38, toIndex:39, title:'구간15'},
			{fromIndex:40, toIndex:41, title:'구간16'},
			{fromIndex:42, toIndex:43, title:'구간17'},
			{fromIndex:44, toIndex:45, title:'구간18'},
			{fromIndex:46, toIndex:47, title:'구간19'},
			{fromIndex:48, toIndex:49, title:'구간20'}
		]

		var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

		for(var i=gridHeaderGroup.length-1; i>=0; i--) {
			if (gridHeaderGroup[i].title != undefined) {
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		};

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {
			hidden:false
		});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";

		var mwSctnNmIcons = [];
		var mwChnlNoValIcons = [];

		for(var i=1; i<=20; i++) {
			mwSctnNmIcons.push("mwSctnNmIcon" + i);
			mwChnlNoValIcons.push("mwChnlNoValIcon" + i);
		}

		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined
					&& gridHeader[i].key != "id" && gridHeader[i].key != "check" && gridHeader[i].key != "ntwkLineIcon" && gridHeader[i].key != "bkhlStaEqpIcon"
					&& gridHeader[i].key != "bkhlStaPortIcon" && gridHeader[i].key != "bkhlEndEqpIcon" && gridHeader[i].key != "bkhlEndPortIcon"
					&& !mwSctnNmIcons.includes(gridHeader[i].key) && !mwChnlNoValIcons.includes(gridHeader[i].key))) {
				var title = gridHeader[i].title.replace('<em class="color_red">* </em>','');
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		/*======해더그룹정보======*/
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		/*======해더정보======*/
		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	},

	/*-----------------------------*
	 *  성공처리
	 *-----------------------------*/
	successCallback : function(response, status, jqxhr, flag){
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
	        var jobInstanceId = response.resultData.jobInstanceId;
	        MwLnoControll.onDemandExcelCreatePop ( jobInstanceId );
	    }
	},

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    failCallback : function(response, status, jqxhr, flag){
    	if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
    },

    onDemandExcelCreatePop : function( jobInstanceId ){
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
	},

	/*-----------------------------*
	 *  HTTP
	 *-----------------------------*/
	httpRequest : function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(MwLnoControll.successCallback)
		  .fail(MwLnoControll.failCallback);
	}

}

// 입력된 객체가 null 또는 빈값이면 true를 반환
let isEmpty = function(sStr) {
	if (undefined == sStr || null == sStr) return true;
	if ($.isArray(sStr)) {
		if (sStr.length < 1) return true;
	}
	if ('string' == typeof sStr ) {
		if ('' == sStr) return true;
	}
	return false;
}

let dataObjCheck = function(mod, dataObj, data) {
	if(mod && dataObj.flag != "ADD") {
		$('#'+gridId).alopexGrid('cellEdit','MOD',{ _index : { data : dataObj._index.row } },'flag');
		$('#'+gridId).alopexGrid('rowSelect', { _index : { data : dataObj._index.row } }, true);
		mod = false;
	}

	return mod;
}
