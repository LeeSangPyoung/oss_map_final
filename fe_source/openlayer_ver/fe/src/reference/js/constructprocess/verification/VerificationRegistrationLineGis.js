/**
 * VerificationRegistrationLineGis.js
 *
 * @author Administrator
 * @date 2016. 7. 22. 오후 02:04:00
 * @version 1.0
 */

var m = {
		
		ajaxProp : [
						{  // BP사 의견 및 검증제외 조회 
						   	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpComment',
						   	data:"",
						   	flag:'BpCommentChk' // 0
						},
			             {  // 사진 DATA 조회
			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getFileDataList',
			            	data:"",
			            	flag:'getPhotoDataList' // 1
			             }
		            ],
		message        : {},
		label          : {},
		error          : {},
	    userInfo       : {},
	    photoImgData   : []
	    
}

var tangoAjaxModel = Tango.ajax.init({});


var userId = parent.m.userInfo.userId;
var skAfcoDivCd = parent.m.userInfo.skAfcoDivCd;
var bpId = parent.m.userInfo.bpId;
var params = {'engstNo':'0'};
var cstrCd = "";
var lnVrfClCd = "C"; //선로검증분류코드 GIS

var cstrVrfRsltCd = ""; // 선로공사검증결과

var rsltCdR1 = "";
var rsltCdR2 = "";
var rsltCdR3 = "";
var rsltCdR4 = "";
var rsltCdR5 = "";

var OpR1 = "";
var OpR2 = "";
var OpR3 = "";
var OpR4 = "";
var OpR5 = "";
var vrfOponCtt = ""; // 검증의견내용
var exemptionStatus = 'N'; // 검증등록 제외 여부
var jsonData = "";

// 카테고리 데이터
var data = [];

// 사진리스트 데이터
var photoInfoData = [];

// 테스트=====================================================
var filePath = 'http://localhost:8080/tango-transmission-web/resources/images';
//var filePath = "https://www.nits.skline.co.kr/nits/webdav?mode=get&path=/webdav/SMWORK/";	//파일 URL
var photoTotalCnt = 0; 																					//사진총갯수

var presentPhotoIndex = 0;       // 현재 사진 인덱스 정보;

var pw = 0; // 확대사진 가로
var ph = 0; // 확대사진 세로

var c = 0; //카운트 초기화  


