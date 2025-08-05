/**
 * 그리드 세팅을 위한 데이터 변환
 */
var tangoList = 'tangoList';
var convList  = 'convList';
var rtPortName = "";
var pi = ""; //포트명 
var ci = ""; //채널 앞2자리

var rs = null;
var rs_ = null;
var crs = null;
var rtrs = null;
var engrs = null;
var rpnrs = null;
var rs5 = null;
var rs2c0 = null;
var rs3c0 = null;
var rs2c = null;
var idle = null;
var mtsoId = null;
//APort,Bport,비고의 타입을 구하여 그리드 세팅 ( STEP1) 
var getCombiPortType = function(tmpMtsoId){
	mtsoId = tmpMtsoId;
	var jtape = ""; //작업유형
	var lname = ""; //회선명
	var sys1 = "";  //장비명
	var port1 = ""; //APORT
	var port2 = ""; //BPORT
	var port3 = ""; //비고(RT포트)
	var ctp1 = "";  //CTP#1 
	
	
	var port11 ="";  var pt1 = ""; var pt2 = ""; var aon_name = ""; var prote = "";  var port1_1 = ""; var ctps11 = ""; var ctp11 = ""; var pt3 = "";
	var rt_n = ""; var rt_en = ""; var v_n = ""; var v_p = ""; var p_p = ""; var pt12 = ""; var rt2 = ""; var rel5_p= "";
	
//	console.log(rtPortName);
	
	
	var dataList = $('#'+tangoList).alopexGrid('dataGet');
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	//tangoList
	for(var idx = 0 ; idx < data.length ; idx++ ) {
		if(nullToEmpty(data[idx].selectData) == "" ) {
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].jobDivNm), {_index : { row : data[idx]._index.row}}, "jobDivNm");
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].useLineNm), {_index : { row : data[idx]._index.row}}, "useLineNm");
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].eqpNm), {_index : { row : data[idx]._index.row}}, "eqpNm");
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].aportNm), {_index : { row : data[idx]._index.row}}, "aportNm");
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].bportNm), {_index : { row : data[idx]._index.row}}, "bportNm");
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].rmkRt), {_index : { row : data[idx]._index.row}}, "rmkRt");
			$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(data[idx].pCtp1), {_index : { row : data[idx]._index.row}}, "pCtp1");
		}
		
		
		jtape = nullToEmpty(data[idx].jobDivNm);    //작업유형
		lname = nullToEmpty(data[idx].useLineNm);    //회선명
		sys1 = nullToEmpty(data[idx].eqpNm);     //장비명
		port1 = nullToEmpty(data[idx].aportNm);    //APORT
		port2 = nullToEmpty(data[idx].bportNm);    //BPORT
		port3 = nullToEmpty(data[idx].rmkRt);    //비고
		ctp1 = nullToEmpty(data[idx].pCtp1);     //CTP1 
		
		
		/*
		########################중요 사항################################
			그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
			따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
		########################중요 사항################################
		 */
		if(nullToEmpty(sys1)!="") {
			sys1 = replaceToEmpty(sys1);
		}
		if(nullToEmpty(port3)!="") {
			port3 = replaceToEmpty(port3);
		}
		if(nullToEmpty(ctp1)!="") {
			ctp1 = replaceToEmpty(ctp1);
		}
		
		
		
		if(data[idx]._state.selected == true ) {
			if(nullToEmpty(jtape) != "") {
				if(nullToEmpty(port1) == "") {
					cflineHideProgressBody();
					alertBox('I', "APORT는 필수입력입니다."); 
					return false;
				}
			}
			
			//A포트 타입 조회
			if(nullToEmpty(port1).length == 16) {
				
				port11 = port1.substring(0,10);
				var portParam = {
						"eqpNm" : sys1
						,"portNm" : port11
						,"mtsoId" : mtsoId
						,"chnlVal" : "N"
				}
				
				port1_1 = port1.substring(0,13);
				var commaC = port1_1.indexOf(",");
				
				pi = port1_1.substring(0,commaC);
				ci = port1_1.substring(commaC,port1_1.length);
				var portChnlParam = {
					   "eqpNm" : sys1
					   ,"portNm" : pi
					   ,"chnlNm" : ci
					   ,"mtsoId" : mtsoId
					   ,"chnlVal" : "Y"
				}
				
				
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getPortType', portParam, 'GET', 'getPortType');
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getPortType', portChnlParam, 'GET', 'getPortChnlType');
				
				if(rs_ != null && rs_.length > 0) {
					pt1 	 = 	nullToEmpty(rs_[0].dcsConnTypNm);
					aon_name =  nullToEmpty(rs_[0].userLablNm);
					prote    =  nullToEmpty(rs_[0].protLablNm);
					
				} else if(rs != null && rs.length > 0) {
					pt1 	 = 	nullToEmpty(rs[0].dcsConnTypNm);
					aon_name =  nullToEmpty(rs[0].userLablNm);
					prote    =  nullToEmpty(rs[0].protLablNm);
				} else {
					pt1      =  "TU12";
				}
				
			} else if(nullToEmpty(port1).length == 10) {
				pt1 = "VC12";
			}
			
			
			
			//B포트 타입 조회
			if(nullToEmpty(port2).length == 16) {
				
				port11 = port2.substring(0,10);
				var param = {
						"eqpNm" : sys1
						,"portNm" : port11
						,"mtsoId" : mtsoId
						,"chnlVal" : "N"
				}
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getPortType', param, 'GET', 'getPortType');
				
				if(rs != null && rs.length > 0) {
					pt2 	 = 	nullToEmpty(rs[0].dcsConnTypNm);
					rt2 	 =  nullToEmpty(rs[0].userLablNm);
					rel5_p    =  nullToEmpty(rs[0].protLablNm);
				} else {
					pt2      =  "TU12";
				}
				
			} else if(nullToEmpty(port2).length == 10) {
				pt2 = "VC12";
			}
			
			$('#'+tangoList).alopexGrid( "cellEdit", pt1+"-"+pt2, {_index : { row : data[idx]._index.row}}, "pType");
			$('#'+tangoList).alopexGrid( "cellEdit", aon_name,{_index : { row : data[idx]._index.row}}, "aonName");
			$('#'+tangoList).alopexGrid( "cellEdit", rt2,{_index : { row : data[idx]._index.row}}, "rtName");
			$('#'+tangoList).alopexGrid( "cellEdit", prote, {_index : { row : data[idx]._index.row}}, "pMs0");
			
			$('#'+tangoList).alopexGrid( "cellEdit", rel5_p, {_index : { row : data[idx]._index.row}}, "pCtp4");
			
			
//			console.log(pt1+"-"+pt2);
			pt1="";
			pt2="";
			rt2 ="";
			aon_name="";
			prote="";
			rel5_p ="";
			
			
			//CTP1타입 조회
			if(nullToEmpty(ctp1).length == 23) {
				ctps11 = ctp1.substr(0,6);
				ctp11 = ctp1.substr(7,10);
				
				var param = {
						"eqpNm" : ctps11
						,"portNm" : ctp11
						,"mtsoId" : mtsoId
						,"chnlVal" : "N"
				}
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getPortType', param, 'GET', 'getCtpPortType');
				
				if(crs != null &&  crs.length > 0) {
					pt3  = "-"+nullToEmpty(crs[0].dcsConnTypNm);
				} else {
					pt3 = "-TU12";
				}
				
				pt12 = $('#'+tangoList).alopexGrid('dataGet', {_index : { row : data[idx]._index.row}})[0].pType  ;
				$('#'+tangoList).alopexGrid( "cellEdit", pt12+pt3, {_index : { row : data[idx]._index.row}}, "pType");
				pt3 = "";
			} else if(nullToEmpty(ctp1).length == 17) {
				pt3 = "-VC12";
				
				pt12 = $('#'+tangoList).alopexGrid('dataGet', {_index : { row : data[idx]._index.row}})[0].pType ;
				$('#'+tangoList).alopexGrid( "cellEdit", pt12+pt3, {_index : { row : data[idx]._index.row}}, "pType");
				pt3 = "";
			}
			
			
			
			//RT_port 타입 조회 (MS_spring) 
			if(nullToEmpty(port3).length > 0 ) {
				
				rt_n = port3.substr(6, port3.length-17); //RT명
				
				var params = {
						"value" : rt_n
				}
				
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', params, 'GET', 'getRtData');
				
				if(rtrs != null  && rtrs.length == 1) {
					if(rtrs[0].virtNm != null && rtrs[0].virtNm != "") {
						rt_en = rtrs[0].rtE ;
						v_n = rtrs[0].virtNm;
						v_p = rtrs[0].virtP;
						p_p = rtrs[0].prote;
					}
				} else if(rtrs.length > 1) {
					cflineHideProgressBody();
					alertBox('I', "중복되는 RT_K명이 있습니다."); 
					$('#'+convList).alopexGrid("dataDelete");
					return;
				} else {
					rt_en = "";
					v_n = "";
					v_p = "";
				}
				
				$('#'+tangoList).alopexGrid( "cellEdit", v_n, {_index : { row : data[idx]._index.row}}, "pMsvn1");
				$('#'+tangoList).alopexGrid( "cellEdit", p_p, {_index : { row : data[idx]._index.row}}, "pMsvn2");
				$('#'+tangoList).alopexGrid( "cellEdit", v_p, {_index : { row : data[idx]._index.row}}, "msvp");
				$('#'+tangoList).alopexGrid( "cellEdit", rt_en, {_index : { row : data[idx]._index.row}}, "msvsr");
			}
			
			
			
		}
	}
	
	
	
	//step2
	setConvGridByType();
}




