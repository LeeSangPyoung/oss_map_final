/**
 * FhDsnObjMgmt.js
 *
 * @author P135551
 * @date 2019. 1. 29. 오전 13:30:03
 * @version 1.0
 */

var gridModel = null;
var main = $a.page(function() {

	//그리드 ID
    var gridId = 'fhDsnGrid';
    var gridIdExcel = 'dataExcelGrid';
    var dictionaryObj = {};


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$("#fhEngId").setData(param);
        initGrid();
    	setCombo();
    	setEventListener();
    };

  //Grid 초기화
    function initGrid() { //mst & dtl

    	var mapping =  [
    		 {key : 'fhEngDtlId',align:'center',width:'60px',title : '상세ID' }
    		 , {key : 'fhSiteKeyId'       , align:'center', width:'180px', title : '사이트키'}
    		, {key : 'fhNetDivNm' 		 , align:'center', width:'90px', title : '망구분명'}
    		, {key : 'fhHdofcNm' 	 	 , align:'center', width:'80px', title : '본부명'}
    		, {key : 'fhAreaNm'          , align:'center', width:'80px', title : '지역명'}
    		, {key : 'fhYr'              , align:'center', width:'50px', title : '년도'}
    		, {key : 'fhDgr'             , align:'center', width:'50px', title : '차수'}
//    		, {key : 'fhDetlDgr'         , align:'center', width:'90px', title : '세부차수'}
    		, {key : 'fhWbSid'           , align:'center', width:'90px', title : 'WBS'}
    		, {key : 'fhPrjId'           , align:'center', width:'90px', title : 'Project ID'}
    		, {key : 'fhWorkDt'          , align:'center', width:'90px', title : '작업일자'}
//    		, {key : 'fhCoverageMgmtNo'  , align:'center', width:'90px', title : '커버리지관리번호'}
    		, {key : 'fhKeyIdSeq'        , align:'center', width:'80px', title : 'KEYID SQ'}

//    		, {key : 'fhAtnId'           , align:'center', width:'90px', title : '안테나ID'}
    		, {key : 'fhClustId'         , align:'center', width:'90px', title : '클러스터ID'}
    		, {key : 'fhCstrTypNm'       , align:'center', width:'90px', title : '공사유형'}
    		, {key : 'fhDetlCstrTypNm'   , align:'center', width:'95px', title : '세부공사유형'}
    		, {key : 'fhCigkTypNm'       , align:'center', width:'90px', title : '치국유형'}
    		, {key : 'fhAfeDetlclNm'     , align:'center', width:'100px', title : 'AFE세부분류'}
    		, {key : 'fhFocsMtsoSiteId'  , align:'center', width:'180px', title : '사이트'}
    		, {key : 'fhFocsMtsoFcltsCd' , align:'center', width:'90px', title : '시설코드'}
    		, {key : 'fhFocsMtsoSmtsoNm' , align:'left', width:'230px', title : '국소명'}
    		, {key : 'fhFocsMtsoWaraNm'  , align:'center', width:'90px', title : '광역시도'}
    		, {key : 'fhFocsMtsoSggNm'   , align:'center', width:'90px', title : '시군구'}
    		, {key : 'fhFocsMtsoEmdNm'   , align:'center', width:'90px', title : '읍면동'}
    		, {key : 'fhFocsMtsoDetlAddr', align:'left', width:'150px', title : '세부주소'}
    		, {key : 'fhFocsMtsoXcrdVal' , align:'center', width:'90px', title : '위도'}
    		, {key : 'fhFocsMtsoYcrdVal' , align:'center', width:'90px', title : '경도'}
//    		, {key : 'fhBfFcltsCd'       , align:'center', width:'90px', title : '시설코드'}
//    		, {key : 'fhBfSmtsoNm'       , align:'center', width:'90px', title : '국소명'}
//    		, {key : 'fhBfWaraNm'        , align:'center', width:'90px', title : '광역시도'}
//    		, {key : 'fhBfSggNm'         , align:'center', width:'90px', title : '시군구'}
//    		, {key : 'fhBfEmdNm'         , align:'center', width:'90px', title : '읍면동'}
//    		, {key : 'fhBfDetlAddr'      , align:'center', width:'90px', title : '세부주소'}
//    		, {key : 'fhBfXcrdVal'       , align:'center', width:'90px', title : '위도'}
//    		, {key : 'fhBfYcrdVal'       , align:'center', width:'90px', title : '경도'}
//    		, {key : 'fhBfVendNm'        , align:'center', width:'90px', title : '제조사'}
//    		, {key : 'fhBfMeansNm'       , align:'center', width:'90px', title : '방식'}
//    		, {key : 'fhBfDetlMeansNm'   , align:'center', width:'90px', title : '세부방식'}
//    		, {key : 'fhBfEqpId'         , align:'center', width:'90px', title : '장비'}
//    		, {key : 'fhBfShpNm'         , align:'center', width:'90px', title : '형상'}
//    		, {key : 'fhBfFaNm'          , align:'center', width:'90px', title : 'F명'}
//    		, {key : 'fhBfChnlCardNm'    , align:'center', width:'90px', title : '채널카드'}
    		, {key : 'fhOnafFcltsCd'     , align:'center', width:'90px', title : '시설코드'}
    		, {key : 'fhOnafSmtsoNm'     , align:'left', width:'230px', title : '국소명'}
    		, {key : 'fhOnafWaraNm'      , align:'center', width:'80px', title : '광역시도'}
    		, {key : 'fhOnafSggNm'       , align:'center', width:'100px', title : '시군구'}
    		, {key : 'fhOnafEmdNm'       , align:'center', width:'100px', title : '읍면동'}
    		, {key : 'fhOnafDetlAddr'    , align:'left', width:'150px', title : '세부주소'}
    		, {key : 'fhOnafXcrdVal'     , align:'center', width:'90px', title : '위도'}
    		, {key : 'fhOnafYcrdVal'     , align:'center', width:'90px', title : '경도'}
    		, {key : 'fhOnafVendNm'      , align:'center', width:'80px', title : '제조사'}
    		, {key : 'fhOnafMeansNm'     , align:'center', width:'80px', title : '방식'}
    		, {key : 'fhOnafDetlMeansNm' , align:'center', width:'80px', title : '세부방식'}
    		, {key : 'fhOnafEqpId'       , align:'center', width:'120px', title : '장비'}
    		, {key : 'fhOnafFreqNm'      , align:'center', width:'90px', title : '주파수'}
    		, {key : 'fhOnafConnNm'      , align:'center', width:'90px', title : '연결/종단'}
    		, {key : 'fhOnafIndpIntgNm'  , align:'center', width:'90px', title : '단독/통합'}
    		, {key : 'fhOnafWrwlsNm'     , align:'center', width:'90px', title : '유선/무선'}
    		, {key : 'fhOnafShpNm'       , align:'center', width:'90px', title : '형상'}
    		, {key : 'fhOnafFaNm'        , align:'center', width:'90px', title : 'FA'}
    		, {key : 'fhOnafChnlCardNm'  , align:'center', width:'90px', title : '채널카드'}
    		, {key : 'fhOnafChnlCardCnt' , align:'center', width:'90px', title : 'CC'}
    		, {key : 'fhOpTeamNm'        , align:'center', width:'120px', title : '운용CC'}
    		, {key : 'fhCnstTeamNm'      , align:'center', width:'120px', title : '구축CC'}
    		, {key : 'fhWeakZnNm'        , align:'center', width:'90px', title : '취약지구'}
    		, {key : 'fhRefcFcltsCd'     , align:'center', width:'130px', title : '(DE/CP:CDMA,W Only:WCDMA)'}
    		, {key : 'fhInvtLclNm'       , align:'center', width:'110px', title : '대분류'}
    		, {key : 'fhInvtMclNm'       , align:'center', width:'110px', title : '중분류'}
    		, {key : 'fhInvtSclNm1'      , align:'center', width:'110px', title : '소분류1'}
    		, {key : 'fhInvtSclNm2'      , align:'center', width:'110px', title : '소분류2'}
    		, {key : 'fhAreaInfNm'       , align:'center', width:'90px', title : '지역정보'}
    		, {key : 'fhLaraInfNm'       , align:'center', width:'90px', title : '권역정보'}
    		, {key : 'fhLtef800mFcltsCd' , align:'center', width:'90px', title : '시설코드'}
    		, {key : 'fhLtef800mSmtsoNm' , align:'left', width:'230px', title : '국소명'}
    		, {key : 'fhLtef800mDistVal' , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
    		}
    		, {key : 'fhLtef18gFcltsCd'  , align:'center', width:'90px', title : '시설코드'}
    		, {key : 'fhLtef18gSmtsoNm'  , align:'center', width:'230px', title : '국소명'}
    		, {key : 'fhLtef18gDistVal'  , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
    		}
    		, {key : 'fhLtef21gFcltsCd'  , align:'center', width:'90px', title : '시설코드'}
    		, {key : 'fhLtef21gSmtsoNm'  , align:'center', width:'230px', title : '국소명'}
    		, {key : 'fhLtef21gDistVal'  , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
    		}
    		, {key : 'fhLtef26gFcltsCd'  , align:'center', width:'90px', title : '시설코드'}
    		, {key : 'fhLtef26gSmtsoNm'  , align:'center', width:'230px', title : '국소명'}
    		, {key : 'fhLtef26gDistBal'  , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
    		}
//    		, {key : 'frstRegDate'       , align:'center', width:'90px', title : '등록일'}
//    		, {key : 'frstRegUserId'     , align:'center', width:'90px', title : '등록자'}
//    		, {key : 'lastChgDate'       , align:'center', width:'90px', title : '수정일'}
//    		, {key : 'lastChgUserId' 	, align:'center', width:'90px', title : '수정자'}
    		, {key : 'fhFocsMtsoSiteNm'       , align:'center', width:'120px', title : '사이트명 '}
    		, {key : 'fhFocsMtsoFcltsCd1'       , align:'center', width:'90px', title : '공용대표시설코드'}
    		, {key : 'fhFocsInfgFcltsNm'       , align:'left', width:'250px', title : '공용대표시설코드명 '}
    		, {key : 'fhOnaSiteKeyNm'       , align:'center', width:'120px', title : '사이트명 '}
    		, {key : 'fhOnafFcltsCd1'       , align:'center', width:'90px', title : '공용대표시설코드'}
    		, {key : 'fhOnafInfgFcltsNm'       , align:'left', width:'250px', title : '공용대표시설코드명 '}
    		, {key : 'splyMeansCd',align:'center',width:'130px',title : '공급방식'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'splyMeansApmtRsn',align:'center',width:'200px',title : '지정사유'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'splyEqpMdlNm',align:'center',width:'130px',title : '장비모델'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'splyEqpNm',align:'center',width:'130px',title : '장비명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'chnlVal',align:'center',width:'70px',title : '채널'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'wavlVal',align:'center',width:'80px',title : '파장'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'repSvlnNo',align:'center',width:'110px',title : '기존회선'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'repNtwkLineNo',align:'center',width:'110px',title : '기존링'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'eteTrceDistm',
    			align:'center',
    			width:'120px',
    			title : 'GIS ETE 거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'mtsoStlnDistm',
    			align:'center',
    			width:'120px',
    			title : '국사직선거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'cnntDistm',
    			align:'center',
    			width:'120px',
    			title : '선로접속거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'cnntInvtCst',
    			align:'center',
    			width:'110px',
    			title : '선로접속비',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'icreDistm',
    			align:'center',
    			width:'120px',
    			title : '선로증설거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'icreInvtCst',
    			align:'center',
    			width:'110px',
    			title : '선로증설비',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'eqpMdlId',
    			align:'center',
    			width:'110px',
    			title : '장비모델'
				,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'eqpInvtCst',
    			align:'center',
    			width:'110px',
    			title : '장비투자비',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'uprmtoJugCd',align:'center',width:'90px',title : '판단조건'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
       		, {key : 'uprMtsoId',align:'center',width:'110px',title : '국사ID'
       			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
       		}
    		, {key : 'uprMtsoNm',align:'left',width:'170px',title : '국사명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'umtsoEqpNm',align:'left',width:'200px',title : '장비명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'umtsoLtdAddr',
    			align:'center',
    			width:'300px',
    			title : '주소'
    				,styleclass : function(value,data,mapping){
                        return 'row-highlight-gray';
      			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'umtsoLttVal',
    			align:'center',
    			width:'80px',
    			title : '위도',
    			render:function(value, data, render, mapping){
    				if(value != undefined && value != null){
    					var val = parseFloat(value);
    					val = val.toFixed(6);
    				}
    				return val;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
//    		, styleclass : function(value,data,mapping){
//	                  return 'row-highlight-gray';
//				  	}
    		}
    		, {
    			key : 'umtsoLngVal',
    			align:'center',
    			width:'80px',
    			title : '경도',
    			render:function(value, data, render, mapping){
    				if(value != undefined && value != null){
    					var val = parseFloat(value);
    					val = val.toFixed(6);
    				}
    				return val;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
//    		, styleclass : function(value,data,mapping){
//                      return 'row-highlight-gray';
//    			  	}
    		}
    		, {key : 'lowmtoJugCd',align:'center',width:'90px',title : '판단조건'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}

    		, {key : 'lowMtsoId',align:'center',width:'110px',title : '국사ID'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
		  		}
    		, {key : 'lowMtsoNm',align:'left',width:'170px',title : '국사명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
  			  		}
    		, {key : 'lmtsoEqpNm',align:'left',width:'200px',title : '장비명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'lmtsoLtdAddr',
    			align:'center',
    			width:'300px',
    			title : '주소',styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {
    			key : 'lmtsoLttVal',
    			align:'center',
    			width:'80px',
    			title : '위도',
    			render:function(value, data, render, mapping){
    				if(value != undefined && value != null){
    					var val = parseFloat(value);
    					val = val.toFixed(6);
    				}
    				return val;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
//    		, styleclass : function(value,data,mapping){
//                      return 'row-highlight-gray';
//    			  	}
    		}
    		, {
    			key : 'lmtsoLngVal',
    			align:'center',
    			width:'80px',
    			title : '경도',
    			render:function(value, data, render, mapping){
    				if(value != undefined && value != null){
    					var val = parseFloat(value);
    					val = val.toFixed(6);
    				}
    				return val;
    			},styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'
//    		,styleclass : function(value,data,mapping){
//                      return 'row-highlight-gray';
//    			  	}
    		}
    		, {key : 'cotMtsoNm',align:'center',width:'110px',title : '국사명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'}
    		, {key : 'cotSiteCd',align:'center',width:'110px',title : '사이트키'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'}
    		, {key : 'rt1MtsoNm',align:'center',width:'110px',title : '국사명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'}
    		, {key : 'rt1SiteCd',align:'center',width:'110px',title : '사이트키'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'}
    		, {key : 'rt2MtsoNm',align:'center',width:'110px',title : '국사명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'}
    		, {key : 'rt2SiteCd',align:'center',width:'110px',title : '사이트키'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}, headerStyleclass : 'headerBackGroundBlueS'}

//    		,{key : 'hdofcNm',align:'center',width:'60px',title : '본부명'}
//    		,{key : 'erpHdofcCd',align:'center',width:'60px',title : 'ERP코드'}

    	];

    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/FhDsnPopupDtlList"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 10000,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });

    	$('#'+gridIdExcel).alopexGrid({
			paging : false,
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: mapping
			,

            headerGroup:
    			[
    				{fromIndex:1, toIndex:10, title:'기본 정보'},
            		{fromIndex:11, toIndex:11, title:'5G Planning'},
            		{fromIndex:12, toIndex:15, title:'기본 정보'},
            		{fromIndex:16, toIndex:24, title:'관련 집중국 정보'},
            		{fromIndex:25, toIndex:44, title:'이후정보'},
            		{fromIndex:45, toIndex:46, title:'팀구분'},
            		{fromIndex:48, toIndex:48, title:'서비스 커버리지'},
            		{fromIndex:49, toIndex:52, title:'투자목적'},
            		{fromIndex:55, toIndex:66, title:'CO-LOC or 인접 대표 시설 RU 정보'},
            		{fromIndex:67, toIndex:69, title:'관련집중국 추가정보'},
            		{fromIndex:70, toIndex:72, title:'이후정보 추가정보'},
            		{fromIndex:73, toIndex:88, title:'F/H 공급방식 자동 산출', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:89, toIndex:102, title:'F/H 설계 기준 정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:103, toIndex:108, title:'링먹스 정보', headerStyleclass : 'headerBackGroundBlueS'},

            		{fromIndex:48, toIndex:48, title:'참조 시설코드'},
            		{fromIndex:55, toIndex:57, title:'LTE800'},
            		{fromIndex:58, toIndex:60, title:'LTE1.8'},
            		{fromIndex:61, toIndex:64, title:'LTE2.1'},
            		{fromIndex:65, toIndex:66, title:'LTE2.6'},
            		{fromIndex:73, toIndex:74, title:'공급방식' , headerStyleclass : 'headerBackGroundBlueS' },
            		{fromIndex:75, toIndex:78, title:'공급방식 추천정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:79, toIndex:82, title:'공급방식 판단정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:83, toIndex:88, title:'유선망 투자비', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:89, toIndex:95, title:'상위국 정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:96, toIndex:102, title:'하위국 정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:103, toIndex:104, title:'COT', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:105, toIndex:106, title:'RT1', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:107, toIndex:108, title:'RT2', headerStyleclass : 'headerBackGroundBlueS'}
    		    ]
		});

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : false,
             rowInlineEdit : true,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:true,
         	   pagerSelect:false,
         	   hidePageList:true
            },

            headerGroup:
    			[
    				{fromIndex:1, toIndex:10, title:'기본 정보'},
            		{fromIndex:11, toIndex:11, title:'5G Planning'},
            		{fromIndex:12, toIndex:15, title:'기본 정보'},
            		{fromIndex:16, toIndex:24, title:'관련 집중국 정보'},
            		{fromIndex:25, toIndex:44, title:'이후정보'},
            		{fromIndex:45, toIndex:46, title:'팀구분'},
            		{fromIndex:48, toIndex:48, title:'서비스 커버리지'},
            		{fromIndex:49, toIndex:52, title:'투자목적'},
            		{fromIndex:55, toIndex:66, title:'CO-LOC or 인접 대표 시설 RU 정보'},
            		{fromIndex:67, toIndex:69, title:'관련집중국 추가정보'},
            		{fromIndex:70, toIndex:72, title:'이후정보 추가정보'},
            		{fromIndex:73, toIndex:88, title:'F/H 공급방식 자동 산출', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:89, toIndex:102, title:'F/H 설계 기준 정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:103, toIndex:108, title:'링먹스 정보', headerStyleclass : 'headerBackGroundBlueS'},

            		{fromIndex:48, toIndex:48, title:'참조 시설코드'},
            		{fromIndex:55, toIndex:57, title:'LTE800'},
            		{fromIndex:58, toIndex:60, title:'LTE1.8'},
            		{fromIndex:61, toIndex:64, title:'LTE2.1'},
            		{fromIndex:65, toIndex:66, title:'LTE2.6'},
            		{fromIndex:73, toIndex:74, title:'공급방식', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:75, toIndex:78, title:'공급방식 추천정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:79, toIndex:82, title:'공급방식 판단정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:83, toIndex:88, title:'유선망 투자비', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:89, toIndex:95, title:'상위국 정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:96, toIndex:102, title:'하위국 정보', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:103, toIndex:104, title:'COT', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:105, toIndex:106, title:'RT1', headerStyleclass : 'headerBackGroundBlueS'},
            		{fromIndex:107, toIndex:108, title:'RT2', headerStyleclass : 'headerBackGroundBlueS'}
    		    ]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
   	         model: gridModel                  // ajax option에 grid 연결할 model을지정
   		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
   		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
            ,height: "8row"
//            	,filteringHeader : true
        });
    }

    var showProgress = function(gridId){
		$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

	function setCombo() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03010', null, 'GET', 'MtsoJugList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03012', null, 'GET', 'splyMeansList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getErpHdofcId', null, 'GET', 'getErpHdofcId');
		setTimeout(initGridModel, 500);
    }


	function initGridModel()
	{
		var dataParam =  $("#fhDsnRegForm").getData();
    	dataParam.pageNo = '1';
    	dataParam.rowPerPage = '10000';
    	var hdofc = $("#hdofcNm").getTexts();
   		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
        	dataParam.hdofcNm = "";
   		}else{
        	dataParam.hdofcNm = hdofc[0];
   		}
		gridModel.get({
    		data: dataParam
    	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'search');})
    	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});

		setTimeout(httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhDsnPopupInfo', dataParam, 'GET', 'info'), 10000);
	}

	 function setComma(str) {
			var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
			str += ""; // 숫자를 문자열로 변환
			str = str.replace(/[a-zA-Z]/gi, '');
			while ( reg.test(str) ) {
				str = str.replace(reg, "$1" + "," + "$2");
			}

			return str;
		};
		function number_format(number, digits, dec_point, thousands_sep){
			// *		example 1: number_format(1234.5678, 2);
			// *		returns	1: 1234.57
			number = number.toString();
			if (!number) return;

			var parts = number.split('.');
			parts[0] = parts[0].replace(/\B(?=(d\{3})+(?!\d))/g, ',');

			//decimals : 소수점 이하
			var dec = parts[1] || '';

			if(digits) {
				var d = parseInt(digits);
				dec = dec.length >= parseInt(d) ? parseFloat('0.'+dec).toFixed(d).split('.')[1] : dec + new Array(d - dec.length + 1).join('0');
			}

			if(dec && digits>0){
				return parts[0] + '.' + dec;
			}else {
				return parts[0];
			}
		}
    function setEventListener() {
    	//엔터키로 조회
        $('#dtlSearch').on('keydown', function(e){
    		if (e.which == 13  ){
    			$('#search').click();
      		}
    	 });
    	$("#btnCnclReg").on('click', function(e){
    		$a.close();
    	});

        $('#btnFhDsnSite').on('click', function(e) {
    		var dataParam = $("#dtlSearch").getData();
    		dataParam.fhEngId = $("#fhEngId").val();
    		dataParam.pageNo = '1';
        	dataParam.rowPerPage = '10000';
        	$a.popup({
   	 			popid: 'FhDsnSitePopup',
   	 			title: '사이트별수량',
   	 			url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnSitePopup.do',
   	 			data: dataParam,
   	 			windowpopup : true,
	   	 		modal: false,
                movable:true,
   	 			width : 1250,
   	 			height : 630
   	 		});
    	});

    	$("#search").on('click', function(e){
    		var dataParam = $("#dtlSearch").getData();
    		dataParam.fhEngId = $("#fhEngId").val();
    		dataParam.pageNo = '1';
        	dataParam.rowPerPage = '10000';
           	var hdofc = $("#hdofcNm").getTexts();
       		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
            	dataParam.hdofcNm = "";
       		}else{
            	dataParam.hdofcNm = hdofc[0];
       		}
    		gridModel.get({
        		data: dataParam
        	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'search');})
        	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});
    	});

    	$('#btnExportExcel').on('click', function(e) {
    		btnExportExcelOnDemandClickEventHandler(e);
         });
    };


    function btnExportExcelOnDemandClickEventHandler(event){

    	   //장비조회조건세팅
        var param =  $("#fhDsnRegForm").getData();
        var hdofc = $("#hdofcNm").getTexts();
        if(param.hdofcNm == "" || param.hdofcNm  == null ){
        	param.hdofcNm = "";
   		}else{
   			param.hdofcNm = hdofc[0];
   		}
   		param = gridExcelColumn(param, gridId);
   		param.pageNo = 1;
   		param.rowPerPage = 60;
   		param.firstRowIndex = 1;
   		param.lastRowIndex = 10000;
   		param.inUserId = $("#userId").val();
   		param.fhEngId = $("#fhEngId").val();

    	 /* 엑셀정보     	 */
   	    var now = new Date();
        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
        var excelFileNm = 'FrontHole_Result_'+dayTime;
   		param.fileName = excelFileNm;
   		param.fileExtension = "xlsx";
   		param.excelPageDown = "N";
   		param.excelUpload = "N";
   		param.excelMethod = "getFhDsnFnshPopup";
   		param.excelFlag = "FhDsnFnshPopup";
   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
        fileOnDemendName = excelFileNm+".xlsx";
		 	$('#'+gridId).alopexGrid('showProgress');
		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
    }

    function gridExcelColumn(param, gridId) {
    	var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");

    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

		for(var i=0; i<gridHeaderGroup.length; i++) {
			if(gridHeaderGroup[i].title != undefined) {
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		}

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}


		/*======해더그룹정보======*/
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupColor = excelHeaderGroupColor;


		/*======해더정보======*/
		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

    function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successCallback(response, sflag);})
    	  .fail(function(response){failCallback(response, sflag);})
    	  //.error();
    }

    function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                }
            });
	}

    function successCallback(response, status, jqxhr, flag){
    	if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }
    	if(flag == 'MtsoJugList'){
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			dictionaryObj[resObj.comCd] = resObj.comCdNm;
    		}

    		$("#uprMtsoJugCd").clear();
    		$("#lowMtsoJugCd").clear();
    		var option_data =  [{comCd: "",comCdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$("#uprMtsoJugCd").setData({
    			data:option_data
    		});
    		$("#lowMtsoJugCd").setData({
    			data:option_data
    		});
    	}


    	if(flag == 'getErpHdofcId'){
    		var erpHdofCdId = "";
    		if(response.length >= 1 ){
    			erpHdofCdId = response[0].erpHdofcCd;
    		}
    		$("#hdofcNm").clear();
    		var option_data =  [{cd: "",cdNm: "선택하세요"}];
    		option_data.push({cd: "5100", cdNm: "수도권"});
    		option_data.push({cd: "5300", cdNm: "부산"});
    		option_data.push({cd: "5600", cdNm: "중부"});
    		option_data.push({cd: "5400", cdNm: "대구"});
    		option_data.push({cd: "5500", cdNm: "서부"});
    		$("#hdofcNm").setData({
    			data:option_data
//    			,hdofcNm: erpHdofCdId
    		});
    	}

    	if(flag == 'splyMeansList'){
    		$("#splyMeansCd").clear();
    		var option_data =  [{comCd: "",comCdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$("#splyMeansCd").setData({
    			data:option_data
    		});

    	}



    	if(flag == 'info'){
    		if(response.fhDsnInfo[0].uprMtsoJugCd != '' && response.fhDsnInfo[0].uprMtsoJugCd != null && response.fhDsnInfo[0].uprMtsoJugCd != undefined){
    			var uprMtsoJugCdList = response.fhDsnInfo[0].uprMtsoJugCd.split(',');
    			var uprMtsoJugCd = "";
    			for(var i=0; i<uprMtsoJugCdList.length; i++){
    				var tmpCd = uprMtsoJugCdList[i].replace(" ", "");
    				uprMtsoJugCd += dictionaryObj[tmpCd];
    			}
    			response.fhDsnInfo[0].uprMtsoJugCd = uprMtsoJugCd;
    		}

    		if(response.fhDsnInfo[0].lowMtsoJugCd != '' && response.fhDsnInfo[0].lowMtsoJugCd != null && response.fhDsnInfo[0].lowMtsoJugCd != undefined){
	    		var lowMtsoJugCdList = response.fhDsnInfo[0].lowMtsoJugCd.split(',');
	    		var lowMtsoJugCd = "";
	    		for(var i=0; i<lowMtsoJugCdList.length; i++){
	    			var tmpCd = lowMtsoJugCdList[i].replace(" ", "");
	    			lowMtsoJugCd += dictionaryObj[tmpCd];
	    		}
	    		response.fhDsnInfo[0].lowMtsoJugCd = lowMtsoJugCd;
    		}
    		if(response.fhDsnInfo[0].fh5gsmuxNwUprc != '' && response.fhDsnInfo[0].fh5gsmuxNwUprc != null && response.fhDsnInfo[0].fh5gsmuxNwUprc != undefined){
	    		var fh5gsmuxTotalUprc = "신설: " + response.fhDsnInfo[0].fh5gsmuxNwUprc  + " / 기설: " + response.fhDsnInfo[0].fh5gsmuxExistsUprc
	    		response.fhDsnInfo[0].fh5gsmuxTotalUprc = fh5gsmuxTotalUprc;
    		}
    		if(response.fhDsnInfo[0].fh5gponNwUprc != '' && response.fhDsnInfo[0].fh5gponNwUprc != null && response.fhDsnInfo[0].fh5gponNwUprc != undefined){
	    		var fh5gponTotalUprc = "신설: " + response.fhDsnInfo[0].fh5gponNwUprc  + " / 기설: " + response.fhDsnInfo[0].fh5gponExistsUprc
	    		response.fhDsnInfo[0].fh5gponTotalUprc = fh5gponTotalUprc;
    		}

    		$("#fhDsnRegForm").setData(response.fhDsnInfo[0]);
    	}


    	if(flag == 'excleDownload'){
    		setSPGrid(gridIdExcel, response, response.lists);

    	 	var worker = new ExcelWorker({
    			excelFileName: 'fhDsnFnshPopup',
//    			defaultPalette : {
//    				font : '맑은고딕',
//    				fontSize : 11,
//    			},
    			sheetList : [{
    				sheetName : 'sheet1',
    				$grid : $('#'+gridIdExcel)
    			}]
    		});

    		worker.export({
//    			exportType : "csv",
    			selected : false,
    			border : true,
				exportHidden : false,
				useGridColumnWidth: true,
				merge : false
    		});

//    		$('#'+gridId).alopexGrid('hideProgress');
    		bodyProgressRemove();
        }
    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};

		var size = 0;

		for (var a = 0; a < Data.length; a++) {
			var stat = true;

			//id/pwd는 한건만 표시해준다
			if(Data[a].lginId != undefined){
				var lginId = Data[a].lginId.split(',');

				eval("Data["+a+"].lginId = lginId[0]");
			}

			if(Data[a].lginPwd != undefined){
				var lginPwd = Data[a].lginPwd.split(',');

				eval("Data["+a+"].lginPwd = lginPwd[0]");
			}

			if(Data[a].portVal != undefined){
				var portVal = Data[a].portVal.split(',');

				for(var b=0; b < portVal.length; b++){
					eval("Data["+a+"].portVal"+b+" = portVal["+b+"]");
				}

				//최대 포트수를 가져오기위함
				if(size < portVal.length){
					size = portVal.length;
				}
			}

			if(Data[a].portUseYn != undefined){
				var portUseYn = Data[a].portUseYn.split(',');

				for(var b=0; b < portUseYn.length; b++){
					eval("Data["+a+"].portUseYn"+b+" = portUseYn["+b+"]");
				}
			}

			if(Data[a].curObjVal != undefined){
				var curObjVal = Data[a].curObjVal.split(',');

				for(var b=0; b < curObjVal.length; b++){
					eval("Data["+a+"].curObjVal"+b+" = curObjVal["+b+"]");
				}
			}

			if(Data[a].portTypVal != undefined){
				var portTypVal = Data[a].portTypVal.split(',');

				for(var b=0; b < portTypVal.length; b++){
					eval("Data["+a+"].portTypVal"+b+" = portTypVal["+b+"]");
					eval("Data["+a+"].portTypNm"+b+" = portTypVal["+b+"]");
				}
			}

			if(Data[a].lnkgStatVal != undefined){
				var lnkgStatVal = Data[a].lnkgStatVal.split(',');

				for(var b=0; b < lnkgStatVal.length; b++){
					eval("Data["+a+"].lnkgStatVal"+b+" = lnkgStatVal["+b+"]");

					if(lnkgStatVal[b] != "connected" && lnkgStatVal[b] != "disconnected"){
						stat = false;
					}else{
						if(Data[a].portUseYn != undefined){
							var portUseYn = Data[a].portUseYn.split(',');
							if(lnkgStatVal[b] == "disconnected" && portUseYn[b] != "미사용"){
								stat = false;
							}
						}else{
							if(lnkgStatVal[b] == "disconnected"){
								stat = false;
							}
						}
					}
				}
			}else{
				stat = false;
			}

			if(Data[a].dcnClctTime != undefined){
				var dcnClctTime = Data[a].dcnClctTime.split(',');

				for(var b=0; b < dcnClctTime.length; b++){
					eval("Data["+a+"].dcnClctTime"+b+" = dcnClctTime["+b+"]");
				}
			}

			var status = "";
			if(stat){
				status = "정상";
			}else{
				status = "비정상";
			}

			eval("Data["+a+"].status = status");

		}
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
//		$('#'+gridId).alopexGrid('hideProgress');
	}

  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
//    	if(flag == 'search'){
//    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
//    	}
    	if(flag == 'deletelist') {
    		bodyProgressRemove();
    		alertBox('W', '정상적으로 처리되지 않았습니다.');
    		return;
    	}
    }

    function bodyProgress() {
    	$('body').progress();
    }

    function bodyProgressRemove() {
    	$('body').progress().remove();
    }

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
});