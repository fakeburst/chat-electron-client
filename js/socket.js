$(document).ready(function() {
        var socket = io.connect('http://localhost:3000');
		
		
		
        $('form').submit(function() {
            socket.emit('chat message',$('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('chat message', function(msg) {
            $('#messages').append($('<li>').html("<textarea class='msg' disabled readonly>"+msg+"</textarea>"));
			var list = document.getElementsByClassName("msg");
			autosize(list[list.length-1]);
        });
		
		socket.emit('user connected',localStorage.getItem("nickname"));
		
		socket.on('user connected', function(name) {
            $('#users').append($('<li>').html("<a href='#"+name+"' >"+name+"</a>"));
        });
		
		socket.on('user disconnected', function(name) {
		
           // Remove disconnected user from list
		   
        });
    });