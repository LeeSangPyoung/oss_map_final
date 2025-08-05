/**
 * MeasuringInstrumentMgmtInfReg.js
 *
 * @author P093844
 * @date 2016. 8. 08. 오전 11:06:03
 * @version 1.0
 */

	$a.page(function() {
		
		var m = {
				form: {
					mistRegForm:$('#mistRegForm')				
				},
				select:{
					msitWorkLnOplanDivCd:$('#msitWorkLnOplanDivCd'),		  		// 구분
					msitVendBpId:$('#msitVendBpId'),				// 협력사
					msitMgmtHdofcOrgId:$('#msitMgmtHdofcOrgId'),	// 지역
					msitRegBpId:$('#msitRegBpId'),					// 등록사
					msitItemCd:$('#msitItemCd'),						//품목	
					lesDivCd:$('#lesDivCd'),							//자가/임차
					msmtPrdTypCd:$('#msmtPrdTypCd'),					//주기
					msitMnftYr:$('#msitMnftYr')						//제조년도
				},			
				button:{
					mistclose:$('#btnclose'),					//닫기
					mistsave:$('#btnsave'),					//저장
					mistattach:$('#btnattach'),					//파일첨부
					mistfiledel:$('#btnfiledel'),					//파일삭제					
					mistvend:$('#btnVendPopUp'),						// 제조사 조회
					mistregbp:$('#btnRegBpPopUp')				// 등록사 조회
				},
				textBox:{					
					eqpMdl:$('#msitEqpMdlNm'),					// 기종  
					serNo:$('#msitSerNoVal'),						// 시리얼번호
					bpId:$('#bpId'),						// 제조사코드
					bpNm:$('#bpNm')						// 제조사 명
				},
				date:{
					fstMsitCrctDt:$('#fstMsitCrctDt'),		// 1차측정기교정일자
					scndMsitCrctDt:$('#scndMsitCrctDt')		// 2차측정기교정일자
				},
				div:{
					msitWorkLnOplanDivCd_isEnabled:$('#msitWorkLnOplanDivCd_isEnabled')
				},
				api:{
					mistingreg:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentinfreg',						// search					
					mistdrpdwn:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentmgmt/dropdownlist',			// selectbox search
					mistsave:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentinfreg/save',					// save
					mistupdate:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentinfreg/update?method=put'					// update
				},
				popup:{
					vend:{
						popid:'vend',
						title:'제조사 조회',
						url:'vend.do',
						width:'1600',
						height:'900'
					}
				},
				hidden:{
					frstRegUserId:$('#frstRegUserId'),		//등록ID
					lastChgUserId:$('#lastChgUserId'),		//수정ID
					prfDocmtNm:$('#prfDocmtNm'),				//파일이름
					msitSrno:$('#msitSrno'),					//측정기 키값
					popFlag:$('#popFlag'),					//popFlag
					paramMsitWorkLnOplanDivCd:$('#paramMsitWorkLnOplanDivCd'),
					paramMsitVendBpId:$('#paramMsitVendBpId'),
					paramMsitMgmtHdofcOrgId:$('#paramMsitMgmtHdofcOrgId'),
					pageNo:$('#pageNo')
				},
				years:[{year:"", value:"전체"},
				       {year:"1990", value:"1990"},
				       {year:"1991", value:"1991"},
				       {year:"1992", value:"1992"},
				       {year:"1993", value:"1993"},
				       {year:"1994", value:"1994"},
				       {year:"1995", value:"1995"},
				       {year:"1996", value:"1996"},
				       {year:"1997", value:"1997"},
				       {year:"1998", value:"1998"},
				       {year:"1999", value:"1999"},
				       {year:"2000", value:"2000"},
				       {year:"2001", value:"2001"},
				       {year:"2002", value:"2002"},
				       {year:"2003", value:"2003"},
				       {year:"2004", value:"2004"},
				       {year:"2005", value:"2005"},
				       {year:"2006", value:"2006"},
				       {year:"2007", value:"2007"},
				       {year:"2008", value:"2008"},
				       {year:"2009", value:"2009"},
				       {year:"2010", value:"2010"},
				       {year:"2011", value:"2011"},
				       {year:"2012", value:"2012"},
				       {year:"2013", value:"2013"},
				       {year:"2014", value:"2014"},
				       {year:"2015", value:"2015"},
				       {year:"2016", value:"2016"},
				       {year:"2017", value:"2017"},
				       {year:"2018", value:"2018"},
				       {year:"2019", value:"2019"},
				       {year:"2020", value:"2020"}]
			};
		
		/*select*/
		var httpRequest = function(uri,data,method,flag){
			
			Tango.ajax({
				url : uri,
				data : data,
				method : method,
				async:true,
				flag:flag
			}).done(function(response){successCallback(response, flag);})
				.fail(function(response){failCallback(response, flag);});
		};
		
		// init seletBox setting
		var initSelectBind = function(msitVendBpId, msitMgmtHdofcOrgId ){
			
			// TOBE 공통코드 조회 
			setComponentByCode('mistRegForm', setComponentByCodeCallBack);
			
			//select int setting
				m.select.msitMnftYr.setData({
		             data:m.years,
		             option_selected : ''
					});	
			
			/* 조건절 TOBE 공통코드 조회*/
			// 협력사
			var comParamArg = new Array();
        	comParamArg.push("comCd:SKEC^UBINS^SKTS");        	
        	
        	//협력사
			setSelectByCode('msitVendBpId','all', 'C00332', setSelectByCodeCallBack, comParamArg);
			
			//지역
			setSelectByOrg('msitMgmtHdofcOrgId','all',setSelectByOrgCallBack);
			
			//품목, 등록사 신규
			if(m.hidden.popFlag.val() === 'I'){	
				
				var data ='';				
				httpRequest(m.api.mistdrpdwn, data ,'GET','mistdrpdwn');
					
			}else if(m.hidden.popFlag.val() === 'U'){//품목, 등록사 업데이트
				// 측정기관리대장 DropDownBox 조회	
				
				var data = {"msitVendBpId":msitVendBpId , "msitMgmtHdofcOrgId":msitMgmtHdofcOrgId};				
				httpRequest(m.api.mistdrpdwn, data ,'GET','mistdrpdwn');
			}
			
		};		
		
		/* Success Callback */
		var successCallback = function(response, flag){
			
			switch (flag) { 
				case 'mistdrpdwnInit':
					
				break;
				case 'mistdrpdwn':       				// selectBox 조회					
					$.each(response, function(key, value){
						// 초기화
						/*m.select.msitRegBpId.clear();
						m.select.msitRegBpId.refresh();*/
						m.select.msitItemCd.clear();
						m.select.msitItemCd.refresh();
						
						$.each(response, function(key, value){
							
							/*if(key == 'msitRegBpId'){
								$.each(value, function(key, value){
									m.select.msitRegBpId.append($("<option></option>").val(value.comCd).html(value.comCdNm));
								});
							}else*/ 
								if(key == 'msitItemCd'){
								$.each(value, function(key, value){
									m.select.msitItemCd.append($("<option></option>").val(value.comCd).html(value.comCdNm));
								});
							}
						});
						
						//m.select.msitRegBpId.setSelected("전체");
						m.select.msitItemCd.setSelected("전체");
						
						//조회 
						if(m.hidden.popFlag.val() === 'I'){
							
						}
						else if(m.hidden.popFlag.val() === 'U'){
							
							//구분코드는 변경할수 없음.			
							m.div.msitWorkLnOplanDivCd_isEnabled.setEnabled (false);
							m.select.msitWorkLnOplanDivCd.setEnabled (false);
							
							//제조사는 직접 변경할수 없음.
							m.textBox.bpNm.setEnabled(false);
							
							//등록사는 직접 변경할수 없음.
							m.textBox.msitRegBpNm.setEnabled(false);
							
							// 측정기 관리대장 조회	
							httpRequest(m.api.mistingreg + "/msitSrno/"+m.hidden.msitSrno.val() +"/msitWorkLnOplanDivCd/" + m.hidden.paramMsitWorkLnOplanDivCd.val() , null,'GET','mistinitreg');
						}						
						
					});
					break;
				case 'mistsave':
					returnMessage(response);
					$a.close();
					return true;
					break;
				case 'mistinitreg':
					
					//m.select.msitWorkLnOplanDivCd.setSelected(response.resultVO.msitWorkLnOplanDivCd); //msitWorkLnOplanDivCd_isEnabled */
					m.select.msitWorkLnOplanDivCd.setSelected(response.resultVO.msitWorkLnOplanDivCd); //msitWorkLnOplanDivCd_isEnabled */
					m.select.msitVendBpId.setSelected(response.resultVO.msitVendBpId);
					m.select.msitMgmtHdofcOrgId.setSelected(response.resultVO.msitMgmtHdofcOrgId); //'00001196'
					//m.select.msitRegBpId.setSelected(response.resultVO.msitRegBpId);
					m.select.msitItemCd.setSelected(response.resultVO.msitItemCd);
					
					m.select.lesDivCd.setSelected(response.resultVO.lesDivCd);
					m.select.msmtPrdTypCd.setSelected(response.resultVO.msmtPrdTypCd);
					m.select.msitMnftYr.setSelected(response.resultVO.msitMnftYr);
					
					m.form.mistRegForm.setData(response.resultVO);
					
					//제조사
					m.textBox.bpId.val(response.resultVO.msitVendCd);
					m.textBox.bpNm.val(response.resultVO.msitVendNm);
					
					//등록사
					m.textBox.msitRegBpId.val(response.resultVO.msitRegBpId);
					m.textBox.msitRegBpNm.val(response.resultVO.msitRegBpNm);
					break;
				case 'mistupdate':
					returnMessage(response);
					$a.close();
					return true;					
					break;
				default:
			}
		};
		
		
		var failCallback = function(response){			
			returnMessage(response);
			$a.close();
			return false;
		};
		
		
		var returnMessage = function(response){
			$.each(response, function(key, value){				
				if(key === 'returnMessage'){
					alert(value);
				}
			});
		};
		
		
		function setComponentByCodeCallBack(){
			//alert('전체 공통코드 조회 callback');
		}
		
		function setSelectByCodeCallBack(rtnId){
			//alert('공통코드 세팅 callback \n ID : '+rtnId);
		}
		
		function setSelectByOrgCallBack(rtnId){
			//alert('조직코드 세팅 callback \n ID : '+rtnId);
		}
		
		/* event start  */
		
				
		
		// 5. dropdownBox 이벤트 바인딩
		
		// 5.1 협력사 selectbox change
       	m.select.msitVendBpId.on('change',function(e){
       		
       		 //구분이 장비인 경우 SK건설은 선택할수 없다.       		
       		if(m.select.msitWorkLnOplanDivCd.val() == "2" && m.select.msitVendBpId.val() == "SKEC"){
       			alert('구분이 장비인 경우는 '+ m.select.msitVendBpId.val()+'만 선택 가능 합니다.');
       			m.select.msitVendBpId.setSelected('');
       		}
       		
       		//등록사 필터 설정 : DB에서 Load함.
       		if(m.select.msitMgmtHdofcOrgId.val() != null && m.select.msitVendBpId.val() != null){
       			
       			// 측정기관리대장 DropDownBox 조회	
       			m.hidden.pageNo.val(0);  // 초기화
    			httpRequest(m.api.mistdrpdwn, m.form.mistRegForm.getData(),'GET','mistdrpdwnInit');	
       		}else{
       			
       			if(m.select.msitItemCd.val() != ''){
         			m.select.msitItemCd.setSelected('');			//품목	
         		}
         		
         		/*if(m.select.msitRegBpId.val() != ''){
         			m.select.msitRegBpId.setSelected('');			//등록사	
         		}*/
       		}
       		
       	 });
		
		// 5.2 지역 selectbox change
		m.select.msitMgmtHdofcOrgId.on('change',function(e){ 
       		
			//등록사 필터 설정 : DB에서 Load함.
       		if(m.select.msitMgmtHdofcOrgId.val() != null && m.select.msitVendBpId.val() != null){
       			
       			// 측정기관리대장 DropDownBox 조회	
       			m.hidden.pageNo.val(0);  // 초기화
    			httpRequest(m.api.mistdrpdwn, m.form.mistRegForm.getData(),'GET','mistdrpdwnInit');	
       		}else{
       			
       			if(m.select.msitItemCd.val() != ''){
         			m.select.msitItemCd.setSelected('');			//품목	
         		}
         		
         		/*if(m.select.msitRegBpId.val() != ''){
         			m.select.msitRegBpId.setSelected('');			//등록사	
         		}*/
       		}
       		
       	 });
		
    		
    	
		 // 5.2 등록사 변경시 이벤트
       	/*m.select.msitRegBpId.on('change',function(e){ 
       		//등록사 변경시 지역/협력사가 선택되어 있어야 변경 가능하다.
       		if((m.select.msitMgmtHdofcOrgId.val() == ''  || m.select.msitVendBpId.val() == '') && m.select.msitRegBpId.val() != '' ){
       			alert('등록사 변경시 협력사/지역을 선택하여 주십시오.');
       			m.select.msitRegBpId.prop('selectedIndex',0); 
       		}       		
       	 });*/
       	 
      	// 5.3 품목 변경시 이벤트
     	m.select.msitItemCd.on('change',function(e){ 
       		//품목 변경시 지역/협력사가 선택되어 있어야 변경 가능하다.
       		if((m.select.msitMgmtHdofcOrgId.val() == ''  || m.select.msitVendBpId.val() == '') && m.select.msitItemCd.val() != ''){
       			alert('품목 변경시 협력사/지역을 선택하여 주십시오.'); 
       			m.select.msitItemCd.prop('selectedIndex',0); 
       		}    
       	});
      	
     	// 5.4 구분 selectbox change
     	m.select.msitWorkLnOplanDivCd.on('change',function(e){ 			
     		
     		if(m.select.msitItemCd.val() != ''){
     			m.select.msitItemCd.setSelected('');			//품목	
     		}
     		
     		/*if(m.select.msitRegBpId.val() != ''){
     			m.select.msitRegBpId.setSelected('');			//등록사	
     		}*/
     		
     		m.select.msitMgmtHdofcOrgId.setSelected('');		// 지역
     		m.select.msitVendBpId.setSelected('');     			// 협력사
     		
     	});
     	
     // 5.6 제조사 버튼 클릭 이벤트
     	m.button.mistvend.on('click',function(e){ 			
     		
     		if(m.select.msitVendBpId.val() == ''){
       			alert('협력사를 선택하여 주십시오');
       			//m.select.msitVendBpId.focus();       			
       			document.getElementById('msitVendBpId').focus();
       		} 
     		else{     		
	     		if(m.textBox.bpId.val() != '' && m.textBox.bpNm.val() != ''){
					var hbpId = m.textBox.bpId.val();
					var hbpNm = m.textBox.bpNm.val();
					m.textBox.bpId.val('');
					m.textBox.bpNm.val('');
					setBp('bpId','bpNm');
					m.textBox.bpId.val(hbpId);
					m.textBox.bpNm.val(hbpNm);
				}else if(m.textBox.bpNm.val() == '') {
					m.textBox.bpId.val('');
					setBp('bpId','bpNm');
				}
				else if(m.textBox.bpNm.val() != '') {				
					setBp('bpId','bpNm');
				}
     		}
     	});
     
     	m.textBox.bpNm.on('change',function(e){		
			m.textBox.bpId.val('');
		});
     	
     	// 5.6 등록사 버튼 클릭 이벤트
     	m.button.mistregbp.on('click',function(e){ 			
     		
     		if(m.select.msitVendBpId.val() == ''){
       			alert('협력사를 선택하여 주십시오');
       			//m.select.msitVendBpId.focus();       			
       			document.getElementById('msitVendBpId').focus();
       		} 
     		else{     		
	     		if(m.textBox.msitRegBpId.val() != '' && m.textBox.msitRegBpNm.val() != ''){
					var hmsitRegBpId = m.textBox.msitRegBpId.val();
					var hmsitRegBpNm = m.textBox.msitRegBpNm.val();
					m.textBox.msitRegBpId.val('');
					m.textBox.msitRegBpNm.val('');
					setBp('msitRegBpId','msitRegBpNm');
					m.textBox.msitRegBpId.val(hmsitRegBpId);
					m.textBox.msitRegBpNm.val(hmsitRegBpNm);
				}else if(m.textBox.bpNm.val() == '') {
					m.textBox.msitRegBpId.val('');
					setBp('msitRegBpId','msitRegBpNm');
				}
				else if(m.textBox.msitRegBpNm.val() != '') {				
					setBp('msitRegBpId','msitRegBpNm');
				}
     		}
     	});
     
     	m.textBox.msitRegBpNm.on('change',function(e){		
			m.textBox.msitRegBpId.val('');
		});
     
     
     	// 5.6 close button click
     	m.button.mistclose.on('click',function(e){     		
     		$a.close();
     	});
       
      	
     	// 6. file attack button click
     	m.button.mistattach.on('click',function(e){
     		alert("file attach");
     	});
     	
      	
    	// 7. file delete button click
	  	m.button.mistfiledel.on('click',function(e){
	  		alert("file delete");
	  	});
    	
    	// 8. save button click
    	m.button.mistsave.on('click',function(e){
    		
    		// check
    		if(m.select.msitWorkLnOplanDivCd.val() === ''){
       			alert('구분을 선택하여 주십시오');
       			return false;
    		}
    		
    		if(m.select.msitVendBpId.val() === ''){
       			alert('협력사를 선택하여 주십시오');
       			return false;
    		}
    		
    		if(m.select.msitMgmtHdofcOrgId.val() == ''){
       			alert('지역을 선택하여 주십시오');
       			return false;
    		}
    		
    		if(m.select.msitRegBpId.val() == ''){
       			alert('등록사를 선택하여 주십시오');
       			return false;
    		}
    		
    		if(m.select.msitItemCd.val() == ''){
       			alert('품목를 선택하여 주십시오');
       			return false;
    		}
    	
    		if(m.hidden.popFlag.val() === 'I'){
   			 var rtnConfirm = confirm("등록 하시겠습니까?");
   	    		if (rtnConfirm == false) {
   	    		    return false;
   	    		}
	    		/*m.hidden.frstRegUserId.val("P093844"); // userID
	    		m.hidden.lastChgUserId.val("P093844"); // userID */
	    		httpRequest(m.api.mistsave, m.form.mistRegForm.getData(),'POST','mistsave');
    		}else if(m.hidden.popFlag.val() === 'U'){
   			 var rtnConfirm = confirm("변경 하시겠습니까?");
   	    		if (rtnConfirm == false) {
   	    		    return false;
   	    		}
    			//m.hidden.lastChgUserId.val("P093844"); // userID
	    		httpRequest(m.api.mistupdate, m.form.mistRegForm.getData(),'POST','mistupdate');
    		}
    	});
    	      	
		
		/* Popup */
		var openPopup = function(popupId,title,url,data,widthSize,heightSize,callBack){
			
			$a.popup({
	        	popid: popupId,
	        	title: title,	        	
	            url: url,
	            data: data,
	            width:widthSize,
	            height:heightSize,
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            callback: function(data) {
					callBack();
	           	}
	        });
		};
		
	  	/*init*/
		this.init = function(id, param) {
			
			m.hidden.popFlag.val(param.popFlag);
			m.hidden.msitSrno.val(param.msitSrno); // msitWorkLnOplanDivCd
			m.hidden.paramMsitWorkLnOplanDivCd.val(param.msitWorkLnOplanDivCd); // msitWorkLnOplanDivCd
			m.hidden.paramMsitVendBpId.val(param.msitVendBpId); // msitVendBpId
			m.hidden.paramMsitMgmtHdofcOrgId.val(param.msitMgmtHdofcOrgId); // msitVendBpId
			
			initSelectBind(param.msitVendBpId, param.msitMgmtHdofcOrgId );
			
			//initBind(param.msitSrno, param.msitWorkLnOplanDivCd);
			
	    };
});