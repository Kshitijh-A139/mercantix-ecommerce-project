package com.mercantix.app.userservices;

import com.mercantix.app.entities.User;

public interface AuthServiceContract {
	public User authenticate(String username, String password);
	public String generateToken(User user);
	public String generateNewToken(User user);
	public void saveToken(User user, String token);
}
