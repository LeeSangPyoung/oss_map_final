 /*
 * @author 김호연
 * @date 2016. 7. 15. 오후 4:47:00
 * @version 1.0
 */  
AlopexGrid.define('defineDataGrid', {
    		autoColumnIndex: true,
    		//filteringHeader:true,
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['kepcoBoNm'] == "소계"){
						return {color:'red'}
					}
					if(data['kepcoBoNm'] == "합계"){
						return {color:'blue'}
					}
				},
		    	styleclass : function(data, rowOption){
		    		if(data['kepcoBoNm'] == "합계"){
		    			return 'row-highlight'
		    		}
		    	} 
			},
			headerGroup: [
			    			{fromIndex:0, toIndex:1, title:"한전", id:'hKepco'},
			    			{fromIndex:2, toIndex:5, title:"전주(조수)", id:'hTlpl'},
			    			{fromIndex:6, toIndex:9, title:"관로", id:'hCdln'},
			    			{fromIndex:10, toIndex:13, title:"중계기", id:'hRpetr'},
			    			{fromIndex:14, toIndex:16, title:"세금계산서발행", id:'hTax'},
			    			{fromIndex:17, toIndex:23, title:"위약금", id:'hBrch'}
			    			 
			    		],
			    		contextMenu : [
			    		              
			    		       		
			    		       	],


    		columnMapping: [{
				key : 'kepcoHdofcNm', align:'center',
				title : '한전본부',
				width: '90px'
			}, {
				key : 'kepcoBoNm', align:'center',
				title : '한전지사',
				width: '90px'
			}, {
				key : 'junjuJosu', align:'center',
				title : '전주(조수)',
				width: '90px'
			}, {
				key : 'junjuCost', align:'center',
				title : '이용료(원)',
				width: '90px'
			}, {
				key : 'junjuRemitCost', align:'right',
				title : '면탈금(원)',
				width: '90px'
			}, {
				key : 'junjuTotal', align:'right',
				title : '계',
				width: '90px'
			}, {
				key : 'pipeDist', align:'right',
				title : '관로(km)',
				width: '90px'				
			}, {
				key : 'pipeUseamt', align:'right',
				title : '이용료(원)',
				width: '90px'				
			}, {
				key : 'pipeRemitCost', align:'right',
				title : '면탈금(원)',
				width: '90px'				
			}
			
			, {
				key : 'pipeTotal', align:'right',
				title : '계',
				width: '90px'				
			}, {
				key : 'rptQty', align:'right',
				title : '수량',
				width: '90px'				
			}, {
				key : 'rptUseAmt', align:'right',
				title : '이용료(원)',
				width: '90px'				
			}, {
				key : 'rptRemitCost', align:'right',
				title : '면탈금(원)',
				width: '90px'				
			}, {
				key : 'rptTotal', align:'right',
				title : '계',
				width: '90px'				
			}, {
				key : 'taxBillLsuenoChg', align:'right',
				title : '이용료(원)',
				width: '90px'				
			}, {
				key : 'taxBillLsuenoTax', align:'right',
				title : '부가세(원)',
				width: '90px'				
			}, {
				key : 'taxBillLsuenoSubTot', align:'right',
				title : '소계',
				width: '90px'				
			}, {
				key : 'junjuUnauthJosu', align:'right',
				title : '무단 전주(조수)	',
				width: '90px'				
			}, {
				key : 'junjuUnauthCostAdd', align:'right',
				title : '전주(조수) 위약요금',
				width: '90px'				
			}, {
				key : 'pipeViolateDist', align:'right',
				title : '무단 관로거리',
				width: '90px'				
			}, {
				key : 'pipeViolateCost', align:'right',
				title : '관로 위약요금',
				width: '90px'				
			}, {
				key : 'prtViolateQty', align:'right',
				title : '무단 중계기수',
				width: '90px'				
			}, {
				key : 'rptViolateCost', align:'right',
				title : '중계기 위약요금',
				width: '90px'				
			}, {
				key : 'violateSubTot', align:'right',
				title : '위약요금 소계',
				width: '90px'				
			}, {
				key : 'violateVatnotInclude', align:'right',
				title : '합계(VAT별도)',
				width: '90px'				
			}, {
				key : 'violateVatinClude', align:'right',
				title : '합계(VAT포함)',
				width: '90px'				
			}]
    	});