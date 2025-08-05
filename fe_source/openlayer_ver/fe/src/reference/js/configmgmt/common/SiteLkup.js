/**
 * SiteLkup.js
 *
 * @author Administrator
 * @date 2017. 11. 13. 오전 16:10:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

	// 초기 진입점
    // param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if (param.regYn == 'Y') {
    		paramData = param;
    	}
    	initGrid();
//    	setRegDataSet(param);
    	setEventListener();

    	if (param.autoSearchYn == 'Y') {
        	setList(param);
        }
    };

    // Grid 초기화
    function initGrid() {
    	// 그리드 생성
        $('#' + gridId).alopexGrid({
        	paging: {
        		pagerSelect: [100, 300, 500, 1000, 5000],
        		hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping: {
    			sorting: true
    		},
    		columnMapping: [{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
    		}, {
				/* 사이트키 */
				key: 'siteCd',
				align: 'center',
				title: '사이트키',
				width: '100px'
			}, {
				/* 사이트명 */
				key: 'siteNm',
				align: 'center',
				title: configMsgArray['siteName'],
				width: '100px'
			}, {
				/* 대표통합시설코드 */
				key: 'repIntgFcltsCd',
				align: 'center',
				title: '대표통합시설코드',
				width: '100px'
			}, {
				/* 임차물건번호1 */
				key: 'lesGdsNo1',
				align: 'center',
				title: '임차물건번호1',
				width: '100px'
			}, {
				/* 임차물건 수 */
				key: 'lesGdsCnt',
				align: 'center',
				title: '임차물건 수',
				width: '100px'
			}, {
				/* 대표장비명 */
				key: 'repEqpNm',
				align: 'center',
				title: '대표장비명',
				width: '100px'
			}, {
				/* 건물명 */
				key: 'bldNm',
				align: 'center',
				title: '건물명',
				width: '100px'
			}, {
				/* 건물구분명 */
				key: 'bldDivNm',
				align: 'center',
				title: '건물구분명',
				width: '100px'
			}, {
				/* [기본정보] 빌딩 카테고리명 */
				key: 'bldCtgNm',
				align: 'center',
				title: '빌딩 카테고리명',
				width: '100px'
			}, {
				/* [기본정보] 기지국사/중계기 */
				key: 'fcltsDivNm',
				align: 'center',
				title: '기지국사/중계기',
				width: '100px'
			}, {
				/* [기본정보] 본부 */
				key: 'hdofcNm',
				align: 'center',
				title: '본부',
				width: '100px'
			}, {
				/* [기본정보] AN팀 */
				key: 'teamNm',
				align: 'center',
				title: 'AN팀',
				width: '100px'
			}, {
				/* 일반/집중국 구분명 */
				key: 'gnrlMtsoDivNm',
				align: 'center',
				title: '일반/집중국 구분명',
				width: '100px'
			}, {
				/* LTE 대표 상위국사 시설코드(LTE서비스 사이트의 DU) */
				key: 'lteRepUmtsoFcltsCd',
				align: 'center',
				title: 'LTE 대표 상위국사 시설코드',
				width: '100px'
			}, {
				/* DU 기준 클러스터 정보(LORA 제외 최인접 DU) */
				key: 'duStdClustEqpCd',
				align: 'center',
				title: 'DU 기준 클러스터 정보',
				width: '100px'
			}, {
				/* [기본정보] 연결집중국명 */
				key: 'connFocsMtsoNm',
				align: 'center',
				title: '연결집중국명',
				width: '100px'
			}, {
				/* [위치정보] 경도 */
				key: 'lngVal',
				align: 'center',
				title: '경도',
				width: '100px'
			}, {
				/* [위치정보] 위도 */
				key: 'latVal',
				align: 'center',
				title: '위도',
				width: '100px'
			}, {
				/* [위치정보] 시도 */
				key: 'sidoNm',
				align: 'center',
				title: '시도',
				width: '100px'
			}, {
				/* [위치정보] 시군구 */
				key: 'sggNm',
				align: 'center',
				title: '시군구',
				width: '100px'
			}, {
				/* [위치정보] 읍면동 */
				key: 'emdNm',
				align: 'center',
				title: '읍면동',
				width: '100px'
			}, {
				/* [위치정보] 지번값 */
				key: 'ltnoVal',
				align: 'center',
				title: '지번',
				width: '100px'
			}, {
				/* [위치정보] 지번상세주소 */
				key: 'dtlAddr',
				align: 'center',
				title: '지번상세',
				width: '100px'
			}, {
				/* [위치정보] 권역명 */
				key: 'laraNm',
				align: 'center',
				title: '권역명',
				width: '100px'
			}, {
				/* [위치정보] 도심/외곽 */
				key: 'areaDivNm',
				align: 'center',
				title: '도심/외곽',
				width: '100px'
			}, {
				/* [위치정보] 실내/외 구분명 */
				key: 'idrOdrDivNm',
				align: 'center',
				title: '실내/외 구분명',
				width: '100px'
			}],
			message: {/* 데이터가 없습니다.   */
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
			}
        });

        gridHide();
    }

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = [];
    	$('#' + gridId).alopexGrid('hideCol', hideColList, 'conceal');
	}

    function setRegDataSet(data) {
    	$('#siteCd').setData({
    		siteCd: data.siteCd
		});
    	$('#siteNm').setData({
    		siteNm: data.siteNm
		});
    }

    function setEventListener() {
    	var perPage = 100;

    	// 페이지 번호 클릭시
    	$('#' + gridId).on('pageSet', function(e) {
        	var eObj = AlopexGrid.parseEvent(e);
        	setGrid(eObj.page, eObj.pageinfo.perPage);
        });

    	// 페이지 selectbox를 변경했을 시.
        $('#' + gridId).on('perPageChange', function(e) {
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	setGrid(1, eObj.perPage);
        });

        // 조회
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, perPage);
        });

        // 엔터키로 조회
        $('#searchForm').on('keydown', function(e) {
        	if (e.which == 13) {
        		setGrid(1, perPage);
        	}
        });

        // 그리드 Row 선택 시
        $('#' + gridId).on('dblclick', '.bodycell', function(e) {
        	var dataObj = AlopexGrid.parseEvent(e).data;
        	$a.close(dataObj);
        });
    }

    function setGrid(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $('#searchForm').getData();

    	$('#' + gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/siteLkup', param, 'GET', 'search');
    }

    function setList(param) {
    	if (JSON.stringify(param).length > 2) {
    		setGrid(1, 100);
        }
    }

    function httpRequest(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, // URL 기존 처럼 사용하시면 됩니다.
    		data : Param, // data가 존재할 경우 주입
    		method : Method, // HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    // request 실패시.
    function failCallback(response, status, jqxhr, flag) {
    	if (flag == 'search') {
    		// 조회 실패 하였습니다.
    		callMsgBox('', 'I', configMsgArray['searchFail'], function(msgId, msgRst){});
    	}
    }

    function successCallback(response, status, jqxhr, flag) {
    	if (flag == 'search') {
			$('#' + gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.lists);
		}
    }

    function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
      		dataLength: Option.pager.totalCnt,	// 총 데이터 길이
      		current: Option.pager.pageNo, 		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
      		perPage: Option.pager.rowPerPage 	// 한 페이지에 보일 데이터 갯수
      	};
       	$('#' + GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}
});