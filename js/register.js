$(document).ready(function() {

    $('#register').click(function() {
        $.post("http://localhost:8080/register", $('form').serialize())
            .done(function(data) {
                if (!data.success) {
                    alert(data.msg, "Error");
                    return;
                }
                loginAction();
            });
        return false;
    });


    $('#back').click(function() {
        window.location.replace("login.html");
        event.preventDefault(); // disable normal form submit behavior
        return false;
    });
});


function loginAction() {

    window.location.replace("login.html");
    event.preventDefault(); // disable normal form submit behavior
    return false; // prevent further bubbling of event
}