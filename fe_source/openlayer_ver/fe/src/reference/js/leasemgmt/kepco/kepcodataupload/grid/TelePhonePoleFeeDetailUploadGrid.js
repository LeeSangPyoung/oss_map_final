 /*
 * @author 김호연
 * @date 2016. 7. 25. 오후 4:47:00
 * @version 1.0
 */


function customTooltip(value,data,mapping){
	//
	
	var msg = value;
	//var sptemp = value.split('^');
	var sptemp = String(data._original[mapping.key]).split('^');
	//적용단가
	if(mapping.key === 'aplyUprc'){
		
		if (sptemp.length > 1)
			msg = '필수 입력항목입니다. 숫자만 가능 : ' + value;		
	}
	//전산화번호
	else if(mapping.key === 'kepcoIdxDrwNo'){
		if (sptemp.length > 1)
			msg = '8자리의 숫자, 문자만 가능 : ' + value;	
	}
	//사업자 코드
	else if(mapping.key === 'kepafBizrDivCd'){
		if (sptemp.length > 1)
			msg = '사업자 코드정보가 잘못 되었습니다 : ' + value;	
	}
	//용도 usgDivCdLstVal
	else if(mapping.key === 'usgDivCdLstVal'){
		if (sptemp.length > 1)
			msg = '10자리 이하의 숫자, 문자만 가능 : ' + value;	
	}
	//총조수 totCbcnt
	else if(mapping.key === 'totCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'totAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'aprvNormCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'aprvNormAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvWontCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvWontAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvWontAdalAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvNewBrchCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvNewBrchAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvNewWontAdalAmt1'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvHfcWontCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'hfcNapvCst'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'hfcNapvAddCst'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvCnntPlacCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvCnntCst'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvCnntAddCst'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvVlntrRptWontCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvVlntrRptWontAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvVlntrRptWontAdalAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvNewWontCbcnt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvNewWontAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	else if(mapping.key === 'napvNewWontAdalAmt'){
		if (sptemp.length > 1)
			msg = '필수 입력, 숫자만 가능 : ' + value;	
	}
	return msg;
};
function rtnValue(value, data, mapping){
	
	if(data._original === undefined){
		data._original = {};
	}
	
	data._original[mapping.key] = value;
	
	return value.replace('^','');
};
var KepcoGrid = (function($, Tango, _){
	var options = {};
options.defineExcelDataGrid = {

    		autoColumnIndex: true,
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		
			headerGroup: [
			    			{fromIndex:'aprvNormCbcnt', toIndex:'aprvNormAmt', title:"승인분"},
			    			{fromIndex:'napvWontCbcnt', toIndex:'napvNewWontAdalAmt', title:"미승인분"}
			    		],
			    		contextMenu : [
			    		              

			    		       		
			    		       	],

			    		       
    		columnMapping: [{
				key : 'kepcoTlplFeeSrno', align:'center',
				title : '순번',
				width: '90px'
			}, {
				key : 'kepcoIdxDrwNo', align:'center',
				title : '전산화번호',value : rtnValue,
				width: '90px'
			}, 
			 {
				key : 'kepafBizrDivCd', align:'center',
				title : '사업자코드',value : rtnValue,
				width: '90px'
			}, 
			{
				key : 'kepafBizrDivNm', align:'center',
				title : '업체명',value : rtnValue,
				width: '90px'
			}, {
				key : 'usgDivCdLstVal', align:'center',
				title : '용도',value : rtnValue,
				width: '90px'
			}, {
				key : 'aplyUprc', align:'right',
				title : '적용단가',value : rtnValue,
				width: '90px'
			}, {
				key : 'totCbcnt', align:'right',
				title : '총조수',value : rtnValue,
				width: '90px'
			}, {
				key : 'totAmt', align:'right',
				title : '총금액',value : rtnValue,
				width: '90px'				
			}, {
				key : 'aprvNormCbcnt', align:'right',
				title : '정상조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'aprvNormAmt', align:'right',
				title : '정상요금',value : rtnValue,
				width: '90px'				
			}
			
			, {
				key : 'napvWontCbcnt', align:'right',
				title : '무단조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvWontAmt', align:'right',
				title : '무단요금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvWontAdalAmt', align:'right',
				title : '무단추징금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewBrchCbcnt', align:'right',
				title : '신규위약조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewBrchAmt', align:'right',
				title : '신규위약요금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewWontAdalAmt1', align:'right',
				title : '신규무단추징금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvHfcWontCbcnt', align:'right',
				title : 'HFC무단조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'hfcNapvCst', align:'right',
				title : 'HFC무단요금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'hfcNapvAddCst', align:'right',
				title : 'HFC무단추징금	',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvCnntPlacCbcnt', align:'right',
				title : '접속개소조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvCnntCst', align:'right',
				title : '접속개소요금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvCnntAddCst', align:'right',
				title : '접속개소추징금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvVlntrRptWontCbcnt', align:'right',
				title : '자진신고무단조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvVlntrRptWontAmt', align:'right',
				title : '자진신고무단요금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvVlntrRptWontAdalAmt', align:'right',
				title : '자진신고무단추징금',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewWontCbcnt', align:'right',
				title : '신규무단조수',value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewWontAmt', align:'right',
				title : '신규무단요금',value : rtnValue,
				width: '90px'				
			}, 
			 {
				key : 'napvNewWontAdalAmt', align:'right',
				title : '신규무단추징금',value : rtnValue,
				width: '90px'				
			}, 
			{
				key : 'errorYN', align:'right',
				title : '오류여부', 
				width: '90px'			 	
			}],
			paging:{
				pagerSelect:false
			}
			,
    	};
	
		
		
options.defineErrorDataGrid =  {		
		
    		autoColumnIndex: true,
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		
    		
    		defaultColumnMapping:{
    			inlineStyle : {
    				background : function(value, data, mapping){
    					
    					if(mapping.key === 'kepcoTlplFeeSrno'|| data._original[mapping.key] === undefined){
    						return;
    					}
    					
    					if(String(data._original[mapping.key]).lastIndexOf('^') > -1){
    						return '#FF0000';
    					}
    					//if(data._original["kepafBizrDivCd"].lastIndexOf('^') > -1)
    					//	return '#FF0000';
    				}
    			}
    		},
    		
    		
			headerGroup: [
			    			{fromIndex:'aprvNormCbcnt', toIndex:'aprvNormAmt', title:"승인분"},
			    			{fromIndex:'napvWontCbcnt', toIndex:'napvNewWontAdalAmt', title:"미승인분"}
			    		],
			    		contextMenu : [
			    		               {
			    		                   title: "확대보기" ,
			    		                   processor: function(data, $cell, grid) {
			    		                    $(grid.root).alopexGrid( "enlargeStart" );
			    		                   },
			    		                   use: function(data, $cell, grid) {
			    		                    return true;
			    		                   }
			    		                  }

			    		       		
			    		       	],


    		columnMapping: [{
				key : 'kepcoTlplFeeSrno', align:'center',
				title : '순번',
				width: '90px'
			}, {
				key : 'kepcoIdxDrwNo', align:'center',
				title : '전산화번호',tooltip : customTooltip, value : rtnValue,
				width: '90px'
			}, 
			 {
				key : 'kepafBizrDivCd', align:'center',
				title : '사업자코드',tooltip : customTooltip, value : rtnValue,
				width: '90px'
			}, 
			{
				key : 'kepafBizrDivNm', align:'center',
				title : '업체명',tooltip : customTooltip, value : rtnValue,
				width: '90px'
			}, {
				key : 'usgDivCdLstVal', align:'center',
				title : '용도',tooltip : customTooltip, value : rtnValue,
				width: '90px'
			}, {
				key : 'aplyUprc', align:'right',
				title : '적용단가',tooltip : customTooltip, value : rtnValue,
				width: '90px'
			}, {
				key : 'totCbcnt', align:'right',
				title : '총조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'
			}, {
				key : 'totAmt', align:'right',
				title : '총금액',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'aprvNormCbcnt', align:'right',
				title : '정상조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'aprvNormAmt', align:'right',
				title : '정상요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}
			
			, {
				key : 'napvWontCbcnt', align:'right',
				title : '무단조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvWontAmt', align:'right',
				title : '무단요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvWontAdalAmt', align:'right',
				title : '무단추징금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewBrchCbcnt', align:'right',
				title : '신규위약조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewBrchAmt', align:'right',
				title : '신규위약요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewWontAdalAmt1', align:'right',
				title : '신규무단추징금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvHfcWontCbcnt', align:'right',
				title : 'HFC무단조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'hfcNapvCst', align:'right',
				title : 'HFC무단요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'hfcNapvAddCst', align:'right',
				title : 'HFC무단추징금	',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvCnntPlacCbcnt', align:'right',
				title : '접속개소조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvCnntCst', align:'right',
				title : '접속개소요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvCnntAddCst', align:'right',
				title : '접속개소추징금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvVlntrRptWontCbcnt', align:'right',
				title : '자진신고무단조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvVlntrRptWontAmt', align:'right',
				title : '자진신고무단요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvVlntrRptWontAdalAmt', align:'right',
				title : '자진신고무단추징금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewWontCbcnt', align:'right',
				title : '신규무단조수',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, {
				key : 'napvNewWontAmt', align:'right',
				title : '신규무단요금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, 
			 {
				key : 'napvNewWontAdalAmt', align:'right',
				title : '신규무단추징금',tooltip : customTooltip, value : rtnValue,
				width: '90px'				
			}, 
			{
				key : 'errorYN', align:'right',
				title : '오류여부',
				width: '90px'			 	
			}],

		
    	};
return options;
}(jQuery, Tango, _));

/*
kepcoIdxDrwNo
chrDmdYm	             과금청구년월
skAfcoDivCd	             sk계열사구분코드
kepboCd	             사업소코드[9999a]
kepcoTlplFeeSrno	     한전전주요금일련번호(순번)
kepcoIdxNo	             전산화번호(관리구)
kepcoDrawNo	             전산화번호(번호)
kepafBizrDivCd	     사업자[st000:skt/sk000:skn]
usgDivCdLstVal	     용도구분코드목록값
aplyUprc	             적용단가
totCbcnt	             총조수
totAmt	                     총금액
aprvNormCbcnt	             승인정상조수
aprvNormAmt	             승인정상금액
napvWontCbcnt              미승인무단조수
napvWontAmt	             미승인무단금액
napvWontAdalAmt	     미승인무단추징금액
napvNewBrchCbcnt	     미승인신규위약조수
napvNewBrchAmt	     미승인신규위약금액
napvNewWontAdalAmt1	     미승인분-신규무단추징금[1]
frstRegDate	             최초등록일자d
frstRegUserId	     최초등록사용자id
napvHfcWontCbcnt	     미승인hfc무단조수
hfcNapvCst	             hfc미승인비용
hfcNapvAddCst	     hfc미승인추가비용
napvCnntPlacCbcnt	     미승인접속개소조수
napvCnntCst	             미승인접속비용
napvCnntAddCst	     미승인접속추가비용
napvVlntrRptWontCbcnt    미승인자진신고무단조수
napvVlntrRptWontAmt	     미승인자진신고무단금액
napvVlntrRptWontAdalAmt	미승인자진신고무단추징금액
napvNewWontCbcnt	        미승인신규무단조수
napvNewWontAmt	        미승인신규무단금액
napvNewWontAdalAmt	        미승인신규무단추징금액
*/