package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.UsersRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.Users;
import com.example.credittransfer.exception.ExistByFirstNameAndLastName;
import com.example.credittransfer.exception.ExistByPhoneNumber;
import com.example.credittransfer.exception.ExistByUsername;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.repository.RolesRepository;
import com.example.credittransfer.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsersService {
    private final UsersRepository usersRepository;
    private final RolesRepository rolesRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsersService(UsersRepository usersRepository, RolesRepository rolesRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<DropDown> getRoleDropdown() {
        return rolesRepository.getRoleDropdown();
    }

    @Transactional
    public ResponseAPI createUser(UsersRequest request) {
        Users users = new Users();

        if (!Objects.isNull(request)) {
            if (usersRepository.existsByUsername(request.getUsername())) {
                throw new ExistByUsername(request.getUsername());
            }
            if (usersRepository.existsByFirstNameAndLastName(request.getFirstName(), request.getLastName())) {
                throw new ExistByFirstNameAndLastName(request.getFirstName(), request.getLastName());
            }
            if (usersRepository.existsByPhone(request.getPhone())) {
                throw new ExistByPhoneNumber(request.getPhone());
            }
            users.setUsername(request.getUsername());
            users.setPassword(passwordEncoder.encode(request.getPassword()));
            users.setFirstName(request.getFirstName());
            users.setLastName(request.getLastName());
            users.setPhone(request.getPhone());
            users.setActive(true);
            users.setRole(rolesRepository.findById(request.getRole()).orElseThrow());
            usersRepository.save(users);
        }
        return new ResponseAPI(HttpStatus.CREATED, "สร้างบัญชีสำเร็จ");
    }

    @Transactional
    public ResponseAPI updateUser(UsersRequest request, Integer userId) {
        Users users = usersRepository.findById(userId).orElseThrow();

        if (!Objects.isNull(request)) {
            if (usersRepository.existsByUsername(request.getUsername()) && !Objects.equals(users.getUsername(), request.getUsername())) {
                throw new ExistByUsername(request.getUsername());
            }
            if (usersRepository.existsByFirstNameAndLastName(request.getFirstName(), request.getLastName())) {
                throw new ExistByFirstNameAndLastName(request.getFirstName(), request.getLastName());
            }
            if (usersRepository.existsByPhone(request.getPhone())) {
                throw new ExistByPhoneNumber(request.getPhone());
            }
            users.setUsername(request.getUsername());
            users.setPassword(passwordEncoder.encode(request.getPassword()));
            users.setFirstName(request.getFirstName());
            users.setLastName(request.getLastName());
            users.setPhone(request.getPhone());
            users.setRole(rolesRepository.findById(request.getRole()).orElseThrow());
            usersRepository.save(users);
        }
        return new ResponseAPI(HttpStatus.OK, "อัพเดทบัญชีสำเร็จ");
    }

    @Transactional
    public ResponseAPI deleteUser(Integer userId) {
        Optional<Users> users = usersRepository.findById(userId);
        if (users.isPresent()) {
            usersRepository.deleteUsersByUsersId(userId);
            return new ResponseAPI(HttpStatus.OK, "ลบผู้ใช้สำเร็จ");
        } else {
            return new ResponseAPI(HttpStatus.BAD_REQUEST, "ไม่พบผู้ใช้ดังกล่าว: " + userId);
        }
    }

    public List<Users> getAllUser() {
        return usersRepository.findAll();
    }

}
