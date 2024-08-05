package com.example.credittransfer.service;

import com.example.credittransfer.entity.UserSecurity;
import com.example.credittransfer.entity.Users;
import com.example.credittransfer.repository.UsersRepository;
import com.example.credittransfer.tempf.JwtService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    private final UsersRepository usersRepository;

    public AuthService(UsersRepository usersRepository, JwtService jwtService) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findByUsername(username).orElseThrow();
        return new UserSecurity(user);
    }




}