$a.page(function() {
	

	$("#VerificationRegistrationLineGisMain").css({'width':'90%','height':'550px'})

	$('#GisCategoryArea').css({
		 					 'width':'200px'
		 				    ,'height':'390px'
		 				    ,'overflow-y':'scroll'
//		 				    	,'background-color':'blue'
								});
	$('#GisPhotoArea').css({
						 'width':$("#VerificationRegistrationLineGisMain").width()-$('#GisCategoryArea').width()-20
							,'height':'390px'
//								,'background-color':'green'
						    });
	
	
	
	$('#PhotoArea').css({
					 'width':'80%'
					,'height':'390px'
//					,'background-color':'yellow'
					});
	$('#photoList').css({
						  'width':$('#GisPhotoArea').width()-$('#PhotoArea').width()-20
		  				 ,'height':'390px'
		  			   });

	
	$('#GisBeforeAfterBtnArea').css('text-align','center');
	
	$('.w555').css('width',$('.w555').parent('td').width()-10);

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {   	
 
    	params.engstNo = param.engstNo
  
    		cstrCd = parent.$('#cstrCd').val();


	    	if(params.engstNo != null && params.engstNo != ""){
	    		searchGrid(params, 'search');
	    	}
	    	
     		params.cstrCd = cstrCd;
     		params.lnVrfClCd = lnVrfClCd; //선로검증분류코드 GIS
     		
     		params.lastChgUserId = userId;
        	params.skAfcoDivCd = skAfcoDivCd;
        	params.bpId = bpId;
        	
	    	
	    		
	   		setEventListener();
	   		
	   		parent.parent.$('body').progress();
	   		setCategory();
	   		searchOpinion();

    };
    
    
    
  //Grid 초기화
    function initGrid() {

    	// 그리드 데이터 삭제
        $('#GisPhotoList').alopexGrid('dataEmpty'); 
    	
        // 그리드 생성
    	AlopexGrid.define('defineDataGridGis', {
    		autoColumnIndex: true,
    		autoResize: false,
    		width: 200,
    		height: 500,
    		filteringHeader: false,
    		defaultColumnMapping:{
    			sorting: false
			},
		    rowOption:{
		    	defaultHeight:100
		    },
			columnMapping : [
			                 { key : 'imgInfo',
			                   render : function(value, data, render, mapping){
			                	   	return '<button type="button" id="'+value+'" width="80" height="50" class="Float-left gisPhotoBigSizeBtn" >'+m.label.expansion+'</button><img class="Float-right miniPhotoGis" id="'+value+'" width="100" height="80" src="'+value+'" ></img>'
			                	   }
			                   
			                 }					                	 
			],
			data:photoInfoData
		    
    	});
    	
    	
    	
        //그리드 생성
        $('#GisPhotoList').alopexGrid({
        	extend : ['defineDataGridGis']
        });
    	
        $('#GisPhotoList').convert($('button'));
        $('#GisPhotoList > button').css('z-index','-1');
        
    	$('#GisPhotoList').alopexGrid('updateOption',
    		{header:false,paging:''}
    	);
    	
    	
    	// 사진리스트 출력후 메인사진 출력
    	presentPhotoIndex = 0;
//    	setMainPhoto(presentPhotoIndex);
    	
    	
    	
//    	$('.miniPhoto').css('padding','25px 0');
    	$('.gisPhotoBigSizeBtn').css('top','30px');
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }    
    
    
    function validateChk(){    	
    	
 		if(rsltCdR1 == null || rsltCdR1 == ""){ parent.parent.callMsgBox('','I', m.message.choiceCableStandardVerificationResult );  return false; } /* 케이블규격 검증결과를 선택해주세요. */ 		
 		if(rsltCdR1 == "N" & (OpR1 == null || OpR1 == "")){ parent.parent.callMsgBox('','I', m.message.writeCableStandardVerificationResultOpinion );  return false; } /* 케이블규격 검증결과의견을 작성해주세요. */
 		
 		if(rsltCdR2 == null || rsltCdR2 == ""){ parent.parent.callMsgBox('','I', m.message.choiceManufactureNumberVerificationResult );  return false; } /* 제조번호 검증결과를 선택해주세요. */
 		if(rsltCdR2 == "N" & (OpR2 == null || OpR2 == "")){ parent.parent.callMsgBox('','I', m.message.writeManufactureNumberVerificationResultOpinion );  return false; } /* 제조번호 검증결과의견을 작성해주세요. */
 		
 		if(rsltCdR3 == null || rsltCdR3 == ""){ parent.parent.callMsgBox('','I', m.message.choiceConnectionInformationVerificationResult );  return false; } /* 접속정보 검증결과를 선택해주세요. */
 		if(rsltCdR3 == "N" & (OpR3 == null || OpR3 == "")){ parent.parent.callMsgBox('','I', m.message.writeConnectionInformationVerificationResultOpinion );  return false; } /* 접속정보 검증결과의견을 작성해주세요. */
 		
 		if(rsltCdR4 == null || rsltCdR4 == ""){ parent.parent.callMsgBox('','I', m.message.choiceAcceptCableCountVerificationResult );  return false; } /* 수용조수 검증결과를 선택해주세요. */
 		if(rsltCdR4 == "N" & (OpR4 == null || OpR4 == "")){ parent.parent.callMsgBox('','I', m.message.writeAcceptCableCountVerificationResultOpinion );  return false; } /* 수용조수 검증결과의견을 작성해주세요. */
 		
 		if(rsltCdR5 == null || rsltCdR5 == ""){ parent.parent.callMsgBox('','I', m.message.choiceBasicDataBaseVerificationResult );  return false; } /* 기초DB 검증결과를 선택해주세요. */
 		if(rsltCdR5 == "N" & (OpR5 == null || OpR5 == "")){ parent.parent.callMsgBox('','I', m.message.writeBasicDataBaseVerificationResultOpinion );  return false; } /* 기초DB 검증결과의견을 작성해주세요. */
 		
    	return true;
    }
    
    
    
    // 이벤트 !!!!!!!!!!!!!
    function setEventListener() {    	
	  	var main_photo_cnt = 0;
	  	
	  	
	  	$('.gisTextinput').setEnabled(true);  // true
    	 
    	 // 저장버튼 클릭시
     	 $('#VerificationRegistrationLineGisSaveBtn').on('click',function(){
     		 
     		if(cstrCd == null || cstrCd == ""){
     			return false;
     		}
     		
     		if($('.Radio').getValue() == null){
     			parent.parent.callMsgBox('','I', parent.m.message.choiceVerificationResult); // 검증결과를 선택해주세요
     		}else{
     			callTangoAjax(0);
     		}
     		 
     		
     	 });
    	 
     	// 카테고리 클릭시 
     	 $(".GisTree").on('select',function(e, node){	
     		 
     		 
     		var isIE = null;
    		 
     		if(navigator.userAgent.search('Trident') != -1){
     				isIE = true;
	    	}else if(navigator.userAgent.search('Chrome') != -1){
	    			isIE = false;
	    	}
     		 	 
     		 if(isIE){ // ie
     			 window.clipboardData.setData('Text',node.data.text);
     		 }else{ // chrome		 
     			 
     			/* 함체명 복사 */ 
     			$('#hidNm').val(node.data.text);
     			document.getElementById('hidNm').select();
  				document.execCommand('copy');
     			      			 
     		 }
     		 
     		
     		 
     		 if(node.data.level == "2"){     			 
     			 params.key = node.data.key;
     	   		 parent.parent.$('body').progress(); 
     			 setPhotoInfo(params); 
     		 }  	
     	 });

     	 
     	 
     	 
     	 
     	 // 그리드-사진리스트에서 사진 클릭시 메인사진 변경
 	  	$('#PhotoList').on('click','.img_box', function(e,node){
 	  	
 	  		// 메인사진 변경
	  		$('.Carousel').setIndex($('#PhotoList').find(this).index());
 	  		
 		});  	

 	  	
     	 
 	  	// 카테고리 영역 tree 클릭시 높이, 너비 측정하여 카테고리영역 보다 크면 스크롤 생성
// 	  	$('.GisTree').on('click',function(e){ 	  		
// 	  		if(( $(this).height() - $("#GisCategoryArea").height() ) > 0){
// 	  			$('#GisCategoryArea').css('overflow-y','scroll');
// 	  		}else{
// 	  			$('#GisCategoryArea').css('overflow-y','');
// 	  		}
// 	  		
// 	  		if(( $(this).width() - $("#GisCategoryArea").width() ) > 0){
// 	  			$('#GisCategoryArea').css('overflow-x','scroll');
// 	  		}else{
// 	  			$('#GisCategoryArea').css('overflow-x','');
// 	  		}
// 	  	});
 	  		
     	// 그리드-사진리스트에서 '확대'클릭시 팝업 출력
 	  	$('#PhotoList').on('click','.photoBigSizeBtn', function(e,node){
		 
	    	parent.$a.popup({
	    		popid: 'LargePic' // 중복클릭방지 id 필요
	            ,title : m.label.expansionPicture // '확대사진'
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
	}; // setEventListener() - 이벤트
	
	//request 성공시
	var successCallback = function(response, flag){
		switch (flag) {
		case 'opinionMerge':
			div_msg_2.style.display = "";
			setTimeout("div_msg_2.style.display = 'none'", 1100);
			break;
		case 'searchOpinion':

			if(response.VerificationRegistrationLineGisOpinion != null && 
			   response.VerificationRegistrationLineGisOpinion != "" ){

				var vrfFnshDt = response.VerificationRegistrationLineGisOpinion.vrfFnshDt;
				var vrfObjYn = response.VerificationRegistrationLineGisOpinion.vrfObjYn;
				
				 $('tbody').setData(response.VerificationRegistrationLineGisOpinion);
				
				 if( // parent.m.globalVar.bpYn == "Y" || //BP사 여부 체크 안함
				     parent.m.globalVar.vcYn == "N" || 
				     vrfObjYn == "N" || 
				     (vrfFnshDt != null && vrfFnshDt != "")
				     ){ 
						$('.gisRadio').setEnabled(false);
						$('.gisTextinput').setEnabled(false);
						$('#VerificationRegistrationLineGisSaveBtn').setEnabled(false);
				 }else{
					 $('.gisRadio').setEnabled(true);
					 $('.gisTextinput').setEnabled(true);
					 $('#VerificationRegistrationLineGisSaveBtn').setEnabled(true);
//						setReadonly();
				 }	
			}else{
				if( // parent.m.globalVar.bpYn == "Y" || //BP사 여부 체크 안함
				   parent.m.globalVar.vcYn == "N" || 
				   parent.m.globalVar.vrfObjYn == "N"|| 
				   (parent.m.globalVar.vrfFnshDt != null && parent.m.globalVar.vrfFnshDt != "")
				   ){
						$('.gisRadio').setEnabled(false);
						$('.gisTextinput').setEnabled(false);
						$('#VerificationRegistrationLineGisSaveBtn').setEnabled(false);
				 }else{
					 $('.gisRadio').setEnabled(true);
					 $('.gisTextinput').setEnabled(true);
					 $('#VerificationRegistrationLineGisSaveBtn').setEnabled(true);
//						setReadonly();
				 }	
			}
			break;
			// 뷰트리 생성		
		case 'category':
	   		parent.parent.$('body').progress().remove();
			if(response.VerificationRegistrationLineGisCategoryList != null && 
               response.VerificationRegistrationLineGisCategoryList != "" ){
		    		data = response.VerificationRegistrationLineGisCategoryList;
			    	setTreeFormat();
			    	$('.GisTree').setDataSource(jsonData);
			}
			break;
		case 'photoInfo':
			if(response.VerificationRegistrationLineGisPhotoInfoList != null && 
               response.VerificationRegistrationLineGisPhotoInfoList != "" ){
				photoInfoData = response.VerificationRegistrationLineGisPhotoInfoList;
				photoTotalCnt = photoInfoData.length;	
				
				m.photoImgData = [];
				
				for(var i=0;i<photoInfoData.length;i++){
//					console.log("workPicFileUladSrno "+i+" : "+photoInfoData[i].workPicFileUladSrno);
					if(photoInfoData[i].workPicFileUladSrno != null && photoInfoData[i].workPicFileUladSrno != '' && photoInfoData[i].workPicFileUladSrno != undefined){						
						m.photoImgData.push(photoInfoData[i].workPicFileUladSrno);
					}else{
						m.photoImgData.push("40000302"); // 테스트용 
					}
				}
				
//				console.log("사진 키 길이 : "+ m.photoImgData.length);
//				console.log(m.photoImgData);
				
				callTangoAjax(1); // 사진 데이터 조회
			}
			break;
		}
    }
    
	//request 성공시
	function successFn(response, status, jqxhr, flag){
		console.log("flag : "+ flag);
		switch (flag) {

		case 'BpCommentChk': 
    		if(response.BpCommentInfo != null && response.BpCommentInfo != ""){
				if(parent.m.globalVar.vrfObjYn != response.BpCommentInfo.vrfObjYn){
					parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationTargetInfomation,messageCallback); // 검증대상정보가 변경 되었습니다.
				}else if(parent.m.globalVar.vrfFnshDt != response.BpCommentInfo.vrfFnshDt){
					parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationCompletionInfomation,messageCallback); // 검증완료정보가 변경 되었습니다.
				}else{

		     		rsltCdR1 = $('.gisRsltCdR1').getValue();
		     		rsltCdR2 = $('.gisRsltCdR2').getValue();
		     		rsltCdR3 = $('.gisRsltCdR3').getValue();
		     		rsltCdR4 = $('.gisRsltCdR4').getValue();
		     		rsltCdR5 = $('.gisRsltCdR5').getValue();
		     		
		     		OpR1 = $('#GisOpR1').val();
		     		OpR2 = $('#GisOpR2').val();
		     		OpR3 = $('#GisOpR3').val();
		     		OpR4 = $('#GisOpR4').val();
		     		OpR5 = $('#GisOpR5').val();
		     		
		     		var chk = validateChk();
		     		
		     		if(chk){}else{ return false; }
		     		
		     		
		     		params = $('tbody').getData();
		     		params.cstrCd = cstrCd;
		     		params.lnVrfClCd = lnVrfClCd; //선로검증분류코드 GIS
		     		
		     		params.lastChgUserId = userId;
		        	params.skAfcoDivCd = skAfcoDivCd;
		        	params.bpId = bpId;
		        	
		     		if(	params.cblStrdVrfRsltCd    == 'Y' &&
		     			params.mnftNoVrfRsltCd     == 'Y' &&
		     			params.lnoVrfRsltCd        == 'Y' &&
		     			params.acptCbcntVrfRsltCd  == 'Y' &&
		     			params.dbVrfRsltCd         == 'Y' 
		         		){
		         			params.cstrVrfRsltCd = 'Y';
		         		}else{
		             		params.cstrVrfRsltCd = 'N';
		         		}
		     		
		     		//parent.parent.callMsgBox("save", "C", m.message.save, messageCallback)
		     		messageCallback("save", "Y");
				}
    		}else{
    			parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationCompletionInfomation,messageCallback); // 검증완료정보가 변경 되었습니다.
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
	
    //request 실패시.
    var failCallback = function (response, flag){
    	
    	parent.parent.$('body').progress().remove();
    	
    	if(flag == 'getPhotoDataList'){
    		console.log(response);
        	parent.parent.callMsgBox('','W', "사진이 존재하지 않습니다.");	
    	}else{
        	parent.parent.callMsgBox('','W', response.message);
    	}
    	
    	
    	
//    	switch (flag) {
//		case 'opinionMerge':
//			parent.parent.callMsgBox('','W', parent.m.message.saveFail);
//			break;
//		case 'searchOpinion':
//			parent.parent.callMsgBox('','W', parent.m.message.searchFail);
//			break;	
//		case 'photoInfo':
//			parent.parent.callMsgBox('','W', parent.m.message.searchFail);
//			break;
//		case 'category':
//			parent.parent.callMsgBox('','W', parent.m.message.searchFail);
//			break;   
//		}
    }
    
	function failFn(response, status, jqxhr, flag){
    	
    	switch (flag) {
		case 'BpCommentChk': 
			parent.parent.callMsgBox('','W', parent.m.message.searchFail);
    		break;    
		}
    }
    
    //그리드 데이터 조회
    
    function setCategory(){
    	
    	
    	var flag = 'category';
        Tango.ajax({ url : 'tango-transmission-biz/transmission/constructprocess/verification/verificationRegistrationLineGis'
                   , data : params
                   , method : 'GET'
     	           , flag: flag
    	 })
    	 .done(function(response){successCallback(response, flag);})
    	 .fail(function(response){failCallback(response, flag);});

    }
    
    // 작업사진 생성
    function createPhoto(){
    	
//    	for(i=0;i<photoTotalCnt;i++){
//    		photoInfoData[i].imgInfo = filePath+photoInfoData[i].workPicFilePathNm+'/'+photoInfoData[i].workPicFileNm;
//    	} // for
    	
    	// Carousel 슬라이드쇼
    	 setCarousel();
    	//--------------------
    	 setPhotoList(); // Photo Info List
//    	initGrid();
    	
    } // createPhoto()

    function setPhotoList(){

    	$('#PhotoList > div').remove();
    	
    	for(i=0;i<photoInfoData.length;i++){
    		
    		$('#PhotoList').append(
    				 '<div id="'
					+ 'img_box'+i
					+ '" class="img_box" style="background-image:url(data:image/png;base64,'+m.photoImgData[i]+');background-repeat:no repeat;background-size:100% 100%">'
    				+'<button type="button" id="'
    				+m.photoImgData[i]
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
    	});
    } // setPhotoList
    
    
    // 사진정보 조회
    function setPhotoInfo(params){
    	var flag = 'photoInfo';
        Tango.ajax({ url : 'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineGisPhotoInfoList'
                   , data : params
                   , method : 'GET'
     	           , flag: flag
    	 })
    	 .done(function(response){successCallback(response, flag);})
    	 .fail(function(response){failCallback(response, flag);});
    }// 사진정보 조회
    

    
    // 검증의견, 검증완료일자 조회
    function searchOpinion(){
    	
 		params.cstrCd = cstrCd;
 		params.lnVrfClCd = lnVrfClCd;
    	
    	var flag = 'searchOpinion';
        Tango.ajax({ url : 'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineGisOpinion/'+params.cstrCd+'/'+params.lnVrfClCd
                   , data : params
                   , method : 'GET'
     	           , flag: flag
    	 })
    	 .done(function(response){successCallback(response, flag);})
    	 .fail(function(response){failCallback(response, flag);});
    }// 검증의견 조회
  

    // 데이터를 트리 컴포넌트형태로 변환
       function setTreeFormat(){

       	var subData = [];
       	var subData2 = [];
       	var x = 0
       	var cnt = 0;
       	
       	for (i = 0; i < data.length; i++) {
       		
       		var tmp = {"parentId":"","selfId":"","selfNm":"","level":"","totalCategoryCnt":"","key":""};
    		
       		if(data[i].level == "1"){
       			
       			tmp.parentId = ""; 
       			tmp.selfId = data[i].selfId;
       			tmp.selfNm = data[i].selfNm;
   	    		tmp.level = data[i].level;
   	    		tmp.totalCategoryCnt = "0";
   	    		tmp.key = "";
	    		
       			subData2.push(tmp);
   	    		
   	    		if(data[i+1] == undefined || data[i+1] == null || data[i+1].level == "1" ){
   	    			
   	    			var subtmp = {"parentId":"","selfId":"","selfNm":"","level":"","totalCategoryCnt":"","key":""};
	    			
   	    			subtmp.parentId = data[i].selfId;; 
   	    			subtmp.selfId = data[i].selfId;
   	    			subtmp.selfNm = data[i].selfNm;
   	    			subtmp.level = "2";
   	    			subtmp.totalCategoryCnt = data[i].totalCategoryCnt;
   	    			subtmp.key = data[i].key;
	    			
   	    			subData2.push(subtmp);
   	    			
   	    		}
   	    		
       		}else if(data[i].level == "2"){
       			tmp.parentId = data[i].parentId;; 
       			tmp.selfId = data[i].selfId;
       			tmp.selfNm = data[i].selfNm;
   	    		tmp.level = data[i].level;
   	    		tmp.totalCategoryCnt = data[i].totalCategoryCnt;
   	    		tmp.key = data[i].key;
   	    		
   	    		subData2.push(tmp);
       		}
       		
       	} // for (i = 0; i < data.length; i++)
       	
      	
       	data = [];
       	data = subData2;
       	
       	for (i = x; i < data.length; i++) {
       		if(data[i] != null){
       		    if(data[i].level == '1'){

       	    		data[i].id = data[i].selfId;
       	    		data[i].text = data[i].selfNm;
       	    		data[i].iconUrl = '';
       	    		
       	    		var tmp1 = data[i];
       		    		subData.push(tmp1);
       		    		
       		    		cnt += 1;
       		    		
       		    		var subArray = [];
       		    	for(j=i;j<data.length; j++) {
       		    		
       		    			if(data[i].selfId == data[j].parentId){
       		    				
       				    		data[j].id = data[j].selfId;
       				    		data[j].text = data[j].selfNm;
       				    		data[j].iconUrl = '';
       				    		
       				    		var tmp2 = data[j]
       				    		subArray.push(tmp2);	
       		    				
       				    		subData[cnt-1].items = subArray;
       		    			}
       		    	} //for(j=i;j<data.length; j++)
       		    }
       		}
       	}	
       	jsonData = JSON.parse((JSON.stringify(subData)));	
       }// setTreeFormat()

  
    // 슬라이드쇼 셋팅
    function setCarousel(){
    	
    	$('#PhotoArea > div').remove();
    	
    	$('#PhotoArea').append(
    			 '<div id="GisMainPhotoArea" class="Carousel" data-autoSlidemode="false">'
    			+'<div id="GisMainPhotoScroller" class="Scroller">'
    			+'</div>'
    			+'<a class="Prev"></a>'
    			+'<a class="Next"></a>'
    			+'<div id="GisMainPhotoPaging" class="Paging Mobile">'
    			+'</div>'
    			+'</div>'
    	);
    		
    	
    	for(i=0 ; i<photoInfoData.length; i++ ){
        	$('#GisMainPhotoScroller').append(
				 '<div class="Page">'
				+'<img style="width:100%; height:100%;" src="data:image/png;base64,'
				+m.photoImgData[i]
				+'"/>'
				+'</div>'
        	);
    	} // for
    	
//    	$('.Page > img').css({'width':'544px','height':'408px'});
    	
    	for(i=1 ; i<=photoInfoData.length; i++ ){
        	$('#GisMainPhotoPaging').append(
				 '<a class="Link" >'
				+i
				+'</a>'
        	);
    	} // for  

    	$('.Carousel').css({'margin':'auto','width':'600px','height':$('#PhotoArea').height()});
    	
    	$a.convert($('#PhotoArea')); // 'Carousel' 부모 컨버트~~~
    	
    }// setCarousel
    
    
//     라디오버튼 클릭시 텍스트 활성화 여부 셋팅
//    function setReadonly(){
//    	for(i=1;i<6;i++){
//    		if($('.gisRsltCdR'+i+':checked').val() == "N"){
//    			$('#GisOpR'+i).setEnabled(true);
//    		}else{
//    			$('#GisOpR'+i).setEnabled(false);
//    		};
//    	}
//    };
			    
    // AJAX GET, POST, PUT
    function callTangoAjax(i){
    	
    	console.log(params.cstrCd);
    	
    	var url = m.ajaxProp[i].url;
    	if(i==0){
    		m.ajaxProp[i].url = url+'/'+params.cstrCd;
    	}else if(i==1){
    		m.ajaxProp[i].url = url+'/'+m.photoImgData;
    	}
    	m.ajaxProp[i].data = params;
    	
    	
    	console.log(m.ajaxProp[i].url);
    	
    			 if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); }  // Search Cbnt Grid
    		else if(i == 1){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // getPhotoData
    	m.ajaxProp[i].url = url;    	     
    	     
    } // callTangoAjax()
    
    
    
    function messageCallback(id,result){
    	
    	switch (id) {
		case "save":
			
			if(result == "Y"){
				var flag = 'opinionMerge';
				// 검증등록-ETE 검증의견 저장,수정
	        	Tango.ajax({ url : 'tango-transmission-biz/transmission/constructprocess/verification/insertVerificationRegistrationLineGisOpinion/'+params.cstrCd+'/'+params.lnVrfClCd+'?method=put'
	  	                   , data : params
	                       , method : 'POST'
	            	       , flag: flag
	  			 })
	  			 .done(function(response){successCallback(response, flag);})
				 .fail(function(response){failCallback(response, flag);});
			}
			break;
		case "BpCommentChk":
			if(result == "Y"){
				parent.location.reload(true);
			}
			break;
			
		}
    	
    	
    };
    
});