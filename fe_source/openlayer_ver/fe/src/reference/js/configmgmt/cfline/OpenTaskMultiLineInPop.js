/**
 * OpenTaskMultiLineInPop
 *
 * @author Administrator
 * @date 2017. 9. 11.
 * @version 1.0
 */
//var gridTiePop = 'tieListPopGrid';
var paramData = null;
var selectDataObj = null;
var svlnCommCodePopData = [];  // 서비스회선 공통코드
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
    	


    	$('#jobRequestDtPopDis').setEnabled(false);
    	$('#lineUsePerdTypCdPop').setEnabled(false);
    	$('#svlnTypCdPop').setEnabled(false);
    	
    	$('#lineCapaCdPop').setEnabled(false);
    	$('#faltMgmtObjYnPop').setEnabled(false);
    	$('#lineOpenDtPopDis').setEnabled(false);
    	
    	$('#lineTrmnSchdDtPopDis').setEnabled(false);
    	$('#appltDtPopDis').setEnabled(false);
    	$('#lineDistTypCdPop').setEnabled(false);
    	
    	$('#lineSctnTypCdPop').setEnabled(false);
    	$('#chrStatCdPop').setEnabled(false);
    	$('#lineMgmtGrCdPop').setEnabled(false);
    	
    	$('#lineRmkOnePop').setEnabled(false);
    	$('#lineRmkTwoPop').setEnabled(false);
    	$('#lineRmkThreePop').setEnabled(false);    	
    	
    	paramData = param.dataList;
