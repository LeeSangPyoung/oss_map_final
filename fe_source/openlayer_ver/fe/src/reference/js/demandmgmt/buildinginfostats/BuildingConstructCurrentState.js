/**
 * BuildConstructCurrentState
 *
 * @author P106861
 * @date 2017. 2. 28. 오전 11:00:00
 * @version 1.0
 */

$a.page(function() {
	
	//그리드 ID
    var gridId = 'bldCnstGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);

        initGrid();
    	setCombo();
    	setEventListener();
    };
    
  //Grid 초기화
    function initGrid() {
    	var mapping =  [
			{
				key : 'index'
				, align: 'left'
				, width: '100px'
				, title : buildingInfoMsgArray['index']/*인덱스*/
				, hidden: true			
			}
			, {
				key : 'grdAril'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['groundAerial']/*지중/가공*/
				, rowspan:true
			}
			, {
				key : 'invtUchg'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['investUncharged']/*유상/무상*/
				, rowspan:true
			}
			, {
				key : 'item'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['itm']/*항목*/
			}
			, {
				key : 'sudoSub'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['capitalArea']/*수도권*/
			}
			, {
				key : 'busanSub'
				,align:'center'
				,width:'100px'
				,title : '동부'/* 부산 */
			}
			/*, {
				key : 'daeguSub'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['daegu'] 대구 
			}*/
			, {
				key : 'seobuSub'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['westernPart']/* 서부 */
			}
			, {
				key : 'jungbuSub'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['centerPart']/* 중부 */
			}
			, {
				key : 'sum'
				,align:'center'
				,width:'100px'
				,title : buildingInfoMsgArray['summarization']/* 합계 */
			}			
    	];
    	
    	//그리드 생성
    	$('#'+gridId).alopexGrid({
    		autoColumnIndex: true,
    		fitTableWidth: true,
    		rowClickSelect : true,
    		disableTextSelection : true, //더블클릭 또는 마우스 드래그에 의한 텍스트 선택 방지
    		disableHeaderClickSorting : true, //헤더클릭 정렬 막기
    		rowSingleSelect : false,
    		numberingColumnFromZero : false,
    		height : 580,
    		headerGroup : [
    		   			{ fromIndex : 1 , toIndex : 3 , title : buildingInfoMsgArray['division'] }/* 구분 */
    		   		],
    		grouping : {
    					useGrouping : true,
    					by : ['grdAril', 'invtUchg'],
    					useGroupRowspan : true
    					},
    		columnMapping : mapping,
    		message: {
 				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + buildingInfoMsgArray['noInquiryData']  + "</div>", /*'조회된 데이터가 없습니다.'*/
 				filterNodata : 'No data'
    		}
    		
    	});
    	
    	$('#'+gridId).on('dataSelectEnd', function(e) {
    		return false;
    	});     
    }
    
    function setCombo() {
    	
    	$("#lkupDateStart").val(getViewDateStr("YYYYMMDD", -30));
		$("#lkupDateEnd").val(getViewDateStr("YYYYMMDD"));
    	
    }
    
    function setEventListener() {
    	
    	$('#search').on('click',function(e){
    		
    		var dataParam = $("searchForm").getData();
    		
    		dataParam.lkupDateStart = $("#lkupDateStart").val().replace(/-/gi, "");
        	dataParam.lkupDateEnd = $("#lkupDateEnd").val().replace(/-/gi, "");
        	
        	bodyProgress();
        	console.log(dataParam);
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfostats/getbldcnstlist'
        			, dataParam 
        			, 'GET'
        			, 'bldcnstlist'
        			);      	
    	});
    	
    	$('#excelDownload').on('click',function(e){    		
    		excelExport();
    	});
    	
    }
    
    function excelExport() {
    	var list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
    	if ( list.length < 1 ) {
    		alertBox('W',buildingInfoMsgArray['noData']);
    		return false;
    	}
    	
    	callMsgBox('','C', buildingInfoMsgArray['confirmExcelPrinting'], function(msgId, msgRst){ /* 엑셀로 출력 하시겠습니까? */
    		if (msgRst == 'Y') {
    			bodyProgress();
    			var worker = new ExcelWorker({
    				excelFileName : buildingInfoMsgArray['buildingConstructCurrentState'], /*건물구축현황*/
    				palette : [{
    					className : 'B_YELLOW',
    					backgroundColor : '255,255,0'
    				},{
    					className : 'F_RED',
    					color : '#FF0000'
    				}],
    				sheetList : [{
    					sheetName : buildingInfoMsgArray['buildingConstructCurrentState'], /*건물구축현황*/
    					$grid : $('#'+gridId)
    				}]
    			});
    			worker.export({
    				filterdata : false,
    				selected : false,
    				exportHidden : false,
    				merge : false
    			});
            	bodyProgressRemove();
    		}
    	});
    }
    
    //request
	function demandRequest(surl,sdata,smethod,sflag)
    {		
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    }
	
	 function successDemandCallback(response, flag){
		 
		 if(flag == "bldcnstlist") {
			 
			 console.log(response);
	    	 //hideProgress(gridId);
	    	 bodyProgressRemove();
	    	 
	    	 if(response != null){
	    		 $('#'+gridId).alopexGrid("dataSet", response.list);
	    	 }
	    	 
		 }
	 
	 }
	 
	 function failDemandCallback(response, flag){
		 
		 bodyProgressRemove();
	     console.log(response);
		 
	 }
    
})