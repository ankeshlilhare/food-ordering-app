package Jar.controller;

import Jar.config.JwtUtil;
import Jar.dto.ErrorResponse;
import Jar.dto.LoginRequest;
import Jar.dto.LoginResponse;
import Jar.entity.User;
import Jar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {

        System.out.println("Login attempt for user: " + loginRequest.getUsername());

        try {
            // 1. Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            System.out.println("Authentication failed: Bad credentials");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Unauthorized", "Incorrect username or password"));
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error", "Authentication error: " + e.getMessage()));
        }

        try {
            // 2. Get user details
            final User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            // 3. Get role and country
            String role = user.getRole().getName();
            Integer countryId = (user.getCountry() != null) ? user.getCountry().getId() : null;

            // 4. Generate JWT
            final String jwt = jwtUtil.generateToken(user.getUsername(), role, countryId);

            System.out.println("JWT generated successfully for user: " + user.getUsername());

            // 5. Return response
            return ResponseEntity.ok(new LoginResponse(jwt));

        } catch (Exception e) {
            System.out.println("Error generating token: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error", "Error generating token"));
        }
    }
}