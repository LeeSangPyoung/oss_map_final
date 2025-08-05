/**
 * BuildConstructCurrentState
 *
 * @author P106861
 * @date 2017. 3. 09. 오전 09:00:00
 * @version 1.0
 */

$a.page(function() {
	
	//그리드 ID
    var gridId = 'vldBldGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);

        initGrid();
        setEventListener();
    };
    
    function initGrid() {
    	var mapping =  [
    	        		{ 
    	        			key : 'hdofcNm'
    	        			,title : buildingInfoMsgArray['hdofc'] /* 본부 */
    	        			,align : 'center'
    	        		    ,width : '100px'
    	        		}
    	        		,{
    	        			key : 'newBld'
    	        			,title : buildingInfoMsgArray['newBuilding'] /* 신축 */
    	        			,align : 'right'
    	        			,width : '100px'
    	        		},
    	        		{ 
    	        			key : 'exstBld'
    	        			,title : buildingInfoMsgArray['existingBuilding']  /* 기축 */
    	        			,align : 'right'
    	        			,width : '100px'
    	        		}
    	        		,{ 
    	        			key : 'newBldRate'
    	        			,title : buildingInfoMsgArray['newBuildingRate']  /* 신축비율 */
    	        			,align : 'right'
    	        			,width : '100px'
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
    		columnMapping : mapping,
    		message: {
 				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + buildingInfoMsgArray['noInquiryData'] + "</div>", /*'조회된 데이터가 없습니다.'*/
 				filterNodata : 'No data'
    		}
    	});
    	
    	$('#'+gridId).on('dataSelectEnd', function(e) {
    		return false;
    	});
    	
    }
    
    function setEventListener() {
    	
    	var dataParam = null;
    	
    	$('#search').on('click',function(e){
    		console.log("search.click");
        	bodyProgress();
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfostats/getvldbldlist'
        			, dataParam
        			, 'GET'
        			, 'vldbldlist'
        			);      	
    	});
    	
    	$('#excelDownload').on('click',function(e){    		
    		excelExport();
    	});
    	
    }
    
    function excelExport() {
    	var list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
    	if ( list.length < 1 ) {
    		alertBox('W',buildingInfoMsgArray['noData']); /* 데이터가 없습니다. */
    		return false;
    	}
    	
    	callMsgBox('','C', buildingInfoMsgArray['confirmExcelPrinting'], function(msgId, msgRst){ /* 엑셀로 출력 하시겠습니까? */
    		if (msgRst == 'Y') {
    			bodyProgress();
    			var worker = new ExcelWorker({
    				excelFileName : buildingInfoMsgArray['validBuildingCurrentState'], /* 유효건물현황 */
    				palette : [{
    					className : 'B_YELLOW',
    					backgroundColor : '255,255,0'
    				},{
    					className : 'F_RED',
    					color : '#FF0000'
    				}],
    				sheetList : [{
    					sheetName : buildingInfoMsgArray['validBuildingCurrentState'], /* 유효건물현황 */
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
		 
		 if(flag == "vldbldlist") {
			 
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