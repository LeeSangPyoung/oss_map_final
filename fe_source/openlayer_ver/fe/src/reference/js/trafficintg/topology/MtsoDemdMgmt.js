/**
 * MtsoDemdMgmt.js
 *
 * @author P094831
 * @date 2016. 10. 19. 오후 01:44:00
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'dataGrid';

    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
    };
 
    function initGrid() {
        //그리드 생성
	    $('#'+gridId).alopexGrid({
	    	columnMapping: [{
    			key : 'repIntgFcltsCd', align:'center',
				title : '공용대표시설코드',
				width: '90px'
			}, {
    			key : 'intgFcltsCd', align:'center',
				title : '대표시설코드',
				width: '150px'
			}, {
    			key : 'mtsoId', align:'center',
				title : '국사명',
				width: '130px'
			}, {
    			key : 'mtsoTyp', align:'center',
				title : '국사유형',
				width: '90px'
			}, {
    			key : 'addr', align:'center',
				title : '주소',
				width: '90px'
			}, {
    			key : 'newAddr', align:'center',
				title : '신주소',
				width: '110px'
			}, {
    			key : 'area', align:'center',
				title : '반경(m)',
				width: '90px'
			}, {
    			key : 'map', align:'center',
				title : '지도',
				width: '90px'
			}]
	    });
    }
    
    function setEventListener() {
	};
});