/**
 * VerificationRegistrationLineModification.js
 *
 * @author P096430
 * @date 2016. 08. 11. 오전 11:26:00
 * @version 1.0
 */

var m = {
			globalVar : {
							userId    :     "testUser"     ,
							cstrCd    :     ""             ,
							tmpCnt    :     0              ,
							eteVrfWoYn :    ""             ,
							accAprvYn  :    "" 			   ,
							vrfObjYn   :    ""             ,
							vrfFnshDt   :   ""             ,	
							skAfcoDivCd :   ""             ,
							bpId      :     ""
						},
			params    : {
							
			         	},
			ajaxProp  : [
			             {  
			             	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineModificationInfo',
			             	data:"",
			             	flag:'getModificationInfo'
			              },
			              {  
			             	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineModificationVrfFnshDt',
			             	data:"",
			             	flag:'VrfFnshDt' // 검증완료일조회
			              },
			              {  				
			              	url:'tango-transmission-biz/transmission/constructprocess/verification/updateVerificationRegistrationLineModificationOpinionSave',
			              	data:"",																									
			              	flag:'OpinionSave' // 의견 저장
			              }
//			              ,
//			             {  // 정산 완료 여부 조회
//			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineAccountAproveYn',
//			            	data:"",
//			            	flag:'AccountAproveYnChk' // 3
//			             }
			             ],
		responseData   : {
							 
						},
		message        :{
			
						},
		userInfo       :{
			
						},
		target 			: null, // 의견 객체
		targetRadio      : null, // 부모 라디오 객체
		clickObj : null
						
	};


// 테스트용-----------------
var data1= [];
// 테스트=====================================================
 





var tangoAjaxModel = Tango.ajax.init({});




