/**
 * RepeaterMgmtPop.js
 * 
 * @author P092781
 * @date 2017. 03. 30.
 * @version 1.0
 */

var gridSearchModel1 = null;	
var gridSearchModel2 = null;	
var gridSearchModel3 = null;

$a.page(function() {
    
	//그리드 ID
    var gridId1 = 'bmtsoIntgFcltsDtlGrid';
    var gridId2 = 'lowIntgFcltsGrid';
    var gridId3 = 'RepeaterGrid';
    	    
    var tmofCdPopList = null;
	var tmofSktData = [];		/* 전송실 데이터 :	SKT */
	var tmofSkbData = [];		/* 전송실 데이터 :	SKB */
	var dataParamMgmt = "";   // 서비스회선의 관리그룹
	var checkGrid3Data = false;
	var svlnNo = "";
	var changeYn = "N";
	var svlnTypCd = null;

	var fdfUsingInoLineNo = null;
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
        initGrid1();
        initGrid2();
        initGrid3();
        checkGrid3Data = false;
        changeYn = "N";
        //console.log(param);
        dataParamMgmt = param.mgmtGrpCd;
        svlnNo = param.svlnNo;
        svlnTypCd = nullToEmpty(param.svlnTypCd);
        fdfUsingInoLineNo = param.svlnNo;
        // 기지국 검색이 기본
        editSearchArea("02");
		setCombo();
		getServiceLineRepeaterInfo(param.svlnNo);
        setEventListener();
    };
    
    //Grid 초기화
    function initGrid1() {
    	var mapping =  [
           	  {selectorColumn : true, width : '40px'},
    	      { key : 'intgFcltsCd',					align:'left',					width:'100px',					title : cflineMsgArray['fcltsNumber']/*"시설번호"	*/	}
			, { key : 'intgFcltsNm',					align:'left',					width:'250px',					title : cflineMsgArray['mtsoName']/*"기지국명"*/			}
			, { key : 'bmtsoIntgFcltsUseYn',			align:'left',					width:'50px',					title : cflineMsgArray['use']/*"사용"	*/	,hidden : true	}
			, { key : 'tmofNm',					        align:'left',					width:'150px',					title : cflineMsgArray['transmissionOffice']/*"전송실"*/		}				
    	];
    	
    	gridSearchModel1 = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selecterpfcltslist"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 15,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
  		
        //그리드 생성
        $('#'+gridId1).alopexGrid({
        	autoColumnIndex: true,
        	columnMapping : mapping,
        	cellSelectable : true,
        	rowClickSelect : true,
        	rowInlineEdit : false,
        	rowSingleSelect : true,
        	numberingColumnFromZero : false,
            width: 600,
        	height : 270,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}           
            ,paging: {                             // alopexGrid option의 paging을조정해야한다.
                //pagerTotal: true,                 // 데이터 total count표시 (true로한다)
                pagerSelect: false,               // 페이지당 보여지는 갯수를 조정하는 select 표시여부 (false로한다)
                hidePageList: true                // paging숫자/버튼 감출것인지여부( true로한다 )
            },ajax: {
		         model: gridSearchModel1                  // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }
            ,hideProgress : true
        }); 
    };
    
    function initGrid2() {
    	var mapping =  [
              {selectorColumn : true, width : '40px'},
			  { key : 'intgFcltsCd',			align:'left',			width:'100px',		title : cflineMsgArray['fcltsNumber']/*"시설번호"	*/	}
			, { key : 'intgFcltsNm',			align:'left',			width:'250px',		title : cflineMsgArray['repeaterName']/*"중계기명"*/			}
			, { key : 'intgFcltsAddr',			align:'left',			width:'260px',		title : cflineMsgArray['address']/*"주소"*/			}
			, { key : 'praDivNm',			    align:'left',			width:'100px',		title : cflineMsgArray['status']/*"상태"*/		}	
			, { key : 'serviceUseYn',			align:'left',			width:'50px',		title : cflineMsgArray['useExistenceAndNonexistence']/*"사용유무"*/	, hidden : true	}				
    	];
    	
    	gridSearchModel2 = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selecterpfcltslist"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 15,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
  		
        //그리드 생성
        $('#'+gridId2).alopexGrid({
        	autoColumnIndex: true,
        	columnMapping : mapping,
        	cellSelectable : true,
        	rowClickSelect : true,
        	rowInlineEdit : false,
        	rowSingleSelect : true,
        	numberingColumnFromZero : false,
            width: 800,
        	height : 270,   
            paging: {                             // alopexGrid option의 paging을조정해야한다.
                //pagerTotal: true,                 // 데이터 total count표시 (true로한다)
                pagerSelect: false,               // 페이지당 보여지는 갯수를 조정하는 select 표시여부 (false로한다)
                hidePageList: true                // paging숫자/버튼 감출것인지여부( true로한다 )
            }
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData'] + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},ajax: {
		         model: gridSearchModel2                  // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }
			,hideProgress : true
        }); 
    };
    
    function initGrid3() {
    	var mapping =  [
              {selectorColumn : true, width : '40px'},
  			  { key : 'intgFcltsCd',		align:'left',		width:'80px',			title : cflineMsgArray['fcltsNumber']/*"시설번호"	*/	        , hidden : false}
            , { key : 'bmtsoIntgFcltsNm',	align:'left',		width:'200px',			title : cflineMsgArray['mtsoName']/*"기지국명"*/		}
			, { key : 'repeaterNm',			align:'left',		width:'200px',			title : cflineMsgArray['repeaterName']/*"중계기명"*/		}
			, { key : 'intgFcltsAddr',		align:'left',		width:'500px',			title : cflineMsgArray['address']/*"주소"*/			}
			, { key : 'svlnNo',				align:'left',		width:'150px',			title : cflineMsgArray['serviceLineNumber']/*"회선번호"*/		    , hidden : true}
			, { key : 'intgFcltsDivCd',		align:'left',		width:'80px',			title : cflineMsgArray['facilitiesDivision']/*"시설구분"*/	    , hidden : true}		
			, { key : 'prntBmtsoCd',		align:'left',		width:'80px',			title : cflineMsgArray['baseMtso']/*"기지국"*/	, hidden : true}	
			, { key : 'serviceUseYn',		align:'left',		width:'50px',			title : cflineMsgArray['useExistenceAndNonexistence']/*"사용유무"*/	, hidden : true	}			
    	];
    	
    	gridSearchModel3 = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selectrepeaterlist"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 15,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
  		
        //그리드 생성
        $('#'+gridId3).alopexGrid({
        	autoColumnIndex: true,
        	columnMapping : mapping,
        	cellSelectable : true,
        	rowClickSelect : true,
        	rowInlineEdit : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero : false,
            width: 1400,
        	height : 168,         
            paging: {                             // alopexGrid option의 paging을조정해야한다.
                pagerTotal: false,                 // 데이터 total count표시 (true로한다)
                pagerSelect: false,               // 페이지당 보여지는 갯수를 조정하는 select 표시여부 (false로한다)
                hidePageList: true                // paging숫자/버튼 감출것인지여부( true로한다 )
            }
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData'] + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},ajax: {
		         model: gridSearchModel3                  // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }
			,hideProgress : true
        }); 
    };
  			
    // 콤보취득
    function setCombo() {
    	// 전송실 설정
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'TmofSktData');	// 전송실데이터:SKT
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030002', null, 'GET', 'TmofSkbData');	// 전송실데이터:SKB
    }
    
    // 서비스회선에 속한 중계기 정보 취득
    function getServiceLineRepeaterInfo(svlnNo) {
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'TmofSktData');
    	var dataParam = {svlnNo : svlnNo};
    	cflineShowProgressBody();
    	gridSearchModel3.get({
       		data: dataParam,
   		}).done(function(response,status,xhr,flag){successCallback(response, gridId3);})
   	  	  .fail(function(response,status,flag){failCallback(response, gridId3);});
    }
    
    function setEventListener() {
    	// 검색
        $('#btnPopSearch').on('click', function(e) {
        	searchErpFcltsList(null);
        	
        });
        
        $('#intgFcltsDivCd').on('change', function(e){
        	// 검색조건영역 편집
        	editSearchArea($(this).val());
        });
        
        // 기지국 목록 더블클릭시 해당 기지국에 속하는 중계기 조회
        $('#'+gridId1).on('click', '.bodycell', function(e) {/*dblclick*/
        	var object = AlopexGrid.parseEvent(e);       	
        	var dataParam = object.data;
        	// 해당 기지국에 속하는 중계기 조회
        	searchErpFcltsList(dataParam.intgFcltsCd);
        });
        
        // 중계기 목록 더블클릭시 해당 기지국에 속하는 중계기 조회
        /*$('#'+gridId2).on('dblclick', '.bodycell', function(e) {
        	var object = AlopexGrid.parseEvent(e);       	
        	var repeaterInfo = object.data;
        	// 중계기 정보 추가
        	addRepeaterInfo(repeaterInfo);
        });*/
       // 중계기추가 행추가
        $('#btnRepeaterAdd').on('click', function(e) {
	    	var repeaterInfo =  $('#'+gridId2).alopexGrid('dataGet', {_state: {selected:true}});
	    	if(repeaterInfo.length <= 0){
				alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
				return;
			} 
	    	// 기지국 정보 추가
        	addRepeaterInfo(repeaterInfo[0]);
        });
        
       // 기지국추가 행추가
        $('#btnBmtsoIntgFcltsAdd').on('click', function(e) {
        	var repeaterInfo =  $('#'+gridId1).alopexGrid('dataGet', {_state: {selected:true}});
        	if(repeaterInfo.length <= 0){
    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
    			return;
    		} 
        	// 기지국 정보 추가
        	addRepeaterInfo(repeaterInfo[0]);
        });
        
        // 삭제
        $('#btnRepeaterDel').on('click', function(e) {
        	var repeaterInfo =  $('#'+gridId3).alopexGrid('dataGet', {_state: {selected:true}});
        	if(repeaterInfo.length <= 0){
    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
    			return;
    		} 
        	
        	for (var i = repeaterInfo.length-1; i >= 0; i--) {
        		var data = repeaterInfo[i];    		
        		var rowIndex = data._index.data;
        		$('#'+gridId3).alopexGrid("dataDelete", {_index : { data:rowIndex }});
        	}  
        });
        //취소
   	 	$('#btnCncl').on('click', function(e) {
   	 		$a.close(changeYn);
        });
   	 	//등록
        $('#btnSave').on('click', function(e) {
        	saveRepeaterInfo();       
        });

   	 	//x버튼으로 닫기
        $(window).unload(function(){//.on('beforeunload', function(e) {        	
        	var returnParam = {
        			 type : "W"
        			,changeYn : changeYn	
        		};
        	//var windowOpener = window.opener.$.alopex.popup.config[window.name];
        	//windowOpener.callback(changeYn);
        	// 저장후 자동으로 닫히는 경우가 아닌 닫기 혹은 x버튼으로 닫을 경우 
        	// 저장후 데이터를 넘기고 싶을 경우 처리
        	//if (changeYn == "Y") {
        		// windowOpener.callback(changeYn); <- 결과 플레그만 넘길경우
        	    // indowOpener.callback(returnParam); <- 데이터 값으로 넘기는 경우
        	//}
        	//console.log("pop changeYn : " + changeYn);
            //window.opener.$.alopex.popup.config[window.name].callback(returnParam);
        });
        
        $('#searchPopForm').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnPopSearch').click();
    			return false;
    		}
     	});	  
	}
    
    // 조회버튼(기지국/중계기조회) 혹은 기지국 더블클릭시(중계기조회)
    // prntBmtsoCd != null인경우 기지국 더블클릭으로 이벤트 발생된 것으로 처리
    // prntBmtsoCd는 기지국의 시설번호로 중계기의 부모시설번호로 사용됨
    function searchErpFcltsList(prntBmtsoCd) {

    	var pageInfo = null;
    	var dataParam =  $("#searchPopForm").getData();
    	
        // 시설구분에 기지국
    	var intgFcltsDivCd = $('#intgFcltsDivCd').val(); 
    	// 시설명에 기지국명
    	var intgFcltsNm = '';  
    	var intgFcltsCd = '';
    	var tmofCdPopListView = '';
    	var tmofCdPopList = [];
    	// prntBmtsoCd가 null이 아닌 경우 기지국에 속하는 중계기 조회로 처리
    	if (prntBmtsoCd != null && prntBmtsoCd != "") {
    		// 시설구분에 중계기
    		intgFcltsDivCd = '03'; 
    		// 기지국에 속하는 중계기 인경우 시설명/시설번호 초기화
    		intgFcltsNm = '';
    		intgFcltsCd = '';
    	} 
    	// 시설번호나 중계기명을 입력한 경우 중계기 검색 
    	//else if (nullToEmpty($('#lowIntgFcltsCd').val()) != '' || nullToEmpty($('#repeaterNm').val()) != '' ) {
    	else if (nullToEmpty($('#intgFcltsDivCd').val()) == '03') {
    		intgFcltsDivCd = '03'; // 시설구분에 중계기
    		// 중계기 조회인 경우 시설명에 중계기명으로 셋팅
    		intgFcltsNm = $('#repeaterNm').val();  // 중계기명
    		intgFcltsCd = $('#lowIntgFcltsCd').val();  // 시설번호
    	} // 그외는 기지국 조회
    	else {
    		// 전송실 시설번호
    		intgFcltsCd = $('#bmtsoIntgFcltsCd').val();  // 시설번호
    		// 시설명에 기지국명 셋팅
    		intgFcltsNm = $('#bmtsoIntgFcltsCdNm').val();
    	}
    	// 전송실 설정
		if ((prntBmtsoCd == null || prntBmtsoCd == "") && nullToEmpty( $("#tmofCdPopList").val() )  != ""  ){
			//console.log($("#tmofCdPopList").val() );
			
			tmofCdPopList =   $("#tmofCdPopList").val() ;	
			
			for (var i=0; i < tmofCdPopList.length; i++) {
				tmofCdPopListView = tmofCdPopListView + (i > 0 ? ',' : '') + tmofCdPopList[i];
			}
		}
    	    	
    	dataParam.intgFcltsDivCd = intgFcltsDivCd;
    	dataParam.intgFcltsNm = intgFcltsNm;
    	dataParam.intgFcltsCd = intgFcltsCd;
    	dataParam.prntBmtsoCd = prntBmtsoCd;
    	dataParam.tmofCdPopList = '';  // array는 빈값처리
    	dataParam.tmofCdPopListView = tmofCdPopListView;  // 편집한 값을 셋팅
    	dataParam.svlnNo = svlnNo;  // 중계기의 기존 사용유무 체크를 위해 해당 서비스회선의 회선번호를 넘김
    	dataParam.svlnTypCd = svlnTypCd;  // 3G모드용
    	dataParam.pageNo = '1';
    	dataParam.rowPerPage = '15';
    			
		// 기지국에 속하는 중계기 검색시
		if (prntBmtsoCd != null && prntBmtsoCd != "") {
			$('#'+gridId2).alopexGrid("dataEmpty");
		} // 조회버튼 클릭시 
		else {
			$('#'+gridId1).alopexGrid("dataEmpty");
			$('#'+gridId2).alopexGrid("dataEmpty");
		}
		//console.log(dataParam);
    	//cflineShowProgressBody();
    	if (intgFcltsDivCd == '02') {
    		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selecterpfcltslist', dataParam, 'GET', gridId1);
    		gridSearchModel1.get({
           		data: dataParam,
           		flag: gridId1
       		}).done(function(response,status,xhr,flag){successCallback(response, gridId1);})
       	  	  .fail(function(response,status,flag){failCallback(response, gridId1);});
    	} else {    		
    		gridSearchModel2.get({
           		data: dataParam,
           		flag: gridId2
       		}).done(function(response,status,xhr,flag){successCallback(response, gridId2);})
       	  	  .fail(function(response,status,flag){failCallback(response, gridId2);});
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selecterpfcltslist', dataParam, 'GET', gridId1);
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);});
    }
    
    // 기지국 추가
    function addRepeaterInfo(addData) {
    	$('#'+gridId3).alopexGrid("endEdit",{ _state : { editing : true }});
    	var repeaterList = $('#'+gridId3).alopexGrid('dataGet');
    	// 2개 이상인지 체크
    	if(repeaterList.length > 2){
			alertBox('W', cflineMsgArray['possibleOnlyTwoBaseMtsoAndRepeater']); /*'기지국 혹은 중계기가 이미 2개 등록되어 있습니다.<br>삭제후 추가해 주세요.'*/
			return;
		}  	
    	
    	var tempIntgFcltsDivCd = addData.intgFcltsDivCd;
    	//console.log(addData);
    	//console.log(tempIntgFcltsDivCd);
    	var msgStr = "";
    	for (var i = 0 ; i < repeaterList.length; i++) {
    		// 기지국인지 중계기 인지 체크하여 이미 등록된것이 있는지 체크
    		if (tempIntgFcltsDivCd == repeaterList[i].intgFcltsDivCd) {
    			msgStr =  makeArgMsg('existData', (tempIntgFcltsDivCd == "02" ? cflineMsgArray['baseMtso'] : cflineMsgArray['repeater']));
    			 /*기지국/중계기는(은) 이미 등록되어 있습니다.*/
    			break;
    		}  
    		// 중계기 인경우 기지국 정보가 있으면 중계기가 기지국에 속하는지 체크
    		if (tempIntgFcltsDivCd == "03" && repeaterList[i].intgFcltsDivCd == "02") {
    			if(addData.prntBmtsoCd != repeaterList[i].intgFcltsCd) {
    				msgStr = cflineMsgArray['repeaterNotIncludeatBaseMtso'];/*"해당 중계기는 설정되어 있는 기지국에 속하는 중계기가 아닙니다."*/
        			break;
    			}
    		}
    		// 기지국인 경우 중계기 정보가 있으면 중계기가 기지국에 속하는지 체크
    		if (tempIntgFcltsDivCd == "02" && repeaterList[i].intgFcltsDivCd == "03") {
    			if (addData.intgFcltsCd != repeaterList[i].prntBmtsoCd) {
    				msgStr = cflineMsgArray['baseMtsoIsNotBaseMtsoOfRepeater'];/*"해당 기지국은 설정되어 있는 중계기의 기지국이 아닙니다.";*/
        			break;
    			}
    		}
    	}
    	
    	if (msgStr != "") {
    		alertBox('W', msgStr); 
			return;
    	}
    	
    	// 중계기의 경우 사용중인지 표시 
    	if (tempIntgFcltsDivCd == "03" && addData.serviceUseYn == "Y") {
    		alertBox('W', cflineMsgArray['repeaterIsUsedTheOtherServiceLine']);/* "해당 중계기는 다른 서비스 회선에서 사용중입니다."*/
			//return;
    	}
    	// 추가처리
    	var addRowData = [
       	    {
     	    		  "bmtsoIntgFcltsNm" : addData.bmtsoIntgFcltsNm
     	    		, "repeaterNm" : (tempIntgFcltsDivCd == "02" ? "" : addData.intgFcltsNm)
     	    		, "intgFcltsAddr" : (tempIntgFcltsDivCd == "02" ? "" : addData.intgFcltsAddr)
     	    		, "svlnNo" : svlnNo
     	  	    	, "intgFcltsDivCd" : addData.intgFcltsDivCd
     	  	    	, "intgFcltsCd" : addData.intgFcltsCd
     	  	    	, "prntBmtsoCd" : (tempIntgFcltsDivCd == "02" ? "" : addData.prntBmtsoCd)
     	  	    	, "serviceUseYn": (tempIntgFcltsDivCd == "02" ? "" : addData.serviceUseYn)
       	    }
       	];
       	$('#'+gridId3).alopexGrid("dataAdd", addRowData);
    	
    }
    
    function saveRepeaterInfo(){

    	$('#'+gridId3).alopexGrid("endEdit",{ _state : { editing : true }});
    	var repeaterInsertList = AlopexGrid.trimData ( $('#'+gridId3).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
    	var repeaterDeleteList = AlopexGrid.trimData ( $('#'+gridId3).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));  
    	var repeaterInfoList = $('#'+gridId3).alopexGrid('dataGet');
    	
    	if (repeaterInsertList.length == 0 && repeaterDeleteList.length == 0) {
    		alertBox('W', cflineMsgArray['noModifiedData']); /* 수정된 내역이 없습니다. */
			return;
    	}
    	
    	if (repeaterInfoList.length > 2) {
    		alertBox('W', cflineMsgArray['baseMtsoAndRepeaterIsOnlyOneEach']);/*'기지국 혹은 중계기는 각각 1개씩, 2개까지만 설정할 수 있습니다.'*/ 
			return;
    	}
    	
    	if (repeaterInfoList.length == 0) {
    		alertBox('W', cflineMsgArray['necessaryBaseMtsoOrRepeate']); /* 기지국 혹은 중계기는 반드시 설정해야 합니다. */ 
			return;
    	}
    	
    	var msgStr = "";
    	
    	for (var i = 0 ; i < repeaterInfoList.length; i++) {

        	for (var j = (i+1) ; j < repeaterInfoList.length; j++) {
	    		// 기지국인지 중계기 인지 체크하여 이미 등록된것이 있는지 체크
	    		if (repeaterInfoList[i].intgFcltsDivCd == repeaterInfoList[j].intgFcltsDivCd) {
	    			//console.log(repeaterInfoList[i].intgFcltsDivCd + "  " + repeaterInfoList[j].intgFcltsDivCd);
	    			msgStr = makeArgMsg('possibleOnlyOne', (repeaterInfoList[i].intgFcltsDivCd == "02" ? cflineMsgArray['baseMtso'] : cflineMsgArray['repeater']));
	    			/*"기지국/중계기는(은) 1개만 설정 가능합니다.";*/
	    			break;
	    		}  
	    		// 중계기 인경우 기지국 정보가 있으면 중계기가 기지국에 속하는지 체크
	    		if (repeaterInfoList[i].intgFcltsDivCd == "03" && repeaterInfoList[j].intgFcltsDivCd == "02") {
	    			if(repeaterInfoList[i].prntBmtsoCd != repeaterInfoList[j].intgFcltsCd) {
	    				//console.log(repeaterInfoList[i].prntBmtsoCd + "  " + repeaterInfoList[j].intgFcltsCd);
	    				msgStr = makeArgMsg('repeaterNotIncludeatBaseMtsoWithArgument', (i+1), (j+1));
	    				/*(i+1) + "번째 중계기는 " + (j+1) + " 기지국에 속하는 중계기가 아닙니다.";*/
	        			break;
	    			}
	    		}
	    		// 기지국인 경우 중계기 정보가 있으면 중계기가 기지국에 속하는지 체크
	    		if (repeaterInfoList[i].intgFcltsDivCd  == "02" && repeaterInfoList[j].intgFcltsDivCd == "03") {
	    			if (repeaterInfoList[i].intgFcltsCd != repeaterInfoList[j].prntBmtsoCd) {
	    				//console.log(repeaterInfoList[i].intgFcltsCd + "  " + repeaterInfoList[j].prntBmtsoCd);
	    				msgStr = makeArgMsg('baseMtsoIsNotBaseMtsoOfRepeaterWithArgument', (i+1), (j+1));
	    					/*(i+1) + "번째 기지국은 설정되어 있는 " + (j+1) + " 중계기의 기지국이 아닙니다.";*/
	        			break;
	    			}
	    		}
        	}
    	}
    	
    	if (msgStr != "") {
    		alertBox('W', msgStr); 
			return;
    	}
    	
    	callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst){  
        	if (msgRst == 'Y') {
        		cflineShowProgressBody();
            	var updateData = [];

        		// 삭제중계기
            	if (repeaterDeleteList.length > 0) {
        			$.each(repeaterDeleteList, function(idx, obj){
        				obj.editMd = 'D';  // 삭제
        				updateData.push(obj);
        			});
            	}
            	// 신규관할전송실
            	if (repeaterInsertList.length > 0) {
        			$.each(repeaterInsertList, function(idx, obj){
        				obj.editMd = 'I';  // 신규
        				updateData.push(obj);
        			});
            	}
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/repeaterinfo?method=put', updateData, 'POST', 'repeaterinfo');
        	}
    	});
    	
    }
    
    // 시설구분에 따른 검색조건 영역 편집
    function editSearchArea(searchType) {
    	//console.log(searchType);
    	if (searchType == '02') {
    		//$('bmtsoIntgFcltsCd').val("");
    		$('#bmtsoIntgFcltsCd').setEnabled(true);
    		//$('bmtsoIntgFcltsCdNm').val("");
    		$('#bmtsoIntgFcltsCdNm').setEnabled(true);
    		$('#lowIntgFcltsCd').val("");
    		$('#lowIntgFcltsCd').setEnabled(false);
    		$('#repeaterNm').val("");
    		$('#repeaterNm').setEnabled(false);
    	} else {
    		$('#bmtsoIntgFcltsCd').val("");
    		$('#bmtsoIntgFcltsCd').setEnabled(false);
    		$('#bmtsoIntgFcltsCdNm').val("");
    		$('#bmtsoIntgFcltsCdNm').setEnabled(false);
    		//$('lowIntgFcltsCd').val("");
    		$('#lowIntgFcltsCd').setEnabled(true);
    		//$('repeaterNm').val("");
    		$('#repeaterNm').setEnabled(true);
    	}
    }    	
	
	//request 성공시
    function successCallback(response, flag){
    	cflineHideProgressBody();
    	//SKT 전송실
    	if(flag == 'TmofSktData') {    		
    		tmofSktData = response.tmofCdList; 
    		if (dataParamMgmt == "0001") {
    			$('#tmofCdPopList').clear();
    			$('#tmofCdPopList').setData({data : tmofSktData});
    		}
    	}
    	//SKB 전송실
    	if(flag == 'TmofSkbData') {
    		tmofSkbData = response.tmofCdList;	 
    		if (dataParamMgmt == "0002") {
				$('#tmofCdPopList').clear();
				$('#tmofCdPopList').setData({data : tmofSkbData});
    		}
    	}
    	// 서비스회선의 중계기 정보
    	if (flag == gridId3) {
    		checkGrid3Data = true;
    		//console.log(gridId3);
    		if (response != null && response.lists != undefined && response.lists.length > 0) {
    			svlnTypCd = response.lists[0].svlnTypCd;
    			console.log(svlnTypCd);
    		}
    	}
    	
    	// 기지국/중계기 검색시
    	if (flag == gridId1 || flag == gridId2) {
    		
    	}

        // 중계기정보저장
        if (flag == "repeaterinfo") {
        	cflineHideProgressBody();
        	var resultCd = response.result.resultCd;
        	var repeaterInfoList = response.result.repeaterInfo;
        	var resultMsg = cflineMsgArray['saveSuccess'];
        	var checkMsg = "";
        	var tempList = null;
        	//console.log(repeaterInfoList);
        	if (resultCd == "OK") {
        		for (var i = 0; i< repeaterInfoList.length; i++) {
        			tempList = repeaterInfoList[i];
	                if (tempList.editMd == "I" && tempList.intgFcltsDivCd == "03") {   
	                	// tempList.serviceUseYn : Y인경우 화면에서 중계기 추가시 이미 사용중임을 알림창으로 알렸으므로 다시 보여주지 않기 위해 체크 대상에서 제외
	                	// tempList.serviceUseYnCheck : Y인경우 화면에서 중계기 추가시 사용중이 아니었어도 그사이 다른 서비스 회선에서 사용으로 추가하는 경우가 발생할 수 있으므로
	                	//                              db에서 체크하여 알림처리하기 위해 
	                    if (tempList.serviceUseYn != "Y" && tempList.serviceUseYnCheck == "Y") {
	                    	checkMsg = "<br>" + makeArgMsg('repeaterNameAndNumberIsUsed', tempList.repeaterNm, tempList.intgFcltsCd);
	                    	/*[중계기명 : {0}, <br>시설번호 : {1}]<br>는 다른 서비스 회선에서 사용중입니다.*/
	                    	
	                    }
	                }
        		}
        		changeYn = "Y";
        	}
        	
        	if (checkMsg != "") {
        		resultMsg = resultMsg + checkMsg;
        	}
        	//console.log(changeYn);
    		sendFdfUseInfo("B");
    		
    		callMsgBox('', 'I',  resultMsg, function() {
    			//searchUserJrdtTmofList();
				//$a.close(changeYn);
    			$('#btnCncl').click();
			});

        }
        
        if (tmofSktData.length > 0 && tmofSkbData.length > 0) {
    	  cflineHideProgressBody();
    	}
        
    }
    
    //request 실패시.
    function failCallback(response, flag){
    	cflineHideProgressBody();
    	if(flag == 'repeaterinfo'){
    		alertBox('W', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    	}
    }
    

    // FDF사용정보 전송(서비스회선/링편집시만 호출됨)
   function sendFdfUseInfo(flag ) {
	   	console.log("lineNoStr: " +  fdfUsingInoLineNo);
	       
	   	var fdfParam = {
	   			 lineNoStr : fdfUsingInoLineNo
	   		   , fdfEditLneType : "S"
	   		   , fdfEditType : "B"  // 중계기명 변경되기 때문
	   	}
	   	
	   	//console.log(fdfParam);
	   	
	    	Tango.ajax({
	    		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', //URL 기존 처럼 사용하시면 됩니다.
	    		data : fdfParam, //data가 존재할 경우 주입
	    		method : 'GET', //HTTP Method
	    		flag : 'sendfdfuseinfo'
	    	}).done(function(response){successCallbackFdfToGis(response, 'sendfdfuseinfo');})
	   	  .fail(function(response){failCallbackFdfToGis(response, 'sendfdfuseinfo');});
	   	
	   }

   // FDF사용정보 전송용 성공CallBack함수
   function successCallbackFdfToGis (response, flag) {
	   	if (flag == "sendfdfuseinfo") {
	   		fdfUsingInoLineNo = "";
	   		console.log("successCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   	}
   }

   //FDF사용정보 전송용 실패CallBack함수
   function failCallbackFdfToGis (response, flag) {
	   	if (flag == "sendfdfuseinfo") {
	   		fdfUsingInoLineNo = "";
	   		//console.log("failCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   	}
   }
});
 