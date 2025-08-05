/**
 * OmsTccLnoMgmt.js
 *
 * @author P123512
 * @date 2018.12.03
 * @version 1.0
 * 
 * ************* 수정이력 ************
 * 2022-08-30  1. 중복회선의 경우 OMS에 등록되지 않은 트렁크정보는 표시되지 않게 수정
 * 2023-03-15  2. 세로선번표기 기능추가하여 필요에 따라 선번을 세로로 출력가능하도록 개선
 * 
 */

var whole = cflineCommMsgArray['all']; /* 전체 */
var dataGridTeb1 = "dataGridTeb1";
var cnvtGridTeb1 = "cnvtGridTeb1";
var currentGrid = dataGridTeb1;
var omsSchGbnVal = "T";  // 조회구분 기본값(TIE) 세팅 
var cnvtGridMapping = null;
var taskMaxnumber = 5;
var omsLnoChkGbn = null;	//세로선번체크값

$a.page(function() {
	
    this.init = function(id, param) {
    	setSelectCode();
 		getGrid("TOP");
        setEventListener();
     
    };
    
    function setSelectCode() {
    }
    // 상단 그리드 
    function columnMapping(sType) {
    	var mapping = [];
		mapping.push({ selectorColumn : true, width : '50px' } );
		
    	if(sType == "data") {
    		var extendMapping = [];
    		extendMapping.push({key : 'ordRow',	align:'center',	width:'60px',  editable:true,	title : cflineMsgArray['sequence'] /*  순번 */});
    		if(omsSchGbnVal == "L"){  // 회선명 검색
        		extendMapping.push({key : 'lineNm',	align:'left',	width:'300px', editable:true,	title : cflineMsgArray['lnNm'] /*  회선명 */});
        		extendMapping.push({key : 'mtsoNm',	align:'left',	width:'100px', editable:true,	title : cflineMsgArray['transmissionOffice']/*"전송실"*/}); 
    		}else if(omsSchGbnVal == "O"){  // OMS PATH명 검색
        		extendMapping.push({key : 'omsPathNm',	align:'left',	width:'300px', editable:true,	title : "OMS PATH"});
        		extendMapping.push({key : 'mtsoNm',	align:'left',	width:'100px', editable:true,	title : cflineMsgArray['transmissionOffice']/*"전송실"*/}); 
        		extendMapping.push({key : 'eqpNm',	align:'left',	width:'300px', editable:true,	title : cflineMsgArray['equipment']/*"장비"*/});
        		extendMapping.push({key : 'portNm',	align:'left',	width:'120px', editable:true,	title : "APORT"});
    		}else if(omsSchGbnVal == "E"){  // 장비,포트 검색
        		extendMapping.push({key : 'eqpNm',	align:'left',	width:'300px', editable:true,	title : cflineMsgArray['equipment']/*"장비"*/});
        		extendMapping.push({key : 'portNm',	align:'left',	width:'120px', editable:true,	title : "APORT"});
        		extendMapping.push({key : 'mtsoNm',	align:'left',	width:'100px', editable:true,	title : cflineMsgArray['transmissionOffice']/*"전송실"*/}); 
    		}else if(omsSchGbnVal == "B" || omsSchGbnVal == "TB"){  // 국간 검색
        		extendMapping.push({key : 'ntwkLineNm',	align:'left',	width:'300px', editable:true,	title : cflineMsgArray['trunk']/*"트렁크"*/});
        		extendMapping.push({key : 'eqpNm',	align:'left',	width:'250px', editable:true,	title : cflineMsgArray['equipment']/*"장비"*/});
        		extendMapping.push({key : 'portNm',	align:'left',	width:'120px', editable:true,	title : "APORT"});
        		extendMapping.push({key : 'endNtwkLineNm',	align:'left',	width:'300px', editable:true,	title : cflineMsgArray['trunk']/*"트렁크"*/});
        		extendMapping.push({key : 'endEqpNm',	align:'left',	width:'250px', editable:true,	title : cflineMsgArray['equipment']/*"장비"*/});
        		extendMapping.push({key : 'endPortNm',	align:'left',	width:'120px', editable:true,	title : "APORT"});
    		}else{  // TIE 검색
        		extendMapping.push({key : 'tieDiv',	align:'left',	width:'100px', editable:true,	title : cflineMsgArray['tidDiv']/*"TIE구분"*/});
        		extendMapping.push({key : 'tie',	align:'left',	width:'300px', editable:true,	title : "TIE"});	
        		extendMapping.push({key : 'mtsoNm',	align:'left',	width:'100px', editable:true,	title : cflineMsgArray['transmissionOffice']/*"전송실"*/}); 		
    		}  
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
        } else if(sType == "cnvt") {
    		cnvtGridMapping = [];
			cnvtGridMapping.push({key : 'ordSeq',			  title: cflineMsgArray['sequence'] /*  순번 */,	align:'center',	width:'60px', editable:false});  
			cnvtGridMapping.push({key: 'lineNm',             title: cflineMsgArray['lnNm'] /*  회선명 */, align:'left', width:'200px', editable:false}); 
			cnvtGridMapping.push({key: 'omsPathNm',          title: "OMS Path Name", align:'left', width:'200px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnNo',             title: cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/, align:'left', width:'110px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnStatCdNm',       title: cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'leslNo',             title: cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'commBizrNm',         title: cflineMsgArray['businessMan'] /* 사업자 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lnkgBizrCdNm',       title: cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineUsePerdTypCdNm', title: cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'mgmtGrpCdNm',        title: cflineMsgArray['managementGroup'] /*  관리그룹 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnLclCdNm',        title: cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnSclCdNm',        title: cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnTypCdNm',        title: cflineMsgArray['serviceLineType'] /*  서비스회선유형 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineCapaCdNm',       title: cflineMsgArray['lineCapacity'] /*회선용량*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogMscId',            title: "OG_MSC_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogMp',               title: "OG_MP", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogPp',               title: "OG_PP", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogCard',             title: "OG_CARD", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogLink',             title: "OG_LINK", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogTieOne',           title: "OG_TIE1", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogTieTwo',           title: "OG_TIE2", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icMscId',            title:  "IC_MSC_ID" , align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icMp',               title: "IC_MP", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icPp',               title: "IC_PP", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icCard',             title: "IC_CARD", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icLink',             title: "IC_LINK", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icTieOne',           title: "IC_TIE1", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'icTieTwo',           title: "IC_TIE2", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogicCdNm',           title: "OG/IC", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'tieMatchYn',         title: cflineMsgArray['tieAccord'] /*  TIE일치 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'tieOne',             title: "TIE1", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'tieTwo',             title: "TIE2", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'mscId',              title: "MSC_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'bscId',              title: "BSC_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'bts',                title: "BTS", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cinu',               title: "CINU(M)", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'aep',                title: "AEP(M)", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'portNo',             title: "PORT_NO", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'bip',                title: "BIP", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'bipP',               title: "BIP_P", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'btsId',              title: "BTS_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cuid',               title: "CUID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'btsName',            title: cflineMsgArray['mtsoNameMid']+"(M)" /*기지국명*/ , align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ima',                title: "IMA", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'status',             title: cflineMsgArray['status'] /*상태*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'slPath',             title: "SL_PATH" , align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'onmPath',            title: "ONM_PATH", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cmsBmtso',           title: cflineMsgArray['btsName']+"(CMS)" /*기지국사*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cmsId',              title: cflineMsgArray['cmsId'], align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cmsMscId',           title: "CMS_MSC_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cmsBscId',           title: "CMS_BSC_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'cmsBtsId',           title: "CMS_BTS_ID", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'rnmEqpIdNm',         title: cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'rnmPortIdNm',        title: cflineMsgArray['rmPortNm']  /*  RM포트명 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'rnmPortChnlVal',     title: cflineMsgArray['rmChannelName']  /*  RM채널명 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'faltMgmtObjYnNm',    title: cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineOpenDt',         title: cflineMsgArray['lineOpeningDate'] /*회선개통일자*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lastChgDate',        title: cflineMsgArray['lastChangeDate'] /*수정일자*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineAppltNo',	      title: cflineMsgArray['applicationNumber']  /*청약번호*/ ,align:'center', width: '130px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineTrmnSchdDt',     title: cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'uprTeamNm',          title: cflineMsgArray['upperTeam'] /*상위팀*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'uprMtsoIdNm',        title: cflineMsgArray['upperMtso'] /*상위국사*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lowTeamNm',          title: cflineMsgArray['lowerTeam'] /*하위팀*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lowMtsoIdNm',        title: cflineMsgArray['lowerMtso'] /*하위국사*/ , align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'uprSystmNm',         title: cflineMsgArray['upperSystemName'] /*상위시스템명*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lowSystmNm',         title: cflineMsgArray['lowSystemName'] /*하위시스템명*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'mgmtPostCdNm',       title: cflineMsgArray['managementPost'] /*관리포스트*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'appltDt',            title: cflineMsgArray['applicationDate'] /*청약일자*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineDistTypCdNm',    title: cflineMsgArray['lineDistanceType'] /*회선거리유형*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineSctnTypCdNm',    title: cflineMsgArray['lineSectionType'] /*회선구간유형*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'chrStatCdNm',        title: cflineMsgArray['chargingStatus'] /*과금상태*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lesFeeTypCdNm',      title: cflineMsgArray['rentFeeType'] /*임차요금유형*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'feePayTrmsMtsoNm',   title: cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'areaCmtsoNm',        title: cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineMgmtGrCdNm',     title: cflineMsgArray['lineManagementGrade'] /*회선관리등급*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineRmkOne',         title: cflineMsgArray['lineRemark1'] /*회선비고1*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineRmkTwo',         title: cflineMsgArray['lineRemark2'] /*회선비고2*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineRmkThree',       title: cflineMsgArray['lineRemark3'] /*회선비고3*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'srsLineYnNm',        title: cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/, align:'left', width:'100px', editable:false}); 
  			//cnvtGridMapping.push({key : 'tie',				  title : "TIE",	align:'left',	width:'120px', editable:false}); 
		    cnvtGridMapping.push({key : 'eqpNm',			  title : cflineMsgArray['equipmentName']+'(AON)' /* 장비명 */, align:'left', width:'130px', editable:false}); 
		    cnvtGridMapping.push({key : 'portChnlVal',		  title : "포트채널값"+'(AON)', 	align:'left', width:'130px', editable:false}); 
    	
	   		for(var i = 0 ; i < cnvtGridMapping.length; i++ ) {
	   			mapping.push(cnvtGridMapping[i]);
	   		}
	   		
	   		/**
	   		 * 2023-03-20
	   		 * 세로선번표기 체크한 경우에는 #표기없이 선번정보컬럼에 use를 붙여 분리한다.
	   		 * eqpNm의 경우 AON장비명과 key가 동일하여 선번정보의 장비명이 표기되는 현상 발생 
	   		 */
	   		if(omsLnoChkGbn == "WC") {
	    		mapping.push({ key:'useRingNtwkLineNm'    ,title:cflineMsgArray['ring']    ,align:'left', width: '180px', editable: true });
	    		mapping.push({ key:'useTrkNtwkLineNm'    ,title:cflineMsgArray['trunk']     ,align:'left', width: '180px', editable: true });
	    		mapping.push({ key:'useEqpNm'		 		, title:cflineMsgArray['equipment']	    	,align:'left', width: '180px', editable: true });
	    		mapping.push({ key:'useAportNm'		 , title:cflineMsgArray['aport']	    	,align:'left', width: '120px', editable: true });
	    		mapping.push({ key:'useBportNm'		 , title:cflineMsgArray['bport']    	,align:'left', width: '120px', editable: true });
	   		} else {
		    	for(var j=0; j < taskMaxnumber; j++){
		    		var k = j +1 ; 
		    		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '180px', editable: true });
		    		mapping.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '180px', editable: true });
		    		mapping.push({ key:'eqpNm#'+j		 , title:cflineMsgArray['equipment']+'#'+k	    	,align:'left', width: '180px', editable: true });
		    		mapping.push({ key:'aportNm#'+j		 , title:cflineMsgArray['aport']+'#'+k	    	,align:'left', width: '120px', editable: true });
		    		mapping.push({ key:'bportNm#'+j		 , title:cflineMsgArray['bport'] +'#'+k	    	,align:'left', width: '120px', editable: true });
		    	} 
	   		}

	   		
        } else if(sType == "eqp") {
    		cnvtGridMapping = [];
			cnvtGridMapping.push({key : 'ordSeq',			  title: cflineMsgArray['sequence'] /*  순번 */,	align:'center',	width:'60px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineNm',             title: cflineMsgArray['lnNm'] /*  회선명 */, align:'left', width:'200px', editable:false});
  			cnvtGridMapping.push({key: 'omsPathNm',          title: "OMS Path Name", align:'left', width:'300px', editable:false});
  			cnvtGridMapping.push({key: 'svlnNo',             title: cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/, align:'left', width:'110px', editable:false});
  			cnvtGridMapping.push({key: 'svlnStatCdNm',       title: cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */, align:'left', width:'100px', editable:false});
  			cnvtGridMapping.push({key: 'mgmtGrpCdNm',        title: cflineMsgArray['managementGroup'] /*  관리그룹 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnLclCdNm',        title: cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnSclCdNm',        title: cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'svlnTypCdNm',        title: cflineMsgArray['serviceLineType'] /*  서비스회선유형 */, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'ogicCdNm',           title: "OG/IC", align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineOpenDt',         title: cflineMsgArray['lineOpeningDate'] /*회선개통일자*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineRmkOne',         title: cflineMsgArray['lineRemark1'] /*회선비고1*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineRmkTwo',         title: cflineMsgArray['lineRemark2'] /*회선비고2*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key: 'lineRmkThree',       title: cflineMsgArray['lineRemark3'] /*회선비고3*/, align:'left', width:'100px', editable:false}); 
  			cnvtGridMapping.push({key : 'tie',				  title : "TIE",	align:'left',	width:'120px', editable:false}); 
		    cnvtGridMapping.push({key : 'eqpNm',			  title : cflineMsgArray['equipmentName']+'(AON)' /* 장비명 */, align:'left', width:'130px', editable:false}); 
		    cnvtGridMapping.push({key : 'portChnlVal',		  title : "포트채널값"+'(AON)', 	align:'left', width:'130px', editable:false}); 

	   		for(var i = 0 ; i < cnvtGridMapping.length; i++ ) {
	   			mapping.push(cnvtGridMapping[i]);
	   		}
	    	
	    	if(omsLnoChkGbn == "WC") {
	    		mapping.push({ key:'useRingNtwkLineNm'    ,title:cflineMsgArray['ring']    ,align:'left', width: '180px', editable: true });
	    		mapping.push({ key:'useTrkNtwkLineNm'    ,title:cflineMsgArray['trunk']     ,align:'left', width: '180px', editable: true });
	    		mapping.push({ key:'useEqpNm'		 		, title:cflineMsgArray['equipment']	    	,align:'left', width: '180px', editable: true });
	    		mapping.push({ key:'useAportNm'		 , title:cflineMsgArray['aport']	    	,align:'left', width: '120px', editable: true });
	    		mapping.push({ key:'useBportNm'		 , title:cflineMsgArray['bport']    	,align:'left', width: '120px', editable: true });
	   		} else {
		    	for(var j=0; j < taskMaxnumber; j++){
		    		var k = j +1 ; 
		    		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '180px', editable: true });
		    		mapping.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '180px', editable: true });
		    		mapping.push({ key:'eqpNm#'+j		 , title:cflineMsgArray['equipment']+'#'+k	    	,align:'left', width: '180px', editable: true });
		    		mapping.push({ key:'aportNm#'+j		 , title:cflineMsgArray['aport']+'#'+k	    	,align:'left', width: '120px', editable: true });
		    		mapping.push({ key:'bportNm#'+j		 , title:cflineMsgArray['bport'] +'#'+k	    	,align:'left', width: '120px', editable: true });
		    	} 
	   		}
    	}
	
		return mapping;
    }
    
    function setEventListener() {
    	// 조회 종류 Radio 버튼 클릭시
    	$('input:radio[name=omsSchGbn]').on('change', function(e) {
			if(omsSchGbnVal != $(this).val()){
	    		var dataList = $('#'+dataGridTeb1).alopexGrid('dataGet');
	    		if(dataList.length > 0){
		    		//dataGridTeb1
	    			var tmpVal = omsSchGbnVal ; 
					omsSchGbnVal = $(this).val();
					
					callMsgBox('','C', cflineMsgArray['noDataGridDelProc']/*"그리드에 데이터가 있습니다.<br>삭제하고 진행하시겠습니까?"*/, function(msgId, msgRst){ 
						if (msgRst == 'Y') {
														
							$('#'+dataGridTeb1).alopexGrid("dataEmpty");	
							if(omsLnoChkGbn == 'WC') {
								getGrid("WIDTH", omsSchGbnVal);
							} else {
								getGrid("TOP", omsSchGbnVal);
							}
							$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
							
							//TIE회선외 회선은 OEDT체크 해제
							if(omsSchGbnVal == "L" || omsSchGbnVal == "O" || omsSchGbnVal == "E" || omsSchGbnVal == "B" || omsSchGbnVal == "TB"){
								$("#omsOedtGbn_OT").setChecked(false);
							}
						}else{
							var tmpId = 'omsSchGbn_' + tmpVal;
							omsSchGbnVal = tmpVal;
							$('#' + tmpId).setSelected();	
							return false;
						}		
			       	});
	    		}else{
					omsSchGbnVal = $(this).val();
					if(omsLnoChkGbn == 'WC') {
						getGrid("WIDTH", omsSchGbnVal);
					} else {
						getGrid("TOP", omsSchGbnVal);
					}		
					$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
	    		}
			}
    	});
    	// OEDT checkBox 버튼 클릭시
    	$("input:checkbox[name='omsOedtGbn']").on('click', function(e){
    		var omsOedtGbnVal = "";
    		if ($("input:checkbox[name='omsOedtGbn']").is(":checked") ){
    			omsOedtGbnVal = "CK";
    		}
    		if(omsOedtGbnVal != $(this).val()){
	    		var dataList = $('#'+dataGridTeb1).alopexGrid('dataGet');
	    		if(dataList.length > 0){
		    		//dataGridTeb1
	    			var tmpVal = omsSchGbnVal ; 
					omsSchGbnVal = $(this).val();
					
					callMsgBox('','C', cflineMsgArray['noDataGridDelProc']/*"그리드에 데이터가 있습니다.<br>삭제하고 진행하시겠습니까?"*/, function(msgId, msgRst){ 
						if (msgRst == 'Y') {
							
							$('#'+dataGridTeb1).alopexGrid("dataEmpty");							
							if(omsLnoChkGbn == 'WC') {
								getGrid("WIDTH", omsSchGbnVal);
							} else {
								getGrid("TOP", omsSchGbnVal);
							}
							$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
						}else{
							var tmpId = 'omsSchGbn_' + tmpVal;
							omsSchGbnVal = tmpVal;
							$('#' + tmpId).setSelected();	
							return false;
						}		
			       	});
	    		}else{
					omsSchGbnVal = $(this).val();
					if(omsLnoChkGbn == 'WC') {
						getGrid("WIDTH", omsSchGbnVal);
					} else {
						getGrid("TOP", omsSchGbnVal);
					}
					$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
	    		}
			}
        });
    	//세로선번표기 체크시 2023-03-20
    	$("input:checkbox[name='omsLnoChkGbn']").on('click', function(e){

    		//세로선번표기 체크시 width로 표기한다
    		if ($("input:checkbox[name='omsLnoChkGbn']").is(":checked") ){
    			omsLnoChkGbn = "WC";	
    		} else {
    			omsLnoChkGbn = "LC";	
    		} 

			var dataList = $('#'+dataGridTeb1).alopexGrid('dataGet');
    		if(dataList.length > 0){
	    		//dataGridTeb1
    			var tmpVal = omsSchGbnVal ; 
				
				callMsgBox('','C', cflineMsgArray['noDataGridDelProc']/*"그리드에 데이터가 있습니다.<br>삭제하고 진행하시겠습니까?"*/, function(msgId, msgRst){ 
					if (msgRst == 'Y') {
						
						if(omsLnoChkGbn == 'WC') {
							getGrid("WIDTH", omsSchGbnVal);
						} else {
							getGrid("TOP", omsSchGbnVal);
						}
						$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
					}else{
						var tmpId = 'omsSchGbn_' + tmpVal;
						omsSchGbnVal = tmpVal;
						$('#' + tmpId).setSelected();	
						return false;
					}		
		       	});
    		}else{
				if(omsLnoChkGbn == 'WC') {
					getGrid("WIDTH", omsSchGbnVal);
				} else {
					getGrid("TOP", omsSchGbnVal);
				}
				$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
    		}
    		
        });
    	
    	//TIE조회 
    	$('#btnSchTie').on('click', function(e) {
    		searchTieProc();   
        });
 		
 		//행추가
 		$('#btnAddRow').on('click', function(e) {
 			var gridLoc = null;
 			if ($("input:checkbox[id='bottomGridAdd']").is(":checked") ){
 				gridLoc = "cnvtGridTeb1";
 			} else {
 				gridLoc = "dataGridTeb1";
 			}
 			
 			var lc = $('#lineCnt').val();
 			var addDatas = [];

			var gridLength = $('#'+gridLoc).alopexGrid('dataGet').length;
			
 			if(nullToEmpty(lc)=="") {
 				var addData = { "ordRow" : gridLength+1  };
 				$("#"+gridLoc).alopexGrid('dataAdd', addData);
 			}else{
 				for(var idx = 0 ; idx < lc ; idx++) {
 					addDatas.push({"ordRow":++gridLength});
 				}
 				$("#"+gridLoc).alopexGrid("dataAdd", addDatas);
 			}
 			$("#"+gridLoc).alopexGrid("endEdit");
         });
		
		//행삭제
		$('#btnDelGrid').on('click', function(e) {
			var gridLoc = null;
 			if ($("input:checkbox[id='bottomGridAdd']").is(":checked") ){
 				gridLoc = "cnvtGridTeb1";
 			} else {
 				gridLoc = "dataGridTeb1";
 			}
			
			if($('#'+gridLoc).length == 0) {return;}
			$('#'+gridLoc).alopexGrid("dataDelete", {_state:{selected:true}});
			
			var gridAll = $('#'+gridLoc).alopexGrid('dataGet');
			for(var idx = 0 ; idx < gridAll.length ; idx++ ) {
				$('#'+gridLoc).alopexGrid( "cellEdit", idx+1, {_index : { row : gridAll[idx]._index.row}}, "ordRow");
			}
        });
     	

	 	// 엑셀 다운로드 버튼 클릭
		$('#btnExportExcel').on('click', function(e) {		
			if($('#'+cnvtGridTeb1).length == 0) {return;}
    		var dataList = $('#'+cnvtGridTeb1).alopexGrid('dataGet', {_state: {selected:true}});
    		
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
    		
    		var maxLnoNumVal = getMaxCntLnoData(dataList);    		
    		
    		var headerData = [] ;
       		for(var i = 0 ; i < cnvtGridMapping.length; i++ ) {
       			headerData.push(cnvtGridMapping[i]);
       		}

       		if(omsLnoChkGbn == 'WC') {
        		headerData.push({ key:'useTrkNtwkLineNm'    ,title:cflineMsgArray['trunk']    ,align:'left', width: '180px', editable: true });
        		headerData.push({ key:'useRingNtwkLineNm'    ,title:cflineMsgArray['ring']    ,align:'left', width: '180px', editable: true });
        		headerData.push({ key:'useEqpNm'		 , title:cflineMsgArray['equipment']	    	,align:'left', width: '180px', editable: true });
        		headerData.push({ key:'useAportNm'	 , title:cflineMsgArray['aport']	    	,align:'left', width: '120px', editable: true });
        		headerData.push({ key:'useBportNm'		 , title:cflineMsgArray['bport']	    	,align:'left', width: '120px', editable: true });
    
       		} else {
       			for(var j=0; j < maxLnoNumVal; j++){
	        		var k = j +1 ; 
	        		headerData.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '180px', editable: true });
	        		headerData.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '180px', editable: true });
	        		headerData.push({ key:'eqpNm#'+j		 , title:cflineMsgArray['equipment']+'#'+k	    	,align:'left', width: '180px', editable: true });
	        		headerData.push({ key:'aportNm#'+j		 , title:cflineMsgArray['aport']+'#'+k	    	,align:'left', width: '120px', editable: true });
	        		headerData.push({ key:'bportNm#'+j		 , title:cflineMsgArray['bport'] +'#'+k	    	,align:'left', width: '120px', editable: true });
	        	}  
       		}
       		
    		
    		var listData = getCnvtListData(headerData, dataList);
    		var excelFileNmVal = "";
    		if(omsSchGbnVal == "L"){  // 회선명 검색
    			excelFileNmVal = cflineMsgArray['lnNm'] + "_";
    		}else if(omsSchGbnVal == "O"){  // OMS PATH명 검색
    			excelFileNmVal = cflineMsgArray['omsUnderPsthName'] + "_";
    		}else if(omsSchGbnVal == "E"){  // 장비,포트 검색
    			excelFileNmVal = cflineMsgArray['eqpUnderPort'] + "_";
    		}else if(omsSchGbnVal == "B" || omsSchGbnVal == "TB"){  // 국간 검색
    			excelFileNmVal = cflineMsgArray['betweenMtso'] + "_";
    		}else{
    			excelFileNmVal = "TIE_";
    		}
    		
    		var dataParams = {"headerList" : headerData, "gridDataList": listData, "excelFileNmVal": excelFileNmVal}
    		    		
