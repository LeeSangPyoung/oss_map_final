/**
 * EpwrStcMgmtBatryCurst.js
 *
 * @author Administrator
 * @date 2018. 01. 25.
 * @version 1.0
 */
var batry = $a.page(function() {
	var batryGridId = 'dataGridBatry';
	var paramData = null;
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		//setDate();
		//setSelectCode();
		setEventListener();
	};
	function initGrid() {
		$('#'+batryGridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			rowInlineEdit: true,
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			defaultColumnMapping:{
				sorting : true
			},
			headerGroup : [
				{ fromIndex : 7, toIndex : 19, title:'시설현황'},
				{ fromIndex : 22, toIndex : 53, title:'내부저항'},
				{ fromIndex : 54, toIndex : 63, title:'방전시험'},
				//{ fromIndex : 51, toIndex : 54, title:'축전지 가대 현황'},
				],

				columnMapping: [{
					align:'center',
					title : 'No',
					width: '40px',
					numberingColumn: true
				}, {/* 관리그룹--숨김데이터            */
					key : 'mgmtGrpNm', align:'center',
					title : configMsgArray['managementGroup'],
					width: '70px'
				}, {/* 본부			 */
					key : 'orgNm', align:'center',
					title : configMsgArray['hdofc'],
					width: '100px'
				}, {/* 팀	 */
					key : 'taskOrgNm', align:'center',
					title : configMsgArray['team'],
					width: '100px'
				},{/* 전송실 		 */
					key : 'tmofNm', align:'center',
					title : configMsgArray['transmissionOffice'],
					width: '150px'
				},{/* 국사유형		 */
					key : 'mtsoTypNm', align:'center',
					title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
					width: '100px'
				}, {/* 국사명		 */
					key : 'mtsoNm', align:'center',
					title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
					width: '150px'
				},{
					key : 'rtfNm', align:'center',
					title : '정류기명',
					width: '130px',
				},{
					key : 'rtfMdlNm', align:'center',
					title : '정류기모델명',
					width: '130px',
				},{
					key : 'sbeqpNm', align:'center',
					title : '부대장비명',
					width: '130px',
				},{
					key : 'jarNo', align:'center',
					title : '조번호',
					width: '130px',
				},{
					key : 'sbeqpVendNm', align:'center',
					title : '제조사',
					width: '130px',
				},{
					key : 'sbeqpMdlNm', align:'center',
					title : '모델명',
					width: '130px',
				},{
					key : 'capaVal', align:'center',
					title : '용량',
					width: '100px',
				},{
					key : 'voltVal', align:'center',
					title : '전압',
					width: '60px',
				},{
					key : 'cellCnt', align:'center',
					title : 'Cell수',
					width: '60px',
				},{
					key : 'mnftDt', align:'center',
					title : '제조일자',
					width: '130px',
					render: function(value){
						if(value){
							return value.substr(0,4) + "-" + value.substr(4,2) + "-" + value.substr(6,2);

						}
					}
				},{
					key : 'cblTkns', align:'center',
					title : '케이블굵기[㎟]',
					width: '100px',
				},{
					key : 'cblPceCnt', align:'center',
					title : '가닥수',
					width: '130px',
				},{
					key : 'tknsSum', align:'center',
					title : '굵기 합계[㎟]',
					width: '110px',
				},{
					key : 'sfsTmpr', align:'center',
					title : '표면온도[℃]',
					width: '90px',
					render: function(value){
						if(value == "" || value == null || value == undefined){
							return "N/A";
						} else {
							return value + "℃";
						}
					}
				},{
					key : 'ouppInspStatCd', align:'center',
					title : '외관점검',
					width: '80px',
					render: function(value){
						switch(value){
						case "Y":
							return "양호";
						case "N":
							return "불량";
						default:
							return "N/A";
						}
					}
				},{
					key : 'msmtDate', align:'center',
					title : '측정일자',
					width: '130px'
				},{
					key : 'intnRstnMax', align:'center',
					title : '최대',
					width: '60px',
				},{
					key : 'intnRstnMin', align:'center',
					title : '최소',
					width: '60px',
				},{
					key : 'intnRstnAvg', align:'center',
					title : '평균',
					width: '60px',
				},{
					key : 'intnRstnBad', align:'center',
					title : '불량',
					width: '60px',
				},{
					key : 'intnRstnDgrdnChk1', align:'center',
					title : '열화1',
					width: '60px',
				},{
					key : 'intnRstnDgrdnChk2', align:'center',
					title : '열화2	',
					width: '60px',
				},{
					key : 'intnRstnGoodChk', align:'center',
					title : '양호',
					width: '60px',
				},{
					key : 'cellMsmt1Val', align:'center',
					title : '1Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '##FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '##FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt2Val', align:'center',
					title : '2Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '##FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '##FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt3Val', align:'center',
					title : '3Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt4Val', align:'center',
					title : '4Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt5Val', align:'center',
					title : '5Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt6Val', align:'center',
					title : '6Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt7Val', align:'center',
					title : '7Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt8Val', align:'center',
					title : '8Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt9Val', align:'center',
					title : '9Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt10Val', align:'center',
					title : '10Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt11Val', align:'center',
					title : '11Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt12Val', align:'center',
					title : '12Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt13Val', align:'center',
					title : '13Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt14Val', align:'center',
					title : '14Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt15Val', align:'center',
					title : '15Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt16Val', align:'center',
					title : '16Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt17Val', align:'center',
					title : '17Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt18Val', align:'center',
					title : '18Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt19Val', align:'center',
					title : '19Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt20Val', align:'center',
					title : '20Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt21Val', align:'center',
					title : '21Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt22Val', align:'center',
					title : '22Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt23Val', align:'center',
					title : '23Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				},{
					key : 'cellMsmt24Val', align:'center',
					title : '24Cell',
					width: '60px',
					inlineStyle : {
						background: function(value,data,mapping){
							var cellList = [value];
							if(rstnBadChk(data,cellList)>0){
								return '#FF3300';
							}
							if(rstnDgrdn1Chk(data,cellList)>0){
								return '#FFFF66';
							}
							if(rstnDgrdn2Chk(data,cellList)>0){
								return '#FFC000';
							}
						}
					}
				}
//				,{
//					key : 'sbeqpId', align:'center',
//					title : '축전지ID',
//					width: '130px',
//				},{
//					key : 'sbeqpNm', align:'center',
//					title : '축전지명',
//					width: '130px',
//				}
				],

				//data:dataTab3,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		});
//		gridHide();
//		$('#'+batryGridId).alopexGrid("hideCol","mtsoTypCd");
	}
	function gridHide(){
    	var hideColList = ["sbeqpId","sbeqpNm"];
    	$('#'+batryGridId).alopexGrid("hideCol", hideColList);
    }
	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+batryGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.pageNo = $('#pageNo').val();
     	 	dataObj.rowPerPage = $('#rowPerPage').val();
     	 	//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryDtlLkup.do?sbeqpId="+dataObj.sbeqpId, '부대장비배터리상세정보',dataObj);
//			var dataObj = AlopexGrid.parseEvent(e).data;
//			dataObj.stat = 'mod';
//			if(dataObj._column <= 14){
//				parent.top.main.popup('EpwrStcMgmtBatryReg','축전지 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtBatryReg.do',dataObj,650,450)
//			}else{
//				parent.top.main.popup('EpwrStcMgmtBatryRsltReg','결과 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtBatryRsltReg.do',dataObj,800,400)
//			}

     	 	var data = {
					mtsoEqpGubun : 'eqp',	// mtso Or eqp
					mtsoEqpId:dataObj.sbeqpId
					};

			var dd = $a.popup({
				popid: 'MtsoDtlLkup',
				title: '국사 상세정보',
				url: $('#ctx').val()+'/configmgmt/commonlkup/ComLkup.do',
				data: data,
				iframe: false,
				modal: false,
				movable:true,
				windowpopup: true,
				width : 900,
				height : window.innerHeight * 0.9
			});

		});

		// 축전지 그리드 페이지 번호 클릭시
		$('#'+batryGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			batry.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 축전지 그리드 페이지 selectbox를 변경했을 시
		$('#'+batryGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			batry.setGrid(1, eObj.perPage);
		});




		$('#btnRegBatry').on('click', function(e) {
//			var data ={stat: 'add'}
//			parent.top.main.popup('EpwrStcMgmtBatryReg','축전지 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtBatryReg.do',data,650,450)
//			var dataParam ={epwrClCd: 'B', regYn : "N"}
//			popup('SbeqpReg','/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do', '부대장비등록', dataParam);

			var pageNo = $('#pageNo').val();
     	 	var rowPerPage = $('#rowPerPage').val();

			$a.popup({
              	popid: 'Batry',
              	title: '부대장비등록',
                  url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do?epwrClCd=B&pageNo='+pageNo+'&rowPerPage='+rowPerPage,
                  data: "",
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
		})

		$('#btnRegBatryRslt').on('click', function(e) {
			var selData = $('#'+batryGridId).alopexGrid('dataGet',{_state:{selected:true}});
			if(selData.length>0){
//				var data = selData[0];
//				data.stat='add';
//				parent.top.main.popup('EpwrStcMgmtBatryRsltReg','결과 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtBatryRsltReg.do',data,800,400)
				$a.popup({
	              	popid: 'Batry',
	              	title: '내부저항등록',
	                  url: "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryIntnRstnRsltReg.do?sbeqpId="+selData[0].sbeqpId + "&epwrFlag=Y",
	                  data: "",
	                  iframe: true,
	                  modal: true,
	                  movable:true,
	                  windowpopup : true,
	                  width : 900,
	                  height : 600
	              });
			}else{
				callMsgBox('','W', '선택 된 축전지가 없습니다.', function(msgId, msgRst){});
				return;
			}

		})

		$('#btnBatryTrend').on('click', function(e) {
			var selData = $('#'+batryGridId).alopexGrid('dataGet',{_state:{selected:true}});
			if(selData.length>0){
				var data = {sbeqpId:selData[0].sbeqpId, jarNo:selData[0].jarNo, mtsoNm:selData[0].mtsoNm, systmNm:selData[0].systmNm};
				data.type = 'batry';
				parent.top.main.popup('EpwrStcMgmtGraphCharts','Trend 분석','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtGraphCharts.do',data,950,650)
			}else{
				callMsgBox('','W', '선택 된 축전지가 없습니다.', function(msgId, msgRst){});
				return;
			}
		})
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+batryGridId).alopexGrid('hideProgress');
			$('#'+batryGridId).alopexGrid('dataSet', response.epwrMgmtBatryCurstList, serverPageinfo);

		}


		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+batryGridId).alopexGrid('hideProgress');
			$('#'+batryGridId).alopexGrid('dataSet', response.epwrMgmtBatryCurstList, serverPageinfo);


			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_배터리_'+recentYMD,
				sheetList : [{
					sheetName : '배터리',
					$grid : $("#"+batryGridId)
				}]
			});
			worker.export({
				merge : false,
				useCSSParser : true,
				useGridColumnWidth : true,
				border : true
			});

		}


		if(flag == 'excelDownload'){
			$('#'+batryGridId).alopexGrid('hideProgress');

			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
		}
	}
