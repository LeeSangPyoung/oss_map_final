/**
 * TelePhonePoleFeeDetailGrdUploadGrid
 * 요금내역 Excel Upload(지중) DataGrid정의
 *
 * @author P101670
 * @date 2016. 11. 16. 오전 09:30:00
 * @version 1.0
 */
var TelePhonePoleFeeDetailGrdUploadGrid = (function($, Tango, _){
	
	var options = {};
	
	function validateCell(value, data, mapping, type){
		
		var rStr = '';
		
		if(mapping.key === 'uladItmNm2'){
			//순번 : 숫자만 가능
			if(isNaN(value)){
				if(type === 'tooltip'){
					rStr = '숫자만 가능';
					return rStr;
				}else{
					rStr = '#FF0000'
					return rStr;
				}
			}
		}
		
		
		if(mapping.key == 'uladItmNm3'){
			//사업자
			if(value != 'SK000' && value != 'ST000' && value != 'SB000'
				&& value != 'HR000' && value != 'DN000' && value != 'ON000'){
				if(type == 'tooltip'){
					rStr = '다음 코드만 가능합니다.';
					rStr += '\n';
					rStr += 'SK000 / ST000 / SB000 / HR000 / DN000 / ON000';
					return rStr;
				}else{
					rStr = '#FF0000'
					return rStr;
				}
			}
		}
		
		
		if(mapping.key == 'uladItmNm5'||mapping.key == 'uladItmNm7'){
			//시점전산화번호, 종점전산화번호 : 8자리의 숫자, 문자만 가능
			var reg = /^\w{8}$/;
			
			if(!reg.test(value)){
				
				if(type == 'tooltip'){
					rStr = '8자리의 숫자, 문자만 가능';
					return rStr;
				}else{
					rStr = '#FF0000'
					return rStr;
				}
			}
		}
		
		if(mapping.key == 'uladItmNm6'||mapping.key == 'uladItmNm8'){
			var reg = /^\w{1}$/;
			
			if(value != undefined){
				if(!reg.test(value)){
					
					if(type == 'tooltip'){
						rStr = '1자리 문자만 가능';
						return rStr;
					}else{
						rStr = '#FF0000'
						return rStr;
					}
				}
			}
		}
		
		if(mapping.key == 'uladItmNm15' || mapping.key == 'uladItmNm16'){
			//설치일자 : 'YYYYMMDD'
			var reg = /^\d{8}$/;
			
			var msg = '날짜 형식 오류이거나 존재하지 않는 일자입니다.';
			msg += '\n';
			msg += '[날짜 형식 : YYYYMMDD]';
			
			if(value != undefined){
				if(!reg.test(value)){
					if(type == 'tooltip'){
						rStr = msg;
						return rStr;
					}else{
						rStr = '#FF0000'
						return rStr;
					}
				}
			
				var yyyy = parseInt(value.substr(0, 4));
				var mm = parseInt(value.substr(4, 2), 10) -1;
				var dd = parseInt(value.substr(6, 2), 10);
				var end = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
				
				if(yyyy % 4 == 0 && yyyy % 100 !=0 || yyyy % 400 == 0){
					end[1] = 29;
				}
				
				if(!(dd >= 1 && dd <= end[mm])){
					if(type == 'tooltip'){
						rStr = msg;
						return rStr;
					}else{
						rStr = '#FF0000'
						return rStr;
					}
				}
			}
		}
		
		
		if(mapping.key == 'uladItmNm17' || mapping.key == 'uladItmNm18'){
			//경간, 실측경간: 숫자만 가능
			var reg = /^[0-9](\.?\d*)*$/;
			if(value != undefined){
				if(!reg.test(value)){
					if(type == 'tooltip'){
						rStr = '숫자만 가능';
						return rStr;
					}else{
						rStr = '#FF0000'
						return rStr;
					}
				}
			}	
		}
		
		
		
		if(mapping.key == 'uladItmNm19'){
			//적용단가: 숫자만 가능
			var reg = /^[0-9]*$/;
			if(value != undefined){
				if(!reg.test(value)){
					if(type == 'tooltip'){
						rStr = '숫자만 가능';
						return rStr;
					}else{
						rStr = '#FF0000'
						return rStr;
					}
				}
			}	
		}
		
		return true;
	}
	
	
	// 입력된 문자열의 Byte를 반환
	function getByteLengh(s) {
    	if(s == null || s.length == 0) return 0;

    	var size = 0;
    	for(var i=0; i < s.length; i++){
    		size += charByteSize(s.charAt(i));
    	}

    	return size;
    }
	
	 function charByteSize(ch){
    	if(ch == null || ch.length == 0) return 0;

    	var charCode = ch.charCodeAt(0);

    	if(charCode <= 0x00007F){
    		return 1;
    	}else if(charCode <= 0x0007FF){
    		return 2;
    	}else if(charCode <= 0x00FFFF){
    		return 3;
    	}else{
    		return 4;
    	}
    }
	
	
	
	function tooltipText(value, data, mapping){
		
		var validateCellValue = validateCell(value, data, mapping, 'tooltip');
		
		if(validateCellValue !== true){
			return validateCellValue;
		}
		
		return false;
	}
	
	options.defineExcelDataGrid = {
			autoColumnIndex : true,
			cellSelectable : true,
			rowClickSelect : false,
			rowSingleSelect : false,
			rowSingleSelectAllowUnselect : false,
			defaultColumnMapping : {
				align : 'center',
				width : '90px',
				sorting : false
			},
			paging: {
		      	pagerSelect: false
			},
			columnMapping : [{key : 'uladItmNm1', title : "엑셀 행번호"},
			                {key : 'uladItmNm2', title : '순번'},
			                {key : 'uladItmNm3', title : '사업자코드'},
			                {key : 'uladItmNm4', title : '업체명'},
			                {key : 'uladItmNm5', title : '시점전산화번호'},
			                {key : 'uladItmNm6',  title : '시점설비'},
			                {key : 'uladItmNm7',  title : '종점전산화번호'},
			                {key : 'uladItmNm8',  title : '종점설비'},
			                {key : 'uladItmNm9',  title : '설비종류'},
			                {key : 'uladItmNm10',  title : '임대기준'},
			                {key : 'uladItmNm11', title : '관로규격'},
			                {key : 'uladItmNm12', title : '내관규격'},
			                {key : 'uladItmNm13', title : '통신선용도'},
			                {key : 'uladItmNm14', title : '승인구분'},
			                {key : 'uladItmNm15', title : '요금시작일'},
			                {key : 'uladItmNm16', title : '요금종료일'},
			                {key : 'uladItmNm17', title : '경간'},
			                {key : 'uladItmNm18', title : '실측경간'},
			                {key : 'uladItmNm19', title : '적용단가'},
			                {key : 'datErrYn', title : '오류메시지', hidden: true}]
			
	};
	
	options.defineExcelErrorDataGrid = {
			autoColumnIndex : true,
			cellSelectable : true,
			rowClickSelect : false,
			rowSingleSelect : false,
			rowSingleSelectAllowUnselect : false,
			defaultColumnMapping : {
				align : 'center',
				width : '90px',
				sorting : false,
				inlineStyle: {
					background: function(value, data, mapping){
						
						if(data['datErrYn'] !== 'E'){
							return;
						}
						
						var validateCellValue = validateCell(value, data, mapping, 'bg');
						
						if(validateCellValue !== true){
							return validateCellValue;
						}
					}
				}
			},
			paging: {
		      	pagerSelect: false
			},
			columnMapping : [{key : 'uladItmNm1', title : "엑셀 행번호"},
			                {key : 'uladItmNm2', title : '순번', tooltip : tooltipText},
			                {key : 'uladItmNm3', title : '사업자코드', tooltip : tooltipText},
			                {key : 'uladItmNm4', title : '업체명', tooltip : tooltipText},
			                {key : 'uladItmNm5', title : '시점전산화번호', tooltip : tooltipText},
			                {key : 'uladItmNm6',  title : '시점설비', tooltip : tooltipText},
			                {key : 'uladItmNm7',  title : '종점전산화번호', tooltip : tooltipText},
			                {key : 'uladItmNm8',  title : '종점설비', tooltip : tooltipText},
			                {key : 'uladItmNm9',  title : '설비종류', tooltip : tooltipText},
			                {key : 'uladItmNm10',  title : '임대기준', tooltip : tooltipText},
			                {key : 'uladItmNm11', title : '관로규격', tooltip : tooltipText},
			                {key : 'uladItmNm12', title : '내관규격', tooltip : tooltipText},
			                {key : 'uladItmNm13', title : '통신선용도', tooltip : tooltipText},
			                {key : 'uladItmNm14', title : '승인구분', tooltip : tooltipText},
			                {key : 'uladItmNm15', title : '요금시작일', tooltip : tooltipText},
			                {key : 'uladItmNm16', title : '요금종료일', tooltip : tooltipText},
			                {key : 'uladItmNm17', title : '경간', tooltip : tooltipText},
			                {key : 'uladItmNm18', title : '실측경간', tooltip : tooltipText},
			                {key : 'uladItmNm19', title : '적용단가', tooltip : tooltipText},
			                {key : 'datErrYn', title : '오류메시지', tooltip : tooltipText, hidden: true}]
			
	};
	
	return options;
}(jQuery, Tango, _));