//		console.log(paramData);
    	setSelectCode();
        setEventListener();  
    };

    
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodePopData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodePopData');
    }
    
    function setEventListener() { 
    	// 전체 선택
	    $('#btnPopSelectAll').on('click', function(e) {
	    	// 체크 박스 체크 하기
	    	$('#jobRequestDtChk').setChecked(true);
	    	$('#lineUsePerdTypCdChk').setChecked(true);
	    	$('#svlnTypCdChk').setChecked(true);
	    	
	    	$('#lineCapaCdChk').setChecked(true);
	    	$('#faltMgmtObjYnChk').setChecked(true);
	    	$('#lineOpenDtChk').setChecked(true);
	    	
	    	$('#lineTrmnSchdDtChk').setChecked(true);
	    	$('#appltDtChk').setChecked(true);
	    	$('#lineDistTypCdChk').setChecked(true);
	    	
	    	$('#lineSctnTypCdChk').setChecked(true);
	    	$('#chrStatCdChk').setChecked(true);
	    	$('#lineMgmtGrCdChk').setChecked(true);
	    	
	    	$('#lineRmkOneChk').setChecked(true);
	    	$('#lineRmkTwoChk').setChecked(true);
	    	$('#lineRmkThreeChk').setChecked(true);   
	    	
	    	// enabled 하기
	    	$('#jobRequestDtPopDis').setEnabled(true);
	    	$('#lineUsePerdTypCdPop').setEnabled(true);
	    	$('#svlnTypCdPop').setEnabled(true);
	    	
	    	$('#lineCapaCdPop').setEnabled(true);
	    	$('#faltMgmtObjYnPop').setEnabled(true);
	    	$('#lineOpenDtPopDis').setEnabled(true);
	    	
	    	$('#lineTrmnSchdDtPopDis').setEnabled(true);
	    	$('#appltDtPopDis').setEnabled(true);
	    	$('#lineDistTypCdPop').setEnabled(true);
	    	
	    	$('#lineSctnTypCdPop').setEnabled(true);
	    	$('#chrStatCdPop').setEnabled(true);
	    	$('#lineMgmtGrCdPop').setEnabled(true);
	    	
	    	$('#lineRmkOnePop').setEnabled(true);
	    	$('#lineRmkTwoPop').setEnabled(true);
	    	$('#lineRmkThreePop').setEnabled(true);   
	   	});    	

	    $('#jobRequestDtChk').on('click', function(e) {
	    	if($('#jobRequestDtChk').getValues()=="Y"){
	    		$('#jobRequestDtPopDis').setEnabled(true);
	    	}else{
	    		$('#jobRequestDtPopDis').setEnabled(false);
	    		$('#jobRequestDtPop').val("");
	    	};
	   	});    	

	    $('#lineUsePerdTypCdChk').on('click', function(e) {
	    	if($('#lineUsePerdTypCdChk').getValues()=="Y"){
	    		$('#lineUsePerdTypCdPop').setEnabled(true);
	    	}else{
	    		$('#lineUsePerdTypCdPop').setEnabled(false);
	    		$('#lineUsePerdTypCdPop').setSelected("");
	    	};
	   	});    	
    	

	    $('#svlnTypCdChk').on('click', function(e) {
	    	if($('#svlnTypCdChk').getValues()=="Y"){
	    		$('#svlnTypCdPop').setEnabled(true);
	    	}else{
	    		$('#svlnTypCdPop').setEnabled(false);
	    		$('#svlnTypCdPop').setSelected("");
	    	};
	   	});     	
    	

	    $('#lineCapaCdChk').on('click', function(e) {
	    	if($('#lineCapaCdChk').getValues()=="Y"){
	    		$('#lineCapaCdPop').setEnabled(true);
	    	}else{
	    		$('#lineCapaCdPop').setEnabled(false);
	    		$('#lineCapaCdPop').setSelected("");
	    	};
	   	});     	
    	

	    $('#faltMgmtObjYnChk').on('click', function(e) {
	    	if($('#faltMgmtObjYnChk').getValues()=="Y"){
	    		$('#faltMgmtObjYnPop').setEnabled(true);
	    	}else{
	    		$('#faltMgmtObjYnPop').setEnabled(false);
	    		$('#faltMgmtObjYnPop').setSelected("");
	    	};
	   	});  

	    $('#lineOpenDtChk').on('click', function(e) {
	    	if($('#lineOpenDtChk').getValues()=="Y"){
	    		$('#lineOpenDtPopDis').setEnabled(true);
	    	}else{
	    		$('#lineOpenDtPopDis').setEnabled(false);
	    		$('#lineOpenDtPop').val("");
	    	};
	   	});    

	    $('#lineTrmnSchdDtChk').on('click', function(e) {
	    	if($('#lineTrmnSchdDtChk').getValues()=="Y"){
	    		$('#lineTrmnSchdDtPopDis').setEnabled(true);
	    	}else{
	    		$('#lineTrmnSchdDtPopDis').setEnabled(false);
	    		$('#lineTrmnSchdDtPop').val("");
	    	};
	   	});      

	    $('#appltDtChk').on('click', function(e) {
	    	if($('#appltDtChk').getValues()=="Y"){
	    		$('#appltDtPopDis').setEnabled(true);
	    	}else{
	    		$('#appltDtPopDis').setEnabled(false);
	    		$('#appltDtPop').val("");
	    	};
	   	});     

	    $('#lineDistTypCdChk').on('click', function(e) {
	    	if($('#lineDistTypCdChk').getValues()=="Y"){
	    		$('#lineDistTypCdPop').setEnabled(true);
	    	}else{
	    		$('#lineDistTypCdPop').setEnabled(false);
	    		$('#lineDistTypCdPop').setSelected("");
	    	};
	   	}); 

	    $('#lineSctnTypCdChk').on('click', function(e) {
	    	if($('#lineSctnTypCdChk').getValues()=="Y"){
	    		$('#lineSctnTypCdPop').setEnabled(true);
	    	}else{
	    		$('#lineSctnTypCdPop').setEnabled(false);
	    		$('#lineSctnTypCdPop').setSelected("");
	    	};
	   	}); 

	    $('#chrStatCdChk').on('click', function(e) {
	    	if($('#chrStatCdChk').getValues()=="Y"){
	    		$('#chrStatCdPop').setEnabled(true);
	    	}else{
	    		$('#chrStatCdPop').setEnabled(false);
	    		$('#chrStatCdPop').setSelected("");
	    	};
	   	}); 

	    $('#lineMgmtGrCdChk').on('click', function(e) {
	    	if($('#lineMgmtGrCdChk').getValues()=="Y"){
	    		$('#lineMgmtGrCdPop').setEnabled(true);
	    	}else{
	    		$('#lineMgmtGrCdPop').setEnabled(false);
	    		$('#lineMgmtGrCdPop').setSelected("");
	    	};
	   	}); 

	    $('#lineRmkOneChk').on('click', function(e) {
	    	if($('#lineRmkOneChk').getValues()=="Y"){
	    		$('#lineRmkOnePop').setEnabled(true);
	    	}else{
	    		$('#lineRmkOnePop').setEnabled(false);
	    		$('#lineRmkOnePop').val("");
	    	};
	   	}); 

	    $('#lineRmkTwoChk').on('click', function(e) {
	    	if($('#lineRmkTwoChk').getValues()=="Y"){
	    		$('#lineRmkTwoPop').setEnabled(true);
	    	}else{
	    		$('#lineRmkTwoPop').setEnabled(false);
	    		$('#lineRmkTwoPop').val("");
	    	};
	   	}); 

	    $('#lineRmkThreeChk').on('click', function(e) {
	    	if($('#lineRmkThreeChk').getValues()=="Y"){
	    		$('#lineRmkThreePop').setEnabled(true);
	    	}else{
	    		$('#lineRmkThreePop').setEnabled(false);
	    		$('#lineRmkThreePop').val("");
	    	};
	   	});   
		
		// 닫기
		$('#btnPopClose').on('click', function(e) {
			$a.close(null);
        });
		
		// 확인
		$('#btnPopConfirm').on('click', function(e) {
    		var paramPopData = {"tmp":""};
    			

	    	if($('#jobRequestDtChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"jobRequestDt":$('#jobRequestDtPop').val()});
	    	};

	    	if($('#lineUsePerdTypCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineUsePerdTypCd":$('#lineUsePerdTypCdPop').val()});
	    	};
    	

	    	if($('#svlnTypCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"svlnTypCd":$('#svlnTypCdPop').val()});
	    	};
    	
	    	if($('#lineCapaCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineCapaCd":$('#lineCapaCdPop').val()});
	    	};
    	
	    	if($('#faltMgmtObjYnChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"faltMgmtObjYn":$('#faltMgmtObjYnPop').val()});
	    	};

	    	if($('#lineOpenDtChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineOpenDt":$('#lineOpenDtPop').val()});
	    	};

	    	if($('#lineTrmnSchdDtChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineTrmnSchdDt":$('#lineTrmnSchdDtPop').val()});
	    	};

	    	if($('#appltDtChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"appltDt":$('#appltDtPop').val()});
	    	};

	    	if($('#lineDistTypCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineDistTypCd":$('#lineDistTypCdPop').val()});
	    	};

	    	if($('#lineSctnTypCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineSctnTypCd":$('#lineSctnTypCdPop').val()});
	    	};

	    	if($('#chrStatCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"chrStatCd":$('#chrStatCdPop').val()});
	    	};

	    	if($('#lineMgmtGrCdChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineMgmtGrCd":$('#lineMgmtGrCdPop').val()});
	    	};

	    	if($('#lineRmkOneChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineRmkOne":$('#lineRmkOnePop').val()});
	    	};

	    	if($('#lineRmkTwoChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineRmkTwo":$('#lineRmkTwoPop').val()});
	    	};
	    	if($('#lineRmkThreeChk').getValues()=="Y"){
	    		$.extend(paramPopData,{"lineRmkThree":$('#lineRmkThreePop').val()});
	    	};
	    	//console.log(paramPopData);
			$a.close(paramPopData);
        });	
    	
	};
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){ 
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodePopData') {
			if(response != null){
				svlnCommCodePopData = response;
				// 회선사용기간유형코드   
				$('#lineUsePerdTypCdPop').clear();
				$('#lineUsePerdTypCdPop').setData({data : svlnCommCodePopData.lineUsePerdTypCdList});
				$('#lineUsePerdTypCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#lineUsePerdTypCdPop').setSelected("");	
				// 회선용량코드   
				$('#lineCapaCdPop').clear();
				$('#lineCapaCdPop').setData({data : svlnCommCodePopData.svlnCapaCdList});
				$('#lineCapaCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#lineCapaCdPop').setSelected("");		
				//  회선관리등급
				$('#lineMgmtGrCdPop').clear();
				$('#lineMgmtGrCdPop').setData({data : svlnCommCodePopData.lineMgmtGrCdList});
				$('#lineMgmtGrCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#lineMgmtGrCdPop').setSelected("");				
				//  고장관리대상여부
				$('#faltMgmtObjYnPop').clear();
				$('#faltMgmtObjYnPop').setData({data : svlnCommCodePopData.ynList});
				$('#faltMgmtObjYnPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#faltMgmtObjYnPop').setSelected("");	
				//  회선거리유형
				$('#lineDistTypCdPop').clear();
				$('#lineDistTypCdPop').setData({data : svlnCommCodePopData.lineDistTypCdList});
				$('#lineDistTypCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#lineDistTypCdPop').setSelected("");	
				//  회선구간유형
				$('#lineSctnTypCdPop').clear();
				$('#lineSctnTypCdPop').setData({data : svlnCommCodePopData.lineSctnTypCdList});
				$('#lineSctnTypCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#lineSctnTypCdPop').setSelected("");	
				//  과금상태
				$('#chrStatCdPop').clear();
				$('#chrStatCdPop').setData({data : svlnCommCodePopData.chrStatCdList});
				$('#chrStatCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
				$('#chrStatCdPop').setSelected("");	
			}
		} 
		// svlnLclSclCodePopData
		if(flag == 'svlnLclSclCodePopData') {
			if(response != null){
//				console.log("paramData.length : " + paramData.length);
//				console.log(response.svlnTypCdList);
				var option_pop_data =  [];
				if(response.svlnTypCdList.length>0 && paramData != null && paramData.length>0){
					for(i=0; i<response.svlnTypCdList.length; i++){
						var dataPop = response.svlnTypCdList[i]; 
						for(k=0; k<paramData.length; k++){
							var dataTypePop = paramData[k]; 
		                    if(dataPop.comCd == '000' || (dataPop.etcAttrValOne != null && dataPop.etcAttrValOne.indexOf(dataTypePop.svlnSclCd) >=0)){
//		                    	console.log(dataTypePop.svlnSclCd + "===========" + dataPop.etcAttrValOne.indexOf(dataTypePop.svlnSclCd))
		                    	option_pop_data.push(dataPop);
		                    	break;
		                    }	
						}				
					}
					// 서비스회선유형코드
					$('#svlnTypCdPop').clear();
					$('#svlnTypCdPop').setData({data : option_pop_data});
					$('#svlnTypCdPop').prepend('<option value="">' + cflineCommMsgArray['select'] + '</option>');
					$('#svlnTypCdPop').setSelected("");					
				}
			}
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
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