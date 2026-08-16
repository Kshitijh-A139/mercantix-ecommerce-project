package com.mercantix.app.userserviceimplementations;

import com.mercantix.app.entities.Role;
import com.mercantix.app.entities.User;
import com.mercantix.app.exceptions.DuplicateResourceException;
import com.mercantix.app.userrepositories.UserRepository;
import com.mercantix.app.userservices.UserServiceContract;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserServiceContract {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public User registerUser(User user) {
        // Defensive: check both username and email before hitting the DB
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username '" + user.getUsername() + "' is already taken");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already registered");
        }

        try {
            if (user.getRole() == null) {
                user.setRole(Role.CUSTOMER);
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            // Race condition fallback (parallel registration with same username/email)
            throw new DuplicateResourceException("Username or email is already in use");
        }
    }

    @Override
    public User login(String username, String password) {
        // Authentication flows through Spring Security's AuthenticationManager in AuthController.
        throw new UnsupportedOperationException(
                "Use Spring Security AuthenticationManager (see AuthController#login)");
    }
}
