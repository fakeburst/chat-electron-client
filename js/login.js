


function loginAction() {

		localStorage.setItem("nickname", $( "input[name=user_login]" ).val());
		
		
		// WAITING FOR HTTP RESPONSE
		
		window.location.replace("main_page.html");
        event.preventDefault(); // disable normal form submit behavior
        return false; // prevent further bubbling of event
		
      }
	  
	  
	  $(function(){
			if(localStorage.getItem("nickname")!==null){
				$("#user_login").val(localStorage.getItem("nickname"));
			}
        });