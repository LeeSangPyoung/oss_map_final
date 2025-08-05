/**
 *
 * @author Administrator
 * @date 2023. 10. 21.
 * @version 1.0
 */
let gridId 	= 'mwSctnGrid';	// 구간정보 그리드
let perPage = 100;
let mwDivValOptions = [
	{text: "전체", value: ""},
	{text: "D-MW", value: "D-MW"},
	{text: "E-MW", value: "E-MW"},
	{text: "CPRI-MW", value: "CPRI-MW"}
];
let usgDivValOptions = [
	{text: "전체", value: ""},
	{text:"도서형", value: "도서형"},
	{text:"내륙형", value: "내륙형"}
];
let venderOptions = [
	{text: "전체", value: ""},
	{text:"Ericsson",value: "Ericsson"},
	{text:"Nokia",   value: "Nokia"},
	{text:"Huawei",  value: "Huawei"}
];

let main = $a.page(function() {

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(param.closeYn == "N"){
    		closeYn = param.closeYn;
    	}

    	sessionStorage.setItem('param', JSON.stringify(param));

    	DsnMwListControll.initialize(param);

    	setEventListener();
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {
    	let perPage = 100;

    	// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			let eObj = AlopexGrid.parseEvent(e);
			DsnMwListControll.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			let eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			DsnMwListControll.setGrid(1, eObj.perPage);
		});

		// 더블 클릭시
		$('#'+gridId).on('dblclick', '.bodycell', function(e){
			let dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);
		});

    	// 조회
   	 	$('#btnSearch').on('click', function(e) {
   	 		$('#mwSctnId').val("");
   	 		DsnMwListControll.setGrid(1, perPage);
        });

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				$('#mwSctnId').val("");
				DsnMwListControll.setGrid(1, perPage);
			}
		});

		// 중계 노드 조회
		$('#'+gridId).on('click', '.bodycell', function(e){
		});
	}
});

