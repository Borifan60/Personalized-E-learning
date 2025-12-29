package com.example.demo.userInfo;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/session")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SessionController {

    @GetMapping("/me")
    public Map<String, Object> getLoggedInUser(HttpSession session) {
        Map<String, Object> data = new HashMap<>();

        data.put("userId", session.getAttribute("USER_ID"));
        data.put("firstname", session.getAttribute("FIRSTNAME"));
        data.put("role", session.getAttribute("ROLE"));

        return data;
    }
}

