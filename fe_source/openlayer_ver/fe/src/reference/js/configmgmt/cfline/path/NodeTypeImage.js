var g_NodeTypeImagePath = getContextPath() + "/resources/images/topology/";
   
function nodeTypeImage(eqpRoleDivCd) {
	if(eqpRoleDivCd == '01') return g_NodeTypeImagePath + "L2-SW_01.png";
	else if(eqpRoleDivCd == '02') return g_NodeTypeImagePath + "L2-SW_01.png";
	else if(eqpRoleDivCd == '03') return g_NodeTypeImagePath + "L3-SW_01.png";
	else if(eqpRoleDivCd == '04') return g_NodeTypeImagePath + "IBC_01.png";
	else if(eqpRoleDivCd == '05') return g_NodeTypeImagePath + "IBR_01.png";
	else if(eqpRoleDivCd == '06') return g_NodeTypeImagePath + "IBRR_01.png";
	else if(eqpRoleDivCd == '07') return g_NodeTypeImagePath + "PTS_01.png";
	else if(eqpRoleDivCd == '15') return g_NodeTypeImagePath + "DWDM_01.png";
	else if(eqpRoleDivCd == '18') return g_NodeTypeImagePath + "SCAN_WM_01.png";
	else if(eqpRoleDivCd == '21') return g_NodeTypeImagePath + "OTN_01.png";
//    	else if(eqpRoleDivCd == '23') return g_NodeTypeImagePath + "DU_01.png";
	else if(eqpRoleDivCd == '25') return g_NodeTypeImagePath + "RU_01.png";
	else if(eqpRoleDivCd == '101') return g_NodeTypeImagePath + "RT_01.png";
	else return g_NodeTypeImagePath + "PG_01.png";
}


function nodeTypeImageOn(eqpRoleDivCd) {
	if(eqpRoleDivCd == '01') return g_NodeTypeImagePath + "L2-SW_01_ON.png";
	else if(eqpRoleDivCd == '02') return g_NodeTypeImagePath + "L2-SW_01_ON.png";
	else if(eqpRoleDivCd == '03') return g_NodeTypeImagePath + "L3-SW_01_ON.png";
	else if(eqpRoleDivCd == '04') return g_NodeTypeImagePath + "IBC_01_ON.png";
	else if(eqpRoleDivCd == '05') return g_NodeTypeImagePath + "IBR_01_ON.png";
	else if(eqpRoleDivCd == '06') return g_NodeTypeImagePath + "IBRR_01_ON.png";
	else if(eqpRoleDivCd == '07') return g_NodeTypeImagePath + "PTS_01_ON.png";
	else if(eqpRoleDivCd == '15') return g_NodeTypeImagePath + "DWDM_01_ON.png";
	else if(eqpRoleDivCd == '18') return g_NodeTypeImagePath + "SCAN_WM_01_ON.png";
	else if(eqpRoleDivCd == '21') return g_NodeTypeImagePath + "OTN_01_ON.png";
//    	else if(eqpRoleDivCd == '23') return g_NodeTypeImagePath + "DU_01_ON.png";
	else if(eqpRoleDivCd == '25') return g_NodeTypeImagePath + "RU_01_ON.png";
	else if(eqpRoleDivCd == '101') return g_NodeTypeImagePath + "RT_01_ON.png";
	else return g_NodeTypeImagePath + "PG_01_ON.png";
}
