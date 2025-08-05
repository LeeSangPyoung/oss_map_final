/**
 * EqpDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setEventListener();
        setRegDataSet(param);

        if(param.lnkgSystmCd == "RTF"){
    		$('#lnkgSystmNm').val("정류기");
    		$('#btnRrsDtlInfMgmt').setEnabled(false);
    		document.getElementById('rtf').style.display="block";
    	}else if(param.lnkgSystmCd == "RRS"){
    		$('#lnkgSystmNm').val("RRS");
    		document.getElementById('rtf').style.display="none";
    	}
    };
    
    function setRegDataSet(data) {
    	
    	$('#etcEqpDtlLkupArea').setData(data);
    	
    }
    
    function setEventListener() {
    	
    	//목록
	   	 $('#btnPrev').on('click', function(e) {
	   		$a.close();
	         });
	   	 
	   //기타장비연동정보
    	 $('#btnEtcEqpLnkgInf').on('click', function(e) {
    		 var param =  $("#etcEqpDtlLkupForm").getData();
    		 $a.popup({
 	          	popid: 'EtcEqpLnkgInf',
 	          	title: '기타 장비 연동 정보 등록',
// 	              url: $('#ctx').val()+'/configmgmt/etceqpmgmt/EtcEqpLnkgInfReg.do',
 	              url: $('#ctx').val()+'/configmgmt/equipment/EqpLnkgInfReg.do',
 	              data: param,
 	              iframe: false,
 	              modal: true,
 	              movable:true,
 	              width : 865,
 	              height : window.innerHeight * 0.8
 	          });
         });
	   	
	   	 //정류기상세
	   	 $('#btnRtfDtlInfMgmt').on('click', function(e) {
	   		var param =  $("#etcEqpDtlLkupForm").getData();
	   		 popup('RtfDtlInfMgmt', $('#ctx').val()+'/configmgmt/etceqpmgmt/RtfDtlInfMgmt.do', '정류기 상세 정보', param);
	        });
	   	 
	   	//DCN상세
	   	 $('#btnDcnDtlInfMgmt').on('click', function(e) {
	   		var param =  $("#etcEqpDtlLkupForm").getData();
	   		 popupList('DcnDtlInfMgmt', $('#ctx').val()+'/configmgmt/etceqpmgmt/DcnDtlInfMgmt.do', 'DCN 상세 정보', param);
	        });
	   	 
	   	//RRS상세
	   	 $('#btnRrsDtlInfMgmt').on('click', function(e) {
	   		var param =  $("#etcEqpDtlLkupForm").getData();
	   		 popupList('RrsDtlInfMgmt', $('#ctx').val()+'/configmgmt/etceqpmgmt/RrsDtlInfMgmt.do', 'RRS 상세 정보', param);
	        });
    	 
    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){  
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	etcEqpDel();
  		        } 
  		      }); 
         });
    	 
    	//수정
    	 $('#btnModLkup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#etcEqpDtlLkupForm").getData();
    		var popHeight = "";
    		param.regYn = "Y";
    		
    		if($('#lnkgSystmCd').val() == "RTF"){
    			popHeight = window.innerHeight * 0.9;
    		}else{
    			popHeight = window.innerHeight * 0.7;
    		}
    		
    		$a.popup({
 	          	popid: 'EtcEqpReg',
 	          	title: '기타 장비 수정',
 	            url: $('#ctx').val()+'/configmgmt/etceqpmgmt/EtcEqpReg.do',
 	            data: param,
 	            iframe: false,
 	            modal: true,
                movable:true,
 	            width : 865,
 	           	height : popHeight,
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
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'etcEqpDel') {
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
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'etcEqpDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }
    
    function etcEqpDel() {
   	 	var eqpId =  $("#eqpId").val();
   	 	
   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/deleteEqpInf/'+eqpId, null, 'POST', 'etcEqpDel');
   	 	
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
                  height : window.innerHeight * 0.7
               
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
                  height : window.innerHeight * 0.7
               
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