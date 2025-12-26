package com.example.demo.userInfo;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/userInfo")
@CrossOrigin(origins = "http://localhost:3000")
public class Signup {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/Signup")
    public String registerUser(@RequestBody User user) {
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password: " + user.getPassword());

        if (user.getPassword() == null) {
            return "Error: Password is null!";
        }
        if (user.getRole() == null) {
            user.setRole("student");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "Signup successful!";
    }

}
