/**
 * ServiceLineSearch.js
 * 
 * @author park. i. h.
 * @date 2016.11.14
 * @version 1.0
 */
// 기타회선 
var makeDiv000 = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {	
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['businessMan'] /* 사업자 */  + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	 <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="trkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['trunkNm'] /*트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="trkNm" id="trkNm" data-bind="value: trkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineCapaCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineCapaCd" id="lineCapaCd" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="mgmtPostCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['managementPost'] /*관리포스트*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="mgmtPostCd" id="mgmtPostCd" data-bind="options:data, selectedOptions: mgmtPostCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  	</div>';	
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}
//기지국회선 전체
var makeDivAll = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {	
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['businessMan'] /* 사업자 */  + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	 <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="trkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['trunkNm'] /*트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="trkNm" id="trkNm" data-bind="value: trkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftChnlNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westChnl'] /*WEST채널명(좌채널명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftChnlNm" id="lftChnlNm" data-bind="value: lftChnlNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 ">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 ">';
	divHtml = divHtml + '	   <label for="rghtChnlNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastChnl'] /*EAST채널명(우채널명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtChnlNm" id="rghtChnlNm" data-bind="value: rghtChnlNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineCapaCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineCapaCd" id="lineCapaCd" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="mgmtPostCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['managementPost'] /*관리포스트*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="mgmtPostCd" id="mgmtPostCd" data-bind="options:data, selectedOptions: mgmtPostCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  	</div>';	
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}

/*
 * 교환기간, 상호접속간, 기지국간(1X, 2G 등)
 * 상호접속, 교환기에만 RTE_NAME, LSN(SG중요회선) 조회조건 추가 - 2023-12-20
 */
var makeDiv001 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"'; 
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['businessMan'] /* 사업자 */ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="trkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['trunkNm'] /*트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="trkNm" id="trkNm" data-bind="value: trkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineUsePerdTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineUsePerdTypCd" id="lineUsePerdTypCd" data-bind="options:data, selectedOptions: lineUsePerdTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westChnl'] /*WEST채널명(좌채널명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftChnlNm" id="lftChnlNm" data-bind="value: lftChnlNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2" Clearboth>';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2" Clearboth>';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastChnl'] /*EAST채널명(우채널명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtChnlNm" id="rghtChnlNm" data-bind="value: rghtChnlNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineCapaCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineCapaCd" id="lineCapaCd" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="uprSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['upperSystemName'] /*상위시스템명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="uprSystmNm" id="uprSystmNm" data-bind="value: uprSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lowSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lowSystemName'] /*하위시스템명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lowSystmNm" id="lowSystmNm" data-bind="value: lowSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="lineMgmtGrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineMgmtGrCd" id="lineMgmtGrCd" data-bind="options:data, selectedOptions: lineMgmtGrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	if(scdVal!="") {
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="tie">';
		divHtml = divHtml + '		 <span class="Label label">TIE</span>';	
		divHtml = divHtml + '		 <input type="text" name="tie" id="tie" data-bind="value: tie"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';	
		divHtml = divHtml + '  <div class="condition ty2">';
		divHtml = divHtml + '		<label for="srsLineYn">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/ + '</span>';	
		divHtml = divHtml + '			<div class="Divselect divselect w220">';	
		divHtml = divHtml + '				<select name="srsLineYn" id="srsLineYn" data-bind="options:data, selectedOptions: srsLineYn" data-bind-option="value:text" data-type="select" >';									
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '	</div>';	
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';		
	} else {
		divHtml = divHtml + '  <div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lowSystmNm">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lowSystemName'] /*하위시스템명*/ + '</span>';	
		divHtml = divHtml + '		 <input type="text" name="lowSystmNm" id="lowSystmNm" data-bind="value: lowSystmNm"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';
		divHtml = divHtml + '  <div class="condition ty2">';
		divHtml = divHtml + '		<label for="srsLineYn">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/ + '</span>';	
		divHtml = divHtml + '			<div class="Divselect divselect w220">';	
		divHtml = divHtml + '				<select name="srsLineYn" id="srsLineYn" data-bind="options:data, selectedOptions: srsLineYn" data-bind-option="value:text" data-type="select" >';									
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '	</div>';	
		divHtml = divHtml + '  <div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';	
	}
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(scdVal=="002" || scdVal=="010" || scdVal=="011" || scdVal=="012" || scdVal=="013" || scdVal=="014"){  // 기지국간
		divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="cmsId">';
		divHtml = divHtml + '		 <span class="Label label">CMSID</span>';	
		divHtml = divHtml + '		 <input type="text" name="cmsId" id="cmsId" data-bind="value: cmsId"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="btsNm">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['btsName'] /*기지국사*/ + '</span>';	
		divHtml = divHtml + '		 <input type="text" name="btsNm" id="btsNm" data-bind="value: btsNm"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';
	}	
	/*
	 * 상호접속, 교환기에만
	 * RTE_NAME, LSN(SG중요회선) 조회조건 추가 - 2023-12-20
	 */
	if(scdVal=="001" || scdVal=="003") {
		divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="rteName">';
		divHtml = divHtml + '		 <span class="Label label">RTENAME</span>';	
		divHtml = divHtml + '		 <input type="text" name="rteName" id="rteName" data-bind="value: rteName"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lsn">';
		divHtml = divHtml + '		 <span class="Label label">SG(중요회선)</span>';	
		divHtml = divHtml + '		 <input type="text" name="lsn" id="lsn" data-bind="value: lsn"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}

//5G 회선 
var makeDiv030 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnNetDivCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['networkDivision'] /*망구분*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnNetDivCd" id="svlnNetDivCd" data-bind="options:data, selectedOptions: svlnNetDivCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="pktTrkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['packetTrunkName'] /*패킷트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="pktTrkNm" id="pktTrkNm" data-bind="value: pktTrkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="vlanId">';
	divHtml = divHtml + '		 <span class="Label label">VLAN</span>';	
	divHtml = divHtml + '		 <input type="text" name="vlanId" id="vlanId" data-bind="value: vlanId"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="mainSubEqpIpAddr">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['mainSubEqpIp'] /*메인/서브장비IP*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="mainSubEqpIpAddr" id="mainSubEqpIpAddr" data-bind="value: mainSubEqpIpAddr"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="uprMtsoIdNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['upperMtso'] /*상위국사*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="uprMtsoIdNm" id="uprMtsoIdNm" data-bind="value: uprMtsoIdNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lowMtsoIdNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lowerMtso'] /*하위국사*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lowMtsoIdNm" id="lowMtsoIdNm" data-bind="value: lowMtsoIdNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="">';
	divHtml = divHtml + '		 <span class="Label label">L2_IP</span>';
	divHtml = divHtml + '		 <input type="text" name="ltwoIp" id="ltwoIp" data-bind="value: ltwoIp"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '</div>';
	return divHtml;
}

// LTE 회선 
var makeDiv016 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnNetDivCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['networkDivision'] /*망구분*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnNetDivCd" id="svlnNetDivCd" data-bind="options:data, selectedOptions: svlnNetDivCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="pktTrkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['packetTrunkName'] /*패킷트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="pktTrkNm" id="pktTrkNm" data-bind="value: pktTrkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="vlanId">';
	divHtml = divHtml + '		 <span class="Label label">VLAN</span>';	
	divHtml = divHtml + '		 <input type="text" name="vlanId" id="vlanId" data-bind="value: vlanId"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="mainSubEqpIpAddr">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['mainSubEqpIp'] /*메인/서브장비IP*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="mainSubEqpIpAddr" id="mainSubEqpIpAddr" data-bind="value: mainSubEqpIpAddr"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="uprMtsoIdNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['upperMtso'] /*상위국사*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="uprMtsoIdNm" id="uprMtsoIdNm" data-bind="value: uprMtsoIdNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lowMtsoIdNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lowerMtso'] /*하위국사*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lowMtsoIdNm" id="lowMtsoIdNm" data-bind="value: lowMtsoIdNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="">';
	divHtml = divHtml + '		 <span class="Label label">L2_IP</span>';
	divHtml = divHtml + '		 <input type="text" name="ltwoIp" id="ltwoIp" data-bind="value: ltwoIp"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}

//IP전송로(WCDMA)
var makeDiv020 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="vlanId">';
	divHtml = divHtml + '		 <span class="Label label">VLAN</span>';	
	divHtml = divHtml + '		 <input type="text" name="vlanId" id="vlanId" data-bind="value: vlanId"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="notUseLine">';
	divHtml = divHtml + '		 	<label class="ImageCheckbox">';
	divHtml = divHtml + '				<input class="Checkbox" type="checkbox" name="notUseLine" id="notUseLine" data-bind="checked: notUseLine" value="Y"/>' + "트렁크 해지된 회선만 조회" /* 트렁크 해지된 회선만 조회 */;
	divHtml = divHtml + '		 	</label>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="cuid">';
	divHtml = divHtml + '		 <span class="Label label">CUID</span>';	
	divHtml = divHtml + '		 <input type="text" name="cuid" id="cuid" data-bind="value: cuid" class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2  Clearboth">';
	divHtml = divHtml + '		<label for="autoClctYn">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lnoCollectionYesOrNo'] /* 선번수집여부 */ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="autoClctYn" id="autoClctYn" data-bind="options:data, selectedOptions: autoClctYn" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '</div>';
	return divHtml;
}

