/**
 * KepcoFeeDBAccordanceRateGrid.js
 * 한전요금DB일치율 DataGrid정의
 *
 * @author kim ho yeon(keysollnc)
 * @date 2016. 7. 7. 오전 10:42:00
 * @version 1.0  
 */

		var KepcoFeeDBAccordanceRateGrid = (function($, Tango, _){
			
			var options = {};
			
			options.defineSktDataGrid = {
	
	autoColumnIndex: true,
	//filteringHeader:true,
	enableDefaultContextMenu:false,
	//enableContextMenu:true,
	
	//filteringHeader: true,
	
	headerGroup : [{ fromIndex : 'kepcoChrSktKccnt' , toIndex : 'kepcoChrSktSknSumrCbcnt' , title : "NDIS과금전주" },
	               { fromIndex : 'gisUseSktGisCbcnt' , toIndex : 'gisUseSktSknSumrCbcnt' , title : "GIS사용전주" },
	               { fromIndex : 'fdiqSktSknCbcnt' , toIndex : 'fdiqOthrCmcoCbcnt' , title : "현장조사전주" },
	               { fromIndex : 'kepgisCbcntSumacRateYn' , toIndex : 'gisFildCbcntSumacRateYn' , title : "조수합계 일치율" },
                   { fromIndex : 'eqlJosuCntSkt' , toIndex : 'notEqlJosuCntSkt' , title : "조수 일치수(T)" },
                   { fromIndex : 'eqlJosuCntSkn' , toIndex : 'notEqlJosuCntSkn' , title : "조수 일치수(N)" },
	               { fromIndex : 'kepgisRvSktAnalRsltCtt' , toIndex : 'kepgisRvSknAnalRsltCtt' , title : "NDIS & GIS 검토결과" },
	               { fromIndex : 'kepfdRvCbcntAnalRsltCtt' , toIndex : 'kepfdRvCbcntAnalRsltCtt' , title : "NDIS & 현장 검토결과" },
	               { fromIndex : 'gisFildRvCbcntAnalCtt' , toIndex : 'gisFildRvCbcntAnalCtt' , title : "GIS & 현장 검토결과" },
	               { fromIndex : 'kepcoChrSktChrCbcnt' , toIndex : 'kepcoChrSknChrCbcnt' , title : "NDIS(요금)조수" },
	               { fromIndex : 'sktAwfFeeNormCbcnt' , toIndex : 'sktAwfFeeChrCbcntAcrdYn' , title : "세부내역서 공가요금(T)" },
	               { fromIndex : 'sknAwfFeeNormCbcnt' , toIndex : 'sknAwfFeeChrCbcntAcrdYn' , title : "세부내역서 공가요금(N)" }],
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
	columnMapping: [{key : 'kephdNm', align : 'center', title : '한전본부', width : '90px'},
	                {key : 'kepboNm', align : 'center', title : '한전지사', width : '90px'},
	                {key : 'kepboCd', align : 'center', title : '지사번호', width : '90px'},
	                {key : 'kepcbCd', align : 'center', title : '전주번호', width : '90px'},
	                {key : 'kepcoDrawNo', align : 'center', title : '전산번호', width : '90px'},	                
	                {key : 'kepcoChrSktKccnt', align : 'right', title : 'NDIS조수(T)', width : '90px'},
	                {key : 'kepcoChrSknKccnt', align : 'right', title : 'NDIS조수(N)', width : '90px'},
	                {key : 'kepcoChrSktSknSumrCbcnt', align : 'right', title : '조수합계(T+N)', width : '90px'},
	                {key : 'gisUseSktGisCbcnt', align : 'right', title : 'GIS조수(T)', width : '90px'},
	                {key : 'gisUseSknGisCbcnt', align : 'right', title : 'GIS조수(N)', width : '90px'},
	                {key : 'gisUseGisCbntCnt', align : 'right', title : 'GIS함체수', width : '90px'},
	                {key : 'gisUseSktSknSumrCbcnt', align : 'right', title : '조수합계(T+N)', width : '90px'},
	                {key : 'fdiqSktSknCbcnt', align : 'right', title : '현장조수(T+N)', width : '90px'},
	                {key : 'fdiqKepl5InSktSknCbcnt', align : 'right', title : '5경관이내(T+N)', width : '90px'},
	                {key : 'fdiqCbntCnt', align : 'right', title : '현장함체수', width : '90px'},
	                {key : 'fdiqSkbCbcnt', align : 'right', title : 'SKB조수', width : '90px'},
	                {key : 'fdiqOthrCmcoCbcnt', align : 'right', title : '타통신사조수', width : '90px'},
	                {key : 'kepgisCbcntSumacRateYn', align : 'center', title : 'NDIS & GIS', width : '90px',
	                	value : function(value, data, mapping) {
	                		//if($.trim(data["kepgisCbcntSumacRateYn"]).toUpperCase()=="Y")
	                		return getYnCheck(data["kepgisCbcntSumacRateYn"]);
	        			}

	                },
	                {key : 'kepfdCbcntSumacRateYn', align : 'center', title : 'NDIS & 현장', width : '90px',
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["kepfdCbcntSumacRateYn"]);	                			
	        			}
	                	
	                },
	                {key : 'gisFildCbcntSumacRateYn', align : 'center', title : 'GIS & 현장', width : '90px'
	                	,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["gisFildCbcntSumacRateYn"]);	                			
	        			}	
	                },
                    {key : 'eqlJosuCntSkt', width : '80px', align : 'right', title : '일치조수'},
                    {key : 'notEqlJosuCntSkt', width : '80px', align : 'right', title : '불일치조수'},
                    {key : 'eqlJosuCntSkn', width : '80px', align : 'right', title : '일치조수'},
                    {key : 'notEqlJosuCntSkn', width : '80px', align : 'right', title : '불일치조수'},
	                {key : 'kepgisRvSktAnalRsltCtt', align : 'left', title : '분석결과(T)', width : '90px'},
	                {key : 'kepgisRvSknAnalRsltCtt', align : 'left', title : '분석결과(N)', width : '90px'},
	                {key : 'kepfdRvCbcntAnalRsltCtt', align : 'left', title : '조수분석결과', width : '90px'},
	                {key : 'gisFildRvCbcntAnalCtt', align : 'left', title : '조수분석결과', width : '90px'},
	                {key : 'kepcoChrSktChrCbcnt', align : 'right', title : '과금조수(T)', width : '90px'},
	                {key : 'kepcoChrSknChrCbcnt', align : 'right', title : '과금조수(N)', width : '90px'},
	                {key : 'sktAwfFeeNormCbcnt', align : 'right', title : '정상조수', width : '90px'},
	                {key : 'sktAwfFeeNormFeeAmt', align : 'right', title : '정상요금', width : '90px'},
	                {key : 'sktAwfFeeBrchCbcnt', align : 'right', title : '위약조수', width : '90px'},
	                {key : 'sktAwfFeeBrchAmt', align : 'right', title : '위약금', width : '90px'},
	                {key : 'sktAwfFeeChrSumrCbcnt', align : 'right', title : '과금조수합계', width : '90px'},
	                {key : 'sktAwfFeeSumrAmt', align : 'right', title : '금액합계', width : '90px'},
	                {key : 'sktAwfFeeChrCbcntAcrdYn', align : 'center', title : '과금조수일치여부', width : '90px'
	                	,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["sktAwfFeeChrCbcntAcrdYn"]);	                			
	        			}	
	                },
	                {key : 'sknAwfFeeNormCbcnt', align : 'right', title : '정상조수', width : '90px'},
	                {key : 'sknAwfFeeNormFeeAmt', align : 'right', title : '정상요금', width : '90px'},
	                {key : 'sknAwfFeeBrchCbcnt', align : 'right', title : '위약조수', width : '90px'},
	                {key : 'sknAwfFeeBrchAmt', align : 'right', title : '위약금', width : '90px'},
	                {key : 'sknAwfFeeSumrCbcnt', align : 'right', title : '과금조수합계', width : '90px'},
	                {key : 'sknAwfFeeSumrAmt', align : 'right', title : '금액합계', width : '90px'},
	                {key : 'sknAwfFeeChrCbcntAcrdYn', align : 'center', title : '과금조수일치여부', width : '90px'
	                	,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["sknAwfFeeChrCbcntAcrdYn"]);	                			
	        			}		
	                }
	            ],
    			paging: {
    		      	pagerSelect: false,
    		      	hidePageList: true
    			}
			};
			
			options.defineSkbDataGrid = {
	
	autoColumnIndex: true,
	//filteringHeader:true,
	enableDefaultContextMenu:false,
	//enableContextMenu:true,
	
	//filteringHeader: true,
	
	headerGroup : [{ fromIndex : 'kepcoChrSktKccnt' , toIndex : 'kepcoChrSktSknSumrCbcnt' , title : "NDIS과금전주" },
	               { fromIndex : 'gisUseSktGisCbcnt' , toIndex : 'gisUseSktSknSumrCbcnt' , title : "GIS사용전주" },
	               { fromIndex : 'fdiqSktSknCbcnt' , toIndex : 'fdiqCbntCnt' , title : "현장조사전주" },
	               { fromIndex : 'kepgisCbcntSumacRateYn' , toIndex : 'gisFildCbcntSumacRateYn' , title : "조수합계 일치율" },
                   { fromIndex : 'eqlJosuCntSkt' , toIndex : 'notEqlJosuCntSkt' , title : "조수 일치수(T)" },
                   { fromIndex : 'eqlJosuCntSkn' , toIndex : 'notEqlJosuCntSkn' , title : "조수 일치수(N)" },
	               { fromIndex : 'kepgisRvSktAnalRsltCtt' , toIndex : 'kepgisRvSknAnalRsltCtt' , title : "NDIS & GIS 검토결과" },
	               { fromIndex : 'kepfdRvCbcntAnalRsltCtt' , toIndex : 'kepfdRvCbcntAnalRsltCtt' , title : "NDIS & 현장 검토결과" },
	               { fromIndex : 'gisFildRvCbcntAnalCtt' , toIndex : 'gisFildRvCbcntAnalCtt' , title : "GIS & 현장 검토결과" },
	               { fromIndex : 'kepcoChrSktChrCbcnt' , toIndex : 'kepcoChrSknChrCbcnt' , title : "NDIS(요금)조수" },
	               { fromIndex : 'sktAwfFeeNormCbcnt' , toIndex : 'sktAwfFeeChrCbcntAcrdYn' , title : "세부내역서 공가요금(T)" },
	               { fromIndex : 'sknAwfFeeNormCbcnt' , toIndex : 'sknAwfFeeChrCbcntAcrdYn' , title : "세부내역서 공가요금(N)" }],
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
	columnMapping: [	                
	                {key : 'kephdNm', align : 'center', title : '한전본부', width : '90px'},
	                {key : 'kepboNm', align : 'center', title : '한전지사', width : '90px'},
	                {key : 'kepboCd', align : 'center', title : '지사번호', width : '90px'},
	                {key : 'kepcbCd', align : 'center', title : '전주번호', width : '90px'},
	                {key : 'kepcoDrawNo', align : 'center', title : '전산번호', width : '90px'},	                
	                {key : 'kepcoChrSktKccnt', align : 'right', title : 'NDIS조수(B)', width : '90px'},
					{key : 'kepcoChrSknKccnt', align : 'right', title : 'NDIS조수(D)', width : '90px'},
					{key : 'kepcoChrSktSknSumrCbcnt', align : 'right', title : '조수합계(B+D)', width : '90px'},
					{key : 'gisUseSktGisCbcnt', align : 'right', title : 'GIS조수(B)', width : '90px'},
					{key : 'gisUseSknGisCbcnt', align : 'right', title : 'GIS조수(D)', width : '90px'},
					{key : 'gisUseGisCbntCnt', align : 'right', title : 'GIS함체수', width : '90px'},
					{key : 'gisUseSktSknSumrCbcnt', align : 'right', title : '조수합계(B+D)', width : '90px'},
					{key : 'fdiqSktSknCbcnt', align : 'right', title : '현장조수(B+D)', width : '90px'},
					{key : 'fdiqKepl5InSktSknCbcnt', align : 'right', title : '5경관이내(B+D)', width : '90px'},
					{key : 'fdiqCbntCnt', align : 'right', title : '현장함체수', width : '90px'},
					{key : 'kepgisCbcntSumacRateYn', align : 'center', title : 'NDIS&GIS', width : '90px',						
	                	value : function(value, data, mapping) {
	                		//if($.trim(data["kepgisCbcntSumacRateYn"]).toUpperCase()=="Y")
	                		return getYnCheck(data["kepgisCbcntSumacRateYn"]);
	        			}

	                },
					{key : 'kepfdCbcntSumacRateYn', align : 'center', title : 'NDIS&현장', width : '90px'
						,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["kepfdCbcntSumacRateYn"]);	                			
	        			}
	                	
	                },
					{key : 'gisFildCbcntSumacRateYn', align : 'center', title : 'GIS&현장', width : '90px'
						,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["gisFildCbcntSumacRateYn"]);	                			
	        			}	
	                },
                    {key : 'eqlJosuCntSkt', width : '80px', align : 'right', title : '일치조수'},
                    {key : 'notEqlJosuCntSkt', width : '80px', align : 'right', title : '불일치조수'},
                    {key : 'eqlJosuCntSkn', width : '80px', align : 'right', title : '일치조수'},
                    {key : 'notEqlJosuCntSkn', width : '80px', align : 'right', title : '불일치조수'},
					{key : 'kepgisRvSktAnalRsltCtt', align : 'left', title : '분석결과(B)', width : '90px'},
					{key : 'kepgisRvSknAnalRsltCtt', align : 'left', title : '분석결과(D)', width : '90px'},
					{key : 'kepfdRvCbcntAnalRsltCtt', align : 'left', title : '조수분석결과', width : '90px'},
					{key : 'gisFildRvCbcntAnalCtt', align : 'left', title : '조수분석결과', width : '90px'},
					{key : 'kepcoChrSktChrCbcnt', align : 'right', title : '과금조수(B)', width : '90px'},
					{key : 'kepcoChrSknChrCbcnt', align : 'right', title : '과금조수(D)', width : '90px'},
					{key : 'sktAwfFeeNormCbcnt', align : 'right', title : '정상조수', width : '90px'},
					{key : 'sktAwfFeeNormFeeAmt', align : 'right', title : '정상요금', width : '90px'},
					{key : 'sktAwfFeeBrchCbcnt', align : 'right', title : '위약조수', width : '90px'},
					{key : 'sktAwfFeeBrchAmt', align : 'right', title : '위약금', width : '90px'},
					{key : 'sktAwfFeeChrSumrCbcnt', align : 'right', title : '과금조수합계', width : '90px'},
					{key : 'sktAwfFeeSumrAmt', align : 'right', title : '금액합계', width : '90px'},
					{key : 'sktAwfFeeChrCbcntAcrdYn', align : 'center', title : '과금조수일치여부', width : '90px'
						,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["sktAwfFeeChrCbcntAcrdYn"]);	                			
	        			}	
	                },
					{key : 'sknAwfFeeNormCbcnt', align : 'right', title : '정상조수', width : '90px'},
					{key : 'sknAwfFeeNormFeeAmt', align : 'right', title : '정상요금', width : '90px'},
					{key : 'sknAwfFeeBrchCbcnt', align : 'right', title : '위약조수', width : '90px'},
					{key : 'sknAwfFeeBrchAmt', align : 'right', title : '위약금', width : '90px'},
					{key : 'sknAwfFeeSumrCbcnt', align : 'right', title : '과금조수합계', width : '90px'},
					{key : 'sknAwfFeeSumrAmt', align : 'right', title : '금액합계', width : '90px'},
					{key : 'sknAwfFeeChrCbcntAcrdYn', align : 'center', title : '과금조수일치여부', width : '90px'
						,
	                	value : function(value, data, mapping) {
	                		return getYnCheck(data["sknAwfFeeChrCbcntAcrdYn"]);	                			
	        			}		
	                }
					],
	    			paging: {
	    		      	pagerSelect: false,
	    		      	hidePageList: true
	    			}
}

return options;

}(jQuery, Tango, _));


function getYnCheck(strValue){	
	if($.trim(strValue).toUpperCase()==="Y")
		return "일치";
	else
		return "불일치";
}