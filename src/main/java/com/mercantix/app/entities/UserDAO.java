package com.mercantix.app.entities;

public class UserDAO {
	int userid;
	String username;
	String email;
	String role;
	
	public UserDAO() {
		super();
	}
	
	public UserDAO(String username, String email, String role) {
		super();
		this.username = username;
		this.email = email;
		this.role = role;
	}
	
	public UserDAO(int userid, String username, String email, String role) {
		super();
		this.userid = userid;
		this.username = username;
		this.email = email;
		this.role = role;
	}
	
	
}