// 중계기(광코어)
var makeDiv101 = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="optlShreRepSvlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['representaionLineNumber'] /*대표회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="optlShreRepSvlnNo" id="optlShreRepSvlnNo" data-bind="value: optlShreRepSvlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	//divHtml = divHtml + '<div class="condition ty2">';
	//divHtml = divHtml + '		&nbsp;&nbsp;';
//	divHtml = divHtml + '		<label for="ocmChk">';
//	divHtml = divHtml + '			<label class="ImageCheckbox">';
//	divHtml = divHtml + '				<input class="Checkbox" type="checkbox" name="ocmChk" id="ocmChk" data-bind="checked: ocmChk" value="Y" checked="checked"/> 대표회선보기';
//	divHtml = divHtml + '			</label>';
//	divHtml = divHtml + '		</label>';
	//divHtml = divHtml + '</div>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['commBizrMan'] /*통신사업자*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="lesTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['networkType'] /*망유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lesTypCd" id="lesTypCd" data-bind="options:data, selectedOptions: lesTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="netCfgMeansCd">';
	divHtml = divHtml + '			<span class="Label label">' + '링구성방식' /* 링구성방식*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="netCfgMeansCd" id="netCfgMeansCd" data-bind="options:data, selectedOptions: netCfgMeansCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2" >';
	divHtml = divHtml + '	   <label for="uprIntgFcltsCd">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['bmtsoIntgFcltsCd'] /*기지국통합시설코드*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="uprIntgFcltsCd" id="uprIntgFcltsCd" data-bind="value: uprIntgFcltsCd"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lowIntgFcltsCd">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['repeaterIntegrationFacilitiesCode'] /*중계기통합시설코드*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lowIntgFcltsCd" id="lowIntgFcltsCd" data-bind="value: lowIntgFcltsCd"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="cascadeYn">';
	divHtml = divHtml + '			<span class="Label label">' + 'CASCADING 여부' /* CASCADING 여부*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="cascadeYn" id="cascadeYn" data-bind="options:data, selectedOptions: cascadeYn" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				      <option value ="">전체</option>';									
	divHtml = divHtml + '				      <option value ="Y">Y</option>';																
	divHtml = divHtml + '				      <option value ="N">N</option>';								
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 ">';
	divHtml = divHtml + '	   <label for="lineAppltNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';	
	divHtml = divHtml + '	<div class="condition ty2 ">';
	divHtml = divHtml + '		<label for="appltDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['applicationDate'] /*청약일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="appltDt" id="appltDt" data-bind="value: appltDt">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="lineOpenDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineOpeningDate'] /*회선개통일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="lineOpenDtStart" id="lineOpenDtStart" data-bind="value: lineOpenDtStart">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="eqpDivCd">';
	divHtml = divHtml + '			<span class="Label label">' + 'S-MUX ' + cflineMsgArray['equipmentDivision'] /*장비구분*/ + '</span>';
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="eqpDivCd" id="eqpDivCd" data-bind="options:data, selectedOptions: eqpDivCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	//TODO Access FrontHaul관련 ONS검색조건 추가 2023-11
	divHtml = divHtml + '<div class="condition ty2">';
	divHtml = divHtml + '		<label for="onsHdofcCd">';
	divHtml = divHtml + '			<span class="Label label">' + " ONS " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
	divHtml = divHtml + '			<div class="Divselect divselect">';
	divHtml = divHtml + '				<select name="onsHdofcCd" id="onsHdofcCd" data-bind="options:data, selectedOptions: onsHdofcCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '		<label for="onsTeamCd">';
	divHtml = divHtml + '			<div class="Divselect divselect">';
	divHtml = divHtml + '				<select name="onsTeamCd" id="onsTeamCd" data-bind="options:data, selectedOptions: onsTeamCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '</div>';
	
	// 마지막 div
	divHtml = divHtml + '</div>';
	return divHtml;
}
// Wifi
var makeDiv102 = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['commBizrMan'] /*통신사업자*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="uprIntgFcltsCd">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['uprIntgFcltsCd'] /*상위통합시설코드*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="uprIntgFcltsCd" id="uprIntgFcltsCd" data-bind="value: uprIntgFcltsCd"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="dnrSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['donorSystemName'] /*도너시스템명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="dnrSystmNm" id="dnrSystmNm" data-bind="value: dnrSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rmteSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['remoteSystemName'] /*리모트시스템명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="rmteSystmNm" id="rmteSystmNm" data-bind="value: rmteSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="lesTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['rentType'] /*임차유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lesTypCd" id="lesTypCd" data-bind="options:data, selectedOptions: lesTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';		
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}
// RU
var makeDiv103 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="onsHdofcCd">';
	divHtml = divHtml + '			<span class="Label label">ONS ' + cflineCommMsgArray['hdofc'] /*본부*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="onsHdofcCd" id="onsHdofcCd" data-bind="options:data, selectedOptions: onsHdofcCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="onsTeamCd">';
	divHtml = divHtml + '			<span class="Label label">ONS ' + cflineCommMsgArray['team'] /*팀*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="onsTeamCd" id="onsTeamCd" data-bind="options:data, selectedOptions: onsTeamCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="duRuNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['duRuNm'] /*DU/RU명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="duRuNm" id="duRuNm" data-bind="value: duRuNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="serNoVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serialNumber'] /*시리얼번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="serNoVal" id="serNoVal" data-bind="value: serNoVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';		
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '</div>';
	return divHtml;
}
// 기업회선 
var makeDiv005 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"'; 
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';
	divHtml = divHtml + '   <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['rentBusinessMan'] /*임차사업자*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '   <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="scrbSrvcMgmtNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['subscribeServiceManagementNumber'] /*가입서비스관리번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="scrbSrvcMgmtNo" id="scrbSrvcMgmtNo" data-bind="value: scrbSrvcMgmtNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="srvcMgmtNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceManagementNumber'] /*서비스관리번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="srvcMgmtNo" id="srvcMgmtNo" data-bind="value: srvcMgmtNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';	
	divHtml = divHtml + '   <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="b2bCustNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['businessToBusinessCustomerName'] /*B2B고객명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="b2bCustNm" id="b2bCustNm" data-bind="value: b2bCustNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';	
//	if(scdVal=="006" || scdVal=="007" || scdVal=="008" || scdVal=="019" || scdVal=="022" || scdVal=="023"){   //  B2B회선 - SKT
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="ctrtCustNm">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ctrtCustNm'] /* 계약고객명*/ + '</span>';	
		divHtml = divHtml + '		 <input type="text" name="ctrtCustNm" id="ctrtCustNm" data-bind="value: ctrtCustNm"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';
		divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="leslNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
		divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  </div>';		
