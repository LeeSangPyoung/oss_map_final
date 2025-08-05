/**
 * FhDsnObjMgmt.js
 *
 * @author P135551
 * @date 2019. 1. 29. 오전 13:30:03
 * @version 1.0
 */

var gridModel = null;
var main = $a.page(function() {

	//그리드 ID
    var gridId = 'fhDsnGrid';
    var dictionaryObj = {};

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$("#fhEngId").setData(param);
        initGrid();
    	setEventListener();
    };

  //Grid 초기화
    function initGrid() {

    	var mapping =  [
    		  {key : 'fhSiteKeyId'       , align:'center', width:'130px', title : '사이트키'}
    		, {key : 'fhOnaSiteKeyNm'    , align:'center', width:'130px', title : '사이트명'}
    		, {key : 'lowMtsoId'         , align:'center', width:'100px', title : '국사ID'}
    		, {key : 'lowMtsoNm'         , align:'center', width:'130px', title : '국사명'}
    		, {key : 'lmtsoLtdAddr'      , align:'center', width:'150px', title : '국사주소'}
    		, {key : 'fhEngObjNum'       , align:'center', width:'80px' , title : '설계수량'}
    		, {key : 'eqpNum'            , align:'center', width:'80px' , title : 'DU-L수량'}
    		, {key : 'fhFocsMtsoSiteId'  , align:'center', width:'130px', title : '사이트키'}
    		, {key : 'fhFocsMtsoSiteNm'  , align:'center', width:'130px', title : '사이트명 '}
	  		, {key : 'uprMtsoId'         , align:'center', width:'100px', title : '국사ID'}
	  		, {key : 'uprMtsoNm'         , align:'center', width:'130px', title : '국사명'}
	  		, {key : 'umtsoLtdAddr'      , align:'center', width:'150px', title : '국사주소'}
    	];

    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/FhDsnSiteList"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 10000,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : false,
             rowInlineEdit : true,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:true,
         	   pagerSelect:false,
         	   hidePageList:true
            },

            headerGroup:
    			[
    				{fromIndex:1, toIndex:7, title:'하위국 정보'},
            		{fromIndex:8, toIndex:12, title:'집중국 정보'}
    		    ]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
   	         model: gridModel                  // ajax option에 grid 연결할 model을지정
   		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
   		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
            ,height: "8row"
//            	,filteringHeader : true
        });
    }

    var showProgress = function(gridId){
		$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

    function setEventListener() {
    	//엔터키로 조회
        $('#dtlSearch').on('keydown', function(e){
    		if (e.which == 13  ){
    			$('#search').click();
      		}
    	 });
    	$("#btnCnclReg").on('click', function(e){
    		$a.close();
    	});

    	$("#search").on('click', function(e){
    		var dataParam = $("#dtlSearch").getData();
    		dataParam.fhEngId = $("#fhEngId").val();
    		dataParam.pageNo = '1';
        	dataParam.rowPerPage = '10000';
    		gridModel.get({
        		data: dataParam
        	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'search');})
        	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});
    	});

    	$('#btnExportExcel').on('click', function(e) {

    		var dt = new Date();
 			var recentY = dt.getFullYear();
 			var recentM = dt.getMonth() + 1;
 			var recentD = dt.getDate();

 			if(recentM < 10) recentM = "0" + recentM;
 			if(recentD < 10) recentD = "0" + recentD;

 			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

 			var worker = new ExcelWorker({
 				excelFileName : '사이트별수량_'+recentYMD,
 				sheetList : [{
 					sheetName : '사이트별수량',
 					$grid : $("#"+gridId)
 				}]
 			});

 			worker.export({
 				merge : true,
 				useCSSParser : true,
 				useGridColumnWidth : true,
 				border : true,
 				callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
 			});

         });

    };

    function successCallback(response, status, jqxhr, flag){

    }

  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'deletelist') {
    		bodyProgressRemove();
    		alertBox('W', '정상적으로 처리되지 않았습니다.');
    		return;
    	}
    }

    function bodyProgress() {
    	$('body').progress();
    }

    function bodyProgressRemove() {
    	$('body').progress().remove();
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