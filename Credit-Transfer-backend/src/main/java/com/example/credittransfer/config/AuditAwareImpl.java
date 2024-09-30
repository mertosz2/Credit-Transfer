package com.example.credittransfer.config;

import com.example.credittransfer.entity.UserSecurity;
import com.example.credittransfer.entity.Users;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


import java.util.Optional;

@Component("auditAwareImpl")
public class AuditAwareImpl implements AuditorAware {
    @Override
    public Optional<Users> getCurrentAuditor() {

        return Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getPrincipal)
                .filter(UserSecurity.class::isInstance)
                .map(UserSecurity.class::cast)
                .map(UserSecurity::getUsers);
    }
}
