/**
 * LicensingFtlcnBasListGrid.js
 * 인허가 정보 관리 조회 DataGrid정의
 *
 * @author 정현석
 * @date 2016. 10. 10. 오후 13:29:00
 * @version 1.0
 */
//인허가 정보 관리 조회 LicensingFtlcnBasList.jsp
var LicensingFtlcnBasGrid = (function($, Tango, _){
	var options = {};

	options.defineDataGridFtlcnBasSktInfo = {
			defaultColumnMapping:{
				sorting: false
			},message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},
			
			columnMapping: [{
				key : 'lcenMgmtNo', align:'center',
				title : '인허가 관리번호',
				width: '80px'
			}, {
				key : 'mgmtHdofcCd', align:'center',
				title : '관리본부',
				width: '80px'
			}, {
				key : 'mgmtTeam', align:'center',
				title : '관리팀',
				width: '80px'
			}, {
				key : 'sidoNm', align:'center',
				title : '시도',
				width: '80px'
			}, {
				key : 'sggNm', align:'center',
				title : '구군',
				width: '80px'							
			}, {
				key : 'emdNm', align:'center',
				title : '읍면동',
				width: '80px'							
			}, {
				key : 'lcenDtlAddr', align:'center',
				title : '상세주소',
				width: '150px'
			}
			,
			{key : 'skAfcoDivCd', hidden : true}
			],
			paging:{
				pagerSelect:false
			}			
	}
	//SKB 인허가 정보
	options.defineDataGridFtlcnBasSkbInfo = {
			defaultColumnMapping:{
				sorting: false
			},message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},
			
			columnMapping: [{
				key : 'lcenMgmtNo', align:'center',
				title : '인허가 관리번호',
				width: '80px'
			}, {
				key : 'mgmtHdofcCd', align:'center',
				title : '관리본부',
				width: '80px'
			}, {
				key : 'mgmtTeam', align:'center',
				title : '관리팀',
				width: '80px'
			}, {
				key : 'sidoNm', align:'center',
				title : '시도',
				width: '80px'
			}, {
				key : 'sggNm', align:'center',
				title : '구군',
				width: '80px'							
			}, {
				key : 'emdNm', align:'center',
				title : '읍면동',
				width: '80px'							
			}, {
				key : 'lcenDtlAddr', align:'center',
				title : '상세주소',
				width: '150px'
			},
			{key : 'lcenRqsMgmtNo', hidden : true}
			,
			{key : 'skAfcoDivCd', hidden : true}
			],
			paging:{
				pagerSelect:false
			}
			
	}
	//인허가 정보별 시설물
	options.defineDataGridFtlcnInfo = {
			defaultColumnMapping:{
				sorting: false
			},message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},
			
			columnMapping: [{
				key : 'lcenMgmtNo', align:'center',
				title : '관리번호',
				width: '80px'
			}, {
				key : 'lcenFcltSrno', align:'right',
				title : '순번',
				width: '50px'
			}, {
				key : 'lcenFcltKndCdNm', align:'center',
				title : '시설물종류',
				width: '80px'
			}, {
				key : 'fcltStrdCdValNm', align:'center',
				title : '시설물규격',
				width: '150px'
			}, {
				key : 'fcltQuty', align:'right',
				title : '수량',
				width: '80px'							
			}, {
				key : 'gugeWidhVal', align:'right',
				title : '내경(M)/가로(M)',
				width: '130px'							
			}, {
				key : 'ediaHeghVal', align:'right',
				title : '외경(M)/세로(M)',
				width: '130px'
			}, {
				key : 'tknsHghtVal', align:'right',
				title : '두께(M)/높이(M)',
				width: '130px'
			}, {
				key : 'extnDistVal', align:'right',
				title : '연장거리',
				width: '100px'
			}, {
				key : 'eqvlCvsnDiaVal', align:'right',
				title : '등가환산직경(M)',
				width: '130px'
			}, {
				key : 'aplyDt', align:'center',
				title : '단가적용일',
				width: '150px'
			}, {
				key : 'unitUprc', align:'right',
				title : '기준단가(원)',
				width: '100px'
			}, {
				key : 'dypsRsn', align:'center',
				title : '건식사유',
				width: '150px'
			}, {
				key : 'eqpShpCdNm', align:'center',
				title : '장비형상',
				width: '150px'
			}, {
				key : 'cdlnColmShefCdNm', align:'center',
				title : '열/단(관로)',
				width: '150px'
			}, {
				key : 'fcltRemvYr', align:'center',
				title : '철거년도',
				width: '150px'
			}, {
				key : 'lcenFcltRmk', align:'left',
				title : '비고',
				width: '150px'
			}],
			paging:{
				pagerSelect:false
			}			
	}
	
	return options;
	
}(jQuery, Tango, _));