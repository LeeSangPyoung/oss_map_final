

var main = $a.page(function() {

	drawAlopexGrid('tab_SuBae');
	drawAlopexGrid('tab_JungRyu');
	drawAlopexGrid('tab_ChukJun');
	drawAlopexGrid('tab_NaengBang');
	drawAlopexGrid('tab_SoHwa');
	drawAlopexGrid('tab_BalJun');
	drawAlopexGrid('tab_GunGang');
	drawAlopexGrid('tab_GoJang');
	drawAlopexGrid('tab_SuRi');



	$('#btnSearch').on('click', function(e){
		var now = $('#TabSelector').val();

		//AlopexGrid 데이터 셋팅
		if(now == 'tab_SuBae'){

			$('#dataSuBae').alopexGrid('dataSet', dataTab1);

			$('.cell.bodycell[data-alopexgrid-key="국사명"]').click(function(e){
				//입전확인 팝업
				var modal = document.getElementById('myModal3');
				modal.style.display='block';


			});

		}else if(now == 'tab_JungRyu'){

			$('#dataJungRyu').alopexGrid('dataSet', dataTab2);

		}else if(now == 'tab_ChukJun'){

			$('#dataChukJun').alopexGrid('dataSet', dataTab3);

		}else if(now == 'tab_NaengBang'){

			$('#dataNaengBang').alopexGrid('dataSet', dataTab4);

		}else if(now == 'tab_SoHwa'){

			$('#dataSoHwa').alopexGrid('dataSet', dataTab5);

		}else if(now == 'tab_BalJun'){

			$('#dataBalJun').alopexGrid('dataSet', dataTab6);

		}else if(now == 'tab_GunGang'){

			$('#dataGunGang').alopexGrid('dataSet', dataTab7);

		}else if(now == 'tab_GoJang'){

			$('#dataGoJang').alopexGrid('dataSet', dataTab8);

		}else if(now == 'tab_SuRi'){

			$('#dataSuRi').alopexGrid('dataSet', dataTab9);

		}
	});

	$('.Tab').children().on('click', function(e){
		var tabId = this.id;

		if(tabId =='tab_SuBae'){
			$('#TabSelector').val('tab_SuBae');
			drawDetailCondition('tab_SuBae');
			$('#modalChart').empty();

		}else if(tabId =='tab_JungRyu'){
			$('#TabSelector').val('tab_JungRyu');
			drawDetailCondition('tab_JungRyu');
			$('#modalChart').empty();
		}else if(tabId =='tab_ChukJun'){

			$('#TabSelector').val('tab_ChukJun');
			drawDetailCondition('tab_ChukJun');
			$('#modalChart').empty();
		}else if(tabId =='tab_NaengBang'){

			$('#TabSelector').val('tab_NaengBang');
			drawDetailCondition('tab_NaengBang');
			$('#modalChart').empty();
		}else if(tabId =='tab_SoHwa'){

			$('#TabSelector').val('tab_SoHwa');
			drawDetailCondition('tab_SoHwa');
			$('#modalChart').empty();
		}else if(tabId =='tab_BalJun'){

			$('#TabSelector').val('tab_BalJun');
			drawDetailCondition('tab_BalJun');
			$('#modalChart').empty();
		}else if(tabId =='tab_GunGang'){

			$('#TabSelector').val('tab_GunGang');
			drawDetailCondition('tab_GunGang');
			$('#modalChart').empty();
		}else if(tabId =='tab_GoJang'){

			$('#TabSelector').val('tab_GoJang');
			drawDetailCondition('tab_GoJang');
			$('#modalChart').empty();
		}else if(tabId =='tab_SuRi'){

			$('#TabSelector').val('tab_SuRi');
			drawDetailCondition('tab_SuRi');
			$('#modalChart').empty();
		}else if(tabId =='tab_JeungSul'){
			$('#modalChart').empty();
			$('#TabSelector').val('tab_JeungSul');
			drawDetailCondition('tab_JeungSul');
			$('#modalChart').empty();

			var image = document.getElementById('dataJeungSul');
			image.style.display='block';
		}




	});

	$('#btnMore').on('click', function(e){

		if($('#detailCondition').html() == '')
			$('#detailCondition').html(tagToTab1);

		var x = $('.more_condition').css('display');
		if(x == 'none'){
			$('.more_condition').css('display', 'block');
			return;
		}else{
			$('.more_condition').css('display', 'none');
			return;
		}


	});



	$('#btnTrend').on('click', function(e) {

		var modal = document.getElementById('myModal');
		modal.style.display='block';

		var nowTab = $('#TabSelector').val();

		if(nowTab == 'tab_SuBae'){
			// 분석항목 설정
			var tag = '<option>부하전류</option>'
					+ '<option>계약전력 부하율</option>'
					+ '<option>메인분전반 부하전류(평균)</option>'
					+ '</select>';
			$('#modalSelector').html(tag);


			//Chart 수배전 - 1

			//drawChart(nowTab, $('#modalSelector').val());

		}else if(nowTab == 'tab_JungRyu'){
			// 분석항목 설정
			var tag = '<option>출력전류</option>'
					+ '<option>부하율</option>'
					+ '<option>모듈 과부족</option>'
					+ '<option>전압강하</option>'
					+ '<option>축전지 백업예상</option>'
					+ '</select>';
			$('#modalSelector').html(tag);



			// Chart 정류기 - 1

			//drawChart(nowTab, $('#modalSelector').val());

		}else if(nowTab == 'tab_ChukJun'){
			// 분석항목 설정
			var tag = '<option>부하전류</option>'
					+ '<option>내부저항 분석</option>'
					+ '<option>방전 결과 분석</option>'
					+ '</select>';
			$('#modalSelector').html(tag);
			$('#modalSelector').val('내부저항 분석');


			//drawChart(nowTab, $('#modalSelector').val());


		}else{
			Highcharts.chart('modalChart');
		}


	});//end of btnTrend


	$('#btnAnalyze').on('click', function(e){
		var nowTab = $('#TabSelector').val();
		var analyze = $('#modalSelector').val();
		drawChart(nowTab, analyze);
	});


	$('#btnModalClose').on('click', function(e) {

		var modal = document.getElementById('myModal');
		modal.style.display='none';
	});
	$('#btnModalClose2').on('click', function(e) {
		var modal = document.getElementById('myModal2');
		modal.style.display='none';
	});
	$('#btnModalClose3').on('click', function(e) {
		var modal = document.getElementById('myModal3');
		modal.style.display='none';
	});

	/////////////////////////////////////

	function drawChart(tab, analyze){

		if(tab == 'tab_SuBae'){

			Highcharts.chart('modalChart', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				xAxis:{
					tickInterval : 1
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'Middle'
				},
				plotOptions:{
					series:{
						label:{
							connectorAllowed: false
						},
						pointStart:6
					}
				},
				series:[{
					name:'계약전력부하율',
					data:[122, 122, 126, 127]
				}],
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				} ,
				minTickInterval : 1

			});//end of Highchart

		}else if(tab == 'tab_JungRyu'){
			Highcharts.chart('modalChart', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					tickInterval : 1
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'Middle'
				},
				plotOptions:{
					series:{
						label:{
							connectorAllowed: false
						},
						pointStart:6
					}
				},
				series:[{
					name:'출력전류',
					data:[122, 122, 126, 127]
				}],
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				} ,
				minTickInterval : 1

			});//end of Highchart
		}else if(tab == 'tab_ChukJun'){
			if(analyze == '내부저항 분석'){

				Highcharts.chart('modalChart', {
					title:{
						text: ' '
					},
					credits: {
						text: ' ',

					},
					subtitle:{
						text: ' '
					},
					xAxis:{
						categories: ['16년9월', '17년3월', '17년6월', '17년9월']

					},
					yAxis:{
						title:{
							text:' '
						}
					},
					legend:{
						layout: 'vertical',
						align:'right',
						verticalAlign:'Middle'
					},
					plotOptions:{
						line:{
							dataLabels:{
								enabled: true
							}
						}
					},
					series:[{
						name:'내부저항 분석',
						data:[0.32, 0.35, 0.39, 0.407]
					}],
					responsive: {
						rules:[{
							condition:{
								maxWidth: 500
							},
							chartOptions:{
								legend:{
									layout:'horizontal',
									align:'center',
									verticalAlign:'bottom'
								}
							}
						}]

					},
					minTickInterval : 1

				});//end of Highchart

			}else if(analyze == '방전 결과 분석'){
				Highcharts.chart('modalChart', {
					title:{
						text: ' '
					},
					credits: {
						text: ' ',

					},
					subtitle:{
						text: ' '
					},
					xAxis:{
						/*categories: ['0분', '5분', '10분', '15분', '20분'],
						labels: {
							step:5
						},*/
						labels: {
							format: '{value} 분'
						},
						tickInterval: 5
					},
					yAxis:{
						title:{
							text:' '
						}
					},
					legend:{
						layout: 'vertical',
						align:'right',
						verticalAlign:'Middle'
					},
					plotOptions:{
						line:{
							dataLabels:{
								enabled: true
							}
						}
					},
					series:[{
						name:'방전 결과 분석',
						data:[27, 25.5, 24, 23, 24.5, 25, 25, 25, 25, 25, 25, 24.9, 24.8, 24.7, 24.6, 24.5, 24.4, 24.3, 24.2, 24.1, 24]
					}],
					responsive: {
						rules:[{
							condition:{
								maxWidth: 500
							},
							chartOptions:{
								legend:{
									layout:'horizontal',
									align:'center',
									verticalAlign:'bottom'
								}
							}
						}]

					},
					minTickInterval : 5

				});//end of Highchart

			}

			}

	}//end of function



	$('#btnResult').click(function(e){

		$('#resultArea').html(resultTag);


		$('#modal2Select1').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(0).trigger('click');

		});

		$('#modal2Select2').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(1).trigger('click');
		});

		$('#modal2Select3').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(2).trigger('click');

		});
		$('#modal2Select4').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(3).trigger('click');
		});
		$('#modal2Select5').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(4).trigger('click');
		});
		$('#modal2Select6').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(5).trigger('click');
		});
		$('#modal2Select7').click(function(e){
			var modal = document.getElementById('myModal2');
			modal.style.display='none';

			$('#checkLi').children().eq(6).trigger('click');
		});

	});

	///////////////////////////////////////////////////////////

	function drawAlopexGrid(nowTab){

		if(nowTab == 'tab_SuBae'){
			// Tab 수배전
			$('#dataSuBae').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
				               { fromIndex : 4, toIndex : 41, title:'수배전'},
				               { fromIndex : 42, toIndex : 44, title:'이동용 발전기 단자함'},

				               { fromIndex : 5, toIndex : 6, title:'계약전력'},
				               { fromIndex : 7, toIndex : 8, title:'한전/건물MCCB'},
				               { fromIndex : 9, toIndex : 18, title:'Main분전반'},
				               { fromIndex : 22, toIndex : 24, title:'SPD(TVSS)'},
				               { fromIndex : 25, toIndex : 33, title:'분전반-1'},
				               { fromIndex : 34, toIndex : 41, title:'분전반-2'},
				               { fromIndex : 43, toIndex : 44, title:'단자함 설치 장소'}
				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '층구분', align:'center',
					title : '층 구분',
					width: '100px'
				}, {
					key : '계약전력_계약전력', align:'center',
					title : '계약전력(KW)',
					width: '100px'
				}, {
					key : '계약전력_부하율',  align:'center',
					title : '부하율(%)',
					width: '100px'
				}, {
					key : '한전_MCCB용량',  align:'center',
					title : 'MCCB용량(A)',
					width: '100px'
				}, {
					key : '한전_부하율',  align:'center',
					title : '부하율(%)',
					width: '100px'
				}, {
					key : 'MAIN_시스템명',  align:'center',
					title : '시스템명',
					width: '100px'
				}, {
					key : 'MAIN_MCCB용량',  align:'center',
					title : 'MCCB용량(A)',
					width: '100px'
				}, {
					key : 'MAIN_부하율',  align:'center',
					title : '부하율(%)',
					width: '100px'
				}, {
					key : 'MAIN_전압(RS)',  align:'center',
					title : '전압(RS)[V]',
					width: '100px'
				}, {
					key : 'MAIN_전압(ST)',  align:'center',
					title : '전압(ST)[V]',
					width: '100px'
				}, {
					key : 'MAIN_전압(TR)',  align:'center',
					title : '전압(TR)[V]',
					width: '100px'
				}, {
					key : 'MAIN_전류(R)',  align:'center',
					title : '전류(R)[A]',
					width: '100px'
				}, {
					key : 'MAIN_전류(S)',  align:'center',
					title : '전류(S)[A]',
					width: '100px'
				},{
					key : 'MAIN_전류(T)',  align:'center',
					title : '전류(T)[A]',
					width: '100px'
				}, {
					key : 'MAIN_전력',  align:'center',
					title : '전력[KW]',
					width: '100px'
				}, {
					key : '접속점온도',  align:'center',
					title : '접속점 온도(MAX값)',
					width: '100px'
				}, {
					key : '케이블온도',  align:'center',
					title : '케이블 온도(MAX값)',
					width: '100px'
				}, {
					key : '누설전류점검',  align:'center',
					title : '누설전류점검(MAX값)',
					width: '100px'
				}, {
					key : 'SPD_설치여부',  align:'center',
					title : '설치여부',
					width: '100px'
				}, {
					key : 'SPD_전용차단기설치여부',  align:'center',
					title : '전용 차단기 설치여부',
					width: '100px'
				}, {
					key : 'SPD_동작상태',  align:'center',
					title : '동작상태',
					width: '100px'
				}, {
					key : '분1_시스템명',  align:'center',
					title : '시스템명',
					width: '100px'
				}, {
					key : '분1_MCCB용량',  align:'center',
					title : 'MCCB용량[A]',
					width: '100px'
				}, {
					key : '분1_부하율',  align:'center',
					title : '부하율[%]',
					width: '100px'
				}, {
					key : '분1_전압(RS)',  align:'center',
					title : '전압(RS)[V]',
					width: '100px'
				}, {
					key : '분1_전압(ST)',  align:'center',
					title : '전압(ST)[V]',
					width: '100px'
				}, {
					key : '분1_전압(TR)',  align:'center',
					title : '전압(TR)[V]',
					width: '100px'
				},  {
					key : '분1_전류(R)',  align:'center',
					title : '전류(R)[A]',
					width: '100px'
				}, {
					key : '분1_전류(S)',  align:'center',
					title : '전류(S)[A]',
					width: '100px'
				}, {
					key : '분1_전류(T)',  align:'center',
					title : '전류(T)[A]',
					width: '100px'
				}, {
					key : '분2_시스템명',  align:'center',
					title : '시스템명',
					width: '100px'
				}, {
					key : '분2_MCCB용량',  align:'center',
					title : 'MCCB용량[A]',
					width: '100px'
				}, {
					key : '분2_부하율',  align:'center',
					title : '부하율[%]',
					width: '100px'
				}, {
					key : '분2_전압(RS)',  align:'center',
					title : '전압(RS)[V]',
					width: '100px'
				}, {
					key : '분2_전압(ST)',  align:'center',
					title : '전압(ST)[V]',
					width: '100px'
				}, {
					key : '분2_전압(TR)',  align:'center',
					title : '전압(TR)[V]',
					width: '100px'
				}, {
					key : '분2_전류(R)',  align:'center',
					title : '전류(R)[A]',
					width: '100px'
				}, {
					key : '분2_전류(S)',  align:'center',
					title : '전류(S)[A]',
					width: '100px'
				}, {
					key : '분2_전류(T)',  align:'center',
					title : '전류(T)[A]',
					width: '100px'
				}, {
					key : '설치여부',  align:'center',
					title : '설치여부',
					width: '100px'
				}, {
					key : '단설장_단자함설치층',  align:'center',
					title : '단자함 설치 층',
					width: '100px'
				}, {
					key : '단설장_상세설명',  align:'center',
					title : '상세 설명',
					width: '100px'
				}, {
					key : '보안', align:'center',
					title : '보안(출입문, 시건장치)',
					width: '100px'
				}],

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });

		}else if(nowTab == 'tab_JungRyu'){
			//Tab 정류기
			$('#dataJungRyu').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
				               //2단
				               { fromIndex : 3, toIndex : 25, title:'정류기'},
				               { fromIndex : 26, toIndex : 35, title:'정류기-축전지'},

				               //1단
				               { fromIndex : 10, toIndex : 11, title:'입력전압'},
				               { fromIndex : 12, toIndex : 14, title:'정류모듈'},
				               { fromIndex : 15, toIndex : 17, title:'입력전류[A]'},
				               { fromIndex : 18, toIndex : 19, title:'출력 전압/전류'},
				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '시스템명', align:'center',
					title : '시스템명',
					width: '130px'
				}, {
					key : 'Eng기준구분', align:'center',
					title : 'Eng기준구분',
					width: '130px'
				}, {
					key : '제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '모델명', align:'center',
					title : '모델명',
					width: '130px'
				}, {
					key : '대표부하명', align:'center',
					title : '대표부하명',
					width: '130px'
				}, {
					key : '제조년월', align:'center',
					title : '제조년월',
					width: '130px'
				}, {
					key : '시설용량', align:'center',
					title : '시설용량[A]',
					width: '130px'
				}, {
					key : '입전_결선방식', align:'center',
					title : '결선방식',
					width: '130px'
				}, {
					key : '입전_전압', align:'center',
					title : '전압[V]',
					width: '130px'
				}, {
					key : '정모_용량', align:'center',
					title : '용량(A)',
					width: '130px'
				}, {
					key : '정모_수량', align:'center',
					title : '수량',
					width: '130px'
				}, {
					key : '정모_입력전압', align:'center',
					title : '입력전압[V]',
					width: '130px'
				}, {
					key : '입전2_R', align:'center',
					title : 'R',
					width: '130px'
				}, {
					key : '입전2_S', align:'center',
					title : 'S',
					width: '130px'
				}, {
					key : '입전2_T', align:'center',
					title : 'T',
					width: '130px'
				}, {
					key : '출전_출력전압', align:'center',
					title : '출력전압[V]',
					width: '130px'
				}, {
					key : '출전_출력전류', align:'center',
					title : '출력전류',
					width: '130px'
				}, {
					key : '부하율', align:'center',
					title : '부하율[%]',
					width: '130px'
				}, {
					key : '소요산출', align:'center',
					title : '소요산출[EA]',
					width: '130px'
				}, {
					key : '과부족', align:'center',
					title : '과부족[EA]',
					width: '130px'
				}, {
					key : 'IPD용량양호', align:'center',
					title : 'IPD용량양호',
					width: '130px'
				}, {
					key : 'BR해제여부', align:'center',
					title : 'BR해제여부',
					width: '130px'
				}, {
					key : 'RMS수용여부', align:'center',
					title : 'RMS수용여부',
					width: '130px'
				}, {
					key : '축전지거리', align:'center',
					title : '축전지거리[m]',
					width: '130px'
				}, {
					key : '케이블굵기', align:'center',
					title : '케이블굵기[Sqr]',
					width: '130px'
				}, {
					key : '전압강하', align:'center',
					title : '전압강하[V]',
					width: '130px'
				}, {
					key : '조수', align:'center',
					title : '조수[조]',
					width: '130px'
				}, {
					key : '총용량', align:'center',
					title : '총용량[AH]',
					width: '130px'
				}, {
					key : '용량계수', align:'center',
					title : '용량계수',
					width: '130px'
				}, {
					key : '소요용량', align:'center',
					title : '소요용량[AH]',
					width: '130px'
				}, {
					key : '과부족', align:'center',
					title : '과부족[AH]',
					width: '130px'
				}, {
					key : '과부족조수', align:'center',
					title : '과부족조수[조]',
					width: '130px'
				}, {
					key : '백업예상', align:'center',
					title : '백업예상[H]',
					width: '130px'
				}],

				//data:dataTab2,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}else if(nowTab == 'tab_ChukJun'){

			$('#dataChukJun').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
				               { fromIndex : 1, toIndex : 14, title:'시설현황'},
				               { fromIndex : 17, toIndex : 48, title:'내부저항'},
				               { fromIndex : 49, toIndex : 58, title:'방전시험'}
				],

				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				},{
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				},{
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				},{
					key : '정류기명', align:'center',
					title : '정류기명',
					width: '130px'
				},{
					key : '정류기모델명', align:'center',
					title : '정류기모델명',
					width: '130px'
				},{
					key : '조번호', align:'center',
					title : '조번호',
					width: '130px'
				},{
					key : '제조사', align:'center',
					title : '제조사',
					width: '130px'
				},{
					key : '모델명', align:'center',
					title : '모델명',
					width: '130px'
				},{
					key : '용량', align:'center',
					title : '용량',
					width: '130px'
				},{
					key : '전압', align:'center',
					title : '전압',
					width: '130px'
				},{
					key : 'Cell수', align:'center',
					title : 'Cell수',
					width: '130px'
				},{
					key : '제조일자', align:'center',
					title : '제조일자',
					width: '130px'
				},{
					key : '케이블굵기', align:'center',
					title : '케이블굵기[mm2]',						// mm제곱 표현
					width: '130px'
				},{
					key : '가닥수', align:'center',
					title : '가닥수',
					width: '130px'
				},{
					key : '굵기 합계', align:'center',
					title : '굵기 합계[mm2]',						// mm제곱 표현
					width: '130px'
				},{
					key : '표면온도', align:'center',
					title : '표면온도',
					width: '130px'
				},{
					key : '외관점검', align:'center',
					title : '외관점검',
					width: '130px'
				},{
					key : '측정일자', align:'center',
					title : '측정일자',
					width: '130px'
				},{
					key : '최대', align:'center',
					title : '최대',
					width: '130px'
				},{
					key : '최소', align:'center',
					title : '최소',
					width: '130px'
				},{
					key : '평균', align:'center',
					title : '평균',
					width: '130px'
				},{
					key : '불량', align:'center',
					title : '불량',
					width: '130px'
				},{
					key : '열화2', align:'center',
					title : '열화2',
					width: '130px'
				},{
					key : '열화1', align:'center',
					title : '열화1',
					width: '130px'
				},{
					key : '양호', align:'center',
					title : '양호',
					width: '130px'
				},{
					key : '1Cell', align:'center',
					title : '1Cell',
					width: '130px'
				},{
					key : '2Cell', align:'center',
					title : '2Cell',
					width: '130px'
				},{
					key : '3Cell', align:'center',
					title : '3Cell',
					width: '130px'
				},{
					key : '4Cell', align:'center',
					title : '4Cell',
					width: '130px'
				},{
					key : '5Cell', align:'center',
					title : '5Cell',
					width: '130px'
				},{
					key : '6Cell', align:'center',
					title : '6Cell',
					width: '130px'
				},{
					key : '7Cell', align:'center',
					title : '7Cell',
					width: '130px'
				},{
					key : '8Cell', align:'center',
					title : '8Cell',
					width: '130px'
				},{
					key : '9Cell', align:'center',
					title : '9Cell',
					width: '130px'
				},{
					key : '10Cell', align:'center',
					title : '10Cell',
					width: '130px'
				},{
					key : '11Cell', align:'center',
					title : '11Cell',
					width: '130px'
				},{
					key : '12Cell', align:'center',
					title : '12Cell',
					width: '130px'
				},{
					key : '13Cell', align:'center',
					title : '13Cell',
					width: '130px'
				},{
					key : '14Cell', align:'center',
					title : '14Cell',
					width: '130px'
				},{
					key : '15Cell', align:'center',
					title : '15Cell',
					width: '130px'
				},{
					key : '16Cell', align:'center',
					title : '16Cell',
					width: '130px'
				},{
					key : '17Cell', align:'center',
					title : '17Cell',
					width: '130px'
				},{
					key : '18Cell', align:'center',
					title : '18Cell',
					width: '130px'
				},{
					key : '19Cell', align:'center',
					title : '19Cell',
					width: '130px'
				},{
					key : '20Cell', align:'center',
					title : '20Cell',
					width: '130px'
				},{
					key : '21Cell', align:'center',
					title : '21Cell',
					width: '130px'
				},{
					key : '22Cell', align:'center',
					title : '22Cell',
					width: '130px'
				},{
					key : '23Cell', align:'center',
					title : '23Cell',
					width: '130px'
				},{
					key : '24Cell', align:'center',
					title : '24Cell',
					width: '130px'
				},{
					key : '시험일자', align:'center',
					title : '시험일자',
					width: '130px'
				},{
					key : '심도전압', align:'center',
					title : '심도전압[V]',
					width: '130px'
				},{
					key : '심도전압도달시간', align:'center',
					title : '심도전압도달시간',
					width: '130px'
				},{
					key : '10분후출력전압', align:'center',
					title : '10분후출력전압',
					width: '130px'
				},{
					key : '10분후방전전류', align:'center',
					title : '10분후방전전류',
					width: '130px'
				},{
					key : '20분후출력전압', align:'center',
					title : '20분후출력전압',
					width: '130px'
				},{
					key : '20분후방전전류', align:'center',
					title : '20분후방전전류',
					width: '130px'
				},{
					key : '30분후출력전압', align:'center',
					title : '30분후출력전압',
					width: '130px'
				},{
					key : '30분후방전전류', align:'center',
					title : '30분후방전전류',
					width: '130px'
				},{
					key : '결과', align:'center',
					title : '결과',
					width: '130px'
				}],

				//data:dataTab3,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}else if(nowTab == 'tab_NaengBang'){

			$('#dataNaengBang').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [


				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '시스템명', align:'center',
					title : '시스템명',
					width: '130px'
				}, {
					key : '용량', align:'center',
					title : '용량[RT]',
					width: '130px'
				}, {
					key : '제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '제조일자', align:'center',
					title : '제조일자',
					width: '130px'
				}, {
					key : '고온Solution', align:'center',
					title : '고온Solution',
					width: '130px'
				}, {
					key : '배풍기차단기위치', align:'center',
					title : '배풍기차단기위치',
					width: '130px'
				}, {
					key : 'RMS수용', align:'center',
					title : 'RMS수용',
					width: '130px'
				}, {
					key : '적정용량', align:'center',
					title : '적정용량[R/T]',
					width: '130px'
				}, {
					key : '부족용량', align:'center',
					title : '부족용량[R/T]',
					width: '130px'
				}],

				//data:dataTab4,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });

		}else if(nowTab == 'tab_SoHwa'){
			$('#dataSoHwa').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [


				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '시스템명', align:'center',
					title : '시스템명',
					width: '130px'
				}, {
					key : '용량', align:'center',
					title : '용량[kg]',
					width: '130px'
				}, {
					key : '대수', align:'center',
					title : '대수[BT]',
					width: '130px'
				}, {
					key : '제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '제조일자', align:'center',
					title : '제조일자',
					width: '130px'
				}, {
					key : '축전지제조년월', align:'center',
					title : '축전지제조년월',
					width: '130px'
				}, {
					key : 'RMS연동', align:'center',
					title : 'RMS연동',
					width: '130px'
				}, {
					key : '동작상태', align:'center',
					title : '동작상태',
					width: '130px'
				}],

				//data:dataTab5,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });

		}else if(nowTab == 'tab_BalJun'){
			$('#dataBalJun').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
				               { fromIndex : 3, toIndex : 30, title:'발전기'},

				               { fromIndex : 4, toIndex : 8, title:'발전기부'},
				               { fromIndex : 9, toIndex : 10, title:'엔진부'},
				               { fromIndex : 11, toIndex : 13, title:'연료탱크'},
				               { fromIndex : 14, toIndex : 17, title:'시동용 축전지'},
				               { fromIndex : 18, toIndex : 21, title:'ATS'},
				               { fromIndex : 27, toIndex : 30, title:'시운전'}
				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '발전기설치유무', align:'center',
					title : '발전기설치유무',
					width: '130px'
				}, {
					key : '기부_제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '기부_모델명', align:'center',
					title : '모델명',
					width: '130px'
				}, {
					key : '기부_상용출력', align:'center',
					title : '상용출력[KW]',
					width: '130px'
				}, {
					key : '기부_비상출력', align:'center',
					title : '비상출력[KW]',
					width: '130px'
				}, {
					key : '기부_제조년월', align:'center',
					title : '제조년월',
					width: '130px'
				}, {
					key : '엔진부_제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '엔진부_모델명', align:'center',
					title : '모델명',
					width: '130px'
				}, {
					key : '탱크_탱크용량', align:'center',
					title : '탱크용량[L]',
					width: '130px'
				}, {
					key : '탱크_보유량', align:'center',
					title : '보유량[L]',
					width: '130px'
				}, {
					key : '탱크_보유율', align:'center',
					title : '보유율[%]',
					width: '130px'
				}, {
					key : '축전지_제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '축전지_모델명', align:'center',
					title : '모델명',
					width: '130px'
				}, {
					key : '축전지_제조년월', align:'center',
					title : '제조년월',
					width: '130px'
				}, {
					key : '축전지_운용상태', align:'center',
					title : '운용상태(충전전압,내부전압)',
					width: '130px'
				}, {
					key : 'ATS_제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : 'ATS_모델명', align:'center',
					title : '모델명',
					width: '130px'
				}, {
					key : 'ATS_용량', align:'center',
					title : '용량[A]',
					width: '130px'
				}, {
					key : 'ATS_제조년월', align:'center',
					title : '제조년월',
					width: '130px'
				}, {
					key : '엔진오일점검', align:'center',
					title : '엔진오일점검(상태,누유등)',
					width: '130px'
				}, {
					key : '냉각수점검', align:'center',
					title : '냉각수점검(상태 및 누수등)',
					width: '130px'
				}, {
					key : '예열히터상태', align:'center',
					title : '예열히터상태',
					width: '130px'
				}, {
					key : '배관호스', align:'center',
					title : '배관,호스,흡/배기 상태',
					width: '130px'
				}, {
					key : '제어반상태', align:'center',
					title : '제어반 상태(표시램프, 레버, 계기 등)',
					width: '130px'
				}, {
					key : '시운전_시운전점검여부', align:'center',
					title : '시운전 점검 여부',
					width: '130px'
				}, {
					key : '시운전_부하무부하', align:'center',
					title : '부하/무부하',
					width: '130px'
				}, {
					key : '시운전_시운전결과', align:'center',
					title : '시운전결과',
					width: '130px'
				}, {
					key : '시운전_ATS절체시험', align:'center',
					title : 'ATS절체 시험',
					width: '130px'
				}],

				//data:dataTab6,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}else if(nowTab == 'tab_GunGang'){

			$('#dataGunGang').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
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
					width: '130px'
				}, {
					key : '국소명', align:'center',
					title : '국소명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : 'CMS국소명', align:'center',
					title : 'CMS국소명',
					width: '130px'
				}, {
					key : '운용Cell수', align:'center',
					title : '운용Cell수',
					width: '130px'
				}, {
					key : '수전_계약전력', align:'center',
					title : '계약전력',
					width: '130px'
				}, {
					key : '수전_Main차단기용량', align:'center',
					title : 'Main차단기용량',
					width: '130px'
				}, {
					key : '수전_차단기', align:'center',
					title : '차단기/케이블 발열',
					width: '130px'
				}, {
					key : '수전_SPD설치', align:'center',
					title : 'SPD설치',
					width: '130px'
				}, {
					key : '정류기_모듈적정수량', align:'center',
					title : '모듈적정수량',
					width: '130px'
				}, {
					key : '정류기_IPD차단기용량', align:'center',
					title : 'IPD차단기용량',
					width: '130px'
				}, {
					key : '정류기_BR해제', align:'center',
					title : 'BR해제',
					width: '130px'
				}, {
					key : '축전지_축전지적정용량', align:'center',
					title : '축전지적정용량',
					width: '130px'
				}, {
					key : '축전지_축전지상태', align:'center',
					title : '축전지상태',
					width: '130px'
				}, {
					key : '축전지_축전지내부저항', align:'center',
					title : '축전지 내부저항',
					width: '130px'
				}, {
					key : '축전지_전압강하', align:'center',
					title : '축전지 케이블 전압강하',
					width: '130px'
				}, {
					key : '비상전원_발전기', align:'center',
					title : '발전기 전원공급 프로세스',
					width: '130px'
				}, {
					key : '비상전원_이동용', align:'center',
					title : '이동용 발전기 단자함',
					width: '130px'
				}, {
					key : '부대설비_냉방기', align:'center',
					title : '냉방기 적정용량',
					width: '130px'
				}, {
					key : '부대설비_소화설비관리', align:'center',
					title : '소화설비관리',
					width: '130px'
				}, {
					key : '환경_환경감시장치', align:'center',
					title : '환경감시장치',
					width: '130px'
				}, {
					key : '환경_보안', align:'center',
					title : '보안',
					width: '130px'
				}, {
					key : '점수_만점', align:'center',
					title : '만점',
					width: '130px'
				}, {
					key : '점수_취득', align:'center',
					title : '취득',
					width: '130px'
				}],

				//data:dataTab7,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}else if(nowTab == 'tab_GoJang'){

			$('#dataGoJang').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
								{ fromIndex : 3, toIndex : 5, title:'고장일자'},
								{ fromIndex : 6, toIndex : 17, title:'고장내역'},
								{ fromIndex : 18, toIndex : 23, title:'시설현황'}
				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '년', align:'center',
					title : '년',
					width: '130px'
				}, {
					key : '월', align:'center',
					title : '월',
					width: '130px'
				}, {
					key : '일', align:'center',
					title : '일',
					width: '130px'
				}, {
					key : '발생시간', align:'center',
					title : '발생시간',
					width: '130px'
				}, {
					key : '복구시간', align:'center',
					title : '복구시간',
					width: '130px'
				}, {
					key : '이장시간', align:'center',
					title : '이장시간',
					width: '130px'
				}, {
					key : '서비스중단', align:'center',
					title : '서비스중단(유,무)',
					width: '130px'
				}, {
					key : '서비스중단시간', align:'center',
					title : '서비스중단시간(분)',
					width: '130px'
				}, {
					key : '발전차출발시간', align:'center',
					title : '발전차출발시간',
					width: '130px'
				}, {
					key : '발전차도착시간', align:'center',
					title : '발전차도착시간',
					width: '130px'
				}, {
					key : '장애시설내역', align:'center',
					title : '장애시설내역',
					width: '130px'
				}, {
					key : '고장유형1', align:'center',
					title : '고장유형1',
					width: '130px'
				}, {
					key : '고장유형2', align:'center',
					title : '고장유형2',
					width: '130px'
				}, {
					key : '발생원인', align:'center',
					title : '발생원인(자세히작성)',
					width: '130px'
				}, {
					key : '조치내역', align:'center',
					title : '조치내역(자세히작성)',
					width: '130px'
				}, {
					key : '시스템명', align:'center',
					title : '시스템명',
					width: '130px'
				}, {
					key : '정류기제조사', align:'center',
					title : '정류기제조사',
					width: '130px'
				}, {
					key : '정류기모델', align:'center',
					title : '정류기모델',
					width: '130px'
				}, {
					key : '축전지용량', align:'center',
					title : '축전지용량',
					width: '130px'
				}, {
					key : '예상백업시간', align:'center',
					title : '예상백업시간',
					width: '130px'
				}, {
					key : '실제백업시간', align:'center',
					title : '실제백업시간',
					width: '130px'
				}],

				//data:dataTab8,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });
		}else if(nowTab == 'tab_SuRi'){

			$('#dataSuRi').alopexGrid({
		    	paging : {
		    		pagerSelect: [100,300,500,1000,5000]
		           ,hidePageList: false  // pager 중앙 삭제
		    	},
		    	autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping:{
					sorting : true
				},
				headerGroup : [
								{ fromIndex : 3, toIndex : 5, title:'수리일자'},
								{ fromIndex : 6, toIndex : 8, title:'고장 이력'},
								{ fromIndex : 9, toIndex : 13, title:'수리 이력'}

				],
				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {
					key : '국사명', align:'center',
					title : '국사명',
					width: '130px'
				}, {
					key : '국사구분', align:'center',
					title : '국사구분',
					width: '130px'
				}, {
					key : '년', align:'center',
					title : '년',
					width: '130px'
				}, {
					key : '월', align:'center',
					title : '월',
					width: '130px'
				}, {
					key : '일', align:'center',
					title : '일',
					width: '130px'
				}, {
					key : '고장구분', align:'center',
					title : '고장구분',
					width: '130px'
				}, {
					key : '시스템명', align:'center',
					title : '시스템명',
					width: '130px'
				}, {
					key : '세부구분', align:'center',
					title : '세부구분',
					width: '130px'
				}, {
					key : '업체', align:'center',
					title : '업체',
					width: '130px'
				}, {
					key : '수리내역', align:'center',
					title : '수리내역',
					width: '130px'
				}, {
					key : '교체부품', align:'center',
					title : '교체부품',
					width: '130px'
				}, {
					key : '제조사', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : '제조일', align:'center',
					title : '제조일',
					width: '130px'
				}],

				//data:dataTab9,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		    });

		}
	}





	function drawDetailCondition(nowTab){

		if(nowTab == 'tab_SuBae'){
			// Tab 수배전
			$('#detailCondition').html(tagToTab1);
		}else if(nowTab == 'tab_JungRyu'){
			//Tab 정류기
			$('#detailCondition').html(tagToTab2);
		}else if(nowTab == 'tab_ChukJun'){
			//Tab 축전지
			$('#detailCondition').html(tagToTab3);
		}else if(nowTab == 'tab_NaengBang'){
			//Tab 냉방기
			$('#detailCondition').html(tagToTab4);
		}else if(nowTab == 'tab_SoHwa'){
			//Tab 소화설비
			$('#detailCondition').html(tagToTab5);
		}else if(nowTab == 'tab_BalJun'){
			//Tab 발전기
			$('#detailCondition').html(tagToTab6);
		}else if(nowTab == 'tab_GunGang'){
			//Tab 건강도
			$('#detailCondition').html(tagToTab7);
		}else if(nowTab == 'tab_GoJang'){
			//Tab 고장이력
			$('#detailCondition').html(tagToTab8);
		}else if(nowTab == 'tab_SuRi'){
			//Tab 수리이력
			$('#detailCondition').html(tagToTab9);
		}else{
			$('#detailCondition').html(' ');
		}
	}



})