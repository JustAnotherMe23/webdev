$("#plus").click(function(){
	$("#input").slideToggle("noHeight");
});


$("#add").keypress(function(e) {
    if(e.which == 13 && $(this).val() != "") {
        var a = $(this).val();
        $(this).val("");

        $(".trash").unbind();

        $("#container").append("<h3 class=\"space\"><span class=\"trash\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></span><span class=\"text\">" + a + "</span></h3>");
        $(".trash").on("click", function() {
			$(this).parent().remove();
			event.stopPropagation();
		});
		$(".text").on("click", function() {
			$(this).toggleClass("crossout");

		});
    }
});


$(".trash").on("click", function() {
	alert("stuff");
});