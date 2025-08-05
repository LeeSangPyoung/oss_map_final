/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */

(function($) {

	/***************************************************************************
	 * autocomplete
	 **************************************************************************/
	$.alopex.widget.autocomplete = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'autocomplete',
		setters : ['autocomplete', 'setOptions'],
		getters : ['getSelectedData'],
		properties: {
			textinput : null,
			dropdown : null,
			noresultstr : 'No Results',
			lastKeyword : "",
			url : null,
			method : "GET",
			datatype : "json",
			paramname : null,
			source : undefined,
			minlength : 1,
			fitwidth : true,
			maxheight : '',
			select : null,
			selected : undefined,
			maxresult : 100
		},
		init : function(el, option) {
			$.extend(el, this.properties, option);
			if ( $(el).find('.Dropdown').length === 0 ){
				$(el).append('<ul class="Dropdown"></ul>');
			}
			el.textinput = $(el).find('.Textinput').first();

			el.dropdown = $(el).find('.Dropdown').first();
			$(el.dropdown).css('minWidth', 300);
			$(el.dropdown).css('width', 400);
			$(el.dropdown).css('display', 'none');
			$(el.dropdown).css('maxHeight', el.maxheight);
			$(el.dropdown).css('overflow-y','auto');
			$a.convert(el.textinput);
			$a.convert(el.dropdown);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);

			$(el.dropdown).addHandler($.alopex.widget.autocomplete._defaultHandler);
			//$(el.dropdown).on('click', $.alopex.widget.autocomplete._eqpSearch);

		},
		_defaultHandler : function(e){
			var el = e.currentTarget.parentElement.parentElement;
			el.lastKeyword = e.currentTarget.innerText;
			el.selected = e.currentTarget.data;
			console.log(el.selected);
			var eqpId =  el.selected.searchId;
			if (eqpId != undefined && eqpId != null && eqpId != "") {
				//multiSearch.fnEqpSearch(eqpId);
			}

			if( typeof el.select === "function" ){
				el.select(e, el.selected);
			}
		},
		setOptions : function(el, data){
			$.extend(el, data);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);
		},
		_eqpSearch : function(e){
			if(JSON.stringify($("#idSelect").getSelectedData()) != null && JSON.stringify($("#idSelect").getSelectedData()) != "null"){
    			var searchId = "";
    			searchId = JSON.stringify($("#idSelect").getSelectedData().searchId);
    			//param.searchId = searchId.replace(/"/g, "");
    			alert(searchId);
    		}
		},
		_keyupHandler : function(e){
			var el = e.currentTarget;
			var text = $(el).val();
			var divEl = el.parentElement;
			var req = {};
			req.data = {};
			req.el = divEl;
			// minLength 와 같거나 큰 길이의 입력에 대해서만 동작
			if( e.keyCode !== 13 && divEl.lastKeyword != text ){
				divEl.lastKeyword = text;
				if( 0 < $('#searchNm').val().length ){
					req.url = divEl.url;
					divEl.paramname? req.data[divEl.paramname] = text : req.data = text;
					req.method = divEl.method;
					req.dataType = divEl.datatype;
					req.success = function(res){
						if( res.length > this.el.maxresult ){
							res.length = this.el.maxresult;
							alert();
						}
						if(res.length > 0){
							var textRes = res[0].text.toUpperCase();
							if(textRes.indexOf($('#searchNm').val().toUpperCase()) > -1){
								$.alopex.widget.autocomplete._setDataSource(this.el.dropdown, res);
								$.alopex.widget.autocomplete._noResultHandler(divEl);
								$(this.el.dropdown).open();
							}
						}else{
							if(text == $('#searchNm').val()){
								$.alopex.widget.autocomplete._setDataSource(this.el.dropdown, res);
								$.alopex.widget.autocomplete._noResultHandler(divEl);
								$(this.el.dropdown).open();
							}
						}
					}
					$.ajax(req);
				}else{
					$(el.dropdown).html('');
					$(el.dropdown).close();
				}
			}else if( e.keyCode !== 13 && divEl.lastKeyword == text ){
				$(el.dropdown).open();
			}else {
				return;
			}
		},
		_setDataSource : function(dd, data){
			switch (typeof data) {
			case 'string':
				$el.html(data);
				break;
			case 'object':
				$.alopex.widget.autocomplete._htmlGenerator(dd, data);
				break;
			default:
				break;
			}
			$(dd).refresh();
			// [20160503 kjb - 아래 주석 풀었음]
			dd.userInputDataSource = data;
		},
		_noResultHandler : function(el){
			if ( $(el.dropdown).find('li').length === 0 ){
				$(el.dropdown).append('<li class="af-disabled Disabled" data-role="empty">'+el.noresultstr+'</li>');
			}
		},
		_htmlGenerator: function(dd, data) {
			var item;

			$(dd).html('');

			for( var i = 0 ; i < data.length ; i++ ){
				item = document.createElement('li');
				if ( data[i].id !== undefined ) {
					item.id = data[i].id;
				}
				if ( data[i].text !== undefined ){
					item.innerText = data[i].text;
				} else if ( data[i].value !== undefined ){
					item.innerText = data[i].value;
				} else {
					item.innerText = data[i];
				}
				item.data = data[i];
				$(dd).append(item);
			}
		},
		getSelectedData : function(el){
			return el.selected;
		}
 	});
})(jQuery);



