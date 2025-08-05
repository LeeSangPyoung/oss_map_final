/**
 * PtsSuppliesCal.js 내 소스
 *
 * @author 이현우
 * @date 2016. 8. 08. 오후 02:21:00
 * @version 1.0
 */
$a.page(function() {
	var currentDate = new Date();
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];

	var gridId = 'dataGrid';

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
          		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
            },
	    	headerGroup: [
                          {fromIndex:14, toIndex:17, title:"100M", id:'u0'}
                         ,{fromIndex:18, toIndex:21, title:"10G", id:'u1'}
                         ,{fromIndex:22, toIndex:25, title:"1GE", id:'u2'}
                         //,{fromIndex:24, toIndex:27, title:"10GE", id:'u3'}
                         ,{fromIndex:26, toIndex:29, title:"E1", id:'u3'}
                         //,{fromIndex:32, toIndex:35, title:"STM-64", id:'u5'}
                         ,{fromIndex:30, toIndex:33, title:"10X1GEPP", id:'u4'}
                         ,{fromIndex:34, toIndex:37, title:"10X1GESY", id:'u5'}
                         ,{fromIndex:38, toIndex:41, title:"1P10GSO", id:'u6'}
                         ,{fromIndex:42, toIndex:45, title:"1X10GEPP", id:'u7'}
                         ,{fromIndex:46, toIndex:49, title:"1X10GESY", id:'u8'}
                         ,{fromIndex:50, toIndex:53, title:"4P2G5SO", id:'u9'}
                         ,{fromIndex:54, toIndex:57, title:"8PSO", id:'u10'}
                         ,{fromIndex:58, toIndex:61, title:"D12S(451)", id:'u11'}
                         ,{fromIndex:62, toIndex:65, title:"N1PEFF8(2235)", id:'u12'}
                         ,{fromIndex:66, toIndex:69, title:"N1PEG8(2111)", id:'u13'}
                         ,{fromIndex:70, toIndex:73, title:"N1PETF8(1587)", id:'u14'}
                         ,{fromIndex:74, toIndex:77, title:"N1SL64(588)", id:'u15'}
                         ,{fromIndex:78, toIndex:81, title:"N1SLQ16(724)", id:'u16'}
                         ,{fromIndex:82, toIndex:85, title:"N2PEX1(2121)", id:'u17'}
                         ,{fromIndex:86, toIndex:89, title:"N2PQ1(868)", id:'u18'}
                         ,{fromIndex:90, toIndex:93, title:"N3SL16(1042)", id:'u19'}
                         ,{fromIndex:94, toIndex:97, title:"N3SLH41(1577)", id:'u20'}
                         ,{fromIndex:98, toIndex:100, title:"N4SL64(2048)", id:'u21'}
                         ,{fromIndex:101, toIndex:105, title:"N4SLQ16(2049)", id:'u22'}
                         ,{fromIndex:106, toIndex:109, title:"PCXL(2053)", id:'u23'}
                         ,{fromIndex:110, toIndex:113, title:"PL1(739)", id:'u24'}
                         ,{fromIndex:114, toIndex:117, title:"PP10GEX2", id:'u25'}
                         ,{fromIndex:118, toIndex:121, title:"PP1GEX20", id:'u26'}
                         ,{fromIndex:122, toIndex:125, title:"Q1PEGS2(1590)", id:'u27'}
                         ,{fromIndex:126, toIndex:129, title:"R1ML1(2125)", id:'u28'}
                         ,{fromIndex:130, toIndex:133, title:"R1PEF4F(2115)", id:'u29'}
                         ,{fromIndex:134, toIndex:137, title:"R1PEFS8(1589)", id:'u30'}
                         ,{fromIndex:138, toIndex:141, title:"R1PEGS1(1591)", id:'u31'}
                         ,{fromIndex:142, toIndex:145, title:"R1SLQ1(704)", id:'u32'}
                         ,{fromIndex:146, toIndex:149, title:"T2SL64(805)", id:'u33'}
                         ,{fromIndex:150, toIndex:153, title:"VLNC33", id:'u34'}
                         ,{fromIndex:154, toIndex:157, title:"VLNC42B", id:'u35'}
                         ,{fromIndex:158, toIndex:161, title:"VLNC55", id:'u36'}
                         ],

	    	columnMapping: [{
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '150px'
			}, {
    			key : 'teamNm', align:'left',
				title : '팀',
				width: '130px'
			}, {
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			}, {
    			key : 'repIntgFcltsCd', align:'left',
				title : '대표통합시설코드',
				width: '130px'
			}, { // (2017-05-29 : HS Kim) 추가 : 건물코드, 건물명
				key : 'bldCd', align:'left',
				title : '건물코드',
				width: '130px'
			}, {
    			key : 'intgFcltsCd', align:'left',
				title : '주소',	// addr
				width: '180px'
			}, {
    			key : 'bldNm', align:'left',
				title : '건물명',
				width: '130px'
			}, {
    			key : 'erpMtsoNm', align:'left',
				title : '국사명',
				width: '180px'
			}, {
    			key : 'mtsoTypNm', align:'left',
				title : '국사유형',
				width: '130px'
			}, {
    			key : 'adstNm', align:'left',
				title : '권역구분',
				width: '110px'
			}, {
    			key : 'vendEnghNm', align:'left',
				title : '제조사',
				width: '130px'
			}, {
    			key : 'eqpMdlNm', align:'left',
				title : '장비모델',
				width: '130px'
			}, {
    			key : 'eqpNm', align:'left',
				title : '장비명',
				width: '180px'
			}, {
    			key : 'mainEqpIpAddr', align:'left',
				title : '장비IP',
				width: '100px'
			}, {
	 			key : 'c100Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
	  			key : 'c100Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
	  			key : 'c100UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
	  			key : 'c100URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
	  			key : 'c10GCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
	  			key : 'c10GPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
	  			key : 'c10GUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
	  			key : 'c10GURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
	  			key : 'c1GCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
	  			key : 'c1GPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
	  			key : 'c1GUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
	  			key : 'c1GURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
	  			key : 'cE1Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
	  			key : 'cE1Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
	  			key : 'cE1UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
	  			key : 'cE1URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c10X1PCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c10X1PPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c10X1PUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c10X1PURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c10X1SCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c10X1SPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c10X1SUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c10X1SURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c1P10GCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c1P10GPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c1P10GUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c1P10GURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c1X10GPCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c1X10GPPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c1X10GPUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c1X10GPURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c1X10GSCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c1X10GSPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c1X10GSUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c1X10GSURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c4P2GCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c4P2GPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c4P2GUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c4P2GURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'c8PSOCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'c8PSOPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'c8PSOUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'c8PSOURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'd12SCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'd12SPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'd12SUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'd12SURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'nPF8Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'nPF8Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'nPF8UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'nPF8URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'nPG8Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'nPG8Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'nPG8UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'nPG8URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'nF8Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'nF8Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'nF8UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'nF8URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n64Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n64Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n64UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n64URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n16Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n16Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n16UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n16URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n21Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n21Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n21UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n21URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n2PQ1Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n2PQ1Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n2PQ1UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n2PQ1URt', align:'right',
				title : '사용률',
				width: '80px'
			}
			, {
    			key : 'n3S16Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n3S16Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n3S16UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n3S16URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n3S41Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n3S41Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n3S41UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n3S41URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n4S64Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n4S64Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n4S64UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n4S64URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'n4S16Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'n4S16Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'n4S16UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'n4S16URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'pCXLCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'pCXLPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'pCXLUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'pCXLURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'pL1Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'pL1Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'pL1UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'pL1URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'p10GCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'p10GPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'p10GUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'p10GURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'p1GCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'p1GPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'p1GUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'p1GURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'cQCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'cQPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'cQUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'cQURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'rM1Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'rM1Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'rM1UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'rM1URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'rF4Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'rF4Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'rF4UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'rF4URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'rF8Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'rF8Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'rF8UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'rF8URt', align:'right',
				title : '사용률',
				width: '80px'
			}
			, {
    			key : 'rG1Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'rG1Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'rG1UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'rG1URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'r1SCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'r1SPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'r1SUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'r1SURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 't64Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 't64Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 't64UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 't64URt', align:'right',
				title : '사용률',
				width: '80px'
			}
			, {
    			key : 'v33Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'v33Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'v33UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'v33URt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'v42BCt', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'v42BPt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'v42BUCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'v42BURt', align:'right',
				title : '사용률',
				width: '80px'
			}, {
    			key : 'v55Ct', align:'right',
				title : '카드수',
				width: '80px'
			}, {
    			key : 'v55Pt', align:'right',
				title : '전체포트수',
				width: '90px'
			}, {
    			key : 'v55UCt', align:'right',
				title : '사용포트수',
				width: '90px'
			}, {
    			key : 'v55URt', align:'right',
				title : '사용률',
				width: '80px'
			}

			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	   	$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.roleDiv = "PTS";

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtsos', key: 'mtsoId', label: 'mtsoNm'}
 	                      ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#mdlNm', url: 'modellist', key: 'comCd', label: 'comCdNm'}
 	                      ];

        for(var i=0; i<selectList.length; i++){
            selectInit[i] = Tango.select.init({
            	 el: selectList[i].el
	      		,model: Tango.ajax.init({
                    url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                    data: param
                    })
	      		,valueField: selectList[i].key
	      		,labelField: selectList[i].label
	      		,selected: 'all'
	      	})

	      	selectInit[i].model.get();
        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

        param.clctDtYear = clctDtYear;
        param.clctDtMon = clctDtMon;
        param.clctDtDay = clctDtDay;

        param.orgId = selectInit[0].getValue();
		param.teamId = selectInit[1].getValue();
		param.trmsMtsoId = selectInit[2].getValue();
		param.vendCd = selectInit[3].getValue();
        param.mdlCd = selectInit[4].getValue();
        param.eqpNm = $("#eqpNm").val();

    	httpRequest('tango-transmission-biz/trafficintg/systemeng/ptsSuppliesCal', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });

        //페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });

        //페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            eobjk = eObj.perPage;
            setGrid(1, eobjk);
        });

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
//		  	var worker = new ExcelWorker({
//		        		excelFileName: 'PTS물자산출',
//		        		defaultPalette : {
//		        			font : '맑은고딕',
//		        			fontSize : 11,
//
//		        		},
//		        		sheetList : [{
//		        			sheetName : 'sheet1',
//		        			$grid : [$('#'+gridId)]
//		        		}]
//		        	});
//
//        	worker.export({
//        		merge: true,
//        		exportHidden:false,
//        		useCSSParser: true
//        	});
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

            param.clctDtYear = clctDtYear;
            param.clctDtMon = clctDtMon;
            param.clctDtDay = clctDtDay;

            param.orgId = selectInit[0].getValue();
    		param.teamId = selectInit[1].getValue();
    		param.trmsMtsoId = selectInit[2].getValue();
    		param.vendCd = selectInit[3].getValue();
            param.mdlCd = selectInit[4].getValue();
            param.eqpNm = $("#eqpNm").val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "PTS물자산출";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ptsSuppliesCal";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/systemeng/excelcreatePtsSuppliesCal', param, successCallbackExcel, failCallback, 'GET');
         });

        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	var m = date.month < 10 ? '0' + date.month : date.month;
            	var d = date.day < 10 ? '0' + date.day : date.day;

                $("#txtCal").val(date.year + '-' + m + '-' + d);
            });
        });

        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
            changeHdofc();
            changeTeam();
        });

        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
            changeTeam();
        })

        //제조사 선택시
        $('#vendNm').on('change', function(e){
        	changeVendorNm();
        });
        //장비 조회시
        $('#eqpNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		return false;
        	}
        });
	};

	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;

    	var param = {};
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID,
    			data: param
    		}),
    		valueField: 'orgId',
    		labelField: 'orgNm',
    		selected: 'all'
    	})

    	selectInit[1].model.get();
	}

	//team change
	function changeTeam(){
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
    	param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[2] = Tango.select.init({
    		el: '#trmsMtsoNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/trmsmtso',
    			data: param
    		}),
    		valueField: 'mtsoId',
    		labelField: 'mtsoNm',
    		selected: 'all'
    	})

    	selectInit[2].model.get({data:param});
	}

	//제조사 변경시
	function changeVendorNm(){
		var vendorNm = $('#vendNm option:selected').text();

		$('#'+gridId).alopexGrid("hideCol", ['c10X1PCt',
		                                     'c10X1PPt',
		                                     'c10X1PUCt',
		                                     'c10X1PURt',
		                                     'c10X1SCt',
		                                     'c10X1SPt',
		                                     'c10X1SUCt',
		                                     'c10X1SURt',
		                                     'c1P10GCt',
		                                     'c1P10GPt',
		                                     'c1P10GUCt',
		                                     'c1P10GURt',
		                                     'c1X10GPCt',
		                                     'c1X10GPPt',
		                                     'c1X10GPUCt',
		                                     'c1X10GPURt',
		                                     'c1X10GSCt',
		                                     'c1X10GSPt',
		                                     'c1X10GSUCt',
		                                     'c1X10GSURt',
		                                     'c4P2GCt',
		                                     'c4P2GPt',
		                                     'c4P2GUCt',
		                                     'c4P2GURt',
		                                     'c8PSOCt',
		                                     'c8PSOPt',
		                                     'c8PSOUCt',
		                                     'c8PSOURt',
		                                     'd12SCt',
		                                     'd12SPt',
		                                     'd12SUCt',
		                                     'd12SURt',
		                                     'nPF8Ct',
		                                     'nPF8Pt',
		                                     'nPF8UCt',
		                                     'nPF8URt',
		                                     'nPG8Ct',
		                                     'nPG8Pt',
		                                     'nPG8UCt',
		                                     'nPG8URt',
		                                     'nF8Ct',
		                                     'nF8Pt',
		                                     'nF8UCt',
		                                     'nF8URt',
		                                     'n64Ct',
		                                     'n64Pt',
		                                     'n64UCt',
		                                     'n64URt',
		                                     'n16Ct',
		                                     'n16Pt',
		                                     'n16UCt',
		                                     'n16URt',
		                                     'n21Ct',
		                                     'n21Pt',
		                                     'n21UCt',
		                                     'n21URt',
		                                     'n2PQ1Ct',
		                                     'n2PQ1Pt',
		                                     'n2PQ1UCt',
		                                     'n2PQ1URt',
		                                     'n3S16Ct',
		                                     'n3S16Pt',
		                                     'n3S16UCt',
		                                     'n3S16URt',
		                                     'n3S41Ct',
		                                     'n3S41Pt',
		                                     'n3S41UCt',
		                                     'n3S41URt',
		                                     'n4S64Ct',
		                                     'n4S64Pt',
		                                     'n4S64UCt',
		                                     'n4S64URt',
		                                     'n4S16Ct',
		                                     'n4S16Pt',
		                                     'n4S16UCt',
		                                     'n4S16URt',
		                                     'pCXLCt',
		                                     'pCXLPt',
		                                     'pCXLUCt',
		                                     'pCXLURt',
		                                     'pL1Ct',
		                                     'pL1Pt',
		                                     'pL1UCt',
		                                     'pL1URt',
		                                     'p1GCt',
		                                     'p1GPt',
		                                     'p1GUCt',
		                                     'p1GURt',
		                                     'p10GCt',
		                                     'p10GPt',
		                                     'p10GUCt',
		                                     'p10GURt',
		                                     'cQCt',
		                                     'cQPt',
		                                     'cQUCt',
		                                     'cQURt',
		                                     'rM1Ct',
		                                     'rM1Pt',
		                                     'rM1UCt',
		                                     'rM1URt',
		                                     'rF4Ct',
		                                     'rF4Pt',
		                                     'rF4UCt',
		                                     'rF4URt',
		                                     'rF8Ct',
		                                     'rF8Pt',
		                                     'rF8UCt',
		                                     'rF8URt',
		                                     'rG1Ct',
		                                     'rG1Pt',
		                                     'rG1UCt',
		                                     'rG1URt',
		                                     'r1SCt',
		                                     'r1SPt',
		                                     'r1SUCt',
		                                     'r1SURt',
		                                     't64Ct',
		                                     't64Pt',
		                                     't64UCt',
		                                     't64URt',
		                                     'v33Ct',
		                                     'v33Pt',
		                                     'v33UCt',
		                                     'v33URt',
		                                     'v42BCt',
		                                     'v42BPt',
		                                     'v42BUCt',
		                                     'v42BURt',
		                                     'v55Ct',
		                                     'v55Pt',
		                                     'v55UCt',
		                                     'v55URt'], 'conceal');
		if (vendorNm == 'Alcatel') {
			$('#'+gridId).alopexGrid("showCol", ['c10X1PCt',
			                                     'c10X1PPt',
			                                     'c10X1PUCt',
			                                     'c10X1PURt',
			                                     'c10X1SCt',
			                                     'c10X1SPt',
			                                     'c10X1SUCt',
			                                     'c10X1SURt',
			                                     'c1P10GCt',
			                                     'c1P10GPt',
			                                     'c1P10GUCt',
			                                     'c1P10GURt',
			                                     'c1X10GPCt',
			                                     'c1X10GPPt',
			                                     'c1X10GPUCt',
			                                     'c1X10GPURt',
			                                     'c1X10GSCt',
			                                     'c1X10GSPt',
			                                     'c1X10GSUCt',
			                                     'c1X10GSURt',
			                                     'c4P2GCt',
			                                     'c4P2GPt',
			                                     'c4P2GUCt',
			                                     'c4P2GURt',
			                                     'c8PSOCt',
			                                     'c8PSOPt',
			                                     'c8PSOUCt',
			                                     'c8PSOURt',
			                                     'p1GCt',
			                                     'p1GPt',
			                                     'p1GUCt',
			                                     'p1GURt',
			                                     'p10GCt',
			                                     'p10GPt',
			                                     'p10GUCt',
			                                     'p10GURt',
			                                     'v33Ct',
			                                     'v33Pt',
			                                     'v33UCt',
			                                     'v33URt',
			                                     'v42BCt',
			                                     'v42BPt',
			                                     'v42BUCt',
			                                     'v42BURt',
			                                     'v55Ct',
			                                     'v55Pt',
			                                     'v55UCt',
			                                     'v55URt']);
		} else if (vendorNm == 'Huawei') {
			$('#'+gridId).alopexGrid("showCol", ['d12SCt',
			                                     'd12SPt',
			                                     'd12SUCt',
			                                     'd12SURt',
			                                     'nPF8Ct',
			                                     'nPF8Pt',
			                                     'nPF8UCt',
			                                     'nPF8URt',
			                                     'nPG8Ct',
			                                     'nPG8Pt',
			                                     'nPG8UCt',
			                                     'nPG8URt',
			                                     'nF8Ct',
			                                     'nF8Pt',
			                                     'nF8UCt',
			                                     'nF8URt',
			                                     'n64Ct',
			                                     'n64Pt',
			                                     'n64UCt',
			                                     'n64URt',
			                                     'n16Ct',
			                                     'n16Pt',
			                                     'n16UCt',
			                                     'n16URt',
			                                     'n21Ct',
			                                     'n21Pt',
			                                     'n21UCt',
			                                     'n21URt',
			                                     'n2PQ1Ct',
			                                     'n2PQ1Pt',
			                                     'n2PQ1UCt',
			                                     'n2PQ1URt',
			                                     'n3S16Ct',
			                                     'n3S16Pt',
			                                     'n3S16UCt',
			                                     'n3S16URt',
			                                     'n3S41Ct',
			                                     'n3S41Pt',
			                                     'n3S41UCt',
			                                     'n3S41URt',
			                                     'n4S64Ct',
			                                     'n4S64Pt',
			                                     'n4S64UCt',
			                                     'n4S64URt',
			                                     'n4S16Ct',
			                                     'n4S16Pt',
			                                     'n4S16UCt',
			                                     'n4S16URt',
			                                     'pCXLCt',
			                                     'pCXLPt',
			                                     'pCXLUCt',
			                                     'pCXLURt',
			                                     'pL1Ct',
			                                     'pL1Pt',
			                                     'pL1UCt',
			                                     'pL1URt',
			                                     'cQCt',
			                                     'cQPt',
			                                     'cQUCt',
			                                     'cQURt',
			                                     'rM1Ct',
			                                     'rM1Pt',
			                                     'rM1UCt',
			                                     'rM1URt',
			                                     'rF4Ct',
			                                     'rF4Pt',
			                                     'rF4UCt',
			                                     'rF4URt',
			                                     'rF8Ct',
			                                     'rF8Pt',
			                                     'rF8UCt',
			                                     'rF8URt',
			                                     'rG1Ct',
			                                     'rG1Pt',
			                                     'rG1UCt',
			                                     'rG1URt',
			                                     'r1SCt',
			                                     'r1SPt',
			                                     'r1SUCt',
			                                     'r1SURt',
			                                     't64Ct',
			                                     't64Pt',
			                                     't64UCt',
			                                     't64URt']);
		} else {
			$('#'+gridId).alopexGrid("showCol", ['c10X1PCt',
			                                     'c10X1PPt',
			                                     'c10X1PUCt',
			                                     'c10X1PURt',
			                                     'c10X1SCt',
			                                     'c10X1SPt',
			                                     'c10X1SUCt',
			                                     'c10X1SURt',
			                                     'c1P10GCt',
			                                     'c1P10GPt',
			                                     'c1P10GUCt',
			                                     'c1P10GURt',
			                                     'c1X10GPCt',
			                                     'c1X10GPPt',
			                                     'c1X10GPUCt',
			                                     'c1X10GPURt',
			                                     'c1X10GSCt',
			                                     'c1X10GSPt',
			                                     'c1X10GSUCt',
			                                     'c1X10GSURt',
			                                     'c4P2GCt',
			                                     'c4P2GPt',
			                                     'c4P2GUCt',
			                                     'c4P2GURt',
			                                     'c8PSOCt',
			                                     'c8PSOPt',
			                                     'c8PSOUCt',
			                                     'c8PSOURt',
			                                     'd12SCt',
			                                     'd12SPt',
			                                     'd12SUCt',
			                                     'd12SURt',
			                                     'nPF8Ct',
			                                     'nPF8Pt',
			                                     'nPF8UCt',
			                                     'nPF8URt',
			                                     'nPG8Ct',
			                                     'nPG8Pt',
			                                     'nPG8UCt',
			                                     'nPG8URt',
			                                     'nF8Ct',
			                                     'nF8Pt',
			                                     'nF8UCt',
			                                     'nF8URt',
			                                     'n64Ct',
			                                     'n64Pt',
			                                     'n64UCt',
			                                     'n64URt',
			                                     'n16Ct',
			                                     'n16Pt',
			                                     'n16UCt',
			                                     'n16URt',
			                                     'n21Ct',
			                                     'n21Pt',
			                                     'n21UCt',
			                                     'n21URt',
			                                     'n2PQ1Ct',
			                                     'n2PQ1Pt',
			                                     'n2PQ1UCt',
			                                     'n2PQ1URt',
			                                     'n3S16Ct',
			                                     'n3S16Pt',
			                                     'n3S16UCt',
			                                     'n3S16URt',
			                                     'n3S41Ct',
			                                     'n3S41Pt',
			                                     'n3S41UCt',
			                                     'n3S41URt',
			                                     'n4S64Ct',
			                                     'n4S64Pt',
			                                     'n4S64UCt',
			                                     'n4S64URt',
			                                     'n4S16Ct',
			                                     'n4S16Pt',
			                                     'n4S16UCt',
			                                     'n4S16URt',
			                                     'pCXLCt',
			                                     'pCXLPt',
			                                     'pCXLUCt',
			                                     'pCXLURt',
			                                     'pL1Ct',
			                                     'pL1Pt',
			                                     'pL1UCt',
			                                     'pL1URt',
			                                     'p1GCt',
			                                     'p1GPt',
			                                     'p1GUCt',
			                                     'p1GURt',
			                                     'p10GCt',
			                                     'p10GPt',
			                                     'p10GUCt',
			                                     'p10GURt',
			                                     'cQCt',
			                                     'cQPt',
			                                     'cQUCt',
			                                     'cQURt',
			                                     'rM1Ct',
			                                     'rM1Pt',
			                                     'rM1UCt',
			                                     'rM1URt',
			                                     'rF4Ct',
			                                     'rF4Pt',
			                                     'rF4UCt',
			                                     'rF4URt',
			                                     'rF8Ct',
			                                     'rF8Pt',
			                                     'rF8UCt',
			                                     'rF8URt',
			                                     'rG1Ct',
			                                     'rG1Pt',
			                                     'rG1UCt',
			                                     'rG1URt',
			                                     'r1SCt',
			                                     'r1SPt',
			                                     'r1SUCt',
			                                     'r1SURt',
			                                     't64Ct',
			                                     't64Pt',
			                                     't64UCt',
			                                     't64URt',
			                                     'v33Ct',
			                                     'v33Pt',
			                                     'v33UCt',
			                                     'v33URt',
			                                     'v42BCt',
			                                     'v42BPt',
			                                     'v42BUCt',
			                                     'v42BURt',
			                                     'v55Ct',
			                                     'v55Pt',
			                                     'v55UCt',
			                                     'v55URt']);
		}

		var param = {};

    	param.vendCd = selectInit[3].getValue();
    	param.roleDiv = "PTS";
    	/*if(param.vendCd == 'all')
    		$('#mdl').setSelected('전체');
    	else {
    		*/
	    	selectInit[4] = Tango.select.init({
	    		el: '#mdlNm',
	    		model: Tango.ajax.init({
	    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/modellist',
	    			data: param
	    		}),
	    		valueField: 'comCd',
	    		labelField: 'comCdNm',
	    		selected: 'all'
	    	})

	    	selectInit[4].model.get({data:param})
    	//}
	}

	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }

    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.ptsSuppliesCal);
	}

	//엑셀 다운로드
	var successCallbackExcel = function(response){
		$('#'+gridId).alopexGrid('hideProgress');

		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}

    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional
    }

    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //Excel
    function gridExcelColumn(param, gridId) {
    	var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		param.headerGrpCnt = 1;
		var headerGrpCd = "";
		var headerGrpNm = "";
		var headerGrpPos = "";
		var varVend =  selectInit[3].getValue();
		var headerGrpPosFromHaw = 110;
		var headerGrpPosFromAlc = 74;

		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
				if(varVend == 'BP0004396'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <= 3  ||
							headerInt >= 11 && headerInt <= 24 ||
							headerInt >= 27 && headerInt <= 33
					){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromHaw+ "," + 4 + ";";
						headerGrpPosFromHaw = (headerGrpPosFromHaw - 4) ;
					}
					if(headerGrpPosFromHaw == 14){
						headerGrpPos += headerGrpPosFromHaw+ "," + 4 + ";";
					}
				}
				else if(varVend == 'BP0004379'){
					var hearSpilt = gridColmnInfo[i].id.split("u");
					var headerInt =  parseInt(hearSpilt[1]);
					if(headerInt >= 0 && headerInt <= 10  ||
							headerInt >= 25 && headerInt <= 26 ||
							headerInt >= 34 && headerInt <= 36
					){
						headerGrpCd += gridColmnInfo[i].id + ";";
						headerGrpNm += gridColmnInfo[i].title + ";";
						headerGrpPos += headerGrpPosFromAlc+ "," + 4 + ";";
						headerGrpPosFromAlc = (headerGrpPosFromAlc - 4) ;
					}
					if(headerGrpPosFromAlc == 14){
						headerGrpPos += headerGrpPosFromAlc+ "," + 4 + ";";
					}
				}else{
					headerGrpCd += gridColmnInfo[i].id + ";";
					headerGrpNm += gridColmnInfo[i].title + ";";
					headerGrpPos += gridColmnInfo[i].fromIndex + "," + (gridColmnInfo[i].toIndex - gridColmnInfo[i].fromIndex + 1) + ";";
				}

			}
		}
		param.headerGrpCd = headerGrpCd;
		param.headerGrpNm = headerGrpNm;
		param.headerGrpPos = headerGrpPos;

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";

		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
			}
		}

		for(var i=0; i<=13; i++) {
			excelHeaderNm += gridHeader[i].title;
			excelHeaderNm += ";";
		}

		var excelHeaderRepeatCnt = 0;
		var excelHeaderRepeatNm = "";
		for(var i=14; i<gridHeader.length; i++) {
			if (i<=17) {
				excelHeaderRepeatNm += gridHeader[i].title + ";";
			}
			if (i%4 == 0) {
				excelHeaderRepeatCnt++;
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderRepeatCnt = excelHeaderRepeatCnt;
		param.excelHeaderRepeatNm = excelHeaderRepeatNm;

		return param;
	}
});