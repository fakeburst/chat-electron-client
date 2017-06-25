$(document).ready(function() {
    var socket = io.connect('http://localhost:8080');

    socket.emit('logged', localStorage.getItem("nickname"));

    socket.on('current users', function(users) {
        for (var i = 0; i < users.length; i++) {
            $('#users').append($('<li class="username">').html(users[i]));
        }
    });

    socket.on('new user online', function(name) {
        $('#users').append($('<li class="username">').html(name));
    })

    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').html("<textarea class='msg' disabled readonly>" + msg + "</textarea>"));
        var list = document.getElementsByClassName("msg");
        autosize(list[list.length - 1]);
    });

    socket.on('user disconnected', function(name) {
        $('.username:contains(' + name + ')').remove();
    });

    $("#m").keypress(function() {
        console.log("Handler for .keypress() called.");
    });
});