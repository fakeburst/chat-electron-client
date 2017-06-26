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
			var kost = '';
			for(var k = 0; k < msgs[i].username.length; k++){
				kost = kost + '&nbsp';
			}
            if(msgs[i].username === username)
                $('#messages').append($('<li>').html("<div id='textarea' class='msg user_msg' disabled readonly><span class='nick'>"+msgs[i].username+"</span><h1>" + kost+ emoji.emojify(msgs[i].content) + "</h1></div>"));
            else
                $('#messages').append($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly><span class='nick'>"+msgs[i].username+"</span><h1>" + kost + emoji.emojify(msgs[i].content) + "</h1></div>"));
        }
    })

    $('form').submit(function() {
		var kost = ' ';
			for(var k = 0; k < username.length; k++){
				kost = kost + '&nbsp';
			}
        socket.emit('chat message', $('#m').val());
		var toSend = "<div id='textarea' class='msg user_msg' disabled readonly><span class='nick'>"+username+"</span> <h1>" + kost + emoji.emojify($('#m').val()) + "</h1></div>";
		
		$('#messages').append($('<li>').html(toSend));
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
		var kost = ' ';
			for(var k = 0; k < msg.username.length; k++){
				kost = kost + '&nbsp';
			}
		var toShow = kost+emoji.emojify(msg.message);
        $('#messages').append($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly><span class='nick'>"+msg.username+"</span><h1>" + toShow + "</h1></div>"));
        var list = document.getElementsByClassName("msg");
        autosize(list[list.length - 1]);
    });

    socket.on('user disconnected', function(name) {
        $('.username:contains(' + name + ')').remove();
    });

    //TODO multiple users typing

    var typing = false;

    $("#m").keypress(function() {
		
        if (!typing){
            socket.emit('typing');
		}
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