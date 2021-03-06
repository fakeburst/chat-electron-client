$(document).ready(function() {
    if (localStorage.getItem("nickname") !== null) {
        $("#user_login").val(localStorage.getItem("nickname"));
    }

    $('#login').click(function() {
        $.post("http://localhost:8080/login", $('form').serialize())
            .done(function(data) {
                if(!data.success){
                    alert(data.msg, "Error");
                    return;
                }
                loginAction();
            });
        return false;
    })
	
	$('#register').click(function() {
		window.location.replace("register.html");
		event.preventDefault(); // disable normal form submit behavior
        return false;
    })
});


function loginAction() {

    localStorage.setItem("nickname", $("input[name=user_login]").val());

    window.location.replace("main_pageV2.html");
    event.preventDefault(); // disable normal form submit behavior
    return false; // prevent further bubbling of event
}