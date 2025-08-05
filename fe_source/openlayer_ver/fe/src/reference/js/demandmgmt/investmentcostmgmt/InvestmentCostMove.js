/**
 * InvestmentCostMgmt
 *
 * @author P095781
 * @date 2016. 8. 29. 오후 03:57:00
 * @version 1.0
 */

$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultGrid';
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);

        initGrid();
    	setCombo();
    	setEventListener();
    };

  	//Grid 초기화
    function initGrid() {
    	var mapping =  [
			//공통
			{
				selectorColumn : true,
				width : "30px" 
			}
			,
			{
				key : 'processYn',
				align:'center',
				width:'100px',
				title : '처리여부'
			}
			,
			{
				key : 'bizYr',
				align:'center',
				width:'100px',
				title : '사업년도'
			}
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'200px',
				title : '사업목적'
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'100px',
				title : '사업구분'
			}
			, {
				key : 'changeBeforeBizCd',
				align:'center',
				width:'100px',
				title : '변경전사업코드'
			}
			, {
				key : 'bizNm',
				align:'left',
				width:'300px',
				title : '사업명'
			}
			, {
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : '지역명'
			}
    	];
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping
        });
        
    };
    
    function setCombo() {
    	/*selectComboCode('mgmtHdofcCd', 'Y', 'C00109', '');*/
    	selectOrgListCode('mgmtHdofcCd');
    	selectAfeYearCode('bizYr', 'NS', '');
    }
    
    function setEventListener() {
        
	};
	
	//request
	function InvestmentCostMoveRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostMoveCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostMoveCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successInvestmentCostMoveCallback(response, flag){
    	
    }
    
    //request 실패시.
    function failInvestmentCostMoveCallback(serviceId, response, flag){
    	console.log(response);
    	alertBox('W','조회 실패하였습니다.');
    }
});