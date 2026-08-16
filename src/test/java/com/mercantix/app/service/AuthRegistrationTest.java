package com.mercantix.app.service;

import com.mercantix.app.dto.RegisterRequest;
import com.mercantix.app.entities.Role;
import com.mercantix.app.entities.User;
import com.mercantix.app.security.JwtService;
import com.mercantix.app.usercontrollers.AuthController;
import com.mercantix.app.userrepositories.UserRepository;
import com.mercantix.app.userserviceimplementations.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Guards the privilege-escalation fix: public self-registration must always
 * create a CUSTOMER, regardless of any client input.
 */
@ExtendWith(MockitoExtension.class)
class AuthRegistrationTest {

    @Mock AuthenticationManager authenticationManager;
    @Mock JwtService            jwtService;
    @Mock UserService           userService;
    @Mock UserRepository        userRepository;

    @Test
    void register_alwaysCreatesCustomerRole() {
        AuthController controller = new AuthController(
                authenticationManager, jwtService, userService, userRepository);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        when(userService.registerUser(captor.capture()))
                .thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateToken(anyString(), any(Role.class))).thenReturn("jwt");

        RegisterRequest req = new RegisterRequest();
        req.setUsername("mallory");
        req.setEmail("mallory@example.com");
        req.setPassword("password");

        controller.register(req);

        assertThat(captor.getValue().getRole()).isEqualTo(Role.CUSTOMER);
    }
}
