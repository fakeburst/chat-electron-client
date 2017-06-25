$(document).ready(function() {
    if (localStorage.getItem("nickname") !== null) {
        $("#user_login").val(localStorage.getItem("nickname"));
    }

    $('#login').click(function() {
        console.log($('form').serialize());
        $.post("http://localhost:3000/login", $('form').serialize())
            .done(function(data) {
                alert("Data Loaded: " + JSON.stringify(data));
                loginAction();
            });
        return false;
    })
});


function loginAction() {

    localStorage.setItem("nickname", $("input[name=user_login]").val());

    window.location.replace("main_page.html");
    event.preventDefault(); // disable normal form submit behavior
    return false; // prevent further bubbling of event
}