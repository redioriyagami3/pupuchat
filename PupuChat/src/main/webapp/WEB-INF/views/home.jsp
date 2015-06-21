<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false" pageEncoding="utf-8"%>
<html>
<head>
<title>Pupu Chat: Free Random Chat</title>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="viewport"
	content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width, minimal-ui">
<meta name="description"
	content="Let's chat with random strangers! We hope you will meet great friends. Pupu Chat keeps you anonymous and you can stop chatting at anytime. Enjoy our 100% Free Random Chat!">

<meta name="google-site-verification"
	content="UhYvmpdmolsJoqjewUexTl7j6SqRRIi73DczV1mbhrg" />

<!-- Facebook -->
<meta property="fb:app_id" content="1564090080528848">
<meta property="og:title" content="Pupu Chat: Free Random Chat">
<meta property="og:site_name" content="Pupu Chat">
<meta property="og:type" content="website">
<meta property="og:url"
	content="http://randomchat-pupuchat.rhcloud.com/">
<meta property="og:image"
	content="http://randomchat-pupuchat.rhcloud.com/resources/image/logo2.png">
<meta property="og:description"
	content="Let's chat with random strangers! We hope you will meet great friends. Pupu Chat keeps you anonymous and you can stop chatting at anytime. Enjoy our 100% Free Random Chat!">

<link rel="icon" type="image/png" href="/resources/image/favicon.png">
<link rel="stylesheet" type="text/css" href="/resources/css/pupu.css">

<script type="text/javascript"
	src="http://cdn.oslikas.com/js/WebRTCO-1.0.4-beta-min.js"
	charset="utf-8"></script>
<script type="text/javascript" src="/resources/js/pupu.js"></script>
<script type="text/javascript" src="/resources/js/text_chat.js"></script>
</head>
<body>
	<div id="header">
		<div id="logo" onclick="goMainPage()">
			<script type="text/javascript"> 
			if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
				document.write('<img class="logo_img_m" src="/resources/image/logo.png" alt="Pupu">');
			} else { // PC
				document.write('<img class="logo_img" src="/resources/image/logo.png" alt="Pupu">');
			}
			</script>
		</div>
		<div id="fb-root"></div>
		<div id="sns_panel">
			<div id="online_count_area">
				<strong id="online_count">${totalUserCount}</strong> online now
			</div>
			<div id="fb_area" class="fb-like fb_like_large"
				data-href="http://randomchat-pupuchat.rhcloud.com/" data-width="300"
				data-layout="button_count" data-action="like" data-show-faces="true"
				data-share="true"></div>
		</div>
		<div id="sns_panel_m">
			<div id="fb_area_m" class="fb-like fb_like_large"
				data-href="http://randomchat-pupuchat.rhcloud.com/" data-width="300"
				data-layout="button_count" data-action="like" data-show-faces="true"
				data-share="true"></div>
		</div>
	</div>

	<div id="intro_view">
		<script type="text/javascript"> 
		if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
			document.write(
				'<div id="chat_type_panel_m">' +
				'<h2 id="chat_type_text">Random Chat :</h2>' +
				'<button id="start_text_chat_btn" class="start_chat_btn_m enable_btn_gradient" onclick="startTextChat()">Start a Chat</button>' +
				'</div>'
			);
		} else { // PC
			document.write(
				'<div id="chat_type_panel">' +
					'<table id="chat_type_table">' +
			        	'<tr>' +
			            	'<td colspan="3"><h2 id="chat_type_text">Random Chat :</h2></td>' +
		               	'</tr>' +
		                '<tr>' +	
			            	'<td><button id="start_text_chat_btn" class="start_chat_btn enable_btn_gradient" onclick="startTextChat()">Text</button></td>' +
			            	'<td><h2 id="chat_type_text_or">or</h2></td>' +
			            	'<td><button id="start_video_chat_btn" class="start_chat_btn disable_btn_gradient" onclick="startVideoChat()">Video</button></td>' + 
		               	'</tr>' +
	              	'</table>' +
                  '</div>'
        	);
		}
		</script>
		<div>
			<p>Let's chat with random strangers! We hope you will meet great
				friends. Pupu Chat keeps you anonymous and you can stop chatting at
				anytime. Enjoy our 100% Free Random Chat!</p>
		</div>
	</div>

	<div id="chat_view">
		<div id="chat_msg_panel" onclick="hideKeypad()">
			<script type="text/javascript"> 
				if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
					document.write('<div id="chat_msg_area" class="chat_msg_area_m"></div>');
				} else { // PC
					document.write('<div id="chat_msg_area" class="chat_msg_area_p"></div>');
				}
			</script>
		</div>
		<div id="chat_control_panel">
			<table id="chat_control_table">
				<tr>
					<td><script type="text/javascript"> 
						if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
							document.write(
								'<button id="text_chat_new_btn" class="left_btn_m new_btn enable_btn_gradient" onclick="textChat.clickLeftBtn()">New</button>' +
								'<button id="text_chat_stop_btn" class="left_btn_m stop_btn" onclick="textChat.clickLeftBtn()">Stop</button>' +
								'<button id="text_chat_really_btn" class="left_btn_m really_btn" onclick="textChat.clickLeftBtn()">Really?</button>'
							);
						} else { // PC
							document.write(
								'<button id="text_chat_new_btn" class="left_btn new_btn enable_btn_gradient" onclick="textChat.clickLeftBtn()">New<div class="shortcut_text">Esc</div></button>' +
								'<button id="text_chat_stop_btn" class="left_btn stop_btn" onclick="textChat.clickLeftBtn()">Stop<div class="shortcut_text">Esc</div></button>' +
							    '<button id="text_chat_really_btn" class="left_btn really_btn" onclick="textChat.clickLeftBtn()">Really?<div class="shortcut_text">Esc</div></button>'
							);
						}
						</script></td>
					<td class="wide_td"><script type="text/javascript"> 
							if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
								document.write('<textarea id="chat_text_area" class="chat_text_area_m" disabled></textarea>');
							} else { // PC
								document.write('<textarea id="chat_text_area" class="chat_text_area_p" disabled></textarea>');
							}
						</script></td>
					<td><script type="text/javascript"> 
						if (window.devicePixelRatio && window.devicePixelRatio > 1) { // Mobile
							document.write('<button id="text_chat_send_btn" class="right_btn_m send_btn" onclick="textChat.clickRightBtn()">Send</button>');
						} else { // PC
							document.write('<button id="text_chat_send_btn" class="right_btn send_btn" onclick="textChat.clickRightBtn()">Send<div class="shortcut_text">Enter</div></button>');
						}
						</script></td>
				</tr>
			</table>
		</div>
	</div>

	<!-- Facebook -->
	<script>
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
	  	if (d.getElementById(id)) return;
	  	js = d.createElement(s); js.id = id;
	  	js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
	  	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	</script>

</body>
</html>