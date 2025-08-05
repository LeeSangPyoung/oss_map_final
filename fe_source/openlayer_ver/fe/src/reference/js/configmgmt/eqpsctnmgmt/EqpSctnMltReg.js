/**
 * EqpSctnMltReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var westGridId = 'dataGridWest';
	var eastGridId = 'dataGridEast';
	var westEqpRoleDivNm = null;
	var eastEqpRoleDivNm = null;
	
    //초기 진입점
	var paramData = null;
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	if (! jQuery.isEmptyObject(param) ) {
    		paramData = param;
    	}
    	initGrid();
        setEventListener();
        setSelectCode();
        setRegDataSet(param);
        
    };
    
  //Grid 초기화
    function initGrid() {
      		
      //그리드 생성
    	$('#'+westGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		height:"8row",
    		rowSingleSelect: false,
    		rowClickSelect: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			align:'center',
    			title: '',
				width: '40px',
				selectorColumn : true
    		}, {//장비모델명
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'			
			}, {//포트명
				key : 'portNm', align:'center',
				title : configMsgArray['portName'],
				width: '100px'	
			}, {//포트ID
				key : 'portId', align:'center',
				title : configMsgArray['portIdentification'],
				width: '100px'	
			}, {//사용여부
				key : 'useYn', align:'center',
				title : configMsgArray['useYesOrNo'],
				width: '100px'	
			}, {//포트IP
				key : 'portIpAddr', align:'center',
				title : configMsgArray['portInternetProtocol'],
				width: '100px'
			},{//포트용량
				key : 'portCapaNm', align:'center',
				title : configMsgArray['portCapacity'],
				width: '100px'			
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
    	
    	$('#'+eastGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		height:"8row",
    		rowSingleSelect: true,
    		rowClickSelect: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			align:'center',
    			title: '',
				width: '40px',
				selectorColumn : true
    		}, {
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'			
			}, {//포트명
				key : 'portNm', align:'center',
				title : configMsgArray['portName'],
				width: '100px'	
			}, {//포트ID
				key : 'portId', align:'center',
				title : configMsgArray['portIdentification'],
				width: '100px'	
			}, {//사용여부
				key : 'useYn', align:'center',
				title : configMsgArray['useYesOrNo'],
				width: '100px'	
			}, {//셀번호
				key : 'portAlsNm', align:'center',
				title : configMsgArray['cellNumber'],
				width: '100px'	
			}, {//슬롯참고정보
				key : 'portRmk', align:'center',
				title : configMsgArray['slot']+configMsgArray['reference']+configMsgArray['information'],
				width: '100px'	
			}, {//포트IP
				key : 'portIpAddr', align:'center',
				title : configMsgArray['portInternetProtocol'],
				width: '100px'
			},{//포트용량
				key : 'portCapaNm', align:'center',
				title : configMsgArray['portCapacity'],
				width: '100px'		
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
//        gridHide();
   };    

    function setRegDataSet(data) {
    	
    	var id = "ES***********";
    	$("#eqpSctnIdMltReg").val(id);
    	$('#sctnStatTypCdMltReg').setData({
             sctnStatTypCd:"01"
		});
    	$('#'+eastGridId).alopexGrid("hideCol", 'portAlsNm', 'conceal');
    	$('#'+eastGridId).alopexGrid("hideCol", 'portRmk', 'conceal');
    }
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
    	//연결정보유형 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00224', null, 'GET', 'connInfTypCdMltReg');
    	//구간상태유형 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00838', null, 'GET', 'sctnStatTypCdMltReg');
    	
    }
    
    function setEventListener() {
         
    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });
    	 
    	//저장 
    	 $('#btnSaveMltReg').on('click', function(e) {
    		 var westData = $('#'+westGridId).alopexGrid("dataGet", {_state : {selected : true}});
    		 var eastData = $('#'+eastGridId).alopexGrid("dataGet", {_state : {selected : true}});
    		 
    		 if(westData.length == 0){
 				//선택된 데이터가 없습니다.
 				callMsgBox('','W', 'WEST장비에 '+configMsgArray['selectNoData'] , function(msgId, msgRst){});
 				return;
 			 }
    		 
    		 if(eastData.length == 0){
  				//선택된 데이터가 없습니다.
  				callMsgBox('','W', 'EAST장비에 '+configMsgArray['selectNoData'] , function(msgId, msgRst){});
  				return;
  			 }
    		 
         	//tango transmission biz 모듈을 호출하여야한다.
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
   		       //저장한다고 하였을 경우
   		        if (msgRst == 'Y') {
   		        	eqpSctnMltReg(); 
   		        } 
   		      }); 
         });
    	 
    	//좌장비 조회
    	 $('#btnWestEqpSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'LftEqpLkup',
    	          	title: configMsgArray['findEquipment'],
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.83,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행 
    	           		var param = data;
    	           		$('#lftMtsoNm').val(data.eqpInstlMtsoNm);
    	           		$('#lftEqpNm').val(data.eqpNm);
    	           		westEqpRoleDivNm = data.eqpRoleDivNm;
    	           		param.pageNo = 1;
    	           		param.rowPerPage = 10000;
    	           		param.sctnChk = "LFT";
    	           		$('#'+westGridId).alopexGrid('showProgress');
    	                httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portLkup', param, 'GET', 'westEqpSearch');
    	           	}
    	      });
         });
    	 
    	//우장비 조회
    	 $('#btnEastEqpSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'RghtEqpLkup',
    	          	title: configMsgArray['findEquipment'],
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.83,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행 
    	           		var param = data;
    	           		$('#rghtMtsoNm').val(data.eqpInstlMtsoNm);
    	           		$('#rghtEqpNm').val(data.eqpNm);
    	           		eastEqpRoleDivNm = data.eqpRoleDivNm;
    	           		var op = $('#'+eastGridId).alopexGrid('readOption');
    	           		if(data.eqpRoleDivNm == "CMTS"){
    	           			$('#'+eastGridId).alopexGrid("showCol", 'portAlsNm');
        	            	$('#'+eastGridId).alopexGrid("showCol", 'portRmk');
        	            	$('#'+eastGridId).alopexGrid("hideCol", 'portId', 'conceal');
        	            	op.columnMapping[2].title = "CELL ID" ;
    	           		}else{
        	            	$('#'+eastGridId).alopexGrid("hideCol", 'portAlsNm', 'conceal');
        	            	$('#'+eastGridId).alopexGrid("hideCol", 'portRmk', 'conceal');
        	            	$('#'+eastGridId).alopexGrid("showCol", 'portId');
        	            	op.columnMapping[2].title = "포트명" ;
    	           		}
    	           		
    	           		var data = $('#'+westGridId).alopexGrid('dataGet', {_state:{selected:true}});
    	           		if(data.length > 2 && eastEqpRoleDivNm == "CMTS" && westEqpRoleDivNm == "FDF"){
	    	       			 callMsgBox('','W', 'CMTS의 경우 FDF포트는 2건만 선택이 가능합니다.' , function(msgId, msgRst){});
	    	       			 $('#'+westGridId).alopexGrid('rowSelect', {_state:{selected:true}}, false);
	    	       		}
    	           		param.pageNo = 1;
    	           		param.rowPerPage = 10000;
    	           		param.sctnChk = "RGHT";
    	           		$('#'+eastGridId).alopexGrid('showProgress');
    	                httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portLkup', param, 'GET', 'eastEqpSearch');
    	           	}
    	      });
         });
    	 
    	 $('#btnCnclMltReg').on('click', function(e) {
      		 $a.close();
           });
    	 
    	 $('#'+westGridId).on('dataSelectEnd', function(e) {
    		 var evObj = AlopexGrid.parseEvent(e);
    		 var row = evObj.datalist[0]._index.row;
    		 var selected = evObj.datalist[0]._state.selected;
    		 var data = $('#'+westGridId).alopexGrid('dataGet', {_state:{selected:true}});
    		 if(selected && data.length > 2 && eastEqpRoleDivNm == "CMTS" && westEqpRoleDivNm == "FDF"){
//    			 callMsgBox('','W', 'CMTS의 경우 FDF포트는 2건만 선택이 가능합니다.' , function(msgId, msgRst){});
    			 $('#'+westGridId).alopexGrid('rowSelect', {_index: {row:row}}, false);
    		 }
    		 
    	 });
	};
	
	function setSPGrid(GridID,Option,Data) {
		$('#'+GridID).alopexGrid('dataSet', Data);
	}
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'westEqpSearch') {
    		$('#'+westGridId).alopexGrid('hideProgress');
    		setSPGrid(westGridId, response, response.portMgmtList);
    	}
    	
    	if(flag == 'eastEqpSearch') {
    		$('#'+eastGridId).alopexGrid('hideProgress');
    		
    		setSPGrid(eastGridId, response, response.portMgmtList);
    	}
    	
    	if(flag == 'EqpSctnMltReg') {
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
    			       if (msgRst == 'Y') {
    			           $a.close();
    			       } 
    			});   
    			
    			var pageNo = $("#pageNo", parent.document).val();
    			var rowPerPage = $("#rowPerPage", parent.document).val();
    			
    			$(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    		}else if(response.Result == "Dup"){
    			callMsgBox('','I', configMsgArray['saveFail']+" ("+configMsgArray['duplicationSection']+")" , function(msgId, msgRst){});
    		}else if(response.Result == "Fail"){
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}
    	
    	if(flag == 'connInfTypCdMltReg'){
    		
    		$('#connInfTypCdMltReg').clear();
    		
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#connInfTypCdMltReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#connInfTypCdMltReg').setData({
    	             data:option_data,
    	             connInfTypCd:paramData.connInfTypCd
    			});
    		}
    	}
    	
    	if(flag == 'sctnStatTypCdMltReg'){
    		
    		$('#sctnStatTypCdMltReg').clear();
    		
    		var option_data =  [];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#sctnStatTypCdMltReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#sctnStatTypCdMltReg').setData({
    	             data:option_data,
    	             sctnStatTypCd:paramData.sctnStatTypCd
    			});
    		}
    	}
    	
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EqpSctnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpSctnMltReg() {
		   
    	 var westData = $('#'+westGridId).alopexGrid("dataGet", {_state : {selected : true}});
    	 var eastData = $('#'+eastGridId).alopexGrid("dataGet", {_state : {selected : true}});
    	
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 
		 for(var i=0; i<westData.length; i++){
			 westData[i].lftEqpId = westData[i].eqpId;
			 westData[i].lftPortId = westData[i].portId;
			 westData[i].rghtEqpId = eastData[0].eqpId;
			 westData[i].rghtPortId = eastData[0].portId;
			 westData[i].sctnStatTypCd = $('#sctnStatTypCdMltReg').val();
			 westData[i].autoClctYn = "N";
//			 westData[i].connInfTypCd = "02";
			 westData[i].frstRegUserId = userId;
			 westData[i].lastChgUserId = userId;
			 
		 }
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/insertEqpSctnMltMgmt', westData, 'POST', 'EqpSctnMltReg');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
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
                  height : window.innerHeight * 0.9
              });
        }
    
    /*var httpRequest = function(Url, Param, Method, Flag ) {
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