//	request 실패시.
	function failCallback(response, status, jqxhr, flag){

	}



	this.setGrid = function(page, rowPerPage) {

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchBatry").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+batryGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtBatryCurstList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchBatry").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+batryGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtBatryCurstList', param, 'GET', 'searchExcel');
	}



//	불량
	function rstnBadChk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>9.08){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>8.26){
						cnt++;
					}
				}

			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.486){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>9.08){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.45){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.414){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.93){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.36){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.88){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.88){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.324){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.288){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.8){
						cnt++;
					}
				}
			}

		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.8){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>10.9){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>9.91){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.11){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.05){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.05){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>1.05){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.4){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.42){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.96){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}
//	열화1
	function rstnDgrdn1Chk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=7.575 && cellList[i]>6.06){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=6.885 && cellList[i]>5.508){
						cnt++;
					}
				}
			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.405 && cellList[i]>0.324){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.39 && cellList[i]>0.312){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.375 && cellList[i]>0.3){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.345 && cellList[i]>0.276){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.78 && cellList[i]>0.624){
						cnt++;
					}
				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.3 && cellList[i]>0.24){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.735 && cellList[i]>0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.735 && cellList[i]>0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(ccellList[i]<=0.27 && cellList[i]>0.216){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.24 && cellList[i]>0.192){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.675/*0.54*/){
						cnt++;
					}
				}
			}
		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.53 && cellList[i]>0.4){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=7.26 && cellList[i]>5.445){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=6.606 && cellList[i]>4.955){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.740 && cellList[i]>0.555){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.7 && cellList[i]>0.525){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.7 && cellList[i]>0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.7 && cellList[i]>0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.264 && cellList[i]>0.198){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.278 && cellList[i]>0.209){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.64 && cellList[i]>0.48){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}
