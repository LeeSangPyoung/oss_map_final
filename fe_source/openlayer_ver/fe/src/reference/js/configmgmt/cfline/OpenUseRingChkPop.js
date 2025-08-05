/**
 * OpenUseRingChkPop.js
 *
 * @date 2021.04.19
 * 
 * ************* 수정이력 ************
 * 2021-04-19  1. [신규] 일반, 전송망 경유링 선택
 * 
 */

var useRingType = '2';
$a.page(function() {
	
	this.init = function(id, param) {
		setEventListener();
    };
    
    
    function setEventListener() {
    	
    	// 네트워크 타입 선택
    	$('input:radio[name=useRingType]').on('click', function(e) {	
    		 useRingType = $('#useRingType:checked').val();		
    	});    
     	
    	// 닫기
    	$('#btnClosePop').on('click', function(e) {		
    		$a.close();    	
        });
    	
    	// 선택 
    	$('#btnConfirmPop').on('click', function(e) {
    		$a.close(useRingType);
    	});
    }

});

