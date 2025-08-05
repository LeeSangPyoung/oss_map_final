/**
 * FdfCardInfPop.js
 *
 * 트렁크 FDF장비에서 'FDF포트정보확인' 선택시
 * @author P128406
 * @date 2021. 01. 13. 
 * @version 1.0
 *  
 */

var gridId = 'dataGrid';
var paramData = null;
var totalCnt = 0;
var trunkLineNo = "";

/** FDF구간분류코드 */
var fdfTxRxCdArr = [ 
         	          { FDF_TRX_CD : "1"}
         			, { FDF_TRX_CD : "2"}
         			, { FDF_TRX_CD : "3"}
         			, { FDF_TRX_CD : "4"}
         			, { FDF_TRX_CD : "5"}
         			, { FDF_TRX_CD : "6"}
         			, { FDF_TRX_CD : "7"}
         			, { FDF_TRX_CD : "8"}
         			, { FDF_TRX_CD : "9"}
         			, { FDF_TRX_CD : "10"}
         			, { FDF_TRX_CD : "11"}
         			, { FDF_TRX_CD : "12"}
         	];

var main = $a.page(function() {

    this.init = function(id, param) {
    	paramData = param;
    			
    	initGrid();
        setEventListener();

        searchInit(paramData);

    };
    
    function initGrid() {
		
		$('#sFdfEqpInfo').text(paramData.eqpNm);
		
    	for(var index = 0; index < 12; index++) {
    		var clientHtml = "";
    		clientHtml +=		'<td style="height:80px; margin:0; padding:0; text-align: center">';
    		clientHtml +=			'<table style="width:100%; text-align: center">';
    		clientHtml +=				'<tbody style="text-align: center">';
    		clientHtml +=					'<tr><td>FRONT</td></tr>';
    		clientHtml +=					'<tr><td>회선명</td></tr>';
    		clientHtml +=					'<tr><td>BACK</td></tr>';
    		clientHtml +=				'</tbody>';
    		clientHtml +=			'</table>';
    		clientHtml +=		'</td>';
			
	    	for(var i = 0; i < fdfTxRxCdArr.length; i++) {
	    		var fdfTrxCd = fdfTxRxCdArr[i].FDF_TRX_CD;
	    		var LNO_TYP = "TX";
	    		
	    		var j = (Number(index) * 12) + Number(fdfTrxCd);
	    		if(j%2 != 0) {
	    			clientHtml +=	'<td title="Tx:' + j + '" colspan="2" id="' + LNO_TYP + '_' + j + '"></td>';
	    		}
	    	}

    		$("#"+ index).html(clientHtml);
    	}
    }
    

    function selectFdfback(){
    	alertBox('W', "obj");
    }
    
    function setEventListener() {
    	 
    	$('#btnClose').on('click', function(e){
    		$a.close();
        });
				
    	//닫기
	 	$('#btnPopClose').on('click', function(e) {
	 		$a.close();
    	});  
		
    	//닫기
	 	$('#page1').on('click', function(e) {
	    	console.log("frontPage");
	    	$('.list1').show();
	    	$('.list2').hide();
	    	$('#page1').css('font-weight', 'bold');
	    	$('#page2').css('font-weight', '');
    	}); 

	 	$('#page2').on('click', function(e) {
	    	console.log("backPage");
	    	$('.list1').hide();
	    	$('.list2').show();
	    	$('#page1').css('font-weight', '');
	    	$('#page2').css('font-weight', 'bold');
    	}); 
    }
    
    function searchInit(param) {

    	param = {"eqpId" : param.eqpId
    			, "eqpNm" : param.eqpNm};
    	cflineShowProgressBody();
    	var dataParam = param;
    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/fdfCardIndexInfo', dataParam, 'GET', 'search');
    }
	
	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		var data = response.fdfTXList;
    		var rxData = response.fdfRXList;
    		var eqpNm = response.fdfName;
    		var eqpId = response.fdfId;

			cflineHideProgressBody();
			
			setTxFdf(data, rxData);   

	    	$('.list1').show();
	    	$('.list2').hide();
    	}
    }
	
   	function setTxFdf(data, rxData) {

   		if(data.length > 0) {
   			for(var index = 0; index < data.length; index++) {

   				var fdfInfo = data[index];
   				var rxFdfInfo = rxData[index];
   			    var i = "";
   			    	
		    	var portId = fdfInfo.aPortId;
		    	var frontEqpRoleCd = fdfInfo.frontEqpRoleDivCd;
		    	var backEqpRoleCd =  fdfInfo.backEqpRoleDivCd;
		    	var gbn = fdfInfo.gbn;
		    	
   				var clientHtml = "";  	
   				
   	    		clientHtml +=		'<table style="width:100%;height:80px;">';
   	    		clientHtml +=		  '<tbody>';
   	    		clientHtml +=			'<tr align="center"  class="mouse">';
   	    		clientHtml +=				'<td style="height:100%; width:100%; margin:0; padding:0; text-align: right">';
   	    		clientHtml +=				'<ui style="width:100%;" >';
   	    		//FRONT장비명
   	    		clientHtml +=					'<li style="height:20%;color:red; text-align: right" class="front_'+index+'" id="front_'+index+'" >'+nullToEmpty(fdfInfo.frontEqpNm)+'</li>';
   	    		 
   	    		if((frontEqpRoleCd == "11" || frontEqpRoleCd == "162"
   	    			|| frontEqpRoleCd == "177" || frontEqpRoleCd == "178" || frontEqpRoleCd == "182")) {
   	    			clientHtml +=					'<span>Tx:'+nullToEmpty(fdfInfo.frontPortNm)+' Rx:'+nullToEmpty(rxFdfInfo.frontPortNm)+'</span>';
   	    		}
   	    		clientHtml +=						'<input type="hidden" id="frontE_' + index + '" class="frontE_' + index + '" value="'+nullToEmpty(fdfInfo.frontEqpNm)+'">';
   	    	    clientHtml +=						'<input type="hidden" id="frontP_' + index + '" class="frontP_' + index + '" value="'+nullToEmpty(fdfInfo.frontPortNm)+'">';
    		
   	    		var trunkLineNm = "";
    			var trunkList = fdfInfo.trunkLineList;
    			var trunkLineNo = "";  	 
    			for(var j = 0; j < trunkList.length; j++) {
    				if(trunkList.length > 1) {
    					trunkLineNm = trunkList[0].ntwkLineNm + "외 " + (trunkList.length - 1) + "건";
					} else {
    					trunkLineNm = trunkLineNm + trunkList[0].ntwkLineNm;
					}
    		    	trunkLineNo = trunkLineNo + trunkList[j].ntwkLineNo + ",";
    			}
    			//TRUNK 회선명
   	   	    	clientHtml +=						'<a href="#" onclick= \"javascript:main.setGrid(' + index + ');\" >';
   	   	        clientHtml +=					    '<li style="text-align: center; height:30%;" id="trunk_' + index + '" >'+trunkLineNm+'</li></a>';
   	   	    	clientHtml +=						'<input type="hidden" id="trunk_' + index + '" class="trunk_' + index + '" value="'+trunkLineNo+'">';
   	   	    	//BACK장비명
   	   	    	clientHtml +=					'<li style="height:20%;color:blue;vertical-align:bottom" class="back_'+index+'" id="back_'+index+'" >'+nullToEmpty(fdfInfo.backEqpNm)+'</li>';
   	   	        
   	   	    	if((backEqpRoleCd == "11" || backEqpRoleCd == "162"
   	    			|| backEqpRoleCd == "177" || backEqpRoleCd == "178" || backEqpRoleCd == "182")) {
   	   	    		clientHtml +=					'<span>Tx:'+nullToEmpty(fdfInfo.backPortNm)+' Rx:'+nullToEmpty(rxFdfInfo.backPortNm);
   	   	    		//clientHtml +=					'</li>';
   	    	
   	    		} else {
   	    			//clientHtml +=					'</li>';
   	    		}
   	   	  
   	   	    	clientHtml +=						'<input type="hidden" id="backE_' + index + '" class="backE_' + index + '" value="'+nullToEmpty(fdfInfo.backEqpNm)+'">';
   	   	    	clientHtml +=						'<input type="hidden" id="backP_' + index + '" class="backP_' + index + '" value="'+nullToEmpty(fdfInfo.backPortNm)+'">';
   	    		clientHtml +=			    '</ui>';  		    		
   	    		clientHtml +=				'</td>';
   	    		clientHtml +=			'</tr>';
   	    		clientHtml +=		  '</tbody>';
   	    		clientHtml +=		'</table>';
   	    		
   	    		//portId 가 짝수인 경우
   	    		if((portId%2) == 0) {
   	    			portId = Number(portId) + 1;
   	    		}
   	    		$("#TX_"+ portId).html(clientHtml);
   			}
   		}
   		
   		//setRxFdf(rxData);
   	}
    
   	function setRxFdf(data) {

   		if(data.length > 0) {
   			for(var index = 0; index < data.length; index++) {

   				var fdfInfo = data[index];
   				
   				var clientHtml = "";  	  
   				
		    	var portId = fdfInfo.aPortId;
		    	var frontEqpRoleCd = fdfInfo.frontEqpRoleDivCd;
		    	var backEqpRoleCd =  fdfInfo.backEqpRoleDivCd;
		    	var gbn = fdfInfo.gbn;
		    	
   	    		$(".fRx_"+ index).text("RX:1");
   	    		$(".bRx_"+ index).text("RX:7");
   			}
   		}
   	}
   				
    this.setGrid = function(id){

    	var frontNm = $('.front_'+id).text();
    	var lineNo = $('.trunk_'+id).val();
    	var backNm = $('.back_'+id).text();
    	
    	var data = {"lineNoStr":lineNo
    			, "frontNm":frontNm
    			, "backNm" : backNm
    			, "fdfNm" : paramData.eqpNm}
		openTrunkListPop(data);
    };
 

	/**
	 * Function Name : openTrunkListPop
	 * Description   : 트렁크회선 정보
	 * ----------------------------------------------------------------------------------------------------
	 * param    	 : lineNo. 회선 또는 네트워크ID
	 * ----------------------------------------------------------------------------------------------------
	 */
	function openTrunkListPop(data) {
		 
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}

		$a.popup({
			popid: "TrunkListInfoPop",
			title: "트렁크회선정보", 
			url: 'TrunkListInfoPop.do',
			data: data,
			iframe: true,
			modal : true,
			movable:false,
			windowpopup : true,
			width : 1000,
			height : 400,
			callback:function(data){
				
			}
		});
	};
	
	// 엑셀 다운로드 
    $('#btnExportExcel').on('click', function(e) {
 		funExcelBatchExecute();
   	}); 
	
	
	
	
	
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
		//조회 실패 하였습니다.
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		alertBox('W', "조회 실패 하였습니다.");  /* 조회 실패 하였습니다. */
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
    		data : Param, 		//data가 존재할 경우 주입
    		method : Method, 	//HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

});

