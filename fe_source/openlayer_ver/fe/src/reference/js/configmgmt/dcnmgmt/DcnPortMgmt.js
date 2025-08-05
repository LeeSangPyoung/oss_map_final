/**
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	var paramData = null;
	
	var arrUse = [{'value':'A','text':'사용'},{'value':'I','text':'미사용'}]; 
	var arrTarget = [{'value':'P','text':'기본'},{'value':'S','text':'예비'}];
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        
    };
    
    function setRegDataSet(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnPortList/'+ data.dcnId, null, 'GET', 'dcnPortList');
    }
    
  //Grid 초기화
    function initGrid() {
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	pager : false,
        	height:"8row",
        	autoColumnIndex: true,
        	rowInlineEdit : true,
        	cellSelectable : false,
    		autoResize: true,
    		rowSelectOption: {
    			clickSelect: false
    		},
    		defaultState: {
    			dataAdd: {editing: true},
    			dataSet: {editing: true}
    		},
    		columnMapping: [{
				key : 'portVal', align:'center',
				title : 'Port',
				width: '100px'
    		}, {
				key : 'portTypVal', align:'center',
				title : 'Port 유형',
				hidden : true
    		}, {
				key : 'portTypNm', align:'center',
				title : 'Port 유형',
				width: '200px',
				value: function(value, data, mapping){
					var portType = data["portTypVal"];
					var portTypeName = "";
					var portTypeCnt = 0;
					if(portType != undefined && data.nmsCd == "034004"){
						for(var i=0; i<portType.length; i++)
						{
							if(portType.charAt(i) == '1')
							{
								if(portTypeCnt > 0)
								{
									portTypeName += "/";
								}
								
								if(i==0)
								{
									portTypeName += "장애";
								}
								else if(i==1)
								{
									portTypeName += "제어";
								}
								else if(i==2)
								{
									portTypeName += "장비접속";
								}
								else if(i==3)
								{
									portTypeName += "성능";
								}
								else if(i==4)
								{
									portTypeName += "실장";
								}
								else if(i==5)
								{
									portTypeName += "NE목록";
								}
								
								portTypeCnt++;
							}
						}
					}
					return portTypeName;
				}
    		}, {
				key : 'portUseYn', align:'center',
				title : '사용여부',
				width: '200px',
				render : {
      	    		type : 'string',
      	    		rule : function(value, data) {
      	    			var render_data = [];
      	    				return render_data = render_data.concat(arrUse);
      	    		}
      	    	},
      	    	editable:{
      	    		type:"select",
      	    		rule : function(value, data){
      	    			return arrUse;
      	    		}, attr : {
			 				style : "width: 100%;min-width:115px;padding: 2px 2px;"
			 			}
      	    	},
  				editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val();
  				}
    		}, {
				key : 'curObjVal', align:'center',
				title : 'Target',
				width: '200px',
				render : {
      	    		type : 'string',
      	    		rule : function(value, data) {
      	    			var render_data = [];
      	    				return render_data = render_data.concat(arrTarget);
      	    		}
      	    	},
      	    	editable:{
      	    		type:"select",
      	    		rule : function(value, data){
      	    			return arrTarget;
      	    		}, attr : {
			 				style : "width: 100%;min-width:115px;padding: 2px 2px;"
			 			}
      	    	},
  				editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val();
  				}
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
  		
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
    	
    }
    
    
    function setEventListener() {
        
    	
    	//취소 
    	$('#btnCncl').on('click', function(e) {
    		 $a.close();
    	});
    	
    	//저장 
    	$('#btnSave').on('click', function(e) {
    		 
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
   		       //저장한다고 하였을 경우
   		        if (msgRst == 'Y') {
   		        	portReg(); 
   		        } 
   		      }); 
         });
         	   
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'dcnPortList') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.dcnPortList);
    	}
    	
    	if(flag == 'updateDcnPort'){
    		if(response.Result == "Success"){

    			//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    	 		       if (msgRst == 'Y') {
    	 		           $a.close();
    	 		       }
        		});

        		var pageNo = $("#pageNo", opener.document).val();
	    		var rowPerPage = $("#rowPerPage", opener.document).val();
	    		
	            $(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");

        	}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'dcnPortList'){
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	
    	if(flag == 'updateDcnPort'){
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	
    }
    
    function portReg() {

    	$('#'+gridId).alopexGrid('endEdit', {_state:{editing:true}});
    	var param = $('#'+gridId).alopexGrid('dataGet');

    	if(param.length > 0){

			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			for(var i=0; i<param.length; i++){
				 param[i].lastChgUserId = userId;
			}
	   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/updateDcnPort', param, 'POST', 'updateDcnPort');
    	}
    }
    
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