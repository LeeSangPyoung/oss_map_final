/**
 * ErpAprvMgmtList
 * 
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */

var gridId4CurLength = 100;
var DefaultGrid4Length = 100;
var buseScroll = false;

var gridSearchModel = Tango.ajax.init({
                           	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/areaList"
                       		,data: {
                       	        pageNo: 1,             // Page Number,
                       	        rowPerPage: 1000        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
                       	    }
                       });

var gridSearchMode2 = Tango.ajax.init({
						   	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/objectList"
								,data: {
							        pageNo: 1,             // Page Number,
							        rowPerPage: 1000        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
							    }
						});

var gridSearchMode3 = Tango.ajax.init({
						   	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/demandList"
								,data: {
							        pageNo: 1,             // Page Number,
							        rowPerPage: 100        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
							    }
						});





/*var gridSearchMode4 = Tango.ajax.init({
                           	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvMgmtList"
                       		,data: {
                       	        pageNo: 1,             // Page Number,
                       	        rowPerPage: DefaultGrid4Length        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
                       	    }
                       });
*/
var gridSearchMode5 = Tango.ajax.init({
			   	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/fixdemandlist"
					,data: {
				        pageNo: 1,             // Page Number,
				        rowPerPage: 1000        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
				    }
});

var gridSearchMode6 = Tango.ajax.init({
						   	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvPrjUpdateList"
								,data: {
							        pageNo: 1,             // Page Number,
							        rowPerPage: 1000        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
							    }
						});

var gridSearchMode7 = Tango.ajax.init({
	url: "tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpPrjCodeConditionList"
		,data: {
			pageNo: 1,             // Page Number,
			rowPerPage: 1000        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
		}
});


var tabInfo = [
	              {  model : gridSearchModel ,gridId : 'resultGrid1', pageNo: 1, rowPerPage: 1000},
	              {  model : gridSearchMode2 ,gridId : 'resultGrid2', pageNo: 1, rowPerPage: 1000},
	              {  model : gridSearchMode3 ,gridId : 'resultGrid3', pageNo: 1, rowPerPage: 100},
	              //{  model : gridSearchMode4 ,gridId : 'resultGrid4', pageNo: 1, rowPerPage: DefaultGrid4Length},
				  {	 model : gridSearchMode5 ,gridId : 'resultGrid5', pageNo: 1, rowPerPage: 1000},
	              {  model : gridSearchMode6 ,gridId : 'resultGrid6', pageNo: 1, rowPerPage: 1000},
				  {  model : gridSearchMode7 ,gridId : 'resultGrid7', pageNo: 1, rowPerPage: 1000}
               ];
