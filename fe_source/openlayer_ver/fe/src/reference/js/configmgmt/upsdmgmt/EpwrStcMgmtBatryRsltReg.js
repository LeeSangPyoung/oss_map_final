/**
 * EpwrStcMgmtBatryRsltReg.js
 *
 * @author Administrator
 * @date 2018. 02. 28.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	$('#sbeqpId').val(param.sbeqpId)
    	if(param.stat == 'add'){
    		$('#batryRsltMod').hide();
    		$('#batryRsltAdd').show();
    		for(var i=parseInt(param.cellCnt)+1; i<=24; i++){
    			$('#cell'+i+'RstnVal').val("");
    			$('#cell'+i+'RstnVal').setEnabled(false);
    		}
    	}else if(param.stat == 'mod'){
    		$('#batryRsltAdd').hide();
    		$('#batryRsltMod').show();
    		setData(param)
    	}
    	setEventListener();
    };

    function setData(param) {
    	$('#EpwrStcMgmtBatryRsltRegForm').setData(param)
		for(var i=parseInt(param.cellCnt)+1; i<=24; i++){
			$('#cell'+i+'RstnVal').val("");
			$('#cell'+i+'RstnVal').setEnabled(false);
		}
    }
    function setSelectCode() {

    }
    function setEventListener() {
    	//취소
    	 $('#btnBatryRsltCncl').on('click', function(e) {
    		 $a.close();
         });

    	//등록
    	 $('#btnBatryRsltReg').on('click', function(e) {
/*    		 if($('#csType').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 BatryRsltReg();
		        }
		     });
         });
    	 //수정
    	 $('#btnBatryRsltMod').on('click', function(e) {
    		 /*    		 if($('#csType').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 BatryRsltReg();
    			 }
    		 });
    	 });
    	 //삭제
    	 $('#btnBatryRsltDel').on('click', function(e) {
    		 /*    		 if($('#csType').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 BatryRsltDel();
    			 }
    		 });
    	 });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'batryRsltReg') {
    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           $a.close();
	    		       }
	    		});
    		}
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:batry.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	if(flag == 'batryRsltDel') {
    		if(response.Result == "Success"){
    			//삭제 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});
    		}
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:batry.setGrid("+pageNo+","+rowPerPage+");");
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'BatryRsltReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'batryRsltDel'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function BatryRsltReg() {
    	var param =  $("#EpwrStcMgmtBatryRsltRegForm").getData();
    	var cellList = []
    	var result = 0.0;
    	for(var i=1; i<=paramData.cellCnt; i++){
    		cellList.push($('#cell'+i+'RstnVal').val())
			result += parseFloat($('#cell'+i+'RstnVal').val())
		}
    	if(result>0){
    		var avg = result/parseInt(paramData.cellCnt);
    		param.rstnAvgVal = avg.toFixed(3)
    	}
    	param.sbeqpId = paramData.sbeqpId;
    	param.msmtNo = paramData.msmtNo;
//    	param.mnftDt = paramData.mnftDt;
    	param.capa = paramData.capa;
    	param.rstnMaxVal = Math.max.apply(null,cellList)
    	param.rstnMinVal = Math.min.apply(null,cellList)

    	param.rstnBadCnt = rstnBadChk(param,cellList)
    	param.rstnDgrdn1Cnt = rstnDgrdn1Chk(param,cellList)
    	param.rstnDgrdn2Cnt = rstnDgrdn2Chk(param,cellList)
    	param.rstnGoodCnt = rstnGoodChk(param,cellList)
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsertBatryMsmt', param, 'POST', 'batryRsltReg');
    }
    function BatryRsltMod() {
    	var param =  $("#EpwrStcMgmtBatryRsltRegForm").getData();
    	param.sbeqpId = paramData.sbeqpId
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsertBatryMsmt', param, 'POST', 'batryRsltMod');
    }
    function BatryRsltDel() {
    	var param =  $("#EpwrStcMgmtBatryRsltRegForm").getData();
    	param.msmtNo = paramData.msmtNo;
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteBatryMsmt', param, 'POST', 'batryRsltDel');
    }
	//불량
	function rstnBadChk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>9.08){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>8.26){
						cnt++;
					}
				}

			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.486){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>9.08){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.45){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.414){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.93){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.36){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.88){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.88){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.324){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.288){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.8){
						cnt++;
					}
				}
			}

		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.8){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>10.9){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>9.91){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.11){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.05){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.05){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.05){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.4){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.42){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.96){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}
	//열화1
	function rstnDgrdn1Chk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=7.575 && cellList[i]>6.06){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=6.885 && cellList[i]>5.508){
						cnt++;
					}
				}
			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.405 && cellList[i]>0.324){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.39 && cellList[i]>0.312){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.375 && cellList[i]>0.3){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.345 && cellList[i]>0.276){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.78 && cellList[i]>0.624){
						cnt++;
					}
				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.3 && cellList[i]>0.24){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.735 && cellList[i]>0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.735 && cellList[i]>0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(ccellList[i]<=0.27 && cellList[i]>0.216){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.24 && cellList[i]>0.192){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.675/*0.54*/){
						cnt++;
					}
				}
			}
		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.53 && cellList[i]>0.4){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=7.26 && cellList[i]>5.445){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=6.606 && cellList[i]>4.955){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.740 && cellList[i]>0.555){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.7 && cellList[i]>0.525){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.7 && cellList[i]>0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.7 && cellList[i]>0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.264 && cellList[i]>0.198){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.278 && cellList[i]>0.209){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.64 && cellList[i]>0.48){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}
	//열화2
	function rstnDgrdn2Chk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=9.09 && cellList[i]>7.575){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=8.262 && cellList[i]>6.885){
						cnt++;
					}
				}
			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.486 && cellList[i]>0.405){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.468 && cellList[i]>0.405){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.45 && cellList[i]>0.375){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.414 && cellList[i]>0.345){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.936 && cellList[i]>0.78){
						cnt++;
					}
				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.36 && cellList[i]>0.3){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.882 && cellList[i]>0.735){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.882 && cellList[i]>0.735){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(ccellList[i]<=0.324 && cellList[i]>0.27){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.288 && cellList[i]>0.24){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.81/*0.675*/){
						cnt++;
					}
				}
			}
		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.8 && cellList[i]>0.53){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=10.9 && cellList[i]>7.26){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=9.91 && cellList[i]>6.606){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.11 && cellList[i]>0.74){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.05 && cellList[i]>0.7){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.05 && cellList[i]>0.7){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.05 && cellList[i]>0.7){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.396 && cellList[i]>0.264){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.417 && cellList[i]>0.278){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.96 && cellList[i]>0.64){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}

	function rstnGoodChk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=6.06){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=5.508){
						cnt++;
					}
				}

			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.324){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.312){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.3){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.276){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.624){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.24){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.216){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.192){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.54){
						cnt++;
					}
				}
			}
		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.4){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=5.445){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=4.955){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.555){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.525){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.198){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.209){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.480){
						cnt++;
					}
				}
			}
		}
		return cnt;
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