//	}
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="trkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['trunkNm'] /*트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="trkNm" id="trkNm" data-bind="value: trkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineUsePerdTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineUsePerdTypCd" id="lineUsePerdTypCd" data-bind="options:data, selectedOptions: lineUsePerdTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineCapaCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineCapaCd" id="lineCapaCd" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';		
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="mgmtPostCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['managementPost'] /*관리포스트*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="mgmtPostCd" id="mgmtPostCd" data-bind="options:data, selectedOptions: mgmtPostCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineMgmtGrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineMgmtGrCd" id="lineMgmtGrCd" data-bind="options:data, selectedOptions: lineMgmtGrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="coLineVrfYn">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['mgmtObj'] /*관리대상*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="coLineVrfYn" id="coLineVrfYn" data-bind="options:data, selectedOptions: coLineVrfYn" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="lineOpenDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineOpeningDate'] /*회선개통일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="lineOpenDtStart" id="lineOpenDtStart" data-bind="value: lineOpenDtStart">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    ~ <input type="text" name="lineOpenDtEnd" id="lineOpenDtEnd" data-bind="value: lineOpenDtEnd">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';	
//	if(scdVal=="009" || scdVal=="021"){   // B2B회선 - SKB
//		divHtml = divHtml + '	<div class="condition ty2">';
//		divHtml = divHtml + '		<label for="lineStatChgDt">';
//		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineStatusChangeDate'] /*회선상태변경일자*/ + '</span>';
//		divHtml = divHtml + '		    <div class="Daterange daterange">';
//		divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
//		divHtml = divHtml + '			    <input type="text" name="lineStatChgDtStart" id="lineStatChgDtStart" data-bind="value: lineStatChgDtStart">';
//		divHtml = divHtml + '			    </div>';
//		divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
//		divHtml = divHtml + '			    ~ <input type="text" name="lineStatChgDtEnd" id="lineStatChgDtEnd" data-bind="value: lineStatChgDtEnd">';
//		divHtml = divHtml + '			    </div>';
//		divHtml = divHtml + '		    </div>';									
//		divHtml = divHtml + '		</label>';						
//		divHtml = divHtml + '	</div>';
//		
//	}
//	if(scdVal=="006" || scdVal=="007" || scdVal=="008" || scdVal=="019" || scdVal=="022" || scdVal=="023"){   //  B2B회선 - SKT
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '		<label for="srsLineYn">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/ + '</span>';	
		divHtml = divHtml + '			<div class="Divselect divselect w220">';	
		divHtml = divHtml + '				<select name="srsLineYn" id="srsLineYn" data-bind="options:data, selectedOptions: srsLineYn" data-bind-option="value:text" data-type="select" >';									
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '	</div>';	
//	}
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lowSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="sktLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['sktLineNo'] /*SKT 회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="sktLineIdVal" id="sktLineIdVal" data-bind="value: sktLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';
	}
	if(mgmtVal=="SKT"){
		divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '		<label for="lnoInsDt">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lnoInsDt'] + '</span>';
		divHtml = divHtml + '		    <div class="Daterange daterange">';
		divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
		divHtml = divHtml + '			    <input type="text" name="lnoInsDtStart" id="lnoInsDtStart" data-bind="value: lnoInsDtStart">';
		divHtml = divHtml + '			    </div>';
		divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
		divHtml = divHtml + '			    ~ <input type="text" name="lnoInsDtEnd" id="lnoInsDtEnd" data-bind="value: lnoInsDtEnd">';
		divHtml = divHtml + '			    </div>';
		divHtml = divHtml + '		    </div>';					
		divHtml = divHtml + '	</div>';	
		divHtml = divHtml + '	<div class="condition ty2">';
		divHtml = divHtml + '		<label for="lnoModDt">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lnoModDt'] + '</span>';
		divHtml = divHtml + '		    <div class="Daterange daterange">';
		divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
		divHtml = divHtml + '			    <input type="text" name="lnoModDtStart" id="lnoModDtStart" data-bind="value: lnoModDtStart">';
		divHtml = divHtml + '			    </div>';
		divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
		divHtml = divHtml + '			    ~ <input type="text" name="lnoModDtEnd" id="lnoModDtEnd" data-bind="value: lnoModDtEnd">';
		divHtml = divHtml + '			    </div>';
		divHtml = divHtml + '		    </div>';									
		divHtml = divHtml + '		</label>';						
		divHtml = divHtml + '	</div>';	
	}
	
	divHtml = divHtml + '</div>';
	return divHtml;
}

