package com.example.demo.util; // Or a similar utility package

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Component
public class PasswordHasher implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        List<User> users = userRepository.findAll();
        boolean passwordsNeedHashing = false;

        for (User user : users) {
            // Check if the password is not already hashed (a simple heuristic)
            if (!user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$")) {
                passwordsNeedHashing = true;
                break;
            }
        }

        if (passwordsNeedHashing) {
            System.out.println("Hashing user passwords...");
            for (User user : users) {
                String rawPassword = user.getPassword();
                String encodedPassword = passwordEncoder.encode(rawPassword);
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
            }
            System.out.println("User passwords hashed successfully!");
        } else {
            System.out.println("User passwords are already hashed.");
        }
    }
}