package com.smartcampus.gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        HttpStatusCode statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Internal server error";
        String errorCode = "INTERNAL_ERROR";

        if (ex instanceof ResponseStatusException) {
            ResponseStatusException rse = (ResponseStatusException) ex;
            statusCode = rse.getStatusCode();
            message = rse.getReason() != null ? rse.getReason() : "Error";
            errorCode = "HTTP_" + statusCode.value();
        } else if (ex instanceof IllegalArgumentException) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = ex.getMessage();
            errorCode = "INVALID_ARGUMENT";
        } else if (ex instanceof RuntimeException) {
            statusCode = HttpStatus.BAD_GATEWAY;
            message = "Service unavailable: " + ex.getMessage();
            errorCode = "SERVICE_UNAVAILABLE";
        }

        exchange.getResponse().setStatusCode(statusCode);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", statusCode.value());
        body.put("error", statusCode);
        body.put("message", message);
        body.put("errorCode", errorCode);
        body.put("path", exchange.getRequest().getPath().value());

        return exchange.getResponse().writeWith(
            Mono.fromCallable(() -> {
                byte[] bytes = objectMapper.writeValueAsBytes(body);
                return exchange.getResponse().bufferFactory().wrap(bytes);
            })
        );
    }
}