//가입자망 
var makeDiv201 = function(styleStr, scdVal, mgmtVal) {	
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
//	divHtml = divHtml + '	<div class="condition ty2">';
//	divHtml = divHtml + '		<label for="svlnTypCd">';
//	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
//	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
//	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
//	divHtml = divHtml + '				</select>';
//	divHtml = divHtml + '				<span></span>';
//	divHtml = divHtml + '			</div>';
//	divHtml = divHtml + '		</label>';
//	divHtml = divHtml + '	</div>';		
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="srvcMgmtNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceManagementNumber'] /*서비스관리번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="srvcMgmtNo" id="srvcMgmtNo" data-bind="value: srvcMgmtNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';	
	divHtml = divHtml + '   <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';
	divHtml = divHtml + '   <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '   </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="lineUsePerdTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineUsePerdTypCd" id="lineUsePerdTypCd" data-bind="options:data, selectedOptions: lineUsePerdTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineMgmtGrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineMgmtGrCd" id="lineMgmtGrCd" data-bind="options:data, selectedOptions: lineMgmtGrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';		
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}
// (구)Nits회선  
var makeDiv105 = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['commBizrMan'] /*통신사업자*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="optlShreRepSvlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['representaionLineNumber'] /*대표회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="optlShreRepSvlnNo" id="optlShreRepSvlnNo" data-bind="value: optlShreRepSvlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="uprIntgFcltsCd">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['uprIntgFcltsCd'] /*상위통합시설코드*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="uprIntgFcltsCd" id="uprIntgFcltsCd" data-bind="value: uprIntgFcltsCd"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="dnrSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['donorSystemName'] /*도너시스템명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="dnrSystmNm" id="dnrSystmNm" data-bind="value: dnrSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rmteSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['remoteSystemName'] /*리모트시스템명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="rmteSystmNm" id="rmteSystmNm" data-bind="value: rmteSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lesTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['rentType'] /*임차유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lesTypCd" id="lesTypCd" data-bind="options:data, selectedOptions: lesTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] /*임차회선번호*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="appltDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['applicationDate'] /*청약일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="appltDt" id="appltDt" data-bind="value: appltDt">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineOpenDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineOpeningDate'] /*회선개통일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="lineOpenDtStart" id="lineOpenDtStart" data-bind="value: lineOpenDtStart">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2 Clearboth">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}

//중계기정합장치회선
var makeDiv061 = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['commBizrMan'] /*통신사업자*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '  <div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="uprIntgFcltsCd">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['uprIntgFcltsCd'] /*상위통합시설코드*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="uprIntgFcltsCd" id="uprIntgFcltsCd" data-bind="value: uprIntgFcltsCd"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lowIntgFcltsCd">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lowIntgFcltsCd'] /*하위통합시설코드*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lowIntgFcltsCd" id="lowIntgFcltsCd" data-bind="value: lowIntgFcltsCd"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="dnrSystmNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['donorSystemName'] /*도너시스템명*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="dnrSystmNm" id="dnrSystmNm" data-bind="value: dnrSystmNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2  Clearboth">';
	divHtml = divHtml + '		<label for="lesTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['networkType'] /*망유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lesTypCd" id="lesTypCd" data-bind="options:data, selectedOptions: lesTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
/*	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] 임차회선번호 + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';*/
	divHtml = divHtml + '	<div class="condition ty2 w220">';
	divHtml = divHtml + '		<label for="appltDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['applicationDate'] /*청약일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="appltDt" id="appltDt" data-bind="value: appltDt">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2 ">';
	divHtml = divHtml + '		<label for="lineOpenDt">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineOpeningDate'] /*회선개통일자*/ + '</span>';
	divHtml = divHtml + '		    <div class="Daterange daterange">';
	divHtml = divHtml + '		    	<div class="Startdate Dateinput" data-default-date="false">';
	divHtml = divHtml + '			    <input type="text" name="lineOpenDtStart" id="lineOpenDtStart" data-bind="value: lineOpenDtStart">';
	divHtml = divHtml + '			    </div>';
	divHtml = divHtml + '		    </div>';									
	divHtml = divHtml + '		</label>';						
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2" style="display: none;">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';		
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2" style="display: none;">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}

