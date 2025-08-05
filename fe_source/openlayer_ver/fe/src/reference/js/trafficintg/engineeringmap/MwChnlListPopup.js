
let gridId = "mwChnlLisGrid";

let main = $a.page(function() {

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	MwChnl.initGrid();
    	MwChnl.setGrid(param);

    	setEventListner();
    }

    function setEventListner() {
		// 더블 클릭시
//		$('#'+gridId).on('dblclick', function(e){
//			let data = AlopexGrid.parseEvent(e).data;
//			$a.close(data);
//		});

		$('#btnApply').on('click', function(e) {
			var rowData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});

			$a.close(rowData);
		});
    }
});

let MwChnl = {
		// 링 정보 그리드
		initGrid: function() {
			//그리드 생성
			$('#' + gridId).alopexGrid({
				 height: '5row',
	        	 cellSelectable : true,
	             autoColumnIndex : true,
	             fitTableWidth : true,
	             rowClickSelect : true,
	             rowSingleSelect : false,
	             rowInlineEdit : true,
	             pager : false,
	             numberingColumnFromZero : false
	            ,paging: {
	         	   pagerTotal:false
	            },
				columnMapping: [
					{ key : 'check', 		align: 'center', 	width: '40px', selectorColumn: true},
					{ key : 'mwChnlNoVal',  align:'center', 	title : '채널', 		width: '110px' },
	        		{ key : 'chnlCapaVal',  align:'center', 	title : '용량(Mbit/s)', width: '200px' }
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
			});
		},

		// 링 정보 그리드
		setGrid : function(param) {

			$('#' + gridId).alopexGrid('dataEmpty');
			$('#' + gridId).alopexGrid('showProgress');

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/mwlno/getMwChnlList',
				data:param,
				method:'GET',
				async:false
				}).done(
				function(response) {
		    		$('#'+gridId).alopexGrid('hideProgress');
		    		$('#'+gridId).alopexGrid('dataSet', response.chnlList);
				}.bind(this)
			);
		}
}