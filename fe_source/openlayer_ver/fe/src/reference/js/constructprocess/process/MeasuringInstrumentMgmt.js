 /* MeasuringInstrumentMgmt.js
 *
 * @author P093844
 * @date 2016. 8. 08. 오전 11:06:03
 * @version 1.0
 */
	$a.page(function() {
		
		var m = {
				form: {
					searchFormObject:$('#searchForm')
				},
				select:{
					msitWorkLnOplanDivCd:$('#msitWorkLnOplanDivCd'),		  		// 구분
					msitVendBpId:$('#msitVendBpId'),				// 협력사
					msitMgmtHdofcOrgId:$('#msitMgmtHdofcOrgId'),	// 지역
					msitRegBpId:$('#msitRegBpId'),					// 등록사
					msitItemCd:$('#msitItemCd')						//품목
				},			
				button:{				
					mistsearch:$('#btnSearch'),					// 조회
					mistexcel:$('#btnExcelDown'),				// 엑셀 다운로드
					mistnew:$('#btnNewPopUp'),					// 신규
					msitdel:$('#btnDelete'),					// 삭제
					mistvend:$('#btnVendPopUp'),				// 제조사 조회
					mistregbp:$('#btnRegBpPopUp')				// 등록사 조회
					
				},
				textBox:{
					vendor:$('#txtMsitVendNm'),					// 제조사
					eqpMdl:$('#txtMsitEqpMdlNm'),				// 기종 : 
					serNo:$('#txtMsitSerNoVal'),				// 시리얼번호
					bpId:$('#bpId'),							// 제조사코드
					bpNm:$('#bpNm'),								// 제조사 명
					msitRegBpId:$('#msitRegBpId'),							// 등록사코드
					msitRegBpNm:$('#msitRegBpNm')								// 등록사 명
				},
				page:{
					pageNo:1
				},
				grid :{
					grid1:$('#mistgrid')
				},
				api:{
					mistlist:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentmgmt/list',						// 측정기관리대장 조회
					mistdel:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentmgmt?method=delete',	// 측정기관리대장 삭제
					mistdrpdwn:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentmgmt/dropdownlist',			// 측정기관리대장 DropDownBox 조회
					mistexceldown:'tango-transmission-biz/transmisson/constructprocess/process/measuringinstrumentmgmt/mistexceldown'			// 측정기관리대장 DropDownBox 조회
				},
				popup:{
					reg:{
						popid:'MeasuringInstrumentMgmtInfReg',
						title:'측정기 정보 등록',
						url:'MeasuringInstrumentMgmtInfReg.do',
						width:'1000',
						height : window.innerHeight * 0.9,
						data : '',
						callback : function(data) { // 팝업창을 닫을 때 실행 
			                alert("popup closed!"); 
			          }
					}
				},
				hidden:{
					pageNo:$('#pageNo')
				}
			};
		
		/*select*/
		var httpRequest = function(uri,data,method,flag){
			
			Tango.ajax({
				url : uri,
				data : data,
				method : method,
				flag:flag
			}).done(function(response){successCallback(response, flag);})
				.fail(function(response){failCallback(response, flag);});
			
		};
		
		var selectBind = function(){			
			
			// 측정기관리대장 DropDownBox 조회			
			httpRequest(m.api.mistdrpdwn, null,'GET','mistdrpdwn');	
			
			// TOBE 공통코드 조회 
			setComponentByCode('searchForm', setComponentByCodeCallBack);
			
			/* 조건절 TOBE 공통코드 조회*/
			// 협력사
			var comParamArg = new Array();
        	comParamArg.push("comCd:SKEC^UBINS^SKTS");        	
        	
			setSelectByCode('msitVendBpId','all', 'C00332', setSelectByCodeCallBack, comParamArg);
			
			//지역
			setSelectByOrg('msitMgmtHdofcOrgId','select',setSelectByOrgCallBack);
			//setSelectByOrgTeam('', 'all', $("#msitMgmtHdofcOrgId").val(), 'B', $.proxy(this.setSelectByOrgCallBack, this));
			
		};
		
		
		/* Grid */
		var initGrid = function () {
			m.grid.grid1.alopexGrid({
				autoColumnIndex: true,
	    		rowSingleSelect: false,
	    		message: {
	    			nodata: '데이터가 없습니다.'
	    		},	    	
			defaultColumnMapping: {
					editable : true
			},	
			headerGroup: [
  	        			{fromIndex:11, toIndex:13, title:"교정", id:'crctDt'}    	        		 
  	        ],  
			columnMapping: [			                
			    			{
			    				align : 'center',
			    				key : 'check',
			    				width : '30px',
			    				selectorColumn : true
			    			}, {
			    				key : 'msitWorkClNm', align:'center',
			    				title : '구분',
			    				width: '50'
			    			}, {
			    				key : 'msitVendBpNm', align:'center',
			    				title : '협력사',
			    				width: '60'
			    			}, {
			    				key : 'msitMgmtHdofcOrgNm', align:'center',
			    				title : '지역',
			    				width: '100'
			    			}, {
			    				key : 'msitRegBpNm', align:'center',
			    				title : '등록사',
			    				width: '110'
			    			}, {
			    				key : 'msitItemNm', align:'left',
			    				title : '품목',
			    				width: '120'
			    			},{
			    				key : 'msitVendNm', align:'center',
			    				title : '제조사',
			    				width: '240'
			    			}, {
			    				key : 'msitEqpMdlNm', align:'center',
			    				title : '기종',
			    				width: '120'
			    			}, {
			    				key : 'msitMnftYr', align:'center',
			    				title : '제조년도',
			    				width: '60'				
			    			}, {
			    				key : 'msitSerNoVal', align:'left',
			    				title : '시리얼번호',
			    				width: '80'				
			    			}, {
			    				key : 'lesDivNm', align:'center',
			    				title : '자가/임차',
			    				width: '80'				
			    			},{
			    				key : 'msmtPrdTypNm', align:'center',
			    				title : '주기',
			    				width: '70'				
			    			},{
			    				key : 'fstMsitCrctDt', align:'center',
			    				title : '1차',
			    				width: '80'				
			    			},{
			    				key : 'scndMsitCrctDt', align:'center',
			    				title : '2차',
			    				width: '80'
			    			},{
			    				key : 'prfDocmtNm', align:'center',
			    				title : '증빙서류',
			    				width: '60'
			    			},{
			    				key : 'msitVendBpId', align:'center',
			    				title : '협력사ID',
			    				width: '60',
			    				hidden : true
			    			},{
			    				key : 'msitMgmtHdofcOrgId', align:'center',
			    				title : '지역ID',
			    				width: '60',
			    				hidden : true
			    			}]
	    	});
		};		
			
		var showProgress = function(gridId){
			gridId.alopexGrid('showProgress');
		};
		
		var hideProgress = function(gridId){
			gridId.alopexGrid('hideProgress');
		};
	
		
		/* Callback */
		var successCallback = function(response, flag){
			switch (flag) { 
				case 'mistdrpdwn':       				// 측정기관리대장 DropDownBox 조회
					
					// 초기화
					m.select.msitRegBpId.clear();
					m.select.msitRegBpId.refresh();
					m.select.msitItemCd.clear();
					m.select.msitItemCd.refresh();
					
					$.each(response, function(key, value){
						
						if(key == 'msitRegBpId'){
							$.each(value, function(key, value){
								m.select.msitRegBpId.append($("<option></option>").val(value.comCd).html(value.comCdNm));
							});
						}else if(key == 'msitItemCd'){
							$.each(value, function(key, value){
								m.select.msitItemCd.append($("<option></option>").val(value.comCd).html(value.comCdNm));
							});
						}
					});
					
					m.select.msitRegBpId.setSelected("전체");
					m.select.msitItemCd.setSelected("전체");
					break;			
				case 'mistlist': 						// 측정기관리대장 조회 검색 버튼 수행시	
					//pager, list setting
		    		$.each(response, function(key, value) { 
		    			switch (key) {
		    			case 'pager' :  				 
		    				  $.each(value, function(key, value){
		    					  if(key == 'totalCnt'){
		    						  m.grid.grid1.alopexGrid('updateOption',
									  {paging : {pagerTotal : function(paging) {
											return '총 건수 : ' + value;
										}}}
								    	);
		    					  	}    
		    				  });
		    				  break;
		    			 case 'measuringInstrumentMgmtList' :
		    				 		hideProgress(m.grid.grid1);
		    				 		if(value == 0){
		    				 			m.grid.grid1.alopexGrid('dataSet', value);	
					    				alert('조회된 데이터가 없습니다.');
					    			}
					    			else{					    				
					    				m.grid.grid1.alopexGrid('dataSet', value);							    		
					    			}					    			
					    		break;
					      default:
				    	   }
		    			});
		    		break;
				case 'mistlistscroll': 						// 측정기관리대장 조회 scroll 수행시
					//pager, list setting
					hideProgress(m.grid.grid1);
		    		$.each(response, function(key, value) { 	    			
			    		
		    			switch (key) {
		    			case 'pager' :  				 
		    				  $.each(value, function(key, value){
		    					  if(key == 'totalCnt'){
		    						  m.grid.grid1.alopexGrid('updateOption',
									  {paging : {pagerTotal : function(paging) {
											return '총 건수 : ' + value;
										}}}
								    	);
		    					  	}    
		    				  });
		    				  break;
		    			 case 'measuringInstrumentMgmtList' :
		    				 		hideProgress(m.grid.grid1);
					    			if(value == 0){
					    				alert('더 이상 조회될 데이터가 없습니다');
					    			}
					    			else{					    				
					    				m.grid.grid1.alopexGrid('dataAdd', value);							    		
					    			}					    			
					    		break;
					      default:
				    	   }
		    			});
		    			break;
				case 'mistdel':												// 측정기관리대장 삭제
					$.each(response, function(key, value){
						hideProgress(m.grid.grid1);
						if(key === 'returnMessage'){
							alert(value);
						}				
					});			
				    	m.hidden.pageNo.val(parseInt(m.page.pageNo));						
						httpRequest(m.api.mistlist, m.form.searchFormObject.getData(),'GET','mistlist');
	    			break;
				default:
			}
		};
		
		
		// ajax fail Callback
		var failCallback = function(response){			
			
			// API Framework Error Code
			hideProgress(m.grid.grid1);
			if(response !== null){
				alert(response.message);
			} else {
				// DB Call Error Message
				var strMsg = response.returnMessage
				alert(strMsg);
			}
			$a.close("fail");
			return false;
		};
		
		// return message alert
		var returnMessage = function(response){
			var strMsg = response.returnMessage
			alert(strMsg);
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
		
		// 1. 검색버튼 클릭시
	  	m.button.mistsearch.on('click',function(e){
	  		
	  		showProgress(m.grid.grid1);			
	    	m.hidden.pageNo.val(parseInt(m.page.pageNo));	    		  	
	  		httpRequest(m.api.mistlist, m.form.searchFormObject.getData(),'GET','mistlist');
	  	});
				
		// 2. 엑셀 버튼 클릭시
		m.button.mistexcel.on('click',function(e){
	         // tango transmission biz 모듈을 호출하여야한다.
	         // 검색조건에 해당하는 전체 Row Excel Download
	         /* httpRequest(m.api.mistexceldown, m.form.searchFormObject.getData(),'GET','mistexceldown'); */	         
	         
	         
			 var worker = new ExcelWorker({
	         		excelFileName : '측정기관리',
	         		palette : [{
	         			className : 'B_YELLOW',
	         			backgroundColor: '255,255,0'
	         		},{
	         			className : 'F_RED',
	         			color: '#FF0000'
	         		}],
	         		sheetList: [{
	         			sheetName: '측정기관리',
	         			$grid: $('#mistgrid')
	         		}]
	         	});
	         	worker.export({
	         		merge: false,
	         		exportHidden: false,
	         		filtered  : false,
	         		selected: false,
	         		useGridColumnWidth : true,
	         		border  : true
	         	});	         	
	         	
	         	
	         });		
		
		// 3. Grid의 마지막 Scroll 이 될때 발생하는 Event
		m.grid.grid1.on('scrollBottom', function(e){	
			
			showProgress(m.grid.grid1);	
			m.hidden.pageNo.val(parseInt(m.hidden.pageNo.val())+1);			
           	httpRequest(m.api.mistlist, m.form.searchFormObject.getData(),'GET','mistlistscroll');			
		});	
		
		// 4. 그리드 셀 클릭 이벤트 바인딩
	  	m.grid.grid1.on('dblclick','.bodycell', function(e){
	  		
	  		var ev = AlopexGrid.parseEvent(e);
    		var dataObj = ev.data;
    		var mapping = ev.mapping;

    		/* alert(JSON.stringify(dataObj));
    		alert(dataObj.msitSrno + "   " + dataObj.msitWorkLnOplanDivCd); */
    		
    		if(dataObj.msitSrno != '' && dataObj.msitWorkLnOplanDivCd != ''){
	    		openPopup(m.popup.reg.popid,
	  				      m.popup.reg.title,
	  				      m.popup.reg.url,	  			
	  				      {"msitSrno" :dataObj.msitSrno, 
	    				   "msitWorkLnOplanDivCd" :dataObj.msitWorkLnOplanDivCd, 
	    				   "msitVendBpId" : dataObj.msitVendBpId, 
	    				   "msitMgmtHdofcOrgId" : dataObj.msitMgmtHdofcOrgId,  
	    				   "popFlag" : "U"},
	  				      m.popup.reg.width,
	  				      m.popup.reg.heigth
	  				  );      
    		}
	  		
		});
		
		// 5. dropdownBox 이벤트 바인딩
		
		// 5.1 협력사 변경시 이벤트
       	m.select.msitVendBpId.on('change',function(e){ 
       		
       		 //구분이 장비인 경우 SK건설은 선택할수 없다.       		
       		if(m.select.msitWorkLnOplanDivCd.val() == "2" && m.select.msitVendBpId.val() == "SKEC"){
       			alert('구분이 장비인 경우는 '+ m.select.msitVendBpId.val()+'만 선택 가능 합니다.');
       			m.select.msitVendBpId.setSelected('');
       		}
       		
       		//등록사 필터 설정 : DB에서 Load함.
       		if(m.select.msitMgmtHdofcOrgId.val() != null && m.select.msitVendBpId.val() != null){       			
       			
         		// 측정기관리대장 DropDownBox 조회	
       			m.hidden.pageNo.val(parseInt(m.page.pageNo));  // 초기화
    			httpRequest(m.api.mistdrpdwn, m.form.searchFormObject.getData(),'GET','mistdrpdwn');	
       		}else{
       			
       			if(m.select.msitItemCd.val() != ''){
         			m.select.msitItemCd.setSelected('');			//품목	
         		}
         		
         		/*if(m.select.msitRegBpId.val() != ''){
         			m.select.msitRegBpId.setSelected('');			//등록사	
         		}*/
       		}
       		
       	 });
		
		// 5.2 지역 변경시 이벤트
		m.select.msitMgmtHdofcOrgId.on('change',function(e){ 
			
			//등록사 필터 설정 : DB에서 Load함.
       		if(m.select.msitMgmtHdofcOrgId.val() != null && m.select.msitVendBpId.val() != null){
       			
       			// 측정기관리대장 DropDownBox 조회	
       			m.hidden.pageNo.val(parseInt(m.page.pageNo)); // 초기화
    			httpRequest(m.api.mistdrpdwn, m.form.searchFormObject.getData(),'GET','mistdrpdwn');	
       		}else{
       			
       			if(m.select.msitItemCd.val() != ''){
         			m.select.msitItemCd.setSelected('');			//품목	
         		}
         		
         		/*if(m.select.msitRegBpId.val() != ''){
         			m.select.msitRegBpId.setSelected('');			//등록사	
         		}*/
       		}
       		
       	 });
    	
       	 // 5.3 등록사 변경시 이벤트
   /*    	m.select.msitRegBpId.on('change',function(e){ 
       		//등록사 변경시 지역/협력사가 선택되어 있어야 변경 가능하다.
       		if((m.select.msitMgmtHdofcOrgId.val() == ''  || m.select.msitVendBpId.val() == '') && m.select.msitRegBpId.val() != '' ){
       			alert('등록사 변경시 협력사/지역을 선택하여 주십시오.');
       			m.select.msitRegBpId.prop('selectedIndex',0); 
       		}       		
       	 });*/
       	 
      	// 5.4 품목 변경시 이벤트
     	m.select.msitItemCd.on('change',function(e){ 
       		//품목 변경시 지역/협력사가 선택되어 있어야 변경 가능하다.
       		if((m.select.msitMgmtHdofcOrgId.val() == ''  || m.select.msitVendBpId.val() == '') && m.select.msitItemCd.val() != ''){
       			alert('품목 변경시 협력사/지역을 선택하여 주십시오.'); 
       			m.select.msitItemCd.prop('selectedIndex',0); 
       		}    
       	});
      	
     	// 5.5 구분 변경시 이벤트
     	m.select.msitWorkLnOplanDivCd.on('change',function(e){ 			
     		
     		if(m.select.msitItemCd.val() != ''){
     			m.select.msitItemCd.setSelected('');			//품목	
     		}
     		
     		/*if(m.select.msitRegBpId.val() != ''){
     			m.select.msitRegBpId.setSelected('');			//등록사	
     		}*/
     		
     		//m.select.msitMgmtHdofcOrgId.setSelected('');		// 지역
     		m.select.msitVendBpId.setSelected('');     			// 협력사
     		
     	});
     	
     // 5.6 제조사 버튼 클릭 이벤트
     	m.button.mistvend.click(function(e){ 			
     		
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
     	m.button.mistregbp.click(function(e){ 			
     		
     		if(m.select.msitVendBpId.val() == ''){
       			alert('협력사를 선택하여 주십시오');
       			//m.select.msitVendBpId.focus();       			
       			document.getElementById('msitVendBpId').focus();
       		} 
     		else{      		
	     		if(m.textBox.msitRegBpId.val() != '' && m.textBox.msitRegBpNm.val() != ''){
					var hmsitRegBpId = m.textBox.msitRegBpId.val();
					var hbpNm = m.textBox.msitRegBpNm.val();
					m.textBox.msitRegBpId.val('');
					m.textBox.msitRegBpNm.val('');
					setBp('msitRegBpId','msitRegBpNm');
					m.textBox.msitRegBpId.val(hbpId);
					m.textBox.msitRegBpNm.val(hbpNm);
				}else if(m.textBox.msitRegBpNm.val() == '') {
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
     	
      	
       
      	// 6. 등록 click
      	m.button.mistnew.click(function(e){
      		
      		openPopup(m.popup.reg.popid,
      				  m.popup.reg.title,
      				  m.popup.reg.url,
      				  {"popFlag" : "I"},
      				  m.popup.reg.width,
      				  m.popup.reg.heigth
      				 );
      	});
      	
    	// 7. 삭제 click
	  	m.button.msitdel.click(function(e){
	  		
	  	 	var selectData = $('#mistgrid').alopexGrid('dataGet', {_state:{selected:true}});
        	var ev = AlopexGrid.parseEvent(e);
    		var data = ev.data;

        	if(selectData == ''){
        		alert('삭제할 측정기 관리 대장을 체크하여 주십시오.');
        		return;
        	}
        	
        	//alert(JSON.stringify(selectData));

        	if (confirm('삭제하시겠습니까?')) {
        		//삭제시 기존에 등록된 증빙서류 파일도 함께 삭제한다.
        		alert("증빙서류 파일 삭제: 작업중");
        		httpRequest(m.api.mistdel,selectData, 'POST', 'mistdel');         		
        	} 
	  	});
    	
		
		/* Popup */
		var openPopup = function(popupId,title,url,data,widthSize,heightSize){
			
			$a.popup({
	        	popid: popupId,
	        	title: title,
	            url: url,
	            modal: true,
			    movable:false,
	            data: data,
	            width:widthSize,
	            height:heightSize,
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            callback: function (data) {
	  		                if(data != null){ // 팝업 우측 상단 x 버튼으로 닫을 경우, $a.close(data); 와 같이 data를 넘겨주지 않으므로 data === null이다.
	  		                
	  		                showProgress(m.grid.grid1);	  		  			
	  		  	    		m.hidden.pageNo.val(parseInt(m.page.pageNo));	  		  	    		  	
	  		  	  			httpRequest(m.api.mistlist, m.form.searchFormObject.getData(),'GET','mistlist');
	  		              }
	  				  }
	        });
		};
		
	  	/*init*/
		this.init = function(id, param) {
			selectBind();			  
			initGrid();
	    };
});