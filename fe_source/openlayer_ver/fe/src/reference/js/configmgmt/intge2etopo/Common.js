//장비 아이콘
function getEqpIcon(eqpRoleDivCd, flag){
	var src = "";
	var srcPath = "";

	if(flag == "S"){
		srcPath = "/resources/images/topology/equipment_iconS_";
	}else{
		srcPath = "/resources/images/topology/equipment_icon_";
	}

	if(eqpRoleDivCd == "01"){ src = getContextPath() + srcPath + "L2SW.png";}
	else if(eqpRoleDivCd == "02"){ src = getContextPath() + srcPath + "L2SW.png";}
	else if(eqpRoleDivCd == "03"){ src = getContextPath() + srcPath + "L3SW.png";}
	else if(eqpRoleDivCd == "04"){ src = getContextPath() + srcPath + "IBC.png";}
	else if(eqpRoleDivCd == "05"){ src = getContextPath() + srcPath + "IBR.png";}
	else if(eqpRoleDivCd == "06"){ src = getContextPath() + srcPath + "IBR.png";}
	else if(eqpRoleDivCd == "07"){ src = getContextPath() + srcPath + "PTS.png";}
	else if(eqpRoleDivCd == "08"){ src = getContextPath() + srcPath + "ROADM.png";}
	else if(eqpRoleDivCd == "09"){ src = getContextPath() + srcPath + "IP장비.png";}
	else if(eqpRoleDivCd == "10"){ src = getContextPath() + srcPath + "WIFI.png";}
	else if(eqpRoleDivCd == "11"){ src = getContextPath() + srcPath + "FDF.png";}
	else if(eqpRoleDivCd == "12"){ src = getContextPath() + srcPath + "광장비.png";}
	else if(eqpRoleDivCd == "14"){ src = getContextPath() + srcPath + "WDM.png";}
	else if(eqpRoleDivCd == "15"){ src = getContextPath() + srcPath + "DWDM.png";}
	else if(eqpRoleDivCd == "16"){ src = getContextPath() + srcPath + "CWDM.png";}
	else if(eqpRoleDivCd == "17"){ src = getContextPath() + srcPath + "PE.png";}
	else if(eqpRoleDivCd == "18"){ src = getContextPath() + srcPath + "RINGMUX.png";}
	else if(eqpRoleDivCd == "19"){ src = getContextPath() + srcPath + "RINGMUX.png";}
	else if(eqpRoleDivCd == "20"){ src = getContextPath() + srcPath + "DU.png";}
	else if(eqpRoleDivCd == "21"){ src = getContextPath() + srcPath + "OTN.png";}
	else if(eqpRoleDivCd == "23"){ src = getContextPath() + srcPath + "DU.png";}
	else if(eqpRoleDivCd == "25"){ src = getContextPath() + srcPath + "RU.png";}
	else if(eqpRoleDivCd == "26"){ src = getContextPath() + srcPath + "RU.png";}
	else if(eqpRoleDivCd == "27"){ src = getContextPath() + srcPath + "중계기.png";}
	else if(eqpRoleDivCd == "28"){ src = getContextPath() + srcPath + "중계기.png";}
	else if(eqpRoleDivCd == "34"){ src = getContextPath() + srcPath + "WIFI.png";}
	else if(eqpRoleDivCd == "41"){ src = getContextPath() + srcPath + "DU.png";}
	else if(eqpRoleDivCd == "42"){ src = getContextPath() + srcPath + "중계기.png";}
	else if(eqpRoleDivCd == "43"){ src = getContextPath() + srcPath + "중계기.png";}
	else if(eqpRoleDivCd == "101"){ src = getContextPath() + srcPath + "RT.png";}
	else if(eqpRoleDivCd == "111"){ src = getContextPath() + srcPath + "IP장비.png";}
	else if(eqpRoleDivCd == "112"){ src = getContextPath() + srcPath + "IP장비.png";}
	else if(eqpRoleDivCd == "113"){ src = getContextPath() + srcPath + "광장비.png";}
	else if(eqpRoleDivCd == "114"){ src = getContextPath() + srcPath + "IP장비.png";}
	else if(eqpRoleDivCd == "156"){ src = getContextPath() + srcPath + "IP장비.png";}
	else if(eqpRoleDivCd == "162"){ src = getContextPath() + srcPath + "OFD.png";}
	else if(eqpRoleDivCd == "175"){ src = getContextPath() + srcPath + "COUPLER.png";}
	else if(eqpRoleDivCd == "177"){ src = getContextPath() + srcPath + "OFD.png";}
	else if(eqpRoleDivCd == "178"){ src = getContextPath() + srcPath + "OFD.png";}
	else if(eqpRoleDivCd == "179"){ src = getContextPath() + srcPath + "OFD.png";}
	else if(eqpRoleDivCd == "182"){ src = getContextPath() + srcPath + "OFD.png";}
	else if(eqpRoleDivCd == "181"){ src = getContextPath() + srcPath + "COUPLER.png";}
	else if(eqpRoleDivCd == "CBNT"){ src = getContextPath() + srcPath + "CBNT.png";}
	else if(eqpRoleDivCd == " "){
		src = getContextPath() + srcPath + "DUMMY.png";
		}
	else { src = getContextPath() + srcPath + "ETC.png";}

	return src;
}

//국사 아이콘
function getMtsoIcon(mtsoTypCd, flag){
	var src = "";
	var srcPath = "";

	if(flag == "S"){
		srcPath = "/resources/images/topology/mtso_iconS_";
	}else{
		srcPath = "/resources/images/topology/mtso_icon_";
	}

	if(mtsoTypCd == "1"){ src = getContextPath() + srcPath + "TMOF.png";}
	else if(mtsoTypCd == "2"){ src = getContextPath() + srcPath + "CMTSO.png";}
	else if(mtsoTypCd == "3"){ src = getContextPath() + srcPath + "CMTSO.png";}
	else { src = getContextPath() + srcPath + "SMTSO.png";}

	return src;
}

function viewPort(){
	var diagram = myDiagram;
    var viewPort = true;

    if ($("input:checkbox[id='viewPort']").is(":checked")){
   	 viewPort = true;
    }else{
   	 viewPort = false;
    }

	diagram.links.each(function(link){
		link.findObject("lftPort").visible = viewPort;
		link.findObject("rghtPort").visible = viewPort;
		link.findObject("centerCapa").visible = viewPort;
	});
}

function viewNtwk(){
	var diagram = myDiagram;
    var viewNtwk = true;

    if ($("input:checkbox[id='viewNtwk']").is(":checked")){
   	 viewNtwk = true;
    }else{
   	 viewNtwk = false;
    }

	diagram.links.each(function(link){
		link.findObject("centerTrk").visible = viewNtwk;
		link.findObject("centerRing").visible = viewNtwk;
		link.findObject("centerWdm").visible = viewNtwk;
	});
}
