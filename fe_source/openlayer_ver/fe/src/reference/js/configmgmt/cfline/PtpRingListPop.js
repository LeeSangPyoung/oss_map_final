/**
 * PtpRingListPop.js 
 *
 * @author Administrator
 * @date 2016. 10. 24. 오후 14:02:03 
 * @version 1.0
 */

var gridModel1 = Tango.ajax.init({
   	url: "tango-transmission-biz/transmisson/configmgmt/cfline/ptpring/getSelectPtpRingList"
		,data: {
	        pageNo: 1,             // Page Number,
	        rowPerPage: 10        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
	    }
});

$a.page(function() {
	var gridResult = 'resultListGrid';
	var ntwkLineNo = null;
		
    this.init = function(id, param) {
    	//console.log(param);
    	$('#rontNtwkLineNm').text(param.ntwkLineNm);    	
    	ntwkLineNo = nullToEmpty(param.ntwkLineNo);		
		//console.log(ntwkLineNo);
    	
    	initGrid();
    	setEventListener();   
    	// Data Get
    	getPtpLingList();
    };
    
    // 그리드 초기화
    function initGrid() {
    	var nodata = cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */;
    	
    	var columnMapping = [
							{key : 'check', align:'center', width:'40px',	title : cflineMsgArray['sequence'] /*순번*/,	numberingColumn : true}
							, {key : 'ntwkLineNo',	title : cflineMsgArray['ringIdentification'] /*링ID*/,	align:'center',	width: '110px'}
							, {key : 'ntwkLineNm',	title : cflineMsgArray['ringName'] /*링명*/,	align:'left',	width: '240px'}
							, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '80px'}
							, {key : 'mgmtGrpCdNm',	title : cflineMsgArray['managementGroup'] /*관리그룹*/,	align:'center',	width: '90px'}
							, {key : 'ntwkTypNm',	title : cflineMsgArray['networkDivision'] /*망구분*/,	align:'center',	width: '135px'}
							, {key : 'topoSclNm',	title : cflineMsgArray['ntwkTopologyCd'] /*망종류*/,	align:'center',	width: '135px'}
							, {key : 'ntwkCapaNm',	title : cflineMsgArray['capacity'] /*용량*/,	align:'center',	width: '90px'}
							, {key : 'lineOpenDt',	title : cflineMsgArray['openingDate'] /*개통일자*/,	align:'center',	width: '81px'}
							, {key : 'frstRegUserId',	title : cflineMsgArray['registrant'] /*등록자*/,	align:'center',	width: '120px'}
							, {key : 'lastChgUserId',	title : cflineMsgArray['changer'] /*변경자*/,	align:'center',	width: '120px'}
							, {key : 'lastChgDate',	title : cflineMsgArray['modificationDate'] /*수정일자*/,	align:'center',	width: '81px'}
							] ;
    	
    	$('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
        	columnMapping : columnMapping,
        	cellSelectable : true,
        	rowClickSelect : true,
        	rowInlineEdit : false,
        	rowSingleSelect : true,
        	numberingColumnFromZero : false
			,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}           
            ,paging: {                             // alopexGrid option의 paging을조정해야한다.
                //pagerTotal: true,                 // 데이터 total count표시 (true로한다)
                pagerSelect: false,               // 페이지당 보여지는 갯수를 조정하는 select 표시여부 (false로한다)
                hidePageList: true                // paging숫자/버튼 감출것인지여부( true로한다 )
            },ajax: {
		         model: gridModel1                  // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }
            , height : 600
            , hideProgress : true
        });		
    };
    
    function setEventListener() {     	    	
    	 
	};
	
	function getPtpLingList() {
		var dataParam = {
				ntwkLineNo : ntwkLineNo
		}
		
		dataParam.pageNo = '1';//
    	dataParam.rowPerPage = '20';
    	
		cflineShowProgressBody();
		
		gridModel1.get({
	    		data: dataParam
		}).done(function(response,status,xhr,flag){successPopCallback(response, 'search')})
		  .fail(function(response,status,flag){failPopCallback(response, 'search')});
	}
	
	//초기 조회 성공시
    function successPopCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
    	if (flag == 'search') {
			//console.log(response);			
    	}
    }
    
    function failPopCallback(response, status, flag){
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
});