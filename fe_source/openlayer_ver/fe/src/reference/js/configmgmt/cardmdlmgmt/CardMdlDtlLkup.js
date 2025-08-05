/**
 * CardMdlDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
	var paramData = null;
	var gridId = 'dataGridEqpMdl';
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
//    	paramData = param;
        setEventListener();
        setRegDataSet(param);
    };
    
    function initGrid() {
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"5row",
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'] , 
				width: '50px',
				numberingColumn: true 
			}, {/* 장비모델ID--숨김데이터		 */
				key : 'eqpMdlId', align:'center',
				title : configMsgArray['equipmentModelIdentification'],
				width: '100px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '100px'
			}, {/* 장비모델OID값	 */
				key : 'eqpMdlOidVal', align:'center',
				title : configMsgArray['equipmentModelObjectIdentifierValue'],
				width: '100px'
			}, {/* SKT사용여부		 */
				key : 'sktYn', align:'center',
				title : configMsgArray['skTelecomUseYesOrNo'],
				width: '100px'
			}, {/* SKB사용여부		 */
				key : 'skbYn', align:'center',
				title : configMsgArray['skBroadBandUseYesOrNo'],
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '180px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 제조사ID--숨김데이터		 */
				key : 'bpId', align:'center',
				title : configMsgArray['vendorIdentification'],
				width: '100px'
			}, {/* 장비용량코드--숨김데이터	 */
				key : 'eqpCapaCd', align:'center',
				title : configMsgArray['equipmentCapacityCode'],
				width: '100px'
			}, {/* 용량			 */
				key : 'eqpCapaNm', align:'center',
				title : configMsgArray['capacity'],
				width: '100px'
			}, {/* 장비포트분석값	 */
				key : 'eqpPortAnalVal', align:'center',
				title : configMsgArray['equipmentPortAnalysisValue'],
				width: '100px'
			}, {/* 비고			 */
				key : 'eqpMdlRmk', align:'center',
				title : configMsgArray['remark'],
				width: '100px'		
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
    };
    
    function gridHide() {
    	
    	var hideColList = ['eqpMdlId', 'eqpCapaCd', 'slotFrmDivCd', 'bpId'];
    	
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	
	}
    
    function setRegDataSet(data) {
    	
    	$('#cardMdlDtlLkupArea').setData(data);
    	search();
    }
    
    function setEventListener() {
    	
	    //목록
	   	 $('#btnPrevLkup').on('click', function(e) {
	   		$a.close();
         });
	   	 
	 	//장비 목록
	   	 $('#eqplist_popup').on('click', function(e) {
    	 popupList('EqpLstPop', $('#ctx').val()+'/configmgmt/equipment/EqpLst.do', '장비목록');
         });
   	 
	   	//카달로그
	   	 $('#btnCardMdlCtlgMgmt').on('click', function(e) {
   		 popup('CardMdlCtlgMgmtReg', $('#ctx').val()+'/configmgmt/cardmdlmgmt/CardMdlCtlgMgmt.do', '카달로그');
        });
   	 
    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){  
	    		//삭제한다고 하였을 경우
	 		    if (msgRst == 'Y') {
	 		    	cardMdlDel();	
	 	    	} 
	    	});	
         });
    	 
    	//수정
    	 $('#btnModLkup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#cardMdlDtlLkupForm").getData();    
    		param.regYn = "Y";
    		
    		$a.popup({
 	          	popid: 'CardMdlReg',
 	          	title: '카드모델 수정',
 	            url: $('#ctx').val()+'/configmgmt/cardmdlmgmt/CardMdlReg.do',
 	            data: param,
 	            iframe: false,
 	            modal: true,
                movable:true,
 	            width : 865,
 	           	height : window.innerHeight * 0.9,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행 
 	           	}
    		});    		
    		$a.close();
         });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
    	   
	};
	
	function search(){
		$('#pageNoDtlLkup').val(1);
    	$('#rowPerPageDtlLkup').val(100);
    	var param =  $("#cardMdlDtlLkupForm").getData();    	
    	$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlForCardMdl', param, 'GET', 'search');
	}
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.eqpMdlForCardMdl);
    	}

    	if(flag == 'cardMdlDel') {
    		//'삭제를 성공 하였습니다.'
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){  
    			if (msgRst == 'Y') {
					 $a.close();
	    		} 
	    	 });  	
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();
    		
            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}    	
    }
    
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'CardMdlReg'){
    		//'삭제를 실패 하였습니다.'
    		callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }
    
    function cardMdlDel() {
   	 	var cardMdlId =  $("#cardMdlId").val();
   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/deleteCardMdlInf/'+cardMdlId, null, 'POST', 'cardMdlDel');
   	 	
   }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
               
              });
        }
    
    function popupList(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
               
              });
        }
    
   /* var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})
    	
    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;
		
		}
    }*/
    
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