let DsnMwListControll = {

	initialize: function(param) {
		DsnMwListControll.setSelectCode();     //select 정보 세팅
		DsnMwListControll.initGrid();

		// 구간 정보 조회
//		let sparam = JSON.parse(sessionStorage.getItem('param'));
//    	if(sparam.mwSctnId) {
//    		$('#mwSctnId').val(sparam.mwSctnId);
//    	}

//		DsnMwListControll.getMwSctnList(1, perPage);
	},

	// 구간 정보 조회
	getMwSctnList: function(page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		$('#mwSctnGrid').alopexGrid('dataEmpty');
		$('#mwSctnGrid').alopexGrid('showProgress');

		let param =  $("#searchForm").serialize();

		// 망메뉴 > 구간 정보 조회
		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/netmenu/getMwSctnList',
			data:param,
			method:'GET',
			async:true
			}).done(
			function(response) {

				let serverPageinfo = {};

	    		$('#mwSctnGrid').alopexGrid('hideProgress');
	    		serverPageinfo = {
	    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
	    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
	    		};

	    		$('#mwSctnGrid').alopexGrid('dataSet', response.mwSctnList, serverPageinfo);

			}.bind(this)
		);
	},


    //Grid 초기화
	initGrid : function () {
    	let titleList = [
				"No.",
				"구간ID",
				"구간명",
				"MW 구분",
				"용도 구분",
				"공동망 구분",
				"벤더",
				"사업차수",
				"투자유형",
				"본부",
				"도서지역",
				"상위국",
				"상위국 주소",
				"상위국 장비ID",
				"상위국 장비명",
				"상위국 EMS명",
				"하위국",
				"하위국 주소",
				"하위국 장비ID",
				"하위국 장비명",
				"하위국 EMS명",
				"SW Version",
				"장비모델",
				"구간거리(Km)",
				"운용 채널수",
				"여유 채널수",
				"상위국 철탑 내용",
				"상위국 철탑 유형",
				"상위국 철탑 높이",
				"상위국 철탑 소유주",
				"하위국 철탑 내용",
				"하위국 철탑 유형",
				"하위국 철탑 높이",
				"하위국 철탑 소유주",
				"안테나 제조사",
				"상위국 안테나 크기(ft)",
				"상위국 Main/SD 높이(m)",
				"상위국 안테나 SP/DP",
				"하위국 안테나 크기(ft)",
				"하위국 Main/SD 높이(m)",
				"하위국 안테나 SP/DP",
				"EOS/EOL 공통부",
				"EOS/EOL 채널부"
				];
		let cnt = 0;

		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '10row',
			fitTableWidth : true,
			autoResize: true,
			numberingColumnFromZero: false,
			headerRowHeight : 29,
			headerGroup: [
      			{fromIndex:0,   toIndex:10,  title:'M/W 구간 정보'},
      			{fromIndex:11,  toIndex:20,  title:'E2E 정보'},
      			{fromIndex:21,  toIndex:22,  title:'장비 현황'},
      			{fromIndex:23,  toIndex:25,  title:'무선 현황'},
      			{fromIndex:26,  toIndex:33,  title:'철탑 현황'},
      			{fromIndex:34,  toIndex:40,  title:'안테나 현황'}
			],
			columnMapping: [
			{align:'center',title : titleList[cnt++],width: '40',numberingColumn: true},
			{key : 'mwSctnId', align : 'center',title : titleList[cnt++],width : '100'}, 					//구간ID
			{key : 'mwSctnNm', align : 'center',title : titleList[cnt++],width : '100'},                    //구간명
			{key : 'mwDivVal', align : 'center',title : titleList[cnt++],width : '100'},        			//MW 구분
			{key : 'usgDivVal', align : 'center',title : titleList[cnt++],width : '100'},                   //용도 구분
			{key : 'comNetDivVal', align : 'center',title : titleList[cnt++],width : '100'},                //공동망 구분
			{key : 'vendNm', align : 'center',title : titleList[cnt++],width : '100'},                      //벤더
			{key : 'bizDgrVal', align : 'center',title : titleList[cnt++],width : '100'},                   //사업차수
			{key : 'invtTypVal', align : 'center',title : titleList[cnt++],width : '100'},                  //투자유형
			{key : 'hdofcNm', align : 'center',title : titleList[cnt++],width : '100'},                     //본부
			{key : 'isldAreaNm', align : 'center',title : titleList[cnt++],width : '100'},                  //도서지역
			{key : 'umtsoNm', align : 'center',title : titleList[cnt++],width : '100'},                     //상위국
			{key : 'umtsoAddr', align : 'center',title : titleList[cnt++],width : '100'},                   //상위국 주소
			{key : 'umtsoEqpId', align : 'center',title : titleList[cnt++],hidden:true,width : '100'},      //상위국 장비ID
			{key : 'umtsoEqpNm', align : 'center',title : titleList[cnt++],width : '100'},                  //상위국 장비명
			{key : 'umtsoEqpEms', align : 'center',title : titleList[cnt++],width : '100'},                 //상위국 EMS명
			{key : 'lmtsoNm', align : 'center',title : titleList[cnt++],width : '100'},                     //하위국
			{key : 'lmtsoAddr', align : 'center',title : titleList[cnt++],width : '100'},                   //하위국 주소
			{key : 'lmtsoEqpId', align : 'center',title : titleList[cnt++],hidden:true,width : '100'},      //하위국 장비ID
			{key : 'lmtsoEqpNm', align : 'center',title : titleList[cnt++],width : '100'},                  //하위국 장비명
			{key : 'lmtsoEqpEms', align : 'center',title : titleList[cnt++],width : '100'},                 //하위국 EMS명
			{key : 'swVerVal', align : 'center',title : titleList[cnt++],width : '100'},                    //SW Version
			{key : 'eqpMdlNm', align : 'center',title : titleList[cnt++],width : '100'},                    //장비모델
			{key : 'wlesSctnDistVal', align : 'center',title : titleList[cnt++],width : '100'},             //구간거리(Km)
			{key : 'opChnlVal', align : 'center',title : titleList[cnt++],width : '100'},                   //운용 채널수
			{key : 'moreChnlVal', align : 'center',title : titleList[cnt++],width : '100'},                 //여유 채널수
			{key : 'umtsoPylnNm', align : 'center',title : titleList[cnt++],width : '100'},                 //상위국 철탑 내용
			{key : 'umtsoPylnTypVal', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 철탑 유형
			{key : 'umtsoPylnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},            //상위국 철탑 높이
			{key : 'umtsoPylnOwnrNm', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 철탑 소유주
			{key : 'lmtsoPylnNm', align : 'center',title : titleList[cnt++],width : '100'},                 //하위국 철탑 내용
			{key : 'lmtsoPylnTypVal', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 철탑 유형
			{key : 'lmtsoPylnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},            //하위국 철탑 높이
			{key : 'lmtsoPylnOwnrNm', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 철탑 소유주
			{key : 'atnVendNm', align : 'center',title : titleList[cnt++],width : '100'},                   //안테나 제조사
			{key : 'umtsoAtnSizeVal', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 안테나 크기(ft)
			{key : 'umtsoAtnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},             //상위국 Main/SD 높이(m)
			{key : 'umtsoAtnPolwvDivVal', align : 'center',title : titleList[cnt++],width : '100'},         //상위국 안테나 SP/DP
			{key : 'lmtsoAtnSizeVal', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 안테나 크기(ft)
			{key : 'lmtsoAtnHghtVal', align : 'center',title : titleList[cnt++],width : '100'},             //하위국 Main/SD 높이(m)
			{key : 'lmtsoAtnPolwvDivVal', align : 'center',title : titleList[cnt++],width : '100'},         //하위국 안테나 SP/DP
            {key : 'eqpChkComStdYrVal', align : 'center',title : titleList[cnt++],width : '120'},           //EOS/EOL 공통부
            {key : 'eqpChkChnlStdYrVal', align : 'center',title : titleList[cnt],width : '120'}           	//EOS/EOL 채널부
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	},

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    setSelectCode : function(){
    	$("#searchMwDivVal").clear();
    	$("#searchMwDivVal").setData({data : mwDivValOptions, searchMwDivVal:''});

    	$("#searchUsgDivVal").clear();
    	$("#searchUsgDivVal").setData({data : usgDivValOptions, searchUsgDivVal:''});

    	$("#searchVender").clear();
    	$("#searchVender").setData({data : venderOptions, searchVender:''});
    },

	setGrid : function(page, rowPerPage){
		$('#'+gridId).alopexGrid('dataEmpty');

		DsnMwListControll.getMwSctnList(page, rowPerPage);

	}
}
