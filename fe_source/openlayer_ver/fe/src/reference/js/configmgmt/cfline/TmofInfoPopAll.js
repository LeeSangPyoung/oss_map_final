
$a.page(function() {
	var  param = null;
    var sFlag  = null;
    //debugger;
	this.init = function(id, params) {
//		sFlag = params.sFlag ; 
//		tmofInfoPop(params, "A"+sFlag );  //일단 주석 
		//console.log("params SSSS");
		//console.log(params);
		sFlag = params.sFlag ; 
		var prama = {"ntwkLineNo":params.ntwkLineNo,"sFlog":sFlag};
		//console.log(prama);
		tmofInfoPop(prama, "A"+sFlag );  //일단 주석 		
    };
});