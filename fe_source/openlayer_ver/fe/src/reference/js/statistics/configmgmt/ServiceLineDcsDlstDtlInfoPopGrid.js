/**
 * 
 */
var gridDcsDlstPop = 'popDcsDlstInfoListGrid';
// 그리드에 셋팅될 칼럼 concat으로 배열에 값을 추가해주어 
// 가변 그리드를 만든다. 조회 한후에는 초기화해준다.

// 수용회선수 (기지국 제외)
var mappingPopAll = function(){
	var returnData = [
	              	{key : 'eqpNm'	       			 ,title : "DCS"			,align:'left', width:'120px'}
	            	, {key : 'svlnNo'	             ,title : cflineMsgArray['lineNo'] /*  회선번호 */ ,align:'left', width:'100px'}	
	            	, {key : 'lineNm'	             ,title : cflineMsgArray['lnNm'] /*  회선명 */ ,align:'left', width:'150px'}	
	            	, {key : 'uprMtsoNm'	             ,title : cflineMsgArray['upperTransOffice'] /*  상위국 전송실 */ ,align:'left', width:'150px'}	
	            	, {key : 'uprSystmNm'	             ,title : cflineMsgArray['upperSystemName'] /*  상위국 시스템 */ ,align:'left', width:'150px'}	
	            	, {key : 'lowMtsoNm'	             ,title : cflineMsgArray['lowerTransOffice'] /*  하위국 전송실 */ ,align:'left', width:'150px'}	
	            	, {key : 'lowSystmNm'	             ,title : cflineMsgArray['lowSystemName'] /*  하위국 전송실 */ ,align:'left', width:'150px'}
	];
	return returnData;
}



// 수용회선수 (기지국)
var mappingPopBts = function(){
	var returnData = [
	              	{key : 'eqpNm'	       			 ,title : "DCS"			,align:'left', width:'120px'}
	            	, {key : 'svlnNo'	             ,title : cflineMsgArray['lineNo'] /*  회선번호 */ ,align:'left', width:'100px'}	
	            	, {key : 'lineNm'	             ,title : cflineMsgArray['lnNm'] /*  회선명 */ ,align:'left', width:'150px'}	
	            	, {key : 'svlnStatNm'	             ,title : cflineMsgArray['lineStatus'] /*  회선상태 */ ,align:'left', width:'100px'}
	            	, {key : 'uprMtsoNm'	             ,title : cflineMsgArray['upperTransOffice'] /*  상위국 전송실 */ ,align:'left', width:'150px'}	
	            	, {key : 'uprSystmNm'	             ,title : cflineMsgArray['upperSystemName'] /*  상위국 시스템 */ ,align:'left', width:'150px'}	
	            	, {key : 'lowMtsoNm'	             ,title : cflineMsgArray['lowerTransOffice'] /*  하위국 전송실 */ ,align:'left', width:'150px'}	
	            	, {key : 'lowSystmNm'	             ,title : cflineMsgArray['lowSystemName'] /*  하위국 시스템  */ ,align:'left', width:'150px'}
	            	, {key : 'cuidVal'	             ,title : "CUID" ,align:'left', width:'60px'}	
	            	, {key : 'bmtsoMtsoNm'	             ,title : cflineMsgArray['btsName'] /*  기지국사  */ ,align:'left', width:'150px'}
	            	, {key : 'cmsSrvcTypNm'	             ,title : "CUID " + cflineMsgArray['service'] /*  CUID 서비스 */ ,align:'left', width:'80px'}		
	] ; 
	return returnData;
}

// 나머지
var mappingPopCuid = function( ){
	var returnData =  [
	               	{key : 'eqpNm'	       			 ,title : "DCS"			,align:'left', width:'120px'}
	            	, {key : 'btsName'	             ,title : cflineMsgArray['btsName'] /*  기지국사 */ ,align:'left', width:'200px'}	
	            	, {key : 'svlnTypNm'	             ,title : cflineMsgArray['service'] /*  서비스 */ ,align:'left', width:'80px'}	
	            	, {key : 'impoOrgYn'	             ,title : cflineMsgArray['seriousSmtsoYn'] /*  중요국소유무 */ ,align:'left', width:'80px'}	
	            	, {key : 'cuidVal'	             ,title : "CUID" ,align:'left', width:'60px'}	
	            	, {key : 'mscId'	             ,title : "MSC" ,align:'left', width:'40px'}	
	            	, {key : 'bscId'	             ,title : "BSC" ,align:'left', width:'40px'}	
	            	, {key : 'btsId'	             ,title : "BTS" ,align:'left', width:'40px'}	
	            	, {key : 'bldAddr'	             ,title : cflineMsgArray['address'] /*  주소 */ ,align:'left', width:'300px'}	
	            	, {key : 'svlnCnt'	             ,title : cflineMsgArray['lineCount'] /*  회선수 */ ,align:'left', width:'60px'}	
	];	
	return returnData;
}

//SIG/ONM - 2021.03.31 추가
var mappingPopSigOnm = function( ){
	var returnData =  [
	                 {key : 'eqpNm'	       			 ,title : "DCS"			,align:'left', width:'80px'}
	            	, {key : 'btsName'	             ,title : cflineMsgArray['btsName'] /*  기지국사 */ ,align:'left', width:'200px'}	
	            	, {key : 'cuidVal'	             ,title : "CUID" ,align:'left', width:'60px'}	
	            	, {key : 'mscId'	             ,title : "MSC" ,align:'left', width:'40px'}	
	            	, {key : 'bscId'	             ,title : "BSC" ,align:'left', width:'40px'}	
	            	, {key : 'btsId'	             ,title : "BTS" ,align:'left', width:'40px'}	
	            	, {key : 'bldAddr'	             ,title : cflineMsgArray['address'] /*  주소 */ ,align:'left', width:'300px'}	
	            	, {key : 'success'	             ,title : "이원화" /*  주소 */ ,align:'left', width:'60px'}	
	            	, {key : 'lineCnt'	             ,title : cflineMsgArray['lineCount'] /*  회선수 */ ,align:'left', width:'60px'}	
	            	, {key : 'lineNm'	             ,title : "회선명" /*  회선수 */ ,align:'left', width:'300px'}	
	];	
	return returnData;
}