//DCN망
var makeDiv060 = function(styleStr, scdVal, mgmtVal, bonbuTeamItemYn) {	
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnTypCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnTypCd" id="svlnTypCd" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['businessMan'] /* 사업자 */  + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bizrCd" id="bizrCd" data-bind="options:data, selectedOptions: bizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	 <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="trkNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['trunkNm'] /*트렁크명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="trkNm" id="trkNm" data-bind="value: trkNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="ringNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['ringName'] /*링명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="ringNm" id="ringNm" data-bind="value: ringNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="lineCapaCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="lineCapaCd" id="lineCapaCd" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
/*	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="leslNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['leaseLineNumber'] 임차회선번호 + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="leslNo" id="leslNo" data-bind="value: leslNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  	</div>';*/
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="mgmtPostCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['managementPost'] /*관리포스트*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="mgmtPostCd" id="mgmtPostCd" data-bind="options:data, selectedOptions: mgmtPostCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '	<div class="condition ty2" style="display: none;">';
	divHtml = divHtml + '	   <label for="lnkgLineIdVal">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="lnkgLineIdVal" id="lnkgLineIdVal" data-bind="value: lnkgLineIdVal"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  	</div>';	
	if(mgmtVal!="SKB"){
		divHtml = divHtml + '  	<div class="condition ty2" style="display: none;">';
		divHtml = divHtml + '	   <label for="lineAppltNo">';
		divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['applicationNumber']  /*청약번호*/ + '</span>';
		divHtml = divHtml + '		 <input type="text" name="lineAppltNo" id="lineAppltNo" data-bind="value: lineAppltNo"  class="Textinput textinput w220">';
		divHtml = divHtml + '	   </label>';
		divHtml = divHtml + '  	</div>';	
	}
	if(bonbuTeamItemYn == true) {
		divHtml = divHtml + '<div class="condition ty2">';
		divHtml = divHtml + '		<label for="mgmtBonbuId">';
		divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['management']	 /*관리*/ + " " + cflineMsgArray['hdofc']	/*본부*/ + " / " + cflineMsgArray['team']/*팀*/  + '</span>';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtBonbuId" id="mgmtBonbuId" data-bind="options:data, selectedOptions: mgmtBonbuId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '		<label for="mgmtTeamId">';
		divHtml = divHtml + '			<div class="Divselect divselect">';
		divHtml = divHtml + '				<select name="mgmtTeamId" id="mgmtTeamId" data-bind="options:data, selectedOptions: mgmtTeamId" data-bind-option="value:text" data-type="select">';
		divHtml = divHtml + '				</select>';
		divHtml = divHtml + '				<span></span>';
		divHtml = divHtml + '			</div>';
		divHtml = divHtml + '		</label>';
		divHtml = divHtml + '</div>';
	}
	divHtml = divHtml + '</div>';
	return divHtml;
}

//DCN, RMS, IP정류기
var makeDiv070 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="svlnNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['lnNm'] /*회선명*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="lftEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westEqp'] /*WEST장비명(좌장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftEqpNm" id="lftEqpNm" data-bind="value: lftEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="lftPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['westPort'] /*WEST포트명(좌포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="lftPortNm" id="lftPortNm" data-bind="value: lftPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '	   <label for="rghtEqpNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastEqp'] /*EAST장비명(우장비명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtEqpNm" id="rghtEqpNm" data-bind="value: rghtEqpNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '	   <label for="rghtPortNm">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['eastPort'] /*EAST포트명(우포트명)*/ + '</span>';	
	divHtml = divHtml + '		 <input type="text" name="rghtPortNm" id="rghtPortNm" data-bind="value: rghtPortNm"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';
	divHtml = divHtml + '</div>';
	return divHtml;
}

