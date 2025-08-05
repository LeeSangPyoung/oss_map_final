/**
 * ServiceLineList.js
 *
 * @author park. i. h.
 * @date 2016.09.08
 * @version 1.0
 */
$a.page(function() {
    
    this.init = function(id, param) {
    	
    	console.log(typeof param);
    	
        setEventListener();      

        
    };

    
    function setEventListener() {
    	
    	$('#btnTrunkListPop').on('click', function(e) {
    		/* 이수경과장 요청으로 일시 변경 S 보내는 파람 샘플*/
    		
    		var para = new Object(); 
//    		var  topMtsoIdList = ['MO00000000103','MO10150085376','MO10150001968','MO40150133357','MO10150000726','MO40150162707','MO10150000726','MO10000000111','MO10000000110'];
    		var  topMtsoIdList = ['MO00000000103','MO10150085376','MO10150001968'];
//    		var  ntwkLineNm    = "보라";
    		var  ntwkLineNm    = "보라매-수유";
    		$.extend(para,{"ntwkLineNm":ntwkLineNm});       // 트렁크명~?
    		$.extend(para,{"topMtsoIdList":topMtsoIdList}); // 최상위 전송실 조회 리스트인데 
    		
    		/* 이수경과장 요청으로 일시 변경 E 보내는 파람 샘플*/
    		/*console.log("para S ");
    		console.log(para);
    		console.log("para E ");*/
    		
    		
    		 $a.popup({
				  	popid: 'TrunkListPop',
				  	title: '트렁크리스트조회팝업',
				      url: $('#ctx').val()+'/configmgmt/cfline/TrunkListPop.do',
				      data: para,
				      //data: null,
				      iframe: true,
		 			  modal : true,
		 			  movable : true,
				      width : 900,
				      height : window.innerHeight * 0.9,
				      callback:function(data){
				    	  if(data != null){
				 			  console.log(data);  
				 			  console.log("data=====TRUNK==========" + data.length);	
				    		  if(data.length > 0){
				    			  for(k=0; k<data.length; k++){
				    				  var list = data[k]; 
						 			  console.log(list);  
						 			  console.log("ntwkLineNo===============" + list.ntwkLineNo);			    				  
				    			  }
				    		  }
				    	  }
				      }	  
				  });
	 
    	
         });
   	 
    	
    	// 서비스 회선 조회 팝업
    	 $('#btnServiceLinePop').on('click', function(e) {
     		var para = new Object(); 
//    		var  topMtsoIdList = ['MO00000000103','MO00000000104','MO00000000105'];
//    		$.extend(para,{"mgmtGrpCd":"0001"});
//    		$.extend(para,{"svlnLclCd":"001"});
//    		$.extend(para,{"svlnSclCd":"001"});
//    		$.extend(para,{"hdofcCd":"00001196"});
//    		$.extend(para,{"teamCd":"00003708"});
//    		$.extend(para,{"tmofCd":topMtsoIdList}); 
//    		$.extend(para,{"mtsoCd":"MO00000000105"});
//    		$.extend(para,{"mtsoNm":"보라매전송실"});
//    		$.extend(para,{"svlnNo":""});
//    		$.extend(para,{"svlnNm":""});
//    		$.extend(para,{"utrdMgmtNo":"1234"});
     		
        	$a.popup({
			  	popid: 'PopServiceLineList',
			  	title: '서비스 회선 조회 팝업',
			      url: $('#ctx').val()+'/configmgmt/cfline/ServiceLineListPop.do',
			      data: para,
			      modal: true,
			      movable:true,
			      width : 1400,
			      height : window.innerHeight * 0.9,
			      callback:function(data){
			    	  if(data != null){
			 			  console.log(data);  
			 			  console.log("data===============" + data.length);	
			    		  if(data.length > 0){
			    			  for(k=0; k<data.length; k++){
			    				  var list = data[k]; 
					 			  console.log(list);  
					 			  console.log("svlnNo===============" + list.svlnNo);			    				  
			    			  }
			    		  }
			    	  }
			      }
			  });     	 	
     	 	
         });

    	 // 링 리스트 조회 팝업
    	 $("#btnRingListPop").on('click', function(e) {
    		var para = new Object();  
     		var  topMtsoIdList = [{mtsoId:'MO20010046271'},{mtsoId:'MO10000000115'},{mtsoId:'MO20010027395'}];
    		var  ntwkLineNm    = "분당";
    		$.extend(para,{"ntwkLineNm":ntwkLineNm});       //  링명
    		$.extend(para,{"vTmofInfo":topMtsoIdList}); // 최상위 전송실 조회 리스트
    		 
    		 $a.popup({
    			 popid: 'RingListPop',
    			 title: '링 리스트 조회 팝업',
    			 url: $('#ctx').val()+'/configmgmt/cfline/RingListPop.do',
    			 data: null,
    			 iframe: true,
    			 modal: true,
    			 movable: true,
    			 width: 1000,
    			 height: window.innerHeight * 0.9,
    			 callback: function(data) {
//    				 alert("선택한 데이터는 " + data.length + "개 입니다. \n"+"데이터 : " + JSON.stringify(data));
    				 alert("데이터 : " + JSON.stringify(data));
    			 }
    		 });
    	 });
    	 
    	 // 단일링 구성도 조회
    	 $("#btnRingAddDropPop").on('click', function(e) {
    		 $a.popup({
    			 popid: 'btnRingAddDropPop',
    			 title: '링 구성도 조회 팝업',
    			 url: $('#ctx').val()+'/configmgmt/cfline/RingAddDropPop.do',
    			 data: {'ntwkLineNo' : 'N000000228687', 'editYn' : 'N'},
    			 modal: true,
    			 movable: true,
    			 width: 1400,
    			 height: window.innerHeight * 0.9,
    			 callback: function(data) {
//    				 
    			 }
    		 });
    	 });
    	 
    	 // 트렁크 선번 조회
    	 $("#btnTrunkInfoPop").on('click', function(e) {
    		 var title = "트렁크상세정보";
    		 $a.popup({
				popid: "TrunkInfoPop",
				title: title,
				url: $('#ctx').val()+'/configmgmt/cfline/TrunkInfoPop.do',
				data: {"gridId":"dataGrid","ntwkLineNo":'N000000010389',"sFlag":"N"},
				iframe: true,
				modal : false,
				movable : true,
				width : 1400,
				height : 780
			});
    	 });
    	 
    	 // 링 선번 조회
    	 $("#btnRingInfoPop").on('click', function(e) {
    		 var title = "링 상세 정보";
    		 $a.popup({
				popid: "RingInfoPop",
				title: title,
				url: $('#ctx').val()+'/configmgmt/cfline/RingInfoPop.do',
				data: {"gridId":"dataGrid","ntwkLineNo":'N000000002772',"sFlag":"N"},
				iframe: true,
				modal : false,
				movable : true,
				width : 1400,
				height : 780
			});
    	 });
    	 
    	// WDM트렁크 선번 조회
    	 $("#btnWdmTrunkInfoPop").on('click', function(e) {
    		 var title = "WDM트렁크상세정보";
    		 $a.popup({
				popid: "WdmTrunkInfoPop",
				title: title,
				url: $('#ctx').val()+'/configmgmt/cfline/WdmTrunkInfoPop.do',
				data: {"gridId":"dataGrid","ntwkLineNo":'N000000059159',"sFlag":"N"},
				iframe: true,
				modal : false,
				movable : true,
				width : 1400,
				height : 780
			});
    	 });
    	 
     	// 서비스회선
     	 $("#btnSvlnInfoPop").on('click', function(e) {
     		 var title = "서비스회선";
     		 $a.popup({

     			popid: "ServiceLIneInfoPop",
     			title: "서비스회선상세정보",
     			url: $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do',
 				data: {"gridId":"dataGrid","ntwkLineNo":'S000000020231',"sFlag":"N", "svlnLclCd":"", "svlnSclCd":""},
     			iframe: true,
     			modal : true,
     			movable:true,
     			width : 1400,
     			height : 780
     			,callback:function(data){
     				if(data != null){
     					//alert(data);
     				}
     			}  
 			});
     	 });
     	 
     	// 기간망트렁크 선번 조회
    	 $("#btnRontTrunkInfoPop").on('click', function(e) {
    		 var title = "기간망 트렁크상세정보";
    		 $a.popup({
				popid: "RontTrunkInfoPop",
				title: title,
				url: $('#ctx').val()+'/configmgmt/cfline/RontTrunkInfoPop.do',
				data: {"gridId":"dataGrid","ntwkLineNo":'N000001508526',"sFlag":"N"},
				iframe: true,
				modal : true,
				movable : true,
				width : 1400,
				height : 780
			});
    	 });
    	 
     	 // 장비조회팝업
     	 $('#btnEqpInfPop').on('click', function(){
     		var param = new Object();  
     		var  topMtsoIdList = [{mtsoId:'MO00000000228'},{mtsoId:'MO00000000103'},{mtsoId:'MO00000000102'}];
    		var  neNm    = "동작";
    		var searchDivision = "wdm";
    		$.extend(param,{"neNm":neNm});
    		$.extend(param,{"vTmofInfo":topMtsoIdList}); // 최상위 전송실 조회 리스트
    		$.extend(param,{"searchDivision":searchDivision});
    		
     		 var title = "장비조회";
     		 $a.popup({
				popid: "EqpInfPop",
				title: "장비조회",
				url: $('#ctx').val()+'/configmgmt/cfline/EqpInfPop.do',
				data: param,
				modal: true,
				movable:true,
				width : 830,
				height : 580,
				callback:function(data){
					alert(JSON.stringify(data));
					//console.log(data);
				}
     		 });
     	 });
     	 
     	 // 포트조회팝업
     	 $('#btnPortInfPop').on('click', function(){
     		 var param = new Object();  
     		 var eqpId = "DV10003647508";
     		 var portNm = "V";
     		 $.extend(param,{"eqpId":eqpId});
     		 $.extend(param,{"portNm":portNm});
     		 
     		 var title = "포트조회";
     		 $a.popup({
     			 popid: "PortInfPop",
     			 title: "포트조회",
     			 url: $('#ctx').val()+'/configmgmt/cfline/PortInfPop.do',
     			 data: param,
     			 modal: true,
     			 movable:true,
     			 width : 850,
     			 height : 600,
     			 callback:function(data){
     				 alert(JSON.stringify(data));
     				 //console.log(data);
     			 }
     		 });
     	 });
     	 
     	 // 기간망수집선번팝업
     	 $('#btnRontClctLnoPop').on('click', function(){
     		 var param = null;
     		 $a.popup({
     			 popid: "RontClctLnoPop",
     			 title: "기간망수집선번팝업",
     			 url: $('#ctx').val()+'/configmgmt/cfline/RontClctLnoPop.do',
     			 data: param,
     			 modal: true,
     			 movable: true,
     			 width: 1200,
     			 height: 800,
     			 callback:function(data){
     				 console.log(JSON.stringify(data));
     			 }
     		 });
     	 });
    	 
	};
});



