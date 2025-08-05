/**
 * UpsdMtsoList.js
 *
 * @author Administrator
 * @date 2017. 7. 12.
 * @version 1.0
 */
var gisMap = null;
var mgMap;
var L;
var circleRange = 0;//반경거리

var main = $a.page(function() {


	var gridId = 'dataGrid';
	var floorGrid = 'floorGrid'
	var fileOnDemendName = "";
	var floorParam = "";
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
		//main.setGrid(1,100);
		$('#floorInf').hide();
	};

	//Grid 초기화
	function initGrid() {

		AlopexGrid.setup({
			renderMapping : {
				"bargraph" : {
					renderer : function(value, data, render, mapping) {
						var rule = render.rule;
						var percentage = 0;

						if(rule) {
							var min = rule[0];
							var max = rule[1];
							if(typeof min === "string") {
								min = parseFloat(data[min]);
							}
							if(typeof max === "string") {
								max = parseFloat(data[max]);
							}
							if(typeof min === "number" && typeof max === "number") {
								percentage = parseInt((value-min)/(max-min)*100);
								percentage = Math.min(Math.max(0,percentage),100);
							}
						}
						//http://omnipotent.net/jquery.sparkline/#hidden : jQuery sparkline
						if(percentage >= 80){
							return '<div class="progress_container"><div class="percentage-bar_green" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}else if(percentage <=25){
							return '<div class="progress_container"><div class="percentage-bar_red" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}else{
							return '<div class="progress_container"><div class="percentage-bar_yellow" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}
					}
				}
			},
		});

		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
		,hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '8row',
			autoResize: true,
			numberingColumnFromZero: false,
			headerGroup: [
				{fromIndex:10, toIndex:14, title:'상면정보'},
				{fromIndex:13, toIndex:14, title:'상면등록',hideSubTitle: true}
				],
				columnMapping: [{
					align:'center',
					title : 'No.',
					width: '30',
					resizing: false,
					numberingColumn: true
				}, {
					key : 'workGubun', align:'center',
					title : '관리그룹',
					width: '60',
					render: function(data,value){
						if(data == ''||data == null){
							return 'SKT';
						}else{
							return data;
						}
					}
				}, {/* 본부			 */
					key : 'orgNm', align:'center',
					title : '본부',
					width: '90px'
				}, {/* 팀	 */
					key : 'teamNm', align:'center',
					title : '팀',
					width: '90px'
				}, {/* 전송실 		 */
					key : 'tmofNm', align:'center',
					title : '전송실',
					width: '120px'
				},  {
					key : 'mtsoTyp', align : 'center',
					title : '국사유형',
					width : '90' //MTSO_TYP
				},  {
					key : 'intgMtsoId', align : 'center',
					title : '국사ID(통합국ID)',
					width : '120' //MTSO_TYP
				},  {
					key : 'sisulNm', align : 'center',
					title : '국사명(통합국명)',
					width : '250' //MTSO_TYP
				}, {
					key : 'floorNm', align : 'center',
					title : '층명',
					width : '100'  //MTSO_TYP
				}, {
					key : 'address', align : 'left',
					title : '건물주소',
					width : '250'
				},  {
					key : 'sisulCd', align : 'center',
					title : '통시코드',
					hidden:true,
					width : '90' //MTSO_TYP
				},/* {
				title : '도면정보', align : 'center',
				width : '60',
				render : function(value, data, render, mapping){
			          return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="floorBtn" type="button"></button></div>';
				}
			},*/ {
					title : '국사정보', align : 'center',
					width : '60',
					render : function(value, data, render, mapping){
						if(data.mtsoId != null && data.mtsoId != ''){
							return '<div style="width: 100%;"><button type="button" id="btnMtso" style="cursor: pointer"><span class="Icon Th-list"></span></button></div>'
						}
					}
				}, {
					title : '위치정보', align : 'center',
					width : '60',
					render : function(value, data, render, mapping){
						if(data.mtsoId != null && data.mtsoId != ''){
							return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="locBtn" type="button"></button></div>';
						}
					}
				},
//				{
//					title : '요청내역', align : 'center',
//					width : '60',
//					render : function (value, data, render, mapping, grid) {
//						return '<div style="width: 100%;"><button type="button" id="reqBtn" style="cursor: pointer"><span class="Icon User"></span></button></div>'
//					}
//				},
				{
					key : 'upsdRegRate',
					title : '상면등록률',
					width : '100px',
					sorting: 'number',
					render : {type:"bargraph",rule:[0,100]}
				}, {
					key : 'upsdRegCurst',
					title : '상면등록',
					width : '50px'
				}/*{
				key : 'affairCd01Nm', align : 'center',
				title : '지하1층',
				width : '80'
			}, {
				key : 'affairCd1Nm', align : 'center',
				title : '1층',
				width : '80'
			}, {
				key : 'affairCd2Nm', align : 'center',
				title : '2층',
				width : '80'
			}, {
				key : 'affairCd3Nm', align : 'center',
				title : '3층',
				width : '80'
			}, {
				key : 'affairCd4Nm', align : 'center',
				title : '4층',
				width : '80'
			}, {
				key : 'affairCd5Nm', align : 'center',
				title : '5층',
				width : '80'
			}, {
				key : 'affairCd6Nm', align : 'center',
				title : '6층',
				width : '80'
			}, {
				key : 'affairCd7Nm', align : 'center',
				title : '7층',
				width : '80'
			}*/],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});
		$('#'+floorGrid).alopexGrid({
			width : 'parent',
			height : '3row',
			fitTableWidth : true,
			autoColumnIndex : true,
			numberingColumnFromZero : false,
			pager : false,
			paging : {
				pagerTotal: false,
			},
			rowSelectOption : {
				clickSelect : true,
				singleSelect : true,
				disableSelectByKey : true
			},
			defaultColumnMapping : {
				resizing : true,
			},
			columnMapping : [
				{
					align : 'center',
					title : 'No.',
					width: '30px',
					resizing: false,
					numberingColumn : true
				}, {
					key : 'sisulCd'
				}, {
					key : 'mtsoId', align : 'center',
					title : '국사ID',
					width : '100'
				}, {
					key : 'mtsoNm', align : 'center',
					title : '국사명',
					width : '180'
				}, {
					key : 'intgMtsoTypCdVal', align : 'center',
					title : '용도',
					width : '130'
				}, {
					key : 'floorId', align : 'center',
					title : '층ID',
					width : '80',
					render : function(value, data, render, mapping){
						floorParam = data;
							return "<div style='width:100%'><u><a href=javascript:main.floorEdit('"+data.floorId+"','"+data.sisulCd+"')>"+data.floorId+"</a></u></div>";
			        }
				}, {
					key : 'floorNameNm', align : 'center',
					title : '층구분',
					width : '80'
				}, {
					key : 'floorLabel', align : 'center',
					title : '라벨명',
					width : '130',
					render : function(value, data, render, mapping){
						return "<div style='width:100%'><u><a href=javascript:main.floorEdit('"+data.floorId+"','"+data.sisulCd+"')>"+data.floorLabel+"</a></u></div>";
					}
				},  {
					key : 'assetNm', align : 'center',
					title : '자산구분',
					width : '100'
				}, {
					align : 'center',
					title : '도면',
					width : '50',
					render : function(value, data, render, mapping){
						return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnDraw" type="button"></button></div>';
					}
				}, {
					key: 'attfileId',
					align : 'center',
					title : 'CAD파일',
					width : '80',
					render : function(value, data, render, mapping){
						if(value != null){
							return '<button class="Valign-md" id="fileDownBtn" type="button" style="cursor: pointer"><span class="icoonly ico_attachment"></span></button>';
						}
					},
					tooltip : function(value, data, render, mapping){
						return data.attfileOrgNm;
					}
				}, {
					key: 'neFloorWidth',
					align : 'center',
					title : '가로(mm)',
					width : '70'
				}, {
					key: 'neFloorLength',
					align : 'center',
					title : '세로(mm)',
					width : '70'
				}, {
					key: 'neFloorHeight',
					align : 'center',
					title : '층고(mm)',
					width : '70'
				}, {
					key: 'attfileOrgNm',
					align : 'center',
					title : '원본이름',
					width : '80'
				}, {
					key: 'attfileNewNm',
					align : 'center',
					title : '저장된이름',
					width : '80'
				}, {
					key: 'attfilePath',
					align : 'center',
					title : '파일경로',
					width : '80'
				}, {
					key : 'celluse', align : 'center',
					title : '상면사용률',
					width : '70'
				}, {
					key : 'rackratio', align : 'center',
					title : '랙 사용률',
					width : '70'
				}, {
					key : 'chgDtNm', align : 'center',
					title : '수정일',
					width : '80'
				}
//				, {
//					key : 'bldCd', align : 'center',
//					title : '건물코드',
//					width : '80'
//				}
				],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
		});
		gridHide();
	};
	function gridHide() {



		var hideColList2 = ['upsdRegRate'];
		$('#'+gridId).alopexGrid("hideCol", hideColList2, 'conceal');


		var hideColList = ['attfileOrgNm', 'attfileNewNm', 'attfilePath','sisulCd','assetNm'];
		$('#'+floorGrid).alopexGrid("hideCol", hideColList, 'conceal');
	}
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var searchInspectCd = {supCd : '007000'};
		var searchGubun = {supCd : '008000'};
		var searchWorkGubun = "SKT";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ searchWorkGubun, null, 'GET', 'fstOrg');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchInspectCd, 'GET', 'searchInspectCd');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchGubun, 'GET', 'searchGubun');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');
	}


	function setEventListener() {

		var perPage = 100;

		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			$('#floorInf').hide();
			main.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			$('#floorInf').hide();
			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage);
		});

		//조회
		$('#btnSearch').on('click', function(e) {
			$('#floorInf').hide();
			main.setGrid(1,perPage);
		});


		//엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				$('#floorInf').hide();
				main.setGrid(1,perPage);
			}
		});

		//국사등록
		$('#btnReg').on('click', function(e) {
			MtsoReg();
		});

		//국사 층
		$('#'+gridId).on('click', '.bodycell', function(e){
			$('#floorInf').show();
			var dataObj = AlopexGrid.parseEvent(e).data;
			var data = {sisulCd: dataObj.sisulCd};
			$('#sisulLabel').val(dataObj.sisulNm);
			floorSetGrid(data);
		});


		$('#searchWorkGubun').on('change', function(e) {

   		 var mgmtGrpNm = $("#searchWorkGubun").val();

   		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

   		 var option_data =  null;
			if($('#searchWorkGubun').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCdList').setData({
                data:option_data
			});

        });

   	//본부 선택시 이벤트
   	 $('#orgId').on('change', function(e) {

   		 var orgID =  $("#orgId").getData();

   		 if(orgID.orgId == ''){
   			 var mgmtGrpNm = $("#searchWorkGubun").val();

   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
   		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

   		 }else{
   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
   		 }
        });
  // 	팀을 선택했을 경우
	 $('#teamId').on('change', function(e) {

		 var orgID =  $("#orgId").getData();
		 var teamID =  $("#teamId").getData();

 	 	 if(orgID.orgId == '' && teamID.teamId == ''){
 	 		 var mgmtGrpNm = $("#searchWorkGubun").val();

		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
 	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
 		 }else if(orgID.orgId != '' && teamID.teamId == ''){
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
 		 }else {
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
 		 }

	 });


		/*    	//국사층 구분 팝업
    	 $('#'+gridId).on('click', '#floorBtn', function(e){
    		 var dataObj = AlopexGrid.parseEvent(e).data;
    		 var data = {sisulCd: dataObj.sisulCd};
    		 $a.popup({
    			 title: '국사 층 구분',
    			 url: $('#ctx').val()+'/configmgmt/upsdmgmt/UpsdMtsoFloorList.do',
    			 data: data,
    			 iframe: false,
    			 windowpopup: true,
    			 modal: false,
    			 width : window.innerWidth * 0.9,
    			 height : window.innerHeight * 0.8,
    		 });
 		});*/

		 var option_data =  null;
			if($('#searchWorkGubun').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCdList').setData({
              data:option_data
			});


		//건물지도 클릭시 팝업
   	 	$('#'+gridId).on('click', '#locBtn', function(e){

	   		 if(gisMap == null || gisMap.opener == null){
	   			 gisMap = window.open('/tango-transmission-gis-web/tgis/Main.do');
	   		 }else{
	   			 gisMap.focus();
	   			 gisMap.$('body').progress();
	   		 }

	   		var dataObj = AlopexGrid.parseEvent(e).data;
	   		var data = {mgmtGrpNm:'SKT', repIntgFcltsCd: dataObj.sisulCd, mtsoId: dataObj.mtsoId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', data, 'GET', 'mtsoMapInf');

		});

		//요청내역 클릭시 팝업
		$('#'+gridId).on('click', '#reqBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId
					,cellId: "", cellNm: ""
			}
			$a.popup({
				title: '상면사용승인 관리',
				url: $('#ctx').val()+'/configmgmt/upsdmgmt/UpsdUseAprvMgmt.do',
				data: data,
				iframe: false,
				windowpopup: true,
				modal: false,
				width: '1000',
				height: '830',
				/*callback: function(data) {
    				 console.log(data);
    			 }
				 */
			});
		});
		//국사관리
		$('#'+gridId).on('click', '#btnMtso', function(e){
			//$('body').progress();
			var dataObj = AlopexGrid.parseEvent(e).data;
			if(dataObj.mtsoId == ''||dataObj.mtsoId == null){
				callMsgBox('','I', makeArgConfigMsg('해당국사는 상세내역을 볼 수 없습니다.'), function(msgId, msgRst){});
			    return;
			}

			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
        	var paramData = {mtsoEqpGubun :'mtso', mtsoEqpId : dataObj.mtsoId, parentWinYn : 'Y'};
    		var popMtsoEqp = $a.popup({
    			popid: tmpPopId,
    			title: '통합 국사/장비 정보',
    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
    			data: paramData,
    			iframe: false,
    			modal: false,
    			movable:false,
    			windowpopup: true,
    			width : 900,
    			height : window.innerHeight,
				callback: function(data) {
					console.log(data);
				}
    		});
		});

		//상면 Eng. 기준
		$('#engReg').on('click', function(e) {
			$a.popup({
				title: '상면 Eng. 기준',
				url: $('#ctx').val()+'/configmgmt/upsdmgmt/UpsdEngStd.do',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				width : window.innerWidth * 0.9,
				height : window.innerHeight * 0.9,
			});
		});
		// 도면 클릭시
		$('#'+floorGrid).on('click', '#btnDraw', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
			console.log(data);
			$a.popup({
				title: '드로잉 툴',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
				data: data,
				iframe: false,
				windowpopup: true,
				movable:false,
				width : screen.availWidth,
				height : screen.availHeight,
				callback: function(data) {
					main.floorGridRefresh();
				}
			});
		});

		//층 추가
	      $('#btnFloorAdd').on('click', function(e) {
	    	  	var selectData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
				var dataObj = {topMtsoId : selectData.mtsoId, bldCd : selectData.bldCd, sisulCd: selectData.sisulCd,sisulNm: $('#sisulLabel').val(), insert: 'I'};
		    	  $a.popup({
		    		  title: '층관리',
		    		  url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawMtsoFloorPop.do',
		    		  data: dataObj,
		    		  iframe: false,
		    		  windowpopup: true,
		    		  modal: false,
		    		  width : 450,
		    		  height : 400,
		    		  callback: function(data){
		    			  main.floorGridRefresh();
		    		  }
		    	  });
	          });
	    // 층 삭제

	      $('#btnFloorDel').on('click', function(e){
				var selectData = $('#'+floorGrid).alopexGrid('dataGet', {_state: {selected: true}})[0];
				if(selectData == undefined) {
					alertBox('W', "삭제할 국사 층을 선택해주세요");
					return false;
				}
				var data = {sisulCd: selectData.sisulCd, floorId: selectData.floorId, useYn:'N'};

				callMsgBox('','C', "국소(층) 정보를 삭제 하시겠습니까?", function(msgId, msgRst){
        			//삭제한다고 하였을 경우
     		        if (msgRst == 'Y') {
     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/setFloorsUseYn', data, 'POST', 'floorUseYn');
     		        }
    		     });
			});
		// 국사별 도면(CAD) 업로드
		$('#btnUpload').on('click', function(e){
			var selectData = $('#'+floorGrid).alopexGrid('dataGet', {_state: {selected: true}})[0];
			if(selectData == undefined) {
				alertBox('W', "업로드할 국사 층을 선택해주세요");
				return false;
			}
			var data = {sisulCd: selectData.sisulCd, floorId: selectData.floorId};

			$a.popup({
				title: '국사별 도면(CAD) 업로드',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoFloorUpload.do',
				data: data,
				iframe: false,
				windowpopup: true,
				movable:false,
				width : 500,
				height : window.innerHeight * 0.3,
				callback: function(data) {
					main.floorGridRefresh();;
				}
			});
		});

		// 도면 파일 다운로드
		$('#'+floorGrid).on('click', '#fileDownBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;

			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/downloadfile");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			// X-Remote-Id와 X-Auth-Token을 parameter로 넘기기 위한 함수(open api를 통하므로 반드시 작성)
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+ dataObj.attfileNewNm +'" />');
			$form.append('<input type="hidden" name="fileOriginalName" value="'+ dataObj.attfileOrgNm +'" />');
			$form.append('<input type="hidden" name="filePath" value="'+ dataObj.attfilePath +'" />');
			$form.appendTo('body');
			$form.submit().remove();
		});


		//엑셀다운
		$('#btnExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			var param =  $("#searchForm").getData();
//			param.searchWorkGubun = $("#searchWorkGubun").val();
//			param.searchInspectCd = $("#searchInspectCd").val();
//			param.searchGubun = $("#searchGubun").val();
			//param.searchCellUse = $("#searchCellUse").val();

			param = gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 10;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;

/*
			tmofList
			mtsoCntrTypCdList
			mtsoTypCdList
			*/

			var tmofList_Tmp = "";
			var mtsoCntrTypCdList_Tmp = "";
			var mtsoTypCdList_Tmp = "";
			if (param.tmofList != "" && param.tmofList != null ){
	   			 for(var i=0; i<param.tmofList.length; i++) {
	   				 if(i == param.tmofList.length - 1){
	   					tmofList_Tmp += param.tmofList[i];
	                    }else{
	                    	tmofList_Tmp += param.tmofList[i] + ",";
	                    }
	    			}
	   			param.tmofList = tmofList_Tmp ;
	   		 }


			if (param.mtsoCntrTypCdList != "" && param.mtsoCntrTypCdList != null ){
	   			 for(var i=0; i<param.mtsoCntrTypCdList.length; i++) {
	   				 if(i == param.mtsoCntrTypCdList.length - 1){
	   					mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i];
	                    }else{
	                    	mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoCntrTypCdList = mtsoCntrTypCdList_Tmp ;
	   		 }

			if (param.mtsoTypCdList != "" && param.mtsoTypCdList != null ){
	   			 for(var i=0; i<param.mtsoTypCdList.length; i++) {
	   				 if(i == param.mtsoTypCdList.length - 1){
	   					mtsoTypCdList_Tmp += param.mtsoTypCdList[i];
	                    }else{
	                    	mtsoTypCdList_Tmp += param.mtsoTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoTypCdList = mtsoTypCdList_Tmp ;
	   		 }

			param.fileName = '국사리스트'
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.method = "getUpsdMtsoList";

			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/excelcreate', param, 'GET', 'excelDownload');
		});

		$('#btnDataMgmt').on('click', function(e) {
			$a.popup({
				title: '상면 작업 이력',
				url: $('#ctx').val()+'/configmgmt/upsdmgmt/UpsdDataMgmtCurst.do',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 1250,
				height : 790,
			});
		});


		$('#btnTemp').on('click', function(e) {
			$a.popup({
				title: '상면 국사 검색',
				url: $('#ctx').val()+'/configmgmt/upsdmgmt/DrawCstrCd.do?cstrCd=T18112158694481&cstrGubun=1',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 1250,
				height : 790,
			});
		});
	};

	function gisM(dataObj){
		gisMap.$('body').progress();
		httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
	}

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/
	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
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

	function MtsoReg(){
		$a.popup({
			popid: 'UpsdMtsoReg',
			title: configMsgArray['mobileTelephoneSwitchingOfficeReg'],
			url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoReg.do',
			data: {"workGubun" : "", "orgIdNm" : ""},
			windowpopup: true,
			modal: true,
			movable:true,
			width : 800,
			height : 300
		});
	}


	this.floorGridRefresh = function(){
		var selectData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
		floorSetGrid(selectData);
	}

	this.floorEdit = function(floorId, sisulCd){
		var selectData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
		var paramData = {topMtsoId : selectData.mtsoId, sisulCd: sisulCd, floorId: floorId, insert: 'U'};
	    	  $a.popup({
	    		  title: '층관리',
	    		  url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawMtsoFloorPop.do',
	    		  data: paramData,
	    		  iframe: false,
	    		  windowpopup: true,
	    		  modal: false,
	    		  width : 450,
	    		  height : 400,
	    		  callback: function(data){
	    			  main.floorGridRefresh();
	    		  }
	    	  });
    	  //SetCommand('DESIGN_PANEL_SAVE', '', '');
          };

	function successCallback(response, status, jqxhr, flag){

		//층 삭제
		if(flag == 'floorUseYn'){
			main.floorGridRefresh();
		}

		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		if(flag == 'fstOrg'){
			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}
			$('#orgId').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    			if(resObj.orgId == sUprOrgId) {
							selectId = resObj.orgId;
						}
		    		}
		    		if(selectId == null){
		    			selectId = response[0].orgId;
		    			sUprOrgId = selectId;
		    		}
		    		$('#orgId').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   	}

		if(flag == 'fstTeam'){
    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamId').clear();

      		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#teamId').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#teamId').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}
		if(flag == 'team'){
    		$('#teamId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#teamId').setData({
                 data:option_data
    		});
    	}
		if(flag == 'tmof'){
    		$('#tmofList').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmofList').setData({
                 data:option_data
    		});
    	}


		if(flag == 'mtsoCntrTypCdList') {
    		$('#mtsoCntrTypCdList').clear();

    		var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
	             data:option_data
			});
    	}

		if(flag == 'opTeam'){
    		$('#opTeamOrgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#opTeamOrgId').setData({
                 data:option_data
    		});
    	}

		//용도구분
		if(flag == 'searchGubun'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		//국사 조회시
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.mtsoList);
		}

		//국사 조회시
		if(flag == 'floorSearch'){
			$('#'+floorGrid).alopexGrid('hideProgress');
			$('#'+floorGrid).alopexGrid('dataSet', response.floorList);
		}

		//국사 조회시
		if(flag == 'mtsoDtlLkup'){
			$('body').progress().remove();
			var data = {
					mtsoEqpGubun : 'mtso',	// mtso Or eqp
					mtsoEqpId:response.mtsoMgmtList[0].mtsoId,
					linkTab : 'tab_Draw',

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
		}

		if(flag == 'mtsoMapInf'){
			var data = {
						mtsoId:response.mtsoMgmtList[0].mtsoId
						, mtsoNm: response.mtsoMgmtList[0].mtsoNm
						, mtsoTyp: response.mtsoMgmtList[0].mtsoTyp
						, mtsoStat: response.mtsoMgmtList[0].mtsoStat
						, bldAddr: response.mtsoMgmtList[0].bldAddr
						, mtsoLatVal: response.mtsoMgmtList[0].mtsoLatVal
						, mtsoLngVal: response.mtsoMgmtList[0].mtsoLngVal
						, moveMap: true //지도이동 안하겠다.
						};

	   		//GIS 국사관리번호 조회 지도에 표시

    		setTimeout(function(){
    			gisM(data);
			}, 5000);
		}

		/*...........................*
        국사관리번호 받아서 지도에 표시
		 *...........................*/
		if(flag =='searchGisMtsoInf'){
			//레이어초기화

			mgMap = gisMap.window.mgMap;
			L = gisMap.window.L;

			var mtsoInfLayer = mgMap.addCustomLayerByName('MTSO_INF_LAYER');//국사표시를 위한 레이어
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();

	        //GIS국사정보
			var gisMtsoInf = null; gisMtsoInf = response.gisMtsoInf;

	       //팝업할 국사정보 세팅
			    var html =
		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
		            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
		            '<b>국사번호:</b><%pop_mtsoId%><br>' +
		            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
		            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
		            '<b>건물주소:</b><%pop_bldAddr%>';

	        html = html.replace('<%pop_mtsoNm%>',response.mtsoNm);
	        html = html.replace('<%pop_mtsoId%>',response.mtsoId);
	        html = html.replace('<%pop_mtsoTyp%>',response.mtsoTyp);
	        html = html.replace('<%pop_mtsoStat%>',response.mtsoStat);
	        html = html.replace('<%pop_bldAddr%>',response.bldAddr);

			//GIS 국사정보가 없을 경우
			if (gisMtsoInf == null || gisMtsoInf == "") {
					//구성팀 국사 위경도 있으면
				    if (response.mtsoLatVal != null && response.mtsoLatVal != "" &&
				    	response.mtsoLngVal != null && response.mtsoLngVal != ""	)
				    {
				    	//GIS 국사관리번호가 없습니다. 국사의 위경도 위치를 표시합니다.
		 				callMsgBox('','W', configMsgArray['noGisMtsoMgmtNo'] , function(msgId, msgRst){});
				    	if(response.moveMap){
				    		//해당 좌표로 이동
				    		gisMap.window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
		 	 			    //반경거리 표시해주고
		 			        if (circleRange != 0){
		 			        	var distance_circle_layer = window.distanceCircleLayer;
		 	 			        distance_circle_layer.clearLayers();
		 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
		 					    distance_circle_layer.addLayer(distance_circle);
		 			        }
				    	}

		 			    //국사포인트 표시하고 정보팝업
				        var marker = L.marker([response.mtsoLatVal, response.mtsoLngVal]);
				        mtsoInfLayer.addLayer(marker);
				        html = html.replace('<%pop_mtsoMgmtNo%>','**********');
				        marker.bindPopup(html).openPopup();

				    //GIS국사정보도 구성팀 국사 위경도도 없으면
				    }else{
				    	//국사의 위도,경도 정보가 없습니다.
				    	callMsgBox('','W', configMsgArray['noMtsoLatLng'] , function(msgId, msgRst){});
				    }
				//GIS국사정보가 있으면
				}else{
				     var latlng = L.MG.Util.wktToGeometry(gisMtsoInf.geoWkt).getLatLng();//국사 위치정보
				     if(response.moveMap){//지도이동여부 예 이면
				    	//해당 좌표로 이동
				    	 gisMap.window.mgMap.setView([latlng.lat, latlng.lng], 13);
		 			    //반경거리 표시해주고
				        if (circleRange != 0){
				        	var distance_circle_layer = gisMap.window.distanceCircleLayer;
		 			        distance_circle_layer.clearLayers();
						    var distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
						    distance_circle_layer.addLayer(distance_circle);
				        }
				   }
				    //국사포인트 표시하고 정보팝업
		        var marker = L.marker([latlng.lat, latlng.lng]);
		        mtsoInfLayer.addLayer(marker);
		        html = html.replace('<%pop_mtsoMgmtNo%>',gisMtsoInf.mtsoMgmtNo);
		        marker.bindPopup(html).openPopup();
				}
		}

		if(flag == 'excelDownload'){
			$('#'+gridId).alopexGrid('hideProgress');
			console.log('excelCreate');
			console.log(response);

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

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
	}
	function floorSetGrid(param){
		$('#'+floorGrid).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoFloorList', param, 'GET', 'floorSearch');
	}
	this.setGrid = function(page, rowPerPage){

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param =  $("#searchForm").serialize();

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUpsdMtsoList', param, 'GET', 'search');
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

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
});

