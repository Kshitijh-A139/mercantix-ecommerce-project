package com.mercantix.app.responses;

import com.mercantix.app.entities.User;

public class RegisterResponse {

    private String message;
    private User user;

    public RegisterResponse(String message, User user) {
    	super();
    	this.message = message;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }
}
