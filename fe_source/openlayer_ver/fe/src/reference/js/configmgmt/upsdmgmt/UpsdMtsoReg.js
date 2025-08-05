/**
 * UpsdMtsoReg.js
 *
 * @author Administrator
 * @date 2017. 9. 14.
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'orgGrid';
	var randomUid =  (new Date().getTime()).toString(); //1683122429667
	console.log(randomUid);
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode()
    	setEventListener();
    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['address'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setSelectCode() {
    	var supCd = {supCd : '007000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', supCd, 'GET', 'orgIdL1');
    }

    function setEventListener() {
    	$('#workGubun').on('change', function(e) {
    		var workGubun = $('#workGubun').getTexts();
    		if(workGubun == 'SKB') {
    			$('#orgIdL1').setEnabled(true);
    		}
    		else {
    			$('#orgIdL1').setEnabled(false);
    		}

    		$('#orgIdL1').setSelected('선택');
    		$('#sisulCd').val("");
    		$('#sisulNm').val("");
    		$('#address').val("");
    	});

    	//통합시설코드조회
    	/*$('#sisulCd').focus(function(){
    		$('#orgGrid').show();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsdOrgList', '', 'GET', 'mtsoNotInList');
        });*/

    	//국사 조회
      	 $('#btnMtsoSearch').on('click', function(e) {
      		 $a.popup({
      	          	popid: 'MtsoLkup',
      	          	title: configMsgArray['findMtso'],
      	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
//      	            data: {autoSearchYn : "Y"},
      	            windowpopup: true,
      	            modal: true,
                      movable:true,
      	            width : 950,
      	           	height : 760,
      	           	callback : function(data) { // 팝업창을 닫을 때 실행
	  	                $('#workGubun').setData({
	  	                	workGubun:data.mgmtGrpNm
	  	        		});

      	              $('#mtsoId').val(data.mtsoId);
      	              $('#sisulCd').val(randomUid);  // java api단에서 재처리
      	              $('#mtsoTyp').val(data.mtsoTyp);
      	              $('#sisulNm').val(data.mtsoNm);
      	              $('#address').val(data.bldAddr);

      	              $('#sisulCd').removeClass('valid');
      	              $('#sisulNm').removeClass('valid');
      	            // 해당 체크 부분은 통합국ID로 변경한다.  
      	            httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getOrgListChk', {mtsoId:data.mtsoId}, 'GET', 'orgListChk');
      	           	}
      	      });
           });

    	/*$('body').on('click', function(e) {
    		if(e.target.id == 'sisulCd' || e.target.id == 'orgGrid' || e.target.id.indexOf('alopexgrid') >= 0
    		|| e.target.className.indexOf('scroll') >= 0 || e.target.className.indexOf('wrap') >= 0 || e.target.className.indexOf('title') >= 0) {
    			$('#orgGrid').show();
    		} else {
    			$('#orgGrid').hide();
    		}
    	});*/

    	/*$('#sisulCd').on('keyup', function(){
    		var param = {sisulCd : $('#sisulCd').val()};

        	if(param.sisulCd == '') {
        		$('#sisulCd').addClass('valid');
        	} else {
        		$('#sisulCd').removeClass('valid');
        	}

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsdOrgList', param, 'GET', 'mtsoNotInList');
    	});*/

    	$('#sisulNm').on('keyup', function(){
    		var param = {sisulNm : $('#sisulNm').val()};

        	if(param.sisulNm == '') {
        		$('#sisulNm').addClass('valid');
        	} else {
        		$('#sisulNm').removeClass('valid');
        	}
    	});

    	//그리드 셀 더블클릭 이벤트 바인딩
      	$('#'+gridId).on('dblclick','.bodycell', function(e){
      		var dataObj = null;
    		dataObj = AlopexGrid.parseEvent(e).data;
    		// $('#sisulCd').val(dataObj.sisulCd);
    		$('#orgIdL1').setSelected(dataObj.orgIdL1);
    		$('#sisulNm').val(dataObj.sisulNm);
    		$('#address').val(dataObj.address);

    		$('#sisulCd').removeClass('valid');
    		$('#sisulNm').removeClass('valid');
    		$('#orgGrid').hide();
		});

    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//등록
    	 $('#btnSave').on('click', function(e) {

    		 var param =  $("#upsdMtsoRegForm").getData();
	    	 if (param.sisulCd == "") {
	     		//필수 선택 항목입니다.[ 통합시설코드 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption','통합국ID'), function(msgId, msgRst){});
	     		return;
	     	 }

         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 mtsoReg();
		        }
		     });
         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'mtsoNotInList'){
    		$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.orgList);
    	}

    	if(flag == 'mtsoReg') {
    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           $a.close();
	    		       }
	    		});
    		}
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();

            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}

    	if(flag == 'orgIdL1') {
    		var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
			$('#'+flag).setData({
				data : option_data,
				orgIdL1: ''
			});
    	}
    	if(flag == 'orgListChk') {
    		console.log(response);
    		var mtsoTyp = $('#mtsoTyp').val();
    		var workGubun = $('#workGubun').val();
    		if (workGubun == 'SKT') {
    			if (mtsoTyp == '기지국사' || mtsoTyp == '국소') {
    		if(response.orgListChk == 'F'){
    			callMsgBox('','I', '이미 등록된 국사입니다.', function(msgId, msgRst){});
	            $('#mtsoId').val('');
        	            // $('#sisulCd').val('');
	            $('#sisulNm').val('');
	            $('#address').val('');
        	            $('#mtsoTyp').val('');
	     		return;
    		}
        		} else {
        			callMsgBox('','I', '기지국사 또는 국소만 등록가능합니다.', function(msgId, msgRst){});
    	            $('#mtsoId').val('');
    	            // $('#sisulCd').val('');
    	            $('#sisulNm').val('');
    	            $('#address').val('');
    	            $('#mtsoTyp').val('');
    	     		return;
        		}
    		} else {	// skb일 경우 모두 등록 가능
    			if(response.orgListChk == 'F'){
        			callMsgBox('','I', '이미 등록된 국사입니다.', function(msgId, msgRst){});
    	            $('#mtsoId').val('');
    	            // $('#sisulCd').val('');
    	            $('#sisulNm').val('');
    	            $('#address').val('');
    	            $('#mtsoTyp').val('');
    	     		return;
        		}
    		}
    		
    		
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'mtsoReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function mtsoReg() {
    	var param =  $("#upsdMtsoRegForm").getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertMtso', param, 'POST', 'mtsoReg');

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