//    		console.log(dataParams);
    		cflineShowProgressBody();	
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstcclnomgmt/excelcreate', dataParams, 'POST', 'excelcreate');
    		
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
	
	// 선번데이터 최대 개수 
	function getMaxCntLnoData(dataList){
		var maxLnoNumVal = 0;
		for(i=0;i<dataList.length;i++){
			var lnoNumVal = 0;
			for(j=0; j<taskMaxnumber; j++){
				var ntwkLineNmVal = nullToEmpty(dataList[i]["useTrkNtwkLineNm#" + j]);
				var ringLineNmVal = nullToEmpty(dataList[i]["useRingNtwkLineNm#" + j]);
				var eqpNmVal = nullToEmpty(dataList[i]["eqpNm#" + j]);
				var aportNmVal = nullToEmpty(dataList[i]["aportNm#" + j]);
				var bportNmVal = nullToEmpty(dataList[i]["bportNm#" + j]);				
				if(ntwkLineNmVal != "" || ringLineNmVal != "" || eqpNmVal != "" || aportNmVal != "" || bportNmVal != ""){
					lnoNumVal = j+1;
				}else{
					break;
				}				
			}    		
			// 최대 선번값 세팅
			if(maxLnoNumVal < lnoNumVal){
				maxLnoNumVal = lnoNumVal;
			}
		}
		return maxLnoNumVal;
	}

	/*
	 * 조회 함수
	 */
	function searchTieProc(){
		$("#"+dataGridTeb1).alopexGrid("endEdit");
		if($('#'+dataGridTeb1).length == 0) {
			return;
		}
		
		var dataList = $('#'+dataGridTeb1).alopexGrid('dataGet', {_state: {selected:true}});
		if (dataList.length == 0 ){
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
			return;
		}
		
    	var formParam =  $("#searchForm").getData();
		
    	/* TIE 검색시 OEDT 체크 */
    	var oedtGbn = null;
		if ($("input:checkbox[name='omsOedtGbn']").is(":checked") ){
			oedtGbn = "Y";
		} else {
			oedtGbn = "N";
		}

		if ($("input:checkbox[name='omsLnoChkGbn']").is(":checked") ){
			omsLnoChkGbn = "WC";
		} else {
			omsLnoChkGbn = "LC";
		}
		
		//그리드1 밸리데이션 체크
		if(chkValidation(formParam.omsSchGbn)) {
			var paramData = {};
			var tmpArr = [];
			var lineNm = "";
			var omsPathNm = "";
			var tie = "";
			var tieDiv = "";
			var mtsoNm = "";
			var ntwkLineNm = "";
			var eqpNm = "";
			var portNm = "";
			var portName = "";
			var chnlVal = "";
			var endNtwkLineNm = "";
			var endEqpNm = "";
			var endPortNm = "";
			var endPortName = "";
			var endChnlVal = "";
			
			// AON 과 다른것을 구분함.(AON은  AON0,SMCT 등과 같이 존재 하면 안됨)
			var tieAonCnt = 0;
			var tieAon0Smct0Cnt = 0;
//			var tieDivChkCnt = 0;
//			var preTieDiv = "";
			var aonSmctGbn = "";
			for(var i=0; i<dataList.length; i++){
				/*
					########################중요 사항################################
						그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
						따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
					########################중요 사항################################
				*/

				var tmpData = null;
				mtsoNm = replaceToEmpty(dataList[i].mtsoNm);
				if(nullToEmpty(formParam.omsSchGbn) == "T") {  // TIE 검색
					tieDiv = replaceToEmpty(dataList[i].tieDiv);
					tie = replaceToEmpty(dataList[i].tie);
					tmpData = {"ordRow":nullToEmpty(dataList[i].ordRow), "tieDiv":tieDiv, "tie":tie, "mtsoNm":mtsoNm};
//					if(preTieDiv !="" && preTieDiv!=tieDiv){
//						tieDivChkCnt++;
//					}	
//					preTieDiv = tieDiv;
					if(tieDiv=="AONT"){
						tieAonCnt++;
					}else{
						tieAon0Smct0Cnt++;
					}
					if(i==0){
						aonSmctGbn = tieDiv;
					}
				} else if(nullToEmpty(formParam.omsSchGbn) == "L") {  // 회선명 검색
					lineNm = replaceToEnter(dataList[i].lineNm);
					tmpData = {"ordRow":nullToEmpty(dataList[i].ordRow), "lineNm":lineNm, "mtsoNm":mtsoNm};
				} else if(nullToEmpty(formParam.omsSchGbn) == "O") {  // OMS PATH명 검색
					omsPathNm = replaceToEmpty(dataList[i].omsPathNm);
					eqpNm = replaceToEmpty(dataList[i].eqpNm);
					portNm = replaceToEmpty(dataList[i].portNm);
					tmpData = {"ordRow":nullToEmpty(dataList[i].ordRow), "omsPathNm":omsPathNm, "mtsoNm":mtsoNm, "eqpNm":eqpNm, "portNm":portNm};
				} else if(nullToEmpty(formParam.omsSchGbn) == "E") {  // 장비,포트 검색
					eqpNm = replaceToEmpty(dataList[i].eqpNm);
					portNm = replaceToEmpty(dataList[i].portNm);
					tmpData = {"ordRow":nullToEmpty(dataList[i].ordRow), "eqpNm":eqpNm, "portNm":portNm, "mtsoNm":mtsoNm};
				} else if(nullToEmpty(formParam.omsSchGbn) == "B" || nullToEmpty(formParam.omsSchGbn) == "TB") {  // 국간 검색
					ntwkLineNm = replaceToEmpty(dataList[i].ntwkLineNm);
					eqpNm = replaceToEmpty(dataList[i].eqpNm);
					portNm = replaceToEmpty(dataList[i].portNm);
					if(portNm.indexOf(",")>0){
						var chnlArr = portNm.split(",");
						portNm = chnlArr[0];
						chnlVal = chnlArr[1];
					}
					portName = replaceToEmpty(dataList[i].portNm);
					endNtwkLineNm = replaceToEmpty(dataList[i].endNtwkLineNm);
					endEqpNm = replaceToEmpty(dataList[i].endEqpNm);
					endPortNm = replaceToEmpty(dataList[i].endPortNm);
					if(endPortNm.indexOf(",")>0){
						var endChnlArr = endPortNm.split(",");
						endPortNm = endChnlArr[0];
						endChnlVal = endChnlArr[1];
					}
					endPortName = replaceToEmpty(dataList[i].endPortNm);

					tmpData = {"ordRow":nullToEmpty(dataList[i].ordRow), "ntwkLineNm":ntwkLineNm, "eqpNm":eqpNm, "portNm":portNm, "chnlVal":chnlVal, "portName":portName
									, "endNtwkLineNm":endNtwkLineNm, "endEqpNm":endEqpNm, "endPortNm":endPortNm, "endChnlVal":endChnlVal, "endPortName":endPortName};
				}	
				
				tmpArr.push(tmpData);
			}
			paramData.schParamList = tmpArr;
			
			if(tieAonCnt > 0 && tieAon0Smct0Cnt > 0){
    			alertBox('I', cflineMsgArray['noDiffTieDivInsert']); /* TIE구분은 서로 다른것을 같이 입력 할 수 없습니다. */
			}else{
				paramData.omsSchGbn = nullToEmpty(formParam.omsSchGbn);
				paramData.aonSmctGbn = aonSmctGbn;
				paramData.oedtGbn = oedtGbn;
				cflineShowProgressBody();	
				
				if(nullToEmpty(formParam.omsSchGbn) == "T") {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstcclnomgmt/getlnolistbytie', paramData, 'POST', "getlnolistbytie");
				} else if(nullToEmpty(formParam.omsSchGbn) == "L") {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstcclnomgmt/getlnolistbylinenm', paramData, 'POST', "getlnolistbylinenm");
				} else if(nullToEmpty(formParam.omsSchGbn) == "O") {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstcclnomgmt/getlnolistbyomspathnm', paramData, 'POST', "getlnolistbyomspathnm");
				} else if(nullToEmpty(formParam.omsSchGbn) == "E") {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstcclnomgmt/getlnolistbyeqpportnm', paramData, 'POST', "getlnolistbyeqpportnm");
				} else if(nullToEmpty(formParam.omsSchGbn) == "B" || nullToEmpty(formParam.omsSchGbn) == "TB") {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omstcclnomgmt/getlnolistbytrunk', paramData, 'POST', "getlnolistbytrunk");
				} else{
					cflineHideProgressBody();
				}
			}
		}
 
	}
	
	//조회전 밸류데이션 체크
	function chkValidation(value) {
		var validate = true;

		var dataList = $('#'+dataGridTeb1).alopexGrid('dataGet', {_state: {selected:true}});
		var msgStr = "" ;
		var lineIdx = "";

		for(var idx = 0 ; idx < dataList.length; idx++) {
			lineIdx = (idx+1)+"";
			if(nullToEmpty(value) == "T") { // TIE
				if(nullToEmpty(dataList[idx].tieDiv) == "" ) {
					msgStr = cflineMsgArray['tidDiv'] ; /*"TIE구분"*/
					validate = false;
					break;
				}
				if(nullToEmpty(dataList[idx].tie) == "" ) {
					msgStr = "TIE";
					validate = false;
					break;
				}
			} else if(nullToEmpty(value) == "L") { //  회선명
				if(nullToEmpty(dataList[idx].lineNm) == "" ) {
					msgStr = cflineMsgArray['lnNm']; /*  회선명 */
					validate = false;
					break;
				}
			} else if(nullToEmpty(value) == "O") { // OMS Path
				if(nullToEmpty(dataList[idx].omsPathNm) == "" ) {
					msgStr = "OMS PATH";
					validate = false;
					break;
				}
				
			} else if(nullToEmpty(value) == "E") { // 장비
				if(nullToEmpty(dataList[idx].eqpNm) == "" ) {
					msgStr = cflineMsgArray['equipment']; /*"장비"*/
					validate = false;
					break;
				}
				if(nullToEmpty(dataList[idx].portNm) == "" ) {
					msgStr = "APORT";
					validate = false;
					break;
				}
			} else if(nullToEmpty(value) == "B" || nullToEmpty(value) == "TB") { // 국간 
				if(nullToEmpty(dataList[idx].eqpNm) == "") {
					msgStr = "첫번째 " + cflineMsgArray['equipment']; /*"장비"*/
					validate = false;
					break;
				}
				if(nullToEmpty(dataList[idx].endEqpNm) == "") {
					msgStr = "두번째 " + cflineMsgArray['equipment']; /*"장비"*/
					validate = false;
					break;
				}
			}
			if(nullToEmpty(dataList[idx].mtsoNm) == "" && nullToEmpty(value) != "B" && nullToEmpty(value) != "TB") {
				msgStr = cflineMsgArray['transmissionOffice']; /*"전송실"*/
				validate = false;
				break;
			}
		}
		if(!validate && msgStr != ""){
			alertBox('W', makeArgMsg('lineValidation',lineIdx, msgStr,"","")); /* {0} 번째줄의 {1}은(는) 필수입니다. */
		}
		return validate;
	}	
		
	//선번편집
	function pathListSetting(list, pathList){

		var listData = [];
		for(var idx = 0 ; idx < list.length; idx++) {
			var trkData = list[idx];
			var result = true;
			var orgNtwkLineNm = nullToEmpty(trkData.ntwkLineNm);
			var tieCnt = nullToEmpty(trkData.tieCnt);
			
			//OMS PATH정보가 없는 경우 출력이 아예 되지 않는 현상이 발생하여 개선필요
			//if(pathList != null && pathList.length>0){ 
				var idxSeq = 0;  // lnoData.lonSeq
				
				//RM 1과 1-1, 2와 2-1을 비교하기 위한 
				var ntwkLineNm = "";
				var eqpNm = "";
				var aportNm = "";
				var bportNm = "";
				
				for(var j = 0; j<pathList.length; j++){
					var lnoData = pathList[j];
					if(nullToEmpty(trkData.ordRow) != "" && nullToEmpty(trkData.ordRow) == nullToEmpty(lnoData.ordSeq)){

						//하나의 tie에 2개의 트렁크가 등록되어있는경우 2개의 회선이 생성되는데 그중 한개의 트렁크에는 OMS정보가 없어 2개 모두 같은 정보가 중복으로 출력되는 현상을 막기 위해 추가 2022-08-18  	
						if(tieCnt == 2) {
							if (orgNtwkLineNm != nullToEmpty(lnoData.ntwkLineNm) && nullToEmpty(lnoData.rm) == "1") {
								result = false;
								break;
							}
						}
						
						if(nullToEmpty(lnoData.rm) == "1-1" || nullToEmpty(lnoData.rm) == "2-1") {
							//RM "1"번과 "1-1"번이 같은 경우 화면에 표시하지 않는다 
							if(eqpNm != nullToEmpty(lnoData.eqpNm) || aportNm != nullToEmpty(lnoData.aportNm) || bportNm != nullToEmpty(lnoData.bportNm)) {
								
								trkData["useTrkNtwkLineNm#" + idxSeq] = nullToEmpty(lnoData.ntwkLineNm);
		    					trkData["useRingNtwkLineNm#" + idxSeq] = nullToEmpty(lnoData.rignNm);
		    					trkData["eqpNm#" + idxSeq] = nullToEmpty(lnoData.eqpNm);
		    					trkData["aportNm#" + idxSeq] = nullToEmpty(lnoData.aportNm);
		    					trkData["bportNm#" + idxSeq] = nullToEmpty(lnoData.bportNm);
		    					
		    					idxSeq++;
							}
						} else {
							trkData["useTrkNtwkLineNm#" + idxSeq] = nullToEmpty(lnoData.ntwkLineNm);
	    					trkData["useRingNtwkLineNm#" + idxSeq] = nullToEmpty(lnoData.rignNm);
	    					trkData["eqpNm#" + idxSeq] = nullToEmpty(lnoData.eqpNm);
	    					trkData["aportNm#" + idxSeq] = nullToEmpty(lnoData.aportNm);
	    					trkData["bportNm#" + idxSeq] = nullToEmpty(lnoData.bportNm);
	    					// "1-1" 또는 "2-1"번과 비교해서 중복인 경우 화면에 표시하지 않기 위해 첫행 또는 RM이 "2"번 (END 트렁크정보) 인 경우 트렁크정보 셋팅
	    					if(idxSeq == 0 || nullToEmpty(lnoData.rm) == "2"){
	    						ntwkLineNm = nullToEmpty(lnoData.ntwkLineNm);
	    						eqpNm = nullToEmpty(lnoData.eqpNm);
	    						aportNm = nullToEmpty(lnoData.aportNm);
	    						bportNm = nullToEmpty(lnoData.bportNm);
	    					}
	    					
	    					idxSeq++;
	    				}	
					}
				}
			//}
			
			//if(nullToEmpty(trkData.omsPathNm) != "") { // omsPathNm명이 있는 회선만 출력한다
				if(result) listData.push(trkData);
			//}
		} 
        $('#'+cnvtGridTeb1).alopexGrid("dataSet", listData);
        
	}

	//세로선번표현
	function pathListSettingWidth(list, pathList) {
		
		var listData = [];
		var selRowIndex = 0;
		
		for(var idx = 0 ; idx < list.length; idx++) {
			
			//RM 1과 1-1, 2와 2-1을 비교하기 위한 
			var ntwkLineNm = "";
			var eqpNm = "";
			var aportNm = "";
			var bportNm = "";
			
			for(var j = 0; j < pathList.length; j++){
				
				listData = [];
				var trkData = list[idx];
				var lnoData = pathList[j];
				var result = true;
				var idxSeq = 0;  // lnoData.lonSeq
				var orgNtwkLineNm = nullToEmpty(trkData.ntwkLineNm);
				var tieCnt = nullToEmpty(trkData.tieCnt);
				
				if(nullToEmpty(trkData.ordRow) != "" && nullToEmpty(trkData.ordRow) == nullToEmpty(lnoData.ordSeq)){

					//하나의 tie에 2개의 트렁크가 등록되어있는경우 2개의 회선이 생성되는데 그중 한개의 트렁크에는 OMS정보가 없어 2개 모두 같은 정보가 중복으로 출력되는 현상을 막기 위해 추가 2022-08-18  	
					if(tieCnt == 2) {
						if (orgNtwkLineNm != nullToEmpty(lnoData.ntwkLineNm) && nullToEmpty(lnoData.rm) == "1") {
							result = false;
							break;
						}
					}
					
					var addData = {
							 "useTrkNtwkLineNm" : nullToEmpty(lnoData.ntwkLineNm)
						   , "useRingNtwkLineNm"  : nullToEmpty(lnoData.rignNm)
						   , "useEqpNm" : nullToEmpty(lnoData.eqpNm)
						   , "useAportNm" : nullToEmpty(lnoData.aportNm)
						   , "useBportNm" : nullToEmpty(lnoData.bportNm)
					}
					
					if(nullToEmpty(lnoData.rm) == "1-1" || nullToEmpty(lnoData.rm) == "2-1") {
						//RM "1"번과 "1-1"번이 같은 경우 화면에 표시하지 않는다 
						if(eqpNm != nullToEmpty(lnoData.eqpNm) || aportNm != nullToEmpty(lnoData.aportNm) || bportNm != nullToEmpty(lnoData.bportNm)) {

							$.extend(trkData, addData);
							$('#'+cnvtGridTeb1).alopexGrid("dataAdd", $.extend({}, trkData), {_index:{data:selRowIndex}});
						}
					} else {

						$.extend(trkData, addData);
						$('#'+cnvtGridTeb1).alopexGrid("dataAdd", $.extend({}, trkData), {_index:{data:selRowIndex}});
					
						// "1-1" 또는 "2-1"번과 비교해서 중복인 경우 화면에 표시하지 않기 위해 첫행 또는 RM이 "2"번 (END 트렁크정보) 인 경우 트렁크정보 셋팅
						if(nullToEmpty(lnoData.rm) == "1" || nullToEmpty(lnoData.rm) == "2"){
							ntwkLineNm = nullToEmpty(lnoData.ntwkLineNm);
							eqpNm = nullToEmpty(lnoData.eqpNm);
							aportNm = nullToEmpty(lnoData.aportNm);
							bportNm = nullToEmpty(lnoData.bportNm);
						}
					}
					
					trkData = {};
					selRowIndex++;
				}
			}
		}
	}
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
//		console.log(response);
//		console.log(flag);
		if(flag == "getlnolistbytie"){
			cflineHideProgressBody();
			$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");			
    		if(response.list != null && response.list.length>0){
//    			var listData = [];
//    			for(var idx = 0 ; idx < response.list.length; idx++) {
//    				var lnoData = response.list[idx];
//    				lnoData["useTrkNtwkLineNm#0"] = nullToEmpty(response.list[idx].ntwkLineNm);
//    				lnoData["eqpNm#0"] = nullToEmpty(response.list[idx].omsEqpNm);
//    				lnoData["aportNm#0"] = nullToEmpty(response.list[idx].omsAportDescr);
//    				lnoData["bportNm#0"] = nullToEmpty(response.list[idx].omsBportDescr);
//    				listData.push(lnoData);
//    						
//    			}
//    			//pathList
//    			
//    	        $('#'+cnvtGridTeb1).alopexGrid("dataSet", listData);
    	        
    			if(omsLnoChkGbn == "WC") {
    				pathListSettingWidth(response.list, response.pathList);
    			} else {
    				pathListSetting(response.list, response.pathList);
    			}
    			
//    			var listData = [];
//    			for(var idx = 0 ; idx < response.list.length; idx++) {
//    				var trkData = response.list[idx];
//    				if(response.pathList != null && response.pathList.length>0){ 
//    					var idxSeq = 0;  // lnoData.lonSeq
//	    				for(var j = 0; j<response.pathList.length; j++){
//	    					var lnoData = response.pathList[j];
//	    					if(nullToEmpty(trkData.ordRow) != "" && nullToEmpty(trkData.ordRow) == nullToEmpty(lnoData.ordSeq)){
//		    					trkData["useTrkNtwkLineNm#" + idxSeq] = nullToEmpty(lnoData.ntwkLineNm);
//		    					trkData["useRingNtwkLineNm#" + idxSeq] = nullToEmpty(lnoData.rignNm);
//		    					trkData["eqpNm#" + idxSeq] = nullToEmpty(lnoData.eqpNm);
//		    					trkData["aportNm#" + idxSeq] = nullToEmpty(lnoData.aportNm);
//		    					trkData["bportNm#" + idxSeq] = nullToEmpty(lnoData.bportNm);
//		    					idxSeq++;
//	    					}
//	    				}
//    				}
//    				listData.push(trkData);
//    						
//    			} 
//    	        $('#'+cnvtGridTeb1).alopexGrid("dataSet", listData);
    	        
    		}else{
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    		}
		}
	
		if(flag == "getlnolistbylinenm"){
			cflineHideProgressBody();
			$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");	
    		if(response.list != null && response.list.length>0){
				
    			if(omsLnoChkGbn == "WC") {
    				pathListSettingWidth(response.list, response.pathList);
    			} else {
    				pathListSetting(response.list, response.pathList);
    			}

    		}else{
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    		}
		}
		
		if(flag == "getlnolistbyomspathnm"){
			cflineHideProgressBody();
			$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");			
    		if(response.list != null && response.list.length>0){   	        

    			if(omsLnoChkGbn == "WC") {
    				pathListSettingWidth(response.list, response.pathList);
    			} else {
    				pathListSetting(response.list, response.pathList);
    			}
    			
    		}else{
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    		}
		}

		if(flag == "getlnolistbyeqpportnm"){
			cflineHideProgressBody();
			$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");			
    		if(response.list != null && response.list.length>0){

    			if(omsLnoChkGbn == "WC") {
    				pathListSettingWidth(response.list, response.pathList);
    			} else {
    				pathListSetting(response.list, response.pathList);
    			}
    			
    		}else{
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    		}
		}

		if(flag == "getlnolistbytrunk"){
			cflineHideProgressBody();
			$('#'+cnvtGridTeb1).alopexGrid("dataEmpty");			
    		if(response.list != null && response.list.length>0){

    			var selRowIndex = 0;
    			
    			if(omsLnoChkGbn == "WC") {
        			for(var idx = 0 ; idx < response.list.length; idx++) {

        				if(response.pathList != null && response.pathList.length>0){    					
    	    				for(var j = 0; j<response.pathList.length; j++){

    	    					var trkData = response.list[idx];
    	    					var lnoData = response.pathList[j];
    	    					
    	    					if(nullToEmpty(trkData.ordRow) != "" && nullToEmpty(trkData.ordRow) == nullToEmpty(lnoData.ordSeq)){
				    				var addData = {
											 "useTrkNtwkLineNm" : nullToEmpty(lnoData.ntwkLineNm)
										   , "useRingNtwkLineNm"  : nullToEmpty(lnoData.rignNm)
										   , "useEqpNm" : nullToEmpty(lnoData.eqpNm)
										   , "useAportNm" : nullToEmpty(lnoData.aportNm)
									}
				    				$.extend(trkData, addData);
									$('#'+cnvtGridTeb1).alopexGrid("dataAdd", $.extend({}, trkData), {_index:{data:selRowIndex}});
									
									trkData = {};
									selRowIndex++;
    	    					}
    	    				}
        				}
        			}
    				
    			} else {
    				var listData = [];
        			for(var idx = 0 ; idx < response.list.length; idx++) {
        				var trkData = response.list[idx];
        				if(response.pathList != null && response.pathList.length>0){    					
    	    				for(var j = 0; j<response.pathList.length; j++){
    	    					var lnoData = response.pathList[j];
    	    					if(nullToEmpty(trkData.ordRow) != "" && nullToEmpty(trkData.ordRow) == nullToEmpty(lnoData.ordSeq)){
    		    					trkData["useTrkNtwkLineNm#" + nullToEmpty(lnoData.lonSeq)] = nullToEmpty(lnoData.ntwkLineNm);
    		    					trkData["useRingNtwkLineNm#" + nullToEmpty(lnoData.lonSeq)] = nullToEmpty(lnoData.rignNm);
    		    					trkData["eqpNm#" + nullToEmpty(lnoData.lonSeq)] = nullToEmpty(lnoData.eqpNm);
    		    					trkData["aportNm#" + nullToEmpty(lnoData.lonSeq)] = nullToEmpty(lnoData.aportNm);
    	    					}
    	    				}
        				}
        				listData.push(trkData);
        			} 
        	        $('#'+cnvtGridTeb1).alopexGrid("dataSet", listData);
    			}
    	        
    		}else{
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
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
    function failCallback(response, status, flag){

		if(flag == "getlnolistbytie"){
			cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		}
		if(flag == "getlnolistbyomspathnm"){
			cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
		if(flag == "getlnolistbylinenm"){
			cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		}
		if(flag == "getlnolistbyeqpportnm"){
			cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		}
		if(flag == "getlnolistbytrunk"){
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
    //Grid 초기화
    function getGrid(tabName, omsGbnVal) {
    	if(tabName == "TOP" || tabName == "WIDTH") {
    		$('#'+dataGridTeb1).alopexGrid({

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
    			height : 200,
    			columnMapping : columnMapping("data")
    		 });
    	}
    	if((tabName == "TOP" || tabName == "WIDTH") && omsGbnVal != 'E') {
    		$('#'+cnvtGridTeb1).alopexGrid({
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
    			height : 450,
    			columnMapping : columnMapping("cnvt")
    		 });

   		  	$('#'+cnvtGridTeb1).alopexGrid("columnFix", 1);
    	} 
    	if((tabName == "TOP" || tabName == "WIDTH") && omsGbnVal == 'E') {
    		$('#'+cnvtGridTeb1).alopexGrid({
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
    			height : 450,
    			columnMapping : columnMapping("eqp")
    		 });

   		  	$('#'+cnvtGridTeb1).alopexGrid("columnFix", 2);
    	} 
    	
    } 
    
    function replaceToEnter(value) {
    	var result = "";
    	if(value != null){
    		result = value.split("\n").join("").replace(/^\s+|\s+$/g,"");
    		//result = result.split("  ").join(" ").replace(/^\s+|\s+$/g,"");
    	}
    	return result;
    }
});