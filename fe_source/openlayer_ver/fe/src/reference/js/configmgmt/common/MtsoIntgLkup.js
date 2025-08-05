/**
 * MtsoIntgLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var mtsoIntgLkup = $a.page(function() {
    
	var gridId = 'dataGrid';
	var gridIdIntg = 'dataGridIntg';
	var paramData = null;
	var data = null;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	//if(param.regYn == "Y"){
    		paramData = param;
    	//}
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        
        if(param.intgFcltsCd != "" && param.intgFcltsCd != null){
        	setList(param);
        }
    };
    
    function setRegDataSet(data) {
    	$('#intgFcltsCd').setEnabled(false);
    	$('#contentArea').setData(data);
    }

  //Grid 초기화
    function initGrid() {
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		height:"7row",
    		defaultColumnMapping:{
    			sorting : true
    		},
    		grouping:{
    			by:['bldAddr','bldblkNm','grudBsmtDivNm','bldFlorVal','mtsoNm'],
    			useGrouping:true,
    			useGroupRearrange:true,
    			useGroupRowspan:true
    		},
    		columnMapping: [{
    			/* 건물코드            */
				key : 'bldCd', align:'center',
				title : configMsgArray['buildingCode'],
				width: '120px'
    		}, {/* 시도			 */
				key : 'mcpNm', align:'center',
				title : configMsgArray['try'],
				width: '100px'
    		}, {/* 구군 			 */
				key : 'sggNm', align:'center',
				title : configMsgArray['guGun'],
				width: '100px'
			}, {/* 동 			 */
				key : 'ldongNm', align:'center',
				title : configMsgArray['dong'],
				width: '100px'
			}, {/* 번지유형명+번지 		 */
				key : 'bunji', align:'center',
				title : configMsgArray['bunjiTypeName']+"+"+configMsgArray['bunji'],
				width: '120px'
			}, {/* 건물명	 */
				key : 'bldNm', align:'center',
				title : configMsgArray['buildingName'],
				width: '100px'
			}, {/* 주소		 */
				key : 'bldAddr', align:'center',
				title : '주소',
				width: '300px',
				rowspan:true
			}, {/* 건물동명		 */
				key : 'bldblkNm', align:'center',
				title : configMsgArray['buildingBlockName'],
				width: '80px',
				rowspan:true
			},{/* 지상/지하		 */
				key : 'grudBsmtDivNm', align:'center',
				title : '지상/지하',
				width: '70px',
				rowspan:true
			}, {/* 건물층값		 */
				key : 'bldFlorVal', align:'center',
				title : '건물층값',
				width: '70px',
				rowspan:true
			},{/* 국사ID		 */
				key : 'mtsoId', align:'center',
				title : '국사ID',
				width: '120px'		
			},{/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : '국사명',
				width: '180px',
				rowspan:true
			},{/* 국사유형		 */
				key : 'mtsoTypNm', align:'center',
				title : '국사유형',
				width: '70px'				
			},{/* 시설구분		 */
				key : 'intgFcltsDivNm', align:'center',
				title : '시설구분',
				width: '100px'			
			},{/* 매핑통시		 */
				key : 'lnkgMtsoIdntVal', align:'center',
				title : '매핑통시',
				width: '100px'
			},{/* 시설명		 */
				key : 'erpIntgFcltsNm', align:'center',
				title : '시설명',
				width: '250px'		
			},{/* 공대구분		 */
				key : 'shrRepDivNm', align:'center',
				title : '공대구분',
				width: '100px'	
			},{/* 공대코드	 */
				key : 'shrRepFcltsCd', align:'center',
				title : '공대코드',
				width: '100px'	
			}],
			message: {/* 데이터가 없습니다.   */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
      //그리드 생성
        $('#'+gridIdIntg).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		height:"4row",
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 통합시설코드            */
				key : 'subIntgFcltsCd', align:'center',
				title : '통합시설코드',
				width: '100px'
    		}, {/* 시설구분			 */
				key : 'subGb', align:'center',
				title : '시설구분',
				width: '100px'
    		}, {/* 통합시설명 			 */
				key : 'subErpIntgFcltsNm', align:'center',
				title : '통합시설명',
				width: '120px'
			}, {/* 활용구분 			 */
				key : 'subPraDivNm', align:'center',
				title : '활용구분',
				width: '100px'
			}, {/* 세대구분 		 */
				key : 'subDetlBizDivNm', align:'center',
				title : '세대구분',
				width: '100px'
			}, {/* 공용대표구분	 */
				key : 'subShrRepDivNm', align:'center',
				title : '공용대표구분',
				width: '100px'
			}, {/* 주소		 */
				key : 'subAddr', align:'center',
				title : '주소',
				width: '300px'
			}],
			message: {/* 데이터가 없습니다.   */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
    };
    
    // 컬럼 숨기기
    function gridHide() {
    	
    	var hideColList = ['forMtsoIntg','bldCd','mcpNm','sggNm','ldongNm','bunji','bldNm'];
    	
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	
	}
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }
    
    function setList(param){
    	$('#'+gridIdIntg).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/intgFcltsCurstList', param, 'GET', 'searchIntg');
    }
    
    function setEventListener() {
    	
    	var perPage = 100;
    	
    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	mtsoIntgLkup.setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	 
    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	mtsoIntgLkup.setGrid(1, eObj.perPage);
         });
         
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 mtsoIntgLkup.setGrid(1,perPage);
         });
    	 
    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			mtsoIntgLkup.setGrid(1,perPage);
       		}
     	 });
         
    	
    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);
    	 
    	 });
    	 
    	 $('#'+gridId).on('click', '.bodycell', function(e){
     	 	var dataObj = AlopexGrid.parseEvent(e).data;
     	 	if(dataObj.mtsoId == null || dataObj.mtsoId == ""){
     	 		$('#btnRegPop').setEnabled(true);
     	 	}else{
     	 		$('#btnRegPop').setEnabled(false);
     	 	}
     	 
     	 });
    	 
    	 $('#btnRegPop').on('click', function(e) {
    		 
    		 data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});
    		 
      	 	 if(data == "" || data == null){
 	        	//선택된 데이터가 없습니다.
		    	callMsgBox('','W', configMsgArray['selectNoData'], function(msgId, msgRst){});
 	     		return; 	
 	     	 }else{
 	     		//통합시설코드 중복 체크
 	     		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/dupIntgFcltsCd/'+paramData.intgFcltsCd, null, 'GET', 'dupIntgFcltsCd');
 	     	 }
         });
    	 
    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });
    	   
	};
	
	
	
	function successCallback(response, status, jqxhr, flag){
		
		//국사 조회시
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
//			setSPGrid(gridId,response, response.mtsoIntgLkupList);
			$('#'+gridId).alopexGrid('dataSet', response.mtsoIntgLkupList);
		}
		
		if(flag == 'searchIntg'){
			$('#'+gridIdIntg).alopexGrid('hideProgress');
			$('#'+gridIdIntg).alopexGrid('dataSet', response.intgFcltsCurstList);
		}
		
		if(flag == 'dupIntgFcltsCd'){
			if(response.result.length > 0){
	 	        	//선택된 데이터가 없습니다.
			    	callMsgBox('','W', "["+paramData.intgFcltsCd+"] 통합시설코드는 ["+response.result[0].mtsoNm+"] 국사에 등록된 코드로 더이상 국사 등록을 할 수 없습니다.", function(msgId, msgRst){});
	 	     		return; 	
	     	}else{
	     		data[0].fromMtsoIntg = "Y";
	     		data[0].intgFcltsCd = $('#intgFcltsCd').val();
	     		popup('EqpReg', '/tango-transmission-web/configmgmt/common/MtsoRegPop.do', '국사등록', data[0]);
	     	}
		}
	}
	
	function setSPGrid(GridID,Option,Data) {
		
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
	
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
    this.setGrid = function(page, rowPerPage){
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#searchForm").getData();
    	 
    	 var florAll = "N" ;
     	 if ($("input:checkbox[id='florAll']").is(":checked") ){
     		florAll = "Y"; 
     	 }
     	 
     	 param.florAll = florAll;
    	 
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoIntgLkup', param, 'GET', 'search');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.7
              });
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