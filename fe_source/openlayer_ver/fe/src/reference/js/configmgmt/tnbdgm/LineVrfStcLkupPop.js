/**
 * LineVrfDtlLkupPop.js
 *
 * @author Administrator
 * @date 2017. 10. 29.
 * @version 1.0
 */
var popup = $a.page(function() {

	var gridId = 'lineDtlGrid';
	var paramData = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
    	hideCol();
        setEventListener();
        setLineNm();
        popup.setGrid();
    };

	//Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 400,
        	paging : {
        		pagerTotal: false
        	},
        	autoColumnIndex: true,
        	autoResize: true,
        	defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				key : 'trkNm', align:'center',
				title : '트렁크',
				width: '130px'
			}, {
				key : 'mtsoNm', align : 'center',
				title : '국사',
				width : '130px'
			},{
				key : 'eqpNm', align : 'center',
				title : '장비',
				width : '130px'
			}, {
				key : 'lftPortNm', align : 'center',
				title : 'WEST Port',
				width : '130px'
			}, {
				key : 'rghtPortNm', align : 'center',
				title : 'EAST Port',
				width : '130px'
			}, {
				key : 'statusDesc', align : 'center',
				title : '상태',
				width : '120px',
				render: function(value, data, render, mapping){
					if(value == 'NONE'){
						return '검증 안한 상태'
					}else if(value == 'FAIL_NOT_EQUAL_PREV_EQP_MTSO'){
						return '이전 장비 국사와 불일치'
					}else if(value == 'FAIL_NOT_EQUAL_NEXT_EQP_MTSO'){
						return '다음 장비 국사와 불일치'
					}else if(value == 'FAIL_NOT_EQUAL_UPPER_MTSO'){
						return '첫번째 또는 마지막 장비 국사가 상위국과 불일치'
					}else if(value == 'FAIL_NOT_EQUAL_LOWER_MTSO'){
						return '첫번째 또는 마지막 장비 국사가 하위국과 불일치'
					}else if(value == 'MAIL_PORT_NULL'){
						return 'A, B 포트 모두 입력 안한 경우'
					}else if(value == 'EXCEPT_VERIFY_PATH_NODE'){
						return '검증 대상에서 제외된 선번 노드'
					}else if(value == 'EXCEPT_VERIFY_LINE'){
						return '검증 대상에서 제외된 회선 선번'
					}else if(value == 'NOTHING_PATH'){
						return '선번이 없는 경우'
					}else if(value == 'FAIL_UNKNOWN_ERROR'){
						return '시스템 오류로 검증 실패'
					}else if(value == 'VERIFY_CANCEL'){
						return '정상(검증 대상에서 제외된 선번)'
					}else{
						return value
					}
				}
			}, {
				key : 'vrfCnclYn', align : 'center',
				title : '검증제외',
				width : '80px',
				editable: {
					type:'checkbox',
					rule:[
						{value:'Y',checked:true},
						{value:'N',checked:false}
					]
				},
				defaultValue: 'N'
			}, {
				key : 'vrfWoRsn', align : 'center',
				title : '검증제외사유',
				width : '150px',
				editable: true,
				defaultValue: ''
			}, {
				key : 'lastChgUserId', align : 'center',
				title : '수정자',
				width : '100px'
			}, {
				key : 'lastChgDate', align : 'center',
				title : '수정일',
				width : '150px'
			}, {
				key : 'svlnNo', align : 'center',
				title : '회선번호',
				width : '150px'
			}, {
				key : 'eqpId', align : 'center',
				title : '장비ID	',
				width : '150px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    function setEventListener() {
    	//닫기
    	$('#btnCncl1').on('click', function(e) {
    		$a.close();
    	});

   	 	//검증 상태 설명
    	$('#btnInfo').on('click', function(e) {
    		$a.popup({
    			popid: 'LineVrfDtlSct',
    			title: '검증 상태 설명',
    			url:  '/tango-transmission-web/configmgmt/tnbdgm/LineVrfDtlRptPopUp.do',
    			data: '',
    			iframe: false,
    			modal: true,
    			movable:true,
    			width : 800,
    			height : 450
    		});
    	});

    	//관할 전송실 상세
    	$('#tmofInfoAll').on('click', function(e) {
    		var data = new Object();
     		data.svlnNo = paramData.svlnNo;
     		data.sFlag = 'Y';
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getSelectMtsoLnoInfoByPathList', data, 'GET', 'tmofInfoPop');
    	});

    	//저장
    	$('#btnReg').on('click', function(e) {
    		var param = [];
    		$('#'+gridId).alopexGrid("endEdit",{ _state : { editing : true }});
    		var dataList = $('#'+gridId).alopexGrid("dataGet");
    		$('#'+gridId).alopexGrid("startEdit");
    		for(var i=0; i<dataList.length; i++){
    			if(dataList[i]._original.vrfCnclYn != dataList[i].vrfCnclYn || dataList[i]._original.vrfWoRsn != dataList[i].vrfWoRsn){
    				param.push(dataList[i]);
    			}
    		}
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			//저장한다고 하였을 경우
    			if (msgRst == 'Y') {
    				eqvpWoReg(param);
    			}
    		});
    	});


    };

    function setLineNm() {
    	//고객명
    	$('#popLineNm').text(paramData.custName);

    };

	function successCallback(response, status, jqxhr, flag){
		//조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response.lineDtlsList);
    		$('#'+gridId).alopexGrid('startEdit');
    	}

    	//저장시
    	if(flag == 'eqvpWoReg'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    			popup.setGrid()
    		} else if( response.Result == "Fail"){
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	//관할정보실정보
    	if(flag == 'tmofInfo'){
    		var span = "";
    		var sClass = "";
    		var tmpLineNo = "";
    		//document.getElementById("sTmofInfoPop").innerHTML = "";

    		if(response.length > 0) {
    			vTmofInfo  = response;
    			for(i = 0; i < response.length; i++) {
    				if(i==0){
    					tmpLineNo = response[i].svlnNo;
    				}
    				// 작업상태에 따라 버튼 클래스 변경
    				var vStatCd = response[i].mtsoLnoInsProgStatCd;
    				if(vStatCd == "01") {
    					sClass =  "class='Button button2 color_btn_1 text_color_w'";   // 신규
    				} else if(vStatCd == "02") {
    					sClass =  "class='Button button2 color_btn_2 text_color_w'";  // 작업중
    				} else if(vStatCd == "03") {
    					sClass =  "class='Button button2 color_btn_3 text_color_w'";  // 완료
    				}
    				if(i==0) {
    					span += "<div style='float: left;'><span "+sClass+">"+response[i].statNm+"</span>&nbsp;" + response[i].text + "</div>";
    				} else {

    					span += "<div style='margin-left: 5px; float: left;'><span "+sClass+">"+response[i].statNm+"</span>&nbsp;" + response[i].text + "</div>";
    				}
    				if(i<=2){
    					document.getElementById("tmofInfo").innerHTML = span;
    				}
    			}
    		}
    	}
    	//관할정보실정보상세
    	if(flag == 'tmofInfoPop'){
    		var span = "";
    		var sClass = "";
    		var tmpLineNo = "";
    		//document.getElementById("sTmofInfoPop").innerHTML = "";

    		if(response.length > 0) {
    			vTmofInfo  = response;
    			for(i = 0; i < response.length; i++) {
    				if(i==0){
    					tmpLineNo = response[i].svlnNo;
    				}
    				// 작업상태에 따라 버튼 클래스 변경
    				var vStatCd = response[i].mtsoLnoInsProgStatCd;
    				if(vStatCd == "01") {
    					sClass =  "class='Button button2 color_btn_1 text_color_w'";   // 신규
    				} else if(vStatCd == "02") {
    					sClass =  "class='Button button2 color_btn_2 text_color_w'";  // 작업중
    				} else if(vStatCd == "03") {
    					sClass =  "class='Button button2 color_btn_3 text_color_w'";  // 완료
    				}
    				if(i==0) {
    					span += "<div><span "+sClass+">"+response[i].statNm+"</span>&nbsp;" + response[i].text + "</div>";
    				} else {
    					span += "<div style='margin-top: 5px;'><span "+sClass+">"+response[i].statNm+"</span>&nbsp;" + response[i].text + "</div>";
    				}
    			}
    		}
    		tmofInfoBox('', '관할전송실정보', span, '');

    	}
	}
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }
    //컬럼 숨기기
    function hideCol(){
    	$('#'+gridId).alopexGrid("hideCol",["svlnNo","eqpId"])
    }

     //오류검증제외 저장
    function eqvpWoReg(param){
    	for(var i=0; i<param.length; i++){
    		//param[i].userId = $('#userId').val();
    		param[i].userId = 'TESTUSER';
    	}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/saveEqvpWo', param, 'POST', 'eqvpWoReg');
    }
    this.setGrid = function(){
 		$('#'+gridId).alopexGrid('showProgress');
 		//console.log(paramData);
 		var data = new Object();
 		data.svlnNo = paramData.svlnNo;
 		data.sFlag = 'Y';
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/getLineDtlsList', paramData, 'GET', 'search');
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getSelectMtsoLnoInfoByPathList', data, 'GET', 'tmofInfo');
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

    function setSPGrid(GridID,Data) {
	       $('#'+GridID).alopexGrid('dataSet', Data);
	}

    function tmofInfoBox(strId, strMsgType, strMsgContent, callback){

    	var btnId = strId.replace(/#/, "");
    	var strMsgByte = "";
    	var minWidth = "200";
    	var maxWidth = "300";
    	var maxYn = "";
    	var width = 0;
    	var brCnt = 0;

    	if($.TcpMsg.isNotEmpty(strMsgContent)){  // 입력 메시지 NULL처리
    		// 개행이 존재하는 경우
    		if(strMsgContent.indexOf("<br>") > -1){
    			brCnt += Number(strMsgContent.split("<br>").length);

    			for(var k=0; k < strMsgContent.split("<br>").length; k++){
    				var rowStrMsg = strMsgContent.split("<br>")[k]+"";
    				strMsgByte = $.TcpMsg.getByteLengh(rowStrMsg);

    				if(Number(strMsgByte) * 5 > 500){
    					maxYn = "Y";
    					brCnt += parseInt(parseInt(Number(strMsgByte) * 5) / 500);
    				}else{
    					if(k == 0){
    						width = Number(strMsgByte) * 5;
    					}else{
    						if(Number(strMsgByte) * 5 > width) width = Number(strMsgByte) * 5;
    					}
    				}
    			}

    			if(maxYn == "Y"){
    				width = maxWidth;
    			}else{
    				if(Number(minWidth) > Number(width)) width = minWidth;
    			}
    		}else{
    			strMsgByte = $.TcpMsg.getByteLengh(strMsgContent);
    			if(Number(strMsgByte) * 5 > 500){
    				width = maxWidth;
    				brCnt += parseInt(parseInt(Number(strMsgByte) * 5) / 500);
    			}else{
    				width = Number(strMsgByte) * 5;
    				if(Number(minWidth) > Number(width)) width = minWidth;
    			}
    		}
    	}else{
    		alert('메시지없음!');
    		return;
    	}

    	var height = 160 + (Number(brCnt) * 15); //개행별 18 증가
    	var title = "";
    	var content = "";
    	var type = "blank";
    	var btnDivHtml = [];

    	if($.TcpMsg.isNotEmpty(strMsgType)) {
    		title = strMsgType;
    	 }

    	 if($.TcpMsg.isNotEmpty(strMsgContent)) {
    		 content = strMsgContent;
    	 }

    	var msgHtml = [];

    	if($('#dialogMsg').length != 0){
    		$('#dialogMsg').remove();
    	}

    		msgHtml.push("		<div class='Dialog-contents color_black' style='word-wrap:break-word;'>");
    		msgHtml.push(content);
    		msgHtml.push("		<div class='button_box' style='margin-top:45px;'>");
    		msgHtml.push(btnDivHtml);
    		msgHtml.push("		</div>");
    		msgHtml.push("      </div>");

    		var msgDiv = document.createElement("div");
    		msgDiv.setAttribute("id","dialogMsg");
    		msgDiv.setAttribute("class","Dialog");
    		document.body.appendChild(msgDiv);
    		msgDiv.innerHTML = msgHtml.join("");

    		$a.convert($("#dialogMsg"));

    		$(".dialog_btn").on('click',function() {
    			if($.TcpMsg.isNotEmpty(callback)) {
    				$('#dialogMsg').close().remove();
    				if (typeof callback == "function") {
    					callback.call(this, btnId, $(this).attr("msgRst"));
    		        }
    			}else{
    				$('#dialogMsg').close().remove();
    			}
    		});

        $('#dialogMsg').open({
    	    title: title,
    	    width: width,
    	    height: height,
    	    type : type,
    	    resizable: false,
    	    toggle: false,
    	    movable: true,
    	    modal: true,
    	    animation: "show", //fade, slide
    	    xButtonClickCallback : function(el){ // x버튼 처리
    	    	$(".dialog_btn").trigger('click');
    	    }
    	  });
    }
});