var multiSearch = $a.page(function() {

	var checkGubun = "";

	this.init = function(id, param) {

		checkGubun = param.checkGubun;
    	//initGrid();
    	document.getElementById("tab1").style.display = 'none';
    	document.getElementById("tab2").style.display = 'none';
    	document.getElementById("tab3").style.display = 'none';
    	document.getElementById("tab4").style.display = 'none';
    	if (param.checkGubun == '1') {
    		document.getElementById("tab1").style.display = '';
    	} else if (param.checkGubun == '2') {
    		document.getElementById("tab2").style.display = '';
    	} else if (param.checkGubun == '3') {
    		document.getElementById("tab3").style.display = '';
    	} else if (param.checkGubun == '4') {
    		document.getElementById("tab4").style.display = '';
    	}
    	setSelectCode();
    	setEventListener();
    };

    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpMgmtTeamGrp', null, 'GET', 'mgmtTeamOrgId');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOpTeamGrp', null, 'GET', 'opTeamOrgId');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getRegEqpMdlList', null, 'GET', 'regEqpMdlList');
    }

    function setEventListener() {
    	urlData = "/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAutoSearch";
    	$("#idSelect").setOptions({
 			url : urlData,
 			method : "get",
 			datatype: "json",
 			paramname : "searchNm",
 			minlength: 2,
 			noresultstr : "검색 결과가 없습니다.",
 			before : function(id, option){

 			}
 		});

    	$('#btnSaveReg').on('click', function(e) {
    		var paramData = "";
    		if (checkGubun == '1') {
    			paramData = {eqpMdlId : $('#eqpMdlIdReg').val()};
        	} else if (checkGubun == '2') {

        	} else if (checkGubun == '3') {
        		paramData = {jrdtTeamOrgId : $('#jrdtTeamOrgIdReg').val()};
        	} else if (checkGubun == '4') {
        		paramData = {opTeamOrgId : $('#opTeamOrgIdReg').val()};
        	}
    		$a.close(paramData);
        });



    	$('#btnCnclReg').on('click', function(e) {
    		$a.close();
        });
    }


    function successCallback(response, status, jqxhr, flag) {




		if(flag == 'regEqpMdlList'){
			$('#eqpMdlIdReg').clear();
			var option_data =  [{orgId: "",orgNm: "선택하세요"}];
			for(var i = 0; i < response.length; i++){
				var resObj = {orgId : response[i].eqpMdlId , orgNm : '[' + response[i].mgmtGrpNm + ']' + ' [' + response[i].eqpRoleDivNm + ']  ' + response[i].eqpMdlNm + ' ('+response[i].bpNm+')'};
				option_data.push(resObj);
			}
			$('#eqpMdlIdReg').setData({ data:option_data });
		}


		if(flag == 'mgmtTeamOrgId'){

    		$('#jrdtTeamOrgIdReg').clear();

    		var option_data =  [{orgId: "",orgNm: '선택하세요'}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		$('#jrdtTeamOrgIdReg').setData({ data:option_data });
    	}

    	if(flag == 'opTeamOrgId'){
    		$('#opTeamOrgIdReg').clear();
    		var option_data =  [{orgId: "",orgNm: '선택하세요'}];
    		for(var i = 0; i < response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		$('#opTeamOrgIdReg').setData({ data:option_data });
    	}

	}

    function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){

		}
	}

    var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}

});
