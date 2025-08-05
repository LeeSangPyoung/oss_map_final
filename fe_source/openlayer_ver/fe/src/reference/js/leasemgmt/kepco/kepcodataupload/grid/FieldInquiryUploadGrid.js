/**
 * FieldInquiryUploadGrid
 * 현장조사표 Excel Upload DataGrid정의
 *
 * @author 임상우
 * @date 2016. 7. 25. 오후 3:25:00
 * @version 1.0
 */
var FieldInquiryUploadGrid = (function($, Tango, _){
	
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
		
		if(mapping.key === 'uladItmNm5'||mapping.key === 'uladItmNm7'||mapping.key === 'uladItmNm9'){
			//전주 관리구 : 5자리의 숫자, 문자만 가능
			var reg = /^\w{5}$/;
			
			if(!reg.test(value)){
				msg = '5자리의 숫자, 문자만 가능';
				return msg;
			}
		}
		
		if(mapping.key === 'uladItmNm6'||mapping.key === 'uladItmNm8'||mapping.key === 'uladItmNm10'){
			//전주 번호 : 3자리의 숫자, 문자만 가능
			var reg = /^\w{3}$/;
			
			if(!reg.test(value)){
				if(type === 'tooltip'){
					rStr = '3자리의 숫자, 문자만 가능';
					return rStr;
				}else{
					rStr = '#FF0000'
					return rStr;
				}
			}
		}
		
		if(mapping.key === 'uladItmNm12'){
			//사업자
			if(value !== 'SK000' && value !== 'ST000' && value !== 'SB000'
				&& value !== 'HR000' && value !== 'DN000' && value !== 'ON000'){
				if(type === 'tooltip'){
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
		
		if(mapping.key === 'uladItmNm13'){
			//설치일자 : 'YYYYMMDD'
			var reg = /^\d{8}$/;
			
			var msg = '날짜 형식 오류이거나 존재하지 않는 일자입니다.';
			msg += '\n';
			msg += '[날짜 형식 : YYYYMMDD]';
			
			if(!reg.test(value)){
				if(type === 'tooltip'){
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
				if(type === 'tooltip'){
					rStr = msg;
					return rStr;
				}else{
					rStr = '#FF0000'
					return rStr;
				}
			}
		}
		
		return true;
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
			headerGroup : [{fromIndex : 'uladItmNm3', toIndex : 'uladItmNm4', title : "현전주"},
			               {fromIndex : 'uladItmNm5', toIndex : 'uladItmNm6', title : "전산화번호   (현전주)"},
			               {fromIndex : 'uladItmNm7', toIndex : 'uladItmNm8', title : "전산화번호   (1차전주)"},
			               {fromIndex : 'uladItmNm9', toIndex : 'uladItmNm10', title : "전산화번호   (2차전주)"},
			               {fromIndex : 'uladItmNm12', toIndex : 'uladItmNm22', title : "통신케이블"},
			               {fromIndex : 'uladItmNm23', toIndex : 'uladItmNm25', title : "전송기기"}],
			columnMapping : [{key : 'uladItmNm1', title : "엑셀 행번호"},
			                {key : 'uladItmNm2', title : "순번"},
			                {key : 'uladItmNm3', title : '선로명'},
			                {key : 'uladItmNm4', title : '선로번호'},
			                {key : 'uladItmNm5', title : '관리구'},
			                {key : 'uladItmNm6', title : '번호'},
			                {key : 'uladItmNm7',  title : '관리구'},
			                {key : 'uladItmNm8',  title : '번호'},
			                {key : 'uladItmNm9',  title : '관리구'},
			                {key : 'uladItmNm10',  title : '번호'},
			                {key : 'uladItmNm11',  title : '조가선설치단'},
			                {key : 'uladItmNm12', title : '사업자'},
			                {key : 'uladItmNm13', title : '설치일자'},
			                {key : 'uladItmNm14', title : '용도'},
			                {key : 'uladItmNm15', title : '선종'},
			                {key : 'uladItmNm16', title : '규격'},
			                {key : 'uladItmNm17', title : '접속함체'},
			                {key : 'uladItmNm18', title : '접속점사유'},
			                {key : 'uladItmNm19', title : '승인'},
			                {key : 'uladItmNm20', title : '탭수'},
			                {key : 'uladItmNm21', title : '인입선구분'},
			                {key : 'uladItmNm22', title : '표시찰부착'},
			                {key : 'uladItmNm23', title : '기기명1'},
			                {key : 'uladItmNm24', title : '기기명2'},
			                {key : 'uladItmNm25', title : '기기명3'},
			                {key : 'uladItmNm26', title : '전주상태(휨,균열 경사,지상고 정상)'},
			                {key : 'uladItmNm27', title : '접수번호'},
			                {key : 'uladItmNm28', title : '비고'},
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
			headerGroup : [{fromIndex : 'uladItmNm3', toIndex : 'uladItmNm4', title : "현전주"},
			               {fromIndex : 'uladItmNm5', toIndex : 'uladItmNm6', title : "전산화번호   (현전주)"},
			               {fromIndex : 'uladItmNm7', toIndex : 'uladItmNm8', title : "전산화번호   (1차전주)"},
			               {fromIndex : 'uladItmNm9', toIndex : 'uladItmNm10', title : "전산화번호   (2차전주)"},
			               {fromIndex : 'uladItmNm12', toIndex : 'uladItmNm22', title : "통신케이블"},
			               {fromIndex : 'uladItmNm23', toIndex : 'uladItmNm25', title : "전송기기"}],
			columnMapping : [{key : 'uladItmNm1', title : "엑셀 행번호"},
			                {key : 'uladItmNm2', title : "순번", tooltip : tooltipText},
			                {key : 'uladItmNm3', title : '선로명', tooltip : tooltipText},
			                {key : 'uladItmNm4', title : '선로번호', tooltip : tooltipText},
			                {key : 'uladItmNm5', title : '관리구', tooltip : tooltipText},
			                {key : 'uladItmNm6', title : '번호', tooltip : tooltipText},
			                {key : 'uladItmNm7',  title : '관리구', tooltip : tooltipText},
			                {key : 'uladItmNm8',  title : '번호', tooltip : tooltipText},
			                {key : 'uladItmNm9',  title : '관리구', tooltip : tooltipText},
			                {key : 'uladItmNm10',  title : '번호', tooltip : tooltipText},
			                {key : 'uladItmNm11',  title : '조가선설치단', tooltip : tooltipText},
			                {key : 'uladItmNm12', title : '사업자', tooltip : tooltipText},
			                {key : 'uladItmNm13', title : '설치일자', tooltip : tooltipText},
			                {key : 'uladItmNm14', title : '용도', tooltip : tooltipText},
			                {key : 'uladItmNm15', title : '선종', tooltip : tooltipText},
			                {key : 'uladItmNm16', title : '규격', tooltip : tooltipText},
			                {key : 'uladItmNm17', title : '접속함체', tooltip : tooltipText},
			                {key : 'uladItmNm18', title : '접속점사유', tooltip : tooltipText},
			                {key : 'uladItmNm19', title : '승인', tooltip : tooltipText},
			                {key : 'uladItmNm20', title : '탭수', tooltip : tooltipText},
			                {key : 'uladItmNm21', title : '인입선구분', tooltip : tooltipText},
			                {key : 'uladItmNm22', title : '표시찰부착', tooltip : tooltipText},
			                {key : 'uladItmNm23', title : '기기명1', tooltip : tooltipText},
			                {key : 'uladItmNm24', title : '기기명2', tooltip : tooltipText},
			                {key : 'uladItmNm25', title : '기기명3', tooltip : tooltipText},
			                {key : 'uladItmNm26', title : '전주상태(휨,균열 경사,지상고 정상)', tooltip : tooltipText},
			                {key : 'uladItmNm27', title : '접수번호', tooltip : tooltipText},
			                {key : 'uladItmNm28', title : '비고', tooltip : tooltipText},
			                {key : 'datErrYn', title : '오류메시지', tooltip : tooltipText, hidden: true}]
			
	};
	
	return options;
}(jQuery, Tango, _));
