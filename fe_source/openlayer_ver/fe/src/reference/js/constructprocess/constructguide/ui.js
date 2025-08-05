$(function(){
	// sitemap
	var timer;



//	$("#sitemap_wrap").mouseover(function(){ timerOff(); });
//	$("#sitemap_wrap").mouseout(function(){ timerOn(); });
//	$(".btn_all").mouseover(function(){ timerOff(); });
//	$(".btn_all").mouseout(function(){ timerOn(); });



	$(".btn_all").on( "click", function(event){
	  $(this).hasClass()
	  if ($(this).hasClass('on'))
	  {	  	
		  $(this).addClass('on');
		  $(this).removeClass('on');
	  } else {
		  $(this).removeClass('on');
		  $(this).addClass('on');
	//	 alert("aaa");
	  }
	
  });
	
  $(".targetLink").mouseover(function(){
	  $(this).addClass('on');
  })
   .mouseout(function(){
	  $(this).removeClass('on');
  });	

//   $( ".btn_all" ).click(function() {
//	  $( "#sitemap" ).toggle();
//	});




//	$(".menuT > span").bind("click", function(){
//		if(!$(this).hasClass("here")){
//			$(".menuT > span").removeClass("here");
//			$(this).addClass("here");
//		}
//	});



	// ui select
	var sel= $(".ui_select > ul");
	var timer3;

	function timerOn3(){
		timer3 = setInterval(function(){
			sel.hide();
			clearInterval(timer3);
		}, 300);
	}
	function timerOff3(){
		clearInterval(timer3);
	}

	$(".select_txt").click(function(){
		$(this).siblings("ul").show();
	});
	$(".select_txt").bind("mouseover", function(){ timerOff3(); });
	$(".select_txt").bind("mouseout", function(){ timerOn3(); });
	$(".ui_select > ul").bind("mouseover", function(){ timerOff3(); });
	$(".ui_select > ul").bind("mouseout", function(){ timerOn3(); });

//gnb

	var gnb = $("#gnb");
	var gnb1Deps = $("#gnb > ul > li");
	var gnb2Deps = $("#gnb > ul > li > ul > li");
	var gnb3Deps = $("#gnb > ul > li > ul > li > ul > li");
	var gnb4Deps = $("#gnb > ul > li > ul > li > ul > li > ul > li");


//1D
	$("#gnb > ul > li > a").click(function(){
		if ($(this).parent().hasClass('on')) {
			$("#gnb > ul > li").removeClass('on');
			gnb1Deps.find(" > ul").hide(); 
			$(this).parent().find(" > ul").hide();
		} else {
			gnb1Deps.removeClass('on');
			gnb1Deps.find(" > ul").hide(); 
			$(this).parent().addClass('on');
			$(this).parent().find(" > ul").show();
		}

	});

//2D
	gnb2Deps.click(function(){
		gnb2Deps.each(function(){
			gnb2Deps.removeClass("on");
			$(this).find(">ul").hide();
		});
		$(this).addClass("on");
		$(this).find("> ul").show();
	});
	
//3D
	gnb3Deps.click(function(){
		gnb3Deps.each(function(){
			gnb3Deps.removeClass("on2");
		});
		$(this).addClass("on2");
	});

//리셋함수
	function resetSitemap(){
		gnb1Deps.each(function(){
			$(this).find(">ul").hide();
		});
		gnb2Deps.removeClass("on");
	};	
//	resetsitemap();
	/* contact */
	//$('.mainMap .target').css({'opacity':'0'}).find('a').css({'margin-top':'0px'})
	$('.mainMap .target').each(function(idx){
		$(this).delay(idx*500).animate({'opacity':'1'})
		.find('a').delay(idx*500).animate({'margin-top':'10px'})
	});
	/*
	$('.mainMap .aLink a').mouseover(function(){
		$('.mainMap h3').hide();
		$(this).parents('li').addClass('on').removeClass('off')
		.siblings().removeClass('on').addClass('off');
		return false;
	}).hover(function(){
		$(this).parents('li').find('.target a').stop().animate({'margin-top':'0px'});
	},function(){
		$(this).parents('li').find('.target a').stop().animate({'margin-top':'10px'});
	});
	*/

});


