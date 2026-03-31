package com.mercantix.app.userservices;

import com.mercantix.app.entities.User;

public interface UserServiceContract {
	public User registerUser(User user);
	public User login(String username, String password);
}
