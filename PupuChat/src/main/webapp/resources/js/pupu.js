window.onload = function() {
	if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
		document.getElementById('sns_panel_m').style.display = 'block';
		document.getElementById('chat_msg_panel').style.top = "4.5em";
		document.getElementById('chat_msg_panel').style.bottom = "3em";
		document.getElementById('chat_control_panel').style.height = "2.4em";
		document.getElementById('chat_control_panel').style.bottom = ".5em";
	} else { // PC
		document.getElementById('sns_panel').style.display = 'block';
		var totalUserCount = document.getElementById('online_count').firstChild.nodeValue;
		document.getElementById('online_count').innerHTML = totalUserCount.comma() + "+";
	}
}

function goMainPage() {
	location.reload(true);
}

function startTextChat() {
	document.getElementById('intro_view').style.display = 'none';
	document.getElementById('chat_view').style.display = 'block';
	
	textChat.initialize();
}

function startVideoChat() {
	alert('Video chat is coming soon!');
}

function hideKeypad() {
	document.activeElement.blur();
}

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.comma = function() {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
