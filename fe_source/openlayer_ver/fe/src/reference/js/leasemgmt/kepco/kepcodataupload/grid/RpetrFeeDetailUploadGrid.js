 /*
 * @author 김호연
 * @date 2016. 8. 18. 오후 4:44:00
 * @version 1.0
 */
function customTooltip(value,data,mapping){
		//
		
		var msg = value;
		//var sptemp = value.split('^');
		var sptemp = String(data._original[mapping.key]).split('^');
		//적용단가
		if(mapping.key === 'kepboCd'){
			
			if (sptemp.length > 1)
				msg = '필수 입력항목입니다. 4자리 숫자만 가능 : ' + value;		
		}
		//전산화번호
		else if(mapping.key === 'aprvTotQuty'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		//사업자 코드
		else if(mapping.key === 'aprvTotAmt'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		//용도 usgDivCdLstVal
		else if(mapping.key === 'aprvFctTlplQuty'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		//총조수 totCbcnt
		else if(mapping.key === 'aprvFctTlplAmt'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;		
		}
		else if(mapping.key === 'aprvFctMwreQuty'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		else if(mapping.key === 'aprvFctMwreAmt'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		else if(mapping.key === 'napvFctWontUseQuty'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;		
		}
		else if(mapping.key === 'napvFctWontUseAmt'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;		
		}
		else if(mapping.key === 'napvFctBrchAmtQuty'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		else if(mapping.key === 'napvFctBrchAmt'){
			if (sptemp.length > 1)
				msg = '숫자만 가능 : ' + value;	
		}
		
		return msg;
	};
	function rtnValue(value, data, mapping){
		
		if(data._original === undefined){
			data._original = {};
		}
		
		data._original[mapping.key] = value;
		//return value.replace('^','');
		var sptemp = String(value).split('^');
		if(sptemp.length > 1)
			return value.replace('^','');
		else
			return value;
	};
var KepcoGrid = (function($, Tango, _){
	var options = {};
	
	
	options.defineExcelDataGrid = {
			autoColumnIndex: true,
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		//rowClickSelect:true,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		cellInlineEdit: true,
    		cellSelectable: true,
    		
    		defaultColumnMapping:{
    			inlineStyle : {
    				background : function(value, data, mapping){
    					
    					if(mapping.key === 'kepcoTlplFeeSrno'|| data._original[mapping.key] === undefined){
    						return;
    					}
    					
    					if(String(data._original[mapping.key]).lastIndexOf('^') > -1){
    						return '#FF0000';
    					}
    				}
    			}
    		},
	    headerGroup: [
		    			{fromIndex:'totFctTlplQuty', toIndex:'napvFctBrchAmt', title:"과금분"},
		    			{fromIndex:'totFctTlplQuty', toIndex:'aprvFctMwreAmt', title:"승인설비"},
		    			{fromIndex:'napvFctWontUseQuty', toIndex:'napvFctBrchAmt', title:"미승인설비"},
		    			{fromIndex:'totFctTlplQuty', toIndex:'totFctTlplAmt', title:"소계"},
		    			{fromIndex:'aprvFctTlplQuty', toIndex:'aprvFctTlplAmt', title:"전주부착형"},
		    			{fromIndex:'aprvFctMwreQuty', toIndex:'aprvFctMwreAmt', title:"조가선부착형"},
		    			{fromIndex:'napvFctWontUseQuty', toIndex:'napvFctWontUseAmt', title:"무단사용요금"},
		    			{fromIndex:'napvFctBrchAmtQuty', toIndex:'napvFctBrchAmt', title:"위약추징금"}
		    			
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
			key : 'check', align:'center',
			width: '50px',
			selectorColumn:true
		}, {
			key : 'chrDmdYm', align:'center',
			title : '과금청구월',
			width: '90px'
		}, {
			key : 'lesBizrId', align:'center',
			title : '사업자코드',
			width: '90px'
		}, {
			key : 'kepCoMgt', align:'center',
			title : '관리본부',
			width: '90px'
		}, {
			key : 'kepboHdNm', align:'right',
			title : '한전본부',
			width: '90px'
		}, {
			key : 'kepboCdNm', align:'right',
			title : '한전지점명',
			width: '90px'
		}, {
			key : 'kepboCd', align:'right',
			title : '한전지점코드',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		},
		 {
			key : 'aprvTotQuty', align:'right',
			title : '수량(EA)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'aprvTotAmt', align:'right',
			title : '금액(원)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		},
		{
			key : 'aprvFctTlplQuty', align:'right',
			title : '수량(EA)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'aprvFctTlplAmt', align:'right',
			title : '금액(원)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}
		
		, {
			key : 'aprvFctMwreQuty', align:'right',
			title : '수량(EA)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'aprvFctMwreAmt', align:'right',
			title : '금액(원)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'napvFctWontUseQuty', align:'right',
			title : '수량(EA)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'napvFctWontUseAmt', align:'right',
			title : '금액(원)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'napvFctBrchAmtQuty', align:'right',
			title : '수량(EA)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		}, {
			key : 'napvFctBrchAmt', align:'right',
			title : '금액(원)',tooltip : customTooltip, value : rtnValue,
			width: '90px'				
		},
		{
			key : 'errorYN', align:'right',
			title : '오류여부',
			width: '90px'			 	
		},
		{
			key : 'skAfcoDivCd', align:'right',
			title : '계열사',
			width:'100px'			 	
		}]
    		
};
	
	return options;
}(jQuery, Tango, _));
	
	
	
	
	
	
	
	
	
	