$a.page(function(){

	$('table').css({
			 'overflow-y':'hidden'
			,'overflow-x':'hidden'
	});
	
	

	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param){   	
     	console.log(param.cstrCd);
    	// param setting
    	if(param.cstrCd != null && param.cstrCd != "" && param.cstrCd != undefined){
//    	if(parent.$('#cstrCd').val() != null && parent.$('#cstrCd').val() != "" && parent.$('#cstrCd').val() != undefined){
//    		m.globalVar.cstrCd = parent.$('#cstrCd').val();
    	//===================================================
    	
    		m.globalVar.cstrCd = param.cstrCd;
    		
	    	m.params.cstrCd = m.globalVar.cstrCd;
	    	
	    	m.globalVar.userId = m.userInfo.userId;
	    	
	    	m.params.lastChgUserId = m.globalVar.userId;
	    	
	    	
	    	m.globalVar.skAfcoDivCd = m.userInfo.skAfcoDivCd;
	    	m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd

	    	m.globalVar.bpId = m.userInfo.bpId;
	    	m.params.bpId = m.globalVar.bpId
	    	

	    	m.globalVar.eteVrfWoYn  = param.eteVrfWoYn;
	        m.globalVar.accAprvYn = param.accAprvYn;
	        m.globalVar.vrfObjYn = param.vrfObjYn;
	        m.globalVar.vrfFnshDt = param.vrfFnshDt;
	    	
	    	setEventListener();
	    	
	    	if(m.globalVar.eteVrfWoYn =="Y"){
	    		$('.ETE').setEnabled(false);
	    	}
	    	
	    	
//	    	m.params.lnVrfClCd = "B" // ETE
//	    	callTangoAjax(0);// ETE 조회 
	
//	    	m.params.lnVrfClCd = "C" // GIS
//	        callTangoAjax(0);// GIS 조회
		
	    	callTangoAjax(0);
	    	
//	    	m.globalVar.tmpCnt = 0;
    	}
    	
    };   
        
  //Grid init
    function initGrid(){ }// initGrid()
    
    function validateChk(){  
    	return true;
    }    
    
    
    
    // EVENT !!!!!!!!!!!!!
    function setEventListener() {
    	
    	// 저장버튼 클릭시
    	$('#VerificationRegistrationModificationSaveBtn').on('click',function(e){
//    		console.log(m.globalVar.accAprvYn);
    		callTangoAjax(1); // 검증완료일조회 

 //    		callTangoAjax(3); // 정산완료일조회
    		
    	});
    	
    	//
    	// 양호/불량 클릭시 텍스트 필드 생성
//    	$('.Radio').on('click',function(e){
//    		if($(this).val() == 'N'){
//    			$(this).parents('tr').find('td:eq(1)').html('<input class="Textinput textinput opinion" style="width:300px;"  id="R'+$('#modificationResult').find($(this).parents('tr')).index()+'" />');
//    			$(this).parents('tr').find('td:eq(1)>input').focus(); // 불량 선택시 자동 포커스!!
//    			
//    			// 의견 포커스 아웃시 체크 - 미입력시 경고
//    			m.target = $(this).parents('tr').find('td:eq(1)>input');
//    			m.targetRadio = m.target.parents('tr').find('.Radio');
//    			console.log(m.target.parents('tr').attr('id'));
//    			m.clickObj = m.target.parents('tr').attr('id');
//    	    	var focusYn = "N";
    	    	
    	    	
    	    	
    	    	
    	    	
    	    	
//    	    	
//    	    	$('body').on('click',function(e){
//    	    		var clickTarget = e.target.getAttribute('id');
//    	    		
////    	    		alert(clickTarget + " : " + m.target);
//    	    		
//    	    		if(m.target != clickTarget){
//        	    		m.targetRadio.on('click',function(e){
//        	    			focusYn = "Y";
//        	    		});
//        	    		if(focusYn == "N"){
//        		    		
//        	    		};
//    	    		}else{
//    	    			
//    	    		}
//    	    	});
    	    	
//    	    	m.target.on('focusout', function(e){    
//    	    		if(focusYn == "N"){
//    		    		if(m.target.val()==""){
//    		    			m.target.focus();
//    		    			return;
//    		    			//callMsgBox('focusInput','I', m.message.vrfOppnCttValidation, messageCallback); // 불량시 의견은 필수 입니다.
//    		    		};
//    	    		};
//    	    	});
    			
    	    	
    			
//    		}else if($(this).val() == 'Y'){
//    			
//    			m.target = null;
//    			m.targetRadio = null;
//    			
//    			$(this).parents('tr').find('td:eq(1)').html('-');
//    		}
//    	});


    	
    	
    	
	} // setEventListener() - 이벤트
	
    
    
    // SUCCESS...
    function successFn(response, status, jqxhr, flag){
//    	console.log("flag : "+flag);
    	switch (flag) {
    	
    	case 'getModificationInfo':   	
    		
    		if($.TcpUtils.isNotEmpty(response)){
    			
    			console.log(response);
    			
    			
//    			if(response.ModificationInfo.lnVrfClCd == "B" && m.globalVar.eteVrfWoYn !="Y"){ // ETE
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(0)').children('td:eq(0)').text(setResultYN(response.ModificationInfo.cstrVrfRsltCd));
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(0)').children('td:eq(1)').text(response.ModificationInfo.vrfOponCtt);
//    				
//    				m.responseData.ModificationInfo1 = response.ModificationInfo;
//    				
//    				$('.ETE').setData(response.ModificationInfo);
//    				m.globalVar.tmpCnt ++;
//    			}else if(response.ModificationInfo.lnVrfClCd == "C"){ // GIS
//    				
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(1)').children('td:eq(0)').text(setResultYN(response.ModificationInfo.cblStrdVrfRsltCd));
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(1)').children('td:eq(1)').text(response.ModificationInfo.cblStrdOponCtt);
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(2)').children('td:eq(0)').text(setResultYN(response.ModificationInfo.mnftNoVrfRsltCd));
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(2)').children('td:eq(1)').text(response.ModificationInfo.mnftVndrOponCtt);
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(3)').children('td:eq(0)').text(setResultYN(response.ModificationInfo.lnoVrfRsltCd));
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(3)').children('td:eq(1)').text(response.ModificationInfo.lnoOponCtt);
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(4)').children('td:eq(0)').text(setResultYN(response.ModificationInfo.acptCbcntVrfRsltCd));
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(4)').children('td:eq(1)').text(response.ModificationInfo.acptCbcntOponCtt);
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(5)').children('td:eq(0)').text(setResultYN(response.ModificationInfo.dbVrfRsltCd));
//    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(5)').children('td:eq(1)').text(response.ModificationInfo.bascDbOponCtt);
//    				
//    				m.responseData.ModificationInfo2 = response.ModificationInfo;
//    				
//    				$('.GIS').setData(response.ModificationInfo);
//    				m.globalVar.tmpCnt ++;
//    			}
    			
    			/* 수정 */
    			/* ETE */
    			if(m.globalVar.eteVrfWoYn !="Y"){
    				m.responseData.ModificationInfo1 = response.ModificationInfoEte;
    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(0)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo1.cstrVrfRsltCd));
    				$('#VerificationRegistrationLineModificationMain').find('tr:eq(0)').children('td:eq(1)').text(m.responseData.ModificationInfo1.vrfOponCtt);
    				$('.ETE').setData(m.responseData.ModificationInfo1);
    			}
    			
    			/* GIS */
    			m.responseData.ModificationInfo2 = response.ModificationInfoGis;
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(1)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo2.cblStrdVrfRsltCd));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(1)').children('td:eq(1)').text(m.responseData.ModificationInfo2.cblStrdOponCtt);
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(2)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo2.mnftNoVrfRsltCd));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(2)').children('td:eq(1)').text(m.responseData.ModificationInfo2.mnftVndrOponCtt);
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(3)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo2.lnoVrfRsltCd));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(3)').children('td:eq(1)').text(m.responseData.ModificationInfo2.lnoOponCtt);
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(4)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo2.acptCbcntVrfRsltCd));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(4)').children('td:eq(1)').text(m.responseData.ModificationInfo2.acptCbcntOponCtt);
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(5)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo2.dbVrfRsltCd));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(5)').children('td:eq(1)').text(m.responseData.ModificationInfo2.bascDbOponCtt);
				$('.GIS').setData(m.responseData.ModificationInfo2);
				
				/* CMP - 준공사진 */
				m.responseData.ModificationInfo3 = response.ModificationInfoCmp;

    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(6)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo3.picVrfRsltCdA));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(6)').children('td:eq(1)').text(m.responseData.ModificationInfo3.picVrfOpCttA);
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(7)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo3.picVrfRsltCdB));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(7)').children('td:eq(1)').text(m.responseData.ModificationInfo3.picVrfOpCttB);
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(8)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo3.picVrfRsltCdC));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(8)').children('td:eq(1)').text(m.responseData.ModificationInfo3.picVrfOpCttC);
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(9)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo3.picVrfRsltCdD));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(9)').children('td:eq(1)').text(m.responseData.ModificationInfo3.picVrfOpCttD);
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(10)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo3.picVrfRsltCdE));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(10)').children('td:eq(1)').text(m.responseData.ModificationInfo3.picVrfOpCttE);
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(11)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo3.picVrfRsltCdF));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(11)').children('td:eq(1)').text(m.responseData.ModificationInfo3.picVrfOpCttF);
				
    			$('.CMP').setData(m.responseData.ModificationInfo3);
    			
    			/* TRR - 시험성적서 */
    			m.responseData.ModificationInfo4 = response.ModificationInfoTrr;
    			$('#VerificationRegistrationLineModificationMain').find('tr:eq(12)').children('td:eq(0)').text(setResultYN(m.responseData.ModificationInfo4.cstrVrfRsltCd));
				$('#VerificationRegistrationLineModificationMain').find('tr:eq(12)').children('td:eq(1)').text(m.responseData.ModificationInfo4.vrfOponCtt);
    			$('.TRR').setData(m.responseData.ModificationInfo4);
    			
    			
    			
    			
    			
    			
