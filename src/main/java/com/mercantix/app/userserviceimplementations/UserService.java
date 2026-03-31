package com.mercantix.app.userserviceimplementations;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.mercantix.app.entities.User;
import com.mercantix.app.userrepositories.UserRepository;
import com.mercantix.app.userservices.UserServiceContract;

@Service
public class UserService implements UserServiceContract {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // ✅ Constructor injection
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ REGISTER USER
    @Override
    public User registerUser(User user) {

        // Check duplicate username
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username is already taken"
            );
        }

        try {
            // ✅ CRITICAL FIX → hash password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            return userRepository.save(user);

        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username is already taken"
            );
        }
    }

	@Override
	public User login(String username, String password) {
		// TODO Auto-generated method stub
		return null;
	}

    // ❌ LOGIN REMOVED (use AuthService instead)
}