// 장비와 포트로 구해진 TYPE으로 분기처리 (step2)
function setConvGridByType() {
	var jtape = ""; //작업유형
	var lname = ""; //회선명
	var sys1 = "";  //장비명
	var port1 = ""; //APORT
	var port2 = ""; //BPORT
	var port3 = ""; //비고(AON/RT DROP) 
	var cont = "";  //TYPE
	var aonname = ""; // AON_NAME
	var rtname = "";  // RT_NAME
	var port4 = "";   // CTP1
	var prote = "";   //M&S#0
	
	var vir_n = "";  // MS_SPRING_VIRT_NAME1
	var p_p = "";    // MS_SPRING_VIRT_NAME2
	var vir_p = "";  // MS_SPRING_VIRT_PORT
	var ms_sncp = "";// MS_SPRING_SNCP_RT PORT
	
	var rngxlen = ""; var fs = ""; var port11 = ""; var pt1 = ""; var pt2 = ""; var cont2 = ""; var s1 = ""; var ss1 = ""; var us1 = ""; 
	var cname1 = ""; var lsys = ""; var strNeweng = ""; var cname = "";  
	var rt_p = ""; var rt_r = ""; var rt_n = ""; var rt_ne = ""; var jtype = ""; var mns = ""; var l1 = ""; 
	var dt = ""; var kname = ""; var rt_vn = ""; var rt_vp = "";  var strKor = ""; var strEng = ""; 
	var rtname2 = ""; var prote2 = ""; var vir_n2 = ""; var p_p2 = ""; var ms_sncp2 = ""; var us2 = ""; var rel5_p1 = ""; var rel5 = "";
	var jtape2 = ""; var lname2 = ""; var sys12 = ""; var port12 = ""; var port22 = ""; var port32 = ""; var aonname2 = "";
	var prote3 = ""; var lname1 = ""; var cont3 = ""; var us = ""; var us3 = ""; var rel5_p = ""; var jtape3 = ""; var lname3 = ""; 
	var sys13 = ""; var port13 = ""; var port23 = ""; var port33 = ""; var aonname3 = ""; 
	
	var dataList = $('#'+tangoList).alopexGrid('dataGet');
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yy = today.getFullYear();
	
	if( (""+mm).length == 1 ) {
		mm ="0"+mm ;
	}
	if( (""+dd).length == 1 ) {
		dd ="0"+dd ; 
	}
	yy = ""+yy;
	var cdb = "("+yy.substring(2,4)+mm+dd+")";  // 오늘 날짜 ( 181112) 
	
	fs = "";
	

	var tempDataList = $('#'+tangoList).alopexGrid('dataGet');
	tempDataList = AlopexGrid.currentData(tempDataList);
	//var tmpData2 = tempDataList;
	var tmpData = [];
	
	for(var idx = 0; idx < tempDataList.length ; idx++) {
		var optTmpData = {
			"jobDivNm": replaceToEmpty(tempDataList[idx].jobDivNm).trim()
			,"useLineNm": replaceToEmpty(tempDataList[idx].useLineNm).trim()
			,"eqpNm": replaceToEmpty(tempDataList[idx].eqpNm).trim()
			,"aportNm": replaceToEmpty(tempDataList[idx].aportNm).trim()
			,"bportNm": replaceToEmpty(tempDataList[idx].bportNm).trim()
			,"rmkRt": replaceToEmpty(tempDataList[idx].rmkRt).trim()
			,"pType": replaceToEmpty(tempDataList[idx].pType).trim()
			,"aonName": replaceToEmpty(tempDataList[idx].aonName).trim()
			,"pCtp4": replaceToEmpty(tempDataList[idx].pCtp4).trim()
			,"pMs0": replaceToEmpty(tempDataList[idx].pMs0).trim()
		};
		
		tmpData.push(optTmpData);
	}
	
	
	for(var aidx = 0 ; aidx < data.length ; aidx++ ) {
		fs = "nok";
		jtape = nullToEmpty(data[aidx].jobDivNm);    // 작업유형
		lname = nullToEmpty(data[aidx].useLineNm);    // 회선명
		sys1 = nullToEmpty(data[aidx].eqpNm);     // 장비명
		port1 = nullToEmpty(data[aidx].aportNm);    // APORT
		port2 = nullToEmpty(data[aidx].bportNm);    // BPORT
		port3 = nullToEmpty(data[aidx].rmkRt);    // 비고 
		cont = nullToEmpty(data[aidx].pType);     // TYPE (hidden)
		aonname = nullToEmpty(data[aidx].aonName);  // AON_NAME (hidden)
		rtname = nullToEmpty(data[aidx].rtName);	 // RT_NAME   (hidden)
		port4 = nullToEmpty(data[aidx].pCtp1);    // CTP1
		
		rel5_p1 = nullToEmpty(data[aidx].pCtp4); //CTP4
		prote = nullToEmpty(data[aidx].pMs0);   // M&S#0
		
		vir_n = nullToEmpty(data[aidx].pMsvn1);   //MS_SPRING_VIRT_NAME1
		p_p = nullToEmpty(data[aidx].pMsvn2);     //MS_SPRING_VIRT_NAME2
		vir_p = nullToEmpty(data[aidx].msvp);   //MS_SPRING_VIRT_PORT
		ms_sncp = nullToEmpty(data[aidx].msvsr); //MS_SPRING_SNCP_RT PORT
		
		/*
		########################중요 사항################################
			그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
			따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
		########################중요 사항################################
		 */
		if(nullToEmpty(sys1)!="") {
			sys1 = replaceToEmpty(sys1);
		}
		if(nullToEmpty(port3)!="") {
			port3 = replaceToEmpty(port3);
		}
		if(nullToEmpty(port4)!="") {
			port4 = replaceToEmpty(port4);
		}		
		
		
		
		lname1 = lname+cdb;
		
		
		
		if(data[aidx]._state.selected == true && (jtape == "신설" || jtape == "신규" || jtape == "증설" || jtape == "변경후" )  ) {
		
			if(sys1.substring(0,4) == "UDCS" ) {
				us = "U";
			} else if(sys1.substring(0,4) == "LDCS" ) {
				us = "L";
			} else if(sys1.indexOf('COT') >= 0 ){   // 장비명에 COT가 있는 경우   2018 - 12- 20
				us = sys1.substring(0,sys1.indexOf('COT'))+"COT";
			} 
			
			
			/**
			 * TU12-VC12(1)
			 */
			//TU12-VC12 타입 (1)
			if( cont == "TU12-VC12") {
				/*행 삽입*/
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				}
				
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
		   	 	
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 		$('#'+convList).alopexGrid( "cellEdit", "1", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 		$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 	} else {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 		$('#'+convList).alopexGrid( "cellEdit", "1", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 		$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 		
		   	 	}
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
	 			$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1) , {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
	 			fs = "ok";
			
	 		/**
	 		 * VC12-VC12(18)
	 		 */	
	 		// VC12-VC12 타입 (1)
			} else if( cont == "VC12-VC12") {
				/*행 삽입*/
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
			   	 	
				}
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
		   	 	
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 		$('#'+convList).alopexGrid( "cellEdit", "19", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 		$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 	} else {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 		$('#'+convList).alopexGrid( "cellEdit", "19", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 		$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 		
		   	 	}
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
		   	 	fs = "ok";
		   	 	
		   	 	
		   	/**
		   	 * TU12-TU12(2)
		   	 */
		   	//TU12-TU12 타입(2)
			} else if(cont == "TU12-TU12") {
				//sendSearch1(data[idx],idx,lname1);
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					cont2 = nullToEmpty(tmpData[idx].pType);
					

				/*	
					console.log("*********************");
					console.log(jtape);
					console.log(jtape2);
					console.log(lname);
					console.log(lname2);
					console.log(port1);
					console.log(port22);
					console.log(port2);
					console.log(port12);
					console.log(cont);
					console.log(cont2);
					console.log("*********************");*/
					if(jtape == jtape2 && lname == lname2 && port1 == port22 && port2 == port12 && cont == cont2 && aidx < idx) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "2", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	fs= "ok";
					}
						
				}
				
				
				
				
				
				
			/**
			 * TU12-con_DCS-TU12(3) , TU12-con_DCS-VC12(4)
			 */
			//TU12-con 타입 (3,4)
			//sendSearch2()
			} else if(cont == "TU12-con") {
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					cont2 = nullToEmpty(tmpData[idx].pType);
					
					if(sys12.substr(0,4) == "UDCS" ) {
						us1 = "U";
					} else if(sys12.substr(0,4) == "LDCS" ) {
						us1 = "L";
					}
					
					if(jtape == jtape2 && lname == lname2 && cont2 == "TU12-con" && aidx < idx) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "3", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	fs= "ok";
				   	 	
					} else if(jtape == jtape2 && lname == lname2 && cont2 == "VC12-con" ) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "4", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	fs= "ok";
					}
						
				}
				
			
			/**
			 * AON-TU12(5)
			 */	
				
			//AON-TU12 타입 (5) 
			} else if(cont == "AON-TU12") {
				/*행 삽입*/
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
			   	 	
				}
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 		
		   	 	} else {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 		
		   	 	}
		   	 	$('#'+convList).alopexGrid( "cellEdit", "5", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
		   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
		   	 	fs = "ok";
		   	 	
		   	/**
		   	 * AON-VC12(6)
		   	 */ 	
		   	
		   	 	
		   	//AON-VC12 타입 (6)  	
			} else if(cont == "AON-VC12") {
				/*행 삽입*/
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
			   	 	
				}
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 	} else {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 	}
		   	 	$('#'+convList).alopexGrid( "cellEdit", "6", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
		   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
		   	 	fs = "ok";
		   	 	
		   	 	
		   	 	
		   	/**
		   	 * AON-con-TU12(7) , AON-con-VC12(8) , AON-LDCS-AON 타입(10)
		   	 */ 	
		   	 	
		   	//AON-con-VC12 , AON-LDCS-AON 타입(7,8,10) 	
			} else if(cont == "AON-con") {
				//sendSearch3();
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					port32 = nullToEmpty(tmpData[idx].rmkRt);
					cont2 = nullToEmpty(tmpData[idx].pType);
					aonname2 = nullToEmpty(tmpData[idx].aonName);
					
					
					if(sys12.substr(0,4) == "UDCS" ) {
						us1 = "U";
					} else if(sys12.substr(0,4) == "LDCS" ) {
						us1 = "L";
					}
					
					
					if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "TU12-con" ) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "7", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
				   	 	fs= "ok";
				   	 	
				   	 	
					} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "VC12-con" ) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "8", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
				   	 	fs= "ok";
				   	 	
				   	 	
					} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "AON-con" && aidx < idx ) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "10", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
				   	 	
				   	 	fs= "ok";
						
					}
						
				}
				
				
			/**
			 * AON-LDCS-AON 타입 (9)
			 */	
				
			//AON-LDCS-AON 타입 (9)	
			} else if(cont == "AON-AON") {
				//sendSearch4();
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					port32 = nullToEmpty(tmpData[idx].rmkRt);
					cont2 = nullToEmpty(tmpData[idx].pType);
					aonname2 = nullToEmpty(tmpData[idx].aonName);
					
					
					if(sys12.substr(0,4) == "UDCS" ) {
						us1 = "U";
					} else if(sys12.substr(0,4) == "LDCS" ) {
						us1 = "L";
					}
					
					
					if(jtape == jtape2 && lname == lname2 && port1 == port22 && port2 == port12 && aidx < idx ) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "9", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
				   	 	fs= "ok";
				   	 	
				   	 	
					} 
				}
				
				
				
			/**
			 * SNCP-TU12 타입(11)
			 */	
				
			//SNCP-TU12 타입(11)	
			} else if(cont == "SNCP-TU12") {
				//sendSearch5();
				
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					port32 = nullToEmpty(tmpData[idx].rmkRt);
					cont2 = nullToEmpty(tmpData[idx].pType);
					aonname2 = nullToEmpty(tmpData[idx].aonName);
					
					
					
					if(jtape == jtape2 && lname == lname2 && cont2 == "TU12-SNCP" ) {
						/*행 삽입*/
						//if(nullToEmpty(rtPortName)!="") {
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						//}
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후" ) {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	
				   	 	//Main&Spare 설정
				   	 	l1 =  aonname.indexOf("_");
				   	 	if(aonname.substring(l1+1) == "useMain"  ) {
				   	 		mns = "M";
				   	 	} else if(aonname.substring(l1+1) == "useMainSpare"  ) {
				   	 		mns = "MS";
				   	 	} else if(aonname.substring(l1+1) == "useSpare"  ) {
				   	 		mns = "S";
				   	 	}
				   	 	
				   	 	
				   	 	rt_r = left(port3,6); //SNCP링명
				   	 	rt_p = right(port3,10) //RT PORT 
				   	 	
				   	 	if(port3.indexOf(" ") != -1) {
				   	 		rt_n = port3.substr( 6 , port3.length-17 );
				   	 	} else {
				   	 		rt_n = port3.substr( 6 , port3.length-6  );
				   	 	}
				   	 	
				   	 	var param = {
								"value" : rt_n
						}
						httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
				   	 	
				   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
				   	 		/**
				   	 		 * rt port name
				   	 		 */
				   	 		openRtPortNamePop();
				   	 		return false;
				   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
				   	 		rt_ne = rtPortName;
				   	 	} else if(rtrs.length > 0 ){
				   	 		rt_ne = rtrs[0].rtE;
				   	 		rt_vn = rtrs[0].virtNm
				   	 		rt_vp = rtrs[0].virtP
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	if(nullToEmpty(rt_vp) != "") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 		$('#'+convList).alopexGrid( "cellEdit", rt_vp+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	} else {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "11", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 		$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	}
				   	 	
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "MS", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms0");
				   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vn, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
				   	 	
				   	 	
				   	 	/**
				   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
				   	 	 */
				   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
				   	 	
				   	 	
				   	 	
				   	 	
				   	 	
			   	 	/**
			   	 	 * U_MS-SNCP 
			   	 	 */
					} else if(jtape == jtape2 && lname == lname2 && cont2 == "U_MS-SNCP" ) {
						/*행 삽입*/
						//if(nullToEmpty(rtPortName)!="") {
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						//}
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후" ) {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else  {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	
				   	 	//Main&Spare 설정
				   	 	l1 =  aonname.indexOf("_");
				   	 	if(aonname.substring(l1+1) == "useMain"  ) {
				   	 		mns = "M";
				   	 	} else if(aonname.substring(l1+1) == "useMainSpare"  ) {
				   	 		mns = "MS";
				   	 	} else if(aonname.substring(l1+1) == "useSpare"  ) {
				   	 		mns = "S";
				   	 	}
				   	 	
				   	 	
				   	 	rt_r = left(port3,6); //SNCP링명
				   	 	rt_p = right(port3,10) //RT PORT 
				   	 	
				   	 	if(port3.indexOf(" ") != -1) {
				   	 		rt_n = port3.substr( 6 , port3.length-17 );
				   	 	} else {
				   	 		rt_n = port3.substr( 6 , port3.length-6  );
				   	 	}
				   	 	
				   	 	var param = {
								"value" : rt_n
						}
						httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
				   	 	
				   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
				   	 		/**
				   	 		 * rt port name
				   	 		 */
				   	 		openRtPortNamePop();
				   	 		return false;
				   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
				   	 		rt_ne = rtPortName;
				   	 	} else if(rtrs.length > 0 ){
				   	 		rt_ne = rtrs[0].rtE;
				   	 		rt_vn = rtrs[0].virtNm
				   	 		rt_vp = rtrs[0].virtP
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	if(nullToEmpty(rt_vp) != "") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "17", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 		$('#'+convList).alopexGrid( "cellEdit", rt_vp+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	} else {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "11", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 		$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "MS", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms0");
				   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vn, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
				   	 	
				   	 	
				   	 	
				   	 	
				   	 	
				   	 	/**
				   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
				   	 	 */
				   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
				   	 	
				   	 	
					}
				}
				
				
			/**
			 * SNCP-VC12 타입 (12) , Vir-Drop(15)-서부사례
			 */	
				
			//SNCP-VC12타입 (12)	
			} else if(cont == "SNCP-VC12") {
				/*행 삽입*/
				//if(nullToEmpty(rtPortName)!="") {
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
			   	 	
				}
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				//}
				
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후" ) {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 	} else  {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 	}
		   	 	
		   	 	
		   	 	//Main&Spare 설정
		   	 	l1 =  aonname.indexOf("_");
		   	 	if(aonname.substring(l1+1) == "useMain"  ) {
		   	 		mns = "M";
		   	 	} else if(aonname.substring(l1+1) == "useMainSpare"  ) {
		   	 		mns = "MS";
		   	 	} else if(aonname.substring(l1+1) == "useSpare"  ) {
		   	 		mns = "S";
		   	 	}
		   	 	
		   	 	
		   	 	rt_r = left(port3,6); //SNCP링명
		   	 	rt_p = right(port3,10) //RT PORT 
		   	 	
		   	 	if(port3.indexOf(" ") != -1) {
		   	 		rt_n = port3.substr( 6 , port3.length-17 );
		   	 	} else {
		   	 		rt_n = port3.substr( 6 , port3.length-6  );
		   	 	}
		   	 	
		   	 	var param = {
						"value" : rt_n
				}
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
		   	 	
		   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
		   	 		/**
		   	 		 * rt port name
		   	 		 */
		   	 		openRtPortNamePop();
		   	 		return false;
		   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
		   	 		rt_ne = rtPortName;
		   	 	} else if(rtrs.length > 0 ){
		   	 		rt_ne = rtrs[0].rtE;
		   	 		rt_vn = rtrs[0].virtNm
		   	 		rt_vp = rtrs[0].virtP
		   	 	}
		   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 	
		   	 	if(nullToEmpty(rt_vp) != "") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 		$('#'+convList).alopexGrid( "cellEdit", rt_vp+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
		   	 	} else {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "12", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 		$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
		   	 	}
		   	 	
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
		   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
		   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vn, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
		   	 	fs = "ok";
		   	 	
		   	 	/**
		   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
		   	 	 */
		   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
		   	 	
		   	 	
		   	 
		   	 	
		   	/**
		   	 * SNCP_AON 타입 (13)
		   	 */ 	
		   	
		   	//SNCP-AON 타입(13) 	
			} else if(cont == "SNCP-AON") {
				//sendSearch6();
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					port32 = nullToEmpty(tmpData[idx].rmkRt);
					cont2 = nullToEmpty(tmpData[idx].pType);
					aonname2 = nullToEmpty(tmpData[idx].aonName);
					
					
					if(jtape == jtape2 && lname == lname2  && cont2 == "AON-SNCP") {
						/*행 삽입*/
						//if(nullToEmpty(rtPortName)!="") {
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						//}
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후" ) {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	//Main&Spare 설정
				   	 	l1 =  aonname.indexOf("_");
				   	 	if(aonname.substring(l1+1) == "useMain"  ) {
				   	 		mns = "M";
				   	 	} else if(aonname.substring(l1+1) == "useMainSpare"  ) {
				   	 		mns = "MS";
				   	 	} else if(aonname.substring(l1+1) == "useSpare"  ) {
				   	 		mns = "S";
				   	 	}
				   	 	
				   	 	
				   	 	rt_r = left(port3,6); //SNCP링명
				   	 	rt_p = right(port3,10) //RT PORT 
				   	 	
				   	 	if(port3.indexOf(" ") != -1) {
				   	 		rt_n = port3.substr( 6 , port3.length-17 );
				   	 	} else {
				   	 		rt_n = port3.substr( 6 , port3.length-6  );
				   	 	}
				   	 	
				   	 	var param = {
								"value" : rt_n
						}
						httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
				   	 	
				   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
				   	 		/**
				   	 		 * rt port name
				   	 		 */
				   	 		openRtPortNamePop();
				   	 		return false;
				   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
				   	 		rt_ne = rtPortName;
				   	 	} else if(rtrs.length > 0 ){
				   	 		rt_ne = rtrs[0].rtE;
				   	 		rt_vn = rtrs[0].virtNm
				   	 		rt_vp = rtrs[0].virtP
				   	 	}
				   	 	
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", "13", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
				   	 	$('#'+convList).alopexGrid( "cellEdit", "MS", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms2");
				   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vn, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
				   	 	
				   	 	/**
				   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
				   	 	 */
				   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
					} 
				}
				
				
				
			/**
			 * SNCP-con-TU12(11) , SNCP-con-VC12(12) , SNCP-con-aon(13) , SNCP-con-U_MS(13)
			 */	
				
			//SNCP-con 타입 (12,13)-(VC12-con,AON-CON)	
			} else if(cont == "SNCP-con") {
				//sendSearch7();
//				var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//				tempDataList = AlopexGrid.currentData(tempDataList);
//				var tmpData = tempDataList;
				
				for(var idx = 0; idx < tmpData.length ; idx++) {
					jtape2 = nullToEmpty(tmpData[idx].jobDivNm);
					lname2 = nullToEmpty(tmpData[idx].useLineNm);
					sys12 = nullToEmpty(tmpData[idx].eqpNm);
					port12 = nullToEmpty(tmpData[idx].aportNm);
					port22 = nullToEmpty(tmpData[idx].bportNm);
					port32 = nullToEmpty(tmpData[idx].rmkRt);
					cont2 = nullToEmpty(tmpData[idx].pType);
					aonname2 = nullToEmpty(tmpData[idx].aonName);
					
				
					if(sys12.substr(0,4) == "UDCS" ) {
						us1 = "U";
					} else if(sys12.substr(0,4) == "LDCS" ) {
						us1 = "L";
					}
					
					rt_r = left(port3,6); //SNCP링명
			   	 	rt_p = right(port3,10) //RT PORT 
			   	 	
			   	 	if(port3.indexOf(" ") != -1) {
			   	 		rt_n = port3.substr( 6 , port3.length-17 );
			   	 	} else {
			   	 		rt_n = port3.substr( 6 , port3.length-6  );
			   	 	}
					
					if(jtape == jtape2 && lname == lname2  && (cont2 == "AON-con" || cont2 == "VC12-con" || cont2 == "TU12-con" || cont2 == "U_MS-con")) {
						/*행 삽입*/
						if ($("input:checkbox[id='chkAdd']").is(":checked") ){
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
					   	 	
						}
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					
						
				   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	} else  {
					   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
				   	 	}
				   	 	
				   	 	//Main&Spare 설정
				   	 	l1 =  aonname.indexOf("_");
				   	 	if(aonname.substring(l1+1) == "useMain"  ) {
				   	 		mns = "M";
				   	 	} else if(aonname.substring(l1+1) == "useMainSpare"  ) {
				   	 		mns = "MS";
				   	 	} else if(aonname.substring(l1+1) == "useSpare"  ) {
				   	 		mns = "S";
				   	 	}
				   	 	
				   	 	
				   	 	rt_r = left(port3,6); //SNCP링명
				   	 	rt_p = right(port3,10) //RT PORT 
				   	 	
				   	 	if(port3.indexOf(" ") != -1) {
				   	 		rt_n = port3.substr( 6 , port3.length-17 );
				   	 	} else {
				   	 		rt_n = port3.substr( 6 , port3.length-6  );
				   	 	}
				   	 	
				   	 	var param = {
								"value" : rt_n
						}
						httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
				   	 	
				   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
				   	 		/**
				   	 		 * rt port name
				   	 		 */
				   	 		openRtPortNamePop();
				   	 		return false;
				   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
				   	 		rt_ne = rtPortName;
				   	 	} else if(rtrs.length > 0 ){
				   	 		rt_ne = rtrs[0].rtE;
				   	 		rt_vn = rtrs[0].virtNm
				   	 		rt_vp = rtrs[0].virtP
				   	 	}
				   	 	var tmpCotPort1 = port1.substr(0,11);
				   	 	if(us.indexOf('COT') != -1 ) {
				   	 		tmpCotPort1 = port1.substr(0,8)+"0"+port1.substr(8,3);
				   	 	}
				   	 	var tmpCotPort2 = port2.substr(0,11);
				   	 	if(us.indexOf('COT') != -1 ) {
				   	 		tmpCotPort2 = port2.substr(0,8)+"0"+port2.substr(8,3);
				   	 	} 
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
				   	 	$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+tmpCotPort1+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
				   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+tmpCotPort2+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vn, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
				   	 	
				   	 	if(cont2 == "AON-con") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "13", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 		$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 		$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
				   	 	} else if(cont2 == "U_MS-con") {
				   	 		$('#'+convList).alopexGrid( "cellEdit", "13", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 		$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 		$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
				   	 		
				   	 		/**
					   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
					   	 	 */
					   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
				   	 		
				   	 	} else if(cont2 == "TU12-con") {
				   	 		if(nullToEmpty(rt_vp) != "" ) {
				   	 			$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 			$('#'+convList).alopexGrid( "cellEdit", rt_vp+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 		} else {
				   	 			$('#'+convList).alopexGrid( "cellEdit", "11", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
				   	 			$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
				   	 		}
				   	 		
				   	 		$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
				   	 		
				   	 		/**
					   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
					   	 	 */
					   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
				   	 		
				   	 	}
				   	 	
				   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
				   	 	fs = "ok";
				   	 	
				   	 
					} 
				}
				
				
				
			/**
			 *TU12-MS-SPRING(14) 	****성수 WCGS Virtual 타입  *******
			 */	
				
			//U_MS-TU12(14) , U_MS-con(15) , U_MS-con-AON(16)	
			} else if(cont == "VAON-TU12" || cont == "VAON-con" || cont == "VAON-VC12") {
				
				if(cont == "VAON-TU12") {
					/*행 삽입*/
					if ($("input:checkbox[id='chkAdd']").is(":checked") ){
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
				   	 	
					}
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					
			   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
			   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	} else {
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	}
			   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
			   	 	fs = "ok";
			   	 	
				} else if(cont == "VAON-VC12") {
					/*행 삽입*/
					if ($("input:checkbox[id='chkAdd']").is(":checked") ){
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
				   	 	
					}
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					
			   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
			   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	} else {
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	}
			   	 	$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	
			   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
			   	 	
			   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
			   	 	
			   	 	
			   	 	fs = "ok";
			   	 	
			   	 	
				} else if(cont == "VAON-con") {
					
					for(var idx = 0 ; idx < data.length; idx++ ) {
						jtape2 = nullToEmpty(data[idx].jobDivNm);
						lname2 = nullToEmpty(data[idx].useLineNm);
						sys12 = nullToEmpty(data[idx].eqpNm);
						port12 = nullToEmpty(data[idx].aportNm);
						port22 = nullToEmpty(data[idx].bportNm);
						port32 = nullToEmpty(data[idx].rmkRt);
						cont2 = nullToEmpty(data[idx].pType);
						aonname2 = nullToEmpty(data[idx].aonName);
						
						if(sys12.substr(0,4) == "UDCS" ) {
							us1 ="U";
						} else if(sys12.substr(0,4) == "LDCS" ) {
							us1 = "L";
						}
						
						if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "TU12-con") {
							/*행 삽입*/
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	
					   	 	fs = "ok";
					   	 	
						} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "AON-con") { 
							/*행 삽입*/
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	$('#'+convList).alopexGrid( "cellEdit", "16", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	fs = "ok";
						}
					}
				}
			
				
				
			/**
			 * TU12-MS-SPRING (14)        ******수유/보라매 ARNC 타입*************
			 */
				
			//U_MS-TU12(14) , U_MS-con(15) , U_MS-con-AON(16)	
			} else if(( cont == "VC12-ARNC" || cont == "TU12-ARNC" || cont == "AON-ARNC" || cont == "ARNC-con" || cont == "ARNC-TU12" || cont == "ARNC-con-con" || cont == "ARNC-con-VC12")  
					  && (jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후")) {
				if(cont == "ARNC-con") {
					for(var idx = 0 ; idx < data.length; idx++ ) {
						jtape2 = nullToEmpty(data[idx].jobDivNm);
						lname2 = nullToEmpty(data[idx].useLineNm);
						sys12 = nullToEmpty(data[idx].eqpNm);
						port12 = nullToEmpty(data[idx].aportNm);
						port22 = nullToEmpty(data[idx].bportNm);
						port32 = nullToEmpty(data[idx].rmkRt);
						cont2 = nullToEmpty(data[idx].pType);
						aonname2 = nullToEmpty(data[idx].aonName);
						
						rtname2 = nullToEmpty(data[idx].rtName);
						rel5_p2 = nullToEmpty(data[idx].pCtp4);
						prote2 = nullToEmpty(data[idx].pMs0);
						
						
						vir_n2 = nullToEmpty(data[idx].pMsvn1);
						p_p2 = nullToEmpty(data[idx].pMsvn2);
						vir_p2 = nullToEmpty(data[idx].msvp);
						ms_sncp2 = nullToEmpty(data[idx].msvsr);
						
						
						if(nullToEmpty(sys12.substr(0,4)) == "UDCS") {
							us1 = "U";
						} else if(nullToEmpty(sys12.substr(0,4)) == "LDCS") {
							us1 = "L";
						} else {
							us1 = sys12;
						}
						
						
						if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 =="TU12-con") {
							/*행 삽입*/
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	if(nullToEmpty(port4.length) > 0 ) {
					   	 		if(port4.substr(0,4) == "UDCS") {
					   	 			us2 = "U";
					   	 		} else if(port4.substr(0,4) == "LDCS") {
					   	 			us2 = "L";
					   	 		}
					   	 		$('#'+convList).alopexGrid( "cellEdit", us2+port4.substr(4,2)+"/"+port4.substr(7,11)+port4.substr(18,2).replace(/(^0+)/,"")+"/"+port4.substr(20,1)+"/"+port4.substr(21,1)+"/"+port4.substr(22,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	}
					   	 	
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	//$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	
					   	 	if(mtsoId == "MO00000000105" ) {
					   	 		if(rel5_p1 != "" ) {
					   	 			rel5 = rel5_p1 + ",";
					   	 		} else {
					   	 			rel5 = port2.substr(0,11);
					   	 		}
					   	 		
					   	 		$('#'+convList).alopexGrid( "cellEdit", sys1+"/"+rel5+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 		rel5 = "";
					   	 	}
					   	 	
					   	 	fs = "ok";
							
						//SNCP-con ~ 인천ARN-con
						} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 =="SNCP-con" && mtsoId == "MO00000000105" ) {
							//sendSearch9
//							var tempDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//							tempDataList = AlopexGrid.currentData(tempDataList);
//							var tmpData = tempDataList;
							
							for(var idxx = 0; idxx < tmpData.length ; idxx++) {
								jtape3 = nullToEmpty(tmpData[idxx].jobDivNm);
								lname3 = nullToEmpty(tmpData[idxx].useLineNm);
								sys13 = nullToEmpty(tmpData[idxx].eqpNm);
								port13 = nullToEmpty(tmpData[idxx].aportNm);
								port23 = nullToEmpty(tmpData[idxx].bportNm);
								port33 = nullToEmpty(tmpData[idxx].rmkRt);
								cont3 = nullToEmpty(tmpData[idxx].pType);
								aonname3 = nullToEmpty(tmpData[idxx].aonName);
								rel5_p = nullToEmpty(tmpData[idxx].pCtp4);
								prote3 = nullToEmpty(tmpData[idxx].pMs0);
								
								
								if(sys13.substr(0,4)=="UDCS") {
									us3 = "U";
								} else {
									us3 = "L";
								}
								
								rt_r = left(port32,6);  //SNCP링명
								rt_p = right(port32,10); //RT PORT 
								
								if( port32.indexOf(" ") > 0  ) {
									rt_n = port32.substr(6,port32.length-17);
								} else {
									rt_n = port32.substr(6,port32.length-6);
								}
								
								if(jtape2 == jtape3 && lname2 == lname3 && cont3 =="ARNC-con") {
									/*행 삽입*/
									//if(nullToEmpty(rtPortName)!="") {
									if ($("input:checkbox[id='chkAdd']").is(":checked") ){
										var addData = {};
								   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
								   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
								   	 	
									}
									var addData = {};
							   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
									//}
									
							   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후")  {
							   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
							   	 	} else  {
								   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
							   	 	}
									
							   	 	//main & spare 설정
							   	 	l1 =  aonname2.indexOf("_");
							   	 	if(aonname2.substring(l1+1) == "useMain"  ) {
							   	 		mns = "M";
							   	 	} else if(aonname2.substring(l1+1) == "useMainSpare"  ) {
							   	 		mns = "MS";
							   	 	} else if(aonname2.substring(l1+1) == "useSpare"  ) {
							   	 		mns = "S";
							   	 	}
							   	 	
							   	 	//rt_r = left(port32,6);       //SNCP링명
							   	 	//rt_p = right(port32,10);     // RT PORT
							   	 	//rt_n = port32.substr(6,port32.length-17); // RT명 
							   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
							   	 	
							   	 	var param = {
											"value" : rt_n
											,"ntwkLineNm" : rt_r
									}
									httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
							   	 	
							   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
							   	 		/**
							   	 		 * rt port name
							   	 		 */
							   	 		openRtPortNamePop();
							   	 		return false;
							   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
							   	 		rt_ne = rtPortName;
							   	 	} else if(rtrs.length > 0 ){
							   	 		rt_ne = rtrs[0].rtE;
							   	 		rt_vn = rtrs[0].virtNm
							   	 		rt_vp = rtrs[0].virtP
							   	 	}
							   	 	
							   	 	
							   	 	//$('#'+convList).alopexGrid( "cellEdit", "13", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
							   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
							   	 	$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
							   	 	$('#'+convList).alopexGrid( "cellEdit", us3+right(sys13,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
							   	 	$('#'+convList).alopexGrid( "cellEdit", us3+right(sys13,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
							   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vn, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
							   	 
							   	 	if(cont3 == "ARNC-con") {
								   	 	$('#'+convList).alopexGrid( "cellEdit", "17", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
								   	 	$('#'+convList).alopexGrid( "cellEdit", aonname3+",1/"+port13.substr(13,1)+"/"+port13.substr(14,1)+"/"+port13.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
								   	 	
								   	 	if(rel5_p != "") {
								   	 		rel5 = rel5_p+",";
								   	 	} else {
								   	 		rel5 = port23.substr(0,11);
								   	 	}
								   	 	
								   	 	$('#'+convList).alopexGrid( "cellEdit", sys13+"/"+rel5+port23.substr(11,2).replace(/(^0+)/,"")+"/"+port23.substr(13,1)+"/"+port23.substr(14,1)+"/"+port23.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
								   	 	$('#'+convList).alopexGrid( "cellEdit", prote3, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
								   	 	rel5 = "";
							   	 	} else if(cont3 == "U_MS-con") {
								   	 	$('#'+convList).alopexGrid( "cellEdit", "13", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
								   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
								   	 	$('#'+convList).alopexGrid( "cellEdit", us3+right(sys13,2)+"/"+port13.substr(0,11)+port13.substr(11,2).replace(/(^0+)/,"")+"/"+port13.substr(13,1)+"/"+port13.substr(14,1)+"/"+port13.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
								   	 	
								   	 	//CTP 중간 path 구간 설정    보류 
							   	 	} else if(cont3 == "VC12-con") {
								   	 	$('#'+convList).alopexGrid( "cellEdit", "12", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
								   	 	$('#'+convList).alopexGrid( "cellEdit", us3+right(sys13,2)+"/"+port13, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
							   	 	} else if(cont3 == "TU12-con") {
							   	 		if(rt_vp != "" ) {
								   	 		$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
									   	 	$('#'+convList).alopexGrid( "cellEdit", rt_vp+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
							   	 		} else {
								   	 		$('#'+convList).alopexGrid( "cellEdit", "11", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
									   	 	$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
							   	 		}
							   	 		
							   	 		$('#'+convList).alopexGrid( "cellEdit", us3+right(sys13,2)+"/"+port23.substr(0,11)+"/"+port23.substr(11,2).replace(/(^0+)/,"")+"/"+port23.substr(13,1)+"/"+port23.substr(14,1)+"/"+port23.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
							   	 		//CTP 중간 path 구간 설정    보류
							   	 	}
							   	 	
							   	 	fs = "ok"
								}
								
							}
					    }
					}
					
					
					
				} else if( cont == "TU12-con") {
//					for(var idx = 0 ; idx < data.length; idx++ ) {
//						jtape2 = nullToEmpty(data[idx].jobDivNm);
//						lname2 = nullToEmpty(data[idx].useLineNm);
//						sys12 = nullToEmpty(data[idx].eqpNm);
//						port12 = nullToEmpty(data[idx].aportNm);
//						port22 = nullToEmpty(data[idx].bportNm);
//						port32 = nullToEmpty(data[idx].rmkRt);
//						cont2 = nullToEmpty(data[idx].pType);
//						aonname2 = nullToEmpty(data[idx].aonName);
//						
//						rtname2 = nullToEmpty(data[idx].rtName);
//						prote2 = nullToEmpty(data[idx].pMs0);
//						
//						vir_n2 = nullToEmpty(data[idx].pMsvn1);
//						p_p2 = nullToEmpty(data[idx].pMsvn2);
//						vir_p2 = nullToEmpty(data[idx].msvp);
//						ms_sncp2 = nullToEmpty(data[idx].msvsr);
//						
//						
//						if(nullToEmpty(sys12.substr(0,4)) == "UDCS") {
//							us1 = "U";
//						} else if(nullToEmpty(sys12.substr(0,4)) == "LDCS") {
//							us1 = "L";
//						}
//						
//						
//						if(jtape == jtape2 && lname == lname2 && port1 != port12) {
//							/*행 삽입*/
//							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
//								var addData = {};
//						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
//						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
//						   	 	
//							}
//							var addData = {};
//					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
//							
//					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
//					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
//					   	 	} else {
//						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
//					   	 	}
//					   	 	
//					   	 	if(nullToEmpty(port4.length) > 0 ) {
//					   	 		if(port4.substr(0,4) == "UDCS") {
//					   	 			us2 = "U";
//					   	 		} else if(port4.substr(0,4) == "LDCS") {
//					   	 			us2 = "L";
//					   	 		}
//					   	 		$('#'+convList).alopexGrid( "cellEdit", us2+port4.substr(4,2)+"/"+port4.substr(7,11)+port4.substr(18,2).replace(/(^0+)/,"")+"/"+port4.substr(20,1)+"/"+port4.substr(21,1)+"/"+port4.substr(22,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
//					   	 	}
//					   	 	
//					   	 	
//					   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+",1/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
//					   	 	
//					   	 	if(mtsoId == "MO00000000105") {
//					   	 		//
//					   	 	}
//					   	 	$('#'+convList).alopexGrid( "cellEdit", prote2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
//					   	 	
//					   	 	
//					   	 	fs = "ok";
//							
//						
//						}
//					}
//					
//					
				}  else if(cont == "ARNC-con-VC12") {
					if(port4.substr(0,4) == "UDCS") {
						us2 = "U" ;
					} else if(port4.substr(0,4) == "LDCS") {
						us2 = "L" ;
					}
					
					/*행 삽입*/
					if ($("input:checkbox[id='chkAdd']").is(":checked") ){
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
				   	 	
					}
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					
			   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
			   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	} else {
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	}
			   	 	
			   	 	$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us2+port4.substr(4,2)+"/"+port4.substring(7), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
			   	 	$('#'+convList).alopexGrid( "cellEdit", prote2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
			   	 	
				} else if( cont == "ARNC-VC12") {
					if(port3.substr(0,4) == "UDCS") {
						us2 = "U";
					} else if(port3.substr(0,4) == "LDCS"){
						us2 = "L";
					}
					/*행 삽입*/
					if ($("input:checkbox[id='chkAdd']").is(":checked") ){
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
				   	 	
					}
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					
			   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
			   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	} else {
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	}
			   	 	
			   	 	$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us2+port3.substr(4,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					
				} else if(cont == "ARNC-TU12" || cont == "ARNC-con-con") {
					for(var idx = 0 ; idx < data.length; idx++ ) {
						jtape2 = nullToEmpty(data[idx].jobDivNm);
						lname2 = nullToEmpty(data[idx].useLineNm);
						sys12 = nullToEmpty(data[idx].eqpNm);
						port12 = nullToEmpty(data[idx].aportNm);
						port22 = nullToEmpty(data[idx].bportNm);
						port32 = nullToEmpty(data[idx].rmkRt);
						cont2 = nullToEmpty(data[idx].pType);
						aonname2 = nullToEmpty(data[idx].aonName);
						
						rtname2 = nullToEmpty(data[idx].rtName);
						prote2 = nullToEmpty(data[idx].pMs0);
						
						vir_n2 = nullToEmpty(data[idx].pMsvn1);
						p_p2 = nullToEmpty(data[idx].pMsvn2);
						vir_p2 = nullToEmpty(data[idx].msvp);
						ms_sncp2 = nullToEmpty(data[idx].msvsr);
						
						
						if(nullToEmpty(sys12.substr(0,4)) == "UDCS") {
							us1 = "U";
						} else if(nullToEmpty(sys12.substr(0,4)) == "LDCS") {
							us1 = "L";
						}
						
						
						if(jtape == jtape2 && lname == lname2 && port1 != port12 && (cont2 == "SNCP-con" || cont2 == "SNCP-ARNC") && cont2 != "VC12-ARNC") {
							//if(nullToEmpty(rtPortName)!="") {
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							//}
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	//main & spare 설정
					   	 	l1 =  aonname2.indexOf("_");
					   	 	if(aonname2.substring(l1+1) == "useMain"  ) {
					   	 		mns = "M";
					   	 	} else if(aonname2.substring(l1+1) == "useMainSpare"  ) {
					   	 		mns = "MS";
					   	 	} else if(aonname2.substring(l1+1) == "useSpare"  ) {
					   	 		mns = "S";
					   	 	}
					   	 	
					   	 	rt_r = left(port32,6);       //SNCP링명
					   	 	rt_p = right(port32,10);     // RT PORT
					   	 	rt_n = port32.substr(6,port32.length-17); // RT명 
					   	 	
					   	 	var param = {
									"value" : rt_n
							}
							httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
					   	 	
					   	 	if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
					   	 		/**
					   	 		 * rt port name
					   	 		 */
					   	 		openRtPortNamePop();
					   	 		return false;
					   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
					   	 		rt_ne = rtPortName;
					   	 	} else if(rtrs.length > 0 ){
					   	 		rt_ne = rtrs[0].rtE;
					   	 		rt_vn = rtrs[0].virtNm
					   	 		rt_vp = rtrs[0].virtP
					   	 	}
					   	 	
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "17", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "MS", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms2");
					   	 	$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	
					   	 	/**
					   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
					   	 	 */
					   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
							
						
						} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 != "VC12-ARNC") {
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+",1/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22.substr(0,11)+port22.substr(11,2).replace(/(^0+)/,"")+"/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	
					   	 	if(cont2 == "TU12-con") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", sys1+"/"+port2.substr(0,8)+port2.substr(8,2).replace(/(^0+)/,"")+","+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");	
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", prote, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	
					   	 	fs="ok";
						}
					}
					
					
					
				} else if(cont == "VC12-ARNC") {
					for(var idx = 0 ; idx < data.length; idx++ ) {
						jtape2 = nullToEmpty(data[idx].jobDivNm);
						lname2 = nullToEmpty(data[idx].useLineNm);
						sys12 = nullToEmpty(data[idx].eqpNm);
						port12 = nullToEmpty(data[idx].aportNm);
						port22 = nullToEmpty(data[idx].bportNm);
						port32 = nullToEmpty(data[idx].rmkRt);
						cont2 = nullToEmpty(data[idx].pType);
						aonname2 = nullToEmpty(data[idx].aonName);
						
						rtname2 = nullToEmpty(data[idx].rtName);
						prote2 = nullToEmpty(data[idx].pMs0);
						
						vir_n2 = nullToEmpty(data[idx].pMsvn1);
						p_p2 = nullToEmpty(data[idx].pMsvn2);
						vir_p2 = nullToEmpty(data[idx].msvp);
						ms_sncp2 = nullToEmpty(data[idx].msvsr);
						
						
						if(nullToEmpty(sys12.substr(0,4)) == "UDCS") {
							us1 = "U";
						} else if(nullToEmpty(sys12.substr(0,4)) == "LDCS") {
							us1 = "L";
						}
						
						
						if(jtape == jtape2 && lname == lname2 && port1 != port12 ) {
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+",1/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", prote2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	fs = "ok";
						}
					}
					   	 		
				} else if(cont == "AON-ARNC") {
				//} else if(cont == "AON-ARNC" || cont == "AON-con") {
					for(var idx = 0 ; idx < data.length; idx++ ) {
						jtape2 = nullToEmpty(data[idx].jobDivNm);
						lname2 = nullToEmpty(data[idx].useLineNm);
						sys12 = nullToEmpty(data[idx].eqpNm);
						port12 = nullToEmpty(data[idx].aportNm);
						port22 = nullToEmpty(data[idx].bportNm);
						port32 = nullToEmpty(data[idx].rmkRt);
						cont2 = nullToEmpty(data[idx].pType);
						aonname2 = nullToEmpty(data[idx].aonName);
						
						rtname2 = nullToEmpty(data[idx].rtName);
						prote2 = nullToEmpty(data[idx].pMs0);
						
						vir_n2 = nullToEmpty(data[idx].pMsvn1);
						p_p2 = nullToEmpty(data[idx].pMsvn2);
						vir_p2 = nullToEmpty(data[idx].msvp);
						ms_sncp2 = nullToEmpty(data[idx].msvsr);
						
						
						if(nullToEmpty(sys12.substr(0,4)) == "UDCS") {
							us1 = "U";
						} else if(nullToEmpty(sys12.substr(0,4)) == "LDCS") {
							us1 = "L";
						}
						
						
						if(jtape == jtape2 && lname == lname2 && port1 != port12 ) {
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "16", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+",1/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	$('#'+convList).alopexGrid( "cellEdit", prote2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
					   	 	fs = "ok";
						}
					}
					
					
				} else if(cont == "SNCP-ARNC" || cont == "SNCP-con") {
//					for(var idx = 0 ; idx < data.length; idx++ ) {
//						jtape2 = nullToEmpty(data[idx].jobDivNm);
//						lname2 = nullToEmpty(data[idx].useLineNm);
//						sys12 = nullToEmpty(data[idx].eqpNm);
//						port12 = nullToEmpty(data[idx].aportNm);
//						port22 = nullToEmpty(data[idx].bportNm);
//						port32 = nullToEmpty(data[idx].rmkRt);
//						cont2 = nullToEmpty(data[idx].pType);
//						aonname2 = nullToEmpty(data[idx].aonName);
//						
//						rtname2 = nullToEmpty(data[idx].rtName);
//						prote2 = nullToEmpty(data[idx].pMs0);
//						
//						vir_n2 = nullToEmpty(data[idx].pMsvn1);
//						p_p2 = nullToEmpty(data[idx].pMsvn2);
//						vir_p2 = nullToEmpty(data[idx].msvp);
//						ms_sncp2 = nullToEmpty(data[idx].msvsr);
//						
//						
//						if(jtape == jtape2 && lname == lname2 && port1 != port12 ) {
//							if(nullToEmpty(rtPortName)!="") {
//								var addData = {};
//						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
//							}
//							
//					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
//					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
//					   	 	} else {
//						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
//					   	 	}
//					   	 	
//					   	 	//main & spare 설정
//					   	 	l1 =  aonname.indexOf("_");
//					   	 	if(aonname.substring(l1+1) == "useMain"  ) {
//					   	 		mns = "M";
//					   	 	} else if(aonname.substring(l1+1) == "useMainSpare"  ) {
//					   	 		mns = "MS";
//					   	 	} else if(aonname.substring(l1+1) == "useSpare"  ) {
//					   	 		mns = "S";
//					   	 	}
//					   	 	
//					   	 	rt_r = left(port3,6);       //SNCP링명
//					   	 	rt_p = right(port3,10);     // RT PORT
//					   	 	rt_n = port3.substr(6,port3.length-17); // RT명 
//					   	 	
//		   	 				var param = {
//									"value" : rt_n
//							}
//							httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRtPortType', param, 'GET', 'getRtData');
//					   	 	
//		   	 				if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)=="" ) {
//					   	 		/**
//					   	 		 * rt port name
//					   	 		 */
//					   	 		openRtPortNamePop();
//					   	 		return false;
//					   	 	} else if((rtrs == null || rtrs.length == 0) && nullToEmpty(rtPortName)!="" ) {
//					   	 		rt_ne = rtPortName;
//					   	 	} else if(rtrs.length > 0 ){
//					   	 		rt_ne = rtrs[0].rtE;
//					   	 		rt_vn = rtrs[0].virtNm
//					   	 		rt_vp = rtrs[0].virtP
//					   	 	}
//					   	 	
//					   	 	$('#'+convList).alopexGrid( "cellEdit", "17", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", rt_ne+"/"+rt_p, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+",1/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
//					   	 	
//					   	 	if(rtname2 != "" ) {
//					   	 		$('#'+convList).alopexGrid( "cellEdit", rtname2+",1/"+port22.substr(13,1)+"/"+port22.substr(14,1)+"/"+port22.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");	
//					   	 	}
//					   	 	
//					   	 	if(nullToEmpty(port4.length) > 0 ) {
//					   	 		
//					   	 		if(port4.substr(0,4) == "UDCS") {
//					   	 			us2 = "U";
//					   	 		} else if(port4.substr(0,4) == "LDCS") {
//					   	 			us2 = "L";
//					   	 		}
//					   	 		
//					   	 		$('#'+convList).alopexGrid( "cellEdit", us2+port4.substr(4,2)+"/"+port4.substr(7,11)+port4.substr(18,2).replace(/(^0+)/,"")+"/"+port4.substr(20,1)+"/"+port4.substr(21,1)+"/"+port4.substr(22,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
//					   	 		$('#'+convList).alopexGrid( "cellEdit", "MS", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms3");
//					   	 	}
//					   	 	
//					   	 	
//					   	 	$('#'+convList).alopexGrid( "cellEdit", "MS", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms2");
//					   	 	$('#'+convList).alopexGrid( "cellEdit", prote2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
//					   	 	
//					   	 	
//					   	 	/**
//					   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
//					   	 	 */
//					   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
//							
//					   	 	
//						}
//					}
				}
					
				
			
			/**
			 * TU12-MS-SPRING(14)    ***서부꺼 추가 검토 타입*** 
			 */	
				
			//U_MS-TU12(14) , U_MS-con(15) , MS-con-AON(16) , U_MS-SNCP(17)	
			} else if(cont == "U_MS-TU12" || cont == "U_MS-con" || cont == "U_MS-SNCP") {
				
				if(cont == "U_MS-TU12") {
					/*행 삽입*/
					if ($("input:checkbox[id='chkAdd']").is(":checked") ){
						var addData = {};
				   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
				   	 	
					}
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
					
			   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
			   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	} else {
				   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	}
			   	 	
			   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
			   	 	
			   	 	/**
			   	 	 * CTP 중간 PATH구간 설정 (TU12포트는 수동입력 ) 
			   	 	 */
			   	 	/*AT622M 테이블이 없고 기존 AT622M테이블에도 데이터가 없으므로 추후에 필요하게되면 수정해야됨*/
			   	 	
			   	 	
			   	 	fs = "ok";
			   	 	
			   	 	
				} else if(cont == "U_MS-con") {
					for(var idx = 0 ; idx < data.length; idx++ ) {
						jtape2 = nullToEmpty(data[idx].jobDivNm);
						lname2 = nullToEmpty(data[idx].useLineNm);
						sys12 = nullToEmpty(data[idx].eqpNm);
						port12 = nullToEmpty(data[idx].aportNm);
						port22 = nullToEmpty(data[idx].bportNm);
						port32 = nullToEmpty(data[idx].rmkRt);
						cont2 = nullToEmpty(data[idx].pType);
						aonname2 = nullToEmpty(data[idx].aonName);
						if(nullToEmpty(sys12.substr(0,4)) == "UDCS") {
							us1 = "U";
						} else if(nullToEmpty(sys12.substr(0,4)) == "LDCS") {
							us1 = "L";
						}
						
						if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "TU12-con") {
							/*행 삽입*/
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "14", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	fs = "ok";
					   	 	
					   	 	
						} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "AON-con") {
							/*행 삽입*/
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "16", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname2+"/01-1-"+right(port32,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port12.substr(0,11)+port12.substr(11,2).replace(/(^0+)/,"")+"/"+port12.substr(13,1)+"/"+port12.substr(14,1)+"/"+port12.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp3");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	fs = "ok";
					   	 	
						} else if(jtape == jtape2 && lname == lname2 && port1 != port12 && cont2 == "con-VC12") {
							/*행 삽입*/
							if ($("input:checkbox[id='chkAdd']").is(":checked") ){
								var addData = {};
						   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
						   	 	
							}
							var addData = {};
					   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
							
					   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
					   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	} else {
						   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
					   	 	}
					   	 	
					   	 	$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
					   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
					   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us1+right(sys12,2)+"/"+port22, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
					   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2.substr(0,11)+port2.substr(11,2).replace(/(^0+)/,"")+"/"+port2.substr(13,1)+"/"+port2.substr(14,1)+"/"+port2.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp2");
					   	 	fs = "ok";
							
						}
					}
						
				}
			
				
				
			/**
			 * TU12-MS-SPRING (15)
			 */
				
			// AON-VC12 타입 (6)	
			} else if( cont == "U_MS-VC12" ) {
				/*행 삽입*/
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
			   	 	
				}
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 	} else {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
		   	 	}
		   	 	
		   	 	$('#'+convList).alopexGrid( "cellEdit", "15", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
		   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
		   	 	$('#'+convList).alopexGrid( "cellEdit", aonname+"/01-1-"+right(port3,5), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
		   	 	$('#'+convList).alopexGrid( "cellEdit", us+right(sys1,2)+"/"+port1.substr(0,11)+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
		   	 	
		   	 	fs = "ok";
			}
			
			
			var tmpCnt = $('#'+convList).alopexGrid('dataGet').length;
			if (tmpCnt == 0) {
				jtype = "";
			} else {
				jtype = $('#'+convList).alopexGrid('dataGet', {_index : { row : tmpCnt-1}})[0].cctype;
			} 
			
			if(jtype == "11" || jtype == "12" || jtype == "13" ) {
				$('#'+convList).alopexGrid( "cellEdit",$('#frame').val(), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "frame");
				$('#'+convList).alopexGrid( "cellEdit",$('#alm').val() , {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "alarm");
				$('#'+convList).alopexGrid( "cellEdit",$('#sncpType').val() , {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "sncptype");
				fs = "ok";
				
			} else {
				$('#'+convList).alopexGrid( "cellEdit",$('#frame').val() , {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "frame");
				$('#'+convList).alopexGrid( "cellEdit",$('#alm').val() , {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "alarm");
				fs = "ok";
			}
			
			
			/**
			 * MS-SPRING-AT622M_SNCP(17)
			 */
		
			// TU12-VC12 타입 (1)
			if(ms_sncp != "" ) {
				/*행 삽입*/
				if ($("input:checkbox[id='chkAdd']").is(":checked") ){
					var addData = {};
			   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1 }}, "type");
			   	 	
				}
				if(p_p == "useMain") {
					mns = "M";
				} else if(p_p == "useMainSpare") {
					mns = "MS";
				} else if(p_p == "useSpare") {
					mns = "S";
				} else {
					mns = "MS";
				}
				
				
				var addData = {};
		   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
				
		   	 	if(jtape =="신설" || jtape == "신규" || jtape =="증설" || jtape =="변경후") {
		   	 		$('#'+convList).alopexGrid( "cellEdit", "C", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	$('#'+convList).alopexGrid( "cellEdit", "17", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	$('#'+convList).alopexGrid( "cellEdit", ms_sncp+"/"+right(port3,10), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", vir_p+","+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
			   	 	$('#'+convList).alopexGrid( "cellEdit", vir_n, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
		   	 		fs = "ok";
		   	 	} else {
			   	 	$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
			   	 	$('#'+convList).alopexGrid( "cellEdit", "17", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
			   	 	$('#'+convList).alopexGrid( "cellEdit", lname1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ccname");
			   	 	$('#'+convList).alopexGrid( "cellEdit", ms_sncp+"/"+right(port3,10), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
			   	 	$('#'+convList).alopexGrid( "cellEdit", vir_p+","+port1.substr(11,2).replace(/(^0+)/,"")+"/"+port1.substr(13,1)+"/"+port1.substr(14,1)+"/"+port1.substr(15,1), {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
			   	 	$('#'+convList).alopexGrid( "cellEdit", mns, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ms1");
			   	 	$('#'+convList).alopexGrid( "cellEdit", vir_n, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "msvn1");
			   	 	fs = "ok";
		   	 	}
				
				
			}
		} else if(data[aidx]._state.selected == true && (jtape == "감설" || jtape == "해지" || jtape == "변경전" || jtape == "감소" )  ) {
			var addData = {};
	   	 	$("#"+convList).alopexGrid('dataAdd',  addData);
			$('#'+convList).alopexGrid( "cellEdit", "D", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "type");
	   	 	$('#'+convList).alopexGrid( "cellEdit", "1", {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "cctype");
	   	 	$('#'+convList).alopexGrid( "cellEdit", sys1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "from");
	   	 	$('#'+convList).alopexGrid( "cellEdit", port1, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "to");
	   	 	$('#'+convList).alopexGrid( "cellEdit", port2, {_index : { row : $('#'+convList).alopexGrid("dataGet").length-1}}, "ctp1");
		}
	}
	

	/**
	 * 회선명 영문변환하기
	 */
	//step2_1
	converKorToEng();
	
}


/**
 * 회선명 영문변환하기
 */

//step2_1
function converKorToEng() {
	var rngxlen = ""; var cdb = ""; var vir_n = ""; var vir_p = ""; var ms_sncp = ""; var p_p = ""; var fs = "";
	var jtape = ""; var lname = ""; var lname1 = ""; var sys1 = ""; var port1 = ""; var port2 = ""; var port3 = ""; var port11 = ""; var pt1 = ""; var pt2 = ""; var cont = "";
	var cont2 = ""; var s1 = ""; var aonname = ""; var rtname = ""; var ss1 = ""; var us = ""; var us1 = ""; var cname1 = ""; var lsys = ""; var jtape2 = ""; var lname2 = "";
	var sys12 = ""; var port12 = ""; var port22 = ""; var port32 = ""; var aonname2 = ""; var strNeweng = ""; var cname = ""; var rt_p = ""; var rt_r = ""; var rt_n = "";
	var rt_ne = ""; var jtype = ""; var mns = ""; var l1 = ""; var dt = ""; var kname = ""; var rt_vn = ""; var rt_vp = ""; var prote = "";
	var strKor = []; var strEng = [];
	
	
	var dataList = $('#'+convList).alopexGrid('dataGet');
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yy = today.getFullYear();
	
	if( (""+mm).length == 1 ) {
		mm ="0"+mm ;
	}
	if( (""+dd).length == 1 ) {
		dd ="0"+dd ; 
	}
	yy = ""+yy;
	cdb = "("+yy.substring(2,4)+mm+dd+")";
	
	
	for(var idx = data.length-1 ; idx >= 0 ; idx--) {
		dt = nullToEmpty(data[idx].type);
		
		if(dt == "D" ) {
			data[idx]._state.selected = true;
			$('#'+convList).alopexGrid('updateOption');
		}
		
		if(dt == "C") {
			data[idx]._state.selected = true;
			$('#'+convList).alopexGrid('updateOption');
			kname = nullToEmpty(data[idx].ccname);
			rngxlen = kname.length;
			lsys = data[idx].from.substr(0,3);
			$('#'+convList).alopexGrid( "cellEdit", "", {_index : { row : idx}}, "ccname");
			
			for(var index = 0; index < rngxlen ; index++ ) {
				cname = $('#'+convList).alopexGrid('dataGet' , {_index : { row : idx}})[0].ccname;
				strKor.push(kname.substr(index,1));
				
				var param = {
					"kor" : strKor.slice(-1)[0]
				}
				httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getEngChar', param, 'GET', 'getEngChar');
				
				//if(engrs.length == 0 || engrs.size == 0 || engrs == null) {
				if(engrs == null || engrs.length == 0) {
						
					if( strKor.slice(-1)[0] == "\n"  ) {
						strNeweng = "";
					} else if(strKor.slice(-1)[0] != " " ) {
						cflineHideProgressBody();
						/**
						 * 미등록 글자 alert box 
						 */
						alertBox('I', "("+strKor.slice(-1)[0]+") 에 해당하는 영문이 등록되어있지 않습니다. 등록바랍니다."); 
						$('#'+convList).alopexGrid("dataDelete");
						return;
					} else if(strKor.slice(-1)[0] == " " ) {
						strNeweng = " ";
					}
					
					$('#'+convList).alopexGrid( "cellEdit", cname+""+strNeweng, {_index : { row : idx}}, "ccname");
					
				} else {
					$('#'+convList).alopexGrid( "cellEdit", cname+""+engrs[0].eng, {_index : { row : idx}}, "ccname");
				}
				
			}
			cname1 = $('#'+convList).alopexGrid('dataGet' , {_index : { row : idx}})[0].ccname;
			$('#'+convList).alopexGrid( "cellEdit", lsys+"_"+cname1, {_index : { row : idx}}, "ccname");
			
		}
		
		
	}
	
	/**
	 * TYPE별 RM_PATH_NAME으로 CCNAME 세팅
	 */
	setRmPathName();
	
}





/**
 * TYPE별 RM_PATH_NAME으로 CCNAME 세팅
 */
//step3
function setRmPathName() {
	
	var jtape = ""; var lname = ""; var sys1 = ""; var port1 = ""; var port2 = ""; var port3 = ""; var port11 = ""; var pt1 =""; var pt2 = ""; var aon_name = "";
	var user_name = ""; var st = ""; var ss = ""; var sys = ""; var r = ""; var s = ""; var b = ""; var p = ""; var tu1 = ""; var tu2 = ""; var tu3 = "";
	var tu4 = ""; var sp = ""; var sn = ""; var sport= ""; var pname = ""; var sysName = ""; var eqpNm= "";
	
	var dataList = $('#'+convList).alopexGrid('dataGet',{_state:{selected:true}});
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	
	for(var idx = 0 ; idx < data.length ; idx++ ) {
		jtape = nullToEmpty(data[idx].type);
		lname = nullToEmpty(data[idx].ccname);
		port1 = nullToEmpty(data[idx].from);
		port2 = nullToEmpty(data[idx].to);
		port3 = nullToEmpty(data[idx].ctp1);
		
		/*if(port1.length == 22 && port1.substr(3,1) == "/") {
			port1 = port1;
		} else if(port2.length == 22 && port2.substr(3,1) == "/") {
			port1 = port2;
		} else if(port3.length == 22 && port3.substr(3,1) == "/") {
			port1 = port3;
		} else {
			port1 = port1;
		}*/
		
		/*if(port1.length ==0 ) {
			cflineHideProgressBody();
			alertBox('I', "변경 실패 , 재검토 요합니다.");
			return false;
		}*/
		
		if(jtape == "D" ) {
			
			/**
			 * A포트 타입 조회
			 */
			var param = {
				"eqpNm" : port1
				,"portChnl" : port2
				,"portChnlTwo" : port3
			}
			httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRmPathName', param, 'GET', 'getRmPathName');
			
			if(rpnrs != null && rpnrs.length > 0) {
				user_name = rpnrs[0].rmPathName;
				$('#'+convList).alopexGrid( "cellEdit", user_name, {_index : { row : idx}}, "ccname");
				user_name = "";
			} else {
				$('#'+convList).alopexGrid( "cellEdit", "유휴", {_index : { row : idx}}, "ccname");
			}
		}
	}
	
	
	
	/**
	 * setMainSpare
	 */
	setMainSpare();
}



/**
 * setMainSpare
 */
//step4
function setMainSpare() {
	var ctp1 = "";var ctp2 = "";  var ctp3 = ""; var ctp4 = ""; var ms0 = ""; var ms1 = ""; var ms2 = ""; var ms3 = ""; var ms4 = "";
	var jt = ""; var uname= ""; var cj = ""; var jt2 = ""; var uname2 = "";
	var dataList = $('#'+convList).alopexGrid('dataGet',{_state:{selected:true}});
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	
	for(var idx = 0 ; idx < data.length; idx++ ) {
		jt = nullToEmpty(data[idx].type);
		uname = nullToEmpty(data[idx].ccname);
		
		ctp1 = nullToEmpty(data[idx].ctp1);
		ctp2 = nullToEmpty(data[idx].ctp2);
		ctp3 = nullToEmpty(data[idx].ctp3);
		ctp4 = nullToEmpty(data[idx].ctp4);
		
		ms0 = nullToEmpty(data[idx].ms0);
		ms1 = nullToEmpty(data[idx].ms1);
		ms2 = nullToEmpty(data[idx].ms2);
		ms3 = nullToEmpty(data[idx].ms3);
		ms4 = nullToEmpty(data[idx].ms4);
		
		if(nullToEmpty(ms0) == "" ) {
			$('#'+convList).alopexGrid( "cellEdit", "ms", {_index : { row : idx}}, "ms0");
		}
		if(ctp1.length > 0 && nullToEmpty(ms1) == "" ) {
			$('#'+convList).alopexGrid( "cellEdit", "ms", {_index : { row : idx}}, "ms1");
		}
		if(ctp2.length > 0 && nullToEmpty(ms2) == "" ) {
			$('#'+convList).alopexGrid( "cellEdit", "ms", {_index : { row : idx}}, "ms2");
		}
		if(ctp3.length > 0 && nullToEmpty(ms3) == "" ) {
			$('#'+convList).alopexGrid( "cellEdit", "ms", {_index : { row : idx}}, "ms3");
		}
		if(ctp4.length > 0 && nullToEmpty(ms4) == "" ) {
			$('#'+convList).alopexGrid( "cellEdit", "ms", {_index : { row : idx}}, "ms4");
		}
		
		//삭제 대상 선별
		if( jt == "D" ) {
			cj=  0 ;
			for(var j = 0 ; j < data.length; j++ ) {
				jt2 = nullToEmpty(data[j].type);
				uname2 = nullToEmpty(data[j].ccname);
				
				if(uname == uname2 && jt2 =="D") {
					cj = cj+1;
				}
				if( cj == 2 ){ 
					data[j]._state.selected = false;
					$('#'+convList).alopexGrid('updateOption');
					break;
				}
				
			}
		}
		
	}
	rtPortName = "";
	
	var deleteDataIdx = [];
	for(var j = data.length-1 ; j >= 0; j-- ) {
		if(data[j]._state.selected == false ) {
			deleteDataIdx.push(j);
		}
	}
	for(var j = 0 ; j < deleteDataIdx.length; j++ ) {
		$('#'+convList).alopexGrid( "dataDelete",  {_index : { row :  deleteDataIdx[j]}});
	}

	
	
	var dataList = $('#'+convList).alopexGrid('dataGet');
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	

	
	//그리드 2  순번 세팅
	var resultCnt = 1;
	for(var idx = 0 ; idx < data.length ; idx++ ) {
		$('#'+convList).alopexGrid( "cellEdit", resultCnt, {_index : { row : idx}}, "ordRow");
		resultCnt++;
	}
	
	cflineHideProgressBody();
	if(dataList.length > 0 && nullToEmpty(dataList.length) != "" ) {
		alertBox('I', "데이터 변환 성공");	
	} else {
		alertBox('I', "변환된 데이터가 없습니다.");
	}
	
}


//DCS간연동 버튼 Bport채우기
function selectBportDCS(tmpMtsoId) {
	//cflineShowProgressBody();
	var topMtsoId = tmpMtsoId;
	var ctp1 = ""; var ctp2 = ""; var ctp3 = ""; var ctp4= ""; var ms0 = "";var ms1 = "";var ms2 = "";var ms3 = "";var ms4 = "";
	var jt = ""; var uname = ""; var chk = ""; var uname2 = ""; var cj = ""; var jt2 = ""; var sys = ""; var aport = "";
	var bport = ""; var sys2 = ""; var aport2 = ""; var bport2 = ""; var tu11 = ""; var tu12 = ""; var tu13 = ""; var tu14 = "";
	var tu21 = ""; var tu22 = ""; var tu23 = ""; var tu24 = "";  var tu_11 = ""; var tu_ = ""; var ret = "";
	var s = ""; var smct = ""; var ssys = ""; var etc = ""; var etc2 = ""; var trnk = ""; var schk = "";
	var csys = ""; var trnkn = ""; var s_i = ""; var h = ""; var ic = ""; var asts= ""; var bsts = "";
	var sts = "";
	var dataList = $('#'+tangoList).alopexGrid('dataGet');
	dataList = AlopexGrid.currentData(dataList);
	var data = dataList;
	for(var idx = data.length-1 ; idx >= 0 ; idx-- ){
		if( nullToEmpty(data[idx].jobDivNm) =="" ){
			$('#'+tangoList).alopexGrid( "dataDelete",  {_index : { row : idx}});
		}
	}
	
	//순번 재세팅
	var gridAll = $('#'+tangoList).alopexGrid('dataGet');
	for(var idx = 0 ; idx < gridAll.length ; idx++ ) {
		$('#'+tangoList).alopexGrid( "cellEdit", idx+1, {_index : { row : gridAll[idx]._index.row}}, "ordRow");
	}
	
	dataList = $('#'+tangoList).alopexGrid('dataGet');
	dataList = AlopexGrid.currentData(dataList);
	data = dataList;
	for( var idx = 0 ; idx < data.length ; idx++ ) {
		jt = nullToEmpty(data[idx].jobDivNm) ; //작업구분
		uname = nullToEmpty(data[idx].useLineNm) ; // 회선명
	    sys = nullToEmpty(data[idx].eqpNm) ;  // 장비명
		aport = nullToEmpty(data[idx].aportNm) ; // aport
		bport = nullToEmpty(data[idx].bportNm) ; // bport
		etc = nullToEmpty(data[idx].rmkRt) ;  // 비고(AON/RT DROP)
		
		/*
		########################중요 사항################################
			그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
			따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
		########################중요 사항################################
		 */
		if(nullToEmpty(uname)!="") {
			uname = replaceToEmpty(uname);
		}
		if(nullToEmpty(sys)!="") {
			sys = replaceToEmpty(sys);
		}
		if(nullToEmpty(etc)!="") {
			etc = replaceToEmpty(etc);
		}
		
		
		if(jt =="변경후" || jt == "신설" || jt == "증설") {			
			for(var j = data.length-1 ; j >= idx+1 ; j-- ) {
				jt2 = nullToEmpty(data[j].jobDivNm) ; //작업구분
				uname2 = nullToEmpty(data[j].useLineNm) ; //회선명 
				sys2 = nullToEmpty(data[j].eqpNm) ; //장비명
				aport2 = nullToEmpty(data[j].aportNm) ; //aport
				bport2 = nullToEmpty(data[j].bportNm) ; //bport
				etc2 = nullToEmpty(data[j].rmkRt) ; //비고(AON/RT DROP)
				
				schk = "nok" ;
				
				if(uname == uname2 && (jt2 =="변경후" || jt2 =="신설" || jt2 == "증설")) {
					/**
					 *  보라매 SMCT
					 */
					
				/*	if(aport.length ==13 || aport2.length == 13 ) {
						if(sys == sys2 ) { //DCS연동이 없을때
							if(aport.length == 13 ) {
								smct = aport;
								ssys = sys;
							} else {
								smct = aport2;
								ssys = sys2;
							}
							
						} else {
							if(aport.length == 13 ) {
								trnk = etc;
								csys = sys2;
							} else {
								trnk = etc2;
								csys = sys;
							}
							
							var param = {
									"ntwkLineNm" : trnk.substr(0,7)	
									,"eqpNm" : csys
									,"mtsoId" : topMtsoId
							}
							httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getTieMgmtList', param, 'GET', 'getTieMgmtList');
							
							for( var i = 0 ; i < rs5.length ; i++ ) {
								if(csys == rs5[i].eqpNm) {
									smct = rs5[i].portNm;
									ssys = rs5[i].eqpNm;
									trnkn = rs5[i].ntwkLineNm;
									schk = "ok";
									break;
								}
							}
							var nowsecond = new Date();
							console.log(nowsecond);
							s_i = nowsecond.getSeconds(); 
							console.log(s_i);
							if(schk != "ok") {
								if(s_i%2 == 0 ) {
									smct = rs5[0].portNm;
									ssys = rs5[0].eqpNm;
									trnkn = rs5[0].ntwkLineNm;
								} else if(s_i%2 == 1 ) {
									smct = rs5[rs5.length-1].portNm;
									ssys = rs5[rs5.length-1].eqpNm;
									trnkn = rs5[rs5.length-1].ntwkLineNm;
								}	
								schk = "nok";
							}
						}
						
						h = 0;
						for(s = 1 ; s<=3 ; s++ ) {
							var temp = smct.substr(11,2)+""+h;
							asts0 = smct.substr(0,11)+temp.replace(/(^0+)/,"");
							
							var param = {
									"eqpNm" : ssys
									,"capaNm" : "004001"
									,"aChannelDescr" : asts0
									,"zChannelDescr" : asts0
									,"rmCase" : "case1"
							}
							httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRmCrsData', param, 'GET', 'getRmCrsData');
							
							
							
							 * LTemp.mdb DBdata select (rs3c0)
							 
							
							
							if(rs2c0[0].totalCnt < 63 )  {
								for(var y = 1 ; y <= 3 ; y++ ) {
									for(var o = 1 ; o <= 7 ; o++ ) {
										for(var p = 1 ; p <= 3 ; p++ ) {
											asts = asts0 + "" + y+o+p;
											
											var param = {
													"eqpNm" : ssys
													,"aChannelDescr" : asts
													,"zChannelDescr" : asts
													,"rmCase" : "case1"
											}
											httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRmCrsData', param, 'GET', 'getRmCrsDataOne');
											
											
										}
										if(sts == "chk") {
											break;
										}
										
									}
									if(sts == "chk") {
										break;
									}
								}
								if(sts == "chk") {
									sts ="";
									break;
								}
							}
							h= h+2;
							
						}
					}
					*/

					if(sys == sys2) {
						/**
						 * DCS간 연동 없을때
						 */
						$('#'+tangoList).alopexGrid( "cellEdit", aport2, {_index : { row : idx}}, "bportNm");
						$('#'+tangoList).alopexGrid( "cellEdit", aport,  {_index : { row : j}},   "bportNm");
						
						
					//연동포트로 구성 	
					} else { 
						var param = {
								"eqpNmOne" : sys
								,"eqpNmTwo" : sys2
								,"mtsoId" : topMtsoId
						}
						httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getDcsConnInfo', param, 'GET', 'getDcsConnInfo');
						
						if(rs != null && rs.length > 0) {
							
							for(var z = 0 ; z < rs.length; z++ ) {
								var iParam = {
										"aportChnlValOne" : rs[z].aportChnlValOne
										,"aportChnlValTwo" : rs[z].aportChnlValTwo
										,"bportChnlValOne" : rs[z].bportChnlValOne
										,"bportChnlValTwo" : rs[z].bportChnlValTwo
										,"eqpNmOne" : rs[z].eqpNmOne
										,"eqpNmTwo" : rs[z].eqpNmTwo
								}
								httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getidleportchnl', iParam, 'GET', 'getIdlePortChnl');
								
								if(idle != null && idle.length > 0 ) {  
									if(sys == idle[0].aEqpNm) {
										$('#'+tangoList).alopexGrid( "cellEdit", idle[0].aEqpPortChnl, {_index : { row : idx}}, "bportNm");
										$('#'+tangoList).alopexGrid( "cellEdit", idle[0].bEqpPortChnl,  {_index : { row : j}},  "bportNm");
									} else {
										$('#'+tangoList).alopexGrid( "cellEdit", idle[0].bEqpPortChnl,  {_index : { row : idx}}, "bportNm");
										$('#'+tangoList).alopexGrid( "cellEdit", idle[0].aEqpPortChnl,  {_index : { row : j}},   "bportNm");
									}
								}
							}
							
							/*ic = 0 ;
							
							for(var z = 0 ; z < rs.length; z++) {
								tu11 = rs[z].aportChnlValOne.substr(11,2);
								tu12 = rs[z].aportChnlValOne.substr(13,1);
								tu13 = rs[z].aportChnlValOne.substr(14,1);
								tu14 = rs[z].aportChnlValOne.substr(15,1);
								
								tu21 = rs[z].bportChnlValOne.substr(11,2);
								tu22 = rs[z].bportChnlValOne.substr(13,1);
								tu23 = rs[z].bportChnlValOne.substr(14,1);
								tu24 = rs[z].bportChnlValOne.substr(15,1);
								
								tu_11 = rs[z].aportChnlValTwo.substr(11,2); //EQP1   AU4 Port
								
								tu_ = tu11 - tu_11
								
								console.log("tu_ : "+tu_);
								for(var x = tu11.replace(/(^0+)/,"") ; x <= tu21.replace(/(^0+)/,"") ; x++ ) {
									asts0 = rs[z].aportChnlValOne.substr(0,11)+"0"+x;
									var param = {
											"eqpNm" : rs[z].eqpNmOne
											,"capaNm" : "004001"
											,"aChannelDescr" : rs[z].aportChnlValOne.substr(0,11)+"0"+x
											,"zChannelDescr" : rs[z].aportChnlValOne.substr(0,11)+"0"+x
											,"rmCase" : "case1"
									}
									httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRmCrsData', param, 'GET', 'getRmCrsDataTwo');
									
								
									if(rs2c0[0].totalCnt  < 63 ) {
										for(var c = tu12.replace(/(^0+)/,"") ; c <= tu22.replace(/(^0+)/,""); c++) { //1~3
											for(var v = tu13.replace(/(^0+)/,"") ; v <= tu23.replace(/(^0+)/,"") ; v++ ) { // 1~7
												for(var b = tu14.replace(/(^0+)/,"") ; b <= tu24.replace(/(^0+)/,""); b++ ) { // 1~3
													var tmpX = x-tu_;
													tmpX = tmpX+"";
													asts = rs[z].aportChnlValOne.substr(0,11)+"0"+x+""+c+v+b;  // 연동 DCS1
													bsts = rs[z].aportChnlValTwo.substr(0,11)+"0"+tmpX+""+c+v+b;  // 연동 DCS2
													console.log("tmpX : "+tmpX);
													console.log("asts : "+asts );
													console.log("bsts : "+bsts );
													var param = {
															"eqpNmOne" : rs[z].eqpNmOne
															,"eqpNmTwo" : rs[z].eqpNmTwo
															,"aChannelDescr" : asts
															,"zChannelDescr" : bsts
															,"rmCase" : "case2"
													}
													httpRequestConv('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getRmCrsData', param, 'GET', 'getRmCrsDataThree');
													
													ic=ic+1;
													
													if(rs2c[0].totalCnt == 0 ) {  
														if(sys == rs[z].eqpNmOne) {
															$('#'+tangoList).alopexGrid( "cellEdit", asts, {_index : { row : idx}}, "bportNm");
															$('#'+tangoList).alopexGrid( "cellEdit", bsts,  {_index : { row : j}},   "bportNm");
														} else {
															$('#'+tangoList).alopexGrid( "cellEdit", bsts, {_index : { row : idx}}, "bportNm");
															$('#'+tangoList).alopexGrid( "cellEdit", asts,  {_index : { row : j}},   "bportNm");
														}
														sts = "chk";
														break;
													
													}
												} // (1~3)
												if(sts == "chk") {
													break;
												}
											} // (1~7)
											if(sts == "chk") {
												break;
											}
										} // (1~3)
										if(sts == "chk") {
											break;
										}
									}
								}
								if(sts == "chk") {
									sts = "";
									break;
								} else {
									//$('#'+tangoList).alopexGrid( "cellEdit", "연동포트 없음", {_index : { row : idx}}, "bportNm");
									//$('#'+tangoList).alopexGrid( "cellEdit", "연동포트 없음",  {_index : { row : j}},   "bportNm");
								}
								
							}*/
						} else {
							//$('#'+tangoList).alopexGrid( "cellEdit", "연동포트 없음", {_index : { row : idx}}, "bportNm");
							//$('#'+tangoList).alopexGrid( "cellEdit", "연동포트 없음",  {_index : { row : j}},   "bportNm");
						}
					}
				}
			}
		}
	}
	cflineHideProgressBody();
	alertBox('I', "적용되었습니다."); 
/*	callMsgBox('','I', "적용되었습니다.", function(msgId, msgRst){ 
 		if (msgRst == 'Y') {
 			$('#'+tangoList).alopexGrid('hideProgress');
		}
	});*/
}



function successCallbackConv(response, status, jqxhr, flag) {
	if(flag == 'getPortType'){
		rs = response.getPortType;
	}
	if(flag == 'getPortChnlType'){
		rs_ = response.getPortType;
	}
	if(flag == 'getCtpPortType'){
		crs = response.getPortType;
	}
	if(flag == 'getRtData'){
		rtrs = response.getRtPortType;
	}
	if(flag == 'getEngChar'){
		engrs = response.getEngChar;
	}
	if(flag == 'getRmPathName'){
		rpnrs = response.getRmPathName;
	}
	if(flag == 'getTieMgmtList'){
		rs5 = response.getTieMgmtList;
	}
	if(flag == 'getRmCrsData'){
		rs2c0 = response.getRmCrsData;
	}
	if(flag == 'getDcsConnInfo'){
		rs = response.getDcsConnInfo;
	}
	if(flag == 'getIdlePortChnl'){
		idle = response.getIdlePortChnl;
	}
	
		
}

//request 실패시.
function failCallbackConv(response, status, flag){
	if(flag == 'getPortType'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getPortChnlType'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getCtpPortType'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getRtData'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getEngChar'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getRmPathName'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getTieMgmtList'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getRmCrsData'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getDcsConnInfo'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'getIdlePortChnl'){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
}


var httpRequestConv = function(Url, Param, Method, Flag ) {	
	Tango.ajax({
		url : Url, //URL 기존 처럼 사용하시면 됩니다.
		data : Param, //data가 존재할 경우 주입
		method : Method, //HTTP Method
		flag : Flag
		,async:false
	}).done(successCallbackConv)
	  .fail(failCallbackConv);
	
	
/*	$.ajax({
		type : Method
		,url : "/"+Url
		,data : Param
		,async : false
		,success : successCallbackConv(responseText,"" , "", Flag)
		,fail : failCallbackConv(responseText,"" , "", Flag)
		,complete:function() {
			$('#'+convList).progress();
			console.log("a");
		}
		,beforeSend:function() {
			$('#'+convList).progress();
			console.log("b");
		}
	});
	*/
}



//문자열 왼쪽부터 자르기
function left(str , n) {
	if(n<=0) {
		return "";
	} else if(n>String(str).length) {
		return str;
	} else {
		return String(str).substring(0,n);
	}
}

//문자열 오른쪽부터 자르기
function right(str , n) {
	if(n<=0) {
		return "";
	} else if(n>String(str).length) {
		return str;
	} else {
		var iLen = String(str).length;
		return String(str).substring(iLen,iLen-n);
	}
}



//RT Port Name Input 
function openRtPortNamePop(){
	cflineHideProgressBody();
   	var urlPath = $('#ctx').val();
   	if(nullToEmpty(urlPath) ==""){
   		urlPath = "/tango-transmission-web";
   	}
 /*  	var dataParam = {
   			"eqpNm" : gridDataVal["eqpNm#" + fieldNumVal]
   			,"portChnl" : gridDataVal["aportNm#" + fieldNumVal]
   			,"trunkNm" : gridDataVal["useTrkNtwkLineNm#" + fieldNumVal]
   	}*/
   	var RmIdlenessListPop = $a.popup({
		popid: "OmsRtPortInputPop",
	  	title: "RT Port Name 입력"/* RT Port Name 입력 */,
		url: $('#ctx').val()+'/configmgmt/cfline/OmsRtPortInputPop.do',
		//data : dataParam,
	  	iframe:true,
		modal: true,
		movable:true,
		//windowpopup : false,
		movable:true,
		width : 320,
		height : 200,
		callback:function(data){
			if(data != null) {
				rtPortName = data;
				$("#"+convList).alopexGrid('dataEmpty');
				setConvGridByType();
			} 
//			//다른 팝업에 영향을 주지않기 위해
//			$.alopex.popup.result = "";
		}  
   		,xButtonClickCallback : function(el){
			alertBox('I', "입력완료를 눌러주세요.");  
			return false;
		}
	});
   	
}
