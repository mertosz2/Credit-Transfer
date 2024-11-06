package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.DepartmentRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.Department;
import com.example.credittransfer.exception.ExistByDepartmentNameException;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public ResponseAPI createDepartment(DepartmentRequest request) {
        if(departmentRepository.existsDepartmentByDepartmentName(request.getDepartmentName())){
            throw new ExistByDepartmentNameException(request.getDepartmentName());
        }
        Department department = new Department();
        department.setDepartmentName(request.getDepartmentName());
        departmentRepository.save(department);

        return new ResponseAPI(HttpStatus.CREATED, "สร้างหน่วยงานสำเร็จ");

    }

    @Transactional
    public ResponseAPI editDepartment(Integer departmentId, DepartmentRequest request) {
        Department department = departmentRepository.findById(departmentId).orElseThrow();
        if(departmentRepository.existsDepartmentByDepartmentName(request.getDepartmentName())
            && !Objects.equals(department.getDepartmentName(), request.getDepartmentName())){
            throw new ExistByDepartmentNameException(request.getDepartmentName());
        }
        department.setDepartmentName(request.getDepartmentName());
        departmentRepository.save(department);

        return new ResponseAPI(HttpStatus.OK, "สร้างหน่วยงานสำเร็จ");
    }

    public ResponseAPI deleteDepartment(Integer departmentId) {
        Optional<Department> departmentOptional = departmentRepository.findById(departmentId);
        if(departmentOptional.isPresent()) {
            departmentRepository.deleteById(departmentOptional.get().getDepartmentId());
            return new ResponseAPI(HttpStatus.OK, "ลบสำเร็จ");
        }
        return new ResponseAPI(HttpStatus.BAD_REQUEST, "ลบไม่สำเร็จ");
    }

    public List<DropDown> getDepartmentDropdown() {
        return departmentRepository.getDepartmentDropdown();
    }
}
