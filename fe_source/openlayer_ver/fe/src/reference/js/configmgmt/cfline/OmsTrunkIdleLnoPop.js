/**
 * OmsTrunkIdleLnoPop.js
 *
 * @author Administrator
 * @date 2018. 12. 11
 * @version 1.0
 */

var popLnoGirdId = "popLineLnoGrid";

var paramData = null;

$a.page(function() {

    this.init = function(id, popParam) {
//    	if (! jQuery.isEmptyObject(popParam) ) {
//			paramData = popParam;
//		}
    	paramData = popParam;
        setEventListener();   
        initGridPop();      
    	setList(paramData) 
    };
   
    //TopGrid 초기화
    function initGridPop() {
    	var mappingColumn = [
		                     { selectorColumn : true, width : '50px' }
		  	 					, {key : 'ntwkLineNm',	align:'left',	width:'200px', 	title : cflineMsgArray['trunkNm']/*"트렁크명"*/}
		  	 					, {key : 'ntwkStatCdNm',	align:'center',	width:'100px', 	title : cflineMsgArray['ntwkStat']/*"네트워크상태"*/}
		  	 					, {key : 'trkRoleDivCdNm',	align:'center',	width:'100px', 	title : cflineMsgArray['trkRoleDiv']/*"트렁크역할구분"*/}
		  	 					, {key : 'eqpNm',	align:'left',	width:'200px', 	title : cflineMsgArray['equipmentName']/*"장비명"*/}
		  	 					, {key : 'aportNm',	align:'center',	width:'120px', 	title : "A_PORT"}
		  	 					, {key : 'bportNm',	align:'center',	width:'120px', 	title : "B_PORT"}
			];
        //그리드 생성 
        $('#'+popLnoGirdId).alopexGrid({
        	columnMapping : mappingColumn,
			cellSelectable : false,
			pager : false,
			rowClickSelect : true,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 270,
			message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		}
        });
    };
    
    function setEventListener() {
    	//	취소
    	$('#popBtnclose').on('click', function(e) {
    		$a.close(null);
	   	});   	

    	// 적용 버튼
    	$('#btnAddLnoRow').on('click', function(e) {
    		if( $('#'+popLnoGirdId).length == 0){
    			return;
    		}
    			
    		var dataList = $('#'+popLnoGirdId).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
    		var paramList = [];
    		
    		for(var i=0; i<dataList.length; i++ ){    			
				var voData = {"ntwkLineNm": dataList[i].ntwkLineNm, "ntwkStatCdNm": dataList[i].ntwkStatCdNm, "trkRoleDivCdNm": dataList[i].trkRoleDivCdNm
								, "eqpNm": dataList[i].eqpNm, "aportNm": dataList[i].aportNm
								, "bportNm": dataList[i].bportNm, "eqpId": dataList[i].eqpId};
				
				paramList.push(voData);
    		}
//    		console.log(paramList);
    		$a.close(paramList);
	   	});	
    	//  
    	
	};
    
	// 회선 조회
    function setList(dataParam){
        $('#'+popLnoGirdId).alopexGrid("dataSet", dataParam.pathList);
    }
    
 
});