$a.page(function() {
    
	var tabIndex = '1';
	//그리드 ID
    var gridId1 = 'resultGrid1';
    var gridId2 = 'resultGrid2';
    var gridId3 = 'resultGrid3';
    //var gridId4 = 'resultGrid4';
    var gridId5 = 'resultGrid5';
    var gridId6 = 'resultGrid6';
    var gridId7 = 'resultGrid7';
    
    var demdViewList = null;
    var wbsViewList = null;
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$(".tab2_3").hide();
    	$(".tab3_3").hide();
    	$("#bTab5").hide();
		$(".tab_none6").show();
		$(".tab5_2").hide();
		$(".tab5_3").hide();
		$(".tab6_2").hide();
		$(".tab6_3").hide();
		$(".tab7_1").hide();
		
    	$('#cnt').hide();
		$('#szCnt').hide();
		$('#btnApplyDivision').hide();
    	//console.log(id,param);
    	
    	$('#cancelerpaprv_btn').hide();
    	$('#btnDemandListExportExcel').hide();
   // 	$('#erpaprvreq_btn').setEnabled(false);
   //	$('#openerpaprvprev_btn').setEnabled(false);
    	
        initGrid();
    	setCombo();
    	setEventListener();
    	
    };
    

  	//Grid 초기화
    function initGrid() {
    	var mapping1 =  [
			
		  {	key : 'mtrlKndNm',		align:'center',		width:'90px',	title : demandMsgArray['division']/*'구분'*/     /*,groupFooter:[demandMsgArray['summarization']'합계']   ,groupFooterAlign:['center']*/}
		, {	key : 'temp',			align:'center',		width:'30px',	title : demandMsgArray['division']/*'구분'*/,hidden : true			}
		, {	key : 'investAmtAll',	align:'right',		width:'120px',	title : demandMsgArray['investCost']/*'투자비'*/,	render:{type:"string", rule : "comma"}	/*,groupFooter:['sum()']	,groupFooterAlign:'right'*/}
		, {	key : 'bonsaInvestamt',  align:'right',		width:'120px',	title : demandMsgArray['investCost']/*'투자비'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'bonsaSub',		align:'right',		width:'120px',	title : demandMsgArray['caculateSub']/*'식/SUB'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'sudoInvestamt',  align:'right',		width:'120px',	title : demandMsgArray['investCost']/*'투자비'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'sudoSub',		align:'right',		width:'120px',	title : demandMsgArray['caculateSub']/*'식/SUB'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'busanInvestamt',	align:'right',		width:'120px',	title : demandMsgArray['investCost']/*'투자비'*/,	render:{type:"string", rule : "comma"}/*,		groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'busanSub',		align:'right',		width:'120px',	title : demandMsgArray['caculateSub']/*'식/SUB'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	/*, {	key : 'daeguInvestamt',	align:'right',		width:'120px',	title : demandMsgArray['investCost'],	render:{type:"string", rule : "comma"},		groupFooter:['sum()'], groupFooterAlign:'right'}
    	, {	key : 'daeguSub',		align:'right',		width:'120px',	title : demandMsgArray['caculateSub'],	render:{type:"string", rule : "comma"},	groupFooter:['sum()'],	groupFooterAlign:'right'}*/
    	, {	key : 'seobuInvestamt',	align:'right',		width:'120px',	title : demandMsgArray['investCost']/*'투자비'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'seobuSub',		align:'right',		width:'120px',	title : demandMsgArray['caculateSub']/*'식/SUB'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
    	, {	key : 'jungbuInvestamt',align:'right',		width:'120px',	title : demandMsgArray['investCost']/*'투자비'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],groupFooterAlign:'right'*/}
    	, {	key : 'jungbuSub',		align:'right',		width:'120px',	title : demandMsgArray['caculateSub']/*'식/SUB'*/,	render:{type:"string", rule : "comma"}/*,	groupFooter:['sum()'],	groupFooterAlign:'right'*/}
			];
  		
        //그리드 생성
        $('#'+gridId1).alopexGrid({
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false
            ,headerGroup:
    			[
    				{fromIndex:3, toIndex:4, title:demandMsgArray['headquarters']/*"본사"*/},
    				{fromIndex:5, toIndex:6, title:demandMsgArray['capitalArea']/*"수도권"*/},
    				{fromIndex:7, toIndex:8, title:demandMsgArray['easternPart']/*"동부"*/},
    				/*{fromIndex:9, toIndex:10, title:demandMsgArray['daegu']},*//*"대구"*/
    				{fromIndex:9, toIndex:10, title:demandMsgArray['westernPart']/*"서부"*/},
    				{fromIndex:11, toIndex:12, title:demandMsgArray['centerPart']/*"중부"*/}
    		    ]
            ,columnMapping : mapping1
            ,paging: {
         	   //pagerTotal:true,
         	   pagerSelect:false,
         	   hidePageList:true
            }
        	, footer : {
        		position: "bottom"
	    	   ,footerMapping : [
	    	                       {columnIndex: 0	, render:demandMsgArray['summarization']/*"합계"*/		, align:"center"	}
	    	                     , {columnIndex: 2	, render:"sum(investAmtAll)"							, align:"right"		, key : "investAmtAll"}
	    	                     , {columnIndex: 3	, render:"sum(bonsaInvestamt)"							, align:"right"		, key : "bonsaInvestamt"}
	    	                     , {columnIndex: 4	, render:"sum(bonsaSub)"								, align:"right"		, key : "bonsaSub"}
	    	                     , {columnIndex: 5	, render:"sum(sudoInvestamt)"							, align:"right"		, key : "sudoInvestamt"}
	    	                     , {columnIndex: 6	, render:"sum(sudoSub)"									, align:"right"		, key : "sudoSub"}
	    	                     , {columnIndex: 7	, render:"sum(busanInvestamt)"							, align:"right"		, key : "busanInvestamt"}
	    	                     , {columnIndex: 8	, render:"sum(busanSub)"								, align:"right"		, key : "busanSub"}
	    	                    /* , {columnIndex: 9	, render:"sum(daeguInvestamt)"							, align:"right"		, key : "daeguInvestamt"}
	    	                     , {columnIndex: 10	, render:"sum(daeguSub)"								, align:"right"		, key : "daeguSub"}*/
	    	                     , {columnIndex: 9	, render:"sum(seobuInvestamt)"							, align:"right"		, key : "seobuInvestamt"}
	    	                     , {columnIndex: 10	, render:"sum(seobuSub)"								, align:"right"		, key : "seobuSub"}
	    	                     , {columnIndex: 11	, render:"sum(jungbuInvestamt)"							, align:"right"		, key : "jungbuInvestamt"}
	    	                     , {columnIndex: 12	, render:"sum(jungbuSub)"								, align:"right"		, key : "jungbuSub"}
	    	                    ]
	       }
            /*,grouping:{
            	useGrouping:true,
            	by:['temp'],
            	useGroupFooter:['temp'],
            	useGroupRowspan:true
            } */
			,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
			,ajax: {
		         model: gridSearchModel                  // ajax option에 grid 연결할 model을지정
			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			 }
        });
        
        

	     var mapping2 =  [  	 		
 	 		{ key : 'investDiv', align:'center', width:'100px', title : demandMsgArray['investCost']/*'투자비'*/ , rowspan: true}
 	 		,{ key : 'eqpUsgNm', align:'center', width:'100px', title : demandMsgArray['usage']/*'용도'*/, rowspan: true}
 	 		,{ key : 'eqpDivNm', align:'center', width:'100px', title : demandMsgArray['division']/*'구분'*/, rowspan: true}
 	 		,{ key : 'hdqtrChrgUserNm', align:'center', width:'90px', title : demandMsgArray['chrg']/*'담당'*/, rowspan: true}
 	 		,{ key : 'demdBizDivDeltNm', align:'left', width:'250px', title : demandMsgArray['businessDivisionDetl']/*'사업구분 세부'*/, rowspan: true}
 	 		,{ key : 'shpTypNm', align:'left', width:'150px', title : demandMsgArray['shapeTypeName']/*'형상유형명'*/
	  	 		,render : function(value, data) {
					if ( value == 'subTotal' ){ 
						return demandMsgArray['subTotal'];
					} else if (value == 'summarization') {
						return demandMsgArray['summarization'];
					} else {
						return value;
					}
	  	 		}
	  	 		/*, groupFooter:[demandMsgArray['subTotal'] ]*//*'소계'*/}
 	 		,{ key : 'erpTotal', align:'right', width:'100px', title : demandMsgArray['enterpriseResourcePlanningInsert']/*'장비단가 입력'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'bonsaEqpCost', align:'right', width:'100px', title : demandMsgArray['budget']/*'예산'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'bonsaEqpCnt', align:'right', width:'100px', title : demandMsgArray['caculateSub']/*'식/SUB'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'bonsaEqpUprc', align:'right', width:'100px', title : demandMsgArray['unitPrice']/*'단가'*/, render:{type:"string", rule : "comma"}}
 	 		,{ key : 'sudoEqpCost', align:'right', width:'100px', title : demandMsgArray['budget']/*'예산'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'sudoEqpCnt', align:'right', width:'100px', title : demandMsgArray['caculateSub']/*'식/SUB'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'sudoEqpUprc', align:'right', width:'100px', title : demandMsgArray['unitPrice']/*'단가'*/, render:{type:"string", rule : "comma"}}
 	 		,{ key : 'busanEqpCost', align:'right', width:'100px', title : demandMsgArray['budget']/*'예산'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'busanEqpCnt', align:'right', width:'100px', title : demandMsgArray['caculateSub']/*'식/SUB'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'busanEqpUprc', align:'right', width:'100px', title : demandMsgArray['unitPrice']/*'단가'*/, render:{type:"string", rule : "comma"}}
 	 		/*,{ key : 'daeguEqpCost', align:'right', width:'100px', title : demandMsgArray['budget'], render:{type:"string", rule : "comma"}}
 	 		,{ key : 'daeguEqpCnt', align:'right', width:'100px', title : demandMsgArray['caculateSub'], render:{type:"string", rule : "comma"}}
 	 		,{ key : 'daeguEqpUprc', align:'right', width:'100px', title : demandMsgArray['unitPrice']'단가', render:{type:"string", rule : "comma"}}*/
 	 		,{ key : 'seobuEqpCost', align:'right', width:'100px', title : demandMsgArray['budget']/*'예산'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'seobuEqpCnt', align:'right', width:'100px', title : demandMsgArray['caculateSub']/*'식/SUB'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'seobuEqpUprc', align:'right', width:'100px', title : demandMsgArray['unitPrice']/*'단가'*/, render:{type:"string", rule : "comma"}}
 	 		,{ key : 'jungbuEqpCost', align:'right', width:'100px', title : demandMsgArray['budget']/*'예산'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'jungbuEqpCnt', align:'right', width:'100px', title : demandMsgArray['caculateSub']/*'식/SUB'*/, render:{type:"string", rule : "comma"}/*, groupFooter :['', 'sum()']*/}
 	 		,{ key : 'jungbuEqpUprc', align:'right', width:'100px', title : demandMsgArray['unitPrice']/*'단가'*/, render:{type:"string", rule : "comma"}}
 	 		//,{ key : '', align:'center', width:'100px', title : '비고'}
 			];
 		
 	     //그리드 생성
 	     $('#'+gridId2).alopexGrid({
 	         cellSelectable : true,
 	         autoColumnIndex : true,
 	         fitTableWidth : true,
 	         rowClickSelect : true,
 	         rowSingleSelect : false,
 	         rowInlineEdit : true,
 	         numberingColumnFromZero : false
   	   , columnMapping : mapping2
   	   ,paging: {
       	   //pagerTotal:true,
       	   pagerSelect:false,
       	   hidePageList:true
          }
 	       ,headerGroup:
  			[
  				{fromIndex:0, toIndex:5, title:demandMsgArray['budgetEnterpriseResourcePlanningUnitPriceSummary']/*"예산 및 장비단가표"*/},
  				{fromIndex:6, toIndex:6, title:demandMsgArray['unitWon']/*"단위:원"*/},
  				{fromIndex:7, toIndex:9, title:demandMsgArray['headquarters']/*"본사"*/},
  				{fromIndex:10, toIndex:12, title:demandMsgArray['capitalArea']/*"수도권"*/},
  				{fromIndex:13, toIndex:15, title:demandMsgArray['easternPart']/*"부산"*/},
  				/*{fromIndex:16, toIndex:18, title:demandMsgArray['daegu']},*//*"대구"*/
  				{fromIndex:16, toIndex:18, title:demandMsgArray['westernPart']/*"서부"*/},
  				{fromIndex:19, toIndex:21, title:demandMsgArray['centerPart']/*"중부"*/}
  		    ]
 	       ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
	  	    , grouping : {
	         	useGrouping : true,
	         	by : ['investDiv', 'eqpUsgNm', 'eqpDivNm', 'hdqtrChrgUserNm', 'demdBizDivDeltNm'],
	         	useGroupRowspan : true
	         }  	       
 	       , columnFixUpto : 6
			,ajax: {
		         model: gridSearchMode2                  // ajax option에 grid 연결할 model을지정
			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			 }
 	     });
 	     
        
        
        var mapping3 =  [
			//공통
			{
				selectorColumn : true,
				width : "30px" 
			},
			/*{ 
				numberingColumn : true,
				key : "id",
				title : "순번",
				align : "right",
				width : "55px",
				numberingColumn : true
			}*/
			{
				key : 'afeYr',
				align:'center',
				width:'80px',
				title : demandMsgArray['afeYear']
			}
			, {
				key : 'afeDemdDgr',
				align:'left',
				width:'80px',
				title : demandMsgArray['afeDegree']
			}
			, {
				key : 'erpHdofcNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['hdofc']
			}
			, {
				key : 'demdBizDivNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/
			}
			, {
				key : 'demdBizDivDetlNm',
				align:'left',
				width:'150px',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/
			}
			, {
				key : 'procStatYn',
				align:'center',
				width:'100px',
				title : '수요확정요청포함유무'
			}
			, {
				key : 'reqCnt',
				align:'center',
				width:'100px',
				title : '확정가능개수'
			}
			, {
				key : 'erpHdofcCd',
				align:'center',
				width:'100px',
				title : '',
				hidden: true
			}
			, {
				key : 'demdBizDivCd',
				align:'center',
				width:'100px',
				title : '',
				hidden: true
			}
			, {
				key : 'demdBizDivDetlCd',
				align:'center',
				width:'100px',
				title : '',
				hidden: true
			}
    	];
  		
        //그리드 생성
        $('#'+gridId3).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : false,
            numberingColumnFromZero : false,
            columnMapping : mapping3,
            headerGroup : [
                  			{ fromIndex :  1 , toIndex :  2 , title : "AFE구분" , id : ""}
                  			, { fromIndex : 4 , toIndex : 5 , title : "사업" , id : "" }

            ],
            paging:{
   				pagerSelect:false
   			}
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
	     
  	  /* var mapping4 =  [
  	        	 		{ key : 'check', align:'center', width:'50px', title :demandMsgArray['sequence'] '순번', numberingColumn : true }
//  	        	 		,{ selectorColumn : true, width : '35px' }
  	        	 		,{ key : 'trmsDemdMgmtNo', align:'left', width:'160px', title :demandMsgArray['transmissionDemandManagementNumber'] '수요관리번호',rowspan: true}
  	        	 		,{ key : 'tnPrjId', align:'left', width:'160px', title :'프로젝트코드' '수요관리번호'}
  	        	 		,{ key : 'demdProgStatNm', align:'left', width:'100px', title :demandMsgArray['progressStatus'] '진행상태',rowspan: true}
  	        	 		,{ key : 'typNm', align:'left', width:'100px', title : '타입'}
  	        	 		,{ key : 'erpAprvResult', align:'center', width:'100px', title :demandMsgArray['enterpriseResourcePlanningApprovalResult'] '시설계획 업로드 결과',
  	        	 			render : function(value, data) { 
    	            				     if (value == 'Y') {
    	            				    	 return demandMsgArray['approval'];
    	            				     } else if (value == 'N') {
    	            				    	 return demandMsgArray['errorEng'];
    	            				     } else {
    	            				    	 return value;
    	            				     }
    	            		    }
  	        	 		}
  	        	 		,{ key : 'demdDivNm', align:'left', width:'120px', title :demandMsgArray['demandDivision'] '수요구분',rowspan: true}
  	        	 		,{ key : 'cblnwPrityRnk', align:'center', width:'70px', title :demandMsgArray['prty'] '우선순위',rowspan: true}
  	        	 		,{ key : 'afeYr', align:'center', width:'70px', title :demandMsgArray['afeYear'] 'AFE년도',rowspan: true}
  	        	 		,{ key : 'afeDemdDgr', align:'center', width:'70px', title :demandMsgArray['afeDegree'] 'AFE차수',rowspan: true}
  	        	 		,{ key : 'erpAfeDgr', align:'center', width:'100px', title :"ERP전송차수" 'AFE차수',rowspan: true}
  	        	 		,{ key : 'demdBizDivNm', align:'left', width:'120px', title :demandMsgArray['businessDivisionBig'] '사업구분',rowspan: true}
  	        	 		,{ key : 'demdBizDivDetlNm', align:'left', width:'200px', title :demandMsgArray['businessDivisionDetl'] '세부사업구분',rowspan: true}
  	        	 		,{ key : 'bizNm', align:'left', width:'200px', title :demandMsgArray['businessName'] '사업명',rowspan: true}
  	        	 		,{ key : 'sumEqpLn', align:'right', width:'100px', title :demandMsgArray['investCost'] '투자비', render:{type:"string", rule : "comma"},rowspan: true}
  	        	 		,{ key : 'sumEqp', align:'right', width:'100px', title :demandMsgArray['equipment'] '장비', render:{type:"string", rule : "comma"},rowspan: true}
  	        	 		,{ key : 'sumLn', align:'right', width:'100px', title :demandMsgArray['ln'] '선로', render:{type:"string", rule : "comma"},rowspan: true}
  	        	 		,{ key : 'acsnwMgmtNo', align:'right', width:'100px', title :'A망번호',rowspan: true, hidden: true}
  	        	 		
  	        			];
  	       */ 		
  	   	//그리드 생성
	   /* $('#'+gridId4).alopexGrid({
	        cellSelectable : true,
	        autoColumnIndex : true,
	        fitTableWidth : true,
	        rowClickSelect : true,
	        rowSingleSelect : true,
	        rowInlineEdit : true,
	        numberingColumnFromZero : false
	        ,paging: {
	        	   //pagerTotal:true,
	        	   pagerSelect:false,
	        	   hidePageList:true
	           }
		    ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",
				filterNodata : 'No data'
			}
	        ,columnMapping : mapping4
	        ,grouping : {
              	useGrouping : true,
              	by : ['trmsDemdMgmtNo', 'demdProgStatNm', 'demdDivNm', 'cblnwPrityRnk', 'afeYr', 'afeDemdDgr', 'erpAfeDgr', 'demdBizDivNm', 'demdBizDivDetlNm', 'bizNm'
              		, 'sumEqpLn', 'sumEqp', 'sumLn'],
              	useGroupRowspan : true
            }
			,ajax: {
		         model: gridSearchMode4                 // ajax option에 grid 연결할 model을지정
			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			 }
	    });
	    
	    */
	    
	    
	    var mapping7 =  [
	  	        	 		{ key : 'wbsId', align:'left', width:'100px', title :'WBS 요소' /*'WBS 요소'*/,rowspan: true}
	  	        	 		,{ key : 'erpHdofcNm', align:'left', width:'80px', title :demandMsgArray['hdofc'] /*'본부'*/,rowspan: true}
	  	        	 		,{ key : 'demdBizDivNm', align:'left', width:'100px', title :demandMsgArray['businessDivisionBig'] /*'사업구분'*/,rowspan: true}
	  	        	 		,{ key : 'demdBizDivDetlNm', align:'left', width:'200px', title :demandMsgArray['businessDivisionDetl'] /*'세부사업구분'*/,rowspan: true}
	  	        	 		
	  	        	 		,{ key : 'eqpTypeNm', align:'left', width:'80px', title :demandMsgArray['equipmentType'] /*'장비타입'*/}
	  	        	 		,{ key : 'cstrTypeCd', align:'left', width:'80px', title: '공사유형코드', hidden : true}
	  	        	 		,{ key : 'cstrTypeCdNm', align:'left', width:'80px', title: '공사유형'}
	  	        	 		
	  	        	 		,{ key : 'erpHdofcCd', align:'left', width:'80px', title :'', hidden : true}
	  	        	 		,{ key : 'eqpTypeCd', align:'left', width:'80px', title :'', hidden : true}
	  	        	 		,{ key : 'demdBizDivCd', align:'left', width:'200px', title :'', hidden : true}
	  	        	 		,{ key : 'demdBizDivDetlCd', align:'left', width:'200px', title :'', hidden : true}
	  	        	 		
	  	        	 		,{ key : 'sumReqPos', align:'right', width:'80px', title :demandMsgArray['reqPosCnt'] /*'발급요청가능개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumIssu', align:'right', width:'80px', title :demandMsgArray['issuReqCnt'] /*'발급요청개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumExec', align:'right', width:'100px', title :demandMsgArray['exePrjCnt'] /*'실행프로젝트개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumUse', align:'right', width:'80px', title :demandMsgArray['constructionUseCnt'] /*'공사사용개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumLeft', align:'right', width:'60px', title :demandMsgArray['remainderCnt'] /*'잔여개수'*/, render:{type:"string", rule : "comma"}}
	  	        			];
	  	        		
	  	   	//그리드 생성
		    $('#'+gridId7).alopexGrid({
		        cellSelectable : false,
		        autoColumnIndex : true,
		        fitTableWidth : true,
		        rowClickSelect : false,
		        rowSingleSelect : false,
		        rowInlineEdit : false,
		        numberingColumnFromZero : false
		        ,paging: {
		        	   //pagerTotal:true,
		        	   pagerSelect:false,
		        	   hidePageList:true
		           }
			    ,message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
					filterNodata : 'No data'
				}
		        ,columnMapping : mapping7
		        ,grouping : {
		        	useGrouping : true,
	              	by : ['wbsId', 'erpHdofcNm', 'demdBizDivNm', 'demdBizDivDetlNm'],
	              	useGroupRowspan : true
	            }
				,ajax: {
			         model: gridSearchMode7                 // ajax option에 grid 연결할 model을지정
				        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
				 }
		    });
	    	    
	    var mapping6 =  [
	        	 		 /*{ selectorColumn : true, width : '35px' }
	        	 		,*/{ key : 'check', align:'left', width:'40px', title : '번호', numberingColumn : true }
	        	 		,{ key : 'tnPrjId', align:'left', width:'80px', title : demandMsgArray['projectCode']/*'프로젝트코드'*/}
	        	 		,{ key : 'afeYr', align:'center', width:'60px', title : demandMsgArray['afeYear']/*'AFE년도'*/}
	        	 		,{ key : 'afeDemdDgr', align:'center', width:'60px', title : demandMsgArray['afeDegree']/*'AFE차수'*/}
	        	 		,{ key : 'erpHdofcNm', align:'center', width:'70px', title : demandMsgArray['hdofc']/*'본부'*/}
	        	 		,{ key : 'demdBizDivCd', align:'left', width:'10px', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/, hidden: true}
	        	 		,{ key : 'demdBizDivNm', align:'left', width:'100px', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/}
	        	 		,{ key : 'demdBizDivDetlNm', align:'left', width:'200px', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/}
	        	 		,{ key : 'demdBizDivDetlCd', align:'left', width:'10px', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/, hidden: true}
	        	 		,{ key : 'intgFcltsCd', align:'left', width:'100px', title : demandMsgArray['integrationFacilitiesCode']/*'통합시설코드'*/}
	        	 		,{ key : 'intgFcltsNm', align:'left', width:'120px', title : demandMsgArray['integrationFacilitiesName']/*'통합시설명'*/}
	        	 		,{ key : 'eqpDivNm', align:'center', width:'50px', title : '타입'	        	 		 }
	        	 		,{ key : 'eqpTypNm', align:'center', width:'50px', title : demandMsgArray['equipmentType'] /*'장비타입'*/}
	        	 		,{ key : 'bizCstrTypCd', align:'center', width:'50px', title : '공사유형 코드' /*'공사유형'*/, hidden: true}
	        	 		,{ key : 'bizCstrTypCdNm', align:'center', width:'50px', title : '공사유형' /*'공사유형이름'*/}
	        	 		,{ key : 'useYn', align:'center', width:'50px', title : '사용여부'}
	        	 		,{ key : 'engstNo', align:'center', width:'80px', title : 'Eng No'}
	        			];
	        		
	     //그리드 생성
	     $('#'+gridId6).alopexGrid({
	         cellSelectable : true,
	         autoColumnIndex : true,
	         fitTableWidth : true,
	         rowClickSelect : true,
	         rowSingleSelect : false,
	         rowInlineEdit : true,
	         numberingColumnFromZero : false
	         ,columnMapping : mapping6
	         ,paging: {
	        	   //pagerTotal:true,
	        	   pagerSelect:false,
	        	   hidePageList:true
	           }
	     	,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
			,ajax: {
		         model: gridSearchMode6                 // ajax option에 grid 연결할 model을지정
			    ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			 }
	     });
	     
	    var mapping5 =  [
	        	 		{ selectorColumn : true, width : '35px' }
	        	 		,{ key : 'check', align:'left', width:'40px', title : '번호', numberingColumn : true }
	        	 		,{ key : 'trmsDemdMgmtNo', align:'center', width:'160px', title :demandMsgArray['transmissionDemandManagementNumber'] /*'수요관리번호'*/}
	        	 		,{ key : 'demdDivNm', align:'center', width:'120px', title :demandMsgArray['demandDivision'] /*'수요구분'*/}
	        	 		,{ key : 'afeYr', align:'center', width:'60px', title : demandMsgArray['afeYear']/*'AFE년도'*/}
	        	 		,{ key : 'afeDemdDgr', align:'center', width:'60px', title : demandMsgArray['afeDegree']/*'AFE차수'*/}
	        	 		,{ key : 'erpHdofcNm', align:'center', width:'70px', title : demandMsgArray['hdofc']/*'본부'*/}
	            		,{ key : 'bizNm', align:'left', width:'220px', title : demandMsgArray['businessName'], }/*사업명*/
	        	 		,{ key : 'demdBizDivCd', align:'left', width:'10px', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/, hidden: true}
	        	 		,{ key : 'demdBizDivNm', align:'left', width:'100px', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/}
	        	 		,{ key : 'demdBizDivDetlNm', align:'left', width:'200px', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/}
	        	 		,{ key : 'demdBizDivDetlCd', align:'left', width:'10px', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/, hidden: true}
	        			];
	        		
	     //그리드 생성
	     $('#'+gridId5).alopexGrid({
	         cellSelectable : true,
	         autoColumnIndex : true,
	         fitTableWidth : true,
	         rowClickSelect : true,
	         rowSingleSelect : false,
	         rowInlineEdit : true,
	         numberingColumnFromZero : false
	         ,columnMapping : mapping5
	         ,paging: {
	        	   //pagerTotal:true,
	        	   pagerSelect:false,
	        	   hidePageList:true
	           }
	     	,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
			,ajax: {
		         model: gridSearchMode5                 // ajax option에 grid 연결할 model을지정
			    ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			 }
	     });
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function setCombo() {
    	//AFE 구분 콤보박스
    	selectAfeYearCode('afeYr', 'N', '');
    	// 사업구분 대
    	selectYearBizCombo('demdBizDivCd', 'Y', '2016', 'C00618', '', 'TA');
    	//본부 콤보박스
    	selectComboCode('erpHdofcCd', 'Y', 'C00623', '');
    	//수요구분
    	selectComboCode('demdDivCd', 'Y', 'C00639', '');  // 수요구분
    	
    	//진행상태 콤보박스
    	selectComboCode('demdProgStatCd', 'Y', 'C00640', '');
    	
    	//진행상태 콤보박스
    	selectComboCode('eqpTypeCd', 'Y', 'C00628', '');
    	
    	//전송실 콤보박스
    	//selectComboIntgfclts('erpIntgFcltsCd', 'NS', '', '');
    	
    	//ERP 공사유형 콤보박스
    	selectComboCode('erpBizTypCd', 'Y', 'C02510', 'T');
    	
    	var comCdParam = {
				comGrpCd : 'C00619'
			};
    	demandRequest(
				'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
				comCdParam, 'GET', "cstrTypCd");
		demandRequest(
				'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
				comCdParam, 'GET', "bizCstrTypCd");
    }
    
    function setEventListener() {

    	//$("#pageNo").val(1);
    	//$('#rowPerPage').val(15);
    	$('#btnApplyDivision').hide();

    	
    	$('#basicTabs').on("tabchange", function(e, index) {
    		tabChange();
    	});
    	
    	$('#basicTabs_invest').on("tabchange", function(e, index) {
    		tabChange();
    	});
    	
    	$('#basicTabs_aprv').on("tabchange", function(e, index) {
    		tabChange();
    	});
    	
    	// 진행상태 코드가 셋팅되는 경우
    	$('#demdProgStatCd').on('change', function(e) {    		
    		$(this).find("option[value='105006']").remove(); // 수요POOL 삭제
    		$(this).find("option[value='105001']").remove(); // 계획수요 삭제
    	});
    	
    	$('#demdDivCd').on('change', function(e) {    		
    		$(this).find("option[value='104003']").remove(); 
    	});
    	
    	// 진행상태 코드가 셋팅되는 경우
    	$('#viewOption1').on('click', function(e) {    		
    		// console.log("click1");
    		// wbsViewList = $('#'+gridId5).alopexGrid('dataGet');
    		gridRemake();
    		
    		/*var pageInfo = $('#'+gridId5).alopexGrid('pageInfo');
			pageInfo.dataLength = demdViewList.length;
			console.log(demdViewList);
    		$('#'+gridId5).alopexGrid("dataSet", demdViewList, pageInfo);*/
    	});
    	
    	// 진행상태 코드가 셋팅되는 경우
    	$('#viewOption2').on('click', function(e) { 
    		// demdViewList = $('#'+gridId5).alopexGrid('dataGet');
    		gridRemake();
    		
    		/*var pageInfo = $('#'+gridId5).alopexGrid('pageInfo');
			pageInfo.dataLength = wbsViewList.length;
			console.log(wbsViewList);
    		$('#'+gridId5).alopexGrid("dataSet", wbsViewList, pageInfo);*/
    	});
    	
    	
        // 검색
        $('#search').on('click', function(e) {

        	/*$("#pageNo").val(1);
        	$('#rowPerPage').val(15);
        	
        	tabIndex = $('#basicTabs').getCurrentTabIndex();
        	var url;
        	var dataParam =  $("#searchForm").getData();
        	dataParam.firstRowIndex = 1;
        	dataParam.lastRowIndex = 20;
        	$("#firstRowIndex").val(1);
        	$("#lastRowIndex").val(20);
        	if(tabIndex == '0'){
        		url = 'tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/areaList';
        		showProgress(gridId1);
        	}else if(tabIndex == '1'){
        		url = 'tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/demandList';
        		showProgress(gridId2);
        	}else if(tabIndex == '2'){
        		url = 'tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/objectList';
        		showProgress(gridId3);
        	}else if(tabIndex == '3'){
        		url = 'tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvMgmtList';
        		showProgress(gridId4);
        	}
        	//tango transmission biz 모듈을 호출하여야한다.
        	
        	demandRequest(url, dataParam, 'GET', 'search');*/
        	
        	var dataParam =  $("#searchForm").getData();
        	var currTab = getCurrentTab();
        	
        	if(tabInfo[currTab].gridId == "resultGrid6"){
        		if($('#afeYr').val() == "" || $('#afeDemdDgr').val() == ""){
        			alertBox('W', 'AFE 구분 선택은 필수입니다.'); 
            		return;
        		}
        		
        	}
        	
        	bodyProgress();
        	dataParam.pageNo = tabInfo[currTab].pageNo;//'1';
        	dataParam.rowPerPage = tabInfo[currTab].rowPerPage;//'15';
        	
        	if(currTab == 5){
        		if($('#viewOption1').is(":checked") == true)
        			dataParam.divCd = "demd";
        		else
        			dataParam.divCd = "wbs";
        	}
        	
    		tabInfo[currTab].model.get({
        		data: dataParam,
    		}).done(function(response,status,xhr,flag){successDemandCallback(response, 'search')})
    	  	  .fail(function(response,status,flag){failDemandCallback(response, 'search')});
        });
        
        //AFE 구분 콤보박스
        $('#afeYr').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		selectAfeTsCode('afeDemdDgr', 'N', '', dataParam);
    		selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
    		
    		var selectTab = getCurrentTab();
    		if(selectTab == 3){
    			selectWbsIdList('wbsId', 'Y', '', dataParam);
    			selectEqpTypCdInPrjList('eqpTypeCd', 'Y', '', dataParam);
    		}
    		dataParam.flag = 'preApev';    		
    		selectComboCodeByErp('erpBizDivCd', 'Y', '', dataParam);
        });
        
        //AFE 구분(세부차수) 콤보박스
        $('#afeDemdDgr').on('change',function(e) {
			var selectTab = getCurrentTab();
			var dataParam =  $("#searchForm").getData();
    		if(selectTab == 3){
    			selectWbsIdList('wbsId', 'Y', '', dataParam);
    			selectEqpTypCdInPrjList('eqpTypeCd', 'Y', '', dataParam);
    		}
	        	
        	dataParam.demdBizDivDetlCd = dataParam.demdBizDivDeltCd;   // commonVO에 없어서
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParam, 'GET', 'selectWbsList');
    		
	        	
        });
        
        // 본부 콤보박스
        $('#erpHdofcCd').on('change',function(e) {
    		var selectTab = getCurrentTab();
    		var dataParam =  $("#searchForm").getData();
    		if(selectTab == 3){
    			selectWbsIdList('wbsId', 'Y', '', dataParam);
    			selectEqpTypCdInPrjList('eqpTypeCd', 'Y', '', dataParam);
    		}
    		
        	// WBS TYPE 추출
        	dataParam.demdBizDivDetlCd = dataParam.demdBizDivDeltCd;   // commonVO에 없어서
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParam, 'GET', 'selectWbsList');
    		
       
        });
        
        // ERP 사업구분코드 변경 시 erp 사업유형 리스트 갱신해준다.
        $('#erpBizDivCd').on('change',function(e) {
        	var dataParam =  $("#searchForm").getData();
        	if (this.value == "") {
        		selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
        	} else {
        		
        		dataParam.afeDemdDgr = ''; 
        		dataParam.flag = 'preApev';
        		
        		selectYearBizComboByErp('demdBizDivCd', 'Y', '', dataParam);
        	}
    		
    		// WBS 추출
    		var dataParamWbs =  $("#searchForm").getData();
        	dataParamWbs.demdBizDivDetlCd = dataParamWbs.demdBizDivDeltCd;   // commonVO에 없어서
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParamWbs, 'GET', 'selectWbsList');
        });
    	
    	var tmpErpBizTypCd = "";
    	// ERP 공사유형드 변경 시 erp 사업유형 리스트 갱신해준다.
        $('#erpBizTypCd').on('change',function(e) {
        	if (tmpErpBizTypCd == this.value) {
        		return;
        	}
        	tmpErpBizTypCd = this.value;
        	var dataParam =  $("#searchForm").getData();
    		
    		// WBS 추출
        	dataParam.demdBizDivDetlCd = dataParam.demdBizDivDeltCd;   // commonVO에 없어서
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParam, 'GET', 'selectWbsList');
        });
    	
        //사업 구분(대) 콤보박스        
    	$('#demdBizDivCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if($('#demdBizDivCd').val() != ""){
    			selectYearBizCombo('demdBizDivDeltCd', 'Y', $("#afeYr").val(), $("#demdBizDivCd").val(), '', 'TA');	// 사업구분 소
    		}else{
    			$('#demdBizDivDeltCd').empty();
    			$('#demdBizDivDeltCd').append('<option value="">'+demandMsgArray['all']+'</option>');
    			$('#demdBizDivDeltCd').setSelected("");
    		}
    		
    		var selectTab = getCurrentTab();
    		if(selectTab == 3){
    			selectWbsIdList('wbsId', 'Y', '', dataParam);
    		}
        });
    	
    	//사업 구분(세부) 콤보박스        
    	$('#demdBizDivDeltCd').on('change',function(e) {
			var selectTab = getCurrentTab();
    		if(selectTab == 3){
    			var dataParam =  $("#searchForm").getData();
    			selectWbsIdList('wbsId', 'Y', '', dataParam);
    		}
        });    	
    	
    	// WBS ID 콤보박스
        $('#wbsId').on('change',function(e) {
    		var selectTab = getCurrentTab();
    		if(selectTab == 3){
    			var dataParam =  $("#searchForm").getData();
    			selectEqpTypCdInPrjList('eqpTypeCd', 'Y', '', dataParam);
    		}
        });
        
        $('#eqpTypCd').change(function(){
			var comCdParam = {
					comGrpCd : 'C00619'
				};
				demandRequest(
						'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
						comCdParam, 'GET', "bizCstrTypCd");
		});
    	
    	//승인버튼        
    	$('#confirm_btn').on('click',function(e) {
    		
    		var confirmList = AlopexGrid.trimData ( $('#'+gridId3).alopexGrid("dataGet", { _state : {selected:true }} ));
    		
    		if (confirmList.length <= 0) {
        		alertBox('W', demandMsgArray['selectNoDataForApproval']); /*"선택된 데이터가 없습니다.\n승인할 데이터를 선택해 주세요."*/
        		return;
        	}
    		
    		/*for(var i = 0;i<confirmList.length;i++){
        		if(confirmList[i].demdProgStatCd !="105004"){
        			alertBox('W', demandMsgArray['cantApproveDemandConfirmReqStatus']); "진행상태가 수요확정요청 이외의 정보는 \n승인 불가능 합니다."
        			return;
        		}
        	}*/
    		var dataParam = $("#searchForm").getData();
    		/*if(confirm("전송망 수요를 승인하시겠습니까?")){
    			dataParam.gridData = { 
    					confirmAccessDemandInfoList : confirmList
        		};
        		var sflag = {
      				  jobTp : 'confirmList'   // 작업종류
        		};
        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/confirmaccessdemandinfo', dataParam, 'POST', 'confirmList');
        	}else{
        		return;
        	}*/
    		
    		for(var i = 0; i < confirmList.length; i++){
    			var data = confirmList[i];
    			if(data.procStatYn == "N"){
    				alertBox('W','수요확정요청이 포함되지 않은 사업은 승인할 수 없습니다.');
            		return false;
    			}
    		}
    		
    		/*"전송망 수요를 승인하시겠습니까?"*/
        	callMsgBox('','C', demandMsgArray['transmissionNetworkDemandApprv'], function(msgId, msgRst){  

        		if (msgRst == 'Y') {
        			//bodyProgress();
        			var updateData = [];
        			$.each(confirmList, function(idx, obj){
        				obj.div = "aprv";
        				obj.divCd = $('#divCd').val();
        				obj.demdDivCd = $('#demdDivCd').val();
        				updateData.push(obj);
        			});
        			
        			demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/updateRequestStateList'
  				           , updateData
  				           , 'POST'
  				           , 'updateRequestStateListAprv');
        			
        			/*dataParam.gridData = { 
        					confirmAccessDemandInfoList : confirmList
            		};
            		var sflag = {
          				  jobTp : 'confirmList'   // 작업종류
            		};
            		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/confirmaccessdemandinfo', dataParam, 'POST', 'confirmList');*/
        		}
        	});
        });
    	
    	//반려버튼        
    	$('#wait_btn').on('click',function(e) {
    		
    		var waitList = AlopexGrid.trimData ( $('#'+gridId3).alopexGrid("dataGet", { _state : {selected:true }} ));
    		
    		if (waitList.length <= 0) {
    			alertBox('W', demandMsgArray['selectNoDataForCancel']); /*"선택된 데이터가 없습니다.\n반려할 데이터를 선택해 주세요."*/
        		return;
        	}
    		
    		/*for(var i = 0;i<waitList.length;i++){
        		if(waitList[i].demdProgStatCd !="105004"){
        			alertBox('W', demandMsgArray['cantCancelDemandConfirmReqStatus']); "진행상태가 수요확정요청 이외의 정보는 \n반려 불가능 합니다."
        			return;
        		}
        	}*/
    		var dataParam = $("#searchForm").getData();
    		/*if(confirm("전송망 수요를 반려하시겠습니까?")){
    			dataParam.gridData = { 
    					waitAccessDemandInfoList : waitList
        		};
        		var sflag = {
      				  jobTp : 'waitList'   // 작업종류
        		};
        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/cancelaccessdemandinfo', dataParam, 'POST', 'waitList');
        	}else{
        		return;
        	}*/
    		
    		for(var i = 0; i < waitList.length; i++){
    			var data = waitList[i];
    			if(data.procStatYn == "N"){
    				alertBox('W','수요확정요청이 포함되지 않은 사업은 취소할 수 없습니다.');
            		return false;
    			}
    		}
    		
    		/*"전송망 수요를 승인하시겠습니까?"*/
        	callMsgBox('','C', demandMsgArray['transmissionNetworkDemandCancel'], function(msgId, msgRst){  

        		if (msgRst == 'Y') {
        			/*dataParam.gridData = { 
        					waitAccessDemandInfoList : waitList
            		};
            		var sflag = {
          				  jobTp : 'waitList'   // 작업종류
            		};
            		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/cancelaccessdemandinfo', dataParam, 'POST', 'waitList');*/
        			var updateData = [];
        			$.each(waitList, function(idx, obj){
        				obj.div = "cancle";
        				obj.divCd = $('#divCd').val();
        				obj.demdDivCd = $('#demdDivCd').val();
        				updateData.push(obj);
        			});
        			
        			demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/updateRequestStateList'
  				           , updateData
  				           , 'POST'
  				           , 'updateRequestStateListCancle');
        		}
        	});
        });
        
    	//지역별 엑셀다운로드
        $('#btnAreaListExportExcel').on('click', function(e) {        	
        	bodyProgress();
        	var worker = new ExcelWorker({
        		excelFileName: '본부별_투자비_통계',
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '본부별_투자비_통계',
        			$grid: $('#resultGrid1')
        		}] 
        	});
        	worker.export({
        		merge: true,
        		exportHidden: false,
        		filtered  : false,
        		selected: false,
        		useGridColumnWidth : true,
        		border  : true
        		,exportGroupSummary:true
        		, exportFooter:true
        	});
        	bodyProgressRemove();
        });
        
        //수요별 엑셀다운로드
        $('#btnDemandListExportExcel').on('click', function(e) {        	
        	bodyProgress();
        	var dataParam =  $("#searchForm").getData();
        	
        	dataParam = gridExcelColumn(dataParam, gridId3);
        	
        	dataParam.fileName = demandMsgArray['demandInvestCostStatistics']/*"수요별_투자비_통계"*/;
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "DemandList";
        	dataParam.firstRowIndex = 1;
        	dataParam.lastRowIndex = 30000;          		
        	
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        //목적별 엑셀다운로드
        $('#btnObjectListExportExcel').on('click', function(e) {        	
        	bodyProgress();
        	var dataParam =  $("#searchForm").getData();
        	
        	dataParam = gridExcelColumn(dataParam, gridId2);
        	
        	dataParam.fileName = '사업별_투자비_통계';
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "ObjectList";
        	dataParam.firstRowIndex = 1;
        	dataParam.lastRowIndex = 30000;  
        		
        	//console.log(dataParam);
        	
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        //ERP 승인관리 엑셀다운로드
        $('#btnErpAprvMgmtListExportExcel').on('click', function(e) {        	
        //	bodyProgress();
        /*	var dataParam =  $("#searchForm").getData();
        	
        	dataParam = gridExcelColumn(dataParam, gridId4);
        	
        	dataParam.fileName = demandMsgArray['enterpriseResourcePlanningApprovalManagementStatistics']"시설계획_업로드_통계";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "ErpAprvMgmtList";
        	dataParam.firstRowIndex = 1;
        	dataParam.lastRowIndex = 30000;  
        		
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/excelcreate', dataParam, 'GET', 'excelDownload');*/
        	bodyProgress();
        	var sheetName = '시설계획 업로드';
        	
        	var worker = new ExcelWorker({
        		excelFileName: sheetName/*'지역별_투자비_통계'*/,
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: sheetName/*'지역별_투자비_통계'*/,
        			$grid: $('#'+ gridId7)
        		}] 
        	});
        	worker.export({
        		merge: true,
        		exportHidden: false,
        		filtered  : false,
        		selected: false,
        		useGridColumnWidth : true,
        		border  : true,
        		useCSSParser : true
        		//exportGroupSummary:true,
        		//exportFooter:true
        	});
        	bodyProgressRemove();
        	
        });
        
        // 집행위탁내역관리 엑셀다운로드
        $('#btnErpPrjCdMgmtListExportExcel').on('click', function(e) {        	
        	bodyProgress();
        	var dataParam =  $("#searchForm").getData();
        	
        	dataParam = gridExcelColumn(dataParam, gridId6);
        	
        	dataParam.fileName = "집행위탁내역현황"/*"집행위탁내역 현황"*/;
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "ErpPrjCdMgmtList";
        	dataParam.firstRowIndex = 1;
        	dataParam.lastRowIndex = 100000;  
        		
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        // ERP 승인요청
        $('#erpaprvreq_btn').on('click', function(e) {

        	var param = {};
	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvProgressYn', param, 'POST', 'erpAprvReq');
	   	 	
	    });
        
	    /*$('.erpaprvreq_btn').on('click', function(e) {

	    	$a.popup({
    	    	popid: 'ErpAprvReqSelPop',
    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']'ERP 승인요청',
    	    	iframe: true,
    	    	modal : true,
    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqSelPop.do',
    	        data: null,
    	        width : 650,
    	        height : window.innerHeight * 0.4,
    	        
    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
    	        callback: function(data) {
    	        	if (data == "OK") {
    	        		//bodyProgress();
	    	        	$a.popup({
	    	    	    	popid: 'ErpAprvReqPop',
	    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']'ERP 승인요청',
	    	    	    	iframe: true,
	    	    	    	modal : true,
	    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqPop.do',
	    	    	        data: null,
	    	    	        width : 1300,
	    	    	        height : window.innerHeight * 0.8,
	    	    	        
	    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	    	    	
	    	    	        callback: function(data) {	    	    	        	
	    	        			$('#search').click();   
	    	    	       	}
	    	        	});
    	        	}
    	       	}
	    	
        	});
	   	 	
	    });*/
	    $('#cancelerpaprv_btn').on('click', function(e) {
	    	var param = {};
	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/upsertErpAprvProgress', param, 'POST', 'upsertErpAprvProgress');
	    });
	    
	    $('#openerpaprvprev_btn').on('click', function(e) {
	    	$a.popup({
    	    	popid: 'ErpAprvPrevPop',
    	    	title: demandMsgArray['temporaryProjectCode']/*'선발급 프로젝트 코드 현황'*/,
    	    	iframe: true,
    	    	modal : true,
    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvPrevPop.do',
    	        data: null,
    	        width : 1200,
    	        height : 750, //window.innerHeight * 0.85,
    	        
    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
    	        callback: function(data) {
    	        	if (data == "OK") {
    	        		//bodyProgress();
	    	        	$a.popup({
	    	    	    	popid: 'ErpAprvReqProgStatPop',
	    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
	    	    	    	iframe: true,
	    	    	    	modal : true,
	    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqProgStatPop.do',
	    	    	        data: null,
	    	    	        width : 1400,
	    	    	        height : 800, //window.innerHeight * 0.9,
	    	    	        
	    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	    	    	
	    	    	        callback: function() {
	    	    	       	}
	    	        	});
    	        	}
    	       	}
	    	
        	});
	    });
	    
	    $('#openAfeAprv_btn').on('click', function(e) {
	    	var prm = $('#searchForm').getData();
	    	
	    	$a.popup({
    	    	popid: 'PopAfeAprv',
    	    	title: "AFE 승인내역"/*'선발급 프로젝트 코드 현황'*/,
    	    	iframe: true,
    	    	modal : true,
    	        url: '/tango-transmission-web/demandmgmt/afemgmt/PopAfeAprv.do',
    	        data: prm,
    	        width : 1000,
    	        height : 850,
    	        
    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
    	        callback: function(data) {
    	        	if (data == "OK") {
    	        		
    	        	}
    	       	}
	    	
        	});
	    });
	    /*
	    $('#'+gridId4).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	
        	if(object.bodycell == false)	return false;
        	// 통합시설코드 셀 클릭시
        	if (object.mapping.columnIndex == 5) {
        		if ( data._state.focused) {
        			if(data.erpAprvResult != "-"){
        				openErpAprvResultPopup(data);
        			}
        		}
        	}
        	else{
        		data.EditMode = "ERP";
        		if(data.demdDivCd == "104001")
        			openTransmissionPopup(data);
        		else if(data.demdDivCd == "104002"){
        			data.acsnwAfeDgr = data.afeDemdDgr;
        			openAccessPopup(data);
        		}
        			
        	}
        });*/
	    /*
	    $('#'+gridId4).on('scrollBottom', function(handler) {
	    	
    		var gridList = $('#'+gridId4).alopexGrid("dataGet");
    		var length = gridList.length;
    		
    		if(length != gridId4CurLength)		return false;
    		
    		gridId4CurLength += DefaultGrid4Length;
    		
    		buseScroll = true;
    		
    		var dataParam =  $("#searchForm").getData();
        	var selectTab = parseInt($('#basicTabs').getCurrentTabIndex());
        	
        	bodyProgress();
        	dataParam.pageNo = tabInfo[selectTab].pageNo;//'1';
        	dataParam.rowPerPage = gridId4CurLength;//'15';
        	tabInfo[selectTab].model.get({
        		data: dataParam,
    		}).done(function(response,status,xhr,flag){successDemandCallback(response, 'search')})
    	  	  .fail(function(response,status,flag){failDemandCallback(response, 'search')});
        });

	    */
	    
	    /*
	     * 사업구분 지정
	     * */
	    $('#btnApplyDivision').on('click', function(e) {
	    	
	    	var param = {
	    			afeYr : $('#afeYr').val(),
	    			afeDemdDgr : $('#afeDemdDgr').val()
	    	};
	    	
	    	$a.popup({
        		popid : 'DefBizDivOfExecCnsgPop',
        		url : 'DefBizDivOfExecCnsgPop.do',
        		iframe: true,
            	modal : false,
            	windowpopup : true,
        		width : 1250,
        		height : 817,
        		data : param,
        		title : '사업구분 지정',
        		movable : true,
        		callback : function(data){
        			
        		}
        	});
	    });
	    
	    /*
	     * 프로젝트조회
	     * */
	    $('#btnSearchPj').on('click', function(e) {
	    	var param = {
	    			  scAfeYr : $('#afeYr').val()
	    			, scAfeDemdDgr : $('#afeDemdDgr').val()
	    			, scDemdBizDivCd : $('#demdBizDivCd').val()
	    	        , scDemdBizDivDetlCd : $('#demdBizDivDeltCd').val()
	    	        , scErpHdofcCd : '00001196'
	    	        , eqpLnTypCd : 'T43'
	    	        , scCstrDivCd : '51'
	    	        , appltKndCd : ''//'01'
	    	        , eqpLnDivCd : 'EQP'
	    	};
	    	
	    	$a.popup({
        		popid : 'TransmissionDemandPoolListPop',
        		url : '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolListPop.do',
        		iframe: true,
            	modal : false,
            	windowpopup : true,
        		width : 1250,
        		height : 780,
        		data : param,
        		title : '프로젝트 ID 조회',
        		movable : true,
        		callback : function(data){
        			
        		}
        	});
	    });	    
        
        // 시설계획업로드  NEW
        $('#erpaprvreqNew_btn').on('click', function(e) {

        	/*var param = {};
	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvProgressYn', param, 'POST', 'erpAprvReqNew');*/
        	
        	$a.popup({
    	    	popid: 'ErpAprvReqSelPopNew',
    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
    	    	/*iframe: true,
    	    	modal : true,*/
    	    	iframe: true,
            	modal : false,
            	windowpopup : true,
    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqMultiSelPopNew.do',
    	        data: null,
    	        width : 1000,
    	        height : 750, //window.innerHeight * 0.4,
    	        
    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
    	        callback: function(reqAprvData) {
    	        	if (reqAprvData != null ) {
	    	        	$a.popup({
	    	    	    	popid: 'ErpAprvReqProgStatPopNew',
	    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
	    	    	    	iframe: true,
	    	    	    	modal : true,
	    	    	    	/*iframe: true,
	    	            	modal : false,
	    	            	windowpopup : true,*/
	    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqProgStatPopNew.do',
	    	    	        data: reqAprvData,
	    	    	        width : 1300,
	    	    	        height : 730, //window.innerHeight * 0.8,
	    	    	        xButtonClickCallback : function(el){ // x버튼 처리
	    	    	        	callMsgBox('','W', demandMsgArray['infoClose']);/*'닫기 버튼을 이용하여 종료하십시오.'*/
	    	    	        	return false;
	    	    		    },
	    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	    	    	
	    	    	        callback: function(data) {	    	    	        	
	    	        			$('#search').click();   
	    	    	       	}
	    	        	});
    	        	}
    	        	// 다른 팝업에 영향을 주지않기 위해
     				$.alopex.popup.result = null; 
    	       	}
	    	
        	});
	    });
        
        // 선발급  NEW
        $('#openerpaprvprevNew_btn').on('click', function(e) {

        	/*var param = {};
	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvProgressYn', param, 'POST', 'erpAprvReqNew');*/
        	
        	$a.popup({
    	    	popid: 'ErpAprvReqPrevSelPopNew',
    	    	title: demandMsgArray['temporaryProjectCode']/*'선발급 프로젝트 코드 현황'*/,
    	    	/*iframe: true,
    	    	modal : true,*/
    	    	iframe: true,
            	modal : false,
            	windowpopup : true,
    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvPrevReqMultiSelPopNew.do',
    	        data: null,
    	        width : 1500,
    	        height : 740, //window.innerHeight * 0.4,
    	        
    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
    	        callback: function(reqAprvData) {
    	        	if (reqAprvData != null ) {
	    	        	$a.popup({
	    	    	    	popid: 'ErpAprvReqProgStatPopNew',
	    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
	    	    	    	iframe: true,
	    	    	    	modal : true,
	    	    	    	/*iframe: true,
	    	            	modal : false,
	    	            	windowpopup : true,*/
	    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqProgStatPopNew.do',
	    	    	        data: reqAprvData,
	    	    	        width : 1300,
	    	    	        height : 730, //window.innerHeight * 0.8,
	    	    	        xButtonClickCallback : function(el){ // x버튼 처리
	    	    	        	callMsgBox('','W', demandMsgArray['infoClose']);/*'닫기 버튼을 이용하여 종료하십시오.'*/
	    	    	        	return false;
	    	    		    },
	    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	    	    	
	    	    	        callback: function(data) {	    	    	        	
	    	        			$('#search').click();   
	    	    	       	}
	    	        	});
    	        	}
    	        	// 다른 팝업에 영향을 주지않기 위해
     				$.alopex.popup.result = null; 
    	       	}
	    	
        	});
	    });
        
        // 프로젝트코드 에러처리
        $('#openerpaprvListNew_btn').on('click', function(e) {

        	$a.popup({
    	    	popid: 'ErpAprvReqListPopNew',
    	    	title: '프로젝트코드 발급 현황',
    	    	/*iframe: true,
    	    	modal : true,*/
    	    	iframe: true,
            	modal : false,
            	windowpopup : true,
    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqListPopNew.do',
    	        data: null,
    	        width : 1500,
    	        height : 750, //window.innerHeight * 0.4,
    	        
    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
    	        callback: function(reqAprvData) {
    	        	if (reqAprvData != null ) {
	    	        	$a.popup({
	    	    	    	popid: 'ErpAprvReqProgStatPopNew',
	    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
	    	    	    	iframe: true,
	    	    	    	modal : true,
	    	    	    	/*iframe: true,
	    	            	modal : false,
	    	            	windowpopup : true,*/
	    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqProgStatPopNew.do',
	    	    	        data: reqAprvData,
	    	    	        width : 1300,
	    	    	        height : 730, //window.innerHeight * 0.8,
	    	    	        xButtonClickCallback : function(el){ // x버튼 처리
	    	    	        	callMsgBox('','W', demandMsgArray['infoClose']);/*'닫기 버튼을 이용하여 종료하십시오.'*/
	    	    	        	return false;
	    	    		    },
	    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	    	    	
	    	    	        callback: function(data) {	    	    	        	
	    	        			$('#search').click();   
	    	    	       	}
	    	        	});
    	        	}
    	        	// 다른 팝업에 영향을 주지않기 위해
     				$.alopex.popup.result = null; 
    	       	}
	    	
        	});
	    });
        
        //확정수요 계획수요변경
        $('#btn_Decide_rollback').on('click', function(e) {
        	var dataList = $('#'+gridId5).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['selectChangeObject']);   /*변경할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		if (data.demdProgStatCd != '105005') {
        			//"계획수요인 수요만 삭제가 가능합니다.\n" + data.trmsDemdMgmtNo + "의 진행상태를 확인해 주세요.";
        			alertBox('W', makeArgMsg('onlyFixDemandChange', data.trmsDemdMgmtNo));  /*계획수요인 수요만 삭제가 가능합니다.<br>{0}의 진행상태를 확인해 주세요.*/
        			return;
        		}
        	}
        	
        	/*변경하시겠습니까?*/
        	callMsgBox('','C', demandMsgArray['confirmChange'], function(msgId, msgRst){  

        		if (msgRst == 'Y') {

            		bodyProgress();
	            	var updateData = [];
	    			
	    			$.each(dataList, function(idx, obj){
	    				updateData.push(obj);
	    			});
	    			
	        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/changefixdemdafedgr?method=put'
 				           , updateData
 				           , 'POST'
 				           , 'fixDemdRollbak');
        		}
        	});
        });
	};
        
	function openErpAprvResultPopup(data) {
//    	var sflag = {
//				  jobTp : 'sisulNm'   // 작업종류
//				, grid : grid       // 콤보종류
//				, allYn : ''     // 전체여부
//		};
    	 $a.popup({
	       	popid: 'ErpAprvResultPopup',
	       	title: demandMsgArray['enterpriseResourcePlanningApprovalResult']/*'시설계획 업로드 결과'*/,
	       	iframe: true,
	       	modal : true,
	           url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvResultPop.do',
	           data: data,
	           width : 1300,
	           height : 750, //window.innerHeight * 0.8,
	           /*
	       		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	       	*/
	           callback: function(data) {
	        	   //console.log(data);
	        	   //successDemandDetailCallback(data, sflag);
	          	}
	    });
    }
	
	function openAccessPopup(data){
		data.RM = 'DM';
	    $a.popup({
	    	popid: 'GetAccessDemandDetailPopup',
	    	title: demandMsgArray['accessNetworkDemandInfo'],/*'Access망 수요 전송망 상세정보',*/
	    	iframe: true,
	    	modal : true,
	        url: '/tango-transmission-web/demandmgmt/accessdemand/AccessDemandDetailPopup.do',
	        data: data,
	        width : 1550,
	        height : 800, //window.innerHeight * 0.9,
	        /*
	    		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	*/
	        callback: function(data) {
	        	if (data == true) {
	        		$('#search').click();
	        	}
	        	
	       	}
	    });	
	}
	function openTransmissionPopup(data){
	 	$a.popup({
	      	popid: 'GetTransmissionDemandPoolDetailPopup',
	      	title: demandMsgArray['cableNetworkDemandInfo'],/*유선망수요정보*/
	      	iframe: true,
	      	modal : true,
	          url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolDetail.do',
	          data: data,
	          width : 1600,
	          height : 800,//window.innerHeight * 0.95,
	          /*
	      		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	      	*/
	         callback: function(data) {
	          	if (data == true) {
	          		// 저장 혹은 수정이 있는경우 재검색
	          		$('#search').click();
	          	}
	         }
	     });
	}
	
	
	//request
	function demandRequest(surl,sdata,smethod,sflag)
    {		
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    	  //.error();
    }
	
	function setDemdProgStatCd(index) {
		if (index == 1) {
			
		}
	}
	
	//request 성공시
    function successDemandCallback(response, flag){
    	
    	if(flag == 'sclDivCd'){
    		$('#sclDivCd').setData({
    			data : response//JSON.stringify(response)
    		});
    		$('#sclDivCd').prepend('<option value="">'+demandMsgArray['all']+'</option>');
    		$('#sclDivCd').setSelected("");
    	}
    	if(flag == 'eqpTypCd'){
    		$('#eqpTypCd').setData({
    			data : response//JSON.stringify(response)
    		});
    		$('#eqpTypCd').prepend('<option value="">'+demandMsgArray['all']+'</option>');
    		$('#eqpTypCd').setSelected("");
    	}
    	
    	if(flag == "confirmList"){
    		if(response.result.resultMsg.pro == 'OK'){
    			callMsgBox('', 'I', demandMsgArray['completeApprv'], function() {
    				$('#search').click();   
    			});/*'승인되었습니다.'*/   
    		}else{
    			alertBox('W', response.resultMsg);
    		}
    	}
    	
		if (flag == 'bizCstrTypCd') {		
			
			$('#bizCstrTypCd').setData({
				data : response
			});
			
			var re_val = $('#eqpTypCd').val();
			if(re_val == ('LN')){
				$('#bizCstrTypCd').setSelected('1');
				$('#bizCstrTypCd').setEnabled(false);
			} else {
				$('#bizCstrTypCd').setData({
					data : response
				});
				
				$('#bizCstrTypCd').prepend('<option value="">' + demandMsgArray['all'] + '</option>');
				$('#bizCstrTypCd').setSelected('');
				$('#bizCstrTypCd').setEnabled(true);
			}
		}
		
		if(flag == 'cstrTypCd'){
			$('#cstrTypCd').setData({
				data : response
			});
			
			$('#cstrTypCd').prepend('<option value="">' + demandMsgArray['all'] + '</option>');
			$('#cstrTypCd').setSelected('');
		}
    	
    	if(flag == "waitList"){
    		if(response.result.resultMsg.pro == 'OK'){
    			callMsgBox('', 'I', demandMsgArray['completeCancel'], function() {
    				$('#search').click();   
    			});/*'반려되었습니다.'*/
    		}else{
    			alertBox('W', response.resultMsg);
    		}
    	}
    	if(flag == 'search'){
    		bodyProgressRemove();  
        	var currTab = getCurrentTab();
    		if(currTab == 5){
    			/*var pageInfo = $('#'+gridId4).alopexGrid('pageInfo');
    			pageInfo.dataLength = response.totalCnt;
        		$('#'+gridId4).alopexGrid("dataSet", response.lists, pageInfo);*/
    			var pageInfo = $('#'+gridId7).alopexGrid('pageInfo');
    			pageInfo.dataLength = response.totalCnt;
        		$('#'+gridId7).alopexGrid("dataSet", response.list, pageInfo);
    		} else if(currTab == 4){
    			
    		} else if(currTab == 2){
    			var pageInfo = $('#'+gridId3).alopexGrid('pageInfo');
    			pageInfo.dataLength = response.totalCnt;
        		$('#'+gridId3).alopexGrid("dataSet", response.lists, pageInfo);
    		} else if(currTab == 1){
    			var pageInfo = $('#'+gridId2).alopexGrid('pageInfo');
    			pageInfo.dataLength = response.totalCnt;
        		$('#'+gridId2).alopexGrid("dataSet", response.lists, pageInfo);
    		}
    		/*
    		if(buseScroll == true){
    			var currentRow = gridId4CurLength - DefaultGrid4Length;
    			var scrollOffset; 
    			
    			scrollOffset = {row : currentRow - 10};
    			
    			$('#'+gridId4).alopexGrid('setScroll', scrollOffset);
    			$('#'+gridId4).refresh();
    			buseScroll = false;
    		}*/
    	}
    	
    	if(flag == 'excelDownload') {
    		//console.log('excelCreate');
    		//console.log(response);
    		
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
			bodyProgressRemove();
    	}
    	
    	if(flag == 'upsertErpAprvProgress'){
    		
    		var compPct = 0;
    		var totCnt = parseInt(response.list[0].totCnt);
    		var stateComp = parseInt(response.list[0].stateComp);
    		var stateErr = parseInt(response.list[0].stateErr);
    		
    		compPct = Math.round(((stateComp + stateErr)/totCnt) * 100);
    		
    		var confirmText = "";
    		if(compPct>0 && compPct<100){
    			confirmText = demandMsgArray['demandERPMessage1']/*"완료되지 않은</br>시설계획  업로드 요청이 있습니다.</br>초기화 할경우 승인요청이 </br>비정상 종료될 수 있습니다.</br>초기화 하시겠습니까?"*/;
    		}else if(compPct == 100 ||compPct == 0 ||(stateComp + stateErr) == 0){
    			confirmText = demandMsgArray['init']/*"초기화 하시겠습니까?"*/;
    			
    		}
    		
    		/*if(confirm(confirmText)){
    			
    			var param = {};
    	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/cancelErpAprv', param, 'POST', 'cancelErpAprv');
    		}*/
    		/*"confirmText"*/
        	callMsgBox('','C', confirmText, function(msgId, msgRst){  

        		if (msgRst == 'Y') {
        			bodyProgress();
        			var param = {};
        	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/cancelErpAprv', param, 'POST', 'cancelErpAprv');
        		}
        	});
    		
    	}
    	if(flag == 'cancelErpAprv'){
    		switch (response.result.resultMsg.pro) {
			case "OK":
	    		bodyProgressRemove();
	    		callMsgBox('', 'I', demandMsgArray['completeInit'], function() {  /*'초기화가 완료되었습니다.'*/
    				$('#search').click();   
    			});
	    		
				break;

			case "FAIL":
				alertBox('W', response.errorMsg);
				break;
			default:
				
				break;
			}
    	}
    	if(flag == 'erpAprvReq'){
    		switch (response.result) {
			case "Y": //승인요청중인 데이터가 있는경우 : ERP 승인요청중인 progress popup을 띄워준다.  
				confirmText = demandMsgArray['demandERPMessage2']; //시설계획 업로드 요청중인 데이터가 있습니다. 진행사항을 확인하시겠습니까?  
				callMsgBox('','C', confirmText, function(msgId, msgRst){  

	        		if (msgRst == 'Y') { 
	        			$a.popup({
	    	    	    	popid: 'ErpAprvReqProgStatPop',
	    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
	    	    	    	iframe: true,
	    	    	    	modal : true,
	    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqProgStatPop.do',
	    	    	        data: null,
	    	    	        width : 1300,
	    	    	        height : 800, //window.innerHeight * 0.8,
	    	    	        
	    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	    	        xButtonClickCallback : function(el){ // x버튼 처리
	    	    	        	callMsgBox('','W', demandMsgArray['infoClose']);
	    	    	        	return false;
	    	    		    },
	    	    	        callback: function(data) {	    	    	        	
	    	        			$('#search').click();   
	    	    	       	}
	    	        	});
	        			//console.log("test1");
	        		}
	        	});
				break;	
			case "N": //승인요청중인 데이터가 없는경우
				$a.popup({
	    	    	popid: 'ErpAprvReqSelPop',
	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
	    	    	iframe: true,
	    	    	modal : true,
	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqSelPop.do',
	    	        data: null,
	    	        width : 700,
	    	        height : 400, //window.innerHeight * 0.4,
	    	        
	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	    	        callback: function(data) {
	    	        	if (data == "OK") {
	    	        		//bodyProgress();
		    	        	$a.popup({
		    	    	    	popid: 'ErpAprvReqProgStatPop',
		    	    	    	title: demandMsgArray['enterpriseResourcePlanningApprovalRequest']/*'시설계획 업로드'*/,
		    	    	    	iframe: true,
		    	    	    	modal : true,
		    	    	        url: '/tango-transmission-web/demandmgmt/erpaprvmgmt/ErpAprvReqProgStatPop.do',
		    	    	        data: null,
		    	    	        width : 1300,
		    	    	        height : 800, //window.innerHeight * 0.8,
		    	    	        xButtonClickCallback : function(el){ // x버튼 처리
		    	    	        	callMsgBox('','W', demandMsgArray['infoClose']);/*'닫기 버튼을 이용하여 종료하십시오.'*/
		    	    	        	return false;
		    	    		    },
		    	    	    	// 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
		    	    	    	
		    	    	        callback: function(data) {	    	    	        	
		    	        			$('#search').click();   
		    	    	       	}
		    	        	});
	    	        	}
	    	       	}
		    	
	        	});
				break;
			default:
				
				break;
			}
    	}
    	
    	// ERP 공사유형
    	if(flag == 'selectErpBizTypList'){
    		if(response != null && response.length > 0){
    			$('#erpBizTypCd').setData({data : response});
    		} else {
    			$('#erpBizTypCd').clear();
    		}
    		$('#erpBizTypCd').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
    	}
    	
    	// WBS 타입
    	if(flag == 'selectWbsList'){
    		
    		if(response != null && response.length > 0){
    			$('#wbsTyp').setData({data : response});
    		} else {
    			$('#wbsTyp').clear();
    		}

			$('#wbsTyp').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
   		    $('#wbsTyp').setSelected(""); 
    	}
    	
    	if(flag == "updateRequestStateListAprv"){
    		bodyProgressRemove();
    		if(response.result == true){
    			callMsgBox('', 'I', demandMsgArray['completeApprv'], function() {
    				$('#search').click();   
    			});/*'승인되었습니다.'*/   
    		}else{
    			alertBox('W', response.resultMsg);
    		}
    	}
    	if(flag == "updateRequestStateListCancle"){
    		bodyProgressRemove();
    		if(response.result == true){
    			callMsgBox('', 'I', demandMsgArray['completeInit'], function() {  /*'초기화가 완료되었습니다.'*/
    				$('#search').click();   
    			});
    		}else{
    			alertBox('W', response.resultMsg);
    		}
    	}
    	
    	if (flag == 'fixDemdRollbak') {
    		if (response.result.code == "OK") {
    			bodyProgressRemove();
    			/*정상적으로 처리되었습니다.*/
    			callMsgBox('', 'I', demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    			});
    		}  else {
    			bodyProgressRemove();
    			alertBox('W', response.errorMsg);
    		}
    		
    		return;
    	}
    	
    }
    
    
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	bodyProgressRemove();
    	if(flag == 'search'){
    		tabIndex = getCurrentTab();
    		
	    	var searchGrid = tabInfo[tabIndex].gridId;
	    	
	    	hideProgress(searchGrid);
	    	alertBox('W', demandMsgArray['searchFail'] );/*'시스템 오류가 발생하였습니다'  demandMsgArray['systemError']  */
	    	
	    	$('#'+searchGrid).alopexGrid("dataEmpty");
    	}
    	
    	if (flag == 'confirmList') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}

    	if (flag == 'waitList') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    	
    	if(flag == 'excelDownload') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    	if(flag == 'cancelErpAprv'){
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;    		
    	}
    	if(flag == 'erpAprvReq'){
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    	if(flag == 'selectWbsList'){
    		
			$('#wbsTyp').clear();
			$('#wbsTyp').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
   		    $('#wbsTyp').setSelected(""); 
    		
    	}
    	if(flag == "updateRequestStateListAprv"){
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    	if(flag == "updateRequestStateListCancle"){
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    }
    
    function tabChange(){
    	var currTab = getCurrentTab();
    	
    	$('#bizCstrTypCd').setSelected('');
    	$('#cstrTypCd').setSelected('');
    	$('#demdBizDivCd').setEnabled(true);
    	// selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
    	
    	switch (currTab) {
			case 0 :
				$('#'+tabInfo[currTab].gridId).alopexGrid("viewUpdate");
				$(".tab2_3").hide();
				$(".tab3_3").hide();
				$("#bTab5").hide();
				$(".tab_none6").show();
				$(".tab6_2").hide();
				$(".tab6_3").hide();
				$(".tab7_1").hide();
				
				$('#demdDivCd').setEnabled(true);
				$('#demdProgStatCd').setEnabled(true);
				break;
			case 1 :
				$('#'+tabInfo[currTab].gridId).alopexGrid("viewUpdate");
				$(".tab2_3").hide();
				$(".tab3_3").hide();
				$("#bTab5").hide();
				$(".tab_none6").show();
				$(".tab6_2").hide();
				$(".tab6_3").hide();
				$(".tab7_1").hide();
				
				$('#demdDivCd').setEnabled(true);
				$('#demdProgStatCd').setEnabled(true);
				break;
			case 2 :
				$('#'+tabInfo[currTab].gridId).alopexGrid("viewUpdate");
				$(".tab2_3").show();
				$(".tab3_3").hide();
				$("#bTab5").hide();
				$(".tab_none6").show();
				$(".tab6_2").hide();
				$(".tab6_3").hide();
				$(".tab7_1").hide();
				
				$('#demdDivCd').setEnabled(true);
				$('#demdProgStatCd').setEnabled(true);
				break;
			case 3 :
				$('#'+tabInfo[currTab].gridId).alopexGrid("viewUpdate");
				$(".tab2_3").hide();
				$(".tab3_3").hide();
				$("#bTab5").hide();
				$(".tab_none6").hide();
				$(".tab6_2").hide();
				$(".tab6_3").hide();
				$(".tab7_1").show();
				
				$('#demdDivCd').setEnabled(true);
				$('#demdProgStatCd').setEnabled(true);
				
				break;
			case 4:
				$('#'+tabInfo[currTab].gridId).alopexGrid("viewUpdate");
				$(".tab2_3").show();
				$(".tab3_3").hide();
				$("#bTab5").hide();
				$(".tab_none6").hide();
				$(".tab6_2").show();
				$(".tab6_3").show();
				$(".tab7_1").hide();
				$('#btnApplyDivision').show();
				
				$('#demdDivCd').setEnabled(true);
				$('#demdProgStatCd').setEnabled(true);
				break;
			case 5:
				$('#'+tabInfo[currTab].gridId).alopexGrid("viewUpdate");
				$(".tab2_3").hide();
				$(".tab3_3").hide();
				$("#bTab5").show();
				
				var dataParam =  $("#searchForm").getData();
				selectWbsIdList('wbsId', 'Y', '', dataParam);
				selectEqpTypCdInPrjList('eqpTypeCd', 'Y', '', dataParam);
				gridRemake();
				
				$('#demdDivCd').setSelected('');
				$('#demdDivCd').setEnabled(false);
				$('#demdProgStatCd').setSelected('');
				$('#demdProgStatCd').setEnabled(false);
	
				$(".tab_none6").show();
				$(".tab6_2").hide();
				$(".tab6_3").hide();
				$(".tab7_1").hide();
				break;
			case 6:
				
				break;
			default :
				break;
		}
		setDemdProgStatCd(currTab);
    }
    
    function getCurrentTab(){
    	var selectMainTab = parseInt($('#basicTabs').getCurrentTabIndex());
    	var selectSubTab = 0;
    	
    	switch(selectMainTab)
    	{
    	case 0:
    		selectSubTab = parseInt($('#basicTabs_invest').getCurrentTabIndex());
    		break;
    	case 1:
    		selectSubTab = parseInt($('#basicTabs_aprv').getCurrentTabIndex());
    		if(selectSubTab == 2){
    			selectSubTab = selectSubTab + 1;
    		}
    		break;
    	case 2:
    		break;
    	}
    	
    	var currTab = (selectMainTab * 2) + (selectSubTab);
    	
    	return currTab;
    }
    
    
    function gridRemake(){
    	var mapping7 = [];
    	$('#'+gridId7).alopexGrid('dataDelete');
    	
    	// 사업구분 갱신
    	//selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
    	if($('#viewOption1').is(":checked") == true){
    		//시설계획 업로드 > 사업구분
    		$('#demdBizDivCd').setEnabled(true);
    		mapping7 =  [
	  	        	 		{ key : 'wbsId', align:'left', width:'100px', title :'WBS 요소' /*'WBS 요소'*/,rowspan: true}
	  	        	 		,{ key : 'erpHdofcNm', align:'left', width:'80px', title :demandMsgArray['hdofc'] /*'본부'*/,rowspan: true}
	  	        	 		,{ key : 'demdBizDivNm', align:'left', width:'100px', title :demandMsgArray['businessDivisionBig'] /*'사업구분'*/,rowspan: true}
	  	        	 		,{ key : 'demdBizDivDetlNm', align:'left', width:'200px', title :demandMsgArray['businessDivisionDetl'] /*'세부사업구분'*/,rowspan: true}
	  	        	 		
	  	        	 		,{ key : 'eqpTypeNm', align:'left', width:'80px', title :demandMsgArray['equipmentType'] /*'장비타입'*/}
	  	        	 		,{ key : 'cstrTypeCd', align:'left', width:'80px', title: '공사유형코드', hidden : true}
	  	        	 		,{ key : 'cstrTypeCdNm', align:'left', width:'80px', title: '공사유형'}
	  	        	 		
	  	        	 		,{ key : 'erpHdofcCd', align:'left', width:'80px', title :'', hidden : true}
	  	        	 		,{ key : 'eqpTypeCd', align:'left', width:'80px', title :'', hidden : true}
	  	        	 		,{ key : 'demdBizDivCd', align:'left', width:'200px', title :'', hidden : true}
	  	        	 		,{ key : 'demdBizDivDetlCd', align:'left', width:'200px', title :'', hidden : true}
	  	        	 		
	  	        	 		,{ key : 'sumReqPos', align:'right', width:'80px', title :demandMsgArray['reqPosCnt'] /*'발급요청가능개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumIssu', align:'right', width:'80px', title :demandMsgArray['issuReqCnt'] /*'발급요청개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumExec', align:'right', width:'100px', title :demandMsgArray['exePrjCnt'] /*'실행프로젝트개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumUse', align:'right', width:'80px', title :demandMsgArray['constructionUseCnt'] /*'공사사용개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumLeft', align:'right', width:'60px', title :demandMsgArray['remainderCnt'] /*'잔여개수'*/, render:{type:"string", rule : "comma"}}
	  	        			];
    	} else{
    		//시설계획 업로드> WBS
    		// 사업구분 갱신
        	selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
        	
    		$('#demdBizDivCd').setEnabled(false);
    		mapping7 =  [
	  	        	 		{ key : 'wbsId', align:'left', width:'100px', title :'WBS 요소' /*'WBS 요소'*/,rowspan: true}
	  	        	 		,{ key : 'erpHdofcNm', align:'left', width:'80px', title :demandMsgArray['hdofc'] /*'본부'*/,rowspan: true}
	  	        	 		
	  	        	 		,{ key : 'eqpTypeNm', align:'left', width:'80px', title :demandMsgArray['equipmentType'] /*'장비타입'*/}
	  	        	 		,{ key : 'cstrTypeCd', align:'left', width:'80px', title: '공사유형코드', hidden : true}
	  	        	 		,{ key : 'cstrTypeCdNm', align:'left', width:'80px', title: '공사유형'}
	  	        	 		
	  	        	 		,{ key : 'erpHdofcCd', align:'left', width:'80px', title :'', hidden : true}
	  	        	 		,{ key : 'eqpTypeCd', align:'left', width:'80px', title :'', hidden : true}
	  	        	 		,{ key : 'demdBizDivCd', align:'left', width:'200px', title :'', hidden : true}
	  	        	 		,{ key : 'demdBizDivDetlCd', align:'left', width:'200px', title :'', hidden : true}
	  	        	 		
	  	        	 		,{ key : 'sumReqPos', align:'right', width:'80px', title :demandMsgArray['reqPosCnt'] /*'발급요청가능개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumIssu', align:'right', width:'80px', title :demandMsgArray['issuReqCnt'] /*'발급요청개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumExec', align:'right', width:'100px', title :demandMsgArray['exePrjCnt'] /*'실행프로젝트개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumUse', align:'right', width:'80px', title :demandMsgArray['constructionUseCnt'] /*'공사사용개수'*/, render:{type:"string", rule : "comma"}}
	  	        	 		,{ key : 'sumLeft', align:'right', width:'60px', title :demandMsgArray['remainderCnt'] /*'잔여개수'*/, render:{type:"string", rule : "comma"}}
	  	        			];
    	}
    	 		
  	   	//그리드 생성
	    $('#'+gridId7).alopexGrid({
	        cellSelectable : false,
	        autoColumnIndex : true,
	        fitTableWidth : true,
	        rowClickSelect : false,
	        rowSingleSelect : false,
	        rowInlineEdit : false,
	        numberingColumnFromZero : false
	        ,paging: {
	        	   //pagerTotal:true,
	        	   pagerSelect:false,
	        	   hidePageList:true
	           }
		    ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
	        ,columnMapping : mapping7
	        ,grouping : {
	        	useGrouping : true,
              	by : ['wbsId', 'erpHdofcNm', 'demdBizDivNm', 'demdBizDivDetlNm'],
              	useGroupRowspan : true
            }
			,ajax: {
		         model: gridSearchMode7                 // ajax option에 grid 연결할 model을지정
			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			 }
	    });
    }
});