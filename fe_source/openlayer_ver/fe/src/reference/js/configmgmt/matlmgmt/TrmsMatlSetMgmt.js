/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var trmsMatlSetMgmtGridId = 'trmsMatlSetMgmtGrid';
	var trmsMatlSetDtlGridId = 'trmsMatlSetDtlGrid';
	var trmsMatlCdGridId = 'trmsMatlCdGrid';

	var eqpRoleDivCdList =[];
	var eqpMdlIdList =[];

	var useYnList = [];
	useYnList.push({"text":"선택","value":""},{"text":"사용","value":"Y"}, {"text":"미사용","value":"N"});

	var hdofcCdList = [];
	var eqpRoleDivCdGridList =[];

	var gridEqpMdlObjectList = [];

	var matlSetCdData ="";




    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {


    	$('#btnTrmsMatlSetDtlSearch').setEnabled(false);
    	$('#btnTrmsMatlCdSearch').setEnabled(false);


    }

  //Grid 초기화
    function initGrid(strGubun) {

//    	$('#'+gridId).removeAlopexGrid();


    		var trmsMatlSetMgmtGridMappingN =  [
    			{key: 'check', align: 'center', width: '40px', selectorColumn : true},
    			{key : 'matlSetCd', align:'center', title : '자재SET코드', width: '80px'},
    			{
    				key : 'matlSetNm',
    				align:'center',
    				title : '자재SET명',
    				width: '120px',
    				editable : true
    			},
    			{
    				key : 'hdofcCd',
    				align:'center',
    				title : '본부',
    				width: '50px',
    				render : { type: 'string',
    					rule: function (value,data){
    						var render_data = [];
    						if (hdofcCdList.length > 0) {
    							return render_data = render_data.concat( hdofcCdList );
    						}else{
    							return render_data.concat({value : data.hdofcCd, text : data.hdofcNm});
    						}
    					}
    				},
    				editable : { type: "select", rule: function(value, data) { return hdofcCdList; },
    					attr : {
    						style : "width: 98%;min-width:98%;padding: 1px 1px;"
    					}
    				},

    				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
    			},
    			{
    				key : 'eqpRoleDivCd',
    				align:'center',
    				title : '장비타입',
    				width: '60px',
    				render : { type: 'string',
    					rule: function (value,data){
    						var render_data = [];
    						if (eqpRoleDivCdGridList.length > 0) {
    							return render_data = render_data.concat( eqpRoleDivCdGridList );
    						}else{
    							return render_data.concat({value : data.eqpRoleDivCd, text : data.eqpRoleDivNm});
    						}
    					}
    				},
    				editable : { type: "select", rule: function(value, data) { return eqpRoleDivCdGridList; },
    					attr : {
    						style : "width: 98%;min-width:98%;padding: 1px 1px;"
    					}
    				},

    				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
    			},
    			{
    				key : 'eqpMdlId',
    				align:'center',
    				title : '장비모델',
    				width: '80px',
    				render : { type: 'string',
    					rule: function (value,data){
    						var render_data = [{ value : '', text : '선택'}];
    						var currentData = AlopexGrid.currentData(data);
    						var eqpMdlListCmb = grdEqpMdlCmb(currentData.eqpRoleDivCd);

    						if( typeof value == "undefined" || value === null){
    							data.eqpMdlId = "";
    						}

    						if (!grdEqpMdlCheck(data.eqpMdlId, eqpMdlListCmb)) {
    							data.eqpMdlId = "";
    						}

    						if (eqpMdlListCmb.length > 0) {
    							return render_data = render_data.concat( eqpMdlListCmb );
    						}else{
    							return render_data;
    						}
    					}
    				},
    				editable : { type: "select",
    					rule: function(value, data) {
    						var editing_data = [{ value : '', text : '선택'}];
    						var currentData = AlopexGrid.currentData(data);
    						var eqpMdlListCmb = grdEqpMdlCmb(currentData.eqpRoleDivCd);

    						return editing_data.concat( eqpMdlListCmb );
    					},
    					attr : {
    						style : "width: 98%;min-width:98%;padding: 1px 1px;"
    					}
    				},

    				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
    			},
    			{
    				key : 'splyVndrNm',
    				align:'center',
    				title : '공급사',
    				width: '60px'
    			},
    			{
    				key     : 'splyVndrIcon',
    				width   : '30px',
    				align   : 'center',
    				editable: false,
    				render  : {type:'splyVndrIcon'},
    				resizing: false,


    			},
    			{
    				key : 'useYn',
    				align:'center',
    				title : '사용여부',
    				width: '60px',
    				render : { type: 'string',
    					rule: function (value,data){
    						var render_data = [];
    						if (useYnList.length > 0) {
    							return render_data = render_data.concat( useYnList );
    						}else{
    							return render_data.concat({value : data.useYn, text : data.useYnNm});
    						}
    					}
    				},
    				editable : { type: "select", rule: function(value, data) { return useYnList; },
    					attr : {
    						style : "width: 98%;min-width:98%;padding: 1px 1px;"
    					}
    				},

    				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },


    			},
    			{key : 'rmkCtt', align:'center', title : '비고', width: '100px', editable : true},
    			{key : 'frstRegUserNm', align:'center', title : '등록자', width: '60px'},
    			{key : 'frstRegDate', align:'center', title : '등록일', width: '80px'},
    			{key   : 'flag', title : '상태', align : 'center',width : '60px', hidden: true},
    			{key : 'splyVndrCd', align:'center', title : '공급사코드', width: '100px'},
    			];

    		var trmsMatlSetDtlGridMappingN =  [
    			{key: 'check', align: 'center', width: '40px', selectorColumn : true},
    			{key : 'namsMatlCdDtl', align:'center', title : '자재코드', width: '80px'},
    			{key : 'namsMatlNmDtl', align:'center', title : '자재명', width: '100px'},
    			{key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '60px'},
    			{key : 'eqpGunClVal', align:'center', title : '자재분류', width: '60px'},
    			{
    				key : 'repYn',
    				align:'center',
    				title : '대표여부',
    				width: '60px',
    				render : function(value, data, render, mapping){
						if (value == "Y") {
							return '<font style="color:green">대표</>';
						} else {
							return '';
						}
					},
					editable : {
						type:'checkbox',
						rule : [
							{value:'Y', checked:true},
							{value:'N', checked:false}
							]
					},
					editedValue : function (cell) {
						return $(cell).find('input').is(':checked') ? 'Y':'N';
					},
//					refreshBy : true



    			},
    			{
    				key : 'mtrlBasQuty',
    				align:'center',
    				title : '수량',
    				width: '60px',
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
    			},
    			{key : 'splyVndrNmDtl', align:'center', title : '공급사', width: '80px'},
    			{key   : 'flag', title : '상태', align : 'center',width : '60px', hidden: true},
    			{key : 'matlSetCd', align:'center', title : '자재SET코드', width: '80px',hidden: true},
    			];

    		var trmsMatlCdGridMappingN =  [
    			{key: 'check', align: 'center', width: '40px', selectorColumn : true},
    			{key : 'eqpMatlSrno', align:'center', title : '자재코드', width: '80px'},
    			{key : 'barMatlNm', align:'center', title : '자재명', width: '80px'},
    			{key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '80px'},
    			{key : 'eqpGunClVal', align:'center', title : '자재분류', width: '80px'},
    			{key : 'splyVndrNm', align:'center', title : '공급사', width: '80px'},
    			{key   : 'flag', title : '상태', align : 'center',width : '60px', hidden: true},
    			{key : 'matlSetCd', align:'center', title : '자재SET코드', width: '80px',hidden: true},
    			];



        //그리드 생성
        $('#'+trmsMatlSetMgmtGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
    		height: 300,
    		autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			preventScrollPropagation:true,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
//			cellRefreshOnRowSelect : true,
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: false,
			leaveDeleted: true,
			columnMapping : trmsMatlSetMgmtGridMappingN,
			headerGroup: [
				{fromIndex:'splyVndrNm', toIndex:'splyVndrIcon', title:"공급사", hideSubTitle:true}
				],
			renderMapping:{
				"splyVndrIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
			},
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

      //그리드 생성
        $('#'+trmsMatlSetDtlGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
    		height: 300,
        	autoColumnIndex: true,
    		autoResize: true,
    		cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: false,
			leaveDeleted: true,
    		numberingColumnFromZero: false,
			columnMapping : trmsMatlSetDtlGridMappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

      //그리드 생성
        $('#'+trmsMatlCdGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
    		height: 300,
        	autoColumnIndex: true,
    		autoResize: true,
    		rowSingleSelect : false,

    		numberingColumnFromZero: false,
			columnMapping : trmsMatlCdGridMappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['splyVndrCd'];
		$('#'+trmsMatlSetMgmtGridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
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

    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+trmsMatlSetMgmtGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage,"trmsMatlSetMgmt");
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+trmsMatlSetMgmtGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage, "trmsMatlSetMgmt");
         });

      // 페이지 번호 클릭시 - 전송 자재 SET 상세 조회
    	 $('#'+trmsMatlSetDtlGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage, "trmsMatlSetDtl");
         });

    	//페이지 selectbox를 변경했을 시.  - 전송 SET 상세 조회
         $('#'+trmsMatlSetDtlGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage, "trmsMatlSetDtl");
         });

      // 페이지 번호 클릭시 - 전송 자재 코드 조회
    	 $('#'+trmsMatlCdGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage, "trmsMatlCd");
         });

    	//페이지 selectbox를 변경했을 시.  - 전송 자재 코드 조회
         $('#'+trmsMatlCdGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage, "trmsMatlCd");
         });



    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid(1,perPage, "trmsMatlSetMgmt");
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage, "trmsMatlSetMgmt");
       		}
     	 });

         // 전송 자재 SET 상세 목록 조회
         $('#btnTrmsMatlSetDtlSearch').on('click', function(e) {
        	 $('#'+trmsMatlSetDtlGridId).alopexGrid('showProgress');
        	 main.setGrid(1,perPage, "trmsMatlSetDtl");
         });

         // 전송 자재 코드 조회
         $('#btnTrmsMatlCdSearch').on('click', function(e) {
        	 $('#'+trmsMatlCdGridId).alopexGrid('showProgress');
        	 main.setGrid(1,perPage, "trmsMatlCd");
         });

         $('#eqpRoleDivCdList').multiselect({
        	 open: function(e){
        		 eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
        	 },
        	 beforeclose: function(e){
        		 var codeID =  $("#eqpRoleDivCdList").getData();
        		 var param


        		 if(eqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){

        			 for(var i=0; codeID.eqpRoleDivCdList.length > i; i++){
        				 param += "&eqpRoleDivCdList=" + codeID.eqpRoleDivCdList[i];
        			 }
        			 httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMdl', param,'GET', 'mdl');
        		 }
        	 }
         });


       //첫번째 row를 클릭했을때 팝업 이벤트 발생
 		$('#'+trmsMatlSetMgmtGridId).on('click', '.bodycell', function(e){
 			var ev = AlopexGrid.parseEvent(e);
 			var dataObj = ev.data;
 			var rowData = $('#'+trmsMatlSetMgmtGridId).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

 			rowIndex = dataObj._index.row;

 			if(rowData._key == "splyVndrIcon" ){

				$a.popup({
					popid: "BpListPop",
					title: "공급사 조회",
					url: "/tango-common-business-web/business/popup/PopupBpList.do",
					//iframe: false,
					windowpopup: true,
					width: 1200,
					height: 650,
					movable : true,
					callback: function(data) {

						$('#'+trmsMatlSetMgmtGridId).alopexGrid("dataEdit", {splyVndrCd : data.bpId, splyVndrNm : data.bpNm
						}, {_index:{data : rowIndex}});

						if(isEmpty(dataObj.flag)) {
							$('#'+trmsMatlSetMgmtGridId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
						}
						$('#'+trmsMatlSetMgmtGridId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
					}
				});
			}

 			if (dataObj.flag != "ADD") {

 				matlSetCdData = rowData.matlSetCd;

 				$('#'+trmsMatlSetDtlGridId).alopexGrid('showProgress');
 				$('#'+trmsMatlCdGridId).alopexGrid('showProgress');
 				$('#btnTrmsMatlSetDtlSearch').setEnabled(true);
 				$('#btnTrmsMatlCdSearch').setEnabled(true);

 				httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlSetMgmtDtlList', rowData, 'GET', 'trmsMatlSetMgmtListSearch');

 				var param =  $("#trmsMatlCdSearchForm").serialize();

 	    		param = param.replace('namsMatlCd','eqpMatlSrno')
 	    		param = param.replace('namsMatlNm','barMatlNm')

 	    		param += "&matlSetCd=" + matlSetCdData;
// 				var param = {matlSetCd : rowData.matlSetCd}

 	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtListForPage', param, 'GET', 'trmsMatlCdListSearch');
 			}



 		});

 		$('#'+trmsMatlSetMgmtGridId).on('cellValueEditing', function(e) {
			var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var mapping = ev.mapping;
			if( mapping.key == "matlSetNm" ||
					mapping.key == "hdofcCd" ||
					mapping.key == "eqpRoleDivCd" ||
					mapping.key == "eqpMdlId"||
					mapping.key == "splyVndrCd"||
					mapping.key == "useYn" ||
					mapping.key == "rmkCtt"
			) {

				if(isEmpty(dataObj.flag)) {
					$('#'+trmsMatlSetMgmtGridId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
				}
				$('#'+trmsMatlSetMgmtGridId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
			}
		});

 		$("#btnAddRow").on("click", function(e) {
			var option 		= {_index:{data : 0}};
			var initRowData	= [];

			var option = {_index:{data : 0}};

			var initRowData = [{"matlSetCd": "",
				"matlSetNm" : "",
				"hdofcCd" : "",
				"eqpRoleDivCd" : "",
				"eqpMdlId": "",
				"splyVndrCd" :"",
				"useYn": "",
				"rmkCtt": "",
				"frstRegUserNm": "",
				"frstRegDate": "",
				"flag" : 'ADD',
				"splyVndrNm" :"",
			}];
			$('#'+trmsMatlSetMgmtGridId).alopexGrid('dataAdd', initRowData, option);
			$('#'+trmsMatlSetMgmtGridId).alopexGrid('rowSelect', option, true);
		});

 		$("#btnDeleteRow").on("click", function(e) {
			var rowData = $('#'+trmsMatlSetMgmtGridId).alopexGrid('dataGet', {_state: {selected:true}});

			if (rowData.length == 0) {
				callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.");
				return;
			}

			for(var i=0; i < rowData.length; i++){
				if (rowData[i].flag == 'ADD') {
					$('#'+trmsMatlSetMgmtGridId).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

				} else if(rowData[i].flag == 'MOD' || isEmpty(rowData[i].flag)) {
					$('#'+trmsMatlSetMgmtGridId).alopexGrid('cellEdit','DEL',{ _index : { data : rowData[i]._index.row } },'flag');
					$('#'+trmsMatlSetMgmtGridId).alopexGrid("dataDelete", { _index : { data : rowData[i]._index.row } });
				}
			}
		});

 		$("#btnCopyRow").on("click", function(e) {

 			var gridData = $('#'+trmsMatlSetMgmtGridId).alopexGrid('dataGet', {_state: {selected:true}});

 			if (gridData.length == 0) {
 				callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.");
				return;
 			}else if (gridData.length > 1) {
 				callMsgBox('btnMsgWarning','I', "복사는 하나만 선택해주세요");
 				return;
 			}



 			$('#'+trmsMatlSetMgmtGridId).alopexGrid('cellEdit', 'COPY', {_index:{row:gridData[0]._index.row}}, 'flag');

			callMsgBox('saveConfirm','C', "복사 하시겠습니까?", btnMsgCallback);
		});




// 		$('#'+trmsMatlCdGridId).on('scrollBottom', function(e) {
//			var pageInfo = $('#'+trmsMatlCdGridId).alopexGrid("pageInfo");
//
//			if(pageInfo.dataLength != pageInfo.pageDataLength){
//
//				$('#'+trmsMatlCdGridId).alopexGrid('showProgress');
//
//				$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
//				$('#rowPerPage').val($('#rowPerPage').val());
//
//				var param = $("#searchForm").getData();
//				httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtListForPage', param, 'GET', 'searchForPageAdd');
//			}
//
//		});

 		//저장버튼 클릭
		$("#btnSave").on("click", function(e) {
			$('#'+trmsMatlSetMgmtGridId).alopexGrid('endEdit'); // 편집종료

			var gridData = AlopexGrid.trimData($('#'+trmsMatlSetMgmtGridId).alopexGrid('dataGet', { _state : { selected : true }}));

			if (gridData.length < 1) {// 선택한 데이터가 존재하지 않을 시
				callMsgBox('btnMsgWarning','W', "반영할 항목이 없습니다.", btnMsgCallback);
				return;
			} else {
				for (var i=0;i < gridData.length; i++) {
					var matlSetCd 		= gridData[i].matlSetCd; 			//자재SET코드
					var matlSetNm 	= gridData[i].matlSetNm; 				//자재SET명
					var hdofcCd 		= gridData[i].hdofcCd; 					//본부
					var eqpRoleDivCd 	= gridData[i].eqpRoleDivCd; 		//장비역할구분코드
					var eqpMdlId 	= gridData[i].eqpMdlId; 				//장비모델
					var splyVndrCd 	= gridData[i].splyVndrCd; 				//공급사
					var useYn 		= gridData[i].useYn; 					//사용여부
					var rmkCtt 	= gridData[i].rmkCtt;						//비고


					//자재코드 체크
					if(isEmpty(matlSetNm)){
						callMsgBox('btnMsgWarning','I', "자재SET명을 입력해 주십시오.");
						return false;
					}

					//자재명 체크
					if(isEmpty(hdofcCd)){
						callMsgBox('btnMsgWarning','I', "본부를 선택해 주십시오.");
						return false;
					}

					//장비타입 체크
					if(isEmpty(eqpRoleDivCd)){
						callMsgBox('btnMsgWarning','I', "장비타입을 선택해 주십시오.");
						return false;
					}

					//장비모델 체크
					if(isEmpty(eqpMdlId)){
						callMsgBox('btnMsgWarning','I', "장비모델을 선택해 주십시오.");
						return false;
					}

					//공급사 체크
					if(isEmpty(splyVndrCd)){
						callMsgBox('btnMsgWarning','I', "공급사를 선택해 주십시오.");
						return false;
					}

					//사용여부 체크
					if(isEmpty(useYn)){
						callMsgBox('btnMsgWarning','I', "사용여부를 선택해 주십시오.");
						return false;
					}


					var saveMsg = "저장 하시겠습니까?";
						if( gridData[i].flag == "DEL" ){
							saveMsg = "매핑된 전송 자재 SET 상세 정보도 삭제 됩니다.<br><br>계속 진행 하겠습니까?"
						}
				}
				callMsgBox('saveConfirm','C', saveMsg, btnMsgCallback);
			}

		});

		$("#btnPlus").on("click", function(e) {

				var rowData = $('#'+trmsMatlCdGridId ).alopexGrid('dataGet', {_state: {selected:true}});

				if (rowData.length == 0) {
					callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.");
					return;
				}



				for(var i=0; i < rowData.length; i++){

					if (rowData[i].flag == 'ADD') {
						$('#'+trmsMatlCdGridId).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

					} else if(rowData[i].flag == 'MOD' || isEmpty(rowData[i].flag)) {
						$('#'+trmsMatlCdGridId).alopexGrid('cellEdit','DEL',{ _index : { data : rowData[i]._index.row } },'flag');
						$('#'+trmsMatlCdGridId).alopexGrid("dataDelete", { _index : { data : rowData[i]._index.row } });
					}

					var initRowData = [{"namsMatlCdDtl": rowData[i].eqpMatlSrno,
						"namsMatlNmDtl" : rowData[i].barMatlNm,
						"eqpRoleDivNm" : rowData[i].eqpRoleDivCd,
						"eqpGunClVal": rowData[i].eqpGunClVal,
						"repYn" :"N",
						"mtrlBasQuty": "0",
						"splyVndrNmDtl": rowData[i].splyVndrNm,
						"flag" : 'ADD',
						"matlSetCd" : matlSetCdData
					}];

					$('#'+trmsMatlSetDtlGridId ).alopexGrid('dataAdd', initRowData, {_index:{data : 0}});
					$('#'+trmsMatlSetDtlGridId).alopexGrid('rowSelect',  {_index:{data : 0}}, true);

				}
		});



		$("#btnMinus").on("click", function(e) {


			var rowData = $('#'+trmsMatlSetDtlGridId ).alopexGrid('dataGet', {_state: {selected:true}});

			if (rowData.length == 0) {
				callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.");
				return;
			}



			for(var i=0; i < rowData.length; i++){

				if (rowData[i].flag == 'ADD') {
					$('#'+trmsMatlSetDtlGridId).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

				} else if(rowData[i].flag == 'MOD' || isEmpty(rowData[i].flag)) {
					$('#'+trmsMatlSetDtlGridId).alopexGrid('cellEdit','DEL',{ _index : { data : rowData[i]._index.row } },'flag');
					$('#'+trmsMatlSetDtlGridId).alopexGrid("dataDelete", { _index : { data : rowData[i]._index.row } });
				}

				var initRowData = [{"eqpMatlSrno": rowData[i].namsMatlCdDtl,
					"barMatlNm" : rowData[i].namsMatlNmDtl,
					"eqpRoleDivNm" : rowData[i].eqpRoleDivNm,
					"eqpGunClVal": rowData[i].eqpGunClVal,
					"splyVndrNm": rowData[i].splyVndrNmDtl,
					"flag" : 'ADD',
					"matlSetCd" : matlSetCdData
				}];

				$('#'+trmsMatlCdGridId ).alopexGrid('dataAdd', initRowData, {_index:{data : 0}});

			}

		});


		$('#'+trmsMatlSetDtlGridId ).on('cellValueEditing', function(e) {
			var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var mapping = ev.mapping;

			if( mapping.key == "repYn" ||
					mapping.key == "mtrlBasQuty"
			) {

				if(isEmpty(dataObj.flag)) {
					$('#'+trmsMatlSetDtlGridId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
				}
				$('#'+trmsMatlSetDtlGridId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);


				if (mapping.key == "repYn"){
					trmsMatlRepUpdate(dataObj)
				}
			}

		});


		$("#btnTrmsMatlSetDtl").on("click", function(e) {

			var gridData = AlopexGrid.trimData($('#'+trmsMatlSetDtlGridId).alopexGrid('dataGet', { _state : { selected : true }}));

			if (gridData.length < 1) {// 선택한 데이터가 존재하지 않을 시
				callMsgBox('btnMsgWarning','W', "반영할 항목이 없습니다.", btnMsgCallback);
				return;
			} else {
				if (trmsMatlRepChk()) {
					trmsInvtDtlSave()
				}
			}



		});


		// 엑셀 다운로드
 		$("#btnExportExcel").on("click", function(e) {
 			var gridData = $('#'+trmsMatlSetMgmtGridId).alopexGrid('dataGet');
 			if (gridData.length == 0) {
 				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
 					return;
 			}

 			var param =  $("#searchForm").getData();
 	   		param = gridExcelColumn(param, trmsMatlSetMgmtGridId);
 	   		param.pageNo = 1;
 	   		param.rowPerPage = 60;
 	   		param.firstRowIndex = 1;
 	   		param.lastRowIndex = 1000000000;
 	   		param.inUserId = $('#sessionUserId').val();

 	   		if ($("#eqpRoleDivCdList").val() != "" && $("#eqpRoleDivCdList").val() != null ){
 	   			param.eqpRoleDivCdList = $("#eqpRoleDivCdList").val() ;
 	   		} else{
 	   			param.eqpRoleDivCdList = [];
 	   		}

 	   		if ($("#eqpMdlIdList").val() != "" && $("#eqpMdlIdList").val() != null ){
	   			param.eqpMdlIdList = $("#eqpMdlIdList").val() ;
	   		} else{
	   			param.eqpMdlIdList = [];
	   		}

 	   		var now = new Date();
 	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
 	        var excelFileNm = '전송자재SET관리_'+dayTime;
 	   		param.fileName = excelFileNm;
 	   		param.fileExtension = "xlsx";
 	   		param.excelPageDown = "N";
 	   		param.excelUpload = "N";
 	   		param.excelMethod = "getTrmsMatlSetMgmtList";
 	   		param.excelFlag = "TrmsMatlSetMgmtList";
 	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
 	        fileOnDemendName = excelFileNm+".xlsx";
   		 	$('#'+trmsMatlSetMgmtGridId).alopexGrid('showProgress');
   		 	console.log("Excel param : ", param);
   		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
 		});




	};

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


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+trmsMatlSetMgmtGridId).alopexGrid('hideProgress');
    		setSPGrid(trmsMatlSetMgmtGridId, response, response.trmsMatlSetMgmtList);

    	}

		if(flag == 'trmsMatlSetMgmtListSearch'){

    		$('#'+trmsMatlSetDtlGridId).alopexGrid('hideProgress');

    		setSPGrid(trmsMatlSetDtlGridId, response, response.trmsMatlSetMgmtDtlList);
    		$('#'+trmsMatlSetDtlGridId).alopexGrid('hideProgress');

    	}

		if(flag == 'trmsMatlCdListSearch'){

    		$('#'+trmsMatlCdGridId).alopexGrid('hideProgress');

    		setSPGrid(trmsMatlCdGridId, response, response.matlMgmtList);
    		$('#'+trmsMatlCdGridId).alopexGrid('hideProgress');
    	}

		if(flag == 'searchForPageAdd'){

			$('#'+trmsMatlCdGridId).alopexGrid('hideProgress');
			setSPGrid(trmsMatlCdGridId, response, response.matlMgmtList);


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
			eqpRoleDivCdGridList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpRoleDivCdList.push({"text":resObj.comCdNm,"value":resObj.comCd});
				eqpRoleDivCdGridList.push({"text":resObj.comCdNm,"value":resObj.comCd});
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

			for(var i=0; i<response.length; i++){
				var resObj = response[i];

				var tmp = [];
				var gridObject={};

				if (gridEqpMdlObjectList.length == 0) {

					gridEqpObject = {
							eqpRole : resObj.etcAttrVal1,
							list : [{"text":resObj.comCdNm,"value":resObj.comCd}]
					}

					gridEqpMdlObjectList.push(gridEqpObject);

				} else {
					var exstcYn = "N";
					var dupChkYn = "N";
					for (var j=0; j < gridEqpMdlObjectList.length; j++) {
						for (eqpRole in gridEqpMdlObjectList[j]) {
							if (gridEqpMdlObjectList[j][eqpRole] == resObj.etcAttrVal1) {
								for (k=0; k < gridEqpMdlObjectList[j]["list"].length; k++) {
									var dupText = gridEqpMdlObjectList[j]["list"][k].value;

									if (dupText == resObj.comCd) {
										dupChkYn = "Y";
										break;
									}

								}
								if (dupChkYn == "N"){
									gridEqpMdlObjectList[j]["list"].push({"text":resObj.comCdNm,"value":resObj.comCd})

								}

								exstcYn = "Y";
								break;
							}
						}
					}

					if (exstcYn == "N") {
						gridEqpObject = {
								eqpRole : resObj.etcAttrVal1,
								list : [{"text":resObj.comCdNm,"value":resObj.comCd}]
						}
						gridEqpMdlObjectList.push(gridEqpObject);
					}

				}

			}

			$('#eqpMdlIdList').setData({
				data:option_data
			});

		}


		if(flag == 'saveTrmsMatlSetMgmt'){

			$('#'+trmsMatlSetMgmtGridId).alopexGrid('hideProgress');

			if (response.returnCode == "200") {
				callMsgBox('','I', response.returnMessage,function(){
					$('#btnSearch').click();
				});
			} else {
				callMsgBox('btnMsgWarning','W', response.returnMessage, btnMsgCallback);
			}

		}

		if(flag == 'saveTrmsMatlSetDtl'){

			$('#'+trmsMatlSetDtlGridId).alopexGrid('hideProgress');

			if (response.returnCode == "200") {
				callMsgBox('','I', response.returnMessage,function(){

					$('#btnTrmsMatlSetDtlSearch').click();
					$('#btnTrmsMatlCdSearch').click();

					var param =  $("#trmsMatlSetDtlForm").serialize();
					param += "&matlSetCd=" + matlSetCdData;

					httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlSetMgmtDtlList', param, 'GET', 'trmsMatlSetMgmtListSearch');

					param =  $("#trmsMatlCdSearchForm").serialize();

					param += "&matlSetCd=" + matlSetCdData;

					param = param.replace('namsMatlCd','eqpMatlSrno')
		    		param = param.replace('namsMatlNm','barMatlNm')

	 	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtListForPage', param, 'GET', 'trmsMatlCdListSearch');

				});
			} else {
				callMsgBox('btnMsgWarning','W', response.returnMessage);
			}

		}

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+trmsMatlSetMgmtGridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
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
    	var serverPageinfo = {};
    	if (GridID == "trmsMatlSetMgmtGrid") {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	} else if (GridID == "trmsMatlSetDtlGrid") {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	} else if (GridID == "trmsMatlCdGrid") {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	}

    	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}


    }

    this.setGrid = function(page, rowPerPage, flag){

    	if (flag == "trmsMatlSetMgmt") {

    		$('#pageNo').val(page);
    		$('#rowPerPage').val(rowPerPage);
    		var param =  $("#searchForm").serialize();

    		$('#btnTrmsMatlSetDtlSearch').setEnabled(false);
    		$('#'+trmsMatlSetDtlGridId).alopexGrid('dataEmpty');
    		$('#'+trmsMatlCdGridId).alopexGrid('dataEmpty');

    		$('#'+trmsMatlSetMgmtGridId).alopexGrid('showProgress');

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlSetMgmtList', param, 'GET', 'search');

    	} else if (flag == "trmsMatlSetDtl") {

    		$('#trmsMatlSetDtlPageNo').val(page);
    		$('#trmsMatlSetDtlRowPerPage').val(rowPerPage);

    		var param =  $("#trmsMatlSetDtlForm").serialize();

    		param += "&pageNo=" + page;
    		param += "&rowPerPage=" + rowPerPage;
    		param += "&matlSetCd=" + matlSetCdData;

    		$('#'+trmsMatlSetDtlGridId).alopexGrid('showProgress');

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlSetMgmtDtlList', param, 'GET', 'trmsMatlSetMgmtListSearch');

    	} else if (flag == "trmsMatlCd") {

    		$('#trmsMatlCdSearchPageNo').val(page);
    		$('#trmsMatlCdSearchRowPerPage').val(rowPerPage);

    		var param =  $("#trmsMatlCdSearchForm").serialize();

    		param = param.replace('namsMatlCd','eqpMatlSrno')
    		param = param.replace('namsMatlNm','barMatlNm')

    		param += "&matlSetCd=" + matlSetCdData;

    		param += "&pageNo=" + page;
    		param += "&rowPerPage=" + rowPerPage;

    		$('#'+trmsMatlCdGridId).alopexGrid('showProgress');

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMstMgmtListForPage', param, 'GET', 'trmsMatlCdListSearch');

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

	// 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('saveConfirm' == msgId && 'Y' == msgRst) {
			var gridData = AlopexGrid.trimData($('#'+trmsMatlSetMgmtGridId).alopexGrid('dataGet', function(data) {
				if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD'||data.flag == 'COPY') && (data._state.selected == true)) {
					return data;
				}
			}));

			for (var i=0;i < gridData.length; i++) {
				//자재명 체크
				if(isEmpty(gridData[i].matlSetNm)){
					callMsgBox('btnMsgWarning','I', "자재SET명을 입력해 주십시오.");
					return false;
				}
			}

			$('#'+trmsMatlSetMgmtGridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/saveTrmsMatlSetMgmt', gridData, 'POST', 'saveTrmsMatlSetMgmt');
		}

	};

	function grdEqpMdlCmb(value) {
		var returnDate = [];

		for (var i=0; i < gridEqpMdlObjectList.length; i++) {
			for (gridEqpRole in gridEqpMdlObjectList[i]) {
				if (gridEqpMdlObjectList[i][gridEqpRole] == value) {
					returnDate = gridEqpMdlObjectList[i]["list"]
					break;
				}
			}
		}

		return returnDate;

	}

	function grdEqpMdlCheck(value, data) {

		for (var i=0; i < data.length; i++) {
			if (data[i].value == value)
					return true;
		}

		return false;
	}

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

	function trmsInvtDtlSave() {

		var gridData = AlopexGrid.trimData($('#'+trmsMatlSetDtlGridId ).alopexGrid('dataGet', function(data) {
			if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD') ) {
				return data;
			}
		}));

		console.log(gridData)

		$('#'+trmsMatlSetDtlGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/saveTrmsMatlSetDtl', gridData, 'POST', 'saveTrmsMatlSetDtl');

	}


	function trmsMatlRepChk() {
		var gridData = AlopexGrid.trimData($('#'+trmsMatlSetDtlGridId ).alopexGrid('dataGet'));
//		var row	= dataObj._index.row;

		var nRepYn = 0;
		for(var i=0; i < gridData.length; i++){
			if( gridData[i].repYn =='Y'){
				nRepYn = nRepYn+1
				continue;
			}

		}

		if(nRepYn > 2){
			callMsgBox('btnMsgWarning','I', "대표 자재는 하나만 선택 가능합니다..");
			return false;
		} else if (nRepYn < 1){
			callMsgBox('btnMsgWarning','I', "대표 자재 선택해 주십시오");
			return false;
		}

		return true;
	};

	var trmsMatlRepUpdate = function (dataObj){
		var gridData = AlopexGrid.trimData($('#'+trmsMatlSetDtlGridId ).alopexGrid('dataGet'));
		var row	= dataObj._index.row;

		var updateChk = 0;

		if (dataObj._state.edited == true) {
			if (dataObj._state.editing[5] == 'Y')
				updateChk = 1;
		}

		if (updateChk == 1) {
			for(var i=0; i < gridData.length; i++){
				if( row == i){
					continue;
				} else {
					if (gridData[i].repYn == 'Y') {
						$('#'+trmsMatlSetDtlGridId ).alopexGrid('cellEdit', 'N', {_index:{row:i}}, 'repYn');
						$('#'+trmsMatlSetDtlGridId).alopexGrid('rowSelect',{_index:{row:i}}, true);
					}
				}
			}
		}

		return true;
	};

	function lpad(value, length) {
		var strValue = '';
		if (value) {
			if (typeof value === 'number') {
				strValue = String(value);
			}
		}

		var result = '';
		for (var i = strValue.length; i < length; i++) {
			result += strValue;
		}

		return result + strValue;
	}

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id" && gridHeader[i].key != "check" && gridHeader[i].key != "splyVndrIcon")) {
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


});