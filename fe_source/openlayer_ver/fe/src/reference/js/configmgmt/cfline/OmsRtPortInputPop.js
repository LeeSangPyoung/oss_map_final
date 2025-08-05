/**
 * OmsRtPortInputPop.js
 *
 * @author P123512
 * @date 2018.11.29
 * @version 1.0
 */
var gridId = 'gridIdPop';
var paramData = null;

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	//$('#title').text("RT Port Name 입력");
        setEventListener();
    };
  

    function setEventListener() {
       //입력완료
       $('#inputBtn').on('click', function(e) {
    	   if(nullToEmpty($('#rtRingName').val())=="") {
    		   alertBox('I', "값을 입력해주시기 바랍니다.");  
    		   return false;
    	   } else {
    		   $a.close($('#rtRingName').val());   
    	   }
    	   
       });
       
       //엔터 이벤트
     	$('#rtRingName').on('keydown', function(e){
     		if (e.which == 13  ){
     			if(nullToEmpty($('#rtRingName').val())=="") {
         		   alertBox('I', "값을 입력해주시기 바랍니다.");  
         		   return false;
         	   } else {
         		   $a.close($('#rtRingName').val());   
         	   }
     		}
     	});
     	
     	$(document).keyup(function(e) {
     		if (e.which == 27  ){
     			alertBox('I', "입력완료를 클릭하세요.");  
    			return false;
     		}
     	});
	};


});