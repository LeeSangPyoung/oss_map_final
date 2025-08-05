/**
 * ServiceLineWritePopAddHtml.js
 *
 * @author P095783
 * @date 2016.11.15
 * @version 1.0 
 */

var makeDiv000 = function() {	
	var divHtml = "";	
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';		
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineCapaCd" id="lineCapaCdPop" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="faltMgmtObjYn" id="faltMgmtObjYnPop" data-bind="options:data, selectedOptions: faltMgmtObjYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv001 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="svlnTypCd" id="svlnTypCdPop" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="faltMgmtObjYn" id="faltMgmtObjYnPop" data-bind="options:data, selectedOptions: faltMgmtObjYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>	';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['upperSystemName'] /*상위시스템명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<input name="uprSystmNm" id="uprSystmNmPop" class="Textinput textinput" data-type="textinput" data-bind ="value: uprSystmNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lowSystemName'] /*하위시스템명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<input name="lowSystmNm" id="lowSystmNmPop" class="Textinput textinput" data-type="textinput" data-bind ="value: lowSystmNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td><td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv003 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="srsLineYn" id="srsLineYnPop" data-bind="options:data, selectedOptions: srsLineYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['networkType'] /*망유형*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="lesTypCd" id="lesTypCdPop" data-bind="options:data, selectedOptions: lesTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="svlnStatCd" id="svlnStatCdPop" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['chargingStatus'] /*과금상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="chrStatCd" id="chrStatCdPop" data-bind="options:data, selectedOptions: chrStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lineCoreCount'] /*회선코어수*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<input name="lineCoreCnt" id="lineCoreCntPop" class="Textinput textinput" data-type="textinput" data-bind ="value: lineCoreCnt" data-keyfilter-rule="digits">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['donorSystemName'] /*도너시스템명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<input name="dnrSystmNm" id="dnrSystmNmPop" class="Textinput textinput" data-type="textinput" data-bind ="value: dnrSystmNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}
var makeDiv004 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="svlnStatCd" id="svlnStatCdPop" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="faltMgmtObjYn" id="faltMgmtObjYnPop" data-bind="options:data, selectedOptions: faltMgmtObjYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>	';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineUsePerdTypCd" id="lineUsePerdTypCdPop" data-bind="options:data, selectedOptions: lineUsePerdTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineMgmtGrCd" id="lineMgmtGrCdPop" data-bind="options:data, selectedOptions: lineMgmtGrCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineDistanceType'] /*회선거리유형*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="lineDistTypCd" id="lineDistTypCdPop" data-bind="options:data, selectedOptions: lineDistTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>	';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineSectionType'] /*회선구간유형*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineSctnTypCd" id="lineSctnTypCdPop" data-bind="options:data, selectedOptions: lineSctnTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['chargingStatus'] /*과금상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="chrStatCd" id="chrStatCdPop" data-bind="options:data, selectedOptions: chrStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['serviceManagementNumber'] /*서비스관리번호*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '                       <input name="srvcMgmtNo" id="srvcMgmtCdPop" class="Textinput textinput" data-type="textinput" data-bind="value:srvcMgmtNo">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>	';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}
var makeDiv005 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="svlnTypCd" id="svlnTypCdPop" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="lineCapaCd" id="lineCapaCdPop" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>	';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['chargingStatus'] /*과금상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="chrStatCd" id="chrStatCdPop" data-bind="options:data, selectedOptions: chrStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th  scope="col">' + cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="srsLineYn" id="srsLineYnPop" data-bind="options:data, selectedOptions: srsLineYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['businessToBusinessCustomerName'] /*B2B고객명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<input name="b2bCustNm" id="b2bCustNmPop" class="Textinput textinput" data-type="textinput"  data-bind ="value: b2bCustNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv006 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';		
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineType'] /*서비스회선유형*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="svlnTypCd" id="svlnTypCdPop" data-bind="options:data, selectedOptions: svlnTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lineCapacity'] /*회선용량*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineCapaCd" id="lineCapaCdPop" data-bind="options:data, selectedOptions: lineCapaCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="faltMgmtObjYn" id="faltMgmtObjYnPop" data-bind="options:data, selectedOptions: faltMgmtObjYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv061 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th  scope="col">' + cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="srsLineYn" id="srsLineYnPop" data-bind="options:data, selectedOptions: srsLineYn" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['networkType'] /*망유형*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="lesTypCd" id="lesTypCdPop" data-bind="options:data, selectedOptions: lesTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="svlnStatCd" id="svlnStatCdPop" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th  scope="col"><em class="color_red">*</em>' + cflineMsgArray['chargingStatus'] /*과금상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="chrStatCd" id="chrStatCdPop" data-bind="options:data, selectedOptions: chrStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['donorSystemName'] /*도너시스템명*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<input name="dnrSystmNm" id="dnrSystmNmPop" class="Textinput textinput" data-type="textinput" data-bind ="value: dnrSystmNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv070 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineUsePerdTypCd" id="lineUsePerdTypCdPop" data-bind="options:data, selectedOptions: lineUsePerdTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark1'] /*회선비고1*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkOne" id="lineRmkOnePop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkOne">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark2'] /*회선비고2*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkTwo" id="lineRmkTwoPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkTwo">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark3'] /*회선비고3*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkThree" id="lineRmkThreePop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkThree">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv020 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td colspan="3">';
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput wFull" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '					<div class="Divselect divselect">';	
	divHtml = divHtml + '						<select name="lineUsePerdTypCd" id="lineUsePerdTypCdPop" data-bind="options:data, selectedOptions: lineUsePerdTypCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>	';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

var makeDiv007 = function() {	
	var divHtml = "";	
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';		
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['serviceLineStatus'] /*서비스회선상태*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="svlnStatCd" id="svlnStatCdPop" data-bind="options:data, selectedOptions: svlnStatCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['commBizrMan'] /*통신사업자*/ + '</th>';
	divHtml = divHtml + '				<td>';
	divHtml = divHtml + '					<div class="Divselect divselect">';
	divHtml = divHtml + '						<select name="bkbnCommBizrCd" id="bkbnCommBizrCdPop" data-bind="options:data, selectedOptions: bkbnCommBizrCd" data-bind-option="value:text" data-type="select">';
	divHtml = divHtml + '						</select>';
	divHtml = divHtml + '						<span></span>';
	divHtml = divHtml + '					</div>';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '			<tr>';	
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark1'] /*회선비고1*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkOne" id="lineRmkOnePop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkOne">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}


