/**
 * MtsoCardPortUsePop.js
 *
 * @author Administrator
 * @date 2023. 6. 8
 * @version 1.0
 */
var popUp = $a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;
	var mEqpDivCmb = [];

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	console.log("init param : ", param);
    	paramData = param;
    	
    	$('#pageNo').val(1);
    	$('#rowPerPage').val(100000000);
    	
    	console.log("paramData : ", paramData);
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
    	setEventListener();
    };
    
    this.eqpPopUp = function(eqpId){
    	console.log("eqpId : ", eqpId);
    	var tmpPopId = "E_"+Math.floor(Math.random() * 10) + 1;
		$a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpGubun=eqp&mtsoEqpId=' + eqpId,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 900,
			height : window.innerHeight
		});
    };
    
    function initGrid(){
    	
    	$('#'+gridId).alopexGrid({
    		paging : {
    			pagerSelect: false
    			,hidePageList: true  // pager 중앙 삭제
    		},
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		message:{
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>",
				filterNodata: configMsgArray['noData']
			},
			headerGroup: [
    	        			{fromIndex:'slotAllCnt', toIndex:'slotIdleCnt', title:'SLOT'},
    	        			{fromIndex:'port100AllCnt', toIndex:'port100IdleCnt', title:'100G PORT'},
    	        			{fromIndex:'port10AllCnt', toIndex:'port10IdleCnt', title:'10G/Ch PORT'}
			],			
    		columnMapping: [
				  { key : 'mtsoNm', title: '국사명', align:'center', width:'100px'},
				  { key : 'eqpTypNm', title: '장비타입', align:'center', width:'60px'},
				  { key : 'bpNm', title: '제조사', align:'center', width:'70px'},
				  { key : 'eqpMdlNm', title: '장비 모델', align:'center', width:'100px'},
				  { key : 'eqpNm', 
					title: '장비명', 
					align:'center', 
					width:'190px',
					editable: false,
					render : function(value, data, render, mapping, grid){
						var href = value;
						var currentData = AlopexGrid.currentData(data);
						if(value != "" && value != undefined){
							var eqpId 		= currentData.eqpId;
							href = "<a href=\"javascript:popUp.eqpPopUp('"+eqpId+"');\" style='text-decoration-line:underline'>"+value+"</a>";
						}
						return href;
					}
				  },
				  { key : 'slotAllCnt', title: '전체', align:'center', width:'50px'},
				  { key : 'slotUseCnt', title: '사용', align:'center', width:'50px'},
				  { key : 'slotIdleCnt', title: '미사용', align:'center', width:'50px'},
				  { key : 'port100AllCnt', title: '전체', align:'center', width:'50px'},
				  { key : 'port100UseCnt', title: '사용', align:'center', width:'50px'},
				  { key : 'port100IdleCnt', title: '미사용', align:'center', width:'50px'},
				  { key : 'port10AllCnt', title: '전체', align:'center', width:'50px'},
				  { key : 'port10UseCnt', title: '사용', align:'center', width:'50px'},
				  { key : 'port10IdleCnt', title: '미사용', align:'center', width:'50px'},
				  { key : 'mtsoId', title: '국사ID', align:'center', width:'90px', hidden: true},
				  { key : 'eqpId', title: '장비ID', align:'center', width:'90px', hidden: true},
				  { key : 'bpId', title: '제조사ID', align:'center', width:'90px', hidden: true},
				  { key : 'eqpMdlId', title: '장비모델ID', align:'center', width:'90px', hidden: true}
     		]
        });
    }
    
    function setSelectCode() {
    	//설계대상
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', null, 'GET', 'eqpDivCd');
    }
    
    function setRegDataSet(param) {
    	$("#mtsoId").val(param.mtsoId);
    	$("#mtsoNm").val(param.mtsoNm);
    	
    	if(param.eqpDivCd == "DL01" //백홀(5G)
    		|| param.eqpDivCd == "DL02" //프론트홀
       		|| param.eqpDivCd == "DL06" //백본
    		){
    		
    		param.pageNo = 1;
        	param.rowPerPage = 100000000;

        	$('#'+gridId).alopexGrid('showProgress');
        	console.log("param : ", param);
        	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/invt/getMtsoCardPortUseList', param, 'GET', 'search');
        	
    	} else {
    		callMsgBox('','I', "해당 설계대상은 추후 구현될 예정입니다.", function(msgId, msgRst){});
     		return;
    	}
    	
    }
    
    function setEventListener(){
    	
    	// 페이지 번호 클릭시
   	 	$('#'+gridId).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	setFormData(obj.page, obj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	setFormData(1, obj.perPage);
        });
        
        //국사조회
        $('#btnMtsoSearch').on('click', function(e) {
        	$a.popup({
   	          	popid: 'MtsoLkup',
   	          	title: configMsgArray['findMtso'],
   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
   	            //data: {autoSearchYn : "Y"},
   	            windowpopup: true,
   	            modal: true,
                movable:true,
   	            width : 950,
   	            height : 800,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	           		if(data != null && data != ''){
   	           			$('#mtsoId').val(data.mtsoId);//국사ID
       	                $('#mtsoNm').val(data.mtsoNm);//국사명
   	           		}
   	           	}
        	});
        });
        
        $('#btnSearch').on('click', function(e) {
        	var sParam = $("#searchForm").getData();
        	if(sParam.eqpDivCd == "DL01" //백홀(5G)
        		|| sParam.eqpDivCd == "DL02" //프론트홀
           		|| sParam.eqpDivCd == "DL06" //백본
        		){
        		
        		sParam.pageNo = 1;
        		sParam.rowPerPage = 100000000;

            	$('#'+gridId).alopexGrid('showProgress');
            	console.log("sParam : ", sParam);
            	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/invt/getMtsoCardPortUseList', sParam, 'GET', 'search');
            	
        	} else {
        		callMsgBox('','I', "해당 설계대상은 추후 구현될 예정입니다.", function(msgId, msgRst){});
         		return;
        	}
        });
		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = 'SLOT_PORT사용 현황_'+dayTime;
        	var worker = new ExcelWorker({
        		excelFileName : excelFileNm,
        		sheetList:[{
        			sheetName : 'SLOT_PORT사용 현황',
        			$grid: $('#'+gridId)
        		}]
        	});
        	worker.export({
        		merge: true,
        		exportHidden: false,
        		filtered: false,
        		useGridColumnWidth : true,
        		border: true,
        		exportGroupSummary:true,
        		exportFooter: true,
        		callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
        	});
		});
    }
    
    // 조회
    function setFormData(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    }
    
    function setGrid(gridId, Option, Data) {
    	
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
	}
    
  	//request 호출
    var httpRequest = function(Url, Param, Method, Flag) {
    	
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
    //request 성공시.
	function successCallback(response, status, jqxhr, flag){
		
		if(flag == 'eqpDivCd'){
			$('#eqpDivCd').clear();
			
			mEqpDivCmb = response.mainLgc

			var option_data =  [{cd: "",cdNm: configMsgArray['all']}];
			for(var i=0; i<mEqpDivCmb.length; i++){
				option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});
			}
			
			$('#eqpDivCd').setData({
				data: option_data,
				eqpDivCd: paramData.eqpDivCd
			});
		}
		
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			console.log("response : ", response);
			setGrid(gridId, response, response.dataList);
		}
    }

    //request 실패시.
    function failCallback(response, status, flag, jqxhr ){
    	$('#'+gridId).alopexGrid('hideProgress');
    	//조회 실패 하였습니다.
		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    }
});