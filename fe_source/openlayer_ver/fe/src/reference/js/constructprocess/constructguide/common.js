$(function(){
	
	
	//������ div startBox ��ŭ �̺�Ʈ function �� �������ش�.
	for(var i=0; i<$("div > .starBox").length; i++){
		var id = "#set"+i;
		$(id+" > .starBox > ul").removeClass("star1 star2 star3 star4 star5");
		
		/*
		//���� Ŭ���� �̺�Ʈ ����
		$(id+" > .starBox > ul > li").on("click", function(event){
			//�θ� div id ��ȸ
			var input = "."+$(this).parent().parent().parent().find("input").attr("id")
			var div = "#"+$(this).parent().parent().parent().attr("id");
			var index = $(div+" > .starBox > ul > li").index(this);

			$(this).hasClass();
			
			//���� Ŭ���� ���� ǥ�� �̺�Ʈ
			if ($(this).hasClass('on')){	  	
				$(this).parent().removeClass("star1 star2 star3 star4 star5");
			} else {
				$(this).parent().removeClass("star1 star2 star3 star4 star5");
				$(this).parent().addClass("star" + index);
				
				//alert("���� " + index + "�� ����մϴ�.");
			}

			//$(div+" > .starBox > .starInfo").text("���� " + index + "���� ����ϼ̽��ϴ�.");
		});
		*/
	}
	
	
	//�˾� ���� Ŭ���� �̺�Ʈ
	$("#setPop > .starBoxPop > ul > li").on("click", function(event){
		var index = $("#setPop > .starBoxPop > ul > li").index(this);
		
		$(this).hasClass();
		
		//���� Ŭ���� ���� ǥ�� �̺�Ʈ
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

//�̹��� Ŭ���� �̹��� �˾� ȣ��
function fn_image_pop(Url){
	var width = 500;
	var height = 400;
	var top = (screen.height-height)/2;
	var left = (screen.width-width)/2;
	
	popup_check['image_pop'] = window.open("/nits/mtwp/common/comm_image_pop.jsp?ImageUrl="+Url, "image_pop", "top="+top+", left="+left+", width="+width+", height="+height+", scrollbars=no");
	popup_check['image_pop'].focus();
	
	//var ret = window.showModalDialog("/nits/mtwp/common/comm_image_pop.jsp?ImageUrl="+Url, "image_pop", "dialogWidth:500px; dialogHeight:400px; scrollbars:no;");
}

//���� Ŭ���� ���� ��� �˾� ȣ��
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

//���� ��� �˾� �ε�� �̺�Ʈ
function fn_Load_EvalPop(Star){
	$(".starBoxPop > ul").addClass("star" + Star);
}

//���� ��� �˾� �� ��ư Ŭ���� �̺�Ʈ
function fn_inseval(){
	//���� �Է� üũ
	if(document.getElementById("EvalScor").value == 0){
		alert("������ �Է��Ͽ� �ֽʽÿ�.");
		return;
	}
	
	var EvalRmk = document.eval.EvalRmk.value;
	var length = 0;

	//�Է°� ����Ʈ üũ
	for(var i=0; i<EvalRmk.length; i++){
		var check = escape(EvalRmk.charAt(i));
		
		//16������ ��ȯ���� �ʴ� Ư�������� ���
		if(check.length == 1){
			length++;
		
		//�ѱ��� ���
		}else if(check.indexOf("%u") != -1){
			length += 2;
		
		//�ѱ��̿��� ���
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
	
	//�Է°� üũ
	if(length >= 1500){
		alert("������ 500��(1000 byte) �̳��� �ۼ����ֽʽÿ�.");
		return;
	}
	
	document.eval.target = "inserteval";
	document.eval.action = "/nits/mtwp/common/insert_mtwp_eval.jsp";
	document.eval.submit();
}

//���� ��� �˾� �ݱ� ��ư Ŭ���� �̺�Ʈ
function fn_close(){
	/*
	if(confirm("����� ���򰡰� �Ұ����մϴ�.\n�����Ͻðڽ��ϱ�?") == false){
		return;
	}
	*/
	opener.location.reload();
	//window.returnValue = "OK";
	this.close();
}

//���� ��� �˾� X ��ư Ŭ���� �̺�Ʈ
function fn_Xclose(){
	opener.location.reload();		
	//window.returnValue = "OK";
}

