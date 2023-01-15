$(document).ready(function(){

	$(".item").click(function(){
		$(".summary").animate({width: 'hide', padding: 'hide'});
		if ($(this).next().is(":hidden")) {
			$(this).next().animate({
				width: 'show',
				padding: 'show'
			});
		} else {
			$(this).next().animate({
				width: 'hide',
				padding: 'hide'
			});
		}
	});

});