//유선백본망
var makeDiv080 = function(styleStr, scdVal, mgmtVal) {
	//styleStr = 'style="display:none"';
	var divHtml = "";
	divHtml = divHtml + '<div class="more_condition" style=' + styleStr + '>';
	divHtml = divHtml + '	<div class="condition ty2 Clearboth">';
	divHtml = divHtml + '		<label for="bizrCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['commBizrMan'] /*통신사업자*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="bkbnCommBizrCd" id="bkbnCommBizrCd" data-bind="options:data, selectedOptions: bkbnCommBizrCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';	
	divHtml = divHtml + '  <div class="condition ty2">';
	divHtml = divHtml + '	   <label for="svlnNo">';
	divHtml = divHtml + '		 <span class="Label label">' + cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/ + '</span>';
	divHtml = divHtml + '		 <input type="text" name="svlnNo" id="svlnNo" data-bind="value: svlnNo"  class="Textinput textinput w220">';
	divHtml = divHtml + '	   </label>';
	divHtml = divHtml + '  </div>';	
	divHtml = divHtml + '	<div class="condition ty2">';
	divHtml = divHtml + '		<label for="svlnStatCd">';
	divHtml = divHtml + '			<span class="Label label">' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</span>';	
	divHtml = divHtml + '			<div class="Divselect divselect w220">';	
	divHtml = divHtml + '				<select name="svlnStatCd" id="svlnStatCd" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select" >';									
	divHtml = divHtml + '				</select>';
	divHtml = divHtml + '				<span></span>';
	divHtml = divHtml + '			</div>';
	divHtml = divHtml + '		</label>';
	divHtml = divHtml + '	</div>';
	return divHtml;
}

//000	미지정

//001	교환기간
//002	기지국간
//003	상호접속간
//030	5G
//016	DU

//101	중계기
//102	WIFI
//103	RU

//201	가입자망

//006	상용망
//007	국가정보
//008	공공정보
//009	B기업회선
//019	T기업회선
//021	내부망
//022	사내망
//023	국가재난안전망

//005	기타

function createBizrCdByChangeMgmtCd(mgmtGrpId, bizrId, bizrCodeData, selGbn){
	if(bizrCodeData != null){
		var selPrePendStr = "";
		if(selGbn == 'S'){
			selPrePendStr = cflineCommMsgArray['select'] /* 선택 */;
		}else if(selGbn == 'N'){
			selPrePendStr = "";
		}else{
			selPrePendStr = cflineCommMsgArray['all'] /* 전체 */;
		}		
	 	var tmpMgmtCd = $('#' + mgmtGrpId).val();
		var bizrCd_option_data =  [];
		for(i=0; i<bizrCodeData.length; i++){
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":selPrePendStr};
				bizrCd_option_data.push(dataFst);
			}
			var dataL = bizrCodeData[i]; 
			if(nullToEmpty(tmpMgmtCd) == "" ){
				bizrCd_option_data.push(dataL);
			}else{
				if(dataL.uprComCd.indexOf(nullToEmpty(tmpMgmtCd)) >= 0 ){
					bizrCd_option_data.push(dataL);
				}
			}
			
		}
		$('#' + bizrId).clear();
		$('#' + bizrId).setData({data : bizrCd_option_data});
	}
}
function makeSearchFormByMgmt(lcdId, scdId, sclCdData){
	makeSearchForm(lcdId, scdId, sclCdData);
}

function makeSearchFormByLcd(lcdId, scdId, sclCdData){
	makeSearchForm(lcdId, scdId, sclCdData);
}

