package com.example.credittransfer.repository;

import com.example.credittransfer.entity.Department;
import com.example.credittransfer.projection.DropDown;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

    @Query("select case when count(d) > 0 then true else false end from Department d where d.departmentName =:departmentName")
    boolean existsDepartmentByDepartmentName(String departmentName);

    @Query("select d.departmentId as id, d.departmentName as value, d.departmentName as label from Department d")
    List<DropDown> getDepartmentDropdown();

    @Query("SELECT d FROM Department d WHERE " +
            "(:departmentName IS NULL OR d.departmentName LIKE %:departmentName%)")
    Page<Department> getDepartmentData(Pageable pageable, @Param("departmentName") String departmentName);
}