//    			if(m.globalVar.tmpCnt == 2 || (m.globalVar.tmpCnt == 1 && m.globalVar.eteVrfWoYn =="Y") ){
    				
					for(i=0 ;i<13;i++){
//						console.log(i + " : "+ $('input:radio[name=r'+i+']').getValue());
//	    	    		if($('input:radio[name=r'+i+']').getValue() == 'N'){
						if(i==0 && m.globalVar.eteVrfWoYn =="Y"){
	    	    			
						}else{
							$('input:radio[name=r'+i+']').parents('tr').find('td:eq(1)').html('<input class="Textinput textinput" style="width:300px;" id="R'+$('#modificationResult').find($('input:radio[name=r'+i+']').parents('tr')).index()+'">');
						}
	    	    			if(i==0 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo1)){$('#R'+i).val(m.responseData.ModificationInfo1.vrfOponCtt);}
	    	    			
	    	    			
	    	    			if(i==1 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo2.cblStrdOponCtt)){$('#R'+i).val(m.responseData.ModificationInfo2.cblStrdOponCtt);}
	    	    			
	    	    			if(i==2 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo2.mnftVndrOponCtt)){$('#R'+i).val(m.responseData.ModificationInfo2.mnftVndrOponCtt);}
	    	    			if(i==3 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo2.lnoOponCtt)){$('#R'+i).val(m.responseData.ModificationInfo2.lnoOponCtt);}
	    	    			if(i==4 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo2.acptCbcntOponCtt)){$('#R'+i).val(m.responseData.ModificationInfo2.acptCbcntOponCtt);}
	    	    			if(i==5 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo2.bascDbOponCtt)){$('#R'+i).val(m.responseData.ModificationInfo2.bascDbOponCtt);}
	    	    			
	    	    			if(i==6 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo3.picVrfOpCttA)){$('#R'+i).val(m.responseData.ModificationInfo3.picVrfOpCttA);}
	    	    			if(i==7 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo3.picVrfOpCttB)){$('#R'+i).val(m.responseData.ModificationInfo3.picVrfOpCttB);}
	    	    			if(i==8 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo3.picVrfOpCttC)){$('#R'+i).val(m.responseData.ModificationInfo3.picVrfOpCttC);}
	    	    			if(i==9 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo3.picVrfOpCttD)){$('#R'+i).val(m.responseData.ModificationInfo3.picVrfOpCttD);}
	    	    			if(i==10 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo3.picVrfOpCttE)){$('#R'+i).val(m.responseData.ModificationInfo3.picVrfOpCttE);}
	    	    			if(i==11 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo3.picVrfOpCttF)){$('#R'+i).val(m.responseData.ModificationInfo3.picVrfOpCttF);}
	    	    			
	    	    			if(i==12 && $.TcpUtils.isNotEmpty(m.responseData.ModificationInfo4.vrfOponCtt)){$('#R'+i).val(m.responseData.ModificationInfo4.vrfOponCtt);}
	    	    			
