/**
 * OmsTrunkIdleLine.js
 *
 * @author P123512
 * @date 2018.12.04
 * @version 1.0
 */
var trunkNmList = [];
var oppsEqp = null;
var e1LPColumn = null;
var dcsLP = 'dcsLinePath';
var e1LP = 'e1LinePath';

$a.page(function() {
	
	this.init = function(id, param) {
		$('#btnExportExcel').setEnabled(false);
		$('#btnOppsApply').setEnabled(false);
		setSelectCode();
        initGrid();
        setEventListener();
        $("#trunkNm").multiselect({
        	multiple : false,
        	noneSelectedText : cflineCommMsgArray['all'] /* 전체 */
        });
	};
	
	//Grid 초기화
	function initGrid() {
		var dcsLPColumn = [
		                     { selectorColumn : true, width : '50px' }
	                     	,{key : 'ordRow',	align:'center',	width:'60px',  editable:false,	title : cflineMsgArray['sequence']/*"순번"*/, hidden: true}
	  	 					//, {key : 'tieDiv',	align:'left',	width:'100px', editable:true,	title : "사업자"}
	  	 					, {key : 'ntwkLineNm',	align:'left',	width:'200px', editable:true,	title : cflineMsgArray['trunkNm']/*"트렁크명"*/}
	  	 					, {key : 'ntwkStatCdNm',	align:'center',	width:'100px', editable:true,	title : cflineMsgArray['ntwkStat']/*"네트워크상태"*/}
	  	 					, {key : 'trkRoleDivCdNm',	align:'center',	width:'100px', editable:true,	title : cflineMsgArray['trkRoleDiv']/*"트렁크역할구분"*/}
	  	 					, {key : 'eqpNm',	align:'left',	width:'200px', editable:true,	title : cflineMsgArray['equipmentName']/*"장비명"*/}
	  	 					, {key : 'aportNm',	align:'center',	width:'120px', editable:true,	title : "A_PORT"}
	  	 					, {key : 'bportNm',	align:'center',	width:'120px', editable:true,	title : "B_PORT"}
		]

		e1LPColumn = [
		                     { selectorColumn : true, width : '50px' } 
	  	 					, {key : 'idleDivNm',		  title: cflineMsgArray['idleDiv']/*"유휴구분"*/, align:'center', width:'80px', editable:false}                    	

		   	  			    , {key: 'lineNm',             title: cflineMsgArray['lnNm'] /*  회선명 */, align:'left', width:'200px', editable:false}
		   	  			    , {key: 'omsPathNm',          title: "OMS Path Name", align:'left', width:'200px', editable:false}
			   	  			, {key: 'svlnNo',             title: cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/, align:'left', width:'110px', editable:false}
			   	  			, {key: 'svlnStatCdNm',       title: cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'leslNo',             title: cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'commBizrNm',         title: cflineMsgArray['businessMan'] /* 사업자 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lnkgBizrCdNm',       title: cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineUsePerdTypCdNm', title: cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'mgmtGrpCdNm',        title: cflineMsgArray['managementGroup'] /*  관리그룹 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'svlnLclCdNm',        title: cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'svlnSclCdNm',        title: cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'svlnTypCdNm',        title: cflineMsgArray['serviceLineType'] /*  서비스회선유형 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineCapaCdNm',       title: cflineMsgArray['lineCapacity'] /*회선용량*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogMscId',            title: "OG_MSC_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogMp',               title: "OG_MP", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogPp',               title: "OG_PP", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogCard',             title: "OG_CARD", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogLink',             title: "OG_LINK", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogTieOne',           title: "OG_TIE1", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogTieTwo',           title: "OG_TIE2", align:'left', width:'100px', editable:false}
			   	  			, {key: 'icMscId',            title:  "IC_MSC_ID" , align:'left', width:'100px', editable:false}
			   	  			, {key: 'icMp',               title: "IC_MP", align:'left', width:'100px', editable:false}
			   	  			, {key: 'icPp',               title: "IC_PP", align:'left', width:'100px', editable:false}
			   	  			, {key: 'icCard',             title: "IC_CARD", align:'left', width:'100px', editable:false}
			   	  			, {key: 'icLink',             title: "IC_LINK", align:'left', width:'100px', editable:false}
			   	  			, {key: 'icTieOne',           title: "IC_TIE1", align:'left', width:'100px', editable:false}
			   	  			, {key: 'icTieTwo',           title: "IC_TIE2", align:'left', width:'100px', editable:false}
			   	  			, {key: 'ogicCdNm',           title: "OG/IC", align:'left', width:'100px', editable:false}
			   	  			, {key: 'tieOne',             title: "TIE1", align:'left', width:'100px', editable:false}
			   	  			, {key: 'tieTwo',             title: "TIE2", align:'left', width:'100px', editable:false}
			   	  			, {key: 'tieMatchYn',       title: cflineMsgArray['tieAccord'] /*  TIE일치 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'mscId',              title: "MSC_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'bscId',              title: "BSC_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'bts',                title: "BTS", align:'left', width:'100px', editable:false}
			   	  			, {key: 'cinu',               title: "CINU(M)", align:'left', width:'100px', editable:false}
			   	  			, {key: 'aep',                title: "AEP(M)", align:'left', width:'100px', editable:false}
			   	  			, {key: 'portNo',             title: "PORT_NO", align:'left', width:'100px', editable:false}
			   	  			, {key: 'bip',                title: "BIP", align:'left', width:'100px', editable:false}
			   	  			, {key: 'bipP',               title: "BIP_P", align:'left', width:'100px', editable:false}
			   	  			, {key: 'btsId',              title: "BTS_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'cuid',               title: "CUID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'btsName',            title: cflineMsgArray['mtsoNameMid']+"(M)" /*기지국명*/ , align:'left', width:'100px', editable:false}
			   	  			, {key: 'ima',                title: "IMA", align:'left', width:'100px', editable:false}
			   	  			, {key: 'status',             title: cflineMsgArray['status'] /*상태*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'slPath',             title: "SL_PATH" , align:'left', width:'100px', editable:false}
			   	  			, {key: 'onmPath',            title: "ONM_PATH", align:'left', width:'100px', editable:false}
			   	  			, {key: 'cmsBmtso',           title: cflineMsgArray['btsName']+"(CMS)" /*기지국사*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'cmsId',              title: cflineMsgArray['cmsId'], align:'left', width:'100px', editable:false}
			   	  			, {key: 'cmsMscId',           title: "CMS_MSC_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'cmsBscId',           title: "CMS_BSC_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'cmsBtsId',           title: "CMS_BTS_ID", align:'left', width:'100px', editable:false}
			   	  			, {key: 'rnmEqpIdNm',         title: cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'rnmPortIdNm',        title: cflineMsgArray['rmPortNm']  /*  RM포트명 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'rnmPortChnlVal',     title: cflineMsgArray['rmChannelName']  /*  RM채널명 */, align:'left', width:'100px', editable:false}
			   	  			, {key: 'faltMgmtObjYnNm',    title: cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineOpenDt',         title: cflineMsgArray['lineOpeningDate'] /*회선개통일자*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lastChgDate',        title: cflineMsgArray['lastChangeDate'] /*수정일자*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineAppltNo',	      title: cflineMsgArray['applicationNumber']  /*청약번호*/ ,align:'center', width: '130px', editable:false}
			   	  			, {key: 'lineTrmnSchdDt',     title: cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'uprTeamNm',          title: cflineMsgArray['upperTeam'] /*상위팀*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'uprMtsoIdNm',        title: cflineMsgArray['upperMtso'] /*상위국사*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lowTeamNm',          title: cflineMsgArray['lowerTeam'] /*하위팀*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lowMtsoIdNm',        title: cflineMsgArray['lowerMtso'] /*하위국사*/ , align:'left', width:'100px', editable:false}
			   	  			, {key: 'uprSystmNm',         title: cflineMsgArray['upperSystemName'] /*상위시스템명*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lowSystmNm',         title: cflineMsgArray['lowSystemName'] /*하위시스템명*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'mgmtPostCdNm',       title: cflineMsgArray['managementPost'] /*관리포스트*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'appltDt',            title: cflineMsgArray['applicationDate'] /*청약일자*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineDistTypCdNm',    title: cflineMsgArray['lineDistanceType'] /*회선거리유형*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineSctnTypCdNm',    title: cflineMsgArray['lineSectionType'] /*회선구간유형*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'chrStatCdNm',        title: cflineMsgArray['chargingStatus'] /*과금상태*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lesFeeTypCdNm',      title: cflineMsgArray['rentFeeType'] /*임차요금유형*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'feePayTrmsMtsoNm',   title: cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'areaCmtsoNm',        title: cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineMgmtGrCdNm',     title: cflineMsgArray['lineManagementGrade'] /*회선관리등급*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineRmkOne',         title: cflineMsgArray['lineRemark1'] /*회선비고1*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineRmkTwo',         title: cflineMsgArray['lineRemark2'] /*회선비고2*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'lineRmkThree',       title: cflineMsgArray['lineRemark3'] /*회선비고3*/, align:'left', width:'100px', editable:false}
			   	  			, {key: 'srsLineYnNm',        title: cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/, align:'left', width:'100px', editable:false}	                     	
	                     	
	                     	
//	  	 					, {key : 'ntwkLineNm',		  title: cflineMsgArray['trunk'] /* 트렁크 */, align:'left',	width:'250px', editable:false}
//	  	 					, {key : 'eqpNm',			  title: cflineMsgArray['equipmentName'] /* 장비명 */, align:'left', width:'200px', editable:false}
//	  	 					, {key : 'portChnl',		  title: "포트채널값", align:'center', width:'120px', editable:false}
//		 					, {key : 'omsPathNm',		  title: "OMS PATH 명", align:'left', width:'250px', editable:false}
//		 					, {key : 'omsAportName',		  title: "OMS A_PORT", align:'center', width:'120px', editable:false}
//		 					, {key : 'omsBportName',		  title: "OMS B_PORT", align:'center', width:'120px', editable:false}
			        		,{ key:'ringNtwkLineNm'    ,title:cflineMsgArray['ring']+'#1'     ,align:'left', width: '180px', editable: true }
			        		,{ key:'ntwkLineNm'    ,title:cflineMsgArray['trunk']+'#1'     ,align:'left', width: '180px', editable: true }
			        		,{ key:'eqpNm'		 , title:cflineMsgArray['equipment']+'#1'	    	,align:'left', width: '180px', editable: true }
			        		,{ key:'omsAportName'		 , title:cflineMsgArray['aport']+'#1'	    	,align:'left', width: '120px', editable: true }
			        		,{ key:'omsBportName'		 , title:cflineMsgArray['bport'] +'#1'	    	,align:'left', width: '120px', editable: true }
		]
		

		//Grid 생성
		$('#'+dcsLP).alopexGrid({
        	autoColumnIndex: true,
        	//autoResize: true,
        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        	rowInlineEdit : false, //행전체 편집기능 활성화
        	cellInlineEdit : true,
        	cellSelectable : true,
    		rowClickSelect : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: true},
        	enableDefaultContextMenu:false,
    		enableContextMenu:true,		
    		pager:false,	
			height : 160,
			columnMapping : dcsLPColumn
			
			
		});
		
		$('#'+e1LP).alopexGrid({

        	autoColumnIndex: true,
        	//autoResize: true,
        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        	rowInlineEdit : false, //행전체 편집기능 활성화
        	cellInlineEdit : true,
        	cellSelectable : true,
    		rowClickSelect : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: true},
        	enableDefaultContextMenu:false,
    		enableContextMenu:true,		
    		pager:true,			
			height : 430,
			columnMapping : e1LPColumn

		});

//		 $('#'+e1LP).alopexGrid("columnFix", 1);
	};
	
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(){
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'tmofCmCdData');
		
    }

	function setEventListener() {
		//조회 
		$('#btnSearch').on('click', function(e) {
			searchProc(); 
        });
		

		//행추가
		$('#btnAddRow').on('click', function(e) {
			$('#'+dcsLP).alopexGrid({
	    		rowInlineEdit : true, //행전체 편집기능 활성화
	    	});
			var lc = $('#lineCnt').val();
			var addDatas = [];
			
			if(nullToEmpty(lc)=="" || isNaN(lc)==true) {
				var gridLength = $('#'+dcsLP).alopexGrid('dataGet').length;
				var addData = { "ordRow" : gridLength+1  };
				$("#"+dcsLP).alopexGrid('dataAdd', $.extend({_state:{editing:true}}, addData));
			} else if(isNaN(lc)==false){
				var gridLength = $('#'+dcsLP).alopexGrid('dataGet').length;
				for(var idx = 0 ; idx < lc ; idx++) {
					addDatas.push({"ordRow":gridLength+1});
					gridLength = gridLength+1;
				}
				$("#"+dcsLP).alopexGrid("dataAdd", addDatas);
			}
			$("#"+dcsLP).alopexGrid("endEdit");
        });
		
		//행삭제
		$('#btnDelGrid').on('click', function(e) {
			if($('#'+dcsLP).length == 0) {return;}
			$('#'+dcsLP).alopexGrid("dataDelete", {_state:{selected:true}});
			
			var gridAll = $('#'+dcsLP).alopexGrid('dataGet');
			for(var idx = 0 ; idx < gridAll.length ; idx++ ) {
				$('#'+dcsLP).alopexGrid( "cellEdit", idx+1, {_index : { row : gridAll[idx]._index.row}}, "ordRow");
			}
			
        });
		
		//적용 
		$('#btnApply').on('click', function(e) {
			if($('#'+dcsLP).length == 0) {return;}

			$("#"+dcsLP).alopexGrid("endEdit");
    		var dataList = $('#'+dcsLP).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
    		if(chkValidation(dataList)) {
	    		var paramList = [];
	    		var aportNmVal = "";
	    		for(var i=0; i<dataList.length; i++ ){    	
	    			aportNmVal = nullToEmpty(dataList[i].aportNm);
	    			if(aportNmVal==""){
	    				aportNmVal = nullToEmpty(dataList[i].bportNm);
	    			}
					var voData = {"eqpNm": dataList[i].eqpNm, "aportNm": aportNmVal, "eqpId": dataList[i].eqpId};
					
					paramList.push(voData);
	    		}
    			var paramData = {"pathList": paramList, "ntwkLineNm": dataList[0].ntwkLineNm};
//    			console.log(paramData);
    			cflineShowProgressBody();	
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstrunkidleline/getTrunkOmsIdleList', paramData, 'POST', 'getTrunkOmsIdleList');
    		}
        });
		// 대국 조회 
		$('#btnOppsApply').on('click', function(e) {
			if($('#'+e1LP).length == 0) {return;}

			//$("#"+dcsLP).alopexGrid("endEdit");
    		var dataList = $('#'+e1LP).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
    		if(oppsEqp == null || (oppsEqp != null &&  nullToEmpty(oppsEqp.eqpNm) == "")){
    			alertBox('I', cflineMsgArray['noSituationInfo']); /* 대국정보가 없습니다.*/
    			return;
    		}
//    		console.log(dataList);
    		var paramList = [];
    		var oppEqpNm = nullToEmpty(oppsEqp.eqpNm);
    		var oppEqpId = nullToEmpty(oppsEqp.eqpId);
    		var oppEqpPortNm = nullToEmpty(oppsEqp.aportNm);
    		if(oppEqpPortNm == "") oppEqpPortNm = nullToEmpty(oppsEqp.bportNm);	//aportNm값이 없으면 bportNm에서 한번더 검색 2023-05-10
    		var oppEqpChnlVal = nullToEmpty(oppsEqp.achnlVal);
    		if(oppEqpChnlVal == "") oppEqpChnlVal = nullToEmpty(oppsEqp.bchnlVal);	//achnlVal값이 없으면 bchnlVal에서 한번더 검색 2023-05-10
    		
    		for(var i=0; i<dataList.length; i++ ){    	
//    			console.log("=====================");
//    			console.log(dataList[i].portChnl);
//    			console.log(dataList[i].portChnl.substr(10,3));
//    			console.log(dataList[i].portChnl.substr(13,3));
    			var chnlVal = "";
    			if(oppEqpChnlVal == ""){
    				chnlVal = dataList[i].portChnl.substr(10,6)
    			}else{
    				chnlVal = dataList[i].portChnl.substr(13,3)
    				
    			}
				var voData = {"eqpNm": oppEqpNm, "eqpId": oppEqpId, "aportNm": (oppEqpPortNm + chnlVal)};					
				paramList.push(voData);
    		}
			var paramData = {"pathList": paramList, "ntwkLineNm": dataList[0].ntwkLineNm, "ntwkLineNo": nullToEmpty(oppsEqp.ntwkLineNo)};
//			console.log(paramData);
			//cflineShowProgressBody();	
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstrunkidleline/getTrunkOmsOppsList', paramData, 'POST', 'getTrunkOmsOppsList');
  
        });		
		//전송실 선택시
		$('#tmof').on('change', function(e) {
			 var tmof = $("#tmof").val();
			 searchTrk(tmof);
        });

		// 그리드2 엑셀 다운로드
		$('#btnExportExcel').on('click', function(e) {		
			if($('#'+e1LP).length == 0) {return;}
    		var dataList = $('#'+e1LP).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']);  //선택된 데이터가 없습니다.
    			return;
    		}    		
           	 
    		var headerData = [] ;
       		for(var i = 1 ; i < e1LPColumn.length; i++ ) {
       			headerData.push(e1LPColumn[i]);
       		}
    		
    		var listData = getCnvtListData(headerData, dataList);
    		var excelFileNmVal = "";
    		var dataParams = {"headerList" : headerData, "gridDataList": listData, "excelFileNmVal": excelFileNmVal}
    		//console.log(dataParams);
    		cflineShowProgressBody();	
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstrunkidleline/excelcreate', dataParams, 'POST', 'excelcreate');
    		
        });
	};
   

    // 그리드 데이터에서 변환 데이터만 추출 
	function getCnvtListData(headers, datas){
		var returnDatas = [];
		for(var i=0; i<datas.length; i++){
			var tmpData = datas[i];
			var listDataArr = {};
			for(var k=0; k<headers.length; k++){
				var tmpHeader = headers[k];
				listDataArr[tmpHeader.key] = nullToEmpty(tmpData[tmpHeader.key]);	
			}
			returnDatas.push(listDataArr);
		}
		return returnDatas;
	}    


	//조회전 밸류데이션 체크
	function chkValidation(dataList) {
		selectCondition = "";
		if (dataList != null && dataList.length > 0 ){
			var chkLineNm = false;
			var chkEqp = false;
			var chkAport = false;
			for(var idx = 0 ; idx < dataList.length; idx++) {
				if(nullToEmpty(dataList[idx].ntwkLineNm) != "" ) {
					chkLineNm = true;
				}
				if(nullToEmpty(dataList[idx].eqpNm) != "" ) {
					chkEqp = true;
				}
				if(nullToEmpty(dataList[idx].aportNm) != "" || nullToEmpty(dataList[idx].bportNm) != "" ) {
					chkAport = true;
				}
			}
			if(chkLineNm == false ) {
				alertBox('I', makeArgMsg('required', cflineMsgArray['trunkNm']/*'트렁크명'*/, '', '', ''));
				return false;
			}
			if(chkEqp == false ) {
				alertBox('I', makeArgMsg('required', cflineMsgArray['equipmentName']/*'장비명'*/, '', '', ''));
				return false;
			}
			if(chkAport == false ) {
				alertBox('I', makeArgMsg('required', 'PORT', '', '', ''));
				return false;
			}
		}
		return true;
	}	
			
	
	
	/*
	 * 조회 함수
	 */
	function searchProc(){
		var mtsoId = $("#tmof").val();
		var trkNo = $("#trunkNm").val();
		var param = {"mtsoId": mtsoId, "ntwkLineNo": trkNo};
		cflineShowProgressBody();	
		oppsEqp = null;
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstrunkidleline/getTrunkInfo', param, 'GET', 'getTrunkInfo');
	}	
	/**
	 * 트렁크 목록 조회 
	 */
	function searchTrk(mtsoId){
		var param = {"mtsoId": mtsoId};
		cflineShowProgressBody();	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstrunkidleline/getTrunkInfList', param, 'GET', 'getTrunkInfList');
	}
	
	
	//request 성공시
	function successCallback(response, flag) {
		if(flag == 'tmofCmCdData') {
			$('#tmof').setData({data : response.tmofCdList});
			if(response.tmofCdList != null && response.tmofCdList.length > 0){
		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'SettingUserTmofCd');
			}
		}
		if(flag == 'SettingUserTmofCd'){
			if(response.userJrdtTmofInfo != null){
				var userTmofCd = "";
				// 소속전송실 셋팅
				for (var i = 0 ; i < response.userJrdtTmofInfo.length; i++) {
					if (response.userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
						userTmofCd = response.userJrdtTmofInfo[i].jrdtTmofId;
						break;
					} 					
				}
//				console.log("userTmofCd=" + userTmofCd);
				if(userTmofCd != "" && userTmofCd != "0"){
					$('#tmof').setSelected(userTmofCd);
					searchTrk(userTmofCd);
				}else{
					searchTrk($("#tmof").val());
				}
			}
		
		}
		//트렁크 목록 조회
		if(flag == 'getTrunkInfList') {
    		cflineHideProgressBody();
			$('#trunkNm').setData({data : response.getTrunkTieInf});
		}
		//트렁크 정보 조회
		if(flag == 'getTrunkInfo') {
			cflineHideProgressBody();
//			console.log(response);
			// 국간 트렁크면서 대국 장비가 있는 경우 대국 버튼을 활성화 한다.
			if(nullToEmpty(response.trkRoleDivCd)=="004" && response.oppsEqp != null && nullToEmpty(response.oppsEqp.eqpNm) != ""){
				$('#btnOppsApply').setEnabled(true);
				oppsEqp = response.oppsEqp;
			}else{
				$('#btnOppsApply').setEnabled(false);
				oppsEqp = null;
			}
			
			$('#'+dcsLP).alopexGrid("dataEmpty");	
			$('#'+e1LP).alopexGrid("dataEmpty");			
    		if(response.pathList != null && response.pathList.length==1){
    	        $('#'+dcsLP).alopexGrid("dataSet", response.pathList);
    		}else if(response.pathList.length>1){
    			var popTrunkLnoList = $a.popup({
        		  	//popid: "popTrunkLnoList",
        		  	title: cflineMsgArray['trkLnoPop']/*"트렁크 선번 팝업"*/,
        			url: $('#ctx').val() + "/configmgmt/cfline/OmsTrunkIdleLnoPop.do",
        			data: response,
        			iframe: true,
        			modal: true,
        			movable:false,
        			windowpopup : false,
        			width : 1000,
        			height : 450,
        			callback:function(data){
    					if(data != null){
    						 $('#'+dcsLP).alopexGrid("dataSet", data);
    					}
        			},errorCallback:function(data){
//        				//console.log(data);
        			}
        			
        		});
    		}else{
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    		}
		}
		//트렁크OMS유휴목록 
		if(flag == 'getTrunkOmsIdleList') {
    		cflineHideProgressBody();
			$('#'+e1LP).alopexGrid("dataEmpty");	
    		if(nullToEmpty(response.resultCd) == "Success"){
		        $('#'+e1LP).alopexGrid("dataSet", response.rmPathList);
				$('#btnExportExcel').setEnabled(true);
    		}
		}
		//트렁크 대국 OMS유휴목록 
		if(flag == 'getTrunkOmsOppsList') {
    		cflineHideProgressBody();
			//$('#'+e1LP).alopexGrid("dataEmpty");	
    		if(nullToEmpty(response.resultCd) == "Success" && response.rmPathList != null && response.rmPathList.length > 0){

        		var dataList = $('#'+e1LP).alopexGrid('dataGet', {_state: {selected:true}});
//        		console.log(dataList);
//        		console.log(dataList[dataList.length-1]);
    			var row = dataList[dataList.length-1]._index.row + 1;
    			for(var i=0; i<response.rmPathList.length; i++){
	    			$("#"+e1LP).alopexGrid("dataAdd", $.extend({}, response.rmPathList[i]), {_index : { row:(row+i)} });
    			}
    		}
		}
    	// 변환 데이터 엑셀 다운로드
    	if(flag == "excelcreate"){
			cflineHideProgressBody();
    		if(nullToEmpty(response.fileName) != ""){
	    		var $form=$('<form></form>');
					$form.attr('name','downloadForm');
					$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/exceldownload");
					$form.attr('method','GET');
					$form.attr('target','downloadIframe');
					// 2016-11-인증관련 추가 file 다운로드시 추가필요 
					$form.append(Tango.getFormRemote());
					$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
					$form.appendTo('body');
					$form.submit().remove();
    		}else{
        		alertBox('I', cflineMsgArray['failFileDownLoad']); /* 파일 다운로드에 실패했습니다.*/
    		}
    		
    	}
		
		
	}
	 
	//request 실패시.
    function failCallback(response, flag){
//    	if(flag == 'searchList'){
//    		cflineHideProgressBody();
//    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
//    	}
    	if(flag == 'SettingUserTmofCd'){
			searchTrk($("#tmof").val());
    	}
    	if(flag == 'getTrunkInfList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'getTrunkInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
		if(flag == 'getTrunkOmsIdleList') {
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		}
		if(flag == 'getTrunkOmsOppsList') {
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