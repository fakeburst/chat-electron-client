var _ = require('underscore');

$(document).ready(function() {
    var socket = io.connect('http://localhost:8080');
    var username = localStorage.getItem("nickname");

    socket.emit('logged', username);

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
		$('#messages').append($('<li>').html("<div id='textarea' class='msg user_msg' disabled readonly>" + $('#m').val() + "</div>"));
        $('#m').val('');
		 return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly>" + msg + "</div>"));
        var list = document.getElementsByClassName("msg");
        autosize(list[list.length - 1]);
    });

    socket.on('user disconnected', function(name) {
        $('.username:contains(' + name + ')').remove();
    });

    //TODO multiple users typing

    $("#m").keypress(function() {
        socket.emit('typing');
    });

    socket.on('typing', function(name) {
        $("#typing").html(name + " is typing");
    })

    $("#m").keyup(_.debounce(function(){
        socket.emit('stop typing');
    } , 1000));

    socket.on('stop typing', function(name) {
        $("#typing").html("");
    })
});