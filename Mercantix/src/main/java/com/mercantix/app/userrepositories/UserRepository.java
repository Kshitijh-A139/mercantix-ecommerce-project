package com.mercantix.app.userrepositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mercantix.app.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	Optional<User> findByEmail(String email);
	Optional<User> findByUsername(String username);
}
