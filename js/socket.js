var _ = require('underscore');

$(document).ready(function() {
    //var socket = io.connect('https://chat-server1337.mybluemix.net');
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

    socket.on('last messages', function(msgs) {
        console.log(msgs)
        for (var i = 0; i < msgs.length; i++) {
            if(msgs[i].username === username)
                $('#messages').append($('<li>').html("<div id='textarea' class='msg user_msg' disabled readonly>" + msgs[i].content + "</div>"));
            else
                $('#messages').append($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly>" + msgs[i].content + "</div>"));
        }
    })

    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#messages').append($('<li>').html("<div id='textarea' class='msg user_msg' disabled readonly>" + $('#m').val() + "</div>"));
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly>" + msg.message + "</div>"));
        var list = document.getElementsByClassName("msg");
        autosize(list[list.length - 1]);
    });

    socket.on('user disconnected', function(name) {
        $('.username:contains(' + name + ')').remove();
    });

    //TODO multiple users typing

    var typing = false;

    $("#m").keypress(function() {
        if (!typing)
            socket.emit('typing');
        typing = true;
    });

    socket.on('typing', function(name) {
        $("#typing").append('<div id="' + name + '">' + name + ' is typing</div>');
    })

    $("#m").keyup(_.debounce(function() {
        socket.emit('stop typing');
        typing = false;
    }, 1000));

    socket.on('stop typing', function(name) {
        $("#" + name).remove();
    })
});