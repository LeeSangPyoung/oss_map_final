/**
 * EqpDtlLkup.js



 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */



var comEqp = $a.page(function() {


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	$('#eqpErpT').progress();
    	$('#eqpNamsT').progress();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/EqpIntgFcltsCdList', param, 'GET', 'eqpIntgFcltsCdList');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/EqpNamsList', param, 'GET', 'eqpNamsList');

    	setEventListener();
        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#eqpErpDtlLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }



    function setEventListener() {


	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){


    	if(flag == 'eqpIntgFcltsCdList'){
    		$('#eqpErpLkupArea').setData(response.eqpIntgFcltsCdList[0]);
			$('#eqpErpT').progress().remove();

    	}

    	if(flag == 'eqpNamsList'){

    		$('#eqpErpLkupArea').setData(response.eqpNamsList[0]);
    		$('#eqpNamsT').progress().remove();
    	}



    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }


    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
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
                  height : window.innerHeight * 0.7

              });
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