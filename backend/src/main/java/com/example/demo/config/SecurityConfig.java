package com.example.demo.config;

import com.example.demo.userInfo.CorsConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // ✅ PUBLIC ENDPOINTS (FIXED)
                        .requestMatchers(
                                "/userInfo/login",      // ✅ CORRECT
                                "/userInfo/Signup",
                                "/users/**",
                                "/courses/**",
                                "/lessons/**",
                                "/files/**",
                                "/enrollments/enroll/**",
                                "/enrollments/my**",
                                "/enrollments/quiz",
                                "/activity/complete/**",
                                "/activity/completed/my",
                                "/recommendations/**",
                                "/lessons/update-level/**",
                                "/lessons/recommend-next/**",
                                "/lessons/personalized/**"

                        ).permitAll()

                        .anyRequest().authenticated()
                )
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // OK
    }
}
