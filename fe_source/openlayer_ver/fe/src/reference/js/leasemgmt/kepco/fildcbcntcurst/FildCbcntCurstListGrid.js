/**
 * /resources/js/leasemgmt/kepco/fildcbcntcurst/FildCbcntCurstListGrid.js
 * 현장전주 현황 관리 조회 DataGrid정의
 *
 * @author 정현석
 * @date 2016. 10. 27. 오후 13:40:00
 * @version 1.0
 */
//현장전주 현황 조회 FildCbcntCurstList.jsp
var FildCbcntCurstListGrid = (function($, Tango, _){
	var options = {};
	var ctx = $('input#ctx').val();
	
	options.defineDataGridTlplInf = {
		defaultColumnMapping:{
			sorting: false
		},message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		
		renderMapping : {
			'tlplPicImg' : {
				renderer : function(value, data, render, mapping){
					fileNm = data.tlplPicFileNm;
					value = (data.tlplPicFilePathNm + "/"+ data.tlplPicFileNm);
					if(fileNm == undefined || fileNm == null || fileNm == ""){
						return
					}else{
						return '<img class="Margin-top-5 Padding-bottom-5 layoutSetting" src="'+ctx+'/resources'+value+'" height="30" style="cursor:pointer">';
					}
				}
			},
			'tlplLdstPicImg' : {
				renderer : function(value, data, render, mapping){
					fileNm = data.tlplLdstPicFileNm;
					value = (data.tlplPicFilePathNm + "/"+ data.tlplLdstPicFileNm);
					if(fileNm == undefined || fileNm == null || fileNm == ""){
						return
					}else{
						return '<img class="Margin-top-5 Padding-bottom-5 layoutSetting" src="'+ctx+'/resources'+value+'" height="30" style="cursor:pointer">';
					}
				}
			},
			'tlplSdisPicImg' : {
				renderer : function(value, data, render, mapping){
					fileNm = data.tlplSdisPicFileNm;
					value = (data.tlplPicFilePathNm + "/"+ data.tlplSdisPicFileNm);
					if(fileNm == undefined || fileNm == null || fileNm == ""){
						return
					}else{
						return '<img class="Margin-top-5 Padding-bottom-5 layoutSetting" src="'+ctx+'/resources'+value+'" height="30" style="cursor:pointer">';
					}
				}
			},
			'tlplEtcPicImg' : {
				renderer : function(value, data, render, mapping){
					fileNm = data.tlplEtcPicFileNm;
					value = (data.tlplPicFilePathNm + "/"+ data.tlplEtcPicFileNm);
					if(fileNm == undefined || fileNm == null || fileNm == ""){
						return
					}else{
						return '<img class="Margin-top-5 Padding-bottom-5 layoutSetting" src="'+ctx+'/resources'+value+'" height="30" style="cursor:pointer">';
					}
				}
			},
		},
		
		columnMapping: [{
			key : 'orgNm', align:'center',
			title : '관리본부',
			width: '130px'
		}, {
			key : 'kepboNm1', align:'center',
			title : '한전본부',
			width: '120px'
		},{
			key : 'kepboNm2', align:'center',
			title : '한전지사',
			width: '130px'
		}, {
			key : 'kepboCd', align:'right',
			title : '한전지사코드',
			width: '100px'
		}, {
			key : 'junjuNo', align:'right',
			title : '전주번호',
			width: '100px'
		}, {
			key : 'junjuNm', align:'center',
			title : '현장선로전주명',
			width: '100px'							
		}, {
			key : 'fcltDivCdNm', align:'center',
			title : '시설물유형',
			width: '100px'							
		}, {
			key : 'fieldJunjuNo', align:'center',
			title : '현장한전전산번호',
			width: '150px'
		}, {
			key : 'picShotgDtm', align:'center',
			title : '사진촬영일자',
			width: '130px'
		}, {
			key : 'slfCbntQuty', align:'right',
			title : '자가함체',
			width: '80px'
		}, {
			key : 'ohcpnCbntQuty', align:'right',
			title : '타사함체',
			width: '80px'
		}, {
			key : 'kepcoSlfTlplFildCblCbcnt', align:'right',
			title : '한전전주 설치조수',
			width: '120px'
		}, {
			key : 'sktSlfTlplFildCblCbcnt', align:'right',
			title : 'T자가전주 설치조수',
			width: '120px'
		}
		, {
			key : 'skbSlfTlplFildCblCbcnt', align:'right',
			title : 'B자가전주 설치조수',
			width: '120px'
		}
		, {
			key : 'ohcpnTlplFildCblCbcnt', align:'right',
			title : '타사전주 설치조수',
			width: '120px'
		}
		, {
			key : 'etcTlplFildCblCbcnt', align:'right',
			title : '기타전주 설치조수',
			width: '120px'
		}
		, {
			key : 'linKepl5InsideCbcnt', align:'right',
			title : '5경관이내조수',
			width: '100px'
		}
		, {
			key : 'fildAbsneTlplEyn', align:'center',
			title : '현장설치유무',
			width: '100px'
		}
		, {
			key : 'skbOfcCnt', align:'center',
			title : 'SKB광케이블조수',
			width: '120px'
		}
		, {
			key : 'othrCmcoOfcCbcnt', align:'center',
			title : '타통신사 광케이블조수',
			width: '120px'
		}
		, {
			key : 'othrCblRmk', align:'center',
			title : '타사케이블정보 비고',
			width: '120px'
		}
		, {
			key : 'frstRegUserId', align:'center',
			title : '입력자ID',
			width: '80px'
		}
		, {
			key : 'frstRegDate', align:'center',
			title : '입력일자',
			width: '150px'
		}
		, {
			key : 'lastChgUserId', align:'center',
			title : '수정자ID',
			width: '80px'
		}, {
			key : 'lastChgDate', align:'center',
			title : '수정일자',
			width: '150px'
		}, {
			key : 'tlplRmk', align:'center',
			title : '비고',
			width: '150px'
		}
		, {
			key : 'lginUserTlno', align:'center',
			title : '현장실사전화번호',
			width: '130px'
		}
		, {
			key : 'oprNm', align:'center',
			title : '실사자명',
			width: '80px'
		}
		, {
			key : 'agtNm', align:'center',
			title : '실사업체명',
			width: '80px'
		}
		, {
			key : 'tlplLat', align:'center',
			title : '위도',
			width: '120px'
		}
		, {
			key : 'tlplLng', align:'center',
			title : '경도',
			width: '120px'
		}
		, {
			key : 'tlplPicFileNm', align:'center',
			title : '현장사진',
			width: '100px',
			render : {type : 'tlplPicImg'}
		}
		, {
			key : 'tlplLdstPicFileNm', align:'center',
			title : '원거리사진',
			width: '100px',
			render : {type : 'tlplLdstPicImg'}
		}
		, {
			key : 'tlplSdisPicFileNm', align:'center',
			title : '근거리사진',
			width: '100px',
			render : {type : 'tlplSdisPicImg'}
		}
		, {
			key : 'tlplEtcPicFileNm', align:'center',
			title : '기타사진',
			width: '100px',
			render : {type : 'tlplEtcPicImg'}
		}
		,{key : 'tlplPicFilePathNm', hidden : true}
		,{key : 'kepcoTlplNo', hidden : true}
		,{key : 'fcltTlplNo', hidden : true}
		,{key : 'fcltDivCd', hidden : true}
		,{key : 'skAfcoDivCd', hidden : true}
		],
		paging:{
			pagerSelect:false
		},headerGroup: [	{fromIndex:'slfCbntQuty', toIndex:'ohcpnCbntQuty', title:"접속함체수량"},
             				{fromIndex:'kepcoSlfTlplFildCblCbcnt', toIndex:'etcTlplFildCblCbcnt', title:"자가 광케이블 현장실사 조수현황"},
         					{fromIndex:'skbOfcCnt', toIndex:'othrCblRmk', title:"타사 광케이블 현장실사 조수현황"}
		],
	}
	
	
	
	options.defineDataGridTlpCblInf = {
			defaultColumnMapping:{
				sorting: false
			},message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},
			
			columnMapping: [{
				key : 'junjuNo', align:'center',
				title : '전주번호',
				width: '150px'
			}, {
				key : 'junjuNm', align:'center',
				title : '현장선로전주명',
				width: '120px'
			},{
				key : 'mblFildTpcbSrno', align:'center',
				title : '순번',
				width: '80px'
			}, {
				key : 'pceSctnNm', align:'center',
				title : '피스구간명',
				width: '150px'
			}, {
				key : 'cnntCoreCnt', align:'center',
				title : '코아수',
				width: '100px'
			}, {
				key : 'pceDrcCtt', align:'center',
				title : '피스방향',
				width: '120px'							
			}, {
				key : 'cblMnftNo', align:'center',
				title : '케이블제조번호',
				width: '120px'							
			}, {
				key : 'fildInstlEyn', align:'center',
				title : '현장설치',
				width: '150px'
			}, {
				key : 'linKepl5InsideSctnYn', align:'center',
				title : '인입5경관이내유무',
				width: '140px'
			}, {
				key : 'tlplCblDivCdNm', align:'center',
				title : '설치전주',
				width: '80px'
			}, {
				key : 'ofcIstnRmk', align:'center',
				title : '비고',
				width: '80px'
			}, {
				key : 'frstRegUserId', align:'center',
				title : '입력자ID',
				width: '90px'
			}, {
				key : 'frstRegDate', align:'center',
				title : '입력일자',
				width: '150px'
			}, {
				key : 'lastChgUserId', align:'center',
				title : '수정자ID',
				width: '90px'
			}, {
				key : 'lastChgDate', align:'center',
				title : '수정일자',
				width: '150px'
			}],
			paging:{
				pagerSelect:false
			},
			width : 750
		}
	
	options.defineDataGridCblInf = {
			defaultColumnMapping:{
				sorting: false
			},message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},
			
			columnMapping: [{
				key : 'junjuNo', align:'center',
				title : '전주번호',
				width: '80px'
			}, {
				key : 'junjuNm', align:'center',
				title : '현장선로전주명',
				width: '120px'
			},{
				key : 'mblFildTpcbSrno', align:'center',
				title : '순번',
				width: '80px'
			}, {
				key : 'pceSctnNm', align:'center',
				title : '피스구간명',
				width: '180px'
			}, {
				key : 'cnntCoreCnt', align:'right',
				title : '코아수',
				width: '100px'
			}, {
				key : 'pceDrcCtt', align:'center',
				title : '피스방향',
				width: '120px'							
			}, {
				key : 'cblMnftNo', align:'center',
				title : '케이블제조번호',
				width: '120px'							
			}, {
				key : 'fildInstlEyn', align:'center',
				title : '현장설치',
				width: '150px'
			}, {
				key : 'linKepl5InsideSctnYn', align:'center',
				title : '인입5경관이내유무',
				width: '120px'
			}, {
				key : 'tlplCblDivCdNm', align:'center',
				title : '설치전주',
				width: '100px'
			}, {
				key : 'ofcIstnRmk', align:'center',
				title : '비고',
				width: '120px'
			}, {
				key : 'frstRegUserId', align:'center',
				title : '입력자ID',
				width: '150px'
			}, {
				key : 'frstRegDate', align:'center',
				title : '입력일자',
				width: '150px'
			}, {
				key : 'lastChgUserId', align:'center',
				title : '수정자ID',
				width: '150px'
			}, {
				key : 'lastChgDate', align:'center',
				title : '수정일자',
				width: '150px'
			}],
			paging:{
				pagerSelect:false
			}	
		}

	return options;
	
}(jQuery, Tango, _));