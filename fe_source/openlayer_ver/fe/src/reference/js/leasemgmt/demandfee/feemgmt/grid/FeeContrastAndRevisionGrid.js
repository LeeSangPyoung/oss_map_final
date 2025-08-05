/**
 * FeeContrastAndRevisionGrid.js
 * 요금대사 및 정정 DataGrid정의
 *
 * @author 임상우
 * @date 2016. 8. 1. 오후 3:25:00
 * @version 1.0
 */
var FeeContrastAndRevisionGrid = (function($, Tango, _){
	
	var options = {};
	
	var render_data = [];
	
	render_data.push({text:'',value:''});
	render_data.push({text:'일할계산오류',value:'일할계산오류'});
	render_data.push({text:'최초과금',value:'최초과금'});
	render_data.push({text:'최초과금_장치비',value:'최초과금_장치비'});
	render_data.push({text:'최초과금_이설비',value:'최초과금_이설비'});
	render_data.push({text:'최초과금_일할계산오류',value:'최초과금_일할계산오류'});
	render_data.push({text:'할인율 적용 오류',value:'할인율 적용 오류'});
	render_data.push({text:'할인율_30% 미적용',value:'할인율_30% 미적용 '});
	render_data.push({text:'과금거리변경 오류',value:'과금거리변경 오류'});
	render_data.push({text:'개통일 오류',value:'개통일 오류'});
	render_data.push({text:'해지일 오류',value:'해지일 오류'});  
	render_data.push({text:'단기회선 오류',value:'단기회선 오류'});
	render_data.push({text:'사업자 전환 오류',value:'사업자 전환 오류'});
	
	function removeComma(val){
		
		if(val === undefined){
			return 0;
		}
		
		val = String(val);
		
		return Number(val.replace(/,/gi,''));
	}
	
	function checkAllowEditCurr(value, data, mapping){
		if(data.checkNxtMthRfndAmt == "Y"){
			return false;
		}
		else{
			return true;			
		}	
	}
	
	function checkAllowEditNxt(value, data, mapping){
		if(data.checkCurrMthRfndAmt == "Y"){
			return false;
		}
		else{
			return true;			
		}	
	}
	
	function funcAllowEdit(value, data, mapping){
		if (data.companyDivision === '0') {
    		return true;
    	}
    	return false;
	}
	
	function checkboxEditedValue(cell, data, render, mapping, grid){
		return $(cell).find('input').is(':checked') ? 'Y':'N';
	}
	
	function inputNumberEditedValue(cell, data, render, mapping, grid){
		return String(Number($(cell).find('input').val()));
	}
	
	function textDropDownEditedValue(cell, data, render, mapping, grid){
		
		var val = $(cell).find('input').val();
		
		if(val != ''){
			return val;
		}
		
		return $(cell).find('input').text();
	}
	
	function getFormatNumber(val){
		
		val = String(val);
		
		var reg = /(^[+-]?\d+)(\d{3})/;
		
		while(reg.test(val)){
			val = val.replace(reg, '$1' + ',' + '$2');
		}
		
		return val;
	}
	
	function renderFlag(value, data, mapping){
		
		if(data['companyDivision'] !== '0' || data._original === undefined){
			return;
		}
		
		data._state.edited = false;
		
		if(data['tlplChag'] === undefined){
			data['tlplChag'] = '';
		}
		
		if(data['etcCost'] === undefined){
			data['etcCost'] = '';
		}
		
		if(data['currMthRfndAmt'] === undefined){
			data['currMthRfndAmt'] = '';
		}
		
		if(data['nxtMthRfndAmt'] === undefined){
			data['nxtMthRfndAmt'] = '';
		}
		
		if(data['etcRmk'] === undefined){
			data['etcRmk'] = '';
		}
		
		if(data._original['tlplChag'] === undefined){
			data._original['tlplChag'] = '';
		}
		
		if(data._original['etcCost'] === undefined){
			data._original['etcCost'] = '';
		}
		
		if(data._original['currMthRfndAmt'] === undefined){
			data._original['currMthRfndAmt'] = '';
		}
		
		if(data._original['nxtMthRfndAmt'] === undefined){
			data._original['nxtMthRfndAmt'] = '';
		}
		
		if(data._original['etcRmk'] === undefined){
			data._original['etcRmk'] = '';
		}
		
		if(data['tlplChag'] !== data._original['tlplChag']){
			data._state.edited = true;
		}
		
		if(data['etcCost'] !== data._original['etcCost']){
			data._state.edited = true;
		}
		
		if(data['currMthRfndAmt'] !== data._original['currMthRfndAmt']){
			data._state.edited = true;
		}
		
		if(data['nxtMthRfndAmt'] !== data._original['nxtMthRfndAmt']){
			data._state.edited = true;
		}
		
		if(data['etcRmk'] !== data._original['etcRmk']){
			data._state.edited = true;
		}
		
		return data._state.edited ? 'U':'';
	}
	
	
	//광코아 Grid
	options.defineOPTDataGrid = {
		lesKndCd : 'T1',
		rowClickSelect: false,
		rowSingleSelect: false,
		rowSingleSelectAllowUnselect: false,
		autoColumnIndex: true,
		rowindexColumnFromZero: false,
		cellInlineEdit: true,
		fullCompareForEditedState: true,
		paging: {
	      	pagerSelect: false
	      	/*,
	      	hidePageList: true*/
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		defaultColumnMapping: {
			align: 'center',
			width: '90px',
			sorting: false,
			inlineStyle: {
				background: function(value, data, mapping){
					
					if(mapping.key === 'rnum'){
						return '#FFFFFF';
					}
					
					var isDiffrent = false;
					
					if(mapping.key === 'objYm'//청구년월
						|| mapping.key === 'hdofcOrgNm'//본부명
						|| mapping.key === 'trmsMtsoNm'//전송실명
						|| mapping.key === 'leslNo'//회선번호
						|| mapping.key === 'dnrSystmNm'//DONOR시스템명
						|| mapping.key === 'rmteSystmNm'//REMOTE시스템명
						|| mapping.key === 'lesDistm'//거리
						|| mapping.key === 'coreCnt'//코아수
						|| mapping.key === 'openDtm'//개통일
						|| mapping.key === 'trmnDtm'//해지일
						|| mapping.key === 'lesCommBizrNm'//제공사업자
						|| mapping.key === 'basUprc'//기본단가
						|| mapping.key === 'mthUtilChag'//월이용료
						|| mapping.key === 'feeSumrAmt'//요금계
						|| mapping.key === 'drtCalcAplyDayCnt'//일할계산적용일수
						|| mapping.key === 'drtCalcAmt'//일할계산적용일수
						|| mapping.key === 'tmthSumrAmt'//당월계
						|| mapping.key === 'atrnfDiscAmt'//자동이체금액
						|| mapping.key === 'splyAmt'//공급가액
						){
						
						var arr = $('#dataGrid').alopexGrid('dataGet', {'leslNo':data['leslNo']});
						
						if(!(arr[0][mapping.key] === undefined && arr[1][mapping.key] === undefined)){
							if(arr[0][mapping.key] === undefined || arr[1][mapping.key] === undefined){
								isDiffrent = true;
							}else{
								if(arr[0][mapping.key] !== arr[1][mapping.key]){
									isDiffrent = true;
								}
							}
						}
					}else if(mapping.key === 'tlplChag' || mapping.key === 'etcCost'){
						if(data['companyDivision'] === '0'){
							return '#E7FFC1';
						}else{
							return '#FFFFFF';
						}
					}
					
					if(isDiffrent){
						return '#FFB2D9';
					}else{
						if(data['styleDivision'] === '1' || data['styleDivision'] === '2'){
							return '#FFFFFF';
						}else{
							return '#E7E7F3';
						}
					}
				}
			}
		},
		
		renderMapping: {
			
			"refuntAmt": {
				renderer: function(value, data, render, mapping){
					
					if(data['companyDivision'] !== '0'){
						return;
					}
					
					var html = '<div style="';
					html += value === 'Y' ? '':'width:100%;';
					html += 'float:left;padding-top:2px;"><input class="checkbox" type="checkbox" ';
					html += value === 'Y' ? 'checked':'';
					html += '/></div>';
					
					if(value === 'Y'){
						html += '<div style="width:100%;display:inline-block;margin-left:3px;text-align:left;">';
						
						if(mapping.key === 'checkCurrMthRfndAmt'){
							html += '환급:';
							html += getFormatNumber(data.currMthRfndAmt);
						}
						
						if(mapping.key === 'checkNxtMthRfndAmt'){
							if(getFormatNumber(data.nxtMthRfndAmt) >= '0'){
								html += '환급:';	
							}else{
								html += '환불:';
							}
							html += getFormatNumber(data.nxtMthRfndAmt);
						}
						
						html += '</div>';
					}
					
					return html;
				}
			},
			
			"dropDown": {
				renderer: function(value, data, render, mapping){
					
					if(data['companyDivision'] !== '0'){
						return;
					}
					
					/*return '<input class="Textinput" id="menu-trigger" style="width:100%;" value="'+value + '">';*/
					return '<input class="Textinput" id="menu-trigger" style="width:100%;">';
				},
				
				postRender: function(cell, value, data, render, mapping, grid){
					
					if(data['companyDivision'] !== '0'){
						return;
					}
					
					var $cell = $(cell);
					$cell.find('.Textinput').convert();
					setTimeout(function(){
						$('#dropdown_menu').open('#menu-trigger');
					}, 50);
					return cell;
				}
			},
			
			"inputNumber": {
				renderer: function(value, data, render, mapping){
					return '<div><input style="width:100%;text-align: right;" type="number" value="'+value+'"></div>';
				}
			}
		},
		
		columnMapping: [{key: 'rnum', title: '순번', width: '40px', rowindexColumn: true},
		                {key: 'flag', width:'30px', align: 'center', editable:false, render: renderFlag, hidden:true},
		                {key: 'classification', title: '분류'},
		                {key: 'objYm', title: '청구년월'},
		                {key: 'hdofcOrgNm', title: '본부', width: '180px'},
		                {key: 'trmsMtsoNm', title: '전송실', width: '180px'},
		                {key: 'leslNo', title: '회선번호', width: '120px'},
		                {key: 'dnrSystmNm', title: 'DONOR시스템명', width: '180px', ellipsisText: true},
		                {key: 'rmteSystmNm', title: 'REMOTE시스템명', width: '180px', ellipsisText: true},
		                {key: 'lesDistm', title: '거리'},
		                {key: 'coreCnt', title: '코아수'},
		                {key: 'openDtm', title: '개통일'},
		                {key: 'trmnDtm', title: '해지일'},
		                {key: 'lesCommBizrNm', title: '사업자'},
		                {key: 'basUprc', title: '기본단가', render: {type: "string", rule:"comma"}, align : 'right'},
		                {key: 'mthUtilChag', title: '월이용료', render: {type: "string", rule:"comma"}, align : 'right'},
		                {key: 'tlplChag', title: '전주료', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},
		                {key: 'etcCost', title: '기타', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},
		                {key: 'feeSumrAmt', title: '요금계', render: {type: "string", rule:"comma"}, editable: {type: "string", rule:"comma"}, align : 'right'},
		                {key: 'drtCalcAplyDayCnt', title: '일할계산적용일수'},
		                {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
		                {key: 'rfndAmt', title: '(환불-/환급+)'},
		                {key: 'currMthRfndAmt', title: '당월환불급', hidden: true},
		                
		                {key: 'checkCurrMthRfndAmt', title: '당월환불급', width: '120px', tooltip: false, allowEdit: checkAllowEditCurr,//funcAllowEdit,
		                	render: {type: "refuntAmt"},
		                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
		                	editedValue: checkboxEditedValue},
		                	
		                
		                {key: 'tmthSumrAmt', title: '당월계', render: {type: "string", rule:"comma"}, align : 'right'},
		                {key: 'atrnfDiscAmt', title: '자동이체금액', render: {type: "string", rule:"comma"}, align : 'right'},
		                {key: 'splyAmt', title: '공급가액', render: {type: "string", rule:"comma"}, align : 'right'},
		                {key: 'nxtMthRfndAmt', title: '익월환불급', hidden: true},
		                
		               
		                {key: 'checkNxtMthRfndAmt', title: '익월환불급', width: '120px', tooltip: false, allowEdit: checkAllowEditNxt,//funcAllowEdit,
		                	render: {type: "refuntAmt"},
		                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
		                	editedValue: checkboxEditedValue},
	                	
		                	
		                	
		                	{key: 'etcRmk', title: '요금변경사유', width: '200px', align: 'center',
		    				render: {type:'string', 
		    					rule: function(value, data) {
		    						return render_data;
		    					}
		    				},
		    				editable: {type:'select', 
		    					rule: function(value, data) {
		    						return render_data;
		    					}
		    				},
/*		    				editedValue : function (cell) {
		    					return  $(cell).find('select option').filter(':selected').val();
		    				},
*/		    				allowEdit: function(value,data,mapping){
		    					if(data.classification === '사업자'){
		    						return false;	
		    					}
		    					return true;
		    				}
	                	}],
	                	
	};
	
	//기지국회선 Grid
	options.defineBTSDataGrid = {
			//전주료 >> 장치비
			lesKndCd : 'T2',
			rowClickSelect: false,
			rowSingleSelect: false,
			rowSingleSelectAllowUnselect: false,
			autoColumnIndex: true,
			rowindexColumnFromZero: false,
			cellInlineEdit: true,
			fullCompareForEditedState: true,
			paging: {
		      	pagerSelect: false
		      	/*,
		      	hidePageList: true*/
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
			defaultColumnMapping: {
				align: 'center',
				width: '90px',
				sorting: false,
				inlineStyle: {
					background: function(value, data, mapping){
						
						if(mapping.key === 'rnum'){
							return '#FFFFFF';
						}
						
						var isDiffrent = false;
						
						if(mapping.key === 'objYm'//청구년월
							
							|| mapping.key === 'hdofcOrgNm'//본부명
							|| mapping.key === 'trmsMtsoNm'//전송실명
							|| mapping.key === 'leslNo'//회선번호
							|| mapping.key === 'bmtsoMtsoNm'//기지국명
							|| mapping.key === 'openDtm'//개통일
							|| mapping.key === 'trmnDtm'//해지일
							|| mapping.key === 'lesCommBizrNm'//제공사업자
							|| mapping.key === 'stdLesDistm'//구분
							|| mapping.key === 'lesDistm'//거리
							|| mapping.key === 'basUprc'//기본단가
							|| mapping.key === 'mthUtilChag'//월이용료
							|| mapping.key === 'feeSumrAmt'//요금계
							|| mapping.key === 'drtCalcAplyDayCnt'//일할계산적용일수
							|| mapping.key === 'drtCalcAmt'//일할계산적용일수
							|| mapping.key === 'tmthSumrAmt'//당월계
							|| mapping.key === 'atrnfDiscAmt'//자동이체금액
							|| mapping.key === 'splyAmt'//공급가액
								
							){
							
							var arr = $('#dataGrid').alopexGrid('dataGet', {'leslNo':data['leslNo']});
							
							if(!(arr[0][mapping.key] === undefined && arr[1][mapping.key] === undefined)){
								if(arr[0][mapping.key] === undefined || arr[1][mapping.key] === undefined){
									isDiffrent = true;
								}else{
									if(arr[0][mapping.key] !== arr[1][mapping.key]){
										isDiffrent = true;
									}
								}
							}
						}else if(mapping.key === 'tlplChag' || mapping.key === 'etcCost'){
							if(data['companyDivision'] === '0'){
								return '#E7FFC1';
							}else{
								return '#FFFFFF';
							}
						}
						
						if(isDiffrent){
							return '#FFB2D9';
						}else{
							if(data['styleDivision'] === '1' || data['styleDivision'] === '2'){
								return '#FFFFFF';
							}else{
								return '#E7E7F3';
							}
						}
					}
				}
			},
			
			renderMapping: {
				
				"refuntAmt": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var html = '<div style="';
						html += value === 'Y' ? '':'width:100%;';
						html += 'float:left;padding-top:2px;"><input class="checkbox" type="checkbox" ';
						html += value === 'Y' ? 'checked':'';
						html += '/></div>';
						
						if(value === 'Y'){
							html += '<div style="width:100%;display:inline-block;margin-left:3px;text-align:left;">';
							
							if(mapping.key === 'checkCurrMthRfndAmt'){
								html += '환급:';
								html += getFormatNumber(data.currMthRfndAmt);
							}
							
							if(mapping.key === 'checkNxtMthRfndAmt'){
								html += '환불:';
								html += getFormatNumber(data.nxtMthRfndAmt);
							}
							
							html += '</div>';
						}
						
						return html;
					}
				},
				
				"dropDown": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						/*return '<input class="Textinput" id="menu-trigger" style="width:100%;" value="'+value + '">';*/
						return '<input class="Textinput" id="menu-trigger" style="width:100%;">';
					},
					
					postRender: function(cell, value, data, render, mapping, grid){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var $cell = $(cell);
						$cell.find('.Textinput').convert();
						setTimeout(function(){
							$('#dropdown_menu').open('#menu-trigger');
						}, 50);
						return cell;
					}
				},
				
				"inputNumber": {
					renderer: function(value, data, render, mapping){
						return '<div><input style="width:100%;text-align: right;" type="number" value="'+value+'"></div>';
					}
				}
			},
			
			columnMapping: [{key: 'rnum', title: '순번', width: '40px', rowindexColumn: true},
			                {key: 'flag', width:'30px', align: 'center', editable:false, render: renderFlag, hidden:true}, 
			                {key: 'classification', title: '분류'},
			                {key: 'objYm', title: '청구년월'},
			                {key: 'hdofcOrgNm', title: '본부', width: '180px'},
			                {key: 'trmsMtsoNm', title: '전송실', width: '180px'},
			                {key: 'leslNo', title: '회선번호', width: '120px'},
			                {key: 'bmtsoMtsoNm', title: '기지국'},  
			                {key: 'openDtm', title: '개통일'},
			                {key: 'trmnDtm', title: '해지일'},
			                {key: 'lesCommBizrNm', title: '사업자'},
			                {key: 'stdLesDistm', title: '구분'}, 
			                {key: 'lesDistm', title: '거리'},
			                {key: 'basUprc', title: '기본단가', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'mthUtilChag', title: '월이용료', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'tlplChag', title: '장치비', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},  /* INST_CHRG  장치비 결과,청구에 매치 안됨 전주료로 대처 */
			                {key: 'etcCost', title: '기타', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},
			                {key: 'feeSumrAmt', title: '요금계', render: {type: "string", rule:"comma"}, editable: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'drtCalcAplyDayCnt', title: '일할계산적용일수'},
			                {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
			                {key: 'rfndAmt', title: '(환불-/환급+)'},
			                {key: 'currMthRfndAmt', title: '당월환불급', hidden: true},
			                {key: 'checkCurrMthRfndAmt', title: '당월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
			                {key: 'tmthSumrAmt', title: '당월계', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'atrnfDiscAmt', title: '자동이체금액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'splyAmt', title: '공급가액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'nxtMthRfndAmt', title: '익월환불급', hidden: true},
			                {key: 'checkNxtMthRfndAmt', title: '익월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
		                	{key: 'etcRmk', title: '요금변경사유', width: '200px', align: 'center',
			    				render: {type:'string', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editable: {type:'select', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editedValue : function (cell) {
			    					return  $(cell).find('select option').filter(':selected').val();
			    				},
			    				allowEdit: function(value,data,mapping){
			    					if(data.classification === '사업자'){
			    						return false;	
			    					}
			    					return true;
			    				}
		                	}]
			
	};
	
	//Wi-Fi Grid
	options.defineWIFIDataGrid = {
			//장치비, 자동이체여부
			lesKndCd : 'T4',
			rowClickSelect: false,
			rowSingleSelect: false,
			rowSingleSelectAllowUnselect: false,
			autoColumnIndex: true,
			rowindexColumnFromZero: false,
			cellInlineEdit: true,
			fullCompareForEditedState: true,
			paging: {
		      	pagerSelect: false
		      	/*,
		      	hidePageList: true*/
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/

			defaultColumnMapping: {
				align: 'center',
				width: '90px',
				sorting: false,
				inlineStyle: {
					background: function(value, data, mapping){
						
						if(mapping.key === 'rnum'){
							return '#FFFFFF';
						}
						
						var isDiffrent = false;
						
						if(mapping.key === 'objYm'//청구년월
							|| mapping.key === 'hdofcOrgNm'//본부명
							|| mapping.key === 'trmsMtsoNm'//전송실명
							|| mapping.key === 'leslNo'//회선번호
							|| mapping.key === 'afcpyNm'//제휴사명
							|| mapping.key === 'gamangName'//가맹정명
							|| mapping.key === 'openDtm'//개통일
							|| mapping.key === 'trmnDtm'//해지일
							|| mapping.key === 'lesCommBizrNm'//제공사업자
							|| mapping.key === 'lesDistm'//거리
							|| mapping.key === 'stdLesDistm'//구분
							|| mapping.key === 'leslCapaCd'//회선종류
							|| mapping.key === 'apQuty'//AP수량
							|| mapping.key === 'basUprc'//기본단가
							|| mapping.key === 'mthUtilChag'//월이용료
							|| mapping.key === 'feeSumrAmt'//요금계
							|| mapping.key === 'drtCalcAplyDayCnt'//일할계산적용일수
							|| mapping.key === 'drtCalcAmt'//일할계산적용일수
							|| mapping.key === 'tmthSumrAmt'//당월계
							|| mapping.key === 'atrnfDiscAmt'//자동이체금액
							|| mapping.key === 'splyAmt'//공급가액
							){
							
							var arr = $('#dataGrid').alopexGrid('dataGet', {'leslNo':data['leslNo']});
							
							if(!(arr[0][mapping.key] === undefined && arr[1][mapping.key] === undefined)){
								if(arr[0][mapping.key] === undefined || arr[1][mapping.key] === undefined){
									isDiffrent = true;
								}else{
									if(arr[0][mapping.key] !== arr[1][mapping.key]){
										isDiffrent = true;
									}
								}
							}
						}else if(mapping.key === 'tlplChag' || mapping.key === 'etcCost'){
							if(data['companyDivision'] === '0'){
								return '#E7FFC1';
							}else{
								return '#FFFFFF';
							}
						}
						
						if(isDiffrent){
							return '#FFB2D9';
						}else{
							if(data['styleDivision'] === '1' || data['styleDivision'] === '2'){
								return '#FFFFFF';
							}else{
								return '#E7E7F3';
							}
						}
					}
				}
			},
			
			renderMapping: {
				
				"refuntAmt": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var html = '<div style="';
						html += value === 'Y' ? '':'width:100%;';
						html += 'float:left;padding-top:2px;"><input class="checkbox" type="checkbox" ';
						html += value === 'Y' ? 'checked':'';
						html += '/></div>';
						
						if(value === 'Y'){
							html += '<div style="width:100%;display:inline-block;margin-left:3px;text-align:left;">';
							
							if(mapping.key === 'checkCurrMthRfndAmt'){
								html += '환급:';
								html += getFormatNumber(data.currMthRfndAmt);
							}
							
							if(mapping.key === 'checkNxtMthRfndAmt'){
								html += '환불:';
								html += getFormatNumber(data.nxtMthRfndAmt);
							}
							
							html += '</div>';
						}
						
						return html;
					}
				},
				
				"dropDown": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						/*return '<input class="Textinput" id="menu-trigger" style="width:100%;" value="'+value + '">';*/
						return '<input class="Textinput" id="menu-trigger" style="width:100%;">';
					},
					
					postRender: function(cell, value, data, render, mapping, grid){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var $cell = $(cell);
						$cell.find('.Textinput').convert();
						setTimeout(function(){
							$('#dropdown_menu').open('#menu-trigger');
						}, 50);
						return cell;
					}
				},
				
				"inputNumber": {
					renderer: function(value, data, render, mapping){
						return '<div><input style="width:100%;text-align: right;" type="number" value="'+value+'"></div>';
					}
				}
			},
			columnMapping: [{key: 'rnum', title: '순번', width: '40px', rowindexColumn: true},
			                {key: 'flag', width:'30px', align: 'center', editable:false, render: renderFlag, hidden:true}, 
			                {key: 'classification', title: '분류'},
			                {key: 'objYm', title: '청구년월'},
			                {key: 'hdofcOrgNm', title: '본부', width: '180px'},
			                {key: 'trmsMtsoNm', title: '전송실', width: '180px'},
			                {key: 'leslNo', title: '회선번호', width: '120px'},
			                {key: 'afcpyNm', title: '제휴사'},      
			                {key: 'gamangName', title: '가맹점'},   /* 요금결과 청구결과 미매핑 필드 */
			                {key: 'openDtm', title: '개통일'},
			                {key: 'trmnDtm', title: '해지일'},
			                {key: 'lesCommBizrNm', title: '사업자'},
			                {key: 'stdLesDistm', title: '구분'}, 
			                {key: 'lesDistm', title: '거리'},
			                {key: 'leslCapaCd', title: '회선종류'},   
			                {key: 'apQuty', title: 'AP수량'},   
			                {key: 'basUprc', title: '기본단가', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'mthUtilChag', title: '월이용료', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'tlplChag', title: '장치비', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},  /* INST_CHRG  장치비 결과,청구에 매치 안됨 전주료로 대처 */
			                {key: 'etcCost', title: '기타', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},
			                {key: 'feeSumrAmt', title: '요금계', render: {type: "string", rule:"comma"}, editable: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'drtCalcAplyDayCnt', title: '일할계산적용일수'},
			                {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
			                {key: 'rfndAmt', title: '(환불-/환급+)'},
			                {key: 'currMthRfndAmt', title: '당월환불급', hidden: true},
			                {key: 'checkCurrMthRfndAmt', title: '당월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
			                {key: 'tmthSumrAmt', title: '당월계', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'atrnfDiscAmt', title: '자동이체금액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'splyAmt', title: '공급가액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'nxtMthRfndAmt', title: '익월환불급', hidden: true},
			                {key: 'checkNxtMthRfndAmt', title: '익월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
		                	{key: 'etcRmk', title: '요금변경사유', width: '200px', align: 'center',
			    				render: {type:'string', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editable: {type:'select', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editedValue : function (cell) {
			    					return  $(cell).find('select option').filter(':selected').val();
			    				},
			    				allowEdit: function(value,data,mapping){
			    					if(data.classification === '사업자'){
			    						return false;	
			    					}
			    					return true;
			    				}
		                	}]
	};
	
	//B2B Grid
	options.defineB2BDataGrid = {
		//공급가액	, 익월환불급 만 있음.
			lesKndCd : 'T5',
			rowClickSelect: false,
			rowSingleSelect: false,
			rowSingleSelectAllowUnselect: false,
			autoColumnIndex: true,
			rowindexColumnFromZero: false,
			cellInlineEdit: true,
			fullCompareForEditedState: true,
			paging: {
		      	pagerSelect: false
		      	/*,
		      	hidePageList: true*/
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
			
			defaultColumnMapping: {
				align: 'center',
				width: '90px',
				sorting: false,
				inlineStyle: {
					background: function(value, data, mapping){
						
						if(mapping.key === 'rnum'){
							return '#FFFFFF';
						}
						
						var isDiffrent = false;
						
						if(mapping.key === 'objYm'//청구년월
							|| mapping.key === 'hdofcOrgNm'//본부명
							|| mapping.key === 'trmsMtsoNm'//전송실명
							|| mapping.key === 'leslNo'//회선번호
							|| mapping.key === 'openDtm'//과금개시일
							|| mapping.key === 'trmnDtm'//해지일
							|| mapping.key === 'lesCommBizrNm'//제공사업자
							|| mapping.key === 'leslCapaCd'
							|| mapping.key === 'leslStatVal'
							|| mapping.key === 'Skt2LineId'
							|| mapping.key === 'custNm'
							|| mapping.key === 'splyAmt'//공급가액
							|| mapping.key === 'nxtMthRfndAmt'//공급가액
							){
							
							var arr = $('#dataGrid').alopexGrid('dataGet', {'leslNo':data['leslNo']});
							
							if(!(arr[0][mapping.key] === undefined && arr[1][mapping.key] === undefined)){
								if(arr[0][mapping.key] === undefined || arr[1][mapping.key] === undefined){
									isDiffrent = true;
								}else{
									if(arr[0][mapping.key] !== arr[1][mapping.key]){
										isDiffrent = true;
									}
								}
							}
						}else if(mapping.key === 'tlplChag' || mapping.key === 'etcCost'){
							if(data['companyDivision'] === '0'){
								return '#E7FFC1';
							}else{
								return '#FFFFFF';
							}
						}
						
						if(isDiffrent){
							return '#FFB2D9';
						}else{
							if(data['styleDivision'] === '1' || data['styleDivision'] === '2'){
								return '#FFFFFF';
							}else{
								return '#E7E7F3';
							}
						}
					}
				}
			},
			
			renderMapping: {
				
				"refuntAmt": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var html = '<div style="';
						html += value === 'Y' ? '':'width:100%;';
						html += 'float:left;padding-top:2px;"><input class="checkbox" type="checkbox" ';
						html += value === 'Y' ? 'checked':'';
						html += '/></div>';
						
						if(value === 'Y'){
							html += '<div style="width:100%;display:inline-block;margin-left:3px;text-align:left;">';
							
							if(mapping.key === 'checkCurrMthRfndAmt'){
								html += '환급:';
								html += getFormatNumber(data.currMthRfndAmt);
							}
							
							if(mapping.key === 'checkNxtMthRfndAmt'){
								html += '환불:';
								html += getFormatNumber(data.nxtMthRfndAmt);
							}
							
							html += '</div>';
						}
						
						return html;
					}
				},
				
				"dropDown": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						/*return '<input class="Textinput" id="menu-trigger" style="width:100%;" value="'+value + '">';*/
						return '<input class="Textinput" id="menu-trigger" style="width:100%;">';
					},
					
					postRender: function(cell, value, data, render, mapping, grid){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var $cell = $(cell);
						$cell.find('.Textinput').convert();
						setTimeout(function(){
							$('#dropdown_menu').open('#menu-trigger');
						}, 50);
						return cell;
					}
				},
				
				"inputNumber": {
					renderer: function(value, data, render, mapping){
						return '<div><input style="width:100%;text-align: right;" type="number" value="'+value+'"></div>';
					}
				}
			},
			columnMapping: [{key: 'rnum', title: '순번', width: '40px', rowindexColumn: true},
			                {key: 'flag', width:'30px', align: 'center', editable:false, render: renderFlag, hidden:true}, 
			                {key: 'classification', title: '분류'},
			                {key: 'objYm', title: '청구년월'},
			                {key: 'hdofcOrgNm', title: '본부', width: '180px'},
			                {key: 'trmsMtsoNm', title: '전송실', width: '180px'},
			                {key: 'leslNo', title: '회선번호', width: '120px'},
			                {key: 'openDtm', title: '과금개시일'},
			                {key: 'trmnDtm', title: '해지일'},
			                {key: 'lesCommBizrNm', title: '사업자'},
			                {key: 'leslCapaCd', title: '회선종류'},
			                {key: 'leslStatVal', title: '회선상태'},  
			                {key: 'Skt2LineId', title: 'SKT2회선번호'},
			                {key: 'custNm', title: '고객명'}, 
			                {key: 'splyAmt', title: '공급가액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'nxtMthRfndAmt', title: '익월환불급', hidden: true},
			                {key: 'checkNxtMthRfndAmt', title: '익월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
		                	{key: 'etcRmk', title: '요금변경사유', width: '200px', align: 'center',
			    				render: {type:'string', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editable: {type:'select', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editedValue : function (cell) {
			    					return  $(cell).find('select option').filter(':selected').val();
			    				},
			    				allowEdit: function(value,data,mapping){
			    					if(data.classification === '사업자'){
			    						return false;	
			    					}
			    					return true;
			    				}
		                	}]
	};
	
	//HFC중계기 Grid
	options.defineHFCDataGrid = {
			lesKndCd : 'T6',
			rowClickSelect: false,
			rowSingleSelect: false,
			rowSingleSelectAllowUnselect: false,
			autoColumnIndex: true,
			rowindexColumnFromZero: false,
			cellInlineEdit: true,
			fullCompareForEditedState: true,
			paging: {
		      	pagerSelect: false
		      	/*,
		      	hidePageList: true*/
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
			defaultColumnMapping: {
				align: 'center',
				width: '90px',
				sorting: false,
				inlineStyle: {
					background: function(value, data, mapping){
						
						if(mapping.key === 'rnum'){
							return '#FFFFFF';
						}
						
						var isDiffrent = false;
						
						if(mapping.key === 'objYm'//청구년월
							|| mapping.key === 'hdofcOrgNm'//본부명
							|| mapping.key === 'trmsMtsoNm'//전송실명
							|| mapping.key === 'leslNo'//회선번호
							|| mapping.key === 'dnrSystmNm'//DONOR시스템명
							|| mapping.key === 'rmteSystmNm'//REMOTE시스템명
							|| mapping.key === 'lesDistm'//거리
							|| mapping.key === 'coreCnt'//코아수
							|| mapping.key === 'openDtm'//개통일
							|| mapping.key === 'trmnDtm'//해지일
							|| mapping.key === 'lesCommBizrNm'//제공사업자
							|| mapping.key === 'basUprc'//기본단가
							|| mapping.key === 'mthUtilChag'//월이용료
							|| mapping.key === 'feeSumrAmt'//요금계
							|| mapping.key === 'drtCalcAplyDayCnt'//일할계산적용일수
							|| mapping.key === 'drtCalcAmt'//일할계산적용일수
							|| mapping.key === 'tmthSumrAmt'//당월계
							|| mapping.key === 'atrnfDiscAmt'//자동이체금액
							|| mapping.key === 'splyAmt'//공급가액
							){
							
							var arr = $('#dataGrid').alopexGrid('dataGet', {'leslNo':data['leslNo']});
							
							if(!(arr[0][mapping.key] === undefined && arr[1][mapping.key] === undefined)){
								if(arr[0][mapping.key] === undefined || arr[1][mapping.key] === undefined){
									isDiffrent = true;
								}else{
									if(arr[0][mapping.key] !== arr[1][mapping.key]){
										isDiffrent = true;
									}
								}
							}
						}else if(mapping.key === 'tlplChag' || mapping.key === 'etcCost'){
							if(data['companyDivision'] === '0'){
								return '#E7FFC1';
							}else{
								return '#FFFFFF';
							}
						}
						
						if(isDiffrent){
							return '#FFB2D9';
						}else{
							if(data['styleDivision'] === '1' || data['styleDivision'] === '2'){
								return '#FFFFFF';
							}else{
								return '#E7E7F3';
							}
						}
					}
				}
			},
			
			renderMapping: {
				
				"refuntAmt": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var html = '<div style="';
						html += value === 'Y' ? '':'width:100%;';
						html += 'float:left;padding-top:2px;"><input class="checkbox" type="checkbox" ';
						html += value === 'Y' ? 'checked':'';
						html += '/></div>';
						
						if(value === 'Y'){
							html += '<div style="width:100%;display:inline-block;margin-left:3px;text-align:left;">';
							
							if(mapping.key === 'checkCurrMthRfndAmt'){
								html += '환급:';
								html += getFormatNumber(data.currMthRfndAmt);
							}
							
							if(mapping.key === 'checkNxtMthRfndAmt'){
								html += '환불:';
								html += getFormatNumber(data.nxtMthRfndAmt);
							}
							
							html += '</div>';
						}
						
						return html;
					}
				},
				
				"dropDown": {
					renderer: function(value, data, render, mapping){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						/*return '<input class="Textinput" id="menu-trigger" style="width:100%;" value="'+value + '">';*/
						return '<input class="Textinput" id="menu-trigger" style="width:100%;">';
					},
					
					postRender: function(cell, value, data, render, mapping, grid){
						
						if(data['companyDivision'] !== '0'){
							return;
						}
						
						var $cell = $(cell);
						$cell.find('.Textinput').convert();
						setTimeout(function(){
							$('#dropdown_menu').open('#menu-trigger');
						}, 50);
						return cell;
					}
				},
				
				"inputNumber": {
					renderer: function(value, data, render, mapping){
						return '<div><input style="width:100%;text-align: right;" type="number" value="'+value+'"></div>';
					}
				}
			},
			
			columnMapping: [{key: 'rnum', title: '순번', width: '40px', rowindexColumn: true},
			                {key: 'flag', width:'30px', align: 'center', editable:false, render: renderFlag, hidden:true}, 
			                {key: 'classification', title: '분류'},
			                {key: 'objYm', title: '청구년월'},
			                
			                {key: 'hdofcOrgNm', title: '본부', width: '180px'},
			                {key: 'trmsMtsoNm', title: '전송실', width: '180px'},
			                {key: 'leslNo', title: '회선번호', width: '120px'},
			                {key: 'dnrSystmNm', title: 'DONOR시스템명', width: '180px', ellipsisText: true},
			                {key: 'rmteSystmNm', title: 'REMOTE시스템명', width: '180px', ellipsisText: true},
			                {key: 'lesDistm', title: '거리'},
			                {key: 'coreCnt', title: '코아수'},
			                {key: 'openDtm', title: '개통일'},
			                {key: 'trmnDtm', title: '해지일'},
			                {key: 'lesCommBizrNm', title: '사업자'},
			                {key: 'basUprc', title: '기본단가', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'mthUtilChag', title: '월이용료', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'tlplChag', title: '전주료', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},
			                {key: 'etcCost', title: '기타', render: {type: "string", rule:"comma"}, editable: {type: "inputNumber"}, allowEdit: funcAllowEdit, editedValue: inputNumberEditedValue, align : 'right'},
			                {key: 'feeSumrAmt', title: '요금계', render: {type: "string", rule:"comma"}, editable: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'drtCalcAplyDayCnt', title: '일할계산적용일수'},
			                {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
			                {key: 'rfndAmt', title: '(환불-/환급+)'},
			                {key: 'currMthRfndAmt', title: '당월환불급', hidden: true},
			                {key: 'checkCurrMthRfndAmt', title: '당월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
			                {key: 'tmthSumrAmt', title: '당월계', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'atrnfDiscAmt', title: '자동이체금액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'splyAmt', title: '공급가액', render: {type: "string", rule:"comma"}, align : 'right'},
			                {key: 'nxtMthRfndAmt', title: '익월환불급', hidden: true},
			                {key: 'checkNxtMthRfndAmt', title: '익월환불급', width: '120px', tooltip: false, allowEdit: funcAllowEdit,
			                	render: {type: "refuntAmt"},
			                	editable: {type: "checkbox", rule: [{value: 'Y', checked: true}, {value: 'N', checked: false}]},
			                	editedValue: checkboxEditedValue},
		                	{key: 'etcRmk', title: '요금변경사유', width: '200px', align: 'center',
			    				render: {type:'string', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editable: {type:'select', 
			    					rule: function(value, data) {
			    						return render_data;
			    					}
			    				},
			    				editedValue : function (cell) {
			    					return  $(cell).find('select option').filter(':selected').val();
			    				},
			    				allowEdit: function(value,data,mapping){
			    					if(data.classification === '사업자'){
			    						return false;	
			    					}
			    					return true;
			    				}
		                	}]

	};

	return options;
}(jQuery, Tango, _));


