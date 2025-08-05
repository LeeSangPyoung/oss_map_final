
let main = $a.page(function() {

	var gridIdLno = 'dataGridLno';

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	sessionStorage.setItem('param', JSON.stringify(param));

    	RingInfo.initRingInfoGrid();
    	RingInfo.initLnoInfoGrid();

    	RingInfo.setRingInfoGrid(param);
    	RingInfo.setEventListner();
    }
});

let RingInfo = {
		// 링 정보 그리드
		initRingInfoGrid: function() {
			//그리드 생성
			$('#ringInfoGrid').alopexGrid({
				 height: '5row',
	        	 cellSelectable : true,
	             autoColumnIndex : true,
	             fitTableWidth : true,
	             rowClickSelect : true,
	             rowSingleSelect : true,
	             rowInlineEdit : true,
	             pager : true,
	             numberingColumnFromZero : false
	            ,paging: {
	            	pagerTotal:true
	            },
				columnMapping: [
					{ align:'center', 	  title: '순번', width: '40px', numberingColumn: true },
	        		{ key : 'ntwkLineNo', align:'center', title : '링ID', width: '110px' },
	        		{ key : 'ntwkLineNm', align:'left', title : '링명', width: '350px' },
	        		{ key : 'ntwkTypNm', align:'center', title : '망구분', width: '100px' },
	        		{ key : 'topoSclNm', align:'center', title : '망종류', width: '100px' },
	        		{ key : 'ntwkStatNm', align:'center', title : '회선상태', width: '80px' },
	        		{ key : 'ntwkCapaNm', align:'center', title : '용량', width: '80px' },
	        		{ key : 'ringSwchgMeansNm', align:'center', title : '절체방식', width: '130px' },
	        		{ key : 'uprMtsoId', align:'center', title : '상위국ID', width: '130px' },
	        		{ key : 'uprMtsoNm', align:'center', title : '상위국', width: '130px' },
	        		{ key : 'lowMtsoId', align:'center', title : '하위국ID', width: '130px' },
	        		{ key : 'lowMtsoNm', align:'center', title : '하위국', width: '130px' }
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
			});
		},

		initLnoInfoGrid: function() {
			//그리드 생성
			$('#dataGridLno').alopexGrid({
//				 height: "row",
				 cellSelectable : true,
	             autoColumnIndex : true,
	             grouping:{
	     			by:['trkNm','ringNm','wdmNm'],
	     			useGrouping:true,
//	     			useGroupRearrange:true,
	     			useGroupRowspan:true
	     		 },
	             fitTableWidth : true,
	             rowClickSelect : true,
	             rowSingleSelect : true,
	             rowInlineEdit : true,
	             pager : true,
	             numberingColumnFromZero : false,
	            paging: {
	            	  pagerTotal:true
	            },
				columnMapping: [
					{ align:'center', title : '순번', width: '40px', numberingColumn: true },
		    		    { key : 'wdmNm', align:'center', title : 'WDM트렁크', width: '100px', rowspan:true },
		    			{ key : 'lftMtsoNm', align:'left', title : 'WEST국사', width: '100px'},
		    			{ key : 'lftEqpRingDivNm', align:'left', title : 'WEST상하위', width: '100px'},
		    			{ key : 'lftEqpNm', align:'left', title : 'WEST장비', width: '300px'},
		    			{ key : 'lftPortNm', align:'center', title : 'WEST포트', width: '80px'},
		    			{ key : 'lftChnlVal', align:'left',title : 'WEST채널', width: '120px'},
		    			{ key : 'rghtMtsoNm', align:'left', title : 'EAST국사', width: '150px'},
		    			{ key : 'rghtEqpRingDivNm', align:'left', title : 'EAST상하위', width: '100px'},
		    			{ key : 'rghtEqpNm', align:'left', title : 'EAST장비', width: '300px'},
		    			{ key : 'rghtPortNm', align:'center', title : 'EAST포트', width: '120px'},
		    			{ key : 'rghtChnlVal', align:'center', title : 'EAST채널', width: '120px'}
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
			});
		},

		// 링 정보 그리드
		setRingInfoGrid : function(param) {

			$('#ringInfoGrid').alopexGrid('dataEmpty');
			$('#ringInfoGrid').alopexGrid('showProgress');

			Util.jsonAjax({
				url: '/transmisson/tes/configmgmt/commonlkup/eqpntwks',
				data:param,
				method:'GET',
				async:false
				}).done(
				function(response) {
		    		$('#ringInfoGrid').alopexGrid('hideProgress');
		    		$('#ringInfoGrid').alopexGrid('dataSet', response.ntwks);
				}.bind(this)
			);
		},

		setEventListner: function() {
			// excel down load
	    	$('#btnExportExcel').on('click', function(e) {

	    		var dt = new Date();
	    		var recentY = dt.getFullYear();
	    		var recentM = dt.getMonth() + 1;
	    		var recentD = dt.getDate();

	    		if(recentM < 10) recentM = "0" + recentM;
	    		if(recentD < 10) recentD = "0" + recentD;

	    		var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

	    		var worker = new ExcelWorker({
	    			excelFileName : "Ring정보_"+recentYMD,
	    			sheetList : [{
	    				sheetName : 'Ring정보',
	    				$grid : $('#ringInfoGrid')
	    			}]
	    		});


	    		worker.export({
	    			merge : true,
	    			useCSSParser : true,
	    			useGridColumnWidth : true,
	    			border : true,
	    			callback : {
	    				preCallback : function(gridList){
	    					for(var i=0; i < gridList.length; i++) {
	    						if(i == 0  || i == gridList.length -1)
	    							gridList[i].alopexGrid('showProgress');
	    					}
	    				},
	    				postCallback : function(gridList) {
	    					for(var i=0; i< gridList.length; i++) {
	    						gridList[i].alopexGrid('hideProgress');
	    					}
	    				}
	    			}
	    		});

//	      		Util.jsonAjax({
//					url: '/transmisson/tes/configmgmt/commonlkup/createExcelEqpntwks',
//					data:param,
//					method:'GET',
//					async:false
//					}).done(
//					function(response) {
//						RingInfo.excelDownload(response);
//					}.bind(this)
//				);

	      	 });


	    	$('#ringInfoGrid').on('click', '.bodycell', function(e){
	    		var dataObj = AlopexGrid.parseEvent(e).data;

	    		$('#dataGridLno').alopexGrid('dataEmpty');
				$('#dataGridLno').alopexGrid('showProgress');

	    		Util.jsonAjax({
					url: '/transmisson/tes/configmgmt/commonlkup/ntwksLnoList',
					data:dataObj,
					method:'GET',
					async:false
					}).done(
					function(response) {
			    		$('#dataGridLno').alopexGrid('hideProgress');
			    		$('#dataGridLno').alopexGrid('dataSet', response.ntwksLnoList);
					}.bind(this)
				);

			});

	    	$('#ringInfoGrid').on('dblclick', '.bodycell', function(e){
	    		var dataObj = AlopexGrid.parseEvent(e).data;

	    		var searchId, searchNm;
	    		searchId = dataObj.ntwkLineNo;
	    		searchNm = dataObj.ntwkLineNm;

	    		window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=RING&searchId=' + searchId + '&searchNm=' + searchNm);

			});
		},

		excelDownload: function (response) {
			let $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-tes-biz/transmisson/tes/commonlkup/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.excelFileNm+'" />');
			$form.appendTo('body');
			$form.submit().remove();
		}
}