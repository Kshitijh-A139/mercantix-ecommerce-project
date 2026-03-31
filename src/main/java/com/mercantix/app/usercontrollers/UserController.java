package com.mercantix.app.usercontrollers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercantix.app.entities.LoginRequest;
import com.mercantix.app.entities.User;
import com.mercantix.app.entities.UserDAO;
import com.mercantix.app.responses.RegisterResponse;
import com.mercantix.app.userservices.UserServiceContract;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserServiceContract userService;

    public UserController(UserServiceContract userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        User registeredUser = userService.registerUser(user);

        return ResponseEntity.ok(
        		new RegisterResponse("User registered successfully", registeredUser)
        );
    }
    
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return userService.login(request.getUsername(), request.getPassword());
    }

}
