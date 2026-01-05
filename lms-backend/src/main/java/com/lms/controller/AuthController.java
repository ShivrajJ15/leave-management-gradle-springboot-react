package com.lms.controller;

import com.lms.config.JwtTokenProvider;
import com.lms.dto.AuthRequest;
import com.lms.dto.CurrentUserDTO;
import com.lms.model.User;
import com.lms.service.CustomUserDetailsService;
import com.lms.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          UserService userService,
                          CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
    }

//    @GetMapping("/me")
//    public ResponseEntity<User> getCurrentUser() {
//       try{
//           User user = userService.getCurrentUser();
//           return ResponseEntity.ok(user);
//       } catch(Exception e){
//           System.out.println(e.getMessage());
//       }
//       return null;
//    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(convertToDTO(user));
    }


    private CurrentUserDTO convertToDTO(User user) {
        return new CurrentUserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLeaveBalances()
                // Add other needed fields
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.email(),
                        authRequest.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.email());

        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails.getUsername());

        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.refreshToken();

            // Validate the refresh token
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
            }

            // Get username from refresh token
            String username = jwtTokenProvider.extractUsername(refreshToken);

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Generate new access token
            String newAccessToken = jwtTokenProvider.generateToken(userDetails);

            // Return the new access token (refresh token remains the same)
            return ResponseEntity.ok(new TokenResponse(newAccessToken, refreshToken));

        } catch (ExpiredJwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired");
        } catch (JwtException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }



    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Get the token from the request
        String token = resolveToken(request);

        // Add token to blacklist
        jwtTokenProvider.invalidateToken(token);

        // Clear security context
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully");
    }

    // Helper method to resolve token
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // DTO for token responses
    public record TokenResponse(String accessToken, String refreshToken) {}

    // DTO for refresh token requests
    public record RefreshTokenRequest(String refreshToken) {}
}