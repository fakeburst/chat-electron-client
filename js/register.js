$(document).ready(function() {
  
    $('#register').click(function() {
        
		// TO DO ACTION
		
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