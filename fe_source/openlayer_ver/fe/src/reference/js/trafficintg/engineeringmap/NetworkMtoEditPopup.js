/**
 *
 * @author Administrator

 * @date 2023. 08. 21.
 * @version 1.0
 */

$a.page(function() {


var gNetBdgmNodeImgCd;
var gEditYn = 'N';

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		let mtsoNm = param["mtsoNm"];
		let mtsoId = param["mtsoId"];
		gEditYn = param["editYn"];

		$("#inputMtsoNm").val(mtsoNm);
		$("#inputMtsoId").val(mtsoId);

		$("#editMtsoArea").hide();

		if (gEditYn == 'Y') {

			gNetBdgmNodeImgCd  = param["netBdgmNodeImgCd"];

			httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/NWCMIMG/getTopoloyTypCdList', null, 'GET', 'ExampleData');  // 범례 데이터

			$("#editMtsoArea").show();
		}




		setEventListener();
    };

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {

    	$("#mtsoSaveBtn").on("click", function(e) {

    		var param = {};
    		param.mtsoNm = $("#inputMtsoNm").val();
    		param.mtsoId = $("#inputMtsoId").val();

    		//수정시에만 넘겨준다
    		if (gEditYn == 'Y') {

    			let inputExample = $("#inputExample").val();
        		$("#selExampleList li").each(function() {
        			let spanTxt = $(this).find('span').text();
        			if(spanTxt == inputExample) {
        				param.source = $(this).data('icon');
        				param.netBdgmNodeImgCd  = $(this).data('value');
        				return;
        			}
        		});
    		}

    		$a.close(param);

    	});

    	$("#mtsoCnclBtn").on("click", function(e) {
    		$a.close();
    	});
    }

    function successCallback(response, status, jqxhr, flag){

    	if(flag === 'ExampleData') {
			makeLiExampleList($('#selExampleList'),    response);


			var input = document.getElementById("inputExample");
			var dropdown = document.getElementById("selExampleList");

			const defaultList = [...dropdown.children].find(li => li.dataset.value === gNetBdgmNodeImgCd);

			if (defaultList) {
				defaultList.classList.add("selected")
				input.value = defaultList.textContent;
			}

		}

    }


    /*-----------------------------*
     *  범례 ul > li tag 생성
     *-----------------------------*/
	function makeLiExampleList($ul, response) {
		let height = (response.TopoTypData.length * 32) + 'px';
		$ul.css({
			'width' :'200px',
			'height':height,
			'align-item':'center'
			});

		$ul.empty();

		$.each(response.TopoTypData, function(index, item) {
			let value = item.comCd;
			let text = item.comCdNm;
			let imgsrc = item.etcAttrVal1.replace("/transmission-web", "../..") + item.comCd + '.png';

			let $li = $('<li>', {
				'data-value': value,
				'data-icon' : imgsrc,
				css: {
					display: 'block',
					cursor : 'pointer',
					valign : 'middle'
				}
			});

			let $img = $('<img>', {
				src: imgsrc,
				alt: text,
				css: {
					width:  '20px'
				,	height: '20px'
				,	marginRight: '5px'
				,	valign: 'middle'
				}
			});

			let $text = $('<span>').text(text);
			$li.append($img).append($text);
			$ul.append($li);
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

	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
	}
});