//	열화2
	function rstnDgrdn2Chk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=9.09 && cellList[i]>7.575){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=8.262 && cellList[i]>6.885){
						cnt++;
					}
				}
			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.486 && cellList[i]>0.405){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.468 && cellList[i]>0.405){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.45 && cellList[i]>0.375){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.414 && cellList[i]>0.345){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.936 && cellList[i]>0.78){
						cnt++;
					}
				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.36 && cellList[i]>0.3){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.882 && cellList[i]>0.735){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.882 && cellList[i]>0.735){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(ccellList[i]<=0.324 && cellList[i]>0.27){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.288 && cellList[i]>7.575){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]>0.81/*0.675*/){
						cnt++;
					}
				}
			}
		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.8 && cellList[i]>0.53){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=10.9 && cellList[i]>7.26){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=9.91 && cellList[i]>6.606){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.11 && cellList[i]>0.74){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.05 && cellList[i]>0.7){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.05 && cellList[i]>0.7){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=1.05 && cellList[i]>0.7){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.396 && cellList[i]>0.264){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.417 && cellList[i]>0.278){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.96 && cellList[i]>0.64){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}

	function rstnGoodChk(data, cellList){
		var date = new Date(data.mnftDt);
		var cnt = 0;
		if(date.getFullYear() == '2011' || date.getFullYear() == '2012'){
			if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=6.06){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=5.508){
						cnt++;
					}
				}

			}else if(data.capa == '600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.324){
						cnt++;
					}
				}
			}else if(data.capa == '800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.312){
						cnt++;
					}
				}
			}else if(data.capa == '1000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.3){
						cnt++;
					}
				}
			}else if(data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.276){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.624){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.24){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.588){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.216){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.192){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.54){
						cnt++;
					}
				}
			}

		}else{
			if(data.capa == '600' || data.capa == '1000' || data.capa == '1200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.4){
						cnt++;
					}
				}
			}else if(data.capa == '130'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=5.445){
						cnt++;
					}
				}
			}else if(data.capa == '200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=4.955){
						cnt++;
					}
				}
			}else if(data.capa == '1500'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.555){
						cnt++;
					}

				}
			}else if(data.capa == '1600'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.525){
						cnt++;
					}
				}
			}else if(data.capa == '1800'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.525){
						cnt++;
					}
				}
			}else if(data.capa == '2200'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.198){
						cnt++;
					}
				}
			}else if(data.capa == '2400'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.209){
						cnt++;
					}
				}
			}else if(data.capa == '3000'){
				for(var i=0;i<cellList.length; i++){
					if(cellList[i]<=0.480){
						cnt++;
					}
				}
			}
		}
		return cnt;
	}

//	엑셀다운
	$('#btnBatryExportExcel').on('click', function(e) {
		//tango transmission biz 모듈을 호출하여야한다.
		batry.setGridExcel(1, 1000000);
//		var param =  $("#searchMain").getData();
//		var subParam = $("#searchBatry").getData();
//
//		$.extend(param,subParam);
//
//		param = gridExcelColumn(param, batryGridId);
//		param.pageNo = 1;
//		param.rowPerPage = 10;
//		param.firstRowIndex = 1;
//		param.lastRowIndex = 1000000000;
//
//
//		param.fileName = '전력통계_축전지'
//			param.fileExtension = "xlsx";
//		param.excelPageDown = "N";
//		param.excelUpload = "N";
//		param.method = "getEpwrStcMgmtBatryCurstList";
//
//		$('#'+batryGridId).alopexGrid('showProgress');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/batryExcelcreate', param, 'GET', 'excelDownload');
	});


	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}
	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}

	function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
        }
});