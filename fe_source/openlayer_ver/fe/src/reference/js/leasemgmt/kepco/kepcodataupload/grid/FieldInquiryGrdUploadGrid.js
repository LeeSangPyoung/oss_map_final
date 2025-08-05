/**
 * FieldInquiryGrdUploadGrid
 * 현장조사표 Excel Upload(지중) DataGrid정의
 *
 * @author P101670
 * @date 2016. 11. 14. 오후 1:13:00
 * @version 1.0
 */
var FieldInquiryGrdUploadGrid = (function($, Tango, _){
	
	var options = {};
	
	function validateCell(value, data, mapping, type){
		
		var rStr = '';
		
		if(mapping.key == 'uladItmNm3'){
			var reg = /^\w{4}$/;
			
			//사업소코드 : 숫자만 가능
			if(!reg.test(value)){
				if(type == 'tooltip'){
					rStr = '4자리 숫자만 가능';
					return rStr;
				}else{
					rStr = '#FF0000'
					return rStr;
				}
			}
		}
		
		if(mapping.key == 'uladItmNm5'||mapping.key == 'uladItmNm11'){
			//전산화번호 : 8자리의 숫자, 문자만 가능
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
		
		if(mapping.key == 'uladItmNm8'||mapping.key == 'uladItmNm9'||mapping.key == 'uladItmNm14' || mapping.key == 'uladItmNm15'){
			//벽면번호/관로구번호: 숫자만 가능
			var reg = /^[0-9]*$/;
			
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
		
		
		if(mapping.key == 'uladItmNm24' || mapping.key == 'uladItmNm25'){
			//계산긍장/실축긍장: 숫자(소수점)만 가능
			/*var reg = /^[0-9]*$/;
			
				if(!reg.test(value)){
					msg = '숫자만 가능';
					return msg;
				}*/
		}
		
		
		
		
		if(mapping.key == 'uladItmNm19'){
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
		
		if(mapping.key == 'uladItmNm28'){
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
		
		if(mapping.key == 'uladItmNm29'){
			//제작일자 : 'YYYYMMDD'
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
		
		
		
		if(mapping.key == 'uladItmNm39'){
			if(value != undefined){
				if(getByteLengh(value) > 100){
					
					if(type == 'tooltip'){
						msg = '100자 이하 숫자, 문자만 가능';
						rStr = msg;
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
			headerGroup : [{fromIndex : 'uladItmNm2', toIndex : 'uladItmNm9', title : "자가설비"},
			               {fromIndex : 'uladItmNm10', toIndex : 'uladItmNm15', title : "상대설비"},
			               {fromIndex : 'uladItmNm16', toIndex : 'uladItmNm18', title : "배전설비 사용내역"},
			               {fromIndex : 'uladItmNm19', toIndex : 'uladItmNm36', title : "통신설비 시설내역"}],
			columnMapping : [{key : 'uladItmNm1', title : "엑셀 행번호"},
			                {key : 'uladItmNm2', title : '사업소명'},
			                {key : 'uladItmNm3', title : '사업소코드'},
			                {key : 'uladItmNm4', title : '설비코드'},
			                {key : 'uladItmNm5', title : '전산화번호'},
			                {key : 'uladItmNm6',  title : '선로명'},
			                {key : 'uladItmNm7',  title : '선로번호'},
			                {key : 'uladItmNm8',  title : '벽면번호'},
			                {key : 'uladItmNm9',  title : '관로구번호'},
			                {key : 'uladItmNm10',  title : '설비코드'},
			                {key : 'uladItmNm11', title : '전산화번호'},
			                {key : 'uladItmNm12', title : '선로명'},
			                {key : 'uladItmNm13', title : '선로번호'},
			                {key : 'uladItmNm14', title : '벽면번호'},
			                {key : 'uladItmNm15', title : '관로구번호'},
			                {key : 'uladItmNm16', title : '임대기준'},
			                {key : 'uladItmNm17', title : '관로규격'},
			                {key : 'uladItmNm18', title : 'PE내관규격'},
			                {key : 'uladItmNm19', title : '통신사업자'},
			                {key : 'uladItmNm20', title : '승인'},
			                {key : 'uladItmNm21', title : '용도'},
			                {key : 'uladItmNm22', title : '선종'},
			                {key : 'uladItmNm23', title : '규격'},
			                {key : 'uladItmNm24', title : '계산긍장'},
			                {key : 'uladItmNm25', title : '실축긍장'},
			                {key : 'uladItmNm26', title : '식별표시'},
			                {key : 'uladItmNm27', title : '여유장유무'},
			                {key : 'uladItmNm28', title : '설치일자'},
			                {key : 'uladItmNm29', title : '제작일자'},
			                {key : 'uladItmNm30', title : 'Serial Number'},
			                {key : 'uladItmNm31', title : '전송기기1'},
			                {key : 'uladItmNm32', title : '전송기기2'},
			                {key : 'uladItmNm33', title : '전송기기3'},
			                {key : 'uladItmNm34', title : '불량여부1'},
			                {key : 'uladItmNm35', title : '불량여부2'},
			                {key : 'uladItmNm36', title : '불량여부3'},
			                {key : 'uladItmNm37', title : '접수번호'},
			                {key : 'uladItmNm38', title : '봉인번호'},
			                {key : 'uladItmNm39', title : '비고'},
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
			headerGroup : [{fromIndex : 'uladItmNm2', toIndex : 'uladItmNm9', title : "자가설비"},
			               {fromIndex : 'uladItmNm10', toIndex : 'uladItmNm15', title : "상대설비"},
			               {fromIndex : 'uladItmNm16', toIndex : 'uladItmNm18', title : "배전설비 사용내역"},
			               {fromIndex : 'uladItmNm19', toIndex : 'uladItmNm36', title : "통신설비 시설내역"}],
			columnMapping : [{key : 'uladItmNm1', title : "엑셀 행번호"},
			                {key : 'uladItmNm2', title : '사업소명', tooltip : tooltipText},
			                {key : 'uladItmNm3', title : '사업소코드', tooltip : tooltipText},
			                {key : 'uladItmNm4', title : '설비코드', tooltip : tooltipText},
			                {key : 'uladItmNm5', title : '전산화번호', tooltip : tooltipText},
			                {key : 'uladItmNm6',  title : '선로명', tooltip : tooltipText},
			                {key : 'uladItmNm7',  title : '선로번호', tooltip : tooltipText},
			                {key : 'uladItmNm8',  title : '벽면번호', tooltip : tooltipText},
			                {key : 'uladItmNm9',  title : '관로구번호', tooltip : tooltipText},
			                {key : 'uladItmNm10',  title : '설비코드', tooltip : tooltipText},
			                {key : 'uladItmNm11', title : '전산화번호', tooltip : tooltipText},
			                {key : 'uladItmNm12', title : '선로명', tooltip : tooltipText},
			                {key : 'uladItmNm13', title : '선로번호', tooltip : tooltipText},
			                {key : 'uladItmNm14', title : '벽면번호', tooltip : tooltipText},
			                {key : 'uladItmNm15', title : '관로구번호', tooltip : tooltipText},
			                {key : 'uladItmNm16', title : '임대기준', tooltip : tooltipText},
			                {key : 'uladItmNm17', title : '관로규격', tooltip : tooltipText},
			                {key : 'uladItmNm18', title : 'PE내관규격', tooltip : tooltipText},
			                {key : 'uladItmNm19', title : '통신사업자', tooltip : tooltipText},
			                {key : 'uladItmNm20', title : '승인', tooltip : tooltipText},
			                {key : 'uladItmNm21', title : '용도', tooltip : tooltipText},
			                {key : 'uladItmNm22', title : '선종', tooltip : tooltipText},
			                {key : 'uladItmNm23', title : '규격', tooltip : tooltipText},
			                {key : 'uladItmNm24', title : '계산긍장', tooltip : tooltipText},
			                {key : 'uladItmNm25', title : '실축긍장', tooltip : tooltipText},
			                {key : 'uladItmNm26', title : '식별표시', tooltip : tooltipText},
			                {key : 'uladItmNm27', title : '여유장유무', tooltip : tooltipText},
			                {key : 'uladItmNm28', title : '설치일자', tooltip : tooltipText},
			                {key : 'uladItmNm29', title : '제작일자', tooltip : tooltipText},
			                {key : 'uladItmNm30', title : 'Serial Number', tooltip : tooltipText},
			                {key : 'uladItmNm31', title : '전송기기1', tooltip : tooltipText},
			                {key : 'uladItmNm32', title : '전송기기2', tooltip : tooltipText},
			                {key : 'uladItmNm33', title : '전송기기3', tooltip : tooltipText},
			                {key : 'uladItmNm34', title : '불량여부1', tooltip : tooltipText},
			                {key : 'uladItmNm35', title : '불량여부2', tooltip : tooltipText},
			                {key : 'uladItmNm36', title : '불량여부3', tooltip : tooltipText},
			                {key : 'uladItmNm37', title : '접수번호', tooltip : tooltipText},
			                {key : 'uladItmNm38', title : '봉인번호', tooltip : tooltipText},
			                {key : 'uladItmNm39', title : '비고', tooltip : tooltipText},
			                {key : 'datErrYn', title : '오류메시지', tooltip : tooltipText, hidden: true}]
			
	};
	
	return options;
}(jQuery, Tango, _));
