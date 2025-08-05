let gridId = 'dataGrid';
let checkedLayer = [];

let main = $a.page(function() {
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	sessionStorage.setItem('param', JSON.stringify(param));

    	EteMtsoInfo.initGrid();
    	EteMtsoInfo.setGrid(param);
    	EteMtsoInfo.setEventListener(param);
    }
});

let EteMtsoInfo = {

		initGrid: function() {
			//그리드 생성
			$('#'+gridId).alopexGrid({
				paging : {
					pagerSelect: [100,300,500,1000,5000],
					hidePageList: false  // pager 중앙 삭제
				},
				height: function(gridHTMLElement){ return $(gridHTMLElement).parent().height(); },
				fitTableWidth : true,
				rowSelectOption : {
					singleSelect : false,
				},
				autoResize: true,
				headerGroup: [
					{fromIndex:1,  toIndex:6,  title:'시작국사'},
					{fromIndex:10, toIndex:15, title:'종료국사'},
					],
				columnMapping: [
					{ key : 'check',		   align :'center',  					    width: '40px', selectorColumn : true },
	        		{ key : 'umtsoMgmtNo', 	   align :'center', title: '국사관리번호', 		width: '110px' },
	        		{ key : 'umtsoFcltNm', 	   align :'center', title: '국사시설명', 	  	width: '110px' },
	        		{ key : 'umtsoRackNo', 	   align :'center', title: '랙번호', 		 	width: '80px'  },
	        		{ key : 'umtsoShlfNo', 	   align :'center', title: '쉘프번호', 		width: '80px'  },
	        		{ key : 'umtsoPortNo', 	   align :'center', title: '포트번호',		 	width: '80px'  },
	        		{ key : 'umtsoCblMgmtNo',  align :'center', title: 'SKT케이블관리번호', 	width: '130px' },
	        		{ key : 'coreCnntRmk', 	   align :'center', title: 'FDF접속비교',		width: '200px' },
	        		{ key : 'useYn', 		   align :'center', title: '사용여부', 		width: '90px'  },
	        		{ key : 'eteTrceDistm',    align :'center', title: 'ETE거리', 		width: '130px' },
	        		{ key : 'lmtsoMgmtNo', 	   align :'center', title: '국사관리번호', 	 	width: '110px' },
	        		{ key : 'lmtsoFcltNm', 	   align :'center', title: '국사시설명', 	  	width: '110px' },
	        		{ key : 'lmtsoRackNo', 	   align :'center', title: '랙번호', 		 	width: '80px'  },
	        		{ key : 'lmtsoShlfNo', 	   align :'center', title: '쉘프번호', 	 	width: '80px'  },
	        		{ key : 'lmtsoPortNo', 	   align :'center', title: '포트번호', 		width: '80px'  },
	        		{ key : 'lmtsoCblMgmtNo',  align :'center', title: 'SKT케이블관리번호', 	width: '130px' },
	        		{ key : 'umtsoLmtsoTypNm', align :'center', title: '상하위국사유형명',	width: '110px', hidden:true },
	        		{ key : 'insCblMgmtNo',    align :'center', title: '입력코어번호',		width: '110px', hidden:true },
	        		{ key : 'insCoreNo', 	   align :'center', title: '입력코어번호',		width: '110px', hidden:true },
	        		{ key : 'prtCblMgmtNo',    align :'center', title: '입력코어번호',		width: '110px', hidden:true },
	        		{ key : 'prtCoreNo', 	   align :'center', title: '입력코어번호',		width: '110px', hidden:true },
	        		{ key : 'patchPortNo', 	   align :'center', title: '입력코어번호',		width: '110px', hidden:true }
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
			});
		},

		// 그리드 정보
		setGrid : function(param) {
			$('#'+gridId).alopexGrid('dataEmpty');
			$('#'+gridId).alopexGrid('showProgress');

			Util.jsonAjax({
				url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getEteTraceMtsoList',
				data:param,
				method:'GET',
				async:false
				}).done(
				function(response) {
					serverPageinfo = {
		    			dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		    		};
		    		$('#'+gridId).alopexGrid('hideProgress');
		    		$('#'+gridId).alopexGrid('dataSet', response.dataList, serverPageinfo);
				}.bind(this)
			);
		},

		/*-----------------------------*
	     *  이벤트
	     *-----------------------------*/
	    setEventListener : function(parentParam) {
	    	// 전체 선택시 - 메인지도에 ETE경로표시
	    	$('#'+gridId).on('click','.headercell input', function(e) {
	    		let dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet" , {_state : {selected:true}}));

	    		// 체크박스 전체 해제
	    		if (dataObj.length == 0 && checkedLayer.length != 0) {
	         		//전체 레이어지우기
	    			EteMtsoInfo.checkedLayerClear(checkedLayer);
		        }

	    		let param = [];
	    		let gisRingLnPathLayer;

	    		for(let i=0; i<dataObj.length; i++) {
	    			let rangeRingLayerId = parentParam.tmpPopId + "_RANGE_ETE_LAYER_" + i;
		        	gisRingLnPathLayer = window.mgMap.getCustomLayerByName(rangeRingLayerId);

		        	// 체크박스 전체 체크
		         	if (dataObj.length > 0){
		         		let tmpParam = new Object();
		         		if (dataObj[i].umtsoLmtsoTypNm == 'U') {
		         			tmpParam.umtsoMgmtNo = dataObj[i].umtsoMgmtNo;
		         			tmpParam.umtsoRackNo = dataObj[i].umtsoRackNo;
		         			tmpParam.umtsoShlfNo = dataObj[i].umtsoShlfNo;
		         			tmpParam.umtsoPortNo = dataObj[i].umtsoPortNo;
		         		} else {
		         			tmpParam.umtsoMgmtNo = dataObj[i].lmtsoMgmtNo;
		         			tmpParam.umtsoRackNo = dataObj[i].lmtsoRackNo;
		         			tmpParam.umtsoShlfNo = dataObj[i].lmtsoShlfNo;
		         			tmpParam.umtsoPortNo = dataObj[i].lmtsoPortNo;
		         		}
		         		tmpParam.layerId = rangeRingLayerId;

		         		param.push(tmpParam);
		         	}
	    		}

	    		let paramData = {eteAllPathList : param};
	    		if (param.length > 0){
	    			Util.jsonAjax({
	        			  url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getEteTraceMtsoAllPathList'
	        			, data:paramData
	        			, method:'POST'
	        			, async:false}).done(
	        			function(response) {
			        		if(response.dataList.length > 0){
		        				for(let i=0; i<response.dataList.length; i++) {
		        					let lnList = response.dataList[i];
		        					let lineFeatures = {features: []}; //연결라인

		        					gisRingLnPathLayer = window.mgMap.addCustomLayerByName(lnList.layerId, {selectable: false});
		        					checkedLayer.push(lnList.layerId);

		        					_.each(lnList.groupedPathValues, function(item, idx){
		        						let gisCoordArray = item.geo.split('/');
		        						let gisRingLineArray = Util.getRingPathLineString(gisCoordArray);

		        						let lineFeature = {type : 'Feature',
		        								geometry : {
		        									type : 'LineString',
		        									coordinates : gisRingLineArray
		        								},
		        								style : [{id:'STYLE_ETE_LN_LINK_RED_LINE_' + i}],
		        						};
		        						lineFeatures.features.push(lineFeature);
		        					});

		        					gisRingLnPathLayer.addData(lineFeatures);

		        					window.mgMap.fitBounds(gisRingLnPathLayer.getBounds(), window.mgMap.getZoom());
		        				}
	        				} else {
	        					callMsgBox('','W', '선로 정보가 존재하지 않습니다.', function(msgId, msgRst){});
	        				}
	        			});
	    		}
	    	});

	    	// row 클릭시 - 메인지도에 ETE경로표시
			$('#'+gridId).on('click', '.bodycell', function(e){
				let dataObj = AlopexGrid.parseEvent(e).data;
				let rangeRingLayerId = parentParam.tmpPopId + "_RANGE_ETE_LAYER_" + dataObj._index.row;
	        	let gisRingLnPathLayer = window.mgMap.getCustomLayerByName(rangeRingLayerId);

	         	//체크박스 체크
	         	if (dataObj._state.selected){
	         		let param = new Object();
	         		if (dataObj.umtsoLmtsoTypNm == 'U') {
	         			param.umtsoMgmtNo = dataObj.umtsoMgmtNo;
		         		param.umtsoRackNo = dataObj.umtsoRackNo;
		         		param.umtsoShlfNo = dataObj.umtsoShlfNo;
		         		param.umtsoPortNo = dataObj.umtsoPortNo;
	         		} else {
	         			param.umtsoMgmtNo = dataObj.lmtsoMgmtNo;
		         		param.umtsoRackNo = dataObj.lmtsoRackNo;
		         		param.umtsoShlfNo = dataObj.lmtsoShlfNo;
		         		param.umtsoPortNo = dataObj.lmtsoPortNo;
	         		}
	         		param.layerId = rangeRingLayerId;

	        		Util.jsonAjax({
	        			  url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getEteTraceMtsoPathList'
	        			, data:param
	        			, method:'GET'
	        			, async:false}).done(
	        			function(response) {

	        				if(response.dataList.length > 0){
	        					let lnList = response.dataList;
	        					let lineFeatures = {features: []}; //연결라인

	        	         		gisRingLnPathLayer = window.mgMap.addCustomLayerByName(rangeRingLayerId, {selectable: false});
	        					checkedLayer.push(gisRingLnPathLayer._layerName);

	        					_.each(lnList, function(item, idx){

	        						let gisCoordArray = item.geo.split('/');
	        						let gisRingLineArray = Util.getRingPathLineString(gisCoordArray);

	        						let lineFeature = {type : 'Feature',
	        								geometry : {
	        									type : 'LineString',
	        									coordinates : gisRingLineArray
	        								},
	        								style : [{id:'STYLE_ETE_LN_LINK_RED_LINE_' + dataObj._index.row}],
	        						};
	        						lineFeatures.features.push(lineFeature);
	        					});

	        					gisRingLnPathLayer.addData(lineFeatures);
	        					window.mgMap.fitBounds(gisRingLnPathLayer.getBounds(), window.mgMap.getZoom());

	        				} else {
	        					callMsgBox('','W', '선로 정보가 존재하지 않습니다.', function(msgId, msgRst){});
	        				}
	        			});
	         	//체크박스 해제
	         	} else {
	         		//해당 레이어지우기
	         		if (!$.TcpMsg.isEmpty(gisRingLnPathLayer)) {
	         			// 리스트에서 체크해제된 레이어 빼고 새로운 리스트를 만듦
	         			checkedLayer = checkedLayer.filter(function(layer) {
	         				return layer !== gisRingLnPathLayer._layerName;
	         			})
	         			gisRingLnPathLayer.clearLayers();
	         		}
	         	}
	         });

	         $('#'+gridId).on('dblclick', function(e){
	        	let dataObj = AlopexGrid.parseEvent(e).data;
	        	let paramData = {};

	     		if (dataObj.umtsoLmtsoTypNm == 'U') {
	     			let mtsoTypFlag = 'u'
	     			if ($.TcpMsg.isEmpty(dataObj.umtsoRackNo) || $.TcpMsg.isEmpty(dataObj.umtsoShlfNo || $.TcpMsg.isEmpty(dataObj.umtsoPortNo) )
		     				|| $.TcpMsg.isEmpty(dataObj.umtsoMgmtNo) || $.TcpMsg.isEmpty(dataObj.insCoreNo) || $.TcpMsg.isEmpty(dataObj.umtsoCblMgmtNo)) {
		                 alert('ETE수행에 필요한 정보가 없습니다[랙,쉘프,포트,국사관리번호,입력케이블번호,SKT케이블관리번호]');
		                 return;
		            }
	     			//--------------------------------------------------
		            // ETE실행 파라미터 설정

		            // 1) 입력케이블 파라미터 설정
		     		paramData = {
		     				mtsoMgmtNo: dataObj.umtsoMgmtNo,
		     				rackNo: dataObj.umtsoRackNo,
		     				shlfNo: dataObj.umtsoShlfNo,
		     				portNo: dataObj.umtsoPortNo,
		     				insCblMgmtNo: dataObj.insCblMgmtNo,
		     				insCoreNo: dataObj.insCoreNo,
		     				prtCblMgmtNo: "",
		     				prtCoreNo: "",
		     				isPatch: false
		     		}
	     		} else {
	     			if ($.TcpMsg.isEmpty(dataObj.lmtsoRackNo) || $.TcpMsg.isEmpty(dataObj.lmtsoShlfNo || $.TcpMsg.isEmpty(dataObj.lmtsoPortNo) )
		     				|| $.TcpMsg.isEmpty(dataObj.lmtsoMgmtNo) || $.TcpMsg.isEmpty(dataObj.insCoreNo) || $.TcpMsg.isEmpty(dataObj.lmtsoCblMgmtNo)) {
		                 alert('ETE수행에 필요한 정보가 없습니다[랙,쉘프,포트,국사관리번호,입력케이블번호,SKT케이블관리번호]');
		                 return;
		            }
	     			//--------------------------------------------------
		            // ETE실행 파라미터 설정

		            // 1) 입력케이블 파라미터 설정
		     		paramData = {
		     				mtsoMgmtNo: dataObj.lmtsoMgmtNo,
		     				rackNo: dataObj.lmtsoRackNo,
		     				shlfNo: dataObj.lmtsoShlfNo,
		     				portNo: dataObj.lmtsoPortNo,
		     				insCblMgmtNo: dataObj.insCblMgmtNo,
		     				insCoreNo: dataObj.insCoreNo,
		     				prtCblMgmtNo: "",
		     				prtCoreNo: "",
		     				isPatch: false
		     		}
	     		}

	     		// 2) 출력케이블 파라미터 설정
	     		if ($.TcpMsg.isNotEmpty(dataObj.prtCblMgmtNo) && $.TcpMsg.isNotEmpty(dataObj.prtCoreNo)) {
	     			paramData.prtCblMgmtNo = dataObj.prtCblMgmtNo;
	     			paramData.prtCoreNo = dataObj.prtCoreNo;
	     		}

	     		// 3) 패치 여부
	     		if ($.TcpMsg.isNotEmpty(dataObj.patchPortNo)) {
	     			paramData.isPatch = true;
	     		}

	     		//--------------------------------------------------
	     		// 팝업조회
	     		$a.popup({
	     			width: 1300,
	     			height: 780,
	     			data: paramData,
	     			modal: false,
	     			url: "/tango-transmission-gis-web/nm/fdflnst/EteTraceMtso.do",
	     			iframe: false,
	     			windowpopup: true,
	     			title: 'ETE경로 조회',
	     			other: 'top=100,left:100,scrollbars=yes, location=no',
	     			callback: function(){
	     			}
	     		});
	         });

	         $("#btnClose").on("click", function(e) {
	        	 EteMtsoInfo.checkedLayerClear(checkedLayer);
	        	 $a.close();
	         });

	         window.addEventListener("beforeunload", (event) =>  {
	        	 EteMtsoInfo.checkedLayerClear(checkedLayer);
	         });

	         window.addEventListener("unload", () => {
	        	 EteMtsoInfo.checkedLayerClear(checkedLayer);
	         });
	    },

	    checkedLayerClear : function(layerId) {
	    	for(let i=0; i<layerId.length; i++) {
     			let gisRingLnPathLayer = window.mgMap.getCustomLayerByName(layerId[i]);
     			gisRingLnPathLayer.clearLayers();
     		}

     		checkedLayer = []
	    }
}