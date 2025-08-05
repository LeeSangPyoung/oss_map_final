/**
 * SaeumNewBuildingStat
 *
 * @author P106861
 * @date 2017. 2. 28. 오전 11:00:00
 * @version 1.0
 */

$a.page(function() {
	
	//그리드 ID
    var gridId = 'SilsaCrstStatGrid';
    var gridDetailId = 'resultGrid';
    var m_bSKT = false;
    var refreshFlag = false;
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	setEventListener();
    	$('#'+gridDetailId).hide();
    	
    	Tango.ajax({
    		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfostats/getclctInfo',
    		method : 'GET'
    	}).done(function(response){successDemandCallback(response, 'clct_info');})
    	  .fail(function(response){failDemandCallback(response, 'clct_info');})
    	  
    	var sendparam = {
    			fdaisBp : $('#userBpId').val()
    	};
    	
    	Tango.ajax({
    		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/findUserBpInSKB',
    		data : sendparam,
    		method : 'GET'
    	}).done(function(response){successDemandCallback(response, 'getUserBpInSKB');})
    	  .fail(function(response){failDemandCallback(response, 'getUserBpInSKB');}) 
    };
    
  //Grid 초기화
    function initGrid() {
    	var startem ='<em class="color_red">';
    	var endem = '</em>';
    	var mapping =  [
			{
				key : 'szsilsaCrst'
				, align: 'left'
				, width: '70px'
				, title : '구분'		
			}
			, {
				key : 'totsudo'
				,align:'right'
				,width:'70px'
				,title : '수도권'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
				,hidden:!m_bSKT
			}
			/*, {
				key : 'totSeoul'
				,align:'right'
				,width:'70px'
				,title : '서울'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		} 
				}
				,hidden:m_bSKT
			}*/			
			, {
				key : 'totsudoBuk'
				,align:'right'
				,width:'70px'
				,title : '수도권1'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
				,hidden:m_bSKT
			}
			, {
				key : 'totsudoNam'
				,align:'right'
				,width:'70px'
				,title : '수도권2'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
				,hidden:m_bSKT
			}
			, {
				key : 'totBusan'
				,align:'right'
				,width:'70px'
				,title : '부산'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
				,hidden:m_bSKT
			}
			, {
				key : 'totDaegu'
				,align:'right'
				,width:'70px'
				,title : '대구'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
				,hidden:m_bSKT
			}
			, {
				key : 'totsouth'
				,align:'right'
				,width:'70px'
				,title : '동부'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
				,hidden:!m_bSKT
			}
			, {
				key : 'totwest'
				,align:'right'
				,width:'70px'
				,title : '서부'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
			}
			, {
				key : 'totmid'
				,align:'right'
				,width:'70px'
				,title : '중부'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
			}
			, {
				key : 'total'
				,align:'right'
				,width:'70px'
				,title : '합계'
				,inlineStyle : {
      	    		color : function(value, data) {
      	    			if(data.szsilsaCrst.endsWith("(%)") == false && value != '0')
      	    				return 'blue';
      	    		}
				}
			}
    	];
    	
    	//그리드 생성
    	$('#'+gridId).alopexGrid({
    		cellSelectable : true,
    		autoColumnIndex: true,
    		fitTableWidth: true,
    		rowClickSelect : false,
    		disableTextSelection : true, 
    		disableHeaderClickSorting : true, 
    		rowSingleSelect : false,
    		numberingColumnFromZero : false,
    		height : 580,
    		grouping : {
    					useGrouping : false,
    					useGroupRowspan : false
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

    function setEventListener() {
    	
    	$('#search').on('click',function(e){
    		var dataParam = $("searchForm").getData();

        	dataParam.szsilsaCrst = '';
        	dataParam.clctdt = $('#clctinfo').val();
        	dataParam.bSKT = m_bSKT;
        	
        	bodyProgress();
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfostats/getSeaumNewBuilding', dataParam , 'GET', 'getSeaumStatData');      	
    	});
    	
    	$('#excelDownload').on('click',function(e){    		
    		excelExport();
    	});
    	

    	$('#AutoexcelDownloadByBatch').on('click',function(e){
    		var dataForm = $("searchForm").getData();
    		var list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
        	if ( list.length < 1 ) {
        		alertBox('W',buildingInfoMsgArray['noData']);
        		return false;
        	}
 
    		dataForm = gridExcelColumn(dataForm, gridDetailId);
    		
    		dataForm.creDtStart = $('#clctinfo').val();
    		dataForm.all = 'false';
    		dataForm.silsa='false';
    		dataForm.gcmmBtoB='false';
    		dataForm.gcmm='false';
    		dataForm.gcmmOther='false';
    		dataForm.lteUseYn='false';
    		dataForm.wifiUseYn='false';
    		dataForm.bukeyUseYn='false';
    		dataForm.bukeySspdAvlbYn='false';
    		dataForm.kpiTwentyFourSi='false';
    		dataForm.kpiEightyFiveSi='false';
			dataForm.kpiMainUse='false';
			dataForm.kpiAll='false';
			dataForm.saeum='true';
    		
    		dataForm.downloadType = 'SKB';
    		dataForm.bAutoSave = true;
    		dataForm.bSKT = m_bSKT;
    		
    		dataForm.fdaisBldCnstDivCdList = [];
        	dataForm.fdaisBldMainUsgCdList = [];
        	dataForm.fdaisGrudFlorCntCdList = [];
        	
        	dataForm.fileName = "건물관리";
        	dataForm.fileExtension = "xlsx";
        	dataForm.excelPageDown = "N";
        	dataForm.excelUpload = "Y";
        	
        	dataForm.saveMode = "saeum";
        	
        	callMsgBox('','C', buildingInfoMsgArray['confirmExcelPrinting'], function(msgId, msgRst){ /* 엑셀로 출력 하시겠습니까? */
        		if (msgRst == 'Y') {
        			demandRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatch', dataForm, 'POST', 'AutoexcelDownload');
        		}
        	});
    	});	
    	
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e) {
    		var object = AlopexGrid.parseEvent(e);
         	var dataParam = object.data;

         	dataParam.clctdt = $('#clctinfo').val();
         	dataParam.clctmonth = $('#clct_month').val();
         	dataParam.bSKT = m_bSKT;
         	
         	if(AssertParam(dataParam) == false){
         		return;
         	}
         	
         	showProgress(gridId);

         	$a.popup({
             	popid: 'SaeumNewBuildingPop',
             	title: '세움터 통계',
             	iframe: true,
             	modal : true,
                 url: 'SaeumNewBuildingPop.do',
                 data: dataParam,
                 width : 1200,
                 height : 720,
                
                 callback: function(data) {
                	 hideProgress(gridId);
                	 if(data == null){
                		 	return;
                		 }
                 	}	
             });
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
    				excelFileName : buildingInfoMsgArray['saeumCurrentState'], /*세움터 신축건물 현황*/
    				palette : [{
    					className : 'B_YELLOW',
    					backgroundColor : '255,255,0'
    				},{
    					className : 'F_RED',
    					color : '#FF0000'
    				}],
    				sheetList : [{
    					sheetName : buildingInfoMsgArray['saeumCurrentState'], /*세움터 신축건물 현황*/
    					$grid : $('#'+gridId)
    				}]
    			});
    			worker.export({
    				filterdata : false,
    				selected : false,
    				exportHidden : false,
    				merge : false,
    				useGridColumnWidth : true,
            		border  : true,
            		useCSSParser : true
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
		 
		 if(flag == "getSeaumStatData") {
	    	 bodyProgressRemove();

	    	 if(response != null){
	    		$('#'+gridId).alopexGrid("dataSet", response.list);
	    	 }
		 }
		 else if(flag == "clct_info"){
			 bodyProgressRemove();
			 
			 if(response != null){
				 $('#clct_dt').val(response[0].clctdt);
				 $('#clct_month').val(response[0].clctmonth);
				 
				 $('#clctinfo').val(response[0].clctmonth + "01");
				 
				 console.log($('#clctinfo').val());
				 
				 $('#clct_dt').setEnabled(false);
				 $('#clct_month').setEnabled(false);	 
			 }
		 }
		 else if(flag == 'getUserBpInSKB'){
    		if(response.list == null){
    			m_bSKT = true;
    		}
    		else{
    			m_bSKT = false;
    		}
    		initGrid();
    		initDetailGrid(gridDetailId, m_bSKT, false);
    	 }
		 if(flag == 'AutoexcelDownload'){
	  			bodyProgressRemove();
	  		
	  			if(response.jobInstanceId != "") {
	  				$("#excelDownFileId").val(response.jobInstanceId);
	  				refreshFlag = true;
	      			excelDownloadbybatchPop();
	  			}	
	  			else {
	  				alertBox('W',"엑셀 파일 생성 하는데 실패 하였습니다.");
	  			}
		 	 }
			
	 }
	 
	 function failDemandCallback(response, flag){
		 
		 bodyProgressRemove();
	 }
	 
	 var showProgress = function(gridIdValue){
	    $('#'+gridId).alopexGrid('showProgress');
	};
		
	 var hideProgress = function(gridIdValue){
		$('#'+gridId).alopexGrid('hideProgress');
	 };
	 
	 function AssertParam(dataParam){
		 if(dataParam._key == "szsilsaCrst"){
      		return false;
	     }
	      	
	     if(dataParam.szsilsaCrst.endsWith("(%)") == true){
	    	 return false;
	     }
	      	
	     switch(dataParam._key){
	      	case 'totsudo':
	      		if(dataParam.totsudo == null || dataParam.totsudo == "0"){
	      			alertBox('W',buildingInfoMsgArray['noData']);
	      			return false;
	      		}
	      		break;
	      	case 'totsouth':
	      		if(dataParam.totsouth == null || dataParam.totsouth == "0"){
	      			alertBox('W',buildingInfoMsgArray['noData']);
	      			return false;
	      		}
	      		break;
	      	case 'totwest':
	      		if(dataParam.totwest == null || dataParam.totwest == "0"){
	      			alertBox('W',buildingInfoMsgArray['noData']);
	      			return false;
	      		}
	      		break;
	      	case 'totmid':
	      		if(dataParam.totmid == null || dataParam.totmid == "0"){
	      			alertBox('W',buildingInfoMsgArray['noData']);
	      			return false;
	      		}
	      		break;
	      }
      	  return true;
	 }
	 
	 function excelDownloadbybatchPop() {
		if(refreshFlag) {
	  		var jobInstanceId = $("#excelDownFileId").val();
	   		
	   		if(jobInstanceId != "") {
	   			excelCreatePop(jobInstanceId);
	    	}
		}
    }
    
    function excelCreatePop(jobInstanceId) {

       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: '/tango-transmission-web/demandmgmt/buildinginfomgmt/ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		
                  	}
               	}
            });
	    }
    
})