var makeDiv106 = function() {	
	var divHtml = "";
	divHtml = divHtml + '	<table class="Table table Form-type">';
	divHtml = divHtml + '		<colgroup>';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col style="width:150px">';
	divHtml = divHtml + '			<col>';
	divHtml = divHtml + '		</colgroup>';
	divHtml = divHtml + '		<tbody>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col"><em class="color_red">*</em>' + cflineMsgArray['lnNm'] /*회선명*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineNm" id="lineNmPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineNm">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark1'] /*회선비고1*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkOne" id="lineRmkOnePop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkOne">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '			<tr>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark2'] /*회선비고2*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkTwo" id="lineRmkTwoPop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkTwo">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th scope="col">' + cflineMsgArray['lineRemark3'] /*회선비고3*/ + '</th>';
	divHtml = divHtml + '				<td>';	
	divHtml = divHtml + '                       <input name="lineRmkThree" id="lineRmkThreePop" class="Textinput textinput" data-type="textinput" data-bind="value:lineRmkThree">';
	divHtml = divHtml + '				</td>';
	divHtml = divHtml + '				<th></th>';
	divHtml = divHtml + '				<td></td>';
	divHtml = divHtml + '			</tr>';
	divHtml = divHtml + '		</tbody>';
	divHtml = divHtml + '	</table>';
	return divHtml;
}

