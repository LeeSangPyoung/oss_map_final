/**
 * OpenTaskTieGridList.js
 *
 * @author Administrator
 * @date 2017. 8. 02.
 * @version 1.0
 */
var gridTiePop = 'tieListPopGrid';
// 그리드에 셋팅될 칼럼 concat으로 배열에 값을 추가해주어 
// 가변 그리드를 만든다. 조회 한후에는 초기화해준다.

// 감설 Tie 검색 (기지국, 교환기, 상호접속)
var mappingAdTie = function(){
	var returnData = [ { selectorColumn : true, width : '50px' }
	  , {key : 'lineNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
	  , {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}		
	  , {key : 'tie'		, hidden:true}
	  
	  /* 기지국 감설 TIE 정보 시작 	*/
 	  , {key : 'tieOne'		, hidden:true}
 	  , {key : 'tieTwo'		, hidden:true}
 	  , {key : 'mscId'		, hidden:true}
 	  , {key : 'mscName'		, hidden:true}
 	  , {key : 'bscId'		, hidden:true}
 	  , {key : 'cinu'			, hidden:true}
 	  , {key : 'aep'			, hidden:true}
 	  , {key : 'portNo'		, hidden:true}
 	  , {key : 'bip'			, hidden:true}
 	  , {key : 'bipP'			, hidden:true}
 	  , {key : 'bts'			, hidden:true}
 	  , {key : 'btsId'		, hidden:true}
 	  , {key : 'uprMtsoId'	, hidden:true}
 	  , {key : 'lowMtsoId'	, hidden:true}
 	  , {key : 'lowMtsoIdNm'	, hidden:true}					            	  
	  /* 기지국 감설 TIE 정보 끝  	*/		            			            	  
	  /* 교환기, 상호접속  감설 TIE 정보 시작 	*/
 	  , {key : 'ogTieOne'		, hidden:true}
 	  , {key : 'ogTieTwo'		, hidden:true}
 	  , {key : 'ogMscId'		, hidden:true}
 	  , {key : 'ogMscName'		, hidden:true}
 	  , {key : 'ogMp'		, hidden:true}
 	  , {key : 'ogPp'			, hidden:true}
 	  , {key : 'ogCard'			, hidden:true}
 	  , {key : 'ogLink'		, hidden:true}	

 	  , {key : 'icTieOne'		, hidden:true}
 	  , {key : 'icTieTwo'		, hidden:true}
 	  , {key : 'icMscId'		, hidden:true}
 	  , {key : 'icMscName'		, hidden:true}
 	  , {key : 'icMp'		, hidden:true}
 	  , {key : 'icPp'			, hidden:true}
 	  , {key : 'icCard'			, hidden:true}
 	  , {key : 'icLink'		, hidden:true}	
	  /* 교환기, 상호접속 감설 TIE 정보 끝  	*/	   
	];
	gubun = "001"
	lineTieComp = "comp";
	return returnData;
}

//기지국, 교환기간  수변 감설 Tie 검색 
var mappingAdTieAd = function(){
	var returnData = [ { selectorColumn : true, width : '50px' }
	, {key : 'adLineNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
	, {key : 'adLineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}	
	  /* 감설 TIE 정보 시작 	*/
	  , {key : 'adTie'		, hidden:true}
 	  , {key : 'adTieOne'		, hidden:true}
 	  , {key : 'adTieTwo'		, hidden:true}
 	 /* 감설 TIE 정보 시작 	*/
 	 /* 기지국 감설 TIE 정보 시작 	*/
 	  , {key : 'adMscId'		, hidden:true}
 	  , {key : 'adMscName'		, hidden:true}
 	  , {key : 'adBscId'		, hidden:true}
 	  , {key : 'adCinu'			, hidden:true}
 	  , {key : 'adAep'			, hidden:true}
 	  , {key : 'adPortNo'		, hidden:true}
 	  , {key : 'adBip'			, hidden:true}
 	  , {key : 'adBipP'			, hidden:true}
 	  , {key : 'adBts'			, hidden:true}
 	  , {key : 'adBtsId'		, hidden:true}
 	  , {key : 'adUprMtsoId'	, hidden:true}
 	  , {key : 'adLowMtsoId'	, hidden:true}
 	  , {key : 'adLowMtsoIdNm'	, hidden:true}					            	  
	  /* 기지국 감설 TIE 정보 끝  	*/	
 	  
	  /* 교환기, 상호접속  감설 TIE 정보 시작 	*/
 	  , {key : 'adOgTieOne'		, hidden:true}
 	  , {key : 'adOgTieTwo'		, hidden:true}
 	  , {key : 'adOgMscId'		, hidden:true}
 	  , {key : 'adOgMscName'		, hidden:true}
 	  , {key : 'adOgMp'		, hidden:true}
 	  , {key : 'adOgPp'			, hidden:true}
 	  , {key : 'adOgCard'			, hidden:true}
 	  , {key : 'adOgLink'		, hidden:true}	

 	  , {key : 'adIcTieOne'		, hidden:true}
 	  , {key : 'adIcTieTwo'		, hidden:true}
 	  , {key : 'adIcMscId'		, hidden:true}
 	  , {key : 'adIcMscName'		, hidden:true}
 	  , {key : 'adIcMp'		, hidden:true}
 	  , {key : 'adIcPp'			, hidden:true}
 	  , {key : 'adIcCard'			, hidden:true}
 	  , {key : 'adIcLink'		, hidden:true}	
	  /* 교환기, 상호접속 감설 TIE 정보 끝  	*/	
	];
	gubun = "001"
	lineTieComp = "comp";
	return returnData;
}



//기지국간 감설 Tie 검색 아닌경우
var mappingBmtsoTie = function(){
	var returnData = [ { selectorColumn : true, width : '50px' }
	    , {key : 'sysName'	              	,title : 'MSC NAME'			,align:'center', width: '120px'}
	    , {key : 'bscId'	              	,title : 'BSC'                 ,align:'center'  , width: '60px'}
	    , {key : 'bts'	            ,title : 'BTS'			,align:'center', width: '60px'}
	    , {key : 'cinu'	            ,title : 'CINU'			,align:'center', width: '60px'}
	    , {key : 'aep'	            ,title : 'AEP83'			,align:'center', width: '60px'}
	    , {key : 'portNo'	      		,title : 'PORT'       		,align:'center', width: '60px'}
	    , {key : 'bip'	    		,title : 'BIP'               	,align:'center', width: '60px'}
	    , {key : 'bipP'	          	,title : 'BIP_P'             ,align:'center', width: '60px'}
	    , {key : 'tieOne'	      		,title : 'TIE1'         		,align:'center', width: '180px'}
	    , {key : 'tieTwo'	    ,title : 'TIE2'			,align:'center', width: '180px'}		            	  
  	  /* TIE 정보 시작 	*/
	    , {key : 'tie'			, hidden:true}
		, {key : 'aep'	        , hidden: true}
		, {key : 'btsId'	        , hidden: true}
		, {key : 'btsName'	    , hidden: true}
		, {key : 'coreroomId'	    , hidden: true}
		, {key : 'cuid'	        , hidden: true}
		, {key : 'idx'	        , hidden: true}
		, {key : 'mscId'	        , hidden: true}
		, {key : 'mscName'	        , hidden: true}
		, {key : 'sysId'	        , hidden: true}
		, {key : 'sysType'	    , hidden: true}
		, {key : 'systemId'	    , hidden: true}
		, {key : 'transroomId'	, hidden: true} 
  	  /* TIE 정보 끝 	*/
	] ; 
	gubun = "002"
	btsTieComp = "comp";
	return returnData;
}

//교환기간 OG Tie 검색 
var mappingExchrTieOg = function( ){
	var returnData =  [ { selectorColumn : true, width : '50px' }
    , {key : 'ogSysName'	              	,title : 'MSC NAME'			,align:'center', width: '140px'}
    , {key : 'ogMp'	              	,title : 'MP'                 ,align:'center'  , width: '80px'}
    , {key : 'ogPp'	            ,title : 'PP'			,align:'center', width: '80px'}
    , {key : 'ogCard'	            ,title : 'CARD'			,align:'center', width: '80px'}
    , {key : 'ogLink'	            ,title : 'LINK'			,align:'center', width: '80px'}
    , {key : 'ogTieOne'	      		,title : 'TIE1'         		,align:'center', width: '140px'}
    , {key : 'ogTieTwo'	    ,title : 'TIE2'			,align:'center', width: '130px'}	
    /* OG TIE 정보 시작 	*/
	, {key : 'ogTie'	        , hidden: true}
	, {key : 'ogSysType'	        , hidden: true}
	, {key : 'ogSysId'	        , hidden: true}
	, {key : 'ogMscId'	        , hidden: true}
	, {key : 'ogTransroomId'	, hidden: true} 
	, {key : 'ogCoreroomId'	    , hidden: true}
	, {key : 'ogSystemId'	        , hidden: true}
	, {key : 'ogRtename'	        , hidden: true}
	, {key : 'ogRte'	        , hidden: true}
	/* OG TIE 정보 끝 	*/
	];	
	gubun = "003"
	tieComp = "comp";
	return returnData;
}

 		            	  


//교환기간 IC Tie 검색
var mappingExchrTieIc = function( ){
	var returnData =  [ { selectorColumn : true, width : '50px' }
	, {key : 'icSysName'	              	,title : 'MSC NAME'			,align:'center', width: '140px'}
	, {key : 'icMp'	              	,title : 'MP'                 ,align:'center'  , width: '80px'}
	, {key : 'icPp'	            ,title : 'PP'			,align:'center', width: '80px'}
	, {key : 'icCard'	            ,title : 'CARD'			,align:'center', width: '80px'}
	, {key : 'icLink'	            ,title : 'LINK'			,align:'center', width: '80px'}
	, {key : 'icTieOne'	      		,title : 'TIE1'         		,align:'center', width: '140px'}
	, {key : 'icTieTwo'	    ,title : 'TIE2'			,align:'center', width: '130px'}	
	/* IC TIE 정보 시작 	*/
	, {key : 'icTie'	        , hidden: true}
	, {key : 'icSysType'	        , hidden: true}
	, {key : 'icSysId'	        , hidden: true}
	, {key : 'icMscId'	        , hidden: true}
	, {key : 'icTransroomId'	, hidden: true} 
	, {key : 'icCoreroomId'	    , hidden: true}
	, {key : 'icSystemId'	        , hidden: true}
	, {key : 'icRtename'	        , hidden: true}
	, {key : 'icRte'	        , hidden: true}
	/* IC TIE 정보 끝 	*/  
	];	
	gubun = "003"
	tieComp = "comp";
	return returnData;
}

//상호접속간 Tie 검색
var mappingTrdCnntTie = function( ){
	var returnData =  [ { selectorColumn : true, width : '50px' }
  , {key : 'sysName'	              	,title : 'MSC NAME'			,align:'center', width: '140px'}
  , {key : 'mp'	              	,title : 'MP'                 ,align:'center'  , width: '80px'}
  , {key : 'pp'	            ,title : 'PP'			,align:'center', width: '80px'}
  , {key : 'card'	            ,title : 'CARD'			,align:'center', width: '80px'}
  , {key : 'link'	            ,title : 'LINK'			,align:'center', width: '80px'}
  , {key : 'tieOne'	      		,title : 'TIE1'         		,align:'center', width: '140px'}
  , {key : 'tieTwo'	    ,title : 'TIE2'			,align:'center', width: '130px'}	
  /*  TIE 정보 시작 	*/
  , {key : 'tie'			, hidden:true}
  , {key : 'sysType'	        , hidden: true}
  , {key : 'sysId'	        , hidden: true}
  , {key : 'mscId'	        , hidden: true}
  , {key : 'transroomId'	, hidden: true} 
  , {key : 'coreroomId'	    , hidden: true}
  , {key : 'systemId'	        , hidden: true}
  , {key : 'rtename'	        , hidden: true}
  , {key : 'rte'	        , hidden: true}
  /* TIE 정보 끝 	*/	  
	];	
	gubun = "003"
	tieComp = "comp";
	return returnData;
}

