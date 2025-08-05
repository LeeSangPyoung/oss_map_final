/**
 * RingUsingInfoPop.js
 * 휘더망링 회선조회
 * 휘더망링을 해지하는 경우 해당 휘더망을 사용중인 가입자망링이 있는 경우 리스트를 보여준다
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridUseLine = 'resultListGrid';
	
    this.init = function(id, param) {
 		var para = new Object(); 
		$.extend(para,{"useRingNoList":param.ntwkLineNoList});    
		initGrid();
        setEventListener();
        httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getringuselist', para , 'POST', 'useList');
    };
  //Grid 초기화
    function initGrid() {
    	var column = [
    		      	   {key : 'useRingNo',	title : cflineMsgArray['selTerminateRingId'], /* 해지선택링ID */	align:'center',	width: '110px'}
    		      	    , {key : 'useRingNm',	title : cflineMsgArray['selTerminateRingNm'] /* 해지선택링명 */, align:'left',	width: '240px'}
    		      	    , {key : 'ntwkLineNo',	title : cflineMsgArray['ringIdentification'] /*링ID*/,	align:'center',	width: '110px'}
    		    		, {key : 'ntwkStatCdNm' ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '80px'}
    		      	    , {key : 'ntwkLineNm',	title : cflineMsgArray['ringName'] /*링명*/, align:'left',	width: '240px'}
    		      	    , {key : 'mgmtGrpCdNm',	title : cflineMsgArray['managementGroup'] /*관리그룹*/, align:'center', width: '90px' }
    		      	    , {key : 'ntwkTypNm', title : cflineMsgArray['networkDivision'] /*망구분*/, align: 'center', width: '135px' }
    		      	    , {key : 'topoSclCdNm', title : cflineMsgArray['ntwkTopologyCd'] /*망종류*/, align:'center',	width: '150px' }
		];
    	
    	
        //그리드 생성
        $('#'+ gridUseLine).alopexGrid({
        	pager : false,
        	columnMapping : column,
        	cellSelectable : false,
            rowClickSelect : false,
            rowInlineEdit : false,
            rowSingleSelect : false,
            grouping : {
    			by : ['useRingNo', 'useRingNm'],
    			useGrouping:true,
    			useGroupRowspan:true,
    			useDragDropBetweenGroup:false,
    			useGroupRearrange : true
            },
            numberingColumnFromZero : false,
            height : 450
        });
    };
    
    function setEventListener() {
    	// 엑셀 버튼 
    	$('#btnExcelPop').on('click', function(e) {
    		 var worker = new ExcelWorker({
    			excelFileName : cflineMsgArray['useScrbrNetRingNm']/* 사용가입자망링 */,
         		palette : [{
         			className : 'B_YELLOW',
         			backgroundColor: '255,255,0'
         		},{
         			className : 'F_RED',
         			color: '#FF0000'
         		}],
         		sheetList: [{
         			sheetName: cflineMsgArray['useScrbrNetRingNm']/* 사용가입자망링 */,
         			$grid: $('#'+gridUseLine)
         		}]
         	});
         	worker.export({
         		merge: true,
         		exportHidden: false,
         		filtered  : false,
         		useGridColumnWidth : true,
         		border  : true
         	});
         });
    	
    	// 닫기
    	$('#btnPopClose').on('click', function(e) {
    		 $a.close();
        });
    	
	};
	
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
	function successCallback(response, status, jqxhr, flag){
		cflineHideProgressBody();
		if(flag == "useList"){
			if( response != null ){
				var useRingListCnt= response.totalCnt
				var span =makeArgMsg('useRingMsg',useRingListCnt,"","",""); /* 선택하신 휘더망링을 사용하는 {0}건의 가입자망링이 있습니다. <br>해당 가입자망링을 해지한후 해지하세요. */
	        	document.getElementById("titleGroupPop").innerHTML = span;
        		$('#'+gridUseLine).alopexGrid('dataSet', response.useRingList );
			}
		}
	}
	
    function failCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    }
});