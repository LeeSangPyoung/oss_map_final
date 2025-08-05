/**
 * OpenTaskLineSearchPop.js
 *
 * @author Administrator
 * @date 2016. 11. 01
 * @version 1.0
 */

var alGridTop = "alGridTop";
var alGridBottom = "alGridBottom";
var paramData = null;
var popFindSvlnSclCd = "";
var passFlag = "Y";
var jobAcepInclYn = "N"; // 작업접수 유무

$a.page(function() {

    this.init = function(id, param) {
    	if(param.gubun == "S"){	//작업접수에서 회선찾기 팝업으로 넘어온 경우
    		passFlag = "N";
    		jobAcepInclYn = "Y";
            $('#btnPopWrite').text(cflineMsgArray['workAccept']); 		/*	작업접수	*/
    	}
    	paramData = param;
    	setSelectCode();
        setEventListener();   
        initGridTop();
        initGridBottom(param.lineList[0].svlnSclCd);
        
        var chekList = param.lineList
        for(i=0; i<chekList.length; i++){
//    		console.log(chekList[i].tmpLineNo);
    		if( (chekList[i].tmpLineNo =="" || chekList[i].tmpLineNo == undefined) && 
    				(chekList[i].lineNo =="" || chekList[i].lineNo == undefined) ){
    			passFlag = "N";
    		}
    	}
    };
   
    //TopGrid 초기화
    function initGridTop() {
    	var mappingTop = [ { selectorColumn : true, width : '50px' } 
    	                       , {key : 'jobTypeCdNm'	   	,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '120px'}
    	                       , {key : 'svlnSclCdNm'	              	,title : cflineMsgArray['lineType'] /* 회선유형 */			,align:'center', width: '120px'}
    	                       , {key : 'jobTitle'	              	,title : cflineMsgArray['workName'] /*  작업명 */                 ,align:'left'  , width: '120px'}
    	                       , {key : 'ogTransroomName'	    		    ,title : cflineMsgArray['transmissionOffice'] /* 전송실 */               	,align:'center', width: '120px'}   
    	                       , {key : 'ogSysName'	    		    ,title : cflineMsgArray['systemName'] /* 시스템명 */               	,align:'center', width: '120px'}   
    	                       , {key : 'ogTieOne'	    		    ,title : "TIE1" /* TIE1 */               	,align:'center', width: '120px'}   
    	                       , {key : 'ogTieTwoBtsName'	    		    ,title : "TIE2("+cflineMsgArray['mtsoNameMid']+")" /* TIE2(기지국명) */               	,align:'center', width: '120px'} 
    	                       , {key : 'icTransroomName'	    		    ,title : cflineMsgArray['transmissionOffice'] /* IC 전송실 */               	,align:'center', width: '120px'}   
    	                       , {key : 'icSysName'	    		    ,title : cflineMsgArray['systemName'] /* IC 시스템명 */               	,align:'center', width: '120px'}   
    	                       , {key : 'icTieOne'	    		    ,title : "TIE1" /* TIE1 */               	,align:'center', width: '100px'}   
    	                       , {key : 'icTieTwoBtsName'	    		    ,title : "TIE2("+cflineMsgArray['mtsoNameMid']+")" /* TIE2(기지국명) */               	,align:'center', width: '120px'} 	
    	                       , {key : 'lineNo',	hidden: true}
    	                       , {key : 'lineNm',	hidden: true}
    	                       , {key : 'tmpLineNo'							, title : cflineMsgArray['line'] + " ID"	/* 회선 ID */		, align:'left', width: '120px', editable : true}
    	                       , {key : 'tmpLineNm'							, title : cflineMsgArray['lnNm'] 	/* 회선명 */ 					, align:'left', width: '120px', editable : true}

		];
        //그리드 생성 
        $('#'+alGridTop).alopexGrid({
        	columnMapping : mappingTop,
        	headerGroup : [
        	               { fromIndex :  3, toIndex :  6, title : "OG"}
        	               , { fromIndex :  7, toIndex :  10, title : "IC"}
            ],
			cellSelectable : false,
			pager : false,
			rowClickSelect : true,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 220,
			message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		}
        });
        $('#'+alGridTop).alopexGrid("dataSet", paramData.lineList);
        $('#'+alGridTop).alopexGrid("startEdit");
    };
    
    //BottomGrid 초기화
    function initGridBottom(svlnSclCd) {
    	var mappingBottom = selectBottomGrid(svlnSclCd); //회선유형에 따라서 그리드가 변화됨
    	var headerGroup = selectHeaderGroup(svlnSclCd);
    	popFindSvlnSclCd = svlnSclCd;
        //그리드 생성 
        $('#'+alGridBottom).alopexGrid({
        	columnMapping : mappingBottom,
        	headerGroup : headerGroup,
			cellSelectable : false,
			pager : false,
			rowClickSelect : true,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 320,
			message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		}
        });
    };
    
    //맵핑될 그리드 선택 함수
    function selectBottomGrid(key){
    	var returnGridMapping = null;
    	if(key == "001"){ // 교환기간
    		returnGridMapping = [
    	                       {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '150px', editable: true}
    	                       , {key : 'lineUsePerdTypCdNm'	        ,title : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '150px'}
    	                       , {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '150px'}	
    	               		   , {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '150px'}
    	               		   , {key : 'lineCapaCdNm'	      		,title : cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '150px'}
    	               		   , {key : 'ogMscId'	      		,title : "OG MSC_ID"        		,align:'center', width: '150px'}
    	               		   , {key : 'ogMp'	      		,title : "OG MP"          		,align:'center', width: '150px'}
    	               		   , {key : 'ogPp'	      		,title : "OG PP"          		,align:'center', width: '150px'}
    	               		   , {key : 'ogCard'	      		,title : "OG CARD"         		,align:'center', width: '150px'}
    	               		   , {key : 'ogLink'	      		,title : "OG LINK"         		,align:'center', width: '150px'}
    	               		   , {key : 'ogTieOne'	      		,title : "OG TIE1"         		,align:'center', width: '150px'}
    	               		   , {key : 'ogTieTwo'	      		,title : "OG TIE2"         		,align:'center', width: '150px'}
    	               		   , {key : 'icMscId'	      		,title : "IC MSC_ID"        		,align:'center', width: '150px'}
    	               		   , {key : 'icMp'	      		,title : "IC MP"          		,align:'center', width: '150px'}
    	               		   , {key : 'icPp'	      		,title : "IC PP"          		,align:'center', width: '150px'}
    	               		   , {key : 'icCard'	      		,title : "IC CARD"         		,align:'center', width: '150px'}
    	               		   , {key : 'icLink'	      		,title : "IC LINK"         		,align:'center', width: '150px'}
    	               		   , {key : 'icTieOne'	      		,title : "IC TIE1"         		,align:'center', width: '150px'}
    	               		   , {key : 'icTieTwo'	      		,title : "IC TIE2"         		,align:'center', width: '150px'}
    	               		   , {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '150px'}
    	               		   , {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '150px'}
    	               		   , {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '150px'}
    	               		   , {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '150px'}
    	               		   , {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '150px'}
    	               		   , {key : 'ogicCdNm'	        ,title : 'OG/IC'			,align:'center', width: '150px' }
    	               		   , {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '150px'}
    	               		   , {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '150px'}
    	               		   , {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '150px'}
    	               		   , {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '150px'}
    	               		   , {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '150px'}
    	               		   , {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '150px'}
    	               		   , {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '150px'}
    	               		   , {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '150px'}
    	               		   , {key : 'lineDistTypCdNm'	        ,title : cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '150px'}
    	               		   , {key : 'lineSctnTypCdNm'	        ,title : cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '150px'}
    	               		   , {key : 'chrStatCdNm'	            ,title : cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '150px'}
    	               		   , {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '150px'}
    	               		   , {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '150px'}
    	               		   , {key : 'lineMgmtGrCdNm'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '150px'}
    	               		   , {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '150px'}
    	               		   , {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '150px'}
    	               		   , {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '150px'}
    	               		   , {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '150px'}
    	    ];
    	}else if(key == "003"){ // 상호접속간
    		returnGridMapping = [
      	                       {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '150px', editable: true}
      	                       , {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '150px'}
      	                       , {key : 'lineUsePerdTypCdNm'	        ,title : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '150px'}
      	                       , {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '150px'}	
      	               		   , {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '150px'}
      	               		   , {key : 'lineCapaCdNm'	      		,title : cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '150px'}
      	               		   , {key : 'ogMscId'	      		,title : "MSC_ID"        		,align:'center', width: '150px'}
      	               		   , {key : 'ogMp'	      		,title : "MP"          		,align:'center', width: '150px'}
      	               		   , {key : 'ogPp'	      		,title : "PP"          		,align:'center', width: '150px'}
      	               		   , {key : 'ogCard'	      		,title : "CARD"         		,align:'center', width: '150px'}
      	               		   , {key : 'ogLink'	      		,title : "LINK"         		,align:'center', width: '150px'}
      	               		   , {key : 'ogTieOne'	      		,title : "TIE1"         		,align:'center', width: '150px'}
      	               		   , {key : 'ogTieTwo'	      		,title : "TIE2"         		,align:'center', width: '150px'}
      	               		   , {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '150px'}
      	               		   , {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '150px'}
      	               		   , {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '150px'}
      	               		   , {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '150px'}
      	               		   , {key : 'ogicCdNm'	        ,title : 'OG/IC'			,align:'center', width: '150px' }
      	               		   , {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '150px'}
      	               		   , {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '150px'}
      	               		   , {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '150px'}
      	               		   , {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '150px'}
      	               		   , {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '150px'}
      	               		   , {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '150px'}
      	               		   , {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '150px'}
      	               		   , {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineDistTypCdNm'	        ,title : cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '150px'}
      	               		   , {key : 'lineSctnTypCdNm'	        ,title : cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '150px'}
      	               		   , {key : 'chrStatCdNm'	            ,title : cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '150px'}
      	               		   , {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '150px'}
      	               		   , {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '150px'}
      	               		   , {key : 'lineMgmtGrCdNm'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '150px'}
      	               		   
      	               		   , {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '150px'}
      	               		   , {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '150px'}
      	    ];
    	}else{ // 기지국간
    		returnGridMapping = [
      	                       {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '150px', editable: true}
      	                       , {key : 'lineUsePerdTypCdNm'	        ,title : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '150px'}
      	                       , {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '150px'}	
      	               		   , {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '150px'}
      	               		   , {key : 'lineCapaCdNm'	      		,title : cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '150px'}

      	               		   , {key : 'mscId'	      		,title : "MSC_ID"          		,align:'center', width: '150px'}
      	               		   , {key : 'bscId'	      		,title : "BSC_ID"          		,align:'center', width: '150px'}
      	               		   , {key : 'bts'	      		,title : "BTS"          		,align:'center', width: '150px'}
      	               		   , {key : 'cmsMscId'	            ,title : "CMS_MSC_ID"			,align:'center', width: '150px'}
      	               		   , {key : 'cmsBscId'	            ,title : "CMS_BSC_ID"			,align:'center', width: '150px'}
      	               		   , {key : 'cmsBtsId'	            ,title : "CMS_BTS_ID"			,align:'center', width: '150px'}
      	               		   , {key : 'cinu'	      		,title : "CINU"          		,align:'center', width: '150px'}
      	               		   , {key : 'aep'	      		,title : "AEP_83"          		,align:'center', width: '150px'}
      	               		   , {key : 'portNo'	      		,title : "PORT_NO"          		,align:'center', width: '150px'}
      	               		   , {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '150px'}
      	               		   , {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '150px'}
      	               		   
      	               		   , {key : 'bip'	      		,title : "BIP"          		,align:'center', width: '150px'}
      	               		   , {key : 'bipP'	      		,title : "BIP_P"          		,align:'center', width: '150px'}
      	               		   , {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '150px'}
      	               		   , {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '150px'}
      	               		   , {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '150px'}
      	               		   , {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '150px'}
      	               		   , {key : 'ogicCdNm'	        ,title : 'OG/IC'			,align:'center', width: '150px' }
      	               		   , {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '150px'}
      	               		   , {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '150px'}
      	               		   , {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '150px'}
      	               		   , {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '150px'}
      	               		   , {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '150px'}
      	               		   , {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '150px'}
      	               		   , {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '150px'}
      	               		   , {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineDistTypCdNm'	        ,title : cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '150px'}
      	               		   , {key : 'lineSctnTypCdNm'	        ,title : cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '150px'}
      	               		   , {key : 'chrStatCdNm'	            ,title : cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '150px'}
      	               		   
      	               		   , {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '150px'}
      	               		   , {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '150px'}
      	               		   , {key : 'lineMgmtGrCdNm'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '150px'}
      	               		   
      	               		   , {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '150px'}
      	               		   , {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '150px'}
      	               		   , {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '150px'}
      	   ];
    	}
    	return returnGridMapping;
    }
    
    function selectHeaderGroup(key){
    	var headerGroup = null;
    	if(key == "001"){ // 교환기간
    		headerGroup = [
        	               { fromIndex :  0, toIndex :  4, title : cflineMsgArray['lineInfo']	 /*회선정보*/}
        	               , { fromIndex :  5, toIndex :  11, title : cflineMsgArray['superStationExchangePort']	 /*상위국교환포트*/}
        	               , { fromIndex :  12, toIndex :  18, title : cflineMsgArray['subStationExchangePort'] 	/*하위국교환포트*/}
        	               , { fromIndex :  19, toIndex :  42, title : cflineMsgArray['lineInfo'] /*회선정보*/}
    	    ]
    	}else if(key == "003"){ // 상호접속간
    		headerGroup = [
        	               { fromIndex :  0, toIndex :  5, title : cflineMsgArray['lineInfo']	 /*회선정보*/}
        	               , { fromIndex :  6, toIndex :  12, title : cflineMsgArray['exchangePort'] 	/*교환포트*/}
        	               , { fromIndex :  13, toIndex :  36, title : cflineMsgArray['lineInfo']	 /*회선정보*/}
      	    ];
    	}else{ // 기지국간
    		headerGroup = [
        	               { fromIndex :  0, toIndex :  4, title : cflineMsgArray['lineInfo']	 /*회선정보*/}
        	               , { fromIndex :  5, toIndex :  15, title : cflineMsgArray['exchangePort'] 		/*교환포트*/}
        	               , { fromIndex :  16, toIndex :  17, title : cflineMsgArray['baseMtsoPort'] 		/*기지국교환포트*/}
        	               , { fromIndex :  18, toIndex :  41, title : cflineMsgArray['lineInfo']	 /*회선정보*/}
      	   ];
    	}
    	return headerGroup;
    }
    
    function searchList(data){
    	var dataParam = {
    		"svlnNo" : data[0].tmpLineNo
    		, "svlnNm" : data[0].tmpLineNm
    		, "svlnSclCd" : data[0].svlnSclCd
    	}
		cflineShowProgressBody(); 
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getlinefindlist', dataParam, 'GET', 'searchList');
    }
    
    //회선등록
    function lineWrite(){
    	var dataParam = $('#'+alGridTop).alopexGrid('dataGet');
    	if(dataParam.length > 0 ){
    		var paramDataList = {"svlnSclCd":popFindSvlnSclCd};
    		if(jobAcepInclYn == "Y"){
        		$.extend(paramDataList,{"jobAcepInclYn":jobAcepInclYn});
 				$.extend(paramDataList,{"jobCompleteCd":"12"});
        		$.extend(paramDataList,{"crcnCmplYn":"N"});
    		}
    		$.extend(paramDataList,{"reqSubList":dataParam});
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updatejobrequestlineno', paramDataList, 'POST', 'lineWrite');
    	}else{
    		alertBox('I', cflineMsgArray['noLineInfo']);  /*	회선정보가 없거나 정확하지 않습니다.	*/
    		$("#"+gridIdWork).alopexGrid("startEdit");
    	}
    }
    
    function setSelectCode() {
    }

    function setEventListener() {
    	
    	// 엔터키로 검색
    	$('#'+alGridTop).on('keydown', function(e){
    		if(e.keyCode == 13) {
    			passFlag = "N";
    			event = e;
    			var focusData = $('#'+alGridTop).alopexGrid("focusInfo").inputFocus.mapping;
    			var tmpKey = focusData.key;
    			if( tmpKey == "tmpLineNo" || tmpKey == "tmpLineNm" ) {
    				
        	    	$('#'+alGridTop).alopexGrid('endEdit', {_state:{editing:true}});
    				var callData = $('#' + alGridTop).alopexGrid("dataGet", { _state : { selected : true }});
    				if(callData.length <= 0){
            	        $('#'+alGridTop).alopexGrid("startEdit");
        				alertBox('I', cflineMsgArray['selectNoData']);	/* 선택된 데이터가 없습니다. */
        				return false;
    				}else if(callData.length > 1){
            	        $('#'+alGridTop).alopexGrid("startEdit");
        				alertBox('I', cflineMsgArray['selectOnlyOneItem']);	/* 여러개가 선택되었습니다. 하나만 선택하세요. */
        				return false;
        			}
    				//console.log(callData);
    				//console.log("======================");
    				if(tmpKey == "tmpLineNo" && nullToEmpty(callData[0].tmpLineNo) == ""){
        				//console.log(tmpKey);
        				alertBox('I', makeArgCommonMsg('required', cflineMsgArray['line'])); /* [{0}] 필수 입력 항목입니다. */
            	        $('#'+alGridTop).alopexGrid("startEdit");
    					return false;
    				}

    				if(tmpKey == "tmpLineNo" && callData[0].tmpLineNo.length < 5){
            	        $('#'+alGridTop).alopexGrid("startEdit");
    					alertBox('I', makeArgCommonMsg2('minLengthPossible', cflineMsgArray['line'], 5)); /* {0} 항목은 {1}자이상 입력가능합니다. */
    					return false;
    				}
    				if(tmpKey == "tmpLineNm" && nullToEmpty(callData[0].tmpLineNm) == ""){
            	        $('#'+alGridTop).alopexGrid("startEdit");
    					alertBox('I', makeArgCommonMsg('required', cflineMsgArray['lnNm'])); /* [{0}] 필수 입력 항목입니다. */
    					return false;
    				}

    				if(tmpKey == "tmpLineNm" && callData[0].tmpLineNm.length < 5){
            	        $('#'+alGridTop).alopexGrid("startEdit");
    					alertBox('I', makeArgCommonMsg2('minLengthPossible', cflineMsgArray['lnNm'], 5)); /* {0} 항목은 {1}자이상 입력가능합니다 */
    					return false;
    				}  				
    				searchList(callData);
    			} 
    		}
    	});
    	
    	// 회선 선택
    	$('#'+alGridBottom).on('dblclick', '.bodycell', function(e){
    		passFlag = "Y";
    		$('#'+alGridTop).alopexGrid('endEdit', {_state:{editing:true}});
    		var selectedData = $('#' + alGridBottom).alopexGrid("dataGet", { _state : { focused : true }});
    		var editLineNo = selectedData[0].svlnNo;
    		var editLineNm = selectedData[0].lineNm;
    		var focusData = $('#'+alGridTop).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
    		$('#'+alGridTop).alopexGrid( "cellEdit", editLineNo, {_index : { row : rowIndex}}, "tmpLineNo");	
			$('#'+alGridTop).alopexGrid( "cellEdit", editLineNm, {_index : { row : rowIndex}}, "tmpLineNm");
			 $('#'+alGridTop).alopexGrid("startEdit");
		});
    	
    	//회선등록
    	$('#btnPopWrite').on('click', function(e) {
    		$('#'+alGridTop).alopexGrid('endEdit', {_state:{editing:true}});
        	var dataParam = $('#'+alGridTop).alopexGrid('dataGet');
        	for(i=0; i<dataParam.length; i++){
        		//console.log(dataParam[i].tmpLineNo);
        		if( (dataParam[i].tmpLineNo =="" || dataParam[i].tmpLineNo == undefined) && 
        				(dataParam[i].lineNo =="" || dataParam[i].lineNo == undefined) ){
        			passFlag = "N";
        		}
        	}
    		if(passFlag == "N"){
    			alertBox('I', cflineMsgArray['noLineInfo']);  	/*	회선정보가 없거나 정확하지 않습니다.	*/	
    			$('#'+alGridTop).alopexGrid("startEdit");
    		}else{
        		lineWrite();
    		}
	   	});
    	
    	//	취소
    	$('#btnPopClose').on('click', function(e) {
    		$a.close("cancle");
	   	});
	};

	//request 성공시.
    function successCallback(response, status, jqxhr, flag){
    	
    	// 조회
		if(flag == 'searchList') {
    		if(response.lineList != null){
    	        $('#'+alGridBottom).alopexGrid("dataSet", response.lineList);
    	        $('#'+alGridTop).alopexGrid("startEdit");
    		}
    		cflineHideProgressBody();
		} 
		
		//회선등록
		if(flag == 'lineWrite'){
			$a.close("write");
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	cflineHideProgressBody();
    	if(flag == 'searchList') {
        	$('#'+alGridTop).alopexGrid("startEdit");
		} 
    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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