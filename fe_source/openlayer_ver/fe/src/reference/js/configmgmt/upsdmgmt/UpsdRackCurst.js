/**
 * UpasRackCurst.js
 *
 * @author Administrator
 * @date 2020. 4. 16.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

	var rackTypCd = []; 	// 랙종류
	var crrtOnrCd =[]; 	//현행화 주체
	var crrtCnfCd = []; // 현행화 완료여부
	var reCnfCrrtOnrCd =[]; 	//현행화 주체
	var reCnfCrrtCnfCd = []; // 현행화 완료여부


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();

        $("#rackDetail").hide();
        $("#pwrPort").hide();
		 //main.setGrid(1,100);
    };



  //Grid 초기화
    function initGrid() {

    	AlopexGrid.setup({
    		renderMapping : {
    			"date" :{
    				renderer: function(value, data, render, mapping, grid) {
    					var div = document.createElement('div');
    					div.className = "Dateinput";
    					var input = document.createElement('input');
    					input.value = value;
    					div.appendChild(input);
    					$(div).convert();
    					return div;
    				},
    				editedValue : function(cell, data, render, mapping, grid) {
    					return cell.getElementsByTagName('input')[0].value;
    				}
    			}
    		}
    	});

        //그리드 생성
        $('#'+gridId).alopexGrid({
//        	height : '8row',
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	fullCompareForEditedState: true,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowInlineEdit: true,
    		defaultColumnMapping:{
    			sorting : true
    		},

    		headerGroup :  [
    			{fromIndex:23, toIndex:25, title:"현행화 결과 입력", id:'u0',headerStyleclass: "yellow"},
    			{fromIndex:26, toIndex:32, title:"현행화 재확인 결과 입력", id:'u1',headerStyleclass: "blue"}
			],
    		columnMapping: [
				{align:'center',title : configMsgArray['sequence'],width: '50px',resizing: false,numberingColumn: true},
				{key : 'workGubun', align:'center',title : '관리그룹',width: '70px'},
				{key : 'orgNm', align:'center',title : '본부',width: '100px'},
				{key : 'teamNm', align:'center',title : '팀',width: '100px'},
				{key : 'tmofNm', align:'center',title : '전송실',width: '150px'},
				{key : 'mtsoTyp', align:'center',title : '국사유형',width : '90px'},
//				{key : 'sisulCd', align:'center',title : '통시코드',width : '90px'},
				{key : 'mtsoId', align:'center',title : '국사ID(통합국ID)',width : '120px'},
				{key : 'mtsoNm', align:'center',title : '국사명(통합국명)',width: '150px'},
				{key : 'floorNm', align:'center',title : '층구분',width: '80px'},
				{key : 'floorLabel', align:'center',title : '라벨명',width: '100px'},
				{
					align : 'center',
					title : '도면',
					width : '50',
					render : function(value, data, render, mapping){
						return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnDraw" type="button"></button></div>';
					}
				},
				{key : 'rackId', align:'center',title : '랙ID',width: '150px'},
				{key : 'rackNm', align:'center',title : '랙명',width: '100px'},
				{key : 'unitSize', align:'center',title : '랙쉘프수',width: '80px'},
				{key : 'tempCnt', align:'center',title : '장비쉘프수',width: '80px'},
				{key : 'itemType', align:'center',title : '랙분류',width: '100px'},
				{key : 'lineColor', align:'center',title : '라인색상',width: '80px',
//					styleclass : function(value, data, mapping) {
//						if (value != 'FFFFFF') return 'font-red';
//						else return 'blueS'
//					},
					inlineStyle : {
						color : 'black',
						background : function(value, data, mapping) { return '#'+ data.lineColor;}
						}
				},
				{key : 'rackDiv', align:'center',title : '랙여부',width: '80px'},
				{key : 'regDt', align:'center',title : '랙 입력 일시',width: '140px'},
				{key : 'regId', align:'center',title : '랙 최초 입력 ID',width: '120px'},
				{key : 'bpNm', align:'center',title : '랙 최초 입력 업체',width: '120px'},

				{key : 'cstrStatNm', align : 'center', title : '공사진행상태', width : '130px'},
//				{key : 'cstrStatCd', align : 'center', title : '공사진행상태', width : '130px',
//					render : function(value){
//						if(value == '1'){
//							return 'ENG SHEET 예약';
//						}else if(value =='2'){
//							return '장비 개통 등록';
//						}else if(value =='3'){
//							return '장비 개통 검증';
//						}else {
//							return '';
//						}
//					}
//				},
				{key : 'cstrCd', align : 'center', title : '공사코드', width : '100px' },
				{key : 'rackTypCd', align:'center',title : '랙종류',width: '150px',headerStyleclass: "yellow",
					render : {type : 'string',
						rule : function(value, data) {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(rackTypCd);
							return render_data;
						}
					},
					editable : function(value, data) {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in rackTypCd) {
							var exist = '';
							if (value && value.indexOf(rackTypCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+rackTypCd[i].value+' '+exist+'>'+rackTypCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					}
				},
				{key : 'crrtOnrCd', align:'center',title : '현행화 주체',width: '180px',headerStyleclass: "yellow",
					render : {type : 'string',
						rule : function(value, data) {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(crrtOnrCd );
							return render_data;
						}
					},
					editable : function(value, data) {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in crrtOnrCd) {
							var exist = '';
							if (value && value.indexOf(crrtOnrCd [i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+crrtOnrCd [i].value+' '+exist+'>'+crrtOnrCd [i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					}
				},
				{key : 'crrtCnfCd', align:'center',title : '현행화 완료 여부',width: '180px',headerStyleclass: "yellow",
					render : {type : 'string',
						rule : function(value, data) {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(crrtCnfCd  );
							return render_data;
						}
					},
					editable : function(value, data) {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in crrtCnfCd ) {
							var exist = '';
							if (value && value.indexOf(crrtCnfCd  [i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+crrtCnfCd  [i].value+' '+exist+'>'+crrtCnfCd  [i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					}
				},

				{key : 'reCnfRackTypCd', align:'center',title : '랙종류',width: '150px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(rackTypCd);
							return render_data;
						}
					},
					editable : function(value, data) {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in rackTypCd) {
							var exist = '';
							if (value && value.indexOf(rackTypCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+rackTypCd[i].value+' '+exist+'>'+rackTypCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					}
				},
				{key : 'reCnfCrrtOnrCd', align:'center',title : '현행화 주체',width: '150px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(reCnfCrrtOnrCd  );
							return render_data;
						}
					},
					editable : function(value, data) {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in reCnfCrrtOnrCd ) {
							var exist = '';
							if (value && value.indexOf(reCnfCrrtOnrCd  [i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+reCnfCrrtOnrCd  [i].value+' '+exist+'>'+reCnfCrrtOnrCd  [i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					}
				},
				{key : 'reCnfCrrtCnfCd', align:'center',title : '현행화 재확인 완료 여부',width: '150px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(reCnfCrrtCnfCd);
							return render_data;
						}
					},
					editable : function(value, data) {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in reCnfCrrtCnfCd  ) {
							var exist = '';
							if (value && value.indexOf(reCnfCrrtCnfCd   [i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+reCnfCrrtCnfCd   [i].value+' '+exist+'>'+reCnfCrrtCnfCd   [i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					}
				},
				{key : 'fnshDt', align:'center',title : '완료 일자',width: '120px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
							if (value != undefined){
								strFormatDate = value.replace(/-/g,"");

								if( strFormatDate.length < 8  || strFormatDate.length > 8 || isNaN(strFormatDate) == true) {				// 포맷에 맞지 않게 된 경에는 입력 받은 값 초기화
									return data.fnshDt = '';
								}

								else if( value.length == 8 ) {
									var y = value.substr(0,4);
									var m = value.substr(4,2);
									var d = value.substr(6,2);

									var strDate = y + '-' + m + '-' + d;

									return data.fnshDt = strDate;
								}
							}
								return data.fnshDt;
						}
					},
					editable: {type : 'date'}
				},
				{key : 'crrtRmk', align:'center',title : '비고',width: '150px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
								return value;
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					}
				},
				{key : 'crrtAreaRmk', align:'center',title : '지역',width: '150px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
								return value;
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					}
				},
				{key : 'crrtVndrRmk', align:'center',title : 'BP사',width: '100px',headerStyleclass: "blue",
					render : {type : 'string',
						rule : function(value, data) {
								return value;
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					}
				},
			],

			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });



        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = [''];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
		var searchInspectCd = {supCd : '007000'};
		var searchGubun = {supCd : '008000'};
		var searchWorkGubun = "SKT";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ searchWorkGubun, null, 'GET', 'fstOrg');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');

		// 랙 종류
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/RACKTYPE', null, 'GET', 'rackTypCdList');
		//현행호 주체
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/CRRTONR', null, 'GET', 'crrtOnrCdList');
		//현행화 완료 여부
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/CRRTCNF', null, 'GET', 'crrtCnfCdList');

		$('#cstrStatCd').clear();
    	var option_data_cstr = [{cd: '', cdNm: '선택하세요'},{cd: '1', cdNm: 'ENG SHEET 예약'},{cd: '2', cdNm: '장비 개통 등록'}]; //,{cd: '3', cdNm: '장비 개통 검증'}
		$('#cstrStatCd').setData({
            data:option_data_cstr
		});
		$('#cstrStatCd').val("");
    };

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
    		 $('#'+gridId).alopexGrid('dataEmpty');
    		 $('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
    		 $("#rackDetail").hide();
    	     $("#pwrPort").hide();

    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			$('#'+gridId).alopexGrid('dataEmpty');
     			$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: true}});
     			$("#rackDetail").hide();
     	        $("#pwrPort").hide();

     			main.setGrid(1,perPage);
       		}
     	 });


 		$('#searchWorkGubun').on('change', function(e) {

    		 var mgmtGrpNm = $("#searchWorkGubun").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

    		 var option_data =  null;
 			if($('#searchWorkGubun').val() == "SKT"){
 				option_data =  [{comCd: "1",comCdNm: "전송실"},
 								{comCd: "2",comCdNm: "중심국사"},
 								{comCd: "3",comCdNm: "기지국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}else{
 				option_data =  [{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}
 			$('#mtsoTypCdList').setData({
                 data:option_data
 			});

         });

    	//본부 선택시 이벤트
    	 $('#orgId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();

    		 if(orgID.orgId == ''){
    			 var mgmtGrpNm = $("#searchWorkGubun").val();

    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }
         });
	   // 	팀을 선택했을 경우
		 $('#teamId').on('change', function(e) {

			 var orgID =  $("#orgId").getData();
			 var teamID =  $("#teamId").getData();

			 if(orgID.orgId == '' && teamID.teamId == ''){
				 var mgmtGrpNm = $("#searchWorkGubun").val();

				 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
			 }else if(orgID.orgId == '' && teamID.teamId != ''){
				 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
			 }else if(orgID.orgId != '' && teamID.teamId == ''){
				 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
			 }else {
				 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
			 }

		 });

 		 var option_data =  null;
 			if($('#searchWorkGubun').val() == "SKT"){
 				option_data =  [{comCd: "1",comCdNm: "전송실"},
 								{comCd: "2",comCdNm: "중심국사"},
 								{comCd: "3",comCdNm: "기지국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}else{
 				option_data =  [{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}
 			$('#mtsoTypCdList').setData({
               data:option_data
 			});


 		$('#'+gridId).on('click', '#btnDraw', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
//			var data = {modelId: dataObj.modelId, sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
			var data = {itemId: dataObj.rackId};

			$a.popup({
				title: '드로잉 툴',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
				data: data,
				iframe: false,
				windowpopup: true,
				movable:false,
				width : screen.availWidth,
				height : screen.availHeight,
				callback: function(data) {
				}
			});
 		});

 		$('#'+gridId).on('rowInlineEditEnd',function(e){
			var param = AlopexGrid.parseEvent(e).data;

			var userId;
			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			 var fnshDt =param.fnshDt;


			 param.userId = userId;
			 param.fnshDt =  fnshDt.replace(/-/g,"");

			 $('#'+gridId).alopexGrid('dataFlush', function(editedDataList){

					var result = $.map(editedDataList, function(el, idx){ return el.rackId;})

					if (result.length > 0) {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mergeUpsdRackCrrtInf', param, 'POST', 'UpsdRackCrrt');
					}
			 });
		});


//         $('#btnExportExcel').on('click', function(e){
//        	 var dt = new Date();
//  			var recentY = dt.getFullYear();
//  			var recentM = dt.getMonth() + 1;
//  			var recentD = dt.getDate();
//
//  			if(recentM < 10) recentM = "0" + recentM;
//  			if(recentD < 10) recentD = "0" + recentD;
//
//  			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;
//
//  			$('#'+invtIntgGridId).alopexGrid("showCol", 'mtsoInvtId');
//  			var worker = new ExcelWorker({
//  				excelFileName : '상면랙현황_'+recentYMD,
//  				sheetList : [{
//  					sheetName : '상면랙현황',
//  					$grid : $("#"+dataGrid)
//  				}]
//  			});
//  			worker.export({
//  				merge : true,
//  				useCSSParser : true,
//  				useGridColumnWidth : true,
//  				border : true,
//  				filtered : filtered,
//  				callback : {
//  					preCallback : function(gridList){
//  						for(var i=0; i < gridList.length; i++) {
//  							if(i == 0  || i == gridList.length -1)
//  								gridList[i].alopexGrid('showProgress');
//  						}
//  					},
//  					postCallback : function(gridList) {
//  						for(var i=0; i< gridList.length; i++) {
//  							gridList[i].alopexGrid('hideProgress');
//  						}
//  					}
//  				}
//  			});
//
//     		worker.export({
//     			merge: false,
//	     		exportHidden: false,
//	     		useGridColumnWidth : true,
//	     		useCSSParser : true
//     		});
//     	});
    	//엑셀다운
         $('#btnExportExcel').on('click', function(e){
 			//tango transmission biz 모듈을 호출하여야한다.
     		var param =  $("#searchForm").getData();

     		param = gridExcelColumn(param, gridId);
     		param.pageNo = 1;
     		param.rowPerPage = 10;
     		param.firstRowIndex = 1;
     		param.lastRowIndex = 1000000000;

     		var tmofList_Tmp = "";
			var mtsoCntrTypCdList_Tmp = "";
			var mtsoTypCdList_Tmp = "";
			if (param.tmofList != "" && param.tmofList != null ){
	   			 for(var i=0; i<param.tmofList.length; i++) {
	   				 if(i == param.tmofList.length - 1){
	   					tmofList_Tmp += param.tmofList[i];
	                    }else{
	                    	tmofList_Tmp += param.tmofList[i] + ",";
	                    }
	    			}
	   			param.tmofList = tmofList_Tmp ;
	   		 }

			if (param.mtsoTypCdList != "" && param.mtsoTypCdList != null ){
	   			 for(var i=0; i<param.mtsoTypCdList.length; i++) {
	   				 if(i == param.mtsoTypCdList.length - 1){
	   					mtsoTypCdList_Tmp += param.mtsoTypCdList[i];
	                    }else{
	                    	mtsoTypCdList_Tmp += param.mtsoTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoTypCdList = mtsoTypCdList_Tmp ;
	   		 }

     		param.fileName = '상면랙현황_';
     		param.fileExtension = "xlsx";
     		param.excelPageDown = "N";
     		param.excelUpload = "N";
     		param.method = "getUpsdRackCustList";
     		param.excelYn = 'Y';

     		$('#'+gridId).alopexGrid('showProgress');
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsdRackCurstExcelcreate', param, 'GET', 'excelDownload');
 		});
	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/
	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		param.headerGrpCnt = 1;
		var excelHeaderGroupTitle = "";
		var excelHeaderGroupColor = "";
		var excelHeaderGroupFromIndex = "";
		var excelHeaderGroupToIndex = "";


		var excelHeaderGroupFromIndexTemp = "";
		var excelHeaderGroupToIndexTemp = "";
		var excelHeaderGroupTitleTemp ="";
		var excelHeaderGroupColorTemp = "";

		var toBuf = "";


		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			if (i== gridColmnInfo.length-1) {

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex-2 + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)-2+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf-2+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)-2+ ";";
				toBuf =  toBuf + (gridColmnInfo[i].groupColumnIndexes.length)
			}

			excelHeaderGroupTitleTemp += gridColmnInfo[i].title + ";";
			excelHeaderGroupColorTemp +='undefined'+ ";";

		}

		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			excelHeaderGroupFromIndex += excelHeaderGroupFromIndexTemp.split(";")[i] + ";";
			excelHeaderGroupToIndex += excelHeaderGroupToIndexTemp.split(";")[i] + ";";
			excelHeaderGroupTitle += excelHeaderGroupTitleTemp.split(";")[i] + ";";
			excelHeaderGroupColor += excelHeaderGroupColorTemp.split(";")[i] + ";";

		}

		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {


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

	function successCallback(response, status, jqxhr, flag){

		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		if(flag == 'fstOrg'){
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
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   	}

		if(flag == 'fstTeam'){
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
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
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
    		$('#tmofList').clear();
    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}
    		$('#tmofList').setData({
                 data:option_data
    		});
    	}

		if(flag == 'opTeam'){
    		$('#opTeamOrgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#opTeamOrgId').setData({
                 data:option_data
    		});
    	}

		//용도구분
		if(flag == 'searchGubun'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}
		// 본부
		if(flag == 'searchOrgL1'){
			var option_data = [{cd: '', cdNm: '전체'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				searchOrgL1: ''
			});
	   	}

    	// Rack 조회
    	if(flag == 'rack'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.upsdRackCurstList);
    	}

    	// 랙종료
    	if(flag == 'rackTypCdList'){

    		rackTypCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				rackTypCd.push(resObj);
			}
    	}

    	// 현행화주제
    	if(flag == 'crrtOnrCdList'){

    		crrtOnrCd = [];
    		reCnfCrrtOnrCd =[];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				crrtOnrCd.push(resObj);

				if (response[i].etcAttrVal1 != undefined) {
					if (response[i].etcAttrVal1.length > 0)
						reCnfCrrtOnrCd.push(resObj);
				}


			}
    	}

    	// 현행화 완료 여부
    	if(flag == 'crrtCnfCdList'){

    		crrtCnfCd = [];
    		reCnfCrrtCnfCd
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				crrtCnfCd.push(resObj);

				if (response[i].etcAttrVal1 != undefined) {
					if (response[i].etcAttrVal1.length > 0)
						reCnfCrrtCnfCd.push(resObj);
				}

			}
    	}


    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
            // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();
        }
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    // Rack 장비 그리드 호출
    this.setGrid = function(page, rowPerPage){
    	$('#pageNo').val(page);
   	 	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").serialize()
    	param = param + '&excelYn=N';

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUpsdRackCurstList', param, 'GET', 'rack');
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
				width : 800,
				height : window.innerHeight * 0.61
              });
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

    function setSPGrid(GridID,Option,Data) {
    	$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);

    }

});