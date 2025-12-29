package com.example.demo.security;

import com.example.demo.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private Long id;           // ✅ add userId
    private String email;
    private String password;
    private String role;
    private String firstname; // optional
    private String lastname;  // optional

    public CustomUserDetails(User user) {
        this.id = user.getUserId();       // ✅ map from entity
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
    }

    // ✅ new getter
    public Long getId() {
        return id;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null; // or map role to authorities
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
