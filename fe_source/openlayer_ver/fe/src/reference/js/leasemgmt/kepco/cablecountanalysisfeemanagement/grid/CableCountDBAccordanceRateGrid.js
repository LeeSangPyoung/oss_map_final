/**
 * CableCountDBAccordanceRateGrid.js
 * 조수DB일치율 DataGrid정의
 *
 * @author 임상우  
 * @date 2016. 7. 4. 오후 3:50:00
 * @version 1.0 
 */
var CableCountDBAccordanceRateGrid = (function($, Tango, _){
	
	var options = {};
	
	options.defineSktDataGrid = {
			
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},			
			renderMapping : {
				"number" : {
					renderer : function(value, data, render, mapping){
							if(value != null && value != ""){
								var reg = /(^[+-]?\d+)(\d{3})/;
								value += '';
								while(reg.test(value)){
									value = value.replace(reg, '$1' + ',' + '$2');
								}
								return value;
							}
						}
					}
				},
		
				headerGroup : [{ fromIndex : 'kepcoChrSktStdKepcoCbcnt' , toIndex : 'kepcoChrSktSknSumrCbcnt' , title : "NDIS과금전주" },
				               { fromIndex : 'gisUseSktStdGisCbcnt' , toIndex : 'gisUseSktSknSumrCbcnt' , title : "GIS사용전주" },
				               { fromIndex : 'fdiqSktSknFildSumrCbcnt' , toIndex : 'fdiqTlplOthrCmcoCbcnt' , title : "현장조사전주" },
				               { fromIndex : 'kepgisCbcntSumacRateYn' , toIndex : 'gisFildCbcntSumacRateYn' , title : "조수합계 일치율" },
				               { fromIndex : 'sktAnalKepgisRvRsltNm' , toIndex : 'sknAnalKepgisRvRsltNm' , title : "NDIS & GIS 검토결과" },
				               { fromIndex : 'kccntKepgisFildRvRsltNm' , toIndex : 'kccntKepgisFildRvRsltNm' , title : "NDIS & 현장 검토결과" },
				               { fromIndex : 'gccntKepgisFildRvRsltNm' , toIndex : 'gccntKepgisFildRvRsltNm' , title : "GIS & 현장 검토결과" },
				               { fromIndex : 'fqstrConvSktChrCbcnt' , toIndex : 'fqstrConvSknChrCbcnt' , title : "현장조사표 과금조수변환" },
				               { fromIndex : 'gisChrCcntcSktChrCbcnt' , toIndex : 'gisChrCcntcSknChrCbcnt' , title : "GIS과금조수변환" },
				               { fromIndex : 'fdaisConvSktSknChrCbcnt' , toIndex : 'fdaisConvSktSknChrCbcnt' , title : "현장실사 과금조수변환" },
				               { fromIndex : 'fqstrChrRvSktAnalCtt' , toIndex : 'fqstrChrRvSktSknAnalCtt' , title : "현장조사표 & NDIS 과금 검토결과" },
				               { fromIndex : 'gisChrRvSktAnalCtt' , toIndex : 'gisChrRvSktSknAnalCtt' , title : "GIS & NDIS 과금 검토결과" },
				               { fromIndex : 'fdaisChrRvSktSknAnalCtt' , toIndex : 'fdaisChrRvSktSknAnalCtt' , title : "현장실사 & NDIS 과금 검토결과" },
				               { fromIndex : 'sktKepafNormCbcnt' , toIndex : 'sktKepafChrCbcntAcrdYn' , title : "세부내역서 공가요금(T)" },
				               { fromIndex : 'sknKepafNormCbcnt' , toIndex : 'sknFeeSktChrCbcntAcrdYn' , title : "세부내역서 공가요금(N)" }],
		
			columnMapping: [{title : '순번', width : '40px', numberingColumn : true},
			                {key : 'kephdNm', width : '100px', align : 'left', title : '한전본부'},
			                {key : 'kepboNm', width : '100px', align : 'left', title : '한전지사'},
			                {key : 'kepboCd', width : '100px', align : 'center', title : '사업소번호'},
			                {key : 'kepcoIdxNo', width : '100px', align : 'left', title : '도면번호'},
			                {key : 'kepcoDrawNo', width : '100px', align : 'left', title : '전산번호'},
			                {key : 'kepcoMlNo', width : '100px', align : 'left', title : '선로전주명'},
			                {key : 'kepcoChrSktStdKepcoCbcnt', width : '80px',align : 'right', title : 'NDIS조수(T)', render : {type : "number"}},
			                {key : 'kepcoChrSktCbntYn', width : '80px', align : 'center', title : '함체(T)'},
			                {key : 'kepcoChrKepcoCbcnt', width : '80px',align : 'right', title : 'NDIS조수(N)', render : {type : "number"}},
			                {key : 'kepcoChrSknCbntYn', width : '80px', align : 'center', title : '함체(N)'},
			                {key : 'kepcoChrSktSknSumrCbcnt', width : '80px',align : 'right', title : '조수합계(T+N)', render : {type : "number"}},
			                {key : 'gisUseSktStdGisCbcnt', width : '80px',align : 'right', title : 'GIS조수(T)', render : {type : "number"}},
			                {key : 'gisUseSknGisCbcnt', width : '80px',align : 'right', title : 'GIS조수(N)', render : {type : "number"}},
			                {key : 'gisUseTlplCbntCnt', width : '80px',align : 'right', title : 'GIS함체수', render : {type : "number"}},
			                {key : 'gisUseSktSknSumrCbcnt', width : '80px',align : 'right', title : '조수합계(T+N)', render : {type : "number"}},
			                {key : 'fdiqSktSknFildSumrCbcnt', width : '80px',align : 'right', title : '현장조수(T+N)', render : {type : "number"}},
			                {key : 'fdiqKepl5InSktSknCbcnt', width : '80px',align : 'right', title : '5경관이내(T+N)', render : {type : "number"}},
			                {key : 'fdiqCbntCnt', width : '80px',align : 'right', title : '현장함체수', render : {type : "number"}},
			                {key : 'fdiqSkbCbcnt', width : '80px',align : 'right', title : 'SKB조수', render : {type : "number"}},
			                {key : 'fdiqTlplOthrCmcoCbcnt', width : '80px',align : 'right', title : '타통신사조수', render : {type : "number"}},
			                {key : 'kepgisCbcntSumacRateYn', width : '80px', align : 'center', title : 'NDIS & GIS'},
			                {key : 'kepfdCbcntSumacRateYn', width : '80px', align : 'center', title : 'NDIS & 현장'},
			                {key : 'gisFildCbcntSumacRateYn', width : '80px', align : 'center', title : 'GIS & 현장'},
			                {key : 'sktAnalKepgisRvRsltNm', width : '180px', align : 'left', title : '분석결과(T)'},
			                {key : 'sknAnalKepgisRvRsltNm', width : '180px', align : 'left', title : '분석결과(N)'},
			                {key : 'kccntKepgisFildRvRsltNm', width : '180px', align : 'left', title : '조수분석결과'},
			                {key : 'gccntKepgisFildRvRsltNm', width : '180px', align : 'left', title : '조수분석결과'},
			                {key : 'fqstrConvSktChrCbcnt', width : '80px',align : 'right', title : '과금조수(T)', render : {type : "number"}},
			                {key : 'fqstrConvSknChrCbcnt', width : '80px',align : 'right', title : '과금조수(N)', render : {type : "number"}},
			                {key : 'gisChrCcntcSktChrCbcnt', width : '80px',align : 'right', title : '과금조수(T)', render : {type : "number"}},
			                {key : 'gisChrCcntcSknChrCbcnt', width : '80px',align : 'right', title : '과금조수(N)', render : {type : "number"}},
			                {key : 'fdaisConvSktSknChrCbcnt', width : '80px',align : 'right', title : '과금조수(T+N)', render : {type : "number"}},
			                {key : 'fqstrChrRvSktAnalCtt', width : '80px', align : 'center', title : '분석결과(T)'},
			                {key : 'fqstrChrRvSknAnalCtt', width : '80px', align : 'center', title : '분석결과(N)'},
			                {key : 'fqstrChrRvSktSknAnalCtt', width : '80px', align : 'center', title : '분석결과(T+N)'},
			                {key : 'gisChrRvSktAnalCtt', width : '80px', align : 'center', title : '분석결과(T)'},
			                {key : 'gisChrRvSknAnalCtt', width : '80px', align : 'center', title : '분석결과(N)'},
			                {key : 'gisChrRvSktSknAnalCtt', width : '80px', align : 'center', title : '분석결과(T+N)'},
			                {key : 'fdaisChrRvSktSknAnalCtt', width : '80px', align : 'center', title : '분석결과(T+N)'},
			                {key : 'sktKepafNormCbcnt', width : '80px',align : 'right', title : '정상조수', render : {type : "number"}},
			                {key : 'sktKepafNormAmt', width : '80px',align : 'right', title : '정상요금', render : {type : "number"}},
			                {key : 'sktKepafBrchCbcnt', width : '80px',align : 'right', title : '위약조수', render : {type : "number"}},
			                {key : 'sktKepafBrchAmt', width : '80px',align : 'right', title : '위약금', render : {type : "number"}},
			                {key : 'sktKepafChrSumrCbcnt', width : '80px',align : 'right', title : '과금조수합계', render : {type : "number"}},
			                {key : 'sktKepafSumrAmt', width : '80px',align : 'right', title : '금액합계', render : {type : "number"}},
			                {key : 'sktKepafChrCbcntAcrdYn', width : '80px',title : '과금조수일치여부'},
			                {key : 'sknKepafNormCbcnt', width : '80px',align : 'right', title : '정상조수', render : {type : "number"}},
			                {key : 'sknKepafNormAmt', width : '80px',align : 'right', title : '정상요금', render : {type : "number"}},
			                {key : 'sknKepafBrchCbcnt', width : '80px',align : 'right', title : '위약조수', render : {type : "number"}},
			                {key : 'sknKepafBrchAmt', width : '80px',align : 'right', title : '위약금', render : {type : "number"}},
			                {key : 'sknKepafSktChrSumrCbcnt', width : '80px',align : 'right', title : '과금조수합계', render : {type : "number"}},
			                {key : 'sknKepafSktSumrAmt', width : '80px',align : 'right', title : '금액합계', render : {type : "number"}},
			                {key : 'sknFeeSktChrCbcntAcrdYn', width : '80px', align : 'center', title : '과금조수일치여부'},
			                {key : 'fildAbsneTlplYn', width : '180px', align : 'center', title : '현장부재전주'}],
			    			paging: {
			    		      	pagerSelect: false,
			    		      	hidePageList: true
			    			}
	};
	
	options.defineSkbDataGrid = {
			
		columnFixUpto: 3,
		numberingColumnFromZero : false,
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},			
		renderMapping : {
			"number" : {
				renderer : function(value, data, render, mapping){
					if(value != null && value != ""){
						var reg = /(^[+-]?\d+)(\d{3})/;
						value += '';
						while(reg.test(value)){
							value = value.replace(reg, '$1' + ',' + '$2');
						}
						return value;
					}
				}
			}
		},
		
		headerGroup : [{ fromIndex : 'chrSkbStdKepcoCbcnt' , toIndex : 'chrSkbThnetSumrCbcnt' , title : "NDIS과금전주" },
		               { fromIndex : 'gisUseSkbStdGisCbcnt' , toIndex : 'gisUseSkbThnetSumrCbcnt' , title : "GIS사용전주" },
		               { fromIndex : 'fdiqSkbThnetCbcnt' , toIndex : 'fdiqCbntCnt' , title : "현장조사전주" },
		               { fromIndex : 'equalNdisGisJosu' , toIndex : 'equalGisFieldJosu' , title : "조수합계 일치율" },
		               { fromIndex : 'resultNdisGisTNm' , toIndex : 'resultNdisGisNNm' , title : "NDIS & GIS 검토결과" },
		               { fromIndex : 'resultNdisFieldNm' , toIndex : 'resultNdisFieldNm' , title : "NDIS & 현장 검토결과" },
		               { fromIndex : 'resultGisFieldNm' , toIndex : 'resultGisFieldNm' , title : "GIS & 현장 검토결과" },
		               { fromIndex : 'ndisChargeJosuT' , toIndex : 'ndisChargeJosuN' , title : "현장조사표 과금조수변환" },
		               { fromIndex : 'gisChargeJosuT' , toIndex : 'gisChargeJosuN' , title : "GIS과금조수변환" },
		               { fromIndex : 'fieldChargeJosuTn' , toIndex : 'fieldChargeJosuTn' , title : "현장실사 과금조수변환" },
		               { fromIndex : 'resultNdisChargeT' , toIndex : 'resultNdisChargeTn' , title : "현장조사표 & NDIS 과금 검토결과" },
		               { fromIndex : 'resultGisChargeT' , toIndex : 'resultGisChargeTn' , title : "GIS & NDIS 과금 검토결과" },
		               { fromIndex : 'resultFieldChargeTn' , toIndex : 'resultFieldChargeTn' , title : "현장실사 & NDIS 과금 검토결과" },
		               { fromIndex : 'skbKepafNormCbcnt' , toIndex : 'payEqualT' , title : "세부내역서 공가요금(B)" },
		               { fromIndex : 'thnetKepafNormCbcnt' , toIndex : 'payEqualN' , title : "세부내역서 공가요금(D)" }],
		
		columnMapping: [{title : '순번', width : '40px', numberingColumn : true},
		                {key : 'kephdNm', width : '100px', align : 'left', title : '한전본부'},
		                {key : 'kepboNm', width : '100px', align : 'left', title : '한전지사'},
		                {key : 'kepboCd', width : '100px', align : 'center', title : '사업소번호'},
		                {key : 'kepcoIdxNo', width : '100px', align : 'left', title : '도면번호'},
		                {key : 'kepcoDrawNo', width : '100px', align : 'left', title : '전산번호'},
		                {key : 'kepcoMlLnNo', width : '100px', align : 'left', title : '선로전주명'},
		                {key : 'chrSkbStdKepcoCbcnt', width : '80px',align : 'right', title : 'NDIS조수(B)', render : {type : "number"}},
		                {key : 'ndisBoxOxT', width : '80px', align : 'center', title : '함체(B)'},
		                {key : 'chrThnetStdKepcoCbcnt', width : '80px',align : 'right', title : 'NDIS조수(D)', render : {type : "number"}},
		                {key : 'ndisBoxOxN', width : '80px', align : 'center', title : '함체(D)'},
		                {key : 'chrSkbThnetSumrCbcnt', width : '80px',align : 'right', title : '조수합계(B+D)', render : {type : "number"}},
		                {key : 'gisUseSkbStdGisCbcnt', width : '80px',align : 'right', title : 'GIS조수(B)', render : {type : "number"}},
		                {key : 'gisUseThnetStdGisCbcnt', width : '80px',align : 'right', title : 'GIS조수(D)', render : {type : "number"}},
		                {key : 'gisUseTlplCbntCnt', width : '80px',align : 'right', title : 'GIS함체수', render : {type : "number"}},
		                {key : 'gisUseSkbThnetSumrCbcnt', width : '80px',align : 'right', title : '조수합계(B+D)', render : {type : "number"}},
		                {key : 'fdiqSkbThnetCbcnt', width : '80px',align : 'right', title : '현장조수(B+D)', render : {type : "number"}},
		                {key : 'fdiqKepl5InSkbThnetCbcnt', width : '80px',align : 'right', title : '5경관이내(B+D)', render : {type : "number"}},
		                {key : 'fdiqCbntCnt', width : '80px',align : 'right', title : '현장함체수', render : {type : "number"}},
		                {key : 'equalNdisGisJosu', width : '80px', align : 'center', title : 'NDIS & GIS'},
		                {key : 'equalNdisFieldJosu', width : '80px', align : 'center', title : 'NDIS & 현장'},
		                {key : 'equalGisFieldJosu', width : '80px', align : 'center', title : 'GIS & 현장'},
		                {key : 'resultNdisGisTNm', width : '180px', align : 'left', title : '분석결과(B)'},
		                {key : 'resultNdisGisNNm', width : '180px', align : 'left', title : '분석결과(D)'},
		                {key : 'resultNdisFieldNm', width : '180px', align : 'left', title : '조수분석결과'},
		                {key : 'resultGisFieldNm', width : '180px', align : 'left', title : '조수분석결과'},
		                {key : 'ndisChargeJosuT', width : '80px',align : 'right', title : '과금조수(B)', render : {type : "number"}},
		                {key : 'ndisChargeJosuN', width : '80px',align : 'right', title : '과금조수(D)', render : {type : "number"}},
		                {key : 'gisChargeJosuT', width : '80px',align : 'right', title : '과금조수(B)', render : {type : "number"}},
		                {key : 'gisChargeJosuN', width : '80px',align : 'right', title : '과금조수(D)', render : {type : "number"}},
		                {key : 'fieldChargeJosuTn', width : '80px',align : 'right', title : '과금조수(B+D)', render : {type : "number"}},
		                {key : 'resultNdisChargeT', width : '80px', align : 'center', title : '분석결과(B)'},
		                {key : 'resultNdisChargeN', width : '80px', align : 'center', title : '분석결과(D)'},
		                {key : 'resultNdisChargeTn', width : '80px', align : 'center', title : '분석결과(B+D)'},
		                {key : 'resultGisChargeT', width : '80px', align : 'center', title : '분석결과(B)'},
		                {key : 'resultGisChargeN', width : '80px', align : 'center', title : '분석결과(D)'},
		                {key : 'resultGisChargeTn', width : '80px', align : 'center', title : '분석결과(B+D)'},
		                {key : 'resultFieldChargeTn', width : '80px', align : 'center', title : '분석결과(B+D)'},
		                {key : 'skbKepafNormCbcnt', width : '80px',align : 'right', title : '정상조수', render : {type : "number"}},
		                {key : 'skbKepafNormAmt', width : '80px',align : 'right', title : '정상요금', render : {type : "number"}},
		                {key : 'skbKepafBrchCbcnt', width : '80px',align : 'right', title : '위약조수', render : {type : "number"}},
		                {key : 'skbKepafBrchAmt', width : '80px',align : 'right', title : '위약금', render : {type : "number"}},
		                {key : 'skbKepafChrCbcntSumrAmt', width : '80px',align : 'right', title : '과금조수합계', render : {type : "number"}},
		                {key : 'skbKepafSumrAmt', width : '80px',align : 'right', title : '금액합계', render : {type : "number"}},
		                {key : 'payEqualT', width : '80px', align : 'center', title : '과금조수일치여부'},
		                {key : 'thnetKepafNormCbcnt', width : '80px',align : 'right', title : '정상조수', render : {type : "number"}},
		                {key : 'thnetKepafNormAmt', width : '80px',align : 'right', title : '정상요금', render : {type : "number"}},
		                {key : 'thnetKepafBrchCbcnt', width : '80px',align : 'right', title : '위약조수', render : {type : "number"}},
		                {key : 'thnetKepafBrchAmt', width : '80px',align : 'right', title : '위약금', render : {type : "number"}},
		                {key : 'thnetKepafChrSumrCbcnt', width : '80px',align : 'right', title : '과금조수합계', render : {type : "number"}},
		                {key : 'thnetKepafSumrAmt', width : '80px',align : 'right', title : '금액합계', render : {type : "number"}},
		                {key : 'payEqualN', width : '80px', align : 'center', title : '과금조수일치여부'}],
		    			paging: {
		    		      	pagerSelect: false,
		    		      	hidePageList: true
		    			}
	}
	
	return options;
	
}(jQuery, Tango, _));
