
var main = $a.page(function() {
	
	Highcharts.setOptions({
		colors:['#50B432', '#DDDF00', '#ED561B']
	});
	
	
	Highcharts.chart('chartArea1', {
		
		chart: {
			height:210,
			width:350,
			
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			
			type: 'pie',
			options3d: {
				enabled: true,
				alpha: 45
			}
		},
		
		title: {
			text:'[중/통/집 전력 건강도]'
			
		},
		
		exporting: {enabled: false},
		
		tooltip: {
			
		},
		
		credits: {
			text: ' ',
			
		},
		
		plotOptions: {
			pie: {
				allowPointSelect : true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format:'{point.y}',
					 
				},
		
				innerSize: 70,
				depth:45
			}
			
		},
		
		series: [{
			name: '건강도',
			colorByPoint: true,
			data: [{
				name: 'Green',
				y: 381
			},
			{
				name: 'Yellow',
				y: 57
			},
			{
				name: 'Red',
				y: 30
			}]
			
			
		}]
		
		
		
	});
	
	
	$('#gridArea1').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"4row",
		width:"parent",
		pager:false,
		columnMapping: [{
			key : '구분', align:'center',
			title : '구분',
			width: '80px'
		}, {
			key : '국소수', align:'center',
			title : '국소 수',
			width: '80px'			
		}],
		
		data : data1,
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea2').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '관심', align:'center',
			title : '관심',
			width: '80px'			
		}],
		
		data : data2, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea3').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '불량', align:'center',
			title : '불량',
			width: '80px'			
		}, {
			key : '미설치', align:'center',
			title : '미설치',
			width: '80px'			
		}],
		
		data : data3, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea4').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '관심', align:'center',
			title : '관심',
			width: '80px'			
		}],
		
		data:data4, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea5').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '관심', align:'center',
			title : '관심',
			width: '80px'			
		}],
		
		data:data5, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea6').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"3row",
		pager:false,
		columnMapping: [{
			key : '구분', align:'center',
			title : '구분',
			width: '60px'
		}, {
			key : '부족', align:'center',
			title : '부족',
			width: '60px'			
		}],
		
		data:data6, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea7').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"4row",
		pager:false,
		columnMapping: [{
			key : '구분', align:'center',
			title : '구분',
			width: '80px'
		}, {
			key : 'Cell수량', align:'center',
			title : 'Cell수량',
			width: '80px'			
		}],
		
		data:data7, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea8').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '전체조수', align:'center',
			title : '전체조수',
			width: '80px'
		}, {
			key : '부족조수', align:'center',
			title : '부족조수',
			width: '80px'			
		}],
		
		data:data8, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea9').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '초과', align:'center',
			title : '초과',
			width: '80px'			
		}],
		
		data:data9, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea10').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"4row",
		pager:false,
		columnMapping: [{
			key : '구분', align:'center',
			title : '구분',
			width: '80px'
		}, {
			key : '수량', align:'center',
			title : '수량',
			width: '80px'			
		}],
		
		data:data10, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea11').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '전체수량', align:'center',
			title : '전체수량',
			width: '70px'
		}, {
			key : '여유수량', align:'center',
			title : '여유수량',
			width: '70px'			
		}, {
			key : '부족수량', align:'center',
			title : '부족수량',
			width: '70px'			
		}],
		
		data:data11, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea12').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '부족', align:'center',
			title : '부족',
			width: '80px'			
		}],
		
		data:data12,
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea13').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '부족', align:'center',
			title : '부족',
			width: '80px'			
		}],
		
		data:data13, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea14').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '완료', align:'center',
			title : '완료',
			width: '80px'
		}, {
			key : '미완료', align:'center',
			title : '미완료',
			width: '80px'			
		}],
		
		data:data14,
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea15').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '설치', align:'center',
			title : '설치',
			width: '80px'
		}],
		
		data:data15, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea16').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '양호', align:'center',
			title : '양호',
			width: '80px'
		}, {
			key : '부족', align:'center',
			title : '부족',
			width: '80px'			
		}],
		
		data:data16, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea17').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"5row",
		pager:false,
		columnMapping: [{
			key : '구분', align:'center',
			title : '구분',
			width: '80px'
		}, {
			key : '수량', align:'center',
			title : '수량',
			width: '80px'			
		}],
		
		data:data17, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea18').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '설치', align:'center',
			title : '설치',
			width: '80px'
		}],
		
		data:data18, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea19').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '감시', align:'center',
			title : '감시',
			width: '80px'
		}, {
			key : '미감시', align:'center',
			title : '미감시',
			width: '80px'			
		}],
		
		data:data19, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea20').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '감시', align:'center',
			title : '감시',
			width: '80px'
		}, {
			key : '미감시', align:'center',
			title : '미감시',
			width: '80px'			
		}],
		
		data:data20, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea21').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '설치', align:'center',
			title : '설치',
			width: '80px'
		}, {
			key : '미설치', align:'center',
			title : '미설치',
			width: '80px'			
		}],
		
		data:data21, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea22').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"1row",
		pager:false,
		columnMapping: [{
			key : '설치', align:'center',
			title : '설치',
			width: '80px'
		}, {
			key : '미설치', align:'center',
			title : '미설치',
			width: '80px'			
		}],
		
		data:data22, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('#gridArea23').alopexGrid({
    	autoColumnIndex: true,
		autoResize: false,
		height:"3row",
		pager:false,
		columnMapping: [{
			key : '구분', align:'center',
			title : '구분',
			width: '80px'
		}, {
			key : '알람수', align:'center',
			title : '알람 수',
			width: '80px'			
		}],
		
		data:data23, 
		
		message: {
			nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
		}
    });
	
	$('path').on('click', function(e){
		
		if($(this).attr('fill') == 'rgb(255,111,52)'){
			var modal = document.getElementById('myModal');
			modal.style.display='block';
			
			//제목
			$('.popupHeader').html('건강도 [RED]');
			
			//AlopexGrid
			$('#modalAlopexGrid').alopexGrid({
				height:'10row',
				
				pager:false,
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
				               { fromIndex : 6, toIndex : 9, title:'수전'},
				               { fromIndex : 10, toIndex : 12, title:'정류기'},
				               { fromIndex : 13, toIndex : 16, title:'축전지'},
				               { fromIndex : 17, toIndex : 18, title:'비상전원'},
				               { fromIndex : 19, toIndex : 20, title:'부대설비'},
				               { fromIndex : 21, toIndex : 22, title:'환경'},
				               { fromIndex : 23, toIndex : 24, title:'점수'}
				             
				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true 
				}, {
					key : '건강도', align:'center',
					title : '건강도',
					styleclass : 'highlight',
					width: '80px'
				}, {
					key : '국소명', align:'center',
					title : '국소명',
					width: '80px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '80px'
				}, {
					key : 'CMS국소명', align:'center',
					title : 'CMS국소명',
					width: '80px'
				}, {
					key : '운용Cell수', align:'center',
					title : '운용Cell수',
					width: '80px'
				}, {
					key : '수전_계약전력', align:'center',
					title : '계약전력',
					styleclass : 'highlight',
					width: '80px'
				}, {
					key : '수전_Main차단기용량', align:'center',
					title : 'Main차단기용량',
					width: '80px'
				}, {
					key : '수전_차단기', align:'center',
					title : '차단기/케이블 발열',
					width: '80px'
				}, {
					key : '수전_SPD설치', align:'center',
					title : 'SPD설치',
					width: '80px'
				}, {
					key : '정류기_모듈적정수량', align:'center',
					title : '모듈적정수량',
					width: '80px'
				}, {
					key : '정류기_IPD차단기용량', align:'center',
					title : 'IPD차단기용량',
					width: '80px'
				}, {
					key : '정류기_BR해제', align:'center',
					title : 'BR해제',
					width: '80px'
				}, {
					key : '축전지_축전지적정용량', align:'center',
					title : '축전지적정용량',
					width: '80px'
				}, {
					key : '축전지_축전지상태', align:'center',
					title : '축전지상태',
					width: '80px'
				}, {
					key : '축전지_축전지내부저항', align:'center',
					title : '축전지 내부저항',
					width: '80px'
				}, {
					key : '축전지_전압강하', align:'center',
					title : '축전지 케이블 전압강하',
					width: '80px'
				}, {
					key : '비상전원_발전기', align:'center',
					title : '발전기 전원공급 프로세스',
					width: '80px'
				}, {
					key : '비상전원_이동용', align:'center',
					title : '이동용 발전기 단자함',
					width: '80px'
				}, {
					key : '부대설비_냉방기', align:'center',
					title : '냉방기 적정용량',
					width: '80px'
				}, {
					key : '부대설비_소화설비관리', align:'center',
					title : '소화설비관리',
					width: '80px'
				}, {
					key : '환경_환경감시장치', align:'center',
					title : '환경감시장치',
					width: '80px'
				}, {
					key : '환경_보안', align:'center',
					title : '보안',
					width: '80px'
				}, {
					key : '점수_만점', align:'center',
					title : '만점',
					width: '80px'
				}, {
					key : '점수_취득', align:'center',
					title : '취득',
					width: '80px'
				}],
			
				data:ChartModalData,
				
				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
			
			
		}
			
		
	});
	
	
	$('.cell.bodycell').on('click', function(e){
		
		// CASE 1. 계약전력 초과 국소
		if($(this).attr('data-alopexgrid-key') == '국소수' && $(this).attr('title') =='47')
		{
			var modal = document.getElementById('myModal');
			modal.style.display='block';
			
			//제목
			$('.popupHeader').html('계약전력현황 [100%]');
			
			//AlopexGrid
			$('#modalAlopexGrid').alopexGrid({
				height:'10row',
				
				pager:false,
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true 
				}, {
					key : 'SKT본부', align:'center',
					title : 'SKT본부',
					width: '130px'
				}, {
					key : 'O&S팀', align:'center',
					title : 'O&S팀',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}],
			
				data:modalData1,
				
				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		
		}
		
		// CASE 2. 차단기 초과 국소
		if($(this).attr('data-alopexgrid-key') == '관심' && $(this).attr('title') =='9')
		{
			var modal = document.getElementById('myModal');
			modal.style.display='block';
			
			//제목
			$('.popupHeader').html('차단기 용량 현황 [관심]');
			
			//AlopexGrid
			$('#modalAlopexGrid').alopexGrid({
				height:'10row',
				
				pager:false,
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true 
				}, {
					key : 'SKT본부', align:'center',
					title : 'SKT본부',
					width: '130px'
				}, {
					key : 'O&S팀', align:'center',
					title : 'O&S팀',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}],
			
				data:modalData2,
				
				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		
		}
		
		// CASE 3. 정류기 및 모듈 부족
		if($(this).attr('data-alopexgrid-key') == '부족' && $(this).attr('title') =='65'){
			
			var modal = document.getElementById('myModal');
			modal.style.display='block';
			
			//제목
			$('.popupHeader').html('모듈 부족 국소 [부족]');
			
			//AlopexGrid
			$('#modalAlopexGrid').alopexGrid({
				height:'10row',
				
				pager:false,
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true 
				}, {
					key : 'SKT본부', align:'center',
					title : 'SKT본부',
					width: '130px'
				}, {
					key : 'O&S팀', align:'center',
					title : 'O&S팀',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				},{
					key : '정류기시스템명', align:'center',
					title : '정류기 시스템명',
					width: '130px'
				}],
			
				data:modalData3,
				
				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}
		
		// CASE 4. 알람 현황 CR
		if($(this).attr('data-alopexgrid-key') == '알람수' && $(this).attr('title') =='4'){
			
			var modal = document.getElementById('myModal');
			modal.style.display='block';
			
			//제목
			$('.popupHeader').html('알람 현황 [CR]');
			
			//AlopexGrid
			$('#modalAlopexGrid').alopexGrid({
				height:'10row',
				
				pager:false,
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				columnMapping: [{
					key : '등급', align:'center',
					title : '등급',
					width: '50px'
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '100px'
				}, {
					key : '발생시간', align:'center',
					title : '발생시간',
					width: '130px'
				}, {
					key : '장비명', align:'center',
					title : '장비명',
					width: '100px'
				},{
					key : '상면번호', align:'center',
					title : '상면번호',
					width: '50px'
				},{
					key : '내용', align:'center',
					title : '내용',
					width: '200px'
				}],
			
				data:modalData4,
				
				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}
		
		
		
	});
	
	
	$('#btnModalClose').on('click', function(e) {
		
		var modal = document.getElementById('myModal');
		modal.style.display='none';
	});
	
	
	
	//바디셀 색칠하기
	function test(){
		
		$('.cell.bodycell[data-alopexgrid-key="관심"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="부족"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="미설치"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="부족수량"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="초과"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="부족조수"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="미감시"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="미완료"]').css('background-color', 'rgb(255, 200, 200)');
		$('.cell.bodycell[data-alopexgrid-key="불량"]').css('background-color', 'rgb(255, 200, 200)');
	}
	test();
	
	
})