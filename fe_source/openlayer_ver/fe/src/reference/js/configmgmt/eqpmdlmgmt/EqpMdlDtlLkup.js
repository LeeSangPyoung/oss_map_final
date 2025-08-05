/**
 * CardMdlDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGridCardMdl';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
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
    		}, {/* 카드모델ID--숨김데이터		 */
				key : 'cardMdlId', align:'center',
				title : configMsgArray['cardModelIdentification'], 
				width: '100px'
			}, {/* 카드모델명		 */
				key : 'cardMdlNm', align:'center',
				title : configMsgArray['cardModelName'], 
				width: '150px'
			}, {/* 제조사ID--숨김데이터		 */
				key : 'bpId', align:'center',
				title : configMsgArray['vendorIdentification'], 
				width: '100px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '120px'
			}, {/* 카드모델유형코드--숨김데이터	 */
				key : 'cardMdlTypCd', align:'center',
				title : configMsgArray['cardModelTypeCode'],
				width: '130px'
			}, {/* 카드모델유형	 */
				key : 'cardMdlTypNm', align:'center',
				title : configMsgArray['cardModelType'],
				width: '130px'
			}, {/* 카달로그ID		 */
				key : 'cardCtlgId', align:'center',
				title : configMsgArray['catalogIdentification'],
				width: '100px'
			}, {/* 카드용량코드1     */
				key : 'cardCapaCd1', align:'center',
				title : configMsgArray['cardCapacityCode']+'1',
				width: '105px'
			}, {/* 포트수 	1	 */
				key : 'portCnt1', align:'center',
				title : configMsgArray['portCount']+'1',
				width: '100px'
			}, {/* 카드용량코드2     */
				key : 'cardCapaCd2', align:'center',
				title : configMsgArray['cardCapacityCode']+'2',
				width: '105px'
			}, {/* 포트수 	2	 */
				key : 'portCnt2', align:'center',
				title : configMsgArray['portCount']+'2',
				width: '100px'
			}, {/* 카드용량코드3	 */
				key : 'cardCapaCd3', align:'center',
				title : configMsgArray['cardCapacityCode']+'3',
				width: '105px'
			}, {/* 포트수 	3	 */
				key : 'portCnt3', align:'center',
				title : configMsgArray['portCount']+'3',
				width: '100px'
			}, {/* 카드모델첨부파일명 */
				key : 'cardMdlAtflNm', align:'center',
				title : configMsgArray['cardModelAttachedFileName'],
				width: '120px'
			}, {/* UKEY슬롯카드종류 */
				key : 'ukeySlotCardKndCd', align:'center',
				title : configMsgArray['ukeySlotCardKind'],
				width: '130px'	
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
    };
    
    function gridHide() {
    	
    	var hideColList = ['cardMdlId', 'bpId', 'cardMdlTypCd', 'cardMdlAtflNm', 'cardCtlgId'];
    	
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	
	}
    
    function setRegDataSet(data) {
    	$('#eqpMdlDtlLkupForm').setData(data);
    	if(data.eqpMdlDtlYn != "Y"){
    		$('#btnEqpMdlDtlPort').setEnabled(false);
    	}
    	search();
    }
    
    function setEventListener() {
    	
	    	//목록
	   	 $('#btnPrevLkup').on('click', function(e) {
	   		$a.close();
         });
	   	 
    	 /*$('#eqplist').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.navigate($('#ctx').val()+'/configmgmt/equipment/EqpInfMgmt.do');
         });*/
    	 
    	 $('#eqplist').on('click', function(e) {
    		 var param =  $("#eqpMdlDtlLkupForm").getData();
    		 param.closeYn = "N";
    		 $a.popup({
    	          	popid: 'EqpLkup',
    	          	title: configMsgArray['findEquipment'],
    	            url: $('#ctx').val()+'/configmgmt/equipment/EqpLkup.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.83
    	      });
         });
    	 
    	//파장/포트내역
	   	 $('#btnEqpMdlDtlPort').on('click', function(e) {
	   		var param =  $("#eqpMdlDtlLkupForm").getData();
    	 popupList('EqpMdlDtlPortPop', $('#ctx').val()+'/configmgmt/eqpmdlmgmt/EqpMdlDtlPortPop.do', configMsgArray['wavelengthPortDetails'], param);
         });
   	 
    	 
    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){  
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	eqpMdlDel(); 
  		        } 
  		      }); 
         });
    	 
    	//수정
    	 $('#btnModLkup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#eqpMdlDtlLkupForm").getData();
    		param.regYn = "Y";
    		
    		$a.popup({
 	          	popid: 'EqpMdlReg',
 	          	title: '장비 모델 수정',
 	            url: $('#ctx').val()+'/configmgmt/eqpmdlmgmt/EqpMdlReg.do',
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
    	var param =  $("#eqpMdlDtlLkupForm").getData();    	
    	$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/cardMdlForEqpMdl', param, 'GET', 'search');
	}
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.cardMdlForEqpMdl);
    	}
    		
    	if(flag == 'eqpMdlDel') {
    		//삭제를 완료 하였습니다.
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
    	if(flag == 'eqpMdlDel'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }
    
    function eqpMdlDel() {
   	 	var eqpMdlId =  $("#eqpMdlId").val();
   	 	
   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/deleteEqpMdlInf/'+eqpMdlId, null, 'POST', 'eqpMdlDel');
   	 	
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
                  height : window.innerHeight * 0.7,
               
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