/**
 * VerificationRegistrationLineCompletionPhotoSkb.js
 *
 * @author Administrator
 * @date 2016. 7. 22. 오후 02:04:00
 * @version 1.0
 */

var m = {
			globalVar 	: {
							userId          :     parent.m.userInfo.userId     ,
							cstrCd          :     ""             ,
							skAfcoDivCd     :    parent.m.userInfo.skAfcoDivCd ,
							bpId            :    parent.m.userInfo.bpId,
							tmpCnt          :     0              ,
							lnVrfClCd       :     "A"            ,
							photoTotalCnt   :     0              , // 사진 총 갯수
							nowPhotoIndex   :     0              , // 현재 사진
							rotateCnt       :     0              , // 회전 횟수
							rotateDegree    :     0           	 , // 회전 각도
							fileCnt			:  	  0 			 , // 사진 일련번호 COUNT
							filePath        : "http://localhost:8080/tango-transmission-web/resources/images"
			  // /* TEST */ filePath        : "https://www.nits.skline.co.kr/nits/webdav?mode=get&path=/webdav/SMWORK/"	//파일 URL

						   },						   
			params    	: {},
			ajaxProp  	: [
				             {  // Search Category
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/verificationRegistrationLineCompletionPhotoSkb',
				            	data:"",
				            	flag:'searchCategory' // 0
				             },
				             {  // Search Photo List
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineCompletionPhotoPhotoInfoListSkb',
				            	data:"",
				            	flag:'searchPhotoList' // 1
				             },
				             {  // Search Opinion
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineCompletionPhotoOpinionSkb',
				            	data:"",
				            	flag:'searchOpinion' // 2
				             },
				             {  // Save Opinion
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/insertVerificationRegistrationLineCompletionPhotoOpinionSkb',
				            	data:"",
				            	flag:'saveOpinion' // 3
				             },
				             {  // BP사 의견 및 검증제외 조회 
					            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpCommentSkb',
					            	data:"",
					            	flag:'BpCommentChk' // 4
				             },
				             {  // 사진 DATA 조회
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getFileDataList',
				            	data:"",
				            	flag:'getPhotoDataList' // 5
				             }
			              ],
		responseData   : {},
	    message        : {},
	    label          : {},
	    error          : {},
	    userInfo       : {},
	    categoryData   : [],
	    photoInfoData  : [],   // 사진리스트 데이터
	    photoImgData   : []
	};

var tangoAjaxModel = Tango.ajax.init({});

var jsonData = "";

// 카테고리 데이터
var data = [];

var presentPhotoIndex = 0;       // 현재 사진 인덱스 정보;

var tangoAjax1 = Tango.ajax.init({
	url:"",
	data:{},
	flag:null
})

