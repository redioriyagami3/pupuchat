var textChat = {};

textChat.socket = null;
textChat.isTyping = false;

textChat.initialize = function() {
	textChat.changeLeftButton('new');
	
	if (window.location.port == 8080) {
		if (window.location.protocol == 'http:') {
	        textChat.connect('ws://' + window.location.host + '/text_chat');
	    } else {
	        textChat.connect('wss://' + window.location.host + '/text_chat');
	    }
	} else {
		if (window.location.protocol == 'http:') {
	        textChat.connect('ws://' + window.location.host + ':8000/text_chat');
	    } else {
	        textChat.connect('wss://' + window.location.host + ':8443/text_chat');
	    }
	}
};

textChat.connect = function(host) {
    if ('WebSocket' in window) {
        textChat.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        textChat.socket = new MozWebSocket(host);
    } else {
        alert('Error: WebSocket is not supported by this browser.');
        return;
    }

    textChat.socket.onopen = function () {  	
        document.getElementById('chat_text_area').onkeydown = function(event) {
            if (event.keyCode == 13) { // Enter Key
            	event.returnValue = false;  
            
            	textChat.clickRightBtn();
            } else {
            	var message = document.getElementById('chat_text_area').value;
          
	        	if ((event.keyCode != 8) && (message.length == 1) && (textChat.isTyping == false)) {	
	        		textChat.isTyping = true;
	        		textChat.sendMessage('start_typing');
	        	} else if ((event.keyCode == 8) && (message.length == 1) && (textChat.isTyping == true)) {
	        		textChat.isTyping = false;
	        		textChat.sendMessage('stop_typing');
	        	}
            }
        };
        
        document.onkeydown = function(event) {
            if (event.keyCode == 27) { // Esc Key
            	textChat.clickLeftBtn();
            }
        };
    };

    textChat.socket.onclose = function () {
        document.getElementById('chat_text_area').onkeydown = null;
        document.getElementById('chat_view').onkeydown = null;
        
        location.reload(true);
    };

    textChat.socket.onmessage = function (message) {
        var json = JSON.parse(message.data);
        
        switch (json.type) {
	        case "new":
	        	textChat.changeLeftButton('new');
	        	
	        	document.getElementById('text_chat_new_btn').disabled = true;
	        	document.getElementById('text_chat_send_btn').disabled = true;
	        	document.getElementById('chat_text_area').disabled = true;
	        	document.getElementById('chat_text_area').value = '';
	        	document.getElementById('chat_text_area').focus();
	        	
	        	textChat.clearMessage();
	        	textChat.addStatusMessage(json.msg);
	        	break;
	        case "join":
	        	textChat.changeLeftButton('stop');
	
	        	document.getElementById('text_chat_send_btn').disabled = false;
	        	document.getElementById('chat_text_area').disabled = false;
	        	document.getElementById('chat_text_area').value = '';
	        	document.getElementById('chat_text_area').focus();
	        	
	        	textChat.clearMessage();
	        	textChat.addStatusMessage(json.msg);
	        	break;
	        case "leave":
	        	textChat.changeLeftButton('new');
	        	
	        	document.getElementById('text_chat_new_btn').disabled = false;
	        	document.getElementById('text_chat_send_btn').disabled = true;
	        	document.getElementById('chat_text_area').disabled = true;
	        	
	        	textChat.addStatusMessage(json.msg);
	        	break;
	        case "you_msg":
	        	textChat.addYouMessage(json.msg);
	            break;
	        case "stranger_msg":
	        	textChat.addStrangerMessage(json.msg);
	            break;
	        case "start_typing":
	        	textChat.addTypingMessage(json.msg);
	        	break;
	        case "stop_typing":
	        	textChat.removeTypingMessage();
	            break;
	        case "total_user_count":
	        	document.getElementById('online_count').innerHTML = json.msg.comma() + "+";
	        	break;
	        default:
				console.log("Error: Invalid type: " + json.type);
				break;
	    }
    };
}

