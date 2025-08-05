/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점
	var rlyGrid1 = 'rlyGrid1';
	var rlyGrid2 = 'rlyGrid2';
	var tabParam;
	var otherTabParam;
	var mTagetGrid;
	var mTagetLnst;
	var mTagetRont;
	var patterenMain = '_주';
	var patterenSpr = '_예';
	var startTabIndex = 0;		// 초기 진입 텝을 주회선으로 설정하기 위함
	var lineSeqFlag = false;
	var oneLineOnly = false; 	// 회선명으로 주,예비를 구분할 수 없는 경우(neither)

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	// 원본 param 데이터 복사
    	tabParam = param;
    	// 다른 텝 param 데이터 복사(초기 진입 텝이 주회선일 경우엔 예비회선 텝, 반대일 경우엔 주회선 텝임)
    	otherTabParam = Object.assign({}, param);

		if(param.flag == 'main') {			// 주회선 텝인 경우
            mTagetGrid = rlyGrid1;
            mTagetLnst = 'lnstTable1';
            mTagetRont = 'rontTable1';

            // 예비회선 텝 검색을 위한 회선명 변경 및 seq초기화
            // seq를 초기화 하는 이유는 기간망 유선설계 결과에서 회선명과 기간망 회선번호의 값이 없는 경우에도 상세 페이지를 보여주기 위함
            // 텝 변경 시 getLnstRontLineNoList API 호출에 성공할 경우 seq 값을 재설정함
        	otherTabParam.lineNm = param.lineNm.replace(patterenMain, patterenSpr);
        	otherTabParam.lineSeq = null;
        } else if(param.flag == 'spr'){		// 예비회선 텝인 경우
        	mTagetGrid = rlyGrid2;
        	mTagetLnst = 'lnstTable2';
            mTagetRont = 'rontTable2';

        	// 초기 진입 텝을 예비회선으로 설정하기 위함
        	startTabIndex = 1;

        	otherTabParam.lineNm = param.lineNm.replace(patterenSpr, patterenMain);
        	otherTabParam.lineSeq = null;
        } else if(param.flag == 'neither'){	// 주,예비 회선 구분이 없는 경우
        	mTagetGrid = rlyGrid1;
        	mTagetLnst = 'lnstTable1';
            mTagetRont = 'rontTable1';

            oneLineOnly = true;
        }

		// 초기 진입 텝
    	$('#basicTabs').setTabIndex(startTabIndex);

        setEventListener();  //이벤트
        initGrid();
        callTabHttpRequest(param);
    };

    //Grid 초기화
	function initGrid() {
		$('#'+rlyGrid1).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '11row',
			fitTableWidth : true,
			autoResize: true,
			columnMapping : [
					{/* 회선 구분		*/
					key : 'lineDivVal', align : 'center',
					title : '회선 구분',
					hidden:true,
					width : '70'
				}, {/* 회선 순번		*/
					key : 'lineSeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
				}, {/* 중계 순번		*/
					key : 'rlySeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
				}, {/* 선번장			*/
					key : 'rlyNodeNm', align : 'center',
					title : '선번장',
					width : '110'
				}, {/* TANGO 장비		*/
					key : 'rlyEqpNm', align : 'center',
					title : 'TANGO 장비',
					width : '110'
				}, {/* TANGO 국사			*/
					key : 'mtsoNm', align : 'center',
					title : 'TANGO 국사',
					width : '150'
				}
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});

		$('#'+rlyGrid2).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '11row',
			fitTableWidth : true,
			autoResize: true,
			columnMapping : [
					{/* 회선 구분		*/
					key : 'lineDivVal', align : 'center',
					title : '회선 구분',
					hidden:true,
					width : '70'
				}, {/* 회선 순번		*/
					key : 'lineSeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
				}, {/* 중계 순번		*/
					key : 'rlySeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
				}, {/* 선번장			*/
					key : 'rlyNodeNm', align : 'center',
					title : '선번장',
					width : '110'
				}, {/* TANGO 장비		*/
					key : 'rlyEqpNm', align : 'center',
					title : 'TANGO 장비',
					width : '110'
				}, {/* TANGO 국사			*/
					key : 'mtsoNm', align : 'center',
					title : 'TANGO 국사',
					width : '150'
				}
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	}

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {
    	//탭변경 이벤트
    	$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				mTagetGrid 	= rlyGrid1;
				mTagetLnst = 'lnstTable1';
	            mTagetRont = 'rontTable1';
				break;
			case 1 :
				mTagetGrid 	= rlyGrid2;
				mTagetLnst = 'lnstTable2';
	            mTagetRont = 'rontTable2';
				break;
			default :
				break;
			}

			if(index == startTabIndex) {			// 초기 진입 텝과 같을 경우
				callTabHttpRequest(tabParam);
			} else {								// 초기 진입 텝과 다를 경우
				if(!oneLineOnly) {					// flag가 neither가 아닐 경우
					lineSeqFlag = true;				// 다른 텝의 seq 값을 설정하기 위해 flag를 True로 설정
					callTabHttpRequest(otherTabParam);
				} else {
					httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getRontTrkInfList', tabParam, 'GET', 'searchRontTrk');
					$('#'+mTagetLnst+' td').each(function() {
						$(this).text('');
					});
					$('#'+mTagetRont+' td').each(function() {
						$(this).text('');
					});
				}
			}
			$('#'+mTagetGrid).alopexGrid("viewUpdate");
    	});

    	// 망 구성도 클릭시
		$('#nodeIdBtn').on('click', function(e){
			alertBox('I', '망 구성도 화면 호출 예정');
		});
	};

	function callTabHttpRequest(param){
		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getRontTrkInfList', param, 'GET', 'searchRontTrk');
		$('#'+mTagetLnst).progress();
		$('#'+mTagetRont).progress();
        httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLnstRontLineNoList', param, 'GET', 'searchLineNo');
        $('#'+mTagetGrid).alopexGrid('showProgress');
	}

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'searchRontTrk') {
    		$('#searchRontTrkFrom').setData(response.RontTrkInfList[0]);
    	}

    	if(flag == 'searchLineNo') {
    		$('#'+mTagetLnst).progress().remove();
			$('#'+mTagetRont).progress().remove();
    		$('#searchLineFrom').setData(response.LnstRontLineNoList[0]);

    		// 다른 텝이면서 param.flag가 main이나 spr이고 response.LnstRontLineNoList가 존재하는 경우 seq 값을 설정하고 해당 값으로 getRlyNodeList API를 호출
    		if(lineSeqFlag && response.LnstRontLineNoList.length != 0) {
    			if(response.LnstRontLineNoList[0].lineNm == otherTabParam.lineNm) {
    				otherTabParam.lineSeq = response.LnstRontLineNoList[0].lineSeq;
        			httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getRlyNodeList', otherTabParam, 'GET', 'searchRlyNode');
    			}
    		} else if(response.LnstRontLineNoList.length == 0){
    			$('#'+mTagetLnst+' td').each(function() {
					$(this).text('');
				});
				$('#'+mTagetRont+' td').each(function() {
					$(this).text('');
				});
				$('#'+mTagetGrid).alopexGrid('hideProgress');
    		} else {
    			httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getRlyNodeList', tabParam, 'GET', 'searchRlyNode');
    		}

    		lineSeqFlag = false;
    	}

    	if(flag == 'searchRlyNode'){
    		$('#'+mTagetGrid).alopexGrid('hideProgress');
    		setSPGrid(mTagetGrid, response, response.rlyNodeList);
    	}
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchRontTrk'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchLineNo'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchRlyNode'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    };

    function setSPGrid(GridID,Option,Data) {
    	var serverPageinfo = {};
    	if (GridID == mTagetGrid) {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
//    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
//    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	}

    	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

});