$a.page(function() {

	
	$("#VerificationRegistrationLineCompletionPhotoMain").css({'width':'90%','height':'550px'})
	$('#categoryArea').css({
						 'width':'200px'
						,'height':'390px'
						,'overflow-y':'scroll'
						    });
	$('#photoArea').css({
						 'width':$("#VerificationRegistrationLineCompletionPhotoMain").width()-$('#categoryArea').width()-20
						,'height':'390px'
					    });
	$('#PhotoArea').css({
						 'width':'80%'
						,'height':'390px'
						});
	$('#photoList').css({
						  'width':$('#photoArea').width()-$('#PhotoArea').width()-20
		  				 ,'height':'390px'
		  			   });
	
	$('.w555').css('width',$('.w555').parent('td').width()-10);

	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {   	
 
    	m.params.engstNo = param.engstNo
    	
    		m.globalVar.cstrCd = parent.$('#cstrCd').val();
    		    	
    	if(param.engstNo != null && param.engstNo != ""){
    		searchGrid(m.params, 'search');
    	}
	    	m.params.cstrCd = m.globalVar.cstrCd;
	        m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;    		
	        m.params.bpId   = m.globalVar.bpId;
	        setEventListener();
	        
	        parent.parent.$('body').progress();
	   		
	        callTangoAjax(0); // Search Category
	   		callTangoAjax(2); // Search Opinion
    };
    
    function setOpR(){
    	
		for(var i=0 ;i<7 ;i++){
			$('tbody').find('.Checkbox:eq('+i+')').parents('tr').find('.Textinput').setEnabled(true);
		}
    };
    
    // 이벤트 !!!!!!!!!!!!!
    function setEventListener() {    	
    	
    	 //양호, 불량 radio 클릭시 의견 활성, 비활성 셋팅
    	$('.cstrVrfRsltCd').on('change',function(){   
//    		setOpR();   
    		if($('.cstrVrfRsltCd').getValue() == "Y"){
    			$('.Checkbox').prop('checked',false); // 실제 체크박스
    			$('.ImageCheckbox').removeClass('Checked');  // 보여지는 체크이미지    	
    		}
    		
    		
    	});
    	
    	
//    	// 양호/불량 클릭시 텍스트 필드 생성
    	$('.Checkbox').on('change',function(e){
    		var chk = 0;
    		for(var i=0 ;i<7 ;i++){
	    		if($('tbody').find('.Checkbox:eq('+i+')').is(':checked') == true){
	    			chk ++;
	    		}
    		}
//    		console.log(chk);
    		if(chk > 0){
    			$(".cstrVrfRsltCd:eq(1)").setSelected();
    		}else{
    			$(".cstrVrfRsltCd:eq(0)").setSelected();
    		}
//    		console.log($('.cstrVrfRsltCd').getValue());
    		
    	});
    	 
    	 // 저장버튼 클릭시
     	 $('#VerificationRegistrationLineCompletionPhotoSaveBtn').on('click',function(){
     		 
     		if(m.globalVar.cstrCd == null || m.globalVar.cstrCd == ""){
     			return false;
     		}
     		
     		if($('.Radio').getValue() == null){
     			parent.callMsgBox('','I', parent.m.message.choiceVerificationResult); // 검증결과를 선택해주세요
     		}else{
     			 callTangoAjax(4);
     		}
     		 
     		
     	 });
    	 
     	// 카테고리 클릭시 
     	 $(".Tree").on('select',function(e, obj){
     		 
      		var isIE = null;
   		 
     		if(navigator.userAgent.search('Trident') != -1){
     				isIE = true;
	    	}else if(navigator.userAgent.search('Chrome') != -1){
	    			isIE = false;
	    	}
     		 	 
     		 if(isIE){ // ie
     			 window.clipboardData.setData('Text',obj.data.text);
     		 }else{ // chrome		 
     			 
     			/* 함체명 복사 */ 
     			$('#hidNm').val(obj.data.text);
     			document.getElementById('hidNm').select();
  				document.execCommand('copy');
     			      			 
     		 }
 			 
 			if(obj.data.level == "2"){
     			m.params.key = obj.data.key;
     			parent.parent.$('body').progress();
     			callTangoAjax(1); // Search Photo List
     		 }
     	 });
    	
     	// 그리드-사진리스트에서 '확대'클릭시 팝업 출력
 	  	$('#PhotoList').on('click','.photoBigSizeBtn', function(e,node){
		 
	    	parent.$a.popup({
	    		popid: 'LargePic' // 중복클릭방지 id 필요
	            ,title : m.label.expansionPicture //'확대사진'
	            ,url : '/tango-transmission-web/constructprocess/verification/VerificationRegistrationLineLargePic.do'
		            ,iframe: false
		            ,windowpopup: true
	            ,width : 800
	            ,height : 600
	            ,data : {'picUrl':this.id}
	    		,other: 'location=1'
	            ,callback : function(x){
	            				if(x=="ok"){
	            					location.reload(true);
	            				}
	            			}
	        });
 		});
     	
 	  	// 그리드-사진리스트에서 사진 클릭시 메인사진 변경
 	  	$('#PhotoList').on('click','.img_box', function(e,node){
 	  	
 	  		m.globalVar.nowPhotoIndex = $('#PhotoList').find(this).index();
 	  		// 메인사진 변경
	  		$('.Carousel').setIndex(m.globalVar.nowPhotoIndex);
 	  		
 		});  	

 	  	
 	  	// 카테고리 영역 tree 클릭시 높이, 너비 측정하여 카테고리영역 보다 크면 스크롤 생성
 	  	$('.Tree').on('click',function(e){

 	  	}); 
     	 
	}; // setEventListener() - 이벤트
	
    
    // 성공시
    function successFn(response, status, jqxhr, flag){
    	switch (flag) {
    	case 'searchCategory':
    		parent.parent.$('body').progress().remove();
			if(response.VerificationRegistrationLineCompletionPhotoCategoryList != null && 
		               response.VerificationRegistrationLineCompletionPhotoCategoryList != "" ){
			    		
				    		m.categoryData = response.VerificationRegistrationLineCompletionPhotoCategoryList;
				    		setTreeFormat();		    	
					    	$('.Tree').setDataSource(jsonData);		
			}
    		break;

    	case 'searchPhotoList':
    		console.log(response);
			if(response.VerificationRegistrationLineCompletionPhotoPhotoInfoList != null && 
		               response.VerificationRegistrationLineCompletionPhotoPhotoInfoList != "" ){
				m.photoInfoData = response.VerificationRegistrationLineCompletionPhotoPhotoInfoList
				m.globalVar.photoTotalCnt = m.photoInfoData.length;
				
				m.photoImgData = [];
				
					for(var i=0;i<m.photoInfoData.length;i++){
//						console.log("workPicFileUladSrno "+i+" : "+m.photoInfoData[i].workPicFileUladSrno);
						if(m.photoInfoData[i].workPicFileUladSrno != null && m.photoInfoData[i].workPicFileUladSrno != '' && m.photoInfoData[i].workPicFileUladSrno != undefined){
							m.photoImgData.push(m.photoInfoData[i].workPicFileUladSrno);
						}else{
							m.photoImgData.push("40000302"); // 테스트용 
						}
					}
//					console.log("사진 키 길이 : "+ m.photoImgData.length);
//					console.log(m.photoImgData);
					
					callTangoAjax(5); // 사진 데이터 조회
				}
    		break;
    	case 'searchOpinion':
			
    		// 권한별 설정은 추후에...
			
			if(response.VerificationRegistrationLineCompletionPhotoOpinion != null && 
			   response.VerificationRegistrationLineCompletionPhotoOpinion != "" ){
				
				
				$('tbody').setData(response.VerificationRegistrationLineCompletionPhotoOpinion);
				
				if( // parent.m.globalVar.bpYn == "Y" || // BP사 여부 체크 안함
				   parent.m.globalVar.vcYn == "N" ||
		    	   response.VerificationRegistrationLineCompletionPhotoOpinion.vrfObjYn == "N" ||  // Verification Target 
		    	   (response.VerificationRegistrationLineCompletionPhotoOpinion.vrfFnshDt != null && 
					response.VerificationRegistrationLineCompletionPhotoOpinion.vrfFnshDt != ""     ) // Verification Complete
					){
					$('.Radio'     ).setEnabled(false);
					$('.Checkbox').setEnabled(false);
					$('.Textinput' ).setEnabled(false);				
					$('#VerificationRegistrationLineCompletionPhotoSaveBtn').setEnabled(false);
				}else{
					$('.Radio'     ).setEnabled(true);
					$('.Checkbox').setEnabled(true);
					$('.Textinput' ).setEnabled(true);				
					$('#VerificationRegistrationLineCompletionPhotoSaveBtn').setEnabled(true);
					
					setOpR();
				}			
			}else{
				if(//parent.m.globalVar.bpYn == "Y" || // BP사 여부 체크 안함
				   parent.m.globalVar.vcYn == "N" || 
				   parent.m.globalVar.vrfObjYn == "N"|| 
				   (parent.m.globalVar.vrfFnshDt != null && parent.m.globalVar.vrfFnshDt != "")
				   ){
					$('.Radio'     ).setEnabled(false);
					$('.Checkbox').setEnabled(false);
					$('.Textinput' ).setEnabled(false);				
					$('#VerificationRegistrationLineCompletionPhotoSaveBtn').setEnabled(false);
				 }else{
					$('.Radio'     ).setEnabled(true);
					$('.Checkbox').setEnabled(true);
					$('.Textinput' ).setEnabled(true);				
					$('#VerificationRegistrationLineCompletionPhotoSaveBtn').setEnabled(true);
					
					setOpR();
				 }
				
			}

			break;
    		
    	case 'saveOpinion': 
//    		parent.parent.callMsgBox('','I', parent.m.message.savesuccess);
			div_msg_3.style.display = "";
			setTimeout("div_msg_3.style.display = 'none'", 1100);    		
			break;//
    	case 'BpCommentChk':
    		if(response.BpCommentInfo != null && response.BpCommentInfo != ""){
				if(parent.m.globalVar.vrfObjYn != response.BpCommentInfo.vrfObjYn){
					parent.parent.callMsgBox('BpCommentChk','W', "검증대상정보가 변경 되었습니다.",messageCallback);
				}else if(parent.m.globalVar.vrfFnshDt != response.BpCommentInfo.vrfFnshDt){
					parent.parent.callMsgBox('BpCommentChk','W', "검증완료정보가 변경 되었습니다.",messageCallback);
				}else{

		      		if($('.cstrVrfRsltCd').getValue() == null || $('.cstrVrfRsltCd').getValue() == ""){ parent.parent.callMsgBox("","W","검증결과를 선택해야합니다!"); return false; }
			      	
		      		if($('.cstrVrfRsltCd').getValue() == "N"){
		      			if( $('#picVrfRsltCdA').is(':checked') != true &&
		  					$('#picVrfRsltCdB').is(':checked') != true &&
		  					$('#picVrfRsltCdC').is(':checked') != true &&
		  					$('#picVrfRsltCdD').is(':checked') != true &&
		  					$('#picVrfRsltCdE').is(':checked') != true &&
		  					$('#picVrfRsltCdF').is(':checked') != true &&
		  					$('#picVrfRsltCdG').is(':checked') != true 
		      			   ){
		      				parent.parent.callMsgBox("","W","불량일 경우 반드시 항목 한 개 이상 체크 해야합니다."); return false;
		      			}else{
			      			if($('#picVrfRsltCdA').is(':checked') == true && $('#picVrfOpCttA').val() == ""){parent.parent.callMsgBox("","W","케이블 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
			      			if($('#picVrfRsltCdB').is(':checked') == true && $('#picVrfOpCttB').val() == ""){parent.parent.callMsgBox("","W","함체접속 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
			      			if($('#picVrfRsltCdC').is(':checked') == true && $('#picVrfOpCttC').val() == ""){parent.parent.callMsgBox("","W","분배함 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
			      			if($('#picVrfRsltCdD').is(':checked') == true && $('#picVrfOpCttD').val() == ""){parent.parent.callMsgBox("","W","전주건식 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
			      			if($('#picVrfRsltCdE').is(':checked') == true && $('#picVrfOpCttE').val() == ""){parent.parent.callMsgBox("","W","관로작업 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
			      			if($('#picVrfRsltCdF').is(':checked') == true && $('#picVrfOpCttF').val() == ""){parent.parent.callMsgBox("","W","인허가서류 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
			      			if($('#picVrfRsltCdG').is(':checked') == true && $('#picVrfOpCttG').val() == ""){parent.parent.callMsgBox("","W","기타 불량에 대한 의견은 반드시 입력해야합니다!"); return false; }
		      			}
		      		}
//		      		parent.parent.callMsgBox('save_btn','C', parent.m.message.save, messageCallback);
		      		messageCallback("save_btn", "Y");
				}
    		}else{
    			parent.parent.callMsgBox('BpCommentChk','W', "검증완료정보가 변경 되었습니다.",messageCallback);
    		}
    		 
    		break;
    	case 'getPhotoDataList':
    		parent.parent.$('body').progress().remove();
    		
    		if(response.photoDataList != undefined && response.photoDataList != null ){
    			m.photoImgData = response.photoDataList;
        		createPhoto();	
    		}	
    		
    		break;
    	}
    }
    
    // 실패시
    function failFn(response, status, jqxhr, flag){
    	
    	parent.parent.$('body').progress().remove();
    	
    	if(flag == 'getPhotoDataList'){
    		console.log(response);
        	parent.parent.callMsgBox('','W', "사진이 존재하지 않습니다.");	
    	}else{
        	parent.parent.callMsgBox('','W', response.message);
    	}
    	
    }

    // Setting Category List
    function setCategory(){

    	var flag = 'category';
        Tango.ajax({ url : 'tango-transmission-biz/transmisson/constructprocess/verification/verificationRegistrationLineCompletionPhotoSkb'
                   , data : m.params
                   , method : 'GET'
     	           , flag: flag
    	 })
    	 .done(function(response){successCallback(response, flag);})
    	 .fail(function(response){failCallback(response, flag);});

    }
    
    
    // Create Photo 
    function createPhoto(){
    	//m.photoImgData
    	setCarousel();  // Main Photo Carousel
    	setPhotoList(); // Photo Info List
    } // createPhoto()
    
    function setPhotoList(){

    	$('#PhotoList > div').remove();
    	
    	for(i=0;i<m.photoImgData.length;i++){
    		
    		$('#PhotoList').append(
    				 '<div id="'
					+ 'img_box'+i
					+ '" class="img_box" style="background-image:url(data:image/png;base64,'+m.photoImgData[i]+');background-repeat:no repeat;background-size:100% 100%">'
    				+'<button type="button" id="'
    				+ m.photoImgData[i]
    				+'" width="80" height="50" class="Button button2 Float-left photoBigSizeBtn" >'+parent.m.label.expansion+'</button>'
    				+'</div>'
    		); // $('#photoList').append()
    		
    		$a.convert($('#img_box'+i));
    		
    	}// for
    	
    	$('#photoList').css({
   		 'height'    : '100%'
   		,'overflow-x':'hidden'
   		,'overflow-y':'scroll'
    	});  	
    	
    	$('.img_box').css({
	         'width'     : '150px'
	        ,'height'    : '100px'	 
		    ,'margin-top': '0px'
			,'margin-bottom': '0px'
			,'padding-top' : '0px'
			,'padding-bottom' : '0px'	
		    	
    	});
    	
    	$('.photo_img').css({
    		'width'     : '100%'
    	   ,'height'    : '100%'
    	});
    	
    	$('.photoBigSizeBtn').css({
    		
   		    
    	})
    	
    	
    }
   
    
    // 데이터를 트리 컴포넌트형태로 변환
    function setTreeFormat(){

    	var subData = [];
    	var subData2 = [];
    	var x = 0
    	var cnt = 0;
    	
    	for (i = 0; i < m.categoryData.length; i++) {
    		
    		var tmp = {"parentId":"","selfId":"","selfNm":"","level":"","totalCategoryCnt":"","key":""};
    		
    		if(m.categoryData[i].level == "1"){
    			
    			tmp.parentId = ""; 
    			tmp.selfId = m.categoryData[i].selfId;
    			tmp.selfNm = m.categoryData[i].selfNm;
	    		tmp.level = m.categoryData[i].level;
	    		tmp.totalCategoryCnt = "0";
	    		tmp.key = "";
	    		
    			subData2.push(tmp);
	    		
	    		if(m.categoryData[i+1] == undefined || m.categoryData[i+1] == null || m.categoryData[i+1].level == "1" ){
	    			
	    			var subtmp = {"parentId":"","selfId":"","selfNm":"","level":"","totalCategoryCnt":"","key":""};
	    			
	    			subtmp.parentId = m.categoryData[i].selfId;; 
	    			subtmp.selfId = m.categoryData[i].selfId;
	    			subtmp.selfNm = m.categoryData[i].selfNm;
	    			subtmp.level = "2";
	    			subtmp.totalCategoryCnt = m.categoryData[i].totalCategoryCnt;
	    			subtmp.key = m.categoryData[i].key;
	    			
	    			subData2.push(subtmp);
	    			
	    		}
	    		
    		}else if(m.categoryData[i].level == "2"){
    			tmp.parentId = m.categoryData[i].parentId;; 
    			tmp.selfId = m.categoryData[i].selfId;
    			tmp.selfNm = m.categoryData[i].selfNm;
	    		tmp.level = m.categoryData[i].level;
	    		tmp.totalCategoryCnt = m.categoryData[i].totalCategoryCnt;
	    		tmp.key = m.categoryData[i].key;	    		
	    		
	    		subData2.push(tmp);
    		}
    		
    	} // for (i = 0; i < m.categoryData.length; i++)
   	
    	m.categoryData = [];
    	m.categoryData = subData2;
    	
    	for (i = x; i < m.categoryData.length; i++) {
    		if(m.categoryData[i] != null){
    		    if(m.categoryData[i].level == '1'){

    	    		m.categoryData[i].id = m.categoryData[i].selfId;
    	    		m.categoryData[i].text = m.categoryData[i].selfNm;
    	    		m.categoryData[i].iconUrl = '';
    	    		
    	    		var tmp1 = m.categoryData[i];
    		    		subData.push(tmp1);
    		    		
    		    		cnt += 1;
    		    		
    		    		var subArray = [];
    		    	for(j=i;j<m.categoryData.length; j++) {
    		    		
    		    			if(m.categoryData[i].selfId == m.categoryData[j].parentId){
    		    				
    				    		m.categoryData[j].id = m.categoryData[j].selfId;
    				    		m.categoryData[j].text = m.categoryData[j].selfNm;
    				    		m.categoryData[j].iconUrl = '';
    				    		
    				    		var tmp2 = m.categoryData[j]
    				    		subArray.push(tmp2);	
    		    				
    				    		subData[cnt-1].items = subArray;
    		    			}
    		    	} //for(j=i;j<m.categoryData.length; j++)
    		    }
    		}
    	}	
    	jsonData = JSON.parse((JSON.stringify(subData)));	
    }// setTreeFormat()

    // 슬라이드쇼 셋팅
    function setCarousel(){

    	$('#PhotoArea > div').remove();
    	
    	$('#PhotoArea').append(
    			 '<div id="MainPhotoArea" class="Carousel" data-autoSlidemode="false">'
    			+'<div id="MainPhotoScroller" class="Scroller">'
    			+'</div>'
    			+'<a class="Prev"></a>'
    			+'<a class="Next"></a>'
    			+'<div id="MainPhotoPaging" class="Paging Mobile">'
    			+'</div>'
    			+'</div>'
    	);
    		
    	for(i=0 ; i<m.photoImgData.length; i++ ){
        	$('#MainPhotoScroller').append(
				 '<div class="Page">'
				+'<img style="width:100%; height:100%;" src="data:image/png;base64,'
				+m.photoImgData[i]
				+'"/>'
				+'</div>'
        	);
    	} // for
    	
    	for(i=1 ; i<=m.photoImgData.length; i++ ){
        	$('#MainPhotoPaging').append(
				 '<a class="Link" >'
				+i
				+'</a>'
        	);
    	} // for  

    	$('.Carousel').css({ 'margin':'auto','width':'600px','height':$('#PhotoArea').height()});
    	
    	$a.convert($('#PhotoArea')); // 'Carousel' 부모 컨버트~~~
    	
    }// setCarousel
    
    // AJAX GET, POST, PUT
    function callTangoAjax(i){
    	var url = m.ajaxProp[i].url;
    	
    	if(i==2){
    		m.ajaxProp[i].url = url+'/'+m.globalVar.cstrCd+'/'+m.globalVar.lnVrfClCd;
    	}else if(i==3||i==4){
    		m.ajaxProp[i].url = url+'/'+m.globalVar.cstrCd;
    	}else if(i==5){
    		m.ajaxProp[i].url = url+'/'+m.photoImgData;
    	}
    	
    	m.ajaxProp[i].data = m.params;
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Cbnt Grid
    	else if(i == 1){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Ofd Grid
    	else if(i == 2){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // Search Opinion
    	else if(i == 3){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn); } // Search Opinion
    	else if(i == 4){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // BpCommentChk
    	else if(i == 5){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // getPhotoData
    	     
    	m.ajaxProp[i].url = url;    	     
    	     
    } // callTangoAjax()
    
	function messageCallback(msgId, msgRst){
		
		
		switch (msgId) {

		case 'save_btn':
			if(msgRst == 'Y'){
				
				m.params = $('tbody').getData();
	     		 
	      		m.params.cstrCd = m.globalVar.cstrCd;
	      		m.params.lnVrfClCd = m.globalVar.lnVrfClCd;
	      		m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
	      		m.params.lastChgUserId = m.globalVar.userId; // 사용자 ID
	      		
	      		if($('#picVrfRsltCdA').is(':checked') == true){m.params.picVrfRsltCdA = '1';}else{m.params.picVrfRsltCdA = '0';}
	      		if($('#picVrfRsltCdB').is(':checked') == true){m.params.picVrfRsltCdB = '1';}else{m.params.picVrfRsltCdB = '0';}
	      		if($('#picVrfRsltCdC').is(':checked') == true){m.params.picVrfRsltCdC = '1';}else{m.params.picVrfRsltCdC = '0';}
	      		if($('#picVrfRsltCdD').is(':checked') == true){m.params.picVrfRsltCdD = '1';}else{m.params.picVrfRsltCdD = '0';}
	      		if($('#picVrfRsltCdE').is(':checked') == true){m.params.picVrfRsltCdE = '1';}else{m.params.picVrfRsltCdE = '0';}
	      		if($('#picVrfRsltCdF').is(':checked') == true){m.params.picVrfRsltCdF = '1';}else{m.params.picVrfRsltCdF = '0';}
	      		if($('#picVrfRsltCdG').is(':checked') == true){m.params.picVrfRsltCdG = '1';}else{m.params.picVrfRsltCdG = '0';}
	      		
	      		callTangoAjax(3); // Save Opinion
				
			}
			break;
		case "BpCommentChk":
			if(msgRst == "Y"){
				parent.location.reload(true);
			}
			break;
		}
	};    
    
});