
$a.page(function() {
	var  param = null;
    var sFlag  = null;
    //debugger;
	this.init = function(id, params) {
		//console.log("params STTTT");
		//console.log(params);
		sFlag = params.sFlag ; 
		var prama = {"svlnNo":params.ntwkLineNo,"sFlog":sFlag};
		//console.log(prama);
		mtsoInfoByPathList(prama, "A"+sFlag );  //일단 주석 
    };
});