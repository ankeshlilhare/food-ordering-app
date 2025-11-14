package Jar.exception;

import Jar.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        ErrorResponse error = new ErrorResponse("Error", e.getMessage());
        HttpStatus status = determineHttpStatus(e.getMessage());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        ErrorResponse error = new ErrorResponse("Internal Server Error", 
            "An unexpected error occurred: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private HttpStatus determineHttpStatus(String message) {
        if (message != null) {
            String lowerMessage = message.toLowerCase();
            if (lowerMessage.contains("not found")) {
                return HttpStatus.NOT_FOUND;
            } else if (lowerMessage.contains("access denied") || lowerMessage.contains("unauthorized")) {
                return HttpStatus.FORBIDDEN;
            } else if (lowerMessage.contains("bad request") || lowerMessage.contains("invalid")) {
                return HttpStatus.BAD_REQUEST;
            }
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}

