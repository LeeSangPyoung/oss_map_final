/**
 * EqpSctnBdgmLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03s
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setRegDataSet(param);        
    };
    
    function setRegDataSet(data) {
    	
    	$('#eqpSctnBdgmLkupArea').setData(data);
    }
    
});