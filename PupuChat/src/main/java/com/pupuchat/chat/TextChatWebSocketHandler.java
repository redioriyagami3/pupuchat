package com.pupuchat.chat;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

public class TextChatWebSocketHandler extends AbstractWebSocketHandler {
	
	private static final Logger logger = LoggerFactory.getLogger(TextChatWebSocketHandler.class);
	
	private static final AtomicInteger totalUserCount = new AtomicInteger(0);
	
	private static final Map<String, Room> rooms = new ConcurrentHashMap<String, Room>();
	private static final Map<String, String> roomKeys = new ConcurrentHashMap<String, String>();

	public static int getTotalUserCount() {
		return totalUserCount.get();
	}
	
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        
        if (MyLog.INFO) logger.info("[OnOpen] session ID: " + session.getId());
        
        findStranger(session);
        
        totalUserCount.incrementAndGet();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        
        if (MyLog.INFO) logger.info("[OnClose] session ID: " + session.getId());
        
        String roomKey = roomKeys.get(session.getId());
		Room room = rooms.get(roomKey);
		
		if (room != null) {
			room.leave(session, true);
			rooms.remove(roomKey); 
		}
		
		totalUserCount.decrementAndGet();
    }

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		super.handleTextMessage(session, message);
		
		if (MyLog.INFO) logger.info("[OnMessage] session ID: " + session.getId()  + " | message: " +  message.getPayload());
		
		JSONObject json = new JSONObject(message.getPayload());
		String type = json.getString(Protocol.JSON_TYPE);
		
		if (type.equals(Protocol.NEW)) {
			findStranger(session);
		} else if (type.equals(Protocol.LEAVE)) { 
			String roomKey = roomKeys.get(session.getId()); 
			Room room = rooms.get(roomKey);  
			
			if (room != null) {
				room.leave(session, false); 
				rooms.remove(roomKey); 
			} 
		} else if (type.equals(Protocol.YOU_MSG)) {
			String roomKey = roomKeys.get(session.getId());
			Room room = rooms.get(roomKey);
			String msg = json.getString(Protocol.JSON_MSG);
			
			room.chat(session, msg);
		} else if (type.equals(Protocol.START_TYPING)) {
			String roomKey = roomKeys.get(session.getId());
			Room room = rooms.get(roomKey);
			
			room.startTyping(session);
		} else if (type.equals(Protocol.STOP_TYPING)) { 
			String roomKey = roomKeys.get(session.getId());
			Room room = rooms.get(roomKey);
			
			room.stopTyping(session);
		} 
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		super.handleTransportError(session, exception);
		
		if (MyLog.ERROR) logger.error("[OnError] session ID: " + session.getId() + " | Error: " + exception.toString());
	}
	
	private void findStranger(WebSocketSession session) {
		for (Map.Entry<String, Room> e : rooms.entrySet()) {
			Room room = e.getValue();
			
			if (room.getUserCount() == 1) {
				String roomKey = e.getKey();
				roomKeys.put(session.getId(), roomKey);
				room.join(session);
				
				return;
			}
		}
		
		String roomKey = session.getId();
		roomKeys.put(session.getId(), roomKey);
		Room room = new Room(session);
		rooms.put(roomKey, room);
	}
}


