/**
 * DcsSameReport.js
 *
 * @author Yang Jae
 * @date 2018.03.13
 * @version 1.0
 */

var whole = cflineCommMsgArray['all'] /* 전체 */;
var tBonbuList_data = [];
var tTeamList_data = [];
var tMtsoList_data = [];
$a.page(function() {
	var gridId = 'dataGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
 		setSelectCode();
 		getGrid();
        setEventListener();
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getsktbonbu', null, 'GET', 'getSKTBonBu');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getsktteam', null, 'GET', 'getSKTTeam');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getsktmtso', null, 'GET', 'getSKTMtso');
    	setDCScode();
    }

    function setEventListener() {
   		// 본부 선택시
    	$('#orgCd').on('change',function(e){
			var tTeamList =  [];
			var tMtsoList =  [];
			if(nullToEmpty($('#orgCd').val()) == "") {
				$('#teamCd').setData({data : tTeamList_data});
				$('#topMtsoCd').setData({data : tMtsoList_data});
			}
			else {
				for( i=0 ; i<tTeamList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tTeamList.push(dataFst);
					}
					if(tTeamList_data[i].uprOrgId == $('#orgCd').val()){
						tTeamList.push(tTeamList_data[i]);	
					}
				}
				$('#teamCd').setData({data : tTeamList});
				for( i=0 ; i<tMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tMtsoList.push(dataFst);
					}
					if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
						tMtsoList.push(tMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : tMtsoList});
			}
			changeDCSList();
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		var tMtsoList =  [];
    		if(nullToEmpty($('#teamCd').val()) == "") {
    			if(nullToEmpty($('#orgCd').val()) == "") {
    				$('#topMtsoCd').setData({data : tMtsoList_data});
    			} else {
    				for( i=0 ; i<tMtsoList_data.length; i++) {
    					if(i==0){
    						var dataFst = {"uprComCd":"","value":"","text":whole};
    						tMtsoList.push(dataFst);
    					}
    					if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
    						tMtsoList.push(tMtsoList_data[i]);	
    					}
    				}
    				$('#topMtsoCd').setData({data : tMtsoList});
    			}
			} else {
				for( i=0 ; i<tMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tMtsoList.push(dataFst);
					}
					if(tMtsoList_data[i].teamCd == $('#teamCd').val()){
						tMtsoList.push(tMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : tMtsoList});
			}
    		changeDCSList();
      	});
    	
 		//전송실 선택시
     	$('#topMtsoCd').on('change',function(e){
     		changeDCSList();
       	});
     	
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
      		if( nullToEmpty($('#eqpId').val()) == "") {
      			alertBox('I', "DCS장비가 선택되지 않았습니다.");	
     			return;
     		}
    		searchProc();   
         });		
    	 
    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
    	
     	
	};
	/*
	 * 조회 함수
	 */
	function searchProc(){
		cflineShowProgressBody();
		var eqpIdList = $('#eqpId').val();
		
		$('#btnExportExcel').setEnabled(false);
		var backboneNetworkEqp = $("input:checkbox[id='backboneNetworkEqp']").is(":checked");
		var data = "mgmtGrpCd=0001"+"&orgId="+$('#orgCd').val()+"&teamId="+$('#teamCd').val()+"&tmof="+$('#topMtsoCd').val()+"&backboneNetworkEqp="+backboneNetworkEqp;
		 
		 for(var index = 0 ; index < eqpIdList.length ; index++ ) {
			 data += "&dcsEqpId="+eqpIdList[index];
		 }
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDcsSameReportList', data ,'GET','getDcsSameReportList');
	}
	
	/**
	 *  DCS 목록 조회
	 */
	function setDCScode(comboData) {  
		if(nullToEmpty(comboData) == "" ) {
			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDCScode', null, 'GET', 'getDCScode');
		} else {
			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDCScode', comboData, 'GET', 'getDCScode');
		}
	}
	
	function changeDCSList() {
		var comboData = {  "tmof" : $('#topMtsoCd').val()
				, "teamId" : $('#teamCd').val()
				, "orgId" : $('#orgCd').val()  
		};
		setDCScode(comboData);
	}
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getDcsSameReportList'){
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.getDcsSameReportList);
			$('#btnExportExcel').setEnabled(true);	
		}
		// T본부 셋팅
		if(flag == 'getSKTBonBu') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tBonbuList_data =  [];
			for(i=0; i<response.bonbulist.length; i++){
				var dataL = response.bonbulist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tBonbuList_data.push(dataFst);
				}
				tBonbuList_data.push(dataL);
			}
			$('#orgCd').clear();
			$('#orgCd').setData({data : tBonbuList_data});
		}
		//T팀 셋팅
		if(flag == 'getSKTTeam') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tTeamList_data =  [];
			for(i=0; i<response.teamlist.length; i++){
				var dataL = response.teamlist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tTeamList_data.push(dataFst);
				}
				tTeamList_data.push(dataL);
				
			}
			$('#teamCd').setData({data : tTeamList_data});

		}
		//T전송실 셋팅
		if(flag == 'getSKTMtso') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tMtsoList_data =  [];
			if(response.mtsolist.length == 0 ) {
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList_data.push(dataFst);
			}
			for(i=0; i<response.mtsolist.length; i++){
				var dataL = response.mtsolist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tMtsoList_data.push(dataFst);
				}
				tMtsoList_data.push(dataL);
				
			}
			$('#topMtsoCd').setData({data : tMtsoList_data});
		}
		
		//DCS 목록 콤보박스
	 	if(flag == 'getDCScode'){
	 		dcsList_data =  [];
			for(i=0; i<response.getDCScode.length; i++){
				var dataL = response.getDCScode[i]; 
				dcsList_data.push(dataL);
			}
      		// 
			if(nullToEmpty(response.getDCScode) == "" ) {
	      		$('#eqpId').setData({
	                data:dcsList_data 
	      		});
			} else {
				//selectId가 받아온 첫번째 값을 선택
	      		var selectId = response.getDCScode[0].value;
	      		$('#eqpId').setData({
	                data:dcsList_data ,
	                eqpId:selectId
	      		});
			}
    	}

	}

	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getDcsSameReportList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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
 
    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : 'Dcs일치성현황_'+date,
     		sheetList: [{
     			sheetName: 'Dcs일치성현황',
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
    }
    
    
    //Grid 초기화
    function getGrid() {
    		var headerGroup = [
	                       { fromIndex : 3, toIndex : 6, 		title : cflineMsgArray['crs']  							/* CRS */},
	                       { fromIndex : 7, toIndex : 10, 		title : cflineMsgArray['lno']							/* 선번 */}
	         ]
			
			var columnMapping = [
				                      {key : 'grpOrgNm',		align:  'center',		width:  '150px',			title : cflineMsgArray['headOffice'],fixed : true,rowspan:true/* 본부    */ }
				                    , {key : 'teamNm',			align : 'center', 		width : '150px', 			title : cflineMsgArray['team']		,fixed : true,rowspan:true/* 팀       */}
				                    , {key : 'topMtsoNm',		align : 'center',		width : '150px',			title : cflineMsgArray['transmissionOffice']	,fixed : true,rowspan:true/* 전송실 */}
				                    , {key : 'eqpNm',			align : 'center',		width : '150px',			title : cflineMsgArray['digitalCrossConnectSystem']	,fixed : true		/* DCS */}
				                    , {key : 'aChannelDescr', 	align : 'center', 		width : '200px', 			title : cflineMsgArray['aPort'] 						/* A포트 */}
				                    , {key : 'zChannelDescr', 	align : 'center', 		width : '200px', 			title : cflineMsgArray['bPort']							/* B포트 */}
				                    , {key : 'capaCdNm', 		align : 'center',		width : '100px', 			title : cflineMsgArray['capacity'] 						/* 용량   */}
				                    , {key : 'rmPathName', 		align : 'left', 		width : '320px', 			title : cflineMsgArray['pathNm'] 					    /* PATH명 */}
				                    , {key : 'aChnlDescr', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['aPort'] ,						/* A포트  */
				  						inlineStyle : function(value,data) {
				  							var ChannelDescrArray = [];
				  							var aChnlDescrArrayFirst = null;
				  							var aChnlDescrArraySecond = null;
				  							var existPort = false;
				  							if(data.matchYn == "불일치" && data.matchYn != undefined ) {
				  								if((data.aChnlDescr != data.aChannelDescr) && (data.aChnlDescr != data.zChannelDescr)) {
				  									if( data.aChannelDescr != undefined ) {
					  									if( data.aChannelDescr.indexOf("##") >= 0) {
					  										ChannelDescrArray = data.aChannelDescr.split('##');
					  										ChannelDescrArray[0] = ChannelDescrArray[0].substring(0,ChannelDescrArray[0].length-1);
					  										if(nullToEmpty(data.aChnlDescr) != "" ) { 
					  											aChnlDescrArrayFirst  = data.aChnlDescr.split(',');
					  											aChnlDescrArraySecond = data.aChnlDescr.substr(data.aChnlDescr.length-3,3);
					  										}
					  										if( nullToEmpty(aChnlDescrArrayFirst) != "" ) {
						  										if((ChannelDescrArray[0] == aChnlDescrArrayFirst[0]) && (ChannelDescrArray[1] == aChnlDescrArraySecond)) {
						  											existPort = true;  /*일치*/
						  										} 
					  										}
					  									}
				  									}
				  									ChannelDescrArray =[];
				  									aChnlDescrArrayFirst = null;
				  									aChnlDescrArraySecond = null;
				  									if(data.zChannelDescr != undefined ) {
					  									if( data.zChannelDescr.indexOf("##") >= 0 ) {
					  										ChannelDescrArray = data.zChannelDescr.split('##');
					  										ChannelDescrArray[0] = ChannelDescrArray[0].substring(0,ChannelDescrArray[0].length-1);
					  										if(nullToEmpty(data.aChnlDescr) != "" ) {
					  											aChnlDescrArrayFirst  = data.aChnlDescr.split(',');
					  											aChnlDescrArraySecond = data.aChnlDescr.substr(data.aChnlDescr.length-3,3);
					  										}
					  										if( nullToEmpty(aChnlDescrArrayFirst) != ""  ) {
					  											if((ChannelDescrArray[0] == aChnlDescrArrayFirst[0]) && (ChannelDescrArray[1] == aChnlDescrArraySecond)) {
					  												existPort = true;  /*일치*/
					  											}
					  										}
					  									}
				  									}
				  									if(existPort == false ) {
				  										return {background: 'pink'};
				  									}
				  								}
				  							}
				  						}	
				                    }
				                    , {key : 'bChnlDescr', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['bPort']	,						/* B포트  */
				  						inlineStyle : function(value,data) {
				  							var ChannelDescrArray = [];
				  							var bChnlDescrArrayFirst = null;
				  							var bChnlDescrArraySecond = null;
				  							var existPort = false;
				  							if(data.matchYn == "불일치" && data.matchYn != undefined ) {
				  								if((data.bChnlDescr != data.aChannelDescr) && (data.bChnlDescr != data.zChannelDescr)) {
				  									if( data.aChannelDescr != undefined ) {
					  									if( data.aChannelDescr.indexOf("##") >= 0 ) {
					  										ChannelDescrArray = data.aChannelDescr.split('##');
					  										ChannelDescrArray[0] = ChannelDescrArray[0].substring(0,ChannelDescrArray[0].length-1);
					  										if(nullToEmpty(data.bChnlDescr) != "" ) {
					  											bChnlDescrArrayFirst = data.bChnlDescr.split(',');
					  											bChnlDescrArraySecond = data.bChnlDescr.substr(data.bChnlDescr.length-3,3);
					  										}
					  										if( nullToEmpty(bChnlDescrArrayFirst) != "" ) {
					  											if((ChannelDescrArray[0] == bChnlDescrArrayFirst[0]) && (ChannelDescrArray[1] == bChnlDescrArraySecond)) {
					  												existPort = true;  /*일치*/
					  											}
					  										}
					  									}
				  									}
				  									ChannelDescrArray =[];
				  									bChnlDescrArrayFirst = null;
				  									bChnlDescrArraySecond = null;
				  									if( data.zChannelDescr != undefined ) {
					  									if( data.zChannelDescr.indexOf("##") >= 0 ) {
					  										ChannelDescrArray = data.zChannelDescr.split('##');
					  										ChannelDescrArray[0] = ChannelDescrArray[0].substring(0,ChannelDescrArray[0].length-1);
					  										if(nullToEmpty(data.bChnlDescr) != "" ) {
					  											bChnlDescrArrayFirst = data.bChnlDescr.split(',');
					  											bChnlDescrArraySecond = data.bChnlDescr.substr(data.bChnlDescr.length-3,3);
					  										}
					  										if( nullToEmpty(bChnlDescrArrayFirst) != ""  ) {
					  											if((ChannelDescrArray[0] == bChnlDescrArrayFirst[0]) && (ChannelDescrArray[1] == bChnlDescrArraySecond)) {
					  												existPort = true;  /*일치*/
					  											}
					  										}
					  									}
				  									}
				  									if(existPort == false ) {
				  										return {background: 'pink'};
				  									}
				  								}
				  							}
				  						}	
				                    }
				                    , {key : 'lineNm', 			align : 'left', 		width : '300px', 			title : cflineMsgArray['lnNm']							/* 회선명  */}
				                    , {key : 'svlnNo', 			align : 'center', 		width : '180px', 			title : cflineMsgArray['lineNo']						/* 회선번호 */}
				                    , {key : 'matchYn', 		align : 'center', 		width : '100px', 			title : cflineMsgArray['accordYesOrNo']					/* 일치여부 */}
				]
    	
    		 $('#'+gridId).alopexGrid({
	            autoColumnIndex : true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	            rowClickSelect : true,
	            rowSingleSelect : true,
	            numberingColumnFromZero : false,
	    		defaultColumnMapping:{sorting: true},
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping: columnMapping
	        	,grouping : {
		        	by : ['grpOrgNm','teamNm' ,'topMtsoNm' ],
		        	useGrouping : true,
		        	useGroupRowspan : true,
		        }
    		 }); 
    } 
    
    
});