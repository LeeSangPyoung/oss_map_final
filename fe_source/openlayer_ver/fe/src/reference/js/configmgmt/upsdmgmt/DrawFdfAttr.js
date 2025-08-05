/**
 * DrawFdfAttr.js
 *
 * @author Administrator
 * @date 2017. 11. 30.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var gridId = "fdfAttrGrid";
	var prevUnitSize = 4;
	var portInfoTemp = [];
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setAttr();
    	setEventListener();
    };

    function setAttr() {

    	var html = "";
    	var inNum = "";
    	var outNum = "";
    	for(var i=0; i<12; i++){
   		var inCnt = 0;
   		var outCnt = 0;
    	html += "<tr>";
	    	for(var j=0; j<12; j++){
	    		inNum = (i+1)+inCnt;
	    		html += "	<th rowspan=2 width=30px style='padding: 2px; text-align: center;'>";
	    		html += inNum;
	    		html += "	</th>";
	    		html += "	<th width=35px style='padding: 0px; text-align: center; height: 20px; background-color: #E6F2FF'>IN</th>";
	    		html += "	<td style='padding: 0px;'>";
	    		html += "	<input class='Textinput textinput wFull' id='in_"+inNum+"' name='in_"+inNum+"' data-bind='value: in_"+inNum+"' style='background-color:transparent;border:0 solid black;text-align: left;'  type='text'>";
	    		html += "	</td>";
	    		inCnt = inCnt + 12;
	    	}
    	html += "</tr>";
    	html += "<tr>";
	    	for(var j=0; j<12; j++){
	    		outNum = (i+1)+outCnt;
	    		html += "	<th width=35px style='padding: 0px; text-align: center; height: 20px; background-color: #FFF0E1'>OUT</th>";
	    		html += "	<td style='padding: 0px;'>";
	    		html += "	<input class='Textinput textinput wFull' id='out_"+outNum+"' name='out_"+outNum+"' data-bind='value: out_"+outNum+"' style='background-color:transparent;border:0 solid black;text-align: left;'  type='text'>";
	    		html += "	</td>";
	    		outCnt = outCnt + 12;
	    	}
    	html += "</tr>";
    	}

    	document.getElementById("fdfAttr").innerHTML = html;

    	if(paramData.attrId == undefined || paramData.attrId == ""){

    	}else {
    		var param = {attrId: paramData.attrId};
    		$('#attrId').val(paramData.attrId);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFdfAttrList', param, 'GET', 'getFdfAttrList');

    	}
    }

    function setEventListener() {
    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//등록
    	 $('#btnSave').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 fdfAttrReg();
		        }
		     });
         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'getFdfAttrList'){
    		for(var i = 0; i<response.fdfAttrList.length; i++){
    			var resObj = response.fdfAttrList[i];
    			if(resObj.inContents != undefined){
    				$('#in_'+(i+1)).val(resObj.inContents);
    			}
    			if(resObj.outContents != undefined){
    				$('#out_'+(i+1)).val(resObj.outContents);
    			}
    		}
    	}

    	if(flag == 'updateFdfAttrInfo') {
    		if(response.Result == "Success"){

        		//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        		       if (msgRst == 'Y') {
        		           $a.close();
        		       }
        		});
    		}
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'updateFdfAttrInfo'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function fdfAttrReg() {
    	var param =  $("#drawFdfAttrform").getData();
    	var params = [];
    	for(var i = 0; i<144; i++){
    		params[params.length] = {attrId: param.attrId, portNo: i+1, inContents: eval('param.in_'+(i+1)), outContents: eval('param.out_'+(i+1))};
    	}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateFdfAttrInfo', params, 'POST', 'updateFdfAttrInfo');

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