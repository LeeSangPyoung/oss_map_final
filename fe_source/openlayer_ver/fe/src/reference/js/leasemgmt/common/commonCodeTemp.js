/**
 * commonCodeTemp.js
 * 공통코드호출(임시)
 *
 * @author 임상우
 * @date 2016. 7. 7. 오전 9:10:00
 * @version 1.0
 */
CommonCode = function (callbackFunc) {
	
	this.getCommonCode = function () {

		commonCodeTempReq = 'tango-transmission-biz/commoncode/';
		commonCodes = new Array();
		
		$('select').each(function() {
			if ($(this).attr('data-use-code') != undefined) {
				$(this).addClass('commonCode');
				$(this).attr('data-type', 'select');
				$(this).attr('data-bind-option', 'comCd:comCdNm');
				
				dataBindValue = "";
				
				if($(this).attr('data-bind') != undefined){
					dataBindAttr = $(this).attr('data-bind').replace(/\s/gi, '');
					
					if(dataBindAttr.indexOf('value') > -1 && dataBindAttr.indexOf('selectedOptions') < 0){
						
						dataBindAttrArr = dataBindAttr.split(',');
						
						for(i=0; i<dataBindAttrArr.length; i++){
							if(dataBindAttrArr[i].indexOf('value') > -1){
								dataBindValue += ", selectedOptions:";
								dataBindValue += dataBindAttrArr[i].split(':')[1];
								break;
							}
						}
					}
					
					dataBindValue += ", ";
					dataBindValue += $(this).attr('data-bind');
				}
				
				$(this).attr('data-bind', 'options:data' + dataBindValue);
			
				commonCodes.push($(this).attr('data-use-code'));
			}
		});
		
		if(commonCodes.length > 0){
			Tango.ajax({url : commonCodeTempReq + commonCodes, 
				data : null,
				method : 'GET' })
				.done(function(response){commonCodesCallback(response, null);})
				.fail(function(response){commonCodesFailCallback(response, null);});
		}
	}
	
	function commonCodesCallback(response, flag){
		
		$('.commonCode').each(function(){
			
			option_data = new Array();
			
			useCode = $(this).attr('data-use-code');
			codeFlag = $(this).attr('data-code-flag');
			
			if(codeFlag != undefined){
				           
				if(codeFlag === 'select'){
					option_data.push({comGrpCd:useCode, comCd:"",comCdNm:"선택"});
				}
				if(codeFlag === 'all'){
					option_data.push({comGrpCd:useCode, comCd:"",comCdNm:"전체"});
				}
			}
			
			$.each(response, function(idx, val){
				if(useCode === val.comGrpCd){
					option_data.push(val);
					//response = response.slice(0, idx).concat(response.slice(idx+1, response.length));
				}
			});

			$(this).setData({
	            data:option_data
			});
			
			$(this).trigger($.Event('change'));
		});
		
		
		if(callbackFunc != undefined){
			callbackFunc();
		}
		
	}

	function commonCodesFailCallback(response, flag){
		
	}
}


