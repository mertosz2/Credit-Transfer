package com.example.credittransfer.repository;

import com.example.credittransfer.entity.Roles;
import com.example.credittransfer.projection.DropDown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Integer> {

    @Query("select r.rolesId as id, r.roleName as label from Roles r")
    List<DropDown> getRoleDropdown();
}
