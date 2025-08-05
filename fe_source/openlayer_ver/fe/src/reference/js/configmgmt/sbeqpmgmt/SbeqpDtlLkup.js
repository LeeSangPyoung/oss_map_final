var sbeqpDtlLkup = $a.page(function() {
//	window.resizeTo(900,700);
	$a.maskedinput($('#mnftDtReg')[0], '0000-00-00');

	this.calculateDate = function(option){

		var current_date = new Date();
  		var option_date = new Date(Date.parse(current_date) - option * 1000 * 60 * 60 * 24);

  		var option_Year = option_date.getFullYear();
  		var option_Month = (option_date.getMonth()+1)>9 ? ''+(option_date.getMonth()+1) : '0'+(option_date.getMonth()+1);
  		var option_Day = option_date.getDate() > 9 ? '' + option_date.getDate() : '0' + option_date.getDate();

  		return option_Year + '-' + option_Month + '-' + option_Day;
	};
});