textChat.clickLeftBtn = function() {
	if (document.getElementById('text_chat_new_btn').style.display == 'block') {
		var isDisabled = document.getElementById('text_chat_new_btn').disabled;
    	
    	if (isDisabled == false) {
    		textChat.sendMessage('new');
    	}
	} else if (document.getElementById('text_chat_stop_btn').style.display == 'block') {
		textChat.changeLeftButton('really');
	} else if (document.getElementById('text_chat_really_btn').style.display == 'block') {
		textChat.sendMessage('leave');
	}
	
	document.getElementById('chat_text_area').focus();
}

textChat.clickRightBtn = function() {
	textChat.isTyping = false;
	textChat.sendMessage('stop_typing');
	
	var message = document.getElementById('chat_text_area').value.trim();
	
	if (message != '') {	
		textChat.sendMessage('you_msg');
	} 
	
	if (document.getElementById('text_chat_really_btn').style.display == 'block') {
		textChat.changeLeftButton('stop');
	}
	
	document.getElementById('chat_text_area').value = '';
	document.getElementById('chat_text_area').focus();
}


textChat.sendMessage = function(type) {
	var json;
	
	switch (type) {
		case "new":
			json = {type: "new", msg: ""};
			break;
		case "leave":
			json = {type: "leave", msg: ""};
			break;
		case "you_msg":
			var message = document.getElementById('chat_text_area').value;
			json = {type: "you_msg", msg: message};
		    break;
		case "start_typing":
			json = {type: "start_typing", msg: ""};
			break;
		case "stop_typing":
			json = {type: "stop_typing", msg: ""};
		    break;
		default:
			console.log("Error: Invalid type: " + type);
			return;
	}
	
	textChat.socket.send(JSON.stringify(json));
}

textChat.addStatusMessage = function(msg) {
   textChat.addMessage('<p class="status_msg">' + msg + '</p>');
}

textChat.addYouMessage = function(msg) {
	textChat.addMessage('<p class="you_msg"><strong>You: </strong><span class="normal_msg">' + msg + '</span></p>');
	
	var typingMsg = document.getElementsByClassName("typing_msg");
	if (typingMsg[0]) {
		var msgList = document.getElementById('chat_msg_area');
		var typingMsgDiv =  typingMsg[0].parentNode.cloneNode(true);
		
		msgList.removeChild(typingMsg[0].parentNode);
		msgList.appendChild(typingMsgDiv);
		msgList.scrollTop = msgList.scrollHeight;
	}
}

textChat.addStrangerMessage = function(msg) {
	textChat.addMessage('<p class="stranger_msg"><strong>Stranger: </strong><span class="normal_msg">' + msg + '</span></p>');
}

textChat.addTypingMessage = function(msg) {
	textChat.addMessage('<p class="status_msg typing_msg">' + msg + '</p>');
}

textChat.removeTypingMessage = function() { 
	var msgList = document.getElementById("chat_msg_area");
	var typingMsg = document.getElementsByClassName("typing_msg");
	
	if (typingMsg[0]) {
		typingMsg[0].parentNode.parentNode.removeChild(typingMsg[0].parentNode);
		msgList.scrollTop = msgList.scrollHeight;
	}
}

textChat.addMessage = function(msg) {
	var msgList = document.getElementById('chat_msg_area');
    var div = document.createElement('div');
    
    div.className = 'chat_msg';
    div.innerHTML = msg;
    
    msgList.appendChild(div);
    msgList.scrollTop = msgList.scrollHeight;
}

textChat.clearMessage = function(msg) {
	var msgList = document.getElementById("chat_msg_area");
	
	while (msgList.firstChild) {
		msgList.removeChild(msgList.firstChild);
	}
	
	textChat.isTyping = false;
}

textChat.changeLeftButton = function(type) {
	document.getElementById('text_chat_new_btn').style.display = 'none';
	document.getElementById('text_chat_stop_btn').style.display = 'none';
	document.getElementById('text_chat_really_btn').style.display = 'none';
	
	switch (type) {
		case "new":
			document.getElementById('text_chat_new_btn').style.display = 'block';
			break;
		case "stop":
			document.getElementById('text_chat_stop_btn').style.display = 'block';
			break;
		case "really":
			document.getElementById('text_chat_really_btn').style.display = 'block';
		    break;
		default:
			console.log("Error: Invalid type: " + type);
			break;
	}
}