//	    	    		}else if($('input:radio[name=r'+i+']').getValue() == 'Y'){
//	    	    			$('input:radio[name=r'+i+']').parents('tr').find('td:eq(1)').html('-');
//	    	    		}
					}
//    			}
    			
    		}
    		break;
    	case 'VrfFnshDt':
    		/* 검증완료일자 체크하여 NULL, "" 이면 저장불가 */ 
    		if(response.ModificationVrfFnshDt != null && response.ModificationVrfFnshDt != ""){
    			if(response.ModificationVrfFnshDt.vrfFnshDt == null || response.ModificationVrfFnshDt.vrfFnshDt == "" ){
    				parent.parent.callMsgBox('OpinionSave','W', "검증등록이 취소되어 변경할 수 없습니다.",messageCallback);
    			}else{
    				saveOpinion();
    			} 
    		}else{
    			parent.parent.callMsgBox('OpinionSave','W', "검증등록이 취소되어 변경할 수 없습니다.",messageCallback);
    		}
    		break;
    	case 'OpinionSave':
    		
    		parent.parent.callMsgBox('OpinionSave','I', m.message.savesuccess, messageCallback); // 저장을 완료했습니다.
    		
    		break;
//    	case 'AccountAproveYnChk':
//    		if(response.AccountAproveYn != null && response.AccountAproveYn != ""){
//    			if(response.AccountAproveYn.accAprvYn != null && response.AccountAproveYn.accAprvYn != ""){
//    				m.globalVar.accAprvYn = response.AccountAproveYn.accAprvYn;
//    				if(response.AccountAproveYn.accAprvYn == 'N'){
//    					m.params.step = m.globalVar.step;
//    	    			callTangoAjax(1); // 검증완료일조회 
//    				}else{
//    					parent.parent.callMsgBox('','I', "정산승인되여 저장할 수 없습니다.");
//    				}
//    			}
//    		}
//    		
//    		break;
    		
    	}
    } // successFn()
    
    // FAIL...
    function failFn(response, status, jqxhr, flag){
    	parent.parent.callMsgBox('','I', response.message);
//    	switch (flag) {
//    	case 'getModificationInfo':
////    		parent.parent.callMsgBox('','W', m.message.searchFail); // 조회 실패
//    		break;
//    	case 'VrfFnshDt':
////    		parent.parent.callMsgBox('','W', m.message.searchFail); // 조회 실패
//    		break;
//    	case 'OpinionSave':
//    		parent.parent.callMsgBox('','W', m.message.saveFail); // 저장을 완료했습니다.
//    		break;
//    	case 'AccountAproveYnChk':
//    		parent.parent.callMsgBox('','W', m.message.searchFail); // 조회 실패
//    		break;
//    	}    	
    } // failFn()
    
    
    
    // AJAX GET, POST, PUT
    function callTangoAjax(i){
    	
    	var url = m.ajaxProp[i].url;
    	
    	if(i==1||i==2||i==3){
    		m.ajaxProp[i].url = url + "/"+m.params.cstrCd; 
    	}
    	
    	m.ajaxProp[i].data = m.params;
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } // 검증결과 조회
    	else if(i == 1){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } // 검증완료일 조회
    	else if(i == 2){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn); } // 의견저장
    	else if(i == 3){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // 정산완료조회
    	
    	     
    	m.ajaxProp[i].url = url;    	     
    	     
    } // callTangoAjax()
    
    // 양호, 불량 변경
    function setResultYN(a){
    	if(a == "Y"){
    		return "양호";
    	}else if(a == "N"){
    	 return "불량";
    	}
    	return "";
    }// setResultYN
    

    // 의견 저장
    function saveOpinion(){
		// ETE param
    									
		m.params.cstrVrfRsltCd       = $('input:radio[name=r0]').getValue();
		m.params.vrfOponCtt          = $('#R0').val();
		
		if(m.params.cstrVrfRsltCd == "N" && m.params.vrfOponCtt == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}
		
		// GIS param
		// 케이블
		m.params.cblStrdVrfRsltCd    = $('input:radio[name=r1]').getValue();
		m.params.cblStrdOponCtt      = $('#R1').val();
		
		if(m.params.cblStrdVrfRsltCd == "N" && m.params.cblStrdOponCtt == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}
		
		//
		m.params.mnftNoVrfRsltCd     = $('input:radio[name=r2]').getValue();
		m.params.mnftVndrOponCtt     = $('#R2').val();
		if(m.params.mnftNoVrfRsltCd == "N" && m.params.mnftVndrOponCtt == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}
		
		//
		m.params.lnoVrfRsltCd        = $('input:radio[name=r3]').getValue();
		m.params.lnoOponCtt          = $('#R3').val();
		if(m.params.lnoVrfRsltCd == "N" && m.params.lnoOponCtt == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}
		
		//
		m.params.acptCbcntVrfRsltCd  = $('input:radio[name=r4]').getValue();
		m.params.acptCbcntOponCtt    = $('#R4').val();
		if(m.params.acptCbcntVrfRsltCd == "N" && m.params.acptCbcntOponCtt == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}
		
		//
		m.params.dbVrfRsltCd         = $('input:radio[name=r5]').getValue();
		m.params.bascDbOponCtt       = $('#R5').val();
		if(m.params.dbVrfRsltCd == "N" && m.params.bascDbOponCtt == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}
		
		// 준공사진
		m.params.picVrfRsltCdA         = $('input:radio[name=r6]').getValue();
		m.params.picVrfOpCttA       = $('#R6').val();
		if(m.params.picVrfRsltCdA == "N" && m.params.picVrfOpCttA == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		m.params.picVrfRsltCdB         = $('input:radio[name=r7]').getValue();
		m.params.picVrfOpCttB      = $('#R7').val();
		if(m.params.picVrfRsltCdB == "N" && m.params.picVrfOpCttB == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		m.params.picVrfRsltCdC         = $('input:radio[name=r8]').getValue();
		m.params.picVrfOpCttC       = $('#R8').val();
		if(m.params.picVrfRsltCdC == "N" && m.params.picVrfOpCttC == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		m.params.picVrfRsltCdD         = $('input:radio[name=r9]').getValue();
		m.params.picVrfOpCttD       = $('#R9').val();
		if(m.params.picVrfRsltCdD == "N" && m.params.picVrfOpCttD == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		m.params.picVrfRsltCdE         = $('input:radio[name=r10]').getValue();
		m.params.picVrfOpCttE       = $('#R10').val();
		if(m.params.picVrfRsltCdE == "N" && m.params.picVrfOpCttE == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		m.params.picVrfRsltCdF         = $('input:radio[name=r11]').getValue();
		m.params.picVrfOpCttF       = $('#R11').val();
		if(m.params.picVrfRsltCdF == "N" && m.params.picVrfOpCttF == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		// 시험성적서
		m.params.cstrVrfRsltCdTrr         = $('input:radio[name=r12]').getValue();
		m.params.vrfOponCttTrr       = $('#R12').val();
		if(m.params.cstrVrfRsltCdTrr == "N" && m.params.vrfOponCttTrr == ""){ parent.parent.callMsgBox('focusInput','I', m.message.vrfOppnCttValidation ); return; }; // 불량시 의견은 필수 입니다.}

		
		
		
		if(paramsValidate()){
			
			// GIs 검증결과구분코드 셋팅
			if(		m.params.cblStrdVrfRsltCd    == "Y" && 
					m.params.mnftNoVrfRsltCd     == "Y" &&
					m.params.lnoVrfRsltCd        == "Y" && 
					m.params.acptCbcntVrfRsltCd  == "Y" && 
					m.params.dbVrfRsltCd         == "Y" ) 
			{ m.params.gisCstrVrfRsltCd = "Y" }else{ m.params.gisCstrVrfRsltCd = "N" }
			
			parent.parent.callMsgBox('save_btn','C', m.message.save, messageCallback); // 저장을 하시겠습니까?
			
		}
    	
    	
    	
    	
    } // saveOpinion
    
    function paramsValidate(){
    	
		// GIs 검증결과구분코드 셋팅


                if($.TcpUtils.isEmpty(m.params.cstrVrfRsltCd) && m.globalVar.eteVrfWoYn !="Y" 	){ parent.parent.callMsgBox('','I', "ETE에 해당하는 양호 또는 불량을 반드시 선택해야 합니다.");          return false;  };
                if($.TcpUtils.isEmpty(m.params.cblStrdVrfRsltCd)								){ parent.parent.callMsgBox('','I', "케이블규격에 해당하는 양호 또는 불량을 반드시 선택해야 합니다.");   return false;  };
				if($.TcpUtils.isEmpty(m.params.mnftNoVrfRsltCd)									){ parent.parent.callMsgBox('','I', "제조번호에 해당하는 양호 또는 불량을 반드시 선택해야 합니다.");     return false;  };
				if($.TcpUtils.isEmpty(m.params.lnoVrfRsltCd)									){ parent.parent.callMsgBox('','I', "접속정보에 해당하는 양호 또는 불량을 반드시 선택해야 합니다.");     return false;  };
				if($.TcpUtils.isEmpty(m.params.acptCbcntVrfRsltCd)								){ parent.parent.callMsgBox('','I', "수용조수에 해당하는 양호 또는 불량을 반드시 선택해야 합니다.");     return false;  };
				if($.TcpUtils.isEmpty(m.params.dbVrfRsltCd)										){ parent.parent.callMsgBox('','I', "기초DB에 해당하는 양호 또는 불량을 반드시 선택해야 합니다.");       return false;  };
    	
    	
    	if(m.params.gisCstrVrfRsltCd == "N"){
	    	if(m.params.cstrVrfRsltCd          ==   "N" ){  if($.TcpUtils.isEmpty(m.params.vrfOponCtt)			){ parent.parent.callMsgBox('','I', "ETE 불량선택시 의견은 필수입니다.");         return false;}   /* if(m.params.vrfOponCtt             ==     m.responseData.ModificationInfo1.vrfOponCtt           ){ parent.parent.callMsgBox('','I', "ETE 의견 변함없음");        return false; }; */ };
	    	if(m.params.cblStrdVrfRsltCd       ==   "N" ){  if($.TcpUtils.isEmpty(m.params.cblStrdOponCtt)		){ parent.parent.callMsgBox('','I', "케이블규격 불량선택시 의견은 필수입니다.");  return false;}   /* if(m.params.cblStrdOponCtt         ==     m.responseData.ModificationInfo2.cblStrdOponCtt       ){ parent.parent.callMsgBox('','I', "케이블규격 의견 변함없음"); return false; }; */ };
	    	if(m.params.mnftNoVrfRsltCd        ==   "N" ){  if($.TcpUtils.isEmpty(m.params.mnftVndrOponCtt)		){ parent.parent.callMsgBox('','I', "제조번호 불량선택시 의견은 필수입니다.");    return false;}   /* if(m.params.mnftVndrOponCtt        ==     m.responseData.ModificationInfo2.mnftVndrOponCtt      ){ parent.parent.callMsgBox('','I', "제조번호 의견 변함없음");   return false; }; */ };
	    	if(m.params.lnoVrfRsltCd           ==   "N" ){  if($.TcpUtils.isEmpty(m.params.lnoOponCtt)			){ parent.parent.callMsgBox('','I', "접속정보 불량선택시 의견은 필수입니다.");    return false;}   /* if(m.params.lnoOponCtt             ==     m.responseData.ModificationInfo2.lnoOponCtt           ){ parent.parent.callMsgBox('','I', "접속정보 의견 변함없음");   return false; }; */ };
	    	if(m.params.acptCbcntVrfRsltCd     ==   "N" ){  if($.TcpUtils.isEmpty(m.params.acptCbcntOponCtt)	){ parent.parent.callMsgBox('','I', "수용조수 불량선택시 의견은 필수입니다.");    return false;}   /* if(m.params.acptCbcntOponCtt       ==     m.responseData.ModificationInfo2.acptCbcntOponCtt     ){ parent.parent.callMsgBox('','I', "수용조수 의견 변함없음");   return false; }; */ };
	    	if(m.params.dbVrfRsltCd            ==   "N" ){  if($.TcpUtils.isEmpty(m.params.bascDbOponCtt)		){ parent.parent.callMsgBox('','I', "기초DB 불량선택시 의견은 필수입니다.");      return false;}   /* if(m.params.bascDbOponCtt          ==     m.responseData.ModificationInfo2.bascDbOponCtt        ){ parent.parent.callMsgBox('','I', "기초DB 의견 변함없음");     return false; }; */ };
    	}
    	
    	if(m.globalVar.eteVrfWoYn !="Y"){
    	
	    	if(
	    			m.responseData.ModificationInfo1.cstrVrfRsltCd      == m.params.cstrVrfRsltCd &&	
	    			m.responseData.ModificationInfo1.vrfOponCtt         == m.params.vrfOponCtt && 
	    			
	    			m.responseData.ModificationInfo2.cblStrdVrfRsltCd   == m.params.cblStrdVrfRsltCd &&
	    			m.responseData.ModificationInfo2.cblStrdOponCtt     == m.params.cblStrdOponCtt &&
	    			m.responseData.ModificationInfo2.mnftNoVrfRsltCd    == m.params.mnftNoVrfRsltCd &&
	    			m.responseData.ModificationInfo2.mnftVndrOponCtt    == m.params.mnftVndrOponCtt &&
	    			m.responseData.ModificationInfo2.lnoVrfRsltCd       == m.params.lnoVrfRsltCd &&
	    			m.responseData.ModificationInfo2.lnoOponCtt         == m.params.lnoOponCtt &&
	    			m.responseData.ModificationInfo2.acptCbcntVrfRsltCd == m.params.acptCbcntVrfRsltCd &&
	    			m.responseData.ModificationInfo2.acptCbcntOponCtt   == m.params.acptCbcntOponCtt &&
	    			m.responseData.ModificationInfo2.dbVrfRsltCd        == m.params.dbVrfRsltCd &&
	    			m.responseData.ModificationInfo2.bascDbOponCtt      == m.params.bascDbOponCtt &&
	    			
	    			m.responseData.ModificationInfo3.picVrfRsltCdA ==   m.params.picVrfRsltCdA &&
	    			m.responseData.ModificationInfo3.picVrfOpCttA ==   m.params.picVrfOpCttA &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdB ==   m.params.picVrfRsltCdB &&
	    			m.responseData.ModificationInfo3.picVrfOpCttB ==   m.params.picVrfOpCttB &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdC ==   m.params.picVrfRsltCdC &&
	    			m.responseData.ModificationInfo3.picVrfOpCttC ==   m.params.picVrfOpCttC &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdD ==   m.params.picVrfRsltCdD &&
	    			m.responseData.ModificationInfo3.picVrfOpCttD ==   m.params.picVrfOpCttD &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdE ==   m.params.picVrfRsltCdE &&
	    			m.responseData.ModificationInfo3.picVrfOpCttE ==   m.params.picVrfOpCttE &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdF ==   m.params.picVrfRsltCdF &&
	    			m.responseData.ModificationInfo3.picVrfOpCttF ==   m.params.picVrfOpCttF &&
	    			
	    			m.responseData.ModificationInfo4.cstrVrfRsltCd      == m.params.cstrVrfRsltCdTrr &&	
	    			m.responseData.ModificationInfo4.vrfOponCtt         == m.params.vrfOponCttTrr 
	    			
	    	){
	    		parent.parent.callMsgBox('','I', m.message.noChangedData); // 변경된 내용이 없음
	    		
	    		return false;
	    	}
    		
    	}else{
    		if(
	    			m.responseData.ModificationInfo2.cblStrdVrfRsltCd   == m.params.cblStrdVrfRsltCd &&
	    			m.responseData.ModificationInfo2.cblStrdOponCtt     == m.params.cblStrdOponCtt &&
	    			m.responseData.ModificationInfo2.mnftNoVrfRsltCd    == m.params.mnftNoVrfRsltCd &&
	    			m.responseData.ModificationInfo2.mnftVndrOponCtt    == m.params.mnftVndrOponCtt &&
	    			m.responseData.ModificationInfo2.lnoVrfRsltCd       == m.params.lnoVrfRsltCd &&
	    			m.responseData.ModificationInfo2.lnoOponCtt         == m.params.lnoOponCtt &&
	    			m.responseData.ModificationInfo2.acptCbcntVrfRsltCd == m.params.acptCbcntVrfRsltCd &&
	    			m.responseData.ModificationInfo2.acptCbcntOponCtt   == m.params.acptCbcntOponCtt &&
	    			m.responseData.ModificationInfo2.dbVrfRsltCd        == m.params.dbVrfRsltCd &&
	    			m.responseData.ModificationInfo2.bascDbOponCtt      == m.params.bascDbOponCtt &&
	    			
	    			m.responseData.ModificationInfo3.picVrfRsltCdA ==   m.params.picVrfRsltCdA &&
	    			m.responseData.ModificationInfo3.picVrfOpCttA ==   m.params.picVrfOpCttA &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdB ==   m.params.picVrfRsltCdB &&
	    			m.responseData.ModificationInfo3.picVrfOpCttB ==   m.params.picVrfOpCttB &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdC ==   m.params.picVrfRsltCdC &&
	    			m.responseData.ModificationInfo3.picVrfOpCttC ==   m.params.picVrfOpCttC &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdD ==   m.params.picVrfRsltCdD &&
	    			m.responseData.ModificationInfo3.picVrfOpCttD ==   m.params.picVrfOpCttD &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdE ==   m.params.picVrfRsltCdE &&
	    			m.responseData.ModificationInfo3.picVrfOpCttE ==   m.params.picVrfOpCttE &&
	    			m.responseData.ModificationInfo3.picVrfRsltCdF ==   m.params.picVrfRsltCdF &&
	    			m.responseData.ModificationInfo3.picVrfOpCttF ==   m.params.picVrfOpCttF &&
	    			
	    			m.responseData.ModificationInfo4.cstrVrfRsltCd      == m.params.cstrVrfRsltCdTrr &&	
	    			m.responseData.ModificationInfo4.vrfOponCtt         == m.params.vrfOponCttTrr 
	    			
	    	){
    			parent.parent.callMsgBox('','I', m.message.noChangedData); // 변경된 내용이 없음
	    		
	    		return false;
	    	}
    	}
    	
    	
    	return true;
    }// paramsValidate
    
    
    
	function messageCallback(msgId, msgRst){
		switch (msgId) {
		case 'save_btn':
			if(msgRst == 'Y'){
				m.params.eteVrfWoYn = m.globalVar.eteVrfWoYn;
				
				console.log(m.params);
				callTangoAjax(2); // 의견 저장
			}
			break;
		case 'OpinionSave':
			if(msgRst == 'Y'){
	    		$a.close("ok");
			}
			break;
		case 'focusInput':
			if(msgRst == 'Y'){
				m.target.focus();
			}
			break;
		}
	};
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});