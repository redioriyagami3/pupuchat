package com.pupuchat.chat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	private static final Logger logger = LoggerFactory
			.getLogger(WebSocketConfig.class);

	private static final int MAX_TEXT_BUF_SIZE = 1024; // 1KB
	private static final int MAX_BINARY_BUF_SIZE = 2 * 1024 * 1024; // 2MB
	private static final int MAX_SESSION_IDLE_TIMEOUT = 10 * 60 * 1000; // 10
																		// Min

	@Override
	public void registerWebSocketHandlers(
			final WebSocketHandlerRegistry registry) {
		registry.addHandler(textChatWebSocketHandler(), "/text_chat")
				.addInterceptors(new HttpSessionHandshakeInterceptor());
	}

	@Bean
	public TextChatWebSocketHandler textChatWebSocketHandler() {
		return new TextChatWebSocketHandler();
	}

	@Bean
	public ServletServerContainerFactoryBean createWebSocketContainer() {
		logger.info("createWebSocketContainer()");

		final ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();

		container.setMaxTextMessageBufferSize(MAX_TEXT_BUF_SIZE);
		container.setMaxBinaryMessageBufferSize(MAX_BINARY_BUF_SIZE);
		container.setMaxSessionIdleTimeout(MAX_SESSION_IDLE_TIMEOUT);

		return container;
	}
}
