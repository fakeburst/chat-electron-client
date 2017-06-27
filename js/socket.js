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

    socket.on('load more', function(data) {
		console.log(data);
        if(data === "Already all messages"){
            $('#messages').prepend($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly><span class='nick'>SYSTEM</span><h1>" + data + "</h1></div>"));
            return;
        }
        for (var i = data.length - 1; i >= 0; i--) {
			
			var kost = ' ';
			for(var k = 0; k < data[i].username.length; k++){
				kost = kost + '&nbsp';
			}
			var toShow = kost+emoji.emojify(data[i].content);
			
            if(data[i].username === username)
                $('#messages').prepend($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly><span class='nick'>"+data[i].username+"</span><h1>" + toShow + "</h1></div>"));
            else
                $('#messages').prepend($('<li>').html("<div id='textarea' class='msg other_msg' disabled readonly><span class='nick'>"+data[i].username+"</span><h1>" + toShow + "</h1></div>"));
        }
    })

    $('#exit').click(function(event) {
        console.log("exit");
        require('electron').remote.getCurrentWindow().close();
        event.stopPropagation();
    });
	
	 $('.load').click(function() {
		 console.log('tap');
		socket.emit('load more');
	 });
});