function makeSearchFormByScd(lcdId, scdId, sclCdData){
	var lcdVal = nullToEmpty($('#'+lcdId).val());
	var scdVal = nullToEmpty($('#'+scdId).val());
	makeSearchForm(lcdId, scdId, sclCdData);
	tmpSchLcd = lcdVal;
	tmpSchScd = scdVal;	
//	if(lcdVal == "003" && (scdVal == "" || scdVal == "103") ){
//		tmpSchScd = "103";
//	}else{
//		tmpSchScd = scdVal;		
//	}
}
function makeSearchForm(lcdId, scdId, sclCdData){
	var lcdVal = nullToEmpty($('#'+lcdId).val());
	var scdVal = nullToEmpty($('#'+scdId).val());
	var tmpMgmtCd = nullToEmpty($('#mgmtGrpCd').val());
	
//	if(lcdVal == "003" && scdVal == "103" && tmpSchScd == "103" ){
//		tmpSchScd = scdVal;
//	}
//	if(lcdVal == "005"){
//		tmpSchScd = scdVal;
//	}	
	if(lcdVal==""){
		tmpSchScd = "NON";
		tmpSchLcd = "NON";
	}
	var mgmtVal = "";
	for(k=0; k<sclCdData.length; k++){
		var dataOption = sclCdData[k]; 
		if(scdVal ==nullToEmpty(dataOption.value)){
			mgmtVal = nullToEmpty(dataOption.cdFltrgVal);
		}		
	}
	if(tmpMgmtCd=="0002" && scdVal == ""){
		mgmtVal = "SKB";
	}else if(tmpMgmtCd=="0001" && scdVal == ""){
		mgmtVal = "SKT";
	} 
	
	// 관리 본부, 팀은 관리그룹이 SKT(0001)인 경우, 
	// RU 광코어(sclCd == '101'), 기타회선(lclCd == '006')일 때만 조회조건이 보여야하기 때문에 플래그를 둔다.
	var bonbuTeamItemYn = false;
	
	if ( tmpMgmtCd == "0001" && ( scdVal == "101" || scdVal == "005" || scdVal == "102" || scdVal == "105" || scdVal == "060" || scdVal == "061") ) {
		bonbuTeamItemYn = true;
	}
	
//	if(tmpSchLcd != lcdVal || tmpSchScd != scdVal){
		if(nullToEmpty(lcdVal) != ""){
			var styleStr = 'display:none';
	
			if(scdVal=="001" || scdVal=="002" || scdVal=="003" || scdVal=="010" || scdVal=="011" || scdVal=="012" || scdVal=="013" || scdVal=="014"){
				document.getElementById("svlnDivHtml").innerHTML = makeDiv001(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="030"){
				document.getElementById("svlnDivHtml").innerHTML = makeDiv030(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="016"){
				document.getElementById("svlnDivHtml").innerHTML = makeDiv016(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="020"){
				document.getElementById("svlnDivHtml").innerHTML = makeDiv020(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));
				
			}else if(lcdVal=="005"){
				document.getElementById("svlnDivHtml").innerHTML = makeDiv005(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));				
//			}else if(scdVal=="006" || scdVal=="007" || scdVal=="008" || scdVal=="019" || scdVal=="022" || scdVal=="023"){   //  B2B회선 - SKT
//				document.getElementById("svlnDivHtml").innerHTML = makeDiv005(styleStr, scdVal, mgmtVal);
//				$a.convert($('#svlnDivHtml'));
//	//		}else if(scdVal=="009" || scdVal=="021"){   // B2B회선 - SKB
//	//			document.getElementById("svlnDivHtml").innerHTML = makeDiv005(styleStr, scdVal, mgmtVal);
//	//			$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="101" || scdVal=="104" || (lcdVal=="003" && scdVal=="") ){ // Ru회선 중계기, WRU
				document.getElementById("svlnDivHtml").innerHTML = makeDiv101(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				$a.convert($('#svlnDivHtml'));
				//TODO 광코어에 ONS 본부 추가 2023-11
				$('#onsHdofcCd').on('change',function(e){
					changeOnsHdofc("onsHdofcCd", "onsTeamCd", svlnCommCodeData.onsTeamCdList, cflineCommMsgArray['all'] /* 전체 */);
			  	}); 
			}else if(scdVal=="102"){ // 기타회선 Wifi
				document.getElementById("svlnDivHtml").innerHTML = makeDiv102(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="103"){ // Ru회선 RU
//				console.log("111#" + tmpSchLcd + ":" + tmpSchScd + "#111");	
				document.getElementById("svlnDivHtml").innerHTML = makeDiv103(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));	
				// ONS 본부 선택시
				$('#onsHdofcCd').on('change',function(e){
					changeOnsHdofc("onsHdofcCd", "onsTeamCd", svlnCommCodeData.onsTeamCdList, cflineCommMsgArray['all'] /* 전체 */);
			  	}); 	
			}else if(scdVal=="201"){ // 가입자망회선
				document.getElementById("svlnDivHtml").innerHTML = makeDiv201(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="105"){ // (구)NITS회선
				document.getElementById("svlnDivHtml").innerHTML = makeDiv105(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="060") {	// DCN망
				document.getElementById("svlnDivHtml").innerHTML = makeDiv060(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				$a.convert($('#svlnDivHtml'));
			} else if(scdVal=="061"){ //기타 - 중계기정합장치회선
				document.getElementById("svlnDivHtml").innerHTML = makeDiv061(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="070" || scdVal=="071" || scdVal=="072" || scdVal=="106") { //2018-12-19 기타회선 DCN, RMS, IP정류기, 기타 - 예비회선 (2023-09-18)
				document.getElementById("svlnDivHtml").innerHTML = makeDiv070(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				$a.convert($('#svlnDivHtml'));
			}else if(scdVal=="080") { //2021-11-18 유선백본망
				document.getElementById("svlnDivHtml").innerHTML = makeDiv080(styleStr, scdVal, mgmtVal);
				$a.convert($('#svlnDivHtml'));
				
			}else{
				if(lcdVal == "001" && scdVal == "") {	//기지국회선 전체인 경우
					document.getElementById("svlnDivHtml").innerHTML = makeDivAll(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				} else {
					document.getElementById("svlnDivHtml").innerHTML = makeDiv000(styleStr, scdVal, mgmtVal, bonbuTeamItemYn);
				}
				$a.convert($('#svlnDivHtml'));
			}
			$('.arrow_more').click();
			
		//	// 사업자코드   
			bizrCdCodeData = svlnCommCodeData.bizrCdList;
			createBizrCdByChangeMgmtCd("mgmtGrpCd", "bizrCd", svlnCommCodeData.bizrCdList, "A")  // 통신사업자 selectBox 제어
			
			//유선백본망 통신사업자
			bkbnBizrCdCodeData = svlnCommCodeData.bkbnCommBizrCdList
			$('#bkbnCommBizrCd').clear();
			$('#bkbnCommBizrCd').setData({data : bkbnBizrCdCodeData});
			$('#bkbnCommBizrCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#bkbnCommBizrCd').setSelected("");	
		
			// 서비스회선유형코드
			svlnTypCdData = svlnLclSclCodeData.svlnTypCdList;
			$('#svlnTypCd').clear();
			$('#svlnTypCd').setData({data : svlnLclSclCodeData.svlnTypCdList});
			$('#svlnTypCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#svlnTypCd').setSelected("");	
			makeSvlnTypCdSelectBox("svlnSclCd", "svlnTypCd", svlnTypCdData, "A");  // 서비스회선유형 selectbox 제어	
			
			// 서비스회선상태코드   
			$('#svlnStatCd').clear();
			$('#svlnStatCd').setData({data : svlnCommCodeData.svlnStatCdList});
			$('#svlnStatCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#svlnStatCd').setSelected("");	
			// 회선사용기간유형코드   
			$('#lineUsePerdTypCd').clear();
			$('#lineUsePerdTypCd').setData({data : svlnCommCodeData.lineUsePerdTypCdList});
			$('#lineUsePerdTypCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#lineUsePerdTypCd').setSelected("");	
			if(lcdVal=="005"){
				// 기업회선 회선용량코드   
				$('#lineCapaCd').clear();
				$('#lineCapaCd').setData({data : svlnCommCodeData.svlnB2bCapaCdList});
				$('#lineCapaCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
				$('#lineCapaCd').setSelected("");	
			}else{	
				// 회선용량코드   
				$('#lineCapaCd').clear();
				$('#lineCapaCd').setData({data : svlnCommCodeData.svlnCapaCdList});
				$('#lineCapaCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
				$('#lineCapaCd').setSelected("");
			}
			// ONS 본부   
			$('#onsHdofcCd').clear();
			$('#onsHdofcCd').setData({data : svlnCommCodeData.onsHdofcCdList});
			$('#onsHdofcCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#onsHdofcCd').setSelected("");		
			// ONS 팀   
			$('#onsTeamCd').clear();
			$('#onsTeamCd').setData({data : svlnCommCodeData.onsTeamCdList});
			$('#onsTeamCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#onsTeamCd').setSelected("");
			
			if(tmpMgmtCd=="0002" ){
			//  회선관리등급
				$('#lineMgmtGrCd').clear();
				$('#lineMgmtGrCd').setData({data : svlnCommCodeData.lineMgmtGrCdListSKB});
				$('#lineMgmtGrCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
				$('#lineMgmtGrCd').setSelected("");	
			}else if(tmpMgmtCd=="0001"){
			//  회선관리등급
				$('#lineMgmtGrCd').clear();
				$('#lineMgmtGrCd').setData({data : svlnCommCodeData.lineMgmtGrCdListSKT});
				$('#lineMgmtGrCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
				$('#lineMgmtGrCd').setSelected("");
			} 
			
			$('#srsLineYn').clear();
			$('#srsLineYn').setData({data : svlnCommCodeData.ynList});
			$('#srsLineYn').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#srsLineYn').setSelected("");
			// 임차유형코드
			$('#lesTypCd').clear();
			$('#lesTypCd').setData({data : svlnCommCodeData.lesTypeCdList});
			$('#lesTypCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#lesTypCd').setSelected("");
			// 관리포스트코드
			$('#mgmtPostCd').clear();
			$('#mgmtPostCd').setData({data : svlnCommCodeData.mgmtPostCdList});
			$('#mgmtPostCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#mgmtPostCd').setSelected("");
			// 관리대상
			$('#coLineVrfYn').clear();
			$('#coLineVrfYn').setData({data : svlnCommCodeData.ynList});
			$('#coLineVrfYn').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#coLineVrfYn').setSelected("");
			// 망구분
			$('#svlnNetDivCd').clear();
			$('#svlnNetDivCd').setData({data : svlnCommCodeData.svlnNetDivCdList});
			$('#svlnNetDivCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#svlnNetDivCd').setSelected("");
			// 관리 본부
			$('#mgmtBonbuId').clear();
			$('#mgmtBonbuId').setData({data : mgmtOrgData.mgmtBonbuData});
			$('#mgmtBonbuId').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#mgmtBonbuId').setSelected("");
			// 관리 팀
			$('#mgmtTeamId').clear();
			$('#mgmtTeamId').setData({data : mgmtOrgData.mgmtTeamData});
			$('#mgmtTeamId').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#mgmtTeamId').setSelected("");
			// 20181228 망구성방식코드
			$('#netCfgMeansCd').clear();
			$('#netCfgMeansCd').setData({data : svlnCommCodeData.netCfgMeansCdList});
			$('#netCfgMeansCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#netCfgMeansCd').setSelected("");
			// 2019-01-30 선번수집여부
			$('#autoClctYn').clear();
			$('#autoClctYn').setData({data : svlnCommCodeData.ynList});
			$('#autoClctYn').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#autoClctYn').setSelected("");
			// 2022-01-19 장비구분
    		$('#eqpDivCd').clear();
    		$('#eqpDivCd').setData({data : EqpDivData});
			$('#eqpDivCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
			$('#eqpDivCd').setSelected("");

			
		}else{
			document.getElementById("svlnDivHtml").innerHTML = "";
			$a.convert($('#svlnDivHtml'));
			
		}
//	}

	
}

function eqpKeyEvent(){
	// , 	alert($('#lftEqpNm').val());
	if($('#eqpNm').val() != null && $('#eqpNm').val() != ""){
		$('#portNm').setEnabled(true);
	}else{
		$('#portNm').val("");
		$('#portNm').setEnabled(false);
	}
	return;
}

function changeMgmtBonbu(mgmtBonbuId) {
	if (nullToEmpty(mgmtOrgData.mgmtTeamData) == "") return;
	
	var changeTeamData = [{value: "",text: cflineCommMsgArray['all']  /* 전체 */}];
	if(nullToEmpty(mgmtBonbuId) != "") {
		for( var i = 0; i < mgmtOrgData.mgmtTeamData.length; i++ ) {
			if( mgmtBonbuId == mgmtOrgData.mgmtTeamData[i].uprGrpOrdId ) {
				changeTeamData.push( { value : mgmtOrgData.mgmtTeamData[i].value, text : mgmtOrgData.mgmtTeamData[i].text } );
			}
		}
	}
	else {		
		for( var i = 0; i < mgmtOrgData.mgmtTeamData.length; i++ ) {
			changeTeamData.push( { value : mgmtOrgData.mgmtTeamData[i].value, text : mgmtOrgData.mgmtTeamData[i].text } );
		}
	}
	$('#mgmtTeamId').clear();
	$('#mgmtTeamId').setData({data : changeTeamData});
}
