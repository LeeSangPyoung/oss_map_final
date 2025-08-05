
let gridId = "bckhlPortLisGrid";
let perPage = 100;
let paramData;

let main = $a.page(function() {

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	BckhlPort.initGrid();
    	BckhlPort.setGrid(param);

    	setEventListner();
    }

    function setEventListner() {
		// 더블 클릭시
		$('#'+gridId).on('dblclick', function(e){
			let data = AlopexGrid.parseEvent(e).data;
			$a.close(data);
		});

		// 조회
		$('#btnSearch').on('click', function(e) {
    		let param =  $("#searchForm").getData();
    		param.eqpId = paramData.eqpId;

    		BckhlPort.setGrid(param);
     	});

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if(event.key === "Enter") {
				event.preventDefault();

				let param =  $("#searchForm").getData();
	    		param.eqpId = paramData.eqpId;

	    		BckhlPort.setGrid(param);
			}
		});
    }
});

let BckhlPort = {
		// 링 정보 그리드
		initGrid: function() {
			//그리드 생성
			$('#'+gridId).alopexGrid({
				paging : {
					hidePageList: false  // pager 중앙 삭제
				},
				height: '12row',
	        	cellSelectable : true,
	            fitTableWidth : true,
	            rowSelectOption: {
	    			clickSelect: true,
	    			singleSelect: true,
	    		},
				columnMapping: [
						{ key : 'portIdxNo', 	align:'center', title : '포트Index', width: '40px' },
						{ key : 'portId',    	align:'center', title : '포트ID', width: '70px', hidden:true},
		        		{ key : 'portNm',    	align:'left',   title : '포트명', width: '100px' },
		        		{ key : 'portAlsNm',    align:'left',   title : '포트별칭명'  ,  width: '200px' },
		        		{ key : 'portOpStatNm', align:'center', title : '포트운용상태', width: '50px' },
		        		{ key : 'eqpId', 		align:'left',   title : '장비아이디', width: '200px', hidden: true }
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
				url: '/transmisson/tes/engineeringmap/mwlno/portMgmt',
				data:param,
				method:'GET',
				async:true
				}).done(
				function(response) {
					let serverPageinfo = {};

		    		$('#'+gridId).alopexGrid('hideProgress');

		    		serverPageinfo = {
		    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		    		};
		    		$('#'+gridId).alopexGrid('dataSet', response.portMgmtList, serverPageinfo);
				}.bind(this)
			);
		},

		setEventListner: function() {

		}
}