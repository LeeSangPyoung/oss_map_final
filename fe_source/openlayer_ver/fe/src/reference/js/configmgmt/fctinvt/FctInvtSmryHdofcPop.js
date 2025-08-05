/**
 * FctInvtSmryHdofcPop.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var pop = $a.page(function() {

	var paramData = null;
	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        setEventListener();
      	 $('#afeYr').val(param.afeYr);
       	 $('#afeDgr').val(param.afeDgr);
       	 
        httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getFctInvtSmryHdofcList', param, 'GET', 'search');
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 400,
    		pager:false,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		grouping : {
    			by : ['stcNm'],
    			useGrouping : true,
        		useGroupRearrange:true,
        		useGroupRowspan:true
         	},
    		columnMapping: [
				 {key:'stcNm'      , align:'center', title:'구분' , width:'100px', rowspan:true}
				,{key:'demdHdofcNm', align:'center', title:'본부', width:'90px'}
				,{key:'totVal'     , align:'right' , title:'합계'    , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); }, headerStyleclass : 'headerBackGroundBlueS' }
				,{key:'rtfVal'     , align:'right' , title:'정류기'  , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'batryVal'   , align:'right' , title:'축전지'  , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'arcnVal'    , align:'right' , title:'냉방기'  , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'rmsVal'     , align:'right' , title:'RMS'     , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'outdrVal'   , align:'right' , title:'옥외함체', width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'fextnVal'   , align:'right' , title:'소화기'  , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'spdVal'     , align:'right' , title:'SPD'     , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'ipdVal'     , align:'right' , title:'IPD'     , width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
				,{key:'epwrVal'    , align:'right' , title:'전기공사', width:'90px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return pop.setComma(value); } }
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    function setEventListener() {

    	//엑셀다운
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

          	fileName = '부대설비투자요약-본부별';
          	method = 'getFctInvtSmryHdofcList';

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

		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.fctInvtSmryHdofcList);
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