/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점
	var gridId = 'dataGrid';
	var rlyGrid = 'rlyGrid';
	var defaultSelectCode = {value: "", text: "전체"};
	var patterns = ['_주', '_예'];
	var patternMain = '_주';

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();     //select 정보 세팅
        setEventListener();  //이벤트
        initGrid();
    };

    //Grid 초기화
	function initGrid() {
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
      			{fromIndex:1,   toIndex:12,  title:'기간망 회선 정보'},
      			{fromIndex:13,  toIndex:23,  title:'종단Client_S'},
      			{fromIndex:24,  toIndex:34,  title:'전송Client_S'},
				{fromIndex:35,  toIndex:48,  title:"시스템 IO연동_S"},
				{fromIndex:49,  toIndex:59,  title:"Link 정보_S"},
				{fromIndex:60,  toIndex:70,  title:"ROADM MUX 정보_S"},
				{fromIndex:71,  toIndex:81,  title:'ROADM MUX 정보_E'},
      			{fromIndex:82,  toIndex:92,  title:'Link 정보_E'},
				{fromIndex:93,  toIndex:106, title:"시스템 IO연동_E"},
				{fromIndex:107, toIndex:117, title:"전송Client_E"},
				{fromIndex:118, toIndex:128, title:"종단Client_E"}
			],
			columnMapping: [{
					align:'center',
					title : '순번',
					width: '40',
					numberingColumn: true
				}, {/* 회선 구분		*/
					key : 'lineDivVal', align : 'center',
					title : '회선 구분',
					width : '90'
				}, {/* 회선 순번		*/
					key : 'lineSeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
//				}, {/* 망 구성도		*/
//					key : 'nodeId', align : 'center',
//					title : '',
//					width : '40',
//					render : function(value, data, render, mapping){
//						if(data.lineDivVal != null && data.lineDivVal != '' && data.lineSeq != null && data.lineSeq != ''){
//							return '<div style="width:100%"><span class="popup_button_network" style="cursor: pointer" id="nodeIdBtn"></span></div>';
//						}
//					}
				}, {/* 구간S			*/
					key : 'lineSctnStaVal', align : 'center',
					title : '구간S',
					width : '50'
				}, {/* 구간E			*/
					key : 'lineSctnEndVal', align : 'center',
					title : '구간E',
					width : '50'
				}, {/* 회선명			*/
					key : 'lineNm', align : 'center',
					title : '회선명',
					width : '180'
				}, {/* 서비스 유형		*/
					key : 'lineSrvcTypVal', align : 'center',
					title : '서비스 유형',
					width : '90'
				}, {/* 채널			*/
					key : 'lineChnlVal', align : 'center',
					title : '채널',
					width : '50'
				}, {/* 파장			*/
					key : 'lineWavlVal', align : 'center',
					title : '파장',
					width : '60'
				}, {/* 회선 Type		*/
					key : 'lineTypVal', align : 'center',
					title : '회선 Type',
					width : '70'
				}, {/* 보호모드		*/
					key : 'lineProtModeVal', align : 'center',
					title : '보호모드',
					width : '70'
				}, {/* 회선ID			*/
					key : 'lineId', align : 'center',
					title : '회선ID',
					width : '100'
				}, {/* 기간망 회선번호	*/
					key : 'lineNoVal', align : 'center',
					title : '기간망 회선번호',
					width : '110'
				}, {/* 종단Client_S 시스템		*/
					key : 'termlClientStaSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* 종단Client_S 관리팀		*/
					key : 'termlClientStaMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* 종단Client_S 제조사		*/
					key : 'termlClientStaVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* 종단Client_S 국사		*/
					key : 'termlClientStaMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* 종단Client_S 노드명		*/
					key : 'termlClientStaNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* 종단Client_S 장비ID		*/
					key : 'termlClientStaEqpId', align : 'center',
					title : '장비ID',
					hidden:true,
					width : '100'
				}, {/* 종단Client_S Unit		*/
					key : 'termlClientStaUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* 종단Client_S Shelf		*/
					key : 'termlClientStaShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* 종단Client_S Slot		*/
					key : 'termlClientStaSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* 종단Client_S Port		*/
					key : 'termlClientStaPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* 종단Client_S FDF		*/
					key : 'termlClientStaFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* 전송Client_S 시스템		*/
					key : 'trmsClientStaSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* 전송Client_S 관리팀		*/
					key : 'trmsClientStaMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* 전송Client_S 제조사		*/
					key : 'trmsClientStaVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* 전송Client_S 국사		*/
					key : 'trmsClientStaMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* 전송Client_S 노드명		*/
					key : 'trmsClientStaNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* 전송Client_S 장비ID		*/
					key : 'trmsClientStaEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 전송Client_S Unit		*/
					key : 'trmsClientStaUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* 전송Client_S Shelf		*/
					key : 'trmsClientStaShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* 전송Client_S Slot		*/
					key : 'trmsClientStaSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* 전송Client_S Port		*/
					key : 'trmsClientStaPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* 전송Client_S FDF		*/
					key : 'trmsClientStaFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* 시스템 IO연동_S 1차 노드명	*/
					key : 'systmIoStaFstNodeNm', align : 'center',
					title : '①노드명',
					width : '100'
				}, {/* 시스템 IO연동_S 1차 장비ID	*/
					key : 'systmIoStaFstEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 시스템 IO연동_S 1차 Unit	*/
					key : 'systmIoStaFstUnitNm', align : 'center',
					title : '②Unit',
					width : '60'
				}, {/* 시스템 IO연동_S 1차 Shelf		*/
					key : 'systmIoStaFstShlfVal', align : 'center',
					title : '③Shelf',
					width : '70'
				}, {/* 시스템 IO연동_S 1차 Slot	*/
					key : 'systmIoStaFstSlotVal', align : 'center',
					title : '④Slot',
					width : '60'
				}, {/* 시스템 IO연동_S 1차 Port	*/
					key : 'systmIoStaFstPortVal', align : 'center',
					title : '⑤Port',
					width : '60'
				}, {/* 시스템 IO연동_S 1차 FDF	*/
					key : 'systmIoStaFstFdfLnoVal', align : 'center',
					title : '⑥FDF선번',
					width : '150'
				}, {/* 시스템 IO연동_S 2차 노드명	*/
					key : 'systmIoStaScndNodeNm', align : 'center',
					title : '⑦노드명',
					width : '100'
				}, {/* 시스템 IO연동_S 2차 장비ID	*/
					key : 'systmIoStaScndEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 시스템 IO연동_S 2차 Unit	*/
					key : 'systmIoStaScndUnitNm', align : 'center',
					title : '⑧Unit',
					width : '60'
				}, {/* 시스템 IO연동_S 2차 Shelf		*/
					key : 'systmIoStaScndShlfVal', align : 'center',
					title : '⑨Shelf',
					width : '70'
				}, {/* 시스템 IO연동_S 2차 Slot	*/
					key : 'systmIoStaScndSlotVal', align : 'center',
					title : '⑩Slot',
					width : '60'
				}, {/* 시스템 IO연동_S 2차 Port	*/
					key : 'systmIoStaScndPortVal', align : 'center',
					title : '⑪Port',
					width : '60'
				}, {/* 시스템 IO연동_S 2차 FDF	*/
					key : 'systmIoStaScndFdfLnoVal', align : 'center',
					title : '⑫FDF선번',
					width : '150'
				}, {/* Link 정보_S 시스템		*/
					key : 'linkInfStaSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* Link 정보_S 관리팀		*/
					key : 'linkInfStaMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* Link 정보_S 제조사		*/
					key : 'linkInfStaVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* Link 정보_S 국사		*/
					key : 'linkInfStaMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* Link 정보_S 노드명		*/
					key : 'linkInfStaNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* Link 정보_S 장비ID		*/
					key : 'linkInfStaEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* Link 정보_S Unit		*/
					key : 'linkInfStaUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* Link 정보_S Shelf		*/
					key : 'linkInfStaShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* Link 정보_S Slot		*/
					key : 'linkInfStaSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* Link 정보_S Port		*/
					key : 'linkInfStaPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* Link 정보_S FDF		*/
					key : 'linkInfStaFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* ROADM MUX 정보_S 시스템		*/
					key : 'roadmMuxStaSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* ROADM MUX 정보_S 관리팀		*/
					key : 'roadmMuxStaMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* ROADM MUX 정보_S 제조사		*/
					key : 'roadmMuxStaVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* ROADM MUX 정보_S 국사		*/
					key : 'roadmMuxStaMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* ROADM MUX 정보_S 노드명		*/
					key : 'roadmMuxStaNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* ROADM MUX 정보_S 장비ID		*/
					key : 'roadmMuxStaEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* ROADM MUX 정보_S Unit		*/
					key : 'roadmMuxStaUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* ROADM MUX 정보_S Shelf		*/
					key : 'roadmMuxStaShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* ROADM MUX 정보_S Slot		*/
					key : 'roadmMuxStaSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* ROADM MUX 정보_S Port		*/
					key : 'roadmMuxStaPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* ROADM MUX 정보_S FDF		*/
					key : 'roadmMuxStaFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* ROADM MUX 정보_E 시스템		*/
					key : 'roadmMuxEndSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* ROADM MUX 정보_E 관리팀		*/
					key : 'roadmMuxEndMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* ROADM MUX 정보_E 제조사		*/
					key : 'roadmMuxEndVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* ROADM MUX 정보_E 국사		*/
					key : 'roadmMuxEndMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* ROADM MUX 정보_E 노드명		*/
					key : 'roadmMuxEndNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* ROADM MUX 정보_E 장비ID		*/
					key : 'roadmMuxEndEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* ROADM MUX 정보_E Unit		*/
					key : 'roadmMuxEndUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* ROADM MUX 정보_E Shelf		*/
					key : 'roadmMuxEndShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* ROADM MUX 정보_E Slot		*/
					key : 'roadmMuxEndSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* ROADM MUX 정보_E Port		*/
					key : 'roadmMuxEndPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* ROADM MUX 정보_E FDF		*/
					key : 'roadmMuxEndFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* Link 정보_E 시스템		*/
					key : 'linkInfEndSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* Link 정보_E 관리팀		*/
					key : 'linkInfEndMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* Link 정보_E 제조사		*/
					key : 'linkInfEndVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* Link 정보_E 국사		*/
					key : 'linkInfEndMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* Link 정보_E 노드명		*/
					key : 'linkInfEndNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* Link 정보_E 장비ID		*/
					key : 'linkInfEndEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* Link 정보_E Unit		*/
					key : 'linkInfEndUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* Link 정보_E Shelf		*/
					key : 'linkInfEndShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* Link 정보_E Slot		*/
					key : 'linkInfEndSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* Link 정보_E Port		*/
					key : 'linkInfEndPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* Link 정보_E FDF		*/
					key : 'linkInfEndFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* 시스템 IO연동_E 1차 노드명	*/
					key : 'systmIoEndFstNodeNm', align : 'center',
					title : '①노드명',
					width : '100'
				}, {/* 시스템 IO연동_E 1차 장비ID	*/
					key : 'systmIoEndFstEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 시스템 IO연동_E 1차 Unit	*/
					key : 'systmIoEndFstUnitNm', align : 'center',
					title : '②Unit',
					width : '60'
				}, {/* 시스템 IO연동_E 1차 Shelf		*/
					key : 'systmIoEndFstShlfVal', align : 'center',
					title : '③Shelf',
					width : '70'
				}, {/* 시스템 IO연동_E 1차 Slot	*/
					key : 'systmIoEndFstSlotVal', align : 'center',
					title : '④Slot',
					width : '60'
				}, {/* 시스템 IO연동_E 1차 Port	*/
					key : 'systmIoEndFstPortVal', align : 'center',
					title : '⑤Port',
					width : '60'
				}, {/* 시스템 IO연동_E 1차 FDF	*/
					key : 'systmIoEndFstFdfLnoVal', align : 'center',
					title : '⑥FDF선번',
					width : '150'
				}, {/* 시스템 IO연동_E 2차 노드명	*/
					key : 'systmIoEndScndNodeNm', align : 'center',
					title : '⑦노드명',
					width : '100'
				}, {/* 시스템 IO연동_E 2차 장비ID	*/
					key : 'systmIoEndScndEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 시스템 IO연동_E 2차 Unit	*/
					key : 'systmIoEndScndUnitNm', align : 'center',
					title : '⑧Unit',
					width : '60'
				}, {/* 시스템 IO연동_E 2차 Shelf		*/
					key : 'systmIoEndScndShlfVal', align : 'center',
					title : '⑨Shelf',
					width : '70'
				}, {/* 시스템 IO연동_E 2차 Slot	*/
					key : 'systmIoEndScndSlotVal', align : 'center',
					title : '⑩Slot',
					width : '60'
				}, {/* 시스템 IO연동_E 2차 Port	*/
					key : 'systmIoEndScndPortVal', align : 'center',
					title : '⑪Port',
					width : '60'
				}, {/* 시스템 IO연동_E 2차 FDF	*/
					key : 'systmIoEndScndFdfLnoVal', align : 'center',
					title : '⑫FDF선번',
					width : '150'
				}, {/* 전송Client_E 시스템		*/
					key : 'trmsClientEndSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* 전송Client_E 관리팀		*/
					key : 'trmsClientEndMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* 전송Client_E 제조사		*/
					key : 'trmsClientEndVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* 전송Client_E 국사		*/
					key : 'trmsClientEndMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* 전송Client_E 노드명		*/
					key : 'trmsClientEndNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* 전송Client_E 장비ID		*/
					key : 'trmsClientEndEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 전송Client_E Unit		*/
					key : 'trmsClientEndUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* 전송Client_E Shelf		*/
					key : 'trmsClientEndShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* 전송Client_E Slot		*/
					key : 'trmsClientEndSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* 전송Client_E Port		*/
					key : 'trmsClientEndPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* 전송Client_E FDF		*/
					key : 'trmsClientEndFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}, {/* 종단Client_E 시스템		*/
					key : 'termlClientEndSystmNm', align : 'center',
					title : '①시스템',
					width : '70'
				}, {/* 종단Client_E 관리팀		*/
					key : 'termlClientEndMgmtTeamNm', align : 'center',
					title : '②관리팀',
					width : '70'
				}, {/* 종단Client_E 제조사		*/
					key : 'termlClientEndVendNm', align : 'center',
					title : '③제조사',
					width : '70'
				}, {/* 종단Client_E 국사		*/
					key : 'termlClientEndMtsoNm', align : 'center',
					title : '④국사',
					width : '70'
				}, {/* 종단Client_E 노드명		*/
					key : 'termlClientEndNodeNm', align : 'center',
					title : '⑤노드명',
					width : '100'
				}, {/* 종단Client_E 장비ID		*/
					key : 'termlClientEndEqpId', align : 'center',
					title : '장비ID',
					hidden:true
				}, {/* 종단Client_E Unit		*/
					key : 'termlClientEndUnitNm', align : 'center',
					title : '⑥Unit',
					width : '60'
				}, {/* 종단Client_E Shelf		*/
					key : 'termlClientEndShlfVal', align : 'center',
					title : '⑦Shelf',
					width : '70'
				}, {/* 종단Client_E Slot		*/
					key : 'termlClientEndSlotVal', align : 'center',
					title : '⑧Slot',
					width : '60'
				}, {/* 종단Client_E Port		*/
					key : 'termlClientEndPortVal', align : 'center',
					title : '⑨Port',
					width : '60'
				}, {/* 종단Client_E FDF		*/
					key : 'termlClientEndFdfVal', align : 'center',
					title : '⑩FDF',
					width : '150'
				}
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});

		$('#'+rlyGrid).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height: '11row',
			fitTableWidth : true,
			autoResize: true,
			columnMapping : [
					{/* 회선 구분		*/
					key : 'lineDivVal', align : 'center',
					title : '회선 구분',
					hidden:true,
					width : '70'
				}, {/* 회선 순번		*/
					key : 'lineSeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
				}, {/* 중계 순번		*/
					key : 'rlySeq', align : 'center',
					title : '회선 순번',
					hidden:true,
					width : '30'
				}, {/* 장비명			*/
					key : 'rlyEqpNm', align : 'center',
					title : '장비명',
					width : '110'
				}, {/* 선번장			*/
					key : 'rlyNodeNm', align : 'center',
					title : '선번장',
					width : '110'
				}, {/* TANGO 국사			*/
					key : 'mtsoNm', align : 'center',
					title : 'TANGO 국사',
					width : '150'
				}
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	}

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	// 회선구분
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLineDivValList', null, 'GET', 'lineDivValList');
    	// 구간(S/E)
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLineSctnValList', null, 'GET', 'lineSctnValList');
    	// 서비스 유형
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLineSrvcTypValList', null, 'GET', 'lineSrvcTypValList');
    	// 종단 시스템
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getTermlSystmList', null, 'GET', 'TermlSystmList');
    	// 종단 제조사
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getTermlVendList', null, 'GET', 'TermlVendList');
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {
    	var perPage = 100;

    	// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			main.setGrid(eObj.page, eObj.pageinfo.perPage, "lnstInf");
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage, "lnstInf");
		});

    	// 조회
   	 	$('#btnSearch').on('click', function(e) {
   	 		main.setGrid(1, perPage, "lnstInf");
        });

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				main.setGrid(1, perPage, "lnstInf");
			}
		});

		// 중계 노드 조회
		$('#'+gridId).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
 			var rlyNodeData = {lineDivVal: dataObj.lineDivVal, lineSeq: dataObj.lineSeq};

 			$('#'+rlyGrid).alopexGrid('showProgress');
 			httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getRlyNodeList', rlyNodeData, 'GET', 'searchRlyNode');
		});

		// 선번장 정보 더블 클릭시
		$('#'+gridId).on('dblclick', '.bodycell', function(e){
			var dataObj = dataObj = AlopexGrid.parseEvent(e).data;
			var param = dataObj;
			var foundPattern = null;
			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;

			if(param.lineNm != null && param.lineNm != undefined && param.lineNm != '') {
				foundPattern = patterns.find(pattern => param.lineNm.includes(pattern));
			} else {
				param.lineNm = '';
			}

			if(foundPattern) {
	        	if(param.lineNm.includes(patternMain)) {
	        		param.flag = 'main';
	        	} else {
	        		param.flag = 'spr';
	        	}
	        } else {
	        	param.flag = 'neither';
	        }

			$a.popup({
				popid: tmpPopId,
				url: '/tango-transmission-web/trafficintg/engineeringmap/DsnRontDtlPopup.do',
				title: '기간망 유선설계 상세',
				data: param,
				iframe: false,
				modal: false,
				windowpopup: true,
				width: 1400,
				height: 900,
				center: true
			});
		});

		$("#btnTesExportExcel").on("click", function(e) {
			var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
			}

			var param =  $("#searchForm").getData();
			param = gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 60;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();

			var now = new Date();
			var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
			var excelFileNm = '기간망_선번장_정보_'+dayTime;
			param.fileName = excelFileNm;
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.excelMethod = "getTesRontLnstInfList";
			param.excelFlag = "TesRontLnstInfList";
			//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
			fileOnDemendName = excelFileNm+".xlsx";
			$('#'+gridId).alopexGrid('showProgress');
			$('#'+rlyGrid).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
		});

		// 회선구분 선택시
		$('#lineDivVal').on('change', function(e) {
			var selectParam = $("#lineDivVal").getData();

	    	// 구간(S/E)
	    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLineSctnValList', selectParam, 'GET', 'lineSctnValList');
	    	// 서비스 유형
	    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLineSrvcTypValList', selectParam, 'GET', 'lineSrvcTypValList');
	    	// 종단 시스템
	    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getTermlSystmList', selectParam, 'GET', 'TermlSystmList');
	    	// 종단 제조사
	    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getTermlVendList', selectParam, 'GET', 'TermlVendList');
		});

    	// 망 구성도 클릭시
		$('#'+gridId).on('click', '#nodeIdBtn', function(e){
			alertBox('I', '망 구성도 화면 호출 예정');
		});
	};

	function gridExcelColumn(param, gridId) {
		var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");

		var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupTmpFromIndex;	/*임시 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTmpToIndex;		/*임시 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

		for(var i=gridHeaderGroup.length-1; i>=0; i--) {
			if (i === gridHeaderGroup.length-1) { // 처음 루프만 실행(초기 값 세팅)
				excelHeaderGroupTmpFromIndex = gridHeaderGroup[i].fromIndex-1;
				excelHeaderGroupFromIndex = excelHeaderGroupTmpFromIndex + ";"; // 해더그룹의 Merge할 시작 Column Index 0번 컬럼으로 지정
				excelHeaderGroupTmpToIndex = gridHeaderGroup[i].groupColumnIndexes.length - 1;	// 망 구성도가 그리드에 표출될 경우엔 -2
				excelHeaderGroupToIndex = excelHeaderGroupTmpToIndex + ";";  // 해더그룹의 Merge할 끝 Column Index 10번 컬럼으로 지정
			} else {
				excelHeaderGroupTmpFromIndex = excelHeaderGroupTmpToIndex + 1
				excelHeaderGroupFromIndex = excelHeaderGroupTmpFromIndex + ";" + excelHeaderGroupFromIndex;
				excelHeaderGroupTmpToIndex = excelHeaderGroupTmpToIndex + gridHeaderGroup[i].groupColumnIndexes.length;
				excelHeaderGroupToIndex = excelHeaderGroupTmpToIndex + ";" + excelHeaderGroupToIndex;
			}
			if (gridHeaderGroup[i].title != undefined) {
				excelHeaderGroupTitle = gridHeaderGroup[i].title + ";" + excelHeaderGroupTitle;
				excelHeaderGroupColor += gridHeaderGroup[i].color + ";" + excelHeaderGroupColor;
			}
		};

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id" && gridHeader[i].key != "nodeId")) {
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

		/*======해더그룹정보======*/
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		/*======해더정보======*/
		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

	this.setGrid = function(page, rowPerPage, flag){
		if(flag == "lnstInf") {
			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);
			$('#'+gridId).alopexGrid('dataEmpty');
			$('#'+rlyGrid).alopexGrid('dataEmpty');

			var param =  $("#searchForm").serialize();

			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/dsnRont/getLnstInfList', param, 'GET', 'search');
		}
	}

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){
    	//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
			$('#'+rlyGrid).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.lnstInfList);
    	}

    	if(flag == 'searchRlyNode'){
    		$('#'+rlyGrid).alopexGrid('hideProgress');
    		setSPGrid(rlyGrid, response, response.rlyNodeList);
    	}

    	if(flag == 'lineDivValList'){
    		upperOptionData('lineDivVal', response);
    	}

    	if(flag == 'lineSctnValList'){
    		upperOptionData('lineSctnVal', response);
    	}

    	if(flag == 'lineSrvcTypValList'){
    		upperOptionData('lineSrvcTypVal', response);
    	}

    	if(flag == 'TermlSystmList'){
    		upperOptionData('termlSystm', response);
    	}

    	if(flag == 'TermlVendList'){
    		upperOptionData('termlVend', response);
    	}
    }

    function upperOptionData(selectId, response) {
    	$('#'+ selectId).clear();

    	var option_data = [];
		var findUpperData = new Set();
		option_data.push(defaultSelectCode);

		for(var i=0; i<response.length; i++){
			var resObj = response[i][selectId];
			var upperData = resObj.toUpperCase();

			if(!findUpperData.has(upperData)) {
				findUpperData.add(upperData);
				option_data.push({"value":resObj,"text":upperData});
			}
		}

		$('#'+ selectId).setData({
            data:option_data
		});
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchRlyNode'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    };

    function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                }
            });
	}

    function setSPGrid(GridID,Option,Data) {
    	var serverPageinfo = {};
    	if (GridID == "dataGrid") {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	} else if (GridID == "rlyGrid") {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
//    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
//    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	}

    	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

});