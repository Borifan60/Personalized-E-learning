package com.example.demo.userInfo;
import com.example.demo.security.CustomUserDetails;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/userInfo")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {

    private final AuthenticationManager authenticationManager;

    public LoginController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest,
            HttpSession session
    ) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );

            CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

            // ✅ STORE IN SESSION
            session.setAttribute("USER_ID", user.getId());
            session.setAttribute("FIRSTNAME", user.getFirstname());
            session.setAttribute("ROLE", user.getRole());

            return ResponseEntity.ok(
                    new LoginResponse(
                            "Login successful",
                            user.getFirstname(),
                            user.getRole()
                    )
            );

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid email or password"));
        }
    }

    // ✅ DTOs
    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String message, String firstname, String role) {}
    public record ErrorResponse(String message) {}
}
