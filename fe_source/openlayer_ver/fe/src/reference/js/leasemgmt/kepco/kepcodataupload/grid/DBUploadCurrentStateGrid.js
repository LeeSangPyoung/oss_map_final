/**
 * DBUploadCurrentStateGrid.js
 * DB업로드현황 DataGrid정의
 *
 * @author 임상우
 * @date 2016. 7. 14. 오후 3:50:00
 * @version 1.0  
 */
AlopexGrid.define('defineDataGrid', {
    		
	//filteringHeader: false,//필터 로우 visible
	hideSortingHandle : true,//Sorting 표시 visible
	rowClickSelect : true,
	rowSingleSelect : true,
	rowSingleSelectAllowUnselect : true,
	autoColumnIndex : true,
	rowindexColumnFromZero : false,
	
	defaultColumnMapping:{
		defaultValue : '',
		align : 'center',
		sorting: true
	},
	
	renderMapping : {
		"number" : {
			renderer : function(value, data, render, mapping){
				var reg = /(^[+-]?\d+)(\d{3})/;
				value += '';
				while(reg.test(value)){
					value = value.replace(reg, '$1' + ',' + '$2');
				}
				return value;
			}
		}
	},
	
	columnMapping: [{key : 'check', selectorColumn : true, hidden : true},
	                {title : '순번', width : '40px', rowindexColumn : true, hidden : true},
	                {key : 'kepboCd', align : 'center', title : '한전지사코드', width : '90px'},
	                {key : 'kephdNm', align : 'center', title : '한전본부',	width : '90px'}, 
	                {key : 'kepboNm', align : 'center',	title : '한전지사',	width : '90px'},
	                {key : 'chrDmdYm', align : 'center', title : '과금청구월',width : '90px'},
	                {key : 'lmKepcoTlplFqstrDts', align : 'right', title : '현장조사표 업로드 건수', width : '150px', render : {type : "number"}},
	                {key : 'lmKepafTlplFeeDts', align : 'right', title : '요금내역(전주)업로드 건수', width : '150px', render : {type : "number"}},
	                {key : 'josuEqualRate', align : 'right', title : '조수DB일치율집계건수', width : '150px', render : {type : "number"}},
	                {key : 'kepcoBillDuct', align : 'right', title : '요금내역(관로)업로드 건수', width : '150px', render : {type : "number"}},
	                {key : 'kepcoBillRepeater', align : 'right', title : '요금내역(중계기)업로드 건수', width : '150px', render : {type : "number"}}]
});

