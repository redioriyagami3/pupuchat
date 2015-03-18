package com.pupuchat.chat;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

public class Room {

	private static final Logger logger = LoggerFactory.getLogger(Room.class);

	private static final String MSG_NEW = "Looking for a random stranger...";
	private static final String MSG_JOIN = "You're now chatting with a random stranger. Say hi!";
	private static final String MSG_YOU_LEAVE = "You have disconnected.";
	private static final String MSG_STRANGER_LEAVE = "Stranger has disconnected.";
	private static final String MSG_TYPING = "Stranger is typing...";

	private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<WebSocketSession>();
	private int userCount = 0;

	public Room(final WebSocketSession session) {
		make(session);
	}

	private void make(final WebSocketSession session) {
		sessions.add(session);
		userCount = 1;

		sendMessage(session, Protocol.NEW, Room.MSG_NEW);
	}

	public void join(final WebSocketSession session) {
		sessions.add(session);
		userCount++;

		for (final WebSocketSession s : sessions) {
			sendMessage(s, Protocol.JOIN, Room.MSG_JOIN);
		}
	}

	public void leave(final WebSocketSession session, final boolean disconnected) {
		if (disconnected == true) {
			sessions.remove(session);
		}

		for (final WebSocketSession s : sessions) {
			if (s.getId().equals(session.getId())) {
				sendMessage(s, Protocol.LEAVE, Room.MSG_YOU_LEAVE);
			} else {
				sendMessage(s, Protocol.LEAVE, Room.MSG_STRANGER_LEAVE);
			}

			sendMessage(
					s,
					Protocol.TOTAL_USER_COUNT,
					String.valueOf(TextChatWebSocketHandler.getTotalUserCount()));
		}
	}

	public void chat(final WebSocketSession session, final String message) {
		for (final WebSocketSession s : sessions) {
			if (s.getId().equals(session.getId())) {
				sendMessage(s, Protocol.YOU_MSG, message);
			} else {
				sendMessage(s, Protocol.STRANGER_MSG, message);
			}
		}
	}

	public void startTyping(final WebSocketSession session) {
		for (final WebSocketSession s : sessions) {
			if (!s.getId().equals(session.getId())) {
				sendMessage(s, Protocol.START_TYPING, Room.MSG_TYPING);
			}
		}
	}

	public void stopTyping(final WebSocketSession session) {
		for (final WebSocketSession s : sessions) {
			if (!s.getId().equals(session.getId())) {
				sendMessage(s, Protocol.STOP_TYPING, "");
			}
		}
	}

	private void sendMessage(final WebSocketSession session, final String type,
			final String message) {
		try {
			final JSONObject json = new JSONObject();

			json.put(Protocol.JSON_TYPE, type);
			json.put(Protocol.JSON_MSG, message);

			session.sendMessage(new TextMessage(json.toString()));
		} catch (final JSONException e) {
			e.printStackTrace();
		} catch (final IOException e) {
			e.printStackTrace();
		}
	}

	public int getUserCount() {
		return userCount;
	}
}
