/**
 * CompletionVerificationHistoryLine.js
 *
 * @author P096430
 * @date 2016. 7. 18. 오전 10:50:00
 * @version 1.0
 */

var m = {
			globalVar : {
							userId    :     "testUser"  ,
							cstrCd    :     ""          ,
							skAfcoDivCd : ""
						},
			params    : {
							
			         	},
			ajaxProp  : [
			             {  
			             	url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLan',
			             	data:"",
			             	flag:'searchList'
			             },
			             {  
							url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanDocCreate?method=put',
							data:"",
							flag:'docCreate' // 파일 생성
			             },
			             {  
							url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanSubmit?method=put',
							data:"",
							flag:'docSubmit' // 제출
			             },
			             {  
							url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanCancel?method=put',
							data:"",
							flag:'docSubmitCancel' // 제출취소
			             }
			            ],
			 userInfo : {},
			 message  : {},
			 label    : {}
	};

var tangoAjaxModel = Tango.ajax.init({});

$a.page(function() {
	
	var gridId = 'hstGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {   	    	
    	
    	
    	// 공사코드 테스트
    	if(param.cstrCd == null || param.cstrCd == "" ){
    		param.cstrCd = "P001";
    	}
    	
    	m.params.cstrCd = param.cstrCd;
        
    	
    	initGrid();
    	
    	searchHstGrid(m.params, 'searchList');
    	
    	setSelectCode();
        setEventListener();
    };
    
    
    
  //Grid 초기화
    function initGrid() {
    	AlopexGrid.define('defineDataGrid', {
    		autoColumnIndex: true,
    		fitTableWidth: true,
    		defaultColumnMapping:{
    			sorting: false
			},
		    rowOption:{
		    	defaultHeight:30
		    }, 
		    grouping:{
				by:['vrfFnshModDtsSrno','userNm','frstRegDate'],
				useGrouping:true,
				useGroupRearrange: true,
				useGroupRowspan:true
			},
			columnMapping : [
				{
					title : m.label.verifier, //'검증자',
					key : 'userNm',
						rowspan:true
				}, {
					title : m.label.verificationDateTime, // '검증일시',
					key : 'frstRegDate',
						rowspan:true
				}, {
					title : m.label.verificationDay, // '검증일',
					key : 'gubunNumber',
					hidden : true
				}, {
					title : m.label.division, //'구분',
					//key : 'gubunNm'
					render : function(value,data){
													var result = "";
													var endToEnd = m.label.endToEnd;
													var cableStandard = m.label.cableStandard;
													var manufactureNumber = m.label.manufactureNumber;
													var connectionInformation = m.label.connectionInformation;
													var acceptCableCount = m.label.acceptCableCount;
													var basicDataBase = m.label.basicDataBase;
													console.log(data.gubunNumber);
													switch(data.gubunNumber){
													case '1': result = endToEnd; break; // "ETE"
													case '2': result = cableStandard; break; // "케이블규격"
													case '3': result = manufactureNumber; break; // "제조번호"
													case '4': result = connectionInformation; break; // "접속정보"
													case '5': result = acceptCableCount; break; // "수용조수"
													case '6': result = basicDataBase; break; // "기초DB"
													case '7': result = "케이블"; break;
													case '8': result = "함체접속"; break;
													case '9': result = "분배함"; break;
													case '10': result = "전주건식"; break;
													case '11': result = "관로작업"; break;
													case '12': result = "인허가서류"; break;
													}

													return result;
												}
				}, {
					title : m.label.verificationResult, // '검증결과',
					key : 'rsltCd',
					render : function(value,data){
													var good = m.label.good; // "양호";
													var bad = m.label.bad; // "불량";
													     if(value == 'Y'){ return good; }
													else if(value == 'N'){ return bad;  }
													else { return "";}
												}
				}, {
					title : m.label.verificationOpinion, // '검증의견',
					key : 'oponCtt'
				}, {
					title : m.label.verificationHistory, // '검증이력',
					key : 'vrfAfProcYn',
					render : function(value,data){
													var registration = m.label.registration; // 등록
													var modification = m.label.modification; // 수정
													return (value=='N'?registration:modification);
												}, // 등록, 수정
					rowspan:true	
				}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+m.message.noData+"</div>"
			}
    	});
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	extend : ['defineDataGrid']
        });
    	
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }
    
    
    function setEventListener() {
    	
//    	alert("이벤트!!!");
    	
    	
    	 
    	//엑셀다운 
    	 $('#btnExportExcel').on('click', function(e) {
    		 
//    		 alert("엑셀다운버튼 클릭함!!!");
    		 
    		 //tango transmission biz 모듈을 호출하여야한다.
         	
    		 var worker = new ExcelWorker({
         		excelFileName : m.label.verificationHistory, // '검증이력',
         		palette : [{
         			className : 'B_YELLOW',
         			backgroundColor: '255,255,0'
         		},{
         			className : 'F_RED',
         			color: '#FF0000'
         		}],
         		sheetList: [{
         			sheetName: m.label.verificationHistory, // '검증이력',
         			$grid: $('#'+gridId)
         		}]
         	});
         	worker.export({
         		merge: true,
         		exportHidden: false,
         		filtered  : false,
         		selected: false,
         		useGridColumnWidth : true,
         		border  : true
         	});
         });
         
    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('click', '.bodycell', function(e){
    	 });
    	   
	};
	


    
    function searchHstGrid(param, flag) {     
    	
    	console.log(param);
    	
    	tangoAjaxModel.get({url : 'tango-transmission-biz/transmission/constructprocess/verification/completionVerificationHistoryLineSkb'
	          , data : param
      		  , flag:flag
			  }).done(successFn).fail(failFn);
    	
    }
    
    
    
	function successFn(response, status, jqxhr, flag) {
		 console.log(response);
		 console.log(status);
		 console.log(jqxhr);
		 console.log(flag);
		switch (flag) {

		case 'searchList':
			
				if(response.CompletionVerificationHistoryLineList.length == 0){
					return false;
				}else{
					$('#'+gridId).alopexGrid('dataSet', response.CompletionVerificationHistoryLineList);
					
					$('#'+gridId).alopexGrid('updateOption',
							{paging : {pagerTotal: function(paging) {
								return '총 건수 : ' + (response.CompletionVerificationHistoryLineList.length / 12);
							}}}
					);
					
				}    	
			
			
			break;

		}
	} // successFn()

	// FAIL...
	function failFn(response, status, flag) {

		switch (flag) {

		case 'searchList':
			callMsgBox('','W', m.message.searchFail); /* 조회 실패 하였습니다. */
			break;

		}
	} // failFn()
    
});