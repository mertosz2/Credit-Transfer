package com.example.credittransfer.repository;

import com.example.credittransfer.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUsername(String username);

    @Query("select case when count(u) > 0 then true else false end from Users u where u.firstName =:firstName and u.lastName =:lastName and u.isActive = true ")
    boolean existsByFirstNameAndLastName(String firstName, String lastName);

    @Query("select case when count(u) > 0 then true else false end from Users u where u.username =:username and u.isActive = true ")
    boolean existsByUsername(String username);

    @Query("select case when count(u) > 0 then true else false end from Users u where u.phone =:phone and u.isActive = true")
    boolean existsByPhone(String phone);

    @Modifying
    @Query("update Users u set u.isActive = false where u.usersId =:userId")
    void deleteUsersByUsersId(Integer userId);

}