function makeChangeAarea(svlnLclCd, svlnSclCd) {
	var lclVal = nullToEmpty($('#'+svlnLclCd).val());
	var sclVal = nullToEmpty($('#'+svlnSclCd).val());
	
	if (lclVal == "") {
		document.getElementById("changeArea").innerHTML = makeDiv000();
		/*$('#changeArea').html(makeDiv000());*/
		$a.convert($('#changeArea'));
	}
	//미지정
	else if(lclVal == "000"){
		document.getElementById("changeArea").innerHTML = makeDiv000();
		/*$('#changeArea').html(makeDiv000());*/
		$a.convert($('#changeArea'));
	}
	//기지국회선
	else if(lclVal == "001"){
		if(sclVal == "020" ){
			document.getElementById("changeArea").innerHTML = makeDiv020();
			/*$('#changeArea').html(makeDiv020());*/
			$a.convert($('#changeArea'));
		}else{
			document.getElementById("changeArea").innerHTML = makeDiv001();
			/*$('#changeArea').html(makeDiv001());*/
			$a.convert($('#changeArea'));
		}
		/*$('#changeArea').html(makeDiv001());*/
	}
	//ru회선
	else if(lclVal == "003"){
		document.getElementById("changeArea").innerHTML = makeDiv003();
		/*$('#changeArea').html(makeDiv003());*/
		$a.convert($('#changeArea'));
	}
	//가입자망회선
	else if(lclVal == "004"){
		document.getElementById("changeArea").innerHTML = makeDiv004();
		/*$('#changeArea').html(makeDiv000());*/
		$a.convert($('#changeArea'));
	}
	//BEB
	else if(lclVal == "005"){
		document.getElementById("changeArea").innerHTML = makeDiv005();
		/*$('#changeArea').html(makeDiv005());*/
		$a.convert($('#changeArea'));
	//공동망회선
	}else if (lclVal == '007'){
		document.getElementById("changeArea").innerHTML = makeDiv007();
		/*$('#changeArea').html(makeDiv005());*/
		$a.convert($('#changeArea'));
	}
	//기타회선
	else if(lclVal == "006"){
		if(sclVal == "102" || sclVal == "105" ){
			document.getElementById("changeArea").innerHTML = makeDiv003();
			$a.convert($('#changeArea'));
		} else if(sclVal == "061") {		// 20181122 중계기정합장치
			document.getElementById("changeArea").innerHTML = makeDiv061();
			$a.convert($('#changeArea'));
		} else if(sclVal == "070" || sclVal == "071" || sclVal == "072") { // 2018-12-26 DCN, RMS, IP정류기
			document.getElementById("changeArea").innerHTML = makeDiv070();
			$a.convert($('#changeArea'));
		}  else if(sclVal == "106") { // 기타_예비회선 2023-09-18
			document.getElementById("changeArea").innerHTML = makeDiv106();
			$a.convert($('#changeArea'));
		} else {
			document.getElementById("changeArea").innerHTML = makeDiv006();
			/*$('#changeArea').html(makeDiv006());*/
			$a.convert($('#changeArea'));
		}

	}

	// 서비스회선상태코드
	setSelectBox("svlnStatCdPop", svlnCommCodePopData.svlnStatCdList, "");
	
	// 중요회선여부
	setSelectBox("srsLineYnPop", svlnCommCodePopData.ynList, "");
	
	// 회선용량코드
	setSelectBox("lineCapaCdPop", svlnCommCodePopData.svlnCapaCdList, "");
	
	// 회선작업진행상태코드
	setSelectBox("lineWorkProgStatCdPop", svlnCommCodePopData.lineWorkProgStatCdList, "");
	
	// 임차-임차유형코드
	setSelectBox("lesTypCdPop", svlnCommCodePopData.lesTypeCdList, "");
	
	// 임차-과금상태코드
	setSelectBox("chrStatCdPop", svlnCommCodePopData.chrStatCdList, "");
	
	// 청약-회선사용기간유형코드
	setSelectBox("lineUsePerdTypCdPop", svlnCommCodePopData.lineUsePerdTypCdList, "");			

	// 기업-최소회선용량코드
	setSelectBox("minLineCapaCdPop", svlnCommCodePopData.minLineCapaCdList, "");
	
	// 기업-고장관리대상여부
	setSelectBox("faltMgmtObjYnPop", svlnCommCodePopData.ynList, "");
	
	// 기업-코딩방식유형코드
	setSelectBox("cdngMeansTypCdPop", svlnCommCodePopData.cdngMeansTypCdList, "");
	
	// 기업-관리포스트코드
	setSelectBox("mgmtPostCdPop", svlnCommCodePopData.mgmtPostCdList, "");
	
	// 기업-기업회선검증여부
	setSelectBox("coLineVrfYnPop", svlnCommCodePopData.ynList, "");
	
	// 일반-회선관리등급코드
	setSelectBox("lineMgmtGrCdPop", svlnCommCodePopData.lineMgmtGrCdList, "");
	
	// 일반-회선거리유형코드
	setSelectBox("lineDistTypCdPop", svlnCommCodePopData.lineDistTypCdList, "");
	
	// 일반-회선구간유형코드
	setSelectBox("lineSctnTypCdPop", svlnCommCodePopData.lineSctnTypCdList, "");
	
	// 데이터-회선구성유형코드
	setSelectBox("lineCfgTypCdPop", svlnCommCodePopData.lineCfgTypCdList, "");
	
	// 데이터-L2스위치여부
	setSelectBox("l2swYnPop", svlnCommCodePopData.ynList, "");
	
	// 데이터-직접연결여부
	setSelectBox("dirConnYnPop", svlnCommCodePopData.ynList, "");
	
	// 서비스회선유형코드
	setSelectBox("svlnTypCdPop", svlnTypCdPopData, "");
	
	// 유선백본망 통신사업자 코드
	setSelectBox("bkbnCommBizrCdPop", svlnCommCodePopData.bkbnCommBizrCdList, "")
	
	
//	svlnTypCdData = svlnLclSclCodeData.svlnTypCdList;
//	$('#svlnTypCd').clear();
//	$('#svlnTypCd').setData({data : svlnLclSclCodeData.svlnTypCdList});
//	$('#svlnTypCd').prepend('<option value="">' + cflineCommMsgArray['all'] + '</option>');
//	$('#svlnTypCd').setSelected("");	
//	makeSvlnTypCdSelectBox("svlnSclCd", "svlnTypCd", svlnTypCdData, "A");  // 서비스회선유형 selectbox 제어		
}


function setSelectBox(idName, list, setKeyValue){
	$('#' + idName).clear();
	if(list != null && list.length>0){
		$('#' + idName).setData({data : list});
	}
	$('#' + idName).prepend('<option value="">' + cflineCommMsgArray['select']/* 선택 */ + '</option>');
	$('#' + idName).setSelected(setKeyValue);	
	if(idName == "svlnTypCdPop"){
		makeSvlnTypCdSelectBox("svlnSclCdPop", "svlnTypCdPop", svlnTypCdPopData, "S");  // 서비스회선유형 selectbox 제어
	}
}

