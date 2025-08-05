/**
 * FctInvtOvrl.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();


        var adtnAttrVal = $('#adtnAttrVal').val();
		if(adtnAttrVal.indexOf('CM_FCT_MGMT') == -1){									// 부대설비 역할 그룹
			$("#gClsDivEqpInfText").html("<font color=red>※ 부대설비 관리자로 설정된 인원만 수정가능합니다.</font>");
		} else {
			$("#gClsDivEqpInfText").html("");
    	}
    };

    function setRegDataSet(data) {

    }

    //Grid 초기화
    function initGrid() {

		var headerMappingN = [
					 	 {fromIndex:5, toIndex:6, title:"계약금액(실례가)", id:'u0'}
						,{fromIndex:8, toIndex:14, title:"물자 구매 수량", id:'u1'}
						,{fromIndex:15, toIndex:21, title:"재고물자 활용수량", id:'u2'}
						,{fromIndex:22, toIndex:28, title:"물자비(천원)", id:'u3'}
						,{fromIndex:29, toIndex:35, title:"공사비(천원)", id:'u4'}
						,{fromIndex:36, toIndex:42, title:"투자비 합계(천원)", id:'u5'}];

		var mappingN = [
						 {key:'matlClNm'    , align:'center', title:'품명'  , width:'90px'}
						,{key:'etcAttrVal1' , align:'center', title:'구분1', width:'90px'}
						,{key:'etcAttrVal2' , align:'center', title:'구분2', width:'90px'}
						,{key:'matlItemNm'  , align:'center', title:'품목명', width:'150px'}
						,{key:'namsMatlCd'  , align:'center', title:'NAMS코드' , width:'90px'}
						,{key:'cellCtrtUprc', align:'right', title:'단가/Cell', width:'90px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
							render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value);
							},
							editable : function(value, data) {
								var strVal = value;
								var strCss = 'width:100%;height:22px;text-align:right;';
								return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
							}
						}
						,{key:'jarCtrtUprc' , align:'right', title:'단가/조'   , width:'90px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
							render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value);
							},
							editable : function(value, data) {
								var strVal = value;
								var strCss = 'width:100%;height:22px;text-align:right;';
								return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
							}
						}
						,{key:'cstrCost'    , align:'right', title:'공사비'    , width:'80px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
							render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value);
							},
							editable : function(value, data) {
								var strVal = value;
								var strCss = 'width:100%;height:22px;text-align:right;';
								return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
							}
						}
						,{key:'buyT11000'   , align:'center', title:'수도권', width:'60px'}
						,{key:'buyT12000'   , align:'center', title:'동부'  , width:'60px'}
						,{key:'buyT13000'   , align:'center', title:'부산'  , width:'60px', headerStyleclass: "white"}
						,{key:'buyT14000'   , align:'center', title:'대구'  , width:'60px', headerStyleclass: "white"}
						,{key:'buyT12001'   , align:'center', title:'서부'  , width:'60px'}
						,{key:'buyT12002'   , align:'center', title:'중부'  , width:'60px'}
						,{key:'buyTotal'    , align:'center', title:'소계'  , width:'60px', headerStyleclass: "skyblue"}
						,{key:'inveT11000'  , align:'center', title:'수도권', width:'60px'}
						,{key:'inveT12000'  , align:'center', title:'동부'  , width:'60px'}
						,{key:'inveT13000'  , align:'center', title:'부산'  , width:'60px', headerStyleclass: "white"}
						,{key:'inveT14000'  , align:'center', title:'대구'  , width:'60px', headerStyleclass: "white"}
						,{key:'inveT12001'  , align:'center', title:'서부'  , width:'60px'}
						,{key:'inveT12002'  , align:'center', title:'중부'  , width:'60px'}
						,{key:'inveTotal'   , align:'center', title:'소계'  , width:'60px', headerStyleclass: "skyblue"}
						,{key:'mtrlT11000'  , align:'right', title:'수도권', width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'mtrlT12000'  , align:'right', title:'동부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'mtrlT13000'  , align:'right', title:'부산'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "white"}
						,{key:'mtrlT14000'  , align:'right', title:'대구'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "white"}
						,{key:'mtrlT12001'  , align:'right', title:'서부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'mtrlT12002'  , align:'right', title:'중부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'mtrlTotal'   , align:'right', title:'소계'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "skyblue"}
						,{key:'cstrT11000'  , align:'right', title:'수도권', width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'cstrT12000'  , align:'right', title:'동부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'cstrT13000'  , align:'right', title:'부산'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "white"}
						,{key:'cstrT14000'  , align:'right', title:'대구'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "white"}
						,{key:'cstrT12001'  , align:'right', title:'서부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'cstrT12002'  , align:'right', title:'중부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'cstrTotal'   , align:'right', title:'소계'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "skyblue"}
						,{key:'invtT11000'  , align:'right', title:'수도권', width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'invtT12000'  , align:'right', title:'동부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'invtT13000'  , align:'right', title:'부산'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "white"}
						,{key:'invtT14000'  , align:'right', title:'대구'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "white"}
						,{key:'invtT12001'  , align:'right', title:'서부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'invtT12002'  , align:'right', title:'중부'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } }
						,{key:'invtTotal'   , align:'right', title:'소계'  , width:'80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return main.setComma(value); } , headerStyleclass: "skyblue"}
						,{key:'invtItemRmk' , align:'left', title:'비고'  , width:'150px'}];

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	defaultColumnMapping:{
    			sorting : true
    		},
    		rowOption : {
    			defaultHeight : "content"
    		},
    		pager:false,
        	autoColumnIndex: true,
			rowInlineEdit: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerGroup : headerMappingN,
       		columnMapping : mappingN,
   			message: {/* 데이터가 없습니다.      */
   				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
   			}
   	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		//var hideColList = ['eqpMdlId'];
		//$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'seachAfeYrInf'); 			// AFE 년도
    }

    function setEventListener() {
    	var perPage = 100;

    	$('#'+gridId).on('rowInlineEditEnd',function(e){
    		var adtnAttrVal = $('#adtnAttrVal').val();
    		if(adtnAttrVal.indexOf('CM_FCT_MGMT') != -1){									// 부대설비 역할 그룹
    			var param = AlopexGrid.parseEvent(e).data;
    			var userId = $("#userId").val();
    			var afeYr = $("#afeYr").val();
    			var afeDgr = $("#afeDgr").val();
    			if (userId == "") { userId = "SYSTEM"; }
    			param.frstRegUserId = userId;
    			param.afeYr 		= afeYr;
    			param.afeDgr 		= afeDgr;

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/setMergeCostChange', param, 'POST', 'mergeCostChange');
        	}
    	});


		$('#afeYr').on('change', function(e) {
			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', param, 'GET', 'seachDgrInf'); // 차수별 컬럼 정의
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

         $('#btnSmryHdofc').on('click', function(e) {
          	var param =  $("#searchForm").getData();

          	$a.popup({
     	 		popid: 'SmryHdofcPop',
     	 		title: '본부별 요약',
     	 		url: '/tango-transmission-web/configmgmt/fctinvt/FctInvtSmryHdofcPop.do',
     	 		data: param,
     	 		windowpopup : true,
  	   	 		modal: true,
                 movable:true,
     	 		width : 1000,
     	 		height : 500
     	 	});
      	 });

         $('#btnSmryFclts').on('click', function(e) {
          	var param =  $("#searchForm").getData();

          	$a.popup({
     	 		popid: 'SmryFcltsPop',
     	 		title: '구매 요약',
     	 		url: '/tango-transmission-web/configmgmt/fctinvt/FctInvtSmryFcltsPop.do',
     	 		data: param,
     	 		windowpopup : true,
  	   	 		modal: true,
                 movable:true,
     	 		width : 1000,
     	 		height : 600
     	 	});
      	 });

    	 $('#btnExportExcel').on('click', function(e) {
        	//tango transmission biz 모듈을 호출하여야한다.
        	var param =  $("#searchForm").getData();
        	var fileName = "";
        	var method = "";

    		param = gridExcelColumn(param, gridId);

    		param.pageNo = 1;
    		param.rowPerPage = 10;
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

         	fileName = '부대설비투자종합';
         	method = 'getFctInvtOvrlList';

    		param.fileName = fileName;
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method =method;

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/stcexcelcreate', param, 'GET', 'excelDownload');
         });

	};

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'seachAfeYrInf'){
			$('#afeYr').clear();
			var option_data = [];
			for(var i = 0; i < response.afeYrList.length; i++){
				var resObj = {cd : response.afeYrList[i].afeYr, cdNm : response.afeYrList[i].afeYr};
				option_data.push(resObj);
			}
			var nDate = new Date();
			var nYear = nDate.getFullYear().toString();
			$('#afeYr').setData({data : option_data, option_selected:nYear});

			var afeYr = $('#afeYr').val();

			var param = {afeYr : afeYr, afeDivCd : 'G5', useYn : 'Y'};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', param, 'GET', 'seachDgrInf'); // 차수별 컬럼 정의
		}

		if(flag == 'seachDgrInf'){
			$('#afeDgr').clear();
			var option_data = [];
			for(var i = 0; i < response.afeDgrList.length; i++){
				var resObj = {cd : response.afeDgrList[i].afeDgr, cdNm : response.afeDgrList[i].afeDgr};
				option_data.push(resObj);
			}
			$('#afeDgr').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.fctInvtOvrlList);
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

    function setSPGrid(GridID,Option,Data) {
//		var serverPageinfo = {
//	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
//	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
//	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
//	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, '');

	}

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

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
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
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getFctInvtOvrlList', param, 'GET', 'search');
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

	this.setComma = function(str) {
		str = String(str);
		return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}

});