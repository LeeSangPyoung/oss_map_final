$(function(){
	
	
	//생성된 div startBox 만큼 이벤트 function 을 생성해준다.
	for(var i=0; i<$("div > .starBox").length; i++){
		var id = "#set"+i;
		$(id+" > .starBox > ul").removeClass("star1 star2 star3 star4 star5");
		
		/*
		//별점 클릭시 이벤트 생성
		$(id+" > .starBox > ul > li").on("click", function(event){
			//부모 div id 조회
			var input = "."+$(this).parent().parent().parent().find("input").attr("id")
			var div = "#"+$(this).parent().parent().parent().attr("id");
			var index = $(div+" > .starBox > ul > li").index(this);

			$(this).hasClass();
			
			//별점 클릭시 색깔 표시 이벤트
			if ($(this).hasClass('on')){	  	
				$(this).parent().removeClass("star1 star2 star3 star4 star5");
			} else {
				$(this).parent().removeClass("star1 star2 star3 star4 star5");
				$(this).parent().addClass("star" + index);
				
				//alert("평점 " + index + "점 등록합니다.");
			}

			//$(div+" > .starBox > .starInfo").text("평점 " + index + "점을 등록하셨습니다.");
		});
		*/
	}
	
	
	//팝업 별점 클릭시 이벤트
	$("#setPop > .starBoxPop > ul > li").on("click", function(event){
		var index = $("#setPop > .starBoxPop > ul > li").index(this);
		
		$(this).hasClass();
		
		//별점 클릭시 색깔 표시 이벤트
		if ($(this).hasClass('on')){	  	
			$(this).parent().removeClass("star1 star2 star3 star4 star5");
		} else {
			$(this).parent().removeClass("star1 star2 star3 star4 star5");
			$(this).parent().addClass("star" + index);
			
			document.getElementById("EvalScor").value = index;
		}
	});
});

var popup_check = [];

//이미지 클릭시 이미지 팝업 호출
function fn_image_pop(Url){
	var width = 500;
	var height = 400;
	var top = (screen.height-height)/2;
	var left = (screen.width-width)/2;
	
	popup_check['image_pop'] = window.open("/nits/mtwp/common/comm_image_pop.jsp?ImageUrl="+Url, "image_pop", "top="+top+", left="+left+", width="+width+", height="+height+", scrollbars=no");
	popup_check['image_pop'].focus();
	
	//var ret = window.showModalDialog("/nits/mtwp/common/comm_image_pop.jsp?ImageUrl="+Url, "image_pop", "dialogWidth:500px; dialogHeight:400px; scrollbars:no;");
}

//별점 클릭시 별점 등록 팝업 호출
function fn_eval_pop(mtwp_pgm_id, mtwp_cd, mtwp_nm, eval_scor){
	
	var width = 500;
	var height = 320;
	var top = (screen.height-height)/2;
	var left = (screen.width-width)/2;
	
	popup_check['eval_pop'] = window.open("/nits/mtwp/common/comm_mtwp_eval_pop.jsp?MtwpPgmId="+mtwp_pgm_id+"&MtwpCd="+mtwp_cd+"&MtwpNm="+mtwp_nm+"&EvalScor="+eval_scor, "eval_pop", "top="+top+", left="+left+", width="+width+", height="+height+", scrollbars=no");
	popup_check['eval_pop'].focus();
	
	//var ret = window.showModalDialog("/nits/mtwp/common/comm_mtwp_eval_pop.jsp?MtwpPgmId="+mtwp_pgm_id+"&MtwpCd="+mtwp_cd+"&MtwpNm="+mtwp_nm+"&EvalScor="+eval_scor, "eval_pop", "dialogWidth:500px; dialogHeight:320px; scrollbars:no;");
	
	//if(ret == "OK"){
	//	window.location.reload();
	//}
}

//별점 등록 팝업 로드시 이벤트
function fn_Load_EvalPop(Star){
	$(".starBoxPop > ul").addClass("star" + Star);
}

//별점 등록 팝업 평가 버튼 클릭시 이벤트
function fn_inseval(){
	//평점 입력 체크
	if(document.getElementById("EvalScor").value == 0){
		alert("평점을 입력하여 주십시요.");
		return;
	}
	
	var EvalRmk = document.eval.EvalRmk.value;
	var length = 0;

	//입력값 바이트 체크
	for(var i=0; i<EvalRmk.length; i++){
		var check = escape(EvalRmk.charAt(i));
		
		//16진수로 변환되지 않는 특수문자일 경우
		if(check.length == 1){
			length++;
		
		//한글인 경우
		}else if(check.indexOf("%u") != -1){
			length += 2;
		
		//한글이외인 경우
		}else if(check.indexOf("%") != -1){
			length += check.length/3;
		}
		
		/*
		if(escape(byte).length > 4){
			length += 2;
		}else{
			length += 1;
		}
		*/
	}
	
	//입력값 체크
	if(length >= 1500){
		alert("내용은 500자(1000 byte) 이내로 작성해주십시요.");
		return;
	}
	
	document.eval.target = "inserteval";
	document.eval.action = "/nits/mtwp/common/insert_mtwp_eval.jsp";
	document.eval.submit();
}

//별점 등록 팝업 닫기 버튼 클릭시 이벤트
function fn_close(){
	/*
	if(confirm("제출시 재평가가 불가능합니다.\n제출하시겠습니까?") == false){
		return;
	}
	*/
	opener.location.reload();
	//window.returnValue = "OK";
	this.close();
}

//별점 등록 팝업 X 버튼 클릭시 이벤트
function fn_Xclose(){
	opener.location.reload();		
	//window.returnValue = "OK";
}

