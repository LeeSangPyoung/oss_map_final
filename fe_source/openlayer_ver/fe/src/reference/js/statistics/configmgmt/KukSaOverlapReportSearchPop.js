/**
 * KukSaOverlapReportSearchPop.js
 *
 * @author P123512
 * @date 2018.01.05
 * @version 1.0
 */

$a.page(function() {
	var whole = cflineCommMsgArray['all'] /* 전체 */;
	var selectGrid = 'selectGrid';
	var addGrid    = 'addGrid';
	var addDataList = [];
	var mgmtGrpList = [];
	var mtsoSktList = []; 
	var mtsoSkbList = [];
	var gridIdscrollBottom = true;
	var searchYn   = false ;
	var pageForCount = 200;
	this.init = function(id, param) {
		mtsoSktList.push({"uprComCd":"","value":"","text":whole});
		mtsoSkbList.push({"uprComCd":"","value":"","text":whole});
		$('#title').text("추가검색");
		setSelectCode();
        initGrid();
        $('#'+addGrid).alopexGrid("dataSet", param["data"]);
        addDataList =  param["data"];
        setEventListener();
	};
	
	//Grid 초기화
	function initGrid() {
		var selectColomn = [
		                     { selectorColumn : true, width : '50px' }
		                    , {key : 'ordRow',			align : 'center',		width :	'50px',			title : cflineMsgArray['sequence']							    /* 순번 */ }
		                    , {key : 'bonbuNm',			align : 'center',		width :	'90px',			title : cflineMsgArray['hdofc']									/* 본부 */ }
		                    , {key : 'teamNm', 			align : 'center', 		width : '90px', 		title : cflineMsgArray['team']									/* 팀 */}
		                    , {key : 'tmofNm',			align : 'center',		width : '120px',		title : cflineMsgArray['transmissionOffice']					/* 전송실 */}
		                    , {key : 'mtsoNm', 			align : 'center', 		width : '140px', 		title : cflineMsgArray['mtso']									/* 국사 */}
		                    , {key : 'mtsoTyp', 		align : 'center', 		width : '140px', 		title : cflineMsgArray['mobileTelephoneSwitchingOfficeType']	/* 국사유형 */}
		                    , {key : 'bldAddr', 		align : 'left', 		width : '160px', 		title : cflineMsgArray['address']								/* 주소 */}
		                    , {key : 'mtsoId', 			align : 'left', 		width : '160px', 		hidden:true														/* 국사ID */}
		]
		
		var addColumn = [
		                     { selectorColumn : true, width : '50px' } 
		                    , {key : 'addbonbuNm',		align : 'center',		width : '90px',			title : cflineMsgArray['hdofc']									/* 본부 */ }
		                    , {key : 'addteamNm', 		align : 'center', 		width : '90px', 		title : cflineMsgArray['team']									/* 팀 */}
		                    , {key : 'addtmofNm',		align : 'center',		width : '120px',		title : cflineMsgArray['transmissionOffice']					/* 전송실 */}
		                    , {key : 'addmtsoNm', 		align : 'center', 		width : '140px', 		title : cflineMsgArray['mtso']									/* 국사 */}
		                    , {key : 'addmtsoTyp', 		align : 'center', 		width : '140px', 		title : cflineMsgArray['mobileTelephoneSwitchingOfficeType']	/* 국사유형 */}
		                    , {key : 'addbldAddr', 		align : 'left', 		width : '160px', 		title : cflineMsgArray['address']								/* 주소 */}
		                    , {key : 'addmtsoId', 		align : 'left', 		width : '160px', 		hidden:true														/* 국사ID */}
		]


		//Grid 생성
		$('#'+selectGrid).alopexGrid({
			columnMapping : selectColomn,
	    	pager : true,
			rowInlineEdit : false,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 250
		});
		
		$('#'+addGrid).alopexGrid({
			columnMapping : addColumn,
	    	pager : true,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 250
		});
	};
	
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(){
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kuksaoverlapreport/getMgmtGrpList', null, 'GET', 'getMgmtGrpList');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kuksaoverlapreport/getMtsoList', null, 'GET', 'getMtsoList');
    }

	function setEventListener() {
    	//추가
		$('#addition').on('click', function(e) {
			/*조회 그리드의 데이터들을 담는다*/
			 var dataList = $('#'+selectGrid).alopexGrid('dataGet', {_state: {selected:true}});  
			 var noOverLap = [];
			 var overlap = false;
			 
			 if(addDataList.length != 0 ) {
				 /*이미 addDataList에 데이터들이 들어있으므로 중복데이터를 제외한 새로운 데이터들만 뽑아서 noOverLap에 추가*/
				 for(var idx = 0 ; idx < dataList.length ; idx++ )	{
					 for(var index = 0 ; index < addDataList.length ; index++ ) {
						 if(addDataList[index].addmtsoId == dataList[idx].mtsoId ) {
							 overlap = true;
						 }
					 }
					 if(overlap == false ) {
						 noOverLap.push(dataList[idx]);
					 } else if(overlap == true ){
						 overlap = false; 
					 }
				 }
				 /*중복이 아닌 데이터들만 있는 noOverLap데이터를  기존 addDataList에 추가*/
				 for(var idx = 0 ; idx < noOverLap.length ; idx++ ) {
					 addDataList.push({addmtsoId : noOverLap[idx].mtsoId
						 			  ,addbonbuNm : noOverLap[idx].bonbuNm
						 			  ,addteamNm : noOverLap[idx].teamNm 
						 			  ,addtmofNm : noOverLap[idx].tmofNm 
						 			  ,addmtsoNm : noOverLap[idx].mtsoNm 
						 			  ,addmtsoTyp : noOverLap[idx].mtsoTyp
						 			  ,addbldAddr : noOverLap[idx].bldAddr
					 });
				 }
			 } else {
				 for(var idx = 0 ; idx < dataList.length ; idx++) {
					 addDataList.push({addmtsoId : dataList[idx].mtsoId
			 			  ,addbonbuNm : dataList[idx].bonbuNm
			 			  ,addteamNm : dataList[idx].teamNm 
			 			  ,addtmofNm : dataList[idx].tmofNm 
			 			  ,addmtsoNm : dataList[idx].mtsoNm 
			 			  ,addmtsoTyp : dataList[idx].mtsoTyp
			 			  ,addbldAddr : dataList[idx].bldAddr
					 });
				 }
			 } 
			 $('#'+addGrid).alopexGrid('dataSet', addDataList);
        });
		
        $('#'+selectGrid).on('scrollBottom', function(e){
        	if (gridIdscrollBottom){
        		searchYn = false ; 
            	setGrid(pageForCount,pageForCount,0,0);
        	}
        	
    	});
		
    	//삭제
		$('#delete').on('click', function(e) {
			$('#'+addGrid).alopexGrid("dataDelete", {_state: {selected:true}});
			var dataList = $('#' + addGrid).alopexGrid('dataGet', {_state: {selected: false}});
			addDataList = dataList;
        });
		
    	//초기화
		$('#initialization').on('click', function(e) {
			 $('#'+addGrid).alopexGrid("dataDelete");
			 addDataList = [];
        });
		
		//확인 
		$('#confirm').on('click', function(e) {
			$a.close(addDataList);
        });
		
		//조회 
		$('#btnSearch').on('click', function(e) {
			searchYn = true ; 
		 	gridIdscrollBottom = true;
		 	gridIdWorkscrollBottom = true;
		 	setGrid(1,pageForCount,1,pageForCount);
        });
    	// 관리그룹 선택시
	 	$('#ownCd').on('change',function(e){
			if($('#ownCd').val() == "0001") {
				$('#topMtsoCd').setData({data : mtsoSktList});
			} else if($('#ownCd').val() == "0002") {
				$('#topMtsoCd').setData({data : mtsoSkbList});
			}
		
			if($('#ownCd').val() == "0001"){
				option_data =  [{comCd: "",comCdNm: cflineCommMsgArray['all']},
								{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else if($('#ownCd').val() == "0002"){ 
				option_data =  [{comCd: "",comCdNm: cflineCommMsgArray['all']},
								{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCd').setData({
	             data:option_data
			});
	   	});
	 	
	 	// 엔터 이벤트 
      	$('#KukSaOverlapReportSearchPop').on('keydown', function(e){
      		if (e.which == 13  ){
    			searchYn = true ; 
    		 	gridIdscrollBottom = true;
    		 	gridIdWorkscrollBottom = true;
    		 	setGrid(1,pageForCount,1,pageForCount);
        	}
      	});
	 	
	};
	
	function setGrid(first01, last01,first02, last02) {
	       
		if( first01 == "1" && last01 =="200" && first02 == "1" && last02 =="200"){
			
			$("#firstRowIndex").val( parseInt(first01) );
			$("#lastRowIndex").val( parseInt(last01) );

			$("#firstRow01").val( parseInt(first01) );
			$("#lastRow01").val( parseInt(last01) );

			$("#firstRow02").val( parseInt(first02) );
			$("#lastRow02").val( parseInt(last02) );
			 
		}else{
	
			$("#firstRow01").val( parseInt($("#firstRow01").val())  + parseInt(first01)  ) ;
			$("#lastRow01").val( parseInt($("#lastRow01").val())  + parseInt(last01)  ) ;	
			
			$("#firstRowIndex").val( parseInt($("#firstRow01").val())  ) ;
			$("#lastRowIndex").val( parseInt($("#lastRow01").val())    ) ;						
	
		}
		
    	var dataParam =  $("#KukSaOverlapReportSearchPop").getData(); 
    	if(dataParam.ownCd == '0001') {
    		dataParam.ownCd = 'SKT';
    	} else if(dataParam.ownCd == '0002') {
    		dataParam.ownCd = 'SKB';
    	}
    	cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kuksaoverlapreport/getAddSearchList', dataParam, 'GET', 'getAddSearchList');
	
		 
    }	
	//request 성공시
	function successCallback(response, flag) {
		/*관리그룹 조회와 그에 따른 국사유형 셋팅*/
		if(flag == 'getMgmtGrpList') {
			mgmtGrpList =  [];
			for(i=0; i<response.getMgmtGrpList.length; i++){
				var dataL = response.getMgmtGrpList[i]; 
				mgmtGrpList.push(dataL);
			}
			$('#ownCd').clear();
			$('#ownCd').setData({data : mgmtGrpList});
			if($('#ownCd').val() == "0001"){
				option_data =  [{comCd: "",comCdNm: cflineCommMsgArray['all']},
								{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else if($('#ownCd').val() == "0002"){ 
				option_data =  [{comCd: "",comCdNm: cflineCommMsgArray['all']},
								{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCd').setData({
	             data:option_data
			});
		}
		/*SKT ,SKB 전송실 조회*/
		if(flag == 'getMtsoList') {
			for(var index = 0; index < response.getMtsoList.length; index++ ) {
				if(response.getMtsoList[index].mgmtGrpCd == '0001') {
					mtsoSktList.push(response.getMtsoList[index]);
				} else if(response.getMtsoList[index].mgmtGrpCd == '0002') {
					mtsoSkbList.push(response.getMtsoList[index]);
				}
			}
			$('#topMtsoCd').clear();
			$('#topMtsoCd').setData({data : mtsoSktList});
		}
		/*추가 검색 조회 리스트*/
		if(flag == 'getAddSearchList') {
			if(searchYn){
				$('#'+selectGrid).alopexGrid("dataSet", response.getAddSearchList);
			}else{
				$('#'+selectGrid).alopexGrid("dataAdd", response.getAddSearchList);
			}
			
			
			if(response.totalCnt > 0 ){
    			$('#'+selectGrid).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCnt);} } } );
    		}else{
    			$('#'+selectGrid).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : 0';} } } );
    			
    		}
			
			cflineHideProgressBody();
			
    		
    		if(response.getAddSearchList.length == 0){
    			gridIdscrollBottom = false;
				return false;
			} 
		}
	}
	 
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }

 
});